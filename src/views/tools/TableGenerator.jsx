import React, { useState } from 'react';
import { Copy, Check, Table, Code, Download } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const EXPORT_MODES = [
  { id: 'html',     label: 'HTML' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'css',      label: 'HTML + CSS' },
];

const STYLES = [
  { id: 'simple',   label: 'Simple'   },
  { id: 'striped',  label: 'Rayado'   },
  { id: 'bordered', label: 'Bordeado' },
  { id: 'minimal',  label: 'Minimal'  },
];

const generateHtml = (rows, cols, hasHeader, tableStyle) => {
  const indent = (n) => '  '.repeat(n);
  let out = `<table class="table table--${tableStyle}">\n`;

  for (let r = 0; r < rows; r++) {
    out += `${indent(1)}<tr>\n`;
    const tag = hasHeader && r === 0 ? 'th' : 'td';
    for (let c = 0; c < cols; c++) {
      const val = hasHeader && r === 0 ? `Cabecera ${c + 1}` : `Celda ${r}-${c + 1}`;
      out += `${indent(2)}<${tag}>${val}</${tag}>\n`;
    }
    out += `${indent(1)}</tr>\n`;
  }
  return out + `</table>`;
};

const generateMarkdown = (rows, cols, hasHeader) => {
  const lines = [];
  for (let r = 0; r < rows; r++) {
    const cells = Array.from({ length: cols }, (_, c) =>
      hasHeader && r === 0 ? ` Cabecera ${c + 1} ` : ` Celda ${r}-${c + 1} `
    );
    lines.push('|' + cells.join('|') + '|');
    if (r === 0) lines.push('|' + Array(cols).fill(' --- ').join('|') + '|');
  }
  return lines.join('\n');
};

const generateHtmlCss = (rows, cols, hasHeader, tableStyle) => {
  const cssMap = {
    simple: `
.table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; }
.table td, .table th { padding: 10px 16px; border: 1px solid #e5e7eb; text-align: left; }
.table th { background: #f9fafb; font-weight: 700; }`,
    striped: `
.table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; }
.table td, .table th { padding: 10px 16px; text-align: left; }
.table th { background: #1a1a2e; color: #fff; font-weight: 700; }
.table tr:nth-child(even) td { background: #f3f4f6; }`,
    bordered: `
.table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; border: 2px solid #1a1a2e; }
.table td, .table th { padding: 10px 16px; border: 1px solid #1a1a2e; text-align: left; }
.table th { background: #1a1a2e; color: #fff; font-weight: 700; }`,
    minimal: `
.table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; }
.table td, .table th { padding: 10px 16px; border-bottom: 1px solid #e5e7eb; text-align: left; }
.table th { font-weight: 700; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }`,
  };
  const html = generateHtml(rows, cols, hasHeader, tableStyle);
  return `<style>${cssMap[tableStyle]}\n</style>\n\n${html}`;
};

const getCode = (rows, cols, hasHeader, exportMode, tableStyle) => {
  if (exportMode === 'html')     return generateHtml(rows, cols, hasHeader, tableStyle);
  if (exportMode === 'markdown') return generateMarkdown(rows, cols, hasHeader);
  return generateHtmlCss(rows, cols, hasHeader, tableStyle);
};

// Colores de preview según estilo
const previewStyles = {
  simple: {
    table:  'w-full border-collapse text-xs',
    th:     'border border-gray-200 px-3 py-2 bg-gray-50 font-black text-gray-600 text-left text-[9px] uppercase tracking-wide',
    td:     'border border-gray-100 px-3 py-2 text-gray-500 text-[10px]',
    trEven: '',
  },
  striped: {
    table:  'w-full border-collapse text-xs',
    th:     'px-3 py-2.5 text-left text-[9px] uppercase tracking-wide font-black text-white',
    thBg:   'bg-gray-900',
    td:     'px-3 py-2 text-gray-600 text-[10px]',
    trEven: 'bg-gray-50',
    trOdd:  'bg-white',
  },
  bordered: {
    table:  'w-full border-collapse text-xs border-2 border-gray-900',
    th:     'border border-gray-900 px-3 py-2.5 bg-gray-900 text-white font-black text-[9px] uppercase tracking-wide text-left',
    td:     'border border-gray-900 px-3 py-2 text-gray-600 text-[10px]',
    trEven: '',
  },
  minimal: {
    table:  'w-full border-collapse text-xs',
    th:     'border-b-2 border-gray-200 px-3 py-2.5 text-left text-[8px] uppercase tracking-widest font-black text-gray-400',
    td:     'border-b border-gray-100 px-3 py-2 text-gray-600 text-[10px]',
    trEven: '',
  },
};

const TableGenerator = () => {
  const [rows, setRows]           = useState(4);
  const [cols, setCols]           = useState(4);
  const [hasHeader, setHasHeader] = useState(true);
  const [exportMode, setExportMode] = useState('html');
  const [tableStyle, setTableStyle] = useState('simple');
  const [copied, setCopied]       = useState(false);
  const [showCode, setShowCode]   = useState(false);

  const code = getCode(Number(rows), Number(cols), hasHeader, exportMode, tableStyle);
  const ps   = previewStyles[tableStyle];

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const ext  = exportMode === 'markdown' ? 'md' : 'html';
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href     = URL.createObjectURL(blob);
    link.download = `tabla-aybstudio.${ext}`;
    link.click();
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Table"
        accent="Generator"
        subtitle="Genera tablas HTML, Markdown o HTML+CSS con previsualización en tiempo real."
      />

      <div className="max-w-6xl mx-auto px-6 mb-16 space-y-5">

        {/* Controls */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">

            {/* Rows */}
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Filas</label>
              <div className="flex items-center gap-2 bg-studio-bg rounded-xl px-3 py-2.5">
                <button onClick={() => setRows(r => Math.max(1, Number(r) - 1))}
                  className="w-6 h-6 rounded-lg bg-white text-gray-500 font-black text-sm hover:text-studio-primary transition-colors shadow-sm">−</button>
                <input type="number" min="1" max="20" value={rows}
                  onChange={e => setRows(Math.min(20, Math.max(1, Number(e.target.value))))}
                  className="flex-1 bg-transparent text-center font-black text-gray-700 text-sm border-none outline-none" />
                <button onClick={() => setRows(r => Math.min(20, Number(r) + 1))}
                  className="w-6 h-6 rounded-lg bg-white text-gray-500 font-black text-sm hover:text-studio-primary transition-colors shadow-sm">+</button>
              </div>
            </div>

            {/* Cols */}
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Columnas</label>
              <div className="flex items-center gap-2 bg-studio-bg rounded-xl px-3 py-2.5">
                <button onClick={() => setCols(c => Math.max(1, Number(c) - 1))}
                  className="w-6 h-6 rounded-lg bg-white text-gray-500 font-black text-sm hover:text-studio-primary transition-colors shadow-sm">−</button>
                <input type="number" min="1" max="12" value={cols}
                  onChange={e => setCols(Math.min(12, Math.max(1, Number(e.target.value))))}
                  className="flex-1 bg-transparent text-center font-black text-gray-700 text-sm border-none outline-none" />
                <button onClick={() => setCols(c => Math.min(12, Number(c) + 1))}
                  className="w-6 h-6 rounded-lg bg-white text-gray-500 font-black text-sm hover:text-studio-primary transition-colors shadow-sm">+</button>
              </div>
            </div>

            {/* Header toggle */}
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Encabezado</label>
              <button onClick={() => setHasHeader(v => !v)}
                className={`w-full py-2.5 px-4 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all
                  ${hasHeader ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400 bg-studio-bg'}`}>
                {hasHeader ? '✓ Con &lt;th&gt;' : 'Sin encabezado'}
              </button>
            </div>

            {/* Code toggle */}
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Vista</label>
              <button onClick={() => setShowCode(v => !v)}
                className={`w-full py-2.5 px-4 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all
                  ${showCode ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400 bg-studio-bg'}`}>
                {showCode ? <span className="flex items-center justify-center gap-1"><Code size={12}/> Código</span> : <span className="flex items-center justify-center gap-1"><Table size={12}/> Preview</span>}
              </button>
            </div>
          </div>

          {/* Style + Export selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Estilo visual</p>
              <div className="grid grid-cols-4 gap-2">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setTableStyle(s.id)}
                    className={`py-2 rounded-xl border-2 text-[8px] font-black uppercase tracking-wide transition-all
                      ${tableStyle === s.id ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400 hover:border-studio-primary/30'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Formato de exportación</p>
              <div className="grid grid-cols-3 gap-2">
                {EXPORT_MODES.map(m => (
                  <button key={m.id} onClick={() => setExportMode(m.id)}
                    className={`py-2 rounded-xl border-2 text-[8px] font-black uppercase tracking-wide transition-all
                      ${exportMode === m.id ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400 hover:border-studio-primary/30'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview / Code */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-7 py-4 bg-studio-bg border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-amber-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">
                {showCode ? `${exportMode.toUpperCase()} · ${code.length} chars` : `Preview · ${rows}×${cols}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border
                  ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-500 hover:border-studio-primary hover:text-studio-primary'}`}>
                {copied ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> Copiar</>}
              </button>
              <button onClick={download}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-studio-primary text-white hover:opacity-90 transition-opacity">
                <Download size={11} /> Descargar
              </button>
            </div>
          </div>

          <div className="p-7">
            {showCode ? (
              /* Code view */
              <pre className="bg-gray-900 rounded-2xl p-6 text-xs font-mono text-studio-primary overflow-x-auto leading-relaxed max-h-96">
                {code}
              </pre>
            ) : (
              /* Table preview */
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className={ps.table}>
                  <tbody>
                    {Array.from({ length: Number(rows) }).map((_, r) => (
                      <tr key={r} className={
                        tableStyle === 'striped'
                          ? r === 0 ? ps.thBg : r % 2 === 0 ? ps.trEven : ps.trOdd
                          : ''
                      }>
                        {Array.from({ length: Number(cols) }).map((_, c) => {
                          const isHeader = hasHeader && r === 0;
                          return isHeader ? (
                            <th key={c} className={`${ps.th} ${tableStyle === 'striped' ? '' : ''}`}>
                              Cabecera {c + 1}
                            </th>
                          ) : (
                            <td key={c} className={ps.td}>
                              Celda {r}-{c + 1}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Celdas totales', value: Number(rows) * Number(cols) },
            { label: 'Filas de datos', value: hasHeader ? Number(rows) - 1 : Number(rows) },
            { label: 'Caracteres',     value: code.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <span className="text-2xl font-black text-studio-primary block">{value.toLocaleString()}</span>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

      </div>

      <FeaturesSection
        title="Cómo generar tu tabla"
        description="Genera tablas HTML listas para copiar en cualquier proyecto web. Elige el número de filas y columnas, el estilo visual y el formato de exportación que necesites."
        steps={[
          'Ajusta el número de filas y columnas con los controles o escribiendo directamente.',
          'Elige el estilo visual y si necesitas HTML, Markdown o HTML con CSS incluido.',
          'Copia el código o descárgalo como archivo listo para usar en tu proyecto.',
        ]}
      />
    </div>
  );
};

export default TableGenerator;