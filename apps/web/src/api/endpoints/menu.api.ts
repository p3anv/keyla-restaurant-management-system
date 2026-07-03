import { apiClient } from '../client';

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  stockQuantity: number;
  course: 'STARTER' | 'MAIN' | 'DESSERT' | 'BEVERAGE';
  taxCategory: 'FOOD' | 'BEVERAGE' | 'ALCOHOL';
  modifiers: ModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export const menuApi = {
  getMenu: (): Promise<{ success: boolean; data: { categories: MenuCategory[] } }> =>
    apiClient.get('/api/v1/menu').then((res) => res.data),
    createCategory: (data: { name: string; displayOrder?: number }) =>
    apiClient.post('/api/v1/menu/categories', data).then((res) => res.data),

  updateCategory: (id: string, data: { name?: string; displayOrder?: number }) =>
    apiClient.patch(`/api/v1/menu/categories/${id}`, data).then((res) => res.data),

  deleteCategory: (id: string) =>
    apiClient.delete(`/api/v1/menu/categories/${id}`).then((res) => res.data),

  createItem: (data: any) =>
    apiClient.post('/api/v1/menu/items', data).then((res) => res.data),

  updateItem: (id: string, data: any) =>
    apiClient.patch(`/api/v1/menu/items/${id}`, data).then((res) => res.data),

  deleteItem: (id: string) =>
    apiClient.delete(`/api/v1/menu/items/${id}`).then((res) => res.data),

  createModifierGroup: (data: { name: string; menuItemId: string; minSelect?: number; maxSelect?: number }) =>
    apiClient.post('/api/v1/menu/items/:menuItemId/modifiers', data).then((res) => res.data),

  deleteModifierGroup: (id: string) =>
    apiClient.delete(`/api/v1/menu/modifiers/${id}`).then((res) => res.data),
};