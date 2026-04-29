import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Percent, FileSpreadsheet, Binary, Table, Calendar } from 'lucide-react';
import { 
  FiImage, FiScissors, FiLayers, FiDroplet, FiGlobe,
  FiBox, FiZap, FiCode, FiLock, FiArrowRight, FiFileText, FiAlignLeft, FiType, FiMail
} from 'react-icons/fi';

const tools = [
  {
    id: 'image-converter',
    title: 'PNG a JPG',
    description: 'Procesamiento 100% local, sin subir nada a la nube.',
    icon: <FiImage />,
    path: '/tools/image-converter',
    category: 'Diseño',
    tag: 'Diseño'
  },
  {
    id: 'svg-optimizer',
    title: 'SVG Optimizer',
    description: 'Limpia código basura de vectores para máxima velocidad.',
    icon: <FiScissors />,
    path: '/tools/svg-optimizer',
    category: 'Dev',
    tag: 'Dev'
  },
  {
    id: 'favicon-gen',
    title: 'Favicon Studio',
    description: 'Iconos web y móvil multi-formato en segundos.',
    icon: <FiLayers />,
    path: '/tools/favicon-generator',
    category: 'Diseño',
    tag: 'Diseño'
  },
  {
    id: 'color-extractor',
    title: 'Color Extractor',
    description: 'Extrae paletas y códigos HEX de cualquier imagen.',
    icon: <FiDroplet />,
    path: '/tools/color-extractor',
    category: 'Diseño',
    tag: 'Diseño'
  },
  {
    id: 'placeholder-gen',
    title: 'Placeholder Gen',
    description: 'Imágenes de relleno personalizadas para prototipos.',
    icon: <FiBox />,
    path: '/tools/placeholder-gen',
    category: 'Diseño',
    tag: 'Diseño'
  },
  {
    id: 'image-compressor',
    title: 'Compresor',
    description: 'Reduce el peso sin sacrificar calidad visual.',
    icon: <FiZap />,
    path: '/tools/image-compressor',
    category: 'Diseño',
    tag: 'Diseño'
  },
  {
    id: 'json-validator',
    title: 'Validador JSON',
    description: 'Formatea y valida estructuras de datos al instante.',
    icon: <FiCode />,
    path: '/tools/json-validator',
    category: 'Dev',
    tag: 'Dev'
  },
  {
    id: 'password-gen',
    title: 'Gen. Claves',
    description: 'Contraseñas seguras con parámetros personalizados.',
    icon: <FiLock />,
    path: '/tools/password-generator',
    category: 'Seguridad',
    tag: 'Seguridad'
  },
  {
    id: 'word-to-pdf',
    title: 'Word a PDF',
    description: 'Convierte documentos .docx a PDF directo en tu navegador.',
    icon: <FiFileText />,
    path: '/tools/word-to-pdf',
    category: 'Docs',
    tag: 'Docs'
  },
  // TEXTO
  {
    id: 'word-counter',
    title: 'Contador',
    description: 'Palabras, caracteres y tiempo de lectura estimado.',
    icon: <FiAlignLeft />,
    path: '/tools/word-counter',
    category: 'Texto',
    tag: 'Texto'
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Transforma texto a UPPER, lower, camelCase, snake_case y más.',
    icon: <FiType />,
    path: '/tools/case-converter',
    category: 'Texto',
    tag: 'Texto'
  },
  {
    id: 'what-is-my-ip',
    title: '¿Cuál es mi IP?',
    description: 'Descubre tu dirección IP pública y privada.',
    icon: <FiGlobe />,
    path: '/tools/what-is-my-ip',
    category: 'Seguridad',
    tag: 'Seguridad'
  },
  {
    id: 'qr-code-generator',
    title: 'Generador QR',
    description: 'Crea códigos QR personalizados para cualquier enlace o texto.',
    icon: <QrCode size={18} />,
    path: '/tools/qr-code-generator',
    category: 'Diseño',
    tag: 'Diseño'
  },
  {
    id: 'tax-calculator',
    title: 'Calculadora de Impuestos',
    description: 'Calcula impuestos y montos netos de forma profesional.',
    icon: <Percent size={18} />,
    path: '/tools/tax-calculator',
    category: 'Dev',
    tag: 'Dev'
  },
  {
    id: 'json-to-csv',
    title: 'JSON a CSV',
    description: 'Convierte datos JSON a formato CSV para análisis y exportación.',
    icon: <FileSpreadsheet size={18} />,
    path: '/tools/json-to-csv',
    category: 'Dev',
    tag: 'Dev'
  },
  {
    id: 'text-to-binary',
    title: 'Texto a Binario',
    description: 'Convierte texto a binario y viceversa.',
    icon: <Binary size={18} />,
    path: '/tools/text-to-binary',
    category: 'Dev',
    tag: 'Dev'
  },
  {
    id: 'table-generator',
    title: 'Generador de Tablas',
    description: 'Crea tablas HTML con filas y columnas personalizadas.',
    icon: <Table size={18} />,
    path: '/tools/table-generator',
    category: 'Dev',
    tag: 'Dev'
  },
  {
    id: 'date-calculator',
    title: 'Calculadora de Fechas',
    description: 'Calcula la diferencia entre dos fechas.',
    icon: <Calendar size={18} />,
    path: '/tools/date-calculator',
    category: 'Dev',
    tag: 'Dev'
  },
  {
    id: 'og-preview',
    title: 'Previsualización Open Graph',
    description: 'Previsualiza cómo se verá tu contenido en redes sociales.',
    icon: <FiImage size={18} />,
    path: '/tools/og-preview',
    category: 'Diseño',
    tag: 'Diseño'
  }
];

const categories = ['Todas', 'Diseño', 'Dev', 'Docs', 'Texto', 'Seguridad'];
 
const tagColors = {
  Diseño:    'bg-pink-50 text-pink-400',
  Dev:       'bg-blue-50 text-blue-400',
  Docs:      'bg-amber-50 text-amber-500',
  Texto:     'bg-violet-50 text-violet-400',
  Seguridad: 'bg-green-50 text-green-500',
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

export default function ToolsCatalog() {
  const [activeCategory, setActiveCategory] = useState('Todas');

  const filteredTools = activeCategory === 'Todas'
    ? tools
    : tools.filter(t => t.category === activeCategory);

  return (
    <div className="pt-36 pb-24 min-h-screen bg-studio-bg px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-studio-text-title uppercase tracking-tighter italic leading-none mb-5">
              Herramientas{' '}
              <span className="text-studio-primary text-outline">Digitales</span>
            </h1>
            <p className="text-xs font-medium text-studio-secondary italic max-w-md mx-auto leading-relaxed">
              Soluciones rápidas y eficientes diseñadas para potenciar tu flujo creativo.
            </p>
          </motion.div>
        </header>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                relative px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-studio-text-title text-white shadow-md scale-105'
                  : 'bg-white text-studio-secondary/50 hover:bg-gray-50 border border-gray-100 hover:scale-105'}
              `}
            >
              {cat}
              {activeCategory === cat && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 rounded-full bg-studio-text-title -z-10"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Contador */}
        <div className="text-center mb-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-studio-secondary/30">
            {filteredTools.length} herramienta{filteredTools.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid — 2 cols mobile / 3 tablet / 4 desktop */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <Link
                  to={tool.path}
                  className="group block bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full"
                >
                  {/* Icono + Tag */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-10 h-10 bg-studio-bg rounded-xl flex items-center justify-center text-studio-primary text-lg group-hover:bg-studio-primary group-hover:text-white transition-all duration-300 shrink-0">
                      {tool.icon}
                    </div>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${tagColors[tool.tag] ?? 'bg-gray-100 text-gray-400'}`}>
                      {tool.tag}
                    </span>
                  </div>

                  {/* Texto */}
                  <h2 className="text-sm font-black text-studio-text-title uppercase italic tracking-tight mb-1.5 group-hover:text-studio-primary transition-colors leading-tight">
                    {tool.title}
                  </h2>
                  <p className="text-[10px] font-medium text-studio-secondary/70 italic leading-relaxed mb-5">
                    {tool.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-[9px] font-black text-studio-primary uppercase tracking-widest">
                    Probar
                    <FiArrowRight className="ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>

                  {/* Decoración hover */}
                  <div className="absolute -right-3 -bottom-3 text-studio-bg/60 text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {tool.icon}
                  </div>

                  {/* Línea accent inferior */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-studio-primary group-hover:w-full transition-all duration-300 rounded-b-2xl" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}