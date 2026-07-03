import { prisma } from '../../config/database';

export const tablesService = {
  async getAllTables() {
    return prisma.table.findMany({
      orderBy: { tableNumber: 'asc' },
    });
  },

  async getTableById(id: string) {
    return prisma.table.findUnique({ where: { id } });
  },

  async createTable(tableNumber: number, capacity: number) {
    return prisma.table.create({
      data: { tableNumber, capacity, status: 'FREE' },
    });
  },

  async updateTable(id: string, data: { tableNumber?: number; capacity?: number; status?: string }) {
    return prisma.table.update({
      where: { id },
      data: {
        ...(data.tableNumber && { tableNumber: data.tableNumber }),
        ...(data.capacity && { capacity: data.capacity }),
        ...(data.status && { status: data.status as any }),
      },
    });
  },

  async deleteTable(id: string) {
    return prisma.table.delete({ where: { id } });
  },
};