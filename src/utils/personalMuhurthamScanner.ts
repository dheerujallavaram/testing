import {
  getSiderealAscendant,
  getSiderealMoonLongitude,
  getSiderealSunLongitude,
  norm360,
} from './astronomyPanchangam';

export type MuhurthamEventType =
  | 'marriage'
  | 'gruhapravesam'
  | 'namakaranam'
  | 'vehicle'
  | 'business'
  | 'bhoomipuja';

export interface PersonalMuhurthamSlot {
  isoDate: string;
  displayDateEn: string;
  weekdayTe: string;
  weekdayEn: string;
  tithiTe: string;
  tithiEn: string;
  nakshatraTe: string;
  nakshatraEn: string;
  taraNum: number;
  taraNameTe: string;
  taraNameEn: string;
  chandraHouse: number;
  shubhaLagnaNameTe: string;
  shubhaLagnaWindow: string;
  score: number;
  reasonTe: string;
  reasonEn: string;
}

const WEEKDAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const NAKSHATRAS_LIST = [
  { te: 'అశ్విని', en: 'Ashwini' },
  { te: 'భరణి', en: 'Bharani' },
  { te: 'కృత్తిక', en: 'Krittika' },
  { te: 'రోహిణి', en: 'Rohini' },
  { te: 'మృగశిర', en: 'Mrigashira' },
  { te: 'ఆరుద్ర', en: 'Ardra' },
  { te: 'పునర్వసు', en: 'Punarvasu' },
  { te: 'పుష్యమి', en: 'Pushyami' },
  { te: 'ఆశ్లేష', en: 'Ashlesha' },
  { te: 'మఖ', en: 'Magha' },
  { te: 'పుబ్బ', en: 'Pubba' },
  { te: 'ఉత్తర', en: 'Uttara' },
  { te: 'హస్త', en: 'Hasta' },
  { te: 'చిత్త', en: 'Chitta' },
  { te: 'స్వాతి', en: 'Swati' },
  { te: 'విశాఖ', en: 'Vishakha' },
  { te: 'అనురాధ', en: 'Anuradha' },
  { te: 'జ్యేష్ఠ', en: 'Jyeshtha' },
  { te: 'మూల', en: 'Moola' },
  { te: 'పూర్వాషాఢ', en: 'Purvashadha' },
  { te: 'ఉత్తరాషాఢ', en: 'Uttarashadha' },
  { te: 'శ్రవణం', en: 'Shravanam' },
  { te: 'ధనిష్ఠ', en: 'Dhanishtha' },
  { te: 'శతభిషం', en: 'Shatabhisham' },
  { te: 'పూర్వాభాద్ర', en: 'Purvabhadra' },
  { te: 'ఉత్తరాభాద్ర', en: 'Uttarabhadra' },
  { te: 'రేవతి', en: 'Revati' },
];

const RASHIS_TE = [
  'మేష లగ్నం', 'వృషభ లగ్నం', 'మిథున లగ్నం', 'కర్కాటక లగ్నం',
  'సింహ లగ్నం', 'కన్యా లగ్నం', 'తులా లగ్నం', 'వృశ్చిక లగ్నం',
  'ధనుర్ లగ్నం', 'మకర లగ్నం', 'కుంభ లగ్నం', 'మీన లగ్నం',
];

const TITHI_NAMES_TE = [
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి',
  'అష్టమి', 'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి',
];

const TITHI_NAMES_EN = [
  'Padyami', 'Vidiya', 'Tadiya', 'Chavithi', 'Panchami', 'Shashthi', 'Sapthami',
  'Ashtami', 'Navami', 'Dasami', 'Ekadasi', 'Dwadasi', 'Trayodasi', 'Chaturdasi',
];

const TARA_LABELS = [
  { num: 1, te: 'జన్మ తార', en: 'Janma Tara', good: false },
  { num: 2, te: 'సంపత్ తార', en: 'Sampat Tara', good: true },
  { num: 3, te: 'విపత్ తార', en: 'Vipat Tara', good: false },
  { num: 4, te: 'క్షేమ తార', en: 'Kshema Tara', good: true },
  { num: 5, te: 'ప్రత్యక్ తార', en: 'Pratyak Tara', good: false },
  { num: 6, te: 'సాధన తార', en: 'Sadhana Tara', good: true },
  { num: 7, te: 'నైధన తార', en: 'Naidhana Tara', good: false },
  { num: 8, te: 'మిత్ర తార', en: 'Mitra Tara', good: true },
  { num: 9, te: 'పరమ మిత్ర తార', en: 'Parama Mitra Tara', good: true },
];

export const MUHURTHAM_EVENT_OPTIONS: {
  id: MuhurthamEventType;
  labelTe: string;
  labelEn: string;
  bestNaks: number[];
  bestDays: number[]; // 0=Sun..6=Sat
}[] = [
  {
    id: 'marriage',
    labelTe: 'వివాహం (Marriage)',
    labelEn: 'Marriage (Vivaha)',
    bestNaks: [3, 4, 9, 11, 12, 14, 16, 18, 20, 25, 26], // Rohini, Mrig, Magha, Uttara, Hasta, Swati, Anu, Moola, USha, UBha, Revati
    bestDays: [1, 3, 4, 5],
  },
  {
    id: 'gruhapravesam',
    labelTe: 'గృహప్రవేశం (Housewarming)',
    labelEn: 'Housewarming (Gruhapravesam)',
    bestNaks: [3, 4, 7, 11, 12, 16, 20, 21, 22, 25, 26],
    bestDays: [1, 3, 4, 5, 6],
  },
  {
    id: 'namakaranam',
    labelTe: 'నామకరణం (Naming Ceremony)',
    labelEn: 'Baby Naming (Namakaranam)',
    bestNaks: [0, 3, 4, 6, 7, 11, 12, 14, 16, 20, 21, 22, 23, 25, 26],
    bestDays: [1, 3, 4, 5],
  },
  {
    id: 'vehicle',
    labelTe: 'వాహన కొనుగోలు (Vehicle Purchase)',
    labelEn: 'Vehicle Purchase',
    bestNaks: [0, 6, 7, 12, 14, 16, 21, 22, 23, 26],
    bestDays: [0, 1, 3, 4, 5],
  },
  {
    id: 'business',
    labelTe: 'వ్యాపార ప్రారంభం (New Business)',
    labelEn: 'Business / Office Opening',
    bestNaks: [0, 3, 6, 7, 11, 12, 13, 14, 16, 20, 21, 25, 26],
    bestDays: [0, 1, 3, 4, 5],
  },
  {
    id: 'bhoomipuja',
    labelTe: 'భూమి పూజ / శంకుస్థాపన',
    labelEn: 'Bhoomi Pooja / Foundation',
    bestNaks: [3, 4, 7, 11, 12, 16, 20, 21, 22, 25, 26],
    bestDays: [1, 3, 4, 5, 6],
  },
];

// Rahu Kalam rough hour windows by weekday 0=Sun..6=Sat to avoid overlapping Lagna
const RAHU_START_HR: Record<number, number> = {
  0: 16.5,
  1: 7.5,
  2: 15.0,
  3: 12.0,
  4: 13.5,
  5: 10.5,
  6: 9.0,
};

function findMorningShubhaLagna(year: number, monthIdx0: number, day: number, weekday: number): { lagnaTe: string; window: string } {
  const rahuStart = RAHU_START_HR[weekday] ?? 12;
  const candidateHours = [7.0, 8.0, 9.0, 10.0, 11.2];
  let chosenHour = 9.0;
  for (const h of candidateHours) {
    if (h >= rahuStart + 1.5 || h + 1.5 <= rahuStart) {
      chosenHour = h;
      break;
    }
  }
  const hr = Math.floor(chosenHour);
  const min = Math.round((chosenHour - hr) * 60);
  const utcMs = Date.UTC(year, monthIdx0, day, hr, min) - 5.5 * 3600 * 1000;
  const ascLon = getSiderealAscendant(new Date(utcMs), 17.385, 78.4867);
  const lagnaIdx = Math.floor(ascLon / 30) % 12;

  const startStr = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  const endTotalMin = hr * 60 + min + 85;
  const endStr = `${String(Math.floor(endTotalMin / 60)).padStart(2, '0')}:${String(endTotalMin % 60).padStart(2, '0')}`;

  return {
    lagnaTe: RASHIS_TE[lagnaIdx],
    window: `${startStr} – ${endStr} AM`,
  };
}

export function scanNext90DaysPersonalMuhurthams(
  eventType: MuhurthamEventType,
  userNakIdx0: number,
  userRashiIdx0: number
): PersonalMuhurthamSlot[] {
  const cfg = MUHURTHAM_EVENT_OPTIONS.find((o) => o.id === eventType) || MUHURTHAM_EVENT_OPTIONS[0];
  const now = new Date();
  const results: PersonalMuhurthamSlot[] = [];

  for (let offset = 1; offset <= 90; offset++) {
    const target = new Date(now.getTime() + offset * 86400 * 1000);
    const y = target.getUTCFullYear();
    const m = target.getUTCMonth();
    const d = target.getUTCDate();
    const weekday = target.getUTCDay();

    // Sample at 08:30 AM IST
    const sampleUtc = new Date(Date.UTC(y, m, d, 8, 30) - 5.5 * 3600 * 1000);
    const sunLon = getSiderealSunLongitude(sampleUtc);
    const moonLon = getSiderealMoonLongitude(sampleUtc);

    const elong = norm360(moonLon - sunLon);
    const tithiIdx0 = Math.floor(elong / 12) % 30;
    const tithiDay15 = (tithiIdx0 % 15) + 1; // 1..15

    // Exclude Amavasya (29), Ashtami (8), Navami (9), Chaturthi (4), Chaturdashi (14)
    if (tithiIdx0 === 29 || [4, 8, 9, 14].includes(tithiDay15)) continue;

    // For marriage / housewarming, prefer Shukla Paksha or early Krishna Paksha (1..5)
    if ((eventType === 'marriage' || eventType === 'gruhapravesam') && tithiIdx0 >= 20) continue;

    const dayNakIdx0 = Math.floor(moonLon / (360 / 27)) % 27;
    const dayRashiIdx0 = Math.floor(moonLon / 30) % 12;

    // Exclude Tuesday for auspicious samskaras except vehicle/bhoomi
    if (weekday === 2 && !['vehicle', 'bhoomipuja'].includes(eventType)) continue;

    // Tarabalam calculation (from user's birth star)
    const taraIdx0 = ((dayNakIdx0 - userNakIdx0 + 27) % 27) % 9;
    const tara = TARA_LABELS[taraIdx0];
    if (!tara.good) continue;

    // Chandrabalam (exclude 4, 8, 12 for key ceremonies, always exclude 8)
    const chandraHouse = ((dayRashiIdx0 - userRashiIdx0 + 12) % 12) + 1;
    if (chandraHouse === 8 || chandraHouse === 12) continue;

    let score = 62;
    if (cfg.bestNaks.includes(dayNakIdx0)) score += 16;
    if (cfg.bestDays.includes(weekday)) score += 10;
    if ([1, 3, 6, 7, 10, 11].includes(chandraHouse)) score += 8;
    if (tithiIdx0 < 15) score += 4; // Shukla paksha bonus

    if (score < 76) continue;

    const pakshaTe = tithiIdx0 < 15 ? 'శుక్ల' : 'కృష్ణ';
    const pakshaEn = tithiIdx0 < 15 ? 'Shukla' : 'Krishna';
    const tithiTe =
      tithiIdx0 === 14 ? 'పౌర్ణమి' : `${pakshaTe} ${TITHI_NAMES_TE[tithiIdx0 % 15]}`;
    const tithiEn =
      tithiIdx0 === 14 ? 'Pournami' : `${pakshaEn} ${TITHI_NAMES_EN[tithiIdx0 % 15]}`;

    const isoDate = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const displayDateEn = target.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });

    const lagnaPick = findMorningShubhaLagna(y, m, d, weekday);

    results.push({
      isoDate,
      displayDateEn,
      weekdayTe: WEEKDAYS_TE[weekday],
      weekdayEn: WEEKDAYS_EN[weekday],
      tithiTe,
      tithiEn,
      nakshatraTe: NAKSHATRAS_LIST[dayNakIdx0].te,
      nakshatraEn: NAKSHATRAS_LIST[dayNakIdx0].en,
      taraNum: tara.num,
      taraNameTe: tara.te,
      taraNameEn: tara.en,
      chandraHouse,
      shubhaLagnaNameTe: lagnaPick.lagnaTe,
      shubhaLagnaWindow: lagnaPick.window,
      score: Math.min(99, score),
      reasonTe: `${tara.te} బలం + చంద్రుడు ${chandraHouse}వ స్థానం + ${tithiTe} శుభ యోగం.`,
      reasonEn: `${tara.en} strength + Moon in H${chandraHouse} + auspicious ${tithiEn}.`,
    });
  }

  return results
    .sort((a, b) => b.score - a.score || a.isoDate.localeCompare(b.isoDate))
    .slice(0, 10);
}
