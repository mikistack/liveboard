import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

export const useSocket = (boardId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!boardId || !accessToken) return;

    // Initialize socket connection
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      auth: {
        token: accessToken,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to socket server');
      socket.emit('join-board', boardId);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    return () => {
      if (socket) {
        socket.emit('leave-board', boardId);
        socket.disconnect();
      }
    };
  }, [boardId, accessToken]);

  return socketRef.current;
};
