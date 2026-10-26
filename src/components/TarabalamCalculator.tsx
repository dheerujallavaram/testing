import React, { useState, useMemo, useEffect } from 'react';
import { Star, Moon, CheckCircle2, AlertTriangle, Sparkles, Compass } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface TarabalamCalculatorProps {
  day: DayData;
}

interface NakshatraItem {
  index: number; // 1..27
  te: string;
  en: string;
  lordTe: string;
  lordEn: string;
}

export const NAKSHATRA_27_LIST: NakshatraItem[] = [
  { index: 1, te: 'అశ్విని', en: 'Ashwini', lordTe: 'కేతువు', lordEn: 'Ketu' },
  { index: 2, te: 'భరణి', en: 'Bharani', lordTe: 'శుక్రుడు', lordEn: 'Venus' },
  { index: 3, te: 'కృత్తిక', en: 'Krittika', lordTe: 'సూర్యుడు', lordEn: 'Sun' },
  { index: 4, te: 'రోహిణి', en: 'Rohini', lordTe: 'చంద్రుడు', lordEn: 'Moon' },
  { index: 5, te: 'మృగశిర', en: 'Mrigashira', lordTe: 'కుజుడు', lordEn: 'Mars' },
  { index: 6, te: 'ఆరుద్ర', en: 'Ardra', lordTe: 'రాహువు', lordEn: 'Rahu' },
  { index: 7, te: 'పునర్వసు', en: 'Punarvasu', lordTe: 'గురుడు', lordEn: 'Jupiter' },
  { index: 8, te: 'పుష్యమి', en: 'Pushyami', lordTe: 'శని', lordEn: 'Saturn' },
  { index: 9, te: 'ఆశ్లేష', en: 'Ashlesha', lordTe: 'బుధుడు', lordEn: 'Mercury' },
  { index: 10, te: 'మఖ', en: 'Magha', lordTe: 'కేతువు', lordEn: 'Ketu' },
  { index: 11, te: 'పుబ్బ', en: 'Pubba (Purva Phalguni)', lordTe: 'శుక్రుడు', lordEn: 'Venus' },
  { index: 12, te: 'ఉత్తర', en: 'Uttara (Uttara Phalguni)', lordTe: 'సూర్యుడు', lordEn: 'Sun' },
  { index: 13, te: 'హస్త', en: 'Hasta', lordTe: 'చంద్రుడు', lordEn: 'Moon' },
  { index: 14, te: 'చిత్త', en: 'Chitta', lordTe: 'కుజుడు', lordEn: 'Mars' },
  { index: 15, te: 'స్వాతి', en: 'Swati', lordTe: 'రాహువు', lordEn: 'Rahu' },
  { index: 16, te: 'విశాఖ', en: 'Vishakha', lordTe: 'గురుడు', lordEn: 'Jupiter' },
  { index: 17, te: 'అనురాధ', en: 'Anuradha', lordTe: 'శని', lordEn: 'Saturn' },
  { index: 18, te: 'జ్యేష్ఠ', en: 'Jyeshtha', lordTe: 'బుధుడు', lordEn: 'Mercury' },
  { index: 19, te: 'మూల', en: 'Moola', lordTe: 'కేతువు', lordEn: 'Ketu' },
  { index: 20, te: 'పూర్వాషాఢ', en: 'Purvashadha', lordTe: 'శుక్రుడు', lordEn: 'Venus' },
  { index: 21, te: 'ఉత్తరాషాఢ', en: 'Uttarashadha', lordTe: 'సూర్యుడు', lordEn: 'Sun' },
  { index: 22, te: 'శ్రవణం', en: 'Shravanam', lordTe: 'చంద్రుడు', lordEn: 'Moon' },
  { index: 23, te: 'ధనిష్ఠ', en: 'Dhanishtha', lordTe: 'కుజుడు', lordEn: 'Mars' },
  { index: 24, te: 'శతభిషం', en: 'Shatabhisham', lordTe: 'రాహువు', lordEn: 'Rahu' },
  { index: 25, te: 'పూర్వాభాద్ర', en: 'Purvabhadra', lordTe: 'గురుడు', lordEn: 'Jupiter' },
  { index: 26, te: 'ఉత్తరాభాద్ర', en: 'Uttarabhadra', lordTe: 'శని', lordEn: 'Saturn' },
  { index: 27, te: 'రేవతి', en: 'Revati', lordTe: 'బుధుడు', lordEn: 'Mercury' },
];

export const RASHI_12_LIST = [
  { index: 1, id: 'mesham', te: 'మేష రాశి', en: 'Aries (Mesham)' },
  { index: 2, id: 'vrushabham', te: 'వృషభ రాశి', en: 'Taurus (Vrushabham)' },
  { index: 3, id: 'mithunam', te: 'మిథున రాశి', en: 'Gemini (Mithunam)' },
  { index: 4, id: 'karkatakam', te: 'కర్కాటక రాశి', en: 'Cancer (Karkatakam)' },
  { index: 5, id: 'simham', te: 'సింహ రాశి', en: 'Leo (Simham)' },
  { index: 6, id: 'kanya', te: 'కన్యా రాశి', en: 'Virgo (Kanya)' },
  { index: 7, id: 'tula', te: 'తులా రాశి', en: 'Libra (Tula)' },
  { index: 8, id: 'vruschikam', te: 'వృశ్చిక రాశి', en: 'Scorpio (Vruschikam)' },
  { index: 9, id: 'dhanussu', te: 'ధనుస్సు రాశి', en: 'Sagittarius (Dhanussu)' },
  { index: 10, id: 'makaram', te: 'మకర రాశి', en: 'Capricorn (Makaram)' },
  { index: 11, id: 'kumbham', te: 'కుంభ రాశి', en: 'Aquarius (Kumbham)' },
  { index: 12, id: 'meenam', te: 'మీన రాశి', en: 'Pisces (Meenam)' },
];

interface NavataraInfo {
  taraNum: number; // 1..9
  nameTe: string;
  nameEn: string;
  isGood: boolean;
  verdictTe: string;
  verdictEn: string;
  adviceTe: string;
  adviceEn: string;
}

const NAVATARA_DETAILS: Record<number, NavataraInfo> = {
  1: {
    taraNum: 1,
    nameTe: 'జన్మ తార (Janma Tara)',
    nameEn: 'Janma Tara (1st)',
    isGood: false,
    verdictTe: 'మధ్యమం / శారీరక శ్రమ',
    verdictEn: 'Moderate / Caution',
    adviceTe: 'కొత్త సాహస కార్యాలు వాయిదా వేసి, కులదైవ ప్రార్థనతో దైనందిన పనులు చేసుకోవాలి.',
    adviceEn: 'Avoid risky new ventures; perform routine tasks with prayer.',
  },
  2: {
    taraNum: 2,
    nameTe: 'సంపత్తార (Sampat Tara)',
    nameEn: 'Sampat Tara (2nd)',
    isGood: true,
    verdictTe: 'పరమ శుభం — ధన లాభం',
    verdictEn: 'Supreme Auspicious — Wealth',
    adviceTe: 'ఆర్థిక లావాదేవీలు, బంగారం కొనుగోలు, వ్యాపార ప్రారంభానికి అత్యుత్తమ తారాబలం.',
    adviceEn: 'Highly favorable for investments, purchases, and new agreements.',
  },
  3: {
    taraNum: 3,
    nameTe: 'విపత్తార (Vipat Tara)',
    nameEn: 'Vipat Tara (3rd)',
    isGood: false,
    verdictTe: 'అశుభం — ఆటంకాలు',
    verdictEn: 'Inauspicious — Obstacles',
    adviceTe: 'ముఖ్యమైన ప్రయాణాలు మరియు కొత్త ఒప్పందాలు వాయిదా వేయడం మంచిది. విఘ్నేశ్వర ఆరాధన చేయండి.',
    adviceEn: 'Postpone major travel or contracts; worship Lord Ganesha.',
  },
  4: {
    taraNum: 4,
    nameTe: 'క్షేమ తార (Kshema Tara)',
    nameEn: 'Kshema Tara (4th)',
    isGood: true,
    verdictTe: 'శుభప్రదం — క్షేమం & ఆరోగ్యం',
    verdictEn: 'Auspicious — Well-being',
    adviceTe: 'గృహ నిర్మాణం, ఆరోగ్య కార్యాలు, కుటుంబ శుభకార్యాలు చేపట్టడానికి శుభ తారాబలం.',
    adviceEn: 'Excellent for family events, property work, and safe travel.',
  },
  5: {
    taraNum: 5,
    nameTe: 'ప్రత్యక్ తార (Pratyak Tara)',
    nameEn: 'Pratyak Tara (5th)',
    isGood: false,
    verdictTe: 'సామాన్యం — కార్య ఆలస్యం',
    verdictEn: 'Delays in New Tasks',
    adviceTe: 'నూతన ప్రారంభానికి అనుకూలం కాదు; పెండింగ్‌లో ఉన్న పనులు పూర్తి చేయడానికి అనుకూలం.',
    adviceEn: 'Avoid new launches; focus on completing pending work patiently.',
  },
  6: {
    taraNum: 6,
    nameTe: 'సాధక తార (Sadhaka Tara)',
    nameEn: 'Sadhaka Tara (6th)',
    isGood: true,
    verdictTe: 'పరమ శుభం — కార్య సిద్ధి',
    verdictEn: 'Supreme Success & Victory',
    adviceTe: 'ఉద్యోగ ప్రయత్నాలు, పోటీ పరీక్షలు, కోర్టు పనులు మరియు నూతన వ్యాపారాలకు విశేష జయం.',
    adviceEn: 'Brings victory in career interviews, legal matters, and major goals.',
  },
  7: {
    taraNum: 7,
    nameTe: 'నైధన తార (Naidhana Tara)',
    nameEn: 'Naidhana Tara (7th)',
    isGood: false,
    verdictTe: 'అశుభం — వర్జించవలెను',
    verdictEn: 'Inauspicious — Avoid',
    adviceTe: 'ఈ రోజు శుభకార్యాలు, పెద్ద మొత్తంలో పెట్టుబడులు పెట్టరాదు. మృత్యుంజయ జపం శుభప్రదం.',
    adviceEn: 'Strictly avoid auspicious ceremonies or big risks today.',
  },
  8: {
    taraNum: 8,
    nameTe: 'మిత్ర తార (Mitra Tara)',
    nameEn: 'Mitra Tara (8th)',
    isGood: true,
    verdictTe: 'శుభప్రదం — మిత్ర సహకారం',
    verdictEn: 'Auspicious — Support',
    adviceTe: 'భాగస్వామ్య వ్యాపారాలు, వివాహ చర్చలు మరియు అధికారులను కలవడానికి అనుకూల సమయం.',
    adviceEn: 'Favorable for partnerships, marriage discussions, and networking.',
  },
  9: {
    taraNum: 9,
    nameTe: 'పరమ మిత్ర తార (Parama Mitra Tara)',
    nameEn: 'Parama Mitra Tara (9th)',
    isGood: true,
    verdictTe: 'పరమ శుభం — సర్వ కార్య జయం',
    verdictEn: 'Supreme Auspicious',
    adviceTe: 'అన్ని రకాల శుభకార్యాలు, ప్రయాణాలు మరియు నూతన కార్యక్రమాలకు సంపూర్ణ అనుకూలం.',
    adviceEn: 'Ideal for all auspicious ceremonies, long journeys, and investments.',
  },
};

function detectDayNakshatraIndex(day: DayData): number {
  const raw = day.panchanga.nakshatram;
  for (const item of NAKSHATRA_27_LIST) {
    if (raw.includes(item.te)) return item.index;
  }
  if (raw.includes('ఉత్తర ఫల్గుణి')) return 12;
  if (raw.includes('పూర్వ ఫల్గుణి')) return 11;
  if (raw.includes('ఉత్తరాషాడ')) return 21;
  if (raw.includes('పూర్వాషాడ')) return 20;
  return 1;
}

function detectDayMoonRashiIndex(day: DayData): number {
  const entries = Object.entries(day.grahaStithi) as [string, string][];
  for (const [rashiKey, planets] of entries) {
    if (planets && planets.includes('చంద్రుడు')) {
      const found = RASHI_12_LIST.find((r) => r.id === rashiKey);
      if (found) return found.index;
    }
  }
  return 1;
}

export const TarabalamCalculator: React.FC<TarabalamCalculatorProps> = ({ day }) => {
  const { t, tr } = useLanguage();

  const [birthNakshatraIdx, setBirthNakshatraIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tj_birth_nakshatra');
      return saved ? Number(saved) || 1 : 4; // Default Rohini
    } catch {
      return 4;
    }
  });

  const [birthRashiIdx, setBirthRashiIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tj_birth_rashi');
      return saved ? Number(saved) || 2 : 2; // Default Vrushabham
    } catch {
      return 2;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tj_birth_nakshatra', String(birthNakshatraIdx));
      localStorage.setItem('tj_birth_rashi', String(birthRashiIdx));
    } catch {}
  }, [birthNakshatraIdx, birthRashiIdx]);

  const todayNakshatraIdx = useMemo(() => detectDayNakshatraIndex(day), [day]);
  const todayMoonRashiIdx = useMemo(() => detectDayMoonRashiIndex(day), [day]);

  const todayNakshatraObj = NAKSHATRA_27_LIST.find((n) => n.index === todayNakshatraIdx) || NAKSHATRA_27_LIST[0];
  const todayMoonRashiObj = RASHI_12_LIST.find((r) => r.index === todayMoonRashiIdx) || RASHI_12_LIST[0];

  const birthNakshatraObj = NAKSHATRA_27_LIST.find((n) => n.index === birthNakshatraIdx) || NAKSHATRA_27_LIST[0];
  const birthRashiObj = RASHI_12_LIST.find((r) => r.index === birthRashiIdx) || RASHI_12_LIST[0];

  // Tarabalam formula: count from Birth Nakshatra to Today's Nakshatra inclusive
  const distance = ((todayNakshatraIdx - birthNakshatraIdx + 27) % 27) + 1;
  const taraRemainder = ((distance - 1) % 9) + 1;
  const navatara = NAVATARA_DETAILS[taraRemainder];
  const paryayam = Math.ceil(distance / 9); // 1st, 2nd, or 3rd cycle of 9

  // Chandrabalam formula: count from Birth Rashi to Today's Moon Rashi inclusive
  const chandraHouse = ((todayMoonRashiIdx - birthRashiIdx + 12) % 12) + 1;
  const isGoodChandra = [1, 3, 6, 7, 10, 11].includes(chandraHouse);
  const isChandrashtamam = chandraHouse === 8;

  return (
    <div className="space-y-8 font-telugu">
      {/* Top Interactive Calculator Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm">
        <div className="border-b border-amber-100 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
              {t('దృక్సిద్ధాంత నవతార & గోచార చంద్ర గణన', 'Personal Navatara & Transit Moon Calculator')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
              {t('నేటి తారాబలం & చంద్రబలం క్యాలిక్యులేటర్', 'Daily Tarabalam & Chandrabalam Calculator')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {tr(day.teediVaram)} · {t('నేటి నక్షత్రం:', "Today's Star:")}{' '}
              <strong className="text-amber-900">{t(todayNakshatraObj.te, todayNakshatraObj.en)}</strong> ·{' '}
              {t('చంద్ర సంచార రాశి:', 'Transit Moon:')}{' '}
              <strong className="text-amber-900">{t(todayMoonRashiObj.te, todayMoonRashiObj.en)}</strong>
            </p>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid sm:grid-cols-2 gap-5 bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80">
          <div>
            <label htmlFor="birth-nakshatra-select" className="block text-sm font-bold text-amber-950 mb-2">
              {t('1. మీ జన్మ నక్షత్రం ఎంచుకోండి (Select Your Birth Star):', '1. Select Your Birth Nakshatra:')}
            </label>
            <select
              id="birth-nakshatra-select"
              value={birthNakshatraIdx}
              onChange={(e) => setBirthNakshatraIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-base font-bold text-slate-900 shadow-2xs focus:border-amber-600 focus:outline-none"
            >
              {NAKSHATRA_27_LIST.map((n) => (
                <option key={n.index} value={n.index}>
                  {n.index}. {n.te} ({n.en}) — {n.lordTe}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="birth-rashi-select" className="block text-sm font-bold text-amber-950 mb-2">
              {t('2. మీ జన్మ రాశి ఎంచుకోండి (Select Your Moon Sign):', '2. Select Your Birth Rashi:')}
            </label>
            <select
              id="birth-rashi-select"
              value={birthRashiIdx}
              onChange={(e) => setBirthRashiIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-base font-bold text-slate-900 shadow-2xs focus:border-amber-600 focus:outline-none"
            >
              {RASHI_12_LIST.map((r) => (
                <option key={r.index} value={r.index}>
                  {r.index}. {r.te} ({r.en})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Cards: Tarabalam & Chandrabalam */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Card 1: Tarabalam Result */}
          <div
            className={`rounded-2xl p-6 border ${
              navatara.isGood
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-rose-50/60 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs text-slate-600 mb-2">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900">
                <Star size={14} className="text-amber-600" />
                <span>{t('తారాబలం ఫలితం (Tarabalam)', 'Tarabalam Verdict')}</span>
              </span>
              <span className="font-mono tabular-nums">
                {t(`నక్షత్ర సంఖ్య: ${distance}/27 (${paryayam}వ పర్యాయం)`, `Count: ${distance}/27 (Cycle ${paryayam})`)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 my-2">
              <h3 className="text-2xl font-bold text-slate-900">
                {t(navatara.nameTe, navatara.nameEn)}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                  navatara.isGood ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {navatara.isGood ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <span>{t(navatara.verdictTe, navatara.verdictEn)}</span>
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              <strong>{t(birthNakshatraObj.te, birthNakshatraObj.en)}</strong>{' '}
              {t('నక్షత్రం వారికి ఈ రోజు', 'star natives have')}{' '}
              <strong>{t(todayNakshatraObj.te, todayNakshatraObj.en)}</strong>{' '}
              {t('నక్షత్రం వల్ల', 'today resulting in')} <strong>{t(navatara.nameTe, navatara.nameEn)}</strong>.{' '}
              {t(navatara.adviceTe, navatara.adviceEn)}
            </p>
          </div>

          {/* Card 2: Chandrabalam Result */}
          <div
            className={`rounded-2xl p-6 border ${
              isGoodChandra
                ? 'bg-emerald-50/60 border-emerald-300'
                : isChandrashtamam
                ? 'bg-rose-50/60 border-rose-300'
                : 'bg-amber-50/70 border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs text-slate-600 mb-2">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900">
                <Moon size={14} className="text-amber-600" />
                <span>{t('చంద్రబలం ఫలితం (Chandrabalam)', 'Chandrabalam Verdict')}</span>
              </span>
              <span className="font-mono tabular-nums">
                {t(`చంద్ర స్థానం: ${chandraHouse}వ ఇల్లు`, `Transit House: ${chandraHouse}/12`)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 my-2">
              <h3 className="text-2xl font-bold text-slate-900">
                {isGoodChandra
                  ? t(`శుభ చంద్రబలం (${chandraHouse}వ స్థానం)`, `Auspicious Moon (${chandraHouse}th House)`)
                  : isChandrashtamam
                  ? t('చంద్రాష్టమం (8వ స్థానం — జాగ్రత్త)', 'Chandrashtamam (8th House)')
                  : t(`మధ్యమ చంద్రబలం (${chandraHouse}వ స్థానం)`, `Moderate Moon (${chandraHouse}th House)`)}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                  isGoodChandra
                    ? 'text-emerald-800'
                    : isChandrashtamam
                    ? 'text-rose-800'
                    : 'text-amber-900'
                }`}
              >
                {isGoodChandra ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <span>
                  {isGoodChandra
                    ? t('అనుకూలం (Favorable)', 'Favorable')
                    : isChandrashtamam
                    ? t('వాయిదా వేయండి (Avoid)', 'Exercise Caution')
                    : t('తారాబలంతో శుభం', 'Check Tarabalam')}
                </span>
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              {isGoodChandra
                ? t(
                    `మీ ${birthRashiObj.te} నుండి చంద్రుడు ${chandraHouse}వ స్థానంలో (${todayMoonRashiObj.te}) సంచరిస్తున్నందున మనోబలం, కార్యజయం మరియు ధన లాభం కలుగుతాయి.`,
                    `Transit Moon in the ${chandraHouse}th house (${todayMoonRashiObj.en}) from your ${birthRashiObj.en} brings mental clarity and success.`
                  )
                : isChandrashtamam
                ? t(
                    `మీ ${birthRashiObj.te}కి చంద్రుడు 8వ ఇంట (${todayMoonRashiObj.te}) ఉన్నందున ఈ రోజు చంద్రాష్టమం. ముఖ్యమైన నిర్ణయాలు, ప్రయాణాలు వాయిదా వేసి శివారాధన చేయడం శుభప్రదం.`,
                    `Moon is transiting the 8th house (Chandrashtamam) from ${birthRashiObj.en}. Postpone major decisions and chant Shiva mantras.`
                  )
                : t(
                    `మీ ${birthRashiObj.te} నుండి చంద్రుడు ${chandraHouse}వ స్థానంలో ఉన్నాడు. శుభ తారాబలం ఉన్నందున దైవ ప్రార్థనతో పనులు చేపట్టవచ్చు.`,
                    `Moon is in the ${chandraHouse}th house from ${birthRashiObj.en}. Pair with auspicious Tarabalam or Hora for smooth execution.`
                  )}
            </p>
          </div>
        </div>
      </section>

      {/* Complete 27 Nakshatra Tarabalam Table for Today (SEO & Quick Reference) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm">
        <div className="pb-5 border-b border-amber-100">
          <h3 className="text-xl sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
            <Compass size={20} className="text-amber-700" />
            <span>
              {t(
                `నేటి 27 నక్షత్రాల సంపూర్ణ తారాబలం పట్టిక (${todayNakshatraObj.te} నక్షత్రం రోజున)`,
                `Complete 27 Nakshatra Tarabalam Chart for Today (${todayNakshatraObj.en})`
              )}
            </span>
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {t(
              'ఏ నక్షత్రం వారికి ఈ రోజు సంపత్, క్షేమ, సాధక, మిత్ర, పరమ మిత్ర తారలు ఉన్నాయో ఒకేచోట చూడండి.',
              'Quick reference showing auspicious and caution Taras across all 27 birth stars today.'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6">
          {NAKSHATRA_27_LIST.map((item) => {
            const dist = ((todayNakshatraIdx - item.index + 27) % 27) + 1;
            const rem = ((dist - 1) % 9) + 1;
            const info = NAVATARA_DETAILS[rem];
            const isSelected = item.index === birthNakshatraIdx;
            return (
              <button
                key={item.index}
                type="button"
                onClick={() => setBirthNakshatraIdx(item.index)}
                className={`text-left rounded-2xl p-3.5 border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-amber-100/80 border-amber-600 ring-2 ring-amber-400/50'
                    : info.isGood
                    ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-rose-50/30 border-rose-200 hover:bg-rose-50/60'
                }`}
              >
                <div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 block">
                    #{String(item.index).padStart(2, '0')} · {item.lordTe}
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {t(item.te, item.en)}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold block ${
                      info.isGood ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {t(info.nameTe.split(' (')[0], info.nameEn.split(' (')[0])}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {info.isGood ? t('✅ శుభం', '✅ Good') : t('⚠️ జాగ్రత్త', '⚠️ Caution')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
