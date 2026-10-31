import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Sparkles, ChevronRight, Info, SearchCheck } from 'lucide-react';
import { MAIN_FEATURED_EVENT } from '../../data/demoData';
import { useFindIt } from '../../context/FindItContext';

interface OctoberCalendarProps {
  selectedDate: string; // '2026-10-29' | '2026-10-30' | '2026-10-31'
  onSelectDate: (date: string) => void;
  showScheduleDetails?: boolean;
  onNavigateToFindItDate?: (date: string) => void;
}

export const OctoberCalendar: React.FC<OctoberCalendarProps> = ({
  selectedDate,
  onSelectDate,
  showScheduleDetails = true,
  onNavigateToFindItDate,
}) => {
  const { dateReportCounts } = useFindIt();

  // Days of the week
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // October 2026 starts on Thursday (index 4 in 0-indexed Sun-Sat week)
  const paddingDays = 4; // Sun, Mon, Tue, Wed
  const daysInMonth = 31;

  // Active selectable fest dates
  const selectableDates = ['2026-10-29', '2026-10-30', '2026-10-31'];

  // Match selected day schedule
  const currentDaySchedule =
    MAIN_FEATURED_EVENT.schedule.find((s) => s.date === selectedDate) ||
    MAIN_FEATURED_EVENT.schedule[1];

  const getDateString = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return `2026-10-${formattedDay}`;
  };

  const selectedDateItemCount = dateReportCounts[selectedDate] || 0;

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8ECE9] shadow-sm overflow-hidden transition-all">
      {/* Calendar Header with Apple HIG clarity */}
      <div className="p-5 sm:p-6 border-b border-[#E8ECE9] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DDEDE6]/70 flex items-center justify-center text-[#167C61]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#17211D] tracking-tight">October 2026</h3>
            <p className="text-xs text-[#78827D]">Mavericks Fest Official Session Dates</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-[#167C61] bg-[#DDEDE6]/50 px-2.5 py-1 rounded-full">
            Days 29–31 Active
          </span>
        </div>
      </div>

      {/* Monthly Calendar Grid */}
      <div className="p-4 sm:p-6">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 mb-3 text-center">
          {weekDays.map((day, idx) => (
            <div key={idx} className="text-xs font-semibold text-[#78827D] py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Previous month empty padding cells */}
          {Array.from({ length: paddingDays }).map((_, i) => (
            <div
              key={`pad-${i}`}
              className="h-11 sm:h-13 rounded-2xl flex items-center justify-center text-xs text-[#78827D]/30 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              {27 + i}
            </div>
          ))}

          {/* Month Days (1 to 31) */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = getDateString(dayNum);
            const isSelectable = selectableDates.includes(dateStr);
            const isSelected = selectedDate === dateStr;
            const reportsCount = dateReportCounts[dateStr] || 0;
            const hasReports = reportsCount > 0;

            if (isSelectable) {
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => onSelectDate(dateStr)}
                  className={`relative h-11 sm:h-13 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167C61] ${
                    isSelected
                      ? 'bg-[#167C61] text-white shadow-md shadow-[#167C61]/25 ring-2 ring-[#167C61]/20 font-bold'
                      : 'bg-[#DDEDE6]/40 text-[#17211D] font-semibold hover:bg-[#DDEDE6] hover:shadow-xs border border-[#167C61]/20'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`October ${dayNum}, 2026 - ${reportsCount} reports`}
                >
                  <span className="text-sm sm:text-base tabular-nums">{dayNum}</span>

                  {/* Dynamic report indicator dot determined strictly by actual stored reports */}
                  <div className="h-1.5 w-full flex items-center justify-center mt-0.5">
                    {hasReports ? (
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isSelected ? 'bg-white' : 'bg-[#167C61]'
                        }`}
                        title={`${reportsCount} found items reported on this date`}
                      />
                    ) : (
                      <span className="w-1.5 h-1.5" />
                    )}
                  </div>
                </button>
              );
            }

            // Visually disabled day (cannot be clicked)
            return (
              <div
                key={dateStr}
                className="h-11 sm:h-13 rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm text-[#78827D]/45 cursor-not-allowed select-none bg-transparent"
                aria-disabled="true"
              >
                <span className="tabular-nums">{dayNum}</span>
                <div className="h-1.5 w-1.5" />
              </div>
            );
          })}
        </div>

        {/* Legend / Info notice with live FindIt status */}
        <div className="mt-4 pt-3 border-t border-[#E8ECE9] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#78827D] gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#167C61]" />
            <span>Indicator dot = Live found items reported on this date</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#167C61] font-semibold">
            <SearchCheck className="w-3.5 h-3.5" />
            <span>
              {selectedDateItemCount} {selectedDateItemCount === 1 ? 'item' : 'items'} logged for selected date
            </span>
          </div>
        </div>
      </div>

      {/* Day Schedule & Found Items Summary Section */}
      {showScheduleDetails && currentDaySchedule && (
        <div className="bg-[#F7F8F6] p-5 sm:p-6 border-t border-[#E8ECE9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#167C61]">
                  Day {currentDaySchedule.dayNumber} of 3
                </span>
                <span className="text-xs text-[#78827D]">·</span>
                <span className="text-xs font-semibold text-[#17211D]">
                  {currentDaySchedule.day},{' '}
                  {new Date(currentDaySchedule.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#17211D] mt-0.5">
                Official Festival Sessions & Track Schedule
              </h4>
            </div>

            {/* Quick action to jump directly to this date's items in FindIt */}
            {onNavigateToFindItDate && (
              <button
                type="button"
                onClick={() => onNavigateToFindItDate(selectedDate)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E8ECE9] hover:border-[#167C61]/40 text-xs font-bold text-[#167C61] flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                <SearchCheck className="w-3.5 h-3.5" />
                <span>Browse Found Items ({selectedDateItemCount})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Session Cards */}
          <div className="space-y-2.5">
            {currentDaySchedule.sessions.map((session, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E8ECE9] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:border-[#167C61]/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DDEDE6]/50 flex items-center justify-center text-[#167C61] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#17211D] leading-snug">
                      {session.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#78827D] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{session.time}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{session.venue}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F7F8F6] text-[#17211D] border border-[#E8ECE9]">
                    {session.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
