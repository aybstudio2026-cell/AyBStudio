import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiShoppingBag, FiCheckCircle, FiInfo, 
  FiCheck, FiPackage, FiZap, FiDownloadCloud, FiShield, FiStar 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';
import ProductReviews from './ProductReviews';

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function getProductData() {
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories ( name ), product_types ( name )`)
        .eq('id', id)
        .single();

      if (error) { navigate('/'); return; }
      setProduct(data);

      const { data: { user } } = await supabase.auth.getUser();
      if (user && data.product_types?.name?.toLowerCase().includes('descargable')) {
        const { data: purchase } = await supabase
          .from('order_items')
          .select('id, orders!inner(status)')
          .eq('product_id', id)
          .eq('orders.user_id', user.id)
          .eq('orders.status', 'completed')
          .maybeSingle();
        if (purchase) setHasPurchased(true);
      }
      setLoading(false);
    }
    getProductData();
  }, [id, navigate]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-studio-primary animate-pulse tracking-widest uppercase">
      Renderizando Masterpiece...
    </div>
  );

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8FAFC]">
      {/* Fondo Decorativo Sutil */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-studio-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-studio-text-title/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LADO IZQUIERDO: Visual Showcase (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[4rem] overflow-hidden bg-white border-[1px] border-white shadow-[0_22px_70px_4px_rgba(0,0,0,0.05)]"
            >
              <img 
                src={product.image_url} 
                alt=""
                className="w-full aspect-square object-cover"
              />
              
              {/* Overlay Logo Branding */}
              <div className="absolute bottom-10 right-10 flex flex-col items-center opacity-30 select-none italic font-black text-4xl text-studio-text-title">
                A<span className="text-studio-primary">&</span>B
              </div>

              {/* Status Badge */}
              <div className="absolute top-0 right-0">
                {hasPurchased ? (
                  <div className="bg-studio-primary text-white px-8 py-4 rounded-bl-[3rem] font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-lg">
                    <FiCheck strokeWidth={4} /> Asset Adquirido
                  </div>
                ) : (
                  <div className="bg-studio-text-title text-white px-10 py-6 rounded-bl-[3rem] shadow-xl flex flex-col items-center">
                    <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Price tag</span>
                    <span className="text-2xl font-black">${product.price}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <FiZap />, label: "Formato", val: "High-Res" },
                { icon: <FiShield />, label: "Licencia", val: "Comercial" },
                { icon: <FiDownloadCloud />, label: "Acceso", val: "Lifetime" },
              ].map((spec, i) => (
                <div key={i} className="bg-white/60 border border-white p-6 rounded-[2rem] text-center">
                  <div className="text-studio-primary mb-2 flex justify-center text-lg">{spec.icon}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-studio-secondary mb-1">{spec.label}</div>
                  <div className="text-[11px] font-bold text-studio-text-title">{spec.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LADO DERECHO: Intelligence & Purchase (Col 5) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-8">
              
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-studio-primary/10 text-studio-primary px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {product.product_types?.name}
                  </span>
                  <div className="flex text-amber-400 gap-0.5">
                    {[1,2,3,4,5].map(s => <FiStar key={s} size={10} fill="currentColor" />)}
                  </div>
                </div>
                <h1 className="text-5xl font-black text-studio-text-title tracking-tight leading-[1.1]">
                  {product.name}
                </h1>
                <p className="text-studio-secondary font-medium leading-relaxed text-sm">
                  {product.description || "Cuidadosamente diseñado para integrarse en flujos de trabajo profesionales de alto impacto."}
                </p>
              </div>

              {/* Purchase Card (Glassmorphism) */}
              <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 border border-white shadow-xl shadow-studio-text-title/5 space-y-10 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-studio-secondary/40 uppercase tracking-widest">Estado de Disponibilidad</p>
                    <p className="text-xs font-bold text-studio-primary flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-studio-primary rounded-full animate-ping" />
                      Disponible para descarga inmediata
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {hasPurchased ? (
                    <button 
                      onClick={() => navigate('/inventario')}
                      className="w-full bg-studio-text-title text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:bg-studio-primary transition-all shadow-xl active:scale-95 group"
                    >
                      <FiPackage size={18} /> Ver en mi Inventario
                    </button>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-studio-text-title text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:bg-studio-primary transition-all shadow-[0_20px_40px_-10px_rgba(30,41,59,0.3)] active:scale-95"
                    >
                      <FiShoppingBag size={18} /> Adquirir Recurso
                    </button>
                  )}
                  
                  <p className="text-[8px] text-center text-studio-secondary/50 font-bold uppercase tracking-[0.4em]">
                    Checkout seguro — Dodo Payments
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 text-[10px] font-black text-studio-text-title uppercase tracking-widest opacity-60">
                    <FiCheckCircle className="text-studio-primary" /> Archivos fuente incluidos
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-studio-text-title uppercase tracking-widest opacity-60">
                    <FiCheckCircle className="text-studio-primary" /> Actualizaciones de por vida
                  </div>
                </div>
              </div>

              {/* Designer Note */}
              <div className="p-6 border-l-4 border-studio-primary bg-studio-primary/5 rounded-r-2xl">
                <p className="text-[10px] font-black text-studio-primary uppercase tracking-widest mb-1 italic">Nota del Estudio</p>
                <p className="text-[11px] text-studio-secondary leading-relaxed font-medium">
                  Este asset ha pasado nuestras pruebas de calidad UI/UX. Se recomienda su uso en aplicaciones escalables.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-40 pt-20 border-t border-gray-200">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}