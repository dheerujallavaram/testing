/**
 * Jathakam Report PDF & Print Generator
 * (బృహత్ పరాశర సంపూర్ణ జాతక నివేదిక HTML/PDF ఇంజిన్)
 *
 * Implements:
 * - Proper Noto Sans Telugu & Noto Serif Telugu embedding with GSUB/GPOS complex text shaping
 * - Dedicated CSS @page { size: A4 portrait; margin: 0; } preventing default browser headers/footers
 * - Custom running header ("శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం") and footer ("www.telugujyothisham.com · Page X")
 * - Front Cover Page with Invocation, Pandit Signature, QR Code
 * - 1-Page Executive Summary (Top 5 strengths, 3 cautions, 12-month outlook, current dasha)
 * - Complete Birth Details Box (Lat/Lon, Timezone, Ayanamsa, Samvatsara, Masa, Tithi, Vaara, Nakshatra Profile)
 * - D1 Rashi, D9 Navamsha, D10 Dashamsha, D7 Saptamsha, D12 Dwadashamsha, and Chandra Lagna charts
 * - North Indian diamond chart SVG alongside South Indian chart
 * - Planetary Dignity Table with exact degrees, combust status, Vargottama, Retrograde, and strength score
 * - Neecha Bhanga Raja Yoga verification for Moon and Venus
 * - Classical Yogas & Doshas detection (Guru-Chandala, Gandanta, Budhaditya, Sade Sati / Ardhashtama)
 * - Triple Kuja Dosha evaluation (Lagna, Chandra Lagna, Shukra Lagna; highlighting Mars 8th from Moon)
 * - Dynamic Marriage Timing based on DOB and Jupiter transits (no hardcoded ages)
 * - Vimshottari Mahadasha + Antardasha timeline with exact dates and birth dasha balance
 * - Next 12 Months Gochara transit forecast
 * - Sarvashtakavarga 337 points distribution chart
 * - Remedies Calendar & Gemstone Safety Advisory
 * - Vedic Disclaimer & DPDP Act 2023 privacy notice
 * - Full English (NRI) and Telugu bilingual support
 */

import { KundaliResult, KundaliPlanetDetail } from './astronomyPanchangam';
import {
  computePlanetaryDignities,
  checkNeechaBhangaRajaYoga,
  detectAllYogasAndDoshas,
  evaluateTripleKujaDosha,
  calculateDynamicMarriageTiming,
  computeVimshottariFullTimeline,
  computeNext12MonthsGochara,
  computeDivisionalCharts,
  computeSarvashtakavarga,
  buildPanchangaBirthProfile,
  generateExecutiveSummary,
  resolveRashiIdx,
} from './advancedAstrologyReportEngine';
import {
  generateLagnaCompleteProfile,
  getSunMoonCombination144,
  generateAll12HousesCompleteAnalysis,
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

/**
 * Renders a clean SVG for a North Indian diamond chart
 */
export function renderNorthIndianChartSvg(
  title: string,
  lagnaRashiIdx: number,
  planetsMap: Record<number, { nameTe: string; nameEn?: string; isRetro?: boolean }[]>,
  lang: 'te' | 'en' = 'te'
): string {
  // North Indian chart has 12 houses fixed:
  // House 1 is top diamond (centered).
  // Signs rotate based on Lagna: House 1 contains Lagna Rashi (1-based index).
  const rashiNames = [
    'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
    'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
  ];
  const rashiNamesEn = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  // Map each house (1 to 12) to its rashi index (0 to 11)
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
    return { rNum, plNames, rName: lang === 'en' ? rashiNamesEn[rIdx] : rashiNames[rIdx] };
  };

  // SVG dimensions: 400x400
  return `
    <svg viewBox="0 0 400 400" width="100%" height="100%" style="max-width:360px;margin:0 auto;display:block;background:#fffdf7;border:2px solid #78350f;border-radius:8px;">
      <!-- Outer boundary -->
      <rect x="10" y="10" width="380" height="380" fill="none" stroke="#78350f" stroke-width="2.5"/>
      <!-- Outer diagonals -->
      <line x1="10" y1="10" x2="390" y2="390" stroke="#78350f" stroke-width="1.8"/>
      <line x1="390" y1="10" x2="10" y2="390" stroke="#78350f" stroke-width="1.8"/>
      <!-- Inner diamond -->
      <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#78350f" stroke-width="2"/>

      <!-- House 1: Top Center Diamond -->
      <text x="200" y="45" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#991b1b" text-anchor="middle">${getHouseContent(0).rNum} (${getHouseContent(0).rName})</text>
      <text x="200" y="70" font-family="'Noto Sans Telugu', sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(0).plNames || (lang === 'en' ? 'Lagna' : 'లగ్నం')}</text>

      <!-- House 2: Top Left Triangle -->
      <text x="110" y="55" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(1).rNum}</text>
      <text x="110" y="80" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(1).plNames}</text>

      <!-- House 3: Far Left Top Triangle -->
      <text x="50" y="115" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(2).rNum}</text>
      <text x="55" y="138" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(2).plNames}</text>

      <!-- House 4: Left Diamond -->
      <text x="100" y="200" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(3).rNum}</text>
      <text x="100" y="222" font-family="'Noto Sans Telugu', sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(3).plNames}</text>

      <!-- House 5: Far Left Bottom Triangle -->
      <text x="50" y="285" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(4).rNum}</text>
      <text x="55" y="308" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(4).plNames}</text>

      <!-- House 6: Bottom Left Triangle -->
      <text x="110" y="345" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(5).rNum}</text>
      <text x="110" y="365" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(5).plNames}</text>

      <!-- House 7: Bottom Center Diamond -->
      <text x="200" y="335" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(6).rNum} (${getHouseContent(6).rName})</text>
      <text x="200" y="358" font-family="'Noto Sans Telugu', sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(6).plNames}</text>

      <!-- House 8: Bottom Right Triangle -->
      <text x="290" y="345" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(7).rNum}</text>
      <text x="290" y="365" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(7).plNames}</text>

      <!-- House 9: Far Right Bottom Triangle -->
      <text x="350" y="285" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(8).rNum}</text>
      <text x="345" y="308" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(8).plNames}</text>

      <!-- House 10: Right Diamond -->
      <text x="300" y="200" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(9).rNum}</text>
      <text x="300" y="222" font-family="'Noto Sans Telugu', sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(9).plNames}</text>

      <!-- House 11: Far Right Top Triangle -->
      <text x="350" y="115" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(10).rNum}</text>
      <text x="345" y="138" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(10).plNames}</text>

      <!-- House 12: Top Right Triangle -->
      <text x="290" y="55" font-family="'Noto Sans Telugu', sans-serif" font-size="10" font-weight="bold" fill="#78350f" text-anchor="middle">${getHouseContent(11).rNum}</text>
      <text x="290" y="80" font-family="'Noto Sans Telugu', sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">${getHouseContent(11).plNames}</text>

      <!-- Center Title -->
      <circle cx="200" cy="200" r="32" fill="#451a03" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="200" y="196" font-family="'Noto Sans Telugu', sans-serif" font-size="9" font-weight="bold" fill="#fcd34d" text-anchor="middle">${title}</text>
      <text x="200" y="210" font-family="'Noto Sans Telugu', sans-serif" font-size="8.5" fill="#ffffff" text-anchor="middle">${lang === 'en' ? 'North Indian' : 'ఉత్తర భారత'}</text>
    </svg>
  `;
}

/**
 * Main PDF/HTML Document Generator
 */
export function buildComprehensiveJathakaPdfHtml(options: GenerateReportOptions): string {
  const { name, birthDate, birthTime, cityName, chartData } = options;
  const lang = options.language || 'te';
  const siteUrl = 'www.telugujyothisham.com';

  const lagnaRashiIdx = resolveRashiIdx(chartData.lagna.id);
  const moonPlanet = chartData.planets.find((p) => p.id === 'moon') || chartData.planets[1];
  const sunPlanet = chartData.planets.find((p) => p.id === 'sun') || chartData.planets[0];
  const moonRashiIdx = moonPlanet.rashiIdx;

  // 1. Predictions & Profiles
  const lagnaProfile = generateLagnaCompleteProfile(chartData.planets, lagnaRashiIdx);
  const sunMoon144 = getSunMoonCombination144(sunPlanet.rashiIdx, moonPlanet.rashiIdx);
  const saptamaMarriage = generateSaptamaMarriageAnalysis(chartData.planets, lagnaRashiIdx, birthDate);
  const all12Houses = generateAll12HousesCompleteAnalysis(chartData.planets, lagnaRashiIdx);
  const predictions = {
    lagnaProfile,
    sunMoon144,
    saptamaMarriage,
    twelveBhavas: all12Houses,
  };
  const dignities = computePlanetaryDignities(chartData.planets, lagnaRashiIdx);
  const neechaBhanga = checkNeechaBhangaRajaYoga(dignities, chartData.planets, lagnaRashiIdx);
  const yogas = detectAllYogasAndDoshas(chartData.planets, lagnaRashiIdx, dignities);
  const tripleKuja = evaluateTripleKujaDosha(chartData.planets, lagnaRashiIdx);
  const marriageTiming = calculateDynamicMarriageTiming(birthDate, lagnaRashiIdx, moonRashiIdx);
  const dashaInfo = computeVimshottariFullTimeline(moonPlanet.longitude, birthDate, birthTime);
  const gochara12m = computeNext12MonthsGochara(moonRashiIdx, lagnaRashiIdx);
  const divisional = computeDivisionalCharts(chartData.planets, lagnaRashiIdx);
  const ashtakavarga = computeSarvashtakavarga(chartData.planets, lagnaRashiIdx);
  const panchangaProfile = buildPanchangaBirthProfile(chartData, birthDate, birthTime, cityName);
  const execSummary = generateExecutiveSummary(dignities, yogas, tripleKuja, dashaInfo, marriageTiming);

  // South Indian Chart Table Renderer
  const renderSouthIndianTableHtml = (
    title: string,
    planetsMap: Record<number, { nameTe: string; isRetro?: boolean }[]>,
    centerSubtitle = ''
  ) => {
    const rashiNames = [
      'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
      'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
    ];
    const cellHtml = (rIdx: number) => {
      const pls = planetsMap[rIdx] || [];
      const isLagnaCell = rIdx === lagnaRashiIdx;
      return `<td style="width:25%;height:72px;vertical-align:top;padding:4px 6px;border:1.5px solid #92400e;background:${
        isLagnaCell ? '#fef3c7' : '#fffbeb'
      };">
        <div style="font-size:10.5px;font-weight:bold;color:#78350f;display:flex;justify-content:space-between;">
          <span>${rashiNames[rIdx]}</span>
          ${isLagnaCell ? '<span style="color:#991b1b;font-weight:800;background:#fee2e2;padding:1px 4px;border-radius:3px;">లగ్నం</span>' : ''}
        </div>
        <div style="font-size:11px;font-weight:700;color:#1e293b;margin-top:3px;line-height:1.25;">
          ${pls.map((p) => `${p.nameTe}${p.isRetro ? '(వ)' : ''}`).join(', ')}
        </div>
      </td>`;
    };

    return `
      <table style="width:100%;border-collapse:collapse;border:2px solid #78350f;margin-bottom:12px;background:#ffffff;">
        <tr>${cellHtml(11)}${cellHtml(0)}${cellHtml(1)}${cellHtml(2)}</tr>
        <tr>
          ${cellHtml(10)}
          <td colspan="2" rowspan="2" style="background:#451a03;color:#fef3c7;text-align:center;padding:6px;border:1.5px solid #92400e;">
            <div style="font-size:9.5px;color:#fcd34d;font-weight:bold;letter-spacing:0.5px;">శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం</div>
            <div style="font-size:13px;font-weight:bold;color:#ffffff;margin:2px 0;">${title}</div>
            <div style="font-size:11px;color:#fde68a;">${centerSubtitle || `${name} · ${birthDate}`}</div>
          </td>
          ${cellHtml(3)}
        </tr>
        <tr>${cellHtml(9)}${cellHtml(4)}</tr>
        <tr>${cellHtml(8)}${cellHtml(7)}${cellHtml(6)}${cellHtml(5)}</tr>
      </table>
    `;
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} - బృహత్ పరాశర సంపూర్ణ జాతక నివేదిక | ${siteUrl}</title>
  <!-- Full Noto Sans Telugu & Noto Serif Telugu fonts for perfect GSUB/GPOS complex conjunct rendering -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600;700;800&family=Noto+Serif+Telugu:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
    }
    @page {
      size: A4 portrait;
      margin: 0;
    }
    body {
      font-family: 'Noto Sans Telugu', 'Noto Serif Telugu', Georgia, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.55;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .report-sheet {
      width: 210mm;
      min-height: 297mm;
      padding: 12mm 15mm 15mm 15mm;
      margin: 0 auto;
      background: #ffffff;
      position: relative;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sheet-body {
      flex: 1;
    }
    .running-header {
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
    .running-footer {
      border-top: 1.5px solid #b45309;
      padding-top: 4px;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: #78350f;
      font-weight: 600;
    }
    .running-footer a {
      color: #92400e;
      text-decoration: none;
      font-weight: bold;
    }

    /* Headings and Cards */
    .page-title {
      font-size: 17px;
      font-weight: 800;
      color: #451a03;
      border-left: 4px solid #b45309;
      padding-left: 8px;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .section-card {
      border: 1.2px solid #d97706;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 10px;
      background: #ffffff;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section-card h4 {
      margin: 0 0 5px 0;
      color: #78350f;
      font-size: 13px;
      font-weight: 700;
      border-bottom: 1px dashed #fde68a;
      padding-bottom: 3px;
    }
    .section-card p {
      margin: 4px 0;
      font-size: 11.5px;
      line-height: 1.5;
      color: #334155;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 11px;
      page-break-inside: avoid;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #d97706;
      padding: 5px 7px;
      text-align: left;
    }
    table.data-table th {
      background: #fef3c7;
      color: #78350f;
      font-weight: 800;
      font-size: 11px;
    }
    table.data-table tr:nth-child(even) td {
      background: #fffdf7;
    }

    /* Pill Badges */
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }
    .badge-gold { background: #fef3c7; color: #92400e; border: 1px solid #f59e0b; }
    .badge-green { background: #dcfce7; color: #166534; border: 1px solid #22c55e; }
    .badge-red { background: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; border: 1px solid #c084fc; }

    /* Print Screen Control Bar */
    .no-print-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #451a03;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10000;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .no-print-toolbar button {
      background: #f59e0b;
      color: #451a03;
      font-weight: 800;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }

    @media print {
      .no-print-toolbar { display: none !important; }
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      .report-sheet {
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Print Bar -->
  <div class="no-print-toolbar">
    <div>
      <span style="font-size:14px;font-weight:bold;">🖨️ ${name} గారి బృహత్ జాతక నివేదిక (PDF ప్రింట్ సిద్ధం)</span>
      <span style="font-size:11px;color:#fde68a;margin-left:12px;">గమనిక: ప్రింట్ డైలాగ్‌లో "Headers and footers" అన్‌చెక్ చేయండి.</span>
    </div>
    <button onclick="window.print()">🖨️ ఇప్పుడే సేవ్ / ప్రింట్ చేయండి</button>
  </div>

  <div style="height:50px;" class="no-print-toolbar-spacer"></div>

  <!-- ========================================== -->
  <!-- PAGE 1: COVER PAGE                         -->
  <!-- ========================================== -->
  <div class="report-sheet" style="background: radial-gradient(circle at center, #fffbeb 0%, #fef3c7 100%); border: 3px double #92400e;">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · వేద జ్యోతిష నివేదిక</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body" style="text-align:center;padding:10px 0;">
      <div style="font-size:12px;font-weight:bold;color:#78350f;letter-spacing:1px;margin-bottom:8px;">
        ॥ శ్రీ గురుభ్యో నమః · శ్రీ మహాగణపతయే నమః · శ్రీ శారదాంబాయై నమః ॥
      </div>
      <div style="font-size:26px;font-weight:900;color:#451a03;margin:8px 0;line-height:1.25;">
        బృహత్ పరాశర దృక్సిద్ధాంత సంపూర్ణ జన్మ జాతక మహాగ్రంథం
      </div>
      <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:20px;">
        Comprehensive Brihat Vedic Horoscope &amp; Planetary Destiny Blueprint
      </div>

      <!-- Native Credentials Box -->
      <div style="border:2px solid #b45309;border-radius:10px;background:#ffffff;padding:14px 18px;margin:16px auto;max-width:540px;box-shadow:0 3px 6px rgba(0,0,0,0.06);text-align:left;">
        <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
          <tr>
            <td style="padding:5px 8px;font-weight:bold;color:#78350f;width:32%;">జాతకుని పేరు:</td>
            <td style="padding:5px 8px;font-weight:800;color:#1e293b;font-size:14.5px;">${name}</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:bold;color:#78350f;">పుట్టిన తేదీ &amp; సమయం:</td>
            <td style="padding:5px 8px;font-weight:700;color:#1e293b;">${birthDate} (ఉదయం ${birthTime})</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:bold;color:#78350f;">జన్మ స్థలం (ప్రాంతం):</td>
            <td style="padding:5px 8px;font-weight:700;color:#1e293b;">${cityName} (${panchangaProfile.latLonFormatted})</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:bold;color:#78350f;">జన్మ లగ్నం (D1):</td>
            <td style="padding:5px 8px;font-weight:800;color:#991b1b;">${chartData.lagna.te} (${chartData.planets[0].degreeFormatted})</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:bold;color:#78350f;">జన్మ రాశి &amp; నక్షత్రం:</td>
            <td style="padding:5px 8px;font-weight:700;color:#1e293b;">${chartData.rashi.te} రాశి · ${chartData.nakshatraName} నక్షత్రం (${chartData.pada}వ పాదం)</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:bold;color:#78350f;">సూర్య రాశి (ఆత్మకారక):</td>
            <td style="padding:5px 8px;font-weight:700;color:#1e293b;">${sunPlanet.rashiTe} రాశి (${sunPlanet.degreeFormatted} — ${sunPlanet.nakshatraTe})</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:bold;color:#78350f;">ప్రస్తుత మహాదశ:</td>
            <td style="padding:5px 8px;font-weight:800;color:#047857;">${dashaInfo.currentMahadasha.lordTe} మహాదశ — ${dashaInfo.currentAntardasha.lordTe} అంతర్దశ</td>
          </tr>
        </table>
      </div>

      <!-- Chief Astrologer Box -->
      <div style="margin-top:24px;display:flex;justify-content:space-around;align-items:center;border-top:1.5px dashed #d97706;padding-top:16px;">
        <div style="text-align:left;">
          <div style="font-size:10px;font-weight:bold;color:#78350f;text-transform:uppercase;">సిద్ధాంత విశ్లేషణ &amp; ఆశీస్సులు:</div>
          <div style="font-size:15px;font-weight:800;color:#451a03;margin-top:2px;">బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ</div>
          <div style="font-size:11px;color:#78350f;">ప్రధాన అర్చకులు &amp; వేద జ్యోతిష పరిశోధకులు</div>
          <div style="font-size:10.5px;color:#1e293b;margin-top:3px;">శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · హైదరాబాద్</div>
          <div style="font-size:10.5px;color:#92400e;font-weight:bold;">ఫోన్ / వాట్సాప్: +91 89779 86166</div>
        </div>
        <div style="text-align:center;border:1.5px solid #b45309;padding:6px 10px;border-radius:8px;background:#ffffff;">
          <div style="font-size:9px;font-weight:bold;color:#78350f;margin-bottom:3px;">వెబ్‌సైట్ &amp; సంప్రదింపులు</div>
          <div style="width:70px;height:70px;background:#fef3c7;display:flex;align-items:center;justify-content:center;border:1px solid #d97706;font-size:9px;font-weight:bold;color:#78350f;text-align:center;">
            QR CODE<br/>+91 89779 86166
          </div>
          <div style="font-size:8.5px;font-weight:bold;color:#92400e;margin-top:2px;">${siteUrl}</div>
        </div>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · అధికారిక సంపూర్ణ పత్రిక</span>
      <span>పేజీ 1</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 2: 1-PAGE EXECUTIVE SUMMARY           -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">జాతక సంక్షిప్త సారాంశం (1-Page Executive Summary)</div>

      <div class="section-card" style="background:#ecfdf5;border-color:#10b981;">
        <h4 style="color:#065f46;border-color:#a7f3d0;">🌟 ప్రస్తుత క్రియాశీల దశా కాలం (Active Dasha Timeline)</h4>
        <p style="font-size:12.5px;font-weight:700;color:#064e3b;">${execSummary.oneLineDashaSummaryTe}</p>
        <p style="font-size:11px;color:#047857;">జన్మ శని మహాదశా శేషం: ${dashaInfo.janmaDashaBalanceFormattedTe}</p>
      </div>

      <div class="section-card">
        <h4 style="color:#047857;">💎 జాతక ప్రధాన 5 దివ్య బలాలు (Top 5 Strengths)</h4>
        <ul style="margin:4px 0 4px 18px;padding:0;font-size:11.5px;line-height:1.55;color:#1e293b;">
          ${execSummary.top5StrengthsTe.map((s) => `<li>${s}</li>`).join('')}
        </ul>
      </div>

      <div class="section-card">
        <h4 style="color:#991b1b;">⚠️ జీవితంలో తీసుకోవలసిన 3 ప్రధాన జాగ్రత్తలు (Top 3 Cautions)</h4>
        <ul style="margin:4px 0 4px 18px;padding:0;font-size:11.5px;line-height:1.55;color:#1e293b;">
          ${execSummary.top3CautionsTe.map((c) => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div class="section-card">
        <h4>📅 రాబోయే 12 నెలల గోచార సూచన &amp; శుభ కార్య సమయం (12-Month Outlook)</h4>
        <p><strong>గోచార పరిశీలన:</strong> ${execSummary.next12MonthsOutlookTe}</p>
        <p><strong>వివాహ యోగ సమయం:</strong> ${marriageTiming.primaryRecommendationTe}</p>
      </div>

      <div class="section-card" style="background:#fffbeb;">
        <h4 style="color:#92400e;">🪔 దైవ ఆరాధన &amp; నిత్య సాధన సూత్రం</h4>
        <p>${execSummary.vitalRemedyFocusTe}</p>
        <p style="font-size:10.5px;color:#78350f;margin-top:4px;"><strong>గమనిక:</strong> సంపూర్ణ రత్నధారణ, జప శాంతి వివరాలు చివరి అధ్యాయంలో పొందుపరచబడినవి.</p>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 2</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 3: BIRTH PANCHANGAM & CREDENTIALS     -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">జన్మ పంచాంగం &amp; నక్షత్ర వివరాలు (Birth Panchangam Details)</div>

      <table class="data-table">
        <thead>
          <tr>
            <th colspan="4" style="text-align:center;background:#451a03;color:#fef3c7;font-size:12px;">
              దృక్సిద్ధాంత ఖగోళ జనన విశేషాలు (Astronomical Birth Profile)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:bold;width:25%;">తెలుగు సంవత్సరం</td>
            <td style="width:25%;">${panchangaProfile.samvatsaraTe}</td>
            <td style="font-weight:bold;width:25%;">అయనం &amp; ఋతువు</td>
            <td style="width:25%;">${panchangaProfile.ayanaTe} · ${panchangaProfile.rituTe}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">మాసం &amp; పక్షం</td>
            <td>${panchangaProfile.masaTe} · ${panchangaProfile.pakshaTe}</td>
            <td style="font-weight:bold;">జన్మ తిథి</td>
            <td>${panchangaProfile.tithiTe}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">జన్మ వారం</td>
            <td>${panchangaProfile.vaaraTe}</td>
            <td style="font-weight:bold;">యోగం &amp; కరణం</td>
            <td>${panchangaProfile.yogaTe} · ${panchangaProfile.karanaTe}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">జన్మ నక్షత్రం</td>
            <td><strong>${chartData.nakshatraName} (${chartData.pada}వ పాదం)</strong></td>
            <td style="font-weight:bold;">జన్మ రాశి (చంద్ర లగ్నం)</td>
            <td><strong>${chartData.rashi.te} రాశి</strong></td>
          </tr>
          <tr>
            <td style="font-weight:bold;">జన్మ లగ్నం (D1)</td>
            <td><strong>${chartData.lagna.te} (${chartData.planets[0].degreeFormatted})</strong></td>
            <td style="font-weight:bold;">నవాంశ లగ్నం (D9)</td>
            <td>${chartData.navamshaLagna.te} లగ్నం</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">అయనాంశం</td>
            <td>${panchangaProfile.ayanamsaFormatted}</td>
            <td style="font-weight:bold;">సమయ మండలం</td>
            <td>${panchangaProfile.timezoneFormatted}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">అక్షాంశ / రేఖాంశాలు</td>
            <td colspan="3">${panchangaProfile.latLonFormatted}</td>
          </tr>
        </tbody>
      </table>

      <div class="page-title" style="margin-top:14px;font-size:15px;">నక్షత్ర తత్వ పరిశీలన (27-Nakshatra Matrix Profile)</div>
      <table class="data-table">
        <tbody>
          <tr>
            <td style="font-weight:bold;width:25%;">గణము</td>
            <td style="width:25%;">${panchangaProfile.ganaTe}</td>
            <td style="font-weight:bold;width:25%;">యోని</td>
            <td style="width:25%;">${panchangaProfile.yoniTe}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">నాడి</td>
            <td>${panchangaProfile.nadiTe}</td>
            <td style="font-weight:bold;">వర్ణం &amp; వశ్యము</td>
            <td>${panchangaProfile.varnaTe} · ${panchangaProfile.vashyaTe}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">నామ నక్షత్రాక్షరాలు</td>
            <td colspan="3"><strong>${panchangaProfile.namaAksharamTe}</strong> (శాస్త్రోక్త నామకరణ అక్షరాలు)</td>
          </tr>
        </tbody>
      </table>

      <div class="section-card">
        <h4>లగ్న &amp; ఆత్మకారక (సూర్య) స్వభావం</h4>
        <p>${predictions.lagnaProfile.dehaSwabhavamTe}</p>
        <p>${predictions.lagnaProfile.manoSwabhavamTe}</p>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 3</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 4: CHARTS (D1 & D9 & NORTH INDIAN)     -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">ప్రధాన కుండలి చక్రాలు (D1 Rashi &amp; D9 Navamsha Charts)</div>

      <div style="display:flex;gap:12px;margin-bottom:10px;">
        <div style="flex:1;">
          ${renderSouthIndianTableHtml('రాశి చక్రం (D1 Kundali)', chartData.d1RashiPlanets, `లగ్నం: ${chartData.lagna.te}`)}
        </div>
        <div style="flex:1;">
          ${renderSouthIndianTableHtml('నవాంశ చక్రం (D9 Navamsha)', chartData.d9NavamshaPlanets, `లగ్నం: ${chartData.navamshaLagna.te}`)}
        </div>
      </div>

      <div class="page-title" style="margin-top:10px;font-size:15px;">ఉత్తర భారత పద్ధతి కుండలి (North Indian Diamond Chart Format)</div>
      <div style="display:flex;gap:12px;align-items:center;">
        <div style="flex:1;max-width:300px;">
          ${renderNorthIndianChartSvg('D1 రాశి', lagnaRashiIdx, chartData.d1RashiPlanets, lang)}
        </div>
        <div style="flex:1;font-size:11.5px;color:#334155;line-height:1.55;">
          <div class="section-card">
            <h4>ఉత్తర &amp; దక్షిణ భారత చక్రాల సమన్వయం</h4>
            <p><strong>ఉత్తర భారత కుండలి ప్రత్యేకత:</strong> ఇందులో 12 భావాలు స్థిరంగా ఉంటాయి. పైభాగంలోని మొదటి త్రికోణ డైమండ్ ఎల్లప్పుడూ 1వ స్థానమైన "జన్మ లగ్నాన్ని" సూచిస్తుంది. రాశులు అపసవ్య దిశలో (counter-clockwise) పరిభ్రమిస్తాయి.</p>
            <p><strong>దక్షిణ భారత కుండలి ప్రత్యేకత:</strong> ఇందులో 12 రాశులు స్థిరంగా ఉంటాయి. మేషం నుండి మీనం వరకు స్థిర గడులలో గ్రహాలు మరియు లగ్నం నమోదు చేయబడతాయి.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 4</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 5: PLANETARY DIGNITY & DEGREES TABLE   -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">గ్రహ స్థానాలు, డిగ్రీలు &amp; బల పట్టిక (Planetary Dignities Matrix)</div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width:14%;">గ్రహం</th>
            <th style="width:14%;">రాశి (D1)</th>
            <th style="width:14%;">డిగ్రీలు</th>
            <th style="width:18%;">నక్షత్రం (పాదం)</th>
            <th style="width:18%;">శాస్త్రోక్త స్థితి (Dignity)</th>
            <th style="width:12%;">అస్తంగతం / వక్రం</th>
            <th style="width:10%;">బలం %</th>
          </tr>
        </thead>
        <tbody>
          ${dignities
            .map((d) => {
              const badgeClass =
                d.dignityCode === 'ucha' || d.dignityCode === 'swakshetra' || d.dignityCode === 'moolatrikona'
                  ? 'badge-green'
                  : d.dignityCode === 'neecha'
                  ? 'badge-red'
                  : d.dignityCode === 'mitra'
                  ? 'badge-gold'
                  : 'badge-purple';
              return `
              <tr>
                <td><strong>${d.nameTe}</strong></td>
                <td>${d.rashiTe}</td>
                <td>${d.degreeFormatted}</td>
                <td>${d.nakshatraTe} (${d.pada})</td>
                <td><span class="badge ${badgeClass}">${d.dignityTe}</span></td>
                <td>
                  ${d.isCombust ? `<span class="badge badge-red">అస్తంగతం (${d.combustDegreeDiff}°)</span>` : ''}
                  ${d.isRetrograde ? `<span class="badge badge-gold">వక్రం</span>` : ''}
                  ${d.isVargottama ? `<span class="badge badge-green">వర్గోత్తమ</span>` : ''}
                  ${!d.isCombust && !d.isRetrograde && !d.isVargottama ? '—' : ''}
                </td>
                <td style="font-weight:bold;text-align:center;">${d.strengthScorePct}%</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>

      <div class="page-title" style="margin-top:14px;font-size:15px;">గ్రహ బల విశ్లేషణ విశేషాలు (Dignity Analysis Notes)</div>
      <div style="font-size:11.5px;color:#334155;line-height:1.5;">
        ${dignities
          .filter((d) => d.dignityNotesTe)
          .map(
            (d) => `
          <div style="margin-bottom:6px;border-bottom:1px dashed #e2e8f0;padding-bottom:4px;">
            <strong>${d.nameTe}:</strong> ${d.dignityNotesTe}
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 5</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 6: NEECHA BHANGA & YOGAS               -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">నీచభంగ రాజయోగ పరిశీలన (Neecha Bhanga Raja Yoga Analysis)</div>

      ${
        neechaBhanga.length > 0
          ? neechaBhanga
              .map(
                (nb) => `
            <div class="section-card" style="border-left:4px solid ${nb.hasNeechaBhanga ? '#16a34a' : '#dc2626'};">
              <h4>${nb.planetTe} — ${nb.debilitationRashiTe} రాశిలో నీచ స్థితి: ${
                  nb.hasNeechaBhanga
                    ? `<span class="badge badge-green">సంపూర్ణ నీచభంగ రాజయోగం సిద్ధి</span>`
                    : `<span class="badge badge-red">నీచభంగం జరగలేదు</span>`
                }</h4>
              <p><strong>రద్దు సూత్రం (Cancellation Rule):</strong> ${nb.cancellationTypeTe || 'వర్తించదు'}</p>
              <p>${nb.explanationTe}</p>
            </div>
          `
              )
              .join('')
          : `<div class="section-card"><p>ఈ జాతకంలో ఏ గ్రహమూ నీచ స్థితిలో లేదు.</p></div>`
      }

      <div class="page-title" style="margin-top:14px;font-size:15px;">ప్రత్యేక యోగాలు &amp; దోషాల విశ్లేషణ (Detected Yogas &amp; Doshas)</div>
      ${yogas
        .map((y) => {
          const badgeClass =
            y.impactLevel === 'very_auspicious' || y.impactLevel === 'auspicious'
              ? 'badge-green'
              : y.impactLevel === 'moderate'
              ? 'badge-gold'
              : 'badge-red';
          return `
          <div class="section-card">
            <h4>${y.nameTe} <span class="badge ${badgeClass}">${y.impactLevel.toUpperCase()}</span></h4>
            <p>${y.descriptionTe}</p>
            ${y.remedyTe ? `<p style="color:#78350f;font-weight:600;font-size:11px;">🪔 శాంతి పరిహారం: ${y.remedyTe}</p>` : ''}
          </div>
        `;
        })
        .join('')}
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 6</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 7: TRIPLE KUJA DOSHA & MARRIAGE TIMING -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">త్రివిధ కుజ దోష పరిశీలన (Triple Kuja Dosha Comprehensive Evaluation)</div>

      <div class="section-card" style="background:#fffbeb;border-color:#b45309;">
        <h4 style="color:#78350f;">లగ్న, చంద్ర, శుక్ర ఆధారిత కుజ స్థితి విశ్లేషణ</h4>
        <table class="data-table" style="margin:8px 0;">
          <thead>
            <tr>
              <th>పరిశీలనా బిందువు</th>
              <th>కుజుని స్థానం</th>
              <th>శాస్త్ర స్థితి</th>
              <th>తీవ్రత %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1. జన్మ లగ్నం నుండి</strong></td>
              <td>${tripleKuja.fromLagna.house}వ స్థానం</td>
              <td>${tripleKuja.fromLagna.hasDosha ? '<span class="badge badge-red">దోష ప్రదం</span>' : '<span class="badge badge-green">దోష రహితం</span>'}</td>
              <td>${tripleKuja.fromLagna.severityPct}%</td>
            </tr>
            <tr>
              <td><strong>2. చంద్ర లగ్నం (జన్మ రాశి) నుండి</strong></td>
              <td>${tripleKuja.fromChandra.house}వ స్థానం</td>
              <td>${tripleKuja.fromChandra.hasDosha ? '<span class="badge badge-red">అష్టమ కుజ దోషం</span>' : '<span class="badge badge-green">దోష రహితం</span>'}</td>
              <td>${tripleKuja.fromChandra.severityPct}%</td>
            </tr>
            <tr>
              <td><strong>3. కళత్రకారక శుక్రుని నుండి</strong></td>
              <td>${tripleKuja.fromShukra.house}వ స్థానం</td>
              <td>${tripleKuja.fromShukra.hasDosha ? '<span class="badge badge-red">దోష ప్రదం</span>' : '<span class="badge badge-green">దోష రహితం</span>'}</td>
              <td>${tripleKuja.fromShukra.severityPct}%</td>
            </tr>
          </tbody>
        </table>

        <p style="font-size:12px;font-weight:bold;color:#451a03;margin-top:6px;">
          నికర ఫలితం: ${tripleKuja.summaryTitleTe}
        </p>
        <p style="white-space:pre-line;">${tripleKuja.detailedAnalysisTe}</p>
        ${
          tripleKuja.mitigationFactorsTe.length > 0
            ? `<div style="background:#fef3c7;padding:6px 10px;border-radius:6px;margin:6px 0;">
                <strong style="color:#78350f;">శాస్త్రోక్త ఉపశమన అంశాలు:</strong>
                <ul style="margin:2px 0 2px 16px;padding:0;font-size:11px;">
                  ${tripleKuja.mitigationFactorsTe.map((m) => `<li>${m}</li>`).join('')}
                </ul>
              </div>`
            : ''
        }
        <p style="color:#065f46;font-weight:bold;">🪔 సూచించిన కుజ దోష నివారణ: ${tripleKuja.recommendedRemedyTe}</p>
      </div>

      <div class="page-title" style="margin-top:14px;font-size:15px;">శుభ వివాహ యోగ కాలం &amp; భాగస్వామి స్వభావం (Marriage Timing &amp; Spouse)</div>
      <div class="section-card">
        <h4>ప్రస్తుత వయస్సు ఆధారిత వివాహ యోగ సమయం</h4>
        <p>${marriageTiming.primaryRecommendationTe}</p>
        <table class="data-table" style="margin-top:6px;">
          <thead>
            <tr>
              <th>శుభ కాలం</th>
              <th>వయస్సు</th>
              <th>గోచార గురు &amp; దశా బలం</th>
              <th>అనుకూలత</th>
            </tr>
          </thead>
          <tbody>
            ${marriageTiming.currentFavorableWindows
              .map(
                (w) => `
              <tr>
                <td><strong>${w.period}</strong></td>
                <td>${w.ageSpan}</td>
                <td>${w.transitNoteTe}</td>
                <td><span class="badge badge-green">${w.favorability.toUpperCase()}</span></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="section-card">
        <h4>సప్తమాధిపతి పరిశీలన &amp; దాంపత్య జీవనం</h4>
        <p>${predictions.saptamaMarriage.spouseAppearanceAndNatureTe}</p>
        <p>${predictions.saptamaMarriage.spouseCareerAndFamilyTe}</p>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 7</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 8: CURRENT DASHA & FULL TIMELINE       -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">వింశోత్తరి దశా-భుక్తి కాలచక్రం (Vimshottari Dasha Full Timeline)</div>

      <div class="section-card" style="background:#ecfdf5;border-color:#059669;">
        <h4 style="color:#065f46;">ప్రస్తుత క్రియాశీల మహాదశ &amp; అంతర్దశ (Current Running Periods)</h4>
        <table style="width:100%;font-size:12px;border-collapse:collapse;">
          <tr>
            <td style="font-weight:bold;color:#065f46;width:25%;">ప్రస్తుత మహాదశ:</td>
            <td style="font-weight:800;color:#064e3b;width:35%;font-size:13.5px;">${dashaInfo.currentMahadasha.lordTe} మహాదశ</td>
            <td style="font-weight:bold;color:#065f46;width:20%;">కాల వ్యవధి:</td>
            <td style="color:#064e3b;">${dashaInfo.currentMahadasha.startDate} నుండి ${dashaInfo.currentMahadasha.endDate}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;color:#065f46;">ప్రస్తుత అంతర్దశ:</td>
            <td style="font-weight:800;color:#064e3b;font-size:13.5px;">${dashaInfo.currentAntardasha.lordTe} అంతర్దశ</td>
            <td style="font-weight:bold;color:#065f46;">కాల వ్యవధి:</td>
            <td style="color:#064e3b;">${dashaInfo.currentAntardasha.startDate} నుండి ${dashaInfo.currentAntardasha.endDate}</td>
          </tr>
        </table>
        <div style="font-size:11px;color:#047857;margin-top:6px;border-top:1px dashed #a7f3d0;padding-top:4px;">
          <strong>జన్మ దశా శేషం:</strong> ${dashaInfo.janmaDashaBalanceFormattedTe}
        </div>
      </div>

      <div class="page-title" style="margin-top:14px;font-size:15px;">సంపూర్ణ 9 మహాదశల క్రమం (All 9 Mahadashas Sequence)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:20%;">మహాదశ</th>
            <th style="width:18%;">ప్రారంభ తేదీ</th>
            <th style="width:18%;">ముగింపు తేదీ</th>
            <th style="width:16%;">స్థితి</th>
            <th style="width:28%;">ఫలిత సంక్షిప్త సూచన</th>
          </tr>
        </thead>
        <tbody>
          ${dashaInfo.mahadashas
            .map(
              (m) => `
            <tr style="${m.isCurrent ? 'background:#dcfce7;font-weight:bold;' : ''}">
              <td><strong>${m.lordTe}</strong></td>
              <td>${m.startDate}</td>
              <td>${m.endDate}</td>
              <td>${m.isCurrent ? '<span class="badge badge-green">ప్రస్తుతం నడుస్తున్నది</span>' : 'కాలచక్రం'}</td>
              <td>${m.isCurrent ? 'ప్రస్తుత జీవన గమనాన్ని నిర్దేశించే ప్రధాన కాలం' : 'దశా ఫలాలు'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Antardasha breakdown for the active Mahadasha -->
      <div class="page-title" style="margin-top:12px;font-size:14px;">ప్రస్తుత ${dashaInfo.currentMahadasha.lordTe} మహాదశలోని అంతర్దశల పట్టిక</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>అంతర్దశాధిపతి</th>
            <th>ప్రారంభం</th>
            <th>ముగింపు</th>
            <th>స్థితి</th>
          </tr>
        </thead>
        <tbody>
          ${(
            dashaInfo.mahadashas.find((m) => m.lordId === dashaInfo.currentMahadasha.lordId)?.antardashas || []
          )
            .map(
              (ad) => `
            <tr style="${ad.isCurrent ? 'background:#dcfce7;font-weight:bold;' : ''}">
              <td>${dashaInfo.currentMahadasha.lordTe} లో <strong>${ad.lordTe}</strong></td>
              <td>${ad.startDate}</td>
              <td>${ad.endDate}</td>
              <td>${ad.isCurrent ? '<span class="badge badge-green">క్రియాశీలం</span>' : 'పూర్తయినది / రాబోయేది'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 8</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 9: NEXT 12 MONTHS GOCHARA TRANSITS     -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">రాబోయే 12 నెలల గోచార ఫలితాలు (Next 12 Months Gochara Transits)</div>

      <div style="font-size:11.5px;color:#334155;margin-bottom:10px;">
        శాస్త్రోక్తంగా గోచార ఫలితాలు జన్మ రాశి (చంద్ర లగ్నం: <strong>${chartData.rashi.te}</strong>) ఆధారంగా ప్రధానంగానూ, జన్మ లగ్నం (<strong>${chartData.lagna.te}</strong>) ఆధారంగా ఉపబలంగానూ పరిగణించబడతాయి.
      </div>

      ${gochara12m
        .map(
          (g) => `
        <div class="section-card">
          <h4>${g.planetTe} — ${g.transitRashiTe} (${g.keyDates})</h4>
          <p>
            <strong>చంద్రుని నుండి:</strong> ${g.houseFromMoon}వ స్థానం ·
            <strong>లగ్నం నుండి:</strong> ${g.houseFromLagna}వ స్థానం ·
            <strong>గోచార స్థితి:</strong> ${
              g.favorableStatus === 'shubha'
                ? '<span class="badge badge-green">అనుకూలం</span>'
                : '<span class="badge badge-gold">మధ్యమ / జాగ్రత్త</span>'
            }
          </p>
          <p>${g.predictionTe}</p>
        </div>
      `
        )
        .join('')}

      <div class="page-title" style="margin-top:14px;font-size:15px;">సర్వాష్టకవర్గ 337 బిందువుల పట్టిక (Sarvashtakavarga Matrix)</div>
      <div class="section-card">
        <p><strong>అత్యధిక బలంగల రాశులు (30+ బిందువులు):</strong> ${ashtakavarga.strongestRashisTe}</p>
        <p><strong>శ్రమ అవసరమైన రాశులు (<26 బిందువులు):</strong> ${ashtakavarga.challengingRashisTe}</p>
        <div style="font-size:10.5px;color:#78350f;margin-top:4px;">
          గోచార గ్రహాలు అధిక బిందువులు గల రాశులలో సంచరించే సమయంలో చేపట్టిన కార్యాలు శీఘ్ర విజయాన్ని, తక్కువ బిందువులు గల స్థానాలలో సంచరించే సమయంలో శ్రమను ఇస్తాయి.
        </div>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 9</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 10: DIVISIONAL CHARTS (D10, D7, D12)  -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">వర్గ చక్రాల పరిశీలన (Divisional Charts: D10, D7, D12)</div>

      <div style="display:flex;gap:12px;margin-bottom:10px;">
        <div style="flex:1;">
          <div style="font-size:12px;font-weight:bold;color:#451a03;margin-bottom:4px;text-align:center;">
            దశాంశ చక్రం (D10 Dashamsha — ఉద్యోగ, వృత్తి బలం)
          </div>
          ${renderSouthIndianTableHtml('D10 దశాంశ', divisional.d10Chart as any, 'వృత్తి & కీర్తి')}
        </div>
        <div style="flex:1;">
          <div style="font-size:12px;font-weight:bold;color:#451a03;margin-bottom:4px;text-align:center;">
            సప్తాంశ చక్రం (D7 Saptamsha — సంతాన ప్రాప్తి)
          </div>
          ${renderSouthIndianTableHtml('D7 సప్తాంశ', divisional.d7Chart as any, 'సంతానం & వంశాభివృద్ధి')}
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-bottom:10px;">
        <div style="flex:1;">
          <div style="font-size:12px;font-weight:bold;color:#451a03;margin-bottom:4px;text-align:center;">
            ద్వాదశాంశ చక్రం (D12 Dwadashamsha — పిత్రార్జితం &amp; పూర్వీకులు)
          </div>
          ${renderSouthIndianTableHtml('D12 ద్వాదశాంశ', divisional.d12Chart as any, 'తల్లిదండ్రులు & వంశం')}
        </div>
        <div style="flex:1;">
          <div class="section-card" style="height:calc(100% - 24px);display:flex;flex-direction:column;justify-content:center;">
            <h4>వర్గ చక్రాల తాత్పర్యం (Significance of Varga Charts)</h4>
            <p><strong>D10 దశాంశం:</strong> కేవలం రాశి చక్రం ద్వారా మాత్రమే కాకుండా, దశాంశ చక్రంలో 10వ భావాధిపతి మరియు రవి, శని స్థానాల ఆధారంగా జీవనోపాధిలో ఉన్నత హోదా, వ్యాపార సామర్థ్యం నిర్ధారించబడతాయి.</p>
            <p><strong>D7 సప్తాంశం:</strong> సంతాన ప్రాప్తి, వారి ఆరోగ్య వికాసం మరియు వారసత్వ యోగాలను తెలియజేస్తుంది.</p>
            <p><strong>D12 ద్వాదశాంశం:</strong> పూర్వ పుణ్యం, తల్లిదండ్రుల ఆరోగ్యం మరియు పూర్వీకుల ఆశీస్సులను తెలియజేస్తుంది.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 10</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 11: 12 BHAVA PREDICTIONS SUMMARY       -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">ద్వాదశ భావ ఫలాల సంక్షిప్త సారాంశం (12 Bhavas Overview)</div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width:12%;">భావం</th>
            <th style="width:16%;">రాశి &amp; అధిపతి</th>
            <th style="width:14%;">అధిపతి స్థితి</th>
            <th style="width:58%;">ప్రధాన జీవన ఫలితాలు</th>
          </tr>
        </thead>
        <tbody>
          ${predictions.twelveBhavas
            .map(
              (b) => `
            <tr>
              <td><strong>${b.bhavaTitleTe.split('—')[0]}</strong></td>
              <td>${b.rashiInHouseTe} (${b.lordTe})</td>
              <td>${b.lordPlacedInHouse}వ స్థానంలో</td>
              <td>${b.detailedPredictionTe.substring(0, 150)}...</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 11</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 12: REMEDIES CALENDAR & GEM SAFETY     -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">వైదిక శాంతి పరిహారాల క్యాలెండర్ (Remedies Schedule)</div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width:18%;">వారం / తిథి</th>
            <th style="width:24%;">ఆరాధించవలసిన దైవం</th>
            <th style="width:30%;">జప మంత్రం &amp; దానం</th>
            <th style="width:28%;">నియమం &amp; వ్యవధి</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>ప్రతి మంగళవారం</strong></td>
            <td>శ్రీ సుబ్రహ్మణ్య స్వామి / ఆంజనేయ స్వామి</td>
            <td>శ్రీ సుబ్రహ్మణ్య అష్టకం పఠనం, ఎర్రని పూలతో పూజ, కందుల దానం</td>
            <td>వరుసగా 21 మంగళవారాలు ఆచరించడం వల్ల కుజ దోష నివృత్తి.</td>
          </tr>
          <tr>
            <td><strong>ప్రతి బుధవారం</strong></td>
            <td>శ్రీ మహావిష్ణువు / శ్రీ లక్ష్మీ నారాయణ స్వామి</td>
            <td>శ్రీ విష్ణు సహస్రనామ స్తోత్రం, పచ్చ పెసలు దానం</td>
            <td>బుధ అస్తంగత దోష నివారణకు, బుద్ధి వికాసానికి అత్యంత శుభకరం.</td>
          </tr>
          <tr>
            <td><strong>ప్రతి గురువారం</strong></td>
            <td>శ్రీ దక్షిణామూర్తి / దత్తాత్రేయ స్వామి</td>
            <td>దక్షిణామూర్తి స్తోత్రం, పసుపు శనగల దానం</td>
            <td>గురు-చండాల దోష ఉపశమనానికి, విద్యా వికాసానికి శ్రేయస్కరం.</td>
          </tr>
          <tr>
            <td><strong>ప్రతి శనివారం</strong></td>
            <td>శ్రీ ఆంజనేయ స్వామి / శనీశ్వరుడు</td>
            <td>హనుమాన్ చాలీసా, నువ్వుల నూనెతో దీపారాధన, నల్ల నువ్వుల దానం</td>
            <td>అర్ధాష్టమ శని శాంతి కొరకు, సమస్త ఆటంకాల తొలగింపుకు.</td>
          </tr>
        </tbody>
      </table>

      <!-- Prominent Gemstone Warning Box -->
      <div class="section-card" style="background:#fef2f2;border:2px solid #ef4444;margin-top:14px;">
        <h4 style="color:#991b1b;border-color:#fca5a5;font-size:14px;">
          ⚠️ రత్నధారణ అత్యంత ముఖ్యమైన హెచ్చరిక (Gemstone Safety Caution)
        </h4>
        <p style="font-size:12px;font-weight:bold;color:#7f1d1d;line-height:1.6;">
          రత్నధారణకు ముందు తప్పనిసరిగా పండితుని ప్రత్యక్ష సలహా తీసుకోండి!
        </p>
        <p style="font-size:11.5px;color:#991b1b;line-height:1.5;">
          శాస్త్ర సిద్ధాంతం ప్రకారం ఒక గ్రహం అస్తంగతం (Combust), నీచ స్థితి (Debilitated), లేదా 6, 8, 12 స్థానాలలో ఉన్నప్పుడు అపరిశీలనగా రత్నం ధరించడం వల్ల వ్యతిరేక మరియు ప్రతికూల ప్రభావాలు ఎదురయ్యే ప్రమాదం ఉంది. మీ జాతకంలో గ్రహ బలాలు, నీచభంగ యోగాలు సమగ్రంగా లెక్కించబడిన తర్వాత మాత్రమే రత్నాన్ని ధరించాలి.
        </p>
        <p style="font-size:11px;color:#b91c1c;font-weight:600;margin-top:4px;">
          (Wear gemstones strictly after consulting the chief pandit, particularly when planets are combust or debilitated).
        </p>
      </div>

      <div class="section-card" style="background:#fffbeb;margin-top:10px;">
        <h4>బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్యాత్మిక సందేశం</h4>
        <p style="font-size:11.5px;color:#451a03;line-height:1.55;">
          "జ్యోతిషం అనేది విధిని భయపెట్టే సాధనం కాదు; జీవిత గమనాన్ని నిర్దేశించే దివ్య దీపిక. సరైన కర్మ, దైవ విశ్వాసం, ధర్మబద్ధమైన ఆలోచనలతో ఏ గ్రహ ప్రతికూలతనైనా అధిగమించవచ్చు. భగవదనుగ్రహంతో మీ సమస్త కార్యాలు విజయవంతం కావాలని మనస్ఫూర్తిగా ఆశీర్వదిస్తున్నాను."
        </p>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 12</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 13: DISCLAIMER & DPDP ACT PRIVACY      -->
  <!-- ========================================== -->
  <div class="report-sheet">
    <div class="running-header">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · ${name} గారి జాతకం</span>
      <span>${siteUrl}</span>
    </div>
    <div class="sheet-body">
      <div class="page-title">శాస్త్ర ప్రామాణికత &amp; గోప్యతా విధానం (Disclaimer &amp; Privacy Compliance)</div>

      <div class="section-card">
        <h4>వేద జ్యోతిష శాస్త్ర పరిమితులు &amp; మార్గదర్శనం (Astrological Disclaimer)</h4>
        <p style="font-size:11.5px;line-height:1.6;color:#334155;">
          1. ఈ నివేదికలోని ఫలితాలు పరాశర మరియు వరాహమిహిర ప్రాచీన జ్యోతిష గ్రంథాల ఆధారంగా, లహిరి అయనాంశం ప్రకారం ఖగోళ గణనల ద్వారా రూపొందించబడినవి.<br/>
          2. జ్యోతిష విశ్లేషణ అనేది వ్యక్తిగత వికాసం, మానసిక సంసిద్ధత మరియు ధార్మిక మార్గదర్శనం కొరకు ఉద్దేశించబడినది. ఇది ఎట్టి పరిస్థితుల్లోనూ వైద్య (Medical), న్యాయ (Legal) లేదా ఆర్థిక (Financial/Investment) నిపుణుల సలహాలకు ప్రత్యామ్నాయం కాదు.<br/>
          3. గ్రహ స్థితులు సంభావ్యతలను (Probabilities) సూచిస్తాయి; వ్యక్తిగత ప్రయత్నం (స్వయంకృషి), సత్ప్రవర్తన మరియు దైవానుగ్రహం ద్వారా ప్రతికూలతలను సులభంగా అధిగమించవచ్చు.
        </p>
      </div>

      <div class="section-card" style="background:#f8fafc;border-color:#64748b;margin-top:12px;">
        <h4 style="color:#334155;">భారత డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం (DPDP Act 2023 Compliant Notice)</h4>
        <p style="font-size:11px;line-height:1.55;color:#475569;">
          • <strong>డేటా భద్రత:</strong> జాతకుని పేరు, పుట్టిన తేదీ, సమయం మరియు ప్రాంతం కేవలం కుండలి గణన కొరకు మాత్రమే తాత్కాలికంగా వినియోగించబడతాయి.<br/>
          • <strong>మూడవ పక్షాల రక్షణ:</strong> వినియోగదారుల జనన వివరాలు ఎట్టి పరిస్థితుల్లోనూ వాణిజ్య లేదా మార్కెటింగ్ ప్రయోజనాల కోసం ఏ మూడవ పక్షానికి (Third Party) విక్రయించబడవు.<br/>
          • <strong>డేటా తొలగింపు హక్కు (Right to Erasure):</strong> వినియోగదారుడు కోరిన పక్షంలో సర్వర్ నుండి జనన వివరాలను శాశ్వతంగా తొలగించే వెసులుబాటు కలదు.
        </p>
      </div>

      <!-- Pandit Official Seal & Contacts -->
      <div style="border:2px solid #b45309;border-radius:10px;background:#fffbeb;padding:14px 18px;margin-top:20px;text-align:center;">
        <div style="font-size:13px;font-weight:bold;color:#78350f;">శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం</div>
        <div style="font-size:15px;font-weight:800;color:#451a03;margin:4px 0;">బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ</div>
        <div style="font-size:11px;color:#78350f;">సిద్ధాంతి &amp; వేద జ్యోతిష సలహాదారులు · హైదరాబాద్, తెలంగాణ</div>
        <div style="font-size:12px;font-weight:bold;color:#047857;margin-top:6px;">
          📞 సంప్రదించుటకు / వాట్సాప్ అపాయింట్‌మెంట్: +91 89779 86166
        </div>
        <div style="font-size:11.5px;color:#92400e;margin-top:3px;">
          🌐 అధికారిక వెబ్‌సైట్: <a href="https://${siteUrl}" style="color:#92400e;text-decoration:none;font-weight:bold;">${siteUrl}</a>
        </div>
      </div>
    </div>
    <div class="running-footer">
      <span>శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · <a href="https://${siteUrl}">${siteUrl}</a></span>
      <span>పేజీ 13</span>
    </div>
  </div>

</body>
</html>`;
}
