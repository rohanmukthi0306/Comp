import React from 'react';
import { PackagePlus, Search, ShieldCheck, MapPin, Clock, ArrowRight, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFindIt } from '../context/FindItContext';
import { VisualFallback } from '../components/common/VisualFallback';

interface FindItHomeProps {
  onNavigate: (route: string, id?: string) => void;
}

export const FindItHome: React.FC<FindItHomeProps> = ({ onNavigate }) => {
  const { items } = useFindIt();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Brand Hero Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEDE6] text-xs font-bold text-[#167C61] border border-[#167C61]/20">
          <ShieldCheck className="w-4 h-4" />
          <span>CampusHub Smart Module</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17211D] tracking-tight">
          FindIt
        </h1>
        <p className="text-base sm:text-lg text-[#78827D] font-medium max-w-md mx-auto">
          Every lost item deserves a way home.
        </p>
      </div>

      {/* TWO EQUALLY IMPORTANT POWERFUL ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* CARD 1: FOUND IT */}
        <div
          onClick={() => onNavigate('found-it')}
          className="group relative bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] hover:border-[#167C61]/40 shadow-xs hover:shadow-lg hover:shadow-[#167C61]/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDEDE6] text-[#167C61] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <PackagePlus className="w-7 h-7 stroke-[2px]" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#167C61]">
                FOUND SOMETHING?
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#17211D] tracking-tight mt-1">
                Help someone recover their belongings.
              </h2>
              <p className="text-xs sm:text-sm text-[#78827D] mt-2 leading-relaxed">
                Report an item you've found during the event. Secure custody will log it and connect with the owner.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('found-it');
              }}
              className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-[#167C61] text-white hover:bg-[#0E5643] active:scale-[0.98] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Report Found Item</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 2: FIND IT */}
        <div
          onClick={() => onNavigate('find-item')}
          className="group relative bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] hover:border-[#167C61]/40 shadow-xs hover:shadow-lg hover:shadow-[#167C61]/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#17211D] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Search className="w-7 h-7 stroke-[2px]" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#17211D]">
                LOST SOMETHING?
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#17211D] tracking-tight mt-1">
                Browse recently found belongings.
              </h2>
              <p className="text-xs sm:text-sm text-[#78827D] mt-2 leading-relaxed">
                Identify items that may belong to you. Filter by festival dates, categories, and verified campus zones.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('find-item');
              }}
              className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-[#17211D] text-white hover:bg-[#283832] active:scale-[0.98] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Find My Item</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PHYSICAL CUSTODY & VERIFICATION SECTION */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#167C61] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#167C61]" />
              <span>Physical Custody Station</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#17211D] tracking-tight">
              Central Helpdesk Booth #4 · North Quad
            </h3>
            <p className="text-xs sm:text-sm text-[#78827D] leading-relaxed">
              All physical belongings reported through FindIt are deposited with certified campus security and student council custodians. Open continuously from 08:00 AM to 10:00 PM throughout Mavericks Fest 2026.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 text-xs text-[#17211D]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#167C61]" />
              <span>Strict ID verification prior to handoff</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#167C61]" />
              <span>Tamper-evident sealed storage bins</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#167C61]" />
              <span>Full audit trail with reference codes</span>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT CATALOGED BELONGINGS PREVIEW FROM LIVE REPOSITORY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#17211D] tracking-tight">
              Recently Cataloged Belongings
            </h3>
            <p className="text-xs text-[#78827D]">Turned in during today's sessions</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('find-item')}
            className="text-xs font-bold text-[#167C61] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('item-details', item.id)}
              className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-xs hover:border-[#167C61]/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <VisualFallback
                  type="item"
                  category={item.category}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  aspect="4:3"
                />
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between text-xs text-[#78827D] mb-1.5">
                    <span className="font-mono text-[11px] text-[#167C61] font-semibold">{item.refCode}</span>
                    <span className="font-semibold text-[#17211D]">{item.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#17211D] group-hover:text-[#167C61] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#78827D] mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#167C61] shrink-0" />
                    <span className="truncate">{item.foundLocation}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-[#E8ECE9] flex items-center justify-between text-xs">
                <span className="text-[#78827D]">{item.foundTime}</span>
                <span className="font-bold text-[#167C61]">Inspect Details →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
