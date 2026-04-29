import React from 'react';
import { ShieldCheck, Zap, Smartphone } from 'lucide-react';

// Sección de features reutilizable para todas las herramientas
export const FeaturesSection = ({ title, description, steps }) => (
  <section className="bg-white border-t border-gray-100 py-20 px-6 mt-16">
    <div className="max-w-4xl mx-auto">

      {/* Feature Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <div className="flex gap-4 items-start">
          <div className="w-11 h-11 shrink-0 bg-studio-bg text-studio-primary rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1">100% Privado</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Todo el proceso ocurre en tu navegador. Tus archivos nunca salen de tu dispositivo.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-11 h-11 shrink-0 bg-studio-bg text-studio-primary rounded-xl flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1">Ultra Rápido</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Sin tiempos de espera al servidor. Procesamiento local al instante.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-11 h-11 shrink-0 bg-studio-bg text-studio-primary rounded-xl flex items-center justify-center">
            <Smartphone size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1">Multidispositivo</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Funciona perfectamente en móviles, tablets y ordenadores.</p>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="bg-studio-bg rounded-3xl p-10">
        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 text-center">
          {title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 text-center max-w-2xl mx-auto">
          {description}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
              <div className="w-8 h-8 rounded-lg bg-studio-primary/10 text-studio-primary flex items-center justify-center font-black text-sm mb-4">
                {i + 1}
              </div>
              <p className="text-xs font-medium text-gray-600 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

// Header de herramienta reutilizable
export const ToolHeader = ({ title, accent, subtitle }) => (
  <div className="text-center px-6 mb-10">
    <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-4">
      {title} <span className="text-studio-primary">{accent}</span>
    </h1>
    {subtitle && (
      <p className="text-sm text-gray-500 italic max-w-md mx-auto">{subtitle}</p>
    )}
  </div>
);