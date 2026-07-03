import { useState } from 'react';
import { MenuGrid } from '../components/MenuGrid';
import { CartSidebar } from '../components/CartSidebar';
import { PaymentModal } from '../components/PaymentModal';
import { TableSelector } from '../components/TableSelector';
import { useUIStore } from '@/stores/ui.store';
import { useCartStore } from '@/stores/cart.store';
import { MenuItem, ModifierOption } from '@/api/endpoints/menu.api';
import { ShoppingCart } from 'lucide-react';

export const POSPage = () => {
  const [showPayment, setShowPayment] = useState(false);
  const { toggleCart } = useUIStore();
  const { addItem, items } = useCartStore();

  const handleAddItem = (item: MenuItem, modifiers: ModifierOption[]) => {
    const totalPrice = item.price + modifiers.reduce((sum, m) => sum + m.priceAdjustment, 0);
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: totalPrice,
      quantity: 1,
      modifiers: modifiers.map((m) => ({
        groupId: '', // We'll populate this later if needed
        optionId: m.id,
        name: m.name,
        priceAdjustment: m.priceAdjustment,
      })),
    });
    // Open cart automatically after adding an item
    if (!useUIStore.getState().isCartOpen) {
      toggleCart();
    }
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Point of Sale</h1>
          <p className="text-gray-600 text-sm">Select items and place orders</p>
        </div>
        <div className="flex items-center gap-4">
          <TableSelector />
          <button
            onClick={toggleCart}
            className="relative p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <MenuGrid onAddItem={handleAddItem} />
      <CartSidebar onProceedToPayment={handleProceedToPayment} />
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  );
};