import { FiLayers, FiPenTool, FiCode } from 'react-icons/fi';

const features = [
  { icon: FiLayers, title: "Apps & Utilities", desc: "Software minimalista para mejorar tu flujo de trabajo diario." },
  { icon: FiPenTool, title: "Digital Assets", desc: "Packs de stickers y recursos kawaii para creadores digitales." },
  { icon: FiCode, title: "Custom Dev", desc: "Soluciones a medida con arquitectura limpia y alto rendimiento." }
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <div key={i} className="group p-8 rounded-[3rem] hover:bg-soft-snow transition-all border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 bg-digital-lavender/10 rounded-3xl flex items-center justify-center text-digital-lavender mb-6 group-hover:scale-110 transition-transform">
              <f.icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-panda-black mb-4 uppercase tracking-tighter">{f.title}</h3>
            <p className="text-sm font-medium text-panda-black/40 leading-relaxed italic">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}