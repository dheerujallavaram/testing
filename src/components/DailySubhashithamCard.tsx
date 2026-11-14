import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Image as ImageIcon,
  Film,
  Loader2,
  Hash,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';
import {
  DailyReelResult,
  generateDailySubhashithamReelVideo,
  generateSubhashithamSocialPack,
} from '../utils/dailyPanchangamVideoRecorder';

import {
  DAILY_SUBHASHITHALU,
  SubhashithamItem,
} from '../data/subhashithamData';

export { DAILY_SUBHASHITHALU };
export type { SubhashithamItem };

export interface DailySubhashithamCardProps {
  isoDate?: string;
}

export const DailySubhashithamCard: React.FC<DailySubhashithamCardProps> = ({ isoDate }) => {
  const { t } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();

  const initialIndex = useMemo(() => {
    const str = isoDate || new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % DAILY_SUBHASHITHALU.length;
    }
    return Math.abs(hash) % DAILY_SUBHASHITHALU.length;
  }, [isoDate]);

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [cardLangMode, setCardLangMode] = useState<'te' | 'en' | 'both'>('both');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoStatus, setVideoStatus] = useState<string>('');
  const [videoResult, setVideoResult] = useState<DailyReelResult | null>(null);
  const [showSocialPack, setShowSocialPack] = useState<boolean>(false);
  const [copiedSocialField, setCopiedSocialField] = useState<string>('');

  const item = DAILY_SUBHASHITHALU[currentIndex] || DAILY_SUBHASHITHALU[0];

  const socialPack = useMemo(
    () => generateSubhashithamSocialPack(item, cardLangMode === 'en' ? 'en' : 'te'),
    [item, cardLangMode]
  );

  const handleCopySocialField = async (fieldKey: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSocialField(fieldKey);
      setTimeout(() => setCopiedSocialField(''), 2500);
    } catch {}
  };

  const handleDownloadSubhashithamVideo = async (mode: 'te' | 'en' | 'both' = cardLangMode) => {
    if (isRecordingVideo) return;
    setIsRecordingVideo(true);
    setVideoProgress(0);
    setVideoResult(null);
    setVideoStatus('30 సెకన్ల సుభాషితం & జీవన సందేశం 9:16 వీడియో సిద్ధమవుతోంది...');
    try {
      const res = await generateDailySubhashithamReelVideo(item, mode, (pct, label) => {
        setVideoProgress(pct);
        setVideoStatus(label);
      });
      setVideoResult(res);
    } catch (e) {
      console.error('Failed to record subhashitham video:', e);
    } finally {
      setIsRecordingVideo(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DAILY_SUBHASHITHALU.length) % DAILY_SUBHASHITHALU.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_SUBHASHITHALU.length);
  };

  const handleRandom = () => {
    const nextIdx = (currentIndex + 1 + Math.floor(Math.random() * (DAILY_SUBHASHITHALU.length - 1))) % DAILY_SUBHASHITHALU.length;
    setCurrentIndex(nextIdx);
  };

  const buildShareText = (mode: 'te' | 'en' | 'both' = cardLangMode) => {
    if (mode === 'en') {
      return `✨ *Daily Vedic Wisdom & Modern Life Quote* ✨\n\n📜 *Sanskrit Sloka:*\n${item.slokamEn}\n\n💡 *Meaning:* ${item.meaningEn}\n\n🌟 *Today's Practical Takeaway:*\n${item.loukikaQuoteEn}\n\n— *Brahmasri Jallavaram Sai Dheeraj Sharma*\n🔗 https://www.telugujyothisham.com`;
    }
    if (mode === 'te') {
      return `✨ *నేటి సుభాషిత శ్లోకం & జీవన సూత్రం* ✨\n\n📜 *శ్లోకం:*\n${item.slokamTe}\n\n💡 *భావం:* ${item.meaningTe}\n\n🌟 *నేటి తరానికి లౌకిక సందేశం:*\n${item.loukikaQuoteTe}\n\n— *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ*\n🔗 https://www.telugujyothisham.com`;
    }
    return `✨ *నేటి సుభాషిత శ్లోకం & జీవన సూత్రం (Daily Wisdom)* ✨\n\n📜 *శ్లోకం:*\n${item.slokamTe}\n(${item.slokamEn})\n\n🌟 *నేటి తరానికి లౌకిక సందేశం:*\n${item.loukikaQuoteTe}\n\n💡 *Modern Takeaway:*\n${item.loukikaQuoteEn}\n\n— *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ*\n🔗 https://www.telugujyothisham.com`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(cardLangMode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(buildShareText(cardLangMode));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Helper to draw a single centered line guaranteed across all browsers without overflowing borders
  const drawCenteredLine = (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    y: number,
    maxWidth = 940
  ) => {
    ctx.save();
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    let textWidth = ctx.measureText(text).width;
    if (textWidth > maxWidth) {
      const m = ctx.font.match(/(\d+(?:\.\d+)?)px/);
      if (m) {
        let px = parseFloat(m[1]);
        while (px > 14 && textWidth > maxWidth) {
          px -= 1;
          ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, `${px}px`);
          textWidth = ctx.measureText(text).width;
        }
      }
    }
    const x = Math.round(centerX - textWidth / 2);
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // Helper to wrap text and draw every single line centered around centerX
  const drawCenteredWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    startY: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    ctx.save();
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    const paragraphs = text.split('\n');
    let currentY = startY;

    for (const para of paragraphs) {
      if (!para.trim()) {
        currentY += lineHeight * 0.5;
        continue;
      }
      const words = para.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const word = words[n];
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine.length > 0) {
          const lineWidth = ctx.measureText(currentLine.trim()).width;
          const lineX = Math.round(centerX - lineWidth / 2);
          ctx.fillText(currentLine.trim(), lineX, currentY);
          currentLine = word;
          currentY += lineHeight;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        const lineWidth = ctx.measureText(currentLine.trim()).width;
        const lineX = Math.round(centerX - lineWidth / 2);
        ctx.fillText(currentLine.trim(), lineX, currentY);
        currentY += lineHeight;
      }
    }

    ctx.restore();
    return currentY;
  };

  // Helper to measure height needed for wrapped text
  const measureWrappedHeight = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const paragraphs = text.split('\n');
    let lineCount = 0;

    for (const para of paragraphs) {
      if (!para.trim()) {
        lineCount += 0.5;
        continue;
      }
      const words = para.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const word = words[n];
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine.length > 0) {
          lineCount++;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        lineCount++;
      }
    }

    return Math.max(1, lineCount) * lineHeight;
  };

  // Cross-browser safe rounded rectangle
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  };

  const handleDownloadQuoteImage = async (langMode: 'te' | 'en' | 'both') => {
    setIsDownloading(true);
    try {
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {}
      }

      const canvas = document.createElement('canvas');
      const width = 1080;
      const height = langMode === 'both' ? 1350 : 1080;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      const centerX = width / 2; // Exact center point: 540px

      // 1. Rich Temple Maroon & Deep Burgundy Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#260600');
      bgGrad.addColorStop(0.35, '#421004');
      bgGrad.addColorStop(0.7, '#2b0700');
      bgGrad.addColorStop(1, '#1a0300');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Radial Gold Shimmer in Center
      const radGrad = ctx.createRadialGradient(
        centerX,
        height * 0.45,
        60,
        centerX,
        height * 0.45,
        width * 0.6
      );
      radGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Double Gold Borders (Mathematically Centered)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.strokeStyle = 'rgba(252, 211, 77, 0.55)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      // Small corner ornaments
      const drawCornerDot = (cx: number, cy: number) => {
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCornerDot(50, 50);
      drawCornerDot(width - 50, 50);
      drawCornerDot(50, height - 50);
      drawCornerDot(width - 50, height - 50);

      // 3. Top Header Section (100% Centered)
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 26px "Noto Serif Telugu", "Tiro Telugu", Georgia, serif';
      drawCenteredLine(
        ctx,
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • నిత్య సుభాషిత జీవన సూత్రం',
        centerX,
        105
      );

      ctx.fillStyle = '#fde68a';
      ctx.font = '600 21px system-ui, -apple-system, sans-serif';
      const badgeLabel =
        langMode === 'en'
          ? `DAILY VEDIC WISDOM • ${item.themeEn.toUpperCase()}`
          : `${item.themeTe} • ${item.themeEn}`;
      drawCenteredLine(ctx, badgeLabel, centerX, 145);

      // Centered decorative gold divider
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 240, 172);
      ctx.lineTo(centerX + 240, 172);
      ctx.stroke();

      let cursorY = 220;

      // 4. Sanskrit Slokam Section (100% Centered)
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 23px system-ui, -apple-system, sans-serif';
      drawCenteredLine(
        ctx,
        langMode === 'en' ? '✦ CLASSICAL SANSKRIT SLOKA ✦' : '✦ మూల సంస్కృత సుభాషిత శ్లోకం ✦',
        centerX,
        cursorY
      );
      cursorY += 45;

      const slokaMaxWidth = width - 180;

      if (langMode === 'te' || langMode === 'both') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px "Noto Serif Telugu", "Tiro Telugu", serif';
        cursorY = drawCenteredWrappedText(
          ctx,
          item.slokamTe,
          centerX,
          cursorY,
          slokaMaxWidth,
          46
        );
        cursorY += 8;
      }

      if (langMode === 'en' || langMode === 'both') {
        ctx.fillStyle = '#fde68a';
        ctx.font = 'italic 23px Georgia, serif';
        cursorY = drawCenteredWrappedText(
          ctx,
          item.slokamEn,
          centerX,
          cursorY,
          slokaMaxWidth,
          36
        );
        cursorY += 10;
      }

      // 5. Simple Meaning (Tatparyam - 100% Centered)
      ctx.fillStyle = '#fed7aa';
      ctx.font = '22px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      const meaningText =
        langMode === 'en'
          ? `Meaning: ${item.meaningEn}`
          : `తాత్పర్యం: ${item.meaningTe}`;
      cursorY = drawCenteredWrappedText(
        ctx,
        meaningText,
        centerX,
        cursorY + 6,
        slokaMaxWidth,
        36
      );
      cursorY += 24;

      // 6. Highlighted Modern Loukika Quote Card Box (Centered & Dynamically Sized)
      const boxW = Math.min(940, width - 140); // 940px wide, centered
      const boxX = Math.round((width - boxW) / 2); // 70px margin on both sides
      const boxTop = cursorY;
      const textInnerWidth = boxW - 80;

      // Measure height for inner text dynamically
      ctx.font = 'bold 26px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      const quoteTeHeight =
        langMode === 'te' || langMode === 'both'
          ? measureWrappedHeight(ctx, item.loukikaQuoteTe, textInnerWidth, 42)
          : 0;

      ctx.font = langMode === 'both' ? 'bold 22px Georgia, serif' : 'bold 26px Georgia, serif';
      const quoteEnHeight =
        langMode === 'en' || langMode === 'both'
          ? measureWrappedHeight(ctx, item.loukikaQuoteEn, textInnerWidth, langMode === 'both' ? 34 : 42)
          : 0;

      const titleHeight = 44;
      const boxPaddingTop = 40;
      const boxPaddingBottom = 36;
      const spaceBetween = langMode === 'both' ? 16 : 0;
      const calculatedBoxHeight =
        boxPaddingTop + titleHeight + quoteTeHeight + spaceBetween + quoteEnHeight + boxPaddingBottom;

      // Draw cream card box
      ctx.fillStyle = 'rgba(255, 251, 235, 0.97)';
      drawRoundedRect(ctx, boxX, boxTop, boxW, calculatedBoxHeight, 26);
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Card Header Title (Centered inside box)
      let innerY = boxTop + boxPaddingTop;
      ctx.fillStyle = '#9a3412';
      ctx.font = 'bold 23px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      drawCenteredLine(
        ctx,
        langMode === 'en'
          ? '🌟 MODERN GENERATION LIFE TAKEAWAY 🌟'
          : '🌟 నేటి తరానికి లౌకిక జీవన సందేశం (Practical Takeaway) 🌟',
        centerX,
        innerY
      );
      innerY += titleHeight;

      // Telugu Quote inside box (Centered line by line)
      if (langMode === 'te' || langMode === 'both') {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 26px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
        innerY = drawCenteredWrappedText(
          ctx,
          item.loukikaQuoteTe,
          centerX,
          innerY,
          textInnerWidth,
          42
        );
        innerY += spaceBetween;
      }

      // English Quote inside box (Centered line by line)
      if (langMode === 'en' || langMode === 'both') {
        ctx.fillStyle = langMode === 'both' ? '#334155' : '#1e293b';
        ctx.font = langMode === 'both' ? 'bold 22px Georgia, serif' : 'bold 26px Georgia, serif';
        innerY = drawCenteredWrappedText(
          ctx,
          item.loukikaQuoteEn,
          centerX,
          innerY,
          textInnerWidth,
          langMode === 'both' ? 34 : 42
        );
      }

      // 7. Footer Branding (100% Centered at Bottom)
      const footerY = height - 105;
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 24px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      drawCenteredLine(
        ctx,
        'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Brahmasri Jallavaram Sai Dheeraj Sharma)',
        centerX,
        footerY
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      drawCenteredLine(ctx, '🌐 www.telugujyothisham.com', centerX, footerY + 38);

      // Trigger PNG Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `telugujyothisham-quote-${item.id}-${langMode}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to generate quote image:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      id="daily-subhashitham-quotes"
      aria-label="Daily Sanskrit Subhashitham Slokam and Practical Modern Life Quote"
      className="bg-gradient-to-br from-[#2b0800] via-[#3d0e04] to-[#240600] text-white rounded-3xl p-5 sm:p-8 border-2 border-amber-500/90 shadow-xl space-y-6 font-telugu"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>
              {t(
                'నిత్య సుభాషిత శ్లోకం & నేటి తరానికి లౌకిక జీవన సూత్రం • Daily Quote Card',
                'Daily Subhashitha Sloka & Modern Generation Life Quote'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-amber-100 leading-tight">
            {t(
              `నేటి సుభాషిత శ్లోకం & లౌకిక జీవన సందేశం (#${item.id})`,
              `Today's Sanskrit Sloka & Practical Life Quote (#${item.id})`
            )}
          </h2>
        </div>

        {/* Language Mode & Sloka Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-black/35 p-1 border border-amber-500/40">
            {[
              { id: 'both' as const, label: 'తెలుగు + English' },
              { id: 'te' as const, label: 'తెలుగు మాత్రమే' },
              { id: 'en' as const, label: 'English Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCardLangMode(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  cardLangMode === tab.id
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              title="మునుపటి శ్లోకం (Previous Quote)"
              className="p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleRandom}
              className="px-3 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle size={13} />
              <span>{t('మరొక శ్లోకం', 'Next Wisdom')}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="తదుపరి శ్లోకం (Next Quote)"
              className="p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Quote Card Preview */}
      <div className="bg-gradient-to-b from-[#3b0c03] to-[#230600] rounded-3xl p-5 sm:p-7 border-2 border-amber-400/80 shadow-inner space-y-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-300 border-b border-amber-500/25 pb-3">
          <span>✦ {item.themeTe} ({item.themeEn})</span>
          <span className="font-mono text-amber-200/80">
            శ్లోకం #{item.id} / {DAILY_SUBHASHITHALU.length}
          </span>
        </div>

        {/* Slokam Block */}
        <div className="text-center space-y-2.5 py-2">
          {(cardLangMode === 'te' || cardLangMode === 'both') && (
            <p className="text-lg sm:text-2xl font-extrabold text-amber-200 leading-relaxed whitespace-pre-line">
              {item.slokamTe}
            </p>
          )}
          {(cardLangMode === 'en' || cardLangMode === 'both') && (
            <p className="text-sm sm:text-base italic text-amber-100/90 font-serif whitespace-pre-line">
              {item.slokamEn}
            </p>
          )}
        </div>

        {/* Direct Simple Meaning (Tatparyam) */}
        <div className="bg-black/30 rounded-2xl p-4 border border-amber-500/30 space-y-1.5 text-xs sm:text-sm">
          {(cardLangMode === 'te' || cardLangMode === 'both') && (
            <p className="text-amber-100 leading-relaxed">
              <strong className="text-amber-300">సరళ భావం:</strong> {item.meaningTe}
            </p>
          )}
          {(cardLangMode === 'en' || cardLangMode === 'both') && (
            <p className="text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300">Simple Meaning:</strong> {item.meaningEn}
            </p>
          )}
        </div>

        {/* Modern Loukika Takeaway (For Today's Generation) */}
        <div className="bg-[#fffbeb] text-slate-900 rounded-2xl p-5 sm:p-6 border-2 border-amber-400 shadow-md space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-900 uppercase tracking-wide">
              <Sparkles size={15} className="text-amber-700" />
              <span>
                {cardLangMode === 'en'
                  ? 'Modern Generation Practical Takeaway'
                  : 'నేటి తరానికి లౌకిక జీవన సందేశం (Practical Life Quote)'}
              </span>
            </span>
          </div>

          {(cardLangMode === 'te' || cardLangMode === 'both') && (
            <p className="text-base sm:text-lg font-extrabold text-amber-950 leading-relaxed">
              {item.loukikaQuoteTe}
            </p>
          )}

          {(cardLangMode === 'en' || cardLangMode === 'both') && (
            <p
              className={`${
                cardLangMode === 'both'
                  ? 'text-xs sm:text-sm text-slate-700 border-t border-amber-200 pt-2.5'
                  : 'text-base sm:text-lg text-amber-950'
              } font-bold leading-relaxed`}
            >
              {item.loukikaQuoteEn}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-bold text-amber-900 border-t border-amber-200/80">
            <span>— బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ</span>
            <span className="font-mono">www.telugujyothisham.com</span>
          </div>
        </div>
      </div>

      {/* Download 30s Reel Video & HD Image (Admin / Studio Only) + Share Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 pt-1">
        {isGuruAdmin ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isRecordingVideo}
              onClick={() => handleDownloadSubhashithamVideo(cardLangMode)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-65 text-white border-2 border-amber-200 font-extrabold text-xs sm:text-sm shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isRecordingVideo ? (
                <Loader2 size={16} className="animate-spin text-amber-200" />
              ) : (
                <Film size={16} className="text-amber-100" />
              )}
              <span>
                {isRecordingVideo
                  ? `రికార్డింగ్ ${videoProgress}%...`
                  : '🎬 అడ్మిన్: 30s సుభాషితం వీడియో డౌన్‌లోడ్ (9:16)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSocialPack((prev) => !prev)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 border-2 border-amber-400 font-extrabold text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Hash size={15} className="text-amber-300" />
              <span>🔒 క్యాప్షన్ & Hashtags</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={() => handleDownloadQuoteImage('te')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-extrabold text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download size={16} />
              <span>🔒 తెలుగు కోట్ ఇమేజ్ (PNG)</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={() => handleDownloadQuoteImage('en')}
              className="px-3.5 py-2.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-100 border border-amber-400/70 font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <ImageIcon size={15} />
              <span>🔒 English Quote (PNG)</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={() => handleDownloadQuoteImage('both')}
              className="px-3.5 py-2.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-100 border border-amber-400/70 font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Download size={15} />
              <span>🔒 Telugu + English (PNG)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 border border-amber-400/40 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              {copied ? <Check size={15} className="text-emerald-300" /> : <Copy size={15} />}
              <span>{copied ? 'కాపీ అయింది!' : '🔒 Copy Quote'}</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Share2 size={15} />
            <span>WhatsApp Status / Share</span>
          </button>
        </div>
      </div>

      {/* Admin-Only 30s Video Progress / Ready Download Bar */}
      {isGuruAdmin && (isRecordingVideo || videoResult) && (
        <div className="bg-black/45 border border-amber-400/70 rounded-2xl p-4 space-y-2.5">
          {isRecordingVideo ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-amber-200">
                <span>🎬 {videoStatus}</span>
                <span>{videoProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-amber-950 rounded-full overflow-hidden border border-amber-600/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-amber-300/90">
                స్టార్టింగ్ సైట్ నేమ్ యానిమేషన్ (0–4.5s) + సుభాషిత శ్లోకం & నేటి తరానికి సందేశం (4.5–24s) + వెబ్‌సైట్ సేవల యాడ్ (24–30s) • 30 సెకన్లు పూర్తికాగానే ఆటోమేటిక్‌గా డౌన్‌లోడ్ అవుతుంది.
              </p>
            </div>
          ) : (
            videoResult && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs sm:text-sm font-extrabold text-emerald-300">
                  ✅ మీ 30 సెకన్ల సుభాషితం 9:16 వీడియో సిద్ధమైంది! ({videoResult.filename})
                </div>
                <a
                  href={videoResult.url}
                  download={videoResult.filename}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md"
                >
                  <Download size={15} />
                  <span>మళ్ళీ డౌన్‌లోడ్ చేయండి</span>
                </a>
              </div>
            )
          )}
        </div>
      )}

      {/* Admin-Only Subhashitham Video Title, Caption & Hashtags Copy Drawer */}
      {isGuruAdmin && showSocialPack && (
        <div className="bg-black/50 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 space-y-3 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-700/60 pb-2.5">
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
                <Hash size={15} />
                <span>🔒 అడ్మిన్ మాత్రమే: 30s సుభాషితం వీడియో టైటిల్, క్యాప్షన్ & Hashtags (#{item.id})</span>
              </span>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                YouTube Shorts, Instagram Reels & WhatsApp Status కోసమే సిద్ధం చేసిన శ్లోకం + భావం + వెబ్‌సైట్ సేవల క్యాప్షన్
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopySocialField('all', socialPack.fullPostText)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer shadow-sm"
            >
              {copiedSocialField === 'all' ? <Check size={14} /> : <Copy size={14} />}
              <span>
                {copiedSocialField === 'all'
                  ? 'మొత్తం పోస్ట్ కాపీ అయింది!'
                  : 'మొత్తం పోస్ట్ కాపీ చేయండి (Title + Caption + Hashtags)'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-amber-950/70 border border-amber-700/60 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300">1. వీడియో టైటిల్ (Title)</span>
                <button
                  type="button"
                  onClick={() => handleCopySocialField('title', socialPack.youtubeTitle)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-[11px] font-bold cursor-pointer"
                >
                  {copiedSocialField === 'title' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSocialField === 'title' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-amber-100 font-bold leading-relaxed select-all">
                {socialPack.youtubeTitle}
              </p>
            </div>

            <div className="bg-amber-950/70 border border-amber-700/60 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300">2. క్యాప్షన్ & సైట్ సేవలు</span>
                <button
                  type="button"
                  onClick={() => handleCopySocialField('caption', socialPack.caption)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-[11px] font-bold cursor-pointer"
                >
                  {copiedSocialField === 'caption' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSocialField === 'caption' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[11px] text-amber-100/95 whitespace-pre-wrap font-telugu leading-relaxed max-h-36 overflow-y-auto select-all">
                {socialPack.caption}
              </pre>
            </div>

            <div className="bg-amber-950/70 border border-amber-700/60 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300">3. వైరల్ Hashtags</span>
                <button
                  type="button"
                  onClick={() => handleCopySocialField('tags', socialPack.hashtags)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-[11px] font-bold cursor-pointer"
                >
                  {copiedSocialField === 'tags' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSocialField === 'tags' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-300 font-mono leading-relaxed break-words select-all">
                {socialPack.hashtags}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
