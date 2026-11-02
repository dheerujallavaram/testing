import React, { useMemo } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Compass, Sun, ShieldCheck } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { findNakshatraClassicData, findTithiClassicData } from '../data/krishnaRauNakshatraData';

interface DayVisheshamCardProps {
  day: DayData;
}

export const DayVisheshamCard: React.FC<DayVisheshamCardProps> = ({ day }) => {
  const { language, t, tr } = useLanguage();

  const cleanTithi = day.panchanga.tithi.split(/[-–—]/)[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split(/[-–—]/)[0]?.trim() || day.panchanga.nakshatram;
  const cleanYogam = day.panchanga.yogam.split(/[-–—]/)[0]?.trim() || day.panchanga.yogam;

  const activeStar = useMemo(() => findNakshatraClassicData(cleanNakshatra), [cleanNakshatra]);
  const activeTithi = useMemo(() => findTithiClassicData(cleanTithi), [cleanTithi]);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50/60 border-2 border-amber-300 shadow-lg p-6 sm:p-8 rounded-3xl relative overflow-hidden font-telugu">
      {/* Sacred border accent */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-600 to-red-700" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-4 mb-5">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-orange-800 font-display">
            {t('నేటి సమగ్ర దిన ఫలితం • Comprehensive Daily Vedic Prediction', 'Comprehensive Daily Vedic Prediction')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 flex items-center gap-2.5 mt-1">
            <Sparkles className="text-orange-600 shrink-0" size={26} />
            <span>
              {t(
                'నేటి ప్రత్యేక దిన ఫలితం, తిథి-నక్షత్ర యోగ విశ్లేషణ & శుభకార్య ఫలాలు',
                "Today's Special Prediction, Tithi-Nakshatra Analysis & Auspicious Works"
              )}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 bg-amber-100/80 border border-amber-300 rounded-xl text-xs text-amber-950 font-semibold">
            {t('ఆరాధ్య దైవం:', 'Presiding Deity:')} <strong className="text-orange-900">{tr(day.deity)}</strong>
          </div>
          <div className="px-3.5 py-1.5 bg-amber-100/80 border border-amber-300 rounded-xl text-xs text-amber-950 font-semibold">
            {t('శుభ వర్ణం:', 'Lucky Color:')} <strong className="text-orange-900">{tr(day.luckyColor)}</strong>
          </div>
        </div>
      </div>

      {/* Main Daily Prediction Paragraph */}
      <div className="bg-amber-100/50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 mb-5">
        <h3 className="text-sm sm:text-base font-extrabold text-amber-950 flex items-center gap-2 mb-2">
          <Sun size={18} className="text-orange-600 shrink-0" />
          <span>{t(`${day.teediVaram} — నేటి ప్రధాన దిన ఫలితం:`, `${tr(day.teediVaram)} — Primary Day Prediction:`)}</span>
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-amber-950 font-medium">
          {language === 'en' ? (
            <>
              On <strong>{tr(day.teediVaram)}</strong>, the lunar Tithi is <strong>{tr(cleanTithi)}</strong>, Nakshatram is{' '}
              <strong>{tr(cleanNakshatra)}</strong>, and Yogam is <strong>{tr(cleanYogam)}</strong>. Worshipping{' '}
              <strong>{tr(day.deity)}</strong> during Abhijit Muhurtham ({tr(day.shubha.abhijit)}) or Amrutha Gadiyalu ({tr(day.shubha.amrutha)}) bestows peace, career success, and family prosperity. {day.phalitham}
            </>
          ) : (
            <>
              ఈ రోజు <strong>{day.teediVaram}</strong> నాడు <strong>{cleanTithi}</strong> తిథి, <strong>{cleanNakshatra}</strong> నక్షత్రం మరియు <strong>{cleanYogam}</strong> యోగ సంయోగం కలదు. {day.phalitham} ఈ రోజు <strong>{day.deity}</strong> ఆరాధన చేయడం, అభిజిత్ ముహూర్తం ({day.shubha.abhijit}) లేదా అమృత ఘడియలలో ({day.shubha.amrutha}) ముఖ్యమైన కార్యాలు ప్రారంభించడం వల్ల సర్వకార్య సిద్ధి, ఆర్థిక పురోగతి మరియు కుటుంబ సౌఖ్యం కలుగుతాయి.
            </>
          )}
        </p>
      </div>

      {/* Expanded 3-Column Breakdown: Tithi Phalam, Nakshatra Phalam, and Daily Remedy/Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Column 1: Tithi Phala */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800">
              {t('నేటి తిథి ఫలితం', 'Tithi Prediction')}
            </span>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full">
              {tr(cleanTithi)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            {activeTithi
              ? `${activeTithi.nameTe} (${activeTithi.natureTe}): ${activeTithi.nativeCharacteristics}`
              : t(
                  `${cleanTithi} తిథి రోజున దైవ ప్రార్థన, నూతన వ్యాపార ఆలోచనలు మరియు కుటుంబ పెద్దల ఆశీస్సులు తీసుకోవడం శుభప్రదం.`,
                  `Observing prayers and initiating well-planned tasks on ${tr(cleanTithi)} brings steady progress.`
                )}
          </p>
        </div>

        {/* Column 2: Nakshatra Phala */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800">
              {t('నేటి నక్షత్ర ఫలితం', 'Nakshatra Prediction')}
            </span>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full">
              {tr(cleanNakshatra)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            {activeStar
              ? `అధిపతి: ${activeStar.lordTe} • దేవత: ${activeStar.deityTe} (${activeStar.natureClass}). ${activeStar.forEverybody.summaryTe}`
              : t(
                  `${cleanNakshatra} నక్షత్ర ప్రభావంతో నేడు ఆధ్యాత్మిక సాధన, విద్యాభ్యాసం మరియు వృత్తిపరమైన చర్చలు అనుకూలిస్తాయి.`,
                  `${tr(cleanNakshatra)} star favors spiritual discipline, learning, and constructive career discussions.`
                )}
          </p>
        </div>

        {/* Column 3: Travel, Direction & Daily Pariharam */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800 flex items-center gap-1">
              <Compass size={13} />
              <span>{t('ప్రయాణ & నిత్య పరిహారం', 'Travel & Daily Remedy')}</span>
            </span>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {t('శాస్త్రోక్త సూచన', 'Vedic Guide')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            {activeStar
              ? `${activeStar.journeysTe} ఉదయం స్నానానంతరం "${day.deity}" స్మరణ చేసి, రాహుకాలం (${day.ashubha.rahukalam}) మినహాయించి ప్రయాణాలు సాగించండి.`
              : t(
                  `ఉదయం ${day.deity} ఆరాధన చేసి, రాహుకాలం (${day.ashubha.rahukalam}) మరియు వర్జ్యం (${day.ashubha.varjyam}) సమయాలను మినహాయించి ముఖ్య కార్యాలు చేపట్టండి.`,
                  `Offer prayers to ${tr(day.deity)} and avoid Rahu Kalam (${tr(day.ashubha.rahukalam)}) for new journeys.`
                )}
          </p>
        </div>
      </div>

      {/* Auspicious vs Caution Activities Row */}
      {activeStar && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-amber-200/80">
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5">
            <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 mb-2">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>{t('నేడు చేయదగిన శుభకార్యాలు (Favored Activities Today):', 'Favored Activities Today:')}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeStar.forEverybody.auspiciousFor.map((act, idx) => (
                <span
                  key={idx}
                  className="bg-white text-emerald-950 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-semibold"
                >
                  ✓ {act}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5">
            <span className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={15} className="text-rose-700 shrink-0" />
              <span>{t('నేడు వాయిదా వేయవలసిన పనులు & జాగ్రత్తలు (Caution Today):', 'Activities to Postpone Today:')}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(activeStar.forEverybody.inauspiciousFor?.length
                ? activeStar.forEverybody.inauspiciousFor
                : ['రాహుకాలంలో కొత్త ఒప్పందాలు వద్దు', 'వర్జ్యం సమయంలో ప్రయాణాలు వాయిదా వేయండి']
              ).map((inAct, idx) => (
                <span
                  key={idx}
                  className="bg-white text-rose-950 border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-semibold"
                >
                  ⚠️ {inAct}
                </span>
              ))}
              <span className="bg-white text-amber-950 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
                <ShieldCheck size={12} className="inline mr-1 text-amber-700" />
                చంద్రాష్టమం: {day.chandra.chandrashtamam}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

