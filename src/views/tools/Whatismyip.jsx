import React, { useState, useEffect } from 'react';
import { Wifi, Monitor, Globe, Copy, Check, RefreshCcw, Smartphone, Shield } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const parseUserAgent = (ua) => {
  // Browser
  let browser = 'Desconocido';
  if (/Edg\//.test(ua))        browser = 'Microsoft Edge';
  else if (/OPR\//.test(ua))   browser = 'Opera';
  else if (/Chrome\//.test(ua)) browser = 'Google Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Mozilla Firefox';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  // Browser version
  let version = '';
  const vMatch = ua.match(/(Chrome|Firefox|Safari|Edg|OPR)\/([0-9.]+)/);
  if (vMatch) version = vMatch[2].split('.')[0];

  // OS
  let os = 'Desconocido';
  if (/Windows NT 10/.test(ua))      os = 'Windows 10/11';
  else if (/Windows NT 6.3/.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6.1/.test(ua)) os = 'Windows 7';
  else if (/Mac OS X/.test(ua))       os = 'macOS';
  else if (/Android/.test(ua)) {
    const v = ua.match(/Android ([0-9.]+)/);
    os = `Android ${v ? v[1] : ''}`;
  }
  else if (/iPhone|iPad/.test(ua)) {
    const v = ua.match(/OS ([0-9_]+)/);
    os = `iOS ${v ? v[1].replace(/_/g, '.') : ''}`;
  }
  else if (/Linux/.test(ua)) os = 'Linux';

  // Device type
  let device = 'Escritorio';
  if (/Mobile|Android|iPhone/.test(ua)) device = 'Móvil';
  else if (/iPad|Tablet/.test(ua))       device = 'Tablet';

  // Rendering engine
  let engine = 'Desconocido';
  if (/Gecko\//.test(ua))   engine = 'Gecko';
  if (/WebKit\//.test(ua))  engine = 'WebKit';
  if (/Blink/.test(ua) || /Chrome/.test(ua)) engine = 'Blink';

  return { browser, version, os, device, engine };
};

const InfoCard = ({ icon, label, value, onCopy, copied }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4 group">
    <div className="w-10 h-10 bg-studio-bg rounded-xl flex items-center justify-center text-studio-primary shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">{label}</span>
      <span className="text-sm font-black text-gray-800 truncate block">{value || '—'}</span>
    </div>
    {onCopy && (
      <button
        onClick={onCopy}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-studio-primary"
      >
        {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
      </button>
    )}
  </div>
);

const WhatIsMyIp = () => {
  const [ip, setIp]           = useState('');
  const [ipv6, setIpv6]       = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [copied, setCopied]   = useState({});
  const [geoData, setGeoData] = useState(null);

  const ua = navigator.userAgent;
  const parsed = parseUserAgent(ua);

  const fetchIp = async () => {
    setLoading(true);
    setError(false);
    try {
      // IPv4
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setIp(data.ip);

      // Geo data (sin API key)
      try {
        const geoRes = await fetch(`https://ipapi.co/${data.ip}/json/`);
        const geo = await geoRes.json();
        setGeoData({
          country: geo.country_name,
          city: geo.city,
          region: geo.region,
          org: geo.org,
          timezone: geo.timezone,
        });
      } catch { /* geo optional */ }

      // IPv6 (puede fallar si no tiene IPv6)
      try {
        const res6 = await fetch('https://api64.ipify.org?format=json');
        const d6 = await res6.json();
        if (d6.ip !== data.ip) setIpv6(d6.ip);
      } catch { /* optional */ }

    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIp(); }, []);

  const copy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

  const screenInfo = `${window.screen.width}×${window.screen.height} (ratio ${window.devicePixelRatio}x)`;
  const langInfo = navigator.language || navigator.languages?.[0] || '—';
  const cookiesEnabled = navigator.cookieEnabled ? 'Sí' : 'No';
  const doNotTrack = navigator.doNotTrack === '1' ? 'Activado' : 'Desactivado';
  const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} núcleos` : '—';
  const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '—';
  const connection = navigator.connection?.effectiveType?.toUpperCase() || '—';
  const online = navigator.onLine ? 'En línea' : 'Desconectado';

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="What is"
        accent="My IP?"
        subtitle="Conoce tu dirección IP pública, navegador, sistema operativo y más datos de tu conexión."
      />

      <div className="max-w-4xl mx-auto px-6 mb-16 space-y-5">

        {/* IP Hero card */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-studio-bg rounded-3xl flex items-center justify-center text-studio-primary shrink-0">
              <Globe size={36} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tu IP pública (IPv4)</p>
              {loading ? (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <RefreshCcw size={18} className="text-studio-primary animate-spin" />
                  <span className="text-lg font-black text-gray-300">Detectando...</span>
                </div>
              ) : error ? (
                <span className="text-lg font-black text-red-400">No se pudo detectar</span>
              ) : (
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <span className="text-3xl font-black text-gray-900 tracking-tight font-mono">{ip}</span>
                  <button onClick={() => copy('ip', ip)}
                    className="text-gray-300 hover:text-studio-primary transition-colors">
                    {copied.ip ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              )}
              {geoData && (
                <p className="text-xs text-gray-400 mt-1">
                  📍 {[geoData.city, geoData.region, geoData.country].filter(Boolean).join(', ')}
                  {geoData.timezone && ` · 🕐 ${geoData.timezone}`}
                </p>
              )}
            </div>
            <button onClick={fetchIp} disabled={loading}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-studio-bg text-studio-primary text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-40">
              <RefreshCcw size={13} className={loading ? 'animate-spin' : ''} /> Actualizar
            </button>
          </div>

          {/* IPv6 + ISP bar */}
          {(ipv6 || geoData?.org) && (
            <div className="border-t border-gray-50 px-8 py-3 flex flex-wrap gap-6">
              {ipv6 && (
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">IPv6:</span>
                  <span className="text-xs font-mono font-bold text-gray-600">{ipv6}</span>
                  <button onClick={() => copy('ipv6', ipv6)} className="text-gray-300 hover:text-studio-primary transition-colors">
                    {copied.ipv6 ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
              {geoData?.org && (
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ISP:</span>
                  <span className="text-xs font-bold text-gray-600">{geoData.org}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grid de info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard icon={<Monitor size={18} />}    label="Navegador"       value={`${parsed.browser}${parsed.version ? ` ${parsed.version}` : ''}`} onCopy={() => copy('browser', parsed.browser)} copied={copied.browser} />
          <InfoCard icon={<Smartphone size={18} />} label="Sistema operativo" value={parsed.os} />
          <InfoCard icon={<Monitor size={18} />}    label="Tipo de dispositivo" value={parsed.device} />
          <InfoCard icon={<Wifi size={18} />}       label="Conexión"        value={`${online}${connection !== '—' ? ` · ${connection}` : ''}`} />
          <InfoCard icon={<Monitor size={18} />}    label="Resolución de pantalla" value={screenInfo} />
          <InfoCard icon={<Globe size={18} />}      label="Idioma"          value={langInfo} />
          <InfoCard icon={<Shield size={18} />}     label="Do Not Track"    value={doNotTrack} />
          <InfoCard icon={<Monitor size={18} />}    label="CPU / Memoria"   value={`${cores}${memory !== '—' ? ` · ${memory} RAM` : ''}`} />
        </div>

        {/* User Agent completo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">User Agent completo</p>
            <button onClick={() => copy('ua', ua)}
              className="flex items-center gap-1.5 text-[9px] font-black text-studio-primary uppercase tracking-widest hover:opacity-70 transition-opacity">
              {copied.ua ? <><Check size={11} className="text-green-500" /> Copiado</> : <><Copy size={11} /> Copiar</>}
            </button>
          </div>
          <p className="text-[10px] font-mono text-gray-500 leading-relaxed break-all bg-studio-bg rounded-xl p-4">
            {ua}
          </p>
        </div>

      </div>

      <FeaturesSection
        title="Qué información detectamos"
        description="Esta herramienta analiza los datos públicos que tu navegador comparte automáticamente con cualquier sitio web que visitas, sin instalar nada."
        steps={[
          'Tu IP pública es visible para todos los sitios que visitas. Aquí te la mostramos claramente.',
          'El User Agent revela tu navegador, sistema operativo y tipo de dispositivo.',
          'Todos los datos se obtienen localmente o vía APIs públicas. No guardamos nada.',
        ]}
      />
    </div>
  );
};

export default WhatIsMyIp;