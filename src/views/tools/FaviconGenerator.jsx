import React, { useState } from 'react';
import { Layers, Download, Smartphone, Monitor, Globe } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const SIZES = [
  { label: 'Favicon Web',    size: 32,  icon: <Globe size={16} />,    desc: '32×32 · Navegadores' },
  { label: 'App Android',    size: 192, icon: <Smartphone size={16} />, desc: '192×192 · Android PWA' },
  { label: 'Apple Touch',    size: 180, icon: <Smartphone size={16} />, desc: '180×180 · iOS Safari' },
  { label: 'OG / Desktop',   size: 512, icon: <Monitor size={16} />,   desc: '512×512 · Alta resolución' },
];

const FaviconGenerator = () => {
  const [image, setImage] = useState(null);
  const [downloaded, setDownloaded] = useState({});

  const downloadIcon = (size, label) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const link = document.createElement('a');
      link.download = `favicon-${size}x${size}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloaded(prev => ({ ...prev, [size]: true }));
      setTimeout(() => setDownloaded(prev => ({ ...prev, [size]: false })), 2000);
    };
  };

  const downloadAll = () => SIZES.forEach(({ size, label }) => downloadIcon(size, label));

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Favicon"
        accent="Studio"
        subtitle="Genera iconos perfectos para web, iOS y Android desde una sola imagen."
      />

      <div className="max-w-2xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {!image ? (
            <label className="flex flex-col items-center justify-center py-20 px-8 cursor-pointer group hover:bg-studio-bg transition-all">
              <div className="w-20 h-20 bg-studio-bg rounded-3xl flex items-center justify-center text-studio-primary mb-6 group-hover:scale-110 group-hover:bg-studio-primary group-hover:text-white transition-all duration-300">
                <Layers size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase italic tracking-tight mb-2">
                Sube tu logo cuadrado
              </h3>
              <p className="text-xs text-gray-400 mb-2">Recomendado: PNG con fondo transparente</p>
              <p className="text-xs text-gray-400 mb-8">Mínimo 512×512 px para máxima calidad</p>
              <span className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-studio-primary transition-all shadow-lg">
                Seleccionar Logo
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
            </label>
          ) : (
            <div className="p-8">
              {/* Logo preview con mock browser */}
              <div className="flex items-center justify-center gap-8 mb-8 p-6 bg-studio-bg rounded-2xl">
                <div className="text-center">
                  <img src={image} className="w-8 h-8 rounded-lg shadow-md border border-gray-200 mx-auto mb-2" alt="32px" />
                  <span className="text-[8px] font-black text-gray-400 uppercase">32px</span>
                </div>
                <div className="text-center">
                  <img src={image} className="w-12 h-12 rounded-xl shadow-md border border-gray-200 mx-auto mb-2" alt="48px" />
                  <span className="text-[8px] font-black text-gray-400 uppercase">48px</span>
                </div>
                <div className="text-center">
                  <img src={image} className="w-20 h-20 rounded-2xl shadow-lg border border-gray-200 mx-auto mb-2" alt="180px" />
                  <span className="text-[8px] font-black text-gray-400 uppercase">180px</span>
                </div>
                <div className="text-center">
                  <img src={image} className="w-28 h-28 rounded-2xl shadow-xl border border-gray-200 mx-auto mb-2" alt="512px" />
                  <span className="text-[8px] font-black text-gray-400 uppercase">512px</span>
                </div>
              </div>

              {/* Download options */}
              <div className="space-y-3 mb-6">
                {SIZES.map(({ label, size, icon, desc }) => (
                  <button
                    key={size}
                    onClick={() => downloadIcon(size, label)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all border
                      ${downloaded[size]
                        ? 'bg-green-50 border-green-200 text-green-600'
                        : 'bg-studio-bg border-gray-100 text-gray-700 hover:border-studio-primary hover:text-studio-primary'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-studio-primary">{icon}</span>
                      <div className="text-left">
                        <span className="font-black text-xs uppercase tracking-tight">{label}</span>
                        <span className="block text-[10px] text-gray-400 font-medium">{desc}</span>
                      </div>
                    </div>
                    <Download size={16} className={downloaded[size] ? 'text-green-500' : ''} />
                  </button>
                ))}
              </div>

              <button
                onClick={downloadAll}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all shadow-lg active:scale-95"
              >
                Descargar todos los tamaños
              </button>

              <button
                onClick={() => setImage(null)}
                className="w-full mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest py-2"
              >
                Subir otro logo
              </button>
            </div>
          )}
        </div>
      </div>

      <FeaturesSection
        title="Genera favicons perfectos"
        description="Un buen favicon refuerza la identidad de tu marca en cada pestaña del navegador. Genera todos los tamaños necesarios con un solo clic."
        steps={[
          'Sube tu logo cuadrado en formato PNG, idealmente con fondo transparente.',
          'Previsualiza cómo lucirá en diferentes tamaños y contextos.',
          'Descarga cada tamaño individualmente o todos a la vez.',
        ]}
      />
    </div>
  );
};

export default FaviconGenerator;