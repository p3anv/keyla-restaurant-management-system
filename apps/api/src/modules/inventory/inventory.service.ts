import { prisma } from '../../config/database';

export const inventoryService = {
  async getAllInventory() {
    // Get all menu items with their stock quantities
    const items = await prisma.menuItem.findMany({
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        isAvailable: true,
        category: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });
    return items;
  },

  async getLowStockItems(threshold: number = 10) {
    return prisma.menuItem.findMany({
      where: {
        stockQuantity: { lt: threshold },
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
      },
    });
  },

  async updateStock(itemId: string, newQuantity: number) {
    return prisma.menuItem.update({
      where: { id: itemId },
      data: {
        stockQuantity: newQuantity,
        // If stock is 0, automatically mark as unavailable
        isAvailable: newQuantity > 0,
      },
    });
  },

  async bulkRestock(updates: { id: string; quantity: number }[]) {
    const results = [];
    for (const update of updates) {
      const item = await prisma.menuItem.update({
        where: { id: update.id },
        data: {
          stockQuantity: update.quantity,
          isAvailable: update.quantity > 0,
        },
      });
      results.push(item);
    }
    return results;
  },
};