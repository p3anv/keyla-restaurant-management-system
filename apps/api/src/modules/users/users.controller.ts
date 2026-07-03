import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { AuthRequest } from '../../middleware/auth';

export const usersController = {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getAllUsers();
      res.json({ success: true, data: { users } });
    } catch (error) {
      next(error);
    }
  },

  async getUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
      }
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name || !role) {
        return res.status(400).json({
          success: false,
          error: { message: 'email, password, name, and role are required' },
        });
      }
      const user = await usersService.createUser({ email, password, name, role });
      res.status(201).json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, role, password } = req.body;
      const user = await usersService.updateUser(req.params.id, { name, role, password });
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await usersService.deleteUser(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },
};