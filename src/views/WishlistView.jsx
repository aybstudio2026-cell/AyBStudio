import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiHeart, FiArrowRight, FiInbox } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import { Link } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';

export default function WishlistView() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('wishlist')
      .select(`
        product_id,
        products (
          id, name, price, image_url, description,
          product_types ( name )
        )
      `)
      .eq('user_id', user.id);

    if (data) setFavorites(data.map((item) => item.products));
    setLoading(false);
  }

  return (
    <div className="pt-24 pb-24 md:pt-32 md:pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-0 md:gap-10 items-start">

        <UserSidebar />

        <main className="flex-1 bg-white rounded-xl p-5 md:p-12 border border-gray-100 shadow-sm min-h-[600px]">

          <div className="mb-6 border-b border-gray-50 pb-5">
            <h1 className="text-xl md:text-2xl font-bold text-studio-text-title uppercase tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-studio-primary/10 rounded-lg text-studio-primary">
                <FiHeart size={20} />
              </div>
              Favoritos
            </h1>
            <p className="text-[11px] font-bold text-studio-secondary uppercase tracking-widest mt-3 ml-12">
              Recursos y assets que tienes en la mira
            </p>
          </div>

          {loading ? (
            /* Skeleton loader */
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl bg-studio-bg animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-studio-bg rounded-2xl flex items-center justify-center mb-6 text-studio-secondary/30">
                <FiInbox size={40} strokeWidth={1} />
              </div>
              <h2 className="text-lg font-bold text-studio-text-title uppercase tracking-tight">
                No hay nada guardado todavía
              </h2>
              <p className="text-studio-secondary text-sm mt-2 mb-10 max-w-xs">
                Explora nuestra tienda y guarda los recursos digitales que necesites para tus proyectos.
              </p>
              <Link
                to="/tienda"
                className="flex items-center gap-3 bg-studio-text-title text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-studio-primary transition-all shadow-md active:scale-95"
              >
                Explorar Tienda <FiArrowRight size={14} />
              </Link>
            </div>
          ) : (
            /* 2 columnas en mobile, 3 en pantallas grandes */
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {favorites.map((product) => (
                <div key={product.id} className="group transition-all">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}