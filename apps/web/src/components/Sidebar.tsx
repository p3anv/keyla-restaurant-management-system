import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Utensils, UtensilsCrossed, Table2, LogOut } from 'lucide-react';
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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">RMS</h1>
        <p className="text-sm text-gray-500">{user?.name}</p>
        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }>
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};