import React, { useState } from 'react';
import { Type, Copy, Check, Shuffle, ChevronRight } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const SAMPLE = 'el diseño es la solución silenciosa a problemas que aún no conocemos';

// Conversores
const converters = {
  upper: {
    label: 'MAYÚSCULAS',
    sub: 'UPPERCASE',
    example: 'HOLA MUNDO',
    fn: (t) => t.toUpperCase(),
  },
  lower: {
    label: 'minúsculas',
    sub: 'lowercase',
    example: 'hola mundo',
    fn: (t) => t.toLowerCase(),
  },
  title: {
    label: 'Title Case',
    sub: 'Cada Palabra',
    example: 'Hola Mundo',
    fn: (t) =>
      t.toLowerCase().replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase()),
  },
  sentence: {
    label: 'Sentence case',
    sub: 'Primera letra',
    example: 'Hola mundo aquí',
    fn: (t) => {
      const s = t.toLowerCase();
      return s.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    },
  },
  camel: {
    label: 'camelCase',
    sub: 'JavaScript vars',
    example: 'holaMundoAquí',
    fn: (t) =>
      t
        .toLowerCase()
        .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+(.)/g, (_, c) => c.toUpperCase()),
  },
  pascal: {
    label: 'PascalCase',
    sub: 'Clases / React',
    example: 'HolaMundoAquí',
    fn: (t) => {
      const camel = t
        .toLowerCase()
        .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+(.)/g, (_, c) => c.toUpperCase());
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    },
  },
  snake: {
    label: 'snake_case',
    sub: 'Python / DB',
    example: 'hola_mundo_aqui',
    fn: (t) =>
      t
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, ''),
  },
  kebab: {
    label: 'kebab-case',
    sub: 'CSS / URLs',
    example: 'hola-mundo-aqui',
    fn: (t) =>
      t
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
  },
  alternating: {
    label: 'aLtErNaDo',
    sub: 'Sarcastic',
    example: 'hOlA mUnDo',
    fn: (t) =>
      t
        .toLowerCase()
        .split('')
        .map((c, i) => (i % 2 === 0 ? c : c.toUpperCase()))
        .join(''),
  },
  inverse: {
    label: 'iNVERSO',
    sub: 'Invertir',
    example: 'HOLA mUNDO',
    fn: (t) =>
      t
        .split('')
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join(''),
  },
};

const CaseConverter = () => {
  const [input, setInput] = useState('');
  const [active, setActive] = useState('upper');
  const [copied, setCopied] = useState(false);

  const output = input ? converters[active].fn(input) : '';

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvert = (key) => {
    setActive(key);
    setCopied(false);
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Case"
        accent="Converter"
        subtitle="Transforma texto entre todos los formatos de capitalización al instante."
      />

      <div className="max-w-5xl mx-auto px-6 mb-16 space-y-5">

        {/* Mode selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.entries(converters).map(([key, { label, sub, example }]) => (
            <button
              key={key}
              onClick={() => handleConvert(key)}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group
                ${active === key
                  ? 'border-studio-primary bg-white shadow-md'
                  : 'border-gray-100 bg-white hover:border-studio-primary/40 hover:shadow-sm'}`}
            >
              {active === key && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-studio-primary" />
              )}
              <span className={`block text-xs font-black tracking-tight leading-tight mb-0.5
                ${active === key ? 'text-studio-primary' : 'text-gray-700'}`}>
                {label}
              </span>
              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-2">{sub}</span>
              <span className="block text-[9px] font-mono text-gray-300 truncate">{example}</span>
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Input */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-3 bg-studio-bg border-b border-gray-100 flex items-center justify-between">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Texto original</span>
              <div className="flex items-center gap-3">
                {input
                  ? <button onClick={() => setInput('')} className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors">Limpiar</button>
                  : <button onClick={() => setInput(SAMPLE)} className="text-[9px] font-black text-studio-primary uppercase tracking-widest hover:opacity-70 transition-opacity">Ejemplo</button>
                }
              </div>
            </div>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setCopied(false); }}
              placeholder="Escribe o pega tu texto aquí..."
              className="flex-1 min-h-[200px] p-7 text-sm text-gray-700 font-medium leading-relaxed resize-none border-none outline-none bg-white placeholder:text-gray-300"
              spellCheck={false}
            />
            <div className="px-6 py-2 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[8px] font-bold text-gray-300">{input.length} chars</span>
              <ChevronRight size={14} className="text-studio-primary animate-pulse" />
            </div>
          </div>

          {/* Output */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-3 bg-studio-bg border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-studio-primary uppercase tracking-widest">
                  {converters[active].label}
                </span>
                <span className="text-[8px] text-gray-300 font-bold">— {converters[active].sub}</span>
              </div>
              <span className="text-[8px] font-bold text-gray-300">{output.length} chars</span>
            </div>

            <div className="flex-1 min-h-[200px] p-7 overflow-auto">
              {output ? (
                <p className="text-sm text-gray-700 font-medium leading-relaxed break-words whitespace-pre-wrap select-all">
                  {output}
                </p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <Type size={28} className="text-gray-200 mb-3" />
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">
                    El resultado aparecerá aquí
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-gray-50">
              <button
                onClick={copy}
                disabled={!output}
                className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 active:scale-95
                  ${copied
                    ? 'bg-green-50 border-green-200 text-green-600'
                    : 'bg-white border-studio-primary text-studio-primary hover:bg-studio-bg disabled:opacity-30 disabled:cursor-not-allowed'}`}
              >
                {copied
                  ? <><Check size={14} /> ¡Copiado!</>
                  : <><Copy size={14} /> Copiar resultado</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Quick reference */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Referencia rápida de usos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { format: 'UPPERCASE',  use: 'Títulos, énfasis, constantes' },
              { format: 'camelCase',  use: 'Variables JS, funciones, objetos' },
              { format: 'PascalCase', use: 'Clases, componentes React' },
              { format: 'snake_case', use: 'Python, bases de datos, archivos' },
              { format: 'kebab-case', use: 'CSS, URLs, atributos HTML' },
              { format: 'Title Case', use: 'Títulos de artículos, libros' },
              { format: 'Sentence',   use: 'Textos, párrafos normales' },
              { format: 'aLtErNaDo', use: 'Memes, contenido sarcástico' },
            ].map(({ format, use }) => (
              <div key={format} className="bg-studio-bg rounded-xl p-3">
                <span className="block text-[9px] font-black text-studio-primary mb-1">{format}</span>
                <span className="block text-[9px] text-gray-500 leading-tight">{use}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <FeaturesSection
        title="Cómo usar el convertidor"
        description="Cambia entre formatos de capitalización en un clic. Ideal para programadores que necesitan adaptar nombres de variables, o escritores que quieren normalizar su texto."
        steps={[
          'Escribe o pega tu texto en el panel izquierdo.',
          'Selecciona el formato de salida que necesitas en los botones superiores.',
          'Copia el resultado transformado al portapapeles con un clic.',
        ]}
      />
    </div>
  );
};

export default CaseConverter;