import { apiClient } from '../client';

export interface CreateOrderRequest {
  tableId: string;
  guestCount: number;
  items: {
    menuItemId: string;
    quantity: number;
    selectedModifiers?: { groupId: string; optionId: string }[];
  }[];
  discount: number;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  data: {
    order: {
      id: string;
      orderNumber: number;
      status: string;
      subtotal: number;
      taxAmount: number;
      discount: number;
      total: number;
      guestCount: number;
      tableId: string;
      waiterId: string;
      createdAt: string;
      items: any[];
    };
  };
}


export const ordersApi = {
  createOrder: (payload: CreateOrderRequest): Promise<OrderResponse> =>
    apiClient.post('/api/v1/orders', payload).then((res) => res.data),

  getOrders: (params?: { status?: string; waiterId?: string }) =>
    apiClient.get('/api/v1/orders', { params }).then((res) => res.data),

  updateStatus: (orderId: string, status: string) =>
    apiClient.patch(`/api/v1/orders/${orderId}/status`, { status }).then((res) => res.data),

  addPayment: (orderId: string, amount: number, method: string, transactionId?: string) =>
    apiClient.post(`/api/v1/orders/${orderId}/payments`, { amount, method, transactionId }).then((res) => res.data),
};