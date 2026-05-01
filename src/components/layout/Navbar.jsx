import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiX, FiLogOut, FiSettings, FiDownload, FiHeart, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';
import CartSidebar from '../cart/CartSidebar';
import { useCart } from '../../context/CartContext';
import { useNavbarLogic } from '../../hooks/useNavbarLogic';

const NAV_LINKS = [
  { to: '/',     label: 'Home'  },
  { to: '/tienda', label: 'Store' },
  { to: '/tools',  label: 'Tools' },
];

export default function Navbar() {
  const {
    user, profile, isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery, searchResults, setSearchResults,
    isMenuOpen, setIsMenuOpen, handleSearch, handleLogout
  } = useNavbarLogic();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const menuRef = useRef(null);
  const { cartCount } = useCart();
  const location = useLocation();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-studio-surface border-b border-studio-border h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-2 md:px-6 h-full flex items-center justify-between gap-1 md:gap-4">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex flex-col items-start leading-none shrink-0 pl-1 md:pl-0">
            <span className="text-lg md:text-4xl font-black text-studio-text-title tracking-tighter uppercase">
              A<span className="text-studio-primary">&</span>B
            </span>
            <span className="text-[7px] md:text-xs font-bold text-studio-text-title tracking-[0.3em] md:tracking-[0.4em] uppercase">Studio</span>
          </Link>

          {/* --- CENTRO: NAV LINKS o BUSCADOR --- */}
          <div className="flex-1 flex justify-center relative min-w-0 px-1">
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div 
                  key="search-input"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full max-w-lg relative"
                >
                  <div className="flex items-center bg-studio-bg border border-studio-border rounded-xl px-2 md:px-5 py-1.5 md:py-2.5">
                    <FiSearch className="text-studio-primary mr-2 shrink-0" size={16} />
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full bg-transparent outline-none font-bold text-studio-text-title placeholder:text-studio-secondary/40 text-[10px] md:text-sm"
                    />
                    <button 
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                      className="p-1 hover:bg-white rounded-lg transition-colors text-studio-secondary"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                  <SearchResults results={searchResults} onClose={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }} />
                </motion.div>
              ) : (
                <motion.div
                  key="nav-links"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-0.5 md:gap-1"
                >
                  {NAV_LINKS.map(({ to, label }) => {
                    const isActive = location.pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`px-2.5 md:px-5 py-1.5 md:py-2 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all duration-200
                          ${isActive
                            ? 'bg-studio-primary text-white shadow-sm'
                            : 'text-studio-secondary/60 hover:text-studio-text-title hover:bg-studio-bg'
                          }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- ICONOS DERECHA --- */}
          <div className="flex gap-1 md:gap-4 items-center shrink-0 pr-1 md:pr-0">
            {!isSearchOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 md:p-2.5 hover:bg-studio-bg rounded-xl transition-colors text-studio-text-title"
              >
                <FiSearch size={18} md:size={22} />
              </button>
            )}
            
            <div 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-1.5 md:p-2.5 hover:bg-studio-bg rounded-xl cursor-pointer text-studio-text-title"
            >
              <FiShoppingCart size={18} md:size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] md:min-w-[18px] md:h-[18px] bg-studio-primary text-white text-[7px] md:text-[10px] flex items-center justify-center rounded-full font-bold px-1">
                  {cartCount}
                </span>
              )}
            </div>

            {!user ? (
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-studio-bg border border-studio-border text-studio-text-title flex items-center justify-center hover:bg-studio-primary/10 transition-all"
              >
                <FiUser size={18} />
              </button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl border-2 border-studio-border hover:border-studio-primary transition-all flex items-center justify-center overflow-hidden bg-studio-surface"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="w-full h-full bg-studio-primary text-white flex items-center justify-center font-bold text-[10px] md:text-sm">
                      {user.email[0].toUpperCase()}
                    </div>
                  )}
                </button>
                <UserDropdown isOpen={isMenuOpen} profile={profile} onLogout={handleLogout} onClose={() => setIsMenuOpen(false)} />
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

// --- SUB-COMPONENTES ---

function SearchResults({ results, onClose }) {
  if (results.length === 0) return null;
  return (
    <div className="absolute top-full left-0 w-[280px] md:w-full mt-2 bg-studio-surface rounded-xl shadow-2xl border border-studio-border overflow-hidden py-2 z-50">
      {results.map(result => (
        <Link
          key={result.id}
          to={`/producto/${result.id}`}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-studio-primary/10 transition-colors group"
        >
          <img src={result.image_url} className="w-8 h-8 rounded-lg object-cover border border-studio-border" alt={result.name} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-studio-text-title truncate group-hover:text-studio-primary transition-colors">
              {result.name}
            </p>
            <p className="text-[8px] font-black text-studio-primary uppercase tracking-tighter">
              ${result.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function UserDropdown({ isOpen, profile, onLogout, onClose }) {
  if (!isOpen) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 10 }} 
      className="absolute right-0 mt-3 w-48 md:w-52 bg-studio-surface rounded-xl shadow-2xl border border-studio-border py-2 z-50"
    >
      <div className="px-4 py-3 mb-2 border-b border-studio-border bg-studio-bg/30">
        <p className="text-[7px] font-black text-studio-secondary uppercase tracking-[0.2em]">Balance</p>
        <div className="flex items-center gap-1.5 mt-1">
          <FiZap className="text-studio-primary" size={12} />
          <span className="text-xs font-black text-studio-text-title tracking-tighter">
            {profile?.balance || 0} <span className="text-studio-primary uppercase text-[8px] not-italic">Coins</span>
          </span>
        </div>
      </div>
      {[
        { to: "/cuenta",     icon: <FiSettings />,  label: "Mi Cuenta"  },
        { to: "/pedidos",    icon: <FiShoppingCart />, label: "Pedidos"    },
        { to: "/favoritos",  icon: <FiHeart />,        label: "Favoritos"  },
        { to: "/inventario", icon: <FiDownload />,     label: "Inventario" },
      ].map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          onClick={onClose} 
          className="flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold text-studio-text-body hover:bg-studio-primary/10 hover:text-studio-primary transition-all"
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}
      <button 
        onClick={onLogout} 
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 border-t border-studio-border transition-colors mt-1"
      >
        <FiLogOut className="text-base" /> Cerrar Sesión
      </button>
    </motion.div>
  );
}