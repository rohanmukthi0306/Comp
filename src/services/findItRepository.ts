/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoundItemReport, ClaimRecord, FindItNotification } from '../types/findItTypes';

export interface CreateItemPayload {
  title: string;
  category: FoundItemReport['category'];
  description: string;
  foundLocation: string;
  foundDate: string;
  foundTime: string;
  imageFileOrData?: File | string | null;
  custodyLocation?: string;
  custodianName?: string;
}

export interface CreateClaimPayload {
  itemId: string;
  itemRefCode: string;
  claimantName: string;
  contactInfo: string;
  privateDescription: string;
}

export interface IFindItRepository {
  init(): Promise<void>;
  getFoundItems(): Promise<FoundItemReport[]>;
  getFoundItemsByDate(date: string): Promise<FoundItemReport[]>;
  getFoundItemById(id: string): Promise<FoundItemReport | null>;
  addFoundItem(payload: CreateItemPayload): Promise<FoundItemReport>;
  addClaim(payload: CreateClaimPayload): Promise<ClaimRecord>;
  getClaims(itemId?: string): Promise<ClaimRecord[]>;
  getNotifications(): Promise<FindItNotification[]>;
  addNotification(notif: Omit<FindItNotification, 'id' | 'createdAt'>): Promise<FindItNotification>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
  subscribe(listener: () => void): () => void;
}
