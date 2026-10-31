/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import { uploadItemPhoto } from '../middleware/upload';
import { getAllItems, getItemById, createFoundItem } from '../services/itemService';
import { Server as SocketServer } from 'socket.io';

const VALID_FESTIVAL_DATES = ['2026-10-29', '2026-10-30', '2026-10-31'];

export function createItemsRouter(io: SocketServer) {
  const router = Router();

  // GET /api/items
  router.get('/', (req: Request, res: Response) => {
    try {
      const date = typeof req.query.date === 'string' ? req.query.date : undefined;
      const items = getAllItems(date);
      res.json({ success: true, count: items.length, data: items });
    } catch (err: any) {
      console.error('Error fetching items:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch items from database' });
    }
  });

  // GET /api/items/:id
  router.get('/:id', (req: Request, res: Response) => {
    try {
      const item = getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }
      res.json({ success: true, data: item });
    } catch (err: any) {
      console.error('Error fetching item by id:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch item record' });
    }
  });

  // POST /api/items
  router.post('/', uploadItemPhoto.single('photo'), (req: Request, res: Response) => {
    try {
      const itemName = req.body.itemName || req.body.title;
      const category = req.body.category;
      const description = req.body.description;
      const location = req.body.location || req.body.foundLocation;
      const foundDate = req.body.foundDate;
      const foundTime = req.body.foundTime;

      // Validation
      if (!itemName || typeof itemName !== 'string' || !itemName.trim()) {
        return res.status(400).json({ success: false, error: 'Item name is required' });
      }
      if (!category || typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({ success: false, error: 'Category is required' });
      }
      if (!description || typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({ success: false, error: 'Detailed description is required' });
      }
      if (!location || typeof location !== 'string' || !location.trim()) {
        return res.status(400).json({ success: false, error: 'Found location is required' });
      }
      if (!foundDate || !VALID_FESTIVAL_DATES.includes(foundDate)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid festival date. Must be 2026-10-29, 2026-10-30, or 2026-10-31.',
        });
      }
      if (!foundTime || typeof foundTime !== 'string' || !foundTime.trim()) {
        return res.status(400).json({ success: false, error: 'Found time is required' });
      }

      const imageFilename = req.file ? req.file.filename : null;

      const { item, notification } = createFoundItem({
        itemName,
        category,
        description,
        location,
        foundDate,
        foundTime,
        imageFilename,
      });

      // Emit mandatory Socket.IO real-time event to the event room
      io.to('mavericks-fest-2026').emit('item:created', {
        item,
        notification,
      });

      res.status(201).json({
        success: true,
        message: 'Your found item has been successfully registered.',
        data: item,
      });
    } catch (err: any) {
      console.error('Error creating found item:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to register item in database' });
    }
  });

  return router;
}
