import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { Review } from "@/lib/mockData";

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/resenas/${review.slug}`} className="group block card-hover">
        <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={review.images[0]}
              alt={review.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {review.foodTypes.map(type => (
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
                {new Date(review.visitDate).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
