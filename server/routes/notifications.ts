/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import { getAllNotifications } from '../services/notificationService';

export function createNotificationsRouter() {
  const router = Router();

  router.get('/', (_req: Request, res: Response) => {
    try {
      const notifs = getAllNotifications();
      res.json({ success: true, count: notifs.length, data: notifs });
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve notifications' });
    }
  });

  return router;
}
