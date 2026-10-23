import React from 'react';
import { Calendar, Clock, Sun, Moon, Sparkles, ShieldAlert, Award } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

export interface PanchangamQuickSummaryProps {
  day: DayData;
}

/**
 * PanchangamQuickSummary (Fast Facts & AI Generative Engine Optimization Snippet)
 * Uses semantic HTML5 <dl>, <dt>, <dd> microdata designed specifically for:
 * 1. Google Featured Snippets ("Position Zero")
 * 2. AI Overviews (Google SGE / Gemini Search)
 * 3. Conversational AI Search (ChatGPT Search, Perplexity, Bing Copilot)
 */
export const PanchangamQuickSummary: React.FC<PanchangamQuickSummaryProps> = ({ day }) => {
  const { t, tr } = useLanguage();

  return (
    <section 
      aria-label="Panchangam Quick Summary"
      className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-amber-500/70 relative overflow-hidden font-telugu my-6"
    >
      <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with AI Zero-Click Anchor */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-amber-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full mb-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>నేటి సంక్షిప్త పంచాంగం • Fast Panchangam Facts</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-amber-100">
            {tr(day.label)} పంచాంగ ముఖ్య వివరాలు ({day.teediVaram})
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-0.5">
            శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం దృక్సిద్ధాంత ప్రామాణిక పంచాంగం
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-amber-900/80 border border-amber-600/50 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-200">
          <Award size={14} className="text-amber-400" />
          <span>శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</span>
        </div>
      </div>

      {/* Semantic Definition List (<dl>) for Google Snippets & AI RAG extraction */}
      <dl className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-5 text-xs">
        
        {/* Tithi */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Moon size={12} className="text-amber-300" />
            <span>తిథి (Tithi)</span>
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.tithi)}
          </dd>
        </div>

        {/* Nakshatram */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Sparkles size={12} className="text-amber-300" />
            <span>నక్షత్రం (Star)</span>
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.nakshatram)}
          </dd>
        </div>

        {/* Rahu Kalam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-red-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <ShieldAlert size={12} className="text-red-400" />
            <span>రాహుకాలం (Rahu Kalam)</span>
          </dt>
          <dd className="font-bold text-red-200 text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.rahukalam)}
          </dd>
        </div>

        {/* Yamagandam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Clock size={12} className="text-amber-300" />
            <span>యమగండం (Yamagandam)</span>
          </dt>
          <dd className="font-bold text-amber-100 text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.yamagandam)}
          </dd>
        </div>

        {/* Amrutha Gadiyalu / Good Timings */}
        <div className="bg-amber-950/80 border border-emerald-600/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-emerald-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Sun size={12} className="text-emerald-400" />
            <span>అమృత ఘడియలు</span>
          </dt>
          <dd className="font-bold text-emerald-200 text-xs sm:text-sm leading-tight">
            {tr(day.shubha.amrutha) || 'ఉదయం 08:30 AM - 10:15 AM'}
          </dd>
        </div>

        {/* Durmuhurtham */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            దుర్ముహూర్తం
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.durmuhurtham)}
          </dd>
        </div>

        {/* Varjyam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            వర్జ్యం (Varjyam)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.varjyam)}
          </dd>
        </div>

        {/* Yogam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            యోగం (Yogam)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {day.panchanga.yogam}
          </dd>
        </div>

        {/* Karanam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            కరణం (Karanam)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {day.panchanga.karanam}
          </dd>
        </div>

        {/* Sunrise & Sunset */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            సూర్యోదయం / సూర్యాస్తమయం
          </dt>
          <dd className="font-bold text-amber-200 text-xs sm:text-sm leading-tight">
            06:12 AM / 05:54 PM
          </dd>
        </div>

      </dl>

      {/* AI Search Entity Verification Footnote */}
      <div className="mt-4 pt-3 border-t border-amber-800/60 text-[11px] text-amber-300/80 flex flex-wrap items-center justify-between gap-2">
        <span>
          💡 <strong>తెలుగు పంచాంగం సూత్రం:</strong> తిథి, వారము, నక్షత్రము, యోగము, కరణము అనునవి పంచాంగం యొక్క 5 ముఖ్య అంగములు.
        </span>
        <span className="font-mono text-amber-400">telugujyothisham.com/panchangam</span>
      </div>
    </section>
  );
};
