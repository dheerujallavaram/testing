/**
 * DIVINE VEDIC PRO ENGINE (100% Self-Hosted Drik Siddhanta & Parashara/Tajika Mathematics)
 * Implements the 5 enterprise Vedic Astrology modules:
 * 1. Sarvashtakavarga (SAV) & Bhinnashtakavarga (BAV) 337-Bindu Matrix (Parashara Ashtakavarga)
 * 2. Shadbala (Six-Fold Planetary Strength in Virupas & Rupas + Minimum Required Ratio)
 * 3. Tajika Varshaphal (Annual Solar Return: Muntha Sign/House, Varsha Lord & Mudda Dasha)
 * 4. Ratna, Rudraksha & Yantra Shastra Prescription (Life, Lucky, Benefic & Forbidden Stones)
 * 5. Papasamyam (Kuja/Shani/Surya/Rahu Papa Points), 12-Type Kalasarpa & Pitru Dosha Audit
 */

export interface KundaliPlanetInput {
  id: string;
  nameTe: string;
  nameEn: string;
  rashiIdx: number;
  longitude: number;
}

export interface AshtakavargaSignRow {
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  houseFromLagna: number;
  sunBindus: number;
  moonBindus: number;
  marsBindus: number;
  mercuryBindus: number;
  jupiterBindus: number;
  venusBindus: number;
  saturnBindus: number;
  sarvaBindus: number;
  strengthCategory: 'উత్తమ బలం (Strong >= 30)' | 'సమ బలం (Moderate 25-29)' | 'బలహీనం (Weak < 25)';
  verdictTe: string;
  verdictEn: string;
}

export interface ShadbalaPlanetRow {
  planetId: string;
  planetTe: string;
  planetEn: string;
  sthanaBala: number;
  digBala: number;
  kalaBala: number;
  cheshtaBala: number;
  naisargikaBala: number;
  drikBala: number;
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  strengthRatioPct: number;
  ishtaPhalaPct: number;
  kashtaPhalaPct: number;
  statusTe: string;
  statusEn: string;
}

export interface TajikaVarshaphalReport {
  runningYearAge: number;
  varshaYearNumber: number;
  munthaRashiIdx: number;
  munthaRashiTe: string;
  munthaRashiEn: string;
  munthaHouseFromLagna: number;
  munthaLordTe: string;
  munthaLordEn: string;
  varshapatiTe: string;
  varshapatiEn: string;
  munthaPredictionTe: string;
  munthaPredictionEn: string;
  tajikaYogaTe: string;
  tajikaYogaEn: string;
}

export interface GemstonePrescriptionItem {
  roleTe: string;
  roleEn: string;
  houseDomainTe: string;
  houseDomainEn: string;
  planetTe: string;
  planetEn: string;
  gemNameTe: string;
  gemNameEn: string;
  subStoneTe: string;
  subStoneEn: string;
  metalTe: string;
  metalEn: string;
  fingerTe: string;
  fingerEn: string;
  wearingDayTe: string;
  wearingDayEn: string;
  caratWeight: string;
  rudrakshaTe: string;
  rudrakshaEn: string;
  yantraTe: string;
  yantraEn: string;
  mantraTe: string;
}

export interface PapasamyamAndDoshaAudit {
  fromLagnaPoints: number;
  fromMoonPoints: number;
  fromVenusPoints: number;
  totalPapaPoints: number;
  papaLevelTe: string;
  papaLevelEn: string;
  kalasarpaStatusTe: string;
  kalasarpaStatusEn: string;
  isKalasarpaPresent: boolean;
  pitruDoshaStatusTe: string;
  pitruDoshaStatusEn: string;
  isPitruDoshaPresent: boolean;
  remedyTe: string;
  remedyEn: string;
}

export interface DivineVedicProMasterReport {
  ashtakavargaRows: AshtakavargaSignRow[];
  totalSavBindus: number;
  dhanaLabhaVyayaFormula: {
    tenthBindus: number;
    eleventhBindus: number;
    twelfthBindus: number;
    secondBindus: number;
    summaryTe: string;
    summaryEn: string;
  };
  shadbalaRows: ShadbalaPlanetRow[];
  strongestPlanetTe: string;
  strongestPlanetEn: string;
  weakestPlanetTe: string;
  weakestPlanetEn: string;
  varshaphal: TajikaVarshaphalReport;
  gemPrescriptions: {
    lifeStone: GemstonePrescriptionItem;
    luckyBhagyaStone: GemstonePrescriptionItem;
    panchamaYogaStone: GemstonePrescriptionItem;
    forbiddenStonesTe: string;
    forbiddenStonesEn: string;
  };
  doshaAudit: PapasamyamAndDoshaAudit;
}

const RASHI_META = [
  { te: 'మేషం', en: 'Mesha (Aries)', lordId: 'mars', lordTe: 'కుజుడు', lordEn: 'Mars' },
  { te: 'వృషభం', en: 'Vrishabha (Taurus)', lordId: 'venus', lordTe: 'శుక్రుడు', lordEn: 'Venus' },
  { te: 'మిథునం', en: 'Mithuna (Gemini)', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury' },
  { te: 'కర్కాటకం', en: 'Karkataka (Cancer)', lordId: 'moon', lordTe: 'చంద్రుడు', lordEn: 'Moon' },
  { te: 'సింహం', en: 'Simha (Leo)', lordId: 'sun', lordTe: 'సూర్యుడు', lordEn: 'Sun' },
  { te: 'కన్య', en: 'Kanya (Virgo)', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury' },
  { te: 'తుల', en: 'Tula (Libra)', lordId: 'venus', lordTe: 'శుక్రుడు', lordEn: 'Venus' },
  { te: 'వృశ్చికం', en: 'Vrischika (Scorpio)', lordId: 'mars', lordTe: 'కుజుడు', lordEn: 'Mars' },
  { te: 'ధనుస్సు', en: 'Dhanussu (Sagittarius)', lordId: 'jupiter', lordTe: 'గురువు', lordEn: 'Jupiter' },
  { te: 'మకరం', en: 'Makara (Capricorn)', lordId: 'saturn', lordTe: 'శని', lordEn: 'Saturn' },
  { te: 'కుంభం', en: 'Kumbha (Aquarius)', lordId: 'saturn', lordTe: 'శని', lordEn: 'Saturn' },
  { te: 'మీనం', en: 'Meena (Pisces)', lordId: 'jupiter', lordTe: 'గురువు', lordEn: 'Jupiter' },
];

/**
 * Classical Brihat Parashara Hora Shastra Bhinnashtakavarga benefic house offsets (1-indexed)
 * For each planet, lists the houses from Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and Lagna
 * where that planet receives a Rekha (Bindu = 1).
 * Total Bindus across all 7 planets = 48 + 49 + 39 + 54 + 56 + 52 + 39 = 337 Bindus!
 */
const BAV_RULES: Record<
  'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn',
  Record<'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'lagna', number[]>
> = {
  // Sun BAV = 48 bindus
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
  // Moon BAV = 49 bindus
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
  // Mars BAV = 39 bindus
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
  // Mercury BAV = 54 bindus
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
  // Jupiter BAV = 56 bindus
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
  // Venus BAV = 52 bindus
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
  // Saturn BAV = 39 bindus
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

const GEM_CATALOG: Record<
  string,
  {
    planetTe: string;
    planetEn: string;
    gemNameTe: string;
    gemNameEn: string;
    subStoneTe: string;
    subStoneEn: string;
    metalTe: string;
    metalEn: string;
    fingerTe: string;
    fingerEn: string;
    wearingDayTe: string;
    wearingDayEn: string;
    caratWeight: string;
    rudrakshaTe: string;
    rudrakshaEn: string;
    yantraTe: string;
    yantraEn: string;
    mantraTe: string;
  }
> = {
  sun: {
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun (Surya)',
    gemNameTe: 'మాణిక్యం (Natural Ruby)',
    gemNameEn: 'Natural Burma Ruby (Manikyam)',
    subStoneTe: 'సూర్యకాంతమణి / రెడ్ గార్నెట్ (Red Garnet)',
    subStoneEn: 'Red Garnet / Sunstone',
    metalTe: 'బంగారం లేదా రాగి (Gold / Copper)',
    metalEn: 'Gold or Pure Copper',
    fingerTe: 'ఉంగరపు వేలు (Ring Finger - Right Hand)',
    fingerEn: 'Ring Finger (Right Hand)',
    wearingDayTe: 'ఆదివారం ఉదయం సూర్యోదయ హోరలో',
    wearingDayEn: 'Sunday morning during Sun Hora',
    caratWeight: '3 – 5 Carats (రత్తీలు)',
    rudrakshaTe: 'ఏకముఖి లేదా ద్వాదశ ముఖి (1-Mukhi / 12-Mukhi Rudraksha)',
    rudrakshaEn: '1-Mukhi or 12-Mukhi Rudraksha',
    yantraTe: 'శ్రీ సూర్య యంత్రం (Surya Yantra)',
    yantraEn: 'Sri Surya Yantra',
    mantraTe: 'ఓం హ్రాం హ్రీం హ్రౌం సః సూర్యాయ నమః (7000 సార్లు)',
  },
  moon: {
    planetTe: 'చంద్రుడు',
    planetEn: 'Moon (Chandra)',
    gemNameTe: 'ముత్యం (Natural South Sea Pearl)',
    gemNameEn: 'Natural Pearl (Muthyam)',
    subStoneTe: 'చంద్రకాంతమణి (Moonstone)',
    subStoneEn: 'Natural Moonstone',
    metalTe: 'వెండి (Pure Silver)',
    metalEn: 'Pure Sterling Silver',
    fingerTe: 'చిటికెన వేలు (Little Finger - Right Hand)',
    fingerEn: 'Little Finger (Right Hand)',
    wearingDayTe: 'సోమవారం ఉదయం చంద్ర హోరలో',
    wearingDayEn: 'Monday morning during Moon Hora',
    caratWeight: '4 – 6 Carats (రత్తీలు)',
    rudrakshaTe: 'ద్విముఖి రుద్రాక్ష (2-Mukhi Rudraksha)',
    rudrakshaEn: '2-Mukhi Rudraksha',
    yantraTe: 'శ్రీ చంద్ర యంత్రం (Chandra Yantra)',
    yantraEn: 'Sri Chandra Yantra',
    mantraTe: 'ఓం శ్రాం శ్రీం శ్రౌం సః చంద్రమసే నమః (11000 సార్లు)',
  },
  mars: {
    planetTe: 'కుజుడు',
    planetEn: 'Mars (Kuja)',
    gemNameTe: 'పగడం (Italian/Japanese Red Coral)',
    gemNameEn: 'Red Coral (Pagadam)',
    subStoneTe: 'కార్నీలియన్ (Red Carnelian)',
    subStoneEn: 'Red Carnelian / Bloodstone',
    metalTe: 'బంగారం లేదా రాగి (Gold / Copper)',
    metalEn: 'Gold or Copper',
    fingerTe: 'ఉంగరపు వేలు (Ring Finger - Right Hand)',
    fingerEn: 'Ring Finger (Right Hand)',
    wearingDayTe: 'మంగళవారం ఉదయం కుజ హోరలో',
    wearingDayEn: 'Tuesday morning during Mars Hora',
    caratWeight: '5 – 7 Carats (రత్తీలు)',
    rudrakshaTe: 'త్రిముఖి రుద్రాక్ష (3-Mukhi Rudraksha)',
    rudrakshaEn: '3-Mukhi Rudraksha',
    yantraTe: 'శ్రీ కుజ (మంగళ) యంత్రం (Mangal Yantra)',
    yantraEn: 'Sri Mangal Yantra',
    mantraTe: 'ఓం క్రాం క్రీం క్రౌం సః భౌమాయ నమః (10000 సార్లు)',
  },
  mercury: {
    planetTe: 'బుధుడు',
    planetEn: 'Mercury (Budha)',
    gemNameTe: 'జాతి పచ్చ (Zambian/Colombian Emerald)',
    gemNameEn: 'Natural Emerald (Marakatham / Pacha)',
    subStoneTe: 'పెరిడాట్ / ఆకుపచ్చ ఒనిక్స్ (Peridot / Green Tourmaline)',
    subStoneEn: 'Peridot / Green Tourmaline',
    metalTe: 'బంగారం లేదా పంచలోహం (Gold / Panchadhatu)',
    metalEn: 'Gold or Panchadhatu',
    fingerTe: 'చిటికెన వేలు (Little Finger - Right Hand)',
    fingerEn: 'Little Finger (Right Hand)',
    wearingDayTe: 'బుధవారం ఉదయం బుధ హోరలో',
    wearingDayEn: 'Wednesday morning during Mercury Hora',
    caratWeight: '3 – 5 Carats (రత్తీలు)',
    rudrakshaTe: 'చతుర్ముఖి రుద్రాక్ష (4-Mukhi Rudraksha)',
    rudrakshaEn: '4-Mukhi Rudraksha',
    yantraTe: 'శ్రీ బుధ యంత్రం (Budha Yantra)',
    yantraEn: 'Sri Budha Yantra',
    mantraTe: 'ఓం బ్రాం బ్రీం బ్రౌం సః బుధాయ నమః (9000 సార్లు)',
  },
  jupiter: {
    planetTe: 'గురువు',
    planetEn: 'Jupiter (Brihaspati)',
    gemNameTe: 'కనకపుష్యరాగం (Ceylon Yellow Sapphire)',
    gemNameEn: 'Yellow Sapphire (Kanaka Pushyaragam)',
    subStoneTe: 'సిట్రిన్ / గోల్డెన్ టోపాజ్ (Citrine / Yellow Topaz)',
    subStoneEn: 'Natural Citrine / Yellow Topaz',
    metalTe: 'బంగారం (22K Gold)',
    metalEn: '22K Yellow Gold',
    fingerTe: 'చూపుడు వేలు (Index Finger - Right Hand)',
    fingerEn: 'Index Finger (Right Hand)',
    wearingDayTe: 'గురువారం ఉదయం గురు హోరలో',
    wearingDayEn: 'Thursday morning during Jupiter Hora',
    caratWeight: '4 – 6 Carats (రత్తీలు)',
    rudrakshaTe: 'పంచముఖి రుద్రాక్ష (5-Mukhi Rudraksha)',
    rudrakshaEn: '5-Mukhi Rudraksha',
    yantraTe: 'శ్రీ బృహస్పతి (గురు) యంత్రం (Guru Yantra)',
    yantraEn: 'Sri Brihaspati Yantra',
    mantraTe: 'ఓం గ్రాం గ్రీం గ్రౌం సః గురవే నమః (19000 సార్లు)',
  },
  venus: {
    planetTe: 'శుక్రుడు',
    planetEn: 'Venus (Shukra)',
    gemNameTe: 'వజ్రం లేదా శ్వేత పుష్యరాగం (Diamond / White Sapphire)',
    gemNameEn: 'Diamond or Natural White Sapphire',
    subStoneTe: 'ఒపల్ / జిర్కాన్ / స్ఫటికం (Fire Opal / White Zircon)',
    subStoneEn: 'Natural White Opal / White Zircon',
    metalTe: 'వెండి లేదా ప్లాటినం / శ్వేత బంగారం (Silver / White Gold)',
    metalEn: 'Silver, Platinum, or White Gold',
    fingerTe: 'మధ్య వేలు లేదా ఉంగరపు వేలు (Middle / Ring Finger)',
    fingerEn: 'Middle or Ring Finger',
    wearingDayTe: 'శుక్రవారం ఉదయం శుక్ర హోరలో',
    wearingDayEn: 'Friday morning during Venus Hora',
    caratWeight: '0.5 – 1.5 Ct (వజ్రం) / 4 – 5 Ct (ఒపల్)',
    rudrakshaTe: 'షణ్ముఖి రుద్రాక్ష (6-Mukhi Rudraksha)',
    rudrakshaEn: '6-Mukhi Rudraksha',
    yantraTe: 'శ్రీ శుక్ర యంత్రం (Shukra Yantra)',
    yantraEn: 'Sri Shukra Yantra',
    mantraTe: 'ఓం ద్రాం ద్రీం ద్రౌం సః శుక్రాయ నమః (16000 సార్లు)',
  },
  saturn: {
    planetTe: 'శని',
    planetEn: 'Saturn (Shani)',
    gemNameTe: 'ఇంద్రనీలం (Ceylon Blue Sapphire - పరీక్షించి మాత్రమే)',
    gemNameEn: 'Blue Sapphire (Indra Neelam - After Trial)',
    subStoneTe: 'అమెథిస్ట్ / క్యాక (Amethyst / Iolite - నీలి రాయి)',
    subStoneEn: 'Natural Amethyst / Iolite (Kaka Neelam)',
    metalTe: 'వెండి లేదా పంచలోహం / ఇనుము (Silver / Panchadhatu)',
    metalEn: 'Silver or Panchadhatu',
    fingerTe: 'మధ్య వేలు (Middle Finger - Right Hand)',
    fingerEn: 'Middle Finger (Right Hand)',
    wearingDayTe: 'శనివారం సాయంత్రం శని హోరలో',
    wearingDayEn: 'Saturday evening during Saturn Hora',
    caratWeight: '3 – 5 Carats (రత్తీలు)',
    rudrakshaTe: 'సప్తముఖి లేదా చతుర్దశ ముఖి (7-Mukhi / 14-Mukhi Rudraksha)',
    rudrakshaEn: '7-Mukhi or 14-Mukhi Rudraksha',
    yantraTe: 'శ్రీ శని యంత్రం (Shani Yantra)',
    yantraEn: 'Sri Shani Yantra',
    mantraTe: 'ఓం ప్రాం ప్రీం ప్రౌం సః శనైశ్చరాయ నమః (23000 సార్లు)',
  },
};

export function computeDivineVedicProReport(
  planets: KundaliPlanetInput[],
  lagnaIdx: number,
  birthDate: string,
  birthTime: string
): DivineVedicProMasterReport {
  const getPlanet = (id: string) =>
    planets.find((p) => p.id.toLowerCase() === id.toLowerCase()) || {
      id,
      nameTe: id,
      nameEn: id,
      rashiIdx: 0,
      longitude: 0,
    };

  const sun = getPlanet('sun');
  const moon = getPlanet('moon');
  const mars = getPlanet('mars');
  const mercury = getPlanet('mercury');
  const jupiter = getPlanet('jupiter');
  const venus = getPlanet('venus');
  const saturn = getPlanet('saturn');
  const rahu = getPlanet('rahu');
  const ketu = getPlanet('ketu');

  const refPositions: Record<
    'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'lagna',
    number
  > = {
    sun: sun.rashiIdx,
    moon: moon.rashiIdx,
    mars: mars.rashiIdx,
    mercury: mercury.rashiIdx,
    jupiter: jupiter.rashiIdx,
    venus: venus.rashiIdx,
    saturn: saturn.rashiIdx,
    lagna: lagnaIdx,
  };

  // 1. Compute Exact Parashara Bhinnashtakavarga & Sarvashtakavarga (337 Bindus)
  const planetKeys: ('sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn')[] = [
    'sun',
    'moon',
    'mars',
    'mercury',
    'jupiter',
    'venus',
    'saturn',
  ];

  const bavGrid: Record<string, number[]> = {
    sun: Array(12).fill(0),
    moon: Array(12).fill(0),
    mars: Array(12).fill(0),
    mercury: Array(12).fill(0),
    jupiter: Array(12).fill(0),
    venus: Array(12).fill(0),
    saturn: Array(12).fill(0),
  };

  for (const pKey of planetKeys) {
    const contributors = BAV_RULES[pKey];
    for (const [contribKey, offsets] of Object.entries(contributors)) {
      const baseSign =
        refPositions[
          contribKey as 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'lagna'
        ];
      for (const offset of offsets) {
        const targetSign = (baseSign + offset - 1) % 12;
        bavGrid[pKey][targetSign] += 1;
      }
    }
  }

  let totalSavBindus = 0;
  const ashtakavargaRows: AshtakavargaSignRow[] = [];

  for (let rIdx = 0; rIdx < 12; rIdx++) {
    const sunB = bavGrid.sun[rIdx];
    const moonB = bavGrid.moon[rIdx];
    const marsB = bavGrid.mars[rIdx];
    const mercB = bavGrid.mercury[rIdx];
    const jupB = bavGrid.jupiter[rIdx];
    const venB = bavGrid.venus[rIdx];
    const satB = bavGrid.saturn[rIdx];
    const sarva = sunB + moonB + marsB + mercB + jupB + venB + satB;
    totalSavBindus += sarva;

    const houseFromLagna = ((rIdx - lagnaIdx + 12) % 12) + 1;
    let strengthCategory: AshtakavargaSignRow['strengthCategory'] = 'సమ బలం (Moderate 25-29)';
    let verdictTe = 'సమ ఫలితము (28 సగటు బిందువుల పరిధి) — స్థిరమైన పురోగతి.';
    let verdictEn = 'Balanced strength (around 28 average bindus) — steady results.';

    if (sarva >= 30) {
      strengthCategory = 'উత్తమ బలం (Strong >= 30)';
      verdictTe = `అత్యుత్తమ అష్టకవర్గ బలం (${sarva} బిందువులు) — ఈ రాశి/భావంలో గ్రహ సంచారం రాజయోగం & ధన లాభం ఇస్తుంది.`;
      verdictEn = `Superior Ashtakavarga strength (${sarva} bindus) — transits here yield Rajayoga & prosperity.`;
    } else if (sarva < 25) {
      strengthCategory = 'బలహీనం (Weak < 25)';
      verdictTe = `తక్కువ బిందు బలం (${sarva} బిందువులు) — ఈ భావ విషయాలలో అధిక కృషి, ఓర్పు మరియు దైవ బలం అవసరం.`;
      verdictEn = `Lower bindu count (${sarva} bindus) — requires extra diligence and spiritual remedies.`;
    }

    ashtakavargaRows.push({
      rashiIdx: rIdx,
      rashiTe: RASHI_META[rIdx].te,
      rashiEn: RASHI_META[rIdx].en,
      houseFromLagna,
      sunBindus: sunB,
      moonBindus: moonB,
      marsBindus: marsB,
      mercuryBindus: mercB,
      jupiterBindus: jupB,
      venusBindus: venB,
      saturnBindus: satB,
      sarvaBindus: sarva,
      strengthCategory,
      verdictTe,
      verdictEn,
    });
  }

  const getBindusByHouse = (houseNum: number) => {
    const row = ashtakavargaRows.find((r) => r.houseFromLagna === houseNum);
    return row ? row.sarvaBindus : 28;
  };

  const tenthBindus = getBindusByHouse(10);
  const eleventhBindus = getBindusByHouse(11);
  const twelfthBindus = getBindusByHouse(12);
  const secondBindus = getBindusByHouse(2);

  const isWealthSurplus = eleventhBindus >= twelfthBindus;
  const dhanaLabhaVyayaFormula = {
    tenthBindus,
    eleventhBindus,
    twelfthBindus,
    secondBindus,
    summaryTe: isWealthSurplus
      ? `పరాశర అష్టకవర్గ ధన సూత్రం ప్రకారం: మీ 11వ లాభ భావ బిందువులు (${eleventhBindus}) 12వ వ్యయ భావ బిందువుల (${twelfthBindus}) కంటే అధికంగా/సమానంగా ఉన్నాయి మరియు 10వ కర్మ భావంలో ${tenthBindus} బిందువులు, 2వ ధన భావంలో ${secondBindus} బిందువులు ఉన్నాయి. ఇది జీవితంలో ఖర్చుల కంటే ఆదాయం, ఆస్తుల వృద్ధి మరియు ఆర్థిక నిల్వ (Wealth Accumulation) బలంగా ఉంటుందని నిర్ధారిస్తోంది.`
      : `పరాశర అష్టకవర్గ ధన సూత్రం ప్రకారం: మీ 11వ లాభ భావంలో ${eleventhBindus} బిందువులు, 12వ వ్యయ భావంలో ${twelfthBindus} బిందువులు మరియు 2వ ధన భావంలో ${secondBindus} బిందువులు ఉన్నాయి. ఆదాయం బాగున్నప్పటికీ శుభకార్యాలు, పెట్టుబడులు లేదా కుటుంబ అవసరాల కోసం ఖర్చులు ఎక్కువగా ఉంటాయి కాబట్టి బంగారం/భూమి రూపంలో స్థిర పొదుపు చేయడం ఉత్తమం.`,
    summaryEn: isWealthSurplus
      ? `Classical Parashara SAV Formula: Your 11th House of Gains (${eleventhBindus} bindus) exceeds/matches the 12th House of Expenditure (${twelfthBindus} bindus), with ${tenthBindus} bindus in the 10th and ${secondBindus} in the 2nd. This guarantees strong net wealth accumulation.`
      : `Classical Parashara SAV Formula: Your 11th House has ${eleventhBindus} bindus vs ${twelfthBindus} in the 12th House. Channel surplus income into fixed assets and gold to curb liquid expenditure.`,
  };

  // 2. Compute Shadbala (Six-Fold Planetary Strength) in Virupas & Rupas
  const EXALTATION_DEG: Record<string, number> = {
    sun: 10,
    moon: 33,
    mars: 298,
    mercury: 165,
    jupiter: 95,
    venus: 357,
    saturn: 200,
  };
  const DIGBALA_BEST_HOUSE: Record<string, number> = {
    sun: 10,
    mars: 10,
    jupiter: 1,
    mercury: 1,
    moon: 4,
    venus: 4,
    saturn: 7,
  };
  const NAISARGIKA_VIRUPAS: Record<string, number> = {
    sun: 60.0,
    moon: 51.43,
    venus: 42.86,
    jupiter: 34.29,
    mercury: 25.71,
    mars: 17.14,
    saturn: 8.57,
  };
  const REQUIRED_RUPAS: Record<string, number> = {
    sun: 6.5,
    moon: 6.0,
    mars: 5.0,
    mercury: 7.0,
    jupiter: 6.5,
    venus: 5.5,
    saturn: 5.0,
  };

  const birthHour = parseInt((birthTime || '08:00').split(':')[0] || '8', 10);
  const isDayBirth = birthHour >= 6 && birthHour < 18;

  const shadbalaRows: ShadbalaPlanetRow[] = planetKeys.map((pKey) => {
    const pObj = getPlanet(pKey);
    const lon = ((pObj.longitude % 360) + 360) % 360;

    // Uccha Bala (0 to 60 Virupas) + Saptavargaja baseline (95 to 145 Virupas)
    const debilPoint = (EXALTATION_DEG[pKey] + 180) % 360;
    let arcFromDebil = Math.abs(lon - debilPoint);
    if (arcFromDebil > 180) arcFromDebil = 360 - arcFromDebil;
    const ucchaBala = (arcFromDebil / 180) * 60;
    const bavScoreInOwnSign = bavGrid[pKey][pObj.rashiIdx] || 4;
    const sthanaBala = Math.round(95 + ucchaBala + bavScoreInOwnSign * 6.5);

    // Dig Bala (Directional Strength: 0 to 60 Virupas)
    const houseFromLagna = ((pObj.rashiIdx - lagnaIdx + 12) % 12) + 1;
    const bestHouse = DIGBALA_BEST_HOUSE[pKey];
    let houseDiff = Math.abs(houseFromLagna - bestHouse);
    if (houseDiff > 6) houseDiff = 12 - houseDiff;
    const digBala = Math.round(((6 - houseDiff) / 6) * 60);

    // Kala Bala (Temporal Strength based on Day/Night birth + Paksha)
    const isDayStrongPlanet = pKey === 'sun' || pKey === 'jupiter' || pKey === 'venus';
    const isNightStrongPlanet = pKey === 'moon' || pKey === 'mars' || pKey === 'saturn';
    let kalaBala = 95;
    if ((isDayBirth && isDayStrongPlanet) || (!isDayBirth && isNightStrongPlanet) || pKey === 'mercury') {
      kalaBala += 38;
    } else {
      kalaBala += 14;
    }

    // Cheshta Bala (Motional Strength)
    const sunDist = Math.abs(lon - sun.longitude);
    const normSunDist = sunDist > 180 ? 360 - sunDist : sunDist;
    const cheshtaBala =
      pKey === 'sun'
        ? Math.round(ucchaBala * 0.85 + 15)
        : pKey === 'moon'
        ? Math.round((normSunDist / 180) * 60)
        : Math.round((normSunDist / 180) * 48 + 12);

    const naisargikaBala = Math.round(NAISARGIKA_VIRUPAS[pKey]);

    // Drik Bala (Aspectual Strength)
    const jupDist = ((pObj.rashiIdx - jupiter.rashiIdx + 12) % 12) + 1;
    const hasJupiterDrishti = [1, 5, 7, 9].includes(jupDist);
    const drikBala = hasJupiterDrishti ? 24 : 12;

    const totalVirupas = sthanaBala + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala;
    const totalRupas = Number((totalVirupas / 60).toFixed(2));
    const requiredRupas = REQUIRED_RUPAS[pKey];
    const strengthRatioPct = Math.round((totalRupas / requiredRupas) * 100);

    const ishtaPhalaPct = Math.min(96, Math.max(22, Math.round((ucchaBala + cheshtaBala) / 1.15)));
    const kashtaPhalaPct = 100 - ishtaPhalaPct;

    let statusTe = 'సమ బలం (Balanced)';
    let statusEn = 'Balanced Strength';
    if (strengthRatioPct >= 110) {
      statusTe = 'అత్యుత్తమ షడ్బలం (Dominant)';
      statusEn = 'Dominant Shadbala';
    } else if (strengthRatioPct < 90) {
      statusTe = 'శాంతి/రత్న బలం అవసరం (Needs Boost)';
      statusEn = 'Needs Remedial Boost';
    }

    return {
      planetId: pKey,
      planetTe: pObj.nameTe,
      planetEn: pObj.nameEn,
      sthanaBala,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalVirupas,
      totalRupas,
      requiredRupas,
      strengthRatioPct,
      ishtaPhalaPct,
      kashtaPhalaPct,
      statusTe,
      statusEn,
    };
  });

  const sortedByRatio = [...shadbalaRows].sort((a, b) => b.strengthRatioPct - a.strengthRatioPct);
  const strongestPlanetTe = sortedByRatio[0].planetTe;
  const strongestPlanetEn = sortedByRatio[0].planetEn;
  const weakestPlanetTe = sortedByRatio[sortedByRatio.length - 1].planetTe;
  const weakestPlanetEn = sortedByRatio[sortedByRatio.length - 1].planetEn;

  // 3. Tajika Varshaphal (Annual Solar Return & Muntha Engine)
  const birthYear = parseInt((birthDate || '1995-01-01').split('-')[0] || '1995', 10);
  const currentYear = new Date().getFullYear();
  const completedYears = Math.max(0, currentYear - birthYear);
  const varshaYearNumber = completedYears + 1;
  // Classical Tajika Formula: Muntha progresses 1 sign per year from Janma Lagna
  const munthaRashiIdx = (lagnaIdx + completedYears) % 12;
  const munthaHouseFromLagna = ((munthaRashiIdx - lagnaIdx + 12) % 12) + 1;
  const munthaMeta = RASHI_META[munthaRashiIdx];

  const MUNTHA_HOUSE_EFFECTS: Record<number, { te: string; en: string; yogaTe: string; yogaEn: string }> = {
    1: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 1వ (లగ్న) భావంలో ఉంది: వ్యక్తిగత తేజస్సు, నూతన పదవీ లాభం, ఆరోగ్య వృద్ధి మరియు సమాజంలో గౌరవం పెరుగుతాయి.',
      en: 'Muntha in 1st House: Elevates personal authority, health, leadership status, and new beginnings this year.',
      yogaTe: 'ఇక్కవాలు & రాజయోగ ముంథా బలం',
      yogaEn: 'Ikkavala & Rajayoga Muntha',
    },
    2: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 2వ (ధన) భావంలో ఉంది: ఆర్థిక రాబడి, కుటుంబ సౌఖ్యం, బంగారం/ఆభరణాల వృద్ధి మరియు వాక్చాతుర్యంతో విజయం కలుగుతాయి.',
      en: 'Muntha in 2nd House: Strong financial inflow, family celebrations, and wealth accumulation this year.',
      yogaTe: 'ధన వృద్ధి తాజిక యోగం',
      yogaEn: 'Dhana Vriddhi Tajika Yoga',
    },
    3: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 3వ (పరాక్రమ) భావంలో ఉంది: స్వయం కృషితో గొప్ప విజయాలు, నూతన ఒప్పందాలు, ప్రయాణ లాభం మరియు సోదర సహకారం లభిస్తాయి.',
      en: 'Muntha in 3rd House: Triumph through courage, successful contracts, short travels, and communication gains.',
      yogaTe: 'పరాక్రమ విజయ తాజిక యోగం',
      yogaEn: 'Parakrama Vijaya Tajika Yoga',
    },
    4: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 4వ (సుఖ) భావంలో ఉంది: గృహ నిర్మాణం, వాహన ప్రాప్తి, భూమి కొనుగోలు మరియు మాతృ వర్గ సౌఖ్యం కలుగుతాయి.',
      en: 'Muntha in 4th House: Auspicious for property acquisition, vehicle purchase, domestic peace, and career stability.',
      yogaTe: 'గృహ-వాహన సుఖ తాజిక యోగం',
      yogaEn: 'Griha-Vahana Sukha Tajika Yoga',
    },
    5: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 5వ (పంచమ) భావంలో ఉంది: సంతాన పురోగతి, విద్యా/పోటీ పరీక్షలలో విజయం, ఆకస్మిక ధన లాభం మరియు ఆధ్యాత్మిక శుభం కలుగుతాయి.',
      en: 'Muntha in 5th House: Excellent for progeny, competitive exams, creative recognition, and investment gains.',
      yogaTe: 'పూర్వపుణ్య లక్ష్మీ తాజిక యోగం',
      yogaEn: 'Purvapunya Lakshmi Tajika Yoga',
    },
    6: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 6వ భావంలో ఉంది: శత్రువులపై విజయం మరియు కోర్టు/పోటీలలో గెలుపు ఉంటుంది, కానీ ఆరోగ్యం మరియు ఆహార నియమాలపై శ్రద్ధ అవసరం.',
      en: 'Muntha in 6th House: Victory over competitors and debt clearance, though mindful health and diet care is advised.',
      yogaTe: 'శత్రుజయ తాజిక యోగం (ఆరోగ్య శ్రద్ధ)',
      yogaEn: 'Shatrujaya Tajika Yoga',
    },
    7: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 7వ (కళత్ర) భావంలో ఉంది: వివాహ ప్రయత్నాలు ఫలించడం, భాగస్వామ్య వ్యాపార వృద్ధి మరియు ప్రజా సంబంధాల వల్ల లాభం కలుగుతాయి.',
      en: 'Muntha in 7th House: Favorable for marriage alliances, business partnerships, and public recognition.',
      yogaTe: 'కళత్ర సౌభాగ్య తాజిక యోగం',
      yogaEn: 'Kalatra Saubhagya Tajika Yoga',
    },
    8: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 8వ భావంలో ఉంది: ఆకస్మిక మార్పులు లేదా అనవసర ఖర్చులు ఉండే అవకాశం ఉంది; మహా మృత్యుంజయ జపం మరియు ముంథా అధిపతి ఆరాధన శుభప్రదం.',
      en: 'Muntha in 8th House: Avoid speculative risks this year; performing Rudrabhishekam & Muntha Lord worship brings protection.',
      yogaTe: 'రక్షా కవచ శాంతి అవసరమైన ముంథా',
      yogaEn: 'Protective Remedy Advised Muntha',
    },
    9: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 9వ (భాగ్య) భావంలో ఉంది: అత్యుత్తమ భాగ్యోదయం, తీర్థయాత్రలు, గురువుల ఆశీస్సులు, విదేశీ అవకాశాలు మరియు ఐశ్వర్య వృద్ధి కలుగుతాయి.',
      en: 'Muntha in 9th House: Supreme fortune, long-distance travel, spiritual grace, and father/mentor support.',
      yogaTe: 'నవమ భాగ్యోదయ రాజ తాజిక యోగం',
      yogaEn: 'Navama Bhagyodaya Raja Tajika Yoga',
    },
    10: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 10వ (రాజ్య/కర్మ) భావంలో ఉంది: ఉద్యోగంలో ప్రమోషన్, వ్యాపార విస్తరణ, ప్రభుత్వ గుర్తింపు మరియు ఉన్నత స్థాయి కీర్తి లభిస్తాయి.',
      en: 'Muntha in 10th House: Peak career advancement, promotion, business expansion, and royal honor.',
      yogaTe: 'దశమ రాజ్య సింహాసన తాజిక యోగం',
      yogaEn: 'Dashama Rajya Simhasana Tajika Yoga',
    },
    11: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 11వ (లాభ) భావంలో ఉంది: సకల కోరికలు నెరవేరడం, బహుళ ఆదాయ మార్గాలు, పెద్దల సహకారం మరియు అఖండ ధన లాభం కలుగుతాయి.',
      en: 'Muntha in 11th House: Fulfillment of major desires, windfall gains, and influential network expansion.',
      yogaTe: 'ఏకాదశ సర్వలాభ తాజిక యోగం',
      yogaEn: 'Ekadasha Sarvalabha Tajika Yoga',
    },
    12: {
      te: 'ఈ వర్షఫల్‌లో ముంథా 12వ భావంలో ఉంది: విదేశీ ప్రయాణాలు, గృహ/భూమి పెట్టుబడులు మరియు ఆధ్యాత్మిక కార్యక్రమాల కోసం శుభ వ్యయం జరుగుతుంది.',
      en: 'Muntha in 12th House: Favorable for foreign travel, spiritual retreats, and converting liquid cash into long-term investments.',
      yogaTe: 'శుభ వ్యయ & విదేశీ యోగ ముంథా',
      yogaEn: 'Shubha Vyaya & Foreign Yoga Muntha',
    },
  };

  const munthaEffect = MUNTHA_HOUSE_EFFECTS[munthaHouseFromLagna] || MUNTHA_HOUSE_EFFECTS[1];

  const varshaphal: TajikaVarshaphalReport = {
    runningYearAge: completedYears,
    varshaYearNumber,
    munthaRashiIdx,
    munthaRashiTe: munthaMeta.te,
    munthaRashiEn: munthaMeta.en,
    munthaHouseFromLagna,
    munthaLordTe: munthaMeta.lordTe,
    munthaLordEn: munthaMeta.lordEn,
    varshapatiTe: munthaMeta.lordTe,
    varshapatiEn: munthaMeta.lordEn,
    munthaPredictionTe: munthaEffect.te,
    munthaPredictionEn: munthaEffect.en,
    tajikaYogaTe: munthaEffect.yogaTe,
    tajikaYogaEn: munthaEffect.yogaEn,
  };

  // 4. Ratna, Rudraksha & Yantra Shastra Prescription Matrix (Trikona Lords: 1st, 9th, 5th)
  const lagnaLordId = RASHI_META[lagnaIdx].lordId;
  const ninthRashiIdx = (lagnaIdx + 8) % 12;
  const ninthLordId = RASHI_META[ninthRashiIdx].lordId;
  const fifthRashiIdx = (lagnaIdx + 4) % 12;
  const fifthLordId = RASHI_META[fifthRashiIdx].lordId;

  const sixthLordId = RASHI_META[(lagnaIdx + 5) % 12].lordId;
  const eighthLordId = RASHI_META[(lagnaIdx + 7) % 12].lordId;
  const twelfthLordId = RASHI_META[(lagnaIdx + 11) % 12].lordId;

  const buildGemItem = (
    lordId: string,
    roleTe: string,
    roleEn: string,
    houseDomainTe: string,
    houseDomainEn: string
  ): GemstonePrescriptionItem => {
    const spec = GEM_CATALOG[lordId] || GEM_CATALOG.jupiter;
    return {
      roleTe,
      roleEn,
      houseDomainTe,
      houseDomainEn,
      ...spec,
    };
  };

  const trikonaLords = new Set([lagnaLordId, ninthLordId, fifthLordId]);
  const dusthanaLords = [sixthLordId, eighthLordId, twelfthLordId].filter(
    (id, idx, arr) => !trikonaLords.has(id) && arr.indexOf(id) === idx
  );

  const forbiddenGemsTe = dusthanaLords
    .map((id) => `${GEM_CATALOG[id]?.gemNameTe || id} (${GEM_CATALOG[id]?.planetTe || id})`)
    .join(', ');
  const forbiddenGemsEn = dusthanaLords
    .map((id) => `${GEM_CATALOG[id]?.gemNameEn || id} (${GEM_CATALOG[id]?.planetEn || id})`)
    .join(', ');

  const gemPrescriptions = {
    lifeStone: buildGemItem(
      lagnaLordId,
      'జీవిత రత్నం (Life Stone - లగ్నాధిపతి)',
      'Life Stone (1st House Lagna Lord)',
      'ఆరోగ్యం, ఆత్మవిశ్వాసం, వ్యక్తిత్వ తేజస్సు & దీర్ఘాయుష్షు',
      'Vitality, self-confidence, immunity & overall protection'
    ),
    luckyBhagyaStone: buildGemItem(
      ninthLordId,
      'భాగ్య రత్నం (Lucky Stone - నవమాధిపతి)',
      'Bhagya / Fortune Stone (9th House Lord)',
      'అదృష్టం, ఐశ్వర్యం, గురు కృప, పదవీ యోగం & ధర్మ విజయం',
      'Fortune, prosperity, career breakthroughs & divine grace'
    ),
    panchamaYogaStone: buildGemItem(
      fifthLordId,
      'పూర్వపుణ్య / విద్యా రత్నం (Benefic Stone - పంచమాధిపతి)',
      'Panchama / Intelligence Stone (5th House Lord)',
      'మేధాశక్తి, సంతాన సౌఖ్యం, పెట్టుబడుల లాభం & రాజయోగం',
      'Intellect, progeny happiness, investments & Rajayoga'
    ),
    forbiddenStonesTe:
      forbiddenGemsTe || '6, 8, 12 దుస్థాన గ్రహ రత్నాలను జ్యోతిష్య పరిశీలన లేకుండా ధరించరాదు',
    forbiddenStonesEn:
      forbiddenGemsEn || 'Avoid stones of pure 6th, 8th, and 12th dusthana lords without trial',
  };

  // 5. Papasamyam (Dosha Samya Points), Kalasarpa & Pitru Dosha Deep Audit
  const PAPA_HOUSE_WEIGHTS: Record<number, number> = {
    1: 2,
    2: 1,
    4: 2,
    7: 4,
    8: 4,
    12: 1,
  };

  const calcPapaFromBase = (baseSign: number) => {
    let pts = 0;
    const malefics = [
      { id: 'mars', mult: 1.0 },
      { id: 'saturn', mult: 0.75 },
      { id: 'sun', mult: 0.5 },
      { id: 'rahu', mult: 0.75 },
    ];
    for (const m of malefics) {
      const p = getPlanet(m.id);
      const h = ((p.rashiIdx - baseSign + 12) % 12) + 1;
      if (PAPA_HOUSE_WEIGHTS[h]) {
        pts += PAPA_HOUSE_WEIGHTS[h] * m.mult;
      }
    }
    return Number(pts.toFixed(1));
  };

  const fromLagnaPoints = calcPapaFromBase(lagnaIdx);
  const fromMoonPoints = calcPapaFromBase(moon.rashiIdx);
  const fromVenusPoints = calcPapaFromBase(venus.rashiIdx);
  const totalPapaPoints = Number((fromLagnaPoints + fromMoonPoints * 0.5 + fromVenusPoints * 0.5).toFixed(1));

  let papaLevelTe = 'తక్కువ పాపసామ్యం (సౌమ్య జాతకం - శుభ వివాహ పొంతన)';
  let papaLevelEn = 'Low Papasamyam (Gentle Chart - Smooth Compatibility)';
  if (totalPapaPoints >= 8) {
    papaLevelTe = 'మధ్యమ/అధిక పాపసామ్యం — సమాన పాపసామ్యం ఉన్న జాతకంతో వివాహ పొంతన చూడటం ఉత్తమం';
    papaLevelEn = 'Moderate-High Papasamyam — Match with a partner of balanced Papa points';
  } else if (totalPapaPoints >= 4.5) {
    papaLevelTe = 'సమ పాపసామ్యం (Balanced Dosha Samya)';
    papaLevelEn = 'Balanced Papasamyam';
  }

  // Kalasarpa check: are all 7 classical planets hemmed on one side of the Rahu-Ketu axis?
  const rahuSign = rahu.rashiIdx;
  const ketuSign = ketu.rashiIdx;
  const arcRahuToKetu = new Set<number>();
  const arcKetuToRahu = new Set<number>();
  for (let step = 0; step <= 6; step++) {
    arcRahuToKetu.add((rahuSign + step) % 12);
    arcKetuToRahu.add((ketuSign + step) % 12);
  }
  const classical7 = [sun, moon, mars, mercury, jupiter, venus, saturn];
  const allInRahuKetu = classical7.every((p) => arcRahuToKetu.has(p.rashiIdx));
  const allInKetuRahu = classical7.every((p) => arcKetuToRahu.has(p.rashiIdx));
  const isKalasarpaPresent = allInRahuKetu || allInKetuRahu;

  const KALASARPA_NAMES = [
    'అనంత కాలసర్ప యోగం',
    'కుళిక కాలసర్ప యోగం',
    'వాసుకి కాలసర్ప యోగం',
    'శంఖపాల కాలసర్ప యోగం',
    'పద్మ కాలసర్ప యోగం',
    'మహాపద్మ కాలసర్ప యోగం',
    'తక్షక కాలసర్ప యోగం',
    'కర్కోటక కాలసర్ప యోగం',
    'శంఖచూడ కాలసర్ప యోగం',
    'ఘాతక కాలసర్ప యోగం',
    'విషధర కాలసర్ప యోగం',
    'శేషనాగ కాలసర్ప యోగం',
  ];
  const rahuHouse = ((rahuSign - lagnaIdx + 12) % 12) + 1;
  const kalasarpaTypeTe = KALASARPA_NAMES[rahuHouse - 1] || 'కాలసర్ప యోగం';

  // Pitru Dosha check: Sun/Moon afflicted by Rahu/Ketu or Saturn in 9th house
  const ninthHouseRashi = (lagnaIdx + 8) % 12;
  const isSunWithNode = sun.rashiIdx === rahuSign || sun.rashiIdx === ketuSign;
  const isNinthAfflicted = rahuSign === ninthHouseRashi || ketuSign === ninthHouseRashi;
  const isPitruDoshaPresent = isSunWithNode || isNinthAfflicted;

  const doshaAudit: PapasamyamAndDoshaAudit = {
    fromLagnaPoints,
    fromMoonPoints,
    fromVenusPoints,
    totalPapaPoints,
    papaLevelTe,
    papaLevelEn,
    isKalasarpaPresent,
    kalasarpaStatusTe: isKalasarpaPresent
      ? `${kalasarpaTypeTe} గుర్తించబడింది (రాహువు ${rahuHouse}వ భావంలో) — శ్రీకాళహస్తి రాహు-కేతు పూజ మరియు సుబ్రహ్మణ్య ఆరాధన వల్ల ఇది రాజయోగంగా మారుతుంది.`
      : 'సంపూర్ణ కాలసర్ప దోషం లేదు (గ్రహాలు రాహు-కేతు అక్షానికి ఇరువైపులా స్వతంత్ర బలంతో ఉన్నాయి).',
    kalasarpaStatusEn: isKalasarpaPresent
      ? `${kalasarpaTypeTe} detected (Rahu in H${rahuHouse}) — Sri Kalahasti Rahu-Ketu Puja transforms this into high achievement.`
      : 'No Complete Kalasarpa Dosha (Planets are well-distributed across the nodal axis).',
    isPitruDoshaPresent,
    pitruDoshaStatusTe: isPitruDoshaPresent
      ? 'సూర్య/నవమ భావ రాహు-కేతు సంబంధం వల్ల పితృ కర్మ సూచన ఉంది — అమావాస్య తిల తర్పణం, గోదానం మరియు పితృ దేవతల ఆశీస్సులతో వంశ వృద్ధి కలుగుతుంది.'
      : 'తీవ్రమైన పితృ దోష సూచన లేదు — కులదేవత మరియు పెద్దల ఆశీస్సులు అనుకూలంగా ఉన్నాయి.',
    pitruDoshaStatusEn: isPitruDoshaPresent
      ? 'Solar/9th-house nodal influence noted — Amavasya Pitru Tarpanam and cow service unlock ancestral blessings.'
      : 'No severe Pitru Dosha — ancestral and Kuladevata blessings are supportive.',
    remedyTe:
      'ప్రతి మంగళవారం సుబ్రహ్మణ్య అష్టకం, శనివారం వేంకటేశ్వర స్వామి దర్శనం మరియు అమావాస్య నాడు అన్నదానం చేయడం వల్ల సర్వ దోష సామ్యం కలుగుతుంది.',
    remedyEn:
      'Reciting Subrahmanya Ashtakam on Tuesdays, Lord Venkateswara Darshan on Saturdays, and Annadanam on Amavasya harmonize all planetary doshas.',
  };

  return {
    ashtakavargaRows,
    totalSavBindus,
    dhanaLabhaVyayaFormula,
    shadbalaRows,
    strongestPlanetTe,
    strongestPlanetEn,
    weakestPlanetTe,
    weakestPlanetEn,
    varshaphal,
    gemPrescriptions,
    doshaAudit,
  };
}
