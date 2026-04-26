import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiShoppingBag, FiCheckCircle, 
  FiCheck, FiPackage, FiZap, FiDownloadCloud, 
  FiShield, FiStar, FiHeart, FiMonitor, FiSmartphone
} from 'react-icons/fi';
import { FaWindows, FaApple, FaAndroid } from 'react-icons/fa6';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('mac') || name.includes('apple')) return <FaApple size={14} className="mr-1.5" />;
    if (name.includes('windows')) return <FaWindows size={14} className="mr-1.5" />;
    if (name.includes('movil') || name.includes('android') || name.includes('ios')) return <FiSmartphone size={14} className="mr-1.5" />;
    return <FiMonitor size={14} className="mr-1.5" />; // Default
  };  

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
      if (user) {
        // Verificar compra
        const { data: purchase } = await supabase
          .from('order_items')
          .select('id, orders!inner(status)')
          .eq('product_id', id)
          .eq('orders.user_id', user.id)
          .eq('orders.status', 'completed')
          .maybeSingle();
        if (purchase) setHasPurchased(true);

        // Verificar favorito
        const { data: fav } = await supabase
          .from('wishlist')
          .select('*')
          .eq('product_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (fav) setIsFavorite(true);
      }
      setLoading(false);
    }
    getProductData();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Inicia sesión para guardar favoritos");
    if (isFavorite) {
      await supabase.from('wishlist').delete().eq('product_id', id).eq('user_id', user.id);
    } else {
      await supabase.from('wishlist').insert({ product_id: id, user_id: user.id });
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-studio-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-studio-bg pt-24">

      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-studio-secondary hover:text-studio-primary transition-colors text-sm font-medium group"
        >
          <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* COLUMNA IZQUIERDA: Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-28"
          >
            {/* Imagen Principal */}
            <div className="relative bg-white rounded-2xl border border-studio-border overflow-hidden aspect-square shadow-flat">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badge de precio o adquirido */}
              <div className="absolute top-4 left-4">
                {hasPurchased ? (
                  <span className="bg-studio-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <FiCheck size={12} strokeWidth={3} /> Adquirido
                  </span>
                ) : (
                  <span className="bg-studio-text-title text-white text-sm font-black px-4 py-2 rounded-lg">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Botones flotantes */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-flat transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-studio-secondary hover:text-red-500'
                  }`}
                >
                  <FiHeart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Watermark sutil */}
              <div className="absolute bottom-4 right-4 text-studio-text-title/10 font-black text-2xl select-none pointer-events-none">
                A<span className="text-studio-primary/10">&</span>B
              </div>
            </div>
          </motion.div>

          {/* COLUMNA DERECHA: Info y compra */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-studio-primary/10 text-studio-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md flex items-center">
                {getCategoryIcon(product.categories?.name)}
                {product.categories?.name}
              </span>
              {/* Estrellas */}
              <div className="flex items-center gap-1 ml-auto">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={14} className="text-amber-400" fill="currentColor" />
                ))}
                <span className="text-xs text-studio-secondary font-medium ml-1">5.0</span>
              </div>
            </div>

            {/* Título y descripción */}
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-studio-text-title leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-studio-secondary leading-relaxed">
                {product.description || "Diseñado para integrarse en flujos de trabajo profesionales de alto impacto."}
              </p>
            </div>

            {/* Precio destacado */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-studio-text-title">${product.price}</span>
                <span className="text-studio-secondary text-sm font-medium">USD · Pago único</span>
              </div>

            {/* CARD DE COMPRA */}
            <div className="bg-white rounded-2xl border border-studio-border p-6 space-y-5">

              {/* Disponibilidad */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-studio-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-studio-primary">Disponible para entrega inmediata</span>
              </div>

              {/* Botón principal */}
              {hasPurchased ? (
                <button
                  onClick={() => navigate('/inventario')}
                  className="w-full bg-studio-text-title text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-studio-primary transition-all"
                >
                  <FiPackage size={18} /> Ver en mi Inventario
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    addedToCart
                      ? 'bg-studio-primary text-white'
                      : 'bg-studio-text-title text-white hover:bg-studio-primary'
                  }`}
                >
                  {addedToCart ? (
                    <><FiCheck size={18} strokeWidth={3} /> ¡Añadido al carrito!</>
                  ) : (
                    <><FiShoppingBag size={18} /> Añadir al Carrito</>
                  )}
                </button>
              )}
              <p className="text-center text-[10px] text-studio-secondary/60 uppercase tracking-widest font-bold">
                Checkout seguro · Dodo Payments
              </p>
            </div>

            
            {/* Specs rápidos DEBAJO de la imagen */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: FiZap, label: 'Formato', val: 'High-Res' },
                { icon: FiShield, label: 'Licencia', val: 'Comercial' },
                { icon: FiDownloadCloud, label: 'Acceso', val: 'Lifetime' },
              ].map((spec, i) => (
                <div key={i} className="bg-white rounded-xl border border-studio-border p-4 text-center">
                  <spec.icon size={18} className="text-studio-primary mx-auto mb-2" />
                  <p className="text-[9px] font-black text-studio-secondary uppercase tracking-widest">{spec.label}</p>
                  <p className="text-xs font-bold text-studio-text-title mt-0.5">{spec.val}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* REVIEWS */}
        <div className="mt-20 pt-12 border-t border-studio-border">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}