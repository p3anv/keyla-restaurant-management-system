import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(requireRoles('ADMIN', 'MANAGER'));

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.post('/', requireRoles('ADMIN'), usersController.createUser);
router.patch('/:id', usersController.updateUser);
router.delete('/:id', requireRoles('ADMIN'), usersController.deleteUser);

export default router;