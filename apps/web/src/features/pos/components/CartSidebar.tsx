import { useCartStore } from '@/stores/cart.store';
import { useUIStore } from '@/stores/ui.store';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

interface CartSidebarProps {
  onProceedToPayment: () => void;
}

export const CartSidebar = ({ onProceedToPayment }: CartSidebarProps) => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    guestCount,
    setGuestCount,
    discount,
    setDiscount,
    tableId,
  } = useCartStore();
  const { isCartOpen, toggleCart } = useUIStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% sales tax
  const total = subtotal + tax - discount;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
        <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={24} />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No items in cart</div>
        ) : (
          items.map((item) => (
            <div key={item.menuItemId} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                {item.modifiers && item.modifiers.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {item.modifiers.map((m) => m.name).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => removeItem(item.menuItemId)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Guests:</label>
          <input
            type="number"
            min={1}
            max={20}
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Discount ($):</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onProceedToPayment}
            disabled={items.length === 0 || !tableId}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
        {!tableId && (
          <p className="text-xs text-red-500 text-center">Please select a table first</p>
        )}
      </div>
    </div>
  );
};