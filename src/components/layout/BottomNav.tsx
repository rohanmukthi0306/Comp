import React from 'react';
import { Home, Sparkles, Calendar, SearchCheck } from 'lucide-react';

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentRoute, onNavigate }) => {
  const isFindItActive = ['findit', 'found-it', 'find-item', 'item-details'].includes(currentRoute);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8ECE9] shadow-lg shadow-black/[0.03]"
      aria-label="Bottom Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2 pb-safe">
        {/* Destination 1: Home */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all active:scale-95 ${
            currentRoute === 'home' ? 'text-[#167C61]' : 'text-[#78827D] hover:text-[#17211D]'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${currentRoute === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          <span className={`text-[11px] font-medium tracking-tight mt-1 ${currentRoute === 'home' ? 'font-bold' : ''}`}>
            Home
          </span>
        </button>

        {/* Destination 2: Events */}
        <button
          type="button"
          onClick={() => onNavigate('events')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all active:scale-95 ${
            currentRoute === 'events' || currentRoute === 'event-details' ? 'text-[#167C61]' : 'text-[#78827D] hover:text-[#17211D]'
          }`}
          aria-label="Events"
        >
          <Sparkles className={`w-5 h-5 ${currentRoute === 'events' || currentRoute === 'event-details' ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          <span className={`text-[11px] font-medium tracking-tight mt-1 ${currentRoute === 'events' || currentRoute === 'event-details' ? 'font-bold' : ''}`}>
            Events
          </span>
        </button>

        {/* Destination 3: Calendar */}
        <button
          type="button"
          onClick={() => onNavigate('calendar')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all active:scale-95 ${
            currentRoute === 'calendar' ? 'text-[#167C61]' : 'text-[#78827D] hover:text-[#17211D]'
          }`}
          aria-label="Calendar"
        >
          <Calendar className={`w-5 h-5 ${currentRoute === 'calendar' ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          <span className={`text-[11px] font-medium tracking-tight mt-1 ${currentRoute === 'calendar' ? 'font-bold' : ''}`}>
            Calendar
          </span>
        </button>

        {/* Destination 4: FindIt (SPECIAL VISUAL EMPHASIS) */}
        <button
          type="button"
          onClick={() => onNavigate('findit')}
          className="relative min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all active:scale-95 group"
          aria-label="FindIt Smart Lost and Found"
        >
          {/* Prominent Apple-inspired indicator capsule for FindIt */}
          <div
            className={`px-3 py-1 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isFindItActive
                ? 'bg-[#167C61] text-white shadow-md shadow-[#167C61]/30 ring-2 ring-[#DDEDE6]'
                : 'bg-[#DDEDE6] text-[#167C61] hover:bg-[#c9e4d9]'
            }`}
          >
            <SearchCheck className="w-4 h-4 stroke-[2.25px]" />
          </div>
          <span
            className={`text-[11px] font-bold tracking-tight mt-0.5 ${
              isFindItActive ? 'text-[#167C61]' : 'text-[#167C61]/80'
            }`}
          >
            FindIt
          </span>
        </button>
      </div>
    </nav>
  );
};
