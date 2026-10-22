import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, Printer, Bell, ArrowRight } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { generateWhatsAppShareText } from '../utils/panchangaLogic';
import { playTempleBell } from '../utils/audioChime';
import { useLanguage } from '../context/LanguageContext';

interface ActionControlsProps {
  day: DayData;
  onOpenBooking: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ day, onOpenBooking }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const shareText = generateWhatsAppShareText(day, currentUrl);
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
      const text = generateWhatsAppShareText(day, url);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const textToShare = generateWhatsAppShareText(day, url);

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

  return (
    <div className="my-10 space-y-8">
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {/* WhatsApp Share */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppShare}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95 font-telugu"
          title={t('వాట్సాప్‌లో షేర్ చేయండి', 'Share on WhatsApp')}
        >
          <Share2 size={18} />
          <span>{t('వాట్సాప్‌లో షేర్ చేయండి (లింక్‌తో)', 'Share on WhatsApp (with Link)')}</span>
        </a>

        {/* Copy Text */}
        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-5 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-sm transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
        >
          {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-amber-700" />}
          <span>
            {copied
              ? t('పంచాంగం కాపీ అయింది!', 'Panchangam Copied!')
              : t('పంచాంగం కాపీ చేయండి', 'Copy Panchangam')}
          </span>
        </button>

        {/* Print / PDF */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-slate-700 border border-slate-300 px-4 py-3 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-transform hover:scale-105 active:scale-95 font-telugu cursor-pointer"
        >
          <Printer size={16} />
          <span>{t('ప్రింట్ / PDF', 'Print / PDF')}</span>
        </button>

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

      {/* Guruji Consultation Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl border border-amber-500/40 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-amber-300 font-display tracking-widest text-[11px] sm:text-xs uppercase mb-2">
            Personal Astrology Consultation
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
