import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Compass,
  Clock,
  BookOpen,
  Share2,
  MessageCircle,
  RefreshCw,
  CheckCircle2,
  X,
  ArrowRight,
  Calendar,
  Star,
  Orbit,
  Filter,
} from 'lucide-react';
import {
  ASTROLOGY_INSIGHTS_ARTICLES,
  SIMULATED_PLANETARY_STREAM,
  AstrologyInsightArticle,
} from '../data/astrologyInsightsData';
import {
  SIGN_ENTRIES_2026,
  NAKSHATRA_ENTRIES_2026,
  PLANET_META,
  ASPECT_META,
  getPlanetaryMovementsForDate,
  getPlanetaryMovementsForMonth,
  formatAspectInsightTe,
  formatTeluguDateFriendly,
  formatTeluguTime12Hr,
  getAllRashisDailyGrahaDrishti,
  getDailyGrahaTransitShareLines,
  AspectCode,
} from '../data/planetaryMovements2026';
import { DayData } from '../types/panchangam';

export interface DailyAstrologyInsightsProps {
  currentDay?: DayData;
  onOpenBooking?: () => void;
}

const MONTH_TABS: { key: '2026-10' | '2026-11' | '2026-12'; labelTe: string; labelEn: string }[] = [
  { key: '2026-10', labelTe: 'అక్టోబర్ 2026 (October)', labelEn: 'October 2026' },
  { key: '2026-11', labelTe: 'నవంబర్ 2026 (November)', labelEn: 'November 2026' },
  { key: '2026-12', labelTe: 'డిసెంబర్ 2026 (December)', labelEn: 'December 2026' },
];

export const DailyAstrologyInsights: React.FC<DailyAstrologyInsightsProps> = ({
  currentDay,
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<AstrologyInsightArticle | null>(null);
  const [isRefreshingStream, setIsRefreshingStream] = useState<boolean>(false);
  const [streamLastUpdated, setStreamLastUpdated] = useState<string>('దృక్సిద్ధాంత గణన (Live Ephemeris)');

  // Sync month tab with currentDay if within Oct-Dec 2026
  const initialMonth = useMemo<'2026-10' | '2026-11' | '2026-12'>(() => {
    const prefix = currentDay?.isoDate?.slice(0, 7);
    if (prefix === '2026-10' || prefix === '2026-11' || prefix === '2026-12') {
      return prefix;
    }
    return '2026-10';
  }, [currentDay?.isoDate]);

  const [selectedMonth, setSelectedMonth] = useState<'2026-10' | '2026-11' | '2026-12'>(initialMonth);
  const [aspectScope, setAspectScope] = useState<'selected-day' | 'full-month'>('selected-day');
  const [selectedAspectFilter, setSelectedAspectFilter] = useState<'ALL' | AspectCode>('ALL');
  const [selectedIsoDateFilter, setSelectedIsoDateFilter] = useState<string>('ALL');

  useEffect(() => {
    const prefix = currentDay?.isoDate?.slice(0, 7);
    if (prefix === '2026-10' || prefix === '2026-11' || prefix === '2026-12') {
      setSelectedMonth(prefix);
    }
  }, [currentDay?.isoDate]);

  const activeIsoDate = currentDay?.isoDate || '2026-10-30';
  const dayMovements = useMemo(() => getPlanetaryMovementsForDate(activeIsoDate), [activeIsoDate]);
  const monthMovements = useMemo(() => getPlanetaryMovementsForMonth(selectedMonth), [selectedMonth]);
  const allRashisDrishti = useMemo(
    () => getAllRashisDailyGrahaDrishti(activeIsoDate),
    [activeIsoDate]
  );

  const handleShareDailyTransitAndRashis = () => {
    const transitLines = getDailyGrahaTransitShareLines(activeIsoDate);
    const rashiLines = allRashisDrishti.map(
      (r, idx) =>
        `${idx + 1}. *${r.rashiNameTe} (${r.activeAspectTitleTe}):* ${r.loukikaPhalamTe}`
    );
    const shareText = [
      `🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — నేటి గ్రహ సంచారం & 12 రాశుల గ్రహ దృష్టి ఫలితాలు* 🕉️`,
      `📅 *తేదీ:* ${currentDay?.teediVaram || formatTeluguDateFriendly(activeIsoDate)}`,
      ``,
      `🪐 *నేటి ముఖ్య గ్రహ సంచారం & దృష్టులు:*`,
      ...transitLines,
      ``,
      `🔮 *గ్రహ దృష్టుల వల్ల నేటి 12 రాశుల ఫలితాలు (మేషం నుండి మీనం వరకు):*`,
      ...rashiLines,
      ``,
      `🌐 *పూర్తి నిత్య పంచాంగం కోసం చూడండి:*`,
      `👉 https://telugujyothisham.com/panchangam`,
      ``,
      `సర్వేజనా సుఖినోభవంతు 🙏`,
    ].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Distinct semantic ISO dates in the selected month that have planetary aspects
  const availableIsoDatesInMonth = useMemo(() => {
    const set = new Set<string>();
    monthMovements.aspects.forEach((a) => set.add(a.isoDate));
    return Array.from(set).sort();
  }, [monthMovements.aspects]);

  // Filtered aspects to display in the table
  const displayedAspects = useMemo(() => {
    let base =
      aspectScope === 'selected-day' && dayMovements.aspects.length > 0
        ? dayMovements.aspects
        : monthMovements.aspects;

    if (aspectScope === 'full-month' && selectedIsoDateFilter !== 'ALL') {
      base = base.filter((a) => a.isoDate === selectedIsoDateFilter);
    }

    if (selectedAspectFilter !== 'ALL') {
      base = base.filter((a) => a.aspect === selectedAspectFilter);
    }

    return base;
  }, [aspectScope, dayMovements.aspects, monthMovements.aspects, selectedIsoDateFilter, selectedAspectFilter]);

  // Filter articles based on category
  const filteredArticles =
    selectedCategory === 'all'
      ? ASTROLOGY_INSIGHTS_ARTICLES
      : ASTROLOGY_INSIGHTS_ARTICLES.filter((a) => a.category === selectedCategory);

  const handleRefreshStream = () => {
    setIsRefreshingStream(true);
    setTimeout(() => {
      setStreamLastUpdated(`ఇప్పుడే తాజా గణన పూర్తయింది (${activeIsoDate})`);
      setIsRefreshingStream(false);
    }, 400);
  };

  // Structured Data (JSON-LD) for Google & AI Engine Indexing
  useEffect(() => {
    const scriptId = 'daily-astrology-insights-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '2026 Planetary Movements (Oct-Dec), Sign & Nakshatra Entries & Jyotish Planetary Aspects',
      description:
        'అక్టోబర్, నవంబర్, డిసెంబర్ 2026 గ్రహాల రాశి ప్రవేశాలు, నక్షత్ర ప్రవేశాలు మరియు రోజువారీ జ్యోతిష గ్రహ దృష్టులు - శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
      numberOfItems: SIGN_ENTRIES_2026.length + NAKSHATRA_ENTRIES_2026.length,
      itemListElement: SIGN_ENTRIES_2026.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${entry.planetEn} enters ${entry.signEn} (${entry.isoDate} ${entry.time}) — ${entry.planetTe} ${entry.signTe} ప్రవేశం`,
        description: entry.significanceTe,
      })),
    };

    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

  const handleShareArticle = (article: AstrologyInsightArticle) => {
    const text = `*${article.titleTe}*\n\n${article.summaryTe}\n\nమరిన్ని నిత్య పంచాంగ & జ్యోతిష వివరాలకు telugujyothisham.com చూడండి.\nhttps://telugujyothisham.com/panchangam`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <section
      id="daily-astrology-insights"
      aria-label="Daily Astrology Insights and 2026 Planetary Movements"
      className="my-12 font-telugu space-y-10"
    >
      {/* 1. Header & Selected Date's Exact Jyotish Planetary Aspects Stream */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border-2 border-amber-600/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
              <Orbit size={14} className="text-amber-300" />
              <span>ప్రత్యక్ష గ్రహ గమనం & దృష్టులు • Planetary Movements (Oct–Dec 2026)</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-amber-100 tracking-tight leading-tight">
              నేటి గ్రహ సంచారం, గ్రహ దృష్టులు & 12 రాశుల ఫలితాలు
            </h2>
            <p className="text-amber-200/90 text-sm sm:text-base max-w-3xl leading-relaxed">
              అక్టోబర్, నవంబర్, డిసెంబర్ 2026 నెలలలో ఏ గ్రహం ఎప్పుడు రాశి మారుతుందో, ఏ నక్షత్రంలోకి వస్తుందో మరియు ప్రతిరోజూ ఏర్పడే గ్రహాల కలయిక & దృష్టుల వల్ల మేషం నుండి మీనం వరకు 12 రాశుల వారికి కలిగే సులభమైన ఫలితాలు.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleShareDailyTransitAndRashis}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
              title="నేటి గ్రహ సంచారం & 12 రాశుల ఫలితాలు వాట్సాప్‌లో షేర్ చేయండి"
            >
              <MessageCircle size={15} />
              <span>నేటి గ్రహ సంచారం షేర్ చేయండి</span>
            </button>

            <button
              type="button"
              onClick={handleRefreshStream}
              disabled={isRefreshingStream}
              className="inline-flex items-center gap-2 bg-amber-800/80 hover:bg-amber-700 text-amber-200 border border-amber-500/50 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-inner"
              title="గోచార ప్రవాహాన్ని రిఫ్రెష్ చేయండి"
            >
              <RefreshCw size={14} className={isRefreshingStream ? 'animate-spin' : ''} />
              <span>{isRefreshingStream ? 'లెక్కించబడుతోంది...' : 'గోచార రిఫ్రెష్'}</span>
            </button>
          </div>
        </div>

        {/* Selected Day's Live Jyotish Aspects or Fallback Stream */}
        <div className="mt-8 pt-6 border-t border-amber-800/70">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Compass size={14} className="text-amber-400" />
              <span>
                {dayMovements.aspects.length > 0
                  ? `${currentDay?.teediVaram || formatTeluguDateFriendly(activeIsoDate)} — నేటి గ్రహాల కలయిక & దృష్టులు (${dayMovements.aspects.length}):`
                  : 'నేటి ముఖ్య గ్రహాల గోచార స్థితి (Current Transit Pulse):'}
              </span>
            </span>
            <span className="text-[11px] text-amber-300/90 font-semibold">
              తేదీ: {formatTeluguDateFriendly(activeIsoDate)} • దృక్సిద్ధాంత గణన
            </span>
          </div>

          {/* If the selected date has Sign or Nakshatra entries, highlight them prominently */}
          {(dayMovements.signEntries.length > 0 || dayMovements.nakshatraEntries.length > 0) && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {dayMovements.signEntries.map((s, idx) => (
                <div
                  key={`day-sign-${idx}`}
                  className="bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-500/25 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start gap-3"
                >
                  <span className="text-2xl">{PLANET_META[s.planet].icon}</span>
                  <div>
                    <span className="text-[11px] font-bold bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-md">
                      నేడు రాశి మార్పు • {formatTeluguTime12Hr(s.time)}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {s.planetTe} → {s.signTe} ప్రవేశం
                    </h4>
                    <p className="text-xs text-amber-100/90 mt-0.5">{s.significanceTe}</p>
                  </div>
                </div>
              ))}
              {dayMovements.nakshatraEntries.map((n, idx) => (
                <div
                  key={`day-nak-${idx}`}
                  className="bg-gradient-to-r from-emerald-900/60 to-amber-900/60 border border-emerald-400/60 rounded-2xl p-3.5 flex items-start gap-3"
                >
                  <span className="text-2xl">{PLANET_META[n.planet].icon}</span>
                  <div>
                    <span className="text-[11px] font-bold bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-md">
                      నేడు నక్షత్ర మార్పు • {formatTeluguTime12Hr(n.time)}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {n.planetTe} → {n.nakshatraTe} ప్రవేశం
                    </h4>
                    <p className="text-xs text-emerald-100/90 mt-0.5">{n.significanceTe}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {dayMovements.aspects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dayMovements.aspects.slice(0, 8).map((ev) => {
                const fromMeta = PLANET_META[ev.fromPlanet];
                const toMeta = PLANET_META[ev.toPlanet];
                const aspMeta = ASPECT_META[ev.aspect];
                const isAuspicious = aspMeta.nature === 'auspicious';
                const isIntense = aspMeta.nature === 'intense';

                return (
                  <div
                    key={ev.id}
                    className="bg-amber-950/75 hover:bg-amber-900/80 border border-amber-700/70 rounded-2xl p-3.5 transition-all text-left shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-amber-200 bg-amber-900/90 px-2 py-0.5 rounded-md border border-amber-600/50">
                          🕒 {formatTeluguTime12Hr(ev.time)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isAuspicious
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                              : isIntense
                              ? 'bg-amber-400/20 text-amber-200 border border-amber-400/50'
                              : 'bg-stone-800 text-stone-200 border border-stone-600/40'
                          }`}
                        >
                          {aspMeta.shortTe}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {fromMeta.icon} {fromMeta.nameTe} → {toMeta.icon} {toMeta.nameTe}
                      </h4>
                      <span className="text-[11px] text-amber-300 font-semibold block mt-0.5">
                        {aspMeta.labelTe}
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-100/85 leading-normal mt-2 pt-2 border-t border-amber-800/60">
                      {formatAspectInsightTe(ev)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {SIMULATED_PLANETARY_STREAM.map((item) => {
                const isPositive = item.intensity === 'positive';
                const isCaution = item.intensity === 'caution';
                return (
                  <div
                    key={item.id}
                    className="bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60 rounded-2xl p-3.5 transition-all text-left shadow-2xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-base sm:text-lg">{item.planetIcon}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPositive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                              : isCaution
                              ? 'bg-red-950 text-red-300 border border-red-600/40'
                              : 'bg-amber-900 text-amber-200 border border-amber-600/40'
                          }`}
                        >
                          {item.movementType.split(' ')[0]}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-amber-100 group-hover:text-amber-200 block truncate">
                        {item.planet}
                      </h4>
                      <span className="text-[11px] text-amber-300 block font-medium">
                        {item.signTe}
                      </span>
                      <span className="text-[10px] text-amber-400/70 block mt-0.5">
                        {item.nakshatraTe}
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-100/80 leading-normal mt-2 pt-2 border-t border-amber-800/60 line-clamp-3">
                      {item.insightTe}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 1B. RASHI-WISE DAILY PREDICTIONS FROM GRAHA DRISHTI (మేషం నుండి మీనం వరకు 12 రాశుల ఫలితాలు) */}
      <div className="bg-gradient-to-b from-amber-50/90 via-white to-orange-50/50 rounded-3xl p-5 sm:p-8 border-2 border-amber-300 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              గ్రహ దృష్టుల వల్ల ద్వాదశ రాశి ఫలితాలు • Daily Rashi Impact ({formatTeluguDateFriendly(activeIsoDate)})
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-amber-950 mt-1">
              ఈ రోజు ఏ రాశి వారికి ఏ గ్రహ దృష్టి వల్ల ఏ ఫలితం ఉంటుంది? (మేషం – మీనం)
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              కఠినమైన జ్యోతిష పదాలు లేకుండా, ప్రతి రాశి వారికి ఈ రోజు ఏర్పడే గ్రహ దృష్టి/కలయిక వల్ల ఉద్యోగం, డబ్బు రాబడి, కుటుంబం మరియు ఆరోగ్యంలో కలిగే ఫలితాలు:
            </p>
          </div>

          <button
            type="button"
            onClick={handleShareDailyTransitAndRashis}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <MessageCircle size={16} />
            <span>12 రాశుల గ్రహ దృష్టి ఫలితాలు షేర్ చేయండి</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allRashisDrishti.map((item) => {
            const isAusp = item.mood === 'auspicious';
            const isCare = item.mood === 'careful';
            return (
              <div
                key={item.rashiId}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isAusp
                    ? 'bg-emerald-50/40 border-emerald-300/90'
                    : isCare
                    ? 'bg-rose-50/40 border-rose-300/90'
                    : 'bg-amber-50/50 border-amber-300/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-base font-extrabold text-amber-950">
                        {item.rashiNameTe}{' '}
                        <span className="text-xs font-normal text-stone-500">({item.rashiNameEn})</span>
                      </h4>
                      <span className="text-[11px] text-stone-600">
                        రాశ్యాధిపతి: <strong className="text-amber-900">{item.lordNameTe}</strong>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        isAusp
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : isCare
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {isAusp ? 'శుభ ఫలితం' : isCare ? 'కొంచెం జాగ్రత్త' : 'మిశ్రమ శుభం'}
                    </span>
                  </div>

                  <div className="bg-white/90 rounded-xl p-2.5 border border-amber-200/80 mb-2.5">
                    <span className="text-[11px] font-bold text-amber-900 block">
                      🪐 నేటి గ్రహ దృష్టి: {item.activeAspectTitleTe}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-1 mt-0.5">
                      <span className="text-[11px] text-stone-500">
                        🕒 దృష్టి సమయం: {item.activeAspectTimeTe}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ⏰ శుభ సమయం: {item.luckyTimeWindowTe}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-stone-800 leading-relaxed font-medium mb-2.5">
                    {item.loukikaPhalamTe}
                  </p>

                  <div className="space-y-1.5 bg-white/80 rounded-xl p-2.5 border border-amber-200/70 text-[11px]">
                    <p className="text-emerald-950 leading-snug">
                      <strong className="text-emerald-800">✅ నేడు చేయవలసిన పని:</strong> {item.doTodayTe}
                    </p>
                    <p className="text-rose-950 leading-snug">
                      <strong className="text-rose-800">⚠️ నేడు జాగ్రత్త:</strong> {item.avoidTodayTe}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-amber-200/70 text-[11px] text-amber-950">
                  <strong className="text-amber-900">🙏 నేటి పరిహారం:</strong> {item.remedyShortTe}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. COMPLETE OCT - NOV - DEC 2026 PLANETARY MOVEMENTS & JYOTISH ASPECTS EXPLORER */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-amber-300/90 shadow-lg space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
              దృక్సిద్ధాంత గ్రహ సంచార పట్టిక • Drik Jyotish Ephemeris 2026
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-amber-950 mt-1">
              అక్టోబర్, నవంబర్ & డిసెంబర్ 2026 — గ్రహాల రాశి మార్పులు, నక్షత్ర మార్పులు & గ్రహ దృష్టులు
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              ఏ తేదీన, ఏ సమయానికి ఏ గ్రహం రాశి మారుతుందో, ఏ నక్షత్రంలోకి ప్రవేశిస్తుందో మరియు ఏ గ్రహంతో కలుస్తుందో లేదా ఏ గ్రహంపై దృష్టి వేస్తుందో సులభమైన తెలుగులో పూర్తి వివరాలు.
            </p>
          </div>

          {/* Month Selector Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1.5 bg-amber-100/90 p-1.5 rounded-2xl border border-amber-300 shrink-0">
            {MONTH_TABS.map((m) => {
              const active = selectedMonth === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(m.key);
                    setSelectedIsoDateFilter('ALL');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-amber-900 text-white shadow-sm'
                      : 'text-amber-950 hover:bg-amber-200/70'
                  }`}
                >
                  {m.labelTe}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2A. Entry of Planets into Signs & Entry of Planets into Nakshatras (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Entry into Signs */}
          <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200">
            <h4 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2 pb-3 mb-3 border-b border-amber-200">
              <Star size={18} className="text-amber-600 shrink-0" />
              <span>1. గ్రహాల రాశి మార్పులు (Entry of Planets into Signs)</span>
            </h4>
            <div className="space-y-3">
              {monthMovements.signEntries.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-3.5 border border-amber-200/90 shadow-2xs flex flex-col gap-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-950">
                      <span>{PLANET_META[s.planet].icon}</span>
                      <span>{s.planetTe}</span>
                      <span className="text-amber-700">→</span>
                      <span className="text-emerald-800">{s.signTe}</span>
                    </span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300">
                      📅 {formatTeluguDateFriendly(s.isoDate)} • 🕒 {formatTeluguTime12Hr(s.time)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed pt-1 border-t border-amber-100">
                    {s.significanceTe}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Entry into Nakshatras */}
          <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200">
            <h4 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2 pb-3 mb-3 border-b border-amber-200">
              <Sparkles size={18} className="text-amber-600 shrink-0" />
              <span>2. గ్రహాల నక్షత్ర మార్పులు (Entry of Planets in Nakshatras)</span>
            </h4>
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {monthMovements.nakshatraEntries.map((n, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-3 border border-amber-200/90 shadow-2xs flex flex-col gap-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-950">
                      <span>{PLANET_META[n.planet].icon}</span>
                      <span>{n.planetTe}</span>
                      <span className="text-amber-700">→</span>
                      <span className="text-amber-900">{n.nakshatraTe}</span>
                    </span>
                    <span className="text-[11px] font-bold bg-amber-100/80 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                      📅 {formatTeluguDateFriendly(n.isoDate)} • 🕒 {formatTeluguTime12Hr(n.time)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-normal pt-1 border-t border-amber-50">
                    {n.significanceTe}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2B. Planetary Aspects of Jyotish Interactive Table */}
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-6 border border-amber-200/90 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-xl font-bold text-amber-950 flex items-center gap-2">
                <Calendar size={18} className="text-amber-700 shrink-0" />
                <span>3. రోజువారీ గ్రహాల కలయిక & గ్రహ దృష్టుల పట్టిక (Daily Planetary Aspects)</span>
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                గ్రహాల కలయిక = ఒకే రాశిలో రెండు గ్రహాలు కలవడం • ఎదురెదురు పూర్ణ దృష్టి = 7వ దృష్టి • 5వ/9వ దృష్టి = అదృష్ట & దైవ బల దృష్టి • 4వ/10వ దృష్టి = ఇల్లు & ఉద్యోగ విజయం
              </p>
            </div>

            {/* Scope Toggle: Selected Panchangam Date vs Full Month */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center bg-amber-100/90 p-1 rounded-xl border border-amber-300">
                <button
                  type="button"
                  onClick={() => setAspectScope('selected-day')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectScope === 'selected-day'
                      ? 'bg-amber-900 text-white shadow-2xs'
                      : 'text-amber-950 hover:bg-amber-200/60'
                  }`}
                >
                  ఎంచుకున్న తేదీ: {formatTeluguDateFriendly(activeIsoDate)} ({dayMovements.aspects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAspectScope('full-month')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectScope === 'full-month'
                      ? 'bg-amber-900 text-white shadow-2xs'
                      : 'text-amber-950 hover:bg-amber-200/60'
                  }`}
                >
                  నెల మొత్తం ({monthMovements.aspects.length})
                </button>
              </div>
            </div>
          </div>

          {/* Aspect Type Filter & Day Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200/70">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-stone-600 inline-flex items-center gap-1 mr-1">
                <Filter size={12} /> గ్రహ దృష్టి రకం:
              </span>
              {(['ALL', 'C', 'S', '5', '9', '4', '10', '3', '8'] as const).map((code) => {
                const active = selectedAspectFilter === code;
                const label =
                  code === 'ALL' ? 'అన్నీ (All)' : ASPECT_META[code].shortTe;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedAspectFilter(code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      active
                        ? 'bg-amber-800 text-white border-amber-900'
                        : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/70'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {aspectScope === 'full-month' && (
              <div className="flex items-center gap-2">
                <label htmlFor="aspect-date-select" className="text-xs font-bold text-stone-700">
                  తేదీని ఎంచుకోండి:
                </label>
                <select
                  id="aspect-date-select"
                  value={selectedIsoDateFilter}
                  onChange={(e) => setSelectedIsoDateFilter(e.target.value)}
                  className="bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-950"
                >
                  <option value="ALL">నెలలోని అన్ని తేదీలు</option>
                  {availableIsoDatesInMonth.map((dateIso) => (
                    <option key={dateIso} value={dateIso}>
                      {formatTeluguDateFriendly(dateIso)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Aspects Table */}
          <div className="overflow-x-auto max-h-[460px] overflow-y-auto rounded-xl border border-amber-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-amber-100/90 text-amber-950 text-xs uppercase sticky top-0 z-10 border-b border-amber-300">
                <tr>
                  <th className="py-2.5 px-3 font-bold">తేదీ & సమయం</th>
                  <th className="py-2.5 px-3 font-bold">ఏ గ్రహాల మధ్య</th>
                  <th className="py-2.5 px-3 font-bold">గ్రహ దృష్టి / కలయిక రకం</th>
                  <th className="py-2.5 px-3 font-bold">మన నిత్య జీవితంపై ఫలితం</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-xs sm:text-sm">
                {displayedAspects.map((ev) => {
                  const fromMeta = PLANET_META[ev.fromPlanet];
                  const toMeta = PLANET_META[ev.toPlanet];
                  const aspMeta = ASPECT_META[ev.aspect];
                  return (
                    <tr key={ev.id} className="hover:bg-amber-50/70 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap text-stone-700">
                        <strong className="text-amber-950 block">{formatTeluguDateFriendly(ev.isoDate)}</strong>
                        <span className="text-xs text-amber-800 font-semibold">{formatTeluguTime12Hr(ev.time)}</span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-amber-950">
                        <span>
                          {fromMeta.icon} {fromMeta.nameTe}
                        </span>
                        <span className="mx-1.5 text-amber-700">→</span>
                        <span>
                          {toMeta.icon} {toMeta.nameTe}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-block bg-amber-100 text-amber-950 border border-amber-300 font-bold px-2.5 py-1 rounded-lg text-xs">
                          {aspMeta.labelTe}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-700 text-xs leading-relaxed">
                        {formatAspectInsightTe(ev)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation Tabs for Articles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-1 bg-amber-100/80 p-1 rounded-2xl border border-amber-300 shadow-2xs overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'అన్ని వ్యాసాలు (All Articles)' },
            { id: 'transit', label: 'గ్రహ సంచారం (Transit)' },
            { id: 'remedies', label: 'పూజ & పరిహారాలు (Remedies)' },
            { id: 'muhurtham', label: 'ముహూర్త సూత్రాలు (Muhurtham)' },
            { id: 'lifestyle', label: 'జీవనశైలి & ధైర్యం (Lifestyle)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-amber-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-semibold">
          {filteredArticles.length} వ్యాసాలు లభ్యమవుతున్నాయి
        </span>
      </div>

      {/* 4. Article Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Top metadata */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300/60">
                  <BookOpen size={12} className="text-amber-700" />
                  <span>{article.categoryLabelTe}</span>
                </span>

                <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                  <Clock size={12} />
                  <span>{article.readTimeMinutes} నిమిషాల పఠనం</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-amber-950 leading-snug mb-2 hover:text-amber-800 transition-colors">
                {article.titleTe}
              </h3>

              {/* Excerpt */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                {article.summaryTe}
              </p>

              {/* Key Takeaways Box */}
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 mb-5">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>నేటి ముఖ్యాంశాలు (Key Takeaways):</span>
                </span>
                <ul className="space-y-1.5">
                  {article.keyTakeawaysTe.map((point, idx) => (
                    <li key={idx} className="text-xs text-stone-700 leading-normal flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Mantra snippet */}
              {article.recommendedMantraTe && (
                <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200 text-xs text-amber-950 mb-4">
                  <span className="font-bold text-amber-900 block mb-0.5">మంత్ర సాధన (Mantra):</span>
                  <span className="italic font-serif">{article.recommendedMantraTe}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-amber-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveArticle(article)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-700 underline underline-offset-4 cursor-pointer"
              >
                <span>సంపూర్ణ వ్యాసం చదవండి (Read Full Article)</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => handleShareArticle(article)}
                className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                title="వాట్సాప్‌లో షేర్ చేయండి"
              >
                <Share2 size={13} />
                <span>షేర్</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* 5. Full Article Reading Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-300 shadow-2xl p-6 sm:p-8 font-telugu text-stone-900 relative">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full p-2 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="space-y-4">
              <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                {activeArticle.categoryLabelTe}
              </span>

              <h2 className="text-xl sm:text-3xl font-black text-amber-950 leading-tight">
                {activeArticle.titleTe}
              </h2>

              <div className="flex items-center gap-3 text-xs text-stone-500 pb-3 border-b border-amber-100">
                <span>
                  రచన: <strong>{activeArticle.author}</strong>
                </span>
                <span>•</span>
                <span>{activeArticle.readTimeMinutes} నిమిషాల పఠనం</span>
              </div>

              {/* Paragraphs */}
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed pt-2">
                {activeArticle.contentParagraphsTe.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Planetary impacts */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="text-sm font-bold text-amber-950 mb-2">
                  గ్రహ ప్రభావాలు (Planetary Influences):
                </h4>
                <div className="grid sm:grid-cols-3 gap-2 text-xs">
                  {activeArticle.planetaryImpactsTe.map((item, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <strong className="text-amber-900 block">{item.planet}</strong>
                      <span className="text-stone-600 block mt-0.5">{item.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mantra */}
              {activeArticle.recommendedMantraTe && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-center">
                  <span className="text-xs uppercase font-bold text-amber-900 block mb-1">
                    సూచించిన మంత్ర జపం (Prescribed Vedic Mantra)
                  </span>
                  <p className="text-sm sm:text-base font-bold text-amber-950 italic font-serif">
                    "{activeArticle.recommendedMantraTe}"
                  </p>
                </div>
              )}

              {/* Modal CTA */}
              <div className="pt-6 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleShareArticle(activeArticle)}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-md"
                >
                  <MessageCircle size={16} />
                  <span>వాట్సాప్‌లో షేర్ చేయండి</span>
                </button>

                {onOpenBooking && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveArticle(null);
                      onOpenBooking();
                    }}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-md"
                  >
                    <Sparkles size={16} />
                    <span>పూజా సేవ బుకింగ్</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
