import { Link } from "react-router-dom";
import { ArrowRight, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ReviewCard from "@/components/ReviewCard";
import { useReviews } from "@/hooks/useReviews";
import heroImage from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.26 8.26 0 004.76 1.51v-3.4a4.85 4.85 0 01-1-.18z" />
  </svg>
);

export default function Index() {
  const { data: reviews = [] } = useReviews();
  const latestReviews = reviews.slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Comida deliciosa" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-granate-gradient opacity-75" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="flex flex-col items-start gap-4 mb-4">
             
              <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
                HOYTOCA
              </h1>
            </div>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 font-body leading-relaxed">
                Pienso planazos para que tu no tengas que hacerlo
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/resenas"
                className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-full font-medium text-sm hover:bg-primary-foreground/90 transition-colors"
              >
                Ver reseñas <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/hoytoca__/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://www.tiktok.com/@hoytoca__?lang=es" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2">
                  <TikTokIcon />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest reviews */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-primary mb-1">Lo último</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Reseñas recientes
              </h2>
            </div>
            <Link to="/resenas" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestReviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/resenas" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Ver todas las reseñas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA social */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Sígueme en redes</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Más recomendaciones, vídeos y contenido diario en mis redes sociales.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/hoytoca__/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-full font-medium text-sm hover:bg-primary-foreground/90 transition-colors"
            >
              <Instagram className="h-5 w-5" /> Instagram
            </a>
            <a
              href="https://www.tiktok.com/@hoytoca__?lang=es"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3 rounded-full font-medium text-sm hover:bg-primary-foreground/10 transition-colors"
            >
              <TikTokIcon /> TikTok
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
