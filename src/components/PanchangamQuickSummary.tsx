import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Sun, Moon, Sparkles, ShieldAlert, Award, Volume2, Square } from 'lucide-react';
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
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      // Pre-warm voices list on browsers that load voices asynchronously
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop audio if user switches to a different day
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [day.id]);

  const handleTogglePlayAudio = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    const amruthaText = day.shubha.amrutha || 'ఉదయం 08:30 AM నుండి 10:15 AM వరకు';
    const teluguScript = [
      `ఓం శ్రీ మహాగణాధిపతయే నమః.`,
      `శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం, బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ${day.label} పంచాంగ ముఖ్యాంశాలు.`,
      `తేదీ మరియు వారము: ${day.teediVaram}.`,
      `నేటి తిథి: ${day.panchanga.tithi}.`,
      `నక్షత్రం: ${day.panchanga.nakshatram}.`,
      `యోగం: ${day.panchanga.yogam}.`,
      `కరణం: ${day.panchanga.karanam}.`,
      `శుభ సమయం, అమృత ఘడియలు: ${amruthaText}.`,
      `అశుభ సమయాలు — రాహుకాలం: ${day.ashubha.rahukalam}. యమగండం: ${day.ashubha.yamagandam}. వర్జ్యం: ${day.ashubha.varjyam}.`,
      day.specialEvent ? `నేటి విశేషం: ${day.specialEvent}.` : '',
      `దిన ఫలితం: ${day.phalitham}.`,
      `సర్వేజనా సుఖినోభవంతు.`
    ].filter(Boolean).join(' ');

    const utterance = new SpeechSynthesisUtterance(teluguScript);
    utterance.lang = 'te-IN';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const teluguVoice =
      voices.find((v) => v.lang.toLowerCase() === 'te-in') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('te')) ||
      voices.find((v) => v.name.toLowerCase().includes('telugu'));

    if (teluguVoice) {
      utterance.voice = teluguVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  }, [day, isPlayingAudio]);

  return (
    <section 
      aria-label="Panchangam Quick Summary"
      className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-amber-500/70 relative overflow-hidden font-telugu my-6"
    >
      <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with AI Zero-Click Anchor & Play Audio Button */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-amber-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full mb-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>Neti Panchangam • Today Panchangam in Telugu • ఈ రోజు పంచాంగం</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-amber-100">
            {tr(day.label)} పంచాంగం — Neti Panchangam ({day.teediVaram})
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/85 mt-0.5">
            Today Panchangam in Telugu - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం) — శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {speechSupported && (
            <button
              type="button"
              onClick={handleTogglePlayAudio}
              aria-pressed={isPlayingAudio}
              title={t('నేటి పంచాంగ ముఖ్యాంశాలను తెలుగు ఆడియోలో వినండి', 'Listen to Daily Panchangam Highlights in Telugu')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-sm ${
                isPlayingAudio
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 border-amber-300'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square size={14} className="fill-current" />
                  <span>{t('ఆడియో ఆపండి (Stop Audio)', 'Stop Audio')}</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} />
                  <span>{t('ఆడియో వినండి (Play Audio)', 'Play Audio')}</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 bg-amber-900/80 border border-amber-600/50 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-200">
            <Award size={14} className="text-amber-400" />
            <span>శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</span>
          </div>
        </div>
      </div>

      {/* Semantic Definition List (<dl>) for Google Snippets & AI RAG extraction */}
      <dl className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-5 text-xs">
        
        {/* Tithi */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Moon size={12} className="text-amber-300" />
            <span>Tithi (తిథి)</span>
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.tithi)}
          </dd>
        </div>

        {/* Nakshatram */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Sparkles size={12} className="text-amber-300" />
            <span>Nakshatram (నక్షత్రం)</span>
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.nakshatram)}
          </dd>
        </div>

        {/* Rahu Kalam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-red-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <ShieldAlert size={12} className="text-red-400" />
            <span>Rahu Kalam (రాహుకాలం)</span>
          </dt>
          <dd className="font-bold text-red-200 text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.rahukalam)}
          </dd>
        </div>

        {/* Yamagandam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Clock size={12} className="text-amber-300" />
            <span>Yamagandam (యమగండం)</span>
          </dt>
          <dd className="font-bold text-amber-100 text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.yamagandam)}
          </dd>
        </div>

        {/* Amrutha Gadiyalu / Good Timings */}
        <div className="bg-amber-950/80 border border-emerald-600/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-emerald-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Sun size={12} className="text-emerald-400" />
            <span>Amrutha Gadiyalu (అమృత ఘడియలు)</span>
          </dt>
          <dd className="font-bold text-emerald-200 text-xs sm:text-sm leading-tight">
            {tr(day.shubha.amrutha) || 'ఉదయం 08:30 AM - 10:15 AM'}
          </dd>
        </div>

        {/* Durmuhurtham */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            Durmuhurtham (దుర్ముహూర్తం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.durmuhurtham)}
          </dd>
        </div>

        {/* Varjyam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            Varjyam (వర్జ్యం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.varjyam)}
          </dd>
        </div>

        {/* Yogam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            Yogam (యోగం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {day.panchanga.yogam}
          </dd>
        </div>

        {/* Karanam */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            Karanam (కరణం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {day.panchanga.karanam}
          </dd>
        </div>

        {/* Masam & Vaaram */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-2xl p-3.5 shadow-2xs">
          <dt className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
            Masam (మాసం) &amp; Vaaram (వారం)
          </dt>
          <dd className="font-bold text-amber-200 text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.masam)} · {tr(day.teediVaram.split('•')[1]?.trim() || day.label)}
          </dd>
        </div>

      </dl>

      {/* AI Search Entity Verification Footnote */}
      <div className="mt-4 pt-3 border-t border-amber-800/60 text-[11px] text-amber-300/80 flex flex-wrap items-center justify-between gap-2">
        <span>
          💡 <strong>Neti Panchangam (నేటి పంచాంగం) | Today Panchangam in Telugu (ఈ రోజు పంచాంగం):</strong> Tithi(తిథి), Vaaram(వారం), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Masam(మాసం).
        </span>
        <span className="font-mono text-amber-400">telugujyothisham.com/panchangam</span>
      </div>
    </section>
  );
};
