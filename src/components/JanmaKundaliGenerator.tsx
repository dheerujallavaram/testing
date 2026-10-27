import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  MessageCircle,
  Compass,
  Star,
  Table2,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Flame,
  Scale,
  Compass as CompassIcon,
  Printer,
  Gem,
  Layers,
  Download,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { computeAccurateJanmaKundali } from '../utils/astronomyPanchangam';
import {
  generateLagnaCompleteProfile,
  getSunMoonCombination144,
  evaluateMehtaElementalStrengths,
  evaluateMehtaSpecialSutras,
  generateBhavaPredictions,
  generateAll12HousesCompleteAnalysis,
  generateBhriguLifeProgression,
  generateVedicRemediesProfile,
} from '../utils/kundaliPredictionsEngine';

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

interface BirthCityConfig {
  id: string;
  labelTe: string;
  labelEn: string;
  lat: number;
  lon: number;
  tz: number;
}

const BIRTH_CITIES: BirthCityConfig[] = [
  { id: 'hyderabad', labelTe: 'హైదరాబాద్ (Hyderabad, TS)', labelEn: 'Hyderabad, Telangana', lat: 17.385, lon: 78.4867, tz: 5.5 },
  { id: 'vijayawada', labelTe: 'విజయవాడ (Vijayawada, AP)', labelEn: 'Vijayawada, AP', lat: 16.5062, lon: 80.648, tz: 5.5 },
  { id: 'visakhapatnam', labelTe: 'విశాఖపట్నం (Visakhapatnam, AP)', labelEn: 'Visakhapatnam, AP', lat: 17.6868, lon: 83.2185, tz: 5.5 },
  { id: 'tirupati', labelTe: 'తిరుపతి (Tirupati, AP)', labelEn: 'Tirupati, AP', lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { id: 'warangal', labelTe: 'వరంగల్ (Warangal, TS)', labelEn: 'Warangal, Telangana', lat: 17.9689, lon: 79.5941, tz: 5.5 },
  { id: 'guntur', labelTe: 'గుంటూరు (Guntur, AP)', labelEn: 'Guntur, AP', lat: 16.3067, lon: 80.4365, tz: 5.5 },
  { id: 'rajahmundry', labelTe: 'రాజమండ్రి (Rajahmundry, AP)', labelEn: 'Rajahmundry, AP', lat: 17.0005, lon: 81.804, tz: 5.5 },
  { id: 'nellore', labelTe: 'నెల్లూరు (Nellore, AP)', labelEn: 'Nellore, AP', lat: 14.4426, lon: 79.9865, tz: 5.5 },
  { id: 'kurnool', labelTe: 'కర్నూలు (Kurnool, AP)', labelEn: 'Kurnool, AP', lat: 15.8281, lon: 78.0373, tz: 5.5 },
  { id: 'karimnagar', labelTe: 'కరీంనగర్ (Karimnagar, TS)', labelEn: 'Karimnagar, Telangana', lat: 18.4386, lon: 79.1288, tz: 5.5 },
  { id: 'nizamabad', labelTe: 'నిజామాబాద్ (Nizamabad, TS)', labelEn: 'Nizamabad, Telangana', lat: 18.6725, lon: 78.0941, tz: 5.5 },
  { id: 'khammam', labelTe: 'ఖమ్మం (Khammam, TS)', labelEn: 'Khammam, Telangana', lat: 17.2473, lon: 80.1514, tz: 5.5 },
  { id: 'anantapur', labelTe: 'అనంతపురం (Anantapur, AP)', labelEn: 'Anantapur, AP', lat: 14.6819, lon: 77.6006, tz: 5.5 },
  { id: 'kadapa', labelTe: 'కడప (Kadapa, AP)', labelEn: 'Kadapa, AP', lat: 14.4673, lon: 78.8242, tz: 5.5 },
  { id: 'bengaluru', labelTe: 'బెంగళూరు (Bengaluru, KA)', labelEn: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { id: 'chennai', labelTe: 'చెన్నై (Chennai, TN)', labelEn: 'Chennai, India', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { id: 'mumbai', labelTe: 'ముంబై (Mumbai, MH)', labelEn: 'Mumbai, India', lat: 19.076, lon: 72.8777, tz: 5.5 },
  { id: 'delhi', labelTe: 'న్యూఢిల్లీ (New Delhi)', labelEn: 'New Delhi, India', lat: 28.6139, lon: 77.209, tz: 5.5 },
  { id: 'dallas', labelTe: 'డల్లాస్, అమెరికా (Dallas, USA - CST)', labelEn: 'Dallas, TX (USA)', lat: 32.7767, lon: -96.797, tz: -6 },
  { id: 'newyork', labelTe: 'న్యూయార్క్, అమెరికా (New York, USA - EST)', labelEn: 'New York, NY (USA)', lat: 40.7128, lon: -74.006, tz: -5 },
  { id: 'sanjose', labelTe: 'కాలిఫోర్నియా (San Jose, USA - PST)', labelEn: 'San Jose, CA (USA)', lat: 37.3382, lon: -121.8863, tz: -8 },
  { id: 'london', labelTe: 'లండన్ (London, UK - GMT)', labelEn: 'London, UK', lat: 51.5072, lon: -0.1276, tz: 0 },
  { id: 'sydney', labelTe: 'సిడ్నీ (Sydney, Australia - AEST)', labelEn: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, tz: 10 },
];

const VIMSHOTTARI_DASHA_CYCLE: DashaLordConfig[] = [
  { lordTe: 'కేతు మహాదశ', lordEn: 'Ketu Mahadasha', years: 7, summaryTe: 'ఆధ్యాత్మిక చింతన, తీర్థయాత్రలు, వైరాగ్యం మరియు అంతర్దృష్టి పెరుగుతాయి. శ్రీ గణపతి ఆరాధన వల్ల ఆటంకాలు తొలగుతాయి.', summaryEn: 'Spiritual awakening, pilgrimages, detachment, and deep intuition.' },
  { lordTe: 'శుక్ర మహాదశ', lordEn: 'Shukra (Venus) Mahadasha', years: 20, summaryTe: 'వివాహ సౌఖ్యం, గృహ-వాహన ప్రాప్తి, ఆభరణాలు, ఆర్థిక సమృద్ధి మరియు కళాభివృద్ధి. శ్రీ మహాలక్ష్మి కటాక్షం లభిస్తుంది.', summaryEn: 'Marriage harmony, new home/vehicles, wealth, luxury, and artistic success.' },
  { lordTe: 'రవి (సూర్య) మహాదశ', lordEn: 'Surya (Sun) Mahadasha', years: 6, summaryTe: 'ఉద్యోగంలో అధికార ప్రాప్తి, ప్రభుత్వ గౌరవం, నాయకత్వ లక్షణాలు, పితృ వర్గ సహకారం మరియు ఆత్మగౌరవం.', summaryEn: 'Authority in career, government recognition, and leadership growth.' },
  { lordTe: 'చంద్ర మహాదశ', lordEn: 'Chandra (Moon) Mahadasha', years: 10, summaryTe: 'మనశ్శాంతి, మాతృ సౌఖ్యం, విదేశీ ప్రయాణాలు, వ్యాపార విస్తరణ మరియు కుటుంబంలో శుభకార్యాలు.', summaryEn: 'Mental peace, maternal blessings, travel, and family celebrations.' },
  { lordTe: 'కుజ మహాదశ', lordEn: 'Kuja (Mars) Mahadasha', years: 7, summaryTe: 'భూ-గృహ లాభం, ధైర్య సాహసాలు, సోదర సహకారం; సుబ్రహ్మణ్య ఆరాధనతో విశేష కార్యజయం.', summaryEn: 'Real estate gains, courage, technical breakthroughs, and energy.' },
  { lordTe: 'రాహు మహాదశ', lordEn: 'Rahu Mahadasha', years: 18, summaryTe: 'ఆకస్మిక ఆర్థిక ఉన్నతి, విదేశీ అవకాశాలు, నూతన సాంకేతిక రంగాలలో పురోగతి; శ్రీ దుర్గా ఆరాధన శుభప్రదం.', summaryEn: 'Sudden elevation, foreign opportunities, technology career growth.' },
  { lordTe: 'గురు మహాదశ', lordEn: 'Guru (Jupiter) Mahadasha', years: 16, summaryTe: 'సంతాన ప్రాప్తి, ధర్మ కార్యాలు, ఉన్నత విద్య, సమాజంలో గౌరవ మర్యాదలు మరియు అఖండ ధన లాభం.', summaryEn: 'Blessings of children, higher wisdom, wealth, and social honor.' },
  { lordTe: 'శని మహాదశ', lordEn: 'Shani (Saturn) Mahadasha', years: 19, summaryTe: 'కఠిన శ్రమకు తగిన స్థిరమైన ఫలితాలు, భూమి/పరిశ్రమల ద్వారా లాభం, దీర్ఘకాలిక విజయం మరియు ప్రజా ఆదరణ.', summaryEn: 'Enduring success through discipline, industry, and perseverance.' },
  { lordTe: 'బుధ మహాదశ', lordEn: 'Budha (Mercury) Mahadasha', years: 17, summaryTe: 'వ్యాపార లాభాలు, వాక్చాతుర్యం, విద్యా విజయాలు, బంధుమిత్రుల సహకారం మరియు ఆర్థిక వృద్ధి.', summaryEn: 'Business prosperity, communication excellence, academic and financial gains.' },
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
  const { t, language } = useLanguage();
  const [name, setName] = useState<string>('శ్రీనివాస రావు');
  const [birthDate, setBirthDate] = useState<string>('1994-08-15');
  const [birthTime, setBirthTime] = useState<string>('09:30');
  const [selectedCityId, setSelectedCityId] = useState<string>('hyderabad');
  const [chartMode, setChartMode] = useState<'D1' | 'D9'>('D1');
  const [predictionTab, setPredictionTab] = useState<'sunmoon' | 'elements' | 'sutras' | 'bhavas'>('sunmoon');
  const [showFullGrantham, setShowFullGrantham] = useState<boolean>(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const selectedCity = useMemo(
    () => BIRTH_CITIES.find((c) => c.id === selectedCityId) || BIRTH_CITIES[0],
    [selectedCityId]
  );

  // High-precision NASA/JPL DE405 + Lahiri Chitrapaksha Ayanamsa calculation via astronomy-engine
  const chartData = useMemo(() => {
    const astro = computeAccurateJanmaKundali(
      birthDate,
      birthTime,
      selectedCity.lat,
      selectedCity.lon,
      selectedCity.tz
    );

    const birthYear = Number(birthDate.split('-')[0]) || 1994;
    const startDashaIdx = (astro.nakshatraIdx - 1) % 9;
    const currentYear = new Date().getFullYear();
    let cursorYear = birthYear;

    const dashaList = Array.from({ length: 9 }, (_, i) => {
      const cfg = VIMSHOTTARI_DASHA_CYCLE[(startDashaIdx + i) % 9];
      const duration =
        i === 0 ? Math.max(1, Math.round(cfg.years * astro.balanceFraction)) : cfg.years;
      const startY = cursorYear;
      const endY = cursorYear + duration;
      cursorYear = endY;
      const isCurrent = currentYear >= startY && currentYear < endY;

      const antardashas = VIMSHOTTARI_DASHA_CYCLE.map((_, subIdx) => {
        const subCfg = VIMSHOTTARI_DASHA_CYCLE[(startDashaIdx + i + subIdx) % 9];
        const months = Math.max(1, Math.round((cfg.years * subCfg.years) / 10));
        return {
          lordTe: subCfg.lordTe.replace(' మహాదశ', ' అంతర్దశ'),
          lordEn: subCfg.lordEn.replace(' Mahadasha', ' Bhukti'),
          months,
        };
      });

      return {
        ...cfg,
        startYear: startY,
        endYear: endY,
        duration,
        isCurrent,
        antardashas,
      };
    });

    return {
      ...astro,
      dashaList,
    };
  }, [birthDate, birthTime, selectedCity]);

  // Compute Comprehensive Brihat Jathaka Grantham Predictions
  const predictions = useMemo(() => {
    const lagnaIdx = chartData.planets[0]?.rashiIdx ?? 0;
    const sunIdx = chartData.planets[1]?.rashiIdx ?? 0;
    const moonIdx = chartData.planets[2]?.rashiIdx ?? 0;

    return {
      lagnaProfile: generateLagnaCompleteProfile(chartData.planets, lagnaIdx),
      sunMoon144: getSunMoonCombination144(sunIdx, moonIdx),
      elementStrengths: evaluateMehtaElementalStrengths(chartData.planets, lagnaIdx),
      specialSutras: evaluateMehtaSpecialSutras(chartData.planets, lagnaIdx, birthDate),
      bhavaPredictions: generateBhavaPredictions(chartData.planets, lagnaIdx),
      all12Houses: generateAll12HousesCompleteAnalysis(chartData.planets, lagnaIdx),
      bhriguCycles: generateBhriguLifeProgression(chartData.planets, lagnaIdx, birthDate),
      remedies: generateVedicRemediesProfile(lagnaIdx, moonIdx),
    };
  }, [chartData.planets, birthDate]);

  const activeDasha = chartData.dashaList.find((d) => d.isCurrent) || chartData.dashaList[0];

  const whatsappConsultUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ సిద్ధాంతి గారు, నా దృక్సిద్ధాంత జన్మ కుండలి వివరాలు:\nపేరు: ${name}\nపుట్టిన తేదీ: ${birthDate}\nసమయం: ${birthTime}\nప్రాంతం: ${selectedCity.labelTe}\nజన్మ రాశి: ${chartData.rashi.te}\nజన్మ నక్షత్రం: ${chartData.nakshatraName} (${chartData.pada}వ పాదం)\nజన్మ లగ్నం (D1): ${chartData.lagna.te}\nనవాంశ లగ్నం (D9): ${chartData.navamshaLagna.te}\nప్రస్తుత మహాదశ: ${activeDasha.lordTe}.\nసంపూర్ణ జాతక పరిశీలన మరియు పరిహారాల కోసం సంప్రదిస్తున్నాను.`
  )}`;

  const activePlanetsMap = chartMode === 'D1' ? chartData.d1RashiPlanets : chartData.d9NavamshaPlanets;
  const activeLagnaId = chartMode === 'D1' ? chartData.lagna.id : chartData.navamshaLagna.id;

  const handleSelectSection = (tab: 'sunmoon' | 'elements' | 'sutras' | 'bhavas') => {
    setPredictionTab(tab);
    if (showFullGrantham) {
      const targetId = `grantham-section-${tab}`;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Build self-contained printable HTML document for reliable printing & offline saving
  const buildPrintableHtmlDocument = (): string => {
    const renderChartTableHtml = (
      title: string,
      planetsMap: Record<number, { nameTe: string; isRetro: boolean }[]>,
      lagnaRashiId: string
    ) => {
      const cellHtml = (rIdx: number) => {
        const rInfo = RASHI_12[rIdx];
        const pls = planetsMap[rIdx] || [];
        const isLagnaCell = rInfo.id === lagnaRashiId;
        return `<td style="width:25%;height:82px;vertical-align:top;padding:6px;border:1.5px solid #92400e;background:${
          isLagnaCell ? '#fef3c7' : '#fffbeb'
        };">
          <div style="font-size:11px;font-weight:bold;color:#78350f;display:flex;justify-content:space-between;">
            <span>${rInfo.te}</span>
            ${isLagnaCell ? '<span style="color:#9f1239;text-decoration:underline;">లగ్నం</span>' : ''}
          </div>
          <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:4px;line-height:1.35;">
            ${pls
              .map(
                (p) =>
                  `${p.nameTe}${
                    p.isRetro && p.nameTe !== 'రాహువు' && p.nameTe !== 'కేతువు' ? '(వ)' : ''
                  }`
              )
              .join(', ')}
          </div>
        </td>`;
      };

      return `
        <table style="width:100%;border-collapse:collapse;border:2px solid #78350f;margin-bottom:12px;">
          <tr>
            ${cellHtml(11)}${cellHtml(0)}${cellHtml(1)}${cellHtml(2)}
          </tr>
          <tr>
            ${cellHtml(10)}
            <td colspan="2" rowspan="2" style="background:#451a03;color:#fef3c7;text-align:center;padding:10px;border:1.5px solid #92400e;">
              <div style="font-size:11px;color:#fcd34d;font-weight:bold;">శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం</div>
              <div style="font-size:15px;font-weight:bold;color:#ffffff;margin:4px 0;">${title}</div>
              <div style="font-size:12px;">${name}</div>
              <div style="font-size:11px;color:#fde68a;">${birthDate} · ${birthTime}</div>
              <div style="font-size:11px;color:#6ee7b7;font-weight:bold;margin-top:3px;">${chartData.rashi.te} · ${chartData.nakshatraName} (${chartData.pada})</div>
            </td>
            ${cellHtml(3)}
          </tr>
          <tr>
            ${cellHtml(9)}
            ${cellHtml(4)}
          </tr>
          <tr>
            ${cellHtml(8)}${cellHtml(7)}${cellHtml(6)}${cellHtml(5)}
          </tr>
        </table>
      `;
    };

    return `<!DOCTYPE html>
<html lang="te">
<head>
  <meta charset="UTF-8" />
  <title>${name} - సంపూర్ణ జాతక ఫలితాల నివేదిక | శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Telugu:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Noto Serif Telugu', serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.65;
    }
    .doc-container {
      max-width: 900px;
      margin: 0 auto;
    }
    .header-box {
      border: 3px double #78350f;
      background: #fffbeb;
      padding: 18px;
      text-align: center;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .header-box h1 {
      margin: 4px 0;
      color: #451a03;
      font-size: 24px;
    }
    .header-box h2 {
      margin: 4px 0;
      color: #92400e;
      font-size: 17px;
    }
    .summary-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .summary-grid th, .summary-grid td {
      border: 1px solid #d97706;
      padding: 8px 12px;
      font-size: 13px;
      text-align: left;
    }
    .summary-grid th {
      background: #fef3c7;
      color: #78350f;
      width: 22%;
    }
    .section-title {
      background: #451a03;
      color: #ffffff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 17px;
      font-weight: bold;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .card {
      border: 1px solid #f59e0b;
      border-radius: 10px;
      padding: 12px 15px;
      margin-bottom: 12px;
      background: #ffffff;
      page-break-inside: avoid;
    }
    .card h4 {
      margin: 0 0 6px 0;
      color: #78350f;
      font-size: 15px;
    }
    .card p {
      margin: 4px 0;
      font-size: 13.5px;
    }
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 18px;
    }
    @media print {
      .no-print-bar { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="doc-container">
    <div class="no-print-bar" style="background:#451a03;color:#fff;padding:12px 18px;border-radius:10px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-weight:bold;">🖨️ ${name} గారి సంపూర్ణ జాతక ఫలితాల నివేదిక (Print Ready)</span>
      <button onclick="window.print()" style="background:#f59e0b;color:#451a03;border:none;padding:8px 16px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:14px;">
        🖨️ ఇప్పుడే ప్రింట్ / PDF సేవ్ చేయండి (Print)
      </button>
    </div>

    <div class="header-box">
      <div style="font-size:13px;font-weight:bold;color:#065f46;">శ్రీ గణాధిపతయే నమః · శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · దృక్సిద్ధాంత గణితం</div>
      <h1>${name} గారి సంపూర్ణ జాతక ఫలితాల నివేదిక</h1>
      <h2>బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (వైదిక జ్యోతిష్య & స్మార్త పురోహితులు · +91 89779 86166)</h2>
    </div>

    <table class="summary-grid">
      <tr>
        <th>పేరు (Name)</th><td><strong>${name}</strong></td>
        <th>పుట్టిన తేదీ & సమయం</th><td><strong>${birthDate} · ${birthTime}</strong></td>
      </tr>
      <tr>
        <th>పుట్టిన ప్రాంతం</th><td>${selectedCity.labelTe}</td>
        <th>లహిరి అయనాంశం</th><td>${chartData.ayanamsaFormatted}</td>
      </tr>
      <tr>
        <th>జన్మ రాశి (Moon Sign)</th><td><strong>${chartData.rashi.te} (${chartData.rashi.en})</strong></td>
        <th>జన్మ నక్షత్రం & పాదం</th><td><strong>${chartData.nakshatraName} — ${chartData.pada}వ పాదం</strong></td>
      </tr>
      <tr>
        <th>జన్మ లగ్నం (D1)</th><td><strong>${chartData.lagna.te} లగ్నం</strong></td>
        <th>నవాంశ లగ్నం (D9)</th><td><strong>${chartData.navamshaLagna.te}</strong></td>
      </tr>
      <tr>
        <th>జన్మ తిథి & యోగం</th><td>${chartData.birthTithiTe} · ${chartData.birthYogaTe}</td>
        <th>ప్రస్తుత మహాదశ</th><td><strong>${activeDasha.lordTe} (${activeDasha.startYear}–${activeDasha.endYear})</strong></td>
      </tr>
    </table>

    <div class="charts-row">
      <div>${renderChartTableHtml('రాశి చక్రం (D1)', chartData.d1RashiPlanets, chartData.lagna.id)}</div>
      <div>${renderChartTableHtml('నవాంశ చక్రం (D9)', chartData.d9NavamshaPlanets, chartData.navamshaLagna.id)}</div>
    </div>

    <div class="section-title">నవగ్రహ స్ఫుటములు & నక్షత్ర పాద పట్టిక</div>
    <table class="summary-grid">
      <thead>
        <tr>
          <th>గ్రహం</th>
          <th>రాశి (D1)</th>
          <th>డిగ్రీలు</th>
          <th>నక్షత్రం (పాదం)</th>
          <th>నవాంశ (D9)</th>
        </tr>
      </thead>
      <tbody>
        ${chartData.planets
          .map(
            (p) => `<tr>
          <td><strong>${p.nameTe}${p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu' ? ' (వక్రం)' : ''}</strong></td>
          <td>${p.rashiTe}</td>
          <td>${p.degreeFormatted}</td>
          <td>${p.nakshatraTe} (${p.pada})</td>
          <td>${p.navamshaRashiTe}</td>
        </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div class="section-title">అధ్యాయం 1 & 2: జన్మ లగ్న, ఆత్మకారక (సూర్య) & మనఃకారక (చంద్ర) సంయోగ విశ్లేషణ</div>
    <div class="card">
      <h4>జన్మ లగ్నం: ${chartData.lagna.te} · సూర్య రాశి: ${predictions.sunMoon144.sunRashiTe} · జన్మ రాశి: ${predictions.sunMoon144.moonRashiTe}</h4>
      <p>${predictions.lagnaProfile.dehaSwabhavamTe} ${predictions.lagnaProfile.lagnaLordEffectTe}</p>
      <p><strong>ప్రధాన జీవన తత్వం:</strong> ${predictions.sunMoon144.themesTe}</p>
    </div>
    <div class="card">
      <h4>వ్యక్తిత్వం, స్వభావం, విద్య & వృత్తి జీవితం</h4>
      <p>${predictions.sunMoon144.personalityTe}</p>
      <p>${predictions.sunMoon144.careerAndWealthTe}</p>
    </div>
    <div class="card">
      <h4>ప్రేమ, వివాహం, గృహ సౌఖ్యం & కుటుంబ సంబంధాలు</h4>
      <p>${predictions.sunMoon144.relationshipsTe} ${predictions.lagnaProfile.manoSwabhavamTe}</p>
      <p><strong>జీవన మార్గదర్శక ప్రతీక:</strong> ${predictions.sunMoon144.imageForIntegrationTe}</p>
    </div>
    <div class="card">
      <h4>సహజ బలాలు, ఆధ్యాత్మిక ఉపాసన & తీసుకోవలసిన జాగ్రత్తలు</h4>
      <p><strong>ప్రధాన బలాలు:</strong> ${predictions.sunMoon144.strengthsTe}. ${predictions.sunMoon144.spiritualPathTe}</p>
      <p><strong>జాగ్రత్తలు & జీవన లక్ష్యం:</strong> ${predictions.sunMoon144.weaknessesTe} ${predictions.lagnaProfile.lifeMissionTe}</p>
    </div>

    <div class="section-title">అధ్యాయం 3: పంచభూత తత్వ సప్తగ్రహ బల & శాంతి ఉపాసన</div>
    ${predictions.elementStrengths
      .map(
        (item) => `<div class="card">
      <h4>${item.planetTe} — ${item.rashiTe} (${item.elementTe}) · ${item.tierLabelTe} · ${item.houseNameTe}</h4>
      <p>${item.analysisTe}</p>
      <p><strong>ఆరాధన / పరిహారం:</strong> ${item.remedyTe}</p>
    </div>`
      )
      .join('')}

    <div class="section-title">అధ్యాయం 4: కాలచక్ర గమన సూత్రాలు, విశేష జ్యోతిష్య నియమాలు & రాజయోగాలు</div>
    ${predictions.specialSutras
      .map(
        (sutra) => `<div class="card">
      <h4>${sutra.titleTe} (${sutra.badgeTe})</h4>
      <p>${sutra.descriptionTe}</p>
      <p><strong>సూచన:</strong> ${sutra.remedyOrAdviceTe}</p>
    </div>`
      )
      .join('')}

    <div class="section-title">అధ్యాయం 5: ద్వాదశ స్థాన సంపూర్ణ జీవిత ఫలితాలు (1 నుండి 12 స్థానాల సమగ్ర విశ్లేషణ)</div>
    ${predictions.all12Houses
      .map(
        (h) => `<div class="card">
      <h4>${h.bhavaTitleTe} — రాశి: ${h.rashiInHouseTe} · అధిపతి: ${h.lordTe} (${h.lordPlacedInHouse}వ స్థానంలో)</h4>
      ${h.occupantPlanetsTe.length > 0 ? `<p><strong>ఈ స్థానంలోని గ్రహాలు:</strong> ${h.occupantPlanetsTe.join(', ')}</p>` : ''}
      <p>${h.detailedPredictionTe}</p>
      <p><strong>మార్గదర్శనం:</strong> ${h.guidanceTe}</p>
    </div>`
      )
      .join('')}

    <div class="section-title">అధ్యాయం 6: నవగ్రహ స్థాన, నక్షత్ర పాద & నవాంశ (D9) విశేష ఫలితాలు</div>
    ${predictions.bhavaPredictions
      .map(
        (bp) => `<div class="card">
      <h4>${bp.planetTe} (${bp.rashiTe} · ${bp.degreeFormatted}) — ${bp.bhavaNameTe}</h4>
      <p>${bp.predictionTe}</p>
      <p>${bp.deepAnalysisTe}</p>
    </div>`
      )
      .join('')}

    <div class="section-title">అధ్యాయం 7: ద్వాదశ వర్ష కాలచక్ర గమనం (1 నుండి 96 ఏళ్ల వయస్సు వరకు దశాబ్ద ఫలితాలు)</div>
    ${predictions.bhriguCycles
      .map(
        (c) => `<div class="card">
      <h4>${c.ageRangeTe} (${c.yearRange}) — ${c.themeTe}</h4>
      <p>${c.predictionTe}</p>
    </div>`
      )
      .join('')}

    <div class="section-title">అధ్యాయం 8: అదృష్ట రత్నం, రుద్రాక్ష, ఆరాధ్య దైవం & వైదిక శాంతి పరిహారాలు</div>
    <div class="card">
      <h4>💎 అదృష్ట రత్నం: ${predictions.remedies.luckyGemstoneTe}</h4>
      <p>${predictions.remedies.wearingMethodTe}</p>
      <p><strong>📿 అనుకూల రుద్రాక్ష & ఆరాధ్య దైవం:</strong> ${predictions.remedies.rudrakshaTe} · ఆరాధ్య దైవం: ${predictions.remedies.aradhyaDeivamTe}</p>
      <p><strong>🌟 అదృష్ట సంఖ్యలు, వారాలు & రంగులు:</strong> సంఖ్యలు: ${predictions.remedies.luckyNumbers} · వారాలు: ${predictions.remedies.luckyDaysTe} · రంగులు: ${predictions.remedies.luckyColorsTe}</p>
      <p><strong>📖 నిత్య పారాయణ స్తోత్రాలు:</strong> ${predictions.remedies.nityaStotraTe}</p>
      <p><strong>🙏 దాన ధర్మాలు:</strong> ${predictions.remedies.danaPariharamTe}</p>
    </div>

    <div class="section-title">120 ఏళ్ల వింశోత్తరి మహాదశ & అంతర్దశ కాలచక్రం</div>
    ${chartData.dashaList
      .map(
        (d) => `<div class="card">
      <h4>${d.lordTe} (${d.startYear} – ${d.endYear})${d.isCurrent ? ' — [ప్రస్తుతం నడుస్తున్న మహాదశ]' : ''}</h4>
      <p>${d.summaryTe}</p>
      <p style="font-size:12px;color:#475569;"><strong>అంతర్దశల క్రమం:</strong> ${d.antardashas
        .map((ad) => `${ad.lordTe.replace(' అంతర్దశ', '')} (${ad.months}నె)`)
        .join(' · ')}</p>
    </div>`
      )
      .join('')}
  </div>
</body>
</html>`;
  };

  // Trigger iframe print + native print + open Print/Download Modal so it works in all environments
  const handlePrintHoroscope = () => {
    setShowFullGrantham(true);
    setIsPrintModalOpen(true);

    try {
      const htmlContent = buildPrintableHtmlDocument();
      const existingFrame = document.getElementById('kundali-print-iframe') as HTMLIFrameElement | null;
      if (existingFrame && existingFrame.parentNode) {
        existingFrame.parentNode.removeChild(existingFrame);
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'kundali-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch {
            window.print();
          }
        }, 350);
      } else {
        window.print();
      }
    } catch {
      try {
        window.print();
      } catch {
        // Modal is already open with 1-click download
      }
    }
  };

  // Direct 1-click download of the complete printable Horoscope file (.html)
  const handleDownloadPrintableFile = () => {
    const htmlContent = buildPrintableHtmlDocument();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = name.trim().replace(/\s+/g, '_') || 'Janma_Kundali';
    link.href = url;
    link.download = `${safeName}_Sampoorna_Jathaka_Phalithalu.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  // Direct 1-click download of high-res Janma Kundali Patrika Image (.png) via HTML5 Canvas
  const handleDownloadKundaliImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1550;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cream parchment background
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer temple maroon & gold border
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // Header banner
    ctx.fillStyle = '#451a03';
    ctx.fillRect(45, 45, canvas.width - 90, 145);

    ctx.fillStyle = '#fcd34d';
    ctx.font = 'bold 22px "Noto Serif Telugu", serif';
    ctx.textAlign = 'center';
    ctx.fillText('శ్రీ గణాధిపతయే నమః · శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · దృక్సిద్ధాంత గణితం', canvas.width / 2, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "Noto Serif Telugu", serif';
    ctx.fillText(`${name} గారి జన్మ కుండలి & జాతక పత్రిక`, canvas.width / 2, 132);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 20px "Noto Serif Telugu", serif';
    ctx.fillText('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు · +91 89779 86166', canvas.width / 2, 168);

    // Birth details summary box
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(45, 210, canvas.width - 90, 140);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 210, canvas.width - 90, 140);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 21px "Noto Serif Telugu", serif';
    ctx.fillText(`పేరు: ${name}`, 70, 248);
    ctx.fillText(`పుట్టిన తేదీ & సమయం: ${birthDate} · ${birthTime}`, 70, 288);
    ctx.fillText(`పుట్టిన ప్రాంతం: ${selectedCity.labelTe}`, 70, 328);

    ctx.fillText(`జన్మ రాశి: ${chartData.rashi.te} (${chartData.rashi.en})`, 620, 248);
    ctx.fillText(`జన్మ నక్షత్రం: ${chartData.nakshatraName} (${chartData.pada}వ పాదం)`, 620, 288);
    ctx.fillText(`జన్మ లగ్నం: ${chartData.lagna.te} · నవాంశ: ${chartData.navamshaLagna.te}`, 620, 328);

    // Draw South Indian 4x4 Rashi Chart (D1) & Navamsha Chart (D9)
    const drawSouthIndianChart = (
      startX: number,
      startY: number,
      size: number,
      title: string,
      planetsMap: Record<number, { nameTe: string; isRetro: boolean }[]>,
      lagnaId: string
    ) => {
      const cellS = size / 4;
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.strokeRect(startX, startY, size, size);

      SOUTH_INDIAN_CELLS.forEach((cell) => {
        const x = startX + cell.col * cellS;
        const y = startY + cell.row * cellS;
        const rInfo = RASHI_12[cell.rashiIdx];
        const isLagna = rInfo.id === lagnaId;
        ctx.fillStyle = isLagna ? '#fde68a' : '#ffffff';
        ctx.fillRect(x, y, cellS, cellS);
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellS, cellS);

        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 15px "Noto Serif Telugu", serif';
        ctx.textAlign = 'left';
        ctx.fillText(rInfo.te, x + 8, y + 22);
        if (isLagna) {
          ctx.fillStyle = '#9f1239';
          ctx.fillText('లగ్నం', x + cellS - 48, y + 22);
        }

        const pls = planetsMap[cell.rashiIdx] || [];
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px "Noto Serif Telugu", serif';
        pls.slice(0, 4).forEach((pl, idx) => {
          ctx.fillText(
            `${pl.nameTe}${pl.isRetro && pl.nameTe !== 'రాహువు' && pl.nameTe !== 'కేతువు' ? '(వ)' : ''}`,
            x + 10,
            y + 48 + idx * 22
          );
        });
      });

      // Center 2x2 box
      ctx.fillStyle = '#451a03';
      ctx.fillRect(startX + cellS, startY + cellS, cellS * 2, cellS * 2);
      ctx.fillStyle = '#fcd34d';
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px "Noto Serif Telugu", serif';
      ctx.fillText(title, startX + size / 2, startY + size / 2 - 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Noto Serif Telugu", serif';
      ctx.fillText(`${chartData.rashi.te} · ${chartData.nakshatraName} (${chartData.pada})`, startX + size / 2, startY + size / 2 + 22);
    };

    drawSouthIndianChart(55, 380, 520, 'రాశి చక్రం (D1)', chartData.d1RashiPlanets, chartData.lagna.id);
    drawSouthIndianChart(625, 380, 520, 'నవాంశ చక్రం (D9)', chartData.d9NavamshaPlanets, chartData.navamshaLagna.id);

    // Key Predictions & Remedies Box at bottom
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(45, 930, canvas.width - 90, 550);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 930, canvas.width - 90, 550);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 24px "Noto Serif Telugu", serif';
    ctx.fillText('ప్రధాన జాతక ఫలితాలు & వైదిక పరిహార సూచనలు:', 70, 975);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 19px "Noto Serif Telugu", serif';
    ctx.fillText(`• ప్రస్తుత మహాదశ: ${activeDasha.lordTe} (${activeDasha.startYear} – ${activeDasha.endYear})`, 70, 1020);
    ctx.fillText(`• సూర్య-చంద్ర తత్వం: సూర్య రాశి ${predictions.sunMoon144.sunRashiTe} · జన్మ రాశి ${predictions.sunMoon144.moonRashiTe}`, 70, 1060);
    ctx.fillText(`• అదృష్ట రత్నం: ${predictions.remedies.luckyGemstoneTe}`, 70, 1100);
    ctx.fillText(`• అనుకూల రుద్రాక్ష: ${predictions.remedies.rudrakshaTe}`, 70, 1140);
    ctx.fillText(`• ఆరాధ్య దైవం: ${predictions.remedies.aradhyaDeivamTe}`, 70, 1180);
    ctx.fillText(`• అదృష్ట సంఖ్యలు: ${predictions.remedies.luckyNumbers} · అనుకూల వారాలు: ${predictions.remedies.luckyDaysTe}`, 70, 1220);
    ctx.fillText(`• నిత్య పారాయణ: ${predictions.remedies.nityaStotraTe}`, 70, 1260);

    // Planetary degrees mini list
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 20px "Noto Serif Telugu", serif';
    ctx.fillText('నవగ్రహ స్థితి (D1 రాశి - డిగ్రీలు):', 70, 1320);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px "Noto Serif Telugu", serif';
    const row1 = chartData.planets.slice(0, 5).map((p) => `${p.nameTe}: ${p.rashiTe} (${p.degreeFormatted})`).join('  |  ');
    const row2 = chartData.planets.slice(5, 10).map((p) => `${p.nameTe}: ${p.rashiTe} (${p.degreeFormatted})`).join('  |  ');
    ctx.fillText(row1, 70, 1360);
    ctx.fillText(row2, 70, 1398);

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 18px "Noto Serif Telugu", serif';
    ctx.textAlign = 'center';
    ctx.fillText('www.telugujyothisham.com · శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', canvas.width / 2, 1455);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeName = name.trim().replace(/\s+/g, '_') || 'Janma_Kundali';
    link.href = dataUrl;
    link.download = `${safeName}_Janma_Kundali_Patrika.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-telugu">
      {/* Birth Details Form with Drik Siddhanta Badge */}
      <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-6 border border-amber-200/90 shadow-2xs no-print">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-lg border border-emerald-300 mb-2">
              <Sparkles size={13} className="text-emerald-700" />
              <span>
                {t(
                  'శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · దృక్సిద్ధాంత గణితం (లహిరి అయనాంశం: ' + chartData.ayanamsaFormatted + ')',
                  'Sri Lakshmi Ganapathi Jyothishalayam · Drik Siddhanta Engine (Lahiri Ayanamsa: ' + chartData.ayanamsaFormatted + ')'
                )}
              </span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
              {t(
                'మీ జాతకం తెలుసుకోండి — ఉచిత జన్మ కుండలి & సంపూర్ణ జాతక ఫలితాలు',
                'Know Your Horoscope — Free Janma Kundali & Comprehensive Horoscope Predictions'
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t(
                'మీ పుట్టిన తేదీ, సమయం, ప్రాంతం నమోదు చేయగానే రాశి చక్రం (D1), నవాంశ చక్రం (D9), గ్రహ డిగ్రీలు మరియు 8 అధ్యాయాల సమగ్ర జాతక ఫలితాలు తయారవుతాయి.',
                'Enter your birth date, time, and city for instant D1 Rashi, D9 Navamsha, exact degrees, and an 8-chapter comprehensive horoscope report.'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
              min="1900-01-01"
              max="2100-12-31"
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
              <span>{t('పుట్టిన ప్రాంతం (Birth City):', 'Place of Birth:')}</span>
            </label>
            <select
              id="kundali-place"
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-600 focus:outline-none cursor-pointer"
            >
              {BIRTH_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {language === 'en' ? city.labelEn : city.labelTe}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Primary Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-amber-200">
          <span className="text-xs text-slate-500 block">{t('జన్మ రాశి (Moon Sign)', 'Janma Rashi')}</span>
          <strong className="text-base sm:text-xl font-bold text-amber-950 mt-0.5 block">
            {chartData.rashi.te} ({chartData.rashi.en})
          </strong>
          <span className="text-xs text-amber-800">{t('రాశ్యాధిపతి:', 'Lord:')} {chartData.rashi.lord}</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-amber-200">
          <span className="text-xs text-slate-500 block">{t('జన్మ నక్షత్రం & పాదం', 'Birth Nakshatra & Pada')}</span>
          <strong className="text-base sm:text-xl font-bold text-amber-950 mt-0.5 block">
            {chartData.nakshatraName} — {chartData.pada}వ పాదం
          </strong>
          <span className="text-xs text-amber-800">
            {t(`జన్మ తిథి: ${chartData.birthTithiTe}`, `Star #${chartData.nakshatraIdx}/27`)}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-amber-200">
          <span className="text-xs text-slate-500 block">{t('జన్మ లగ్నం (D1) & నవాంశ (D9)', 'Lagna (D1 & D9)')}</span>
          <strong className="text-base sm:text-xl font-bold text-amber-950 mt-0.5 block">
            {chartData.lagna.te} లగ్నం
          </strong>
          <span className="text-xs text-amber-800">
            {t(`నవాంశ లగ్నం: ${chartData.navamshaLagna.te}`, `D9 Navamsha: ${chartData.navamshaLagna.en}`)}
          </span>
        </div>

        <div className="bg-amber-950 text-white rounded-2xl p-3.5 sm:p-4 border border-amber-700">
          <span className="text-xs text-amber-300 block">{t('ప్రస్తుత మహాదశ (Running Dasha)', 'Current Mahadasha')}</span>
          <strong className="text-base sm:text-xl font-bold text-amber-300 mt-0.5 block">
            {activeDasha.lordTe}
          </strong>
          <span className="text-xs font-mono tabular-nums text-amber-100">
            {activeDasha.startYear} – {activeDasha.endYear}
          </span>
        </div>
      </div>

      {/* 2-Column Split: South Indian 4x4 Chart (D1 Rashi / D9 Navamsha) & Planetary Degrees Table */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        {/* Left: South Indian 4x4 Square Chart with D1 / D9 Toggle */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
              <Compass size={18} className="text-amber-700" />
              <span>
                {chartMode === 'D1'
                  ? t('రాశి చక్రం (D1 Janma Rashi Chart)', 'D1 Rashi Kundali Chart')
                  : t('నవాంశ చక్రం (D9 Navamsha Chart)', 'D9 Navamsha Chart')}
              </span>
            </h4>

            <div className="inline-flex rounded-xl bg-amber-100 p-1 border border-amber-300 no-print">
              <button
                type="button"
                onClick={() => setChartMode('D1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  chartMode === 'D1'
                    ? 'bg-amber-900 text-white shadow-2xs'
                    : 'text-amber-950 hover:bg-amber-200/70'
                }`}
              >
                {t('రాశి చక్రం (D1)', 'Rashi (D1)')}
              </button>
              <button
                type="button"
                onClick={() => setChartMode('D9')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  chartMode === 'D9'
                    ? 'bg-amber-900 text-white shadow-2xs'
                    : 'text-amber-950 hover:bg-amber-200/70'
                }`}
              >
                {t('నవాంశ చక్రం (D9)', 'Navamsha (D9)')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 grid-rows-4 gap-1 sm:gap-1.5 bg-amber-900 p-1.5 sm:p-2 rounded-2xl aspect-square max-w-md mx-auto">
            {Array.from({ length: 16 }, (_, cellIndex) => {
              const r = Math.floor(cellIndex / 4);
              const c = cellIndex % 4;

              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 bg-amber-950 text-amber-100 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center text-center border border-amber-600/80"
                  >
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-400 font-bold">
                      {t('శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · దృక్సిద్ధాంతం', 'Sri Lakshmi Ganapathi Jyothishalayam · Drik Siddhantam')}
                    </span>
                    <strong className="text-sm sm:text-lg font-bold text-white mt-1">
                      {chartMode === 'D1' ? 'రాశి చక్రం (D1)' : 'నవాంశ చక్రం (D9)'}
                    </strong>
                    <span className="text-xs text-amber-200 mt-0.5">{name}</span>
                    <span className="text-[10px] sm:text-[11px] font-mono tabular-nums text-amber-300 mt-0.5">
                      {birthDate} · {birthTime}
                    </span>
                    <span className="text-[11px] sm:text-xs text-emerald-300 font-bold mt-1">
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
              const planets = activePlanetsMap[foundCell.rashiIdx] || [];
              const isLagna = rashiInfo.id === activeLagnaId;
              const isJanmaRashi = rashiInfo.id === chartData.rashi.id && chartMode === 'D1';

              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-xl p-1.5 sm:p-2 flex flex-col justify-between border ${
                    isLagna
                      ? 'bg-amber-100 border-amber-500'
                      : isJanmaRashi
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-amber-50/95 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-0.5">
                    <span className="text-[9px] sm:text-xs font-bold text-amber-900/80 truncate">
                      {rashiInfo.te}
                    </span>
                    {isLagna && (
                      <span className="text-[8px] sm:text-[9px] font-bold text-rose-800 underline shrink-0">లగ్నం</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-0.5 sm:gap-1 my-auto pt-0.5">
                    {planets.map((pl) => (
                      <span
                        key={pl.nameTe}
                        className={`text-[9px] sm:text-xs font-bold leading-tight ${
                          pl.nameTe === 'లగ్నం'
                            ? 'text-rose-800'
                            : pl.nameTe === 'చంద్రుడు'
                            ? 'text-emerald-900'
                            : 'text-slate-900'
                        }`}
                      >
                        {pl.nameTe}
                        {pl.isRetro && pl.nameTe !== 'రాహువు' && pl.nameTe !== 'కేతువు' ? '(వ)' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kuja Dosha & Birth Yoga Quick Check */}
          <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
            {chartData.hasKujaDosha ? (
              <ShieldCheck size={20} className="text-amber-800 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm text-slate-700 space-y-1">
              <strong className="text-amber-950 block">
                {chartData.hasKujaDosha
                  ? t(
                      `కుజ స్థితి పరిశీలన: లగ్నం నుండి ${chartData.marsHouseFromLagna}వ స్థానంలో కుజుడు ఉన్నాడు`,
                      `Mars Position: Placed in House #${chartData.marsHouseFromLagna} from Ascendant`
                    )
                  : t(
                      `కుజ దోషం లేదు: లగ్నం నుండి ${chartData.marsHouseFromLagna}వ స్థానంలో కుజుడు శుభ స్థితిలో ఉన్నాడు`,
                      `No Kuja Dosha: Mars is favorably placed in House #${chartData.marsHouseFromLagna} from Lagna`
                    )}
              </strong>
              <p className="text-xs text-slate-600">
                {t(
                  `జన్మ తిథి: ${chartData.birthTithiTe} · జన్మ యోగం: ${chartData.birthYogaTe}. (వ) = వక్ర గతి (Retrograde).`,
                  `Birth Tithi: ${chartData.birthTithiTe} · Birth Yoga: ${chartData.birthYogaTe}.`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Planetary Degrees (Graha Sphuta) Table */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-200 shadow-2xs space-y-4">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
              <Table2 size={18} className="text-amber-700" />
              <span>{t('నవగ్రహ స్ఫుటములు & నక్షత్ర పాద పట్టిక (Planetary Degrees)', 'Planetary Degrees & Nakshatra Table')}</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {t(
                'నిరయన (Sidereal) గ్రహ డిగ్రీలు, రాశి, నక్షత్ర పాదం మరియు నవాంశ రాశి వివరాలు:',
                'Exact Sidereal longitude inside each Rashi, Star Pada, and D9 Navamsha placement:'
              )}
            </p>
          </div>

          <div className="overflow-x-auto border border-amber-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-amber-100/80 text-amber-950 border-b border-amber-200">
                  <th className="py-2.5 px-2.5 sm:px-3 font-bold">{t('గ్రహం', 'Planet')}</th>
                  <th className="py-2.5 px-2.5 sm:px-3 font-bold">{t('రాశి (D1)', 'Rashi')}</th>
                  <th className="py-2.5 px-2.5 sm:px-3 font-bold">{t('డిగ్రీలు', 'Degrees')}</th>
                  <th className="py-2.5 px-2.5 sm:px-3 font-bold">{t('నక్షత్రం (పాదం)', 'Star (Pada)')}</th>
                  <th className="py-2.5 px-2.5 sm:px-3 font-bold">{t('నవాంశ (D9)', 'Navamsha')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {chartData.planets.map((p) => (
                  <tr key={p.id} className="hover:bg-amber-50/50">
                    <td className="py-2.5 px-2.5 sm:px-3 font-bold text-amber-950">
                      {language === 'en' ? p.nameEn : p.nameTe}
                      {p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu' && (
                        <span className="ml-1 text-[10px] text-rose-700 font-bold">(వక్రం)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2.5 sm:px-3 font-semibold text-slate-800">
                      {language === 'en' ? p.rashiEn : p.rashiTe}
                    </td>
                    <td className="py-2.5 px-2.5 sm:px-3 font-mono tabular-nums text-xs font-bold text-amber-900">
                      {p.degreeFormatted}
                    </td>
                    <td className="py-2.5 px-2.5 sm:px-3 text-slate-700">
                      {language === 'en' ? p.nakshatraEn : p.nakshatraTe} ({p.pada})
                    </td>
                    <td className="py-2.5 px-2.5 sm:px-3 font-semibold text-emerald-900">
                      {p.navamshaRashiTe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          BRIHAT JATHAKA GRANTHAM (COMPLETE 8-CHAPTER HOROSCOPE REPORT)
          ========================================================================== */}
      <div className="bg-white rounded-3xl p-4 sm:p-7 border-2 border-amber-300/90 shadow-xs space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-900 mb-1.5">
              <BookOpen size={14} className="text-amber-800 shrink-0" />
              <span>
                {t(
                  'శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · సంపూర్ణ బృహత్ జాతక గ్రంథం',
                  'Sri Lakshmi Ganapathi Jyothishalayam · Complete Brihat Jataka Grantham'
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-800">
                {t('8 సమగ్ర విభాగాలు · ద్వాదశ స్థానాలు · 96 ఏళ్ల భృగు చక్ర పద్ధతి', '8 Comprehensive Sections · All 12 Houses · 96-Year Bhrigu Chakra Paddhati')}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-950 leading-snug">
              {t(
                `${name} గారి సంపూర్ణ బృహత్ జాతక గ్రంథం (జాతక ఫలితాల నివేదిక)`,
                `Complete Brihat Jataka Horoscope Report for ${name}`
              )}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {t(
                `మీ జన్మ లగ్నం (${chartData.lagna.te}), సూర్య రాశి (${predictions.sunMoon144.sunRashiTe}), జన్మ రాశి (${chartData.rashi.te}), జన్మ నక్షత్రం (${chartData.nakshatraName} - ${chartData.pada}వ పాదం) మరియు ద్వాదశ స్థాన గ్రహ స్థితి ఆధారంగా రూపొందించబడిన శాస్త్రోక్త జాతక విశ్లేషణ:`,
                `Prepared from your Ascendant (${chartData.lagna.en}), Sun Sign (${predictions.sunMoon144.sunRashiEn}), Moon Sign (${chartData.rashi.en}), Nakshatra (${chartData.nakshatraName} Pada ${chartData.pada}), and all 12 House placements:`
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
            <button
              type="button"
              onClick={() => setShowFullGrantham((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                showFullGrantham
                  ? 'bg-emerald-800 text-white border-emerald-700 shadow-2xs'
                  : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Layers size={15} />
              <span>
                {showFullGrantham
                  ? t('📖 పూర్తి బృహత్ జాతక గ్రంథం వీక్షణ (Active)', '📖 Full Report View (Active)')
                  : t('📖 పూర్తి బృహత్ జాతక గ్రంథం తెరవండి', '📖 View Full Horoscope Report')}
              </span>
            </button>

            <button
              type="button"
              onClick={handlePrintHoroscope}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Printer size={15} />
              <span>{t('జాతకం ప్రింట్ / PDF డౌన్‌లోడ్', 'Print / Save Horoscope')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadKundaliImage}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <ImageIcon size={15} />
              <span>{t('కుండలి ఇమేజ్ సేవ్', 'Save Chart PNG')}</span>
            </button>
          </div>
        </div>

        {/* 4 Category Navigation Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 bg-amber-950/95 p-2 sm:p-2.5 rounded-2xl border border-amber-800 shadow-inner no-print">
          <button
            type="button"
            onClick={() => handleSelectSection('sunmoon')}
            className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              predictionTab === 'sunmoon'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
            }`}
          >
            <Sparkles size={15} className="shrink-0" />
            <span className="leading-snug tracking-wide">
              {t('1. లగ్న & ఆత్మ-మనస్సు ఫలితం', '1. Lagna & Sun-Moon Analysis')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSection('elements')}
            className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              predictionTab === 'elements'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
            }`}
          >
            <Flame size={15} className="shrink-0" />
            <span className="leading-snug tracking-wide">
              {t('2. పంచభూత గ్రహ బలం', '2. Elemental Planetary Strength')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSection('sutras')}
            className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              predictionTab === 'sutras'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
            }`}
          >
            <Scale size={15} className="shrink-0" />
            <span className="leading-snug tracking-wide">
              {t('3. భృగు చక్ర పద్ధతి & రాజయోగాలు', '3. Bhrigu Chakra & Raja Yogas')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSection('bhavas')}
            className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              predictionTab === 'bhavas'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
            }`}
          >
            <CompassIcon size={15} className="shrink-0" />
            <span className="leading-snug tracking-wide">
              {t('4. ద్వాదశ స్థానాలు & పరిహారాలు', '4. 12 Houses & Vedic Remedies')}
            </span>
          </button>
        </div>

        {/* ====================================================================
            SECTION 1 (CHAPTERS 1 & 2) — LAGNA & SUN-MOON PROFILE
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'sunmoon') && (
          <div id="grantham-section-sunmoon" className="space-y-6 scroll-mt-24">
            {/* Chapter 1 & 2 Banner */}
            <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-6 border border-amber-300 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-900">
                <span>
                  {t(
                    'అధ్యాయం 1 & 2 · జన్మ లగ్న, ఆత్మకారక (సూర్య) & మనఃకారక (చంద్ర) సంయోగ విశ్లేషణ',
                    'Chapters 1 & 2 · Ascendant, Sun & Moon Archetype Synthesis'
                  )}
                </span>
                <span className="text-emerald-900">
                  {t(predictions.sunMoon144.elementPairTitleTe, predictions.sunMoon144.elementPairTitleEn)}
                </span>
              </div>

              <h5 className="text-lg sm:text-2xl font-bold text-amber-950">
                {t(
                  `జన్మ లగ్నం: ${chartData.lagna.te} · సూర్య రాశి: ${predictions.sunMoon144.sunRashiTe} (ఆత్మ) · జన్మ రాశి: ${predictions.sunMoon144.moonRashiTe} (మనస్సు)`,
                  `Ascendant: ${chartData.lagna.en} · Sun in ${predictions.sunMoon144.sunRashiEn} (Soul) · Moon in ${predictions.sunMoon144.moonRashiEn} (Mind)`
                )}
              </h5>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t(predictions.lagnaProfile.dehaSwabhavamTe, predictions.lagnaProfile.dehaSwabhavamEn)}{' '}
                {t(predictions.lagnaProfile.lagnaLordEffectTe, predictions.lagnaProfile.lagnaLordEffectEn)}
              </p>

              <p className="text-xs sm:text-sm font-bold text-amber-900 pt-1">
                {t('ప్రధాన జీవన తత్వం: ', 'Core Life Themes: ')}
                <span className="font-normal text-slate-700">
                  {t(predictions.sunMoon144.themesTe, predictions.sunMoon144.themesEn)}
                </span>
              </p>
            </div>

            {/* 2-Column Detailed Cards */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {/* Child 1: Personality & Career */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 space-y-3">
                <div className="text-xs font-bold text-amber-800">
                  {t('ఆత్మ-మనస్సు స్వభావం & వృత్తి ప్రస్థానం', 'Core Personality & Vocation')}
                </div>
                <h6 className="text-base sm:text-lg font-bold text-amber-950">
                  {t('వ్యక్తిత్వం, స్వభావం, విద్య & వృత్తి జీవితం', 'Core Personality, Education & Vocation')}
                </h6>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {t(predictions.sunMoon144.personalityTe, predictions.sunMoon144.personalityEn)}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2 border-t border-amber-100">
                  {t(predictions.sunMoon144.careerAndWealthTe, predictions.sunMoon144.careerAndWealthEn)}
                </p>
              </div>

              {/* Child 2: Love, Marriage & Family */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 space-y-3">
                <div className="text-xs font-bold text-amber-800">
                  {t('కుటుంబం, ప్రేమ & వైవాహిక జీవనం', 'Family, Marriage & Relationships')}
                </div>
                <h6 className="text-base sm:text-lg font-bold text-amber-950">
                  {t('ప్రేమ, వివాహం, గృహ సౌఖ్యం & కుటుంబ సంబంధాలు', 'Love, Marriage, Domestic Bliss & Relationships')}
                </h6>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {t(predictions.sunMoon144.relationshipsTe, predictions.sunMoon144.relationshipsEn)}{' '}
                  {t(predictions.lagnaProfile.manoSwabhavamTe, predictions.lagnaProfile.manoSwabhavamEn)}
                </p>
                <div className="pt-2 border-t border-amber-100 mt-2">
                  <span className="text-xs font-bold text-amber-900 block">
                    {t('జీవన మార్గదర్శక ప్రతీక (Guiding Symbol):', 'Guiding Symbolic Archetype:')}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 italic mt-0.5 leading-relaxed">
                    {t(predictions.sunMoon144.imageForIntegrationTe, predictions.sunMoon144.imageForIntegrationEn)}
                  </p>
                </div>
              </div>

              {/* Child 3: Strengths & Spiritual Path */}
              <div className="bg-emerald-50/70 rounded-2xl p-5 sm:p-6 border border-emerald-200 space-y-2.5">
                <div className="text-xs font-bold text-emerald-800">
                  {t('సహజ బలాలు & ఆధ్యాత్మిక ఉపాసన', 'Greatest Strengths & Spiritual Path')}
                </div>
                <h6 className="text-base sm:text-lg font-bold text-emerald-950">
                  ✓ {t('మీ జాతక ప్రధాన బలాలు & దైవ అనుగ్రహం', 'Your Greatest Strengths & Divine Grace')}
                </h6>
                <p className="text-sm sm:text-base text-emerald-950 leading-relaxed">
                  {t(predictions.sunMoon144.strengthsTe, predictions.sunMoon144.strengthsEn)}.{' '}
                  {t(predictions.sunMoon144.spiritualPathTe, predictions.sunMoon144.spiritualPathEn)}
                </p>
              </div>

              {/* Child 4: Cautions & Life Mission */}
              <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 border border-amber-200 space-y-2.5">
                <div className="text-xs font-bold text-amber-800">
                  {t('తీసుకోవలసిన జాగ్రత్తలు & జీవన లక్ష్యం', 'Mindful Precautions & Life Mission')}
                </div>
                <h6 className="text-base sm:text-lg font-bold text-amber-950">
                  ! {t('తీసుకోవలసిన జాగ్రత్తలు & ఉన్నత జీవన మార్గం', 'Mindful Precautions & Higher Path')}
                </h6>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                  {t(predictions.sunMoon144.weaknessesTe, predictions.sunMoon144.weaknessesEn)}{' '}
                  {t(predictions.lagnaProfile.lifeMissionTe, predictions.lagnaProfile.lifeMissionEn)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            SECTION 2 (CHAPTER 3) — PANCHABHOOTA ELEMENTAL STRENGTH
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'elements') && (
          <div id="grantham-section-elements" className="space-y-4 pt-4 border-t border-amber-200 scroll-mt-24">
            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200">
              <div className="text-xs font-bold text-amber-800 mb-1">
                {t('అధ్యాయం 3 · పంచభూత తత్వ సప్తగ్రహ బల & వక్ర గ్రహ రహస్య విశ్లేషణ', 'Chapter 3 · Elemental Planetary Strength & Retrograde Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl font-bold text-amber-950">
                {t(
                  'పంచభూత తత్వ గ్రహ బల పట్టిక (అగ్ని · భూ · వాయు · జల తత్వాలు & శాంతి ఉపాసన)',
                  'Elemental Planetary Strength Analysis (Fire · Earth · Air · Water & Vedic Upasana)'
                )}
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {t(
                  'ప్రతి గ్రహం తన ఉచ్చ రాశి తత్వంలో ఉన్నప్పుడు అత్యుత్తమ ఫలితాలను, నీచ రాశి తత్వంలో ఉన్నప్పుడు పరీక్షలను ఇస్తుంది. మీ జాతకంలోని సప్త గ్రహాల తత్వ బలం మరియు పరిహారాలు:',
                  'Each planet operates at peak power in the element of its exaltation sign. Below is the elemental strength and upasana for your 7 core planets:'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {predictions.elementStrengths.map((item) => {
                const badgeStyles =
                  item.tier === 'best'
                    ? 'text-emerald-900 bg-emerald-100/80'
                    : item.tier === 'second'
                    ? 'text-amber-900 bg-amber-100/80'
                    : item.tier === 'third'
                    ? 'text-slate-800 bg-slate-100'
                    : 'text-rose-900 bg-rose-100/80';

                return (
                  <div
                    key={item.planetId}
                    className="rounded-2xl p-4 sm:p-5 border border-amber-200 bg-white hover:bg-amber-50/30 transition-colors space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <strong className="text-base sm:text-lg font-bold text-amber-950">
                          {t(item.planetTe, item.planetEn)}
                        </strong>
                        <span className="text-xs font-semibold text-slate-600 ml-2">
                          — {t(item.rashiTe, item.rashiEn)} ({t(item.elementTe, item.elementEn)})
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${badgeStyles}`}>
                        {t(item.tierLabelTe, item.tierLabelEn)}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-amber-800">
                      {t(`లగ్నం నుండి స్థానం: ${item.houseNameTe}`, `Placement: ${item.houseNameEn}`)}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {t(item.analysisTe, item.analysisEn)}
                    </p>

                    <div className="pt-2 border-t border-amber-100 text-xs text-emerald-900 font-semibold">
                      🙏 {t('ఆరాధన / పరిహారం: ', 'Vedic Upasana: ')}
                      <span className="font-normal text-slate-700">{t(item.remedyTe, item.remedyEn)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            SECTION 3 (CHAPTER 4) — BHRIGU CHAKRA & NADI RAJA YOGAS
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'sutras') && (
          <div id="grantham-section-sutras" className="space-y-4 pt-4 border-t border-amber-200 scroll-mt-24">
            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200">
              <div className="text-xs font-bold text-amber-800 mb-1">
                {t('అధ్యాయం 4 · భృగు చక్ర పద్ధతి, విశేష జ్యోతిష్య నియమాలు & రాజయోగాలు', 'Chapter 4 · Bhrigu Chakra Paddhati, Special Sutras & Raja Yogas')}
              </div>
              <h5 className="text-lg sm:text-xl font-bold text-amber-950">
                {t(
                  'భృగు చక్ర పద్ధతి జన్మ మాస కేంద్ర స్థానం, గజకేసరి/బుధాదిత్య/ధర్మ-కర్మాధిపతి యోగాలు & విశేష ఫల సూత్రాలు',
                  'Bhrigu Chakra Paddhati Birth Month Focus House, Raja Yogas & Special Predictive Rules'
                )}
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {t(
                  'మీ జన్మ మాసం, శని ద్వితీయ స్థాన కర్మ నియమం, గజకేసరి యోగం, బుధాదిత్య యోగం మరియు రాజ్య-లాభాధిపతుల ఆధారంగా ప్రత్యేక ఫలితాలు:',
                  'Special predictive rules triggered by your birth month, Saturn’s 2nd-house rule, Gajakesari/Budhaditya Yogas, and 9th-10th-11th house lords:'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {predictions.specialSutras.map((sutra, idx) => (
                <div
                  key={sutra.id}
                  className="rounded-2xl p-4 sm:p-5 border border-amber-200 bg-white space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-amber-900">
                        {t(`సూత్రం #${idx + 1}`, `Rule #${idx + 1}`)}
                      </span>
                      <span className="font-bold text-emerald-800">
                        {t(sutra.badgeTe, sutra.badgeEn)}
                      </span>
                    </div>
                    <h6 className="text-base sm:text-lg font-bold text-amber-950">
                      {t(sutra.titleTe, sutra.titleEn)}
                    </h6>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {t(sutra.descriptionTe, sutra.descriptionEn)}
                    </p>
                  </div>
                  <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/80 text-xs font-semibold text-amber-950 mt-2">
                    💡 {t(sutra.remedyOrAdviceTe, sutra.remedyOrAdviceEn)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            SECTION 4 (CHAPTERS 5, 6, 7, 8)
            DWADASHA STANAMS (1-12), 9 PLANETS, 96-YEAR BHRIGU CYCLES & REMEDIES
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'bhavas') && (
          <div id="grantham-section-bhavas" className="space-y-8 pt-4 border-t border-amber-200 scroll-mt-24">
            {/* CHAPTER 5: All 12 Stanams Complete Life Analysis */}
            <div className="space-y-4">
              <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200">
                <div className="text-xs font-bold text-amber-800 mb-1">
                  {t('అధ్యాయం 5 · ద్వాదశ స్థాన సంపూర్ణ జీవిత ఫలితాలు (1 నుండి 12 స్థానాల సమగ్ర విశ్లేషణ)', 'Chapter 5 · Complete 1st to 12th House Life Domain Analysis')}
                </div>
                <h5 className="text-lg sm:text-xl font-bold text-amber-950">
                  {t(
                    `మీ జన్మ లగ్నం (${chartData.lagna.te}) నుండి 12 స్థానాల అధిపతులు, గ్రహ స్థితి & సమగ్ర జీవిత ఫలితాలు`,
                    `All 12 Houses from Your Ascendant (${chartData.lagna.en}) — Lords, Occupants & Detailed Predictions`
                  )}
                </h5>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t(
                    'ఆరోగ్యం, ధనం, సోదరులు, గృహ-వాహనాలు, విద్య-సంతానం, రుణ-రోగ జయం, వివాహం, ఆయుర్దాయం, భాగ్యం, ఉద్యోగం, లాభాలు మరియు మోక్షం — 12 స్థానాల పూర్తి విశ్లేషణ:',
                    'Exhaustive house-by-house evaluation covering wealth, property, education, marriage, career, longevity, and fortune:'
                  )}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {predictions.all12Houses.map((houseItem) => (
                  <div
                    key={houseItem.houseNumber}
                    className="rounded-2xl p-4 sm:p-5 border border-amber-200 bg-white hover:border-amber-400 transition-colors space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="font-mono font-bold text-amber-900">
                          {t(`${houseItem.houseNumber}వ స్థానం`, `House #${houseItem.houseNumber}`)}
                        </span>
                        <span className="font-semibold text-emerald-900">
                          {t(
                            `రాశి: ${houseItem.rashiInHouseTe} · అధిపతి: ${houseItem.lordTe} (${houseItem.lordPlacedInHouse}వ స్థానంలో)`,
                            `Sign: ${houseItem.rashiInHouseEn} · Lord: ${houseItem.lordEn} (in ${houseItem.lordPlacedInHouse}H)`
                          )}
                        </span>
                      </div>

                      <h6 className="text-base sm:text-lg font-bold text-amber-950">
                        {t(houseItem.bhavaTitleTe, houseItem.bhavaTitleEn)}
                      </h6>

                      {houseItem.occupantPlanetsTe.length > 0 && (
                        <div className="text-xs font-bold text-rose-900">
                          {t(
                            `ఈ స్థానంలోని గ్రహాలు: ${houseItem.occupantPlanetsTe.join(', ')}`,
                            `Planets in this House: ${houseItem.occupantPlanetsEn.join(', ')}`
                          )}
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {t(houseItem.detailedPredictionTe, houseItem.detailedPredictionEn)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-100 text-xs text-amber-900 font-semibold">
                      ✦ {t(houseItem.guidanceTe, houseItem.guidanceEn)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAPTER 6: 9 Grahas in 12 Stanams + Navamsha Vargottama Analysis */}
            <div className="space-y-4 pt-4 border-t border-amber-200">
              <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200">
                <div className="text-xs font-bold text-amber-800 mb-1">
                  {t('అధ్యాయం 6 · నవగ్రహ స్థాన, నక్షత్ర పాద & నవాంశ (D9) విశేష ఫలితాలు', 'Chapter 6 · 9 Planets Natal, Nakshatra Pada & D9 Navamsha Analysis')}
                </div>
                <h5 className="text-lg sm:text-xl font-bold text-amber-950">
                  {t(
                    'తొమ్మిది గ్రహాల రాశి, నక్షత్ర పాద, నవాంశ స్థితి & దశా ఫలితాల లోతైన విశ్లేషణ',
                    'In-Depth Analysis of All 9 Planets in Rashi, Nakshatra Pada & Navamsha'
                  )}
                </h5>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {predictions.bhavaPredictions.map((bp) => (
                  <div
                    key={bp.planetId}
                    className="rounded-2xl p-4 sm:p-5 border border-amber-200 bg-white hover:border-amber-400 transition-colors flex flex-col justify-between space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-base font-bold text-amber-950">
                          {t(bp.planetTe, bp.planetEn)}
                        </strong>
                        <span className="text-xs font-mono font-bold text-amber-900">
                          {t(bp.rashiTe, bp.rashiEn)} · {bp.degreeFormatted}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-emerald-800">
                        {t(bp.bhavaNameTe, bp.bhavaNameEn)}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {t(bp.predictionTe, bp.predictionEn)}
                      </p>

                      <p className="text-xs text-slate-600 leading-relaxed pt-1.5 border-t border-amber-100">
                        {t(bp.deepAnalysisTe, bp.deepAnalysisEn)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAPTER 7: 1 to 96 Years Life Progression */}
            <div className="space-y-4 pt-4 border-t border-amber-200">
              <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200">
                <div className="text-xs font-bold text-amber-800 mb-1">
                  {t('అధ్యాయం 7 · భృగు చక్ర పద్ధతి — ద్వాదశ వర్ష కాలచక్ర గమనం (1 నుండి 96 ఏళ్ల వయస్సు వరకు దశాబ్ద ఫలితాలు)', 'Chapter 7 · Bhrigu Chakra Paddhati — 12-Year Life Progression Cycles (Ages 1 to 96)')}
                </div>
                <h5 className="text-lg sm:text-xl font-bold text-amber-950">
                  {t(
                    'భృగు చక్ర పద్ధతి ప్రకారం 1 నుండి 96 ఏళ్ల వయస్సు వరకు ప్రతి 12 ఏళ్ల కాలచక్రం & జీవిత కీలక మలుపు సంవత్సరాలు',
                    'Bhrigu Chakra Paddhati 12-Year Life Progression Cycles & Exact Milestone Years (Ages 1 to 96)'
                  )}
                </h5>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {predictions.bhriguCycles.map((cycle) => (
                  <div
                    key={cycle.cycleNumber}
                    className="rounded-2xl p-4 sm:p-5 border border-amber-200 bg-white space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-amber-900">
                        {t(`కాలచక్రం #${cycle.cycleNumber}`, `Cycle #${cycle.cycleNumber}`)}
                      </span>
                      <span className="font-mono font-bold text-emerald-800">
                        {cycle.yearRange}
                      </span>
                    </div>

                    <h6 className="text-sm sm:text-base font-bold text-amber-950">
                      {t(cycle.ageRangeTe, cycle.ageRangeEn)} — {t(cycle.themeTe, cycle.themeEn)}
                    </h6>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {t(cycle.predictionTe, cycle.predictionEn)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAPTER 8: Lucky Gemstones, Rudraksha, Colors, Stotras & Shanti Pariharalu */}
            <div className="space-y-4 pt-4 border-t border-amber-200">
              <div className="bg-amber-950 text-white rounded-3xl p-5 sm:p-7 border border-amber-700 space-y-5">
                <div className="border-b border-amber-800 pb-4">
                  <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Gem size={14} />
                    <span>
                      {t(
                        'అధ్యాయం 8 · అదృష్ట రత్నం, రుద్రాక్ష, ఆరాధ్య దైవం & సంపూర్ణ వైదిక శాంతి పరిహారాలు',
                        'Chapter 8 · Lucky Gemstone, Rudraksha, Deity & Vedic Remedies'
                      )}
                    </span>
                  </div>
                  <h5 className="text-xl sm:text-2xl font-bold text-white">
                    {t(
                      `${name} గారికి శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయ శాస్త్రోక్త పరిహార సూచనలు`,
                      `Prescribed Vedic Remedies & Lucky Guidelines for ${name}`
                    )}
                  </h5>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-amber-900/70 rounded-2xl p-4 border border-amber-700/80 space-y-1.5">
                    <span className="text-xs text-amber-300 font-bold block">
                      💎 {t('అదృష్ట రత్నం (Lucky Gemstone)', 'Lucky Gemstone (Ratnam)')}
                    </span>
                    <strong className="text-sm sm:text-base text-white block">
                      {t(predictions.remedies.luckyGemstoneTe, predictions.remedies.luckyGemstoneEn)}
                    </strong>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {t(predictions.remedies.wearingMethodTe, predictions.remedies.wearingMethodEn)}
                    </p>
                  </div>

                  <div className="bg-amber-900/70 rounded-2xl p-4 border border-amber-700/80 space-y-1.5">
                    <span className="text-xs text-amber-300 font-bold block">
                      📿 {t('అనుకూల రుద్రాక్ష & ఆరాధ్య దైవం', 'Auspicious Rudraksha & Deity')}
                    </span>
                    <strong className="text-sm sm:text-base text-white block">
                      {t(predictions.remedies.rudrakshaTe, predictions.remedies.rudrakshaEn)}
                    </strong>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {t(`ఆరాధ్య దైవం: ${predictions.remedies.aradhyaDeivamTe}`, `Guiding Deity: ${predictions.remedies.aradhyaDeivamEn}`)}
                    </p>
                  </div>

                  <div className="bg-amber-900/70 rounded-2xl p-4 border border-amber-700/80 space-y-1.5">
                    <span className="text-xs text-amber-300 font-bold block">
                      🌟 {t('అదృష్ట సంఖ్యలు, వారాలు & రంగులు', 'Lucky Numbers, Days & Colors')}
                    </span>
                    <strong className="text-sm sm:text-base text-white block">
                      {t(`సంఖ్యలు: ${predictions.remedies.luckyNumbers} · వారాలు: ${predictions.remedies.luckyDaysTe}`, `Numbers: ${predictions.remedies.luckyNumbers} · Days: ${predictions.remedies.luckyDaysEn}`)}
                    </strong>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {t(`అనుకూల రంగులు: ${predictions.remedies.luckyColorsTe}`, `Lucky Colors: ${predictions.remedies.luckyColorsEn}`)}
                    </p>
                  </div>

                  <div className="bg-amber-900/70 rounded-2xl p-4 border border-amber-700/80 space-y-1.5 sm:col-span-2">
                    <span className="text-xs text-amber-300 font-bold block">
                      📖 {t('నిత్య పారాయణ స్తోత్రాలు & దాన పరిహారాలు', 'Daily Parayana Stotras & Charitable Remedies')}
                    </span>
                    <strong className="text-sm sm:text-base text-white block">
                      {t(predictions.remedies.nityaStotraTe, predictions.remedies.nityaStotraEn)}
                    </strong>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {t(`దాన ధర్మాలు: ${predictions.remedies.danaPariharamTe}`, `Charitable Remedies: ${predictions.remedies.danaPariharamEn}`)}
                    </p>
                  </div>

                  <div className="bg-emerald-900/80 rounded-2xl p-4 border border-emerald-600/80 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-emerald-300 font-bold block">
                        🕉️ {t('శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం', 'Sri Lakshmi Ganapathi Jyothishalayam')}
                      </span>
                      <strong className="text-sm text-white block mt-0.5">
                        {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Brahmasri Jallavaram Sai Dheeraj Sharma')}
                      </strong>
                      <p className="text-xs text-emerald-100 mt-1">
                        {t('తెలుగు జ్యోతిషం (Telugu Jyothisham)', 'Telugu Jyothisham · Vedic Astrology')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Width 120-Year Vimshottari Mahadasha & Antardasha Breakdown */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
              <Star size={18} className="text-amber-700" />
              <span>{t('120 ఏళ్ల వింశోత్తరి మహాదశ & అంతర్దశ కాలచక్రం', '120-Year Vimshottari Mahadasha & Antardasha Timeline')}</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {t(
                `${chartData.nakshatraName} (${chartData.pada}వ పాదం) ఆధారంగా మీ జీవితంలోని నవగ్రహ మహాదశల వరుస క్రమం మరియు భుక్తి వివరాలు:`,
                `Sequence of planetary Mahadasha & Antardasha periods calculated from ${chartData.nakshatraName} (Pada ${chartData.pada}):`
              )}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3.5">
          {chartData.dashaList.map((d) => (
            <div
              key={d.lordTe}
              className={`p-4 rounded-2xl border transition-colors ${
                d.isCurrent
                  ? 'bg-amber-100/90 border-amber-500 shadow-2xs'
                  : 'bg-amber-50/30 border-amber-200/80 hover:bg-amber-50/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm sm:text-base font-bold text-amber-950">
                  {t(d.lordTe, d.lordEn)}
                </strong>
                <span className="font-mono tabular-nums text-xs font-bold text-amber-900 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                  {d.startYear} – {d.endYear}
                </span>
              </div>
              {d.isCurrent && (
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-800">
                  ● {t('ప్రస్తుతం నడుస్తున్న మహాదశ', 'Currently Active Mahadasha')}
                </span>
              )}
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                {t(d.summaryTe, d.summaryEn)}
              </p>
              <div className="mt-2 pt-2 border-t border-amber-200/60 text-[11px] text-slate-600">
                <span className="font-bold text-amber-950 block mb-0.5">
                  {t('అంతర్దశల క్రమం (Bhuktis):', 'Antardasha Sequence:')}
                </span>
                <p className="leading-relaxed">
                  {d.antardashas
                    .map((ad) => `${t(ad.lordTe.replace(' అంతర్దశ', ''), ad.lordEn.replace(' Bhukti', ''))} (${ad.months}నె)`)
                    .join(' · ')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={whatsappConsultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-colors no-print"
        >
          <MessageCircle size={18} />
          <span>
            {t(
              'ఈ జన్మ కుండలిని ధీరజ్ శర్మ గారికి వాట్సాప్ పంపి వ్యక్తిగత జాతక పరిశీలన పొందండి',
              'Send Kundali to Sri Dheeraj Sharma on WhatsApp for Personal Consultation'
            )}
          </span>
        </a>
      </div>

      {/* Print Preview & Direct Download Modal (Guarantees Print & Save on Mobile and Desktop) */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 border-2 border-amber-400 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-amber-200 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  {t('శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · జాతక నివేదిక ప్రింట్ & సేవ్', 'Print & Download Horoscope Report')}
                </span>
                <h4 className="text-lg sm:text-2xl font-bold text-amber-950 mt-0.5">
                  {t(`${name} గారి సంపూర్ణ జాతక ఫలితాల నివేదిక సిద్ధంగా ఉంది`, `${name}'s Complete Horoscope Report is Ready`)}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t(
                'మీ మొబైల్ లేదా కంప్యూటర్‌లో జాతక ఫలితాలను నేరుగా ప్రింట్ చేయడానికి లేదా పూర్తి జాతక ఫైల్‌ను / కుండలి చార్ట్ ఇమేజ్‌ను మీ ఫోన్‌లో సేవ్ చేసుకోవడానికి క్రింది బటన్లను ఉపయోగించండి:',
                'Use the options below to print directly, download the complete printable horoscope document, or save the high-resolution Janma Kundali chart image to your phone/computer:'
              )}
            </p>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={handleDownloadPrintableFile}
                className="flex flex-col items-start gap-1.5 p-4 rounded-2xl bg-amber-900 hover:bg-amber-800 text-white text-left transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-amber-200">
                  <Download size={18} />
                  <span>{t('1. పూర్తి జాతక ఫైల్ డౌన్‌లోడ్', '1. Download Full Horoscope File')}</span>
                </div>
                <span className="text-xs text-amber-100/90 leading-relaxed">
                  {t(
                    '8 అధ్యాయాలు, D1/D9 చక్రాలు, 12 స్థానాల ఫలితాలతో కూడిన ప్రింట్ ఫైల్ (.html) మీ ఫోన్/కంప్యూటర్‌లోకి డౌన్‌లోడ్ అవుతుంది.',
                    'Downloads the complete 8-chapter printable horoscope report to your device.'
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadKundaliImage}
                className="flex flex-col items-start gap-1.5 p-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-left transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-200">
                  <ImageIcon size={18} />
                  <span>{t('2. జన్మ కుండలి పత్రిక ఇమేజ్ (PNG)', '2. Download Kundali Chart Image')}</span>
                </div>
                <span className="text-xs text-emerald-100/90 leading-relaxed">
                  {t(
                    'రాశి చక్రం (D1), నవాంశ చక్రం (D9), గ్రహ డిగ్రీలు మరియు పరిహారాలతో కూడిన హై-క్వాలిటీ ఫోటో డౌన్‌లోడ్ అవుతుంది.',
                    'Saves a high-resolution traditional Janma Kundali Patrika image (PNG) to your gallery.'
                  )}
                </span>
              </button>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-amber-950">
                <strong>{t('నేరుగా ప్రింటర్ ద్వారా ప్రింట్ చేయాలంటే:', 'Direct Browser Print Dialog:')}</strong>
                <p className="text-slate-600 mt-0.5">
                  {t(
                    'ప్రింట్ డైలాగ్ తెరుచుకోకపోతే పైన ఉన్న "పూర్తి జాతక ఫైల్ డౌన్‌లోడ్" బటన్ నొక్కి ఆ ఫైల్ ఓపెన్ చేసి ప్రింట్ తీసుకోవచ్చు.',
                    'If your browser blocks popups, download the file above and open it to print.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm cursor-pointer"
              >
                <Printer size={15} />
                <span>{t('ప్రింట్ డైలాగ్ తెరవండి', 'Open Print Dialog')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
