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
}

export interface HouseGuidanceItem {
  placeholder: string;
  phaseTe: string;
  status: 'auspicious' | 'moderate' | 'cautious';
  summaryTe: string;
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
  const ayanamsa = getLahiriAyanamsa(calcUtc);
  const moonRashi = findRashiBySlug(rashiSlug);

  const rawBodies: {
    id: PlanetTransitPosition['id'];
    nameTe: string;
    nameEn: string;
    lon: number;
  }[] = [
    {
      id: 'saturn',
      nameTe: 'శని (Saturn)',
      nameEn: 'Saturn (Shani)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Saturn, calcUtc, ayanamsa),
    },
    {
      id: 'jupiter',
      nameTe: 'గురువు (Jupiter)',
      nameEn: 'Jupiter (Guru)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Jupiter, calcUtc, ayanamsa),
    },
    {
      id: 'rahu',
      nameTe: 'రాహువు (Rahu)',
      nameEn: 'Rahu (North Node)',
      lon: getMeanRahuSiderealLongitude(calcUtc, ayanamsa),
    },
    {
      id: 'ketu',
      nameTe: 'కేతువు (Ketu)',
      nameEn: 'Ketu (South Node)',
      lon: norm360(getMeanRahuSiderealLongitude(calcUtc, ayanamsa) + 180),
    },
    {
      id: 'sun',
      nameTe: 'రవి (Sun)',
      nameEn: 'Sun (Surya)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Sun, calcUtc, ayanamsa),
    },
    {
      id: 'moon',
      nameTe: 'చంద్రుడు (Moon)',
      nameEn: 'Moon (Chandra)',
      lon: getSiderealMoonLongitude(calcUtc),
    },
    {
      id: 'mars',
      nameTe: 'కుజుడు (Mars)',
      nameEn: 'Mars (Kuja)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Mars, calcUtc, ayanamsa),
    },
    {
      id: 'mercury',
      nameTe: 'బుధుడు (Mercury)',
      nameEn: 'Mercury (Budha)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Mercury, calcUtc, ayanamsa),
    },
    {
      id: 'venus',
      nameTe: 'శుక్రుడు (Venus)',
      nameEn: 'Venus (Shukra)',
      lon: getSiderealBodyLongitude(Astronomy.Body.Venus, calcUtc, ayanamsa),
    },
  ];

  const planets: PlanetTransitPosition[] = rawBodies.map((b) => {
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
