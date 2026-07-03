import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';

type EventMap = {
  'order:created': (data: any) => void;
  'order:status-updated': (data: any) => void;
  'order:created-confirmation': (data: any) => void;
  'inventory:low-stock': (data: any) => void;
  'table:status-updated': (data: any) => void;
  error: (data: any) => void;
};


export const useKitchenWebSocket = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    const socket = io(`${env.VITE_WS_URL}/kitchen`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🧑‍🍳 Kitchen WebSocket connected');
    });

    // When a new order is placed, refresh the kitchen view
    socket.on('order:created', (data) => {
      console.log('🆕 New order received in kitchen:', data);
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
      // Optional: Play a sound or show a notification
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
    });

    socket.on('order:status-updated', (data) => {
      console.log('🔄 Order status updated:', data);
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    });

    socket.on('disconnect', () => {
      console.log('🧑‍🍳 Kitchen WebSocket disconnected');
    });

    return () => {
      socket.off('order:created');
      socket.off('order:status-updated');
      socket.disconnect();
    };
  }, [queryClient]);

  return socketRef.current;
};


export const useWebSocket = <T extends keyof EventMap>(
  namespace: 'pos' | 'kitchen' | 'admin',
  event: T,
  callback: EventMap[T]
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    const socketInstance = io(`${env.VITE_WS_URL}/${namespace}`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    socketInstance.on(event, (data: any) => {
      callbackRef.current(data);
    });

    socketInstance.on('connect', () => {
      console.log(`🔌 Connected to ${namespace} namespace`);
    });

    socketInstance.on('disconnect', () => {
      console.log(`🔌 Disconnected from ${namespace} namespace`);
    });

    return () => {
      socketInstance.off(event);
      socketInstance.disconnect();
    };
  }, [namespace, event]);

  return socket;
};