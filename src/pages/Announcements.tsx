import React, { useState } from 'react';
import { Megaphone, AlertCircle, Calendar, Clock, MapPin, ShieldCheck, Tag } from 'lucide-react';
import { DEMO_ANNOUNCEMENTS, AnnouncementItem } from '../data/demoData';

interface AnnouncementsProps {
  onNavigate: (route: string, id?: string) => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Urgent', 'Schedule', 'Venue', 'General'];

  const filteredAnnouncements = DEMO_ANNOUNCEMENTS.filter(
    (ann) => activeCategory === 'All' || ann.category === activeCategory
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
          <Megaphone className="w-4 h-4 text-[#E9A34A]" />
          <span>Official Festival Communications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight mt-1">
          Campus Announcements
        </h1>
        <p className="text-sm text-[#78827D] mt-0.5">
          Live advisories, schedule changes, and custodian alerts issued by the Mavericks Fest Secretariat.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#167C61] text-white shadow-xs'
                : 'bg-white text-[#78827D] hover:bg-[#F7F8F6] border border-[#E8ECE9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all ${
              item.isImportant
                ? 'bg-white border-[#167C61]/30 shadow-xs'
                : 'bg-white border-[#E8ECE9]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                    item.category === 'Urgent'
                      ? 'bg-[#E9A34A]/15 text-[#E9A34A]'
                      : 'bg-[#DDEDE6] text-[#167C61]'
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-xs text-[#78827D]">·</span>
                <span className="text-xs font-semibold text-[#17211D]">{item.source}</span>
              </div>
              <span className="text-xs text-[#78827D] tabular-nums">{item.timestamp}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#17211D] leading-snug">
              {item.title}
            </h3>

            <p className="text-sm text-[#78827D] mt-2 leading-relaxed">
              {item.content}
            </p>

            <div className="mt-4 pt-3 border-t border-[#E8ECE9] flex items-center justify-between text-xs text-[#78827D]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#167C61]" />
                <span>{item.date}</span>
              </div>
              <span className="text-[11px] font-mono text-[#78827D]">Ref: {item.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
