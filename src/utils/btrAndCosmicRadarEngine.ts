import * as Astronomy from 'astronomy-engine';
import {
  computeAccurateJanmaKundali,
  getSiderealAscendant,
  getSiderealMoonLongitude,
  getSiderealPlanetLongitude,
  getSiderealRahuKetu,
  getSiderealSunLongitude,
  norm360,
} from './astronomyPanchangam';
import { BIRTH_CITIES } from '../data/birthCitiesData';

export type BTRLifeEventType =
  | 'marriage'
  | 'first_job'
  | 'child_birth'
  | 'house_property'
  | 'promotion_award'
  | 'foreign_travel'
  | 'surgery_accident'
  | 'parent_milestone';

export interface BTRLifeEventInput {
  id: string;
  type: BTRLifeEventType;
  date: string; // YYYY-MM-DD
  label?: string;
}

export interface BTRCluesInput {
  birthDate: string;
  approxTime: string;
  cityId: string;
  siblingHint: 'none' | 'younger_more' | 'elder_more';
  careerHint: 'tech_finance' | 'govt_leadership' | 'creative_business' | 'healthcare_service';
  marriageTimingHint: 'early' | 'normal' | 'delayed' | 'unmarried';
  windowMinutes?: number; // default 30 (±30 min); supports 15, 30, 60
  stepMinutes?: number; // default 5; supports 1, 2, 5
  lifeEvents?: BTRLifeEventInput[];
}

export interface BTREventCheckResult {
  eventId: string;
  type: BTRLifeEventType;
  date: string;
  mahadashaLordTe: string;
  mahadashaLordEn: string;
  antardashaLordTe: string;
  antardashaLordEn: string;
  matchedHouses: number[];
  verified: boolean;
  reasonTe: string;
  reasonEn: string;
}

export interface BTRCandidateSlot {
  timeStr: string;
  offsetMins: number;
  d1LagnaTe: string;
  d1LagnaEn: string;
  lagnaDegreeFormatted: string;
  d9NavamshaLagnaTe: string;
  d9NavamshaLagnaEn: string;
  d10DasamshaLagnaTe: string;
  d10DasamshaLagnaEn: string;
  d60ShashtiamsaNum: number;
  pranapadaSignTe: string;
  pranapadaSignEn: string;
  pranapadaAligned: boolean;
  tatwaTe: string;
  tatwaEn: string;
  kundaAligned: boolean;
  mandiAligned: boolean;
  kpStarLordTe: string;
  kpStarLordEn: string;
  kpSubLordTe: string;
  kpSubLordEn: string;
  eventMatchesCount: number;
  eventTotalCount: number;
  eventChecks: BTREventCheckResult[];
  methodBreakdown: {
    pranapada: number;
    kunda: number;
    tatwa: number;
    kpSubLord: number;
    vargaAndClues: number;
    lifeEvents: number;
  };
  matchScore: number;
  notesTe: string;
  notesEn: string;
}

export interface BTRAnalysisReport {
  originalTime: string;
  recommendedTime: string;
  sunriseLocalStr: string;
  kundaSignTe: string;
  kundaSignEn: string;
  mandiSignTe: string;
  mandiSignEn: string;
  bestCandidate: BTRCandidateSlot;
  candidates: BTRCandidateSlot[];
  summaryTe: string;
  summaryEn: string;
}

const RASHI_META = [
  { te: 'మేషం', en: 'Aries', lord: 'Mars' as const, modality: 'chara' as const },
  { te: 'వృషభం', en: 'Taurus', lord: 'Venus' as const, modality: 'sthira' as const },
  { te: 'మిథునం', en: 'Gemini', lord: 'Mercury' as const, modality: 'dwiswabhava' as const },
  { te: 'కర్కాటకం', en: 'Cancer', lord: 'Moon' as const, modality: 'chara' as const },
  { te: 'సింహం', en: 'Leo', lord: 'Sun' as const, modality: 'sthira' as const },
  { te: 'కన్య', en: 'Virgo', lord: 'Mercury' as const, modality: 'dwiswabhava' as const },
  { te: 'తుల', en: 'Libra', lord: 'Venus' as const, modality: 'chara' as const },
  { te: 'వృశ్చికం', en: 'Scorpio', lord: 'Mars' as const, modality: 'sthira' as const },
  { te: 'ధనుస్సు', en: 'Sagittarius', lord: 'Jupiter' as const, modality: 'dwiswabhava' as const },
  { te: 'మకరం', en: 'Capricorn', lord: 'Saturn' as const, modality: 'chara' as const },
  { te: 'కుంభం', en: 'Aquarius', lord: 'Saturn' as const, modality: 'sthira' as const },
  { te: 'మీనం', en: 'Pisces', lord: 'Jupiter' as const, modality: 'dwiswabhava' as const },
];

type GrahaKey = 'Ketu' | 'Venus' | 'Sun' | 'Moon' | 'Mars' | 'Rahu' | 'Jupiter' | 'Saturn' | 'Mercury';

const VIMSHOTTARI_ORDER: Array<{
  key: GrahaKey;
  years: number;
  te: string;
  en: string;
  planetIdx: number; // index inside computeAccurateJanmaKundali().planets
}> = [
  { key: 'Ketu', years: 7, te: 'కేతువు', en: 'Ketu', planetIdx: 9 },
  { key: 'Venus', years: 20, te: 'శుక్రుడు', en: 'Venus', planetIdx: 6 },
  { key: 'Sun', years: 6, te: 'సూర్యుడు', en: 'Sun', planetIdx: 1 },
  { key: 'Moon', years: 10, te: 'చంద్రుడు', en: 'Moon', planetIdx: 2 },
  { key: 'Mars', years: 7, te: 'కుజుడు', en: 'Mars', planetIdx: 3 },
  { key: 'Rahu', years: 18, te: 'రాహువు', en: 'Rahu', planetIdx: 8 },
  { key: 'Jupiter', years: 16, te: 'గురుడు', en: 'Jupiter', planetIdx: 5 },
  { key: 'Saturn', years: 19, te: 'శని', en: 'Saturn', planetIdx: 7 },
  { key: 'Mercury', years: 17, te: 'బుధుడు', en: 'Mercury', planetIdx: 4 },
];

const TATWAS = [
  { te: 'పృథ్వీ తత్వం (స్థిరత్వం)', en: 'Prithvi (Earth · Grounded)', durMins: 6 },
  { te: 'జల తత్వం (సృజన & దయ)', en: 'Jala (Water · Intuitive)', durMins: 12 },
  { te: 'తేజో తత్వం (నాయకత్వం)', en: 'Tejas (Fire · Dynamic)', durMins: 18 },
  { te: 'వాయు తత్వం (మేధస్సు)', en: 'Vayu (Air · Analytical)', durMins: 24 },
  { te: 'ఆకాశ తత్వం (ఆధ్యాత్మికం)', en: 'Akasha (Ether · Expansive)', durMins: 30 },
];

export const BTR_LIFE_EVENT_CATALOG: Record<
  BTRLifeEventType,
  {
    labelTe: string;
    labelEn: string;
    houses: number[];
    karakas: GrahaKey[];
  }
> = {
  marriage: {
    labelTe: 'వివాహం (Marriage)',
    labelEn: 'Marriage',
    houses: [2, 7, 11],
    karakas: ['Venus', 'Jupiter'],
  },
  first_job: {
    labelTe: 'మొదటి ఉద్యోగం / వ్యాపారం (First Job / Career Start)',
    labelEn: 'First Job / Career Start',
    houses: [2, 6, 10, 11],
    karakas: ['Saturn', 'Mercury', 'Sun'],
  },
  child_birth: {
    labelTe: 'మొదటి సంతానం (Childbirth)',
    labelEn: 'Childbirth',
    houses: [2, 5, 9, 11],
    karakas: ['Jupiter'],
  },
  house_property: {
    labelTe: 'గృహప్రవేశం / ఆస్తి కొనుగోలు (House / Property)',
    labelEn: 'House / Property Purchase',
    houses: [4, 11, 2],
    karakas: ['Mars', 'Venus', 'Moon'],
  },
  promotion_award: {
    labelTe: 'ప్రమోషన్ / పురస్కారం (Promotion / Achievement)',
    labelEn: 'Promotion / Major Award',
    houses: [10, 11, 9, 5],
    karakas: ['Sun', 'Jupiter'],
  },
  foreign_travel: {
    labelTe: 'విదేశీ ప్రయాణం / స్థానచలనం (Foreign Travel / Relocation)',
    labelEn: 'Foreign Travel / Relocation',
    houses: [3, 9, 12],
    karakas: ['Rahu', 'Moon', 'Saturn'],
  },
  surgery_accident: {
    labelTe: 'సర్జరీ / ప్రమాదం / అనారోగ్యం (Surgery / Health Event)',
    labelEn: 'Surgery / Accident / Health Milestone',
    houses: [6, 8, 12],
    karakas: ['Mars', 'Saturn', 'Rahu', 'Ketu'],
  },
  parent_milestone: {
    labelTe: 'తల్లిదండ్రుల ముఖ్య సంఘటన (Parents Milestone)',
    labelEn: 'Parents Major Event',
    houses: [4, 9, 10, 12],
    karakas: ['Sun', 'Moon'],
  },
};

function computeKpStarAndSubLord(lonDeg: number): {
  starLord: (typeof VIMSHOTTARI_ORDER)[number];
  subLord: (typeof VIMSHOTTARI_ORDER)[number];
} {
  const norm = norm360(lonDeg);
  const nakSpan = 360 / 27; // 13.333333°
  const nakIdx = Math.floor(norm / nakSpan) % 27;
  const startOrderIdx = nakIdx % 9;
  const starLord = VIMSHOTTARI_ORDER[startOrderIdx];
  const offsetInNak = norm - nakIdx * nakSpan;

  let accum = 0;
  let subLord = starLord;
  for (let i = 0; i < 9; i++) {
    const candidate = VIMSHOTTARI_ORDER[(startOrderIdx + i) % 9];
    const subSpan = (candidate.years / 120) * nakSpan;
    if (offsetInNak <= accum + subSpan + 1e-9) {
      subLord = candidate;
      break;
    }
    accum += subSpan;
  }
  return { starLord, subLord };
}

function computeD10DasamshaSign(lonDeg: number): number {
  const norm = norm360(lonDeg);
  const signIdx = Math.floor(norm / 30) % 12;
  const degInSign = norm % 30;
  const part = Math.min(9, Math.floor(degInSign / 3));
  const isOddSign = signIdx % 2 === 0; // 0=Aries (Odd)
  const startSign = isOddSign ? signIdx : (signIdx + 8) % 12; // 9th from even sign
  return (startSign + part) % 12;
}

function computeD60PartNum(lonDeg: number): number {
  const degInSign = norm360(lonDeg) % 30;
  return Math.min(60, Math.floor(degInSign * 2) + 1);
}

/**
 * Computes exact Vimshottari Mahadasha & Antardasha running on an event date
 * given birth UTC timestamp and natal Moon longitude.
 */
function getVimshottariDashaAtDate(
  birthDateIso: string,
  natalMoonLon: number,
  eventDateIso: string
): {
  maha: (typeof VIMSHOTTARI_ORDER)[number];
  antar: (typeof VIMSHOTTARI_ORDER)[number];
} | null {
  const bMs = Date.parse(`${birthDateIso}T00:00:00Z`);
  const eMs = Date.parse(`${eventDateIso}T00:00:00Z`);
  if (!Number.isFinite(bMs) || !Number.isFinite(eMs) || eMs < bMs) return null;

  const elapsedYears = (eMs - bMs) / (365.2425 * 24 * 3600 * 1000);
  const nakSpan = 360 / 27;
  const normMoon = norm360(natalMoonLon);
  const nakIdx = Math.floor(normMoon / nakSpan) % 27;
  const fracElapsed = (normMoon - nakIdx * nakSpan) / nakSpan;
  const startIdx = nakIdx % 9;

  // Balance of first Mahadasha
  let cursorYears = 0;
  const firstMaha = VIMSHOTTARI_ORDER[startIdx];
  const firstBalance = firstMaha.years * (1 - fracElapsed);

  let activeMahaIdx = startIdx;
  let yearsIntoActiveMaha = 0;

  if (elapsedYears < firstBalance) {
    activeMahaIdx = startIdx;
    yearsIntoActiveMaha = firstMaha.years * fracElapsed + elapsedYears;
  } else {
    cursorYears = firstBalance;
    for (let step = 1; step <= 27; step++) {
      const idx = (startIdx + step) % 9;
      const dur = VIMSHOTTARI_ORDER[idx].years;
      if (elapsedYears < cursorYears + dur) {
        activeMahaIdx = idx;
        yearsIntoActiveMaha = elapsedYears - cursorYears;
        break;
      }
      cursorYears += dur;
    }
  }

  const maha = VIMSHOTTARI_ORDER[activeMahaIdx];
  let antarCursor = 0;
  let antar = maha;
  for (let i = 0; i < 9; i++) {
    const aLord = VIMSHOTTARI_ORDER[(activeMahaIdx + i) % 9];
    const aDur = (maha.years * aLord.years) / 120;
    if (yearsIntoActiveMaha <= antarCursor + aDur + 1e-6) {
      antar = aLord;
      break;
    }
    antarCursor += aDur;
  }

  return { maha, antar };
}

/**
 * Returns all houses (1..12) signified by a planet from a candidate Lagna Rashi:
 * occupied house + ruled houses + aspected houses (7th).
 */
function getSignifiedHousesForGraha(
  grahaKey: GrahaKey,
  lagnaRashiIdx: number,
  planetRashisByKey: Record<GrahaKey, number>
): number[] {
  const houses = new Set<number>();
  const occupiedRashi = planetRashisByKey[grahaKey];
  if (typeof occupiedRashi === 'number') {
    const occH = ((occupiedRashi - lagnaRashiIdx + 12) % 12) + 1;
    houses.add(occH);
    // Natural 7th aspect
    houses.add(((occH + 5) % 12) + 1);
  }
  // Houses ruled by this Graha
  RASHI_META.forEach((rm, rIdx) => {
    if (rm.lord === grahaKey) {
      const hNum = ((rIdx - lagnaRashiIdx + 12) % 12) + 1;
      houses.add(hNum);
    }
  });
  return Array.from(houses);
}

/**
 * Classical BPHS Pranapada Lagna from exact sunrise & elapsed Vighatikas.
 * Chara Sun -> from Sun; Sthira Sun -> from 9th sign from Sun; Dual Sun -> from 5th sign from Sun.
 */
function computePranapadaLongitude(sunLon: number, minsAfterSunrise: number): number {
  const vighatikas = Math.max(0, minsAfterSunrise) * 2.5;
  const sunSignIdx = Math.floor(norm360(sunLon) / 30) % 12;
  const modality = RASHI_META[sunSignIdx].modality;
  let baseLon = sunLon;
  if (modality === 'sthira') baseLon = norm360(sunLon + 240); // 9th sign
  else if (modality === 'dwiswabhava') baseLon = norm360(sunLon + 120); // 5th sign
  // BPHS: 15 vighatikas = 1 sign (30°), so 1 vighatika = 2°
  return norm360(baseLon + vighatikas * 2);
}

/**
 * Classical 90-minute Pancha Tatwa cycle from local sunrise:
 * Prithvi (6m), Jala (12m), Tejas (18m), Vayu (24m), Akasha (30m) — repeats in आरोहण/अवरोहण cycle.
 */
function computePanchaTatwaIdx(minsAfterSunrise: number): number {
  const m = ((minsAfterSunrise % 90) + 90) % 90;
  if (m < 6) return 0; // Prithvi
  if (m < 18) return 1; // Jala
  if (m < 36) return 2; // Tejas
  if (m < 60) return 3; // Vayu
  return 4; // Akasha
}

export function runBirthTimeRectificationScan(input: BTRCluesInput): BTRAnalysisReport {
  const city = BIRTH_CITIES.find((c) => c.id === input.cityId) || BIRTH_CITIES[0];
  const [hhStr, mmStr] = (input.approxTime || '09:30').split(':');
  const baseMinOfDay = (Number(hhStr) || 9) * 60 + (Number(mmStr) || 30);

  const [yStr, moStr, dStr] = (input.birthDate || '1995-05-15').split('-');
  const year = parseInt(yStr, 10) || 1995;
  const month = parseInt(moStr, 10) || 5;
  const dayNum = parseInt(dStr, 10) || 15;
  const tzOffsetHrs = city.tz;

  // Exact astronomical local sunrise & sunset via astronomy-engine
  const observer = new Astronomy.Observer(city.lat, city.lon, 250);
  const startOfLocalDayUtc = new Date(
    Date.UTC(year, month - 1, dayNum, 0, 0, 0) - tzOffsetHrs * 3600 * 1000
  );
  const riseEv = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, startOfLocalDayUtc, 1);
  const setEv = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startOfLocalDayUtc, 1);

  const sunriseUtc = riseEv
    ? riseEv.date
    : new Date(Date.UTC(year, month - 1, dayNum, 6, 15, 0) - tzOffsetHrs * 3600 * 1000);
  const sunsetUtc = setEv
    ? setEv.date
    : new Date(Date.UTC(year, month - 1, dayNum, 18, 15, 0) - tzOffsetHrs * 3600 * 1000);

  const srLocal = new Date(sunriseUtc.getTime() + tzOffsetHrs * 3600 * 1000);
  const ssLocal = new Date(sunsetUtc.getTime() + tzOffsetHrs * 3600 * 1000);
  const sunriseMinOfDay = srLocal.getUTCHours() * 60 + srLocal.getUTCMinutes() + srLocal.getUTCSeconds() / 60;
  const sunsetMinOfDay = ssLocal.getUTCHours() * 60 + ssLocal.getUTCMinutes() + ssLocal.getUTCSeconds() / 60;
  const sunriseLocalStr = `${String(srLocal.getUTCHours()).padStart(2, '0')}:${String(srLocal.getUTCMinutes()).padStart(2, '0')}`;

  // Base chart for Moon, Sun, planets
  const baseChart = computeAccurateJanmaKundali(
    input.birthDate,
    input.approxTime,
    city.lat,
    city.lon,
    city.tz
  );
  const natalSunLon = baseChart.planets[1].longitude;
  const natalMoonLon = baseChart.planets[2].longitude;

  // 1. Classical Kunda Sphuta = (Moon Longitude * 81) % 360
  const kundaLon = norm360(natalMoonLon * 81);
  const kundaRashiIdx = Math.floor(kundaLon / 30) % 12;

  // 2. Classical Mandi / Gulika Lagna for weekday daytime/nighttime octant
  const dow = new Date(Date.UTC(year, month - 1, dayNum)).getUTCDay();
  const isDayBirth = baseMinOfDay >= sunriseMinOfDay && baseMinOfDay <= sunsetMinOfDay;
  const dayMandiOctant: Record<number, number> = { 0: 6, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 0 };
  const nightMandiOctant: Record<number, number> = { 0: 2, 1: 1, 2: 0, 3: 6, 4: 5, 5: 4, 6: 3 };
  const spanMins = isDayBirth
    ? Math.max(540, sunsetMinOfDay - sunriseMinOfDay)
    : Math.max(540, 1440 - (sunsetMinOfDay - sunriseMinOfDay));
  const mandiOct = isDayBirth ? (dayMandiOctant[dow] ?? 2) : (nightMandiOctant[dow] ?? 2);
  const mandiStartMin = isDayBirth
    ? sunriseMinOfDay + (mandiOct * spanMins) / 8
    : sunsetMinOfDay + (mandiOct * spanMins) / 8;
  const mandiUtc = new Date(
    Date.UTC(year, month - 1, dayNum, 0, 0, 0) + (mandiStartMin - tzOffsetHrs * 60) * 60 * 1000
  );
  const mandiLon = getSiderealAscendant(mandiUtc, city.lat, city.lon);
  const mandiRashiIdx = Math.floor(mandiLon / 30) % 12;

  // Precompute Graha rashi map (planets barely move within ±60 mins)
  const planetRashisByKey: Record<GrahaKey, number> = {
    Sun: baseChart.planets[1].rashiIdx,
    Moon: baseChart.planets[2].rashiIdx,
    Mars: baseChart.planets[3].rashiIdx,
    Mercury: baseChart.planets[4].rashiIdx,
    Jupiter: baseChart.planets[5].rashiIdx,
    Venus: baseChart.planets[6].rashiIdx,
    Saturn: baseChart.planets[7].rashiIdx,
    Rahu: baseChart.planets[8].rashiIdx,
    Ketu: baseChart.planets[9].rashiIdx,
  };

  // Precompute Vimshottari Mahadasha & Antardasha for each valid user life event
  const validEvents = (input.lifeEvents || []).filter(
    (ev) => ev.date && /^\d{4}-\d{2}-\d{2}$/.test(ev.date)
  );
  const eventDashas = validEvents.map((ev) => ({
    event: ev,
    dasha: getVimshottariDashaAtDate(input.birthDate, natalMoonLon, ev.date),
  }));

  const windowMins = Math.min(60, Math.max(10, input.windowMinutes ?? 30));
  const stepMins = Math.min(10, Math.max(1, input.stepMinutes ?? 5));

  const candidates: BTRCandidateSlot[] = [];

  for (let offset = -windowMins; offset <= windowMins; offset += stepMins) {
    const rawMin = baseMinOfDay + offset;
    const totalMin = ((rawMin % 1440) + 1440) % 1440;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const chart = computeAccurateJanmaKundali(
      input.birthDate,
      timeStr,
      city.lat,
      city.lon,
      city.tz
    );

    const lagnaLon = chart.planets[0].longitude;
    const lagnaRashiIdx = chart.planets[0].rashiIdx;
    const d9RashiIdx = chart.planets[0].navamshaRashiIdx;
    const d10RashiIdx = computeD10DasamshaSign(lagnaLon);
    const d60PartNum = computeD60PartNum(lagnaLon);
    const degInSign = lagnaLon % 30;
    const degWhole = Math.floor(degInSign);
    const degMin = Math.floor((degInSign - degWhole) * 60);
    const lagnaDegreeFormatted = `${String(degWhole).padStart(2, '0')}°${String(degMin).padStart(2, '0')}'`;

    // Real minutes elapsed since local sunrise (wrapping around 24h for pre-sunrise births)
    const minsAfterSunrise =
      totalMin >= sunriseMinOfDay
        ? totalMin - sunriseMinOfDay
        : 1440 - sunriseMinOfDay + totalMin;

    // Method 1: BPHS Pranapada Lagna Alignment (1, 5, 9, or 7 from Natal Lagna or D9)
    const ppLon = computePranapadaLongitude(natalSunLon, minsAfterSunrise);
    const ppRashiIdx = Math.floor(ppLon / 30) % 12;
    const ppDistD1 = ((lagnaRashiIdx - ppRashiIdx + 12) % 12) + 1;
    const ppDistD9 = ((d9RashiIdx - ppRashiIdx + 12) % 12) + 1;
    const pranapadaAligned = [1, 5, 9, 7].includes(ppDistD1) || [1, 5, 9].includes(ppDistD9);
    const pranapadaScore = [1, 5, 9].includes(ppDistD1)
      ? 20
      : ppDistD1 === 7
        ? 15
        : [1, 5, 9].includes(ppDistD9)
          ? 12
          : 4;

    // Method 2: Kunda Sphuta (81× Moon) Trikona Alignment
    const kundaDist = ((lagnaRashiIdx - kundaRashiIdx + 12) % 12) + 1;
    const kundaD9Dist = ((d9RashiIdx - kundaRashiIdx + 12) % 12) + 1;
    const kundaAligned = [1, 5, 9].includes(kundaDist) || [1, 5, 9].includes(kundaD9Dist);
    const kundaScore = [1, 5, 9].includes(kundaDist)
      ? 18
      : [1, 5, 9].includes(kundaD9Dist)
        ? 12
        : 4;

    // Method 3: Classical Pancha Tatwa Shodhana from real sunrise
    const tatwaIdx = computePanchaTatwaIdx(minsAfterSunrise);
    const tatwa = TATWAS[tatwaIdx];
    let tatwaScore = 7;
    if (input.careerHint === 'tech_finance' && [3, 0, 4].includes(tatwaIdx)) tatwaScore = 13;
    else if (input.careerHint === 'govt_leadership' && [2, 4].includes(tatwaIdx)) tatwaScore = 13;
    else if (input.careerHint === 'creative_business' && [1, 2, 3].includes(tatwaIdx)) tatwaScore = 13;
    else if (input.careerHint === 'healthcare_service' && [1, 0, 4].includes(tatwaIdx)) tatwaScore = 13;

    // Method 4: KP 249 Ascendant Star-Lord & Sub-Lord Signification
    const { starLord, subLord } = computeKpStarAndSubLord(lagnaLon);
    const subLordHouses = getSignifiedHousesForGraha(subLord.key, lagnaRashiIdx, planetRashisByKey);
    let kpSubScore = 7;
    if (subLordHouses.some((h) => [1, 5, 9, 10, 11].includes(h))) kpSubScore += 6;
    if (
      (input.careerHint === 'tech_finance' && ['Mercury', 'Saturn', 'Rahu'].includes(subLord.key)) ||
      (input.careerHint === 'govt_leadership' && ['Sun', 'Jupiter', 'Mars'].includes(subLord.key)) ||
      (input.careerHint === 'creative_business' && ['Venus', 'Mercury', 'Moon'].includes(subLord.key)) ||
      (input.careerHint === 'healthcare_service' && ['Jupiter', 'Moon', 'Ketu'].includes(subLord.key))
    ) {
      kpSubScore += 4;
    }

    // Method 5: Mandi-Lagna + Varga (D9/D10) + Clues
    const mandiDist = ((lagnaRashiIdx - mandiRashiIdx + 12) % 12) + 1;
    const mandiAligned = [1, 5, 9, 4, 7, 10].includes(mandiDist);
    let vargaClueScore = mandiAligned ? 7 : 3;

    const marsHouse = ((chart.planets[3].rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
    const jupHouse = ((chart.planets[5].rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
    const satHouse = ((chart.planets[7].rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
    const d10LordKey = RASHI_META[d10RashiIdx].lord;

    if (input.siblingHint === 'younger_more' && [3, 1, 10].includes(marsHouse)) vargaClueScore += 4;
    if (input.siblingHint === 'elder_more' && [11, 5, 9].includes(jupHouse)) vargaClueScore += 4;
    if (input.marriageTimingHint === 'delayed' && [1, 5, 7, 10].includes(satHouse)) vargaClueScore += 4;
    if (input.marriageTimingHint === 'early' && [1, 4, 7, 11].includes(jupHouse)) vargaClueScore += 4;
    if (
      (input.careerHint === 'tech_finance' && ['Mercury', 'Saturn'].includes(d10LordKey)) ||
      (input.careerHint === 'govt_leadership' && ['Sun', 'Mars', 'Jupiter'].includes(d10LordKey)) ||
      (input.careerHint === 'creative_business' && ['Venus', 'Mercury'].includes(d10LordKey)) ||
      (input.careerHint === 'healthcare_service' && ['Moon', 'Jupiter', 'Mars'].includes(d10LordKey))
    ) {
      vargaClueScore += 4;
    }

    // Method 6: Real Life-Event Vimshottari Mahadasha + Antardasha Verification
    const eventChecks: BTREventCheckResult[] = [];
    let matchedEvents = 0;
    for (const item of eventDashas) {
      if (!item.dasha) continue;
      const meta = BTR_LIFE_EVENT_CATALOG[item.event.type];
      const mahaHouses = getSignifiedHousesForGraha(
        item.dasha.maha.key,
        lagnaRashiIdx,
        planetRashisByKey
      );
      const antarHouses = getSignifiedHousesForGraha(
        item.dasha.antar.key,
        lagnaRashiIdx,
        planetRashisByKey
      );
      const combined = Array.from(new Set([...mahaHouses, ...antarHouses]));
      const hits = meta.houses.filter((h) => combined.includes(h));
      const karakaHit =
        meta.karakas.includes(item.dasha.maha.key) || meta.karakas.includes(item.dasha.antar.key);
      const verified = hits.length >= 2 || (hits.length >= 1 && karakaHit);
      if (verified) matchedEvents++;

      eventChecks.push({
        eventId: item.event.id,
        type: item.event.type,
        date: item.event.date,
        mahadashaLordTe: item.dasha.maha.te,
        mahadashaLordEn: item.dasha.maha.en,
        antardashaLordTe: item.dasha.antar.te,
        antardashaLordEn: item.dasha.antar.en,
        matchedHouses: hits,
        verified,
        reasonTe: verified
          ? `${item.dasha.maha.te}–${item.dasha.antar.te} దశ ${hits.join(', ')}వ భావాలను బలంగా సక్రియం చేసింది`
          : `${item.dasha.maha.te}–${item.dasha.antar.te} దశకు తక్కువ భావ అనుసంధానం`,
        reasonEn: verified
          ? `${item.dasha.maha.en}–${item.dasha.antar.en} Dasha strongly activates House ${hits.join(', ')}`
          : `${item.dasha.maha.en}–${item.dasha.antar.en} Dasha shows weaker house activation`,
      });
    }

    const lifeEventsScore =
      eventChecks.length > 0
        ? Math.round((matchedEvents / eventChecks.length) * 20)
        : 10; // neutral baseline when no dated events provided

    // Small tie-breaker favoring closeness to reported birth time
    const proximityBonus = Math.max(0, 5 - Math.abs(offset) / Math.max(6, windowMins / 5));

    const totalRaw =
      pranapadaScore +
      kundaScore +
      tatwaScore +
      kpSubScore +
      vargaClueScore +
      lifeEventsScore +
      proximityBonus;
    const roundedScore = Math.min(99, Math.max(42, Math.round(totalRaw)));

    const highlightsTe: string[] = [];
    const highlightsEn: string[] = [];
    if (pranapadaAligned) {
      highlightsTe.push(`ప్రాణపద (${RASHI_META[ppRashiIdx].te}) సమన్వయం`);
      highlightsEn.push(`Pranapada (${RASHI_META[ppRashiIdx].en}) aligned`);
    }
    if (kundaAligned) {
      highlightsTe.push(`కుండ (${RASHI_META[kundaRashiIdx].te}) త్రికోణం`);
      highlightsEn.push(`Kunda (${RASHI_META[kundaRashiIdx].en}) Trikona`);
    }
    highlightsTe.push(`KP సబ్: ${subLord.te}`);
    highlightsEn.push(`KP Sub: ${subLord.en}`);

    candidates.push({
      timeStr,
      offsetMins: offset,
      d1LagnaTe: chart.lagna.te,
      d1LagnaEn: chart.lagna.en,
      lagnaDegreeFormatted,
      d9NavamshaLagnaTe: chart.navamshaLagna.te,
      d9NavamshaLagnaEn: chart.navamshaLagna.en,
      d10DasamshaLagnaTe: RASHI_META[d10RashiIdx].te,
      d10DasamshaLagnaEn: RASHI_META[d10RashiIdx].en,
      d60ShashtiamsaNum: d60PartNum,
      pranapadaSignTe: RASHI_META[ppRashiIdx].te,
      pranapadaSignEn: RASHI_META[ppRashiIdx].en,
      pranapadaAligned,
      tatwaTe: tatwa.te,
      tatwaEn: tatwa.en,
      kundaAligned,
      mandiAligned,
      kpStarLordTe: starLord.te,
      kpStarLordEn: starLord.en,
      kpSubLordTe: subLord.te,
      kpSubLordEn: subLord.en,
      eventMatchesCount: matchedEvents,
      eventTotalCount: eventChecks.length,
      eventChecks,
      methodBreakdown: {
        pranapada: pranapadaScore,
        kunda: kundaScore,
        tatwa: tatwaScore,
        kpSubLord: kpSubScore,
        vargaAndClues: vargaClueScore,
        lifeEvents: lifeEventsScore,
      },
      matchScore: roundedScore,
      notesTe: highlightsTe.join(' · '),
      notesEn: highlightsEn.join(' · '),
    });
  }

  const best = [...candidates].sort((a, b) => b.matchScore - a.matchScore)[0] || candidates[0];

  const eventSummaryTe =
    best.eventTotalCount > 0
      ? ` మరియు మీరు ఇచ్చిన ${best.eventTotalCount} జీవిత ఘటనలలో ${best.eventMatchesCount} వింశోత్తరి దశలతో ఖచ్చితంగా సరిపోలాయి.`
      : '.';
  const eventSummaryEn =
    best.eventTotalCount > 0
      ? ` and verified ${best.eventMatchesCount}/${best.eventTotalCount} dated life milestones via Vimshottari Mahadasha–Antardasha.`
      : '.';

  return {
    originalTime: input.approxTime,
    recommendedTime: best.timeStr,
    sunriseLocalStr,
    kundaSignTe: RASHI_META[kundaRashiIdx].te,
    kundaSignEn: RASHI_META[kundaRashiIdx].en,
    mandiSignTe: RASHI_META[mandiRashiIdx].te,
    mandiSignEn: RASHI_META[mandiRashiIdx].en,
    bestCandidate: best,
    candidates,
    summaryTe: `ప్రాణపద లగ్నం (${best.pranapadaSignTe}), కుండ స్ఫుట (${RASHI_META[kundaRashiIdx].te}), పంచ తత్వం (${best.tatwaTe}) & KP సబ్‌లార్డ్ (${best.kpSubLordTe}) ప్రకారం ${best.timeStr} (${best.d1LagnaTe} ${best.lagnaDegreeFormatted} · D9 ${best.d9NavamshaLagnaTe} · D10 ${best.d10DasamshaLagnaTe}) అత్యంత బలంగా సరిపోతోంది${eventSummaryTe}`,
    summaryEn: `Combining BPHS Pranapada (${best.pranapadaSignEn}), 81x Moon Kunda (${RASHI_META[kundaRashiIdx].en}), Pancha Tatwa (${best.tatwaEn}), and KP Ascendant Sub-Lord (${best.kpSubLordEn}), ${best.timeStr} (${best.d1LagnaEn} ${best.lagnaDegreeFormatted} · D9 ${best.d9NavamshaLagnaEn} · D10 ${best.d10DasamshaLagnaEn}) achieves the highest classical alignment${eventSummaryEn}`,
  };
}

export interface LivePlanetPosition {
  id: string;
  nameTe: string;
  nameEn: string;
  shortCode: string;
  color: string;
  longitude: number;
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  degInSign: number;
  degFormatted: string;
  nakshatraTe: string;
  nakshatraEn: string;
  pada: number;
  isRetrograde: boolean;
}

export interface MonthlyTransitPowerPoint {
  monthLabelTe: string;
  monthLabelEn: string;
  powerPct: number;
  highlightTe: string;
  highlightEn: string;
}

const NAKSHATRA_NAMES = [
  { te: 'అశ్విని', en: 'Ashwini' },
  { te: 'భరణి', en: 'Bharani' },
  { te: 'కృత్తిక', en: 'Krittika' },
  { te: 'రోహిణి', en: 'Rohini' },
  { te: 'మృగశిర', en: 'Mrigashira' },
  { te: 'ఆరుద్ర', en: 'Ardra' },
  { te: 'పునర్వసు', en: 'Punarvasu' },
  { te: 'పుష్యమి', en: 'Pushyami' },
  { te: 'ఆశ్లేష', en: 'Ashlesha' },
  { te: 'మఖ', en: 'Magha' },
  { te: 'పుబ్బ', en: 'Pubba' },
  { te: 'ఉత్తర', en: 'Uttara' },
  { te: 'హస్త', en: 'Hasta' },
  { te: 'చిత్త', en: 'Chitta' },
  { te: 'స్వాతి', en: 'Swati' },
  { te: 'విశాఖ', en: 'Vishakha' },
  { te: 'అనురాధ', en: 'Anuradha' },
  { te: 'జ్యేష్ఠ', en: 'Jyeshtha' },
  { te: 'మూల', en: 'Moola' },
  { te: 'పూర్వాషాఢ', en: 'Purvashadha' },
  { te: 'ఉత్తరాషాఢ', en: 'Uttarashadha' },
  { te: 'శ్రవణం', en: 'Shravanam' },
  { te: 'ధనిష్ఠ', en: 'Dhanishtha' },
  { te: 'శతభిషం', en: 'Shatabhisham' },
  { te: 'పూర్వాభాద్ర', en: 'Purvabhadra' },
  { te: 'ఉత్తరాభాద్ర', en: 'Uttarabhadra' },
  { te: 'రేవతి', en: 'Revati' },
];

export function computeLiveCosmicSnapshot(targetDate: Date = new Date()): LivePlanetPosition[] {
  const nextHour = new Date(targetDate.getTime() + 3600 * 1000);
  const sunLon = getSiderealSunLongitude(targetDate);
  const moonLon = getSiderealMoonLongitude(targetDate);
  const marsLon = getSiderealPlanetLongitude(Astronomy.Body.Mars, targetDate);
  const marsNext = getSiderealPlanetLongitude(Astronomy.Body.Mars, nextHour);
  const mercLon = getSiderealPlanetLongitude(Astronomy.Body.Mercury, targetDate);
  const mercNext = getSiderealPlanetLongitude(Astronomy.Body.Mercury, nextHour);
  const jupLon = getSiderealPlanetLongitude(Astronomy.Body.Jupiter, targetDate);
  const jupNext = getSiderealPlanetLongitude(Astronomy.Body.Jupiter, nextHour);
  const venLon = getSiderealPlanetLongitude(Astronomy.Body.Venus, targetDate);
  const venNext = getSiderealPlanetLongitude(Astronomy.Body.Venus, nextHour);
  const satLon = getSiderealPlanetLongitude(Astronomy.Body.Saturn, targetDate);
  const satNext = getSiderealPlanetLongitude(Astronomy.Body.Saturn, nextHour);
  const { rahu, ketu } = getSiderealRahuKetu(targetDate);

  const isRetro = (c: number, n: number) => {
    let diff = n - c;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff < 0;
  };

  const specs = [
    { id: 'sun', te: 'రవి (Sun)', en: 'Sun', code: 'Su', color: '#ea580c', lon: sunLon, retro: false },
    { id: 'moon', te: 'చంద్ర (Moon)', en: 'Moon', code: 'Mo', color: '#0284c7', lon: moonLon, retro: false },
    { id: 'mars', te: 'కుజ (Mars)', en: 'Mars', code: 'Ma', color: '#dc2626', lon: marsLon, retro: isRetro(marsLon, marsNext) },
    { id: 'mercury', te: 'బుధ (Merc)', en: 'Mercury', code: 'Me', color: '#16a34a', lon: mercLon, retro: isRetro(mercLon, mercNext) },
    { id: 'jupiter', te: 'గురు (Jup)', en: 'Jupiter', code: 'Ju', color: '#ca8a04', lon: jupLon, retro: isRetro(jupLon, jupNext) },
    { id: 'venus', te: 'శుక్ర (Ven)', en: 'Venus', code: 'Ve', color: '#db2777', lon: venLon, retro: isRetro(venLon, venNext) },
    { id: 'saturn', te: 'శని (Sat)', en: 'Saturn', code: 'Sa', color: '#334155', lon: satLon, retro: isRetro(satLon, satNext) },
    { id: 'rahu', te: 'రాహు (Rahu)', en: 'Rahu', code: 'Ra', color: '#7c3aed', lon: rahu, retro: true },
    { id: 'ketu', te: 'కేతు (Ketu)', en: 'Ketu', code: 'Ke', color: '#57534e', lon: ketu, retro: true },
  ];

  const nakSpan = 360 / 27;
  return specs.map((s) => {
    const lon = norm360(s.lon);
    const rashiIdx = Math.floor(lon / 30) % 12;
    const degInSign = lon - rashiIdx * 30;
    const d = Math.floor(degInSign);
    const m = Math.floor((degInSign - d) * 60);
    const nakIdx = Math.floor(lon / nakSpan) % 27;
    const pada = Math.min(4, Math.floor((lon - nakIdx * nakSpan) / (nakSpan / 4)) + 1);

    return {
      id: s.id,
      nameTe: s.te,
      nameEn: s.en,
      shortCode: s.code,
      color: s.color,
      longitude: lon,
      rashiIdx,
      rashiTe: RASHI_META[rashiIdx].te,
      rashiEn: RASHI_META[rashiIdx].en,
      degInSign,
      degFormatted: `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'`,
      nakshatraTe: NAKSHATRA_NAMES[nakIdx].te,
      nakshatraEn: NAKSHATRA_NAMES[nakIdx].en,
      pada,
      isRetrograde: s.retro,
    };
  });
}

const MONTHS_TE = ['జన', 'ఫిబ్ర', 'మార్చి', 'ఏప్రి', 'మే', 'జూన్', 'జులై', 'ఆగ', 'సెప్టె', 'అక్టో', 'నవం', 'డిసె'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function compute12MonthTransitPower(natalMoonRashiIdx: number): MonthlyTransitPowerPoint[] {
  const now = new Date();
  const points: MonthlyTransitPowerPoint[] = [];

  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 15, 6, 0));
    const sunLon = getSiderealSunLongitude(d);
    const jupLon = getSiderealPlanetLongitude(Astronomy.Body.Jupiter, d);
    const satLon = getSiderealPlanetLongitude(Astronomy.Body.Saturn, d);
    const venLon = getSiderealPlanetLongitude(Astronomy.Body.Venus, d);

    const sunH = ((Math.floor(sunLon / 30) - natalMoonRashiIdx + 12) % 12) + 1;
    const jupH = ((Math.floor(jupLon / 30) - natalMoonRashiIdx + 12) % 12) + 1;
    const satH = ((Math.floor(satLon / 30) - natalMoonRashiIdx + 12) % 12) + 1;
    const venH = ((Math.floor(venLon / 30) - natalMoonRashiIdx + 12) % 12) + 1;

    let score = 52;
    if ([2, 5, 7, 9, 11].includes(jupH)) score += 22;
    else if ([1, 4, 10].includes(jupH)) score += 10;

    if ([3, 6, 11].includes(satH)) score += 14;
    else if ([1, 8, 12].includes(satH)) score -= 8;

    if ([3, 6, 10, 11].includes(sunH)) score += 10;
    if ([1, 2, 4, 5, 9, 11, 12].includes(venH)) score += 7;

    const powerPct = Math.min(96, Math.max(36, score));
    const mIdx = d.getUTCMonth();
    const yr = String(d.getUTCFullYear()).slice(2);

    const highlightTe =
      powerPct >= 80
        ? `గురు(${jupH}వ) & రవి(${sunH}వ) అత్యుత్తమ యోగం`
        : powerPct >= 65
        ? `శుభ ఫలితాలు · శుక్ర(${venH}వ) అనుకూలత`
        : `శని(${satH}వ) క్రమశిక్షణతో పురోగతి`;

    const highlightEn =
      powerPct >= 80
        ? `Peak Guru H${jupH} & Sun H${sunH} Yoga`
        : powerPct >= 65
        ? `Steady growth · Venus H${venH} support`
        : `Disciplined phase · Saturn H${satH}`;

    points.push({
      monthLabelTe: `${MONTHS_TE[mIdx]} '${yr}`,
      monthLabelEn: `${MONTHS_EN[mIdx]} '${yr}`,
      powerPct,
      highlightTe,
      highlightEn,
    });
  }

  return points;
}
