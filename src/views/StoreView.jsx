import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiFilter, FiX, FiSearch, FiSliders, FiChevronDown, FiPlus } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoreView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(0);
  const [maxProductPrice, setMaxProductPrice] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  // Estado para mostrar/ocultar filtros en móvil
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      const { data: prodData, error } = await supabase
        .from('products')
        .select('*, categories(name), product_types(name)')
        .eq('state', true);

      if (!error && prodData) {
        setProducts(prodData);
        const max = Math.max(...prodData.map(p => p.price), 0);
        setMaxProductPrice(max);
        setPriceRange(max); 
      }
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

  const sortLabels = {
    'newest': 'Lo más nuevo',
    'low-price': 'Precio: Ascendente',
    'high-price': 'Precio: Descendente'
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 min-h-screen bg-studio-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* ENCABEZADO EDITORIAL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 md:mb-16">
          <div className="space-y-2 md:space-y-3">
            <p className="text-[8px] md:text-[10px] font-black text-studio-primary uppercase tracking-[0.4em]">
              The Full Ecosystem
            </p>
            <h1 className="text-4xl md:text-7xl font-black text-studio-text-title uppercase tracking-tighter leading-none italic">
              Catálogo <span className="text-studio-primary">Completo</span>
            </h1>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            {/* BOTÓN DE FILTROS (Solo móvil) */}
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex-1 flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-2xl border border-studio-border shadow-sm active:scale-95 transition-all"
            >
              <FiFilter size={14} className="text-studio-primary" />
              <span className="text-[10px] font-black text-studio-text-title uppercase tracking-[0.2em]">Filtros</span>
            </button>

            {/* DROPDOWN DE ORDEN */}
            <div className="relative z-30 flex-1 md:flex-none">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-studio-border shadow-flat group cursor-pointer transition-all hover:border-studio-primary/30 min-w-fit md:min-w-[220px] justify-between"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <FiSliders size={14} className="text-studio-primary group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-[10px] font-black text-studio-text-title uppercase tracking-[0.2em] whitespace-nowrap">
                    {sortLabels[sortBy]}
                  </span>
                </div>
                <FiChevronDown className={`text-studio-primary transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} size={14} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-white border border-studio-border rounded-2xl shadow-xl overflow-hidden p-2"
                  >
                    {Object.entries(sortLabels).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => { setSortBy(value); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          sortBy === value ? 'bg-studio-primary text-white shadow-lg' : 'text-studio-secondary hover:bg-studio-bg hover:text-studio-primary'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* SIDEBAR DE FILTROS */}
          <aside className={`lg:col-span-1 space-y-6 lg:sticky lg:top-32 h-fit ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-studio-border shadow-flat">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-secondary mb-6 md:mb-8 flex items-center gap-2">
                <FiFilter className="text-studio-primary" /> Categorías
              </h4>
              <div className="flex flex-col gap-2 md:gap-3">
                <button 
                  onClick={() => { setActiveCategory('all'); if(window.innerWidth < 1024) setShowMobileFilters(false); }}
                  className={`w-full text-left px-4 py-2.5 md:px-5 md:py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === 'all' ? 'bg-studio-text-title text-white translate-x-2' : 'bg-studio-bg text-studio-secondary hover:text-studio-primary'
                  }`}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.name); if(window.innerWidth < 1024) setShowMobileFilters(false); }}
                    className={`w-full text-left px-4 py-2.5 md:px-5 md:py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat.name ? 'bg-studio-text-title text-white translate-x-2' : 'bg-studio-bg text-studio-secondary hover:text-studio-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTRO DE PRESUPUESTO: Oculto en móvil con hidden md:block */}
            <div className="hidden md:block bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-studio-border shadow-flat">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-secondary">Presupuesto</h4>
                <div className="bg-studio-primary/10 px-3 py-1 rounded-lg">
                  <span className="text-xs font-black text-studio-primary">${priceRange}</span>
                </div>
              </div>
              <input 
                type="range" min="0" max={maxProductPrice} step="1"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-studio-bg rounded-lg appearance-none cursor-pointer accent-studio-primary"
              />
              <div className="flex justify-between mt-4 text-[9px] font-black text-studio-secondary/40 uppercase tracking-widest">
                <span>$0</span>
                <span>${maxProductPrice}+</span>
              </div>
            </div>

            <button 
              onClick={() => { setActiveCategory('all'); setPriceRange(maxProductPrice); setShowMobileFilters(false); }}
              className="w-full py-2 text-[9px] font-black uppercase tracking-[0.4em] text-studio-secondary/30 hover:text-red-400 transition-colors flex items-center justify-center gap-2 group"
            >
              <FiX className="group-hover:rotate-90 transition-transform" /> Resetear filtros
            </button>
          </aside>

          {/* GRID DE PRODUCTOS */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-white rounded-3xl animate-pulse border border-studio-border" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode='popLayout'>
                {filteredProducts.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center border border-studio-border flex flex-col items-center justify-center space-y-4 md:space-y-6 shadow-flat" >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-studio-bg rounded-full flex items-center justify-center text-studio-secondary/20">
                      <FiSearch size={32} />
                    </div>
                    <p className="text-[9px] md:text-[10px] font-black text-studio-secondary uppercase tracking-[0.4em]">
                      Sin resultados
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                    {filteredProducts.map(product => (
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
                  </div>
                )}
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}