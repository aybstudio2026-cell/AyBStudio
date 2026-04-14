import { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';
import CategoryFilters from './CategoryFilters';
import ProductCard from './ProductCard';

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // 1. Traer Categorías para los filtros
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // 2. Traer Productos con sus relaciones
      const { data: prodData, error } = await supabase
        .from('products')
        .select(`
          *,
          categories ( name ),
          product_types ( name )
        `)
        .eq('state', true);

      if (error) {
        console.error("Error:", error);
      } else {
        setProducts(prodData);
      }
      
      setLoading(false);
    }

    fetchData();
  }, []);

  // Filtrado lógico en el cliente
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.categories?.name === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-panda-black mb-4 uppercase tracking-tighter">Nuestros Productos</h2>
        <p className="text-panda-black/50 font-medium italic">Recursos creativos y herramientas digitales de alto impacto.</p>
      </div>

      <CategoryFilters 
        categories={categories}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-100 rounded-kawaii" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex justify-end mt-10">
        <button className="flex items-center gap-2 text-[10px] font-bold text-panda-black/30 hover:text-digital-lavender transition-all group uppercase tracking-[0.3em]">
          <span>Ver catálogo completo</span>
          <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300 ease-out" />
        </button>
      </div>
    </section>
  );
}