import { useState, useEffect, useRef} from 'react';
import { FiSearch, FiShoppingBag, FiUser, FiX, FiLogOut, FiSettings} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from "../../supabaseClient";
import AuthModal from '../auth/AuthModal';
import CartSidebar from '../cart/CartSidebar';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { cartCount } = useCart();

  // 1. Escuchar cambios en la sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const executeSearch = (e) => {
    if (e.key === 'Enter') {
      console.log("Realizando búsqueda en la base de datos para:", searchQuery);
      // Aquí conectarás con Supabase más adelante
      setIsSearchOpen(false); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic NO fue dentro del menú...
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
  // Función para obtener los datos del perfil desde la tabla
  const getProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, username')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  // Revisar sesión inicial
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    if (session?.user) getProfile(session.user.id);
  });

  // Escuchar cambios (login/logout)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    if (session?.user) getProfile(session.user.id);
    else setProfile(null);
  });

  return () => subscription.unsubscribe();
}, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-soft-snow/70 backdrop-blur-md border-b border-gray-200 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* --- IZQUIERDA: LOGO (Fijo) --- */}
          <div className="flex items-center gap-3 group cursor-pointer shrink-0">
            <div className="relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-panda-black rounded-full group-hover:-rotate-12 transition-transform"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-panda-black rounded-full group-hover:rotate-12 transition-transform"></div>
              <div className="relative w-11 h-11 bg-panda-black rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                <span className="text-white font-black text-xs tracking-tighter">A&B</span>
              </div>
            </div> 
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-panda-black text-xl tracking-tighter uppercase">Studio</span>
              <span className="text-[10px] font-bold text-digital-lavender tracking-[0.2em] uppercase">Digital Products</span>
            </div>
          </div>

          {/* --- CENTRO: BARRA DE BÚSQUEDA --- */}
          <div className="flex-1 flex justify-center px-10">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="w-full max-w-lg flex items-center bg-white border border-gray-100 rounded-full px-5 py-2.5 shadow-sm"
                >
                  <FiSearch className="text-digital-lavender mr-3 shrink-0" />
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Search apps, software..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyDown={executeSearch}
                    className="w-full bg-transparent outline-none font-medium text-panda-black placeholder:text-gray-300 text-sm"
                  />
                  <button 
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    className="p-1 hover:bg-soft-snow rounded-full transition-colors text-gray-400"
                  >
                    <FiX size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- DERECHA: ICONOS --- */}
          <div className="flex gap-4 items-center shrink-0">
            {!isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-panda-black"
              >
                <FiSearch size={22} />
              </motion.div>
            )}

          <div onClick={() => setIsCartOpen(true)} className="relative p-2.5 ...">
            <FiShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-digital-lavender text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </div>

          {/* BOTÓN DE USUARIO DINÁMICO */}
            {!user ? (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="w-10 h-10 rounded-full bg-sakura-pink border-2 border-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FiUser size={20} className="text-panda-black" />
              </button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-full bg-digital-lavender border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs uppercase group-hover:scale-105 transition-transform overflow-hidden">
                    {/* LÓGICA DE IMAGEN MEJORADA */}
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      user.email[0] // Si no hay foto, muestra la inicial
                    )}
                  </div>
                </button>

                {/* Dropdown del Menú */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                    >
                      <Link 
                        to="/cuenta"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-panda-black/60 hover:bg-soft-snow hover:text-digital-lavender transition-all"
                      >
                        <FiSettings size={16} /> Cuenta
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-50 transition-all border-t border-gray-50"
                      >
                        <FiLogOut size={16} /> Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}