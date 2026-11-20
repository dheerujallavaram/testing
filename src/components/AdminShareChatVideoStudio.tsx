import React, { useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileText,
  Hash,
  Play,
  Share2,
  Volume2,
} from 'lucide-react';
import {
  PromoLanguage,
  SHARECHAT_PROMO_ASSETS,
  SHARECHAT_PROMO_CHAPTERS,
} from '../data/shareChatPromoConfig';

export const AdminShareChatVideoStudio: React.FC = () => {
  const [activeLang, setActiveLang] = useState<PromoLanguage>('te');
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showScripts, setShowScripts] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const asset = SHARECHAT_PROMO_ASSETS[activeLang];
  const activeChapterIdx = Math.min(
    SHARECHAT_PROMO_CHAPTERS.length - 1,
    Math.floor(currentTimeSec / 15)
  );

  const handleSwitchLanguage = (lang: PromoLanguage) => {
    setActiveLang(lang);
    setCurrentTimeSec(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleTogglePlayWithSound = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.muted = false;
      vid.volume = 1;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  };

  const handleJumpChapter = (startSec: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = false;
    vid.volume = 1;
    vid.currentTime = startSec;
    setCurrentTimeSec(startSec);
    vid.play().catch(() => {});
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2200);
    });
  };

  const fullShareChatPost = `${asset.captionTitle}\n\n${asset.captionBody}\n\n${asset.hashtags}`;

  return (
    <section
      aria-label="ShareChat 2-Minute AI Human Voice Website Video Ad Studio"
      className="bg-[#FAF5EA] text-[#1C1917] rounded-3xl border-2 border-[#C99634] shadow-xl overflow-hidden"
    >
      {/* Royal Temple Header Band */}
      <div className="bg-gradient-to-r from-[#3B0A0C] via-[#5A1408] to-[#3B0A0C] text-[#FFFDF7] px-5 py-5 sm:px-7 sm:py-6 border-b-2 border-[#C99634]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-[#F5C451]">
              <Volume2 size={15} />
              <span>ShareChat 2-Minute AI Human Voice Ad Studio · 9:16 Vertical HD MP4</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFDF7] leading-snug">
              ShareChat వెబ్‌సైట్ ప్రోమో వీడియోలు — తెలుగు &amp; English AI Human Voice (02:00)
            </h2>
            <p className="text-xs sm:text-sm text-[#EAD7B7] max-w-3xl">
              స్పష్టమైన మానవ స్వరం లాంటి Neural AI వాయిస్ ఓవర్ + రాగ హంసధ్వని భక్తి సంగీతంతో తయారైన రెండు 2-నిమిషాల HD MP4 ప్రోమో వీడియోలు.
              తక్షణమే ప్రివ్యూ చూసి 1-క్లిక్‌లో డౌన్‌లోడ్ చేసి ShareChat లో అప్‌లోడ్ చేయండి.
            </p>
          </div>

          {/* Language Toggle Switch */}
          <div
            role="tablist"
            aria-label="Select Promo Video Voiceover Language"
            className="inline-flex rounded-2xl bg-[#220506] p-1.5 border border-[#C99634]/70 shrink-0 self-start lg:self-center"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeLang === 'te'}
              onClick={() => handleSwitchLanguage('te')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeLang === 'te'
                  ? 'bg-[#F5C451] text-[#2B0705] shadow-md'
                  : 'text-[#EAD7B7] hover:text-white'
              }`}
            >
              తెలుగు AI Voice (2:00)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeLang === 'en'}
              onClick={() => handleSwitchLanguage('en')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeLang === 'en'
                  ? 'bg-[#F5C451] text-[#2B0705] shadow-md'
                  : 'text-[#EAD7B7] hover:text-white'
              }`}
            >
              English AI Voice (2:00)
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: 9:16 Vertical Phone Preview Frame */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[300px] rounded-[2rem] bg-[#160405] p-3 border-[3px] border-[#C99634] shadow-2xl">
            <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-[#F5C451]">
              <span>9:16 ShareChat HD</span>
              <span>{asset.durationLabel}</span>
            </div>
            <div className="relative aspect-[9/16] w-full rounded-[1.35rem] overflow-hidden bg-black border border-[#C99634]/40">
              <video
                ref={videoRef}
                key={asset.publicUrl}
                src={asset.publicUrl}
                controls
                playsInline
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTimeSec(e.currentTarget.currentTime)}
                className="w-full h-full object-contain bg-black"
              />
            </div>
            <div className="mt-2.5 px-2 text-center space-y-2">
              <button
                type="button"
                onClick={handleTogglePlayWithSound}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#F5C451] hover:bg-[#eab338] text-[#2B0705] font-extrabold text-xs shadow-sm cursor-pointer transition-colors"
              >
                <Volume2 size={15} />
                <span>
                  {isPlaying
                    ? activeLang === 'te'
                      ? 'వాయిస్ ప్లే అవుతోంది (Pause)'
                      : 'Playing Voiceover (Pause)'
                    : activeLang === 'te'
                      ? 'AI వాయిస్‌తో వీడియో ప్లే చేయండి'
                      : 'Play Video with AI Voiceover'}
                </span>
              </button>
              <p className="text-[11px] font-bold text-[#EAD7B7] leading-tight">
                {asset.voiceLabel}
              </p>
            </div>
          </div>

          {/* Direct 1-Click HD MP4 Download Buttons */}
          <div className="w-full max-w-[300px] mt-4 space-y-2.5">
            <a
              href={SHARECHAT_PROMO_ASSETS.te.publicUrl}
              download={SHARECHAT_PROMO_ASSETS.te.downloadFileName}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#007a52] hover:bg-[#006443] text-white font-extrabold text-sm shadow-md transition-colors"
            >
              <Download size={17} />
              <span>డౌన్‌లోడ్: తెలుగు 2-Min HD MP4</span>
            </a>

            <a
              href={SHARECHAT_PROMO_ASSETS.en.publicUrl}
              download={SHARECHAT_PROMO_ASSETS.en.downloadFileName}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#3B0A0C] hover:bg-[#5A1408] text-[#F5C451] border border-[#C99634] font-extrabold text-sm shadow-md transition-colors"
            >
              <Download size={17} />
              <span>Download: English 2-Min HD MP4</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive 8-Chapter Timeline + ShareChat Viral Caption Pack */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* 8-Chapter Interactive Jump Timeline */}
          <div className="bg-white rounded-2xl border border-[#DFC798] p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#3B0A0C]">
                  8-అధ్యాయాల టైమ్‌లైన్ (Click any chapter to jump &amp; listen)
                </h3>
                <p className="text-xs text-[#57534E]">
                  ప్రతి 15 సెకన్లకు కొత్త విభాగం · స్పష్టమైన AI వాయిస్ ఓవర్ · {asset.resolutionLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScripts((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5EA] hover:bg-[#F3E7CC] text-[#5A1408] border border-[#C99634] text-xs font-extrabold cursor-pointer transition-colors"
              >
                <FileText size={14} />
                <span>{showScripts ? 'వాయిస్ స్క్రిప్ట్ దాచు' : 'వాయిస్ స్క్రిప్ట్ చూడు'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SHARECHAT_PROMO_CHAPTERS.map((ch) => {
                const isActive = ch.index === activeChapterIdx;
                return (
                  <button
                    key={ch.index}
                    type="button"
                    onClick={() => handleJumpChapter(ch.startSec)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#FFF8E7] border-[#C99634] shadow-sm'
                        : 'bg-[#FCFBF8] border-[#E7DCC4] hover:border-[#C99634]'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-extrabold shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-[#3B0A0C] text-[#F5C451]'
                          : 'bg-[#EFE3C8] text-[#4A1208]'
                      }`}
                    >
                      <Play size={10} />
                      <span>{ch.timestampLabel}</span>
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold text-[#1C1917] leading-snug">
                        {activeLang === 'te' ? ch.titleTe : ch.titleEn}
                      </p>
                      {showScripts && (
                        <p className="mt-1.5 text-[11px] text-[#57534E] leading-relaxed">
                          “{activeLang === 'te' ? ch.scriptTe : ch.scriptEn}”
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ShareChat Ready-to-Post Viral Caption & Hashtags */}
          <div className="bg-white rounded-2xl border border-[#DFC798] p-4 sm:p-5 shadow-sm space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#5A1408]" />
                <h3 className="text-base sm:text-lg font-extrabold text-[#3B0A0C]">
                  ShareChat పోస్ట్ క్యాప్షన్ &amp; Hashtags ({activeLang === 'te' ? 'తెలుగు' : 'English'})
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(`full-${activeLang}`, fullShareChatPost)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#007a52] hover:bg-[#006443] text-white text-xs font-extrabold shadow-sm cursor-pointer transition-colors"
                >
                  {copiedKey === `full-${activeLang}` ? <Check size={14} /> : <Copy size={14} />}
                  <span>
                    {copiedKey === `full-${activeLang}`
                      ? 'కాపీ అయింది!'
                      : 'పూర్తి క్యాప్షన్ + Hashtags కాపీ'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(`tags-${activeLang}`, asset.hashtags)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF5EA] hover:bg-[#F3E7CC] text-[#3B0A0C] border border-[#C99634] text-xs font-extrabold cursor-pointer transition-colors"
                >
                  {copiedKey === `tags-${activeLang}` ? <Check size={14} /> : <Hash size={14} />}
                  <span>
                    {copiedKey === `tags-${activeLang}` ? 'Hashtags కాపీ!' : 'Hashtags మాత్రమే'}
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-[#FAF5EA] border border-[#E5D3AF] p-3.5 text-xs sm:text-sm text-[#1C1917] whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
              <strong className="block text-[#5A1408] mb-1.5">{asset.captionTitle}</strong>
              {asset.captionBody}
            </div>

            <div className="rounded-xl bg-[#3B0A0C] text-[#F5C451] px-3.5 py-2.5 text-xs font-bold leading-relaxed break-words">
              {asset.hashtags}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
