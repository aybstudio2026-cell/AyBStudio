import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingBag, FiArrowRight, FiInbox } from 'react-icons/fi';
import { useCart } from '../../context/CartContext'; 

export default function CartSidebar({ isOpen, onClose }) {
  // Extraemos los datos reales del Contexto
  const { cart, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-panda-black/20 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Cabecera */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiShoppingBag className="text-digital-lavender" size={20} />
                <h2 className="text-xl font-black text-panda-black uppercase tracking-tighter">Tu Carrito</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-soft-snow rounded-full transition-colors text-gray-400">
                <FiX size={24} />
              </button>
            </div>

            {/* Lista de Productos Reales */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                /* Estado Vacío */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <FiInbox size={48} />
                  <p className="font-black uppercase tracking-widest text-xs">Tu carrito está vacío</p>
                </div>
              ) : (
                /* Mapeo de productos del contexto */
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <img 
                      src={item.image_url} 
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100 bg-soft-snow" 
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-panda-black text-sm line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black px-2 py-0.5 bg-soft-snow rounded text-panda-black/40">
                          x{item.quantity}
                        </span>
                        <p className="text-digital-lavender font-black text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {/* Botón de eliminar funcional */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar producto"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer del Carrito Dinámico */}
            <div className="p-6 bg-soft-snow border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center text-panda-black">
                <span className="font-bold opacity-50 uppercase text-xs tracking-widest">Subtotal</span>
                <span className="text-2xl font-black">${cartTotal.toFixed(2)}</span>
              </div>
              
              <button 
                disabled={cart.length === 0}
                className="w-full bg-digital-lavender text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-digital-lavender/20 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                onClick={() => console.log("Iniciando checkout con Lemon Squeezy...")}
              >
                Continuar Compra
                <FiArrowRight />
              </button>
              
              <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
                Impuestos calculados al finalizar la compra
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}