import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiLock, FiInfo, FiArrowLeft, FiTrash2, FiShield, FiCheckCircle } from 'react-icons/fi'; // Corregido: FiShield y FiCheckCircle
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CheckoutView() {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  // Cálculos de impuestos (18% como ejemplo)
  const taxRate = 0.18;
  const taxes = cartTotal * taxRate;
  const finalTotal = cartTotal + taxes;

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center space-y-6">
        <div className="w-20 h-20 bg-soft-snow rounded-full flex items-center justify-center mx-auto text-panda-black/10">
          <FiShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-black text-panda-black uppercase italic opacity-20">Tu bolsa está vacía</h2>
        <Link to="/" className="inline-block bg-panda-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-digital-lavender transition-all">
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
            <h1 className="text-4xl font-black text-panda-black uppercase tracking-tighter">Finalizar Compra</h1>
            <p className="text-xs font-bold text-panda-black/40 uppercase tracking-widest">A&B Studio • Checkout Seguro</p>
          </div>
        </div>

        {/* Layout de 2 Columnas */}
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
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-panda-black">{item.name}</h4>
                      <p className="text-[10px] font-black text-digital-lavender uppercase tracking-widest mt-1">Licencia Digital Permanente</p>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:underline"
                      >
                        <FiTrash2 /> ELIMINAR
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-panda-black text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-panda-black/30 uppercase tracking-tighter">Cant: {item.quantity}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Badges de confianza corregidos */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-mint-green/10 rounded-2xl flex items-center justify-center text-mint-green">
                  <FiShield size={24} /> {/* Icono corregido */}
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

          {/* COLUMNA 2: RESUMEN Y TOTAL */}
          <div className="lg:col-span-4">
            <div className="bg-panda-black text-white rounded-[2.5rem] p-10 shadow-2xl sticky top-32 border border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 mb-10">Resumen de Pago</h3>
              
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
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Total Final</span>
                    <span className="text-5xl font-black italic tracking-tighter">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => console.log("Procesando pago...")}
                className="w-full bg-digital-lavender hover:bg-white hover:text-panda-black text-white font-black py-6 rounded-3xl transition-all duration-300 shadow-xl shadow-digital-lavender/20 flex items-center justify-center gap-3 active:scale-95 mb-6"
              >
                <FiLock /> PAGAR AHORA
              </button>

              <div className="flex flex-col items-center gap-4 opacity-30 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest">Garantía A&B Studio</p>
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