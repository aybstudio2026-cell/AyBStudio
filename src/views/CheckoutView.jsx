// src/views/CheckoutView.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiLock, FiArrowLeft, FiTrash2, FiShield, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

export default function CheckoutView() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const taxRate = 0.18;
  const taxes = cartTotal * taxRate;
  const finalTotal = cartTotal + taxes;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Verificar que el usuario está logueado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Debes iniciar sesión para completar tu compra.');
        setLoading(false);
        return;
      }

      // 2. Llamar a nuestra API de Vercel
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          customerEmail: user.email,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el pago');
      }

      // 3. Redirigir al payment link de Dodo
      if (data.payment_link) {
        window.location.href = data.payment_link;
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Pantalla de éxito (cuando Dodo redirige de vuelta)
  if (success) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-soft-snow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-gray-100 max-w-md w-full mx-6"
        >
          <div className="w-20 h-20 bg-mint-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiCheckCircle size={40} className="text-mint-green" />
          </div>
          <h2 className="text-3xl font-black text-panda-black uppercase tracking-tighter mb-4">
            ¡Pago Exitoso!
          </h2>
          <p className="text-sm font-medium text-panda-black/40 italic mb-10">
            Tu pedido ha sido procesado correctamente. Ya puedes acceder a tus descargas.
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

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center space-y-6">
        <div className="w-20 h-20 bg-soft-snow rounded-full flex items-center justify-center mx-auto text-panda-black/10">
          <FiShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-black text-panda-black uppercase italic opacity-20">
          Tu bolsa está vacía
        </h2>
        <Link
          to="/"
          className="inline-block bg-panda-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-digital-lavender transition-all"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-soft-snow">
      <div className="max-w-7xl mx-auto px-6">

        {/* Cabecera */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-full shadow-sm hover:text-digital-lavender transition-all border border-gray-100"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-panda-black uppercase tracking-tighter">
              Finalizar Compra
            </h1>
            <p className="text-xs font-bold text-panda-black/40 uppercase tracking-widest">
              A&B Studio • Checkout Seguro
            </p>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 font-bold text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* COLUMNA 1: PRODUCTOS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-panda-black uppercase tracking-widest flex items-center gap-2">
                  <FiShoppingBag className="text-digital-lavender" /> Artículos en tu bolsa
                </h3>
                <span className="text-[10px] font-black bg-soft-snow px-3 py-1 rounded-full text-panda-black/40">
                  {cart.length} PRODUCTOS
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {cart.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="py-6 flex gap-6 items-center group"
                  >
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-soft-snow border border-gray-50 shrink-0">
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={item.name}
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-panda-black">{item.name}</h4>
                      <p className="text-[10px] font-black text-digital-lavender uppercase tracking-widest mt-1">
                        Licencia Digital Permanente
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:underline"
                      >
                        <FiTrash2 /> ELIMINAR
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-panda-black text-xl">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] font-bold text-panda-black/30 uppercase tracking-tighter">
                        Cant: {item.quantity}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Badges de confianza */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-mint-green/10 rounded-2xl flex items-center justify-center text-mint-green">
                  <FiShield size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-panda-black">Compra Segura</p>
                  <p className="text-[10px] font-medium text-panda-black/40">Protección SSL activa</p>
                </div>
              </div>
              <div className="flex-1 min-w-[200px] bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-digital-lavender/10 rounded-2xl flex items-center justify-center text-digital-lavender">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-panda-black">Entrega Digital</p>
                  <p className="text-[10px] font-medium text-panda-black/40">Acceso inmediato</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: RESUMEN */}
          <div className="lg:col-span-4">
            <div className="bg-panda-black text-white rounded-[2.5rem] p-10 shadow-2xl sticky top-32 border border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 mb-10">
                Resumen de Pago
              </h3>

              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="opacity-50 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-50 font-bold uppercase tracking-widest text-[10px]">Impuestos (18%)</span>
                  <span className="font-bold">${taxes.toFixed(2)}</span>
                </div>

                <div className="h-px bg-white/10 my-6"></div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">
                      Total Final
                    </span>
                    <span className="text-5xl font-black italic tracking-tighter">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-digital-lavender hover:bg-white hover:text-panda-black text-white font-black py-6 rounded-3xl transition-all duration-300 shadow-xl shadow-digital-lavender/20 flex items-center justify-center gap-3 active:scale-95 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <FiLock /> PAGAR AHORA
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-4 opacity-30 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest">
                  Pagos procesados por Dodo Payments
                </p>
                <div className="flex gap-4">
                  <span className="text-[9px] font-black border border-white/50 px-2 py-0.5 rounded">SSL</span>
                  <span className="text-[9px] font-black border border-white/50 px-2 py-0.5 rounded">24/7 SUPPORT</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}