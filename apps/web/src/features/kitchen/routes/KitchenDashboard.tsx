import { useKitchenOrders } from '@/hooks/queries/useKitchenOrders';
import { useKitchenWebSocket } from '@/hooks/useKitchenWebSocket';
import { OrderTicket } from '../components/OrderTicket';

import {
  ChefHat,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';

import { useQueryClient } from '@tanstack/react-query';

export const KitchenDashboard = () => {
  const { isConnected } =
    useKitchenWebSocket();

  const {
    data: orders,
    isLoading,
    error,
  } = useKitchenOrders();

  const queryClient =
    useQueryClient();

  const pendingOrders =
    orders?.filter(
      (o: any) =>
        o.status === 'PENDING'
    ) || [];

  const preparingOrders =
    orders?.filter(
      (o: any) =>
        o.status ===
        'PREPARING'
    ) || [];

  const readyOrders =
    orders?.filter(
      (o: any) =>
        o.status === 'READY'
    ) || [];

  const totalActive =
    pendingOrders.length +
    preparingOrders.length +
    readyOrders.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>

          <p className="mt-6 text-slate-400">
            Loading kitchen orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-10 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />

          <p className="mt-5 text-red-300 text-lg">
            Failed to load kitchen orders
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Kitchen Display
          </h1>

          <p className="text-slate-400 mt-1">
            {totalActive} active orders
          </p>
        </div>

        <div className="flex items-center gap-3">

          {isConnected ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">
              <Wifi className="w-4 h-4" />
              Live
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-300">
              <WifiOff className="w-4 h-4" />
              Offline
            </div>
          )}

          <button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: [
                  'kitchen-orders',
                ],
              })
            }
            className="
              px-5
              py-2
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-slate-300
              hover:bg-white/10
              transition-all
            "
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-5">
          <p className="text-yellow-300 text-sm">
            Pending Orders
          </p>

          <p className="text-5xl font-bold text-yellow-400 mt-2">
            {pendingOrders.length}
          </p>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5">
          <p className="text-cyan-300 text-sm">
            Preparing
          </p>

          <p className="text-5xl font-bold text-cyan-400 mt-2">
            {preparingOrders.length}
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5">
          <p className="text-emerald-300 text-sm">
            Ready
          </p>

          <p className="text-5xl font-bold text-emerald-400 mt-2">
            {readyOrders.length}
          </p>
        </div>

      </div>

      {/* Empty State */}
      {totalActive === 0 ? (
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl h-[400px] flex flex-col justify-center items-center">
          <ChefHat className="w-20 h-20 text-slate-600 mb-6" />

          <p className="text-2xl text-white">
            No Active Orders
          </p>

          <p className="text-slate-500 mt-2">
            {isConnected
              ? 'Waiting for incoming orders...'
              : 'Kitchen websocket disconnected'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">

          {pendingOrders.length > 0 && (
            <section>
              <h2 className="text-yellow-400 text-xl font-bold mb-5">
                Pending
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {pendingOrders.map(
                  (order: any) => (
                    <OrderTicket
                      key={order.id}
                      order={order}
                    />
                  )
                )}
              </div>
            </section>
          )}

          {preparingOrders.length > 0 && (
            <section>
              <h2 className="text-cyan-400 text-xl font-bold mb-5">
                Preparing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {preparingOrders.map(
                  (order: any) => (
                    <OrderTicket
                      key={order.id}
                      order={order}
                    />
                  )
                )}
              </div>
            </section>
          )}

          {readyOrders.length > 0 && (
            <section>
              <h2 className="text-emerald-400 text-xl font-bold mb-5">
                Ready For Service
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {readyOrders.map(
                  (order: any) => (
                    <OrderTicket
                      key={order.id}
                      order={order}
                    />
                  )
                )}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
};