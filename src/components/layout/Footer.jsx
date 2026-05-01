import { FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-studio-text-title text-white pt-8 pb-6 border-t border-studio-border/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- GRID PRINCIPAL --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 items-start">
          
          {/* Columna 1: Logo - Agrandado en móvil */}
          <div className="flex flex-col items-start justify-start leading-none">
            <Link to="/" className="group">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase transition-transform group-hover:scale-105">
                A<span className="text-studio-primary">&</span>B
              </span>
              <br />
              <span className="text-[11px] md:text-sm font-bold text-white/50 tracking-[0.4em] uppercase ml-1 md:ml-2">
                Studio
              </span>
            </Link>
          </div>

          {/* Columna 2: Misión (Oculto en móvil) */}
          <div className="hidden md:block space-y-3">
            <h4 className="text-studio-primary font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
              Misión <div className="h-[1px] w-6 bg-studio-primary/30"></div>
            </h4>
            <p className="text-studio-secondary text-xs leading-relaxed font-medium">
              Potenciar a creadores digitales con herramientas de alta calidad y diseño profesional.
            </p>
          </div>

          {/* Columna 3: Visión (Oculto en móvil) */}
          <div className="hidden md:block space-y-3">
            <h4 className="text-studio-primary font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
              Visión <div className="h-[1px] w-6 bg-studio-primary/30"></div>
            </h4>
            <p className="text-studio-secondary text-xs leading-relaxed font-medium">
              Ser el estudio referente donde la innovación y el minimalismo convergen para crear activos únicos.
            </p>
          </div>

          {/* Columna 4: Síguenos - Alineado con el logo */}
          <div className="flex flex-col items-end md:items-start justify-start space-y-3">
            <h4 className="text-white font-bold uppercase text-[10px] md:text-[11px] tracking-[0.2em] opacity-50 md:opacity-100">
              Síguenos
            </h4>
            <div className="flex gap-2 md:gap-3">
              {[
                { icon: <FaTiktok />, href: "#" },
                { icon: <FaYoutube />, href: "#" },
                { icon: <FaInstagram />, href: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="w-8 h-8 md:w-9 md:h-9 bg-white/5 hover:bg-studio-primary/20 rounded-lg flex items-center justify-center transition-all text-white/40 hover:text-studio-primary border border-white/10 hover:border-studio-primary/30 text-sm md:text-base"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separador - Espacio reducido */}
        <div className="w-full h-[1px] bg-white/5 mb-6"></div>

        {/* --- FILA INFERIOR: Enlaces izquierda, Copy derecha (Incluso en móvil) --- */}
        <div className="flex flex-row justify-between items-center gap-2">
          <nav>
            <ul className="flex flex-row gap-3 md:gap-8 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/tienda" className="hover:text-white transition-colors">Tienda</Link></li>
              <li><Link to="/tools" className="hover:text-white transition-colors">Tools</Link></li>
              <li className="hidden xs:block"><Link to="/soporte" className="hover:text-white transition-colors">Soporte</Link></li>
            </ul>
          </nav>
          <p className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">
            © 2026 A&B Studio.
          </p>
        </div>

      </div>
    </footer>
  );
}