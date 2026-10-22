import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { ALL_RASHIS, NAKSHATRAS } from '../data/panchangamData';
import { calculateTaraBalam, checkChandrashtamam } from '../utils/panchangaLogic';

interface DevoteeCompatibilityCheckerProps {
  day: DayData;
}

export const DevoteeCompatibilityChecker: React.FC<DevoteeCompatibilityCheckerProps> = ({ day }) => {
  const [selectedRashiId, setSelectedRashiId] = useState<string>('mesham');
  const [selectedNakshatraIdx, setSelectedNakshatraIdx] = useState<number>(1);

  // Determine current day's nakshatra index
  const dayNakshatraName = day.panchanga.nakshatram.split(' ')[0]; // e.g. "ఉత్తర", "హస్త", "చిత్త", "స్వాతి", "విశాఖ", "అనురాధ"
  const dayNakshatra = NAKSHATRAS.find((n) => n.telugu.includes(dayNakshatraName)) || NAKSHATRAS[11]; // default Uttara Phalguni

  const isChandrashtamam = checkChandrashtamam(selectedRashiId, day);
  const taraResult = calculateTaraBalam(selectedNakshatraIdx, dayNakshatra.index);

  const selectedRashiObj = ALL_RASHIS.find((r) => r.id === selectedRashiId);
  const selectedNakshatraObj = NAKSHATRAS.find((n) => n.index === selectedNakshatraIdx);

  return (
    <div id="compatibility" className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-amber-500/40 my-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs tracking-[0.25em] font-semibold text-amber-300 font-display uppercase">
            Personal Vedic Almanac Checker
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold font-telugu text-white mt-1">
            మీ రాశి & జన్మ నక్షత్ర బలం పరిశీలించండి
          </h3>
          <p className="text-amber-200/90 text-sm sm:text-base font-telugu mt-2 max-w-2xl mx-auto">
            మీ జన్మ రాశి మరియు నక్షత్రాన్ని ఎంచుకుని {day.teediVaram} నాడు మీ తారాబలం మరియు చంద్రాష్టమ గోచార ఫలితాలను తెలుసుకోండి.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {/* Select Rashi */}
          <div className="bg-amber-950/70 border border-amber-600/50 p-4 rounded-xl">
            <label htmlFor="rashi-select" className="block text-xs font-semibold text-amber-300 font-telugu mb-2">
              మీ జన్మ రాశిని ఎంచుకోండి (Select Rashi):
            </label>
            <select
              id="rashi-select"
              value={selectedRashiId}
              onChange={(e) => setSelectedRashiId(e.target.value)}
              className="w-full bg-amber-900 border border-amber-500 text-amber-100 rounded-lg p-2.5 font-telugu font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer"
            >
              {ALL_RASHIS.map((r) => (
                <option key={r.id} value={r.id} className="bg-amber-950 text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Nakshatram */}
          <div className="bg-amber-950/70 border border-amber-600/50 p-4 rounded-xl">
            <label htmlFor="nakshatra-select" className="block text-xs font-semibold text-amber-300 font-telugu mb-2">
              మీ జన్మ నక్షత్రాన్ని ఎంచుకోండి (Select Nakshatram):
            </label>
            <select
              id="nakshatra-select"
              value={selectedNakshatraIdx}
              onChange={(e) => setSelectedNakshatraIdx(parseInt(e.target.value, 10))}
              className="w-full bg-amber-900 border border-amber-500 text-amber-100 rounded-lg p-2.5 font-telugu font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer"
            >
              {NAKSHATRAS.map((n) => (
                <option key={n.index} value={n.index} className="bg-amber-950 text-white">
                  {n.index}. {n.telugu} ({n.english})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Chandrashtamam Box */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isChandrashtamam
                ? 'bg-rose-950/80 border-rose-500 shadow-rose-900/50 shadow-md ring-1 ring-rose-400'
                : 'bg-emerald-950/70 border-emerald-600/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold font-telugu tracking-wider text-amber-300">
                చంద్రాష్టమ స్థితి
              </span>
              {isChandrashtamam ? (
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 bg-rose-600 text-white font-telugu font-bold rounded-full">
                  <AlertTriangle size={12} /> చంద్రాష్టమం ఉంది!
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 bg-emerald-600 text-white font-telugu font-bold rounded-full">
                  <CheckCircle2 size={12} /> సురక్షితం
                </span>
              )}
            </div>

            <p className="text-lg font-bold font-telugu text-white mt-1">
              {selectedRashiObj?.name}
            </p>

            <p className="text-sm font-telugu mt-2 text-amber-100/90 leading-relaxed">
              {isChandrashtamam
                ? 'ఈ రోజు మీ రాశికి చంద్రుడు 8వ స్థానంలో సంచరిస్తున్నాడు. కావున కొత్త ఒప్పందాలు, వివాదాలు, దూర ప్రయాణాలు వాయిదా వేయడం మంచిది. శివారాధన శుభం.'
                : 'ఈ రోజు మీ రాశికి చంద్రాష్టమం లేదు. రోజువారీ పనులు, ప్రయాణాలు సాధారణంగా కొనసాగించవచ్చు.'}
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
                నేటి నవతార బలం
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
                {taraResult.taraName} ({taraResult.isFavorable ? 'అనుకూలం' : 'ప్రతికూలం'})
              </span>
            </div>

            <p className="text-lg font-bold font-telugu text-white mt-1">
              {selectedNakshatraObj?.telugu} నక్షత్రం
            </p>

            <p className="text-sm font-telugu mt-2 text-amber-100/90 leading-relaxed">
              {taraResult.description}
            </p>
          </div>
        </div>

        {/* Guruji Consultation Note */}
        <div className="mt-8 pt-6 border-t border-amber-700/60 text-center font-telugu text-sm text-amber-200">
          <p>
            ముఖ్యమైన కార్యాలకు లగ్న శుద్ధి, గురు-శుక్రుల స్థితిని కూడా పరిశీలించడం అవసరం. మరింత స్పష్టత కొరకు గురుజీని సంప్రదించండి.
          </p>
        </div>
      </div>
    </div>
  );
};
