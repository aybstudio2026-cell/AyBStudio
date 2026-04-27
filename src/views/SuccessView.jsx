// src/views/SuccessView.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function SuccessView() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    // 1. Limpiamos el carrito al entrar
    clearCart();

    // 2. Contador visual (opcional para el usuario)
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // 3. Redirección automática tras 5 segundos
    const timer = setTimeout(() => {
      navigate('/pedidos');
    }, 5000);

    // Limpieza al desmontar el componente
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
        className="bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-gray-50 max-w-md w-full"
      >
        {/* Icono de éxito animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-studio-primary/10 rounded-full flex items-center justify-center mx-auto mb-10"
        >
          <FiCheckCircle size={48} className="text-studio-primary" />
        </motion.div>

        {/* Mensaje Principal */}
        <h2 className="text-4xl font-black text-studio-text-title uppercase tracking-tighter italic mb-4 leading-tight">
          ¡Pago <span className="text-studio-primary">Confirmado!</span>
        </h2>
        
        <p className="text-sm font-medium text-studio-secondary italic mb-12">
          Tu pedido ha sido procesado con éxito. <br />
          Estamos preparando tus activos digitales.
        </p>

        {/* Indicador de redirección discreto */}
        <div className="flex flex-col items-center gap-4 py-4 border-t border-gray-50">
          <div className="flex items-center gap-3 text-[10px] font-black text-studio-secondary/40 uppercase tracking-[0.3em]">
            <FiLoader className="animate-spin text-studio-primary" />
            Redirigiendo a mis pedidos en {seconds}s
          </div>
          
          {/* Barra de progreso de tiempo sutil */}
          <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
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