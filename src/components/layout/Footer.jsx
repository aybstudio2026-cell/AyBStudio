import { FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#05080a] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECCIÓN SUPERIOR: Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Identidad */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black text-xs shadow-lg">
                A&B
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 leading-none mb-1">Digital Products</p>
                <h3 className="font-black text-xl tracking-tighter uppercase leading-none">Studio</h3>
              </div>
            </div>
          </div>

          {/* Columna 2: Misión */}
          <div className="space-y-4">
            <h4 className="text-[#ffcc00] font-black uppercase text-sm tracking-widest flex items-center gap-2">
              Misión <div className="h-[1px] w-12 bg-white/20"></div>
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">
              Potenciar a creadores digitales con herramientas y recursos de alta calidad, simplificando la tecnología con diseño minimalista.
            </p>
          </div>

          {/* Columna 3: Visión */}
          <div className="space-y-4">
            <h4 className="text-[#ffcc00] font-black uppercase text-sm tracking-widest flex items-center gap-2">
              Visión <div className="h-[1px] w-12 bg-white/20"></div>
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">
              Ser el estudio referente en el ecosistema digital, donde la innovación y el estilo kawaii convergen para crear productos únicos.
            </p>
          </div>

          {/* Columna 4: Síguenos (Redes) */}
          <div className="space-y-4">
            <h4 className="text-[#ffcc00] font-black uppercase text-sm tracking-widest">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all text-white/60 hover:text-white border border-white/10">
                <FaTiktok size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all text-white/60 hover:text-white border border-white/10">
                <FaYoutube size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all text-white/60 hover:text-white border border-white/10">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* LÍNEA DIVISORIA */}
        <div className="w-full h-[1px] bg-white/10 mb-8"></div>

        {/* SECCIÓN INFERIOR: Links y Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <nav>
            <ul className="flex flex-wrap gap-6 text-[11px] font-bold uppercase tracking-widest text-white/40">
              <li><Link to="/" className="hover:text-[#ffcc00] transition-colors">Inicio</Link></li>
              <li><a href="#" className="hover:text-[#ffcc00] transition-colors">Productos</a></li>
              <li><Link to="/terminos" className="hover:text-[#ffcc00] transition-colors">Términos</Link></li>
              <li><Link to="/privacidad" className="hover:text-[#ffcc00] transition-colors">Privacidad</Link></li>
            </ul>
          </nav>

          <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">
            © 2026 A&B Studio.
          </p>
        </div>

      </div>
    </footer>
  );
}