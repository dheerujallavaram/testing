export type PlanetCode = 'Su' | 'Mo' | 'Ma' | 'Me' | 'Ju' | 'Ve' | 'Sa' | 'Ra' | 'Ke';
export type AspectCode = 'C' | 'S' | '3' | '4' | '5' | '8' | '9' | '10';

export interface PlanetMeta {
  code: PlanetCode;
  nameEn: string;
  nameTe: string;
  icon: string;
}

export const PLANET_META: Record<PlanetCode, PlanetMeta> = {
  Su: { code: 'Su', nameEn: 'Sun', nameTe: 'సూర్యుడు', icon: '☀️' },
  Mo: { code: 'Mo', nameEn: 'Moon', nameTe: 'చంద్రుడు', icon: '🌙' },
  Ma: { code: 'Ma', nameEn: 'Mars', nameTe: 'కుజుడు', icon: '🔥' },
  Me: { code: 'Me', nameEn: 'Mercury', nameTe: 'బుధుడు', icon: '🟢' },
  Ju: { code: 'Ju', nameEn: 'Jupiter', nameTe: 'గురుడు (బృహస్పతి)', icon: '✨' },
  Ve: { code: 'Ve', nameEn: 'Venus', nameTe: 'శుక్రుడు', icon: '💎' },
  Sa: { code: 'Sa', nameEn: 'Saturn', nameTe: 'శని', icon: '🪐' },
  Ra: { code: 'Ra', nameEn: 'Rahu', nameTe: 'రాహువు', icon: '🐉' },
  Ke: { code: 'Ke', nameEn: 'Ketu', nameTe: 'కేతువు', icon: '🔱' },
};

export interface AspectMeta {
  code: AspectCode;
  labelTe: string;
  labelEn: string;
  shortTe: string;
  nature: 'auspicious' | 'intense' | 'neutral';
  descriptionTe: string;
}

export const ASPECT_META: Record<AspectCode, AspectMeta> = {
  C: {
    code: 'C',
    labelTe: 'గ్రహ సంచారం & రెండు గ్రహాల కలయిక (ఒకే రాశిలో కలవడం)',
    labelEn: 'Planetary Transit & Alignment (Graha Sancharam)',
    shortTe: 'గ్రహ సంచారం / కలయిక',
    nature: 'intense',
    descriptionTe: 'గ్రహ సంచారంలో రెండు గ్రహాలు ఒకే రాశిలో పక్కపక్కనే కలిసే సమయం — తలపెట్టిన పనులలో వేగం మరియు కొత్త మార్పులు కనిపిస్తాయి.',
  },
  S: {
    code: 'S',
    labelTe: 'ఎదురెదురు గ్రహాల పూర్ణ దృష్టి (7వ దృష్టి)',
    labelEn: 'Direct Mutual Aspect (7th Aspect)',
    shortTe: 'ఎదురెదురు పూర్ణ దృష్టి',
    nature: 'auspicious',
    descriptionTe: 'రెండు గ్రహాలు ఎదురెదురుగా ఉండి ఒకదానిపై ఒకటి పూర్ణ దృష్టి ప్రసరించడం — కుటుంబం, వ్యాపార భాగస్వామ్యం మరియు నలుగురిలో మంచి పేరు తెస్తుంది.',
  },
  '3': {
    code: '3',
    labelTe: 'ధైర్యం & పట్టుదలనిచ్చే 3వ దృష్టి',
    labelEn: 'Courage & Effort Aspect (3rd Aspect)',
    shortTe: '3వ దృష్టి (ధైర్య బలం)',
    nature: 'neutral',
    descriptionTe: 'సొంత ప్రయత్నంతో పనులు పూర్తి చేయడం, తోబుట్టువుల సహకారం మరియు చిన్న ప్రయాణాల ద్వారా లాభం.',
  },
  '4': {
    code: '4',
    labelTe: 'ఇల్లు, ఆస్తి & మనశ్శాంతిపై 4వ దృష్టి',
    labelEn: 'Home & Comfort Aspect (4th Aspect)',
    shortTe: '4వ దృష్టి (గృహ బలం)',
    nature: 'intense',
    descriptionTe: 'ఇంటి అవసరాలు, వాహన సౌకర్యం, తల్లిగారి ఆరోగ్యం మరియు మనసు ప్రశాంతతపై ప్రభావం చూపే సమయం.',
  },
  '5': {
    code: '5',
    labelTe: 'అదృష్టం & ఆలోచనలకు బలాన్నిచ్చే 5వ శుభ దృష్టి',
    labelEn: 'Good Luck & Wisdom Aspect (5th Aspect)',
    shortTe: '5వ శుభ దృష్టి (అదృష్టం)',
    nature: 'auspicious',
    descriptionTe: 'మంచి ఆలోచనలు తట్టడం, పిల్లల విషయంలో సంతోషం, చదువు మరియు ఆకస్మిక ధనలాభానికి తోడ్పడే శుభ దృష్టి.',
  },
  '8': {
    code: '8',
    labelTe: 'ఆచితూచి అడుగు వేయాల్సిన 8వ దృష్టి',
    labelEn: 'Careful Step Aspect (8th Aspect)',
    shortTe: '8వ దృష్టి (జాగ్రత్త)',
    nature: 'intense',
    descriptionTe: 'తొందరపాటు నిర్ణయాలు కాకుండా ప్రశాంతంగా ఆలోచించి పనులు చేయాలి; ఖర్చులు మరియు ఆరోగ్య విషయంలో శ్రద్ధ మంచిది.',
  },
  '9': {
    code: '9',
    labelTe: 'దైవ బలం & పెద్దల ఆశీస్సులనిచ్చే 9వ శుభ దృష్టి',
    labelEn: 'Divine Grace & Fortune Aspect (9th Aspect)',
    shortTe: '9వ శుభ దృష్టి (దైవ బలం)',
    nature: 'auspicious',
    descriptionTe: 'దేవుని దయ, పెద్దల ఆశీర్వాదం, ఆగిపోయిన డబ్బు చేతికి అందడం మరియు శుభవార్తలు వినే అనుకూల సమయం.',
  },
  '10': {
    code: '10',
    labelTe: 'ఉద్యోగం & వ్యాపారంలో విజయాన్నిచ్చే 10వ దృష్టి',
    labelEn: 'Career & Work Success Aspect (10th Aspect)',
    shortTe: '10వ దృష్టి (ఉద్యోగ విజయం)',
    nature: 'auspicious',
    descriptionTe: 'చేసే పనిలో, ఆఫీసులో లేదా వ్యాపారంలో మంచి గుర్తింపు, పైఅధికారుల మెప్పు మరియు ఆర్థిక ఎదుగుదల.',
  },
};

export interface SignEntryEvent {
  monthKey: '2026-10' | '2026-11' | '2026-12';
  isoDate: string;
  day: number;
  time: string;
  planet: PlanetCode;
  planetTe: string;
  planetEn: string;
  signEn: string;
  signTe: string;
  significanceTe: string;
}

export interface NakshatraEntryEvent {
  monthKey: '2026-10' | '2026-11' | '2026-12';
  isoDate: string;
  day: number;
  time: string;
  planet: PlanetCode;
  planetTe: string;
  planetEn: string;
  nakshatraEn: string;
  nakshatraTe: string;
  significanceTe: string;
}

export interface PlanetaryAspectEvent {
  id: string;
  monthKey: '2026-10' | '2026-11' | '2026-12';
  isoDate: string;
  day: number;
  time: string;
  fromPlanet: PlanetCode;
  aspect: AspectCode;
  toPlanet: PlanetCode;
  rawText: string;
}

// ============================================================================
// 1. ENTRY OF PLANETS INTO SIGNS (OCT, NOV, DEC 2026)
// ============================================================================
export const SIGN_ENTRIES_2026: SignEntryEvent[] = [
  // October 2026
  {
    monthKey: '2026-10',
    isoDate: '2026-10-14',
    day: 14,
    time: '02:24:31',
    planet: 'Ve',
    planetTe: 'శుక్రుడు (Venus)',
    planetEn: 'Venus',
    signEn: 'Virgo',
    signTe: 'కన్యా రాశి',
    significanceTe: 'శుక్రుడు బుధ క్షేత్రమైన కన్యా రాశిలోకి ప్రవేశం — వ్యాపార, కళా, ఆర్థిక ప్రణాళికలలో విచక్షణ అవసరమయ్యే కాలం.',
  },
  {
    monthKey: '2026-10',
    isoDate: '2026-10-18',
    day: 18,
    time: '10:01:05',
    planet: 'Su',
    planetTe: 'సూర్యుడు (Sun)',
    planetEn: 'Sun',
    signEn: 'Libra',
    signTe: 'తులా రాశి (తులా సంక్రమణం)',
    significanceTe: 'తులా సంక్రమణం — కావేరీ నదీ స్నాన పుణ్యకాలం. సూర్య ఆరాధన, ఆదిత్య హృదయ పారాయణం విశేష శుభప్రదం.',
  },
  {
    monthKey: '2026-10',
    isoDate: '2026-10-19',
    day: 19,
    time: '23:16:39',
    planet: 'Ju',
    planetTe: 'గురుడు / బృహస్పతి (Jupiter)',
    planetEn: 'Jupiter',
    signEn: 'Leo',
    signTe: 'సింహ రాశి (సింహ రాశి ప్రవేశం)',
    significanceTe: 'దేవగురువు బృహస్పతి సింహ రాశిలోకి ప్రవేశం — మేష, తుల, ధనుస్సు, కుంభ రాశుల వారికి విశేష గురు దృష్టి బలం.',
  },

  // November 2026
  {
    monthKey: '2026-11',
    isoDate: '2026-11-14',
    day: 14,
    time: '11:36:21',
    planet: 'Ma',
    planetTe: 'కుజుడు (Mars)',
    planetEn: 'Mars',
    signEn: 'Leo',
    signTe: 'సింహ రాశి',
    significanceTe: 'మిత్ర క్షేత్రమైన సింహ రాశిలోకి కుజుని ప్రవేశం — గురు-కుజ గురుమంగళ యోగ బలం, భూ-గృహ మరియు ఉద్యోగ ప్రయత్నాలకు ఊపు.',
  },
  {
    monthKey: '2026-11',
    isoDate: '2026-11-17',
    day: 17,
    time: '07:21:59',
    planet: 'Su',
    planetTe: 'సూర్యుడు (Sun)',
    planetEn: 'Sun',
    signEn: 'Scorpio',
    signTe: 'వృశ్చిక రాశి (వృశ్చిక సంక్రమణం)',
    significanceTe: 'వృశ్చిక సంక్రమణం — మిత్ర క్షేత్రమైన వృశ్చికంలో సూర్య సంచారం వల్ల ఆత్మవిశ్వాసం, ప్రభుత్వ/అధికారిక పనులలో పురోగతి.',
  },
  {
    monthKey: '2026-11',
    isoDate: '2026-11-30',
    day: 30,
    time: '17:15:29',
    planet: 'Ve',
    planetTe: 'శుక్రుడు (Venus)',
    planetEn: 'Venus',
    signEn: 'Libra',
    signTe: 'తులా రాశి (స్వక్షేత్ర మాళవ్య యోగం)',
    significanceTe: 'శుక్రుడు తన స్వక్షేత్రమైన తులా రాశిలోకి ప్రవేశం — మాళవ్య మహాపురుష యోగ ప్రభావంతో దాంపత్య సౌఖ్యం, శుభకార్యాలు, ధనలాభం.',
  },

  // December 2026
  {
    monthKey: '2026-12',
    isoDate: '2026-12-02',
    day: 2,
    time: '20:15:57',
    planet: 'Me',
    planetTe: 'బుధుడు (Mercury)',
    planetEn: 'Mercury',
    signEn: 'Scorpio',
    signTe: 'వృశ్చిక రాశి',
    significanceTe: 'వృశ్చిక రాశిలో సూర్య-బుధ బుధాదిత్య యోగ కలయిక (గ్రహ సంచారం) — పరిశోధన, విద్య, ఆర్థిక విశ్లేషణ రంగాల వారికి అనుకూలం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-16',
    day: 16,
    time: '19:23:50',
    planet: 'Su',
    planetTe: 'సూర్యుడు (Sun)',
    planetEn: 'Sun',
    signEn: 'Sagittarius',
    signTe: 'ధనుస్సు రాశి (ధనుర్మాస ప్రారంభం)',
    significanceTe: 'ధనుస్సంక్రమణం — పవిత్ర ధనుర్మాస వ్రత ఆరంభం. శ్రీ మహావిష్ణువు, గోదాదేవి తిరుప్పావై ఆరాధనకు పరమ పుణ్యకాలం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-21',
    day: 21,
    time: '00:59:41',
    planet: 'Me',
    planetTe: 'బుధుడు (Mercury)',
    planetEn: 'Mercury',
    signEn: 'Sagittarius',
    signTe: 'ధనుస్సు రాశి',
    significanceTe: 'గురు క్షేత్రమైన ధనుస్సు రాశిలో బుధ సంచారం — ధనుర్మాసంలో సూర్య-బుధ కలయికతో ఆధ్యాత్మిక, విద్యా, న్యాయ రంగాలలో శుభ ఫలితాలు.',
  },
];

// ============================================================================
// 2. ENTRY OF PLANETS IN NAKSHATRAS (OCT, NOV, DEC 2026)
// ============================================================================
export const NAKSHATRA_ENTRIES_2026: NakshatraEntryEvent[] = [
  // October 2026
  {
    monthKey: '2026-10',
    isoDate: '2026-10-11',
    day: 11,
    time: '16:54:32',
    planet: 'Su',
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun',
    nakshatraEn: 'Chitra',
    nakshatraTe: 'చిత్త నక్షత్రం',
    significanceTe: 'సూర్యుడు కుజ నక్షత్రమైన చిత్తలోకి ప్రవేశం — కార్యదీక్ష, సాంకేతిక & నిర్మాణ పనులకు బలం.',
  },
  {
    monthKey: '2026-10',
    isoDate: '2026-10-19',
    day: 19,
    time: '03:25:33',
    planet: 'Ma',
    planetTe: 'కుజుడు',
    planetEn: 'Mars',
    nakshatraEn: 'Aasresha',
    nakshatraTe: 'ఆశ్లేష నక్షత్రం',
    significanceTe: 'కుజుడు ఆశ్లేష నక్షత్ర ప్రవేశం — కోపావేశాలను తగ్గించుకుని సుబ్రహ్మణ్య స్వామి ఆరాధన చేయడం శ్రేయస్కరం.',
  },
  {
    monthKey: '2026-10',
    isoDate: '2026-10-19',
    day: 19,
    time: '23:16:39',
    planet: 'Ju',
    planetTe: 'గురుడు (బృహస్పతి)',
    planetEn: 'Jupiter',
    nakshatraEn: 'Magha',
    nakshatraTe: 'మఖ నక్షత్రం',
    significanceTe: 'గురుడు పితృదేవతా నక్షత్రమైన మఖలోకి ప్రవేశం — సంప్రదాయ పూజలు, వంశాభివృద్ధి మరియు ఆధ్యాత్మిక గౌరవం.',
  },
  {
    monthKey: '2026-10',
    isoDate: '2026-10-24',
    day: 24,
    time: '22:17:33',
    planet: 'Ve',
    planetTe: 'శుక్రుడు',
    planetEn: 'Venus',
    nakshatraEn: 'Hastha',
    nakshatraTe: 'హస్త నక్షత్రం',
    significanceTe: 'శుక్రుడు చంద్ర నక్షత్రమైన హస్తలోకి ప్రవేశం — లలిత కళలు, వ్యాపారం, ఆభరణాల కొనుగోలుకు శుభం.',
  },
  {
    monthKey: '2026-10',
    isoDate: '2026-10-25',
    day: 25,
    time: '02:27:56',
    planet: 'Su',
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun',
    nakshatraEn: 'Swaati',
    nakshatraTe: 'స్వాతి నక్షత్రం',
    significanceTe: 'సూర్యుడు స్వాతి నక్షత్ర ప్రవేశం — స్వతంత్ర నిర్ణయాలు, వాణిజ్య ఒప్పందాలలో పురోగతి.',
  },

  // November 2026
  {
    monthKey: '2026-11',
    isoDate: '2026-11-07',
    day: 7,
    time: '09:31:00',
    planet: 'Su',
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun',
    nakshatraEn: 'Visakha',
    nakshatraTe: 'విశాఖ నక్షత్రం',
    significanceTe: 'సూర్యుడు గురు నక్షత్రమైన విశాఖలోకి ప్రవేశం — ధర్మబలం, విద్యా-అధికార రంగాలలో ఉన్నతి.',
  },
  {
    monthKey: '2026-11',
    isoDate: '2026-11-14',
    day: 14,
    time: '11:36:21',
    planet: 'Ma',
    planetTe: 'కుజుడు',
    planetEn: 'Mars',
    nakshatraEn: 'Magha',
    nakshatraTe: 'మఖ నక్షత్రం',
    significanceTe: 'కుజుడు మఖ నక్షత్ర ప్రవేశం — పరాక్రమం, నాయకత్వ లక్షణాలు, భూ-స్థిరాస్తి వ్యవహారాలలో కదలిక.',
  },
  {
    monthKey: '2026-11',
    isoDate: '2026-11-19',
    day: 19,
    time: '12:46:21',
    planet: 'Ve',
    planetTe: 'శుక్రుడు',
    planetEn: 'Venus',
    nakshatraEn: 'Chitra',
    nakshatraTe: 'చిత్త నక్షత్రం',
    significanceTe: 'శుక్రుడు చిత్త నక్షత్ర ప్రవేశం — గృహాలంకరణ, వస్త్ర-ఆభరణ వ్యాపారాలకు అనుకూలం.',
  },
  {
    monthKey: '2026-11',
    isoDate: '2026-11-20',
    day: 20,
    time: '14:24:33',
    planet: 'Su',
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun',
    nakshatraEn: 'Anuraadha',
    nakshatraTe: 'అనురాధ నక్షత్రం',
    significanceTe: 'సూర్యుడు మిత్ర దేవతాకమైన అనురాధ నక్షత్ర ప్రవేశం — మిత్రలాభం, సామాజిక సహకారం, కార్యసిద్ధి.',
  },
  {
    monthKey: '2026-11',
    isoDate: '2026-11-25',
    day: 25,
    time: '13:02:34',
    planet: 'Me',
    planetTe: 'బుధుడు',
    planetEn: 'Mercury',
    nakshatraEn: 'Visakha',
    nakshatraTe: 'విశాఖ నక్షత్రం',
    significanceTe: 'బుధుడు విశాఖ నక్షత్ర ప్రవేశం — బుద్ధికుశలత, వ్యాపార ప్రణాళికలలో విజయం.',
  },

  // December 2026
  {
    monthKey: '2026-12',
    isoDate: '2026-12-03',
    day: 3,
    time: '17:33:29',
    planet: 'Su',
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun',
    nakshatraEn: 'Jyeshtha',
    nakshatraTe: 'జ్యేష్ఠ నక్షత్రం',
    significanceTe: 'సూర్యుడు జ్యేష్ఠ నక్షత్ర ప్రవేశం — ఉన్నత పదవులు, పరిపాలనా దక్షత, పెద్దల గౌరవం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-05',
    day: 5,
    time: '01:05:15',
    planet: 'Me',
    planetTe: 'బుధుడు',
    planetEn: 'Mercury',
    nakshatraEn: 'Anuraadha',
    nakshatraTe: 'అనురాధ నక్షత్రం',
    significanceTe: 'బుధుడు అనురాధ నక్షత్ర ప్రవేశం — సంప్రదింపులు, ఒప్పందాలు మరియు స్నేహబంధాలకు శుభప్రదం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-09',
    day: 9,
    time: '05:55:35',
    planet: 'Ve',
    planetTe: 'శుక్రుడు',
    planetEn: 'Venus',
    nakshatraEn: 'Swaati',
    nakshatraTe: 'స్వాతి నక్షత్రం',
    significanceTe: 'శుక్రుడు స్వాతి నక్షత్ర ప్రవేశం — శుభకార్య ప్రయత్నాలు, ఆర్థిక పురోగతి, కుటుంబ ఆనందం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-13',
    day: 13,
    time: '06:43:58',
    planet: 'Me',
    planetTe: 'బుధుడు',
    planetEn: 'Mercury',
    nakshatraEn: 'Jyeshtha',
    nakshatraTe: 'జ్యేష్ఠ నక్షత్రం',
    significanceTe: 'బుధుడు స్వనక్షత్రమైన జ్యేష్ఠలోకి ప్రవేశం — లోతైన విశ్లేషణ, విద్యా-శాస్త్ర పరిశోధనలలో అగ్రస్థానం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-16',
    day: 16,
    time: '19:23:50',
    planet: 'Su',
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun',
    nakshatraEn: 'Moola',
    nakshatraTe: 'మూల నక్షత్రం',
    significanceTe: 'సూర్యుడు మూల నక్షత్ర ప్రవేశం (ధనుర్మాస ప్రారంభం) — ఆధ్యాత్మిక మూల తత్త్వ విచారణ, విష్ణు ఆరాధన.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-20',
    day: 20,
    time: '19:10:15',
    planet: 'Ma',
    planetTe: 'కుజుడు',
    planetEn: 'Mars',
    nakshatraEn: 'Poorva Phalguni',
    nakshatraTe: 'పుబ్బ (పూర్వ ఫల్గుణి) నక్షత్రం',
    significanceTe: 'కుజుడు పుబ్బ నక్షత్ర ప్రవేశం — సృజనాత్మక ఉత్సాహం, ఆర్థిక ప్రయత్నాలలో వేగం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-21',
    day: 21,
    time: '00:59:41',
    planet: 'Me',
    planetTe: 'బుధుడు',
    planetEn: 'Mercury',
    nakshatraEn: 'Moola',
    nakshatraTe: 'మూల నక్షత్రం',
    significanceTe: 'బుధుడు మూల నక్షత్ర ప్రవేశం — తత్త్వశాస్త్రం, బోధన మరియు రచనా రంగాలకు అనుకూలం.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-23',
    day: 23,
    time: '17:04:09',
    planet: 'Ve',
    planetTe: 'శుక్రుడు',
    planetEn: 'Venus',
    nakshatraEn: 'Visakha',
    nakshatraTe: 'విశాఖ నక్షత్రం',
    significanceTe: 'శుక్రుడు విశాఖ నక్షత్ర ప్రవేశం — ధార్మిక వేడుకలు, కుటుంబ సౌభాగ్యం, శుభవార్తలు.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-28',
    day: 28,
    time: '15:35:57',
    planet: 'Me',
    planetTe: 'బుధుడు',
    planetEn: 'Mercury',
    nakshatraEn: 'Poorvashadha',
    nakshatraTe: 'పూర్వాషాఢ నక్షత్రం',
    significanceTe: 'బుధుడు పూర్వాషాఢ నక్షత్ర ప్రవేశం — చర్చలలో విజయం, వ్యాపార విస్తరణ.',
  },
  {
    monthKey: '2026-12',
    isoDate: '2026-12-29',
    day: 29,
    time: '20:21:41',
    planet: 'Su',
    planetTe: 'సూర్యుడు',
    planetEn: 'Sun',
    nakshatraEn: 'Poorvashadha',
    nakshatraTe: 'పూర్వాషాఢ నక్షత్రం',
    significanceTe: 'సూర్యుడు పూర్వాషాఢ నక్షత్ర ప్రవేశం — అపజయం లేని కార్యదీక్ష, కీర్తి ప్రతిష్ఠలు.',
  },
];

// ============================================================================
// 3. RAW JYOTISH PLANETARY ASPECTS (OCT, NOV, DEC 2026)
// ============================================================================
const RAW_ASPECTS_OCT_2026 = `
Mo	[4]	Ke	1	1:38:05
Ke	[10]	Mo	1	1:38:05
Mo	[10]	Ra	1	1:38:05
Ra	[4]	Mo	1	1:38:05
Ve	[8]	Mo	1	2:03:56
Mo	[3]	Ma	1	2:37:22
Me	[8]	Mo	1	6:18:03
Su	[9]	Mo	1	14:12:17
Mo	[5]	Su	1	14:12:17
Sa	[3]	Mo	1	15:07:28
Su	[S]	Sa	2	2:30:40
Ra	[9]	Ve	2	7:16:45
Ve	[5]	Ra	2	7:16:45
Ke	[3]	Ve	2	7:16:45
Mo	[3]	Ju	2	13:15:11
Mo	[5]	Ve	3	3:35:32
Ve	[9]	Mo	3	3:35:32
Mo	[9]	Ra	3	3:56:54
Ra	[5]	Mo	3	3:56:54
Mo	[3]	Ke	3	3:56:54
Mo	[5]	Me	3	13:23:15
Me	[9]	Mo	3	13:23:15
Mo	[10]	Sa	3	17:11:05
Sa	[4]	Mo	3	17:11:05
Su	[10]	Mo	3	20:16:52
Mo	[4]	Su	3	20:16:52
Mo	[4]	Ve	5	4:38:11
Ve	[10]	Mo	5	4:38:11
Mo	[8]	Ra	5	6:03:35
Mo	[C]	Ma	5	11:40:42
Sa	[8]	Me	5	11:43:38
Mo	[9]	Sa	5	19:17:47
Sa	[5]	Mo	5	19:17:47
Mo	[4]	Me	5	19:56:19
Me	[10]	Mo	5	19:56:19
Mo	[3]	Su	6	2:30:05
Mo	[C]	Ju	6	19:33:47
Mo	[3]	Ve	7	6:04:25
Mo	[S]	Ra	7	8:54:17
Mo	[C]	Ke	7	8:54:17
Mo	[8]	Sa	7	22:21:55
Mo	[3]	Me	8	3:07:44
Ra	[8]	Mo	9	13:18:51
Ma	[3]	Mo	10	0:20:21
Mo	[S]	Sa	10	3:11:01
Su	[C]	Mo	10	20:06:17
Ju	[3]	Mo	11	7:22:36
Mo	[C]	Ve	11	12:57:23
Mo	[5]	Ra	11	19:56:25
Ra	[9]	Mo	11	19:56:25
Ke	[3]	Mo	11	19:56:25
Mo	[10]	Ma	12	10:15:37
Ma	[4]	Mo	12	10:15:37
Sa	[8]	Mo	12	10:19:09
Ma	[9]	Sa	12	11:25:47
Sa	[5]	Ma	12	11:25:47
Mo	[C]	Me	12	22:27:45
Mo	[10]	Ju	13	16:55:55
Ju	[4]	Mo	13	16:55:55
Mo	[4]	Ra	14	5:00:51
Ra	[10]	Mo	14	5:00:51
Mo	[10]	Ke	14	5:00:51
Ke	[4]	Mo	14	5:00:51
Mo	[5]	Sa	14	19:50:28
Sa	[9]	Mo	14	19:50:28
Ma	[5]	Mo	14	22:55:32
Mo	[9]	Ma	14	22:55:32
Ju	[3]	Ve	15	6:02:13
Su	[3]	Mo	16	1:11:13
Ve	[3]	Mo	16	3:13:35
Mo	[9]	Ju	16	4:41:06
Ju	[5]	Mo	16	4:41:06
Mo	[9]	Ke	16	16:00:40
Ke	[5]	Mo	16	16:00:40
Mo	[3]	Ra	16	16:00:40
Su	[C]	Ve	16	16:53:40
Mo	[4]	Sa	17	7:00:19
Sa	[10]	Mo	17	7:00:19
Mo	[8]	Ma	17	13:23:27
Me	[3]	Mo	17	22:52:21
Ju	[3]	Su	18	3:05:55
Ve	[4]	Mo	18	11:57:39
Mo	[10]	Ve	18	11:57:39
Mo	[8]	Ju	18	17:18:06
Su	[4]	Mo	18	18:22:32
Mo	[10]	Su	18	18:22:32
Mo	[8]	Ke	19	3:31:36
Mo	[3]	Sa	19	18:14:35
Mo	[S]	Ma	20	3:40:26
Mo	[10]	Me	20	9:27:32
Me	[4]	Mo	20	9:27:32
Mo	[9]	Ve	20	20:06:04
Ve	[5]	Mo	20	20:06:04
Mo	[S]	Ju	21	4:54:08
Su	[5]	Mo	21	10:19:01
Mo	[9]	Su	21	10:19:01
Mo	[C]	Ra	21	13:49:50
Mo	[S]	Ke	21	13:49:50
Ma	[8]	Mo	22	15:54:24
Mo	[9]	Me	22	17:10:45
Me	[5]	Mo	22	17:10:45
Mo	[8]	Ve	23	2:38:39
Su	[5]	Ra	23	4:18:31
Ra	[9]	Su	23	4:18:31
Ke	[3]	Su	23	4:18:31
Ma	[4]	Me	23	7:41:54
Me	[10]	Ma	23	7:41:54
Ju	[8]	Mo	23	14:13:13
Ke	[8]	Mo	23	21:52:47
Mo	[8]	Su	23	23:24:25
Mo	[C]	Sa	24	11:17:26
Mo	[8]	Me	24	21:52:08
Mo	[5]	Ma	25	1:19:10
Ma	[9]	Mo	25	1:19:10
Mo	[S]	Ve	25	7:14:31
Ju	[9]	Mo	25	20:57:37
Mo	[5]	Ju	25	20:57:37
Ke	[9]	Mo	26	3:30:29
Mo	[5]	Ke	26	3:30:29
Ra	[3]	Mo	26	3:30:29
Su	[S]	Mo	26	9:24:51
Mo	[S]	Me	27	0:02:05
Mo	[4]	Ma	27	8:08:26
Ma	[10]	Mo	27	8:08:26
Ve	[8]	Mo	27	10:06:57
Mo	[4]	Ju	28	1:32:29
Ju	[10]	Mo	28	1:32:29
Mo	[4]	Ke	28	7:09:53
Ke	[10]	Mo	28	7:09:53
Mo	[10]	Ra	28	7:09:53
Ra	[4]	Mo	28	7:09:53
Ma	[3]	Ve	28	15:07:52
Su	[8]	Mo	28	17:01:13
Sa	[3]	Mo	28	19:31:39
Me	[8]	Mo	29	0:28:48
Ve	[9]	Mo	29	11:50:01
Mo	[5]	Ve	29	11:50:01
Mo	[3]	Ma	29	13:08:31
Sa	[8]	Su	30	2:23:15
Mo	[3]	Ju	30	4:44:11
Ra	[5]	Mo	30	9:35:54
Mo	[9]	Ra	30	9:35:54
Mo	[3]	Ke	30	9:35:54
Mo	[10]	Sa	30	21:44:36
Sa	[4]	Mo	30	21:44:36
Su	[9]	Mo	30	23:17:40
Mo	[5]	Su	30	23:17:40
Me	[9]	Mo	31	0:07:03
Mo	[5]	Me	31	0:07:03
Su	[C]	Me	31	6:11:50
Ve	[10]	Mo	31	13:08:35
Mo	[4]	Ve	31	13:08:35
`;

const RAW_ASPECTS_NOV_2026 = `
Mo	[8]	Ra	1	11:41:16
Mo	[9]	Sa	1	23:51:12
Sa	[5]	Mo	1	23:51:12
Mo	[4]	Me	1	23:54:52
Me	[10]	Mo	1	23:54:52
Sa	[8]	Me	2	1:16:16
Su	[10]	Mo	2	5:28:04
Mo	[4]	Su	2	5:28:04
Mo	[3]	Ve	2	14:55:37
Mo	[C]	Ma	2	21:44:44
Mo	[C]	Ju	3	10:42:39
Mo	[S]	Ra	3	14:22:35
Mo	[C]	Ke	3	14:22:35
Mo	[3]	Me	4	0:50:57
Mo	[8]	Sa	4	2:47:11
Mo	[3]	Su	4	12:47:40
Ra	[8]	Mo	5	18:30:45
Mo	[S]	Sa	6	7:21:41
Mo	[C]	Ve	6	23:25:19
Ma	[3]	Mo	7	11:25:13
Ju	[3]	Mo	7	22:13:08
Mo	[5]	Ra	8	0:47:15
Ra	[9]	Mo	8	0:47:15
Ke	[3]	Mo	8	0:47:15
Mo	[C]	Me	8	9:48:48
Sa	[8]	Mo	8	14:12:28
Su	[C]	Mo	9	11:00:11
Mo	[10]	Ma	9	22:04:02
Ma	[4]	Mo	9	22:04:02
Mo	[10]	Ju	10	7:34:23
Ju	[4]	Mo	10	7:34:23
Mo	[10]	Ke	10	9:31:00
Ke	[4]	Mo	10	9:31:00
Ra	[10]	Mo	10	9:31:00
Mo	[4]	Ra	10	9:31:00
Mo	[5]	Sa	10	23:30:21
Sa	[9]	Mo	10	23:30:21
Ve	[3]	Mo	11	18:35:39
Mo	[9]	Ma	12	11:10:41
Ma	[5]	Mo	12	11:10:41
Ju	[5]	Mo	12	19:03:51
Mo	[9]	Ju	12	19:03:51
Mo	[9]	Ke	12	20:18:26
Ke	[5]	Mo	12	20:18:26
Mo	[3]	Ra	12	20:18:26
Me	[3]	Mo	13	7:52:44
Mo	[4]	Sa	13	10:39:21
Sa	[10]	Mo	13	10:39:21
Mo	[10]	Ve	14	7:36:04
Ve	[4]	Mo	14	7:36:04
Su	[3]	Mo	14	19:53:12
Mo	[8]	Ma	15	1:24:14
Mo	[8]	Ju	15	7:21:51
Mo	[8]	Ke	15	7:52:36
Sa	[8]	Me	15	20:38:56
Mo	[3]	Sa	15	22:11:06
Mo	[10]	Me	15	22:16:25
Me	[4]	Mo	15	22:16:25
Mo	[9]	Ve	16	20:44:33
Ve	[5]	Mo	16	20:44:33
Ju	[C]	Ke	17	3:38:30
Ju	[S]	Ra	17	3:38:30
Mo	[10]	Su	17	12:19:01
Su	[4]	Mo	17	12:19:01
Mo	[S]	Ma	17	14:40:18
Mo	[C]	Ra	17	18:28:04
Mo	[S]	Ke	17	18:28:04
Mo	[S]	Ju	17	18:37:55
Mo	[9]	Me	18	12:14:26
Me	[5]	Mo	18	12:14:26
Mo	[8]	Ve	19	8:15:15
Su	[10]	Ma	19	13:57:35
Ma	[4]	Su	19	13:57:35
Ma	[8]	Mo	20	1:30:45
Su	[5]	Mo	20	2:03:56
Mo	[9]	Su	20	2:03:56
Ke	[8]	Mo	20	2:54:10
Ju	[8]	Mo	20	3:38:20
Su	[4]	Ra	20	12:18:46
Ra	[10]	Su	20	12:18:46
Su	[10]	Ke	20	12:18:46
Ke	[4]	Su	20	12:18:46
Mo	[C]	Sa	20	16:17:46
Su	[10]	Ju	20	23:44:01
Ju	[4]	Su	20	23:44:01
Mo	[8]	Me	21	0:16:26
Ma	[S]	Ra	21	14:39:30
Ma	[C]	Ke	21	14:39:30
Mo	[S]	Ve	21	17:20:34
Mo	[5]	Ke	22	8:53:38
Ke	[9]	Mo	22	8:53:38
Ra	[3]	Mo	22	8:53:38
Mo	[5]	Ma	22	9:33:49
Ma	[9]	Mo	22	9:33:49
Mo	[5]	Ju	22	10:06:02
Ju	[9]	Mo	22	10:06:02
Mo	[8]	Su	22	12:40:25
Ma	[C]	Ju	23	5:50:33
Mo	[S]	Me	23	10:02:14
Ve	[8]	Mo	24	0:09:44
Mo	[4]	Ke	24	12:49:08
Ke	[10]	Mo	24	12:49:08
Mo	[10]	Ra	24	12:49:08
Ra	[4]	Mo	24	12:49:08
Ju	[10]	Mo	24	14:25:40
Mo	[4]	Ju	24	14:25:40
Mo	[4]	Ma	24	15:16:43
Ma	[10]	Mo	24	15:16:43
Su	[S]	Mo	24	20:42:32
Sa	[3]	Mo	25	1:25:18
Me	[8]	Mo	25	18:05:03
Mo	[5]	Ve	26	5:25:40
Ve	[9]	Mo	26	5:25:40
Mo	[9]	Ra	26	15:23:51
Ra	[5]	Mo	26	15:23:51
Mo	[3]	Ke	26	15:23:51
Mo	[3]	Ju	26	17:22:34
Mo	[3]	Ma	26	19:30:14
Su	[8]	Mo	27	3:12:13
Mo	[10]	Sa	27	3:53:47
Sa	[4]	Mo	27	3:53:47
Su	[5]	Sa	27	12:46:50
Sa	[9]	Su	27	12:46:50
Mo	[5]	Me	28	1:25:55
Me	[9]	Mo	28	1:25:55
Mo	[4]	Ve	28	10:06:42
Ve	[10]	Mo	28	10:06:42
Mo	[8]	Ra	28	17:29:29
Mo	[9]	Sa	29	6:07:54
Sa	[5]	Mo	29	6:07:54
Mo	[5]	Su	29	9:22:09
Su	[9]	Mo	29	9:22:09
Mo	[4]	Me	30	9:22:27
Me	[10]	Mo	30	9:22:27
Mo	[3]	Ve	30	15:20:37
Mo	[S]	Ra	30	20:02:49
Mo	[C]	Ke	30	20:02:49
Mo	[C]	Ju	30	22:48:00
`;

const RAW_ASPECTS_DEC_2026 = `
Mo	[C]	Ma	1	3:32:52
Mo	[8]	Sa	1	9:04:34
Su	[10]	Mo	1	16:28:49
Mo	[4]	Su	1	16:28:49
Mo	[3]	Me	2	19:15:42
Ra	[8]	Mo	2	23:55:43
Mo	[S]	Sa	3	13:34:36
Mo	[3]	Su	4	1:40:36
Ve	[5]	Ra	4	2:52:16
Ra	[9]	Ve	4	2:52:16
Ke	[3]	Ve	4	2:52:16
Me	[4]	Ra	4	12:06:50
Ra	[10]	Me	4	12:06:50
Me	[10]	Ke	4	12:06:50
Ke	[4]	Me	4	12:06:50
Ra	[9]	Mo	5	5:51:43
Mo	[5]	Ra	5	5:51:43
Ke	[3]	Mo	5	5:51:43
Mo	[C]	Ve	5	7:42:04
Ju	[3]	Mo	5	9:33:37
Ma	[3]	Mo	5	17:33:20
Me	[10]	Ju	5	18:47:33
Ju	[4]	Me	5	18:47:33
Sa	[8]	Mo	5	20:18:40
Ju	[3]	Ve	6	14:53:31
Mo	[4]	Ra	7	14:14:21
Ra	[10]	Mo	7	14:14:21
Mo	[10]	Ke	7	14:14:21
Ke	[4]	Mo	7	14:14:21
Mo	[10]	Ju	7	18:27:15
Ju	[4]	Mo	7	18:27:15
Mo	[C]	Me	8	1:19:21
Mo	[10]	Ma	8	4:20:36
Ma	[4]	Mo	8	4:20:36
Mo	[5]	Sa	8	5:32:37
Sa	[9]	Mo	8	5:32:37
Su	[C]	Mo	9	5:04:30
Ma	[4]	Me	9	5:43:38
Me	[10]	Ma	9	5:43:38
Me	[5]	Sa	9	9:34:46
Sa	[9]	Me	9	9:34:46
Ma	[8]	Sa	10	0:46:08
Mo	[9]	Ke	10	0:47:39
Ke	[5]	Mo	10	0:47:39
Mo	[3]	Ra	10	0:47:39
Mo	[9]	Ju	10	5:28:18
Ju	[5]	Mo	10	5:28:18
Ve	[3]	Mo	10	11:45:50
Mo	[4]	Sa	10	16:46:58
Sa	[10]	Mo	10	16:46:58
Mo	[9]	Ma	10	17:13:23
Ma	[5]	Mo	10	17:13:23
Mo	[8]	Ke	12	12:22:25
Mo	[8]	Ju	12	17:21:40
Mo	[10]	Ve	13	4:16:14
Ve	[4]	Mo	13	4:16:14
Mo	[3]	Sa	13	4:37:43
Mo	[8]	Ma	13	6:37:39
Sa	[8]	Ve	13	9:10:39
Me	[3]	Mo	13	19:00:16
Su	[3]	Mo	14	15:06:02
Mo	[C]	Ra	14	23:13:21
Mo	[S]	Ke	14	23:13:21
Ma	[3]	Ve	15	2:24:27
Mo	[S]	Ju	15	4:19:42
Mo	[S]	Ma	15	18:36:27
Mo	[9]	Ve	15	19:28:53
Ve	[5]	Mo	15	19:28:53
Mo	[10]	Me	16	14:10:26
Me	[4]	Mo	16	14:10:26
Su	[4]	Mo	17	5:25:57
Mo	[10]	Su	17	5:25:57
Ke	[8]	Mo	17	8:02:04
Ju	[8]	Mo	17	13:07:26
Mo	[C]	Sa	17	23:44:08
Ma	[8]	Mo	18	4:01:55
Mo	[8]	Ve	18	7:56:37
Su	[3]	Ra	18	12:45:55
Su	[9]	Ke	18	12:45:55
Ke	[5]	Su	18	12:45:55
Me	[5]	Mo	19	5:44:57
Mo	[9]	Me	19	5:44:57
Mo	[5]	Ke	19	14:23:33
Ke	[9]	Mo	19	14:23:33
Ra	[3]	Mo	19	14:23:33
Su	[5]	Mo	19	16:36:03
Mo	[9]	Su	19	16:36:03
Mo	[5]	Ju	19	19:24:46
Ju	[9]	Mo	19	19:24:46
Mo	[5]	Ma	20	10:46:54
Ma	[9]	Mo	20	10:46:54
Mo	[S]	Ve	20	17:30:05
Su	[9]	Ju	21	5:04:51
Ju	[5]	Su	21	5:04:51
Mo	[8]	Me	21	17:59:34
Mo	[4]	Ke	21	18:35:53
Ke	[10]	Mo	21	18:35:53
Mo	[10]	Ra	21	18:35:53
Ra	[4]	Mo	21	18:35:53
Me	[9]	Ke	21	22:42:17
Ke	[5]	Me	21	22:42:17
Me	[3]	Ra	21	22:42:17
Ju	[10]	Mo	21	23:33:25
Mo	[4]	Ju	21	23:33:25
Mo	[8]	Su	22	1:02:48
Sa	[3]	Mo	22	9:41:48
Mo	[4]	Ma	22	15:24:17
Ma	[10]	Mo	22	15:24:17
Ve	[8]	Mo	23	0:50:49
Ju	[5]	Me	23	13:48:41
Me	[9]	Ju	23	13:48:41
Mo	[9]	Ra	23	21:20:05
Ra	[5]	Mo	23	21:20:05
Mo	[3]	Ke	23	21:20:05
Mo	[3]	Ju	24	2:16:32
Mo	[S]	Me	24	4:03:09
Su	[S]	Mo	24	7:45:28
Sa	[4]	Mo	24	12:26:33
Mo	[10]	Sa	24	12:26:33
Mo	[3]	Ma	24	18:44:50
Ve	[9]	Mo	25	7:02:20
Mo	[5]	Ve	25	7:02:20
Mo	[8]	Ra	25	23:26:54
Me	[8]	Mo	26	13:22:53
Su	[8]	Mo	26	13:55:29
Mo	[9]	Sa	26	14:51:01
Sa	[5]	Mo	26	14:51:01
Su	[C]	Me	26	23:13:39
Sa	[10]	Me	27	1:32:29
Me	[4]	Sa	27	1:32:29
Su	[4]	Sa	27	3:15:07
Sa	[10]	Su	27	3:15:07
Mo	[4]	Ve	27	13:18:28
Ve	[10]	Mo	27	13:18:28
Mo	[S]	Ra	28	1:52:56
Mo	[C]	Ke	28	1:52:56
Mo	[C]	Ju	28	6:58:56
Mo	[8]	Sa	28	17:53:10
Su	[9]	Mo	28	20:49:56
Mo	[5]	Su	28	20:49:56
Mo	[5]	Me	28	23:33:27
Me	[9]	Mo	28	23:33:27
Mo	[C]	Ma	29	1:29:30
Me	[9]	Ma	29	16:21:06
Ma	[5]	Me	29	16:21:06
Mo	[3]	Ve	29	20:53:49
Ra	[8]	Mo	30	5:31:02
Mo	[S]	Sa	30	22:25:15
Su	[10]	Mo	31	5:38:50
Mo	[4]	Su	31	5:38:50
Mo	[4]	Me	31	12:01:25
Me	[10]	Mo	31	12:01:25
Su	[9]	Ma	31	22:27:57
Ma	[5]	Su	31	22:27:57
`;

function parseRawAspects(
  rawText: string,
  monthKey: '2026-10' | '2026-11' | '2026-12'
): PlanetaryAspectEvent[] {
  const lines = rawText
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const events: PlanetaryAspectEvent[] = [];

  lines.forEach((line, idx) => {
    const match = line.match(/^([A-Za-z]{2})\s+\[([A-Za-z0-9]+)\]\s+([A-Za-z]{2})\s+(\d{1,2})\s+(\d{1,2}:\d{2}:\d{2})$/);
    if (!match) return;

    const fromPlanet = match[1] as PlanetCode;
    const aspect = match[2] as AspectCode;
    const toPlanet = match[3] as PlanetCode;
    const day = parseInt(match[4], 10);
    const time = match[5].padStart(8, '0');
    const isoDate = `${monthKey}-${String(day).padStart(2, '0')}`;

    const dedupeKey = `${isoDate}-${time}-${fromPlanet}-${aspect}-${toPlanet}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    events.push({
      id: `${monthKey}-${idx}-${fromPlanet}-${aspect}-${toPlanet}`,
      monthKey,
      isoDate,
      day,
      time,
      fromPlanet,
      aspect,
      toPlanet,
      rawText: `${fromPlanet} [${aspect}] ${toPlanet} (${isoDate} ${time})`,
    });
  });

  return events;
}

export const PLANETARY_ASPECTS_2026: PlanetaryAspectEvent[] = [
  ...parseRawAspects(RAW_ASPECTS_OCT_2026, '2026-10'),
  ...parseRawAspects(RAW_ASPECTS_NOV_2026, '2026-11'),
  ...parseRawAspects(RAW_ASPECTS_DEC_2026, '2026-12'),
];

export function getPlanetaryMovementsForDate(isoDate: string): {
  signEntries: SignEntryEvent[];
  nakshatraEntries: NakshatraEntryEvent[];
  aspects: PlanetaryAspectEvent[];
} {
  return {
    signEntries: SIGN_ENTRIES_2026.filter((s) => s.isoDate === isoDate),
    nakshatraEntries: NAKSHATRA_ENTRIES_2026.filter((n) => n.isoDate === isoDate),
    aspects: PLANETARY_ASPECTS_2026.filter((a) => a.isoDate === isoDate),
  };
}

export function getPlanetaryMovementsForMonth(monthKey: '2026-10' | '2026-11' | '2026-12'): {
  signEntries: SignEntryEvent[];
  nakshatraEntries: NakshatraEntryEvent[];
  aspects: PlanetaryAspectEvent[];
} {
  return {
    signEntries: SIGN_ENTRIES_2026.filter((s) => s.monthKey === monthKey),
    nakshatraEntries: NAKSHATRA_ENTRIES_2026.filter((n) => n.monthKey === monthKey),
    aspects: PLANETARY_ASPECTS_2026.filter((a) => a.monthKey === monthKey),
  };
}

export function formatTeluguDateFriendly(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthNum = parseInt(parts[1], 10);
  const dayNum = parseInt(parts[2], 10);

  const monthNamesTe: Record<number, string> = {
    1: 'జనవరి',
    2: 'ఫిబ్రవరి',
    3: 'మార్చి',
    4: 'ఏప్రిల్',
    5: 'మే',
    6: 'జూన్',
    7: 'జూలై',
    8: 'ఆగస్టు',
    9: 'సెప్టెంబర్',
    10: 'అక్టోబర్',
    11: 'నవంబర్',
    12: 'డిసెంబర్',
  };

  return `${dayNum} ${monthNamesTe[monthNum] || ''} ${year}`;
}

export function formatTeluguTime12Hr(timeStr: string): string {
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;
  const h24 = parseInt(parts[0], 10);
  const min = parts[1].padStart(2, '0');

  let periodTe = 'ఉదయం';
  if (h24 >= 0 && h24 < 5) {
    periodTe = 'తెల్లవారుజామున';
  } else if (h24 >= 5 && h24 < 12) {
    periodTe = 'ఉదయం';
  } else if (h24 >= 12 && h24 < 16) {
    periodTe = 'మధ్యాహ్నం';
  } else if (h24 >= 16 && h24 < 19) {
    periodTe = 'సాయంత్రం';
  } else {
    periodTe = 'రాత్రి';
  }

  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${periodTe} ${String(h12).padStart(2, '0')}:${min} ${ampm}`;
}

export function formatAspectInsightTe(event: PlanetaryAspectEvent): string {
  const from = PLANET_META[event.fromPlanet];
  const to = PLANET_META[event.toPlanet];

  if (event.aspect === 'C') {
    if ((event.fromPlanet === 'Su' && event.toPlanet === 'Mo') || (event.fromPlanet === 'Mo' && event.toPlanet === 'Su')) {
      return `${from.nameTe}, ${to.nameTe} ఒకే రాశిలో కలవడం (అమావాస్య సమయం) — పెద్దలను తలచుకోవడానికి, ప్రశాంతంగా పూజ చేసుకోవడానికి మంచి సమయం.`;
    }
    if ((event.fromPlanet === 'Mo' && event.toPlanet === 'Ju') || (event.fromPlanet === 'Ju' && event.toPlanet === 'Mo')) {
      return `చంద్రుడు, గురుడు ఒకే రాశిలో కలవడం (గజకేసరి యోగం) — మనసుకు ప్రశాంతత, చేతికి డబ్బు అందడం, ఇంట్లో శుభకార్యాల చర్చలకు ఎంతో మంచిది.`;
    }
    if ((event.fromPlanet === 'Mo' && event.toPlanet === 'Ve') || (event.fromPlanet === 'Ve' && event.toPlanet === 'Mo')) {
      return `చంద్రుడు, శుక్రుడు ఒకే రాశిలో కలవడం — కుటుంబంలో సంతోషం, కొత్త బట్టలు లేదా వస్తువులు కొనడం, శుభవార్తలు వినడం.`;
    }
    if ((event.fromPlanet === 'Ma' && event.toPlanet === 'Ju') || (event.fromPlanet === 'Ju' && event.toPlanet === 'Ma')) {
      return `కుజుడు, గురుడు ఒకే రాశిలో కలవడం — భూమి, ఇల్లు కొనాలనే ప్రయత్నాలు ఫలించడం, ఉద్యోగంలో ధైర్యంగా ముందుకు వెళ్లడం.`;
    }
    return `${from.nameTe} మరియు ${to.nameTe} ఒకే రాశిలో కలవడం — తలపెట్టిన పనులలో చురుకుదనం పెరుగుతుంది, ఆలోచించి నిర్ణయాలు తీసుకోవాలి.`;
  }

  if (event.aspect === 'S') {
    if ((event.fromPlanet === 'Su' && event.toPlanet === 'Mo') || (event.fromPlanet === 'Mo' && event.toPlanet === 'Su')) {
      return `సూర్యుడు, చంద్రుడు ఎదురెదురుగా పూర్ణ దృష్టి (పౌర్ణమి వెన్నెల బలం) — సత్యనారాయణ వ్రతం, లక్ష్మీదేవి పూజ మరియు కుటుంబ ఆనందానికి పరమ శుభం.`;
    }
    return `${from.nameTe} మరియు ${to.nameTe} ఎదురెదురుగా పూర్ణ దృష్టి — వ్యాపార భాగస్వామ్యం, భార్యాభర్తల మధ్య అన్యోన్యత మరియు నలుగురిలో గౌరవం పెరుగుతాయి.`;
  }

  if (event.aspect === '5' || event.aspect === '9') {
    return `${from.nameTe} నుండి ${to.nameTe} పై అదృష్ట శుభ దృష్టి — దైవ సహాయం, పిల్లల పురోగతి, రావలసిన డబ్బు చేతికి అందడం మరియు వ్యాపార లాభం.`;
  }

  if (event.aspect === '4' || event.aspect === '10') {
    return `${from.nameTe} నుండి ${to.nameTe} పై పని & గృహ బలాన్నిచ్చే దృష్టి — ఆఫీసు పనులు త్వరగా పూర్తి కావడం, ఇంటి అవసరాలు తీరడం మరియు వృత్తిలో గుర్తింపు.`;
  }

  if (event.aspect === '8') {
    return `${from.nameTe} నుండి ${to.nameTe} పై 8వ దృష్టి — ఏ పనిలోనైనా తొందరపాటు లేకుండా ఓపికగా వ్యవహరించడం మంచిది; శివ/నవగ్రహ స్మరణ శుభమిస్తుంది.`;
  }

  return `${from.nameTe} నుండి ${to.nameTe} పై ధైర్యాన్నిచ్చే 3వ దృష్టి — మీ సొంత కష్టంతో పనులు పూర్తి చేస్తారు, బంధుమిత్రుల సహాయం అందుతుంది.`;
}

export interface RashiDailyDrishtiPhalam {
  rashiId: string;
  rashiNameTe: string;
  rashiNameEn: string;
  lordPlanet: PlanetCode;
  lordNameTe: string;
  activeAspectTitleTe: string;
  activeAspectTimeTe: string;
  loukikaPhalamTe: string;
  loukikaPhalamEn: string;
  doTodayTe: string;
  avoidTodayTe: string;
  luckyTimeWindowTe: string;
  remedyShortTe: string;
  mood: 'auspicious' | 'moderate' | 'careful';
}

const TWELVE_RASHIS_CONFIG: {
  rashiId: string;
  rashiNameTe: string;
  rashiNameEn: string;
  lordPlanet: PlanetCode;
  lordNameTe: string;
}[] = [
  { rashiId: 'mesham', rashiNameTe: 'మేష రాశి', rashiNameEn: 'Aries', lordPlanet: 'Ma', lordNameTe: 'కుజుడు' },
  { rashiId: 'vrushabham', rashiNameTe: 'వృషభ రాశి', rashiNameEn: 'Taurus', lordPlanet: 'Ve', lordNameTe: 'శుక్రుడు' },
  { rashiId: 'mithunam', rashiNameTe: 'మిథున రాశి', rashiNameEn: 'Gemini', lordPlanet: 'Me', lordNameTe: 'బుధుడు' },
  { rashiId: 'karkatakam', rashiNameTe: 'కర్కాటక రాశి', rashiNameEn: 'Cancer', lordPlanet: 'Mo', lordNameTe: 'చంద్రుడు' },
  { rashiId: 'simham', rashiNameTe: 'సింహ రాశి', rashiNameEn: 'Leo', lordPlanet: 'Su', lordNameTe: 'సూర్యుడు' },
  { rashiId: 'kanya', rashiNameTe: 'కన్యా రాశి', rashiNameEn: 'Virgo', lordPlanet: 'Me', lordNameTe: 'బుధుడు' },
  { rashiId: 'tula', rashiNameTe: 'తులా రాశి', rashiNameEn: 'Libra', lordPlanet: 'Ve', lordNameTe: 'శుక్రుడు' },
  { rashiId: 'vruschikam', rashiNameTe: 'వృశ్చిక రాశి', rashiNameEn: 'Scorpio', lordPlanet: 'Ma', lordNameTe: 'కుజుడు' },
  { rashiId: 'dhanussu', rashiNameTe: 'ధనుస్సు రాశి', rashiNameEn: 'Sagittarius', lordPlanet: 'Ju', lordNameTe: 'గురుడు' },
  { rashiId: 'makaram', rashiNameTe: 'మకర రాశి', rashiNameEn: 'Capricorn', lordPlanet: 'Sa', lordNameTe: 'శని' },
  { rashiId: 'kumbham', rashiNameTe: 'కుంభ రాశి', rashiNameEn: 'Aquarius', lordPlanet: 'Sa', lordNameTe: 'శని' },
  { rashiId: 'meenam', rashiNameTe: 'మీన రాశి', rashiNameEn: 'Pisces', lordPlanet: 'Ju', lordNameTe: 'గురుడు' },
];

const PRACTICAL_OUTCOMES_BY_RASHI: Record<
  string,
  {
    auspiciousTe: string;
    moderateTe: string;
    carefulTe: string;
    auspiciousEn: string;
    moderateEn: string;
    carefulEn: string;
    doTodayTe: string;
    avoidTodayTe: string;
    luckyTimeWindowTe: string;
    remedyTe: string;
  }
> = {
  mesham: {
    auspiciousTe:
      'ఉద్యోగంలో మీ మాటకు విలువ పెరుగుతుంది. రావలసిన డబ్బు చేతికి అందుతుంది. భూమి లేదా ఇంటికి సంబంధించిన పనులు ముందుకు సాగుతాయి.',
    moderateTe:
      'రోజువారీ పనులు అనుకున్నట్లే పూర్తవుతాయి. బంధుమిత్రుల సహాయం అందుతుంది, అయితే ఖర్చుల విషయంలో కొంచెం లెక్క ప్రకారం నడుచుకోవాలి.',
    carefulTe:
      'పనులలో తొందరపాటు లేదా ఆవేశం పనికిరాదు. ఎవరితోనూ వాదనలకు వెళ్లకుండా ప్రశాంతంగా మీ పని మీరు చేసుకోవడం వల్ల ఇబ్బందులు తప్పుతాయి.',
    auspiciousEn: 'Strong progress in career and property matters; pending money arrives smoothly.',
    moderateEn: 'Steady completion of daily tasks with family support; keep expenses planned.',
    carefulEn: 'Avoid haste or arguments at work; calm patience brings smooth results today.',
    doTodayTe: 'పెండింగ్‌లో ఉన్న బ్యాంక్, ఆఫీసు లేదా స్థల సంబంధిత పనులు పూర్తి చేయండి.',
    avoidTodayTe: 'కోపంతో తొందరపాటు మాటలు అనడం, అనవసర వాదనలు.',
    luckyTimeWindowTe: 'ఉదయం 09:30 AM – 11:15 AM',
    remedyTe: 'సుబ్రహ్మణ్య స్వామి లేదా ఆంజనేయ స్వామి స్మరణ శుభం.',
  },
  vrushabham: {
    auspiciousTe:
      'కుటుంబంలో సంతోషకరమైన వాతావరణం ఉంటుంది. వ్యాపారంలో మంచి లాభం కనిపిస్తుంది. ఇంటికి కావాల్సిన విలువైన వస్తువులు కొనుగోలు చేస్తారు.',
    moderateTe:
      'ఆదాయం బాగుంటుంది కానీ ఇంటి అవసరాల కోసం ఖర్చులు కూడా ఉంటాయి. జీవిత భాగస్వామితో కలిసి తీసుకునే నిర్ణయాలు మేలు చేస్తాయి.',
    carefulTe:
      'డబ్బు లావాదేవీలలో మరియు హామీలు ఇచ్చే విషయంలో ఆచితూచి అడుగు వేయాలి. ఆహారం, విశ్రాంతి విషయంలో శ్రద్ధ వహించండి.',
    auspiciousEn: 'Family happiness, good business returns, and auspicious household purchases.',
    moderateEn: 'Balanced income and household expenses; joint family decisions bring benefit.',
    carefulEn: 'Be cautious with financial lending and health; rest well.',
    doTodayTe: 'కుటుంబ సభ్యులతో కలిసి ఆర్థిక ప్రణాళికలు, పొదుపు నిర్ణయాలు తీసుకోండి.',
    avoidTodayTe: 'ఎవరికీ ఆర్థిక పూచీకత్తు (Guarantee) ఇవ్వవద్దు.',
    luckyTimeWindowTe: 'ఉదయం 10:15 AM – 12:00 PM',
    remedyTe: 'శ్రీ మహాలక్ష్మి అమ్మవారికి దీపారాధన చేయడం విశేషం.',
  },
  mithunam: {
    auspiciousTe:
      'మీ తెలివితేటలతో ఆఫీసులో అందరి ప్రశంసలు పొందుతారు. కొత్త వ్యాపార ఒప్పందాలు, చదువు మరియు కమ్యూనికేషన్ పనులు వెంటనే ఫలిస్తాయి.',
    moderateTe:
      'బంధువుల రాకపోకలు, ఫోన్ ద్వారా శుభవార్తలు ఉంటాయి. ప్రయాణాలు అనుకూలిస్తాయి, అయితే పనులను వాయిదా వేయకుండా పూర్తి చేయాలి.',
    carefulTe:
      'మాట్లాడేటప్పుడు అపార్థాలు రాకుండా జాగ్రత్త పడాలి. ముఖ్యమైన కాగితాలు లేదా ఒప్పందాలపై సంతకం చేసే ముందు ఒకటికి రెండుసార్లు చదవండి.',
    auspiciousEn: 'Workplace appreciation, successful business talks, and educational progress.',
    moderateEn: 'Good news from relatives and favorable short travels; avoid delaying tasks.',
    carefulEn: 'Speak clearly to avoid misunderstandings and verify documents carefully.',
    doTodayTe: 'ముఖ్యమైన ఫోన్ కాల్స్, వ్యాపార చర్చలు మరియు ఇంటర్వ్యూలకు ప్రయత్నించండి.',
    avoidTodayTe: 'పనులను రేపటికి వాయిదా వేయడం, పూర్తిగా చదవకుండా సంతకాలు చేయడం.',
    luckyTimeWindowTe: 'ఉదయం 11:00 AM – మధ్యాహ్నం 12:45 PM',
    remedyTe: 'శ్రీ మహావిష్ణువు లేదా వేంకటేశ్వర స్వామి నామస్మరణ.',
  },
  karkatakam: {
    auspiciousTe:
      'మనసు ఎంతో ప్రశాంతంగా, ఉత్సాహంగా ఉంటుంది. తల్లిదండ్రుల ఆశీస్సులు, ఇంట్లో శుభకార్యాల ఆలోచనలు మరియు చేతికి ధనలాభం కలుగుతాయి.',
    moderateTe:
      'ఇంటి పనులు, కుటుంబ బాధ్యతలు సంతృప్తికరంగా పూర్తి చేస్తారు. పాత మిత్రులను కలుసుకుంటారు, మనోబలం పెరుగుతుంది.',
    carefulTe:
      'చిన్న చిన్న విషయాలకే ఎక్కువగా ఆలోచించి మనసు పాడుచేసుకోవద్దు. ప్రయాణాలలో మరియు ఆరోగ్యం విషయంలో జాగ్రత్త అవసరం.',
    auspiciousEn: 'Mental peace, blessings of elders, family celebrations, and financial inflow.',
    moderateEn: 'Household responsibilities progress smoothly with emotional stability.',
    carefulEn: 'Avoid overthinking minor issues; take care during travel and seasonal changes.',
    doTodayTe: 'తల్లిదండ్రుల ఆశీస్సులు తీసుకుని ఇంటి/కుటుంబ పనులు మొదలుపెట్టండి.',
    avoidTodayTe: 'చిన్న విషయాలకే అతిగా ఆలోచించి ఆందోళన పడటం.',
    luckyTimeWindowTe: 'ఉదయం 09:00 AM – 10:45 AM',
    remedyTe: 'పార్వతీ పరమేశ్వరుల ధ్యానం మనశ్శాంతిని ఇస్తుంది.',
  },
  simham: {
    auspiciousTe:
      'పైఅధికారుల నుండి పూర్తి మద్దతు లభిస్తుంది. ప్రభుత్వ పనులు, కోర్టు/ఆఫీసు వ్యవహారాలు మీకు అనుకూలంగా మారుతాయి. సమాజంలో గౌరవం పెరుగుతుంది.',
    moderateTe:
      'మీ ఆత్మవిశ్వాసంతో కష్టమైన పనులను కూడా సులభంగా పూర్తి చేస్తారు. పెద్దల సలహా తీసుకుని ముందుకు వెళ్లడం వల్ల మంచి లాభం ఉంటుంది.',
    carefulTe:
      'ఆఫీసులో లేదా ఇంట్లో పంతాలకు పోకుండా సర్దుకుపోవడం మంచిది. ఆరోగ్యం (తలనొప్పి/అలసట) విషయంలో తగిన విశ్రాంతి తీసుకోండి.',
    auspiciousEn: 'Support from superiors, success in official works, and rising social respect.',
    moderateEn: 'Confidence helps complete tough tasks; elders’ advice proves valuable.',
    carefulEn: 'Keep ego aside in discussions and take proper rest for health.',
    doTodayTe: 'పైఅధికారులను కలవడం, ప్రభుత్వ లేదా ఆఫీసు ముఖ్య పనులు పూర్తి చేయడం.',
    avoidTodayTe: 'పంతాలకు పోవడం, ఆఫీసులో సహోద్యోగులతో వాదనలు.',
    luckyTimeWindowTe: 'ఉదయం 08:30 AM – 10:15 AM',
    remedyTe: 'సూర్య నమస్కారం మరియు ఆదిత్య హృదయ స్మరణ.',
  },
  kanya: {
    auspiciousTe:
      'వ్యాపారంలో పెట్టిన పెట్టుబడులకు మంచి లాభం వస్తుంది. అప్పుల బాధలు తగ్గుతాయి. చదువు, అకౌంట్స్, సాఫ్ట్‌వేర్ రంగాల వారికి శుభవార్తలు అందుతాయి.',
    moderateTe:
      'ప్రణాళికాబద్ధంగా చేసే ప్రతి పనీ విజయాన్ని ఇస్తుంది. కుటుంబ సభ్యుల అవసరాలు తీరుస్తారు, ఖర్చులు అదుపులో ఉంటాయి.',
    carefulTe:
      'పని ఒత్తిడి ఎక్కువగా ఉండవచ్చు, అందుకే సమయానికి భోజనం చేయడం మర్చిపోవద్దు. ఇతరుల విషయాలలో అనవసర జోక్యం వద్దు.',
    auspiciousEn: 'Good returns on business investments, debt relief, and career good news.',
    moderateEn: 'Planned work succeeds and family needs are met within budget.',
    carefulEn: 'Manage work stress calmly and maintain timely food habits.',
    doTodayTe: 'రావలసిన బాకీలు అడగడం, వ్యాపార లెక్కలు మరియు చదువుపై దృష్టి పెట్టడం.',
    avoidTodayTe: 'ఇతరుల వ్యక్తిగత విషయాలలో జోక్యం చేసుకోవడం, భోజనం ఆలస్యం చేయడం.',
    luckyTimeWindowTe: 'మధ్యాహ్నం 12:00 PM – 01:30 PM',
    remedyTe: 'శ్రీ విష్ణు సహస్రనామ పారాయణం శుభప్రదం.',
  },
  tula: {
    auspiciousTe:
      'భార్యాభర్తల మధ్య అన్యోన్యత పెరుగుతుంది. కొత్త బట్టలు, బంగారం లేదా వాహన కొనుగోలు ప్రయత్నాలు ఫలిస్తాయి. వ్యాపారంలో కస్టమర్ల ఆదరణ పెరుగుతుంది.',
    moderateTe:
      'నలుగురితో కలుపుగోలుగా ఉంటూ పనులు చక్కబెట్టుకుంటారు. రావలసిన డబ్బు కొంతమేర చేతికి అందుతుంది, మనసు ఉల్లాసంగా ఉంటుంది.',
    carefulTe:
      'విలాసాల కోసం లేదా మొహమాటానికి పోయి ఎక్కువ ఖర్చు చేయవద్దు. భాగస్వామ్య వ్యాపారాలలో లెక్కలు స్పష్టంగా ఉంచుకోవడం మంచిది.',
    auspiciousEn: 'Marital harmony, auspicious purchases, and growing business patronage.',
    moderateEn: 'Friendly diplomacy resolves tasks and brings partial recovery of dues.',
    carefulEn: 'Avoid unnecessary luxury spending and keep partnership accounts clear.',
    doTodayTe: 'వ్యాపార విస్తరణ చర్చలు, ఇంటికి అవసరమైన శుభ కొనుగోళ్లు చేయండి.',
    avoidTodayTe: 'మొహమాటానికి పోయి అనవసర ఖర్చులు చేయడం.',
    luckyTimeWindowTe: 'సాయంత్రం 04:30 PM – 06:15 PM',
    remedyTe: 'లలితా దేవి లేదా లక్ష్మీ అమ్మవారి కుంకుమార్చన/స్మరణ.',
  },
  vruschikam: {
    auspiciousTe:
      'ఎప్పటినుండో ఆగిపోయిన పనులు ఈ రోజు వేగంగా పూర్తవుతాయి. కష్టానికి తగిన ప్రతిఫలం, ఉద్యోగంలో ప్రమోషన్ లేదా అదనపు ఆదాయం కనిపిస్తుంది.',
    moderateTe:
      'పట్టుదలతో ప్రయత్నిస్తే ఏ పనైనా సాధిస్తారు. సోదరులు లేదా మిత్రుల నుండి సమయానికి సహాయం అందుతుంది.',
    carefulTe:
      'వాహనాలు నడిపేటప్పుడు మరియు మాటలు మాట్లాడేటప్పుడు సంయమనం అవసరం. రహస్య విషయాలను అందరితో పంచుకోవద్దు.',
    auspiciousEn: 'Long-pending tasks finish rapidly; strong rewards and extra income.',
    moderateEn: 'Persistence brings success with timely support from friends and siblings.',
    carefulEn: 'Drive carefully, speak gently, and keep confidential plans private.',
    doTodayTe: 'నిలిచిపోయిన పనులను పట్టుదలతో మళ్లీ మొదలుపెట్టి పూర్తి చేయండి.',
    avoidTodayTe: 'మీ భవిష్యత్తు ప్రణాళికలను, ఆర్థిక రహస్యాలను అందరికీ చెప్పడం.',
    luckyTimeWindowTe: 'ఉదయం 10:30 AM – మధ్యాహ్నం 12:15 PM',
    remedyTe: 'ఆంజనేయ స్వామికి తమలపాకుల పూజ లేదా హనుమాన్ చాలీసా పఠనం.',
  },
  dhanussu: {
    auspiciousTe:
      'దైవబలం, పెద్దల ఆశీర్వాదం మీకు పూర్తిగా తోడుంటాయి. శుభకార్య ప్రయత్నాలు, విదేశీ/దూర ప్రయాణాలు మరియు ఆర్థిక రాబడి ఎంతో అనుకూలంగా ఉంటాయి.',
    moderateTe:
      'పిల్లల చదువు లేదా కెరీర్ గురించి శుభవార్త వింటారు. ఆధ్యాత్మిక కార్యక్రమాలలో పాల్గొంటారు, గౌరవ మర్యాదలు పెరుగుతాయి.',
    carefulTe:
      'ఎవరికైనా మాట ఇచ్చే ముందు ఆలోచించండి. ఖర్చులు పెరగకుండా బడ్జెట్ చూసుకోవడం మరియు పెద్దల సలహా పాటించడం మంచిది.',
    auspiciousEn: 'Divine grace, elders’ blessings, auspicious events, and financial prosperity.',
    moderateEn: 'Good news regarding children’s progress and spiritual peace.',
    carefulEn: 'Think before making promises and keep household budget in check.',
    doTodayTe: 'శుభకార్య చర్చలు, గురువులు/పెద్దల సలహాతో కొత్త పనుల ఆరంభం.',
    avoidTodayTe: 'ఆలోచించకుండా ఎవరికైనా పెద్ద హామీలు ఇవ్వడం.',
    luckyTimeWindowTe: 'ఉదయం 09:15 AM – 11:00 AM',
    remedyTe: 'గురు దత్తాత్రేయ లేదా దక్షిణామూర్తి శ్లోక పఠనం.',
  },
  makaram: {
    auspiciousTe:
      'చేసే పనిలో స్థిరత్వం, పైఅధికారుల ప్రశంసలు లభిస్తాయి. కష్టపడి పనిచేసే వారికి మంచి ఆర్థిక లాభం మరియు కొత్త బాధ్యతలు చేతికి వస్తాయి.',
    moderateTe:
      'పనులు కొంచెం నిదానంగా సాగినా చివరికి విజయం మీదే అవుతుంది. కుటుంబ బాధ్యతలను సమర్థవంతంగా నిర్వహిస్తారు.',
    carefulTe:
      'బద్ధకం లేదా నిరుత్సాహాన్ని దగ్గరకు రానివ్వకండి. కీళ్ల నొప్పులు లేదా అలసట రాకుండా తగిన విశ్రాంతి తీసుకోవాలి.',
    auspiciousEn: 'Career stability, recognition from bosses, and steady financial gains.',
    moderateEn: 'Slow but sure success in undertakings; family duties handled well.',
    carefulEn: 'Stay active without procrastination and take care of physical fatigue.',
    doTodayTe: 'వృత్తి/ఉద్యోగ బాధ్యతలను క్రమశిక్షణతో పూర్తి చేయడం, దీర్ఘకాలిక పెట్టుబడులు.',
    avoidTodayTe: 'పనులలో బద్ధకం లేదా నిరుత్సాహపడటం.',
    luckyTimeWindowTe: 'ఉదయం 10:45 AM – మధ్యాహ్నం 12:30 PM',
    remedyTe: 'శనివార నియమాలు, వేంకటేశ్వర స్వామి లేదా శివ ఆరాధన.',
  },
  kumbham: {
    auspiciousTe:
      'కొత్త ఆదాయ మార్గాలు కనిపిస్తాయి. మిత్రుల సహకారంతో పెద్ద పనులు పూర్తి చేస్తారు. వ్యాపార విస్తరణ మరియు సంఘంలో మంచి పేరు లభిస్తాయి.',
    moderateTe:
      'చేపట్టిన పనులలో పురోగతి ఉంటుంది. కుటుంబ సభ్యులతో కలిసి భవిష్యత్తు ప్రణాళికలు వేస్తారు, ఖర్చులకు తగిన రాబడి ఉంటుంది.',
    carefulTe:
      'ఇతరులను గుడ్డిగా నమ్మి డబ్బు అప్పుగా ఇవ్వవద్దు. మానసిక ఒత్తిడి తగ్గించుకోవడానికి కాసేపు ధ్యానం చేయడం మంచిది.',
    auspiciousEn: 'New income avenues, support from friends, and business expansion.',
    moderateEn: 'Steady progress in ongoing works and constructive family planning.',
    carefulEn: 'Avoid lending money blindly and practice calm meditation.',
    doTodayTe: 'కొత్త ఆదాయ మార్గాలు, మిత్రుల సహకారంతో చేసే వ్యాపార పనులు చేపట్టండి.',
    avoidTodayTe: 'ఎవరినీ గుడ్డిగా నమ్మి పెద్ద మొత్తంలో అప్పు ఇవ్వడం.',
    luckyTimeWindowTe: 'సాయంత్రం 04:00 PM – 05:45 PM',
    remedyTe: 'రుద్రాభిషేకం లేదా "ఓం నమః శివాయ" పంచాక్షరీ జపం.',
  },
  meenam: {
    auspiciousTe:
      'ఇంట్లో శుభకార్య సందడి, మనశ్శాంతి మరియు ఆర్థిక వెసులుబాటు కలుగుతాయి. ఉద్యోగ, వ్యాపారాలలో మీ నిజాయితీకి తగిన గుర్తింపు లభిస్తుంది.',
    moderateTe:
      'దైవ దర్శనాలు, పుణ్యకార్యాల పట్ల ఆసక్తి పెరుగుతుంది. రావలసిన బాకీలు వసూలవుతాయి, బంధువులతో సంతోషంగా గడుపుతారు.',
    carefulTe:
      'మొహమాటం వల్ల ఇతరుల భారాన్ని మీ నెత్తిమీద వేసుకోవద్దు. ప్రయాణాలలో మరియు ఖర్చుల విషయంలో జాగ్రత్తగా ఉండాలి.',
    auspiciousEn: 'Auspicious home atmosphere, peace of mind, and recognition for honesty.',
    moderateEn: 'Spiritual inclination, recovery of dues, and pleasant time with relatives.',
    carefulEn: 'Do not take on unnecessary burdens out of hesitation; watch travel expenses.',
    doTodayTe: 'దైవ ప్రార్థనతో రోజును ప్రారంభించి, రావలసిన డబ్బు వసూలుపై దృష్టి పెట్టండి.',
    avoidTodayTe: 'మొహమాటం కొద్దీ ఇతరుల కష్టాలను మీ నెత్తిమీద వేసుకోవడం.',
    luckyTimeWindowTe: 'ఉదయం 09:30 AM – 11:30 AM',
    remedyTe: 'గురు స్తోత్రం మరియు శ్రీ మహావిష్ణువు ఆరాధన.',
  },
};

export function getRashiDailyGrahaDrishtiPhalam(
  isoDate: string,
  rashiId: string
): RashiDailyDrishtiPhalam {
  const rashiIndex = TWELVE_RASHIS_CONFIG.findIndex((r) => r.rashiId === rashiId);
  const cfg = TWELVE_RASHIS_CONFIG[rashiIndex >= 0 ? rashiIndex : 0];
  const dayMovements = getPlanetaryMovementsForDate(isoDate);
  const outcomes = PRACTICAL_OUTCOMES_BY_RASHI[cfg.rashiId] || PRACTICAL_OUTCOMES_BY_RASHI.mesham;

  const lordAspects = dayMovements.aspects.filter(
    (a) => a.fromPlanet === cfg.lordPlanet || a.toPlanet === cfg.lordPlanet
  );

  const chosenAspect: PlanetaryAspectEvent | undefined =
    lordAspects.length > 0
      ? lordAspects[(rashiIndex >= 0 ? rashiIndex : 0) % lordAspects.length]
      : dayMovements.aspects.length > 0
      ? dayMovements.aspects[(rashiIndex >= 0 ? rashiIndex : 0) % dayMovements.aspects.length]
      : undefined;

  if (chosenAspect) {
    const fromMeta = PLANET_META[chosenAspect.fromPlanet];
    const toMeta = PLANET_META[chosenAspect.toPlanet];
    const aspMeta = ASPECT_META[chosenAspect.aspect];
    const friendlyTime = formatTeluguTime12Hr(chosenAspect.time);

    const isAuspicious =
      aspMeta.nature === 'auspicious' ||
      chosenAspect.fromPlanet === 'Ju' ||
      chosenAspect.toPlanet === 'Ju' ||
      chosenAspect.fromPlanet === 'Ve' ||
      chosenAspect.toPlanet === 'Ve';

    const isCareful =
      chosenAspect.aspect === '8' ||
      (chosenAspect.aspect === 'C' &&
        (chosenAspect.fromPlanet === 'Ra' ||
          chosenAspect.toPlanet === 'Ra' ||
          chosenAspect.fromPlanet === 'Sa' ||
          chosenAspect.toPlanet === 'Sa'));

    const mood: 'auspicious' | 'moderate' | 'careful' = isCareful
      ? 'careful'
      : isAuspicious
      ? 'auspicious'
      : 'moderate';

    const aspectHeadlineTe = `${fromMeta.nameTe} - ${toMeta.nameTe} (${aspMeta.shortTe})`;
    const baseOutcomeTe =
      mood === 'auspicious'
        ? outcomes.auspiciousTe
        : mood === 'careful'
        ? outcomes.carefulTe
        : outcomes.moderateTe;

    const baseOutcomeEn =
      mood === 'auspicious'
        ? outcomes.auspiciousEn
        : mood === 'careful'
        ? outcomes.carefulEn
        : outcomes.moderateEn;

    return {
      rashiId: cfg.rashiId,
      rashiNameTe: cfg.rashiNameTe,
      rashiNameEn: cfg.rashiNameEn,
      lordPlanet: cfg.lordPlanet,
      lordNameTe: cfg.lordNameTe,
      activeAspectTitleTe: aspectHeadlineTe,
      activeAspectTimeTe: friendlyTime,
      loukikaPhalamTe: `ఈ రోజు ${friendlyTime} కు ఏర్పడే ${fromMeta.nameTe} - ${toMeta.nameTe} (${aspMeta.shortTe}) ప్రభావంతో: ${baseOutcomeTe}`,
      loukikaPhalamEn: `Due to ${fromMeta.nameEn} - ${toMeta.nameEn} (${aspMeta.labelEn}) at ${chosenAspect.time.slice(0, 5)}: ${baseOutcomeEn}`,
      doTodayTe: outcomes.doTodayTe,
      avoidTodayTe: outcomes.avoidTodayTe,
      luckyTimeWindowTe: outcomes.luckyTimeWindowTe,
      remedyShortTe: outcomes.remedyTe,
      mood,
    };
  }

  const dateSeed = isoDate.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + (rashiIndex >= 0 ? rashiIndex : 0);
  const moodList: ('auspicious' | 'moderate' | 'careful')[] = ['auspicious', 'auspicious', 'moderate', 'careful'];
  const mood = moodList[dateSeed % moodList.length];
  const baseOutcomeTe =
    mood === 'auspicious'
      ? outcomes.auspiciousTe
      : mood === 'careful'
      ? outcomes.carefulTe
      : outcomes.moderateTe;
  const baseOutcomeEn =
    mood === 'auspicious'
      ? outcomes.auspiciousEn
      : mood === 'careful'
      ? outcomes.carefulEn
      : outcomes.moderateEn;

  return {
    rashiId: cfg.rashiId,
    rashiNameTe: cfg.rashiNameTe,
    rashiNameEn: cfg.rashiNameEn,
    lordPlanet: cfg.lordPlanet,
    lordNameTe: cfg.lordNameTe,
    activeAspectTitleTe: `రాశ్యాధిపతి ${cfg.lordNameTe} & చంద్ర దృష్టి బలం`,
    activeAspectTimeTe: 'రోజంతా (నిత్య గోచారం)',
    loukikaPhalamTe: `రాశ్యాధిపతి ${cfg.lordNameTe} మరియు నేటి చంద్ర గమన దృష్టి వల్ల: ${baseOutcomeTe}`,
    loukikaPhalamEn: `Guided by ruling planet ${PLANET_META[cfg.lordPlanet].nameEn} and Moon transit aspect: ${baseOutcomeEn}`,
    doTodayTe: outcomes.doTodayTe,
    avoidTodayTe: outcomes.avoidTodayTe,
    luckyTimeWindowTe: outcomes.luckyTimeWindowTe,
    remedyShortTe: outcomes.remedyTe,
    mood,
  };
}

export function getAllRashisDailyGrahaDrishti(isoDate: string): RashiDailyDrishtiPhalam[] {
  return TWELVE_RASHIS_CONFIG.map((r) => getRashiDailyGrahaDrishtiPhalam(isoDate, r.rashiId));
}

export function getDailyGrahaTransitShareLines(isoDate: string): string[] {
  const dayMovements = getPlanetaryMovementsForDate(isoDate);
  const lines: string[] = [];

  dayMovements.signEntries.forEach((s) => {
    lines.push(
      `• 🌟 *రాశి మార్పు (${formatTeluguTime12Hr(s.time)}):* ${s.planetTe} → ${s.signTe} ప్రవేశం (${s.significanceTe})`
    );
  });

  dayMovements.nakshatraEntries.forEach((n) => {
    lines.push(
      `• ✨ *నక్షత్ర మార్పు (${formatTeluguTime12Hr(n.time)}):* ${n.planetTe} → ${n.nakshatraTe} ప్రవేశం (${n.significanceTe})`
    );
  });

  if (dayMovements.aspects.length > 0) {
    dayMovements.aspects.slice(0, 4).forEach((ev) => {
      const fromMeta = PLANET_META[ev.fromPlanet];
      const toMeta = PLANET_META[ev.toPlanet];
      const aspMeta = ASPECT_META[ev.aspect];
      lines.push(
        `• 🪐 *${formatTeluguTime12Hr(ev.time)}:* ${fromMeta.nameTe} - ${toMeta.nameTe} (${aspMeta.shortTe}) — ${formatAspectInsightTe(ev)}`
      );
    });
  } else {
    lines.push(
      `• 🪐 *నేటి గ్రహ సంచారం:* సూర్య, చంద్ర, గురు, శుక్ర గ్రహాల శుభ దృష్టులతో దైనందిన పనులకు అనుకూల గోచార బలం.`
    );
  }

  return lines;
}

