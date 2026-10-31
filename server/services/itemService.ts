/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from '../database';

export interface FoundItemRow {
  id: string;
  referenceCode: string;
  eventId: string;
  itemName: string;
  category: string;
  description: string;
  location: string;
  foundDate: string;
  foundTime: string;
  imagePath: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function formatItemResponse(row: FoundItemRow) {
  return {
    id: row.id,
    refCode: row.referenceCode,
    eventId: row.eventId,
    title: row.itemName,
    category: row.category,
    description: row.description,
    foundLocation: row.location,
    foundDate: row.foundDate,
    foundTime: row.foundTime,
    imageId: null,
    imageUrl: row.imagePath ? `/uploads/items/${row.imagePath}` : null,
    status: row.status,
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer on Duty (Helpdesk #4)',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isSampleDemo: row.id.startsWith('seed-'),
  };
}

export function generateNextRefCode(): string {
  const rows = db.prepare('SELECT referenceCode FROM found_items').all() as { referenceCode: string }[];
  let maxNum = 0;
  for (const r of rows) {
    const match = r.referenceCode.match(/FND-2026-(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (!isNaN(n) && n > maxNum) {
        maxNum = n;
      }
    }
  }
  const next = maxNum + 1;
  return `FND-2026-${String(next).padStart(4, '0')}`;
}

export function getAllItems(date?: string) {
  let query = 'SELECT * FROM found_items';
  const params: string[] = [];

  if (date) {
    query += ' WHERE foundDate = ?';
    params.push(date);
  }

  query += ' ORDER BY createdAt DESC';

  const rows = db.prepare(query).all(...params) as FoundItemRow[];
  return rows.map(formatItemResponse);
}

export function getItemById(id: string) {
  const row = db.prepare('SELECT * FROM found_items WHERE id = ?').get(id) as FoundItemRow | undefined;
  if (!row) return null;
  return formatItemResponse(row);
}

export function createFoundItem(data: {
  itemName: string;
  category: string;
  description: string;
  location: string;
  foundDate: string;
  foundTime: string;
  imageFilename?: string | null;
}) {
  const id = `fnd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const refCode = generateNextRefCode();
  const now = new Date().toISOString();

  const insertItem = db.prepare(`
    INSERT INTO found_items (
      id, referenceCode, eventId, itemName, category, description,
      location, foundDate, foundTime, imagePath, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, type, title, description, itemId, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const notifTitle = `New Found Item: ${data.itemName.trim()}`;
  const notifDesc = `Reported at ${data.location.trim()}. In safe custody at Helpdesk #4. Ref #${refCode}.`;

  const tx = db.transaction(() => {
    insertItem.run(
      id,
      refCode,
      'mavericks-2026',
      data.itemName.trim(),
      data.category.trim(),
      data.description.trim(),
      data.location.trim(),
      data.foundDate.trim(),
      data.foundTime.trim() || '12:00 PM',
      data.imageFilename || null,
      'IN_CUSTODY',
      now,
      now
    );

    insertNotif.run(
      notifId,
      'found_item',
      notifTitle,
      notifDesc,
      id,
      now
    );
  });

  tx();

  const saved = getItemById(id);
  const notif = {
    id: notifId,
    type: 'found_item',
    title: notifTitle,
    description: notifDesc,
    itemId: id,
    actionRoute: 'item-details',
    targetId: id,
    itemThumbnailUrl: data.imageFilename ? `/uploads/items/${data.imageFilename}` : null,
    timestamp: 'Just now',
    read: false,
    createdAt: now,
  };

  return { item: saved!, notification: notif };
}

export function updateItemStatus(id: string, status: string) {
  const now = new Date().toISOString();
  db.prepare('UPDATE found_items SET status = ?, updatedAt = ? WHERE id = ?').run(status, now, id);
  return getItemById(id);
}
