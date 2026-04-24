// src/components/ui/ProductDetailView.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';
import ProductReviews from './ProductReviews';

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function getProduct() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories ( name ),
          product_types ( name )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error:", error);
        navigate('/');
      } else {
        setProduct(data);
      }
      setLoading(false);
    }
    getProduct();
  }, [id, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-digital-lavender animate-pulse">CARGANDO DETALLES...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-soft-snow">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Botón Volver */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-panda-black/30 hover:text-digital-lavender transition-all mb-12 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} /> Volver al catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LADO IZQUIERDO: Imagen */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-white border-8 border-white shadow-2xl shadow-panda-black/5">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decoración aesthetic */}
            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-digital-lavender/10 rounded-full blur-3xl"></div>
          </motion.div>

          {/* LADO DERECHO: Información */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1 bg-digital-lavender/10 text-digital-lavender rounded-full text-[10px] font-black uppercase tracking-widest">
                  {product.categories?.name}
                </span>
                <span className="px-4 py-1 bg-soft-snow text-panda-black/40 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                  {product.product_types?.name}
                </span>
              </div>
              <h1 className="text-5xl font-black text-panda-black leading-tight tracking-tighter">
                {product.name}
              </h1>
              <p className="text-4xl font-black text-digital-lavender italic">
                ${product.price}
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-panda-black/5 space-y-6">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-panda-black/30 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FiInfo /> Descripción del Producto
                </h4>
                <p className="text-panda-black/60 font-medium leading-relaxed italic">
                  {product.description || "Este producto digital ha sido diseñado con la calidad y el estilo único de A&B Studio. Perfecto para potenciar tu ecosistema digital."}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-xs font-bold text-mint-green">
                  <FiCheckCircle size={18} /> Entrega inmediata tras el pago
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-panda-black/40">
                  <FiCheckCircle size={18} /> Soporte técnico incluido
                </div>
              </div>

              <button 
                onClick={() => {
                  addToCart(product);
                  // Opcional: podrías abrir el sidebar automáticamente aquí
                }}
                className="w-full bg-panda-black text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-digital-lavender transition-all shadow-xl active:scale-[0.98]"
              >
                <FiShoppingBag size={20} /> Añadir al Carrito
              </button>
            </div>
            
            <p className="text-[9px] text-center text-panda-black/20 font-bold uppercase tracking-widest">
              Pagos procesados de forma segura por Lemon Squeezy
            </p>
          </motion.div>

        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}