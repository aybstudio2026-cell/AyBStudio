import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react'; // 1. Añadimos useEffect
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { supabase } from "../../supabaseClient"; // 2. Importamos el cliente

export default function NewsCarousel() {
  const [news, setNews] = useState([]); // Cambiamos newsItems por un estado
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 3. Lógica para traer los datos de Supabase
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

  // Funciones de navegación (ahora usan el estado 'news')
  const nextSlide = () => setIndex((prev) => (prev + 1) % news.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + news.length) % news.length);

  // 4. Pantalla de carga mientras conectamos
  if (loading) return (
    <section className="relative w-full h-[600px] bg-soft-snow flex items-center justify-center pt-20">
      <div className="w-12 h-12 border-4 border-digital-lavender border-t-transparent rounded-full animate-spin"></div>
    </section>
  );

  // Si no hay noticias, no mostramos el componente
  if (news.length === 0) return null;

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-soft-snow pt-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={news[index].id} // Usamos el ID de la base de datos como key
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 w-full h-full bg-gradient-to-br ${news[index].color_gradient}`}
        >
          <div className="w-full max-w-7xl mx-auto px-6 h-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            
            {/* Columna de Texto */}
            <div className="flex flex-col justify-center h-full z-10 py-12">
              <div className="space-y-6">
                <motion.span 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm text-digital-lavender rounded-full text-sm font-black shadow-sm"
                >
                  {news[index].slogan}
                </motion.span>
                
                <div className="min-h-[120px] md:min-h-[160px] flex items-center">
                    <motion.h1 
                    key={`title-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black text-panda-black leading-[1.1] tracking-tighter"
                    >
                    {news[index].title}
                    </motion.h1>
                </div>
                
                <div className="min-h-[60px]">
                    <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-panda-black/60 max-w-lg font-medium italic"
                    >
                    {news[index].description}
                    </motion.p>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-panda-black text-white font-bold py-4 px-10 rounded-full shadow-xl hover:bg-panda-black/90 transition-all w-fit"
                >
                  Ver Detalles
                </motion.button>
              </div>
            </div>

            {/* Columna de Imagen */}
            <div className="relative flex justify-center items-center h-full">
              <motion.div
                key={`img-${index}`}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full flex justify-center"
              >
                <img 
                  src={news[index].image_url} // Ajustado al nombre de columna en la DB
                  className="w-full max-w-[450px] aspect-video object-cover rounded-kawaii shadow-2xl border-8 border-white/50"
                  alt="Promo"
                />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/30 rounded-full blur-3xl z-0"></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles de Navegación */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button onClick={prevSlide} className="p-2 rounded-full bg-white/50 hover:bg-white shadow-sm transition-all cursor-pointer">
          <FiChevronLeft className="w-6 h-6 text-panda-black" />
        </button>
        
        <div className="flex gap-2">
          {news.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${index === i ? 'w-8 bg-panda-black' : 'w-2 bg-panda-black/20'}`}
            />
          ))}
        </div>

        <button onClick={nextSlide} className="p-2 rounded-full bg-white/50 hover:bg-white shadow-sm transition-all cursor-pointer">
          <FiChevronRight className="w-6 h-6 text-panda-black" />
        </button>
      </div>
    </section>
  );
}