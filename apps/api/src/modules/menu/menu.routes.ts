import { Router } from 'express';
import { menuController } from './menu.controller';
import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';

const router = Router();

// Public (or authenticated) GET endpoints
router.get('/', menuController.getMenu);
router.get('/:id', menuController.getMenuItem);

// Admin/Manager only endpoints
router.use(authenticate);
router.use(requireRoles('ADMIN', 'MANAGER'));

// Categories
router.post('/categories', menuController.createCategory);
router.patch('/categories/:id', menuController.updateCategory);
router.delete('/categories/:id', menuController.deleteCategory);

// Items
router.post('/items', menuController.createMenuItem);
router.patch('/items/:id', menuController.updateMenuItem);
router.delete('/items/:id', menuController.deleteMenuItem);

// Modifiers
router.post('/items/:itemId/modifiers', menuController.createModifierGroup);
router.delete('/modifiers/:id', menuController.deleteModifierGroup);
router.post('/modifiers/:groupId/options', menuController.createModifierOption);
router.delete('/modifiers/options/:id', menuController.deleteModifierOption);

export default router;