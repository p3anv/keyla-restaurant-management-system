import { Request, Response, NextFunction } from 'express';
import { ordersService } from './orders.service';
import { AuthRequest } from '../../middleware/auth';
import { Server as SocketServer } from 'socket.io';

export const createOrderController = (io: SocketServer) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const order = await ordersService.createOrder({
        ...req.body,
        waiterId: req.user!.id,
      });

      // Split into course tickets
      const starters = order.items.filter((item) => item.menuItem.course === 'STARTER');
      const mains = order.items.filter((item) => item.menuItem.course === 'MAIN');
      const desserts = order.items.filter((item) => item.menuItem.course === 'DESSERT');
      const beverages = order.items.filter((item) => item.menuItem.course === 'BEVERAGE');

      const tickets = [
        { course: 'STARTER', items: starters },
        { course: 'MAIN', items: mains },
        { course: 'DESSERT', items: desserts },
        { course: 'BEVERAGE', items: beverages },
      ];
    
      console.log(`📤 Emitting order:created for order ${order.id} to kitchen`);

      for (const ticket of tickets) {
        if (ticket.items.length > 0) {
          io.of('/kitchen').emit('order:created', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            tableNumber: order.table.tableNumber,
            course: ticket.course,
            items: ticket.items.map((item: any) => ({
              name: item.menuItem.name,
              quantity: item.quantity,
              notes: item.modifierData || null,
            })),
            createdAt: order.createdAt,
          });
        }
      }

      io.of('/pos').emit('order:created-confirmation', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.table.tableNumber,
        total: order.total,
      });

      res.status(201).json({ success: true, data: { order } });
    } catch (error) {
      next(error);
    }
  };
};

export const ordersController = {
  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, waiterId } = req.query;
      const orders = await ordersService.getOrdersByStatus(
        status as string,
        waiterId as string
      );
      res.json({ success: true, data: { orders } });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const order = await ordersService.updateOrderStatus(req.params.id, status);
      res.json({ success: true, data: { order } });
    } catch (error) {
      next(error);
    }
  },

  async addPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { amount, method, transactionId } = req.body;
      const payment = await ordersService.addPayment(
        req.params.id,
        amount,
        method,
        transactionId
      );
      res.status(201).json({ success: true, data: { payment } });
    } catch (error) {
      next(error);
    }
  },
};