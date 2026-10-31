/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { Server as SocketServer } from 'socket.io';
import { createItemsRouter } from './routes/items';
import { createClaimsRouter } from './routes/claims';
import { createNotificationsRouter } from './routes/notifications';
import { errorHandler } from './middleware/errorHandler';

export function createExpressApp(io: SocketServer, existingApp?: express.Express) {
  const app = existingApp || express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static directory for uploaded item photos
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      database: 'connected',
      realtime: 'active',
      timestamp: new Date().toISOString(),
      room: 'mavericks-fest-2026',
    });
  });

  // Staff PIN verification endpoint
  app.post('/api/staff/verify-pin', (req, res) => {
    const { pin } = req.body || {};
    const STAFF_PIN = process.env.FINDIT_STAFF_PIN || '2026';
    if (pin && String(pin).trim() === STAFF_PIN) {
      return res.json({ success: true, authorized: true });
    }
    return res.status(401).json({ success: false, authorized: false, error: 'Invalid Staff PIN' });
  });

  // REST API Routes
  app.use('/api/items', createItemsRouter(io));
  app.use('/api/claims', createClaimsRouter(io));
  app.use('/api/notifications', createNotificationsRouter());

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
