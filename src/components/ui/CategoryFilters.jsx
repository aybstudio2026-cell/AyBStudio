import { FiGrid, FiBox, FiZap, FiMonitor, FiSmartphone, FiPackage } from 'react-icons/fi';
import { FaWindows, FaApple } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const iconMap = {
  'mac': FaApple,
  'windows': FaWindows,
  'movil': FiSmartphone,
  'android': FiSmartphone,
  'ios': FiSmartphone,
  'assets': FiZap,
  'apps': FiPackage,
  'web': FiMonitor,
  'all': FiGrid
};

export default function CategoryFilters({ categories, activeCategory, setActiveCategory }) {
  const allCategories = [{ id: 'all', name: 'Todos' }, ...categories];

  return (
    /* 
       CAMBIO CLAVE: 
       - flex-nowrap en móvil para forzar una sola fila.
       - overflow-x-auto para permitir el scroll lateral.
       - scrollbar-hide (clase opcional de tailwind) o estilos CSS para limpiar la vista.
    */
    <div className="flex overflow-x-auto md:flex-wrap no-scrollbar gap-3 mb-10 md:mb-16 justify-start md:justify-center max-w-7xl mx-auto px-6 pb-4 md:pb-0">
      {allCategories.map((cat, index) => {
        const categoryKey = cat.name.toLowerCase();
        const Icon = iconMap[categoryKey] || FiBox;
        
        const isActive = activeCategory === cat.name || (activeCategory === 'all' && cat.name === 'Todos');

        return (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveCategory(cat.name === 'Todos' ? 'all' : cat.name)}
            className={`
              /* flex-shrink-0 es vital para que los botones no se encojan en la fila */
              flex-shrink-0 flex items-center gap-2.5 px-5 md:px-6 py-3 md:py-3.5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] 
              transition-all duration-300 border shadow-sm active:scale-95
              ${isActive 
                ? 'bg-studio-primary text-white border-studio-primary shadow-lg shadow-studio-primary/25 translate-y-[-2px]' 
                : 'bg-white text-studio-secondary border-gray-100 hover:border-studio-primary/30 hover:text-studio-text-title hover:shadow-md'
              }
            `}
          >
            <Icon size={14} className={isActive ? "text-white" : "text-studio-primary"} />
            <span>{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}