import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import { prisma } from './config/database';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import menuRoutes from './modules/menu/menu.routes';  // <-- ADD THIS
import { ordersRoutes } from './modules/orders/orders.routes';
import { setupOrderWebSocket } from './modules/orders/orders.websocket';
import tablesRoutes from './modules/tables/tables.routes';
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: { origin: env.FRONTEND_URL, methods: ['GET', 'POST'] },
});
setupOrderWebSocket(io);

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/menu', menuRoutes);  // <-- ADD THIS
app.use('/api/v1/orders', ordersRoutes(io));
app.use('/api/v1/tables', tablesRoutes);
app.use('/api/v1/orders', ordersRoutes(io));

app.use(errorHandler);

const PORT = env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🗄️  Database: Connected`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});