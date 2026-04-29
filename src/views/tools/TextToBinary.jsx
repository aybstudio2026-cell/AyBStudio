import React, { useState } from 'react';
import { Binary, Terminal, Copy, Check } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const TextToBinary = () => {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [binary, setBinary] = useState('');
  const [copied, setCopied] = useState(false);

  const textExample = 'AyB Studio';
  const binaryExample = '01000001 01111001 01000010 00100000 01010011 01110100 01110101 01100100 01101001 01101111';

  const toBinary = (str) =>
    str
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');

  const normalizeBinary = (input) => input.trim().replace(/\s+/g, ' ');

  const isValidBinary = (input) => {
    if (!input.trim()) return false;
    const parts = normalizeBinary(input).split(' ');
    return parts.every((p) => /^[01]{8}$/.test(p));
  };

  const fromBinary = (input) => {
    const parts = normalizeBinary(input).split(' ');
    return parts.map((p) => String.fromCharCode(parseInt(p, 2))).join('');
  };

  const output = mode === 'text'
    ? (text ? toBinary(text) : '')
    : (isValidBinary(binary) ? fromBinary(binary) : '');

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Text"
        accent="to Binary"
        subtitle="Convierte texto a binario (8-bit) y decodifica binario a texto."
      />

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-5">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-6">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Modo</p>
              <div className="flex bg-studio-bg p-1 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setMode('text')}
                  className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                    mode === 'text'
                      ? 'bg-white shadow-sm text-studio-primary'
                      : 'text-studio-secondary/40 hover:text-studio-text-title'
                  }`}
                >
                  Texto → Binario
                </button>
                <button
                  type="button"
                  onClick={() => setMode('binary')}
                  className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                    mode === 'binary'
                      ? 'bg-white shadow-sm text-studio-primary'
                      : 'text-studio-secondary/40 hover:text-studio-text-title'
                  }`}
                >
                  Binario → Texto
                </button>
              </div>
            </div>

            {mode === 'text' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary/50">Entrada (Texto)</p>
                  <button
                    type="button"
                    onClick={() => {
                      setText(textExample);
                      setBinary('');
                    }}
                    className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all"
                  >
                    Cargar ejemplo
                  </button>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full bg-studio-bg rounded-2xl p-5 border border-gray-100 text-[12px] font-bold text-studio-text-title outline-none focus:ring-2 focus:ring-studio-primary resize-none"
                />
                <p className="text-[10px] font-bold text-studio-secondary/40">
                  Se convierte a binario de 8 bits por carácter (ASCII/UTF-16 básico).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary/50">Entrada (Binario)</p>
                  <button
                    type="button"
                    onClick={() => {
                      setBinary(binaryExample);
                      setText('');
                    }}
                    className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all"
                  >
                    Cargar ejemplo
                  </button>
                </div>
                <textarea
                  value={binary}
                  onChange={(e) => setBinary(e.target.value)}
                  rows={6}
                  placeholder="Ej: 01001000 01101111 01101100 01100001"
                  className="w-full bg-studio-bg rounded-2xl p-5 border border-gray-100 text-[11px] font-mono font-bold text-studio-text-title outline-none focus:ring-2 focus:ring-studio-primary resize-none"
                />
                {!binary.trim() ? (
                  <p className="text-[10px] font-bold text-studio-secondary/40">Formato esperado: bytes de 8 bits separados por espacios.</p>
                ) : isValidBinary(binary) ? (
                  <p className="text-[10px] font-bold text-studio-primary/70">Binario válido.</p>
                ) : (
                  <p className="text-[10px] font-bold text-red-400">Binario inválido. Usa solo 0/1 en grupos de 8 bits, separados por espacios.</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setText('');
                  setBinary('');
                }}
                className="px-4 py-4 rounded-2xl border border-gray-100 bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                className="px-4 py-4 rounded-2xl bg-studio-text-title text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-studio-primary transition-all shadow-xl shadow-studio-text-title/10 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copiado' : 'Copiar salida'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary/50">Salida</p>
              <div className="flex items-center gap-2 text-studio-primary">
                <Terminal size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest">Output</span>
              </div>
            </div>

            <div className="mt-5 bg-studio-bg rounded-2xl border border-gray-100 p-5 min-h-[320px] overflow-auto">
              {output ? (
                <pre className={`text-[11px] leading-relaxed ${mode === 'text' ? 'font-mono text-studio-text-title' : 'font-bold text-studio-text-title'}`}>
                  {output}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-studio-primary">
                    <Binary size={28} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-secondary/30">
                    Tu salida aparecerá aquí
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FeaturesSection
        title="Consejos"
        description="Esta herramienta trabaja con bytes de 8 bits separados por espacios. Para textos con emojis o caracteres especiales, el resultado puede variar según el encoding." 
        steps={[
          'Para decodificar, pega grupos de 8 bits (ej: 01001000 01101111...).',
          'Usa el botón de copiar para llevar la salida a cualquier app.',
          'Prueba con el ejemplo para ver el formato correcto.'
        ]}
      />
    </div>
  );
};

export default TextToBinary;