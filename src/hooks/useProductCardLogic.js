import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

export function useProductCardLogic(product, cart, navigate) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const isDownloadable = product.product_types?.name?.toLowerCase().includes('descargable');
  const isInCart = cart.some(item => item.id === product.id);

  // Lógica de precios
  const hasUSD = product.price > 0;
  const hasCoins = product.price_coins > 0;
  const isFree = product.price === 0 && (!product.price_coins || product.price_coins === 0);

  useEffect(() => {
    async function initProduct() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verificar Favorito
      const { data: fav } = await supabase
        .from('wishlist')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fav) setIsFavorite(true);

      // Verificar si ya fue comprado (Solo para descargables)
      if (isDownloadable) {
        const { data: order } = await supabase
          .from('order_items')
          .select('id, orders!inner(status)')
          .eq('product_id', product.id)
          .eq('orders.user_id', user.id)
          .eq('orders.status', 'completed')
          .maybeSingle();
        
        if (order) setHasPurchased(true);
      }
    }
    initProduct();
  }, [product.id, isDownloadable]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Inicia sesión para guardar favoritos");

    if (isFavorite) {
      await supabase.from('wishlist').delete().eq('product_id', product.id).eq('user_id', user.id);
    } else {
      await supabase.from('wishlist').insert({ product_id: product.id, user_id: user.id });
    }
    setIsFavorite(!isFavorite);
  };

  const handleCoinPurchase = async () => {
    setIsPurchasing(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Inicia sesión para comprar con monedas");
      setIsPurchasing(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('process_coin_purchase', {
        p_product_id: product.id,
        p_user_id: user.id
      });

      if (error || !data.success) throw new Error(data?.message || "Error en la compra");

      setHasPurchased(true);
      setShowCoinModal(false);
      navigate('/inventario');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    isFavorite, hasPurchased, showCoinModal, setShowCoinModal, isPurchasing,
    isInCart, isDownloadable, isFree, hasUSD, hasCoins,
    toggleFavorite, handleCoinPurchase
  };
}