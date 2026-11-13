import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, Sun, Moon, Sparkles, ShieldAlert, Award, Volume2, Square, Film, Download, Loader2, Copy, Check, Hash, Send } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';
import { AdminGruhapraveshamSamagriStudio } from './AdminGruhapraveshamSamagriStudio';
import { AdminTelegramDailyBroadcaster } from './AdminTelegramDailyBroadcaster';
import {
  DailyReelResult,
  generateDailyPanchangamReelVideo,
  generateDailyVideoSocialPack,
} from '../utils/dailyPanchangamVideoRecorder';
import { downloadDailyPanchangamCardImage } from '../utils/panchangamImageGenerator';

export interface PanchangamQuickSummaryProps {
  day: DayData;
}

export const PanchangamQuickSummary: React.FC<PanchangamQuickSummaryProps> = ({ day }) => {
  const { language, t, tr } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [isRecordingReel, setIsRecordingReel] = useState<boolean>(false);
  const [reelProgress, setReelProgress] = useState<number>(0);
  const [reelStatus, setReelStatus] = useState<string>('');
  const [reelResult, setReelResult] = useState<DailyReelResult | null>(null);
  const [showSocialPack, setShowSocialPack] = useState<boolean>(false);
  const [showSamagriStudio, setShowSamagriStudio] = useState<boolean>(false);
  const [showTelegramStudio, setShowTelegramStudio] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;

  const socialPack = useMemo(
    () => generateDailyVideoSocialPack(day, 'panchangam', language),
    [day, language]
  );

  const handleCopySocialField = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {}
  };

  const handleDownloadPanchangamVideo = async (langChoice: 'te' | 'en') => {
    if (isRecordingReel) return;
    setIsRecordingReel(true);
    setReelProgress(0);
    setReelResult(null);
    setReelStatus(
      langChoice === 'en' ? 'Preparing 60s Panchangam Reel...' : '60 సెకన్ల పంచాంగం వీడియో సిద్ధమవుతోంది...'
    );
    try {
      const res = await generateDailyPanchangamReelVideo(day, langChoice, (pct, label) => {
        setReelProgress(pct);
        setReelStatus(label);
      });
      setReelResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecordingReel(false);
    }
  };

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

          {/* ADMIN ONLY: Prominent Panchangam 60s HD Video (TE & EN), Telegram Night 12:00 AM Broadcaster, Social Captions/Hashtags & Photo Download */}
          {isGuruAdmin && (
            <>
              <button
                type="button"
                disabled={isRecordingReel}
                onClick={() => handleDownloadPanchangamVideo('te')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-rose-600 via-amber-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-60 text-white border-2 border-amber-200 shadow-lg transition-all cursor-pointer"
                title="60 సెకన్ల తెలుగు పంచాంగం Full HD 1080p వీడియో డౌన్‌లోడ్ (Admin Only)"
              >
                {isRecordingReel ? (
                  <Loader2 size={16} className="animate-spin text-amber-200" />
                ) : (
                  <Film size={16} className="text-amber-100" />
                )}
                <span>
                  {isRecordingReel
                    ? `${reelProgress}% • రికార్డ్ అవుతోంది...`
                    : '🔒 తెలుగు పంచాంగం HD వీడియో (60s)'}
                </span>
              </button>

              <button
                type="button"
                disabled={isRecordingReel}
                onClick={() => handleDownloadPanchangamVideo('en')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-slate-800 via-amber-800 to-slate-900 hover:from-slate-700 hover:to-amber-700 disabled:opacity-60 text-amber-100 border-2 border-amber-300 shadow-lg transition-all cursor-pointer"
                title="Download 60s English Panchangam Full HD 1080p Video (Admin Only)"
              >
                <Film size={15} className="text-amber-300" />
                <span>🔒 English Panchangam HD Video (60s)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTelegramStudio((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 shadow-lg transition-all cursor-pointer ${
                  showTelegramStudio
                    ? 'bg-sky-500 text-slate-950 border-white'
                    : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white border-sky-200'
                }`}
                title="డైలీ రాత్రి 12:00 AM టెలిగ్రామ్ HD వీడియో & క్యాప్షన్ బ్రాడ్‌కాస్టర్ (Admin Only)"
              >
                <Send size={15} />
                <span>🔒 📲 రాత్రి 12:00 AM Telegram HD స్టూడియో (TE & EN)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSocialPack((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-amber-900/95 hover:bg-amber-800 text-amber-200 border border-amber-400/80 shadow-md transition-all cursor-pointer"
                title={t('నేటి పంచాంగం వీడియో క్యాప్షన్ & Hashtags (Admin Only)', 'Daily Panchangam Video Caption & Hashtags (Admin Only)')}
              >
                <Hash size={15} className="text-amber-300" />
                <span>{t('🔒 క్యాప్షన్ & Hashtags', '🔒 Caption & Hashtags')}</span>
              </button>

              <button
                type="button"
                onClick={() => downloadDailyPanchangamCardImage(day, language)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-400/70 shadow-md transition-all cursor-pointer"
                title={t('పంచాంగం వాట్సాప్ స్టేటస్ ఫోటో కార్డ్ డౌన్‌లోడ్', 'Download Panchangam Status Card')}
              >
                <Download size={15} className="text-amber-300" />
                <span>{t('🔒 ఫోటో కార్డ్', '🔒 Status Card')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSamagriStudio((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border shadow-md transition-all cursor-pointer ${
                  showSamagriStudio
                    ? 'bg-emerald-600 text-white border-emerald-300'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-white'
                }`}
                title="తెలంగాణ గృహప్రవేశం పూజా సామాగ్రి లిస్ట్ డౌన్‌లోడ్ (Admin Only)"
              >
                <Download size={15} />
                <span>🔒 గృహప్రవేశం సామాగ్రి లిస్ట్</span>
              </button>
            </>
          )}

          <div className="flex items-center gap-2 bg-amber-900/70 border border-amber-500/50 rounded-2xl px-4 py-2 text-xs text-amber-200">
            <Award size={16} className="text-amber-400" />
            <span>
              <strong>శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</strong> (హైదరాబాద్)
            </span>
          </div>
        </div>
      </div>

      {/* Admin-Only Telangana Gruhapravesham Pooja Samagri Studio Drawer */}
      {isGuruAdmin && showSamagriStudio && (
        <div className="relative z-10 mt-4">
          <AdminGruhapraveshamSamagriStudio />
        </div>
      )}

      {/* Admin-Only Daily Night 12:00 AM Telegram HD Video & Caption Broadcaster (Always active in background for 12:00 AM auto-trigger, expandable UI) */}
      {isGuruAdmin && (
        <div className={showTelegramStudio ? 'relative z-10 mt-4' : 'hidden'}>
          <AdminTelegramDailyBroadcaster day={day} />
        </div>
      )}

      {/* Admin-Only Daily Panchangam Video Caption & Hashtags Drawer */}
      {isGuruAdmin && showSocialPack && (
        <div className="relative z-10 mt-4 bg-amber-950/95 border-2 border-amber-400/80 rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-700/60 pb-2.5">
            <span className="text-xs sm:text-sm font-extrabold text-amber-300">
              📋 అడ్మిన్ మాత్రమే: నేటి పంచాంగం వీడియో టైటిల్, క్యాప్షన్ & Hashtags ({day.teediVaram})
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopySocialField('full', socialPack.fullPostText)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer shadow-sm"
              >
                {copiedField === 'full' ? <Check size={14} /> : <Copy size={14} />}
                <span>
                  {copiedField === 'full'
                    ? 'మొత్తం కాపీ అయింది ✓'
                    : 'మొత్తం కాపీ చేయండి (Title + Caption + Hashtags)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCopySocialField('title', socialPack.youtubeTitle)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-500/60 font-bold text-xs cursor-pointer"
              >
                {copiedField === 'title' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedField === 'title' ? 'టైటిల్ కాపీ ✓' : 'టైటిల్ కాపీ'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopySocialField('tags', socialPack.hashtags)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-500/60 font-bold text-xs cursor-pointer"
              >
                {copiedField === 'tags' ? <Check size={13} /> : <Hash size={13} />}
                <span>{copiedField === 'tags' ? 'Hashtags కాపీ ✓' : 'Hashtags మాత్రమే కాపీ'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-black/40 border border-amber-700/50 rounded-xl p-2.5">
              <div className="text-[11px] font-bold text-amber-400 mb-1">🎬 YouTube Shorts / Reels టైటిల్:</div>
              <p className="text-amber-50 font-bold select-all">{socialPack.youtubeTitle}</p>
            </div>

            <div className="bg-black/40 border border-amber-700/50 rounded-xl p-2.5">
              <div className="text-[11px] font-bold text-amber-400 mb-1">📝 వీడియో క్యాప్షన్ / డిస్క్రిప్షన్ (మన వెబ్‌సైట్ సేవలతో):</div>
              <pre className="text-amber-100/95 whitespace-pre-wrap font-telugu leading-relaxed select-all max-h-44 overflow-y-auto">
                {socialPack.caption}
              </pre>
            </div>

            <div className="bg-black/40 border border-amber-700/50 rounded-xl p-2.5">
              <div className="text-[11px] font-bold text-amber-400 mb-1">#️⃣ డైలీ ట్రెండింగ్ Hashtags:</div>
              <p className="text-amber-300 font-mono text-[11px] leading-relaxed select-all">
                {socialPack.hashtags}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Live Progress / Ready Video Bar on Panchangam Page */}
      {isGuruAdmin && (isRecordingReel || reelResult) && (
        <div className="relative z-10 mt-4 bg-amber-950/90 border border-amber-400/70 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {isRecordingReel ? (
            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                <span>🎬 {reelStatus}</span>
                <span>{reelProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-amber-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-150"
                  style={{ width: `${reelProgress}%` }}
                />
              </div>
            </div>
          ) : reelResult ? (
            <>
              <div className="text-xs sm:text-sm font-bold text-emerald-300">
                ✅ {t('60 సెకన్ల పంచాంగం వీడియో సిద్ధమైంది & డౌన్‌లోడ్ అయింది!', '60s Panchangam Reel Video Ready!')}{' '}
                <span className="text-amber-200/80 font-normal">({reelResult.filename})</span>
              </div>
              <a
                href={reelResult.url}
                download={reelResult.filename}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
              >
                <Download size={14} />
                <span>{t('మళ్ళీ సేవ్ చేయండి', 'Save Video Again')}</span>
              </a>
            </>
          ) : null}
        </div>
      )}

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
