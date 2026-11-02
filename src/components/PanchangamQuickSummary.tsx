import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Sun, Moon, Sparkles, ShieldAlert, Award, Volume2, Square } from 'lucide-react';
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
  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      id="panchangam-quick-summary"
      aria-label="Panchangam Quick Summary"
      className="mandapam-dark-frame text-white rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden font-telugu my-6"
    >
      {/* Header with Clean Architectural Kicker & Play Audio Button */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-500/30">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-1">
            {t('నేటి పంచాంగ ముఖ్యాంశాలు · Today Panchangam At-A-Glance', 'Today Panchangam At-A-Glance')}
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white">
            {t(
              `నేటి పంచాంగం (${day.teediVaram}) — తిథి: ${cleanTithi} · నక్షత్రం: ${cleanNakshatra}`,
              `Today Panchangam (${tr(day.teediVaram)}) — Tithi: ${tr(cleanTithi)} · Star: ${tr(cleanNakshatra)}`
            )}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/95 mt-1 leading-relaxed">
            <strong>{t('శుభ సమయం (అమృత ఘడియలు):', 'Amrutha Gadiyalu:')}</strong> {tr(day.shubha.amrutha)} | <strong>{t('అభిజిత్ ముహూర్తం:', 'Abhijit Muhurtham:')}</strong> {tr(day.shubha.abhijit)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
          {speechSupported && (
            <button
              type="button"
              onClick={handleTogglePlayAudio}
              aria-pressed={isPlayingAudio}
              title={t('నేటి పంచాంగ ముఖ్యాంశాలను తెలుగు ఆడియోలో వినండి', 'Listen to Daily Panchangam Highlights in Telugu')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer shadow-md ${
                isPlayingAudio
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 border-amber-200'
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

          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Award size={15} />
            <span>శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</span>
          </div>
        </div>
      </div>

      {/* Vibrant, Scannable 5-Column Almanac Cards (<dl>) */}
      <dl className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 text-xs">
        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Moon size={12} />
            <span>Tithi (తిథి)</span>
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.tithi)}
          </dd>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Sparkles size={12} />
            <span>Nakshatram (నక్షత్రం)</span>
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.nakshatram)}
          </dd>
        </div>

        <div className="bg-red-950/60 rounded-xl p-3.5 border border-red-400/40">
          <dt className="text-red-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <ShieldAlert size={12} className="text-red-400" />
            <span>Rahu Kalam (రాహుకాలం)</span>
          </dt>
          <dd className="font-bold text-red-100 text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.rahukalam)}
          </dd>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Clock size={12} />
            <span>Yamagandam (యమగండం)</span>
          </dt>
          <dd className="font-bold text-amber-100 text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.yamagandam)}
          </dd>
        </div>

        <div className="bg-emerald-950/60 rounded-xl p-3.5 border border-emerald-400/40">
          <dt className="text-emerald-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1">
            <Sun size={12} className="text-emerald-400" />
            <span>Amrutha Gadiyalu (అమృత ఘడియలు)</span>
          </dt>
          <dd className="font-bold text-emerald-100 text-xs sm:text-sm leading-tight">
            {tr(day.shubha.amrutha) || 'ఉదయం 08:30 AM - 10:15 AM'}
          </dd>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] mb-1">
            Durmuhurtham (దుర్ముహూర్తం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.durmuhurtham)}
          </dd>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] mb-1">
            Varjyam (వర్జ్యం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {tr(day.ashubha.varjyam)}
          </dd>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] mb-1">
            Yogam (యోగం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {day.panchanga.yogam}
          </dd>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] mb-1">
            Karanam (కరణం)
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-tight">
            {day.panchanga.karanam}
          </dd>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-amber-400/30">
          <dt className="text-amber-300 font-bold uppercase tracking-wider text-[11px] mb-1">
            Masam (మాసం) &amp; Vaaram (వారం)
          </dt>
          <dd className="font-bold text-amber-200 text-xs sm:text-sm leading-tight">
            {tr(day.panchanga.masam)} · {tr(day.teediVaram.split('•')[1]?.trim() || day.label)}
          </dd>
        </div>
      </dl>

      {/* AI Search Entity Verification Footnote */}
      <div className="mt-4 pt-3 border-t border-amber-500/25 text-[11px] text-amber-200/80 flex flex-wrap items-center justify-between gap-2">
        <span>
          <strong>Neti Panchangam (నేటి పంచాంగం) | Today Panchangam in Telugu (ఈ రోజు పంచాంగం):</strong> Tithi(తిథి), Vaaram(వారం), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Masam(మాసం).
        </span>
        <span className="font-mono text-amber-300">telugujyothisham.com/panchangam</span>
      </div>
    </section>
  );
};
