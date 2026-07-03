import { Request, Response, NextFunction } from 'express';
import { menuService } from './menu.service';

export const menuController = {
  // ===== Existing GET endpoints =====
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

  // ===== Category CRUD =====
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, displayOrder } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          error: { message: 'Category name is required' },
        });
      }
      const category = await menuService.createCategory({ name, displayOrder });
      res.status(201).json({ success: true, data: { category } });
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, displayOrder } = req.body;
      const category = await menuService.updateCategory(req.params.id, { name, displayOrder });
      res.json({ success: true, data: { category } });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await menuService.deleteCategory(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },

  // ===== Menu Item CRUD =====
  async createMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price, categoryId, course, taxCategory, stockQuantity, imageUrl, isAvailable } = req.body;
      if (!name || !price || !categoryId) {
        return res.status(400).json({
          success: false,
          error: { message: 'name, price, and categoryId are required' },
        });
      }
      const item = await menuService.createMenuItem({
        name,
        description,
        price,
        categoryId,
        course: course || 'MAIN',
        taxCategory: taxCategory || 'FOOD',
        stockQuantity: stockQuantity || 0,
        imageUrl,
        isAvailable,
      });
      res.status(201).json({ success: true, data: { item } });
    } catch (error) {
      next(error);
    }
  },

  async updateMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await menuService.updateMenuItem(req.params.id, req.body);
      res.json({ success: true, data: { item } });
    } catch (error) {
      next(error);
    }
  },

  async deleteMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      await menuService.deleteMenuItem(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },

  // ===== Modifier Group CRUD =====
  async createModifierGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, minSelect, maxSelect } = req.body;
      const itemId = req.params.itemId;
      if (!name) {
        return res.status(400).json({
          success: false,
          error: { message: 'Modifier group name is required' },
        });
      }
      const group = await menuService.createModifierGroup({
        name,
        menuItemId: itemId,
        minSelect,
        maxSelect,
      });
      res.status(201).json({ success: true, data: { group } });
    } catch (error) {
      next(error);
    }
  },

  async deleteModifierGroup(req: Request, res: Response, next: NextFunction) {
    try {
      await menuService.deleteModifierGroup(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },

  async createModifierOption(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, priceAdjustment } = req.body;
      const groupId = req.params.groupId;
      if (!name) {
        return res.status(400).json({
          success: false,
          error: { message: 'Option name is required' },
        });
      }
      const option = await menuService.createModifierOption({
        name,
        groupId,
        priceAdjustment: priceAdjustment || 0,
      });
      res.status(201).json({ success: true, data: { option } });
    } catch (error) {
      next(error);
    }
  },

  async deleteModifierOption(req: Request, res: Response, next: NextFunction) {
    try {
      await menuService.deleteModifierOption(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },
};