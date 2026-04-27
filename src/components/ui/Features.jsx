import { FiLayers, FiZap, FiCode, FiPackage } from 'react-icons/fi';
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
    <section className="py-15 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              // Añadimos items-center y text-center para centrar el contenido
              className="group p-10 rounded-[2.5rem] bg-studio-bg hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-studio-text-title/5 transition-all duration-500 flex flex-col items-center text-center"
            >
              {/* Contenedor del Icono Centrado */}
              <div className="w-16 h-16 bg-studio-primary/10 rounded-2xl flex items-center justify-center text-studio-primary mb-8 group-hover:scale-110 group-hover:bg-studio-primary group-hover:text-white transition-all duration-500">
                <f.icon size={26} />
              </div>

              {/* Título Estilo Studio Centrado */}
              <h3 className="text-xl font-black text-studio-text-title mb-4 uppercase tracking-tighter">
                {f.title}
              </h3>

              {/* Descripción Centrada */}
              <p className="text-sm font-medium text-studio-secondary leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}