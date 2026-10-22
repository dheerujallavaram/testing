import React, { useState } from 'react';
import { Star, Info } from 'lucide-react';
import { DayData, RashiHouse } from '../types/panchangam';
import { RASHI_CHART_ORDER } from '../data/panchangamData';

interface RashiChakraProps {
  day: DayData;
}

export const RashiChakra: React.FC<RashiChakraProps> = ({ day }) => {
  const [selectedHouse, setSelectedHouse] = useState<RashiHouse | null>(null);

  const chandraRashi = RASHI_CHART_ORDER.find((r) =>
    (day.grahaStithi[r.key] || '').includes('చంద్రుడు')
  );

  return (
    <div className="bg-white border border-amber-200/90 shadow-lg p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-6">
          <h3 className="text-2xl text-amber-950 flex items-center gap-2.5 font-bold font-telugu">
            <Star size={22} className="text-amber-600" />
            <span>రాశి చక్రం — గోచార గ్రహ స్థితి</span>
          </h3>
          <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 font-telugu font-semibold">
            దక్షిణ భారత కుండలి
          </span>
        </div>

        {/* 4x4 Grid Traditional South Indian Chart */}
        <div className="max-w-md mx-auto grid grid-cols-4 grid-flow-dense border-4 border-amber-700/80 rounded-xl overflow-hidden shadow-inner bg-amber-50/50">
          {/* Central 2x2 Hub */}
          <div className="col-start-2 row-start-2 col-span-2 row-span-2 border border-amber-300 bg-gradient-to-br from-amber-100 via-amber-200/60 to-amber-100 text-amber-950 flex flex-col items-center justify-center text-center p-3 shadow-inner">
            <p className="text-xs font-bold text-amber-900 mb-1 font-telugu">
              రాశి చక్రం
            </p>
            <p className="text-lg sm:text-xl font-extrabold leading-tight text-amber-950 font-telugu">
              {chandraRashi ? `${chandraRashi.name} చంద్రుడు` : 'చంద్ర స్థానం'}
            </p>
            <p className="text-xs text-amber-800 mt-1 font-telugu font-medium">
              {day.label} గోచారం
            </p>
            <span className="mt-2 text-[10px] text-amber-700/80 font-telugu">
              ఇళ్లను తాకి వివరాలు చూడండి
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
                className={`border border-amber-300/80 p-2 sm:p-2.5 min-h-[96px] sm:min-h-[106px] flex flex-col justify-between text-left transition-all cursor-pointer overflow-hidden ${
                  hasMoon
                    ? 'bg-amber-200/80 hover:bg-amber-300/80 ring-1 ring-amber-400'
                    : hasPlanets
                    ? 'bg-amber-100/60 hover:bg-amber-200/60'
                    : 'bg-white hover:bg-amber-50/70'
                } ${isSelected ? 'ring-2 ring-amber-700 shadow-md scale-[1.02] z-10' : ''}`}
                title={`${rashi.name} - ${rashi.lord}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono text-amber-900/40">
                    {rashi.symbol}
                  </span>
                  <p className="text-[11px] sm:text-xs font-bold text-amber-900 font-telugu">
                    {rashi.name}
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center my-1 px-0.5">
                  {planets ? (
                    <p className="text-xs sm:text-[13px] font-bold leading-snug text-red-950 font-telugu drop-shadow-2xs">
                      {planets}
                    </p>
                  ) : (
                    <span className="text-[10px] text-amber-900/20 select-none font-mono">··</span>
                  )}
                </div>

                <div className="text-[9px] sm:text-[10px] text-amber-900/60 font-telugu truncate w-full pt-0.5 border-t border-amber-200/50">
                  {rashi.lord.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected House Details Drawer */}
        {selectedHouse && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-sm font-telugu text-amber-950 flex items-start justify-between gap-3 animate-fade-in">
            <div>
              <p className="font-bold text-base text-amber-900">
                {selectedHouse.name} రాశి ({selectedHouse.english} - {selectedHouse.symbol})
              </p>
              <p className="mt-1 text-slate-700">
                అధిపతి: <strong>{selectedHouse.lord}</strong> | తత్త్వం: {selectedHouse.element}
              </p>
              <p className="mt-1 text-slate-800">
                ప్రస్తుత గోచార గ్రహాలు:{' '}
                <strong>{day.grahaStithi[selectedHouse.key] || 'గ్రహ సంచారం లేదు (శూన్యం)'}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHouse(null)}
              className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-md font-sans text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500 font-telugu">
        <span className="flex items-center gap-1">
          <Info size={13} className="text-amber-600" />
          <span>గోచారం: నిరయణ పద్ధతి</span>
        </span>
        <span>ఎరుపు రంగు: గ్రహ నివాసం</span>
      </div>
    </div>
  );
};
