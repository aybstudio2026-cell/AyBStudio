import { FiGrid, FiImage, FiLayers, FiMonitor, FiBox } from 'react-icons/fi';

// Mapeo de iconos para categorías dinámicas
const iconMap = {
  'assets': FiImage,
  'apps': FiLayers,
  'software': FiMonitor,
  'stickers': FiBox,
  'all': FiGrid
};

export default function CategoryFilters({ categories, activeCategory, setActiveCategory }) {
  // Combinamos 'Todos' con las categorías de la DB
  const allCategories = [{ id: 'all', name: 'Todos' }, ...categories];

  return (
    <div className="flex flex-wrap gap-4 mb-12 justify-center">
      {allCategories.map((cat) => {
        // Obtenemos el icono del mapa o uno por defecto (FiBox)
        const Icon = iconMap[cat.name.toLowerCase()] || FiBox;
        
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name === 'Todos' ? 'all' : cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-sm border ${
              (activeCategory === cat.name || (activeCategory === 'all' && cat.name === 'Todos'))
                ? 'bg-digital-lavender text-white border-digital-lavender scale-105' 
                : 'bg-white text-panda-black/50 border-gray-100 hover:border-digital-lavender/30'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="capitalize">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}