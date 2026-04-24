import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiCheck, FiTrash2, FiMessageSquare, FiClock, FiStar } from 'react-icons/fi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username), products(name)')
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  }

  async function handleApprove(id) {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id);
    if (!error) fetchReviews();
  }

  async function handleDelete(id) {
    if (window.confirm('¿Eliminar esta reseña?')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) fetchReviews();
    }
  }

  if (loading) return <div className="p-40 text-center animate-pulse font-black uppercase">Sincronizando Feedback...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">Moderación de Reseñas</h1>
        <p className="text-white/30 text-sm font-medium">Gestiona la reputación social de A&B Studio</p>
      </div>

      <div className="bg-[#161b27] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-black">
            <tr>
              <th className="p-6">Usuario / Producto</th>
              <th className="p-6">Reseña</th>
              <th className="p-6">Valoración</th>
              <th className="p-6 text-right">Estado / Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <p className="font-black text-white uppercase">{r.profiles?.username}</p>
                  <p className="text-[10px] text-digital-lavender font-bold tracking-widest uppercase truncate w-32">{r.products?.name}</p>
                </td>
                <td className="p-6 max-w-xs">
                  <p className="text-white/60 italic text-xs">"{r.comment}"</p>
                </td>
                <td className="p-6 text-yellow-400">
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, i) => <FiStar key={i} fill="currentColor" size={10} />)}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    {!r.is_approved && (
                      <button 
                        onClick={() => handleApprove(r.id)}
                        className="p-2 bg-mint-green/10 text-mint-green rounded-lg hover:bg-mint-green hover:text-panda-black transition-all"
                        title="Aprobar"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(r.id)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}