import React, { useState } from 'react';
import { Link, Image, Type, AlignLeft, RefreshCcw, Copy, Check, Globe, AlertCircle } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

// ── Plataformas de preview ────────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'facebook',  label: 'Facebook',  icon: '📘' },
  { id: 'twitter',   label: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: '💼' },
  { id: 'whatsapp',  label: 'WhatsApp',  icon: '💬' },
  { id: 'discord',   label: 'Discord',   icon: '🎮' },
  { id: 'telegram',  label: 'Telegram',  icon: '✈️'  },
];

const CHAR_LIMITS = {
  title:       { facebook: 60,  twitter: 70,  linkedin: 70,  whatsapp: 65,  discord: 256, telegram: 256 },
  description: { facebook: 160, twitter: 200, linkedin: 160, whatsapp: 130, discord: 350, telegram: 300 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const getDomain = (url) => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
};

const truncate = (str, max) =>
  str.length > max ? str.slice(0, max - 3) + '...' : str;

const MetaTag = ({ name, content, onCopy, copied }) => (
  <div className="flex items-start gap-3 group">
    <code className="text-[9px] font-mono text-studio-primary bg-studio-primary/5 px-2 py-1 rounded-lg shrink-0 mt-0.5">
      {name}
    </code>
    <span className="text-[10px] font-mono text-gray-600 flex-1 break-all leading-relaxed">{content || '—'}</span>
    <button onClick={() => onCopy(content)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-studio-primary">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  </div>
);

// ── Platform Preview Components ───────────────────────────────────────────────

const FacebookPreview = ({ title, description, image, url }) => (
  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm max-w-md">
    {image
      ? <img src={image} alt="" className="w-full h-48 object-cover bg-gray-100" onError={e => e.target.style.display='none'} />
      : <div className="w-full h-48 bg-gray-100 flex items-center justify-center"><Image size={32} className="text-gray-300" /></div>
    }
    <div className="p-4 bg-[#f0f2f5]">
      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{getDomain(url) || 'ejemplo.com'}</p>
      <p className="text-sm font-black text-gray-900 leading-tight mb-1">
        {truncate(title || 'Título de la página', CHAR_LIMITS.title.facebook)}
      </p>
      <p className="text-xs text-gray-500 leading-snug">
        {truncate(description || 'Descripción de la página que aparecerá en Facebook al compartir el enlace.', CHAR_LIMITS.description.facebook)}
      </p>
    </div>
  </div>
);

const TwitterPreview = ({ title, description, image, url, cardType }) => (
  <div className={`rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm max-w-md ${cardType === 'summary' ? 'flex gap-0' : ''}`}>
    {cardType === 'summary' ? (
      <>
        <div className="w-32 shrink-0 bg-gray-100 flex items-center justify-center">
          {image
            ? <img src={image} alt="" className="w-full h-full object-cover" style={{minHeight:'100px'}} onError={e => e.target.style.display='none'} />
            : <Image size={20} className="text-gray-300" />
          }
        </div>
        <div className="p-4">
          <p className="text-xs font-black text-gray-900 leading-tight mb-1">
            {truncate(title || 'Título de la página', CHAR_LIMITS.title.twitter)}
          </p>
          <p className="text-xs text-gray-500 leading-snug mb-2">
            {truncate(description || 'Descripción breve.', 100)}
          </p>
          <p className="text-[10px] text-gray-400">{getDomain(url) || 'ejemplo.com'}</p>
        </div>
      </>
    ) : (
      <>
        {image
          ? <img src={image} alt="" className="w-full h-52 object-cover bg-gray-100" onError={e => e.target.style.display='none'} />
          : <div className="w-full h-52 bg-gray-100 flex items-center justify-center"><Image size={32} className="text-gray-300" /></div>
        }
        <div className="p-4">
          <p className="text-sm font-black text-gray-900 leading-tight mb-1">
            {truncate(title || 'Título de la página', CHAR_LIMITS.title.twitter)}
          </p>
          <p className="text-xs text-gray-500 leading-snug mb-2">
            {truncate(description || 'Descripción de la página.', CHAR_LIMITS.description.twitter)}
          </p>
          <p className="text-[10px] text-gray-400">{getDomain(url) || 'ejemplo.com'}</p>
        </div>
      </>
    )}
  </div>
);

const LinkedInPreview = ({ title, description, image, url }) => (
  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm max-w-md">
    {image
      ? <img src={image} alt="" className="w-full h-44 object-cover bg-gray-100" onError={e => e.target.style.display='none'} />
      : <div className="w-full h-44 bg-gray-100 flex items-center justify-center"><Image size={32} className="text-gray-300" /></div>
    }
    <div className="p-4 bg-white border-t border-gray-100">
      <p className="text-sm font-black text-gray-900 leading-tight mb-1">
        {truncate(title || 'Título de la página', CHAR_LIMITS.title.linkedin)}
      </p>
      <p className="text-[10px] text-gray-500">{getDomain(url) || 'ejemplo.com'}</p>
    </div>
  </div>
);

const WhatsAppPreview = ({ title, description, image, url }) => (
  <div className="max-w-xs">
    <div className="bg-[#dcf8c6] rounded-2xl rounded-bl-none p-3 shadow-sm border border-green-100">
      <p className="text-xs text-gray-600 mb-2 break-all">{url || 'https://ejemplo.com'}</p>
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
        {image && (
          <img src={image} alt="" className="w-full h-32 object-cover" onError={e => e.target.style.display='none'} />
        )}
        <div className="p-3 border-l-4 border-studio-primary">
          <p className="text-xs font-black text-gray-900 mb-0.5">
            {truncate(title || 'Título de la página', CHAR_LIMITS.title.whatsapp)}
          </p>
          <p className="text-[10px] text-gray-500 leading-snug">
            {truncate(description || 'Descripción breve.', CHAR_LIMITS.description.whatsapp)}
          </p>
          <p className="text-[9px] text-gray-400 mt-1">{getDomain(url) || 'ejemplo.com'}</p>
        </div>
      </div>
      <p className="text-[9px] text-gray-400 text-right mt-1">12:34 ✓✓</p>
    </div>
  </div>
);

const DiscordPreview = ({ title, description, image, url }) => (
  <div className="bg-[#36393f] rounded-2xl p-4 max-w-md border-l-4 border-[#5865f2]">
    <p className="text-[10px] text-[#00aff4] font-bold mb-2 break-all">{url || 'https://ejemplo.com'}</p>
    {image && (
      <img src={image} alt="" className="w-full h-40 object-cover rounded-xl mb-3 bg-gray-700" onError={e => e.target.style.display='none'} />
    )}
    <p className="text-sm font-black text-[#00aff4] mb-1">
      {truncate(title || 'Título de la página', CHAR_LIMITS.title.discord)}
    </p>
    <p className="text-xs text-[#b9bbbe] leading-snug">
      {truncate(description || 'Descripción de la página.', CHAR_LIMITS.description.discord)}
    </p>
  </div>
);

const TelegramPreview = ({ title, description, image, url }) => (
  <div className="max-w-xs">
    <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100">
      <div className="border-l-4 border-studio-primary pl-3">
        {image && (
          <img src={image} alt="" className="w-full h-32 object-cover rounded-lg mb-2" onError={e => e.target.style.display='none'} />
        )}
        <p className="text-xs font-black text-studio-primary mb-0.5">
          {truncate(title || 'Título de la página', CHAR_LIMITS.title.telegram)}
        </p>
        <p className="text-[10px] text-gray-500 leading-snug">
          {truncate(description || 'Descripción breve.', 150)}
        </p>
        <p className="text-[9px] text-gray-400 mt-1">{getDomain(url) || 'ejemplo.com'}</p>
      </div>
    </div>
  </div>
);

const PREVIEW_MAP = { facebook: FacebookPreview, twitter: TwitterPreview, linkedin: LinkedInPreview, whatsapp: WhatsAppPreview, discord: DiscordPreview, telegram: TelegramPreview };

// ── Main Component ────────────────────────────────────────────────────────────

const OpenGraphPreview = () => {
  const [url,         setUrl]         = useState('');
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl,    setImageUrl]    = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [platform,    setPlatform]    = useState('facebook');
  const [copiedTag,   setCopiedTag]   = useState('');

  const copyTag = (content) => {
    navigator.clipboard.writeText(content);
    setCopiedTag(content);
    setTimeout(() => setCopiedTag(''), 2000);
  };

  const PreviewComponent = PREVIEW_MAP[platform];

  const titleLen = title.length;
  const descLen  = description.length;
  const titleMax = CHAR_LIMITS.title[platform];
  const descMax  = CHAR_LIMITS.description[platform];

  const metaTags = `<!-- Open Graph -->
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="${twitterCard}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`;

  const [copiedAll, setCopiedAll] = useState(false);
  const copyAll = () => {
    navigator.clipboard.writeText(metaTags);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Open Graph"
        accent="Preview"
        subtitle="Visualiza cómo se verá tu enlace al compartirlo en Facebook, Twitter, WhatsApp y más."
      />

      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-5 items-start">

          {/* Left — Form */}
          <div className="space-y-4">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-5">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Datos de tu página</p>

              {/* URL */}
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">URL de la página</label>
                <div className="flex items-center gap-2 bg-studio-bg rounded-xl px-4 py-3">
                  <Globe size={14} className="text-gray-400 shrink-0" />
                  <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                    placeholder="https://tudominio.com/pagina"
                    className="flex-1 bg-transparent text-sm font-medium text-gray-700 border-none outline-none placeholder:text-gray-300" />
                </div>
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Título (og:title)</label>
                  <span className={`text-[8px] font-black ${titleLen > titleMax ? 'text-red-400' : titleLen > titleMax * 0.8 ? 'text-amber-400' : 'text-gray-300'}`}>
                    {titleLen}/{titleMax}
                  </span>
                </div>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="El título que verán al compartir"
                  className="w-full bg-studio-bg rounded-xl p-3.5 text-sm font-medium text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none" />
                {titleLen > titleMax && (
                  <p className="text-[9px] text-red-400 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> Se truncará en {platform}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Descripción (og:description)</label>
                  <span className={`text-[8px] font-black ${descLen > descMax ? 'text-red-400' : descLen > descMax * 0.8 ? 'text-amber-400' : 'text-gray-300'}`}>
                    {descLen}/{descMax}
                  </span>
                </div>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Descripción breve que aparecerá debajo del título..."
                  rows={3}
                  className="w-full bg-studio-bg rounded-xl p-3.5 text-sm font-medium text-gray-700 border-none focus:ring-2 focus:ring-studio-primary outline-none resize-none" />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                  URL de imagen (og:image)
                </label>
                <div className="flex items-center gap-2 bg-studio-bg rounded-xl px-4 py-3">
                  <Image size={14} className="text-gray-400 shrink-0" />
                  <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://tudominio.com/imagen.jpg"
                    className="flex-1 bg-transparent text-sm font-medium text-gray-700 border-none outline-none placeholder:text-gray-300" />
                </div>
                <p className="text-[9px] text-gray-400 mt-1">Recomendado: 1200×630px · JPG o PNG</p>
              </div>

              {/* Twitter card type */}
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Twitter card type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'summary_large_image', label: 'Imagen grande' },
                    { id: 'summary',             label: 'Imagen pequeña' },
                  ].map(c => (
                    <button key={c.id} onClick={() => setTwitterCard(c.id)}
                      className={`py-2.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all
                        ${twitterCard === c.id ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Meta tags code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 bg-studio-bg border-b border-gray-100 flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meta tags generados</span>
                <button onClick={copyAll}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border
                    ${copiedAll ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-500 hover:border-studio-primary hover:text-studio-primary'}`}>
                  {copiedAll ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> Copiar todo</>}
                </button>
              </div>
              <div className="p-5 space-y-2.5">
                {[
                  ['og:title',       title],
                  ['og:description', description],
                  ['og:image',       imageUrl],
                  ['og:url',         url],
                  ['twitter:card',   twitterCard],
                ].map(([name, content]) => (
                  <MetaTag key={name} name={name} content={content}
                    onCopy={copyTag} copied={copiedTag === content} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Preview */}
          <div className="space-y-4 sticky top-24">
            {/* Platform selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Previsualizar en</p>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all
                      ${platform === p.id ? 'border-studio-primary bg-studio-primary/5 text-studio-primary' : 'border-gray-100 text-gray-400 hover:border-studio-primary/30'}`}>
                    <span>{p.icon}</span>
                    <span className="hidden sm:block">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview frame */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  {PLATFORMS.find(p => p.id === platform)?.icon}{' '}
                  {PLATFORMS.find(p => p.id === platform)?.label}
                </p>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                </div>
              </div>

              <div className={`flex justify-center ${platform === 'discord' ? 'bg-[#2f3136] p-4 rounded-xl' : ''}`}>
                <PreviewComponent
                  title={title}
                  description={description}
                  image={imageUrl}
                  url={url}
                  cardType={twitterCard}
                />
              </div>
            </div>

            {/* Tips card */}
            <div className="bg-studio-bg rounded-2xl border border-gray-100 p-5 space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Tips de optimización</p>
              {[
                { icon: '📐', tip: 'Imagen: mínimo 1200×630px para máxima calidad.' },
                { icon: '✍️',  tip: 'Título: 50–60 caracteres es lo ideal.' },
                { icon: '📝', tip: 'Descripción: entre 120–160 caracteres.' },
                { icon: '🔄', tip: 'Usa og:type "article" para posts de blog.' },
              ].map(({ icon, tip }) => (
                <div key={tip} className="flex items-start gap-2">
                  <span className="text-sm shrink-0">{icon}</span>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FeaturesSection
        title="Cómo usar Open Graph Preview"
        description="Los meta tags Open Graph controlan cómo aparece tu enlace al ser compartido en redes sociales. Un buen preview aumenta el CTR hasta un 3x."
        steps={[
          'Rellena el título, descripción e imagen que quieres mostrar al compartir.',
          'Selecciona la red social para ver cómo se renderizará exactamente.',
          'Copia los meta tags generados y pégalos en el <head> de tu HTML.',
        ]}
      />
    </div>
  );
};

export default OpenGraphPreview;