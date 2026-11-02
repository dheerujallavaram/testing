import React from 'react';
import { Sparkles, Moon, Star, Sunrise, Sunset, Clock, Compass } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { getAyanaAndRutu } from '../utils/panchangaLogic';
import { useLanguage } from '../context/LanguageContext';

interface PanchangaCardProps {
  day: DayData;
}

export const PanchangaCard: React.FC<PanchangaCardProps> = ({ day }) => {
  const { t, tr } = useLanguage();
  const { ayanam, rutuvu, rutuDesc } = getAyanaAndRutu(day.panchanga.masam, day.isoDate);

  const rows = [
    {
      icon: Sparkles,
      label: t('సంవత్సరం', 'Samvatsaram (Vedic Year)'),
      value: tr(day.panchanga.samvatsaram),
      desc: t('ప్రస్తుత తెలుగు సంవత్సరం', 'Current 60-year Jovian cycle year'),
    },
    {
      icon: Compass,
      label: t('ఆయనం & ఋతువు', 'Ayanam & Rutuvu (Solstice & Season)'),
      value: `${tr(ayanam)} • ${tr(rutuvu)}`,
      desc: tr(rutuDesc),
    },
    {
      icon: Moon,
      label: t('మాసం & పక్షం', 'Masam & Paksham (Lunar Month & Fortnight)'),
      value: tr(day.panchanga.masam),
      highlight: true,
    },
    {
      icon: Moon,
      label: t('తిథి', 'Tithi (Lunar Day)'),
      value: tr(day.panchanga.tithi),
      highlight: true,
    },
    {
      icon: Star,
      label: t('ఈ రోజు నక్షత్రం (Nakshatram)', 'Ee Roju Nakshatra in Telugu (Star)'),
      value: tr(day.panchanga.nakshatram),
      highlight: true,
    },
    {
      icon: Sunrise,
      label: t('యోగం', 'Yogam (Luni-Solar Combination)'),
      value: tr(day.panchanga.yogam),
    },
    {
      icon: Clock,
      label: t('కరణం', 'Karanam (Half Lunar Day)'),
      value: tr(day.panchanga.karanam),
    },
    {
      icon: Sunset,
      label: t('సూర్యోదయం / సూర్యాస్తమయం', 'Sunrise / Sunset (Suryodayam / Suryastamayam)'),
      value: t('ఉదయం 06:34 AM / సాయంత్రం 05:40 PM', 'Morning 06:34 AM / Evening 05:40 PM'),
    },
  ];

  return (
    <div className="bg-white/95 border-2 border-amber-300/90 p-6 sm:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all h-full flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100 rounded-full opacity-50 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between border-b-2 border-amber-100 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
              {t('పంచాంగ పంచాంగాలు • Vedic Almanac', 'Vedic Almanac')}
            </span>
            <h3 className="text-xl sm:text-2xl text-amber-950 flex items-center gap-2 font-bold font-telugu mt-0.5">
              <span>{t('నేటి పంచాంగ వివరాలు (Neti Panchangam)', 'Neti Panchangam Details (Five Limbs)')}</span>
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 border border-amber-300 font-bold text-lg shadow-inner">
            ॐ
          </div>
        </div>

        <dl className="divide-y divide-amber-100">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 py-3.5 first:pt-0 last:pb-0"
              >
                <dt className="flex items-center gap-2.5 text-amber-900 text-sm sm:text-base font-bold shrink-0 font-telugu">
                  <Icon size={16} className="text-amber-600 shrink-0" />
                  <span>{row.label}</span>
                </dt>
                <dd className="text-slate-900 text-left sm:text-right font-medium text-sm sm:text-base leading-relaxed font-telugu">
                  <span
                    className={
                      row.highlight
                        ? 'font-bold text-amber-950 bg-amber-50/90 px-2.5 py-0.5 rounded-lg border border-amber-200/80 inline-block'
                        : ''
                    }
                  >
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

      <div className="mt-6 pt-4 border-t border-amber-100 text-xs text-amber-800/80 font-telugu flex items-center justify-between">
        <span>{t('గణిత ప్రామాణికం: దృక్సిద్ధాంతం', 'Calculation Standard: Drik Siddhantam')}</span>
        <span>{t('ప్రాంతం: ఆంధ్రప్రదేశ్ / తెలంగాణ', 'Region: Andhra Pradesh / Telangana (IST)')}</span>
      </div>
    </div>
  );
};
