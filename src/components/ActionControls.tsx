import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Printer,
  Bell,
  ArrowRight,
  Download,
  Film,
  Loader2,
} from 'lucide-react';
import { DayData } from '../types/panchangam';
import {
  generateWhatsAppShareText,
  PANCHANGAM_PAGE_URL,
} from '../utils/panchangaLogic';
import { playTempleBell } from '../utils/audioChime';
import { useLanguage } from '../context/LanguageContext';
import { downloadDailyPanchangamCardImage } from '../utils/panchangamImageGenerator';
import {
  DailyReelResult,
  generateDailyPanchangamReelVideo,
  generateDailyRashiReelVideo,
} from '../utils/dailyPanchangamVideoRecorder';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';

interface ActionControlsProps {
  day: DayData;
  onOpenBooking: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ day, onOpenBooking }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isRecordingReel, setIsRecordingReel] = useState<boolean>(false);
  const [reelProgress, setReelProgress] = useState<number>(0);
  const [reelStatus, setReelStatus] = useState<string>('');
  const [reelResult, setReelResult] = useState<DailyReelResult | null>(null);
  const [reelError, setReelError] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();

  const shareText = generateWhatsAppShareText(day, PANCHANGAM_PAGE_URL);
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      const text = generateWhatsAppShareText(day, PANCHANGAM_PAGE_URL);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    const textToShare = generateWhatsAppShareText(day, PANCHANGAM_PAGE_URL);

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      e.preventDefault();
      navigator.share({
        title: `శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — ${day.teediVaram}`,
        text: textToShare,
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          window.open(`https://wa.me/?text=${encodeURIComponent(textToShare)}`, '_blank');
        }
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCreateReelVideo = async (
    langChoice: 'te' | 'en',
    kind: 'panchangam' | 'rashi' = 'panchangam'
  ) => {
    if (isRecordingReel) return;
    setIsRecordingReel(true);
    setReelProgress(0);
    setReelError(null);
    setReelResult(null);
    setReelStatus(
      langChoice === 'en' ? 'Preparing 60s 9:16 Video...' : '60 సెకన్ల 9:16 వీడియో ప్రారంభమవుతోంది...'
    );
    try {
      const generator =
        kind === 'rashi' ? generateDailyRashiReelVideo : generateDailyPanchangamReelVideo;
      const result = await generator(day, langChoice, (pct, label) => {
        setReelProgress(pct);
        setReelStatus(label);
      });
      setReelResult(result);
    } catch (err) {
      setReelError(
        err instanceof Error
          ? err.message
          : t('వీడియో రికార్డింగ్ విఫలమైంది. దయచేసి Chrome/Edge బ్రౌజర్‌లో ప్రయత్నించండి.', 'Video recording failed on this browser.')
      );
    } finally {
      setIsRecordingReel(false);
    }
  };

  return (
    <div className="my-10 space-y-8">
      {/* Single Clean Panchangam Share & Utility Bar */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* WhatsApp Share Panchangam */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 active:scale-95 font-telugu"
            title={t('వాట్సాప్‌లో షేర్ చేయండి', 'Share on WhatsApp')}
          >
            <Share2 size={18} />
            <span>{t('వాట్సాప్‌లో నేటి పంచాంగం షేర్ చేయండి', 'Share Today Panchangam')}</span>
          </a>

          {/* ADMIN / AI STUDIO ONLY: Copy Panchangam, Status Card Image, 60s 9:16 Reel Videos & Print/PDF */}
          {isGuruAdmin && (
            <>
              {/* Copy Panchangam Text */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-5 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-sm transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-amber-700" />}
                <span>
                  {copied
                    ? t('పంచాంగం కాపీ అయింది!', 'Panchangam Copied!')
                    : t('🔒 పంచాంగం కాపీ చేయండి', '🔒 Copy Panchangam')}
                </span>
              </button>
              {/* Download WhatsApp Status Image Card (Telugu & English) */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => downloadDailyPanchangamCardImage(day, language)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-5 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
                  title={t('వాట్సాప్ స్టేటస్ కోసం నేటి పంచాంగం ఫోటో డౌన్‌లోడ్ చేయండి', 'Download Daily Panchangam Status Image')}
                >
                  <Download size={18} />
                  <span>
                    {language === 'en'
                      ? '🔒 Admin: Status Card (EN)'
                      : '🔒 అడ్మిన్: పంచాంగం ఫోటో డౌన్‌లోడ్'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadDailyPanchangamCardImage(day, language === 'en' ? 'te' : 'en')}
                  className="text-xs text-amber-800 hover:text-amber-950 underline px-2 py-1 font-semibold cursor-pointer"
                  title={language === 'en' ? 'Download Telugu Panchangam Card' : 'Download English Panchangam Card'}
                >
                  {language === 'en' ? '🇮🇳 Telugu Card' : '🇬🇧 English Card'}
                </button>
              </div>

              {/* 60s 9:16 Auto Daily Panchangam & 12-Rashi Reel Videos */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-1.5">
                <button
                  type="button"
                  disabled={isRecordingReel}
                  onClick={() => handleCreateReelVideo(language === 'en' ? 'en' : 'te', 'panchangam')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-700 via-amber-800 to-amber-900 hover:from-rose-600 hover:to-amber-800 disabled:opacity-60 text-amber-50 px-5 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
                  title={t(
                    'YouTube Shorts, Instagram Reels & WhatsApp Status కోసం 60 సెకన్ల 9:16 పంచాంగం వీడియో డౌన్‌లోడ్',
                    'Generate 60s 9:16 Animated Panchangam Reel Video'
                  )}
                >
                  {isRecordingReel ? (
                    <Loader2 size={18} className="animate-spin text-amber-300" />
                  ) : (
                    <Film size={18} className="text-amber-300" />
                  )}
                  <span>
                    {isRecordingReel
                      ? `${reelProgress}% • ${t('వీడియో తయారవుతోంది...', 'Rendering 60s Reel...')}`
                      : t('🔒 అడ్మిన్: పంచాంగం వీడియో (60s)', '🔒 Admin: Panchangam Video (60s)')}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isRecordingReel}
                  onClick={() => handleCreateReelVideo(language === 'en' ? 'en' : 'te', 'rashi')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-900 via-[#3c1104] to-amber-950 hover:from-amber-800 hover:to-amber-900 disabled:opacity-60 text-amber-200 border border-amber-400 px-5 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
                  title={t(
                    '60 సెకన్ల 12 రాశి ఫలాల 9:16 వీడియో డౌన్‌లోడ్',
                    'Generate 60s 9:16 12-Rashi Horoscope Reel Video'
                  )}
                >
                  <Film size={18} className="text-amber-300" />
                  <span>{t('🔒 అడ్మిన్: 12 రాశి ఫలాల వీడియో (60s)', '🔒 Admin: 12-Rashi Video (60s)')}</span>
                </button>
              </div>

              {/* Print / PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-slate-700 border border-slate-300 px-4 py-3 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
              >
                <Printer size={16} />
                <span>{t('🔒 ప్రింట్ / PDF', '🔒 Print / PDF')}</span>
              </button>
            </>
          )}

          {/* Temple Bell */}
          <button
            type="button"
            onClick={playTempleBell}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-4 py-3 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
            title={t('ఘంటానాదం ధ్వని', 'Ring Temple Bell')}
          >
            <Bell size={16} className="text-amber-700" />
            <span>{t('ఘంటానాదం', 'Temple Bell')}</span>
          </button>
        </div>

        {/* Live Progress & Ready Reel Download Bar (Admin / Studio Only) */}
        {isGuruAdmin && isRecordingReel && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-4 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950">
              <span>{reelStatus}</span>
              <span>{reelProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-150"
                style={{ width: `${reelProgress}%` }}
              />
            </div>
          </div>
        )}

        {isGuruAdmin && reelError && (
          <p className="text-center text-xs sm:text-sm font-bold text-rose-700">{reelError}</p>
        )}

        {isGuruAdmin && reelResult && (
          <div className="max-w-xl mx-auto bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-emerald-950 font-bold">
              ✅ {t('9:16 Reels / Shorts / WhatsApp Status వీడియో సిద్ధమైంది!', '9:16 Reel Video Ready!')}
              <span className="block text-[11px] font-normal text-emerald-800">{reelResult.filename}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={reelResult.url}
                download={reelResult.filename}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                <Download size={14} />
                <span>{t('మళ్ళీ సేవ్ చేయండి', 'Save Video')}</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Guruji Consultation Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl border border-amber-500/40 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-amber-300 font-display tracking-widest text-[11px] sm:text-xs uppercase mb-2">
            Personal Astrology Consultation • telugujyothisham.com
          </p>
          <h3 className="text-xl sm:text-3xl font-bold font-telugu mb-3">
            {t(
              'మీ కార్యానికి సరైన శుభ ముహూర్తాన్ని శ్రీ ధీరజ్ శర్మ గారు నిర్ణయించగలరు',
              'Get Your Auspicious Muhurtham Fixed by Sri Dheeraj Sharma Garu'
            )}
          </h3>
          <p className="text-amber-100/90 font-telugu text-xs sm:text-base mb-6 leading-relaxed">
            {t(
              'వివాహం, గృహప్రవేశం, నూతన వ్యాపార ప్రారంభం మరియు నామకరణం మొదలైన శుభ కార్యాలకు దోషరహితమైన, బలమైన లగ్న ముహూర్తాన్ని శాస్త్రోక్తంగా నిర్ణయించుకోండి.',
              'Schedule authentic, dosha-free Vedic Lagna Muhurthams for weddings, Gruhapravesham, new business launches, and Namakaranam.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="https://wa.me/918977986166?text=%E0%B0%A8%E0%B0%AE%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B0%BE%E0%B0%B0%E0%B0%82%20%E0%B0%B6%E0%B1%8D%E0%B0%B0%E0%B1%80%20%E0%B0%9C%E0%B0%B2%E0%B1%8D%E0%B0%B2%E0%B0%B5%E0%B0%B0%E0%B0%82%20%E0%B0%B8%E0%B0%BE%E0%B0%AF%E0%B0%BF%20%E0%B0%A7%E0%B1%80%E0%B0%B0%E0%B0%9C%E0%B1%8D%20%E0%B0%B6%E0%B0%B0%E0%B1%8D%E0%B0%AE%20%E0%B0%97%E0%B0%BE%E0%B0%B0%E0%B1%81%2C%20%E0%B0%A8%E0%B0%BE%E0%B0%95%E0%B1%81%20%E0%B0%B6%E0%B1%81%E0%B0%AD%20%E0%B0%AE%E0%B1%81%E0%B0%B9%E0%B1%82%E0%B0%B0%E0%B1%8D%E0%B0%A4%20%E0%B0%A8%E0%B0%BF%E0%B0%B0%E0%B1%8D%E0%B0%A3%E0%B0%AF%E0%B0%82%20%E0%B0%95%E0%B1%8B%E0%B0%B0%E0%B0%95%E0%B1%81%20%E0%B0%B8%E0%B0%82%E0%B0%AA%E0%B1%8D%E0%B0%B0%E0%B0%A6%E0%B0%BF%E0%B0%82%E0%B0%AA%E0%B1%81%20%E0%B0%95%E0%B0%BE%E0%B0%B5%E0%B0%BE%E0%B0%B2%E0%B0%BF."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-2xl sm:rounded-full font-telugu font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>{t('వాట్సాప్‌లో మాట్లాడండి (8977986166)', 'Chat on WhatsApp (8977986166)')}</span>
            </a>

            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 px-6 py-3.5 rounded-2xl sm:rounded-full font-telugu font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{t('పూజ / ముహూర్త బుకింగ్ చేయండి', 'Book Pooja / Muhurtham')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
