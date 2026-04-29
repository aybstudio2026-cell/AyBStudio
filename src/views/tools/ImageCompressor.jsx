import React, { useState, useRef } from 'react';
import { Zap, Download, Upload } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const ImageCompressor = () => {
  const [image, setImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOriginalSize(file.size);
    setCompressedBlob(null);
    setImage(URL.createObjectURL(file));
  };

  const compress = () => {
    setIsProcessing(true);
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        setCompressedBlob(blob);
        setCompressedSize(blob.size);
        setIsProcessing(false);
      }, 'image/jpeg', parseFloat(quality));
    };
  };

  const download = () => {
    if (!compressedBlob) return;
    const link = document.createElement('a');
    link.download = `aybstudio-compressed.jpg`;
    link.href = URL.createObjectURL(compressedBlob);
    link.click();
  };

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : null;

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Image"
        accent="Compressor"
        subtitle="Reduce el peso de tus imágenes sin sacrificar la calidad visual."
      />

      <div className="max-w-xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {!image ? (
            <label className="flex flex-col items-center justify-center py-20 px-8 cursor-pointer group hover:bg-studio-bg transition-all">
              <div className="w-20 h-20 bg-studio-bg rounded-3xl flex items-center justify-center text-studio-primary mb-6 group-hover:scale-110 group-hover:bg-studio-primary group-hover:text-white transition-all duration-300">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase italic tracking-tight mb-2">
                Subir imagen
              </h3>
              <p className="text-xs text-gray-400 mb-8">PNG, JPG, WEBP — hasta 20 MB</p>
              <span className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-studio-primary transition-all shadow-lg">
                Seleccionar Archivo
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
            </label>
          ) : (
            <div className="p-8 space-y-6">
              <img src={image} className="h-44 w-full object-cover rounded-2xl border border-gray-100" alt="Preview" />

              {/* Quality slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Calidad</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-studio-primary">{Math.round(quality * 100)}%</span>
                    <span className="text-[9px] text-gray-400">·</span>
                    <span className="text-[9px] font-bold text-gray-400">
                      Compresión {Math.round((1 - quality) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range" min="0.1" max="0.95" step="0.05"
                    value={quality}
                    onChange={e => { setQuality(e.target.value); setCompressedBlob(null); }}
                    className="w-full accent-studio-primary h-1.5 rounded-full bg-gray-100 appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
                  <span>Máxima compresión</span>
                  <span>Máxima calidad</span>
                </div>
              </div>

              {/* Size comparison */}
              {savings !== null && (
                <div className="bg-studio-bg rounded-2xl p-5 flex items-center justify-between">
                  <div className="text-center">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Original</span>
                    <span className="text-sm font-black text-gray-700">{formatBytes(originalSize)}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-studio-primary/10 text-studio-primary flex items-center justify-center font-black text-xs mx-auto mb-1">
                      -{savings}%
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Comprimido</span>
                    <span className="text-sm font-black text-studio-primary">{formatBytes(compressedSize)}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {!compressedBlob ? (
                  <button
                    onClick={compress}
                    disabled={isProcessing}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <><Zap size={16} className="animate-pulse" /> Procesando...</>
                    ) : (
                      <><Zap size={16} /> Optimizar imagen</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={download}
                    className="w-full bg-studio-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Descargar JPG optimizado
                  </button>
                )}
                <button
                  onClick={() => { setImage(null); setCompressedBlob(null); }}
                  className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest py-2"
                >
                  Subir otra imagen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FeaturesSection
        title="Cómo funciona la compresión"
        description="Ajusta el nivel de compresión con el slider y obtén el balance perfecto entre peso y calidad visual para tu caso de uso."
        steps={[
          'Sube tu imagen en cualquier formato compatible.',
          'Ajusta el slider de calidad según tus necesidades de peso y resolución.',
          'Compara el tamaño antes/después y descarga la versión optimizada.',
        ]}
      />
    </div>
  );
};

export default ImageCompressor;