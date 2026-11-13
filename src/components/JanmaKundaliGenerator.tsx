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
  FileText,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';
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
  exportVariableHeightJathakamPdf,
  ExportedPdfResult,
} from '../utils/dynamicVariableHeightPdfExporter';
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
import { generateCompleteNaadiTransitReport } from '../utils/naadiTransitPredictions';
import {
  getRashiEncyclopediaByIdOrIndex,
  LUNAR_AND_SHANI_MENTAL_GUIDES,
} from '../data/dwadasaRashiVedicEncyclopedia';
import { evaluateEightClassicalGranthasForKundali } from '../data/classicalGranthaSutras';
import { computeKundaliJHoraSphutasAndJaimini } from '../utils/jhoraAdvancedEngine';
import { computeDivineVedicProReport } from '../utils/divineVedicProEngine';
import { computePhalitaSynthesis } from '../utils/phalitaSynthesisEngine';
import { computePersonalHoroscopeVastu } from '../utils/dakshinaBharatiyaMarriageAndVastuEngine';
import { computeBhavarthaAndAyurvedaReport } from '../utils/bhavarthaAndAyurvedaEngine';
import { computeBhriguNadiAndShodashavargaReport } from '../utils/bhriguNadiAndShodashavargaEngine';
import { computeKPReportForKundali } from '../utils/kpAndPrashnaEngine';
import { computeRatnaRudrakshaAndRemedyAdvisor } from '../utils/vrataCalendarAndRatnaEngine';
import { FamilyProfilesVaultBar } from './FamilyProfilesVaultBar';
import { RatnaRudrakshaAdvisorCard } from './RatnaRudrakshaAdvisorCard';
import { PrashnaKundaliWidget } from './PrashnaKundaliWidget';
import { computeDeepVedicPredictions } from '../utils/deepVedicPredictionsEngine';
import { JHoraChartsWorkbench } from './JHoraChartsWorkbench';
import { DeepVedicPredictionsChapters } from './DeepVedicPredictionsChapters';
import { AdvancedVedicTimingSuite } from './AdvancedVedicTimingSuite';
import { CosmicRadarAndBTRSuite } from './CosmicRadarAndBTRSuite';
import { ChartStyleType } from '../utils/jhoraChartsEngine';

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

import { BIRTH_CITIES, BIRTH_CITY_GROUPS } from '../data/birthCitiesData';

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

export const JanmaKundaliGenerator: React.FC<JanmaKundaliGeneratorProps> = ({
  onOpenBooking,
  prefillClient,
}) => {
  const { t, language } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();
  const [name, setName] = useState<string>(prefillClient?.name || 'శ్రీనివాస శర్మ');
  const [birthDate, setBirthDate] = useState<string>(prefillClient?.birthDate || '1994-08-15');
  const [birthTime, setBirthTime] = useState<string>(prefillClient?.birthTime || '09:30');
  const [selectedCityId, setSelectedCityId] = useState<string>(prefillClient?.cityId || 'hyderabad');
  const [chartMode, setChartMode] = useState<'D1' | 'D9'>('D1');
  const [jhoraChartStyle, setJhoraChartStyle] = useState<ChartStyleType>('south');
  const [predictionTab, setPredictionTab] = useState<'sunmoon' | 'elements' | 'sutras' | 'timeline' | 'ashtakavarga' | 'bhavas' | 'naadi'>('sunmoon');
  const [showFullGrantham, setShowFullGrantham] = useState<boolean>(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(Boolean(prefillClient?.autoOpenPrint));
  const [pdfPreviewVariant, setPdfPreviewVariant] = useState<JathakaReportVariant>('sample');
  const [useTemplatePlaceholders, setUseTemplatePlaceholders] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [readyPdf, setReadyPdf] = useState<ExportedPdfResult | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const previewIframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const reportPrintWrapperRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setReadyPdf((prev) => {
      if (prev?.blobUrl) URL.revokeObjectURL(prev.blobUrl);
      return null;
    });
    setPdfError(null);
  }, [name, birthDate, birthTime, selectedCityId]);

  useEffect(() => {
    return () => {
      if (readyPdf?.blobUrl) {
        URL.revokeObjectURL(readyPdf.blobUrl);
      }
    };
  }, [readyPdf]);

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

  const activeDasha = chartData.dashaList.find((d) => d.isCurrent) || chartData.dashaList[0];

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
    const jhoraMaster = computeKundaliJHoraSphutasAndJaimini(chartData.planets, lagnaIdx);
    const bhriguShodashavarga = computeBhriguNadiAndShodashavargaReport(
      chartData.planets,
      lagnaIdx,
      jhoraMaster
    );
    const kpReport = computeKPReportForKundali(
      chartData.planets,
      birthDate,
      birthTime,
      selectedCity.lat,
      selectedCity.lon,
      selectedCity.tz
    );
    const ratnaAdvisor = computeRatnaRudrakshaAndRemedyAdvisor(
      lagnaIdx,
      chartData.planets,
      chartData.hasKujaDosha
    );
    const ashtakavarga = computeSarvashtakavargaMatrix(chartData.planets, lagnaIdx);
    const savSignBindus = Array.from({ length: 12 }, (_, sIdx) => {
      const found = ashtakavarga.houses.find((h) => h.rashiIdx === sIdx);
      return found?.bindus ?? 28;
    });
    const deepPredictions = computeDeepVedicPredictions(chartData.planets, lagnaIdx, birthDate);

    return {
      lagnaProfile: generateLagnaCompleteProfile(chartData.planets, lagnaIdx),
      sunMoon144: getSunMoonCombination144(sunIdx, moonIdx),
      elementStrengths: evaluateMehtaElementalStrengths(chartData.planets, lagnaIdx),
      specialSutras: evaluateMehtaSpecialSutras(chartData.planets, lagnaIdx, birthDate),
      eventTimelines: generateLifeEventProbabilityTimeline(chartData.planets, lagnaIdx, birthDate),
      ashtakavarga,
      savSignBindus,
      deepPredictions,
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
      naadiTransitReport: generateCompleteNaadiTransitReport(chartData.planets, lagnaIdx, birthDate),
      chandraRashiEncyclopedia: getRashiEncyclopediaByIdOrIndex(moonIdx),
      eightClassicalGranthas: evaluateEightClassicalGranthasForKundali({
        lagnaRashiIndex: lagnaIdx,
        moonRashiIndex: moonIdx,
        sunRashiIndex: sunIdx,
        nakshatraNameTe: chartData.nakshatraName,
        nakshatraNameEn: chartData.nakshatraName,
        planetRashis: chartData.planets.map((p) => ({
          id: p.id,
          nameTe: p.nameTe,
          nameEn: p.nameEn,
          rashiIndex: p.rashiIdx,
        })),
      }),
      jhoraMaster,
      divinePro: computeDivineVedicProReport(chartData.planets, lagnaIdx, birthDate, birthTime),
      phalita: computePhalitaSynthesis(chartData.planets, lagnaIdx, birthDate, activeDasha?.lordTe),
      personalVastu: computePersonalHoroscopeVastu(moonIdx),
      bhavarthaAyurveda: computeBhavarthaAndAyurvedaReport(chartData.planets, lagnaIdx),
      bhriguShodashavarga,
      kpReport,
      ratnaAdvisor,
    };
  }, [chartData, birthDate, birthTime, selectedCity, activeDasha?.lordTe]);

  const whatsappConsultUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ గారు, నా దృక్సిద్ధాంత జన్మ కుండలి వివరాలు:\nపేరు: ${name}\nపుట్టిన తేదీ: ${birthDate}\nసమయం: ${birthTime}\nప్రాంతం: ${selectedCity.labelTe}\nజన్మ రాశి: ${chartData.rashi.te}\nజన్మ నక్షత్రం: ${chartData.nakshatraName} (${chartData.pada}వ పాదం)\nజన్మ లగ్నం (D1): ${chartData.lagna.te}\nనవాంశ లగ్నం (D9): ${chartData.navamshaLagna.te}\nప్రస్తుత మహాదశ: ${activeDasha.lordTe}.\nసంపూర్ణ జాతక పరిశీలన మరియు పరిహారాల కోసం సంప్రదిస్తున్నాను.`
  )}`;

  const activePlanetsMap = chartMode === 'D1' ? chartData.d1RashiPlanets : chartData.d9NavamshaPlanets;
  const activeLagnaId = chartMode === 'D1' ? chartData.lagna.id : chartData.navamshaLagna.id;

  const handleSelectSection = (tab: 'sunmoon' | 'elements' | 'sutras' | 'timeline' | 'ashtakavarga' | 'bhavas' | 'naadi') => {
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

  // Trigger native print / Save as PDF directly with all 17 pages visible (Print Version)
  const handlePrintHoroscope = () => {
    if (!showFullGrantham) {
      setShowFullGrantham(true);
      setTimeout(() => {
        window.print();
      }, 100);
      return;
    }
    window.print();
  };

  // Generate & download true variable-height PDF (210mm fixed width x auto content height + 10mm bottom margin)
  const handleDownloadDynamicHeightPdf = async () => {
    if (isGeneratingPdf) return;
    setIsPrintModalOpen(false);
    setPdfError(null);
    setReadyPdf((prev) => {
      if (prev?.blobUrl) URL.revokeObjectURL(prev.blobUrl);
      return null;
    });

    if (!showFullGrantham) {
      setShowFullGrantham(true);
      await new Promise((r) => setTimeout(r, 150));
    }
    if (!reportPrintWrapperRef.current) {
      setPdfError(
        t(
          'జాతక నివేదిక కంటెంట్ లోడ్ కాలేదు. దయచేసి ప్రింట్ లేదా ఆఫ్‌లైన్ HTML డౌన్‌లోడ్ ప్రయత్నించండి.',
          'Horoscope report container is not ready. Please use Print or Offline HTML download below.'
        )
      );
      return;
    }
    try {
      setIsGeneratingPdf(true);
      const totalSheets = reportPrintWrapperRef.current.querySelectorAll('.print-page-sheet, .page, .pdf-page').length;
      setPdfProgress({ current: 1, total: Math.max(1, totalSheets) });
      const asciiBase = name
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '');
      const safeFileName = `${asciiBase || 'Telugu_Jathakam'}_Brihat_Jathakam_Report.pdf`;
      const result = await exportVariableHeightJathakamPdf(
        reportPrintWrapperRef.current,
        safeFileName,
        (current, total) => setPdfProgress({ current, total })
      );
      setReadyPdf(result);
    } catch (err) {
      console.error('Dynamic height PDF generation failed:', err);
      const detail = err instanceof Error ? err.message : '';
      setPdfError(
        t(
          `PDF తయారీలో సాంకేతిక అంతరాయం కలిగింది${detail ? ` (${detail})` : ''}. క్రింది "ఆఫ్‌లైన్ HTML డౌన్‌లోడ్" లేదా "ప్రింట్ / సేవ్ PDF" బటన్ వాడి వెంటనే సేవ్ చేసుకోండి.`,
          `PDF generation encountered an issue${detail ? ` (${detail})` : ''}. Please use Offline File Download or Print / Save PDF below.`
        )
      );
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  // Trigger print directly from inside the modal by closing modal first
  const handleTriggerDirectPrint = () => {
    setIsPrintModalOpen(false);
    handlePrintHoroscope();
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
    const asciiSafeName =
      name
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'Telugu_Janma_Kundali';
    const suffix =
      chosenPlaceholders
        ? 'Placeholder_Template'
        : chosenVariant === 'sample'
        ? 'Sample_Cover_Top3_A4'
        : chosenVariant === 'mobile'
        ? 'Mobile_WhatsApp_Edition'
        : 'Full_A4_Jathakam_Report';
    link.href = url;
    link.download = `${asciiSafeName}_${suffix}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
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

  const TOTAL_A4_PAGES = 30;

  // Non-overlapping 3-Column Print Page Header with Royal Temple Flourish & Top Breathing Room
  const renderPrintPageHeader = (pageNo?: number) => (
    <div className="print-only mb-4">
      <div className="text-center text-[8.5px] font-extrabold text-[#9a3412] tracking-widest mb-1">
        ❈ ─── ❖ || ఓం శ్రీ మహాగణాధిపతయే నమః · శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం || ❖ ─── ❈
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 w-full border-y border-amber-300 bg-[#fffdf6] px-3.5 py-2 rounded-xl text-[9.5px] font-bold text-[#78350f] shadow-2xs">
        <a
          href="https://www.telugujyothisham.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-left text-[#78350f] underline truncate"
        >
          🪷 శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం
        </a>
        <span className="text-center font-extrabold text-[#451a03] text-[10.5px] px-2 whitespace-nowrap">
          బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
        </span>
        <span className="text-right truncate">
          జాతకులు: {name}
          {pageNo ? ` · పేజీ ${pageNo}/${TOTAL_A4_PAGES}` : ''}
        </span>
      </div>
    </div>
  );

  // Non-overlapping 3-Column Print Page Footer with Generous Post-Text Breathing Gap ("text ayyaka gap")
  const renderPrintPageFooter = (sectionLabel?: string, pageNo?: number) => {
    const shortSection = sectionLabel ? sectionLabel.split(' · ')[0] : 'బృహత్ జాతక నివేదిక';
    return (
      <div className="print-only mt-6 pt-3">
        <div className="text-center text-[8.5px] font-extrabold text-[#b45309] tracking-widest mb-2">
          ❈ ─── ❖ 🕉️ శుభం భూయాత్ · www.telugujyothisham.com 🕉️ ❖ ─── ❈
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 w-full border-y border-amber-300 bg-[#fffdf6] px-3.5 py-2 rounded-xl text-[9.5px] font-bold text-[#78350f] shadow-2xs">
          <a
            href={whatsappConsultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-[#78350f] underline truncate"
          >
            💬 వాట్సాప్: +91 89779 86166
          </a>
          <div className="text-center px-2">
            <a
              href="https://www.telugujyothisham.com"
              target="_blank"
              rel="noopener noreferrer"
              translate="no"
              className="notranslate inline-block font-extrabold text-[#991b1b] bg-amber-100/90 px-3.5 py-0.5 rounded-full border border-amber-300 text-[9.5px] font-mono underline whitespace-nowrap"
            >
              🌐 https://www.telugujyothisham.com
            </a>
          </div>
          <span className="text-right truncate">
            {shortSection}
            {pageNo ? ` · పేజీ ${pageNo}/${TOTAL_A4_PAGES}` : ''}
          </span>
        </div>
      </div>
    );
  };

  // Helper to render a Grand Single-Column South Indian Temple Kundali Plate (D1 or D9) in Decent Light Palette
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
          className={`min-w-0 min-h-[96px] p-2 border border-amber-300 relative flex flex-col justify-between gap-1.5 overflow-hidden ${
            isLagna
              ? 'bg-[#fef9c3]/55'
              : isJanmaRashi
              ? 'bg-[#ecfdf5]/75'
              : 'bg-white'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1 border-b border-dashed border-amber-300/80 pb-0.5">
              <span className="text-[10.5px] sm:text-xs print:text-[10px] font-extrabold text-[#78350f] truncate">
                {rashiInfo.te}
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] print:text-[8.5px] font-bold text-[#9a3412] bg-amber-50 border border-amber-200 px-1.5 py-0 rounded shrink-0">
                {houseNum}వ భావం
              </span>
            </div>

            {isLagna && (
              <div className="inline-block text-[8.5px] sm:text-[9.5px] print:text-[8.5px] font-extrabold text-[#991b1b] bg-amber-200/90 border border-amber-400 px-2 py-0.5 rounded shadow-2xs">
                ★ లగ్నం (Asc)
              </div>
            )}
            {!isLagna && isJanmaRashi && (
              <div className="inline-block text-[8.5px] sm:text-[9.5px] print:text-[8.5px] font-extrabold text-[#065f46] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                ☽ జన్మ రాశి
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 content-start">
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
                    className={`inline-flex items-center gap-1 text-[9.5px] sm:text-[10.5px] print:text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                      isSun
                        ? 'bg-orange-50/90 border-orange-200 text-orange-950'
                        : isMoon
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : isMars
                        ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                        : isJup
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <span>
                      {pl.nameTe}
                      {pl.isRetro && pl.nameTe !== 'రాహువు' && pl.nameTe !== 'కేతువు' ? '(వ)' : ''}
                    </span>
                    {plateMode === 'D1' && shortDeg && (
                      <span className="text-[8.5px] font-mono text-amber-900 font-bold" translate="no">
                        {shortDeg}
                      </span>
                    )}
                    {plateMode === 'D1' && dig?.dignityCode === 'ucha' && (
                      <span className="text-[7.5px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-1 rounded">ఉచ్చ</span>
                    )}
                    {plateMode === 'D1' && dig?.dignityCode === 'neecha' && (
                      <span className="text-[7.5px] bg-rose-100 text-rose-900 border border-rose-300 px-1 rounded">నీచ</span>
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
      <div className="p-3.5 sm:p-4 print:p-3.5 rounded-3xl bg-[#fffdf9] border-2 border-amber-300 shadow-xs print-card">
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm print:text-[10.5px] font-extrabold text-[#78350f] pb-2 mb-2.5 border-b border-amber-200">
          <span className="truncate">🪷 శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం</span>
          <span className="bg-amber-100/90 text-[#451a03] px-3.5 py-1 rounded-full border border-amber-300 shrink-0 shadow-2xs">
            {plateMode === 'D1' ? '★ రాశి చక్రం (D1 Janma Rashi Chakra)' : '★ నవాంశ చక్రం (D9 Navamsha Chakra)'}
          </span>
          <span className="shrink-0">దృక్సిద్ధాంత గణితం 🪷</span>
        </div>

        {/* Grand Single-Column 4x4 South Indian Kundali Grid (520px wide, min 400px tall — Serene Light Ivory Centerpiece!) */}
        <div className="w-full max-w-[520px] min-h-[400px] print:w-[520px] print:min-h-[400px] mx-auto grid grid-cols-4 grid-rows-4 border-2 border-amber-400 bg-white shadow-2xs">
          {outerCells.map((c) => renderSingleSquareCell(c.rIdx, c.row, c.col))}

          {/* Center 2x2 Serene Light Cream-Gold Sanctum Box */}
          <div
            style={{ gridColumn: '2 / 4', gridRow: '2 / 4' }}
            className="border-[1.5px] border-amber-400 bg-gradient-to-br from-[#fffdf7] via-[#fef9c3]/45 to-[#fef3c7]/60 text-[#451a03] p-2.5 flex flex-col items-center justify-center text-center overflow-hidden"
          >
            <div className="w-full h-full border border-amber-300/90 rounded-xl p-2 bg-white/80 flex flex-col items-center justify-center gap-1 overflow-hidden">
              <div className="text-[9px] sm:text-[10px] print:text-[9px] font-bold text-[#9a3412]">
                || ఓం శ్రీ మహాగణాధిపతయే నమః ||
              </div>
              <div className="inline-block bg-amber-100 text-[#451a03] border border-amber-300 font-extrabold text-[11px] sm:text-xs print:text-[10.5px] px-3 py-0.5 rounded-full shadow-2xs">
                {plateMode === 'D1' ? 'రాశి చక్రం (D1)' : 'నవాంశ చక్రం (D9)'}
              </div>
              <div className="text-xs sm:text-sm print:text-[11px] font-extrabold text-slate-900 truncate max-w-full">
                {name}
              </div>
              <div className="text-[9.5px] sm:text-[10.5px] print:text-[9px] font-mono font-bold text-slate-700">
                {birthDate} · {birthTime} ({selectedCity.labelTe.split(' (')[0]})
              </div>
              <div className="text-[9.5px] sm:text-[10.5px] print:text-[9.5px] font-extrabold text-emerald-800">
                {plateMode === 'D1'
                  ? `లగ్నం: ${chartData.lagna.te} | రాశి: ${chartData.rashi.te}`
                  : `నవాంశ లగ్నం: ${chartData.navamshaLagna.te}`}
              </div>
              <div className="text-[9px] sm:text-[10px] print:text-[9px] font-bold text-[#78350f]">
                నక్షత్రం: {chartData.nakshatraName} ({chartData.pada}వ పాదం)
              </div>
              <a
                href="https://www.telugujyothisham.com"
                target="_blank"
                rel="noopener noreferrer"
                translate="no"
                className="notranslate text-[9px] sm:text-[9.5px] print:text-[8.5px] text-[#991b1b] hover:text-[#451a03] underline font-bold pt-1 border-t border-amber-300/70 font-mono whitespace-nowrap block"
              >
                www.telugujyothisham.com
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-2 text-[9.5px] sm:text-[10.5px] print:text-[9px] font-bold text-[#78350f] pt-2 mt-2 border-t border-amber-200">
          <span className="text-left truncate">
            ★ లగ్నం: {plateMode === 'D1' ? chartData.lagna.te : chartData.navamshaLagna.te}
          </span>
          <a
            href="https://www.telugujyothisham.com"
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            className="notranslate font-mono font-extrabold text-[#991b1b] hover:text-[#78350f] underline text-center whitespace-nowrap"
          >
            www.telugujyothisham.com
          </a>
          <span className="text-right truncate">
            ☽ జన్మ రాశి: {chartData.rashi.te}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 print:space-y-0 font-telugu pb-8 print:pb-0" translate="no">
      {/* Birth Details Form with Drik Siddhanta Badge & SINGLE Clean A4 PDF Download Button (Screen Only) */}
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
              {BIRTH_CITY_GROUPS.map((grp) => (
                <optgroup
                  key={grp.groupTe}
                  label={language === 'en' ? grp.groupEn : grp.groupTe}
                >
                  {grp.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {language === 'en' ? city.labelEn : city.labelTe}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Report Ready Info Bar */}
        <div className="mt-4 pt-4 border-t border-amber-300/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span>
              {t(
                `37-అధ్యాయాల సంపూర్ణ జాతక నివేదిక సిద్ధంగా ఉంది: ${name} (${birthDate} · ${birthTime} · ${selectedCity.labelTe.split(' (')[0]})`,
                `37-Chapter Horoscope Report Ready: ${name} (${birthDate} · ${birthTime})`
              )}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-amber-800">
            {isGuruAdmin
              ? t(
                  '🔒 అడ్మిన్ / AI Studio మోడ్: క్రింద చివరలో PDF డౌన్‌లోడ్ చేసుకోండి ↓',
                  '🔒 Admin / Studio Mode: Scroll down to download PDF at the end ↓'
                )
              : t(
                  '📖 క్రింద 37 అధ్యాయాల పూర్తి జాతక ఫలితాలను చదవండి ↓',
                  '📖 Scroll down to read all 37 chapters of your horoscope ↓'
                )}
          </span>
        </div>

        <div className="mt-4">
          <FamilyProfilesVaultBar
            currentName={name}
            currentBirthDate={birthDate}
            currentBirthTime={birthTime}
            currentCityId={selectedCityId}
            onLoadProfile={(prof) => {
              setName(prof.name);
              setBirthDate(prof.birthDate);
              setBirthTime(prof.birthTime);
              setSelectedCityId(prof.cityId);
            }}
          />
        </div>
      </div>

      {/* Jagannatha Hora Pro Multi-Chart Studio (South / North / East Indian, D1–D60, Sudarshana, Ashtakavarga) */}
      <JHoraChartsWorkbench
        nativeName={name}
        birthTime={birthTime}
        planets={chartData.planets}
        savSignBindus={predictions.savSignBindus}
        chartStyle={jhoraChartStyle}
        onChartStyleChange={setJhoraChartStyle}
      />

      {/* ==========================================================================
          COMPLETE PRINT & SCREEN REPORT — 17 DEDICATED PAGES WITH DYNAMIC HEIGHT
          ========================================================================== */}
      <div ref={reportPrintWrapperRef} className="space-y-6 print:space-y-0">
        {/* ==========================================================================
            PAGE 1 MASTERPIECE: GURUJI HERO PHOTO & FULL BIO + DIRECT HYPERLINKS +
            NATIVE DETAILS + D1 & D9 KUNDALI CHAKRAS + TRIPLE KUJA DOSHA
            ========================================================================== */}
        <div className="space-y-3 print:space-y-1.5 page print-page-sheet">
          {renderPrintPageHeader(1)}

          {/* Serene Light Header Container with HIGHLIGHTED Astrologer Profile Card + Light Native Profile */}
          <div className="rounded-3xl border-2 border-amber-300 bg-[#fffdf9] text-slate-900 p-4 sm:p-5 print:p-2.5 shadow-xs print-card space-y-2.5 print:space-y-2">
            {/* Top Auspicious Invocation Row + Direct Clickable Site Link */}
            <div className="flex flex-wrap items-center justify-between gap-1 border-b border-amber-200 pb-1.5 text-[10px] print:text-[8px] font-bold text-[#9a3412]">
              <span>
                || ఓం శ్రీ మహాగణాధిపతయే నమః · శ్రీ విరూపాక్ష ఆశీస్సులతో ||
              </span>
              <span className="font-extrabold text-[#451a03] text-xs print:text-[9px]">
                శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · హైదరాబాద్
              </span>
              <a
                href="https://www.telugujyothisham.com"
                target="_blank"
                rel="noopener noreferrer"
                translate="no"
                className="notranslate inline-block bg-amber-100 text-[#78350f] border border-amber-300 px-2.5 py-0.5 rounded-full font-extrabold text-[9.5px] print:text-[8px] underline shadow-2xs"
              >
                🌐 www.telugujyothisham.com
              </a>
            </div>

            {/* ★ HIGHLIGHTED ASTROLOGER PROFILE CARD (Stands out richly while rest of page stays light!) ★ */}
            <div className="flex flex-col sm:flex-row print:flex-row items-center gap-3 print:gap-2.5 bg-gradient-to-r from-[#3b1205] via-[#5a1f08] to-[#3b1205] text-amber-50 border-2 border-[#f59e0b] ring-2 ring-amber-300/60 rounded-2xl p-3.5 print:p-2.5 shadow-md">
              {/* Hero Photo */}
              <div className="shrink-0 text-center">
                <a
                  href="https://www.telugujyothisham.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-24 h-24 sm:w-28 sm:h-28 print:w-14 print:h-14 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 shadow-xl mx-auto ring-2 ring-amber-300"
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
                <span className="inline-block mt-1 bg-gradient-to-r from-amber-400 to-orange-400 text-[#2b0902] font-extrabold text-[9px] print:text-[6.8px] px-2 py-0.5 rounded-full">
                  స్మార్త వైదిక & జ్యోతిష్య విద్వాంసులు
                </span>
              </div>

              {/* Complete Guruji Details & Clickable Hyperlinks */}
              <div className="flex-1 text-center sm:text-left print:text-left space-y-1 print:space-y-0.5">
                <div className="text-[10.5px] print:text-[7.8px] font-bold text-amber-300 uppercase tracking-wider">
                  స్మార్త వైదిక & దృక్సిద్ధాంత జ్యోతిష్య నిపుణులు · 15+ ఏళ్ల గురుపరంపర వేద సంప్రదాయం
                </div>
                <h2 className="text-lg sm:text-2xl print:text-sm font-extrabold text-[#fde047] leading-tight">
                  <a
                    href="https://www.telugujyothisham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-[#fde047]"
                  >
                    బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (Brahmasri Jallavaram Sai Dheeraj Sharma)
                  </a>
                </h2>
                <p className="text-[11px] sm:text-xs print:text-[7.8px] text-amber-100/95 leading-snug">
                  <strong>శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం, హైదరాబాద్:</strong> దృక్సిద్ధాంత ఖగోళ గణిత సంపూర్ణ జాతక పరిశీలన, 36 గుణాల వధూవరుల వివాహ పొంతన, వివాహ-గృహప్రవేశ సిద్ధ ముహూర్త నిర్ణయం మరియు శ్రీ చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర మహా హోమ క్రతువుల నిర్వహణ.
                </p>

                {/* Clickable Action Links inside PDF & Screen */}
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start print:justify-start gap-2 print:gap-1.5 text-[10px] print:text-[7.8px] font-extrabold">
                  <a
                    href="https://www.telugujyothisham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-400 text-[#2b0902] underline shadow-2xs"
                  >
                    🌐 వెబ్‌సైట్: https://www.telugujyothisham.com
                  </a>
                  <a
                    href={whatsappConsultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white underline shadow-2xs"
                  >
                    💬 వాట్సాప్: +91 89779 86166
                  </a>
                  <a
                    href="tel:+918977986166"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-800 text-amber-100 border border-amber-400/60 underline"
                  >
                    📞 కాల్: +91 89779 86166
                  </a>
                </div>
              </div>
            </div>

            {/* Strictly Centered Native Horoscope Title in Decent Light Cream Banner */}
            <div className="text-center space-y-0.5 bg-amber-50/70 border border-amber-200 rounded-2xl py-2 px-3">
              <h1 className="text-xl sm:text-2xl print:text-sm font-extrabold text-[#451a03] tracking-wide leading-tight">
                🌟 {name} గారి సంపూర్ణ బృహత్ జాతక & కుండలి మహాగ్రంథం 🌟
              </h1>
              <p className="text-[11px] sm:text-xs print:text-[8px] text-slate-700 font-semibold">
                జాతకుని పేరు: <strong className="text-amber-950">{name}</strong> · పుట్టిన తేదీ: <strong className="text-amber-950">{birthDate}</strong> · సమయం: <strong className="text-amber-950">{birthTime}</strong> · జన్మ స్థలం: <strong className="text-amber-950">{selectedCity.labelTe}</strong> · లహిరి అయనాంశం: <strong className="text-emerald-800">{chartData.ayanamsaFormatted}</strong>
              </p>
            </div>

            {/* 8-Box Native Birth & Astrological Highlights Grid (Decent Light Ivory Cards — Spacious & Non-overlapping) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2 print:gap-1.5 text-xs">
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">👤 జాతకుని పేరు (Full Name)</span>
                <strong className="text-slate-900 text-xs sm:text-sm print:text-[10.5px] font-extrabold block break-words">{name}</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">📅 పుట్టిన తేదీ & సమయం</span>
                <strong className="text-slate-900 text-xs sm:text-sm print:text-[10.5px] font-mono font-extrabold block">{birthDate} · {birthTime}</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">📍 జన్మ స్థలం (Place)</span>
                <strong className="text-slate-900 text-xs sm:text-sm print:text-[10.5px] font-extrabold block break-words">{selectedCity.labelTe.split(' (')[0]}</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">🌅 లగ్నం & నవాంశ (D1/D9)</span>
                <strong className="text-[#991b1b] text-xs sm:text-sm print:text-[10.5px] font-extrabold block break-words">
                  {chartData.lagna.te} / {chartData.navamshaLagna.te}
                </strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">☽ జన్మ రాశి (Moon Sign)</span>
                <strong className="text-emerald-800 text-xs sm:text-sm print:text-[10.5px] font-extrabold block break-words">
                  {chartData.rashi.te} ({chartData.rashi.en})
                </strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">☉ సూర్య రాశి (Sun Sign)</span>
                <strong className="text-orange-800 text-xs sm:text-sm print:text-[10.5px] font-extrabold block break-words">
                  {chartData.planets[1]?.rashiTe || 'కర్కాటకం'} ({chartData.planets[1]?.rashiEn || 'Cancer'})
                </strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">⭐ జన్మ నక్షత్రం & పాదం</span>
                <strong className="text-slate-900 text-xs sm:text-sm print:text-[10.5px] font-extrabold block break-words">
                  {chartData.nakshatraName} — {chartData.pada}వ పాదం
                </strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-2 print:p-1.5 text-center space-y-0.5">
                <span className="text-amber-900/90 block text-[10px] print:text-[8.5px] font-bold">⏳ ప్రస్తుత దశ (Current Dasha)</span>
                <strong className="text-[#991b1b] text-xs print:text-[10px] font-extrabold block break-words">
                  {predictions.dashaInfo.currentMahadasha.lordTe} – {predictions.dashaInfo.currentAntardasha.lordTe}
                </strong>
              </div>
            </div>
          </div>

          {/* Illuminated D1 Rashi & D9 Navamsha Royal Kundali Image Plates — Single-Side Full-Width Stack! */}
          <div className="grid grid-cols-1 single-side-stack gap-5 print:gap-4 items-stretch">
            {renderRoyalKundaliImagePlate('D1')}
            {renderRoyalKundaliImagePlate('D9')}
          </div>

          {/* Triple Reference Kuja Dosha Verification (Lagna, Moon, Venus) */}
          <div className="bg-[#fffdf9] rounded-2xl p-4 print:p-3 border border-amber-300 shadow-2xs print-card space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs sm:text-sm print:text-[10.5px] font-extrabold text-amber-950 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-800" />
                <span>త్రివిధ కుజ దోష సమగ్ర పరిశీలన (Lagna · Chandra Lagna · Shukra Lagna):</span>
              </strong>
              <span className="text-[11px] print:text-[9.5px] font-extrabold px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                {predictions.tripleKuja.summaryTitleTe}
              </span>
            </div>
            <div className="grid grid-cols-1 single-side-stack gap-2.5 text-xs print:text-[10px]">
              <div className={`p-2.5 rounded-xl border-l-4 border font-bold ${predictions.tripleKuja.fromLagna.hasDosha ? 'bg-rose-50/70 border-rose-200 border-l-rose-600 text-rose-900' : 'bg-emerald-50/70 border-emerald-200 border-l-emerald-600 text-emerald-900'}`}>
                1. లగ్నం నుండి: {predictions.tripleKuja.fromLagna.house}వ స్థానం — {predictions.tripleKuja.fromLagna.hasDosha ? 'కుజ దోష స్థానం' : 'కుజ దోషం లేదు'}
              </div>
              <div className={`p-2.5 rounded-xl border-l-4 border font-bold ${predictions.tripleKuja.fromChandra.hasDosha ? 'bg-rose-50/70 border-rose-200 border-l-rose-600 text-rose-900' : 'bg-emerald-50/70 border-emerald-200 border-l-emerald-600 text-emerald-900'}`}>
                2. చంద్ర లగ్నం నుండి: {predictions.tripleKuja.fromChandra.house}వ స్థానం — {predictions.tripleKuja.fromChandra.hasDosha ? 'పాక్షిక కుజ దోష స్థితి' : 'కుజ దోషం లేదు'}
              </div>
              <div className={`p-2.5 rounded-xl border-l-4 border font-bold ${predictions.tripleKuja.fromShukra.hasDosha ? 'bg-rose-50/70 border-rose-200 border-l-rose-600 text-rose-900' : 'bg-emerald-50/70 border-emerald-200 border-l-emerald-600 text-emerald-900'}`}>
                3. శుక్ర లగ్నం నుండి: {predictions.tripleKuja.fromShukra.house}వ స్థానం — {predictions.tripleKuja.fromShukra.hasDosha ? 'పాక్షిక కుజ దోష స్థితి' : 'కుజ దోషం లేదు'}
              </div>
            </div>
          </div>

          {renderPrintPageFooter('కుండలి చక్రాలు (D1 & D9)', 1)}
        </div>

        {/* ==========================================================================
            PAGE 2: PLANETARY DEGREES, DIGNITY TABLE & NEECHA BHANGA RAJA YOGA
            ========================================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 print-page-break page print-page-sheet">
          {renderPrintPageHeader(2)}

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3 print:pb-1.5">
            <div>
              <h4 className="text-base sm:text-lg print:text-sm font-extrabold text-amber-950 flex items-center gap-2">
                <Table2 size={18} className="text-amber-700" />
                <span>{t('నవగ్రహ స్ఫుటములు, నక్షత్ర పాదములు & గ్రహ ఆధిపత్య బల పట్టిక (Planetary Degrees & Dignity Table)', 'Planetary Degrees, Nakshatra Pada & Dignity Table')}</span>
              </h4>
              <p className="text-xs print:text-[10.5px] text-slate-600 mt-0.5">
                {t(
                  'నిరయన (Sidereal) గ్రహ డిగ్రీలు, రాశి (D1), నవాంశ (D9), ఉచ్చ / నీచ / స్వక్షేత్ర / వర్గోత్తమ / అస్తంగత్వ (Combust) స్థితి వివరాలు:',
                  'Exact Sidereal longitude, Rashi, Star Pada, D9 Navamsha, and Planetary Dignity (Exalted/Debilitated/Combust/Vargottama):'
                )}
              </p>
            </div>
            <span className="text-xs print:text-[10.5px] font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              లహిరి అయనాంశం: {chartData.ayanamsaFormatted}
            </span>
          </div>

          <div className="overflow-x-auto border border-amber-300 rounded-2xl print-card">
            <table className="w-full text-left border-collapse text-xs sm:text-sm print:text-[11px]">
              <thead>
                <tr className="bg-amber-100/85 text-amber-950 border-b-2 border-amber-300">
                  <th className="py-2 print:py-1.5 px-2.5 sm:px-3 font-extrabold">{t('గ్రహం', 'Planet')}</th>
                  <th className="py-2 print:py-1.5 px-2.5 sm:px-3 font-extrabold">{t('రాశి (D1)', 'Rashi (D1)')}</th>
                  <th className="py-2 print:py-1.5 px-2.5 sm:px-3 font-extrabold">{t('డిగ్రీలు', 'Degrees')}</th>
                  <th className="py-2 print:py-1.5 px-2.5 sm:px-3 font-extrabold">{t('నక్షత్రం (పాదం)', 'Nakshatra (Pada)')}</th>
                  <th className="py-2 print:py-1.5 px-2.5 sm:px-3 font-extrabold">{t('నవాంశ (D9)', 'Navamsha (D9)')}</th>
                  <th className="py-2 print:py-1.5 px-2.5 sm:px-3 font-extrabold">{t('గ్రహ ఆధిపత్య స్థితి (Dignity)', 'Planetary Dignity')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200">
                {chartData.planets.map((p) => {
                  const dig = predictions.dignities.find((d) => d.id === p.id);
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/60 odd:bg-amber-50/30">
                      <td className="py-2 print:py-1 px-2.5 sm:px-3 font-extrabold text-amber-950">
                        {language === 'en' ? p.nameEn : p.nameTe}
                        {p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu' && (
                          <span className="ml-1 text-[10px] text-rose-700 font-bold">(వక్రం)</span>
                        )}
                      </td>
                      <td className="py-2 print:py-1 px-2.5 sm:px-3 font-bold text-slate-900">
                        {language === 'en' ? p.rashiEn : p.rashiTe}
                      </td>
                      <td
                        translate="no"
                        dir="ltr"
                        className="notranslate py-2 print:py-1 px-2.5 sm:px-3 font-mono tabular-nums text-xs print:text-[11px] font-extrabold text-amber-900 whitespace-nowrap"
                      >
                        {formatStrictPlanetDms(p.longitude, p.degreeFormatted)}
                      </td>
                      <td className="py-2 print:py-1 px-2.5 sm:px-3 font-semibold text-slate-800">
                        {language === 'en' ? p.nakshatraEn : p.nakshatraTe} ({p.pada}వ పాదం)
                      </td>
                      <td className="py-2 print:py-1 px-2.5 sm:px-3 font-bold text-emerald-900">
                        {p.navamshaRashiTe}
                      </td>
                      <td className="py-2 print:py-1 px-2.5 sm:px-3 font-bold">
                        {dig ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-xs print:text-[10.5px] border ${
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
                          <span className="text-xs print:text-[10.5px] text-amber-900 font-bold">జన్మ లగ్న ప్రమాణం</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Neecha Bhanga Raja Yoga & Special Yoga Highlights Box (Single-Side Full-Width Stack) */}
          {predictions.neechaBhanga.length > 0 && (
            <div className="bg-amber-50/90 rounded-2xl p-4 print:p-3.5 border-2 border-amber-300 space-y-2.5 print-card">
              <h5 className="text-sm sm:text-base print:text-xs font-extrabold text-amber-950">
                👑 నీచభంగ రాజయోగ పరిశీలన (Neecha Bhanga Raja Yoga Verification):
              </h5>
              <div className="grid grid-cols-1 single-side-stack gap-3">
                {predictions.neechaBhanga.map((nb) => (
                  <div key={nb.planetTe} className="bg-white rounded-xl p-3.5 print:p-3 border border-amber-200 border-l-4 border-l-[#b45309] text-xs print:text-[11px] space-y-1.5 print-card">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-950 text-sm print:text-xs">{nb.planetTe} ({nb.debilitationRashiTe} రాశి)</strong>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10.5px] ${nb.hasNeechaBhanga ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                        {nb.cancellationTypeTe}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pb-1">{nb.explanationTe}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avakahada Chakra (Classical Telugu Jatakam Birth Profile Table) */}
          <div className="bg-amber-50/80 rounded-2xl p-4 print:p-3 border border-amber-300 space-y-2.5 print-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
              <h5 className="text-sm sm:text-base print:text-xs font-extrabold text-amber-950">
                📜 {t('అవకహడ చక్రం & జన్మ నామాక్షర పట్టిక (Avakahada Chakra)', 'Avakahada Chakra & Classical Birth Attributes')}
              </h5>
              <span className="text-[11px] font-bold text-emerald-900">
                {t('జన్మ నామాక్షరం:', 'Birth Syllable:')} {predictions.bhriguShodashavarga.avakahada.namaksharaTe}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 print:grid-cols-5 gap-2 text-xs print:text-[10px]">
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('రాశ్యాధిపతి', 'Rashi Lord')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.rashiLordTe, predictions.bhriguShodashavarga.avakahada.rashiLordEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('నక్షత్రాధిపతి', 'Nakshatra Lord')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.nakshatraLordTe, predictions.bhriguShodashavarga.avakahada.nakshatraLordEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('గణం', 'Gana')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.ganaTe, predictions.bhriguShodashavarga.avakahada.ganaEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('నాడి', 'Nadi')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.nadiTe, predictions.bhriguShodashavarga.avakahada.nadiEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('యోని', 'Yoni')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.yoniTe, predictions.bhriguShodashavarga.avakahada.yoniEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('వర్ణం', 'Varna')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.varnaTe, predictions.bhriguShodashavarga.avakahada.varnaEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('వశ్యం', 'Vashya')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.vashyaTe, predictions.bhriguShodashavarga.avakahada.vashyaEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('జన్మ పాయ', 'Janma Paya')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.payaTe, predictions.bhriguShodashavarga.avakahada.payaEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('తత్త్వం', 'Element (Tattva)')}</span>
                <strong className="text-slate-900">{t(predictions.bhriguShodashavarga.avakahada.tattvaTe, predictions.bhriguShodashavarga.avakahada.tattvaEn)}</strong>
              </div>
              <div className="bg-white rounded-xl p-2 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">{t('నామాక్షరం', 'Name Syllable')}</span>
                <strong className="text-amber-950">{predictions.bhriguShodashavarga.avakahada.namaksharaTe}</strong>
              </div>
            </div>
          </div>

          {renderPrintPageFooter('నవగ్రహ స్ఫుటములు & అవకహడ చక్రం', 2)}
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
                  {t(
                    '18 సమగ్ర అధ్యాయాలు · 30 పేజీల బృహత్ జాతక & నాడీ గోచార మహాగ్రంథం PDF',
                    '18 Comprehensive Chapters · 30-Page Brihat Jataka & Naadi Transit Grand PDF'
                  )}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-950 leading-snug">
                {t(
                  `${name} గారి 30-పేజీల సంపూర్ణ బృహత్ జాతక & నాడీ గోచార మహాగ్రంథం`,
                  `30-Page Complete Brihat Jataka & Naadi Transit Horoscope Report for ${name}`
                )}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {t(
                  `మీ జన్మ లగ్నం (${chartData.lagna.te}), సూర్య రాశి (${predictions.sunMoon144.sunRashiTe}), జన్మ రాశి (${chartData.rashi.te}), జన్మ నక్షత్రం (${chartData.nakshatraName} - ${chartData.pada}వ పాదం), ద్వాదశ స్థాన ఫలితాలు మరియు భృగు & పరాశర మహర్షి ప్రణీత నాడీ జ్యోతిష్య గోచార సూత్రాలతో (ఖచ్చితంగా ఫలించే సంవత్సరాలు & వయస్సులతో) రూపొందించబడిన 30 పేజీల శాస్త్రోక్త జాతక విశ్లేషణ:`,
                  `Prepared from your Ascendant (${chartData.lagna.en}), Sun Sign (${predictions.sunMoon144.sunRashiEn}), Moon Sign (${chartData.rashi.en}), Nakshatra (${chartData.nakshatraName} Pada ${chartData.pada}), 12 Houses, and Maharshi Bhrigu & Parashara Naadi Transit Sutras with Exact Manifestation Years (30 Pages):`
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
                    ? t('📖 30-పేజీల పూర్తి గ్రంథం వీక్షణ (Active)', '📖 Full 30-Page Report View (Active)')
                    : t('📖 30-పేజీల పూర్తి గ్రంథం తెరవండి', '📖 View Full 30-Page Report')}
                </span>
              </button>
            </div>
          </div>

          {/* 7 Category Navigation Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5 bg-amber-950/95 p-2 sm:p-2.5 rounded-2xl border border-amber-800 shadow-inner">
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

            <button
              type="button"
              onClick={() => handleSelectSection('naadi')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                predictionTab === 'naadi'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-900 hover:text-white border border-amber-800/80'
              }`}
            >
              <BookOpen size={14} className="shrink-0" />
              <span className="leading-snug">{t('7. నాడీ గోచారం', '7. Naadi Transits')}</span>
            </button>
          </div>

          {/* Quick Jump Strip for Chapters 25–29 */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-amber-900">
              {t('ప్రత్యేక అధ్యాయాలు:', 'Featured Chapters:')}
            </span>
            {[
              { id: 'chapter-25', labelTe: '25. 300 రాజయోగాలు & ఆయుర్వేదం', labelEn: '25. 300 Yogas & Ayurveda' },
              { id: 'chapter-26', labelTe: '26. భృగు నాడి & జైమిని ఇష్టదేవత', labelEn: '26. Bhrigu Nadi & Ishta Devata' },
              { id: 'chapter-27', labelTe: '27. సప్తవర్గ D1–D10 & త్రివిధ రుణం', labelEn: '27. Sapta-Varga D1–D10 & Runa' },
              { id: 'chapter-28', labelTe: '28. KP సబ్‌లార్డ్స్ & 12 భావ కుండలి', labelEn: '28. KP Cusps & Sub-Lords' },
              { id: 'chapter-29', labelTe: '29. రత్నం, రుద్రాక్ష & పరిహారం', labelEn: '29. Ratna, Rudraksha & Remedy' },
              { id: 'chapter-30', labelTe: '30. జైమిని చర దశ & షడ్బలం', labelEn: '30. Jaimini Chara Dasha & Shadbala' },
              { id: 'chapter-31', labelTe: '31. 5-ఏళ్ల గోచారం & ఏలినాటి శని', labelEn: '31. 5-Year Transit & Sade Sati' },
              { id: 'chapter-32', labelTe: '32. ప్రభుత్వ ఉద్యోగం, విదేశం, D60 కర్మ', labelEn: '32. Career, Foreign, Home & D60' },
              { id: 'chapter-33', labelTe: '33. ప్రత్యంతర దశ & డబుల్ ట్రాన్సిట్', labelEn: '33. Pratyantardasha & Double Transit' },
              { id: 'chapter-34', labelTe: '34. వార్షిక తాజిక వర్షఫల్ & ముద్దా దశ', labelEn: '34. Tajika Varshaphal & Mudda' },
              { id: 'chapter-35', labelTe: '35. అష్టోత్తరి, యోగిని & వర్గ ముద్రణ', labelEn: '35. Ashtottari, Yogini & Prints' },
              { id: 'chapter-36', labelTe: '36. జన్మ సమయ శుద్ధి (BTR Lab)', labelEn: '36. Birth Time Rectification' },
              { id: 'chapter-37', labelTe: '37. లైవ్ ఆకాశ గ్రహ రాడార్ & 12 నెలల గ్రాఫ్', labelEn: '37. Live Sky Radar & 12-Mo Power' },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setShowFullGrantham(true);
                  setTimeout(() => {
                    document.getElementById(ch.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 120);
                }}
                className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold whitespace-nowrap cursor-pointer transition-colors"
              >
                {t(ch.labelTe, ch.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================================
            PAGE 3: CHAPTER 1 — LAGNA & SUN-MOON ARCHETYPE SYNTHESIS
            ==================================================================== */}
        <div className={showFullGrantham || predictionTab === 'sunmoon' ? 'block space-y-6 print:space-y-0' : 'hidden print:block print:space-y-0'}>
          <div id="grantham-section-sunmoon" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-3.5 print:space-y-2 scroll-mt-24 print-page-break page print-page-sheet">
            {renderPrintPageHeader(3)}

            {/* Chapter 1 Banner */}
            <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-300 space-y-1.5 print:space-y-1 print-chapter-banner">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px] font-bold text-amber-900">
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

              <h5 className="text-lg sm:text-2xl print:text-sm font-bold text-amber-950">
                {t(
                  `జన్మ లగ్నం: ${chartData.lagna.te} · సూర్య రాశి: ${predictions.sunMoon144.sunRashiTe} (ఆత్మ) · జన్మ రాశి: ${predictions.sunMoon144.moonRashiTe} (మనస్సు)`,
                  `Ascendant: ${chartData.lagna.en} · Sun in ${predictions.sunMoon144.sunRashiEn} (Soul) · Moon in ${predictions.sunMoon144.moonRashiEn} (Mind)`
                )}
              </h5>

              <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed print:leading-snug">
                {t(predictions.lagnaProfile.dehaSwabhavamTe, predictions.lagnaProfile.dehaSwabhavamEn)}{' '}
                {t(predictions.lagnaProfile.lagnaLordEffectTe, predictions.lagnaProfile.lagnaLordEffectEn)}
              </p>

              <p className="text-xs sm:text-sm print:text-[11px] font-bold text-amber-900 pt-0.5">
                {t('ప్రధాన జీవన తత్వం: ', 'Core Life Themes: ')}
                <span className="font-normal text-slate-700">
                  {t(predictions.sunMoon144.themesTe, predictions.sunMoon144.themesEn)}
                </span>
              </p>
            </div>

            {/* Single-Side Full-Width Detailed Cards with Generous Post-Text Gap */}
            <div className="grid grid-cols-1 single-side-stack gap-4 sm:gap-5 print:gap-3.5">
              {/* Child 1: Personality & Career */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 print:p-4 border border-amber-200 border-l-4 border-l-[#b45309] space-y-2.5 print:space-y-2 print-card">
                <div className="text-xs print:text-[10.5px] font-bold text-amber-800">
                  {t('ఆత్మ-మనస్సు స్వభావం & వృత్తి ప్రస్థానం', 'Core Personality & Vocation')}
                </div>
                <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                  {t('వ్యక్తిత్వం, స్వభావం, విద్య & వృత్తి జీవితం', 'Core Personality, Education & Vocation')}
                </h6>
                <p className="text-sm sm:text-base print:text-[11px] text-slate-800 leading-relaxed pb-1.5">
                  {t(predictions.sunMoon144.personalityTe, predictions.sunMoon144.personalityEn)}
                </p>
                <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pt-2 border-t border-amber-100 pb-1">
                  {t(predictions.sunMoon144.careerAndWealthTe, predictions.sunMoon144.careerAndWealthEn)}
                </p>
              </div>

              {/* Child 2: Love, Marriage & Family */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 print:p-4 border border-amber-200 border-l-4 border-l-[#b45309] space-y-2.5 print:space-y-2 print-card">
                <div className="text-xs print:text-[10.5px] font-bold text-amber-800">
                  {t('కుటుంబం, ప్రేమ & వైవాహిక జీవనం', 'Family, Marriage & Relationships')}
                </div>
                <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                  {t('ప్రేమ, వివాహం, గృహ సౌఖ్యం & కుటుంబ సంబంధాలు', 'Love, Marriage, Domestic Bliss & Relationships')}
                </h6>
                <p className="text-sm sm:text-base print:text-[11px] text-slate-800 leading-relaxed pb-1.5">
                  {t(predictions.sunMoon144.relationshipsTe, predictions.sunMoon144.relationshipsEn)}{' '}
                  {t(predictions.lagnaProfile.manoSwabhavamTe, predictions.lagnaProfile.manoSwabhavamEn)}
                </p>
                <div className="pt-2 border-t border-amber-100 mt-1 pb-1">
                  <span className="text-xs print:text-[10.5px] font-bold text-amber-900 block">
                    {t('జీవన మార్గదర్శక ప్రతీక (Guiding Symbol):', 'Guiding Symbolic Archetype:')}
                  </span>
                  <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-700 italic mt-1 leading-relaxed">
                    {t(predictions.sunMoon144.imageForIntegrationTe, predictions.sunMoon144.imageForIntegrationEn)}
                  </p>
                </div>
              </div>

              {/* Child 3: Strengths & Spiritual Path */}
              <div className="bg-emerald-50/70 rounded-2xl p-5 sm:p-6 print:p-4 border border-emerald-200 border-l-4 border-l-emerald-700 space-y-2.5 print:space-y-2 print-card">
                <div className="text-xs print:text-[10.5px] font-bold text-emerald-800">
                  {t('సహజ బలాలు & ఆధ్యాత్మిక ఉపాసన', 'Greatest Strengths & Spiritual Path')}
                </div>
                <h6 className="text-base sm:text-lg print:text-xs font-bold text-emerald-950">
                  ✓ {t('మీ జాతక ప్రధాన బలాలు & దైవ అనుగ్రహం', 'Your Greatest Strengths & Divine Grace')}
                </h6>
                <p className="text-sm sm:text-base print:text-[11px] text-emerald-950 leading-relaxed pb-1">
                  {t(predictions.sunMoon144.strengthsTe, predictions.sunMoon144.strengthsEn)}.{' '}
                  {t(predictions.sunMoon144.spiritualPathTe, predictions.sunMoon144.spiritualPathEn)}
                </p>
              </div>

              {/* Child 4: Cautions & Life Mission */}
              <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 print:p-4 border border-amber-200 border-l-4 border-l-[#b45309] space-y-2.5 print:space-y-2 print-card">
                <div className="text-xs print:text-[10.5px] font-bold text-amber-800">
                  {t('తీసుకోవలసిన జాగ్రత్తలు & జీవన లక్ష్యం', 'Mindful Precautions & Life Mission')}
                </div>
                <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                  ! {t('తీసుకోవలసిన జాగ్రత్తలు & ఉన్నత జీవన మార్గం', 'Mindful Precautions & Higher Path')}
                </h6>
                <p className="text-sm sm:text-base print:text-[11px] text-slate-800 leading-relaxed pb-1">
                  {t(predictions.sunMoon144.weaknessesTe, predictions.sunMoon144.weaknessesEn)}{' '}
                  {t(predictions.lagnaProfile.lifeMissionTe, predictions.lagnaProfile.lifeMissionEn)}
                </p>
              </div>
            </div>

            {renderPrintPageFooter('అధ్యాయం 1 · జన్మ లగ్న & సూర్య-చంద్ర విశ్లేషణ', 3)}
          </div>

          {/* ====================================================================
              PAGE 4: CHAPTER 2 — 7TH HOUSE (SAPTAMA BHAVA) SPOUSE, MARRIAGE TIMING,
              LOVE VS ARRANGED YOGA & KUJA DOSHA % ANALYSIS (DEDICATED A4 PAGE)
              ==================================================================== */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs print-page-break page print-page-sheet space-y-4 print:space-y-3">
            {renderPrintPageHeader(4)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 flex flex-col md:flex-row print:flex-row md:items-center print:items-center justify-between gap-2.5 print-chapter-banner">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs print:text-[10.5px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full mb-1">
                  <Sparkles size={12} />
                  <span>
                    {t(
                      'అధ్యాయం 2 · సప్తమ భావ (7th House) వివాహ & జీవిత భాగస్వామి విశ్లేషణ',
                      'Chapter 2 · 7th House Future Spouse, Marriage Timing & Dosha Analysis'
                    )}
                  </span>
                </span>
                <h5 className="text-lg sm:text-xl print:text-sm font-extrabold text-amber-950">
                  {t(
                    'కాబోయే భర్త / భార్య లక్షణాలు, ప్రేమ/పెద్దల వివాహం, పెళ్లి సమయం & కుజ దోష శాతం (%)',
                    'Future Spouse Traits, Love vs Arranged Yoga, Marriage Timing & Kuja Dosha %'
                  )}
                </h5>
              </div>
              <div className="bg-white border border-amber-300 rounded-2xl px-3 py-1.5 text-xs print:text-[10.5px] font-bold text-amber-950 shrink-0">
                {t(
                  `7వ స్థానం: ${predictions.saptamaMarriage.saptamaRashiTe} · అధిపతి: ${predictions.saptamaMarriage.saptamaLordTe} (${predictions.saptamaMarriage.saptamaLordHouse}వ ఇంట)`,
                  `7th House: ${predictions.saptamaMarriage.saptamaRashiEn} · Lord: ${predictions.saptamaMarriage.saptamaLordEn} (in ${predictions.saptamaMarriage.saptamaLordHouse}H)`
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {/* 1. Future Spouse Appearance, Nature & Career */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] space-y-2 print:space-y-1.5 print-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs print:text-[11px] font-extrabold text-amber-900 tracking-wide">
                    {t('1. కాబోయే జీవిత భాగస్వామి రూపం, స్వభావం & వృత్తి', '1. Future Spouse Personality, Looks & Career')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm print:text-[11px] text-slate-800 leading-relaxed pb-1">
                  {t(
                    predictions.saptamaMarriage.spouseAppearanceAndNatureTe,
                    predictions.saptamaMarriage.spouseAppearanceAndNatureEn
                  )}
                </p>
                <p className="text-xs sm:text-sm print:text-[11px] text-emerald-900 font-semibold leading-relaxed pt-2 border-t border-amber-200/70 pb-1">
                  {t(
                    predictions.saptamaMarriage.spouseCareerAndFamilyTe,
                    predictions.saptamaMarriage.spouseCareerAndFamilyEn
                  )}
                </p>
              </div>

              {/* 2. Love vs Arranged Marriage & Marriage Timing Window */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] space-y-2 print:space-y-1.5 print-card">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-xs print:text-[11px] font-extrabold text-amber-900 tracking-wide">
                    {t('2. ప్రేమ / పెద్దల వివాహం & పెళ్లి ఎప్పుడు అవుతుంది?', '2. Love vs Arranged Yoga & Marriage Timing')}
                  </span>
                  <span className="text-[11px] print:text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {t(
                      predictions.saptamaMarriage.marriageTypeBadgeTe,
                      predictions.saptamaMarriage.marriageTypeBadgeEn
                    )}
                  </span>
                </div>
                <p className="text-xs sm:text-sm print:text-[11px] text-slate-800 leading-relaxed pb-1">
                  {t(
                    predictions.saptamaMarriage.marriageTypeAnalysisTe,
                    predictions.saptamaMarriage.marriageTypeAnalysisEn
                  )}
                </p>
                <div className="pt-2 border-t border-amber-200/70 space-y-1 pb-1">
                  <strong className="text-xs sm:text-sm print:text-[11px] text-amber-950 block">
                    ⏳ {t(predictions.saptamaMarriage.marriageTimingTitleTe, predictions.saptamaMarriage.marriageTimingTitleEn)}
                  </strong>
                  <p className="text-xs print:text-[10.5px] text-slate-700 leading-relaxed">
                    {t(
                      predictions.saptamaMarriage.marriageTimingDetailsTe,
                      predictions.saptamaMarriage.marriageTimingDetailsEn
                    )}
                  </p>
                  <p className="text-xs print:text-[10.5px] font-bold text-emerald-800 pt-0.5">
                    ✦ {t('అనుకూల వివాహ వయస్సు / కాలం: ', 'Favorable Age / Period: ')}
                    {t(predictions.saptamaMarriage.favorableAgesTe, predictions.saptamaMarriage.favorableAgesEn)}
                  </p>
                </div>
              </div>

              {/* 3. Kuja Dosha % & Kalasarpa Check */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] space-y-2 print:space-y-1.5 print-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs print:text-[11px] font-extrabold text-amber-900 tracking-wide">
                    {t('3. కుజ దోష శాతం (%) & కాలసర్ప యోగ తనిఖీ', '3. Exact Kuja Dosha % & Kalasarpa Check')}
                  </span>
                  <span className="text-xs print:text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-950">
                    {predictions.tripleKuja.netDoshaPercentage}%
                  </span>
                </div>
                <strong className="text-sm print:text-[11px] text-amber-950 block">
                  {t(predictions.saptamaMarriage.kujaDoshaTitleTe, predictions.saptamaMarriage.kujaDoshaTitleEn)}
                </strong>
                <p className="text-xs print:text-[10.5px] text-slate-700 leading-relaxed pb-1">
                  {t(
                    predictions.saptamaMarriage.kujaDoshaExplanationTe,
                    predictions.saptamaMarriage.kujaDoshaExplanationEn
                  )}
                </p>
                <div className="pt-2 border-t border-amber-200/70 text-xs print:text-[10.5px] text-emerald-900 leading-relaxed pb-1">
                  <strong>{t(predictions.saptamaMarriage.kalasarpaStatusTe, predictions.saptamaMarriage.kalasarpaStatusEn)}:</strong>{' '}
                  {t(predictions.saptamaMarriage.kalasarpaDetailTe, predictions.saptamaMarriage.kalasarpaDetailEn)}
                </div>
              </div>

              {/* 4. Saptama Graha Shanti & Japa Schedule */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] flex flex-col justify-between space-y-2.5 print:space-y-2 print-card">
                <div className="space-y-1.5">
                  <span className="text-xs print:text-[11px] font-extrabold text-amber-900 tracking-wide block">
                    {t('4. శీఘ్ర వివాహం & దాంపత్య సౌఖ్య జప నియమం', '4. Vedic Marriage Shanti & Japa Schedule')}
                  </span>
                  <strong className="text-sm print:text-[11px] text-amber-950 block">
                    🙏 {t(predictions.saptamaMarriage.remedyMetalAndDayTe, predictions.saptamaMarriage.remedyMetalAndDayEn)}
                  </strong>
                  <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-800 leading-relaxed pb-1">
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
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 print:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs print:text-[10.5px] transition-colors underline"
                >
                  <MessageCircle size={13} />
                  <span>
                    {t(
                      'వివాహ సమయం & సప్తమ భావ పరిశీలనకు గురువుగారిని సంప్రదించండి (+91 89779 86166)',
                      'Consult Guruji on WhatsApp for Marriage Timing & Remedies (+91 89779 86166)'
                    )}
                  </span>
                </a>
              </div>
            </div>

            {renderPrintPageFooter('అధ్యాయం 2 · సప్తమ భావ వివాహ విశ్లేషణ', 4)}
          </div>
        </div>

        {/* ====================================================================
            PAGE 5: CHAPTER 3 — PANCHABHOOTA ELEMENTAL STRENGTH (7 PLANETS)
            ==================================================================== */}
        <div className={showFullGrantham || predictionTab === 'elements' ? 'block' : 'hidden print:block'}>
          <div id="grantham-section-elements" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 scroll-mt-24 print-page-break page print-page-sheet">
            {renderPrintPageHeader(5)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 3 · పంచభూత తత్వ సప్తగ్రహ బల & వక్ర గ్రహ రహస్య విశ్లేషణ', 'Chapter 3 · Elemental Planetary Strength & Retrograde Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'పంచభూత తత్వ గ్రహ బల పట్టిక (అగ్ని · భూ · వాయు · జల తత్వాలు & శాంతి ఉపాసన)',
                  'Elemental Planetary Strength Analysis (Fire · Earth · Air · Water & Vedic Upasana)'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  'ప్రతి గ్రహం తన ఉచ్చ రాశి తత్వంలో ఉన్నప్పుడు అత్యుత్తమ ఫలితాలను, నీచ రాశి తత్వంలో ఉన్నప్పుడు పరీక్షలను ఇస్తుంది. మీ జాతకంలోని సప్త గ్రహాల తత్వ బలం మరియు పరిహారాలు:',
                  'Each planet operates at peak power in the element of its exaltation sign. Below is the elemental strength and upasana for your 7 core planets:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3">
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
                    className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white hover:bg-amber-50/30 transition-colors space-y-2 print:space-y-1.5 print-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <strong className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                          {t(item.planetTe, item.planetEn)}
                        </strong>
                        <span className="text-xs print:text-[10.5px] font-semibold text-slate-600 ml-1.5">
                          — {t(item.rashiTe, item.rashiEn)} · {t(item.elementTe, item.elementEn)}
                        </span>
                      </div>
                      <span className={`text-xs print:text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${badgeStyles}`}>
                        {t(item.tierLabelTe, item.tierLabelEn)}
                      </span>
                    </div>

                    <div className="text-xs print:text-[10.5px] font-bold text-amber-800">
                      {t(`లగ్నం నుండి స్థానం: ${item.houseNameTe}`, `Placement: ${item.houseNameEn}`)}
                    </div>

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                      {t(item.analysisTe, item.analysisEn)}
                    </p>

                    <div className="pt-1.5 border-t border-amber-100 text-xs print:text-[10.5px] text-emerald-900 font-semibold leading-relaxed">
                      🙏 {t('ఆరాధన / పరిహారం: ', 'Vedic Upasana: ')}
                      <span className="font-normal text-slate-700">{t(item.remedyTe, item.remedyEn)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {renderPrintPageFooter('అధ్యాయం 3 · పంచభూత తత్వ గ్రహ బల పట్టిక', 5)}
          </div>
        </div>

        {/* ====================================================================
            PAGES 6 & 7: CHAPTER 4 — BHRIGU CHAKRA & NADI RAJA YOGAS
            (SPLIT CLEANLY INTO 2 DEDICATED A4 PAGES OF 4 SUTRAS EACH — ZERO CUTS!)
            ==================================================================== */}
        <div className={showFullGrantham || predictionTab === 'sutras' ? 'block space-y-6 print:space-y-0' : 'hidden print:block print:space-y-0'}>
          {/* PAGE 6: CHAPTER 4 (PART 1) — SUTRAS 1 TO 4 */}
          <div id="grantham-section-sutras" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 scroll-mt-24 print-page-break page print-page-sheet">
            {renderPrintPageHeader(6)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 4 (భాగం 1) · భృగు చక్ర పద్ధతి, విశేష జ్యోతిష్య నియమాలు & రాజయోగాలు (సూత్రాలు 1–4)', 'Chapter 4 (Part 1) · Bhrigu Chakra Paddhati, Special Sutras & Raja Yogas (Rules 1–4)')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'భృగు చక్ర పద్ధతి జన్మ మాస కేంద్ర స్థానం, గజకేసరి/బుధాదిత్య/అమల యోగాలు & విశేష ఫల సూత్రాలు',
                  'Bhrigu Chakra Paddhati Birth Month Focus House, Raja Yogas & Special Predictive Rules'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                {t(
                  'మీ జన్మ మాసం, శని ద్వితీయ స్థాన కర్మ నియమం, గజకేసరి యోగం మరియు అమల రాజయోగ సూత్రాల ఆధారంగా ప్రత్యేక ఫలితాలు:',
                  'Special predictive rules triggered by your birth month, Saturn’s 2nd-house rule, Gajakesari Yoga, and Amala Yoga:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.specialSutras.slice(0, 4).map((sutra, idx) => (
                <div
                  key={sutra.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2.5 print:space-y-2 flex flex-col justify-between print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px] text-slate-500">
                      <span className="font-mono font-bold text-amber-900">
                        {t(`సూత్రం #${idx + 1}`, `Rule #${idx + 1}`)}
                      </span>
                      <span className="font-bold text-emerald-800">
                        {t(sutra.badgeTe, sutra.badgeEn)}
                      </span>
                    </div>
                    <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                      {t(sutra.titleTe, sutra.titleEn)}
                    </h6>
                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                      {t(sutra.descriptionTe, sutra.descriptionEn)}
                    </p>
                  </div>
                  <div className="bg-amber-50/80 rounded-xl p-2.5 print:p-2 border border-amber-200/80 text-xs print:text-[10.5px] font-semibold text-amber-950 mt-1.5 leading-relaxed">
                    💡 {t(sutra.remedyOrAdviceTe, sutra.remedyOrAdviceEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 4 (భాగం 1) · భృగు చక్ర పద్ధతి & రాజయోగాలు (సూత్రాలు 1–4)', 6)}
          </div>

          {/* PAGE 7: CHAPTER 4 (PART 2) — SUTRAS 5 TO 8 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(7)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 4 (భాగం 2) · ధర్మ-కర్మాధిపతి, బుధాదిత్య & భాగ్య-లాభ రాజయోగ సూత్రాలు (సూత్రాలు 5–8)', 'Chapter 4 (Part 2) · Dharma-Karmadhipati, Budhaditya & Wealth Yogas (Rules 5–8)')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'బుధాదిత్య యోగం, భాగ్య-రాజ్య-లాభాధిపతుల సంయోగం & పితృ-పుత్ర కర్మ విశేష ఫల సూత్రాలు',
                  'Budhaditya Yoga, 9th-10th-11th House Lords Synthesis & Karmic Lineage Sutras'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  'మీ జాతకంలోని 5 నుండి 8వ విశేష జ్యోతిష్య సూత్రాలు, రాజయోగ ఫలితాలు మరియు ఆచరించవలసిన శాస్త్రోక్త సూచనలు:',
                  'Rules 5 to 8 covering Budhaditya intelligence yoga, career-fortune synthesis, and Dharmic remedies:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.specialSutras.slice(4, 8).map((sutra, idx) => (
                <div
                  key={sutra.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2.5 print:space-y-2 flex flex-col justify-between print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px] text-slate-500">
                      <span className="font-mono font-bold text-amber-900">
                        {t(`సూత్రం #${idx + 5}`, `Rule #${idx + 5}`)}
                      </span>
                      <span className="font-bold text-emerald-800">
                        {t(sutra.badgeTe, sutra.badgeEn)}
                      </span>
                    </div>
                    <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                      {t(sutra.titleTe, sutra.titleEn)}
                    </h6>
                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                      {t(sutra.descriptionTe, sutra.descriptionEn)}
                    </p>
                  </div>
                  <div className="bg-amber-50/80 rounded-xl p-2.5 print:p-2 border border-amber-200/80 text-xs print:text-[10.5px] font-semibold text-amber-950 mt-1.5 leading-relaxed">
                    💡 {t(sutra.remedyOrAdviceTe, sutra.remedyOrAdviceEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 4 (భాగం 2) · భృగు చక్ర పద్ధతి & రాజయోగాలు (సూత్రాలు 5–8)', 7)}
          </div>
        </div>

        {/* ====================================================================
            PAGE 8: CHAPTER 5 — LIFE EVENT PROBABILITY TIMELINE (% Windows)
            ==================================================================== */}
        <div className={showFullGrantham || predictionTab === 'timeline' ? 'block' : 'hidden print:block'}>
          <div id="grantham-section-timeline" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 scroll-mt-24 print-page-break page print-page-sheet">
            {renderPrintPageHeader(8)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-amber-700" />
                <span>{t('అధ్యాయం 5 · ఈవెంట్ సంభావ్యత & జీవిత కీలక ఘట్టాల కాల నిర్ణయం (% Probability Timeline)', 'Chapter 5 · Life Event Probability Windows & Milestone Timeline')}</span>
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'కెరీర్ ఉన్నతి, వివాహ యోగం, ఆస్తుల సమృద్ధి & విదేశీ ప్రయాణాల సంభావ్యతా శాతాల విశ్లేషణ',
                  'Predictive Probability Windows for Career, Marriage, Assets & Global Travel'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  'దశా-భుక్తి కాలాలు, గోచార గురు-శని సంచారాలు మరియు భావాధిపతుల బలాన్ని సమన్వయం చేసి మీ జీవితంలోని ప్రధాన ఘట్టాల గరిష్ట అనుకూల వయస్సులను (Peak Windows) గణించాం:',
                  'Synthesizing Vimshottari periods, transits, and house lord dignities into multi-factor predictive probability windows:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.eventTimelines.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-colors print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                        {t(ev.categoryTe, ev.categoryEn)}
                      </strong>
                      <span className="text-xs print:text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
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
                      <div className="flex justify-between text-[11px] print:text-[10.5px] font-semibold text-slate-500">
                        <span>{t('అనుకూల వయస్సు: ', 'Age Bracket: ')}<strong className="text-amber-950">{t(ev.peakAgeBracketTe, ev.peakAgeBracketEn)}</strong></span>
                        <span>{t('సంవత్సరాలు: ', 'Years: ')}<strong className="text-amber-900">{t(ev.calendarYearsTe, ev.calendarYearsEn)}</strong></span>
                      </div>
                    </div>

                    <p className="text-xs print:text-[11px] text-slate-700 leading-relaxed pb-1">
                      {t(ev.analysisTe, ev.analysisEn)}
                    </p>

                    <div className="text-[11px] print:text-[10.5px] text-amber-800 font-medium">
                      ✦ {t('కారక గ్రహాలు: ', 'Key Planetary Drivers: ')}
                      <span>{t(ev.primaryPlanetsTe, ev.primaryPlanetsEn)}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 rounded-xl p-2.5 print:p-2 border border-amber-200 text-xs print:text-[10.5px] font-semibold text-amber-950 mt-1.5 leading-relaxed">
                    🙏 {t('శర్మ గారి సలహా: ', 'Guruji’s Advice: ')}
                    <span className="font-normal text-slate-800">{t(ev.sharmaAdviceTe, ev.sharmaAdviceEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 5 · ఈవెంట్ సంభావ్యత టైమ్‌లైన్', 8)}
          </div>
        </div>

        {/* ====================================================================
            PAGE 9: CHAPTER 6 — SARVASHTAKAVARGA 12-BHAVA STRENGTH MATRIX
            ==================================================================== */}
        <div className={showFullGrantham || predictionTab === 'ashtakavarga' ? 'block' : 'hidden print:block'}>
          <div id="grantham-section-ashtakavarga" className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2 scroll-mt-24 print-page-break page print-page-sheet">
            {renderPrintPageHeader(9)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 space-y-1 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5 flex items-center gap-1.5">
                <BarChart3 size={13} className="text-amber-700" />
                <span>{t('అధ్యాయం 6 · సార్వభౌమ అష్టకవర్గ 12-భావ బలం & లాభ యోగం (Sarvashtakavarga 337 Bindus)', 'Chapter 6 · Sarvashtakavarga 12-House Bindu Strength Matrix')}</span>
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  '12 రాశుల అష్టకవర్గ బిందువుల పట్టిక, అత్యధిక/అల్ప స్థానాలు & అఖండ లాభ యోగ పరిశీలన',
                  '12-House Ashtakavarga Bindu Allocation, Peak Energy Zones & Income-Expenditure Axiom'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 leading-snug">
                {t(
                  'పరాశర హోరాశాస్త్రం ప్రకారం మొత్తం 337 శుభ బిందువులలో సగటున ఒక రాశికి 28 బిందువులు వస్తాయి. 30 కంటే ఎక్కువ బిందువులు ఉన్న స్థానాలు ప్రయత్నం లేకుండానే విజయాన్నిస్తాయి; 25 కంటే తక్కువ ఉన్న స్థానాలకు సాధన అవసరం.',
                  'In Parashara Sarvashtakavarga (337 total bindus), 28 is the benchmark average. Houses with 30+ bindus manifest effortless fortune, while houses below 25 require conscious discipline and remedies.'
                )}
              </p>
            </div>

            {/* Income vs Expenditure Golden Rule Callout (Decent Light Theme) */}
            <div className="p-3.5 print:p-2 rounded-2xl bg-amber-50/90 text-amber-950 border border-amber-300 border-l-4 border-l-[#b45309] flex items-start gap-2.5 print-card">
              <Award size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs sm:text-sm print:text-[10.5px]">
                <strong className="text-amber-950 block font-extrabold">
                  {t('శాస్త్రోక్త రాజ్య (10వ) vs లాభ (11వ) భావ అష్టకవర్గ సూత్రం:', 'Classical 10th (Effort) vs 11th (Gain) Bindu Axiom:')}
                </strong>
                <p className="text-slate-800 leading-snug">
                  {t(predictions.ashtakavarga.incomeVsExpenditureYogaTe, predictions.ashtakavarga.incomeVsExpenditureYogaEn)}
                </p>
              </div>
            </div>

            {/* 12-Bhava Grid (4 columns x 3 rows in print) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-3 print:gap-1.5">
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
                    className={`rounded-2xl p-3 print:p-1.5 border ${tierStyles} flex flex-col justify-between space-y-1 print-card`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] print:text-[9.5px] font-bold text-slate-500">
                          {t(`${h.houseNumber}వ స్థానం`, `House #${h.houseNumber}`)}
                        </span>
                        <span className="text-sm print:text-xs font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-950">
                          {h.bindus}
                        </span>
                      </div>
                      <strong className="text-xs sm:text-sm print:text-[10.5px] font-bold block mt-0.5 text-amber-950 leading-tight">
                        {t(h.bhavaNameTe, h.bhavaNameEn)}
                      </strong>
                      <span className="text-[10px] print:text-[9px] text-slate-600 block">
                        ({t(h.rashiTe, h.rashiEn)})
                      </span>
                      <p className="text-[11px] print:text-[9.5px] text-slate-700 mt-0.5 leading-tight">
                        {t(h.interpretationTe, h.interpretationEn)}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-amber-200/50 text-[10px] print:text-[9px] text-amber-900 font-medium leading-tight">
                      💡 {t(h.remedyTe, h.remedyEn)}
                    </div>
                  </div>
                );
              })}
            </div>

            {renderPrintPageFooter('అధ్యాయం 6 · సార్వభౌమ అష్టకవర్గ బల పట్టిక', 9)}
          </div>
        </div>

        {/* ====================================================================
            PAGES 10, 11, 12, 13, 14, 15, 16 (CHAPTERS 7, 8, 9, 10)
            12 HOUSES (3 PAGES OF 4), 9 PLANETS (2 PAGES), 96-YEAR BHRIGU CYCLES & REMEDIES
            ==================================================================== */}
        <div className={showFullGrantham || predictionTab === 'bhavas' ? 'block space-y-6 print:space-y-0 scroll-mt-24' : 'hidden print:block print:space-y-0'} id="grantham-section-bhavas">
          {/* PAGE 10: CHAPTER 7 (PART 1) — HOUSES 1 TO 4 COMPLETE ANALYSIS */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-2.5 print-page-break page print-page-sheet">
            {renderPrintPageHeader(10)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 7 (భాగం 1) · ద్వాదశ భావ విశ్లేషణ — 1 నుండి 4 స్థానాల సమగ్ర ఫలితాలు', 'Chapter 7 (Part 1) · Houses 1 to 4 Complete Life Domain Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  `మీ జన్మ లగ్నం (${chartData.lagna.te}) నుండి 1–4 స్థానాల అధిపతులు, గ్రహ స్థితి & సమగ్ర జీవిత ఫలితాలు`,
                  `Houses 1 to 4 from Your Ascendant (${chartData.lagna.en}) — Lords, Occupants & Predictions`
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                {t(
                  '1వ స్థానం (లగ్న/వ్యక్తిత్వం), 2వ స్థానం (ధన/కుటుంబం/వాక్కు), 3వ స్థానం (భాతృ/ధైర్యం) మరియు 4వ స్థానం (సుఖ/గృహ/వాహన/మాతృ) భావాల లోతైన పరిశీలన:',
                  'Detailed evaluation of Houses 1 to 4 covering personality, family wealth, courage, and property/domestic happiness:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.all12Houses.slice(0, 4).map((houseItem) => (
                <div
                  key={houseItem.houseNumber}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white hover:border-amber-400 transition-colors space-y-2 print:space-y-1.5 flex flex-col justify-between print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px] text-slate-500">
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
                      <div className="text-xs print:text-[10.5px] font-bold text-rose-900">
                        {t(
                          `ఈ స్థానంలోని గ్రహాలు: ${houseItem.occupantPlanetsTe.join(', ')}`,
                          `Planets in this House: ${houseItem.occupantPlanetsEn.join(', ')}`
                        )}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                      {t(houseItem.detailedPredictionTe, houseItem.detailedPredictionEn)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-100 text-xs print:text-[10.5px] text-amber-900 font-semibold leading-relaxed">
                    ✦ {t(houseItem.guidanceTe, houseItem.guidanceEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 7 (భాగం 1) · 1 నుండి 4 స్థానాల విశ్లేషణ', 10)}
          </div>

          {/* PAGE 11: CHAPTER 7 (PART 2) — HOUSES 5 TO 8 COMPLETE ANALYSIS */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(11)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 7 (భాగం 2) · ద్వాదశ భావ విశ్లేషణ — 5 నుండి 8 స్థానాల సమగ్ర ఫలితాలు', 'Chapter 7 (Part 2) · Houses 5 to 8 Complete Life Domain Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  `మీ జన్మ లగ్నం (${chartData.lagna.te}) నుండి 5–8 స్థానాల అధిపతులు, గ్రహ స్థితి & సమగ్ర జీవిత ఫలితాలు`,
                  `Houses 5 to 8 from Your Ascendant (${chartData.lagna.en}) — Lords, Occupants & Predictions`
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  '5వ స్థానం (పంచమ/విద్య/సంతానం), 6వ స్థానం (శత్రు/రుణ/ఆరోగ్యం), 7వ స్థానం (కళత్ర/వివాహం) మరియు 8వ స్థానం (ఆయుర్దాయ/ఆకస్మిక యోగ) భావాల లోతైన పరిశీలన:',
                  'Detailed evaluation of Houses 5 to 8 covering intelligence, children, health, marriage, and longevity:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.all12Houses.slice(4, 8).map((houseItem) => (
                <div
                  key={houseItem.houseNumber}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white hover:border-amber-400 transition-colors space-y-2 print:space-y-1.5 flex flex-col justify-between print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px] text-slate-500">
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
                      <div className="text-xs print:text-[10.5px] font-bold text-rose-900">
                        {t(
                          `ఈ స్థానంలోని గ్రహాలు: ${houseItem.occupantPlanetsTe.join(', ')}`,
                          `Planets in this House: ${houseItem.occupantPlanetsEn.join(', ')}`
                        )}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                      {t(houseItem.detailedPredictionTe, houseItem.detailedPredictionEn)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-100 text-xs print:text-[10.5px] text-amber-900 font-semibold leading-relaxed">
                    ✦ {t(houseItem.guidanceTe, houseItem.guidanceEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 7 (భాగం 2) · 5 నుండి 8 స్థానాల విశ్లేషణ', 11)}
          </div>

          {/* PAGE 12: CHAPTER 7 (PART 3) — HOUSES 9 TO 12 COMPLETE ANALYSIS */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(12)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 7 (భాగం 3) · ద్వాదశ భావ విశ్లేషణ — 9 నుండి 12 స్థానాల సమగ్ర ఫలితాలు', 'Chapter 7 (Part 3) · Houses 9 to 12 Complete Life Domain Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  `మీ జన్మ లగ్నం (${chartData.lagna.te}) నుండి 9–12 స్థానాల అధిపతులు, గ్రహ స్థితి & సమగ్ర జీవిత ఫలితాలు`,
                  `Houses 9 to 12 from Your Ascendant (${chartData.lagna.en}) — Lords, Occupants & Predictions`
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  '9వ స్థానం (భాగ్య/ధర్మం/తండ్రి), 10వ స్థానం (రాజ్య/ఉద్యోగ/కీర్తి), 11వ స్థానం (లాభ/ఆదాయ/అభీష్ట సిద్ధి) మరియు 12వ స్థానం (వ్యయ/విదేశీ/మోక్ష) భావాల లోతైన పరిశీలన:',
                  'Detailed evaluation of Houses 9 to 12 covering fortune, career peak, financial gains, foreign travel, and spiritual liberation:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.all12Houses.slice(8, 12).map((houseItem) => (
                <div
                  key={houseItem.houseNumber}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white hover:border-amber-400 transition-colors space-y-2 print:space-y-1.5 flex flex-col justify-between print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px] text-slate-500">
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
                      <div className="text-xs print:text-[10.5px] font-bold text-rose-900">
                        {t(
                          `ఈ స్థానంలోని గ్రహాలు: ${houseItem.occupantPlanetsTe.join(', ')}`,
                          `Planets in this House: ${houseItem.occupantPlanetsEn.join(', ')}`
                        )}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                      {t(houseItem.detailedPredictionTe, houseItem.detailedPredictionEn)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-100 text-xs print:text-[10.5px] text-amber-900 font-semibold leading-relaxed">
                    ✦ {t(houseItem.guidanceTe, houseItem.guidanceEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 7 (భాగం 3) · 9 నుండి 12 స్థానాల విశ్లేషణ', 12)}
          </div>

          {/* PAGE 13: CHAPTER 8 (PART 1) — PLANETS 1 TO 5 IN RASHI, NAKSHATRA PADA & NAVAMSHA */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(13)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 8 (భాగం 1) · నవగ్రహ స్థాన, నక్షత్ర పాద & నవాంశ (D9) విశేష ఫలితాలు (గ్రహాలు 1–5)', 'Chapter 8 (Part 1) · Planets 1 to 5 Natal, Nakshatra Pada & D9 Navamsha Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'సూర్య, చంద్ర, కుజ, బుధ & గురు గ్రహాల రాశి, నక్షత్ర పాద, నవాంశ స్థితి & దశా ఫలితాల విశ్లేషణ',
                  'In-Depth Analysis of Sun, Moon, Mars, Mercury & Jupiter in Rashi, Nakshatra Pada & Navamsha'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.bhavaPredictions.slice(0, 5).map((bp) => (
                <div
                  key={bp.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white hover:border-amber-400 transition-colors flex flex-col justify-between space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-base print:text-xs font-bold text-amber-950">
                        {t(bp.planetTe, bp.planetEn)}
                      </strong>
                      <span className="text-xs print:text-[10.5px] font-mono font-bold text-amber-900">
                        {t(bp.rashiTe, bp.rashiEn)} · {bp.degreeFormatted}
                      </span>
                    </div>

                    <div className="text-xs print:text-[10.5px] font-bold text-emerald-800">
                      {t(bp.bhavaNameTe, bp.bhavaNameEn)}
                    </div>

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-800 leading-relaxed pb-1">
                      {t(bp.predictionTe, bp.predictionEn)}
                    </p>

                    <p className="text-xs print:text-[10.5px] text-slate-600 leading-relaxed pt-1.5 border-t border-amber-100">
                      {t(bp.deepAnalysisTe, bp.deepAnalysisEn)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 8 (భాగం 1) · నవగ్రహ స్థాన & నవాంశ ఫలితాలు (1–5)', 13)}
          </div>

          {/* PAGE 14: CHAPTER 8 (PART 2) — PLANETS 6 TO 9 IN RASHI, NAKSHATRA PADA & NAVAMSHA */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(14)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 8 (భాగం 2) · నవగ్రహ స్థాన, నక్షత్ర పాద & నవాంశ (D9) విశేష ఫలితాలు (గ్రహాలు 6–9)', 'Chapter 8 (Part 2) · Planets 6 to 9 Natal, Nakshatra Pada & D9 Navamsha Analysis')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'శుక్ర, శని, రాహు & కేతు గ్రహాల రాశి, నక్షత్ర పాద, నవాంశ స్థితి & దశా ఫలితాల లోతైన విశ్లేషణ',
                  'In-Depth Analysis of Venus, Saturn, Rahu & Ketu in Rashi, Nakshatra Pada & Navamsha'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.bhavaPredictions.slice(5, 9).map((bp) => (
                <div
                  key={bp.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white hover:border-amber-400 transition-colors flex flex-col justify-between space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-base print:text-xs font-bold text-amber-950">
                        {t(bp.planetTe, bp.planetEn)}
                      </strong>
                      <span className="text-xs print:text-[10.5px] font-mono font-bold text-amber-900">
                        {t(bp.rashiTe, bp.rashiEn)} · {bp.degreeFormatted}
                      </span>
                    </div>

                    <div className="text-xs print:text-[10.5px] font-bold text-emerald-800">
                      {t(bp.bhavaNameTe, bp.bhavaNameEn)}
                    </div>

                    <p className="text-xs sm:text-sm print:text-[11px] text-slate-800 leading-relaxed pb-1">
                      {t(bp.predictionTe, bp.predictionEn)}
                    </p>

                    <p className="text-xs print:text-[10.5px] text-slate-600 leading-relaxed pt-1.5 border-t border-amber-100">
                      {t(bp.deepAnalysisTe, bp.deepAnalysisEn)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 8 (భాగం 2) · నవగ్రహ స్థాన & నవాంశ ఫలితాలు (6–9)', 14)}
          </div>

          {/* PAGE 15: CHAPTER 9 — 1 TO 96 YEARS LIFE PROGRESSION */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(15)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t('అధ్యాయం 9 · భృగు చక్ర పద్ధతి — ద్వాదశ వర్ష కాలచక్ర గమనం (1 నుండి 96 ఏళ్ల వయస్సు వరకు దశాబ్ద ఫలితాలు)', 'Chapter 9 · Bhrigu Chakra Paddhati — 12-Year Life Progression Cycles (Ages 1 to 96)')}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'భృగు చక్ర పద్ధతి ప్రకారం 1 నుండి 96 ఏళ్ల వయస్సు వరకు ప్రతి 12 ఏళ్ల కాలచక్రం & జీవిత కీలక మలుపు సంవత్సరాలు',
                  'Bhrigu Chakra Paddhati 12-Year Life Progression Cycles & Exact Milestone Years (Ages 1 to 96)'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3">
              {predictions.bhriguCycles.map((cycle) => (
                <div
                  key={cycle.cycleNumber}
                  className="rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-1.5 print:space-y-1 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
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

                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(cycle.predictionTe, cycle.predictionEn)}
                  </p>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 9 · 96 ఏళ్ల భృగు కాలచక్ర గమనం', 15)}
          </div>

          {/* PAGE 16: CHAPTER 10 — DECENT LIGHT REMEDIES SUITE + HIGHLIGHTED ASTROLOGER ENDORSEMENT */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-4 border-2 border-amber-300 shadow-2xs print-page-break page print-page-sheet space-y-4 print:space-y-3">
            {renderPrintPageHeader(16)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 print-chapter-banner">
              <div>
                <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5 flex items-center gap-1.5">
                  <Gem size={13} className="text-amber-700" />
                  <span>
                    {t(
                      'అధ్యాయం 10 · అదృష్ట రత్నం, రుద్రాక్ష, ఆరాధ్య దైవం & సంపూర్ణ వైదిక శాంతి పరిహారాలు',
                      'Chapter 10 · Lucky Gemstone, Rudraksha, Deity & Vedic Remedies'
                    )}
                  </span>
                </div>
                <h5 className="text-lg sm:text-xl print:text-sm font-extrabold text-amber-950">
                  {t(
                    `${name} గారికి శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయ శాస్త్రోక్త పరిహార సూచనలు`,
                    `Prescribed Vedic Remedies & Lucky Guidelines for ${name}`
                  )}
                </h5>
              </div>
              <span className="text-xs print:text-[10.5px] font-extrabold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                ✦ వ్యక్తిగత శాంతి పరిహార పత్రిక
              </span>
            </div>

            {/* Single-Side Full-Width Decent Light Remedies Stack */}
            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3">
              {/* Card 1: Lucky Gemstone */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] space-y-1.5 print-card">
                <span className="text-xs print:text-[11px] text-amber-900 font-extrabold block">
                  💎 {t('అదృష్ట రత్నం (Lucky Gemstone)', 'Lucky Gemstone (Ratnam)')}
                </span>
                <strong className="text-sm sm:text-base print:text-xs text-amber-950 block">
                  {t(predictions.remedies.luckyGemstoneTe, predictions.remedies.luckyGemstoneEn)}
                </strong>
                <p className="text-xs print:text-[11px] text-slate-700 leading-relaxed pb-1">
                  {t(predictions.remedies.wearingMethodTe, predictions.remedies.wearingMethodEn)}
                </p>
              </div>

              {/* Card 2: Rudraksha & Deity */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] space-y-1.5 print-card">
                <span className="text-xs print:text-[11px] text-amber-900 font-extrabold block">
                  📿 {t('అనుకూల రుద్రాక్ష & ఆరాధ్య దైవం', 'Auspicious Rudraksha & Deity')}
                </span>
                <strong className="text-sm sm:text-base print:text-xs text-amber-950 block">
                  {t(predictions.remedies.rudrakshaTe, predictions.remedies.rudrakshaEn)}
                </strong>
                <p className="text-xs print:text-[11px] text-slate-700 leading-relaxed pb-1">
                  {t(`ఆరాధ్య దైవం: ${predictions.remedies.aradhyaDeivamTe}`, `Guiding Deity: ${predictions.remedies.aradhyaDeivamEn}`)}
                </p>
              </div>

              {/* Card 3: Lucky Numbers, Days & Colors */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] space-y-1.5 print-card">
                <span className="text-xs print:text-[11px] text-amber-900 font-extrabold block">
                  🌟 {t('అదృష్ట సంఖ్యలు, వారాలు & రంగులు', 'Lucky Numbers, Days & Colors')}
                </span>
                <strong className="text-sm sm:text-base print:text-xs text-amber-950 block">
                  {t(`సంఖ్యలు: ${predictions.remedies.luckyNumbers} · వారాలు: ${predictions.remedies.luckyDaysTe}`, `Numbers: ${predictions.remedies.luckyNumbers} · Days: ${predictions.remedies.luckyDaysEn}`)}
                </strong>
                <p className="text-xs print:text-[11px] text-slate-700 leading-relaxed pb-1">
                  {t(`అనుకూల రంగులు: ${predictions.remedies.luckyColorsTe}`, `Lucky Colors: ${predictions.remedies.luckyColorsEn}`)}
                </p>
              </div>

              {/* Card 4: Daily Stotras & Charitable Remedies */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] space-y-1.5 print-card">
                <span className="text-xs print:text-[11px] text-amber-900 font-extrabold block">
                  📖 {t('నిత్య పారాయణ స్తోత్రాలు & దాన పరిహారాలు', 'Daily Parayana Stotras & Charitable Remedies')}
                </span>
                <strong className="text-sm sm:text-base print:text-xs text-amber-950 block">
                  {t(predictions.remedies.nityaStotraTe, predictions.remedies.nityaStotraEn)}
                </strong>
                <p className="text-xs print:text-[11px] text-slate-700 leading-relaxed pb-1">
                  {t(`దాన ధర్మాలు: ${predictions.remedies.danaPariharamTe}`, `Charitable Remedies: ${predictions.remedies.danaPariharamEn}`)}
                </p>
              </div>

              {/* ★ Card 5: HIGHLIGHTED ASTROLOGER PROFILE & TEMPLE ENDORSEMENT BANNER ★ */}
              <div className="bg-gradient-to-r from-[#3b1205] via-[#5a1f08] to-[#3b1205] rounded-2xl p-4 sm:p-5 print:p-3.5 border-2 border-[#f59e0b] ring-2 ring-amber-300/60 shadow-md flex flex-col sm:flex-row print:flex-row items-center justify-between gap-3 print-card overflow-hidden">
                <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                  <a
                    href="https://www.telugujyothisham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 print:w-12 print:h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-md ring-2 ring-amber-300 block"
                  >
                    <img
                      src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                      alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                      width={56}
                      height={56}
                      className="w-full h-full rounded-full object-cover object-top"
                    />
                  </a>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-xs print:text-[10.5px] font-extrabold text-amber-300 tracking-wide block">
                      🕉️ {t('శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · హైదరాబాద్', 'Sri Lakshmi Ganapathi Jyothishalayam · Hyderabad')}
                    </span>
                    <strong className="text-sm sm:text-base print:text-xs font-extrabold text-[#fde047] block">
                      {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Brahmasri Jallavaram Sai Dheeraj Sharma')}
                    </strong>
                    <p className="text-xs print:text-[10px] text-amber-100 font-semibold">
                      {t('స్మార్త వైదిక & దృక్సిద్ధాంత జ్యోతిష్య నిపుణులు · తెలుగు జ్యోతిషం (Telugu Jyothisham)', 'Smarta Vaidika & Drik Siddhanta Vedic Astrology Scholar')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col print:flex-col items-stretch sm:items-end print:items-end gap-1.5 shrink-0 w-full sm:w-auto print:w-auto">
                  <a
                    href="https://www.telugujyothisham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    translate="no"
                    className="notranslate inline-flex items-center justify-center gap-1.5 px-3 py-1.5 print:px-2.5 print:py-1 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-[#2b0902] font-mono font-extrabold text-xs print:text-[10px] border border-amber-200 shadow-sm underline"
                  >
                    <span>🌐 www.telugujyothisham.com</span>
                  </a>
                  <a
                    href={whatsappConsultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 print:px-2.5 print:py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs print:text-[10px] border border-emerald-300 shadow-sm underline"
                  >
                    <span>💬 వాట్సాప్: +91 89779 86166</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Gemstone Safety Advisory (Decent Light Rose Card) */}
            <div className="bg-rose-50/80 border border-rose-300 border-l-4 border-l-rose-600 rounded-2xl p-3.5 print:p-3 text-xs sm:text-sm print:text-[10.5px] text-rose-950 leading-relaxed print-card">
              <strong className="text-rose-900 block mb-0.5 font-extrabold">
                ⚠️ ముఖ్య గమనిక — రత్న ధారణ జాగ్రత్త (Gemstone Safety Advisory):
              </strong>
              <span className="text-slate-800">
                జాతకంలో నీచ స్థితిలో ఉన్న గ్రహానికి లేదా సూర్యునితో కలిసి అస్తంగత్వం (Combust) చెందిన గ్రహానికి సంబంధించిన రత్నాన్ని నేరుగా ధరించరాదు. ఏ రత్నాన్నైనా ధరించే ముందు ఖచ్చితంగా సిద్ధాంతుల వారిని సంప్రదించి (Wear only after consulting the Pandit), వ్యక్తిగత దశా భుక్తులను పరిశీలించిన తర్వాతే ధరించాలి.
              </span>
            </div>

            {renderPrintPageFooter('అధ్యాయం 10 · అదృష్ట రత్నం, రుద్రాక్ష & శాంతి పరిహారాలు', 16)}
          </div>
        </div>

        {/* ====================================================================
            PAGES 17 TO 29: CHAPTERS 11 TO 18 — MAHARSHI BHRIGU & PARASHARA
            NAADI ASTROLOGY TRANSIT SUTRAS & EXACT MANIFESTATION YEARS (13 PAGES)
            ==================================================================== */}
        <div
          id="grantham-section-naadi"
          className={
            showFullGrantham || predictionTab === 'naadi'
              ? 'block space-y-6 print:space-y-0 scroll-mt-24'
              : 'hidden print:block print:space-y-0'
          }
        >
          {/* PAGE 17: CHAPTER 11 — NAADI TRANSIT CORE RULES & EXACT MANIFESTATION YEARS */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(17)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 11 · భృగు & పరాశర మహర్షి ప్రణీత నాడీ గోచార మూల సూత్రాలు & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Chapter 11 · Maharshi Bhrigu & Parashara Naadi Transit Sutras & Exact Manifestation Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'భోక్తృ (గురు), కర్మ (శని), భోగ (బుధ/శుక్ర) గ్రహ బంధం, 1-5-9-7 కోణ నియమం, స్తంభన & జీవ బంధన — ఫలించే ఖచ్చితమైన సంవత్సరాలు',
                  'Naadi Planetary Grouping (Jupiter-Saturn-Mercury-Venus), 1-5-9 Trine Links & Exact Manifestation Years'
                )}
              </h5>
              <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  'మహర్షి ప్రణీత భృగు నంది నాడీ సంహిత మరియు పరాశర హోరా శాస్త్ర ప్రమాణాల ప్రకారం మీ జన్మ గ్రహాలపై గోచార గ్రహాల స్పర్శ ఏయే సంవత్సరాలలో ఖచ్చితంగా ఫలిస్తుందో తెలిపే మూల సూత్రాలు:',
                  'Classical axioms from Maharshi Bhrigu Nandi Naadi Samhita governing exact calendar years and ages when transiting planets activate your natal chart:'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter11Rules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-mono font-bold text-amber-900">
                      {t(rule.ruleNoTe, rule.ruleNoEn)}
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(rule.badgeTe, rule.badgeEn)}
                    </span>
                  </div>
                  <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                    {t(rule.titleTe, rule.titleEn)}
                  </h6>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-300 leading-relaxed">
                    📅 {t(rule.accurateYearsTe, rule.accurateYearsEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(rule.analysisTe, rule.analysisEn)}
                  </p>
                  <div className="bg-amber-50/80 rounded-xl p-2.5 print:p-2 border border-amber-200/80 text-xs print:text-[10.5px] font-semibold text-amber-950 leading-relaxed">
                    ✦ {t(rule.practicalKeyTe, rule.practicalKeyEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 11 · మహర్షి ప్రణీత నాడీ గోచార మూల సూత్రాలు & ఫలించే సంవత్సరాలు', 17)}
          </div>

          {/* PAGE 18: CHAPTER 12 (PART 1) — FAST-MOVING PLANETS TRANSIT (SUN, MOON, MARS) */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(18)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 12 (భాగం 1) · వేగవంతమైన గ్రహాల నాడీ గోచార ఫలితాలు — రవి, చంద్ర & కుజ గోచారం (ఖచ్చితమైన మాసాలు & తేదీలు)',
                  'Chapter 12 (Part 1) · Fast-Moving Planets Naadi Transit — Sun, Moon & Mars Exact Monthly & Yearly Windows'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ గ్రహాలపై గోచార రవి (1 నెల), చంద్ర (2¼ రోజులు) & కుజ (45 రోజులు) సంచార ఫలితాలు & ఖచ్చితంగా ఫలించే కాలం',
                  'Exact Yearly & Monthly Activation Windows of Transit Sun, Moon & Mars Over Your Natal Planets'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter12FastPart1.map((fp) => (
                <div
                  key={fp.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                      {t(fp.transitPlanetTe, fp.transitPlanetEn)}
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(fp.natalTargetTe, fp.natalTargetEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/90 px-3 py-1.5 rounded-lg border border-emerald-300 leading-relaxed">
                    📅 {t(fp.accurateTimingWindowTe, fp.accurateTimingWindowEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(fp.effectSummaryTe, fp.effectSummaryEn)}
                  </p>
                  <div className="pt-1.5 border-t border-amber-100 text-xs print:text-[10.5px] text-amber-950 font-semibold leading-relaxed">
                    ⏰ {t(fp.timingAndHoraAdviceTe, fp.timingAndHoraAdviceEn)}
                  </div>
                  <div className="text-xs print:text-[10.5px] text-emerald-900 font-semibold leading-relaxed">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(fp.remedyTe, fp.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 12 (భాగం 1) · రవి, చంద్ర & కుజ నాడీ గోచారం — ఖచ్చితమైన కాలం', 18)}
          </div>

          {/* PAGE 19: CHAPTER 12 (PART 2) — FAST-MOVING PLANETS TRANSIT (MERCURY, VENUS & HORA MATRIX) */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(19)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 12 (భాగం 2) · వేగవంతమైన గ్రహాల నాడీ గోచారం — బుధ, శుక్ర సంచారం & నిత్య హోరా విజయ పట్టిక',
                  'Chapter 12 (Part 2) · Fast-Moving Planets — Transit Mercury, Venus & Daily Hora Execution Guide'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'బుద్ధి భోగ (బుధ) & ఆనంద భోగ (శుక్ర) గోచార ఫలితాలు, ఖచ్చితంగా ఫలించే సంవత్సరాలు & హోరా ముహూర్తాలు',
                  'Transit Mercury & Venus Results on Your Natal Planets + Exact Manifestation Years & Hora Matrix'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter12FastPart2.map((fp) => (
                <div
                  key={fp.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                      {t(fp.transitPlanetTe, fp.transitPlanetEn)}
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(fp.natalTargetTe, fp.natalTargetEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/90 px-3 py-1.5 rounded-lg border border-emerald-300 leading-relaxed">
                    📅 {t(fp.accurateTimingWindowTe, fp.accurateTimingWindowEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(fp.effectSummaryTe, fp.effectSummaryEn)}
                  </p>
                  <div className="pt-1.5 border-t border-amber-100 text-xs print:text-[10.5px] text-amber-950 font-semibold leading-relaxed">
                    ⏰ {t(fp.timingAndHoraAdviceTe, fp.timingAndHoraAdviceEn)}
                  </div>
                  <div className="text-xs print:text-[10.5px] text-emerald-900 font-semibold leading-relaxed">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(fp.remedyTe, fp.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 12 (భాగం 2) · బుధ, శుక్ర గోచారం & హోరా రహస్యాలు', 19)}
          </div>

          {/* PAGE 20: CHAPTER 13 (PART 1) — JUPITER (JEEVA KARAKA) TRANSIT ON NATAL PLANETS 1 TO 5 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(20)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 13 (భాగం 1) · గురు గ్రహ (Jupiter - జీవ కారక) నాడీ గోచార సమగ్ర ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 1–5)',
                  'Chapter 13 (Part 1) · Transit Jupiter (Jeeva Karaka) on Your Natal Planets 1 to 5 with Exact Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ రవి, చంద్ర, కుజ, బుధ & గురు గ్రహాలపై గోచార గురు సంచార రాజయోగాలు & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Transit Jupiter Over Your Natal Sun, Moon, Mars, Mercury & Jupiter — Yogas & Exact Manifestation Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3">
              {predictions.naadiTransitReport.chapter13Jupiter.slice(0, 5).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-1.5 print:space-y-1 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ♃ గురు గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      👑 {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-700 leading-relaxed">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10px] text-slate-600 leading-relaxed pt-1 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-rose-900">{t('జాగ్రత్త: ', 'Note: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 13 (భాగం 1) · గురు గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (1–5)', 20)}
          </div>

          {/* PAGE 21: CHAPTER 13 (PART 2) — JUPITER (JEEVA KARAKA) TRANSIT ON NATAL PLANETS 6 TO 9 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(21)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 13 (భాగం 2) · గురు గ్రహ (Jupiter - జీవ కారక) నాడీ గోచార సమగ్ర ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 6–9)',
                  'Chapter 13 (Part 2) · Transit Jupiter (Jeeva Karaka) on Your Natal Planets 6 to 9 with Exact Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ శుక్ర, శని, రాహు & కేతు గ్రహాలపై గోచార గురు సంచార రాజయోగాలు & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Transit Jupiter Over Your Natal Venus, Saturn, Rahu & Ketu — Wealth Yogas & Exact Manifestation Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter13Jupiter.slice(5, 9).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ♃ గురు గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      👑 {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10.5px] text-slate-600 leading-relaxed pt-1.5 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-rose-900">{t('జాగ్రత్త: ', 'Note: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10.5px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 13 (భాగం 2) · గురు గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (6–9)', 21)}
          </div>

          {/* PAGE 22: CHAPTER 14 (PART 1) — SATURN (KARMA KARAKA) TRANSIT ON NATAL PLANETS 1 TO 5 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(22)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 14 (భాగం 1) · శని గ్రహ (Saturn - కర్మ కారక) నాడీ గోచార సమగ్ర ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 1–5)',
                  'Chapter 14 (Part 1) · Transit Saturn (Karma Karaka) on Your Natal Planets 1 to 5 with Exact Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ రవి, చంద్ర, కుజ, బుధ & గురు గ్రహాలపై గోచార శని సంచారం — కర్మ పరిపక్వత & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Transit Saturn Over Your Natal Sun, Moon, Mars, Mercury & Jupiter — Career & Exact Manifestation Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3">
              {predictions.naadiTransitReport.chapter14Saturn.slice(0, 5).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-1.5 print:space-y-1 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ♄ శని గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      ⚖️ {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-700 leading-relaxed">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10px] text-slate-600 leading-relaxed pt-1 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-emerald-900">{t('సూచన: ', 'Key: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 14 (భాగం 1) · శని గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (1–5)', 22)}
          </div>

          {/* PAGE 23: CHAPTER 14 (PART 2) — SATURN (KARMA KARAKA) TRANSIT ON NATAL PLANETS 6 TO 9 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(23)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 14 (భాగం 2) · శని గ్రహ (Saturn - కర్మ కారక) నాడీ గోచార సమగ్ర ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 6–9)',
                  'Chapter 14 (Part 2) · Transit Saturn (Karma Karaka) on Your Natal Planets 6 to 9 with Exact Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ శుక్ర, శని, రాహు & కేతు గ్రహాలపై గోచార శని సంచారం — శని-శుక్ర మహాలక్ష్మీ యోగం & ఫలించే సంవత్సరాలు',
                  'Transit Saturn Over Your Natal Venus, Saturn, Rahu & Ketu — Karma-Bhoga Wealth & Exact Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter14Saturn.slice(5, 9).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ♄ శని గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      ⚖️ {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10.5px] text-slate-600 leading-relaxed pt-1.5 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-emerald-900">{t('సూచన: ', 'Key: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10.5px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 14 (భాగం 2) · శని గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (6–9)', 23)}
          </div>

          {/* PAGE 24: CHAPTER 15 (PART 1) — RAHU TRANSIT ON NATAL PLANETS 1 TO 5 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(24)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 15 (భాగం 1) · రాహు గ్రహ (Rahu - కాలపురుష/విదేశీ కారక) నాడీ గోచార ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 1–5)',
                  'Chapter 15 (Part 1) · Transit Rahu on Your Natal Planets 1 to 5 with Exact Manifestation Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ రవి, చంద్ర, కుజ, బుధ & గురు గ్రహాలపై గోచార రాహు సంచారం — విదేశీ యోగం & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Transit Rahu Over Your Natal Sun, Moon, Mars, Mercury & Jupiter — Overseas Growth & Exact Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3">
              {predictions.naadiTransitReport.chapter15Rahu.slice(0, 5).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-1.5 print:space-y-1 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ☊ రాహు గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      🌐 {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-700 leading-relaxed">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10px] text-slate-600 leading-relaxed pt-1 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-rose-900">{t('రక్షణ సూత్రం: ', 'Shield: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 15 (భాగం 1) · రాహు గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (1–5)', 24)}
          </div>

          {/* PAGE 25: CHAPTER 15 (PART 2) — RAHU TRANSIT ON NATAL PLANETS 6 TO 9 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(25)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 15 (భాగం 2) · రాహు గ్రహ నాడీ గోచార సమగ్ర ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 6–9)',
                  'Chapter 15 (Part 2) · Transit Rahu on Your Natal Planets 6 to 9 with Exact Manifestation Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ శుక్ర, శని, రాహు & కేతు గ్రహాలపై గోచార రాహు సంచారం — ఆకస్మిక ధన యోగం & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Transit Rahu Over Your Natal Venus, Saturn, Rahu & Ketu — Amplified Wealth & Exact Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter15Rahu.slice(5, 9).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ☊ రాహు గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      🌐 {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10.5px] text-slate-600 leading-relaxed pt-1.5 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-rose-900">{t('రక్షణ సూత్రం: ', 'Shield: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10.5px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 15 (భాగం 2) · రాహు గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (6–9)', 25)}
          </div>

          {/* PAGE 26: CHAPTER 16 (PART 1) — KETU TRANSIT ON NATAL PLANETS 1 TO 5 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(26)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 16 (భాగం 1) · కేతు గ్రహ (Ketu - మోక్ష/ధ్వజ కారక) నాడీ గోచార ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 1–5)',
                  'Chapter 16 (Part 1) · Transit Ketu (Moksha & Dhwaja Karaka) on Your Natal Planets 1 to 5 with Exact Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ రవి, చంద్ర, కుజ, బుధ & గురు గ్రహాలపై గోచార కేతు సంచారం — ధ్వజ కీర్తి & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Transit Ketu Over Your Natal Sun, Moon, Mars, Mercury & Jupiter — Flag of Honor & Exact Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3">
              {predictions.naadiTransitReport.chapter16Ketu.slice(0, 5).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-1.5 print:space-y-1 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ☋ కేతు గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      🚩 {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[10.5px] text-slate-700 leading-relaxed">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10px] text-slate-600 leading-relaxed pt-1 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-emerald-900">{t('సూచన: ', 'Key: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 16 (భాగం 1) · కేతు గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (1–5)', 26)}
          </div>

          {/* PAGE 27: CHAPTER 16 (PART 2) — KETU TRANSIT ON NATAL PLANETS 6 TO 9 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(27)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 16 (భాగం 2) · కేతు గ్రహ నాడీ గోచార సమగ్ర ఫలితాలు & ఫలించే సంవత్సరాలు (జన్మ గ్రహాలు 6–9)',
                  'Chapter 16 (Part 2) · Transit Ketu on Your Natal Planets 6 to 9 with Exact Manifestation Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జన్మ శుక్ర, శని, రాహు & కేతు గ్రహాలపై గోచార కేతు సంచారం — దైవిక లక్ష్మీ కటాక్షం & ఖచ్చితంగా ఫలించే సంవత్సరాలు',
                  'Transit Ketu Over Your Natal Venus, Saturn, Rahu & Ketu — Sacred Prosperity & Exact Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter16Ketu.slice(5, 9).map((card) => (
                <div
                  key={card.planetId}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm sm:text-base print:text-xs font-bold text-amber-950">
                      ☋ కేతు గోచారం → {t(card.natalPlanetTe, card.natalPlanetEn)} ({t(card.natalRashiTe, card.natalRashiEn)} · {card.natalDegree})
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(`కోణ రాశులు: ${card.trineRashisTe}`, `Trines: ${card.trineRashisEn}`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      🚩 {t(card.yogaTitleTe, card.yogaTitleEn)}
                    </span>
                    <span className="font-bold text-[#78350f] bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                      📅 {t(card.accurateYearsBadgeTe, card.accurateYearsBadgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 leading-relaxed">
                    🎯 {t(card.accurateYearsDetailTe, card.accurateYearsDetailEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(card.primaryTransitTe, card.primaryTransitEn)}
                  </p>
                  <div className="text-xs print:text-[10.5px] text-slate-600 leading-relaxed pt-1.5 border-t border-amber-100">
                    <strong className="text-amber-950">{t('జీవన ఫలితాలు: ', 'Life Matters: ')}</strong>
                    {t(card.lifeMattersTe, card.lifeMattersEn)} ·{' '}
                    <strong className="text-emerald-900">{t('సూచన: ', 'Key: ')}</strong>
                    {t(card.destinyBreakersTe, card.destinyBreakersEn)}
                  </div>
                  <div className="text-xs print:text-[10.5px] text-emerald-900 font-semibold">
                    🙏 {t('పరిహారం: ', 'Remedy: ')}
                    <span className="font-normal text-slate-700">{t(card.remedyTe, card.remedyEn)}</span>
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 16 (భాగం 2) · కేతు గ్రహ నాడీ గోచార ఫలితాలు & సంవత్సరాలు (6–9)', 27)}
          </div>

          {/* PAGE 28: CHAPTER 17 — NAADI VASTU, FOOD LIKING, DREAM VISUALS & AYURVEDA */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(28)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 17 · నాడీ గృహ వాస్తు దిశలు, ఆహార అభిరుచులు, స్వప్న శకునాలు & ఆయుర్వేద త్రిదోష విశ్లేషణ (ఫలించే సంవత్సరాలతో)',
                  'Chapter 17 · Naadi Vastu Directions, Food Affinities, Dream Visuals & Ayurvedic Tridosha Matrix with Exact Years'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'మీ జాతక గ్రహ స్థితి ప్రకారం గృహ వాస్తు దిశలు, ఆహార నియమాలు, కలల సంకేతాలు & ఆరోగ్య రక్షణ — కీలక ఫలిత సంవత్సరాలు',
                  'Personalized Home Vastu Zones, Planetary Diet, Dream Omen Decoding & Exact Manifestation Years'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter17Diagnostics.map((diag) => (
                <div
                  key={diag.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs print:text-[10.5px]">
                    <span className="font-extrabold text-amber-900">
                      {t(diag.categoryTe, diag.categoryEn)}
                    </span>
                    <span className="font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(diag.badgeTe, diag.badgeEn)}
                    </span>
                  </div>
                  <h6 className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                    {t(diag.titleTe, diag.titleEn)}
                  </h6>
                  <div className="text-xs print:text-[10.5px] font-bold text-emerald-950 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-300 leading-relaxed">
                    📅 {t(diag.accurateYearsTe, diag.accurateYearsEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(diag.detailsTe, diag.detailsEn)}
                  </p>
                  <div className="bg-amber-50/80 rounded-xl p-2.5 print:p-2 border border-amber-200/80 text-xs print:text-[10.5px] font-semibold text-amber-950 leading-relaxed">
                    💡 {t(diag.remedyOrActionTe, diag.remedyOrActionEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 17 · నాడీ వాస్తు, ఆహార, స్వప్న శకున & ఆయుర్వేద విశ్లేషణ', 28)}
          </div>

          {/* PAGE 29: CHAPTER 18 — NAADI GEMSTONE CLARIFICATION, SANKALPA PURPOSE & COW-FEEDING SCHEDULE */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
            {renderPrintPageHeader(29)}

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 print:p-3 border border-amber-200 print-chapter-banner">
              <div className="text-xs print:text-[10.5px] font-bold text-amber-800 mb-0.5">
                {t(
                  'అధ్యాయం 18 · నాడీ జ్యోతిష్య రత్న ధారణ రహస్యాలు, తెలుగు సంకల్ప విధానం & కామధేను గోగ్రాస దాన పట్టిక',
                  'Chapter 18 · Naadi Gemstone Secrets, Telugu Sankalpa Procedure, Venus Diamond Calibration & Cow-Feeding Protocol'
                )}
              </div>
              <h5 className="text-lg sm:text-xl print:text-sm font-bold text-amber-950">
                {t(
                  'కారకత్వ వృద్ధి vs దోష నివారణ రత్న సంకల్ప విధానం, శుక్ర డిగ్రీ వజ్ర ప్రమాణం & నవగ్రహ గోగ్రాస ధాన్య సమర్పణ (ఫలించే సంవత్సరాలతో)',
                  'Transparent vs Destiny Breaker Gems, Telugu Sankalpa Procedure, Diamond Calibration & Go-Grasa Schedule'
                )}
              </h5>
            </div>

            <div className="grid grid-cols-1 single-side-stack gap-4 print:gap-3.5">
              {predictions.naadiTransitReport.chapter18GemsAndCowRemedies.map((gem) => (
                <div
                  key={gem.id}
                  className="rounded-2xl p-4 sm:p-5 print:p-3.5 border border-amber-200 border-l-4 border-l-[#b45309] bg-white space-y-2 print:space-y-1.5 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-base sm:text-lg print:text-xs font-bold text-amber-950">
                      {t(gem.titleTe, gem.titleEn)}
                    </strong>
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {t(gem.badgeTe, gem.badgeEn)}
                    </span>
                  </div>
                  <div className="text-xs print:text-[10.5px] font-bold text-[#78350f] bg-amber-50/90 px-3 py-1.5 rounded-xl border border-amber-300 leading-relaxed">
                    🎯 {t(gem.sankalpaPurposeTe, gem.sankalpaPurposeEn)}
                  </div>
                  <p className="text-xs sm:text-sm print:text-[11px] text-slate-700 leading-relaxed pb-1">
                    {t(gem.explanationTe, gem.explanationEn)}
                  </p>
                  <div className="pt-1.5 border-t border-amber-100 text-xs print:text-[10.5px] text-emerald-950 font-semibold leading-relaxed">
                    ✦ {t(gem.procedureTe, gem.procedureEn)}
                  </div>
                </div>
              ))}
            </div>

            {renderPrintPageFooter('అధ్యాయం 18 · నాడీ రత్న సంకల్ప విధానం & గోగ్రాస పరిహారాలు', 29)}
          </div>
        </div>

        {/* ====================================================================
            CHANDRA RASHI COMPLETE VEDIC LIFE ENCYCLOPEDIA:
            SPOUSE PSYCHOLOGY, CHILD/EDUCATION, CAREER/PARTNERSHIP, HEALTH & LUNAR/SHANI RESILIENCE
            ==================================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
          {renderPrintPageHeader(30)}

          <div className="print-chapter-banner">
            <h4 className="text-base sm:text-lg print:text-sm font-extrabold text-amber-950 flex items-center gap-2">
              <BookOpen size={16} className="text-amber-700" />
              <span>
                {t(
                  `జన్మ రాశి (${predictions.chandraRashiEncyclopedia.rashiNameTe}) సంపూర్ణ జీవన విజ్ఞాన విశ్లేషణ — దాంపత్యం, విద్య, వృత్తి, ఆరోగ్యం & మనోబలం`,
                  `Birth Moon Sign (${predictions.chandraRashiEncyclopedia.rashiNameEn}) Complete Life Profile — Marriage, Education, Career, Health & Resilience`
                )}
              </span>
            </h4>
            <p className="text-xs print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
              {t(
                `రాశ్యాధిపతి: ${predictions.chandraRashiEncyclopedia.rashiLordTe} · తత్వం: ${predictions.chandraRashiEncyclopedia.tatvamTe} · కాలపురుష అవయవ స్థానం: ${predictions.chandraRashiEncyclopedia.kalapurushaAngamTe}`,
                `Ruling Lord: ${predictions.chandraRashiEncyclopedia.rashiLordEn} · Element: ${predictions.chandraRashiEncyclopedia.tatvamEn} · Anatomical Domain: ${predictions.chandraRashiEncyclopedia.kalapurushaAngamEn}`
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 single-side-stack gap-3 print:gap-2.5">
            {/* 1. Wife & Husband Marital Psychology */}
            <div className="rounded-2xl p-3.5 sm:p-4 print:p-2.5 border border-amber-200 bg-amber-50/40 space-y-1.5 print-card">
              <strong className="text-sm sm:text-base print:text-xs font-extrabold text-amber-950 block">
                {t(
                  `1. ${predictions.chandraRashiEncyclopedia.rashiNameTe} దాంపత్య మనస్తత్వం (భార్య & భర్త స్వభావం)`,
                  `1. ${predictions.chandraRashiEncyclopedia.rashiNameEn} Marital Psychology (Wife & Husband Nature)`
                )}
              </strong>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>{t('ఇల్లాలు / భార్యగా స్వభావం:', 'As a Wife:')}</strong>{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.wifeProfileTe,
                  predictions.chandraRashiEncyclopedia.wifeProfileEn
                )}
              </p>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>{t('పురుషుడు / భర్తగా స్వభావం:', 'As a Husband:')}</strong>{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.husbandProfileTe,
                  predictions.chandraRashiEncyclopedia.husbandProfileEn
                )}
              </p>
              <p className="text-xs print:text-[10.5px] text-emerald-900 font-semibold">
                ✦ {t('దాంపత్య అన్యోన్యత సూత్రం:', 'Marital Harmony Sutra:')}{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.maritalHarmonySutraTe,
                  predictions.chandraRashiEncyclopedia.maritalHarmonySutraEn
                )}
              </p>
            </div>

            {/* 2. Child Nature, Study Habits & Parenting Guide */}
            <div className="rounded-2xl p-3.5 sm:p-4 print:p-2.5 border border-amber-200 bg-white space-y-1.5 print-card">
              <strong className="text-sm sm:text-base print:text-xs font-extrabold text-amber-950 block">
                {t(
                  `2. ${predictions.chandraRashiEncyclopedia.rashiNameTe} బాల్య ప్రతిభ, విద్యా శైలి & తల్లిదండ్రుల మార్గదర్శనం`,
                  `2. ${predictions.chandraRashiEncyclopedia.rashiNameEn} Child Learning Style & Parenting Guide`
                )}
              </strong>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>{t('సహజ మేధస్సు & విద్యా శైలి:', 'Natural Talent & Study Habits:')}</strong>{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.childNatureAndStudyTe,
                  predictions.chandraRashiEncyclopedia.childNatureAndStudyEn
                )}
              </p>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>{t('పెంపకం & ప్రోత్సాహ విధానం:', 'Parenting Guidance:')}</strong>{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.parentingGuideTe,
                  predictions.chandraRashiEncyclopedia.parentingGuideEn
                )}
              </p>
            </div>

            {/* 3. Life Work, Business Partnership & Wealth Attraction */}
            <div className="rounded-2xl p-3.5 sm:p-4 print:p-2.5 border border-amber-200 bg-amber-50/40 space-y-1.5 print-card">
              <strong className="text-sm sm:text-base print:text-xs font-extrabold text-amber-950 block">
                {t(
                  `3. ${predictions.chandraRashiEncyclopedia.rashiNameTe} జీవన వృత్తి, వ్యాపార భాగస్వామ్యం & ధనాకర్షణ యోగం`,
                  `3. ${predictions.chandraRashiEncyclopedia.rashiNameEn} Ideal Career, Business Partnerships & Wealth`
                )}
              </strong>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>{t('అనుకూల వృత్తి & ఉద్యోగ రంగాలు:', 'Ideal Professions:')}</strong>{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.careerLifeWorkTe,
                  predictions.chandraRashiEncyclopedia.careerLifeWorkEn
                )}
              </p>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>{t('వ్యాపార భాగస్వామ్యం & ధనాకర్షణ:', 'Business Partnership & Wealth:')}</strong>{' '}
                {t(
                  `${predictions.chandraRashiEncyclopedia.businessPartnershipTe} ${predictions.chandraRashiEncyclopedia.wealthAttractionTe}`,
                  `${predictions.chandraRashiEncyclopedia.businessPartnershipEn} ${predictions.chandraRashiEncyclopedia.wealthAttractionEn}`
                )}
              </p>
              <p className="text-xs print:text-[10.5px] text-amber-950 font-semibold">
                ✦ {t('భాగస్వామ్యానికి అనుకూల రాశులు:', 'Harmonious Partner Rashis:')}{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.bestPartnerRashisTe,
                  predictions.chandraRashiEncyclopedia.bestPartnerRashisEn
                )}
              </p>
            </div>

            {/* 4. Chandra Rashi Health & Lunar/Shani Mental Resilience */}
            <div className="rounded-2xl p-3.5 sm:p-4 print:p-2.5 border border-amber-200 bg-white space-y-1.5 print-card">
              <strong className="text-sm sm:text-base print:text-xs font-extrabold text-amber-950 block">
                {t(
                  `4. శారీరక ఆరోగ్య రక్షణ (${predictions.chandraRashiEncyclopedia.kalapurushaAngamTe}) & చంద్ర-శని మనోధైర్య సూత్రం`,
                  `4. Physical Health (${predictions.chandraRashiEncyclopedia.kalapurushaAngamEn}) & Lunar-Saturn Mental Resilience`
                )}
              </strong>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>{t('ఆరోగ్య జాగ్రత్తలు:', 'Health Care:')}</strong>{' '}
                {t(
                  predictions.chandraRashiEncyclopedia.arogyaRakshaTe,
                  predictions.chandraRashiEncyclopedia.arogyaRakshaEn
                )}
              </p>
              <p className="text-xs print:text-[10.5px] text-slate-800 leading-relaxed">
                <strong>
                  {t('పౌర్ణమి–అమావాస్య & శని గోచార మనోధైర్యం:', 'Lunar Tides & Saturn Transit Resilience:')}
                </strong>{' '}
                {t(
                  `${LUNAR_AND_SHANI_MENTAL_GUIDES[0].practicalGuidanceTe[0]} ${LUNAR_AND_SHANI_MENTAL_GUIDES[1].practicalGuidanceTe[0]}`,
                  `${LUNAR_AND_SHANI_MENTAL_GUIDES[0].practicalGuidanceEn[0]} ${LUNAR_AND_SHANI_MENTAL_GUIDES[1].practicalGuidanceEn[0]}`
                )}
              </p>
            </div>
          </div>

          {renderPrintPageFooter(
            `అధ్యాయం 19 · ${predictions.chandraRashiEncyclopedia.rashiNameTe} సంపూర్ణ జీవన విజ్ఞాన సర్వస్వం`,
            30
          )}
        </div>

        {/* ====================================================================
            PAGE 31: FULL-WIDTH 120-YEAR VIMSHOTTARI MAHADASHA & ANTARDASHA
            SINGLE-SIDE STACK + ROYAL PANDIT BLESSING SEAL
            ==================================================================== */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
          {renderPrintPageHeader(30)}

          <div className="flex flex-wrap items-center justify-between gap-2 print-chapter-banner">
            <div>
              <h4 className="text-base sm:text-lg print:text-sm font-extrabold text-amber-950 flex items-center gap-2">
                <Star size={16} className="text-amber-700" />
                <span>{t('120 ఏళ్ల వింశోత్తరి మహాదశ & అంతర్దశ కాలచక్రం', '120-Year Vimshottari Mahadasha & Antardasha Timeline')}</span>
              </h4>
              <p className="text-xs print:text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t(
                  `${chartData.nakshatraName} (${chartData.pada}వ పాదం) ఆధారంగా మీ జీవితంలోని నవగ్రహ మహాదశల వరుస క్రమం మరియు భుక్తి వివరాలు (ప్రస్తుత దశ: ${predictions.dashaInfo.currentMahadasha.lordTe} మహాదశ – ${predictions.dashaInfo.currentAntardasha.lordTe} అంతర్దశ):`,
                  `Sequence of planetary Mahadasha & Antardasha periods calculated from ${chartData.nakshatraName} (Pada ${chartData.pada}):`
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 single-side-stack gap-3.5 print:gap-3">
            {chartData.dashaList.map((d) => (
              <div
                key={d.lordTe}
                className={`p-4 print:p-3 rounded-2xl border border-l-4 transition-colors print-card ${
                  d.isCurrent
                    ? 'bg-amber-100/90 border-2 border-amber-600 border-l-4 border-l-emerald-700 shadow-2xs'
                    : 'bg-amber-50/40 border-amber-200/90 border-l-[#b45309] hover:bg-amber-50/70'
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
                  <span className="inline-block mt-1 text-[11px] print:text-[10px] font-bold text-emerald-800">
                    ● {t('ప్రస్తుతం నడుస్తున్న మహాదశ (Currently Active Mahadasha)', 'Currently Active Mahadasha')}
                  </span>
                )}
                <p className="text-xs print:text-[10.5px] text-slate-700 mt-1 leading-relaxed pb-1">
                  {t(d.summaryTe, d.summaryEn)}
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-amber-200/60 text-[11px] print:text-[10px] text-slate-600">
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

          {renderPrintPageFooter('120 ఏళ్ల వింశోత్తరి మహాదశ & అంతర్దశ కాలచక్రం', 30)}
        </div>

        {/* ================================================================= */}
        {/* CHAPTERS 20–21: 8 CLASSICAL GRANTHAS & JAIMINI KARAKAS            */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-5 print:space-y-4 print-page-break page print-page-sheet">
          {/* CHAPTER 20: 8 CLASSICAL JYOTISHA GRANTHAS BIRTH CHART SYNTHESIS   */}
          <div className="space-y-4 print-card">
            <div className="bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-amber-100 rounded-2xl p-4 sm:p-5 border border-amber-500">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 block">
                {t(
                  'అధ్యాయం 20 • అష్ట మహా గ్రంథ ప్రమాణ విశ్లేషణ (Classical Shastra Decrees)',
                  'Chapter 20 • 8 Classical Sanskrit Treatises Synthesis'
                )}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {t(
                  `${name} గారి జన్మ కుండలిపై 8 ప్రాచీన జ్యోతిష మహా గ్రంథాల శ్లోక ప్రమాణ తీర్పు`,
                  `8 Immortal Sanskrit Treatises Evaluation for ${name}'s Birth Chart`
                )}
              </h4>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                {t(
                  'బృహత్ పరాశర హోరా శాస్త్రం, ఫలదీపిక, బృహజ్జాతకం, సారావళి, జాతక పారిజాతం, ఉత్తర కాలామృతం, సర్వార్థ చింతామణి మరియు భృగు నంది నాడి గ్రంథాల ఆధారంగా మీ గ్రహ స్థితి విశ్లేషణ.',
                  'Personalized scriptural decrees derived from BPHS, Phaladeepika, Brihat Jataka, Saravali, Jataka Parijata, Uttara Kalamrita, Sarvartha Chintamani, and Bhrigu Nandi Nadi.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.eightClassicalGranthas.map((decree) => (
                <div
                  key={decree.granthaId}
                  className="rounded-2xl border-2 border-amber-300 bg-[#fffdf8] p-4 space-y-2.5 shadow-2xs print-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-amber-200 pb-2">
                    <div>
                      <h5 className="text-sm sm:text-base font-extrabold text-amber-950">
                        {t(decree.granthaNameTe, decree.granthaNameEn)}
                      </h5>
                      <span className="text-[11px] font-bold text-amber-800">
                        {t(decree.authorTe, decree.authorEn)} • {t(decree.chapterRefTe, decree.chapterRefEn)}
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-xs font-bold text-amber-950 bg-amber-100/75 border-l-3 border-amber-700 pl-3 py-1.5 rounded-r-xl italic">
                    {decree.sanskritShlokaTe}
                  </blockquote>

                  <div className="text-xs font-extrabold text-emerald-950 bg-emerald-50/90 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    ★ {t(decree.sutraHeadlineTe, decree.sutraHeadlineEn)}
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed">
                    {t(decree.personalizedAnalysisTe, decree.personalizedAnalysisEn)}
                  </p>

                  <div className="pt-1.5 border-t border-amber-200/80 text-[11px] text-amber-950 font-medium">
                    <strong>🔱 {t('గ్రంథ మార్గదర్శనం:', 'Scriptural Guidance:')} </strong>
                    <span>{t(decree.practicalGuidanceTe, decree.practicalGuidanceEn)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAPTER 21: Jaimini Chara Karakas, Arudha/Upapada Lagna, Indu Lagna & Bhrigu Bindu */}
          <div className="rounded-3xl border-2 border-indigo-400 bg-gradient-to-br from-[#eef2ff] via-[#fffbeb] to-[#f5f3ff] p-4 sm:p-6 shadow-md space-y-5 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-indigo-200 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-indigo-900 bg-indigo-100 border border-indigo-300 px-3 py-1 rounded-full inline-block mb-1">
                  {t('అధ్యాయం 21 • జైమిని మహర్షి చర కారక & విశేష స్ఫుట సిద్ధాంతం', 'Chapter 21 • Maharshi Jaimini Chara Karaka & Special Sphuta Engine')}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-indigo-950">
                  {t(
                    'జైమిని సప్త చర కారకములు • ఆరూఢ (AL) & ఉపపాద (UL) లగ్నములు • ఇందు లగ్నం • భృగు బిందువు',
                    'Jaimini 7 Chara Karakas • Arudha (AL) & Upapada (UL) • Indu Lagna • Bhrigu Bindu'
                  )}
                </h4>
                <p className="text-xs text-indigo-900 font-medium mt-0.5">
                  {t(
                    'మహర్షి జైమిని ఉపదేశ సూత్రములు, భృగు నంది నాడి మరియు పరాశర స్ఫుట గణిత ఆధారంగా మీ జాతక విశేష రహస్య విశ్లేషణ.',
                    'Computed using Maharshi Jaimini Upadesha Sutras, Bhrigu Nandi Nadi & Parashara Sphuta mathematics.'
                  )}
                </p>
              </div>
              {predictions.jhoraMaster.charaKarakas[0] && (
                <div className="text-xs font-extrabold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl shrink-0">
                  👑 {t('ఆత్మకారక గ్రహం (AK):', 'Atmakaraka (AK):')} {t(predictions.jhoraMaster.charaKarakas[0].planetTe, predictions.jhoraMaster.charaKarakas[0].planetEn)} ({predictions.jhoraMaster.charaKarakas[0].degreeInSign})
                </div>
              )}
            </div>

            {/* 4 Key Special Lagnas & Destiny Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Arudha Lagna (AL) */}
              <div className="rounded-2xl border border-indigo-200 bg-white/95 p-3.5 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    🏛️ {t('ఆరూఢ లగ్నం (AL - జైమిని మాయా/కీర్తి లగ్నం)', 'Arudha Lagna (AL - Public Image & Status)')}
                  </span>
                  <span className="text-sm font-black text-indigo-950">
                    {t(predictions.jhoraMaster.arudhaLagna.rashiTe, predictions.jhoraMaster.arudhaLagna.rashiEn)}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {t(predictions.jhoraMaster.arudhaLagna.meaningTe, predictions.jhoraMaster.arudhaLagna.meaningEn)}
                </p>
              </div>

              {/* Upapada Lagna (UL) */}
              <div className="rounded-2xl border border-rose-200 bg-white/95 p-3.5 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-900 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    💍 {t('ఉపపాద లగ్నం (UL - వివాహ & దాంపత్య పీఠం)', 'Upapada Lagna (UL - Spouse & Marriage)')}
                  </span>
                  <span className="text-sm font-black text-rose-950">
                    {t(predictions.jhoraMaster.upapadaLagna.rashiTe, predictions.jhoraMaster.upapadaLagna.rashiEn)}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {t(predictions.jhoraMaster.upapadaLagna.meaningTe, predictions.jhoraMaster.upapadaLagna.meaningEn)}
                </p>
              </div>

              {/* Indu Lagna (Wealth Ascendant) */}
              <div className="rounded-2xl border border-emerald-200 bg-white/95 p-3.5 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    💰 {t('ఇందు లగ్నం (ధన/కోటీశ్వర యోగ పీఠం)', 'Indu Lagna (Kalidasa Wealth Ascendant)')}
                  </span>
                  <span className="text-sm font-black text-emerald-950">
                    {t(predictions.jhoraMaster.induLagna.rashiTe, predictions.jhoraMaster.induLagna.rashiEn)} ({predictions.jhoraMaster.induLagna.totalKalas} {t('కళలు', 'Kalas')})
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {t(predictions.jhoraMaster.induLagna.meaningTe, predictions.jhoraMaster.induLagna.meaningEn)}
                </p>
              </div>

              {/* Bhrigu Bindu (Rahu-Moon Midpoint) */}
              <div className="rounded-2xl border border-amber-300 bg-white/95 p-3.5 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    🎯 {t('భృగు బిందువు (రాహు-చంద్ర పూర్వజన్మ కర్మ బిందువు)', 'Bhrigu Bindu (Rahu-Moon Destiny Point)')}
                  </span>
                  <span className="text-sm font-black text-amber-950">
                    {t(predictions.jhoraMaster.bhriguBindu.rashiTe, predictions.jhoraMaster.bhriguBindu.rashiEn)} ({t(`${predictions.jhoraMaster.bhriguBindu.houseFromLagna}వ భావం`, `H${predictions.jhoraMaster.bhriguBindu.houseFromLagna}`)})
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {t(predictions.jhoraMaster.bhriguBindu.meaningTe, predictions.jhoraMaster.bhriguBindu.meaningEn)}
                </p>
              </div>
            </div>

            {/* Jaimini 7 Chara Karakas Table */}
            <div className="rounded-2xl border border-indigo-200 bg-white/95 p-3.5 shadow-sm space-y-2.5">
              <h5 className="text-sm font-extrabold text-indigo-950">
                📜 {t('జైమిని సప్త చర కారక పట్టిక (Jaimini 7 Chara Karakas)', 'Jaimini 7 Chara Karakas Table')}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {predictions.jhoraMaster.charaKarakas.map((ck) => (
                  <div
                    key={ck.karakaCode}
                    className={`rounded-xl border p-2.5 space-y-1 ${
                      ck.karakaCode === 'AK'
                        ? 'border-amber-400 bg-amber-50/80'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded-md">
                        {ck.karakaCode} • {t(ck.karakaTitleTe, ck.karakaTitleEn)}
                      </span>
                      <span className="text-xs font-extrabold text-amber-900">
                        {ck.degreeInSign}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">
                      {t(ck.planetTe, ck.planetEn)} ({t(ck.rashiTe, ck.rashiEn)})
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">
                      {t(ck.significanceTe, ck.significanceEn)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Natal Yogi-Avayogi & Special Sphutas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-3.5 space-y-1.5">
                <div className="text-xs font-extrabold text-emerald-950">
                  🌟 {t('జన్మ యోగి – సహయోగి – అవయోగి గ్రహములు (Natal Yogi & Avayogi):', 'Natal Yogi, Sahayogi & Avayogi Planets:')}
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 px-2.5 py-1 rounded-lg">
                    {t('జన్మ యోగి:', 'Natal Yogi:')} {t(predictions.jhoraMaster.natalYogiProfile.yogiPlanetTe, predictions.jhoraMaster.natalYogiProfile.yogiPlanetEn)} ({t(predictions.jhoraMaster.natalYogiProfile.yogiNakshatraTe, predictions.jhoraMaster.natalYogiProfile.yogiNakshatraEn)})
                  </span>
                  <span className="bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-lg">
                    {t('సహయోగి:', 'Sahayogi:')} {t(predictions.jhoraMaster.natalYogiProfile.sahayogiPlanetTe, predictions.jhoraMaster.natalYogiProfile.sahayogiPlanetEn)}
                  </span>
                  <span className="bg-rose-100 text-rose-950 border border-rose-300 px-2.5 py-1 rounded-lg">
                    {t('అవయోగి:', 'Avayogi:')} {t(predictions.jhoraMaster.natalYogiProfile.avayogiPlanetTe, predictions.jhoraMaster.natalYogiProfile.avayogiPlanetEn)}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {t(predictions.jhoraMaster.natalYogiProfile.meaningTe, predictions.jhoraMaster.natalYogiProfile.meaningEn)}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-3.5 space-y-1.5">
                <div className="text-xs font-extrabold text-amber-950">
                  🔱 {t('సంతాన బీజ-క్షేత్ర స్ఫుటములు & త్రిస్ఫుట గణితం:', 'Santana Beeja-Kshetra & Trisphuta Points:')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <div className="bg-white/90 border border-amber-200 rounded-lg p-2">
                    <div className="text-[11px] font-extrabold text-amber-950">
                      {t('బీజ స్ఫుటం (పురుష)', 'Beeja Sphuta')}
                    </div>
                    <div className="text-xs font-black text-indigo-900">
                      {t(predictions.jhoraMaster.santanaAndAyurSphutas.beejaSphutaRashiTe, predictions.jhoraMaster.santanaAndAyurSphutas.beejaSphutaRashiEn)}
                    </div>
                  </div>
                  <div className="bg-white/90 border border-amber-200 rounded-lg p-2">
                    <div className="text-[11px] font-extrabold text-amber-950">
                      {t('క్షేత్ర స్ఫుటం (స్త్రీ)', 'Kshetra Sphuta')}
                    </div>
                    <div className="text-xs font-black text-indigo-900">
                      {t(predictions.jhoraMaster.santanaAndAyurSphutas.kshetraSphutaRashiTe, predictions.jhoraMaster.santanaAndAyurSphutas.kshetraSphutaRashiEn)}
                    </div>
                  </div>
                  <div className="bg-white/90 border border-amber-200 rounded-lg p-2">
                    <div className="text-[11px] font-extrabold text-amber-950">
                      {t('త్రిస్ఫుటం (ఆయుర్బలం)', 'Trisphuta')}
                    </div>
                    <div className="text-xs font-black text-indigo-900">
                      {t(predictions.jhoraMaster.santanaAndAyurSphutas.trisphutaRashiTe, predictions.jhoraMaster.santanaAndAyurSphutas.trisphutaRashiEn)}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug">
                  {t(predictions.jhoraMaster.santanaAndAyurSphutas.santanaMeaningTe, predictions.jhoraMaster.santanaAndAyurSphutas.santanaMeaningEn)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CHAPTERS 22–23: ASHTAKAVARGA, SHADBALA, TAJIKA & PHALADIPIKA      */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-5 print:space-y-4 print-page-break page print-page-sheet">
          {/* CHAPTER 22: Sarvashtakavarga (337 Bindu Matrix), Shadbala, Tajika Varshaphal Muntha, Ratna-Rudraksha Shastra & Papasamyam */}
          <div className="rounded-3xl border-2 border-amber-500 bg-gradient-to-br from-[#fffbeb] via-[#fef3c7]/60 to-[#fff7ed] p-4 sm:p-6 shadow-md space-y-6 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-300 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-amber-950 bg-amber-200/80 border border-amber-400 px-3 py-1 rounded-full inline-block mb-1">
                  {t(
                    'అధ్యాయం 22 • అష్టకవర్గ • షడ్బలం • తాజిక వర్షఫల్ • రత్న-రుద్రాక్ష శాస్త్రం',
                    'Chapter 22 • Sarvashtakavarga • Shadbala • Tajika Varshaphal • Ratna-Rudraksha Shastra'
                  )}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#451a03]">
                  {t(
                    'సర్వాష్టకవర్గ (337 బిందు పట్టిక) • సప్తగ్రహ షడ్బల గ్రాఫ్ • వర్షఫల్ ముంథా • రత్న-రుద్రాక్ష-యంత్ర సిఫార్సు',
                    'Sarvashtakavarga (337 Bindu Matrix) • Shadbala Strength • Annual Muntha • Gemstone & Rudraksha Prescription'
                  )}
                </h4>
              </div>
              <div className="text-xs font-extrabold text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl shrink-0">
                🔢 {t('మొత్తం సర్వాష్టకవర్గ బిందువులు:', 'Total SAV Bindus:')} {predictions.divinePro.totalSavBindus} / 337
              </div>
            </div>

            {/* MODULE 22A: Sarvashtakavarga 12-Rashi Bindu Table */}
            <div className="rounded-2xl border border-amber-300 bg-white/95 p-3.5 sm:p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h5 className="text-sm sm:text-base font-extrabold text-amber-950">
                  📊 {t('1. భిన్నాష్టకవర్గ & సర్వాష్టకవర్గ ద్వాదశ రాశి బిందు పట్టిక (Parashara Ashtakavarga)', '1. Bhinnashtakavarga & Sarvashtakavarga 12-Rashi Bindu Matrix')}
                </h5>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  {t('28+ బిందువులు = శుభ/రాజయోగ బలం', '28+ Bindus = Auspicious Strength')}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-amber-100/90 text-amber-950 font-extrabold border-b border-amber-300">
                      <th className="py-2 px-2">{t('రాశి (భావం)', 'Sign (House)')}</th>
                      <th className="py-2 px-1.5 text-center">{t('సూర్య', 'Sun')}</th>
                      <th className="py-2 px-1.5 text-center">{t('చంద్ర', 'Moon')}</th>
                      <th className="py-2 px-1.5 text-center">{t('కుజ', 'Mars')}</th>
                      <th className="py-2 px-1.5 text-center">{t('బుధ', 'Merc')}</th>
                      <th className="py-2 px-1.5 text-center">{t('గురు', 'Jup')}</th>
                      <th className="py-2 px-1.5 text-center">{t('శుక్ర', 'Ven')}</th>
                      <th className="py-2 px-1.5 text-center">{t('శని', 'Sat')}</th>
                      <th className="py-2 px-2 text-center bg-amber-200/80">{t('మొత్తం (SAV)', 'Total SAV')}</th>
                      <th className="py-2 px-2">{t('ఫలిత స్థాయి', 'Verdict')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {predictions.divinePro.ashtakavargaRows.map((row) => (
                      <tr
                        key={row.rashiIdx}
                        className={
                          row.sarvaBindus >= 30
                            ? 'bg-emerald-50/70 font-semibold'
                            : row.sarvaBindus < 25
                            ? 'bg-rose-50/50'
                            : 'bg-white'
                        }
                      >
                        <td className="py-1.5 px-2 font-extrabold text-slate-900">
                          {t(row.rashiTe, row.rashiEn)}{' '}
                          <span className="text-[10px] text-amber-800 font-bold">
                            ({t(`${row.houseFromLagna}వ భావం`, `H${row.houseFromLagna}`)})
                          </span>
                        </td>
                        <td className="py-1.5 px-1.5 text-center">{row.sunBindus}</td>
                        <td className="py-1.5 px-1.5 text-center">{row.moonBindus}</td>
                        <td className="py-1.5 px-1.5 text-center">{row.marsBindus}</td>
                        <td className="py-1.5 px-1.5 text-center">{row.mercuryBindus}</td>
                        <td className="py-1.5 px-1.5 text-center">{row.jupiterBindus}</td>
                        <td className="py-1.5 px-1.5 text-center">{row.venusBindus}</td>
                        <td className="py-1.5 px-1.5 text-center">{row.saturnBindus}</td>
                        <td className="py-1.5 px-2 text-center font-black text-sm text-amber-950 bg-amber-100/60">
                          {row.sarvaBindus}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-slate-700">
                          {t(row.verdictTe, row.verdictEn)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950 leading-relaxed">
                <strong>💰 {t('కర్మ (10) – లాభ (11) – వ్యయ (12) బిందు నిష్పత్తి:', '10th–11th–12th Wealth Bindu Equation:')} </strong>
                {t(predictions.divinePro.dhanaLabhaVyayaFormula.summaryTe, predictions.divinePro.dhanaLabhaVyayaFormula.summaryEn)}
              </div>
            </div>

            {/* MODULE 22B: Shadbala (Six-Fold Planetary Strength) */}
            <div className="rounded-2xl border border-indigo-200 bg-white/95 p-3.5 sm:p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h5 className="text-sm sm:text-base font-extrabold text-indigo-950">
                  ⚖️ {t('2. సప్తగ్రహ షడ్బల పట్టిక & ఇష్ట-కష్ట ఫల నిష్పత్తి (Shadbala 6-Fold Strength)', '2. Seven-Planet Shadbala & Ishta-Kashta Phala Table')}
                </h5>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                  <span className="bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    🏆 {t('అత్యధిక బల గ్రహం:', 'Strongest:')} {t(predictions.divinePro.strongestPlanetTe, predictions.divinePro.strongestPlanetEn)}
                  </span>
                  <span className="bg-rose-100 text-rose-950 px-2.5 py-0.5 rounded-full border border-rose-300">
                    ⚡ {t('శాంతి అవసరమైన గ్రహం:', 'Needs Boost:')} {t(predictions.divinePro.weakestPlanetTe, predictions.divinePro.weakestPlanetEn)}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-950 font-extrabold border-b border-indigo-200">
                      <th className="py-2 px-2">{t('గ్రహం', 'Planet')}</th>
                      <th className="py-2 px-1.5 text-center">{t('స్థాన బలం', 'Sthana')}</th>
                      <th className="py-2 px-1.5 text-center">{t('దిగ్బలం', 'Dig')}</th>
                      <th className="py-2 px-1.5 text-center">{t('కాల బలం', 'Kala')}</th>
                      <th className="py-2 px-1.5 text-center">{t('చేష్టా బలం', 'Cheshta')}</th>
                      <th className="py-2 px-2 text-center bg-indigo-100/70">{t('మొత్తం రూపములు (అవసరం)', 'Rupas (Req)')}</th>
                      <th className="py-2 px-2">{t('షడ్బల శాతం', 'Strength %')}</th>
                      <th className="py-2 px-2">{t('ఇష్ట / కష్ట ఫలం', 'Ishta / Kashta')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {predictions.divinePro.shadbalaRows.map((sb) => (
                      <tr key={sb.planetId} className="hover:bg-slate-50/80">
                        <td className="py-2 px-2 font-extrabold text-slate-900">
                          {t(sb.planetTe, sb.planetEn)}
                        </td>
                        <td className="py-2 px-1.5 text-center">{sb.sthanaBala}</td>
                        <td className="py-2 px-1.5 text-center">{sb.digBala}</td>
                        <td className="py-2 px-1.5 text-center">{sb.kalaBala}</td>
                        <td className="py-2 px-1.5 text-center">{sb.cheshtaBala}</td>
                        <td className="py-2 px-2 text-center font-extrabold text-indigo-950 bg-indigo-50/50">
                          {sb.totalRupas} <span className="text-[10px] text-slate-500">/ {sb.requiredRupas}</span>
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  sb.strengthRatioPct >= 105
                                    ? 'bg-emerald-600'
                                    : sb.strengthRatioPct >= 90
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.round(sb.strengthRatioPct * 0.75))}%` }}
                              />
                            </div>
                            <span className="font-extrabold text-slate-900">{sb.strengthRatioPct}%</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-[11px] font-bold">
                          <span className="text-emerald-700">{sb.ishtaPhalaPct}% శుభం</span> •{' '}
                          <span className="text-rose-700">{sb.kashtaPhalaPct}% కష్టం</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODULE 22C & 22E: Tajika Varshaphal Muntha + Papasamyam & Kalasarpa/Pitru Dosha Audit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tajika Varshaphal Muntha Card */}
              <div className="rounded-2xl border border-amber-300 bg-white/95 p-4 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
                    ☀️ {t('3. తాజిక వర్షఫల్ & ముంథా (Annual Solar Return)', '3. Tajika Varshaphal & Muntha')}
                  </span>
                  <span className="text-xs font-black text-indigo-950">
                    {t(`${predictions.divinePro.varshaphal.varshaYearNumber}వ వర్ష ప్రవేశం`, `Year ${predictions.divinePro.varshaphal.varshaYearNumber}`)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-amber-50/80 border border-amber-200 rounded-xl p-2.5">
                  <div>
                    <span className="text-slate-600 block text-[11px]">{t('ఈ సంవత్సర ముంథా రాశి:', 'Annual Muntha Sign:')}</span>
                    <strong className="text-amber-950 font-extrabold">
                      {t(predictions.divinePro.varshaphal.munthaRashiTe, predictions.divinePro.varshaphal.munthaRashiEn)} ({t(`${predictions.divinePro.varshaphal.munthaHouseFromLagna}వ భావం`, `H${predictions.divinePro.varshaphal.munthaHouseFromLagna}`)})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[11px]">{t('వర్షేశ్వరుడు (Year Lord):', 'Varshapati (Year Lord):')}</span>
                    <strong className="text-indigo-950 font-extrabold">
                      {t(predictions.divinePro.varshaphal.varshapatiTe, predictions.divinePro.varshaphal.varshapatiEn)}
                    </strong>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  ✨ {t(predictions.divinePro.varshaphal.tajikaYogaTe, predictions.divinePro.varshaphal.tajikaYogaEn)}
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {t(predictions.divinePro.varshaphal.munthaPredictionTe, predictions.divinePro.varshaphal.munthaPredictionEn)}
                </p>
              </div>

              {/* Papasamyam & Kalasarpa / Pitru Dosha Audit Card */}
              <div className="rounded-2xl border border-rose-300 bg-white/95 p-4 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-950 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full">
                    🛡️ {t('4. పాపసామ్యం, కాలసర్ప & పితృ దోష తనిఖీ', '4. Papasamyam, Kalasarpa & Pitru Dosha Audit')}
                  </span>
                  <span className="text-xs font-black text-rose-900">
                    {t('మొత్తం పాప పాయింట్లు:', 'Total Papa Points:')} {predictions.divinePro.doshaAudit.totalPapaPoints}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-rose-50/70 border border-rose-200 rounded-xl p-2">
                  <div>
                    <span className="text-[10px] text-slate-600 block">{t('లగ్నం నుండి', 'From Lagna')}</span>
                    <strong className="text-rose-950 font-black">{predictions.divinePro.doshaAudit.fromLagnaPoints}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 block">{t('చంద్రుని నుండి', 'From Moon')}</span>
                    <strong className="text-rose-950 font-black">{predictions.divinePro.doshaAudit.fromMoonPoints}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 block">{t('శుక్రుని నుండి', 'From Venus')}</span>
                    <strong className="text-rose-950 font-black">{predictions.divinePro.doshaAudit.fromVenusPoints}</strong>
                  </div>
                </div>
                <p className="text-xs text-slate-800 leading-snug">
                  <strong>• {t('కాలసర్ప స్థితి:', 'Kalasarpa Status:')} </strong>
                  {t(predictions.divinePro.doshaAudit.kalasarpaStatusTe, predictions.divinePro.doshaAudit.kalasarpaStatusEn)}
                </p>
                <p className="text-xs text-slate-800 leading-snug">
                  <strong>• {t('పితృ కర్మ స్థితి:', 'Pitru Karma Status:')} </strong>
                  {t(predictions.divinePro.doshaAudit.pitruDoshaStatusTe, predictions.divinePro.doshaAudit.pitruDoshaStatusEn)}
                </p>
              </div>
            </div>

            {/* MODULE 22D: Ratna, Rudraksha & Yantra Shastra Prescription Matrix */}
            <div className="rounded-2xl border-2 border-emerald-300 bg-white/95 p-4 shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2">
                <h5 className="text-sm sm:text-base font-extrabold text-emerald-950">
                  💎 {t('5. రత్న, రుద్రాక్ష & యంత్ర శాస్త్ర సిఫార్సు పట్టిక (Gemstone, Rudraksha & Yantra Prescription)', '5. Personalized Gemstone, Rudraksha & Yantra Prescription')}
                </h5>
                <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {t('లగ్న (1) • పంచమ (5) • నవమ (9) త్రికోణ అధిపతుల ఆధారంగా', 'Based on 1st, 5th & 9th Trikona Lords')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {[
                  predictions.divinePro.gemPrescriptions.lifeStone,
                  predictions.divinePro.gemPrescriptions.luckyBhagyaStone,
                  predictions.divinePro.gemPrescriptions.panchamaYogaStone,
                ].map((gem) => (
                  <div
                    key={gem.roleEn}
                    className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-3.5 space-y-2 shadow-sm"
                  >
                    <div className="text-xs font-extrabold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-lg">
                      💍 {t(gem.roleTe, gem.roleEn)}
                    </div>
                    <div className="text-sm font-black text-amber-950">
                      {t(gem.gemNameTe, gem.gemNameEn)}
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <div>
                        <strong>{t('ఉపరత్నం:', 'Sub-stone:')}</strong> {t(gem.subStoneTe, gem.subStoneEn)}
                      </div>
                      <div>
                        <strong>{t('లోహం & వేలు:', 'Metal & Finger:')}</strong> {t(gem.metalTe, gem.metalEn)} • {t(gem.fingerTe, gem.fingerEn)}
                      </div>
                      <div>
                        <strong>{t('బరువు & ధారణ సమయం:', 'Weight & Timing:')}</strong> {gem.caratWeight} • {t(gem.wearingDayTe, gem.wearingDayEn)}
                      </div>
                      <div className="pt-1 border-t border-emerald-100 text-indigo-950 font-semibold">
                        📿 <strong>{t('రుద్రాక్ష:', 'Rudraksha:')}</strong> {t(gem.rudrakshaTe, gem.rudrakshaEn)}
                      </div>
                      <div className="text-amber-900 font-semibold">
                        🔱 <strong>{t('యంత్రం:', 'Yantra:')}</strong> {t(gem.yantraTe, gem.yantraEn)}
                      </div>
                      <div className="text-[10px] bg-amber-50 border border-amber-200 rounded-lg p-1.5 text-amber-950 font-bold">
                        🕉️ {gem.mantraTe}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-950 font-semibold">
                🚫 <strong>{t('ధరించకూడని రత్నాలు (Forbidden / Caution Stones):', 'Stones to Avoid Without Trial:')} </strong>
                {t(predictions.divinePro.gemPrescriptions.forbiddenStonesTe, predictions.divinePro.gemPrescriptions.forbiddenStonesEn)}
              </div>
            </div>
          </div>

          {/* CHAPTER 23: PHALADIPIKA 5-LAYER CLASSICAL SYNTHESIS & REAL-LIFE WEIGHED DECISION PREDICTORS */}
          <div className="rounded-3xl border-2 border-teal-500 bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfeff] p-4 sm:p-6 shadow-md space-y-6 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-teal-200 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-teal-900 bg-teal-100 border border-teal-300 px-3 py-1 rounded-full inline-block mb-1">
                  {t(
                    'అధ్యాయం 23 • మంత్రేశ్వర ఫలదీపిక 5-అంచెల సంశ్లేషణ & నిజ జీవిత నిర్ణయ గణితం',
                    'Chapter 23 • Mantreshwara Phaladipika 5-Layer Synthesis & Weighed Life Answers'
                  )}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-teal-950">
                  {t(
                    'ఉద్యోగమా? వ్యాపారమా? • ప్రేమ వివాహమా? పెద్దలు కుదిర్చిన పెళ్లా? • ఫలదీపిక దశా కాల నిర్ణయం',
                    'Job vs Business • Love vs Arranged Marriage • 5-Layer Classical Timing'
                  )}
                </h4>
              </div>
              <div className="text-xs font-extrabold text-teal-950 bg-teal-100/90 border border-teal-300 px-3 py-1.5 rounded-xl shrink-0">
                ⚖️ {t('శాస్త్రీయ వెయిటేజ్ పద్ధతి', 'Classical 5-Layer Weighting')}
              </div>
            </div>

            {/* TWO WEIGHED DECISION BOXES (CAREER & MARRIAGE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Career (Employment vs Business) */}
              <div className="rounded-2xl border-2 border-teal-300 bg-white/95 p-4 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-teal-950 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                    💼 {t(predictions.phalita.careerAnswer.questionTe, predictions.phalita.careerAnswer.questionEn)}
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    {t(predictions.phalita.careerAnswer.confidenceTe, predictions.phalita.careerAnswer.confidenceEn)}
                  </span>
                </div>

                {/* Score Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-blue-800">
                      {t(predictions.phalita.careerAnswer.choiceATe, predictions.phalita.careerAnswer.choiceAEn)} ({predictions.phalita.careerAnswer.pctA}%)
                    </span>
                    <span className="text-amber-800">
                      {t(predictions.phalita.careerAnswer.choiceBTe, predictions.phalita.careerAnswer.choiceBEn)} ({predictions.phalita.careerAnswer.pctB}%)
                    </span>
                  </div>
                  <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-300">
                    <div
                      className="bg-blue-600 h-full transition-all"
                      style={{ width: `${predictions.phalita.careerAnswer.pctA}%` }}
                    />
                    <div
                      className="bg-amber-500 h-full transition-all"
                      style={{ width: `${predictions.phalita.careerAnswer.pctB}%` }}
                    />
                  </div>
                </div>

                {/* Winner Verdict */}
                <div className="rounded-xl bg-teal-50 border border-teal-200 p-2.5 space-y-1 text-xs">
                  <div className="font-black text-teal-950 flex items-center gap-1.5">
                    <span>🏆 {t('జ్యోతిష్య నిర్ధారణ:', 'Astrological Verdict:')}</span>
                    <span className="text-sm text-teal-900 font-extrabold">
                      {t(predictions.phalita.careerAnswer.winnerTe, predictions.phalita.careerAnswer.winnerEn)}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">
                    {t(predictions.phalita.careerAnswer.verdictTe, predictions.phalita.careerAnswer.verdictEn)}
                  </p>
                </div>

                {/* Timing Window */}
                <div className="text-[11px] font-bold text-indigo-950 bg-indigo-50/80 border border-indigo-200 rounded-lg p-2">
                  ⏳ <strong>{t('కార్యసిద్ధి కాల నిర్ణయం (Timed Window):', 'Timed Delivery Window:')} </strong>
                  {t(predictions.phalita.careerAnswer.timingWindowTe, predictions.phalita.careerAnswer.timingWindowEn)}
                </div>

                {/* Factor details */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-extrabold text-slate-700 block">
                    {t('నిర్ధారణకు దోహదపడిన ప్రధాన గ్రహ స్థానాలు:', 'Key Planetary Factors Weighed:')}
                  </span>
                  {predictions.phalita.careerAnswer.factors.map((f, idx) => (
                    <div key={idx} className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 leading-relaxed">
                      <strong className={f.favors === 'A' ? 'text-blue-900' : 'text-amber-900'}>
                        {f.favors === 'A' ? '• [ఉద్యోగం]' : '• [వ్యాపారం]'} {t(f.titleTe, f.titleEn)}:
                      </strong>{' '}
                      {t(f.reasonTe, f.reasonEn)}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-teal-950 font-mono italic bg-teal-50/50 p-1.5 rounded-lg border border-teal-100">
                  {predictions.phalita.careerAnswer.sanskritSutraTe}
                </div>
              </div>

              {/* Box 2: Marriage (Love vs Arranged) */}
              <div className="rounded-2xl border-2 border-rose-300 bg-white/95 p-4 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-950 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                    💍 {t(predictions.phalita.marriageAnswer.questionTe, predictions.phalita.marriageAnswer.questionEn)}
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    {t(predictions.phalita.marriageAnswer.confidenceTe, predictions.phalita.marriageAnswer.confidenceEn)}
                  </span>
                </div>

                {/* Score Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-pink-700">
                      {t(predictions.phalita.marriageAnswer.choiceATe, predictions.phalita.marriageAnswer.choiceAEn)} ({predictions.phalita.marriageAnswer.pctA}%)
                    </span>
                    <span className="text-emerald-800">
                      {t(predictions.phalita.marriageAnswer.choiceBTe, predictions.phalita.marriageAnswer.choiceBEn)} ({predictions.phalita.marriageAnswer.pctB}%)
                    </span>
                  </div>
                  <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-300">
                    <div
                      className="bg-pink-500 h-full transition-all"
                      style={{ width: `${predictions.phalita.marriageAnswer.pctA}%` }}
                    />
                    <div
                      className="bg-emerald-600 h-full transition-all"
                      style={{ width: `${predictions.phalita.marriageAnswer.pctB}%` }}
                    />
                  </div>
                </div>

                {/* Winner Verdict */}
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 space-y-1 text-xs">
                  <div className="font-black text-rose-950 flex items-center gap-1.5">
                    <span>🏆 {t('జ్యోతిష్య నిర్ధారణ:', 'Astrological Verdict:')}</span>
                    <span className="text-sm text-rose-900 font-extrabold">
                      {t(predictions.phalita.marriageAnswer.winnerTe, predictions.phalita.marriageAnswer.winnerEn)}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">
                    {t(predictions.phalita.marriageAnswer.verdictTe, predictions.phalita.marriageAnswer.verdictEn)}
                  </p>
                </div>

                {/* Timing Window */}
                <div className="text-[11px] font-bold text-indigo-950 bg-indigo-50/80 border border-indigo-200 rounded-lg p-2">
                  ⏳ <strong>{t('దాంపత్య కాల నిర్ణయం (Timed Window):', 'Timed Delivery Window:')} </strong>
                  {t(predictions.phalita.marriageAnswer.timingWindowTe, predictions.phalita.marriageAnswer.timingWindowEn)}
                </div>

                {/* Factor details */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-extrabold text-slate-700 block">
                    {t('నిర్ధారణకు దోహదపడిన ప్రధాన గ్రహ స్థానాలు:', 'Key Planetary Factors Weighed:')}
                  </span>
                  {predictions.phalita.marriageAnswer.factors.map((f, idx) => (
                    <div key={idx} className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 leading-relaxed">
                      <strong className={f.favors === 'A' ? 'text-pink-900' : 'text-emerald-900'}>
                        {f.favors === 'A' ? '• [ప్రేమ/స్వయం ఎంపిక]' : '• [పెద్దల పెళ్లి]'} {t(f.titleTe, f.titleEn)}:
                      </strong>{' '}
                      {t(f.reasonTe, f.reasonEn)}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-rose-950 font-mono italic bg-rose-50/50 p-1.5 rounded-lg border border-rose-100">
                  {predictions.phalita.marriageAnswer.sanskritSutraTe}
                </div>
              </div>
            </div>

            {/* 5-LAYER DOMAIN SYNTHESIS CARDS */}
            <div className="space-y-3">
              <h5 className="text-sm sm:text-base font-extrabold text-teal-950">
                🏛️ {t('ఫలదీపిక 5-అంచెల సంశ్లేషణ ఫలితాలు (5-Layer Domain Syntheses)', 'Phaladipika 5-Layer Domain Syntheses')}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {predictions.phalita.domainSyntheses.map((d) => (
                  <div
                    key={d.domainKey}
                    className="rounded-2xl border border-teal-200 bg-white/95 p-3.5 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-teal-100 pb-1.5">
                      <span className="text-xs font-black text-teal-950">
                        {t(d.domainTitleTe, d.domainTitleEn)}
                      </span>
                      <span className="text-xs font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {d.compositeScore} / 100
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {t(d.verdictTe, d.verdictEn)}
                    </p>

                    <div className="grid grid-cols-5 gap-1 text-center text-[10px] bg-teal-50/70 border border-teal-200 rounded-lg p-1.5">
                      <div>
                        <span className="text-slate-500 block">భావేశ</span>
                        <strong>{d.bhaveshaScore}/40</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">కారక</span>
                        <strong>{d.karakaScore}/25</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">వర్గ</span>
                        <strong>{d.divisionalScore}/15</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">బిందు</span>
                        <strong>{d.ashtakavargaScore}/10</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">దశా</span>
                        <strong>{d.dashaScore}/10</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-700 space-y-1">
                      <div className="text-indigo-950 font-bold">
                        ⏱️ {t(d.activeDashaWindowTe, d.activeDashaWindowEn)}
                      </div>
                      <div className="text-amber-950">
                        🔱 <strong>{t('శాంతి మార్గం:', 'Remedial Path:')}</strong> {t(d.practicalGuidanceTe, d.practicalGuidanceEn)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono italic">
                        {d.shlokaRefTe}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CHAPTERS 24–25: VASTU SHASTRA & BHAVARTHA RATNAKARA + AYURVEDA    */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-5 print:space-y-4 print-page-break page print-page-sheet">
          {/* CHAPTER 24: PERSONALISED HOROSCOPE VASTU SHASTRA & KUBERA SPATIAL HARMONY */}
          <div className="rounded-3xl border-2 border-orange-500 bg-gradient-to-br from-[#fff7ed] via-white to-[#fef3c7] p-4 sm:p-6 shadow-md space-y-6 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-orange-300 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-orange-950 bg-orange-100 border border-orange-300 px-3 py-1 rounded-full inline-block mb-1">
                  {t(
                    'అధ్యాయం 24 • జన్మ రాశి వైదిక వాస్తు విజ్ఞానం & కుబేర స్థాన అమరిక',
                    'Chapter 24 • Personal Horoscope Vastu & Kubera Spatial Alignment'
                  )}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#7c2d12]">
                  {t(
                    `${predictions.personalVastu.rashiTe} రాశి వ్యక్తిగత గృహ వాస్తు • శుభ సింహద్వారం • శయన దిశ • ధన మూల`,
                    `${predictions.personalVastu.rashiEn} Personal Vastu • Main Entrance • Sleep Alignment • Wealth Vault`
                  )}
                </h4>
                <p className="text-xs text-orange-900 font-medium mt-0.5">
                  {t(
                    'సాధారణ వాస్తు కాకుండా, మీ జన్మ రాశి మరియు పాలక గ్రహం ఆధారంగా ప్రాచీన దక్షిణ భారతీయ వాస్తు ప్రమాణాలు.',
                    'Grounded in your natal Moon sign and planetary lordship per classical Dakshina Bharatiya Vastu Siddhanta.'
                  )}
                </p>
              </div>
              <div className="text-xs font-extrabold text-orange-950 bg-orange-100/90 border border-orange-300 px-3 py-1.5 rounded-xl shrink-0">
                🧭 {t('పాలక గ్రహం:', 'Ruling Planet:')} {t(predictions.personalVastu.rulingPlanetTe, predictions.personalVastu.rulingPlanetEn)}
              </div>
            </div>

            {/* 6 Key Spatial Cardinal Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Card 1: Favourable Direction & Sleep Orientation */}
              <div className="rounded-2xl border border-orange-200 bg-white/95 p-3.5 space-y-2 shadow-xs">
                <span className="text-xs font-black text-orange-900 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full inline-block">
                  🛏️ {t('అనుకూల దిశ & శయన సంకల్పం', 'Favourable Direction & Sleep')}
                </span>
                <div className="text-sm font-extrabold text-slate-900">
                  {t(predictions.personalVastu.favourableDirectionTe, predictions.personalVastu.favourableDirectionEn)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {t(predictions.personalVastu.sleepHeadOrientationTe, predictions.personalVastu.sleepHeadOrientationEn)}
                </p>
              </div>

              {/* Card 2: Main Entrance (Simhadwaram) */}
              <div className="rounded-2xl border border-amber-300 bg-white/95 p-3.5 space-y-2 shadow-xs">
                <span className="text-xs font-black text-amber-950 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block">
                  🚪 {t('శుభ సింహద్వారం (Main Entrance)', 'Auspicious Main Entrance')}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {t(predictions.personalVastu.mainEntranceTe, predictions.personalVastu.mainEntranceEn)}
                </p>
              </div>

              {/* Card 3: Pooja Sanctuary */}
              <div className="rounded-2xl border border-emerald-300 bg-white/95 p-3.5 space-y-2 shadow-xs">
                <span className="text-xs font-black text-emerald-950 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                  🪔 {t('పూజాగది & దైవ దిశ', 'Pooja Room & Sanctuary')}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {t(predictions.personalVastu.poojaRoomTe, predictions.personalVastu.poojaRoomEn)}
                </p>
              </div>

              {/* Card 4: Kitchen / Agni Sthanam */}
              <div className="rounded-2xl border border-rose-300 bg-white/95 p-3.5 space-y-2 shadow-xs">
                <span className="text-xs font-black text-rose-950 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-block">
                  🔥 {t('వంటగది & అగ్ని మూల', 'Kitchen & Agni Corner')}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {t(predictions.personalVastu.kitchenDirectionTe, predictions.personalVastu.kitchenDirectionEn)}
                </p>
              </div>

              {/* Card 5: Wealth Vault / Kubera Sthanam */}
              <div className="rounded-2xl border border-indigo-300 bg-white/95 p-3.5 space-y-2 shadow-xs">
                <span className="text-xs font-black text-indigo-950 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full inline-block">
                  💰 {t('ధన నిల్వ బీరువా / కుబేర స్థానం', 'Wealth Locker & Kubera Corner')}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {t(predictions.personalVastu.wealthCornerTe, predictions.personalVastu.wealthCornerEn)}
                </p>
              </div>

              {/* Card 6: Lucky Colours & Simple Vastu Remedy */}
              <div className="rounded-2xl border border-teal-300 bg-white/95 p-3.5 space-y-2 shadow-xs">
                <span className="text-xs font-black text-teal-950 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full inline-block">
                  🎨 {t('అనుకూల రంగులు & వాస్తు పరిహారం', 'Harmonious Colours & Remedy')}
                </span>
                <div className="text-xs text-slate-800 font-bold">
                  {t(predictions.personalVastu.luckyColoursTe, predictions.personalVastu.luckyColoursEn)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {t(predictions.personalVastu.practicalRemedyTe, predictions.personalVastu.practicalRemedyEn)}
                </p>
              </div>
            </div>
          </div>

          {/* CHAPTER 25: SRI RAMANUJACHARYA BHAVARTHA RATNAKARA, 300 MAHA RAJA YOGAS & AYURVEDIC MEDICAL ASTROLOGY */}
          <div id="chapter-25" className="scroll-mt-24 rounded-3xl border-2 border-emerald-600 bg-gradient-to-br from-[#ecfdf5] via-white to-[#fffbeb] p-4 sm:p-6 shadow-md space-y-6 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-emerald-300 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full inline-block mb-1">
                  {t(
                    'అధ్యాయం 25 • శ్రీ రామానుజాచార్య భావార్థ రత్నాకర • 300 మహారాజ యోగాలు • ఆయుర్వేద వైద్య జ్యోతిషం',
                    'Chapter 25 • Bhavartha Ratnakara • 300 Maha Raja Yogas • Ayurvedic Medical Astrology'
                  )}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-emerald-950">
                  {t(
                    `${predictions.bhavarthaAyurveda.bhavarthaDecree.lagnaTe} లగ్న భావార్థ రత్నాకర సూత్రం • రాజయోగ సర్టిఫికేషన్ • త్రిదోష & సప్తధాతు ఆరోగ్య పట్టిక`,
                    `${predictions.bhavarthaAyurveda.bhavarthaDecree.lagnaEn} Bhavartha Ratnakara Sutra • 300 Combinations Audit • Ayurvedic Tridosha Regimen`
                  )}
                </h4>
              </div>
              <div className="text-xs font-extrabold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl shrink-0">
                📜 {t('300 ప్రాచీన యోగాల తనిఖీ:', '300 Classical Yogas Audited:')} {predictions.bhavarthaAyurveda.activeMahaYogas.length} {t('ప్రధాన యోగాలు', 'Active Maha Yogas')}
              </div>
            </div>

            {/* SECTION 25A: Sri Ramanujacharya's Bhavartha Ratnakara Lagna-Specific Decree */}
            <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-[#fffbeb] via-white to-[#fef3c7]/70 p-4 shadow-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black text-amber-950 bg-amber-200/80 border border-amber-400 px-3 py-1 rounded-full">
                  🔱 {t(predictions.bhavarthaAyurveda.bhavarthaDecree.chapterRefTe, predictions.bhavarthaAyurveda.bhavarthaDecree.chapterRefEn)}
                </span>
                <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                  👑 {t('యోగకారక గ్రహములు:', 'Yogakaraka Planets:')} {t(predictions.bhavarthaAyurveda.bhavarthaDecree.yogakarakaPlanetsTe, predictions.bhavarthaAyurveda.bhavarthaDecree.yogakarakaPlanetsEn)}
                </span>
              </div>

              <blockquote className="text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/80 border-l-4 border-amber-700 pl-3.5 py-2 rounded-r-xl italic">
                “{predictions.bhavarthaAyurveda.bhavarthaDecree.sanskritShlokaTe}”
              </blockquote>

              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                {t(predictions.bhavarthaAyurveda.bhavarthaDecree.dhanaSutraTe, predictions.bhavarthaAyurveda.bhavarthaDecree.dhanaSutraEn)}
              </p>

              <p className="text-xs text-slate-800 leading-relaxed bg-white/90 border border-amber-200 rounded-xl p-3">
                <strong>🔍 {t('మీ జాతక అన్వయం:', 'Your Chart Application:')} </strong>
                {t(predictions.bhavarthaAyurveda.bhavarthaDecree.personalizedChartReadingTe, predictions.bhavarthaAyurveda.bhavarthaDecree.personalizedChartReadingEn)}
              </p>
            </div>

            {/* SECTION 25B: 300 Classical Combinations — Active Maha Raja & Dhana Yogas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm sm:text-base font-extrabold text-emerald-950">
                  🌟 {t('300 ప్రాచీన మహారాజ & ధన యోగాల సర్టిఫికేషన్ (Classical 300 Combinations Audit)', 'Classical 300 Maha Raja & Dhana Yogas Certification')}
                </h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {predictions.bhavarthaAyurveda.activeMahaYogas.map((yoga) => (
                  <div
                    key={yoga.code}
                    className="rounded-2xl border border-emerald-300 bg-white/95 p-3.5 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                        {t(yoga.categoryTe, yoga.categoryEn)}
                      </span>
                      <span className="text-xs font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        {t('యోగ బలం:', 'Strength:')} {yoga.strengthPct}%
                      </span>
                    </div>

                    <div className="text-sm font-extrabold text-slate-950">
                      ✦ {t(yoga.nameTe, yoga.nameEn)}
                    </div>

                    <div className="text-[11px] font-bold text-amber-950 bg-amber-50/90 border-l-3 border-amber-600 pl-2.5 py-1 rounded-r-lg italic">
                      {yoga.SanskritRuleTe}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {t(yoga.effectTe, yoga.effectEn)}
                    </p>

                    <div className="text-[10px] font-semibold text-slate-500">
                      📖 {t(yoga.shastraRefTe, yoga.shastraRefEn)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 25C: Ayurvedic Medical Astrology (Vaidya Jyotisha) Tridosha & Sapta Dhatu Profile */}
            <div className="rounded-2xl border-2 border-teal-400 bg-white/95 p-4 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200 pb-2.5">
                <div>
                  <h5 className="text-sm sm:text-base font-extrabold text-teal-950">
                    🌿 {t('ఆయుర్వేద వైద్య జ్యోతిష విజ్ఞానం (Ayurvedic Medical Astrology & Tridosha Profile)', 'Ayurvedic Medical Astrology & Tridosha Balance')}
                  </h5>
                  <span className="text-xs font-bold text-teal-800">
                    {t('దేహ ప్రకృతి:', 'Body Constitution (Prakriti):')} {t(predictions.bhavarthaAyurveda.ayurvedaProfile.prakritiTitleTe, predictions.bhavarthaAyurveda.ayurvedaProfile.prakritiTitleEn)}
                  </span>
                </div>
                <span className="text-xs font-black text-teal-950 bg-teal-100 border border-teal-300 px-3 py-1 rounded-full">
                  {t(predictions.bhavarthaAyurveda.ayurvedaProfile.dominantDoshaTe, predictions.bhavarthaAyurveda.ayurvedaProfile.dominantDoshaEn)}
                </span>
              </div>

              {/* Tridosha Bar (Vata / Pitta / Kapha) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-sky-900">🌬️ {t('వాత (Vata):', 'Vata:')} {predictions.bhavarthaAyurveda.ayurvedaProfile.vataPct}%</span>
                  <span className="text-amber-900">🔥 {t('పిత్త (Pitta):', 'Pitta:')} {predictions.bhavarthaAyurveda.ayurvedaProfile.pittaPct}%</span>
                  <span className="text-emerald-900">💧 {t('కఫ (Kapha):', 'Kapha:')} {predictions.bhavarthaAyurveda.ayurvedaProfile.kaphaPct}%</span>
                </div>
                <div className="h-3.5 w-full rounded-full overflow-hidden flex border border-slate-300">
                  <div
                    className="bg-sky-500 h-full"
                    style={{ width: `${predictions.bhavarthaAyurveda.ayurvedaProfile.vataPct}%` }}
                  />
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${predictions.bhavarthaAyurveda.ayurvedaProfile.pittaPct}%` }}
                  />
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${predictions.bhavarthaAyurveda.ayurvedaProfile.kaphaPct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-teal-50/70 border border-teal-200 p-3 space-y-1">
                  <strong className="text-teal-950 block">
                    🩺 {t('సప్తధాతు & కాలపురుష అంగ రక్షణ:', 'Sapta Dhatu & Anatomical Focus:')}
                  </strong>
                  <div className="font-bold text-slate-900">
                    {t(predictions.bhavarthaAyurveda.ayurvedaProfile.saptaDhatuFocusTe, predictions.bhavarthaAyurveda.ayurvedaProfile.saptaDhatuFocusEn)}
                  </div>
                  <p className="text-slate-700">
                    {t(predictions.bhavarthaAyurveda.ayurvedaProfile.vulnerableSystemTe, predictions.bhavarthaAyurveda.ayurvedaProfile.vulnerableSystemEn)}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 space-y-1">
                  <strong className="text-amber-950 block">
                    🥗 {t('ఆయుర్వేద ఆహార పథ్యం & ఓషధులు:', 'Ayurvedic Diet & Herbal Regimen:')}
                  </strong>
                  <p className="text-slate-800 leading-relaxed">
                    {t(predictions.bhavarthaAyurveda.ayurvedaProfile.aharaPathyaTe, predictions.bhavarthaAyurveda.ayurvedaProfile.aharaPathyaEn)}
                  </p>
                  <div className="font-bold text-emerald-950">
                    🌿 {t('శుభ ఓషధులు:', 'Key Herbs:')} {t(predictions.bhavarthaAyurveda.ayurvedaProfile.ayurvedicHerbsTe, predictions.bhavarthaAyurveda.ayurvedaProfile.ayurvedicHerbsEn)}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] font-bold text-emerald-950 text-center">
                🕉️ {t('ధన్వంతరి ఆరోగ్య కవచ మంత్రం:', 'Dhanvantari Health Mantra:')} {predictions.bhavarthaAyurveda.ayurvedaProfile.dhanvantariMantraTe}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CHAPTERS 26–27: BHRIGU NANDI NADI 1-5-9 & SAPTA-VARGA (D1-D10)    */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-5 print:space-y-4 print-page-break page print-page-sheet">
          {/* CHAPTER 26: BHRIGU NANDI NADI 1-5-9 CIRCUITS & JAIMINI ISHTA DEVATA / DARAKARAKA SYNTHESIS */}
          <div id="chapter-26" className="scroll-mt-24 rounded-3xl border-2 border-amber-400 bg-gradient-to-br from-[#fffaf0] via-white to-amber-50/70 p-4 sm:p-6 shadow-md space-y-5 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wide block mb-1">
                  {t(
                    'అధ్యాయం 26 · భృగు నంది నాడి 1-5-9 గ్రహ సర్క్యూట్లు · జైమిని ఇష్టదేవత & దారకారక విశ్లేషణ',
                    'Chapter 26 · Bhrigu Nandi Nadi 1-5-9 Circuits · Jaimini Ishta Devata & Darakaraka'
                  )}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-amber-950">
                  {t(
                    'నైసర్గిక కారక గ్రహ 1-5-9 త్రికోణ సంబంధాలు & కారకాంశ ఇష్టదైవ నిర్ణయం',
                    'Natural Karaka 1-5-9 Trinal Synergy & Karakamsa Ishta Devata Verification'
                  )}
                </h4>
              </div>
              <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl shrink-0">
                🔱 {t('ఇష్టదైవం:', 'Ishta Deity:')} {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.ishtaDevataTe.split(' / ')[0], predictions.bhriguShodashavarga.jaiminiIshtaProfile.ishtaDevataEn.split(' / ')[0])}
              </span>
            </div>

            {/* 4 Bhrigu Nandi Nadi Circuits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predictions.bhriguShodashavarga.bhriguCircuits.map((circuit) => (
                <div
                  key={circuit.circuitNameEn}
                  className={`rounded-2xl p-4 border space-y-1.5 ${
                    circuit.isStrongTrine
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-white border-amber-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <h5 className="text-xs sm:text-sm font-extrabold text-amber-950">
                      {t(circuit.circuitNameTe, circuit.circuitNameEn)}
                    </h5>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-lg border ${
                        circuit.isStrongTrine
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {t(circuit.strengthBadgeTe, circuit.strengthBadgeEn)}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700">
                    {t(circuit.karakaPairTe, circuit.karakaPairEn)} ·{' '}
                    <span className="text-amber-900">{t(circuit.relationTe, circuit.relationEn)}</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {t(circuit.predictionTe, circuit.predictionEn)}
                  </p>
                </div>
              ))}
            </div>

            {/* Jaimini Ishta Devata & Darakaraka Box */}
            <div className="rounded-2xl bg-[#3c1104] text-amber-50 p-4 border border-amber-400/70 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/35 pb-2">
                <strong className="text-xs sm:text-sm text-amber-300">
                  🕉️ {t('జైమిని కారకాంశ (D9) ఇష్టదేవత & ఉపపద వివాహ సమన్వయం', 'Jaimini Karakamsa Ishta Devata & Upapada Marriage Alignment')}
                </strong>
                <span className="text-[11px] font-bold text-amber-200">
                  AK: {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.atmakarakaTe, predictions.bhriguShodashavarga.jaiminiIshtaProfile.atmakarakaEn)} ·{' '}
                  {t('కారకాంశ:', 'Karakamsa:')} {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.karakamsaRashiTe, predictions.bhriguShodashavarga.jaiminiIshtaProfile.karakamsaRashiEn)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-amber-950/75 border border-amber-500/40 rounded-xl p-3 space-y-1">
                  <strong className="text-amber-300 block">
                    ✨ {t('మీ జన్మ ఇష్టదేవత:', 'Presiding Ishta Devata:')}
                  </strong>
                  <div className="font-extrabold text-white text-sm">
                    {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.ishtaDevataTe, predictions.bhriguShodashavarga.jaiminiIshtaProfile.ishtaDevataEn)}
                  </div>
                  <p className="text-amber-100/90 leading-relaxed">
                    {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.ishtaReasonTe, predictions.bhriguShodashavarga.jaiminiIshtaProfile.ishtaReasonEn)}
                  </p>
                  <div className="text-[11px] text-emerald-300 font-bold pt-1">
                    📿 {t('నిత్య జప మంత్రం:', 'Personal Mantra:')} {predictions.bhriguShodashavarga.jaiminiIshtaProfile.upasanaMantraTe}
                  </div>
                </div>

                <div className="bg-amber-950/75 border border-amber-500/40 rounded-xl p-3 space-y-1">
                  <strong className="text-amber-300 block">
                    💍 {t('దారకారక (DK) & ఉపపద లగ్న (UL) దాంపత్య ఫలం:', 'Darakaraka (DK) & Upapada Lagna (UL) Harmony:')}
                  </strong>
                  <div className="text-white font-bold">
                    DK: {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.darakarakaTe, predictions.bhriguShodashavarga.jaiminiIshtaProfile.darakarakaEn)} · UL: {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.upapadaRashiTe, predictions.bhriguShodashavarga.jaiminiIshtaProfile.upapadaRashiEn)}
                  </div>
                  <p className="text-amber-100/90 leading-relaxed">
                    {t(predictions.bhriguShodashavarga.jaiminiIshtaProfile.maritalHarmonySummaryTe, predictions.bhriguShodashavarga.jaiminiIshtaProfile.maritalHarmonySummaryEn)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CHAPTER 27: PARASHARA SAPTA-VARGA (D1-D10) STRENGTH MATRIX & TRIVIDHA RUNA */}
          <div id="chapter-27" className="scroll-mt-24 rounded-3xl border-2 border-amber-400 bg-white p-4 sm:p-6 shadow-md space-y-5 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wide block mb-1">
                  {t(
                    'అధ్యాయం 27 · పరాశర సప్తవర్గ బల చక్రం (D1–D10) & త్రివిధ రుణ విముక్తి',
                    'Chapter 27 · Parashara Sapta-Varga (D1–D10) Dignity Table & Trividha Runa'
                  )}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-amber-950">
                  {t(
                    'రాశి (D1), హోరా (D2), ద్రేక్కాణ (D3), చతుర్థాంశ (D4), సప్తాంశ (D7), నవాంశ (D9) & దశాంశ (D10)',
                    'Divisional Strength Across D1 Rashi, D2 Hora, D3, D4, D7, D9 Navamsha & D10 Dasamsha'
                  )}
                </h4>
              </div>
              {predictions.bhriguShodashavarga.vargottamaPlanetsTe.length > 0 && (
                <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl shrink-0">
                  ★ {t('వర్గోత్తమ గ్రహాలు:', 'Vargottama:')}{' '}
                  {t(
                    predictions.bhriguShodashavarga.vargottamaPlanetsTe.join(', '),
                    predictions.bhriguShodashavarga.vargottamaPlanetsEn.join(', ')
                  )}
                </span>
              )}
            </div>

            <div className="overflow-x-auto border border-amber-300 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs print:text-[10px]">
                <thead>
                  <tr className="bg-amber-100 text-amber-950 border-b border-amber-300">
                    <th className="py-2 px-2.5 font-extrabold">{t('గ్రహం', 'Planet')}</th>
                    <th className="py-2 px-2 font-extrabold">D1 ({t('రాశి', 'Body')})</th>
                    <th className="py-2 px-2 font-extrabold">D2 ({t('హోరా', 'Wealth')})</th>
                    <th className="py-2 px-2 font-extrabold">D3 ({t('ద్రేక్కాణ', 'Courage')})</th>
                    <th className="py-2 px-2 font-extrabold">D4 ({t('చతుర్థాంశ', 'Assets')})</th>
                    <th className="py-2 px-2 font-extrabold">D7 ({t('సప్తాంశ', 'Progeny')})</th>
                    <th className="py-2 px-2 font-extrabold">D9 ({t('నవాంశ', 'Dharma')})</th>
                    <th className="py-2 px-2 font-extrabold">D10 ({t('దశాంశ', 'Career')})</th>
                    <th className="py-2 px-2.5 font-extrabold">{t('వర్గ బలం', 'Varga Dignity')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200">
                  {predictions.bhriguShodashavarga.saptaVargaRows.map((row) => (
                    <tr key={row.planetId} className="odd:bg-amber-50/35 hover:bg-amber-50">
                      <td className="py-1.5 px-2.5 font-extrabold text-amber-950">
                        {language === 'en' ? row.nameEn : row.nameTe}
                        {row.isVargottama && (
                          <span className="ml-1 text-[10px] text-emerald-700 font-bold">★</span>
                        )}
                      </td>
                      <td className="py-1.5 px-2 font-bold text-slate-900">{row.d1RashiTe}</td>
                      <td className="py-1.5 px-2 text-slate-800">{row.d2HoraTe}</td>
                      <td className="py-1.5 px-2 text-slate-800">{row.d3DrekkanaTe}</td>
                      <td className="py-1.5 px-2 text-slate-800">{row.d4ChaturthamsaTe}</td>
                      <td className="py-1.5 px-2 text-slate-800">{row.d7SaptamsaTe}</td>
                      <td className="py-1.5 px-2 font-bold text-emerald-900">{row.d9NavamshaTe}</td>
                      <td className="py-1.5 px-2 font-bold text-amber-900">{row.d10DasamshaTe}</td>
                      <td className="py-1.5 px-2.5">
                        <span className="font-bold text-amber-950">
                          {row.vargaStrengthCount}/7 · {t(row.strengthGradeTe, row.strengthGradeEn)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Trividha Runa Diagnostic */}
            <div className="space-y-2">
              <h5 className="text-sm font-extrabold text-amber-950">
                🕊️ {t('త్రివిధ రుణ విశ్లేషణ & శాస్త్రోక్త విముక్తి మార్గాలు (Deva · Pitru · Rishi Runa):', 'Trividha Runa Assessment & Vedic Remedies (Deva · Pitru · Rishi Runa):')}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {predictions.bhriguShodashavarga.trividhaRunas.map((runa) => (
                  <div
                    key={runa.runaTitleEn}
                    className={`rounded-2xl p-3.5 border space-y-1.5 text-xs ${
                      runa.isElevated
                        ? 'bg-amber-50/90 border-amber-300'
                        : 'bg-emerald-50/70 border-emerald-300'
                    }`}
                  >
                    <strong className="text-amber-950 block">{t(runa.runaTitleTe, runa.runaTitleEn)}</strong>
                    <div className={`text-[11px] font-bold ${runa.isElevated ? 'text-amber-900' : 'text-emerald-800'}`}>
                      {t(runa.statusTe, runa.statusEn)}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{t(runa.diagnosisTe, runa.diagnosisEn)}</p>
                    <p className="text-[11px] font-bold text-amber-950 pt-1 border-t border-amber-200/80">
                      🙏 {t('పరిహారం:', 'Remedy:')} {t(runa.remedyTe, runa.remedyEn)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CHAPTERS 28–29: KP-249 CUSPS & RATNA-RUDRAKSHA ADVISOR          */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-5 print:space-y-4 print-page-break page print-page-sheet">
          {/* CHAPTER 28: KP ASTROLOGY (KRISHNAMURTI PADDHATI) 12 BHAVA CUSPS, SUB-LORDS & KP LIFE PROMISES */}
          <div id="chapter-28" className="scroll-mt-24 rounded-3xl border-2 border-amber-400 bg-white p-4 sm:p-6 shadow-md space-y-5 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wide block mb-1">
                  {t(
                    'అధ్యాయం 28 · నక్షత్ర నాడీ 249 సబ్‌లార్డ్ (KP-249) & 12 భావ కస్ప్ కారకత్వ నిర్ణయం',
                    'Chapter 28 · Nakshatra Nadi 249 Sub-Lord (KP-249) 12 Bhava Cusp Significators'
                  )}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-amber-950">
                  {t(
                    'నక్షత్ర ఉప-నాథ 12 భావ సంధులు (Cusps), తారా-ఉప అధిపతులు (Star & Sub Lords) & జీవన ఫలితాలు',
                    'Bhava Cusp Sub-Lords (1–12), Star & Sub Planetary Significators & Chart Promises'
                  )}
                </h4>
              </div>
              <span className="text-xs font-extrabold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl shrink-0">
                249 {t('KP ఉప-విభాగ గణితం', 'KP Sub-Division Engine')}
              </span>
            </div>

            {/* 5 KP Life Promises */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {predictions.kpReport.promises.map((prm) => (
                <div
                  key={prm.cuspChecked}
                  className={`rounded-2xl p-3.5 border space-y-1.5 text-xs ${
                    prm.isStrong ? 'bg-emerald-50/75 border-emerald-300' : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-amber-950">{t(prm.domainTe, prm.domainEn)}</strong>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
                        prm.isStrong
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {t(prm.verdictTe, prm.verdictEn)}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700">
                    {t(`${prm.cuspChecked}వ కస్ప్ సబ్‌లార్డ్:`, `Cusp ${prm.cuspChecked} Sub-Lord:`)}{' '}
                    <span className="text-amber-950">{t(prm.subLordTe, prm.subLordEn)}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{t(prm.summaryTe, prm.summaryEn)}</p>
                </div>
              ))}
            </div>

            {/* 12 KP Bhava Cusps Table */}
            <div className="overflow-x-auto border border-amber-300 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs print:text-[10px]">
                <thead>
                  <tr className="bg-amber-100 text-amber-950 border-b border-amber-300">
                    <th className="py-2 px-2.5 font-extrabold">{t('భావం (Cusp)', 'KP Cusp')}</th>
                    <th className="py-2 px-2 font-extrabold">{t('రాశి & డిగ్రీ', 'Sign & Degree')}</th>
                    <th className="py-2 px-2 font-extrabold">{t('రాశ్యాధిపతి', 'Sign Lord')}</th>
                    <th className="py-2 px-2 font-extrabold">{t('నక్షత్రాధిపతి', 'Star Lord')}</th>
                    <th className="py-2 px-2 font-extrabold">{t('సబ్‌లార్డ్ (Sub)', 'Sub-Lord')}</th>
                    <th className="py-2 px-2.5 font-extrabold">{t('భావ కారక గ్రహాలు', 'KP Significators')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200">
                  {predictions.kpReport.cusps.map((c) => (
                    <tr key={c.cuspNumber} className="odd:bg-amber-50/35 hover:bg-amber-50">
                      <td className="py-1.5 px-2.5 font-extrabold text-amber-950 whitespace-nowrap">
                        {language === 'en' ? c.bhavaTitleEn : c.bhavaTitleTe}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {language === 'en' ? c.rashiEn : c.rashiTe} {c.dmsFormatted}
                      </td>
                      <td className="py-1.5 px-2 text-slate-800">{language === 'en' ? c.signLordEn : c.signLordTe}</td>
                      <td className="py-1.5 px-2 text-slate-800">{language === 'en' ? c.starLordEn : c.starLordTe}</td>
                      <td className="py-1.5 px-2 font-extrabold text-emerald-900">
                        {language === 'en' ? c.subLordEn : c.subLordTe}
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-700">
                        {language === 'en' ? c.significatorPlanetsEn : c.significatorPlanetsTe}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 9 Planets KP Significators */}
            <div className="overflow-x-auto border border-amber-200 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs print:text-[10px]">
                <thead>
                  <tr className="bg-amber-50 text-amber-950 border-b border-amber-200">
                    <th className="py-2 px-2.5 font-extrabold">{t('గ్రహం', 'Planet')}</th>
                    <th className="py-2 px-2 font-extrabold">{t('భావం', 'KP House')}</th>
                    <th className="py-2 px-2 font-extrabold">{t('నక్షత్రాధిపతి (Star)', 'Star Lord')}</th>
                    <th className="py-2 px-2 font-extrabold">{t('సబ్‌లార్డ్ (Sub)', 'Sub-Lord')}</th>
                    <th className="py-2 px-2.5 font-extrabold">{t('సూచించే భావాలు (Signified Houses)', 'Signified Houses')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {predictions.kpReport.planetsKP.map((pkp) => (
                    <tr key={pkp.planetId} className="odd:bg-white even:bg-amber-50/20">
                      <td className="py-1.5 px-2.5 font-extrabold text-amber-950">
                        {language === 'en' ? pkp.planetEn : pkp.planetTe}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-slate-800">H{pkp.housePlaced}</td>
                      <td className="py-1.5 px-2 text-slate-800">{language === 'en' ? pkp.starLordEn : pkp.starLordTe}</td>
                      <td className="py-1.5 px-2 font-extrabold text-emerald-900">{language === 'en' ? pkp.subLordEn : pkp.subLordTe}</td>
                      <td className="py-1.5 px-2.5 font-mono font-bold text-amber-900">
                        {pkp.signifiedHouses.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHAPTER 29: LAGNA-BASED RATNA (GEMSTONE), RUDRAKSHA & REMEDY BOOKING FUNNEL */}
          <RatnaRudrakshaAdvisorCard
            nativeName={name}
            lagnaTe={chartData.lagna.te}
            lagnaEn={chartData.lagna.en}
            guidance={predictions.ratnaAdvisor}
            whatsappConsultUrl={whatsappConsultUrl}
            onOpenBooking={onOpenBooking}
          />
        </div>

        {/* CHAPTERS 30–32: JAIMINI CHARA DASHA + SHADBALA + 5-YR TRANSIT FORECAST + 6 REAL-LIFE VERDICTS & D60 DEITY */}
        <DeepVedicPredictionsChapters
          nativeName={name}
          deepPredictions={predictions.deepPredictions}
        />

        {/* CHAPTERS 33–35: PRATYANTARDASHA + DOUBLE TRANSIT + TAJIKA VARSHAPHAL + ASHTOTTARI/YOGINI + PRINTABLE PLATES */}
        <AdvancedVedicTimingSuite
          nativeName={name}
          birthDate={birthDate}
          birthTime={birthTime}
          planets={chartData.planets}
          balanceFraction={chartData.balanceFraction}
          selectedChartStyle={jhoraChartStyle}
        />

        {/* CHAPTERS 36–37: BIRTH TIME RECTIFICATION (KUNDA/TATWA LAB) + LIVE COSMIC SKY WHEEL & 12-MONTH POWER GRAPH */}
        <CosmicRadarAndBTRSuite
          birthDate={birthDate}
          birthTime={birthTime}
          cityId={selectedCityId}
          natalLagnaIdx={chartData.planets[0]?.rashiIdx ?? 0}
          natalMoonIdx={chartData.planets[2]?.rashiIdx ?? 0}
          onApplyCorrectedBirthTime={(newTime) => setBirthTime(newTime)}
        />

        {/* Royal Pandit Blessing, Signature & Website Seal at End of Report */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 print:space-y-3 print-page-break page print-page-sheet">
          <div className="mt-2 rounded-2xl border-2 border-[#78350f] bg-gradient-to-r from-[#fffbeb] via-[#fef3c7] to-[#fde68a] p-4 sm:p-5 print:p-2.5 flex flex-col sm:flex-row print:flex-row items-center justify-between gap-3 print-card">
            <div className="space-y-0.5 text-center sm:text-left print:text-left">
              <span className="text-xs print:text-[10px] font-extrabold text-[#9a3412] tracking-wide block">
                || శుభం భూయాత్ · సర్వే జనాః సుఖినో భవంతు ||
              </span>
              <h5 className="text-base sm:text-lg print:text-xs font-extrabold text-[#451a03]">
                <a
                  href="https://www.telugujyothisham.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#451a03] hover:underline"
                >
                  బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
                </a>
              </h5>
              <p className="text-xs print:text-[10.5px] font-bold text-[#78350f]">
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
              <p className="text-[11px] print:text-[9.5px] text-slate-700">
                సాంప్రదాయ దృక్సిద్ధాంత జ్యోతిష విశ్లేషణ · వ్యక్తిగత గోప్యతా నిబంధనలకు (DPDP Act 2023) లోబడి రూపొందించబడింది.
              </p>
            </div>
            <a
              href="https://www.telugujyothisham.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center shrink-0 bg-[#451a03] hover:bg-[#5c2305] text-amber-100 px-4 py-2 print:px-3 print:py-1.5 rounded-xl border border-amber-400 block transition-colors"
            >
              <span className="text-[10px] print:text-[9px] text-amber-300 font-bold block">అధికారిక వెబ్‌సైట్ (Click to Open)</span>
              <strong translate="no" className="notranslate text-sm print:text-[11px] font-mono font-extrabold text-[#fde047] underline block mt-0.5">
                🌐 https://www.telugujyothisham.com
              </strong>
              <span className="text-[10px] print:text-[9px] text-emerald-300 font-bold block mt-0.5">
                ఉచిత తెలుగు జాతకం & పంచాంగం
              </span>
            </a>
          </div>

          <a
            href={whatsappConsultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 print:py-1.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm print:text-[11px] shadow-sm transition-colors underline print-card"
          >
            <MessageCircle size={16} />
            <span>
              {t(
                'ఈ జన్మ కుండలిని ధీరజ్ శర్మ గారికి వాట్సాప్ పంపి వ్యక్తిగత జాతక పరిశీలన పొందండి (+91 89779 86166)',
                'Send Kundali to Sri Dheeraj Sharma on WhatsApp for Personal Consultation (+91 89779 86166)'
              )}
            </span>
          </a>

          {renderPrintPageFooter('అధ్యాయం 37 · సంపూర్ణ జాతక నివేదిక ముగింపు', 30)}
        </div>
      </div>

      {/* ==========================================================================
          END-OF-REPORT JATHAKAM PDF DOWNLOAD BOX (Shown at the Last after Reading)
          ========================================================================== */}
      <div
        id="jathakam-download-end"
        className="no-print rounded-3xl border-2 border-[#E8A317] bg-gradient-to-br from-[#2C1005] via-[#4A1D0A] to-[#2C1005] text-[#FFF8E7] p-5 sm:p-7 shadow-xl space-y-4 scroll-mt-24"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-500/50 px-3 py-1 rounded-full">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>
                {t(
                  '37-అధ్యాయాల సంపూర్ణ జాతక నివేదిక పూర్తయింది',
                  'Complete 37-Chapter Jathakam Report Finished'
                )}
              </span>
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-[#fde047]">
              {isGuruAdmin
                ? t(
                    `🔒 అడ్మిన్: ${name} గారి సంపూర్ణ జాతకం PDF ఇక్కడ డౌన్‌లోడ్ చేసుకోండి`,
                    `🔒 Admin: Download ${name}'s Complete Horoscope PDF Here`
                  )
                : t(
                    `🙏 ${name} గారి వ్యక్తిగత జాతక పరిశీలన & గురువుగారి సలహా కోసం సంప్రదించండి`,
                    `🙏 Consult Guruji for ${name}'s Personalized Horoscope & Remedies`
                  )}
            </h4>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
              {isGuruAdmin
                ? t(
                    'ఈ డౌన్‌లోడ్ బటన్లు పబ్లిక్ విజిటర్లకు కనిపించవు (Hidden on public site). AI Studio మరియు అడ్మిన్ లాగిన్‌లో మాత్రమే పనిచేస్తాయి.',
                    'These download buttons are hidden from public visitors and visible only in AI Studio and Admin login.'
                  )
                : t(
                    'మీ 37 అధ్యాయాల జాతక ఫలితాల ఆధారంగా వివాహ, ఉద్యోగ, వ్యాపార, ఆరోగ్య సందేహాలు మరియు శాస్త్రోక్త పరిహారాల కొరకు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని నేరుగా వాట్సాప్‌లో సంప్రదించండి.',
                    'Connect directly with Brahmasri Jallavaram Sai Dheeraj Sharma on WhatsApp for personal horoscope consultation, remedies, and muhurtham guidance.'
                  )}
            </p>
          </div>

          {isGuruAdmin ? (
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={handleDownloadDynamicHeightPdf}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-[#fbbf24] hover:to-[#fde047] disabled:opacity-75 text-[#2C1005] border-2 border-amber-200 shadow-lg transition-all cursor-pointer"
              >
                <Download size={18} className="text-[#2C1005]" />
                <span>
                  {isGeneratingPdf && pdfProgress
                    ? t(
                        `⏳ PDF తయారవుతోంది... పేజీ ${pdfProgress.current}/${pdfProgress.total}`,
                        `⏳ Generating PDF... Page ${pdfProgress.current}/${pdfProgress.total}`
                      )
                    : t(
                        '🔒 జాతకం PDF డౌన్‌లోడ్ (Admin PDF)',
                        '🔒 Download Jathakam PDF (Admin)'
                      )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPrintableFile('a4-full', false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-amber-950/90 hover:bg-amber-900 text-amber-100 border border-amber-400/70 transition-colors cursor-pointer"
              >
                <FileText size={16} className="text-amber-300" />
                <span>{t('🔒 ఆఫ్‌లైన్ HTML సేవ్', '🔒 Save Offline HTML')}</span>
              </button>

              <button
                type="button"
                onClick={handlePrintHoroscope}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-amber-950/90 hover:bg-amber-900 text-amber-100 border border-amber-400/70 transition-colors cursor-pointer"
              >
                <Printer size={16} className="text-amber-300" />
                <span>{t('🔒 ప్రింట్ / సేవ్ PDF', '🔒 Print / Save PDF')}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
              <a
                href={whatsappConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold bg-[#25D366] hover:bg-[#1fb855] text-white border-2 border-emerald-200 shadow-lg transition-all"
              >
                <MessageCircle size={18} />
                <span>
                  {t(
                    '💬 వాట్సాప్‌లో గురువుగారిని సంప్రదించండి',
                    '💬 Consult Guruji on WhatsApp'
                  )}
                </span>
              </a>
              {onOpenBooking && (
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-[#2C1005] border border-amber-200 shadow-md cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>{t('పూజ / సంప్రదింపు బుక్ చేయండి', 'Book Consultation / Pooja')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar during multi-page PDF capture (Admin / Studio only) */}
        {isGuruAdmin && isGeneratingPdf && pdfProgress && (
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-2.5 bg-amber-950/90 rounded-full overflow-hidden border border-amber-500/40">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-150"
                style={{
                  width: `${Math.min(100, Math.round((pdfProgress.current / Math.max(1, pdfProgress.total)) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] font-bold text-amber-200">
              {t(
                `దయచేసి వేచి ఉండండి: ${pdfProgress.current} / ${pdfProgress.total} పేజీలు సిద్ధమవుతున్నాయి...`,
                `Please wait: Preparing page ${pdfProgress.current} of ${pdfProgress.total}...`
              )}
            </p>
          </div>
        )}

        {/* Synchronous Direct Save / Open Bar after generation (Admin / Studio only) */}
        {isGuruAdmin && readyPdf && !isGeneratingPdf && (
          <div className="rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 text-xs sm:text-sm">
              <strong className="text-emerald-300 font-extrabold block">
                ✅{' '}
                {t(
                  `మీ ${readyPdf.pageCount}-పేజీల సంపూర్ణ జాతకం PDF సిద్ధమైంది!`,
                  `Your ${readyPdf.pageCount}-Page Complete Jathakam PDF is Ready!`
                )}
              </strong>
              <span className="text-emerald-100/90 text-xs">
                {t(
                  'డౌన్‌లోడ్ ఆటోమేటిక్‌గా ప్రారంభం కాకపోతే క్రింది "Save PDF" బటన్ నొక్కండి.',
                  'If the download did not start automatically, tap the Save PDF button here.'
                )}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={readyPdf.blobUrl}
                download={readyPdf.fileName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-colors"
              >
                <Download size={15} />
                <span>{t('📥 ఇక్కడ సేవ్ చేయండి (Save PDF)', '📥 Save PDF Now')}</span>
              </a>
              <a
                href={readyPdf.blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm transition-colors"
              >
                <span>{t('👁️ PDF తెరవండి', '👁️ Open PDF')}</span>
              </a>
            </div>
          </div>
        )}

        {/* Clear Error Message with Instant Offline Fallback (Admin / Studio only) */}
        {isGuruAdmin && pdfError && !isGeneratingPdf && (
          <div className="rounded-2xl bg-rose-950/90 border border-rose-400 p-3.5 text-xs sm:text-sm text-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>⚠️ {pdfError}</span>
            <button
              type="button"
              onClick={() => handleDownloadPrintableFile('a4-full', false)}
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs cursor-pointer"
            >
              {t('📄 ఆఫ్‌లైన్ జాతకం వెంటనే డౌన్‌లోడ్', '📄 Download Offline File Now')}
            </button>
          </div>
        )}
      </div>

      {/* Instant Horary Prashna Kundali Widget (1-249 Sub-Lord Predictor) */}
      <PrashnaKundaliWidget onOpenBooking={onOpenBooking ? () => onOpenBooking() : undefined} />

      {/* Dynamic Fit PDF Download & Print Modal (Admin / Studio only) */}
      {isGuruAdmin && isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 border-2 border-amber-400 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-amber-200 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  {t('శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · జాతక PDF', 'Horoscope PDF Report')}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5">
                  {t(`${name} గారి సంపూర్ణ జాతక PDF సిద్ధంగా ఉంది`, `${name}'s Complete Horoscope PDF is Ready`)}
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

            <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="text-xs text-amber-950 leading-relaxed">
                <strong>{t('జీరో వైట్‌స్పేస్ (Dynamic Page Height) PDF:', 'Dynamic Content-Fit PDF (Zero Blank Space):')}</strong>
                <p className="mt-0.5 text-slate-700">
                  {t(
                    'ప్రతి పేజీ వెడల్పు 210mm గా ఉంటూ, కంటెంట్ మరియు ఫుటర్ తర్వాత కేవలం 10mm మార్జిన్‌తో ఖాళీ స్థలం లేకుండా నేరుగా PDF డౌన్‌లోడ్ అవుతుంది.',
                    'Each page is fixed at 210mm width and dynamically sized to its exact content + footer + 10mm bottom margin with zero blank space.'
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={handleDownloadDynamicHeightPdf}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#451a03] via-[#78350f] to-[#451a03] hover:from-[#5c2305] hover:to-[#5c2305] text-[#fde047] font-extrabold text-sm sm:text-base border-2 border-[#f59e0b] shadow-md transition-all cursor-pointer"
              >
                <Download size={18} />
                <span>{t('🔒 జాతకం PDF డౌన్‌లోడ్ (Dynamic Fit PDF)', '🔒 Download Horoscope PDF (Dynamic Fit)')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
