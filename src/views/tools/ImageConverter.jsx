import React, { useState, useCallback } from 'react';
import { Upload, Download, RefreshCcw, ArrowRight } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const ImageConverter = () => {
  const [image, setImage] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === 'image/png') {
      setImage(URL.createObjectURL(file));
      setDone(false);
    } else {
      alert('Por favor, sube un archivo PNG válido.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const downloadJpg = () => {
    setIsConverting(true);
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `aybstudio-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
      setTimeout(() => { setIsConverting(false); setDone(true); }, 800);
    };
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="PNG a"
        accent="JPG"
        subtitle="Transforma tus imágenes al instante. Tus archivos nunca salen de tu dispositivo."
      />

      <div className="max-w-3xl mx-auto px-6 mb-16">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-300
            ${dragActive
              ? 'border-studio-primary bg-studio-primary/5 scale-[1.01]'
              : image ? 'border-transparent' : 'border-gray-200 bg-white hover:border-studio-primary/40'}
            ${image ? 'shadow-xl' : 'shadow-sm'}
          `}
        >
          {!image ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 ${dragActive ? 'bg-studio-primary text-white scale-110' : 'bg-studio-bg text-studio-primary'}`}>
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase italic tracking-tight mb-2">
                {dragActive ? '¡Suelta aquí!' : 'Sube tu imagen PNG'}
              </h3>
              <p className="text-xs text-gray-400 mb-8">Arrastra y suelta o haz clic para buscar</p>
              <label className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all cursor-pointer active:scale-95 shadow-lg">
                Seleccionar Archivo
                <input type="file" className="hidden" accept="image/png" onChange={e => handleFile(e.target.files[0])} />
              </label>
            </div>
          ) : (
            <div className="bg-white">
              <div className="relative group overflow-hidden bg-gray-50" style={{ borderRadius: '2rem 2rem 0 0' }}>
                <img src={image} alt="Preview" className="max-h-80 w-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setImage(null); setDone(false); }}
                    className="bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-xs font-black border border-white/30 hover:bg-white/40 uppercase tracking-wider"
                  >
                    Cambiar imagen
                  </button>
                </div>
              </div>

              <div className="p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-studio-primary uppercase tracking-widest">
                    {done ? '✓ Conversión completada' : 'Listo para convertir'}
                  </span>
                  <p className="text-sm font-black text-gray-800 uppercase italic">
                    PNG → JPG
                  </p>
                </div>
                <button
                  onClick={downloadJpg}
                  disabled={isConverting}
                  className={`
                    w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95
                    ${done
                      ? 'bg-green-500 text-white shadow-green-100'
                      : isConverting
                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                        : 'bg-studio-primary text-white hover:opacity-90 shadow-studio-primary/20'}
                  `}
                >
                  {isConverting
                    ? <><RefreshCcw size={16} className="animate-spin" /> Procesando...</>
                    : done
                      ? <><Download size={16} /> Descargar de nuevo</>
                      : <><Download size={16} /> Descargar JPG</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FeaturesSection
        title="Cómo funciona el conversor"
        description="Convertir PNG a JPG es esencial para reducir el peso de tus activos digitales sin comprometer la calidad visual que tu audiencia espera."
        steps={[
          'Sube tu archivo PNG arrastrándolo o usando el botón de selección.',
          'Previsualiza la imagen en el panel seguro de tu navegador.',
          'Haz clic en "Descargar JPG" y obtén tu versión optimizada al instante.',
        ]}
      />
    </div>
  );
};

export default ImageConverter;