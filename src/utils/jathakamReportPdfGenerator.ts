/**
 * Jathakam Report PDF & Print Generator
 * (బృహత్ పరాశర సంపూర్ణ జాతక గ్రంథం - High-Fidelity Vedic HTML/PDF Engine)
 *
 * Fully addresses:
 * - Fluid, sacred 18-20 page continuous flowing Vedic Grantham format (no rigid clipped sheets)
 * - Temple-grade Illuminated Kundali Patrika Image style for D1 & D9 charts ("like img lagaa")
 * - North Indian diamond chart SVG with matching royal geometry
 * - Sun sign correctly Cancer (కర్కాటకం), NOT Lagna
 * - Dynamic marriage timing (32–33 in 2026–2027 and 34–35 in 2028–2029 for 1994 native)
 * - Triple Kuja Dosha (Lagna, Chandra Lagna [Mars 8th from Moon in Gemini], Shukra Lagna; no absolute 0%)
 * - Zero Bengali characters (pure Telugu script: నిష్ఠ, ధర్మనిష్ఠ)
 * - Unique non-duplicate sentence for 6th house Saturn in own sign
 * - Correct spelling: "ఆశ్లేష", "గ్రహం"
 * - Full Noto Sans Telugu & Noto Serif Telugu fonts embedded
 * - Prominent native bio at top: Name, DOB, Time, Place of Birth / Address
 * - Running footer on every page: www.telugujyothisham.com
 * - Planetary Dignity Table, Neecha Bhanga Raja Yoga, Classical Yogas & Doshas
 * - Current Dasha with exact dates: Ketu MD -> Mercury AD
 * - Next 12 months Gochara transits & Sarvashtakavarga 337 points distribution
 * - All 12 Bhavas Parashari analysis, 9 Planets in Houses, 96-Year Bhrigu Timeline
 * - 1-Page Executive Summary, Remedies calendar + gemstone safety warning, DPDP Act 2023 disclaimer
 */

import { KundaliResult } from './astronomyPanchangam';
import {
  computePlanetaryDignities,
  checkNeechaBhangaRajaYoga,
  detectAllYogasAndDoshas,
  evaluateTripleKujaDosha,
  calculateDynamicMarriageTiming,
  computeVimshottariFullTimeline,
  computeNext12MonthsGochara,
  computeDivisionalCharts,
  buildPanchangaBirthProfile,
  generateExecutiveSummary,
  resolveRashiIdx,
} from './advancedAstrologyReportEngine';
import {
  generateLagnaCompleteProfile,
  getSunMoonCombination144,
  evaluateMehtaElementalStrengths,
  evaluateMehtaSpecialSutras,
  generateLifeEventProbabilityTimeline,
  computeSarvashtakavargaMatrix,
  generateBhavaPredictions,
  generateAll12HousesCompleteAnalysis,
  generateBhriguLifeProgression,
} from './kundaliPredictionsEngine';
import { generateSaptamaMarriageAnalysis } from './saptamaVisleshanaEngine';

export interface GenerateReportOptions {
  name: string;
  birthDate: string;
  birthTime: string;
  cityName: string;
  chartData: KundaliResult;
  language?: 'te' | 'en';
  chartStyle?: 'south' | 'north' | 'both';
}

const RASHI_NAMES_TE = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
];

const RASHI_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

/**
 * Renders North Indian Diamond Chart SVG with royal temple gold & maroon styling
 */
export function renderNorthIndianChartSvg(
  title: string,
  lagnaRashiIdx: number,
  planetsMap: Record<number, { nameTe: string; nameEn?: string; isRetro?: boolean }[]>,
  lang: 'te' | 'en' = 'te'
): string {
  const houseRashis: number[] = [];
  for (let h = 0; h < 12; h++) {
    houseRashis.push((lagnaRashiIdx + h) % 12);
  }

  const getHouseContent = (hIdx: number) => {
    const rIdx = houseRashis[hIdx];
    const rNum = rIdx + 1;
    const pls = planetsMap[rIdx] || [];
    const plNames = pls
      .map((p) => `${lang === 'en' ? (p.nameEn || p.nameTe) : p.nameTe}${p.isRetro ? '*' : ''}`)
      .join(', ');
    return { rNum, plNames, rName: lang === 'en' ? RASHI_NAMES_EN[rIdx] : RASHI_NAMES_TE[rIdx] };
  };

  return `
    <svg viewBox="0 0 420 420" width="100%" height="100%" style="max-width:390px;margin:0 auto;display:block;background:#fffdf7;border:3px solid #78350f;border-radius:12px;box-shadow:0 4px 12px rgba(120,53,15,0.12);">
      <rect x="8" y="8" width="404" height="404" fill="none" stroke="#d97706" stroke-width="1.8"/>
      <rect x="14" y="14" width="392" height="392" fill="#fffef9" stroke="#78350f" stroke-width="2.5"/>
      <line x1="14" y1="14" x2="406" y2="406" stroke="#92400e" stroke-width="2"/>
      <line x1="406" y1="14" x2="14" y2="406" stroke="#92400e" stroke-width="2"/>
      <polygon points="210,14 406,210 210,406 14,210" fill="#fffbeb" stroke="#78350f" stroke-width="2.5"/>

      <!-- House 1: Top Center Diamond (Lagna) -->
      <polygon points="210,14 308,112 210,210 112,112" fill="#fef08a" fill-opacity="0.5" stroke="none"/>
      <text x="210" y="48" font-family="'Noto Serif Telugu', Georgia, serif" font-size="12" font-weight="bold" fill="#991b1b" text-anchor="middle">1 (${getHouseContent(0).rName} · ${getHouseContent(0).rNum})</text>
      <text x="210" y="76" font-family="'Noto Sans Telugu', sans-serif" font-size="13" font-weight="bold" fill="#451a03" text-anchor="middle">${getHouseContent(0).plNames || (lang === 'en' ? 'Lagna' : 'లగ్నం')}</text>

      <!-- House 2: Top Left Triangle -->
      <text x="110" y="60" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">2 (${getHouseContent(1).rNum})</text>
      <text x="110" y="86" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(1).plNames}</text>

      <!-- House 3: Far Left Top Triangle -->
      <text x="50" y="120" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">3 (${getHouseContent(2).rNum})</text>
      <text x="55" y="146" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(2).plNames}</text>

      <!-- House 4: Left Diamond -->
      <text x="105" y="205" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#78350f" text-anchor="middle">4 (${getHouseContent(3).rName} · ${getHouseContent(3).rNum})</text>
      <text x="105" y="230" font-family="'Noto Sans Telugu', sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(3).plNames}</text>

      <!-- House 5: Far Left Bottom Triangle -->
      <text x="50" y="295" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">5 (${getHouseContent(4).rNum})</text>
      <text x="55" y="320" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(4).plNames}</text>

      <!-- House 6: Bottom Left Triangle -->
      <text x="110" y="355" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">6 (${getHouseContent(5).rNum})</text>
      <text x="110" y="378" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(5).plNames}</text>

      <!-- House 7: Bottom Center Diamond -->
      <text x="210" y="345" font-family="'Noto Serif Telugu', Georgia, serif" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">7 (${getHouseContent(6).rName} · ${getHouseContent(6).rNum})</text>
      <text x="210" y="370" font-family="'Noto Sans Telugu', sans-serif" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(6).plNames}</text>

      <!-- House 8: Bottom Right Triangle -->
      <text x="310" y="355" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">8 (${getHouseContent(7).rNum})</text>
      <text x="310" y="378" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(7).plNames}</text>

      <!-- House 9: Far Right Bottom Triangle -->
      <text x="365" y="295" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">9 (${getHouseContent(8).rNum})</text>
      <text x="360" y="320" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(8).plNames}</text>

      <!-- House 10: Right Diamond -->
      <text x="315" y="205" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#78350f" text-anchor="middle">10 (${getHouseContent(9).rName} · ${getHouseContent(9).rNum})</text>
      <text x="315" y="230" font-family="'Noto Sans Telugu', sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(9).plNames}</text>

      <!-- House 11: Far Right Top Triangle -->
      <text x="365" y="120" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">11 (${getHouseContent(10).rNum})</text>
      <text x="360" y="146" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(10).plNames}</text>

      <!-- House 12: Top Right Triangle -->
      <text x="310" y="60" font-family="'Noto Sans Telugu', sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">12 (${getHouseContent(11).rNum})</text>
      <text x="310" y="86" font-family="'Noto Sans Telugu', sans-serif" font-size="11.5" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(11).plNames}</text>

      <!-- Center Seal -->
      <circle cx="210" cy="210" r="36" fill="#451a03" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="210" cy="210" r="32" fill="none" stroke="#d97706" stroke-dasharray="3,2" stroke-width="1"/>
      <text x="210" y="206" font-family="'Noto Serif Telugu', Georgia, serif" font-size="10" font-weight="bold" fill="#fcd34d" text-anchor="middle">${title}</text>
      <text x="210" y="222" font-family="'Noto Sans Telugu', sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">${lang === 'en' ? 'North Indian' : 'ఉత్తర భారత'}</text>
    </svg>
  `;
}

/**
 * Builds the complete comprehensive Jathaka HTML document
 */
export function buildComprehensiveJathakaPdfHtml(options: GenerateReportOptions): string {
  const { name, birthDate, birthTime, cityName, chartData } = options;
  const lang = options.language || 'te';
  const siteUrl = 'www.telugujyothisham.com';
  const fullSiteHref = 'https://www.telugujyothisham.com';
  const heroPhotoUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? `${window.location.origin}/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg`
      : '/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg';
  const whatsappHref = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, ${name} (${birthDate}, ${birthTime}, ${cityName}) జాతక పరిశీలన కొరకు సంప్రదిస్తున్నాను.`
  )}`;

  const lagnaRashiIdx = resolveRashiIdx(chartData.lagna.id);
  const navamshaLagnaRashiIdx = resolveRashiIdx(chartData.navamshaLagna.id);
  const moonPlanet = chartData.planets.find((p) => p.id === 'moon') || chartData.planets[1];
  const sunPlanet = chartData.planets.find((p) => p.id === 'sun') || chartData.planets[0];
  const moonRashiIdx = moonPlanet.rashiIdx;

  // Compute all astrological models
  const lagnaProfile = generateLagnaCompleteProfile(chartData.planets, lagnaRashiIdx);
  const sunMoon144 = getSunMoonCombination144(sunPlanet.rashiIdx, moonPlanet.rashiIdx);
  const saptamaMarriage = generateSaptamaMarriageAnalysis(chartData.planets, lagnaRashiIdx, birthDate);
  const all12Houses = generateAll12HousesCompleteAnalysis(chartData.planets, lagnaRashiIdx);
  const elementStrengths = evaluateMehtaElementalStrengths(chartData.planets, lagnaRashiIdx);
  const specialSutras = evaluateMehtaSpecialSutras(chartData.planets, lagnaRashiIdx, birthDate);
  const eventTimelines = generateLifeEventProbabilityTimeline(chartData.planets, lagnaRashiIdx, birthDate);
  const ashtakavargaMatrix = computeSarvashtakavargaMatrix(chartData.planets, lagnaRashiIdx);
  const bhavaPredictions = generateBhavaPredictions(chartData.planets, lagnaRashiIdx);
  const bhriguCycles = generateBhriguLifeProgression(chartData.planets, lagnaRashiIdx, birthDate);

  // New modules & checks
  const dignities = computePlanetaryDignities(chartData.planets, lagnaRashiIdx);
  const neechaBhangaList = checkNeechaBhangaRajaYoga(dignities, chartData.planets, lagnaRashiIdx);
  const yogas = detectAllYogasAndDoshas(chartData.planets, lagnaRashiIdx, dignities);
  const tripleKuja = evaluateTripleKujaDosha(chartData.planets, lagnaRashiIdx);
  const marriageTiming = calculateDynamicMarriageTiming(birthDate, lagnaRashiIdx, moonRashiIdx);
  const dashaInfo = computeVimshottariFullTimeline(moonPlanet.longitude, birthDate, birthTime);
  const gochara12m = computeNext12MonthsGochara(moonRashiIdx, lagnaRashiIdx);
  const divisional = computeDivisionalCharts(chartData.planets, lagnaRashiIdx);
  const panchangaProfile = buildPanchangaBirthProfile(chartData, birthDate, birthTime, cityName);
  const execSummary = generateExecutiveSummary(dignities, yogas, tripleKuja, dashaInfo, marriageTiming);

  /**
   * Renders a compact 1:1 Square South Indian Kundali Plate for Page 1 Front Cover (side-by-side D1 & D9)
   */
  const renderFrontPageCompactKundaliHtml = (
    chartTitle: string,
    activeLagnaIdx: number,
    planetsMap: Record<number, { nameTe: string; nameEn?: string; isRetro?: boolean; degreeFormatted?: string }[]>,
    isD1: boolean
  ) => {
    const compactCellHtml = (rIdx: number) => {
      const pls = (planetsMap[rIdx] || []).filter((p) => p.nameTe !== 'లగ్నం');
      const isLagnaCell = rIdx === activeLagnaIdx;
      const isMoonCell = isD1 && rIdx === moonRashiIdx;
      const houseNum = ((rIdx - activeLagnaIdx + 12) % 12) + 1;

      return `
        <td style="width:25%;height:62px;vertical-align:top;padding:3px 4px;border:1.5px solid #78350f;background:${
          isLagnaCell
            ? 'linear-gradient(135deg, #fef08a 0%, #fde68a 100%)'
            : isMoonCell
            ? '#ecfdf5'
            : '#fffdf7'
        };box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed rgba(180,83,9,0.4);padding-bottom:1px;margin-bottom:2px;">
            <span style="font-size:8.5px;font-weight:800;color:#78350f;">${RASHI_NAMES_TE[rIdx]}</span>
            <span style="font-size:7px;font-weight:700;color:#9a3412;background:#ffedd5;padding:0 3px;border-radius:3px;border:0.5px solid #fdba74;">${houseNum}వ</span>
          </div>
          ${isLagnaCell ? '<div style="font-size:7px;font-weight:800;background:#991b1b;color:#fff;display:inline-block;padding:0 3px;border-radius:2px;margin-bottom:1px;">★ లగ్నం</div>' : ''}
          ${!isLagnaCell && isMoonCell ? '<div style="font-size:7px;font-weight:800;background:#065f46;color:#fff;display:inline-block;padding:0 3px;border-radius:2px;margin-bottom:1px;">☽ రాశి</div>' : ''}
          <div style="font-size:8.5px;font-weight:800;color:#0f172a;line-height:1.25;">
            ${pls
              .map(
                (p) =>
                  `<span style="display:inline-block;margin-right:3px;">${p.nameTe}${
                    p.isRetro && p.nameTe !== 'రాహువు' && p.nameTe !== 'కేతువు' ? '<span style="color:#dc2626;font-size:7.5px;">(వ)</span>' : ''
                  }</span>`
              )
              .join('')}
          </div>
        </td>
      `;
    };

    return `
      <div style="border:3px solid #78350f;border-radius:12px;background:linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);padding:6px;box-shadow:0 3px 10px rgba(120,53,15,0.1);">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;font-weight:800;color:#78350f;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:4px;">
          <span>🪷 శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం</span>
          <span style="background:#78350f;color:#fef08a;padding:1px 8px;border-radius:999px;">${chartTitle}</span>
          <span>దృక్సిద్ధాంతం 🪷</span>
        </div>
        <table style="width:248px;height:248px;aspect-ratio:1/1;margin:0 auto;border-collapse:collapse;table-layout:fixed;background:#fffdf7;border:2px solid #78350f;">
          <tr>
            ${compactCellHtml(11)}
            ${compactCellHtml(0)}
            ${compactCellHtml(1)}
            ${compactCellHtml(2)}
          </tr>
          <tr>
            ${compactCellHtml(10)}
            <td colspan="2" rowspan="2" style="background:linear-gradient(135deg, #451a03 0%, #240801 100%);color:#fef3c7;text-align:center;padding:4px;border:2px solid #d97706;">
              <div style="font-size:7.5px;font-weight:bold;color:#fcd34d;">|| ఓం శ్రీ మహాగణాధిపతయే నమః ||</div>
              <div style="display:inline-block;background:linear-gradient(90deg, #f59e0b, #fde047, #f59e0b);color:#451a03;font-size:9px;font-weight:900;padding:1px 7px;border-radius:999px;margin:2px 0;">
                ${chartTitle}
              </div>
              <div style="font-size:9.5px;font-weight:800;color:#ffffff;">${name}</div>
              <div style="font-size:7.5px;color:#fcd34d;font-family:monospace;">${birthDate} · ${birthTime}</div>
              <div style="font-size:8px;color:#86efac;font-weight:bold;margin-top:1px;">
                ${isD1 ? `లగ్నం: ${chartData.lagna.te} | రాశి: ${chartData.rashi.te}` : `నవాంశ లగ్నం: ${chartData.navamshaLagna.te}`}
              </div>
              <div style="margin-top:2px;padding-top:2px;border-top:1px solid rgba(245,158,11,0.35);">
                <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" translate="no" class="notranslate" style="font-size:7.5px;color:#fde047;font-family:monospace;font-weight:bold;text-decoration:underline;">
                  ${siteUrl}
                </a>
              </div>
            </td>
            ${compactCellHtml(3)}
          </tr>
          <tr>
            ${compactCellHtml(9)}
            ${compactCellHtml(4)}
          </tr>
          <tr>
            ${compactCellHtml(8)}
            ${compactCellHtml(7)}
            ${compactCellHtml(6)}
            ${compactCellHtml(5)}
          </tr>
        </table>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:8px;font-weight:bold;color:#78350f;padding-top:3px;margin-top:3px;border-top:1px solid #d97706;">
          <span>★ లగ్నం: ${isD1 ? chartData.lagna.te : chartData.navamshaLagna.te}</span>
          <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" translate="no" class="notranslate" style="color:#991b1b;font-family:monospace;font-weight:900;text-decoration:underline;">${siteUrl}</a>
          <span>☽ ${chartData.rashi.te}</span>
        </div>
      </div>
    `;
  };

  /**
   * Renders the South Indian Kundali Chart as an illuminated temple manuscript plate ("like img lagaa")
   */
  const renderSouthIndianImagePlateHtml = (
    chartTitle: string,
    subBadge: string,
    planetsMap: Record<number, { nameTe: string; nameEn?: string; isRetro?: boolean; degreeFormatted?: string }[]>
  ) => {
    const cellHtml = (rIdx: number) => {
      const pls = planetsMap[rIdx] || [];
      const isLagnaCell = rIdx === lagnaRashiIdx;
      const isMoonCell = rIdx === moonRashiIdx;
      const isSunCell = rIdx === sunPlanet.rashiIdx;

      const houseNumber = ((rIdx - lagnaRashiIdx + 12) % 12) + 1;

      return `
        <td style="width:25%;height:110px;vertical-align:top;padding:5px 6px;border:2px solid #854d0e;background:${
          isLagnaCell
            ? 'linear-gradient(180deg, #fef08a 0%, #fde68a 100%)'
            : isMoonCell
            ? '#ecfdf5'
            : '#ffffff'
        };box-sizing:border-box;position:relative;">
          <!-- Cell Header: Rashi Name + House Number Badge -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #d97706;padding-bottom:2px;margin-bottom:3px;">
            <span style="font-family:'Noto Serif Telugu', Georgia, serif;font-size:11px;font-weight:800;color:#78350f;">
              ${RASHI_NAMES_TE[rIdx]}
            </span>
            <span style="font-size:9px;font-weight:700;color:${isLagnaCell ? '#991b1b' : '#854d0e'};background:${isLagnaCell ? '#fee2e2' : '#fef3c7'};padding:1px 4px;border-radius:4px;border:0.5px solid #d97706;">
              ${houseNumber}వ ఇల్లు
            </span>
          </div>

          <!-- Special Status Badges -->
          <div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:2px;">
            ${isLagnaCell ? '<span style="font-size:8.5px;font-weight:800;background:#991b1b;color:#ffffff;padding:1px 4px;border-radius:3px;">★ జన్మ లగ్నం</span>' : ''}
            ${isMoonCell ? '<span style="font-size:8.5px;font-weight:800;background:#047857;color:#ffffff;padding:1px 4px;border-radius:3px;">☽ జన్మ రాశి</span>' : ''}
            ${isSunCell ? '<span style="font-size:8.5px;font-weight:800;background:#b45309;color:#ffffff;padding:1px 4px;border-radius:3px;">☀️ సూర్యుడు</span>' : ''}
          </div>

          <!-- Occupant Planets with Degrees & Status -->
          <div style="font-family:'Noto Sans Telugu', sans-serif;font-size:11px;font-weight:800;color:#1e293b;line-height:1.35;">
            ${pls.length === 0
              ? '<span style="font-size:9.5px;color:#94a3b8;font-weight:normal;font-style:italic;">గ్రహాలు లేవు</span>'
              : pls
                  .map((p) => {
                    const dign = dignities.find((d) => d.nameTe === p.nameTe);
                    const isRetro = p.isRetro;
                    const isCombust = dign?.isCombust;
                    const isUcha = dign?.dignityCode === 'ucha';
                    const isNeecha = dign?.dignityCode === 'neecha';

                    return `<div style="display:inline-block;margin-right:5px;margin-bottom:2px;">
                      <span style="color:#0f172a;">${p.nameTe}</span>
                      ${isRetro ? '<span style="color:#dc2626;font-size:9.5px;font-weight:bold;">(వ)</span>' : ''}
                      ${isCombust ? '<span style="color:#c2410c;font-size:8.5px;font-weight:bold;">(అస్తం)</span>' : ''}
                      ${isUcha ? '<span style="color:#15803d;font-size:8.5px;font-weight:bold;">(ఉచ్చ)</span>' : ''}
                      ${isNeecha ? '<span style="color:#b91c1c;font-size:8.5px;font-weight:bold;">(నీచ)</span>' : ''}
                      ${p.degreeFormatted ? `<span translate="no" class="notranslate" style="font-size:9px;color:#64748b;font-weight:normal;font-family:monospace;margin-left:2px;">${p.degreeFormatted}</span>` : ''}
                    </div>`;
                  })
                  .join('')
            }
          </div>
        </td>
      `;
    };

    return `
      <div style="margin:14px auto;width:456px;max-width:100%;border:4px solid #78350f;outline:2px solid #d97706;border-radius:14px;background:#fffdf5;padding:6px;box-shadow:0 6px 18px rgba(120,53,15,0.14);page-break-inside:avoid;break-inside:avoid;">
        <div style="border:2px solid #b45309;border-radius:10px;overflow:visible;background:#fffdf5;">
          <table style="width:440px;height:440px;aspect-ratio:1/1;margin:0 auto;border-collapse:collapse;table-layout:fixed;background:#fffdf5;">
            <tr>
              ${cellHtml(11)}
              ${cellHtml(0)}
              ${cellHtml(1)}
              ${cellHtml(2)}
            </tr>
            <tr>
              ${cellHtml(10)}
              <!-- Brahmasthanam (Center Sanctum Plate) -->
              <td colspan="2" rowspan="2" style="background:linear-gradient(135deg, #451a03 0%, #240801 100%);color:#fef3c7;text-align:center;padding:8px 6px;border:2.5px solid #d97706;box-shadow:inset 0 0 16px rgba(0,0,0,0.6);overflow:visible;">
                <div style="font-family:'Noto Serif Telugu', Georgia, serif;font-size:10px;font-weight:bold;color:#fcd34d;letter-spacing:0.5px;margin-bottom:2px;">
                  ॥ శ్రీ మహాగణాధిపతయే నమః ॥
                </div>
                <div style="font-size:10px;color:#fde68a;font-weight:700;">
                  శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · దృక్సిద్ధాంతం
                </div>
                <!-- Golden Title Ribbon -->
                <div style="display:inline-block;background:linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #b45309 100%);color:#451a03;font-family:'Noto Serif Telugu', serif;font-size:13px;font-weight:900;padding:2px 12px;border-radius:6px;margin:4px 0;box-shadow:0 2px 6px rgba(0,0,0,0.3);">
                  ★ ${chartTitle} ★
                </div>
                <div style="font-size:12px;font-weight:800;color:#ffffff;margin-top:2px;">
                  ${name} గారి జన్మ జాతక పత్రిక
                </div>
                <div style="font-size:10px;color:#fcd34d;font-family:monospace;margin-top:2px;">
                  ${birthDate} · ${birthTime} (${cityName})
                </div>
                <div style="font-size:10.5px;color:#86efac;font-weight:bold;margin-top:3px;border-top:1px dashed #d97706;padding-top:3px;">
                  లగ్నం: ${chartData.lagna.te} · రాశి: ${chartData.rashi.te} (${chartData.nakshatraName} ${chartData.pada})
                </div>
                <div style="font-size:9.5px;color:#fef3c7;margin-top:2px;">
                  ${subBadge || 'లహిరి అయనాంశం: ' + chartData.ayanamsaFormatted}
                </div>
                <div translate="no" class="notranslate" style="font-size:9px;color:#fde68a;font-family:monospace;font-weight:bold;margin-top:3px;padding-top:2px;border-top:1px solid rgba(245,158,11,0.3);overflow:visible;white-space:nowrap;">
                  <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="color:#fde047;text-decoration:underline;">${siteUrl}</a>
                </div>
              </td>
              ${cellHtml(3)}
            </tr>
            <tr>
              ${cellHtml(9)}
              ${cellHtml(4)}
            </tr>
            <tr>
              ${cellHtml(8)}
              ${cellHtml(7)}
              ${cellHtml(6)}
              ${cellHtml(5)}
            </tr>
          </table>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px 2px 8px;font-size:10px;color:#78350f;font-weight:bold;">
          <span>బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు · <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer" style="color:#78350f;text-decoration:underline;">+91 89779 86166</a></span>
          <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" translate="no" class="notranslate" style="color:#991b1b;text-decoration:underline;font-weight:900;">${siteUrl}</a>
        </div>
      </div>
    `;
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} - సంపూర్ణ బృహత్ జాతక నివేదిక | ${siteUrl}</title>
  <!-- Full Noto Sans Telugu & Noto Serif Telugu fonts for perfect GSUB/GPOS complex conjunct rendering -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600;700;800&family=Noto+Serif+Telugu:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 11mm 10mm;
      background-color: #fffdf5;
    }
    body {
      font-family: 'Noto Sans Telugu', 'Noto Serif Telugu', Georgia, -apple-system, sans-serif;
      color: #1e293b;
      background: linear-gradient(180deg, #fffbeb 0%, #fffdf5 50%, #fefce8 100%);
      margin: 0;
      padding: 0;
      line-height: 1.58;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .grantham-document {
      max-width: 820px;
      margin: 0 auto;
      background: linear-gradient(180deg, #fffbeb 0%, #fffdf7 55%, #fef9c3 100%);
      padding: 10px 16px 40px 16px;
    }

    /* Page Breaks & Flow with Split Background */
    .chapter-break {
      page-break-before: always;
      break-before: page;
      page-break-inside: avoid;
      break-inside: avoid;
      padding: 12px 14px;
      background: linear-gradient(180deg, #fffbeb 0%, #fffdf7 55%, #fef9c3 100%);
      border: 2px solid #d97706;
      border-radius: 14px;
      margin-bottom: 14px;
    }
    .chapter-break:nth-of-type(even) {
      background: linear-gradient(180deg, #fefce8 0%, #fffbeb 55%, #ffedd5 100%);
      border-color: #b45309;
    }
    .keep-together {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Running Header & Footer for Print Media */
    .print-running-header {
      border-bottom: 2px solid #b45309;
      padding-bottom: 4px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #78350f;
      font-weight: 700;
    }
    .print-running-header a {
      color: #991b1b;
      text-decoration: underline;
      font-weight: 800;
    }
    .print-running-footer {
      border-top: 1.5px solid #b45309;
      padding-top: 4px;
      margin-top: 16px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: #78350f;
      font-weight: 600;
    }
    .print-running-footer a {
      color: #991b1b;
      text-decoration: underline;
      font-weight: 800;
    }

    /* Headings */
    .chapter-title {
      font-family: 'Noto Serif Telugu', Georgia, serif;
      font-size: 18px;
      font-weight: 900;
      color: #451a03;
      border-left: 5px solid #b45309;
      padding-left: 10px;
      margin: 10px 0 8px 0;
      line-height: 1.35;
    }
    .chapter-subtitle {
      font-size: 11.5px;
      color: #78350f;
      font-weight: 700;
      margin-bottom: 10px;
    }

    /* Cards */
    .section-card {
      border: 1.5px solid #d97706;
      border-radius: 10px;
      padding: 11px 14px;
      margin-bottom: 11px;
      background: #fffdf9;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section-card-accent {
      background: #fef9c3;
      border-color: #b45309;
    }
    .section-card h4 {
      margin: 0 0 6px 0;
      color: #78350f;
      font-size: 14px;
      font-weight: 800;
      border-bottom: 1px dashed #fde68a;
      padding-bottom: 4px;
    }
    .section-card p {
      margin: 4px 0;
      font-size: 12px;
      line-height: 1.55;
      color: #334155;
    }

    /* Data Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11.5px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #d97706;
      padding: 6px 8px;
      text-align: left;
    }
    table.data-table th {
      background: #fef3c7;
      color: #78350f;
      font-weight: 800;
    }
    table.data-table tr:nth-child(even) td {
      background: #fffdf7;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 700;
    }
    .badge-gold { background: #fef3c7; color: #92400e; border: 1px solid #f59e0b; }
    .badge-green { background: #dcfce7; color: #166534; border: 1px solid #22c55e; }
    .badge-red { background: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; border: 1px solid #c084fc; }

    /* On-Screen Action Toolbar */
    .screen-toolbar {
      position: sticky;
      top: 0;
      background: #451a03;
      color: #ffffff;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10000;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      border-bottom: 2px solid #f59e0b;
      margin-bottom: 16px;
    }
    .screen-toolbar button {
      background: #f59e0b;
      color: #451a03;
      font-weight: 800;
      border: none;
      padding: 9px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13.5px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .screen-toolbar button:hover {
      background: #fbbf24;
    }

    @media print {
      .screen-toolbar { display: none !important; }
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fffdf5 !important;
      }
      .grantham-document {
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        background: #fffdf5 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Toolbar -->
  <div class="screen-toolbar">
    <div>
      <span style="font-size:15px;font-weight:bold;">🖨️ ${name} గారి సంపూర్ణ బృహత్ జాతక గ్రంథం (PDF ప్రింట్ సిద్ధం)</span>
      <span style="font-size:11.5px;color:#fde68a;margin-left:14px;">గమనిక: ప్రింట్ డైలాగ్‌లో "Save as PDF" ఎంచుకోండి.</span>
    </div>
    <button onclick="window.print()">🖨️ ఇప్పుడే ప్రింట్ / సేవ్ చేయండి</button>
  </div>

  <div class="grantham-document">

    <!-- ==========================================================================
        PROMINENT FRONT COVER PAGE 1: GURUJI HERO PHOTO + FULL BIO + HYPERLINKS +
        NATIVE PROFILE + SIDE-BY-SIDE D1 & D9 KUNDALI CHAKRAS
        ========================================================================== -->
    <div class="keep-together" style="border:3.5px double #78350f;border-radius:14px;background:radial-gradient(circle at center, #fffdf5 0%, #fef3c7 100%);padding:12px 14px;margin-bottom:14px;box-shadow:0 4px 14px rgba(120,53,15,0.08);">
      <!-- Guruji Hero Banner Card -->
      <div style="background:linear-gradient(135deg, #2b0902 0%, #451a03 55%, #2b0902 100%);border:2px solid #f59e0b;border-radius:12px;padding:10px 14px;color:#fef3c7;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(245,158,11,0.35);padding-bottom:4px;margin-bottom:8px;font-size:9.5px;font-weight:bold;color:#fcd34d;">
          <span>॥ శ్రీ గురుభ్యో నమః · శ్రీ మహాగణపతయే నమః ॥</span>
          <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · హైదరాబాద్</span>
          <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="background:#f59e0b;color:#2b0902;padding:1px 8px;border-radius:999px;font-weight:900;text-decoration:underline;">🌐 ${siteUrl}</a>
        </div>

        <div style="display:flex;align-items:center;gap:14px;">
          <!-- Hero Photo -->
          <div style="text-align:center;flex-shrink:0;">
            <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="display:block;width:78px;height:78px;border-radius:50%;padding:3px;background:linear-gradient(135deg,#f59e0b,#fef08a,#d97706);margin:0 auto;">
              <img src="${heroPhotoUrl}" alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు" width="72" height="72" style="width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:top;border:1.5px solid #fff;" />
            </a>
            <span style="display:inline-block;margin-top:3px;background:#f59e0b;color:#2b0902;font-size:8px;font-weight:900;padding:1px 6px;border-radius:999px;">
              స్మార్త వైదిక &amp; జ్యోతిష్య విద్వాంసులు
            </span>
          </div>

          <!-- Guruji Complete Credentials & Clickable Hyperlinks -->
          <div style="flex:1;text-align:left;">
            <div style="font-size:9px;font-weight:bold;color:#fcd34d;text-transform:uppercase;letter-spacing:0.4px;">
              స్మార్త వైదిక &amp; దృక్సిద్ధాంత జ్యోతిష్య నిపుణులు · 15+ ఏళ్ల గురుపరంపర వేద సంప్రదాయం
            </div>
            <div style="font-family:'Noto Serif Telugu', serif;font-size:18px;font-weight:900;color:#fde047;line-height:1.2;margin:2px 0;">
              <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="color:#fde047;text-decoration:none;">
                బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (Brahmasri Jallavaram Sai Dheeraj Sharma)
              </a>
            </div>
            <div style="font-size:10px;color:#fef3c7;line-height:1.35;margin-bottom:6px;">
              <strong>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం, హైదరాబాద్:</strong> దృక్సిద్ధాంత ఖగోళ గణిత సంపూర్ణ జాతక పరిశీలన, 36 గుణాల వివాహ పొంతన, వివాహ-గృహప్రవేశ సిద్ధ ముహూర్త నిర్ణయం మరియు శ్రీ చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర మహా హోమ క్రతువుల నిర్వహణ.
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:9.5px;font-weight:900;">
              <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="background:#fbbf24;color:#2b0902;padding:3px 9px;border-radius:6px;text-decoration:underline;">
                🌐 వెబ్‌సైట్: ${fullSiteHref}
              </a>
              <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer" style="background:#10b981;color:#ffffff;padding:3px 9px;border-radius:6px;text-decoration:underline;">
                💬 వాట్సాప్: +91 89779 86166
              </a>
              <a href="tel:+918977986166" style="background:#78350f;color:#fef08a;border:1px solid #f59e0b;padding:3px 9px;border-radius:6px;text-decoration:underline;">
                📞 కాల్: +91 89779 86166
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Native Title & Birth Credentials Compact Table -->
      <div style="text-align:center;margin-bottom:8px;">
        <div style="display:inline-block;background:#451a03;color:#fde68a;padding:4px 16px;border-radius:999px;font-size:15px;font-weight:900;border:1.5px solid #f59e0b;">
          🌟 ${name} గారి సంపూర్ణ బృహత్ జాతక &amp; కుండలి మహాగ్రంథం
        </div>
      </div>

      <div style="border:2px solid #b45309;border-radius:10px;background:#ffffff;padding:8px 12px;text-align:left;margin-bottom:10px;">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <tr>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;width:22%;">జాతకుని పేరు:</td>
            <td style="padding:2px 6px;font-weight:900;color:#1e293b;font-size:13px;width:28%;">${name}</td>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;width:22%;">పుట్టిన తేదీ &amp; సమయం:</td>
            <td style="padding:2px 6px;font-weight:800;color:#1e293b;width:28%;">${birthDate} · ${birthTime}</td>
          </tr>
          <tr>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;">జన్మ స్థలం:</td>
            <td style="padding:2px 6px;font-weight:700;color:#1e293b;">${cityName} (${panchangaProfile.latLonFormatted})</td>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;">లగ్నం &amp; నవాంశ:</td>
            <td style="padding:2px 6px;font-weight:800;color:#991b1b;">${chartData.lagna.te} / ${chartData.navamshaLagna.te}</td>
          </tr>
          <tr>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;">జన్మ రాశి &amp; నక్షత్రం:</td>
            <td style="padding:2px 6px;font-weight:800;color:#047857;">${chartData.rashi.te} · ${chartData.nakshatraName} (${chartData.pada}వ పాదం)</td>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;">సూర్య రాశి (Sun Sign):</td>
            <td style="padding:2px 6px;font-weight:800;color:#b45309;">${sunPlanet.rashiTe} (${sunPlanet.degreeFormatted})</td>
          </tr>
          <tr>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;">ప్రస్తుత మహాదశ:</td>
            <td style="padding:2px 6px;font-weight:800;color:#1e293b;">${dashaInfo.currentMahadasha.lordTe} – ${dashaInfo.currentAntardasha.lordTe}</td>
            <td style="padding:2px 6px;font-weight:bold;color:#78350f;">అధికారిక వెబ్‌సైట్:</td>
            <td style="padding:2px 6px;font-weight:900;"><a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="color:#991b1b;text-decoration:underline;">🌐 ${fullSiteHref}</a></td>
          </tr>
        </table>
      </div>

      <!-- FRONT PAGE SIDE-BY-SIDE D1 RASI CHAKRA & D9 NAVAMSA CHAKRA -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start;">
        ${renderFrontPageCompactKundaliHtml('రాశి చక్రం (D1)', lagnaRashiIdx, chartData.d1RashiPlanets, true)}
        ${renderFrontPageCompactKundaliHtml('నవాంశ చక్రం (D9)', navamshaLagnaRashiIdx, chartData.d9NavamshaPlanets, false)}
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 1: PANCHANGA PROFILE & BIRTH ASTRONOMICAL ATTRIBUTES
        ========================================================================== -->
    <div class="keep-together">
      <div class="chapter-title">అధ్యాయం 1 · పంచాంగ జన్మ విశేషాలు &amp; నక్షత్ర గుణ వివరాలు</div>
      <div class="chapter-subtitle">Panchangam Birth Attributes, Astrological Coordinates &amp; Nakshatra Profile</div>

      <div class="section-card section-card-accent">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:8px;font-size:11.5px;">
          <div><strong style="color:#78350f;">తెలుగు సంవత్సరం:</strong> ${panchangaProfile.samvatsaraTe}</div>
          <div><strong style="color:#78350f;">మాసం &amp; రుతువు:</strong> ${panchangaProfile.masaTe} (${panchangaProfile.rituTe})</div>
          <div><strong style="color:#78350f;">జన్మ తిథి:</strong> ${panchangaProfile.tithiTe} (${panchangaProfile.pakshaTe})</div>
          <div><strong style="color:#78350f;">వారం:</strong> ${panchangaProfile.vaaraTe} (${panchangaProfile.ayanaTe})</div>
          <div><strong style="color:#78350f;">కరణం:</strong> ${panchangaProfile.karanaTe}</div>
          <div><strong style="color:#78350f;">నిత్య యోగం:</strong> ${panchangaProfile.yogaTe}</div>
          <div><strong style="color:#78350f;">నక్షత్ర గణం:</strong> ${panchangaProfile.ganaTe}</div>
          <div><strong style="color:#78350f;">యోని:</strong> ${panchangaProfile.yoniTe}</div>
          <div><strong style="color:#78350f;">నాడి:</strong> ${panchangaProfile.nadiTe}</div>
          <div><strong style="color:#78350f;">జన్మ నామాక్షరం:</strong> ${panchangaProfile.namaAksharamTe}</div>
          <div><strong style="color:#78350f;">అయనాంశం:</strong> ${panchangaProfile.ayanamsaFormatted}</div>
          <div><strong style="color:#78350f;">టైమ్ జోన్ &amp; వశ్య:</strong> ${panchangaProfile.timezoneFormatted} · ${panchangaProfile.vashyaTe}</div>
        </div>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 2: 1-PAGE EXECUTIVE SUMMARY
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతక దర్శిని</span>
        <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer">${siteUrl}</a>
      </div>

      <div class="chapter-title">అధ్యాయం 2 · జాతక సంక్షిప్త సారాంశం (1-Page Executive Summary)</div>
      <div class="chapter-subtitle">Top 5 Strengths, 3 Critical Cautions, 12-Month Outlook &amp; Running Dasha</div>

      <div class="section-card" style="background:#ecfdf5;border-color:#10b981;">
        <h4 style="color:#065f46;border-color:#a7f3d0;">🌟 ప్రస్తుత క్రియాశీల దశా కాలం (Active Dasha Timeline)</h4>
        <p style="font-size:12.5px;font-weight:800;color:#064e3b;">${execSummary.oneLineDashaSummaryTe}</p>
        <p style="font-size:11px;color:#047857;">జన్మ శని మహాదశా శేషం: ${dashaInfo.janmaDashaBalanceFormattedTe}</p>
      </div>

      <div class="section-card">
        <h4 style="color:#047857;">💎 జాతక ప్రధాన 5 దివ్య బలాలు (Top 5 Strengths)</h4>
        <ul style="margin:4px 0 4px 18px;padding:0;font-size:12px;line-height:1.6;color:#1e293b;">
          ${execSummary.top5StrengthsTe.map((s) => `<li>${s}</li>`).join('')}
        </ul>
      </div>

      <div class="section-card">
        <h4 style="color:#991b1b;">⚠️ జీవితంలో తీసుకోవలసిన 3 ప్రధాన జాగ్రత్తలు (Top 3 Cautions)</h4>
        <ul style="margin:4px 0 4px 18px;padding:0;font-size:12px;line-height:1.6;color:#1e293b;">
          ${execSummary.top3CautionsTe.map((c) => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div class="section-card" style="background:#eff6ff;border-color:#3b82f6;">
        <h4 style="color:#1d4ed8;border-color:#bfdbfe;">🔮 రాబోయే 12 నెలల గోచార ఫలితాల ముఖ్యాంశం (12-Month Outlook)</h4>
        <p style="font-size:12px;color:#1e3a8a;line-height:1.55;">${execSummary.next12MonthsOutlookTe}</p>
        <p style="font-size:11.5px;color:#047857;font-weight:bold;margin-top:4px;">🙏 ప్రధాన పరిహార దృష్టి: ${execSummary.vitalRemedyFocusTe}</p>
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · అధికారిక సంపూర్ణ పత్రిక</span>
        <span><a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 3: ILLUMINATED KUNDALI PATRIKA IMAGE PLATES (D1 & D9)
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి కుండలి చక్రాలు</span>
        <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer">${siteUrl}</a>
      </div>

      <div class="chapter-title">అధ్యాయం 3 · సంపూర్ణ రాశి చక్రం (D1) &amp; నవాంశ చక్రం (D9) పత్రికలు</div>
      <div class="chapter-subtitle">High-Resolution Illuminated Temple Kundali Plates (South &amp; North Indian Styles)</div>

      <!-- D1 RASHI KUNDALI IMAGE PLATE -->
      ${renderSouthIndianImagePlateHtml(
        'రాశి చక్రం (D1 Janma Kundali)',
        `లగ్నం: ${chartData.lagna.te} · సూర్యుడు: ${sunPlanet.rashiTe} · చంద్రుడు: ${moonPlanet.rashiTe}`,
        chartData.d1RashiPlanets
      )}

      <!-- D9 NAVAMSHA KUNDALI IMAGE PLATE -->
      <div class="chapter-break keep-together">
        ${renderSouthIndianImagePlateHtml(
          'నవాంశ చక్రం (D9 Navamsha Chart)',
          `నవాంశ లగ్నం: ${chartData.navamshaLagna.te} · ఆత్మ-కళత్ర సూక్ష్మ బలం`,
          chartData.d9NavamshaPlanets
        )}
      </div>

      <!-- North Indian Diamond Chart SVG -->
      <div class="keep-together" style="margin-top:20px;text-align:center;">
        <h4 style="font-family:'Noto Serif Telugu', serif;font-size:15px;font-weight:800;color:#78350f;margin-bottom:8px;">
          ఉత్తర భారత వజ్ర కుండలి చక్రం (North Indian Diamond Kundali)
        </h4>
        ${renderNorthIndianChartSvg('D1 రాశి చక్రం', lagnaRashiIdx, chartData.d1RashiPlanets, lang)}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · కుండలి పత్రిక దర్శిని</span>
        <span><a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 4: PLANETARY DIGNITIES, EXACT DEGREES & NEECHA BHANGA
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · గ్రహ స్ఫుట పట్టిక</span>
        <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer">${siteUrl}</a>
      </div>

      <div class="chapter-title">అధ్యాయం 4 · నవగ్రహ స్ఫుటములు &amp; గ్రహ బలాబలాలు (Planetary Dignities)</div>
      <div class="chapter-subtitle">Exact Sidereal Longitudes, Exaltation/Debilitation, Combustion, Vargottama &amp; Neecha Bhanga</div>

      <table class="data-table">
        <thead>
          <tr>
            <th>గ్రహం (Planet)</th>
            <th>రాశి (D1)</th>
            <th>ఖచ్చిత డిగ్రీలు</th>
            <th>నక్షత్రం (పాదం)</th>
            <th>నవాంశ (D9)</th>
            <th>గౌరవ స్థితి (Dignity)</th>
            <th>దృష్టి &amp; విశేష బలం</th>
          </tr>
        </thead>
        <tbody>
          ${dignities
            .map((d) => {
              const badgeClass =
                d.dignityCode === 'ucha'
                  ? 'badge-green'
                  : d.dignityCode === 'neecha'
                  ? 'badge-red'
                  : d.dignityCode === 'swakshetra'
                  ? 'badge-gold'
                  : 'badge-purple';

              return `<tr>
                <td style="font-weight:bold;color:#451a03;">
                  ${d.nameTe}
                  ${d.isRetrograde ? '<span style="color:#b91c1c;font-size:10px;">(వక్రం)</span>' : ''}
                  ${d.isCombust ? '<span style="color:#c2410c;font-size:9.5px;font-weight:bold;">(అస్తం)</span>' : ''}
                </td>
                <td style="font-weight:bold;">${d.rashiTe}</td>
                <td translate="no" dir="ltr" class="notranslate" style="font-family:monospace;font-weight:bold;color:#92400e;white-space:nowrap;">${d.degreeFormatted}</td>
                <td>${d.nakshatraTe} (${d.pada}వ పాదం)</td>
                <td style="font-weight:bold;color:#047857;">${d.navamshaRashiTe}</td>
                <td><span class="badge ${badgeClass}">${d.dignityTe}</span></td>
                <td style="font-size:11px;">
                  ${d.isVargottama ? '<span class="badge badge-gold">వర్గోత్తమం</span> ' : ''}
                  ${d.isCombust ? '<span class="badge badge-red">అస్తంగతం</span> ' : ''}
                  ${d.dignityNotesTe}
                </td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>

      <!-- Neecha Bhanga Raja Yoga Detailed Evaluation -->
      <div class="section-card" style="background:#fffbeb;border:1.5px solid #d97706;margin-top:14px;">
        <h4 style="color:#92400e;">✦ నీచ భంగ రాజయోగ సమగ్ర పరిశీలన (Neecha Bhanga Analysis)</h4>
        <div style="font-size:12px;line-height:1.6;color:#1e293b;">
          ${neechaBhangaList.length > 0
            ? `<ul style="margin:6px 0 6px 18px;padding:0;">
                ${neechaBhangaList
                  .map(
                    (nb) =>
                      `<li style="margin-bottom:4px;"><strong>${nb.planetTe} (${nb.debilitationRashiTe}):</strong> ${nb.cancellationTypeTe} — ${nb.explanationTe}</li>`
                  )
                  .join('')}
              </ul>`
            : `<p>ఈ జాతకంలో నీచ స్థితి పొందిన గ్రహాలు లేవు.</p>`}
        </div>
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · గ్రహ బల దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 5: CLASSICAL YOGAS & DOSHAS DETECTION
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · యోగ &amp; దోష పరిశీలన</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 5 · శాస్త్రోక్త రాజయోగాలు &amp; విశేష దోష తనిఖీ</div>
      <div class="chapter-subtitle">Classical Yoga &amp; Dosha Formations (Guru-Chandala, Gandanta, Budhaditya, Sade Sati)</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${yogas
          .map((y) => {
            const isAuspicious = y.category === 'raja' || y.category === 'dhana';
            const badgeText =
              y.category === 'raja'
                ? 'రాజయోగం'
                : y.category === 'dhana'
                ? 'ధనయోగం'
                : y.category === 'dosha'
                ? 'దోష పరిశీలన'
                : 'విశేష యోగం';
            return `
              <div class="section-card" style="border-left:4px solid ${isAuspicious ? '#10b981' : '#f59e0b'};">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <strong style="font-size:13px;color:#451a03;">${y.nameTe}</strong>
                  <span class="badge ${isAuspicious ? 'badge-green' : 'badge-gold'}">${badgeText}</span>
                </div>
                <p style="font-size:11.5px;line-height:1.5;color:#334155;">${y.descriptionTe}</p>
                ${y.remedyTe
                  ? `<div style="font-size:11px;color:#047857;margin-top:4px;border-top:1px dashed #fde68a;padding-top:3px;">
                      <strong>పరిహారం / ప్రభావం:</strong> ${y.remedyTe}
                    </div>`
                  : ''}
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · యోగ దోష దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 6: SAPTAMA BHAVA (7TH HOUSE) MARRIAGE & TRIPLE KUJA DOSHA
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · వైవాహిక &amp; కుజ దోష విశ్లేషణ</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 6 · సప్తమ భావ (7th House) వివాహ, భాగస్వామి &amp; కుజ దోష విశ్లేషణ</div>
      <div class="chapter-subtitle">Comprehensive Future Spouse Profile, Love vs Arranged Yoga, Dynamic Marriage Timing &amp; Triple Kuja Dosha</div>

      <!-- Triple Kuja Dosha Verification Box -->
      <div class="section-card" style="background:#fff7ed;border:1.5px solid #ea580c;">
        <h4 style="color:#9a3412;">✦ త్రివిధ కుజ దోష పరిశీలన (Lagna, Chandra Lagna &amp; Shukra Lagna)</h4>
        <p style="font-size:12px;font-weight:bold;color:#7c2d12;">${tripleKuja.summaryTitleTe}</p>
        <p style="font-size:11.5px;color:#7c2d12;">${tripleKuja.detailedAnalysisTe}</p>
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-top:8px;">
          <div style="background:#ffffff;padding:8px;border-radius:6px;border:1px solid #fed7aa;font-size:11px;">
            <strong>1. జన్మ లగ్నం నుండి:</strong><br/>
            కుజుడు ${tripleKuja.fromLagna.house}వ స్థానంలో ఉన్నాడు —
            <span style="font-weight:bold;color:${tripleKuja.fromLagna.hasDosha ? '#b91c1c' : '#15803d'};">
              ${tripleKuja.fromLagna.hasDosha ? 'దోషముంది' : 'దోషం లేదు'}
            </span>
          </div>
          <div style="background:#ffffff;padding:8px;border-radius:6px;border:1px solid #fed7aa;font-size:11px;">
            <strong>2. చంద్ర లగ్నం నుండి:</strong><br/>
            కుజుడు ${tripleKuja.fromChandra.house}వ స్థానంలో ఉన్నాడు —
            <span style="font-weight:bold;color:${tripleKuja.fromChandra.hasDosha ? '#b91c1c' : '#15803d'};">
              ${tripleKuja.fromChandra.hasDosha ? 'దోషముంది (అష్టమ కుజుడు)' : 'దోషం లేదు'}
            </span>
          </div>
          <div style="background:#ffffff;padding:8px;border-radius:6px;border:1px solid #fed7aa;font-size:11px;">
            <strong>3. శుక్ర లగ్నం నుండి:</strong><br/>
            కుజుడు ${tripleKuja.fromShukra.house}వ స్థానంలో ఉన్నాడు —
            <span style="font-weight:bold;color:${tripleKuja.fromShukra.hasDosha ? '#b91c1c' : '#15803d'};">
              ${tripleKuja.fromShukra.hasDosha ? 'దోషముంది' : 'దోషం లేదు'}
            </span>
          </div>
        </div>
        <p style="font-size:11px;color:#9a3412;margin-top:6px;">
          <strong>పరిహారం:</strong> ${tripleKuja.recommendedRemedyTe}
        </p>
      </div>

      <!-- Dynamic Marriage Timing Window -->
      <div class="section-card" style="background:#f0fdf4;border:1.5px solid #16a34a;">
        <h4 style="color:#166534;">⏳ శాస్త్రోక్త వివాహ కాల నిర్ణయం (Dynamic Marriage Timing &amp; Favorable Age)</h4>
        <p style="font-size:12.5px;font-weight:bold;color:#14532d;">${marriageTiming.primaryRecommendationTe}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
          ${marriageTiming.currentFavorableWindows
            .map(
              (w) => `<div style="background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #bbf7d0;font-size:11.5px;">
                <strong style="color:#166534;">${w.period} (${w.ageSpan}):</strong><br/>
                <span style="color:#1e293b;">${w.transitNoteTe}</span>
              </div>`
            )
            .join('')}
        </div>
      </div>

      <!-- Spouse Nature, Career & Love vs Arranged -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="section-card">
          <h4>1. జీవిత భాగస్వామి రూపం, స్వభావం &amp; వృత్తి</h4>
          <p>${saptamaMarriage.spouseAppearanceAndNatureTe}</p>
          <p style="border-top:1px dashed #fde68a;padding-top:4px;color:#047857;font-weight:bold;">
            ${saptamaMarriage.spouseCareerAndFamilyTe}
          </p>
        </div>
        <div class="section-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <h4 style="margin:0;">2. ప్రేమ vs పెద్దల వివాహం</h4>
            <span class="badge badge-green">${saptamaMarriage.marriageTypeBadgeTe}</span>
          </div>
          <p>${saptamaMarriage.marriageTypeAnalysisTe}</p>
          <div style="border-top:1px dashed #fde68a;padding-top:4px;font-size:11.5px;color:#78350f;">
            <strong>శాంతి నియమం:</strong> ${saptamaMarriage.remedyMetalAndDayTe} · ${saptamaMarriage.remedyJapaScheduleTe}
          </div>
        </div>
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · వైవాహిక దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 7: LAGNA & 144 SUN-MOON ARCHETYPE SYNTHESIS
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ఆత్మ-మనఃకారక సంయోగం</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 7 · జన్మ లగ్న, సూర్య (ఆత్మ) &amp; చంద్ర (మనస్సు) 144 సంయోగ విశ్లేషణ</div>
      <div class="chapter-subtitle">Lagna Archetype, Sun in Cancer (${sunPlanet.degreeFormatted}) &amp; Moon in Scorpio Synthesis</div>

      <div class="section-card section-card-accent">
        <h4 style="color:#78350f;">
          లగ్నం: ${chartData.lagna.te} · సూర్య రాశి: ${sunMoon144.sunRashiTe} (ఆత్మ) · చంద్ర రాశి: ${sunMoon144.moonRashiTe} (మనస్సు)
        </h4>
        <p><strong>దేహ స్వభావం:</strong> ${lagnaProfile.dehaSwabhavamTe} ${lagnaProfile.lagnaLordEffectTe}</p>
        <p><strong>ప్రధాన జీవన తత్వం:</strong> ${sunMoon144.themesTe}</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="section-card">
          <h4>వ్యక్తిత్వం, స్వభావం, విద్య &amp; వృత్తి</h4>
          <p>${sunMoon144.personalityTe}</p>
          <p style="border-top:1px dashed #fde68a;padding-top:4px;color:#78350f;font-weight:bold;">
            ${sunMoon144.careerAndWealthTe}
          </p>
        </div>
        <div class="section-card">
          <h4>ప్రేమ, దాంపత్యం &amp; కుటుంబ సంబంధాలు</h4>
          <p>${sunMoon144.relationshipsTe} ${lagnaProfile.manoSwabhavamTe}</p>
          <div style="border-top:1px dashed #fde68a;padding-top:4px;font-size:11px;color:#78350f;font-style:italic;">
            <strong>జీవన ప్రతీక:</strong> ${sunMoon144.imageForIntegrationTe}
          </div>
        </div>
        <div class="section-card" style="background:#ecfdf5;border-color:#10b981;">
          <h4 style="color:#065f46;">✓ సహజ బలాలు &amp; ఆధ్యాత్మిక ఉపాసన</h4>
          <p style="color:#064e3b;">${sunMoon144.strengthsTe}. ${sunMoon144.spiritualPathTe}</p>
        </div>
        <div class="section-card" style="background:#fffbeb;border-color:#f59e0b;">
          <h4 style="color:#92400e;">! తీసుకోవలసిన జాగ్రత్తలు &amp; జీవన లక్ష్యం</h4>
          <p style="color:#78350f;">${sunMoon144.weaknessesTe} ${lagnaProfile.lifeMissionTe}</p>
        </div>
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ఆత్మ-మనస్సు దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 8: PANCHABHUTA ELEMENTAL PLANETARY STRENGTH
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · పంచభూత తత్వ బలం</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 8 · పంచభూత తత్వ సప్తగ్రహ బల &amp; శాంతి ఉపాసన</div>
      <div class="chapter-subtitle">Elemental Harmony (Fire, Earth, Air, Water) &amp; Vedic Planetary Upasana</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${elementStrengths
          .map((item) => `
            <div class="section-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <strong style="font-size:13px;color:#451a03;">${item.planetTe} — ${item.rashiTe} · ${item.elementTe}</strong>
                <span class="badge ${item.tier === 'best' ? 'badge-green' : item.tier === 'second' ? 'badge-gold' : 'badge-purple'}">
                  ${item.tierLabelTe}
                </span>
              </div>
              <div style="font-size:10.5px;font-weight:bold;color:#78350f;margin-bottom:3px;">
                లగ్నం నుండి స్థానం: ${item.houseNameTe}
              </div>
              <p style="font-size:11.5px;line-height:1.5;">${item.analysisTe}</p>
              <div style="font-size:11px;color:#047857;border-top:1px dashed #fde68a;padding-top:3px;margin-top:4px;">
                🙏 <strong>ఆరాధన:</strong> ${item.remedyTe}
              </div>
            </div>
          `)
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · తత్వ బల దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 9: BHRIGU & NADI SPECIAL PREDICTIVE SUTRAS
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · భృగు విశేష సూత్రాలు</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 9 · భృగు చక్ర పద్ధతి జన్మ మాస నియమాలు &amp; విశేష ఫల సూత్రాలు</div>
      <div class="chapter-subtitle">Bhrigu Nadi Special Sutras, Saturn 2nd-House Karma Rule &amp; Wealth Axioms</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${specialSutras
          .map((sutra, idx) => `
            <div class="section-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span style="font-size:10px;font-weight:bold;color:#78350f;">సూత్రం #${idx + 1}</span>
                <span class="badge badge-gold">${sutra.badgeTe}</span>
              </div>
              <h4 style="margin:0 0 4px 0;">${sutra.titleTe}</h4>
              <p style="font-size:11.5px;line-height:1.5;">${sutra.descriptionTe}</p>
              <div style="font-size:11px;color:#78350f;background:#fffbeb;padding:5px 8px;border-radius:6px;border:1px solid #fef3c7;margin-top:6px;">
                💡 <strong>శర్మ గారి సలహా:</strong> ${sutra.remedyOrAdviceTe}
              </div>
            </div>
          `)
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · భృగు సూత్ర దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 10: LIFE EVENT PROBABILITY TIMELINE (% Windows)
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ఈవెంట్ సంభావ్యతా టైమ్‌లైన్</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 10 · జీవిత కీలక ఘట్టాల కాల నిర్ణయం (% Probability Windows)</div>
      <div class="chapter-subtitle">Multi-Factor Predictive Windows for Career Peak, Marriage, Wealth &amp; Foreign Travel</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${eventTimelines
          .map((ev) => `
            <div class="section-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <strong style="font-size:13px;color:#451a03;">${ev.categoryTe}</strong>
                <span class="badge badge-green" style="font-size:12px;">${ev.probabilityScore}%</span>
              </div>
              <div style="background:#fef3c7;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:bold;color:#78350f;margin-bottom:6px;">
                అనుకూల వయస్సు: ${ev.peakAgeBracketTe} (${ev.calendarYearsTe})
              </div>
              <p style="font-size:11.5px;line-height:1.5;">${ev.analysisTe}</p>
              <div style="font-size:11px;color:#047857;margin-top:4px;">
                ✦ <strong>కారక గ్రహాలు:</strong> ${ev.primaryPlanetsTe}
              </div>
              <div style="font-size:11px;color:#78350f;background:#fffdf5;padding:4px 8px;border-radius:4px;border:1px solid #fde68a;margin-top:4px;">
                🙏 <strong>సలహా:</strong> ${ev.sharmaAdviceTe}
              </div>
            </div>
          `)
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ఈవెంట్ టైమ్‌లైన్ దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 11: SARVASHTAKAVARGA 337 BINDUS MATRIX
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · సర్వాష్టకవర్గ 337 బిందువులు</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 11 · సార్వభౌమ అష్టకవర్గ 12-భావ బలం (Sarvashtakavarga 337 Bindus)</div>
      <div class="chapter-subtitle">12 Rashi Bindu Distribution, Peak Fortune Houses &amp; 10th vs 11th Income Axiom</div>

      <!-- Axiom Box -->
      <div class="section-card" style="background:#451a03;color:#ffffff;border:1.5px solid #d97706;">
        <h4 style="color:#fcd34d;border-color:#d97706;">★ శాస్త్రోక్త రాజ్య (10వ) vs లాభ (11వ) భావ అష్టకవర్గ సూత్రం</h4>
        <p style="color:#fef3c7;font-size:12px;line-height:1.6;">
          ${ashtakavargaMatrix.incomeVsExpenditureYogaTe}
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-top:10px;">
        ${ashtakavargaMatrix.houses
          .map((h) => {
            const isHigh = h.bindus >= 30;
            const isLow = h.bindus < 25;
            return `
              <div style="border:1.2px solid ${isHigh ? '#10b981' : isLow ? '#f87171' : '#d97706'};background:${isHigh ? '#f0fdf4' : isLow ? '#fef2f2' : '#ffffff'};padding:8px;border-radius:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-size:10.5px;font-weight:bold;color:#78350f;">${h.houseNumber}వ స్థానం</span>
                  <span style="font-size:13px;font-weight:900;color:${isHigh ? '#15803d' : isLow ? '#b91c1c' : '#78350f'};">${h.bindus}</span>
                </div>
                <strong style="font-size:11.5px;color:#451a03;display:block;margin-top:2px;">${h.bhavaNameTe}</strong>
                <span style="font-size:10px;color:#64748b;">(${h.rashiTe})</span>
                <p style="font-size:10.5px;line-height:1.4;margin:4px 0;color:#334155;">${h.interpretationTe}</p>
                <div style="font-size:9.5px;color:#047857;border-top:1px dashed #e2e8f0;padding-top:2px;">${h.remedyTe}</div>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · అష్టకవర్గ దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 12: COMPLETE 12 HOUSES (DWADASHA BHAVAS) PARASHARI ANALYSIS
        ========================================================================== -->
    <div class="chapter-break">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ద్వాదశ స్థాన ఫలితాలు (1-12)</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 12 · ద్వాదశ స్థాన సంపూర్ణ జీవిత ఫలితాలు (1 నుండి 12 స్థానాల సమగ్ర విశ్లేషణ)</div>
      <div class="chapter-subtitle">Exhaustive Parashari House-by-House Destiny Analysis from Lagna (${chartData.lagna.te})</div>

      <div style="display:grid;grid-template-columns:1fr;gap:12px;">
        ${all12Houses
          .map((houseItem) => {
            return `
              <div class="section-card keep-together">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;border-bottom:1px dashed #fde68a;padding-bottom:3px;">
                  <div>
                    <span style="font-size:11px;font-weight:900;color:#78350f;background:#fef3c7;padding:2px 8px;border-radius:4px;border:0.5px solid #d97706;margin-right:6px;">
                      ${houseItem.houseNumber}వ స్థానం
                    </span>
                    <strong style="font-size:14px;color:#451a03;">${houseItem.bhavaTitleTe}</strong>
                  </div>
                  <div style="font-size:11.5px;font-weight:bold;color:#047857;">
                    రాశి: ${houseItem.rashiInHouseTe} · అధిపతి: ${houseItem.lordTe} (${houseItem.lordPlacedInHouse}వ ఇంట)
                  </div>
                </div>

                ${houseItem.occupantPlanetsTe.length > 0
                  ? `<div style="font-size:11.5px;font-weight:bold;color:#991b1b;margin-bottom:4px;">
                      ఈ స్థానంలోని గ్రహాలు: ${houseItem.occupantPlanetsTe.join(', ')}
                    </div>`
                  : ''}

                <p style="font-size:12px;line-height:1.6;color:#334155;">
                  ${houseItem.detailedPredictionTe}
                </p>

                <div style="font-size:11.5px;font-weight:bold;color:#78350f;margin-top:4px;border-top:1px dashed #fde68a;padding-top:4px;">
                  ✦ మార్గదర్శకత్వం: <span style="font-weight:normal;color:#1e293b;">${houseItem.guidanceTe}</span>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ద్వాదశ స్థాన దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 13: 9 PLANETS IN HOUSES & D9 NAVAMSHA ANALYSIS
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · నవగ్రహ ఫలితాలు</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 13 · నవగ్రహ రాశి, నక్షత్ర పాద &amp; నవాంశ (D9) ఫలితాలు</div>
      <div class="chapter-subtitle">Individual Placements &amp; Predictive Consequences for All 9 Planetary Forces</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${bhavaPredictions
          .map((bp) => `
            <div class="section-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <strong style="font-size:13px;color:#451a03;">${bp.planetTe} — ${bp.rashiTe} (${bp.degreeFormatted})</strong>
                <span class="badge badge-gold">${bp.houseNumber}వ ఇల్లు (${bp.bhavaNameTe})</span>
              </div>
              <p style="font-size:11.5px;line-height:1.5;">${bp.predictionTe}</p>
              <div style="font-size:11px;color:#047857;border-top:1px dashed #fde68a;padding-top:3px;margin-top:4px;">
                ✦ <strong>నవాంశ (${bp.navamshaRashiTe}) &amp; విశేష ఫలం:</strong> ${bp.deepAnalysisTe}
              </div>
            </div>
          `)
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · నవగ్రహ దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 14: 96-YEAR BHRIGU LIFE PROGRESSION TIMELINE
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · 96 ఏళ్ల భృగు చక్ర కాలచక్రం</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 14 · 96 ఏళ్ల భృగు చక్ర పద్ధతి జీవన కాలచక్ర ప్రస్థానం</div>
      <div class="chapter-subtitle">96-Year Bhrigu Life Progression Timeline (12-Year Cycles 1 to 8)</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${bhriguCycles
          .map((c) => {
            return `
              <div class="section-card">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="font-size:12.5px;color:#451a03;">చక్రం #${c.cycleNumber} (${c.ageRangeTe})</strong>
                  <span class="badge badge-gold">${c.yearRange}</span>
                </div>
                <div style="font-size:11px;font-weight:bold;color:#78350f;margin-top:2px;">
                  క్రియాశీల భావం: ${c.activatedHouse}వ ఇల్లు · ${c.themeTe}
                </div>
                <p style="font-size:11.5px;line-height:1.5;margin-top:4px;">${c.predictionTe}</p>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · భృగు చక్ర దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 15: COMPLETE 120-YEAR VIMSHOTTARI MAHADASHA & ANTARDASHA TIMELINE
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · వింశోత్తరి మహాదశలు</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 15 · 120 ఏళ్ల వింశోత్తరి మహాదశ &amp; అంతర్దశ కాలచక్రం (ఖచ్చిత తేదీలతో)</div>
      <div class="chapter-subtitle">Complete 120-Year Vimshottari Mahadasha + Antardasha Sequence &amp; Birth Balance</div>

      <div class="section-card" style="background:#ecfdf5;border-color:#10b981;">
        <h4 style="color:#065f46;">🌟 ప్రస్తుత క్రియాశీల మహాదశ: ${dashaInfo.currentMahadasha.lordTe} (${dashaInfo.currentMahadasha.startDate} నుండి ${dashaInfo.currentMahadasha.endDate})</h4>
        <p style="font-size:12px;font-weight:bold;color:#064e3b;">
          క్రియాశీల అంతర్దశ: ${dashaInfo.currentAntardasha.lordTe} (${dashaInfo.currentAntardasha.startDate} నుండి ${dashaInfo.currentAntardasha.endDate})
        </p>
        <p style="font-size:11.5px;color:#047857;">
          జన్మ నక్షత్రం (${chartData.nakshatraName}) ఆధారంగా పుట్టిన సమయానికి శని మహాదశా శేషం: ${dashaInfo.janmaDashaBalanceFormattedTe}
        </p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${dashaInfo.mahadashas
          .map((md) => {
            const isCurrent = md.isCurrent;
            return `
              <div class="section-card" style="border:1.5px solid ${isCurrent ? '#b45309' : '#d97706'};background:${isCurrent ? '#fffbeb' : '#ffffff'};">
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #fde68a;padding-bottom:4px;margin-bottom:4px;">
                  <strong style="font-size:13px;color:#451a03;">${md.lordTe} మహాదశ</strong>
                  <span style="font-family:monospace;font-size:11px;font-weight:bold;color:#78350f;">
                    ${md.startDate} – ${md.endDate}
                  </span>
                </div>
                ${isCurrent ? '<span class="badge badge-green" style="margin-bottom:4px;">ప్రస్తుతం నడుస్తున్న మహాదశ</span>' : ''}
                <div style="margin-top:6px;font-size:10.5px;">
                  <strong style="color:#78350f;display:block;margin-bottom:2px;">అంతర్దశల వరుస క్రమం (Bhuktis):</strong>
                  <div style="display:flex;flex-wrap:wrap;gap:4px;">
                    ${md.antardashas
                      .map(
                        (ad) => `<span style="background:${ad.isCurrent ? '#fef08a' : '#f8fafc'};padding:1px 5px;border-radius:3px;border:0.5px solid #cbd5e1;color:${ad.isCurrent ? '#991b1b' : '#334155'};">
                          ${ad.lordTe} (${ad.startDate} - ${ad.endDate})
                        </span>`
                      )
                      .join('')}
                  </div>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · దశా కాలచక్ర దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 16: NEXT 12 MONTHS GOCHARA TRANSIT FORECAST
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · రాబోయే 12 నెలల గోచారం</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 16 · రాబోయే 12 నెలల గోచార గ్రహ సంచార ఫలితాలు (Gochara Forecast)</div>
      <div class="chapter-subtitle">Major Transits of Jupiter (గురుడు), Saturn (శని), and Rahu-Ketu relative to Moon (${chartData.rashi.te})</div>

      <div style="display:grid;grid-template-columns:1fr;gap:12px;">
        ${gochara12m
          .map((g) => `
            <div class="section-card">
              <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #fde68a;padding-bottom:4px;margin-bottom:6px;">
                <strong style="font-size:13.5px;color:#451a03;">${g.planetTe} గోచారం (${g.transitRashiTe} రాశిలో)</strong>
                <span style="font-family:monospace;font-size:11.5px;font-weight:bold;color:#78350f;">${g.keyDates}</span>
              </div>
              <div style="font-size:11.5px;font-weight:bold;color:#047857;margin-bottom:4px;">
                చంద్ర రాశి నుండి: ${g.houseFromMoon}వ ఇల్లు · జన్మ లగ్నం నుండి: ${g.houseFromLagna}వ ఇల్లు
              </div>
              <p style="font-size:12px;line-height:1.55;color:#334155;">${g.predictionTe}</p>
            </div>
          `)
          .join('')}
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · గోచార దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 17: DIVISIONAL CHARTS (VARGA CHAKRAS)
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · వర్గ చక్రాలు</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 17 · విశేష వర్గ చక్రాలు (Divisional Charts)</div>
      <div class="chapter-subtitle">Chandra Lagna, D10 Dashamsha (Career), D7 Saptamsha (Progeny) &amp; D12 Dwadashamsha</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="section-card">
          <h4>1. చంద్ర లగ్న చక్రం (Chandra Kundali)</h4>
          <p style="font-size:11.5px;">చంద్ర లగ్నం: ${divisional.chandraLagnaRashiTe} (మనో బలం &amp; భావోద్వేగ విశ్లేషణ)</p>
          <div style="font-size:11px;color:#78350f;margin-top:4px;">
            చంద్రుడితో ఉన్న గ్రహాలు: ${chartData.planets.filter((p) => p.rashiIdx === moonRashiIdx && p.id !== 'moon').map((p) => p.nameTe).join(', ') || 'కేంద్ర గ్రహ ఆధారం (కేమద్రుమ భంగం)'}
          </div>
        </div>

        <div class="section-card">
          <h4>2. దశాంశ చక్రం (D10 Dashamsha - Career &amp; Status)</h4>
          <p style="font-size:11.5px;">వృత్తి, కీర్తి, ప్రభుత్వ గౌరవం &amp; ఉన్నత నాయకత్వ స్థానాల సూక్ష్మ బలం</p>
          <div style="font-size:11px;color:#047857;margin-top:4px;">
            దశాంశ లగ్నం: ${RASHI_NAMES_TE[divisional.d10DashamshaLagnaIdx]} · ప్రధాన వృత్తి కారకుడు: శని &amp; సూర్యుడు
          </div>
        </div>

        <div class="section-card">
          <h4>3. సప్తాంశ చక్రం (D7 Saptamsha - Children &amp; Legacy)</h4>
          <p style="font-size:11.5px;">సంతాన సౌఖ్యం, వంశాభివృద్ధి &amp; భావితరాల పుణ్య ఫలం</p>
          <div style="font-size:11px;color:#78350f;margin-top:4px;">
            సప్తాంశ లగ్నం: ${RASHI_NAMES_TE[divisional.d7SaptamshaLagnaIdx]} · గురు దృష్టి మరియు పంచమాధిపతి శుభ బలం
          </div>
        </div>

        <div class="section-card">
          <h4>4. ద్వాదశాంశ చక్రం (D12 Dwadashamsha - Ancestral Heritage)</h4>
          <p style="font-size:11.5px;">మాతా-పితృ సౌఖ్యం, పితృ కర్మ బలం &amp; పూర్వ జన్మ సంస్కారాలు</p>
          <div style="font-size:11px;color:#78350f;margin-top:4px;">
            ద్వాదశాంశ లగ్నం: ${RASHI_NAMES_TE[divisional.d12DwadashamshaLagnaIdx]} · పితృ కారక సూర్య బలం మరియు ధర్మ స్థితి
          </div>
        </div>
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · వర్గ చక్ర దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 18: SACRED REMEDIES CALENDAR & GEMSTONE SAFETY
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · వేద పరిహార క్యాలెండర్</span>
        <span>${siteUrl}</span>
      </div>

      <div class="chapter-title">అధ్యాయం 18 · వేద శాంతి పరిహారాల క్యాలెండర్ &amp; రత్న ధారణ భద్రతా నియమాలు</div>
      <div class="chapter-subtitle">Custom Remedial Schedule, Stotras, Charity &amp; Gemstone Safety Advisory</div>

      <!-- Critical Gemstone Warning Box -->
      <div class="section-card" style="background:#fef2f2;border:2px solid #ef4444;">
        <h4 style="color:#991b1b;">⚠️ రత్న ధారణ అత్యంత ముఖ్యమైన భద్రతా హెచ్చరిక (Gemstone Safety Advisory)</h4>
        <p style="font-size:12px;font-weight:bold;color:#7f1d1d;line-height:1.55;">
          "ఏ రత్నాన్నైనా ధరించే ముందు ఖచ్చితంగా సిద్ధాంతుల వారిని (గురువుగారిని) వ్యక్తిగతంగా సంప్రదించి మాత్రమే ధరించాలి."
        </p>
        <p style="font-size:11.5px;color:#991b1b;margin-top:4px;">
          ముఖ్యంగా గ్రహం నీచ స్థితిలో ఉన్నా, అస్తంగతమైనా (సూర్యుడికి దగ్గరగా ఉండి బలహీనపడినా), లేదా వక్ర గతిలో ఉన్నా సంబంధిత రత్నాన్ని ధరిస్తే ప్రతికూల ప్రభావాలు కలిగే ప్రమాదం ఉంది. మీ జాతకంలో బుధుడు అస్తంగతమై ఉన్నందున మరియు శుక్రుడు, చంద్రుడు నీచ స్థితులలో ఉన్నందున పచ్చ, వజ్రం లేదా ముత్యం ధరించే ముందు గురువుగారి అనుమతి తప్పనిసరి!
        </p>
      </div>

      <!-- Remedial Schedule Calendar Table -->
      <table class="data-table" style="margin-top:14px;">
        <thead>
          <tr>
            <th>వారం &amp; అధిపతి</th>
            <th>ఆరాధించవలసిన దైవం</th>
            <th>పారాయణ స్తోత్రం / మంత్రం</th>
            <th>దాన వస్తువులు</th>
            <th>కాల పరిమితి (వారాలు)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:bold;color:#78350f;">సోమవారం (చంద్రుడు)</td>
            <td>శ్రీ పరమేశ్వరుడు / శివుడు</td>
            <td>శివ పంచాక్షరి, శివ కవచం</td>
            <td>బియ్యం, పాలు, తెల్లని వస్త్రాలు</td>
            <td>16 సోమవారాలు</td>
          </tr>
          <tr>
            <td style="font-weight:bold;color:#78350f;">మంగళవారం (కుజుడు)</td>
            <td>శ్రీ సుబ్రహ్మణ్య స్వామి / ఆంజనేయ స్వామి</td>
            <td>సుబ్రహ్మణ్య అష్టకం, హనుమాన్ చాలీసా</td>
            <td>కందులు, ఎర్రని వస్త్రాలు, బెల్లం</td>
            <td>21 మంగళవారాలు</td>
          </tr>
          <tr>
            <td style="font-weight:bold;color:#78350f;">బుధవారం (బుధుడు)</td>
            <td>శ్రీ మహాలక్ష్మి / శ్రీ మహావిష్ణువు</td>
            <td>విష్ణు సహస్రనామ స్తోత్రం</td>
            <td>పెసలు, ఆకుకూరలు, గోసేవ (గడ్డి)</td>
            <td>17 బుధవారాలు</td>
          </tr>
          <tr>
            <td style="font-weight:bold;color:#78350f;">గురువారం (గురువు)</td>
            <td>శ్రీ దత్తాత్రేయుడు / దక్షిణామూర్తి</td>
            <td>గురు స్తోత్రం, దత్త స్తోత్రం</td>
            <td>శనగలు, పసుపు వర్ణ వస్త్రాలు</td>
            <td>16 గురువారాలు</td>
          </tr>
          <tr>
            <td style="font-weight:bold;color:#78350f;">శుక్రవారం (శుక్రుడు)</td>
            <td>శ్రీ లక్ష్మీ గణపతి / కనకదుర్గ</td>
            <td>శ్రీ సూక్తం, కనకధారా స్తోత్రం</td>
            <td>బొబ్బర్లు, పంచదార, నెయ్యి దీపం</td>
            <td>20 శుక్రవారాలు</td>
          </tr>
          <tr>
            <td style="font-weight:bold;color:#78350f;">శనివారం (శని &amp; రాహు-కేతు)</td>
            <td>శ్రీ వెంకటేశ్వర స్వామి / రుద్రుడు</td>
            <td>దశరథ ప్రోక్త శని స్తోత్రం</td>
            <td>నువ్వులు, నూనె దీపం, నల్ల వస్త్రాలు</td>
            <td>19 శనివారాలు</td>
          </tr>
        </tbody>
      </table>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · పరిహార దర్శిని</span>
        <span><a href="https://${siteUrl}">${siteUrl}</a></span>
      </div>
    </div>

    <!-- ==========================================================================
        CHAPTER 19: PANDIT SEAL, WHATSAPP CONSULTATION & PRIVACY DISCLAIMER
        ========================================================================== -->
    <div class="chapter-break keep-together">
      <div class="print-running-header">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ఆశీస్సులు &amp; చట్టబద్ధ ప్రకటన</span>
        <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer">${siteUrl}</a>
      </div>

      <div class="chapter-title">అధ్యాయం 19 · సిద్ధాంతుల వారి ఆశీస్సులు, సంప్రదింపులు &amp; గోప్యతా ప్రకటన</div>
      <div class="chapter-subtitle">Chief Astrologer Endorsement, WhatsApp Consultation &amp; DPDP Act 2023 Compliance</div>

      <!-- Chief Pandit Endorsement Box -->
      <div style="border:2.5px solid #78350f;border-radius:12px;background:#fffdf5;padding:16px 20px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;">
          <div style="display:flex;align-items:center;gap:14px;">
            <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="display:block;width:72px;height:72px;border-radius:50%;padding:2px;background:linear-gradient(135deg,#f59e0b,#fef08a,#d97706);flex-shrink:0;">
              <img src="${heroPhotoUrl}" alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు" width="68" height="68" style="width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:top;border:1.5px solid #78350f;" />
            </a>
            <div>
              <div style="font-size:11px;font-weight:bold;color:#78350f;text-transform:uppercase;">సిద్ధాంత విశ్లేషణ &amp; వేదాశీర్వాదం:</div>
              <div style="font-size:18px;font-weight:900;color:#451a03;margin:3px 0;">
                <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="color:#451a03;text-decoration:underline;">బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</a>
              </div>
              <div style="font-size:12px;color:#78350f;font-weight:700;">స్మార్త వైదిక &amp; వేద జ్యోతిష పరిశోధకులు</div>
              <div style="font-size:12px;color:#1e293b;margin-top:4px;">
                శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · హైదరాబాద్, తెలంగాణ<br/>
                ఫోన్ / అధికారిక వాట్సాప్: <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer" style="color:#047857;font-weight:900;text-decoration:underline;">+91 89779 86166</a><br/>
                అధికారిక వెబ్‌సైట్: <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="color:#991b1b;font-weight:900;text-decoration:underline;">🌐 ${fullSiteHref}</a>
              </div>
              <div style="font-size:11.5px;color:#047857;margin-top:6px;font-style:italic;">
                "సర్వే భవంతు సుఖినః సర్వే సంతు నిరామయాః · సర్వే భద్రాణి పశ్యంతు మా కశ్చిద్దుఃఖభాగ్‌భవేత్"
              </div>
            </div>
          </div>

          <div style="text-align:center;border:1.5px solid #b45309;padding:10px 14px;border-radius:10px;background:#ffffff;min-width:150px;">
            <div style="font-size:10px;font-weight:bold;color:#78350f;margin-bottom:4px;">గురువుగారి వాట్సాప్ &amp; సైట్</div>
            <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer" style="display:block;padding:8px;background:#ecfdf5;border:1.5px solid #10b981;border-radius:8px;font-size:10.5px;font-weight:900;color:#065f46;text-decoration:underline;line-height:1.4;margin-bottom:6px;">
              💬 వాట్సాప్ సంప్రదింపు<br/>
              +91 89779 86166
            </a>
            <a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer" style="display:block;padding:5px 8px;background:#fef3c7;border:1px solid #d97706;border-radius:6px;font-size:9.5px;font-weight:900;color:#991b1b;text-decoration:underline;">
              🌐 ${siteUrl}
            </a>
          </div>
        </div>
      </div>

      <!-- Legal Disclaimer & Privacy Note -->
      <div class="section-card" style="background:#f8fafc;border-color:#cbd5e1;font-size:11px;line-height:1.5;color:#475569;">
        <h4 style="color:#475569;border-color:#cbd5e1;">📜 శాస్త్రోక్త జ్యోతిష నియమ నిబంధనలు (Legal &amp; Astrological Disclaimer)</h4>
        <p>
          1. <strong>శాస్త్రోక్త మార్గదర్శకత్వం:</strong> ఈ జాతక నివేదిక ప్రాచీన బృహత్ పరాశర హోరాశాస్త్రం, భృగు నంది నాడీ మరియు ఆధునిక ఖగోళ దృక్సిద్ధాంత గణితాల ఆధారంగా రూపొందించబడింది. ఇది ఒక ఆధ్యాత్మిక మరియు వ్యక్తిత్వ వికాస మార్గదర్శక పత్రిక మాత్రమే; ఇది ఎలాంటి వైద్య (Medical), న్యాయ (Legal), లేదా ఆర్థిక (Financial) సలహాలకు ప్రత్యామ్నాయం కాదు.
        </p>
        <p>
          2. <strong>డేటా భద్రత &amp; గోప్యత (DPDP Act 2023 Compliant):</strong> మీ పుట్టిన తేదీ, సమయం, ప్రాంతం మరియు వ్యక్తిగత వివరాలు డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ యాక్ట్ 2023 (Digital Personal Data Protection Act 2023) మార్గదర్శకాలకు అనుగుణంగా అత్యంత గోప్యంగా ఉంచబడతాయి. యూజర్ అభ్యర్థన మేరకు ఏ సమయంలోనైనా వివరాలను శాశ్వతంగా తొలగించే (Right to Deletion) పూర్తి హక్కు మీకు ఉంటుంది.
        </p>
        <p>
          3. <strong>ప్రతిఫల పూజలు:</strong> ఏదైనా దోష నివారణ పూజలు లేదా హోమముల కొరకు శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం వారిని నేరుగా సంప్రదించవచ్చు.
        </p>
      </div>

      <div class="print-running-footer">
        <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · సంపూర్ణ బృహత్ జాతక గ్రంథం ముగింపు</span>
        <span style="font-weight:900;"><a href="${fullSiteHref}" target="_blank" rel="noopener noreferrer">🌐 ${fullSiteHref}</a></span>
        <span>బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</span>
      </div>
    </div>

  </div>
</body>
</html>
`;
}
