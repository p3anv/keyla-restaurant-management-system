import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/api/endpoints/orders.api';

export const useKitchenOrders = () => {
  return useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: async () => {
      // Fetch all orders (without status filter)
      const response = await ordersApi.getOrders();
      // The API returns { success: true, data: { orders: [...] } }
      const allOrders = response.data.orders || [];
      // Filter out completed and cancelled orders
      const activeOrders = allOrders.filter(
        (order: any) => order.status !== 'COMPLETED' && order.status !== 'CANCELLED'
      );
      console.log('📦 Active orders for kitchen:', activeOrders);
      return activeOrders;
    },
    refetchInterval: 5000,
    retry: 1,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    },
  });
};