import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { ALL_RASHIS, NAKSHATRAS } from '../data/panchangamData';
import { calculateTaraBalam, checkChandrashtamam } from '../utils/panchangaLogic';
import { RashiGlyph } from './RashiGlyph';
import { useLanguage } from '../context/LanguageContext';

interface DevoteeCompatibilityCheckerProps {
  day: DayData;
}

const ENGLISH_TARA_DESCRIPTIONS: Record<number, string> = {
  1: 'Janma Tara (Birth Star) — Moderate; take care of physical comfort and avoid hasty stress.',
  2: 'Sampat Tara (Wealth Star) — Highly auspicious; brings financial inflow, prosperity, and joy.',
  3: 'Vipat Tara (Obstacle Star) — Exercise caution in travel and postpone risky new ventures.',
  4: 'Kshema Tara (Well-being Star) — Very favorable; supports health, safety, and smooth progress.',
  5: 'Pratyak Tara (Hurdle Star) — Minor delays possible; patience and prayer are advised.',
  6: 'Sadhaka Tara (Success Star) — Highly auspicious; ideal for achieving important goals and victory.',
  7: 'Naidhana Tara (Caution Star) — Avoid major auspicious initiations today; focus on spiritual worship.',
  8: 'Mitra Tara (Friendly Star) — Favorable; brings cooperation from friends and steady success.',
  9: 'Parama Mitra Tara (Supreme Friend Star) — Extremely auspicious; supports all new beginnings and honors.',
};

export const DevoteeCompatibilityChecker: React.FC<DevoteeCompatibilityCheckerProps> = ({ day }) => {
  const [selectedRashiId, setSelectedRashiId] = useState<string>('mesham');
  const [selectedNakshatraIdx, setSelectedNakshatraIdx] = useState<number>(1);
  const { language, t, tr } = useLanguage();

  // Determine current day's nakshatra index
  const dayNakshatraName = day.panchanga.nakshatram.split(' ')[0];
  const dayNakshatra = NAKSHATRAS.find((n) => n.telugu.includes(dayNakshatraName)) || NAKSHATRAS[11];

  const isChandrashtamam = checkChandrashtamam(selectedRashiId, day);
  const taraResult = calculateTaraBalam(selectedNakshatraIdx, dayNakshatra.index);

  const selectedRashiObj = ALL_RASHIS.find((r) => r.id === selectedRashiId);
  const selectedNakshatraObj = NAKSHATRAS.find((n) => n.index === selectedNakshatraIdx);

  return (
    <div id="compatibility" className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl border-2 border-amber-500/40 my-6 sm:my-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs tracking-[0.2em] font-semibold text-amber-300 font-display uppercase">
            Personal Vedic Almanac Checker
          </span>
          <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold font-telugu text-white mt-1">
            {t('మీ రాశి & జన్మ నక్షత్ర బలం పరిశీలించండి', 'Check Your Personal Rashi & Nakshatra Strength')}
          </h3>
          <p className="text-amber-200/90 text-xs sm:text-sm md:text-base font-telugu mt-2 max-w-2xl mx-auto leading-relaxed">
            {t(
              `మీ జన్మ రాశి మరియు నక్షత్రాన్ని ఎంచుకుని ${day.teediVaram} నాడు మీ తారాబలం మరియు చంద్రాష్టమ గోచార ఫలితాలను తెలుసుకోండి.`,
              `Select your birth Rashi and Janma Nakshatra to check your personal Tara Balam and Chandrashtamam status for ${tr(day.teediVaram)}.`
            )}
          </p>
        </div>

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {/* Select Rashi */}
          <div className="bg-amber-950/70 border border-amber-600/50 p-3.5 sm:p-4 rounded-xl">
            <label htmlFor="rashi-select" className="block text-xs font-semibold text-amber-300 font-telugu mb-1.5 flex items-center justify-between">
              <span>{t('మీ జన్మ రాశిని ఎంచుకోండి (Select Rashi):', 'Select Your Birth Rashi (Moon Sign):')}</span>
              <RashiGlyph rashi={selectedRashiId} size={15} className="text-amber-300 shrink-0" />
            </label>
            <select
              id="rashi-select"
              value={selectedRashiId}
              onChange={(e) => setSelectedRashiId(e.target.value)}
              className="w-full bg-amber-900 border border-amber-500 text-amber-100 rounded-lg p-2.5 text-base sm:text-sm font-telugu font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer"
            >
              {ALL_RASHIS.map((r) => (
                <option key={r.id} value={r.id} className="bg-amber-950 text-white">
                  {tr(r.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Select Nakshatram */}
          <div className="bg-amber-950/70 border border-amber-600/50 p-3.5 sm:p-4 rounded-xl">
            <label htmlFor="nakshatra-select" className="block text-xs font-semibold text-amber-300 font-telugu mb-1.5">
              {t('మీ జన్మ నక్షత్రాన్ని ఎంచుకోండి (Select Nakshatram):', 'Select Your Birth Star (Janma Nakshatra):')}
            </label>
            <select
              id="nakshatra-select"
              value={selectedNakshatraIdx}
              onChange={(e) => setSelectedNakshatraIdx(parseInt(e.target.value, 10))}
              className="w-full bg-amber-900 border border-amber-500 text-amber-100 rounded-lg p-2.5 text-base sm:text-sm font-telugu font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer"
            >
              {NAKSHATRAS.map((n) => (
                <option key={n.index} value={n.index} className="bg-amber-950 text-white">
                  {n.index}. {language === 'en' ? `${n.english} (${n.telugu})` : `${n.telugu} (${n.english})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Chandrashtamam Box */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isChandrashtamam
                ? 'bg-rose-950/80 border-rose-500 shadow-rose-900/50 shadow-md ring-1 ring-rose-400'
                : 'bg-emerald-950/70 border-emerald-600/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold font-telugu tracking-wider text-amber-300">
                {t('చంద్రాష్టమ స్థితి', 'Chandrashtamam Status')}
              </span>
              {isChandrashtamam ? (
                <span className="flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-0.5 bg-rose-600 text-white font-telugu font-bold rounded-full">
                  <AlertTriangle size={12} /> {t('చంద్రాష్టమం ఉంది!', 'Chandrashtamam Active')}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-0.5 bg-emerald-600 text-white font-telugu font-bold rounded-full">
                  <CheckCircle2 size={12} /> {t('సురక్షితం', 'Favorable Transit')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <RashiGlyph rashi={selectedRashiId} size={20} className="text-amber-300 shrink-0" />
              <p className="text-base sm:text-lg font-bold font-telugu text-white">
                {selectedRashiObj ? tr(selectedRashiObj.name) : ''}
              </p>
            </div>

            <p className="text-xs sm:text-sm font-telugu mt-2 text-amber-100/90 leading-relaxed">
              {isChandrashtamam
                ? t(
                    'ఈ రోజు మీ రాశికి చంద్రుడు 8వ స్థానంలో సంచరిస్తున్నాడు. కావున కొత్త ఒప్పందాలు, వివాదాలు, దూర ప్రయాణాలు వాయిదా వేయడం మంచిది. శివారాధన శుభం.',
                    'The Moon is transiting the 8th house from your birth sign today. Postpone major new contracts, disputes, or long journeys. Worshipping Lord Shiva is auspicious.'
                  )
                : t(
                    'ఈ రోజు మీ రాశికి చంద్రాష్టమం లేదు. రోజువారీ పనులు, ప్రయాణాలు సాధారణంగా కొనసాగించవచ్చు.',
                    'No Chandrashtamam for your Rashi today. Daily activities, prayers, and journeys can proceed smoothly.'
                  )}
            </p>
          </div>

          {/* Tara Balam Box */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              taraResult.isFavorable
                ? 'bg-amber-950/80 border-amber-400 shadow-amber-900/40 shadow-md ring-1 ring-amber-400'
                : 'bg-amber-950/60 border-amber-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold font-telugu tracking-wider text-amber-300">
                {t('నేటి నవతార బలం', "Today's Navatara Balam")}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-telugu font-bold ${
                  taraResult.grade === 'excellent'
                    ? 'bg-emerald-500 text-white'
                    : taraResult.grade === 'good'
                    ? 'bg-amber-500 text-white'
                    : taraResult.grade === 'caution'
                    ? 'bg-orange-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {tr(taraResult.taraName)} ({taraResult.isFavorable ? t('అనుకూలం', 'Favorable') : t('ప్రతికూలం', 'Caution')})
              </span>
            </div>

            <p className="text-lg font-bold font-telugu text-white mt-1">
              {language === 'en'
                ? `${selectedNakshatraObj?.english} Nakshatra`
                : `${selectedNakshatraObj?.telugu} నక్షత్రం`}
            </p>

            <p className="text-sm font-telugu mt-2 text-amber-100/90 leading-relaxed">
              {language === 'en'
                ? ENGLISH_TARA_DESCRIPTIONS[taraResult.taraNumber] || taraResult.description
                : taraResult.description}
            </p>
          </div>
        </div>

        {/* Guruji Consultation Note */}
        <div className="mt-8 pt-6 border-t border-amber-700/60 text-center font-telugu text-sm text-amber-200">
          <p>
            {t(
              'ముఖ్యమైన కార్యాలకు లగ్న శుద్ధి, గురు-శుక్రుల స్థితిని కూడా పరిశీలించడం అవసరం. మరింత స్పష్టత కొరకు శ్రీ ధీరజ్ శర్మ గారిని సంప్రదించండి.',
              'For major ceremonies, Lagna Shuddhi and Jupiter-Venus strength must also be examined. Contact Sri Dheeraj Sharma Garu for personalized Muhurtham guidance.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
