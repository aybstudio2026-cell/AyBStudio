import React, { useState, useCallback } from 'react';
import { Lock, Copy, Check, RefreshCcw, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const CHARSET = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const getStrength = (password, options) => {
  const active = Object.values(options).filter(Boolean).length;
  if (password.length >= 20 && active >= 4) return { label: 'Muy fuerte', color: 'bg-green-500',  text: 'text-green-500',  width: 'w-full' };
  if (password.length >= 14 && active >= 3) return { label: 'Fuerte',     color: 'bg-studio-primary', text: 'text-studio-primary', width: 'w-3/4'  };
  if (password.length >= 10 && active >= 2) return { label: 'Media',      color: 'bg-amber-400',  text: 'text-amber-500',  width: 'w-1/2'  };
  return                                            { label: 'Débil',      color: 'bg-red-400',    text: 'text-red-500',    width: 'w-1/4'  };
};

const generatePassword = (length, options) => {
  let pool = '';
  if (options.upper)   pool += CHARSET.upper;
  if (options.lower)   pool += CHARSET.lower;
  if (options.numbers) pool += CHARSET.numbers;
  if (options.symbols) pool += CHARSET.symbols;
  if (!pool) pool = CHARSET.lower;

  // Guarantee at least one char from each selected set
  let pwd = [];
  if (options.upper)   pwd.push(CHARSET.upper[Math.floor(Math.random() * CHARSET.upper.length)]);
  if (options.lower)   pwd.push(CHARSET.lower[Math.floor(Math.random() * CHARSET.lower.length)]);
  if (options.numbers) pwd.push(CHARSET.numbers[Math.floor(Math.random() * CHARSET.numbers.length)]);
  if (options.symbols) pwd.push(CHARSET.symbols[Math.floor(Math.random() * CHARSET.symbols.length)]);

  while (pwd.length < length) {
    pwd.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Shuffle
  return pwd.sort(() => Math.random() - 0.5).join('');
};

const PRESETS = [
  { label: 'PIN',      length: 6,  options: { upper: false, lower: false, numbers: true,  symbols: false } },
  { label: 'Simple',   length: 12, options: { upper: true,  lower: true,  numbers: true,  symbols: false } },
  { label: 'Segura',   length: 16, options: { upper: true,  lower: true,  numbers: true,  symbols: true  } },
  { label: 'Máxima',   length: 24, options: { upper: true,  lower: true,  numbers: true,  symbols: true  } },
];

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);
  const [history, setHistory] = useState([]);

  const generate = useCallback(() => {
    const pwd = generatePassword(length, options);
    setPassword(pwd);
    setCopied(false);
    setHistory(prev => [pwd, ...prev].slice(0, 5));
  }, [length, options]);

  const copy = (pwd = password) => {
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset) => {
    setLength(preset.length);
    setOptions(preset.options);
    const pwd = generatePassword(preset.length, preset.options);
    setPassword(pwd);
    setCopied(false);
  };

  const strength = password ? getStrength(password, options) : null;

  const toggleOption = (key) => {
    const next = { ...options, [key]: !options[key] };
    if (!Object.values(next).some(Boolean)) return; // al menos 1 activo
    setOptions(next);
    if (password) {
      const pwd = generatePassword(length, next);
      setPassword(pwd);
    }
  };

  const OPTION_LABELS = {
    upper:   { label: 'Mayúsculas', example: 'A–Z' },
    lower:   { label: 'Minúsculas', example: 'a–z' },
    numbers: { label: 'Números',    example: '0–9' },
    symbols: { label: 'Símbolos',   example: '!@#$' },
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Generador"
        accent="Claves"
        subtitle="Crea contraseñas seguras e imposibles de adivinar con parámetros personalizados."
      />

      <div className="max-w-xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">

            {/* Presets */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Presets rápidos</p>
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => applyPreset(p)}
                    className="py-2 px-1 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all border bg-studio-bg border-gray-100 text-gray-500 hover:border-studio-primary hover:text-studio-primary">
                    {p.label}
                    <span className="block text-[7px] opacity-60 mt-0.5">{p.length} chars</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Longitud</p>
                <span className="text-sm font-black text-studio-primary">{length} caracteres</span>
              </div>
              <input type="range" min="4" max="64" value={length}
                onChange={e => { setLength(Number(e.target.value)); if (password) setPassword(generatePassword(Number(e.target.value), options)); }}
                className="w-full accent-studio-primary h-1.5 rounded-full bg-gray-100 appearance-none cursor-pointer" />
              <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1.5">
                <span>4</span><span>64</span>
              </div>
            </div>

            {/* Options */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Caracteres</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(OPTION_LABELS).map(([key, { label, example }]) => (
                  <button key={key} onClick={() => toggleOption(key)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left
                      ${options[key]
                        ? 'border-studio-primary bg-studio-bg text-studio-primary'
                        : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wide block">{label}</span>
                      <span className="text-[8px] font-mono opacity-60">{example}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                      ${options[key] ? 'border-studio-primary bg-studio-primary' : 'border-gray-200'}`}>
                      {options[key] && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button onClick={generate}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-studio-primary transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <RefreshCcw size={16} /> Generar contraseña
            </button>

            {/* Result */}
            {password && (
              <div className="space-y-4">
                {/* Password display */}
                <div className="bg-studio-bg rounded-2xl p-5 relative group">
                  <p className={`font-mono font-black text-gray-800 break-all leading-relaxed pr-8 ${visible ? 'text-sm' : 'text-xl tracking-widest'}`}>
                    {visible ? password : '•'.repeat(password.length)}
                  </p>
                  <button onClick={() => setVisible(v => !v)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-studio-primary transition-colors">
                    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength meter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fortaleza</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                </div>

                {/* Copy button */}
                <button onClick={() => copy()}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 active:scale-95
                    ${copied
                      ? 'bg-green-50 border-green-200 text-green-600'
                      : 'bg-white border-studio-primary text-studio-primary hover:bg-studio-bg'}`}>
                  {copied ? <><Check size={16} /> ¡Copiada!</> : <><Copy size={16} /> Copiar contraseña</>}
                </button>
              </div>
            )}

            {/* History */}
            {history.length > 1 && (
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Historial reciente</p>
                <div className="space-y-2">
                  {history.slice(1).map((pwd, i) => (
                    <div key={i} className="flex items-center justify-between bg-studio-bg rounded-xl px-4 py-3 group">
                      <span className="text-[10px] font-mono text-gray-500 truncate max-w-[240px]">{pwd}</span>
                      <button onClick={() => copy(pwd)}
                        className="text-gray-300 hover:text-studio-primary transition-colors opacity-0 group-hover:opacity-100">
                        <Copy size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <FeaturesSection
        title="Cómo generar claves seguras"
        description="Una contraseña segura combina longitud, variedad de caracteres e impredecibilidad. Nuestro generador usa aleatoriedad criptográfica para máxima seguridad."
        steps={[
          'Elige un preset o configura manualmente la longitud y el tipo de caracteres.',
          'Haz clic en "Generar" para crear una contraseña única e impredecible.',
          'Copia la contraseña y guárdala en tu gestor de contraseñas favorito.',
        ]}
      />
    </div>
  );
};

export default PasswordGenerator;