import React from 'react';
import { Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { DayData, LagnaPramanam } from '../types/panchangam';
import { findActiveLagna } from '../utils/panchangaLogic';

interface LagnaPramanaluProps {
  day: DayData;
}

export const LagnaPramanalu: React.FC<LagnaPramanaluProps> = ({ day }) => {
  // Check active lagna based on local time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const activeLagna = findActiveLagna(day.lagnalu, currentMinutes);

  // Vedic classification: Chara (Moving), Sthira (Fixed), Dwiswabhava (Dual)
  const getLagnaNature = (name: string): string => {
    if (name.includes('మేష') || name.includes('కర్కాటక') || name.includes('తుల') || name.includes('మకర')) {
      return 'చర లగ్నం (ప్రయాణాలు, చలన కార్యాలు)';
    }
    if (name.includes('వృషభ') || name.includes('సింహ') || name.includes('వృశ్చిక') || name.includes('కుంభ')) {
      return 'స్థిర లగ్నం (వివాహం, గృహప్రవేశం, స్థిర పనులు)';
    }
    return 'ద్విస్వభావ లగ్నం (విద్య, వ్యాపారం, దైవకార్యాలు)';
  };

  return (
    <div className="bg-white border border-amber-200/90 shadow-lg p-6 sm:p-8 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4 mb-6">
        <div>
          <h3 className="text-2xl sm:text-3xl text-amber-950 flex items-center gap-2.5 font-bold font-telugu">
            <Clock size={24} className="text-amber-600" />
            <span>లగ్న ప్రమాణాలు</span>
          </h3>
          <p className="text-slate-600 text-sm font-telugu mt-1">
            ఈ రోజు పన్నెండు లగ్నాల సమయాలు — శుభ కార్యాల ప్రారంభానికి అనువైన కాల నిర్ణయం.
          </p>
        </div>

        {activeLagna && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-telugu font-semibold shadow-xs shrink-0 animate-pulse">
            <Sparkles size={14} />
            <span>ఇప్పుడు: {activeLagna.lagnam}</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {day.lagnalu.map((lagna, idx) => {
          const isActive = activeLagna?.lagnam === lagna.lagnam;
          const nature = getLagnaNature(lagna.lagnam);

          return (
            <div
              key={lagna.lagnam}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-amber-100/80 border-amber-500 shadow-md ring-2 ring-amber-400'
                  : 'bg-amber-50/40 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800 font-telugu">
                  {idx + 1}. {lagna.lagnam}
                </span>
                {isActive && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-600 text-white rounded-full font-telugu font-bold">
                    నడుస్తున్నది
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-900 font-telugu leading-snug">
                {lagna.samayam}
              </p>

              <p className="text-[11px] text-amber-800/80 font-telugu mt-2 border-t border-amber-200/50 pt-1.5">
                {nature}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-telugu">
        <span>* స్థిర లగ్నాలు గృహప్రవేశం, వివాహం మరియు దాన ధర్మాలకు అత్యంత శ్రేష్ఠమైనవి.</span>
        <span>కాల గణన: సూర్యోదయాన్ని అనుసరించి లగ్న ప్రమాణం</span>
      </div>
    </div>
  );
};
