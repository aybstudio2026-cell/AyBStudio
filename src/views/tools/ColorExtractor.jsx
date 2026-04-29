import React, { useState } from 'react';
import { Palette, Copy, Check, Upload } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

// Algoritmo de extracción mejorado con clustering básico
const extractDominantColors = (imageData, count = 6) => {
  const data = imageData.data;
  const colorMap = {};

  for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const a = data[i + 3];
    if (a < 128) continue; // skip transparent
    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    });
};

const ColorExtractor = () => {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 300;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setColors(extractDominantColors(imageData, 6));
    };
  };

  const copyColor = (hex, index) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Luminance for text color contrast
  const getTextColor = (hex) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Color"
        accent="Extractor"
        subtitle="Extrae la identidad visual y la paleta dominante de cualquier imagen."
      />

      <div className="max-w-3xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {!image ? (
            <label className="flex flex-col items-center justify-center py-20 px-8 cursor-pointer group transition-all hover:bg-studio-bg">
              <div className="w-20 h-20 bg-studio-bg rounded-3xl flex items-center justify-center text-studio-primary mb-6 group-hover:scale-110 group-hover:bg-studio-primary group-hover:text-white transition-all duration-300">
                <Palette size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase italic tracking-tight mb-2">
                Subir imagen
              </h3>
              <p className="text-xs text-gray-400 mb-8">JPG, PNG, WEBP — cualquier foto funciona</p>
              <span className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-studio-primary transition-all shadow-lg">
                Seleccionar Archivo
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
            </label>
          ) : (
            <div>
              {/* Image preview */}
              <div className="relative overflow-hidden" style={{ maxHeight: '280px' }}>
                <img src={image} className="w-full object-cover" style={{ maxHeight: '280px' }} alt="Uploaded" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  onClick={() => { setImage(null); setColors([]); }}
                  className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black border border-white/30 hover:bg-white/40 uppercase tracking-wider"
                >
                  Cambiar imagen
                </button>
              </div>

              {/* Color swatches */}
              <div className="p-6">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Paleta dominante — click para copiar
                </p>
                <div className="grid grid-cols-6 gap-3">
                  {colors.map((hex, i) => (
                    <button
                      key={i}
                      onClick={() => copyColor(hex, i)}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full aspect-square rounded-2xl shadow-md border border-black/5 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95"
                        style={{ backgroundColor: hex }}
                      >
                        {copiedIndex === i && (
                          <Check size={16} style={{ color: getTextColor(hex) }} />
                        )}
                      </div>
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                        {hex.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Full palette row */}
                <div className="mt-6 h-12 rounded-2xl overflow-hidden flex shadow-inner border border-black/5">
                  {colors.map((hex, i) => (
                    <div key={i} className="flex-1 transition-all hover:flex-[2]" style={{ backgroundColor: hex }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <FeaturesSection
        title="Cómo funciona la extracción"
        description="Nuestro algoritmo analiza los píxeles de tu imagen y agrupa los colores dominantes en una paleta lista para usar en tu próximo proyecto."
        steps={[
          'Sube cualquier imagen JPG, PNG o WEBP desde tu dispositivo.',
          'El algoritmo identifica y agrupa los 6 colores más presentes.',
          'Haz clic sobre cada swatch para copiar el código HEX al portapapeles.',
        ]}
      />
    </div>
  );
};

export default ColorExtractor;