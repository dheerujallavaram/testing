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
    <div className="bg-gradient-to-r from-[#fff8ec] via-amber-50/90 to-[#fff8ec] border-2 border-amber-400/90 p-5 sm:p-7 rounded-3xl shadow-md relative overflow-hidden font-telugu">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-4 mb-5">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 block">
            {t('నేటి సమగ్ర దిన ఫలితం • Comprehensive Daily Vedic Prediction', 'Comprehensive Daily Vedic Prediction')}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2 mt-0.5">
            <Sparkles className="text-amber-600 shrink-0" size={22} />
            <span>
              {t(
                'నేటి ప్రత్యేక దిన ఫలితం, తిథి-నక్షత్ర యోగ విశ్లేషణ & శుభకార్య ఫలాలు',
                "Today's Special Prediction, Tithi-Nakshatra Analysis & Auspicious Works"
              )}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
          <span className="bg-amber-900 text-amber-100 px-3 py-1.5 rounded-xl font-semibold">
            {t('ఆరాధ్య దైవం:', 'Presiding Deity:')} <strong className="text-amber-300">{tr(day.deity)}</strong>
          </span>
          <span className="bg-white border border-amber-300 text-amber-950 px-3 py-1.5 rounded-xl font-semibold">
            {t('శుభ వర్ణం:', 'Lucky Color:')} <strong>{tr(day.luckyColor)}</strong>
          </span>
        </div>
      </div>

      {/* Main Daily Prediction Paragraph */}
      <div className="bg-white/95 border border-amber-300 rounded-2xl p-4 sm:p-5 mb-5 shadow-2xs">
        <h3 className="text-sm sm:text-base font-extrabold text-amber-950 flex items-center gap-2 mb-2">
          <Sun size={17} className="text-amber-600 shrink-0" />
          <span>{t(`${day.teediVaram} — నేటి ప్రధాన దిన ఫలితం`, `${tr(day.teediVaram)} — Primary Day Prediction`)}</span>
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-slate-900">
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

      {/* 3-Column Deep Breakdown: Tithi Phalam, Nakshatra Phalam, and Daily Remedy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl p-4 border border-amber-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              {t('నేటి తిథి ఫలితం', 'Tithi Prediction')}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {tr(cleanTithi)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeTithi
              ? `${activeTithi.nameTe} (${activeTithi.natureTe}): ${activeTithi.nativeCharacteristics}`
              : t(
                  `${cleanTithi} తిథి రోజున దైవ ప్రార్థన, నూతన వ్యాపార ఆలోచనలు మరియు కుటుంబ పెద్దల ఆశీస్సులు తీసుకోవడం శుభప్రదం.`,
                  `Observing prayers and initiating well-planned tasks on ${tr(cleanTithi)} brings steady progress.`
                )}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              {t('నేటి నక్షత్ర ఫలితం', 'Nakshatra Prediction')}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-300">
              {tr(cleanNakshatra)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeStar
              ? `అధిపతి: ${activeStar.lordTe} • దేవత: ${activeStar.deityTe} (${activeStar.natureClass}). ${activeStar.forEverybody.summaryTe}`
              : t(
                  `${cleanNakshatra} నక్షత్ర ప్రభావంతో నేడు ఆధ్యాత్మిక సాధన, విద్యాభ్యాసం మరియు వృత్తిపరమైన చర్చలు అనుకూలిస్తాయి.`,
                  `${tr(cleanNakshatra)} star favors spiritual discipline, learning, and constructive career discussions.`
                )}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Compass size={13} className="text-amber-700" />
              <span>{t('ప్రయాణ & నిత్య పరిహారం', 'Travel & Daily Remedy')}</span>
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              {t('శాస్త్రోక్త సూచన', 'Vedic Guide')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
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
          <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-3.5">
            <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 mb-2">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>{t('నేడు చేయదగిన శుభకార్యాలు (Favored Activities Today)', 'Favored Activities Today')}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeStar.forEverybody.auspiciousFor.map((act, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white text-emerald-950 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  ✓ {act}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-rose-50/90 border border-rose-300 rounded-2xl p-3.5">
            <span className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={15} className="text-rose-700 shrink-0" />
              <span>{t('నేడు వాయిదా వేయవలసిన పనులు & జాగ్రత్తలు (Caution Today)', 'Activities to Postpone Today')}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(activeStar.forEverybody.inauspiciousFor?.length
                ? activeStar.forEverybody.inauspiciousFor
                : ['రాహుకాలంలో కొత్త ఒప్పందాలు వద్దు', 'వర్జ్యం సమయంలో ప్రయాణాలు వాయిదా వేయండి']
              ).map((act, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white text-rose-950 font-semibold px-2.5 py-1 rounded-lg border border-rose-200"
                >
                  ✕ {act}
                </span>
              ))}
              <span className="text-xs bg-amber-100 text-amber-950 font-bold px-2.5 py-1 rounded-lg border border-amber-300 inline-flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>చంద్రాష్టమం: {day.chandra.chandrashtamam}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
