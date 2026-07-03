import { Router } from 'express';
import { menuController } from './menu.controller';

const router = Router();

router.get('/', menuController.getMenu);
router.get('/:id', menuController.getMenuItem);

export default router;