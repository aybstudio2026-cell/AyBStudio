import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiStar } from 'react-icons/fi';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('product_id', productId)
      .eq('is_approved', true);
    if (data) setReviews(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Debes iniciar sesión");

    await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment
    });
    alert("Reseña enviada para moderación");
    setComment('');
  }

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-2xl font-black uppercase italic">Reviews de la Comunidad</h3>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <div className="flex gap-2 mb-4 text-yellow-400">
          {[1,2,3,4,5].map(num => (
            <FiStar 
              key={num} 
              fill={num <= rating ? "currentColor" : "none"} 
              onClick={() => setRating(num)}
              className="cursor-pointer"
            />
          ))}
        </div>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Qué te pareció este asset?"
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-digital-lavender resize-none"
        />
        <button className="mt-4 bg-digital-lavender text-panda-black px-6 py-2 rounded-xl font-black text-xs uppercase">Enviar Review</button>
      </form>

      {/* Lista de Reseñas */}
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="border-l-2 border-digital-lavender pl-4">
            <p className="text-[10px] font-black text-digital-lavender uppercase">{r.profiles?.username}</p>
            <p className="text-sm text-white/80">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}