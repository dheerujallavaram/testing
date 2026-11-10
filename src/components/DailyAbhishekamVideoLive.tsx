import React, { useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Flame,
  Search,
  CheckCircle2,
  Users,
  ChevronRight,
  Maximize2,
  Bell,
  Heart,
  Download,
  FileText,
  Copy,
  Check,
  Share2,
  Film,
} from 'lucide-react';
import { OmEmblem } from './OmEmblem';

export interface DevoteeGotraEntry {
  id: string;
  gotram: string;
  devoteeName: string;
  familyMembers?: string;
  sankalpam: string;
  location?: string;
}

export const SAMPLE_DEVOTEE_GOTRANAMALU: DevoteeGotraEntry[] = [
  {
    id: 'g-1',
    gotram: 'కణ్వాసస గోత్రం',
    devoteeName: 'మునిపల్లె భవాని దేవి',
    familyMembers: 'పుత్రుడు శ్రీహర్ష మణికంఠ ఆంజనేయ శర్మ',
    sankalpam: 'కార్తీక మాస పవిత్ర ఏకవార రుద్రాభిషేకం & సంపూర్ణ ఆయురారోగ్య ఐశ్వర్య సిద్ధి',
    location: 'హైదరాబాద్',
  },
  {
    id: 'g-2',
    gotram: 'కాశ్యపస గోత్రం',
    devoteeName: 'జల్లవరం సాయి ధీరజ్ శర్మ',
    familyMembers: 'సమస్త కుటుంబ సభ్యులు',
    sankalpam: 'వంశాభివృద్ధి, సమస్త గ్రహదోష నివారణ & లోక కళ్యాణార్థం',
    location: 'హయత్‌నగర్, హైదరాబాద్',
  },
  {
    id: 'g-3',
    gotram: 'ఆత్రేయస గోత్రం',
    devoteeName: 'పెండ్యాల వెంకటేశ్వరరావు',
    familyMembers: 'సతీమణి లక్ష్మి, కుమారుడు సాయికృష్ణ',
    sankalpam: 'వ్యాపార ధనాభివృద్ధి & ఉద్యోగ ఉన్నత పదోన్నతి',
    location: 'విజయవాడ',
  },
  {
    id: 'g-4',
    gotram: 'భారద్వాజస గోత్రం',
    devoteeName: 'చదలవాడ శ్రీనివాస శర్మ',
    familyMembers: 'సతీమణి సుమలత, కుమార్తె దీపిక',
    sankalpam: 'శీఘ్ర వివాహ ప్రాప్తి & దాంపత్య సౌఖ్యం',
    location: 'విశాఖపట్నం',
  },
  {
    id: 'g-5',
    gotram: 'కౌండిన్యస గోత్రం',
    devoteeName: 'మారేపల్లి సుబ్రహ్మణ్య శాస్త్రి',
    familyMembers: 'కుటుంబ సభ్యులందరూ',
    sankalpam: 'ఆరోగ్య రక్ష & దీర్ఘాయుష్షు ప్రాప్తి',
    location: 'తిరుపతి',
  },
  {
    id: 'g-6',
    gotram: 'శ్రీవత్సస గోత్రం',
    devoteeName: 'వడ్లమాని రామకృష్ణ',
    familyMembers: 'సతీమణి పద్మావతి, కుమారులు రాహుల్, రోహిత్',
    sankalpam: 'సత్సంతాన సౌభాగ్యం & విద్యా విజయాలు',
    location: 'వరంగల్',
  },
  {
    id: 'g-7',
    gotram: 'హరితస గోత్రం',
    devoteeName: 'కొండేటి అన్నపూర్ణ దేవి',
    familyMembers: 'భర్త రాజశేఖర్, సమస్త పరివారం',
    sankalpam: 'ఏలినాటి శని దోష శాంతి & సుఖశాంతులు',
    location: 'గుంటూరు',
  },
];

const VIDEO_WITH_SCROLLTEXT = '/assets/aistudio/kartika-abhishekam-with-scrolltext.mp4';
const VIDEO_RAW = '/assets/aistudio/0574c345-07e3-45ef-b15c-debb61f809b6_59677808.mp4';

interface DailyAbhishekamVideoLiveProps {
  onScrollToRegister?: () => void;
}

export const DailyAbhishekamVideoLive: React.FC<DailyAbhishekamVideoLiveProps> = ({
  onScrollToRegister,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTickerInVideo, setShowTickerInVideo] = useState<boolean>(false);
  const [activeVideoSource, setActiveVideoSource] = useState<'scrolltext' | 'raw'>('scrolltext');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [showTextModal, setShowTextModal] = useState<boolean>(false);

  const currentVideoSrc = activeVideoSource === 'scrolltext' ? VIDEO_WITH_SCROLLTEXT : VIDEO_RAW;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleSwitchVideo = (mode: 'scrolltext' | 'raw') => {
    setActiveVideoSource(mode);
    if (mode === 'raw') {
      setShowTickerInVideo(true);
    } else {
      setShowTickerInVideo(false);
    }
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 100);
  };

  const generateFullScrollTextContent = () => {
    return `🔱 శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం 🔱
బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ
సంప్రదించండి: +91 7013079166 / +91 8977986166
హయత్‌నగర్, విజయవాడ హైవే, హైదరాబాద్
వెబ్‌సైట్: https://www.telugujyothisham.com/kartika-abhishekam

═════════════════════════════════════════════════════════
🔴 పవిత్ర కార్తీక మాస నిత్య ఏకవార రుద్రాభిషేక సంకల్ప గోత్రనామాలు
═════════════════════════════════════════════════════════

${SAMPLE_DEVOTEE_GOTRANAMALU.map(
  (d, idx) => `${idx + 1}. 🔱 ${d.gotram}
   భక్తులు: ${d.devoteeName}
   ${d.familyMembers ? `కుటుంబ సభ్యులు: ${d.familyMembers}\n   ` : ''}సంకల్పం: ${d.sankalpam}
   ${d.location ? `ప్రాంతం: ${d.location}\n` : ''}`
).join('\n')}

═════════════════════════════════════════════════════════
నమః పార్వతీపతయే హర హర మహాదేవ శంభో శంకర!
సమస్త భక్తకోటికి శివానుగ్రహ ప్రాప్తిరస్తు!`;
  };

  const handleDownloadScrollText = () => {
    const textContent = generateFullScrollTextContent();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Kartika-Abhishekam-Gotranamalu-ScrollText.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyScrollText = () => {
    const textContent = generateFullScrollTextContent();
    navigator.clipboard.writeText(textContent).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    });
  };

  // Filter devotees by search query
  const filteredDevotees = searchQuery.trim()
    ? SAMPLE_DEVOTEE_GOTRANAMALU.filter(
        (d) =>
          d.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.gotram.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.familyMembers && d.familyMembers.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <section
      aria-label="Daily Shiva Abhishekam Live Darshan"
      className="bg-gradient-to-b from-[#220703] via-[#380a0a] to-[#220703] text-amber-100 rounded-3xl p-4 sm:p-7 border-2 border-amber-500/80 shadow-2xl overflow-hidden font-telugu relative"
    >
      {/* Decorative Background Lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white text-xs sm:text-sm font-extrabold shadow-lg animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-white inline-block animate-ping" />
          <span>🔴 ప్రత్యక్ష కార్తీక మాస ఏకవార రుద్రాభిషేక దర్శనం</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-100 leading-tight flex items-center justify-center gap-2.5">
          <span className="text-amber-400">🔱</span>
          <span>స్వామివారి నిత్య రుద్రాభిషేకం & గోత్రనామాల సంకల్పం</span>
          <span className="text-amber-400">🔱</span>
        </h2>

        <p className="text-xs sm:text-base text-amber-200/90 leading-relaxed">
          బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి శాస్త్రోక్త వేద మంత్రోచ్ఛారణలతో సాగుతున్న పవిత్ర శివలింగ అభిషేకం. భక్తుల గోత్రనామాలు దివ్యంగా స్క్రోల్ అవుతున్నాయి:
        </p>
      </div>

      {/* Main Video & Ticker Player Container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Ornate Temple Altar Framing */}
        <div className="bg-[#140402] rounded-3xl border-2 sm:border-4 border-amber-500/80 shadow-2xl overflow-hidden relative">
          {/* Top Temple Altar Header Strip */}
          <div className="bg-gradient-to-r from-[#2c0902] via-[#4a1205] to-[#2c0902] px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/60 text-xs sm:text-sm font-bold text-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse" />
              <span className="font-extrabold text-amber-300">ప్రత్యక్ష పూజ • Live Temple View</span>
            </div>
            
            {/* Video Mode Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-amber-500/40 text-[11px] sm:text-xs">
              <button
                type="button"
                onClick={() => handleSwitchVideo('scrolltext')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeVideoSource === 'scrolltext'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                    : 'text-amber-200 hover:text-white'
                }`}
                title="గోత్రనామాలు స్క్రోల్ అవుతున్న వీడియో"
              >
                <Film size={12} />
                <span>స్క్రోలింగ్ వీడియో</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchVideo('raw')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeVideoSource === 'raw'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                    : 'text-amber-200 hover:text-white'
                }`}
                title="స్క్రోలింగ్ లేని ఒరిజినల్ వీడియో"
              >
                <span>ఒరిజినల్ వీడియో</span>
              </button>
            </div>
          </div>

          {/* Video Player Box with Portrait Aspect Ratio preservation */}
          <div className="relative bg-black flex items-center justify-center min-h-[460px] sm:min-h-[560px] max-h-[720px] overflow-hidden group">
            <video
              ref={videoRef}
              key={currentVideoSrc}
              src={currentVideoSrc}
              className="w-full h-full max-h-[700px] object-contain block mx-auto cursor-pointer"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onClick={togglePlay}
            />

            {/* Quick Unmute Floating Banner for Mobile/Devotees */}
            {isMuted && (
              <button
                type="button"
                onClick={toggleMute}
                className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-500/95 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer backdrop-blur-xs animate-bounce"
                title="మంత్రోచ్ఛారణ వినడానికి క్లిక్ చేయండి"
              >
                <VolumeX size={16} />
                <span>🔊 మంత్రోచ్ఛారణ వినండి (Unmute Audio)</span>
              </button>
            )}

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-amber-200 hover:text-white border border-amber-500/50 shadow-md transition-all cursor-pointer backdrop-blur-xs"
                title={isMuted ? 'అన్‌మ్యూట్' : 'మ్యూట్'}
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              <button
                type="button"
                onClick={handleFullscreen}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-amber-200 hover:text-white border border-amber-500/50 shadow-md transition-all cursor-pointer backdrop-blur-xs"
                title="పూర్తి స్క్రీన్"
                aria-label="Fullscreen"
              >
                <Maximize2 size={17} />
              </button>
            </div>

            {/* Center Play/Pause button on Hover */}
            <button
              type="button"
              onClick={togglePlay}
              className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/80 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all cursor-pointer z-10 ${
                isPlaying ? 'opacity-0 group-hover:opacity-90' : 'opacity-100 scale-110'
              }`}
              title={isPlaying ? 'పాజ్ చేయండి' : 'ప్లే చేయండి'}
              aria-label="Toggle play pause"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>

            {/* DEVOTEES SANKALPAM SCROLLING TICKER OVERLAY (Elevated, Fully Visible) */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-2 sm:inset-x-4 z-30 pointer-events-none">
              <div className="bg-gradient-to-r from-[#2c0804]/95 via-[#541007]/95 to-[#2c0804]/95 border-2 border-amber-400/90 shadow-2xl py-2 px-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 overflow-hidden backdrop-blur-md">
                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[11px] sm:text-xs shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white inline-block animate-ping" />
                  <span>సంకల్ప కర్తలు:</span>
                </div>

                <div className="flex-1 overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee space-x-10 text-xs sm:text-sm font-bold text-amber-100 inline-block">
                    {SAMPLE_DEVOTEE_GOTRANAMALU.concat(SAMPLE_DEVOTEE_GOTRANAMALU).map((entry, idx) => (
                      <span key={`${entry.id}-${idx}`} className="inline-flex items-center gap-2">
                        <span className="text-amber-400 font-extrabold">🔱 {entry.gotram}:</span>
                        <span className="text-white font-extrabold">{entry.devoteeName}</span>
                        {entry.familyMembers && (
                          <span className="text-amber-200 font-medium">({entry.familyMembers})</span>
                        )}
                        <span className="text-amber-300 font-normal">• {entry.sankalpam}</span>
                        <span className="text-amber-500 font-black">❖</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Under-Video Broadcast Control & Info Bar */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-[#200502] via-[#350a06] to-[#200502] border-t border-amber-500/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-xs"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'పాజ్' : 'ప్లే'}</span>
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-200 font-bold border border-amber-600/60 cursor-pointer"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isMuted ? 'శబ్దం ఆన్' : 'మ్యూట్'}</span>
              </button>

              <a
                href={VIDEO_WITH_SCROLLTEXT}
                download="Sri-Siva-Rudrabhishekam.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-md border border-amber-200 transition-all transform hover:scale-105 cursor-pointer"
                title="సంపూర్ణ పూజా వీడియో డౌన్‌లోడ్ (MP4)"
              >
                <Download size={15} />
                <span>పూజా వీడియో డౌన్‌లోడ్ (MP4)</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-300/80 text-xs hidden sm:inline">
                మీ కుటుంబం పేరుతో పూజ కావాలా?
              </span>
              <button
                type="button"
                onClick={onScrollToRegister}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>నా గోత్రనామాలు నమోదు చేయండి</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>



        {/* Live Devotee Search & Verification Tool */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-amber-200 flex items-center gap-1.5">
              <Search size={15} className="text-amber-400" />
              <span>నేటి సంకల్పంలో మీ గోత్రం / పేరు తనిఖీ చేసుకోండి:</span>
            </h4>
            <p className="text-[11px] text-amber-300/80">
              నమోదు చేసుకున్న భక్తులు తమ పేరు లేదా గోత్రం నమోదు చేసి ధృవీకరించుకోవచ్చు.
            </p>
          </div>

          <div className="relative max-w-sm w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ఉదా: భవాని దేవి, కణ్వాసస, కాశ్యప..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#140402] border border-amber-500/70 text-amber-100 placeholder-amber-400/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-amber-400" />
          </div>
        </div>

        {/* Search Results Display if Query Entered */}
        {searchQuery.trim() && (
          <div className="mt-3 p-3.5 rounded-2xl bg-[#1e0704] border-2 border-emerald-500/70 animate-fadeIn">
            {filteredDevotees.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                  <CheckCircle2 size={16} />
                  <span>
                    ధృవీకరించబడింది! నేటి రుద్రాభిషేక సంకల్పంలో మీ పేరు చేర్చబడింది ({filteredDevotees.length} దొరికాయి):
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {filteredDevotees.map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 rounded-xl bg-amber-950/80 border border-emerald-500/40 text-xs text-amber-100 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-amber-300">{d.gotram}</span>
                        {d.location && (
                          <span className="text-[10px] text-amber-400/80 bg-amber-900/60 px-2 py-0.5 rounded">
                            {d.location}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-white text-sm">{d.devoteeName}</div>
                      {d.familyMembers && (
                        <div className="text-amber-200 text-[11px]">{d.familyMembers}</div>
                      )}
                      <div className="text-[11px] text-emerald-300 pt-0.5">
                        సంకల్పం: {d.sankalpam}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-amber-300/90 text-xs py-1">
                "{searchQuery}" తో ఏమీ కనపడలేదు. ఒకవేళ మీ గోత్రనామాలు ఇంకా నమోదు కాకపోతే, క్రింద ఉన్న బటన్ ద్వారా ఇప్పుడే నమోదు చేసుకోండి.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
