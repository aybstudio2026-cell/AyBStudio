import { FiFileText, FiShield, FiAlertCircle } from 'react-icons/fi';

export default function TermsView() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-soft-snow">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10 text-digital-lavender">
            <FiFileText size={32} />
            <h1 className="text-4xl font-black text-panda-black uppercase tracking-tighter">Términos y Condiciones</h1>
          </div>

          <div className="space-y-8 text-panda-black/70 font-medium leading-relaxed italic">
            <section>
              <h2 className="text-lg font-black text-panda-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-digital-lavender rounded-full"></div> 1. Licencia de Uso
              </h2>
              <p>Al adquirir productos en <strong>A&B Studio</strong>, se te otorga una licencia personal y comercial limitada. No está permitida la redistribución o reventa de los archivos originales de stickers o código fuente de aplicaciones sin autorización explícita.</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-panda-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-digital-lavender rounded-full"></div> 2. Productos Digitales
              </h2>
              <p>Debido a la naturaleza de los bienes digitales (descargas instantáneas), todas las ventas son finales. No se ofrecen reembolsos una vez que el acceso al producto ha sido entregado, salvo en casos de fallos técnicos demostrables.</p>
            </section>

            <section className="p-6 bg-soft-snow rounded-2xl border border-gray-100">
              <h3 className="flex items-center gap-2 font-black text-panda-black uppercase text-xs mb-2">
                <FiAlertCircle className="text-digital-lavender" /> Importante
              </h3>
              <p className="text-xs">A&B Studio se reserva el derecho de actualizar los términos de licencia para adaptarse a nuevas regulaciones o cambios en los servicios de terceros como Lemon Squeezy o Supabase.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}