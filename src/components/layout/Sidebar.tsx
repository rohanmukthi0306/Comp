import React from 'react';
import { Home, Sparkles, Calendar, SearchCheck, Bell, Megaphone, User, PlusCircle, Search, HelpCircle, MapPin } from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  unreadCount = 2,
}) => {
  const isFindItActive = ['findit', 'found-it', 'find-item', 'item-details'].includes(currentRoute);

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 bg-white border-r border-[#E8ECE9] p-5 justify-between select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left w-full group focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#167C61] to-[#0E5643] text-white flex items-center justify-center shadow-sm shadow-[#167C61]/25 group-hover:scale-105 transition-transform">
            <span className="font-bold text-lg tracking-tighter">C</span>
          </div>
          <div>
            <div className="text-base font-bold text-[#17211D] tracking-tight leading-none">
              CampusHub
            </div>
            <div className="text-[11px] font-medium text-[#78827D] mt-1">
              Intercollege Event Portal
            </div>
          </div>
        </button>

        {/* Main Navigation */}
        <nav className="space-y-1" aria-label="Main Navigation">
          <div className="text-[11px] font-bold text-[#78827D] uppercase tracking-wider px-3 mb-2">
            Portal Navigation
          </div>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              currentRoute === 'home'
                ? 'bg-[#F7F8F6] text-[#167C61] shadow-xs'
                : 'text-[#17211D] hover:bg-[#F7F8F6]/80 hover:text-[#167C61]'
            }`}
          >
            <Home className="w-4 h-4 text-[#78827D]" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('events')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              currentRoute === 'events' || currentRoute === 'event-details'
                ? 'bg-[#F7F8F6] text-[#167C61] shadow-xs'
                : 'text-[#17211D] hover:bg-[#F7F8F6]/80 hover:text-[#167C61]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#78827D]" />
            <span>All Events</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              currentRoute === 'calendar'
                ? 'bg-[#F7F8F6] text-[#167C61] shadow-xs'
                : 'text-[#17211D] hover:bg-[#F7F8F6]/80 hover:text-[#167C61]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#78827D]" />
            <span>October 2026 Calendar</span>
          </button>
        </nav>

        {/* DEDICATED FINDIT MODULE PROMINENCE */}
        <div className="pt-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#DDEDE6]/40 to-[#DDEDE6]/20 border border-[#167C61]/25">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#167C61] text-white flex items-center justify-center">
                  <SearchCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#167C61] tracking-tight">FindIt Module</span>
              </div>
              <span className="text-[10px] font-semibold text-[#167C61] bg-white px-2 py-0.5 rounded-full border border-[#167C61]/20">
                Core Feature
              </span>
            </div>
            <p className="text-[11px] text-[#78827D] leading-relaxed mb-3">
              Smart lost & found custody for festival belongings.
            </p>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onNavigate('findit')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentRoute === 'findit'
                    ? 'bg-[#167C61] text-white shadow-xs'
                    : 'bg-white text-[#17211D] hover:bg-[#167C61]/10 border border-[#E8ECE9]'
                }`}
              >
                <span>FindIt Overview</span>
                <span className="text-[10px] opacity-75">→</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('found-it')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  currentRoute === 'found-it'
                    ? 'bg-[#167C61]/15 text-[#167C61] font-bold'
                    : 'text-[#17211D] hover:text-[#167C61]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Found Item</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('find-item')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  currentRoute === 'find-item' || currentRoute === 'item-details'
                    ? 'bg-[#167C61]/15 text-[#167C61] font-bold'
                    : 'text-[#17211D] hover:text-[#167C61]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Discover Lost Belongings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-[#78827D] uppercase tracking-wider px-3 mb-2">
            Campus Updates
          </div>

          <button
            type="button"
            onClick={() => onNavigate('announcements')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
              currentRoute === 'announcements'
                ? 'bg-[#F7F8F6] text-[#167C61]'
                : 'text-[#17211D] hover:bg-[#F7F8F6]/80'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#78827D]" />
            <span>Announcements</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
              currentRoute === 'notifications'
                ? 'bg-[#F7F8F6] text-[#167C61]'
                : 'text-[#17211D] hover:bg-[#F7F8F6]/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#78827D]" />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#E9A34A] text-white text-[10px] font-bold tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
              currentRoute === 'profile'
                ? 'bg-[#F7F8F6] text-[#167C61]'
                : 'text-[#17211D] hover:bg-[#F7F8F6]/80'
            }`}
          >
            <User className="w-4 h-4 text-[#78827D]" />
            <span>Profile & Settings</span>
          </button>
        </div>
      </div>

      {/* Custody Desk Quick Reference Card at Bottom */}
      <div className="pt-4 border-t border-[#E8ECE9]">
        <div className="p-3 bg-[#F7F8F6] rounded-2xl border border-[#E8ECE9] text-xs text-[#78827D]">
          <div className="flex items-center gap-1.5 font-bold text-[#17211D] mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#167C61]" />
            <span>FindIt Physical Desk</span>
          </div>
          <p className="text-[11px] leading-tight text-[#78827D]">
            Central Helpdesk Booth #4, North Quad. Open 08:00 – 22:00.
          </p>
        </div>
      </div>
    </aside>
  );
};
