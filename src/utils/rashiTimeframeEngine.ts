import { DayData } from '../types/panchangam';
import { NAKSHATRAS, WEEK_DATA } from '../data/panchangamData';
import { getOrGenerateDayData } from './astronomyPanchangam';
import {
  calculateTaraBalam,
  getDailyRashiFortunes,
  RASHI_META_LIST,
  RashiDailyFortune,
  TaraResult,
} from './panchangaLogic';
import { computeGocharaForRashi, RashiGocharaReport, RashiSlug } from './gocharaEngine';

/**
 * Adds offsetDays (can be negative or positive) to an ISO YYYY-MM-DD date string safely in UTC.
 */
export function addDaysToIso(isoDate: string, offsetDays: number): string {
  const parts = isoDate.split('-').map(Number);
  const year = parts[0] || 2026;
  const month = (parts[1] || 1) - 1;
  const day = parts[2] || 1;
  const utc = new Date(Date.UTC(year, month, day + offsetDays, 12, 0, 0));
  const y = utc.getUTCFullYear();
  const m = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utc.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns DayData for an offset from baseIsoDate using WEEK_DATA cache or Drik astronomy engine.
 */
export function getShiftedDayData(baseIsoDate: string, offsetDays: number): DayData {
  const targetIso = addDaysToIso(baseIsoDate, offsetDays);
  return getOrGenerateDayData(targetIso, WEEK_DATA);
}

/**
 * Resolves the 0-based Nakshatra index (0..26) for a DayData record.
 */
export function resolveDayNakshatraIndex(day: DayData): number {
  const raw = (day.panchanga?.nakshatram || '').trim();
  for (let i = 0; i < NAKSHATRAS.length; i++) {
    const nak = NAKSHATRAS[i];
    const teShort = nak.telugu.split(' (')[0].trim();
    if (
      raw.includes(teShort) ||
      raw.includes(nak.telugu) ||
      raw.toLowerCase().includes(nak.english.toLowerCase())
    ) {
      return i;
    }
  }
  return 0;
}

export interface RashiConstituentNakSpec {
  nakIdx: number; // 0..26
  padaLabelTe: string;
  padaLabelEn: string;
}

/**
 * Exact classical allocation of 27 Nakshatras across 12 Rashis (2.25 Nakshatras per Rashi).
 */
export const RASHI_CONSTITUENT_NAKSHATRAS: Record<string, RashiConstituentNakSpec[]> = {
  mesham: [
    { nakIdx: 0, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 1, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 2, padaLabelTe: '1వ పాదం', padaLabelEn: 'Pada 1' },
  ],
  vrushabham: [
    { nakIdx: 2, padaLabelTe: '2,3,4 పాదాలు', padaLabelEn: 'Padas 2–4' },
    { nakIdx: 3, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 4, padaLabelTe: '1,2 పాదాలు', padaLabelEn: 'Padas 1–2' },
  ],
  mithunam: [
    { nakIdx: 4, padaLabelTe: '3,4 పాదాలు', padaLabelEn: 'Padas 3–4' },
    { nakIdx: 5, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 6, padaLabelTe: '1,2,3 పాదాలు', padaLabelEn: 'Padas 1–3' },
  ],
  karkatakam: [
    { nakIdx: 6, padaLabelTe: '4వ పాదం', padaLabelEn: 'Pada 4' },
    { nakIdx: 7, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 8, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
  ],
  simham: [
    { nakIdx: 9, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 10, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 11, padaLabelTe: '1వ పాదం', padaLabelEn: 'Pada 1' },
  ],
  kanya: [
    { nakIdx: 11, padaLabelTe: '2,3,4 పాదాలు', padaLabelEn: 'Padas 2–4' },
    { nakIdx: 12, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 13, padaLabelTe: '1,2 పాదాలు', padaLabelEn: 'Padas 1–2' },
  ],
  tula: [
    { nakIdx: 13, padaLabelTe: '3,4 పాదాలు', padaLabelEn: 'Padas 3–4' },
    { nakIdx: 14, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 15, padaLabelTe: '1,2,3 పాదాలు', padaLabelEn: 'Padas 1–3' },
  ],
  vruschikam: [
    { nakIdx: 15, padaLabelTe: '4వ పాదం', padaLabelEn: 'Pada 4' },
    { nakIdx: 16, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 17, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
  ],
  dhanussu: [
    { nakIdx: 18, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 19, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 20, padaLabelTe: '1వ పాదం', padaLabelEn: 'Pada 1' },
  ],
  makaram: [
    { nakIdx: 20, padaLabelTe: '2,3,4 పాదాలు', padaLabelEn: 'Padas 2–4' },
    { nakIdx: 21, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 22, padaLabelTe: '1,2 పాదాలు', padaLabelEn: 'Padas 1–2' },
  ],
  kumbham: [
    { nakIdx: 22, padaLabelTe: '3,4 పాదాలు', padaLabelEn: 'Padas 3–4' },
    { nakIdx: 23, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 24, padaLabelTe: '1,2,3 పాదాలు', padaLabelEn: 'Padas 1–3' },
  ],
  meenam: [
    { nakIdx: 24, padaLabelTe: '4వ పాదం', padaLabelEn: 'Pada 4' },
    { nakIdx: 25, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
    { nakIdx: 26, padaLabelTe: '1,2,3,4 పాదాలు', padaLabelEn: 'Padas 1–4' },
  ],
};

export interface NakshatraTaraItem {
  nakshatraTe: string;
  nakshatraEn: string;
  padaLabelTe: string;
  padaLabelEn: string;
  tara: TaraResult;
  taraShortEn: string;
}

const TARA_EN_SHORT: Record<number, string> = {
  1: 'Janma (Neutral)',
  2: 'Sampat (Very Lucky)',
  3: 'Vipat (Caution)',
  4: 'Kshema (Favorable)',
  5: 'Pratyak (Caution)',
  6: 'Sadhaka (Success)',
  7: 'Naidhana (Avoid)',
  8: 'Mitra (Favorable)',
  9: 'Parama Mitra (Excellent)',
};

export function computePerRashiNakshatraTarabalam(
  day: DayData
): Record<string, NakshatraTaraItem[]> {
  const dayNakIdx = resolveDayNakshatraIndex(day);
  const out: Record<string, NakshatraTaraItem[]> = {};

  for (const rashi of RASHI_META_LIST) {
    const specs = RASHI_CONSTITUENT_NAKSHATRAS[rashi.id] || [];
    out[rashi.id] = specs.map((spec) => {
      const nakInfo = NAKSHATRAS[spec.nakIdx] || NAKSHATRAS[0];
      const tara = calculateTaraBalam(spec.nakIdx, dayNakIdx);
      return {
        nakshatraTe: nakInfo.telugu.split(' (')[0],
        nakshatraEn: nakInfo.english,
        padaLabelTe: spec.padaLabelTe,
        padaLabelEn: spec.padaLabelEn,
        tara,
        taraShortEn: TARA_EN_SHORT[tara.taraNumber] || 'Janma',
      };
    });
  }

  return out;
}

export interface WeeklyDayCell {
  isoDate: string;
  shortDateLabel: string;
  weekdayTe: string;
  weekdayEn: string;
  gocharaHouse: number;
  status: 'favorable' | 'mixed' | 'caution';
  statusLabelTe: string;
  statusLabelEn: string;
}

export interface RashiWeeklyOutlook {
  id: string;
  teluguName: string;
  englishName: string;
  lord: string;
  lordEn: string;
  overallStatus: 'favorable' | 'mixed' | 'caution';
  overallScore: number;
  favorableCount: number;
  cautionCount: number;
  peakDaysLabelTe: string;
  peakDaysLabelEn: string;
  cautionDaysLabelTe: string;
  cautionDaysLabelEn: string;
  weeklySummaryTe: string;
  weeklySummaryEn: string;
  careerNoteTe: string;
  careerNoteEn: string;
  financeNoteTe: string;
  financeNoteEn: string;
  remedyTe: string;
  remedyEn: string;
  days: WeeklyDayCell[];
}

const WEEKDAY_EN_MAP: Record<string, string> = {
  ఆదివారం: 'Sun',
  సోమవారం: 'Mon',
  మంగళవారం: 'Tue',
  బుధవారం: 'Wed',
  గురువారం: 'Thu',
  శుక్రవారం: 'Fri',
  శనివారం: 'Sat',
};

const WEEKDAY_TE_SHORT: Record<string, string> = {
  ఆదివారం: 'ఆది',
  సోమవారం: 'సోమ',
  మంగళవారం: 'మంగళ',
  బుధవారం: 'బుధ',
  గురువారం: 'గురు',
  శుక్రవారం: 'శుక్ర',
  శనివారం: 'శని',
};

export function computeWeeklyRashiOutlook(startDay: DayData): {
  weekRangeLabelTe: string;
  weekRangeLabelEn: string;
  rashis: RashiWeeklyOutlook[];
} {
  const days: DayData[] = Array.from({ length: 7 }, (_, idx) =>
    idx === 0 ? startDay : getShiftedDayData(startDay.isoDate, idx)
  );
  const dailyFortunesByDay: RashiDailyFortune[][] = days.map((d) => getDailyRashiFortunes(d));

  const formatShort = (iso: string) => {
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
  };

  const weekRangeLabelTe = `${formatShort(days[0].isoDate)} నుండి ${formatShort(days[6].isoDate)} వరకు (7 రోజుల వార ఫలాలు)`;
  const weekRangeLabelEn = `${days[0].isoDate} to ${days[6].isoDate} (7-Day Transit Outlook)`;

  const rashis: RashiWeeklyOutlook[] = RASHI_META_LIST.map((meta, rIdx) => {
    let favCount = 0;
    let cautionCount = 0;
    let scoreTotal = 0;

    const cells: WeeklyDayCell[] = days.map((d, dIdx) => {
      const f = dailyFortunesByDay[dIdx][rIdx];
      if (f.status === 'favorable') {
        favCount++;
        scoreTotal += 88;
      } else if (f.status === 'caution') {
        cautionCount++;
        scoreTotal += 42;
      } else {
        scoreTotal += 66;
      }
      const shortWTe = WEEKDAY_TE_SHORT[d.label] || d.label.slice(0, 3);
      const shortWEn = WEEKDAY_EN_MAP[d.label] || 'Day';
      return {
        isoDate: d.isoDate,
        shortDateLabel: formatShort(d.isoDate),
        weekdayTe: shortWTe,
        weekdayEn: shortWEn,
        gocharaHouse: f.gocharaHouse,
        status: f.status,
        statusLabelTe: f.statusLabel,
        statusLabelEn: f.statusLabelEn,
      };
    });

    const overallScore = Math.round(scoreTotal / 7);
    const overallStatus: 'favorable' | 'mixed' | 'caution' =
      favCount >= 4 && cautionCount === 0
        ? 'favorable'
        : cautionCount >= 2 || favCount <= 1
        ? 'caution'
        : 'mixed';

    const peakCells = cells.filter((c) => c.status === 'favorable');
    const cautionCells = cells.filter((c) => c.status === 'caution');

    const peakDaysLabelTe =
      peakCells.length > 0
        ? peakCells.map((c) => `${c.weekdayTe} (${c.shortDateLabel})`).join(', ')
        : 'సమతుల్య వారపు రోజులు';
    const peakDaysLabelEn =
      peakCells.length > 0
        ? peakCells.map((c) => `${c.weekdayEn} (${c.shortDateLabel})`).join(', ')
        : 'Balanced mid-week days';

    const cautionDaysLabelTe =
      cautionCells.length > 0
        ? cautionCells.map((c) => `${c.weekdayTe} (${c.shortDateLabel})`).join(', ')
        : 'ప్రత్యేక చంద్రాష్టమ దోషం లేదు';
    const cautionDaysLabelEn =
      cautionCells.length > 0
        ? cautionCells.map((c) => `${c.weekdayEn} (${c.shortDateLabel})`).join(', ')
        : 'No acute Chandrashtamam alerts';

    const midWeekFortune = dailyFortunesByDay[3]?.[rIdx] || dailyFortunesByDay[0][rIdx];

    const weeklySummaryTe =
      overallStatus === 'favorable'
        ? `ఈ వారం ${meta.teluguName} రాశి వారికి చంద్ర బలం ${favCount} రోజులు అత్యంత అనుకూలంగా ఉంది. ముఖ్యమైన ఒప్పందాలు, ఆర్థిక పెట్టుబడులు మరియు శుభకార్య ప్రయత్నాలను ${peakDaysLabelTe} నాడు పూర్తి చేయడం ఉత్తమం.`
        : overallStatus === 'caution'
        ? `ఈ వారం ${meta.teluguName} రాశి వారికి కొన్ని రోజులలో చంద్రబలం మధ్యమంగా/తక్కువగా ఉంది (${cautionDaysLabelTe}). ప్రయాణాలలో, ఆర్థిక హామీలలో ఆచితూచి అడుగు వేయండి; వారం చివరలో శుభ పరిణామాలు వస్తాయి.`
        : `ఈ వారం ${meta.teluguName} రాశి వారికి శుభ, మిశ్రమ ఫలితాలు సమపాళ్లలో ఉంటాయి. ${peakDaysLabelTe} రోజులలో కీలక పనులు ప్రారంభించి, మిగిలిన రోజులలో దైనందిన విధులపై దృష్టి పెట్టండి.`;

    const weeklySummaryEn =
      overallStatus === 'favorable'
        ? `This week brings ${favCount} strong lunar transit days for ${meta.englishName}. Schedule key meetings, financial commitments, and auspicious initiations on ${peakDaysLabelEn}.`
        : overallStatus === 'caution'
        ? `Steady pacing is advised for ${meta.englishName} during ${cautionDaysLabelEn}. Defer high-risk capital decisions and prioritize routine stability.`
        : `${meta.englishName} experiences a balanced week with peak opportunities on ${peakDaysLabelEn}. Combine disciplined execution with calm communication.`;

    return {
      id: meta.id,
      teluguName: meta.teluguName,
      englishName: meta.englishName,
      lord: meta.lord,
      lordEn: meta.lordEn,
      overallStatus,
      overallScore,
      favorableCount: favCount,
      cautionCount,
      peakDaysLabelTe,
      peakDaysLabelEn,
      cautionDaysLabelTe,
      cautionDaysLabelEn,
      weeklySummaryTe,
      weeklySummaryEn,
      careerNoteTe: midWeekFortune.careerFinanceLine.replace(/^\d+\.\s*/, ''),
      careerNoteEn:
        midWeekFortune.englishFullSummary.split('\n')[1]?.replace(/^\d+\.\s*/, '') ||
        'Maintain steady professional momentum.',
      financeNoteTe: midWeekFortune.wealthBusinessLine.replace(/^\d+\.\s*/, ''),
      financeNoteEn: midWeekFortune.englishWealthBusiness.replace(/^\d+\.\s*/, ''),
      remedyTe: midWeekFortune.remedy,
      remedyEn: midWeekFortune.remedyEn,
      days: cells,
    };
  });

  return {
    weekRangeLabelTe,
    weekRangeLabelEn,
    rashis,
  };
}

export interface MonthlyRashiTransitCard {
  id: RashiSlug;
  teluguName: string;
  englishName: string;
  report: RashiGocharaReport;
  monthlyScore: number;
  monthlyVerdict: 'favorable' | 'mixed' | 'caution';
  verdictLabelTe: string;
  verdictLabelEn: string;
  saturnStatusTe: string;
  saturnStatusEn: string;
  jupiterHighlightTe: string;
  jupiterHighlightEn: string;
  rahuKetuHighlightTe: string;
  rahuKetuHighlightEn: string;
}

export function computeMonthlyGocharaOutlookForAllRashis(referenceDateIso?: string): {
  monthHeaderTe: string;
  monthHeaderEn: string;
  cards: MonthlyRashiTransitCard[];
} {
  let refDate = new Date();
  if (referenceDateIso) {
    const [y, m, d] = referenceDateIso.split('-').map(Number);
    if (y && m && d) {
      refDate = new Date(Date.UTC(y, m - 1, d, 6, 0, 0));
    }
  }

  const cards: MonthlyRashiTransitCard[] = RASHI_META_LIST.map((meta) => {
    const slug = meta.id as RashiSlug;
    const report = computeGocharaForRashi(slug, refDate);

    // Score based on Jupiter, Saturn, Rahu, Ketu, Sun, Mars, Venus
    let score = 62;
    if (report.jupiter.isAuspiciousFromMoon) score += report.jupiter.hasVedha ? 7 : 15;
    else score -= 4;

    if (report.saturn.isAuspiciousFromMoon) score += report.saturn.hasVedha ? 5 : 12;
    else if (report.isYelinatiShani || report.saturn.houseFromMoon === 8) score -= 12;

    if (report.rahu.isAuspiciousFromMoon) score += 6;
    if (report.ketu.isAuspiciousFromMoon) score += 5;

    const sunPos = report.planets.find((p) => p.id === 'sun');
    const venPos = report.planets.find((p) => p.id === 'venus');
    if (sunPos?.isAuspiciousFromMoon) score += 5;
    if (venPos?.isAuspiciousFromMoon) score += 5;

    const clamped = Math.max(38, Math.min(96, score));
    const monthlyVerdict: 'favorable' | 'mixed' | 'caution' =
      clamped >= 76 ? 'favorable' : clamped <= 54 ? 'caution' : 'mixed';

    const verdictLabelTe =
      monthlyVerdict === 'favorable'
        ? 'మాస శుభ యోగం'
        : monthlyVerdict === 'caution'
        ? 'శని / గోచార జాగ్రత్త'
        : 'మిశ్రమ మాస ఫలం';

    const verdictLabelEn =
      monthlyVerdict === 'favorable'
        ? 'Favorable Monthly Transit'
        : monthlyVerdict === 'caution'
        ? 'Cautious Transit Phase'
        : 'Balanced Monthly Outlook';

    const satH = report.saturn.houseFromMoon;
    const saturnStatusEn = report.isYelinatiShani
      ? `Sade Sati Active (Saturn in ${satH}th House from Moon)`
      : satH === 8
      ? 'Ashtama Shani (Saturn in 8th House)'
      : satH === 4
      ? 'Ardhastama Shani (Saturn in 4th House)'
      : `Saturn in ${satH}th House (${report.saturn.rashiNameEn})`;

    const jupH = report.jupiter.houseFromMoon;
    const jupiterHighlightTe = `గురుడు ${jupH}వ స్థానంలో (${report.jupiter.rashiNameTe})${
      report.jupiter.isAuspiciousFromMoon ? ' — శుభ గోచార బలం' : ' — మధ్యమ స్థితి'
    }`;
    const jupiterHighlightEn = `Jupiter in ${jupH}th House (${report.jupiter.rashiNameEn})${
      report.jupiter.isAuspiciousFromMoon ? ' — Auspicious Blessing' : ' — Steady Focus'
    }`;

    const rahuH = report.rahu.houseFromMoon;
    const ketuH = report.ketu.houseFromMoon;
    const rahuKetuHighlightTe = `రాహువు ${rahuH}వ స్థానం · కేతువు ${ketuH}వ స్థానం`;
    const rahuKetuHighlightEn = `Rahu in ${rahuH}th · Ketu in ${ketuH}th House`;

    return {
      id: slug,
      teluguName: meta.teluguName,
      englishName: meta.englishName,
      report,
      monthlyScore: clamped,
      monthlyVerdict,
      verdictLabelTe,
      verdictLabelEn,
      saturnStatusTe: report.sadeSatiStatusTe,
      saturnStatusEn,
      jupiterHighlightTe,
      jupiterHighlightEn,
      rahuKetuHighlightTe,
      rahuKetuHighlightEn,
    };
  });

  const sampleDate = cards[0]?.report.computedAtIstIso || referenceDateIso || '2026';
  const monthLabel = sampleDate.slice(0, 7);

  return {
    monthHeaderTe: `దృక్సిద్ధాంత మాస గోచార విశ్లేషణ (${monthLabel}) — గురు, శని, రాహు-కేతు సంచారం`,
    monthHeaderEn: `Sidereal Monthly Transit Synthesis (${monthLabel}) — Jupiter, Saturn & Nodal Cycles`,
    cards,
  };
}
