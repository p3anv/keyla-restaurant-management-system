import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  UtensilsCrossed,
  Table2,
  LogOut
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';

const menuItems = [
  { path: '/pos', icon: Utensils, label: 'POS' },
  { path: '/kitchen', icon: UtensilsCrossed, label: 'Kitchen' },
  { path: '/tables', icon: Table2, label: 'Tables' },
  { path: '/admin', icon: LayoutDashboard, label: 'Admin' },
];

export const Sidebar = () => {
  const { sidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();

  if (!sidebarOpen) return null;

  return (
    <aside
      className="
        w-72
        bg-slate-950/80
        backdrop-blur-xl
        border-r
        border-white/10
        flex
        flex-col
        h-full
        shadow-2xl
      "
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-cyan-400 tracking-wide">
          RMS
        </h1>

        <div className="mt-5">
          <p className="text-white font-medium">
            {user?.name}
          </p>

          <p className="text-sm text-slate-400 capitalize">
            {user?.role}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-4
              px-4
              py-3
              rounded-2xl
              transition-all
              duration-200

              ${
                isActive
                  ? `
                    bg-cyan-500/15
                    border
                    border-cyan-400/20
                    text-cyan-300
                    shadow-lg
                    shadow-cyan-500/10
                  `
                  : `
                    text-slate-400
                    hover:bg-white/5
                    hover:text-white
                  `
              }
            `
            }
          >
            <item.icon size={20} />

            <span className="font-medium">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="
            flex
            items-center
            gap-4
            px-4
            py-3
            rounded-2xl
            w-full
            text-red-400
            hover:bg-red-500/10
            hover:text-red-300
            transition-all
          "
        >
          <LogOut size={20} />

          <span className="font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};