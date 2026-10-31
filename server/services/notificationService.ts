/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from '../database';

export interface NotificationRow {
  id: string;
  type: string;
  title: string;
  description: string;
  itemId: string | null;
  createdAt: string;
}

export function getAllNotifications() {
  const rows = db.prepare(`
    SELECT n.*, f.imagePath as itemImagePath 
    FROM notifications n
    LEFT JOIN found_items f ON n.itemId = f.id
    ORDER BY n.createdAt DESC
  `).all() as (NotificationRow & { itemImagePath: string | null })[];

  return rows.map((r) => {
    // Relative human-friendly timestamp
    const diffMs = Date.now() - new Date(r.createdAt).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    let timeLabel = 'Just now';
    if (diffMins >= 60) {
      const diffHrs = Math.floor(diffMins / 60);
      timeLabel = `${diffHrs}h ago`;
    } else if (diffMins > 0) {
      timeLabel = `${diffMins}m ago`;
    }

    return {
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.description,
      timestamp: timeLabel,
      read: false,
      actionRoute: r.itemId ? 'item-details' : 'notifications',
      targetId: r.itemId || undefined,
      itemThumbnailUrl: r.itemImagePath ? `/uploads/items/${r.itemImagePath}` : null,
      createdAt: r.createdAt,
    };
  });
}

export function createNotification(type: string, title: string, description: string, itemId?: string) {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO notifications (id, type, title, description, itemId, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, type, title, description, itemId || null, now);

  return {
    id,
    type,
    title,
    description,
    timestamp: 'Just now',
    read: false,
    actionRoute: itemId ? 'item-details' : 'notifications',
    targetId: itemId || undefined,
    itemThumbnailUrl: null,
    createdAt: now,
  };
}
