import { Router } from 'express';
import { Server as SocketServer } from 'socket.io';
import { ordersController, createOrderController } from './orders.controller';
import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';

export const ordersRoutes = (io: SocketServer) => {
  const router = Router();

  router.use(authenticate);

  router.post(
    '/',
    requireRoles('WAITER', 'MANAGER', 'ADMIN'),
    createOrderController(io)
  );

  router.get('/', requireRoles('WAITER', 'MANAGER', 'ADMIN', 'CHEF'), ordersController.getOrders);

  router.patch(
    '/:id/status',
    requireRoles('CHEF', 'WAITER', 'MANAGER', 'ADMIN'),
    ordersController.updateStatus
  );

  router.post(
    '/:id/payments',
    requireRoles('WAITER', 'MANAGER', 'ADMIN'),
    ordersController.addPayment
  );
    router.get('/', ordersController.getOrders);
  return router;
};