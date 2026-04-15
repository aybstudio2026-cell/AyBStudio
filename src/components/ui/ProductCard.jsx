// src/components/ui/ProductCard.jsx
import { motion } from 'framer-motion';
import { FiExternalLink, FiPlus } from 'react-icons/fi'; // Cambiado a FiPlus para el carrito
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full"
    >
      {/* Contenedor Imagen con Aspect Ratio controlado */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-black text-panda-black shadow-sm text-sm italic">
          ${product.price}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-digital-lavender opacity-60">
            {product.categories?.name}
          </span>
          <h3 className="text-lg font-black text-panda-black leading-tight mt-1 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/producto/${product.id}`}
            className="flex-1 bg-soft-snow text-panda-black font-bold py-3 px-4 rounded-xl text-xs hover:bg-panda-black hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Detalles <FiExternalLink size={14}/>
          </Link>
          <button 
            onClick={() => addToCart(product)}
            className="aspect-square bg-panda-black text-white p-3 rounded-xl hover:bg-digital-lavender transition-all flex items-center justify-center"
            title="Añadir al carrito"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}