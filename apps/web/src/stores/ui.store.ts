import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  isCartOpen: false,
  isLoading: false,
  modal: { isOpen: false, type: null, data: null },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setLoading: (isLoading) => set({ isLoading }),
  openModal: (type, data = null) => set({ modal: { isOpen: true, type, data } }),
  closeModal: () => set({ modal: { isOpen: false, type: null, data: null } }),
}));
