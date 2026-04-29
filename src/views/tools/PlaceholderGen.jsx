import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCcw } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const PRESETS = [
  { label: 'HD',    w: 1280, h: 720  },
  { label: '4:3',   w: 800,  h: 600  },
  { label: 'Card',  w: 400,  h: 300  },
  { label: 'Square',w: 600,  h: 600  },
  { label: 'Banner',w: 1200, h: 400  },
  { label: 'Story', w: 1080, h: 1920 },
];

const PALETTE = ['#f3f4f6','#e0f2fe','#fce7f3','#dcfce7','#fef9c3','#1a1a2e','#2d2d2d','#0e7490'];

const PlaceholderGen = () => {
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [textColor, setTextColor] = useState('#9ca3af');
  const [text, setText] = useState('AYB STUDIO');
  const [customColor, setCustomColor] = useState(false);
  const canvasRef = useRef(null);

  // Live preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxW = 480;
    const scale = Math.min(maxW / w, 280 / h, 1);
    canvas.width  = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid pattern
    ctx.strokeStyle = textColor + '22';
    ctx.lineWidth = 1;
    const step = Math.max(canvas.width, canvas.height) / 8;
    for (let x = 0; x <= canvas.width; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y <= canvas.height; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    // Diagonal cross
    ctx.strokeStyle = textColor + '33';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(canvas.width, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(canvas.width, 0); ctx.lineTo(0, canvas.height); ctx.stroke();

    // Text
    const fontSize = Math.max(12, Math.min(canvas.width / 8, 28));
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text || `${w}×${h}`, canvas.width / 2, canvas.height / 2);

    // Dimensions label
    ctx.font = `bold ${Math.max(8, fontSize * 0.5)}px Inter, sans-serif`;
    ctx.fillStyle = textColor + '88';
    ctx.fillText(`${w} × ${h}`, canvas.width / 2, canvas.height / 2 + fontSize * 1.4);
  }, [w, h, bgColor, textColor, text]);

  const download = () => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = textColor + '22';
    ctx.lineWidth = 2;
    const step = Math.max(w, h) / 8;
    for (let x = 0; x <= w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y <= h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.strokeStyle = textColor + '33';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w, 0); ctx.lineTo(0, h); ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.max(20, w / 10)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text || `${w}×${h}`, w / 2, h / 2);
    const link = document.createElement('a');
    link.download = `placeholder-${w}x${h}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Image"
        accent="Placeholder"
        subtitle="Crea imágenes de relleno personalizadas para tus wireframes y prototipos."
      />

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">

          {/* Controls */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6">
            {/* Presets */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Tamaños rápidos</p>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setW(p.w); setH(p.h); }}
                    className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all border
                      ${w === p.w && h === p.h
                        ? 'bg-studio-primary text-white border-transparent'
                        : 'bg-studio-bg border-gray-100 text-gray-500 hover:border-studio-primary hover:text-studio-primary'}`}
                  >
                    {p.label}
                    <span className="block text-[7px] opacity-60">{p.w}×{p.h}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Dimensiones</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Ancho (px)</label>
                  <input type="number" value={w} onChange={e => setW(Number(e.target.value))}
                    className="w-full bg-studio-bg rounded-xl p-3 text-sm font-black text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none" />
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Alto (px)</label>
                  <input type="number" value={h} onChange={e => setH(Number(e.target.value))}
                    className="w-full bg-studio-bg rounded-xl p-3 text-sm font-black text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Texto central</label>
              <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={30}
                className="w-full bg-studio-bg rounded-xl p-3 text-sm font-black text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none" />
            </div>

            {/* Colors */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Color de fondo</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {PALETTE.map(c => (
                  <button key={c} onClick={() => setBgColor(c)}
                    className={`w-8 h-8 rounded-xl border-2 transition-transform hover:scale-110 ${bgColor === c ? 'border-studio-primary scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-xl cursor-pointer border-2 border-dashed border-gray-300" title="Custom" />
              </div>
            </div>

            <button onClick={download}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <Download size={16} /> Generar y Descargar
            </button>
          </div>

          {/* Live preview */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-6">Vista previa en tiempo real</p>
            <div className="flex-1 flex items-center justify-center bg-studio-bg rounded-2xl overflow-hidden p-4">
              <canvas ref={canvasRef} className="max-w-full max-h-full rounded-xl shadow-inner" />
            </div>
            <p className="text-[9px] text-gray-400 font-bold text-center mt-4">{w} × {h} px</p>
          </div>
        </div>
      </div>

      <FeaturesSection
        title="Cómo crear placeholders"
        description="Los placeholders son esenciales durante el desarrollo y presentación de prototipos. Genera imágenes de relleno con las dimensiones exactas que necesitas."
        steps={[
          'Elige un tamaño predefinido o introduce dimensiones personalizadas.',
          'Personaliza el texto central y el color de fondo de la imagen.',
          'Haz clic en "Generar y Descargar" para obtener tu PNG al instante.',
        ]}
      />
    </div>
  );
};

export default PlaceholderGen;