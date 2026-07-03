import { useState } from 'react';
import { X, Users, Receipt } from 'lucide-react';

import { useCreateOrder } from '@/hooks/queries/useOrders';
import { useCartStore } from '@/stores/cart.store';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal = ({
  isOpen,
  onClose,
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] =
    useState(false);

  const {
    items,
    guestCount,
    discount,
    tableId,
    notes,
    clearCart,
  } = useCartStore();

  const {
    mutate: createOrder,
  } = useCreateOrder();

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const total =
    subtotal + tax - discount;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const orderItems =
      items.map((item) => ({
        menuItemId:
          item.menuItemId,
        quantity:
          item.quantity,
        selectedModifiers:
          item.modifiers?.map(
            (m) => ({
              groupId:
                m.groupId || '',
              optionId:
                m.optionId || '',
            })
          ),
      }));

    createOrder(
      {
        tableId:
          tableId!,
        guestCount,
        discount,
        notes:
          notes || '',
        items:
          orderItems,
      },
      {
        onSuccess: () => {
          setIsProcessing(
            false
          );

          clearCart();

          onClose();

          alert(
            '✅ Order sent to kitchen!'
          );
        },

        onError: (
          error
        ) => {
          setIsProcessing(
            false
          );

          alert(
            '❌ Failed to place order: ' +
              error.message
          );
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-lg bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Confirm Order
            </h3>

            <p className="text-slate-400 text-sm mt-1">
              Review before sending to kitchen
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Summary Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">

            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Tax (10%)</span>
              <span className="text-white">
                ${tax.toFixed(2)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>
                  -${discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-white">
                Total
              </span>

              <span className="text-4xl font-bold text-cyan-400">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Guests */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <Users
              size={20}
              className="text-cyan-400"
            />

            <div className="flex-1">
              <p className="text-white font-medium">
                Guests
              </p>

              <p className="text-slate-400 text-sm">
                {guestCount} guest
                {guestCount > 1
                  ? 's'
                  : ''}
              </p>
            </div>

            {guestCount > 1 && (
              <div className="text-right">
                <p className="text-slate-400 text-sm">
                  Per Person
                </p>

                <p className="text-cyan-400 font-semibold">
                  $
                  {(
                    total /
                    guestCount
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Item Count */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <Receipt
              size={20}
              className="text-cyan-400"
            />

            <div>
              <p className="text-white font-medium">
                Order Summary
              </p>

              <p className="text-slate-400 text-sm">
                {items.length}{' '}
                unique item
                {items.length !== 1
                  ? 's'
                  : ''}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="
                flex-1
                py-3
                rounded-2xl
                border
                border-white/10
                bg-white/5
                text-slate-300
                hover:bg-white/10
                transition-all
              "
            >
              Cancel
            </button>

            <button
              onClick={
                handlePlaceOrder
              }
              disabled={
                isProcessing
              }
              className="
                flex-1
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-500
                text-slate-950
                font-bold
                hover:scale-[1.02]
                transition-all
                shadow-lg
                shadow-cyan-500/20
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {isProcessing
                ? 'Placing Order...'
                : 'Send To Kitchen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};