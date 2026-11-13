import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Copy,
  Languages,
  Compass,
  Baby,
  Activity,
  Flame,
  Award,
  ScrollText,
  Bookmark,
  Download,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import {
  VEDIC_CLASSICAL_ARTICLES,
  VedicClassicalArticle,
} from '../data/vedicArticlesData';
import { SPECIAL_STANDALONE_ARTICLE_CARDS } from './VedicArticlesDirectory';
import { DwadasaRashiVedicGuide } from './DwadasaRashiVedicGuide';
import { DailyNakshatraArticle } from './DailyNakshatraArticle';
import { DailyAstrologyInsights } from './DailyAstrologyInsights';
import { AstroinformaticsResearch } from './AstroinformaticsResearch';
import { useLanguage } from '../context/LanguageContext';
import { DayData } from '../types/panchangam';
import { computeBhavarthaAndAyurvedaReport } from '../utils/bhavarthaAndAyurvedaEngine';
import { computePersonalHoroscopeVastu } from '../utils/dakshinaBharatiyaMarriageAndVastuEngine';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';

const QUICK_RASHIS_12 = [
  { idx: 0, te: 'మేషం', en: 'Mesha (Aries)', lordTe: 'కుజుడు', gemTe: 'పగడం (Red Coral)' },
  { idx: 1, te: 'వృషభం', en: 'Vrishabha (Taurus)', lordTe: 'శుక్రుడు', gemTe: 'వజ్రం / ఒపల్ (Diamond)' },
  { idx: 2, te: 'మిథునం', en: 'Mithuna (Gemini)', lordTe: 'బుధుడు', gemTe: 'మరకతం / పచ్చ (Emerald)' },
  { idx: 3, te: 'కర్కాటకం', en: 'Karkataka (Cancer)', lordTe: 'చంద్రుడు', gemTe: 'ముత్యం (Natural Pearl)' },
  { idx: 4, te: 'సింహం', en: 'Simha (Leo)', lordTe: 'సూర్యుడు', gemTe: 'కెంపు / మాణిక్యం (Ruby)' },
  { idx: 5, te: 'కన్య', en: 'Kanya (Virgo)', lordTe: 'బుధుడు', gemTe: 'మరకతం / పచ్చ (Emerald)' },
  { idx: 6, te: 'తుల', en: 'Tula (Libra)', lordTe: 'శుక్రుడు', gemTe: 'వజ్రం / జిర్కాన్ (Diamond)' },
  { idx: 7, te: 'వృశ్చికం', en: 'Vrischika (Scorpio)', lordTe: 'కుజుడు', gemTe: 'పగడం (Red Coral)' },
  { idx: 8, te: 'ధనుస్సు', en: 'Dhanussu (Sagittarius)', lordTe: 'గురువు', gemTe: 'పుష్యరాగం (Yellow Sapphire)' },
  { idx: 9, te: 'మకరం', en: 'Makara (Capricorn)', lordTe: 'శని', gemTe: 'నీలం (Blue Sapphire)' },
  { idx: 10, te: 'కుంభం', en: 'Kumbha (Aquarius)', lordTe: 'శని', gemTe: 'నీలం (Blue Sapphire)' },
  { idx: 11, te: 'మీనం', en: 'Meena (Pisces)', lordTe: 'గురువు', gemTe: 'పుష్యరాగం (Yellow Sapphire)' },
];

interface VedicArticleReaderProps {
  articleSlug: string;
  currentDay?: DayData;
  onNavigateArticle?: (slug: string) => void;
  onOpenBooking?: () => void;
  onNavigateHome?: () => void;
}

export const VedicArticleReader: React.FC<VedicArticleReaderProps> = ({
  articleSlug,
  currentDay,
  onNavigateArticle,
  onOpenBooking,
  onNavigateHome,
}) => {
  const { language: globalLang } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();
  // Allow per-article language toggle while defaulting to global language
  const [contentLang, setContentLang] = useState<'te' | 'en'>(
    globalLang === 'en' ? 'en' : 'te'
  );
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [sharingImage, setSharingImage] = useState<boolean>(false);
  const [selectedQuickRashiIdx, setSelectedQuickRashiIdx] = useState<number>(0);

  const quickBhavarthaReport = computeBhavarthaAndAyurvedaReport(
    [
      { id: 'sun', nameTe: 'సూర్యుడు', nameEn: 'Sun', rashiIdx: selectedQuickRashiIdx, longitude: selectedQuickRashiIdx * 30 + 10 },
      { id: 'moon', nameTe: 'చంద్రుడు', nameEn: 'Moon', rashiIdx: selectedQuickRashiIdx, longitude: selectedQuickRashiIdx * 30 + 15 },
      { id: 'mars', nameTe: 'కుజుడు', nameEn: 'Mars', rashiIdx: (selectedQuickRashiIdx + 4) % 12, longitude: ((selectedQuickRashiIdx + 4) % 12) * 30 + 12 },
      { id: 'mercury', nameTe: 'బుధుడు', nameEn: 'Mercury', rashiIdx: selectedQuickRashiIdx, longitude: selectedQuickRashiIdx * 30 + 18 },
      { id: 'jupiter', nameTe: 'గురువు', nameEn: 'Jupiter', rashiIdx: (selectedQuickRashiIdx + 8) % 12, longitude: ((selectedQuickRashiIdx + 8) % 12) * 30 + 9 },
      { id: 'venus', nameTe: 'శుక్రుడు', nameEn: 'Venus', rashiIdx: (selectedQuickRashiIdx + 9) % 12, longitude: ((selectedQuickRashiIdx + 9) % 12) * 30 + 20 },
      { id: 'saturn', nameTe: 'శని', nameEn: 'Saturn', rashiIdx: (selectedQuickRashiIdx + 10) % 12, longitude: ((selectedQuickRashiIdx + 10) % 12) * 30 + 5 },
      { id: 'rahu', nameTe: 'రాహువు', nameEn: 'Rahu', rashiIdx: (selectedQuickRashiIdx + 2) % 12, longitude: ((selectedQuickRashiIdx + 2) % 12) * 30 + 14 },
    ],
    selectedQuickRashiIdx
  );
  const quickVastuReport = computePersonalHoroscopeVastu(selectedQuickRashiIdx);
  const selectedQuickRashiMeta = QUICK_RASHIS_12[selectedQuickRashiIdx] || QUICK_RASHIS_12[0];

  useEffect(() => {
    // If global language changes, align default
    setContentLang(globalLang === 'en' ? 'en' : 'te');
  }, [globalLang]);

  const specialCard = SPECIAL_STANDALONE_ARTICLE_CARDS.find(
    (c) => c.slug === articleSlug
  );

  const article: VedicClassicalArticle =
    VEDIC_CLASSICAL_ARTICLES.find((a) => a.slug === articleSlug) ||
    VEDIC_CLASSICAL_ARTICLES[0];

  const currentContent = contentLang === 'te' ? article.telugu : article.english;
  const isTe = contentLang === 'te';

  const otherArticles = VEDIC_CLASSICAL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const activeSlug = specialCard ? specialCard.slug : article.slug;
  const activeHeroImage = specialCard ? specialCard.heroImage : article.heroImage;
  const activeTitle = specialCard
    ? isTe
      ? specialCard.titleTe
      : specialCard.titleEn
    : currentContent.title;
  const activeSummary = specialCard
    ? isTe
      ? specialCard.summaryTe
      : specialCard.summaryEn
    : currentContent.summary;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${activeSlug}`;
      navigator.clipboard?.writeText(url).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${activeSlug}`;
      const text = encodeURIComponent(
        `📖 *${activeTitle}*\n\n${activeSummary}\n\n🔗 పూర్తి వ్యాసం & చిత్రం ఇక్కడ చూడండి:\n${url}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleShareWithImage = async () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/${activeSlug}`;
    const shareText = `${activeTitle}\n\n${activeSummary}\n\nపూర్తి వ్యాసం చదవండి: ${url}`;

    setSharingImage(true);
    try {
      if (navigator.share) {
        try {
          const response = await fetch(activeHeroImage);
          const blob = await response.blob();
          const file = new File([blob], `${activeSlug}.jpg`, {
            type: blob.type || 'image/jpeg',
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: activeTitle,
              text: shareText,
              url,
              files: [file],
            });
            setSharingImage(false);
            return;
          }
        } catch {
          // Fallback to URL + text share
        }
        await navigator.share({
          title: activeTitle,
          text: shareText,
          url,
        });
        setSharingImage(false);
        return;
      }
    } catch {
      // User cancelled or share failed
    }
    setSharingImage(false);
    handleShareWhatsApp();
  };

  const handleDownloadImage = async () => {
    if (typeof window === 'undefined') return;
    try {
      const response = await fetch(activeHeroImage);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${activeSlug}-telugu-jyothisham.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(activeHeroImage, '_blank');
    }
  };

  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);

  const toggleFaq = (idx: number) => {
    setExpandedFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const standaloneTopBar = (
    <div className="bg-gradient-to-r from-amber-950 via-[#2c0902] to-amber-950 text-amber-100 rounded-2xl p-3 sm:p-4 border-2 border-amber-400/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full min-w-0">
      <a
        href="/vedic-articles"
        onClick={(e) => {
          if (onNavigateHome) {
            e.preventDefault();
            onNavigateHome();
          }
        }}
        className="inline-flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm shadow transition-all w-full sm:w-auto min-w-0"
      >
        <ArrowLeft size={15} className="shrink-0" />
        <span className="truncate">
          {isTe
            ? 'అన్ని వ్యాసాల జాబితాకు తిరిగి వెళ్ళండి'
            : 'Back to All Articles Directory'}
        </span>
      </a>

      {/* Explicit Standalone URL + Copy + Open New Tab */}
      <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto min-w-0">
        <div className="px-2.5 py-1.5 rounded-xl bg-black/50 border border-amber-500/50 text-[11px] font-mono text-amber-200 flex items-center gap-1.5 min-w-0 flex-1 sm:flex-initial">
          <span className="text-amber-400 font-bold shrink-0">🔗</span>
          <span className="truncate">/{activeSlug}</span>
        </div>
        {isGuruAdmin && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-bold border border-amber-500/60 cursor-pointer transition-all shrink-0"
          >
            {copiedShare ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>{isTe ? 'కాపీ అయింది!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy size={13} className="shrink-0" />
                <span>{isTe ? '🔒 లింక్ కాపీ' : '🔒 Copy'}</span>
              </>
            )}
          </button>
        )}
        <a
          href={`/${activeSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-1.5 rounded-xl bg-amber-900/90 hover:bg-amber-800 text-amber-200 text-xs font-bold border border-amber-600/60 shrink-0"
          title={isTe ? 'కొత్త ట్యాబ్‌లో తెరవండి' : 'Open in new tab'}
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );

  if (specialCard) {
    return (
      <article className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-12 w-full min-w-0 overflow-x-hidden">
        {standaloneTopBar}

        {/* Special Standalone Article Hero Header */}
        <header className="relative bg-gradient-to-br from-[#2c0902] via-[#3a1005] to-[#1e0501] text-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-amber-500/80 shadow-2xl overflow-hidden space-y-4 w-full min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/40 uppercase tracking-wider max-w-full">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              <span className="truncate">{isTe ? specialCard.categoryTe : specialCard.categoryEn}</span>
            </span>
            <div className="flex items-center gap-1 bg-amber-950/90 p-1 rounded-xl border border-amber-500/50 shrink-0">
              <button
                type="button"
                onClick={() => setContentLang('te')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  isTe ? 'bg-amber-400 text-amber-950' : 'text-amber-200'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => setContentLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  !isTe ? 'bg-amber-400 text-amber-950' : 'text-amber-200'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold text-amber-100 leading-snug sm:leading-tight font-telugu break-words">
            {activeTitle}
          </h1>
          <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed font-telugu break-words">
            {activeSummary}
          </p>

          <div className="rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl bg-black/40 w-full min-w-0">
            <div className="relative aspect-video w-full max-h-[360px] overflow-hidden">
              <img
                src={specialCard.heroImage}
                alt={isTe ? specialCard.imageAltTe : specialCard.imageAltEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-amber-950/95 px-3 sm:px-4 py-3 border-t border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs text-amber-200 font-telugu">
                {isTe
                  ? 'ఈ ప్రత్యేక వ్యాసాన్ని చిత్రం & లింక్‌తో షేర్ చేయండి:'
                  : 'Share this standalone article with image & link:'}
              </span>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleShareWithImage}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 text-xs font-extrabold shadow cursor-pointer"
                >
                  <Share2 size={14} className="shrink-0" />
                  <span className="truncate">{isTe ? 'చిత్రం + లింక్ షేర్' : 'Share Image'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow cursor-pointer"
                >
                  <MessageCircle size={14} className="shrink-0" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Render ONLY the single requested standalone component */}
        <div className="w-full min-w-0 overflow-x-hidden">
          {articleSlug === 'dwadasa-rashi-rahasyalu' && (
            <DwadasaRashiVedicGuide onOpenBooking={onOpenBooking} />
          )}
          {articleSlug === 'neti-nakshatra-vyasam' && currentDay && (
            <DailyNakshatraArticle currentDay={currentDay} onOpenBooking={onOpenBooking} />
          )}
          {articleSlug === 'neti-jyothisha-visleshana' && currentDay && (
            <DailyAstrologyInsights currentDay={currentDay} onOpenBooking={onOpenBooking} />
          )}
          {articleSlug === 'astroinformatics-research' && <AstroinformaticsResearch />}
        </div>

        <div className="pt-2 text-center">
          <a
            href="/vedic-articles"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-100 font-extrabold text-xs sm:text-sm shadow-lg w-full sm:w-auto"
          >
            <ArrowLeft size={16} className="shrink-0" />
            <span>
              {isTe
                ? 'అన్ని వ్యాసాల జాబితాకు తిరిగి వెళ్ళండి (Back to All Articles)'
                : 'Return to All Articles Directory'}
            </span>
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="space-y-5 sm:space-y-8 max-w-5xl mx-auto pb-12 w-full min-w-0 overflow-x-hidden">
      {standaloneTopBar}

      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-amber-200/80 pb-3 w-full min-w-0">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-900 min-w-0 flex-1 overflow-hidden"
        >
          <a
            href="/"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="hover:text-amber-700 underline font-medium shrink-0"
          >
            {isTe ? 'హోమ్' : 'Home'}
          </a>
          <span className="text-amber-400 shrink-0">/</span>
          <a
            href="/vedic-articles"
            className="hover:text-amber-700 underline font-semibold text-amber-800 shrink-0"
          >
            {isTe ? 'వ్యాసాలు' : 'Articles'}
          </a>
          <span className="text-amber-400 shrink-0">/</span>
          <span className="text-amber-950 font-bold truncate min-w-0">
            {currentContent.primaryKeyword}
          </span>
        </nav>

        {/* Dual Language Switcher */}
        <div className="flex items-center gap-1 bg-amber-100/90 p-1 rounded-xl border border-amber-300 shrink-0">
          <button
            type="button"
            onClick={() => setContentLang('te')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isTe
                ? 'bg-amber-900 text-amber-100 shadow-sm'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            తెలుగు
          </button>
          <button
            type="button"
            onClick={() => setContentLang('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              !isTe
                ? 'bg-amber-900 text-amber-100 shadow-sm'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <header className="relative bg-gradient-to-br from-[#2c0902] via-[#3a1005] to-[#1e0501] text-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-10 border-2 border-amber-500/80 shadow-2xl overflow-hidden w-full min-w-0">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 sm:space-y-5 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/40 uppercase tracking-wider max-w-full">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              <span className="truncate">{isTe ? article.categoryTe : article.categoryEn}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-200 text-[11px] sm:text-xs font-semibold border border-amber-700/60">
              <Clock size={12} className="shrink-0" />
              <span>
                {article.readTimeMinutes} {isTe ? 'ని॥ పఠనం' : 'min read'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-200 text-[11px] sm:text-xs font-semibold border border-amber-700/60">
              <Calendar size={12} className="shrink-0" />
              <span>{article.dateModified}</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold text-amber-100 leading-snug sm:leading-tight font-telugu tracking-tight break-words">
            {currentContent.title}
          </h1>

          <p className="text-amber-200/90 text-sm sm:text-base leading-[1.75] sm:leading-relaxed max-w-3xl font-telugu break-words">
            {currentContent.summary}
          </p>

          {/* Dedicated 16:9 Article Hero Image & Share Bar */}
          <div className="rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-black/40 w-full min-w-0">
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={article.heroImage}
                alt={isTe ? article.imageAltTe : article.imageAltEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between gap-2 min-w-0">
                <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-amber-200 text-[11px] font-semibold border border-amber-400/40 font-telugu truncate max-w-[65%]">
                  {isTe ? article.imageAltTe : article.imageAltEn}
                </span>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-amber-500/90 text-amber-950 text-[10px] sm:text-[11px] font-extrabold truncate max-w-full">
                  /{article.slug}
                </span>
              </div>
            </div>

            {/* Dedicated Share with Image & Link Action Bar */}
            <div className="bg-amber-950/95 p-3 sm:px-4 sm:py-3 border-t border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="text-xs text-amber-200 font-telugu flex items-center gap-1.5 min-w-0">
                <Share2 size={14} className="text-amber-400 shrink-0" />
                <span className="leading-snug">
                  {isTe
                    ? 'ఈ వ్యాసాన్ని చిత్రం & లింక్‌తో షేర్ చేయండి:'
                    : 'Share this article with image & link:'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleShareWithImage}
                  disabled={sharingImage}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 text-xs font-extrabold shadow transition-all cursor-pointer"
                >
                  <Share2 size={13} className="shrink-0" />
                  <span className="truncate">
                    {sharingImage
                      ? isTe
                        ? 'షేర్ అవుతోంది...'
                        : 'Sharing...'
                      : isTe
                      ? 'చిత్రం + లింక్ షేర్'
                      : 'Share Image'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <MessageCircle size={13} className="shrink-0" />
                  <span>WhatsApp</span>
                </button>
                {isGuruAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold border border-amber-600/70 transition-all cursor-pointer"
                      title={isTe ? 'వ్యాస చిత్రం డౌన్‌లోడ్ చేయండి' : 'Download Article Image'}
                    >
                      <Download size={13} className="shrink-0" />
                      <span>{isTe ? '🔒 చిత్రం సేవ్' : '🔒 Save Image'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-200 text-xs font-bold border border-amber-600/60 transition-all cursor-pointer"
                      title={isTe ? 'లింక్ కాపీ చేయండి' : 'Copy link'}
                    >
                      {copiedShare ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          <span>{isTe ? 'కాపీ అయింది!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} className="shrink-0" />
                          <span>{isTe ? '🔒 లింక్ కాపీ' : '🔒 Copy Link'}</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Author Badge */}
          <div className="pt-3 border-t border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-full bg-[#2c0902] flex items-center justify-center text-amber-300 font-bold text-xs sm:text-sm">
                  శ్రీ
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5 flex-wrap">
                  <span className="break-words">{isTe ? article.author.nameTe : article.author.nameEn}</span>
                  <Award size={14} className="text-yellow-400 shrink-0" />
                </div>
                <div className="text-[11px] sm:text-xs text-amber-300/80 break-words">
                  {isTe ? article.author.titleTe : article.author.titleEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Classical Maharshi & Shastra Citations Box */}
      {article.archivalSource && (
        <section
          aria-label={isTe ? 'ప్రామాణిక మహర్షులు & మూల గ్రంథాలు' : 'Classical Maharshi & Grantha Citations'}
          className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-amber-400 shadow-xl overflow-hidden w-full min-w-0"
        >
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-amber-300 pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-sm shrink-0">
                  <Bookmark size={16} />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block break-words">
                    {isTe
                      ? 'ప్రామాణిక మహర్షులు & మూల గ్రంథ ప్రమాణాలు'
                      : 'Classical Maharshis & Shastra Citations'}
                  </span>
                  <span className="text-xs text-amber-800 font-semibold block break-words">
                    {isTe
                      ? 'సనాతన ఆర్ష జ్యోతిష శాస్త్ర సంప్రదాయ పరిశోధన'
                      : 'Traditional Sanathana Rishi & Classical Grantha Synthesis'}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-amber-900 text-amber-100 text-[11px] font-bold shadow-sm">
                {isTe ? 'శాస్త్ర ప్రమాణబద్ధం' : 'Shastra Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-amber-950 min-w-0">
              <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-amber-200/90 shadow-sm space-y-1.5 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  {isTe ? 'మూల జ్యోతిష గ్రంథాలు:' : 'Primary Classical Treatises:'}
                </span>
                <p className="font-extrabold text-sm text-amber-950 font-telugu break-words">
                  {isTe
                    ? 'బృహత్ పరాశర హోరా శాస్త్రం · ఫలదీపిక · బృహజ్జాతకం'
                    : 'Brihat Parashara Hora Shastra · Phaladeepika · Brihat Jataka'}
                </p>
                <p className="text-xs text-amber-900 break-words">
                  {isTe
                    ? 'మహర్షి జైమిని ఉపదేశ సూత్రాలు, మహాకవి కాళిదాసు ఉత్తర కాలామృతం, సారావళి & కేరళ ప్రశ్నమార్గ ప్రమాణాల సమన్వయం.'
                    : 'Synthesized with Maharshi Jaimini Upadesha Sutras, Kalidasa Uttara Kalamrita, Saravali & Kerala Prasnamarga.'}
                </p>
              </div>

              <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-amber-200/90 shadow-sm space-y-1.5 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  {isTe ? 'ఆర్ష విజ్ఞాన విభాగాలు:' : 'Classical Shastra Pillars:'}
                </span>
                <p className="font-extrabold text-sm text-amber-950 font-telugu break-words">
                  {isTe
                    ? 'దృక్సిద్ధాంత గణితం · సప్తవర్గ · గోచార వేధ · ఆయుర్వేద వైద్య జ్యోతిషం'
                    : 'Drik Siddhanta · Saptavarga · Gochara Vedha · Ayurveda Jyotisha'}
                </p>
                <p className="text-xs text-amber-900 break-words">
                  {isTe
                    ? 'సముద్ర మహర్షి సాముద్రిక శాస్త్రం, శివ స్వరోదయం & భృగు నంది నాడి సూత్రాల ప్రకారం సంకలనం చేయబడింది.'
                    : 'Grounded in Sage Samudra Samudrika Shastra, Shiva Swarodaya & Bhrigu Nandi Nadi axioms.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start w-full min-w-0">
        {/* Table of Contents Sidebar (Collapsible on Mobile, Sticky on Desktop) */}
        <aside className="lg:col-span-4 space-y-4 sm:space-y-6 lg:sticky lg:top-24 w-full min-w-0">
          <div className="bg-amber-50/95 rounded-2xl p-4 sm:p-5 border border-amber-300 shadow-sm w-full min-w-0">
            <button
              type="button"
              onClick={() => setMobileTocOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-left lg:cursor-default"
            >
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <BookOpen size={15} className="shrink-0 text-amber-700" />
                <span>
                  {isTe ? 'విషయ సూచిక (Table of Contents)' : 'Table of Contents'}
                </span>
              </h3>
              <span className="lg:hidden inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-lg">
                <span>{mobileTocOpen ? (isTe ? 'మూసివేయి' : 'Hide') : (isTe ? 'చూడండి' : 'Show')}</span>
                {mobileTocOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </button>

            <ul
              className={`${
                mobileTocOpen ? 'block' : 'hidden'
              } lg:block space-y-2 text-xs sm:text-sm text-amber-950 font-medium mt-3 pt-3 border-t border-amber-200/80`}
            >
              {currentContent.sections.map((sec, idx) => (
                <li key={idx} className="min-w-0">
                  <a
                    href={`#section-${idx}`}
                    onClick={() => setMobileTocOpen(false)}
                    className="hover:text-amber-700 block py-1 border-l-2 border-amber-300 pl-2.5 transition-colors break-words"
                  >
                    {sec.heading}
                  </a>
                </li>
              ))}
              {currentContent.remedies.length > 0 && (
                <li>
                  <a
                    href="#remedies-section"
                    onClick={() => setMobileTocOpen(false)}
                    className="hover:text-amber-700 block py-1 border-l-2 border-amber-300 pl-2.5 transition-colors"
                  >
                    {isTe ? 'శాస్త్రోక్త పరిహారాలు & మంత్రాలు' : 'Vedic Remedies & Mantras'}
                  </a>
                </li>
              )}
              {currentContent.faqs.length > 0 && (
                <li>
                  <a
                    href="#faqs-section"
                    onClick={() => setMobileTocOpen(false)}
                    className="hover:text-amber-700 block py-1 border-l-2 border-amber-300 pl-2.5 transition-colors"
                  >
                    {isTe ? 'తరచుగా అడిగే ప్రశ్నలు (FAQs)' : 'Frequently Asked Questions'}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Consultation CTA Banner (Desktop Sidebar) */}
          <div className="hidden lg:block bg-gradient-to-r from-amber-900 to-[#3b1205] text-amber-100 rounded-2xl p-5 border border-amber-500/80 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isTe ? 'గురూజీతో సంప్రదించండి' : 'Consult Guruji'}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed font-telugu">
              {isTe
                ? 'మీ జాతకంలో నక్షత్ర గండాలు, దోషాలు లేదా తక్షణ ప్రశ్న లగ్న సమాధానం కోసం గురూజీ బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని సంప్రదించండి.'
                : 'For authentic personalized Vedic horoscope analysis or Prashna consultation, book an appointment with Brahmasri Jallavaram Sai Dheeraj Sharma.'}
            </p>
            {onOpenBooking && (
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-extrabold text-xs shadow hover:from-amber-300 hover:to-yellow-200 transition-all text-center cursor-pointer"
              >
                {isTe ? 'జ్యోతిష అపాయింట్‌మెంట్ బుక్ చేయండి' : 'Book Astrology Consultation'}
              </button>
            )}
          </div>
        </aside>

        {/* Article Body (8 cols on lg, 100% width with min-w-0 on mobile) */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-8 w-full min-w-0">
          {/* 30-Second Shastra Key Takeaways Box (Featured Snippet Optimization) */}
          <aside
            aria-label={isTe ? '30-సెకన్ల శాస్త్ర సారాంశం & ముఖ్యాంశాలు' : '30-Second Classical Key Takeaways'}
            className="bg-gradient-to-br from-[#fffbeb] via-[#fef3c7]/60 to-[#fffbeb] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-amber-500 shadow-md space-y-3.5 w-full min-w-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300/90 pb-2.5">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-800 shrink-0" />
                <h2 className="text-sm sm:text-base font-extrabold text-amber-950 font-telugu uppercase tracking-wide">
                  {isTe
                    ? '📜 30-సెకన్ల శాస్త్ర సారాంశం & ముఖ్యాంశాలు (Key Takeaways)'
                    : '📜 30-Second Shastra Key Takeaways & Summary'}
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-900 text-amber-100 text-[11px] font-bold">
                {currentContent.primaryKeyword}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-amber-950 font-telugu leading-relaxed font-semibold bg-white/85 p-3.5 rounded-xl border border-amber-200">
              {currentContent.summary}
            </p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block">
                {isTe ? 'ఈ ప్రాచీన శాస్త్ర వ్యాసంలోని ప్రధాన అధ్యాయాలు:' : 'Core Classical Highlights in This Treatise:'}
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentContent.sections.map((sec, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2 text-xs text-amber-950 font-telugu bg-white/70 p-2 rounded-lg border border-amber-200/80">
                    <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                    <a
                      href={`#section-${sIdx}`}
                      className="font-bold hover:text-orange-800 transition-colors break-words"
                    >
                      {sec.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {currentContent.secondaryKeywords && currentContent.secondaryKeywords.length > 0 && (
              <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                  {isTe ? 'ప్రమాణ సూచికలు:' : 'Key Topics:'}
                </span>
                {currentContent.secondaryKeywords.map((kw, kIdx) => (
                  <span
                    key={kIdx}
                    className="px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 text-[11px] font-telugu font-semibold"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </aside>

          {currentContent.sections.map((section, idx) => (
            <section
              key={idx}
              id={`section-${idx}`}
              className="scroll-mt-24 bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200/90 shadow-md space-y-4 sm:space-y-5 w-full min-w-0 overflow-hidden"
            >
              <div className="min-w-0">
                {section.subheading && (
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1 break-words">
                    {section.subheading}
                  </span>
                )}
                <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950 font-telugu leading-snug break-words">
                  {section.heading}
                </h2>
              </div>

              {/* Shloka Highlight Box */}
              {section.shloka && (
                <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-300 shadow-sm space-y-2 w-full min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
                    {isTe ? '|| వేద శాస్త్ర ప్రమాణ శ్లోకం ||' : '|| Classical Sanskrit Shloka ||'}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-amber-950 font-telugu italic leading-[1.8] break-words">
                    {section.shloka.sanskrit}
                  </p>
                  <p className="text-xs sm:text-sm text-amber-900 font-telugu pt-2 border-t border-amber-200/80 leading-[1.75] break-words">
                    <strong className="text-amber-950">{isTe ? 'తాత్పర్యం: ' : 'Meaning: '}</strong>
                    {section.shloka.meaning}
                  </p>
                </div>
              )}

              {/* Section Narrative */}
              <p className="text-[15px] sm:text-base text-gray-800 leading-[1.85] sm:leading-relaxed font-telugu break-words">
                {section.content}
              </p>

              {/* Key Bullet Points */}
              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="space-y-2.5 pt-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {isTe ? 'ముఖ్యమైన శాస్త్ర నియమాలు:' : 'Key Astrological Principles:'}
                  </h4>
                  <ul className="space-y-2">
                    {section.keyPoints.map((point, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2.5 text-sm text-gray-800 font-telugu leading-[1.75] min-w-0"
                      >
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-1" />
                        <span className="break-words min-w-0 flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Classical Comparison Table — Stacked Vertical Cards on Mobile, Table on Tablet/Desktop */}
              {section.table && (
                <div className="pt-2 w-full min-w-0">
                  {/* Mobile Stacked Cards (< sm) — Zero horizontal scrolling needed! */}
                  <div className="sm:hidden space-y-3">
                    {section.table.rows.map((row, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded-2xl border border-amber-300 bg-amber-50/40 p-3.5 space-y-2 shadow-2xs"
                      >
                        {row.map((cell, cIdx) => {
                          const headerLabel = section.table?.headers[cIdx] || '';
                          if (cIdx === 0) {
                            return (
                              <div
                                key={cIdx}
                                className="pb-2 border-b border-amber-200/90 flex flex-col gap-0.5"
                              >
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                                  {headerLabel}
                                </span>
                                <span className="text-sm font-extrabold text-amber-950 font-telugu break-words">
                                  {cell}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div key={cIdx} className="text-xs sm:text-sm font-telugu leading-relaxed">
                              <span className="font-bold text-amber-900 block text-[11px]">
                                {headerLabel}:
                              </span>
                              <span className="text-gray-800 break-words block">{cell}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Tablet & Desktop Table (sm+) */}
                  <div className="hidden sm:block overflow-x-auto max-w-full rounded-xl border border-amber-200">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-amber-900 to-amber-950 text-amber-100">
                          {section.table.headers.map((th, thIdx) => (
                            <th key={thIdx} className="p-3 font-bold border border-amber-800">
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className={rIdx % 2 === 0 ? 'bg-amber-50/50' : 'bg-white'}
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-3 border border-amber-200 text-gray-800 font-telugu break-words ${
                                  cIdx === 0 ? 'font-bold text-amber-950' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* Remedies Section */}
          {currentContent.remedies.length > 0 && (
            <section
              id="remedies-section"
              className="scroll-mt-24 bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-amber-400 shadow-md space-y-5 w-full min-w-0 overflow-hidden"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Flame size={22} className="text-amber-600 shrink-0" />
                <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950 font-telugu break-words">
                  {isTe ? 'శాస్త్రోక్త శాంతి & పరిహార మార్గాలు' : 'Classical Vedic Remedies & Protections'}
                </h2>
              </div>

              {currentContent.remedies.map((rem, rIdx) => (
                <div
                  key={rIdx}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-300 shadow-sm space-y-3 min-w-0"
                >
                  <h3 className="text-base sm:text-lg font-bold text-amber-900 font-telugu flex items-start gap-2 break-words">
                    <Sparkles size={16} className="text-amber-500 shrink-0 mt-1" />
                    <span>{rem.title}</span>
                  </h3>
                  <p className="text-sm text-gray-700 font-telugu leading-[1.8] break-words">
                    {rem.description}
                  </p>
                  {rem.mantra && (
                    <div className="bg-amber-100/70 p-3.5 rounded-xl border border-amber-300 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                        {isTe ? 'దివ్య మంత్రం:' : 'Sacred Mantra:'}
                      </span>
                      <p className="text-sm font-bold text-amber-950 font-telugu leading-[1.8] break-words">
                        {rem.mantra}
                      </p>
                    </div>
                  )}
                  {rem.ritualSteps && (
                    <div className="space-y-1.5 pt-1 min-w-0">
                      <span className="text-xs font-bold text-amber-900 block">
                        {isTe ? 'ఆచరణాత్మక విధానం:' : 'Actionable Guidelines:'}
                      </span>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                        {rem.ritualSteps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2 font-telugu leading-relaxed">
                            <span className="text-amber-600 font-bold shrink-0">•</span>
                            <span className="break-words">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Interactive 12-Rashi Bhavartha Ratnakara Yogakaraka, Gemstone, Vastu & Tridosha Quick-Check Widget */}
          <section
            id="interactive-rashi-sutra-widget"
            className="scroll-mt-24 bg-gradient-to-br from-[#2a0e05] via-[#3d1608] to-[#230b03] text-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 border-amber-500 shadow-lg space-y-5 w-full min-w-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/40 pb-3.5">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span>
                    {isTe
                      ? 'భావార్థ రత్నాకర • ఆయుర్వేద జ్యోతిషం • వ్యక్తిగత వాస్తు తక్షణ పరీక్ష'
                      : 'Interactive 12-Rashi Yogakaraka, Vastu & Ayurveda Quick-Check'}
                  </span>
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white font-telugu">
                  {isTe
                    ? '🔱 మీ జన్మ రాశి / లగ్నాన్ని ఎంచుకోండి — తక్షణ రాజయోగ & వాస్తు సూత్రం చూడండి'
                    : '🔱 Select Your Rashi / Ascendant — Instant Classical Sutra & Vastu Guide'}
                </h2>
              </div>
              <a
                href="/janma-kundali"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-extrabold text-xs shadow hover:from-amber-300 hover:to-yellow-200 transition-all shrink-0 self-start sm:self-auto"
              >
                <span>{isTe ? '25-అధ్యాయాల పూర్తి జాతకం →' : 'Full 25-Chapter Horoscope →'}</span>
              </a>
            </div>

            {/* 12 Rashi Selector Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {QUICK_RASHIS_12.map((rItem) => {
                const isSelected = rItem.idx === selectedQuickRashiIdx;
                return (
                  <button
                    key={rItem.idx}
                    type="button"
                    onClick={() => setSelectedQuickRashiIdx(rItem.idx)}
                    className={`py-2 px-2.5 rounded-xl font-telugu text-xs sm:text-sm font-extrabold transition-all border text-center cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-white shadow-md scale-[1.02]'
                        : 'bg-amber-950/70 text-amber-100 border-amber-600/50 hover:bg-amber-900/80 hover:border-amber-400'
                    }`}
                  >
                    {isTe ? rItem.te : rItem.en.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Instant Decree Output for Selected Rashi */}
            <div className="bg-amber-950/60 rounded-2xl p-4 sm:p-5 border border-amber-500/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-2.5">
                <div>
                  <span className="text-[11px] text-amber-300 font-bold block">
                    {isTe
                      ? quickBhavarthaReport.bhavarthaDecree.chapterRefTe
                      : quickBhavarthaReport.bhavarthaDecree.chapterRefEn}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-yellow-300 font-telugu">
                    {isTe
                      ? `${selectedQuickRashiMeta.te} రాశి / లగ్నం — అధిపతి: ${selectedQuickRashiMeta.lordTe}`
                      : `${selectedQuickRashiMeta.en} — Ruling Lord & Yogakaraka Decree`}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-lg bg-amber-900/90 border border-amber-400/60 text-xs font-bold text-amber-100 font-telugu">
                  {isTe ? `శుభ రత్నం: ${selectedQuickRashiMeta.gemTe}` : `Gemstone: ${selectedQuickRashiMeta.gemTe}`}
                </span>
              </div>

              <div className="bg-black/30 rounded-xl p-3 border border-amber-500/30">
                <p className="text-xs sm:text-sm font-bold text-amber-200 font-telugu italic">
                  “{quickBhavarthaReport.bhavarthaDecree.sanskritShlokaTe}”
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-telugu">
                <div className="bg-amber-900/40 rounded-xl p-3.5 border border-amber-500/30 space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-300 block">
                    {isTe ? '👑 రాజయోగ & ధన కారక గ్రహాలు:' : '👑 Yogakaraka & Wealth Planets:'}
                  </span>
                  <p className="font-bold text-white">
                    {isTe
                      ? quickBhavarthaReport.bhavarthaDecree.yogakarakaPlanetsTe
                      : quickBhavarthaReport.bhavarthaDecree.yogakarakaPlanetsEn}
                  </p>
                  <p className="text-xs text-amber-100/90 leading-relaxed pt-1">
                    {isTe
                      ? quickBhavarthaReport.bhavarthaDecree.dhanaSutraTe
                      : quickBhavarthaReport.bhavarthaDecree.dhanaSutraEn}
                  </p>
                </div>

                <div className="bg-amber-900/40 rounded-xl p-3.5 border border-amber-500/30 space-y-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                    {isTe ? '🏡 వ్యక్తిగత కుబేర వాస్తు & ఆయుర్వేద త్రిదోషం:' : '🏡 Personal Vastu & Ayurvedic Prakriti:'}
                  </span>
                  <p className="text-xs text-amber-100">
                    <strong className="text-white">{isTe ? 'శుభ దిశ / సింహద్వారం: ' : 'Favorable Direction: '}</strong>
                    {isTe ? quickVastuReport.favourableDirectionTe : quickVastuReport.favourableDirectionEn}
                  </p>
                  <p className="text-xs text-amber-100">
                    <strong className="text-white">{isTe ? 'కుబేర ధన స్థానం: ' : 'Wealth Locker: '}</strong>
                    {isTe ? quickVastuReport.wealthCornerTe : quickVastuReport.wealthCornerEn}
                  </p>
                  <p className="text-xs text-amber-100">
                    <strong className="text-white">{isTe ? 'ఆయుర్వేద దేహ ప్రకృతి: ' : 'Ayurvedic Prakriti: '}</strong>
                    {isTe
                      ? `${quickBhavarthaReport.ayurvedaProfile.dominantDoshaTe} • ${quickBhavarthaReport.ayurvedaProfile.ayurvedicHerbsTe}`
                      : `${quickBhavarthaReport.ayurvedaProfile.dominantDoshaEn} • ${quickBhavarthaReport.ayurvedaProfile.ayurvedicHerbsEn}`}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <a
                  href="/janma-kundali"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs transition-colors"
                >
                  {isTe ? '📜 పుట్టిన తేదీతో 25-అధ్యాయాల బృహత్ జాతకం' : '📜 Generate 25-Chapter Horoscope'}
                </a>
                <a
                  href="/vivaha-pontana"
                  className="px-3.5 py-2 rounded-xl bg-amber-800/90 hover:bg-amber-700 text-amber-100 border border-amber-400/50 font-bold text-xs transition-colors"
                >
                  {isTe ? '💑 36 గుణాల & 22-పొంతనల వివాహ పొంతన' : '💑 36-Guna & 22-Porutham Match'}
                </a>
                <a
                  href="/muhurtham"
                  className="px-3.5 py-2 rounded-xl bg-amber-800/90 hover:bg-amber-700 text-amber-100 border border-amber-400/50 font-bold text-xs transition-colors"
                >
                  {isTe ? '🕉️ శుభ ముహూర్త నిర్ణయం' : '🕉️ Shubha Muhurtham Finder'}
                </a>
                <a
                  href="/rashi-phalalu"
                  className="px-3.5 py-2 rounded-xl bg-amber-800/90 hover:bg-amber-700 text-amber-100 border border-amber-400/50 font-bold text-xs transition-colors"
                >
                  {isTe ? '♈ నేటి 12 రాశుల ఫలితాలు' : '♈ Daily 12 Rashi Phalalu'}
                </a>
              </div>
            </div>
          </section>

          {/* Contextual Sitemap Topic-Cluster Links (12 Internal Authority Anchors) */}
          <nav
            aria-label={isTe ? 'సంబంధిత వైదిక గణన యంత్రాలు & అంతర్గత శాస్త్ర లంకెలు' : 'Related Vedic Calculators & Classical Treatises'}
            className="bg-amber-50/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-sm space-y-3.5 w-full min-w-0"
          >
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-amber-800 shrink-0" />
              <h3 className="text-sm sm:text-base font-extrabold text-amber-950 font-telugu">
                {isTe
                  ? '🔗 సంబంధిత ఉచిత వైదిక గణన యంత్రాలు & శాస్త్ర విభాగాలు (Direct Vedic Tools)'
                  : '🔗 Direct Vedic Astrology Calculators & Shastra Clusters'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-telugu">
              {[
                { href: '/janma-kundali', labelTe: '📜 ఉచిత తెలుగు జన్మ కుండలి (25-అధ్యాయాల PDF)', labelEn: '📜 Free 25-Chapter Janma Kundali PDF' },
                { href: '/mee-jatakam', labelTe: '🔮 పుట్టిన తేదీతో మీ జాతక ఫలితాలు (Mee Jatakam)', labelEn: '🔮 Complete Horoscope by Date of Birth' },
                { href: '/vivaha-pontana', labelTe: '💑 36 గుణాల & 22-పొంతనల వివాహ పొంతన', labelEn: '💑 36-Guna & 22-Porutham Marriage Match' },
                { href: '/muhurtham', labelTe: '🏛️ పెళ్లి, గృహప్రవేశ శుభ ముహూర్తాలు', labelEn: '🏛️ Marriage & Griha Pravesha Muhurtham' },
                { href: '/rashi-phalalu', labelTe: '🌟 నేటి ద్వాదశ రాశి ఫలాలు (12 Rashi Phalalu)', labelEn: '🌟 Today 12 Rashi Phalalu in Telugu' },
                { href: '/panchangam', labelTe: '📅 నేటి దృక్ సిద్ధాంత తెలుగు పంచాంగం', labelEn: '📅 Today Drik Siddhanta Telugu Panchangam' },
                { href: '/gowri-panchangam', labelTe: '⏳ నేటి గౌరీ పంచాంగం & హోరా చక్రం', labelEn: '⏳ Daily Gowri Panchangam & Hora Timings' },
                { href: '/tarabalam-chandrabalam', labelTe: '🌙 నక్షత్ర తారాబలం & చంద్రబలం గణన', labelEn: '🌙 Nakshatra Tarabalam & Chandrabalam' },
                { href: '/telugu-baby-names', labelTe: '👶 27 నక్షత్రాల తెలుగు పిల్లల పేర్లు', labelEn: '👶 27 Nakshatra Telugu Baby Names' },
                { href: '/dosha-pariharalu', labelTe: '🔱 కుజ, రాహు-కేతు, ఏలినాటి శని పరిహారాలు', labelEn: '🔱 Kuja, Rahu-Ketu & Sade Sati Remedies' },
                { href: '/bhavartha-ratnakara-300-raja-yogalu-ayurveda-jyotisham', labelTe: '👑 భావార్థ రత్నాకర & 300 రాజయోగాల గ్రంథం', labelEn: '👑 Bhavartha Ratnakara & 300 Raja Yogas' },
                { href: '/ashtagrantha-parashara-nadi-jyotisha-rahasyalu', labelTe: '📚 అష్ట-గ్రంథ పరాశర & నాడీ జ్యోతిష రహస్యాలు', labelEn: '📚 8-Grantha Parashara & Nadi Secrets' },
              ].map((lnk) => (
                <a
                  key={lnk.href}
                  href={lnk.href}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white hover:bg-amber-100/80 border border-amber-200 hover:border-amber-400 text-amber-950 font-bold transition-all"
                >
                  <span className="truncate">{isTe ? lnk.labelTe : lnk.labelEn}</span>
                  <ArrowRight size={13} className="text-amber-700 shrink-0" />
                </a>
              ))}
            </div>
          </nav>

          {/* FAQs Accordion Section */}
          {currentContent.faqs.length > 0 && (
            <section
              id="faqs-section"
              className="scroll-mt-24 bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200 shadow-md space-y-4 w-full min-w-0 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2 min-w-0">
                <HelpCircle size={20} className="text-amber-700 shrink-0" />
                <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950 font-telugu break-words">
                  {isTe ? 'తరచుగా అడిగే ప్రశ్నలు – సమాధానాలు' : 'Frequently Asked Questions (FAQs)'}
                </h2>
              </div>

              <div className="space-y-3">
                {currentContent.faqs.map((faq, fIdx) => {
                  const isOpen = expandedFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-amber-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(fIdx)}
                        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left bg-amber-50/60 hover:bg-amber-100/70 transition-colors gap-2"
                      >
                        <span className="font-bold text-amber-950 text-sm font-telugu break-words">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={18} className="text-amber-700 shrink-0" />
                        ) : (
                          <ChevronDown size={18} className="text-amber-700 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 sm:p-4 bg-white text-sm text-gray-800 font-telugu leading-[1.8] border-t border-amber-200 break-words">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Mobile Consultation CTA Card (Shown below FAQs on mobile) */}
          <div className="lg:hidden bg-gradient-to-r from-amber-900 to-[#3b1205] text-amber-100 rounded-2xl p-4 border border-amber-500/80 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isTe ? 'గురూజీతో సంప్రదించండి' : 'Consult Guruji'}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed font-telugu">
              {isTe
                ? 'మీ జాతకంలో నక్షత్ర గండాలు, దోషాలు లేదా తక్షణ ప్రశ్న లగ్న సమాధానం కోసం గురూజీ బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని సంప్రదించండి.'
                : 'For authentic personalized Vedic horoscope analysis or Prashna consultation, book an appointment with Brahmasri Jallavaram Sai Dheeraj Sharma.'}
            </p>
            {onOpenBooking && (
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-extrabold text-xs shadow text-center cursor-pointer"
              >
                {isTe ? 'జ్యోతిష అపాయింట్‌మెంట్ బుక్ చేయండి' : 'Book Astrology Consultation'}
              </button>
            )}
          </div>

          {/* Clean Bottom Navigation Back to Articles Directory + 3 Related Standalone Links */}
          <section className="bg-gradient-to-r from-amber-100/80 via-[#fff8eb] to-amber-100/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4 w-full min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-900">
                {isTe ? 'ఇతర వ్యాసాల ప్రత్యేక పేజీల లింకులు' : 'Other Standalone Article Pages'}
              </h3>
              <a
                href="/vedic-articles"
                onClick={(e) => {
                  if (onNavigateHome) {
                    e.preventDefault();
                    onNavigateHome();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-extrabold shadow"
              >
                <ArrowLeft size={14} className="shrink-0" />
                <span>{isTe ? 'అన్ని వ్యాసాల జాబితా (18)' : 'All Articles (18)'}</span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherArticles.map((other) => {
                const otherContent = isTe ? other.telugu : other.english;
                return (
                  <a
                    key={other.slug}
                    href={`/${other.slug}`}
                    onClick={(e) => {
                      if (onNavigateArticle) {
                        e.preventDefault();
                        onNavigateArticle(other.slug);
                      }
                    }}
                    className="rounded-2xl bg-white border border-amber-300 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden min-w-0"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-amber-950">
                      <img
                        src={other.heroImage}
                        alt={isTe ? other.imageAltTe : other.imageAltEn}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between min-w-0">
                      <h4 className="text-xs font-bold text-amber-950 group-hover:text-amber-700 font-telugu line-clamp-2 break-words">
                        {otherContent.title}
                      </h4>
                      <div className="pt-2 flex items-center justify-between gap-2 text-[10px] text-amber-800 font-mono mt-2 border-t border-amber-100 min-w-0">
                        <span className="truncate">/{other.slug}</span>
                        <span className="inline-flex items-center gap-0.5 font-sans font-bold text-amber-700 shrink-0">
                          {isTe ? 'తెరువు' : 'Open'} <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};
