import React from 'react';
import { Sparkles } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface DayVisheshamCardProps {
  day: DayData;
}

export const DayVisheshamCard: React.FC<DayVisheshamCardProps> = ({ day }) => {
  const { language, t, tr } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 border border-amber-300 shadow-md p-6 sm:p-8 rounded-2xl relative overflow-hidden">
      {/* Sacred border accent */}
      <div className="absolute top-0 left-0 w-2 h-full bg-amber-600" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-display">
            Daily Vedic Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 font-telugu flex items-center gap-2 mt-0.5">
            <Sparkles className="text-amber-600" size={24} />
            {t('నేటి ప్రత్యేక ఫలితం & ప్రామాణిక విశేషాలు', "Today's Special Significance & Vedic Guidance")}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1 bg-white border border-amber-300 rounded-lg shadow-2xs text-xs font-telugu text-amber-900 font-medium">
            {t('అధిదేవత:', 'Presiding Deity:')} <strong>{tr(day.deity)}</strong>
          </div>
          <div className="px-3 py-1 bg-white border border-amber-300 rounded-lg shadow-2xs text-xs font-telugu text-amber-900 font-medium">
            {t('అనుకూల వర్ణం:', 'Lucky Color:')} <strong>{tr(day.luckyColor)}</strong>
          </div>
        </div>
      </div>

      <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-telugu font-medium">
        {language === 'en' ? (
          <>
            <span className="block text-slate-900 mb-1.5">
              On <strong>{tr(day.teediVaram)}</strong>, the lunar Tithi is <strong>{tr(day.panchanga.tithi)}</strong> and Nakshatram is <strong>{tr(day.panchanga.nakshatram)}</strong>. Worshipping <strong>{tr(day.deity)}</strong> during auspicious hours brings peace, prosperity, and success in undertakings.
            </span>
            <span className="block text-xs sm:text-sm text-amber-900/80">
              {day.phalitham}
            </span>
          </>
        ) : (
          day.phalitham
        )}
      </p>
    </div>
  );
};
