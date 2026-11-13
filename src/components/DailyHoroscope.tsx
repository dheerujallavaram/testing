import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Star,
  AlertTriangle,
  CheckCircle2,
  Info,
  Share2,
  Clock,
  Compass,
  Download,
  CalendarDays,
  CalendarRange,
  Orbit,
  Film,
  Loader2,
  Copy,
  Check,
  Hash,
} from 'lucide-react';
import { DayData } from '../types/panchangam';
import {
  RASHI_META_LIST,
  findMoonRashiIndex,
  getDailyRashiFortunes,
  generateHoroscopeShareText,
  RashiDailyFortune,
} from '../utils/panchangaLogic';
import {
  getShiftedDayData,
  computePerRashiNakshatraTarabalam,
  computeWeeklyRashiOutlook,
  computeMonthlyGocharaOutlookForAllRashis,
} from '../utils/rashiTimeframeEngine';
import { downloadRashiStatusCardImage } from '../utils/panchangamImageGenerator';
import { RashiMedallion, RashiGlyph } from './RashiGlyph';
import { useLanguage, Language } from '../context/LanguageContext';
import { computeDailyJHoraYogiAndPakshi } from '../utils/jhoraAdvancedEngine';
import { FamilyProfilesVaultBar } from './FamilyProfilesVaultBar';
import { PersonalDailyScoreWidget } from './PersonalDailyScoreWidget';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';
import { AdminTelegramDailyBroadcaster } from './AdminTelegramDailyBroadcaster';
import {
  DailyReelResult,
  generateDailyRashiReelVideo,
  generateDailyPanchangamReelVideo,
  generateDailyVideoSocialPack,
  getSpotlightRashiIndex,
} from '../utils/dailyPanchangamVideoRecorder';

interface DailyHoroscopeProps {
  day: DayData;
  externalSelectedRashiId?: string;
  onSelectRashiRoute?: (rashiId: string) => void;
}

type HoroscopeTimeframe = 'today' | 'tomorrow' | 'weekly' | 'monthly';

const RASHI_EXTRA_META: Record<
  string,
  { syllablesTe: string; luckyDirectionTe: string; luckyDirectionEn: string }
> = {
  mesham: { syllablesTe: 'చూ, చే, చో, లా, లీ, లూ, లే, లో, ఆ', luckyDirectionTe: 'తూర్పు (East)', luckyDirectionEn: 'East' },
  vrushabham: { syllablesTe: 'ఈ, ఊ, ఏ, ఓ, వా, వీ, వూ, వే, వో', luckyDirectionTe: 'ఆగ్నేయం (South-East)', luckyDirectionEn: 'South-East' },
  mithunam: { syllablesTe: 'కా, కీ, కూ, ఖం, ఙ, ఛా, కే, కో, హా', luckyDirectionTe: 'ఉత్తరం (North)', luckyDirectionEn: 'North' },
  karkatakam: { syllablesTe: 'హీ, హూ, హే, హో, డా, డీ, డూ, డే, డో', luckyDirectionTe: 'వాయువ్యం (North-West)', luckyDirectionEn: 'North-West' },
  simham: { syllablesTe: 'మా, మీ, మూ, మే, మో, టా, టీ, టూ, టే', luckyDirectionTe: 'తూర్పు (East)', luckyDirectionEn: 'East' },
  kanya: { syllablesTe: 'టో, పా, పీ, పూ, షం, ణా, ఠా, పే, పో', luckyDirectionTe: 'ఉత్తరం (North)', luckyDirectionEn: 'North' },
  tula: { syllablesTe: 'రా, రీ, రూ, రే, రో, తా, తీ, తూ, తే', luckyDirectionTe: 'పడమర / ఆగ్నేయం', luckyDirectionEn: 'West / South-East' },
  vruschikam: { syllablesTe: 'తో, నా, నీ, నూ, నే, నో, యా, యీ, యూ', luckyDirectionTe: 'ఉత్తరం / తూర్పు', luckyDirectionEn: 'North / East' },
  dhanussu: { syllablesTe: 'యే, యో, భా, భీ, భూ, ధా, ఫా, ఢా, భే', luckyDirectionTe: 'ఈశాన్యం (North-East)', luckyDirectionEn: 'North-East' },
  makaram: { syllablesTe: 'భో, జా, జీ, జూ, జే, జో, ఖా, గా, గీ', luckyDirectionTe: 'పడమర (West)', luckyDirectionEn: 'West' },
  kumbham: { syllablesTe: 'గూ, గే, గో, సా, సీ, సూ, సే, సో, దా', luckyDirectionTe: 'పడమర (West)', luckyDirectionEn: 'West' },
  meenam: { syllablesTe: 'దీ, దూ, థ, ఝ, ఞ, దే, దో, చా, చీ', luckyDirectionTe: 'ఈశాన్యం (North-East)', luckyDirectionEn: 'North-East' },
};

function stripLeadingIndex(text: string): string {
  return text.replace(/^\d+\.\s*[^:]+:\s*/, '').trim();
}

export const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({
  day,
  externalSelectedRashiId,
  onSelectRashiRoute,
}) => {
  const [timeframe, setTimeframe] = useState<HoroscopeTimeframe>('today');
  const [filter, setFilter] = useState<'all' | 'favorable' | 'mixed' | 'caution'>('all');
  const [selectedRashiId, setSelectedRashiId] = useState<string>(externalSelectedRashiId || 'all');
  const [downloadingRashiId, setDownloadingRashiId] = useState<string | null>(null);
  const [downloadedRashiId, setDownloadedRashiId] = useState<string | null>(null);
  const [isRecordingRashiVideo, setIsRecordingRashiVideo] = useState<boolean>(false);
  const [rashiVideoProgress, setRashiVideoProgress] = useState<number>(0);
  const [rashiVideoStatus, setRashiVideoStatus] = useState<string>('');
  const [rashiVideoResult, setRashiVideoResult] = useState<DailyReelResult | null>(null);
  const [socialPackKind, setSocialPackKind] = useState<'rashi' | 'panchangam' | null>(null);
  const [copiedSocialKey, setCopiedSocialKey] = useState<string | null>(null);
  const [spotlightRashiChoice, setSpotlightRashiChoice] = useState<string>('auto');
  const [showTelegramBroadcaster, setShowTelegramBroadcaster] = useState<boolean>(false);
  const { language, t, tr } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();

  React.useEffect(() => {
    if (externalSelectedRashiId) {
      setSelectedRashiId(externalSelectedRashiId);
      setFilter('all');
    } else {
      setSelectedRashiId('all');
    }
  }, [externalSelectedRashiId]);

  const handleChooseRashi = (rashiId: string) => {
    setSelectedRashiId(rashiId);
    setFilter('all');
    if (onSelectRashiRoute) {
      onSelectRashiRoute(rashiId);
    }
  };

  const activeDay = useMemo(() => {
    if (timeframe === 'tomorrow') {
      return getShiftedDayData(day.isoDate, 1);
    }
    return day;
  }, [day, timeframe]);

  const moonRashiIdx = useMemo(() => findMoonRashiIndex(activeDay), [activeDay]);
  const moonRashiMeta = RASHI_META_LIST[moonRashiIdx] || RASHI_META_LIST[0];
  const jhoraDaily = useMemo(() => computeDailyJHoraYogiAndPakshi(activeDay), [activeDay]);
  const rashiCards = useMemo(() => getDailyRashiFortunes(activeDay), [activeDay]);
  const tarabalamByRashi = useMemo(() => computePerRashiNakshatraTarabalam(activeDay), [activeDay]);

  const weeklyOutlook = useMemo(() => {
    if (timeframe !== 'weekly') return null;
    return computeWeeklyRashiOutlook(day);
  }, [day, timeframe]);

  const monthlyOutlook = useMemo(() => {
    if (timeframe !== 'monthly') return null;
    return computeMonthlyGocharaOutlookForAllRashis(day.isoDate);
  }, [day.isoDate, timeframe]);

  const handleDownloadStatusCard = async (rashi: RashiDailyFortune, targetLang?: Language) => {
    setDownloadingRashiId(rashi.id);
    try {
      await downloadRashiStatusCardImage(activeDay, rashi, targetLang || language);
      setDownloadedRashiId(rashi.id);
      setTimeout(() => {
        setDownloadedRashiId((prev) => (prev === rashi.id ? null : prev));
      }, 3000);
    } finally {
      setDownloadingRashiId(null);
    }
  };

  const autoSpotlightIdx = useMemo(
    () => getSpotlightRashiIndex(activeDay, rashiCards, 'auto'),
    [activeDay, rashiCards]
  );
  const activeSpotlightIdx = useMemo(
    () => getSpotlightRashiIndex(activeDay, rashiCards, spotlightRashiChoice),
    [activeDay, rashiCards, spotlightRashiChoice]
  );
  const activeSpotlightRashi = rashiCards[activeSpotlightIdx] || rashiCards[0];
  const autoSpotlightRashi = rashiCards[autoSpotlightIdx] || rashiCards[0];

  const activeSocialPack = useMemo(
    () =>
      generateDailyVideoSocialPack(
        activeDay,
        socialPackKind || 'rashi',
        language,
        spotlightRashiChoice
      ),
    [activeDay, socialPackKind, language, spotlightRashiChoice]
  );

  const handleCopySocialText = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedSocialKey(key);
      setTimeout(() => setCopiedSocialKey(null), 2500);
    } catch {}
  };

  const handleGenerateAdminReelVideo = async (
    kind: 'rashi' | 'panchangam',
    langChoice: 'te' | 'en'
  ) => {
    if (isRecordingRashiVideo) return;
    setIsRecordingRashiVideo(true);
    setRashiVideoProgress(0);
    setRashiVideoResult(null);
    setRashiVideoStatus(
      kind === 'rashi'
        ? langChoice === 'en'
          ? `Preparing 60s Video (${activeSpotlightRashi.englishName} Full + 12 Rashis)...`
          : `60s వీడియో సిద్ధమవుతోంది (${activeSpotlightRashi.teluguName} రాశి పూర్తి ఫలితం + 12 రాశులు)...`
        : langChoice === 'en'
        ? 'Preparing 60s Panchangam Video...'
        : '60 సెకన్ల పంచాంగం వీడియో సిద్ధమవుతోంది...'
    );
    try {
      const res =
        kind === 'rashi'
          ? await generateDailyRashiReelVideo(
              activeDay,
              langChoice,
              (pct, label) => {
                setRashiVideoProgress(pct);
                setRashiVideoStatus(label);
              },
              spotlightRashiChoice
            )
          : await generateDailyPanchangamReelVideo(activeDay, langChoice, (pct, label) => {
              setRashiVideoProgress(pct);
              setRashiVideoStatus(label);
            });
      setRashiVideoResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecordingRashiVideo(false);
    }
  };

  const filteredCards = rashiCards.filter((card) => {
    const matchesStatus = filter === 'all' ? true : card.status === filter;
    const matchesRashi = selectedRashiId === 'all' ? true : card.id === selectedRashiId;
    return matchesStatus && matchesRashi;
  });

  const filteredWeekly = (weeklyOutlook?.rashis || []).filter((item) => {
    const matchesStatus = filter === 'all' ? true : item.overallStatus === filter;
    const matchesRashi = selectedRashiId === 'all' ? true : item.id === selectedRashiId;
    return matchesStatus && matchesRashi;
  });

  const filteredMonthly = (monthlyOutlook?.cards || []).filter((item) => {
    const matchesStatus = filter === 'all' ? true : item.monthlyVerdict === filter;
    const matchesRashi = selectedRashiId === 'all' ? true : item.id === selectedRashiId;
    return matchesStatus && matchesRashi;
  });

  return (
    <section
      id="dina-phalam"
      className="bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 border-2 border-amber-300/90 rounded-3xl p-5 sm:p-8 shadow-lg scroll-mt-24"
    >
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col gap-4 border-b-2 border-amber-200/80 pb-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-900">
              <span className="uppercase tracking-widest font-bold text-amber-800">
                {timeframe === 'today'
                  ? t('నేటి దిన ఫలం · దృక్సిద్ధాంత గోచారం', 'Today Horoscope · Sidereal Gochara')
                  : timeframe === 'tomorrow'
                  ? t('రేపటి దిన ఫలం · ముందస్తు సంచారం', 'Tomorrow Horoscope · Next Day Transit')
                  : timeframe === 'weekly'
                  ? t('వార ఫలాలు · 7 రోజుల చంద్ర బలం', 'Weekly Horoscope · 7-Day Moon Matrix')
                  : t('మాస గోచార ఫలాలు · గురు శని రాహు సంచారం', 'Monthly Transit · Major Planetary Cycles')}
              </span>
              <span className="text-amber-400">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span>{t('చంద్ర సంచారం:', 'Moon Transit:')}</span>
                <RashiGlyph rashi={moonRashiMeta.id} size={14} className="text-amber-700 shrink-0" />
                <strong>
                  {language === 'en'
                    ? `${moonRashiMeta.englishName} (${moonRashiMeta.teluguName})`
                    : `${moonRashiMeta.teluguName} రాశి`}
                </strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 font-telugu flex items-center gap-2.5 mt-1.5">
              <Sparkles className="text-amber-600 shrink-0" size={26} />
              <span>
                {timeframe === 'today'
                  ? t('నేటి రాశి ఫలాలు (ద్వాదశ రాశులు)', 'Today’s Daily Horoscope (12 Signs)')
                  : timeframe === 'tomorrow'
                  ? t('రేపటి రాశి ఫలాలు (ముందస్తు గోచారం)', 'Tomorrow’s Horoscope (12 Signs)')
                  : timeframe === 'weekly'
                  ? t('ఈ వార రాశి ఫలాలు (7 రోజుల పట్టిక)', 'Weekly Horoscope (7-Day Forecast)')
                  : t('ఈ నెల గోచార రాశి ఫలాలు (గురు-శని-రాహు)', 'Monthly Gochara Horoscope (12 Signs)')}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-telugu mt-1 leading-relaxed">
              {timeframe === 'weekly' && weeklyOutlook
                ? language === 'en'
                  ? weeklyOutlook.weekRangeLabelEn
                  : weeklyOutlook.weekRangeLabelTe
                : timeframe === 'monthly' && monthlyOutlook
                ? language === 'en'
                  ? monthlyOutlook.monthHeaderEn
                  : monthlyOutlook.monthHeaderTe
                : `${tr(activeDay.teediVaram)} — ${t(
                    'గ్రహ గోచారం, నక్షత్ర తారాబలం, గోచార వేధ మరియు నాలుగు జీవన రంగాల సమగ్ర విశ్లేషణ',
                    'Calculated from live sidereal Moon transit, per-star Tarabalam, Gochara Vedha, and 4 life domains.'
                  )}`}
            </p>
          </div>

          {/* Primary Segmented Timeframe Tabs (Today / Tomorrow / Weekly / Monthly) */}
          <div className="flex items-center gap-1.5 bg-amber-100/80 border border-amber-300 p-1.5 rounded-2xl overflow-x-auto scrollbar-none shrink-0">
            <button
              type="button"
              onClick={() => setTimeframe('today')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-telugu font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-[#3c1104] text-amber-200 shadow-sm'
                  : 'text-amber-950 hover:bg-white/80'
              }`}
            >
              <Clock size={13} className="shrink-0" />
              <span>{t('నేడు (Today)', 'Today')}</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeframe('tomorrow')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-telugu font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                timeframe === 'tomorrow'
                  ? 'bg-[#3c1104] text-amber-200 shadow-sm'
                  : 'text-amber-950 hover:bg-white/80'
              }`}
            >
              <CalendarDays size={13} className="shrink-0" />
              <span>{t('రేపు (Tomorrow)', 'Tomorrow')}</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeframe('weekly')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-telugu font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-[#3c1104] text-amber-200 shadow-sm'
                  : 'text-amber-950 hover:bg-white/80'
              }`}
            >
              <CalendarRange size={13} className="shrink-0" />
              <span>{t('ఈ వారం (Weekly)', 'Weekly')}</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeframe('monthly')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-telugu font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-[#3c1104] text-amber-200 shadow-sm'
                  : 'text-amber-950 hover:bg-white/80'
              }`}
            >
              <Orbit size={13} className="shrink-0" />
              <span>{t('ఈ నెల (Monthly)', 'Monthly')}</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                filter === 'all'
                  ? 'bg-amber-900 text-amber-100 border-amber-900 shadow-sm'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-50'
              }`}
            >
              {t('అన్ని రాశులు (12)', 'All Signs (12)')}
            </button>
            <button
              type="button"
              onClick={() => setFilter('favorable')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                filter === 'favorable'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {t('శుభ ఫలితాలు', 'Favorable')}
            </button>
            <button
              type="button"
              onClick={() => setFilter('mixed')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                filter === 'mixed'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              {t('మిశ్రమ ఫలితాలు', 'Mixed')}
            </button>
            <button
              type="button"
              onClick={() => setFilter('caution')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                filter === 'caution'
                  ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
              }`}
            >
              {t('చంద్రాష్టమం / జాగ్రత్త', 'Chandrashtamam / Caution')}
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-600">
            {t('నక్షత్రం:', 'Star:')}{' '}
            <strong className="text-amber-950">{activeDay.panchanga.nakshatram.split('-')[0].trim()}</strong>
            {' · '}
            {t('తిథి:', 'Tithi:')}{' '}
            <strong className="text-amber-950">{activeDay.panchanga.tithi.split('-')[0].trim()}</strong>
          </span>
        </div>

        {/* ADMIN ONLY: Prominent 60-Second Daily Prediction (12-Rashi) & Panchangam Video Download Studio + Daily Hashtags/Captions */}
        {isGuruAdmin && (
          <div className="mt-2 bg-gradient-to-r from-amber-950 via-[#3b1103] to-amber-900 text-white rounded-2xl p-3.5 sm:p-4 border-2 border-amber-400/80 shadow-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                  <Film size={13} />
                  <span>🔒 అడ్మిన్ వీడియో స్టూడియో (60 సెకన్ల 9:16 Reels / Shorts / Status)</span>
                </span>
                <p className="text-xs sm:text-sm font-bold text-amber-100 mt-0.5">
                  {t(
                    `🌟 నేటి విశేష రాశి: ${activeSpotlightRashi.symbol} ${activeSpotlightRashi.teluguName} రాశి (పూర్తి వెబ్‌సైట్ ఫలితం) + మిగతా 11 రాశులు & వెబ్‌సైట్ యాడ్ (${activeDay.teediVaram})`,
                    `🌟 Spotlight: ${activeSpotlightRashi.englishName} (Full Prediction) + 11 Rashis Summary & Website Hook (${tr(activeDay.teediVaram)})`
                  )}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-300">
                    🎯 వీడియోలో పూర్తి ఫలితం చూపే రాశి (రోజుకొక రాశి):
                  </span>
                  <select
                    value={spotlightRashiChoice}
                    onChange={(e) => setSpotlightRashiChoice(e.target.value)}
                    className="bg-amber-950 text-amber-100 border border-amber-400/80 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="auto">
                      🔄 ఆటోమేటిక్: రోజుకొక రాశి (నేడు: {autoSpotlightRashi.symbol} {autoSpotlightRashi.teluguName} రాశి)
                    </option>
                    {rashiCards.map((rc) => (
                      <option key={rc.id} value={rc.id}>
                        {rc.symbol} {rc.teluguName} రాశి ({rc.englishName}) — పూర్తి ఫలితం
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={isRecordingRashiVideo}
                  onClick={() => handleGenerateAdminReelVideo('rashi', 'te')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 disabled:opacity-60 text-amber-950 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  {isRecordingRashiVideo ? (
                    <Loader2 size={16} className="animate-spin text-amber-950" />
                  ) : (
                    <Film size={16} className="text-amber-950" />
                  )}
                  <span>
                    {isRecordingRashiVideo
                      ? `${rashiVideoProgress}% • రికార్డ్ అవుతోంది...`
                      : `🎬 ${activeSpotlightRashi.teluguName} + 12 రాశుల తెలుగు HD వీడియో (60s)`}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isRecordingRashiVideo}
                  onClick={() => handleGenerateAdminReelVideo('rashi', 'en')}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 disabled:opacity-60 text-white border border-sky-200 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Film size={15} className="text-sky-100" />
                  <span>🎬 {activeSpotlightRashi.englishName} + 12 Rashis English HD Video (60s)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTelegramBroadcaster((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                    showTelegramBroadcaster
                      ? 'bg-sky-400 text-slate-950 border-white'
                      : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-200'
                  }`}
                >
                  <span>📲 రాత్రి 12:00 AM Telegram HD స్టూడియో (TE & EN)</span>
                </button>

                <button
                  type="button"
                  disabled={isRecordingRashiVideo}
                  onClick={() => handleGenerateAdminReelVideo('panchangam', language === 'en' ? 'en' : 'te')}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 disabled:opacity-60 text-white border border-amber-300/60 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Film size={15} className="text-amber-200" />
                  <span>{t('🎬 పంచాంగం HD వీడియో (60s)', '🎬 Panchangam HD Video (60s)')}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSocialPackKind((prev) => (prev === 'rashi' ? null : 'rashi'))
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                    socialPackKind === 'rashi'
                      ? 'bg-emerald-700 text-white border-emerald-300'
                      : 'bg-amber-900/90 hover:bg-amber-800 text-amber-200 border-amber-400/70'
                  }`}
                >
                  <Hash size={15} />
                  <span>{t('🔒 రాశి ఫలాల క్యాప్షన్ & Hashtags', '🔒 Rashi Caption & Hashtags')}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSocialPackKind((prev) => (prev === 'panchangam' ? null : 'panchangam'))
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                    socialPackKind === 'panchangam'
                      ? 'bg-emerald-700 text-white border-emerald-300'
                      : 'bg-amber-900/90 hover:bg-amber-800 text-amber-200 border-amber-400/70'
                  }`}
                >
                  <Hash size={15} />
                  <span>{t('🔒 పంచాంగం క్యాప్షన్ & Hashtags', '🔒 Panchangam Caption & Hashtags')}</span>
                </button>
              </div>
            </div>

            {showTelegramBroadcaster && (
              <div className="pt-2">
                <AdminTelegramDailyBroadcaster
                  day={activeDay}
                  initialSpotlightRashiId={spotlightRashiChoice}
                />
              </div>
            )}

            {/* Admin-Only Daily Caption & Hashtags Drawer */}
            {socialPackKind && (
              <div className="bg-black/45 border border-amber-400/70 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-700/60 pb-2">
                  <span className="text-xs font-extrabold text-amber-300">
                    📋 {socialPackKind === 'rashi' ? '12 రాశి ఫలాల వీడియో' : 'పంచాంగం వీడియో'} టైటిల్, క్యాప్షన్ & Hashtags ({activeDay.teediVaram})
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopySocialText('full', activeSocialPack.fullPostText)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer"
                    >
                      {copiedSocialKey === 'full' ? <Check size={13} /> : <Copy size={13} />}
                      <span>
                        {copiedSocialKey === 'full'
                          ? 'మొత్తం కాపీ అయింది ✓'
                          : 'మొత్తం కాపీ చేయండి (Title + Caption + Hashtags)'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySocialText('title', activeSocialPack.youtubeTitle)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-500/60 font-bold text-xs cursor-pointer"
                    >
                      {copiedSocialKey === 'title' ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedSocialKey === 'title' ? 'టైటిల్ కాపీ ✓' : 'టైటిల్ కాపీ'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySocialText('tags', activeSocialPack.hashtags)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-500/60 font-bold text-xs cursor-pointer"
                    >
                      {copiedSocialKey === 'tags' ? <Check size={12} /> : <Hash size={12} />}
                      <span>{copiedSocialKey === 'tags' ? 'Hashtags కాపీ ✓' : 'Hashtags కాపీ'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-amber-950/80 border border-amber-700/50 rounded-lg p-2">
                    <div className="text-[11px] font-bold text-amber-400 mb-0.5">🎬 వీడియో టైటిల్:</div>
                    <p className="text-amber-50 font-bold select-all">{activeSocialPack.youtubeTitle}</p>
                  </div>

                  <div className="bg-amber-950/80 border border-amber-700/50 rounded-lg p-2">
                    <div className="text-[11px] font-bold text-amber-400 mb-0.5">📝 వీడియో క్యాప్షన్ / డిస్క్రిప్షన్ (వెబ్‌సైట్ సేవలతో):</div>
                    <pre className="text-amber-100 whitespace-pre-wrap font-telugu leading-relaxed select-all max-h-40 overflow-y-auto">
                      {activeSocialPack.caption}
                    </pre>
                  </div>

                  <div className="bg-amber-950/80 border border-amber-700/50 rounded-lg p-2">
                    <div className="text-[11px] font-bold text-amber-400 mb-0.5">#️⃣ డైలీ ట్రెండింగ్ Hashtags:</div>
                    <p className="text-amber-300 font-mono text-[11px] leading-relaxed select-all">
                      {activeSocialPack.hashtags}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isRecordingRashiVideo && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>{rashiVideoStatus}</span>
                  <span>{rashiVideoProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-amber-950 rounded-full overflow-hidden border border-amber-600/50">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-150"
                    style={{ width: `${rashiVideoProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!isRecordingRashiVideo && rashiVideoResult && (
              <div className="bg-emerald-950/90 border border-emerald-400/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-bold text-emerald-200">
                  ✅ {t('60 సెకన్ల వీడియో సిద్ధమైంది & డౌన్‌లోడ్ అయింది!', '60s Video Ready & Downloaded!')}{' '}
                  <span className="font-normal text-amber-200">({rashiVideoResult.filename})</span>
                </div>
                <a
                  href={rashiVideoResult.url}
                  download={rashiVideoResult.filename}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
                >
                  <Download size={13} />
                  <span>{t('మళ్ళీ సేవ్ చేయండి', 'Save Video Again')}</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personal Daily Luck Score % Widget (Tarabalam + Chandrabalam + Saved Vault Profiles) */}
      <div className="mb-5">
        <PersonalDailyScoreWidget day={activeDay} />
      </div>

      {/* Daily Yogi–Sahayogi–Avayogi & Pancha Pakshi Shastra Strip (Shown for Today & Tomorrow) */}
      {(timeframe === 'today' || timeframe === 'tomorrow') && (
        <div className="mb-5 rounded-2xl bg-gradient-to-r from-[#2b0902] via-[#3c1104] to-[#2b0902] text-amber-50 p-4 border-2 border-amber-400/80 shadow-md space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/35 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <span>
                🔱{' '}
                {timeframe === 'tomorrow'
                  ? t('రేపటి యోగి–అవయోగి & పంచ పక్షి ప్రమాణం', 'Tomorrow’s Yogi–Avayogi & Pancha Pakshi Shastra')
                  : t('దృక్సిద్ధాంత నేటి యోగి–అవయోగి & సిద్ధుల పంచ పక్షి ప్రమాణం', 'Drik Siddhanta Daily Yogi–Avayogi & Pancha Pakshi Shastra')}
              </span>
            </span>
            <span className="text-[11px] font-mono text-amber-200">
              {t('యోగి స్ఫుటం:', 'Yogi Sphuta:')} {jhoraDaily.yogiSphutaDeg}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-2.5">
              <span className="text-[10.5px] font-bold text-emerald-300 block">
                ★ {t('యోగి నక్షత్రం & యోగి గ్రహం:', 'Yogi Nakshatra & Planet:')}
              </span>
              <strong className="text-white text-xs sm:text-sm">
                {language === 'en'
                  ? `${jhoraDaily.yogiNakshatraEn} · ${jhoraDaily.yogiPlanetEn}`
                  : `${jhoraDaily.yogiNakshatraTe} · ${jhoraDaily.yogiPlanetTe}`}
              </strong>
            </div>

            <div className="bg-amber-900/60 border border-amber-400/40 rounded-xl p-2.5">
              <span className="text-[10.5px] font-bold text-amber-300 block">
                ✨ {t('సహయోగి గ్రహం (మిత్ర బలం):', 'Sahayogi Planet (Ally):')}
              </span>
              <strong className="text-white text-xs sm:text-sm">
                {language === 'en' ? jhoraDaily.sahayogiPlanetEn : jhoraDaily.sahayogiPlanetTe}
              </strong>
            </div>

            <div className="bg-rose-950/80 border border-rose-500/40 rounded-xl p-2.5">
              <span className="text-[10.5px] font-bold text-rose-300 block">
                ⚠️ {t('అవయోగి నక్షత్రం & గ్రహం:', 'Avayogi Nakshatra & Planet:')}
              </span>
              <strong className="text-white text-xs sm:text-sm">
                {language === 'en'
                  ? `${jhoraDaily.avayogiNakshatraEn} · ${jhoraDaily.avayogiPlanetEn}`
                  : `${jhoraDaily.avayogiNakshatraTe} · ${jhoraDaily.avayogiPlanetTe}`}
              </strong>
            </div>

            <div className="bg-amber-950/90 border border-amber-400/50 rounded-xl p-2.5">
              <span className="text-[10.5px] font-bold text-amber-300 block">
                🦅 {t('పంచ పక్షి అధికార పక్షి & పాలన:', 'Pancha Pakshi Ruling Bird:')}
              </span>
              <strong className="text-white text-xs block">
                {language === 'en' ? jhoraDaily.rulingPakshiEn : jhoraDaily.rulingPakshiTe}
              </strong>
              <span className="text-[10px] text-amber-200">
                {t('పాలన:', 'Ruling:')} {language === 'en' ? jhoraDaily.pakshiPalanaWindowEn : jhoraDaily.pakshiPalanaWindowTe}
              </span>
            </div>
          </div>

          <p className="text-[11.5px] text-amber-100/95 leading-relaxed">
            {language === 'en' ? jhoraDaily.yogiGuidanceEn : jhoraDaily.yogiGuidanceTe}
          </p>
        </div>
      )}

      {/* Compact Family Profiles Daily Tarabalam Alert Bar (only renders if user saved family profiles) */}
      <div className="mb-5">
        <FamilyProfilesVaultBar
          compactMode
          day={activeDay}
          currentName=""
          currentBirthDate="1994-08-15"
          currentBirthTime="09:30"
          currentCityId="hyderabad"
          onLoadProfile={(_prof, janmaRashiId) => {
            handleChooseRashi(janmaRashiId || 'all');
            const el = document.getElementById('dina-phalam');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </div>

      {/* Quick 12-Rashi Dedicated SEO URLs & Name First-Syllable Selector Bar */}
      <div className="mb-6 bg-amber-100/60 border border-amber-300 rounded-2xl p-3.5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-extrabold text-amber-950 font-telugu">
            {t('మీ రాశి ప్రత్యేక పేజీ లేదా పేరు మొదటి అక్షరం ఎంచుకోండి:', 'Select Your Dedicated Rashi Page or First Letter:')}
          </span>
          {selectedRashiId !== 'all' && (
            <a
              href="/rashi-phalalu"
              onClick={(e) => {
                e.preventDefault();
                handleChooseRashi('all');
              }}
              className="text-xs font-bold text-amber-900 hover:text-orange-700 underline cursor-pointer"
            >
              {t('అన్ని రాశులు చూపించు (12)', 'Show All 12 Signs')}
            </a>
          )}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <a
            href="/rashi-phalalu"
            onClick={(e) => {
              e.preventDefault();
              handleChooseRashi('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              selectedRashiId === 'all'
                ? 'bg-amber-900 text-white border-amber-900'
                : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-50'
            }`}
          >
            {t('అన్నీ (12)', 'All (12)')}
          </a>
          {rashiCards.map((rc) => {
            const extra = RASHI_EXTRA_META[rc.id];
            const isSelected = selectedRashiId === rc.id;
            return (
              <a
                key={rc.id}
                href={`/rashi-phalalu/${rc.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleChooseRashi(rc.id);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-800 to-amber-950 text-amber-100 border-amber-700 shadow-xs'
                    : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-50'
                }`}
              >
                <RashiGlyph rashi={rc.id} size={13} className={isSelected ? 'text-amber-300' : 'text-amber-700'} />
                <span>{language === 'en' ? rc.englishName : rc.teluguName}</span>
                {extra && language !== 'en' && (
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                    ({extra.syllablesTe.split(',').slice(0, 3).join(',')})
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1 & 2: TODAY & TOMORROW — 4-QUADRANT + TARABALAM CARDS  */}
      {/* ============================================================ */}
      {(timeframe === 'today' || timeframe === 'tomorrow') && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCards.map((rashi) => {
            const isFav = rashi.status === 'favorable';
            const isCaution = rashi.status === 'caution';
            const rashiTaras = tarabalamByRashi[rashi.id] || [];

            return (
              <div
                key={rashi.id}
                id={`rashi-${rashi.id}`}
                className={`scroll-mt-28 rounded-2xl border-2 p-5 transition-all hover:shadow-md flex flex-col justify-between ${
                  isFav
                    ? 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border-emerald-300/90'
                    : isCaution
                    ? 'bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 border-rose-300/90'
                    : 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-amber-300/90'
                }`}
              >
                <div>
                  {/* Card Top Row: Authentic Astrological Glyph + Name + Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <RashiMedallion
                        rashi={rashi.id}
                        size="md"
                        variant={isFav ? 'emerald' : isCaution ? 'rose' : 'amber'}
                        className="shrink-0"
                      />
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-amber-950 font-telugu leading-tight flex items-center gap-1.5">
                          <span>{language === 'en' ? rashi.englishName : rashi.teluguName}</span>
                          <span className="text-xs font-normal text-slate-500 font-sans">
                            ({language === 'en' ? rashi.teluguName : rashi.englishName})
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-600 font-telugu mt-0.5">
                          {t('చిహ్నం:', 'Symbol:')}{' '}
                          <strong className="text-amber-900 font-semibold">
                            {language === 'en' ? rashi.vedicSymbolNameEn : rashi.vedicSymbolName}
                          </strong>{' '}
                          · {t('అధిపతి:', 'Lord:')}{' '}
                          <strong className="text-slate-800">
                            {language === 'en' ? rashi.lordEn : rashi.lord}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-telugu font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                        isFav
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : isCaution
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {isFav && <CheckCircle2 size={12} className="text-emerald-700 shrink-0" />}
                      {isCaution && <AlertTriangle size={12} className="text-rose-700 shrink-0" />}
                      {!isFav && !isCaution && <Info size={12} className="text-amber-700 shrink-0" />}
                      <span>{language === 'en' ? rashi.statusLabelEn : rashi.statusLabel}</span>
                    </span>
                  </div>

                  {/* Clean Metadata Line: Transit Summary */}
                  <div className="mb-2.5 text-xs font-telugu font-semibold text-amber-950 bg-white/90 border border-amber-200/80 px-3 py-1.5 rounded-xl">
                    {language === 'en' ? rashi.englishNavagrahaLabel : rashi.navagrahaTransitLabel}
                  </div>

                  {/* Per-Rashi 3-Nakshatra Live Tarabalam Strip */}
                  {rashiTaras.length > 0 && (
                    <div className="mb-3 bg-white/90 border border-amber-200 rounded-xl p-2.5">
                      <div className="text-[10.5px] font-extrabold text-amber-900 uppercase tracking-wide mb-1.5">
                        ⭐ {t('జన్మ నక్షత్ర తారాబలం (3 నక్షత్రాలు):', 'Birth Star Tarabalam (3 Stars in Sign):')}
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-[11px]">
                        {rashiTaras.map((nt) => (
                          <div key={`${rashi.id}-${nt.nakshatraEn}`} className="flex items-center justify-between gap-2">
                            <span className="text-slate-700 font-semibold truncate">
                              {language === 'en' ? `${nt.nakshatraEn} (${nt.padaLabelEn})` : `${nt.nakshatraTe} (${nt.padaLabelTe})`}
                            </span>
                            <span
                              className={`font-bold shrink-0 ${
                                nt.tara.isFavorable ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {language === 'en'
                                ? `${nt.taraShortEn}`
                                : `${nt.tara.taraName} ${nt.tara.isFavorable ? '✓' : '⚠'}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5 text-xs sm:text-[13px] text-slate-800 font-telugu leading-relaxed">
                    {/* 4-QUADRANT STRUCTURED LIFE DOMAINS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/80">
                        <div className="text-[11px] font-extrabold text-amber-950 mb-1">
                          💼 {t('వృత్తి & ఉద్యోగం', 'Career & Work')}
                        </div>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed">
                          {language === 'en'
                            ? stripLeadingIndex(rashi.englishFullSummary.split('\n')[1] || '')
                            : stripLeadingIndex(rashi.careerFinanceLine)}
                        </p>
                      </div>

                      <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200/80">
                        <div className="text-[11px] font-extrabold text-emerald-950 mb-1">
                          💰 {t('ఆర్థికం & వ్యాపారం', 'Finance & Business')}
                        </div>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed">
                          {language === 'en'
                            ? stripLeadingIndex(rashi.englishWealthBusiness)
                            : stripLeadingIndex(rashi.wealthBusinessLine)}
                        </p>
                      </div>

                      <div className="bg-white/90 p-2.5 rounded-xl border border-orange-200/80">
                        <div className="text-[11px] font-extrabold text-amber-950 mb-1">
                          💖 {t('కుటుంబం & శుభకార్యం', 'Family & Harmony')}
                        </div>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed">
                          {language === 'en'
                            ? stripLeadingIndex(rashi.englishFullSummary.split('\n')[2] || '')
                            : stripLeadingIndex(rashi.familyHealthLine)}
                        </p>
                      </div>

                      <div className="bg-white/90 p-2.5 rounded-xl border border-rose-200/80">
                        <div className="text-[11px] font-extrabold text-rose-950 mb-1">
                          🌿 {t('ఆరోగ్యం & శక్తి', 'Health & Energy')}
                        </div>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed">
                          {language === 'en'
                            ? stripLeadingIndex(rashi.englishHealthVitality)
                            : stripLeadingIndex(rashi.healthVitalityLine)}
                        </p>
                      </div>
                    </div>

                    {/* Education & Youth + Planetary Overview */}
                    <div className="bg-white/85 p-2.5 rounded-xl border border-indigo-200/80 text-[12px]">
                      <strong className="text-indigo-950">🎓 {t('విద్య & యువత:', 'Education & Youth:')} </strong>
                      <span>
                        {language === 'en'
                          ? stripLeadingIndex(rashi.englishEducationYouth)
                          : stripLeadingIndex(rashi.educationYouthLine)}
                      </span>
                    </div>

                    {/* Graha Drishti (Planetary Aspect) Highlight Box */}
                    <div className="bg-gradient-to-r from-amber-900/95 via-[#3d1305] to-amber-950 text-amber-50 p-3 rounded-xl border border-amber-400/70 shadow-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-amber-500/30 pb-1">
                        <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                          <span>🔭 {t('గ్రహ దృష్టి ఫలితం', 'Graha Drishti Impact')}</span>
                        </span>
                        <span className="text-[10px] font-bold text-amber-200">
                          {language === 'en' ? rashi.grahaDrishtiHeadlineEn : rashi.grahaDrishtiHeadlineTe} ({language === 'en' ? rashi.grahaDrishtiTimeEn : rashi.grahaDrishtiTimeTe})
                        </span>
                      </div>

                      <p className="text-amber-100/95 text-xs leading-relaxed">
                        {language === 'en' ? rashi.grahaDrishtiPhalamEn : rashi.grahaDrishtiPhalamTe}
                      </p>

                      <div className="grid grid-cols-1 gap-1 pt-1 text-[11px]">
                        <div className="bg-emerald-950/75 border border-emerald-500/40 rounded-lg px-2.5 py-1 text-emerald-100">
                          <strong className="text-emerald-300">✅ {t('చేయవలసిన పని:', 'Do:')}</strong>{' '}
                          <span>{language === 'en' ? rashi.doTodayEn : rashi.doTodayTe}</span>
                        </div>
                        <div className="bg-rose-950/75 border border-rose-500/40 rounded-lg px-2.5 py-1 text-rose-100">
                          <strong className="text-rose-300">⚠️ {t('జాగ్రత్త:', 'Avoid:')}</strong>{' '}
                          <span>{language === 'en' ? rashi.avoidTodayEn : rashi.avoidTodayTe}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-amber-200/90 pt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={11} className="text-amber-300" />
                          <span>{t('శుభ సమయం:', 'Lucky Time:')}</span>
                          <strong className="text-white">
                            {language === 'en' ? rashi.luckyTimeWindowEn : rashi.luckyTimeWindowTe}
                          </strong>
                        </span>
                        {RASHI_EXTRA_META[rashi.id] && (
                          <span className="inline-flex items-center gap-1">
                            <Compass size={11} className="text-amber-300" />
                            <span>
                              {t('దిశ:', 'Dir:')}{' '}
                              <strong className="text-white">
                                {language === 'en'
                                  ? RASHI_EXTRA_META[rashi.id].luckyDirectionEn
                                  : RASHI_EXTRA_META[rashi.id].luckyDirectionTe}
                              </strong>
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Classical Shastra Grantha Pramana & Bhrigu Nandi Nadi Box */}
                    <div className="bg-gradient-to-br from-[#fffaf0] via-amber-50/90 to-orange-50/70 p-3 rounded-xl border border-amber-300/90 shadow-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-amber-200/90 pb-1.5">
                        <span className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1">
                          <span>📜 {t('ప్రాచీన గ్రంథ శ్లోక ప్రమాణం', 'Classical Shastra Citation')}</span>
                        </span>
                        <span className="text-[10px] font-bold text-amber-900">
                          {language === 'en' ? rashi.classicalCitationEn : rashi.classicalCitationTe}
                        </span>
                      </div>

                      <blockquote className="text-[11.5px] font-bold text-amber-950 bg-amber-100/70 border border-amber-300 px-2.5 py-1.5 rounded-lg italic leading-relaxed">
                        {language === 'en' ? rashi.classicalShlokaEn : rashi.classicalShlokaTe}
                      </blockquote>

                      <p className="text-[11.5px] text-slate-800 leading-relaxed">
                        <strong className="text-amber-950">{t('ఫలదీపిక తాత్పర్యం:', 'Phaladeepika Sutra:')} </strong>
                        {language === 'en' ? rashi.phaladeepikaMeaningEn : rashi.phaladeepikaMeaningTe}
                      </p>

                      <div className="bg-white/90 border border-amber-300/80 rounded-lg p-2 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-[10.5px] font-extrabold text-amber-900 uppercase tracking-wide">
                            ⚖️ {t('గోచార వేధ పరిశీలన:', 'Gochara Vedha Check:')}
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-900">
                            {language === 'en' ? rashi.vedhaBadgeEn : rashi.vedhaBadgeTe}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {language === 'en' ? rashi.vedhaExplanationEn : rashi.vedhaExplanationTe}
                        </p>
                      </div>

                      <div className="bg-amber-950/90 text-amber-100 rounded-lg p-2 space-y-1 border border-amber-700/70">
                        <p className="text-[11px] leading-relaxed">
                          <strong className="text-amber-300">🔱 </strong>
                          {language === 'en' ? rashi.bhriguNadiCircuitEn : rashi.bhriguNadiCircuitTe}
                        </p>
                        <p className="text-[10.5px] text-amber-200/90 leading-relaxed border-t border-amber-800/80 pt-1">
                          {language === 'en' ? rashi.chandraKalaNadiSecretEn : rashi.chandraKalaNadiSecretTe}
                        </p>
                      </div>
                    </div>

                    <p className="bg-amber-100/75 p-2.5 rounded-xl border border-amber-300 font-medium text-amber-950">
                      {language === 'en' ? rashi.englishDairyam : rashi.dairyamLine}
                    </p>
                  </div>
                </div>

                {/* Footer Meta: Authentic Vedic Remedy, Mantra, Lucky Indicators & Share */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col gap-2 text-xs font-telugu text-slate-600">
                  <div className="flex items-start gap-1.5 text-amber-950">
                    <Star size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>{t('శాస్త్రోక్త పరిహారం:', 'Vedic Remedy:')}</strong>{' '}
                      <span>{language === 'en' ? rashi.remedyEn : rashi.remedy}</span>
                    </p>
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200/90 rounded-lg px-2.5 py-1.5 text-[11px] text-amber-900">
                    <strong>{t('జప మంత్రం:', 'Daily Mantra:')}</strong>{' '}
                    <span className="font-semibold">{language === 'en' ? rashi.mantraEn : rashi.mantraTe}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-[11px] gap-2">
                    <span className="truncate">
                      {t('శుభ రంగు:', 'Color:')}{' '}
                      <strong className="text-slate-900">{language === 'en' ? rashi.luckyColorEn : rashi.luckyColor}</strong> ·{' '}
                      <strong className="text-amber-900">#{rashi.luckyNumber}</strong>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isGuruAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDownloadStatusCard(rashi)}
                          disabled={downloadingRashiId === rashi.id}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer border ${
                            downloadedRashiId === rashi.id
                              ? 'bg-emerald-700 text-white border-emerald-600'
                              : 'bg-amber-900 hover:bg-amber-800 text-amber-100 border-amber-700'
                          }`}
                          title={t(
                            `${rashi.teluguName} రాశి ఫలితం స్టేటస్ కార్డ్ డౌన్‌లోడ్ చేయండి`,
                            `Download ${rashi.englishName} Status Image Card`
                          )}
                        >
                          <Download size={11} className="text-amber-300 shrink-0" />
                          <span>
                            {downloadingRashiId === rashi.id
                              ? t('సిద్ధమవుతోంది...', 'Creating...')
                              : downloadedRashiId === rashi.id
                              ? t('సేవ్ అయింది ✓', 'Saved ✓')
                              : t('🔒 స్టేటస్ కార్డ్', '🔒 Status Card')}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const text = generateHoroscopeShareText(activeDay, rashi.id);
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0"
                        title={`${rashi.teluguName} రాశి ఫలితం వాట్సాప్‌లో షేర్ చేయండి`}
                      >
                        <Share2 size={11} />
                        <span>{t('షేర్', 'Share')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: WEEKLY 7-DAY HOROSCOPE MATRIX                        */}
      {/* ============================================================ */}
      {timeframe === 'weekly' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredWeekly.map((item) => {
            const isFav = item.overallStatus === 'favorable';
            const isCaution = item.overallStatus === 'caution';
            return (
              <div
                key={item.id}
                className={`rounded-2xl border-2 p-5 space-y-3.5 ${
                  isFav
                    ? 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border-emerald-300'
                    : isCaution
                    ? 'bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 border-rose-300'
                    : 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <RashiMedallion
                      rashi={item.id}
                      size="md"
                      variant={isFav ? 'emerald' : isCaution ? 'rose' : 'amber'}
                      className="shrink-0"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-amber-950 font-telugu">
                        {language === 'en' ? `${item.englishName} Weekly Forecast` : `${item.teluguName} వార ఫలాలు`}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {t('రాశ్యాధిపతి:', 'Lord:')} <strong>{language === 'en' ? item.lordEn : item.lord}</strong> ·{' '}
                        {t('వారపు బలం:', 'Weekly Score:')} <strong className="text-amber-900">{item.overallScore}%</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      isFav
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : isCaution
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {isFav
                      ? t(`శుభ వారం (${item.favorableCount}/7)`, `Strong (${item.favorableCount}/7)`)
                      : isCaution
                      ? t('జాగ్రత్త వారం', 'Caution Week')
                      : t('సమతుల్య వారం', 'Balanced Week')}
                  </span>
                </div>

                {/* 7-Day Chandra Gochara Strip */}
                <div className="grid grid-cols-7 gap-1.5">
                  {item.days.map((dc) => (
                    <div
                      key={dc.isoDate}
                      className={`rounded-xl border p-1.5 text-center ${
                        dc.status === 'favorable'
                          ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
                          : dc.status === 'caution'
                          ? 'bg-rose-100/90 border-rose-300 text-rose-950'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold block">
                        {language === 'en' ? dc.weekdayEn : dc.weekdayTe}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono block">{dc.shortDateLabel}</span>
                      <span className="text-[10px] font-bold block mt-0.5">H{dc.gocharaHouse}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed bg-white/90 border border-amber-200 rounded-xl p-3">
                  {language === 'en' ? item.weeklySummaryEn : item.weeklySummaryTe}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5">
                    <strong className="text-emerald-900 block">✅ {t('వారంలో ఉత్తమ దినాలు:', 'Peak Lucky Days:')}</strong>
                    <span className="text-slate-800">{language === 'en' ? item.peakDaysLabelEn : item.peakDaysLabelTe}</span>
                  </div>
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-2.5">
                    <strong className="text-rose-900 block">⚠️ {t('జాగ్రత్త దినాలు:', 'Caution Days:')}</strong>
                    <span className="text-slate-800">{language === 'en' ? item.cautionDaysLabelEn : item.cautionDaysLabelTe}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px]">
                  <div className="bg-white/90 border border-amber-200 rounded-xl p-2.5">
                    <strong className="text-amber-950 block mb-0.5">💼 {t('వృత్తి & ఉద్యోగం:', 'Career Outlook:')}</strong>
                    <span className="text-slate-700">{language === 'en' ? item.careerNoteEn : item.careerNoteTe}</span>
                  </div>
                  <div className="bg-white/90 border border-emerald-200 rounded-xl p-2.5">
                    <strong className="text-emerald-950 block mb-0.5">💰 {t('ఆర్థిక దిశ:', 'Finance Outlook:')}</strong>
                    <span className="text-slate-700">{language === 'en' ? item.financeNoteEn : item.financeNoteTe}</span>
                  </div>
                </div>

                <div className="text-xs text-amber-950 bg-amber-100/70 border border-amber-300 rounded-xl px-3 py-2">
                  <strong>🙏 {t('వారపు పరిహారం:', 'Weekly Remedy:')}</strong>{' '}
                  {language === 'en' ? item.remedyEn : item.remedyTe}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 4: MONTHLY GOCHARA TRANSIT OUTLOOK (MAJOR PLANETS)      */}
      {/* ============================================================ */}
      {timeframe === 'monthly' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredMonthly.map((m) => {
            const isFav = m.monthlyVerdict === 'favorable';
            const isCaution = m.monthlyVerdict === 'caution';
            const sun = m.report.planets.find((p) => p.id === 'sun');
            const mars = m.report.planets.find((p) => p.id === 'mars');
            const venus = m.report.planets.find((p) => p.id === 'venus');

            return (
              <div
                key={m.id}
                className={`rounded-2xl border-2 p-5 space-y-3.5 ${
                  isFav
                    ? 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border-emerald-300'
                    : isCaution
                    ? 'bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 border-rose-300'
                    : 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <RashiMedallion
                      rashi={m.id}
                      size="md"
                      variant={isFav ? 'emerald' : isCaution ? 'rose' : 'amber'}
                      className="shrink-0"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-amber-950 font-telugu">
                        {language === 'en' ? `${m.englishName} Monthly Transit` : `${m.teluguName} మాస గోచార ఫలాలు`}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {t('మాస గోచార బలం:', 'Transit Score:')} <strong className="text-amber-900">{m.monthlyScore}%</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      isFav
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : isCaution
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {language === 'en' ? m.verdictLabelEn : m.verdictLabelTe}
                  </span>
                </div>

                {/* Sade Sati & Major Transit Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div
                    className={`rounded-xl p-2.5 border ${
                      m.report.isYelinatiShani || m.report.saturn.houseFromMoon === 8
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-white/90 border-amber-200 text-slate-800'
                    }`}
                  >
                    <strong className="block mb-0.5">🪐 {t('శని స్థితి (ఏలినాటి శని):', 'Saturn Status:')}</strong>
                    <span>{language === 'en' ? m.saturnStatusEn : m.saturnStatusTe}</span>
                  </div>

                  <div className="rounded-xl p-2.5 border bg-white/90 border-emerald-200 text-slate-800">
                    <strong className="text-emerald-950 block mb-0.5">✨ {t('గురు గోచారం:', 'Jupiter Transit:')}</strong>
                    <span>{language === 'en' ? m.jupiterHighlightEn : m.jupiterHighlightTe}</span>
                  </div>
                </div>

                <div className="bg-amber-950 text-amber-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-amber-300 font-bold border-b border-amber-800 pb-1">
                    <span>{language === 'en' ? m.rahuKetuHighlightEn : m.rahuKetuHighlightTe}</span>
                    {sun && mars && venus && (
                      <span>
                        {t('రవి:', 'Sun:')} H{sun.houseFromMoon} · {t('కుజ:', 'Mars:')} H{mars.houseFromMoon} · {t('శుక్ర:', 'Ven:')} H{venus.houseFromMoon}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? m.report.jupiter.guidance.summaryEn || m.report.jupiter.guidance.summaryTe
                      : m.report.jupiter.guidance.summaryTe}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px]">
                  <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5">
                    <strong className="text-emerald-950 block">✅ {t('ఈ నెల చేయదగినది:', 'Recommended Action:')}</strong>
                    <span className="text-slate-700">{m.report.jupiter.guidance.doTe}</span>
                  </div>
                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5">
                    <strong className="text-amber-950 block">🛡️ {t('శని శాంతి సూచన:', 'Saturn Precaution:')}</strong>
                    <span className="text-slate-700">{m.report.saturn.guidance.carefulTe}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
