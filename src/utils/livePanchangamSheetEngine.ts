import * as Astronomy from 'astronomy-engine';
import { DayData } from '../types/panchangam';
import {
  getLahiriAyanamsa,
  getSiderealAscendant,
  getSiderealMoonLongitude,
  getSiderealPlanetLongitude,
  getSiderealRahuKetu,
  getSiderealSunLongitude,
  norm360,
} from './astronomyPanchangam';

export interface SheetPlanetGlyph {
  id: string;
  shortTe: string;
  shortEn: string;
  fullTe: string;
  fullEn: string;
  color: string;
  rashiIdx: number;
  degreeInSign: number;
  isRetrograde: boolean;
}

export interface SheetKundaliHouse {
  rashiIdx: number; // 0 = Mesham ... 11 = Meenam
  rashiTe: string;
  rashiEn: string;
  gridRow: number; // 0..3
  gridCol: number; // 0..3
  isChandraRashi: boolean;
  isLagnaRashi: boolean;
  planets: SheetPlanetGlyph[];
}

export interface LivePanchangamSheetSnapshot {
  isoDate: string;
  dayNumber: string;
  monthYearTe: string;
  monthYearEn: string;
  weekdayTe: string;
  weekdayEn: string;
  cityTe: string;
  cityEn: string;
  liveTimeLabel: string; // e.g., "09:32"
  liveTime12Hr: string; // e.g., "09:32 AM IST"
  samvatsaramShortTe: string;
  samvatsaramShortEn: string;
  ayanamTe: string;
  ayanamEn: string;
  rutuvuTe: string;
  rutuvuEn: string;
  masamTe: string;
  masamEn: string;
  pakshamTe: string;
  pakshamEn: string;
  tithiNameTe: string;
  tithiEndTe: string;
  nakshatraNameTe: string;
  nakshatraEndTe: string;
  yogamNameTe: string;
  yogamEndTe: string;
  karanamNameTe: string;
  karanamEndTe: string;
  sunriseTe: string;
  sunsetTe: string;
  abhijitTe: string;
  amruthaTe: string;
  brahmaMuhurthamTe: string;
  rahukalamTe: string;
  yamagandamTe: string;
  gulikaTe: string;
  durmuhurthamTe: string;
  varjyamTe: string;
  chandraRashiTe: string;
  chandraRashiEn: string;
  lagnaRashiTe: string;
  lagnaRashiEn: string;
  deityFooterTe: string;
  deityFooterEn: string;
  houses: SheetKundaliHouse[];
}

const DEFAULT_LAT = 17.385;
const DEFAULT_LON = 78.4867;

const TELUGU_MONTHS = [
  'జనవరి',
  'ఫిబ్రవరి',
  'మార్చి',
  'ఏప్రిల్',
  'మే',
  'జూన్',
  'జూలై',
  'ఆగస్టు',
  'సెప్టెంబర్',
  'అక్టోబర్',
  'నవంబర్',
  'డిసెంబర్',
];

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS_TE = [
  'ఆదివారం',
  'సోమవారం',
  'మంగళవారం',
  'బుధవారం',
  'గురువారం',
  'శుక్రవారం',
  'శనివారం',
];

const WEEKDAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WEEKDAY_DEITY_TE = [
  'సూర్య నారాయణ & ఆదిత్య హృదయ పారాయణం',
  'శివాభిషేకం & బిల్వార్చన',
  'సుబ్రహ్మణ్య & ఆంజనేయ స్వామి పూజ',
  'శ్రీ మహావిష్ణు & వినాయక ఆరాధన',
  'శ్రీ దత్తాత్రేయ & గురు దక్షిణామూర్తి పూజ',
  'శ్రీ మహాలక్ష్మి & లలితా సహస్రనామ పూజ',
  'శ్రీ వేంకటేశ్వర & శనీశ్వర తైలాభిషేకం',
];

const WEEKDAY_DEITY_EN = [
  'Surya Narayana & Aditya Hridayam Worship',
  'Lord Shiva Abhishekam & Bilva Archana',
  'Lord Subrahmanya & Hanuman Puja',
  'Lord Maha Vishnu & Ganapathi Worship',
  'Sri Dattatreya & Guru Dakshinamurthy Puja',
  'Goddess Mahalakshmi & Lalita Sahasranamam',
  'Sri Venkateswara & Hanuman Archana',
];

// South Indian 4x4 grid mapping for 12 Rashis (0=Mesham ... 11=Meenam)
export const SOUTH_INDIAN_HOUSES_META: Array<{
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  gridRow: number;
  gridCol: number;
}> = [
  { rashiIdx: 11, rashiTe: 'మీనం', rashiEn: 'Pisces', gridRow: 0, gridCol: 0 },
  { rashiIdx: 0, rashiTe: 'మేషం', rashiEn: 'Aries', gridRow: 0, gridCol: 1 },
  { rashiIdx: 1, rashiTe: 'వృషభం', rashiEn: 'Taurus', gridRow: 0, gridCol: 2 },
  { rashiIdx: 2, rashiTe: 'మిథునం', rashiEn: 'Gemini', gridRow: 0, gridCol: 3 },
  { rashiIdx: 10, rashiTe: 'కుంభం', rashiEn: 'Aquarius', gridRow: 1, gridCol: 0 },
  { rashiIdx: 3, rashiTe: 'కర్కాటకం', rashiEn: 'Cancer', gridRow: 1, gridCol: 3 },
  { rashiIdx: 9, rashiTe: 'మకరం', rashiEn: 'Capricorn', gridRow: 2, gridCol: 0 },
  { rashiIdx: 4, rashiTe: 'సింహం', rashiEn: 'Leo', gridRow: 2, gridCol: 3 },
  { rashiIdx: 8, rashiTe: 'ధనుస్సు', rashiEn: 'Sagittarius', gridRow: 3, gridCol: 0 },
  { rashiIdx: 7, rashiTe: 'వృశ్చికం', rashiEn: 'Scorpio', gridRow: 3, gridCol: 1 },
  { rashiIdx: 6, rashiTe: 'తుల', rashiEn: 'Libra', gridRow: 3, gridCol: 2 },
  { rashiIdx: 5, rashiTe: 'కన్య', rashiEn: 'Virgo', gridRow: 3, gridCol: 3 },
];

const RASHI_NAMES_TE = [
  'మేషం',
  'వృషభం',
  'మిథునం',
  'కర్కాటకం',
  'సింహం',
  'కన్య',
  'తుల',
  'వృశ్చికం',
  'ధనుస్సు',
  'మకరం',
  'కుంభం',
  'మీనం',
];

const RASHI_NAMES_EN = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

function formatCompactTeTime(totalMinutes: number): string {
  const norm = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = String(norm % 60).padStart(2, '0');
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  let prefix = 'ఉ.';
  if (h24 < 5) prefix = 'తె.';
  else if (h24 < 12) prefix = 'ఉ.';
  else if (h24 < 16) prefix = 'మ.';
  else if (h24 < 19) prefix = 'సా.';
  else prefix = 'రా.';
  return `${prefix} ${h12}:${m}`;
}

function formatUtcToCompactTeTime(dateUtc: Date, baseIsoDate: string): string {
  const istMs = dateUtc.getTime() + 5.5 * 3600 * 1000;
  const ist = new Date(istMs);
  const h = ist.getUTCHours();
  const m = ist.getUTCMinutes();
  const resIso = `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, '0')}-${String(ist.getUTCDate()).padStart(2, '0')}`;
  const baseStr = formatCompactTeTime(h * 60 + m);
  if (resIso !== baseIsoDate) {
    const nextDayNum = ist.getUTCDate();
    const nextMonthTe = TELUGU_MONTHS[ist.getUTCMonth()] || '';
    return `${baseStr} (${nextDayNum} ${nextMonthTe}) వరకు`;
  }
  return `${baseStr} వరకు`;
}

function findTransitionUtc(
  startUtc: Date,
  angleFn: (d: Date) => number,
  targetBoundaryDeg: number
): Date {
  let lo = startUtc.getTime();
  let hi = lo + 32 * 3600 * 1000;
  const startVal = angleFn(startUtc);

  const unwrapped = (d: Date) => {
    let v = angleFn(d);
    if (v < startVal - 180) v += 360;
    return v;
  };

  let target = targetBoundaryDeg;
  if (target <= startVal + 1e-5) target += 360;

  for (let step = 1; step <= 32; step++) {
    const probe = new Date(lo + step * 3600 * 1000);
    if (unwrapped(probe) >= target) {
      hi = probe.getTime();
      lo = hi - 3600 * 1000;
      break;
    }
  }

  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    if (unwrapped(new Date(mid)) >= target) hi = mid;
    else lo = mid;
  }

  return new Date((lo + hi) / 2);
}

function compactExistingTeluguRange(raw: string): string {
  if (!raw) return '—';
  let s = raw
    .replace(/ఉదయం\s*/g, 'ఉ. ')
    .replace(/మధ్యాహ్నం\s*/g, 'మ. ')
    .replace(/సాయంత్రం\s*/g, 'సా. ')
    .replace(/రాత్రి\s*/g, 'రా. ')
    .replace(/తెల్లవారుజామున\s*/g, 'తె. ')
    .replace(/\s*నుండి\s*/g, ' – ')
    .replace(/\s*వరకు/g, '')
    .replace(/\s*(AM|PM)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (s.includes('లేవు')) return 'ఈ రోజు లేవు';
  return s;
}

function splitNameAndEnd(raw: string, fallbackEnd: string): { name: string; end: string } {
  const clean = (raw || '').trim();
  const parenMatch = clean.match(/^([^(]+)\(([^)]+)\)/);
  if (parenMatch) {
    const name = parenMatch[1].split('-')[0].trim();
    const inside = parenMatch[2].trim();
    if (/\d/.test(inside)) {
      const rawEnd = compactExistingTeluguRange(inside);
      return {
        name,
        end: rawEnd.includes('వరకు') ? rawEnd : `${rawEnd} వరకు`,
      };
    }
    return { name, end: fallbackEnd };
  }
  const dashSplit = clean.split('-');
  const name = dashSplit[0].trim();
  if (dashSplit.length > 1 && /\d/.test(dashSplit[1])) {
    const endClean = compactExistingTeluguRange(dashSplit[1]);
    return { name, end: endClean.includes('వరకు') ? endClean : `${endClean} వరకు` };
  }
  return { name, end: fallbackEnd };
}

function isPlanetRetrograde(body: Astronomy.Body, refUtc: Date): boolean {
  const lonNow = getSiderealPlanetLongitude(body, refUtc);
  const laterUtc = new Date(refUtc.getTime() + 3600 * 1000);
  const lonLater = getSiderealPlanetLongitude(body, laterUtc);
  let diff = lonLater - lonNow;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

function detectRutuvuFromMasam(masamText: string): { te: string; en: string } {
  if (/చైత్ర|వైశాఖ|chaitra|vaisakha/i.test(masamText)) return { te: 'వసంత ఋతువు', en: 'Vasanta Rutu' };
  if (/జ్యేష్ఠ|ఆషాఢ|jyeshtha|ashadha/i.test(masamText)) return { te: 'గ్రీష్మ ఋతువు', en: 'Greeshma Rutu' };
  if (/శ్రావణ|భాద్రపద|sravana|bhadrapada/i.test(masamText)) return { te: 'వర్ష ఋతువు', en: 'Varsha Rutu' };
  if (/ఆశ్వయుజ|కార్తీక|aswayuja|karthika|kartika/i.test(masamText)) return { te: 'శరదృతువు', en: 'Sharad Rutu' };
  if (/మార్గశిర|పుష్య|margasira|margashira|pushya/i.test(masamText)) return { te: 'హేమంత ఋతువు', en: 'Hemanta Rutu' };
  return { te: 'శిశిర ఋతువు', en: 'Shishira Rutu' };
}

export function computeLivePanchangamSheet(
  day: DayData,
  options?: {
    referenceDateUtc?: Date;
    cityTe?: string;
    cityEn?: string;
    lat?: number;
    lon?: number;
  }
): LivePanchangamSheetSnapshot {
  const isoDate = day.isoDate || '2026-11-18';
  const [yStr, mStr, dStr] = isoDate.split('-');
  const year = parseInt(yStr, 10) || 2026;
  const month = parseInt(mStr, 10) || 11;
  const dayNum = parseInt(dStr, 10) || 18;
  const lat = options?.lat ?? DEFAULT_LAT;
  const lon = options?.lon ?? DEFAULT_LON;
  const cityTe = options?.cityTe || 'హైదరాబాద్';
  const cityEn = options?.cityEn || 'Hyderabad';

  // Determine exact sunrise & sunset for this date via astronomy-engine
  const observer = new Astronomy.Observer(lat, lon, 500);
  const startOfIstDayUtc = new Date(Date.UTC(year, month - 1, dayNum, 0, 0, 0) - 5.5 * 3600 * 1000);
  const riseEv = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, startOfIstDayUtc, 1);
  const setEv = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startOfIstDayUtc, 1);

  const sunriseUtc = riseEv
    ? riseEv.date
    : new Date(Date.UTC(year, month - 1, dayNum, 6, 20, 0) - 5.5 * 3600 * 1000);
  const sunsetUtc = setEv
    ? setEv.date
    : new Date(Date.UTC(year, month - 1, dayNum, 17, 45, 0) - 5.5 * 3600 * 1000);

  const srIst = new Date(sunriseUtc.getTime() + 5.5 * 3600 * 1000);
  const ssIst = new Date(sunsetUtc.getTime() + 5.5 * 3600 * 1000);
  const srMin = srIst.getUTCHours() * 60 + srIst.getUTCMinutes();
  const ssMin = ssIst.getUTCHours() * 60 + ssIst.getUTCMinutes();
  const dayDurMin = Math.max(600, ssMin - srMin);

  // Determine reference moment for Kundali chart:
  // If viewing today in IST, use live current time; otherwise use 09:30 AM IST of that date.
  const nowUtc = options?.referenceDateUtc || new Date();
  const nowIst = new Date(nowUtc.getTime() + 5.5 * 3600 * 1000);
  const nowIstIso = `${nowIst.getUTCFullYear()}-${String(nowIst.getUTCMonth() + 1).padStart(2, '0')}-${String(nowIst.getUTCDate()).padStart(2, '0')}`;
  const isToday = nowIstIso === isoDate;

  const chartUtc = isToday
    ? nowUtc
    : new Date(Date.UTC(year, month - 1, dayNum, 9, 30, 0) - 5.5 * 3600 * 1000);
  const chartIst = new Date(chartUtc.getTime() + 5.5 * 3600 * 1000);
  const chartH24 = chartIst.getUTCHours();
  const chartM = String(chartIst.getUTCMinutes()).padStart(2, '0');
  const liveTimeLabel = `${String(chartH24).padStart(2, '0')}:${chartM}`;
  const liveH12 = chartH24 % 12 === 0 ? 12 : chartH24 % 12;
  const liveAmPm = chartH24 >= 12 ? 'PM' : 'AM';
  const liveTime12Hr = `${String(liveH12).padStart(2, '0')}:${chartM} ${liveAmPm} IST`;

  // Weekday
  const dow = new Date(Date.UTC(year, month - 1, dayNum)).getUTCDay();
  const weekdayTe = WEEKDAYS_TE[dow] || 'గురువారం';
  const weekdayEn = WEEKDAYS_EN[dow] || 'Thursday';

  // Exact transition end times for Tithi, Nakshatra, Yoga, Karana
  const tithiFn = (d: Date) => norm360(getSiderealMoonLongitude(d) - getSiderealSunLongitude(d));
  const elongRise = tithiFn(sunriseUtc);
  const tithiIdx = Math.floor(elongRise / 12) % 30;
  const tithiEndUtc = findTransitionUtc(sunriseUtc, tithiFn, ((tithiIdx + 1) * 12) % 360);

  const moonRise = getSiderealMoonLongitude(sunriseUtc);
  const sunRise = getSiderealSunLongitude(sunriseUtc);
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(moonRise / nakSpan) % 27;
  const nakEndUtc = findTransitionUtc(sunriseUtc, getSiderealMoonLongitude, ((nakIdx + 1) * nakSpan) % 360);

  const yogaFn = (d: Date) => norm360(getSiderealSunLongitude(d) + getSiderealMoonLongitude(d));
  const yogaIdx = Math.floor(yogaFn(sunriseUtc) / nakSpan) % 27;
  const yogaEndUtc = findTransitionUtc(sunriseUtc, yogaFn, ((yogaIdx + 1) * nakSpan) % 360);

  const karanaIdx = Math.floor(elongRise / 6) % 60;
  const karanaEndUtc = findTransitionUtc(sunriseUtc, tithiFn, ((karanaIdx + 1) * 6) % 360);

  const tithiParsed = splitNameAndEnd(day.panchanga.tithi, formatUtcToCompactTeTime(tithiEndUtc, isoDate));
  const nakParsed = splitNameAndEnd(day.panchanga.nakshatram, formatUtcToCompactTeTime(nakEndUtc, isoDate));
  const yogaParsed = splitNameAndEnd(day.panchanga.yogam, formatUtcToCompactTeTime(yogaEndUtc, isoDate));
  const karanaParsed = splitNameAndEnd(day.panchanga.karanam, formatUtcToCompactTeTime(karanaEndUtc, isoDate));

  // Paksham, Masam, Ayanam, Rutuvu, Samvatsaram
  const isShukla = /శుక్ల|shukla|sukla|పౌర్ణమి/i.test(`${day.panchanga.masam} ${day.panchanga.tithi}`) || tithiIdx < 15;
  const pakshamTe = isShukla ? 'శుక్ల' : 'కృష్ణ';
  const pakshamEn = isShukla ? 'Shukla' : 'Krishna';

  const tithiWithPakshaTe =
    /శుక్ల|కృష్ణ|పౌర్ణమి|అమావాస్య/.test(tithiParsed.name)
      ? tithiParsed.name
      : `${pakshamTe} ${tithiParsed.name}`;

  const masamCleanTe = (day.panchanga.masam || 'కార్తీక మాసం')
    .split(',')[0]
    .replace(/మాసం/g, '')
    .trim();
  const masamTe = masamCleanTe || 'కార్తీక';
  const masamEn = day.panchanga.masam.split(',')[0].trim();

  const ayanamIsUttara = sunRise >= 270 || sunRise < 90;
  const ayanamTe = ayanamIsUttara ? 'ఉత్తరాయణం' : 'దక్షిణాయనం';
  const ayanamEn = ayanamIsUttara ? 'Uttarayanam' : 'Dakshinayanam';

  const rutuvu = detectRutuvuFromMasam(day.panchanga.masam || '');
  const samvatsaramShortTe = (day.panchanga.samvatsaram || 'శ్రీ పరాభవ నామ సంవత్సరం')
    .replace(/శ్రీ\s*/g, '')
    .replace(/\s*నామ\s*సంవత్సరం/g, '')
    .trim();
  const samvatsaramShortEn = samvatsaramShortTe;

  // Exact Shubha & Ashubha timings
  const sunriseTe = formatCompactTeTime(srMin);
  const sunsetTe = formatCompactTeTime(ssMin);
  const brahmaStart = srMin - 96;
  const brahmaEnd = srMin - 48;
  const brahmaMuhurthamTe = `${formatCompactTeTime(brahmaStart)} – ${formatCompactTeTime(brahmaEnd)}`;

  // Gulika Kalam weekday octants (Sun=6, Mon=5, Tue=4, Wed=3, Thu=2, Fri=1, Sat=0 zero-indexed of 8 parts)
  const gulikaOctantByDow: Record<number, number> = {
    0: 6,
    1: 5,
    2: 4,
    3: 3,
    4: 2,
    5: 1,
    6: 0,
  };
  const octLen = dayDurMin / 8;
  const gOct = gulikaOctantByDow[dow] ?? 2;
  const gulikaTe = `${formatCompactTeTime(srMin + gOct * octLen)} – ${formatCompactTeTime(srMin + (gOct + 1) * octLen)}`;

  const abhijitTe = compactExistingTeluguRange(day.shubha.abhijit);
  const amruthaTe = compactExistingTeluguRange(day.shubha.amrutha);
  const rahukalamTe = compactExistingTeluguRange(day.ashubha.rahukalam);
  const yamagandamTe = compactExistingTeluguRange(day.ashubha.yamagandam);
  const durmuhurthamTe = compactExistingTeluguRange(day.ashubha.durmuhurtham);
  const varjyamTe = compactExistingTeluguRange(day.ashubha.varjyam);

  // Live 12-House South Indian Kundali (Navagrahas + Live Lagna + Retrograde flags)
  const ascLon = getSiderealAscendant(chartUtc, lat, lon);
  const sunLon = getSiderealSunLongitude(chartUtc);
  const moonLon = getSiderealMoonLongitude(chartUtc);
  const marsLon = getSiderealPlanetLongitude(Astronomy.Body.Mars, chartUtc);
  const mercLon = getSiderealPlanetLongitude(Astronomy.Body.Mercury, chartUtc);
  const jupLon = getSiderealPlanetLongitude(Astronomy.Body.Jupiter, chartUtc);
  const venLon = getSiderealPlanetLongitude(Astronomy.Body.Venus, chartUtc);
  const satLon = getSiderealPlanetLongitude(Astronomy.Body.Saturn, chartUtc);
  const { rahu: rahuLon, ketu: ketuLon } = getSiderealRahuKetu(chartUtc);
  // Ensure Lahiri ayanamsa helper stays referenced
  void getLahiriAyanamsa(chartUtc);

  const planetEntries: SheetPlanetGlyph[] = [
    {
      id: 'lagna',
      shortTe: 'ల',
      shortEn: 'Asc',
      fullTe: 'లగ్నం',
      fullEn: 'Lagna (Ascendant)',
      color: '#B91C1C',
      rashiIdx: Math.floor(ascLon / 30) % 12,
      degreeInSign: ascLon % 30,
      isRetrograde: false,
    },
    {
      id: 'sun',
      shortTe: 'సూ',
      shortEn: 'Su',
      fullTe: 'సూర్యుడు',
      fullEn: 'Sun',
      color: '#B45309',
      rashiIdx: Math.floor(sunLon / 30) % 12,
      degreeInSign: sunLon % 30,
      isRetrograde: false,
    },
    {
      id: 'moon',
      shortTe: 'చం',
      shortEn: 'Mo',
      fullTe: 'చంద్రుడు',
      fullEn: 'Moon',
      color: '#1D4ED8',
      rashiIdx: Math.floor(moonLon / 30) % 12,
      degreeInSign: moonLon % 30,
      isRetrograde: false,
    },
    {
      id: 'mars',
      shortTe: 'కు',
      shortEn: 'Ma',
      fullTe: 'కుజుడు',
      fullEn: 'Mars',
      color: '#DC2626',
      rashiIdx: Math.floor(marsLon / 30) % 12,
      degreeInSign: marsLon % 30,
      isRetrograde: isPlanetRetrograde(Astronomy.Body.Mars, chartUtc),
    },
    {
      id: 'mercury',
      shortTe: 'బు',
      shortEn: 'Me',
      fullTe: 'బుధుడు',
      fullEn: 'Mercury',
      color: '#047857',
      rashiIdx: Math.floor(mercLon / 30) % 12,
      degreeInSign: mercLon % 30,
      isRetrograde: isPlanetRetrograde(Astronomy.Body.Mercury, chartUtc),
    },
    {
      id: 'jupiter',
      shortTe: 'గు',
      shortEn: 'Ju',
      fullTe: 'గురుడు',
      fullEn: 'Jupiter',
      color: '#A16207',
      rashiIdx: Math.floor(jupLon / 30) % 12,
      degreeInSign: jupLon % 30,
      isRetrograde: isPlanetRetrograde(Astronomy.Body.Jupiter, chartUtc),
    },
    {
      id: 'venus',
      shortTe: 'శు',
      shortEn: 'Ve',
      fullTe: 'శుక్రుడు',
      fullEn: 'Venus',
      color: '#9D174D',
      rashiIdx: Math.floor(venLon / 30) % 12,
      degreeInSign: venLon % 30,
      isRetrograde: isPlanetRetrograde(Astronomy.Body.Venus, chartUtc),
    },
    {
      id: 'saturn',
      shortTe: 'శ',
      shortEn: 'Sa',
      fullTe: 'శని',
      fullEn: 'Saturn',
      color: '#1E3A8A',
      rashiIdx: Math.floor(satLon / 30) % 12,
      degreeInSign: satLon % 30,
      isRetrograde: isPlanetRetrograde(Astronomy.Body.Saturn, chartUtc),
    },
    {
      id: 'rahu',
      shortTe: 'రా',
      shortEn: 'Ra',
      fullTe: 'రాహువు',
      fullEn: 'Rahu',
      color: '#4338CA',
      rashiIdx: Math.floor(rahuLon / 30) % 12,
      degreeInSign: rahuLon % 30,
      isRetrograde: false,
    },
    {
      id: 'ketu',
      shortTe: 'కే',
      shortEn: 'Ke',
      fullTe: 'కేతువు',
      fullEn: 'Ketu',
      color: '#57534E',
      rashiIdx: Math.floor(ketuLon / 30) % 12,
      degreeInSign: ketuLon % 30,
      isRetrograde: false,
    },
  ];

  const chandraRashiIdx = Math.floor(moonLon / 30) % 12;
  const lagnaRashiIdx = Math.floor(ascLon / 30) % 12;
  const chandraRashiTe = RASHI_NAMES_TE[chandraRashiIdx] || 'కుంభం';
  const chandraRashiEn = RASHI_NAMES_EN[chandraRashiIdx] || 'Aquarius';
  const lagnaRashiTe = RASHI_NAMES_TE[lagnaRashiIdx] || 'ధనుస్సు';
  const lagnaRashiEn = RASHI_NAMES_EN[lagnaRashiIdx] || 'Sagittarius';

  const houses: SheetKundaliHouse[] = SOUTH_INDIAN_HOUSES_META.map((meta) => ({
    ...meta,
    isChandraRashi: meta.rashiIdx === chandraRashiIdx,
    isLagnaRashi: meta.rashiIdx === lagnaRashiIdx,
    planets: planetEntries.filter((p) => p.rashiIdx === meta.rashiIdx),
  }));

  const monthTe = TELUGU_MONTHS[month - 1] || 'నవంబర్';
  const monthEn = ENGLISH_MONTHS[month - 1] || 'November';

  return {
    isoDate,
    dayNumber: String(dayNum),
    monthYearTe: `${monthTe} ${year}`,
    monthYearEn: `${monthEn} ${year}`,
    weekdayTe,
    weekdayEn,
    cityTe,
    cityEn,
    liveTimeLabel,
    liveTime12Hr,
    samvatsaramShortTe,
    samvatsaramShortEn,
    ayanamTe,
    ayanamEn,
    rutuvuTe: rutuvu.te,
    rutuvuEn: rutuvu.en,
    masamTe,
    masamEn,
    pakshamTe,
    pakshamEn,
    tithiNameTe: tithiWithPakshaTe,
    tithiEndTe: tithiParsed.end,
    nakshatraNameTe: nakParsed.name,
    nakshatraEndTe: nakParsed.end,
    yogamNameTe: yogaParsed.name,
    yogamEndTe: yogaParsed.end,
    karanamNameTe: karanaParsed.name,
    karanamEndTe: karanaParsed.end,
    sunriseTe,
    sunsetTe,
    abhijitTe,
    amruthaTe,
    brahmaMuhurthamTe,
    rahukalamTe,
    yamagandamTe,
    gulikaTe,
    durmuhurthamTe,
    varjyamTe,
    chandraRashiTe,
    chandraRashiEn,
    lagnaRashiTe,
    lagnaRashiEn,
    deityFooterTe: `${weekdayTe} — ${WEEKDAY_DEITY_TE[dow]} · చంద్రుడు ${chandraRashiTe} రాశిలో`,
    deityFooterEn: `${weekdayEn} — ${WEEKDAY_DEITY_EN[dow]} · Moon in ${chandraRashiEn}`,
    houses,
  };
}
