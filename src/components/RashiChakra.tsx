import React, { useState } from 'react';
import { Star, Info } from 'lucide-react';
import { DayData, RashiHouse } from '../types/panchangam';
import { RASHI_CHART_ORDER } from '../data/panchangamData';
import { RashiGlyph } from './RashiGlyph';
import { useLanguage } from '../context/LanguageContext';

interface RashiChakraProps {
  day: DayData;
}

export const RashiChakra: React.FC<RashiChakraProps> = ({ day }) => {
  const [selectedHouse, setSelectedHouse] = useState<RashiHouse | null>(null);
  const { language, t, tr } = useLanguage();

  const chandraRashi = RASHI_CHART_ORDER.find((r) =>
    (day.grahaStithi[r.key] || '').includes('చంద్రుడు')
  );

  return (
    <div className="bg-white border border-amber-200/90 shadow-lg p-3.5 sm:p-6 lg:p-8 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl text-amber-950 flex items-center gap-2 sm:gap-2.5 font-bold font-telugu">
            <Star size={20} className="text-amber-600 shrink-0" />
            <span>{t('రాశి చక్రం — గోచార గ్రహ స్థితి', 'Rashi Chakra — Planetary Transit (Gochara)')}</span>
          </h3>
          <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 font-telugu font-semibold whitespace-nowrap">
            {t('దక్షిణ భారత కుండలి', 'South Indian Kundli')}
          </span>
        </div>

        {/* 4x4 Grid Traditional South Indian Chart - Mobile touch optimized */}
        <div className="w-full max-w-md mx-auto grid grid-cols-4 grid-flow-dense border-2 sm:border-4 border-amber-800/90 rounded-xl overflow-hidden shadow-inner bg-amber-50/50">
          {/* Central 2x2 Hub */}
          <div className="col-start-2 row-start-2 col-span-2 row-span-2 border border-amber-300 bg-gradient-to-br from-amber-100 via-amber-200/70 to-amber-100 text-amber-950 flex flex-col items-center justify-center text-center p-2 sm:p-3 shadow-inner">
            <p className="text-[10px] sm:text-xs font-bold text-amber-900 mb-0.5 font-telugu">
              {t('రాశి చక్రం', 'Rashi Chakra')}
            </p>
            <p className="text-sm sm:text-lg font-extrabold leading-tight text-amber-950 font-telugu">
              {chandraRashi
                ? language === 'en'
                  ? `Moon in ${chandraRashi.english.split(' ')[0]}`
                  : `${chandraRashi.name} చంద్రుడు`
                : t('చంద్ర స్థానం', 'Moon Position')}
            </p>
            <p className="text-[10px] sm:text-xs text-amber-800 mt-0.5 font-telugu font-medium">
              {tr(day.label)} {t('గోచారం', 'Transit')}
            </p>
            <span className="mt-1 text-[9px] sm:text-[10px] text-amber-800/80 font-telugu">
              {t('తాకి వివరాలు చూడండి', 'Tap any house for details')}
            </span>
          </div>

          {/* 12 Outer Houses */}
          {RASHI_CHART_ORDER.map((rashi) => {
            const planets = day.grahaStithi[rashi.key];
            const hasMoon = planets?.includes('చంద్రుడు');
            const hasPlanets = Boolean(planets);
            const isSelected = selectedHouse?.key === rashi.key;

            return (
              <button
                key={rashi.key}
                type="button"
                onClick={() => setSelectedHouse(isSelected ? null : rashi)}
                className={`border border-amber-300/80 p-1.5 sm:p-2 min-h-[82px] sm:min-h-[104px] flex flex-col justify-between text-left transition-all cursor-pointer overflow-hidden ${
                  hasMoon
                    ? 'bg-amber-200/90 hover:bg-amber-300/90 ring-1 ring-amber-400'
                    : hasPlanets
                    ? 'bg-amber-100/70 hover:bg-amber-200/70'
                    : 'bg-white hover:bg-amber-50/70'
                } ${isSelected ? 'ring-2 ring-amber-700 shadow-md scale-[1.02] z-10' : ''}`}
                title={`${language === 'en' ? rashi.english : rashi.name} - ${tr(rashi.lord)}`}
              >
                <div className="flex items-center justify-between w-full">
                  <RashiGlyph
                    rashi={rashi.key}
                    size={13}
                    className="text-amber-900/60 shrink-0"
                    strokeWidth={2}
                  />
                  <p className="text-[11px] sm:text-xs font-bold text-amber-950 font-telugu truncate">
                    {language === 'en' ? rashi.english.split(' ')[0] : rashi.name}
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center my-1 px-0.5 w-full">
                  {planets ? (
                    <p className="text-[11px] sm:text-xs font-bold leading-tight text-red-950 font-telugu drop-shadow-2xs break-words line-clamp-2">
                      {tr(planets)}
                    </p>
                  ) : (
                    <span className="text-[10px] text-amber-900/20 select-none font-mono">··</span>
                  )}
                </div>

                <div className="text-[9px] sm:text-[10px] text-amber-900/70 font-telugu truncate w-full pt-0.5 border-t border-amber-200/50">
                  {tr(rashi.lord.split(' ')[0])}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected House Details Drawer */}
        {selectedHouse && (
          <div className="mt-4 p-3.5 sm:p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-sm font-telugu text-amber-950 flex items-start justify-between gap-3 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RashiGlyph rashi={selectedHouse.key} size={18} className="text-amber-800 shrink-0" />
                <p className="font-bold text-sm sm:text-base text-amber-900">
                  {language === 'en'
                    ? `${selectedHouse.english} (${selectedHouse.name})`
                    : `${selectedHouse.name} రాశి (${selectedHouse.english})`}
                </p>
              </div>
              <p className="text-slate-700">
                {t('అధిపతి:', 'Ruling Planet:')} <strong>{tr(selectedHouse.lord)}</strong> |{' '}
                {t('తత్త్వం:', 'Element:')} {tr(selectedHouse.element)}
              </p>
              <p className="text-slate-800">
                {t('ప్రస్తుత గోచార గ్రహాలు:', 'Current Transiting Planets:')}{' '}
                <strong>
                  {day.grahaStithi[selectedHouse.key]
                    ? tr(day.grahaStithi[selectedHouse.key]!)
                    : t('గ్రహ సంచారం లేదు (శూన్యం)', 'No transiting planets')}
                </strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHouse(null)}
              className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-md font-sans text-xs cursor-pointer shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500 font-telugu">
        <span className="flex items-center gap-1">
          <Info size={13} className="text-amber-600" />
          <span>{t('గోచారం: నిరయణ పద్ధతి', 'Transit: Nirayana Sidereal System')}</span>
        </span>
        <span className="text-[11px] text-amber-900/80 font-medium">
          {t('ఎరుపు: గ్రహ నివాసం', 'Red: Planetary Placement')}
        </span>
      </div>
    </div>
  );
};
