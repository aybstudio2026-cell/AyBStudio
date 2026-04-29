import React, { useState } from 'react';
import { Code, Copy, Check, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const EXAMPLES = {
  simple: `{
  "nombre": "AYB Studio",
  "activo": true,
  "version": 2
}`,
  array: `[
  { "id": 1, "color": "teal" },
  { "id": 2, "color": "black" }
]`,
  nested: `{
  "usuario": {
    "nombre": "Carlos",
    "roles": ["admin", "editor"],
    "config": { "tema": "oscuro" }
  }
}`,
};

const JsonValidator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null); // null | 'valid' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);

  const validate = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setStatus('valid');
      setErrorMsg('');
      const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length || 0;
      setStats({
        chars: formatted.length,
        lines: formatted.split('\n').length,
        keys,
      });
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.message);
      setOutput('');
      setStats(null);
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus('valid');
      setErrorMsg('');
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (key) => {
    setInput(EXAMPLES[key]);
    setOutput('');
    setStatus(null);
    setStats(null);
  };

  // Syntax highlighting básico
  const highlight = (json) => {
    return json
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-blue-500'; // number
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'text-studio-primary font-bold' : 'text-green-600';
        } else if (/true|false/.test(match)) {
          cls = 'text-amber-500';
        } else if (/null/.test(match)) {
          cls = 'text-gray-400';
        }
        return `<span class="${cls}">${match}</span>`;
      });
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Validador"
        accent="JSON"
        subtitle="Limpia, formatea y valida tus estructuras de datos al instante."
      />

      <div className="max-w-5xl mx-auto px-6 mb-16">

        {/* Examples */}
        <div className="flex items-center gap-3 mb-4 justify-center">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ejemplos:</span>
          {Object.keys(EXAMPLES).map(k => (
            <button key={k} onClick={() => loadExample(k)}
              className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white border border-gray-100 text-gray-500 hover:border-studio-primary hover:text-studio-primary transition-all">
              {k}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">

          {/* Status bar */}
          {status && (
            <div className={`flex items-center gap-3 px-8 py-3 border-b text-xs font-black uppercase tracking-widest
              ${status === 'valid' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-500'}`}>
              {status === 'valid'
                ? <><CheckCircle size={16} /> JSON válido{stats && ` · ${stats.lines} líneas · ${stats.keys} claves · ${stats.chars} chars`}</>
                : <><XCircle size={16} /> Error: {errorMsg}</>
              }
            </div>
          )}

          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
            {/* Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tu JSON</label>
                <span className="text-[8px] font-bold text-gray-300">{input.length} chars</span>
              </div>
              <textarea
                className="w-full h-72 p-5 bg-studio-bg rounded-2xl text-xs font-mono text-gray-600 border-none focus:ring-2 focus:ring-studio-primary outline-none resize-none"
                placeholder={'{\n  "clave": "valor"\n}'}
                value={input}
                onChange={(e) => { setInput(e.target.value); setStatus(null); setOutput(''); setStats(null); }}
                spellCheck={false}
              />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={validate} disabled={!input.trim()}
                  className="bg-gray-900 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-studio-primary transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-1.5">
                  <CheckCircle size={14} /> Formatear
                </button>
                <button onClick={minify} disabled={!input.trim()}
                  className="bg-white border-2 border-gray-200 text-gray-600 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-studio-primary hover:text-studio-primary transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-1.5">
                  <Code size={14} /> Minificar
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Resultado</label>
                {output && <span className="text-[8px] font-bold text-gray-300">{output.length} chars</span>}
              </div>

              {output ? (
                <div className="h-72 p-5 bg-studio-bg rounded-2xl overflow-auto border-none">
                  <pre
                    className="text-xs font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlight(output) }}
                  />
                </div>
              ) : (
                <div className="h-72 p-5 bg-studio-bg rounded-2xl flex flex-col items-center justify-center">
                  {status === 'error' ? (
                    <>
                      <XCircle size={32} className="text-red-300 mb-3" />
                      <p className="text-xs font-black text-red-400 uppercase tracking-tight text-center">JSON inválido</p>
                      <p className="text-[10px] text-red-300 mt-1 text-center max-w-[200px]">{errorMsg}</p>
                    </>
                  ) : (
                    <>
                      <Code size={32} className="text-gray-200 mb-3" />
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">El resultado aparecerá aquí</p>
                    </>
                  )}
                </div>
              )}

              <button onClick={copy} disabled={!output}
                className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all border-2 active:scale-95
                  ${copied
                    ? 'bg-green-50 border-green-200 text-green-600'
                    : 'bg-white border-studio-primary text-studio-primary hover:bg-studio-bg disabled:opacity-30 disabled:cursor-not-allowed'}`}>
                {copied ? <><Check size={14} /> ¡Copiado!</> : <><Copy size={14} /> Copiar resultado</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <FeaturesSection
        title="Cómo usar el validador"
        description="Un JSON malformado puede romper tu aplicación. Valida y formatea tus estructuras de datos antes de usarlas en producción."
        steps={[
          'Pega tu JSON en el panel izquierdo o carga uno de los ejemplos predefinidos.',
          'Haz clic en "Formatear" para validar e indentar, o en "Minificar" para compactar.',
          'Revisa el resultado con syntax highlighting y cópialo al portapapeles.',
        ]}
      />
    </div>
  );
};

export default JsonValidator;