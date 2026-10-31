import React, { useState } from 'react';
import { Sparkles, Star, AlertTriangle, CheckCircle2, Info, Share2, Clock, Compass } from 'lucide-react';
import { DayData } from '../types/panchangam';
import {
  RASHI_META_LIST,
  findMoonRashiIndex,
  getDailyRashiFortunes,
  generateHoroscopeShareText,
} from '../utils/panchangaLogic';
import { RashiMedallion, RashiGlyph } from './RashiGlyph';
import { useLanguage } from '../context/LanguageContext';

interface DailyHoroscopeProps {
  day: DayData;
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

const ENGLISH_HOUSE_SUMMARIES: Record<
  number,
  { houseLabel: string; statusLabel: string; summary: string; remedy: string }
> = {
  1: {
    houseLabel: 'Janma Chandra (1st House)',
    statusLabel: 'Auspicious',
    summary:
      'Mental enthusiasm, family joy, and respect in society increase today. Auspicious tasks and spiritual plans progress smoothly.',
    remedy: 'Chant Sri Shiva Sahasranama or Panchakshari',
  },
  2: {
    houseLabel: 'Dhana Sthana (2nd House)',
    statusLabel: 'Mixed',
    summary:
      'Maintain restraint in speech and financial matters. Family discussions succeed with patience and calm deliberation.',
    remedy: 'Recite Sri Subrahmanya Stotram',
  },
  3: {
    houseLabel: 'Parakrama Sthana (3rd House)',
    statusLabel: 'Highly Auspicious',
    summary:
      'Excellent day for new initiatives, sibling support, and career victories. Financial gains and timely completion of tasks are indicated.',
    remedy: 'Worship Goddess Maha Lakshmi',
  },
  4: {
    houseLabel: 'Chaturtha Sthana (4th House)',
    statusLabel: 'Mixed',
    summary:
      'Domestic responsibilities may require extra attention. Focus on steady planning and avoid hasty property or travel decisions.',
    remedy: 'Recite Sri Durga Kavacham',
  },
  5: {
    houseLabel: 'Panchama Sthana (5th House)',
    statusLabel: 'Mixed',
    summary:
      'Creative efforts and children-related matters progress gradually. Consult experienced elders before major investments.',
    remedy: 'Chant Hayagriva or Saraswati Stotram',
  },
  6: {
    houseLabel: 'Shashtha Sthana (6th House)',
    statusLabel: 'Very Auspicious',
    summary:
      'Victory over obstacles, recovery in health, and financial relief are indicated. Pending workplace matters resolve favorably.',
    remedy: 'Worship Lord Lakshmi Narasimha',
  },
  7: {
    houseLabel: 'Saptama Sthana (7th House)',
    statusLabel: 'Auspicious',
    summary:
      'Partnerships, business collaborations, and family harmony flourish. Short journeys and social meetings bring positive outcomes.',
    remedy: 'Worship Sri Lalita Tripura Sundari',
  },
  8: {
    houseLabel: 'Ashtama Chandra (8th House • Chandrashtamam)',
    statusLabel: 'Chandrashtamam • Caution',
    summary:
      'Moon transits the 8th house today. Postpone major new agreements or disputes, maintain calm, and focus on routine duties and prayer.',
    remedy: 'Chant Om Namah Shivaya (Rudrabhishekam / Shiva Archana)',
  },
  9: {
    houseLabel: 'Bhagya Sthana (9th House)',
    statusLabel: 'Mixed',
    summary:
      'Spiritual inclinations, temple visits, and blessings of elders bring peace. Steady effort yields rewards in ongoing tasks.',
    remedy: 'Recite Sri Dakshinamurthy Stotram',
  },
  10: {
    houseLabel: 'Karma Sthana (10th House)',
    statusLabel: 'Auspicious',
    summary:
      'Professional recognition, support from superiors, and career advancement are favored. Planned projects move forward.',
    remedy: 'Worship Lord Venkateswara',
  },
  11: {
    houseLabel: 'Labha Sthana (11th House)',
    statusLabel: 'Highly Auspicious',
    summary:
      'Financial gains, business expansion, and joyful news are indicated. Support from friends and fulfillment of desires.',
    remedy: 'Worship Lord Maha Ganapathi',
  },
  12: {
    houseLabel: 'Vyaya Sthana (12th House)',
    statusLabel: 'Mixed',
    summary:
      'Auspicious or family expenses may rise today. Prioritize rest, mindful budgeting, and spiritual contemplation.',
    remedy: 'Recite Sri Hanuman Chalisa',
  },
};

export const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ day }) => {
  const [filter, setFilter] = useState<'all' | 'favorable' | 'mixed' | 'caution'>('all');
  const [selectedRashiId, setSelectedRashiId] = useState<string>('all');
  const { language, t, tr } = useLanguage();

  const moonRashiIdx = findMoonRashiIndex(day);
  const moonRashiMeta = RASHI_META_LIST[moonRashiIdx] || RASHI_META_LIST[0];

  const rashiCards = getDailyRashiFortunes(day);

  const filteredCards = rashiCards.filter((card) => {
    const matchesStatus = filter === 'all' ? true : card.status === filter;
    const matchesRashi = selectedRashiId === 'all' ? true : card.id === selectedRashiId;
    return matchesStatus && matchesRashi;
  });

  return (
    <section
      id="dina-phalam"
      className="bg-white border border-amber-300 shadow-md rounded-2xl p-4 sm:p-6 lg:p-8 scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-5 mb-5 sm:mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-amber-800 font-display bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
              {t('Daily Horoscope • దిన ఫలం', 'Daily Horoscope • Gochara Rashi Phalithalu')}
            </span>
            <span className="text-[11px] sm:text-xs font-telugu font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 flex items-center gap-1.5">
              <span>{t('చంద్ర సంచారం:', 'Moon Transit:')}</span>
              <RashiGlyph rashi={moonRashiMeta.id} size={14} className="text-amber-800 shrink-0" />
              <strong>
                {language === 'en'
                  ? `${moonRashiMeta.englishName} (${moonRashiMeta.teluguName})`
                  : `${moonRashiMeta.teluguName} రాశి`}
              </strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-950 font-telugu flex items-center gap-2 mt-2">
            <Sparkles className="text-amber-600 shrink-0" size={24} />
            <span>{t('దిన ఫలం (ద్వాదశ రాశి ఫలితాలు)', 'Daily Horoscope (12 Zodiac Signs)')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-telugu mt-1 leading-relaxed">
            {tr(day.teediVaram)} —{' '}
            {t(
              'నేటి గ్రహ స్థితి మరియు గోచార చంద్ర బలం ఆధారంగా ద్వాదశ రాశుల సంక్షిప్త దిన ఫలితాలు',
              'Daily zodiac predictions calculated from today’s lunar transit (Gochara Chandra Balam) and planetary positions.'
            )}
          </p>
        </div>

        {/* Status Filter Tabs - Horizontally scrollable on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none -mx-1 px-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              filter === 'all'
                ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-xs'
                : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {t('అన్ని రాశులు (12)', 'All Signs (12)')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('favorable')}
            className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              filter === 'favorable'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {t('శుభ ఫలితాలు', 'Favorable')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('mixed')}
            className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              filter === 'mixed'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {t('మిశ్రమ ఫలితాలు', 'Mixed')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('caution')}
            className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-telugu font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              filter === 'caution'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {t('చంద్రాష్టమం / జాగ్రత్త', 'Chandrashtamam / Caution')}
          </button>
        </div>
      </div>

      {/* Quick 12-Rashi & Name First-Syllable Selector Bar */}
      <div className="mb-5 bg-amber-50/70 border border-amber-200 rounded-2xl p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-amber-950 font-telugu">
            🔍 {t('మీ రాశిని లేదా పేరు మొదటి అక్షరాన్ని ఎంచుకోండి:', 'Select Your Rashi or Name First Letter:')}
          </span>
          {selectedRashiId !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedRashiId('all')}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
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
                ? 'bg-amber-800 text-white border-amber-900 shadow-2xs'
                : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-100'
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
                    ? 'bg-amber-900 text-amber-100 border-amber-950 shadow-xs'
                    : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-100'
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

      {/* 12 Rashis Grid: Mobile 1-col, Tablet 2-col, Desktop 3-col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredCards.map((rashi) => {
          const isFav = rashi.status === 'favorable';
          const isCaution = rashi.status === 'caution';

          return (
            <div
              key={rashi.id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-lg ${
                isFav
                  ? 'bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/20 border-emerald-300/90'
                  : isCaution
                  ? 'bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 border-rose-300'
                  : 'bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 border-amber-300'
              }`}
            >
              <div>
                {/* Card Top Row: Iconic Astrological Glyph & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <RashiMedallion
                      rashi={rashi.id}
                      size="md"
                      variant={isFav ? 'emerald' : isCaution ? 'rose' : 'amber'}
                      className="shadow-xs shrink-0"
                    />
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-amber-950 font-telugu leading-tight flex items-baseline gap-1.5">
                        <span>{language === 'en' ? rashi.englishName : rashi.teluguName}</span>
                        <span className="text-xs font-normal text-slate-500 font-sans">
                          ({language === 'en' ? rashi.teluguName : rashi.englishName})
                        </span>
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-600 font-telugu mt-0.5">
                        {t('చిహ్నం:', 'Symbol:')}{' '}
                        <strong className="text-amber-950 font-medium">{rashi.vedicSymbolName}</strong>
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-telugu">
                        {t('అధిపతి:', 'Lord:')}{' '}
                        <strong className="text-amber-900">{tr(rashi.lord)}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-telugu font-bold shrink-0 border ${
                      isFav
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-300 shadow-2xs'
                        : isCaution
                        ? 'bg-rose-100 text-rose-950 border-rose-300 shadow-2xs'
                        : 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                    }`}
                  >
                    {isFav && <CheckCircle2 size={12} className="text-emerald-700 shrink-0" />}
                    {isCaution && <AlertTriangle size={12} className="text-rose-700 shrink-0" />}
                    {!isFav && !isCaution && <Info size={12} className="text-amber-700 shrink-0" />}
                    <span>{language === 'en' ? tr(rashi.statusLabel) : rashi.statusLabel}</span>
                  </span>
                </div>

                {/* Specific Navagraha Transit Badge (e.g., చంద్రాష్టమం • ద్వితీయ రాహువు) */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-telugu font-bold border ${
                      isCaution
                        ? 'bg-rose-100/80 text-rose-900 border-rose-300'
                        : isFav
                        ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100/80 text-amber-900 border-amber-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider font-sans font-extrabold text-amber-800/80">
                      🪐 {t('గోచారం:', 'Transit:')}
                    </span>
                    <span>
                      {language === 'en'
                        ? rashi.englishNavagrahaLabel
                        : rashi.navagrahaTransitLabel}
                    </span>
                  </span>
                </div>

                {/* 4 to 5 Lines Comprehensive Prediction Breakdown */}
                <div className="space-y-2.5 text-xs sm:text-[13px] text-slate-800 font-telugu leading-relaxed">
                  {/* Dedicated Graha Drishti (Planetary Aspect) & Graha Sancharam Loukika Impact Section */}
                  <div className="bg-gradient-to-br from-amber-100/95 via-amber-50 to-orange-50/95 p-3 rounded-xl border-2 border-amber-300 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-amber-200/80 pb-1.5">
                      <span className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1">
                        <span>🪐 {t('నేటి గ్రహ దృష్టి & గ్రహ సంచార ఫలితం:', 'Today’s Graha Drishti & Transit Impact:')}</span>
                      </span>
                      <span className="text-[10px] font-bold bg-amber-900 text-amber-100 px-2 py-0.5 rounded-md">
                        {rashi.grahaDrishtiHeadlineTe} • 🕒 {rashi.grahaDrishtiTimeTe}
                      </span>
                    </div>

                    <p className="font-semibold text-amber-950 text-xs leading-relaxed">
                      {language === 'en' ? rashi.grahaDrishtiPhalamEn : rashi.grahaDrishtiPhalamTe}
                    </p>

                    {/* Practical Do Today & Avoid Today in common parlance */}
                    <div className="grid grid-cols-1 gap-1.5 pt-1 text-[11px]">
                      <div className="bg-emerald-50/90 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-emerald-950">
                        <strong className="text-emerald-800">✅ {t('నేడు చేయవలసిన పని:', 'Do Today:')}</strong>{' '}
                        <span>{rashi.doTodayTe}</span>
                      </div>
                      <div className="bg-rose-50/80 border border-rose-200 rounded-lg px-2.5 py-1.5 text-rose-950">
                        <strong className="text-rose-800">⚠️ {t('నేడు జాగ్రత్త:', 'Avoid Today:')}</strong>{' '}
                        <span>{rashi.avoidTodayTe}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-amber-900 pt-1 border-t border-amber-200/60">
                      <span className="inline-flex items-center gap-1 font-bold">
                        <Clock size={12} className="text-amber-700" />
                        <span>{t('శుభ సమయం:', 'Lucky Time:')}</span>
                        <span className="font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-950">
                          {rashi.luckyTimeWindowTe}
                        </span>
                      </span>
                      {RASHI_EXTRA_META[rashi.id] && (
                        <span className="inline-flex items-center gap-1 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-950">
                          <Compass size={11} className="text-amber-700" />
                          <span>
                            {t('దిశ:', 'Dir:')}{' '}
                            {language === 'en'
                              ? RASHI_EXTRA_META[rashi.id].luckyDirectionEn
                              : RASHI_EXTRA_META[rashi.id].luckyDirectionTe}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Line 1: Graha Sthiti */}
                  <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/70">
                    <p className="font-medium text-amber-950">
                      {language === 'en'
                        ? rashi.englishFullSummary.split('\n')[0]
                        : rashi.grahaSthitiLine}
                    </p>
                  </div>

                  {/* Line 2: Career & Finance */}
                  <div className="pl-1">
                    <p className="text-slate-800">
                      {language === 'en'
                        ? rashi.englishFullSummary.split('\n')[1]
                        : rashi.careerFinanceLine}
                    </p>
                  </div>

                  {/* Line 3: Family & Health */}
                  <div className="pl-1">
                    <p className="text-slate-800">
                      {language === 'en'
                        ? rashi.englishFullSummary.split('\n')[2]
                        : rashi.familyHealthLine}
                    </p>
                  </div>

                  {/* Line 4: Courage & Positive Reassurance (ధైర్యం & మనోధైర్యం) */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isCaution
                        ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                        : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <p className="font-semibold text-xs leading-relaxed flex items-start gap-1.5">
                      <span className="shrink-0 text-sm">🛡️</span>
                      <span>
                        {language === 'en'
                          ? rashi.englishDairyam
                          : rashi.dairyamLine}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Meta: Authentic Vedic Remedy, Lucky Indicators & Direct Rashi Share */}
              <div className="mt-4 pt-3 border-t border-amber-200 flex flex-col gap-2 text-xs font-telugu text-slate-700">
                <div className="flex items-start gap-1.5 text-amber-950">
                  <Star size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-amber-900">{t('శాస్త్రోక్త పరిహారం:', 'Vedic Remedy:')}</span>{' '}
                    <span>{tr(rashi.remedy)}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-amber-100 text-[11px] gap-2">
                  <span className="text-slate-600 truncate">
                    {t('శుభ రంగు:', 'Color:')} <strong className="text-amber-900">{tr(rashi.luckyColor)}</strong> •{' '}
                    <strong className="text-amber-950">#{rashi.luckyNumber}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const text = generateHoroscopeShareText(day, rashi.id);
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0"
                    title={`${rashi.teluguName} రాశి ఫలితం వాట్సాప్‌లో షేర్ చేయండి`}
                  >
                    <Share2 size={12} />
                    <span>{t(`${rashi.teluguName} షేర్`, 'Share')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
