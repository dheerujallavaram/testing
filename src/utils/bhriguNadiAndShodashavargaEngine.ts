/**
 * BHRIGU NANDI NADI (1-5-9 TRINAL CIRCUITS), JAIMINI ISHTA DEVATA & SAPTA-VARGA (D1-D10) ENGINE
 * 100% Authentic Classical Parashara, Jaimini & Nadi Jyotisha Mathematics.
 */

import { KundaliJHoraMasterReport } from './jhoraAdvancedEngine';

export interface KundaliPlanetLike {
  id: string;
  nameTe: string;
  nameEn: string;
  rashiIdx: number;
  longitude: number;
  navamshaRashiIdx?: number;
  isRetrograde?: boolean;
}

export interface BhriguNadiCircuitItem {
  circuitNameTe: string;
  circuitNameEn: string;
  karakaPairTe: string;
  karakaPairEn: string;
  relationTe: string;
  relationEn: string;
  strengthBadgeTe: string;
  strengthBadgeEn: string;
  isStrongTrine: boolean;
  predictionTe: string;
  predictionEn: string;
}

export interface JaiminiIshtaAndMaritalProfile {
  atmakarakaTe: string;
  atmakarakaEn: string;
  karakamsaRashiTe: string;
  karakamsaRashiEn: string;
  twelfthFromKarakamsaTe: string;
  twelfthFromKarakamsaEn: string;
  ishtaDevataTe: string;
  ishtaDevataEn: string;
  ishtaReasonTe: string;
  ishtaReasonEn: string;
  upasanaMantraTe: string;
  darakarakaTe: string;
  darakarakaEn: string;
  upapadaRashiTe: string;
  upapadaRashiEn: string;
  maritalHarmonySummaryTe: string;
  maritalHarmonySummaryEn: string;
}

export interface SaptaVargaRow {
  planetId: string;
  nameTe: string;
  nameEn: string;
  d1RashiTe: string;
  d2HoraTe: string;
  d3DrekkanaTe: string;
  d4ChaturthamsaTe: string;
  d7SaptamsaTe: string;
  d9NavamshaTe: string;
  d10DasamshaTe: string;
  isVargottama: boolean;
  vargaStrengthCount: number; // out of 7 divisions in own/exalted/friend or Vargottama
  strengthGradeTe: string;
  strengthGradeEn: string;
}

export interface TrividhaRunaItem {
  runaTitleTe: string;
  runaTitleEn: string;
  statusTe: string;
  statusEn: string;
  isElevated: boolean;
  diagnosisTe: string;
  diagnosisEn: string;
  remedyTe: string;
  remedyEn: string;
}

export interface AvakahadaChakraProfile {
  varnaTe: string;
  varnaEn: string;
  vashyaTe: string;
  vashyaEn: string;
  yoniTe: string;
  yoniEn: string;
  ganaTe: string;
  ganaEn: string;
  nadiTe: string;
  nadiEn: string;
  payaTe: string;
  payaEn: string;
  rashiLordTe: string;
  rashiLordEn: string;
  nakshatraLordTe: string;
  nakshatraLordEn: string;
  namaksharaTe: string;
  tattvaTe: string;
  tattvaEn: string;
}

export interface BhriguNadiAndShodashavargaReport {
  avakahada: AvakahadaChakraProfile;
  bhriguCircuits: BhriguNadiCircuitItem[];
  jaiminiIshtaProfile: JaiminiIshtaAndMaritalProfile;
  saptaVargaRows: SaptaVargaRow[];
  vargottamaPlanetsTe: string[];
  vargottamaPlanetsEn: string[];
  trividhaRunas: TrividhaRunaItem[];
}

const RASHI_NAMES_TE = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
];

const RASHI_NAMES_EN = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karkataka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
  'Dhanussu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
];

const RASHI_LORDS = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter',
];

const EXALT_SIGNS: Record<string, number> = {
  sun: 0,
  moon: 1,
  mars: 9,
  mercury: 5,
  jupiter: 3,
  venus: 11,
  saturn: 6,
  rahu: 1,
  ketu: 7,
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

// Classical Parashara Divisional Calculations (D1, D2, D3, D4, D7, D9, D10)
export function computeDivisionalSigns(longitude: number): {
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  d7: number;
  d9: number;
  d10: number;
} {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30) % 12; // 0..11
  const degInSign = lon % 30;
  const isOdd = sign % 2 === 0; // Mesha(0), Mithuna(2), ... are odd signs

  // D2 Hora: Odd sign: 0-15° -> Simha(4), 15-30° -> Karkataka(3). Even: 0-15° -> Karkataka(3), 15-30° -> Simha(4)
  const firstHalf = degInSign < 15;
  const d2 = isOdd ? (firstHalf ? 4 : 3) : firstHalf ? 3 : 4;

  // D3 Drekkana: 0-10° -> same sign, 10-20° -> 5th (+4), 20-30° -> 9th (+8)
  const d3Part = Math.min(2, Math.floor(degInSign / 10));
  const d3 = (sign + d3Part * 4) % 12;

  // D4 Chaturthamsa: 0-7.5° -> same, 7.5-15° -> +3, 15-22.5° -> +6, 22.5-30° -> +9
  const d4Part = Math.min(3, Math.floor(degInSign / 7.5));
  const d4 = (sign + d4Part * 3) % 12;

  // D7 Saptamsa: Odd starts from same sign; Even starts from 7th (+6)
  const d7Part = Math.min(6, Math.floor((degInSign * 7) / 30));
  const d7 = ((isOdd ? sign : sign + 6) + d7Part) % 12;

  // D9 Navamsha: continuous 3°20' from Mesha(0)
  const d9 = Math.floor(lon / (360 / 108)) % 12;

  // D10 Dasamsha: Odd starts from same sign; Even starts from 9th (+8)
  const d10Part = Math.min(9, Math.floor((degInSign * 10) / 30));
  const d10 = ((isOdd ? sign : sign + 8) + d10Part) % 12;

  return { d1: sign, d2, d3, d4, d7, d9, d10 };
}

function getIshtaDeityByPlanet(planetId: string): {
  deityTe: string;
  deityEn: string;
  mantraTe: string;
} {
  switch (planetId) {
    case 'sun':
      return {
        deityTe: 'శ్రీ సూర్యనారాయణ / శ్రీ రామచంద్రమూర్తి / గాయత్రీ ఉపాసన',
        deityEn: 'Sri Surya Narayana / Sri Rama / Gayatri Upasana',
        mantraTe: 'ఓం నమో భగవతే రామచంద్రాయ • ఆదిత్య హృదయ పారాయణం',
      };
    case 'moon':
      return {
        deityTe: 'శ్రీ లలితా త్రిపురసుందరి / గౌరీ దేవి / శ్రీ కృష్ణ పరమాత్మ',
        deityEn: 'Sri Lalita Tripurasundari / Goddess Parvati / Sri Krishna',
        mantraTe: 'ఓం ఐం హ్రీం శ్రీం శ్రీమాత్రే నమః • లలితా సహస్రనామ పఠనం',
      };
    case 'mars':
      return {
        deityTe: 'శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి / శ్రీ నరసింహ స్వామి / హనుమాన్',
        deityEn: 'Lord Subrahmanya / Sri Narasimha Swamy / Hanuman',
        mantraTe: 'ఓం శరవణభవాయ నమః • ఉగ్రవీరం మహావిష్ణుం (నృసింహ కవచం)',
      };
    case 'mercury':
      return {
        deityTe: 'శ్రీ మహావిష్ణువు / శ్రీ వేంకటేశ్వర స్వామి / త్రిపుర సుందరి',
        deityEn: 'Sri Maha Vishnu / Lord Venkateswara',
        mantraTe: 'ఓం నమో వేంకటేశాయ • విష్ణు సహస్రనామ పారాయణం',
      };
    case 'jupiter':
      return {
        deityTe: 'శ్రీ దక్షిణామూర్తి / శ్రీ దత్తాత్రేయ స్వామి / శ్రీ వామన మూర్తి',
        deityEn: 'Sri Dakshinamurthy / Sri Dattatreya Swamy / Guru',
        mantraTe: 'ఓం ద్రాం దత్తాత్రేయాయ నమః • గురు చరిత్ర పారాయణం',
      };
    case 'venus':
      return {
        deityTe: 'శ్రీ మహాలక్ష్మీ దేవి / శ్రీ పద్మావతి అమ్మవారు / పరశురామ',
        deityEn: 'Goddess Mahalakshmi / Sri Padmavati Devi',
        mantraTe: 'ఓం శ్రీం హ్రీం క్లీం మహాలక్ష్మ్యై నమః • శ్రీ సూక్త పఠనం',
      };
    case 'saturn':
      return {
        deityTe: 'శ్రీ మహాకాళేశ్వర శివయ్య / శ్రీ వేంకటేశ్వరుడు / ఆంజనేయ స్వామి',
        deityEn: 'Lord Shiva (Mahakaleshwar) / Hanuman / Lord Venkateswara',
        mantraTe: 'ఓం నమః శివాయ • శ్రీ హనుమాన్ చాలీసా నిత్య పఠనం',
      };
    case 'rahu':
      return {
        deityTe: 'శ్రీ కనకదుర్గమ్మ వారు / శ్రీ వారాహి దేవి / శేష శయన విష్ణువు',
        deityEn: 'Goddess Durga / Sri Varahi Devi / Shesha Vishnu',
        mantraTe: 'ఓం దుం దుర్గాయై నమః • చండీ సప్తశతి శ్లోక పఠనం',
      };
    case 'ketu':
    default:
      return {
        deityTe: 'శ్రీ మహాగణపతి / శ్రీ దత్తాత్రేయ / మత్స్యావతార మూర్తి',
        deityEn: 'Sri Maha Ganapathi / Matsya Vishnu / Moksha Datta',
        mantraTe: 'ఓం గం గణపతయే నమః • సంకటనాశన గణేశ స్తోత్రం',
      };
  }
}

export function computeBhriguNadiAndShodashavargaReport(
  planets: KundaliPlanetLike[],
  lagnaIdx: number,
  jhoraMaster: KundaliJHoraMasterReport
): BhriguNadiAndShodashavargaReport {
  const byId: Record<string, KundaliPlanetLike> = {};
  for (const p of planets) byId[p.id] = p;

  const evalTrineDistance = (aIdx: number, bIdx: number) => {
    const diff = (bIdx - aIdx + 12) % 12;
    if (diff === 0) return { labelTe: 'యుతి (1-1 సంయోగం)', labelEn: 'Conjunction (1-1)', isTrine: true };
    if (diff === 4) return { labelTe: 'పంచమ త్రికోణం (1-5 సంబంధం)', labelEn: '5th Trine (1-5)', isTrine: true };
    if (diff === 8) return { labelTe: 'నవమ త్రికోణం (1-9 సంబంధం)', labelEn: '9th Trine (1-9)', isTrine: true };
    if (diff === 1) return { labelTe: 'ద్వితీయ స్థాన సంయోగం (1-2 ఫలం)', labelEn: 'Next Sign Flow (1-2)', isTrine: false };
    if (diff === 6) return { labelTe: 'సమసప్తక దృష్టి (1-7 సంబంధం)', labelEn: '7th Opposition Aspect (1-7)', isTrine: true };
    return { labelTe: `${diff + 1}వ స్థాన గోచర బంధం`, labelEn: `${diff + 1}th Sign Link`, isTrine: false };
  };

  const shani = byId.saturn;
  const guru = byId.jupiter;
  const shukra = byId.venus;
  const budha = byId.mercury;
  const surya = byId.sun;
  const kuja = byId.mars;
  const chandra = byId.moon;
  const rahu = byId.rahu;
  const ketu = byId.ketu;

  // 1. Bhrigu Nandi Nadi 1-5-9 Circuits
  const bhriguCircuits: BhriguNadiCircuitItem[] = [];

  if (shani && guru) {
    const rel = evalTrineDistance(guru.rashiIdx, shani.rashiIdx);
    bhriguCircuits.push({
      circuitNameTe: '1. జీవ-కర్మ నాడి సర్క్యూట్ (గురు + శని)',
      circuitNameEn: '1. Jeeva-Karma Nadi Circuit (Jupiter + Saturn)',
      karakaPairTe: `జీవకారక గురువు (${RASHI_NAMES_TE[guru.rashiIdx]}) ↔ కర్మకారక శని (${RASHI_NAMES_TE[shani.rashiIdx]})`,
      karakaPairEn: `Jeeva Guru (${RASHI_NAMES_EN[guru.rashiIdx]}) ↔ Karma Shani (${RASHI_NAMES_EN[shani.rashiIdx]})`,
      relationTe: rel.labelTe,
      relationEn: rel.labelEn,
      strengthBadgeTe: rel.isTrine ? 'ధర్మ-కర్మాధిపతి నాడి యోగం ✓' : 'పరిశ్రమ ద్వారా వృత్తి ఫలం',
      strengthBadgeEn: rel.isTrine ? 'Dharma-Karma Nadi Yoga ✓' : 'Effort-Driven Career Flow',
      isStrongTrine: rel.isTrine,
      predictionTe: rel.isTrine
        ? 'భృగు నంది నాడి ప్రకారం జీవుడు (గురువు), కర్మ (శని) ఒకే త్రికోణంలో/సమసప్తకంలో ఉండటంతో జాతకునికి వృత్తిలో గౌరవం, దీర్ఘకాలిక స్థిరత్వం మరియు స్వయంకృషితో ఉన్నత పదవి లభిస్తాయి.'
        : 'వృత్తి రంగంలో స్వతంత్ర నిర్ణయాల ద్వారా నిదానంగా స్థిరత్వం ఏర్పడుతుంది. గురువు యొక్క 5-9వ స్థాన రాశులలో ఉన్న గ్రహాల ద్వారా వృత్తి మార్గదర్శకత్వం కలుగుతుంది.',
      predictionEn: rel.isTrine
        ? 'In Bhrigu Nandi Nadi, a trinal or direct link between Jeeva (Jupiter) and Karma (Saturn) bestows lasting career dignity, righteous leadership, and progressive growth.'
        : 'Professional status rises steadily through disciplined self-effort; Jupiterian and Saturnian transits trigger career milestones every 2.5 years.',
    });
  }

  if (shukra && shani) {
    const rel = evalTrineDistance(shukra.rashiIdx, shani.rashiIdx);
    const mercRel = budha ? evalTrineDistance(shukra.rashiIdx, budha.rashiIdx) : null;
    bhriguCircuits.push({
      circuitNameTe: '2. ధన-లక్ష్మీ నాడి సర్క్యూట్ (శుక్ర + శని/బుధ)',
      circuitNameEn: '2. Dhana-Lakshmi Nadi Circuit (Venus + Saturn/Mercury)',
      karakaPairTe: `సంపద శుక్రుడు (${RASHI_NAMES_TE[shukra.rashiIdx]}) ↔ కర్మ శని (${RASHI_NAMES_TE[shani.rashiIdx]})`,
      karakaPairEn: `Wealth Venus (${RASHI_NAMES_EN[shukra.rashiIdx]}) ↔ Saturn (${RASHI_NAMES_EN[shani.rashiIdx]})`,
      relationTe: rel.labelTe + (mercRel?.isTrine ? ' + బుధ త్రికోణం' : ''),
      relationEn: rel.labelEn + (mercRel?.isTrine ? ' + Mercury Trine' : ''),
      strengthBadgeTe: rel.isTrine || mercRel?.isTrine ? 'భృగు-లక్ష్మీ ధన సర్క్యూట్ ✓' : 'నిరంతర ఆర్థిక ప్రణాళిక',
      strengthBadgeEn: rel.isTrine || mercRel?.isTrine ? 'Bhrigu-Lakshmi Wealth Link ✓' : 'Structured Wealth Growth',
      isStrongTrine: rel.isTrine || Boolean(mercRel?.isTrine),
      predictionTe: rel.isTrine
        ? 'శుక్ర-శని నాడి సంబంధం వల్ల వివాహానంతరం మరియు మధ్య వయస్సులో స్థిరాస్తులు, గృహ-వాహన యోగాలు, బ్యాంకు నిల్వలు అంచెలంచెలుగా వృద్ధి చెందుతాయి.'
        : 'ఆర్థిక వనరులు వాణిజ్య, సలహా లేదా సేవా రంగాల ద్వారా చేకూరుతాయి; పొదుపు, స్థిరాస్తి పెట్టుబడులపై దృష్టి పెడితే అపార సంపద నిలుస్తుంది.',
      predictionEn: rel.isTrine
        ? 'Venus-Saturn trinal synergy in Nadi signifies enduring asset accumulation, real-estate comfort, and notable financial rise post-marriage.'
        : 'Income flows consistently through commercial skill and structured investments; disciplined long-term asset planning yields solid abundance.',
    });
  }

  if (surya && guru) {
    const rel = evalTrineDistance(surya.rashiIdx, guru.rashiIdx);
    bhriguCircuits.push({
      circuitNameTe: '3. పితృ-రాజసన్మాన నాడి సర్క్యూట్ (రవి + గురు)',
      circuitNameEn: '3. Lineage & Authority Nadi Circuit (Sun + Jupiter)',
      karakaPairTe: `ఆత్మ రవి (${RASHI_NAMES_TE[surya.rashiIdx]}) ↔ గురువు (${RASHI_NAMES_TE[guru.rashiIdx]})`,
      karakaPairEn: `Sun (${RASHI_NAMES_EN[surya.rashiIdx]}) ↔ Jupiter (${RASHI_NAMES_EN[guru.rashiIdx]})`,
      relationTe: rel.labelTe,
      relationEn: rel.labelEn,
      strengthBadgeTe: rel.isTrine ? 'శివ-గురు రాజతేజస్సు ✓' : 'స్వతంత్ర వ్యక్తిత్వం',
      strengthBadgeEn: rel.isTrine ? 'Royal Authority Trine ✓' : 'Independent Leadership',
      isStrongTrine: rel.isTrine,
      predictionTe: rel.isTrine
        ? 'సూర్య-గురు సంబంధం వంశ ప్రతిష్ఠను, ప్రభుత్వ/ఉన్నతాధికారుల మద్దతును మరియు సంఘంలో గౌరవప్రదమైన కీర్తిని ప్రసాదిస్తుంది.'
        : 'తండ్రి లేదా గురువుల నుండి పొందే సంస్కారం మీకు జీవన మార్గంలో అండగా నిలుస్తుంది; ఆదిత్య హృదయ పారాయణం ఆత్మతేజస్సును మరింత పెంచుతుంది.',
      predictionEn: rel.isTrine
        ? 'Sun-Jupiter Nadi connection confers family prestige, ethical leadership, and support from senior authorities.'
        : 'Personal integrity and mentorship guidance shape high reputation; solar discipline amplifies authority.',
    });
  }

  if (kuja && shukra) {
    const rel = evalTrineDistance(kuja.rashiIdx, shukra.rashiIdx);
    bhriguCircuits.push({
      circuitNameTe: '4. దాంపత్య-భాగ్య నాడి సర్క్యూట్ (కుజ + శుక్ర)',
      circuitNameEn: '4. Harmony & Drive Nadi Circuit (Mars + Venus)',
      karakaPairTe: `కుజుడు (${RASHI_NAMES_TE[kuja.rashiIdx]}) ↔ శుక్రుడు (${RASHI_NAMES_TE[shukra.rashiIdx]})`,
      karakaPairEn: `Mars (${RASHI_NAMES_EN[kuja.rashiIdx]}) ↔ Venus (${RASHI_NAMES_EN[shukra.rashiIdx]})`,
      relationTe: rel.labelTe,
      relationEn: rel.labelEn,
      strengthBadgeTe: rel.isTrine ? 'కళా-పరాక్రమ యోగం' : 'సహజీవన సామరస్యం',
      strengthBadgeEn: rel.isTrine ? 'Creative Passion Yoga' : 'Balanced Partnership',
      isStrongTrine: rel.isTrine,
      predictionTe: rel.isTrine
        ? 'కుజ-శుక్ర నాడి బంధం జాతకునికి ఆకర్షణీయమైన వ్యక్తిత్వం, కృషిలో వేగం మరియు జీవిత భాగస్వామితో బలమైన అనుబంధాన్ని కలిగిస్తుంది.'
        : 'దాంపత్య మరియు భాగస్వామ్య వ్యవహారాలలో సహనం, స్పష్టమైన సంభాషణ పాటించడం వల్ల శాశ్వత సుఖసంతోషాలు నెలకొంటాయి.',
      predictionEn: rel.isTrine
        ? 'Mars-Venus Nadi alignment energizes artistic creativity, entrepreneurial speed, and deep mutual attraction in marriage.'
        : 'Balanced temperament and thoughtful communication foster enduring harmony in marital and business partnerships.',
    });
  }

  // 2. Jaimini Ishta Devata & Marital Synthesis
  const akItem = jhoraMaster.charaKarakas.find((k) => k.karakaCode === 'AK') || jhoraMaster.charaKarakas[0];
  const dkItem = jhoraMaster.charaKarakas.find((k) => k.karakaCode === 'DK') || jhoraMaster.charaKarakas[jhoraMaster.charaKarakas.length - 1];
  const akPlanet =
    planets.find((p) => p.nameTe === akItem?.planetTe) ||
    planets.find((p) => p.id === 'sun') ||
    planets[1];
  const akDiv = computeDivisionalSigns(akPlanet?.longitude ?? 45);
  const karakamsaIdx = akDiv.d9;
  const twelfthFromKarakamsaIdx = (karakamsaIdx + 11) % 12;

  const planetsIn12thFromK = planets.filter(
    (p) => p.id !== 'lagna' && computeDivisionalSigns(p.longitude).d9 === twelfthFromKarakamsaIdx
  );
  const determiningPlanetId =
    planetsIn12thFromK.length > 0
      ? planetsIn12thFromK[0].id
      : RASHI_LORDS[twelfthFromKarakamsaIdx] || 'jupiter';

  const ishtaInfo = getIshtaDeityByPlanet(determiningPlanetId);
  const ishtaReasonTe =
    planetsIn12thFromK.length > 0
      ? `ఆత్మకారకుడు ${akItem?.planetTe} నవాంశ (కారకాంశ - ${RASHI_NAMES_TE[karakamsaIdx]}) నుండి 12వ రాశి (${RASHI_NAMES_TE[twelfthFromKarakamsaIdx]})లో ${planetsIn12thFromK[0].nameTe} స్థితి వల్ల మోక్ష-రక్షక ఇష్టదైవ నిర్ధారణ జరిగింది.`
      : `కారకాంశ (${RASHI_NAMES_TE[karakamsaIdx]}) నుండి 12వ స్థానమైన ${RASHI_NAMES_TE[twelfthFromKarakamsaIdx]} రాశి అధిపతి ఆధారంగా జైమిని ఇష్టదైవం నిర్ణయించబడింది.`;
  const ishtaReasonEn =
    planetsIn12thFromK.length > 0
      ? `Determined by ${planetsIn12thFromK[0].nameEn} occupying the 12th house (${RASHI_NAMES_EN[twelfthFromKarakamsaIdx]}) from Karakamsa (${RASHI_NAMES_EN[karakamsaIdx]}).`
      : `Determined by the lord of the 12th house (${RASHI_NAMES_EN[twelfthFromKarakamsaIdx]}) from Karakamsa (${RASHI_NAMES_EN[karakamsaIdx]}).`;

  const ulTe = jhoraMaster.upapadaLagna?.rashiTe || RASHI_NAMES_TE[(lagnaIdx + 11) % 12];
  const ulEn = jhoraMaster.upapadaLagna?.rashiEn || RASHI_NAMES_EN[(lagnaIdx + 11) % 12];
  const maritalHarmonySummaryTe = `దారకారకుడు (DK) ${dkItem?.planetTe} (${dkItem?.rashiTe}) మరియు ఉపపద లగ్నం (UL: ${ulTe}) సమన్వయం జాతకునికి గుణవంతులైన జీవిత భాగస్వామిని, వివాహానంతర ధర్మవృద్ధిని సూచిస్తున్నాయి. ఉపపద లగ్న శుభత్వం కోసం ఏకభుక్తం లేదా ఇష్టదైవ ఆరాధన విశేష శుభాన్ని ఇస్తుంది.`;
  const maritalHarmonySummaryEn = `With Darakaraka ${dkItem?.planetEn} in ${dkItem?.rashiEn} and Upapada Lagna (UL) in ${ulEn}, marriage brings complementary maturity, shared values, and household prosperity.`;

  // 3. Parashara Sapta-Varga Matrix (D1, D2, D3, D4, D7, D9, D10)
  const vargottamaPlanetsTe: string[] = [];
  const vargottamaPlanetsEn: string[] = [];

  const saptaVargaRows: SaptaVargaRow[] = planets.map((p) => {
    const divs = computeDivisionalSigns(p.longitude);
    const isVargottama = divs.d1 === divs.d9;
    if (isVargottama && p.id !== 'lagna') {
      vargottamaPlanetsTe.push(p.nameTe);
      vargottamaPlanetsEn.push(p.nameEn);
    }

    const own = OWN_SIGNS[p.id] || [];
    const exalt = EXALT_SIGNS[p.id];
    const divValues = [divs.d1, divs.d2, divs.d3, divs.d4, divs.d7, divs.d9, divs.d10];

    let strengthCount = 0;
    if (p.id === 'lagna') {
      strengthCount = isVargottama ? 6 : 4;
    } else {
      for (const sIdx of divValues) {
        if (own.includes(sIdx) || sIdx === exalt) {
          strengthCount++;
        }
      }
      if (isVargottama) strengthCount = Math.min(7, strengthCount + 2);
      if (strengthCount === 0) strengthCount = 1;
    }

    const strengthGradeTe =
      strengthCount >= 5
        ? 'పారిజాత / గోపుర మహాబలం'
        : strengthCount >= 3
        ? 'ఉత్తమ వర్గ బలం'
        : 'సమ వర్గ స్థితి';
    const strengthGradeEn =
      strengthCount >= 5
        ? 'Gopura / Supreme Strength'
        : strengthCount >= 3
        ? 'Strong Varga Dignity'
        : 'Moderate Dignity';

    return {
      planetId: p.id,
      nameTe: p.nameTe,
      nameEn: p.nameEn,
      d1RashiTe: RASHI_NAMES_TE[divs.d1],
      d2HoraTe: RASHI_NAMES_TE[divs.d2],
      d3DrekkanaTe: RASHI_NAMES_TE[divs.d3],
      d4ChaturthamsaTe: RASHI_NAMES_TE[divs.d4],
      d7SaptamsaTe: RASHI_NAMES_TE[divs.d7],
      d9NavamshaTe: RASHI_NAMES_TE[divs.d9],
      d10DasamshaTe: RASHI_NAMES_TE[divs.d10],
      isVargottama,
      vargaStrengthCount: strengthCount,
      strengthGradeTe,
      strengthGradeEn,
    };
  });

  // 4. Trividha Runa (Deva, Pitru, Rishi/Naga Runa) Analysis
  const ninthHouseIdx = (lagnaIdx + 8) % 12;
  const fifthHouseIdx = (lagnaIdx + 4) % 12;
  const ninthLordId = RASHI_LORDS[ninthHouseIdx];
  const fifthLordId = RASHI_LORDS[fifthHouseIdx];
  const ninthLord = byId[ninthLordId];
  const fifthLord = byId[fifthLordId];

  const sunDistFromLagna = surya ? ((surya.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const sunAfflictedByNode =
    surya && ((rahu && rahu.rashiIdx === surya.rashiIdx) || (ketu && ketu.rashiIdx === surya.rashiIdx));
  const pitruElevated = Boolean(sunAfflictedByNode || sunDistFromLagna === 8 || sunDistFromLagna === 12);

  const guruDistFromLagna = guru ? ((guru.rashiIdx - lagnaIdx + 12) % 12) + 1 : 5;
  const rishiElevated = Boolean(
    (guru && ((rahu && rahu.rashiIdx === guru.rashiIdx) || guruDistFromLagna === 6 || guruDistFromLagna === 8))
  );

  const moonDistFromLagna = chandra ? ((chandra.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const devaElevated = Boolean(
    moonDistFromLagna === 8 ||
      (ninthLord && [6, 8, 12].includes(((ninthLord.rashiIdx - lagnaIdx + 12) % 12) + 1))
  );

  const trividhaRunas: TrividhaRunaItem[] = [
    {
      runaTitleTe: '1. దేవ రుణం (దైవ అనుగ్రహ & భాగ్యాధిపతి స్థితి)',
      runaTitleEn: '1. Deva Runa (Divine Grace & 9th House Karma)',
      statusTe: devaElevated ? 'నిత్య నియమ ఆరాధన అవసరం' : 'శుభ దైవానుగ్రహం ఉంది ✓',
      statusEn: devaElevated ? 'Active Spiritual Discipline Advised' : 'Well-Supported Divine Grace ✓',
      isElevated: devaElevated,
      diagnosisTe: devaElevated
        ? 'నవమ లేదా చంద్ర స్థితి వల్ల పనులలో చివరి నిమిషంలో ఆలస్యం కలగకుండా నిత్య దీపారాధన, దేవాలయ దర్శనం చాలా అవసరం.'
        : 'పూర్వపుణ్య భాగ్యాధిపతి బలం వల్ల కష్టసమయాలలో దైవం అండగా నిలిచి సరైన మార్గం చూపుతుంది.',
      diagnosisEn: devaElevated
        ? 'Regular lamp lighting and temple visits smooth out eleventh-hour delays caused by 9th-lord / lunar sensitivity.'
        : 'Strong 9th-house grace provides providential support and timely protection in major undertakings.',
      remedyTe: 'ప్రతి గురువారం లేదా ఏకాదశి నాడు ఇంటి దేవతా పూజ మరియు తులసి/దీప సేవ',
      remedyEn: 'Regular Thursday/Ekadashi worship, Tulasi lighting, and charitable Annadanam',
    },
    {
      runaTitleTe: '2. పితృ రుణం (సూర్య & వంశ పరంపర బలం)',
      runaTitleEn: '2. Pitru Runa (Ancestral Lineage & Solar Balance)',
      statusTe: pitruElevated ? 'పితృ తృప్తి & సూర్య శాంతి అవసరం' : 'వంశ ఆశీస్సు బలంగా ఉంది ✓',
      statusEn: pitruElevated ? 'Ancestral Gratitude & Solar Remedy' : 'Strong Ancestral Blessings ✓',
      isElevated: pitruElevated,
      diagnosisTe: pitruElevated
        ? 'సూర్య స్థితి/నోడల్ సంయోగం వల్ల తండ్రిగారి లేదా పితృ దేవతల పేరుతో దానధర్మాలు, అమావాస్య తర్పణాలు చేయడం అత్యంత శుభదాయకం.'
        : 'తల్లిదండ్రులు మరియు పెద్దల ఆశీస్సులు జాతకునికి రక్షణ కవచంలా నిలుస్తాయి.',
      diagnosisEn: pitruElevated
        ? 'Honoring ancestors on Amavasya, offering food donations, and serving parents unlock stalled progress.'
        : 'Ancestral blessings act as a protective shield supporting career stability and family longevity.',
      remedyTe: 'అమావాస్య రోజున పితృ స్మరణతో అన్నదానం / గోగ్రాసం మరియు నిత్య సూర్య నమస్కారం',
      remedyEn: 'Amavasya charity in ancestors’ memory and morning Surya Arghya / Namaskara',
    },
    {
      runaTitleTe: '3. ఋషి / జ్ఞాన రుణం (గురు & పంచమాధిపతి స్థితి)',
      runaTitleEn: '3. Rishi Runa (Guru Parampara & 5th House Merit)',
      statusTe: rishiElevated ? 'సద్గ్రంథ పఠనం & గురు సేవ శుభం' : 'గురు-వేద జ్ఞాన యోగం ✓',
      statusEn: rishiElevated ? 'Scriptural Study & Guru Seva' : 'Strong Wisdom & Mantra Merit ✓',
      isElevated: rishiElevated,
      diagnosisTe: rishiElevated
        ? `పంచమాధిపతి (${fifthLord?.nameTe || 'గురువు'}) మరియు గురు స్థితిని మరింత శుభం చేయడానికి ఆధ్యాత్మిక పుస్తక దానం, విద్యార్థులకు సహాయం చేయడం ఉత్తమం.`
        : 'పురాణ శ్రవణం, మంత్రోపాసన మరియు నేర్చుకున్న జ్ఞానాన్ని ఇతరులతో పంచుకోవడం ద్వారా అపార కీర్తి లభిస్తుంది.',
      diagnosisEn: rishiElevated
        ? 'Supporting students with books, respecting teachers, and chanting sacred stotras strengthen Jupiterian wisdom.'
        : 'Natural inclination toward mantra, scriptural wisdom, and teaching elevates life fulfillment.',
      remedyTe: 'పేద విద్యార్థులకు పుస్తకాలు, పసుపు వస్త్రాల దానం మరియు గురువారం దత్త/దక్షిణామూర్తి స్తోత్రం',
      remedyEn: 'Donate books to needy students and chant Sri Dakshinamurthy / Guru Stotra on Thursdays',
    },
  ];

  const NAMAKSHARA_27_TE: string[][] = [
    ['చు', 'చే', 'చో', 'లా'], ['లీ', 'లూ', 'లే', 'లో'], ['ఆ', 'ఈ', 'ఊ', 'ఏ'],
    ['ఓ', 'వా', 'వీ', 'వూ'], ['వే', 'వో', 'కా', 'కీ'], ['కూ', 'ఖం', 'ఙ', 'ఛా'],
    ['కే', 'కో', 'హా', 'హీ'], ['హూ', 'హే', 'హో', 'డా'], ['డీ', 'డూ', 'డే', 'డో'],
    ['మా', 'మీ', 'మూ', 'మే'], ['మో', 'టా', 'టీ', 'టూ'], ['టే', 'టో', 'పా', 'పీ'],
    ['పూ', 'షం', 'ణా', 'ఠా'], ['పే', 'పో', 'రా', 'రీ'], ['రూ', 'రే', 'రో', 'తా'],
    ['తీ', 'తూ', 'తే', 'తో'], ['నా', 'నీ', 'నూ', 'నే'], ['నో', 'యా', 'యీ', 'యూ'],
    ['యే', 'యో', 'భా', 'భీ'], ['భూ', 'ధా', 'ఫా', 'ఢా'], ['భే', 'భో', 'జా', 'జీ'],
    ['జూ', 'జే', 'జో', 'ఖా'], ['గా', 'గీ', 'గూ', 'గే'], ['గో', 'సా', 'సీ', 'సూ'],
    ['సే', 'సో', 'దా', 'దీ'], ['దూ', 'థ', 'ఝ', 'ఞ'], ['దే', 'దో', 'చా', 'చీ'],
  ];

  const NAK_YONI_TE = [
    'అశ్వం (గుర్రం)', 'గజం (ఏనుగు)', 'మేషం (పొట్టేలు)', 'సర్పం (పాము)', 'సర్పం (పాము)',
    'శ్వానం (కుక్క)', 'మార్జాలం (పిల్లి)', 'మేషం (పొట్టేలు)', 'మార్జాలం (పిల్లి)', 'మూషికం (ఎలుక)',
    'మూషికం (ఎలుక)', 'గోవు (ఆవు)', 'మహిషం (గేదె)', 'వ్యాఘ్రం (పులి)', 'మహిషం (గేదె)',
    'వ్యాఘ్రం (పులి)', 'మృగం (జింక)', 'మృగం (జింక)', 'శ్వానం (కుక్క)', 'వానరం (కోతి)',
    'నకులం (ముంగిస)', 'వానరం (కోతి)', 'సింహం', 'అశ్వం (గుర్రం)', 'సింహం',
    'గోవు (ఆవు)', 'గజం (ఏనుగు)',
  ];
  const NAK_YONI_EN = [
    'Ashwa (Horse)', 'Gaja (Elephant)', 'Mesha (Sheep)', 'Sarpa (Serpent)', 'Sarpa (Serpent)',
    'Shwana (Dog)', 'Marjala (Cat)', 'Mesha (Sheep)', 'Marjala (Cat)', 'Mushika (Rat)',
    'Mushika (Rat)', 'Gau (Cow)', 'Mahisha (Buffalo)', 'Vyaghra (Tiger)', 'Mahisha (Buffalo)',
    'Vyaghra (Tiger)', 'Mriga (Deer)', 'Mriga (Deer)', 'Shwana (Dog)', 'Vanara (Monkey)',
    'Nakula (Mongoose)', 'Vanara (Monkey)', 'Simha (Lion)', 'Ashwa (Horse)', 'Simha (Lion)',
    'Gau (Cow)', 'Gaja (Elephant)',
  ];

  const NAK_LORDS_LOOP = [
    { te: 'కేతువు', en: 'Ketu' },
    { te: 'శుక్రుడు', en: 'Venus' },
    { te: 'సూర్యుడు', en: 'Sun' },
    { te: 'చంద్రుడు', en: 'Moon' },
    { te: 'కుజుడు', en: 'Mars' },
    { te: 'రాహువు', en: 'Rahu' },
    { te: 'గురుడు', en: 'Jupiter' },
    { te: 'శని', en: 'Saturn' },
    { te: 'బుధుడు', en: 'Mercury' },
  ];

  const DEVA_NAKS = new Set([0, 4, 6, 7, 12, 14, 16, 21, 26]);
  const MANUSHYA_NAKS = new Set([1, 3, 5, 10, 11, 19, 20, 24, 25]);
  const ADI_NADI = new Set([0, 5, 6, 11, 12, 17, 18, 23, 24]);
  const MADHYA_NADI = new Set([1, 4, 7, 10, 13, 16, 19, 22, 25]);

  const moonLon = norm360(chandra?.longitude ?? 45);
  const moonRashi = Math.floor(moonLon / 30) % 12;
  const nakSpan = 360 / 27;
  const moonNakIdx = Math.floor(moonLon / nakSpan) % 27;
  const moonPada = (Math.floor((moonLon % nakSpan) / (nakSpan / 4)) % 4) + 1;

  const varnaMap = [
    { te: 'క్షత్రియ', en: 'Kshatriya' },
    { te: 'వైశ్య', en: 'Vaishya' },
    { te: 'శూద్ర', en: 'Shudra' },
    { te: 'బ్రాహ్మణ', en: 'Brahmin' },
  ];
  // 3,7,11 -> Brahmin (3); 0,4,8 -> Kshatriya (0); 1,5,9 -> Vaishya (1); 2,6,10 -> Shudra (2)
  const varnaIdx = moonRashi % 4 === 3 ? 3 : moonRashi % 4 === 0 ? 0 : moonRashi % 4 === 1 ? 1 : 2;

  const vashyaInfo =
    [0, 1, 9].includes(moonRashi)
      ? { te: 'చతుష్పాద', en: 'Chatushpada' }
      : [2, 5, 6, 10].includes(moonRashi)
      ? { te: 'ద్విపాద (మానవ)', en: 'Dwipada (Human)' }
      : [3, 11].includes(moonRashi)
      ? { te: 'జలచర', en: 'Jalachara (Aquatic)' }
      : moonRashi === 4
      ? { te: 'వనచర', en: 'Vanachara' }
      : moonRashi === 7
      ? { te: 'కీట', en: 'Keeta' }
      : { te: 'ద్విపాద / చతుష్పాద', en: 'Dual Vashya' };

  const moonHouse = ((moonRashi - lagnaIdx + 12) % 12) + 1;
  const payaInfo =
    [1, 6, 11].includes(moonHouse)
      ? { te: 'సువర్ణ పాదం (Gold)', en: 'Suvarna Paya (Gold)' }
      : [2, 5, 9].includes(moonHouse)
      ? { te: 'రజత పాదం (Silver)', en: 'Rajata Paya (Silver)' }
      : [3, 7, 10].includes(moonHouse)
      ? { te: 'తామ్ర పాదం (Copper)', en: 'Tamra Paya (Copper)' }
      : { te: 'లోహ పాదం (Iron)', en: 'Loha Paya (Iron)' };

  const ganaInfo = DEVA_NAKS.has(moonNakIdx)
    ? { te: 'దేవ గణం', en: 'Deva Gana' }
    : MANUSHYA_NAKS.has(moonNakIdx)
    ? { te: 'మనుష్య గణం', en: 'Manushya Gana' }
    : { te: 'రాక్షస గణం', en: 'Rakshasa Gana' };

  const nadiInfo = ADI_NADI.has(moonNakIdx)
    ? { te: 'ఆది నాడి', en: 'Adi Nadi' }
    : MADHYA_NADI.has(moonNakIdx)
    ? { te: 'మధ్య నాడి', en: 'Madhya Nadi' }
    : { te: 'అంత్య నాడి', en: 'Antya Nadi' };

  const tattvaList = [
    { te: 'అగ్ని తత్త్వం', en: 'Fire (Agni)' },
    { te: 'భూ తత్త్వం', en: 'Earth (Prithvi)' },
    { te: 'వాయు తత్త్వం', en: 'Air (Vayu)' },
    { te: 'జల తత్త్వం', en: 'Water (Jala)' },
  ];
  const tattvaInfo = tattvaList[moonRashi % 4];
  const rashiLordMap: Record<string, { te: string; en: string }> = {
    mars: { te: 'కుజుడు', en: 'Mars' },
    venus: { te: 'శుక్రుడు', en: 'Venus' },
    mercury: { te: 'బుధుడు', en: 'Mercury' },
    moon: { te: 'చంద్రుడు', en: 'Moon' },
    sun: { te: 'సూర్యుడు', en: 'Sun' },
    jupiter: { te: 'గురుడు', en: 'Jupiter' },
    saturn: { te: 'శని', en: 'Saturn' },
  };
  const rLord = rashiLordMap[RASHI_LORDS[moonRashi]] || { te: 'కుజుడు', en: 'Mars' };
  const nakLord = NAK_LORDS_LOOP[moonNakIdx % 9] || NAK_LORDS_LOOP[0];

  const avakahada: AvakahadaChakraProfile = {
    varnaTe: varnaMap[varnaIdx].te,
    varnaEn: varnaMap[varnaIdx].en,
    vashyaTe: vashyaInfo.te,
    vashyaEn: vashyaInfo.en,
    yoniTe: NAK_YONI_TE[moonNakIdx] || 'అశ్వం',
    yoniEn: NAK_YONI_EN[moonNakIdx] || 'Ashwa',
    ganaTe: ganaInfo.te,
    ganaEn: ganaInfo.en,
    nadiTe: nadiInfo.te,
    nadiEn: nadiInfo.en,
    payaTe: payaInfo.te,
    payaEn: payaInfo.en,
    rashiLordTe: rLord.te,
    rashiLordEn: rLord.en,
    nakshatraLordTe: nakLord.te,
    nakshatraLordEn: nakLord.en,
    namaksharaTe: (NAMAKSHARA_27_TE[moonNakIdx]?.[moonPada - 1] || 'చూ') + ' (అక్షరం)',
    tattvaTe: tattvaInfo.te,
    tattvaEn: tattvaInfo.en,
  };

  return {
    avakahada,
    bhriguCircuits,
    jaiminiIshtaProfile: {
      atmakarakaTe: `${akItem?.planetTe || 'సూర్యుడు'} (${akItem?.degreeInSign || ''})`,
      atmakarakaEn: `${akItem?.planetEn || 'Sun'} (${akItem?.degreeInSign || ''})`,
      karakamsaRashiTe: RASHI_NAMES_TE[karakamsaIdx],
      karakamsaRashiEn: RASHI_NAMES_EN[karakamsaIdx],
      twelfthFromKarakamsaTe: RASHI_NAMES_TE[twelfthFromKarakamsaIdx],
      twelfthFromKarakamsaEn: RASHI_NAMES_EN[twelfthFromKarakamsaIdx],
      ishtaDevataTe: ishtaInfo.deityTe,
      ishtaDevataEn: ishtaInfo.deityEn,
      ishtaReasonTe,
      ishtaReasonEn,
      upasanaMantraTe: ishtaInfo.mantraTe,
      darakarakaTe: `${dkItem?.planetTe || 'బుధుడు'} (${dkItem?.rashiTe || ''})`,
      darakarakaEn: `${dkItem?.planetEn || 'Mercury'} (${dkItem?.rashiEn || ''})`,
      upapadaRashiTe: ulTe,
      upapadaRashiEn: ulEn,
      maritalHarmonySummaryTe,
      maritalHarmonySummaryEn,
    },
    saptaVargaRows,
    vargottamaPlanetsTe,
    vargottamaPlanetsEn,
    trividhaRunas,
  };
}
