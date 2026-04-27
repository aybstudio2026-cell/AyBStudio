// src/views/CheckoutView.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  FiShoppingCart, FiLock, FiArrowLeft, FiTrash2, FiShield, 
  FiCheckCircle, FiLoader, FiZap, FiMinus, FiPlus, FiGlobe 
} from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

export default function CheckoutView() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // El total es directo ya que eliminamos los impuestos según tu solicitud
  const finalTotal = cartTotal;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Debes iniciar sesión para completar tu compra.');
        setLoading(false);
        return;
      }

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

      if (data.payment_link) {
        window.location.href = data.payment_link;
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-studio-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-gray-50 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-studio-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiCheckCircle size={40} className="text-studio-primary" />
          </div>
          <h2 className="text-3xl font-black text-studio-text-title uppercase tracking-tighter italic mb-4">
            ¡Pago Exitoso!
          </h2>
          <p className="text-sm font-medium text-studio-secondary italic mb-10">
            Tu pedido ha sido procesado correctamente. Los activos ya están disponibles en tu inventario.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/pedidos')}
              className="w-full bg-studio-text-title text-white font-black py-4 rounded-2xl hover:bg-studio-primary transition-all text-[11px] uppercase tracking-widest"
            >
              Ver mis pedidos
            </button>
            <button
              onClick={() => navigate('/descargas')}
              className="w-full bg-studio-bg text-studio-text-title font-black py-4 rounded-2xl hover:bg-gray-100 transition-all text-[11px] uppercase tracking-widest"
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
      <div className="pt-48 pb-20 text-center space-y-8 bg-studio-bg min-h-screen">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-studio-text-title/10 shadow-sm border border-gray-50">
          <FiShoppingCart size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-studio-text-title uppercase italic tracking-tighter opacity-20">
            Tu carrito está vacío
          </h2>
          <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.3em]">¿Listo para un nuevo activo?</p>
        </div>
        <Link
          to="/tienda"
          className="inline-block bg-studio-text-title text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-studio-primary transition-all shadow-xl shadow-studio-text-title/10"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg">
      <div className="max-w-7xl mx-auto px-6">

        {/* CABECERA EDITORIAL */}
        <div className="flex items-center gap-6 mb-16">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:text-studio-primary transition-all border border-gray-50 group"
          >
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black text-studio-text-title uppercase tracking-tighter italic leading-none">
              Resumen de <span className="text-studio-primary">Orden</span>
            </h1>
            <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em] opacity-50">
              A&B Studio • Digital Distribution
            </p>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 font-bold text-[11px] uppercase tracking-widest"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* COLUMNA 1: LISTA DE PRODUCTOS CON CANTIDADES */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm">
              <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
                <h3 className="text-[10px] font-black text-studio-text-title uppercase tracking-[0.3em] flex items-center gap-2">
                  <FiShoppingCart className="text-studio-primary" size={16} /> Carrito de Compras
                </h3>
                <span className="text-[9px] font-black bg-studio-bg px-4 py-1.5 rounded-lg text-studio-secondary uppercase tracking-widest">
                  {cart.length} Producto
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {cart.map((item) => {
                  const isDownloadable = item.product_types?.name?.toLowerCase().includes('descargable');
                  
                  return (
                    <motion.div layout key={item.id} className="py-8 flex gap-8 items-center group">
                      <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-studio-bg border border-gray-100 shrink-0">
                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-studio-text-title tracking-tight">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-2 mb-4">
                          <FiZap size={10} className="text-studio-primary" />
                          <p className="text-[9px] font-black text-studio-secondary uppercase tracking-[0.2em]">
                             {item.product_types?.name || 'Digital Asset'}
                          </p>
                        </div>
                        
                        {/* SELECTOR DE CANTIDAD O LICENCIA ÚNICA */}
                        {!isDownloadable ? (
                          <div className="flex items-center gap-3 bg-studio-bg p-1.5 rounded-xl border border-gray-100 w-fit">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-studio-text-title hover:text-studio-primary disabled:opacity-30 transition-all"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="text-xs font-black text-studio-text-title min-w-[20px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-studio-text-title hover:text-studio-primary transition-all"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-[9px] font-black text-studio-primary uppercase bg-studio-primary/5 px-4 py-1.5 rounded-full w-fit border border-studio-primary/10">
                            Licencia de Uso Único
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-black text-studio-text-title text-2xl tracking-tighter italic">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                        >
                          <FiTrash2 size={12} /> Remover
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-50 flex items-center gap-5 shadow-sm">
                <div className="w-14 h-14 bg-studio-primary/5 rounded-2xl flex items-center justify-center text-studio-primary">
                  <FiShield size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-studio-text-title tracking-widest">Secure Payment</p>
                  <p className="text-[10px] font-medium text-studio-secondary italic">Encryption SSL 256-bit</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-gray-50 flex items-center gap-5 shadow-sm">
                <div className="w-14 h-14 bg-studio-primary/5 rounded-2xl flex items-center justify-center text-studio-primary">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-studio-text-title tracking-widest">Instant Access</p>
                  <p className="text-[10px] font-medium text-studio-secondary italic">Direct Cloud Download</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: RESUMEN DETALLADO SIN TAXES */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-studio-text-title text-white rounded-[3rem] p-10 shadow-2xl border border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-studio-primary/10 blur-3xl -mr-16 -mt-16 rounded-full" />

              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-primary mb-12">
                Order Summary
              </h3>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-sm">
                  <span className="opacity-40 font-bold uppercase tracking-widest text-[10px]">Net Subtotal</span>
                  <span className="font-bold tracking-tight">${cartTotal.toFixed(2)}</span>
                </div>
                
                {/* Detalles de valor añadido */}
                <div className="flex justify-between text-sm items-center">
                  <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <FiGlobe size={12} /> Envío Digital
                  </span>
                  <span className="text-[10px] font-black text-studio-primary uppercase tracking-widest">Incluido</span>
                </div>

                <div className="flex justify-between text-sm items-center">
                  <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <FiShield size={12} /> Soporte Studio
                  </span>
                  <span className="text-[10px] font-black text-studio-primary uppercase tracking-widest">Prioritario</span>
                </div>

                <div className="h-px bg-white/10 my-8"></div>

                <div className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-studio-primary">
                    Total Final
                  </span>
                  <span className="text-6xl font-black italic tracking-tighter">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-studio-primary hover:bg-white hover:text-studio-text-title text-white font-black py-6 rounded-[1.5rem] transition-all duration-500 shadow-xl shadow-studio-primary/20 flex items-center justify-center gap-3 active:scale-95 mb-8 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <><FiLoader className="animate-spin" /> Processing</>
                ) : (
                  <>
                    <FiLock className="group-hover:translate-y-[-2px] transition-transform" /> 
                    <span className="text-[11px] uppercase tracking-[0.2em]">Confirm & Pay</span>
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-4 opacity-30 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                  Pagos procesados por Dodo Payments
                </p>
                <div className="flex gap-4">
                  <span className="text-[8px] font-black border border-white/20 px-2.5 py-1 rounded-md">AES-256</span>
                  <span className="text-[8px] font-black border border-white/20 px-2.5 py-1 rounded-md">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}