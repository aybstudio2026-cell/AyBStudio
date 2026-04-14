import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaWindows, FaApple, FaLinux, FaGlobe } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const renderPlatformIcon = (platform) => {
    if (!platform) return null;
    const p = platform.toLowerCase();
    if (p.includes('win')) return <FaWindows key={p} className="w-3.5 h-3.5" title="Windows" />;
    if (p.includes('mac') || p.includes('apple')) return <FaApple key={p} className="w-3.5 h-3.5" title="MacOS" />;
    if (p.includes('linux')) return <FaLinux key={p} className="w-3.5 h-3.5" title="Linux" />;
    if (p.includes('web')) return <FaGlobe key={p} className="w-3.5 h-3.5" title="Web" />;
    return null;
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group bg-white rounded-kawaii overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img 
          src={product.image_url} // Nombre de columna en la DB
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-black text-panda-black shadow-sm text-sm">
          ${product.price}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-digital-lavender">
            {product.categories?.name} {/* Acceso a la relación */}
          </span>
          <h3 className="text-xl font-bold text-panda-black group-hover:text-digital-lavender transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex gap-2 text-gray-400">
             {/* Renderizamos iconos basado en el nombre del Tipo */}
             {product.product_types?.name.split('/').map(p => renderPlatformIcon(p.trim()))}
          </div>
        </div>

        <Link 
          to={`/producto/${product.id}`}
          className="w-full bg-soft-snow border border-gray-200 text-panda-black font-bold py-3 rounded-xl group-hover:bg-panda-black group-hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Ver Detalles
          <FiExternalLink className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => addToCart(product)}
          className="bg-panda-black text-white p-3 rounded-xl hover:bg-digital-lavender transition-all"
        >
          Añadir al carrito
        </button>
      </div>
    </motion.div>
  );
}