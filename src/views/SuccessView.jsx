// src/views/SuccessView.jsx
import { useEffect, useState, useRef } from 'react'; // Importa useRef
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiLoader, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function SuccessView() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [seconds, setSeconds] = useState(5);
  const cleared = useRef(false); // Ref para asegurar que solo limpie una vez

  useEffect(() => {
    // 1. Limpiar el carrito solo una vez al montar
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }

    // 2. Contador visual
    const countdown = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // 3. Redirección automática tras 5 segundos
    const timer = setTimeout(() => {
      navigate('/pedidos');
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [navigate, clearCart]);

  return (
    <div className="pt-40 pb-20 min-h-screen bg-studio-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-gray-50 max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-studio-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <FiCheckCircle size={48} className="text-studio-primary" />
        </motion.div>

        <div className="space-y-4 mb-10">
          <h2 className="text-4xl font-black text-studio-text-title uppercase tracking-tighter italic leading-none">
            ¡Pago <span className="text-studio-primary">Exitoso!</span>
          </h2>
          <p className="text-sm font-medium text-studio-secondary italic">
            Tu transacción se ha completado. En breve serás redirigido a tu panel de pedidos.
          </p>
        </div>

        {/* Botón de seguridad por si falla la redirección automática */}
        <button
          onClick={() => navigate('/pedidos')}
          className="w-full bg-studio-text-title text-white font-black py-4 rounded-2xl hover:bg-studio-primary transition-all text-[11px] uppercase tracking-widest mb-8 flex items-center justify-center gap-2"
        >
          Ir a mis pedidos <FiArrowRight />
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-[9px] font-black text-studio-secondary/40 uppercase tracking-[0.3em]">
            <FiLoader className="animate-spin text-studio-primary" />
            Redirigiendo automáticamente en {seconds}s
          </div>
          
          <div className="w-full max-w-[120px] h-1 bg-studio-bg rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-studio-primary"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}