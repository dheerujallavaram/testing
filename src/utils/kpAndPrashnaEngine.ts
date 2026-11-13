import * as Astronomy from 'astronomy-engine';
import {
  KundaliPlanetDetail,
  getLahiriAyanamsa,
  getSiderealAscendant,
  getSiderealMoonLongitude,
  getSiderealPlanetLongitude,
  getSiderealRahuKetu,
  getSiderealSunLongitude,
  norm360,
} from './astronomyPanchangam';

export interface PlanetLordMeta {
  id: string;
  te: string;
  en: string;
  vimYears: number;
}

export const KP_VIMSHOTTARI_ORDER: PlanetLordMeta[] = [
  { id: 'ketu', te: 'కేతువు', en: 'Ketu', vimYears: 7 },
  { id: 'venus', te: 'శుక్రుడు', en: 'Venus', vimYears: 20 },
  { id: 'sun', te: 'సూర్యుడు', en: 'Sun', vimYears: 6 },
  { id: 'moon', te: 'చంద్రుడు', en: 'Moon', vimYears: 10 },
  { id: 'mars', te: 'కుజుడు', en: 'Mars', vimYears: 7 },
  { id: 'rahu', te: 'రాహువు', en: 'Rahu', vimYears: 18 },
  { id: 'jupiter', te: 'గురుడు', en: 'Jupiter', vimYears: 16 },
  { id: 'saturn', te: 'శని', en: 'Saturn', vimYears: 19 },
  { id: 'mercury', te: 'బుధుడు', en: 'Mercury', vimYears: 17 },
];

const RASHI_LORDS_KP: { rashiTe: string; rashiEn: string; lord: PlanetLordMeta }[] = [
  { rashiTe: 'మేషం', rashiEn: 'Aries', lord: KP_VIMSHOTTARI_ORDER[4] }, // Mars
  { rashiTe: 'వృషభం', rashiEn: 'Taurus', lord: KP_VIMSHOTTARI_ORDER[1] }, // Venus
  { rashiTe: 'మిథునం', rashiEn: 'Gemini', lord: KP_VIMSHOTTARI_ORDER[8] }, // Mercury
  { rashiTe: 'కర్కాటకం', rashiEn: 'Cancer', lord: KP_VIMSHOTTARI_ORDER[3] }, // Moon
  { rashiTe: 'సింహం', rashiEn: 'Leo', lord: KP_VIMSHOTTARI_ORDER[2] }, // Sun
  { rashiTe: 'కన్య', rashiEn: 'Virgo', lord: KP_VIMSHOTTARI_ORDER[8] }, // Mercury
  { rashiTe: 'తుల', rashiEn: 'Libra', lord: KP_VIMSHOTTARI_ORDER[1] }, // Venus
  { rashiTe: 'వృశ్చికం', rashiEn: 'Scorpio', lord: KP_VIMSHOTTARI_ORDER[4] }, // Mars
  { rashiTe: 'ధనుస్సు', rashiEn: 'Sagittarius', lord: KP_VIMSHOTTARI_ORDER[6] }, // Jupiter
  { rashiTe: 'మకరం', rashiEn: 'Capricorn', lord: KP_VIMSHOTTARI_ORDER[7] }, // Saturn
  { rashiTe: 'కుంభం', rashiEn: 'Aquarius', lord: KP_VIMSHOTTARI_ORDER[7] }, // Saturn
  { rashiTe: 'మీనం', rashiEn: 'Pisces', lord: KP_VIMSHOTTARI_ORDER[6] }, // Jupiter
];

const NAKSHATRA_27_TE = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష',
  'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనురాధ', 'జ్యేష్ఠ',
  'మూల', 'పూర్వాషాఢ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి',
];

const NAKSHATRA_27_EN = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushyami', 'Ashlesha',
  'Magha', 'Pubba', 'Uttara', 'Hasta', 'Chitta', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'Purvashadha', 'Uttarashadha', 'Shravanam', 'Dhanishtha', 'Shatabhisham', 'Purvabhadra', 'Uttarabhadra', 'Revati',
];

export interface KP249Slot {
  horaryNumber: number; // 1..249
  startLon: number;
  endLon: number;
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  signLord: PlanetLordMeta;
  nakshatraIdx: number;
  nakshatraTe: string;
  nakshatraEn: string;
  starLord: PlanetLordMeta;
  subLord: PlanetLordMeta;
  startDmsInSign: string;
}

function formatDmsInSign(lon: number): string {
  const inSign = ((lon % 30) + 30) % 30;
  const d = Math.floor(inSign);
  const mf = (inSign - d) * 60;
  const m = Math.floor(mf);
  const s = Math.min(59, Math.round((mf - m) * 60));
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

// Build authentic 249 Nakshatra Nadi Sub-Lord (KP-249) Horary Table across 0..360 deg
let cached249Table: KP249Slot[] | null = null;

export function getKP249Table(): KP249Slot[] {
  if (cached249Table) return cached249Table;

  const nakSpan = 360 / 27; // 13.333333... deg
  const slots: KP249Slot[] = [];
  let num = 1;

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const nakStart = nakIdx * nakSpan;
    const starLordOrderIdx = nakIdx % 9;
    const starLord = KP_VIMSHOTTARI_ORDER[starLordOrderIdx];
    let cursor = nakStart;

    for (let sOffset = 0; sOffset < 9; sOffset++) {
      const subLord = KP_VIMSHOTTARI_ORDER[(starLordOrderIdx + sOffset) % 9];
      const subSpan = (nakSpan * subLord.vimYears) / 120;
      const subEnd = cursor + subSpan;

      const startSign = Math.floor((cursor + 1e-9) / 30) % 12;
      const endSign = Math.floor((subEnd - 1e-9) / 30) % 12;

      if (startSign === endSign) {
        const rMeta = RASHI_LORDS_KP[startSign];
        slots.push({
          horaryNumber: num++,
          startLon: cursor,
          endLon: subEnd,
          rashiIdx: startSign,
          rashiTe: rMeta.rashiTe,
          rashiEn: rMeta.rashiEn,
          signLord: rMeta.lord,
          nakshatraIdx: nakIdx,
          nakshatraTe: NAKSHATRA_27_TE[nakIdx],
          nakshatraEn: NAKSHATRA_27_EN[nakIdx],
          starLord,
          subLord,
          startDmsInSign: formatDmsInSign(cursor),
        });
      } else {
        // Split at 30-degree Rashi boundary (this creates the classic 249 = 243 + 6 splits!)
        const boundary = endSign === 0 ? 360 : endSign * 30;
        const rMeta1 = RASHI_LORDS_KP[startSign];
        slots.push({
          horaryNumber: num++,
          startLon: cursor,
          endLon: boundary,
          rashiIdx: startSign,
          rashiTe: rMeta1.rashiTe,
          rashiEn: rMeta1.rashiEn,
          signLord: rMeta1.lord,
          nakshatraIdx: nakIdx,
          nakshatraTe: NAKSHATRA_27_TE[nakIdx],
          nakshatraEn: NAKSHATRA_27_EN[nakIdx],
          starLord,
          subLord,
          startDmsInSign: formatDmsInSign(cursor),
        });

        const rMeta2 = RASHI_LORDS_KP[endSign];
        slots.push({
          horaryNumber: num++,
          startLon: boundary,
          endLon: subEnd,
          rashiIdx: endSign,
          rashiTe: rMeta2.rashiTe,
          rashiEn: rMeta2.rashiEn,
          signLord: rMeta2.lord,
          nakshatraIdx: nakIdx,
          nakshatraTe: NAKSHATRA_27_TE[nakIdx],
          nakshatraEn: NAKSHATRA_27_EN[nakIdx],
          starLord,
          subLord,
          startDmsInSign: formatDmsInSign(boundary),
        });
      }

      cursor = subEnd;
    }
  }

  cached249Table = slots;
  return slots;
}

export function lookupKPByLongitude(lonDeg: number): KP249Slot {
  const norm = norm360(lonDeg);
  const table = getKP249Table();
  const found = table.find((slot) => norm >= slot.startLon - 1e-8 && norm < slot.endLon - 1e-8);
  return found || table[table.length - 1];
}

export function lookupKPByNumber(horaryNumber: number): KP249Slot {
  const table = getKP249Table();
  const clamped = Math.max(1, Math.min(table.length, Math.round(horaryNumber)));
  return table[clamped - 1];
}

export interface KPCuspRow {
  cuspNumber: number;
  bhavaTitleTe: string;
  bhavaTitleEn: string;
  longitude: number;
  dmsFormatted: string;
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  signLordTe: string;
  signLordEn: string;
  starLordTe: string;
  starLordEn: string;
  subLordTe: string;
  subLordEn: string;
  subLordId: string;
  significatorPlanetsTe: string;
  significatorPlanetsEn: string;
}

export interface KPPlanetRow {
  planetId: string;
  planetTe: string;
  planetEn: string;
  housePlaced: number;
  rashiTe: string;
  rashiEn: string;
  dmsFormatted: string;
  signLordTe: string;
  starLordTe: string;
  starLordEn: string;
  subLordTe: string;
  subLordEn: string;
  signifiedHouses: number[];
}

export interface KPLifePromise {
  domainTe: string;
  domainEn: string;
  cuspChecked: number;
  subLordTe: string;
  subLordEn: string;
  favorableHouses: number[];
  matchedHouses: number[];
  verdictTe: string;
  verdictEn: string;
  isStrong: boolean;
  summaryTe: string;
  summaryEn: string;
}

export interface KPFullReport {
  cusps: KPCuspRow[];
  planetsKP: KPPlanetRow[];
  promises: KPLifePromise[];
}

const BHAVA_NAMES_12: { te: string; en: string }[] = [
  { te: '1వ భావం (తను/లగ్న)', en: '1st Cusp (Self/Lagna)' },
  { te: '2వ భావం (ధన/కుటుంబ)', en: '2nd Cusp (Wealth/Family)' },
  { te: '3వ భావం (సోదర/పరాక్రమ)', en: '3rd Cusp (Efforts/Siblings)' },
  { te: '4వ భావం (మాతృ/గృహ)', en: '4th Cusp (Home/Assets)' },
  { te: '5వ భావం (సంతాన/బుద్ధి)', en: '5th Cusp (Children/Intellect)' },
  { te: '6వ భావం (ఉద్యోగ/రోగ)', en: '6th Cusp (Job/Service)' },
  { te: '7వ భావం (వివాహ/భాగస్వామ్య)', en: '7th Cusp (Marriage/Partner)' },
  { te: '8వ భావం (ఆయుః/పరివర్తన)', en: '8th Cusp (Longevity/Transform)' },
  { te: '9వ భావం (భాగ్య/ఉన్నత)', en: '9th Cusp (Fortune/Higher Edu)' },
  { te: '10వ భావం (కర్మ/రాజ్య)', en: '10th Cusp (Profession/Status)' },
  { te: '11వ భావం (లాభ/కార్యసిద్ధి)', en: '11th Cusp (Gains/Fulfillment)' },
  { te: '12వ భావం (వ్యయ/విదేశీ)', en: '12th Cusp (Expenses/Overseas)' },
];

function computeSiderealMidheaven(date: Date, lonDeg: number): number {
  const time = Astronomy.MakeTime(date);
  const gastHours = Astronomy.SiderealTime(time);
  const ramcDeg = norm360(gastHours * 15 + lonDeg);
  const ramcRad = (ramcDeg * Math.PI) / 180;
  const epsRad = (23.4392911 * Math.PI) / 180;

  // Tropical MC = atan2(sin(RAMC), cos(RAMC) * cos(eps))
  const y = Math.sin(ramcRad);
  const x = Math.cos(ramcRad) * Math.cos(epsRad);
  const mcTropical = norm360((Math.atan2(y, x) * 180) / Math.PI);
  const ayanamsa = getLahiriAyanamsa(date);
  return norm360(mcTropical - ayanamsa);
}

// Compute Sripati / Porphyry quadrant cusps (authentic unequal house cusps in Indian Jyotish)
export function computeQuadrantCusps(ascLon: number, mcLon: number): number[] {
  const c1 = norm360(ascLon);
  const c10 = norm360(mcLon);
  const c7 = norm360(c1 + 180);
  const c4 = norm360(c10 + 180);

  const arc10to1 = norm360(c1 - c10);
  const arc1to4 = norm360(c4 - c1);

  const c11 = norm360(c10 + arc10to1 / 3);
  const c12 = norm360(c10 + (2 * arc10to1) / 3);
  const c2 = norm360(c1 + arc1to4 / 3);
  const c3 = norm360(c1 + (2 * arc1to4) / 3);

  const c5 = norm360(c11 + 180);
  const c6 = norm360(c12 + 180);
  const c8 = norm360(c2 + 180);
  const c9 = norm360(c3 + 180);

  return [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12];
}

function getHouseFromCusps(lon: number, cusps: number[]): number {
  const norm = norm360(lon);
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    if (start < end) {
      if (norm >= start && norm < end) return i + 1;
    } else {
      if (norm >= start || norm < end) return i + 1;
    }
  }
  return 1;
}

export function computeKPReportForKundali(
  planets: KundaliPlanetDetail[],
  birthDate: string,
  birthTime: string,
  lat = 17.385,
  lon = 78.4867,
  tzOffsetHours = 5.5
): KPFullReport {
  const [yStr, mStr, dStr] = birthDate.split('-');
  const [hrStr, minStr] = birthTime.split(':');
  const utcMs =
    Date.UTC(
      Number(yStr) || 1994,
      (Number(mStr) || 8) - 1,
      Number(dStr) || 15,
      Number(hrStr) || 9,
      Number(minStr) || 30,
      0
    ) -
    tzOffsetHours * 3600 * 1000;
  const utcDate = new Date(utcMs);

  const ascLon = planets[0]?.longitude ?? getSiderealAscendant(utcDate, lat, lon);
  const mcLon = computeSiderealMidheaven(utcDate, lon);
  const cuspsDeg = computeQuadrantCusps(ascLon, mcLon);

  // Build Cusp Lords map (which house cusps each planet owns by Rashi)
  const housesOwnedByPlanet = new Map<string, number[]>();
  KP_VIMSHOTTARI_ORDER.forEach((p) => housesOwnedByPlanet.set(p.id, []));

  const cuspMetaList = cuspsDeg.map((deg, idx) => {
    const kpSlot = lookupKPByLongitude(deg);
    const ownerList = housesOwnedByPlanet.get(kpSlot.signLord.id) || [];
    ownerList.push(idx + 1);
    housesOwnedByPlanet.set(kpSlot.signLord.id, ownerList);
    return { cuspNum: idx + 1, deg, kpSlot };
  });

  // Actual planets (exclude Lagna at index 0)
  const actualPlanets = planets.filter((p) => p.id !== 'lagna');
  const planetKPPlacement = actualPlanets.map((p) => {
    const kpSlot = lookupKPByLongitude(p.longitude);
    const housePlaced = getHouseFromCusps(p.longitude, cuspsDeg);
    return {
      planet: p,
      kpSlot,
      housePlaced,
    };
  });

  // Map each planet's signified houses per KP ABCD rule:
  // Level A/B: House where starLord sits + houses owned by starLord;
  // Level C/D: House where planet itself sits + houses owned by planet.
  // Rahu/Ketu represent sign lord + planets conjoined/aspecting.
  const getDirectHouses = (planetId: string): number[] => {
    const found = planetKPPlacement.find((x) => x.planet.id === planetId);
    if (!found) return [];
    const set = new Set<number>([found.housePlaced, ...(housesOwnedByPlanet.get(planetId) || [])]);
    if (planetId === 'rahu' || planetId === 'ketu') {
      const signLordId = found.kpSlot.signLord.id;
      const signLordPlaced = planetKPPlacement.find((x) => x.planet.id === signLordId);
      if (signLordPlaced) set.add(signLordPlaced.housePlaced);
      (housesOwnedByPlanet.get(signLordId) || []).forEach((h) => set.add(h));
    }
    return Array.from(set).sort((a, b) => a - b);
  };

  const planetsKP: KPPlanetRow[] = planetKPPlacement.map(({ planet, kpSlot, housePlaced }) => {
    const starHouses = getDirectHouses(kpSlot.starLord.id);
    const ownHouses = getDirectHouses(planet.id);
    const allSignified = Array.from(new Set([...starHouses, ...ownHouses])).sort((a, b) => a - b);

    return {
      planetId: planet.id,
      planetTe: planet.nameTe,
      planetEn: planet.nameEn,
      housePlaced,
      rashiTe: kpSlot.rashiTe,
      rashiEn: kpSlot.rashiEn,
      dmsFormatted: `${kpSlot.rashiTe} ${formatDmsInSign(planet.longitude)}`,
      signLordTe: kpSlot.signLord.te,
      starLordTe: kpSlot.starLord.te,
      starLordEn: kpSlot.starLord.en,
      subLordTe: kpSlot.subLord.te,
      subLordEn: kpSlot.subLord.en,
      signifiedHouses: allSignified,
    };
  });

  const cusps: KPCuspRow[] = cuspMetaList.map(({ cuspNum, deg, kpSlot }) => {
    const signifs = planetsKP
      .filter((pkp) => pkp.signifiedHouses.includes(cuspNum))
      .map((pkp) => ({ te: pkp.planetTe, en: pkp.planetEn }));

    return {
      cuspNumber: cuspNum,
      bhavaTitleTe: BHAVA_NAMES_12[cuspNum - 1].te,
      bhavaTitleEn: BHAVA_NAMES_12[cuspNum - 1].en,
      longitude: deg,
      dmsFormatted: formatDmsInSign(deg),
      rashiIdx: kpSlot.rashiIdx,
      rashiTe: kpSlot.rashiTe,
      rashiEn: kpSlot.rashiEn,
      signLordTe: kpSlot.signLord.te,
      signLordEn: kpSlot.signLord.en,
      starLordTe: kpSlot.starLord.te,
      starLordEn: kpSlot.starLord.en,
      subLordTe: kpSlot.subLord.te,
      subLordEn: kpSlot.subLord.en,
      subLordId: kpSlot.subLord.id,
      significatorPlanetsTe: signifs.length > 0 ? signifs.map((s) => s.te).join(', ') : '—',
      significatorPlanetsEn: signifs.length > 0 ? signifs.map((s) => s.en).join(', ') : '—',
    };
  });

  // Evaluate 5 KP Life Promises via Cusp Sub-Lord's signified houses
  const evaluatePromise = (
    domainTe: string,
    domainEn: string,
    cuspIdx1Based: number,
    favorableHouses: number[],
    goodTextTe: string,
    goodTextEn: string,
    midTextTe: string,
    midTextEn: string
  ): KPLifePromise => {
    const cusp = cusps[cuspIdx1Based - 1];
    const subPlanet = planetsKP.find((p) => p.planetId === cusp.subLordId);
    const subSignifies = subPlanet?.signifiedHouses || [];
    const matched = favorableHouses.filter((h) => subSignifies.includes(h));
    const isStrong = matched.length >= 2 || subSignifies.includes(11);

    return {
      domainTe,
      domainEn,
      cuspChecked: cuspIdx1Based,
      subLordTe: cusp.subLordTe,
      subLordEn: cusp.subLordEn,
      favorableHouses,
      matchedHouses: matched,
      isStrong,
      verdictTe: isStrong ? 'బలమైన శుభ యోగం ✓' : matched.length === 1 ? 'మిశ్రమ / ప్రయత్న యోగం' : 'నిదాన ఫలితం',
      verdictEn: isStrong ? 'Strong KP Promise ✓' : matched.length === 1 ? 'Moderate / Effort-Driven' : 'Delayed / Remedies Advised',
      summaryTe: isStrong ? goodTextTe : midTextTe,
      summaryEn: isStrong ? goodTextEn : midTextEn,
    };
  };

  const promises: KPLifePromise[] = [
    evaluatePromise(
      'ఉద్యోగం & వృత్తి స్థిరత్వం',
      'Career & Promotion Promise',
      10,
      [2, 6, 10, 11],
      '10వ భావ సబ్‌లార్డ్ 2, 6, 10, 11 భావాలకు కారకత్వం వహించుట వలన స్థిరమైన ఉద్యోగ ఉన్నతి మరియు అధికార యోగం బలంగా ఉంది.',
      '10th Cusp Sub-Lord strongly signifies 2/6/10/11 houses, ensuring steady career advancement and recognition.',
      '10వ భావ సబ్‌లార్డ్ కారకత్వం మిశ్రమంగా ఉన్నందున క్రమబద్ధమైన నైపుణ్యంతో పదోన్నతి సిద్ధిస్తుంది.',
      '10th Cusp Sub-Lord yields results through persistent skill building and strategic timing.'
    ),
    evaluatePromise(
      'వివాహ & దాంపత్య సౌఖ్యం',
      'Marriage & Partnership Promise',
      7,
      [2, 7, 11],
      '7వ భావ సబ్‌లార్డ్ 2, 7, 11 భావాలను సూచించుట వలన సకాల వివాహం మరియు సత్సంబంధాలు సిద్ధిస్తాయి.',
      '7th Cusp Sub-Lord connects with 2/7/11 houses, confirming harmonious marriage fulfillment.',
      '7వ భావ సబ్‌లార్డ్ పాక్షిక అనుసంధానంతో జాతక పొంతన చూసి వివాహం నిశ్చయించడం శ్రేయస్కరం.',
      '7th Cusp Sub-Lord favors careful Kundali matching and auspicious Muhurtham selection.'
    ),
    evaluatePromise(
      'ధన సంపద & ఆదాయ వృద్ధి',
      'Finance & Wealth Gains',
      2,
      [2, 6, 11],
      '2వ భావ సబ్‌లార్డ్ 2, 6, 11 లాభ స్థానాలను సూచించుట వలన నిరంతర ధన ప్రవాహం & పొదుపు వృద్ధి కలదు.',
      '2nd Cusp Sub-Lord links with 2/6/11, creating reliable income and asset accumulation.',
      'ధన స్థాన సబ్‌లార్డ్ మిశ్రమ ఫలితాలిస్తున్నందున ఆర్థిక ప్రణాళికతో లాభాలు స్థిరపడతాయి.',
      '2nd Cusp Sub-Lord recommends disciplined savings and steady investment pacing.'
    ),
    evaluatePromise(
      'విదేశీ యానం & ఉన్నత విద్య',
      'Foreign Travel & Higher Education',
      9,
      [3, 9, 12],
      '9వ భావ సబ్‌లార్డ్ 3, 9, 12 స్థానాలతో బలంగా అనుసంధానమై విదేశీ విద్య / వీసా అనుకూలత ఇస్తోంది.',
      '9th Cusp Sub-Lord signifies 3/9/12 houses, supporting overseas travel, visa, and higher studies.',
      'ఉన్నత విద్యలో విజయం ఉన్నప్పటికీ విదేశీ ప్రయత్నాలకు దశా-అంతర్దశ సమయం చూసి ముందడుగు వేయాలి.',
      '9th Cusp Sub-Lord favors higher studies; foreign moves thrive during supportive Dasha-Bhukti.'
    ),
    evaluatePromise(
      'స్థిరాస్తి & గృహ-వాహన యోగం',
      'Property, Home & Vehicles',
      4,
      [4, 11, 12],
      '4వ భావ సబ్‌లార్డ్ 4, 11 భావాలకు కారకత్వం కలిగి ఉండటం వల్ల సొంత గృహం, భూమి & వాహన యోగం బలంగా ఉంది.',
      '4th Cusp Sub-Lord links with 4/11 houses, promising home ownership, land assets, and comfort.',
      'గృహ-భూమి వ్యవహారాలలో పత్రాల పరిశీలన మరియు శుభ ముహూర్త బలంతో లాభం కలుగుతుంది.',
      '4th Cusp Sub-Lord advises due diligence and Muhurtham alignment before property commitments.'
    ),
  ];

  return { cusps, planetsKP, promises };
}

// =========================================================================
// INSTANT HORARY PRASHNA KUNDALI (1 - 249 NUMBER + LIVE SIDEREAL TIME)
// =========================================================================
export type PrashnaTopicId = 'career' | 'marriage' | 'finance' | 'health' | 'abroad' | 'legal';

export interface PrashnaTopicMeta {
  id: PrashnaTopicId;
  labelTe: string;
  labelEn: string;
  targetHouses: number[];
  karakaId: string;
  karakaTe: string;
  karakaEn: string;
}

export const PRASHNA_TOPICS: PrashnaTopicMeta[] = [
  {
    id: 'career',
    labelTe: 'ఉద్యోగం / వ్యాపార విజయం',
    labelEn: 'Job, Business & Promotion',
    targetHouses: [2, 6, 10, 11],
    karakaId: 'sun',
    karakaTe: 'సూర్యుడు / శని',
    karakaEn: 'Sun / Saturn',
  },
  {
    id: 'marriage',
    labelTe: 'వివాహ ప్రయత్నం & పొంతన',
    labelEn: 'Marriage & Relationship',
    targetHouses: [2, 7, 11],
    karakaId: 'venus',
    karakaTe: 'శుక్రుడు / గురుడు',
    karakaEn: 'Venus / Jupiter',
  },
  {
    id: 'finance',
    labelTe: 'ఆర్థిక లాభం / రుణ విముక్తి',
    labelEn: 'Wealth Gain / Debt Relief',
    targetHouses: [2, 6, 11],
    karakaId: 'jupiter',
    karakaTe: 'గురుడు',
    karakaEn: 'Jupiter',
  },
  {
    id: 'abroad',
    labelTe: 'విదేశీ యానం / వీసా అనుమతి',
    labelEn: 'Foreign Travel / Visa',
    targetHouses: [3, 9, 12],
    karakaId: 'rahu',
    karakaTe: 'రాహువు / చంద్రుడు',
    karakaEn: 'Rahu / Moon',
  },
  {
    id: 'health',
    labelTe: 'ఆరోగ్య పునరుద్ధరణ',
    labelEn: 'Health & Recovery',
    targetHouses: [1, 5, 11],
    karakaId: 'sun',
    karakaTe: 'సూర్యుడు / చంద్రుడు',
    karakaEn: 'Sun / Moon',
  },
  {
    id: 'legal',
    labelTe: 'గృహ కొనుగోలు / కోర్టు విజయం',
    labelEn: 'Property / Legal Victory',
    targetHouses: [4, 6, 11],
    karakaId: 'mars',
    karakaTe: 'కుజుడు',
    karakaEn: 'Mars',
  },
];

export interface PrashnaResult {
  horaryNumber: number;
  topic: PrashnaTopicMeta;
  timestampDisplay: string;
  prashnaLagnaTe: string;
  prashnaLagnaEn: string;
  lagnaDms: string;
  lagnaSignLordTe: string;
  lagnaStarLordTe: string;
  lagnaSubLordTe: string;
  lagnaSubLordEn: string;
  moonRashiTe: string;
  moonRashiEn: string;
  moonNakshatraTe: string;
  moonNakshatraEn: string;
  moonHouseFromPrashna: number;
  subLordHouseFromPrashna: number;
  karakaHouseFromPrashna: number;
  score: number;
  verdictLevel: 'auspicious' | 'moderate' | 'remedy';
  verdictBadgeTe: string;
  verdictBadgeEn: string;
  summaryTe: string;
  summaryEn: string;
  timingTe: string;
  timingEn: string;
  remedyTe: string;
  remedyEn: string;
}

export function computeInstantPrashna(
  horaryNumber: number,
  topicId: PrashnaTopicId
): PrashnaResult {
  const slot = lookupKPByNumber(horaryNumber);
  const topic = PRASHNA_TOPICS.find((t) => t.id === topicId) || PRASHNA_TOPICS[0];

  const now = new Date();
  const sunLon = getSiderealSunLongitude(now);
  const moonLon = getSiderealMoonLongitude(now);
  const marsLon = getSiderealPlanetLongitude(Astronomy.Body.Mars, now);
  const mercLon = getSiderealPlanetLongitude(Astronomy.Body.Mercury, now);
  const jupLon = getSiderealPlanetLongitude(Astronomy.Body.Jupiter, now);
  const venLon = getSiderealPlanetLongitude(Astronomy.Body.Venus, now);
  const satLon = getSiderealPlanetLongitude(Astronomy.Body.Saturn, now);
  const { rahu, ketu } = getSiderealRahuKetu(now);

  const liveLongitudes: Record<string, number> = {
    sun: sunLon,
    moon: moonLon,
    mars: marsLon,
    mercury: mercLon,
    jupiter: jupLon,
    venus: venLon,
    saturn: satLon,
    rahu,
    ketu,
  };

  const moonRashiIdx = Math.floor(moonLon / 30) % 12;
  const moonNakIdx = Math.floor(moonLon / (360 / 27)) % 27;
  const moonHouse = ((moonRashiIdx - slot.rashiIdx + 12) % 12) + 1;

  const subLon = liveLongitudes[slot.subLord.id] ?? moonLon;
  const subRashiIdx = Math.floor(subLon / 30) % 12;
  const subLordHouse = ((subRashiIdx - slot.rashiIdx + 12) % 12) + 1;

  const karakaLon = liveLongitudes[topic.karakaId] ?? sunLon;
  const karakaRashiIdx = Math.floor(karakaLon / 30) % 12;
  const karakaHouse = ((karakaRashiIdx - slot.rashiIdx + 12) % 12) + 1;

  // Compute authentic Prashna score based on:
  // 1) Moon in Upachaya / Kendra / Trikona from Prashna Lagna (not in 6/8/12)
  // 2) Lagna Sub-Lord in favorable houses or topic houses
  // 3) Karaka placement & whether Moon/Sub-lord link to 11th (Fulfillment)
  let score = 52;
  if ([1, 3, 5, 7, 9, 10, 11].includes(moonHouse)) score += 16;
  else if ([2, 4].includes(moonHouse)) score += 9;
  else if ([6, 8, 12].includes(moonHouse)) score -= 14;

  if (topic.targetHouses.includes(subLordHouse)) score += 18;
  else if ([1, 5, 9, 10, 11].includes(subLordHouse)) score += 11;
  else if (subLordHouse === 8 || subLordHouse === 12) {
    if (topicId === 'abroad' && subLordHouse === 12) score += 14;
    else score -= 10;
  }

  if (topic.targetHouses.includes(karakaHouse) || [1, 5, 9, 10, 11].includes(karakaHouse)) {
    score += 12;
  }

  // Natural benefic Sub-Lord (Jupiter, Venus, Mercury, Moon) boosts Prashna success
  if (['jupiter', 'venus', 'moon', 'mercury'].includes(slot.subLord.id)) {
    score += 6;
  }

  score = Math.max(25, Math.min(96, score));

  const verdictLevel: 'auspicious' | 'moderate' | 'remedy' =
    score >= 70 ? 'auspicious' : score >= 52 ? 'moderate' : 'remedy';

  const istTimeStr = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const verdictBadgeTe =
    verdictLevel === 'auspicious'
      ? 'శుభ ఫలితం — కార్యసిద్ధి ✓'
      : verdictLevel === 'moderate'
      ? 'మిశ్రమం — కృషితో విజయం'
      : 'ఆలస్య సూచన — శాంతి పరిహారం అవసరం';

  const verdictBadgeEn =
    verdictLevel === 'auspicious'
      ? 'Auspicious — Success Indicated ✓'
      : verdictLevel === 'moderate'
      ? 'Moderate — Achievable With Effort'
      : 'Delayed — Remedies Recommended';

  const summaryTe =
    verdictLevel === 'auspicious'
      ? `ప్రశ్న సంఖ్య ${slot.horaryNumber} (${slot.rashiTe} లగ్నం · సబ్‌లార్డ్ ${slot.subLord.te}) ప్రస్తుతం ప్రశ్న లగ్నానికి ${subLordHouse}వ భావంలో ఉండి, చంద్రుడు ${moonHouse}వ భావంలో సంచరించుట వలన "${topic.labelTe}" సంకల్పం త్వరితగతిన శుభప్రదంగా నెరవేరుతుంది.`
      : verdictLevel === 'moderate'
      ? `ప్రశ్న లగ్నం ${slot.rashiTe} మరియు సబ్‌లార్డ్ ${slot.subLord.te} (${subLordHouse}వ స్థానం) మిశ్రమ బలం చూపుతున్నాయి. కొద్దిపాటి ఓపిక, శుభ ముహూర్త సమయ పాలనతో "${topic.labelTe}" కార్యం పూర్తవుతుంది.`
      : `ప్రస్తుత ప్రశ్న కాలంలో చంద్రుడు (${moonHouse}వ స్థానం) లేదా సబ్‌లార్డ్ ${slot.subLord.te} ప్రతికూల స్థితిలో ఉన్నందున ఆటంకాలు కనిపిస్తున్నాయి. సంబంధిత గ్రహ జపం మరియు శాంతి పూజతో మార్గం సుగమమవుతుంది.`;

  const summaryEn =
    verdictLevel === 'auspicious'
      ? `Horary #${slot.horaryNumber} (${slot.rashiEn} Lagna, Sub-Lord ${slot.subLord.en} in House ${subLordHouse}, Moon in House ${moonHouse}) strongly favors "${topic.labelEn}" with positive fulfillment.`
      : verdictLevel === 'moderate'
      ? `${slot.rashiEn} Prashna Lagna with Sub-Lord ${slot.subLord.en} shows balanced momentum for "${topic.labelEn}". Careful timing and consistent follow-through will bring success.`
      : `Moon (${moonHouse}H) and Sub-Lord ${slot.subLord.en} (${subLordHouse}H) show temporary obstacles for "${topic.labelEn}". Wait for a supportive Tarabalam day and perform targeted remedies.`;

  const timingTe =
    moonHouse <= 4 || subLordHouse <= 4
      ? 'త్వరలో ఫలితం: 2 నుండి 6 వారాలలోపు కీలక పురోగతి.'
      : moonHouse <= 8
      ? 'మధ్యమ కాలం: 1 నుండి 3 నెలలలోపు సానుకూల మార్పు.'
      : 'దీర్ఘకాలిక క్రమం: 3 నుండి 6 నెలలలో స్థిర సిద్ధి.';

  const timingEn =
    moonHouse <= 4 || subLordHouse <= 4
      ? 'Fast Fruition: Visible movement within 2 to 6 weeks.'
      : moonHouse <= 8
      ? 'Medium Horizon: Positive turn within 1 to 3 months.'
      : 'Steady Horizon: Grounded outcome within 3 to 6 months.';

  const remedyByLordTe: Record<string, string> = {
    sun: 'ఆదిత్య హృదయ పారాయణం & ఆదివారం గోధుమలు దానం శుభప్రదం.',
    moon: 'సోమవారం శివాభిషేకం లేదా అన్నదానం చేయడం వల్ల కార్యజయం.',
    mars: 'మంగళవారం సుబ్రహ్మణ్య అష్టకం పఠనం & కందుల దానం.',
    mercury: 'బుధవారం శ్రీ విష్ణు సహస్రనామ పారాయణం & పచ్చని పెసలు దానం.',
    jupiter: 'గురువారం దత్తాత్రేయ / బృహస్పతి స్మరణ & శనగల దానం.',
    venus: 'శుక్రవారం శ్రీ మహాలక్ష్మి అష్టోత్తరం & తెల్ల వస్త్ర దానం.',
    saturn: 'శనివారం హనుమాన్ చాలీసా 11 సార్లు & నువ్వుల దీపారాధన.',
    rahu: 'దుర్గా దేవికి రాహుకాలంలో నిమ్మకాయ దీపం & మినప దానం.',
    ketu: 'వినాయకునికి గరిక పూజ & కుక్కలకు ఆహారం పెట్టడం శుభం.',
  };

  const remedyByLordEn: Record<string, string> = {
    sun: 'Recite Aditya Hridayam on Sunday morning for authority & clarity.',
    moon: 'Perform Monday Shiva Abhishekam or donate white rice for peace.',
    mars: 'Chant Subrahmanya Ashtakam on Tuesday to remove obstacles.',
    mercury: 'Chant Vishnu Sahasranama on Wednesday for wise communication.',
    jupiter: 'Pray to Sri Dakshinamurthy / Dattatreya on Thursday for grace.',
    venus: 'Offer Mahalakshmi Ashtottaram on Friday with lotus/white flowers.',
    saturn: 'Chant Hanuman Chalisa on Saturday and light sesame oil lamp.',
    rahu: 'Offer Durga Pooja during Rahu Kalam to dissolve sudden delays.',
    ketu: 'Worship Lord Maha Ganapathi with Durva grass to clear blocks.',
  };

  return {
    horaryNumber: slot.horaryNumber,
    topic,
    timestampDisplay: istTimeStr,
    prashnaLagnaTe: slot.rashiTe,
    prashnaLagnaEn: slot.rashiEn,
    lagnaDms: slot.startDmsInSign,
    lagnaSignLordTe: slot.signLord.te,
    lagnaStarLordTe: slot.starLord.te,
    lagnaSubLordTe: slot.subLord.te,
    lagnaSubLordEn: slot.subLord.en,
    moonRashiTe: RASHI_LORDS_KP[moonRashiIdx].rashiTe,
    moonRashiEn: RASHI_LORDS_KP[moonRashiIdx].rashiEn,
    moonNakshatraTe: NAKSHATRA_27_TE[moonNakIdx],
    moonNakshatraEn: NAKSHATRA_27_EN[moonNakIdx],
    moonHouseFromPrashna: moonHouse,
    subLordHouseFromPrashna: subLordHouse,
    karakaHouseFromPrashna: karakaHouse,
    score,
    verdictLevel,
    verdictBadgeTe,
    verdictBadgeEn,
    summaryTe,
    summaryEn,
    timingTe,
    timingEn,
    remedyTe: remedyByLordTe[slot.subLord.id] || remedyByLordTe.jupiter,
    remedyEn: remedyByLordEn[slot.subLord.id] || remedyByLordEn.jupiter,
  };
}
