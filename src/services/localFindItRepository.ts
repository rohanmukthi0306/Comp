/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { IFindItRepository, CreateItemPayload, CreateClaimPayload } from './findItRepository';
export type { CreateItemPayload, CreateClaimPayload };
import { FoundItemReport, ClaimRecord, FindItNotification } from '../types/findItTypes';
import { saveImageToStorage, getImageFromStorage } from './imageStorage';

const ITEMS_STORAGE_KEY = 'campushub_findit_items_v2';
const CLAIMS_STORAGE_KEY = 'campushub_findit_claims_v2';
const NOTIFS_STORAGE_KEY = 'campushub_findit_notifs_v2';
const SYNC_CHANNEL_NAME = 'campushub_findit_sync';

// Initial seed demonstration items (explicitly marked with isSampleDemo: true)
const SEED_FOUND_ITEMS: FoundItemReport[] = [
  {
    id: 'seed-fnd-1',
    refCode: 'FND-2026-0001',
    eventId: 'mavericks-2026',
    title: 'Space Grey MacBook Air M2 in Felt Sleeve',
    category: 'Electronics',
    description: '13-inch MacBook Air with a small silver NASA sticker on the top right lid. Stored inside a dark charcoal wool-felt zipper sleeve with a USB-C charger in the outer pocket.',
    imageId: null,
    imageUrl: null,
    foundLocation: 'North Quad',
    foundDate: '2026-10-30',
    foundTime: '11:30 AM',
    createdAt: '2026-10-30T11:30:00.000Z',
    status: 'IN_CUSTODY',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer M. Henderson (Campus Security)',
    isSampleDemo: true,
  },
  {
    id: 'seed-fnd-2',
    refCode: 'FND-2026-0002',
    eventId: 'mavericks-2026',
    title: 'AirPods Pro Gen 2 with Leather Carabiner Case',
    category: 'Electronics',
    description: 'White wireless charging case housed inside a saddle-brown genuine leather protective cover with an antiqued brass mini carabiner clip. Clean condition.',
    imageId: null,
    imageUrl: null,
    foundLocation: 'Main Auditorium',
    foundDate: '2026-10-30',
    foundTime: '02:15 PM',
    createdAt: '2026-10-30T14:15:00.000Z',
    status: 'IN_CUSTODY',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Vol. Priya Sharma (Student Council)',
    isSampleDemo: true,
  },
  {
    id: 'seed-fnd-3',
    refCode: 'FND-2026-0003',
    eventId: 'mavericks-2026',
    title: 'University Student Smart ID Card (Julian Drake)',
    category: 'ID Cards',
    description: 'Official University RFID smart card belonging to student Julian Drake (Computer Science Dept, Class of 2027). Attached to a green Mavericks Fest lanyard.',
    imageId: null,
    imageUrl: null,
    foundLocation: 'Food Court',
    foundDate: '2026-10-29',
    foundTime: '01:40 PM',
    createdAt: '2026-10-29T13:40:00.000Z',
    status: 'IN_CUSTODY',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer R. Chen (Student Helpdesk)',
    isSampleDemo: true,
  },
  {
    id: 'seed-fnd-4',
    refCode: 'FND-2026-0004',
    eventId: 'mavericks-2026',
    title: 'Tan Minimalist Leather Bifold Wallet',
    category: 'Wallets',
    description: 'Vegetable-tanned full-grain leather wallet with initials "E.K." subtly debossed on the bottom corner. Contains student transit cards.',
    imageId: null,
    imageUrl: null,
    foundLocation: 'Registration Desk',
    foundDate: '2026-10-30',
    foundTime: '04:00 PM',
    createdAt: '2026-10-30T16:00:00.000Z',
    status: 'IN_CUSTODY',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Vol. David K. (Event Staff)',
    isSampleDemo: true,
  },
  {
    id: 'seed-fnd-5',
    refCode: 'FND-2026-0005',
    eventId: 'mavericks-2026',
    title: 'TI-84 Plus CE Color Graphing Calculator',
    category: 'Electronics',
    description: 'Black Texas Instruments graphing calculator with blue slide cover. Holographic sticker on battery back.',
    imageId: null,
    imageUrl: null,
    foundLocation: 'Exhibition Hall',
    foundDate: '2026-10-29',
    foundTime: '10:15 AM',
    createdAt: '2026-10-29T10:15:00.000Z',
    status: 'IN_CUSTODY',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer M. Henderson (Campus Security)',
    isSampleDemo: true,
  },
  {
    id: 'seed-fnd-6',
    refCode: 'FND-2026-0006',
    eventId: 'mavericks-2026',
    title: 'Navy Blue Collegiate Windbreaker (Size L)',
    category: 'Clothing',
    description: 'Water-resistant hooded jacket with embroidered white university crest on the chest. Kept neatly folded in custody vault.',
    imageId: null,
    imageUrl: null,
    foundLocation: 'Sports Ground',
    foundDate: '2026-10-31',
    foundTime: '03:30 PM',
    createdAt: '2026-10-31T15:30:00.000Z',
    status: 'IN_CUSTODY',
    custodyLocation: 'Central Helpdesk Booth #4, North Quad',
    custodianName: 'Officer T. Vance (Sports Desk)',
    isSampleDemo: true,
  },
];

const SEED_NOTIFICATIONS: FindItNotification[] = [
  {
    id: 'notif-seed-1',
    type: 'found_item',
    title: 'New Found Item Logged: AirPods Pro',
    description: 'Turned in at Main Auditorium. Stored at Central Helpdesk Booth #4. Does this belong to you?',
    timestamp: '25m ago',
    read: false,
    actionRoute: 'item-details',
    targetId: 'seed-fnd-2',
    createdAt: '2026-10-30T14:20:00.000Z',
  },
  {
    id: 'notif-seed-2',
    type: 'found_item',
    title: 'MacBook Air Cataloged at Helpdesk #4',
    description: 'Found at North Quad. Stored under reference #FND-2026-0001.',
    timestamp: '2h ago',
    read: true,
    actionRoute: 'item-details',
    targetId: 'seed-fnd-1',
    createdAt: '2026-10-30T11:45:00.000Z',
  },
  {
    id: 'notif-seed-3',
    type: 'announcement',
    title: 'Robotics Derby Kickoff in 45 Minutes',
    description: 'Autonomous Systems trials starting at the Engineering Lawn Quad.',
    timestamp: '3h ago',
    read: true,
    actionRoute: 'calendar',
    createdAt: '2026-10-30T09:00:00.000Z',
  },
];

export class LocalFindItRepository implements IFindItRepository {
  private syncChannel: BroadcastChannel | null = null;
  private subscribers: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        this.syncChannel.onmessage = () => {
          this.notifySubscribers();
        };
      } catch (err) {
        console.warn('BroadcastChannel error, using storage events:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (
          e.key === ITEMS_STORAGE_KEY ||
          e.key === CLAIMS_STORAGE_KEY ||
          e.key === NOTIFS_STORAGE_KEY
        ) {
          this.notifySubscribers();
        }
      });
    }
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    if (typeof window !== 'undefined') {
      // Check if items already exist in localStorage
      const existingItems = localStorage.getItem(ITEMS_STORAGE_KEY);
      if (!existingItems) {
        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(SEED_FOUND_ITEMS));
      }

      // Check if notifications already exist
      const existingNotifs = localStorage.getItem(NOTIFS_STORAGE_KEY);
      if (!existingNotifs) {
        localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      }

      // Claims
      const existingClaims = localStorage.getItem(CLAIMS_STORAGE_KEY);
      if (!existingClaims) {
        localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify([]));
      }
    }

    this.initialized = true;
  }

  private notifySubscribers() {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Subscriber notification failed:', e);
      }
    });
  }

  private broadcastChange() {
    this.notifySubscribers();
    if (this.syncChannel) {
      try {
        this.syncChannel.postMessage({ type: 'MUTATION', timestamp: Date.now() });
      } catch {
        // Ignore broadcast errors
      }
    }
  }

  private getStoredItems(): FoundItemReport[] {
    if (typeof window === 'undefined') return SEED_FOUND_ITEMS;
    try {
      const data = localStorage.getItem(ITEMS_STORAGE_KEY);
      return data ? JSON.parse(data) : SEED_FOUND_ITEMS;
    } catch {
      return SEED_FOUND_ITEMS;
    }
  }

  private saveStoredItems(items: FoundItemReport[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items to localStorage:', e);
    }
  }

  private getStoredClaims(): ClaimRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(CLAIMS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredClaims(claims: ClaimRecord[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed to save claims to localStorage:', e);
    }
  }

  private getStoredNotifs(): FindItNotification[] {
    if (typeof window === 'undefined') return SEED_NOTIFICATIONS;
    try {
      const data = localStorage.getItem(NOTIFS_STORAGE_KEY);
      return data ? JSON.parse(data) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  }

  private saveStoredNotifs(notifs: FindItNotification[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifs));
    } catch (e) {
      console.error('Failed to save notifications to localStorage:', e);
    }
  }

  private generateNextRefCode(existingItems: FoundItemReport[]): string {
    let maxNum = 0;
    existingItems.forEach((item) => {
      const match = item.refCode.match(/FND-2026-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n) && n > maxNum) {
          maxNum = n;
        }
      }
    });
    const nextNum = maxNum + 1;
    return `FND-2026-${String(nextNum).padStart(4, '0')}`;
  }

  async getFoundItems(): Promise<FoundItemReport[]> {
    await this.init();
    const items = this.getStoredItems();
    const claims = this.getStoredClaims();

    // Attach claims and load images from IndexedDB asynchronously where applicable
    const enriched = await Promise.all(
      items.map(async (item) => {
        let imageUrl = item.imageUrl || null;
        if (!imageUrl && item.imageId) {
          imageUrl = await getImageFromStorage(item.imageId);
        }
        const itemClaims = claims.filter((c) => c.itemId === item.id);
        return {
          ...item,
          imageUrl,
          claims: itemClaims,
        };
      })
    );

    return enriched;
  }

  async getFoundItemsByDate(date: string): Promise<FoundItemReport[]> {
    const all = await this.getFoundItems();
    return all.filter((item) => item.foundDate === date);
  }

  async getFoundItemById(id: string): Promise<FoundItemReport | null> {
    const all = await this.getFoundItems();
    return all.find((item) => item.id === id) || null;
  }

  async addFoundItem(payload: CreateItemPayload): Promise<FoundItemReport> {
    await this.init();
    const items = this.getStoredItems();

    let imageId: string | null = null;
    let imageUrl: string | null = null;

    if (payload.imageFileOrData) {
      try {
        imageId = await saveImageToStorage(payload.imageFileOrData);
        // Also obtain data URL for direct instant preview
        if (typeof payload.imageFileOrData === 'string' && payload.imageFileOrData.startsWith('data:')) {
          imageUrl = payload.imageFileOrData;
        } else {
          imageUrl = await getImageFromStorage(imageId);
        }
      } catch (err) {
        console.warn('Image storage failed during addFoundItem:', err);
      }
    }

    const newId = `fnd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const refCode = this.generateNextRefCode(items);

    const newItem: FoundItemReport = {
      id: newId,
      refCode,
      eventId: 'mavericks-2026',
      title: payload.title.trim(),
      category: payload.category,
      description: payload.description.trim(),
      imageId,
      imageUrl,
      foundLocation: payload.foundLocation.trim(),
      foundDate: payload.foundDate,
      foundTime: payload.foundTime.trim() || '12:00 PM',
      createdAt: new Date().toISOString(),
      status: 'IN_CUSTODY',
      custodyLocation: payload.custodyLocation || 'Central Helpdesk Booth #4, North Quad',
      custodianName: payload.custodianName || 'Campus Staff Officer',
      isSampleDemo: false, // Mark as real user-submitted report!
      claims: [],
    };

    // Prepend to items list so newest item is at the top
    const updated = [newItem, ...items];
    this.saveStoredItems(updated);

    // Generate in-app notification
    const newNotif: FindItNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'found_item',
      title: `New Found Item: ${newItem.title}`,
      description: `Reported at ${newItem.foundLocation}. In safe custody at Helpdesk #4. Ref #${newItem.refCode}.`,
      timestamp: 'Just now',
      read: false,
      actionRoute: 'item-details',
      targetId: newItem.id,
      itemThumbnailUrl: imageUrl,
      createdAt: new Date().toISOString(),
    };

    const notifs = this.getStoredNotifs();
    this.saveStoredNotifs([newNotif, ...notifs]);

    this.broadcastChange();
    return newItem;
  }

  async addClaim(payload: CreateClaimPayload): Promise<ClaimRecord> {
    await this.init();
    const claims = this.getStoredClaims();

    // Check duplicate pending claims for same item from same claimant in current session
    const existingPending = claims.find(
      (c) =>
        c.itemId === payload.itemId &&
        c.status === 'CLAIM_PENDING' &&
        c.claimantName.toLowerCase() === payload.claimantName.toLowerCase()
    );

    if (existingPending) {
      return existingPending;
    }

    const claimId = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newClaim: ClaimRecord = {
      id: claimId,
      itemId: payload.itemId,
      itemRefCode: payload.itemRefCode,
      claimantName: payload.claimantName.trim(),
      contactInfo: payload.contactInfo.trim(),
      privateDescription: payload.privateDescription.trim(),
      status: 'CLAIM_PENDING',
      createdAt: new Date().toISOString(),
    };

    this.saveStoredClaims([newClaim, ...claims]);

    // Update item status to CLAIM_PENDING in storage
    const items = this.getStoredItems();
    const itemIndex = items.findIndex((i) => i.id === payload.itemId);
    if (itemIndex !== -1) {
      items[itemIndex].status = 'CLAIM_PENDING';
      this.saveStoredItems(items);
    }

    // Create a notification for the claim
    const newNotif: FindItNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'claim',
      title: `Claim Filed for ${payload.itemRefCode}`,
      description: `Ownership claim filed by ${payload.claimantName}. Verification pending at Helpdesk #4.`,
      timestamp: 'Just now',
      read: false,
      actionRoute: 'item-details',
      targetId: payload.itemId,
      createdAt: new Date().toISOString(),
    };

    const notifs = this.getStoredNotifs();
    this.saveStoredNotifs([newNotif, ...notifs]);

    this.broadcastChange();
    return newClaim;
  }

  async getClaims(itemId?: string): Promise<ClaimRecord[]> {
    await this.init();
    const claims = this.getStoredClaims();
    if (itemId) {
      return claims.filter((c) => c.itemId === itemId);
    }
    return claims;
  }

  async getNotifications(): Promise<FindItNotification[]> {
    await this.init();
    return this.getStoredNotifs();
  }

  async addNotification(notif: Omit<FindItNotification, 'id' | 'createdAt'>): Promise<FindItNotification> {
    await this.init();
    const notifs = this.getStoredNotifs();
    const created: FindItNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.saveStoredNotifs([created, ...notifs]);
    this.broadcastChange();
    return created;
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.init();
    const notifs = this.getStoredNotifs();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveStoredNotifs(updated);
    this.broadcastChange();
  }

  async markAllNotificationsRead(): Promise<void> {
    await this.init();
    const notifs = this.getStoredNotifs();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    this.saveStoredNotifs(updated);
    this.broadcastChange();
  }

  subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }
}

// Singleton repository instance
export const findItRepository = new LocalFindItRepository();
