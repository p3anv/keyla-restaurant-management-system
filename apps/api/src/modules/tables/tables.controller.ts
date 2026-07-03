import { Request, Response, NextFunction } from 'express';
import { tablesService } from './tables.service';

export const tablesController = {
  async getTables(req: Request, res: Response, next: NextFunction) {
    try {
      const tables = await tablesService.getAllTables();
      res.json({ success: true, data: { tables } });
    } catch (error) {
      next(error);
    }
  },

  async getTable(req: Request, res: Response, next: NextFunction) {
    try {
      const table = await tablesService.getTableById(req.params.id);
      if (!table) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Table not found' },
        });
      }
      res.json({ success: true, data: { table } });
    } catch (error) {
      next(error);
    }
  },

  async createTable(req: Request, res: Response, next: NextFunction) {
    try {
      const { tableNumber, capacity } = req.body;
      const table = await tablesService.createTable(tableNumber, capacity);
      res.status(201).json({ success: true, data: { table } });
    } catch (error) {
      next(error);
    }
  },

  async updateTable(req: Request, res: Response, next: NextFunction) {
    try {
      const { tableNumber, capacity, status } = req.body;
      const table = await tablesService.updateTable(req.params.id, {
        tableNumber,
        capacity,
        status,
      });
      res.json({ success: true, data: { table } });
    } catch (error) {
      next(error);
    }
  },

  async deleteTable(req: Request, res: Response, next: NextFunction) {
    try {
      await tablesService.deleteTable(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },
};