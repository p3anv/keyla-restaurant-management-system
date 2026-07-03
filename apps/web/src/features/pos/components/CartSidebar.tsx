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

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax - discount;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-[420px] bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Current Order
            </h2>

            <p className="text-sm text-slate-400">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={toggleCart}
            className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 py-16">
              No items in cart
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.menuItemId}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {item.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      ${item.price.toFixed(2)} each
                    </p>

                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        {item.modifiers
                          .map((m) => m.name)
                          .join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-cyan-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.menuItemId,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 transition-all text-cyan-400"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-8 text-center text-white font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.menuItemId,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 transition-all text-cyan-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(item.menuItemId)
                    }
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-5 space-y-4">
          {/* Guests */}
          <div className="flex items-center justify-between">
            <label className="text-slate-300 text-sm">
              Guests
            </label>

            <input
              type="number"
              min={1}
              max={20}
              value={guestCount}
              onChange={(e) =>
                setGuestCount(
                  parseInt(e.target.value) || 1
                )
              }
              className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Discount */}
          <div className="flex items-center justify-between">
            <label className="text-slate-300 text-sm">
              Discount
            </label>

            <input
              type="number"
              min={0}
              step={0.5}
              value={discount}
              onChange={(e) =>
                setDiscount(
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-2xl font-bold text-white pt-3 border-t border-white/10">
              <span>Total</span>
              <span className="text-cyan-400">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={clearCart}
              className="flex-1 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              Clear
            </button>

            <button
              onClick={onProceedToPayment}
              disabled={items.length === 0 || !tableId}
              className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>

          {!tableId && (
            <p className="text-center text-red-400 text-sm">
              Please select a table first
            </p>
          )}
        </div>
      </div>
    </>
  );
};