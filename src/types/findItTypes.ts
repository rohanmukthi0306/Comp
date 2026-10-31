/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ItemStatus = 'IN_CUSTODY' | 'CLAIM_PENDING' | 'RETURNED';

export type ItemCategory =
  | 'Electronics'
  | 'Bags'
  | 'Wallets'
  | 'ID Cards'
  | 'Clothing'
  | 'Books'
  | 'Accessories'
  | 'Other';

export interface ClaimRecord {
  id: string;
  itemId: string;
  itemRefCode: string;
  claimantName: string;
  contactInfo: string;
  privateDescription: string;
  status: 'CLAIM_PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string; // ISO string
}

export interface FoundItemReport {
  id: string;
  refCode: string; // e.g. FND-2026-0001
  eventId: string; // e.g. mavericks-2026
  title: string;
  category: ItemCategory;
  description: string;
  imageId: string | null; // ID in IndexedDB
  imageUrl?: string | null; // Data URL or Object URL for display
  foundLocation: string;
  foundDate: '2026-10-29' | '2026-10-30' | '2026-10-31' | string;
  foundTime: string;
  createdAt: string; // ISO string
  status: ItemStatus;
  custodyLocation: string;
  custodianName: string;
  isSampleDemo?: boolean;
  claims?: ClaimRecord[];
}

export interface FindItNotification {
  id: string;
  type: 'found_item' | 'claim' | 'status_change' | 'event' | 'schedule' | 'announcement';
  title: string;
  description: string;
  timestamp: string; // relative e.g. "Just now" or "25m ago"
  read: boolean;
  actionRoute?: string;
  targetId?: string;
  itemThumbnailUrl?: string | null;
  createdAt: string; // ISO string
}

export interface DateReportSummary {
  date: string;
  count: number;
  hasReports: boolean;
}
