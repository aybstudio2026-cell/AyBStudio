import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiHeart, FiPackage, FiZap, FiCheckCircle, FiCheck } from 'react-icons/fi'; 
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../supabaseClient';
import CoinPurchaseModal from '../modals/CoinPurchaseModal';

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const isDownloadable = product.product_types?.name?.toLowerCase().includes('descargable');
  const isInCart = cart.some(item => item.id === product.id);

  // Lógica de los 4 casos de precio
  const hasUSD = product.price > 0;
  const hasCoins = product.price_coins > 0;
  const isFree = product.price === 0 && (!product.price_coins || product.price_coins === 0);

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

  // Función de compra rápida con monedas
  const handleCoinPurchase = async () => {
    setIsPurchasing(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Inicia sesión para comprar con monedas");
      setIsPurchasing(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('process_coin_purchase', {
        p_product_id: product.id,
        p_user_id: user.id
      });

      if (error || !data.success) throw new Error(data?.message || "Error en la compra");

      setHasPurchased(true);
      setShowCoinModal(false);
      navigate('/inventario');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const renderPriceBadge = () => {
    if (isFree) return <span className="text-sm font-black uppercase tracking-widest italic">FREE</span>;
    
    return (
      <div className="flex flex-col items-center leading-none gap-1">
        {hasUSD && <span className="text-sm font-black">${product.price}</span>}
        {hasCoins && (
          <span className={`font-black flex items-center gap-1 ${hasUSD ? 'text-[9px] opacity-80 border-t border-white/20 mt-1 pt-1' : 'text-sm'}`}>
            <FiZap size={hasUSD ? 9 : 14} fill="currentColor" /> {product.price_coins}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
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
                {renderPriceBadge()}
              </div>
              
              <div className="flex justify-end p-3">
                <button 
                  onClick={toggleFavorite}
                  style={{ backgroundColor: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.9)' }}
                  className="p-2.5 rounded-full shadow-lg transition-all active:scale-90 flex items-center justify-center z-30"
                >
                  <FiHeart size={16} style={{ color: isFavorite ? 'white' : '#9ca3af', fill: isFavorite ? 'white' : 'none' }} />
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

          <div className="mt-auto flex flex-col gap-3">
            {hasPurchased ? (
              <Link to="/inventario" className="w-full bg-studio-text-title text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <FiPackage /> Ver Inventario
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Link to={`/producto/${product.id}`} className="flex-[2] bg-studio-bg text-studio-text-title font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center">
                    Detalles
                  </Link>
                  
                  {/* Carrito (Solo si hay precio USD o es 0/0) */}
                  {(hasUSD || isFree) && (
                    <button 
                      onClick={() => addToCart(product)} 
                      disabled={isDownloadable && isInCart}
                      className={`flex-1 py-4 rounded-2xl flex items-center justify-center transition-all ${
                        isDownloadable && isInCart 
                        ? 'bg-gray-100 text-studio-secondary/40 cursor-not-allowed' 
                        : 'bg-studio-text-title text-white hover:bg-studio-primary active:scale-95 shadow-md'
                      }`}
                    >
                      {isDownloadable && isInCart ? <FiCheckCircle size={22} /> : <FiPlus size={22} />}
                    </button>
                  )}
                </div>

                {/* Botón de Monedas (Solo si tiene precio_coins > 0) */}
                {hasCoins && (
                  <button 
                    onClick={() => setShowCoinModal(true)}
                    className="w-full border-2 border-studio-primary/20 text-studio-primary font-black py-3 rounded-2xl text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-studio-primary hover:text-white transition-all shadow-sm"
                  >
                    <FiZap fill="currentColor" size={12} /> Canjear {product.price_coins} Coins
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <CoinPurchaseModal 
        isOpen={showCoinModal} 
        onClose={() => setShowCoinModal(false)} 
        product={product} 
        onConfirm={handleCoinPurchase} 
        loading={isPurchasing} 
      />
    </>
  );
}