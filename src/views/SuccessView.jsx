// src/views/SuccessView.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function SuccessView() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiamos el carrito cuando llega a esta página
    clearCart();
  }, []);

  return (
    <div className="pt-40 pb-20 min-h-screen bg-soft-snow flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-gray-100 max-w-md w-full mx-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-mint-green/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <FiCheckCircle size={40} className="text-mint-green" />
        </motion.div>

        <h2 className="text-3xl font-black text-panda-black uppercase tracking-tighter mb-4">
          ¡Pago Exitoso!
        </h2>
        <p className="text-sm font-medium text-panda-black/40 italic mb-10">
          Tu pedido ha sido procesado correctamente. En unos momentos estará disponible en tus descargas.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/pedidos')}
            className="w-full bg-panda-black text-white font-black py-4 rounded-2xl hover:bg-digital-lavender transition-all"
          >
            Ver mis pedidos
          </button>
          <button
            onClick={() => navigate('/descargas')}
            className="w-full bg-soft-snow text-panda-black font-black py-4 rounded-2xl hover:bg-gray-100 transition-all"
          >
            Ir a mis descargas
          </button>
        </div>
      </motion.div>
    </div>
  );
}