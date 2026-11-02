import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Sun, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import {
  CityTimingConfig,
  SUPPORTED_CITY_CONFIGS,
  addDaysIso,
  computeCityLocalPanchangam,
  generateStaticDateParams,
  getTodayIsoDateIST,
} from '../seo/panchangamSsrEngine';
import { WEEK_DATA } from '../data/panchangamData';
import { getOrGenerateDayData } from '../utils/astronomyPanchangam';
import { useLanguage } from '../context/LanguageContext';

export interface DailyPanchangamRouteBarProps {
  selectedIsoDate: string;
  activeCitySlug?: CityTimingConfig['slug'] | null;
  isCalendarView?: boolean;
  onSelectIsoDate: (isoDate: string) => void;
  onSelectCitySlug: (citySlug: CityTimingConfig['slug'] | null) => void;
  onToggleCalendarView: (show: boolean) => void;
}

export const DailyPanchangamRouteBar: React.FC<DailyPanchangamRouteBarProps> = ({
  selectedIsoDate,
  activeCitySlug,
  isCalendarView = false,
  onSelectIsoDate,
  onSelectCitySlug,
  onToggleCalendarView,
}) => {
  const { t, tr } = useLanguage();
  const todayIso = getTodayIsoDateIST();
  const prevDate = addDaysIso(selectedIsoDate, -1);
  const nextDate = addDaysIso(selectedIsoDate, 1);

  const cityPanchangam = computeCityLocalPanchangam(
    selectedIsoDate,
    activeCitySlug || 'hyderabad'
  );

  const calendar60 = React.useMemo(() => generateStaticDateParams(60, 0), []);

  return (
    <div className="space-y-6 font-telugu">
      {/* Prev / Today / Next Date & Monthly Calendar Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/panchangam/${prevDate}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleCalendarView(false);
              onSelectIsoDate(prevDate);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs sm:text-sm font-bold transition-colors"
          >
            <ChevronLeft size={15} className="text-amber-700" />
            <span>{t(`నిన్నటి పంచాంగం (${prevDate})`, `Prev Day (${prevDate})`)}</span>
          </a>

          <a
            href={`/panchangam/${todayIso}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleCalendarView(false);
              onSelectIsoDate(todayIso);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              selectedIsoDate === todayIso && !isCalendarView
                ? 'bg-gradient-to-r from-amber-800 to-amber-950 text-amber-100 shadow-sm'
                : 'bg-amber-100/80 hover:bg-amber-200 text-amber-950 border border-amber-400'
            }`}
          >
            <Sun size={14} className="text-amber-400" />
            <span>{t(`నేటి పంచాంగం (${todayIso})`, `Today (${todayIso})`)}</span>
          </a>

          <a
            href={`/panchangam/${nextDate}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleCalendarView(false);
              onSelectIsoDate(nextDate);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs sm:text-sm font-bold transition-colors"
          >
            <span>{t(`రేపటి పంచాంగం (${nextDate})`, `Next Day (${nextDate})`)}</span>
            <ChevronRight size={15} className="text-amber-700" />
          </a>

          <a
            href="/panchangam/calendar"
            onClick={(e) => {
              e.preventDefault();
              onToggleCalendarView(!isCalendarView);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all ${
              isCalendarView
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-700 shadow-sm'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-400'
            }`}
          >
            <Calendar size={14} className={isCalendarView ? 'text-amber-100' : 'text-amber-700'} />
            <span>{t('60 రోజుల పంచాంగం క్యాలెండర్', '60-Day Monthly Calendar')}</span>
          </a>
        </div>

        {/* City Local Timings Switcher: Hyderabad, Vijayawada, Visakhapatnam, USA */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1 mr-1">
            <MapPin size={14} className="text-amber-700" />
            <span>{t('నగర సమయాలు:', 'City Timings:')}</span>
          </span>
          {(['hyderabad', 'vijayawada', 'visakhapatnam', 'usa'] as const).map((slug) => {
            const cfg = SUPPORTED_CITY_CONFIGS[slug];
            const isSelected = (activeCitySlug || 'hyderabad') === slug;
            return (
              <a
                key={slug}
                href={`/panchangam/${slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleCalendarView(false);
                  onSelectCitySlug(slug);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-amber-900 text-amber-100 border-amber-900 shadow-2xs'
                    : 'bg-amber-50/80 hover:bg-amber-100 text-amber-950 border-amber-300'
                }`}
              >
                {t(cfg.nameTe, cfg.nameEn.split(' ')[0])}
              </a>
            );
          })}
        </div>
      </div>

      {/* City Local Timings Highlight Card */}
      {activeCitySlug && (
        <section
          aria-label={`${cityPanchangam.city.nameEn} Local Panchangam Timings`}
          className="bg-gradient-to-r from-[#fff8eb] via-amber-50 to-[#fff8eb] rounded-3xl p-5 sm:p-6 border-2 border-amber-400 shadow-sm space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                {t('ప్రాంతీయ ఖగోళ సూర్యోదయ గణన • Local Astronomical Timings', 'Local Astronomical Timings')}
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950">
                {t(
                  `${cityPanchangam.city.nameTe} నేటి పంచాంగం సమయాలు (${selectedIsoDate})`,
                  `${cityPanchangam.city.nameEn} Panchangam Timings (${selectedIsoDate})`
                )}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-900 text-amber-100 self-start sm:self-auto">
              {cityPanchangam.city.tzLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs sm:text-sm">
            <div className="bg-white rounded-2xl p-3.5 border border-amber-200">
              <span className="text-slate-600 font-bold block">
                {t('సూర్యోదయం / సూర్యాస్తమయం', 'Sunrise / Sunset')}
              </span>
              <strong className="text-amber-950 text-sm sm:text-base mt-1 block">
                {cityPanchangam.sunrise} – {cityPanchangam.sunset}
              </strong>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-amber-200">
              <span className="text-slate-600 font-bold block">
                {t('తిథి & నక్షత్రం', 'Tithi & Nakshatra')}
              </span>
              <strong className="text-amber-950 text-sm mt-1 block">
                {tr(cityPanchangam.tithi)} • {tr(cityPanchangam.nakshatram)}
              </strong>
            </div>
            <div className="bg-rose-50/90 rounded-2xl p-3.5 border border-rose-200">
              <span className="text-rose-900 font-bold flex items-center gap-1">
                <ShieldAlert size={13} className="text-rose-700" />
                <span>{t('రాహుకాలం (Rahukalam)', 'Rahu Kalam')}</span>
              </span>
              <strong className="text-rose-950 text-sm sm:text-base mt-1 block">
                {cityPanchangam.rahukalam}
              </strong>
            </div>
            <div className="bg-rose-50/90 rounded-2xl p-3.5 border border-rose-200">
              <span className="text-rose-900 font-bold flex items-center gap-1">
                <Clock size={13} className="text-rose-700" />
                <span>{t('వర్జ్యం (Varjyam)', 'Varjyam')}</span>
              </span>
              <strong className="text-rose-950 text-sm sm:text-base mt-1 block">
                {cityPanchangam.varjyam}
              </strong>
            </div>
            <div className="bg-emerald-50/90 rounded-2xl p-3.5 border border-emerald-300">
              <span className="text-emerald-900 font-bold flex items-center gap-1">
                <Sparkles size={13} className="text-emerald-700" />
                <span>{t('అభిజిత్ ముహూర్తం (Abhijit)', 'Abhijit Muhurtham')}</span>
              </span>
              <strong className="text-emerald-950 text-sm sm:text-base mt-1 block">
                {cityPanchangam.abhijitMuhurtham}
              </strong>
            </div>
          </div>

          {/* Visible Calculation Standard Line for City Page (E-E-A-T Requirement 7) */}
          <p className="text-xs font-mono text-amber-900/90 pt-1">
            Calculation: Drik Siddhanta, Lahiri Chitrapaksha Ayanamsa (NASA JPL DE440 Ephemeris), location: {cityPanchangam.city.nameEn} ({cityPanchangam.city.lat}° N, {cityPanchangam.city.lon}° E)
          </p>

          {cityPanchangam.usaZones && (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse text-xs sm:text-sm bg-white rounded-2xl overflow-hidden border border-amber-200">
                <thead>
                  <tr className="bg-amber-100 text-amber-950 font-bold">
                    <th className="p-3 border-b border-amber-200">USA Time Zone</th>
                    <th className="p-3 border-b border-amber-200">Major NRI Cities</th>
                    <th className="p-3 border-b border-amber-200">Sunrise / Sunset</th>
                    <th className="p-3 border-b border-amber-200 text-rose-900">Rahu Kalam</th>
                    <th className="p-3 border-b border-amber-200 text-emerald-900">Abhijit Muhurtham</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {cityPanchangam.usaZones.map((z) => (
                    <tr key={z.zone} className="hover:bg-amber-50/60">
                      <td className="p-3 font-bold text-amber-950">{z.zone}</td>
                      <td className="p-3 text-slate-700">{z.cityExample}</td>
                      <td className="p-3 font-mono font-semibold text-slate-900">
                        {z.sunrise} – {z.sunset}
                      </td>
                      <td className="p-3 font-mono font-bold text-rose-800">{z.rahukalam}</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">{z.abhijit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* 60-Day / Monthly Calendar Table View */}
      {isCalendarView && (
        <section
          aria-label="60-Day Monthly Telugu Panchangam Calendar"
          className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-amber-300 shadow-md space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                {t('60 రోజుల దృక్సిద్ధాంత పంచాంగ క్యాలెండర్ • Pre-built 60-Day Almanac', '60-Day Telugu Panchangam Calendar')}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-amber-950">
                {t(
                  'నెలవారీ తెలుగు పంచాంగం క్యాలెండర్ (తిథి, నక్షత్రం, రాహుకాలం)',
                  'Monthly Telugu Panchangam Calendar (Next 60 Days)'
                )}
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-amber-100 text-amber-950 font-bold">
                  <th className="p-3 border border-amber-200">{t('తేదీ (Date)', 'Date')}</th>
                  <th className="p-3 border border-amber-200">{t('తెలుగు వారం & మాసం', 'Telugu Day & Month')}</th>
                  <th className="p-3 border border-amber-200">{t('తిథి (Tithi)', 'Tithi')}</th>
                  <th className="p-3 border border-amber-200">{t('నక్షత్రం (Nakshatram)', 'Nakshatram')}</th>
                  <th className="p-3 border border-amber-200 text-rose-900">{t('రాహుకాలం', 'Rahu Kalam')}</th>
                  <th className="p-3 border border-amber-200 text-emerald-900">{t('అమృత ఘడియలు', 'Amrutha Gadiyalu')}</th>
                </tr>
              </thead>
              <tbody>
                {calendar60.map(({ date }) => {
                  const d = getOrGenerateDayData(date, WEEK_DATA);
                  const isActiveDate = date === selectedIsoDate;
                  return (
                    <tr
                      key={date}
                      className={isActiveDate ? 'bg-amber-100/80 font-bold' : 'hover:bg-amber-50/70'}
                    >
                      <td className="p-3 border border-amber-200 whitespace-nowrap">
                        <a
                          href={`/panchangam/${date}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onToggleCalendarView(false);
                            onSelectIsoDate(date);
                          }}
                          className="text-amber-900 hover:text-orange-700 underline font-mono font-bold"
                        >
                          {date}
                        </a>
                      </td>
                      <td className="p-3 border border-amber-200 text-slate-800">{tr(d.teediVaram)}</td>
                      <td className="p-3 border border-amber-200 font-semibold text-amber-950">
                        {tr(d.panchanga.tithi)}
                      </td>
                      <td className="p-3 border border-amber-200 font-semibold text-orange-950">
                        {tr(d.panchanga.nakshatram)}
                      </td>
                      <td className="p-3 border border-amber-200 text-rose-900 font-mono">
                        {tr(d.ashubha.rahukalam)}
                      </td>
                      <td className="p-3 border border-amber-200 text-emerald-900 font-mono">
                        {tr(d.shubha.amrutha)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
