import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Loader2 } from "lucide-react";
import type { Review } from "@/lib/mockData";
import { fetchReviews } from "@/hooks/useReviews";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const BUCKET = "restaurant-images";

const initialForm = {
  name: "",
  slug: "",
  review_text: "",
  city: "",
  food_types: "",
  visit_date: "",
  images: "", // URLs adicionales opcionales
  videos: "",
  google_maps_url: "",
  instagram_url: "",
  tiktok_url: "",
};

export default function Admin() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [imageFiles]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchReviews()
      .then((data) => {
        if (!cancelled) setReviews(data);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }));
  };

  const ensureBucket = async () => {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error && error.message !== "The resource already exists") {
      console.warn("Bucket creation:", error.message);
    }
  };

  const uploadImages = async (slug: string): Promise<string[]> => {
    const urls: string[] = [];
    const prefix = `${slug}/${Date.now()}`;
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgress(`Subiendo foto ${i + 1}/${imageFiles.length}…`);
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${prefix}_${i}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setUploadProgress(null);
    return urls;
  };

  const uploadVideos = async (slug: string): Promise<string[]> => {
    if (!videoFiles.length) return [];
    const urls: string[] = [];
    const prefix = `${slug}/videos/${Date.now()}`;
    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      setUploadProgress(`Subiendo vídeo ${i + 1}/${videoFiles.length}…`);
      const ext = file.name.split(".").pop() || "mp4";
      const path = `${prefix}_${i}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setUploadProgress(null);
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const slug = form.slug.trim() || slugify(form.name);
    if (!imageFiles.length) {
      toast.error("Añade al menos una foto del restaurante.");
      return;
    }
    setSubmitting(true);
    try {
      await ensureBucket();
      const uploadedUrls = await uploadImages(slug);
      const uploadedVideoUrls = await uploadVideos(slug);
      const extraUrls = form.images
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const allImages = [...uploadedUrls, ...extraUrls];
      const extraVideoUrls = form.videos
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const allVideos = [...uploadedVideoUrls, ...extraVideoUrls];

      const row: TablesInsert<"reviews"> = {
        name: form.name.trim(),
        slug,
        review_text: form.review_text.trim(),
        city: form.city.trim(),
        food_types: form.food_types
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        visit_date: form.visit_date,
        images: allImages,
        videos: allVideos,
        google_maps_url: form.google_maps_url.trim() || null,
        instagram_url: form.instagram_url.trim() || null,
        tiktok_url: form.tiktok_url.trim() || null,
      };
      const { error } = await supabase.from("reviews").insert(row);
      if (error) throw error;
      toast.success("Restaurante añadido");
      setForm(initialForm);
      setImageFiles([]);
      setVideoFiles([]);
      const data = await fetchReviews();
      setReviews(data);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      if (msg.toLowerCase().includes("bucket") && msg.toLowerCase().includes("not found")) {
        toast.error(
          "Falta crear el bucket de fotos. En Supabase: Storage → New bucket → nombre «restaurant-images», público: sí. Luego ejecuta el SQL de supabase/scripts/crear_bucket_fotos.sql para las políticas.",
          { duration: 8000 }
        );
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeletingId(id);
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Reseña eliminada");
    setReviews((prev) => prev.filter((r) => r.id !== id));
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Volver al sitio
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Panel de admin</h1>
          <p className="text-muted-foreground">Añade y gestiona tus restaurantes (reseñas).</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Añadir restaurante
            </CardTitle>
            <CardDescription>
              Sube las fotos del restaurante y rellena los datos. El slug se genera a partir del nombre. Puedes añadir más imágenes por URL si quieres.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del local *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej. La Buena Vida"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="la-buena-vida"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Madrid"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit_date">Fecha de visita *</Label>
                  <Input
                    id="visit_date"
                    type="date"
                    value={form.visit_date}
                    onChange={(e) => setForm((p) => ({ ...p, visit_date: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="food_types">Tipos de comida (separados por comas) *</Label>
                <Input
                  id="food_types"
                  value={form.food_types}
                  onChange={(e) => setForm((p) => ({ ...p, food_types: e.target.value }))}
                  placeholder="Brunch, Cafetería"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review_text">Reseña *</Label>
                <Textarea
                  id="review_text"
                  value={form.review_text}
                  onChange={(e) => setForm((p) => ({ ...p, review_text: e.target.value }))}
                  placeholder="Tu opinión del sitio..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fotos del restaurante *</Label>
                <p className="text-sm text-muted-foreground">
                  Sube una o varias fotos (JPG, PNG o WebP recomendado; mejor si pesan menos de 2 MB cada una para que carguen rápido).
                </p>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  className="cursor-pointer"
                  onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                />
                {previewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt=""
                          className="h-20 w-20 rounded object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => setImageFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center opacity-90 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-1 mt-2">
                  <Label htmlFor="images" className="text-muted-foreground font-normal text-xs">URLs adicionales (opcional, separadas por comas)</Label>
                  <Input
                    id="images"
                    value={form.images}
                    onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vídeos del restaurante (opcional)</Label>
                <p className="text-sm text-muted-foreground">
                  Puedes subir vídeos cortos (MP4, WebM, MOV) o añadir enlaces externos (YouTube, TikTok, Instagram).
                </p>
                <Input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  multiple
                  className="cursor-pointer"
                  onChange={(e) => setVideoFiles(Array.from(e.target.files ?? []))}
                />
                {videoFiles.length > 0 && (
                  <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                    {videoFiles.map((file, i) => (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setVideoFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="text-destructive hover:underline"
                        >
                          Quitar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="space-y-1 mt-2">
                  <Label htmlFor="videos" className="text-muted-foreground font-normal text-xs">
                    URLs de vídeos adicionales (opcional, separadas por comas)
                  </Label>
                  <Input
                    id="videos"
                    value={form.videos}
                    onChange={(e) => setForm((p) => ({ ...p, videos: e.target.value }))}
                    placeholder="https://youtube.com/..., https://tiktok.com/..."
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="google_maps_url">Google Maps</Label>
                  <Input
                    id="google_maps_url"
                    type="url"
                    value={form.google_maps_url}
                    onChange={(e) => setForm((p) => ({ ...p, google_maps_url: e.target.value }))}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram</Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={form.instagram_url}
                    onChange={(e) => setForm((p) => ({ ...p, instagram_url: e.target.value }))}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok_url">TikTok</Label>
                  <Input
                    id="tiktok_url"
                    type="url"
                    value={form.tiktok_url}
                    onChange={(e) => setForm((p) => ({ ...p, tiktok_url: e.target.value }))}
                    placeholder="https://tiktok.com/..."
                  />
                </div>
              </div>
              {(uploadProgress || submitting) && (
                <p className="text-sm text-muted-foreground">{uploadProgress ?? "Guardando reseña…"}</p>
              )}
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando…
                  </>
                ) : (
                  "Añadir restaurante"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restaurantes publicados</CardTitle>
            <CardDescription>Listado de reseñas. Puedes eliminar las que no quieras.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingList ? (
              <p className="text-muted-foreground py-4">Cargando…</p>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground py-4">Aún no hay ninguna reseña. Añade la primera arriba.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                  >
                    <div>
                      <span className="font-medium">{r.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">/ {r.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/resenas/${encodeURIComponent(r.slug)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Ver
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                      >
                        {deletingId === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
