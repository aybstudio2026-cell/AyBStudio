import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiShoppingBag, FiCheckCircle, 
  FiCheck, FiPackage, FiZap, FiDownloadCloud, 
  FiShield, FiStar, FiHeart, FiMonitor, FiSmartphone
} from 'react-icons/fi';
import { FaWindows, FaApple } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import ProductReviews from './ProductReviews';
import CoinPurchaseModal from '../modals/CoinPurchaseModal';
import { useProductDetailLogic } from '../../hooks/useProductDetailLogic';

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const {
    product, loading, hasPurchased, isFavorite, addedToCart, stats,
    showCoinModal, setShowCoinModal, purchasing,
    isDownloadable, isInCart, hasUSD, hasCoins, isFree,
    handleAddToCart, handleCoinPurchase, toggleFavorite
  } = useProductDetailLogic(id, navigate, addToCart, cart);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('mac') || name.includes('apple')) return <FaApple size={14} className="mr-1.5" />;
    if (name.includes('windows')) return <FaWindows size={14} className="mr-1.5" />;
    if (name.includes('movil') || name.includes('android') || name.includes('ios')) return <FiSmartphone size={14} className="mr-1.5" />;
    return <FiMonitor size={14} className="mr-1.5" />;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-studio-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-studio-bg pt-24">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-studio-secondary hover:text-studio-primary transition-colors text-sm font-medium group"
        >
          <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-28">
            <div className="relative bg-white rounded-2xl border border-studio-border overflow-hidden aspect-square shadow-flat">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                {(isDownloadable && hasPurchased) ? (
                  <span className="bg-studio-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                    <FiCheck size={12} strokeWidth={3} /> Adquirido
                  </span>
                ) : (
                  <div className="bg-studio-text-title text-white px-4 py-2 rounded-lg flex flex-col items-center shadow-lg">
                    {isFree ? (
                      <span className="text-sm font-black uppercase tracking-widest italic">FREE</span>
                    ) : (
                      <>
                        {hasUSD && <span className="text-sm font-black">${product.price}</span>}
                        {hasCoins && (
                          <span className={`font-black flex items-center gap-1 ${hasUSD ? 'text-[10px] opacity-70 border-t border-white/10 mt-1 pt-1 w-full justify-center' : 'text-sm'}`}>
                            <FiZap size={hasUSD ? 10 : 14} fill="currentColor" /> {product.price_coins}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-flat transition-all ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white text-studio-secondary hover:text-red-500'
                  }`}
                >
                  <FiHeart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="absolute bottom-4 right-4 text-studio-text-title/10 font-black text-2xl select-none pointer-events-none uppercase italic">
                A<span className="text-studio-primary/10">&</span>B
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-studio-primary/10 text-studio-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md flex items-center">
                {getCategoryIcon(product.categories?.name)}
                {product.categories?.name}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = stats.count > 0 && star <= Math.round(stats.avg);
                  return <FiStar key={star} size={14} className={isFilled ? "text-amber-400" : "text-gray-300"} fill={isFilled ? "currentColor" : "none"} />;
                })}
                <span className="text-[10px] text-studio-secondary font-black ml-1 uppercase">
                  {stats.avg > 0 ? stats.avg : "0.0"} ({stats.count} Reviews)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-studio-text-title leading-tight tracking-tight">{product.name}</h1>
              <p className="text-studio-secondary leading-relaxed">{product.description || "Diseñado para integrarse en flujos de trabajo profesionales."}</p>
            </div>

            {!(isDownloadable && hasPurchased) && (
              <div className="flex flex-col gap-2">
                {isFree ? (
                  <span className="text-5xl font-black text-studio-primary italic tracking-tighter">FREE</span>
                ) : (
                  <div className="flex flex-wrap items-end gap-6">
                    {hasUSD && (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-studio-secondary/50 uppercase tracking-widest mb-1">Precio USD</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black text-studio-text-title">${product.price}</span>
                          <span className="text-studio-secondary text-sm font-medium">USD</span>
                        </div>
                      </div>
                    )}
                    {hasCoins && (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-studio-secondary/50 uppercase tracking-widest mb-1">Precio Coins</span>
                        <div className="flex items-baseline gap-2 text-studio-primary">
                          <FiZap size={32} fill="currentColor" />
                          <span className="text-5xl font-black italic tracking-tighter">{product.price_coins}</span>
                          <span className="text-studio-secondary text-sm font-medium">A&BCoins</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-studio-border p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-studio-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-studio-primary">Disponible inmediata</span>
              </div>

              {(isDownloadable && hasPurchased) ? (
                <button onClick={() => navigate('/inventario')} className="w-full bg-studio-text-title text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-studio-primary transition-all shadow-md active:scale-95">
                  <FiPackage size={18} /> Ver en mi Inventario
                </button>
              ) : (
                <div className="space-y-3">
                  {(hasUSD || isFree) && (
                    <button
                      onClick={handleAddToCart}
                      disabled={isDownloadable && isInCart}
                      className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                        isDownloadable && isInCart ? 'bg-studio-bg text-studio-secondary/50 cursor-not-allowed border border-studio-border' : addedToCart ? 'bg-studio-primary text-white' : 'bg-studio-text-title text-white hover:bg-studio-primary'
                      }`}
                    >
                      {isDownloadable && isInCart ? <FiCheckCircle size={18} /> : addedToCart ? <FiCheck size={18} strokeWidth={3} /> : isFree ? <FiDownloadCloud size={18} /> : <FiShoppingBag size={18} />}
                      {isDownloadable && isInCart ? "Ya en el carrito" : addedToCart ? "Añadido" : isFree ? "Obtener Gratis" : "Añadir al Carrito"}
                    </button>
                  )}
                  {hasCoins && (
                    <button onClick={() => setShowCoinModal(true)} className="w-full border-2 border-studio-primary text-studio-primary font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-studio-primary hover:text-white transition-all uppercase text-[10px] tracking-[0.2em] shadow-sm active:scale-95">
                      <FiZap size={16} fill="currentColor" /> Canjear {product.price_coins} A&BCoins
                    </button>
                  )}
                </div>
              )}
              <p className="text-center text-[10px] text-studio-secondary/60 uppercase tracking-widest font-bold">Checkout seguro · A&B Studio Operations</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: FiZap, label: 'Formato', val: 'High-Res' },
                { icon: FiShield, label: 'Licencia', val: 'Comercial' },
                { icon: FiDownloadCloud, label: 'Acceso', val: 'Lifetime' },
              ].map((spec, i) => (
                <div key={i} className="bg-white rounded-xl border border-studio-border p-4 text-center shadow-sm">
                  <spec.icon size={18} className="text-studio-primary mx-auto mb-2" />
                  <p className="text-[9px] font-black text-studio-secondary uppercase tracking-widest">{spec.label}</p>
                  <p className="text-xs font-bold text-studio-text-title mt-0.5">{spec.val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-20 pt-12 border-t border-studio-border">
          <ProductReviews productId={product.id} />
        </div>
      </div>

      <CoinPurchaseModal isOpen={showCoinModal} onClose={() => setShowCoinModal(false)} product={product} onConfirm={handleCoinPurchase} loading={purchasing} />
    </div>
  );
}