import React, { useMemo, useState } from 'react';
import { CalendarDays, Sparkles, ArrowRight, Flame, Moon, Sun, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  VrataCategory,
  VrataEventItem,
  generate12MonthVratasAndFestivals,
} from '../utils/vrataCalendarAndRatnaEngine';
import { PoojaService } from '../types/panchangam';

interface VrataFestivalsCalendarViewProps {
  onSelectDateForPanchangam: (isoDate: string) => void;
  onNavigateSankalpam: () => void;
  onOpenBooking?: (service?: PoojaService) => void;
}

type FilterKey = 'all' | 'festival' | 'ekadashi' | 'pradosham' | 'chaturthi' | 'pournami' | 'amavasya' | 'shivaratri';

const CATEGORY_BADGES: Record<VrataCategory, { labelTe: string; labelEn: string; cls: string }> = {
  festival: { labelTe: 'ప్రధాన పండుగ', labelEn: 'Major Festival', cls: 'bg-amber-900 text-amber-100 border-amber-700' },
  ekadashi: { labelTe: 'ఏకాదశి వ్రతం', labelEn: 'Ekadashi', cls: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
  pradosham: { labelTe: 'ప్రదోష వ్రతం', labelEn: 'Pradosham', cls: 'bg-orange-100 text-orange-950 border-orange-300' },
  chaturthi: { labelTe: 'సంకష్టహర చతుర్థి', labelEn: 'Sankashti', cls: 'bg-rose-100 text-rose-950 border-rose-300' },
  pournami: { labelTe: 'పౌర్ణమి', labelEn: 'Pournami', cls: 'bg-amber-100 text-amber-950 border-amber-300' },
  amavasya: { labelTe: 'అమావాస్య', labelEn: 'Amavasya', cls: 'bg-slate-200 text-slate-900 border-slate-300' },
  shivaratri: { labelTe: 'మాస శివరాత్రి', labelEn: 'Masa Shivaratri', cls: 'bg-stone-200 text-stone-900 border-stone-300' },
};

export const VrataFestivalsCalendarView: React.FC<VrataFestivalsCalendarViewProps> = ({
  onSelectDateForPanchangam,
  onNavigateSankalpam,
  onOpenBooking,
}) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number | 'all'>('all');

  const now = useMemo(() => new Date(), []);
  const monthlyGroups = useMemo(
    () => generate12MonthVratasAndFestivals(now.getFullYear(), now.getMonth(), 12),
    [now]
  );

  const filteredGroups = useMemo(() => {
    return monthlyGroups
      .filter((g, idx) => (selectedMonthIdx === 'all' ? true : idx === selectedMonthIdx))
      .map((g) => ({
        ...g,
        events: g.events.filter((ev) => (filter === 'all' ? true : ev.category === filter)),
      }))
      .filter((g) => g.events.length > 0);
  }, [monthlyGroups, filter, selectedMonthIdx]);

  const handleBookEvent = (ev: VrataEventItem) => {
    if (!onOpenBooking) return;
    onOpenBooking({
      id: ev.id,
      name: `${ev.titleEn} (${ev.isoDate})`,
      teluguName: `${ev.titleTe} (${ev.isoDate}) ప్రత్యేక పూజ & సంకల్పం`,
      description: ev.significanceTe,
      duration: 'శాస్త్రోక్తంగా',
      benefits: ev.significanceTe,
      category: 'vratham',
      recommendedDays: `${ev.isoDate} (${ev.tithiTe})`,
    });
  };

  return (
    <div className="space-y-7 font-telugu">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/80 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
              <CalendarDays size={14} />
              <span>
                {t(
                  'దృక్సిద్ధాంత 12-మాసాల పండుగలు & వ్రత క్యాలెండర్',
                  'Drik Siddhanta 12-Month Telugu Festivals & Vrata Calendar'
                )}
              </span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 leading-tight">
              {t(
                'తెలుగు పండుగలు, ఏకాదశి, ప్రదోషం, సంకష్టహర చతుర్థి & పౌర్ణమి క్యాలెండర్ (12 నెలలు)',
                '12-Month Telugu Festivals, Ekadashi, Pradosham, Sankashti & Pournami Calendar'
              )}
            </h1>
            <p className="text-xs sm:text-base text-amber-200/90 leading-relaxed">
              {t(
                'సూర్యోదయ తిథి సూర్య-చంద్ర స్ఫుటాల ఆధారంగా రాబోయే 12 నెలల ఏకాదశి, ప్రదోషం, సంకష్టహర చతుర్థి, పౌర్ణమి, అమావాస్య, మాస శివరాత్రి & ప్రధాన తెలుగు పండుగ తేదీలు. ఏ రోజైనా పంచాంగం & మీ వ్యక్తిగత సంకల్పాన్ని ఒకే క్లిక్‌తో చూడవచ్చు.',
                'Astronomically computed 12-month Telugu Vrata calendar covering Ekadashi, Pradosham, Sankashtahara Chaturthi, Pournami, Amavasya, and major festivals.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateSankalpam}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-extrabold text-xs sm:text-sm shadow-md whitespace-nowrap shrink-0 cursor-pointer transition-all"
            >
              <Flame size={16} />
              <span>{t('నేటి నిత్య పూజా సంకల్పం (India / USA)', 'Open Automated Daily Sankalpam')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category & Month Filters */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', te: 'అన్ని వ్రతాలు & పండుగలు', en: 'All Vratas & Festivals' },
              { id: 'festival', te: 'ప్రధాన పండుగలు', en: 'Major Festivals' },
              { id: 'ekadashi', te: 'ఏకాదశి', en: 'Ekadashi' },
              { id: 'pradosham', te: 'ప్రదోషం', en: 'Pradosham' },
              { id: 'chaturthi', te: 'సంకష్టహర చతుర్థి', en: 'Sankashti' },
              { id: 'pournami', te: 'పౌర్ణమి', en: 'Pournami' },
              { id: 'amavasya', te: 'అమావాస్య', en: 'Amavasya' },
              { id: 'shivaratri', te: 'మాస శివరాత్రి', en: 'Masa Shivaratri' },
            ] as { id: FilterKey; te: string; en: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                filter === tab.id
                  ? 'bg-[#3c1104] text-amber-100 border-[#3c1104]'
                  : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {t(tab.te, tab.en)}
            </button>
          ))}
        </div>

        {/* Month Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-amber-100">
          <button
            type="button"
            onClick={() => setSelectedMonthIdx('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer border ${
              selectedMonthIdx === 'all'
                ? 'bg-amber-800 text-white border-amber-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
            }`}
          >
            {t('మొత్తం 12 నెలలు', 'All 12 Months')}
          </button>
          {monthlyGroups.map((g, idx) => (
            <button
              key={`${g.year}-${g.monthIndex}`}
              type="button"
              onClick={() => setSelectedMonthIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer border ${
                selectedMonthIdx === idx
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              {language === 'en' ? g.monthLabelEn : g.monthLabelTe}
            </button>
          ))}
        </div>
      </div>

      {/* Month Sections */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <section
            key={`${group.year}-${group.monthIndex}`}
            className="bg-white rounded-3xl border-2 border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2">
                <Star size={18} className="text-amber-600 shrink-0" />
                <span>{language === 'en' ? group.monthLabelEn : group.monthLabelTe}</span>
              </h2>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {t(`${group.events.length} శుభ విశేష దినాలు`, `${group.events.length} Observances`)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.events.map((ev) => {
                const badge = CATEGORY_BADGES[ev.category];
                return (
                  <div
                    key={ev.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-shadow hover:shadow-md ${
                      ev.isMajorFestival
                        ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50/70 border-amber-400'
                        : 'bg-[#fffdf9] border-amber-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-extrabold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                          {ev.isoDate} · {language === 'en' ? ev.weekdayEn : ev.weekdayTe}
                        </span>
                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>
                          {t(badge.labelTe, badge.labelEn)}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-amber-950 leading-snug">
                        {language === 'en' ? ev.titleEn : ev.titleTe}
                      </h3>

                      <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                        {ev.category === 'pournami' ? (
                          <Sun size={12} className="text-amber-600 shrink-0" />
                        ) : (
                          <Moon size={12} className="text-amber-700 shrink-0" />
                        )}
                        <span>
                          {language === 'en'
                            ? `${ev.lunarMonthEn} · ${ev.tithiEn}`
                            : `${ev.lunarMonthTe} · ${ev.tithiTe}`}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {t(ev.significanceTe, ev.significanceEn)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-amber-200/70">
                      <button
                        type="button"
                        onClick={() => onSelectDateForPanchangam(ev.isoDate)}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-900 hover:text-orange-700 cursor-pointer whitespace-nowrap"
                      >
                        <span>{t('ఆ రోజు పంచాంగం', 'Day Panchangam')}</span>
                        <ArrowRight size={13} />
                      </button>

                      {onOpenBooking && (
                        <button
                          type="button"
                          onClick={() => handleBookEvent(ev)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                        >
                          <Sparkles size={11} />
                          <span>{t('సంకల్ప పూజ', 'Book Pooja')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
