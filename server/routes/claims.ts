/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import { db } from '../database';
import { Server as SocketServer } from 'socket.io';
import { getItemById, updateItemStatus } from '../services/itemService';
import { createNotification } from '../services/notificationService';

const STAFF_PIN = process.env.FINDIT_STAFF_PIN || '2026';

export function createClaimsRouter(io: SocketServer) {
  const router = Router();

  // POST /api/claims (Public claim submission)
  router.post('/', (req: Request, res: Response) => {
    try {
      const { itemId, claimantName, contact, privateDetails } = req.body;

      if (!itemId || typeof itemId !== 'string') {
        return res.status(400).json({ success: false, error: 'Item ID is required' });
      }
      if (!claimantName || typeof claimantName !== 'string' || !claimantName.trim()) {
        return res.status(400).json({ success: false, error: 'Claimant name is required' });
      }
      if (!contact || typeof contact !== 'string' || !contact.trim()) {
        return res.status(400).json({ success: false, error: 'Contact information is required' });
      }
      if (!privateDetails || typeof privateDetails !== 'string' || !privateDetails.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Private identifying details are required to establish ownership',
        });
      }

      const item = getItemById(itemId);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Target item not found' });
      }

      // Check if duplicate pending claim exists from same person
      const existing = db.prepare(`
        SELECT * FROM claims 
        WHERE itemId = ? AND status = 'PENDING' AND LOWER(claimantName) = LOWER(?)
      `).get(itemId, claimantName.trim()) as any;

      if (existing) {
        return res.json({
          success: true,
          message: 'A claim for this item is already pending staff verification.',
          data: {
            id: existing.id,
            itemId: existing.itemId,
            status: existing.status,
            createdAt: existing.createdAt,
          },
        });
      }

      const claimId = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO claims (id, itemId, claimantName, contact, privateDetails, status, createdAt)
        VALUES (?, ?, ?, ?, ?, 'PENDING', ?)
      `).run(claimId, itemId, claimantName.trim(), contact.trim(), privateDetails.trim(), now);

      // Update item status to CLAIM_PENDING in database
      updateItemStatus(itemId, 'CLAIM_PENDING');

      // Create notification
      const notif = createNotification(
        'claim_submitted',
        `Ownership Claim: Ref #${item.refCode}`,
        `Claim filed by ${claimantName.trim()}. Verification pending at Central Helpdesk Booth #4.`,
        itemId
      );

      // Emit Socket.IO event to room
      io.to('mavericks-fest-2026').emit('claim:created', {
        claimId,
        itemId,
        itemRefCode: item.refCode,
        status: 'CLAIM_PENDING',
        createdAt: now,
      });

      io.to('mavericks-fest-2026').emit('item:status_changed', {
        itemId,
        status: 'CLAIM_PENDING',
      });

      // Do NOT send private details back in the response
      res.status(201).json({
        success: true,
        message: 'Your claim request has been registered and is pending staff verification.',
        data: {
          id: claimId,
          itemId,
          itemRefCode: item.refCode,
          claimantName: claimantName.trim(),
          status: 'PENDING',
          createdAt: now,
        },
      });
    } catch (err: any) {
      console.error('Error creating claim:', err);
      res.status(500).json({ success: false, error: 'Failed to record claim' });
    }
  });

  // POST /api/staff/verify-pin
  router.post('/staff/verify-pin', (req: Request, res: Response) => {
    const { pin } = req.body;
    if (pin && String(pin).trim() === STAFF_PIN) {
      return res.json({ success: true, authorized: true });
    }
    return res.status(401).json({ success: false, authorized: false, error: 'Invalid Staff PIN' });
  });

  // GET /api/claims (Protected by x-staff-pin)
  router.get('/', (req: Request, res: Response) => {
    const pin = req.headers['x-staff-pin'] || req.query.pin;
    if (String(pin).trim() !== STAFF_PIN) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Valid staff PIN required to inspect claim records.',
      });
    }

    try {
      const rows = db.prepare(`
        SELECT c.*, f.itemName, f.referenceCode, f.category, f.location, f.foundDate
        FROM claims c
        JOIN found_items f ON c.itemId = f.id
        ORDER BY c.createdAt DESC
      `).all();

      res.json({ success: true, count: rows.length, data: rows });
    } catch (err: any) {
      console.error('Error fetching claims:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve claims' });
    }
  });

  // POST /api/claims/:id/review (Protected staff review)
  router.post('/:id/review', (req: Request, res: Response) => {
    const pin = req.headers['x-staff-pin'] || req.body.pin;
    if (String(pin).trim() !== STAFF_PIN) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Valid staff PIN required for verification actions.',
      });
    }

    const { action } = req.body; // 'APPROVE' | 'REJECT'
    const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(req.params.id) as any;
    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    const now = new Date().toISOString();
    const newClaimStatus = action === 'APPROVE' ? 'VERIFIED_RETURNED' : 'REJECTED';
    const newItemStatus = action === 'APPROVE' ? 'RETURNED' : 'IN_CUSTODY';

    db.prepare(`
      UPDATE claims SET status = ?, reviewedAt = ? WHERE id = ?
    `).run(newClaimStatus, now, req.params.id);

    updateItemStatus(claim.itemId, newItemStatus);

    // Notify connected clients via Socket.IO
    io.to('mavericks-fest-2026').emit('item:status_changed', {
      itemId: claim.itemId,
      status: newItemStatus,
    });

    io.to('mavericks-fest-2026').emit('claim:reviewed', {
      claimId: req.params.id,
      itemId: claim.itemId,
      claimStatus: newClaimStatus,
      itemStatus: newItemStatus,
    });

    res.json({
      success: true,
      data: {
        claimId: req.params.id,
        claimStatus: newClaimStatus,
        itemStatus: newItemStatus,
        reviewedAt: now,
      },
    });
  });

  return router;
}
