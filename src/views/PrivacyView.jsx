import { FiLock, FiEye, FiDatabase } from 'react-icons/fi';

export default function PrivacyView() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-soft-snow">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10 text-digital-lavender">
            <FiLock size={32} />
            <h1 className="text-4xl font-black text-panda-black uppercase tracking-tighter">Política de Privacidad</h1>
          </div>

          <div className="space-y-8 text-panda-black/70 font-medium leading-relaxed italic">
            <section>
              <h2 className="text-lg font-black text-panda-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiEye className="text-digital-lavender" size={20} /> Recopilación de Datos
              </h2>
              <p>Recopilamos información básica de tu perfil (correo electrónico y nombre de usuario) a través de <strong>Supabase Auth</strong> para gestionar tus compras y acceso a descargas.</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-panda-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiDatabase className="text-digital-lavender" size={20} /> Procesamiento de Pagos
              </h2>
              <p>No almacenamos información de tarjetas de crédito. Todos los pagos son procesados de forma segura por proveedores externos (como Lemon Squeezy), quienes cumplen con los estándares PCI-DSS.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}