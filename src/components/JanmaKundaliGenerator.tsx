import React, { useState, useMemo } from 'react';
import { Sparkles, Calendar, Clock, MapPin, User, MessageCircle, Compass, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface JanmaKundaliGeneratorProps {
  onOpenBooking?: () => void;
}

interface DashaLordConfig {
  lordTe: string;
  lordEn: string;
  years: number;
  summaryTe: string;
  summaryEn: string;
}

const VIMSHOTTARI_DASHA_CYCLE: DashaLordConfig[] = [
  { lordTe: 'కేతు మహాదశ', lordEn: 'Ketu Mahadasha', years: 7, summaryTe: 'ఆధ్యాత్మిక చింతన, తీర్థయాత్రలు, వైరాగ్యం మరియు అంతర్దృష్టి పెరుగుతాయి.', summaryEn: 'Spiritual awakening, pilgrimages, detachment, and deep intuition.' },
  { lordTe: 'శుక్ర మహాదశ', lordEn: 'Shukra (Venus) Mahadasha', years: 20, summaryTe: 'వివాహ సౌఖ్యం, గృహ-వాహన ప్రాప్తి, ఆభరణాలు, ఆర్థిక సమృద్ధి మరియు కళాభివృద్ధి.', summaryEn: 'Marriage harmony, new home/vehicles, wealth, luxury, and artistic success.' },
  { lordTe: 'రవి (సూర్య) మహాదశ', lordEn: 'Surya (Sun) Mahadasha', years: 6, summaryTe: 'ఉద్యోగంలో అధికార ప్రాప్తి, ప్రభుత్వ గౌరవం, నాయకత్వ లక్షణాలు, పితృ వర్గ సహకారం.', summaryEn: 'Authority in career, government recognition, and leadership growth.' },
  { lordTe: 'చంద్ర మహాదశ', lordEn: 'Chandra (Moon) Mahadasha', years: 10, summaryTe: 'మనశ్శాంతి, మాతృ సౌఖ్యం, విదేశీ ప్రయాణాలు, వ్యాపార విస్తరణ మరియు శుభకార్యాలు.', summaryEn: 'Mental peace, maternal blessings, travel, and family celebrations.' },
  { lordTe: 'కుజ మహాదశ', lordEn: 'Kuja (Mars) Mahadasha', years: 7, summaryTe: 'భూ-గృహ లాభం, ధైర్య సాహసాలు, సోదర సహకారం; కుజ శాంతితో విశేష కార్యజయం.', summaryEn: 'Real estate gains, courage, technical breakthroughs, and energy.' },
  { lordTe: 'రాహు మహాదశ', lordEn: 'Rahu Mahadasha', years: 18, summaryTe: 'ఆకస్మిక ఆర్థిక ఉన్నతి, విదేశీ అవకాశాలు, నూతన సాంకేతిక రంగాలలో పురోగతి; దుర్గా ఆరాధన శుభం.', summaryEn: 'Sudden elevation, foreign opportunities, technology career growth.' },
  { lordTe: 'గురు మహాదశ', lordEn: 'Guru (Jupiter) Mahadasha', years: 16, summaryTe: 'సంతాన ప్రాప్తి, ధర్మ కార్యాలు, ఉన్నత విద్య, సమాజంలో గౌరవ మర్యాదలు మరియు ధన లాభం.', summaryEn: 'Blessings of children, higher wisdom, wealth, and social honor.' },
  { lordTe: 'శని మహాదశ', lordEn: 'Shani (Saturn) Mahadasha', years: 19, summaryTe: 'కఠిన శ్రమకు తగిన స్థిరమైన ఫలితాలు, భూమి/పరిశ్రమల ద్వారా లాభం, దీర్ఘకాలిక విజయం.', summaryEn: 'Enduring success through discipline, industry, and perseverance.' },
  { lordTe: 'బుధ మహాదశ', lordEn: 'Budha (Mercury) Mahadasha', years: 17, summaryTe: 'వ్యాపార లాభాలు, వాక్చాతుర్యం, విద్యా విజయాలు, బంధుమిత్రుల సహకారం మరియు ఆర్థిక వృద్ధి.', summaryEn: 'Business prosperity, communication excellence, academic and financial gains.' },
];

const NAKSHATRA_27 = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష',
  'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనురాధ', 'జ్యేష్ఠ',
  'మూల', 'పూర్వాషాఢ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి'
];

const RASHI_12 = [
  { id: 'mesham', te: 'మేషం', en: 'Aries', lord: 'కుజుడు (Mars)' },
  { id: 'vrushabham', te: 'వృషభం', en: 'Taurus', lord: 'శుక్రుడు (Venus)' },
  { id: 'mithunam', te: 'మిథునం', en: 'Gemini', lord: 'బుధుడు (Mercury)' },
  { id: 'karkatakam', te: 'కర్కాటకం', en: 'Cancer', lord: 'చంద్రుడు (Moon)' },
  { id: 'simham', te: 'సింహం', en: 'Leo', lord: 'సూర్యుడు (Sun)' },
  { id: 'kanya', te: 'కన్య', en: 'Virgo', lord: 'బుధుడు (Mercury)' },
  { id: 'tula', te: 'తుల', en: 'Libra', lord: 'శుక్రుడు (Venus)' },
  { id: 'vruschikam', te: 'వృశ్చికం', en: 'Scorpio', lord: 'కుజుడు (Mars)' },
  { id: 'dhanussu', te: 'ధనుస్సు', en: 'Sagittarius', lord: 'గురుడు (Jupiter)' },
  { id: 'makaram', te: 'మకరం', en: 'Capricorn', lord: 'శని (Saturn)' },
  { id: 'kumbham', te: 'కుంభం', en: 'Aquarius', lord: 'శని (Saturn)' },
  { id: 'meenam', te: 'మీనం', en: 'Pisces', lord: 'గురుడు (Jupiter)' },
];

// South Indian 4x4 grid mapping: [row, col, rashiIndex (0..11)]
const SOUTH_INDIAN_CELLS: { row: number; col: number; rashiIdx: number }[] = [
  { row: 0, col: 0, rashiIdx: 11 }, // మీనం
  { row: 0, col: 1, rashiIdx: 0 },  // మేషం
  { row: 0, col: 2, rashiIdx: 1 },  // వృషభం
  { row: 0, col: 3, rashiIdx: 2 },  // మిథునం
  { row: 1, col: 3, rashiIdx: 3 },  // కర్కాటకం
  { row: 2, col: 3, rashiIdx: 4 },  // సింహం
  { row: 3, col: 3, rashiIdx: 5 },  // కన్య
  { row: 3, col: 2, rashiIdx: 6 },  // తుల
  { row: 3, col: 1, rashiIdx: 7 },  // వృశ్చికం
  { row: 3, col: 0, rashiIdx: 8 },  // ధనుస్సు
  { row: 2, col: 0, rashiIdx: 9 },  // మకరం
  { row: 1, col: 0, rashiIdx: 10 }, // కుంభం
];

export const JanmaKundaliGenerator: React.FC<JanmaKundaliGeneratorProps> = () => {
  const { t } = useLanguage();
  const [name, setName] = useState<string>('శ్రీనివాస రావు');
  const [birthDate, setBirthDate] = useState<string>('1994-08-15');
  const [birthTime, setBirthTime] = useState<string>('09:30');
  const [birthPlace, setBirthPlace] = useState<string>('హైదరాబాద్ (Hyderabad)');

  // Astronomical sidereal approximation from Birth Date & Time (Lahiri Ayanamsa ~24 deg)
  const chartData = useMemo(() => {
    const [yStr, mStr, dStr] = birthDate.split('-');
    const [hrStr, minStr] = birthTime.split(':');
    const year = Number(yStr) || 1994;
    const month = Number(mStr) || 8;
    const day = Number(dStr) || 15;
    const hour = Number(hrStr) || 9;
    const minute = Number(minStr) || 30;

    // Days since J2000.0 (2000-01-01 12:00 UTC)
    const utcDate = Date.UTC(year, month - 1, day, hour, minute) - 5.5 * 3600 * 1000;
    const j2000 = Date.UTC(2000, 0, 1, 12, 0);
    const daysSinceJ2000 = (utcDate - j2000) / (1000 * 86400);

    // Sidereal Sun Longitude (0..360)
    const sunTrop = (280.46 + 0.9856474 * daysSinceJ2000) % 360;
    const sunSid = ((sunTrop - 23.85) % 360 + 360) % 360;

    // Sidereal Moon Longitude (0..360)
    const moonTrop = (218.316 + 13.176396 * daysSinceJ2000) % 360;
    const moonSid = ((moonTrop - 23.85) % 360 + 360) % 360;

    // Nakshatra (0..26) & Pada (1..4)
    const nakshatraSpan = 360 / 27; // 13.3333 deg
    const nakshatraIdx = Math.floor(moonSid / nakshatraSpan) % 27;
    const degInNakshatra = moonSid - nakshatraIdx * nakshatraSpan;
    const pada = Math.min(4, Math.floor(degInNakshatra / (nakshatraSpan / 4)) + 1);
    const balanceFraction = 1 - degInNakshatra / nakshatraSpan;

    // Rashi (0..11)
    const rashiIdx = Math.floor(moonSid / 30) % 12;
    const sunRashiIdx = Math.floor(sunSid / 30) % 12;

    // Lagna (Ascendant) based on Sunrise (~6:00 AM) + 2 hours per Rashi
    const minutesAfterSunrise = ((hour * 60 + minute - 360) + 1440) % 1440;
    const lagnaOffset = Math.floor(minutesAfterSunrise / 120);
    const lagnaRashiIdx = (sunRashiIdx + lagnaOffset) % 12;

    // Planetary Rashi positions (0..11)
    const kujaIdx = Math.floor(((355.45 + 0.52402 * daysSinceJ2000 - 23.85) % 360 + 360) % 360 / 30) % 12;
    const budhaIdx = Math.floor(((sunSid + 14 * Math.sin(daysSinceJ2000 * 0.05)) + 360) % 360 / 30) % 12;
    const guruIdx = Math.floor(((34.35 + 0.083085 * daysSinceJ2000 - 23.85) % 360 + 360) % 360 / 30) % 12;
    const shukraIdx = Math.floor(((sunSid + 28 * Math.cos(daysSinceJ2000 * 0.03)) + 360) % 360 / 30) % 12;
    const shaniIdx = Math.floor(((50.08 + 0.03346 * daysSinceJ2000 - 23.85) % 360 + 360) % 360 / 30) % 12;
    const rahuIdx = Math.floor(((125.04 - 0.05295 * daysSinceJ2000 - 23.85) % 360 + 360) % 360 / 30) % 12;
    const ketuIdx = (rahuIdx + 6) % 12;

    const rashiPlanets: Record<number, string[]> = {};
    for (let i = 0; i < 12; i++) rashiPlanets[i] = [];
    rashiPlanets[lagnaRashiIdx].push('లగ్నం');
    rashiPlanets[sunRashiIdx].push('సూర్యుడు');
    rashiPlanets[rashiIdx].push('చంద్రుడు');
    rashiPlanets[kujaIdx].push('కుజుడు');
    rashiPlanets[budhaIdx].push('బుధుడు');
    rashiPlanets[guruIdx].push('గురుడు');
    rashiPlanets[shukraIdx].push('శుక్రుడు');
    rashiPlanets[shaniIdx].push('శని');
    rashiPlanets[rahuIdx].push('రాహువు');
    rashiPlanets[ketuIdx].push('కేతువు');

    // Vimshottari Mahadasha timeline
    const startDashaIdx = nakshatraIdx % 9;
    const currentYear = new Date().getFullYear();
    let cursorYear = year;
    const dashaList = Array.from({ length: 9 }, (_, i) => {
      const cfg = VIMSHOTTARI_DASHA_CYCLE[(startDashaIdx + i) % 9];
      const duration = i === 0 ? Math.max(1, Math.round(cfg.years * balanceFraction)) : cfg.years;
      const startY = cursorYear;
      const endY = cursorYear + duration;
      cursorYear = endY;
      const isCurrent = currentYear >= startY && currentYear < endY;
      return {
        ...cfg,
        startYear: startY,
        endYear: endY,
        duration,
        isCurrent,
      };
    });

    return {
      nakshatraName: NAKSHATRA_27[nakshatraIdx],
      nakshatraIdx: nakshatraIdx + 1,
      pada,
      rashi: RASHI_12[rashiIdx],
      lagna: RASHI_12[lagnaRashiIdx],
      rashiPlanets,
      dashaList,
    };
  }, [birthDate, birthTime]);

  const activeDasha = chartData.dashaList.find((d) => d.isCurrent) || chartData.dashaList[0];

  const whatsappConsultUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ సిద్ధాంతి గారు, నా జన్మ కుండలి వివరాలు:\nపేరు: ${name}\nపుట్టిన తేదీ: ${birthDate}\nసమయం: ${birthTime}\nప్రాంతం: ${birthPlace}\nజన్మ రాశి: ${chartData.rashi.te}\nజన్మ నక్షత్రం: ${chartData.nakshatraName} (${chartData.pada}వ పాదం)\nలగ్నం: ${chartData.lagna.te}\nప్రస్తుత మహాదశ: ${activeDasha.lordTe}.\nసంపూర్ణ జాతక పరిశీలన మరియు పరిహారాల కోసం సంప్రదిస్తున్నాను.`
  )}`;

  return (
    <div className="space-y-8 font-telugu">
      {/* Birth Details Form */}
      <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 border border-amber-200/90">
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
            {t('ఉచిత తెలుగు జన్మ కుండలి & వింశోత్తరి మహాదశ క్యాలిక్యులేటర్', 'Free Telugu Janma Kundali & Vimshottari Mahadasha Calculator')}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {t(
              'మీ పుట్టిన తేదీ, సమయం మరియు ప్రాంతాన్ని నమోదు చేసి దక్షిణ భారత రాశి చక్రం, లగ్నం మరియు 120 ఏళ్ల మహాదశ ఫలితాలను వెంటనే చూడండి.',
              'Enter your birth date, time, and place to generate your South Indian Rashi Chart, Ascendant, and 120-year Mahadasha timeline.'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="kundali-name" className="block text-xs font-bold text-amber-950 mb-1.5 flex items-center gap-1">
              <User size={13} />
              <span>{t('పేరు (Full Name):', 'Full Name:')}</span>
            </label>
            <input
              id="kundali-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="kundali-date" className="block text-xs font-bold text-amber-950 mb-1.5 flex items-center gap-1">
              <Calendar size={13} />
              <span>{t('పుట్టిన తేదీ (Date of Birth):', 'Date of Birth:')}</span>
            </label>
            <input
              id="kundali-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="kundali-time" className="block text-xs font-bold text-amber-950 mb-1.5 flex items-center gap-1">
              <Clock size={13} />
              <span>{t('పుట్టిన సమయం (Time of Birth):', 'Time of Birth:')}</span>
            </label>
            <input
              id="kundali-time"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="kundali-place" className="block text-xs font-bold text-amber-950 mb-1.5 flex items-center gap-1">
              <MapPin size={13} />
              <span>{t('పుట్టిన ఊరు (Birth Place):', 'Place of Birth:')}</span>
            </label>
            <input
              id="kundali-place"
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-amber-200">
          <span className="text-xs text-slate-500 block">{t('జన్మ రాశి (Moon Sign)', 'Janma Rashi')}</span>
          <strong className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5 block">
            {chartData.rashi.te} ({chartData.rashi.en})
          </strong>
          <span className="text-xs text-amber-800">{t('రాశ్యాధిపతి:', 'Lord:')} {chartData.rashi.lord}</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200">
          <span className="text-xs text-slate-500 block">{t('జన్మ నక్షత్రం & పాదం', 'Birth Nakshatra & Pada')}</span>
          <strong className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5 block">
            {chartData.nakshatraName} — {chartData.pada}వ పాదం
          </strong>
          <span className="text-xs text-amber-800">{t(`నక్షత్ర సంఖ్య: #${chartData.nakshatraIdx}/27`, `Star #${chartData.nakshatraIdx}/27`)}</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200">
          <span className="text-xs text-slate-500 block">{t('జన్మ లగ్నం (Ascendant)', 'Janma Lagnam')}</span>
          <strong className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5 block">
            {chartData.lagna.te} లగ్నం
          </strong>
          <span className="text-xs text-amber-800">{t('లగ్నాధిపతి:', 'Lagna Lord:')} {chartData.lagna.lord}</span>
        </div>

        <div className="bg-amber-950 text-white rounded-2xl p-4 border border-amber-700">
          <span className="text-xs text-amber-300 block">{t('ప్రస్తుత మహాదశ (Running Dasha)', 'Current Mahadasha')}</span>
          <strong className="text-lg sm:text-xl font-bold text-amber-300 mt-0.5 block">
            {activeDasha.lordTe}
          </strong>
          <span className="text-xs font-mono tabular-nums text-amber-100">
            {activeDasha.startYear} – {activeDasha.endYear}
          </span>
        </div>
      </div>

      {/* 2-Column Split: South Indian 4x4 Rashi Chakram & 120-Year Vimshottari Mahadasha Table */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: South Indian 4x4 Square Rashi Chakram */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-2xs">
          <h4 className="text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
            <Compass size={18} className="text-amber-700" />
            <span>{t('దక్షిణ భారత జన్మ రాశి చక్రం (South Indian Rashi Chart)', 'South Indian Rashi Kundali Chart')}</span>
          </h4>

          <div className="grid grid-cols-4 grid-rows-4 gap-1.5 bg-amber-900 p-2 rounded-2xl aspect-square max-w-md mx-auto">
            {Array.from({ length: 16 }, (_, cellIndex) => {
              const r = Math.floor(cellIndex / 4);
              const c = cellIndex % 4;

              // Center 2x2 merge cell
              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 bg-amber-950 text-amber-100 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-amber-600/80"
                  >
                    <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold">
                      శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం
                    </span>
                    <strong className="text-base sm:text-lg font-bold text-white mt-1">
                      జన్మ కుండలి
                    </strong>
                    <span className="text-xs text-amber-200 mt-1">{name}</span>
                    <span className="text-[11px] font-mono tabular-nums text-amber-300 mt-0.5">
                      {birthDate} · {birthTime}
                    </span>
                    <span className="text-xs text-emerald-300 font-bold mt-1">
                      {chartData.rashi.te} · {chartData.nakshatraName} ({chartData.pada})
                    </span>
                  </div>
                );
              }
              if ((r === 1 && c === 2) || (r === 2 && c === 1) || (r === 2 && c === 2)) {
                return null;
              }

              const foundCell = SOUTH_INDIAN_CELLS.find((sc) => sc.row === r && sc.col === c);
              if (!foundCell) return null;

              const rashiInfo = RASHI_12[foundCell.rashiIdx];
              const planets = chartData.rashiPlanets[foundCell.rashiIdx] || [];
              const isLagna = foundCell.rashiIdx === RASHI_12.findIndex((x) => x.id === chartData.lagna.id);
              const isJanmaRashi = foundCell.rashiIdx === RASHI_12.findIndex((x) => x.id === chartData.rashi.id);

              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-xl p-2 flex flex-col justify-between border ${
                    isLagna
                      ? 'bg-amber-100 border-amber-500'
                      : isJanmaRashi
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-amber-50/95 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] sm:text-xs font-bold text-amber-900/80">
                      {rashiInfo.te}
                    </span>
                    {isLagna && (
                      <span className="text-[9px] font-bold text-amber-950 underline">లగ్నం</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 my-auto pt-1">
                    {planets.map((pl) => (
                      <span
                        key={pl}
                        className={`text-[10px] sm:text-xs font-bold leading-tight ${
                          pl === 'లగ్నం'
                            ? 'text-rose-800'
                            : pl === 'చంద్రుడు'
                            ? 'text-emerald-900'
                            : 'text-slate-900'
                        }`}
                      >
                        {pl}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 120-Year Vimshottari Mahadasha Breakdown */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-2xs space-y-4">
          <div>
            <h4 className="text-lg font-bold text-amber-950 flex items-center gap-2">
              <Star size={18} className="text-amber-700" />
              <span>{t('వింశోత్తరి మహాదశ కాలచక్రం (Vimshottari Mahadasha Periods)', 'Vimshottari Mahadasha Timeline')}</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {t(
                `${chartData.nakshatraName} నక్షత్రం ఆధారంగా మీ జీవితంలోని నవగ్రహ మహాదశల వరుస క్రమం:`,
                `Sequence of planetary Mahadasha periods calculated from ${chartData.nakshatraName}:`
              )}
            </p>
          </div>

          <div className="divide-y divide-amber-100 border border-amber-200 rounded-2xl overflow-hidden">
            {chartData.dashaList.map((d) => (
              <div
                key={d.lordTe}
                className={`p-3.5 transition-colors ${
                  d.isCurrent ? 'bg-amber-100/80' : 'bg-white hover:bg-amber-50/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm sm:text-base font-bold text-amber-950">
                      {t(d.lordTe, d.lordEn)}
                    </strong>
                    {d.isCurrent && (
                      <span className="text-xs font-bold text-emerald-800">
                        · {t('ప్రస్తుతం నడుస్తున్న దశ', 'Active Now')}
                      </span>
                    )}
                  </div>
                  <span className="font-mono tabular-nums text-xs sm:text-sm font-bold text-amber-900">
                    {d.startYear} – {d.endYear} ({d.duration}y)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t(d.summaryTe, d.summaryEn)}
                </p>
              </div>
            ))}
          </div>

          <a
            href={whatsappConsultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-colors"
          >
            <MessageCircle size={18} />
            <span>
              {t(
                'ఈ జన్మ కుండలిని ధీరజ్ శర్మ గారికి వాట్సాప్ పంపి సంపూర్ణ ఫలితాలు తెలుసుకోండి',
                'Send Kundali to Sri Dheeraj Sharma on WhatsApp for Full Horoscope Reading'
              )}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
