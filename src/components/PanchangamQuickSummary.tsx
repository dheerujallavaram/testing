import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Sun, Moon, Sparkles, ShieldAlert, Award, Volume2, Square } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

export interface PanchangamQuickSummaryProps {
  day: DayData;
}

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
      `సర్వేజనా సుఖినోభవంతు.`,
    ]
      .filter(Boolean)
      .join(' ');

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
      className="bg-gradient-to-br from-amber-950 via-[#2d0c02] to-amber-900 text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-400/80 shadow-xl relative overflow-hidden font-telugu my-6"
    >
      {/* Decorative glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-600/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles size={13} />
            <span>{t('నేటి పంచాంగ ముఖ్యాంశాలు • Today Panchangam At-A-Glance', 'Today Panchangam At-A-Glance')}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-amber-100 leading-snug">
            {t(
              `నేటి పంచాంగం (${day.teediVaram}) — తిథి: ${cleanTithi} • నక్షత్రం: ${cleanNakshatra}`,
              `Today Panchangam (${tr(day.teediVaram)}) — Tithi: ${tr(cleanTithi)} • Star: ${tr(cleanNakshatra)}`
            )}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1 leading-relaxed">
            <strong>{t('శుభ సమయం (అమృత ఘడియలు):', 'Amrutha Gadiyalu:')}</strong> {tr(day.shubha.amrutha)} •{' '}
            <strong>{t('అభిజిత్ ముహూర్తం:', 'Abhijit Muhurtham:')}</strong> {tr(day.shubha.abhijit)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          {speechSupported && (
            <button
              type="button"
              onClick={handleTogglePlayAudio}
              aria-pressed={isPlayingAudio}
              title={t('నేటి పంచాంగ ముఖ్యాంశాలను తెలుగు ఆడియోలో వినండి', 'Listen to Daily Panchangam Highlights in Telugu')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 shadow-md transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 border-amber-200'
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
                  <span>{t('పంచాంగం ఆడియో వినండి 🔊', 'Listen to Panchangam Audio 🔊')}</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 bg-amber-900/70 border border-amber-500/50 rounded-2xl px-4 py-2 text-xs text-amber-200">
            <Award size={16} className="text-amber-400" />
            <span>
              <strong>శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</strong> (హైదరాబాద్)
            </span>
          </div>
        </div>
      </div>

      {/* Zero-Click Definition List (<dl>) for Google Featured Snippets */}
      <dl className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 text-xs">
        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
            <Moon size={12} className="text-amber-400" />
            <span>తిథి • Tithi</span>
          </dt>
          <dd className="font-extrabold text-white text-xs sm:text-sm leading-snug">
            {tr(day.panchanga.tithi)}
          </dd>
        </div>

        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
            <Sparkles size={12} className="text-amber-400" />
            <span>నక్షత్రం • Nakshatram</span>
          </dt>
          <dd className="font-extrabold text-white text-xs sm:text-sm leading-snug">
            {tr(day.panchanga.nakshatram)}
          </dd>
        </div>

        <div className="bg-rose-950/70 rounded-2xl p-3.5 border border-rose-500/50">
          <dt className="text-rose-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
            <ShieldAlert size={12} className="text-rose-400" />
            <span>రాహుకాలం • Rahu Kalam</span>
          </dt>
          <dd className="font-extrabold text-rose-100 text-xs sm:text-sm leading-snug">
            {tr(day.ashubha.rahukalam)}
          </dd>
        </div>

        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-amber-400" />
            <span>యమగండం • Yamagandam</span>
          </dt>
          <dd className="font-extrabold text-amber-100 text-xs sm:text-sm leading-snug">
            {tr(day.ashubha.yamagandam)}
          </dd>
        </div>

        <div className="bg-emerald-950/70 rounded-2xl p-3.5 border border-emerald-500/50 col-span-2 sm:col-span-1">
          <dt className="text-emerald-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
            <Sun size={12} className="text-emerald-400" />
            <span>అమృత ఘడియలు • Amrutha</span>
          </dt>
          <dd className="font-extrabold text-emerald-100 text-xs sm:text-sm leading-snug">
            {tr(day.shubha.amrutha) || 'ఉదయం 08:30 AM - 10:15 AM'}
          </dd>
        </div>

        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] mb-1">
            దుర్ముహూర్తం • Durmuhurtham
          </dt>
          <dd className="font-bold text-amber-100 text-xs sm:text-sm leading-snug">
            {tr(day.ashubha.durmuhurtham)}
          </dd>
        </div>

        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] mb-1">
            వర్జ్యం • Varjyam
          </dt>
          <dd className="font-bold text-amber-100 text-xs sm:text-sm leading-snug">
            {tr(day.ashubha.varjyam)}
          </dd>
        </div>

        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] mb-1">
            యోగం • Yogam
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-snug">
            {day.panchanga.yogam}
          </dd>
        </div>

        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] mb-1">
            కరణం • Karanam
          </dt>
          <dd className="font-bold text-white text-xs sm:text-sm leading-snug">
            {day.panchanga.karanam}
          </dd>
        </div>

        <div className="bg-amber-950/75 rounded-2xl p-3.5 border border-amber-600/40 col-span-2 sm:col-span-1">
          <dt className="text-amber-300/90 font-bold uppercase tracking-wider text-[11px] mb-1">
            మాసం &amp; వారం • Month &amp; Day
          </dt>
          <dd className="font-bold text-amber-200 text-xs sm:text-sm leading-snug">
            {tr(day.panchanga.masam)} • {tr(day.teediVaram.split('•')[1]?.trim() || day.label)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 pt-3 border-t border-amber-700/40 text-[11px] text-amber-300/85 flex flex-wrap items-center justify-between gap-2">
        <span>
          <strong>Neti Panchangam (నేటి పంచాంగం) • Today Panchangam in Telugu:</strong> తిథి, వారం, నక్షత్రం, యోగం, కరణం, మాసం.
        </span>
        <span className="font-mono text-amber-400">www.telugujyothisham.com</span>
      </div>
    </section>
  );
};
