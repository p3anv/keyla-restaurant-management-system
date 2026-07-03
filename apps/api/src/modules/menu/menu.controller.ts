import { Request, Response, NextFunction } from 'express';
import { menuService } from './menu.service';

export const menuController = {
  async getMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const menu = await menuService.getFullMenu();
      res.json({ success: true, data: { categories: menu } });
    } catch (error) {
      next(error);
    }
  },

  async getMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await menuService.getMenuItemById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Menu item not found' },
        });
      }
      res.json({ success: true, data: { item } });
    } catch (error) {
      next(error);
    }
  },
};