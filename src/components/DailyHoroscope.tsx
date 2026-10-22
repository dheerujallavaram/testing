import React, { useState } from 'react';
import { Sparkles, Star, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { RASHI_META_LIST, findMoonRashiIndex, getDailyRashiFortunes } from '../utils/panchangaLogic';
import { RashiMedallion, RashiGlyph } from './RashiGlyph';
import { useLanguage } from '../context/LanguageContext';

interface DailyHoroscopeProps {
  day: DayData;
}

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
  const { language, t, tr } = useLanguage();

  const moonRashiIdx = findMoonRashiIndex(day);
  const moonRashiMeta = RASHI_META_LIST[moonRashiIdx] || RASHI_META_LIST[0];

  const rashiCards = getDailyRashiFortunes(day);

  const filteredCards = rashiCards.filter((card) =>
    filter === 'all' ? true : card.status === filter
  );

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

      {/* 12 Rashis Grid: Mobile 1-col, Tablet 2-col, Desktop 3-col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredCards.map((rashi) => {
          const isFav = rashi.status === 'favorable';
          const isCaution = rashi.status === 'caution';
          const enFortune = ENGLISH_HOUSE_SUMMARIES[rashi.gocharaHouse] || ENGLISH_HOUSE_SUMMARIES[1];

          return (
            <div
              key={rashi.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                isFav
                  ? 'bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 border-emerald-200/90'
                  : isCaution
                  ? 'bg-gradient-to-br from-rose-50/60 via-white to-amber-50/30 border-rose-300'
                  : 'bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 border-amber-200'
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
                        <strong className="text-amber-900">{tr(rashi.lord)}</strong> •{' '}
                        {language === 'en' ? enFortune.houseLabel : rashi.houseLabel}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-telugu font-bold shrink-0 border ${
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
                    <span>{language === 'en' ? enFortune.statusLabel : rashi.statusLabel}</span>
                  </span>
                </div>

                {/* Daily Fortune Summary */}
                <p className="text-xs sm:text-sm text-slate-800 font-telugu leading-relaxed mb-3">
                  {language === 'en' ? enFortune.summary : rashi.summary}
                </p>
              </div>

              {/* Footer Meta: Remedy & Lucky Indicators */}
              <div className="pt-2.5 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs font-telugu text-slate-700">
                <span className="flex items-center gap-1 text-amber-950 font-medium">
                  <Star size={12} className="text-amber-600 shrink-0" />
                  <span>
                    {t('పరిహారం:', 'Remedy:')}{' '}
                    <strong>{language === 'en' ? enFortune.remedy : rashi.remedy}</strong>
                  </span>
                </span>
                <span className="text-slate-700 bg-amber-50/90 px-2 py-0.5 rounded border border-amber-200/80 font-medium">
                  {t('శుభ సంఖ్య:', 'Lucky No:')} <strong>{rashi.luckyNumber}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
