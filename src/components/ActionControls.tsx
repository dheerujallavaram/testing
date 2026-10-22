import React, { useState } from 'react';
import { Share2, Copy, Check, Printer, Bell, ArrowRight, Bot, Send, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { generateWhatsAppShareText, CANONICAL_DOMAIN_URL } from '../utils/panchangaLogic';
import { playTempleBell } from '../utils/audioChime';
import { useLanguage } from '../context/LanguageContext';

interface ActionControlsProps {
  day: DayData;
  onOpenBooking: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ day, onOpenBooking }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showAutomationGuide, setShowAutomationGuide] = useState<boolean>(false);
  const { t } = useLanguage();

  const shareText = generateWhatsAppShareText(day, CANONICAL_DOMAIN_URL);
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const directToMyNumberUrl = `https://wa.me/918977986166?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      const text = generateWhatsAppShareText(day, CANONICAL_DOMAIN_URL);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    const textToShare = generateWhatsAppShareText(day, CANONICAL_DOMAIN_URL);

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
          <span>{t('వాట్సాప్‌లో షేర్ చేయండి (telugujyothisham.com లింక్‌తో)', 'Share on WhatsApp (with Link)')}</span>
        </a>

        {/* Direct Send to Guruji's Own WhatsApp Number (8977986166) */}
        <a
          href={directToMyNumberUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 active:scale-95 font-telugu"
          title={t('నా వాట్సాప్‌కు నేటి పంచాంగం పంపండి', 'Send Today Panchangam to My WhatsApp')}
        >
          <Send size={16} />
          <span>{t('నా నంబర్‌కు నేటి పంచాంగం పంపండి', 'Send to My WhatsApp')}</span>
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

        {/* Daily 6 AM WhatsApp Automation Guide Toggle */}
        <button
          type="button"
          onClick={() => setShowAutomationGuide(!showAutomationGuide)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-600 px-5 py-3 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer font-telugu"
        >
          <Bot size={16} className="text-amber-300" />
          <span>{t('ప్రతిరోజూ 6 AM వాట్సాప్ ఆటోమేషన్ సెటప్', 'Daily 6 AM WhatsApp Automation Setup')}</span>
          {showAutomationGuide ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
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

      {/* Expandable Daily WhatsApp Automation Setup Panel */}
      {showAutomationGuide && (
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 sm:p-7 shadow-lg font-telugu space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-amber-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                Daily 6:00 AM IST Auto-Delivery
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-amber-950 mt-1">
                {t(
                  'ప్రతిరోజూ ఉదయం 6:00 గంటలకు మీ వాట్సాప్‌లోకి ఆటోమేటిక్‌గా పంచాంగం రావాలంటే:',
                  'How to Receive Today’s Panchangam Automatically on WhatsApp Every Morning at 6:00 AM:'
                )}
              </h4>
            </div>
            <Sparkles size={22} className="text-amber-600 shrink-0" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-amber-950 text-sm sm:text-base">
                1. {t('ఉచిత GitHub Actions + CallMeBot ఆటోమేషన్ (సిఫార్సు చేయబడినది)', 'Method 1: Free GitHub Actions + CallMeBot (Already Added to Repo!)')}
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>
                  {t(
                    'మీ ప్రాజెక్ట్‌లో ఇప్పటికే `.github/workflows/daily-whatsapp-panchangam.yml` మరియు `scripts/sendDailyPanchangam.ts` సిద్ధంగా ఉన్నాయి.',
                    'We have already added `.github/workflows/daily-whatsapp-panchangam.yml` and `scripts/sendDailyPanchangam.ts` to your repository.'
                  )}
                </li>
                <li>
                  {t(
                    'మీ ఫోన్ నుండి `+34 644 51 95 23` నంబర్‌కు వాట్సాప్‌లో `I allow callmebot to send me messages` అని మెసేజ్ పంపితే మీకు ఉచిత `API Key` వస్తుంది.',
                    'Send "I allow callmebot to send me messages" on WhatsApp to +34 644 51 95 23 to get your free personal API Key.'
                  )}
                </li>
                <li>
                  {t(
                    'మీ GitHub Repo -> Settings -> Secrets -> Actions లో `WHATSAPP_PHONE` (`918977986166`) మరియు `CALLMEBOT_API_KEY` సేవ్ చేస్తే చాలు! ప్రతిరోజూ ఉదయం 6:00 AM కు ఆటోమేటిక్‌గా నేటి పంచాంగం + మేషం నుండి మిథున రాశి ఫలితాలు + `https://telugujyothisham.com` లింక్ మీ వాట్సాప్‌కు వచ్చేస్తుంది.',
                    'Add `WHATSAPP_PHONE` (918977986166) and `CALLMEBOT_API_KEY` in GitHub Repo -> Settings -> Secrets. Every day at 6:00 AM IST, the Panchangam message will be sent to your WhatsApp automatically!'
                  )}
                </li>
              </ol>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-emerald-950 text-sm sm:text-base">
                2. {t('అధికారిక Meta WhatsApp Cloud API / Wati / Aisensy (భక్తులందరికీ బ్రాడ్‌కాస్ట్)', 'Method 2: Official Meta WhatsApp Cloud API (For Devotees Broadcast)')}
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>
                  {t(
                    'మీరు భక్తుల గ్రూపులకు లేదా బ్రాడ్‌కాస్ట్ లిస్ట్‌కు ఆటోమేటిక్‌గా పంపాలనుకుంటే `developers.facebook.com` లో ఉచిత WhatsApp Cloud API టోకెన్ తీసుకోండి.',
                    'Create a free Meta App at developers.facebook.com and enable WhatsApp Cloud API.'
                  )}
                </li>
                <li>
                  {t(
                    'GitHub Secrets లో `META_WA_TOKEN` మరియు `META_PHONE_ID` పెడితే ప్రతిరోజూ ఉదయం 6:00 గంటలకు అఫీషియల్ వాట్సాప్ మెసేజ్ ఆటోమేటిక్‌గా డెలివరీ అవుతుంది.',
                    'Add `META_WA_TOKEN` and `META_PHONE_ID` in GitHub Secrets—our script automatically detects them and sends via official Meta Graph API at 6:00 AM daily.'
                  )}
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

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
