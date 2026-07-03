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
      updateStatus({ orderId: order.id, status: newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'border-yellow-400 bg-yellow-50';
      case 'PREPARING':
        return 'border-blue-400 bg-blue-50';
      case 'READY':
        return 'border-green-400 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'PREPARING':
        return <ChefHat className="w-5 h-5 text-blue-600" />;
      case 'READY':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${getStatusColor(
        order.status
      )}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">
              Order #{order.orderNumber}
            </span>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              Table {order.table.tableNumber}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            {getStatusIcon(order.status)}
            <span>{order.status}</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleTimeString()}
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">
                {item.quantity}x
              </span>
              <span className="text-gray-800">{item.menuItem.name}</span>
              {item.modifierData && (
                <span className="text-xs text-gray-400">
                  ({item.modifierData.map((m: any) => m.optionName).join(', ')})
                </span>
              )}
            </div>
            <span className="text-gray-600">${item.totalPrice.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
        {order.status === 'PENDING' && (
          <button
            onClick={() => handleStatusUpdate('PREPARING')}
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Start Preparing
          </button>
        )}
        {order.status === 'PREPARING' && (
          <button
            onClick={() => handleStatusUpdate('READY')}
            disabled={isPending}
            className="flex-1 bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Mark Ready
          </button>
        )}
        {order.status === 'READY' && (
          <button
            onClick={() => handleStatusUpdate('COMPLETED')}
            disabled={isPending}
            className="flex-1 bg-gray-800 text-white text-sm font-medium py-1.5 px-3 rounded hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            Serve & Complete
          </button>
        )}
        {order.status === 'COMPLETED' && (
          <span className="flex-1 text-center text-sm text-gray-500 py-1.5">
            ✅ Completed
          </span>
        )}
      </div>
    </div>
  );
};