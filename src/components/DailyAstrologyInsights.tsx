import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Compass, Clock, BookOpen, Share2, MessageCircle, 
  RefreshCw, CheckCircle2, ChevronRight, X, Flame, ShieldCheck, 
  Star, Radio, ArrowRight, Eye, Calendar
} from 'lucide-react';
import { 
  ASTROLOGY_INSIGHTS_ARTICLES, 
  SIMULATED_PLANETARY_STREAM, 
  AstrologyInsightArticle, 
  PlanetaryStreamUpdate 
} from '../data/astrologyInsightsData';

export interface DailyAstrologyInsightsProps {
  onOpenBooking?: () => void;
}

export const DailyAstrologyInsights: React.FC<DailyAstrologyInsightsProps> = ({
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<AstrologyInsightArticle | null>(null);
  const [isRefreshingStream, setIsRefreshingStream] = useState<boolean>(false);
  const [streamLastUpdated, setStreamLastUpdated] = useState<string>('ఇప్పుడే అప్‌డేట్ అయ్యింది (Just Now)');
  const [planetaryStream, setPlanetaryStream] = useState<PlanetaryStreamUpdate[]>(SIMULATED_PLANETARY_STREAM);

  // Filter articles based on category
  const filteredArticles = selectedCategory === 'all'
    ? ASTROLOGY_INSIGHTS_ARTICLES
    : ASTROLOGY_INSIGHTS_ARTICLES.filter((a) => a.category === selectedCategory);

  // Handle simulated stream refresh
  const handleRefreshStream = () => {
    setIsRefreshingStream(true);
    setTimeout(() => {
      // Simulate slight telemetry calculation
      setStreamLastUpdated('ఇప్పుడే తాజా గణన పూర్తయింది');
      setIsRefreshingStream(false);
    }, 600);
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
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Daily Telugu Astrology Insights & Planetary Movement Stream",
      "description": "నిత్య నవగ్రహ సంచార విశ్లేషణ, దిన ఫలాలు మరియు శుభ ముహూర్త మార్గదర్శక వ్యాసాలు - శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం",
      "numberOfItems": ASTROLOGY_INSIGHTS_ARTICLES.length,
      "itemListElement": ASTROLOGY_INSIGHTS_ARTICLES.map((art, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "BlogPosting",
          "headline": art.titleTe,
          "description": art.summaryTe,
          "author": {
            "@type": "Person",
            "name": art.author
          },
          "datePublished": art.datePublished,
          "inLanguage": "te",
          "url": `https://telugujyothisham.com/panchangam#insight-${art.id}`
        }
      }))
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
      aria-label="Daily Astrology Insights" 
      className="my-12 font-telugu"
    >
      {/* 1. Header & Live Stream Indicator */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border-2 border-amber-600/50 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>ప్రత్యక్ష గోచార ప్రవాహం • Live Planetary Movement Stream</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-amber-100 tracking-tight leading-tight">
              దైనిక జ్యోతిష మార్గదర్శక వ్యాసాలు (Daily Astrology Insights)
            </h2>
            <p className="text-amber-200/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              నేటి నవగ్రహ సంచారం, చంద్రుని గమనం, శుభ ముహూర్త సూత్రాలు మరియు నిత్య పూజా పరిహారాలపై ప్రామాణిక వేద జ్యోతిష విశ్లేషణ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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

            <span className="text-[11px] text-amber-400/80 font-mono">
              {streamLastUpdated}
            </span>
          </div>
        </div>

        {/* 2. Simulated Real-time Planetary Movement Ticker / Cards */}
        <div className="mt-8 pt-6 border-t border-amber-800/70">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Compass size={14} className="text-amber-400" />
              <span>నేటి ముఖ్య గ్రహాల గోచార స్థితి (Current Transit Pulse):</span>
            </span>
            <span className="text-[11px] text-amber-400/70 hidden sm:inline">
              దృక్సిద్ధాంత ఖగోళ గణన
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {planetaryStream.map((item) => {
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPositive 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' 
                          : isCaution 
                          ? 'bg-red-950 text-red-300 border border-red-600/40' 
                          : 'bg-amber-900 text-amber-200 border border-amber-600/40'
                      }`}>
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
        </div>
      </div>

      {/* 3. Filter Navigation Tabs */}
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
                <span>రచన: <strong>{activeArticle.author}</strong></span>
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
