import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.26 8.26 0 004.76 1.51v-3.4a4.85 4.85 0 01-1-.18z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link to="/" className="font-display text-2xl font-bold">hoytoca</Link>
            <p className="text-primary-foreground/70 text-sm mt-1">Recomendaciones gastronómicas con cariño ♥</p>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Inicio</Link>
            <Link to="/resenas" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Reseñas</Link>
            <Link to="/sobre-mi" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Sobre mí</Link>
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/hoytoca" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://tiktok.com/@hoytoca" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <TikTokIcon />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} hoytoca. Hecho con mucho amor y buena comida.
        </div>
      </div>
    </footer>
  );
}
