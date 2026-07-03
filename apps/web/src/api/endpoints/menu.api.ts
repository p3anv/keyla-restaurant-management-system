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
};