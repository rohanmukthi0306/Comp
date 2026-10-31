/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { FoundItemReport, ClaimRecord, FindItNotification } from '../types/findItTypes';
import { apiFindItRepository } from '../services/apiFindItRepository';
import { CreateItemPayload, CreateClaimPayload } from '../services/findItRepository';

interface FindItContextValue {
  items: FoundItemReport[];
  loading: boolean;
  notifications: FindItNotification[];
  unreadNotifsCount: number;
  dateReportCounts: Record<string, number>;
  latestFoundNotification: FindItNotification | null;
  addFoundItem: (payload: CreateItemPayload) => Promise<FoundItemReport>;
  submitClaim: (payload: CreateClaimPayload) => Promise<ClaimRecord>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  getItemById: (id: string) => FoundItemReport | undefined;
  refreshData: () => Promise<void>;
  reviewStaffClaim?: (claimId: string, action: 'APPROVE' | 'REJECT', pin: string) => Promise<boolean>;
}

const FindItContext = createContext<FindItContextValue | undefined>(undefined);

export const FindItProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FoundItemReport[]>([]);
  const [notifications, setNotifications] = useState<FindItNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [fetchedItems, fetchedNotifs] = await Promise.all([
        apiFindItRepository.getFoundItems(),
        apiFindItRepository.getNotifications(),
      ]);

      // Deduplicate items by ID
      const uniqueItemsMap = new Map<string, FoundItemReport>();
      fetchedItems.forEach((item) => {
        uniqueItemsMap.set(item.id, item);
      });

      setItems(Array.from(uniqueItemsMap.values()));
      setNotifications(fetchedNotifs);
    } catch (err) {
      console.error('Failed to load FindIt data from server:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Subscribe to Socket.IO real-time events from server
    const unsubscribe = apiFindItRepository.subscribe(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  const dateReportCounts = useMemo(() => {
    const counts: Record<string, number> = {
      '2026-10-29': 0,
      '2026-10-30': 0,
      '2026-10-31': 0,
    };
    items.forEach((item) => {
      if (item.foundDate in counts) {
        counts[item.foundDate] = (counts[item.foundDate] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const latestFoundNotification = useMemo(() => {
    const foundNotifs = notifications.filter((n) => n.type === 'found_item');
    return foundNotifs.length > 0 ? foundNotifs[0] : null;
  }, [notifications]);

  const addFoundItem = useCallback(
    async (payload: CreateItemPayload): Promise<FoundItemReport> => {
      const created = await apiFindItRepository.addFoundItem(payload);
      await loadData();
      return created;
    },
    [loadData]
  );

  const submitClaim = useCallback(
    async (payload: CreateClaimPayload): Promise<ClaimRecord> => {
      const claim = await apiFindItRepository.addClaim(payload);
      await loadData();
      return claim;
    },
    [loadData]
  );

  const markNotificationRead = useCallback(
    async (id: string): Promise<void> => {
      await apiFindItRepository.markNotificationRead(id);
      await loadData();
    },
    [loadData]
  );

  const markAllNotificationsRead = useCallback(async (): Promise<void> => {
    await apiFindItRepository.markAllNotificationsRead();
    await loadData();
  }, [loadData]);

  const getItemById = useCallback(
    (id: string): FoundItemReport | undefined => {
      return items.find((i) => i.id === id);
    },
    [items]
  );

  const reviewStaffClaim = useCallback(
    async (claimId: string, action: 'APPROVE' | 'REJECT', pin: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/claims/${encodeURIComponent(claimId)}/review`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-staff-pin': pin,
          },
          body: JSON.stringify({ action }),
        });
        const json = await res.json();
        if (json.success) {
          await loadData();
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to review claim:', err);
        return false;
      }
    },
    [loadData]
  );

  return (
    <FindItContext.Provider
      value={{
        items,
        loading,
        notifications,
        unreadNotifsCount,
        dateReportCounts,
        latestFoundNotification,
        addFoundItem,
        submitClaim,
        markNotificationRead,
        markAllNotificationsRead,
        getItemById,
        refreshData: loadData,
        reviewStaffClaim,
      }}
    >
      {children}
    </FindItContext.Provider>
  );
};

export const useFindIt = (): FindItContextValue => {
  const context = useContext(FindItContext);
  if (!context) {
    throw new Error('useFindIt must be used within a FindItProvider');
  }
  return context;
};
