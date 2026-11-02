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
    <div className="bg-gradient-to-r from-amber-100/90 via-[#fff9ed] to-amber-100/90 border-2 border-amber-400/80 rounded-3xl p-3.5 sm:p-5 shadow-md font-telugu">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => onSelectDay(todayId)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-2 min-w-0 ${
              isToday
                ? 'bg-gradient-to-r from-amber-800 to-amber-950 text-amber-100 border-amber-500 shadow-md'
                : 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-2xs'
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

          <button
            type="button"
            onClick={() => onSelectDay(tomorrowId)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-2 min-w-0 ${
              isTomorrow
                ? 'bg-gradient-to-r from-amber-800 to-amber-950 text-amber-100 border-amber-500 shadow-md'
                : 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-2xs'
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

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className={`p-2.5 rounded-2xl border-2 transition-all shrink-0 ${
              currentIndex <= 0
                ? 'opacity-40 cursor-not-allowed bg-amber-100/50 text-amber-700 border-amber-200'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-2xs cursor-pointer'
            }`}
            title={t('మునుపటి రోజు', 'Previous Day')}
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="relative flex-1 md:w-80 lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-800">
              <Calendar size={16} />
            </div>
            <select
              value={currentIndex >= 0 ? selectedDayId : ''}
              onChange={(e) => {
                if (e.target.value) onSelectDay(e.target.value);
              }}
              className="w-full bg-white text-amber-950 font-bold text-xs sm:text-sm pl-10 pr-8 py-2.5 rounded-2xl border-2 border-amber-400 focus:border-amber-700 focus:outline-none shadow-2xs cursor-pointer appearance-none transition-colors"
              aria-label={t('తేదీని ఎంచుకోండి', 'Select Date')}
            >
              {currentIndex < 0 && (
                <option value="">
                  {selectedDayId} • {t('దృక్సిద్ధాంత గణన', 'Live Drik Siddhanta')}
                </option>
              )}
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {tr(d.teediVaram)} {d.specialEvent ? `• ★ ${tr(d.specialEvent)}` : ''}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-amber-800">
              <span className="text-xs font-bold">▼</span>
            </div>
          </div>

          <input
            type="date"
            min="1900-01-01"
            max="2100-12-31"
            value={selectedDayId}
            onChange={(e) => {
              if (e.target.value) onSelectDay(e.target.value);
            }}
            className="bg-amber-900 hover:bg-amber-800 text-amber-100 font-mono font-bold text-xs px-2.5 py-2.5 rounded-2xl border-2 border-amber-400 cursor-pointer shrink-0 shadow-xs"
            title={t('ఏ సంవత్సరం తేదీనైనా ఎంచుకోండి (1900–2100)', 'Pick any date across any year (1900–2100)')}
            aria-label={t('ఏ తేదీనైనా ఎంచుకోండి', 'Pick any calendar date')}
          />

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= days.length - 1}
            className={`p-2.5 rounded-2xl border-2 transition-all shrink-0 ${
              currentIndex >= days.length - 1
                ? 'opacity-40 cursor-not-allowed bg-amber-100/50 text-amber-700 border-amber-200'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-2xs cursor-pointer'
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
