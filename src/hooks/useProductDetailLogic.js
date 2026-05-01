import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useProductDetailLogic(id, navigate, addToCart, cart) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [stats, setStats] = useState({ avg: 0, count: 0 });
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(1);

  const isDownloadable = product?.product_types?.name?.toLowerCase().includes('descargable');
  const isInCart = cart.some(item => item.id === id);
  const hasUSD = product?.price > 0;
  const hasCoins = product?.price_coins > 0;
  const isFree = product?.price === 0 && (!product?.price_coins || product?.price_coins === 0);

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
        const { data: purchase } = await supabase
          .from('order_items')
          .select('id, orders!inner(status)')
          .eq('product_id', id)
          .eq('orders.user_id', user.id)
          .eq('orders.status', 'completed')
          .maybeSingle();
        
        if (purchase) setHasPurchased(true);

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

  useEffect(() => {
    async function getProductStats() {
      const { data } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', id)
        .eq('is_approved', true);

      if (data && data.length > 0) {
        const sum = data.reduce((acc, item) => acc + item.rating, 0);
        const avg = sum / data.length;
        setStats({ avg: parseFloat(avg.toFixed(1)), count: data.length });
      } else {
        setStats({ avg: 0, count: 0 });
      }
    }
    getProductStats();
  }, [id]);

  const handleAddToCart = () => {
    if (isDownloadable && isInCart) return;
    addToCart(product, localQuantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleCoinPurchase = async () => {
    setPurchasing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Inicia sesión para canjear tus A&BCoins");
      setPurchasing(false);
      return;
    }
    try {
      const { data, error } = await supabase.rpc('process_coin_purchase', {
        p_product_id: product.id,
        p_user_id: user.id
      });
      if (error || !data.success) throw new Error(data?.message || "Error al procesar la transacción");
      setHasPurchased(true);
      setShowCoinModal(false);
      navigate('/inventario');
    } catch (err) {
      alert(err.message);
    } finally {
      setPurchasing(false);
    }
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

  return {
    product, loading, hasPurchased, isFavorite, addedToCart, stats,
    showCoinModal, setShowCoinModal, purchasing, localQuantity, setLocalQuantity,
    isDownloadable, isInCart, hasUSD, hasCoins, isFree,
    handleAddToCart, handleCoinPurchase, toggleFavorite
  };
}