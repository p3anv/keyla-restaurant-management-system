import { Clock, CheckCircle, ChefHat } from 'lucide-react';
import { useUpdateOrderStatus } from '@/hooks/queries/useKitchenOrders';

interface OrderTicketProps {
  order: {
    id: string;
    orderNumber: number;
    table: { tableNumber: number };
    status: string;
    createdAt: string;
    items: {
      id: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      menuItem: { name: string; course: string };
      modifierData: any;
    }[];
  };
}

export const OrderTicket = ({ order }: OrderTicketProps) => {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleStatusUpdate = (newStatus: string) => {
    if (confirm(`Mark order #${order.orderNumber} as "${newStatus}"?`)) {
      updateStatus({
        orderId: order.id,
        status: newStatus,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'PREPARING':
        return 'border-cyan-500/30 bg-cyan-500/10';
      case 'READY':
        return 'border-emerald-500/30 bg-emerald-500/10';
      case 'COMPLETED':
        return 'border-slate-500/30 bg-slate-500/10';
      default:
        return 'border-white/10 bg-slate-900/70';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-400" />;

      case 'PREPARING':
        return <ChefHat className="w-5 h-5 text-cyan-400" />;

      case 'READY':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;

      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-slate-400" />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`
        border
        rounded-3xl
        p-5
        backdrop-blur-xl
        shadow-xl
        hover:shadow-2xl
        transition-all
        ${getStatusColor(order.status)}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">
              Order #{order.orderNumber}
            </span>

            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
              Table {order.table.tableNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
            {getStatusIcon(order.status)}
            <span>{order.status}</span>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {new Date(order.createdAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-5">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start bg-white/5 border border-white/10 rounded-2xl p-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-400">
                  {item.quantity}x
                </span>

                <span className="text-white">
                  {item.menuItem.name}
                </span>
              </div>

              {item.modifierData && item.modifierData.length > 0 && (
                <div className="text-xs text-slate-500 mt-2">
                  {item.modifierData
                    .map((m: any) => m.optionName)
                    .join(', ')}
                </div>
              )}
            </div>

            <span className="font-semibold text-cyan-400">
              ${item.totalPrice.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-white/10">
        {order.status === 'PENDING' && (
          <button
            onClick={() => handleStatusUpdate('PREPARING')}
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

        {order.status === 'PREPARING' && (
          <button
            onClick={() => handleStatusUpdate('READY')}
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

        {order.status === 'READY' && (
          <button
            onClick={() => handleStatusUpdate('COMPLETED')}
            disabled={isPending}
            className="
              w-full
              py-3
              rounded-xl
              bg-violet-500
              text-white
              font-bold
              hover:bg-violet-400
              transition-all
              disabled:opacity-50
            "
          >
            Serve & Complete
          </button>
        )}

        {order.status === 'COMPLETED' && (
          <div className="text-center text-emerald-400 font-semibold py-2">
            ✓ Completed
          </div>
        )}
      </div>
    </div>
  );
};