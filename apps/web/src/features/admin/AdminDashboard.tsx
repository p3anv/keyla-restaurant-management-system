import { useState } from 'react';
import { MenuManagement } from '../components/MenuManagement';
import { InventoryList } from '../components/InventoryManagement/InventoryList';
import { UserList } from '../components/UserManagement/UserList';
import { Package, List, Users } from 'lucide-react';

const tabs = [
  { id: 'menu', label: 'Menu Management', icon: List },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'users', label: 'Staff Management', icon: Users },
];

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon size={16} />
                {tab.label}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'inventory' && <InventoryList />}
        {activeTab === 'users' && <UserList />}
      </div>
    </div>
  );
};