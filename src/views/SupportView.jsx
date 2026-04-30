import { useState, useEffect } from 'react';
import { FiMail, FiMessageCircle, FiHelpCircle, FiChevronDown, FiSend, FiCheck, FiAlertCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import UserSidebar from '../components/layout/UserSidebar';

export default function SupportView() {
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState({ show: false, type: 'success', title: '', subtitle: '' });

  const showToast = (type, title, subtitle) => {
    setToast({ show: true, type, title, subtitle });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4500);
  };

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        setFormData(prev => ({ 
          ...prev, 
          email: user.email, 
          full_name: profile?.full_name || '', 
          user_id: user.id 
        }));
      }
    }
    getUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('support_tickets').insert([formData]);

    if (error) {
      showToast('error', 'Error al enviar', 'No se pudo registrar tu consulta. Reintenta pronto.');
    } else {
      // Notificación corregida para avisar sobre el correo
      showToast('success', 'Consulta enviada', 'Te responderemos directamente a tu correo electrónico.');
      setFormData({ ...formData, subject: '', message: '' }); 
    }
    setLoading(false);
  };

  const faqs = [
    { q: "¿Cómo canjeo mis A&BCoins?", a: "Ve a tu Billetera, copia el código que recibiste en tu inventario y pégalo en el campo 'Canjear Voucher'." },
    { q: "¿Qué hago si mi código no funciona?", a: "Verifica que no haya espacios extra. Si el problema persiste, envíanos un ticket con el email con el que realizaste la compra." },
    { q: "¿Los productos tienen actualizaciones?", a: "Sí, todos los productos tipo 'descargable' tienen actualizaciones de por vida gratuitas en tu inventario." }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="fixed top-24 right-6 z-[200] w-80 bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center overflow-hidden">
            <div className={`w-1.5 h-16 ${toast.type === 'error' ? 'bg-red-500' : 'bg-studio-primary'}`} />
            <div className="p-4 flex-1">
              <p className="font-bold text-studio-text-title text-sm">{toast.title}</p>
              <p className="text-[9px] font-bold text-studio-secondary uppercase mt-0.5 tracking-wider">{toast.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-10 items-start">
        <UserSidebar />

        <main className="flex-1 space-y-12">
          <header>
            <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em] mb-2">Help Center</p>
            <h1 className="text-5xl font-black text-studio-text-title uppercase italic tracking-tighter">Soporte <span className="text-studio-primary">Técnico</span></h1>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm order-2 xl:order-1">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-studio-text-title flex items-center gap-2">
                  <FiSend className="text-studio-primary" /> Envíanos tu duda
                </h3>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-widest mt-2">Atención personalizada vía Email</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" placeholder="Tu Nombre" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full bg-studio-bg border border-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-studio-primary" />
                  <input required type="email" placeholder="Email de contacto" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-studio-bg border border-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-studio-primary" />
                </div>
                <input required type="text" placeholder="Asunto" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-studio-bg border border-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-studio-primary" />
                <textarea required rows="5" placeholder="¿En qué podemos ayudarte?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-studio-bg border border-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:border-studio-primary resize-none" />
                
                <button disabled={loading} className="w-full py-5 bg-studio-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95">
                  {loading ? 'Enviando...' : <><FiSend /> Enviar y recibir respuesta por Email</>}
                </button>
              </form>
            </section>

            <section className="space-y-4 order-1 xl:order-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-studio-text-title mb-6">
                <FiHelpCircle className="text-studio-primary" /> Preguntas Frecuentes
              </h3>
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-studio-primary/20 transition-all">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full px-6 py-5 text-left flex justify-between items-center group">
                    <span className="text-sm font-bold text-studio-text-title group-hover:text-studio-primary transition-colors">{faq.q}</span>
                    <FiChevronDown className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-studio-primary' : 'text-studio-secondary'}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-5 overflow-hidden">
                        <p className="text-xs text-studio-secondary leading-relaxed border-t border-gray-50 pt-4">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}