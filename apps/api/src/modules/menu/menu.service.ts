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

  // Add to menu.service.ts

async createCategory(data: { name: string; displayOrder?: number }) {
  return prisma.menuCategory.create({
    data: {
      name: data.name,
      displayOrder: data.displayOrder || 0,
    },
  });
},

async updateCategory(id: string, data: { name?: string; displayOrder?: number }) {
  return prisma.menuCategory.update({
    where: { id },
    data,
  });
},

async deleteCategory(id: string) {
  return prisma.menuCategory.delete({ where: { id } });
},

async createMenuItem(data: {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  course: string;
  taxCategory: string;
  stockQuantity?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}) {
  return prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      course: data.course as any,
      taxCategory: data.taxCategory as any,
      stockQuantity: data.stockQuantity || 0,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    },
  });
},

async updateMenuItem(id: string, data: any) {
  return prisma.menuItem.update({
    where: { id },
    data,
  });
},

async deleteMenuItem(id: string) {
  return prisma.menuItem.delete({ where: { id } });
},

async createModifierGroup(data: {
  name: string;
  menuItemId: string;
  minSelect?: number;
  maxSelect?: number;
}) {
  return prisma.modifierGroup.create({
    data: {
      name: data.name,
      menuItemId: data.menuItemId,
      minSelect: data.minSelect || 0,
      maxSelect: data.maxSelect || 1,
    },
  });
},

async createModifierOption(data: {
  name: string;
  groupId: string;
  priceAdjustment?: number;
}) {
  return prisma.modifierOption.create({
    data: {
      name: data.name,
      groupId: data.groupId,
      priceAdjustment: data.priceAdjustment || 0,
    },
  });
},

async deleteModifierGroup(id: string) {
  return prisma.modifierGroup.delete({ where: { id } });
},

async deleteModifierOption(id: string) {
  return prisma.modifierOption.delete({ where: { id } });
},

};