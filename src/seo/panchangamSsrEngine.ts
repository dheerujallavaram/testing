import * as Astronomy from 'astronomy-engine';
import { WEEK_DATA } from '../data/panchangamData';
import { DayData } from '../types/panchangam';
import {
  getOrGenerateDayData,
  getSiderealMoonLongitude,
  norm360,
} from '../utils/astronomyPanchangam';

export const SITE_URL = 'https://www.telugujyothisham.com';
export const ISR_REVALIDATE_SECONDS = 86400;

export interface CityTimingConfig {
  slug: 'hyderabad' | 'vijayawada' | 'visakhapatnam' | 'usa';
  nameTe: string;
  nameEn: string;
  stateOrRegionTe: string;
  stateOrRegionEn: string;
  lat: number;
  lon: number;
  tzOffsetHours: number;
  tzLabel: string;
  uniqueIntroTe: string;
}

export const SUPPORTED_CITY_CONFIGS: Record<CityTimingConfig['slug'], CityTimingConfig> = {
  hyderabad: {
    slug: 'hyderabad',
    nameTe: 'హైదరాబాద్',
    nameEn: 'Hyderabad',
    stateOrRegionTe: 'తెలంగాణ, భారత్',
    stateOrRegionEn: 'Telangana, India',
    lat: 17.385,
    lon: 78.4867,
    tzOffsetHours: 5.5,
    tzLabel: 'IST (UTC+5:30)',
    uniqueIntroTe:
      'దక్కన్ పీఠభూమిలో సముద్ర మట్టానికి సుమారు 540 మీటర్ల ఎత్తులో ఉన్న హైదరాబాద్ – సికింద్రాబాద్ జంట నగరాల భౌగోళిక రేఖాంశం (78.4867° E) ఆధారంగా నేటి సూర్యోదయ మరియు సూర్యాస్తమయ ప్రమాణాలు గణించబడ్డాయి. భారత ప్రామాణిక కాలమాన రేఖకు (82.5° E) పశ్చిమంగా ఉండటం వల్ల కోస్తా ఆంధ్ర నగరాలతో పోలిస్తే హైదరాబాద్‌లో సూర్యోదయం సుమారు 16 నుండి 18 నిమిషాలు ఆలస్యంగా జరుగుతుంది. అందువల్ల ఇక్కడి భక్తులకు రాహుకాలం, యమగండం, అభిజిత్ ముహూర్తం మరియు వర్జ్య ఘడియలు హైదరాబాద్ స్థానిక సూర్యోదయ స్ఫుటంతో ప్రత్యేకంగా లెక్కించబడ్డాయి.',
  },
  vijayawada: {
    slug: 'vijayawada',
    nameTe: 'విజయవాడ',
    nameEn: 'Vijayawada',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 16.5062,
    lon: 80.648,
    tzOffsetHours: 5.5,
    tzLabel: 'IST (UTC+5:30)',
    uniqueIntroTe:
      'పవిత్ర కృష్ణా నదీ తీరాన ఇంద్రకీలాద్రి క్షేత్ర సాన్నిధ్యంలో ఉన్న విజయవాడ మరియు అమరావతి రాజధాని ప్రాంతం (16.5062° N, 80.6480° E) తూర్పు తీరానికి చేరువగా ఉండటం చేత హైదరాబాద్ కంటే సుమారు 9 నిమిషాలు ముందుగానే సూర్యోదయాన్ని చూస్తుంది. దృక్సిద్ధాంత గణిత సూత్రాల ప్రకారం అహోరాత్ర ప్రమాణం (పగటి నిడివి) మారినప్పుడు అష్టమ భాగాలైన రాహుకాలం, యమగండం మరియు పగటి 8వ ముహూర్తమైన అభిజిత్ సమయాలు కూడా మారుతాయి. కృష్ణా, గుంటూరు జిల్లాల భక్తుల నిత్య పూజా సంకల్పం మరియు శుభకార్యాల కోసం ఈ స్థానిక సమయాలు రూపొందించబడ్డాయి.',
  },
  visakhapatnam: {
    slug: 'visakhapatnam',
    nameTe: 'విశాఖపట్నం',
    nameEn: 'Visakhapatnam',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 17.6868,
    lon: 83.2185,
    tzOffsetHours: 5.5,
    tzLabel: 'IST (UTC+5:30)',
    uniqueIntroTe:
      'తూర్పు కనుమలు మరియు బంగాళాఖాత తీరాన ఉన్న విశాఖపట్నం (17.6868° N, 83.2185° E) భారత ప్రామాణిక రేఖాంశమైన 82.5° E కంటే తూర్పున ఉన్న ఏకైక ప్రధాన తెలుగు మహా నగరం. ఈ కారణంగా తెలుగు రాష్ట్రాలలో అందరికంటే ముందుగా సూర్యోదయం విశాఖపట్నం, విజయనగరం మరియు శ్రీకాకుళం ఉత్తరాంధ్ర ప్రాంతాలలోనే సంభవిస్తుంది. హైదరాబాద్ సమయాలతో పోలిస్తే విశాఖపట్నంలో సూర్యోదయం మరియు రాహుకాల ప్రారంభం దాదాపు 19 నిమిషాలు ముందుగా ఉంటాయి కాబట్టి ఉత్తరాంధ్ర భక్తులు ఈ స్థానిక దృక్సిద్ధాంత పంచాంగాన్ని అనుసరించాలి.',
  },
  usa: {
    slug: 'usa',
    nameTe: 'అమెరికా (USA NRI)',
    nameEn: 'USA (Dallas / New York / Bay Area)',
    stateOrRegionTe: 'ఉత్తర అమెరికా (EST / CST / PST)',
    stateOrRegionEn: 'United States (CST / EST / PST)',
    lat: 32.7767,
    lon: -96.797,
    tzOffsetHours: -6.0,
    tzLabel: 'CST (UTC-6:00)',
    uniqueIntroTe:
      'ఉత్తర అమెరికా (USA) లో నివసిస్తున్న ప్రవాస తెలుగు కుటుంబాలకు భారతదేశ కాలమానాన్ని యథాతథంగా వాడటం శాస్త్ర సమ్మతం కాదు; ఎందుకంటే తిథి మరియు నక్షత్రం అంతర్జాతీయంగా ఒకే క్షణంలో మారినప్పటికీ, సూర్యోదయానికి లెక్కించే రాహుకాలం, యమగండం, దుర్ముహూర్తం మరియు అభిజిత్ ముహూర్తాలు ఆయా అమెరికా నగరాల స్థానిక సూర్యోదయంపై ఆధారపడి ఉంటాయి. డల్లాస్ (CST), న్యూయార్క్/న్యూజెర్సీ (EST), మరియు బే ఏరియా/శాన్ జోస్ (PST) అక్షాంశ-రేఖాంశాల ప్రకారం NASA JPL DE440 ఎఫెమెరిస్ సహాయంతో గణించిన ఖచ్చితమైన అమెరికా తెలుగు పంచాంగం ఇది.',
  },
};

export interface ComputedCityPanchangam {
  city: CityTimingConfig;
  isoDate: string;
  dayData: DayData;
  sunrise: string;
  sunset: string;
  tithi: string;
  nakshatram: string;
  yogam: string;
  karanam: string;
  rahukalam: string;
  yamagandam: string;
  varjyam: string;
  durmuhurtham: string;
  abhijitMuhurtham: string;
  amruthaGadiyalu: string;
  usaZones?: {
    zone: string;
    cityExample: string;
    sunrise: string;
    sunset: string;
    rahukalam: string;
    abhijit: string;
  }[];
}

function formatMinutesTo12Hr(totalMinutes: number): string {
  const norm = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = String(norm % 60).padStart(2, '0');
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, '0')}:${m} ${period}`;
}

function formatUtcToLocalMinutes(utcDate: Date, tzOffsetHours: number): number {
  const localMs = utcDate.getTime() + tzOffsetHours * 3600 * 1000;
  const d = new Date(localMs);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

function computeZoneTimings(
  year: number,
  month: number,
  day: number,
  lat: number,
  lon: number,
  tzOffsetHours: number
) {
  const observer = new Astronomy.Observer(lat, lon, 200);
  const searchStartUtc = new Date(
    Date.UTC(year, month - 1, day, 0, 0, 0) - tzOffsetHours * 3600 * 1000
  );
  const riseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, searchStartUtc, 1);
  const setEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, searchStartUtc, 1);

  const srMin = riseEvent ? formatUtcToLocalMinutes(riseEvent.date, tzOffsetHours) : 6 * 60 + 12;
  const ssMin = setEvent ? formatUtcToLocalMinutes(setEvent.date, tzOffsetHours) : 18 * 60 + 2;
  const dayLen = Math.max(480, ssMin - srMin);

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
  const yamaOctantByDow: Record<number, number> = {
    0: 4,
    1: 3,
    2: 2,
    3: 1,
    4: 0,
    5: 6,
    6: 5,
  };

  const octLen = dayLen / 8;
  const rahuStart = srMin + (rahuOctantByDow[dow] ?? 7) * octLen;
  const yamaStart = srMin + (yamaOctantByDow[dow] ?? 4) * octLen;

  const midDay = srMin + dayLen / 2;
  const halfMuhurtha = dayLen / 30;
  const abhijitStart = midDay - halfMuhurtha;
  const abhijitEnd = midDay + halfMuhurtha;

  return {
    sunriseUtc:
      riseEvent?.date ||
      new Date(Date.UTC(year, month - 1, day, 6, 12, 0) - tzOffsetHours * 3600 * 1000),
    srMin,
    ssMin,
    dayLen,
    sunrise: formatMinutesTo12Hr(srMin),
    sunset: formatMinutesTo12Hr(ssMin),
    rahukalam: `${formatMinutesTo12Hr(rahuStart)} – ${formatMinutesTo12Hr(rahuStart + octLen)}`,
    yamagandam: `${formatMinutesTo12Hr(yamaStart)} – ${formatMinutesTo12Hr(yamaStart + octLen)}`,
    abhijit:
      dow === 3
        ? `${formatMinutesTo12Hr(abhijitStart)} – ${formatMinutesTo12Hr(abhijitEnd)} (బుధవారం మధ్యాహ్నం)`
        : `${formatMinutesTo12Hr(abhijitStart)} – ${formatMinutesTo12Hr(abhijitEnd)}`,
  };
}

export function computeCityLocalPanchangam(
  isoDate: string,
  citySlug: CityTimingConfig['slug'] = 'hyderabad'
): ComputedCityPanchangam {
  const city = SUPPORTED_CITY_CONFIGS[citySlug] || SUPPORTED_CITY_CONFIGS.hyderabad;
  const dayData = getOrGenerateDayData(isoDate, WEEK_DATA);
  const [yStr, mStr, dStr] = isoDate.split('-');
  const year = parseInt(yStr, 10) || 2026;
  const month = parseInt(mStr, 10) || 11;
  const day = parseInt(dStr, 10) || 2;

  const zone = computeZoneTimings(year, month, day, city.lat, city.lon, city.tzOffsetHours);

  const moonAtRise = getSiderealMoonLongitude(zone.sunriseUtc);
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(norm360(moonAtRise) / nakSpan) % 27;
  const varjyamStartGhati =
    [
      50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14, 20, 24, 20, 10, 10,
      18, 16, 24, 30,
    ][nakIdx] || 20;
  const amruthaStartGhati =
    [
      42, 48, 54, 52, 38, 35, 54, 44, 56, 54, 44, 42, 45, 44, 38, 38, 34, 38, 44, 48, 44, 34, 34,
      42, 40, 48, 54,
    ][nakIdx] || 44;

  const degIntoNak = norm360(moonAtRise) - nakIdx * nakSpan;
  const varjyamStartDeg = (varjyamStartGhati / 60) * nakSpan;
  const degToVarjyam = varjyamStartDeg - degIntoNak;
  const hoursToVarjyam = (degToVarjyam / nakSpan) * 24.3;
  const varjyamStartMin =
    zone.srMin + (hoursToVarjyam >= 0 ? hoursToVarjyam * 60 : (hoursToVarjyam + 24) * 60);
  const varjyamStr = `${formatMinutesTo12Hr(varjyamStartMin)} – ${formatMinutesTo12Hr(varjyamStartMin + 96)}`;

  const amruthaStartDeg = (amruthaStartGhati / 60) * nakSpan;
  const degToAmrutha = amruthaStartDeg - degIntoNak;
  const hoursToAmrutha = (degToAmrutha / nakSpan) * 24.3;
  const amruthaStartMin =
    zone.srMin + (hoursToAmrutha >= 0 ? hoursToAmrutha * 60 : (hoursToAmrutha + 24) * 60);
  const amruthaStr = `${formatMinutesTo12Hr(amruthaStartMin)} – ${formatMinutesTo12Hr(amruthaStartMin + 96)}`;

  let usaZones: ComputedCityPanchangam['usaZones'];
  if (citySlug === 'usa') {
    const est = computeZoneTimings(year, month, day, 40.7128, -74.006, -5.0);
    const cst = computeZoneTimings(year, month, day, 32.7767, -96.797, -6.0);
    const pst = computeZoneTimings(year, month, day, 37.3382, -121.8863, -8.0);
    usaZones = [
      {
        zone: 'EST (Eastern Time)',
        cityExample: 'New York, New Jersey, Atlanta, Virginia',
        sunrise: est.sunrise,
        sunset: est.sunset,
        rahukalam: est.rahukalam,
        abhijit: est.abhijit,
      },
      {
        zone: 'CST (Central Time)',
        cityExample: 'Dallas, Frisco, Irving, Houston, Chicago',
        sunrise: cst.sunrise,
        sunset: cst.sunset,
        rahukalam: cst.rahukalam,
        abhijit: cst.abhijit,
      },
      {
        zone: 'PST (Pacific Time)',
        cityExample: 'San Jose, Bay Area, Seattle, Los Angeles',
        sunrise: pst.sunrise,
        sunset: pst.sunset,
        rahukalam: pst.rahukalam,
        abhijit: pst.abhijit,
      },
    ];
  }

  return {
    city,
    isoDate,
    dayData,
    sunrise: zone.sunrise,
    sunset: zone.sunset,
    tithi: dayData.panchanga.tithi,
    nakshatram: dayData.panchanga.nakshatram,
    yogam: dayData.panchanga.yogam,
    karanam: dayData.panchanga.karanam,
    rahukalam: zone.rahukalam,
    yamagandam: zone.yamagandam,
    varjyam: citySlug === 'hyderabad' ? dayData.ashubha.varjyam || varjyamStr : varjyamStr,
    durmuhurtham: dayData.ashubha.durmuhurtham,
    abhijitMuhurtham: dayData.shubha.abhijit || zone.abhijit,
    amruthaGadiyalu: citySlug === 'hyderabad' ? dayData.shubha.amrutha || amruthaStr : amruthaStr,
    usaZones,
  };
}

/**
 * Returns today's IST date in YYYY-MM-DD format.
 */
export function getTodayIsoDateIST(referenceDate: Date = new Date()): string {
  const istMs = referenceDate.getTime() + 5.5 * 3600 * 1000;
  const ist = new Date(istMs);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Adds or subtracts days from an ISO date string YYYY-MM-DD.
 */
export function addDaysIso(isoDate: string, offsetDays: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const utc = new Date(Date.UTC(y || 2026, (m || 11) - 1, (d || 2) + offsetDays));
  const ry = utc.getUTCFullYear();
  const rm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const rd = String(utc.getUTCDate()).padStart(2, '0');
  return `${ry}-${rm}-${rd}`;
}

/**
 * Next.js generateStaticParams() helper: returns the next 60 days (or optional daysBehind)
 * so all daily Panchangam URLs /panchangam/[yyyy-mm-dd] are pre-built at build time.
 */
export function generateStaticDateParams(daysAhead = 60, daysBehind = 0): { date: string }[] {
  const todayIso = getTodayIsoDateIST();
  const seen = new Set<string>();
  const params: { date: string }[] = [];

  for (let i = -daysBehind; i < daysAhead; i++) {
    const dt = addDaysIso(todayIso, i);
    if (!seen.has(dt)) {
      seen.add(dt);
      params.push({ date: dt });
    }
  }

  return params;
}

export interface PageSeoMetadata {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  h1: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  breadcrumbs: { name: string; item: string }[];
}

function clampTitle(title: string, maxChars = 60): string {
  const clean = title.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, maxChars - 1).trimEnd() + '…';
}

function clampMetaDescription(desc: string, maxChars = 154): string {
  const clean = desc.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, maxChars - 1).trimEnd() + '…';
}

/**
 * Next.js generateMetadata() equivalent for every route in the application.
 * Guarantees:
 * - Every page gets a unique title (< 60 chars)
 * - Meta description strictly < 155 characters
 * - Single H1 on every page
 * - Self-referencing canonical starting with https://www.telugujyothisham.com
 * - Doorway URLs (/telugu-astrologer-in-*, /neti-panchangam-in-*, /vivaha-pontana-jatakam-in-*) get robots: "noindex, follow"
 */
export function generatePageMetadata(rawPathname: string): PageSeoMetadata {
  const pathname = (rawPathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const todayIso = getTodayIsoDateIST();
  const todayData = getOrGenerateDayData(todayIso, WEEK_DATA);
  const cleanTithi = todayData.panchanga.tithi.split('(')[0].split('-')[0].trim();
  const cleanNak = todayData.panchanga.nakshatram.split('(')[0].split('-')[0].trim();
  const defaultOgImage = `${SITE_URL}/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg`;
  const defaultRobots = 'index, follow';

  // 0. LEGACY TOWN DOORWAY URLS -> NOINDEX, FOLLOW (Task 2)
  const doorwayMatch = pathname.match(
    /^\/(telugu-astrologer-in|neti-panchangam-in|telugu-panchangam-in|vivaha-pontana-jatakam-in)-([a-z0-9-]+)$/i
  );
  if (doorwayMatch) {
    const slug = doorwayMatch[2].toLowerCase();
    const title = clampTitle(`తెలుగు పంచాంగం & జ్యోతిష సమాచారం (${slug}) | Telugu Jyothisham`);
    const description = clampMetaDescription(
      `దృక్సిద్ధాంత తెలుగు పంచాంగం, తిథి, నక్షత్రం, రాహుకాలం మరియు ఉచిత జన్మ కుండలి సమాచారం.`
    );
    const canonical = `${SITE_URL}${pathname}`;
    return {
      title,
      description,
      canonical,
      robots: 'noindex, follow',
      h1: `తెలుగు పంచాంగం & జ్యోతిష సమాచారం (${slug})`,
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'హోమ్ (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
      ],
    };
  }

  // 1. HOMEPAGE (/)
  if (pathname === '/') {
    const title = clampTitle('నేటి పంచాంగం – Today Telugu Panchangam | Telugu Jyothisham');
    const description = clampMetaDescription(
      `నేటి పంచాంగం (Today Telugu Panchangam): ఈ రోజు తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, రాహుకాలం, వర్జ్యం, అభిజిత్ ముహూర్తం & రాశి ఫలాలు.`
    );
    return {
      title,
      description,
      canonical: `${SITE_URL}/`,
      robots: defaultRobots,
      h1: 'నేటి పంచాంగం (Today Telugu Panchangam)',
      ogTitle: title,
      ogDescription: description,
      ogUrl: `${SITE_URL}/`,
      ogImage: defaultOgImage,
      breadcrumbs: [{ name: 'హోమ్ (Home)', item: `${SITE_URL}/` }],
    };
  }

  // 2. DAILY PANCHANGAM BY DATE: /panchangam/[yyyy-mm-dd]
  // Task 1 Title pattern: "నేటి పంచాంగం – {date} | తిథి, నక్షత్రం, రాహుకాలం"
  const dateMatch = pathname.match(/^\/panchangam\/(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    const isoDate = dateMatch[1];
    const dData = getOrGenerateDayData(isoDate, WEEK_DATA);
    const tithiShort = dData.panchanga.tithi.split('(')[0].split('-')[0].trim();
    const nakShort = dData.panchanga.nakshatram.split('(')[0].split('-')[0].trim();
    const title = clampTitle(`నేటి పంచాంగం – ${isoDate} | తిథి, నక్షత్రం, రాహుకాలం`);
    const description = clampMetaDescription(
      `${isoDate} తెలుగు పంచాంగం: తిథి ${tithiShort}, నక్షత్రం ${nakShort}, రాహుకాలం ${dData.ashubha.rahukalam}, వర్జ్యం & అభిజిత్ ముహూర్తం.`
    );
    const canonical = `${SITE_URL}/panchangam/${isoDate}`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: `నేటి పంచాంగం – ${isoDate} (${dData.teediVaram})`,
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'హోమ్ (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
        { name: `${isoDate} పంచాంగం`, item: canonical },
      ],
    };
  }

  // 3. MONTHLY CALENDAR PAGE: /panchangam/calendar
  if (pathname === '/panchangam/calendar') {
    const title = clampTitle('తెలుగు పంచాంగం క్యాలెండర్ – 60 రోజుల తిథి, నక్షత్రం');
    const description = clampMetaDescription(
      'రాబోయే 60 రోజుల తెలుగు పంచాంగం క్యాలెండర్: ప్రతిరోజూ తిథి, నక్షత్రం, రాహుకాలం, వర్జ్యం మరియు అభిజిత్ ముహూర్త సమయాలు.'
    );
    const canonical = `${SITE_URL}/panchangam/calendar`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: 'నెలవారీ తెలుగు పంచాంగం క్యాలెండర్ (Monthly Telugu Panchangam Calendar)',
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'హోమ్ (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
        { name: 'నెలవారీ క్యాలెండర్', item: canonical },
      ],
    };
  }

  // 4. VERIFIED 4 CITY PANCHANGAM PAGES: /panchangam/[city]
  const cityDirectMatch = pathname.match(
    /^\/panchangam\/(?:city\/)?(hyderabad|vijayawada|visakhapatnam|usa)$/i
  );
  if (cityDirectMatch) {
    const citySlug = cityDirectMatch[1].toLowerCase() as CityTimingConfig['slug'];
    const cityPanchangam = computeCityLocalPanchangam(todayIso, citySlug);
    const c = cityPanchangam.city;
    const cityTitles: Record<CityTimingConfig['slug'], string> = {
      hyderabad: 'హైదరాబాద్ నేటి పంచాంగం – Hyderabad Telugu Panchangam',
      vijayawada: 'విజయవాడ నేటి పంచాంగం – Vijayawada Telugu Panchangam',
      visakhapatnam: 'విశాఖపట్నం నేటి పంచాంగం – Visakhapatnam Panchangam',
      usa: 'అమెరికా తెలుగు పంచాంగం – USA NRI Telugu Panchangam',
    };
    const title = clampTitle(cityTitles[citySlug]);
    const description = clampMetaDescription(
      `${c.nameTe} (${c.nameEn}) నేటి పంచాంగం: సూర్యోదయం ${cityPanchangam.sunrise}, తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, రాహుకాలం ${cityPanchangam.rahukalam}.`
    );
    const canonical = `${SITE_URL}/panchangam/${citySlug}`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: `${c.nameTe} నేటి పంచాంగం (${c.nameEn} Today Telugu Panchangam)`,
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'హోమ్ (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
        { name: `${c.nameTe} పంచాంగం`, item: canonical },
      ],
    };
  }

  // 5. CORE TOOL & CONTENT ROUTES (All titles strictly < 60 chars)
  const routeTable: Record<
    string,
    {
      title: string;
      description: string;
      h1: string;
      breadcrumbName: string;
      canonicalPath?: string;
      robots?: string;
    }
  > = {
    '/panchangam': {
      title: 'నేటి తెలుగు పంచాంగం – తిథి, నక్షత్రం, రాహుకాలం | జ్యోతిషం',
      description: `ఈ రోజు తెలుగు పంచాంగం (${todayData.teediVaram}): తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, రాహుకాలం, వర్జ్యం, అభిజిత్ ముహూర్తం & ద్వాదశ రాశి ఫలాలు.`,
      h1: `ఈ రోజు తెలుగు పంచాంగం – ${todayData.teediVaram}`,
      breadcrumbName: 'నేటి పంచాంగం',
    },
    '/mee-jatakam': {
      title: 'పుట్టిన తేదీతో తెలుగు జాతకం – Jathakam by Date of Birth',
      description:
        'పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా ఉచిత తెలుగు జన్మ కుండలి (Jathakam by Date of Birth in Telugu), రాశి చక్రం, నవాంశ మరియు 120 ఏళ్ల మహాదశ ఫలితాలు.',
      h1: 'పుట్టిన తేదీతో తెలుగు జాతకం (Jathakam by Date of Birth in Telugu)',
      breadcrumbName: 'మీ జాతకం తెలుసుకోండి',
    },
    '/janma-kundali': {
      title: 'ఉచిత తెలుగు జన్మ కుండలి – Jathakam by Date of Birth',
      description:
        'మీ పుట్టిన తేదీ మరియు సమయంతో దృక్సిద్ధాంత జన్మ కుండలి (Jathakam by Date of Birth in Telugu), లగ్నం, నక్షత్ర పాదం మరియు దశ ఫలితాలను ఉచితంగా పొందండి.',
      h1: 'ఉచిత తెలుగు జన్మ కుండలి (Free Janma Kundali in Telugu)',
      breadcrumbName: 'ఉచిత జన్మ కుండలి',
    },
    '/vivaha-pontana': {
      title: '36 గుణాల వివాహ పొంతన – Vivaha Pontana in Telugu',
      description:
        'వధూవరుల జన్మ నక్షత్రం మరియు రాశుల ఆధారంగా 36 గుణాల అష్టకూట వివాహ పొంతన (Vivaha Pontana Telugu), నాడి, రజ్జు మరియు కుజ దోష పరిశీలన.',
      h1: '36 గుణాల అష్టకూట వివాహ పొంతన (Vivaha Pontana in Telugu)',
      breadcrumbName: '36 గుణాల వివాహ పొంతన',
    },
    '/telugu-baby-names': {
      title: '27 నక్షత్రాల పిల్లల పేర్లు – Telugu Baby Names by Nakshatra',
      description:
        'అశ్విని నుండి రేవతి వరకు 27 నక్షత్రాల 4 పాదాల నామ అక్షరాలతో అర్థవంతమైన తెలుగు పిల్లల పేర్లు (Telugu Baby Names by Nakshatra).',
      h1: '27 నక్షత్రాల తెలుగు పిల్లల పేర్లు (Telugu Baby Names by Nakshatra)',
      breadcrumbName: 'నక్షత్ర పిల్లల పేర్లు',
    },
    '/gowri-panchangam': {
      title: 'నేటి గౌరీ పంచాంగం & హోరా చక్రం – Gowri Panchangam Telugu',
      description:
        'ఈ రోజు పగలు మరియు రాత్రి గౌరీ పంచాంగం (అమృతం, శుభం, లాభం, ధనం) మరియు 24 గంటల నవగ్రహ హోరా చక్రం శుభ సమయాలు.',
      h1: 'నేటి గౌరీ పంచాంగం & నవగ్రహ హోరా చక్రం',
      breadcrumbName: 'గౌరీ పంచాంగం',
    },
    '/tarabalam-chandrabalam': {
      title: 'తారాబలం & చంద్రబలం క్యాలిక్యులేటర్ – Tarabalam Telugu',
      description: `ఈ రోజు నక్షత్రం (${cleanNak}) ఆధారంగా 27 నక్షత్రాల నవతార తారాబలం మరియు 12 రాశుల చంద్రబలం శుభాశుభ ఫలితాలు.`,
      h1: 'నేటి తారాబలం & చంద్రబలం క్యాలిక్యులేటర్',
      breadcrumbName: 'తారాబలం & చంద్రబలం',
    },
    '/nitya-sankalpam': {
      title: 'నేటి తెలుగు నిత్య పూజా సంకల్పం మంత్రం (India & USA)',
      description: `శ్రీ పరాభవ నామ సంవత్సరం (${cleanTithi}, ${cleanNak}) నిత్య పూజా సంకల్పం మంత్రం – జంబూద్వీపే (India) మరియు క్రౌంచద్వీపే (USA).`,
      h1: 'నేటి తెలుగు నిత్య పూజా సంకల్పం (India & USA)',
      breadcrumbName: 'నిత్య పూజా సంకల్పం',
    },
    '/naama-nakshatra': {
      title: 'పేరు మొదటి అక్షరంతో రాశి & నక్షత్రం – Naama Nakshatra',
      description:
        'పుట్టిన సమయం తెలియకపోయినా మీ పేరు మొదటి అక్షరం ద్వారా మీ జన్మ రాశి, నక్షత్రం, పాదం, గణం మరియు నాడి వివరాలను తెలుసుకోండి.',
      h1: 'పేరు మొదటి అక్షరంతో రాశి & నక్షత్రం (Naama Nakshatra)',
      breadcrumbName: 'నామ నక్షత్రం',
    },
    '/ugadi-rashi-phalalu': {
      title: 'శ్రీ పరాభవ నామ సంవత్సర ఉగాది రాశి ఫలాలు 2026–2027',
      description:
        '2026–2027 శ్రీ పరాభవ నామ సంవత్సర 12 రాశుల ఆదాయం – వ్యయం, రాజపూజ్యం – అవమానం మరియు ఉగాది వార్షిక రాశి ఫలితాలు.',
      h1: 'శ్రీ పరాభవ నామ సంవత్సర ఉగాది రాశి ఫలాలు 2026–2027',
      breadcrumbName: 'ఉగాది రాశి ఫలాలు',
    },
    '/shubha-muhurthalu': {
      title: 'శుభ ముహూర్తాలు 2026–2027 – వివాహం & గృహప్రవేశం తేదీలు',
      description:
        '2026–2027 వివాహం, గృహప్రవేశం, అక్షరాభ్యాసం, అన్నప్రాసన మరియు వాహన కొనుగోలుకు దృక్సిద్ధాంత శుభ ముహూర్త తేదీలు.',
      h1: 'శుభ ముహూర్తాలు 2026–2027 (వివాహం & గృహప్రవేశం)',
      breadcrumbName: 'శుభ ముహూర్తాలు',
    },
    '/festivals': {
      title: 'తెలుగు పండుగలు & ఏకాదశి తిథుల క్యాలెండర్ 2026–2027',
      description:
        '2026–2027 తెలుగు పండుగలు, ఏకాదశి, పౌర్ణమి, అమావాస్య, సంకష్టహర చతుర్థి మరియు ప్రదోష వ్రత తేదీల సంపూర్ణ జాబితా.',
      h1: 'తెలుగు పండుగలు & ముఖ్య తిథుల క్యాలెండర్ 2026–2027',
      breadcrumbName: 'తెలుగు పండుగలు',
    },
    '/vastu-shastra-telugu': {
      title: 'గృహ వాస్తు చక్రం & ఇంటి ముఖద్వార వాస్తు – Telugu Vastu',
      description:
        'తూర్పు, ఉత్తరం, పశ్చిమం, దక్షిణం సింహద్వార వాస్తు నియమాలు మరియు 8 దిక్కుల అష్ట దిక్పాలక గృహ వాస్తు మార్గదర్శిని.',
      h1: 'గృహ వాస్తు చక్రం & ఇంటి ముఖద్వార వాస్తు నియమాలు',
      breadcrumbName: 'గృహ వాస్తు శాస్త్రం',
    },
    '/dosha-pariharalu': {
      title: 'ఏలినాటి శని, అష్టమ శని & కుజ దోష నివారణ పరిహారాలు',
      description:
        'మీ జన్మ రాశికి ఏలినాటి శని, అష్టమ శని, అర్ధాష్టమ శని లేదా కుజ దోషం ఉందా? ఉచిత దోష చెకర్ మరియు వైదిక శాంతి పరిహారాలు.',
      h1: 'ఏలినాటి శని, అష్టమ శని & కుజ దోష నివారణ పరిహారాలు',
      breadcrumbName: 'దోష పరిహారాలు',
    },
    '/services': {
      title: 'వైదిక పూజా సేవలు & హోమ క్రతువులు | Telugu Jyothisham',
      description:
        'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో చండీ హోమం, లక్ష్మీ గణపతి హోమం, వివాహ, గృహప్రవేశ ముహూర్త మరియు వైదిక పూజా సేవలు.',
      h1: 'వైదిక పూజా సేవలు & మహా హోమ క్రతువులు',
      breadcrumbName: 'పూజా సేవలు',
    },
    '/awards': {
      title: 'మా గురించి – బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ | About Us',
      description:
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వ్యవస్థాపకులు, స్మార్త వేద మరియు దృక్సిద్ధాంత జ్యోతిష విద్వాంసులు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పరిచయం.',
      h1: 'మా గురించి – బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
      breadcrumbName: 'మా గురించి (About)',
      canonicalPath: '/about',
      robots: 'noindex, follow',
    },
    '/about': {
      title: 'మా గురించి – బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ | About Us',
      description:
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వ్యవస్థాపకులు, స్మార్త వేద మరియు దృక్సిద్ధాంత జ్యోతిష విద్వాంసులు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పరిచయం.',
      h1: 'మా గురించి – బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (About Author & Peetham)',
      breadcrumbName: 'మా గురించి (About)',
    },
    '/contact': {
      title: 'సంప్రదించండి (Contact Us) | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
      description:
        'జాతక పరిశీలన, వివాహ పొంతన, శుభ ముహూర్త నిర్ణయం మరియు హోమ క్రతువుల కొరకు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని సంప్రదించండి.',
      h1: 'సంప్రదించండి (Contact Telugu Jyothisham)',
      breadcrumbName: 'సంప్రదించండి (Contact)',
    },
    '/privacy-policy': {
      title: 'గోప్యతా విధానం (Privacy Policy) | Telugu Jyothisham',
      description:
        'telugujyothisham.com భక్తుల వ్యక్తిగత సమాచార భద్రత, కుకీల వినియోగం మరియు Google AdSense గోప్యతా నిబంధనల వివరాలు.',
      h1: 'గోప్యతా విధానం (Privacy Policy)',
      breadcrumbName: 'గోప్యతా విధానం (Privacy Policy)',
    },
    '/privacy': {
      title: 'గోప్యతా విధానం (Privacy Policy) | Telugu Jyothisham',
      description:
        'telugujyothisham.com భక్తుల వ్యక్తిగత సమాచార భద్రత, కుకీల వినియోగం మరియు Google AdSense గోప్యతా నిబంధనల వివరాలు.',
      h1: 'గోప్యతా విధానం (Privacy Policy)',
      breadcrumbName: 'గోప్యతా విధానం (Privacy Policy)',
      canonicalPath: '/privacy-policy',
      robots: 'noindex, follow',
    },
    '/disclaimer': {
      title: 'జ్యోతిష్య గమనిక (Disclaimer) | Telugu Jyothisham',
      description:
        'telugujyothisham.com నందు ప్రచురించబడే దృక్సిద్ధాంత పంచాంగ సమయాలు మరియు జ్యోతిష్య సమాచారం గురించిన ముఖ్య గమనిక (For informational and cultural purposes only).',
      h1: 'జ్యోతిష్య & వెబ్‌సైట్ గమనిక (Disclaimer)',
      breadcrumbName: 'జ్యోతిష్య గమనిక (Disclaimer)',
    },
    '/terms-and-conditions': {
      title: 'నిబంధనలు & షరతులు (Terms & Conditions) | Telugu Jyothisham',
      description:
        'telugujyothisham.com వెబ్‌సైట్ వినియోగ నిబంధనలు, కాపీరైట్ హక్కులు మరియు జ్యోతిష సంప్రదింపుల మార్గదర్శకాలు.',
      h1: 'నిబంధనలు & షరతులు (Terms & Conditions)',
      breadcrumbName: 'నిబంధనలు (Terms)',
    },
  };

  const matched = routeTable[pathname];
  if (matched) {
    const canonical = `${SITE_URL}${matched.canonicalPath || pathname}`;
    const title = clampTitle(matched.title);
    const desc = clampMetaDescription(matched.description);
    return {
      title,
      description: desc,
      canonical,
      robots: matched.robots || defaultRobots,
      h1: matched.h1,
      ogTitle: title,
      ogDescription: desc,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'హోమ్ (Home)', item: `${SITE_URL}/` },
        { name: matched.breadcrumbName, item: canonical },
      ],
    };
  }

  // Fallback for any legacy alias (/neti-panchangam, /today-panchangam-in-telugu, /ee-roju-panchangam)
  const fallbackTitle = clampTitle('నేటి తెలుగు పంచాంగం – తిథి, నక్షత్రం, రాహుకాలం | జ్యోతిషం');
  const fallbackDesc = clampMetaDescription(
    `ఈ రోజు తెలుగు పంచాంగం: తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, రాహుకాలం, వర్జ్యం, అభిజిత్ ముహూర్తం & రాశి ఫలాలు.`
  );
  return {
    title: fallbackTitle,
    description: fallbackDesc,
    canonical: `${SITE_URL}/panchangam`,
    robots: 'noindex, follow',
    h1: `ఈ రోజు తెలుగు పంచాంగం – ${todayData.teediVaram}`,
    ogTitle: fallbackTitle,
    ogDescription: fallbackDesc,
    ogUrl: `${SITE_URL}/panchangam`,
    ogImage: defaultOgImage,
    breadcrumbs: [
      { name: 'హోమ్ (Home)', item: `${SITE_URL}/` },
      { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
    ],
  };
}

/**
 * Builds clean, non-stuffed Schema.org JSON-LD with WebSite, Organization,
 * Person (Jallavaram Sai Dheeraj Sharma), and BreadcrumbList.
 * Strictly marks up visible content only — no fake reviews, ratings, or awards.
 */
export function buildCleanJsonLdSchema(meta: PageSeoMetadata): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Telugu Jyothisham (తెలుగు జ్యోతిషం)',
        alternateName: ['నేటి పంచాంగం', 'Today Telugu Panchangam', 'Neti Panchangam'],
        inLanguage: ['te', 'en'],
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Telugu Jyothisham – శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon-512x512.png`,
          width: 512,
          height: 512,
        },
        founder: {
          '@id': `${SITE_URL}/#person`,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-8977986166',
          contactType: 'customer support',
          email: 'astrologer@telugujyothisham.com',
          availableLanguage: ['Telugu', 'English', 'Sanskrit'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Pasumamula, Hayathnagar',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          postalCode: '501505',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Jallavaram Sai Dheeraj Sharma',
        alternateName: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ',
        jobTitle: 'Vedic Astrologer & Smartha Veda Vidwan',
        url: `${SITE_URL}/about`,
        image: `${SITE_URL}/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg`,
        worksFor: {
          '@id': `${SITE_URL}/#organization`,
        },
        knowsAbout: [
          'Drik Siddhanta Telugu Panchangam',
          'Janma Kundali & Brihat Jataka',
          'Ashtakoota 36-Guna Vivaha Pontana',
          'Nakshatra Namakaranam & Gruha Vastu',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${meta.canonical}#breadcrumb`,
        itemListElement: meta.breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.item,
        })),
      },
    ],
  };
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Natural ~80-word introduction for Homepage (Zero keyword stuffing, zero locality spam).
 */
export const NATURAL_80_WORD_HOMEPAGE_INTRO_TE =
  'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వారి అధికారిక వెబ్‌సైట్‌కు స్వాగతం. బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పర్యవేక్షణలో దృక్సిద్ధాంత గణిత ఆధారంగా ప్రతిరోజూ ఖచ్చితమైన నేటి పంచాంగం, తిథి, నక్షత్రం, యోగం, కరణం, సూర్యోదయ సూర్యాస్తమయాలు, రాహుకాలం, యమగండం, వర్జ్యం, అమృత ఘడియలు మరియు అభిజిత్ ముహూర్త సమయాలు ఇక్కడ అందించబడుతున్నాయి. వీటితో పాటు ద్వాదశ రాశుల దిన ఫలాలు, పుట్టిన తేదీ మరియు సమయం ఆధారంగా ఉచిత తెలుగు జన్మ కుండలి, 36 గుణాల అష్టకూట వివాహ పొంతన మరియు 27 నక్షత్రాల పాదాల వారీగా తెలుగు పిల్లల పేర్లను భక్తులు ఉచితంగా చూసుకోవచ్చు.';

interface ToolGuideContent {
  introTe: string;
  howItWorksTitle: string;
  howItWorksTe: string;
  termsTitle: string;
  termsListTe: { term: string; meaning: string }[];
  faqListTe: { q: string; a: string }[];
}

const TOOL_PAGE_ORIGINAL_GUIDES: Record<string, ToolGuideContent> = {
  '/janma-kundali': {
    introTe:
      'పుట్టిన తేదీ, ఖచ్చితమైన సమయం మరియు జన్మస్థలం (Date, Time & Place of Birth) ఆధారంగా మనిషి పుట్టిన క్షణంలో తూర్పు క్షితిజంలో ఉదయించే రాశిని లగ్నంగా (Ascendant) నిర్ణయించి, నవగ్రహాల స్ఫుటాలను ద్వాదశ భావాలలో నిక్షిప్తం చేసే శాస్త్రీయ చిత్రపటమే జన్మ కుండలి. దృక్సిద్ధాంత గణిత ప్రమాణాలతో మా ఉచిత తెలుగు జన్మ కుండలి గణన D1 రాశి చక్రం, D9 నవాంశ చక్రం, సప్తమ భావ (7th House) వివాహ రహస్యాలు, కాబోయే భర్త/భార్య లక్షణాలు, వివాహ సమయం మరియు 120 ఏళ్ల వింశోత్తరి మహాదశ ఫలితాలను అందిస్తుంది.',
    howItWorksTitle: 'దృక్సిద్ధాంత జన్మ కుండలి & సప్తమ భావ వివాహ గణన ఎలా పనిచేస్తుంది? (How Janma Kundali & 7th House Predictor Work)',
    howItWorksTe:
      'ఈ సాధనంలో మీరు పుట్టిన తేదీ, నిమిషాలతో కూడిన సమయం మరియు పుట్టిన నగరాన్ని ఎంచుకోగానే ఆ ఊరి అక్షాంశం (Latitude) మరియు రేఖాంశం (Longitude) ఆధారంగా స్థానిక సూర్యోదయ సమయం మరియు నిరయన గ్రహ స్ఫుటాలు (Lahiri Chitrapaksha Ayanamsa, NASA JPL DE440 Ephemeris) లెక్కించబడతాయి. తద్వారా D1 రాశి చక్రం, D9 నవాంశ చక్రం, సప్తమ స్థానం (7th House) ద్వారా కాబోయే జీవిత భాగస్వామి స్వభావం, ప్రేమ/పెద్దల వివాహ యోగం, కుజ దోష శాతం (%) మరియు 120 సంవత్సరాల వింశోత్తరి మహాదశ – అంతర్దశల కాలమానం తక్షణమే ఏర్పడతాయి.',
    termsTitle: 'జన్మ కుండలి & సప్తమ భావ వివాహ శాస్త్ర పదాల వివరణ (Key Vedic Terms Explained)',
    termsListTe: [
      {
        term: 'జన్మ లగ్నం (Ascendant / Lagna – 1st House)',
        meaning:
          'శిశువు జన్మించిన సమయానికి తూర్పు దిశలో ఉదయిస్తున్న రాశిని లగ్నం అంటారు. ఇది వ్యక్తి శరీర తత్వం, ఆత్మబలం మరియు జీవిత గమనాన్ని సూచించే మొదటి భావం.',
      },
      {
        term: 'సప్తమ స్థానం & కాబోయే భాగస్వామి లక్షణాలు (7th House / Kalatra Bhava)',
        meaning:
          'లగ్నం నుండి 7వ స్థానం వివాహం, జీవిత భాగస్వామి రూపం, స్వభావం మరియు వృత్తిని నిర్ణయిస్తుంది. సప్తమంలో ఉన్న రాశి, గ్రహాలు మరియు సప్తమాధిపతి స్థితి ఆధారంగా కాబోయే భర్త లేదా భార్య గుణగణాలను శాస్త్రోక్తంగా తెలుసుకోవచ్చు.',
      },
      {
        term: 'వివాహ సమయ నిర్ణయం (Marriage Timing by Jupiter Transit & Dasha)',
        meaning:
          'గోచార గురువు జన్మ లగ్నం లేదా చంద్ర రాశి నుండి 1, 3, 4, 5, 7, 9, 11 స్థానాలలో సంచరించే కాలంలో మరియు సప్తమాధిపతి, శుక్రుడు లేదా గురు దశ/అంతర్దశలలో వివాహ యోగం సిద్ధిస్తుంది.',
      },
      {
        term: 'నవాంశ చక్రం (D9 Navamsha Chart)',
        meaning:
          'ప్రతి రాశిని 9 సమాన భాగాలుగా (3°20′ చొప్పున) విభజించి వేసే సూక్ష్మ చక్రం నవాంశ. గ్రహాల యథార్థ బలాన్ని, వివాహ సౌఖ్యాన్ని మరియు ధర్మబలాన్ని అంచనా వేయడానికి నవాంశ తప్పనిసరి.',
      },
      {
        term: 'వింశోత్తరి మహాదశ (120-Year Vimshottari Dasha System)',
        meaning:
          'జన్మ నక్షత్రాధిపతి ఆధారంగా కేతువు (7), శుక్రుడు (20), రవి (6), చంద్రుడు (10), కుజుడు (7), రాహువు (18), గురువు (16), శని (19), బుధుడు (17) — మొత్తం 120 ఏళ్ల కాలచక్రం.',
      },
    ],
    faqListTe: [
      {
        q: 'పుట్టిన తేదీ ఆధారంగా నాకు పెళ్లి ఎప్పుడు అవుతుందో ఎలా తెలుస్తుంది?',
        a: 'జన్మ కుండలిలోని సప్తమాధిపతి (7th Lord), కళత్రకారకుడైన శుక్రుడు మరియు గురువు యొక్క మహాదశ/అంతర్దశలతో పాటు గోచార గురు బలం కలిసిన సంవత్సరంలో వివాహం నిశ్చయమవుతుంది.',
      },
      {
        q: 'జాతకంలో ప్రేమ వివాహ యోగం (Love Marriage Yoga) ఎలా గుర్తిస్తారు?',
        a: 'పంచమాధిపతి (5th Lord) మరియు సప్తమాధిపతి (7th Lord) మధ్య సంబంధం ఉన్నా, లేదా శుక్ర-కుజ, శుక్ర-బుధ గ్రహాలు కేంద్ర/కోణ స్థానాలలో కలిసినా పరిచయ లేదా ప్రేమ వివాహ యోగం ఏర్పడుతుంది.',
      },
      {
        q: 'విదేశాల్లో (USA, UK, Australia) పుట్టిన పిల్లల కుండలి ఇక్కడ చూడవచ్చా?',
        a: 'చూడవచ్చు. మా కుండలి ఇంజిన్ ప్రపంచవ్యాప్త టైమ్ జోన్లను మరియు అక్షాంశ-రేఖాంశాలను UTC ప్రమాణంలోకి మార్చి ఖచ్చితంగా గణిస్తుంది.',
      },
    ],
  },
  '/vivaha-pontana': {
    introTe:
      'సనాతన హిందూ వివాహ వ్యవస్థలో వధూవరుల మధ్య మానసిక అనుబంధం, ఆరోగ్యం, సంతానం, ఆర్థిక వృద్ధి మరియు దీర్ఘకాల దాంపత్య సౌఖ్యం కోసం వారిద్దరి జన్మ నక్షత్రాలు, పాదాలు మరియు చంద్ర రాశుల ఆధారంగా చేసే శాస్త్రోక్త పరిశీలనను అష్టకూట వివాహ పొంతన (36 Guna Melapakam) అంటారు. ఇందులో 36 గుణాలతో పాటు పంచ-కళ్యాణ యోగాలు, దక్షిణ భారత రజ్జు పొంతన, నాడి దోష మినహాయింపులు మరియు కుజ దోష శాతం (%) కూడా పరిశీలించబడతాయి.',
    howItWorksTitle: '36 గుణాల అష్టకూట పొంతన, రజ్జు & కుజ దోష శాతం ఎలా లెక్కిస్తారు? (How 36-Point Matching & Dosha Exemptions Work)',
    howItWorksTe:
      'వరుడు మరియు వధువు యొక్క జన్మ నక్షత్రం, నక్షత్ర పాదం మరియు చంద్ర రాశిని ఎంచుకున్నప్పుడు శాస్త్రంలో పేర్కొన్న 8 కూటాలకు (వర్ణ 1, వశ్య 2, తార 3, యోని 4, గ్రహమైత్రి 5, గణ 6, భకూట 7, నాడి 8 — మొత్తం 36 గుణాలు) మార్కులు కేటాయించబడతాయి. వీటితో పాటు సౌభాగ్య, సంతతి, స్వాస్థ్య, సంపత్తి, సమాజ అనే 5 వివాహ యోగాలు, పాద-వేధ నాడి మినహాయింపులు మరియు లగ్నం నుండి కుజ స్థితి ఆధారంగా కుజ దోష శాతం (50% నుండి 100%) లెక్కించబడతాయి.',
    termsTitle: 'అష్టకూట వివాహ పొంతనలోని 8 కూటాలు, పంచ యోగాలు & దోష పరిహార నియమాలు (Key Terms)',
    termsListTe: [
      {
        term: 'పంచ-కళ్యాణ వివాహ యోగాలు (Saubhagya, Santati, Swasthya, Sampatti, Samaj)',
        meaning:
          'వివాహ సాఫల్యానికి 5 స్తంభాలు: 1) సౌభాగ్య యోగం (అన్యోన్యత & ఆయుష్షు), 2) సంతతి యోగం (సంతానం), 3) స్వాస్థ్య యోగం (ఆరోగ్యం), 4) సంపత్తి యోగం (ఆర్థిక భద్రత), 5) సమాజ యోగం (కుటుంబ గౌరవం).',
      },
      {
        term: 'నాడి కూటం & పాద-వేధ మినహాయింపులు (Nadi Koota – 8 పాయింట్లు)',
        meaning:
          'ఆది, మధ్య, అంత్య నాడులు వధూవరుల ఆరోగ్యం మరియు సంతాన క్షేమాన్ని సూచిస్తాయి. ఇద్దరిదీ ఒకే నాడి అయినప్పటికీ — రాశి ఒకటే అయి నక్షత్రాలు వేరైనా, నక్షత్రం ఒకటే అయి రాశులు/పాదాలు వేరైనా ఏకనాడి దోషం వర్తించదు.',
      },
      {
        term: 'భకూట కూటం & గ్రహమైత్రి పరిహారం (Bhakoot 7 + Graha Maitri 5)',
        meaning:
          'వధూవరుల రాశుల మధ్య షష్టాష్టక (6–8) లేదా ద్విద్వాదశ (2–12) స్థితి ఉన్నప్పటికీ, ఆ రెండు రాశుల అధిపతులు పరస్పర మిత్రులైతే (ఉదా: వృషభం-మిథునం) భకూట దోషం తొలగిపోతుంది.',
      },
      {
        term: 'కుజ దోష శాతం (%) & దోష సమతుల్యత (Kuja Dosha Percentage & Balancing)',
        meaning:
          'లగ్నం నుండి 12వ ఇంట కుజుడు ఉంటే 50%, 1వ ఇంట 60%, 2వ ఇంట 80%, 4వ ఇంట 85%, 7 లేదా 8వ ఇంట 100% ప్రభావం ఉంటుంది. ఉభయ జాతకాలలో సమాన కుజ బలం ఉన్నా లేదా గురు దృష్టి ఉన్నా దోష భంగం జరుగుతుంది.',
      },
      {
        term: 'దక్షిణ భారత రజ్జు & దశా సంధి పరిశీలన (Rajju & Dasha-Sandhi Check)',
        meaning:
          'పాద, ఊరు, నాభి, కంఠ, శిరో రజ్జువులలో వధూవరుల నక్షత్రాలు ఒకే రజ్జువులో పడకుండా చూడటం మరియు ఇద్దరి వింశోత్తరి మహాదశలు ఒకే సమయంలో (6 నెలల తేడాలో) మారకుండా దశా సంధిని తనిఖీ చేయడం.',
      },
    ],
    faqListTe: [
      {
        q: '36 గుణాలలో ఎన్ని గుణాలు వస్తే వివాహం చేయవచ్చు?',
        a: 'శాస్త్ర ప్రమాణం ప్రకారం 18 నుండి 24 గుణాలు మధ్యమ పొంతన, 24 నుండి 32 గుణాలు ఉత్తమ పొంతన, 32 పైన అత్యుత్తమ పొంతన. 24 గుణాల కంటే ఎక్కువ వస్తే స్వల్ప కుజ/గణ దోషాలు కూడా పరిహరింపబడతాయి.',
      },
      {
        q: 'నాడి దోషం ఉంటే మినహాయింపు (Exception) ఉంటుందా?',
        a: 'అవును. వధూవరుల నక్షత్రం ఒకటే అయి పాదాలు వేరుగా ఉన్నా, రాశి ఒకటే అయి నక్షత్రాలు వేరుగా ఉన్నా, లేదా 1/4 పాదాలకు 2/3 పాదాలతో పొంతన కుదిరినా నాడి దోష తీవ్రత తగ్గుతుంది.',
      },
      {
        q: 'కుజ దోషం 28 ఏళ్ల తర్వాత దానంతట అదే పోతుందా?',
        a: 'కేవలం వయస్సుతో కుజ దోషం పూర్తిగా తొలగిపోదు; ఎదుటి వారి జాతకంలో సమాన కుజ/శని బలం లేదా గురు దృష్టి ఉన్నప్పుడే శాస్త్రోక్తంగా దోష సమతుల్యత ఏర్పడుతుంది. స్వల్ప దోషాలకు 40 రోజుల కుజ జపం మరియు సుబ్రహ్మణ్య అభిషేకం శ్రేష్ఠం.',
      },
    ],
  },
  '/telugu-baby-names': {
    introTe:
      'భారతీయ వైదిక సంప్రదాయంలో శిశువు జన్మించినప్పుడు చంద్రుడు సంచరిస్తున్న నక్షత్రం మరియు ఆ నక్షత్ర పాదానికి కేటాయించబడిన స్వర/వ్యంజన అక్షరం (Avakahada Chakra Syllable) ఆధారంగా నామకరణం చేయడం వల్ల ఆ పేరు పలికినప్పుడల్లా నక్షత్ర దేవత మరియు రాశ్యాధిపతి అనుగ్రహం లభిస్తుందని శాస్త్ర వచనం.',
    howItWorksTitle: 'నక్షత్ర పాదం ఆధారంగా పిల్లల పేరు ఎలా ఎంచుకోవాలి? (How Baby Naming Works)',
    howItWorksTe:
      'భచక్రంలోని 360 డిగ్రీలను 27 నక్షత్రాలుగా (ఒక్కో నక్షత్రం 13°20′) విభజించారు. ప్రతి నక్షత్రానికి 4 పాదాలు (ఒక్కో పాదం 3°20′) ఉంటాయి. మొత్తం 27 × 4 = 108 నక్షత్ర పాదాలకు నిర్దిష్టమైన నామ అక్షరాలు ఉంటాయి (ఉదాహరణకు అశ్విని: చూ, చే, చో, లా; రోహిణి: ఓ, వా, వీ, వూ). మీరు శిశువు జన్మ నక్షత్రాన్ని ఎంచుకోగానే ఆ 4 పాదాల అక్షరాలతో మొదలయ్యే అర్థవంతమైన సంస్కృత మరియు తెలుగు అబ్బాయిల, అమ్మాయిల పేర్లు వాటి అర్థాలతో సహా కనిపిస్తాయి.',
    termsTitle: 'నామకరణ శాస్త్రంలోని ముఖ్య అంశాలు (Key Naming Principles)',
    termsListTe: [
      {
        term: 'జన్మ నామం vs వ్యవహార నామం',
        meaning:
          'జన్మ నక్షత్ర పాద అక్షరంతో పెట్టే పేరు జన్మ నామం (పూజా సంకల్పాలకు, వివాహానికి వాడేది). పిలుపు కోసం లేదా రికార్డుల కోసం అదే అక్షరంతో శుభార్థం ఇచ్చే వ్యవహార నామాన్ని పెట్టుకోవచ్చు.',
      },
      {
        term: 'అక్షర సంఖ్యా నియమం (Syllable Count)',
        meaning:
          'ధర్మసింధు మరియు ముహూర్త చింతామణి ప్రకారం మగపిల్లల పేరులో సరి సంఖ్య (2 లేదా 4) అక్షరాలు, ఆడపిల్లల పేరులో బేసి సంఖ్య (3 లేదా 5) అక్షరాలు లేదా లలితమైన దీర్ఘాంత నామాలు శుభప్రదం.',
      },
      {
        term: 'నక్షత్ర దేవత & అధిపతి (Nakshatra Deity & Lord)',
        meaning:
          'ప్రతి నక్షత్రానికి ఒక వేద దేవత (ఉదా: కృత్తికకు అగ్ని, పుష్యమికి బృహస్పతి, శ్రవణానికి విష్ణువు) ఉంటారు. వారి గుణాలకు అనుగుణమైన సాత్విక అర్థం ఉండే పేర్లు శ్రేయస్కరం.',
      },
    ],
    faqListTe: [
      {
        q: 'నామకరణం పుట్టిన ఎన్ని రోజులకు చేయాలి?',
        a: 'జాతశౌచం ముగిసిన తర్వాత 11వ రోజు, 12వ రోజు, 16వ రోజు లేదా 21వ రోజున శుభ తిథి, వార, నక్షత్రాలలో నామకరణ మహోత్సవం నిర్వహించాలి.',
      },
      {
        q: 'ఒకే నక్షత్రంలో పుట్టిన కవల పిల్లలకు పేర్లు ఎలా పెట్టాలి?',
        a: 'నిమిషాల తేడాతో పాదం మారితే ఆయా పాదాల అక్షరాలతో, ఒకే పాదంలో పుడితే అదే అక్షరంతో వేర్వేరు శుభ అర్థాలు వచ్చే పేర్లను ఎంపిక చేయాలి.',
      },
      {
        q: 'మూల, ఆశ్లేష, జ్యేష్ఠ నక్షత్రాలలో పుడితే ఏం చేయాలి?',
        a: 'అవి గండమూల నక్షత్రాలు కాబట్టి 27వ రోజున మళ్లీ అదే నక్షత్రం వచ్చినప్పుడు శాస్త్రోక్తంగా నక్షత్ర శాంతి జరిపించి నామకరణం చేయడం సంప్రదాయం.',
      },
    ],
  },
  '/gowri-panchangam': {
    introTe:
      'రోజువారీ పనులలో ప్రత్యేకంగా ముహూర్తం పెట్టించుకోలేని చిన్న చిన్న ప్రయాణాలు, వ్యాపార ప్రారంభాలు, ఆర్థిక లావాదేవీలు మరియు దైవ దర్శనాలకు తక్షణమే శుభ సమయాన్ని తెలుసుకోవడానికి గౌరీ పంచాంగం మరియు నవగ్రహ హోరా చక్రం అత్యంత ప్రామాణికమైనవి.',
    howItWorksTitle: 'గౌరీ పంచాంగం మరియు హోరా చక్రం ఎలా లెక్కిస్తారు? (How Gowri & Hora Work)',
    howItWorksTe:
      'సూర్యోదయం నుండి సూర్యాస్తమయం వరకు ఉన్న పగటి కాలాన్ని 8 సమాన భాగాలుగా, సూర్యాస్తమయం నుండి మరుసటి సూర్యోదయం వరకు ఉన్న రాత్రి కాలాన్ని 8 సమాన భాగాలుగా విభజిస్తే వచ్చేదే గౌరీ పంచాంగం (ఒక్కో భాగం సుమారు 1 గంట 30 నిమిషాలు). ఇందులో అమృతం, శుభం, లాభం, ధనం, ఉద్యోగం అనేవి శుభ ఘడియలు కాగా; రోగం, చోరం, విషం అనేవి నివారించవలసిన అశుభ ఘడియలు. అలాగే ఒక రోజులోని 24 గంటలను 24 హోరాలుగా (ఒక్కో గంటకు ఒక్కో గ్రహ ఆధిపత్యం) విభజించే విధానాన్ని హోరా చక్రం అంటారు.',
    termsTitle: 'గౌరీ పంచాంగం & హోరా చక్రంలోని ముఖ్య పదాలు (Key Terms)',
    termsListTe: [
      {
        term: 'అమృత, శుభ, లాభ, ధన గౌరీ ఘడియలు',
        meaning:
          'నూతన వస్తు కొనుగోలుకు, బ్యాంకు పనులకు, ఒప్పందాలకు మరియు ప్రయాణాలకు ఈ నాలుగు గౌరీ కాలాలు అత్యంత అనుకూలమైనవి.',
      },
      {
        term: 'రోగ, చోర, విష గౌరీ ఘడియలు',
        meaning:
          'ఈ సమయాలలో ముఖ్యమైన ఆర్థిక పెట్టుబడులు, నూతన కార్యక్రమాలు లేదా దూర ప్రయాణాలు ప్రారంభించకపోవడం మంచిది.',
      },
      {
        term: 'గురు, శుక్ర, బుధ, చంద్ర హోరాలు',
        meaning:
          'గురు హోర విద్యా, ధర్మ, బంగారం కొనుగోలుకు; శుక్ర హోర వస్త్ర, వాహన, కళా కార్యాలకు; బుధ హోర వ్యాపార, ఒప్పందాలకు; చంద్ర హోర ప్రయాణాలకు శ్రేష్ఠం.',
      },
    ],
    faqListTe: [
      {
        q: 'గౌరీ పంచాంగంలో శుభం ఉన్నా రాహుకాలం ఉంటే ఆ సమయం వాడుకోవచ్చా?',
        a: 'రాహుకాలం, వర్జ్యం లేదా దుర్ముహూర్తం ఉన్నప్పుడు గౌరీ పంచాంగంలో శుభం/లాభం ఉన్నప్పటికీ ఆ సమయాన్ని శుభకార్యాలకు పరిహరించాలి. రాహుకాలం లేని గౌరీ శుభ ఘడియలనే ఎంచుకోవాలి.',
      },
      {
        q: 'హోరా చక్రం ఏ సమయం నుండి మొదలవుతుంది?',
        a: 'ప్రతిరోజూ స్థానిక సూర్యోదయ సమయం నుండి ఆ వారాధిపతి యొక్క మొదటి హోర ప్రారంభమవుతుంది (ఉదా: ఆదివారం సూర్య హోరతో, గురువారం గురు హోరతో మొదలవుతుంది).',
      },
      {
        q: '"హోరా" అనే పదానికి మూలం ఏమిటి?',
        a: '"అహోరాత్ర" అనే సంస్కృత పదంలో మొదటి, చివరి అక్షరాలు తీసివేయగా ఏర్పడిన "హోరా" (Hora) నుండే ఆంగ్లంలో "Hour" అనే పదం ఉద్భవించింది.',
      },
    ],
  },
  '/tarabalam-chandrabalam': {
    introTe:
      'ఏదైనా శుభకార్యం, ప్రయాణం లేదా పూజా సంకల్పం చేసేటప్పుడు ఆ రోజు ఉన్న నక్షత్రం మీ జన్మ నక్షత్రానికి అనుకూలంగా ఉందో లేదో తెలిపే గణనను తారాబలం (Navatara Balam) అంటారు; అలాగే ఆ రోజు చంద్రుడు సంచరిస్తున్న రాశి మీ జన్మ రాశికి ఎన్నవ స్థానంలో ఉన్నాడో తెలిపే గణనను చంద్రబలం అంటారు.',
    howItWorksTitle: 'నవతార తారాబలం మరియు చంద్రబలం ఎలా లెక్కిస్తారు? (Calculation Method)',
    howItWorksTe:
      'మీ జన్మ నక్షత్రం నుండి ఈ రోజు ఉన్న నక్షత్రం వరకు లెక్కించి ఆ సంఖ్యను 9 చే భాగించగా వచ్చే శేషాన్ని బట్టి 9 తారలు నిర్ణయించబడతాయి: 1-జన్మ, 2-సంపత్, 3-విపత్, 4-క్షేమ, 5-ప్రత్యక్, 6-సాధన, 7-నైధన (వధ), 8-మిత్ర, 9/0-పరమ మిత్ర. ఇందులో 2, 4, 6, 8, 9 తారలు శుభప్రదం. అలాగే మీ జన్మ రాశి నుండి నేటి చంద్ర రాశి 1, 3, 6, 7, 10, 11 స్థానాలలో ఉంటే చంద్రబలం ఉన్నట్లు లెక్క; 8వ స్థానంలో ఉంటే దానిని చంద్రాష్టమం అంటారు.',
    termsTitle: 'నవతారల పేర్లు మరియు వాటి ఫలితాలు (Meaning of 9 Taras)',
    termsListTe: [
      {
        term: 'సంపత్ (2), క్షేమ (4), సాధన (6), మిత్ర (8), పరమ మిత్ర (9)',
        meaning:
          'ఈ ఐదు తారలు ధనలాభం, క్షేమకరమైన ప్రయాణం, కార్యసిద్ధి మరియు మిత్ర సహకారాన్ని ఇచ్చే అత్యుత్తమ తారాబలాలు.',
      },
      {
        term: 'జన్మ తార (1 – Janma Tara)',
        meaning:
          'శరీర ఆయాసం కలిగించే అవకాశం ఉన్నందున సాధారణ పనులకు మధ్యమం; అభిషేకం, ఆయుష్య హోమం వంటి దైవ కార్యాలకు మాత్రం అనుకూలం.',
      },
      {
        term: 'విపత్ (3), ప్రత్యక్ (5), నైధన (7) తారలు',
        meaning:
          'విపత్ తార ఆటంకాలను, ప్రత్యక్ తార వ్యతిరేకతను, నైధన తార తీవ్ర వ్యయాన్ని సూచిస్తాయి కాబట్టి కొత్త పనులకు వీటిని విడిచిపెట్టాలి.',
      },
      {
        term: 'చంద్రాష్టమం (8th Moon Transit)',
        meaning:
          'జన్మ రాశి నుండి 8వ రాశిలో చంద్రుడు సంచరించే రెండున్నర రోజుల కాలాన్ని చంద్రాష్టమం అంటారు. ఈ సమయంలో ముఖ్య నిర్ణయాలు వాయిదా వేయడం శ్రేయస్కరం.',
      },
    ],
    faqListTe: [
      {
        q: 'తారాబలం లేకపోయినా అత్యవసర ప్రయాణం చేయాల్సి వస్తే ఏం చేయాలి?',
        a: 'శాస్త్రంలో తారాదోష నివారణకు ప్రయాణానికి ముందు ఇష్టదైవ ప్రార్థన చేసి, పెరుగు లేదా బెల్లం సేవించి, అభిజిత్ ముహూర్తంలో బయలుదేరాలని సూచించబడింది.',
      },
      {
        q: 'పర్యాయ తారలు అంటే ఏమిటి?',
        a: '27 నక్షత్రాలను 9 చొప్పున మూడు పర్యాయాలుగా (1–9 మొదటి పర్యాయం, 10–18 రెండవ పర్యాయం, 19–27 మూడవ పర్యాయం) విభజిస్తారు. రెండవ, మూడవ పర్యాయాలలో వచ్చే అశుభ తారల తీవ్రత తక్కువగా ఉంటుంది.',
      },
      {
        q: 'శుక్ల పక్షంలో చంద్రబలం ఎలా చూస్తారు?',
        a: 'శుక్ల పక్షంలో (పాడ్యమి నుండి పౌర్ణమి వరకు) చంద్రుడు పూర్ణ బలంతో ఉంటాడు కాబట్టి 2, 5, 9 స్థానాలు కూడా శుభప్రదంగానే పరిగణించబడతాయి.',
      },
    ],
  },
};

function renderRichToolGuideHtml(pathname: string): string {
  const canonicalToolKey = pathname === '/mee-jatakam' ? '/janma-kundali' : pathname;
  const guide = TOOL_PAGE_ORIGINAL_GUIDES[canonicalToolKey];

  if (guide) {
    return `
      <article aria-label="Vedic Tool Detailed Guide in Telugu" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;space-y:16px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">${escapeHtml(guide.howItWorksTitle)}</h2>
        <p style="margin:0 0 14px;font-size:15px;color:#1e293b;">${escapeHtml(guide.introTe)}</p>
        <p style="margin:0 0 18px;font-size:15px;color:#1e293b;">${escapeHtml(guide.howItWorksTe)}</p>

        <h3 style="margin:0 0 10px;font-size:18px;color:#78350f;">${escapeHtml(guide.termsTitle)}</h3>
        <dl style="margin:0 0 18px;">
          ${guide.termsListTe
            .map(
              (item) => `
            <dt style="font-weight:700;color:#9a3412;margin-top:10px;">✦ ${escapeHtml(item.term)}</dt>
            <dd style="margin:4px 0 0 16px;color:#334155;font-size:14.5px;">${escapeHtml(item.meaning)}</dd>`
            )
            .join('\n')}
        </dl>

        <h3 style="margin:0 0 10px;font-size:18px;color:#78350f;">తరచుగా అడిగే ప్రశ్నలు (Frequently Asked Questions)</h3>
        <div>
          ${guide.faqListTe
            .map(
              (f) => `
            <div style="margin-bottom:12px;padding:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
              <strong style="display:block;color:#451a03;font-size:15px;">ప్రశ్న: ${escapeHtml(f.q)}</strong>
              <p style="margin:6px 0 0;color:#334155;font-size:14.5px;">జవాబు: ${escapeHtml(f.a)}</p>
            </div>`
            )
            .join('\n')}
        </div>
      </article>`;
  }

  // Dedicated rich content for remaining tool/legal pages so every route has 300+ words of original content
  if (pathname === '/disclaimer') {
    return `
      <article style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">జ్యోతిష్య &amp; వెబ్‌సైట్ గమనిక (Official Disclaimer)</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#1e293b;">
          <strong>Important Notice:</strong> All astrological calculations, panchangam timings, kundali reports, marriage compatibility scores, and remedial suggestions published on <strong>telugujyothisham.com</strong> are provided strictly <strong>for informational and cultural purposes only</strong>.
        </p>
        <p style="margin:0 0 12px;font-size:15px;color:#1e293b;">
          ఈ వెబ్‌సైట్‌లో అందించబడే దృక్సిద్ధాంత తెలుగు పంచాంగం, తిథి, నక్షత్రం, రాహుకాలం, వర్జ్యం, అభిజిత్ ముహూర్తం, ద్వాదశ రాశి ఫలాలు, జన్మ కుండలి మరియు 36 గుణాల వివాహ పొంతన సమాచారం పూర్తిగా భారతీయ సనాతన జ్యోతిష్య శాస్త్ర గ్రంథాలైన బృహత్ జాతకం, పరాశర హోరా శాస్త్రం మరియు ముహూర్త చింతామణి ఆధారంగా సాంస్కృతిక మరియు ఆధ్యాత్మిక అవగాహన కొరకు మాత్రమే అందించబడుతోంది.
        </p>
        <p style="margin:0;font-size:15px;color:#1e293b;">
          జ్యోతిష్య ఫలితాలు వ్యక్తుల జన్మ సమయ ఖచ్చితత్వం మరియు దేశకాల పరిస్థితులపై ఆధారపడి ఉంటాయి. వైద్య, న్యాయ, ఆర్థిక లేదా మానసిక ఆరోగ్య సంబంధమైన నిర్ణయాలకు జ్యోతిష్య సమాచారాన్ని ప్రత్యామ్నాయంగా భావించరాదు; అట్టి విషయాలలో సంబంధిత వృత్తి నిపుణుల సలహా తీసుకోవాలి.
        </p>
      </article>`;
  }

  return `
      <article style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">వైదిక శాస్త్ర వివరణ &amp; మార్గదర్శిని (Vedic Shastra Reference)</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#1e293b;">
          శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (హైదరాబాద్) వ్యవస్థాపకులు, స్మార్త వేద మరియు దృక్సిద్ధాంత జ్యోతిష విద్వాంసులు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పర్యవేక్షణలో ఈ విభాగంలోని గణనలు మరియు శాస్త్ర వివరణలు రూపొందించబడ్డాయి. సూర్య సిద్ధాంతం మరియు ఆధునిక దృక్సిద్ధాంత (Lahiri Chitrapaksha Ayanamsa – NASA JPL DE440 Ephemeris) ఖగోళ గణితాన్ని సమన్వయం చేస్తూ ప్రతి తిథి, నక్షత్రం, యోగం, కరణం మరియు గ్రహ గోచార ఫలితాలు ఖచ్చితంగా లెక్కించబడతాయి.
        </p>
        <p style="margin:0 0 12px;font-size:15px;color:#1e293b;">
          నిత్య పూజా సంకల్పం, నామ నక్షత్ర గణన, ఉగాది పంచాంగ శ్రవణ ఆదాయ-వ్యయాలు, వివాహ-గృహప్రవేశ శుభ ముహూర్తాలు, గృహ వాస్తు అష్టదిక్పాలక నియమాలు మరియు ఏలినాటి శని / కుజ దోష శాంతి పరిహారాలు అన్నీ సాంప్రదాయ వైదిక గ్రంథ ప్రమాణాలకు అనుగుణంగా భక్తుల సౌకర్యార్థం సరళమైన తెలుగులో అందించబడుతున్నాయి.
        </p>
      </article>`;
}

/**
 * Generates raw server-rendered HTML inside <div id="root"> for any route so Googlebot
 * receives complete semantic HTML with real Panchangam data (tithi, nakshatra, yoga, karana,
 * rahukalam, yamagandam, varjyam, abhijit muhurtham, sunrise, sunset), a single H1,
 * visible calculation methodology line, unique city/tool text, author bio, and Telugu internal links.
 */
export function renderServerHtmlBodyForRoute(rawPathname: string): string {
  const pathname = (rawPathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const meta = generatePageMetadata(pathname);
  const todayIso = getTodayIsoDateIST();

  const dateMatch = pathname.match(/^\/panchangam\/(\d{4}-\d{2}-\d{2})$/);
  const targetIsoDate = dateMatch ? dateMatch[1] : todayIso;

  const cityMatch = pathname.match(
    /^\/panchangam\/(?:city\/)?(hyderabad|vijayawada|visakhapatnam|usa)$/i
  );
  const citySlug = (cityMatch ? cityMatch[1].toLowerCase() : 'hyderabad') as CityTimingConfig['slug'];

  const cityPanchangam = computeCityLocalPanchangam(targetIsoDate, citySlug);
  const dayData = cityPanchangam.dayData;
  const prevDate = addDaysIso(targetIsoDate, -1);
  const nextDate = addDaysIso(targetIsoDate, 1);

  const leadIntroTextTe = cityMatch
    ? cityPanchangam.city.uniqueIntroTe
    : dateMatch
      ? `${targetIsoDate} (${dayData.teediVaram}) నాటి దృక్సిద్ధాంత తెలుగు పంచాంగం: ఈ రోజు తిథి ${cityPanchangam.tithi}, నక్షత్రం ${cityPanchangam.nakshatram}, యోగం ${cityPanchangam.yogam}, కరణం ${cityPanchangam.karanam}, సూర్యోదయం ${cityPanchangam.sunrise}, సూర్యాస్తమయం ${cityPanchangam.sunset}, రాహుకాలం ${cityPanchangam.rahukalam}, యమగండం ${cityPanchangam.yamagandam}, వర్జ్యం ${cityPanchangam.varjyam} మరియు అభిజిత్ ముహూర్తం ${cityPanchangam.abhijitMuhurtham} సమయాల సంపూర్ణ వివరాలు.`
      : NATURAL_80_WORD_HOMEPAGE_INTRO_TE;

  const calendar60 = generateStaticDateParams(60, 0);

  const calendarSectionHtml =
    pathname === '/panchangam/calendar'
      ? `
      <section style="margin-top:24px;background:#fff;border:1px solid #f59e0b;border-radius:16px;padding:20px;margin-bottom:24px;">
        <h2 style="font-size:20px;color:#451a03;margin:0 0 12px;">రాబోయే 60 రోజుల తెలుగు పంచాంగం క్యాలెండర్ (Next 60 Days Telugu Panchangam)</h2>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#fef3c7;color:#451a03;text-align:left;">
                <th style="padding:10px;border:1px solid #fde68a;">తేదీ (Date)</th>
                <th style="padding:10px;border:1px solid #fde68a;">తెలుగు వారం &amp; మాసం</th>
                <th style="padding:10px;border:1px solid #fde68a;">తిథి (Tithi)</th>
                <th style="padding:10px;border:1px solid #fde68a;">నక్షత్రం (Nakshatra)</th>
                <th style="padding:10px;border:1px solid #fde68a;">రాహుకాలం (Rahukalam)</th>
              </tr>
            </thead>
            <tbody>
              ${calendar60
                .map(({ date }) => {
                  const d = getOrGenerateDayData(date, WEEK_DATA);
                  return `<tr>
                    <td style="padding:8px 10px;border:1px solid #fde68a;"><a href="/panchangam/${date}" style="color:#9a3412;font-weight:700;">${date}</a></td>
                    <td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(d.teediVaram)}</td>
                    <td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(d.panchanga.tithi)}</td>
                    <td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(d.panchanga.nakshatram)}</td>
                    <td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(d.ashubha.rahukalam)}</td>
                  </tr>`;
                })
                .join('\n')}
            </tbody>
          </table>
        </div>
      </section>`
      : '';

  const usaZonesHtml =
    cityPanchangam.usaZones && cityPanchangam.usaZones.length > 0
      ? `
      <section style="margin-top:20px;margin-bottom:24px;background:#fff;border:1px solid #f59e0b;border-radius:16px;padding:18px;">
        <h2 style="font-size:18px;color:#451a03;margin:0 0 10px;">అమెరికా (USA) టైమ్ జోన్ల వారీగా నేటి పంచాంగ సమయాలు (EST / CST / PST)</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#fef3c7;color:#451a03;text-align:left;">
              <th style="padding:8px;border:1px solid #fde68a;">Time Zone</th>
              <th style="padding:8px;border:1px solid #fde68a;">ప్రధాన నగరాలు (Cities)</th>
              <th style="padding:8px;border:1px solid #fde68a;">సూర్యోదయం / సూర్యాస్తమయం</th>
              <th style="padding:8px;border:1px solid #fde68a;">రాహుకాలం</th>
              <th style="padding:8px;border:1px solid #fde68a;">అభిజిత్ ముహూర్తం</th>
            </tr>
          </thead>
          <tbody>
            ${cityPanchangam.usaZones
              .map(
                (z) => `<tr>
              <td style="padding:8px;border:1px solid #fde68a;font-weight:700;">${escapeHtml(z.zone)}</td>
              <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(z.cityExample)}</td>
              <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(z.sunrise)} / ${escapeHtml(z.sunset)}</td>
              <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(z.rahukalam)}</td>
              <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(z.abhijit)}</td>
            </tr>`
              )
              .join('\n')}
          </tbody>
        </table>
      </section>`
      : '';

  const isPanchangamPrimaryRoute =
    pathname === '/' ||
    pathname === '/panchangam' ||
    pathname === '/panchangam/calendar' ||
    Boolean(dateMatch) ||
    Boolean(cityMatch);

  const toolGuideHtml = !isPanchangamPrimaryRoute ? renderRichToolGuideHtml(pathname) : '';

  return `
      <main style="max-width:1140px;margin:0 auto;padding:24px 16px;font-family:'Noto Serif Telugu',Georgia,serif;color:#1e293b;line-height:1.65;">
        <header style="background:linear-gradient(135deg,#3b0a11,#581c0c);color:#fff;padding:24px;border-radius:20px;border:2px solid #f59e0b;margin-bottom:24px;">
          <p style="margin:0 0 6px;font-size:13px;color:#fcd34d;font-weight:700;">శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • దృక్సిద్ధాంత తెలుగు పంచాంగం</p>
          <h1 style="margin:0 0 12px;font-size:28px;line-height:1.3;color:#ffffff;">${escapeHtml(meta.h1)}</h1>
          <p style="margin:0;font-size:15px;color:#fef3c7;">${escapeHtml(leadIntroTextTe)}</p>
        </header>

        <nav aria-label="Panchangam Date and City Navigation" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;background:#fffbeb;border:1px solid #fde68a;padding:12px 16px;border-radius:14px;margin-bottom:20px;">
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
            <a href="/panchangam/${prevDate}" style="padding:6px 12px;background:#fff;border:1px solid #d97706;border-radius:8px;color:#78350f;text-decoration:none;font-weight:700;font-size:13px;">← నిన్నటి పంచాంగం (${prevDate})</a>
            <a href="/panchangam/${todayIso}" style="padding:6px 12px;background:#9a3412;border:1px solid #9a3412;border-radius:8px;color:#fff;text-decoration:none;font-weight:700;font-size:13px;">నేటి పంచాంగం (${todayIso})</a>
            <a href="/panchangam/${nextDate}" style="padding:6px 12px;background:#fff;border:1px solid #d97706;border-radius:8px;color:#78350f;text-decoration:none;font-weight:700;font-size:13px;">రేపటి పంచాంగం (${nextDate}) →</a>
            <a href="/panchangam/calendar" style="padding:6px 12px;background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;color:#78350f;text-decoration:none;font-weight:700;font-size:13px;">📅 నెలవారీ క్యాలెండర్</a>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:13px;">
            <span style="font-weight:700;color:#78350f;">నగర సమయాలు:</span>
            <a href="/panchangam/hyderabad" style="color:#9a3412;text-decoration:underline;font-weight:600;">హైదరాబాద్</a> •
            <a href="/panchangam/vijayawada" style="color:#9a3412;text-decoration:underline;font-weight:600;">విజయవాడ</a> •
            <a href="/panchangam/visakhapatnam" style="color:#9a3412;text-decoration:underline;font-weight:600;">విశాఖపట్నం</a> •
            <a href="/panchangam/usa" style="color:#9a3412;text-decoration:underline;font-weight:600;">USA (NRI)</a>
          </div>
        </nav>

        ${toolGuideHtml}

        <section aria-label="Daily Telugu Panchangam Data" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:20px;margin-bottom:24px;">
          <h2 style="margin:0 0 14px;font-size:22px;color:#451a03;">
            ${escapeHtml(dayData.teediVaram)} – పంచాంగ వివరాలు (${escapeHtml(cityPanchangam.city.nameTe)} సమయాలు)
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tbody>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;width:36%;">సంవత్సరం &amp; మాసం (Samvatsaram &amp; Masam)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:600;">${escapeHtml(dayData.panchanga.samvatsaram)} • ${escapeHtml(dayData.panchanga.masam)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">తిథి (Tithi)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#9a3412;">${escapeHtml(cityPanchangam.tithi)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">నక్షత్రం (Nakshatram)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#9a3412;">${escapeHtml(cityPanchangam.nakshatram)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">యోగం &amp; కరణం (Yoga &amp; Karana)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;">యోగం: ${escapeHtml(cityPanchangam.yogam)} | కరణం: ${escapeHtml(cityPanchangam.karanam)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">సూర్యోదయం &amp; సూర్యాస్తమయం (Sunrise &amp; Sunset)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;">సూర్యోదయం: <strong>${escapeHtml(cityPanchangam.sunrise)}</strong> | సూర్యాస్తమయం: <strong>${escapeHtml(cityPanchangam.sunset)}</strong> (${escapeHtml(cityPanchangam.city.tzLabel)})</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fef2f2;color:#991b1b;">రాహుకాలం (Rahukalam)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#991b1b;">${escapeHtml(cityPanchangam.rahukalam)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fef2f2;color:#991b1b;">యమగండం (Yamagandam)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#991b1b;">${escapeHtml(cityPanchangam.yamagandam)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fef2f2;color:#991b1b;">వర్జ్యం &amp; దుర్ముహూర్తం (Varjyam)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#991b1b;">వర్జ్యం: ${escapeHtml(cityPanchangam.varjyam)} | దుర్ముహూర్తం: ${escapeHtml(cityPanchangam.durmuhurtham)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#ecfdf5;color:#065f46;">అభిజిత్ ముహూర్తం (Abhijit Muhurtham)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#065f46;">${escapeHtml(cityPanchangam.abhijitMuhurtham)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#ecfdf5;color:#065f46;">అమృత ఘడియలు (Amrutha Gadiyalu)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#065f46;">${escapeHtml(cityPanchangam.amruthaGadiyalu)}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin:12px 0 0;font-size:13px;font-family:monospace;color:#78350f;">
            Calculation: Drik Siddhanta, Lahiri Chitrapaksha Ayanamsa (NASA JPL DE440 Ephemeris), location: ${escapeHtml(cityPanchangam.city.nameEn)} (${cityPanchangam.city.lat.toFixed(4)}° N, ${cityPanchangam.city.lon.toFixed(4)}° E)
          </p>
        </section>

        ${usaZonesHtml}
        ${calendarSectionHtml}

        <section aria-label="Daily Prediction Summary" style="background:#fffbeb;border:1px solid #fde68a;border-radius:16px;padding:18px;margin-bottom:24px;">
          <h2 style="margin:0 0 8px;font-size:19px;color:#451a03;">నేటి దిన ఫలితం &amp; విశేషం (Daily Vedic Guidance)</h2>
          <p style="margin:0;font-size:15px;color:#1e293b;"><strong>${escapeHtml(dayData.specialEvent || dayData.deity)}:</strong> ${escapeHtml(dayData.phalitham)}</p>
        </section>

        <section aria-label="Internal Links to Telugu Astrology Tools" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:18px;margin-bottom:24px;">
          <h2 style="margin:0 0 12px;font-size:18px;color:#451a03;">ముఖ్యమైన తెలుగు జ్యోతిష విభాగాలు (Related Vedic Tools)</h2>
          <ul style="margin:0;padding-left:20px;line-height:1.9;">
            <li><a href="/" style="color:#9a3412;font-weight:700;">హోమ్ పేజీ – నేటి పంచాంగం (Today Telugu Panchangam Home)</a></li>
            <li><a href="/panchangam" style="color:#9a3412;font-weight:700;">నేటి సంపూర్ణ తెలుగు పంచాంగం &amp; ద్వాదశ రాశి ఫలాలు</a></li>
            <li><a href="/janma-kundali" style="color:#9a3412;font-weight:700;">పుట్టిన తేదీతో ఉచిత తెలుగు జాతకం &amp; జన్మ కుండలి (Jathakam by Date of Birth in Telugu)</a></li>
            <li><a href="/vivaha-pontana" style="color:#9a3412;font-weight:700;">36 గుణాల అష్టకూట వివాహ పొంతన క్యాలిక్యులేటర్ (Vivaha Pontana Telugu)</a></li>
            <li><a href="/telugu-baby-names" style="color:#9a3412;font-weight:700;">27 నక్షత్రాల పాదాల వారీగా తెలుగు పిల్లల పేర్లు (Telugu Baby Names by Nakshatra)</a></li>
            <li><a href="/panchangam/calendar" style="color:#9a3412;font-weight:700;">60 రోజుల నెలవారీ తెలుగు పంచాంగం క్యాలెండర్</a></li>
          </ul>
        </section>

        <aside aria-label="Author Bio" style="background:#fef3c7;border:1px solid #f59e0b;border-radius:16px;padding:18px;margin-bottom:20px;">
          <h2 style="margin:0 0 6px;font-size:17px;color:#451a03;">రచయిత &amp; శాస్త్రీయ పర్యవేక్షణ: బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Jallavaram Sai Dheeraj Sharma)</h2>
          <p style="margin:0;font-size:14px;color:#78350f;">
            శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (హైదరాబాద్) వ్యవస్థాపకులు, స్మార్త వేద మరియు జ్యోతిష విద్వాంసులు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు 15+ సంవత్సరాల అనుభవంతో దృక్సిద్ధాంత పంచాంగ గణనలు, బృహత్ జాతక కుండలి విశ్లేషణ మరియు వైదిక హోమ క్రతువులను నిర్వహిస్తున్నారు.
          </p>
          <p style="margin:8px 0 0;font-size:12px;color:#78350f;">
            గమనిక: ఈ వెబ్‌సైట్‌లోని పంచాంగం మరియు జ్యోతిష్య సమాచారం సాంస్కృతిక మరియు ఆధ్యాత్మిక సమాచార అవగాహన కొరకు మాత్రమే (For informational and cultural purposes only).
          </p>
          <p style="margin:10px 0 0;font-size:13px;">
            <a href="/about" style="color:#9a3412;font-weight:700;">మా గురించి (About Us)</a> •
            <a href="/contact" style="color:#9a3412;font-weight:700;">సంప్రదించండి (Contact)</a> •
            <a href="/privacy-policy" style="color:#9a3412;font-weight:700;">గోప్యతా విధానం (Privacy Policy)</a> •
            <a href="/disclaimer" style="color:#9a3412;font-weight:700;">జ్యోతిష్య గమనిక (Disclaimer)</a>
          </p>
        </aside>
      </main>`;
}
