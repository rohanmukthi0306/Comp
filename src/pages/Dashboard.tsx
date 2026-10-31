import React from 'react';
import { Sparkles, Calendar, MapPin, Users, ArrowRight, ShieldCheck, PlusCircle, Search, Megaphone, Clock, ChevronRight } from 'lucide-react';
import { MAIN_FEATURED_EVENT, ALL_EVENTS, DEMO_ANNOUNCEMENTS } from '../data/demoData';
import { VisualFallback } from '../components/common/VisualFallback';
import { useFindIt } from '../context/FindItContext';

interface DashboardProps {
  onNavigate: (route: string, id?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { items } = useFindIt();
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Welcome & Campus Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
            <span>Tri-State Conclave</span>
            <span>·</span>
            <span>Day 2 of 3 Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211D] tracking-tight mt-1">
            Welcome to CampusHub
          </h1>
          <p className="text-sm text-[#78827D] mt-0.5">
            Your all-in-one portal for Mavericks Intercollege Fest 2026 and campus event services.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className="px-3.5 py-2 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-semibold text-[#17211D] hover:bg-[#F7F8F6] flex items-center gap-2 shadow-xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#167C61]" />
            <span>October 2026 Schedule</span>
          </button>
        </div>
      </div>

      {/* Metric Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-[#E8ECE9] shadow-xs">
          <span className="text-xs font-semibold text-[#78827D]">Participating Colleges</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#17211D] mt-1 tabular-nums">48</div>
          <span className="text-[11px] text-[#167C61] font-medium mt-1 block">Cross-country delegation</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#E8ECE9] shadow-xs">
          <span className="text-xs font-semibold text-[#78827D]">Registered Delegates</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#17211D] mt-1 tabular-nums">3,850+</div>
          <span className="text-[11px] text-[#167C61] font-medium mt-1 block">Live across 6 arenas</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#E8ECE9] shadow-xs">
          <span className="text-xs font-semibold text-[#78827D]">Festival Span</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#17211D] mt-1 tabular-nums">3 Days</div>
          <span className="text-[11px] text-[#78827D] font-medium mt-1 block">Oct 29 – Oct 31, 2026</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#E8ECE9] shadow-xs">
          <span className="text-xs font-semibold text-[#78827D]">FindIt Secure Desk</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#167C61] mt-1 tabular-nums">
            {items.length} Items
          </div>
          <span className="text-[11px] text-[#167C61] font-medium mt-1 block">In custody & cataloged</span>
        </div>
      </div>

      {/* DEDICATED & VISUALLY PROMINENT FINDIT FEATURE CARD */}
      <section
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#167C61] via-[#11624C] to-[#0D4E3D] text-white p-6 sm:p-8 shadow-md shadow-[#167C61]/20 border border-[#167C61]"
        aria-labelledby="findit-highlight-title"
      >
        {/* Subtle background ambient graphic */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#DDEDE6]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-[#DDEDE6] mb-3">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Dedicated Innovation Module · FindIt</span>
            </div>
            
            <h2 id="findit-highlight-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Every lost item deserves a way home.
            </h2>
            
            <p className="text-sm sm:text-base text-white/90 mt-2 leading-relaxed">
              Lost something during the event? Found something that belongs to someone else? FindIt helps reconnect belongings with their owners with verified custody tracking.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#DDEDE6] mt-4 pt-4 border-t border-white/15">
              <span>Physical Custody Desk: Central Booth #4</span>
              <span>·</span>
              <span>Verified Campus Security Staff</span>
            </div>
          </div>

          {/* TWO MANDATORY VISIBLE ACTIONS: FOUND IT & FIND IT */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-64">
            <button
              type="button"
              onClick={() => onNavigate('found-it')}
              className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-white text-[#167C61] hover:bg-[#F7F8F6] active:scale-[0.98] font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-black/10 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>FOUND IT</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('find-item')}
              className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-[0.98] text-white border border-white/30 backdrop-blur-sm font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>FIND IT</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT: Mavericks Intercollege Fest 2026 */}
      <section className="bg-white rounded-3xl border border-[#E8ECE9] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8ECE9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
              <span>Main Festival Spotlight</span>
              <span>·</span>
              <span className="text-[#17211D]">October 29–31, 2026</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#17211D] tracking-tight mt-0.5">
              {MAIN_FEATURED_EVENT.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('event-details', MAIN_FEATURED_EVENT.id)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167C61] hover:text-[#0E5643] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Festival Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5">
            <VisualFallback
              type="event"
              category="Technical & Cultural Conclave"
              title={MAIN_FEATURED_EVENT.title}
              aspect="16:9"
              className="rounded-2xl"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-sm text-[#17211D] leading-relaxed">
                {MAIN_FEATURED_EVENT.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E8ECE9] text-xs">
                <div className="flex items-center gap-2 text-[#78827D]">
                  <Calendar className="w-4 h-4 text-[#167C61] shrink-0" />
                  <span className="font-medium text-[#17211D]">{MAIN_FEATURED_EVENT.dates}</span>
                </div>
                <div className="flex items-center gap-2 text-[#78827D]">
                  <MapPin className="w-4 h-4 text-[#167C61] shrink-0" />
                  <span className="font-medium text-[#17211D] truncate">{MAIN_FEATURED_EVENT.venue}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('event-details', MAIN_FEATURED_EVENT.id)}
                className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#17211D] text-white hover:bg-[#167C61] font-semibold text-xs tracking-wide transition-all shadow-xs cursor-pointer"
              >
                Explore 3-Day Schedule
              </button>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#F7F8F6] text-[#17211D] border border-[#E8ECE9] hover:bg-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Open October Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN GRID: Today's Schedule Preview & Campus Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule Preview (Friday Oct 30) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DDEDE6] text-[#167C61] flex items-center justify-center font-bold text-xs">
                30
              </div>
              <div>
                <h4 className="text-base font-bold text-[#17211D] tracking-tight">Today’s Schedule (Day 2)</h4>
                <p className="text-xs text-[#78827D]">Friday, October 30, 2026</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('calendar')}
              className="text-xs font-semibold text-[#167C61] hover:underline"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {MAIN_FEATURED_EVENT.schedule[1].sessions.map((session, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] flex items-center justify-between gap-3 hover:border-[#167C61]/30 transition-colors"
              >
                <div className="min-w-0">
                  <h5 className="text-xs sm:text-sm font-semibold text-[#17211D] truncate">
                    {session.title}
                  </h5>
                  <div className="flex items-center gap-2 text-[11px] text-[#78827D] mt-0.5">
                    <span className="tabular-nums font-medium text-[#167C61]">{session.time}</span>
                    <span>·</span>
                    <span className="truncate">{session.venue}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#78827D] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#E8ECE9] shrink-0">
                  {session.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Announcements */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#E9A34A]" />
              <h4 className="text-base font-bold text-[#17211D] tracking-tight">Announcements</h4>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-[#167C61] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {DEMO_ANNOUNCEMENTS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('announcements')}
                className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] hover:border-[#167C61]/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#E9A34A] bg-[#E9A34A]/10 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-[#78827D]">{item.timestamp}</span>
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-[#17211D] group-hover:text-[#167C61] transition-colors leading-snug">
                  {item.title}
                </h5>
                <p className="text-[11px] text-[#78827D] line-clamp-2 mt-1 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPCOMING FESTIVAL EVENTS STRIP */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#17211D] tracking-tight">
              Featured Festival Events
            </h3>
            <p className="text-xs text-[#78827D]">Competitions and conclaves occurring throughout Mavericks Fest</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('events')}
            className="text-xs font-bold text-[#167C61] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>All Events ({ALL_EVENTS.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_EVENTS.slice(1, 4).map((evt) => (
            <div
              key={evt.id}
              onClick={() => onNavigate('event-details', evt.id)}
              className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-xs hover:shadow-md hover:border-[#167C61]/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <VisualFallback
                  type="event"
                  category={evt.category}
                  title={evt.title}
                  aspect="16:9"
                />
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#78827D] mb-1.5">
                    <span className="font-semibold text-[#167C61]">{evt.category}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F7F8F6] border border-[#E8ECE9]">
                      {evt.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#17211D] group-hover:text-[#167C61] transition-colors leading-snug">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-[#78827D] line-clamp-2 mt-1 leading-relaxed">
                    {evt.subtitle}
                  </p>
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-[#E8ECE9] flex items-center justify-between text-xs text-[#78827D]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#167C61]" />
                  <span className="font-medium">{evt.dates}</span>
                </div>
                <span className="font-bold text-[#167C61] group-hover:translate-x-0.5 transition-transform">
                  Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
