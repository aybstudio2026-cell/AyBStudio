import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiShoppingBag, FiUser, FiX, FiLogOut, FiSettings, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../../supabaseClient";
import AuthModal from '../auth/AuthModal';
import CartSidebar from '../cart/CartSidebar';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Estado para los resultados
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // 1. Lógica de Autenticación y Perfil
  useEffect(() => {
    const getProfile = async (userId) => {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', userId)
        .single();
      setProfile(data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) getProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) getProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. FUNCIÓN DE BÚSQUEDA (Sin modificar la URL de la página)
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 1) {
      // Buscamos en Supabase productos que coincidan
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .ilike('name', `%${value}%`)
        .limit(5); // Solo mostramos los 5 mejores resultados

      if (!error) setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-soft-snow/70 backdrop-blur-md border-b border-gray-200 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-panda-black rounded-full group-hover:-rotate-12 transition-transform"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-panda-black rounded-full group-hover:rotate-12 transition-transform"></div>
              <div className="relative w-11 h-11 bg-panda-black rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                <span className="text-white font-black text-xs tracking-tighter italic">A&B</span>
              </div>
            </div> 
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-panda-black text-xl tracking-tighter uppercase">Studio</span>
              <span className="text-[10px] font-bold text-digital-lavender tracking-[0.2em] uppercase">Digital Products</span>
            </div>
          </Link>

          {/* --- BUSCADOR CON DROP-DOWN --- */}
          <div className="flex-1 flex justify-center px-10 relative">
            <AnimatePresence>
              {isSearchOpen && (
                <div className="w-full max-w-lg relative">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center bg-white border border-gray-100 rounded-full px-5 py-2.5 shadow-sm"
                  >
                    <FiSearch className="text-digital-lavender mr-3 shrink-0" />
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Buscar apps, packs..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full bg-transparent outline-none font-medium text-panda-black placeholder:text-gray-300 text-sm"
                    />
                    <button 
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                      className="p-1 hover:bg-soft-snow rounded-full transition-colors text-gray-400"
                    >
                      <FiX size={18} />
                    </button>
                  </motion.div>

                  {/* RESULTADOS DESPLEGABLES */}
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden py-2 z-50"
                      >
                        {searchResults.map(result => (
                          <Link
                            key={result.id}
                            to={`/producto/${result.id}`}
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-soft-snow transition-all group"
                          >
                            <img src={result.image_url} className="w-10 h-10 rounded-xl object-cover" alt="" />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-panda-black group-hover:text-digital-lavender">{result.name}</p>
                              <p className="text-[10px] font-black text-digital-lavender uppercase">${result.price}</p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* --- ICONOS DERECHA --- */}
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

            <div onClick={() => setIsCartOpen(true)} className="relative p-2.5 hover:bg-gray-100 rounded-full cursor-pointer">
              <FiShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-digital-lavender text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </div>

            {/* BOTÓN USUARIO */}
            {!user ? (
              <button onClick={() => setIsAuthOpen(true)} className="w-10 h-10 rounded-full bg-sakura-pink border-2 border-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
                <FiUser size={20} className="text-panda-black" />
              </button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 rounded-full bg-digital-lavender border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-xs">{user.email[0].toUpperCase()}</span>
                  )}
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2">
                      <Link to="/cuenta" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-panda-black/60 hover:bg-soft-snow hover:text-digital-lavender transition-all">
                        <FiSettings /> Mi Cuenta
                      </Link>
                      <Link to="/pedidos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-panda-black/60 hover:bg-soft-snow hover:text-digital-lavender transition-all">
                        <FiShoppingBag /> Mis Pedidos
                      </Link>
                      <Link 
                        to="/descargas"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-panda-black/60 hover:bg-soft-snow hover:text-digital-lavender transition-all"
                      >
                        <FiDownload size={16} /> Mis Descargas
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-50 border-t border-gray-50">
                        <FiLogOut /> Cerrar Sesión
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