import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ImageOff, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Review } from "@/lib/mockData";

interface ReviewCardProps {
  review: Review;
  index?: number;
}

function CardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground text-sm bg-muted">
        <ImageOff className="h-8 w-8" />
        <span>Imagen no disponible</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/resenas/${encodeURIComponent(review.slug ?? "")}`}
        className="group block card-hover cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {review.images?.[0] ? (
              <CardImage src={review.images[0]} alt={review.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
            )}
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {(review.foodTypes ?? []).map(type => (
                <span key={type} className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {type}
                </span>
              ))}
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {review.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {review.reviewText}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {review.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {review.visitDate ? new Date(review.visitDate).toLocaleDateString("es-ES", { month: "short", year: "numeric" }) : "—"}
              </span>
            </div>
            <p className="text-xs font-medium text-primary mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
              Ver toda la info <ChevronRight className="h-3.5 w-3.5" />
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
