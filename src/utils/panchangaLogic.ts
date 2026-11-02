import { DayData, LagnaPramanam } from '../types/panchangam';
import { NAKSHATRAS, ALL_RASHIS } from '../data/panchangamData';
import {
  getRashiDailyGrahaDrishtiPhalam,
  getDailyGrahaTransitShareLines,
} from '../data/planetaryMovements2026';

export interface TaraResult {
  taraNumber: number;
  taraName: string;
  isFavorable: boolean;
  grade: 'excellent' | 'good' | 'neutral' | 'caution' | 'danger';
  description: string;
}

export const TARA_DEFINITIONS: Record<number, { name: string; isFavorable: boolean; grade: TaraResult['grade']; desc: string }> = {
  1: { name: 'జన్మ తార', isFavorable: false, grade: 'neutral', desc: 'శారీరక శ్రమ, అప్రమత్తత అవసరం. పెద్ద నిర్ణయాలకు మధ్యమం.' },
  2: { name: 'సంపత్ తార', isFavorable: true, grade: 'excellent', desc: 'అత్యంత శుభప్రదం. ధనలాభం, నూతన ప్రాజెక్టులు మరియు కార్యసిద్ధి.' },
  3: { name: 'విపత్ తార', isFavorable: false, grade: 'caution', desc: 'ఆటంకాలు ఎదురయ్యే అవకాశం. ప్రయాణాలలో జాగ్రత్త వహించండి.' },
  4: { name: 'క్షేమ తార', isFavorable: true, grade: 'good', desc: 'శుభ ఫలితాలు, సుఖ శాంతులు, కుటుంబంలో ఆనందం లభిస్తుంది.' },
  5: { name: 'ప్రత్యక్ తార', isFavorable: false, grade: 'caution', desc: 'వ్యతిరేకతలు, అపార్థాలు రావచ్చు. సంయమనం పాటించండి.' },
  6: { name: 'సాధక తార', isFavorable: true, grade: 'excellent', desc: 'కార్య సాధన, ఉద్యోగ వ్యాపారాలలో విజయాలు, నూతన ఒప్పందాలు.' },
  7: { name: 'నైధన తార (వధ)', isFavorable: false, grade: 'danger', desc: 'అత్యంత అశుభం. కొత్త పనులు, శుభ కార్యాలు వాయిదా వేయడం శ్రేయస్కరం.' },
  8: { name: 'మిత్ర తార', isFavorable: true, grade: 'good', desc: 'మిత్రుల సహకారం, సంతోషం, సత్ఫలితాలు చేకూరుతాయి.' },
  9: { name: 'పరమ మిత్ర తార', isFavorable: true, grade: 'excellent', desc: 'పరమ శుభం. ఉన్నత అధికారుల ప్రోత్సాహం, సర్వజన సౌఖ్యం.' },
};

/**
 * Calculates Tara Balam for a devotee's Janma Nakshatra against the Day's Nakshatra
 */
export function calculateTaraBalam(janmaNakshatraIndex: number, dayNakshatraIndex: number): TaraResult {
  // ((Day - Janma + 27) % 9) + 1
  const diff = ((dayNakshatraIndex - janmaNakshatraIndex + 27) % 9) + 1;
  const def = TARA_DEFINITIONS[diff] || TARA_DEFINITIONS[1];

  return {
    taraNumber: diff,
    taraName: def.name,
    isFavorable: def.isFavorable,
    grade: def.grade,
    description: def.desc,
  };
}

/**
 * Extract time in minutes from midnight for a standard 12-hour formatted time (e.g. "09:43 AM", "01:12 PM")
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Finds which Lagna is currently active for the given minute from midnight
 */
export function findActiveLagna(lagnalu: LagnaPramanam[], currentMinutes: number): LagnaPramanam | null {
  for (const item of lagnalu) {
    const times = item.samayam.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/gi);
    if (times && times.length >= 2) {
      let startM = parseTimeToMinutes(times[0]);
      let endM = parseTimeToMinutes(times[1]);

      if (startM !== null && endM !== null) {
        // If endM is smaller than startM, it spans midnight (e.g. 10:56 PM to 01:03 AM)
        if (endM < startM) {
          if (currentMinutes >= startM || currentMinutes < endM) {
            return item;
          }
        } else {
          if (currentMinutes >= startM && currentMinutes < endM) {
            return item;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Checks if a given Rashi has Chandrashtamam on a specific day
 */
export function checkChandrashtamam(rashiId: string, day: DayData): boolean {
  const dayChandraText = day.chandra.chandrashtamam || '';
  const rashi = ALL_RASHIS.find((r) => r.id === rashiId);
  if (!rashi) return false;

  const rashiNameTelugu = rashi.name.split(' ')[0]; // e.g. "కుంభం", "మేషం"
  const stem = rashiNameTelugu.replace(/ం$/, ''); // e.g. "కుంభ", "మేష"

  return dayChandraText.includes(rashiNameTelugu) || dayChandraText.includes(stem);
}

export interface RashiDailyFortune {
  id: string;
  teluguName: string;
  englishName: string;
  symbol: string;
  vedicSymbolName: string;
  lord: string;
  luckyColor: string;
  baseLuckyNumber: number;
  gocharaHouse: number;
  houseLabel: string;
  status: 'favorable' | 'mixed' | 'caution';
  statusLabel: string;
  navagrahaTransitLabel: string;
  grahaSthitiLine: string;
  careerFinanceLine: string;
  wealthBusinessLine: string;
  familyHealthLine: string;
  educationYouthLine: string;
  healthVitalityLine: string;
  dairyamLine: string;
  remedyLine: string;
  mantraTe: string;
  mantraEn: string;
  fullSummary: string;
  summary: string;
  remedy: string;
  luckyNumber: number;
  englishNavagrahaLabel: string;
  englishFullSummary: string;
  englishWealthBusiness: string;
  englishEducationYouth: string;
  englishHealthVitality: string;
  englishDairyam: string;
  grahaDrishtiHeadlineTe: string;
  grahaDrishtiHeadlineEn: string;
  grahaDrishtiTimeTe: string;
  grahaDrishtiTimeEn: string;
  grahaDrishtiPhalamTe: string;
  grahaDrishtiPhalamEn: string;
  doTodayTe: string;
  doTodayEn: string;
  avoidTodayTe: string;
  avoidTodayEn: string;
  luckyTimeWindowTe: string;
  luckyTimeWindowEn: string;
  statusLabelEn: string;
  remedyEn: string;
  vedicSymbolNameEn: string;
  lordEn: string;
  luckyColorEn: string;
}

export const RASHI_META_LIST = [
  { id: 'mesham', teluguName: 'మేషం', englishName: 'Aries', symbol: '♈', vedicSymbolName: 'పొట్టేలు (Ram)', vedicSymbolNameEn: 'Ram (Mesha)', lord: 'కుజుడు', lordEn: 'Mars (Kuja)', luckyColor: 'ఎరుపు (Red)', luckyColorEn: 'Crimson Red', baseLuckyNumber: 9 },
  { id: 'vrushabham', teluguName: 'వృషభం', englishName: 'Taurus', symbol: '♉', vedicSymbolName: 'ఎద్దు (Bull)', vedicSymbolNameEn: 'Bull (Vrushabha)', lord: 'శుక్రుడు', lordEn: 'Venus (Shukra)', luckyColor: 'తెలుపు (White)', luckyColorEn: 'Pearl White', baseLuckyNumber: 6 },
  { id: 'mithunam', teluguName: 'మిథునం', englishName: 'Gemini', symbol: '♊', vedicSymbolName: 'మిథున జంట (Twins)', vedicSymbolNameEn: 'Twins (Mithuna)', lord: 'బుధుడు', lordEn: 'Mercury (Budha)', luckyColor: 'ఆకుపచ్చ (Green)', luckyColorEn: 'Emerald Green', baseLuckyNumber: 5 },
  { id: 'karkatakam', teluguName: 'కర్కాటకం', englishName: 'Cancer', symbol: '♋', vedicSymbolName: 'పీత (Crab)', vedicSymbolNameEn: 'Crab (Karkataka)', lord: 'చంద్రుడు', lordEn: 'Moon (Chandra)', luckyColor: 'ముత్యపు తెలుపు (Pearl)', luckyColorEn: 'Shimmering White', baseLuckyNumber: 2 },
  { id: 'simham', teluguName: 'సింహం', englishName: 'Leo', symbol: '♌', vedicSymbolName: 'సింహం (Lion)', vedicSymbolNameEn: 'Lion (Simha)', lord: 'సూర్యుడు', lordEn: 'Sun (Surya)', luckyColor: 'బంగారు పసుపు (Gold)', luckyColorEn: 'Golden Yellow', baseLuckyNumber: 1 },
  { id: 'kanya', teluguName: 'కన్య', englishName: 'Virgo', symbol: '♍', vedicSymbolName: 'కన్యక (Maiden)', vedicSymbolNameEn: 'Maiden (Kanya)', lord: 'బుధుడు', lordEn: 'Mercury (Budha)', luckyColor: 'లేత ఆకుపచ్చ (Light Green)', luckyColorEn: 'Light Green', baseLuckyNumber: 5 },
  { id: 'tula', teluguName: 'తుల', englishName: 'Libra', symbol: '♎', vedicSymbolName: 'త్రాసు (Scales)', vedicSymbolNameEn: 'Scales (Tula)', lord: 'శుక్రుడు', lordEn: 'Venus (Shukra)', luckyColor: 'గులాబీ / తెలుపు (Cream)', luckyColorEn: 'Rose Pink / Cream', baseLuckyNumber: 6 },
  { id: 'vruschikam', teluguName: 'వృశ్చికం', englishName: 'Scorpio', symbol: '♏', vedicSymbolName: 'తేలు (Scorpion)', vedicSymbolNameEn: 'Scorpion (Vruschika)', lord: 'కుజుడు', lordEn: 'Mars (Kuja)', luckyColor: 'కాషాయం / ఎరుపు (Coral)', luckyColorEn: 'Coral Red', baseLuckyNumber: 9 },
  { id: 'dhanussu', teluguName: 'ధనుస్సు', englishName: 'Sagittarius', symbol: '♐', vedicSymbolName: 'విల్లంబు (Bow & Arrow)', vedicSymbolNameEn: 'Bow & Arrow (Dhanus)', lord: 'గురుడు', lordEn: 'Jupiter (Guru)', luckyColor: 'పసుపు (Yellow)', luckyColorEn: 'Bright Yellow', baseLuckyNumber: 3 },
  { id: 'makaram', teluguName: 'మకరం', englishName: 'Capricorn', symbol: '♑', vedicSymbolName: 'మకరం (Sea-Goat)', vedicSymbolNameEn: 'Sea-Goat (Makara)', lord: 'శని', lordEn: 'Saturn (Shani)', luckyColor: 'నీలం (Blue)', luckyColorEn: 'Royal Blue', baseLuckyNumber: 8 },
  { id: 'kumbham', teluguName: 'కుంభం', englishName: 'Aquarius', symbol: '♒', vedicSymbolName: 'కుంభం (Water Pot)', vedicSymbolNameEn: 'Water Pot (Kumbha)', lord: 'శని', lordEn: 'Saturn (Shani)', luckyColor: 'లేత నీలం (Sky Blue)', luckyColorEn: 'Sky Blue', baseLuckyNumber: 4 },
  { id: 'meenam', teluguName: 'మీనం', englishName: 'Pisces', symbol: '♓', vedicSymbolName: 'మీన ద్వయం (Two Fishes)', vedicSymbolNameEn: 'Two Fishes (Meena)', lord: 'గురుడు', lordEn: 'Jupiter (Guru)', luckyColor: 'పసుపు / కాషాయం (Saffron)', luckyColorEn: 'Saffron Yellow', baseLuckyNumber: 7 },
];

export const GOCHARA_FORTUNES: Record<
  number,
  {
    houseLabel: string;
    status: 'favorable' | 'mixed' | 'caution';
    statusLabel: string;
    careerFinance: string;
    wealthBusiness: string;
    familyHealth: string;
    educationYouth: string;
    healthVitality: string;
    dairyam: string;
    remedy: string;
    mantraTe: string;
    mantraEn: string;
    enHouseLabel: string;
    enStatusLabel: string;
    enCareerFinance: string;
    enWealthBusiness: string;
    enFamilyHealth: string;
    enEducationYouth: string;
    enHealthVitality: string;
    enDairyam: string;
    enRemedy: string;
  }
> = {
  1: {
    houseLabel: 'జన్మ చంద్రుడు (1వ తను స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం • తేజస్సు',
    careerFinance: 'ఉద్యోగంలో మీ మాటకు, నిర్ణయాలకు ఉన్నతాధికారుల నుండి పూర్తి మద్దతు లభిస్తుంది. నూతన బాధ్యతలు స్వీకరిస్తారు, సహోద్యోగుల సహకారంతో పెండింగ్ పనులు వేగంగా పూర్తి చేస్తారు.',
    wealthBusiness: 'వ్యాపారస్తులకు నూతన ఒప్పందాలు, ఖాతాదారుల ఆదరణ పెరుగుతుంది. రావలసిన బాకీలు చేతికి అందుతాయి. బంగారం లేదా గృహోపకరణాల కొనుగోలుకు అనుకూల సమయం.',
    familyHealth: 'కుటుంబ సభ్యులతో ఆనందంగా గడుపుతారు. బంధుమిత్రుల రాకతో గృహంలో పండుగ వాతావరణం నెలకొంటుంది. వివాహాది శుభకార్య చర్చలు ముందుకు సాగుతాయి.',
    educationYouth: 'విద్యార్థులకు ఏకాగ్రత, జ్ఞాపకశక్తి పెరుగుతాయి. పోటీ పరీక్షలు మరియు ఇంటర్వ్యూలలో ఆశించిన శుభ ఫలితాలు సాధిస్తారు.',
    healthVitality: 'శారీరక ఉత్సాహం, మానసిక ప్రశాంతత బాగుంటాయి. ఆయుర్వేద నియమాలు, సాత్వికాహారం తీసుకోవడం వల్ల మరింత తేజస్సు కలుగుతుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: ఆత్మవిశ్వాసంతో ముందడుగు వేయండి. తలపెట్టిన ప్రతి పనిలోనూ మీ సంకల్ప బలమే మీకు తిరుగులేని విజయాన్ని చేకూరుస్తుంది.',
    remedy: 'శివాభిషేకం లేదా శ్రీ లక్ష్మీ నారాయణుల దర్శనం, తెల్లని పుష్పాలతో అర్చన శ్రేయస్కరం',
    mantraTe: 'ఓం నమో నారాయణాయ • ఓం చంద్రమసే నమః (11 సార్లు)',
    mantraEn: 'Om Namo Narayanaya • Om Chandramase Namah (11 times)',
    enHouseLabel: 'Janma Chandra (1st House)',
    enStatusLabel: 'Auspicious • Vitality',
    enCareerFinance: 'Leadership decisions gain full support from superiors; new responsibilities bring recognition.',
    enWealthBusiness: 'Favorable business agreements, steady cash inflow, and auspicious household purchases.',
    enFamilyHealth: 'Warmth in family relationships, arrival of relatives, and positive marriage discussions.',
    enEducationYouth: 'Sharp concentration for students and encouraging results in interviews and competitive exams.',
    enHealthVitality: 'Good physical stamina and mental serenity throughout the day.',
    enDairyam: 'Courage: Step forward boldly with faith; your personal determination brings assured success.',
    enRemedy: 'Perform Shiva Puja or Lakshmi Narayana Archana with white flowers',
  },
  2: {
    houseLabel: 'ధన స్థాన చంద్రుడు (2వ కుటుంబ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం • వాక్సంయమనం',
    careerFinance: 'ఉద్యోగంలో సహోద్యోగులతో మాట్లాడేటప్పుడు సంయమనం అవసరం. అధికారిక పత్రాలు, ఈమెయిల్స్ పంపే ముందు మరోసారి పరిశీలించడం మంచిది.',
    wealthBusiness: 'ఆర్థిక వ్యవహారాలలో ఆచితూచి అడుగు వేయాలి. వ్యాపార లావాదేవీలలో స్పష్టత పాటించండి, హామీలు ఇవ్వడం లేదా తొందరపాటు పెట్టుబడులు ఈ రోజు వాయిదా వేయండి.',
    familyHealth: 'మాటతీరులో మృదుత్వం పాటిస్తే కుటుంబంలో శాంతి, సామరస్యం నిలుస్తాయి. కుటుంబ పెద్దల సలహాలను గౌరవించడం వల్ల అపార్థాలు తొలగుతాయి.',
    educationYouth: 'విద్యార్థులు పక్కదారి పట్టకుండా సమయపాలన పాటించాలి. విదేశీ విద్యా ప్రయత్నాలలో పత్రాల పరిశీలన ముఖ్యం.',
    healthVitality: 'గొంతు, దంతాలు లేదా కంటి సమస్యల పట్ల కొద్దిపాటి శ్రద్ధ అవసరం. వేడి పదార్థాలు తగ్గించి తగినంత నీరు త్రాగాలి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: ఆర్థిక ఒడిదుడుకులకు భయపడకండి. శాంతంగా ఆలోచించి నిర్ణయాలు తీసుకుంటే ప్రతి సమస్యకు సులభమైన పరిష్కారం దొరుకుతుంది.',
    remedy: 'శ్రీ లక్ష్మీ గణపతి స్తోత్ర పఠనం, గోమాతకు బెల్లం మరియు అరటిపండ్లు సమర్పించడం',
    mantraTe: 'ఓం శ్రీం గం సౌమ్యాయ గణపతయే వరవరద సర్వజనమ్మే వశమానయ స్వాహా',
    mantraEn: 'Om Shreem Gam Saumyaya Ganapataye Namah (11 times)',
    enHouseLabel: 'Dhana Sthana (2nd House)',
    enStatusLabel: 'Moderate • Mindful Speech',
    enCareerFinance: 'Maintain diplomatic communication at work and double-check official documents.',
    enWealthBusiness: 'Exercise prudence in financial commitments and avoid hasty speculative investments today.',
    enFamilyHealth: 'Cultivate gentleness in communication to preserve joyful domestic harmony.',
    enEducationYouth: 'Students should follow a strict study schedule and avoid distractions.',
    enHealthVitality: 'Take mild care of throat, eyes, and hydration levels.',
    enDairyam: 'Courage: Do not worry about temporary financial delays; calm wisdom unlocks the right solutions.',
    enRemedy: 'Chant Sri Lakshmi Ganapathi Stotram and offer jaggery to Gau Mata',
  },
  3: {
    houseLabel: 'తృతీయ చంద్రుడు (3వ పరాక్రమ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం • జయం',
    careerFinance: 'చేపట్టిన పనులలో తిరుగులేని విజయం లభిస్తుంది. ఉద్యోగంలో పదోన్నతి సూచనలు, పై అధికారుల ప్రశంసలు మరియు నూతన అవకాశాలు లభిస్తాయి.',
    wealthBusiness: 'వ్యాపార విస్తరణకు, కొత్త శాఖల ప్రారంభానికి మరియు వాణిజ్య ఒప్పందాలకు అత్యంత అనుకూలం. ఆశించిన ధనలాభం మరియు ఆర్థిక స్థిరత్వం చేకూరుతుంది.',
    familyHealth: 'సోదరులు, సోదరీమణులు మరియు ఆప్త మిత్రుల పూర్తి సహకారం అందుతుంది. శుభవార్తల శ్రవణం కుటుంబానికి ఆనందాన్ని ఇస్తుంది.',
    educationYouth: 'క్రీడలు, సాంకేతిక విద్య, కమ్యూనికేషన్ మరియు సాఫ్ట్‌వేర్ రంగాల వారికి విశేష పురోగతి ఉంటుంది. నూతన నైపుణ్యాలు నేర్చుకుంటారు.',
    healthVitality: 'శారీరక దృఢత్వం, నూతనోత్సాహం వెల్లివిరుస్తాయి. స్వల్ప ప్రయాణాలు ఆహ్లాదాన్ని, కార్యసిద్ధిని ఇస్తాయి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మీ ధైర్య సాహసాలకు ఇది విజయ సమయం! ఉత్సాహంతో ముందడుగు వేయండి, దైవానుగ్రహం మీ వెంటే ఉంది.',
    remedy: 'శ్రీ సుబ్రహ్మణ్య స్వామి ఆరాధన, ఆంజనేయ దండకం లేదా సుందరకాండ పఠనం',
    mantraTe: 'ఓం శరవణభవాయ నమః • ఓం హనుమతే నమః (21 సార్లు)',
    mantraEn: 'Om Sharavanabhavaya Namah • Om Hanumate Namah (21 times)',
    enHouseLabel: 'Parakrama Sthana (3rd House)',
    enStatusLabel: 'Highly Favorable • Victory',
    enCareerFinance: 'Exceptional progress, timely completion of projects, and career advancement.',
    enWealthBusiness: 'Lucrative rewards in business endeavors and favorable commercial expansion.',
    enFamilyHealth: 'Complete support from siblings and close allies; auspicious family news.',
    enEducationYouth: 'Great momentum for IT, engineering, media, and competitive exam aspirants.',
    enHealthVitality: 'Energetic physical health and fruitful short journeys.',
    enDairyam: 'Courage: An empowering transit for decisive action; your courage leads to triumph.',
    enRemedy: 'Worship Lord Subrahmanya and chant Hanuman Dandakam',
  },
  4: {
    houseLabel: 'చతుర్థ చంద్రుడు (4వ సుఖ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం • గృహ శ్రద్ధ',
    careerFinance: 'వృత్తి ఉద్యోగాలలో పనిభారం కొంత ఎక్కువగా ఉండవచ్చు. సహనంతో బాధ్యతలను నిర్వర్తించండి, కార్యాలయ రాజకీయాలకు దూరంగా ఉండటం శ్రేయస్కరం.',
    wealthBusiness: 'స్థిరాస్తి, భూమి లేదా వాహన కొనుగోలు వ్యవహారాలలో కీలక అగ్రిమెంట్లు ఈ రోజు వాయిదా వేయడం లేదా న్యాయ నిపుణుల సలహా తీసుకోవడం మంచిది.',
    familyHealth: 'గృహ సంబంధ విషయాలలో బాధ్యతలు పెరుగుతాయి. తల్లిగారి ఆరోగ్యం, సౌఖ్యం పట్ల ప్రత్యేక శ్రద్ధ వహించండి.',
    educationYouth: 'విద్యార్థులు ప్రశాంత వాతావరణంలో చదువుకోవాలి. మానసిక ఒత్తిడి తగ్గించుకోవడానికి ప్రాణాయామం చేయడం మంచిది.',
    healthVitality: 'ఛాతీ, జీర్ణక్రియ లేదా అలసట విషయంలో జాగ్రత్త అవసరం. ప్రయాణాలలో వాహన వేగాన్ని నియంత్రించండి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మానసిక ఒత్తిడికి లోనుకాకండి. విశ్రాంతి తీసుకుంటూ ధ్యానం చేయండి. శాంతితో ఉండడం వల్ల ఆటంకాలు వాటంతట అవే తొలగిపోతాయి.',
    remedy: 'శ్రీ దుర్గాదేవి స్తుతి, అమ్మవారికి కుంకుమార్చన లేదా పాలతో అభిషేకం',
    mantraTe: 'ఓం దుం దుర్గాయై నమః • సర్వమంగళ మాంగళ్యే శివే సర్వార్థ సాధికే',
    mantraEn: 'Om Dum Durgayai Namah (11 times)',
    enHouseLabel: 'Chaturtha Sthana (4th House)',
    enStatusLabel: 'Moderate • Domestic Care',
    enCareerFinance: 'Workplace demands require steady focus; stay away from office politics.',
    enWealthBusiness: 'Postpone major property or vehicle contracts until thorough verification.',
    enFamilyHealth: 'Pay attention to mother’s well-being and maintain domestic tranquility.',
    enEducationYouth: 'Study in a calm environment and practice breathing exercises for focus.',
    enHealthVitality: 'Ensure proper digestion and drive carefully during commutes.',
    enDairyam: 'Courage: Do not succumb to mental anxiety; peaceful patience will smooth out all friction.',
    enRemedy: 'Recite Sri Durga Kavacham and offer Kumkumarchana',
  },
  5: {
    houseLabel: 'పంచమ చంద్రుడు (5వ పూర్వపుణ్య స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం • జ్ఞాన లాభం',
    careerFinance: 'విద్యా, బోధన, పరిశోధన, సలహాదారులు మరియు సృజనాత్మక రంగాల వారికి అనుకూలం. నూతన ప్రాజెక్టులలో అనుభవజ్ఞుల సలహా తప్పనిసరిగా తీసుకోండి.',
    wealthBusiness: 'షేర్ మార్కెట్ లేదా ఊహాజనిత పెట్టుబడులలో తొందరపాటు వద్దు. దీర్ఘకాలిక ప్రణాళికలు మాత్రమే ఆర్థిక భద్రతను ఇస్తాయి.',
    familyHealth: 'సంతాన సంబంధ విషయాలలో శుభ పరిణామాలు లేదా వారి భవిష్యత్తుపై ముఖ్య చర్చలు జరుగుతాయి. కులదేవత ఆరాధన మనశ్శాంతిని ఇస్తుంది.',
    educationYouth: 'ఉన్నత విద్య, శాస్త్ర పరిశోధన మరియు కళారంగాల విద్యార్థులకు నూతన ఆలోచనలు స్ఫురిస్తాయి.',
    healthVitality: 'ఉదర సంబంధమైన ఆహార నియమాలు పాటించాలి. సమయానికి భోజనం చేయడం, నడక ఆరోగ్యానికి మేలు చేస్తాయి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మీ ఆలోచనలు సన్మార్గంలో ఉన్నాయి. పూర్వపుణ్యం మీకు రక్షగా నిలుస్తుంది, కలవరపడకుండా ముందుకు సాగండి.',
    remedy: 'శ్రీ మేధా దక్షిణామూర్తి లేదా దత్తాత్రేయ స్వామి స్మరణ, శనగల దానం',
    mantraTe: 'ఓం నమో భగవతే దక్షిణామూర్తయే మహ్యం మేధాం ప్రజ్ఞాం प्रयच्छ స్వాహా',
    mantraEn: 'Om Namo Bhagavate Dakshinamurthaye Namah (11 times)',
    enHouseLabel: 'Panchama Sthana (5th House)',
    enStatusLabel: 'Mixed-Good • Wisdom',
    enCareerFinance: 'Intellectual pursuits, teaching, and creative enterprises yield steady progress.',
    enWealthBusiness: 'Avoid short-term speculation; focus on long-term financial planning.',
    enFamilyHealth: 'Constructive discussions regarding children’s future; Kuladevata prayer brings peace.',
    enEducationYouth: 'Favorable insights for researchers, scholars, and fine arts students.',
    enHealthVitality: 'Follow timely meals and gentle walking for digestive balance.',
    enDairyam: 'Courage: Your past good deeds protect you; stay grounded and make decisions thoughtfully.',
    enRemedy: 'Chant Sri Medha Dakshinamurthy Stotram',
  },
  6: {
    houseLabel: 'షష్ఠ చంద్రుడు (6వ శత్రుజయ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం • శత్రుజయం',
    careerFinance: 'ఉద్యోగంలో మీ కష్టానికి తగిన గుర్తింపు లభిస్తుంది. పెండింగ్‌లో ఉన్న ఫైళ్లు, అధికారిక పనులు పరిష్కారమవుతాయి. పోటీదారులపై పైచేయి సాధిస్తారు.',
    wealthBusiness: 'రుణ విముక్తి ప్రయత్నాలు ఫలిస్తాయి. పాత బాకీలు వసూలవుతాయి, వ్యాపారంలో ఆటంకాలు తొలగి లాభాల బాట పడతారు.',
    familyHealth: 'కుటుంబంలోని పాత విభేదాలు సమసిపోయి ఐకమత్యం పెరుగుతుంది. బంధువులతో సత్సంబంధాలు మెరుగుపడతాయి.',
    educationYouth: 'పోటీ పరీక్షలు, ప్రభుత్వ ఉద్యోగ ప్రయత్నాలు మరియు న్యాయ/వైద్య విద్య చదివేవారికి అత్యంత అనుకూలమైన రోజు.',
    healthVitality: 'ఆరోగ్యం కుదుటపడుతుంది. దీర్ఘకాలిక అనారోగ్య సమస్యల నుండి ఉపశమనం, శారీరక శక్తి లభిస్తాయి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: ఎలాంటి వ్యతిరేకతలైనా మీ ముందు తలవంచుతాయి. అడ్డంకులను ధైర్యంగా ఎదుర్కొని తిరుగులేని విజయం సాధించండి.',
    remedy: 'శ్రీ విష్ణు సహస్రనామ స్తోత్ర పారాయణం లేదా లక్ష్మీ నరసింహ స్వామి ఆరాధన',
    mantraTe: 'ఓం ఉగ్రం వీరం మహావిష్ణుం జ్వలంతం సర్వతోముఖమ్ • నృసింహం భీషణం భద్రం మృత్యోర్మృత్యుం నమామ్యహమ్',
    mantraEn: 'Om Namo Bhagavate Narasimhaya • Sri Vishnu Sahasranamam',
    enHouseLabel: 'Shashtha Sthana (6th House)',
    enStatusLabel: 'Auspicious • Victory',
    enCareerFinance: 'Recognition of hard work, clearance of pending files, and triumph over competitors.',
    enWealthBusiness: 'Relief from debts, recovery of dues, and smooth business operations.',
    enFamilyHealth: 'Old domestic misunderstandings resolve peacefully, restoring family unity.',
    enEducationYouth: 'Highly favorable for competitive exams, medical, and legal studies.',
    enHealthVitality: 'Noticeable recovery in health and renewed physical vigor.',
    enDairyam: 'Courage: No obstacle can stop your momentum; courageously claim your rightful progress.',
    enRemedy: 'Chant Sri Vishnu Sahasranamam or worship Lord Lakshmi Narasimha',
  },
  7: {
    houseLabel: 'సప్తమ చంద్రుడు (7వ కళత్ర స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం • సౌభాగ్యం',
    careerFinance: 'ఉద్యోగంలో నూతన పరిచయాలు, ప్రజాసంబంధాలు (PR) మరియు క్లయింట్ మీటింగ్‌లు విజయవంతమవుతాయి. విదేశీ వ్యవహారాలు అనుకూలిస్తాయి.',
    wealthBusiness: 'భాగస్వామ్య వ్యాపారాలు విశేషంగా లాభిస్తాయి. నూతన వ్యాపార ఒప్పందాలు, హోల్‌సేల్ మరియు రిటైల్ వర్తకులకు మంచి ధనలాభం కలుగుతుంది.',
    familyHealth: 'జీవిత భాగస్వామితో అన్యోన్యత పెరుగుతుంది. అవివాహితులకు శుభ వివాహ సంబంధాలు కుదిరే సూచనలు ఉన్నాయి. సామాజిక గౌరవం పెరుగుతుంది.',
    educationYouth: 'ఉన్నత విద్య కొరకు విదేశాలకు వెళ్లాలనుకునే విద్యార్థులకు శుభవార్తలు అందుతాయి. గ్రూప్ స్టడీస్ ఫలిస్తాయి.',
    healthVitality: 'మనస్సు ప్రফুল్లంగా ఉంటుంది. సుఖవంతమైన ప్రయాణాలు మరియు ఆరోగ్యకరమైన దినచర్య కొనసాగుతుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: అనుకూలమైన గ్రహబలం మీకు రక్షగా ఉంది. సత్సంబంధాలు కాపాడుకుంటూ నమ్మకంతో ముందుకు వెళ్లండి.',
    remedy: 'శ్రీ లలితా త్రిపురసుందరి అష్టోత్తర శతనామ స్తోత్రం, సువాసినులకు తాంబూల దానం',
    mantraTe: 'ఓం ఐం హ్రీం శ్రీం శ్రీ మాత్రే నమః (21 సార్లు)',
    mantraEn: 'Om Aim Hreem Shreem Sri Matre Namah (21 times)',
    enHouseLabel: 'Saptama Sthana (7th House)',
    enStatusLabel: 'Auspicious • Harmony',
    enCareerFinance: 'Public relations, client meetings, and overseas collaborations succeed.',
    enWealthBusiness: 'Partnership ventures and trade agreements generate strong profits.',
    enFamilyHealth: 'Spousal harmony flourishes; favorable marriage alliances for eligible singles.',
    enEducationYouth: 'Positive news for overseas education and collaborative academic projects.',
    enHealthVitality: 'Cheerful mental state and comfortable journeys.',
    enDairyam: 'Courage: Strong cosmic blessings surround you; proceed with heartfelt trust.',
    enRemedy: 'Chant Sri Lalita Tripura Sundari Ashtottaram',
  },
  8: {
    houseLabel: 'అష్టమ చంద్రుడు (చంద్రాష్టమం • 8వ స్థానం)',
    status: 'caution',
    statusLabel: 'చంద్రాష్టమం • జాగ్రత్త',
    careerFinance: 'నేడు చంద్రాష్టమ ప్రభావం ఉన్నందున ఉద్యోగంలో వాదోపవాదాలకు దూరంగా ఉండండి. రొటీన్ పనులపై మాత్రమే దృష్టి పెట్టండి, కీలక మార్పులు వాయిదా వేయండి.',
    wealthBusiness: 'పెద్ద మొత్తంలో ఆర్థిక లావాదేవీలు, కొత్త అప్పులు లేదా నూతన పెట్టుబడులు ఈ రోజు చేయకపోవడం ఉత్తమం. ఆర్థిక విషయాల్లో అప్రమత్తత అవసరం.',
    familyHealth: 'కుటుంబ సభ్యులతో ఓర్పుగా వ్యవహరించండి. చిన్న విషయాలను పెద్దవి చేసుకోకుండా మౌనం, చిరునవ్వు పాటించడం గృహ శాంతిని కాపాడుతుంది.',
    educationYouth: 'విద్యార్థులు పరీక్షల సమయంలో తొందరపాటు లేకుండా ప్రశ్నలను పూర్తిగా చదివి సమాధానాలు రాయాలి.',
    healthVitality: 'ప్రయాణాలలో అత్యంత అప్రమత్తత అవసరం. సమయానికి ఆహారం, తగినంత నిద్ర మరియు విశ్రాంతి తీసుకోవాలి.',
    dairyam: 'ధైర్యం & మానసిక భరోసా: చంద్రాష్టమం ఉందని భయపడాల్సిన పనిలేదు! ఇది కేవలం 2 రోజుల తాత్కాలిక గ్రహ పరీక్ష మాత్రమే. శాంతంగా, శివస్మరణతో ఉంటే ఎలాంటి ఆపదలైనా తొలగిపోతాయి.',
    remedy: 'శివాభిషేకం, "ఓం నమః శివాయ" పంచాక్షరీ జపం మరియు చంద్ర కవచ పఠనం తప్పనిసరి',
    mantraTe: 'ఓం ত্র్యంబకం యజామహే సుగంధిం పుష్టివర్ధనమ్ • ఉర్వారొకమివ బంధనాన్మృత్యోర్ముక్షీయ మామృతాత్',
    mantraEn: 'Om Namah Shivaya • Maha Mrityunjaya Mantra (21 times)',
    enHouseLabel: 'Ashtama Chandra (Chandrashtamam • 8th House)',
    enStatusLabel: 'Chandrashtamam • Caution',
    enCareerFinance: 'Focus on routine workplace duties and avoid heated arguments or major career switches today.',
    enWealthBusiness: 'Postpone major financial commitments, loans, or speculative ventures for two days.',
    enFamilyHealth: 'Practice patience with family members; calm silence prevents misunderstandings.',
    enEducationYouth: 'Read exam questions carefully and avoid rushing through assignments.',
    enHealthVitality: 'Exercise caution during travel and prioritize restful sleep.',
    enDairyam: 'Courage & Reassurance: Do not be frightened by Chandrashtamam! With steady mindfulness and Shiva prayer, divine grace shields you completely.',
    enRemedy: 'Perform Shiva Archana and chant Om Namah Shivaya 108 times',
  },
  9: {
    houseLabel: 'నవమ చంద్రుడు (9వ భాగ్య స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం • దైవానుగ్రహం',
    careerFinance: 'ఉద్యోగంలో పెద్దల, గురువుల ఆశీస్సులు లభిస్తాయి. దూరప్రాంత లేదా విదేశీ వ్యవహారాలు అనుకూలిస్తాయి, ధర్మబద్ధమైన నిర్ణయాలు గౌరవాన్ని తెస్తాయి.',
    wealthBusiness: 'పూర్వీకుల ఆస్తులు, దీర్ఘకాలిక డిపాజిట్లు మరియు ధర్మబద్ధమైన వ్యాపారాల ద్వారా స్థిరమైన ఆర్థిక లాభం కలుగుతుంది.',
    familyHealth: 'కుటుంబ సమేతంగా దేవాలయ సందర్శనలు, తీర్థయాత్రలు లేదా ఆధ్యాత్మిక కార్యక్రమాలలో పాల్గొంటారు. తండ్రిగారి ఆశీస్సులు లభిస్తాయి.',
    educationYouth: 'ఉన్నత విద్య, పీహెచ్‌డీ పరిశోధనలు మరియు స్కాలర్‌షిప్ ప్రయత్నాలకు అత్యంత శుభప్రదమైన సమయం.',
    healthVitality: 'మానసిక ప్రశాంతత, ఆధ్యాత్మిక ఆనందం మరియు చక్కని ఆరోగ్యం చేకూరుతాయి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: దైవం మీ పక్షాన ఉంది. సత్యనిష్ఠతో చేసే పనులు గొప్ప విజయాన్ని, శాశ్వత కీర్తిని చేకూరుస్తాయి.',
    remedy: 'గురు గ్రహ ఆరాధన, శ్రీ వేంకటేశ్వర స్వామి గోవింద నామ స్మరణ మరియు పసుపు వస్త్ర దానం',
    mantraTe: 'ఓం నమో వేంకటేశాయ • ఓం బృం బృహస్పతయే నమః (19 సార్లు)',
    mantraEn: 'Om Namo Venkatesaya • Om Brim Brihaspataye Namah (19 times)',
    enHouseLabel: 'Bhagya Sthana (9th House)',
    enStatusLabel: 'Auspicious • Divine Grace',
    enCareerFinance: 'Mentor blessings guide your career; long-distance and overseas projects advance.',
    enWealthBusiness: 'Steady wealth growth through ethical commerce and long-term assets.',
    enFamilyHealth: 'Temple visits, spiritual gatherings with family, and blessings from elders.',
    enEducationYouth: 'Highly favorable for higher education, scholarships, and research.',
    enHealthVitality: 'Deep spiritual peace and balanced physical health.',
    enDairyam: 'Courage: The divine hand is always with you; steadfast righteousness guarantees your triumph.',
    enRemedy: 'Chant Sri Venkateswara Govinda Namavali and worship Guru',
  },
  10: {
    houseLabel: 'దశమ చంద్రుడు (10వ రాజ్య-కర్మ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం • రాజయోగం',
    careerFinance: 'ఉద్యోగంలో ఉన్నత అధికారులు మీ పనితీరును ప్రశంసిస్తారు. పదోన్నతి, నూతన ఉద్యోగ అవకాశాలు మరియు ప్రభుత్వ సంబంధ పనులలో విజయం లభిస్తుంది.',
    wealthBusiness: 'వ్యాపారస్తులకు నూతన ప్రాజెక్టులు, కాంట్రాక్టులు లభిస్తాయి. ఆర్థిక ఆదాయం గణనీయంగా పెరుగుతుంది, సమాజంలో కీర్తి ప్రతిష్ఠలు ఇనుమడిస్తాయి.',
    familyHealth: 'తలపెట్టిన శుభకార్యాలు నిర్విఘ్నంగా నెరవేరుతాయి. కుటుంబంలో మీ మాటకు గౌరవం, పెద్దల ఆశీర్వాదం లభిస్తాయి.',
    educationYouth: 'కెరీర్ ప్లేస్‌మెంట్లు, క్యాంపస్ ఇంటర్వ్యూలు మరియు వృత్తి విద్యా కోర్సుల విద్యార్థులకు అద్భుత విజయాలు.',
    healthVitality: 'ఉత్సాహభరితమైన శక్తి, చురుకుదనం ఉంటాయి. మోకాళ్ల లేదా కీళ్ల ఆరోగ్యం పట్ల సాధారణ వ్యాయామం మేలు చేస్తుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మీ కార్యాచరణకు గ్రహబలం సంపూర్ణంగా ఉంది. సంకోచం లేకుండా మీ లక్ష్యాలపై దృష్టి పెట్టండి, విజయం మీదే.',
    remedy: 'సూర్యనమస్కారాలు, శ్రీ ఆదిత్య హృదయ స్తోత్ర పఠనం మరియు గోధుమల దానం',
    mantraTe: 'ఓం ఘృణిః సూర్య ఆదిత్యః • ఓం నమో భగవతే వాసుదేవాయ (12 సార్లు)',
    mantraEn: 'Om Ghrinih Surya Adityah • Sri Aditya Hrudayam (12 times)',
    enHouseLabel: 'Karma Sthana (10th House)',
    enStatusLabel: 'Highly Auspicious • Career Peak',
    enCareerFinance: 'Outstanding professional recognition, promotions, and success in government works.',
    enWealthBusiness: 'New contracts, business expansion, and rising social prestige.',
    enFamilyHealth: 'Accomplishment of auspicious family tasks and increased respect.',
    enEducationYouth: 'Excellent day for campus placements, job interviews, and professional courses.',
    enHealthVitality: 'Vibrant energy and active lifestyle throughout the day.',
    enDairyam: 'Courage: The planetary transit is exceptionally favorable; focus firmly on your goals.',
    enRemedy: 'Chant Sri Aditya Hrudaya Stotram and perform Surya Namaskaram',
  },
  11: {
    houseLabel: 'ఏకాదశ చంద్రుడు (11వ లాభ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం • సర్వలాభం',
    careerFinance: 'ఉద్యోగంలో ఆశించిన ఇంక్రిమెంట్లు, ప్రోత్సాహకాలు మరియు నూతన అవకాశాలు లభిస్తాయి. తక్కువ శ్రమతోనే గొప్ప ఫలితాలు సాధిస్తారు.',
    wealthBusiness: 'ఆకస్మిక ధనలాభం, మొండి బకాయిల వసూలు మరియు వ్యాపారంలో రెట్టింపు లాభాలు కనిపిస్తాయి. నూతన పెట్టుబడులు, భూమి/బంగారం కొనుగోలుకు శుభ సమయం.',
    familyHealth: 'మిత్రుల కలయిక, కుటుంబంలో శుభకార్య వేడుకలు మరియు సంతోషకరమైన వార్తలు ఆనందాన్ని ఇస్తాయి. పెద్దల సహకారం లభిస్తుంది.',
    educationYouth: 'విద్యార్థులకు ర్యాంకులు, పురస్కారాలు మరియు కోరుకున్న విద్యాసంస్థలలో ప్రవేశం లభిస్తుంది.',
    healthVitality: 'ఆరోగ్యం అత్యుత్తమంగా ఉంటుంది. గతంలో ఉన్న చిన్నపాటి ఇబ్బందులు పూర్తిగా తొలగిపోతాయి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: సర్వత్ర విజయం మీ పక్షాన ఉంది. వచ్చిన అవకాశాలను సద్వినియోగం చేసుకుని ఆనందంగా ముందుకు సాగండి.',
    remedy: 'శ్రీ మహాలక్ష్మి పూజ, కనకధారా స్తోత్ర పారాయణం మరియు నేతి దీపారాధన',
    mantraTe: 'ఓం శ్రీం హ్రీం శ్రీం కమలే కమలాలయే ప్రసీద ప్రసీద శ్రీం హ్రీం శ్రీం ఓం మహాలక్ష్మ్యై నమః',
    mantraEn: 'Om Shreem Hreem Shreem Mahalakshmyai Namah (21 times)',
    enHouseLabel: 'Labha Sthana (11th House)',
    enStatusLabel: 'All-Round Prosperity',
    enCareerFinance: 'Rewards, incentives, and rapid accomplishment of professional targets.',
    enWealthBusiness: 'Sudden financial windfalls, clearance of pending receivables, and lucrative investments.',
    enFamilyHealth: 'Celebrations with dear friends, joyful family news, and elder support.',
    enEducationYouth: 'Academic honors, high scores, and admission into desired institutions.',
    enHealthVitality: 'Vibrant health, high immunity, and cheerful enthusiasm.',
    enDairyam: 'Courage: Abundance and victory grace your path; welcome new opportunities with open arms.',
    enRemedy: 'Chant Sri Kanakadhara Stotram and light a ghee lamp for Goddess Mahalakshmi',
  },
  12: {
    houseLabel: 'ద్వాదశ చంద్రుడు (12వ వ్యయ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం • శుభ వ్యయం',
    careerFinance: 'ఉద్యోగ రీత్యా దూర ప్రయాణాలు లేదా స్థానచలన చర్చలు ఉండవచ్చు. విదేశీ కంపెనీలు, ఎగుమతి-దిగుమతి రంగాల వారికి అనుకూలం.',
    wealthBusiness: 'శుభకార్యాలు, గృహ అవసరాలు లేదా ఆధ్యాత్మిక కార్యక్రమాల నిమిత్తం ఖర్చులు పెరుగుతాయి. పత్రాలపై సంతకాలు చేసేముందు జాగ్రత్తగా పరిశీలించండి, అప్పులు ఇవ్వవద్దు.',
    familyHealth: 'కుటుంబ సభ్యుల అవసరాల కోసం సమయం కేటాయిస్తారు. అన్నదానం, ధర్మకార్యాలలో పాల్గొనడం వల్ల విశేష పుణ్యఫలం లభిస్తుంది.',
    educationYouth: 'విదేశీ విద్య, వీసా ప్రయత్నాలు చేసే విద్యార్థులకు అనుకూల కదలిక ఉంటుంది. రాత్రిపూట అతిగా మేల్కొనకుండా తగిన నిద్ర పోవాలి.',
    healthVitality: 'కంటి లేదా పాదాల అలసట ఉండవచ్చు. నిద్రలేమి రాకుండా రాత్రి పడుకునే ముందు ధ్యానం, దైవస్మరణ చేయండి.',
    dairyam: 'ధైర్యం & మానసిక భరోసా: ఖర్చులు పెరిగినా అవన్నీ శుభకార్యాలకే జరుగుతాయి. అధైర్యపడకండి, దైవధ్యానంతో మనస్సును నిలకడగా ఉంచుకోండి.',
    remedy: 'శ్రీ ఆంజనేయ స్వామి ఆలయ దర్శనం, హనుమాన్ చాలీసా పారాయణం మరియు పేదలకు అన్నదానం',
    mantraTe: 'ఓం అంజనీసుతాయ విద్మహే వాయుపుత్రాయ ధీమహి తన్నో మారుతిః ప్రచోదయాత్',
    mantraEn: 'Om Anjaneyaya Vidmahe Vayuputraya Dheemahi • Sri Hanuman Chalisa',
    enHouseLabel: 'Vyaya Sthana (12th House)',
    enStatusLabel: 'Moderate • Auspicious Spend',
    enCareerFinance: 'Favorable for MNCs, exports, and work-related travel; review contracts carefully.',
    enWealthBusiness: 'Auspicious expenses for family or charitable purposes rise; avoid extending informal loans.',
    enFamilyHealth: 'Charitable acts and Annadanam bring immense spiritual merit to the family.',
    enEducationYouth: 'Progress in overseas study and visa documentation; ensure proper sleep.',
    enHealthVitality: 'Prioritize eye rest and adequate sleep; evening meditation brings peace.',
    enDairyam: 'Courage: Rising expenses are for good causes; maintain equanimity with faith in Lord Hanuman.',
    enRemedy: 'Recite Sri Hanuman Chalisa and offer Annadanam',
  },
};

function findPlanetRashiIndex(day: DayData, planetName: string, fallbackIdx: number = 0): number {
  if (!day.grahaStithi) return fallbackIdx;
  for (let i = 0; i < RASHI_META_LIST.length; i++) {
    const planets = day.grahaStithi[RASHI_META_LIST[i].id] || '';
    if (planets.includes(planetName)) {
      return i;
    }
  }
  return fallbackIdx;
}

export function findMoonRashiIndex(day: DayData): number {
  for (let i = 0; i < RASHI_META_LIST.length; i++) {
    const key = RASHI_META_LIST[i].id;
    const planets = day.grahaStithi?.[key] || '';
    if (planets.includes('చంద్రుడు')) {
      return i;
    }
  }
  const sancharam = day.chandra?.sancharam || '';
  for (let i = 0; i < RASHI_META_LIST.length; i++) {
    const stem = RASHI_META_LIST[i].teluguName.replace(/ం$/, '');
    if (sancharam.includes(stem)) {
      return i;
    }
  }
  return 0;
}

export function getDailyRashiFortunes(day: DayData): RashiDailyFortune[] {
  const moonRashiIdx = findMoonRashiIndex(day);
  const rahuRashiIdx = findPlanetRashiIndex(day, 'రాహువు', 10);
  const guruRashiIdx = findPlanetRashiIndex(day, 'గురుడు', 4);
  const shaniRashiIdx = findPlanetRashiIndex(day, 'శని', 11);

  const daySeed = day.isoDate
    .split('-')
    .reduce((acc, part) => acc + parseInt(part, 10), 0);

  return RASHI_META_LIST.map((rashi, idx) => {
    const isChandrashtamam = checkChandrashtamam(rashi.id, day);
    const gocharaHouse = isChandrashtamam
      ? 8
      : ((moonRashiIdx - idx + 12) % 12) + 1;

    const fortune = GOCHARA_FORTUNES[gocharaHouse] || GOCHARA_FORTUNES[1];
    const luckyNum = ((rashi.baseLuckyNumber + daySeed) % 9) + 1;

    // Calculate specific Navagraha houses for this Rashi
    const rahuHouse = ((rahuRashiIdx - idx + 12) % 12) + 1;
    const guruHouse = ((guruRashiIdx - idx + 12) % 12) + 1;
    const shaniHouse = ((shaniRashiIdx - idx + 12) % 12) + 1;

    let rahuTag = '';
    let enRahuTag = '';
    if (rahuHouse === 2) {
      rahuTag = 'ద్వితీయ రాహువు';
      enRahuTag = 'Rahu in 2nd House';
    } else if (rahuHouse === 8) {
      rahuTag = 'అష్టమ రాహువు';
      enRahuTag = 'Rahu in 8th House';
    } else if (rahuHouse === 11) {
      rahuTag = 'లాభ రాహువు';
      enRahuTag = 'Rahu in 11th House';
    } else if (rahuHouse === 1) {
      rahuTag = 'జన్మ రాహువు';
      enRahuTag = 'Rahu in 1st House';
    }

    let guruTag = '';
    let enGuruTag = '';
    if (guruHouse === 5 || guruHouse === 9 || guruHouse === 11) {
      guruTag = 'గురు శుభ దృష్టి';
      enGuruTag = 'Auspicious Jupiter Aspect';
    } else if (guruHouse === 1 || guruHouse === 7) {
      guruTag = 'గురు కేంద్ర యోగం';
      enGuruTag = 'Jupiter Kendra Placement';
    }

    let shaniTag = '';
    let enShaniTag = '';
    if (shaniHouse === 12 || shaniHouse === 1 || shaniHouse === 2) {
      shaniTag = 'శని గోచారం';
      enShaniTag = 'Saturn Transit';
    } else if (shaniHouse === 4) {
      shaniTag = 'అర్ధాష్టమ శని';
      enShaniTag = 'Ardhastama Shani';
    } else if (shaniHouse === 8) {
      shaniTag = 'అష్టమ శని';
      enShaniTag = 'Ashtama Shani';
    } else if (shaniHouse === 3 || shaniHouse === 6 || shaniHouse === 11) {
      shaniTag = 'లాభ/ఉపచయ శని';
      enShaniTag = 'Favorable Saturn';
    }

    // Build the dynamic Navagraha Transit Badge
    const transitParts: string[] = [isChandrashtamam ? 'చంద్రాష్టమం' : fortune.houseLabel.split(' ')[0]];
    const enTransitParts: string[] = [isChandrashtamam ? 'Chandrashtamam' : fortune.enHouseLabel.split(' ')[0]];

    if (rahuTag) {
      transitParts.push(rahuTag);
      enTransitParts.push(enRahuTag);
    }
    if (guruTag) {
      transitParts.push(guruTag);
      enTransitParts.push(enGuruTag);
    }
    if (shaniTag && transitParts.length < 3) {
      transitParts.push(shaniTag);
      enTransitParts.push(enShaniTag);
    }

    const navagrahaTransitLabel = transitParts.join(' • ');
    const englishNavagrahaLabel = enTransitParts.join(' • ');

    // Build comprehensive 6-part prediction breakdown
    const grahaSthitiLine = `1. గ్రహ గోచార స్థితి: ${fortune.houseLabel}${rahuTag ? `, ${rahuTag}` : ''}${guruTag ? `, ${guruTag}` : ''}${shaniTag ? `, ${shaniTag}` : ''} ప్రభావం నేడు మీ రాశిపై ఉంది.`;
    const careerFinanceLine = `2. ఉద్యోగం & వృత్తి: ${fortune.careerFinance}`;
    const wealthBusinessLine = `3. ఆర్థికం & వ్యాపారం: ${fortune.wealthBusiness}`;
    const familyHealthLine = `4. కుటుంబం & శుభకార్యాలు: ${fortune.familyHealth}`;
    const educationYouthLine = `5. విద్య & కెరీర్: ${fortune.educationYouth}`;
    const healthVitalityLine = `6. ఆరోగ్యం & దినచర్య: ${fortune.healthVitality}`;
    const dairyamLine = `7. ${fortune.dairyam}`;
    const remedyLine = `8. శాస్త్రోక్త పరిహారం: ${fortune.remedy}`;

    const fullSummary = [
      grahaSthitiLine,
      careerFinanceLine,
      wealthBusinessLine,
      familyHealthLine,
      educationYouthLine,
      healthVitalityLine,
      dairyamLine,
      remedyLine,
    ].join('\n');

    const englishFullSummary = [
      `1. Planetary Transit: ${fortune.enHouseLabel}${enRahuTag ? `, ${enRahuTag}` : ''}${enGuruTag ? `, ${enGuruTag}` : ''}.`,
      `2. Career & Profession: ${fortune.enCareerFinance}`,
      `3. Family & Relationships: ${fortune.enFamilyHealth}`,
      `4. ${fortune.enDairyam}`,
      `5. Vedic Remedy: ${fortune.enRemedy}`,
    ].join('\n');

    const drishtiInfo = getRashiDailyGrahaDrishtiPhalam(day.isoDate, rashi.id);

    return {
      ...rashi,
      gocharaHouse,
      houseLabel: fortune.houseLabel,
      status: isChandrashtamam ? ('caution' as const) : fortune.status,
      statusLabel: isChandrashtamam ? 'చంద్రాష్టమం • జాగ్రత్త' : fortune.statusLabel,
      navagrahaTransitLabel,
      grahaSthitiLine,
      careerFinanceLine,
      wealthBusinessLine,
      familyHealthLine,
      educationYouthLine,
      healthVitalityLine,
      dairyamLine,
      remedyLine,
      mantraTe: fortune.mantraTe,
      mantraEn: fortune.mantraEn,
      fullSummary,
      summary: fullSummary,
      remedy: fortune.remedy,
      luckyNumber: luckyNum,
      englishNavagrahaLabel,
      englishFullSummary,
      englishWealthBusiness: `3. Wealth & Business: ${fortune.enWealthBusiness}`,
      englishEducationYouth: `5. Education & Youth: ${fortune.enEducationYouth}`,
      englishHealthVitality: `6. Health & Vitality: ${fortune.enHealthVitality}`,
      englishDairyam: fortune.enDairyam,
      grahaDrishtiHeadlineTe: drishtiInfo.activeAspectTitleTe,
      grahaDrishtiHeadlineEn: drishtiInfo.activeAspectTitleEn,
      grahaDrishtiTimeTe: drishtiInfo.activeAspectTimeTe,
      grahaDrishtiTimeEn: drishtiInfo.activeAspectTimeEn,
      grahaDrishtiPhalamTe: drishtiInfo.loukikaPhalamTe,
      grahaDrishtiPhalamEn: drishtiInfo.loukikaPhalamEn,
      doTodayTe: drishtiInfo.doTodayTe,
      doTodayEn: drishtiInfo.doTodayEn,
      avoidTodayTe: drishtiInfo.avoidTodayTe,
      avoidTodayEn: drishtiInfo.avoidTodayEn,
      luckyTimeWindowTe: drishtiInfo.luckyTimeWindowTe,
      luckyTimeWindowEn: drishtiInfo.luckyTimeWindowEn,
      statusLabelEn: isChandrashtamam ? 'Chandrashtamam • Caution' : fortune.enStatusLabel,
      remedyEn: fortune.enRemedy,
      vedicSymbolNameEn: rashi.vedicSymbolNameEn,
      lordEn: rashi.lordEn,
      luckyColorEn: rashi.luckyColorEn,
    };
  });
}

export interface RashiGocharaStrength {
  id: string;
  teluguName: string;
  englishName: string;
  shortTelugu: string;
  shortEnglish: string;
  lord: string;
  gocharaHouse: number;
  houseLabel: string;
  status: 'favorable' | 'mixed' | 'caution';
  statusLabel: string;
  strength: number; // 0 to 100 Gochara strength score
  planets: string;
  planetList: string[];
  planetCount: number;
}

const HOUSE_BASE_STRENGTH: Record<number, number> = {
  1: 78,  // Janma Chandra - Shubha
  2: 66,  // Dhana Sthana - Mixed
  3: 90,  // Trutiya - Parama Shubha
  4: 58,  // Chaturtha - Mixed
  5: 68,  // Panchama - Mixed-Good
  6: 86,  // Shashtha - Shubha
  7: 82,  // Saptama - Shubha
  8: 38,  // Ashtama (Chandrashtamam) - Caution
  9: 70,  // Navama - Mixed-Good
  10: 91, // Dashama - Parama Shubha
  11: 94, // Ekadasha - Parama Shubha
  12: 54, // Dwadasha - Mixed
};

/**
 * Calculates Gochara (current transit) strength (0-100) for all 12 Rashis
 * based on lunar transit house (Chandra Gochara) and current planetary placements (Graha Stithi).
 */
export function calculateGocharaStrengths(day: DayData): RashiGocharaStrength[] {
  const fortunes = getDailyRashiFortunes(day);

  return fortunes.map((fortune, idx) => {
    const rawPlanets = (day.grahaStithi?.[fortune.id] || '').trim();
    const planetList = rawPlanets
      ? rawPlanets.split(',').map((p) => p.trim()).filter(Boolean)
      : [];

    // Also check 7th house (Saptama Drishti / direct aspect) planets
    const seventhRashiId = RASHI_META_LIST[(idx + 6) % 12].id;
    const seventhPlanets = day.grahaStithi?.[seventhRashiId] || '';

    let score = HOUSE_BASE_STRENGTH[fortune.gocharaHouse] ?? 70;

    // Benefic / planetary presence modifiers in Rashi
    if (rawPlanets.includes('గురుడు')) score += 5;
    if (rawPlanets.includes('శుక్రుడు')) score += 4;
    if (rawPlanets.includes('బుధుడు')) score += 3;
    if (rawPlanets.includes('చంద్రుడు')) score += 4;
    if (rawPlanets.includes('సూర్యుడు')) score += 2;

    // Benefic 7th aspect (Saptama Drishti) bonus
    if (seventhPlanets.includes('గురుడు')) score += 4;
    if (seventhPlanets.includes('శుక్రుడు') || seventhPlanets.includes('బుధుడు')) score += 2;

    // Clamp to [32, 98]
    const clampedStrength = Math.max(32, Math.min(98, score));

    return {
      id: fortune.id,
      teluguName: fortune.teluguName,
      englishName: fortune.englishName,
      shortTelugu: fortune.teluguName.slice(0, 3),
      shortEnglish: fortune.englishName.slice(0, 3),
      lord: fortune.lord,
      gocharaHouse: fortune.gocharaHouse,
      houseLabel: fortune.houseLabel,
      status: fortune.status,
      statusLabel: fortune.statusLabel,
      strength: clampedStrength,
      planets: rawPlanets,
      planetList,
      planetCount: planetList.length,
    };
  });
}

/**
 * Formats a clean WhatsApp share message with Panchangam + Mesha to Mithuna Rashi teaser and website link (no phone number)
 */
export const CANONICAL_DOMAIN_URL = 'https://telugujyothisham.com';
export const PANCHANGAM_PAGE_URL = 'https://telugujyothisham.com/panchangam';

export function generateWhatsAppShareText(day: DayData, shareUrl?: string): string {
  // Resolve canonical Panchangam URL (defaults to https://telugujyothisham.com/panchangam)
  const appLink = shareUrl || PANCHANGAM_PAGE_URL;

  const fortunes = getDailyRashiFortunes(day);
  const transitLines = getDailyGrahaTransitShareLines(day.isoDate);
  const mesham = fortunes[0];
  const vrushabham = fortunes[1];
  const mithunam = fortunes[2];

  const lines = [
    `🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — నిత్య పంచాంగం & గ్రహ సంచారం* 🕉️`,
    `📅 *తేదీ & వారం:* ${day.teediVaram}`,
    `✨ *సంవత్సరం:* ${day.panchanga.samvatsaram}`,
    `🌙 *మాసం & పక్షం:* ${day.panchanga.masam}`,
    `🔱 *తిథి:* ${day.panchanga.tithi}`,
    `⭐ *నక్షత్రం:* ${day.panchanga.nakshatram}`,
    `☀️ *యోగం:* ${day.panchanga.yogam} | *కరణం:* ${day.panchanga.karanam}`,
    ``,
    `🟢 *శుభ ముహూర్తం (అభిజిత్):* ${day.shubha.abhijit}`,
    `🔴 *రాహు కాలం:* ${day.ashubha.rahukalam}`,
    `⚠️ *దుర్ముహూర్తం:* ${day.ashubha.durmuhurtham}`,
    `⛔ *వర్జ్యం:* ${day.ashubha.varjyam}`,
    ``,
    `🌟 *నేటి విశేషం:* ${day.phalitham}`,
    ``,
    `🪐 *నేటి గ్రహ సంచార & గ్రహ దృష్టి విశేషాలు (Graha Transit):*`,
    ...transitLines.slice(0, 3),
    ``,
    `🔮 *నేటి రాశి ఫలితాలు & గ్రహ దృష్టి ఫలితం:*`,
    `• *మేష రాశి (${mesham.grahaDrishtiHeadlineTe}):* ${mesham.grahaDrishtiPhalamTe}`,
    `• *వృషభ రాశి (${vrushabham.grahaDrishtiHeadlineTe}):* ${vrushabham.grahaDrishtiPhalamTe}`,
    `• *మిథున రాశి (${mithunam.grahaDrishtiHeadlineTe}):* ${mithunam.grahaDrishtiPhalamTe}`,
    ``,
    `✨ *కర్కాటకం నుండి మీన రాశి వరకు మిగతా 12 రాశుల గ్రహ దృష్టి ఫలితాలు & రాశి చక్రం కోసం క్రింది వెబ్‌సైట్ చూడండి:*`,
  ];

  if (appLink) {
    lines.push(`👉 ${appLink}`);
  }

  lines.push(
    ``,
    `సర్వేజనా సుఖినోభవంతు 🙏`
  );

  return lines.join('\n');
}

/**
 * Generates a custom Daily Horoscope (దిన ఫలం / ద్వాదశ రాశి ఫలితాలు) share message
 * for all 12 Rashis or a selected Rashi, strictly excluding personal contact numbers
 * and appending the website URL.
 */
export function generateHoroscopeShareText(
  day: DayData,
  selectedRashiId: string = 'all',
  shareUrl?: string
): string {
  const appLink = shareUrl || PANCHANGAM_PAGE_URL;
  const fortunes = getDailyRashiFortunes(day);
  const transitLines = getDailyGrahaTransitShareLines(day.isoDate);
  const moonRashiIdx = findMoonRashiIndex(day);
  const moonRashiName = RASHI_META_LIST[moonRashiIdx]?.teluguName || 'మేషం';

  if (selectedRashiId && selectedRashiId !== 'all') {
    const rashi = fortunes.find((r) => r.id === selectedRashiId) || fortunes[0];
    const lines = [
      `🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — నేటి నవ గ్రహ రాశి ఫలితం* 🕉️`,
      `📅 *తేదీ:* ${day.teediVaram}`,
      `🌙 *తిథి:* ${day.panchanga.tithi.split('-')[0].trim()} | *నక్షత్రం:* ${day.panchanga.nakshatram.split('-')[0].trim()}`,
      `✨ *చంద్ర సంచారం:* ${moonRashiName} రాశి`,
      ``,
      `🪐 *నేటి గ్రహ సంచార విశేషం:*`,
      ...transitLines.slice(0, 2),
      ``,
      `🔮 *${rashi.teluguName} రాశి (${rashi.englishName}) — సంపూర్ణ దిన ఫలం:*`,
      `🌟 *నేటి గ్రహ దృష్టి:* ${rashi.grahaDrishtiHeadlineTe} (${rashi.grahaDrishtiTimeTe})`,
      `👑 *రాశి అధిపతి:* ${rashi.lord} | *గోచారం:* ${rashi.navagrahaTransitLabel}`,
      ``,
      `✨ *గ్రహ దృష్టి ఫలితం:* ${rashi.grahaDrishtiPhalamTe}`,
      `✅ *నేడు చేయవలసిన పని:* ${rashi.doTodayTe}`,
      `⚠️ *నేడు జాగ్రత్త:* ${rashi.avoidTodayTe}`,
      `⏰ *నేటి శుభ సమయం:* ${rashi.luckyTimeWindowTe}`,
      `${rashi.grahaSthitiLine}`,
      `${rashi.careerFinanceLine}`,
      `${rashi.familyHealthLine}`,
      `🛡️ ${rashi.dairyamLine.replace(/^4\.\s*/, '')}`,
      `🙏 ${rashi.remedyLine.replace(/^5\.\s*/, '')}`,
      `🔢 *శుభ సంఖ్య:* ${rashi.luckyNumber} | 🎨 *శుభ రంగు:* ${rashi.luckyColor}`,
      ``,
      `🌐 *నేటి పూర్తి పంచాంగం & ద్వాదశ రాశి ఫలితాల కోసం వెబ్‌సైట్ చూడండి:*`,
      `👉 ${appLink}`,
      ``,
      `సర్వేజనా సుఖినోభవంతు 🙏`,
    ];
    return lines.join('\n');
  }

  // Default ('all'): Custom summary message for each of the 12 Rashis with Graha Transit & Graha Drishti
  const lines = [
    `🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — 12 రాశుల ఫలితాలు & గ్రహ సంచారం* 🕉️`,
    `📅 *తేదీ & వారం:* ${day.teediVaram}`,
    `🌙 *తిథి:* ${day.panchanga.tithi.split('-')[0].trim()} | *నక్షత్రం:* ${day.panchanga.nakshatram.split('-')[0].trim()}`,
    `✨ *నేటి చంద్ర సంచారం:* ${moonRashiName} రాశి`,
    ``,
    `🪐 *నేటి ముఖ్య గ్రహ సంచారం & దృష్టులు:*`,
    ...transitLines.slice(0, 3),
    ``,
  ];

  fortunes.forEach((rashi, idx) => {
    lines.push(
      `${idx + 1}. *${rashi.teluguName} రాశి (${rashi.englishName})* [${rashi.statusLabel}]:`,
      `   🪐 *గ్రహ దృష్టి ఫలితం:* ${rashi.grahaDrishtiPhalamTe}`,
      `   💼 ${rashi.careerFinanceLine.replace(/^2\.\s*/, '')}`,
      `   🏡 ${rashi.familyHealthLine.replace(/^3\.\s*/, '')}`,
      `   🛡️ ${rashi.dairyamLine.replace(/^4\.\s*/, '')}`,
      `   🙏 *పరిహారం:* ${rashi.remedy} | *శుభ సంఖ్య:* ${rashi.luckyNumber}`,
      ``
    );
  });

  lines.push(
    `🌐 *నేటి సంపూర్ణ పంచాంగం, ముహూర్తాలు మరియు రాశి చక్రం కోసం వెబ్‌సైట్ చూడండి:*`,
    `👉 ${appLink}`,
    ``,
    `సర్వేజనా సుఖినోభవంతు 🙏`
  );

  return lines.join('\n');
}

/**
 * Calculates correct Ayana and Rutu dynamically based on Masam
 * Ashwayuja, Kartika -> Sharad Rutuvu (శరద్ ఋతువు)
 * Margashira, Pushya -> Hemanta Rutuvu (హేమంత ఋతువు)
 */
export function getAyanaAndRutu(masamStr: string, isoDate?: string): { ayanam: string; rutuvu: string; rutuDesc: string } {
  let ayanam = 'దక్షిణాయనం';
  if (isoDate) {
    const md = isoDate.slice(5); // MM-DD
    if (md >= '01-15' && md <= '07-16') {
      ayanam = 'ఉత్తరాయణం';
    }
  } else if (
    masamStr.includes('మాఘ') ||
    masamStr.includes('ఫాల్గుణ') ||
    masamStr.includes('చైత్ర') ||
    masamStr.includes('వైశాఖ') ||
    masamStr.includes('జ్యేష్ఠ')
  ) {
    ayanam = 'ఉత్తరాయణం';
  }

  let rutuvu = 'శరద్ ఋతువు';
  let rutuDesc = 'శరదృతువు - దసరా, దీపావళి దీపకాంతుల పవిత్ర కాలం';

  if (masamStr.includes('ఆశ్వయుజ') || masamStr.includes('కార్తీక')) {
    rutuvu = 'శరద్ ఋతువు';
    rutuDesc = 'శరదృతువు - నిర్మల ఆకాశం, ఆధ్యాత్మిక సాధన కాలం';
  } else if (masamStr.includes('మార్గశిర') || masamStr.includes('పుష్య')) {
    rutuvu = 'హేమంత ఋతువు';
    rutuDesc = 'హేమంత ఋతువు - చలి కాలం, ధనుర్మాస పూజలు';
  } else if (masamStr.includes('మాఘ') || masamStr.includes('ఫాల్గుణ')) {
    rutuvu = 'శిశిర ఋతువు';
    rutuDesc = 'శిశిర ఋతువు - శివరాత్రి పర్వదిన సమయం';
  } else if (masamStr.includes('చైత్ర') || masamStr.includes('వైశాఖ')) {
    rutuvu = 'వసంత ఋతువు';
    rutuDesc = 'వసంత ఋతువు - నవ వసంతం, ఉగాది కాలం';
  } else if (masamStr.includes('జ్యేష్ఠ') || masamStr.includes('ఆషాఢ')) {
    rutuvu = 'గ్రీష్మ ఋతువు';
    rutuDesc = 'గ్రీష్మ ఋతువు - అధిక ఉష్ణోగ్రత సమయం';
  } else if (masamStr.includes('శ్రావణ') || masamStr.includes('భాద్రపద')) {
    rutuvu = 'వర్ష ఋతువు';
    rutuDesc = 'వర్ష ఋతువు - పవిత్ర వ్రతాలు, పూజల కాలం';
  }

  return { ayanam, rutuvu, rutuDesc };
}

/**
 * Formats a single copy-pasteable summary
 */
export function generateClipboardText(day: DayData): string {
  return generateWhatsAppShareText(day);
}

/**
 * Dynamically resolves Today and Tomorrow DayData IDs based on current IST/local date.
 * Falls back to '2026-10-22' if current system clock is outside the dataset range.
 */
export function getTodayAndTomorrowIds(days: DayData[], now: Date = new Date()): {
  todayId: string;
  tomorrowId: string;
  todayDay: DayData;
  tomorrowDay: DayData;
} {
  let isoToday = '';
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    if (y && m && d) {
      isoToday = `${y}-${m}-${d}`;
    }
  } catch {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    isoToday = `${y}-${m}-${d}`;
  }

  let todayIdx = days.findIndex((d) => d.id === isoToday);
  if (todayIdx === -1) {
    // Fallback to local YYYY-MM-DD if different from IST
    const localIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    todayIdx = days.findIndex((d) => d.id === localIso);
  }
  if (todayIdx === -1) {
    const fallbackIdx = days.findIndex((d) => d.id === '2026-10-22');
    todayIdx = fallbackIdx >= 0 ? fallbackIdx : 0;
  }

  const tomorrowIdx = Math.min(todayIdx + 1, days.length - 1);
  const todayDay = days[todayIdx] || days[0];
  const tomorrowDay = days[tomorrowIdx] || todayDay;

  return {
    todayId: todayDay.id,
    tomorrowId: tomorrowDay.id,
    todayDay,
    tomorrowDay,
  };
}


