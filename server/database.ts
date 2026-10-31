/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'findit.sqlite');
export const db = new Database(dbPath);

// Enable WAL mode for concurrent performance
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // Create tables if not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS found_items (
      id TEXT PRIMARY KEY,
      referenceCode TEXT UNIQUE NOT NULL,
      eventId TEXT NOT NULL DEFAULT 'mavericks-2026',
      itemName TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      foundDate TEXT NOT NULL,
      foundTime TEXT NOT NULL,
      imagePath TEXT,
      status TEXT NOT NULL DEFAULT 'IN_CUSTODY',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS claims (
      id TEXT PRIMARY KEY,
      itemId TEXT NOT NULL,
      claimantName TEXT NOT NULL,
      contact TEXT NOT NULL,
      privateDetails TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      createdAt TEXT NOT NULL,
      reviewedAt TEXT,
      FOREIGN KEY (itemId) REFERENCES found_items(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      itemId TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed initial demo items if found_items table is empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM found_items').get() as { count: number };
  if (countRow.count === 0) {
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

    const seedItems = [
      {
        id: 'seed-fnd-1',
        referenceCode: 'FND-2026-0001',
        eventId: 'mavericks-2026',
        itemName: 'Space Grey MacBook Air M2 in Felt Sleeve',
        category: 'Electronics',
        description: '13-inch MacBook Air with a small silver NASA sticker on the top right lid. Stored inside a dark charcoal wool-felt zipper sleeve.',
        location: 'North Quad',
        foundDate: '2026-10-30',
        foundTime: '11:30 AM',
        imagePath: null,
        status: 'IN_CUSTODY',
        createdAt: '2026-10-30T11:30:00.000Z',
        updatedAt: '2026-10-30T11:30:00.000Z',
      },
      {
        id: 'seed-fnd-2',
        referenceCode: 'FND-2026-0002',
        eventId: 'mavericks-2026',
        itemName: 'AirPods Pro Gen 2 with Leather Carabiner Case',
        category: 'Electronics',
        description: 'White wireless charging case housed inside a saddle-brown genuine leather protective cover with an antiqued brass mini carabiner clip.',
        location: 'Main Auditorium',
        foundDate: '2026-10-30',
        foundTime: '02:15 PM',
        imagePath: null,
        status: 'IN_CUSTODY',
        createdAt: '2026-10-30T14:15:00.000Z',
        updatedAt: '2026-10-30T14:15:00.000Z',
      },
      {
        id: 'seed-fnd-3',
        referenceCode: 'FND-2026-0003',
        eventId: 'mavericks-2026',
        itemName: 'University Student Smart ID Card (Julian Drake)',
        category: 'ID Cards',
        description: 'Official University RFID smart card belonging to student Julian Drake (Computer Science Dept, Class of 2027). Attached to a green Mavericks Fest lanyard.',
        location: 'Food Court',
        foundDate: '2026-10-29',
        foundTime: '01:40 PM',
        imagePath: null,
        status: 'IN_CUSTODY',
        createdAt: '2026-10-29T13:40:00.000Z',
        updatedAt: '2026-10-29T13:40:00.000Z',
      },
      {
        id: 'seed-fnd-4',
        referenceCode: 'FND-2026-0004',
        eventId: 'mavericks-2026',
        itemName: 'Tan Minimalist Leather Bifold Wallet',
        category: 'Wallets',
        description: 'Vegetable-tanned full-grain leather wallet with initials "E.K." subtly debossed on the bottom corner. Contains transit pass.',
        location: 'Registration Desk',
        foundDate: '2026-10-30',
        foundTime: '04:00 PM',
        imagePath: null,
        status: 'IN_CUSTODY',
        createdAt: '2026-10-30T16:00:00.000Z',
        updatedAt: '2026-10-30T16:00:00.000Z',
      },
      {
        id: 'seed-fnd-5',
        referenceCode: 'FND-2026-0005',
        eventId: 'mavericks-2026',
        itemName: 'TI-84 Plus CE Color Graphing Calculator',
        category: 'Electronics',
        description: 'Black Texas Instruments graphing calculator with blue slide cover. Holographic geometric sticker on battery plate.',
        location: 'Exhibition Hall',
        foundDate: '2026-10-29',
        foundTime: '10:15 AM',
        imagePath: null,
        status: 'IN_CUSTODY',
        createdAt: '2026-10-29T10:15:00.000Z',
        updatedAt: '2026-10-29T10:15:00.000Z',
      },
      {
        id: 'seed-fnd-6',
        referenceCode: 'FND-2026-0006',
        eventId: 'mavericks-2026',
        itemName: 'Navy Blue Collegiate Windbreaker (Size L)',
        category: 'Clothing',
        description: 'Water-resistant hooded jacket with embroidered white university crest on the chest. Kept neatly in vault.',
        location: 'Sports Ground',
        foundDate: '2026-10-31',
        foundTime: '03:30 PM',
        imagePath: null,
        status: 'IN_CUSTODY',
        createdAt: '2026-10-31T15:30:00.000Z',
        updatedAt: '2026-10-31T15:30:00.000Z',
      },
    ];

    const insertTx = db.transaction(() => {
      for (const item of seedItems) {
        insertItem.run(
          item.id, item.referenceCode, item.eventId, item.itemName,
          item.category, item.description, item.location, item.foundDate,
          item.foundTime, item.imagePath, item.status, item.createdAt, item.updatedAt
        );
      }

      insertNotif.run(
        'seed-notif-1',
        'found_item',
        'New Found Item Logged: AirPods Pro',
        'Turned in at Main Auditorium. Stored at Central Helpdesk Booth #4. Does this belong to you?',
        'seed-fnd-2',
        '2026-10-30T14:20:00.000Z'
      );

      insertNotif.run(
        'seed-notif-2',
        'found_item',
        'MacBook Air Cataloged at Helpdesk #4',
        'Found at North Quad. Stored under reference #FND-2026-0001.',
        'seed-fnd-1',
        '2026-10-30T11:45:00.000Z'
      );
    });

    insertTx();
    console.log('[SQLite] Seeded initial demonstration records.');
  }
}
