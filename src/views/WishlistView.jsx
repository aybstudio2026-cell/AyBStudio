import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import { Link } from 'react-router-dom';

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
          categories ( name )
        )
      `)
      .eq('user_id', user.id);

    if (data) setFavorites(data.map(item => item.products));
    setLoading(false);
  }

  if (loading) return <div className="p-40 text-center animate-pulse font-black text-digital-lavender uppercase tracking-tighter">Cargando tus favoritos...</div>;

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-panda-black uppercase tracking-tighter italic">Mis Favoritos</h1>
        <p className="text-panda-black/40 font-bold mt-2">Tus recursos digitales guardados para después</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100">
          <div className="w-20 h-20 bg-soft-snow rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FiHeart size={40} />
          </div>
          <h2 className="text-2xl font-black text-panda-black uppercase">Tu lista está vacía</h2>
          <p className="text-gray-400 mt-2 mb-8">Explora la tienda y guarda los assets que más te gusten.</p>
          <Link to="/store" className="bg-panda-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-digital-lavender transition-all">
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}