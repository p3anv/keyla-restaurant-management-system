import { useKitchenOrders } from '@/hooks/queries/useKitchenOrders';
import { useKitchenWebSocket } from '@/hooks/useKitchenWebSocket';
import { OrderTicket } from '../components/OrderTicket';
import { ChefHat, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export const KitchenDashboard = () => {
  const { isConnected } = useKitchenWebSocket();
  const { data: orders, isLoading, error } = useKitchenOrders();
  const queryClient = useQueryClient();

  // Debug logs
  console.log('🔍 Kitchen orders data:', orders);
  console.log('🔍 Kitchen orders error:', error);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">Failed to load orders</p>
        </div>
      </div>
    );
  }

  // Group orders by status
  const pendingOrders = orders?.filter((o: any) => o.status === 'PENDING') || [];
  const preparingOrders = orders?.filter((o: any) => o.status === 'PREPARING') || [];
  const readyOrders = orders?.filter((o: any) => o.status === 'READY') || [];

  const totalActive = pendingOrders.length + preparingOrders.length + readyOrders.length;

  if (totalActive === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kitchen Display</h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Wifi className="w-4 h-4" />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-red-500">
                <WifiOff className="w-4 h-4" />
                Disconnected
              </span>
            )}
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] })}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 ml-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <ChefHat className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No active orders</p>
          <p className="text-gray-400 text-sm">
            {isConnected ? 'Waiting for new orders...' : 'WebSocket disconnected'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kitchen Display</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{totalActive} active orders</span>
          {isConnected ? (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Wifi className="w-4 h-4" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-red-500">
              <WifiOff className="w-4 h-4" />
              Disconnected
            </span>
          )}
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] })}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Status summary badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span className="font-bold">{pendingOrders.length}</span> Pending
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span className="font-bold">{preparingOrders.length}</span> Preparing
        </div>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span className="font-bold">{readyOrders.length}</span> Ready
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pendingOrders.map((order: any) => (
          <OrderTicket key={order.id} order={order} />
        ))}
        {preparingOrders.map((order: any) => (
          <OrderTicket key={order.id} order={order} />
        ))}
        {readyOrders.map((order: any) => (
          <OrderTicket key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};