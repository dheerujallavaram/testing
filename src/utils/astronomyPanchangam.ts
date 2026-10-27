import * as Astronomy from 'astronomy-engine';
import { DayData } from '../types/panchangam';
import { CompactPanchangamRow, convertCompactRowToDayData } from './panchangaConverter';

// Standard Telugu region reference coordinates (Hyderabad / Vijayawada central meridian, IST +5:30)
const DEFAULT_LAT = 17.385;
const DEFAULT_LON = 78.4867;

// 60 Telugu Ugadi Samvatsaram Names (starting from Prabhava = index 0)
const SAMVATSARAM_60_EN = [
  'Prabhava', 'Vibhava', 'Sukla', 'Pramodoota', 'Prajothpatti',
  'Angirasa', 'Sreemukha', 'Bhava', 'Yuva', 'Dhata',
  'Eswara', 'Bahudhanya', 'Pramadi', 'Vikrama', 'Vrisha',
  'Chitrabhanu', 'Swabhanu', 'Tarana', 'Parthiva', 'Vyaya',
  'Sarvajit', 'Sarvadhari', 'Virodhi', 'Vikruti', 'Khara',
  'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
  'Hevilambi', 'Vilambi', 'Vikari', 'Sarvari', 'Plava',
  'Subhakrutu', 'Sobhakrutu', 'Krodhi', 'Viswavasu', 'Parabhava',
  'Plavanga', 'Keelaka', 'Soumya', 'Sadharana', 'Virodhikrutu',
  'Paridhavi', 'Pramadicha', 'Ananda', 'Rakshasa', 'Nala',
  'Pingala', 'Kalayukti', 'Siddharthi', 'Roudri', 'Durmathi',
  'Dundubhi', 'Rudhirodgari', 'Raktakshi', 'Krodhana', 'Akshaya',
];

export const SAMVATSARAM_60_TE: Record<string, string> = {
  Prabhava: 'శ్రీ ప్రభవ నామ సంవత్సరం',
  Vibhava: 'శ్రీ విభవ నామ సంవత్సరం',
  Sukla: 'శ్రీ శుక్ల నామ సంవత్సరం',
  Pramodoota: 'శ్రీ ప్రమోదూత నామ సంవత్సరం',
  Prajothpatti: 'శ్రీ ప్రజోత్పత్తి నామ సంవత్సరం',
  Angirasa: 'శ్రీ అంగీరస నామ సంవత్సరం',
  Sreemukha: 'శ్రీ శ్రీముఖ నామ సంవత్సరం',
  Bhava: 'శ్రీ భావ నామ సంవత్సరం',
  Yuva: 'శ్రీ యువ నామ సంవత్సరం',
  Dhata: 'శ్రీ ధాత నామ సంవత్సరం',
  Eswara: 'శ్రీ ఈశ్వర నామ సంవత్సరం',
  Bahudhanya: 'శ్రీ బహుధాన్య నామ సంవత్సరం',
  Pramadi: 'శ్రీ ప్రమాది నామ సంవత్సరం',
  Vikrama: 'శ్రీ విక్రమ నామ సంవత్సరం',
  Vrisha: 'శ్రీ వృష నామ సంవత్సరం',
  Chitrabhanu: 'శ్రీ చిత్రభాను నామ సంవత్సరం',
  Swabhanu: 'శ్రీ స్వభాను నామ సంవత్సరం',
  Tarana: 'శ్రీ తారణ నామ సంవత్సరం',
  Parthiva: 'శ్రీ పార్థివ నామ సంవత్సరం',
  Vyaya: 'శ్రీ వ్యయ నామ సంవత్సరం',
  Sarvajit: 'శ్రీ సర్వజిత్ నామ సంవత్సరం',
  Sarvadhari: 'శ్రీ సర్వధారి నామ సంవత్సరం',
  Virodhi: 'శ్రీ విరోధి నామ సంవత్సరం',
  Vikruti: 'శ్రీ వికృతి నామ సంవత్సరం',
  Khara: 'శ్రీ ఖర నామ సంవత్సరం',
  Nandana: 'శ్రీ నందన నామ సంవత్సరం',
  Vijaya: 'శ్రీ విజయ నామ సంవత్సరం',
  Jaya: 'శ్రీ జయ నామ సంవత్సరం',
  Manmatha: 'శ్రీ మన్మథ నామ సంవత్సరం',
  Durmukhi: 'శ్రీ దుర్ముఖి నామ సంవత్సరం',
  Hevilambi: 'శ్రీ హేవిళంబి నామ సంవత్సరం',
  Vilambi: 'శ్రీ విళంబి నామ సంవత్సరం',
  Vikari: 'శ్రీ వికారి నామ సంవత్సరం',
  Sarvari: 'శ్రీ శార్వరి నామ సంవత్సరం',
  Plava: 'శ్రీ ప్లవ నామ సంవత్సరం',
  Subhakrutu: 'శ్రీ శుభకృతు నామ సంవత్సరం',
  Sobhakrutu: 'శ్రీ శోభకృతు నామ సంవత్సరం',
  Krodhi: 'శ్రీ క్రోధి నామ సంవత్సరం',
  Viswavasu: 'శ్రీ విశ్వావసు నామ సంవత్సరం',
  Parabhava: 'శ్రీ పరాభవ నామ సంవత్సరం',
  Plavanga: 'శ్రీ ప్లవంగ నామ సంవత్సరం',
  Keelaka: 'శ్రీ కీలక నామ సంవత్సరం',
  Soumya: 'శ్రీ సౌమ్య నామ సంవత్సరం',
  Sadharana: 'శ్రీ సాధారణ నామ సంవత్సరం',
  Virodhikrutu: 'శ్రీ విరోధికృతు నామ సంవత్సరం',
  Paridhavi: 'శ్రీ పరిధావి నామ సంవత్సరం',
  Pramadicha: 'శ్రీ ప్రమాదీచ నామ సంవత్సరం',
  Ananda: 'శ్రీ ఆనంద నామ సంవత్సరం',
  Rakshasa: 'శ్రీ రాక్షస నామ సంవత్సరం',
  Nala: 'శ్రీ నళ నామ సంవత్సరం',
  Pingala: 'శ్రీ పింగళ నామ సంవత్సరం',
  Kalayukti: 'శ్రీ కాళయుక్తి నామ సంవత్సరం',
  Siddharthi: 'శ్రీ సిద్ధార్థి నామ సంవత్సరం',
  Roudri: 'శ్రీ రౌద్రి నామ సంవత్సరం',
  Durmathi: 'శ్రీ దుర్మతి నామ సంవత్సరం',
  Dundubhi: 'శ్రీ దుందుభి నామ సంవత్సరం',
  Rudhirodgari: 'శ్రీ రుధిరోద్గారి నామ సంవత్సరం',
  Raktakshi: 'శ్రీ రక్తాక్షి నామ సంవత్సరం',
  Krodhana: 'శ్రీ క్రోధన నామ సంవత్సరం',
  Akshaya: 'శ్రీ అక్షయ నామ సంవత్సరం',
};

const TITHI_15_NAMES = [
  'Pratipat', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Sapthami', 'Ashtami', 'Navami', 'Dasami',
  'Ekadasi', 'Dwadasi', 'Trayodasi', 'Chaturdasi',
];

const NAKSHATRA_CODES = [
  'Aswi', 'Bhar', 'Krit', 'Rohi', 'Mrig', 'Ardr', 'Puna', 'Push', 'Asre',
  'Magh', 'PPha', 'UPha', 'Hast', 'Chit', 'Swat', 'Visa', 'Anu', 'Jye',
  'Mool', 'PSha', 'USha', 'Srav', 'Dhan', 'Sata', 'PBha', 'UBha', 'Reva',
];

const YOGA_27_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Soubhagya', 'Sobhana', 'Atiganda',
  'Sukarman', 'Dhriti', 'Soola', 'Ganda', 'Vriddhi', 'Dhruva',
  'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Siva', 'Siddha', 'Sadhya', 'Subha', 'Sukla',
  'Brahma', 'Indra', 'Vaidhriti',
];

const MOVABLE_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitula', 'Garija', 'Vanija', 'Vishti'];

const AMANTA_MONTH_NAMES = [
  'Chaitra', 'Vaisakha', 'Jyeshtha', 'Ashadha', 'Sravana', 'Bhadrapada',
  'Aswayuja', 'Karthika', 'Margasira', 'Pushya', 'Magha', 'Phalguna',
];

const LAGNA_CODES = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function getLahiriAyanamsa(date: Date): number {
  const j2000Ms = Date.UTC(2000, 0, 1, 12, 0, 0);
  const julianYears = (date.getTime() - j2000Ms) / (365.25 * 86400 * 1000);
  return 23.857092 + julianYears * 0.0139697128;
}

export function getSiderealSunLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const sunEcl = Astronomy.SunPosition(time);
  const ayanamsa = getLahiriAyanamsa(date);
  return norm360(sunEcl.elon - ayanamsa);
}

export function getSiderealMoonLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const moonSph = Astronomy.EclipticGeoMoon(time);
  const ayanamsa = getLahiriAyanamsa(date);
  return norm360(moonSph.lon - ayanamsa);
}

export function getSiderealPlanetLongitude(body: Astronomy.Body, date: Date): number {
  const time = Astronomy.MakeTime(date);
  const vec = Astronomy.GeoVector(body, time, true);
  const ecl = Astronomy.Ecliptic(vec);
  const ayanamsa = getLahiriAyanamsa(date);
  return norm360(ecl.elon - ayanamsa);
}

export function getSiderealRahuKetu(date: Date): { rahu: number; ketu: number } {
  const j2000Ms = Date.UTC(2000, 0, 1, 12, 0, 0);
  const d = (date.getTime() - j2000Ms) / (86400 * 1000);
  const T = d / 36525;
  const rahuTropical = 125.04455501 - 1934.1361849 * T + 0.0020762 * T * T;
  const ayanamsa = getLahiriAyanamsa(date);
  const rahu = norm360(rahuTropical - ayanamsa);
  const ketu = norm360(rahu + 180);
  return { rahu, ketu };
}

export function getSiderealAscendant(date: Date, lat = DEFAULT_LAT, lon = DEFAULT_LON): number {
  const time = Astronomy.MakeTime(date);
  const gastHours = Astronomy.SiderealTime(time);
  const ramcDeg = norm360(gastHours * 15 + lon);
  const ramcRad = (ramcDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const epsRad = (23.4392911 * Math.PI) / 180;

  const y = Math.cos(ramcRad);
  const x = -(Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(ramcRad));
  const ascTropical = norm360((Math.atan2(y, x) * 180) / Math.PI);
  const ayanamsa = getLahiriAyanamsa(date);
  return norm360(ascTropical - ayanamsa);
}

function formatDateToIST24(date: Date): string {
  const istMs = date.getTime() + 5.5 * 3600 * 1000;
  const ist = new Date(istMs);
  const h = ist.getUTCHours();
  const m = String(ist.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function minutesToHHMM(totalMin: number): string {
  const norm = ((Math.round(totalMin) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = String(norm % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function findTransitionTime(
  startUtc: Date,
  angleFn: (d: Date) => number,
  targetBoundaryDeg: number
): string {
  let lo = startUtc.getTime();
  let hi = lo + 30 * 3600 * 1000;

  const startVal = angleFn(startUtc);
  const unwrapped = (d: Date) => {
    let v = angleFn(d);
    if (v < startVal - 180) v += 360;
    return v;
  };

  let target = targetBoundaryDeg;
  if (target <= startVal + 1e-5) target += 360;

  for (let step = 1; step <= 30; step++) {
    const probe = new Date(lo + step * 3600 * 1000);
    if (unwrapped(probe) >= target) {
      hi = probe.getTime();
      lo = hi - 3600 * 1000;
      break;
    }
  }

  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    if (unwrapped(new Date(mid)) >= target) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return formatDateToIST24(new Date((lo + hi) / 2));
}

function getAmantaMonthAndYear(sunriseUtc: Date): {
  lunarMonth: string;
  samvatsaramEn: string;
  ritu: string;
  ayana: string;
} {
  const sunLon = getSiderealSunLongitude(sunriseUtc);
  const moonLon = getSiderealMoonLongitude(sunriseUtc);
  const elongation = norm360(moonLon - sunLon);

  const daysSinceNewMoon = elongation / 12.190749;
  const newMoonUtc = new Date(sunriseUtc.getTime() - daysSinceNewMoon * 86400 * 1000);
  const sunAtNewMoon = getSiderealSunLongitude(newMoonUtc);

  const solarSignAtNewMoon = Math.floor(sunAtNewMoon / 30) % 12;
  const amantaMonthIndex = (solarSignAtNewMoon + 1) % 12;
  const lunarMonth = AMANTA_MONTH_NAMES[amantaMonthIndex];

  const rituByMonth: Record<string, string> = {
    Chaitra: 'Vasanta',
    Vaisakha: 'Vasanta',
    Jyeshtha: 'Greeshma',
    Ashadha: 'Greeshma',
    Sravana: 'Varsha',
    Bhadrapada: 'Varsha',
    Aswayuja: 'Sharad',
    Karthika: 'Sharad',
    Margasira: 'Hemanta',
    Pushya: 'Hemanta',
    Magha: 'Shishira',
    Phalguna: 'Shishira',
  };
  const ritu = rituByMonth[lunarMonth] || 'Vasanta';
  const ayana = sunLon >= 270 || sunLon < 90 ? 'Uttarayana' : 'Dakshinayana';

  const istDate = new Date(sunriseUtc.getTime() + 5.5 * 3600 * 1000);
  const gregYear = istDate.getUTCFullYear();
  const gregMonth = istDate.getUTCMonth() + 1;

  const isBeforeUgadi =
    gregMonth <= 2 ||
    (gregMonth <= 4 && (lunarMonth === 'Magha' || lunarMonth === 'Phalguna' || lunarMonth === 'Pushya'));

  const effectiveSakaYear = isBeforeUgadi ? gregYear - 1 : gregYear;
  const samvatsaramIdx = (((effectiveSakaYear - 1987) % 60) + 60) % 60;
  const samvatsaramEn = SAMVATSARAM_60_EN[samvatsaramIdx];

  return { lunarMonth, samvatsaramEn, ritu, ayana };
}

export function generateCompactRowFromAstronomy(isoDate: string): CompactPanchangamRow {
  const [yStr, mStr, dStr] = isoDate.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);

  const observer = new Astronomy.Observer(DEFAULT_LAT, DEFAULT_LON, 500);
  const searchStartUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - 5.5 * 3600 * 1000);
  const riseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, searchStartUtc, 1);
  const setEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, searchStartUtc, 1);

  const sunriseUtc = riseEvent
    ? riseEvent.date
    : new Date(Date.UTC(year, month - 1, day, 6, 15, 0) - 5.5 * 3600 * 1000);
  const sunsetUtc = setEvent
    ? setEvent.date
    : new Date(Date.UTC(year, month - 1, day, 18, 0, 0) - 5.5 * 3600 * 1000);

  const sunriseStr = formatDateToIST24(sunriseUtc);
  const sunsetStr = formatDateToIST24(sunsetUtc);

  const tithiAngleFn = (d: Date) => norm360(getSiderealMoonLongitude(d) - getSiderealSunLongitude(d));
  const elongAtRise = tithiAngleFn(sunriseUtc);
  const tithiIndex0to29 = Math.floor(elongAtRise / 12) % 30;
  const paksha = tithiIndex0to29 < 15 ? 'Sukla' : 'Krishna';
  const tithi =
    tithiIndex0to29 === 14
      ? 'Pournimasya'
      : tithiIndex0to29 === 29
      ? 'Amavasya'
      : TITHI_15_NAMES[tithiIndex0to29 % 15];

  const nextTithiBoundaryDeg = ((tithiIndex0to29 + 1) * 12) % 360;
  const tithiEndTime = findTransitionTime(sunriseUtc, tithiAngleFn, nextTithiBoundaryDeg);

  const moonAtRise = getSiderealMoonLongitude(sunriseUtc);
  const nakSpan = 360 / 27;
  const nakIndex0to26 = Math.floor(moonAtRise / nakSpan) % 27;
  const nakCode = NAKSHATRA_CODES[nakIndex0to26];
  const nextNakBoundaryDeg = ((nakIndex0to26 + 1) * nakSpan) % 360;
  const nakEndTime = findTransitionTime(sunriseUtc, getSiderealMoonLongitude, nextNakBoundaryDeg);

  const sunAtRise = getSiderealSunLongitude(sunriseUtc);
  const yogaSum = norm360(sunAtRise + moonAtRise);
  const yogaIndex = Math.floor(yogaSum / nakSpan) % 27;
  const yoga = YOGA_27_NAMES[yogaIndex];

  const karanaIndex0to59 = Math.floor(elongAtRise / 6) % 60;
  let karana = 'Bava';
  if (karanaIndex0to59 === 0) karana = 'Kimstughna';
  else if (karanaIndex0to59 === 57) karana = 'Sakuna';
  else if (karanaIndex0to59 === 58) karana = 'Chatushpada';
  else if (karanaIndex0to59 === 59) karana = 'Naga';
  else karana = MOVABLE_KARANAS[(karanaIndex0to59 - 1) % 7];

  const [srH, srM] = sunriseStr.split(':').map(Number);
  const [ssH, ssM] = sunsetStr.split(':').map(Number);
  const srMin = srH * 60 + srM;
  const ssMin = ssH * 60 + ssM;
  const dayDurationMin = ssMin - srMin;

  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const rahuOctantByDow: Record<number, number> = {
    0: 7,
    1: 1,
    2: 6,
    3: 4,
    4: 5,
    5: 3,
    6: 2,
  };
  const oct = rahuOctantByDow[dow] ?? 7;
  const octLen = dayDurationMin / 8;
  const rahuStart = srMin + oct * octLen;
  const rahuEnd = rahuStart + octLen;
  const rahuKala = `${minutesToHHMM(rahuStart)} - ${minutesToHHMM(rahuEnd)}`;

  const muhLen = dayDurationMin / 15;
  let durMuhurtam = '';
  if (dow === 0) {
    durMuhurtam = `${minutesToHHMM(srMin + 13 * muhLen)}-${minutesToHHMM(srMin + 14 * muhLen)}`;
  } else if (dow === 1) {
    durMuhurtam = `${minutesToHHMM(srMin + 8 * muhLen)}-${minutesToHHMM(srMin + 9 * muhLen)},${minutesToHHMM(srMin + 11 * muhLen)}-${minutesToHHMM(srMin + 12 * muhLen)}`;
  } else if (dow === 2) {
    durMuhurtam = `${minutesToHHMM(srMin + 3 * muhLen)}-${minutesToHHMM(srMin + 4 * muhLen)}`;
  } else if (dow === 3) {
    durMuhurtam = `${minutesToHHMM(srMin + 7 * muhLen)}-${minutesToHHMM(srMin + 8 * muhLen)}`;
  } else if (dow === 4) {
    durMuhurtam = `${minutesToHHMM(srMin + 5 * muhLen)}-${minutesToHHMM(srMin + 6 * muhLen)},${minutesToHHMM(srMin + 11 * muhLen)}-${minutesToHHMM(srMin + 12 * muhLen)}`;
  } else if (dow === 5) {
    durMuhurtam = `${minutesToHHMM(srMin + 3 * muhLen)}-${minutesToHHMM(srMin + 4 * muhLen)},${minutesToHHMM(srMin + 8 * muhLen)}-${minutesToHHMM(srMin + 9 * muhLen)}`;
  } else {
    durMuhurtam = `${minutesToHHMM(srMin)}-${minutesToHHMM(srMin + 2 * muhLen)}`;
  }

  const varjyamStartGhati = [
    50, 24, 30, 40, 14, 21, 30, 20, 32,
    30, 20, 18, 21, 20, 14, 14, 10, 14,
    20, 24, 20, 10, 10, 18, 16, 24, 30,
  ][nakIndex0to26] || 20;
  const degIntoNak = moonAtRise - nakIndex0to26 * nakSpan;
  const varjyamStartDeg = (varjyamStartGhati / 60) * nakSpan;
  const degToVarjyam = varjyamStartDeg - degIntoNak;
  const hoursToVarjyam = (degToVarjyam / nakSpan) * 24.3;
  const varjyamStartMin = srMin + (hoursToVarjyam >= 0 ? hoursToVarjyam * 60 : (hoursToVarjyam + 24) * 60);
  const varjyamEndMin = varjyamStartMin + 96;
  const varjyam = `${minutesToHHMM(varjyamStartMin)}-${minutesToHHMM(varjyamEndMin)}`;

  const ascAtRise = getSiderealAscendant(sunriseUtc);
  const startLagnaIdx = Math.floor(ascAtRise / 30) % 12;
  const degRemainingInFirstLagna = 30 - (ascAtRise % 30);
  const firstLagnaMinutes = Math.max(15, Math.round((degRemainingInFirstLagna / 30) * 120));
  const lagnaEntries: string[] = [];
  const cursorMin = srMin + firstLagnaMinutes;
  for (let i = 0; i < 12; i++) {
    const lCode = LAGNA_CODES[(startLagnaIdx + i) % 12];
    const endMin = i === 0 ? cursorMin : srMin + firstLagnaMinutes + i * 119;
    lagnaEntries.push(`${lCode}:${minutesToHHMM(endMin)}`);
  }
  const lagnasStr = lagnaEntries.join(',');

  const houseBuckets: Record<number, string[]> = {};
  const addPlanet = (lon: number, code: string) => {
    const h = (Math.floor(norm360(lon) / 30) % 12) + 1;
    if (!houseBuckets[h]) houseBuckets[h] = [];
    houseBuckets[h].push(code);
  };

  addPlanet(sunAtRise, 'Sun');
  addPlanet(moonAtRise, 'Moon');
  addPlanet(getSiderealPlanetLongitude(Astronomy.Body.Mars, sunriseUtc), 'Mars');
  addPlanet(getSiderealPlanetLongitude(Astronomy.Body.Mercury, sunriseUtc), 'Merc');
  addPlanet(getSiderealPlanetLongitude(Astronomy.Body.Jupiter, sunriseUtc), 'Jup');
  addPlanet(getSiderealPlanetLongitude(Astronomy.Body.Venus, sunriseUtc), 'Ven');
  addPlanet(getSiderealPlanetLongitude(Astronomy.Body.Saturn, sunriseUtc), 'Sat');
  const nodes = getSiderealRahuKetu(sunriseUtc);
  addPlanet(nodes.rahu, 'Rah');
  addPlanet(nodes.ketu, 'Ket');

  const planetsStr = Object.keys(houseBuckets)
    .map(Number)
    .sort((a, b) => a - b)
    .map((h) => `${h}:${houseBuckets[h].join('|')}`)
    .join(';');

  const { lunarMonth, samvatsaramEn, ritu, ayana } = getAmantaMonthAndYear(sunriseUtc);

  return [
    isoDate,
    samvatsaramEn,
    ayana,
    ritu,
    lunarMonth,
    paksha,
    tithi,
    tithiEndTime,
    nakCode,
    nakEndTime,
    yoga,
    karana,
    sunriseStr,
    sunsetStr,
    rahuKala,
    varjyam,
    durMuhurtam,
    lagnasStr,
    planetsStr,
  ];
}

const computedDayCache = new Map<string, DayData>();

export function getOrGenerateDayData(isoDate: string, existingDays: DayData[]): DayData {
  const found = existingDays.find((d) => d.id === isoDate || d.isoDate === isoDate);
  if (found) return found;

  const cached = computedDayCache.get(isoDate);
  if (cached) return cached;

  try {
    const compactRow = generateCompactRowFromAstronomy(isoDate);
    const dayData = convertCompactRowToDayData(compactRow);
    const samvatsaramTe = SAMVATSARAM_60_TE[compactRow[1]];
    if (samvatsaramTe) {
      dayData.panchanga.samvatsaram = samvatsaramTe;
    }
    computedDayCache.set(isoDate, dayData);
    return dayData;
  } catch {
    return existingDays[0];
  }
}

export interface KundaliPlanetDetail {
  id: string;
  nameTe: string;
  nameEn: string;
  longitude: number;
  rashiIdx: number;
  rashiTe: string;
  rashiEn: string;
  degreeFormatted: string;
  nakshatraIdx: number;
  nakshatraTe: string;
  nakshatraEn: string;
  pada: number;
  navamshaRashiIdx: number;
  navamshaRashiTe: string;
  isRetrograde?: boolean;
}

const RASHI_LIST_META = [
  { id: 'mesham', te: 'మేషం', en: 'Aries', lord: 'కుజుడు (Mars)' },
  { id: 'vrushabham', te: 'వృషభం', en: 'Taurus', lord: 'శుక్రుడు (Venus)' },
  { id: 'mithunam', te: 'మిథునం', en: 'Gemini', lord: 'బుధుడు (Mercury)' },
  { id: 'karkatakam', te: 'కర్కాటకం', en: 'Cancer', lord: 'చంద్రుడు (Moon)' },
  { id: 'simham', te: 'సింహం', en: 'Leo', lord: 'సూర్యుడు (Sun)' },
  { id: 'kanya', te: 'కన్య', en: 'Virgo', lord: 'బుధుడు (Mercury)' },
  { id: 'tula', te: 'తుల', en: 'Libra', lord: 'శుక్రుడు (Venus)' },
  { id: 'vruschikam', te: 'వృశ్చికం', en: 'Scorpio', lord: 'కుజుడు (Mars)' },
  { id: 'dhanussu', te: 'ధనుస్సు', en: 'Sagittarius', lord: 'గురుడు (Jupiter)' },
  { id: 'makaram', te: 'మకరం', en: 'Capricorn', lord: 'శని (Saturn)' },
  { id: 'kumbham', te: 'కుంభం', en: 'Aquarius', lord: 'శని (Saturn)' },
  { id: 'meenam', te: 'మీనం', en: 'Pisces', lord: 'గురుడు (Jupiter)' },
];

const NAKSHATRA_LIST_META = [
  { te: 'అశ్విని', en: 'Ashwini', lordTe: 'కేతువు' },
  { te: 'భరణి', en: 'Bharani', lordTe: 'శుక్రుడు' },
  { te: 'కృత్తిక', en: 'Krittika', lordTe: 'సూర్యుడు' },
  { te: 'రోహిణి', en: 'Rohini', lordTe: 'చంద్రుడు' },
  { te: 'మృగశిర', en: 'Mrigashira', lordTe: 'కుజుడు' },
  { te: 'ఆరుద్ర', en: 'Ardra', lordTe: 'రాహువు' },
  { te: 'పునర్వసు', en: 'Punarvasu', lordTe: 'గురుడు' },
  { te: 'పుష్యమి', en: 'Pushyami', lordTe: 'శని' },
  { te: 'ఆశ్లేష', en: 'Ashlesha', lordTe: 'బుధుడు' },
  { te: 'మఖ', en: 'Magha', lordTe: 'కేతువు' },
  { te: 'పుబ్బ', en: 'Pubba', lordTe: 'శుక్రుడు' },
  { te: 'ఉత్తర', en: 'Uttara', lordTe: 'సూర్యుడు' },
  { te: 'హస్త', en: 'Hasta', lordTe: 'చంద్రుడు' },
  { te: 'చిత్త', en: 'Chitta', lordTe: 'కుజుడు' },
  { te: 'స్వాతి', en: 'Swati', lordTe: 'రాహువు' },
  { te: 'విశాఖ', en: 'Vishakha', lordTe: 'గురుడు' },
  { te: 'అనురాధ', en: 'Anuradha', lordTe: 'శని' },
  { te: 'జ్యేష్ఠ', en: 'Jyeshtha', lordTe: 'బుధుడు' },
  { te: 'మూల', en: 'Moola', lordTe: 'కేతువు' },
  { te: 'పూర్వాషాఢ', en: 'Purvashadha', lordTe: 'శుక్రుడు' },
  { te: 'ఉత్తరాషాఢ', en: 'Uttarashadha', lordTe: 'సూర్యుడు' },
  { te: 'శ్రవణం', en: 'Shravanam', lordTe: 'చంద్రుడు' },
  { te: 'ధనిష్ఠ', en: 'Dhanishtha', lordTe: 'కుజుడు' },
  { te: 'శతభిషం', en: 'Shatabhisham', lordTe: 'రాహువు' },
  { te: 'పూర్వాభాద్ర', en: 'Purvabhadra', lordTe: 'గురుడు' },
  { te: 'ఉత్తరాభాద్ర', en: 'Uttarabhadra', lordTe: 'శని' },
  { te: 'రేవతి', en: 'Revati', lordTe: 'బుధుడు' },
];

function formatDegMinSec(lonInSign: number): string {
  const deg = Math.floor(lonInSign);
  const minFloat = (lonInSign - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  return `${String(deg).padStart(2, '0')}° ${String(min).padStart(2, '0')}' ${String(sec === 60 ? 59 : sec).padStart(2, '0')}"`;
}

function buildPlanetDetail(
  id: string,
  nameTe: string,
  nameEn: string,
  longitude: number,
  isRetrograde = false
): KundaliPlanetDetail {
  const normLon = norm360(longitude);
  const rashiIdx = Math.floor(normLon / 30) % 12;
  const lonInSign = normLon - rashiIdx * 30;
  const nakSpan = 360 / 27;
  const padaSpan = nakSpan / 4;

  const nakshatraIdx = Math.floor(normLon / nakSpan) % 27;
  const degInNak = normLon - nakshatraIdx * nakSpan;
  const pada = Math.min(4, Math.floor(degInNak / padaSpan) + 1);

  const totalPadaIndex = Math.floor(normLon / padaSpan);
  const navamshaRashiIdx = totalPadaIndex % 12;

  return {
    id,
    nameTe,
    nameEn,
    longitude: normLon,
    rashiIdx,
    rashiTe: RASHI_LIST_META[rashiIdx].te,
    rashiEn: RASHI_LIST_META[rashiIdx].en,
    degreeFormatted: formatDegMinSec(lonInSign),
    nakshatraIdx,
    nakshatraTe: NAKSHATRA_LIST_META[nakshatraIdx].te,
    nakshatraEn: NAKSHATRA_LIST_META[nakshatraIdx].en,
    pada,
    navamshaRashiIdx,
    navamshaRashiTe: RASHI_LIST_META[navamshaRashiIdx].te,
    isRetrograde,
  };
}

export function computeAccurateJanmaKundali(
  birthDate: string,
  birthTime: string,
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON,
  tzOffsetHours = 5.5
) {
  const [yStr, mStr, dStr] = birthDate.split('-');
  const [hrStr, minStr] = birthTime.split(':');
  const year = Number(yStr) || 1994;
  const month = Number(mStr) || 8;
  const day = Number(dStr) || 15;
  const hour = Number(hrStr) || 9;
  const minute = Number(minStr) || 30;

  const utcMs = Date.UTC(year, month - 1, day, hour, minute, 0) - tzOffsetHours * 3600 * 1000;
  const utcDate = new Date(utcMs);
  const utcDatePlus1Hr = new Date(utcMs + 3600 * 1000);

  const ayanamsaDeg = getLahiriAyanamsa(utcDate);
  const ascLon = getSiderealAscendant(utcDate, lat, lon);
  const sunLon = getSiderealSunLongitude(utcDate);
  const moonLon = getSiderealMoonLongitude(utcDate);

  const marsLon = getSiderealPlanetLongitude(Astronomy.Body.Mars, utcDate);
  const marsNext = getSiderealPlanetLongitude(Astronomy.Body.Mars, utcDatePlus1Hr);
  const mercLon = getSiderealPlanetLongitude(Astronomy.Body.Mercury, utcDate);
  const mercNext = getSiderealPlanetLongitude(Astronomy.Body.Mercury, utcDatePlus1Hr);
  const jupLon = getSiderealPlanetLongitude(Astronomy.Body.Jupiter, utcDate);
  const jupNext = getSiderealPlanetLongitude(Astronomy.Body.Jupiter, utcDatePlus1Hr);
  const venLon = getSiderealPlanetLongitude(Astronomy.Body.Venus, utcDate);
  const venNext = getSiderealPlanetLongitude(Astronomy.Body.Venus, utcDatePlus1Hr);
  const satLon = getSiderealPlanetLongitude(Astronomy.Body.Saturn, utcDate);
  const satNext = getSiderealPlanetLongitude(Astronomy.Body.Saturn, utcDatePlus1Hr);
  const { rahu, ketu } = getSiderealRahuKetu(utcDate);

  const isRetro = (curr: number, next: number) => {
    let diff = next - curr;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff < 0;
  };

  const lagnaDetail = buildPlanetDetail('lagna', 'లగ్నం', 'Ascendant (Lagna)', ascLon, false);
  const planets: KundaliPlanetDetail[] = [
    lagnaDetail,
    buildPlanetDetail('sun', 'సూర్యుడు', 'Sun (Surya)', sunLon, false),
    buildPlanetDetail('moon', 'చంద్రుడు', 'Moon (Chandra)', moonLon, false),
    buildPlanetDetail('mars', 'కుజుడు', 'Mars (Kuja)', marsLon, isRetro(marsLon, marsNext)),
    buildPlanetDetail('mercury', 'బుధుడు', 'Mercury (Budha)', mercLon, isRetro(mercLon, mercNext)),
    buildPlanetDetail('jupiter', 'గురుడు', 'Jupiter (Guru)', jupLon, isRetro(jupLon, jupNext)),
    buildPlanetDetail('venus', 'శుక్రుడు', 'Venus (Shukra)', venLon, isRetro(venLon, venNext)),
    buildPlanetDetail('saturn', 'శని', 'Saturn (Shani)', satLon, isRetro(satLon, satNext)),
    buildPlanetDetail('rahu', 'రాహువు', 'Rahu (North Node)', rahu, true),
    buildPlanetDetail('ketu', 'కేతువు', 'Ketu (South Node)', ketu, true),
  ];

  const elong = norm360(moonLon - sunLon);
  const tithiIdx = Math.floor(elong / 12) % 30;
  const pakshaTe = tithiIdx < 15 ? 'శుక్ల పక్షం' : 'కృష్ణ పక్షం';
  const tithiTeList = [
    'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి',
    'అష్టమి', 'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి',
  ];
  const tithiNameTe =
    tithiIdx === 14
      ? 'పౌర్ణమి'
      : tithiIdx === 29
      ? 'అమావాస్య'
      : `${pakshaTe} ${tithiTeList[tithiIdx % 15]}`;

  const nakSpan = 360 / 27;
  const yogaIdx = Math.floor(norm360(sunLon + moonLon) / nakSpan) % 27;
  const yogaTeList = [
    'విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 'అతిగండ', 'సుకర్మణ', 'ధృతి', 'శూల',
    'గండ', 'వృద్ధి', 'ధృవ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర', 'సిద్ధి', 'వ్యతీపాత', 'వరీయాన్',
    'పరిఘ', 'శివ', 'సిద్ధ', 'సాధ్య', 'శుభ', 'శుక్ల', 'బ్రహ్మ', 'ఇంద్ర', 'వైధృతి',
  ];

  const d1RashiPlanets: Record<number, { nameTe: string; isRetro?: boolean }[]> = {};
  const d9NavamshaPlanets: Record<number, { nameTe: string; isRetro?: boolean }[]> = {};
  for (let i = 0; i < 12; i++) {
    d1RashiPlanets[i] = [];
    d9NavamshaPlanets[i] = [];
  }
  for (const p of planets) {
    d1RashiPlanets[p.rashiIdx].push({ nameTe: p.nameTe, isRetro: p.isRetrograde });
    d9NavamshaPlanets[p.navamshaRashiIdx].push({ nameTe: p.nameTe, isRetro: p.isRetrograde });
  }

  const moonDetail = planets[2];
  const degInMoonNak = moonDetail.longitude - moonDetail.nakshatraIdx * nakSpan;
  const balanceFraction = Math.max(0.02, 1 - degInMoonNak / nakSpan);

  const marsDetail = planets[3];
  const marsHouseFromLagna = ((marsDetail.rashiIdx - lagnaDetail.rashiIdx + 12) % 12) + 1;
  const hasKujaDosha = [1, 2, 4, 7, 8, 12].includes(marsHouseFromLagna);

  return {
    ayanamsaFormatted: formatDegMinSec(ayanamsaDeg),
    rashi: RASHI_LIST_META[moonDetail.rashiIdx],
    lagna: RASHI_LIST_META[lagnaDetail.rashiIdx],
    navamshaLagna: RASHI_LIST_META[lagnaDetail.navamshaRashiIdx],
    nakshatraName: moonDetail.nakshatraTe,
    nakshatraEn: moonDetail.nakshatraEn,
    nakshatraIdx: moonDetail.nakshatraIdx + 1,
    pada: moonDetail.pada,
    balanceFraction,
    birthTithiTe: tithiNameTe,
    birthYogaTe: `${yogaTeList[yogaIdx]} యోగం`,
    planets,
    d1RashiPlanets,
    d9NavamshaPlanets,
    marsHouseFromLagna,
    hasKujaDosha,
  };
}
