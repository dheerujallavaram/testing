import { DayData, LagnaPramanam } from '../types/panchangam';
import { NAKSHATRAS, ALL_RASHIS } from '../data/panchangamData';

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
  summary: string;
  remedy: string;
  luckyNumber: number;
}

export const RASHI_META_LIST = [
  { id: 'mesham', teluguName: 'మేషం', englishName: 'Aries', symbol: '♈', vedicSymbolName: 'పొట్టేలు (Ram)', lord: 'కుజుడు', luckyColor: 'ఎరుపు (Red)', baseLuckyNumber: 9 },
  { id: 'vrushabham', teluguName: 'వృషభం', englishName: 'Taurus', symbol: '♉', vedicSymbolName: 'ఎద్దు (Bull)', lord: 'శుక్రుడు', luckyColor: 'తెలుపు (White)', baseLuckyNumber: 6 },
  { id: 'mithunam', teluguName: 'మిథునం', englishName: 'Gemini', symbol: '♊', vedicSymbolName: 'మిథున జంట (Twins)', lord: 'బుధుడు', luckyColor: 'ఆకుపచ్చ (Green)', baseLuckyNumber: 5 },
  { id: 'karkatakam', teluguName: 'కర్కాటకం', englishName: 'Cancer', symbol: '♋', vedicSymbolName: 'పీత (Crab)', lord: 'చంద్రుడు', luckyColor: 'ముత్యపు తెలుపు (Pearl)', baseLuckyNumber: 2 },
  { id: 'simham', teluguName: 'సింహం', englishName: 'Leo', symbol: '♌', vedicSymbolName: 'సింహం (Lion)', lord: 'సూర్యుడు', luckyColor: 'బంగారు పసుపు (Gold)', baseLuckyNumber: 1 },
  { id: 'kanya', teluguName: 'కన్య', englishName: 'Virgo', symbol: '♍', vedicSymbolName: 'కన్యక (Maiden)', lord: 'బుధుడు', luckyColor: 'లేత ఆకుపచ్చ (Light Green)', baseLuckyNumber: 5 },
  { id: 'tula', teluguName: 'తుల', englishName: 'Libra', symbol: '♎', vedicSymbolName: 'త్రాసు (Scales)', lord: 'శుక్రుడు', luckyColor: 'గులాబీ / తెలుపు (Cream)', baseLuckyNumber: 6 },
  { id: 'vruschikam', teluguName: 'వృశ్చికం', englishName: 'Scorpio', symbol: '♏', vedicSymbolName: 'తేలు (Scorpion)', lord: 'కుజుడు', luckyColor: 'కాషాయం / ఎరుపు (Coral)', baseLuckyNumber: 9 },
  { id: 'dhanussu', teluguName: 'ధనుస్సు', englishName: 'Sagittarius', symbol: '♐', vedicSymbolName: 'విల్లంబు (Bow & Arrow)', lord: 'గురుడు', luckyColor: 'పసుపు (Yellow)', baseLuckyNumber: 3 },
  { id: 'makaram', teluguName: 'మకరం', englishName: 'Capricorn', symbol: '♑', vedicSymbolName: 'మకరం (Sea-Goat)', lord: 'శని', luckyColor: 'నీలం (Blue)', baseLuckyNumber: 8 },
  { id: 'kumbham', teluguName: 'కుంభం', englishName: 'Aquarius', symbol: '♒', vedicSymbolName: 'కుంభం (Water Pot)', lord: 'శని', luckyColor: 'లేత నీలం (Sky Blue)', baseLuckyNumber: 4 },
  { id: 'meenam', teluguName: 'మీనం', englishName: 'Pisces', symbol: '♓', vedicSymbolName: 'మీన ద్వయం (Two Fishes)', lord: 'గురుడు', luckyColor: 'పసుపు / కాషాయం (Saffron)', baseLuckyNumber: 7 },
];

export const GOCHARA_FORTUNES: Record<
  number,
  {
    houseLabel: string;
    status: 'favorable' | 'mixed' | 'caution';
    statusLabel: string;
    summaries: string[];
    remedy: string;
  }
> = {
  1: {
    houseLabel: 'జన్మ చంద్రుడు (1వ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం',
    summaries: [
      'మనస్సు ప్రశాంతంగా ఉంటుంది. తలపెట్టిన పనులు ఉత్సాహంగా పూర్తి చేస్తారు. బంధుమిత్రుల కలయిక ఆనందాన్ని ఇస్తుంది.',
      'ఆత్మవిశ్వాసం పెరుగుతుంది. గౌరవ మర్యాదలు లభిస్తాయి. నూతన వస్తు లాభం మరియు శుభవార్తా శ్రవణం ఉంటుంది.',
    ],
    remedy: 'శివారాధన, అభిషేకం శ్రేయస్కరం',
  },
  2: {
    houseLabel: 'ధన స్థాన చంద్రుడు (2వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'ఆర్థిక వ్యవహారాలలో ఆచితూచి వ్యవహరించాలి. మాటతీరులో సంయమనం పాటించడం వల్ల కుటుంబంలో సామరస్యం నిలుస్తుంది.',
      'రావలసిన ధనం చేతికి అందుతుంది కానీ వృథా ఖర్చులను నియంత్రించాలి. కుటుంబ సభ్యుల సలహాలు మేలు చేస్తాయి.',
    ],
    remedy: 'శ్రీ లక్ష్మీ గణపతి స్మరణ శుభప్రదం',
  },
  3: {
    houseLabel: 'తృతీయ చంద్రుడు (3వ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం',
    summaries: [
      'చేపట్టిన ప్రతి పనిలోనూ విజయం లభిస్తుంది. సోదరులు, మిత్రుల సహకారంతో కీలక వ్యవహారాలు సానుకూలమవుతాయి.',
      'ధైర్య సాహసాలతో ముందడుగు వేస్తారు. ఉద్యోగ, వ్యాపారాలలో ఆశించిన పురోగతి మరియు ధనలాభం కలుగుతుంది.',
    ],
    remedy: 'సుబ్రహ్మణ్య స్వామి స్తోత్ర పారాయణ',
  },
  4: {
    houseLabel: 'చతుర్థ చంద్రుడు (4వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'గృహ సంబంధ పనులలో కొంత శ్రమ అధికంగా ఉండవచ్చు. ప్రయాణాలలో తగిన జాగ్రత్తలు పాటించడం మంచిది.',
      'పనులలో స్వల్ప ఆలస్యం జరిగినప్పటికీ పట్టుదలతో పూర్తి చేస్తారు. మాతృవర్గీయుల ఆరోగ్యం పట్ల శ్రద్ధ వహించండి.',
    ],
    remedy: 'అమ్మవారి కుంకుమార్చన, దుర్గా స్తుతి',
  },
  5: {
    houseLabel: 'పంచమ చంద్రుడు (5వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'సంతాన సంబంధ విషయాలలో ఆలోచనలు పెరుగుతాయి. ఆధ్యాత్మిక కార్యక్రమాలలో పాల్గొనడం వల్ల మనశ్శాంతి లభిస్తుంది.',
      'కీలక నిర్ణయాలు తీసుకునే ముందు పెద్దల సలహా తీసుకోవడం ఉత్తమం. విద్యా, పరిశోధన రంగాల వారికి అనుకూలం.',
    ],
    remedy: 'శ్రీ దత్తాత్రేయ / గురు స్తోత్ర పఠనం',
  },
  6: {
    houseLabel: 'షష్ఠ చంద్రుడు (6వ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం',
    summaries: [
      'ఆరోగ్యం కుదుటపడుతుంది. పోటీలలోనూ, వృత్తి ఉద్యోగాలలోనూ మీ మాటకు విలువ పెరుగుతుంది. రుణ బాధలు తొలగుతాయి.',
      'పెండింగ్‌లో ఉన్న పనులు వేగంగా పూర్తవుతాయి. శత్రువులపై విజయం సాధిస్తారు, ఆర్థిక పరిస్థితి మెరుగుపడుతుంది.',
    ],
    remedy: 'శ్రీ విష్ణు సహస్రనామ శ్రవణం',
  },
  7: {
    houseLabel: 'సప్తమ చంద్రుడు (7వ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం',
    summaries: [
      'భాగస్వామ్య వ్యాపారాలు, నూతన ఒప్పందాలకు అనుకూల సమయం. జీవిత భాగస్వామితో ఆనందంగా గడుపుతారు.',
      'సామాజిక గౌరవం పెరుగుతుంది. ప్రయాణాలు లాభసాటిగా సాగుతాయి. శుభకార్య ప్రయత్నాలు ఫలిస్తాయి.',
    ],
    remedy: 'లక్ష్మీ నారాయణుల ఆరాధన',
  },
  8: {
    houseLabel: 'అష్టమ చంద్రుడు (చంద్రాష్టమం)',
    status: 'caution',
    statusLabel: 'చంద్రాష్టమం • జాగ్రత్త',
    summaries: [
      'నేడు చంద్రాష్టమ ప్రభావం ఉన్నందున కొత్త పనులు, కీలక ఆర్థిక నిర్ణయాలు వాయిదా వేయడం శ్రేయస్కరం. ప్రశాంతంగా ఉండండి.',
      'అనవసర వాదనలకు దూరంగా ఉండాలి. ప్రయాణాలలో అప్రమత్తత అవసరం. దైవ ధ్యానం వల్ల ఆటంకాలు తొలగుతాయి.',
    ],
    remedy: 'శివాభిషేకం, చంద్ర శ్లోక పఠనం తప్పనిసరి',
  },
  9: {
    houseLabel: 'నవమ చంద్రుడు (9వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'పుణ్యక్షేత్ర సందర్శన లేదా ధార్మిక కార్యక్రమాల పట్ల ఆసక్తి చూపుతారు. పెద్దల ఆశీస్సులు లభిస్తాయి.',
      'శ్రమకు తగిన ఫలితం లభిస్తుంది. దూర ప్రయాణ సూచనలు ఉన్నాయి. దానధర్మాలు చేయడం వల్ల శుభం కలుగుతుంది.',
    ],
    remedy: 'గురు గ్రహ ఆరాధన, దక్షిణామూర్తి స్తోత్రం',
  },
  10: {
    houseLabel: 'దశమ చంద్రుడు (10వ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం',
    summaries: [
      'ఉద్యోగ, వ్యాపార రంగాలలో ఉన్నత ఫలితాలు సాధిస్తారు. అధికారుల ప్రశంసలు మరియు నూతన బాధ్యతలు లభిస్తాయి.',
      'తలపెట్టిన కార్యాలు నిర్విఘ్నంగా నెరవేరుతాయి. కీర్తి ప్రతిష్ఠలు పెరుగుతాయి, ఆర్థిక లాభాలు చేకూరుతాయి.',
    ],
    remedy: 'శ్రీ వేంకటేశ్వర స్వామి దర్శనం / స్మరణ',
  },
  11: {
    houseLabel: 'ఏకాదశ చంద్రుడు (11వ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం',
    summaries: [
      'ఆకస్మిక ధనలాభం, వ్యాపార విస్తరణ మరియు శుభవార్తలు వింటారు. మిత్రుల ద్వారా విశేష ప్రయోజనాలు కలుగుతాయి.',
      'సర్వకార్య విజయం చేకూరుతుంది. కోరుకున్న పనులు సకాలంలో పూర్తవుతాయి. కుటుంబంలో సంతోషకర వాతావరణం ఉంటుంది.',
    ],
    remedy: 'శ్రీ మహా గణపతి ఆరాధన',
  },
  12: {
    houseLabel: 'ద్వాదశ చంద్రుడు (12వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'శుభకార్యాల నిమిత్తం ఖర్చులు పెరిగే అవకాశం ఉంది. విశ్రాంతి మరియు ఆరోగ్యంపై తగిన శ్రద్ధ వహించాలి.',
      'దూర ప్రాంత వ్యవహారాలు అనుకూలిస్తాయి. ఆర్థిక లావాదేవీలలో తొందరపాటు వద్దు. ఆధ్యాత్మిక చింతన మేలు చేస్తుంది.',
    ],
    remedy: 'ఆంజనేయ స్వామి చాలీసా పారాయణ',
  },
};

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
  const daySeed = day.isoDate
    .split('-')
    .reduce((acc, part) => acc + parseInt(part, 10), 0);

  return RASHI_META_LIST.map((rashi, idx) => {
    const isChandrashtamam = checkChandrashtamam(rashi.id, day);
    const gocharaHouse = isChandrashtamam
      ? 8
      : ((moonRashiIdx - idx + 12) % 12) + 1;

    const fortune = GOCHARA_FORTUNES[gocharaHouse] || GOCHARA_FORTUNES[1];
    const summaryIdx = (daySeed + idx) % fortune.summaries.length;
    const summaryText = fortune.summaries[summaryIdx];
    const luckyNum = ((rashi.baseLuckyNumber + daySeed) % 9) + 1;

    return {
      ...rashi,
      gocharaHouse,
      houseLabel: fortune.houseLabel,
      status: isChandrashtamam ? ('caution' as const) : fortune.status,
      statusLabel: isChandrashtamam ? 'చంద్రాష్టమం • జాగ్రత్త' : fortune.statusLabel,
      summary: summaryText,
      remedy: fortune.remedy,
      luckyNumber: luckyNum,
    };
  });
}

/**
 * Formats a clean WhatsApp share message with Panchangam + Mesha to Mithuna Rashi teaser and website link (no phone number)
 */
export const CANONICAL_DOMAIN_URL = 'https://telugujyothisham.com';

export function generateWhatsAppShareText(day: DayData, shareUrl?: string): string {
  // Resolve canonical website URL (defaults to https://telugujyothisham.com)
  const appLink = shareUrl || CANONICAL_DOMAIN_URL;

  const fortunes = getDailyRashiFortunes(day);
  const mesham = fortunes[0];
  const vrushabham = fortunes[1];
  const mithunam = fortunes[2];

  const lines = [
    `🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — నిత్య పంచాంగం* 🕉️`,
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
    `🔮 *నేటి రాశి ఫలితాలు (దిన ఫలం):*`,
    `• *మేష రాశి:* ${mesham.summary} (${mesham.statusLabel})`,
    `• *వృషభ రాశి:* ${vrushabham.summary} (${vrushabham.statusLabel})`,
    `• *మిథున రాశి:* ${mithunam.summary} (${mithunam.statusLabel})`,
    ``,
    `✨ *కర్కాటకం నుండి మీన రాశి వరకు మిగతా రాశి ఫలితాలు మరియు పూర్తి రాశి చక్రం కోసం క్రింది వెబ్‌సైట్ చూడండి:*`,
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


