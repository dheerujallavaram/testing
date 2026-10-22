import React from 'react';
import { Sparkles, Moon, Star, Sunrise, Sunset, Clock, Compass } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { getAyanaAndRutu } from '../utils/panchangaLogic';

interface PanchangaCardProps {
  day: DayData;
}

export const PanchangaCard: React.FC<PanchangaCardProps> = ({ day }) => {
  const { ayanam, rutuvu, rutuDesc } = getAyanaAndRutu(day.panchanga.masam, day.isoDate);

  const rows = [
    {
      icon: Sparkles,
      label: 'సంవత్సరం',
      value: day.panchanga.samvatsaram,
      desc: day.panchanga.samvatsaram,
    },
    {
      icon: Compass,
      label: 'ఆయనం & ఋతువు',
      value: `${ayanam} · ${rutuvu}`,
      desc: rutuDesc,
    },
    {
      icon: Moon,
      label: 'మాసం & పక్షం',
      value: day.panchanga.masam,
      highlight: true,
    },
    {
      icon: Moon,
      label: 'తిథి',
      value: day.panchanga.tithi,
      highlight: true,
    },
    {
      icon: Star,
      label: 'నక్షత్రం',
      value: day.panchanga.nakshatram,
      highlight: true,
    },
    {
      icon: Sunrise,
      label: 'యోగం',
      value: day.panchanga.yogam,
    },
    {
      icon: Clock,
      label: 'కరణం',
      value: day.panchanga.karanam,
    },
    {
      icon: Sunset,
      label: 'సూర్యోదయం / సూర్యాస్తమయం',
      value: 'ఉదయం 06:34 AM / సాయంత్రం 05:40 PM',
    },
  ];

  return (
    <div className="bg-white border border-amber-200/90 shadow-lg p-6 sm:p-8 rounded-2xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-6">
          <h3 className="text-2xl text-amber-950 flex items-center gap-2.5 font-bold font-telugu">
            <Sparkles size={22} className="text-amber-600" />
            <span>పంచాంగ వివరాలు</span>
          </h3>
          <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 font-telugu font-semibold">
            పంచాంగ పంచాంగాలు
          </span>
        </div>

        <dl className="space-y-4">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className={`flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3.5 last:border-b-0 ${
                  row.highlight ? 'bg-amber-50/60 p-2.5 rounded-lg -mx-2.5' : ''
                }`}
              >
                <dt className="flex items-center gap-2 text-slate-700 text-sm font-semibold shrink-0 font-telugu">
                  <Icon size={16} className="text-amber-600 shrink-0" />
                  <span>{row.label}</span>
                </dt>
                <dd className="text-slate-900 text-left sm:text-right font-medium text-sm sm:text-base leading-relaxed font-telugu">
                  <span className={row.highlight ? 'font-bold text-amber-950' : ''}>
                    {row.value}
                  </span>
                  {row.desc && (
                    <span className="block text-xs text-slate-500 font-normal mt-0.5">
                      {row.desc}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <div className="mt-6 pt-4 border-t border-amber-100 text-xs text-slate-500 font-telugu flex items-center justify-between">
        <span>గణిత ప్రామాణికం: దృక్సిద్ధాంతం</span>
        <span>ప్రాంతం: ఆంధ్రప్రదేశ్ / తెలంగాణ</span>
      </div>
    </div>
  );
};
