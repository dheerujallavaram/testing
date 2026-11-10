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
} from 'lucide-react';
import {
  VEDIC_CLASSICAL_ARTICLES,
  VedicClassicalArticle,
} from '../data/vedicArticlesData';
import { useLanguage } from '../context/LanguageContext';

interface VedicArticleReaderProps {
  articleSlug: string;
  onNavigateArticle?: (slug: string) => void;
  onOpenBooking?: () => void;
  onNavigateHome?: () => void;
}

export const VedicArticleReader: React.FC<VedicArticleReaderProps> = ({
  articleSlug,
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

  const article: VedicClassicalArticle =
    VEDIC_CLASSICAL_ARTICLES.find((a) => a.slug === articleSlug) ||
    VEDIC_CLASSICAL_ARTICLES[0];

  const currentContent = contentLang === 'te' ? article.telugu : article.english;
  const isTe = contentLang === 'te';

  const otherArticles = VEDIC_CLASSICAL_ARTICLES.filter((a) => a.slug !== article.slug);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${article.slug}`;
      navigator.clipboard?.writeText(url).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${article.slug}`;
      const text = encodeURIComponent(
        `📖 *${currentContent.title}*\n\n${currentContent.summary}\n\n🔗 పూర్తి వ్యాసం & చిత్రం ఇక్కడ చూడండి:\n${url}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleShareWithImage = async () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/${article.slug}`;
    const shareText = `${currentContent.title}\n\n${currentContent.summary}\n\nపూర్తి వ్యాసం చదవండి: ${url}`;

    setSharingImage(true);
    try {
      if (navigator.share) {
        try {
          const response = await fetch(article.heroImage);
          const blob = await response.blob();
          const file = new File([blob], `${article.slug}.jpg`, {
            type: blob.type || 'image/jpeg',
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: currentContent.title,
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
          title: currentContent.title,
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
      const response = await fetch(article.heroImage);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${article.slug}-telugu-jyothisham.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(article.heroImage, '_blank');
    }
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <article className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-amber-900">
          <a
            href="/"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="hover:text-amber-700 underline font-medium"
          >
            {isTe ? 'హోమ్' : 'Home'}
          </a>
          <span className="text-amber-400">/</span>
          <a
            href="/vedic-articles"
            className="hover:text-amber-700 underline font-semibold text-amber-800"
          >
            {isTe ? 'వ్యాసాలు (Articles)' : 'Articles'}
          </a>
          <span className="text-amber-400">/</span>
          <span className="text-amber-950 font-bold truncate max-w-[200px] sm:max-w-xs">
            {currentContent.primaryKeyword}
          </span>
        </nav>

        {/* Dual Language Switcher */}
        <div className="flex items-center gap-1.5 bg-amber-100/90 p-1 rounded-2xl border border-amber-300">
          <button
            type="button"
            onClick={() => setContentLang('te')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isTe
                ? 'bg-amber-900 text-amber-100 shadow-sm'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            తెలుగు (Telugu)
          </button>
          <button
            type="button"
            onClick={() => setContentLang('en')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
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
      <header className="relative bg-gradient-to-br from-[#2c0902] via-[#3a1005] to-[#1e0501] text-amber-50 rounded-3xl p-6 sm:p-10 border-2 border-amber-500/80 shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40 uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-400" />
              {isTe ? article.categoryTe : article.categoryEn}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/80 text-amber-200 text-xs font-semibold border border-amber-700/60">
              <Clock size={13} />
              {article.readTimeMinutes} {isTe ? 'నిమిషాల పఠనం' : 'min read'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/80 text-amber-200 text-xs font-semibold border border-amber-700/60">
              <Calendar size={13} />
              {isTe ? 'తాజా సవరణ: ' : 'Updated: '} {article.dateModified}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 leading-tight font-telugu tracking-tight">
            {currentContent.title}
          </h1>

          <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed max-w-3xl font-telugu">
            {currentContent.summary}
          </p>

          {/* Dedicated 16:9 Article Hero Image & Share Bar */}
          <div className="rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-black/40">
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={article.heroImage}
                alt={isTe ? article.imageAltTe : article.imageAltEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-amber-200 text-[11px] font-semibold border border-amber-400/40 font-telugu">
                  {isTe ? article.imageAltTe : article.imageAltEn}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-amber-950 text-[11px] font-extrabold">
                  telugujyothisham.com/{article.slug}
                </span>
              </div>
            </div>

            {/* Dedicated Share with Image & Link Action Bar */}
            <div className="bg-amber-950/95 px-4 py-3 border-t border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-amber-200 font-telugu flex items-center gap-2">
                <Share2 size={15} className="text-amber-400 shrink-0" />
                <span>
                  {isTe
                    ? 'ఈ వ్యాసాన్ని దాని ప్రత్యేక చిత్రం & లింక్‌తో మిత్రులకు షేర్ చేయండి:'
                    : 'Share this standalone article with its dedicated image & link:'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWithImage}
                  disabled={sharingImage}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 text-xs font-extrabold shadow transition-all cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>
                    {sharingImage
                      ? isTe
                        ? 'షేర్ అవుతోంది...'
                        : 'Sharing...'
                      : isTe
                      ? 'చిత్రం + లింక్ షేర్'
                      : 'Share Image + Link'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold border border-amber-600/70 transition-all cursor-pointer"
                  title={isTe ? 'వ్యాస చిత్రం డౌన్‌లోడ్ చేయండి' : 'Download Article Image'}
                >
                  <Download size={14} />
                  <span>{isTe ? 'చిత్రం సేవ్' : 'Save Image'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-200 text-xs font-bold border border-amber-600/60 transition-all cursor-pointer"
                  title={isTe ? 'లింక్ కాపీ చేయండి' : 'Copy link'}
                >
                  {copiedShare ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>{isTe ? 'కాపీ అయింది!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>{isTe ? 'లింక్ కాపీ' : 'Copy Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Author Badge */}
          <div className="pt-3 border-t border-amber-700/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-full bg-[#2c0902] flex items-center justify-center text-amber-300 font-bold text-sm">
                  శ్రీ
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-amber-100 flex items-center gap-1.5">
                  {isTe ? article.author.nameTe : article.author.nameEn}
                  <Award size={15} className="text-yellow-400" />
                </div>
                <div className="text-xs text-amber-300/80">
                  {isTe ? article.author.titleTe : article.author.titleEn}
                </div>
              </div>
            </div>
            <div className="text-xs text-amber-300/90 font-mono">
              🔗 {typeof window !== 'undefined' ? `${window.location.origin}/${article.slug}` : `https://www.telugujyothisham.com/${article.slug}`}
            </div>
          </div>
        </div>
      </header>

      {/* Historical Archival Citation & Tribute Box (When archivalSource exists) */}
      {article.archivalSource && (
        <section
          aria-label={isTe ? 'చారిత్రక సౌజన్యం & గ్రంథ నివాళి' : 'Archival Citation & Tribute'}
          className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/90 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-300 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-sm">
                  <Bookmark size={17} />
                </span>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-900 block">
                    {isTe
                      ? 'చారిత్రక గ్రంథ నివాళి & సౌజన్య ప్రకటన (Archival Citation & Book Tribute)'
                      : 'Scholarly Archival Citation & Historical Tribute'}
                  </span>
                  <span className="text-xs text-amber-800 font-semibold">
                    {isTe
                      ? `ప్రాచీన జ్యోతిష పరిశోధనారత్నం – ${article.archivalSource.year} ప్రత్యేక ప్రచురణ`
                      : `${article.archivalSource.year} Classical Astrology Research Landmark`}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-900 text-amber-100 text-xs font-bold shadow-sm">
                {article.archivalSource.year} • {article.archivalSource.issue.split('–')[0].trim()}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm text-amber-950">
              <div className="bg-white/85 rounded-2xl p-4 border border-amber-200/90 shadow-sm space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  {isTe ? 'మూల పత్రిక & ప్రచురణ కర్తలు:' : 'Original Publication Details:'}
                </span>
                <p className="font-extrabold text-base text-amber-950 font-telugu">
                  {isTe ? article.archivalSource.publicationTe : article.archivalSource.publication}
                </p>
                <div className="space-y-1 text-xs text-amber-900">
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

              <div className="bg-white/85 rounded-2xl p-4 border border-amber-200/90 shadow-sm space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  {isTe ? 'మూల వ్యాసాలు & రచయితలు:' : 'Original Columns & Authors Cited:'}
                </span>
                <ul className="space-y-2">
                  {article.archivalSource.originalArticles.map((orig, oIdx) => (
                    <li key={oIdx} className="text-xs border-l-2 border-amber-500 pl-2">
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

            <div className="bg-amber-900 text-amber-100 rounded-2xl p-4 text-xs sm:text-sm font-telugu leading-relaxed shadow-sm">
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
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Table of Contents Sticky Sidebar (3 cols on lg) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-amber-50/90 rounded-2xl p-5 border border-amber-300 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-1.5">
              <BookOpen size={15} />
              {isTe ? 'విషయ సూచిక (Table of Contents)' : 'Table of Contents'}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-950 font-medium">
              {currentContent.sections.map((sec, idx) => (
                <li key={idx}>
                  <a
                    href={`#section-${idx}`}
                    className="hover:text-amber-700 block py-1 border-l-2 border-amber-300 pl-2.5 transition-colors"
                  >
                    {sec.heading}
                  </a>
                </li>
              ))}
              {currentContent.remedies.length > 0 && (
                <li>
                  <a
                    href="#remedies-section"
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
                    className="hover:text-amber-700 block py-1 border-l-2 border-amber-300 pl-2.5 transition-colors"
                  >
                    {isTe ? 'తరచుగా అడిగే ప్రశ్నలు (FAQs)' : 'Frequently Asked Questions'}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Consultation CTA Banner */}
          <div className="bg-gradient-to-r from-amber-900 to-[#3b1205] text-amber-100 rounded-2xl p-5 border border-amber-500/80 shadow-md space-y-3">
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
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-extrabold text-xs shadow hover:from-amber-300 hover:to-yellow-200 transition-all text-center"
              >
                {isTe ? 'జ్యోతిష అపాయింట్‌మెంట్ బుక్ చేయండి' : 'Book Astrology Consultation'}
              </button>
            )}
          </div>
        </aside>

        {/* Article Body (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-8">
          {currentContent.sections.map((section, idx) => (
            <section
              key={idx}
              id={`section-${idx}`}
              className="scroll-mt-24 bg-white/95 rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-md space-y-5"
            >
              <div>
                {section.subheading && (
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                    {section.subheading}
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-telugu leading-snug">
                  {section.heading}
                </h2>
              </div>

              {/* Shloka Highlight Box */}
              {section.shloka && (
                <div className="bg-amber-50 rounded-2xl p-5 border-l-4 border-amber-600 shadow-sm space-y-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
                    {isTe ? '|| వేద శాస్త్ర ప్రమాణ శ్లోకం ||' : '|| Classical Sanskrit Shloka ||'}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-amber-950 font-telugu italic">
                    {section.shloka.sanskrit}
                  </p>
                  <p className="text-xs sm:text-sm text-amber-900 font-telugu pt-1 border-t border-amber-200/80">
                    <strong className="text-amber-950">{isTe ? 'తాత్పర్యం: ' : 'Meaning: '}</strong>
                    {section.shloka.meaning}
                  </p>
                </div>
              )}

              {/* Section Narrative */}
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-telugu">
                {section.content}
              </p>

              {/* Key Bullet Points */}
              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {isTe ? 'ముఖ్యమైన శాస్త్ర నియమాలు:' : 'Key Astrological Principles:'}
                  </h4>
                  <ul className="space-y-1.5">
                    {section.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-800 font-telugu">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Classical Comparison Table */}
              {section.table && (
                <div className="pt-2 overflow-x-auto">
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
                              className={`p-3 border border-amber-200 text-gray-800 font-telugu ${
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
              )}
            </section>
          ))}

          {/* Remedies Section */}
          {currentContent.remedies.length > 0 && (
            <section
              id="remedies-section"
              className="scroll-mt-24 bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-md space-y-6"
            >
              <div className="flex items-center gap-2">
                <Flame size={24} className="text-amber-600" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-telugu">
                  {isTe ? 'శాస్త్రోక్త శాంతి & పరిహార మార్గాలు' : 'Classical Vedic Remedies & Protections'}
                </h2>
              </div>

              {currentContent.remedies.map((rem, rIdx) => (
                <div key={rIdx} className="bg-white rounded-2xl p-5 border border-amber-300 shadow-sm space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-amber-900 font-telugu flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    {rem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 font-telugu leading-relaxed">
                    {rem.description}
                  </p>
                  {rem.mantra && (
                    <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                        {isTe ? 'దివ్య మంత్రం:' : 'Sacred Mantra:'}
                      </span>
                      <p className="text-sm font-bold text-amber-950 font-telugu">
                        {rem.mantra}
                      </p>
                    </div>
                  )}
                  {rem.ritualSteps && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-bold text-amber-900 block">
                        {isTe ? 'ఆచరణాత్మక విధానం:' : 'Actionable Guidelines:'}
                      </span>
                      <ul className="space-y-1 text-xs text-gray-700">
                        {rem.ritualSteps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-1.5 font-telugu">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{step}</span>
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
              className="scroll-mt-24 bg-white/95 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={22} className="text-amber-700" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-telugu">
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
                        className="w-full flex items-center justify-between p-4 text-left bg-amber-50/60 hover:bg-amber-100/70 transition-colors"
                      >
                        <span className="font-bold text-amber-950 text-xs sm:text-sm font-telugu pr-4">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={18} className="text-amber-700 shrink-0" />
                        ) : (
                          <ChevronDown size={18} className="text-amber-700 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs sm:text-sm text-gray-800 font-telugu leading-relaxed border-t border-amber-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Related Articles Exploration */}
          <section className="bg-gradient-to-r from-amber-100/80 via-[#fff8eb] to-amber-100/80 rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-900">
              {isTe ? 'ఇతర ప్రాచీన జ్యోతిష శాస్త్ర వ్యాసాలు (ప్రత్యేక పేజీలు)' : 'Explore Other Classical Vedic Articles (Standalone Pages)'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
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
                    className="rounded-2xl bg-white border border-amber-300 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-amber-950">
                      <img
                        src={other.heroImage}
                        alt={isTe ? other.imageAltTe : other.imageAltEn}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 text-amber-200 text-[10px] font-bold">
                        {isTe ? other.categoryTe : other.categoryEn}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-amber-950 group-hover:text-amber-700 font-telugu line-clamp-2">
                        {otherContent.title}
                      </h4>
                      <div className="pt-3 flex items-center justify-between text-[11px] text-amber-900 font-semibold mt-2 border-t border-amber-100">
                        <span>{other.readTimeMinutes} {isTe ? 'ని॥ పఠనం' : 'min read'}</span>
                        <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform text-amber-700">
                          {isTe ? 'పేజీ తెరవండి' : 'Open Page'} <ArrowRight size={13} />
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
