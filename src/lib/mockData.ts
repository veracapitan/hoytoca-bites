import review1 from "@/assets/review-1.jpg";
import review2 from "@/assets/review-2.jpg";
import review3 from "@/assets/review-3.jpg";
import review4 from "@/assets/review-4.jpg";

export interface Review {
  id: string;
  name: string;
  slug: string;
  reviewText: string;
  city: string;
  foodTypes: string[];
  visitDate: string;
  images: string[];
  videos: string[];
  googleMapsUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

export const mockReviews: Review[] = [
  {
    id: "1",
    name: "La Buena Vida",
    slug: "la-buena-vida",
    reviewText: "Un brunch espectacular en pleno centro. El tostón de aguacate con huevo poché está increíble, y el ambiente es súper acogedor. Perfecto para ir con amigas un domingo por la mañana. Los zumos naturales son otro nivel. ¡Repetiré seguro!",
    city: "Madrid",
    foodTypes: ["Brunch", "Cafetería"],
    visitDate: "2025-12-15",
    images: [review1],
    videos: [],
    googleMapsUrl: "https://maps.google.com",
    instagramUrl: "https://instagram.com",
  },
  {
    id: "2",
    name: "Taberna El Rincón",
    slug: "taberna-el-rincon",
    reviewText: "Si buscas tapas de toda la vida pero con un toque moderno, este es tu sitio. El ambiente es súper íntimo, con luz tenue y música suave. Las croquetas de jamón ibérico son las mejores que he probado. El vino de la casa también merece mucho la pena.",
    city: "Barcelona",
    foodTypes: ["Tapas", "Restaurante"],
    visitDate: "2025-11-28",
    images: [review2],
    videos: [],
    googleMapsUrl: "https://maps.google.com",
  },
  {
    id: "3",
    name: "Dulce Tentación",
    slug: "dulce-tentacion",
    reviewText: "La tarta de chocolate con frutos rojos es una obra de arte. Todo está hecho artesanalmente y se nota en cada bocado. El local es pequeñito pero precioso. Ideal para una merienda especial o para llevar algo dulce a casa.",
    city: "Valencia",
    foodTypes: ["Postres", "Cafetería"],
    visitDate: "2025-10-20",
    images: [review3],
    videos: [],
    instagramUrl: "https://instagram.com",
  },
  {
    id: "4",
    name: "Cóctel & Co",
    slug: "coctel-and-co",
    reviewText: "El mejor bar de cócteles que he visitado últimamente. La carta es creativa y el bartender te prepara bebidas personalizadas. El ambiente es vibrante y la decoración es preciosa. Perfecto para una noche especial.",
    city: "Madrid",
    foodTypes: ["Bar", "Cócteles"],
    visitDate: "2025-09-10",
    images: [review4],
    videos: [],
    googleMapsUrl: "https://maps.google.com",
    tiktokUrl: "https://tiktok.com",
  },
];

export const allCities = [...new Set(mockReviews.map(r => r.city))];
export const allFoodTypes = [...new Set(mockReviews.flatMap(r => r.foodTypes))];
