import { motion } from 'framer-motion';
import { FiPlus, FiHeart, FiPackage, FiZap, FiCheckCircle } from 'react-icons/fi'; 
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CoinPurchaseModal from '../modals/CoinPurchaseModal';
import { useProductCardLogic } from '../../hooks/useProductCardLogic';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  
  const {
    isFavorite, hasPurchased, showCoinModal, setShowCoinModal, isPurchasing,
    isInCart, isDownloadable, isFree, hasUSD, hasCoins,
    toggleFavorite, handleCoinPurchase
  } = useProductCardLogic(product, cart, navigate);

  const renderPriceBadge = () => {
    if (isFree) return <span className="text-[8px] md:text-sm font-black uppercase italic tracking-tighter">FREE</span>;
    return (
      <div className="flex flex-col items-center leading-none gap-0.5">
        {hasUSD && <span className="text-[10px] md:text-sm font-black">${product.price}</span>}
        {hasCoins && (
          <span className={`font-black flex items-center gap-0.5 ${hasUSD ? 'text-[6px] md:text-[8px] opacity-60 border-t border-white/20 mt-1 pt-1' : 'text-[10px] md:text-sm'}`}>
            <FiZap size={hasUSD ? 6 : 10} fill="currentColor" /> {product.price_coins}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-2 md:p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full relative overflow-hidden"
      >
        {/* --- CONTENEDOR DE IMAGEN --- */}
        <div className="relative aspect-square rounded-[1rem] md:rounded-[2rem] overflow-hidden bg-studio-bg mb-2 md:mb-5 border border-gray-50">
          <Link to={`/producto/${product.id}`} className="block w-full h-full">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </Link>

          {!hasPurchased && (
            <div className="absolute top-0 right-0 z-20">
              <div className="bg-gradient-to-br from-studio-primary/90 to-studio-text-title text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-bl-[1.2rem] md:rounded-bl-[1.5rem] shadow-md flex flex-col items-center backdrop-blur-sm">
                {renderPriceBadge()}
              </div>
              
              <div className="flex justify-end p-2 md:p-3">
                <button 
                  onClick={toggleFavorite}
                  className={`p-1.5 md:p-2.5 rounded-full shadow-lg transition-all active:scale-90 flex items-center justify-center z-30 ${isFavorite ? 'bg-red-500' : 'bg-white/90'}`}
                >
                  <FiHeart size={12} className={`${isFavorite ? 'text-white fill-white' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- DETALLES --- */}
        <div className="px-1 md:px-2 pb-1 md:pb-2 flex flex-col flex-1">
          <span className="text-[7px] md:text-[9px] font-black text-studio-primary uppercase tracking-[0.2em] mb-1 flex items-center gap-1 opacity-70">
            <FiZap size={8} /> {product.product_types?.name}
          </span>
          <h3 className="text-[10px] md:text-sm font-bold text-studio-text-title leading-tight mb-4 md:mb-6 line-clamp-2 uppercase tracking-tight">
            {product.name}
          </h3>

          <div className="mt-auto space-y-1.5 md:space-y-2">
            {hasPurchased ? (
              <Link to="/inventario" className="w-full bg-studio-text-title text-white font-black py-2.5 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-studio-primary transition-all">
                <FiPackage size={12} /> Inventario
              </Link>
            ) : (
              <>
                {/* FILA 1: DETALLES + CARRITO (Si hay USD) */}
                <div className="flex gap-1.5 md:gap-2">
                  <Link 
                    to={`/producto/${product.id}`} 
                    className={`bg-studio-bg text-studio-text-title font-black py-2.5 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] uppercase tracking-widest flex items-center justify-center transition-all hover:bg-studio-border 
                      ${(hasUSD || isFree) ? 'flex-[2.5]' : 'w-full'}`}
                  >
                    Detalles
                  </Link>
                  
                  {(hasUSD || isFree) && (
                    <button 
                      onClick={() => addToCart(product)} 
                      disabled={isDownloadable && isInCart}
                      className={`flex-1 py-2.5 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                        isDownloadable && isInCart 
                        ? 'bg-gray-100 text-studio-secondary/40 cursor-not-allowed' 
                        : 'bg-studio-text-title text-white hover:bg-studio-primary active:scale-95 shadow-md'
                      }`}
                    >
                      {isDownloadable && isInCart ? <FiCheckCircle size={16} /> : <FiPlus size={16} />}
                    </button>
                  )}
                </div>

                {/* FILA 2: CANJEAR COINS (Si hay Coins) */}
                {hasCoins && (
                  <button 
                    onClick={() => setShowCoinModal(true)}
                    className="w-full border-2 border-studio-primary/20 text-studio-primary font-black py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] uppercase tracking-[0.1em] flex items-center justify-center gap-1.5 hover:bg-studio-primary hover:text-white transition-all shadow-sm group/coin"
                  >
                    <FiZap className="group-hover/coin:fill-white" size={10} /> CANJEAR {product.price_coins} COINS
                  </button>
                )}
              </>
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