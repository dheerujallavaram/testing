import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Compass,
  Baby,
  ScrollText,
  Activity,
  Flame,
  Award,
  Sparkles,
  Hand,
  Scale,
  Library,
  Star,
  Telescope,
} from 'lucide-react';
import { VEDIC_CLASSICAL_ARTICLES } from '../data/vedicArticlesData';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { DwadasaRashiVedicGuide } from './DwadasaRashiVedicGuide';
import { DailyNakshatraArticle } from './DailyNakshatraArticle';
import { DailyAstrologyInsights } from './DailyAstrologyInsights';
import { AstroinformaticsResearch } from './AstroinformaticsResearch';

export type ArticlesCategoryTab =
  | 'all'
  | 'archive1959'
  | 'shastras'
  | 'rashiguide'
  | 'daily'
  | 'research';

interface VedicArticlesDirectoryProps {
  onSelectArticle?: (slug: string) => void;
  onOpenBooking?: () => void;
  currentDay?: DayData;
  initialCategory?: ArticlesCategoryTab;
}

export const VedicArticlesDirectory: React.FC<VedicArticlesDirectoryProps> = ({
  onSelectArticle,
  onOpenBooking,
  currentDay,
  initialCategory = 'all',
}) => {
  const { language, t } = useLanguage();
  const isTe = language !== 'en';
  const [selectedCategory, setSelectedCategory] = useState<ArticlesCategoryTab>(initialCategory);

  const iconsBySlug: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    'swarodaya-shastra': Compass,
    'balarishta-dosha-shanti': Baby,
    'prashna-nimitta-shastra': ScrollText,
    'graha-vakra-gati': Activity,
    'surya-siddhanta-kala-ganana': Flame,
    'classical-astrology-faq': Award,
    'jyotisha-paribhasha-rahasyalu': Scale,
    'hasta-samudrika-rekhala-vignanam': Hand,
    'why-are-geminis-so-powerful': Sparkles,
    'who-is-libras-true-love': Scale,
  };

  const categoryTabs: {
    id: ArticlesCategoryTab;
    labelTe: string;
    labelEn: string;
    badgeTe: string;
    badgeEn: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    {
      id: 'all',
      labelTe: 'అన్ని వ్యాసాలు (10+)',
      labelEn: 'All Articles (10+)',
      badgeTe: 'సంపూర్ణ గ్రంథాలయం',
      badgeEn: 'Complete Library',
      icon: BookOpen,
    },
    {
      id: 'archive1959',
      labelTe: '1959 డా. బి. వి. రామన్ ఆర్కైవ్',
      labelEn: '1959 Dr. B.V. Raman Archive',
      badgeTe: '4 చారిత్రక వ్యాసాలు',
      badgeEn: '4 Archival Classics',
      icon: Library,
    },
    {
      id: 'shastras',
      labelTe: 'ప్రాచీన వేద శాస్త్రాలు',
      labelEn: 'Classical Vedic Shastras',
      badgeTe: '7 మూల శాస్త్రాలు',
      badgeEn: '7 Core Treatises',
      icon: ScrollText,
    },
    {
      id: 'rashiguide',
      labelTe: '12 రాశుల విజ్ఞాన సర్వస్వం',
      labelEn: '12 Rashi Encyclopedia',
      badgeTe: 'ద్వాదశ రాశులు & ర్యాంకింగ్స్',
      badgeEn: '12 Zodiacs & Rankings',
      icon: Sparkles,
    },
    {
      id: 'daily',
      labelTe: 'నేటి నక్షత్ర & గ్రహ వ్యాసాలు',
      labelEn: 'Daily Star & Planetary Articles',
      badgeTe: 'నిత్య విశ్లేషణ',
      badgeEn: 'Daily Insights',
      icon: Star,
    },
    {
      id: 'research',
      labelTe: 'వేద-ఖగోళ పరిశోధన',
      labelEn: 'Vedic Astronomy Research',
      badgeTe: 'సైంటిఫిక్ రీసెర్చ్',
      badgeEn: 'Scientific Study',
      icon: Telescope,
    },
  ];

  const filteredArticles = VEDIC_CLASSICAL_ARTICLES.filter((article) => {
    if (selectedCategory === 'archive1959') {
      return Boolean(article.archivalSource);
    }
    if (selectedCategory === 'shastras') {
      return [
        'swarodaya-shastra',
        'balarishta-dosha-shanti',
        'prashna-nimitta-shastra',
        'graha-vakra-gati',
        'surya-siddhanta-kala-ganana',
        'why-are-geminis-so-powerful',
        'who-is-libras-true-love',
      ].includes(article.slug);
    }
    if (selectedCategory === 'rashiguide') {
      return [
        'why-are-geminis-so-powerful',
        'who-is-libras-true-love',
      ].includes(article.slug);
    }
    return true;
  });

  const showTreatiseGrid =
    selectedCategory === 'all' ||
    selectedCategory === 'archive1959' ||
    selectedCategory === 'shastras' ||
    selectedCategory === 'rashiguide';

  return (
    <div className="space-y-8">
      {/* Directory Header Banner */}
      <div className="bg-gradient-to-r from-[#2c0902] via-[#3a1005] to-[#2c0902] text-amber-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/80 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40 uppercase tracking-widest">
            {t(
              'వ్యాసాలు • వేద జ్యోతిష విజ్ఞాన సర్వస్వం • Complete Vedic Articles Hub',
              'Vedic Astrology Articles & Classical Treatises Hub'
            )}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/40">
            {t(
              'తెలుగు & English • సవివరమైన 15–18 నిమిషాల సుదీర్ఘ వ్యాసాలు',
              'Bilingual Telugu & English • Deep 15–18 Min Long-Form Treatises'
            )}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 font-telugu leading-tight">
          {t(
            'వేద జ్యోతిష వ్యాసాలు, 1959 క్లాసికల్ ఆర్కైవ్ & సనాతన శాస్త్ర గ్రంథాలయం',
            'Vedic Astrology Articles, 1959 Classical Archive & Shastra Library'
          )}
        </h1>

        <p className="text-xs sm:text-base text-amber-200/90 font-telugu max-w-4xl leading-relaxed">
          {t(
            'పాఠకులకు ఎటువంటి గందరగోళం లేకుండా వెబ్‌సైట్‌లోని సమస్త జ్యోతిష, ఖగోళ, హస్తసాముద్రిక, స్వరోదయ, బాలారిష్ట, ప్రశ్న శాస్త్ర మరియు 1959 డాక్టర్ బి. వి. రామన్ గారి "ది ఆస్ట్రాలాజికల్ మ్యాగజైన్" పరిశోధనా వ్యాసాలన్నింటినీ ఒకే చోట ("వ్యాసాలు" మెనూలో) పొందుపరిచాము.',
            'All long-form Vedic astrology treatises, 1959 Dr. B. V. Raman archival research papers, palmistry guides, 12-Rashi encyclopedias, and daily nakshatra articles are organized cleanly in this single unified Articles hub.'
          )}
        </p>

        {/* Category Filter Tabs */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex flex-col items-start justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-amber-200 shadow-lg scale-[1.01]'
                    : 'bg-amber-950/60 hover:bg-amber-900/70 text-amber-100 border-amber-700/60'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1 mb-1">
                  <Icon size={16} className={isActive ? 'text-amber-950' : 'text-amber-400'} />
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-amber-950/15 text-amber-950'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {isTe ? tab.badgeTe : tab.badgeEn}
                  </span>
                </div>
                <span className="text-xs font-extrabold font-telugu leading-snug">
                  {isTe ? tab.labelTe : tab.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Archival Attribution Banner when viewing All or 1959 Archive */}
      {(selectedCategory === 'all' || selectedCategory === 'archive1959') && (
        <div className="bg-gradient-to-r from-[#fff8eb] via-[#fffdf7] to-[#fff4db] rounded-3xl p-5 sm:p-6 border-2 border-amber-400/90 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-100 text-[10px] font-extrabold uppercase tracking-widest">
                {t('చారిత్రక గ్రంథ నివాళి • 1959 Archival Tribute', '1959 Classical Archival Tribute')}
              </span>
              <span className="text-xs font-bold text-amber-800">
                The Astrological Magazine • Vol. 48, No. 1 (January 1959 Annual Number)
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-amber-950 font-telugu">
              {t(
                'డాక్టర్ బి. వి. రామన్ (Dr. B. V. Raman) గారి 1959 వార్షిక సంచిక నుండి సేకరించిన అపురూప పరిశోధనా వ్యాసాలు',
                'Rare Classical Research Curated from Dr. B. V. Raman’s January 1959 Annual Number'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 font-telugu leading-relaxed">
              {t(
                'పండిట్ గోపేశ్ కుమార్ ఓఝా (జ్యోతిష గూఢ పరిభాష), ఎన్. ఎల్. దేశాయ్ (హస్త సాముద్రిక వేళ్ల రహస్యాలు), ప్రొ. ఎం. రామకృష్ణ భట్ (బాలారిష్ట & అరిష్ట భంగ యోగాలు), మిహిర (శాస్త్రీయ ప్రశ్న-సమాధానాలు) మరియు రామ్ దులారే గుప్తా (గ్రహ రత్న కిరణ విజ్ఞానం) గార్ల మూల రచనలకు సవినయ కృతజ్ఞతా పూర్వక నివాళి.',
                'Featuring expanded bilingual treatises honoring Pt. Gopesh Kumar Ojha, N. L. Desai, Prof. M. Ramakrishna Bhat, Mihira, and Ram Dularey Gupta (Raman Publications, Sri Rajeswari, Bangalore-3).'
              )}
            </p>
          </div>
          {selectedCategory !== 'archive1959' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('archive1959')}
              className="px-4 py-2.5 rounded-2xl bg-amber-900 hover:bg-amber-950 text-amber-100 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              {t('1959 ఆర్కైవ్ వ్యాసాలు చూడండి →', 'View 1959 Archive (4) →')}
            </button>
          )}
        </div>
      )}

      {/* Grid of Long-Form Treatises */}
      {showTreatiseGrid && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const content = isTe ? article.telugu : article.english;
            const IconComp = iconsBySlug[article.slug] || BookOpen;

            return (
              <article
                key={article.slug}
                className="bg-white rounded-3xl border-2 border-amber-300/80 hover:border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md">
                      <IconComp size={24} />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
                        <Clock size={12} />
                        {article.readTimeMinutes} {t('నిమిషాల పఠనం', 'min read')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {content.sections.length} {t('అధ్యాయాలు', 'sections')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block">
                        {isTe ? article.categoryTe : article.categoryEn}
                      </span>
                      {article.archivalSource && (
                        <span className="text-[9px] font-extrabold bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 px-2 py-0.5 rounded-full shadow-xs">
                          1959 BV Raman Archive
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-amber-950 font-telugu group-hover:text-amber-800 leading-snug">
                      {content.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 font-telugu line-clamp-4 leading-relaxed">
                    {content.summary}
                  </p>

                  {/* Archival Author Credit Pill if applicable */}
                  {article.archivalSource && (
                    <div className="bg-amber-50/90 rounded-2xl p-3 border border-amber-200/80 text-[11px] text-amber-950 space-y-0.5">
                      <p className="font-extrabold text-amber-900">
                        📚 {t('మూల ఆధారం:', 'Source:')} {article.archivalSource.publication} (
                        {article.archivalSource.year})
                      </p>
                      <p className="text-gray-700">
                        {t('సంపాదకులు:', 'Editor:')} {article.archivalSource.editor} •{' '}
                        {article.archivalSource.originalArticles
                          .map((a) => (isTe ? a.authorTe : a.author))
                          .join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Key Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {content.secondaryKeywords.slice(0, 3).map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="text-[10px] font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-amber-100 mt-2">
                  <a
                    href={`/${article.slug}`}
                    onClick={(e) => {
                      if (onSelectArticle) {
                        e.preventDefault();
                        onSelectArticle(article.slug);
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all group-hover:translate-x-0.5"
                  >
                    <span>{t('సంపూర్ణ వ్యాసం చదవండి', 'Read Complete Treatise')}</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 12 Rashi Vedic Encyclopedia View */}
      {(selectedCategory === 'rashiguide' || selectedCategory === 'all') && (
        <div className="pt-4">
          <DwadasaRashiVedicGuide onOpenBooking={onOpenBooking} />
        </div>
      )}

      {/* Daily Nakshatra & Planetary Insights View */}
      {(selectedCategory === 'daily' || selectedCategory === 'all') && currentDay && (
        <div className="space-y-8 pt-4">
          <DailyNakshatraArticle currentDay={currentDay} onOpenBooking={onOpenBooking} />
          <DailyAstrologyInsights currentDay={currentDay} onOpenBooking={onOpenBooking} />
        </div>
      )}

      {/* Vedic Astronomy & Astroinformatics Research View */}
      {(selectedCategory === 'research' || selectedCategory === 'all') && (
        <div className="pt-4">
          <AstroinformaticsResearch />
        </div>
      )}
    </div>
  );
};
