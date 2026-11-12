import React, { useState } from 'react';
import { Sparkles, Star, AlertTriangle, CheckCircle2, Info, Share2, Clock, Compass, Download } from 'lucide-react';
import { DayData } from '../types/panchangam';
import {
  RASHI_META_LIST,
  findMoonRashiIndex,
  getDailyRashiFortunes,
  generateHoroscopeShareText,
  RashiDailyFortune,
} from '../utils/panchangaLogic';
import { downloadRashiStatusCardImage } from '../utils/panchangamImageGenerator';
import { RashiMedallion, RashiGlyph } from './RashiGlyph';
import { useLanguage, Language } from '../context/LanguageContext';
import { computeDailyJHoraYogiAndPakshi } from '../utils/jhoraAdvancedEngine';

interface DailyHoroscopeProps {
  day: DayData;
  externalSelectedRashiId?: string;
}

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

export const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ day, externalSelectedRashiId }) => {
  const [filter, setFilter] = useState<'all' | 'favorable' | 'mixed' | 'caution'>('all');
  const [selectedRashiId, setSelectedRashiId] = useState<string>('all');
  const [downloadingRashiId, setDownloadingRashiId] = useState<string | null>(null);
  const [downloadedRashiId, setDownloadedRashiId] = useState<string | null>(null);
  const { language, t, tr } = useLanguage();

  React.useEffect(() => {
    if (externalSelectedRashiId) {
      setSelectedRashiId(externalSelectedRashiId);
      setFilter('all');
    }
  }, [externalSelectedRashiId]);

  const moonRashiIdx = findMoonRashiIndex(day);
  const moonRashiMeta = RASHI_META_LIST[moonRashiIdx] || RASHI_META_LIST[0];
  const jhoraDaily = computeDailyJHoraYogiAndPakshi(day);

  const rashiCards = getDailyRashiFortunes(day);

  const handleDownloadStatusCard = async (rashi: RashiDailyFortune, targetLang?: Language) => {
    setDownloadingRashiId(rashi.id);
    try {
      await downloadRashiStatusCardImage(day, rashi, targetLang || language);
      setDownloadedRashiId(rashi.id);
      setTimeout(() => {
        setDownloadedRashiId((prev) => (prev === rashi.id ? null : prev));
      }, 3000);
    } finally {
      setDownloadingRashiId(null);
    }
  };

  const filteredCards = rashiCards.filter((card) => {
    const matchesStatus = filter === 'all' ? true : card.status === filter;
    const matchesRashi = selectedRashiId === 'all' ? true : card.id === selectedRashiId;
    return matchesStatus && matchesRashi;
  });

  return (
    <section
      id="dina-phalam"
      className="bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 border-2 border-amber-300/90 rounded-3xl p-6 sm:p-8 shadow-lg scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-amber-200/80 pb-5 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
              {t('Daily Horoscope • దిన ఫలం', 'Daily Horoscope • Gochara Rashi Phalithalu')}
            </span>
            <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
              <span>{t('చంద్ర సంచారం:', 'Moon Transit:')}</span>
              <RashiGlyph rashi={moonRashiMeta.id} size={14} className="text-amber-700 shrink-0" />
              <strong>
                {language === 'en'
                  ? `${moonRashiMeta.englishName} (${moonRashiMeta.teluguName})`
                  : `${moonRashiMeta.teluguName} రాశి`}
              </strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 font-telugu flex items-center gap-2.5 mt-2">
            <Sparkles className="text-amber-600 shrink-0" size={26} />
            <span>{t('దిన ఫలం (ద్వాదశ రాశి ఫలితాలు)', 'Daily Horoscope (12 Zodiac Signs)')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-telugu mt-1 leading-relaxed">
            {tr(day.teediVaram)} —{' '}
            {t(
              'నేటి గ్రహ స్థితి మరియు గోచార చంద్ర బలం ఆధారంగా ద్వాదశ రాశుల దిన ఫలితాలు',
              'Daily zodiac predictions calculated from today’s lunar transit (Gochara Chandra Balam) and planetary positions.'
            )}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
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
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
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
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
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
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              filter === 'caution'
                ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
            }`}
          >
            {t('చంద్రాష్టమం / జాగ్రత్త', 'Chandrashtamam / Caution')}
          </button>
        </div>
      </div>

      {/* Daily Yogi–Sahayogi–Avayogi & Pancha Pakshi Shastra Strip */}
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-[#2b0902] via-[#3c1104] to-[#2b0902] text-amber-50 p-4 border-2 border-amber-400/80 shadow-md space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/35 pb-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <span>🔱 {t('దృక్సిద్ధాంత నేటి యోగి–అవయోగి & సిద్ధుల పంచ పక్షి ప్రమాణం', 'Drik Siddhanta Daily Yogi–Avayogi & Pancha Pakshi Shastra')}</span>
          </span>
          <span className="text-[11px] font-mono text-amber-200 bg-amber-900/70 px-2.5 py-0.5 rounded-md border border-amber-400/40">
            {t('యోగి స్ఫుటం:', 'Yogi Sphuta:')} {jhoraDaily.yogiSphutaDeg}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-2.5">
            <span className="text-[10.5px] font-bold text-emerald-300 block">
              ★ {t('నేటి యోగి నక్షత్రం & యోగి గ్రహం:', 'Yogi Nakshatra & Planet:')}
            </span>
            <strong className="text-white text-xs sm:text-sm">
              {language === 'en'
                ? `${jhoraDaily.yogiNakshatraEn} • ${jhoraDaily.yogiPlanetEn}`
                : `${jhoraDaily.yogiNakshatraTe} • ${jhoraDaily.yogiPlanetTe}`}
            </strong>
          </div>

          <div className="bg-amber-900/60 border border-amber-400/40 rounded-xl p-2.5">
            <span className="text-[10.5px] font-bold text-amber-300 block">
              ✨ {t('నేటి సహయోగి గ్రహం (మిత్ర బలం):', 'Sahayogi Planet (Ally):')}
            </span>
            <strong className="text-white text-xs sm:text-sm">
              {language === 'en' ? jhoraDaily.sahayogiPlanetEn : jhoraDaily.sahayogiPlanetTe}
            </strong>
          </div>

          <div className="bg-rose-950/80 border border-rose-500/40 rounded-xl p-2.5">
            <span className="text-[10.5px] font-bold text-rose-300 block">
              ⚠️ {t('నేటి అవయోగి నక్షత్రం & గ్రహం:', 'Avayogi Nakshatra & Planet:')}
            </span>
            <strong className="text-white text-xs sm:text-sm">
              {language === 'en'
                ? `${jhoraDaily.avayogiNakshatraEn} • ${jhoraDaily.avayogiPlanetEn}`
                : `${jhoraDaily.avayogiNakshatraTe} • ${jhoraDaily.avayogiPlanetTe}`}
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

      {/* Quick 12-Rashi & Name First-Syllable Selector Bar */}
      <div className="mb-6 bg-amber-100/60 border border-amber-300 rounded-2xl p-3.5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-extrabold text-amber-950 font-telugu">
            {t('మీ రాశిని లేదా పేరు మొదటి అక్షరాన్ని ఎంచుకోండి:', 'Select Your Rashi or Name First Letter:')}
          </span>
          {selectedRashiId !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedRashiId('all')}
              className="text-xs font-bold text-amber-900 hover:text-orange-700 underline cursor-pointer"
            >
              {t('అన్ని రాశులు చూపించు (12)', 'Show All 12 Signs')}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedRashiId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              selectedRashiId === 'all'
                ? 'bg-amber-900 text-white border-amber-900'
                : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-50'
            }`}
          >
            {t('అన్నీ (12)', 'All (12)')}
          </button>
          {rashiCards.map((rc) => {
            const extra = RASHI_EXTRA_META[rc.id];
            const isSelected = selectedRashiId === rc.id;
            return (
              <button
                key={rc.id}
                type="button"
                onClick={() => {
                  setSelectedRashiId(rc.id);
                  setFilter('all');
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
              </button>
            );
          })}
        </div>
      </div>

      {/* 12 Rashis Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((rashi) => {
          const isFav = rashi.status === 'favorable';
          const isCaution = rashi.status === 'caution';

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
                {/* Card Top Row: Authentic Astrological Glyph + Name + Status Badge */}
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
                        • {t('అధిపతి:', 'Lord:')}{' '}
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

                {/* Transit Pill */}
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-telugu font-semibold bg-white/90 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg inline-block">
                    {language === 'en' ? rashi.englishNavagrahaLabel : rashi.navagrahaTransitLabel}
                  </span>
                </div>

                {/* Comprehensive 5-Part Prediction Breakdown */}
                <div className="space-y-2 text-xs sm:text-[13px] text-slate-800 font-telugu leading-relaxed">
                  {/* Graha Drishti (Planetary Aspect) Highlight Box */}
                  <div className="bg-gradient-to-r from-amber-900/95 via-[#3d1305] to-amber-950 text-amber-50 p-3 rounded-xl border border-amber-400/70 shadow-xs space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-amber-500/30 pb-1">
                      <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                        <span>🔭 {t('నేటి గ్రహ దృష్టి ఫలితం', 'Graha Drishti Impact')}</span>
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/40">
                        {language === 'en' ? rashi.grahaDrishtiHeadlineEn : rashi.grahaDrishtiHeadlineTe} ({language === 'en' ? rashi.grahaDrishtiTimeEn : rashi.grahaDrishtiTimeTe})
                      </span>
                    </div>

                    <p className="text-amber-100/95 text-xs leading-relaxed">
                      {language === 'en' ? rashi.grahaDrishtiPhalamEn : rashi.grahaDrishtiPhalamTe}
                    </p>

                    <div className="grid grid-cols-1 gap-1 pt-1 text-[11px]">
                      <div className="bg-emerald-950/75 border border-emerald-500/40 rounded-lg px-2.5 py-1 text-emerald-100">
                        <strong className="text-emerald-300">✅ {t('నేడు చేయవలసిన పని:', 'Do Today:')}</strong>{' '}
                        <span>{language === 'en' ? rashi.doTodayEn : rashi.doTodayTe}</span>
                      </div>
                      <div className="bg-rose-950/75 border border-rose-500/40 rounded-lg px-2.5 py-1 text-rose-100">
                        <strong className="text-rose-300">⚠️ {t('నేడు జాగ్రత్త:', 'Avoid Today:')}</strong>{' '}
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
                  <div className="bg-gradient-to-br from-[#fffaf0] via-amber-50/90 to-orange-50/70 p-3 rounded-xl border-2 border-amber-300/90 shadow-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-amber-200/90 pb-1.5">
                      <span className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1">
                        <span>📜 {t('ప్రాచీన గ్రంథ శ్లోక ప్రమాణం', 'Classical Shastra Citation')}</span>
                      </span>
                      <span className="text-[10px] font-bold bg-amber-900 text-amber-100 px-2 py-0.5 rounded-md">
                        {language === 'en' ? rashi.classicalCitationEn : rashi.classicalCitationTe}
                      </span>
                    </div>

                    <blockquote className="text-[11.5px] font-bold text-amber-950 bg-amber-100/70 border-l-3 border-amber-700 pl-2.5 py-1 rounded-r-lg italic leading-relaxed">
                      {language === 'en' ? rashi.classicalShlokaEn : rashi.classicalShlokaTe}
                    </blockquote>

                    <p className="text-[11.5px] text-slate-800 leading-relaxed">
                      <strong className="text-amber-950">{t('ఫలదీపిక తాత్పర్యం:', 'Phaladeepika Sutra:')} </strong>
                      {language === 'en' ? rashi.phaladeepikaMeaningEn : rashi.phaladeepikaMeaningTe}
                    </p>

                    <div className="bg-white/90 border border-amber-300/80 rounded-lg p-2 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-[10.5px] font-extrabold text-amber-900 uppercase tracking-wide">
                          ⚖️ {t('గోచార వేధ గణిత పరిశీలన:', 'Gochara Vedha Check:')}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300">
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

                  <p className="bg-white/85 p-2.5 rounded-xl border border-amber-200/70">
                    {language === 'en'
                      ? rashi.englishFullSummary.split('\n')[0]
                      : rashi.grahaSthitiLine}
                  </p>
                  <p className="bg-white/85 p-2.5 rounded-xl border border-amber-200/70">
                    <strong className="text-amber-950">{t('వృత్తి & ఉద్యోగం:', 'Career:')} </strong>
                    {language === 'en'
                      ? rashi.englishFullSummary.split('\n')[1]
                      : rashi.careerFinanceLine}
                  </p>
                  <p className="bg-white/85 p-2.5 rounded-xl border border-amber-200/70">
                    <strong className="text-emerald-950">{t('💰 ఆర్థికం & వ్యాపారం:', '💰 Wealth & Business:')} </strong>
                    {language === 'en'
                      ? rashi.englishWealthBusiness
                      : rashi.wealthBusinessLine}
                  </p>
                  <p className="bg-white/85 p-2.5 rounded-xl border border-amber-200/70">
                    <strong className="text-amber-950">{t('కుటుంబం:', 'Family:')} </strong>
                    {language === 'en'
                      ? rashi.englishFullSummary.split('\n')[2]
                      : rashi.familyHealthLine}
                  </p>
                  <p className="bg-white/85 p-2.5 rounded-xl border border-amber-200/70">
                    <strong className="text-indigo-950">{t('🎓 విద్య & యువత:', '🎓 Education & Youth:')} </strong>
                    {language === 'en'
                      ? rashi.englishEducationYouth
                      : rashi.educationYouthLine}
                  </p>
                  <p className="bg-white/85 p-2.5 rounded-xl border border-amber-200/70">
                    <strong className="text-rose-950">{t('🌿 ఆరోగ్యం & శక్తి:', '🌿 Health & Vitality:')} </strong>
                    {language === 'en'
                      ? rashi.englishHealthVitality
                      : rashi.healthVitalityLine}
                  </p>
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
                    {t('శుభ రంగు:', 'Color:')} <strong className="text-slate-900">{language === 'en' ? rashi.luckyColorEn : rashi.luckyColor}</strong> •{' '}
                    <strong className="text-amber-900">#{rashi.luckyNumber}</strong>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* One-Click Bilingual Status Card PNG Download */}
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
                        `${rashi.teluguName} రాశి నేటి ఫలితం స్టేటస్ కార్డ్ డౌన్‌లోడ్ చేయండి`,
                        `Download ${rashi.englishName} Status Image Card`
                      )}
                    >
                      <Download size={11} className="text-amber-300 shrink-0" />
                      <span>
                        {downloadingRashiId === rashi.id
                          ? t('సిద్ధమవుతోంది...', 'Creating...')
                          : downloadedRashiId === rashi.id
                          ? t('సేవ్ అయింది ✓', 'Saved ✓')
                          : t('స్టేటస్ కార్డ్', 'Status Card')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const text = generateHoroscopeShareText(day, rashi.id);
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
    </section>
  );
};
