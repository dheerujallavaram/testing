import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { getTodayAndTomorrowIds } from '../utils/panchangaLogic';
import { useLanguage } from '../context/LanguageContext';

interface DaySelectorProps {
  days: DayData[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ days, selectedDayId, onSelectDay }) => {
  const { language, t, tr } = useLanguage();
  const currentIndex = days.findIndex((d) => d.id === selectedDayId);

  const { todayId, tomorrowId, todayDay, tomorrowDay } = getTodayAndTomorrowIds(days);

  const isToday = selectedDayId === todayId;
  const isTomorrow = selectedDayId === tomorrowId;

  const formatShortMonth = (monthName?: string) => {
    if (!monthName) return '';
    if (language === 'en') {
      const translated = tr(monthName);
      return translated.slice(0, 3);
    }
    return monthName.length > 4 ? `${monthName.slice(0, 4)}.` : monthName;
  };

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
    <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300/80 rounded-2xl p-3.5 sm:p-5 shadow-sm font-telugu">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left side: "నేడు" & "రేపు" quick toggle buttons - Grid on mobile, flex on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0">
          {/* నేడు (Today) button */}
          <button
            type="button"
            onClick={() => onSelectDay(todayId)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              isToday
                ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-400/80 scale-[1.01]'
                : 'bg-white hover:bg-amber-100/70 text-amber-900 border-amber-300 hover:border-amber-400 shadow-2xs'
            }`}
            title={t(
              `నేటి పంచాంగానికి వెళ్లండి (${todayDay.dateNum} ${todayDay.monthName})`,
              `Go to Today's Panchangam (${todayDay.dateNum} ${tr(todayDay.monthName || '')})`
            )}
          >
            <Sparkles size={14} className={isToday ? 'text-amber-300 shrink-0' : 'text-amber-600 shrink-0'} />
            <span className="truncate">
              {t('నేడు', 'Today')} ({todayDay.dateNum} {formatShortMonth(todayDay.monthName)})
            </span>
          </button>

          {/* రేపు (Tomorrow) button */}
          <button
            type="button"
            onClick={() => onSelectDay(tomorrowId)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              isTomorrow
                ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-400/80 scale-[1.01]'
                : 'bg-white hover:bg-amber-100/70 text-amber-900 border-amber-300 hover:border-amber-400 shadow-2xs'
            }`}
            title={t(
              `రేపటి పంచాంగానికి వెళ్లండి (${tomorrowDay.dateNum} ${tomorrowDay.monthName})`,
              `Go to Tomorrow's Panchangam (${tomorrowDay.dateNum} ${tr(tomorrowDay.monthName || '')})`
            )}
          >
            <Calendar size={14} className={isTomorrow ? 'text-amber-300 shrink-0' : 'text-amber-600 shrink-0'} />
            <span className="truncate">
              {t('రేపు', 'Tomorrow')} ({tomorrowDay.dateNum} {formatShortMonth(tomorrowDay.monthName)})
            </span>
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
            title={t('మునుపటి రోజు', 'Previous Day')}
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dropdown Select for curated days */}
          <div className="relative flex-1 md:w-72 lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-700">
              <Calendar size={16} />
            </div>
            <select
              value={currentIndex >= 0 ? selectedDayId : ''}
              onChange={(e) => {
                if (e.target.value) onSelectDay(e.target.value);
              }}
              className="w-full bg-white text-amber-950 font-semibold text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border-2 border-amber-400/80 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-xs cursor-pointer appearance-none transition-colors"
              aria-label={t('తేదీని ఎంచుకోండి', 'Select Date')}
            >
              {currentIndex < 0 && (
                <option value="">
                  {selectedDayId} • {t('దృక్సిద్ధాంత గణన', 'Live Drik Siddhanta')}
                </option>
              )}
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {tr(d.teediVaram)} {d.specialEvent ? `• ${tr(d.specialEvent)}` : ''}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-amber-800">
              <span className="text-[10px] font-bold">▼</span>
            </div>
          </div>

          {/* Unlimited Year Calendar Date Picker (1900 - 2100 via astronomy-engine) */}
          <input
            type="date"
            min="1900-01-01"
            max="2100-12-31"
            value={selectedDayId}
            onChange={(e) => {
              if (e.target.value) onSelectDay(e.target.value);
            }}
            className="bg-amber-100/80 hover:bg-amber-200/70 text-amber-950 font-mono font-bold text-xs px-2.5 py-2.5 rounded-xl border border-amber-400 cursor-pointer shrink-0"
            title={t('ఏ సంవత్సరం తేదీనైనా ఎంచుకోండి (1900–2100)', 'Pick any date across any year (1900–2100)')}
            aria-label={t('ఏ తేదీనైనా ఎంచుకోండి', 'Pick any calendar date')}
          />

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
            title={t('తదుపరి రోజు', 'Next Day')}
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
