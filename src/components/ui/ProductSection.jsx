import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi'; // Importamos la flecha
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
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
    <section className="max-w-7xl mx-auto px-6 py-15 bg-studio-bg/50">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="text-center mb-16 space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-black text-studio-text-title tracking-tighter italic uppercase"
        >
          Nuestros <span className="text-studio-primary text-outline-studio">Productos</span>
        </motion.h2>
        <p className="text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em] opacity-50">
          Productos digitales de alta calidad
        </p>
      </div>

      {/* FILTROS */}
      <CategoryFilters 
        categories={categories}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {/* GRID DE PRODUCTOS */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-[2.5rem]" />
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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

          {/* BOTÓN DISCRETO */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-16 flex justify-center">
              <Link 
                to="/tienda"
                className="group flex items-center gap-3 text-studio-secondary hover:text-studio-primary transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Explorar catálogo completo
                </span>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-studio-primary group-hover:bg-studio-primary group-hover:text-white transition-all">
                  <FiArrowRight size={14} />
                </div>
              </Link>
            </div>
          )}
        </>
      )}

      {/* ESTADO VACÍO */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-studio-secondary font-bold uppercase text-xs tracking-widest opacity-40">
            No se encontraron productos en esta categoría
          </p>
        </div>
      )}
    </section>
  );
}