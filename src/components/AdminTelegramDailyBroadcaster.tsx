import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Send,
  Download,
  Copy,
  Check,
  Hash,
  Sparkles,
  Loader2,
  Settings,
  CheckCircle2,
  AlertCircle,
  Share2,
  Search,
  Eye,
  EyeOff,
  Clock,
} from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';
import {
  DailyReelResult,
  generateDailyPanchangamReelVideo,
  generateDailyRashiReelVideo,
  generateDailyVideoSocialPack,
  getSpotlightRashiIndex,
} from '../utils/dailyPanchangamVideoRecorder';
import { getDailyRashiFortunes } from '../utils/panchangaLogic';
import {
  loadTelegramConfig,
  saveTelegramConfig,
  autoDetectTelegramChatId,
  sendTelegramTextMessage,
  sendVideoAndSocialPackToTelegram,
  shareVideoToTelegramAppOrDevice,
  getScheduleCountdownInfo,
  DetectedChatInfo,
} from '../utils/telegramBroadcaster';

interface AdminTelegramDailyBroadcasterProps {
  day: DayData;
  initialSpotlightRashiId?: string;
  compact?: boolean;
}

type VideoJobKey =
  | 'panchangam_te'
  | 'panchangam_en'
  | 'rashi_te'
  | 'rashi_en'
  | 'all_four';

export const AdminTelegramDailyBroadcaster: React.FC<AdminTelegramDailyBroadcasterProps> = ({
  day,
  initialSpotlightRashiId = 'auto',
  compact = false,
}) => {
  const { isGuruAdmin } = useIsGuruAdmin();

  const [botToken, setBotToken] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [autoSendDaily, setAutoSendDaily] = useState<boolean>(true);
  const [scheduleTime, setScheduleTime] = useState<string>('00:00');
  const [lastSentDate, setLastSentDate] = useState<string>('');
  const [countdownLabel, setCountdownLabel] = useState<string>('');
  const [showBotSetup, setShowBotSetup] = useState<boolean>(false);

  const [spotlightRashiChoice, setSpotlightRashiChoice] = useState<string>(initialSpotlightRashiId);
  const [detectedChats, setDetectedChats] = useState<DetectedChatInfo[]>([]);
  const [isDetectingChat, setIsDetectingChat] = useState<boolean>(false);
  const [isTestingBot, setIsTestingBot] = useState<boolean>(false);

  const [activeJob, setActiveJob] = useState<VideoJobKey | null>(null);
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [jobStatusText, setJobStatusText] = useState<string>('');
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewCardKey, setPreviewCardKey] = useState<string | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<
    Partial<Record<'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en', DailyReelResult>>
  >({});

  const autoTriggeredDatesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setSpotlightRashiChoice(initialSpotlightRashiId);
  }, [initialSpotlightRashiId]);

  useEffect(() => {
    const cfg = loadTelegramConfig();
    setBotToken(cfg.botToken);
    setChatId(cfg.chatId);
    setAutoSendDaily(cfg.autoSendDaily);
    setScheduleTime(cfg.scheduleTime || '00:00');
    setLastSentDate(cfg.lastSentDate);
    if (!cfg.botToken || !cfg.chatId) {
      setShowBotSetup(true);
    }
  }, []);

  const rashiCards = useMemo(() => getDailyRashiFortunes(day), [day]);
  const autoSpotIdx = useMemo(() => getSpotlightRashiIndex(day, rashiCards, 'auto'), [day, rashiCards]);
  const activeSpotIdx = useMemo(
    () => getSpotlightRashiIndex(day, rashiCards, spotlightRashiChoice),
    [day, rashiCards, spotlightRashiChoice]
  );
  const autoSpotRashi = rashiCards[autoSpotIdx] || rashiCards[0];
  const activeSpotRashi = rashiCards[activeSpotIdx] || rashiCards[0];

  // Precompute all 4 Social Packs (Telugu & English for Panchangam & Horoscope)
  const socialPacks = useMemo(() => {
    return {
      panchangam_te: generateDailyVideoSocialPack(day, 'panchangam', 'te', spotlightRashiChoice),
      panchangam_en: generateDailyVideoSocialPack(day, 'panchangam', 'en', spotlightRashiChoice),
      rashi_te: generateDailyVideoSocialPack(day, 'rashi', 'te', spotlightRashiChoice),
      rashi_en: generateDailyVideoSocialPack(day, 'rashi', 'en', spotlightRashiChoice),
    };
  }, [day, spotlightRashiChoice]);

  const generateSingleVideo = useCallback(
    async (
      key: 'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en',
      shouldDownloadToBrowser: boolean
    ): Promise<DailyReelResult> => {
      const isPanchangam = key.startsWith('panchangam');
      const lang: 'te' | 'en' = key.endsWith('_en') ? 'en' : 'te';

      const result = isPanchangam
        ? await generateDailyPanchangamReelVideo(
            day,
            lang,
            (pct, label) => {
              setJobProgress(pct);
              setJobStatusText(label);
            },
            shouldDownloadToBrowser
          )
        : await generateDailyRashiReelVideo(
            day,
            lang,
            (pct, label) => {
              setJobProgress(pct);
              setJobStatusText(label);
            },
            spotlightRashiChoice,
            shouldDownloadToBrowser
          );

      setGeneratedVideos((prev) => ({ ...prev, [key]: result }));
      return result;
    },
    [day, spotlightRashiChoice]
  );

  /**
   * 1-Click / Scheduled Master Batch: Generates and sends ALL 4 HD Videos
   * (Panchangam TE, Panchangam EN, Horoscope TE, Horoscope EN) + all 4 complete Captions & Hashtags directly to Telegram.
   */
  const handleSendAllFourToTelegram = useCallback(
    async (alsoDownloadToDevice = false, targetDateOverride?: string) => {
      if (activeJob) return;
      const cleanToken = botToken.trim();
      const cleanChat = chatId.trim();

      if (!cleanToken || !cleanChat) {
        setShowBotSetup(true);
        setFeedbackBanner({
          type: 'error',
          message:
            '⚠️ ఒకే క్లిక్‌తో 4 HD వీడియోలు టెలిగ్రామ్‌కి పంపడానికి ముందుగా మీ Bot Token & Chat ID నమోదు చేయండి.',
        });
        return;
      }

      saveTelegramConfig({ botToken: cleanToken, chatId: cleanChat });
      setActiveJob('all_four');
      setJobProgress(0);
      setFeedbackBanner(null);

      const queue: Array<{
        key: 'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en';
        label: string;
      }> = [
        { key: 'panchangam_te', label: `1/4 • నేటి తెలుగు పంచాంగం HD వీడియో (${day.teediVaram})` },
        { key: 'panchangam_en', label: `2/4 • Today English Panchangam HD Video (${day.isoDate})` },
        {
          key: 'rashi_te',
          label: `3/4 • నేటి 12 రాశి ఫలాలు తెలుగు HD వీడియో (${activeSpotRashi.teluguName} పూర్తి ఫలితం)`,
        },
        {
          key: 'rashi_en',
          label: `4/4 • Today 12-Rashi Horoscope English HD Video (${activeSpotRashi.englishName} Full)`,
        },
      ];

      try {
        for (let i = 0; i < queue.length; i++) {
          const item = queue[i];
          setJobStatusText(`🎬 రికార్డింగ్ (${item.label})...`);
          const videoRes = await generateSingleVideo(item.key, alsoDownloadToDevice);
          setJobStatusText(`📤 టెలిగ్రామ్‌కి అప్‌లోడ్ అవుతోంది (${item.label})...`);
          const sendRes = await sendVideoAndSocialPackToTelegram(
            cleanToken,
            cleanChat,
            videoRes,
            socialPacks[item.key],
            item.label
          );
          if (!sendRes.ok) {
            throw new Error(`${item.label} పంపడంలో లోపం: ${sendRes.error}`);
          }
        }

        const stampDate = targetDateOverride || day.isoDate;
        const updated = saveTelegramConfig({ lastSentDate: stampDate });
        setLastSentDate(updated.lastSentDate);
        setFeedbackBanner({
          type: 'success',
          message:
            '🎉 అద్భుతం! నేటి 4 Full HD (1080p) వీడియోలు (పంచాంగం తెలుగు & ఇంగ్లీష్ + రాశి ఫలాలు తెలుగు & ఇంగ్లీష్) మరియు వాటి క్యాప్షన్స్ & Hashtags అన్నీ మీ టెలిగ్రామ్‌కి పంపబడ్డాయి!',
        });
      } catch (err: any) {
        setFeedbackBanner({
          type: 'error',
          message: `❌ బ్యాచ్ అప్‌లోడ్ ఎర్రర్: ${err?.message || 'Error'}`,
        });
      } finally {
        setActiveJob(null);
      }
    },
    [activeJob, botToken, chatId, day, activeSpotRashi, generateSingleVideo, socialPacks]
  );

  // Night 12:00 AM (00:00) Live Countdown & Auto-Trigger Effect
  useEffect(() => {
    if (!isGuruAdmin) return;

    const tick = () => {
      const info = getScheduleCountdownInfo(scheduleTime || '00:00');
      setCountdownLabel(info.countdownLabel);

      // If autoSendDaily is ON, Bot Token & Chat ID are configured, and clock has reached/passed Night 12:00 AM (00:00)
      if (
        autoSendDaily &&
        botToken.trim() &&
        chatId.trim() &&
        info.hasReachedTodayTrigger &&
        lastSentDate !== day.isoDate &&
        lastSentDate !== info.todayIsoLocal &&
        !activeJob &&
        !autoTriggeredDatesRef.current.has(day.isoDate)
      ) {
        autoTriggeredDatesRef.current.add(day.isoDate);
        handleSendAllFourToTelegram(false, day.isoDate);
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [
    isGuruAdmin,
    autoSendDaily,
    scheduleTime,
    botToken,
    chatId,
    lastSentDate,
    day.isoDate,
    activeJob,
    handleSendAllFourToTelegram,
  ]);

  if (!isGuruAdmin) {
    return null;
  }

  const handleSaveSettings = (nextAuto?: boolean, nextTime?: string) => {
    const updated = saveTelegramConfig({
      botToken,
      chatId,
      autoSendDaily: nextAuto !== undefined ? nextAuto : autoSendDaily,
      scheduleTime: nextTime !== undefined ? nextTime : scheduleTime,
    });
    setBotToken(updated.botToken);
    setChatId(updated.chatId);
    setAutoSendDaily(updated.autoSendDaily);
    setScheduleTime(updated.scheduleTime);
    setFeedbackBanner({
      type: 'success',
      message: `✅ టెలిగ్రామ్ సెట్టింగ్స్ సేవ్ చేయబడ్డాయి! ప్రతిరోజూ రాత్రి 12:00 AM (${updated.scheduleTime}) కి ఆటో-బ్రాడ్‌కాస్ట్ సిద్ధంగా ఉంది.`,
    });
  };

  const handleAutoDetectChatId = async () => {
    setIsDetectingChat(true);
    setFeedbackBanner(null);
    try {
      const res = await autoDetectTelegramChatId(botToken);
      if (!res.ok) {
        setFeedbackBanner({ type: 'error', message: `⚠️ ${res.error}` });
      } else {
        setDetectedChats(res.chats);
        if (res.chats.length > 0) {
          const first = res.chats[0];
          setChatId(first.chatId);
          saveTelegramConfig({ botToken, chatId: first.chatId });
          setFeedbackBanner({
            type: 'success',
            message: `✅ Chat ID కనుగొనబడింది: ${first.title} (${first.chatId})`,
          });
        }
      }
    } finally {
      setIsDetectingChat(false);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingBot(true);
    setFeedbackBanner(null);
    saveTelegramConfig({ botToken, chatId });
    try {
      const testMsg =
        `🙏 ఓం శ్రీ మహాగణాధిపతయే నమః\n` +
        `✅ శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — డైలీ రాత్రి 12:00 AM (Midnight) HD వీడియో & క్యాప్షన్ టెలిగ్రామ్ బ్రాడ్‌కాస్టర్ విజయవంతంగా కనెక్ట్ చేయబడింది!\n\n` +
        `📅 నేటి తేదీ: ${day.teediVaram}\n` +
        `🌟 నేటి విశేష రాశి: ${activeSpotRashi.symbol} ${activeSpotRashi.teluguName} (${activeSpotRashi.englishName})\n` +
        `🕛 ఆటో-షెడ్యూల్ సమయం: ప్రతిరోజూ రాత్రి 12:00 AM (${scheduleTime})\n` +
        `🌐 www.telugujyothisham.com`;
      const res = await sendTelegramTextMessage(botToken, chatId, testMsg);
      if (res.ok) {
        setFeedbackBanner({
          type: 'success',
          message: '✅ టెస్ట్ మెసేజ్ మీ టెలిగ్రామ్‌కి విజయవంతంగా పంపబడింది!',
        });
      } else {
        setFeedbackBanner({
          type: 'error',
          message: `❌ టెలిగ్రామ్ ఎర్రర్: ${res.error}`,
        });
      }
    } finally {
      setIsTestingBot(false);
    }
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {}
  };

  const handleDownloadOnly = async (
    key: 'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en'
  ) => {
    if (activeJob) return;
    setActiveJob(key);
    setJobProgress(0);
    setFeedbackBanner(null);
    try {
      const res = await generateSingleVideo(key, true);
      setFeedbackBanner({
        type: 'success',
        message: `✅ Full HD (1080p) వీడియో డౌన్‌లోడ్ అయింది: ${res.filename}`,
      });
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        message: `❌ వీడియో జనరేషన్ ఎర్రర్: ${err?.message || 'Error'}`,
      });
    } finally {
      setActiveJob(null);
    }
  };

  const handleSendSingleVideoToTelegram = async (
    key: 'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en',
    label: string,
    alsoDownload = false
  ) => {
    if (activeJob) return;

    const cleanToken = botToken.trim();
    const cleanChat = chatId.trim();
    if (!cleanToken || !cleanChat) {
      setShowBotSetup(true);
      setFeedbackBanner({
        type: 'error',
        message:
          '⚠️ టెలిగ్రామ్‌కి ఆటోమేటిక్‌గా పంపడానికి క్రింద మీ Bot Token & Chat ID నమోదు చేయండి — లేదా "📲 Telegram App Share" బటన్ నొక్కండి.',
      });
      return;
    }

    saveTelegramConfig({ botToken: cleanToken, chatId: cleanChat });
    setActiveJob(key);
    setJobProgress(0);
    setFeedbackBanner(null);

    try {
      const videoRes = await generateSingleVideo(key, alsoDownload);
      setJobStatusText(`📤 టెలిగ్రామ్‌కి Full HD వీడియో + క్యాప్షన్ & Hashtags అప్‌లోడ్ అవుతోంది (${label})...`);
      const pack = socialPacks[key];
      const sendRes = await sendVideoAndSocialPackToTelegram(
        cleanToken,
        cleanChat,
        videoRes,
        pack,
        label
      );

      if (sendRes.ok) {
        setFeedbackBanner({
          type: 'success',
          message: `✅ "${label}" Full HD వీడియో + పూర్తి క్యాప్షన్ & Hashtags మీ టెలిగ్రామ్‌కి విజయవంతంగా పంపబడ్డాయి!`,
        });
      } else {
        setFeedbackBanner({
          type: 'error',
          message: `❌ టెలిగ్రామ్ అప్‌లోడ్ విఫలమైంది: ${sendRes.error}`,
        });
      }
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        message: `❌ ఎర్రర్: ${err?.message || 'Unknown error'}`,
      });
    } finally {
      setActiveJob(null);
    }
  };

  const handleShareSingleToTelegramApp = async (
    key: 'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en',
    label: string
  ) => {
    if (activeJob) return;
    setActiveJob(key);
    setJobProgress(0);
    setFeedbackBanner(null);
    try {
      const videoRes = generatedVideos[key] || (await generateSingleVideo(key, false));
      const pack = socialPacks[key];
      await shareVideoToTelegramAppOrDevice(videoRes, pack);
      setFeedbackBanner({
        type: 'success',
        message: `✅ "${label}" HD వీడియో సిద్ధమైంది & క్యాప్షన్/Hashtags క్లిప్‌బోర్డ్‌కి కాపీ అయ్యాయి!`,
      });
    } finally {
      setActiveJob(null);
    }
  };

  const handleSendCaptionOnlyToTelegram = async (
    key: 'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en',
    label: string
  ) => {
    const cleanToken = botToken.trim();
    const cleanChat = chatId.trim();
    if (!cleanToken || !cleanChat) {
      setShowBotSetup(true);
      setFeedbackBanner({
        type: 'error',
        message: '⚠️ ముందుగా మీ Telegram Bot Token & Chat ID నమోదు చేయండి.',
      });
      return;
    }
    const pack = socialPacks[key];
    const header = `📋 [${label} — CAPTION & HASHTAGS]\n━━━━━━━━━━━━━━━━━━━━\n${pack.fullPostText}`;
    const res = await sendTelegramTextMessage(cleanToken, cleanChat, header);
    if (res.ok) {
      setFeedbackBanner({
        type: 'success',
        message: `✅ "${label}" క్యాప్షన్ & Hashtags మీ టెలిగ్రామ్‌కి పంపబడ్డాయి!`,
      });
    } else {
      setFeedbackBanner({
        type: 'error',
        message: `❌ ఎర్రర్: ${res.error}`,
      });
    }
  };

  const videoCards: Array<{
    key: 'panchangam_te' | 'panchangam_en' | 'rashi_te' | 'rashi_en';
    badge: string;
    title: string;
    subtitle: string;
    accentClass: string;
  }> = [
    {
      key: 'panchangam_te',
      badge: 'TELUGU PANCHANGAM • 1080p HD (60s)',
      title: '1. నేటి తెలుగు పంచాంగం HD వీడియో + క్యాప్షన్ & Hashtags',
      subtitle: `తిథి, నక్షత్రం, అమృత ఘడియలు, రాహుకాలం + మన వెబ్‌సైట్ సేవల యాడ్ (${day.teediVaram})`,
      accentClass: 'from-rose-950/90 via-amber-950 to-[#2b0902] border-amber-400/80',
    },
    {
      key: 'panchangam_en',
      badge: 'ENGLISH PANCHANGAM • 1080p HD (60s)',
      title: '2. Today English Panchangam HD Video + Caption & Hashtags',
      subtitle: `Full English Tithi, Nakshatra, Auspicious & Inauspicious Timings + Site Services (${day.isoDate})`,
      accentClass: 'from-slate-900 via-amber-950/90 to-slate-950 border-amber-300/80',
    },
    {
      key: 'rashi_te',
      badge: 'TELUGU HOROSCOPE • 1080p HD (60s)',
      title: `3. నేటి 12 రాశి ఫలాలు తెలుగు HD వీడియో (${activeSpotRashi.teluguName} పూర్తి ఫలితం)`,
      subtitle: `${activeSpotRashi.symbol} ${activeSpotRashi.teluguName} రాశి సంపూర్ణ ఫలితం + మిగతా 11 రాశులు & వెబ్‌సైట్ హుక్`,
      accentClass: 'from-amber-950 via-[#381003] to-amber-900 border-yellow-400/90',
    },
    {
      key: 'rashi_en',
      badge: 'ENGLISH HOROSCOPE • 1080p HD (60s)',
      title: `4. Today 12-Rashi Horoscope English HD Video (${activeSpotRashi.englishName} Full)`,
      subtitle: `${activeSpotRashi.symbol} ${activeSpotRashi.englishName} Complete 4-Domain Forecast + 11 Zodiac Signs Summary in English`,
      accentClass: 'from-indigo-950/90 via-slate-900 to-amber-950 border-cyan-400/80',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#1d0702] via-[#2e0c03] to-[#170601] text-white rounded-3xl p-4 sm:p-6 border-2 border-amber-400 shadow-2xl space-y-5 font-telugu">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/40 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/70 text-sky-300 text-xs font-extrabold uppercase tracking-wider">
              <Send size={13} />
              <span>🔒 ADMIN ONLY • DAILY NIGHT 12:00 AM TELEGRAM HD BROADCASTER</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/70 text-emerald-300 text-xs font-extrabold">
              <CheckCircle2 size={13} />
              <span>✓ మీ బాట్ కనెక్ట్ అయింది (@telugujyothisham_bot • ID: {chatId || '1162542343'})</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/70 text-amber-200 text-xs font-extrabold">
              <Clock size={13} className="text-amber-300" />
              <span>
                🕛 రాత్రి 12:00 AM ({scheduleTime}) ఆటో-ప్రసారం:{' '}
                {autoSendDaily ? `ఆన్ • తదుపరి: ${countdownLabel}` : 'ఆఫ్'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/60 text-sky-200 text-xs font-bold">
              <Sparkles size={12} />
              <span>Full HD 1080×1920 • 60 FPS • 8 Mbps</span>
            </span>
            {lastSentDate === day.isoDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold">
                ✓ నేడు టెలిగ్రామ్‌కి పంపబడింది ({day.isoDate})
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-2xl font-extrabold text-amber-100 mt-2">
            📲 డైలీ రాత్రి 12:00 AM టెలిగ్రామ్ HD వీడియో స్టూడియో — పంచాంగం & రాశి ఫలాలు (తెలుగు + English)
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
            ప్రతిరోజూ <strong>రాత్రి 12:00 AM (00:00 Midnight)</strong> కి ఆటోమేటిక్‌గా <strong>తెలుగు & ఇంగ్లీష్</strong> భాషలలో <strong>Full HD (1080p) పంచాంగం మరియు 12 రాశి ఫలాల వీడియోలు</strong> + వాటి పూర్తి <strong>టైటిల్స్, క్యాప్షన్స్ & ట్రెండింగ్ Hashtags</strong> నేరుగా మీ టెలిగ్రామ్‌కి వెళ్తాయి.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowBotSetup((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-400/70 text-xs sm:text-sm font-extrabold cursor-pointer transition-all"
          >
            <Settings size={15} className="text-amber-300" />
            <span>
              {showBotSetup ? 'టెలిగ్రామ్ సెట్టింగ్స్ దాచు' : '⚙️ రాత్రి 12:00 AM టెలిగ్రామ్ సెటప్'}
            </span>
          </button>

          <button
            type="button"
            disabled={activeJob !== null}
            onClick={() => handleSendAllFourToTelegram(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-60 text-white border-2 border-sky-200 font-extrabold text-xs sm:text-sm shadow-lg cursor-pointer transition-all"
          >
            {activeJob === 'all_four' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span>🚀 ఇప్పుడే 4 HD వీడియోలు (TE & EN) + క్యాప్షన్స్ టెలిగ్రామ్‌కి పంపు</span>
          </button>
        </div>
      </div>

      {/* Spotlight Rashi Selector + Night 12:00 AM Quick Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/35 border border-amber-500/40 rounded-2xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold text-amber-300">
            🎯 నేటి రాశి ఫలాల వీడియోలో (TE & EN) పూర్తి ఫలితం చూపే విశేష రాశి:
          </span>
          <select
            value={spotlightRashiChoice}
            onChange={(e) => setSpotlightRashiChoice(e.target.value)}
            className="bg-amber-950 text-amber-100 border border-amber-400/80 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
          >
            <option value="auto">
              🔄 ఆటోమేటిక్: రోజుకొక రాశి (నేడు: {autoSpotRashi.symbol} {autoSpotRashi.teluguName} / {autoSpotRashi.englishName})
            </option>
            {rashiCards.map((rc) => (
              <option key={rc.id} value={rc.id}>
                {rc.symbol} {rc.teluguName} రాశి ({rc.englishName}) — సంపూర్ణ ఫలితం
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={activeJob !== null}
            onClick={() => handleSendAllFourToTelegram(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/60 text-xs font-extrabold cursor-pointer"
          >
            <Download size={14} />
            <span>4 HD వీడియోలు డౌన్‌లోడ్ + టెలిగ్రామ్‌కి పంపు</span>
          </button>
        </div>
      </div>

      {/* Telegram Bot & Night 12:00 AM Schedule Setup Drawer */}
      {showBotSetup && (
        <div className="bg-slate-950/90 border-2 border-sky-400/70 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-800/60 pb-3">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-sky-300 flex items-center gap-2">
                <Send size={16} />
                <span>🕛 డైలీ రాత్రి 12:00 AM (00:00) టెలిగ్రామ్ ఆటో-బ్రాడ్‌కాస్ట్ సెటప్</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                1) Telegram లో <strong>@BotFather</strong> కి వెళ్ళి <code>/newbot</code> ద్వారా మీ Bot Token పొందండి. 2) మీ బాట్‌కి <code>Hi</code> అని మెసేజ్ పంపి <strong>"🔍 Auto-Detect Chat ID"</strong> నొక్కండి. ప్రతిరోజూ రాత్రి 12:00 AM కి ఆటోమేటిక్‌గా 4 HD వీడియోలు + క్యాప్షన్స్ & Hashtags మీ టెలిగ్రామ్‌కి వచ్చేస్తాయి!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-extrabold text-sky-200 mb-1">
                🔑 Telegram Bot Token (@BotFather ఇచ్చిన టోకెన్):
              </label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="ఉదా: 7123456789:AAHxyz..."
                className="w-full bg-slate-900 text-white border border-sky-500/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-sky-200 mb-1">
                💬 Telegram Chat ID లేదా Channel (@channelname):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  placeholder="Chat ID లేదా @channelname"
                  className="w-full bg-slate-900 text-white border border-sky-500/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-sky-300"
                />
                <button
                  type="button"
                  disabled={isDetectingChat}
                  onClick={handleAutoDetectChatId}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold shrink-0 cursor-pointer"
                  title="బాట్‌కి మెసేజ్ పంపిన తర్వాత Chat ID ఆటోమేటిక్‌గా కనుక్కోండి"
                >
                  {isDetectingChat ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  <span>Auto-Detect</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-amber-300 mb-1">
                🕛 డైలీ ఆటో-బ్రాడ్‌కాస్ట్ సమయం (Default: రాత్రి 12:00 AM):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => {
                    const val = e.target.value || '00:00';
                    setScheduleTime(val);
                    handleSaveSettings(autoSendDaily, val);
                  }}
                  className="w-full bg-slate-900 text-amber-200 border border-amber-400/70 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setScheduleTime('00:00');
                    handleSaveSettings(true, '00:00');
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-extrabold shrink-0 cursor-pointer"
                >
                  12:00 AM సెట్ చేయి
                </button>
              </div>
            </div>
          </div>

          {detectedChats.length > 0 && (
            <div className="bg-slate-900/90 border border-sky-500/40 rounded-xl p-3 space-y-2">
              <div className="text-xs font-bold text-sky-300">
                🔍 కనుగొనబడిన టెలిగ్రామ్ చాట్స్ / ఛానల్స్ (సెలెక్ట్ చేయడానికి క్లిక్ చేయండి):
              </div>
              <div className="flex flex-wrap gap-2">
                {detectedChats.map((c) => (
                  <button
                    key={c.chatId}
                    type="button"
                    onClick={() => {
                      setChatId(c.chatId);
                      saveTelegramConfig({ botToken, chatId: c.chatId });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      chatId === c.chatId
                        ? 'bg-sky-500 text-slate-950 border-white'
                        : 'bg-slate-800 text-sky-200 border-sky-600/50 hover:bg-slate-700'
                    }`}
                  >
                    {c.title} ({c.chatId}) [{c.type}]
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSendDaily}
                onChange={(e) => {
                  setAutoSendDaily(e.target.checked);
                  handleSaveSettings(e.target.checked, scheduleTime);
                }}
                className="w-4 h-4 rounded accent-sky-500"
              />
              <span>
                🕛 ప్రతిరోజూ రాత్రి 12:00 AM ({scheduleTime}) కి 4 HD వీడియోలు (TE & EN) + క్యాప్షన్స్ ఆటోమేటిక్‌గా టెలిగ్రామ్‌కి పంపు
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>సెట్టింగ్స్ సేవ్ చేయండి</span>
              </button>

              <button
                type="button"
                disabled={isTestingBot}
                onClick={handleTestTelegram}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white text-xs font-extrabold cursor-pointer"
              >
                {isTestingBot ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>📨 టెస్ట్ మెసేజ్ పంపు</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Progress Bar when Recording / Uploading */}
      {activeJob && (
        <div className="bg-sky-950/90 border-2 border-sky-400 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-sky-200">
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-sky-300" />
              <span>{jobStatusText || 'Full HD 1080p వీడియో రికార్డ్ అవుతోంది...'}</span>
            </span>
            <span>{jobProgress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400 transition-all duration-150"
              style={{ width: `${jobProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-extrabold ${
            feedbackBanner.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
              : feedbackBanner.type === 'error'
                ? 'bg-rose-950/90 border-rose-400 text-rose-200'
                : 'bg-sky-950/90 border-sky-400 text-sky-200'
          }`}
        >
          <span className="flex items-center gap-2">
            {feedbackBanner.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
            )}
            <span>{feedbackBanner.message}</span>
          </span>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer shrink-0"
          >
            మూసివేయి
          </button>
        </div>
      )}

      {/* 4 HD Video Cards (Panchangam TE, Panchangam EN, Horoscope TE, Horoscope EN) */}
      {!compact && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {videoCards.map((card) => {
            const pack = socialPacks[card.key];
            const isPreviewOpen = previewCardKey === card.key;
            const readyVideo = generatedVideos[card.key];

            return (
              <div
                key={card.key}
                className={`bg-gradient-to-br ${card.accentClass} border-2 rounded-2xl p-4 space-y-3 shadow-lg`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-black/40 border border-amber-300/50 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                      {card.badge}
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white mt-1">
                      {card.title}
                    </h4>
                    <p className="text-xs text-amber-200/85 mt-0.5">{card.subtitle}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={activeJob !== null}
                    onClick={() => handleSendSingleVideoToTelegram(card.key, card.title, false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-60 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
                  >
                    {activeJob === card.key ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    <span>📤 టెలిగ్రామ్‌కి పంపు (HD వీడియో + క్యాప్షన్)</span>
                  </button>

                  <button
                    type="button"
                    disabled={activeJob !== null}
                    onClick={() => handleDownloadOnly(card.key)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 disabled:opacity-60 text-amber-950 font-extrabold text-xs shadow-md cursor-pointer transition-all"
                  >
                    <Download size={14} />
                    <span>📥 HD వీడియో డౌన్‌లోడ్ (1080p)</span>
                  </button>

                  <button
                    type="button"
                    disabled={activeJob !== null}
                    onClick={() => handleShareSingleToTelegramApp(card.key, card.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold text-xs cursor-pointer transition-all"
                    title="Telegram యాప్‌కి నేరుగా ఫైల్ & క్యాప్షన్ షేర్ చేయండి"
                  >
                    <Share2 size={13} />
                    <span>📲 Telegram యాప్ షేర్</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyText(card.key, pack.fullPostText)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 hover:bg-black/70 text-amber-200 border border-amber-400/60 font-bold text-xs cursor-pointer transition-all"
                  >
                    {copiedId === card.key ? <Check size={13} /> : <Copy size={13} />}
                    <span>
                      {copiedId === card.key ? 'కాపీ అయింది ✓' : '📋 క్యాప్షన్ & Hashtags కాపీ'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendCaptionOnlyToTelegram(card.key, card.title)}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-sky-900/80 hover:bg-sky-800 text-sky-200 border border-sky-400/50 font-bold text-xs cursor-pointer"
                    title="కేవలం క్యాప్షన్ & Hashtags మాత్రమే టెలిగ్రామ్‌కి పంపు"
                  >
                    <Hash size={13} />
                    <span>క్యాప్షన్ మాత్రమే Telegram కి పంపు</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewCardKey(isPreviewOpen ? null : card.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-amber-900/70 hover:bg-amber-800 text-amber-200 border border-amber-500/40 font-bold text-xs cursor-pointer"
                  >
                    {isPreviewOpen ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{isPreviewOpen ? 'ప్రివ్యూ దాచు' : 'క్యాప్షన్ చూడు'}</span>
                  </button>
                </div>

                {readyVideo && (
                  <div className="flex items-center justify-between bg-emerald-950/70 border border-emerald-400/60 rounded-xl px-3 py-2 text-xs">
                    <span className="text-emerald-200 font-bold truncate">
                      ✅ సిద్ధంగా ఉంది: {readyVideo.filename}
                    </span>
                    <a
                      href={readyVideo.url}
                      download={readyVideo.filename}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shrink-0"
                    >
                      <Download size={12} />
                      <span>Save HD</span>
                    </a>
                  </div>
                )}

                {/* Expandable Caption + Hashtags Preview */}
                {isPreviewOpen && (
                  <div className="bg-black/60 border border-amber-400/60 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-amber-300">📌 Title:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(`${card.key}_title`, pack.youtubeTitle)}
                        className="text-[11px] text-emerald-300 underline cursor-pointer"
                      >
                        {copiedId === `${card.key}_title` ? 'Copied ✓' : 'Copy Title'}
                      </button>
                    </div>
                    <p className="text-white font-bold select-all">{pack.youtubeTitle}</p>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-extrabold text-amber-300">📝 Full Caption:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(`${card.key}_cap`, pack.caption)}
                        className="text-[11px] text-emerald-300 underline cursor-pointer"
                      >
                        {copiedId === `${card.key}_cap` ? 'Copied ✓' : 'Copy Caption'}
                      </button>
                    </div>
                    <pre className="text-amber-100/95 whitespace-pre-wrap font-telugu leading-relaxed max-h-40 overflow-y-auto select-all">
                      {pack.caption}
                    </pre>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-extrabold text-amber-300">#️⃣ Trending Hashtags:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(`${card.key}_tags`, pack.hashtags)}
                        className="text-[11px] text-emerald-300 underline cursor-pointer"
                      >
                        {copiedId === `${card.key}_tags` ? 'Copied ✓' : 'Copy Hashtags'}
                      </button>
                    </div>
                    <p className="text-amber-300 font-mono text-[11px] select-all">
                      {pack.hashtags}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
