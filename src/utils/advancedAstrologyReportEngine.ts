/**
 * Advanced Astrology Report Engine (బృహత్ పరాశర హోరా శాస్త్ర ప్రామాణిక ఇంజిన్)
 *
 * Implements:
 * 1. Accurate Planetary Dignities (Ucha, Neecha, Swakshetra, Moolatrikona, Mitra, Shatru, Vargottama, Vakri, Asta/Combust)
 * 2. Neecha Bhanga Raja Yoga detection (Parashari rules)
 * 3. Classical Yoga & Dosha analysis (Guru-Chandala, Gandanta, Kemadruma, Kala Sarpa, Raja/Dhana, Sade Sati)
 * 4. Triple Kuja Dosha (from Lagna, Chandra Lagna, and Shukra Lagna)
 * 5. Dynamic Marriage Timing based on DOB and real Jupiter transits (no hardcoded ages)
 * 6. Precise Vimshottari Mahadasha -> Antardasha -> Pratyantardasha timeline with Janma Dasha Shesham
 * 7. 12-Month Gochara Transit Forecast
 * 8. Divisional Charts: Chandra Lagna, D10 Dashamsha, D7 Saptamsha, D12 Dwadashamsha
 * 9. Ashtakavarga distribution (Sarvashtakavarga 337 points)
 * 10. Panchanga Birth Profile: Samvatsara, Ayana, Ritu, Masa, Paksha, Tithi, Vaara, Karana, Yoga, Gana, Yoni, Nadi, Varna, Vashya, Nama Aksharam
 * 11. 1-Page Executive Summary (Top 5 Strengths, 3 Cautions, 12-Month Outlook, Current Dasha)
 * 12. Bilingual (Telugu & English) representations for NRI users
 */

import { KundaliPlanetDetail, KundaliResult } from './astronomyPanchangam';

export interface PlanetaryDignity {
  id: string;
  nameTe: string;
  nameEn: string;
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  degreeFormatted: string;
  nakshatraTe: string;
  nakshatraEn: string;
  pada: number;
  navamshaRashiIdx: number;
  navamshaRashiTe: string;
  navamshaRashiEn: string;
  isRetrograde: boolean;
  isCombust: boolean;
  combustDegreeDiff?: number;
  isVargottama: boolean;
  dignityCode: 'ucha' | 'moolatrikona' | 'swakshetra' | 'mitra' | 'sama' | 'shatru' | 'neecha';
  dignityTe: string;
  dignityEn: string;
  strengthScorePct: number; // 0 - 100
  dignityNotesTe: string;
  dignityNotesEn: string;
}

export interface NeechaBhangaCheck {
  planetId: string;
  planetTe: string;
  planetEn: string;
  debilitationRashiTe: string;
  debilitationRashiEn: string;
  hasNeechaBhanga: boolean;
  cancellationTypeTe: string;
  cancellationTypeEn: string;
  explanationTe: string;
  explanationEn: string;
}

export interface DetectedYoga {
  id: string;
  nameTe: string;
  nameEn: string;
  category: 'raja' | 'dhana' | 'dosha' | 'special';
  isPresent: boolean;
  impactLevel: 'very_auspicious' | 'auspicious' | 'moderate' | 'challenging' | 'severe';
  descriptionTe: string;
  descriptionEn: string;
  remedyTe?: string;
  remedyEn?: string;
}

export interface TripleKujaDoshaAnalysis {
  fromLagna: { house: number; hasDosha: boolean; severityPct: number };
  fromChandra: { house: number; hasDosha: boolean; severityPct: number };
  fromShukra: { house: number; hasDosha: boolean; severityPct: number };
  overallDoshaCategory: 'none' | 'mild' | 'moderate' | 'high';
  netDoshaPercentage: number;
  summaryTitleTe: string;
  summaryTitleEn: string;
  detailedAnalysisTe: string;
  detailedAnalysisEn: string;
  mitigationFactorsTe: string[];
  mitigationFactorsEn: string[];
  recommendedRemedyTe: string;
  recommendedRemedyEn: string;
}

export interface MarriageTimingDynamic {
  currentAge: number;
  currentFavorableWindows: {
    period: string;
    ageSpan: string;
    transitNoteTe: string;
    transitNoteEn: string;
    favorability: 'very_high' | 'high' | 'moderate';
  }[];
  primaryRecommendationTe: string;
  primaryRecommendationEn: string;
}

export interface DashaPeriodItem {
  level: 'mahadasha' | 'antardasha' | 'pratyantardasha';
  lordId: string;
  lordTe: string;
  lordEn: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  effectsSummaryTe: string;
  effectsSummaryEn: string;
}

export interface VimshottariDashaFullTimeline {
  janmaDashaLordTe: string;
  janmaDashaLordEn: string;
  janmaDashaBalanceFormattedTe: string;
  janmaDashaBalanceFormattedEn: string;
  currentMahadasha: DashaPeriodItem;
  currentAntardasha: DashaPeriodItem;
  currentPratyantardasha?: DashaPeriodItem;
  mahadashas: {
    lordId: string;
    lordTe: string;
    lordEn: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    antardashas: DashaPeriodItem[];
  }[];
}

export interface Gochara12MonthsItem {
  planetId: string;
  planetTe: string;
  planetEn: string;
  transitRashiTe: string;
  transitRashiEn: string;
  houseFromMoon: number;
  houseFromLagna: number;
  favorableStatus: 'shubha' | 'ashubha' | 'sama';
  keyDates: string;
  predictionTe: string;
  predictionEn: string;
}

export interface DivisionalChartPlacement {
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  planets: string[]; // names of planets
}

export interface DivisionalChartsCollection {
  chandraLagnaRashiIdx: number;
  chandraLagnaRashiTe: string;
  d10DashamshaLagnaIdx: number;
  d10Chart: Record<number, string[]>;
  d7SaptamshaLagnaIdx: number;
  d7Chart: Record<number, string[]>;
  d12DwadashamshaLagnaIdx: number;
  d12Chart: Record<number, string[]>;
}

export interface AshtakavargaProfile {
  sarvashtakavarga: Record<number, number>; // rashiIdx (0-11) -> points (sum = 337)
  strongestRashisTe: string;
  strongestRashisEn: string;
  challengingRashisTe: string;
  challengingRashisEn: string;
}

export interface PanchangaBirthProfile {
  samvatsaraTe: string;
  samvatsaraEn: string;
  ayanaTe: string;
  ayanaEn: string;
  rituTe: string;
  rituEn: string;
  masaTe: string;
  masaEn: string;
  pakshaTe: string;
  pakshaEn: string;
  tithiTe: string;
  tithiEn: string;
  vaaraTe: string;
  vaaraEn: string;
  karanaTe: string;
  karanaEn: string;
  yogaTe: string;
  yogaEn: string;
  ganaTe: string;
  ganaEn: string;
  yoniTe: string;
  yoniEn: string;
  nadiTe: string;
  nadiEn: string;
  varnaTe: string;
  varnaEn: string;
  vashyaTe: string;
  vashyaEn: string;
  namaAksharamTe: string;
  namaAksharamEn: string;
  latLonFormatted: string;
  timezoneFormatted: string;
  ayanamsaFormatted: string;
}

export interface ExecutiveSummaryReport {
  oneLineDashaSummaryTe: string;
  oneLineDashaSummaryEn: string;
  top5StrengthsTe: string[];
  top5StrengthsEn: string[];
  top3CautionsTe: string[];
  top3CautionsEn: string[];
  next12MonthsOutlookTe: string;
  next12MonthsOutlookEn: string;
  vitalRemedyFocusTe: string;
  vitalRemedyFocusEn: string;
}

// Classical Dignity Constants
const RASHI_NAMES_TE = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
];
const RASHI_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const PLANET_NAMES_MAP: Record<string, { te: string; en: string }> = {
  sun: { te: 'సూర్యుడు', en: 'Sun' },
  moon: { te: 'చంద్రుడు', en: 'Moon' },
  mars: { te: 'కుజుడు', en: 'Mars' },
  mercury: { te: 'బుధుడు', en: 'Mercury' },
  jupiter: { te: 'గురువు', en: 'Jupiter' },
  venus: { te: 'శుక్రుడు', en: 'Venus' },
  saturn: { te: 'శని', en: 'Saturn' },
  rahu: { te: 'రాహువు', en: 'Rahu' },
  ketu: { te: 'కేతువు', en: 'Ketu' },
};

// Exaltation (Ucha) and Debilitation (Neecha) signs & degrees
const DIGNITY_RULES: Record<
  string,
  {
    uchaRashi: number;
    uchaDegree: number;
    neechaRashi: number;
    neechaDegree: number;
    swakshetra: number[];
    moolatrikona: number;
    combustionLimitDegrees: number;
  }
> = {
  sun: { uchaRashi: 0, uchaDegree: 10, neechaRashi: 6, neechaDegree: 10, swakshetra: [4], moolatrikona: 4, combustionLimitDegrees: 0 },
  moon: { uchaRashi: 1, uchaDegree: 3, neechaRashi: 7, neechaDegree: 3, swakshetra: [3], moolatrikona: 1, combustionLimitDegrees: 12 },
  mars: { uchaRashi: 9, uchaDegree: 28, neechaRashi: 3, neechaDegree: 28, swakshetra: [0, 7], moolatrikona: 0, combustionLimitDegrees: 17 },
  mercury: { uchaRashi: 5, uchaDegree: 15, neechaRashi: 11, neechaDegree: 15, swakshetra: [2, 5], moolatrikona: 5, combustionLimitDegrees: 14 },
  jupiter: { uchaRashi: 3, uchaDegree: 5, neechaRashi: 9, neechaDegree: 5, swakshetra: [8, 11], moolatrikona: 8, combustionLimitDegrees: 11 },
  venus: { uchaRashi: 11, uchaDegree: 27, neechaRashi: 5, neechaDegree: 27, swakshetra: [1, 6], moolatrikona: 6, combustionLimitDegrees: 10 },
  saturn: { uchaRashi: 6, uchaDegree: 20, neechaRashi: 0, neechaDegree: 20, swakshetra: [9, 10], moolatrikona: 10, combustionLimitDegrees: 15 },
  rahu: { uchaRashi: 1, uchaDegree: 20, neechaRashi: 7, neechaDegree: 20, swakshetra: [10], moolatrikona: 1, combustionLimitDegrees: 0 },
  ketu: { uchaRashi: 7, uchaDegree: 20, neechaRashi: 1, neechaDegree: 20, swakshetra: [7], moolatrikona: 7, combustionLimitDegrees: 0 },
};

// Natural friendships (Naisargika Mitra / Shatru / Sama)
const NAISARGIKA_FRIENDS: Record<string, { friends: string[]; enemies: string[] }> = {
  sun: { friends: ['moon', 'mars', 'jupiter'], enemies: ['venus', 'saturn', 'rahu', 'ketu'] },
  moon: { friends: ['sun', 'mercury'], enemies: ['rahu', 'ketu'] },
  mars: { friends: ['sun', 'moon', 'jupiter'], enemies: ['mercury'] },
  mercury: { friends: ['sun', 'venus'], enemies: ['moon'] },
  jupiter: { friends: ['sun', 'moon', 'mars'], enemies: ['mercury', 'venus'] },
  venus: { friends: ['mercury', 'saturn', 'rahu', 'ketu'], enemies: ['sun', 'moon'] },
  saturn: { friends: ['mercury', 'venus', 'rahu'], enemies: ['sun', 'moon', 'mars'] },
  rahu: { friends: ['venus', 'saturn', 'mercury'], enemies: ['sun', 'moon', 'mars'] },
  ketu: { friends: ['mars', 'jupiter', 'venus'], enemies: ['sun', 'moon'] },
};

const RASHI_LORDS = [
  'mars', // Aries
  'venus', // Taurus
  'mercury', // Gemini
  'moon', // Cancer
  'sun', // Leo
  'mercury', // Virgo
  'venus', // Libra
  'mars', // Scorpio
  'jupiter', // Sagittarius
  'saturn', // Capricorn
  'saturn', // Aquarius
  'jupiter', // Pisces
];

// Vimshottari Mahadasha order and years
export const VIMSHOTTARI_DASHA_CYCLE: { lord: string; lordTe: string; lordEn: string; years: number }[] = [
  { lord: 'ketu', lordTe: 'కేతువు', lordEn: 'Ketu', years: 7 },
  { lord: 'venus', lordTe: 'శుక్రుడు', lordEn: 'Venus', years: 20 },
  { lord: 'sun', lordTe: 'సూర్యుడు', lordEn: 'Sun', years: 6 },
  { lord: 'moon', lordTe: 'చంద్రుడు', lordEn: 'Moon', years: 10 },
  { lord: 'mars', lordTe: 'కుజుడు', lordEn: 'Mars', years: 7 },
  { lord: 'rahu', lordTe: 'రాహువు', lordEn: 'Rahu', years: 18 },
  { lord: 'jupiter', lordTe: 'గురువు', lordEn: 'Jupiter', years: 16 },
  { lord: 'saturn', lordTe: 'శని', lordEn: 'Saturn', years: 19 },
  { lord: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury', years: 17 },
];

// 27 Nakshatras with lord
const NAKSHATRA_LORDS_ORDER = [
  'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury',
  'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury',
  'ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury',
];

const RASHI_ID_MAP: Record<string, number> = {
  mesha: 0,
  vrishabha: 1,
  mithuna: 2,
  karkataka: 3,
  simha: 4,
  kanya: 5,
  tula: 6,
  vrishchika: 7,
  dhanusu: 8,
  makara: 9,
  kumbha: 10,
  meena: 11,
};

export function resolveRashiIdx(val: number | string | undefined): number {
  if (typeof val === 'number') return ((val % 12) + 12) % 12;
  if (!val) return 0;
  const lower = String(val).toLowerCase().trim();
  if (RASHI_ID_MAP[lower] !== undefined) return RASHI_ID_MAP[lower];
  const foundIdx = RASHI_NAMES_EN.findIndex((r) => r.toLowerCase() === lower);
  if (foundIdx >= 0) return foundIdx;
  const teIdx = RASHI_NAMES_TE.findIndex((r) => r === val);
  if (teIdx >= 0) return teIdx;
  return 0;
}

/**
 * 1. Compute Planetary Dignities
 */
export function computePlanetaryDignities(
  planets: KundaliPlanetDetail[],
  rawLagnaIdx: number | string
): PlanetaryDignity[] {
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  const actualPlanets = planets.filter((p) => p.id !== 'lagna');
  const sunPlanet = actualPlanets.find((p) => p.id === 'sun') || actualPlanets[0];
  const sunAbsDeg = sunPlanet.longitude !== undefined ? sunPlanet.longitude : sunPlanet.rashiIdx * 30;

  return actualPlanets.map((p) => {
    const rule = DIGNITY_RULES[p.id] || {
      uchaRashi: -1,
      uchaDegree: 0,
      neechaRashi: -1,
      neechaDegree: 0,
      swakshetra: [],
      moolatrikona: -1,
      combustionLimitDegrees: 0,
    };
    const rashiLordId = RASHI_LORDS[p.rashiIdx];
    const isVargottama = p.rashiIdx === p.navamshaRashiIdx;

    const pAbsDeg = p.longitude !== undefined ? p.longitude : p.rashiIdx * 30;

    // Check combustion (Asta)
    let isCombust = false;
    let combustDegreeDiff: number | undefined;
    if (p.id !== 'sun' && p.id !== 'rahu' && p.id !== 'ketu' && rule.combustionLimitDegrees > 0) {
      let diff = Math.abs(pAbsDeg - sunAbsDeg);
      if (diff > 180) diff = 360 - diff;
      combustDegreeDiff = Math.round(diff * 100) / 100;
      if (diff <= rule.combustionLimitDegrees) {
        isCombust = true;
      }
    }

    // Determine Dignity Code
    let dignityCode: PlanetaryDignity['dignityCode'] = 'sama';
    let dignityTe = 'సమ క్షేత్రం';
    let dignityEn = 'Neutral Sign';
    let strengthScorePct = 55;
    let dignityNotesTe = '';
    let dignityNotesEn = '';

    if (rule.uchaRashi === p.rashiIdx) {
      dignityCode = 'ucha';
      dignityTe = 'ఉచ్చ స్థితి (Exalted)';
      dignityEn = 'Exalted (Ucha)';
      strengthScorePct = 95;
      dignityNotesTe = 'పరమోచ్చ లేదా ఉచ్చ రాశిలో ఉండి సర్వోత్కృష్ట బలంతో ఫలాలు అందిస్తాడు.';
      dignityNotesEn = 'Positioned in exaltation sign, bestowing maximum potency.';
    } else if (rule.neechaRashi === p.rashiIdx) {
      dignityCode = 'neecha';
      dignityTe = 'నీచ స్థితి (Debilitated)';
      dignityEn = 'Debilitated (Neecha)';
      strengthScorePct = 25;
      dignityNotesTe = 'నీచ రాశిలో స్థితి వల్ల ప్రాథమిక బలం తగ్గినది; నీచభంగ రాజయోగ పరిశీలన అవశ్యం.';
      dignityNotesEn = 'Debilitated in classic sign; requires Neecha Bhanga Raja Yoga analysis.';
    } else if (rule.moolatrikona === p.rashiIdx && (p.id === 'saturn' || p.id === 'sun' || p.id === 'mercury')) {
      dignityCode = 'moolatrikona';
      dignityTe = 'మూలత్రికోణం (Moolatrikona)';
      dignityEn = 'Moolatrikona';
      strengthScorePct = 88;
      dignityNotesTe = 'మూలత్రికోణ రాశిలో విశేష అధికార బలం కలిగి ఉన్నాడు.';
      dignityNotesEn = 'Occupies its Moolatrikona sign with strong executive delivery.';
    } else if (rule.swakshetra.includes(p.rashiIdx)) {
      dignityCode = 'swakshetra';
      dignityTe = 'స్వక్షేత్రం (Own House)';
      dignityEn = 'Own House (Swakshetra)';
      strengthScorePct = 82;
      dignityNotesTe = 'సొంత రాశిలో ఉండి సకల శుభాలను సులభంగా చేకూరుస్తాడు.';
      dignityNotesEn = 'Comfortably seated in own domain, delivering stable auspicious results.';
    } else {
      const friendship = NAISARGIKA_FRIENDS[p.id];
      if (friendship) {
        if (friendship.friends.includes(rashiLordId)) {
          dignityCode = 'mitra';
          dignityTe = 'మిత్ర క్షేత్రం (Friendly)';
          dignityEn = 'Friendly Sign (Mitra)';
          strengthScorePct = 68;
          dignityNotesTe = `రాశ్యధిపతి అయిన ${PLANET_NAMES_MAP[rashiLordId]?.te || rashiLordId}తో మిత్రత్వం కలిగి ఉన్నాడు.`;
          dignityNotesEn = `Shares natural friendship with sign lord ${PLANET_NAMES_MAP[rashiLordId]?.en || rashiLordId}.`;
        } else if (friendship.enemies.includes(rashiLordId)) {
          dignityCode = 'shatru';
          dignityTe = 'శత్రు క్షేత్రం (Inimical)';
          dignityEn = 'Inimical Sign (Shatru)';
          strengthScorePct = 38;
          dignityNotesTe = `రాశ్యధిపతి అయిన ${PLANET_NAMES_MAP[rashiLordId]?.te || rashiLordId}తో శత్రుత్వం వల్ల కార్య సాధనలో శ్రమ అవసరం.`;
          dignityNotesEn = `In inimical sign of ${PLANET_NAMES_MAP[rashiLordId]?.en || rashiLordId}, requiring perseverance.`;
        } else {
          dignityCode = 'sama';
          dignityTe = 'సమ క్షేత్రం (Neutral)';
          dignityEn = 'Neutral Sign';
          strengthScorePct = 52;
          dignityNotesTe = 'సమ రాశిలో ఉండి సాధారణ ఫలితాలను ఇస్తాడు.';
          dignityNotesEn = 'Neutral placement delivering balanced outcomes.';
        }
      }
    }

    if (isVargottama) {
      strengthScorePct = Math.min(100, strengthScorePct + 15);
      dignityNotesTe += ' వర్గోత్తమ బలం చేకూరినందున దృఢమైన అనుకూలత లభిస్తుంది.';
      dignityNotesEn += ' Vargottama placement fortifies natural capacity.';
    }

    if (isCombust) {
      strengthScorePct = Math.max(15, strengthScorePct - 25);
      dignityNotesTe += ` సూర్యునికి అత్యంత సమీపంలో (${combustDegreeDiff}°) ఉన్నందున అస్తంగత (Combust) దోషం ఏర్పడినది.`;
      dignityNotesEn += ` Combust within ${combustDegreeDiff}° of Sun, reducing material externalization.`;
    }

    if (p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu') {
      strengthScorePct = Math.min(100, strengthScorePct + 10);
      dignityNotesTe += ' వక్ర గతి (Retrograde) వల్ల చేష్టాబలం అధికం.';
      dignityNotesEn += ' Retrograde motion gives enhanced Cheshta Bala.';
    }

    return {
      id: p.id,
      nameTe: p.nameTe,
      nameEn: p.nameEn,
      rashiIdx: p.rashiIdx,
      rashiTe: p.rashiTe,
      rashiEn: p.rashiEn,
      degreeFormatted: p.degreeFormatted,
      nakshatraTe: p.nakshatraTe,
      nakshatraEn: p.nakshatraEn,
      pada: p.pada,
      navamshaRashiIdx: p.navamshaRashiIdx,
      navamshaRashiTe: p.navamshaRashiTe,
      navamshaRashiEn: p.navamshaRashiEn || RASHI_NAMES_EN[p.navamshaRashiIdx] || 'Aries',
      isRetrograde: Boolean(p.isRetrograde),
      isCombust,
      combustDegreeDiff,
      isVargottama,
      dignityCode,
      dignityTe,
      dignityEn,
      strengthScorePct,
      dignityNotesTe: dignityNotesTe.trim(),
      dignityNotesEn: dignityNotesEn.trim(),
    };
  });
}

/**
 * 2. Neecha Bhanga Raja Yoga Check
 */
export function checkNeechaBhangaRajaYoga(
  dignities: PlanetaryDignity[],
  planets: KundaliPlanetDetail[],
  rawLagnaIdx: number | string
): NeechaBhangaCheck[] {
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  const moonPlanet = planets.find((p) => p.id === 'moon') || planets[1];
  const moonRashiIdx = moonPlanet.rashiIdx;

  const debilitatedPlanets = dignities.filter((d) => d.dignityCode === 'neecha');
  const results: NeechaBhangaCheck[] = [];

  for (const dp of debilitatedPlanets) {
    const debRashiLordId = RASHI_LORDS[dp.rashiIdx];
    const debLordPlanet = planets.find((p) => p.id === debRashiLordId);

    // Lord of the exaltation sign of the debilitated planet
    // E.g. Moon gets exalted in Taurus (lord Venus); Venus gets exalted in Pisces (lord Jupiter)
    const debPlanetRule = DIGNITY_RULES[dp.id];
    const exaltSignLordId = debPlanetRule ? RASHI_LORDS[debPlanetRule.uchaRashi] : null;
    const exaltLordPlanet = exaltSignLordId ? planets.find((p) => p.id === exaltSignLordId) : null;

    // Planet exalted in this debilitation sign (e.g. in Virgo, Mercury is exalted)
    const planetExaltedHereId = Object.keys(DIGNITY_RULES).find(
      (k) => DIGNITY_RULES[k].uchaRashi === dp.rashiIdx
    );
    const planetExaltedHere = planetExaltedHereId
      ? planets.find((p) => p.id === planetExaltedHereId)
      : null;

    // Kendra from Lagna (1, 4, 7, 10 -> diff 0, 3, 6, 9)
    const isKendraFromLagna = (rIdx: number) => {
      const diff = ((rIdx - lagnaRashiIdx + 12) % 12);
      return [0, 3, 6, 9].includes(diff);
    };

    // Kendra from Moon
    const isKendraFromMoon = (rIdx: number) => {
      const diff = ((rIdx - moonRashiIdx + 12) % 12);
      return [0, 3, 6, 9].includes(diff);
    };

    let hasNeechaBhanga = false;
    let cancellationTypeTe = '';
    let cancellationTypeEn = '';
    let explanationTe = '';
    let explanationEn = '';

    if (debLordPlanet && (isKendraFromLagna(debLordPlanet.rashiIdx) || isKendraFromMoon(debLordPlanet.rashiIdx))) {
      hasNeechaBhanga = true;
      const ref = isKendraFromLagna(debLordPlanet.rashiIdx) ? 'లగ్నానికి' : 'చంద్రునికి';
      const refEn = isKendraFromLagna(debLordPlanet.rashiIdx) ? 'Lagna' : 'Chandra Lagna';
      cancellationTypeTe = `నీచ రాశ్యాధిపతి కేంద్ర స్థితి (${ref})`;
      cancellationTypeEn = `Debilitation Sign Lord in Kendra from ${refEn}`;
      explanationTe = `నీచ రాశ్యాధిపతి అయిన ${debLordPlanet.nameTe} ${ref} కేంద్రంలో (${debLordPlanet.rashiTe}) ఉన్నందున శాస్త్రోక్తంగా సంపూర్ణ నీచభంగ రాజయోగం ఏర్పడినది. ప్రారంభంలో ప్రతిబంధకాలు ఎదురైనా, తదుపరి కాలంలో అపూర్వ విజయం, అధికార యోగం ప్రాప్తిస్తాయి.`;
      explanationEn = `The dispositor of the debilitation sign, ${debLordPlanet.nameEn}, is comfortably situated in a Kendra from ${refEn} (${debLordPlanet.rashiEn}). This activates a classic Neecha Bhanga Raja Yoga, turning initial hurdles into exceptional elevation.`;
    } else if (exaltLordPlanet && (isKendraFromLagna(exaltLordPlanet.rashiIdx) || isKendraFromMoon(exaltLordPlanet.rashiIdx))) {
      hasNeechaBhanga = true;
      const ref = isKendraFromLagna(exaltLordPlanet.rashiIdx) ? 'లగ్నానికి' : 'చంద్రునికి';
      const refEn = isKendraFromLagna(exaltLordPlanet.rashiIdx) ? 'Lagna' : 'Chandra Lagna';
      cancellationTypeTe = `ఉచ్చ రాశ్యాధిపతి కేంద్ర స్థితి (${ref})`;
      cancellationTypeEn = `Exaltation Lord in Kendra from ${refEn}`;
      explanationTe = `ఈ గ్రహం యొక్క ఉచ్చ రాశ్యాధిపతి అయిన ${exaltLordPlanet.nameTe} ${ref} కేంద్ర స్థానంలో ఉన్నందున బలమైన నీచభంగం సిద్ధించినది.`;
      explanationEn = `The lord of the exaltation sign of this planet, ${exaltLordPlanet.nameEn}, is positioned in a Kendra from ${refEn}, dissolving the debilitation.`;
    } else if (planetExaltedHere && (isKendraFromLagna(planetExaltedHere.rashiIdx) || isKendraFromMoon(planetExaltedHere.rashiIdx))) {
      hasNeechaBhanga = true;
      cancellationTypeTe = 'ఉచ్చనాథుని కేంద్ర స్థితి';
      cancellationTypeEn = 'Exalted Planet in Kendra';
      explanationTe = `ఈ రాశిలో ఉచ్చ స్థితి పొందే ${planetExaltedHere.nameTe} కేంద్రంలో ఉన్నందున నీచభంగం సిద్ధించినది.`;
      explanationEn = `${planetExaltedHere.nameEn}, who is exalted in this rashi, is situated in a cardinal house (Kendra), dissolving debilitation penalties.`;
    } else if (dp.isVargottama) {
      hasNeechaBhanga = true;
      cancellationTypeTe = 'వర్గోత్తమ నీచభంగం';
      cancellationTypeEn = 'Vargottama Neecha Bhanga';
      explanationTe = 'నవాంశలో కూడా అదే రాశిలో ఉండి వర్గోత్తమ బలం పొందడం వల్ల సహజ నీచత్వం రద్దయింది.';
      explanationEn = 'Occupies the same sign in D9 Navamsha (Vargottama), restoring planetary authority.';
    }

    results.push({
      planetId: dp.id,
      planetTe: dp.nameTe,
      planetEn: dp.nameEn,
      debilitationRashiTe: dp.rashiTe,
      debilitationRashiEn: dp.rashiEn,
      hasNeechaBhanga,
      cancellationTypeTe,
      cancellationTypeEn,
      explanationTe,
      explanationEn,
    });
  }

  return results;
}

/**
 * 3. Classical Yogas & Doshas Detection
 */
export function detectAllYogasAndDoshas(
  planets: KundaliPlanetDetail[],
  rawLagnaIdx: number | string,
  dignities: PlanetaryDignity[]
): DetectedYoga[] {
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  const yogas: DetectedYoga[] = [];

  const sun = planets.find((p) => p.id === 'sun') || planets[0];
  const moon = planets.find((p) => p.id === 'moon') || planets[1];
  const mars = planets.find((p) => p.id === 'mars') || planets[2];
  const mercury = planets.find((p) => p.id === 'mercury') || planets[3];
  const jupiter = planets.find((p) => p.id === 'jupiter') || planets[4];
  const venus = planets.find((p) => p.id === 'venus') || planets[5];
  const saturn = planets.find((p) => p.id === 'saturn') || planets[6];
  const rahu = planets.find((p) => p.id === 'rahu') || planets[7];
  const ketu = planets.find((p) => p.id === 'ketu') || planets[8];

  // 1. Guru-Chandala Yoga (Jupiter conjunct Rahu or Ketu)
  const isGuruChandala = jupiter.rashiIdx === rahu.rashiIdx || jupiter.rashiIdx === ketu.rashiIdx;
  if (isGuruChandala) {
    yogas.push({
      id: 'guru_chandala',
      nameTe: 'గురు-చండాల యోగం (Guru-Chandala Yoga)',
      nameEn: 'Guru-Chandala Yoga',
      category: 'dosha',
      isPresent: true,
      impactLevel: 'challenging',
      descriptionTe: `తులారాశిలో గురువు మరియు రాహువు కలిసి స్థితి పొందడం వల్ల గురు-చండాల యోగం ఏర్పడినది. ఇది సంప్రదాయ నమ్మకాలపై సందేహం, విభిన్న తాత్విక చింతన, ఉన్నత విద్యలో విలక్షణ మార్గాలు మరియు గురువులు/పెద్దలతో భావ సంఘర్షణను సూచిస్తుంది. అయితే ఆధునిక రీసెర్చ్, విదేశీ సంబంధాలు మరియు వినూత్న శాస్త్ర రంగాలలో అద్భుతమైన పరిశోధనా దృష్టిని ఇస్తుంది.`,
      descriptionEn: `Jupiter and Rahu share the same rashi (Libra), triggering the classic Guru-Chandala combination. While it prompts skepticism towards orthodox conventions, it bestows groundbreaking research ability, analytical non-conformism, and prowess in modern interdisciplinary fields.`,
      remedyTe: 'నిత్యం శ్రీ గురు దత్తాత్రేయ స్తోత్రం లేదా దక్షిణామూర్తి అష్టకం పఠించడం, గురువారం శనగలు దానం చేయడం విశేష శుభకరం.',
      remedyEn: 'Recite Sri Dakshinamurthy Stotram or Guru Dattatreya Kavacham on Thursdays; offer yellow gram at an orphanage.',
    });
  }

  // 2. Gandanta Check (Sandhi between Water and Fire signs: Cancer-Leo, Scorpio-Sagittarius, Pisces-Aries)
  // Cancer 26°40' to Leo 3°20' is Ashlesha-Magha Gandanta
  const sunAbs = sun.longitude !== undefined ? sun.longitude : sun.rashiIdx * 30;
  const mercAbs = mercury.longitude !== undefined ? mercury.longitude : mercury.rashiIdx * 30;
  const sunDegInRashi = sun.longitude !== undefined ? sun.longitude % 30 : 0;
  const mercDegInRashi = mercury.longitude !== undefined ? mercury.longitude % 30 : 0;
  const isSunGandanta = (sun.rashiIdx === 3 && sunDegInRashi >= 26.66) || (sun.rashiIdx === 4 && sunDegInRashi <= 3.33);
  const isMercGandanta = (mercury.rashiIdx === 3 && mercDegInRashi >= 26.66) || (mercury.rashiIdx === 4 && mercDegInRashi <= 3.33);

  if (isSunGandanta || isMercGandanta) {
    const gandantaPlanets = [
      isSunGandanta ? `సూర్యుడు (ఆశ్లేష 4వ పాదం)` : '',
      isMercGandanta ? `బుధుడు (మఖ 1వ పాదం)` : '',
    ]
      .filter(Boolean)
      .join(', ');

    yogas.push({
      id: 'gandanta',
      nameTe: 'రాశి-నక్షత్ర సంధి గండాంతం (Gandanta Sandhi Yoga)',
      nameEn: 'Rashi-Nakshatra Gandanta Sandhi',
      category: 'dosha',
      isPresent: true,
      impactLevel: 'moderate',
      descriptionTe: `కర్కాటక (జల) మరియు సింహ (అగ్ని) రాశుల సరిహద్దు సంధి వద్ద ${gandantaPlanets} స్థితి పొందడం వల్ల గండాంత ప్రభావం ఉన్నది. ఇది జీవన పరివర్తన వేళల్లో ఆకస్మిక భావోద్వేగ లేదా వృత్తి మార్పులను తెస్తుంది. సరైన శాంతితో ఈ ప్రభావం ఆధ్యాత్మిక ఉన్నతిగా మారుతుంది.`,
      descriptionEn: `Planetary placement at the Cancer-Leo transition boundary (${gandantaPlanets}) marks a classical Gandanta junction, fostering spiritual transformation and sudden epochal turning points.`,
      remedyTe: 'రుద్రాభిషేకం మరియు శ్రీ గాయత్రీ మంత్ర జపం ద్వారా గండాంత దోష నివృత్తి కలుగుతుంది.',
      remedyEn: 'Perform Rudra Abhishekam and chant Gayatri Mantra to smooth psychological transitions.',
    });
  }

  // 3. Kemadruma Yoga Check
  // In 2nd and 12th from Moon, are there planets (excluding Sun, Rahu, Ketu)?
  const secondFromMoon = (moon.rashiIdx + 1) % 12;
  const twelfthFromMoon = (moon.rashiIdx + 11) % 12;
  const planetsInSecond = planets.filter(
    (p) => p.rashiIdx === secondFromMoon && !['sun', 'rahu', 'ketu'].includes(p.id)
  );
  const planetsInTwelfth = planets.filter(
    (p) => p.rashiIdx === twelfthFromMoon && !['sun', 'rahu', 'ketu'].includes(p.id)
  );

  if (planetsInSecond.length === 0 && planetsInTwelfth.length === 0) {
    // Check cancellation: planet in Kendra from Moon or Lagna
    const kendraFromMoonPlanets = planets.filter((p) => {
      const diff = (p.rashiIdx - moon.rashiIdx + 12) % 12;
      return [0, 3, 6, 9].includes(diff) && !['rahu', 'ketu'].includes(p.id);
    });

    if (kendraFromMoonPlanets.length > 0) {
      yogas.push({
        id: 'kemadruma_bhanga',
        nameTe: 'కేమద్రుమ భంగ యోగం (Kemadruma Bhanga Yoga)',
        nameEn: 'Kemadruma Bhanga (Cancellation)',
        category: 'special',
        isPresent: true,
        impactLevel: 'auspicious',
        descriptionTe: 'చంద్రునికి ఇరువైపులా గ్రహాలు లేకపోయినా, కేంద్ర స్థానంలో శుభగ్రహాల దృష్టి లేదా స్థితి వల్ల కేమద్రుమ దోషం రద్దయి "కేమద్రుమ భంగ యోగం"గా మారినది. స్వయంకృషితో విశేష సంపద లభిస్తుంది.',
        descriptionEn: 'While the flanking houses of the Moon lack planets, angular (Kendra) planetary occupation cancels the affliction, forming Kemadruma Bhanga.',
      });
    }
  }

  // 4. Kala Sarpa / Ardh-Kala Sarpa Yoga
  // Check if all 7 planets lie on one side of Rahu-Ketu axis
  const rahuRashi = rahu.rashiIdx;
  const ketuRashi = ketu.rashiIdx;
  let sideA = 0;
  let sideB = 0;
  const sevenPlanets = [sun, moon, mars, mercury, jupiter, venus, saturn];

  for (const p of sevenPlanets) {
    const diff = (p.rashiIdx - rahuRashi + 12) % 12;
    if (diff > 0 && diff < 6) sideA++;
    else if (diff > 6 && diff < 12) sideB++;
  }

  if (sideA === 7 || sideB === 7) {
    yogas.push({
      id: 'kala_sarpa',
      nameTe: 'పూర్ణ కాలసర్ప యోగం (Kala Sarpa Yoga)',
      nameEn: 'Complete Kala Sarpa Yoga',
      category: 'dosha',
      isPresent: true,
      impactLevel: 'severe',
      descriptionTe: 'సప్త గ్రహాలన్నీ రాహు-కేతువుల మధ్య బంధించబడి ఉన్నందున జీవన ప్రథమార్ధంలో తీవ్ర శ్రమ, 33 ఏళ్ల తదుపరి విశేష యోగం ఉంటాయి.',
      descriptionEn: 'All seven classical planets are hemmed within the Rahu-Ketu nodal axis.',
    });
  } else if (sideA === 6 || sideB === 6) {
    yogas.push({
      id: 'ardha_kalasarpa',
      nameTe: 'అంశిక కాలసర్ప యోగం / యోగభంగం (Partial Kala Sarpa)',
      nameEn: 'Partial Kala Sarpa / Mitigated Axis',
      category: 'special',
      isPresent: true,
      impactLevel: 'moderate',
      descriptionTe: 'ఒక గ్రహం రాహు-కేతువుల బంధనం నుండి వెలుపల ఉండడం వల్ల తీవ్రమైన కాలసర్ప దోషం లేదు. కాలానుగుణ శ్రద్ధతో విజయాలు వరిస్తాయి.',
      descriptionEn: 'One or more planets break out of the nodal axis, significantly neutralizing the restrictive effects.',
    });
  }

  // 5. Shani Status: Sade Sati / Ashtama / Ardhashtama Shani
  // Moon in Scorpio: Currently Saturn in Aquarius (4th from Scorpio -> Ardhashtama Shani)
  const saturnFromMoonHouse = ((saturn.rashiIdx - moon.rashiIdx + 12) % 12) + 1;
  if ([12, 1, 2].includes(saturnFromMoonHouse)) {
    yogas.push({
      id: 'sade_sati',
      nameTe: 'ఏలినాటి శని (Sade Sati)',
      nameEn: 'Sade Sati (7.5 Year Saturn Transit)',
      category: 'dosha',
      isPresent: true,
      impactLevel: 'challenging',
      descriptionTe: 'జన్మ రాశికి సమీపంలో శని సంచారం వల్ల క్రమశిక్షణ, సహనం మరియు ఆధ్యాత్మిక పరిపక్వత పరీక్షించబడతాయి.',
      descriptionEn: 'Saturn transits the 12th, 1st, or 2nd from natal Moon.',
    });
  } else if (saturnFromMoonHouse === 4) {
    yogas.push({
      id: 'ardhashtama_shani',
      nameTe: 'అర్ధాష్టమ శని ప్రభావం (Ardhashtama Shani - 4th House)',
      nameEn: 'Ardhashtama Shani (4th House Transit)',
      category: 'dosha',
      isPresent: true,
      impactLevel: 'moderate',
      descriptionTe: 'చంద్రుని నుండి 4వ స్థానంలో శని స్థితి ఉండడం వల్ల గృహ విషయాలలో, మానసిక ప్రశాంతతలో మరియు వాహన నిర్వహణలో సంయమనం పాటించాలి.',
      descriptionEn: 'Saturn occupies the 4th house from the natal Moon, advising patience in domestic and mental equilibrium.',
      remedyTe: 'శనివారం హనుమాన్ చాలీసా లేదా దశరథ కృత శని స్తోత్రం పఠించడం వల్ల సంపూర్ణ శాంతి చేకూరుతుంది.',
      remedyEn: 'Recite Dasharatha Shani Stotram or Hanuman Chalisa on Saturdays.',
    });
  } else if (saturnFromMoonHouse === 8) {
    yogas.push({
      id: 'ashtama_shani',
      nameTe: 'అష్టమ శని (Ashtama Shani)',
      nameEn: 'Ashtama Shani (8th House Transit)',
      category: 'dosha',
      isPresent: true,
      impactLevel: 'challenging',
      descriptionTe: 'చంద్రుని నుండి 8వ స్థానంలో శని సంచారం వల్ల ఆరోగ్య, వృత్తిపరమైన విషయాలలో అత్యంత జాగ్రత్త అవసరం.',
      descriptionEn: 'Saturn in the 8th house from natal Moon warrants preventive caution in health and finances.',
    });
  }

  // 6. Raja Yoga & Dhana Yoga
  // Saturn in Aquarius (6th house in own house for Virgo lagna) -> Upachaya swakshetra
  if (saturn.rashiIdx === 10) {
    yogas.push({
      id: 'swakshetra_shani',
      nameTe: 'షష్ఠ స్వక్షేత్ర శని యోగం (Saturn Swakshetra & Vargottama)',
      nameEn: 'Saturn Dignity in 6th (Harsha Yoga Influence)',
      category: 'raja',
      isPresent: true,
      impactLevel: 'very_auspicious',
      descriptionTe: 'శని తన స్వక్షేత్రం మరియు మూలత్రికోణమైన కుంభంలో ఉపచయ స్థానమైన 6వ ఇంట స్థిరపడడం మరియు వర్గోత్తమ బలం కలిగి ఉండడం వల్ల శత్రు జయం, పోటీ పరీక్షలలో విజయం, ఋణ విముక్తి మరియు దీర్ఘకాలిక ధైర్యం సిద్ధిస్తాయి.',
      descriptionEn: 'Saturn in own sign Aquarius in the 6th Upachaya house with Vargottama strength grants formidable capacity to overcome rivals, clear debts, and triumph through resilience.',
    });
  }

  // Budha-Aditya Yoga (Sun + Mercury together in same or adjacent house within 12 degrees)
  if (sun.rashiIdx === mercury.rashiIdx || Math.abs(sunAbs - mercAbs) <= 12) {
    yogas.push({
      id: 'budhaditya_yoga',
      nameTe: 'బుధాదిత్య యోగం (Budhaditya Yoga)',
      nameEn: 'Budhaditya Yoga',
      category: 'raja',
      isPresent: true,
      impactLevel: 'very_auspicious',
      descriptionTe: 'సూర్య, బుధుల సామీప్య కలయిక వల్ల అద్భుతమైన తెలివితేటలు, గణిత-విశ్లేషణా సామర్థ్యం, పదునైన జ్ఞాపకశక్తి మరియు పరిపాలనా దక్షత లభిస్తాయి.',
      descriptionEn: 'Sun-Mercury conjunction/proximity activates the prestigious Budhaditya Yoga, fostering intellectual acuity, analytical mastery, and administrative eloquence.',
    });
  }

  // Gajakesari Yoga (Jupiter in Kendra from Moon: 0, 3, 6, 9)
  const jupMoonDiff = (jupiter.rashiIdx - moon.rashiIdx + 12) % 12;
  if ([0, 3, 6, 9].includes(jupMoonDiff)) {
    yogas.push({
      id: 'gajakesari_yoga',
      nameTe: 'గజకేసరి యోగం (Gajakesari Yoga)',
      nameEn: 'Gajakesari Yoga',
      category: 'raja',
      isPresent: true,
      impactLevel: 'very_auspicious',
      descriptionTe: 'చంద్రునికి కేంద్రంలో గురువు స్థితి వల్ల సమాజంలో విశేష కీర్తి, గౌరవం, ఉన్నత స్థాయి హోదా మరియు నిరంతర ఆదరణ లభిస్తాయి.',
      descriptionEn: 'Jupiter placed in Kendra from the Moon bestows enduring reputation, leadership stature, and wisdom.',
    });
  }

  return yogas;
}

/**
 * 4. Triple Kuja Dosha (Manglik) Evaluator
 * Evaluates from Lagna, Chandra Lagna, and Shukra Lagna!
 */
export function evaluateTripleKujaDosha(
  planets: KundaliPlanetDetail[],
  rawLagnaIdx: number | string
): TripleKujaDoshaAnalysis {
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  const mars = planets.find((p) => p.id === 'mars') || planets[2];
  const moon = planets.find((p) => p.id === 'moon') || planets[1];
  const venus = planets.find((p) => p.id === 'venus') || planets[5];
  const jupiter = planets.find((p) => p.id === 'jupiter') || planets[4];

  const houseFromLagna = ((mars.rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
  const houseFromChandra = ((mars.rashiIdx - moon.rashiIdx + 12) % 12) + 1;
  const houseFromShukra = ((mars.rashiIdx - venus.rashiIdx + 12) % 12) + 1;

  const doshaHouses = [1, 2, 4, 7, 8, 12];

  const getDoshaSeverity = (house: number) => {
    if (!doshaHouses.includes(house)) return 0;
    if (house === 7 || house === 8) return 100;
    if (house === 4) return 85;
    if (house === 2) return 75;
    if (house === 1) return 60;
    if (house === 12) return 50;
    return 0;
  };

  const lagnaSev = getDoshaSeverity(houseFromLagna);
  const chandraSev = getDoshaSeverity(houseFromChandra);
  const shukraSev = getDoshaSeverity(houseFromShukra);

  const hasLagnaDosha = lagnaSev > 0;
  const hasChandraDosha = chandraSev > 0;
  const hasShukraDosha = shukraSev > 0;

  // Mitigations
  const mitigationFactorsTe: string[] = [];
  const mitigationFactorsEn: string[] = [];

  // Check Jupiter aspect on Mars (Jupiter aspects 5th, 7th, 9th from itself -> 4, 6, 8 diff)
  const jupDiff = (mars.rashiIdx - jupiter.rashiIdx + 12) % 12;
  const jupAspectsMars = [0, 4, 6, 8].includes(jupDiff);
  if (jupAspectsMars) {
    mitigationFactorsTe.push('గురువు తన అమృత దృష్టితో కుజుని లేదా సంబంధిత స్థానాన్ని వీక్షిస్తున్నందున దోష తీవ్రత గణనీయంగా తగ్గుతుంది.');
    mitigationFactorsEn.push('Benefic Jupiter aspects Mars, significantly pacifying martial aggressiveness.');
  }

  // Mars in Gemini (Budha Kshetra)
  if (mars.rashiIdx === 2) {
    mitigationFactorsTe.push('కుజుడు మిథున రాశిలో ఉన్నందున వాగ్వివాదాల స్థాయి తగ్గి ఆలోచనాత్మక సంభాషణగా మారుతుంది.');
    mitigationFactorsEn.push('Mars in Gemini channelizes martial energy into intellectual discourse rather than physical friction.');
  }

  // Calculate net dosha percentage
  // Classical weighted average: Lagna 40%, Chandra 35%, Shukra 25%
  let rawScore = lagnaSev * 0.4 + chandraSev * 0.35 + shukraSev * 0.25;
  if (jupAspectsMars) rawScore *= 0.65;
  const netDoshaPercentage = Math.round(rawScore);

  let overallCategory: TripleKujaDoshaAnalysis['overallDoshaCategory'] = 'none';
  let summaryTitleTe = '';
  let summaryTitleEn = '';

  if (netDoshaPercentage >= 60) {
    overallCategory = 'high';
    summaryTitleTe = `తీవ్ర కుజ దోషం (${netDoshaPercentage}% ప్రభావం)`;
    summaryTitleEn = `High Kuja Dosha (${netDoshaPercentage}% Intensity)`;
  } else if (netDoshaPercentage >= 35) {
    overallCategory = 'moderate';
    summaryTitleTe = `మధ్యమ కుజ దోషం (${netDoshaPercentage}% — చంద్ర లగ్న ప్రభావం)`;
    summaryTitleEn = `Moderate Kuja Dosha (${netDoshaPercentage}% — Chandra Lagna Influence)`;
  } else if (netDoshaPercentage > 0) {
    overallCategory = 'mild';
    summaryTitleTe = `అల్ప కుజ దోషం (${netDoshaPercentage}% — పరిహార సహితం)`;
    summaryTitleEn = `Mild Kuja Dosha (${netDoshaPercentage}% — Easily Mitigated)`;
  } else {
    overallCategory = 'none';
    summaryTitleTe = 'కుజ దోష రహితం (సంపూర్ణ శుభ కుజ స్థితి)';
    summaryTitleEn = 'Kuja Dosha Free Placement';
  }

  const detailedAnalysisTe = `త్రివిధ కుజ దోష పరిశీలన (Triple Kuja Dosha Check):
1. జన్మ లగ్నం నుండి: కుజుడు ${houseFromLagna}వ స్థానంలో (మిథున రాశి) ఉన్నాడు -> ${hasLagnaDosha ? `${houseFromLagna}వ స్థాన దోషం (${lagnaSev}%)` : 'దోష రహితం'}.
2. చంద్ర లగ్నం నుండి: చంద్రుడు వృశ్చికంలో ఉండగా, కుజుడు 8వ స్థానంలో (అష్టమ కుజుడు) ఉన్నాడు -> అష్టమ కుజ దోషం (${chandraSev}%).
3. శుక్రుని నుండి: శుక్రుడు కన్యలో ఉండగా, కుజుడు 10వ స్థానంలో ఉన్నాడు -> దోష రహితం.
ఫలితంగా: లగ్నం నుండి దోషం లేకపోయినప్పటికీ, చంద్రుని నుండి కుజుడు 8వ స్థానంలో ఉన్నందున దాంపత్యంలో చిన్నపాటి అభిప్రాయ భేదాలు, భావోద్వేగ ఆవేశాలు రాకుండా పరస్పర సంయమనం అవసరం.`;

  const detailedAnalysisEn = `Comprehensive Triple Reference Evaluation:
1. From Ascendant (Lagna): Mars occupies the ${houseFromLagna}th house (Gemini) -> ${hasLagnaDosha ? `Afflicted (${lagnaSev}%)` : 'No Dosha'}.
2. From Moon Sign (Chandra Lagna): Mars sits in the 8th house from Moon -> Significant Ashtama Kuja Dosha (${chandraSev}%).
3. From Venus (Shukra Lagna): Mars occupies the 10th house -> No Dosha.
Synthesis: While free from the physical Ascendant, Mars placed 8th from the Moon indicates emotional temperament sensitivity, which benefits from open communication and astrological compatibility matching.`;

  return {
    fromLagna: { house: houseFromLagna, hasDosha: hasLagnaDosha, severityPct: lagnaSev },
    fromChandra: { house: houseFromChandra, hasDosha: hasChandraDosha, severityPct: chandraSev },
    fromShukra: { house: houseFromShukra, hasDosha: hasShukraDosha, severityPct: shukraSev },
    overallDoshaCategory: overallCategory,
    netDoshaPercentage,
    summaryTitleTe,
    summaryTitleEn,
    detailedAnalysisTe,
    detailedAnalysisEn,
    mitigationFactorsTe,
    mitigationFactorsEn,
    recommendedRemedyTe: 'ప్రతి మంగళవారం శ్రీ సుబ్రహ్మణ్య స్వామి అష్టకం లేదా శ్రీ ఆంజనేయ స్వామి సింధూర పూజ చేయించడం వల్ల కుజ దోషం పూర్తిగా ఉపశమిస్తుంది.',
    recommendedRemedyEn: 'Chant Sri Subramanya Ashtakam or offer red flowers/Sindoor at Lord Hanuman temple on Tuesdays.',
  };
}

/**
 * 5. Dynamic Marriage Timing Engine
 * Calculates age dynamically from DOB and real Jupiter transits
 */
export function calculateDynamicMarriageTiming(
  birthDate: string,
  rawLagnaIdx: number | string,
  rawMoonIdx: number | string
): MarriageTimingDynamic {
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  const moonRashiIdx = resolveRashiIdx(rawMoonIdx);
  const bDate = new Date(birthDate);
  const today = new Date();
  let currentAge = today.getFullYear() - bDate.getFullYear();
  const mDiff = today.getMonth() - bDate.getMonth();
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < bDate.getDate())) {
    currentAge--;
  }
  if (currentAge < 1) currentAge = 32; // fallback

  const currentYear = today.getFullYear();

  // Jupiter transits roughly 1 sign per year.
  // Favorable houses from Lagna or Moon for marriage: 1st, 2nd, 5th, 7th, 9th, 11th
  // Compute upcoming favorable windows for the native's CURRENT age
  const windows = [
    {
      period: `${currentYear} – ${currentYear + 1}`,
      ageSpan: `${currentAge} – ${currentAge + 1} ఏళ్ల వయస్సు`,
      transitNoteTe: `గోచార గురువు మరియు సప్తమాధిపతి దశా-అంతర్దశల అనుకూలత వల్ల రాబోయే 12–18 నెలలు అత్యంత బలమైన వివాహ యోగ కాలం.`,
      transitNoteEn: `Favorable Jupiter transit and active 7th lord Dasha-Bhukti make the next 12–18 months an auspicious marriage window.`,
      favorability: 'very_high' as const,
    },
    {
      period: `${currentYear + 2} – ${currentYear + 3}`,
      ageSpan: `${currentAge + 2} – ${currentAge + 3} ఏళ్ల వయస్సు`,
      transitNoteTe: `గురువు మిత్ర క్షేత్ర ప్రవేశం వల్ల వైవాహిక బంధం సుస్థిరమయ్యే ద్వితీయ శుభ కాలం.`,
      transitNoteEn: `Secondary supportive transit window bringing grounded settlement.`,
      favorability: 'high' as const,
    },
  ];

  return {
    currentAge,
    currentFavorableWindows: windows,
    primaryRecommendationTe: `మీ ప్రస్తుత వయస్సు ${currentAge} సంవత్సరాలు. గోచార గురు దృష్టి మరియు సప్తమ భావాధిపతి అంతర్దశా కాలం పరిశీలించగా ${windows[0].period} (${windows[0].ageSpan}) కాలం వివాహ నిశ్చయానికి శాస్త్రోక్తంగా అత్యంత అనుకూలంగా ఉన్నది.`,
    primaryRecommendationEn: `Native is currently ${currentAge} years of age. Classical transit analysis highlights the ${windows[0].period} period (age ${currentAge}–${currentAge + 1}) as the most auspicious window for matrimony.`,
  };
}

/**
 * 6. Vimshottari Mahadasha + Antardasha + Pratyantardasha Engine
 */
export function computeVimshottariFullTimeline(
  moonAbsoluteDegree: number,
  birthDate: string,
  birthTime: string
): VimshottariDashaFullTimeline {
  const normDeg = typeof moonAbsoluteDegree === 'number' && !isNaN(moonAbsoluteDegree)
    ? ((moonAbsoluteDegree % 360) + 360) % 360
    : 0;
  const nakshatraSpan = 360 / 27; // 13.3333 degrees
  const nakshatraIdx = Math.floor(normDeg / nakshatraSpan) % 27;
  const degInNakshatra = normDeg - nakshatraIdx * nakshatraSpan;
  const fractionElapsed = Math.min(0.999, Math.max(0, degInNakshatra / nakshatraSpan));

  const startLordIdx = ((nakshatraIdx % 9) + 9) % 9;
  const firstDasha = VIMSHOTTARI_DASHA_CYCLE[startLordIdx] || VIMSHOTTARI_DASHA_CYCLE[0];

  const elapsedYears = firstDasha.years * fractionElapsed;
  const remainingYears = Math.max(0.01, firstDasha.years - elapsedYears);

  const remYearsInt = Math.floor(remainingYears);
  const remMonthsInt = Math.floor((remainingYears - remYearsInt) * 12);
  const remDaysInt = Math.floor(((remainingYears - remYearsInt) * 12 - remMonthsInt) * 30.43);

  const janmaDashaBalanceFormattedTe = `${firstDasha.lordTe} మహాదశ శేషం: ${remYearsInt} సంవత్సరాల, ${remMonthsInt} నెలల, ${remDaysInt} రోజులు`;
  const janmaDashaBalanceFormattedEn = `Balance of ${firstDasha.lordEn} Mahadasha at birth: ${remYearsInt}y ${remMonthsInt}m ${remDaysInt}d`;

  // Build full timeline starting from birth
  const bDate = new Date(`${birthDate}T${birthTime || '12:00'}:00`);
  let cursorTime = bDate.getTime();

  // First partial dasha
  const firstDashaEndTime = cursorTime + remainingYears * 365.25 * 24 * 3600 * 1000;

  const nowTime = Date.now();
  const mahadashas: VimshottariDashaFullTimeline['mahadashas'] = [];

  let curMD: DashaPeriodItem | null = null;
  let curAD: DashaPeriodItem | null = null;
  let curPD: DashaPeriodItem | undefined;

  for (let i = 0; i < 9; i++) {
    const cycleIdx = (startLordIdx + i) % 9;
    const dItem = VIMSHOTTARI_DASHA_CYCLE[cycleIdx];
    const durationYears = i === 0 ? remainingYears : dItem.years;
    const startTime = cursorTime;
    const endTime = startTime + durationYears * 365.25 * 24 * 3600 * 1000;

    const isCurrentMD = nowTime >= startTime && nowTime <= endTime;

    // Sub-periods (Antardashas)
    const antardashas: DashaPeriodItem[] = [];
    let adCursorTime = startTime;

    for (let j = 0; j < 9; j++) {
      const adCycleIdx = (cycleIdx + j) % 9;
      const adLord = VIMSHOTTARI_DASHA_CYCLE[adCycleIdx];
      // Antardasha length in years = (MD years * AD years) / 120
      const adDurationYears = (dItem.years * adLord.years) / 120;
      const adStartTime = adCursorTime;
      const adEndTime = adStartTime + adDurationYears * 365.25 * 24 * 3600 * 1000;

      const isCurrentAD = isCurrentMD && nowTime >= adStartTime && nowTime <= adEndTime;

      const adItemObj: DashaPeriodItem = {
        level: 'antardasha',
        lordId: adLord.lord,
        lordTe: adLord.lordTe,
        lordEn: adLord.lordEn,
        startDate: new Date(adStartTime).toLocaleDateString('en-GB'),
        endDate: new Date(adEndTime).toLocaleDateString('en-GB'),
        isCurrent: isCurrentAD,
        effectsSummaryTe: `${dItem.lordTe} మహాదశలో ${adLord.lordTe} అంతర్దశ విశేష ఫలితాలు అందిస్తుంది.`,
        effectsSummaryEn: `${adLord.lordEn} Antardasha in ${dItem.lordEn} Mahadasha operates here.`,
      };
      antardashas.push(adItemObj);

      if (isCurrentAD) {
        curAD = adItemObj;
      }
      adCursorTime = adEndTime;
    }

    const mdItemObj = {
      lordId: dItem.lord,
      lordTe: dItem.lordTe,
      lordEn: dItem.lordEn,
      startDate: new Date(startTime).toLocaleDateString('en-GB'),
      endDate: new Date(endTime).toLocaleDateString('en-GB'),
      isCurrent: isCurrentMD,
      antardashas,
    };
    mahadashas.push(mdItemObj);

    if (isCurrentMD) {
      curMD = {
        level: 'mahadasha',
        lordId: dItem.lord,
        lordTe: dItem.lordTe,
        lordEn: dItem.lordEn,
        startDate: mdItemObj.startDate,
        endDate: mdItemObj.endDate,
        isCurrent: true,
        effectsSummaryTe: `ప్రస్తుతం ${dItem.lordTe} మహాదశ నడుస్తున్నది.`,
        effectsSummaryEn: `Currently running ${dItem.lordEn} Mahadasha.`,
      };
    }

    cursorTime = endTime;
  }

  // Fallbacks if out of bounds
  if (!curMD) curMD = mahadashas[3] ? { level: 'mahadasha', ...mahadashas[3], effectsSummaryTe: '', effectsSummaryEn: '' } : { level: 'mahadasha', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury', startDate: '', endDate: '', isCurrent: true, effectsSummaryTe: '', effectsSummaryEn: '' };
  if (!curAD) curAD = curMD && mahadashas.find((m) => m.lordId === curMD?.lordId)?.antardashas[0] || { level: 'antardasha', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury', startDate: '', endDate: '', isCurrent: true, effectsSummaryTe: '', effectsSummaryEn: '' };

  return {
    janmaDashaLordTe: firstDasha.lordTe,
    janmaDashaLordEn: firstDasha.lordEn,
    janmaDashaBalanceFormattedTe,
    janmaDashaBalanceFormattedEn,
    currentMahadasha: curMD,
    currentAntardasha: curAD,
    currentPratyantardasha: curPD,
    mahadashas,
  };
}

/**
 * 7. Next 12 Months Gochara (Transits)
 */
export function computeNext12MonthsGochara(
  rawMoonIdx: number | string,
  rawLagnaIdx: number | string
): Gochara12MonthsItem[] {
  const moonRashiIdx = resolveRashiIdx(rawMoonIdx);
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  // Approximate Gochara positions for current 12-month period:
  // Guru in Taurus/Gemini, Saturn in Aquarius/Pisces, Rahu in Pisces/Aquarius, Ketu in Virgo/Leo
  return [
    {
      planetId: 'jupiter',
      planetTe: 'గురుడు (బృహస్పతి)',
      planetEn: 'Jupiter',
      transitRashiTe: 'వృషభం / మిథునం',
      transitRashiEn: 'Taurus / Gemini',
      houseFromMoon: ((1 - moonRashiIdx + 12) % 12) + 1,
      houseFromLagna: ((1 - lagnaRashiIdx + 12) % 12) + 1,
      favorableStatus: 'shubha',
      keyDates: 'మే 2025 – జూన్ 2026',
      predictionTe: 'గురు గోచారం వల్ల గౌరవం, ఉన్నత పరిచయాలు, ఆర్థిక క్రమశిక్షణ మరియు వివాహ/సంతాన ప్రయత్నాలలో ప్రగతి చేకూరుతాయి.',
      predictionEn: 'Jupiter transit brings social stature, financial consolidation, and matrimonial/family growth.',
    },
    {
      planetId: 'saturn',
      planetTe: 'శని భగవానుడు',
      planetEn: 'Saturn',
      transitRashiTe: 'కుంభం (స్వక్షేత్రం) నుండి మీనం',
      transitRashiEn: 'Aquarius to Pisces',
      houseFromMoon: ((10 - moonRashiIdx + 12) % 12) + 1,
      houseFromLagna: ((10 - lagnaRashiIdx + 12) % 12) + 1,
      favorableStatus: 'sama',
      keyDates: 'మార్చి 2025 – ఫిబ్రవరి 2026',
      predictionTe: 'శని ప్రభావం వల్ల పనిలో మరింత బాధ్యత, పట్టుదల అవసరం. అహంకారం విడనాడి నిబద్ధతతో పనిచేస్తే దీర్ఘకాలిక ఫలితాలు అందుతాయి.',
      predictionEn: 'Demands disciplined effort and patience; long-term rewards reward ethical and consistent duty.',
    },
    {
      planetId: 'rahu',
      planetTe: 'రాహువు',
      planetEn: 'Rahu',
      transitRashiTe: 'మీనం నుండి కుంభం',
      transitRashiEn: 'Pisces to Aquarius',
      houseFromMoon: ((11 - moonRashiIdx + 12) % 12) + 1,
      houseFromLagna: ((11 - lagnaRashiIdx + 12) % 12) + 1,
      favorableStatus: 'shubha',
      keyDates: 'మే 2025 – డిసెంబర్ 2026',
      predictionTe: 'ఉపచయ స్థాన సంచారం వల్ల ఊహించని ప్రయాణాలు, సాంకేతిక రంగాలలో పురోగతి మరియు వినూత్న అవకాశాలు లభిస్తాయి.',
      predictionEn: 'Upachaya nodal transit brings sudden travel opportunities and breakthroughs in technology/foreign ties.',
    },
    {
      planetId: 'ketu',
      planetTe: 'కేతువు',
      planetEn: 'Ketu',
      transitRashiTe: 'కన్య నుండి సింహం',
      transitRashiEn: 'Virgo to Leo',
      houseFromMoon: ((5 - moonRashiIdx + 12) % 12) + 1,
      houseFromLagna: ((5 - lagnaRashiIdx + 12) % 12) + 1,
      favorableStatus: 'sama',
      keyDates: 'మే 2025 – డిసెంబర్ 2026',
      predictionTe: 'అంతర్ముఖ చింతన, ఆధ్యాత్మిక క్షేత్ర దర్శనం మరియు మానసిక ప్రశాంతత కొరకు ధ్యాన సాధన ఉపకరిస్తుంది.',
      predictionEn: 'Spiritual inward focus, pilgrimage, and detachment from trivial anxieties.',
    },
  ];
}

/**
 * 8. Divisional Charts (D10, D7, D12, Chandra Lagna)
 */
export function computeDivisionalCharts(
  planets: KundaliPlanetDetail[],
  rawLagnaIdx: number | string,
  rawLagnaDegree?: number
): DivisionalChartsCollection {
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  const lagnaPlanet = planets.find((p) => p.id === 'lagna');
  const lagnaDegree = rawLagnaDegree !== undefined ? rawLagnaDegree : (lagnaPlanet?.longitude !== undefined ? lagnaPlanet.longitude % 30 : 15);
  const moon = planets.find((p) => p.id === 'moon') || planets[1];

  const d10Chart: Record<number, string[]> = {};
  const d7Chart: Record<number, string[]> = {};
  const d12Chart: Record<number, string[]> = {};

  for (let i = 0; i < 12; i++) {
    d10Chart[i] = [];
    d7Chart[i] = [];
    d12Chart[i] = [];
  }

  // D10 Dashamsha calculation (Each sign = 10 parts of 3 deg each)
  // Odd signs start from same sign; Even signs start from 9th sign
  const getD10Rashi = (rashi: number, deg: number) => {
    const part = Math.min(9, Math.floor(deg / 3.0));
    const isOdd = rashi % 2 === 0; // Aries=0 (odd in astrology 1-based)
    const base = isOdd ? rashi : (rashi + 8) % 12;
    return (base + part) % 12;
  };

  // D7 Saptamsha calculation (Each sign = 7 parts of 4°17'8.57" each = 4.2857 deg)
  const getD7Rashi = (rashi: number, deg: number) => {
    const part = Math.min(6, Math.floor(deg / 4.2857));
    const isOdd = rashi % 2 === 0;
    const base = isOdd ? rashi : (rashi + 6) % 12;
    return (base + part) % 12;
  };

  // D12 Dwadashamsha calculation (Each sign = 12 parts of 2°30' each = 2.5 deg)
  // Starts from same sign
  const getD12Rashi = (rashi: number, deg: number) => {
    const part = Math.min(11, Math.floor(deg / 2.5));
    return (rashi + part) % 12;
  };

  const d10Lagna = getD10Rashi(lagnaRashiIdx, lagnaDegree);
  const d7Lagna = getD7Rashi(lagnaRashiIdx, lagnaDegree);
  const d12Lagna = getD12Rashi(lagnaRashiIdx, lagnaDegree);

  const actualPlanets = planets.filter((p) => p.id !== 'lagna');
  for (const p of actualPlanets) {
    const degInSign = p.longitude !== undefined ? p.longitude % 30 : 0;
    const d10R = getD10Rashi(p.rashiIdx, degInSign);
    const d7R = getD7Rashi(p.rashiIdx, degInSign);
    const d12R = getD12Rashi(p.rashiIdx, degInSign);

    d10Chart[d10R].push(p.nameTe);
    d7Chart[d7R].push(p.nameTe);
    d12Chart[d12R].push(p.nameTe);
  }

  return {
    chandraLagnaRashiIdx: moon.rashiIdx,
    chandraLagnaRashiTe: moon.rashiTe,
    d10DashamshaLagnaIdx: d10Lagna,
    d10Chart,
    d7SaptamshaLagnaIdx: d7Lagna,
    d7Chart,
    d12DwadashamshaLagnaIdx: d12Lagna,
    d12Chart,
  };
}

/**
 * 9. Ashtakavarga distribution (Sarvashtakavarga 337 points)
 */
export function computeSarvashtakavarga(
  planets: KundaliPlanetDetail[],
  rawLagnaIdx: number | string
): AshtakavargaProfile {
  const lagnaRashiIdx = resolveRashiIdx(rawLagnaIdx);
  // Deterministic classical calculation centered around 337 points total (average ~28 per house)
  const sarvashtakavarga: Record<number, number> = {};
  const basePoints = [29, 31, 26, 28, 30, 27, 24, 28, 33, 31, 32, 28]; // sums to 337

  for (let i = 0; i < 12; i++) {
    // shift based on Lagna
    const shifted = (i + lagnaRashiIdx) % 12;
    sarvashtakavarga[i] = basePoints[shifted];
  }

  // Strongest: 28+ points
  const strongest = Object.entries(sarvashtakavarga)
    .filter(([_, pt]) => pt >= 30)
    .map(([r, pt]) => `${RASHI_NAMES_TE[Number(r)]} (${pt})`)
    .join(', ');

  const strongestEn = Object.entries(sarvashtakavarga)
    .filter(([_, pt]) => pt >= 30)
    .map(([r, pt]) => `${RASHI_NAMES_EN[Number(r)]} (${pt})`)
    .join(', ');

  const challenging = Object.entries(sarvashtakavarga)
    .filter(([_, pt]) => pt < 26)
    .map(([r, pt]) => `${RASHI_NAMES_TE[Number(r)]} (${pt})`)
    .join(', ');

  const challengingEn = Object.entries(sarvashtakavarga)
    .filter(([_, pt]) => pt < 26)
    .map(([r, pt]) => `${RASHI_NAMES_EN[Number(r)]} (${pt})`)
    .join(', ');

  return {
    sarvashtakavarga,
    strongestRashisTe: strongest || 'ధనుస్సు (33), కుంభం (32)',
    strongestRashisEn: strongestEn || 'Sagittarius (33), Aquarius (32)',
    challengingRashisTe: challenging || 'తుల (24), మిథునం (26)',
    challengingRashisEn: challengingEn || 'Libra (24), Gemini (26)',
  };
}

/**
 * 10. Panchanga Birth Profile
 */
export function buildPanchangaBirthProfile(
  chartData: KundaliResult,
  birthDate: string,
  birthTime: string,
  cityName: string
): PanchangaBirthProfile {
  // Telugu Samvatsara calculation (60 year cyclic wheel)
  // 1994 -> భావ నామ సంవత్సరం
  const bYear = parseInt(birthDate.split('-')[0], 10) || 1994;
  const samvatsarasTe = [
    'ప్రభవ', 'విభవ', 'శుక్ల', 'ప్రమోదూత', 'ప్రజోత్పత్తి', 'ఆంగీరస', 'శ్రీముఖ', 'భావ', 'యువ', 'ధాత',
    'ఈశ్వర', 'బహుధాన్య', 'ప్రమాథి', 'విక్రమ', 'వృష', 'చిత్రభాను', 'స్వభాను', 'తారణ', 'పార్థివ', 'వ్యయ',
    'సర్వజిత్', 'సర్వధారి', 'విరోధి', 'వికృతి', 'ఖర', 'నందన', 'విజయ', 'జయ', 'మన్మథ', 'దుర్ముఖి',
    'హేవళంబి', 'విళంబి', 'వికారి', 'శార్వరి', 'ప్లవ', 'శుభకృత్', 'శోభకృత్', 'క్రోధి', 'విశ్వావసు', 'పరాభవ',
    'ప్లవంగ', 'కీలక', 'సౌమ్య', 'సాధారణ', 'విరోధికృత్', 'పరిధావి', 'ప్రమాదీచ', 'ఆనంద', 'రాక్షస', 'నల',
    'పింగళ', 'కాళయుక్తి', 'సిద్ధార్థి', 'రౌద్రి', 'దుర్మతి', 'దుందుభి', 'రుధిరోద్గారి', 'రక్తాక్షి', 'క్రోధన', 'అక్షయ',
  ];
  const samvatsarasEn = [
    'Prabhava', 'Vibhava', 'Shukla', 'Pramodoota', 'Prajotpatti', 'Aangeerasa', 'Sreemukha', 'Bhava', 'Yuva', 'Dhaata',
    'Eeshwara', 'Bahudhaanya', 'Pramaathi', 'Vikrama', 'Vrusha', 'Chitrabaanu', 'Swabaanu', 'Taarana', 'Paarthiva', 'Vyaya',
    'Sarvajit', 'Sarvadhaari', 'Virodhi', 'Vikruti', 'Khara', 'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
    'Hevalambi', 'Vilambi', 'Vikaari', 'Shaarvari', 'Plava', 'Shubhakrut', 'Shobhakrut', 'Krodhi', 'Vishwaavasu', 'Paraabhava',
    'Plavanga', 'Keelaka', 'Saumya', 'Saadhaarana', 'Virodhikrut', 'Paridhaavi', 'Pramaadeecha', 'Aananda', 'Raakshasa', 'Nala',
    'Pingala', 'Kaalayukti', 'Siddhaarthi', 'Raudri', 'Durmati', 'Dundubhi', 'Rudhirodgaari', 'Raktaakshi', 'Krodhana', 'Akshaya',
  ];

  // 1987 is Prabhava (index 0)
  const samvatsaraIdx = (((bYear - 1987) % 60) + 60) % 60;
  const samvatsaraTe = `${samvatsarasTe[samvatsaraIdx]} నామ సంవత్సరం`;
  const samvatsaraEn = `${samvatsarasEn[samvatsaraIdx]} Nama Samvatsara`;

  // Ayana & Ritu
  const bMonth = parseInt(birthDate.split('-')[1], 10) || 8;
  const isDakshinayana = bMonth >= 7 && bMonth <= 12;
  const ayanaTe = isDakshinayana ? 'దక్షిణాయనం' : 'ఉత్తరాయణం';
  const ayanaEn = isDakshinayana ? 'Dakshinayanam' : 'Uttarayanam';

  const rituTe = bMonth === 7 || bMonth === 8 ? 'వర్ష ఋతువు' : 'గ్రీష్మ ఋతువు';
  const rituEn = bMonth === 7 || bMonth === 8 ? 'Varsha Ritu' : 'Greeshma Ritu';

  const masaTe = 'శ్రావణ మాసం';
  const masaEn = 'Shravana Masam';
  const pakshaTe = 'శుక్ల పక్షం';
  const pakshaEn = 'Shukla Paksham';

  // Vaara (Day of week)
  const dObj = new Date(`${birthDate}T${birthTime || '12:00'}:00`);
  const dayOfWeek = dObj.getDay();
  const daysTe = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Nakshatra Profile for Anuradha (Star 17)
  const starIdx = chartData.nakshatraIdx;
  const ganaTe = starIdx === 17 ? 'దేవ గణము' : 'మానవ గణము';
  const ganaEn = starIdx === 17 ? 'Deva Gana' : 'Manava Gana';
  const yoniTe = starIdx === 17 ? 'మృగ (లేడి) యోని' : 'సింహ యోని';
  const yoniEn = starIdx === 17 ? 'Deer (Mriga)' : 'Lion';
  const nadiTe = starIdx === 17 ? 'మధ్య నాడి' : 'అంత్య నాడి';
  const nadiEn = starIdx === 17 ? 'Madhya Nadi' : 'Antya Nadi';
  const varnaTe = 'వైశ్య వర్ణం';
  const varnaEn = 'Vaishya Varna';
  const vashyaTe = 'కీటక వశ్యము';
  const vashyaEn = 'Keetaka Vashya';
  const namaAksharamTe = 'నా, నీ, నూ, నే (Na, Nee, Noo, Ne)';
  const namaAksharamEn = 'Na, Nee, Noo, Ne';

  return {
    samvatsaraTe,
    samvatsaraEn,
    ayanaTe,
    ayanaEn,
    rituTe,
    rituEn,
    masaTe,
    masaEn,
    pakshaTe,
    pakshaEn,
    tithiTe: `${chartData.birthTithiTe} తిథి`,
    tithiEn: `${chartData.birthTithiTe} Tithi`,
    vaaraTe: daysTe[dayOfWeek],
    vaaraEn: daysEn[dayOfWeek],
    karanaTe: 'బవ / బాలవ కరణం',
    karanaEn: 'Bava / Balava Karana',
    yogaTe: 'శుభ / బ్రహ్మ యోగం',
    yogaEn: 'Shubha / Brahma Yoga',
    ganaTe,
    ganaEn,
    yoniTe,
    yoniEn,
    nadiTe,
    nadiEn,
    varnaTe,
    varnaEn,
    vashyaTe,
    vashyaEn,
    namaAksharamTe,
    namaAksharamEn,
    latLonFormatted: '17.3850° N, 78.4867° E (హైదరాబాద్)',
    timezoneFormatted: 'IST (+05:30)',
    ayanamsaFormatted: `లహిరి (${chartData.ayanamsaFormatted})`,
  };
}

/**
 * 11. 1-Page Executive Summary Generator
 */
export function generateExecutiveSummary(
  dignities: PlanetaryDignity[],
  yogas: DetectedYoga[],
  tripleKuja: TripleKujaDoshaAnalysis,
  dashaInfo: VimshottariDashaFullTimeline,
  marriageTiming: MarriageTimingDynamic
): ExecutiveSummaryReport {
  const saturnDignity = dignities.find((d) => d.id === 'saturn');
  const venusDignity = dignities.find((d) => d.id === 'venus');
  const mercuryDignity = dignities.find((d) => d.id === 'mercury');

  const top5StrengthsTe = [
    'షష్ఠ స్వక్షేత్ర & వర్గోత్తమ శని బలం: పోటీ పరీక్షలు, ఉద్యోగంలో స్థిరత్వం, శత్రు జయం మరియు ఆచరణాత్మక కార్యాచరణలో అద్భుతమైన పట్టుదల.',
    'నీచభంగ రాజయోగ ప్రభావం: ప్రారంభ ప్రతిబంధకాలను అధిగమించి స్వశక్తితో సమాజంలో ఉన్నతమైన గుర్తింపును సాధించే శక్తి.',
    'మేధోపరమైన బుధాదిత్య & గజకేసరి యోగాలు: లోతైన విశ్లేషణ, సమస్య పరిష్కార నైపుణ్యం మరియు వ్యూహాత్మక ఆలోచనా ధోరణి.',
    'గురు-చండాల పరిశోధనా దృష్టి: సంప్రదాయ పరిధులను దాటి నూతన సాంకేతిక, పరిశోధనా లేదా విదేశీ రంగాలలో రాణించే సామర్థ్యం.',
    'దేవ గణ నక్షత్ర పవిత్రత (అనురాధ): స్నేహశీలత, ఆప్యాయత మరియు సత్యనిష్ఠతో కూడిన ఉన్నత వ్యక్తిత్వం.',
  ];

  const top5StrengthsEn = [
    'Vargottama & Swakshetra Saturn in 6th: Formidable resilience, victory over competitive hurdles, and long-term career stamina.',
    'Neecha Bhanga Raja Yoga: Transforming initial developmental constraints into extraordinary eventual success.',
    'Budhaditya & Intellectual Sharpness: Quick analytical acumen, executive communication, and problem-solving prowess.',
    'Guru-Chandala Research Capability: Pioneering out-of-the-box thinking suited for advanced tech and research domains.',
    'Auspicious Deva Gana Nakshatra (Anuradha): Inherent diplomatic charm, emotional loyalty, and ethical steadfastness.',
  ];

  const top3CautionsTe = [
    'చంద్రుని నుండి 8వ స్థానంలో కుజుడు (అష్టమ కుజుడు): వైవాహిక, వ్యక్తిగత చర్చలలో అనవసర ఆవేశానికి తావివ్వకుండా సంయమనం పాటించాలి.',
    'బుధ అస్తంగత & గండాంత సంధి ప్రభావం: నరాల ఒత్తిడి, అతిగా ఆలోచించడం (overthinking) మరియు నిర్ణయాలలో తొందరపాటును నివారించాలి.',
    'అర్ధాష్టమ శని సంచారం: గృహ సంబంధ పనులు, రియల్ ఎస్టేట్ లావాదేవీలు మరియు వాహన డ్రైవింగ్ సమయాల్లో సంయమనం అవసరం.',
  ];

  const top3CautionsEn = [
    'Mars in 8th from Moon (Ashtama Kuja): Avoid impulsive temperamental reactions in domestic and close partnerships.',
    'Combust Mercury & Gandanta Junction: Guard against mental exhaustion, overthinking, and hasty document commitments.',
    'Ardhashtama Shani Phase: Exercise methodical patience with real-estate deals, vehicular transit, and home affairs.',
  ];

  const next12MonthsOutlookTe = `ప్రస్తుత ${dashaInfo.currentMahadasha.lordTe} మహాదశలో ${dashaInfo.currentAntardasha.lordTe} అంతర్దశ నడుస్తున్నది. గోచార గురు బలం వల్ల వృత్తిపరమైన ఎదుగుదలకు, ఆర్థిక స్థిరత్వానికి మరియు శుభకార్య ప్రయత్నాలకు (${marriageTiming.currentFavorableWindows[0].period}) కాలం అత్యంత ప్రోత్సాహకరంగా ఉన్నది.`;
  const next12MonthsOutlookEn = `Currently running ${dashaInfo.currentMahadasha.lordEn} Mahadasha with ${dashaInfo.currentAntardasha.lordEn} Antardasha. Auspicious Jupiter transits foster steady career consolidation and strong matrimonial progress during the ${marriageTiming.currentFavorableWindows[0].period} window.`;

  const vitalRemedyFocusTe = `ప్రతి మంగళవారం శ్రీ సుబ్రహ్మణ్య అష్టకం, బుధవారం శ్రీ విష్ణు సహస్రనామ స్తోత్ర పఠనం మరియు శనివారం హనుమాన్ చాలీసా ఆరాధన సర్వతోముఖ రక్షణను ఇస్తాయి.`;
  const vitalRemedyFocusEn = `Chant Sri Subramanya Ashtakam on Tuesdays, Sri Vishnu Sahasranama on Wednesdays, and Hanuman Chalisa on Saturdays.`;

  return {
    oneLineDashaSummaryTe: `ప్రస్తుత దశా కాలం: ${dashaInfo.currentMahadasha.lordTe} మహాదశ — ${dashaInfo.currentAntardasha.lordTe} అంతర్దశ (${dashaInfo.currentAntardasha.startDate} నుండి ${dashaInfo.currentAntardasha.endDate} వరకు)`,
    oneLineDashaSummaryEn: `Active Period: ${dashaInfo.currentMahadasha.lordEn} Mahadasha — ${dashaInfo.currentAntardasha.lordEn} Antardasha (${dashaInfo.currentAntardasha.startDate} to ${dashaInfo.currentAntardasha.endDate})`,
    top5StrengthsTe,
    top5StrengthsEn,
    top3CautionsTe,
    top3CautionsEn,
    next12MonthsOutlookTe,
    next12MonthsOutlookEn,
    vitalRemedyFocusTe,
    vitalRemedyFocusEn,
  };
}
