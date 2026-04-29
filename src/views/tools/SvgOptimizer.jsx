import React, { useState } from 'react';
import { Scissors, Copy, Check, Upload, FileCode } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const optimizeSvg = (raw) => {
  let out = raw;
  out = out.replace(/<!--[\s\S]*?-->/g, '');          // comments
  out = out.replace(/<\?xml[\s\S]*?\?>/g, '');         // xml declaration
  out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, ''); // metadata
  out = out.replace(/<title[\s\S]*?<\/title>/gi, '');  // title tags
  out = out.replace(/<desc[\s\S]*?<\/desc>/gi, '');    // desc tags
  out = out.replace(/\s+/g, ' ');                      // collapse whitespace
  out = out.replace(/> </g, '><');                     // remove space between tags
  out = out.replace(/ data-[\w-]+="[^"]*"/g, '');      // data attributes
  out = out.replace(/ id="[^"]*"/g, '');               // ids (optional, aggressive)
  out = out.trim();
  return out;
};

const formatBytes = (n) => n < 1024 ? `${n} B` : `${(n/1024).toFixed(1)} KB`;

const SvgOptimizer = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);

  const handleOptimize = () => {
    if (!input.trim()) return;
    const result = optimizeSvg(input);
    setOutput(result);
    const saved = input.length - result.length;
    const pct   = Math.round((saved / input.length) * 100);
    setStats({ original: input.length, optimized: result.length, saved, pct });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileDrop = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInput(ev.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="SVG"
        accent="Optimizer"
        subtitle="Limpia comentarios, metadatos y código basura de tus vectores para una web más rápida."
      />

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">

          {/* Stats bar */}
          {stats && (
            <div className="flex items-center justify-between px-8 py-4 bg-studio-bg border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Original</span>
                  <span className="text-sm font-black text-gray-700">{formatBytes(stats.original)}</span>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Optimizado</span>
                  <span className="text-sm font-black text-studio-primary">{formatBytes(stats.optimized)}</span>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Ahorro</span>
                  <span className="text-sm font-black text-green-500">-{stats.pct}%</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Optimización completada
              </div>
            </div>
          )}

          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
            {/* Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Código Original</label>
                <label className="flex items-center gap-1.5 text-[9px] font-black text-studio-primary uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity">
                  <Upload size={11} /> Subir .svg
                  <input type="file" accept=".svg" className="hidden" onChange={handleFileDrop} />
                </label>
              </div>
              <textarea
                className="w-full h-64 p-5 bg-studio-bg rounded-2xl text-xs font-mono text-gray-600 border-none focus:ring-2 focus:ring-studio-primary outline-none resize-none transition-all"
                placeholder={'<svg xmlns="http://www.w3.org/2000/svg">\n  <!-- Pega aquí tu SVG -->\n</svg>'}
                value={input}
                onChange={(e) => { setInput(e.target.value); setStats(null); setOutput(''); }}
              />
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold text-gray-300">{input.length} caracteres</span>
                {input && (
                  <button onClick={() => { setInput(''); setOutput(''); setStats(null); }}
                    className="text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors">
                    Limpiar
                  </button>
                )}
              </div>
              <button
                onClick={handleOptimize}
                disabled={!input.trim()}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Scissors size={16} /> Optimizar SVG
              </button>
            </div>

            {/* Output */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Resultado</label>
                {output && (
                  <span className="text-[8px] font-bold text-gray-300">{output.length} caracteres</span>
                )}
              </div>
              <textarea
                readOnly
                className="w-full h-64 p-5 bg-studio-bg rounded-2xl text-xs font-mono text-studio-primary border-none resize-none outline-none"
                value={output}
                placeholder="El código optimizado aparecerá aquí..."
              />

              {/* SVG Preview */}
              {output && output.includes('<svg') && (
                <div className="bg-studio-bg rounded-2xl p-4 flex items-center justify-center border border-gray-100 h-16">
                  <div
                    className="h-full w-auto flex items-center"
                    dangerouslySetInnerHTML={{ __html: output }}
                    style={{ maxHeight: '48px', overflow: 'hidden' }}
                  />
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-3">Vista previa</span>
                </div>
              )}

              <button
                onClick={copyToClipboard}
                disabled={!output}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 active:scale-95
                  ${copied
                    ? 'bg-green-50 border-green-200 text-green-600'
                    : 'bg-white border-studio-primary text-studio-primary hover:bg-studio-bg disabled:opacity-30 disabled:cursor-not-allowed'}`}
              >
                {copied ? <><Check size={16} /> ¡Copiado!</> : <><Copy size={16} /> Copiar código</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <FeaturesSection
        title="Cómo optimizar tu SVG"
        description="Los archivos SVG exportados desde Illustrator o Figma suelen incluir metadatos, comentarios y atributos innecesarios. Eliminarlos puede reducir el tamaño hasta un 50%."
        steps={[
          'Pega tu código SVG en el panel izquierdo o sube un archivo .svg directamente.',
          'Haz clic en "Optimizar SVG" para limpiar comentarios, metadatos y espacios extra.',
          'Copia el código resultante o revisa la vista previa antes de usarlo.',
        ]}
      />
    </div>
  );
};

export default SvgOptimizer;