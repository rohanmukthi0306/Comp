import React from 'react';
import { OctoberCalendar } from '../components/calendar/OctoberCalendar';
import { ShieldCheck, Calendar as CalendarIcon, Info, Sparkles } from 'lucide-react';
import { useFindIt } from '../context/FindItContext';

interface CalendarPageProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onNavigate: (route: string, id?: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  selectedDate,
  onSelectDate,
  onNavigate,
}) => {
  const { dateReportCounts } = useFindIt();
  const currentCount = dateReportCounts[selectedDate] || 0;

  const handleNavigateToFindItDate = (date: string) => {
    onSelectDate(date);
    onNavigate('find-item');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
            <span>Festival Timeline</span>
            <span>·</span>
            <span>Official Dates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211D] tracking-tight mt-1">
            October 2026 Calendar
          </h1>
          <p className="text-sm text-[#78827D] mt-0.5">
            Interactive schedule for Mavericks Intercollege Fest 2026. Select between active festival dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('findit')}
            className="px-3.5 py-2 rounded-2xl bg-[#DDEDE6] text-xs font-bold text-[#167C61] hover:bg-[#cde4d9] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>FindIt Desk</span>
          </button>
        </div>
      </div>

      {/* Primary October 2026 Calendar Component with Live Report Indicator Dots */}
      <OctoberCalendar
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        showScheduleDetails={true}
        onNavigateToFindItDate={handleNavigateToFindItDate}
      />

      {/* Stage 2 Live Registry Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8ECE9] shadow-xs flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-[#DDEDE6]/50 flex items-center justify-center text-[#167C61] shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-[#17211D]">
            Stage 2 Dynamic Calendar Integration
          </h4>
          <p className="text-xs text-[#78827D] leading-relaxed">
            Calendar indicator markers are now dynamically generated based on actual stored found-item reports in the local repository. Selecting October 29, 30, or 31 updates schedule tracks and displays the number of verified items cataloged on that day.
          </p>
        </div>
      </div>
    </div>
  );
};
