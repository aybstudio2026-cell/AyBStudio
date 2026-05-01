import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else onClose();
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: username } }
      });
      if (error) alert(error.message);
      else alert('¡Revisa tu email para confirmar tu cuenta!');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-studio-text-title/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-[92%] md:w-full md:max-w-[400px] h-fit bg-studio-surface rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden border border-studio-border"
          >
            {/* Header del Modal */}
            <div className="p-6 pb-0 flex justify-between items-center">
              <div className="flex flex-col items-start leading-none">
                <span className="text-2xl font-black text-studio-text-title tracking-tighter uppercase">
                  A<span className="text-studio-primary">&</span>B
                </span>
                <span className="text-[9px] font-bold text-studio-text-title tracking-[0.3em] uppercase ml-1">
                  Studio
                </span>
              </div>
              
              <button onClick={onClose} className="p-2 hover:bg-studio-bg rounded-xl transition-colors text-studio-secondary">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* TÍTULO CENTRADO */}
              <div className="space-y-1 text-center">
                <h2 className="text-3xl font-black text-studio-text-title uppercase italic tracking-tighter">
                  {isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
                </h2>
                <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-[0.2em] opacity-60">
                  {isLogin ? 'Accede a tus recursos' : 'Únete a la comunidad'}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary" />
                    <input 
                      type="text" required value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nombre completo" 
                      className="w-full pl-12 pr-4 py-4 bg-studio-bg border border-transparent rounded-2xl outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-bold text-xs text-studio-text-title"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary" />
                  <input 
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email de acceso" 
                    className="w-full pl-12 pr-4 py-4 bg-studio-bg border border-transparent rounded-2xl outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-bold text-xs text-studio-text-title"
                  />
                </div>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-primary" />
                  <input 
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña" 
                    className="w-full pl-12 pr-4 py-4 bg-studio-bg border border-transparent rounded-2xl outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-bold text-xs text-studio-text-title"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-studio-text-title text-white font-black py-5 rounded-2xl shadow-lg hover:bg-studio-primary transition-all disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] mt-2 active:scale-95"
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Entrar al Estudio' : 'Empezar ahora')}
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-[10px] font-black text-studio-secondary uppercase tracking-widest">
                  {isLogin ? '¿Nuevo por aquí?' : '¿Ya eres miembro?'}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-studio-primary hover:underline transition-all font-black"
                  >
                    {isLogin ? 'Regístrate' : 'Inicia sesión'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}