import { DayData, LagnaPramanam } from '../types/panchangam';

// Compact tuple format for each day from the user's JSON dataset:
// [0] isoDate ("2026-12-09")
// [1] yearName ("Parabhava" | "Plavanga")
// [2] ayana ("Dakshinayana" | "Uttarayana")
// [3] ritu ("Sharad" | "Hemanta" | "Shishira" | "Vasanta" | "Greeshma" | "Varsha")
// [4] lunarMonth ("Karthika" | "Margasira" | "Pushya" | "Magha" | "Phalguna" | "Chaitra" | "Vaisakha" | "Jyeshtha" | "Ashadha" | "Sravana" | "Bhadrapada" | "Aswayuja")
// [5] paksha ("Sukla" | "Krishna")
// [6] tithi ("Pratipat", "Dwitiya", etc.)
// [7] tithiEndTime ("7:02")
// [8] nakshatraCode ("Jye", "Mool", etc.)
// [9] nakshatraEndTime ("20:24")
// [10] yoga ("Dhriti", etc.)
// [11] karana ("Kimstughna", etc.)
// [12] sunrise ("6:38")
// [13] sunset ("17:37")
// [14] rahuKala ("12:08 - 13:30")
// [15] varjyam ("5:15-7:01" or "7:00-8:34,12:29-14:01" or "")
// [16] durMuhurtam ("11:46-12:29" or "8:49-9:33,13:57-14:41")
// [17] lagnas ("Sco:7:12,Sag:9:19,Cap:11:10,Aqu:12:49,Pis:14:24,Ari:16:08,Tau:18:07,Gem:20:19,Can:22:32,Leo:0:39,Vir:2:44,Lib:4:54")
// [18] planets ("5:Mars|Jup|Ket;7:Ven;8:Sun|Moon|Merc;11:Rah;12:Sat")
export type CompactPanchangamRow = string[];

const MONTH_TELUGU: Record<number, string> = {
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

const DOW_INFO: Record<number, { label: string; deity: string; luckyColor: string; yamagandam: string; abhijit: boolean }> = {
  0: {
    label: 'ఆదివారం',
    deity: 'సూర్య భగవానుడు, శ్రీ లక్ష్మీ నరసింహ స్వామి',
    luckyColor: 'ఎరుపు, నారింజ (Red/Orange)',
    yamagandam: 'మధ్యాహ్నం 12:10 PM నుండి మధ్యాహ్నం 01:35 PM వరకు',
    abhijit: true,
  },
  1: {
    label: 'సోమవారం',
    deity: 'పరమేశ్వరుడు (శివుడు), పార్వతీ దేవి',
    luckyColor: 'తెలుపు, వెండి (White/Silver)',
    yamagandam: 'ఉదయం 10:45 AM నుండి మధ్యాహ్నం 12:10 PM వరకు',
    abhijit: true,
  },
  2: {
    label: 'మంగళవారం',
    deity: 'సుబ్రహ్మణ్య స్వామి, ఆంజనేయ స్వామి',
    luckyColor: 'ఎరుపు, కాషాయం (Red/Vermilion)',
    yamagandam: 'ఉదయం 09:20 AM నుండి ఉదయం 10:45 AM వరకు',
    abhijit: true,
  },
  3: {
    label: 'బుధవారం',
    deity: 'శ్రీ విఘ్నేశ్వరుడు, శ్రీ మహావిష్ణువు',
    luckyColor: 'ఆకుపచ్చ (Green)',
    yamagandam: 'ఉదయం 07:55 AM నుండి ఉదయం 09:20 AM వరకు',
    abhijit: false,
  },
  4: {
    label: 'గురువారం',
    deity: 'శ్రీ దక్షిణామూర్తి, శ్రీ సాయిబాబా, గురు రాఘవేంద్ర స్వామి',
    luckyColor: 'పసుపు, బంగారు (Yellow/Gold)',
    yamagandam: 'ఉదయం 06:35 AM నుండి ఉదయం 07:58 AM వరకు',
    abhijit: true,
  },
  5: {
    label: 'శుక్రవారం',
    deity: 'శ్రీ మహాలక్ష్మి దేవి, శ్రీ లలితా త్రిపుర సుందరి',
    luckyColor: 'గులాబీ, తెలుపు (Pink/White)',
    yamagandam: 'మధ్యాహ్నం 02:55 PM నుండి సాయంత్రం 04:20 PM వరకు',
    abhijit: true,
  },
  6: {
    label: 'శనివారం',
    deity: 'శ్రీ వేంకటేశ్వర స్వామి, ఆంజనేయ స్వామి, శని దేవుడు',
    luckyColor: 'నీలం, నలుపు (Blue/Dark Navy)',
    yamagandam: 'మధ్యాహ్నం 01:35 PM నుండి మధ్యాహ్నం 02:58 PM వరకు',
    abhijit: true,
  },
};

const LUNAR_MONTH_TELUGU: Record<string, string> = {
  Karthika: 'కార్తీక మాసం',
  Margasira: 'మార్గశిర మాసం',
  Pushya: 'పుష్య మాసం',
  Magha: 'మాఘ మాసం',
  Phalguna: 'ఫాల్గుణ మాసం',
  Chaitra: 'చైత్ర మాసం',
  Vaisakha: 'వైశాఖ మాసం',
  Jyeshtha: 'జ్యేష్ఠ మాసం',
  Ashadha: 'ఆషాఢ మాసం',
  Sravana: 'శ్రావణ మాసం',
  Bhadrapada: 'భాద్రపద మాసం',
  Aswayuja: 'ఆశ్వయుజ మాసం',
};

const TITHI_TELUGU: Record<string, string> = {
  Pratipat: 'పాడ్యమి',
  Dwitiya: 'విదియ',
  Tritiya: 'తదియ',
  Chaturthi: 'చవితి',
  Panchami: 'పంచమి',
  Shashthi: 'షష్ఠి',
  Sapthami: 'సప్తమి',
  Ashtami: 'అష్టమి',
  Navami: 'నవమి',
  Dasami: 'దశమి',
  Ekadasi: 'ఏకాదశి',
  Dwadasi: 'ద్వాదశి',
  Trayodasi: 'త్రయోదశి',
  Chaturdasi: 'చతుర్దశి',
  Pournimasya: 'పౌర్ణమి',
  Amavasya: 'అమావాస్య',
};

const TITHI_ORDER = [
  'Pratipat', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Sapthami', 'Ashtami', 'Navami', 'Dasami', 'Ekadasi', 'Dwadasi',
  'Trayodasi', 'Chaturdasi', 'Pournimasya', 'Amavasya',
];

const NAKSHATRA_MAP: Record<string, { telugu: string; index: number }> = {
  Aswi: { telugu: 'అశ్విని', index: 1 },
  Bhar: { telugu: 'భరణి', index: 2 },
  Krit: { telugu: 'కృత్తిక', index: 3 },
  Rohi: { telugu: 'రోహిణి', index: 4 },
  Mrig: { telugu: 'మృగశిర', index: 5 },
  Ardr: { telugu: 'ఆరుద్ర', index: 6 },
  Puna: { telugu: 'పునర్వసు', index: 7 },
  Push: { telugu: 'పుష్యమి', index: 8 },
  Asre: { telugu: 'ఆశ్లేష', index: 9 },
  Magh: { telugu: 'మఖ', index: 10 },
  PPha: { telugu: 'పుబ్బ (పూర్వ ఫల్గుణి)', index: 11 },
  UPha: { telugu: 'ఉత్తర (ఉత్తర ఫల్గుణి)', index: 12 },
  Hast: { telugu: 'హస్త', index: 13 },
  Chit: { telugu: 'చిత్త', index: 14 },
  Swat: { telugu: 'స్వాతి', index: 15 },
  Visa: { telugu: 'విశాఖ', index: 16 },
  Anu: { telugu: 'అనురాధ', index: 17 },
  Jye: { telugu: 'జ్యేష్ఠ', index: 18 },
  Mool: { telugu: 'మూల', index: 19 },
  PSha: { telugu: 'పూర్వాషాఢ', index: 20 },
  USha: { telugu: 'ఉత్తరాషాఢ', index: 21 },
  Srav: { telugu: 'శ్రవణం', index: 22 },
  Dhan: { telugu: 'ధనిష్ఠ', index: 23 },
  Sata: { telugu: 'శతభిషం', index: 24 },
  PBha: { telugu: 'పూర్వాభాద్ర', index: 25 },
  UBha: { telugu: 'ఉత్తరాభాద్ర', index: 26 },
  Reva: { telugu: 'రేవతి', index: 27 },
};

const NAKSHATRA_NAMES_BY_INDEX: Record<number, string> = {
  1: 'అశ్విని', 2: 'భరణి', 3: 'కృత్తిక', 4: 'రోహిణి', 5: 'మృగశిర',
  6: 'ఆరుద్ర', 7: 'పునర్వసు', 8: 'పుష్యమి', 9: 'ఆశ్లేష', 10: 'మఖ',
  11: 'పుబ్బ', 12: 'ఉత్తర', 13: 'హస్త', 14: 'చిత్త', 15: 'స్వాతి',
  16: 'విశాఖ', 17: 'అనురాధ', 18: 'జ్యేష్ఠ', 19: 'మూల', 20: 'పూర్వాషాఢ',
  21: 'ఉత్తరాషాఢ', 22: 'శ్రవణం', 23: 'ధనిష్ఠ', 24: 'శతభిషం', 25: 'పూర్వాభాద్ర',
  26: 'ఉత్తరాభాద్ర', 27: 'రేవతి',
};

const YOGA_TELUGU: Record<string, string> = {
  Vishkambha: 'విష్కంభ యోగం',
  Priti: 'ప్రీతి యోగం',
  Ayushman: 'ఆయుష్మాన్ యోగం',
  Soubhagya: 'సౌభాగ్య యోగం',
  Sobhana: 'శోభన యోగం',
  Atiganda: 'అతిగండ యోగం',
  Sukarman: 'సుకర్మణ యోగం',
  Dhriti: 'ధృతి యోగం',
  Soola: 'శూల యోగం',
  Ganda: 'గండ యోగం',
  Vriddhi: 'వృద్ధి యోగం',
  Dhruva: 'ధృవ యోగం',
  Vyaghata: 'వ్యాఘాత యోగం',
  Harshana: 'హర్షణ యోగం',
  Vajra: 'వజ్ర యోగం',
  Siddhi: 'సిద్ధి యోగం',
  Vyatipata: 'వ్యతీపాత యోగం',
  Variyan: 'వరీయాన్ యోగం',
  Parigha: 'పరిఘ యోగం',
  Siva: 'శివ యోగం',
  Siddha: 'సిద్ధ యోగం',
  Sadhya: 'సాధ్య యోగం',
  Subha: 'శుభ యోగం',
  Sukla: 'శుక్ల యోగం',
  Brahma: 'బ్రహ్మ యోగం',
  Indra: 'ఇంద్ర యోగం',
  Vaidhriti: 'వైధృతి యోగం',
};

const KARANA_TELUGU: Record<string, string> = {
  Bava: 'బవ కరణం',
  Balava: 'బాలవ కరణం',
  Kaulava: 'కౌలవ కరణం',
  Taitula: 'తైతుల కరణం',
  Garija: 'గరిజ కరణం',
  Vanija: 'వణిజ కరణం',
  Vishti: 'విష్టి (భద్ర) కరణం',
  Sakuna: 'శకుন కరణం',
  Chatushpada: 'చతుష్పాద కరణం',
  Naga: 'నాగ కరణం',
  Kimstughna: 'కింస్తుఘ్న కరణం',
};

const LAGNA_CODE_TELUGU: Record<string, string> = {
  Ari: 'మేష లగ్నం',
  Tau: 'వృషభ లగ్నం',
  Gem: 'మిథున లగ్నం',
  Can: 'కర్కాటక లగ్నం',
  Leo: 'సింహ లగ్నం',
  Vir: 'కన్యా లగ్నం',
  Lib: 'తుల లగ్నం',
  Sco: 'వృశ్చిక లగ్నం',
  Sag: 'ధనుర్లగ్నం',
  Cap: 'మకర లగ్నం',
  Aqu: 'కుంభ లగ్నం',
  Pis: 'మీన లగ్నం',
};

const PLANET_TELUGU: Record<string, string> = {
  Sun: 'సూర్యుడు',
  Moon: 'చంద్రుడు',
  Mars: 'కుజుడు',
  Merc: 'బుధుడు',
  Jup: 'గురుడు',
  Ven: 'శుక్రుడు',
  Sat: 'శని',
  Rah: 'రాహువు',
  Ket: 'కేతువు',
};

const HOUSE_KEY_BY_NUM: Record<string, string> = {
  '1': 'mesham',
  '2': 'vrushabham',
  '3': 'mithunam',
  '4': 'karkatakam',
  '5': 'simham',
  '6': 'kanya',
  '7': 'tula',
  '8': 'vruschikam',
  '9': 'dhanussu',
  '10': 'makaram',
  '11': 'kumbham',
  '12': 'meenam',
};

const RASHI_INFO_BY_KEY: Record<string, { name: string; favorable: string; chandrashtamam: string }> = {
  mesham: {
    name: 'మేష రాశి',
    favorable: 'మేషం, మిథునం, కర్కాటకం, తుల, కుంభం, మీనం',
    chandrashtamam: 'కన్యా రాశి',
  },
  vrushabham: {
    name: 'వృషభ రాశి',
    favorable: 'వృషభం, కర్కాటకం, సింహం, వృశ్చికం, మీనం, మేషం',
    chandrashtamam: 'తులా రాశి',
  },
  mithunam: {
    name: 'మిథున రాశి',
    favorable: 'మిథునం, సింహం, కన్య, ధనుస్సు, మేషం, వృషభం',
    chandrashtamam: 'వృశ్చిక రాశి',
  },
  karkatakam: {
    name: 'కర్కాటక రాశి',
    favorable: 'కర్కాటకం, కన్య, తుల, మకరం, వృషభం, మిథునం',
    chandrashtamam: 'ధనుస్సు రాశి',
  },
  simham: {
    name: 'సింహ రాశి',
    favorable: 'సింహం, తుల, వృశ్చికం, కుంభం, మిథునం, కర్కాటకం',
    chandrashtamam: 'మకర రాశి',
  },
  kanya: {
    name: 'కన్యా రాశి',
    favorable: 'కన్య, వృశ్చికం, ధనుస్సు, మీనం, కర్కాటకం, సింహం',
    chandrashtamam: 'కుంభ రాశి',
  },
  tula: {
    name: 'తులా రాశి',
    favorable: 'తుల, ధనుస్సు, మకరం, మేషం, సింహం, కన్య',
    chandrashtamam: 'మీన రాశి',
  },
  vruschikam: {
    name: 'వృశ్చిక రాశి',
    favorable: 'వృశ్చికం, మకరం, కుంభం, వృషభం, కన్య, తుల',
    chandrashtamam: 'మేష రాశి',
  },
  dhanussu: {
    name: 'ధనుస్సు రాశి',
    favorable: 'ధనుస్సు, కుంభం, మీనం, మిథునం, తుల, వృశ్చికం',
    chandrashtamam: 'వృషభ రాశి',
  },
  makaram: {
    name: 'మకర రాశి',
    favorable: 'మకరం, మీనం, మేషం, కర్కాటకం, వృశ్చికం, ధనుస్సు',
    chandrashtamam: 'మిథున రాశి',
  },
  kumbham: {
    name: 'కుంభ రాశి',
    favorable: 'కుంభం, మేషం, వృషభం, సింహం, ధనుస్సు, మకరం',
    chandrashtamam: 'కర్కాటక రాశి',
  },
  meenam: {
    name: 'మీన రాశి',
    favorable: 'మీనం, వృషభం, మిథునం, కన్య, మకరం, కుంభం',
    chandrashtamam: 'సింహ రాశి',
  },
};

function format24ToTelugu(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.trim().split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  if (isNaN(h)) return time24;
  if (h === 24) h = 0;

  let period = 'ఉదయం';
  let ampm = 'AM';
  if (h >= 0 && h < 4) {
    period = 'అర్ధరాత్రి';
    ampm = 'AM';
  } else if (h >= 4 && h < 6) {
    period = 'తెల్లవారుజామున';
    ampm = 'AM';
  } else if (h >= 6 && h < 12) {
    period = 'ఉదయం';
    ampm = 'AM';
  } else if (h >= 12 && h < 16) {
    period = 'మధ్యాహ్నం';
    ampm = 'PM';
  } else if (h >= 16 && h < 19) {
    period = 'సాయంత్రం';
    ampm = 'PM';
  } else {
    period = 'రాత్రి';
    ampm = 'PM';
  }

  const h12 = h % 12 === 0 ? 12 : h % 12;
  const h12Str = String(h12).padStart(2, '0');
  return `${period} ${h12Str}:${m} ${ampm}`;
}

function formatRangeToTelugu(rangeStr: string): string {
  if (!rangeStr) return 'ఈ రోజు వర్జ్యం లేదు';
  const parts = rangeStr.split(',').map((seg) => {
    const [s, e] = seg.trim().split(/\s*-\s*/);
    if (!s || !e) return seg;
    return `${format24ToTelugu(s)} నుండి ${format24ToTelugu(e)} వరకు`;
  });
  return parts.join(' మరియు ');
}

function buildNavataraBalamText(nakCode: string): string {
  const info = NAKSHATRA_MAP[nakCode] || { telugu: 'అశ్విని', index: 1 };
  const idx = info.index;
  const getTriad = (offset: number) => {
    const n1 = ((idx - 1 + offset) % 27) + 1;
    const n2 = ((n1 - 1 + 9) % 27) + 1;
    const n3 = ((n2 - 1 + 9) % 27) + 1;
    return `${NAKSHATRA_NAMES_BY_INDEX[n1]}, ${NAKSHATRA_NAMES_BY_INDEX[n2]}, ${NAKSHATRA_NAMES_BY_INDEX[n3]}`;
  };

  return `${info.telugu.split(' ')[0]} నక్షత్రం కావున ${getTriad(1)} (సంపత్తార), ${getTriad(3)} (క్షేమతార), ${getTriad(5)} (సాధక తార), ${getTriad(7)} (మిత్ర తార), ${getTriad(8)} (పరమ మిత్ర తార) నక్షత్రాల వారికి తారాబలం అనుకూలంగా ఉండి శుభ ఫలితాలు కలుగుతాయి.`;
}

const ADHIKA_TITHI_FIRST_DAYS = new Set<string>([
  '2026-12-09',
  '2027-01-10',
  '2027-03-03',
  '2027-04-25',
  '2027-05-27',
  '2027-06-18',
  '2027-07-22',
  '2027-08-14',
  '2027-09-17',
  '2027-10-07',
  '2027-11-08',
]);

function detectSpecialEvent(isoDate: string, lunarMonth: string, paksha: string, tithi: string): string | undefined {
  const fixedEvents: Record<string, string> = {
    '2026-12-09': 'మార్గశిర మాస ప్రారంభం',
    '2026-12-20': 'వైకుంఠ (ముక్కోటి) ఏకాదశి · గీతా జయంతి',
    '2026-12-23': 'శ్రీ దత్తాత్రేయ జయంతి · మార్గశిర పౌర్ణమి',
    '2027-01-01': 'ఆంగ్ల నూతన సంవత్సరాది (2027)',
    '2027-01-03': 'సఫల ఏకాదశి వ్రతం',
    '2027-01-13': 'భోగి పండుగ',
    '2027-01-14': 'మకర సంక్రాంతి పుణ్యకాలం',
    '2027-01-15': 'కనుమ పండుగ · ఉత్తరాయణ పుణ్యకాలం',
    '2027-01-18': 'పుష్య పుత్రదా ఏకాదశి వ్రతం',
    '2027-02-06': 'మౌని అమావాస్య',
    '2027-02-11': 'వసంత పంచమి (శ్రీ సరస్వతీ పూజ)',
    '2027-02-13': 'రథ సప్తమి (సూర్య జయంతి)',
    '2027-02-17': 'భీష్మ ఏకాదశి',
    '2027-03-04': 'విజయ ఏకాదశి వ్రతం',
    '2027-03-06': 'మహా శివరాత్రి పర్వదినం',
    '2027-03-22': 'హోళికా పౌర్ణమి (కామదహనం)',
    '2027-04-07': 'శ్రీ ప్లవంగ నామ సంవత్సర ఉగాది పండుగ',
    '2027-04-15': 'శ్రీ రామ నవమి మహాపర్వదినం',
    '2027-05-09': 'అక్షయ తృతీయ పర్వదినం',
    '2027-05-20': 'వైశాఖ పౌర్ణమి · బుద్ధ పౌర్ణమి',
    '2027-06-18': 'వట సావిత్రి వ్రతం · జ్యేష్ఠ పౌర్ణమి',
    '2027-07-14': 'తొలి ఏకాదశి (శయన ఏకాదశి)',
    '2027-07-18': 'గురు పౌర్ణమి (వ్యాస పౌర్ణమి)',
    '2027-08-13': 'వరలక్ష్మీ వ్రతం',
    '2027-08-17': 'శ్రావణ పౌర్ణమి · రాఖీ పౌర్ణమి',
    '2027-08-25': 'శ్రీ కృష్ణాష్టమి (జన్మాష్టమి)',
    '2027-09-04': 'శ్రీ వినాయక చవితి పర్వదినం',
    '2027-09-15': 'భాద్రపద పౌర్ణమి · మహాలయ పక్ష ప్రారంభం',
    '2027-09-30': 'మహాలయ అమావాస్య',
    '2027-10-01': 'శరన్నవరాత్రి కలశ స్థాపన',
    '2027-10-07': 'దుర్గాష్టమి పూజ',
    '2027-10-08': 'మహానవమి · ఆయుధ పూజ',
    '2027-10-09': 'శ్రీ విజయదశమి (దసరా పండుగ)',
    '2027-10-29': 'దీపావళి అమావాస్య · శ్రీ మహాలక్ష్మీ పూజ',
    '2027-11-14': 'కార్తీక పౌర్ణమి · జ్వాలా తోరణం',
  };
  if (fixedEvents[isoDate]) return fixedEvents[isoDate];

  // Prevent 2-day duplicate festival labels when a tithi spans across two sunrises (Adhika Tithi)
  const skipDuplicateTithiDates = new Set<string>([
    '2026-12-24', // Margasira Pournami already on 2026-12-23
    '2027-03-03', // Vijaya Ekadasi is on 2027-03-04 (Smarta/Vaishnava)
    '2027-06-19', // Jyeshtha Pournami already on 2027-06-18
    '2027-07-23', // Sankashtahara Chaturthi moonrise is on 2027-07-22
    '2027-08-15', // Pradosham sunset is on 2027-08-14
  ]);
  if (skipDuplicateTithiDates.has(isoDate)) return undefined;

  if (tithi === 'Ekadasi') return `${LUNAR_MONTH_TELUGU[lunarMonth]?.split(' ')[0] || ''} ${paksha === 'Sukla' ? 'శుద్ధ' : 'బహుళ'} ఏకాదశి వ్రతం`;
  if (tithi === 'Pournimasya') return `${LUNAR_MONTH_TELUGU[lunarMonth]?.split(' ')[0] || ''} పౌర్ణమి వ్రతం`;
  if (tithi === 'Amavasya') return `${LUNAR_MONTH_TELUGU[lunarMonth]?.split(' ')[0] || ''} అమావాస్య`;
  if (tithi === 'Chaturthi' && paksha === 'Krishna') return 'సంకష్టహర చతుర్థి వ్రతం';
  if (tithi === 'Trayodasi') return 'ప్రదోష కాల శివారాధన';
  return undefined;
}

export function convertCompactRowToDayData(row: CompactPanchangamRow): DayData {
  const [
    isoDate, yearName, _ayana, _ritu, lunarMonth, paksha, tithi, tithiEnd,
    nakCode, nakEnd, yoga, karana, sunrise, _sunset, rahuKala,
    varjyamStr, durMuhurtamStr, lagnasStr, planetsStr,
  ] = row;

  const [yStr, mStr, dStr] = isoDate.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);
  const dt = new Date(Date.UTC(year, month - 1, day));
  const dow = dt.getUTCDay();
  const dowMeta = DOW_INFO[dow] || DOW_INFO[0];
  const monthTelugu = MONTH_TELUGU[month] || 'డిసెంబర్';

  const tithiTelugu = TITHI_TELUGU[tithi] || tithi;
  const tithiIdx = TITHI_ORDER.indexOf(tithi);
  const nextTithiEng = tithiIdx >= 0 ? TITHI_ORDER[(tithiIdx + 1) % TITHI_ORDER.length] : 'Dwitiya';
  const nextTithiTelugu = TITHI_TELUGU[nextTithiEng] || 'విదియ';

  const nakObj = NAKSHATRA_MAP[nakCode] || { telugu: nakCode, index: 1 };
  const nextNakIdx = (nakObj.index % 27) + 1;
  const nextNakTelugu = NAKSHATRA_NAMES_BY_INDEX[nextNakIdx] || 'భరణి';

  const lagnalu: LagnaPramanam[] = [];
  const lagnaPairs = lagnasStr.split(',').filter(Boolean);
  let prevTime = sunrise;
  for (const pair of lagnaPairs) {
    const idxColon = pair.indexOf(':');
    const code = pair.slice(0, idxColon);
    const endTime = pair.slice(idxColon + 1);
    lagnalu.push({
      lagnam: LAGNA_CODE_TELUGU[code] || `${code} లగ్నం`,
      samayam: `${format24ToTelugu(prevTime)} నుండి ${format24ToTelugu(endTime)} వరకు`,
    });
    prevTime = endTime;
  }

  const grahaStithi: Record<string, string> = {
    mesham: '', vrushabham: '', mithunam: '', karkatakam: '',
    simham: '', kanya: '', tula: '', vruschikam: '',
    dhanussu: '', makaram: '', kumbham: '', meenam: '',
  };

  let moonHouseKey = 'mesham';
  if (planetsStr) {
    for (const entry of planetsStr.split(';')) {
      const [hNum, pList] = entry.split(':');
      const hKey = HOUSE_KEY_BY_NUM[hNum];
      if (hKey && pList) {
        const pCodes = pList.split('|');
        if (pCodes.includes('Moon')) {
          moonHouseKey = hKey;
        }
        grahaStithi[hKey] = pCodes.map((c) => PLANET_TELUGU[c] || c).join(', ');
      }
    }
  }

  const rashiInfo = RASHI_INFO_BY_KEY[moonHouseKey] || RASHI_INFO_BY_KEY.mesham;
  const specialEvent = detectSpecialEvent(isoDate, lunarMonth, paksha, tithi);
  const tithiFormatted = ADHIKA_TITHI_FIRST_DAYS.has(isoDate)
    ? `${tithiTelugu} - సూర్యోదయం నుండి పూర్తి రోజు (మరుసటి రోజు ${format24ToTelugu(tithiEnd)} వరకు)`
    : `${tithiTelugu} - సూర్యోదయం నుండి ${format24ToTelugu(tithiEnd)} వరకు (తదుపరి ${nextTithiTelugu})`;

  return {
    id: isoDate,
    label: dowMeta.label,
    dateNum: String(day),
    teediVaram: `${day} ${monthTelugu} ${year}, ${dowMeta.label}`,
    isoDate,
    monthName: monthTelugu,
    deity: dowMeta.deity,
    luckyColor: dowMeta.luckyColor,
    ...(specialEvent ? { specialEvent } : {}),
    panchanga: {
      samvatsaram: yearName === 'Plavanga' ? 'శ్రీ ప్లవంగ నామ సంవత్సరం' : 'శ్రీ పరాభవ నామ సంవత్సరం',
      masam: `${LUNAR_MONTH_TELUGU[lunarMonth] || lunarMonth}, ${paksha === 'Sukla' ? 'శుక్ల పక్షం' : 'కృష్ణ పక్షం'}`,
      tithi: tithiFormatted,
      nakshatram: `${nakObj.telugu} - సూర్యోదయం నుండి ${format24ToTelugu(nakEnd)} వరకు (తదుపరి ${nextNakTelugu})`,
      yogam: YOGA_TELUGU[yoga] || `${yoga} యోగం`,
      karanam: KARANA_TELUGU[karana] || `${karana} కరణం`,
    },
    lagnalu,
    grahaStithi,
    shubha: {
      amrutha: varjyamStr ? 'తెల్లవారుజామున మరియు సాయంత్రం శుభ ఘడియలు అనుకూలం' : 'ఈ రోజు సర్వత్రా శుభ ఘడియలు అనుకూలం',
      abhijit: dowMeta.abhijit
        ? 'ఉదయం 11:45 AM నుండి మధ్యాహ్నం 12:32 PM వరకు'
        : 'బుధవారం కావున అభిజిత్ ముహూర్తం లేదు',
    },
    ashubha: {
      rahukalam: formatRangeToTelugu(rahuKala),
      yamagandam: dowMeta.yamagandam,
      durmuhurtham: durMuhurtamStr ? formatRangeToTelugu(durMuhurtamStr) : 'ఈ రోజు దుర్ముహూర్తం లేదు',
      varjyam: varjyamStr ? formatRangeToTelugu(varjyamStr) : 'ఈ రోజు వర్జ్యం లేదు',
    },
    chandra: {
      sancharam: `ఈ రోజు చంద్రుడు ${rashiInfo.name}లో సంచరిస్తున్నాడు. కావున ${rashiInfo.favorable} రాశుల వారికి చంద్రబలం అనుకూలంగా ఉండి శుభ ఫలితాలు కలుగుతాయి.`,
      chandrashtamam: `${rashiInfo.chandrashtamam} వారికి ఈ రోజు చంద్రాష్టమం. కావున ఈ రాశి వారు ప్రయాణాలు, నూతన కార్యాలు వాయిదా వేసుకోవడం శుభప్రదం.`,
      navataraBalam: buildNavataraBalamText(nakCode),
    },
    phalitham: specialEvent
      ? `ఈ రోజు ${specialEvent} (${dowMeta.label}). ${dowMeta.deity} ఆరాధన మరియు జప పారాయణలు చేయడం వలన సకల శుభాలు, ఆయురారోగ్య ఐశ్వర్యాలు సిద్ధిస్తాయి.`
      : `ఈ రోజు ${LUNAR_MONTH_TELUGU[lunarMonth] || ''}, ${tithiTelugu} తిథి, ${nakObj.telugu} నక్షత్రం. ${dowMeta.deity} ఆరాధన చేయడం వలన తలపెట్టిన పనులలో ఆటంకాలు తొలగి శుభ ఫలితాలు చేకూరుతాయి.`,
  };
}
