import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiFilter, FiX, FiSearch, FiSliders } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import { motion } from 'framer-motion';

export default function StoreView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100);
  const [sortBy, setSortBy] = useState('newest');

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

  const filteredProducts = products
    .filter(p => (activeCategory === 'all' || p.categories?.name === activeCategory))
    .filter(p => p.price <= priceRange)
    .sort((a, b) => {
      if (sortBy === 'low-price') return a.price - b.price;
      if (sortBy === 'high-price') return b.price - a.price;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-soft-snow">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black text-panda-black uppercase tracking-tighter leading-none">
              Catálogo <span className="text-digital-lavender">Completo</span>
            </h1>
            <p className="text-[10px] font-black text-panda-black/30 uppercase tracking-[0.3em]">
              Explora todo el ecosistema de A&B Studio
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <FiSliders className="text-digital-lavender" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-panda-black bg-transparent outline-none cursor-pointer pr-4"
            >
              <option value="newest">Lo más nuevo</option>
              <option value="low-price">Precio: Menor a Mayor</option>
              <option value="high-price">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* SIDEBAR DE FILTROS */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-32 h-fit">
            
            {/* Caja de Categorías */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-panda-black/40 mb-6 flex items-center gap-2">
                <FiFilter /> Categorías
              </h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === 'all' 
                      ? 'bg-panda-black text-white shadow-lg shadow-panda-black/20 scale-[1.02]' 
                      : 'bg-soft-snow text-panda-black/50 hover:bg-gray-100'
                  }`}
                >
                  Todos los productos
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                      activeCategory === cat.name 
                        ? 'bg-panda-black text-white shadow-lg shadow-panda-black/20 scale-[1.02]' 
                        : 'bg-soft-snow text-panda-black/50 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Caja de Rango de Precio */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-panda-black/40">Precio Máx.</h4>
                <span className="text-sm font-black text-digital-lavender">${priceRange}</span>
              </div>
              <input 
                type="range" min="0" max="200" step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-1.5 bg-soft-snow rounded-lg appearance-none cursor-pointer accent-digital-lavender"
              />
              <div className="flex justify-between mt-4 text-[9px] font-black text-panda-black/20 uppercase">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>

            <button 
              onClick={() => { setActiveCategory('all'); setPriceRange(100); }}
              className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-panda-black/20 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
            >
              <FiX /> Resetear filtros
            </button>
          </aside>

          {/* GRID DE PRODUCTOS */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-80 bg-white rounded-[2rem] animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-soft-snow rounded-full flex items-center justify-center text-panda-black/10">
                  <FiSearch size={32} />
                </div>
                <p className="italic text-panda-black/20 font-bold uppercase text-xs tracking-widest">
                  No hay productos con estos filtros
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}