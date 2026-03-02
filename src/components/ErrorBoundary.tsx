import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Algo ha fallado</h1>
            <p className="text-muted-foreground mb-6">
              No se pudo cargar esta página. Prueba a volver al listado.
            </p>
            <Link
              to="/resenas"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90"
            >
              Volver a reseñas
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
