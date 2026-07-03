import { prisma } from '../../config/database';
import { env } from '../../config/env';

type CreateOrderData = {
  tableId: string;
  guestCount: number;
  items: { menuItemId: string; quantity: number; selectedModifiers?: any[] }[];
  discount: number;
  notes?: string;
  waiterId: string;
};

const TAX_RATES = {
  FOOD: env.TAX_RATE_FOOD,
  BEVERAGE: env.TAX_RATE_BEVERAGE,
  ALCOHOL: env.TAX_RATE_ALCOHOL,
};

export const ordersService = {
  async createOrder(data: CreateOrderData) {
    const { tableId, guestCount, items, discount, notes, waiterId } = data;

    // 1. Fetch all menu items
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      include: { modifiers: { include: { options: true } } },
    });

    if (menuItems.length !== items.length) {
      throw new Error('One or more menu items not found');
    }

    // 2. Calculate line items
    let subtotal = 0;
    let taxAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
      const unitPrice = menuItem.price;
      const quantity = item.quantity;
      const lineTotal = unitPrice * quantity;

      const taxRate = TAX_RATES[menuItem.taxCategory as keyof typeof TAX_RATES] || 0;
      const lineTax = lineTotal * taxRate;

      subtotal += lineTotal;
      taxAmount += lineTax;

      // Resolve modifiers for display
      let modifierData = null;
      if (item.selectedModifiers && item.selectedModifiers.length > 0) {
        const optionIds = item.selectedModifiers.map((m) => m.optionId);
        const options = await prisma.modifierOption.findMany({
          where: { id: { in: optionIds } },
          include: { group: true },
        });
        modifierData = options.map((opt) => ({
          groupName: opt.group.name,
          optionName: opt.name,
          priceAdjustment: opt.priceAdjustment,
        }));
      }

      orderItemsData.push({
        menuItemId: menuItem.id,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
        taxRate,
        taxAmount: lineTax,
        modifierData,
      });
    }

    const total = subtotal + taxAmount - discount;

    // 3. Database transaction
    const result = await prisma.$transaction(async (tx) => {
      // 3a. Create order
      const order = await tx.order.create({
        data: {
          tableId,
          waiterId,
          guestCount,
          subtotal,
          taxAmount,
          discount,
          total,
          status: 'PENDING',
          items: { create: orderItemsData },
        },
        include: {
          items: { include: { menuItem: true } },
          table: true,
          waiter: true,
        },
      });

      // 3b. Update table status
      await tx.table.update({
        where: { id: tableId },
        data: { status: 'OCCUPIED' },
      });

      // 3c. Deduct inventory
      for (const item of items) {
        await tx.menuItem.update({
          where: { id: item.menuItemId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      return order;
    });

    return result;
  },

  async getOrdersByStatus(status?: string, waiterId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (waiterId) where.waiterId = waiterId;

    return prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        waiter: { select: { id: true, name: true } },
        payments: true,
      },
    });
  },

  async updateOrderStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        waiter: true,
      },
    });
  },

  async addPayment(orderId: string, amount: number, method: string, transactionId?: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Create the payment record
    const payment = await tx.payment.create({
      data: {
        orderId,
        amount,
        method: method as any,
        status: 'PAID',
        transactionId,
      },
    });

    // 2. Fetch the order with all its payments (including the one we just created)
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payments: true, table: true },
    });

    if (!order) throw new Error('Order not found');

    // 3. Calculate total paid (which now includes the new payment)
    const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);

    // 4. If fully paid, complete the order and free the table
    if (totalPaid >= order.total) {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' },
      });

      await tx.table.update({
        where: { id: order.tableId },
        data: { status: 'FREE' },
      });

      console.log(`✅ Order ${order.orderNumber} completed, Table ${order.table.tableNumber} freed.`);
    }

    return payment;
  });
},
};