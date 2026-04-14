import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
// 1. Importamos el cliente de Supabase
import { supabase } from '../../supabaseClient';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // 2. Estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Función principal de Autenticación (Email/Password)
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else onClose(); // Cerramos si entra con éxito
    } else {
      // REGISTRO
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: username, // Esto lo recibirá nuestro Trigger de Supabase
          }
        }
      });
      if (error) alert(error.message);
      else alert('¡Revisa tu email para confirmar tu cuenta!');
    }
    setLoading(false);
  };

  // 4. Función para Social Logins
  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
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
            className="fixed inset-0 bg-panda-black/40 backdrop-blur-sm z-[100] cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-[420px] h-fit bg-white rounded-kawaii shadow-2xl z-[101] overflow-hidden border border-gray-100"
          >
            <div className="p-6 pb-0 flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-panda-black rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                  A&B
                </div>
                <span className="font-black text-panda-black tracking-tighter uppercase text-sm">Studio</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-soft-snow rounded-full transition-colors text-gray-400">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-panda-black">
                  {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
                </h2>
                <p className="text-sm text-gray-400 font-medium">
                  {isLogin ? 'Accede a tus descargas y licencias.' : 'Únete para guardar tus stickers y mascotas.'}
                </p>
              </div>

              {/* Botones de Social Login conectados */}
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-panda-black"
                >
                  <FcGoogle size={18} /> Google
                </button>
              </div>

              <div className="relative flex items-center justify-center uppercase">
                <div className="absolute w-full border-t border-gray-100"></div>
                <span className="relative bg-white px-4 text-[10px] text-gray-300 font-bold tracking-widest">o con email</span>
              </div>

              {/* Formulario conectado */}
              <form className="space-y-4" onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nombre de usuario" 
                      className="w-full pl-12 pr-4 py-4 bg-soft-snow rounded-2xl outline-none focus:ring-2 ring-digital-lavender/20 transition-all font-medium text-sm"
                    />
                  </div>
                )}
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email" 
                    className="w-full pl-12 pr-4 py-4 bg-soft-snow rounded-2xl outline-none focus:ring-2 ring-digital-lavender/20 transition-all font-medium text-sm"
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña" 
                    className="w-full pl-12 pr-4 py-4 bg-soft-snow rounded-2xl outline-none focus:ring-2 ring-digital-lavender/20 transition-all font-medium text-sm"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-digital-lavender text-white font-bold py-4 rounded-2xl shadow-lg shadow-digital-lavender/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                </button>
              </form>

              <p className="text-center text-sm font-bold text-gray-400">
                {isLogin ? '¿No tienes cuenta? ' : '¿Ya eres miembro? '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-digital-lavender hover:underline"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}