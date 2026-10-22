import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { DayData } from '../types/panchangam';

interface DaySelectorProps {
  days: DayData[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ days, selectedDayId, onSelectDay }) => {
  const currentIndex = days.findIndex((d) => d.id === selectedDayId);
  const selectedDay = days[currentIndex] || days[0];

  const todayId = '2026-10-21';
  const tomorrowId = '2026-10-22';

  const isToday = selectedDayId === todayId;
  const isTomorrow = selectedDayId === tomorrowId;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectDay(days[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < days.length - 1) {
      onSelectDay(days[currentIndex + 1].id);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-sm font-telugu">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side: "నేడు" & "రేపు" quick toggle buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-bold text-amber-900/80 uppercase tracking-wider hidden sm:inline mr-1">
            త్వరిత ఎంపిక:
          </span>

          {/* నేడు (Today) button */}
          <button
            type="button"
            onClick={() => onSelectDay(todayId)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              isToday
                ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-400/80 scale-[1.02]'
                : 'bg-white hover:bg-amber-100/70 text-amber-900 border-amber-300 hover:border-amber-400 shadow-2xs'
            }`}
            title="నేటి పంచాంగానికి వెళ్లండి (21 అక్టోబర్)"
          >
            <Sparkles size={14} className={isToday ? 'text-amber-300' : 'text-amber-600'} />
            <span>నేడు (21 అక్టో.)</span>
          </button>

          {/* రేపు (Tomorrow) button */}
          <button
            type="button"
            onClick={() => onSelectDay(tomorrowId)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              isTomorrow
                ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-400/80 scale-[1.02]'
                : 'bg-white hover:bg-amber-100/70 text-amber-900 border-amber-300 hover:border-amber-400 shadow-2xs'
            }`}
            title="రేపటి పంచాంగానికి వెళ్లండి (22 అక్టోబర్)"
          >
            <Calendar size={14} className={isTomorrow ? 'text-amber-300' : 'text-amber-600'} />
            <span>రేపు (22 అక్టో.)</span>
          </button>
        </div>

        {/* Right side: Single Dropdown Menu + Prev/Next Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Previous day button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              currentIndex <= 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs cursor-pointer hover:scale-105 active:scale-95'
            }`}
            title="మునుపటి రోజు"
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dropdown Select for all 49 days */}
          <div className="relative flex-1 md:w-80 lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-700">
              <Calendar size={16} />
            </div>
            <select
              value={selectedDayId}
              onChange={(e) => onSelectDay(e.target.value)}
              className="w-full bg-white text-amber-950 font-semibold text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border-2 border-amber-400/80 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-xs cursor-pointer appearance-none transition-colors"
              aria-label="తేదీని ఎంచుకోండి"
            >
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.teediVaram} {d.specialEvent ? `• ${d.specialEvent}` : ''}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-amber-800">
              <span className="text-[10px] font-bold">▼</span>
            </div>
          </div>

          {/* Next day button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= days.length - 1}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              currentIndex >= days.length - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs cursor-pointer hover:scale-105 active:scale-95'
            }`}
            title="తదుపరి రోజు"
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
