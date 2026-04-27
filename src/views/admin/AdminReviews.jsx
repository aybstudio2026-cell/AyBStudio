// src/views/admin/AdminReviews.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiCheck, FiTrash2, FiMessageSquare, FiStar, 
  FiUser, FiPackage, FiLoader, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
      .select('*, profiles(username, avatar_url), products(name)')
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
    if (window.confirm('¿Eliminar esta reseña permanentemente?')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) fetchReviews();
    }
  }

  if (loading) return (
    <div className="p-40 text-center bg-studio-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <FiLoader className="animate-spin text-studio-primary" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary animate-pulse">Sincronizando Feedback...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-studio-bg min-h-screen text-studio-text-title font-sans">
      
      {/* HEADER EDITORIAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-studio-border pb-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em]">Social Reputation</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Moderación de <span className="text-studio-primary">Reseñas</span>
          </h1>
        </div>
        <div className="bg-white border border-studio-border px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
          <FiMessageSquare className="text-studio-primary" size={16}/>
          <span className="text-[10px] font-black uppercase tracking-widest text-studio-secondary">Total: {reviews.length} Feedbacks</span>
        </div>
      </div>

      {/* TABLA GÉLIDA */}
      <div className="bg-white rounded-[2.5rem] border border-studio-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-studio-border">
              <tr className="text-[9px] uppercase tracking-[0.3em] text-studio-secondary font-black opacity-50">
                <th className="p-8">Autor / Activo</th>
                <th className="p-8">Comentario Editorial</th>
                <th className="p-8">Valoración</th>
                <th className="p-8 text-right">Estado / Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border">
              {reviews.map((r) => (
                <motion.tr 
                  layout
                  key={r.id} 
                  className="hover:bg-studio-bg transition-colors group"
                >
                  <td className="p-8 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-studio-bg border border-studio-border flex items-center justify-center font-black text-xs text-studio-primary shrink-0 overflow-hidden shadow-inner">
                      {r.profiles?.avatar_url ? (
                        <img src={r.profiles.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <FiUser size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-studio-text-title uppercase tracking-tight truncate">
                        {r.profiles?.username}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <FiPackage size={10} className="text-studio-primary/40" />
                        <p className="text-[9px] text-studio-secondary font-bold uppercase tracking-widest opacity-40 truncate w-32">
                          {r.products?.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-8 max-w-xs">
                    <p className="text-xs font-medium text-studio-secondary italic leading-relaxed">
                      "{r.comment}"
                    </p>
                    <p className="text-[8px] font-black text-studio-secondary/20 uppercase tracking-widest mt-2">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="p-8">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          size={12} 
                          fill={i < r.rating ? "currentColor" : "none"}
                          className={i < r.rating ? "text-amber-400" : "text-studio-secondary/20"}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3">
                      {r.is_approved ? (
                        <div className="flex items-center gap-2 bg-studio-primary/5 text-studio-primary border border-studio-primary/20 px-4 py-2 rounded-xl">
                          <FiCheckCircle size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Publicado</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleApprove(r.id)}
                          className="flex items-center gap-2 bg-studio-text-title text-white px-4 py-2 rounded-xl hover:bg-studio-primary transition-all text-[9px] font-black uppercase tracking-widest shadow-xl shadow-studio-text-title/10"
                        >
                          <FiCheck size={14} /> Aprobar
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(r.id)}
                        className="p-3 bg-red-50 text-red-400 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Eliminar"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && !loading && (
          <div className="p-20 text-center space-y-4">
            <FiStar size={40} className="mx-auto text-studio-secondary/10" />
            <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em] opacity-30">
              No hay reseñas pendientes de moderación
            </p>
          </div>
        )}
      </div>
    </div>
  );
}