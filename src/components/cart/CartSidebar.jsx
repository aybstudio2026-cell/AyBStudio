import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingCart, FiArrowRight, FiInbox, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 

export default function CartSidebar({ isOpen, onClose }) {
  // Extraemos las funciones y datos del contexto global
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose(); // Cerrar el sidebar antes de navegar
    navigate('/checkout'); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Capa de fondo (Overlay) con desenfoque suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-studio-text-title/40 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Panel del Carrito (Sidebar) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-studio-surface shadow-flat z-[101] flex flex-col border-l border-studio-border"
          >
            {/* Cabecera del Carrito */}
            <div className="p-6 border-b border-studio-border flex justify-between items-center bg-studio-surface">
              <div className="flex items-center gap-3">
                <FiShoppingCart className="text-studio-primary" size={22} />
                <h2 className="text-xl font-bold text-studio-text-title uppercase tracking-tight">Tu Carrito</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-studio-bg rounded-lg transition-colors text-studio-secondary"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Cuerpo: Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                /* Estado cuando el carrito está vacío */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-studio-secondary opacity-40">
                  <FiInbox size={48} strokeWidth={1.5} />
                  <p className="font-bold uppercase tracking-widest text-xs">Tu carrito está vacío</p>
                </div>
              ) : (
                /* Mapeo de productos en el carrito */
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    {/* Imagen del Producto */}
                    <div className="shrink-0">
                      <img 
                        src={item.image_url} 
                        className="w-20 h-20 rounded-xl object-cover border border-studio-border bg-studio-bg" 
                        alt={item.name}
                      />
                    </div>

                    {/* Información y Controles */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-studio-text-title text-sm line-clamp-1">{item.name}</h4>
                      
                      <div className="flex items-center gap-3 mt-2">
                        {/* Selector de Cantidad Estilo Flat */}
                        <div className="flex items-center border border-studio-border rounded-lg bg-studio-bg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-studio-border text-studio-text-body transition-colors"
                          >
                            <FiMinus size={14} />
                          </button>
                          
                          <span className="px-3 text-xs font-bold text-studio-text-title min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-studio-border text-studio-text-body transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Precio calculado */}
                        <p className="text-studio-primary font-black text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Botón Eliminar */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2.5 text-studio-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar producto"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer: Totales y Checkout */}
            <div className="p-8 bg-studio-bg border-t border-studio-border space-y-6">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-studio-secondary uppercase text-[10px] tracking-widest">Subtotal Estimado</span>
                  <span className="text-3xl font-black text-studio-text-title">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  disabled={cart.length === 0}
                  onClick={handleContinue}
                  className="w-full bg-studio-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar al Pago
                  <FiArrowRight size={20} />
                </button>
                
                <p className="text-[10px] text-center text-studio-secondary font-bold uppercase tracking-widest">
                  Acceso inmediato tras completar el pago
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}