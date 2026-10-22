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
  navagrahaTransitLabel: string;
  grahaSthitiLine: string;
  careerFinanceLine: string;
  familyHealthLine: string;
  dairyamLine: string;
  remedyLine: string;
  fullSummary: string;
  summary: string;
  remedy: string;
  luckyNumber: number;
  englishNavagrahaLabel: string;
  englishFullSummary: string;
  englishDairyam: string;
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
    careerFinance: string;
    familyHealth: string;
    dairyam: string;
    remedy: string;
    enHouseLabel: string;
    enStatusLabel: string;
    enCareerFinance: string;
    enFamilyHealth: string;
    enDairyam: string;
    enRemedy: string;
  }
> = {
  1: {
    houseLabel: 'జన్మ చంద్రుడు (1వ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం',
    careerFinance: 'ఉద్యోగంలో మీ మాటకు విలువ పెరుగుతుంది. నూతన బాధ్యతలు మరియు వ్యాపారంలో అనుకూల ఒప్పందాలు లభిస్తాయి.',
    familyHealth: 'మనస్సు ఉత్సాహంగా ఉంటుంది. కుటుంబ సభ్యులతో ఆనందంగా గడుపుతారు, బంధువుల రాక సంతోషాన్ని ఇస్తుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: ఆత్మవిశ్వాసంతో ముందడుగు వేయండి. తలపెట్టిన ప్రతి పనిలోనూ మీ సంకల్ప బలమే మీకు విజయాన్ని చేకూరుస్తుంది.',
    remedy: 'శివాభిషేకం లేదా శ్రీ లక్ష్మీ నారాయణుల దర్శనం శ్రేయస్కరం',
    enHouseLabel: 'Janma Chandra (1st House)',
    enStatusLabel: 'Auspicious',
    enCareerFinance: 'Career growth and valuable business agreements progress smoothly with leadership confidence.',
    enFamilyHealth: 'Peace of mind and warmth in family relationships prevail throughout the day.',
    enDairyam: 'Courage: Step forward boldly with faith; your personal determination brings assured success.',
    enRemedy: 'Perform Shiva Puja or Lakshmi Narayana Archana',
  },
  2: {
    houseLabel: 'ధన స్థాన చంద్రుడు (2వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    careerFinance: 'ఆర్థిక వ్యవహారాలలో ఆచితూచి అడుగు వేయాలి. వ్యాపార లావాదేవీలలో స్పష్టత పాటించండి, తొందరపాటు పెట్టుబడులు వద్దు.',
    familyHealth: 'మాటతీరులో సంయమనం పాటిస్తే కుటుంబంలో శాంతి నిలుస్తుంది. గొంతు లేదా కంటి సమస్యల పట్ల కొద్దిపాటి శ్రద్ధ అవసరం.',
    dairyam: 'ధైర్యం & మనోధైర్యం: ఆర్థిక ఒడిదుడుకులకు భయపడకండి. శాంతంగా ఆలోచించి నిర్ణయాలు తీసుకుంటే ప్రతి సమస్యకు పరిష్కారం దొరుకుతుంది.',
    remedy: 'శ్రీ లక్ష్మీ గణపతి స్తోత్ర పఠనం, ఆవుకు బెల్లం తినిపించడం',
    enHouseLabel: 'Dhana Sthana (2nd House)',
    enStatusLabel: 'Moderate',
    enCareerFinance: 'Exercise prudence in financial commitments and avoid hasty speculative investments today.',
    enFamilyHealth: 'Cultivate gentleness in communication to preserve joyful domestic harmony.',
    enDairyam: 'Courage: Do not worry about temporary financial delays; calm wisdom unlocks the right solutions.',
    enRemedy: 'Chant Sri Lakshmi Ganapathi Stotram',
  },
  3: {
    houseLabel: 'తృతీయ చంద్రుడు (3వ పరాక్రమ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం',
    careerFinance: 'చేపట్టిన పనులలో తిరుగులేని విజయం లభిస్తుంది. ఉద్యోగ వ్యాపారాలలో పదోన్నతి మరియు ఆశించిన ధనలాభం కలుగుతుంది.',
    familyHealth: 'సోదరులు, మిత్రుల పూర్తి సహకారం అందుతుంది. శారీరక దృఢత్వం, ఉల్లాసమైన ప్రయాణాలు ఆహ్లాదాన్నిస్తాయి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మీ ధైర్య సాహసాలకు ఇది పరీక్ష కాదు, విజయ సమయం! ఉత్సాహంతో ముందడుగు వేయండి, దైవానుగ్రహం మీ వెంటే ఉంది.',
    remedy: 'శ్రీ సుబ్రహ్మణ్య స్వామి ఆరాధన, ఆంజనేయ దండకం పఠనం',
    enHouseLabel: 'Parakrama Sthana (3rd House)',
    enStatusLabel: 'Highly Favorable',
    enCareerFinance: 'Exceptional progress, timely completion of projects, and lucrative rewards in business endeavors.',
    enFamilyHealth: 'Energetic health and complete support from siblings and close allies.',
    enDairyam: 'Courage: An empowering transit for decisive action; your courage leads to triumph.',
    enRemedy: 'Worship Lord Subrahmanya and chant Hanuman Dandakam',
  },
  4: {
    houseLabel: 'చతుర్థ చంద్రుడు (4వ సుఖ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    careerFinance: 'వృత్తి ఉద్యోగాలలో పనిభారం కొంత ఎక్కువ ఉండవచ్చు. స్థిరాస్తి లేదా వాహన వ్యవహారాలలో కీలక నిర్ణయాలు వాయిదా వేయండి.',
    familyHealth: 'గృహ సంబంధ విషయాలలో శ్రమ పెరుగుతుంది. తల్లిగారి ఆరోగ్యం పట్ల శ్రద్ధ వహించండి, ప్రయాణాలలో అప్రమత్తత అవసరం.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మానసిక ఒత్తిడికి లోనుకాకండి. విశ్రాంతి తీసుకుంటూ ధ్యానం చేయండి. శాంతితో ఉండడం వల్ల ఆటంకాలు తొలగిపోతాయి.',
    remedy: 'శ్రీ దుర్గాదేవి స్తుతి లేదా అమ్మవారికి కుంకుమార్చన',
    enHouseLabel: 'Chaturtha Sthana (4th House)',
    enStatusLabel: 'Moderate',
    enCareerFinance: 'Workplace demands require steady focus; postpone major property or vehicle contracts.',
    enFamilyHealth: 'Pay attention to mother’s well-being and maintain domestic tranquility.',
    enDairyam: 'Courage: Do not succumb to mental anxiety; peaceful patience will smooth out all friction.',
    enRemedy: 'Recite Sri Durga Kavacham',
  },
  5: {
    houseLabel: 'పంచమ చంద్రుడు (5వ పూర్వపుణ్య స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం • జ్ఞాన లాభం',
    careerFinance: 'విద్యా, పరిశోధన, సృజనాత్మక రంగాల వారికి అనుకూలం. నూతన ప్రాజెక్టులకు పెద్దల సలహా తప్పనిసరిగా తీసుకోండి.',
    familyHealth: 'సంతాన సంబంధ విషయాలలో ఆలోచనలు పెరుగుతాయి. ఆధ్యాత్మిక చింతన మరియు పూజల వల్ల మనశ్శాంతి లభిస్తుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మీ ఆలోచనలు సన్మార్గంలో ఉన్నాయి. పూర్వపుణ్యం మీకు రక్షగా నిలుస్తుంది, కలవరపడకుండా ముందుకు సాగండి.',
    remedy: 'శ్రీ దక్షిణామూర్తి లేదా దత్తాత్రేయ స్వామి స్మరణ',
    enHouseLabel: 'Panchama Sthana (5th House)',
    enStatusLabel: 'Mixed-Good',
    enCareerFinance: 'Intellectual pursuits and creative enterprises yield positive growth; consult elders.',
    enFamilyHealth: 'Children’s matters require affectionate attention; devotional prayers restore serenity.',
    enDairyam: 'Courage: Your past good deeds protect you; stay grounded and make decisions thoughtfully.',
    enRemedy: 'Chant Sri Medha Dakshinamurthy Stotram',
  },
  6: {
    houseLabel: 'షష్ఠ చంద్రుడు (6వ శత్రుజయ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం • శత్రుజయం',
    careerFinance: 'ఉద్యోగంలో మీ ప్రతిభకు గుర్తింపు వస్తుంది. రుణ విముక్తి ప్రయత్నాలు ఫలిస్తాయి, వ్యాపార విస్తరణకు అనుకూలం.',
    familyHealth: 'ఆరోగ్యం మెరుగుపడుతుంది, దీర్ఘకాలిక సమస్యల నుండి ఉపశమనం లభిస్తుంది. పోటీలలో విజయం మీదే.',
    dairyam: 'ధైర్యం & మనోధైర్యం: ఎలాంటి వ్యతిరేకతలైనా మీ ముందు తలవంచుతాయి. అడ్డంకులను ధైర్యంగా ఎదుర్కొని తిరుగులేని విజయం సాధించండి.',
    remedy: 'శ్రీ విష్ణు సహస్రనామ స్తోత్ర పారాయణం లేదా శ్రవణం',
    enHouseLabel: 'Shashtha Sthana (6th House)',
    enStatusLabel: 'Auspicious Victory',
    enCareerFinance: 'Recognition of skills at workplace, relief from debts, and victory in competitive pursuits.',
    enFamilyHealth: 'Health strengthens noticeably and pending disputes resolve peacefully in your favor.',
    enDairyam: 'Courage: No obstacle can stop your momentum; courageously claim your rightful progress.',
    enRemedy: 'Chant Sri Vishnu Sahasranamam',
  },
  7: {
    houseLabel: 'సప్తమ చంద్రుడు (7వ కళత్ర స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం • సుఖం',
    careerFinance: 'భాగస్వామ్య వ్యాపారాలు, విదేశీ లేదా దూరప్రాంత ఒప్పందాలు లాభిస్తాయి. నూతన వ్యక్తుల పరిచయం ప్రయోజనకరం.',
    familyHealth: 'జీవిత భాగస్వామితో ఆనందంగా గడుపుతారు. శుభకార్య చర్చలు ఫలిస్తాయి, సామాజిక గౌరవం ఇనుమడిస్తుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: అనుకూలమైన గ్రహబలం మీకు రక్షగా ఉంది. సత్సంబంధాలు కాపాడుకుంటూ నమ్మకంతో ముందుకు వెళ్లండి.',
    remedy: 'శ్రీ లలితా త్రిపురసుందరి అష్టోత్తర శతనామ స్తోత్రం',
    enHouseLabel: 'Saptama Sthana (7th House)',
    enStatusLabel: 'Auspicious Harmony',
    enCareerFinance: 'Partnership collaborations and client meetings yield joyful, profitable agreements.',
    enFamilyHealth: 'Spousal harmony and marital happiness flourish; social prestige rises.',
    enDairyam: 'Courage: Strong cosmic blessings surround you; proceed with heartfelt trust.',
    enRemedy: 'Chant Sri Lalita Tripura Sundari Ashtottaram',
  },
  8: {
    houseLabel: 'అష్టమ చంద్రుడు (చంద్రాష్టమం • 8వ స్థానం)',
    status: 'caution',
    statusLabel: 'చంద్రాష్టమం • జాగ్రత్త',
    careerFinance: 'నేడు చంద్రాష్టమ ప్రభావం ఉన్నందున నూతన ఒప్పందాలు, పెద్ద పెట్టుబడులు మరియు వివాదాలకు దూరంగా ఉండండి. పనులు వాయిదా వేయడం మేలు.',
    familyHealth: 'ప్రయాణాలలో అత్యంత అప్రమత్తత అవసరం. కోపావేశాలకు దూరంగా ఉండండి, ఆహార నియమాలు పాటించండి.',
    dairyam: 'ధైర్యం & మానసిక భరోసా: చంద్రాష్టమం ఉందని భయపడాల్సిన పనిలేదు! ఇది కేవలం 2 రోజుల తాత్కాలిక గ్రహ పరీక్ష మాత్రమే. శాంతంగా, దైవస్మరణతో ఉంటే ఎలాంటి ఆపదలైనా తొలగిపోతాయి. మనోధైర్యమే మీ ప్రధాన రక్ష.',
    remedy: 'శివాభిషేకం, "ఓం నమః శివాయ" పంచాక్షరీ జపం మరియు చంద్ర శ్లోకం తప్పనిసరి',
    enHouseLabel: 'Ashtama Chandra (Chandrashtamam • 8th House)',
    enStatusLabel: 'Chandrashtamam • Caution',
    enCareerFinance: 'Postpone major business commitments, speculative ventures, or heated office discussions today.',
    enFamilyHealth: 'Exercise cautiousness during travel, avoid temper flare-ups, and ensure calm rest.',
    enDairyam: 'Courage & Reassurance: Do not be frightened by Chandrashtamam! This is a brief 2-day cosmic testing period. With steady mindfulness and Shiva prayer, divine grace shields you completely.',
    enRemedy: 'Perform Shiva Archana and chant Om Namah Shivaya 108 times',
  },
  9: {
    houseLabel: 'నవమ చంద్రుడు (9వ భాగ్య స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం • దైవానుగ్రహం',
    careerFinance: 'ఉద్యోగంలో పెద్దల ఆశీస్సులు లభిస్తాయి. దూరప్రాంత వ్యవహారాలు నిదానంగా అనుకూలిస్తాయి, ధర్మ మార్గంలో పయనించండి.',
    familyHealth: 'దేవాలయ సందర్శనలు, తీర్థయాత్రల ఆలోచనలు కలుగుతాయి. తండ్రిగారి ఆరోగ్యం పట్ల శ్రద్ధ వహించండి.',
    dairyam: 'ధైర్యం & మనోధైర్యం: దైవం మీ పక్షాన ఉంది. సత్యనిష్ఠతో చేసే పనులు ఆలస్యమైనా చివరికి గొప్ప విజయాన్ని చేకూరుస్తాయి.',
    remedy: 'గురు గ్రహ ఆరాధన, శ్రీ వేంకటేశ్వర స్వామి గోవింద నామ స్మరణ',
    enHouseLabel: 'Bhagya Sthana (9th House)',
    enStatusLabel: 'Auspicious Grace',
    enCareerFinance: 'Fortunate mentor support guides your professional endeavors; ethical actions yield enduring gains.',
    enFamilyHealth: 'Inclination towards pilgrimage and sacred traditions brings deep spiritual contentment.',
    enDairyam: 'Courage: The divine hand is always with you; steadfast righteousness guarantees your triumph.',
    enRemedy: 'Chant Sri Venkateswara Govinda Namavali',
  },
  10: {
    houseLabel: 'దశమ చంద్రుడు (10వ రాజ్య-కర్మ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం • కార్యసిద్ధి',
    careerFinance: 'ఉద్యోగంలో ఉన్నత అధికారులు మీ పనితీరును ప్రశంసిస్తారు. నూతన ఉద్యోగ, వ్యాపార అవకాశాలు మరియు కీర్తి ప్రతిష్ఠలు పెరుగుతాయి.',
    familyHealth: 'తలపెట్టిన కార్యాలు నిర్విఘ్నంగా నెరవేరుతాయి. కుటుంబంలో గౌరవ మర్యాదలు మరియు సర్వజన సౌఖ్యం చేకూరుతుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: మీ కార్యాచరణకు గ్రహబలం సంపూర్ణంగా ఉంది. సంకోచం లేకుండా మీ లక్ష్యాలపై దృష్టి పెట్టండి, విజయం మీదే.',
    remedy: 'సూర్యనమస్కారాలు, శ్రీ ఆదిత్య హృదయ స్తోత్ర పఠనం',
    enHouseLabel: 'Karma Sthana (10th House)',
    enStatusLabel: 'Highly Auspicious Career',
    enCareerFinance: 'Outstanding professional recognition, promotions, and lucrative new enterprise opportunities.',
    enFamilyHealth: 'Accomplishment of long-pending tasks brings joy and family honor.',
    enDairyam: 'Courage: The planetary transit is exceptionally favorable; focus firmly on your goals.',
    enRemedy: 'Chant Sri Aditya Hrudaya Stotram',
  },
  11: {
    houseLabel: 'ఏకాదశ చంద్రుడు (11వ లాభ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం • సర్వలాభం',
    careerFinance: 'ఆకస్మిక ధనలాభం, బకాయిలు వసూలవుతాయి. నూతన పెట్టుబడులు విశేష లాభాలను తెచ్చిపెడతాయి, కోరుకున్న కోరికలు తీరుతాయి.',
    familyHealth: 'మిత్రుల కలయిక ఆనందాన్ని ఇస్తుంది. కుటుంబంలో వేడుకలు, శుభవార్తలు వింటారు, ఆరోగ్యం అత్యుత్తమంగా ఉంటుంది.',
    dairyam: 'ధైర్యం & మనోధైర్యం: సర్వత్ర విజయం మీ పక్షాన ఉంది. వచ్చిన అవకాశాలను సద్వినియోగం చేసుకుని దీవించండి.',
    remedy: 'శ్రీ మహాలక్ష్మి పూజ, కనకధారా స్తోత్ర పారాయణం',
    enHouseLabel: 'Labha Sthana (11th House)',
    enStatusLabel: 'All-Round Prosperity',
    enCareerFinance: 'Sudden financial windfalls, clearance of pending receivables, and lucrative investments.',
    enFamilyHealth: 'Celebrations with dear friends, joyful news, and vibrant health and well-being.',
    enDairyam: 'Courage: Abundance and victory grace your path; welcome new opportunities with open arms.',
    enRemedy: 'Chant Sri Kanakadhara Stotram',
  },
  12: {
    houseLabel: 'ద్వాదశ చంద్రుడు (12వ వ్యయ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం • వ్యయం',
    careerFinance: 'శుభకార్యాల నిమిత్తం ఖర్చులు అధికమవుతాయి. పత్రాలపై సంతకాలు చేసేముందు జాగ్రత్తగా పరిశీలించండి, అప్పులు ఇవ్వవద్దు.',
    familyHealth: 'కంటి లేదా పాదాల అలసట ఉండవచ్చు. నిద్రలేమి సమస్యలు రాకుండా ధ్యానం చేయండి, ప్రశాంతమైన వాతావరణంలో ఉండండి.',
    dairyam: 'ధైర్యం & మానసిక భరోసా: ఖర్చులు పెరిగినా అవన్నీ శుభకార్యాలకే జరుగుతాయి. అధైర్యపడకండి, దైవధ్యానంతో మనస్సును నిలకడగా ఉంచుకోండి.',
    remedy: 'శ్రీ ఆంజనేయ స్వామి ఆలయ దర్శనం, హనుమాన్ చాలీసా పారాయణం',
    enHouseLabel: 'Vyaya Sthana (12th House)',
    enStatusLabel: 'Moderate Expenditure',
    enCareerFinance: 'Auspicious expenses for family or charitable purposes rise; avoid extending informal loans.',
    enFamilyHealth: 'Prioritize adequate sleep and physical rest; spiritual meditation alleviates tiredness.',
    enDairyam: 'Courage: Rising expenses are for good causes; maintain equanimity with faith in Lord Hanuman.',
    enRemedy: 'Recite Sri Hanuman Chalisa',
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

    // Build the 4-5 lines of comprehensive prediction
    const grahaSthitiLine = `1. గ్రహ గోచార స్థితి: ${fortune.houseLabel}${rahuTag ? `, ${rahuTag}` : ''}${guruTag ? `, ${guruTag}` : ''}${shaniTag ? `, ${shaniTag}` : ''} ప్రభావం నేడు మీ రాశిపై ఉంది.`;
    const careerFinanceLine = `2. ఉద్యోగ & ఆర్థిక ఫలం: ${fortune.careerFinance}`;
    const familyHealthLine = `3. కుటుంబం & ఆరోగ్యం: ${fortune.familyHealth}`;
    const dairyamLine = `4. ${fortune.dairyam}`;
    const remedyLine = `5. శాస్త్రోక్త పరిహారం: ${fortune.remedy}`;

    const fullSummary = [
      grahaSthitiLine,
      careerFinanceLine,
      familyHealthLine,
      dairyamLine,
      remedyLine,
    ].join('\n');

    const englishFullSummary = [
      `1. Planetary Transit: ${fortune.enHouseLabel}${enRahuTag ? `, ${enRahuTag}` : ''}${enGuruTag ? `, ${enGuruTag}` : ''}.`,
      `2. Career & Finance: ${fortune.enCareerFinance}`,
      `3. Family & Health: ${fortune.enFamilyHealth}`,
      `4. ${fortune.enDairyam}`,
      `5. Vedic Remedy: ${fortune.enRemedy}`,
    ].join('\n');

    return {
      ...rashi,
      gocharaHouse,
      houseLabel: fortune.houseLabel,
      status: isChandrashtamam ? ('caution' as const) : fortune.status,
      statusLabel: isChandrashtamam ? 'చంద్రాష్టమం • జాగ్రత్త' : fortune.statusLabel,
      navagrahaTransitLabel,
      grahaSthitiLine,
      careerFinanceLine,
      familyHealthLine,
      dairyamLine,
      remedyLine,
      fullSummary,
      summary: fullSummary,
      remedy: fortune.remedy,
      luckyNumber: luckyNum,
      englishNavagrahaLabel,
      englishFullSummary,
      englishDairyam: fortune.enDairyam,
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
    `🔮 *నేటి రాశి ఫలితాలు (నవ గ్రహ దిన ఫలం):*`,
    `• *మేష రాశి (${mesham.navagrahaTransitLabel}):* ${mesham.careerFinanceLine.replace(/^2\.\s*/, '')} [${mesham.statusLabel}]`,
    `• *వృషభ రాశి (${vrushabham.navagrahaTransitLabel}):* ${vrushabham.careerFinanceLine.replace(/^2\.\s*/, '')} [${vrushabham.statusLabel}]`,
    `• *మిథున రాశి (${mithunam.navagrahaTransitLabel}):* ${mithunam.careerFinanceLine.replace(/^2\.\s*/, '')} [${mithunam.statusLabel}]`,
    ``,
    `✨ *కర్కాటకం నుండి మీన రాశి వరకు మిగతా రాశి ఫలితాలు, పూర్తి 4-5 లైన్ల ఫలితాలు & రాశి చక్రం కోసం క్రింది వెబ్‌సైట్ చూడండి:*`,
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
      `🔮 *${rashi.teluguName} రాశి (${rashi.englishName}) — సంపూర్ణ దిన ఫలం:*`,
      `🪐 *గోచార సంయోగం:* ${rashi.navagrahaTransitLabel} (${rashi.statusLabel})`,
      `👑 *రాశి అధిపతి:* ${rashi.lord}`,
      ``,
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

  // Default ('all'): Custom summary message for each of the 12 Rashis with Navagraha & Courage reassurance
  const lines = [
    `🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — ద్వాదశ రాశి ఫలితాలు (నవ గ్రహ దిన ఫలం)* 🕉️`,
    `📅 *తేదీ & వారం:* ${day.teediVaram}`,
    `🌙 *తిథి:* ${day.panchanga.tithi.split('-')[0].trim()} | *నక్షత్రం:* ${day.panchanga.nakshatram.split('-')[0].trim()}`,
    `✨ *నేటి చంద్ర సంచారం:* ${moonRashiName} రాశి`,
    ``,
  ];

  fortunes.forEach((rashi, idx) => {
    lines.push(
      `${idx + 1}. *${rashi.teluguName} రాశి (${rashi.englishName})* [${rashi.navagrahaTransitLabel} • ${rashi.statusLabel}]:`,
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


