import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { prisma } from '../../config/database';

export const setupOrderWebSocket = (io: SocketServer) => {
  // ---------------------------
  // 1. Authentication Middleware for /kitchen
  // ---------------------------
  io.of('/kitchen').use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log('❌ Kitchen connection rejected: No token');
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true },
      });

      if (!user) {
        console.log('❌ Kitchen connection rejected: User not found');
        return next(new Error('User not found'));
      }

      // Attach user to socket for later use
      socket.data.user = user;
      console.log(`✅ Kitchen authentication successful for user ${user.id}`);
      next();
    } catch (error) {
      console.log('❌ Kitchen connection rejected: Invalid token', error);
      next(new Error('Invalid token'));
    }
  });

  io.of('/kitchen').on('connection', (socket: Socket) => {
    console.log(`🧑‍🍳 Kitchen client connected: ${socket.id} (User: ${socket.data.user?.id})`);
    socket.join('kitchen-room');

    socket.on('disconnect', (reason) => {
      console.log(`🧑‍🍳 Kitchen client disconnected: ${socket.id} (Reason: ${reason})`);
    });

    socket.on('error', (err) => {
      console.log(`🧑‍🍳 Kitchen socket error:`, err);
    });
  });

  // ---------------------------
  // 2. Authentication Middleware for /pos
  // ---------------------------
  io.of('/pos').use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log('❌ POS connection rejected: No token');
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true },
      });

      if (!user) {
        console.log('❌ POS connection rejected: User not found');
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      console.log(`✅ POS authentication successful for user ${user.id}`);
      next();
    } catch (error) {
      console.log('❌ POS connection rejected: Invalid token', error);
      next(new Error('Invalid token'));
    }
  });

  io.of('/pos').on('connection', (socket: Socket) => {
    console.log(`🧑‍💼 Waiter client connected: ${socket.id} (User: ${socket.data.user?.id})`);
  });
};