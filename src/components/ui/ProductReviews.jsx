import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiStar, FiSend, FiUser, FiMessageCircle, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(username, avatar_url)')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Inicia sesión para dejar una reseña");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment.trim()
    });

    if (error) {
      console.error(error);
      alert("Error al enviar la reseña");
    } else {
      setMessage("¡Gracias! Tu reseña está en moderación.");
      setComment('');
      setRating(5);
      setTimeout(() => setMessage(null), 5000);
    }
    setIsSubmitting(false);
  }

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* HEADER DE RESEÑAS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-6 gap-4">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-studio-text-title uppercase tracking-tighter italic leading-none">
            Experiencias <span className="text-studio-primary">&</span> Feedback
          </h3>
          <p className="text-[9px] md:text-[10px] font-black text-studio-secondary uppercase tracking-[0.3em] opacity-40">
            Opiniones de la comunidad creativa
          </p>
        </div>
        <div className="flex items-center gap-2 bg-studio-bg px-4 py-2 rounded-xl md:rounded-2xl border border-gray-50">
          <FiMessageCircle className="text-studio-primary" size={14} />
          <span className="text-[10px] md:text-xs font-black text-studio-text-title">{reviews.length} Reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        
        {/* FORMULARIO DE RESEÑA */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-32">
            <form 
              onSubmit={handleSubmit} 
              className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-50 shadow-xl shadow-studio-text-title/5 space-y-5 md:space-y-6"
            >
              <div className="space-y-3">
                <p className="text-[9px] md:text-[10px] font-black text-studio-secondary uppercase tracking-widest text-center">Califica este producto</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(num)}
                      className="transition-transform active:scale-90"
                    >
                      <FiStar 
                        size={22} 
                        className={`transition-colors ${
                          num <= (hoverRating || rating) ? "text-amber-400" : "text-gray-100"
                        }`}
                        fill={num <= (hoverRating || rating) ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Cómo ha mejorado tu flujo de trabajo?"
                className="w-full bg-studio-bg border-none rounded-2xl p-4 text-sm text-studio-text-body outline-none focus:ring-2 focus:ring-studio-primary/20 resize-none h-28 md:h-32 transition-all placeholder:text-studio-secondary/30 font-medium"
              />

              <button 
                disabled={isSubmitting}
                className="w-full bg-studio-text-title text-white font-black py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-studio-primary transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : <><FiSend /> Publicar Review</>}
              </button>

              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-4 bg-studio-primary/5 text-studio-primary rounded-xl text-[9px] font-bold uppercase leading-tight"
                  >
                    <FiCheckCircle size={14} className="shrink-0" />
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* LISTA DE RESEÑAS */}
        <div className="lg:col-span-2">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-10 md:p-12 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <FiMessageCircle size={32} className="text-gray-100 mb-4" />
              <p className="text-[10px] md:text-sm font-bold text-studio-secondary/40 uppercase tracking-widest">Sé el primero en opinar</p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {/* Ajuste de scroll solo para escritorio */}
              <div 
                className="md:max-h-[520px] md:overflow-y-auto md:-mx-4 md:px-4 pb-4 md:pb-8 space-y-4 md:space-y-6 custom-scrollbar"
              >
                {reviews.slice(0, visibleCount).map((r) => (
                  <motion.div 
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-gray-50 shadow-md shadow-studio-text-title/5 flex flex-col gap-4 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-studio-bg rounded-full flex items-center justify-center text-studio-secondary border border-gray-100 overflow-hidden shrink-0">
                          {r.profiles?.avatar_url ? (
                            <img src={r.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FiUser size={16} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-black text-studio-text-title tracking-tight italic">
                            {r.profiles?.username || "Usuario Studio"}
                          </h4>
                          <div className="flex gap-0.5 text-amber-400">
                            {[...Array(r.rating)].map((_, i) => (
                              <FiStar key={i} size={10} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[8px] md:text-[9px] font-black text-studio-secondary/30 uppercase">
                        {new Date(r.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <p className="text-studio-text-body text-xs md:text-sm leading-relaxed font-medium">
                      "{r.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Botón Ver Más */}
              {reviews.length > visibleCount && (
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={handleShowMore}
                    className="flex items-center gap-2 text-[10px] md:text-[11px] font-black text-studio-primary uppercase tracking-[0.2em] hover:text-studio-text-title transition-all group"
                  >
                    Ver más reseñas <FiChevronDown size={14} className="group-hover:translate-y-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}