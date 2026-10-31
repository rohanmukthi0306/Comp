/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IFindItRepository, CreateItemPayload, CreateClaimPayload } from './findItRepository';
import { FoundItemReport, ClaimRecord, FindItNotification } from '../types/findItTypes';
import { getSocket } from './realtimeSocket';

const READ_NOTIFS_STORAGE_KEY = 'findit_device_read_notifs_v1';

export class ApiFindItRepository implements IFindItRepository {
  private socket = getSocket();
  private subscribers: Set<() => void> = new Set();
  private cachedItems: FoundItemReport[] = [];
  private itemEventListeners: ((item: FoundItemReport, notif: FindItNotification) => void)[] = [];

  constructor() {
    this.initSocketListeners();
  }

  private initSocketListeners() {
    this.socket.on('item:created', (data: { item: FoundItemReport; notification: FindItNotification }) => {
      console.log('[Real-time] Received item:created from server:', data.item.refCode);
      // Prepend if not already cached
      if (!this.cachedItems.some((i) => i.id === data.item.id)) {
        this.cachedItems = [data.item, ...this.cachedItems];
      }
      this.itemEventListeners.forEach((cb) => cb(data.item, data.notification));
      this.notifySubscribers();
    });

    this.socket.on('claim:created', (data: { itemId: string; status: string }) => {
      console.log('[Real-time] Received claim:created for item:', data.itemId);
      this.cachedItems = this.cachedItems.map((i) =>
        i.id === data.itemId ? { ...i, status: 'CLAIM_PENDING' as any } : i
      );
      this.notifySubscribers();
    });

    this.socket.on('item:status_changed', (data: { itemId: string; status: string }) => {
      console.log('[Real-time] Received item:status_changed for item:', data.itemId, data.status);
      this.cachedItems = this.cachedItems.map((i) =>
        i.id === data.itemId ? { ...i, status: data.status as any } : i
      );
      this.notifySubscribers();
    });
  }

  async init(): Promise<void> {
    // Initial fetch to prime cache
    await this.getFoundItems();
  }

  private notifySubscribers() {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Subscriber notification error:', err);
      }
    });
  }

  private getDeviceReadNotifIds(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
      const data = localStorage.getItem(READ_NOTIFS_STORAGE_KEY);
      return data ? new Set(JSON.parse(data)) : new Set();
    } catch {
      return new Set();
    }
  }

  private setDeviceReadNotifIds(ids: Set<string>) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch (e) {
      console.error('Failed to save read notifications locally:', e);
    }
  }

  async getFoundItems(): Promise<FoundItemReport[]> {
    try {
      const res = await fetch('/api/items');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.cachedItems = json.data;
        return this.cachedItems;
      }
      return this.cachedItems;
    } catch (err) {
      console.warn('Failed to fetch items from server, using cached:', err);
      return this.cachedItems;
    }
  }

  async getFoundItemsByDate(date: string): Promise<FoundItemReport[]> {
    try {
      const res = await fetch(`/api/items?date=${encodeURIComponent(date)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
      return this.cachedItems.filter((i) => i.foundDate === date);
    } catch {
      return this.cachedItems.filter((i) => i.foundDate === date);
    }
  }

  async getFoundItemById(id: string): Promise<FoundItemReport | null> {
    try {
      const res = await fetch(`/api/items/${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
      return this.cachedItems.find((i) => i.id === id) || null;
    } catch {
      return this.cachedItems.find((i) => i.id === id) || null;
    }
  }

  async addFoundItem(payload: CreateItemPayload): Promise<FoundItemReport> {
    const formData = new FormData();
    formData.append('itemName', payload.title.trim());
    formData.append('category', payload.category);
    formData.append('description', payload.description.trim());
    formData.append('location', payload.foundLocation.trim());
    formData.append('foundDate', payload.foundDate);
    formData.append('foundTime', payload.foundTime.trim());

    if (payload.imageFileOrData) {
      const img = payload.imageFileOrData;
      if (typeof img === 'object' && img !== null && img instanceof Blob) {
        formData.append('photo', img, 'item_photo.jpg');
      } else if (typeof img === 'string' && img.startsWith('data:')) {
        // Convert data URL to Blob
        try {
          const res = await fetch(img);
          const blob = await res.blob();
          formData.append('photo', blob, 'item_photo.jpg');
        } catch {
          // If conversion fails, continue without blocking
        }
      }
    }

    const res = await fetch('/api/items', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || 'Failed to submit report to server');
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error('Invalid server response');
    }

    const created: FoundItemReport = json.data;

    // Deduplicate in cache
    if (!this.cachedItems.some((i) => i.id === created.id)) {
      this.cachedItems = [created, ...this.cachedItems];
    }

    this.notifySubscribers();
    return created;
  }

  async addClaim(payload: CreateClaimPayload): Promise<ClaimRecord> {
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId: payload.itemId,
        claimantName: payload.claimantName,
        contact: payload.contactInfo,
        privateDetails: payload.privateDescription,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || 'Failed to submit claim');
    }

    const json = await res.json();
    const claimData: ClaimRecord = {
      id: json.data?.id || `claim_${Date.now()}`,
      itemId: payload.itemId,
      itemRefCode: payload.itemRefCode,
      claimantName: payload.claimantName,
      contactInfo: payload.contactInfo,
      privateDescription: payload.privateDescription,
      status: 'CLAIM_PENDING',
      createdAt: json.data?.createdAt || new Date().toISOString(),
    };

    // Update item status in cache
    this.cachedItems = this.cachedItems.map((i) =>
      i.id === payload.itemId ? { ...i, status: 'CLAIM_PENDING' as any } : i
    );

    this.notifySubscribers();
    return claimData;
  }

  async getClaims(_itemId?: string): Promise<ClaimRecord[]> {
    // Ordinary public client does not retrieve all private claims
    return [];
  }

  async getNotifications(): Promise<FindItNotification[]> {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const readIds = this.getDeviceReadNotifIds();
        return json.data.map((n: FindItNotification) => ({
          ...n,
          read: readIds.has(n.id),
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  async addNotification(_notif: Omit<FindItNotification, 'id' | 'createdAt'>): Promise<FindItNotification> {
    // Notifications are created server-side upon item or claim creation
    const dummy: FindItNotification = {
      id: `notif_${Date.now()}`,
      type: 'found_item',
      title: 'Alert',
      description: '',
      timestamp: 'Just now',
      read: false,
      createdAt: new Date().toISOString(),
    };
    return dummy;
  }

  async markNotificationRead(id: string): Promise<void> {
    const readIds = this.getDeviceReadNotifIds();
    readIds.add(id);
    this.setDeviceReadNotifIds(readIds);
    this.notifySubscribers();
  }

  async markAllNotificationsRead(): Promise<void> {
    const notifs = await this.getNotifications();
    const readIds = this.getDeviceReadNotifIds();
    notifs.forEach((n) => readIds.add(n.id));
    this.setDeviceReadNotifIds(readIds);
    this.notifySubscribers();
  }

  subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  onItemCreated(callback: (item: FoundItemReport, notif: FindItNotification) => void): () => void {
    this.itemEventListeners.push(callback);
    return () => {
      this.itemEventListeners = this.itemEventListeners.filter((cb) => cb !== callback);
    };
  }
}

export const apiFindItRepository = new ApiFindItRepository();
