// src/views/admin/AdminReviews.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  FiCheck, FiTrash2, FiMessageSquare, FiStar, 
  FiUser, FiPackage, FiLoader, FiCheckCircle, FiClock, FiX 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMeta, setToastMeta] = useState({ title: '', subtitle: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchReviewsPage(1);
  }, []);

  useEffect(() => {
    fetchReviewsPage(page);
  }, [page]);

  async function fetchReviewsPage(nextPage) {
    setLoading(true);
    const from = (nextPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const [pageResult, countResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('*, profiles(username, avatar_url), products(name)')
        .order('created_at', { ascending: false })
        .range(from, to),
      supabase.from('reviews').select('id', { count: 'exact', head: true })
    ]);

    if (pageResult.data) setReviews(pageResult.data);
    setTotalCount(countResult.count || 0);
    setLoading(false);
  }

  async function handleApprove(id) {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id);
    if (!error) {
      fetchReviewsPage(page);
      setToastMeta({ title: 'Reseña aprobada', subtitle: 'Se publicó correctamente' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    } else {
      alert('Error al aprobar: ' + error.message);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteLoading) return;
    setDeleteLoading(true);

    const { error } = await supabase.from('reviews').delete().eq('id', deleteTarget.id);
    if (!error) {
      const nextTotal = Math.max(0, totalCount - 1);
      const lastPage = Math.max(1, Math.ceil(nextTotal / pageSize));
      const nextPage = Math.min(page, lastPage);
      setPage(nextPage);
      fetchReviewsPage(nextPage);
      setToastMeta({ title: 'Reseña eliminada', subtitle: 'Se eliminó permanentemente' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    } else {
      alert('Error al eliminar: ' + error.message);
    }

    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
          <span className="text-[10px] font-black uppercase tracking-widest text-studio-secondary">Total: {totalCount} Feedbacks</span>
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
                        onClick={() => setDeleteTarget(r)}
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

      <div className="flex items-center justify-between bg-white border border-studio-border rounded-2xl px-6 py-4 shadow-sm">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary opacity-50">
          Página {page} de {totalPages}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl border border-studio-border bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title disabled:opacity-30 hover:bg-studio-bg transition-all"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl border border-studio-border bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title disabled:opacity-30 hover:bg-studio-bg transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleteLoading && setDeleteTarget(null)}
              className="absolute inset-0 bg-studio-text-title/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] border border-studio-border shadow-2xl p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-secondary opacity-60">Confirmación</p>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-studio-text-title mt-1">Eliminar reseña</h3>
                </div>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTarget(null)}
                  className="w-10 h-10 flex items-center justify-center bg-studio-bg rounded-xl text-studio-secondary hover:text-studio-primary transition-all disabled:opacity-40"
                >
                  <FiX size={18} />
                </button>
              </div>

              <p className="mt-4 text-[12px] font-bold text-studio-secondary">
                ¿Seguro que deseas eliminar esta reseña permanentemente?
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-3 rounded-xl border border-studio-border bg-white text-[10px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={confirmDelete}
                  className="px-4 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? <FiLoader className="animate-spin" /> : <FiTrash2 size={16} />}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            className="fixed top-24 right-6 z-[200] w-full max-w-[320px] bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center overflow-hidden"
          >
            <div className="w-1.5 h-16 bg-studio-primary shrink-0" />
            <div className="flex items-center gap-3 p-4 flex-1">
              <div className="bg-studio-primary/10 p-2 rounded-full shrink-0 text-studio-primary">
                <FiCheck size={18} />
              </div>
              <div className="flex-1 pr-6">
                <p className="font-bold text-studio-text-title text-sm leading-tight">{toastMeta.title}</p>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-wider mt-0.5">{toastMeta.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-2 right-2 p-1 hover:bg-studio-bg rounded-md transition-colors text-studio-secondary/40 hover:text-studio-secondary"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}