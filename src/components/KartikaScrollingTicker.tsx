import React from 'react';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';

interface KartikaScrollingTickerProps {
  onNavigateKartika: () => void;
}

export const KartikaScrollingTicker: React.FC<KartikaScrollingTickerProps> = ({
  onNavigateKartika,
}) => {
  const tickerMessage =
    '🔱 పరమ పవిత్ర కార్తీక మాసం విశేష ఏకవార రుద్రాభిషేకం: నెల రోజుల పాటు మీ కుటుంబ గోత్రనామాలతో నిత్య అభిషేకం • ప్రసాదంగా స్వామివారి గంధం, విభూతి & కాశీ కాలభైరవ రక్ష • దక్షిణ: ₹2,500/- (నెలకు) • ఇప్పుడే మీ గోత్రనామాలు నమోదు చేసుకోండి ➔';

  return (
    <aside
      aria-label="Kartika Masam Rudrabhishekam Announcement"
      onClick={onNavigateKartika}
      className="w-full bg-gradient-to-r from-[#380a0a] via-[#5c1313] to-[#380a0a] text-amber-200 border-y border-amber-500/50 shadow-md cursor-pointer hover:bg-[#480c0c] transition-colors relative overflow-hidden group select-none py-2 px-3 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        {/* Left Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-bold text-[11px] tracking-wide shadow-sm">
          <Flame size={13} className="animate-pulse" />
          <span>కార్తీక మహోత్సవం</span>
        </div>

        {/* Scrolling Text (Marquee Animation) */}
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="animate-marquee space-x-12">
            <span className="inline-flex items-center gap-2">
              <span className="text-amber-300 font-serif font-bold">
                🔱 శ్రీ పరమేశ్వరునికి నెల రోజుల ఏకవార రుద్రాభిషేకం:
              </span>
              <span>భక్తుల గోత్రనామాలతో నిత్య సంకల్పం</span>
              <span>• ప్రసాదంగా కాశీ కాలభైరవ రక్ష, విభూతి, గంధం</span>
              <span className="text-amber-300 font-bold bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/40">• దక్షిణ: ₹2,500/- (నెలకు)</span>
              <span className="text-amber-300 underline font-semibold">నమోదు చేసుకోండి ➔</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-amber-400">❖</span>
              <span className="text-amber-300 font-serif font-bold">
                ద్వాదశ రాశుల సమస్త గ్రహ దోష శాంతి:
              </span>
              <span>కుటుంబ సభ్యులందరికీ ఆయురారోగ్యాలు &amp; ఐశ్వర్య సిద్ధి</span>
              <span>• పరిమిత సంకల్పాలు మాత్రమే!</span>
              <span className="text-amber-300 underline font-semibold">క్లిక్ చేయండి ➔</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-amber-300 font-serif font-bold">
                🔱 శ్రీ పరమేశ్వరునికి నెల రోజుల ఏకవార రుద్రాభిషేకం:
              </span>
              <span>భక్తుల గోత్రనామాలతో నిత్య సంకల్పం</span>
              <span>• ప్రసాదంగా కాశీ కాలభైరవ రక్ష, విభూతి, గంధం</span>
              <span className="text-amber-300 font-bold bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/40">• దక్షిణ: ₹2,500/- (నెలకు)</span>
              <span className="text-amber-300 underline font-semibold">నమోదు చేసుకోండి ➔</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-amber-400">❖</span>
              <span className="text-amber-300 font-serif font-bold">
                ద్వాదశ రాశుల సమస్త గ్రహ దోష శాంతి:
              </span>
              <span>కుటుంబ సభ్యులందరికీ ఆయురారోగ్యాలు &amp; ఐశ్వర్య సిద్ధి</span>
              <span>• పరిమిత సంకల్పాలు మాత్రమే!</span>
              <span className="text-amber-300 underline font-semibold">క్లిక్ చేయండి ➔</span>
            </span>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-300 group-hover:text-amber-100 transition-colors">
          <span className="hidden md:inline">నమోదు వివరాలు</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </aside>
  );
};
