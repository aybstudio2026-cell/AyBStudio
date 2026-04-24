// 1. IMPORTANTE: Agregamos useState y useEffect de React
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// 2. Agregamos FiHeart para el botón de favoritos
import { FiExternalLink, FiPlus, FiHeart } from 'react-icons/fi'; 
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
// 3. Importamos supabase para guardar los favoritos
import { supabase } from '../../supabaseClient';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  // Verificar si el producto ya está en favoritos al cargar
  useEffect(() => {
    async function checkFavorite() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('wishlist')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', user.id)
        .single();

      if (data) setIsFavorite(true);
    }
    checkFavorite();
  }, [product.id]);

  // Función para agregar/quitar de favoritos
  async function toggleFavorite() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Inicia sesión para guardar favoritos");

    if (isFavorite) {
      await supabase.from('wishlist').delete().eq('product_id', product.id).eq('user_id', user.id);
    } else {
      await supabase.from('wishlist').insert({ product_id: product.id, user_id: user.id });
    }
    setIsFavorite(!isFavorite);
  }

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-black text-panda-black shadow-sm text-sm italic">
            ${product.price}
          </div>
          {/* BOTÓN DE FAVORITOS */}
          <button 
            onClick={toggleFavorite}
            className={`p-2.5 rounded-full shadow-lg transition-all ${
              isFavorite ? 'bg-sakura-pink text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'
            }`}
          >
            <FiHeart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
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