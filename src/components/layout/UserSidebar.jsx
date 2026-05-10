import { NavLink } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiHeart, FiDownload, FiHelpCircle } from 'react-icons/fi';
import { Wallet } from 'lucide-react';

export default function UserSidebar() {
  const sidebarLinks = [
    { to: "/cuenta", label: "Mi Cuenta", icon: FiUser },
    { to: "/pedidos", label: "Pedidos", icon: FiShoppingBag },
    { to: "/favoritos", label: "Favoritos", icon: FiHeart },
    { to: "/inventario", label: "Inventario", icon: FiDownload },
    { to: "/billetera", label: "Billetera", icon: Wallet },
    { to: "/support", label: "Soporte", icon: FiHelpCircle },
  ];

  return (
    <>
      {/* ── DESKTOP sidebar (md+) ── */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <p className="text-[10px] font-black text-studio-secondary/60 uppercase tracking-[0.2em] mb-8 ml-2">
            Navegación
          </p>
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all
                  ${isActive
                    ? 'bg-studio-primary text-white shadow-md shadow-studio-primary/20'
                    : 'text-studio-text-body hover:bg-studio-bg hover:text-studio-primary'
                  }
                `}
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
              A&B Studio • 2026
            </p>
          </div>
        </div>
      </aside>

      {/* ── MOBILE bottom nav bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex overflow-x-auto scrollbar-none">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[72px] flex-1 transition-all
                ${isActive
                  ? 'text-studio-primary'
                  : 'text-studio-text-body/50'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-studio-primary/10' : ''}`}>
                    <link.icon size={20} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wide whitespace-nowrap">
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-studio-primary rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}