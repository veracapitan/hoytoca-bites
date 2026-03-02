import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import aboutPhoto from "@/assets/about-photo.jpg";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.26 8.26 0 004.76 1.51v-3.4a4.85 4.85 0 01-1-.18z" />
  </svg>
);

export default function About() {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img src={aboutPhoto} alt="Sobre mí" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-sm font-medium text-primary mb-2">Sobre mí</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                La persona detrás de hoytoca
              </h1>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  ¡Hola! Tengo 24 años y soy una apasionada de la comida. Hoytoca nació como un hobby para compartir
                  de forma sincera y cercana mis descubrimientos gastronómicos.
                </p>
                <p>
                  No soy crítica gastronómica ni pretendo serlo. Simplemente me encanta probar sitios nuevos,
                  disfrutar de una buena comida y contarte mi experiencia real para que tú también puedas disfrutarla.
                </p>
                <p>
                  Aquí encontrarás recomendaciones honestas de restaurantes, bares, cafeterías y mucho más.
                  Todo lo que comparto lo he vivido y probado yo misma. ¡Espero que te sirva!
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <a
                  href="https://instagram.com/hoytoca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
                <a
                  href="https://tiktok.com/@hoytoca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <TikTokIcon /> TikTok
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
