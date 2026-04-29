import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Wifi, Link, RefreshCcw } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

// Requiere: npm install qrcode
// O via CDN en index.html:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

const MODES = [
  { id: 'url',   label: 'URL / Link',   icon: <Link size={15} />,  placeholder: 'https://aybstudio.com' },
  { id: 'wifi',  label: 'WiFi',         icon: <Wifi size={15} />,  placeholder: '' },
  { id: 'text',  label: 'Texto libre',  icon: <QrCode size={15} />, placeholder: 'Escribe cualquier texto...' },
];

const WIFI_SECURITY = ['WPA', 'WEP', 'nopass'];

const QR_SIZES = [128, 256, 512];

const QrGenerator = () => {
  const [mode, setMode]           = useState('url');
  const [input, setInput]         = useState('');
  const [wifiSsid, setWifiSsid]   = useState('');
  const [wifiPass, setWifiPass]   = useState('');
  const [wifiSec, setWifiSec]     = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [size, setSize]           = useState(256);
  const [fgColor, setFgColor]     = useState('#1a1a2e');
  const [bgColor, setBgColor]     = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  const getQrContent = () => {
    if (mode === 'wifi') {
      // WiFi QR string format
      const pass = wifiSec === 'nopass' ? '' : wifiPass;
      const hidden = wifiHidden ? 'H:true;' : '';
      return `WIFI:T:${wifiSec};S:${wifiSsid};P:${pass};${hidden};`;
    }
    return input;
  };

  const isValid = () => {
    if (mode === 'wifi') return wifiSsid.trim().length > 0;
    return input.trim().length > 0;
  };

  const generateQr = async () => {
    if (!isValid()) return;
    setIsGenerating(true);

    try {
      const content = getQrContent();
      const QRCodeModule = await import('qrcode');
      const QRCode = QRCodeModule.default ?? QRCodeModule;
      const url = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error al generar el QR. Verifica que qrcode esté instalado.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-regenerar al cambiar opciones si ya hay QR
  useEffect(() => {
    if (qrDataUrl) generateQr();
  }, [size, fgColor, bgColor]);

  const download = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qr-aybstudio-${size}x${size}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleModeChange = (m) => {
    setMode(m);
    setQrDataUrl('');
    setInput('');
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="QR Code"
        accent="Generator"
        subtitle="Genera códigos QR para links, redes WiFi o cualquier texto. Descarga en alta resolución."
      />

      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-5">

          {/* Panel izquierdo — configuración */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-6">

            {/* Selector de modo */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Tipo de QR</p>
              <div className="grid grid-cols-3 gap-2">
                {MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all text-center
                      ${mode === m.id
                        ? 'border-studio-primary bg-studio-primary/5 text-studio-primary'
                        : 'border-gray-100 text-gray-400 hover:border-studio-primary/30'}`}
                  >
                    {m.icon}
                    <span className="text-[8px] font-black uppercase tracking-wide leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs según modo */}
            {mode === 'wifi' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nombre de red (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={e => { setWifiSsid(e.target.value); setQrDataUrl(''); }}
                    placeholder="Mi Red WiFi"
                    className="w-full bg-studio-bg rounded-xl p-3.5 text-sm font-medium text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Contraseña</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={e => { setWifiPass(e.target.value); setQrDataUrl(''); }}
                    placeholder={wifiSec === 'nopass' ? 'Sin contraseña' : 'contraseña123'}
                    disabled={wifiSec === 'nopass'}
                    className="w-full bg-studio-bg rounded-xl p-3.5 text-sm font-medium text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none disabled:opacity-40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Seguridad</label>
                    <select
                      value={wifiSec}
                      onChange={e => { setWifiSec(e.target.value); setQrDataUrl(''); }}
                      className="w-full bg-studio-bg rounded-xl p-3.5 text-sm font-medium text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none"
                    >
                      {WIFI_SECURITY.map(s => <option key={s} value={s}>{s === 'nopass' ? 'Sin contraseña' : s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      onClick={() => { setWifiHidden(v => !v); setQrDataUrl(''); }}
                      className={`w-full py-3.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all
                        ${wifiHidden ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400'}`}
                    >
                      {wifiHidden ? '🔒 Oculta' : 'Red visible'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  {mode === 'url' ? 'URL o enlace' : 'Texto'}
                </label>
                <textarea
                  value={input}
                  onChange={e => { setInput(e.target.value); setQrDataUrl(''); }}
                  placeholder={MODES.find(m => m.id === mode)?.placeholder}
                  rows={mode === 'text' ? 4 : 2}
                  className="w-full bg-studio-bg rounded-xl p-3.5 text-sm font-medium text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none resize-none"
                />
              </div>
            )}

            {/* Opciones visuales */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Color del QR</label>
                <div className="flex items-center gap-2 bg-studio-bg rounded-xl p-2">
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                  <span className="text-xs font-mono font-bold text-gray-500">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Color de fondo</label>
                <div className="flex items-center gap-2 bg-studio-bg rounded-xl p-2">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                  <span className="text-xs font-mono font-bold text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Tamaño */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Tamaño de exportación</p>
              <div className="flex gap-2">
                {QR_SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all
                      ${size === s ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400 hover:border-studio-primary/30'}`}>
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateQr}
              disabled={!isValid() || isGenerating}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {isGenerating
                ? <><RefreshCcw size={15} className="animate-spin" /> Generando...</>
                : <><QrCode size={15} /> Generar QR</>
              }
            </button>
          </div>

          {/* Panel derecho — preview */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 flex flex-col items-center justify-center gap-6">
            {qrDataUrl ? (
              <>
                <div className="p-4 rounded-3xl shadow-inner border border-gray-100" style={{ backgroundColor: bgColor }}>
                  <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 block" style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {size} × {size} px · PNG
                  </p>
                  <p className="text-[9px] text-gray-300 font-medium truncate max-w-[200px]">
                    {mode === 'wifi' ? `WiFi: ${wifiSsid}` : input.slice(0, 40)}
                  </p>
                </div>
                <button
                  onClick={download}
                  className="w-full bg-studio-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  <Download size={15} /> Descargar PNG
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-48 h-48 bg-studio-bg rounded-3xl flex items-center justify-center">
                  <QrCode size={64} className="text-gray-200" />
                </div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Tu QR aparecerá aquí
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <FeaturesSection
        title="Cómo generar tu QR"
        description="Crea códigos QR escaneables para compartir links, conectar a redes WiFi o codificar cualquier texto. Descarga en alta resolución listo para imprimir."
        steps={[
          'Elige el tipo de QR: URL, WiFi o texto libre e ingresa el contenido.',
          'Personaliza el color del código y el fondo a tu gusto.',
          'Genera y descarga el QR en PNG a la resolución que necesites.',
        ]}
      />
    </div>
  );
};

export default QrGenerator;