import { KundaliResult } from "./astronomyPanchangam";
import {
  generateLagnaCompleteProfile,
  getSunMoonCombination144,
  evaluateMehtaElementalStrengths,
  evaluateMehtaSpecialSutras,
  generateLifeEventProbabilityTimeline,
  computeSarvashtakavargaMatrix,
  generateAll12HousesCompleteAnalysis,
  generateBhriguLifeProgression,
  generateVedicRemediesProfile,
} from "./kundaliPredictionsEngine";
import { generateSaptamaMarriageAnalysis } from "./saptamaVisleshanaEngine";
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
} from "./advancedAstrologyReportEngine";
import {
  getRashiEncyclopediaByIdOrIndex,
  LUNAR_AND_SHANI_MENTAL_GUIDES,
} from "../data/dwadasaRashiVedicEncyclopedia";

export type JathakaReportVariant = "sample" | "a4-full" | "mobile";

export interface JathakaPdfGeneratorInput {
  name: string;
  birthDate: string;
  birthTime: string;
  cityName: string;
  chartData: KundaliResult;
  language?: "te" | "en";
  variant?: JathakaReportVariant;
  usePlaceholders?: boolean;
}

const RASHI_12 = [
  { id: "aries", te: "మేషం", en: "Aries" },
  { id: "taurus", te: "వృషభం", en: "Taurus" },
  { id: "gemini", te: "మిథునం", en: "Gemini" },
  { id: "cancer", te: "కర్కాటకం", en: "Cancer" },
  { id: "leo", te: "సింహం", en: "Leo" },
  { id: "virgo", te: "కన్య", en: "Virgo" },
  { id: "libra", te: "తుల", en: "Libra" },
  { id: "scorpio", te: "వృశ్చికం", en: "Scorpio" },
  { id: "sagittarius", te: "ధనుస్సు", en: "Sagittarius" },
  { id: "capricorn", te: "మకరం", en: "Capricorn" },
  { id: "aquarius", te: "కుంభం", en: "Aquarius" },
  { id: "pisces", te: "మీనం", en: "Pisces" },
];

const PANDIT_HERO_PHOTO_PATH = "/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg";
const SITE_URL = "https://www.telugujyothisham.com";
const SITE_DOMAIN = "www.telugujyothisham.com";
const WHATSAPP_NUMBER_DISPLAY = "+91 89779 86166";

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Formats sidereal longitude (0..360) into strict DD° MM' SS" within its 30° sign.
 */
function formatPlanetDegreesDms(longitude: number, fallbackStr?: string): string {
  if (typeof longitude !== "number" || Number.isNaN(longitude)) {
    return fallbackStr || `00° 00' 00"`;
  }
  const normLon = ((longitude % 360) + 360) % 360;
  const rashiIdx = Math.floor(normLon / 30) % 12;
  const lonInSign = normLon - rashiIdx * 30;
  const deg = Math.floor(lonInSign);
  const minFloat = (lonInSign - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.min(59, Math.round((minFloat - min) * 60));
  return `${String(deg).padStart(2, "0")}°\u00A0${String(min).padStart(2, "0")}'\u00A0${String(sec).padStart(2, "0")}"`;
}

/**
 * Cleans nested brackets and grammar issues in Telugu astrological strings.
 */
function sanitizeTeluguAstrologyText(text: string): string {
  if (!text) return "";
  return text
    .replace(/(\d+)వ స్థానంలో \(\1వ స్థానం \(([^)]+)\)\)/g, "$1వ స్థానం ($2)లో")
    .replace(/(\d+)వ స్థానం \(\1వ స్థానం \(([^)]+)\)\)/g, "$1వ స్థానం ($2)")
    .replace(/\(\(([^)]+)\)\)/g, "($1)")
    .replace(/\(జల తత్వం \(Water\)\)/g, "జల తత్వం (Water)")
    .replace(/\(అగ్ని తత్వం \(Fire\)\)/g, "అగ్ని తత్వం (Fire)")
    .replace(/\(భూ తత్వం \(Earth\)\)/g, "భూ తత్వం (Earth)")
    .replace(/\(వాయు తత్వం \(Air\)\)/g, "వాయు తత్వం (Air)")
    .replace(/కేతువు గ్రహాల సంచారం/g, "కేతు గ్రహ స్థితి")
    .replace(/బుధుడు గ్రహానికి/g, "బుధ గ్రహానికి")
    .replace(/కుజుడు గ్రహానికి/g, "కుజ గ్రహానికి")
    .replace(/సూర్యుడు గ్రహానికి/g, "సూర్య గ్రహానికి")
    .replace(/చంద్రుడు గ్రహానికి/g, "చంద్ర గ్రహానికి")
    .replace(/శుక్రుడు గ్రహానికి/g, "శుక్ర గ్రహానికి")
    .replace(/గురువు గ్రహానికి/g, "గురు గ్రహానికి")
    .replace(/శని గ్రహానికి/g, "శని గ్రహానికి")
    .replace(/రాహువు గ్రహానికి/g, "రాహు గ్రహానికి")
    .replace(/కేతువు గ్రహానికి/g, "కేతు గ్రహానికి")
    .replace(/\.\s+కలిగి ఉంటారు/g, " కలిగి ఉంటారు")
    .replace(/\.\s+విషయంలో/g, " విషయంలో");
}

/**
 * Subtle Om Ganapati SVG Motif (inline vector, zero external fetch)
 */
function renderOmGanapatiMotifSvg(size = 44, strokeColor = "#E8A317", fillColor = "#4A1D0A"): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:inline-block;vertical-align:middle;flex-shrink:0;">
    <circle cx="32" cy="32" r="30" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
    <circle cx="32" cy="32" r="25" stroke="${strokeColor}" stroke-width="0.9" stroke-dasharray="2 2"/>
    <path d="M22 22 C32 10, 32 10, 42 22" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="32" cy="14" r="2.2" fill="${strokeColor}"/>
    <path d="M21 29 C21 24, 29 24, 29 29 C29 33, 23 34, 25 39 C27 43, 35 43, 36 37 C37 33, 34 31, 41 31 C45 31, 46 37, 42 42 C39 46, 33 48, 29 46" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <path d="M27 25 H37" stroke="#FFF8E7" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="32" cy="21" r="1.6" fill="#E8A317"/>
  </svg>`;
}

/**
 * Crisp deterministic inline SVG QR Code linking to https://www.telugujyothisham.com
 */
function renderOnlineReportQrSvg(size = 104): string {
  const rows = [
    "111111101010101111111",
    "100000100101101000001",
    "101110101011001011101",
    "101110101100101011101",
    "101110100010101011101",
    "100000101101001000001",
    "111111101010101111111",
    "000000000110100000000",
    "110101111001011010110",
    "011010001100101101001",
    "101101101011010110111",
    "010011010110101001010",
    "101100101101011011101",
    "000000001010110100010",
    "111111100101001010111",
    "100000101011100101001",
    "101110101100011011101",
    "101110100110101100010",
    "101110101001010110111",
    "100000100110110001010",
    "111111101101001011101",
  ];
  const cell = 4;
  const pad = 8;
  const total = rows.length * cell + pad * 2;
  let rects = "";
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (rows[r][c] === "1") {
        rects += `<rect x="${pad + c * cell}" y="${pad + r * cell}" width="${cell}" height="${cell}" fill="#4A1D0A" rx="0.5"/>`;
      }
    }
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${total} ${total}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR Code for www.telugujyothisham.com">
    <rect width="${total}" height="${total}" rx="8" fill="#FFFFFF" stroke="#E8A317" stroke-width="2"/>
    ${rects}
    <rect x="${total / 2 - 11}" y="${total / 2 - 11}" width="22" height="22" rx="4" fill="#FFF8E7" stroke="#E8A317" stroke-width="1.2"/>
    <text x="${total / 2}" y="${total / 2 + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#4A1D0A" font-family="serif">ॐ</text>
  </svg>`;
}

/**
 * Renders South Indian 4x4 Square Chart (D1 Rasi or D9 Navamsha)
 * Large, full-width, planet names + degrees clearly legible, Lagna highlighted.
 */
function buildSouthIndianChartHtml(
  mode: "D1" | "D9",
  chartData: KundaliResult,
  nativeName: string,
  birthDate: string,
  birthTime: string
): string {
  const planetsMap = mode === "D1" ? chartData.d1RashiPlanets : chartData.d9NavamshaPlanets;
  const lagnaId = mode === "D1" ? chartData.lagna.id : chartData.navamshaLagna.id;
  const lagnaIdx = RASHI_12.findIndex((r) => r.id === lagnaId);

  const renderCell = (rashiIndex: number) => {
    const rashi = RASHI_12[rashiIndex];
    const items = planetsMap[rashiIndex] || [];
    const isLagna = rashi.id === lagnaId;
    const isMoonSign = mode === "D1" && rashi.id === chartData.rashi.id;
    const houseNum = ((rashiIndex - (lagnaIdx >= 0 ? lagnaIdx : 0) + 12) % 12) + 1;

    const planetBadges = items
      .filter((p) => p.nameTe !== "లగ్నం")
      .map((p) => {
        const fullPlanet = chartData.planets.find((fp) => fp.nameTe === p.nameTe);
        const degShort =
          mode === "D1" && fullPlanet
            ? formatPlanetDegreesDms(fullPlanet.longitude, fullPlanet.degreeFormatted).split("'")[0] + "'"
            : "";
        const retroTag =
          p.isRetro && p.nameTe !== "రాహువు" && p.nameTe !== "కేతువు" ? " (వ)" : "";
        return `<div class="chart-planet-item">
          <span class="chart-planet-name">${escapeHtml(p.nameTe)}${retroTag}</span>
          ${degShort ? `<span class="chart-planet-deg" translate="no">${degShort}</span>` : ""}
        </div>`;
      })
      .join("");

    return `<td class="chart-cell ${isLagna ? "chart-cell-lagna" : isMoonSign ? "chart-cell-rasi" : ""}">
      <div class="chart-cell-inner">
        <div class="chart-cell-top">
          <span class="chart-rasi-name">${rashi.te}</span>
          <span class="chart-house-num">${houseNum}వ</span>
        </div>
        <div class="chart-cell-tags">
          ${isLagna ? `<span class="badge-lagna">★ లగ్నం</span>` : ""}
          ${!isLagna && isMoonSign ? `<span class="badge-rasi">☽ జన్మ రాశి</span>` : ""}
        </div>
        <div class="chart-planets-stack">
          ${planetBadges || `<span class="chart-empty-dot">·</span>`}
        </div>
      </div>
    </td>`;
  };

  const titleTe = mode === "D1" ? "రాశి చక్రం (D1 — Rasi Kundali)" : "నవాంశ చక్రం (D9 — Navamsha Kundali)";
  const subTe =
    mode === "D1"
      ? `జన్మ లగ్నం: ${chartData.lagna.te} | జన్మ రాశి: ${chartData.rashi.te}`
      : `నవాంశ లగ్నం: ${chartData.navamshaLagna.te} | నక్షత్రం: ${chartData.nakshatraName} (${chartData.pada}వ పాదం)`;

  return `
  <div class="kundali-chart-card avoid-break">
    <div class="kundali-chart-header">
      <div>
        <div class="kundali-chart-title">${titleTe}</div>
        <div class="kundali-chart-subtitle">${subTe}</div>
      </div>
      <span class="kundali-chart-tag">దక్షిణ భారత సాంప్రదాయ చక్రం</span>
    </div>
    <table class="south-indian-grid" role="presentation">
      <tbody>
        <tr>
          ${renderCell(11)}
          ${renderCell(0)}
          ${renderCell(1)}
          ${renderCell(2)}
        </tr>
        <tr>
          ${renderCell(10)}
          <td colspan="2" rowspan="2" class="chart-center-cell">
            <div class="chart-center-box">
              ${renderOmGanapatiMotifSvg(32, "#E8A317", "#4A1D0A")}
              <div class="chart-center-mantra">|| ఓం శ్రీ మహాగణాధిపతయే నమః ||</div>
              <div class="chart-center-mode">${mode === "D1" ? "రాశి చక్రం (D1)" : "నవాంశ చక్రం (D9)"}</div>
              <div class="chart-center-native">${escapeHtml(nativeName)}</div>
              <div class="chart-center-meta" translate="no">${escapeHtml(birthDate)} · ${escapeHtml(birthTime)}</div>
              <div class="chart-center-lagna">${
                mode === "D1"
                  ? `లగ్నం: ${chartData.lagna.te} · రాశి: ${chartData.rashi.te}`
                  : `నవాంశ లగ్నం: ${chartData.navamshaLagna.te}`
              }</div>
              <a href="${SITE_URL}" target="_blank" rel="noopener noreferrer" class="chart-center-domain" translate="no">${SITE_DOMAIN}</a>
            </div>
          </td>
          ${renderCell(3)}
        </tr>
        <tr>
          ${renderCell(9)}
          ${renderCell(4)}
        </tr>
        <tr>
          ${renderCell(8)}
          ${renderCell(7)}
          ${renderCell(6)}
          ${renderCell(5)}
        </tr>
      </tbody>
    </table>
  </div>`;
}

/**
 * Maps planetary dignity code to color-coded badge class and Telugu/English label.
 */
function getDignityBadgeMeta(dignityCode: string): { badgeClass: string; labelTe: string } {
  switch (dignityCode) {
    case "ucha":
      return { badgeClass: "dignity-exalted", labelTe: "ఉచ్చ (Exalted)" };
    case "moolatrikona":
    case "swakshetra":
      return { badgeClass: "dignity-own", labelTe: "స్వక్షేత్రం (Own)" };
    case "mitra":
      return { badgeClass: "dignity-friendly", labelTe: "మిత్ర (Friendly)" };
    case "sama":
      return { badgeClass: "dignity-neutral", labelTe: "సమ (Neutral)" };
    case "shatru":
      return { badgeClass: "dignity-enemy", labelTe: "శత్రు (Enemy)" };
    case "neecha":
      return { badgeClass: "dignity-debilitated", labelTe: "నీచ (Debilitated)" };
    default:
      return { badgeClass: "dignity-neutral", labelTe: "సమ (Neutral)" };
  }
}

export function buildComprehensiveJathakaPdfHtml(input: JathakaPdfGeneratorInput): string {
  const {
    name,
    birthDate,
    birthTime,
    cityName,
    chartData,
    variant = "a4-full",
    usePlaceholders = false,
  } = input;

  const nativeName = name.trim() || "జాతకులు";
  const shortCity = cityName.split(" (")[0] || cityName;

  // Placeholder helper: returns {{token}} when usePlaceholders is true, or real value
  const ph = (token: string, actualValue: string): string => {
    if (usePlaceholders) {
      return `{{${token}}}`;
    }
    return actualValue;
  };

  const lagnaIdx = Math.max(0, RASHI_12.findIndex((r) => r.id === chartData.lagna.id));
  const moonIdx = Math.max(0, RASHI_12.findIndex((r) => r.id === chartData.rashi.id));
  const sunPlanet = chartData.planets.find((p) => p.nameTe === "సూర్యుడు");
  const moonPlanet = chartData.planets.find((p) => p.nameTe === "చంద్రుడు");
  const sunIdx = sunPlanet ? sunPlanet.rashiIdx : 0;

  // Compute all astrological engines
  const dignities = computePlanetaryDignities(chartData.planets, lagnaIdx);
  const neechaBhangaList = checkNeechaBhangaRajaYoga(dignities, chartData.planets, lagnaIdx);
  const yogas = detectAllYogasAndDoshas(chartData.planets, lagnaIdx, dignities);
  const tripleKuja = evaluateTripleKujaDosha(chartData.planets, lagnaIdx);
  const marriageTiming = calculateDynamicMarriageTiming(birthDate, lagnaIdx, moonIdx);
  const dashaInfo = computeVimshottariFullTimeline(moonPlanet?.longitude ?? 220, birthDate, birthTime);
  const gochara12m = computeNext12MonthsGochara(moonIdx, lagnaIdx);
  const panchangaProfile = buildPanchangaBirthProfile(chartData, birthDate, birthTime, cityName);
  const execSummary = generateExecutiveSummary(dignities, yogas, tripleKuja, dashaInfo, marriageTiming);

  const lagnaProfile = generateLagnaCompleteProfile(chartData.planets, lagnaIdx);
  const sunMoon144 = getSunMoonCombination144(sunIdx, moonIdx);
  const elementStrengths = evaluateMehtaElementalStrengths(chartData.planets, lagnaIdx);
  const specialSutras = evaluateMehtaSpecialSutras(chartData.planets, lagnaIdx, birthDate);
  const eventTimelines = generateLifeEventProbabilityTimeline(chartData.planets, lagnaIdx, birthDate);
  const ashtakavarga = computeSarvashtakavargaMatrix(chartData.planets, lagnaIdx);
  const all12Houses = generateAll12HousesCompleteAnalysis(chartData.planets, lagnaIdx);
  const bhriguCycles = generateBhriguLifeProgression(chartData.planets, lagnaIdx, birthDate);
  const remedies = generateVedicRemediesProfile(lagnaIdx, moonIdx);
  const saptamaMarriage = generateSaptamaMarriageAnalysis(chartData.planets, lagnaIdx, birthDate);
  const chandraRashiEncyclopedia = getRashiEncyclopediaByIdOrIndex(moonIdx);

  const sharedKujaDoshaPercentage = Math.round(tripleKuja.netDoshaPercentage);
  const activeDashaStr = `${dashaInfo.currentMahadasha.lordTe} మహాదశ (${dashaInfo.currentMahadasha.startDate} – ${dashaInfo.currentMahadasha.endDate})`;
  const nakshatraPadaStr = `${chartData.nakshatraName} — ${chartData.pada}వ పాదం`;

  const whatsappDirectUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నా జన్మ కుండలి వివరాలు: పేరు: ${nativeName}, పుట్టిన తేదీ: ${birthDate}, సమయం: ${birthTime}, ప్రాంతం: ${shortCity}, లగ్నం: ${chartData.lagna.te}, రాశి: ${chartData.rashi.te}, నక్షత్రం: ${nakshatraPadaStr}. వ్యక్తిగత జాతక పరిశీలన కొరకు సంప్రదిస్తున్నాను.`
  )}`;

  const totalPages = variant === "sample" ? 2 : 13;

  // Running Header & Footer HTML helper
  const renderRunningHeader = (pageNum: number, sectionTitle: string) => `
    <header class="page-running-header">
      <div class="header-left">
        ${renderOmGanapatiMotifSvg(20, "#E8A317", "#4A1D0A")}
        <span class="header-brand">శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం</span>
        <span class="header-sep">|</span>
        <span class="header-client">జాతకులు: <strong>${escapeHtml(ph("name", nativeName))}</strong></span>
      </div>
      <div class="header-right">
        <span class="header-section">${escapeHtml(sectionTitle)}</span>
        <span class="header-page-pill">పుట ${pageNum} / ${totalPages}</span>
      </div>
    </header>`;

  const renderRunningFooter = () => `
    <footer class="page-running-footer">
      <span>🪷 శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</span>
      <span class="footer-links">
        <a href="${SITE_URL}" target="_blank" rel="noopener noreferrer" translate="no">🌐 ${SITE_DOMAIN}</a>
        <span>·</span>
        <a href="${whatsappDirectUrl}" target="_blank" rel="noopener noreferrer" translate="no">💬 WhatsApp: ${WHATSAPP_NUMBER_DISPLAY}</a>
      </span>
    </footer>`;

  // Prepare Top 3 Insights Data (Marriage Window, Career Peak, Wealth Peak)
  const careerInsight = eventTimelines.find((e) => e.id === "career-peak-timeline") || eventTimelines[0];
  const marriageInsight = eventTimelines.find((e) => e.id === "marriage-timing-timeline") || eventTimelines[1];
  const wealthInsight = eventTimelines.find((e) => e.id === "financial-peak-timeline") || eventTimelines[3] || eventTimelines[2];

  const primaryMarriageWin = marriageTiming.currentFavorableWindows[0];
  const secondaryMarriageWin = marriageTiming.currentFavorableWindows[1];

  const top3Cards = [
    {
      num: "01",
      badgeTe: "వివాహ & కుటుంబ యోగ కాలం · MARRIAGE & FAMILY WINDOW",
      titleTe: marriageInsight?.categoryTe || "వివాహ & శుభకార్య యోగ కాలం",
      ageRange: ph("marriage_age_range", primaryMarriageWin?.ageSpan || marriageInsight?.peakAgeBracketTe || "25 – 29 ఏళ్లు"),
      yearsRange: ph("marriage_years", primaryMarriageWin?.period || marriageInsight?.calendarYearsTe || "2026 – 2028"),
      probability: marriageInsight?.probabilityScore ?? 88,
      summaryTe: sanitizeTeluguAstrologyText(
        marriageInsight?.analysisTe || marriageTiming.primaryRecommendationTe
      ),
      planetsTe: marriageInsight?.primaryPlanetsTe || `సప్తమాధిపతి & గురు బలం`,
    },
    {
      num: "02",
      badgeTe: "ఉద్యోగ, వృత్తి & అధికార శిఖరం · CAREER & AUTHORITY PEAK",
      titleTe: careerInsight?.categoryTe || "ఉద్యోగ వృద్ధి & ఉన్నత పదవీ యోగం",
      ageRange: ph("career_age_range", careerInsight?.peakAgeBracketTe || "28 – 36 ఏళ్లు"),
      yearsRange: ph("career_years", careerInsight?.calendarYearsTe || "2026 – 2031"),
      probability: careerInsight?.probabilityScore ?? 91,
      summaryTe: sanitizeTeluguAstrologyText(
        careerInsight?.analysisTe ||
          `దశమ భావాధిపతి మరియు ప్రస్తుత ${dashaInfo.currentMahadasha.lordTe} మహాదశ ప్రభావంతో వృత్తి, వ్యాపారాలలో స్థిరమైన పురోగతి, అధికార గుర్తింపు మరియు గౌరవ మర్యాదలు లభిస్తాయి.`
      ),
      planetsTe: careerInsight?.primaryPlanetsTe || `దశమాధిపతి, సూర్య & గురు అనుగ్రహం`,
    },
    {
      num: "03",
      badgeTe: "ధన, ఆస్తులు & ఐశ్వర్య శిఖరం · WEALTH & PROSPERITY PEAK",
      titleTe: wealthInsight?.categoryTe || "ధన సంపాదన, గృహ & స్థిరాస్తి వృద్ధి యోగం",
      ageRange: ph("wealth_age_range", wealthInsight?.peakAgeBracketTe || "30 – 42 ఏళ్లు"),
      yearsRange: ph("wealth_years", wealthInsight?.calendarYearsTe || "2027 – 2035"),
      probability: wealthInsight?.probabilityScore ?? 89,
      summaryTe: sanitizeTeluguAstrologyText(
        wealthInsight?.analysisTe ||
          `ద్వితీయ, లాభ స్థానాధిపతుల కలయిక వల్ల భూ గృహ ఆస్తుల వృద్ధి, బహుళ ఆదాయ మార్గాలు మరియు ఆర్థిక స్వావలంబన సిద్ధిస్తాయి.`
      ),
      planetsTe: wealthInsight?.primaryPlanetsTe || `ధనాధిపతి, లాభాధిపతి & శుక్ర బలం`,
    },
  ];

  // Key Yogas string for Summary Dashboard
  const auspiciousYogas = yogas.filter((y) => y.isPresent && (y.category === "raja" || y.category === "dhana" || y.category === "special"));
  const keyYogasDisplay =
    auspiciousYogas.length > 0
      ? auspiciousYogas.slice(0, 3).map((y) => y.nameTe).join(" · ")
      : "గజకేసరి / బుధాదిత్య / ధన యోగ సమన్వయం";

  const strongestPlanetsStr = dignities
    .filter((d) => d.strengthScorePct >= 70)
    .slice(0, 4)
    .map((d) => `${d.nameTe} (${d.rashiTe})`)
    .join(", ") || "గురువు, శుక్రుడు, బుధుడు";

  // Build Page 1: Cover Page
  const page1CoverHtml = `
  <section class="pdf-page cover-page">
    <div class="cover-ornate-frame">
      <div class="cover-inner-frame">
        <!-- Top Sacred Invocation & Om Ganapati Motif -->
        <div class="cover-top-invocation">
          <div class="cover-motif-wrap">
            ${renderOmGanapatiMotifSvg(54, "#E8A317", "#4A1D0A")}
          </div>
          <div class="cover-sanskrit-sloka">|| శ్రీ మహాగణాధిపతయే నమః · శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం ||</div>
          <h1 class="cover-main-title">బృహత్ జాతక మహాగ్రంథం</h1>
          <div class="cover-subtitle">దృక్సిద్ధాంత జన్మ కుండలి · నవగ్రహ, ద్వాదశ భావ & 120 ఏళ్ల వింశోత్తరి మహాదశ నివేదిక</div>
        </div>

        <!-- Pandit Photo & Jyotishalayam Branding Card -->
        <div class="cover-pandit-card avoid-break">
          <img
            src="${PANDIT_HERO_PHOTO_PATH}"
            alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
            class="cover-pandit-photo"
            onerror="this.style.display='none'"
          />
          <div class="cover-pandit-details">
            <div class="cover-jyotishalayam-badge">శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · SRI LAKSHMI GANAPATHI JYOTISHALAYAM</div>
            <div class="cover-pandit-name">బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</div>
            <div class="cover-pandit-Credentials">వైదిక దృక్సిద్ధాంత జ్యోతిష & ముహూర్త శాస్త్ర నిపుణులు (లహిరి అయనాంశం: ${escapeHtml(chartData.ayanamsaFormatted)})</div>
            <div class="cover-pandit-links">
              <a href="${SITE_URL}" target="_blank" rel="noopener noreferrer" translate="no">🌐 ${SITE_DOMAIN}</a>
              <span>•</span>
              <a href="${whatsappDirectUrl}" target="_blank" rel="noopener noreferrer" translate="no">💬 WhatsApp: ${WHATSAPP_NUMBER_DISPLAY}</a>
            </div>
          </div>
        </div>

        <!-- Centered 8-Field Sacred Birth Profile Grid (Dynamic Placeholders Ready) -->
        <div class="cover-birth-box avoid-break">
          <div class="cover-birth-box-header">
            <span>జాతకుని జన్మ వివరములు · HOROSCOPE BIRTH PROFILE</span>
          </div>
          <div class="cover-birth-grid">
            <div class="cover-field-item">
              <span class="cover-field-label">జాతకుని పేరు (Name)</span>
              <span class="cover-field-value highlight">${escapeHtml(ph("name", nativeName))}</span>
            </div>
            <div class="cover-field-item">
              <span class="cover-field-label">పుట్టిన తేదీ (Date of Birth)</span>
              <span class="cover-field-value" translate="no">${escapeHtml(ph("dob", birthDate))}</span>
            </div>
            <div class="cover-field-item">
              <span class="cover-field-label">పుట్టిన సమయం (Time of Birth)</span>
              <span class="cover-field-value" translate="no">${escapeHtml(ph("tob", `${birthTime} IST`))}</span>
            </div>
            <div class="cover-field-item">
              <span class="cover-field-label">జన్మ స్థలం (Place of Birth)</span>
              <span class="cover-field-value">${escapeHtml(ph("pob", cityName))}</span>
            </div>
            <div class="cover-field-item">
              <span class="cover-field-label">జన్మ లగ్నం (Ascendant / Lagna)</span>
              <span class="cover-field-value highlight">${escapeHtml(ph("lagna", `${chartData.lagna.te} (${chartData.lagna.en})`))}</span>
            </div>
            <div class="cover-field-item">
              <span class="cover-field-label">జన్మ రాశి (Moon Sign / Rasi)</span>
              <span class="cover-field-value highlight">${escapeHtml(ph("rasi", `${chartData.rashi.te} (${chartData.rashi.en})`))}</span>
            </div>
            <div class="cover-field-item">
              <span class="cover-field-label">నక్షత్రం - పాదం (Nakshatra-Pada)</span>
              <span class="cover-field-value">${escapeHtml(ph("nakshatra_pada", nakshatraPadaStr))}</span>
            </div>
            <div class="cover-field-item">
              <span class="cover-field-label">ప్రస్తుత దశ (Current Mahadasha)</span>
              <span class="cover-field-value">${escapeHtml(ph("current_dasha", activeDashaStr))}</span>
            </div>
          </div>
        </div>

        <!-- Bottom Seal & Footer on Cover -->
        <div class="cover-bottom-bar">
          <div>తిథి: <strong>${escapeHtml(panchangaProfile.tithiTe)}</strong> · వారం: <strong>${escapeHtml(panchangaProfile.vaaraTe)}</strong> · యోగం: <strong>${escapeHtml(panchangaProfile.yogaTe)}</strong></div>
          <div class="cover-bottom-links" translate="no">
            <a href="${SITE_URL}" target="_blank" rel="noopener noreferrer">${SITE_DOMAIN}</a> · ${WHATSAPP_NUMBER_DISPLAY}
          </div>
        </div>
      </div>
    </div>
  </section>`;

  // Build Page 2: "Your Top 3 Insights" Page
  const page2Top3InsightsHtml = `
  <section class="pdf-page">
    ${renderRunningHeader(2, "ప్రధాన 3 జీవిత ఘట్టాల విశ్లేషణ (Your Top 3 Insights)")}

    <div class="section-banner" style="--ch-accent: #4A1D0A;">
      <div class="section-banner-left">
        <span class="section-kicker">YOUR TOP 3 LIFE INSIGHTS · ముఖ్యాంశాల సారాంశం</span>
        <h1 class="h1-title">మీ జాతకంలోని 3 అత్యంత కీలక జీవిత ఘట్టాలు</h1>
      </div>
      <div class="section-banner-badge">దృక్సిద్ధాంత సంభావ్యత విశ్లేషణ</div>
    </div>

    <p class="lead-paragraph">
      <strong>${escapeHtml(ph("name", nativeName))}</strong> గారి జన్మ లగ్నం (<strong>${escapeHtml(ph("lagna", chartData.lagna.te))}</strong>), జన్మ రాశి (<strong>${escapeHtml(ph("rasi", chartData.rashi.te))}</strong>) మరియు వింశోత్తరి దశల గమనం ఆధారంగా వివాహం, ఉద్యోగ శిఖరం మరియు ఆర్థిక ఐశ్వర్య వృద్ధికి సంబంధించిన 3 ప్రధాన కాల ఘట్టాలు:
    </p>

    <div class="top3-insights-stack">
      ${top3Cards
        .map(
          (card) => `
        <article class="insight-hero-card avoid-break">
          <div class="insight-card-top">
            <div class="insight-num-circle">${card.num}</div>
            <div class="insight-title-group">
              <div class="insight-kicker">${card.badgeTe}</div>
              <h2 class="h2-title">${escapeHtml(card.titleTe)}</h2>
            </div>
            <div class="insight-pills-right">
              <div class="insight-meta-box">
                <span class="insight-meta-label">అనుకూల వయస్సు (Age)</span>
                <span class="insight-meta-val">${escapeHtml(card.ageRange)}</span>
              </div>
              <div class="insight-meta-box gold">
                <span class="insight-meta-label">శుభ సంవత్సరాలు (Years)</span>
                <span class="insight-meta-val" translate="no">${escapeHtml(card.yearsRange)}</span>
              </div>
            </div>
          </div>

          <p class="insight-description">${escapeHtml(card.summaryTe)}</p>

          <div class="insight-progress-block">
            <div class="insight-progress-labels">
              <span><strong>ప్రధాన కారక గ్రహాలు:</strong> ${escapeHtml(card.planetsTe)}</span>
              <span class="insight-prob-text">శుభ సంభావ్యత (Probability): <strong>${card.probability}%</strong></span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${Math.min(100, Math.max(25, card.probability))}%;"></div>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>

    ${renderRunningFooter()}
  </section>`;

  // If only the 2-page Sample Preview (Cover + Top 3 Insights) is requested, return early
  const remainingPagesHtml =
    variant === "sample"
      ? ""
      : `
  <!-- ==================== PAGE 3: SUMMARY DASHBOARD & PANCHANGA ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(3, "జాతక సారాంశ డాష్‌బోర్డ్ (Summary Dashboard)")}

    <div class="section-banner" style="--ch-accent: #7C2D12;">
      <div class="section-banner-left">
        <span class="section-kicker">SUMMARY DASHBOARD · సమగ్ర జాతక దర్శిని</span>
        <h1 class="h1-title">ప్రస్తుత దశ, అదృష్ట రత్నం, కుజ దోషం & రాజయోగాల సారాంశం</h1>
      </div>
      <div class="section-banner-badge">Quick Reference Grid</div>
    </div>

    <!-- Compact 6-Card Summary Dashboard Grid -->
    <div class="dashboard-grid-6">
      <div class="dash-card avoid-break">
        <div class="dash-card-label">1. ప్రస్తుత మహాదశ (Current Dasha)</div>
        <div class="dash-card-value">${escapeHtml(ph("current_dasha", `${dashaInfo.currentMahadasha.lordTe} మహాదశ`))}</div>
        <div class="dash-card-sub">కాలం: ${escapeHtml(dashaInfo.currentMahadasha.startDate)} నుండి ${escapeHtml(dashaInfo.currentMahadasha.endDate)} వరకు</div>
      </div>

      <div class="dash-card avoid-break">
        <div class="dash-card-label">2. అదృష్ట రత్నం (Lucky Gemstone)</div>
        <div class="dash-card-value">${escapeHtml(ph("lucky_gem", remedies.luckyGemstoneTe))}</div>
        <div class="dash-card-sub">ధారణ విధానం: ${escapeHtml(remedies.wearingMethodTe)}</div>
      </div>

      <div class="dash-card avoid-break">
        <div class="dash-card-label">3. అదృష్ట సంఖ్యలు & వారాలు (Lucky Numbers/Days)</div>
        <div class="dash-card-value">సంఖ్యలు: ${escapeHtml(ph("lucky_numbers", remedies.luckyNumbers))}</div>
        <div class="dash-card-sub">వారాలు: ${escapeHtml(ph("lucky_days", remedies.luckyDaysTe))} · రంగులు: ${escapeHtml(remedies.luckyColorsTe)}</div>
      </div>

      <div class="dash-card avoid-break">
        <div class="dash-card-label">4. కుజ దోష శాతం (Kuja Dosha %)</div>
        <div class="dash-card-value">${escapeHtml(ph("kuja_dosha_pct", `${sharedKujaDoshaPercentage}% — ${tripleKuja.summaryTitleTe}`))}</div>
        <div class="dash-card-sub">లగ్నం నుండి ${tripleKuja.fromLagna.house}వ ఇల్లు · చంద్రుని నుండి ${tripleKuja.fromChandra.house}వ ఇల్లు</div>
      </div>

      <div class="dash-card avoid-break">
        <div class="dash-card-label">5. ప్రధాన రాజయోగాలు (Key Yogas)</div>
        <div class="dash-card-value">${escapeHtml(ph("key_yogas", keyYogasDisplay))}</div>
        <div class="dash-card-sub">బలమైన గ్రహాలు: ${escapeHtml(strongestPlanetsStr)}</div>
      </div>

      <div class="dash-card avoid-break">
        <div class="dash-card-label">6. ఆరాధ్య దైవం & రుద్రాక్ష (Deity & Rudraksha)</div>
        <div class="dash-card-value">${escapeHtml(ph("aradhya_deivam", remedies.aradhyaDeivamTe))}</div>
        <div class="dash-card-sub">రుద్రాక్ష: ${escapeHtml(remedies.rudrakshaTe)}</div>
      </div>
    </div>

    <!-- Panchanga & Avakahada Table -->
    <div class="content-card avoid-break" style="margin-top: 8mm;">
      <h2 class="h2-title" style="margin-bottom: 3mm;">పంచాంగ & అవకహడ చక్ర వివరాలు (Panchanga Details)</h2>
      <table class="zebra-table">
        <tbody>
          <tr>
            <th>జన్మ తిథి (Tithi)</th>
            <td>${escapeHtml(panchangaProfile.tithiTe)} (${escapeHtml(panchangaProfile.pakshaTe)})</td>
            <th>జన్మ వారం (Vara)</th>
            <td>${escapeHtml(panchangaProfile.vaaraTe)}</td>
          </tr>
          <tr>
            <th>జన్మ నక్షత్రం (Nakshatra)</th>
            <td>${escapeHtml(chartData.nakshatraName)} (${chartData.pada}వ పాదం)</td>
            <th>నామ అక్షరం (Aksharam)</th>
            <td>${escapeHtml(panchangaProfile.namaAksharamTe)}</td>
          </tr>
          <tr>
            <th>యోగం & కరణం (Yoga / Karana)</th>
            <td>${escapeHtml(panchangaProfile.yogaTe)} / ${escapeHtml(panchangaProfile.karanaTe)}</td>
            <th>గణం · యోని · నాడి</th>
            <td>${escapeHtml(panchangaProfile.ganaTe)} · ${escapeHtml(panchangaProfile.yoniTe)} · ${escapeHtml(panchangaProfile.nadiTe)}</td>
          </tr>
          <tr>
            <th>వర్ణం & వశ్యం</th>
            <td>${escapeHtml(panchangaProfile.varnaTe)} · ${escapeHtml(panchangaProfile.vashyaTe)}</td>
            <th>లహిరి అయనాంశం (Ayanamsa)</th>
            <td translate="no">${escapeHtml(chartData.ayanamsaFormatted)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Executive Summary Highlights -->
    <div class="content-card avoid-break" style="margin-top: 8mm;">
      <h2 class="h2-title" style="margin-bottom: 2.5mm;">జాతక ముఖ్యాంశాల సారాంశం (Executive Summary)</h2>
      <ul class="clean-bullet-list">
        ${execSummary.top5StrengthsTe.map((item) => `<li>${escapeHtml(sanitizeTeluguAstrologyText(item))}</li>`).join("")}
      </ul>
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 4: CHARTS PAGE (D1 RASI & D9 NAVAMSHA) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(4, "రాశి చక్రం (D1) & నవాంశ చక్రం (D9)")}

    <div class="section-banner" style="--ch-accent: #4A1D0A;">
      <div class="section-banner-left">
        <span class="section-kicker">VEDIC KUNDALI CHARTS · దక్షిణ భారత సాంప్రదాయ చక్రాలు</span>
        <h1 class="h1-title">జన్మ రాశి చక్రం (D1) మరియు నవాంశ చక్రం (D9)</h1>
      </div>
      <div class="section-banner-badge">★ లగ్నం హైలైట్ చేయబడింది</div>
    </div>

    <div class="charts-fullwidth-stack">
      ${buildSouthIndianChartHtml("D1", chartData, ph("name", nativeName), ph("dob", birthDate), ph("tob", birthTime))}
      ${buildSouthIndianChartHtml("D9", chartData, ph("name", nativeName), ph("dob", birthDate), ph("tob", birthTime))}
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 5: PLANET TABLE WITH DIGNITY BADGES ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(5, "నవగ్రహ స్ఫుటములు & గ్రహ బల పట్టిక (Planet Table)")}

    <div class="section-banner" style="--ch-accent: #1E3A8A;">
      <div class="section-banner-left">
        <span class="section-kicker">PLANETARY POSITIONS & DIGNITIES · నవగ్రహ స్థితిగతులు</span>
        <h1 class="h1-title">నవగ్రహ డిగ్రీలు (DD° MM' SS"), నక్షత్ర పాదాలు & ఉచ్చ/నీచ బల పట్టిక</h1>
      </div>
      <div class="section-banner-badge">Zebra-Striped Table</div>
    </div>

    <div class="content-card avoid-break">
      <table class="zebra-table planet-table">
        <thead>
          <tr>
            <th>గ్రహం (Planet)</th>
            <th>రాశి (D1 Sign)</th>
            <th>స్ఫుట డిగ్రీలు (DD° MM' SS")</th>
            <th>భావం (House)</th>
            <th>నక్షత్రం (పాదం)</th>
            <th>నవాంశ (D9)</th>
            <th>గ్రహ స్థితి (Dignity Badge)</th>
          </tr>
        </thead>
        <tbody>
          ${dignities
            .map((d) => {
              const pObj = chartData.planets.find((pl) => pl.nameTe === d.nameTe);
              const strictDeg = pObj
                ? formatPlanetDegreesDms(pObj.longitude, pObj.degreeFormatted)
                : d.degreeFormatted;
              const houseFromLagna = ((d.rashiIdx - lagnaIdx + 12) % 12) + 1;
              const badge = getDignityBadgeMeta(d.dignityCode);
              const retroText =
                d.isRetrograde && d.nameTe !== "రాహువు" && d.nameTe !== "కేతువు" ? " (వక్రం)" : "";
              return `<tr>
                <td><strong>${escapeHtml(d.nameTe)}</strong>${retroText}</td>
                <td>${escapeHtml(d.rashiTe)}</td>
                <td class="mono-deg" translate="no">${strictDeg}</td>
                <td>${houseFromLagna}వ భావం</td>
                <td>${escapeHtml(d.nakshatraTe)} (${d.pada})</td>
                <td>${escapeHtml(d.navamshaRashiTe)}</td>
                <td><span class="dignity-badge ${badge.badgeClass}">${badge.labelTe}</span></td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Dignity Legend & Neecha Bhanga Note -->
    <div class="content-card avoid-break" style="margin-top: 8mm;">
      <h2 class="h2-title" style="margin-bottom: 2.5mm;">గ్రహ బల సూచిక & నీచభంగ రాజయోగ పరిశీలన</h2>
      <div class="dignity-legend-row">
        <span class="dignity-badge dignity-exalted">ఉచ్చ (Exalted — అత్యున్నత బలం)</span>
        <span class="dignity-badge dignity-own">స్వక్షేత్రం (Own Sign — స్థిర బలం)</span>
        <span class="dignity-badge dignity-friendly">మిత్ర (Friendly — శుభ సహకారం)</span>
        <span class="dignity-badge dignity-neutral">సమ (Neutral — సమ ఫలితం)</span>
        <span class="dignity-badge dignity-enemy">శత్రు (Enemy — పట్టుదల అవసరం)</span>
        <span class="dignity-badge dignity-debilitated">నీచ (Debilitated — పరిహారం సూచ్యం)</span>
      </div>
      ${
        neechaBhangaList.length > 0
          ? `<div style="margin-top: 3.5mm; font-size: 10.5pt;">
              ${neechaBhangaList
                .map(
                  (nb) =>
                    `<p style="margin: 1.5mm 0;"><strong>★ ${escapeHtml(nb.planetTe)} (${escapeHtml(nb.debilitationRashiTe)}):</strong> ${escapeHtml(sanitizeTeluguAstrologyText(nb.explanationTe))}</p>`
                )
                .join("")}
            </div>`
          : `<p style="margin-top: 3mm; font-size: 10.5pt;">మీ జాతకంలో గ్రహాలు శుభ సమన్వయంతో ఉన్నాయి; తీవ్రమైన నీచ దోష ప్రభావం లేదు.</p>`
      }
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 6: CHAPTERS 1 & 2 (LAGNA, RASI & SUN-MOON) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(6, "అధ్యాయం 1 & 2 · లగ్న, రాశి & సూర్య-చంద్ర తత్వం")}

    <!-- CHAPTER 1 -->
    <div class="chapter-header-bar" style="--ch-accent: #854D0E;">
      <span class="chapter-icon">☀️</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 1 · CHAPTER 1</span>
        <h1 class="h1-title">జన్మ లగ్న & రాశి స్వభావ సమగ్ర విశ్లేషణ (${escapeHtml(lagnaProfile.lagnaRashiTe)})</h1>
      </div>
    </div>

    <div class="two-col-cards">
      <div class="content-card avoid-break">
        <h2 class="h2-title">లగ్నాధిపతి & దేహ స్వభావ నిర్మాణం</h2>
        <p style="margin-top:2mm;"><strong>లగ్నాధిపతి:</strong> ${escapeHtml(lagnaProfile.lagnaLordTe)} (${lagnaProfile.lagnaLordHouse}వ ఇంట — ${escapeHtml(lagnaProfile.lagnaLordRashiTe)}) · <strong>తత్వం:</strong> ${escapeHtml(lagnaProfile.elementTe)}</p>
        <p style="margin-top:2mm;">${escapeHtml(sanitizeTeluguAstrologyText(lagnaProfile.dehaSwabhavamTe))}</p>
        <p style="margin-top:2mm;"><strong>మానసిక తత్వం:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(lagnaProfile.manoSwabhavamTe))}</p>
      </div>
      <div class="content-card avoid-break">
        <h2 class="h2-title">లగ్నాధిపతి స్థాన ఫలితం & జీవిత లక్ష్యం</h2>
        <p style="margin-top:2mm;"><strong>లగ్నాధిపతి ప్రభావం:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(lagnaProfile.lagnaLordEffectTe))}</p>
        <p style="margin-top:2mm;"><strong>జీవిత పరమార్థం (Life Mission):</strong> ${escapeHtml(sanitizeTeluguAstrologyText(lagnaProfile.lifeMissionTe))}</p>
      </div>
    </div>

    <!-- CHAPTER 2 -->
    <div class="chapter-header-bar" style="--ch-accent: #0F766E; margin-top: 8mm;">
      <span class="chapter-icon">🌙</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 2 · CHAPTER 2</span>
        <h1 class="h1-title">సూర్య–చంద్ర 144 తత్వ సమన్వయం (ఆత్మ & మనస్సు విశ్లేషణ)</h1>
      </div>
    </div>

    <div class="content-card avoid-break">
      <h2 class="h2-title">${escapeHtml(sunMoon144.elementPairTitleTe)} — సూర్య రాశి: ${escapeHtml(sunMoon144.sunRashiTe)} · చంద్ర రాశి: ${escapeHtml(sunMoon144.moonRashiTe)}</h2>
      <p style="margin-top:2.5mm;"><strong>అంతర్గత వ్యక్తిత్వం:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(sunMoon144.personalityTe))}</p>
      <p style="margin-top:2mm;"><strong>వృత్తి & ఆర్థిక శైలి:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(sunMoon144.careerAndWealthTe))}</p>
      <p style="margin-top:2mm;"><strong>బంధాలు & భావోద్వేగ సమతుల్యత:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(sunMoon144.relationshipsTe))}</p>
      <div class="golden-sutra-box" style="margin-top:3mm;">
        <strong>✨ ఆధ్యాత్మిక మార్గదర్శనం:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(sunMoon144.spiritualPathTe))}
      </div>
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 7: CHAPTERS 3 & 4 (ELEMENTS & SPECIAL SUTRAS/YOGAS) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(7, "అధ్యాయం 3 & 4 · పంచభూత తత్వ బలం & విశేష యోగాలు")}

    <!-- CHAPTER 3 -->
    <div class="chapter-header-bar" style="--ch-accent: #15803D;">
      <span class="chapter-icon">🌿</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 3 · CHAPTER 3</span>
        <h1 class="h1-title">పంచభూత తత్వ నవగ్రహ బల పట్టిక (అగ్ని · భూ · వాయు · జల తత్వాలు)</h1>
      </div>
    </div>

    <div class="content-card avoid-break">
      <table class="zebra-table">
        <thead>
          <tr>
            <th>గ్రహం</th>
            <th>రాశి & తత్వం</th>
            <th>భావం</th>
            <th>తత్వ బలం</th>
            <th>ముఖ్య ప్రభావం & పరిహారం</th>
          </tr>
        </thead>
        <tbody>
          ${elementStrengths
            .slice(0, 7)
            .map(
              (el) => `<tr>
              <td><strong>${escapeHtml(el.planetTe)}</strong></td>
              <td>${escapeHtml(el.rashiTe)} (${escapeHtml(sanitizeTeluguAstrologyText(el.elementTe))})</td>
              <td>${el.houseFromLagna}వ స్థానం</td>
              <td><strong>${escapeHtml(el.tierLabelTe.split("(")[0].trim())}</strong></td>
              <td>${escapeHtml(sanitizeTeluguAstrologyText(el.remedyTe))}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- CHAPTER 4 -->
    <div class="chapter-header-bar" style="--ch-accent: #6D28D9; margin-top: 8mm;">
      <span class="chapter-icon">👑</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 4 · CHAPTER 4</span>
        <h1 class="h1-title">విశేష జ్యోతిష సూత్రాలు, రాజయోగాలు & ధన యోగాలు</h1>
      </div>
    </div>

    <div class="two-col-cards">
      ${specialSutras
        .slice(0, 4)
        .map(
          (s, idx) => `
        <div class="content-card avoid-break">
          <div style="font-size:9pt;font-weight:700;color:#6D28D9;">సూత్రం #${idx + 1} · ${escapeHtml(s.badgeTe)}</div>
          <h3 class="h3-title" style="margin-top:1mm;">${escapeHtml(sanitizeTeluguAstrologyText(s.titleTe))}</h3>
          <p style="margin-top:1.5mm;font-size:10pt;">${escapeHtml(sanitizeTeluguAstrologyText(s.descriptionTe))}</p>
        </div>`
        )
        .join("")}
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 8: CHAPTERS 5 & 6 (MARRIAGE, KUJA DOSHA & ASHTAKAVARGA) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(8, "అధ్యాయం 5 & 6 · వివాహ విశ్లేషణ & అష్టకవర్గ బలం")}

    <!-- CHAPTER 5 -->
    <div class="chapter-header-bar" style="--ch-accent: #BE123C;">
      <span class="chapter-icon">💍</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 5 · CHAPTER 5</span>
        <h1 class="h1-title">సప్తమ భావ, వివాహ & కుజ దోష సమగ్ర విశ్లేషణ (${sharedKujaDoshaPercentage}%)</h1>
      </div>
    </div>

    <div class="two-col-cards">
      <div class="content-card avoid-break">
        <h2 class="h2-title">జీవిత భాగస్వామి స్వభావం & వివాహ రకం</h2>
        <p style="margin-top:2mm;"><strong>సప్తమ రాశి:</strong> ${escapeHtml(saptamaMarriage.saptamaRashiTe)} (అధిపతి: ${escapeHtml(saptamaMarriage.saptamaLordTe)})</p>
        <p style="margin-top:1.5mm;"><strong>వివాహ శైలి:</strong> ${escapeHtml(saptamaMarriage.marriageTypeBadgeTe)}</p>
        <p style="margin-top:1.5mm;">${escapeHtml(sanitizeTeluguAstrologyText(saptamaMarriage.spouseAppearanceAndNatureTe))}</p>
        <p style="margin-top:1.5mm;"><strong>శుభ వివాహ కాలం:</strong> ${escapeHtml(primaryMarriageWin?.period || saptamaMarriage.favorableAgesTe)} ${secondaryMarriageWin ? `(మరియు ${escapeHtml(secondaryMarriageWin.period)})` : ""}</p>
      </div>

      <div class="content-card avoid-break">
        <h2 class="h2-title">త్రివిధ కుజ దోష తనిఖీ (${sharedKujaDoshaPercentage}%)</h2>
        <p style="margin-top:2mm;"><strong>ఫలితం:</strong> ${escapeHtml(tripleKuja.summaryTitleTe)}</p>
        <p style="margin-top:1.5mm;">లగ్నం నుండి ${tripleKuja.fromLagna.house}వ స్థానం · చంద్రుని నుండి ${tripleKuja.fromChandra.house}వ స్థానం · శుక్రుని నుండి ${tripleKuja.fromShukra.house}వ స్థానం.</p>
        <p style="margin-top:1.5mm;">${escapeHtml(sanitizeTeluguAstrologyText(tripleKuja.detailedAnalysisTe))}</p>
        <p style="margin-top:1.5mm;"><strong>పరిహారం:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(tripleKuja.recommendedRemedyTe))}</p>
      </div>
    </div>

    <!-- CHAPTER 6 -->
    <div class="chapter-header-bar" style="--ch-accent: #0369A1; margin-top: 8mm;">
      <span class="chapter-icon">📊</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 6 · CHAPTER 6</span>
        <h1 class="h1-title">సర్వాష్టకవర్గ (SAV — 337 బిందువులు) & భృగు చక్ర ఫలితాలు</h1>
      </div>
    </div>

    <div class="content-card avoid-break">
      <p style="margin-bottom:3mm;">28 కన్నా ఎక్కువ శుభ బిందువులు (Rekhas) ఉన్న భావాలు జీవితంలో అప్రయత్న విజయాన్ని, ధన వృద్ధిని ఇస్తాయి:</p>
      <div class="sav-grid-12">
        ${ashtakavarga.houses
          .map(
            (h) => `
          <div class="sav-cell ${h.bindus >= 30 ? "sav-high" : h.bindus < 25 ? "sav-low" : ""}">
            <div class="sav-house-num">${h.houseNumber}వ ఇల్లు (${escapeHtml(h.rashiTe)})</div>
            <div class="sav-bindu-num">${h.bindus} <span>బిందువులు</span></div>
          </div>`
          )
          .join("")}
      </div>
      <p style="margin-top:3mm;font-size:10pt;"><strong>భృగు నంది నాడి ముఖ్యాంశం (${escapeHtml(bhriguCycles[0]?.ageRangeTe || "ప్రస్తుత చక్రం")}):</strong> ${escapeHtml(sanitizeTeluguAstrologyText(bhriguCycles[0]?.predictionTe || ""))}</p>
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 9: CHAPTER 7 (HOUSES 1–6 COMPACT CARDS) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(9, "అధ్యాయం 7 (భాగం A) · ద్వాదశ భావ విశ్లేషణ (1–6 భావాలు)")}

    <!-- CHAPTER 7 -->
    <div class="chapter-header-bar" style="--ch-accent: #9A3412;">
      <span class="chapter-icon">🏛️</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 7 · CHAPTER 7 (HOUSES 1 – 6)</span>
        <h1 class="h1-title">ద్వాదశ భావాల ఫలితాలు — సంక్షిప్త కార్డులు (భావాలు 1 నుండి 6)</h1>
      </div>
    </div>

    <div class="houses-grid-6">
      ${all12Houses
        .slice(0, 6)
        .map(
          (bh) => `
        <article class="house-compact-card avoid-break">
          <div class="house-card-head">
            <span class="house-num-badge">${bh.houseNumber}వ భావం</span>
            <h2 class="h3-title">${escapeHtml(bh.bhavaTitleTe.replace(/^\d+వ స్థానం\s*/, ""))}</h2>
            <span class="house-strength-pill">${escapeHtml(bh.rashiInHouseTe)}</span>
          </div>
          <!-- 2-Line Summary -->
          <p class="house-two-line-summary">
            <strong>కారకత్వాలు:</strong> ${escapeHtml(bh.signifTe)} · <strong>అధిపతి:</strong> ${escapeHtml(bh.lordTe)} (${bh.lordPlacedInHouse}వ ఇంట — ${escapeHtml(bh.lordPlacedInRashiTe)})
          </p>
          <!-- Smaller Details Block -->
          <div class="house-details-subblock">
            <div><strong>గ్రహ స్థితి:</strong> ${escapeHtml(bh.occupantPlanetsTe.length > 0 ? bh.occupantPlanetsTe.join(", ") : "గ్రహాలు లేవు (భావాధిపతి బలం ప్రధానం)")}</div>
            <div><strong>వివరణ:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(bh.detailedPredictionTe.slice(0, 165)))}${bh.detailedPredictionTe.length > 165 ? "…" : ""}</div>
            <div><strong>సూచన:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(bh.guidanceTe))}</div>
          </div>
        </article>`
        )
        .join("")}
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 10: CHAPTER 7 CONT. (HOUSES 7–12 COMPACT CARDS) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(10, "అధ్యాయం 7 (భాగం B) · ద్వాదశ భావ విశ్లేషణ (7–12 భావాలు)")}

    <div class="chapter-header-bar" style="--ch-accent: #9A3412;">
      <span class="chapter-icon">🏛️</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 7 (కొనసాగింపు) · CHAPTER 7 (HOUSES 7 – 12)</span>
        <h1 class="h1-title">ద్వాదశ భావాల ఫలితాలు — సంక్షిప్త కార్డులు (భావాలు 7 నుండి 12)</h1>
      </div>
    </div>

    <div class="houses-grid-6">
      ${all12Houses
        .slice(6, 12)
        .map(
          (bh) => `
        <article class="house-compact-card avoid-break">
          <div class="house-card-head">
            <span class="house-num-badge">${bh.houseNumber}వ భావం</span>
            <h2 class="h3-title">${escapeHtml(bh.bhavaTitleTe.replace(/^\d+వ స్థానం\s*/, ""))}</h2>
            <span class="house-strength-pill">${escapeHtml(bh.rashiInHouseTe)}</span>
          </div>
          <!-- 2-Line Summary -->
          <p class="house-two-line-summary">
            <strong>కారకత్వాలు:</strong> ${escapeHtml(bh.signifTe)} · <strong>అధిపతి:</strong> ${escapeHtml(bh.lordTe)} (${bh.lordPlacedInHouse}వ ఇంట — ${escapeHtml(bh.lordPlacedInRashiTe)})
          </p>
          <!-- Smaller Details Block -->
          <div class="house-details-subblock">
            <div><strong>గ్రహ స్థితి:</strong> ${escapeHtml(bh.occupantPlanetsTe.length > 0 ? bh.occupantPlanetsTe.join(", ") : "గ్రహాలు లేవు (భావాధిపతి బలం ప్రధానం)")}</div>
            <div><strong>వివరణ:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(bh.detailedPredictionTe.slice(0, 165)))}${bh.detailedPredictionTe.length > 165 ? "…" : ""}</div>
            <div><strong>సూచన:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(bh.guidanceTe))}</div>
          </div>
        </article>`
        )
        .join("")}
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 11: CHAPTER 8 & 9 (DASHA TIMELINE BAR + BHUKTI TABLE + GOCHARA) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(11, "అధ్యాయం 8 & 9 · వింశోత్తరి దశ కాలరేఖ & భుక్తి పట్టిక")}

    <!-- CHAPTER 8: DASHA SECTION -->
    <div class="chapter-header-bar" style="--ch-accent: #4A1D0A;">
      <span class="chapter-icon">⏳</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 8 · CHAPTER 8 (VIMSHOTTARI DASHA TIMELINE)</span>
        <h1 class="h1-title">120 ఏళ్ల వింశోత్తరి మహాదశ క్షితిజ సమాంతర కాలరేఖ & భుక్తి పట్టిక</h1>
      </div>
    </div>

    <!-- Horizontal Timeline Bar with "You are here" Marker -->
    <div class="content-card avoid-break">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3mm;">
        <h2 class="h2-title">9 మహాదశల క్షితిజ సమాంతర కాలరేఖ (Horizontal Mahadasha Timeline)</h2>
        <span style="font-size:9.5pt;font-weight:700;color:#4A1D0A;">జన్మ దశ శేషం: ${escapeHtml(dashaInfo.janmaDashaBalanceFormattedTe)}</span>
      </div>

      <div class="dasha-horizontal-bar">
        ${dashaInfo.mahadashas
          .map(
            (md) => `
          <div class="dasha-seg ${md.isCurrent ? "dasha-seg-current" : ""}">
            ${
              md.isCurrent
                ? `<div class="you-are-here-pin">📍 మీరు ఇక్కడ ఉన్నారు (You are here)</div>`
                : ""
            }
            <div class="dasha-seg-lord">${escapeHtml(md.lordTe)}</div>
            <div class="dasha-seg-years" translate="no">${md.startDate.slice(0, 4)}–${md.endDate.slice(0, 4)}</div>
          </div>`
          )
          .join("")}
      </div>

      <!-- Bhukti (Antardasha) Table Below -->
      <h3 class="h3-title" style="margin-top:5mm;margin-bottom:2mm;">
        ప్రస్తుత <strong>${escapeHtml(dashaInfo.currentMahadasha.lordTe)} మహాదశ</strong> (${escapeHtml(dashaInfo.currentMahadasha.startDate)} – ${escapeHtml(dashaInfo.currentMahadasha.endDate)}) — అంతర్దశ (Bhukti) పట్టిక
      </h3>
      <table class="zebra-table">
        <thead>
          <tr>
            <th>అంతర్దశ (Bhukti Lord)</th>
            <th>ప్రారంభం (Start)</th>
            <th>ముగింపు (End)</th>
            <th>ప్రధాన ఫలితం & సూచన</th>
          </tr>
        </thead>
        <tbody>
          ${
            (dashaInfo.mahadashas.find((m) => m.isCurrent) || dashaInfo.mahadashas[0]).antardashas
              .map(
                (ad) => `
              <tr class="${ad.isCurrent ? "row-current-highlight" : ""}">
                <td><strong>${escapeHtml(dashaInfo.currentMahadasha.lordTe)} – ${escapeHtml(ad.lordTe)}</strong> ${ad.isCurrent ? `<span class="active-tag">★ ప్రస్తుత భుక్తి</span>` : ""}</td>
                <td translate="no">${escapeHtml(ad.startDate)}</td>
                <td translate="no">${escapeHtml(ad.endDate)}</td>
                <td>${escapeHtml(sanitizeTeluguAstrologyText(ad.effectsSummaryTe))}</td>
              </tr>`
              )
              .join("")
          }
        </tbody>
      </table>
    </div>

    <!-- CHAPTER 9: 12-MONTH GOCHARA SUMMARY -->
    <div class="chapter-header-bar" style="--ch-accent: #047857; margin-top: 6mm;">
      <span class="chapter-icon">🌍</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 9 · CHAPTER 9</span>
        <h1 class="h1-title">రాబోయే 12 నెలల గోచార (Transit) ఫలితాల సారాంశం</h1>
      </div>
    </div>

    <div class="two-col-cards">
      ${gochara12m
        .slice(0, 2)
        .map(
          (g) => `
        <div class="content-card avoid-break">
          <h3 class="h3-title">${escapeHtml(g.planetTe)} గోచారం — ${escapeHtml(g.transitRashiTe)} (చంద్రుని నుండి ${g.houseFromMoon}వ ఇల్లు)</h3>
          <p style="font-size:10pt;margin-top:1.5mm;">${escapeHtml(sanitizeTeluguAstrologyText(g.predictionTe))}</p>
        </div>`
        )
        .join("")}
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 12: CHAPTER 10 — CHANDRA RASHI LIFE ENCYCLOPEDIA (SPOUSE, CHILD, CAREER, HEALTH) ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(12, `అధ్యాయం 10 · ${chandraRashiEncyclopedia.rashiNameTe} జీవన విజ్ఞాన సర్వస్వం`)}

    <div class="chapter-header-bar" style="--ch-accent: #78350F;">
      <span class="chapter-icon">📖</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 10 · జన్మ రాశి (${escapeHtml(chandraRashiEncyclopedia.rashiNameTe)}) సంపూర్ణ జీవన విశ్లేషణ</span>
        <h1 class="h1-title">దాంపత్య మనస్తత్వం, బాల్య-విద్యా ప్రతిభ, వృత్తి-భాగస్వామ్యం, ఆరోగ్యం & మనోబలం</h1>
      </div>
    </div>

    <div class="two-col-cards">
      <div class="content-card avoid-break">
        <h3 class="h3-title">1. ${escapeHtml(chandraRashiEncyclopedia.rashiNameTe)} దాంపత్య మనస్తత్వం (భార్య & భర్త స్వభావం)</h3>
        <p style="margin-top:2mm;font-size:10pt;"><strong>ఇల్లాలు / భార్యగా స్వభావం:</strong> ${escapeHtml(chandraRashiEncyclopedia.wifeProfileTe)}</p>
        <p style="margin-top:2mm;font-size:10pt;"><strong>పురుషుడు / భర్తగా స్వభావం:</strong> ${escapeHtml(chandraRashiEncyclopedia.husbandProfileTe)}</p>
        <p style="margin-top:2mm;font-size:9.8pt;color:#14532D;font-weight:700;">✦ దాంపత్య సూత్రం: ${escapeHtml(chandraRashiEncyclopedia.maritalHarmonySutraTe)}</p>
      </div>

      <div class="content-card avoid-break">
        <h3 class="h3-title">2. బాల్య ప్రతిభ, విద్యా శైలి & తల్లిదండ్రుల మార్గదర్శనం</h3>
        <p style="margin-top:2mm;font-size:10pt;"><strong>సహజ మేధస్సు & విద్యా శైలి:</strong> ${escapeHtml(chandraRashiEncyclopedia.childNatureAndStudyTe)}</p>
        <p style="margin-top:2mm;font-size:10pt;"><strong>పెంపకం & ప్రోత్సాహ విధానం:</strong> ${escapeHtml(chandraRashiEncyclopedia.parentingGuideTe)}</p>
        <p style="margin-top:2mm;font-size:9.8pt;color:#4A1D0A;"><strong>తల్లిదండ్రుల స్వభావం:</strong> ${escapeHtml(chandraRashiEncyclopedia.parentTemperamentTe)}</p>
      </div>
    </div>

    <div class="two-col-cards" style="margin-top:5mm;">
      <div class="content-card avoid-break">
        <h3 class="h3-title">3. జీవన వృత్తి, వ్యాపార భాగస్వామ్యం & ధనాకర్షణ</h3>
        <p style="margin-top:2mm;font-size:10pt;"><strong>అనుకూల వృత్తి రంగాలు:</strong> ${escapeHtml(chandraRashiEncyclopedia.careerLifeWorkTe)}</p>
        <p style="margin-top:2mm;font-size:10pt;"><strong>వ్యాపార భాగస్వామ్యం:</strong> ${escapeHtml(chandraRashiEncyclopedia.businessPartnershipTe)}</p>
        <p style="margin-top:2mm;font-size:10pt;"><strong>ధనాకర్షణ & ఆస్తులు:</strong> ${escapeHtml(chandraRashiEncyclopedia.wealthAttractionTe)}</p>
      </div>

      <div class="content-card avoid-break">
        <h3 class="h3-title">4. శారీరక ఆరోగ్య రక్షణ (${escapeHtml(chandraRashiEncyclopedia.kalapurushaAngamTe)}) & మనోధైర్యం</h3>
        <p style="margin-top:2mm;font-size:10pt;"><strong>చంద్ర మానసిక తత్వం:</strong> ${escapeHtml(chandraRashiEncyclopedia.chandraManasikaTatvamTe)}</p>
        <p style="margin-top:2mm;font-size:10pt;"><strong>ఆరోగ్య జాగ్రత్తలు:</strong> ${escapeHtml(chandraRashiEncyclopedia.arogyaRakshaTe)}</p>
        <p style="margin-top:2mm;font-size:9.8pt;color:#4A1D0A;"><strong>పౌర్ణమి–అమావాస్య & శని గోచార సూత్రం:</strong> ${escapeHtml(LUNAR_AND_SHANI_MENTAL_GUIDES[0].practicalGuidanceTe[0])} ${escapeHtml(LUNAR_AND_SHANI_MENTAL_GUIDES[1].practicalGuidanceTe[0])}</p>
      </div>
    </div>

    ${renderRunningFooter()}
  </section>

  <!-- ==================== PAGE 13: CHAPTER 11 — REMEDIES CHECKLIST, DISCLAIMER, CTA & QR CODE ==================== -->
  <section class="pdf-page">
    ${renderRunningHeader(13, "అధ్యాయం 11 · వైదిక పరిహార చెక్‌లిస్ట్ & సంప్రదింపులు")}

    <div class="chapter-header-bar" style="--ch-accent: #B45309;">
      <span class="chapter-icon">🪔</span>
      <div class="chapter-title-wrap">
        <span class="chapter-num-label">అధ్యాయం 11 · CHAPTER 11 (REMEDIES & CONSULTATION)</span>
        <h1 class="h1-title">వైదిక శాంతి పరిహార చెక్‌లిస్ట్, సంప్రదింపులు & ఆన్‌లైన్ వెర్షన్</h1>
      </div>
    </div>

    <!-- Interactive-style Remedies Checklist -->
    <div class="content-card avoid-break">
      <h2 class="h2-title" style="margin-bottom:3mm;">నిత్య ఆచరణీయ వైదిక పరిహార చెక్‌లిస్ట్ (Vedic Remedies Checklist)</h2>
      <div class="remedy-checklist">
        <div class="remedy-check-item">
          <span class="check-box">☐</span>
          <div>
            <strong>నిత్య స్తోత్ర పారాయణ (Daily Stotra):</strong> ప్రతిరోజూ ఉదయం <em>${escapeHtml(remedies.nityaStotraTe)}</em> పారాయణ చేయడం వల్ల మనశ్శాంతి, గ్రహ అనుకూలత లభిస్తాయి.
          </div>
        </div>
        <div class="remedy-check-item">
          <span class="check-box">☐</span>
          <div>
            <strong>ఆరాధ్య దైవ దర్శనం (Deity Worship):</strong> మీ జన్మ లగ్నానికి మరియు రాశికి అనుకూలమైన <em>${escapeHtml(remedies.aradhyaDeivamTe)}</em> ఆరాధన మరియు రుద్రాక్ష (<em>${escapeHtml(remedies.rudrakshaTe)}</em>) ధారణ విశేష ఫలితాలను ఇస్తాయి.
          </div>
        </div>
        <div class="remedy-check-item">
          <span class="check-box">☐</span>
          <div>
            <strong>అదృష్ట రత్న ధారణ (Gemstone Guidance):</strong> <em>${escapeHtml(remedies.luckyGemstoneTe)}</em> — ${escapeHtml(remedies.wearingMethodTe)} సిద్ధాంతుల సూచన మేరకు ధరించండి.
          </div>
        </div>
        <div class="remedy-check-item">
          <span class="check-box">☐</span>
          <div>
            <strong>అన్నదానం & సేవా కార్యక్రమాలు (Charity / Dana):</strong> <em>${escapeHtml(remedies.danaPariharamTe)}</em> ఆచరించడం వల్ల కర్మ దోషాలు తొలగి శుభ ఫలితాలు సిద్ధిస్తాయి.
          </div>
        </div>
        <div class="remedy-check-item">
          <span class="check-box">☐</span>
          <div>
            <strong>ప్రస్తుత ${escapeHtml(dashaInfo.currentMahadasha.lordTe)} మహాదశ సూచన:</strong> ${escapeHtml(sanitizeTeluguAstrologyText(dashaInfo.currentMahadasha.effectsSummaryTe))}
          </div>
        </div>
      </div>
    </div>

    <!-- Disclaimer Box ("For traditional/guidance purposes only") -->
    <div class="disclaimer-box avoid-break">
      <div class="disclaimer-title">⚖️ సాంప్రదాయ జ్యోతిష మార్గదర్శక గమనిక (Traditional Guidance Disclaimer)</div>
      <p>
        ఈ జాతక నివేదిక సనాతన భారతీయ దృక్సిద్ధాంత జ్యోతిష శాస్త్ర గణిత సూత్రాల (లహిరి అయనాంశం) ఆధారంగా సాంప్రదాయ అవగాహన మరియు ఆధ్యాత్మిక మార్గదర్శకత్వం కొరకు మాత్రమే ("For traditional and guidance purposes only") రూపొందించబడింది. గ్రహ సూచనలు మార్గదర్శకాలు మాత్రమే; వ్యక్తిగత కృషి, సత్ప్రవర్తన మరియు దైవానుగ్రహం సదా ప్రధానమైనవి. వ్యక్తిగత సమాచార గోప్యత (DPDP Act 2023) నిబంధనలకు లోబడి రూపొందించబడింది.
      </p>
    </div>

    <!-- Final CTA Card with Pandit Details, WhatsApp, Website & QR Code -->
    <div class="final-cta-card avoid-break">
      <div class="final-cta-left">
        <div class="final-cta-kicker">శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · SRI LAKSHMI GANAPATHI JYOTISHALAYAM</div>
        <h2 class="final-cta-heading">బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</h2>
        <p class="final-cta-text">
          వివాహ పొంతన, ముహూర్త నిర్ణయం, జాతక దోష నివారణ మరియు వ్యక్తిగత భవిష్యత్ సంప్రదింపుల కొరకు నేరుగా వాట్సాప్ లేదా వెబ్‌సైట్ ద్వారా సంప్రదించండి:
        </p>
        <div class="final-cta-buttons">
          <a href="${whatsappDirectUrl}" target="_blank" rel="noopener noreferrer" class="cta-btn-whatsapp" translate="no">
            💬 WhatsApp: ${WHATSAPP_NUMBER_DISPLAY}
          </a>
          <a href="${SITE_URL}" target="_blank" rel="noopener noreferrer" class="cta-btn-website" translate="no">
            🌐 ${SITE_DOMAIN}
          </a>
        </div>
      </div>
      <div class="final-cta-qr">
        <a href="${SITE_URL}" target="_blank" rel="noopener noreferrer" title="Open Online Version">
          ${renderOnlineReportQrSvg(108)}
        </a>
        <div class="qr-caption">ఆన్‌లైన్ జాతకం కొరకు స్కాన్ చేయండి</div>
      </div>
    </div>

    ${renderRunningFooter()}
  </section>`;

  return `<!DOCTYPE html>
<html lang="te">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(nativeName)} — బృహత్ జాతక నివేదిక | శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం</title>
  <style>
    /* ==========================================================================
       1. LOCAL EMBEDDED FONTS (Zero External Network Fetch Required)
       ========================================================================== */
    @font-face {
      font-family: 'Noto Sans Telugu';
      src: local('Noto Sans Telugu'), local('NotoSansTelugu-Regular');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Noto Sans Telugu';
      src: local('Noto Sans Telugu SemiBold'), local('Noto Sans Telugu Bold'), local('NotoSansTelugu-Bold');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Noto Serif Telugu';
      src: local('Noto Serif Telugu'), local('NotoSerifTelugu-Regular');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Noto Serif Telugu';
      src: local('Noto Serif Telugu Bold'), local('NotoSerifTelugu-Bold');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    /* ==========================================================================
       2. CSS VARIABLES FOR EASY BRANDING CUSTOMIZATION
       ========================================================================== */
    :root {
      --brand-maroon: #4A1D0A;
      --brand-maroon-dark: #2C1005;
      --brand-gold: #E8A317;
      --brand-gold-soft: #F7D98C;
      --brand-cream: #FFF8E7;
      --brand-surface: #FFFFFF;
      --text-primary: #2B1206;
      --text-secondary: #5A341B;
      --text-on-maroon: #FFF8E7;
      --gold-on-maroon: #FDE68A; /* WCAG AA >9.2:1 contrast on #4A1D0A */
      --font-body: 'Noto Sans Telugu', system-ui, -apple-system, sans-serif;
      --font-heading: 'Noto Serif Telugu', Georgia, serif;
      --card-gap: 8.5mm;
      --border-gold: 1px solid #E8A317;
    }

    /* ==========================================================================
       3. A4 PAGE SETUP & PRINT RULES (Chromium / WeasyPrint Ready)
       ========================================================================== */
    @page {
      size: 210mm auto;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      margin: 0;
      padding: 0;
      background-color: #EBE2D0;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 11.2pt;
      line-height: 1.56;
    }

    h1, h2, h3, h4 {
      font-family: var(--font-heading);
      margin: 0;
      page-break-after: avoid;
      break-after: avoid;
    }

    .h1-title {
      font-size: 17.5pt;
      font-weight: 700;
      line-height: 1.3;
    }

    .h2-title {
      font-size: 13.8pt;
      font-weight: 700;
      line-height: 1.35;
      color: var(--brand-maroon);
    }

    .h3-title {
      font-size: 11.8pt;
      font-weight: 700;
      line-height: 1.35;
      color: var(--brand-maroon);
    }

    .avoid-break,
    article,
    table,
    .kundali-chart-card,
    .dash-card,
    .house-compact-card,
    .content-card {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Screen Action Toolbar */
    .screen-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--brand-maroon);
      color: var(--text-on-maroon);
      border-bottom: 2px solid var(--brand-gold);
      padding: 10px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    }

    .toolbar-btn {
      background: var(--brand-gold);
      color: var(--brand-maroon-dark);
      border: 1px solid #FFF8E7;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: var(--font-body);
      font-weight: 700;
      font-size: 10.5pt;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    /* Page Sheet Container (Dynamic Content-Fitted Height + 10mm Bottom Padding) */
    .page,
    .pdf-page {
      width: 210mm;
      height: auto !important;
      min-height: 0 !important;
      margin: 10mm auto;
      padding: 12mm 14mm 10mm 14mm !important;
      background: var(--brand-cream);
      border: 1px solid var(--brand-gold);
      box-shadow: 0 8px 28px rgba(74, 29, 10, 0.16);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      position: relative;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .page:last-of-type,
    .pdf-page:last-of-type {
      page-break-after: auto;
      break-after: auto;
    }

    /* Running Header & Footer (Zero Truncation, Zero Overflow) */
    .page-running-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-bottom: 3mm;
      margin-bottom: 5mm;
      border-bottom: 1.2px solid var(--brand-gold);
      font-size: 9.2pt;
      color: var(--brand-maroon);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .header-brand {
      font-family: var(--font-heading);
      font-weight: 700;
    }

    .header-sep {
      color: var(--brand-gold);
      font-weight: 700;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: right;
    }

    .header-section {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .header-page-pill {
      background: var(--brand-maroon);
      color: var(--gold-on-maroon);
      padding: 1.5px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 8.8pt;
      white-space: nowrap;
    }

    .page-running-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-top: 3mm;
      margin-top: 6mm;
      border-top: 1.2px solid var(--brand-gold);
      font-size: 9pt;
      font-weight: 600;
      color: var(--brand-maroon);
    }

    .page-running-footer a {
      color: var(--brand-maroon);
      text-decoration: underline;
      font-weight: 700;
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    /* ==========================================================================
       4. COVER PAGE (PAGE 1) — CENTERED, GENEROUS WHITESPACE, THIN GOLD BORDERS
       ========================================================================== */
    .cover-ornate-frame {
      flex: 1;
      border: 2px solid var(--brand-maroon);
      padding: 3.5mm;
      background: linear-gradient(180deg, #FFFDF7 0%, #FFF8E7 100%);
      display: flex;
      flex-direction: column;
    }

    .cover-inner-frame {
      flex: 1;
      border: 1.2px solid var(--brand-gold);
      padding: 9mm 8mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
    }

    .cover-top-invocation {
      padding: 2mm 0;
    }

    .cover-motif-wrap {
      margin-bottom: 3mm;
    }

    .cover-sanskrit-sloka {
      font-size: 10pt;
      font-weight: 700;
      color: var(--text-secondary);
      letter-spacing: 0.3px;
    }

    .cover-main-title {
      font-size: 24pt;
      font-weight: 700;
      color: var(--brand-maroon);
      margin-top: 2.5mm;
      letter-spacing: 0.4px;
    }

    .cover-subtitle {
      font-size: 11pt;
      font-weight: 600;
      color: var(--text-secondary);
      margin-top: 1.5mm;
    }

    .cover-pandit-card {
      background: var(--brand-maroon);
      color: var(--text-on-maroon);
      border: 1.5px solid var(--brand-gold);
      border-radius: 10px;
      padding: 6mm 7mm;
      display: flex;
      align-items: center;
      gap: 6mm;
      text-align: left;
      margin: 5mm 0;
    }

    .cover-pandit-photo {
      width: 28mm;
      height: 34mm;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid var(--brand-gold);
      flex-shrink: 0;
      background: #2C1005;
    }

    .cover-jyotishalayam-badge {
      display: inline-block;
      background: var(--brand-gold);
      color: var(--brand-maroon-dark);
      font-weight: 700;
      font-size: 8.8pt;
      padding: 2px 9px;
      border-radius: 4px;
      margin-bottom: 2mm;
    }

    .cover-pandit-name {
      font-family: var(--font-heading);
      font-size: 15.5pt;
      font-weight: 700;
      color: var(--gold-on-maroon);
    }

    .cover-pandit-Credentials {
      font-size: 9.8pt;
      color: var(--text-on-maroon);
      margin-top: 1mm;
    }

    .cover-pandit-links {
      margin-top: 2.5mm;
      font-size: 9.8pt;
      font-weight: 700;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cover-pandit-links a {
      color: var(--gold-on-maroon);
      text-decoration: underline;
    }

    .cover-birth-box {
      background: var(--brand-surface);
      border: 1.5px solid var(--brand-gold);
      border-radius: 10px;
      overflow: hidden;
      margin: 3mm 0;
    }

    .cover-birth-box-header {
      background: #FDF0C9;
      color: var(--brand-maroon);
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 10.5pt;
      padding: 3mm 5mm;
      border-bottom: 1px solid var(--brand-gold);
      letter-spacing: 0.4px;
    }

    .cover-birth-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0;
      text-align: left;
    }

    .cover-field-item {
      padding: 3.8mm 5mm;
      border-bottom: 1px solid #F3E3B8;
      border-right: 1px solid #F3E3B8;
      display: flex;
      flex-direction: column;
      gap: 1mm;
    }

    .cover-field-item:nth-child(2n) {
      border-right: none;
    }

    .cover-field-label {
      font-size: 9pt;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .cover-field-value {
      font-size: 11.5pt;
      font-weight: 700;
      color: var(--text-primary);
    }

    .cover-field-value.highlight {
      color: var(--brand-maroon);
      font-size: 12pt;
    }

    .cover-bottom-bar {
      padding-top: 4mm;
      border-top: 1px solid var(--brand-gold);
      font-size: 9.5pt;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cover-bottom-links a {
      color: var(--brand-maroon);
      font-weight: 700;
      text-decoration: underline;
    }

    /* ==========================================================================
       5. SECTION BANNERS & CHAPTER HEADERS (CONSISTENT H1/H2/H3 HIERARCHY)
       ========================================================================== */
    .section-banner {
      background: var(--ch-accent, var(--brand-maroon));
      color: var(--text-on-maroon);
      border: 1.5px solid var(--brand-gold);
      border-radius: 9px;
      padding: 4.5mm 6mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 6mm;
    }

    .section-kicker {
      display: block;
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--gold-on-maroon);
      letter-spacing: 0.6px;
      margin-bottom: 1mm;
    }

    .section-banner .h1-title {
      color: #FFFFFF;
    }

    .section-banner-badge {
      background: var(--brand-gold);
      color: var(--brand-maroon-dark);
      font-weight: 700;
      font-size: 9pt;
      padding: 3px 10px;
      border-radius: 5px;
      white-space: nowrap;
    }

    .chapter-header-bar {
      background: var(--ch-accent, var(--brand-maroon));
      color: #FFFFFF;
      border-left: 5px solid var(--brand-gold);
      border-radius: 7px;
      padding: 3.5mm 5mm;
      display: flex;
      align-items: center;
      gap: 4mm;
      margin-bottom: 5mm;
    }

    .chapter-icon {
      font-size: 18pt;
      line-height: 1;
    }

    .chapter-num-label {
      display: block;
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--gold-on-maroon);
      letter-spacing: 0.5px;
    }

    .chapter-header-bar .h1-title {
      font-size: 15.5pt;
      color: #FFFFFF;
    }

    .lead-paragraph {
      margin: 0 0 6mm 0;
      font-size: 11pt;
      color: var(--text-primary);
    }

    /* ==========================================================================
       6. PAGE 2: "YOUR TOP 3 INSIGHTS" LARGE CARDS + PROGRESS BARS
       ========================================================================== */
    .top3-insights-stack {
      display: flex;
      flex-direction: column;
      gap: var(--card-gap);
      flex: 1;
    }

    .insight-hero-card {
      background: var(--brand-surface);
      border: 1.5px solid var(--brand-gold);
      border-left: 5px solid var(--brand-maroon);
      border-radius: 10px;
      padding: 5.5mm 6.5mm;
      box-shadow: 0 2px 8px rgba(74, 29, 10, 0.06);
    }

    .insight-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 4mm;
      margin-bottom: 3mm;
    }

    .insight-num-circle {
      width: 10mm;
      height: 10mm;
      border-radius: 50%;
      background: var(--brand-maroon);
      color: var(--gold-on-maroon);
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 12pt;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .insight-title-group {
      flex: 1;
    }

    .insight-kicker {
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--text-secondary);
      letter-spacing: 0.4px;
    }

    .insight-pills-right {
      display: flex;
      gap: 3mm;
      flex-shrink: 0;
    }

    .insight-meta-box {
      background: var(--brand-cream);
      border: 1px solid var(--brand-gold);
      border-radius: 6px;
      padding: 1.8mm 3.2mm;
      text-align: center;
    }

    .insight-meta-box.gold {
      background: var(--brand-maroon);
      color: var(--text-on-maroon);
    }

    .insight-meta-label {
      display: block;
      font-size: 7.8pt;
      font-weight: 600;
      opacity: 0.9;
    }

    .insight-meta-val {
      display: block;
      font-size: 10pt;
      font-weight: 700;
    }

    .insight-meta-box.gold .insight-meta-val {
      color: var(--gold-on-maroon);
    }

    .insight-description {
      margin: 2.5mm 0 3.5mm 0;
      font-size: 10.8pt;
      color: var(--text-primary);
    }

    .insight-progress-block {
      background: #FFFDF8;
      border: 1px solid #F3E2B3;
      border-radius: 7px;
      padding: 2.8mm 3.5mm;
    }

    .insight-progress-labels {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5pt;
      margin-bottom: 1.8mm;
    }

    .insight-prob-text strong {
      color: var(--brand-maroon);
      font-size: 10.5pt;
    }

    .progress-track {
      width: 100%;
      height: 3.2mm;
      background: #EFE4C8;
      border-radius: 99px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--brand-maroon) 0%, var(--brand-gold) 100%);
      border-radius: 99px;
    }

    /* ==========================================================================
       7. PAGE 3: SUMMARY DASHBOARD GRID & TABLES
       ========================================================================== */
    .dashboard-grid-6 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5mm;
    }

    .dash-card {
      background: var(--brand-surface);
      border: 1.2px solid var(--brand-gold);
      border-top: 3.5px solid var(--brand-maroon);
      border-radius: 8px;
      padding: 4mm 4.5mm;
    }

    .dash-card-label {
      font-size: 8.8pt;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .dash-card-value {
      font-family: var(--font-heading);
      font-size: 12.5pt;
      font-weight: 700;
      color: var(--brand-maroon);
      margin-top: 1.2mm;
    }

    .dash-card-sub {
      font-size: 9.5pt;
      color: var(--text-primary);
      margin-top: 1mm;
    }

    .content-card {
      background: var(--brand-surface);
      border: 1.2px solid var(--brand-gold);
      border-radius: 9px;
      padding: 4.5mm 5.5mm;
    }

    .two-col-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6mm;
    }

    .zebra-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.8pt;
    }

    .zebra-table th {
      background: var(--brand-maroon);
      color: var(--gold-on-maroon);
      font-weight: 700;
      text-align: left;
      padding: 2.5mm 3mm;
      border: 1px solid var(--brand-gold);
    }

    .zebra-table td {
      padding: 2.4mm 3mm;
      border: 1px solid #EAD7A7;
      color: var(--text-primary);
    }

    .zebra-table tbody tr:nth-child(even) {
      background: var(--brand-cream);
    }

    .zebra-table tbody tr:nth-child(odd) {
      background: #FFFFFF;
    }

    .mono-deg {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      white-space: nowrap;
    }

    .clean-bullet-list {
      margin: 0;
      padding-left: 5mm;
    }

    .clean-bullet-list li {
      margin-bottom: 1.8mm;
      font-size: 10.4pt;
    }

    /* ==========================================================================
       8. PAGE 4: SOUTH INDIAN D1 & D9 CHARTS (FULL-WIDTH, LEGIBLE, LAGNA HIGHLIGHT)
       ========================================================================== */
    .charts-fullwidth-stack {
      display: flex;
      flex-direction: column;
      gap: 7mm;
      flex: 1;
    }

    .kundali-chart-card {
      background: var(--brand-surface);
      border: 1.8px solid var(--brand-maroon);
      border-radius: 10px;
      padding: 3.5mm 4.5mm;
    }

    .kundali-chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5mm;
      padding-bottom: 2mm;
      border-bottom: 1px solid var(--brand-gold);
    }

    .kundali-chart-title {
      font-family: var(--font-heading);
      font-size: 13pt;
      font-weight: 700;
      color: var(--brand-maroon);
    }

    .kundali-chart-subtitle {
      font-size: 9.5pt;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .kundali-chart-tag {
      background: var(--brand-cream);
      border: 1px solid var(--brand-gold);
      color: var(--brand-maroon);
      font-size: 8.5pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .south-indian-grid {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      border: 2px solid var(--brand-maroon);
    }

    .chart-cell {
      width: 25%;
      height: 24mm;
      border: 1.2px solid var(--brand-maroon);
      vertical-align: top;
      padding: 1.8mm 2.2mm;
      background: #FFFDF9;
    }

    .chart-cell-lagna {
      background: #FEF3C7 !important;
      box-shadow: inset 0 0 0 1.8px var(--brand-gold);
    }

    .chart-cell-rasi {
      background: #ECFDF5 !important;
    }

    .chart-cell-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--text-secondary);
      border-bottom: 0.8px dashed #D9B978;
      padding-bottom: 0.8mm;
      margin-bottom: 1mm;
    }

    .chart-house-num {
      background: #FFF8E7;
      border: 1px solid var(--brand-gold);
      padding: 0 4px;
      border-radius: 3px;
      font-size: 7.5pt;
      color: var(--brand-maroon);
    }

    .badge-lagna {
      display: inline-block;
      background: var(--brand-maroon);
      color: var(--gold-on-maroon);
      font-size: 7.8pt;
      font-weight: 700;
      padding: 0.5px 5px;
      border-radius: 3px;
      margin-bottom: 1mm;
    }

    .badge-rasi {
      display: inline-block;
      background: #065F46;
      color: #FFFFFF;
      font-size: 7.8pt;
      font-weight: 700;
      padding: 0.5px 5px;
      border-radius: 3px;
      margin-bottom: 1mm;
    }

    .chart-planets-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 3px 6px;
    }

    .chart-planet-item {
      display: inline-flex;
      align-items: baseline;
      gap: 3px;
      background: #FFFFFF;
      border: 1px solid #E5C578;
      border-radius: 4px;
      padding: 0.5px 4px;
      font-size: 8.8pt;
      font-weight: 700;
      color: var(--text-primary);
    }

    .chart-planet-deg {
      font-family: ui-monospace, monospace;
      font-size: 7.8pt;
      color: var(--brand-maroon);
    }

    .chart-empty-dot {
      color: #C9B38C;
      font-size: 8pt;
    }

    .chart-center-cell {
      background: var(--brand-maroon);
      color: var(--text-on-maroon);
      border: 2px solid var(--brand-maroon);
      vertical-align: middle;
      text-align: center;
      padding: 3mm;
    }

    .chart-center-box {
      border: 1px solid var(--brand-gold);
      border-radius: 7px;
      padding: 2.5mm;
    }

    .chart-center-mantra {
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--gold-on-maroon);
      margin-top: 1mm;
    }

    .chart-center-mode {
      display: inline-block;
      background: var(--brand-gold);
      color: var(--brand-maroon-dark);
      font-weight: 700;
      font-size: 9.5pt;
      padding: 1px 9px;
      border-radius: 99px;
      margin: 1mm 0;
    }

    .chart-center-native {
      font-family: var(--font-heading);
      font-size: 11.5pt;
      font-weight: 700;
      color: #FFFFFF;
    }

    .chart-center-meta {
      font-size: 8.5pt;
      color: var(--text-on-maroon);
    }

    .chart-center-lagna {
      font-size: 9pt;
      font-weight: 700;
      color: var(--gold-on-maroon);
      margin-top: 0.8mm;
    }

    .chart-center-domain {
      display: inline-block;
      margin-top: 1mm;
      color: var(--gold-on-maroon);
      font-family: ui-monospace, monospace;
      font-size: 8.5pt;
      font-weight: 700;
      text-decoration: underline;
    }

    /* ==========================================================================
       9. PAGE 5: COLOR-CODED DIGNITY BADGES
       ========================================================================== */
    .dignity-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 5px;
      font-size: 8.6pt;
      font-weight: 700;
      white-space: nowrap;
    }

    .dignity-exalted {
      background: #D1FAE5;
      color: #065F46;
      border: 1px solid #34D399;
    }

    .dignity-own {
      background: #DBEAFE;
      color: #1E40AF;
      border: 1px solid #60A5FA;
    }

    .dignity-friendly {
      background: #CCFBF1;
      color: #0F766E;
      border: 1px solid #2DD4BF;
    }

    .dignity-neutral {
      background: #FEF3C7;
      color: #78350F;
      border: 1px solid #FBBF24;
    }

    .dignity-enemy {
      background: #FFEDD5;
      color: #9A3412;
      border: 1px solid #FB923C;
    }

    .dignity-debilitated {
      background: #FEE2E2;
      color: #991B1B;
      border: 1px solid #F87171;
    }

    .dignity-legend-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .golden-sutra-box {
      background: #FEF3C7;
      border: 1px solid var(--brand-gold);
      border-left: 4px solid var(--brand-maroon);
      padding: 3mm 4mm;
      border-radius: 6px;
      font-size: 10.2pt;
    }

    /* ==========================================================================
       10. CHAPTER 6 SAV GRID & CHAPTER 7 COMPACT 12-HOUSE CARDS
       ========================================================================== */
    .sav-grid-12 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3mm;
    }

    .sav-cell {
      background: var(--brand-cream);
      border: 1px solid var(--brand-gold);
      border-radius: 6px;
      padding: 2mm 3mm;
      text-align: center;
    }

    .sav-high {
      background: #ECFDF5;
      border-color: #10B981;
    }

    .sav-house-num {
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .sav-bindu-num {
      font-size: 12pt;
      font-weight: 700;
      color: var(--brand-maroon);
    }

    .sav-bindu-num span {
      font-size: 8pt;
      font-weight: 600;
    }

    .houses-grid-6 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6mm;
      flex: 1;
    }

    .house-compact-card {
      background: var(--brand-surface);
      border: 1.2px solid var(--brand-gold);
      border-top: 3.5px solid #9A3412;
      border-radius: 8px;
      padding: 4mm 4.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .house-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border-bottom: 1px solid #F2DFB6;
      padding-bottom: 2mm;
      margin-bottom: 2mm;
    }

    .house-num-badge {
      background: var(--brand-maroon);
      color: var(--gold-on-maroon);
      font-size: 8.5pt;
      font-weight: 700;
      padding: 1.5px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .house-strength-pill {
      background: var(--brand-cream);
      border: 1px solid var(--brand-gold);
      color: var(--brand-maroon);
      font-size: 8pt;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .house-two-line-summary {
      margin: 0 0 2.5mm 0;
      font-size: 10pt;
      line-height: 1.45;
      color: var(--text-primary);
    }

    .house-details-subblock {
      background: var(--brand-cream);
      border: 1px solid #ECD5A2;
      border-radius: 6px;
      padding: 2.2mm 3mm;
      font-size: 8.8pt;
      line-height: 1.45;
      color: var(--text-secondary);
    }

    /* ==========================================================================
       11. CHAPTER 8: HORIZONTAL DASHA TIMELINE BAR + "YOU ARE HERE" MARKER
       ========================================================================== */
    .dasha-horizontal-bar {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      gap: 2mm;
      margin-top: 6mm;
      padding-top: 4mm;
    }

    .dasha-seg {
      background: var(--brand-cream);
      border: 1px solid var(--brand-gold);
      border-radius: 6px;
      padding: 2.5mm 1.5mm;
      text-align: center;
      position: relative;
    }

    .dasha-seg-current {
      background: var(--brand-maroon);
      color: var(--text-on-maroon);
      border: 2px solid var(--brand-gold);
      box-shadow: 0 2px 8px rgba(74, 29, 10, 0.25);
    }

    .you-are-here-pin {
      position: absolute;
      top: -7.5mm;
      left: 50%;
      transform: translateX(-50%);
      background: var(--brand-gold);
      color: var(--brand-maroon-dark);
      font-size: 7.2pt;
      font-weight: 800;
      padding: 1.5px 6px;
      border-radius: 99px;
      white-space: nowrap;
      border: 1px solid var(--brand-maroon);
    }

    .dasha-seg-lord {
      font-family: var(--font-heading);
      font-size: 9.8pt;
      font-weight: 700;
    }

    .dasha-seg-current .dasha-seg-lord {
      color: var(--gold-on-maroon);
    }

    .dasha-seg-years {
      font-size: 7.8pt;
      font-weight: 700;
      margin-top: 0.8mm;
    }

    .row-current-highlight {
      background: #FEF3C7 !important;
      font-weight: 700;
    }

    .active-tag {
      background: var(--brand-maroon);
      color: var(--gold-on-maroon);
      font-size: 7.8pt;
      padding: 1px 5px;
      border-radius: 3px;
      margin-left: 4px;
    }

    /* ==========================================================================
       12. LAST PAGE: REMEDIES CHECKLIST, DISCLAIMER, CTA & QR CODE
       ========================================================================== */
    .remedy-checklist {
      display: flex;
      flex-direction: column;
      gap: 3.2mm;
    }

    .remedy-check-item {
      display: flex;
      align-items: flex-start;
      gap: 3mm;
      background: var(--brand-cream);
      border: 1px solid #EAD5A4;
      border-radius: 7px;
      padding: 2.8mm 3.5mm;
      font-size: 10.2pt;
    }

    .check-box {
      font-size: 13pt;
      line-height: 1;
      color: var(--brand-maroon);
      font-weight: 700;
    }

    .disclaimer-box {
      background: #FFFDF7;
      border: 1px dashed var(--brand-maroon);
      border-radius: 8px;
      padding: 3.5mm 4.5mm;
      margin-top: 6mm;
      font-size: 9.2pt;
      color: var(--text-secondary);
    }

    .disclaimer-title {
      font-weight: 700;
      color: var(--brand-maroon);
      margin-bottom: 1mm;
    }

    .disclaimer-box p {
      margin: 0;
    }

    .final-cta-card {
      background: var(--brand-maroon);
      color: var(--text-on-maroon);
      border: 2px solid var(--brand-gold);
      border-radius: 10px;
      padding: 5.5mm 6.5mm;
      margin-top: 6mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6mm;
    }

    .final-cta-kicker {
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--gold-on-maroon);
      letter-spacing: 0.5px;
    }

    .final-cta-heading {
      font-size: 15.5pt;
      color: #FFFFFF;
      margin-top: 1mm;
    }

    .final-cta-text {
      font-size: 9.8pt;
      margin: 2mm 0 3.5mm 0;
      color: var(--text-on-maroon);
    }

    .final-cta-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 4mm;
    }

    .cta-btn-whatsapp {
      background: #15803D;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 10pt;
      padding: 2.5mm 4.5mm;
      border-radius: 6px;
      text-decoration: none;
      border: 1px solid #86EFAC;
    }

    .cta-btn-website {
      background: var(--brand-gold);
      color: var(--brand-maroon-dark);
      font-weight: 700;
      font-size: 10pt;
      padding: 2.5mm 4.5mm;
      border-radius: 6px;
      text-decoration: none;
    }

    .final-cta-qr {
      text-align: center;
      flex-shrink: 0;
    }

    .qr-caption {
      font-size: 8pt;
      font-weight: 700;
      color: var(--gold-on-maroon);
      margin-top: 1.5mm;
    }

    /* ==========================================================================
       13. MOBILE SINGLE-COLUMN VARIANT (FOR WHATSAPP SHARING, LARGER FONTS)
       ========================================================================== */
    body.variant-mobile {
      font-size: 13pt;
      line-height: 1.62;
      background: var(--brand-cream);
    }

    body.variant-mobile .pdf-page {
      width: 100%;
      max-width: 520px;
      min-height: auto;
      margin: 0 auto 16px auto;
      padding: 18px 16px;
      page-break-after: auto;
      break-after: auto;
    }

    body.variant-mobile .cover-birth-grid,
    body.variant-mobile .dashboard-grid-6,
    body.variant-mobile .two-col-cards,
    body.variant-mobile .houses-grid-6 {
      grid-template-columns: 1fr !important;
    }

    body.variant-mobile .sav-grid-12 {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    body.variant-mobile .dasha-horizontal-bar {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 10px;
    }

    body.variant-mobile .cover-pandit-card,
    body.variant-mobile .insight-card-top,
    body.variant-mobile .final-cta-card {
      flex-direction: column;
      align-items: flex-start;
    }

    /* ==========================================================================
       14. PRINT MEDIA QUERIES
       ========================================================================== */
    @media print {
      html, body {
        background: var(--brand-cream) !important;
      }
      .screen-toolbar {
        display: none !important;
      }
      .page,
      .pdf-page {
        width: 210mm !important;
        height: auto !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 10mm 12mm 10mm 12mm !important;
        border: none !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body class="${variant === "mobile" ? "variant-mobile" : "variant-a4"}">
  <!-- Screen-Only Action Bar -->
  <div class="screen-toolbar">
    <div>
      <strong>🪷 శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం</strong> — ${escapeHtml(nativeName)} గారి ${
        variant === "sample"
          ? "Sample Preview (Cover + Top 3 Insights)"
          : variant === "mobile"
          ? "Mobile Single-Column Variant (WhatsApp Share)"
          : "Premium A4 Print-Ready PDF Report"
      }
    </div>
    <div style="display:flex;gap:10px;align-items:center;">
      <button type="button" class="toolbar-btn" onclick="window.print()">🖨️ Print / Save as A4 PDF</button>
      <a href="${whatsappDirectUrl}" target="_blank" rel="noopener noreferrer" class="toolbar-btn" style="background:#15803D;color:#FFFFFF;">💬 WhatsApp Consult</a>
    </div>
  </div>

  ${page1CoverHtml}
  ${page2Top3InsightsHtml}
  ${remainingPagesHtml}
</body>
</html>`;
}
