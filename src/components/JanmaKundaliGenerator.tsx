import React, { useState, useMemo, useEffect } from 'react';
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
  TrendingUp,
  Activity,
  BarChart3,
  Award,
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
  generateLifeEventProbabilityTimeline,
  computeSarvashtakavargaMatrix,
} from '../utils/kundaliPredictionsEngine';
import { generateSaptamaMarriageAnalysis } from '../utils/saptamaVisleshanaEngine';
import {
  buildComprehensiveJathakaPdfHtml,
  JathakaReportVariant,
} from '../utils/jathakamReportPdfGenerator';
import {
  computePlanetaryDignities,
  checkNeechaBhangaRajaYoga,
  detectAllYogasAndDoshas,
  evaluateTripleKujaDosha,
  calculateDynamicMarriageTiming,
  computeVimshottariFullTimeline,
  computeNext12MonthsGochara,
  buildPanchangaBirthProfile,
  generateExecutiveSummary,
} from '../utils/advancedAstrologyReportEngine';

interface JanmaKundaliGeneratorProps {
  onOpenBooking?: () => void;
  prefillClient?: {
    name: string;
    birthDate: string;
    birthTime: string;
    cityId: string;
    autoOpenPrint?: boolean;
  } | null;
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

export const JanmaKundaliGenerator: React.FC<JanmaKundaliGeneratorProps> = ({ prefillClient }) => {
  const { t, language } = useLanguage();
  const [name, setName] = useState<string>(prefillClient?.name || 'శ్రీనివాస రావు');
  const [birthDate, setBirthDate] = useState<string>(prefillClient?.birthDate || '1994-08-15');
  const [birthTime, setBirthTime] = useState<string>(prefillClient?.birthTime || '09:30');
  const [selectedCityId, setSelectedCityId] = useState<string>(prefillClient?.cityId || 'hyderabad');
  const [chartMode, setChartMode] = useState<'D1' | 'D9'>('D1');
  const [predictionTab, setPredictionTab] = useState<'sunmoon' | 'elements' | 'sutras' | 'timeline' | 'ashtakavarga' | 'bhavas'>('sunmoon');
  const [showFullGrantham, setShowFullGrantham] = useState<boolean>(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(Boolean(prefillClient?.autoOpenPrint));
  const [pdfPreviewVariant, setPdfPreviewVariant] = useState<JathakaReportVariant>('sample');
  const [useTemplatePlaceholders, setUseTemplatePlaceholders] = useState<boolean>(false);
  const previewIframeRef = React.useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (prefillClient) {
      if (prefillClient.name) setName(prefillClient.name);
      if (prefillClient.birthDate) setBirthDate(prefillClient.birthDate);
      if (prefillClient.birthTime) setBirthTime(prefillClient.birthTime);
      if (prefillClient.cityId) setSelectedCityId(prefillClient.cityId);
      if (prefillClient.autoOpenPrint) setIsPrintModalOpen(true);
    }
  }, [prefillClient]);

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
    const moonPlanet = chartData.planets.find((p) => p.id === 'moon') || chartData.planets[2];
    const moonIdx = moonPlanet?.rashiIdx ?? 0;

    const dignities = computePlanetaryDignities(chartData.planets, lagnaIdx);
    const neechaBhanga = checkNeechaBhangaRajaYoga(dignities, chartData.planets, lagnaIdx);
    const yogas = detectAllYogasAndDoshas(chartData.planets, lagnaIdx, dignities);
    const tripleKuja = evaluateTripleKujaDosha(chartData.planets, lagnaIdx);
    const marriageTiming = calculateDynamicMarriageTiming(birthDate, lagnaIdx, moonIdx);
    const dashaInfo = computeVimshottariFullTimeline(moonPlanet?.longitude ?? 220, birthDate, birthTime);
    const gochara12m = computeNext12MonthsGochara(moonIdx, lagnaIdx);
    const panchangaProfile = buildPanchangaBirthProfile(chartData, birthDate, birthTime, selectedCity.labelTe);
    const execSummary = generateExecutiveSummary(dignities, yogas, tripleKuja, dashaInfo, marriageTiming);

    return {
      lagnaProfile: generateLagnaCompleteProfile(chartData.planets, lagnaIdx),
      sunMoon144: getSunMoonCombination144(sunIdx, moonIdx),
      elementStrengths: evaluateMehtaElementalStrengths(chartData.planets, lagnaIdx),
      specialSutras: evaluateMehtaSpecialSutras(chartData.planets, lagnaIdx, birthDate),
      eventTimelines: generateLifeEventProbabilityTimeline(chartData.planets, lagnaIdx, birthDate),
      ashtakavarga: computeSarvashtakavargaMatrix(chartData.planets, lagnaIdx),
      bhavaPredictions: generateBhavaPredictions(chartData.planets, lagnaIdx),
      all12Houses: generateAll12HousesCompleteAnalysis(chartData.planets, lagnaIdx),
      bhriguCycles: generateBhriguLifeProgression(chartData.planets, lagnaIdx, birthDate),
      remedies: generateVedicRemediesProfile(lagnaIdx, moonIdx),
      saptamaMarriage: generateSaptamaMarriageAnalysis(chartData.planets, lagnaIdx, birthDate),
      dignities,
      neechaBhanga,
      yogas,
      tripleKuja,
      marriageTiming,
      dashaInfo,
      gochara12m,
      panchangaProfile,
      execSummary,
    };
  }, [chartData, birthDate, birthTime, selectedCity]);

  const activeDasha = chartData.dashaList.find((d) => d.isCurrent) || chartData.dashaList[0];

  const whatsappConsultUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ గారు, నా దృక్సిద్ధాంత జన్మ కుండలి వివరాలు:\nపేరు: ${name}\nపుట్టిన తేదీ: ${birthDate}\nసమయం: ${birthTime}\nప్రాంతం: ${selectedCity.labelTe}\nజన్మ రాశి: ${chartData.rashi.te}\nజన్మ నక్షత్రం: ${chartData.nakshatraName} (${chartData.pada}వ పాదం)\nజన్మ లగ్నం (D1): ${chartData.lagna.te}\nనవాంశ లగ్నం (D9): ${chartData.navamshaLagna.te}\nప్రస్తుత మహాదశ: ${activeDasha.lordTe}.\nసంపూర్ణ జాతక పరిశీలన మరియు పరిహారాల కోసం సంప్రదిస్తున్నాను.`
  )}`;

  const activePlanetsMap = chartMode === 'D1' ? chartData.d1RashiPlanets : chartData.d9NavamshaPlanets;
  const activeLagnaId = chartMode === 'D1' ? chartData.lagna.id : chartData.navamshaLagna.id;

  const handleSelectSection = (tab: 'sunmoon' | 'elements' | 'sutras' | 'timeline' | 'ashtakavarga' | 'bhavas') => {
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
  const buildPrintableHtmlDocument = (
    overrideVariant?: JathakaReportVariant,
    overridePlaceholders?: boolean
  ): string => {
    return buildComprehensiveJathakaPdfHtml({
      name: name.trim() || "జాతకుడు",
      birthDate,
      birthTime,
      cityName: selectedCity.labelTe,
      chartData,
      language: language === "en" ? "en" : "te",
      variant: overrideVariant ?? pdfPreviewVariant,
      usePlaceholders: overridePlaceholders ?? useTemplatePlaceholders,
    });
  };

  // Memoized HTML for the interactive live A4/Mobile Template Preview
  const liveTemplateHtml = useMemo(
    () =>
      buildComprehensiveJathakaPdfHtml({
        name: name.trim() || "జాతకుడు",
        birthDate,
        birthTime,
        cityName: selectedCity.labelTe,
        chartData,
        language: language === "en" ? "en" : "te",
        variant: pdfPreviewVariant,
        usePlaceholders: useTemplatePlaceholders,
      }),
    [name, birthDate, birthTime, selectedCity, chartData, language, pdfPreviewVariant, useTemplatePlaceholders]
  );

  // Print the clean A4 / Mobile PDF template directly via the embedded iframe
  const handlePrintCleanTemplate = (targetVariant?: JathakaReportVariant) => {
    if (targetVariant && targetVariant !== pdfPreviewVariant) {
      setPdfPreviewVariant(targetVariant);
    }
    setTimeout(() => {
      try {
        if (previewIframeRef.current?.contentWindow) {
          previewIframeRef.current.contentWindow.focus();
          previewIframeRef.current.contentWindow.print();
          return;
        }
        window.print();
      } catch {
        setIsPrintModalOpen(true);
      }
    }, 120);
  };

  // Trigger native print immediately during user gesture + open Print/Download Modal
  const handlePrintHoroscope = () => {
    handlePrintCleanTemplate(pdfPreviewVariant);
  };

  // Trigger print directly from inside the modal by closing modal first
  const handleTriggerDirectPrint = () => {
    setIsPrintModalOpen(false);
    handlePrintCleanTemplate('a4-full');
  };

  // Direct 1-click download of the complete printable Horoscope file (.html)
  const handleDownloadPrintableFile = (
    overrideVariant?: JathakaReportVariant,
    overridePlaceholders?: boolean
  ) => {
    const chosenVariant = overrideVariant ?? pdfPreviewVariant;
    const chosenPlaceholders = overridePlaceholders ?? useTemplatePlaceholders;
    const htmlContent = buildPrintableHtmlDocument(chosenVariant, chosenPlaceholders);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = name.trim().replace(/\s+/g, '_') || 'Janma_Kundali';
    const suffix =
      chosenPlaceholders
        ? 'Placeholder_Template'
        : chosenVariant === 'sample'
        ? 'Sample_Cover_Top3_A4'
        : chosenVariant === 'mobile'
        ? 'Mobile_WhatsApp_Edition'
        : 'Full_A4_Jathakam_Report';
    link.href = url;
    link.download = `${safeName}_${suffix}.html`;
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
      planetsMap: Record<number, { nameTe: string; isRetro?: boolean }[]>,
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

  // Strict DD° MM' SS" formatter from sidereal longitude so minutes (') and seconds (") never swap
  const formatStrictPlanetDms = (longitude: number, fallback: string): string => {
    if (typeof longitude !== 'number' || Number.isNaN(longitude)) return fallback;
    const normLon = ((longitude % 360) + 360) % 360;
    const rashiIdx = Math.floor(normLon / 30) % 12;
    const lonInSign = normLon - rashiIdx * 30;
    const deg = Math.floor(lonInSign);
    const minFloat = (lonInSign - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.min(59, Math.round((minFloat - min) * 60));
    return `${String(deg).padStart(2, '0')}°\u00A0${String(min).padStart(2, '0')}'\u00A0${String(sec).padStart(2, '0')}"`;
  };

  // Non-overlapping in-flow Print Page Header (Astrologer Name & Native Name Centered)
  const renderPrintPageHeader = () => (
    <div className="print-only mb-2">
      <div className="grid grid-cols-3 items-center w-full border-b-2 border-[#b45309] bg-gradient-to-r from-[#fffbeb] via-[#fef3c7] to-[#fffbeb] px-2.5 py-1 rounded-t-xl text-[9px] font-bold text-[#78350f]">
        <a
          href="https://www.telugujyothisham.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-left truncate text-[#78350f] underline"
        >
          🪷 శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · telugujyothisham.com
        </a>
        <span className="text-center font-extrabold text-[#451a03] text-[10px] truncate">
          బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు · జాతకులు: {name}
        </span>
        <span className="text-right truncate">
          పుట్టిన తేదీ: {birthDate} · {birthTime} ({selectedCity.labelTe.split(' (')[0]})
        </span>
      </div>
    </div>
  );

  // Non-overlapping in-flow Print Page Footer (Clickable Website URL Centered)
  const renderPrintPageFooter = (sectionLabel?: string) => (
    <div className="print-only mt-2">
      <div className="grid grid-cols-3 items-center w-full border-t-2 border-[#b45309] bg-gradient-to-r from-[#fffbeb] via-[#fef3c7] to-[#fffbeb] px-2.5 py-1 rounded-b-xl text-[9px] font-bold text-[#78350f]">
        <a
          href={whatsappConsultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left truncate text-[#78350f] underline"
        >
          శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · వాట్సాప్: +91 89779 86166
        </a>
        <div className="text-center">
          <a
            href="https://www.telugujyothisham.com"
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            className="notranslate inline-block font-extrabold text-[#991b1b] bg-[#fef08a] px-2.5 py-0.5 rounded-full border border-[#d97706] text-[9.5px] font-mono underline"
          >
            🌐 https://www.telugujyothisham.com
          </a>
        </div>
        <span className="text-right truncate">
          బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు{sectionLabel ? ` · ${sectionLabel}` : ` · జాతకులు: ${name}`}
        </span>
      </div>
    </div>
  );

  // Helper to render a strict 1:1 Square Temple Kundali Image Plate (D1 or D9)
  const renderRoyalKundaliImagePlate = (plateMode: 'D1' | 'D9') => {
    const plateMap = plateMode === 'D1' ? chartData.d1RashiPlanets : chartData.d9NavamshaPlanets;
    const plateLagnaId = plateMode === 'D1' ? chartData.lagna.id : chartData.navamshaLagna.id;
    const plateLagnaIdx = RASHI_12.findIndex((r) => r.id === plateLagnaId);

    const renderSingleSquareCell = (rIdx: number, row: number, col: number) => {
      const rashiInfo = RASHI_12[rIdx];
      const cellPlanets = plateMap[rIdx] || [];
      const isLagna = rashiInfo.id === plateLagnaId;
      const isJanmaRashi = rashiInfo.id === chartData.rashi.id && plateMode === 'D1';
      const houseNum = ((rIdx - (plateLagnaIdx >= 0 ? plateLagnaIdx : 0) + 12) % 12) + 1;

      return (
        <div
          key={rIdx}
          style={{ gridRow: row, gridColumn: col }}
          className={`min-w-0 min-h-0 p-1 sm:p-1.5 print:p-1 border-[1.5px] border-[#78350f] relative flex flex-col justify-between overflow-hidden ${
            isLagna
              ? 'bg-gradient-to-br from-[#fef3c7] via-[#fde68a] to-[#fcd34d]'
              : isJanmaRashi
              ? 'bg-gradient-to-br from-[#ecfdf5] via-[#d1fae5] to-[#a7f3d0]'
              : 'bg-[#fffdf7]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-dashed border-amber-700/40 pb-0.5 mb-0.5">
              <span className="text-[8.5px] sm:text-[10px] print:text-[8px] font-extrabold text-[#78350f] leading-none truncate">
                {rashiInfo.te}
              </span>
              <span className="text-[7px] sm:text-[8px] print:text-[6.5px] font-bold text-[#9a3412] bg-[#ffedd5] border border-[#fdba74] px-0.5 rounded leading-none shrink-0">
                {houseNum}వ
              </span>
            </div>

            {isLagna && (
              <div className="inline-block text-[7px] sm:text-[8px] print:text-[6.5px] font-extrabold text-white bg-[#991b1b] px-1 py-0 rounded leading-tight mb-0.5">
                ★ లగ్నం
              </div>
            )}
            {!isLagna && isJanmaRashi && (
              <div className="inline-block text-[7px] sm:text-[8px] print:text-[6.5px] font-extrabold text-white bg-[#065f46] px-1 py-0 rounded leading-tight mb-0.5">
                ☽ రాశి
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-0.5 content-start">
            {cellPlanets
              .filter((pl) => pl.nameTe !== 'లగ్నం')
              .map((pl) => {
                const fullPlanet = chartData.planets.find((fp) => fp.nameTe === pl.nameTe);
                const dig = predictions.dignities.find((d) => d.nameTe === pl.nameTe);
                const shortDeg = fullPlanet ? `${fullPlanet.degreeFormatted.split('°')[0]}°` : '';
                const isSun = pl.nameTe === 'సూర్యుడు';
                const isMoon = pl.nameTe === 'చంద్రుడు';
                const isMars = pl.nameTe === 'కుజుడు';
                const isJup = pl.nameTe === 'గురువు';

                return (
                  <span
                    key={pl.nameTe}
                    className={`inline-flex items-center gap-0.5 text-[8px] sm:text-[9.5px] print:text-[7.5px] font-extrabold px-0.5 py-0 rounded border leading-tight ${
                      isSun
                        ? 'bg-orange-50 border-orange-300 text-orange-950'
                        : isMoon
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : isMars
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : isJup
                        ? 'bg-amber-100/90 border-amber-400 text-amber-950'
                        : 'bg-white/95 border-amber-300 text-slate-900'
                    }`}
                  >
                    <span>
                      {pl.nameTe}
                      {pl.isRetro && pl.nameTe !== 'రాహువు' && pl.nameTe !== 'కేతువు' ? '(వ)' : ''}
                    </span>
                    {plateMode === 'D1' && shortDeg && (
                      <span className="text-[7px] font-mono text-amber-900 font-bold" translate="no">
                        {shortDeg}
                      </span>
                    )}
                    {plateMode === 'D1' && dig?.dignityCode === 'ucha' && (
                      <span className="text-[6.5px] bg-emerald-700 text-white px-0.5 rounded">ఉచ్చ</span>
                    )}
                    {plateMode === 'D1' && dig?.dignityCode === 'neecha' && (
                      <span className="text-[6.5px] bg-rose-700 text-white px-0.5 rounded">నీచ</span>
                    )}
                  </span>
                );
              })}
          </div>
        </div>
      );
    };

    const outerCells: { rIdx: number; row: number; col: number }[] = [
      { rIdx: 11, row: 1, col: 1 },
      { rIdx: 0, row: 1, col: 2 },
      { rIdx: 1, row: 1, col: 3 },
      { rIdx: 2, row: 1, col: 4 },
      { rIdx: 10, row: 2, col: 1 },
      { rIdx: 3, row: 2, col: 4 },
      { rIdx: 9, row: 3, col: 1 },
      { rIdx: 4, row: 3, col: 4 },
      { rIdx: 8, row: 4, col: 1 },
      { rIdx: 7, row: 4, col: 2 },
      { rIdx: 6, row: 4, col: 3 },
      { rIdx: 5, row: 4, col: 4 },
    ];

    return (
      <div className="p-2 sm:p-3 print:p-2 rounded-2xl bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fde68a] border-4 border-[#78350f] ring-2 ring-[#d97706] shadow-md print-card">
        <div className="flex items-center justify-between text-[9.5px] sm:text-xs print:text-[9px] font-extrabold text-[#78350f] pb-1 mb-1.5 border-b-2 border-[#b45309]">
          <span>🪷 శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం</span>
          <span className="bg-[#78350f] text-[#fef08a] px-2 py-0.5 rounded-full border border-[#f59e0b]">
            {plateMode === 'D1' ? 'రాశి చక్రం (D1 Rashi)' : 'నవాంశ చక్రం (D9 Navamsha)'}
          </span>
          <span>దృక్సిద్ధాంతం 🪷</span>
        </div>

        {/* Strict 1:1 Square Grid (252px x 252px in print, 312px x 312px on desktop) */}
        <div
          style={{ aspectRatio: '1 / 1' }}
          className="w-[252px] h-[252px] sm:w-[312px] sm:h-[312px] print:w-[252px] print:h-[252px] aspect-square mx-auto grid grid-cols-4 grid-rows-4 border-[2.5px] border-[#78350f] bg-[#fffdf7]"
        >
          {outerCells.map((c) => renderSingleSquareCell(c.rIdx, c.row, c.col))}

          {/* Center 2x2 Box with Full Unclipped Domain */}
          <div
            style={{ gridColumn: '2 / 4', gridRow: '2 / 4' }}
            className="border-[2px] border-[#78350f] bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#451a03] text-[#fef3c7] p-1 sm:p-1.5 print:p-1 flex flex-col items-center justify-center text-center overflow-visible"
          >
            <div className="w-full h-full border border-amber-400/60 rounded-lg p-1 sm:p-1.5 bg-black/15 flex flex-col items-center justify-center overflow-visible">
              <div className="text-[7.5px] sm:text-[9px] print:text-[7.2px] font-bold text-amber-300 leading-tight">
                || ఓం శ్రీ మహాగణాధిపతయే నమః ||
              </div>
              <div className="inline-block bg-gradient-to-r from-[#f59e0b] via-[#fde047] to-[#f59e0b] text-[#451a03] font-extrabold text-[9.5px] sm:text-[11px] print:text-[9px] px-2 py-0.5 rounded-full mt-0.5 shadow-2xs leading-tight">
                {plateMode === 'D1' ? 'రాశి చక్రం (D1)' : 'నవాంశ చక్రం (D9)'}
              </div>
              <div className="text-[10px] sm:text-xs print:text-[9.5px] font-extrabold text-white mt-0.5 leading-tight truncate max-w-full">
                {name}
              </div>
              <div className="text-[8px] sm:text-[9.5px] print:text-[7.5px] font-mono font-bold text-amber-200 mt-0.5 leading-tight">
                {birthDate} · {birthTime} ({selectedCity.labelTe.split(' (')[0]})
              </div>
              <div className="text-[8px] sm:text-[9.5px] print:text-[7.5px] font-extrabold text-emerald-300 mt-0.5 leading-tight">
                {plateMode === 'D1'
                  ? `లగ్నం: ${chartData.lagna.te} | రాశి: ${chartData.rashi.te}`
                  : `నవాంశ లగ్నం: ${chartData.navamshaLagna.te}`}
              </div>
              <div className="text-[7.5px] sm:text-[9px] print:text-[7.2px] font-bold text-amber-300 mt-0.5 leading-tight">
                నక్షత్రం: {chartData.nakshatraName} ({chartData.pada}వ పాదం)
              </div>
              <a
                href="https://www.telugujyothisham.com"
                target="_blank"
                rel="noopener noreferrer"
                translate="no"
                className="notranslate text-[7.5px] sm:text-[8.5px] print:text-[7px] text-[#fde047] hover:text-white underline font-bold mt-0.5 pt-0.5 border-t border-amber-500/30 font-mono leading-none overflow-visible whitespace-nowrap block"
              >
                www.telugujyothisham.com
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-1 text-[8.5px] sm:text-[10px] print:text-[8px] font-bold text-[#78350f] pt-1 mt-1 border-t border-[#d97706]">
          <span className="text-left truncate">
            ★ లగ్నం: {plateMode === 'D1' ? chartData.lagna.te : chartData.navamshaLagna.te}
          </span>
          <a
            href="https://www.telugujyothisham.com"
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            className="notranslate font-mono font-extrabold text-[#991b1b] hover:text-[#78350f] underline text-center"
          >
            www.telugujyothisham.com
          </a>
          <span className="text-right truncate">
            ☽ రాశి: {chartData.rashi.te} · ☉ {chartData.planets[1]?.rashiTe || 'కర్కాటకం'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 print:space-y-0 font-telugu pb-8 print:pb-0" translate="no">
      {/* Birth Details Form with Drik Siddhanta Badge (Interactive Screen Only) */}
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
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
              {t(
                'మీ జాతకం తెలుసుకోండి — Free Jathakam by Date of Birth in Telugu (సమగ్ర బృహత్ జాతక నివేదిక PDF)',
                'Free Jathakam by Date of Birth in Telugu — Comprehensive Janma Kundali & Horoscope Predictions PDF'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t(
                'పుట్టిన తేదీ, సమయంతో ఉచిత సంపూర్ణ జాతకం (Astrology in Telugu by Date of Birth and Time Free Download): రాశి చక్రం (D1), నవాంశ (D9), గ్రహ భావాలు మరియు 120 ఏళ్ల వింశోత్తరి మహాదశ ఫలితాలు.',
                'Generate instant free Telugu Jatakam (Astrology in Telugu by date of birth and time free download): D1 Rashi, D9 Navamsha, exact planetary degrees, and 120-year Vimshottari Mahadasha report.'
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

        {/* Instant 1-Click Sample PDF & Report Action Bar at the Top */}
        <div className="mt-4 pt-4 border-t border-amber-300/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>
              {t(
                `ప్రస్తుత జాతక నివేదిక సిద్ధంగా ఉంది: ${name} (${birthDate} · ${birthTime} · ${selectedCity.labelTe.split(' (')[0]})`,
                `Horoscope Report Ready: ${name} (${birthDate} · ${birthTime})`
              )}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handlePrintCleanTemplate(pdfPreviewVariant)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#4A1D0A] via-[#6b2a0f] to-[#4A1D0A] hover:from-[#2C1005] hover:to-[#4A1D0A] text-[#FFF8E7] border-2 border-[#E8A317] shadow-md transition-all cursor-pointer"
            >
              <Printer size={16} className="text-[#E8A317]" />
              <span>
                {t('🖨️ ప్రీమియం A4 జాతకం PDF ప్రింట్ / సేవ్', '🖨️ Print / Save Premium A4 PDF')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPrintableFile('a4-full', false)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
            >
              <Download size={15} />
              <span>
                {t('📥 పూర్తి A4 జాతక ఫైల్ (.html)', '📥 Download Full A4 Report (.html)')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPrintableFile('mobile', false)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#FFF8E7] hover:bg-amber-100 text-[#4A1D0A] border border-[#E8A317] transition-all cursor-pointer"
            >
              <Download size={15} className="text-[#4A1D0A]" />
              <span>
                {t('📱 వాట్సాప్ మొబైల్ వెర్షన్ (.html)', '📱 WhatsApp Mobile Variant')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadKundaliImage}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 transition-all cursor-pointer"
            >
              <ImageIcon size={15} className="text-amber-800" />
              <span>
                {t('🖼️ కుండలి ఫోటో (.png)', '🖼️ Kundali Image (.png)')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          REDESIGNED PREMIUM A4 PDF TEMPLATE LIVE PREVIEW
          Starts with Sample Preview (Page 1 Cover + Page 2 "Your Top 3 Insights")
          ========================================================================== */}
      <div className="rounded-3xl border-2 border-[#E8A317] bg-[#FFF8E7] shadow-xl overflow-hidden no-print">
        <div className="bg-[#4A1D0A] text-[#FFF8E7] px-4 sm:px-6 py-4 border-b-2 border-[#E8A317] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#FDE68A] tracking-wider uppercase">
              శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · PREMIUM A4 PRINT-READY PDF TEMPLATE (#4A1D0A · #E8A317 · #FFF8E7)
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              {pdfPreviewVariant === 'sample'
                ? '1. Sample Preview: Cover Page (Page 1) + "Your Top 3 Insights" (Page 2)'
                : pdfPreviewVariant === 'mobile'
                ? '3. Mobile Single-Column Variant (WhatsApp Sharing · Larger 13pt Fonts)'
                : '2. Complete 12-Page A4 Horoscope Report (Chapters 1–10, D1/D9 Charts, Dasha Bar & QR)'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPdfPreviewVariant('sample')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer border ${
                pdfPreviewVariant === 'sample'
                  ? 'bg-[#E8A317] text-[#2C1005] border-white shadow-sm'
                  : 'bg-[#2C1005]/70 text-[#FFF8E7] border-[#E8A317]/50 hover:bg-[#2C1005]'
              }`}
            >
              ✨ Sample (Cover + Top 3 Insights)
            </button>

            <button
              type="button"
              onClick={() => setPdfPreviewVariant('a4-full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer border ${
                pdfPreviewVariant === 'a4-full'
                  ? 'bg-[#E8A317] text-[#2C1005] border-white shadow-sm'
                  : 'bg-[#2C1005]/70 text-[#FFF8E7] border-[#E8A317]/50 hover:bg-[#2C1005]'
              }`}
            >
              📄 Full A4 Report (All 12 Pages)
            </button>

            <button
              type="button"
              onClick={() => setPdfPreviewVariant('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer border ${
                pdfPreviewVariant === 'mobile'
                  ? 'bg-[#E8A317] text-[#2C1005] border-white shadow-sm'
                  : 'bg-[#2C1005]/70 text-[#FFF8E7] border-[#E8A317]/50 hover:bg-[#2C1005]'
              }`}
            >
              📱 Mobile Variant (WhatsApp)
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2C1005]/80 text-[#FDE68A] border border-[#E8A317]/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useTemplatePlaceholders}
                onChange={(e) => setUseTemplatePlaceholders(e.target.checked)}
                className="accent-[#E8A317] rounded cursor-pointer"
              />
              <span translate="no">{'{{placeholders}}'} Mode</span>
            </label>
          </div>
        </div>

        {/* Sub-toolbar with Print & Export Actions for Current Preview */}
        <div className="bg-[#FDF0C9] px-4 sm:px-6 py-2.5 border-b border-[#E8A317] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A1D0A]">
          <div className="font-bold">
            <span>✓ 15mm A4 Margins &nbsp;·&nbsp; ✓ 8.5mm Card Gaps &nbsp;·&nbsp; ✓ Local Noto Sans/Serif Telugu &nbsp;·&nbsp; ✓ WCAG AA Contrast</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handlePrintCleanTemplate(pdfPreviewVariant)}
              className="px-3 py-1 rounded-md bg-[#4A1D0A] hover:bg-[#2C1005] text-[#FDE68A] font-bold cursor-pointer"
            >
              🖨️ Print Current View as PDF
            </button>
            <button
              type="button"
              onClick={() => handleDownloadPrintableFile(pdfPreviewVariant, useTemplatePlaceholders)}
              className="px-3 py-1 rounded-md bg-white hover:bg-amber-50 text-[#4A1D0A] border border-[#4A1D0A]/40 font-bold cursor-pointer"
            >
              📥 Download Current HTML ({pdfPreviewVariant})
            </button>
            <button
              type="button"
              onClick={() => handleDownloadPrintableFile('a4-full', true)}
              className="px-3 py-1 rounded-md bg-white hover:bg-amber-50 text-[#4A1D0A] border border-[#4A1D0A]/40 font-bold cursor-pointer"
              translate="no"
            >
              🧩 Export {'{{placeholder}}'} Template
            </button>
          </div>
        </div>

        {/* Live Embedded A4 / Mobile Preview Iframe */}
        <div className="bg-[#D9CDB8] p-2 sm:p-4">
          <iframe
            ref={previewIframeRef}
            title="Telugu Jathakam Premium A4 PDF Preview"
            srcDoc={liveTemplateHtml}
            className="w-full h-[860px] rounded-xl border border-[#4A1D0A]/30 bg-[#EBE2D0] shadow-inner"
          />
        </div>
      </div>

      {/* ==========================================================================
          COMPLETE PRINT & SCREEN REPORT — STRUCTURED PAGE-BY-PAGE WITH ZERO SPLITS
          ========================================================================== */}
      <div className="space-y-6 print:space-y-0">
        {/* ==========================================================================
            PAGE 1 MASTERPIECE: GURUJI HERO PHOTO & FULL BIO + DIRECT HYPERLINKS +
            NATIVE DETAILS + D1 & D9 KUNDALI CHAKRAS + TRIPLE KUJA DOSHA
            ========================================================================== */}
        <div className="space-y-3.5 print:space-y-1.5 print-page-sheet">
          {renderPrintPageHeader()}

          {/* Royal Temple Header Banner with Hero Portrait, Full Guruji Details, Direct Links & Native Profile */}
          <div className="rounded-3xl border-4 border-[#78350f] ring-2 ring-[#d97706] bg-gradient-to-br from-[#2b0902] via-[#451a03] to-[#2b0902] text-amber-100 p-4 sm:p-5 print:p-2.5 shadow-md print-card">
            {/* Top Auspicious Invocation Row + Direct Clickable Site Link */}
            <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 items-center gap-1 border-b border-amber-400/40 pb-1.5 mb-2 text-[10.5px] print:text-[8.5px] font-bold text-amber-300">
              <span className="text-center sm:text-left print:text-left truncate">
                || ఓం శ్రీ మహాగణాధిపతయే నమః · శ్రీ విరూపాక్ష ఆశీస్సులతో ||
              </span>
              <span className="text-center font-extrabold text-[#fde047] text-xs print:text-[9.5px] truncate">
                శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · హైదరాబాద్
              </span>
              <div className="text-center sm:text-right print:text-right">
                <a
                  href="https://www.telugujyothisham.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  translate="no"
                  className="notranslate inline-block bg-gradient-to-r from-amber-400 to-yellow-300 text-[#451a03] px-2.5 py-0.5 rounded-full font-extrabold text-[10px] print:text-[8.5px] underline shadow-xs"
                >
                  🌐 www.telugujyothisham.com (Click to Visit)
                </a>
              </div>
            </div>

            {/* GURUJI HERO PORTRAIT + COMPLETE CREDENTIALS + DIRECT CLICKABLE HYPERLINKS */}
            <div className="flex flex-col sm:flex-row print:flex-row items-center gap-3.5 print:gap-2.5 bg-black/30 border border-amber-400/50 rounded-2xl p-3 print:p-2 mb-2.5 print:mb-1.5">
              {/* Hero Photo */}
              <div className="shrink-0 text-center">
                <a
                  href="https://www.telugujyothisham.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-24 h-24 sm:w-28 sm:h-28 print:w-16 print:h-16 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 shadow-xl mx-auto ring-2 ring-amber-300"
                >
                  <img
                    src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                    alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                    width={112}
                    height={112}
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full rounded-full object-cover object-top border border-amber-100 bg-amber-950 block"
                  />
                </a>
                <span className="inline-block mt-1 bg-gradient-to-r from-amber-400 to-orange-400 text-[#2b0902] font-extrabold text-[9.5px] print:text-[7px] px-2 py-0.5 rounded-full">
                  స్మార్త వైదిక & జ్యోతిష్య విద్వాంసులు
                </span>
              </div>

              {/* Complete Guruji Details & Clickable Hyperlinks */}
              <div className="flex-1 text-center sm:text-left print:text-left space-y-1 print:space-y-0.5">
                <div className="text-[10.5px] print:text-[8px] font-bold text-amber-300 uppercase tracking-wider">
                  స్మార్త వైదిక & దృక్సిద్ధాంత జ్యోతిష్య నిపుణులు · 15+ ఏళ్ల గురుపరంపర వేద సంప్రదాయం
                </div>
                <h2 className="text-lg sm:text-2xl print:text-base font-extrabold text-[#fde047] leading-tight">
                  <a
                    href="https://www.telugujyothisham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-[#fde047]"
                  >
                    బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (Brahmasri Jallavaram Sai Dheeraj Sharma)
                  </a>
                </h2>
                <p className="text-[11px] sm:text-xs print:text-[8px] text-amber-100/95 leading-snug">
                  <strong>శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం, హైదరాబాద్:</strong> దృక్సిద్ధాంత ఖగోళ గణిత సంపూర్ణ జాతక పరిశీలన, 36 గుణాల వధూవరుల వివాహ పొంతన, వివాహ-గృహప్రవేశ సిద్ధ ముహూర్త నిర్ణయం మరియు శ్రీ చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర మహా హోమ క్రతువుల నిర్వహణ.
                </p>

                {/* Clickable Action Links inside PDF & Screen */}
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start print:justify-start gap-2 print:gap-1.5 text-[10.5px] print:text-[8px] font-extrabold">
                  <a
                    href="https://www.telugujyothisham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 print:px-2 print:py-0.5 rounded-lg bg-amber-400 text-[#2b0902] underline shadow-2xs"
                  >
                    🌐 వెబ్‌సైట్: https://www.telugujyothisham.com
                  </a>
                  <a
                    href={whatsappConsultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 print:px-2 print:py-0.5 rounded-lg bg-emerald-500 text-white underline shadow-2xs"
                  >
                    💬 వాట్సాప్: +91 89779 86166
                  </a>
                  <a
                    href="tel:+918977986166"
                    className="inline-flex items-center gap-1 px-2.5 py-1 print:px-2 print:py-0.5 rounded-lg bg-amber-800 text-amber-100 border border-amber-400/60 underline"
                  >
                    📞 కాల్: +91 89779 86166
                  </a>
                </div>
              </div>
            </div>

            {/* Strictly Centered Native Horoscope Title */}
            <div className="text-center space-y-0.5 mb-2 print:mb-1">
              <h1 className="text-xl sm:text-2xl print:text-base font-extrabold text-[#fde047] tracking-wide leading-tight">
                🌟 {name} గారి సంపూర్ణ బృహత్ జాతక & కుండలి మహాగ్రంథం 🌟
              </h1>
              <p className="text-[11px] sm:text-xs print:text-[8.5px] text-amber-200 font-semibold">
                జాతకుని పేరు: <strong className="text-white">{name}</strong> · పుట్టిన తేదీ: <strong className="text-white">{birthDate}</strong> · సమయం: <strong className="text-white">{birthTime}</strong> · జన్మ స్థలం: <strong className="text-white">{selectedCity.labelTe}</strong> · లహిరి అయనాంశం: <strong className="text-emerald-300">{chartData.ayanamsaFormatted}</strong>
              </p>
            </div>

            {/* 8-Box Native Birth & Astrological Highlights Grid (4x2 in print) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-1.5 print:gap-1 text-xs">
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">👤 జాతకుని పేరు (Full Name)</span>
                <strong className="text-white text-xs sm:text-sm print:text-[10px] font-extrabold block truncate">{name}</strong>
              </div>
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">📅 పుట్టిన తేదీ & సమయం</span>
                <strong className="text-white text-xs sm:text-sm print:text-[10px] font-mono font-extrabold block">{birthDate} · {birthTime}</strong>
              </div>
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">📍 జన్మ స్థలం (Place)</span>
                <strong className="text-white text-xs sm:text-sm print:text-[10px] font-extrabold block truncate">{selectedCity.labelTe.split(' (')[0]}</strong>
              </div>
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">🌅 లగ్నం & నవాంశ (D1/D9)</span>
                <strong className="text-[#fde047] text-xs sm:text-sm print:text-[10px] font-extrabold block truncate">
                  {chartData.lagna.te} / {chartData.navamshaLagna.te}
                </strong>
              </div>
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">☽ జన్మ రాశి (Moon Sign)</span>
                <strong className="text-emerald-300 text-xs sm:text-sm print:text-[10px] font-extrabold block truncate">
                  {chartData.rashi.te} ({chartData.rashi.en})
                </strong>
              </div>
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">☉ సూర్య రాశి (Sun Sign)</span>
                <strong className="text-orange-300 text-xs sm:text-sm print:text-[10px] font-extrabold block truncate">
                  {chartData.planets[1]?.rashiTe || 'కర్కాటకం'} ({chartData.planets[1]?.rashiEn || 'Cancer'})
                </strong>
              </div>
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">⭐ జన్మ నక్షత్రం & పాదం</span>
                <strong className="text-white text-xs sm:text-sm print:text-[10px] font-extrabold block truncate">
                  {chartData.nakshatraName} — {chartData.pada}వ పాదం
                </strong>
              </div>
              <div className="bg-black/30 border border-amber-400/40 rounded-xl p-1.5 print:p-1 text-center">
                <span className="text-amber-300/90 block text-[9.5px] print:text-[7px] font-bold">⏳ ప్రస్తుత దశ (Current Dasha)</span>
                <strong className="text-[#fde047] text-[11px] print:text-[9.5px] font-extrabold block truncate">
                  {predictions.dashaInfo.currentMahadasha.lordTe} – {predictions.dashaInfo.currentAntardasha.lordTe}
                </strong>
              </div>
            </div>
          </div>

          {/* Illuminated D1 Rashi & D9 Navamsha Royal Kundali Image Plates Side-by-Side (Fits on Page 1!) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2 items-start">
            {renderRoyalKundaliImagePlate('D1')}
            {renderRoyalKundaliImagePlate('D9')}
          </div>

          {/* Triple Reference Kuja Dosha Verification (Lagna, Moon, Venus) (Fits at bottom of Page 1!) */}
          <div className="bg-amber-50/95 rounded-2xl p-3 print:p-2 border-2 border-amber-400 shadow-2xs print-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <strong className="text-xs sm:text-sm print:text-[10px] font-extrabold text-amber-950 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-amber-800" />
                <span>త్రివిధ కుజ దోష సమగ్ర పరిశీలన (Lagna · Chandra Lagna · Shukra Lagna):</span>
              </strong>
              <span className="text-[11px] print:text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-100">
                {predictions.tripleKuja.summaryTitleTe}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2 print:gap-1.5 text-xs print:text-[9px]">
              <div className={`p-1.5 print:p-1 rounded-xl border font-bold ${predictions.tripleKuja.fromLagna.hasDosha ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
                1. లగ్నం నుండి: {predictions.tripleKuja.fromLagna.house}వ స్థానం — {predictions.tripleKuja.fromLagna.hasDosha ? 'కుజ దోష స్థానం' : 'కుజ దోషం లేదు'}
              </div>
              <div className={`p-1.5 print:p-1 rounded-xl border font-bold ${predictions.tripleKuja.fromChandra.hasDosha ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
                2. చంద్ర లగ్నం నుండి: {predictions.tripleKuja.fromChandra.house}వ స్థానం — {predictions.tripleKuja.fromChandra.hasDosha ? 'పాక్షిక కుజ దోష స్థితి' : 'కుజ దోషం లేదు'}
              </div>
              <div className={`p-1.5 print:p-1 rounded-xl border font-bold ${predictions.tripleKuja.fromShukra.hasDosha ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
                3. శుక్ర లగ్నం నుండి: {predictions.tripleKuja.fromShukra.house}వ స్థానం — {predictions.tripleKuja.fromShukra.hasDosha ? 'పాక్షిక కుజ దోష స్థితి' : 'కుజ దోషం లేదు'}
              </div>
            </div>
          </div>

          {renderPrintPageFooter('కుండలి చక్రాలు (D1 & D9)')}
        </div>

        {/* ==========================================================================
            PAGE 2: PLANETARY DEGREES, DIGNITY TABLE & NEECHA BHANGA RAJA YOGA
            ========================================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break print-page-sheet">
          {renderPrintPageHeader()}

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3 print:pb-2">
            <div>
              <h4 className="text-base sm:text-lg print:text-base font-extrabold text-amber-950 flex items-center gap-2">
                <Table2 size={18} className="text-amber-700" />
                <span>{t('నవగ్రహ స్ఫుటములు, నక్షత్ర పాదములు & గ్రహ ఆధిపత్య బల పట్టిక (Planetary Degrees & Dignity Table)', 'Planetary Degrees, Nakshatra Pada & Dignity Table')}</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {t(
                  'నిరయన (Sidereal) గ్రహ డిగ్రీలు, రాశి (D1), నవాంశ (D9), ఉచ్చ / నీచ / స్వక్షేత్ర / వర్గోత్తమ / అస్తంగత్వ (Combust) స్థితి వివరాలు:',
                  'Exact Sidereal longitude, Rashi, Star Pada, D9 Navamsha, and Planetary Dignity (Exalted/Debilitated/Combust/Vargottama):'
                )}
              </p>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              లహిరి అయనాంశం: {chartData.ayanamsaFormatted}
            </span>
          </div>

          <div className="overflow-x-auto border-2 border-amber-300 rounded-2xl print-card">
            <table className="w-full text-left border-collapse text-xs sm:text-sm print:text-xs">
              <thead>
                <tr className="bg-amber-900 text-amber-100 border-b-2 border-amber-700">
                  <th className="py-2 px-2.5 sm:px-3 font-extrabold">{t('గ్రహం', 'Planet')}</th>
                  <th className="py-2 px-2.5 sm:px-3 font-extrabold">{t('రాశి (D1)', 'Rashi (D1)')}</th>
                  <th className="py-2 px-2.5 sm:px-3 font-extrabold">{t('డిగ్రీలు', 'Degrees')}</th>
                  <th className="py-2 px-2.5 sm:px-3 font-extrabold">{t('నక్షత్రం (పాదం)', 'Nakshatra (Pada)')}</th>
                  <th className="py-2 px-2.5 sm:px-3 font-extrabold">{t('నవాంశ (D9)', 'Navamsha (D9)')}</th>
                  <th className="py-2 px-2.5 sm:px-3 font-extrabold">{t('గ్రహ ఆధిపత్య స్థితి (Dignity)', 'Planetary Dignity')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200">
                {chartData.planets.map((p) => {
                  const dig = predictions.dignities.find((d) => d.id === p.id);
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/60 odd:bg-amber-50/30">
                      <td className="py-2 print:py-1.5 px-2.5 sm:px-3 font-extrabold text-amber-950">
                        {language === 'en' ? p.nameEn : p.nameTe}
                        {p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu' && (
                          <span className="ml-1 text-[10px] text-rose-700 font-bold">(వక్రం)</span>
                        )}
                      </td>
                      <td className="py-2 print:py-1.5 px-2.5 sm:px-3 font-bold text-slate-900">
                        {language === 'en' ? p.rashiEn : p.rashiTe}
                      </td>
                      <td
                        translate="no"
                        dir="ltr"
                        className="notranslate py-2 print:py-1.5 px-2.5 sm:px-3 font-mono tabular-nums text-xs font-extrabold text-amber-900 whitespace-nowrap"
                      >
                        {formatStrictPlanetDms(p.longitude, p.degreeFormatted)}
                      </td>
                      <td className="py-2 print:py-1.5 px-2.5 sm:px-3 font-semibold text-slate-800">
                        {language === 'en' ? p.nakshatraEn : p.nakshatraTe} ({p.pada}వ పాదం)
                      </td>
                      <td className="py-2 print:py-1.5 px-2.5 sm:px-3 font-bold text-emerald-900">
                        {p.navamshaRashiTe}
                      </td>
                      <td className="py-2 print:py-1.5 px-2.5 sm:px-3 font-bold">
                        {dig ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-xs border ${
                              dig.dignityCode === 'ucha' || dig.dignityCode === 'swakshetra' || dig.isVargottama
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : dig.dignityCode === 'neecha' || dig.isCombust
                                ? 'bg-rose-50 border-rose-300 text-rose-900'
                                : 'bg-amber-50 border-amber-300 text-amber-950'
                            }`}
                          >
                            {language === 'en' ? dig.dignityEn : dig.dignityTe}
                            {dig.isVargottama ? ' · వర్గోత్తమం' : ''}
                            {dig.isCombust ? ' · అస్తంగత్వం' : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-900 font-bold">జన్మ లగ్న ప్రమాణం</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Neecha Bhanga Raja Yoga & Special Yoga Highlights Box */}
          {predictions.neechaBhanga.length > 0 && (
            <div className="bg-amber-50/90 rounded-2xl p-4 print:p-3 border-2 border-amber-300 space-y-2 print-card">
              <h5 className="text-sm sm:text-base font-extrabold text-amber-950">
                👑 నీచభంగ రాజయోగ పరిశీలన (Neecha Bhanga Raja Yoga Verification):
              </h5>
              <div className="grid sm:grid-cols-2 print:grid-cols-2 gap-3 print:gap-2.5">
                {predictions.neechaBhanga.map((nb) => (
                  <div key={nb.planetTe} className="bg-white rounded-xl p-3 print:p-2.5 border border-amber-200 text-xs space-y-1 print-card">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-950 text-sm">{nb.planetTe} ({nb.debilitationRashiTe} రాశి)</strong>
                      <span className={`px-2 py-0.5 rounded font-bold ${nb.hasNeechaBhanga ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                        {nb.cancellationTypeTe}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{nb.explanationTe}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderPrintPageFooter('నవగ్రహ స్ఫుటములు & ఆధిపత్య బల పట్టిక')}
        </div>

        {/* ==========================================================================
            INTERACTIVE NAVIGATION BAR (Screen Only — Hidden in Print)
            ========================================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-300/90 shadow-xs space-y-4 no-print">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-900 mb-1.5">
                <BookOpen size={14} className="text-amber-800 shrink-0" />
                <span>
                  {t(
                    'శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
                    'Sri Lakshmi Ganapathi Jyothishalayam · Brahmasri Jallavaram Sai Dheeraj Sharma'
                  )}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-800">
                  {t('10 సమగ్ర అధ్యాయాలు · ద్వాదశ స్థానాలు · 96 ఏళ్ల భృగు చక్ర పద్ధతి', '10 Comprehensive Chapters · All 12 Houses · 96-Year Bhrigu Chakra Paddhati')}
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

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
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

          {/* 6 Category Navigation Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 bg-amber-950/95 p-2 sm:p-2.5 rounded-2xl border border-amber-800 shadow-inner">
            <button
              type="button"
              onClick={() => handleSelectSection('sunmoon')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                predictionTab === 'sunmoon'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
              }`}
            >
              <Sparkles size={14} className="shrink-0" />
              <span className="leading-snug">{t('1. లగ్న-మనస్సు', '1. Lagna-Mind')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSection('elements')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                predictionTab === 'elements'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
              }`}
            >
              <Flame size={14} className="shrink-0" />
              <span className="leading-snug">{t('2. పంచభూతాలు', '2. Elements')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSection('sutras')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                predictionTab === 'sutras'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
              }`}
            >
              <Scale size={14} className="shrink-0" />
              <span className="leading-snug">{t('3. రాజయోగాలు', '3. Raja Yogas')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSection('timeline')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                predictionTab === 'timeline'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
              }`}
            >
              <TrendingUp size={14} className="shrink-0" />
              <span className="leading-snug">{t('4. ఈవెంట్ టైమ్‌లైన్', '4. Event Timeline')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSection('ashtakavarga')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                predictionTab === 'ashtakavarga'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
              }`}
            >
              <BarChart3 size={14} className="shrink-0" />
              <span className="leading-snug">{t('5. అష్టకవర్గ బలం', '5. Ashtakavarga')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSection('bhavas')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                predictionTab === 'bhavas'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
              }`}
            >
              <CompassIcon size={14} className="shrink-0" />
              <span className="leading-snug">{t('6. 12 స్థానాలు', '6. 12 Houses')}</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            PAGE 3: CHAPTER 1 — LAGNA & SUN-MOON ARCHETYPE SYNTHESIS
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'sunmoon') && (
          <>
            <div id="grantham-section-sunmoon" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 scroll-mt-24 print-page-break print-page-sheet">
              {renderPrintPageHeader()}

              {/* Chapter 1 Banner */}
              <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-300 space-y-2 print-chapter-banner">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-900">
                  <span>
                    {t(
                      'అధ్యాయం 1 · జన్మ లగ్న, ఆత్మకారక (సూర్య) & మనఃకారక (చంద్ర) సంయోగ విశ్లేషణ',
                      'Chapter 1 · Ascendant, Sun & Moon Archetype Synthesis'
                    )}
                  </span>
                  <span className="text-emerald-900">
                    {t(predictions.sunMoon144.elementPairTitleTe, predictions.sunMoon144.elementPairTitleEn)}
                  </span>
                </div>

                <h5 className="text-lg sm:text-2xl print:text-base font-bold text-amber-950">
                  {t(
                    `జన్మ లగ్నం: ${chartData.lagna.te} · సూర్య రాశి: ${predictions.sunMoon144.sunRashiTe} (ఆత్మ) · జన్మ రాశి: ${predictions.sunMoon144.moonRashiTe} (మనస్సు)`,
                    `Ascendant: ${chartData.lagna.en} · Sun in ${predictions.sunMoon144.sunRashiEn} (Soul) · Moon in ${predictions.sunMoon144.moonRashiEn} (Mind)`
                  )}
                </h5>

                <p className="text-xs sm:text-sm print:text-xs text-slate-700 leading-relaxed">
                  {t(predictions.lagnaProfile.dehaSwabhavamTe, predictions.lagnaProfile.dehaSwabhavamEn)}{' '}
                  {t(predictions.lagnaProfile.lagnaLordEffectTe, predictions.lagnaProfile.lagnaLordEffectEn)}
                </p>

                <p className="text-xs sm:text-sm print:text-xs font-bold text-amber-900 pt-1">
                  {t('ప్రధాన జీవన తత్వం: ', 'Core Life Themes: ')}
                  <span className="font-normal text-slate-700">
                    {t(predictions.sunMoon144.themesTe, predictions.sunMoon144.themesEn)}
                  </span>
                </p>
              </div>

              {/* 2-Column Detailed Cards */}
              <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 sm:gap-5 print:gap-3">
                {/* Child 1: Personality & Career */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 print:p-3.5 border border-amber-200 space-y-2 print-card">
                  <div className="text-xs font-bold text-amber-800">
                    {t('ఆత్మ-మనస్సు స్వభావం & వృత్తి ప్రస్థానం', 'Core Personality & Vocation')}
                  </div>
                  <h6 className="text-base sm:text-lg print:text-sm font-bold text-amber-950">
                    {t('వ్యక్తిత్వం, స్వభావం, విద్య & వృత్తి జీవితం', 'Core Personality, Education & Vocation')}
                  </h6>
                  <p className="text-sm sm:text-base print:text-xs text-slate-800 leading-relaxed">
                    {t(predictions.sunMoon144.personalityTe, predictions.sunMoon144.personalityEn)}
                  </p>
                  <p className="text-xs sm:text-sm print:text-xs text-slate-700 leading-relaxed pt-2 border-t border-amber-100">
                    {t(predictions.sunMoon144.careerAndWealthTe, predictions.sunMoon144.careerAndWealthEn)}
                  </p>
                </div>

                {/* Child 2: Love, Marriage & Family */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 print:p-3.5 border border-amber-200 space-y-2 print-card">
                  <div className="text-xs font-bold text-amber-800">
                    {t('కుటుంబం, ప్రేమ & వైవాహిక జీవనం', 'Family, Marriage & Relationships')}
                  </div>
                  <h6 className="text-base sm:text-lg print:text-sm font-bold text-amber-950">
                    {t('ప్రేమ, వివాహం, గృహ సౌఖ్యం & కుటుంబ సంబంధాలు', 'Love, Marriage, Domestic Bliss & Relationships')}
                  </h6>
                  <p className="text-sm sm:text-base print:text-xs text-slate-800 leading-relaxed">
                    {t(predictions.sunMoon144.relationshipsTe, predictions.sunMoon144.relationshipsEn)}{' '}
                    {t(predictions.lagnaProfile.manoSwabhavamTe, predictions.lagnaProfile.manoSwabhavamEn)}
                  </p>
                  <div className="pt-2 border-t border-amber-100 mt-2">
                    <span className="text-xs font-bold text-amber-900 block">
                      {t('జీవన మార్గదర్శక ప్రతీక (Guiding Symbol):', 'Guiding Symbolic Archetype:')}
                    </span>
                    <p className="text-xs sm:text-sm print:text-xs text-slate-700 italic mt-0.5 leading-relaxed">
                      {t(predictions.sunMoon144.imageForIntegrationTe, predictions.sunMoon144.imageForIntegrationEn)}
                    </p>
                  </div>
                </div>

                {/* Child 3: Strengths & Spiritual Path */}
                <div className="bg-emerald-50/70 rounded-2xl p-5 sm:p-6 print:p-3.5 border border-emerald-200 space-y-2 print-card">
                  <div className="text-xs font-bold text-emerald-800">
                    {t('సహజ బలాలు & ఆధ్యాత్మిక ఉపాసన', 'Greatest Strengths & Spiritual Path')}
                  </div>
                  <h6 className="text-base sm:text-lg print:text-sm font-bold text-emerald-950">
                    ✓ {t('మీ జాతక ప్రధాన బలాలు & దైవ అనుగ్రహం', 'Your Greatest Strengths & Divine Grace')}
                  </h6>
                  <p className="text-sm sm:text-base print:text-xs text-emerald-950 leading-relaxed">
                    {t(predictions.sunMoon144.strengthsTe, predictions.sunMoon144.strengthsEn)}.{' '}
                    {t(predictions.sunMoon144.spiritualPathTe, predictions.sunMoon144.spiritualPathEn)}
                  </p>
                </div>

                {/* Child 4: Cautions & Life Mission */}
                <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 print:p-3.5 border border-amber-200 space-y-2 print-card">
                  <div className="text-xs font-bold text-amber-800">
                    {t('తీసుకోవలసిన జాగ్రత్తలు & జీవన లక్ష్యం', 'Mindful Precautions & Life Mission')}
                  </div>
                  <h6 className="text-base sm:text-lg print:text-sm font-bold text-amber-950">
                    ! {t('తీసుకోవలసిన జాగ్రత్తలు & ఉన్నత జీవన మార్గం', 'Mindful Precautions & Higher Path')}
                  </h6>
                  <p className="text-sm sm:text-base print:text-xs text-slate-800 leading-relaxed">
                    {t(predictions.sunMoon144.weaknessesTe, predictions.sunMoon144.weaknessesEn)}{' '}
                    {t(predictions.lagnaProfile.lifeMissionTe, predictions.lagnaProfile.lifeMissionEn)}
                  </p>
                </div>
              </div>

              {renderPrintPageFooter('అధ్యాయం 1 · జన్మ లగ్న & సూర్య-చంద్ర విశ్లేషణ')}
            </div>

            {/* ====================================================================
                PAGE 4: CHAPTER 2 — 7TH HOUSE (SAPTAMA BHAVA) SPOUSE, MARRIAGE TIMING,
                LOVE VS ARRANGED YOGA & KUJA DOSHA % ANALYSIS (DEDICATED PAGE - ZERO SPLIT!)
                ==================================================================== */}
            <div className="print-page-break print-page-sheet space-y-3">
              {renderPrintPageHeader()}

              <div className="bg-gradient-to-br from-amber-950 via-[#3b1506] to-amber-900 text-white rounded-3xl p-5 sm:p-7 print:p-4 border-2 border-amber-500/80 shadow-xl space-y-4 print:space-y-3">
                <div className="flex flex-col md:flex-row print:flex-row md:items-center print:items-center justify-between gap-3 border-b border-amber-700/70 pb-3 print:pb-2.5 print-chapter-banner">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-300 px-3 py-1 rounded-full mb-1.5">
                      <Sparkles size={13} />
                      <span>
                        {t(
                          'అధ్యాయం 2 · సప్తమ భావ (7th House) వివాహ & జీవిత భాగస్వామి విశ్లేషణ',
                          'Chapter 2 · 7th House Future Spouse, Marriage Timing & Dosha Analysis'
                        )}
                      </span>
                    </span>
                    <h5 className="text-xl sm:text-2xl print:text-base font-extrabold text-amber-100">
                      {t(
                        'కాబోయే భర్త / భార్య లక్షణాలు, ప్రేమ/పెద్దల వివాహం, పెళ్లి సమయం & కుజ దోష శాతం (%)',
                        'Future Spouse Traits, Love vs Arranged Yoga, Marriage Timing & Kuja Dosha %'
                      )}
                    </h5>
                  </div>
                  <div className="bg-amber-900/90 border border-amber-400/70 rounded-2xl px-3.5 py-2 text-xs font-bold text-amber-200 shrink-0">
                    {t(
                      `7వ స్థానం: ${predictions.saptamaMarriage.saptamaRashiTe} · అధిపతి: ${predictions.saptamaMarriage.saptamaLordTe} (${predictions.saptamaMarriage.saptamaLordHouse}వ ఇంట)`,
                      `7th House: ${predictions.saptamaMarriage.saptamaRashiEn} · Lord: ${predictions.saptamaMarriage.saptamaLordEn} (in ${predictions.saptamaMarriage.saptamaLordHouse}H)`
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-3">
                  {/* 1. Future Spouse Appearance, Nature & Career */}
                  <div className="bg-[#4a1d08] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-400/40 space-y-2 print-card">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-300 tracking-wide">
                        {t('1. కాబోయే జీవిత భాగస్వామి రూపం, స్వభావం & వృత్తి', '1. Future Spouse Personality, Looks & Career')}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm print:text-xs text-amber-50 leading-relaxed">
                      {t(
                        predictions.saptamaMarriage.spouseAppearanceAndNatureTe,
                        predictions.saptamaMarriage.spouseAppearanceAndNatureEn
                      )}
                    </p>
                    <p className="text-xs sm:text-sm print:text-xs text-emerald-200 font-semibold leading-relaxed pt-2 border-t border-amber-400/20">
                      {t(
                        predictions.saptamaMarriage.spouseCareerAndFamilyTe,
                        predictions.saptamaMarriage.spouseCareerAndFamilyEn
                      )}
                    </p>
                  </div>

                  {/* 2. Love vs Arranged Marriage & Marriage Timing Window */}
                  <div className="bg-[#4a1d08] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-400/40 space-y-2 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-300 tracking-wide">
                        {t('2. ప్రేమ / పెద్దల వివాహం & పెళ్లి ఎప్పుడు అవుతుంది?', '2. Love vs Arranged Yoga & Marriage Timing')}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-400/50">
                        {t(
                          predictions.saptamaMarriage.marriageTypeBadgeTe,
                          predictions.saptamaMarriage.marriageTypeBadgeEn
                        )}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm print:text-xs text-amber-50 leading-relaxed">
                      {t(
                        predictions.saptamaMarriage.marriageTypeAnalysisTe,
                        predictions.saptamaMarriage.marriageTypeAnalysisEn
                      )}
                    </p>
                    <div className="pt-2 border-t border-amber-400/20 space-y-1">
                      <strong className="text-xs sm:text-sm print:text-xs text-amber-200 block">
                        ⏳ {t(predictions.saptamaMarriage.marriageTimingTitleTe, predictions.saptamaMarriage.marriageTimingTitleEn)}
                      </strong>
                      <p className="text-xs text-amber-100/90 leading-relaxed">
                        {t(
                          predictions.saptamaMarriage.marriageTimingDetailsTe,
                          predictions.saptamaMarriage.marriageTimingDetailsEn
                        )}
                      </p>
                      <p className="text-xs font-bold text-emerald-300">
                        ✦ {t('అనుకూల వివాహ వయస్సు / కాలం: ', 'Favorable Age / Period: ')}
                        {t(predictions.saptamaMarriage.favorableAgesTe, predictions.saptamaMarriage.favorableAgesEn)}
                      </p>
                    </div>
                  </div>

                  {/* 3. Kuja Dosha % & Kalasarpa Check */}
                  <div className="bg-[#4a1d08] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-400/40 space-y-2 print-card">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-300 tracking-wide">
                        {t('3. కుజ దోష శాతం (%) & కాలసర్ప యోగ తనిఖీ', '3. Exact Kuja Dosha % & Kalasarpa Check')}
                      </span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-300 text-amber-950">
                        {predictions.tripleKuja.netDoshaPercentage}%
                      </span>
                    </div>
                    <strong className="text-sm print:text-xs text-white block">
                      {t(predictions.saptamaMarriage.kujaDoshaTitleTe, predictions.saptamaMarriage.kujaDoshaTitleEn)}
                    </strong>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {t(
                        predictions.saptamaMarriage.kujaDoshaExplanationTe,
                        predictions.saptamaMarriage.kujaDoshaExplanationEn
                      )}
                    </p>
                    <div className="pt-2 border-t border-amber-400/20 text-xs text-emerald-200">
                      <strong>{t(predictions.saptamaMarriage.kalasarpaStatusTe, predictions.saptamaMarriage.kalasarpaStatusEn)}:</strong>{' '}
                      {t(predictions.saptamaMarriage.kalasarpaDetailTe, predictions.saptamaMarriage.kalasarpaDetailEn)}
                    </div>
                  </div>

                  {/* 4. Saptama Graha Shanti & Japa Schedule */}
                  <div className="bg-[#4a1d08] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-400/40 flex flex-col justify-between space-y-2.5 print-card">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-amber-300 tracking-wide block">
                        {t('4. శీఘ్ర వివాహం & దాంపత్య సౌఖ్య జప నియమం', '4. Vedic Marriage Shanti & Japa Schedule')}
                      </span>
                      <strong className="text-sm print:text-xs text-amber-200 block">
                        🙏 {t(predictions.saptamaMarriage.remedyMetalAndDayTe, predictions.saptamaMarriage.remedyMetalAndDayEn)}
                      </strong>
                      <p className="text-xs sm:text-sm print:text-xs text-amber-50 leading-relaxed">
                        {t(
                          predictions.saptamaMarriage.remedyJapaScheduleTe,
                          predictions.saptamaMarriage.remedyJapaScheduleEn
                        )}
                      </p>
                    </div>

                    <a
                      href={whatsappConsultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 print:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm print:text-[11px] transition-colors underline"
                    >
                      <MessageCircle size={15} />
                      <span>
                        {t(
                          'వివాహ సమయం & సప్తమ భావ పరిశీలనకు గురువుగారిని సంప్రదించండి (+91 89779 86166)',
                          'Consult Guruji on WhatsApp for Marriage Timing & Remedies (+91 89779 86166)'
                        )}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {renderPrintPageFooter('అధ్యాయం 2 · సప్తమ భావ వివాహ విశ్లేషణ')}
            </div>
          </>
        )}

        {/* ====================================================================
            PAGE 5: CHAPTER 3 — PANCHABHOOTA ELEMENTAL STRENGTH (7 PLANETS)
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'elements') && (
          <div id="grantham-section-elements" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 scroll-mt-24 print-page-break print-page-sheet">
            {renderPrintPageHeader()}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 3 · పంచభూత తత్వ సప్తగ్రహ బల & వక్ర గ్రహ రహస్య విశ్లేషణ', 'Chapter 3 · Elemental Planetary Strength & Retrograde Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                {t(
                  'పంచభూత తత్వ గ్రహ బల పట్టిక (అగ్ని · భూ · వాయు · జల తత్వాలు & శాంతి ఉపాసన)',
                  'Elemental Planetary Strength Analysis (Fire · Earth · Air · Water & Vedic Upasana)'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  'ప్రతి గ్రహం తన ఉచ్చ రాశి తత్వంలో ఉన్నప్పుడు అత్యుత్తమ ఫలితాలను, నీచ రాశి తత్వంలో ఉన్నప్పుడు పరీక్షలను ఇస్తుంది. మీ జాతకంలోని సప్త గ్రహాల తత్వ బలం మరియు పరిహారాలు:',
                  'Each planet operates at peak power in the element of its exaltation sign. Below is the elemental strength and upasana for your 7 core planets:'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
              {predictions.elementStrengths.map((item, idx) => {
                const badgeStyles =
                  item.tier === 'best'
                    ? 'text-emerald-900 bg-emerald-100/80'
                    : item.tier === 'second'
                    ? 'text-amber-900 bg-amber-100/80'
                    : item.tier === 'third'
                    ? 'text-slate-800 bg-slate-100'
                    : 'text-rose-900 bg-rose-100/80';

                const isLastOdd = idx === predictions.elementStrengths.length - 1 && predictions.elementStrengths.length % 2 === 1;

                return (
                  <div
                    key={item.planetId}
                    className={`rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 bg-white hover:bg-amber-50/30 transition-colors space-y-1.5 print-card ${
                      isLastOdd ? 'md:col-span-2 print:col-span-2' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <strong className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                          {t(item.planetTe, item.planetEn)}
                        </strong>
                        <span className="text-xs print:text-[11px] font-semibold text-slate-600 ml-2">
                          — {t(item.rashiTe, item.rashiEn)} · {t(item.elementTe, item.elementEn)}
                        </span>
                      </div>
                      <span className={`text-xs print:text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg ${badgeStyles}`}>
                        {t(item.tierLabelTe, item.tierLabelEn)}
                      </span>
                    </div>

                    <div className="text-xs print:text-[11px] font-bold text-amber-800">
                      {t(`లగ్నం నుండి స్థానం: ${item.houseNameTe}`, `Placement: ${item.houseNameEn}`)}
                    </div>

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-snug">
                      {t(item.analysisTe, item.analysisEn)}
                    </p>

                    <div className="pt-1.5 border-t border-amber-100 text-xs print:text-[11px] text-emerald-900 font-semibold">
                      🙏 {t('ఆరాధన / పరిహారం: ', 'Vedic Upasana: ')}
                      <span className="font-normal text-slate-700">{t(item.remedyTe, item.remedyEn)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {renderPrintPageFooter('అధ్యాయం 3 · పంచభూత తత్వ గ్రహ బల పట్టిక')}
          </div>
        )}

        {/* ====================================================================
            PAGE 6: CHAPTER 4 — BHRIGU CHAKRA & NADI RAJA YOGAS
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'sutras') && (
          <div id="grantham-section-sutras" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 scroll-mt-24 print-page-break print-page-sheet">
            {renderPrintPageHeader()}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs font-bold text-amber-800 mb-1">
                {t('అధ్యాయం 4 · భృగు చక్ర పద్ధతి, విశేష జ్యోతిష్య నియమాలు & రాజయోగాలు', 'Chapter 4 · Bhrigu Chakra Paddhati, Special Sutras & Raja Yogas')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                {t(
                  'భృగు చక్ర పద్ధతి జన్మ మాస కేంద్ర స్థానం, గజకేసరి/బుధాదిత్య/ధర్మ-కర్మాధిపతి యోగాలు & విశేష ఫల సూత్రాలు',
                  'Bhrigu Chakra Paddhati Birth Month Focus House, Raja Yogas & Special Predictive Rules'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-xs text-slate-600 mt-1 leading-relaxed">
                {t(
                  'మీ జన్మ మాసం, శని ద్వితీయ స్థాన కర్మ నియమం, గజకేసరి యోగం, బుధాదిత్య యోగం మరియు రాజ్య-లాభాధిపతుల ఆధారంగా ప్రత్యేక ఫలితాలు:',
                  'Special predictive rules triggered by your birth month, Saturn’s 2nd-house rule, Gajakesari/Budhaditya Yogas, and 9th-10th-11th house lords:'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
              {predictions.specialSutras.map((sutra, idx) => (
                <div
                  key={sutra.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 bg-white space-y-2 flex flex-col justify-between print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-amber-900">
                        {t(`సూత్రం #${idx + 1}`, `Rule #${idx + 1}`)}
                      </span>
                      <span className="font-bold text-emerald-800">
                        {t(sutra.badgeTe, sutra.badgeEn)}
                      </span>
                    </div>
                    <h6 className="text-base sm:text-lg print:text-sm font-bold text-amber-950">
                      {t(sutra.titleTe, sutra.titleEn)}
                    </h6>
                    <p className="text-xs sm:text-sm print:text-xs text-slate-700 leading-relaxed">
                      {t(sutra.descriptionTe, sutra.descriptionEn)}
                    </p>
                  </div>
                  <div className="bg-amber-50/80 rounded-xl p-2.5 print:p-2 border border-amber-200/80 text-xs font-semibold text-amber-950 mt-2">
                    💡 {t(sutra.remedyOrAdviceTe, sutra.remedyOrAdviceEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 4 · భృగు చక్ర పద్ధతి & రాజయోగాలు')}
          </div>
        )}

        {/* ====================================================================
            PAGE 7: CHAPTER 5 — LIFE EVENT PROBABILITY TIMELINE (% Windows)
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'timeline') && (
          <div id="grantham-section-timeline" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 scroll-mt-24 print-page-break print-page-sheet">
            {renderPrintPageHeader()}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-amber-700" />
                <span>{t('అధ్యాయం 5 · ఈవెంట్ సంభావ్యత & జీవిత కీలక ఘట్టాల కాల నిర్ణయం (% Probability Timeline)', 'Chapter 5 · Life Event Probability Windows & Milestone Timeline')}</span>
              </div>
              <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                {t(
                  'కెరీర్ ఉన్నతి, వివాహ యోగం, ఆస్తుల సమృద్ధి & విదేశీ ప్రయాణాల సంభావ్యతా శాతాల విశ్లేషణ',
                  'Predictive Probability Windows for Career, Marriage, Assets & Global Travel'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-xs text-slate-600 mt-1 leading-relaxed">
                {t(
                  'దశా-భుక్తి కాలాలు, గోచార గురు-శని సంచారాలు మరియు భావాధిపతుల బలాన్ని సమన్వయం చేసి మీ జీవితంలోని ప్రధాన ఘట్టాల గరిష్ట అనుకూల వయస్సులను (Peak Windows) గణించాం:',
                  'Synthesizing Vimshottari periods, transits, and house lord dignities into multi-factor predictive probability windows:'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
              {predictions.eventTimelines.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 bg-white space-y-2 flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-colors print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                        {t(ev.categoryTe, ev.categoryEn)}
                      </strong>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {ev.probabilityScore}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 rounded-full"
                          style={{ width: `${ev.probabilityScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>{t('అనుకూల వయస్సు: ', 'Age Bracket: ')}<strong className="text-amber-950">{t(ev.peakAgeBracketTe, ev.peakAgeBracketEn)}</strong></span>
                        <span>{t('సంవత్సరాలు: ', 'Years: ')}<strong className="text-amber-900">{t(ev.calendarYearsTe, ev.calendarYearsEn)}</strong></span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {t(ev.analysisTe, ev.analysisEn)}
                    </p>

                    <div className="text-[11px] text-amber-800 font-medium">
                      ✦ {t('కారక గ్రహాలు: ', 'Key Planetary Drivers: ')}
                      <span>{t(ev.primaryPlanetsTe, ev.primaryPlanetsEn)}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 rounded-xl p-2.5 print:p-2 border border-amber-200 text-xs font-semibold text-amber-950 mt-1">
                    🙏 {t('శర్మ గారి సలహా: ', 'Guruji’s Advice: ')}
                    <span className="font-normal text-slate-800">{t(ev.sharmaAdviceTe, ev.sharmaAdviceEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 5 · ఈవెంట్ సంభావ్యత టైమ్‌లైన్')}
          </div>
        )}

        {/* ====================================================================
            PAGE 8: CHAPTER 6 — SARVASHTAKAVARGA 12-BHAVA STRENGTH MATRIX
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'ashtakavarga') && (
          <div id="grantham-section-ashtakavarga" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 scroll-mt-24 print-page-break print-page-sheet">
            {renderPrintPageHeader()}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 space-y-1.5 print-chapter-banner">
              <div className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                <BarChart3 size={14} className="text-amber-700" />
                <span>{t('అధ్యాయం 6 · సార్వభౌమ అష్టకవర్గ 12-భావ బలం & లాభ యోగం (Sarvashtakavarga 337 Bindus)', 'Chapter 6 · Sarvashtakavarga 12-House Bindu Strength Matrix')}</span>
              </div>
              <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                {t(
                  '12 రాశుల అష్టకవర్గ బిందువుల పట్టిక, అత్యధిక/అల్ప స్థానాలు & అఖండ లాభ యోగ పరిశీలన',
                  '12-House Ashtakavarga Bindu Allocation, Peak Energy Zones & Income-Expenditure Axiom'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-xs text-slate-600 leading-relaxed">
                {t(
                  'పరాశర హోరాశాస్త్రం ప్రకారం మొత్తం 337 శుభ బిందువులలో సగటున ఒక రాశికి 28 బిందువులు వస్తాయి. 30 కంటే ఎక్కువ బిందువులు ఉన్న స్థానాలు ప్రయత్నం లేకుండానే విజయాన్నిస్తాయి; 25 కంటే తక్కువ ఉన్న స్థానాలకు సాధన అవసరం.',
                  'In Parashara Sarvashtakavarga (337 total bindus), 28 is the benchmark average. Houses with 30+ bindus manifest effortless fortune, while houses below 25 require conscious discipline and remedies.'
                )}
              </p>
            </div>

            {/* Income vs Expenditure Golden Rule Callout */}
            <div className="p-3.5 print:p-2.5 rounded-2xl bg-gradient-to-r from-amber-900 to-amber-950 text-amber-100 border border-amber-700 flex items-start gap-3 print-card">
              <Award size={20} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm print:text-xs">
                <strong className="text-amber-300 block font-bold">
                  {t('శాస్త్రోక్త రాజ్య (10వ) vs లాభ (11వ) భావ అష్టకవర్గ సూత్రం:', 'Classical 10th (Effort) vs 11th (Gain) Bindu Axiom:')}
                </strong>
                <p className="text-amber-100 leading-relaxed">
                  {t(predictions.ashtakavarga.incomeVsExpenditureYogaTe, predictions.ashtakavarga.incomeVsExpenditureYogaEn)}
                </p>
              </div>
            </div>

            {/* 12-Bhava Grid (4 columns x 3 rows in print) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-3 print:gap-2">
              {predictions.ashtakavarga.houses.map((h) => {
                const tierStyles =
                  h.tier === 'peak'
                    ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                    : h.tier === 'balanced'
                    ? 'border-amber-300 bg-amber-50/40 text-amber-950'
                    : h.tier === 'moderate'
                    ? 'border-slate-200 bg-white text-slate-900'
                    : 'border-rose-200 bg-rose-50/30 text-rose-950';

                return (
                  <div
                    key={h.houseNumber}
                    className={`rounded-2xl p-3 print:p-2 border ${tierStyles} flex flex-col justify-between space-y-1.5 print-card`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500">
                          {t(`${h.houseNumber}వ స్థానం`, `House #${h.houseNumber}`)}
                        </span>
                        <span className="text-sm font-mono font-extrabold px-2 py-0.5 rounded-lg bg-amber-200 text-amber-950">
                          {h.bindus}
                        </span>
                      </div>
                      <strong className="text-xs sm:text-sm font-bold block mt-1 text-amber-950">
                        {t(h.bhavaNameTe, h.bhavaNameEn)}
                      </strong>
                      <span className="text-[10px] text-slate-600 block">
                        ({t(h.rashiTe, h.rashiEn)})
                      </span>
                      <p className="text-[11px] text-slate-700 mt-1 leading-snug">
                        {t(h.interpretationTe, h.interpretationEn)}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-amber-200/50 text-[10px] text-amber-900 font-medium">
                      💡 {t(h.remedyTe, h.remedyEn)}
                    </div>
                  </div>
                );
              })}
            </div>

            {renderPrintPageFooter('అధ్యాయం 6 · సార్వభౌమ అష్టకవర్గ బల పట్టిక')}
          </div>
        )}

        {/* ====================================================================
            PAGES 9, 10, 11, 12, 13 (CHAPTERS 7, 8, 9, 10)
            DWADASHA STANAMS (1-6 & 7-12), 9 PLANETS, 96-YEAR BHRIGU CYCLES & REMEDIES
            ==================================================================== */}
        {(showFullGrantham || predictionTab === 'bhavas') && (
          <div id="grantham-section-bhavas" className="space-y-6 print:space-y-0 scroll-mt-24">
            {/* PAGE 9: CHAPTER 7 (PART 1) — HOUSES 1 TO 6 COMPLETE ANALYSIS */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 print-page-break print-page-sheet">
              {renderPrintPageHeader()}

              <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
                <div className="text-xs font-bold text-amber-800 mb-0.5">
                  {t('అధ్యాయం 7 (భాగం 1) · పూర్వ షట్క స్థానాలు (1 నుండి 6 స్థానాల సమగ్ర విశ్లేషణ)', 'Chapter 7 (Part 1) · Houses 1 to 6 Complete Life Domain Analysis')}
                </div>
                <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                  {t(
                    `మీ జన్మ లగ్నం (${chartData.lagna.te}) నుండి 1–6 స్థానాల అధిపతులు, గ్రహ స్థితి & సమగ్ర జీవిత ఫలితాలు`,
                    `Houses 1 to 6 from Your Ascendant (${chartData.lagna.en}) — Lords, Occupants & Predictions`
                  )}
                </h5>
                <p className="text-xs sm:text-sm print:text-[11px] text-slate-600 mt-0.5">
                  {t(
                    'లగ్న (వ్యక్తిత్వం), ధన (కుటుంబం-సంపద), భాతృ (ధైర్యం-సోదరులు), సుఖ (గృహ-వాహన-మాతృ), పంచమ (విద్య-సంతానం) మరియు శత్రు (ఆరోగ్యం-విజయం) స్థానాల విశ్లేషణ:',
                    'Detailed evaluation of Houses 1 to 6 covering health, wealth, siblings, property, education, and victory:'
                  )}
                </p>
              </div>

              <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
                {predictions.all12Houses.slice(0, 6).map((houseItem) => (
                  <div
                    key={houseItem.houseNumber}
                    className="rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 bg-white hover:border-amber-400 transition-colors space-y-1.5 flex flex-col justify-between print-card"
                  >
                    <div className="space-y-1">
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

                      <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                        {t(houseItem.bhavaTitleTe, houseItem.bhavaTitleEn)}
                      </h6>

                      {houseItem.occupantPlanetsTe.length > 0 && (
                        <div className="text-xs print:text-[11px] font-bold text-rose-900">
                          {t(
                            `ఈ స్థానంలోని గ్రహాలు: ${houseItem.occupantPlanetsTe.join(', ')}`,
                            `Planets in this House: ${houseItem.occupantPlanetsEn.join(', ')}`
                          )}
                        </div>
                      )}

                      <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-snug">
                        {t(houseItem.detailedPredictionTe, houseItem.detailedPredictionEn)}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-amber-100 text-xs print:text-[11px] text-amber-900 font-semibold">
                      ✦ {t(houseItem.guidanceTe, houseItem.guidanceEn)}
                    </div>
                  </div>
                ))}
              </div>

              {renderPrintPageFooter('అధ్యాయం 7 (భాగం 1) · 1 నుండి 6 స్థానాలు')}
            </div>

            {/* PAGE 10: CHAPTER 7 (PART 2) — HOUSES 7 TO 12 COMPLETE ANALYSIS */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 print-page-break print-page-sheet">
              {renderPrintPageHeader()}

              <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
                <div className="text-xs font-bold text-amber-800 mb-0.5">
                  {t('అధ్యాయం 7 (భాగం 2) · ఉత్తర షట్క స్థానాలు (7 నుండి 12 స్థానాల సమగ్ర విశ్లేషణ)', 'Chapter 7 (Part 2) · Houses 7 to 12 Complete Life Domain Analysis')}
                </div>
                <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                  {t(
                    `మీ జన్మ లగ్నం (${chartData.lagna.te}) నుండి 7–12 స్థానాల అధిపతులు, గ్రహ స్థితి & సమగ్ర జీవిత ఫలితాలు`,
                    `Houses 7 to 12 from Your Ascendant (${chartData.lagna.en}) — Lords, Occupants & Predictions`
                  )}
                </h5>
                <p className="text-xs sm:text-sm print:text-[11px] text-slate-600 mt-0.5">
                  {t(
                    'కళత్ర (వివాహం), ఆయుర్దాయ (దీర్ఘాయువు), భాగ్య (అదృష్టం-ధర్మం), రాజ్య (ఉద్యోగం-కీర్తి), లాభ (ఆదాయం) మరియు వ్యయ (విదేశీ-మోక్ష) స్థానాల విశ్లేషణ:',
                    'Detailed evaluation of Houses 7 to 12 covering marriage, longevity, fortune, career, gains, and liberation:'
                  )}
                </p>
              </div>

              <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
                {predictions.all12Houses.slice(6, 12).map((houseItem) => (
                  <div
                    key={houseItem.houseNumber}
                    className="rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 bg-white hover:border-amber-400 transition-colors space-y-1.5 flex flex-col justify-between print-card"
                  >
                    <div className="space-y-1">
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

                      <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                        {t(houseItem.bhavaTitleTe, houseItem.bhavaTitleEn)}
                      </h6>

                      {houseItem.occupantPlanetsTe.length > 0 && (
                        <div className="text-xs print:text-[11px] font-bold text-rose-900">
                          {t(
                            `ఈ స్థానంలోని గ్రహాలు: ${houseItem.occupantPlanetsTe.join(', ')}`,
                            `Planets in this House: ${houseItem.occupantPlanetsEn.join(', ')}`
                          )}
                        </div>
                      )}

                      <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-snug">
                        {t(houseItem.detailedPredictionTe, houseItem.detailedPredictionEn)}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-amber-100 text-xs print:text-[11px] text-amber-900 font-semibold">
                      ✦ {t(houseItem.guidanceTe, houseItem.guidanceEn)}
                    </div>
                  </div>
                ))}
              </div>

              {renderPrintPageFooter('అధ్యాయం 7 (భాగం 2) · 7 నుండి 12 స్థానాలు')}
            </div>

            {/* PAGE 11: CHAPTER 8 — 9 GRAHAS IN 12 STANAMS + NAVAMSHA VARGOTTAMA ANALYSIS */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 print-page-break print-page-sheet">
              {renderPrintPageHeader()}

              <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
                <div className="text-xs font-bold text-amber-800 mb-0.5">
                  {t('అధ్యాయం 8 · నవగ్రహ స్థాన, నక్షత్ర పాద & నవాంశ (D9) విశేష ఫలితాలు', 'Chapter 8 · 9 Planets Natal, Nakshatra Pada & D9 Navamsha Analysis')}
                </div>
                <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                  {t(
                    'తొమ్మిది గ్రహాల రాశి, నక్షత్ర పాద, నవాంశ స్థితి & దశా ఫలితాల లోతైన విశ్లేషణ',
                    'In-Depth Analysis of All 9 Planets in Rashi, Nakshatra Pada & Navamsha'
                  )}
                </h5>
              </div>

              <div className="grid md:grid-cols-3 print:grid-cols-3 gap-4 print:gap-2.5">
                {predictions.bhavaPredictions.map((bp) => (
                  <div
                    key={bp.planetId}
                    className="rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 bg-white hover:border-amber-400 transition-colors flex flex-col justify-between space-y-1.5 print-card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-base print:text-xs font-bold text-amber-950">
                          {t(bp.planetTe, bp.planetEn)}
                        </strong>
                        <span className="text-xs print:text-[10.5px] font-mono font-bold text-amber-900">
                          {t(bp.rashiTe, bp.rashiEn)} · {bp.degreeFormatted}
                        </span>
                      </div>

                      <div className="text-xs print:text-[11px] font-bold text-emerald-800">
                        {t(bp.bhavaNameTe, bp.bhavaNameEn)}
                      </div>

                      <p className="text-xs sm:text-sm print:text-[11px] text-slate-800 leading-snug">
                        {t(bp.predictionTe, bp.predictionEn)}
                      </p>

                      <p className="text-xs print:text-[10.5px] text-slate-600 leading-snug pt-1 border-t border-amber-100">
                        {t(bp.deepAnalysisTe, bp.deepAnalysisEn)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {renderPrintPageFooter('అధ్యాయం 8 · నవగ్రహ స్థాన & నవాంశ ఫలితాలు')}
            </div>

            {/* PAGE 12: CHAPTER 9 — 1 TO 96 YEARS LIFE PROGRESSION */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 print-page-break print-page-sheet">
              {renderPrintPageHeader()}

              <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
                <div className="text-xs font-bold text-amber-800 mb-0.5">
                  {t('అధ్యాయం 9 · భృగు చక్ర పద్ధతి — ద్వాదశ వర్ష కాలచక్ర గమనం (1 నుండి 96 ఏళ్ల వయస్సు వరకు దశాబ్ద ఫలితాలు)', 'Chapter 9 · Bhrigu Chakra Paddhati — 12-Year Life Progression Cycles (Ages 1 to 96)')}
                </div>
                <h5 className="text-lg sm:text-xl print:text-base font-bold text-amber-950">
                  {t(
                    'భృగు చక్ర పద్ధతి ప్రకారం 1 నుండి 96 ఏళ్ల వయస్సు వరకు ప్రతి 12 ఏళ్ల కాలచక్రం & జీవిత కీలక మలుపు సంవత్సరాలు',
                    'Bhrigu Chakra Paddhati 12-Year Life Progression Cycles & Exact Milestone Years (Ages 1 to 96)'
                  )}
                </h5>
              </div>

              <div className="grid md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
                {predictions.bhriguCycles.map((cycle) => (
                  <div
                    key={cycle.cycleNumber}
                    className="rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 bg-white space-y-1 print-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-amber-900">
                        {t(`కాలచక్రం #${cycle.cycleNumber}`, `Cycle #${cycle.cycleNumber}`)}
                      </span>
                      <span className="font-mono font-bold text-emerald-800">
                        {cycle.yearRange}
                      </span>
                    </div>

                    <h6 className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      {t(cycle.ageRangeTe, cycle.ageRangeEn)} — {t(cycle.themeTe, cycle.themeEn)}
                    </h6>

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-snug">
                      {t(cycle.predictionTe, cycle.predictionEn)}
                    </p>
                  </div>
                ))}
              </div>

              {renderPrintPageFooter('అధ్యాయం 9 · 96 ఏళ్ల భృగు కాలచక్ర గమనం')}
            </div>

            {/* PAGE 13: CHAPTER 10 — PREMIUM ROYAL REMEDIES SUITE & TEMPLE ENDORSEMENT */}
            <div className="print-page-break print-page-sheet space-y-3">
              {renderPrintPageHeader()}

              <div className="bg-gradient-to-br from-[#2b0902] via-[#3d1305] to-[#230701] text-white rounded-3xl p-5 sm:p-7 print:p-4 border-2 border-[#f59e0b] shadow-xl space-y-4 print:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/40 pb-3 print:pb-2 print-chapter-banner">
                  <div>
                    <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                      <Gem size={14} className="text-amber-300" />
                      <span>
                        {t(
                          'అధ్యాయం 10 · అదృష్ట రత్నం, రుద్రాక్ష, ఆరాధ్య దైవం & సంపూర్ణ వైదిక శాంతి పరిహారాలు',
                          'Chapter 10 · Lucky Gemstone, Rudraksha, Deity & Vedic Remedies'
                        )}
                      </span>
                    </div>
                    <h5 className="text-xl sm:text-2xl print:text-lg font-extrabold text-[#fde047]">
                      {t(
                        `${name} గారికి శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయ శాస్త్రోక్త పరిహార సూచనలు`,
                        `Prescribed Vedic Remedies & Lucky Guidelines for ${name}`
                      )}
                    </h5>
                  </div>
                  <span className="text-xs font-extrabold text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-200 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                    ✦ వ్యక్తిగత శాంతి పరిహార పత్రిక
                  </span>
                </div>

                {/* Balanced 2x2 Royal Remedies Grid (Every card has generous width, zero overflow) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 print:gap-3">
                  {/* Card 1: Lucky Gemstone */}
                  <div className="bg-[#4a1c08]/95 rounded-2xl p-4 print:p-3.5 border border-amber-400/50 space-y-1.5 print-card">
                    <span className="text-xs text-amber-300 font-extrabold block">
                      💎 {t('అదృష్ట రత్నం (Lucky Gemstone)', 'Lucky Gemstone (Ratnam)')}
                    </span>
                    <strong className="text-sm sm:text-base print:text-xs text-white block">
                      {t(predictions.remedies.luckyGemstoneTe, predictions.remedies.luckyGemstoneEn)}
                    </strong>
                    <p className="text-xs text-amber-100/95 leading-relaxed">
                      {t(predictions.remedies.wearingMethodTe, predictions.remedies.wearingMethodEn)}
                    </p>
                  </div>

                  {/* Card 2: Rudraksha & Deity */}
                  <div className="bg-[#4a1c08]/95 rounded-2xl p-4 print:p-3.5 border border-amber-400/50 space-y-1.5 print-card">
                    <span className="text-xs text-amber-300 font-extrabold block">
                      📿 {t('అనుకూల రుద్రాక్ష & ఆరాధ్య దైవం', 'Auspicious Rudraksha & Deity')}
                    </span>
                    <strong className="text-sm sm:text-base print:text-xs text-white block">
                      {t(predictions.remedies.rudrakshaTe, predictions.remedies.rudrakshaEn)}
                    </strong>
                    <p className="text-xs text-amber-100/95 leading-relaxed">
                      {t(`ఆరాధ్య దైవం: ${predictions.remedies.aradhyaDeivamTe}`, `Guiding Deity: ${predictions.remedies.aradhyaDeivamEn}`)}
                    </p>
                  </div>

                  {/* Card 3: Lucky Numbers, Days & Colors */}
                  <div className="bg-[#4a1c08]/95 rounded-2xl p-4 print:p-3.5 border border-amber-400/50 space-y-1.5 print-card">
                    <span className="text-xs text-amber-300 font-extrabold block">
                      🌟 {t('అదృష్ట సంఖ్యలు, వారాలు & రంగులు', 'Lucky Numbers, Days & Colors')}
                    </span>
                    <strong className="text-sm sm:text-base print:text-xs text-white block">
                      {t(`సంఖ్యలు: ${predictions.remedies.luckyNumbers} · వారాలు: ${predictions.remedies.luckyDaysTe}`, `Numbers: ${predictions.remedies.luckyNumbers} · Days: ${predictions.remedies.luckyDaysEn}`)}
                    </strong>
                    <p className="text-xs text-amber-100/95 leading-relaxed">
                      {t(`అనుకూల రంగులు: ${predictions.remedies.luckyColorsTe}`, `Lucky Colors: ${predictions.remedies.luckyColorsEn}`)}
                    </p>
                  </div>

                  {/* Card 4: Daily Stotras & Charitable Remedies */}
                  <div className="bg-[#4a1c08]/95 rounded-2xl p-4 print:p-3.5 border border-amber-400/50 space-y-1.5 print-card">
                    <span className="text-xs text-amber-300 font-extrabold block">
                      📖 {t('నిత్య పారాయణ స్తోత్రాలు & దాన పరిహారాలు', 'Daily Parayana Stotras & Charitable Remedies')}
                    </span>
                    <strong className="text-sm sm:text-base print:text-xs text-white block">
                      {t(predictions.remedies.nityaStotraTe, predictions.remedies.nityaStotraEn)}
                    </strong>
                    <p className="text-xs text-amber-100/95 leading-relaxed">
                      {t(`దాన ధర్మాలు: ${predictions.remedies.danaPariharamTe}`, `Charitable Remedies: ${predictions.remedies.danaPariharamEn}`)}
                    </p>
                  </div>

                  {/* Card 5: FULL-WIDTH PREMIUM ROYAL EMERALD & GOLD TEMPLE ENDORSEMENT BANNER (Fits 100% inside tab!) */}
                  <div className="sm:col-span-2 print:col-span-2 bg-gradient-to-r from-[#043927] via-[#064e3b] to-[#043927] rounded-2xl p-4 sm:p-5 print:p-3.5 border-2 border-[#f59e0b] shadow-lg flex flex-col md:flex-row print:flex-row items-center justify-between gap-4 print-card">
                    <div className="flex flex-col sm:flex-row print:flex-row items-center gap-3.5 text-center sm:text-left print:text-left min-w-0">
                      <a
                        href="https://www.telugujyothisham.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-md ring-2 ring-amber-300 block"
                      >
                        <img
                          src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                          alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                          width={56}
                          height={56}
                          className="w-full h-full rounded-full object-cover object-top"
                        />
                      </a>
                      <div className="min-w-0 space-y-0.5">
                        <span className="text-xs font-extrabold text-amber-300 tracking-wide block">
                          🕉️ {t('శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · హైదరాబాద్', 'Sri Lakshmi Ganapathi Jyothishalayam · Hyderabad')}
                        </span>
                        <strong className="text-base sm:text-lg print:text-sm font-extrabold text-white block">
                          {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Brahmasri Jallavaram Sai Dheeraj Sharma')}
                        </strong>
                        <p className="text-xs text-emerald-100 font-semibold">
                          {t('స్మార్త వైదిక & దృక్సిద్ధాంత జ్యోతిష్య నిపుణులు · తెలుగు జ్యోతిషం (Telugu Jyothisham)', 'Smarta Vaidika & Drik Siddhanta Vedic Astrology Scholar')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row print:flex-row items-center gap-2.5 shrink-0 w-full md:w-auto print:w-auto justify-center">
                      <a
                        href="https://www.telugujyothisham.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        translate="no"
                        className="notranslate inline-flex items-center justify-center gap-1.5 px-3.5 py-2 print:px-3 print:py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-[#2b0902] font-mono font-extrabold text-xs print:text-[10.5px] border border-amber-200 shadow-sm underline whitespace-nowrap"
                      >
                        <span>🌐 https://www.telugujyothisham.com</span>
                      </a>
                      <a
                        href={whatsappConsultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 print:px-3 print:py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs print:text-[10.5px] border border-emerald-300 shadow-sm underline whitespace-nowrap"
                      >
                        <span>💬 వాట్సాప్: +91 89779 86166</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Gemstone Safety Advisory (Mandatory Pandit Consultation Note) */}
                <div className="bg-rose-950/90 border-2 border-amber-400 rounded-2xl p-3.5 print:p-3 text-xs sm:text-sm print:text-xs text-amber-100 leading-relaxed print-card">
                  <strong className="text-amber-300 block mb-1">
                    ⚠️ ముఖ్య గమనిక — రత్న ధారణ జాగ్రత్త (Gemstone Safety Advisory):
                  </strong>
                  <span>
                    జాతకంలో నీచ స్థితిలో ఉన్న గ్రహానికి లేదా సూర్యునితో కలిసి అస్తంగత్వం (Combust) చెందిన గ్రహానికి సంబంధించిన రత్నాన్ని నేరుగా ధరించరాదు. ఏ రత్నాన్నైనా ధరించే ముందు ఖచ్చితంగా సిద్ధాంతుల వారిని సంప్రదించి (Wear only after consulting the Pandit), వ్యక్తిగత దశా భుక్తులను పరిశీలించిన తర్వాతే ధరించాలి.
                  </span>
                </div>
              </div>

              {renderPrintPageFooter('అధ్యాయం 10 · అదృష్ట రత్నం, రుద్రాక్ష & శాంతి పరిహారాలు')}
            </div>
          </div>
        )}

        {/* ====================================================================
            PAGE 14: FULL-WIDTH 120-YEAR VIMSHOTTARI MAHADASHA & ANTARDASHA
            9-PLANET GRID + ROYAL PANDIT BLESSING SEAL (DEDICATED PAGE - ZERO SPLIT!)
            ==================================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3.5 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 print-page-break print-page-sheet">
          {renderPrintPageHeader()}

          <div className="flex flex-wrap items-center justify-between gap-2 print-chapter-banner">
            <div>
              <h4 className="text-base sm:text-lg print:text-base font-extrabold text-amber-950 flex items-center gap-2">
                <Star size={18} className="text-amber-700" />
                <span>{t('120 ఏళ్ల వింశోత్తరి మహాదశ & అంతర్దశ కాలచక్రం', '120-Year Vimshottari Mahadasha & Antardasha Timeline')}</span>
              </h4>
              <p className="text-xs print:text-[11px] text-slate-600 mt-0.5">
                {t(
                  `${chartData.nakshatraName} (${chartData.pada}వ పాదం) ఆధారంగా మీ జీవితంలోని నవగ్రహ మహాదశల వరుస క్రమం మరియు భుక్తి వివరాలు (ప్రస్తుత దశ: ${predictions.dashaInfo.currentMahadasha.lordTe} మహాదశ – ${predictions.dashaInfo.currentAntardasha.lordTe} అంతర్దశ):`,
                  `Sequence of planetary Mahadasha & Antardasha periods calculated from ${chartData.nakshatraName} (Pada ${chartData.pada}):`
                )}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 print:grid-cols-2 gap-3.5 print:gap-2.5">
            {chartData.dashaList.map((d) => (
              <div
                key={d.lordTe}
                className={`p-4 print:p-2.5 rounded-2xl border transition-colors print-card ${
                  d.isCurrent
                    ? 'bg-amber-100/90 border-2 border-amber-600 shadow-2xs'
                    : 'bg-amber-50/40 border-amber-200/90 hover:bg-amber-50/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                    {t(d.lordTe, d.lordEn)}
                  </strong>
                  <span className="font-mono tabular-nums text-xs print:text-[10.5px] font-bold text-amber-900 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                    {d.startYear} – {d.endYear}
                  </span>
                </div>
                {d.isCurrent && (
                  <span className="inline-block mt-0.5 text-[11px] print:text-[10px] font-bold text-emerald-800">
                    ● {t('ప్రస్తుతం నడుస్తున్న మహాదశ', 'Currently Active Mahadasha')}
                  </span>
                )}
                <p className="text-xs print:text-[10.5px] text-slate-700 mt-1 leading-snug">
                  {t(d.summaryTe, d.summaryEn)}
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-amber-200/60 text-[11px] print:text-[10px] text-slate-600">
                  <span className="font-bold text-amber-950 block mb-0.5">
                    {t('అంతర్దశల క్రమం (Bhuktis):', 'Antardasha Sequence:')}
                  </span>
                  <p className="leading-snug">
                    {d.antardashas
                      .map((ad) => `${t(ad.lordTe.replace(' అంతర్దశ', ''), ad.lordEn.replace(' Bhukti', ''))} (${ad.months}నె)`)
                      .join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Royal Pandit Blessing, Signature & Website Seal at End of Report */}
          <div className="mt-3 rounded-2xl border-2 border-[#78350f] bg-gradient-to-r from-[#fffbeb] via-[#fef3c7] to-[#fde68a] p-4 sm:p-5 print:p-3 flex flex-col sm:flex-row print:flex-row items-center justify-between gap-4 print-card">
            <div className="space-y-1 text-center sm:text-left print:text-left">
              <span className="text-xs print:text-[10.5px] font-extrabold text-[#9a3412] tracking-wide block">
                || శుభం భూయాత్ · సర్వే జనాః సుఖినో భవంతు ||
              </span>
              <h5 className="text-base sm:text-lg print:text-sm font-extrabold text-[#451a03]">
                <a
                  href="https://www.telugujyothisham.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#451a03] hover:underline"
                >
                  బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
                </a>
              </h5>
              <p className="text-xs print:text-[11px] font-bold text-[#78350f]">
                శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · సంప్రదింపులకు:{' '}
                <a
                  href={whatsappConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#991b1b]"
                >
                  వాట్సాప్ / ఫోన్: +91 89779 86166
                </a>
              </p>
              <p className="text-[11px] print:text-[10px] text-slate-700">
                సాంప్రదాయ దృక్సిద్ధాంత జ్యోతిష విశ్లేషణ · వ్యక్తిగత గోప్యతా నిబంధనలకు (DPDP Act 2023) లోబడి రూపొందించబడింది.
              </p>
            </div>
            <a
              href="https://www.telugujyothisham.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center shrink-0 bg-[#451a03] hover:bg-[#5c2305] text-amber-100 px-4 py-2.5 print:px-3.5 print:py-2 rounded-xl border border-amber-400 block transition-colors"
            >
              <span className="text-[10px] text-amber-300 font-bold block">అధికారిక వెబ్‌సైట్ (Click to Open)</span>
              <strong translate="no" className="notranslate text-sm print:text-xs font-mono font-extrabold text-[#fde047] underline block mt-0.5">
                🌐 https://www.telugujyothisham.com
              </strong>
              <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">
                ఉచిత తెలుగు జాతకం & పంచాంగం
              </span>
            </a>
          </div>

          <a
            href={whatsappConsultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 print:py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm print:text-xs shadow-sm transition-colors underline print-card"
          >
            <MessageCircle size={18} />
            <span>
              {t(
                'ఈ జన్మ కుండలిని ధీరజ్ శర్మ గారికి వాట్సాప్ పంపి వ్యక్తిగత జాతక పరిశీలన పొందండి (+91 89779 86166)',
                'Send Kundali to Sri Dheeraj Sharma on WhatsApp for Personal Consultation (+91 89779 86166)'
              )}
            </span>
          </a>

          {renderPrintPageFooter('120 ఏళ్ల వింశోత్తరి మహాదశ & అంతర్దశ కాలచక్రం')}
        </div>
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

            <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="text-xs text-amber-950 leading-relaxed">
                <strong>{t('పీడీఎఫ్ (PDF) గా భద్రపరచుకునే విధానం:', 'How to Save as Clean PDF:')}</strong>
                <p className="mt-0.5 text-slate-700">
                  {t(
                    'క్రింది "PDF ప్రింట్ / సేవ్ చేయండి" బటన్ నొక్కండి. తెరుచుకునే ప్రింట్ విండోలో "Destination" (ప్రింటర్) వద్ద "Save as PDF" ఎంచుకుని సేవ్ బటన్ నొక్కితే పూర్తి జాతక నివేదిక శుభ్రంగా మీ ఫోన్/కంప్యూటర్‌లో సేవ్ అవుతుంది.',
                    'Click "Print / Save as PDF" below. In the print dialog, select "Save as PDF" as the Destination to download the clean multi-page PDF.'
                  )}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleTriggerDirectPrint}
                className="flex flex-col items-start gap-1.5 p-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white text-left transition-colors cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-200">
                  <Printer size={16} />
                  <span>{t('1. PDF ప్రింట్ / సేవ్ చేయండి', '1. Print / Save as PDF')}</span>
                </div>
                <span className="text-[11px] text-amber-100/90 leading-relaxed">
                  {t(
                    'హెడర్ లో పేరు, ఊరు, సమయం, DOB మరియు ఫుటర్ లో సైట్ లింక్ తో క్లీన్ PDF సిద్ధమవుతుంది.',
                    'Opens print preview ready to save as crisp multi-page PDF.'
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPrintableFile('a4-full', false)}
                className="flex flex-col items-start gap-1.5 p-3.5 rounded-2xl bg-amber-900 hover:bg-amber-800 text-white text-left transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-200">
                  <Download size={16} />
                  <span>{t('2. పూర్తి జాతక ఫైల్ (.html)', '2. Download HTML File')}</span>
                </div>
                <span className="text-[11px] text-amber-100/90 leading-relaxed">
                  {t(
                    'ఆఫ్‌లైన్‌లో లేదా ఇంటర్నెట్ లేకున్నా ఓపెన్ చేసుకునేలా ఫైల్ డౌన్‌లోడ్ అవుతుంది.',
                    'Downloads offline-ready horoscope document to your device.'
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadKundaliImage}
                className="flex flex-col items-start gap-1.5 p-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-left transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-200">
                  <ImageIcon size={16} />
                  <span>{t('3. కుండలి ఫోటో (PNG)', '3. Download Chart PNG')}</span>
                </div>
                <span className="text-[11px] text-emerald-100/90 leading-relaxed">
                  {t(
                    'D1 రాశి చక్రం, D9 నవాంశలతో కూడిన HD ఇమేజ్ ఫోన్ గ్యాలరీలోకి సేవ్ అవుతుంది.',
                    'Saves HD traditional Kundali chart image to your device.'
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
                onClick={handleTriggerDirectPrint}
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
