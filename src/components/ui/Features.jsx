import { FiZap, FiCode, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';

const features = [
  { 
    icon: FiPackage, 
    title: "Apps & Utilities", 
    desc: "Software minimalista diseñado para eliminar la fricción en tu flujo de trabajo diario." 
  },
  { 
    icon: FiZap, 
    title: "Digital Assets", 
    desc: "Recursos visuales de alta gama y de gran estética para creadores que cuidan cada detalle." 
  },
  { 
    icon: FiCode, 
    title: "Custom Dev", 
    desc: "Arquitectura limpia y alto rendimiento para proyectos que requieren una firma técnica única." 
  }
];

export default function Features() {
  return (
    <section className="py-12 md:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-row md:flex-col items-center md:items-center text-left md:text-center p-5 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-studio-bg hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-studio-text-title/5 transition-all duration-500 gap-5 md:gap-0"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-studio-primary/10 rounded-2xl flex items-center justify-center text-studio-primary md:mb-8 group-hover:scale-110 group-hover:bg-studio-primary group-hover:text-white transition-all duration-500">
                <f.icon size={24} className="md:size-[26px]" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-sm md:text-xl font-black text-studio-text-title mb-1 md:mb-4 uppercase tracking-tighter italic">
                  {f.title}
                </h3>

                <p className="text-[11px] md:text-sm font-medium text-studio-secondary leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}