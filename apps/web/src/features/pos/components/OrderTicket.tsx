import {
  Clock,
  CheckCircle,
  ChefHat,
} from 'lucide-react';

import { useUpdateOrderStatus } from '@/hooks/queries/useKitchenOrders';

interface OrderTicketProps {
  order: {
    id: string;
    orderNumber: number;
    table: {
      tableNumber: number;
    };
    status: string;
    createdAt: string;
    items: {
      id: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      menuItem: {
        name: string;
        course: string;
      };
      modifierData: any;
    }[];
  };
}

export const OrderTicket = ({
  order,
}: OrderTicketProps) => {
  const {
    mutate: updateStatus,
    isPending,
  } = useUpdateOrderStatus();

  const handleStatusUpdate = (
    newStatus: string
  ) => {
    if (
      confirm(
        `Mark order #${order.orderNumber} as "${newStatus}"?`
      )
    ) {
      updateStatus({
        orderId: order.id,
        status: newStatus,
      });
    }
  };

  const getStatusStyles = (
    status: string
  ) => {
    switch (status) {
      case 'PENDING':
        return {
          card:
            'border-yellow-500/30 bg-yellow-500/10 shadow-yellow-500/10',
          badge:
            'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        };

      case 'PREPARING':
        return {
          card:
            'border-cyan-500/30 bg-cyan-500/10 shadow-cyan-500/10',
          badge:
            'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };

      case 'READY':
        return {
          card:
            'border-emerald-500/30 bg-emerald-500/10 shadow-emerald-500/10',
          badge:
            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        };

      case 'COMPLETED':
        return {
          card:
            'border-slate-500/30 bg-slate-500/10 shadow-slate-500/10',
          badge:
            'bg-slate-500/20 text-slate-300 border-slate-500/30',
        };

      default:
        return {
          card:
            'border-white/10 bg-slate-900/80',
          badge:
            'bg-slate-500/20 text-slate-300 border-slate-500/30',
        };
    }
  };

  const getStatusIcon = (
    status: string
  ) => {
    switch (status) {
      case 'PENDING':
        return (
          <Clock className="w-4 h-4" />
        );

      case 'PREPARING':
        return (
          <ChefHat className="w-4 h-4" />
        );

      case 'READY':
        return (
          <CheckCircle className="w-4 h-4" />
        );

      case 'COMPLETED':
        return (
          <CheckCircle className="w-4 h-4" />
        );

      default:
        return null;
    }
  };

  const statusStyle =
    getStatusStyles(order.status);

  return (
    <div
      className={`
        backdrop-blur-xl
        border
        rounded-3xl
        p-5
        shadow-xl
        transition-all
        hover:scale-[1.02]
        hover:shadow-2xl
        ${statusStyle.card}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">
              Order #
              {order.orderNumber}
            </h2>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/10">
              Table{' '}
              {
                order.table
                  .tableNumber
              }
            </span>
          </div>

          <div
            className={`
              mt-3
              inline-flex
              items-center
              gap-2
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              border
              ${statusStyle.badge}
            `}
          >
            {getStatusIcon(
              order.status
            )}

            {order.status}
          </div>
        </div>

        <div className="text-sm text-slate-400">
          {new Date(
            order.createdAt
          ).toLocaleTimeString()}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-5">
        {order.items.map(
          (item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-3"
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">
                      {
                        item.quantity
                      }
                      x
                    </span>

                    <span className="text-white font-medium">
                      {
                        item
                          .menuItem
                          .name
                      }
                    </span>
                  </div>

                  {item.modifierData &&
                    item
                      .modifierData
                      .length >
                      0 && (
                      <div className="mt-2 text-xs text-slate-400">
                        {item.modifierData
                          .map(
                            (
                              m: any
                            ) =>
                              m.optionName
                          )
                          .join(
                            ', '
                          )}
                      </div>
                    )}
                </div>

                <div className="text-cyan-400 font-semibold">
                  $
                  {item.totalPrice.toFixed(
                    2
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-white/10">
        {order.status ===
          'PENDING' && (
          <button
            onClick={() =>
              handleStatusUpdate(
                'PREPARING'
              )
            }
            disabled={isPending}
            className="
              w-full
              py-3
              rounded-xl
              bg-cyan-500
              text-slate-950
              font-bold
              hover:bg-cyan-400
              transition-all
              disabled:opacity-50
            "
          >
            Start Preparing
          </button>
        )}

        {order.status ===
          'PREPARING' && (
          <button
            onClick={() =>
              handleStatusUpdate(
                'READY'
              )
            }
            disabled={isPending}
            className="
              w-full
              py-3
              rounded-xl
              bg-emerald-500
              text-slate-950
              font-bold
              hover:bg-emerald-400
              transition-all
              disabled:opacity-50
            "
          >
            Mark Ready
          </button>
        )}

        {order.status ===
          'READY' && (
          <button
            onClick={() =>
              handleStatusUpdate(
                'COMPLETED'
              )
            }
            disabled={isPending}
            className="
              w-full
              py-3
              rounded-xl
              bg-purple-500
              text-white
              font-bold
              hover:bg-purple-400
              transition-all
              disabled:opacity-50
            "
          >
            Serve & Complete
          </button>
        )}

        {order.status ===
          'COMPLETED' && (
          <div className="text-center py-2 text-emerald-400 font-semibold">
            ✅ Completed
          </div>
        )}
      </div>
    </div>
  );
};