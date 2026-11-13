import React from 'react';
import { Gem, ShieldAlert, Sparkles, MessageCircle, CalendarCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RatnaGuidance } from '../utils/vrataCalendarAndRatnaEngine';

interface RatnaRudrakshaAdvisorCardProps {
  nativeName: string;
  lagnaTe: string;
  lagnaEn: string;
  guidance: RatnaGuidance;
  whatsappConsultUrl: string;
  onOpenBooking?: () => void;
}

export const RatnaRudrakshaAdvisorCard: React.FC<RatnaRudrakshaAdvisorCardProps> = ({
  nativeName,
  lagnaTe,
  lagnaEn,
  guidance,
  whatsappConsultUrl,
  onOpenBooking,
}) => {
  const { t, language } = useLanguage();

  return (
    <div
      id="chapter-29"
      className="scroll-mt-24 rounded-3xl border-2 border-amber-400 bg-gradient-to-br from-[#fffdf8] via-white to-amber-50/70 p-4 sm:p-6 shadow-md space-y-5 print-card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
        <div>
          <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wide block mb-1">
            {t(
              'అధ్యాయం 29 · లగ్న ఆధారిత వైదిక రత్న శాస్త్రం · రుద్రాక్ష & విశేష హోమ పరిహారాలు',
              'Chapter 29 · Lagna-Based Ratna (Gemstone), Rudraksha & Dosha Remedy Advisor'
            )}
          </span>
          <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
            <Gem size={20} className="text-amber-700 shrink-0" />
            <span>
              {t(
                `${nativeName} గారి (${lagnaTe} లగ్నం) అదృష్ట రత్నం, రుద్రాక్ష & శాంతి మార్గం`,
                `${nativeName}'s (${lagnaEn} Lagna) Benefic Gemstone, Rudraksha & Vedic Remedy`
              )}
            </span>
          </h4>
        </div>
        <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl shrink-0">
          {t(`లగ్నం: ${lagnaTe}`, `Lagna: ${lagnaEn}`)}
        </span>
      </div>

      {/* Primary Life Stone & Bhagya Stone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-emerald-50/70 border border-emerald-300 p-4 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 block">
            ★ {t('ప్రధాన జీవ రత్నం (లగ్నాధిపతి బలానికి)', 'Primary Life Stone (Lagna Lord Benefic)')}
          </span>
          <h5 className="text-base font-extrabold text-amber-950">
            {language === 'en' ? guidance.primaryGemEn : guidance.primaryGemTe}
          </h5>
          <div className="text-xs text-slate-700 space-y-1">
            <div>
              <strong>{t('ఉప-రత్నం (ప్రత్యామ్నాయం):', 'Alternative Upa-Ratna:')}</strong>{' '}
              {language === 'en' ? guidance.upaRatnaEn : guidance.upaRatnaTe}
            </div>
            <div>
              <strong>{t('లోహం & వేలు:', 'Metal & Finger:')}</strong>{' '}
              {language === 'en' ? guidance.metalAndFingerEn : guidance.metalAndFingerTe}
            </div>
            <div>
              <strong>{t('ధారణ సమయం:', 'Wearing Muhurtham:')}</strong>{' '}
              {language === 'en' ? guidance.auspiciousDayAndTimeEn : guidance.auspiciousDayAndTimeTe}
            </div>
            <div className="text-emerald-950 font-bold pt-1">
              📿 {t('జప మంత్రం:', 'Energizing Mantra:')} {guidance.mantraTe}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50/70 border border-amber-300 p-4 space-y-2.5">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
              👑 {t('భాగ్య రత్నం & దివ్య రుద్రాక్ష ధారణ', 'Bhagya Gemstone & Rudraksha Suggestion')}
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {language === 'en' ? guidance.bhagyaGemEn : guidance.bhagyaGemTe}
            </p>
          </div>

          <div className="bg-white/95 rounded-xl p-3 border border-amber-200 space-y-1">
            <strong className="text-xs text-amber-950 block">
              🔱 {language === 'en' ? guidance.rudrakshaTitleEn : guidance.rudrakshaTitleTe}
            </strong>
            <p className="text-xs text-slate-700 leading-relaxed">
              {language === 'en' ? guidance.rudrakshaBenefitEn : guidance.rudrakshaBenefitTe}
            </p>
          </div>

          <div className="bg-rose-50/90 rounded-xl p-3 border border-rose-200 flex items-start gap-2 text-xs">
            <ShieldAlert size={16} className="text-rose-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-950 block">
                {t('ధరించకూడని రత్నాలు (6/8/12 త్రిక స్థానాలు):', 'Gemstones to Avoid (6th/8th/12th Lords):')}
              </strong>
              <span className="text-rose-900">
                {language === 'en' ? guidance.avoidGemsEn : guidance.avoidGemsTe}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Vedic Pooja & Booking Conversion Funnel */}
      <div className="rounded-2xl bg-[#3c1104] text-amber-50 p-4 sm:p-5 border border-amber-400/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div className="space-y-1 max-w-2xl">
          <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>{t('మీ జాతక దోష స్థితికి అత్యుత్తమ శాంతి పరిహారం', 'Personalized Vedic Remedy Match')}</span>
          </span>
          <h5 className="text-base sm:text-lg font-extrabold text-white">
            {language === 'en' ? guidance.recommendedPoojaEn : guidance.recommendedPoojaTe}
          </h5>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            {language === 'en' ? guidance.poojaReasonEn : guidance.poojaReasonTe}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenBooking && (
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <CalendarCheck size={15} />
              <span>{t('ఈ పూజ / రత్న సంప్రదింపు బుక్ చేయండి', 'Book This Pooja / Ratna Consult')}</span>
            </button>
          )}
          <a
            href={whatsappConsultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-colors"
          >
            <MessageCircle size={15} />
            <span>{t('వాట్సాప్ సంప్రదింపు', 'WhatsApp Guruji')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
