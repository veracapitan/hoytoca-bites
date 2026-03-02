import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, ExternalLink, Instagram, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useReviewBySlug } from "@/hooks/useReviews";

function DetailHeroImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted">
        <ImageOff className="h-12 w-12" />
        <span>Imagen no disponible</span>
      </div>
    );
  }
  return (
    <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setFailed(true)} />
  );
}

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.26 8.26 0 004.76 1.51v-3.4a4.85 4.85 0 01-1-.18z" />
  </svg>
);

export default function ReviewDetail() {
  const { slug: slugParam } = useParams();
  const slug = slugParam ? decodeURIComponent(slugParam) : undefined;
  const { data: review, isLoading, error } = useReviewBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Cargando reseña...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-20 text-center max-w-lg mx-auto">
          <p className="text-destructive mb-2 font-medium">Error al cargar la reseña.</p>
          <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
          <Link to="/resenas" className="text-primary hover:underline">Volver a reseñas</Link>
        </div>
      </Layout>
    );
  }

  if (!review) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Reseña no encontrada</h1>
          <Link to="/resenas" className="text-primary hover:underline">Volver a reseñas</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-8">
        <div className="container max-w-3xl">
          <Link to="/resenas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a reseñas
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Hero image */}
            {(review.images?.length ?? 0) > 0 && (
              <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8 bg-muted">
                <DetailHeroImage src={review.images[0]} alt={review.name} />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(review.foodTypes ?? []).map(type => (
                <span key={type} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {type}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">{review.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {review.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {review.visitDate
                  ? new Date(review.visitDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              </span>
            </div>

            <div className="prose prose-lg max-w-none mb-10">
              <p className="text-foreground leading-relaxed text-base md:text-lg">{review.reviewText}</p>
            </div>

            {/* Gallery */}
            {(review.images?.length ?? 0) > 1 && (
              <div className="grid grid-cols-2 gap-3 mb-10">
                {review.images!.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <DetailHeroImage src={img} alt={`${review.name} foto ${i + 2}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Vídeos */}
            {(review.videos?.length ?? 0) > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-foreground mb-3">Vídeos</h3>
                <div className="flex flex-wrap gap-2">
                  {review.videos!.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" /> Ver vídeo {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
              {review.googleMapsUrl && (
                <a href={review.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <ExternalLink className="h-4 w-4" /> Google Maps
                </a>
              )}
              {review.instagramUrl && (
                <a href={review.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              )}
              {review.tiktokUrl && (
                <a href={review.tiktokUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <TikTokIcon /> TikTok
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
}
