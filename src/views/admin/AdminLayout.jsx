// src/views/admin/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
  FiGrid, FiPackage, FiUsers, FiShoppingBag,
  FiRadio, FiLogOut, FiMenu, FiX, FiChevronRight, FiStar, FiShield, FiTag
} from 'react-icons/fi';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { path: '/admin/usuarios', label: 'Usuarios', icon: FiUsers },
  { path: '/admin/productos', label: 'Productos', icon: FiPackage },
  { path: '/admin/categorias', label: 'Categorías', icon: FiTag },
  { path: '/admin/noticias', label: 'Noticias', icon: FiRadio },
  { path: '/admin/ordenes', label: 'Órdenes', icon: FiShoppingBag },
  { path: '/admin/reseñas', label: 'Reseñas', icon: FiStar },
  { path: '/admin/soporte', label: 'Soporte', icon: FiShield },
];

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, username, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') { navigate('/'); return; }

      setUser({ ...session.user, ...profile });
      setLoading(false);
    }
    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-studio-bg">
      <div className="w-8 h-8 border-2 border-studio-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-studio-bg text-studio-text-title overflow-hidden">

      {/* SIDEBAR GÉLIDO */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} transition-all duration-500 bg-white border-r border-studio-border flex flex-col shrink-0 shadow-sm z-50`}>

        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-studio-primary rounded-2xl flex items-center justify-center font-black text-[10px] text-white shadow-lg shadow-studio-primary/20">
                A&B
              </div>
              <div className="leading-none">
                <p className="font-black text-xs tracking-tighter uppercase italic">Control <span className="text-studio-primary">Panel</span></p>
                <p className="text-[9px] text-studio-secondary font-black uppercase tracking-[0.3em] opacity-40">Studio v2.0</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-studio-bg rounded-xl transition-all text-studio-secondary/40 hover:text-studio-primary"
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={20} className="mx-auto" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                  active
                    ? 'bg-studio-text-title text-white shadow-xl shadow-studio-text-title/10'
                    : 'text-studio-secondary hover:bg-studio-bg hover:text-studio-primary'
                }`}
              >
                <item.icon size={18} className={`shrink-0 ${active ? 'text-studio-primary' : 'group-hover:scale-110 transition-transform'}`} />
                {sidebarOpen && (
                  <>
                    <span className={`flex-1 text-[11px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>
                      {item.label}
                    </span>
                    {active && <FiChevronRight size={14} className="text-studio-primary" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Section */}
        <div className="p-6 border-t border-studio-border bg-gray-50/50">
          <div className={`flex items-center gap-4 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-2xl bg-studio-bg border border-studio-border flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-inner">
              {user?.avatar_url
                ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                : <span className="text-studio-primary">{user?.email?.[0].toUpperCase()}</span>
              }
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-tight truncate">{user?.username || 'Administrator'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <FiShield size={10} className="text-studio-primary" />
                  <p className="text-[9px] font-bold text-studio-secondary/50 uppercase tracking-widest truncate">Sistema Core</p>
                </div>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-studio-secondary/20"
                title="Cerrar Sesión"
              >
                <FiLogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-studio-primary/5 blur-[120px] -mr-48 -mt-48 pointer-events-none" />
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}