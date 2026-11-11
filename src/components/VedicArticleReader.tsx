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
  // Allow per-article language toggle while defaulting to global language
  const [contentLang, setContentLang] = useState<'te' | 'en'>(
    globalLang === 'en' ? 'en' : 'te'
  );
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [sharingImage, setSharingImage] = useState<boolean>(false);

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
              <span>{isTe ? 'లింక్ కాపీ' : 'Copy'}</span>
            </>
          )}
        </button>
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
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold border border-amber-600/70 transition-all cursor-pointer"
                  title={isTe ? 'వ్యాస చిత్రం డౌన్‌లోడ్ చేయండి' : 'Download Article Image'}
                >
                  <Download size={13} className="shrink-0" />
                  <span>{isTe ? 'చిత్రం సేవ్' : 'Save Image'}</span>
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
                      <span>{isTe ? 'లింక్ కాపీ' : 'Copy Link'}</span>
                    </>
                  )}
                </button>
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

      {/* Historical Archival Citation & Tribute Box (When archivalSource exists) */}
      {article.archivalSource && (
        <section
          aria-label={isTe ? 'చారిత్రక సౌజన్యం & గ్రంథ నివాళి' : 'Archival Citation & Tribute'}
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
                      ? 'చారిత్రక గ్రంథ నివాళి & సౌజన్య ప్రకటన'
                      : 'Scholarly Archival Citation & Tribute'}
                  </span>
                  <span className="text-xs text-amber-800 font-semibold block break-words">
                    {isTe
                      ? `ప్రాచీన జ్యోతిష పరిశోధనారత్నం – ${article.archivalSource.year} ప్రచురణ`
                      : `${article.archivalSource.year} Classical Astrology Research Landmark`}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-amber-900 text-amber-100 text-[11px] font-bold shadow-sm">
                {article.archivalSource.year} • {article.archivalSource.issue.split('–')[0].trim()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-amber-950 min-w-0">
              <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-amber-200/90 shadow-sm space-y-2 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  {isTe ? 'మూల పత్రిక & ప్రచురణ కర్తలు:' : 'Original Publication Details:'}
                </span>
                <p className="font-extrabold text-sm sm:text-base text-amber-950 font-telugu break-words">
                  {isTe ? article.archivalSource.publicationTe : article.archivalSource.publication}
                </p>
                <div className="space-y-1 text-xs text-amber-900 break-words">
                  <p>
                    <strong>{isTe ? 'సంపాదకులు: ' : 'Editor: '}</strong>
                    {isTe ? article.archivalSource.editorTe : article.archivalSource.editor}
                  </p>
                  <p>
                    <strong>{isTe ? 'సంచిక & సంవత్సరం: ' : 'Issue & Year: '}</strong>
                    {isTe ? article.archivalSource.issueTe : article.archivalSource.issue} ({article.archivalSource.year})
                  </p>
                  <p>
                    <strong>{isTe ? 'ప్రచురణాలయం: ' : 'Publisher: '}</strong>
                    {isTe ? article.archivalSource.publisherTe : article.archivalSource.publisher}
                  </p>
                </div>
              </div>

              <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-amber-200/90 shadow-sm space-y-2 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  {isTe ? 'మూల వ్యాసాలు & రచయితలు:' : 'Original Columns & Authors Cited:'}
                </span>
                <ul className="space-y-2">
                  {article.archivalSource.originalArticles.map((orig, oIdx) => (
                    <li key={oIdx} className="text-xs border-l-2 border-amber-500 pl-2 break-words">
                      <strong className="text-amber-950 block font-telugu">
                        {isTe ? orig.titleTe : orig.title}
                      </strong>
                      <span className="text-amber-800">
                        {isTe ? 'రచన: ' : 'By: '}
                        <strong>{isTe ? orig.authorTe : orig.author}</strong> ({orig.pages})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-amber-900 text-amber-100 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm font-telugu leading-relaxed shadow-sm break-words">
              <p className="flex items-start gap-2">
                <Sparkles size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                <span>
                  {isTe ? article.archivalSource.tributeNoteTe : article.archivalSource.tributeNoteEn}
                </span>
              </p>
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
