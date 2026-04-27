import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { supabase } from "../../supabaseClient";

export default function NewsCarousel() {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('state', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error:', error);
      } else {
        setNews(data);
      }
      setLoading(false);
    }
    fetchNews();
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % news.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + news.length) % news.length);

  if (loading) return (
    <section className="relative w-full h-[600px] bg-studio-bg flex items-center justify-center pt-20">
      <div className="w-10 h-10 border-2 border-studio-primary border-t-transparent rounded-full animate-spin"></div>
    </section>
  );

  if (news.length === 0) return null;

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-transparent pt-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={news[index].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Cambia opacity-10 por opacity-25 si quieres que el color sea más vibrante */}
          <div className={`absolute inset-0 opacity-25 bg-gradient-to-br ${news[index].color_gradient}`} /> 
          
          <div className="w-full max-w-7xl mx-auto px-6 h-full grid grid-cols-1 md:grid-cols-2 items-center gap-16">
            
            {/* Columna de Texto */}
            <div className="flex flex-col justify-center h-full z-10 py-12">
              <div className="space-y-8">
                <motion.span 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="inline-block px-4 py-1.5 bg-studio-primary/10 text-studio-primary rounded-lg text-[10px] font-black uppercase tracking-[0.4em]"
                >
                  {news[index].slogan || "Featured News"}
                </motion.span>
                
                <div className="space-y-4">
                  <motion.h1 
                    key={`title-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl md:text-7xl font-black text-studio-text-title leading-[0.95] tracking-tighter italic uppercase"
                  >
                    {news[index].title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-studio-secondary max-w-lg font-medium italic opacity-70"
                  >
                    {news[index].description}
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Columna de Imagen */}
            <div className="relative flex justify-center items-center h-full">
              <motion.div
                key={`img-${index}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full flex justify-center"
              >
                <img 
                  src={news[index].image_url}
                  className="w-full max-w-[500px] aspect-video object-cover rounded-[2.5rem] shadow-2xl shadow-studio-text-title/10 border border-white/20"
                  alt="News"
                />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-studio-primary/5 rounded-full blur-3xl z-0"></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles de Navegación */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
        <button 
          onClick={prevSlide} 
          className="text-studio-text-title/30 hover:text-studio-primary transition-colors active:scale-90"
        >
          <FiChevronLeft size={28} />
        </button>
        
        <div className="flex gap-3">
          {news.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === i 
                  ? 'w-10 bg-studio-primary' 
                  : 'w-2 bg-studio-text-title/10 hover:bg-studio-text-title/30'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide} 
          className="text-studio-text-title/30 hover:text-studio-primary transition-colors active:scale-90"
        >
          <FiChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}