import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingCart, FiArrowRight, FiInbox, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate('/checkout'); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-studio-text-title/40 backdrop-blur-sm z-[100] cursor-pointer"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            /* Ajuste de ancho y bordes responsivos */
            className="fixed right-0 top-0 h-full w-full sm:max-w-[400px] bg-studio-surface shadow-2xl z-[101] flex flex-col border-l border-studio-border"
          >
            {/* Header: Más compacto en móvil */}
            <div className="p-4 md:p-6 border-b border-studio-border flex justify-between items-center bg-studio-surface">
              <div className="flex items-center gap-3">
                <FiShoppingCart className="text-studio-primary" size={20} />
                <h2 className="text-lg md:text-xl font-black text-studio-text-title uppercase italic tracking-tighter">Tu Carrito</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-studio-bg rounded-xl transition-colors text-studio-secondary active:scale-90">
                <FiX size={24} />
              </button>
            </div>

            {/* Lista de productos: Padding reducido en móvil */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 md:space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-studio-secondary opacity-30">
                  <FiInbox size={48} strokeWidth={1} />
                  <p className="font-black uppercase tracking-[0.2em] text-[10px]">Tu carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => {
                  const isDownloadable = item.product_types?.name?.toLowerCase().includes('descargable');

                  return (
                    <div key={item.id} className="flex gap-4 items-center bg-white md:bg-transparent p-3 md:p-0 rounded-2xl md:rounded-none border border-gray-50 md:border-none shadow-sm md:shadow-none">
                      <div className="shrink-0 relative">
                        <img 
                          src={item.image_url} 
                          className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-studio-border bg-studio-bg shadow-sm" 
                          alt={item.name}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-studio-text-title text-xs md:text-sm line-clamp-1 uppercase tracking-tight">{item.name}</h4>
                        
                        <div className="flex items-center gap-3 mt-2">
                          {!isDownloadable ? (
                            <div className="flex items-center border border-studio-border rounded-lg bg-studio-bg overflow-hidden shadow-inner">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 md:p-1.5 hover:bg-studio-border text-studio-text-body transition-colors"
                              >
                                <FiMinus size={12} />
                              </button>
                              
                              <span className="px-2 md:px-3 text-[10px] md:text-xs font-black text-studio-text-title min-w-[25px] text-center">
                                {item.quantity}
                              </span>
                              
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 md:p-1.5 hover:bg-studio-border text-studio-text-body transition-colors"
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[8px] md:text-[10px] font-black text-studio-primary uppercase tracking-widest bg-studio-primary/10 px-2 py-1 rounded-md">
                              Digital
                            </span>
                          )}

                          <p className="text-studio-primary font-black text-xs md:text-sm ml-auto italic">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-studio-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer: Más compacto y ergonómico */}
            <div className="p-6 md:p-8 bg-studio-bg border-t border-studio-border space-y-5">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-0.5">
                  <span className="font-black text-studio-secondary uppercase text-[8px] md:text-[10px] tracking-widest opacity-60">Total a pagar</span>
                  <span className="text-2xl md:text-4xl font-black text-studio-text-title italic tracking-tighter">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  disabled={cart.length === 0}
                  onClick={handleContinue}
                  className="w-full bg-studio-text-title text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-studio-primary transition-all shadow-xl shadow-studio-text-title/10 disabled:opacity-30 disabled:grayscale text-[10px] md:text-xs uppercase tracking-[0.2em]"
                >
                  Continuar al Pago
                  <FiArrowRight size={18} />
                </button>
                <p className="text-[8px] md:text-[10px] text-center text-studio-secondary font-bold uppercase tracking-[0.2em] opacity-40">
                  Acceso instantáneo vía email
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}