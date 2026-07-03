import { useState } from 'react';
import { useCreateOrder } from '@/hooks/queries/useOrders';
import { useCartStore } from '@/stores/cart.store';
import { useUIStore } from '@/stores/ui.store';
import { X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, guestCount, discount, tableId, notes, clearCart } = useCartStore();
  const { mutate: createOrder } = useCreateOrder();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax - discount;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const orderItems = items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      selectedModifiers: item.modifiers?.map((m) => ({
        groupId: m.groupId || '',
        optionId: m.optionId || '',
      })),
    }));

    createOrder(
      {
        tableId: tableId!,
        guestCount,
        discount,
        notes: notes || '',
        items: orderItems,
      },
      {
        onSuccess: () => {
          setIsProcessing(false);
          clearCart();
          onClose();
          alert('✅ Order sent to kitchen!');
        },
        onError: (error) => {
          setIsProcessing(false);
          alert('❌ Failed to place order: ' + error.message);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Confirm Order</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Guests: {guestCount} | {guestCount > 1 && `($${(total / guestCount).toFixed(2)} per person)`}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {isProcessing ? 'Placing Order...' : 'Place Order'}
          </button>

          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};