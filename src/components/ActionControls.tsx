import React, { useState } from 'react';
import { Share2, Copy, Check, Printer, Bell, ArrowRight } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { generateWhatsAppShareText, generateClipboardText } from '../utils/panchangaLogic';
import { playTempleBell } from '../utils/audioChime';

interface ActionControlsProps {
  day: DayData;
  onOpenBooking: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ day, onOpenBooking }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      const text = generateClipboardText(day);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(generateWhatsAppShareText(day))}`;

  return (
    <div className="my-10 space-y-8">
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* WhatsApp Share */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-full font-bold text-base shadow-lg transition-transform hover:scale-105 font-telugu"
          title="వాట్సాప్‌లో షేర్ చేయండి"
        >
          <Share2 size={19} />
          <span>వాట్సాప్‌లో షేర్ చేయండి</span>
        </a>

        {/* Copy Text */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-5 py-3 rounded-full font-bold text-base shadow-sm transition-transform hover:scale-105 font-telugu cursor-pointer"
        >
          {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-amber-700" />}
          <span>{copied ? 'పంచాంగం కాపీ అయింది!' : 'పంచాంగం కాపీ చేయండి'}</span>
        </button>

        {/* Print / PDF */}
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-700 border border-slate-300 px-5 py-3 rounded-full font-semibold text-sm shadow-sm transition-transform hover:scale-105 font-telugu cursor-pointer"
        >
          <Printer size={17} />
          <span>ప్రింట్ / PDF</span>
        </button>

        {/* Temple Bell */}
        <button
          type="button"
          onClick={playTempleBell}
          className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-4 py-3 rounded-full font-semibold text-sm shadow-sm transition-transform hover:scale-105 font-telugu cursor-pointer"
          title="ఘంటానాదం ధ్వని"
        >
          <Bell size={17} className="text-amber-700" />
          <span>ఘంటానాదం</span>
        </button>
      </div>

      {/* Guruji Consultation Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-amber-500/40 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-amber-300 font-display tracking-widest text-xs uppercase mb-2">
            Personal Astrology Consultation
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold font-telugu mb-3">
            మీ కార్యానికి సరైన శుభ ముహూర్తాన్ని గురుజీ నిర్ణయించగలరు
          </h3>
          <p className="text-amber-100/90 font-telugu text-base mb-6 leading-relaxed">
            వివాహం, గృహప్రవేశం, నూతన వ్యాపార ప్రారంభం మరియు నామకరణం మొదలైన శుభ కార్యాలకు దోషరహితమైన, బలమైన లగ్న ముహూర్తాన్ని శాస్త్రోక్తంగా నిర్ణయించుకోండి.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/918977986166?text=%E0%B0%A8%E0%B0%AE%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B0%BE%E0%B0%B0%E0%B0%82%20%E0%B0%B6%E0%B1%8D%E0%B0%B0%E0%B1%80%20%E0%B0%9C%E0%B0%B2%E0%B1%8D%E0%B0%B2%E0%B0%B5%E0%B0%B0%E0%B0%82%20%E0%B0%B8%E0%B0%BE%E0%B0%AF%E0%B0%BF%20%E0%B0%A7%E0%B1%80%E0%B0%B0%E0%B0%9C%E0%B1%8D%20%E0%B0%B6%E0%B0%B0%E0%B1%8D%E0%B0%AE%20%E0%B0%97%E0%B0%BE%E0%B0%B0%E0%B1%81%2C%20%E0%B0%A8%E0%B0%BE%E0%B0%95%E0%B1%81%20%E0%B0%B6%E0%B1%81%E0%B0%AD%20%E0%B0%AE%E0%B1%81%E0%B0%B9%E0%B1%82%E0%B0%B0%E0%B1%8D%E0%B0%A4%20%E0%B0%A8%E0%B0%BF%E0%B0%B0%E0%B1%8D%E0%B0%A3%E0%B0%AF%E0%B0%82%20%E0%B0%95%E0%B1%8B%E0%B0%B8%E0%B0%82%20%E0%B0%B8%E0%B0%82%E0%B0%AA%E0%B1%8D%E0%B0%B0%E0%B0%A6%E0%B0%BF%E0%B0%82%E0%B0%AA%E0%B1%81%20%E0%B0%95%E0%B0%BE%E0%B0%B5%E0%B0%BE%E0%B0%B2%E0%B0%BF."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-7 py-3.5 rounded-full font-telugu font-bold text-base shadow-lg transition-transform hover:scale-105"
            >
              <span>వాట్సాప్‌లో మాట్లాడండి (8977986166)</span>
            </a>

            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 px-8 py-3.5 rounded-full font-telugu font-bold text-base shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <span>పూజ / ముహూర్త బుకింగ్ చేయండి</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
