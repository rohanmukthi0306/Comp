import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, Filter, ShieldCheck, ChevronRight, AlertCircle, Sparkles, X, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useFindIt } from '../context/FindItContext';
import { ItemCategory, FoundItemReport } from '../types/findItTypes';
import { VisualFallback } from '../components/common/VisualFallback';

interface FindLostItemProps {
  onBack: () => void;
  onNavigate: (route: string, id?: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const CATEGORIES: ('All' | ItemCategory)[] = [
  'All',
  'Electronics',
  'Wallets',
  'ID Cards',
  'Bags',
  'Clothing',
  'Accessories',
  'Books',
  'Other',
];

const FESTIVAL_DATES = [
  { date: '2026-10-29', label: 'Oct 29 · Day 1 (Thu)' },
  { date: '2026-10-30', label: 'Oct 30 · Day 2 (Fri - Today)' },
  { date: '2026-10-31', label: 'Oct 31 · Day 3 (Sat)' },
];

export const FindLostItem: React.FC<FindLostItemProps> = ({
  onBack,
  onNavigate,
  selectedDate,
  onSelectDate,
}) => {
  const { items, dateReportCounts, latestFoundNotification } = useFindIt();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [filterByDateOnly, setFilterByDateOnly] = useState<boolean>(true);

  // Dynamic filter combination: search + category + date
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.foundLocation.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.refCode.toLowerCase().includes(q);

      // Category match
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;

      // Date match
      const matchesDate = !filterByDateOnly || item.foundDate === selectedDate;

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [items, searchQuery, activeCategory, filterByDateOnly, selectedDate]);

  const getStatusBadge = (status: FoundItemReport['status']) => {
    switch (status) {
      case 'IN_CUSTODY':
        return (
          <span className="text-[11px] font-bold text-[#167C61] bg-[#DDEDE6] px-2.5 py-0.5 rounded-full border border-[#167C61]/20">
            IN CUSTODY
          </span>
        );
      case 'CLAIM_PENDING':
        return (
          <span className="text-[11px] font-bold text-[#E9A34A] bg-[#E9A34A]/15 px-2.5 py-0.5 rounded-full border border-[#E9A34A]/30">
            CLAIM PENDING
          </span>
        );
      case 'RETURNED':
        return (
          <span className="text-[11px] font-bold text-[#78827D] bg-[#F7F8F6] px-2.5 py-0.5 rounded-full border border-[#E8ECE9]">
            RETURNED TO OWNER
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Top Bar with Back Action & Quick Report Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-semibold text-[#17211D] hover:bg-[#F7F8F6] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#167C61]" />
          <span>Back to FindIt</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('found-it')}
          className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#167C61] hover:bg-[#0E5643] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Found Item</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Registry · Live Database</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight mt-1">
          Discover Lost Belongings
        </h1>
        <p className="text-sm text-[#78827D] mt-0.5">
          Browse verified items turned in by fellow delegates and campus staff during Mavericks Fest 2026.
        </p>
      </div>

      {/* A. LATEST IN-APP NOTIFICATION BANNER */}
      {latestFoundNotification && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#167C61]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {latestFoundNotification.itemThumbnailUrl ? (
              <img
                src={latestFoundNotification.itemThumbnailUrl}
                alt="Thumbnail"
                className="w-12 h-12 rounded-2xl object-cover border border-[#E8ECE9] shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#DDEDE6] text-[#167C61] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 stroke-[1.75px]" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#167C61] uppercase tracking-wider bg-[#DDEDE6]/50 px-2 py-0.5 rounded-md">
                  Latest In-App Notification
                </span>
                <span className="text-[11px] text-[#78827D] tabular-nums">
                  {latestFoundNotification.timestamp}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#17211D] truncate mt-0.5">
                {latestFoundNotification.title}
              </h4>
              <p className="text-xs text-[#78827D] truncate">
                {latestFoundNotification.description}
              </p>
            </div>
          </div>

          {latestFoundNotification.targetId && (
            <button
              type="button"
              onClick={() => onNavigate('item-details', latestFoundNotification.targetId)}
              className="px-4 py-2 rounded-2xl bg-[#167C61] hover:bg-[#0E5643] text-white text-xs font-bold shrink-0 self-start sm:self-auto transition-colors cursor-pointer"
            >
              VIEW ITEM →
            </button>
          )}
        </div>
      )}

      {/* B & C. OCTOBER 2026 DATE SELECTOR STRIP WITH DYNAMIC LIVE INDICATOR DOTS */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17211D]">
            <CalendarIcon className="w-4 h-4 text-[#167C61]" />
            <span>Select Festival Date to Discover Belongings:</span>
          </div>

          <button
            type="button"
            onClick={() => setFilterByDateOnly(!filterByDateOnly)}
            className="text-xs font-bold text-[#167C61] hover:underline self-start sm:self-auto cursor-pointer"
          >
            {filterByDateOnly ? 'Show All 3 Days' : 'Filter by Selected Day Only'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {FESTIVAL_DATES.map((item) => {
            const isSelected = selectedDate === item.date && filterByDateOnly;
            const reportsCount = dateReportCounts[item.date] || 0;
            const hasReports = reportsCount > 0;

            return (
              <button
                key={item.date}
                type="button"
                onClick={() => {
                  onSelectDate(item.date);
                  setFilterByDateOnly(true);
                }}
                className={`min-h-[48px] p-3.5 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#167C61] text-white border-[#167C61] shadow-xs ring-2 ring-[#167C61]/20 font-bold'
                    : 'bg-[#F7F8F6] text-[#17211D] border-[#E8ECE9] hover:bg-[#DDEDE6]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    {/* Dynamic report indicator dot determined strictly by actual stored reports */}
                    {hasReports && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-[#167C61]'
                        }`}
                        title={`${reportsCount} items reported`}
                      />
                    )}
                    <span
                      className={`text-[11px] tabular-nums px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-white text-[#78827D] border border-[#E8ECE9]'
                      }`}
                    >
                      {reportsCount} {reportsCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* D & E. DYNAMIC SEARCH AND CATEGORY FILTERS */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#78827D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by item name, category, location, or report reference..."
            className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-medium text-[#17211D] placeholder-[#78827D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78827D] hover:text-[#17211D]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#17211D] text-white shadow-xs'
                  : 'bg-white text-[#78827D] hover:text-[#17211D] hover:bg-[#F7F8F6] border border-[#E8ECE9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* F & G. ITEM CARDS GRID AND ELEGANT EMPTY STATES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#78827D]">
          <span>
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {filterByDateOnly ? ` for ${selectedDate}` : ' across all festival dates'}
          </span>
          {activeCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="text-[#167C61] font-semibold hover:underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          /* SECTION 5.G: REQUIRED EMPTY STATE */
          <div className="bg-white p-12 sm:p-16 text-center rounded-3xl border border-[#E8ECE9] shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] flex items-center justify-center text-[#78827D] mx-auto">
              <Search className="w-6 h-6 stroke-[1.5px]" />
            </div>

            <h3 className="text-lg font-bold text-[#17211D]">
              No belongings reported here yet.
            </h3>

            <p className="text-xs sm:text-sm text-[#78827D] max-w-md mx-auto leading-relaxed">
              Newly found items will appear here as soon as they are registered.
            </p>

            <div className="pt-3 flex flex-wrap justify-center gap-2">
              {(searchQuery || activeCategory !== 'All' || filterByDateOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                    setFilterByDateOnly(false);
                  }}
                  className="px-4 py-2 rounded-2xl bg-[#F7F8F6] text-[#17211D] hover:bg-[#E8ECE9] text-xs font-semibold border border-[#E8ECE9] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate('found-it')}
                className="px-4 py-2 rounded-2xl bg-[#167C61] hover:bg-[#0E5643] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Report a Found Item
              </button>
            </div>
          </div>
        ) : (
          /* SECTION 5.F: REAL ITEM CARDS WITH ACTUAL PHOTOGRAPHS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('item-details', item.id)}
                className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-xs hover:shadow-md hover:border-[#167C61]/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <VisualFallback
                    type="item"
                    category={item.category}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    aspect="4:3"
                  />

                  <div className="p-5 space-y-2.5">
                    {/* Top reference, status and sample demo tag */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] font-bold text-[#167C61] bg-[#DDEDE6]/60 px-2 py-0.5 rounded-md">
                        {item.refCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#17211D] group-hover:text-[#167C61] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#78827D] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-3 border-t border-[#E8ECE9] space-y-1.5 text-xs text-[#78827D]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#167C61] shrink-0" />
                        <span className="truncate">{item.foundLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#167C61] shrink-0" />
                        <span>
                          {item.foundDate} · {item.foundTime}
                        </span>
                      </div>
                    </div>

                    {/* Clear distinction between sample demonstration records and live user reports */}
                    <div className="pt-1">
                      {item.isSampleDemo ? (
                        <span className="text-[10px] text-[#78827D] bg-[#F7F8F6] px-2 py-0.5 rounded-md border border-[#E8ECE9] block text-center">
                          Sample Demonstration Record
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#167C61] bg-[#DDEDE6]/40 px-2 py-0.5 rounded-md border border-[#167C61]/20 font-bold block text-center">
                          ✓ Live Participant Report
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('item-details', item.id);
                    }}
                    className="w-full min-h-[44px] py-2 px-3 rounded-2xl bg-[#F7F8F6] group-hover:bg-[#167C61] group-hover:text-white border border-[#E8ECE9] group-hover:border-[#167C61] text-[#17211D] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>VIEW DETAILS</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
