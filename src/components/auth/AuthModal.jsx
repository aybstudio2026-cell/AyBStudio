import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
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

  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) alert(error.message);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-studio-text-title/40 backdrop-blur-sm z-[100] cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 m-auto w-full max-w-[400px] h-fit bg-studio-surface rounded-xl shadow-flat z-[101] overflow-hidden border border-studio-border"
          >
            {/* Header del Modal */}
            <div className="p-6 pb-0 flex justify-between items-center">
              <div className="flex flex-col items-center leading-none">
                <span className="text-2xl font-black text-studio-text-title tracking-tighter uppercase">
                  A<span className="text-studio-primary">&</span>B
                </span>
                <span className="text-[9px] font-bold text-studio-text-title tracking-[0.3em] uppercase ml-1">
                  Studio
                </span>
              </div>
              
              <button onClick={onClose} className="p-2 hover:bg-studio-bg rounded-lg transition-colors text-studio-secondary">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-studio-text-title">
                  {isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
                </h2>
                <p className="text-sm text-studio-text-body font-medium">
                  {isLogin ? 'Accede a tus recursos digitales.' : 'Únete a nuestra comunidad creativa.'}
                </p>
              </div>

              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 py-3 border border-studio-border rounded-lg hover:bg-studio-bg transition-all font-bold text-sm text-studio-text-title"
              >
                <FcGoogle size={20} /> Google
              </button>

              <div className="relative flex items-center justify-center uppercase">
                <div className="absolute w-full border-t border-studio-border"></div>
                <span className="relative bg-studio-surface px-4 text-[10px] text-studio-secondary font-bold tracking-widest">o con email</span>
              </div>

              <form className="space-y-4" onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary" />
                    <input 
                      type="text" required value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nombre completo" 
                      className="w-full pl-12 pr-4 py-3 bg-studio-bg border border-transparent rounded-lg outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-medium text-sm text-studio-text-title"
                    />
                  </div>
                )}
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary" />
                  <input 
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email" 
                    className="w-full pl-12 pr-4 py-3 bg-studio-bg border border-transparent rounded-lg outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-medium text-sm text-studio-text-title"
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-secondary" />
                  <input 
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña" 
                    className="w-full pl-12 pr-4 py-3 bg-studio-bg border border-transparent rounded-lg outline-none focus:border-studio-primary focus:bg-studio-surface transition-all font-medium text-sm text-studio-text-title"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-studio-primary text-white font-bold py-3.5 rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                </button>
              </form>

              <p className="text-center text-sm font-bold text-studio-text-body">
                {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-studio-primary hover:underline"
                >
                  {isLogin ? 'Crea una aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}