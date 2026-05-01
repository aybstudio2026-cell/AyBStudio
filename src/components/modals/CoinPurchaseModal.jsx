import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiX, FiAlertCircle } from 'react-icons/fi';

export default function CoinPurchaseModal({ isOpen, onClose, product, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={() => !loading && onClose()}
          className="absolute inset-0 bg-studio-text-title/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-studio-border overflow-hidden"
        >
          {/* Elemento Decorativo de Fondo */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <FiZap size={150} fill="currentColor" />
          </div>

          <div className="relative z-10 text-center space-y-6">
            {/* Icono de Moneda */}
            <div className="w-20 h-20 bg-studio-primary/10 text-studio-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FiZap size={40} fill="currentColor" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-studio-text-title uppercase italic tracking-tighter">
                Confirmar Compra
              </h3>
              <p className="text-sm text-studio-secondary font-medium leading-relaxed px-4">
                ¿Estás seguro de adquirir <span className="text-studio-text-title font-bold">"{product?.name}"</span> por <span className="text-studio-primary font-bold">{product?.price_coins} A&BCoins</span>?
              </p>
            </div>

            {/* Acciones */}
            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={onConfirm}
                disabled={loading}
                className="w-full bg-studio-primary text-white font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-studio-primary/20 hover:brightness-110 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Confirmar y Canjear</>
                )}
              </button>
              
              <button 
                onClick={onClose}
                disabled={loading}
                className="w-full text-studio-secondary font-black py-2 rounded-xl text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Cancelar
              </button>
            </div>

            {/* Nota de seguridad */}
            <div className="flex items-center justify-center gap-1.5 opacity-30">
              <FiAlertCircle size={10} />
              <span className="text-[8px] font-bold uppercase tracking-tighter">Transacción instantánea y segura</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
