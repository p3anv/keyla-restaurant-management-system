import { prisma } from '../../config/database';

export const menuService = {
  async getFullMenu() {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          where: { isAvailable: true },
          include: {
            modifiers: {
              include: { options: true },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
    });
    return categories;
  },

  async getMenuItemById(id: string) {
    return prisma.menuItem.findUnique({
      where: { id },
      include: {
        modifiers: { include: { options: true } },
        category: true,
      },
    });
  },
};