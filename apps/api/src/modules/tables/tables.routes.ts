import { Router } from 'express';
import { tablesController } from './tables.controller';
import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', tablesController.getTables);
router.get('/:id', tablesController.getTable);
router.post('/', requireRoles('ADMIN', 'MANAGER'), tablesController.createTable);
router.patch('/:id', requireRoles('ADMIN', 'MANAGER'), tablesController.updateTable);
router.delete('/:id', requireRoles('ADMIN'), tablesController.deleteTable);

export default router;