import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Al cambiar la ruta, mandamos el scroll al inicio (0,0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente no renderiza nada visualmente
}