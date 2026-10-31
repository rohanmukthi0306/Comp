import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { ALL_EVENTS, EventItem } from '../data/demoData';
import { VisualFallback } from '../components/common/VisualFallback';

interface EventsProps {
  onNavigate: (route: string, id?: string) => void;
}

export const Events: React.FC<EventsProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshops'];

  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || evt.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Page Heading & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
            <span>Festival Schedule & Tracks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211D] tracking-tight mt-1">
            Event Discovery
          </h1>
          <p className="text-sm text-[#78827D] mt-0.5">
            Explore and register for conclaves, hackathons, and showcases across Mavericks Fest 2026.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#78827D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-medium text-[#17211D] placeholder-[#78827D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Category Segmented Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#167C61] text-white shadow-xs ring-2 ring-[#167C61]/20'
                : 'bg-white text-[#78827D] hover:text-[#17211D] hover:bg-[#F7F8F6] border border-[#E8ECE9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Event Card (if visible in filter) */}
      {activeCategory === 'All' && !searchQuery && (
        <div className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-xs hover:border-[#167C61]/30 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6">
              <VisualFallback
                type="event"
                category={ALL_EVENTS[0].category}
                title={ALL_EVENTS[0].title}
                aspect="16:9"
                className="h-full min-h-[220px]"
              />
            </div>
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#167C61] uppercase tracking-wider bg-[#DDEDE6]/50 px-2.5 py-0.5 rounded-md">
                    Featured Fest
                  </span>
                  <span className="text-xs text-[#78827D]">·</span>
                  <span className="text-xs font-semibold text-[#17211D]">October 29–31, 2026</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#17211D] tracking-tight">
                  {ALL_EVENTS[0].title}
                </h2>
                <p className="text-sm text-[#78827D] mt-2 leading-relaxed">
                  {ALL_EVENTS[0].description}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E8ECE9] text-xs">
                  <div>
                    <span className="text-[#78827D] block">Venue</span>
                    <span className="font-semibold text-[#17211D]">{ALL_EVENTS[0].venue}</span>
                  </div>
                  <div>
                    <span className="text-[#78827D] block">Expected Turnout</span>
                    <span className="font-semibold text-[#17211D] tabular-nums">3,850+ delegates</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => onNavigate('event-details', ALL_EVENTS[0].id)}
                  className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#167C61] text-white hover:bg-[#0E5643] active:scale-[0.99] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>View Details & Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#78827D]">
          <span>Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}</span>
          <span>Category: {activeCategory}</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#E8ECE9] shadow-xs">
            <Sparkles className="w-8 h-8 text-[#78827D] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#17211D]">No events match your search</h3>
            <p className="text-xs text-[#78827D] mt-1">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-2xl bg-[#F7F8F6] text-xs font-semibold text-[#167C61] border border-[#E8ECE9]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigate('event-details', evt.id)}
                className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-xs hover:shadow-md hover:border-[#167C61]/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <VisualFallback
                    type="event"
                    category={evt.category}
                    title={evt.title}
                    aspect="16:9"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                      <span className="font-semibold text-[#167C61]">{evt.category}</span>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F7F8F6] border border-[#E8ECE9] text-[#17211D]">
                        {evt.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#17211D] group-hover:text-[#167C61] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#78827D] line-clamp-2 mt-1.5 leading-relaxed">
                      {evt.subtitle}
                    </p>

                    <div className="space-y-1.5 mt-4 pt-3 border-t border-[#E8ECE9] text-xs text-[#78827D]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#167C61] shrink-0" />
                        <span className="font-medium text-[#17211D] truncate">{evt.dates}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#167C61] shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('event-details', evt.id);
                    }}
                    className="w-full min-h-[44px] py-2 px-3 rounded-2xl bg-[#F7F8F6] group-hover:bg-[#167C61] group-hover:text-white border border-[#E8ECE9] group-hover:border-[#167C61] text-[#17211D] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
