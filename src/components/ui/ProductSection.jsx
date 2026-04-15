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

  // Filtramos SOLO por categoría
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
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-panda-black mb-4 uppercase tracking-tighter">Nuestros Productos</h2>
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
    </section>
  );
}