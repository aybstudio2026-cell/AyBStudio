import React, { useState, useMemo } from 'react';
import { Type, Clock, BarChart2, Trash2 } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const SAMPLE = `El diseño es la solución silenciosa a problemas que aún no sabemos que tenemos. Cada píxel, cada tipografía y cada espacio en blanco comunica algo antes de que el usuario lea una sola palabra.`;

const CounterCard = ({ label, value, sub, accent }) => (
  <div className={`bg-white rounded-2xl border p-5 flex flex-col gap-1 shadow-sm transition-all
    ${accent ? 'border-studio-primary/30 bg-studio-primary/5' : 'border-gray-100'}`}>
    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{label}</span>
    <span className={`text-3xl font-black tabular-nums leading-none ${accent ? 'text-studio-primary' : 'text-gray-800'}`}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </span>
    {sub && <span className="text-[9px] font-medium text-gray-400">{sub}</span>}
  </div>
);

const WordCounter = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const raw = text;
    const chars          = raw.length;
    const charsNoSpaces  = raw.replace(/\s/g, '').length;
    const words          = raw.trim() === '' ? 0 : raw.trim().split(/\s+/).length;
    const sentences      = raw.trim() === '' ? 0 : (raw.match(/[^.!?]*[.!?]+/g) || []).length;
    const paragraphs     = raw.trim() === '' ? 0 : raw.split(/\n\s*\n/).filter(p => p.trim()).length || (raw.trim() ? 1 : 0);
    const lines          = raw === '' ? 0 : raw.split('\n').length;

    // Lectura promedio: 200 palabras/min (lectura normal), 130 wpm (lectura en voz alta)
    const readMin  = Math.ceil(words / 200);
    const speakMin = Math.ceil(words / 130);

    const readTime  = words < 200
      ? `~${Math.max(1, Math.round(words / 200 * 60))} seg`
      : readMin === 1 ? '~1 min' : `~${readMin} min`;

    const speakTime = words < 130
      ? `~${Math.max(1, Math.round(words / 130 * 60))} seg`
      : speakMin === 1 ? '~1 min' : `~${speakMin} min`;

    // Top palabras (excluye stopwords cortas)
    const stopwords = new Set(['de','la','el','en','y','a','que','los','las','un','una','es','se','del','por','con','no','al','su','para','como','más','pero','sus','le','ya','o','fue','este','ha','sí','lo','si','sobre','este','esta','entre','cuando','muy','sin','sobre','también','me','hasta','hay','donde','quien','desde','todo','nos','durante','todos','uno','les','ni','contra','otros','ese','eso','ante','ellos','e','esto','mí','antes','algunos','qué','unos','yo','otro','otras','otra','él','tanto','esa','estos','mucho','quienes','nada','muchos','cual','poco','ella','estar','estas','algunas','algo','nosotros','mi','mis','tú','te','ti','tu','tus','vosotros','vosotras','os','mío','mía','míos','mías','tuyo','tuya','tuyos','tuyas','suyo','suya','suyos','suyas','nuestro','nuestra','nuestros','nuestras','vuestro','vuestra','vuestros','vuestras','the','a','an','is','in','it','of','to','and','that','this']);

    const wordFreq = {};
    raw.toLowerCase().match(/[a-záéíóúüñ]{3,}/g)?.forEach(w => {
      if (!stopwords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readTime, speakTime, topWords };
  }, [text]);

  const density = stats.chars > 0 ? Math.round((stats.charsNoSpaces / stats.chars) * 100) : 0;

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Contador de"
        accent="Palabras"
        subtitle="Analiza tu texto: caracteres, palabras, frases y tiempo estimado de lectura."
      />

      <div className="max-w-5xl mx-auto px-6 mb-16 space-y-6">

        {/* Textarea */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-3 bg-studio-bg border-b border-gray-100 flex items-center justify-between">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tu texto</span>
            <div className="flex items-center gap-3">
              {text && (
                <button
                  onClick={() => setText('')}
                  className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors"
                >
                  <Trash2 size={11} /> Limpiar
                </button>
              )}
              {!text && (
                <button
                  onClick={() => setText(SAMPLE)}
                  className="text-[9px] font-black text-studio-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                  Cargar ejemplo
                </button>
              )}
            </div>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Pega o escribe tu texto aquí..."
            className="w-full h-52 p-7 text-sm text-gray-700 font-medium leading-relaxed resize-none border-none outline-none bg-white placeholder:text-gray-300"
            spellCheck={false}
          />
          {/* Mini progress bar based on word count */}
          <div className="h-0.5 bg-gray-50">
            <div
              className="h-full bg-studio-primary/40 transition-all duration-300"
              style={{ width: `${Math.min(100, (stats.words / 500) * 100)}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <CounterCard label="Caracteres"          value={stats.chars}         accent />
          <CounterCard label="Sin espacios"        value={stats.charsNoSpaces} />
          <CounterCard label="Palabras"            value={stats.words}         accent />
          <CounterCard label="Oraciones"           value={stats.sentences}     />
          <CounterCard label="Párrafos"            value={stats.paragraphs}    />
          <CounterCard label="Líneas"              value={stats.lines}         />
        </div>

        {/* Tiempo de lectura + densidad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-studio-bg rounded-xl flex items-center justify-center text-studio-primary shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Tiempo de lectura</span>
              <span className="text-xl font-black text-gray-800">{stats.readTime}</span>
              <span className="text-[9px] text-gray-400 block">200 palabras/min</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-studio-bg rounded-xl flex items-center justify-center text-studio-primary shrink-0">
              <Type size={22} />
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Tiempo hablado</span>
              <span className="text-xl font-black text-gray-800">{stats.speakTime}</span>
              <span className="text-[9px] text-gray-400 block">130 palabras/min</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-studio-bg rounded-xl flex items-center justify-center text-studio-primary shrink-0">
              <BarChart2 size={22} />
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Densidad de texto</span>
              <span className="text-xl font-black text-gray-800">{density}%</span>
              <span className="text-[9px] text-gray-400 block">chars sin espacios / total</span>
            </div>
          </div>
        </div>

        {/* Top palabras */}
        {stats.topWords.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Palabras más frecuentes
            </p>
            <div className="space-y-2">
              {stats.topWords.map(([word, count], i) => {
                const max = stats.topWords[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={word} className="flex items-center gap-3">
                    <span className="text-[8px] font-black text-gray-300 w-4 text-right">{i + 1}</span>
                    <span className="text-xs font-black text-gray-700 w-28 truncate">{word}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-studio-primary/60 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-black text-gray-400 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <FeaturesSection
        title="Cómo usar el contador"
        description="Analiza cualquier texto al instante: desde tweets hasta artículos largos. Ideal para escritores, periodistas, estudiantes y creadores de contenido."
        steps={[
          'Pega o escribe tu texto en el campo superior.',
          'Las estadísticas se actualizan en tiempo real mientras escribes.',
          'Revisa el tiempo estimado de lectura y las palabras más frecuentes.',
        ]}
      />
    </div>
  );
};

export default WordCounter;