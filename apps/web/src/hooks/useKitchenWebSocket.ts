import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';

let globalSocket: Socket | null = null;

export const useKitchenWebSocket = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      console.log('🔴 No access token, skipping WebSocket');
      return;
    }

    // Create socket if it doesn't exist
    if (!globalSocket) {
      console.log('🆕 Creating new kitchen WebSocket');
      const socket = io(`${env.VITE_WS_URL}/kitchen`, {
        auth: { token: accessToken },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        forceNew: false,
      });
      globalSocket = socket;
    }

    const socket = globalSocket;

    // --- Define event handlers ---
    const onConnect = () => {
      console.log('🧑‍🍳 Kitchen WebSocket connected');
      if (mountedRef.current) {
        setIsConnected(true);
      }
    };

    const onDisconnect = (reason: string) => {
      console.log(`🧑‍🍳 Kitchen WebSocket disconnected: ${reason}`);
      if (mountedRef.current) {
        setIsConnected(false);
      }
    };

    const onConnectError = (err: Error) => {
      console.error('🔴 Kitchen WebSocket connect error:', err.message);
      if (mountedRef.current) {
        setIsConnected(false);
      }
    };

    const onOrderCreated = (data: any) => {
      console.log('🆕 New order received in kitchen:', data);
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
      if (window.navigator?.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    };

    const onOrderStatusUpdated = (data: any) => {
      console.log('🔄 Order status updated:', data);
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    };

    // --- Remove old listeners and attach fresh ones ---
    // This ensures we don't have multiple duplicates
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.off('order:created');
    socket.off('order:status-updated');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('order:created', (data) => {
  console.log('🆕 New order received in kitchen:', data);
  // Force refetch
  queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
  // Also manually refetch to ensure immediate update
  queryClient.refetchQueries({ queryKey: ['kitchen-orders'] });
});
    socket.on('order:status-updated', onOrderStatusUpdated);

    // If the socket is already connected, set state
    if (socket.connected) {
      setIsConnected(true);
    } else {
      // Otherwise, connect it
      socket.connect();
    }

    // Cleanup on unmount: only remove listeners, don't destroy the socket
    return () => {
      mountedRef.current = false;
      // We keep the socket alive for other components
      // But we can set state to false
      setIsConnected(false);
    };
  }, [queryClient]); // Only re-run if queryClient changes (never)

  return { socket: globalSocket, isConnected };
};