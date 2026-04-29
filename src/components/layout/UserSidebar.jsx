import { NavLink } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiHeart, FiDownload } from 'react-icons/fi';
import { Wallet } from 'lucide-react';

export default function UserSidebar() {
  const sidebarLinks = [
    { to: "/cuenta", label: "Mi Cuenta", icon: FiUser },
    { to: "/pedidos", label: "Pedidos", icon: FiShoppingBag },
    { to: "/favoritos", label: "Favoritos", icon: FiHeart },
    { to: "/inventario", label: "Inventario", icon: FiDownload },
    { to: "/billetera", label: "Billetera", icon: Wallet },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      {/* Hemos eliminado 'fixed' y 'sticky'. 
          Ahora es una tarjeta que sube y baja con el scroll normal.
      */}
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
  );
}