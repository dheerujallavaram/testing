import * as Astronomy from 'astronomy-engine';
import gocharaAuthorContent from '../data/gocharaAuthorContent.json';
import { getLahiriAyanamsa, getSiderealMoonLongitude, norm360 } from './astronomyPanchangam';

export type RashiSlug =
  | 'mesham'
  | 'vrushabham'
  | 'mithunam'
  | 'karkatakam'
  | 'simham'
  | 'kanya'
  | 'tula'
  | 'vruschikam'
  | 'dhanussu'
  | 'makaram'
  | 'kumbham'
  | 'meenam';

export interface RashiInfo {
  slug: RashiSlug;
  index: number; // 1..12
  nameTe: string;
  nameEn: string;
  lordTe: string;
}

export const RASHI_LIST: RashiInfo[] = gocharaAuthorContent.rashis as RashiInfo[];

const NAKSHATRA_NAMES_TE = [
  'అశ్విని',
  'భరణి',
  'కృత్తిక',
  'రోహిణి',
  'మృగశిర',
  'ఆరుద్ర',
  'పునర్వసు',
  'పుష్యమి',
  'ఆశ్లేష',
  'మఘ',
  'పుబ్బ (పూర్వ ఫల్గుణి)',
  'ఉత్తర (ఉత్తర ఫల్గుణి)',
  'హస్త',
  'చిత్త',
  'స్వాతి',
  'విశాఖ',
  'అనూరాధ',
  'జ్యేష్ఠ',
  'మూల',
  'పూర్వాషాఢ',
  'ఉత్తరాషాఢ',
  'శ్రవణం',
  'ధనిష్ఠ',
  'శతభిషం',
  'పూర్వాభాద్ర',
  'ఉత్తరాభాద్ర',
  'రేవతి',
];

export interface PlanetTransitPosition {
  id: 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'rahu' | 'ketu';
  nameTe: string;
  nameEn: string;
  siderealLon: number;
  rashiIndex: number; // 1..12
  rashiSlug: RashiSlug;
  rashiNameTe: string;
  rashiNameEn: string;
  degreeInRashi: string;
  nakshatraTe: string;
  pada: number;
  houseFromMoon: number; // 1..12
  isAuspiciousFromMoon: boolean;
  isRetrograde: boolean;
  vedhaHouseFromMoon: number | null;
  hasVedha: boolean;
  vedhaByPlanetTe: string | null;
}

export interface HouseGuidanceItem {
  placeholder: string;
  phaseTe: string;
  status: 'auspicious' | 'moderate' | 'cautious';
  sutraTe?: string;
  summaryTe: string;
  sharmaNoteTe?: string;
  summaryEn?: string;
  carefulTe: string;
  doTe: string;
}

export interface RashiGocharaReport {
  computedAtIstIso: string;
  rashi: RashiInfo;
  planets: PlanetTransitPosition[];
  saturn: PlanetTransitPosition & { guidance: HouseGuidanceItem };
  jupiter: PlanetTransitPosition & { guidance: HouseGuidanceItem };
  rahu: PlanetTransitPosition & { guidance: HouseGuidanceItem };
  ketu: PlanetTransitPosition & { guidance: HouseGuidanceItem };
  sadeSatiStatusTe: string;
  isYelinatiShani: boolean;
}

function getSiderealBodyLongitude(body: Astronomy.Body, dateUtc: Date, ayanamsa: number): number {
  const vec = Astronomy.GeoVector(body, dateUtc, true);
  const ecl = Astronomy.Ecliptic(vec);
  return norm360(ecl.elon - ayanamsa);
}

function getMeanRahuSiderealLongitude(dateUtc: Date, ayanamsa: number): number {
  const jd = dateUtc.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  const tropicalOmega =
    125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0;
  return norm360(tropicalOmega - ayanamsa);
}

const AUSPICIOUS_HOUSES_FROM_MOON: Record<PlanetTransitPosition['id'], number[]> = {
  sun: [3, 6, 10, 11],
  moon: [1, 3, 6, 7, 10, 11],
  mars: [3, 6, 11],
  mercury: [2, 4, 6, 8, 10, 11],
  jupiter: [2, 5, 7, 9, 11],
  venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  saturn: [3, 6, 11],
  rahu: [3, 6, 11],
  ketu: [3, 6, 11],
};

// Classical Gochara Vedha Map (House from Moon -> Obstructing Vedha House from Moon)
const VEDHA_HOUSE_MAP: Record<PlanetTransitPosition['id'], Record<number, number>> = {
  sun: { 3: 9, 6: 12, 10: 4, 11: 5 },
  moon: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  mars: { 3: 12, 6: 9, 11: 5 },
  mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 },
  jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  venus: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
  saturn: { 3: 12, 6: 9, 11: 5 },
  rahu: { 3: 12, 6: 9, 11: 5 },
  ketu: { 3: 12, 6: 9, 11: 5 },
};

function isVedhaExempt(
  planetId: PlanetTransitPosition['id'],
  obstructingPlanetId: PlanetTransitPosition['id']
): boolean {
  // Classical mutual exemptions: Sun <-> Saturn, Moon <-> Mercury
  if (
    (planetId === 'sun' && obstructingPlanetId === 'saturn') ||
    (planetId === 'saturn' && obstructingPlanetId === 'sun')
  ) {
    return true;
  }
  if (
    (planetId === 'moon' && obstructingPlanetId === 'mercury') ||
    (planetId === 'mercury' && obstructingPlanetId === 'moon')
  ) {
    return true;
  }
  return false;
}

export function findRashiBySlug(slug: string): RashiInfo {
  const clean = (slug || 'mesham').toLowerCase().trim();
  return RASHI_LIST.find((r) => r.slug === clean) || RASHI_LIST[0];
}

export function computeGocharaForRashi(
  rashiSlug: RashiSlug = 'mesham',
  referenceDateUtc?: Date
): RashiGocharaReport {
  const nowUtc = referenceDateUtc || new Date();
  const istMs = nowUtc.getTime() + 5.5 * 3600 * 1000;
  const istDate = new Date(istMs);
  const computedAtIstIso = `${istDate.getUTCFullYear()}-${String(istDate.getUTCMonth() + 1).padStart(2, '0')}-${String(istDate.getUTCDate()).padStart(2, '0')}`;

  // Compute at 06:00 AM IST of the target day in Asia/Kolkata
  const calcUtc = new Date(
    Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate(), 0, 30, 0)
  );
  const nextDayUtc = new Date(calcUtc.getTime() + 24 * 3600 * 1000);
  const ayanamsa = getLahiriAyanamsa(calcUtc);
  const nextAyanamsa = getLahiriAyanamsa(nextDayUtc);
  const moonRashi = findRashiBySlug(rashiSlug);

  const checkBodyRetrograde = (body: Astronomy.Body): boolean => {
    const lon1 = getSiderealBodyLongitude(body, calcUtc, ayanamsa);
    const lon2 = getSiderealBodyLongitude(body, nextDayUtc, nextAyanamsa);
    let diff = lon2 - lon1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff < 0;
  };

  const rawBodies: {
    id: PlanetTransitPosition['id'];
    nameTe: string;
    nameEn: string;
    lon: number;
    isRetrograde: boolean;
  }[] = [
    {
      id: 'saturn',
      nameTe: 'శని (Saturn)',
      nameEn: 'Saturn (Shani)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Saturn, calcUtc, ayanamsa),
      isRetrograde: checkBodyRetrograde(Astronomy.Body.Saturn),
    },
    {
      id: 'jupiter',
      nameTe: 'గురువు (Jupiter)',
      nameEn: 'Jupiter (Guru)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Jupiter, calcUtc, ayanamsa),
      isRetrograde: checkBodyRetrograde(Astronomy.Body.Jupiter),
    },
    {
      id: 'rahu',
      nameTe: 'రాహువు (Rahu)',
      nameEn: 'Rahu (North Node)',
      lon: getMeanRahuSiderealLongitude(calcUtc, ayanamsa),
      isRetrograde: true,
    },
    {
      id: 'ketu',
      nameTe: 'కేతువు (Ketu)',
      nameEn: 'Ketu (South Node)',
      lon: norm360(getMeanRahuSiderealLongitude(calcUtc, ayanamsa) + 180),
      isRetrograde: true,
    },
    {
      id: 'sun',
      nameTe: 'రవి (Sun)',
      nameEn: 'Sun (Surya)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Sun, calcUtc, ayanamsa),
      isRetrograde: false,
    },
    {
      id: 'moon',
      nameTe: 'చంద్రుడు (Moon)',
      nameEn: 'Moon (Chandra)',
      lon: getSiderealMoonLongitude(calcUtc),
      isRetrograde: false,
    },
    {
      id: 'mars',
      nameTe: 'కుజుడు (Mars)',
      nameEn: 'Mars (Kuja)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Mars, calcUtc, ayanamsa),
      isRetrograde: checkBodyRetrograde(Astronomy.Body.Mars),
    },
    {
      id: 'mercury',
      nameTe: 'బుధుడు (Mercury)',
      nameEn: 'Mercury (Budha)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Mercury, calcUtc, ayanamsa),
      isRetrograde: checkBodyRetrograde(Astronomy.Body.Mercury),
    },
    {
      id: 'venus',
      nameTe: 'శుక్రుడు (Venus)',
      nameEn: 'Venus (Shukra)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Venus, calcUtc, ayanamsa),
      isRetrograde: checkBodyRetrograde(Astronomy.Body.Venus),
    },
  ];

  const prelimPlanets = rawBodies.map((b) => {
    const rIdx = (Math.floor(b.lon / 30) % 12) + 1;
    const rInfo = RASHI_LIST[rIdx - 1] || RASHI_LIST[0];
    const degInSign = b.lon % 30;
    const deg = Math.floor(degInSign);
    const min = Math.floor((degInSign - deg) * 60);
    const nakSpan = 360 / 27;
    const nakIdx = Math.floor(b.lon / nakSpan) % 27;
    const pada = (Math.floor((b.lon % nakSpan) / (nakSpan / 4)) % 4) + 1;
    const houseFromMoon = ((rIdx - moonRashi.index + 12) % 12) + 1;
    const isAuspiciousFromMoon = (AUSPICIOUS_HOUSES_FROM_MOON[b.id] || []).includes(houseFromMoon);
    const vedhaHouseFromMoon = isAuspiciousFromMoon
      ? VEDHA_HOUSE_MAP[b.id]?.[houseFromMoon] || null
      : null;

    return {
      id: b.id,
      nameTe: b.nameTe,
      nameEn: b.nameEn,
      siderealLon: Number(b.lon.toFixed(2)),
      rashiIndex: rIdx,
      rashiSlug: rInfo.slug,
      rashiNameTe: rInfo.nameTe,
      rashiNameEn: rInfo.nameEn,
      degreeInRashi: `${deg}° ${String(min).padStart(2, '0')}′`,
      nakshatraTe: NAKSHATRA_NAMES_TE[nakIdx] || 'అశ్విని',
      pada,
      houseFromMoon,
      isAuspiciousFromMoon,
      isRetrograde: b.isRetrograde,
      vedhaHouseFromMoon,
    };
  });

  const planets: PlanetTransitPosition[] = prelimPlanets.map((p) => {
    if (!p.isAuspiciousFromMoon || !p.vedhaHouseFromMoon) {
      return { ...p, hasVedha: false, vedhaByPlanetTe: null };
    }
    const obstructing = prelimPlanets.filter(
      (other) =>
        other.id !== p.id &&
        other.houseFromMoon === p.vedhaHouseFromMoon &&
        !isVedhaExempt(p.id, other.id)
    );
    return {
      ...p,
      hasVedha: obstructing.length > 0,
      vedhaByPlanetTe:
        obstructing.length > 0
          ? obstructing.map((o) => o.nameTe.split(' ')[0]).join(', ')
          : null,
    };
  });

  const satPos = planets.find((p) => p.id === 'saturn')!;
  const jupPos = planets.find((p) => p.id === 'jupiter')!;
  const rahPos = planets.find((p) => p.id === 'rahu')!;
  const ketPos = planets.find((p) => p.id === 'ketu')!;

  const satGuidance =
    (gocharaAuthorContent.saturnHouses as Record<string, HouseGuidanceItem>)[
      String(satPos.houseFromMoon)
    ] || (gocharaAuthorContent.saturnHouses as Record<string, HouseGuidanceItem>)['1'];
  const jupGuidance =
    (gocharaAuthorContent.jupiterHouses as Record<string, HouseGuidanceItem>)[
      String(jupPos.houseFromMoon)
    ] || (gocharaAuthorContent.jupiterHouses as Record<string, HouseGuidanceItem>)['1'];
  const rahGuidance =
    (gocharaAuthorContent.rahuKetuHouses as Record<string, HouseGuidanceItem>)[
      String(rahPos.houseFromMoon)
    ] || (gocharaAuthorContent.rahuKetuHouses as Record<string, HouseGuidanceItem>)['1'];
  const ketGuidance =
    (gocharaAuthorContent.rahuKetuHouses as Record<string, HouseGuidanceItem>)[
      String(ketPos.houseFromMoon)
    ] || (gocharaAuthorContent.rahuKetuHouses as Record<string, HouseGuidanceItem>)['1'];

  const isYelinatiShani = [12, 1, 2].includes(satPos.houseFromMoon);
  const sadeSatiStatusTe =
    satPos.houseFromMoon === 12
      ? 'ఏలినాటి శని మొదటి దశ (వ్యయ శని – 12వ స్థానం)'
      : satPos.houseFromMoon === 1
        ? 'ఏలినాటి శని రెండవ దశ (జన్మ శని – 1వ స్థానం)'
        : satPos.houseFromMoon === 2
          ? 'ఏలినాటి శని మూడవ దశ (పాద/కుటుంబ శని – 2వ స్థానం)'
          : satPos.houseFromMoon === 4
            ? 'అర్ధాష్టమ శని (4వ స్థానం – ఏలినాటి శని లేదు)'
            : satPos.houseFromMoon === 8
              ? 'అష్టమ శని (8వ స్థానం – ఏలినాటి శని లేదు)'
              : `ఏలినాటి శని లేదు (శని ${satPos.houseFromMoon}వ స్థానంలో సంచారం)`;

  return {
    computedAtIstIso,
    rashi: moonRashi,
    planets,
    saturn: { ...satPos, guidance: satGuidance },
    jupiter: { ...jupPos, guidance: jupGuidance },
    rahu: { ...rahPos, guidance: rahGuidance },
    ketu: { ...ketPos, guidance: ketGuidance },
    sadeSatiStatusTe,
    isYelinatiShani,
  };
}
