import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ReviewCard from "@/components/ReviewCard";
import { mockReviews, allCities, allFoodTypes } from "@/lib/mockData";

export default function Reviews() {
  const [cityFilter, setCityFilter] = useState("");
  const [foodFilter, setFoodFilter] = useState("");

  const filtered = useMemo(() => {
    return mockReviews.filter(r => {
      if (cityFilter && r.city !== cityFilter) return false;
      if (foodFilter && !r.foodTypes.includes(foodFilter)) return false;
      return true;
    });
  }, [cityFilter, foodFilter]);

  return (
    <Layout>
      <section className="py-12">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">Reseñas</h1>
            <p className="text-muted-foreground mb-8">Todos los sitios que he probado y recomiendo.</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="bg-card border border-border rounded-full px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Todas las ciudades</option>
              {allCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={foodFilter}
              onChange={e => setFoodFilter(e.target.value)}
              className="bg-card border border-border rounded-full px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Todos los tipos</option>
              {allFoodTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {(cityFilter || foodFilter) && (
              <button
                onClick={() => { setCityFilter(""); setFoodFilter(""); }}
                className="text-sm text-primary hover:underline px-2"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
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
