import { Menu, ShoppingCart } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useCartStore } from '@/stores/cart.store';

export const Header = () => {
  const { toggleSidebar, toggleCart } = useUIStore();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg"><Menu size={24} /></button>
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>
      <button onClick={toggleCart} className="relative p-2 hover:bg-gray-100 rounded-lg">
        <ShoppingCart size={24} />
        {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>}
      </button>
    </header>
  );
};
