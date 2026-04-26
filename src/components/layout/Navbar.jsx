import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiX, FiLogOut, FiSettings, FiDownload, FiHeart } from 'react-icons/fi';
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
  const [searchResults, setSearchResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Lógica de Autenticación y Perfil
  useEffect(() => {
    const getProfile = async (userId) => {
      const { data } = await supabase.from('profiles').select('avatar_url, username').eq('id', userId).single();
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

  // FUNCIÓN DE BÚSQUEDA
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 1) {
      const { data, error } = await supabase.from('products').select('id, name, price, image_url').ilike('name', `%${value}%`).limit(5);
      if (!error) setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  // FUNCIÓN DE CERRAR SESIÓN
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  // FUNCIÓN PARA CERRAR MENÚ AL HACER CLIC FUERA
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
      <nav className="fixed top-0 w-full z-50 bg-studio-surface border-b border-studio-border h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex flex-col items-center leading-none">
              <span className="text-4xl font-black text-studio-text-title tracking-tighter uppercase">
                A<span className="text-studio-primary">&</span>B
              </span>
              <span className="text-xs font-bold text-studio-text-title tracking-[0.4em] uppercase ml-1">Studio</span>
            </div>
          </Link>

          {/* --- BUSCADOR CON DROP-DOWN --- */}
          <div className="flex-1 flex justify-center px-10 relative">
            <AnimatePresence>
              {isSearchOpen && (
                <div className="w-full max-w-lg relative">
                  {/* Contenedor del Input (Estilo Flat) */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center bg-studio-surface border border-studio-border rounded-xl px-5 py-2.5 shadow-flat"
                  >
                    <FiSearch className="text-studio-primary mr-3 shrink-0" />
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Buscar apps, packs..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full bg-transparent outline-none font-bold text-studio-text-title placeholder:text-studio-secondary/40 text-sm"
                    />
                    <button 
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                      className="p-1 hover:bg-studio-bg rounded-lg transition-colors text-studio-secondary"
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
                        className="absolute top-full left-0 w-full mt-2 bg-studio-surface rounded-xl shadow-flat border border-studio-border overflow-hidden py-2 z-50"
                      >
                        {searchResults.map(result => (
                          <Link
                            key={result.id}
                            to={`/producto/${result.id}`}
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-studio-primary/10 transition-colors duration-300 group"
                          >
                            <img 
                              src={result.image_url} 
                              className="w-10 h-10 rounded-lg object-cover border border-studio-border" 
                              alt={result.name} 
                            />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-studio-text-title group-hover:text-studio-primary transition-colors duration-300">
                                {result.name}
                              </p>
                              <p className="text-[10px] font-black text-studio-primary uppercase">
                                ${result.price}
                              </p>
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
  
  {/* BUSCADOR (Solo si no está abierto) */}
  {!isSearchOpen && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => setIsSearchOpen(true)}
      className="p-2.5 hover:bg-studio-bg rounded-xl transition-colors cursor-pointer text-studio-text-title"
    >
      <FiSearch size={22} />
    </motion.div>
  )}

  {/* CARRITO */}
  <div 
    onClick={() => setIsCartOpen(true)} 
    className="relative p-2.5 hover:bg-studio-bg rounded-xl cursor-pointer text-studio-text-title"
  >
    <FiShoppingCart size={22} />
    {cartCount > 0 && (
      <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-studio-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold px-1">
        {cartCount}
      </span>
    )}
  </div>

  {/* BOTÓN USUARIO (LOGGED OUT) */}
  {!user ? (
    <button 
      onClick={() => setIsAuthOpen(true)} 
      className="w-10 h-10 rounded-xl bg-studio-bg border border-studio-border text-studio-text-title flex items-center justify-center hover:bg-studio-primary/10 hover:text-studio-primary hover:border-studio-primary/30 transition-all"
    >
      <FiUser size={20} />
    </button>
  ) : (
    /* BOTÓN USUARIO (LOGGED IN) */
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)} 
        className="w-10 h-10 rounded-xl bg-studio-surface border-2 border-studio-border hover:border-studio-primary transition-all flex items-center justify-center overflow-hidden"
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
        ) : (
          <div className="w-full h-full bg-studio-primary text-white flex items-center justify-center font-bold text-sm">
            {user.email[0].toUpperCase()}
          </div>
        )}
      </button>

      {/* MENÚ DESPLEGABLE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }} 
            className="absolute right-0 mt-3 w-52 bg-studio-surface rounded-xl shadow-flat border border-studio-border py-2 z-50"
          >
            {/* Links del Menú */}
            {[
              { to: "/cuenta", icon: <FiSettings />, label: "Mi Cuenta" },
              { to: "/pedidos", icon: <FiShoppingCart />, label: "Pedidos" },
              { to: "/favoritos", icon: <FiHeart />, label: "Favoritos" },
              { to: "/inventario", icon: <FiDownload />, label: "Inventario" },
            ].map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-studio-text-body hover:bg-studio-primary/10 hover:text-studio-primary transition-all"
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Botón Cerrar Sesión */}
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 border-t border-studio-border transition-colors mt-1"
            >
              <FiLogOut className="text-lg" /> Cerrar Sesión
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