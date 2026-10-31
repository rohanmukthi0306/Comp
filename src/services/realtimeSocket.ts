/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    // Connect to same origin (e.g. http://192.168.1.5:3000 or http://localhost:3000)
    socketInstance = io({
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.IO Client] Connected to central server with ID:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket.IO Client] Disconnected from server:', reason);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket.IO Client] Connection error:', err.message);
    });
  }

  return socketInstance;
}
