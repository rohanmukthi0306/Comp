import React, { useState } from 'react';
import { Bell, CheckCheck, Package, Sparkles, Calendar, ChevronRight, UserCheck } from 'lucide-react';
import { useFindIt } from '../context/FindItContext';
import { FindItNotification } from '../types/findItTypes';

interface NotificationsProps {
  onNavigate: (route: string, id?: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const { notifications, unreadNotifsCount, markNotificationRead, markAllNotificationsRead } = useFindIt();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleNotificationClick = async (notif: FindItNotification) => {
    if (!notif.read) {
      await markNotificationRead(notif.id);
    }
    if (notif.actionRoute) {
      onNavigate(notif.actionRoute, notif.targetId);
    }
  };

  const getIcon = (type: FindItNotification['type']) => {
    switch (type) {
      case 'found_item':
        return <Package className="w-4 h-4 text-[#167C61]" />;
      case 'claim':
        return <UserCheck className="w-4 h-4 text-[#167C61]" />;
      case 'event':
      case 'announcement':
        return <Sparkles className="w-4 h-4 text-[#E9A34A]" />;
      default:
        return <Calendar className="w-4 h-4 text-[#167C61]" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
            <span>Festival Feed</span>
            <span>·</span>
            <span>Live Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight mt-1">
            Notifications
          </h1>
          <p className="text-sm text-[#78827D] mt-0.5">
            Real-time updates for reported belongings, claim statuses, and festival notices.
          </p>
        </div>

        {unreadNotifsCount > 0 && (
          <button
            type="button"
            onClick={() => markAllNotificationsRead()}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-semibold text-[#167C61] hover:bg-[#F7F8F6] flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#167C61] text-white shadow-xs'
              : 'bg-white text-[#78827D] hover:bg-[#F7F8F6] border border-[#E8ECE9]'
          }`}
        >
          All Activity ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#167C61] text-white shadow-xs'
              : 'bg-white text-[#78827D] hover:bg-[#F7F8F6] border border-[#E8ECE9]'
          }`}
        >
          Unread ({unreadNotifsCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#E8ECE9] shadow-xs space-y-2">
            <Bell className="w-8 h-8 text-[#78827D] mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-[#17211D]">No notifications to display</h3>
            <p className="text-xs text-[#78827D]">
              {filter === 'unread'
                ? 'You are all caught up with your notifications.'
                : 'Any new found item reports or claim alerts will appear here.'}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                !item.read
                  ? 'bg-white border-[#167C61]/40 shadow-xs ring-1 ring-[#167C61]/10'
                  : 'bg-[#F7F8F6] border-[#E8ECE9] opacity-85 hover:opacity-100 hover:bg-white'
              }`}
            >
              {item.itemThumbnailUrl ? (
                <img
                  src={item.itemThumbnailUrl}
                  alt=""
                  className="w-10 h-10 rounded-2xl object-cover border border-[#E8ECE9] shrink-0"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.type === 'found_item' || item.type === 'claim'
                      ? 'bg-[#DDEDE6] text-[#167C61]'
                      : 'bg-[#E9A34A]/15 text-[#E9A34A]'
                  }`}
                >
                  {getIcon(item.type)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#17211D]">
                      {item.title}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#167C61] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#78827D] shrink-0 tabular-nums">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#78827D] leading-relaxed">
                  {item.description}
                </p>

                {item.actionRoute && (
                  <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#167C61]">
                    <span>View related item</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
