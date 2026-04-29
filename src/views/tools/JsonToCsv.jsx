import React, { useState } from 'react';
import { FileSpreadsheet, Download, RefreshCcw } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';
import * as XLSX from 'xlsx';

const JsonToCsv = () => {
  const [json, setJson] = useState('');
  const [csv, setCsv] = useState('');
  const [preview, setPreview] = useState(null);

  const exampleJson = `[
  { "nombre": "AyB", "status": "Pro", "precio": 29.99, "activo": true },
  { "nombre": "Studio", "status": "Basic", "precio": 9.99, "activo": false }
]`;

  const escapeCsv = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    const needsQuotes = /[\n\r,"]/.test(str);
    const escaped = str.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const normalizeToArray = (parsed) => {
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') return [parsed];
    return null;
  };

  const getHeaders = (rows) => {
    const keys = new Set();
    for (const row of rows) {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        Object.keys(row).forEach((k) => keys.add(k));
      }
    }
    return Array.from(keys);
  };

  const convert = () => {
    try {
      const parsed = JSON.parse(json);
      const array = normalizeToArray(parsed);
      if (!array || array.length === 0) {
        alert('JSON inválido. Debe ser un objeto o un array de objetos.');
        return;
      }

      const headers = getHeaders(array);
      if (headers.length === 0) {
        alert('JSON inválido. Debe ser un objeto o un array de objetos.');
        return;
      }

      const headerLine = headers.map(escapeCsv).join(',');
      const rows = array
        .map((obj) => headers.map((h) => escapeCsv(obj?.[h])).join(','))
        .join('\n');

      setCsv(`${headerLine}\n${rows}`);
      setPreview({ headers, rows: array });
    } catch (e) {
      alert("JSON inválido. Asegúrate de que sea un array de objetos.");
    }
  };

  const download = () => {
    if (!preview?.headers?.length || !preview?.rows?.length) return;

    const orderedRows = preview.rows.map((row) => {
      const out = {};
      for (const h of preview.headers) out[h] = row?.[h];
      return out;
    });

    const ws = XLSX.utils.json_to_sheet(orderedRows, { header: preview.headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'aybstudio-data.xlsx');
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="JSON"
        accent="to CSV"
        subtitle="Convierte JSON (objeto o array de objetos) a CSV listo para Excel/Sheets."
      />

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary/50">Entrada</p>
              <button
                type="button"
                onClick={() => {
                  setJson(exampleJson);
                  setCsv('');
                  setPreview(null);
                }}
                className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all"
              >
                Cargar ejemplo
              </button>
            </div>

            <textarea
              value={json}
              onChange={(e) => {
                setJson(e.target.value);
                if (csv) setCsv('');
                if (preview) setPreview(null);
              }}
              className="w-full h-80 p-5 bg-studio-bg rounded-2xl border border-gray-100 text-[11px] font-mono text-studio-text-title outline-none focus:ring-2 focus:ring-studio-primary"
              placeholder={exampleJson}
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setJson('');
                  setCsv('');
                  setPreview(null);
                }}
                className="px-4 py-4 rounded-2xl border border-gray-100 bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={convert}
                className="px-4 py-4 rounded-2xl bg-studio-text-title text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-studio-primary transition-all shadow-xl shadow-studio-text-title/10 flex items-center justify-center gap-2"
              >
                <RefreshCcw size={14} />
                Convertir
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary/50">Salida</p>
              <div className="flex items-center gap-2 text-studio-primary">
                <FileSpreadsheet size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest">CSV</span>
              </div>
            </div>

            <div className="h-80 w-full bg-studio-bg rounded-2xl border-2 border-dashed border-gray-200 p-5 overflow-auto">
              {preview ? (
                <div className="min-w-[520px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[9px] uppercase tracking-[0.25em] text-studio-secondary/60 font-black">
                        {preview.headers.map((h) => (
                          <th key={h} className="pb-3 pr-4 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="border-t border-gray-200">
                      {preview.rows.slice(0, 30).map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          {preview.headers.map((h) => (
                            <td key={h} className="py-3 pr-4 text-[10px] font-mono text-studio-text-title whitespace-nowrap">
                              {row?.[h] === null || row?.[h] === undefined ? '' : String(row[h])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {preview.rows.length > 30 && (
                    <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-studio-secondary/40">
                      Mostrando 30 filas de {preview.rows.length}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[10px] font-mono text-studio-secondary">{csv || 'El resultado aparecerá aquí...'}</p>
              )}
            </div>

            <button
              type="button"
              onClick={download}
              disabled={!preview}
              className="w-full bg-studio-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl shadow-studio-primary/20 disabled:opacity-50 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Descargar Excel
            </button>
          </div>
        </div>
      </div>

      <FeaturesSection
        title="Formato esperado"
        description="Pega un JSON válido. Puede ser un objeto o un array de objetos. El convertidor toma todas las llaves encontradas como columnas y completa valores faltantes en blanco."
        steps={[
          'Usa un array de objetos: cada objeto será una fila del CSV.',
          'Las llaves del objeto se convierten en columnas.',
          'Si un valor contiene comas o comillas, se escapa automáticamente.'
        ]}
      />
    </div>
  );
};

export default JsonToCsv;