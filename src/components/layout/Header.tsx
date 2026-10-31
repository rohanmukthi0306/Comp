import React from 'react';
import { ArrowLeft, Bell, User, Sparkles, ShieldCheck } from 'lucide-react';
import { USER_PROFILE } from '../../data/demoData';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onBack?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onBack,
  unreadCount = 2,
}) => {
  const isSubpage = ['event-details', 'found-it', 'find-item', 'item-details', 'notifications', 'announcements', 'profile'].includes(currentRoute);

  const getSubpageTitle = () => {
    switch (currentRoute) {
      case 'event-details':
        return 'Event Details';
      case 'found-it':
        return 'Report Found Item';
      case 'find-item':
        return 'Discover Belongings';
      case 'item-details':
        return 'Found Item Details';
      case 'notifications':
        return 'Notifications';
      case 'announcements':
        return 'Campus Announcements';
      case 'profile':
        return 'Profile & Settings';
      default:
        return 'CampusHub';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E8ECE9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left Slot: Brand or Back Button */}
        <div className="flex items-center gap-3">
          {isSubpage ? (
            <button
              type="button"
              onClick={onBack ? onBack : () => onNavigate('home')}
              className="min-h-[44px] min-w-[44px] -ml-2 px-2.5 rounded-2xl flex items-center gap-1.5 text-[#17211D] hover:bg-[#F7F8F6] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167C61]"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[#17211D]" />
              <span className="text-sm font-semibold hidden xs:inline">Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none group"
            >
              {/* Minimal Apple-like geometric hub emblem */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#167C61] to-[#0E5643] text-white flex items-center justify-center shadow-sm shadow-[#167C61]/20 group-hover:scale-105 transition-transform">
                <span className="font-bold text-base tracking-tighter">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-[#17211D] tracking-tight leading-none">
                  CampusHub
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#78827D] tracking-normal leading-tight mt-0.5">
                  Intercollege Event Portal
                </span>
              </div>
            </button>
          )}

          {isSubpage && (
            <div className="hidden sm:block border-l border-[#E8ECE9] pl-3 py-0.5">
              <h2 className="text-sm font-semibold text-[#17211D] truncate max-w-[200px] md:max-w-xs">
                {getSubpageTitle()}
              </h2>
            </div>
          )}
        </div>

        {/* Center slot on mobile if subpage */}
        {isSubpage && (
          <div className="sm:hidden text-center truncate px-2">
            <h2 className="text-sm font-semibold text-[#17211D] truncate">
              {getSubpageTitle()}
            </h2>
          </div>
        )}

        {/* Right Slot: Actions (Notifications & Profile) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* FindIt pill quick launch for desktop */}
          <button
            type="button"
            onClick={() => onNavigate('findit')}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              currentRoute.startsWith('find') || currentRoute === 'found-it' || currentRoute === 'item-details'
                ? 'bg-[#167C61] text-white border-[#167C61] shadow-xs'
                : 'bg-[#DDEDE6]/50 text-[#167C61] border-[#167C61]/25 hover:bg-[#DDEDE6]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FindIt Module</span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className={`relative min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
              currentRoute === 'notifications'
                ? 'bg-[#DDEDE6] text-[#167C61]'
                : 'text-[#17211D] hover:bg-[#F7F8F6]'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#17211D]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E9A34A] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Button */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`min-h-[44px] min-w-[44px] px-2 rounded-2xl flex items-center gap-2 transition-all active:scale-95 ${
              currentRoute === 'profile'
                ? 'bg-[#DDEDE6] text-[#167C61]'
                : 'hover:bg-[#F7F8F6]'
            }`}
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#167C61]/10 border border-[#167C61]/20 flex items-center justify-center text-[#167C61] font-semibold text-xs">
              {USER_PROFILE.name.charAt(0)}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-[#17211D]">
              {USER_PROFILE.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
