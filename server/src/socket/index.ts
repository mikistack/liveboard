import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { verifyAccessToken } from '../utils/tokens';

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Redis Adapter for scaling
  if (process.env.REDIS_URL) {
    const pubClient = new Redis(process.env.REDIS_URL);
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
  }

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = verifyAccessToken(token);
      (socket as any).userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    console.log(`👤 User connected: ${userId} (${socket.id})`);

    socket.on('join-board', (boardId: string) => {
      socket.join(boardId);
      console.log(`🚪 User ${userId} joined board: ${boardId}`);
      
      // Notify others in the room
      socket.to(boardId).emit('user-joined', { userId });
    });

    socket.on('leave-board', (boardId: string) => {
      socket.leave(boardId);
      console.log(`🏃 User ${userId} left board: ${boardId}`);
    });

    // Drawing Sync
    socket.on('draw-element', ({ boardId, element }) => {
      socket.to(boardId).emit('element-update', element);
    });

    // Cursor Presence
    socket.on('cursor-move', ({ boardId, x, y, username }) => {
      socket.to(boardId).emit('user-cursor', { userId, username, x, y });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });

  return io;
};
