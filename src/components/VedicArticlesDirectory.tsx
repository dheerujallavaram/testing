import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  Compass,
  Baby,
  ScrollText,
  Activity,
  Flame,
  Award,
  Star,
  Cpu,
  Library,
  Scale,
  Hand,
  Copy,
  CheckCircle2,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { VEDIC_CLASSICAL_ARTICLES, VedicClassicalArticle } from '../data/vedicArticlesData';
import { useLanguage } from '../context/LanguageContext';
import { DayData } from '../types/panchangam';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';

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

interface DirectoryCardItem {
  slug: string;
  heroImage: string;
  imageAltTe: string;
  imageAltEn: string;
  categoryTe: string;
  categoryEn: string;
  readTimeMinutes: number;
  titleTe: string;
  titleEn: string;
  summaryTe: string;
  summaryEn: string;
  keywordsTe: string[];
  keywordsEn: string[];
  sectionCount: number;
  archivalBadge?: string;
  archivalPublication?: string;
  archivalYear?: number;
  archivalEditor?: string;
  archivalAuthorsTe?: string;
  archivalAuthorsEn?: string;
  filterGroup: ArticlesCategoryTab[];
}

export const SPECIAL_STANDALONE_ARTICLE_CARDS: DirectoryCardItem[] = [
  {
    slug: 'dwadasa-rashi-rahasyalu',
    heroImage: '/assets/articles/libra_love_scales_1794331378605.jpg',
    imageAltTe: '12 రాశుల దాంపత్యం, సంతానం, వృత్తి-భాగస్వామ్యం & ఆరోగ్య విజ్ఞాన సర్వస్వం',
    imageAltEn: '12 Rashi Vedic Encyclopedia – Marriage, Children, Career & Health',
    categoryTe: '12 రాశుల విజ్ఞాన సర్వస్వం',
    categoryEn: '12 Rashi Encyclopedia',
    readTimeMinutes: 20,
    titleTe:
      '12 రాశుల విజ్ఞాన సర్వస్వం: భార్య-భర్త మనస్తత్వం, పిల్లల విద్యా స్వభావం, వృత్తి-భాగస్వామ్యం & ఆరోగ్య రహస్యాలు',
    titleEn:
      '12 Rashi Vedic Encyclopedia: Spouse Psychology, Child Education, Business Partnerships & Health Guide',
    summaryTe:
      'మేషం నుండి మీనం వరకు 12 రాశుల వారి దాంపత్య జీవితం, పిల్లల పెంపకం, వ్యాపార భాగస్వామ్యం, ధన ఆకర్షణ, ఆరోగ్య సూత్రాలు మరియు పౌర్ణమి-అమావాస్య-శని ప్రభావాల సంపూర్ణ ప్రత్యేక గ్రంథం.',
    summaryEn:
      'Comprehensive standalone encyclopedia covering all 12 Zodiac signs: marriage psychology, parenting, career partnerships, wealth attraction, and health.',
    keywordsTe: ['12 రాశుల రహస్యాలు', 'దాంపత్య మనస్తత్వం', 'రాశి ఫలితాలు'],
    keywordsEn: ['12 Rashi Encyclopedia', 'Zodiac Spouse Psychology', 'Vedic Rashi Guide'],
    sectionCount: 12,
    filterGroup: ['all', 'rashiguide'],
  },
  {
    slug: 'neti-nakshatra-vyasam',
    heroImage: '/assets/articles/surya_siddhanta_kala_1794331370298.jpg',
    imageAltTe: 'నేటి నక్షత్ర ప్రత్యేక వ్యాసం – నక్షత్ర చూడామణి & యవనాచార్య మత విశ్లేషణ',
    imageAltEn: 'Today Nakshatra Special Article – Classical Star & Pada Analysis',
    categoryTe: 'నేటి నక్షత్ర ప్రత్యేక వ్యాసం',
    categoryEn: 'Daily Star Special Article',
    readTimeMinutes: 14,
    titleTe:
      'నేటి నక్షత్ర ప్రత్యేక వ్యాసం: నక్షత్ర చూడామణి, యవనాచార్య మతం & 4 పాదాల సమగ్ర జీవన ఫలితాలు',
    titleEn:
      'Today’s Nakshatra Special Treatise: Nakshatra Chudamani, Yavanacharya Rules & 4-Pada Life Predictions',
    summaryTe:
      'ఈ రోజు నడుస్తున్న నక్షత్రం యొక్క అధిపతి, అధిష్టాన దేవత, 4 పాదాల ఫలితాలు, అనుకూల శుభకార్యాలు మరియు శాస్త్రోక్త పరిహారాలతో కూడిన ప్రత్యేక వ్యాసం.',
    summaryEn:
      'Dedicated daily treatise analyzing today’s ruling Nakshatra, deity, 4-Pada characteristics, auspicious activities, and classical Vedic remedies.',
    keywordsTe: ['ఈ రోజు నక్షత్రం వ్యాసం', 'నక్షత్ర చూడామణి', 'యవనాచార్యుల మతం'],
    keywordsEn: ['Today Nakshatra Article', 'Nakshatra Chudamani', 'Star Predictions'],
    sectionCount: 6,
    filterGroup: ['all', 'daily'],
  },
  {
    slug: 'neti-jyothisha-visleshana',
    heroImage: '/assets/articles/graha_vakra_retrograde_1794331368106.jpg',
    imageAltTe: 'నేటి గ్రహ సంచార, కర్మ సిద్ధాంత & జీవన మార్గదర్శన వ్యాసం',
    imageAltEn: 'Daily Planetary Transit, Karma Siddhanta & Life Guidance Article',
    categoryTe: 'నేటి గ్రహ & జీవన విశ్లేషణ',
    categoryEn: 'Daily Planetary & Life Insights',
    readTimeMinutes: 15,
    titleTe:
      'నేటి గ్రహ సంచార & జీవన మార్గదర్శన వ్యాసం: తిథి-నక్షత్ర-యోగాల ఆధ్యాత్మిక మరియు లౌకిక సమన్వయం',
    titleEn:
      'Daily Planetary Transit & Life Guidance Treatise: Practical & Spiritual Alignment with Today’s Panchangam',
    summaryTe:
      'నేటి గ్రహస్థితి, తిథి, వారం, నక్షత్రం ఆధారంగా ఉద్యోగం, వ్యాపారం, కుటుంబం మరియు మానసిక ప్రశాంతత కోసం ఆచరించవలసిన వైదిక జీవన విధానం.',
    summaryEn:
      'Standalone daily astrological treatise translating today’s planetary transits, Tithi, and Nakshatra into actionable career, family, and spiritual guidance.',
    keywordsTe: ['నేటి గ్రహ సంచారం', 'కర్మ సిద్ధాంతం', 'దినచర్య మార్గదర్శనం'],
    keywordsEn: ['Daily Planetary Insights', 'Vedic Life Guidance', 'Graha Sancharam'],
    sectionCount: 5,
    filterGroup: ['all', 'daily'],
  },
  {
    slug: 'astroinformatics-research',
    heroImage: '/assets/articles/classical_jyotish_archive_1794331371569.jpg',
    imageAltTe: 'వేద ఖగోళ గణితం & ఆస్ట్రో-ఇన్ఫర్మేటిక్స్ పరిశోధనా పత్రం',
    imageAltEn: 'Vedic Astronomy & Astroinformatics Research Treatise',
    categoryTe: 'ఖగోళ & ఆస్ట్రో-ఇన్ఫర్మేటిక్స్ పరిశోధన',
    categoryEn: 'Astronomy & Astroinformatics Research',
    readTimeMinutes: 18,
    titleTe:
      'వేద ఖగోళ గణితం & ఆస్ట్రో-ఇన్ఫర్మేటిక్స్ పరిశోధన: సూర్య సిద్ధాంతం, దృక్సిద్ధాంతం & NASA JPL Ephemeris తులనాత్మక విశ్లేషణ',
    titleEn:
      'Vedic Astronomy & Astroinformatics Research: Surya Siddhanta, Drik Siddhanta & Modern Ephemeris Precision',
    summaryTe:
      'ప్రాచీన భారతీయ సూర్య సిద్ధాంత గణితం, లహరి చిత్రపక్ష అయనాంశం మరియు ఆధునిక ఖగోళ శాస్త్ర (VSOP87 / NASA JPL Ephemeris) గణనల ఖచ్చితత్వాన్ని వివరించే ప్రత్యేక పరిశోధనా వ్యాసం.',
    summaryEn:
      'In-depth scientific treatise comparing classical Surya Siddhanta algorithms, Lahiri Chitrapaksha Ayanamsha, and modern astronomical ephemeris computation.',
    keywordsTe: ['దృక్సిద్ధాంత గణితం', 'అయనాంశ పరిశోధన', 'సూర్య సిద్ధాంత ఖగోళం'],
    keywordsEn: ['Vedic Astroinformatics', 'Drik Siddhanta Research', 'Lahiri Ayanamsha'],
    sectionCount: 7,
    filterGroup: ['all', 'research'],
  },
];

function mapClassicalArticleToCard(article: VedicClassicalArticle): DirectoryCardItem {
  const groups: ArticlesCategoryTab[] = ['all', 'shastras'];
  if (
    [
      'balarishta-dosha-shanti',
      'classical-astrology-faq',
      'jyotisha-paribhasha-rahasyalu',
      'hasta-samudrika-rekhala-vignanam',
      'pawan-kalyan-raja-yoga-horoscope-analysis',
      'cricket-sports-astrology-ind-u19-vs-uae-u19-prashna-guide',
      'swapna-shastra-dream-meaning-medical-astrology-1944',
      'fmge-medical-astrology-doctor-yoga-exam-success-guide',
    ].includes(article.slug)
  ) {
    groups.push('archive1959');
  }
  if (
    ['why-are-geminis-so-powerful', 'who-is-libras-true-love'].includes(article.slug)
  ) {
    groups.push('rashiguide');
  }

  return {
    slug: article.slug,
    heroImage: article.heroImage,
    imageAltTe: article.imageAltTe,
    imageAltEn: article.imageAltEn,
    categoryTe: article.categoryTe,
    categoryEn: article.categoryEn,
    readTimeMinutes: article.readTimeMinutes,
    titleTe: article.telugu.title,
    titleEn: article.english.title,
    summaryTe: article.telugu.summary,
    summaryEn: article.english.summary,
    keywordsTe: article.telugu.secondaryKeywords,
    keywordsEn: article.english.secondaryKeywords,
    sectionCount: article.telugu.sections.length,
    archivalBadge: article.archivalSource
      ? 'ఆర్ష గ్రంథ సంకలనం'
      : undefined,
    archivalPublication: article.archivalSource?.publication,
    archivalYear: article.archivalSource?.year,
    archivalEditor: undefined,
    archivalAuthorsTe: article.archivalSource
      ? 'బృహత్ పరాశర హోరా శాస్త్రం, జైమిని సూత్రాలు, బృహజ్జాతకం, ఉత్తర కాలామృతం & ప్రశ్నమార్గ'
      : undefined,
    archivalAuthorsEn: article.archivalSource
      ? 'Brihat Parashara Hora Shastra, Jaimini Sutras, Brihat Jataka, Uttara Kalamrita & Prasna Marga'
      : undefined,
    filterGroup: groups,
  };
}

export const VedicArticlesDirectory: React.FC<VedicArticlesDirectoryProps> = ({
  onSelectArticle,
  initialCategory = 'all',
}) => {
  const { language, t } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();
  const isTe = language !== 'en';
  const [selectedCategory, setSelectedCategory] = useState<ArticlesCategoryTab>(initialCategory);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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
    'pawan-kalyan-raja-yoga-horoscope-analysis': Award,
    'cricket-sports-astrology-ind-u19-vs-uae-u19-prashna-guide': Activity,
    'swapna-shastra-dream-meaning-medical-astrology-1944': Sparkles,
    'fmge-medical-astrology-doctor-yoga-exam-success-guide': Activity,
    'dwadasa-rashi-rahasyalu': Sparkles,
    'neti-nakshatra-vyasam': Star,
    'neti-jyothisha-visleshana': Flame,
    'astroinformatics-research': Cpu,
  };

  const allCards: DirectoryCardItem[] = [
    ...VEDIC_CLASSICAL_ARTICLES.map(mapClassicalArticleToCard),
    ...SPECIAL_STANDALONE_ARTICLE_CARDS,
  ];

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
      labelTe: `అన్ని వ్యాసాలు (${allCards.length})`,
      labelEn: `All Articles (${allCards.length})`,
      badgeTe: 'ప్రత్యేక పేజీలు',
      badgeEn: 'Standalone Pages',
      icon: BookOpen,
    },
    {
      id: 'archive1959',
      labelTe: 'ఆర్ష గ్రంథ & నాడీ సంకలనం',
      labelEn: 'Classical Maharshi & Grantha Archive',
      badgeTe: '8 ప్రామాణిక గ్రంథ వ్యాసాలు',
      badgeEn: '8 Classical Classics',
      icon: Library,
    },
    {
      id: 'shastras',
      labelTe: 'ప్రాచీన వేద శాస్త్రాలు',
      labelEn: 'Classical Vedic Shastras',
      badgeTe: '14 మూల శాస్త్రాలు',
      badgeEn: '14 Core Treatises',
      icon: ScrollText,
    },
    {
      id: 'rashiguide',
      labelTe: '12 రాశుల విజ్ఞాన సర్వస్వం',
      labelEn: '12 Rashi Encyclopedia',
      badgeTe: '3 ప్రత్యేక వ్యాసాలు',
      badgeEn: '3 Zodiac Guides',
      icon: Sparkles,
    },
    {
      id: 'daily',
      labelTe: 'నేటి నక్షత్ర & గ్రహ వ్యాసాలు',
      labelEn: 'Daily Star & Planetary Articles',
      badgeTe: '2 నిత్య వ్యాసాలు',
      badgeEn: '2 Daily Treatises',
      icon: Star,
    },
    {
      id: 'research',
      labelTe: 'వేద ఖగోళ & ఆస్ట్రో-ఇన్ఫర్మేటిక్స్',
      labelEn: 'Vedic Astronomy Research',
      badgeTe: 'పరిశోధనా వ్యాసం',
      badgeEn: 'Research Paper',
      icon: Cpu,
    },
  ];

  const filteredCards = allCards.filter((card) =>
    card.filterGroup.includes(selectedCategory)
  );

  const handleCopyCardLink = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard?.writeText(fullUrl).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0 overflow-x-hidden">
      {/* Directory Header Banner */}
      <div className="bg-gradient-to-r from-[#2c0902] via-[#3a1005] to-[#2c0902] text-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-amber-500/80 shadow-xl space-y-3.5 sm:space-y-4 w-full min-w-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/40 uppercase tracking-wider break-words">
            {t(
              'వ్యాసాలు • ప్రతి వ్యాసానికి ప్రత్యేక పేజీ & సొంత లింక్',
              'Vedic Astrology Articles • Every Article Opens on Its Own Dedicated URL'
            )}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] sm:text-xs font-bold border border-emerald-400/40">
            {t(
              `మొత్తం ${allCards.length} ప్రత్యేక వ్యాసాలు`,
              `${allCards.length} Standalone Bilingual Articles`
            )}
          </span>
        </div>

        <h1 className="text-xl sm:text-4xl font-extrabold text-amber-100 font-telugu leading-snug sm:leading-tight break-words">
          {t(
            'వేద జ్యోతిష వ్యాసాల గ్రంథాలయం – ఏ వ్యాసం ఆ వ్యాసానికే ప్రత్యేక పేజీ & షేరబుల్ లింక్',
            'Vedic Astrology Articles Library – Dedicated Standalone Pages & Shareable Links'
          )}
        </h1>

        <p className="text-xs sm:text-base text-amber-200/90 font-telugu max-w-4xl leading-relaxed break-words">
          {t(
            'పాఠకులకు ఎటువంటి గందరగోళం లేకుండా ఇక్కడ కేవలం వ్యాసాల కార్డుల జాబితా మాత్రమే కనిపిస్తుంది. మీరు ఏ వ్యాసం కార్డుపై క్లిక్ చేసినా, ఆ ఒక్క వ్యాసం మాత్రమే తన సొంత ప్రత్యేక వెబ్ లింక్ (Unique URL) మరియు 16:9 చిత్రంతో ప్రత్యేక పేజీగా తెరుచుకుంటుంది.',
            'To prevent any reading clutter, this directory displays only clean article cards. Clicking any card opens that single article on its own dedicated URL with its custom 16:9 image and instant link-sharing controls.'
          )}
        </p>

        {/* Category Filter Tabs */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex flex-col items-start justify-between p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer min-w-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-amber-200 shadow-lg'
                    : 'bg-amber-950/60 hover:bg-amber-900/70 text-amber-100 border-amber-700/60'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1 mb-1 min-w-0">
                  <Icon size={15} className={`${isActive ? 'text-amber-950' : 'text-amber-400'} shrink-0`} />
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full truncate ${
                      isActive
                        ? 'bg-amber-950/15 text-amber-950'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {isTe ? tab.badgeTe : tab.badgeEn}
                  </span>
                </div>
                <span className="text-xs font-extrabold font-telugu leading-snug break-words">
                  {isTe ? tab.labelTe : tab.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pure Standalone Cards Grid — Zero Stacked Full Articles Below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 min-w-0">
        {filteredCards.map((card) => {
          const IconComp = iconsBySlug[card.slug] || BookOpen;
          const title = isTe ? card.titleTe : card.titleEn;
          const summary = isTe ? card.summaryTe : card.summaryEn;
          const keywords = isTe ? card.keywordsTe : card.keywordsEn;
          const isCopied = copiedSlug === card.slug;

          const handleQuickShareCard = async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window === 'undefined') return;
            const articleUrl = `${window.location.origin}/${card.slug}`;
            const shareText = `📖 ${title}\n\n${summary.slice(0, 140)}...\n\n🔗 ప్రత్యేక వ్యాసం లింక్:\n${articleUrl}`;

            try {
              if (navigator.share) {
                try {
                  const resp = await fetch(card.heroImage);
                  const blob = await resp.blob();
                  const file = new File([blob], `${card.slug}.jpg`, { type: 'image/jpeg' });
                  if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                      title,
                      text: shareText,
                      url: articleUrl,
                      files: [file],
                    });
                    return;
                  }
                } catch {}
                await navigator.share({
                  title,
                  text: shareText,
                  url: articleUrl,
                });
                return;
              }
            } catch {}

            const waText = encodeURIComponent(shareText);
            window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
          };

          return (
            <article
              key={card.slug}
              className="bg-white rounded-2xl sm:rounded-3xl border-2 border-amber-300/80 hover:border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group min-w-0"
            >
              <div className="min-w-0">
                {/* Clickable 16:9 Article Hero Image */}
                <a
                  href={`/${card.slug}`}
                  onClick={(e) => {
                    if (onSelectArticle) {
                      e.preventDefault();
                      onSelectArticle(card.slug);
                    }
                  }}
                  className="relative block aspect-video w-full overflow-hidden bg-[#2c0902]"
                >
                  <img
                    src={card.heroImage}
                    alt={isTe ? card.imageAltTe : card.imageAltEn}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e0501]/85 via-transparent to-black/25 pointer-events-none" />

                  {/* Top badges on image */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-100 bg-amber-950/85 backdrop-blur-xs px-2 py-0.5 rounded-full border border-amber-400/50 shadow-sm truncate">
                      <IconComp size={11} className="text-amber-400 shrink-0" />
                      <span className="truncate">
                        {card.archivalBadge
                          ? card.archivalBadge
                          : isTe
                          ? 'ప్రత్యేక వ్యాస పేజీ'
                          : 'Standalone Article'}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-100 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-amber-300/40 shrink-0">
                      <Clock size={10} className="text-amber-300" />
                      {card.readTimeMinutes} {t('ని॥', 'm')}
                    </span>
                  </div>

                  {/* Bottom category & section count on image */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 drop-shadow truncate">
                      {isTe ? card.categoryTe : card.categoryEn}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-200 bg-emerald-950/85 px-2 py-0.5 rounded-full border border-emerald-400/40 shrink-0">
                      {card.sectionCount} {t('అధ్యాయాలు', 'sections')}
                    </span>
                  </div>
                </a>

                <div className="p-4 sm:p-6 space-y-3 min-w-0">
                  <a
                    href={`/${card.slug}`}
                    onClick={(e) => {
                      if (onSelectArticle) {
                        e.preventDefault();
                        onSelectArticle(card.slug);
                      }
                    }}
                    className="block min-w-0"
                  >
                    <h2 className="text-base sm:text-lg font-extrabold text-amber-950 font-telugu group-hover:text-amber-800 leading-snug break-words">
                      {title}
                    </h2>
                  </a>

                  <p className="text-xs sm:text-sm text-gray-700 font-telugu line-clamp-3 leading-relaxed">
                    {summary}
                  </p>

                  {/* Explicit Standalone URL Pill + 1-Click Copy Link */}
                  <div className="bg-amber-50/95 rounded-xl px-3 py-2 border border-amber-300/80 flex items-center justify-between gap-2">
                    <div className="truncate text-[11px] font-mono text-amber-900">
                      <span className="font-bold text-amber-700">🔗 Link: </span>
                      <span>/{card.slug}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isGuruAdmin && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyCardLink(e, card.slug)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-900 hover:bg-amber-800 text-amber-100 text-[10px] font-bold cursor-pointer transition-colors"
                          title={t('ఈ వ్యాసం లింక్ కాపీ చేయండి', 'Copy this article URL')}
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 size={11} className="text-emerald-300" />
                              <span>{t('కాపీ అయింది', 'Copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>{t('🔒 లింక్ కాపీ', '🔒 Copy URL')}</span>
                            </>
                          )}
                        </button>
                      )}
                      <a
                        href={`/${card.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-[10px] font-bold transition-colors"
                        title={t('కొత్త ట్యాబ్‌లో తెరవండి', 'Open in new tab')}
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Classical Grantha Source Pill if applicable */}
                  {card.archivalAuthorsTe && (
                    <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/80 text-[11px] text-amber-950 space-y-0.5">
                      <p className="font-extrabold text-amber-900">
                        📚 {t('మూల గ్రంథ ప్రమాణం:', 'Classical Grantha Source:')}
                      </p>
                      <p className="text-gray-700">
                        {isTe ? card.archivalAuthorsTe : card.archivalAuthorsEn}
                      </p>
                    </div>
                  )}

                  {/* Key Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {keywords.slice(0, 3).map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="text-[10px] font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 border-t border-amber-100 mt-1 flex items-center gap-2">
                <a
                  href={`/${card.slug}`}
                  onClick={(e) => {
                    if (onSelectArticle) {
                      e.preventDefault();
                      onSelectArticle(card.slug);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all group-hover:translate-x-0.5"
                >
                  <span>{t('ఈ వ్యాసం పేజీ తెరవండి', 'Open Article Page')}</span>
                  <ArrowRight size={15} />
                </a>
                <button
                  type="button"
                  onClick={handleQuickShareCard}
                  title={t('చిత్రం & లింక్ షేర్ చేయండి', 'Share Article Image & Link')}
                  className="inline-flex items-center gap-1.5 py-3 px-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Share2 size={14} />
                  <span>{t('షేర్', 'Share')}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
