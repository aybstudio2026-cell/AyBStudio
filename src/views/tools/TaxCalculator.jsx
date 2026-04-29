import React, { useState } from 'react';
import { Percent, DollarSign } from 'lucide-react';
import { ToolHeader, FeaturesSection } from './ToolLayout';

const TaxCalculator = () => {
  const [amount, setAmount] = useState(100);
  const [taxRate, setTaxRate] = useState(21);
  const [isIncluding, setIsIncluding] = useState(true);

  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeRate = Number.isFinite(taxRate) ? taxRate : 0;

  const taxAmount = isIncluding
    ? safeAmount - (safeAmount / (1 + safeRate / 100))
    : safeAmount * (safeRate / 100);

  const netAmount = isIncluding
    ? safeAmount - taxAmount
    : safeAmount;

  const total = isIncluding
    ? safeAmount
    : safeAmount + taxAmount;

  return (
    <div className="pt-32 min-h-screen bg-studio-bg">
      <ToolHeader
        title="Tax"
        accent="Calculator"
        subtitle="Calcula IVA/impuestos, extrae el neto o suma el impuesto al monto base."
      />

      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-5">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Monto</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-50" size={18} />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-studio-bg rounded-xl p-3.5 pl-11 text-[13px] font-bold text-studio-text-title outline-none focus:ring-2 focus:ring-studio-primary"
                  />
                </div>
                <p className="text-[10px] font-bold text-studio-secondary/40">
                  {isIncluding ? 'Monto final (con impuesto)' : 'Monto base (sin impuesto)'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Impuesto (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary opacity-50" size={18} />
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-studio-bg rounded-xl p-3.5 pl-11 text-[13px] font-bold text-studio-text-title outline-none focus:ring-2 focus:ring-studio-primary"
                  />
                </div>
                <div className="flex gap-2">
                  {[5, 10, 16, 21].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTaxRate(r)}
                      className={`px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                        safeRate === r
                          ? 'border-studio-primary bg-studio-primary/5 text-studio-primary'
                          : 'border-gray-100 text-gray-400 hover:border-studio-primary/30'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Modo</p>
              <div className="flex bg-studio-bg p-1 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsIncluding(false)}
                  className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                    !isIncluding
                      ? 'bg-white shadow-sm text-studio-primary'
                      : 'text-studio-secondary/40 hover:text-studio-text-title'
                  }`}
                >
                  Añadir impuesto
                </button>
                <button
                  type="button"
                  onClick={() => setIsIncluding(true)}
                  className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                    isIncluding
                      ? 'bg-white shadow-sm text-studio-primary'
                      : 'text-studio-secondary/40 hover:text-studio-text-title'
                  }`}
                >
                  Extraer impuesto
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7">
            <div className="space-y-5">
              <div className="bg-studio-bg rounded-2xl p-5 border border-gray-100">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-studio-secondary/50">Resumen</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-studio-secondary">Neto</span>
                    <span className="text-[12px] font-black text-studio-text-title">${netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-studio-secondary">Impuesto</span>
                    <span className="text-[12px] font-black text-studio-primary">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-widest text-studio-text-title">Total</span>
                    <span className="text-xl font-black text-studio-text-title">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAmount(100)}
                  className="px-4 py-3 rounded-xl border border-gray-100 bg-white text-[9px] font-black uppercase tracking-widest text-studio-text-title hover:bg-studio-bg transition-all"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAmount(0);
                    setTaxRate(21);
                    setIsIncluding(true);
                  }}
                  className="px-4 py-3 rounded-xl bg-studio-text-title text-white text-[9px] font-black uppercase tracking-widest hover:bg-studio-primary transition-all"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturesSection
        title="Cómo usar la calculadora"
        description="Define el porcentaje de impuesto y el monto. Puedes sumar el impuesto al monto base o extraerlo de un total ya calculado."
        steps={[
          'Ingresa el monto (base o total) y el porcentaje de impuesto.',
          'Elige el modo: Añadir impuesto o Extraer impuesto.',
          'Revisa el neto, impuesto y total en el panel de resumen.'
        ]}
      />
    </div>
  );
};

export default TaxCalculator;