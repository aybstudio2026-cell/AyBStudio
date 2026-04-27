import { FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-studio-text-title text-white pt-10 pb-6 border-t border-studio-border/10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          
          {/* Columna 1: Logo */}
          <div className="flex items-center md:items-start justify-center md:justify-start">
            <Link to="/" className="flex flex-col items-start leading-none group">
              <span className="text-5xl font-black text-white tracking-tighter uppercase transition-transform group-hover:scale-105">
                A<span className="text-studio-primary">&</span>B
              </span>
              <span className="text-sm font-bold text-white/50 tracking-[0.4em] uppercase ml-2">
                Studio
              </span>
            </Link>
          </div>

          {/* Columna 2: Misión */}
          <div className="space-y-3">
            <h4 className="text-studio-primary font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
              Misión <div className="h-[1px] w-6 bg-studio-primary/30"></div>
            </h4>
            <p className="text-studio-secondary text-xs leading-relaxed font-medium">
              Potenciar a creadores digitales con herramientas de alta calidad y diseño profesional.
            </p>
          </div>

          {/* Columna 3: Visión */}
          <div className="space-y-3">
            <h4 className="text-studio-primary font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
              Visión <div className="h-[1px] w-6 bg-studio-primary/30"></div>
            </h4>
            <p className="text-studio-secondary text-xs leading-relaxed font-medium">
              Ser el estudio referente donde la innovación y el minimalismo convergen para crear activos únicos.
            </p>
          </div>

          {/* Columna 4: Síguenos */}
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-[0.2em]">
              Síguenos
            </h4>
            <div className="flex gap-3">
              {[
                { icon: <FaTiktok size={18} />, href: "#" },
                { icon: <FaYoutube size={18} />, href: "#" },
                { icon: <FaInstagram size={18} />, href: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="w-9 h-9 bg-white/5 hover:bg-studio-primary/20 rounded-lg flex items-center justify-center transition-all text-white/40 hover:text-studio-primary border border-white/10 hover:border-studio-primary/30"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/5 mb-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <nav>
            <ul className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/tienda" className="hover:text-white transition-colors">Productos</Link>
              </li>
            </ul>
          </nav>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
            © 2026 A&B Studio.
          </p>
        </div>

      </div>
    </footer>
  );
}