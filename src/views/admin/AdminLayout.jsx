// src/views/admin/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
  FiGrid, FiPackage, FiUsers, FiShoppingBag,
  FiRadio, FiLogOut, FiMenu, FiX, FiChevronRight, FiStar
} from 'react-icons/fi';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { path: '/admin/usuarios', label: 'Usuarios', icon: FiUsers },
  { path: '/admin/productos', label: 'Productos', icon: FiPackage },
  { path: '/admin/noticias', label: 'Noticias', icon: FiRadio },
  { path: '/admin/ordenes', label: 'Órdenes', icon: FiShoppingBag },
  { path: '/admin/reseñas', label: 'Reseñas', icon: FiStar },
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
    <div className="h-screen flex items-center justify-center bg-[#0f1117]">
      <div className="w-10 h-10 border-4 border-digital-lavender border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#161b27] border-r border-white/5 flex flex-col shrink-0`}>

        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-digital-lavender rounded-lg flex items-center justify-center font-black text-xs">
                A&B
              </div>
              <div>
                <p className="font-black text-sm tracking-tighter">Admin Panel</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Studio</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40"
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-bold ${
                isActive(item)
                  ? 'bg-digital-lavender text-white shadow-lg shadow-digital-lavender/20'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {isActive(item) && <FiChevronRight size={14} />}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-9 h-9 rounded-xl bg-digital-lavender flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
              {user?.avatar_url
                ? <img src={user.avatar_url} className="w-full h-full object-cover" />
                : user?.email?.[0].toUpperCase()
              }
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate">{user?.username || 'Admin'}</p>
                <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-white/30"
              >
                <FiLogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}