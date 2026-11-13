import * as Astronomy from 'astronomy-engine';
import {
  computeAccurateJanmaKundali,
  getSiderealMoonLongitude,
  getSiderealPlanetLongitude,
  getSiderealRahuKetu,
  getSiderealSunLongitude,
  norm360,
} from './astronomyPanchangam';
import { BIRTH_CITIES } from '../data/birthCitiesData';

export interface BTRCluesInput {
  birthDate: string;
  approxTime: string;
  cityId: string;
  siblingHint: 'none' | 'younger_more' | 'elder_more';
  careerHint: 'tech_finance' | 'govt_leadership' | 'creative_business' | 'healthcare_service';
  marriageTimingHint: 'early' | 'normal' | 'delayed' | 'unmarried';
}

export interface BTRCandidateSlot {
  timeStr: string;
  offsetMins: number;
  d1LagnaTe: string;
  d1LagnaEn: string;
  d9NavamshaLagnaTe: string;
  d9NavamshaLagnaEn: string;
  tatwaTe: string;
  tatwaEn: string;
  kundaAligned: boolean;
  matchScore: number;
  notesTe: string;
  notesEn: string;
}

export interface BTRAnalysisReport {
  originalTime: string;
  recommendedTime: string;
  kundaSignTe: string;
  kundaSignEn: string;
  candidates: BTRCandidateSlot[];
  summaryTe: string;
  summaryEn: string;
}

const RASHI_META = [
  { te: 'మేషం', en: 'Aries' },
  { te: 'వృషభం', en: 'Taurus' },
  { te: 'మిథునం', en: 'Gemini' },
  { te: 'కర్కాటకం', en: 'Cancer' },
  { te: 'సింహం', en: 'Leo' },
  { te: 'కన్య', en: 'Virgo' },
  { te: 'తుల', en: 'Libra' },
  { te: 'వృశ్చికం', en: 'Scorpio' },
  { te: 'ధనుస్సు', en: 'Sagittarius' },
  { te: 'మకరం', en: 'Capricorn' },
  { te: 'కుంభం', en: 'Aquarius' },
  { te: 'మీనం', en: 'Pisces' },
];

const TATWAS = [
  { te: 'పృథ్వీ తత్వం (స్థిర స్వభావం)', en: 'Prithvi (Earth - Grounded)' },
  { te: 'జల తత్వం (భావోద్వేగం)', en: 'Jala (Water - Intuitive)' },
  { te: 'తేజో తత్వం (నాయకత్వం)', en: 'Tejas (Fire - Dynamic)' },
  { te: 'వాయు తత్వం (మేధస్సు)', en: 'Vayu (Air - Analytical)' },
  { te: 'ఆకాశ తత్వం (ఆధ్యాత్మికం)', en: 'Akasha (Ether - Expansive)' },
];

export function runBirthTimeRectificationScan(input: BTRCluesInput): BTRAnalysisReport {
  const city = BIRTH_CITIES.find((c) => c.id === input.cityId) || BIRTH_CITIES[0];
  const [hhStr, mmStr] = (input.approxTime || '09:30').split(':');
  const baseMinOfDay = (Number(hhStr) || 9) * 60 + (Number(mmStr) || 30);

  const baseChart = computeAccurateJanmaKundali(
    input.birthDate,
    input.approxTime,
    city.lat,
    city.lon,
    city.tz
  );
  // Classical Kunda Sphuta = (Moon Longitude * 81) % 360
  const kundaLon = norm360(baseChart.planets[2].longitude * 81);
  const kundaRashiIdx = Math.floor(kundaLon / 30) % 12;

  const candidates: BTRCandidateSlot[] = [];

  for (let offset = -30; offset <= 30; offset += 5) {
    const totalMin = (baseMinOfDay + offset + 1440) % 1440;
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

    const lagnaRashiIdx = chart.planets[0].rashiIdx;
    const d9RashiIdx = chart.planets[0].navamshaRashiIdx;
    const minsAfterSunrise = Math.max(0, totalMin - 360);
    const tatwaIdx = Math.floor((minsAfterSunrise % 120) / 24) % 5;
    const tatwa = TATWAS[tatwaIdx];

    // Kunda aligns if Lagna Rashi is in 1, 5, 9 from Kunda Rashi
    const kundaDist = ((lagnaRashiIdx - kundaRashiIdx + 12) % 12) + 1;
    const kundaAligned = [1, 5, 9].includes(kundaDist);

    let score = 60;
    if (kundaAligned) score += 16;

    // 3rd / 11th house sibling clue check
    const marsHouse = ((chart.planets[3].rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
    const jupHouse = ((chart.planets[5].rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
    const satHouse = ((chart.planets[7].rashiIdx - lagnaRashiIdx + 12) % 12) + 1;

    if (input.siblingHint === 'younger_more' && [3, 1, 10].includes(marsHouse)) score += 7;
    if (input.siblingHint === 'elder_more' && [11, 5, 9].includes(jupHouse)) score += 7;
    if (input.careerHint === 'tech_finance' && [1, 3, 4].includes(tatwaIdx)) score += 6;
    if (input.careerHint === 'govt_leadership' && [2, 4].includes(tatwaIdx)) score += 6;
    if (input.marriageTimingHint === 'delayed' && [1, 5, 7, 10].includes(satHouse)) score += 7;
    if (input.marriageTimingHint === 'early' && [1, 4, 7, 11].includes(jupHouse)) score += 7;

    // Proximity bonus to stated birth time when tie
    score += Math.max(0, 6 - Math.abs(offset) / 5);

    const roundedScore = Math.min(98, Math.round(score));

    candidates.push({
      timeStr,
      offsetMins: offset,
      d1LagnaTe: chart.lagna.te,
      d1LagnaEn: chart.lagna.en,
      d9NavamshaLagnaTe: chart.navamshaLagna.te,
      d9NavamshaLagnaEn: chart.navamshaLagna.en,
      tatwaTe: tatwa.te,
      tatwaEn: tatwa.en,
      kundaAligned,
      matchScore: roundedScore,
      notesTe: kundaAligned
        ? `కుండ స్ఫుట (${RASHI_META[kundaRashiIdx].te}) తో త్రికోణ సమన్వయం ఉంది`
        : `${chart.navamshaLagna.te} నవాంశ లగ్న పరివర్తన`,
      notesEn: kundaAligned
        ? `Trikona resonance with Kunda Sphuta (${RASHI_META[kundaRashiIdx].en})`
        : `${chart.navamshaLagna.en} Navamsa Lagna window`,
    });
  }

  const best = [...candidates].sort((a, b) => b.matchScore - a.matchScore)[0] || candidates[0];

  return {
    originalTime: input.approxTime,
    recommendedTime: best.timeStr,
    kundaSignTe: RASHI_META[kundaRashiIdx].te,
    kundaSignEn: RASHI_META[kundaRashiIdx].en,
    candidates,
    summaryTe: `చంద్రుని 81వ భాగం (కుండ స్ఫుట ${RASHI_META[kundaRashiIdx].te}) మరియు తత్వ శోధన ప్రకారం ${best.timeStr} సమయం (${best.d1LagnaTe} లగ్నం · ${best.d9NavamshaLagnaTe} నవాంశ) అత్యంత బలంగా సరిపోతోంది.`,
    summaryEn: `Based on Moon's 81x Kunda Sphuta (${RASHI_META[kundaRashiIdx].en}) and Tatwa Shodhana, ${best.timeStr} (${best.d1LagnaEn} D1 / ${best.d9NavamshaLagnaEn} D9) yields peak alignment.`,
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
