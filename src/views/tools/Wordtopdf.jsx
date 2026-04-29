import React, { useState, useRef } from 'react';
import { FileText, Download, Upload, RefreshCcw, Eye, EyeOff } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

// mammoth.js debe estar instalado: npm install mammoth
// En el proyecto debe importarse así o via CDN en index.html:
// <script src="https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js"></script>

const WordToPdf = () => {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const previewRef = useRef(null);

  const processFile = async (f) => {
    if (!f) return;
    if (!f.name.match(/\.(docx|doc)$/i)) {
      alert('Por favor sube un archivo .docx o .doc válido.');
      return;
    }
    setFile(f);
    setIsProcessing(true);
    setHtmlContent('');

    try {
      const arrayBuffer = await f.arrayBuffer();

      // Usar mammoth global (via CDN) o importado
      const mammoth = window.mammoth || (await import('mammoth'));

      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (err) {
      console.error(err);
      alert('No se pudo procesar el archivo. Asegúrate de que sea un .docx válido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (e) => processFile(e.target.files[0]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFile(e.dataTransfer.files[0]);
  };

  const downloadPdf = () => {
    // Abre una ventana con el contenido y lanza el diálogo de impresión/guardado como PDF
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${file?.name?.replace(/\.[^.]+$/, '') || 'documento'}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Times New Roman', Georgia, serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
              padding: 2.5cm 2cm;
            }
            h1, h2, h3, h4, h5, h6 { margin: 1em 0 0.4em; font-weight: bold; }
            h1 { font-size: 20pt; }
            h2 { font-size: 16pt; }
            h3 { font-size: 14pt; }
            p { margin-bottom: 0.8em; }
            table { width: 100%; border-collapse: collapse; margin: 1em 0; }
            td, th { border: 1px solid #ccc; padding: 6px 10px; }
            th { background: #f5f5f5; font-weight: bold; }
            ul, ol { padding-left: 2em; margin-bottom: 0.8em; }
            li { margin-bottom: 0.3em; }
            img { max-width: 100%; height: auto; }
            strong { font-weight: bold; }
            em { font-style: italic; }
            @media print {
              body { padding: 0; max-width: 100%; }
              @page { margin: 2cm; size: A4; }
            }
          </style>
        </head>
        <body>${htmlContent}</body>
        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 1000);
          };
        </script>
      </html>
    `);
    win.document.close();
  };

  const reset = () => {
    setFile(null);
    setHtmlContent('');
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Word a"
        accent="PDF"
        subtitle="Convierte documentos .docx a PDF directamente en tu navegador. Sin subir nada a servidores."
      />

      <div className="max-w-4xl mx-auto px-6 mb-16">
        {!file ? (
          // Drop zone
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`bg-white rounded-[2rem] border-2 border-dashed transition-all duration-300 shadow-sm
              ${dragActive ? 'border-studio-primary bg-studio-primary/5 scale-[1.01]' : 'border-gray-200 hover:border-studio-primary/40'}`}
          >
            <div className="py-24 px-8 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300
                ${dragActive ? 'bg-studio-primary text-white scale-110' : 'bg-studio-bg text-studio-primary'}`}>
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase italic tracking-tight mb-2">
                {dragActive ? '¡Suelta tu documento!' : 'Sube tu archivo Word'}
              </h3>
              <p className="text-xs text-gray-400 mb-2">Arrastra y suelta o haz clic para buscar</p>
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mb-8">.docx · .doc</p>
              <label className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all cursor-pointer active:scale-95 shadow-lg">
                Seleccionar Archivo
                <input type="file" className="hidden" accept=".docx,.doc" onChange={handleFile} />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-studio-bg rounded-xl flex items-center justify-center text-studio-primary">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    {(file.size / 1024).toFixed(1)} KB
                    {isProcessing && ' · Procesando...'}
                    {!isProcessing && htmlContent && ' · Listo para exportar'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {htmlContent && (
                  <button
                    onClick={() => setShowPreview(v => !v)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-studio-bg text-studio-primary text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                  >
                    {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showPreview ? 'Ocultar' : 'Previsualizar'}
                  </button>
                )}
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-xl bg-studio-bg text-gray-400 text-[9px] font-black uppercase tracking-widest hover:text-red-400 transition-colors"
                >
                  Cambiar archivo
                </button>
                {htmlContent && (
                  <button
                    onClick={downloadPdf}
                    className="flex items-center gap-2 bg-studio-primary text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg"
                  >
                    <Download size={14} /> Descargar PDF
                  </button>
                )}
              </div>
            </div>

            {/* Processing state */}
            {isProcessing && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center shadow-sm">
                <RefreshCcw size={32} className="text-studio-primary animate-spin mb-4" />
                <p className="text-sm font-black text-gray-600 uppercase italic tracking-tight">Procesando documento...</p>
                <p className="text-xs text-gray-400 mt-1">Esto tomará solo un momento</p>
              </div>
            )}

            {/* Preview */}
            {!isProcessing && htmlContent && showPreview && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-3 bg-studio-bg border-b border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-300" />
                    <div className="w-3 h-3 rounded-full bg-amber-300" />
                    <div className="w-3 h-3 rounded-full bg-green-300" />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Vista previa del documento</span>
                </div>
                <div
                  ref={previewRef}
                  className="p-10 max-h-[600px] overflow-y-auto prose prose-sm max-w-none"
                  style={{
                    fontFamily: 'Georgia, serif',
                    lineHeight: '1.7',
                    color: '#1a1a1a',
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            )}

            {/* Download CTA when preview hidden */}
            {!isProcessing && htmlContent && !showPreview && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center shadow-sm">
                <div className="w-16 h-16 bg-studio-bg rounded-2xl flex items-center justify-center text-studio-primary mb-4">
                  <Download size={28} />
                </div>
                <p className="text-sm font-black text-gray-800 uppercase italic tracking-tight mb-1">Documento listo</p>
                <p className="text-xs text-gray-400 mb-6">Se abrirá el diálogo de impresión. Elige "Guardar como PDF".</p>
                <button
                  onClick={downloadPdf}
                  className="bg-studio-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg"
                >
                  Guardar como PDF
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tip */}
        <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-6">
          Cuando se abra el diálogo de impresión → selecciona "Guardar como PDF" como destino
        </p>
      </div>

      <FeaturesSection
        title="Cómo convertir Word a PDF"
        description="Convierte tus documentos Word a PDF preservando títulos, párrafos, tablas y listas, todo procesado localmente en tu navegador sin comprometer tu privacidad."
        steps={[
          'Arrastra tu archivo .docx o haz clic para seleccionarlo desde tu dispositivo.',
          'Previsualiza el contenido formateado antes de exportar.',
          'Haz clic en "Descargar PDF" y guarda el archivo desde el diálogo de impresión.',
        ]}
      />
    </div>
  );
};

export default WordToPdf;