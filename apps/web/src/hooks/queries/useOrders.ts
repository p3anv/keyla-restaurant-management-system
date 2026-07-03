import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi, CreateOrderRequest } from '@/api/endpoints/orders.api';
import { useCartStore } from '@/stores/cart.store';
import { useUIStore } from '@/stores/ui.store';

export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, amount, method, transactionId }: {
      orderId: string;
      amount: number;
      method: string;
      transactionId?: string;
    }) => ordersApi.addPayment(orderId, amount, method, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);
  const closeModal = useUIStore((state) => state.closeModal);

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => ordersApi.createOrder(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      clearCart();
      closeModal();
    },
  });
};

export const useOrders = (status?: string, waiterId?: string) => {
  return useQuery({
    queryKey: ['orders', { status, waiterId }],
    queryFn: () => ordersApi.getOrders({ status, waiterId }).then((res) => res.data.orders),
  });
};