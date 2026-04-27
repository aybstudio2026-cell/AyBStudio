import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiHeart, FiPackage, FiZap, FiCheckCircle } from 'react-icons/fi'; 
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../supabaseClient';

export default function ProductCard({ product }) {
  // 1. Extraemos 'cart' para verificar existencia
  const { addToCart, cart } = useCart();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // 2. Identificamos si es descargable y si ya está en el carrito
  const isDownloadable = product.product_types?.name?.toLowerCase().includes('descargable');
  const isInCart = cart.some(item => item.id === product.id);

  useEffect(() => {
    async function initProduct() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: fav } = await supabase
        .from('wishlist')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fav) setIsFavorite(true);

      if (isDownloadable) {
        const { data: order } = await supabase
          .from('order_items')
          .select('id, orders!inner(status)')
          .eq('product_id', product.id)
          .eq('orders.user_id', user.id)
          .eq('orders.status', 'completed')
          .maybeSingle();
        
        if (order) setHasPurchased(true);
      }
    }

    initProduct();
  }, [product.id, isDownloadable]);

  async function toggleFavorite(e) {
    e.preventDefault();
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
      className="group bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full relative"
    >
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-studio-bg mb-6 border border-gray-50">
        <Link to={`/producto/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer" 
          />
        </Link>

        {!hasPurchased && (
          <div className="absolute top-0 right-0 z-20">
            <div className="bg-gradient-to-br from-studio-primary to-studio-text-title text-white px-5 py-2.5 rounded-bl-[1.5rem] shadow-md flex flex-col items-center">
              <span className="text-sm font-black">${product.price}</span>
            </div>
            
            <div className="flex justify-end p-3">
              <button 
                onClick={toggleFavorite}
                style={{ backgroundColor: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.9)' }}
                className="p-2.5 rounded-full shadow-lg transition-all active:scale-90 flex items-center justify-center z-30"
              >
                <FiHeart 
                  size={16} 
                  style={{ 
                    color: isFavorite ? 'white' : '#9ca3af',
                    fill: isFavorite ? 'white' : 'none' 
                  }} 
                />
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-5 right-6 opacity-20 pointer-events-none select-none italic font-black text-xl text-studio-text-title scale-75 origin-bottom-right">
          A<span className="text-studio-primary">&</span>B <span className="text-[8px] uppercase tracking-[0.3em] font-bold not-italic">Studio</span>
        </div>
      </div>

      <div className="px-3 pb-4 flex flex-col flex-1">
        <span className="text-[9px] font-black text-studio-primary uppercase tracking-widest mb-2 flex items-center gap-1">
          <FiZap size={10} /> {product.product_types?.name}
        </span>
        <h3 className="text-lg font-bold text-studio-text-title leading-tight mb-6 line-clamp-2">{product.name}</h3>

        <div className="mt-auto flex gap-3">
          {hasPurchased ? (
            <Link to="/inventario" className="w-full bg-studio-text-title text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <FiPackage /> Ver Inventario
            </Link>
          ) : (
            <>
              <Link to={`/producto/${product.id}`} className="flex-[2.5] bg-studio-bg text-studio-text-title font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center">
                Detalles
              </Link>
              
              {/* LÓGICA DE BOTÓN DE CARRITO */}
              {isDownloadable && isInCart ? (
                <button 
                  disabled 
                  className="flex-1 bg-gray-100 text-studio-secondary/40 py-4 rounded-2xl flex items-center justify-center cursor-not-allowed"
                  title="Ya en el carrito"
                >
                  <FiCheckCircle size={22} />
                </button>
              ) : (
                <button 
                  onClick={() => addToCart(product)} 
                  className="flex-1 bg-studio-text-title text-white py-4 rounded-2xl flex items-center justify-center hover:bg-studio-primary shadow-md transition-all active:scale-95"
                >
                  <FiPlus size={22} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}