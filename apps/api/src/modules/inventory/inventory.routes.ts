import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/inventory - Get all inventory (or ?lowStock=true)
router.get('/', inventoryController.getInventory);

// PATCH /api/v1/inventory/items/:id - Update stock
router.patch('/items/:id', requireRoles('ADMIN', 'MANAGER'), inventoryController.updateStock);

// POST /api/v1/inventory/restock - Bulk restock
router.post('/restock', requireRoles('ADMIN', 'MANAGER'), inventoryController.bulkRestock);

export default router;