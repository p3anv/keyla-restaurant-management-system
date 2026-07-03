import { Request, Response, NextFunction } from 'express';
import { inventoryService } from './inventory.service';

export const inventoryController = {
  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { lowStock } = req.query;
      if (lowStock === 'true') {
        const items = await inventoryService.getLowStockItems();
        return res.json({ success: true, data: { inventory: items } });
      }
      const inventory = await inventoryService.getAllInventory();
      res.json({ success: true, data: { inventory } });
    } catch (error) {
      next(error);
    }
  },

  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { stockQuantity } = req.body;
      if (stockQuantity === undefined || stockQuantity < 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'stockQuantity is required and must be >= 0' },
        });
      }
      const item = await inventoryService.updateStock(req.params.id, stockQuantity);
      res.json({ success: true, data: { item } });
    } catch (error) {
      next(error);
    }
  },

  async bulkRestock(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          error: { message: 'items array is required' },
        });
      }
      const results = await inventoryService.bulkRestock(items);
      res.json({ success: true, data: { items: results } });
    } catch (error) {
      next(error);
    }
  },
};