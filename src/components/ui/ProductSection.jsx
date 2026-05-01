import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import CategoryFilters from './CategoryFilters';
import ProductCard from './ProductCard';

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const filteredProducts = products.filter(product => {
    return activeCategory === 'all' || product.categories?.name === activeCategory;
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      const { data: prodData, error } = await supabase
        .from('products')
        .select('*, categories(name), product_types(name)')
        .eq('state', true);

      if (!error) setProducts(prodData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 bg-studio-bg/50">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="text-center mb-10 md:mb-16 space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black text-studio-text-title tracking-tighter italic uppercase"
        >
          Nuestros <span className="text-studio-primary text-outline-studio">Productos</span>
        </motion.h2>
        <p className="text-[8px] md:text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em] opacity-50">
          Productos digitales de alta calidad
        </p>
      </div>

      {/* FILTROS */}
      <CategoryFilters 
        categories={categories}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {/* GRID DE PRODUCTOS: Cambiado a grid-cols-2 en móvil */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl md:rounded-[2.5rem]" />
              <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div 
            layout
            /* CAMBIO CLAVE: grid-cols-2 y gap-3 para móvil */
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProducts.slice(0, 4).map(product => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* BOTÓN EXPLORAR */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-12 md:mt-16 flex justify-center">
              <Link 
                to="/tienda"
                className="group flex items-center gap-3 text-studio-secondary hover:text-studio-primary transition-all"
              >
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
                  Explorar catálogo completo
                </span>
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-studio-primary group-hover:bg-studio-primary group-hover:text-white transition-all">
                  <FiArrowRight size={12} />
                </div>
              </Link>
            </div>
          )}
        </>
      )}

      {/* ESTADO VACÍO */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-studio-secondary font-bold uppercase text-[10px] tracking-widest opacity-40">
            No se encontraron productos
          </p>
        </div>
      )}
    </section>
  );
}