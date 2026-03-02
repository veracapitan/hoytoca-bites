import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, ExternalLink, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { mockReviews } from "@/lib/mockData";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.26 8.26 0 004.76 1.51v-3.4a4.85 4.85 0 01-1-.18z" />
  </svg>
);

export default function ReviewDetail() {
  const { slug } = useParams();
  const review = mockReviews.find(r => r.slug === slug);

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
            <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <img src={review.images[0]} alt={review.name} className="w-full h-full object-cover" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {review.foodTypes.map(type => (
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
                {new Date(review.visitDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <div className="prose prose-lg max-w-none mb-10">
              <p className="text-foreground leading-relaxed text-base md:text-lg">{review.reviewText}</p>
            </div>

            {/* Gallery */}
            {review.images.length > 1 && (
              <div className="grid grid-cols-2 gap-3 mb-10">
                {review.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <img src={img} alt={`${review.name} foto ${i + 2}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
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
