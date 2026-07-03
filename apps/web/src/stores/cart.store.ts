import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  tableId: null,
  guestCount: 1,
  discount: 0,
  notes: '',
  addItem: (item) => {
    const existing = get().items.find((i) => i.menuItemId === item.menuItemId);
    if (existing) {
      set({ items: get().items.map((i) => (i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i)) });
    } else {
      set({ items: [...get().items, item] });
    }
  },
  removeItem: (menuItemId) => set({ items: get().items.filter((i) => i.menuItemId !== menuItemId) }),
  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) get().removeItem(menuItemId);
    else set({ items: get().items.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i)) });
  },
  clearCart: () => set({ items: [], tableId: null, guestCount: 1, discount: 0, notes: '' }),
  setTable: (tableId) => set({ tableId }),
  setGuestCount: (guestCount) => set({ guestCount }),
  setDiscount: (discount) => set({ discount }),
  setNotes: (notes) => set({ notes }),
}));
