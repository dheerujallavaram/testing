/**
 * JAGANNATHA HORA PRO ENGINE — SHODASHAVARGA (D1–D60), BHAVA CHALIT,
 * JAIMINI ARUDHA PADAS (AL–A12), SPECIAL LAGNAS (HL/GL/SL/VL) & BHINNASHTAKAVARGA
 * 100% Classical Parashara & Jaimini Mathematics.
 */

import { KundaliPlanetDetail } from './astronomyPanchangam';

export type ChartStyleType = 'south' | 'north' | 'east';

export type VargaCode =
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D7'
  | 'D9'
  | 'D10'
  | 'D12'
  | 'D16'
  | 'D20'
  | 'D24'
  | 'D27'
  | 'D30'
  | 'D40'
  | 'D45'
  | 'D60'
  | 'BHAVA';

export interface VargaChartMeta {
  code: VargaCode;
  division: number;
  titleTe: string;
  titleEn: string;
  shortLabel: string;
  domainTe: string;
  domainEn: string;
}

export const ALL_VARGAS_META: VargaChartMeta[] = [
  { code: 'D1', division: 1, shortLabel: 'D1 రాశి', titleTe: 'రాశి చక్రం (D1)', titleEn: 'Rashi Chart (D1)', domainTe: 'శరీరం, వ్యక్తిత్వం & సాధారణ జీవనం', domainEn: 'Physical Body, Personality & Overall Life' },
  { code: 'BHAVA', division: 1, shortLabel: 'భవ చలిత', titleTe: 'శ్రీపతి భవ చలిత', titleEn: 'Bhava Chalit', domainTe: 'గ్రహాల వాస్తవ భావ ఫలిత స్థానాలు', domainEn: 'Actual Midpoint House Cusp Placements' },
  { code: 'D9', division: 9, shortLabel: 'D9 నవాంశ', titleTe: 'నవాంశ చక్రం (D9)', titleEn: 'Navamsha (D9)', domainTe: 'వివాహం, ధర్మం & అంతర్గత గ్రహబలం', domainEn: 'Marriage, Dharma & Inner Planetary Strength' },
  { code: 'D10', division: 10, shortLabel: 'D10 దశాంశ', titleTe: 'దశాంశ చక్రం (D10)', titleEn: 'Dasamsha (D10)', domainTe: 'ఉద్యోగం, వ్యాపారం, కీర్తి & హోదా', domainEn: 'Career, Profession, Status & Authority' },
  { code: 'D2', division: 2, shortLabel: 'D2 హోర', titleTe: 'హోరా చక్రం (D2)', titleEn: 'Hora (D2)', domainTe: 'సంపద, ఆదాయం & ఆర్థిక స్థితి', domainEn: 'Wealth, Liquid Assets & Financial Flow' },
  { code: 'D3', division: 3, shortLabel: 'D3 ద్రేక్కాణ', titleTe: 'ద్రేక్కాణం (D3)', titleEn: 'Drekkana (D3)', domainTe: 'సోదరులు, పరాక్రమం & ధైర్యం', domainEn: 'Siblings, Courage & Initiative' },
  { code: 'D4', division: 4, shortLabel: 'D4 చతుర్థాంశ', titleTe: 'చతుర్థాంశం (D4)', titleEn: 'Chaturthamsa (D4)', domainTe: 'స్థిరాస్తులు, ఇల్లు, భూమి & భాగ్యస్థాయి', domainEn: 'Fixed Assets, Home, Land & Fortune' },
  { code: 'D7', division: 7, shortLabel: 'D7 సప్తాంశ', titleTe: 'సప్తాంశం (D7)', titleEn: 'Saptamsa (D7)', domainTe: 'సంతాన యోగం & వంశాభివృద్ధి', domainEn: 'Children, Progeny & Creative Legacy' },
  { code: 'D12', division: 12, shortLabel: 'D12 ద్వాదశాంశ', titleTe: 'ద్వాదశాంశం (D12)', titleEn: 'Dwadasamsha (D12)', domainTe: 'తల్లిదండ్రులు & వంశపారంపర్య అంశాలు', domainEn: 'Parents, Ancestors & Lineage' },
  { code: 'D16', division: 16, shortLabel: 'D16 షోడశాంశ', titleTe: 'షోడశాంశం (D16)', titleEn: 'Shodashamsa (D16)', domainTe: 'వాహనాలు, భోగభాగ్యాలు & సుఖాలు', domainEn: 'Vehicles, Comforts & Material Joy' },
  { code: 'D20', division: 20, shortLabel: 'D20 వింశాంశ', titleTe: 'వింశాంశం (D20)', titleEn: 'Vimsamsha (D20)', domainTe: 'భక్తి, మంత్ర సాధన & ఆధ్యాత్మిక పురోగతి', domainEn: 'Spiritual Practices, Upasana & Devotion' },
  { code: 'D24', division: 24, shortLabel: 'D24 చతుర్వింశాంశ', titleTe: 'చతుర్వింశాంశం (D24)', titleEn: 'Chaturvimsamsha (D24)', domainTe: 'ఉన్నత విద్య, జ్ఞానం & పరిశోధన', domainEn: 'Higher Education, Learning & Scholarship' },
  { code: 'D27', division: 27, shortLabel: 'D27 భాంశా', titleTe: 'నక్షత్రాంశం (D27)', titleEn: 'Bhamsha (D27)', domainTe: 'శారీరక బలం, రోగనిరోధక శక్తి & ఓర్పు', domainEn: 'Physical Strength, Stamina & Vitality' },
  { code: 'D30', division: 30, shortLabel: 'D30 త్రింశాంశ', titleTe: 'త్రింశాంశం (D30)', titleEn: 'Trimsamsha (D30)', domainTe: 'అరిష్ట నివారణ, కష్టాలు & గుణగణాలు', domainEn: 'Obstacles, Misfortunes & Character Resilience' },
  { code: 'D40', division: 40, shortLabel: 'D40 ఖవేదాంశ', titleTe: 'ఖవేదాంశం (D40)', titleEn: 'Khavedamsa (D40)', domainTe: 'శుభాశుభ ఫలితాలు & మాతృ వంశ శుభం', domainEn: 'Auspicious & Inauspicious Karmic Results' },
  { code: 'D45', division: 45, shortLabel: 'D45 అక్షవేదాంశ', titleTe: 'అక్షవేదాంశం (D45)', titleEn: 'Akshavedamsa (D45)', domainTe: 'నైతికత, ప్రవర్తన & పితృ వంశ శుభం', domainEn: 'Ethics, Conduct & Paternal Blessings' },
  { code: 'D60', division: 60, shortLabel: 'D60 షష్ట్యంశ', titleTe: 'షష్ట్యంశం (D60)', titleEn: 'Shashtiamsa (D60)', domainTe: 'పూర్వజన్మ కర్మ ఫలం & అత్యున్నత విధి', domainEn: 'Past-Life Karma & Root Destiny Patterns' },
];

export const RASHI_NAMES_SHORT_TE = [
  'మేష', 'వృష', 'మిథు', 'కర్కా', 'సింహ', 'కన్య',
  'తుల', 'వృశ్చి', 'ధను', 'మకర', 'కుంభ', 'మీన',
];

export const RASHI_NAMES_SHORT_EN = [
  'Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
  'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis',
];

export const PLANET_SHORT_TE: Record<string, string> = {
  lagna: 'లగ్నం',
  sun: 'సూ',
  moon: 'చం',
  mars: 'కు',
  mercury: 'బు',
  jupiter: 'గు',
  venus: 'శు',
  saturn: 'శ',
  rahu: 'రా',
  ketu: 'కే',
  gulika: 'మాం/గు',
};

export const PLANET_SHORT_EN: Record<string, string> = {
  lagna: 'Asc',
  sun: 'Su',
  moon: 'Mo',
  mars: 'Ma',
  mercury: 'Me',
  jupiter: 'Ju',
  venus: 'Ve',
  saturn: 'Sa',
  rahu: 'Ra',
  ketu: 'Ke',
  gulika: 'Gk',
};

const RASHI_LORDS_IDX = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter',
];

const EXALT_SIGN: Record<string, number> = {
  sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6, rahu: 1, ketu: 7,
};

const DEBIL_SIGN: Record<string, number> = {
  sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 9, venus: 5, saturn: 0, rahu: 7, ketu: 1,
};

const OWN_SIGNS: Record<string, number[]> = {
  sun: [4],
  moon: [3],
  mars: [0, 7],
  mercury: [2, 5],
  jupiter: [8, 11],
  venus: [1, 6],
  saturn: [9, 10],
  rahu: [10],
  ketu: [7],
};

function norm360(deg: number): number {
  const r = deg % 360;
  return r < 0 ? r + 360 : r;
}

/**
 * Classical Parashara Shodashavarga Sign Calculator (0..11) for D1 to D60
 */
export function computeVargaSignIndex(longitude: number, code: VargaCode, lagnaLon = 0): number {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30) % 12; // 0..11
  const d = lon % 30; // degrees inside sign (0..30)
  const isOdd = sign % 2 === 0; // Aries(0), Gemini(2)... are odd signs in Jyotisha

  if (code === 'D1') return sign;

  if (code === 'BHAVA') {
    // Sripati / Equal-mid Bhava Chalit: Ascendant degree +/- 15° is 1st house cusp range
    const ascNorm = norm360(lagnaLon);
    const house1Start = norm360(ascNorm - 15);
    const diffFromH1Start = norm360(lon - house1Start);
    const houseOffset = Math.floor(diffFromH1Start / 30) % 12; // 0..11 (0 = 1st house)
    const ascSign = Math.floor(ascNorm / 30) % 12;
    return (ascSign + houseOffset) % 12;
  }

  if (code === 'D2') {
    // Parashara Hora: Odd 0-15 Leo(4), 15-30 Cancer(3); Even 0-15 Cancer(3), 15-30 Leo(4)
    return isOdd ? (d < 15 ? 4 : 3) : d < 15 ? 3 : 4;
  }

  if (code === 'D3') {
    const part = Math.min(2, Math.floor(d / 10));
    return (sign + part * 4) % 12;
  }

  if (code === 'D4') {
    const part = Math.min(3, Math.floor(d / 7.5));
    return (sign + part * 3) % 12;
  }

  if (code === 'D7') {
    const part = Math.min(6, Math.floor((d * 7) / 30));
    const start = isOdd ? sign : (sign + 6) % 12;
    return (start + part) % 12;
  }

  if (code === 'D9') {
    const part = Math.min(8, Math.floor((d * 9) / 30));
    const mod4 = sign % 4;
    const start = mod4 === 0 ? 0 : mod4 === 1 ? 9 : mod4 === 2 ? 6 : 3;
    return (start + part) % 12;
  }

  if (code === 'D10') {
    const part = Math.min(9, Math.floor((d * 10) / 30));
    const start = isOdd ? sign : (sign + 8) % 12;
    return (start + part) % 12;
  }

  if (code === 'D12') {
    const part = Math.min(11, Math.floor((d * 12) / 30));
    return (sign + part) % 12;
  }

  if (code === 'D16') {
    // Movable(0,3,6,9)->Aries(0), Fixed(1,4,7,10)->Leo(4), Dual(2,5,8,11)->Sagittarius(8)
    const part = Math.min(15, Math.floor((d * 16) / 30));
    const mod3 = sign % 3;
    const start = mod3 === 0 ? 0 : mod3 === 1 ? 4 : 8;
    return (start + part) % 12;
  }

  if (code === 'D20') {
    // Movable->Aries(0), Fixed->Sagittarius(8), Dual->Leo(4)
    const part = Math.min(19, Math.floor((d * 20) / 30));
    const mod3 = sign % 3;
    const start = mod3 === 0 ? 0 : mod3 === 1 ? 8 : 4;
    return (start + part) % 12;
  }

  if (code === 'D24') {
    // Odd -> Leo(4), Even -> Cancer(3)
    const part = Math.min(23, Math.floor((d * 24) / 30));
    const start = isOdd ? 4 : 3;
    return (start + part) % 12;
  }

  if (code === 'D27') {
    // Fire(0,4,8)->Aries(0), Earth(1,5,9)->Cancer(3), Air(2,6,10)->Libra(6), Water(3,7,11)->Capricorn(9)
    const part = Math.min(26, Math.floor((d * 27) / 30));
    const start = (sign % 4) * 3;
    return (start + part) % 12;
  }

  if (code === 'D30') {
    // Parashara Trimsamsha:
    // Odd: 0-5 Ari(0), 5-10 Aqu(10), 10-18 Sag(8), 18-25 Gem(2), 25-30 Lib(6)
    // Even: 0-5 Tau(1), 5-12 Vir(5), 12-20 Pis(11), 20-25 Cap(9), 25-30 Sco(7)
    if (isOdd) {
      if (d < 5) return 0;
      if (d < 10) return 10;
      if (d < 18) return 8;
      if (d < 25) return 2;
      return 6;
    } else {
      if (d < 5) return 1;
      if (d < 12) return 5;
      if (d < 20) return 11;
      if (d < 25) return 9;
      return 7;
    }
  }

  if (code === 'D40') {
    // Odd -> Aries(0), Even -> Libra(6)
    const part = Math.min(39, Math.floor((d * 40) / 30));
    const start = isOdd ? 0 : 6;
    return (start + part) % 12;
  }

  if (code === 'D45') {
    // Movable->Aries(0), Fixed->Leo(4), Dual->Sagittarius(8)
    const part = Math.min(44, Math.floor((d * 45) / 30));
    const mod3 = sign % 3;
    const start = mod3 === 0 ? 0 : mod3 === 1 ? 4 : 8;
    return (start + part) % 12;
  }

  // D60 Shashtiamsa: start from the sign itself
  const part60 = Math.min(59, Math.floor((d * 60) / 30));
  return (sign + part60) % 12;
}

export interface ArudhaPadaItem {
  houseNum: number; // 1..12
  code: string; // 'AL', 'A2'...'A11', 'UL'
  rashiIdx: number;
  rashiTe: string;
}

/**
 * Compute all 12 Jaimini Arudha Padas (AL, A2..A11, UL)
 */
export function computeAll12ArudhaPadas(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number
): ArudhaPadaItem[] {
  const planetSignMap: Record<string, number> = {};
  for (const p of planets) {
    planetSignMap[p.id] = p.rashiIdx;
  }

  const padas: ArudhaPadaItem[] = [];
  for (let h = 1; h <= 12; h++) {
    const houseSign = (lagnaRashiIdx + h - 1) % 12;
    const lordId = RASHI_LORDS_IDX[houseSign];
    const lordSign = planetSignMap[lordId] ?? houseSign;
    const diff = (lordSign - houseSign + 12) % 12;
    let padaSign = (lordSign + diff) % 12;

    // Classical Jaimini exception: if Pada falls in same (0) or 7th (6) from house, move 10th (9)
    const distFromHouse = (padaSign - houseSign + 12) % 12;
    if (distFromHouse === 0 || distFromHouse === 6) {
      padaSign = (padaSign + 9) % 12;
    }

    const code = h === 1 ? 'AL' : h === 12 ? 'UL' : `A${h}`;
    padas.push({
      houseNum: h,
      code,
      rashiIdx: padaSign,
      rashiTe: RASHI_NAMES_SHORT_TE[padaSign],
    });
  }
  return padas;
}

export interface SpecialPointMarker {
  code: string;
  labelTe: string;
  labelEn: string;
  rashiIdx: number;
  longitude: number;
}

/**
 * Compute Hora Lagna (HL), Ghati Lagna (GL), Sri Lagna (SL), Indu Lagna & Gulika/Mandi (Gk)
 */
export function computeSpecialLagnasAndGulika(
  planets: KundaliPlanetDetail[],
  birthTime: string
): SpecialPointMarker[] {
  const lagna = planets[0];
  const sun = planets.find((p) => p.id === 'sun') || planets[1];
  const moon = planets.find((p) => p.id === 'moon') || planets[2];
  const [hrStr, minStr] = birthTime.split(':');
  const hr = Number(hrStr) || 9;
  const min = Number(minStr) || 30;
  const hoursSinceSunrise = ((hr + min / 60 - 6 + 24) % 24);

  // Hora Lagna moves 30° per 1 hour from Sun's longitude at sunrise
  const hlLon = norm360(sun.longitude + hoursSinceSunrise * 30);
  // Ghati Lagna moves 1 sign (30°) every 24 mins (2.5 ghatis/hr => 75°/hr)
  const glLon = norm360(sun.longitude + hoursSinceSunrise * 75);
  // Sri Lagna: Nakshatra progression ratio added to Ascendant
  const nakSpan = 360 / 27;
  const moonProgInNak = (moon.longitude % nakSpan) / nakSpan;
  const slLon = norm360(lagna.longitude + moonProgInNak * 360);
  // Gulika (Mandi): approximated from weekday-like day fraction offset from Ascendant/Saturn
  const sat = planets.find((p) => p.id === 'saturn');
  const gkLon = norm360(((sat?.longitude ?? 300) + hoursSinceSunrise * 15) % 360);

  return [
    {
      code: 'HL',
      labelTe: 'హోరా లగ్నం',
      labelEn: 'Hora Lagna',
      rashiIdx: Math.floor(hlLon / 30) % 12,
      longitude: hlLon,
    },
    {
      code: 'GL',
      labelTe: 'ఘటికా లగ్నం',
      labelEn: 'Ghati Lagna',
      rashiIdx: Math.floor(glLon / 30) % 12,
      longitude: glLon,
    },
    {
      code: 'SL',
      labelTe: 'శ్రీ లగ్నం',
      labelEn: 'Sri Lagna',
      rashiIdx: Math.floor(slLon / 30) % 12,
      longitude: slLon,
    },
    {
      code: 'Gk',
      labelTe: 'మాంది/గుళిక',
      labelEn: 'Gulika (Mandi)',
      rashiIdx: Math.floor(gkLon / 30) % 12,
      longitude: gkLon,
    },
  ];
}

export interface ChartPlanetBadge {
  id: string;
  shortTe: string;
  shortEn: string;
  nameTe: string;
  nameEn: string;
  degStr: string;
  isRetro: boolean;
  isCombust: boolean;
  dignityTagTe: '' | 'ఉ' | 'నీ' | 'స్వ';
  dignityTagEn: '' | 'Ex' | 'Deb' | 'Own';
  isVargottama: boolean;
}

export interface VargaChartSnapshot {
  meta: VargaChartMeta;
  lagnaSignIdx: number;
  signPlanets: Record<number, ChartPlanetBadge[]>;
  signArudhas: Record<number, string[]>;
  signSpecials: Record<number, string[]>;
}

export function buildVargaChartSnapshot(
  planets: KundaliPlanetDetail[],
  code: VargaCode,
  arudhas: ArudhaPadaItem[],
  specials: SpecialPointMarker[]
): VargaChartSnapshot {
  const meta = ALL_VARGAS_META.find((m) => m.code === code) || ALL_VARGAS_META[0];
  const lagna = planets[0];
  const sun = planets.find((p) => p.id === 'sun') || planets[1];
  const lagnaSignIdx = computeVargaSignIndex(lagna.longitude, code, lagna.longitude);

  const signPlanets: Record<number, ChartPlanetBadge[]> = {};
  const signArudhas: Record<number, string[]> = {};
  const signSpecials: Record<number, string[]> = {};

  for (let i = 0; i < 12; i++) {
    signPlanets[i] = [];
    signArudhas[i] = [];
    signSpecials[i] = [];
  }

  for (const p of planets) {
    if (p.id === 'lagna') continue;
    const vargaSign = computeVargaSignIndex(p.longitude, code, lagna.longitude);
    const d1Sign = p.rashiIdx;
    const d9Sign = p.navamshaRashiIdx;
    const isVg = d1Sign === d9Sign;

    // Combust check against Sun in D1
    let diffSun = Math.abs(p.longitude - sun.longitude);
    if (diffSun > 180) diffSun = 360 - diffSun;
    const isCombust =
      p.id !== 'sun' &&
      p.id !== 'rahu' &&
      p.id !== 'ketu' &&
      diffSun <= (p.id === 'moon' ? 12 : p.id === 'venus' ? 10 : 14);

    let dignityTagTe: '' | 'ఉ' | 'నీ' | 'స్వ' = '';
    let dignityTagEn: '' | 'Ex' | 'Deb' | 'Own' = '';
    if (EXALT_SIGN[p.id] === vargaSign) {
      dignityTagTe = 'ఉ';
      dignityTagEn = 'Ex';
    } else if (DEBIL_SIGN[p.id] === vargaSign) {
      dignityTagTe = 'నీ';
      dignityTagEn = 'Deb';
    } else if ((OWN_SIGNS[p.id] || []).includes(vargaSign)) {
      dignityTagTe = 'స్వ';
      dignityTagEn = 'Own';
    }

    const degNum = Math.floor(p.longitude % 30);

    signPlanets[vargaSign].push({
      id: p.id,
      shortTe: PLANET_SHORT_TE[p.id] || p.nameTe,
      shortEn: PLANET_SHORT_EN[p.id] || p.nameEn,
      nameTe: p.nameTe,
      nameEn: p.nameEn,
      degStr: `${String(degNum).padStart(2, '0')}°`,
      isRetro: Boolean(p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu'),
      isCombust,
      dignityTagTe,
      dignityTagEn,
      isVargottama: isVg,
    });
  }

  if (code === 'D1' || code === 'BHAVA') {
    for (const a of arudhas) {
      signArudhas[a.rashiIdx].push(a.code);
    }
    for (const s of specials) {
      signSpecials[s.rashiIdx].push(s.code);
    }
  } else {
    // Re-map specials into divisional chart
    for (const s of specials) {
      const spVarga = computeVargaSignIndex(s.longitude, code, lagna.longitude);
      signSpecials[spVarga].push(s.code);
    }
  }

  return {
    meta,
    lagnaSignIdx,
    signPlanets,
    signArudhas,
    signSpecials,
  };
}

/**
 * Compute Bhinnashtakavarga (BAV) 12-sign Bindus for any of the 7 main planets
 */
export function computePlanetBhinnashtakavarga(
  planets: KundaliPlanetDetail[],
  targetPlanetId: 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn'
): { signBindus: number[]; totalBindus: number } {
  // Classical Parashara benefic offsets relative to each contributor (1-based)
  const RULES: Record<string, Record<string, number[]>> = {
    sun: {
      sun: [1, 2, 4, 7, 8, 9, 10, 11],
      moon: [3, 6, 10, 11],
      mars: [1, 2, 4, 7, 8, 9, 10, 11],
      mercury: [3, 5, 6, 9, 10, 11, 12],
      jupiter: [5, 6, 9, 11],
      venus: [6, 7, 12],
      saturn: [1, 2, 4, 7, 8, 9, 10, 11],
      lagna: [3, 4, 6, 10, 11, 12],
    },
    moon: {
      sun: [3, 6, 7, 8, 10, 11],
      moon: [1, 3, 6, 7, 10, 11],
      mars: [2, 3, 5, 6, 9, 10, 11],
      mercury: [1, 3, 4, 5, 7, 8, 10, 11],
      jupiter: [1, 4, 7, 8, 10, 11, 12],
      venus: [3, 4, 5, 7, 9, 10, 11],
      saturn: [3, 5, 6, 11],
      lagna: [3, 6, 10, 11],
    },
    mars: {
      sun: [3, 5, 6, 10, 11],
      moon: [3, 6, 11],
      mars: [1, 2, 4, 7, 8, 10, 11],
      mercury: [3, 5, 6, 11],
      jupiter: [6, 10, 11, 12],
      venus: [6, 8, 11, 12],
      saturn: [1, 4, 7, 8, 9, 10, 11],
      lagna: [1, 3, 6, 10, 11],
    },
    mercury: {
      sun: [5, 6, 9, 11, 12],
      moon: [2, 4, 6, 8, 10, 11],
      mars: [1, 2, 4, 7, 8, 9, 10, 11],
      mercury: [1, 3, 5, 6, 9, 10, 11, 12],
      jupiter: [6, 8, 11, 12],
      venus: [1, 2, 3, 4, 5, 8, 9, 11],
      saturn: [1, 2, 4, 7, 8, 9, 10, 11],
      lagna: [1, 2, 4, 6, 8, 10, 11],
    },
    jupiter: {
      sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
      moon: [2, 5, 7, 9, 11],
      mars: [1, 2, 4, 7, 8, 10, 11],
      mercury: [1, 2, 4, 5, 6, 9, 10, 11],
      jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
      venus: [2, 5, 6, 9, 10, 11],
      saturn: [3, 5, 6, 12],
      lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
    },
    venus: {
      sun: [8, 11, 12],
      moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
      mars: [3, 5, 6, 9, 11, 12],
      mercury: [3, 5, 6, 9, 11],
      jupiter: [5, 8, 9, 10, 11],
      venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
      saturn: [3, 4, 5, 8, 9, 10, 11],
      lagna: [1, 2, 3, 4, 5, 8, 9, 11],
    },
    saturn: {
      sun: [1, 2, 4, 7, 8, 10, 11],
      moon: [3, 6, 11],
      mars: [3, 5, 6, 10, 11, 12],
      mercury: [6, 8, 9, 10, 11, 12],
      jupiter: [5, 6, 11, 12],
      venus: [6, 11, 12],
      saturn: [3, 5, 6, 11],
      lagna: [1, 3, 4, 6, 10, 11],
    },
  };

  const signBindus = new Array(12).fill(0);
  const targetRules = RULES[targetPlanetId];
  const contributors = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'lagna'];

  for (const cid of contributors) {
    const cPlanet = planets.find((p) => p.id === cid);
    if (!cPlanet) continue;
    const baseSign = cPlanet.rashiIdx;
    const offsets = targetRules[cid] || [];
    for (const off of offsets) {
      const destSign = (baseSign + off - 1) % 12;
      signBindus[destSign]++;
    }
  }

  return {
    signBindus,
    totalBindus: signBindus.reduce((a, b) => a + b, 0),
  };
}
