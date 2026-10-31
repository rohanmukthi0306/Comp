import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Mail, Phone, Clock, Sparkles, Megaphone, ShieldCheck, Share2 } from 'lucide-react';
import { ALL_EVENTS, MAIN_FEATURED_EVENT, EventItem } from '../data/demoData';
import { VisualFallback } from '../components/common/VisualFallback';

interface EventDetailsProps {
  eventId?: string;
  onNavigate: (route: string, id?: string) => void;
  onBack: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onNavigate, onBack }) => {
  const event = ALL_EVENTS.find((e) => e.id === eventId) || MAIN_FEATURED_EVENT;
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const selectedDay = event.schedule[activeDayIndex] || event.schedule[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-semibold text-[#17211D] hover:bg-[#F7F8F6] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#167C61]" />
          <span>Back to Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('findit')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#DDEDE6] text-xs font-bold text-[#167C61] hover:bg-[#cbe6da] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FindIt Desk</span>
          </button>
        </div>
      </div>

      {/* Large Premium Event Banner */}
      <div className="rounded-3xl overflow-hidden border border-[#E8ECE9] bg-white shadow-xs">
        <VisualFallback
          type="event"
          category={event.category}
          title={event.title}
          aspect="16:9"
          className="max-h-[340px]"
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#78827D] mb-3">
            <span className="font-bold text-[#167C61] bg-[#DDEDE6]/60 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
              {event.category}
            </span>
            <span>·</span>
            <span className="font-medium px-2.5 py-0.5 rounded-full bg-[#F7F8F6] border border-[#E8ECE9] text-[#17211D]">
              {event.status}
            </span>
            <span>·</span>
            <span className="tabular-nums font-medium">{event.attendeeCount}+ Registered</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17211D] tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="text-base sm:text-lg text-[#78827D] mt-2 font-normal">
            {event.subtitle}
          </p>

          {/* Key Event Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#E8ECE9]">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9]">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#167C61] shrink-0 shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#78827D] uppercase tracking-wider block">Official Dates</span>
                <span className="text-sm font-bold text-[#17211D]">{event.dates}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9]">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#167C61] shrink-0 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#78827D] uppercase tracking-wider block">Campus Venue</span>
                <span className="text-sm font-bold text-[#17211D]">{event.venue}</span>
                <span className="text-xs text-[#78827D] block mt-0.5">{event.campusLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Overview */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#17211D] tracking-tight">
          About this Conclave
        </h2>
        <p className="text-sm sm:text-base text-[#17211D]/90 leading-relaxed">
          {event.description}
        </p>
      </section>

      {/* THREE-DAY SCHEDULE TABS */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#17211D] tracking-tight">
              Festival Program & Schedule
            </h2>
            <p className="text-xs text-[#78827D]">Three-day track breakdown for delegates and spectators</p>
          </div>

          {/* Schedule Day Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F7F8F6] rounded-2xl border border-[#E8ECE9] self-start sm:self-auto">
            {event.schedule.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveDayIndex(idx)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDayIndex === idx
                    ? 'bg-[#167C61] text-white shadow-xs'
                    : 'text-[#78827D] hover:text-[#17211D]'
                }`}
              >
                Day {day.dayNumber} · {day.day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Timeline */}
        {selectedDay && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-[#167C61] uppercase tracking-wider pb-1">
              {selectedDay.day}, {new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            <div className="space-y-3">
              {selectedDay.sessions.map((session, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-[#167C61]/30 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E8ECE9] flex items-center justify-center text-[#167C61] shrink-0 font-bold text-xs shadow-xs">
                      0{sIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#17211D]">
                        {session.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#78827D] mt-1">
                        <span className="flex items-center gap-1 text-[#167C61] font-semibold tabular-nums">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{session.time}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{session.venue}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="self-end sm:self-center text-xs font-medium px-3 py-1 rounded-md bg-white border border-[#E8ECE9] text-[#17211D]">
                    {session.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ORGANISER INFORMATION & CONTACT */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#17211D] tracking-tight">
          Organiser Secretariat
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] space-y-2">
            <span className="text-xs font-semibold text-[#78827D] uppercase tracking-wider block">Official Host</span>
            <div className="text-sm font-bold text-[#17211D]">{event.organizer.name}</div>
            <div className="text-xs text-[#78827D]">{event.organizer.department}</div>
            <div className="text-xs text-[#167C61] font-medium pt-1">{event.organizer.deskLocation}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] space-y-2.5">
            <span className="text-xs font-semibold text-[#78827D] uppercase tracking-wider block">Direct Desk Contact</span>
            <div className="flex items-center gap-2 text-xs text-[#17211D]">
              <Mail className="w-4 h-4 text-[#167C61]" />
              <span className="font-mono">{event.organizer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#17211D]">
              <Phone className="w-4 h-4 text-[#167C61]" />
              <span className="font-mono">{event.organizer.phone}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Announcements */}
      {event.announcements && event.announcements.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#E9A34A]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#17211D] tracking-tight">
              Event Notices & Updates
            </h2>
          </div>

          <div className="space-y-3">
            {event.announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[#17211D]">{ann.title}</span>
                  <span className="text-[11px] text-[#78827D]">{ann.time}</span>
                </div>
                <p className="text-xs text-[#78827D] leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
