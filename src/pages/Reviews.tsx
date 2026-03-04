import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ReviewCard from "@/components/ReviewCard";
import { useReviews } from "@/hooks/useReviews";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "all";

export default function Reviews() {
  const [cityFilter, setCityFilter] = useState("");
  const [foodFilter, setFoodFilter] = useState("");
  const { data: reviews = [], isLoading, error } = useReviews();

  const { filtered, allCities, allFoodTypes } = useMemo(() => {
    const cities = [...new Set(reviews.map(r => r.city))];
    const foodTypes = [...new Set(reviews.flatMap(r => r.foodTypes))];
    const filteredList = reviews.filter(r => {
      if (cityFilter && r.city !== cityFilter) return false;
      if (foodFilter && !r.foodTypes.includes(foodFilter)) return false;
      return true;
    });
    return { filtered: filteredList, allCities: cities, allFoodTypes: foodTypes };
  }, [reviews, cityFilter, foodFilter]);

  return (
    <Layout>
      <section className="py-12">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">Reseñas</h1>
            <p className="text-muted-foreground mb-8">Todos los sitios que he probado y recomiendo.</p>
          </motion.div>

          {/* Filters */}
          <div className="mb-10 rounded-2xl border border-border bg-muted/40 px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Filtros
              </span>
              {(cityFilter || foodFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setCityFilter("");
                    setFoodFilter("");
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  <X className="h-3 w-3" />
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex flex-1 flex-wrap gap-3">
              <div className="w-full sm:w-56">
                <Select
                  value={cityFilter || ALL}
                  onValueChange={(v) => setCityFilter(v === ALL ? "" : v)}
                >
                  <SelectTrigger className="rounded-full bg-card/90 shadow-sm">
                    <SelectValue placeholder="Todas las ciudades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Todas las ciudades</SelectItem>
                    {allCities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-56">
                <Select
                  value={foodFilter || ALL}
                  onValueChange={(v) => setFoodFilter(v === ALL ? "" : v)}
                >
                  <SelectTrigger className="rounded-full bg-card/90 shadow-sm">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Todos los tipos</SelectItem>
                    {allFoodTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-center py-20">Cargando reseñas...</p>
          ) : error ? (
            <p className="text-destructive text-center py-20">Error al cargar las reseñas. Comprueba la conexión a Supabase.</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-20">No hay reseñas con esos filtros.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
