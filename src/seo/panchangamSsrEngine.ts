import * as Astronomy from 'astronomy-engine';
import { WEEK_DATA } from '../data/panchangamData';
import { DayData } from '../types/panchangam';
import {
  getOrGenerateDayData,
  getSiderealMoonLongitude,
  norm360,
} from '../utils/astronomyPanchangam';
import {
  RASHI_LIST,
  RashiSlug,
  computeGocharaForRashi,
  findRashiBySlug,
} from '../utils/gocharaEngine';
import { DAILY_SUBHASHITHALU } from '../components/DailySubhashithamCard';
import {
  DWADASA_RASHI_VEDIC_ENCYCLOPEDIA,
  LUNAR_AND_SHANI_MENTAL_GUIDES,
} from '../data/dwadasaRashiVedicEncyclopedia';
import { VEDIC_CLASSICAL_ARTICLES } from '../data/vedicArticlesData';
import { getDailyRashiFortunes } from '../utils/panchangaLogic';
import {
  generate12MonthVratasAndFestivals,
  computeRatnaRudrakshaAndRemedyAdvisor,
} from '../utils/vrataCalendarAndRatnaEngine';
import {
  computeInstantPrashna,
  PRASHNA_TOPICS,
} from '../utils/kpAndPrashnaEngine';
import {
  NAKSHATRA_SEO_PROFILES,
  findNakshatraBySlug,
} from '../data/nakshatraSeoProfiles';

export const SITE_URL = 'https://www.telugujyothisham.com';
export const ISR_REVALIDATE_SECONDS = 86400;

export interface CityTimingConfig {
  slug:
    | 'hyderabad'
    | 'vijayawada'
    | 'visakhapatnam'
    | 'usa'
    | 'tirupati'
    | 'warangal'
    | 'guntur'
    | 'rajahmundry'
    | 'kakinada'
    | 'nellore'
    | 'kurnool'
    | 'bengaluru'
    | 'chennai';
  nameTe: string;
  nameEn: string;
  stateOrRegionTe: string;
  stateOrRegionEn: string;
  lat: number;
  lon: number;
  tzOffsetHours: number;
  tzLabel: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
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
    tzLabel: 'IST',
    primaryKeyword: 'హైదరాబాద్ పంచాంగం',
    secondaryKeywords: [
      'hyderabad panchangam today',
      'హైదరాబాద్ రాహుకాలం',
      'హైదరాబాద్ సూర్యోదయం',
      'astrologer hyderabad',
      'astrologer hyderabad near me',
      'hyderabad astrologer telugu',
      'best astrologer hyderabad',
      'good astrologer hyderabad',
      'famous astrologer hyderabad',
      'best astrologer hyderabad near me',
      'best astrologer hyderabad kukatpally',
      'best astrologer in hyderabad online',
      'best astrologer in hyderabad for marriage',
      'best astrologer in hyderabad telugu',
      'best vedic astrologer in hyderabad',
      'genuine astrologer in hyderabad',
      'best astrologer in kphb hyderabad',
      'best astrologer in miyapur hyderabad',
      'astrologer in hyderabad gachibowli',
      'astrologer in kondapur hyderabad',
    ],
    uniqueIntroTe:
      'హైదరాబాద్ పంచాంగం (hyderabad panchangam today): దక్కన్ పీఠభూమిలో సముద్ర మట్టానికి సుమారు 540 మీటర్ల ఎత్తులో ఉన్న హైదరాబాద్ నగర భౌగోళిక రేఖాంశం (78.4867° E) ఆధారంగా నేటి సూర్యోదయ మరియు సూర్యాస్తమయ ప్రమాణాలు గణించబడ్డాయి. భారత ప్రామాణిక కాలమాన రేఖకు (82.5° E) పశ్చిమంగా ఉండటం వల్ల కోస్తా ఆంధ్ర నగరాలతో పోలిస్తే హైదరాబాద్‌లో సూర్యోదయం సుమారు 16 నుండి 18 నిమిషాలు ఆలస్యంగా జరుగుతుంది. అందువల్ల ఇక్కడి భక్తులకు రాహుకాలం, యమగండం, గుళిక కాలం, అభిజిత్ ముహూర్తం మరియు వర్జ్య ఘడియలు హైదరాబాద్ స్థానిక సూర్యోదయ స్ఫుటంతో ప్రత్యేకంగా లెక్కించబడ్డాయి.',
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
    tzLabel: 'IST',
    primaryKeyword: 'విజయవాడ పంచాంగం',
    secondaryKeywords: ['vijayawada panchangam today', 'విజయవాడ సూర్యోదయం', 'విజయవాడ రాహుకాలం'],
    uniqueIntroTe:
      'విజయవాడ పంచాంగం (vijayawada panchangam today): పవిత్ర కృష్ణా నదీ తీరాన ఇంద్రకీలాద్రి క్షేత్ర సాన్నిధ్యంలో ఉన్న విజయవాడ మరియు అమరావతి రాజధాని ప్రాంతం (16.5062° N, 80.6480° E) తూర్పు తీరానికి చేరువగా ఉండటం చేత హైదరాబాద్ కంటే సుమారు 9 నిమిషాలు ముందుగానే సూర్యోదయాన్ని చూస్తుంది. దృక్సిద్ధాంత గణిత సూత్రాల ప్రకారం అహోరాత్ర ప్రమాణం (పగటి నిడివి) మారినప్పుడు అష్టమ భాగాలైన రాహుకాలం, యమగండం, గుళిక కాలం మరియు పగటి 8వ ముహూర్తమైన అభిజిత్ సమయాలు కూడా మారుతాయి. కృష్ణా, గుంటూరు జిల్లాల భక్తుల నిత్య పూజా సంకల్పం కోసం ఈ స్థానిక సమయాలు రూపొందించబడ్డాయి.',
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
    tzLabel: 'IST',
    primaryKeyword: 'విశాఖపట్నం పంచాంగం',
    secondaryKeywords: ['visakhapatnam panchangam today', 'విశాఖపట్నం సూర్యోదయం', 'ఉత్తరాంధ్ర పంచాంగం'],
    uniqueIntroTe:
      'విశాఖపట్నం పంచాంగం (visakhapatnam panchangam today): తూర్పు కనుమలు మరియు బంగాళాఖాత తీరాన ఉన్న విశాఖపట్నం (17.6868° N, 83.2185° E) భారత ప్రామాణిక రేఖాంశమైన 82.5° E కంటే తూర్పున ఉన్న ఏకైక ప్రధాన తెలుగు మహా నగరం. ఈ కారణంగా తెలుగు రాష్ట్రాలలో అందరికంటే ముందుగా సూర్యోదయం విశాఖపట్నం, విజయనగరం మరియు శ్రీకాకుళం ఉత్తరాంధ్ర ప్రాంతాలలోనే సంభవిస్తుంది. హైదరాబాద్ సమయాలతో పోలిస్తే విశాఖపట్నంలో సూర్యోదయం మరియు రాహుకాల ప్రారంభం దాదాపు 19 నిమిషాలు ముందుగా ఉంటాయి కాబట్టి ఉత్తరాంధ్ర భక్తులు ఈ స్థానిక దృక్సిద్ధాంత పంచాంగాన్ని అనుసరించాలి.',
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
    tzLabel: 'CST/EST/PST (IST reference)',
    primaryKeyword: 'telugu panchangam usa',
    secondaryKeywords: ['NRI panchangam', 'USA telugu calendar', 'అమెరికా తెలుగు పంచాంగం'],
    uniqueIntroTe:
      'అమెరికా తెలుగు పంచాంగం (telugu panchangam usa, NRI panchangam & USA telugu calendar): ఉత్తర అమెరికాలో నివసిస్తున్న ప్రవాస తెలుగు కుటుంబాలకు భారతదేశ కాలమానాన్ని యథాతథంగా వాడటం శాస్త్ర సమ్మతం కాదు; ఎందుకంటే తిథి మరియు నక్షత్రం అంతర్జాతీయంగా ఒకే క్షణంలో మారినప్పటికీ, సూర్యోదయానికి లెక్కించే రాహుకాలం, యమగండం, గుళిక కాలం, దుర్ముహూర్తం మరియు అభిజిత్ ముహూర్తాలు ఆయా అమెరికా నగరాల స్థానిక సూర్యోదయంపై ఆధారపడి ఉంటాయి. డల్లాస్ (CST), న్యూయార్క్/న్యూజెర్సీ (EST), మరియు బే ఏరియా/శాన్ జోస్ (PST) అక్షాంశ-రేఖాంశాల ప్రకారం NASA JPL DE440 ఎఫెమెరిస్ సహాయంతో గణించిన ఖచ్చితమైన అమెరికా తెలుగు పంచాంగం ఇది.',
  },
  tirupati: {
    slug: 'tirupati',
    nameTe: 'తిరుపతి',
    nameEn: 'Tirupati',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 13.6288,
    lon: 79.4192,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'తిరుపతి పంచాంగం',
    secondaryKeywords: ['tirupati panchangam today', 'తిరుమల రాహుకాలం', 'తిరుపతి సూర్యోదయం'],
    uniqueIntroTe:
      'తిరుపతి & తిరుమల పంచాంగం (tirupati panchangam today): శేషాచల గిరుల సన్నిధానంలో ఉన్న కలియుగ వైకుంఠం తిరుపతి (13.6288° N, 79.4192° E) దక్షిణ కోస్తా-రాయలసీమ సరిహద్దున ఉండటం వలన సూర్యోదయ, సూర్యాస్తమయ నిడివి హైదరాబాద్ కంటే భిన్నంగా ఉంటుంది. శ్రీవారి దర్శనానికి, తిరుమల-తిరుపతి పుణ్యక్షేత్ర యాత్రకు మరియు స్థానిక నిత్య పూజా సంకల్పం కొరకు NASA JPL DE440 దృక్సిద్ధాంత గణితంతో లెక్కించిన నేటి తిరుపతి రాహుకాలం, యమగండం, వర్జ్యం మరియు అభిజిత్ ముహూర్తం వివరములు ఇక్కడ అందించబడ్డాయి.',
  },
  warangal: {
    slug: 'warangal',
    nameTe: 'వరంగల్',
    nameEn: 'Warangal',
    stateOrRegionTe: 'తెలంగాణ, భారత్',
    stateOrRegionEn: 'Telangana, India',
    lat: 17.9689,
    lon: 79.5941,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'వరంగల్ పంచాంగం',
    secondaryKeywords: ['warangal panchangam today', 'వరంగల్ రాహుకాలం', 'హనుమకొండ పంచాంగం'],
    uniqueIntroTe:
      'వరంగల్ & హనుమకొండ పంచాంగం (warangal panchangam today): కాకతీయ వైభవ నగరమైన వరంగల్ (17.9689° N, 79.5941° E) హైదరాబాద్ నగరానికి తూర్పు-ఈశాన్య దిశలో ఉండటం చేత హైదరాబాద్ కంటే సుమారు 4–5 నిమిషాలు ముందుగానే సూర్యోదయాన్ని చూస్తుంది. ఓరుగల్లు, హనుమకొండ, కరీంనగర్ మరియు ఖమ్మం ప్రాంత భక్తుల గృహ పూజలు, శుభకార్యాలు మరియు ముహూర్త నిర్ణయం కొరకు ఖచ్చితమైన వరంగల్ స్థానిక పంచాంగ సమయాలు ఇక్కడ లెక్కించబడ్డాయి.',
  },
  guntur: {
    slug: 'guntur',
    nameTe: 'గుంటూరు',
    nameEn: 'Guntur',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 16.3067,
    lon: 80.4365,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'గుంటూరు పంచాంగం',
    secondaryKeywords: ['guntur panchangam today', 'గుంటూరు రాహుకాలం', 'అమరావతి పంచాంగం'],
    uniqueIntroTe:
      'గుంటూరు & అమరావతి పంచాంగం (guntur panchangam today): గుంటూరు నగర భౌగోళిక స్థానం (16.3067° N, 80.4365° E) ఆధారంగా నేటి సూర్యోదయ మరియు అష్టమ కాల విభాగాలైన రాహుకాలం, యమగండం, గుళిక కాలం మరియు అభిజిత్ ముహూర్తం సమయాలు శాస్త్రోక్తంగా గణించబడ్డాయి.',
  },
  rajahmundry: {
    slug: 'rajahmundry',
    nameTe: 'రాజమండ్రి',
    nameEn: 'Rajahmundry',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 17.0005,
    lon: 81.804,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'రాజమండ్రి పంచాంగం',
    secondaryKeywords: ['rajahmundry panchangam today', 'రాజమహేంద్రవరం రాహుకాలం', 'గోదావరి పంచాంగం'],
    uniqueIntroTe:
      'రాజమండ్రి (రాజమహేంద్రవరం) పంచాంగం (rajahmundry panchangam today): పవిత్ర గోదావరి నదీ తీరాన ఉన్న రాజమండ్రి (17.0005° N, 81.8040° E) భారత ప్రామాణిక కాలమాన రేఖకు అత్యంత చేరువగా ఉండటం వల్ల తూర్పు గోదావరి, కోనసీమ భక్తులకు అత్యంత స్వచ్ఛమైన సూర్యోదయ సమయాలతో నేటి పంచాంగం మరియు నదీ స్నాన సంకల్ప సమయాలు అందించబడుతున్నాయి.',
  },
  kakinada: {
    slug: 'kakinada',
    nameTe: 'కాకినాడ',
    nameEn: 'Kakinada',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 16.9891,
    lon: 82.2475,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'కాకినాడ పంచాంగం',
    secondaryKeywords: ['kakinada panchangam today', 'కాకినాడ రాహుకాలం', 'కాకినాడ సూర్యోదయం'],
    uniqueIntroTe:
      'కాకినాడ పంచాంగం (kakinada panchangam today): బంగాళాఖాత తీర నగరమైన కాకినాడ (16.9891° N, 82.2475° E) భారత ప్రామాణిక 82.5° E రేఖాంశానికి కేవలం 1 నిమిషం తేడాలో ఉండటం చేత IST కాలమానంతో దాదాపు సమానంగా సూర్యోదయం సంభవిస్తుంది. కోనసీమ మరియు కాకినాడ జిల్లాల భక్తుల నిత్య పూజల కోసం స్థానిక పంచాంగ సమయాలు.',
  },
  nellore: {
    slug: 'nellore',
    nameTe: 'నెల్లూరు',
    nameEn: 'Nellore',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 14.4426,
    lon: 79.9865,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'నెల్లూరు పంచాంగం',
    secondaryKeywords: ['nellore panchangam today', 'నెల్లూరు రాహుకాలం', 'నెల్లూరు సూర్యోదయం'],
    uniqueIntroTe:
      'నెల్లూరు (శ్రీ పొట్టి శ్రీరాములు నెల్లూరు) పంచాంగం (nellore panchangam today): పెన్నా నదీ తీర నగరమైన నెల్లూరు (14.4426° N, 79.9865° E) స్థానిక సూర్యోదయం ఆధారంగా లెక్కించబడిన నేటి తిథి, నక్షత్రం, రాహుకాలం, యమగండం మరియు వర్జ్య ఘడియలు.',
  },
  kurnool: {
    slug: 'kurnool',
    nameTe: 'కర్నూలు',
    nameEn: 'Kurnool',
    stateOrRegionTe: 'ఆంధ్రప్రదేశ్, భారత్',
    stateOrRegionEn: 'Andhra Pradesh, India',
    lat: 15.8281,
    lon: 78.0373,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'కర్నూలు పంచాంగం',
    secondaryKeywords: ['kurnool panchangam today', 'కర్నూలు రాహుకాలం', 'రాయలసీమ పంచాంగం'],
    uniqueIntroTe:
      'కర్నూలు & రాయలసీమ పంచాంగం (kurnool panchangam today): తుంగభద్రా తీరంలో ఉన్న కర్నూలు నగరం (15.8281° N, 78.0373° E) కోస్తా జిల్లాలకు పశ్చిమంగా ఉండటం చేత సూర్యోదయం సుమారు 18 నిమిషాలు ఆలస్యంగా జరుగుతుంది. రాయలసీమ మరియు శ్రీశైల క్షేత్ర యాత్రికుల నిత్య సంకల్పం కోసం కర్నూలు స్థానిక పంచాంగం.',
  },
  bengaluru: {
    slug: 'bengaluru',
    nameTe: 'బెంగళూరు',
    nameEn: 'Bengaluru',
    stateOrRegionTe: 'కర్ణాటక, భారత్',
    stateOrRegionEn: 'Karnataka, India',
    lat: 12.9716,
    lon: 77.5946,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'బెంగళూరు తెలుగు పంచాంగం',
    secondaryKeywords: ['bengaluru telugu panchangam today', 'bangalore panchangam telugu', 'బెంగళూరు రాహుకాలం'],
    uniqueIntroTe:
      'బెంగళూరు తెలుగు పంచాంగం (bengaluru telugu panchangam today): దక్షిణ భారతదేశ ఐటీ రాజధాని బెంగళూరు (12.9716° N, 77.5946° E) పశ్చిమంగా 77.59° E వద్ద ఉండటం వలన తెలుగు రాష్ట్రాల కంటే సూర్యోదయం మరియు రాహుకాల సమయాలలో 15–22 నిమిషాల వ్యత్యాసం ఉంటుంది. బెంగళూరులో నివసించే లక్షలాది తెలుగు కుటుంబాల నిత్య పూజా, గృహప్రవేశ మరియు శుభ ముహూర్తాల కోసం ప్రత్యేకించిన దృక్సిద్ధాంత పంచాంగం.',
  },
  chennai: {
    slug: 'chennai',
    nameTe: 'చెన్నై',
    nameEn: 'Chennai',
    stateOrRegionTe: 'తమిళనాడు, భారత్',
    stateOrRegionEn: 'Tamil Nadu, India',
    lat: 13.0827,
    lon: 80.2707,
    tzOffsetHours: 5.5,
    tzLabel: 'IST',
    primaryKeyword: 'చెన్నై తెలుగు పంచాంగం',
    secondaryKeywords: ['chennai telugu panchangam today', 'chennai rahukalam telugu', 'చెన్నై రాహుకాలం'],
    uniqueIntroTe:
      'చెన్నై తెలుగు పంచాంగం (chennai telugu panchangam today): బంగాళాఖాత తీరంలో ఉన్న చెన్నై (13.0827° N, 80.2707° E) నగర అక్షాంశ-రేఖాంశాల ప్రకారం NASA JPL DE440 గణితంతో లెక్కించిన స్థానిక సూర్యోదయం, సూర్యాస్తమయం, రాహుకాలం, యమగండం, గుళిక కాలం మరియు అభిజిత్ ముహూర్తం సమయాలు.',
  },
};

export const SUPPORTED_CITY_SLUGS = Object.keys(SUPPORTED_CITY_CONFIGS) as CityTimingConfig['slug'][];

export function matchCityTimingSlugFromPath(pathname: string): CityTimingConfig['slug'] | null {
  const clean = (pathname || '').toLowerCase().replace(/\/+$/, '');
  const m = clean.match(/^\/(?:panchangam|panchangam\/city|neti-panchangam-in)[/-]([a-z-]+)$/);
  if (!m) return null;
  const candidate = m[1] as CityTimingConfig['slug'];
  return candidate in SUPPORTED_CITY_CONFIGS ? candidate : null;
}

export function matchNakshatraSlugFromPath(pathname: string): string | null {
  const clean = (pathname || '').toLowerCase().replace(/\/+$/, '');
  const m = clean.match(/^\/nakshatra\/([a-z-]+)$/);
  if (!m) return null;
  const found = findNakshatraBySlug(m[1]);
  return found ? found.slug : null;
}

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
  paksham: string;
  masam: string;
  rahukalam: string;
  yamagandam: string;
  gulika: string;
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
  const gulikaOctantByDow: Record<number, number> = {
    0: 6,
    1: 5,
    2: 4,
    3: 3,
    4: 2,
    5: 1,
    6: 0,
  };

  const octLen = dayLen / 8;
  const rahuStart = srMin + (rahuOctantByDow[dow] ?? 7) * octLen;
  const yamaStart = srMin + (yamaOctantByDow[dow] ?? 4) * octLen;
  const gulikaStart = srMin + (gulikaOctantByDow[dow] ?? 6) * octLen;

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
    gulika: `${formatMinutesTo12Hr(gulikaStart)} – ${formatMinutesTo12Hr(gulikaStart + octLen)}`,
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

  const rawMasam = dayData.panchanga.masam || 'కార్తీక మాసం';
  const paksham =
    dayData.panchanga.tithi.includes('శుద్ధ') ||
    dayData.panchanga.tithi.includes('శుక్ల') ||
    dayData.panchanga.tithi.includes('పౌర్ణమి')
      ? 'శుక్ల పక్షం (Shukla Paksha)'
      : 'కృష్ణ / బహుళ పక్షం (Krishna Paksha)';

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
    paksham,
    masam: rawMasam,
    rahukalam: zone.rahukalam,
    yamagandam: zone.yamagandam,
    gulika: zone.gulika,
    varjyam: citySlug === 'hyderabad' ? dayData.ashubha.varjyam || varjyamStr : varjyamStr,
    durmuhurtham: dayData.ashubha.durmuhurtham,
    abhijitMuhurtham: dayData.shubha.abhijit || zone.abhijit,
    amruthaGadiyalu: citySlug === 'hyderabad' ? dayData.shubha.amrutha || amruthaStr : amruthaStr,
    usaZones,
  };
}

/**
 * Returns today's IST date in YYYY-MM-DD format (computed in Asia/Kolkata).
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

const TELUGU_MONTH_NAMES: Record<number, string> = {
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

export function formatIsoToTeluguDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const monthTe = TELUGU_MONTH_NAMES[m || 11] || 'నవంబర్';
  return `${d || 2} ${monthTe} ${y || 2026}`;
}

/**
 * Prebuilds next 60 days and past 7 days (default daysAhead=60, daysBehind=7).
 */
export function generateStaticDateParams(daysAhead = 60, daysBehind = 7): { date: string }[] {
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
  primaryKeyword: string;
  secondaryKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  breadcrumbs: { name: string; item: string }[];
  faqItems?: { q: string; a: string }[];
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
 * Natural ~80-word introduction for Homepage (Zero keyword stuffing, zero locality spam).
 * Contains primary keyword "తెలుగు జ్యోతిషం" & "నేటి పంచాంగం" + Roman version once.
 */
export const NATURAL_80_WORD_HOMEPAGE_INTRO_TE =
  'తెలుగు జ్యోతిషం (Telugu Jyothisham) మరియు నేటి పంచాంగం (today panchangam in telugu) కోసం శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం అధికారిక వెబ్‌సైట్‌కు స్వాగతం. బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పర్యవేక్షణలో దృక్సిద్ధాంత గణిత ఆధారంగా ప్రతిరోజూ ఖచ్చితమైన తిథి, నక్షత్రం, యోగం, కరణం, సూర్యోదయ సూర్యాస్తమయాలు, రాహుకాలం, యమగండం, గుళిక కాలం, వర్జ్యం, అమృత ఘడియలు మరియు అభిజిత్ ముహూర్త సమయాలు ఇక్కడ అందించబడుతున్నాయి. వీటితో పాటు జన్మ కుండలి తెలుగులో, 36 గుణాల వివాహ పొంతన, నక్షత్రం ప్రకారం పిల్లల పేర్లు మరియు గోచార ఫలాలు భక్తులు ఉచితంగా చూసుకోవచ్చు.';

export interface ToolGuideContent {
  primaryKeyword: string;
  secondaryKeywords: string[];
  authorPlaceholderTag: string;
  introTe: string;
  howItWorksTitle: string;
  howItWorksTe: string;
  termsTitle: string;
  termsListTe: { term: string; meaning: string }[];
  faqListTe: { q: string; a: string }[];
}

export const TOOL_PAGE_ORIGINAL_GUIDES: Record<string, ToolGuideContent> = {
  '/panchangam': {
    primaryKeyword: 'నేటి పంచాంగం',
    secondaryKeywords: [
      'neti panchangam',
      'ఈ రోజు పంచాంగం',
      'today panchangam in telugu',
      'ఈ రోజు తిథి',
      'ఈ రోజు నక్షత్రం',
      'రాహుకాలం',
      'యమగండం',
      'వర్జ్యం',
      'అభిజిత్ ముహూర్తం',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_PANCHANGAM_DAILY_INSIGHT}}',
    introTe:
      'నేటి పంచాంగం (neti panchangam / today panchangam in telugu): భారతీయ సనాతన వైదిక సంప్రదాయంలో ప్రతి దినచర్య, పూజా సంకల్పం మరియు శుభకార్య ప్రారంభానికి పంచాంగ శ్రవణం పునాది. తిథి, వార, నక్షత్ర, యోగ, కరణములు అనే ఐదు అంగాల కలయికే పంచాంగం. ఈ రోజు తిథి, ఈ రోజు నక్షత్రం, రాహుకాలం, యమగండం, గుళిక కాలం, వర్జ్యం మరియు అభిజిత్ ముహూర్త సమయాలు హైదరాబాద్ (Asia/Kolkata IST) ప్రమాణంగా దృక్సిద్ధాంత గణితంతో ఇక్కడ ఖచ్చితంగా అందించబడ్డాయి.',
    howItWorksTitle: 'దృక్సిద్ధాంత నేటి పంచాంగం గణన ఎలా పనిచేస్తుంది?',
    howItWorksTe:
      'సూర్య-చంద్రుల నిరయన స్ఫుటాల (Lahiri Chitrapaksha Ayanamsa – NASA JPL DE440 Ephemeris) ఆధారంగా ప్రతిరోజూ సూర్యోదయ సమయానికి ఉన్న తిథి మరియు నక్షత్రం నిర్ణయించబడతాయి. చంద్రుడు సూర్యుని కంటే 12 డిగ్రీలు ముందుకు సాగే కాలాన్ని ఒక తిథి అని, భచక్రంలో 13°20′ ప్రమాణాన్ని ఒక నక్షత్రం అని పిలుస్తారు. స్థానిక సూర్యోదయం నుండి సూర్యాస్తమయం వరకు ఉన్న పగటి కాలాన్ని 8 సమాన భాగాలుగా విభజించి రాహుకాలం, యమగండం మరియు గుళిక కాలాలను గణిస్తారు.',
    termsTitle: 'పంచాంగంలోని ముఖ్య పదాల శాస్త్రీయ వివరణ',
    termsListTe: [
      {
        term: 'తిథి (Tithi – చంద్ర కళా ప్రమాణం)',
        meaning: 'శుక్ల పక్షంలో పాడ్యమి నుండి పౌర్ణమి వరకు 15 తిథులు, కృష్ణ (బహుళ) పక్షంలో పాడ్యమి నుండి అమావాస్య వరకు 15 తిథులు ఉంటాయి. ఇది మానసిక బలాన్ని, పూజా ఫలాన్ని సూచిస్తుంది.',
      },
      {
        term: 'నక్షత్రం (Nakshatram – 27 తారా మండలాలు)',
        meaning: 'అశ్విని నుండి రేవతి వరకు గల 27 నక్షత్రాలలో చంద్రుడు ఆ రోజు సంచరించే నక్షత్రాన్ని దిన నక్షత్రం అంటారు. ప్రయాణాలు, ముహూర్తాలకు తారాబలం దీని ఆధారంగానే చూస్తారు.',
      },
      {
        term: 'యోగం & కరణం (Yoga & Karana)',
        meaning: 'సూర్య-చంద్రుల స్ఫుటాల మొత్తాన్ని బట్టి విష్కంభం నుండి వైధృతి వరకు 27 యోగాలు; తిథిలో సగభాగంగా బవ, బాలువ మొదలైన 11 కరణాలు ఏర్పడతాయి.',
      },
      {
        term: 'రాహుకాలం, యమగండం & వర్జ్యం',
        meaning: 'రోజులో నూతన శుభకార్యాలకు పరిహరించవలసిన అశుభ సమయాలు. అయితే ఇప్పటికే ప్రారంభించిన పనులు, నిత్య పూజలు ఈ సమయాలలో నిరభ్యంతరంగా కొనసాగించవచ్చు.',
      },
      {
        term: 'అభిజిత్ ముహూర్తం & అమృత ఘడియలు',
        meaning: 'పగటి పూట మధ్యాహ్నం సూర్యుడు నడినెత్తిపై ఉండే 8వ ముహూర్తాన్ని అభిజిత్ ముహూర్తం అంటారు (బుధవారం మినహా). ఇది సమస్త శుభకార్యాలకు, ప్రయాణాలకు అత్యుత్తమ సమయం.',
      },
    ],
    faqListTe: [
      {
        q: 'రాహుకాలం అంటే ఏమిటి? రాహుకాలంలో ఏ పనులు చేయకూడదు?',
        a: 'సూర్యోదయం నుండి సూర్యాస్తమయం వరకు ఉన్న పగటి కాలాన్ని 8 భాగాలుగా విభజించినప్పుడు రాహు గ్రహానికి కేటాయించబడిన 1 గంట 30 నిమిషాల కాలాన్ని రాహుకాలం అంటారు. ఈ సమయంలో కొత్త వ్యాపారాలు, వివాహ/గృహప్రవేశ ముహూర్తాలు, శుభ ప్రయాణాలు ప్రారంభించకూడదు; కానీ నిత్య పూజలు, దైవ దర్శనం చేసుకోవచ్చు.',
      },
      {
        q: 'వర్జ్యం అంటే ఏమిటి? వర్జ్యం ఎన్ని నిమిషాలు ఉంటుంది?',
        a: 'ప్రతి నక్షత్ర ప్రమాణంలో (60 ఘడియలలో) నిర్దిష్ట ఘడియల వద్ద ఉండే 4 ఘడియల (సుమారు 1 గంట 36 నిమిషాల) అశుభ కాలాన్ని వర్జ్యం లేదా త్యాజ్యం అంటారు. ఈ సమయంలో శుభకార్య సంకల్పాలు వాయిదా వేయాలి.',
      },
      {
        q: 'అభిజిత్ ముహూర్తం అంటే ఏమిటి?',
        a: 'పగటి ప్రమాణాన్ని 15 ముహూర్తాలుగా విభజించినప్పుడు సరిగ్గా మధ్యాహ్నం వచ్చే 8వ ముహూర్తాన్ని అభిజిత్ ముహూర్తం అంటారు. బుధవారం మినహా మిగిలిన అన్ని రోజులలో అత్యవసర శుభకార్యాలకు, ప్రయాణాలకు ఇది దోషరహితమైన శుభ సమయం.',
      },
      {
        q: 'తిథి నక్షత్రం ఎలా తెలుసుకోవాలి?',
        a: 'మా నేటి పంచాంగం పేజీలో ప్రతిరోజూ ఉదయం సూర్యోదయ సమయానికి ఉన్న తిథి, నక్షత్రం మరియు అవి ముగిసే ఖచ్చితమైన గంటలు-నిమిషాలు దృక్సిద్ధాంత గణితంతో ఇవ్వబడతాయి. క్యాలెండర్‌లో తేదీని ఎంచుకుని ఏ రోజు తిథి, నక్షత్రాన్నైనా తక్షణమే చూడవచ్చు.',
      },
      {
        q: 'అమృత ఘడియలు ఎందుకు శుభప్రదం?',
        a: 'ప్రతి నక్షత్రంలో వర్జ్యం ముగిసిన తర్వాత నిర్దిష్ట విరామంలో వచ్చే 4 ఘడియల (96 నిమిషాల) శుభ కాలాన్ని అమృత ఘడియలు అంటారు. ఈ సమయంలో చేపట్టే పనులు నిర్విఘ్నంగా ఫలిస్తాయని ముహూర్త శాస్త్రం చెబుతోంది.',
      },
    ],
  },
  '/rashi-phalalu': {
    primaryKeyword: 'రాశి ఫలాలు',
    secondaryKeywords: [
      'నేటి రాశి ఫలాలు',
      'rashi phalalu',
      'rasi phalalu',
      'today rashi phalalu in telugu',
      'rashi phalalu today in telugu',
      'ఈ రోజు రాశి ఫలాలు',
      'neti rashi phalalu',
      'daily horoscope in telugu',
      'ద్వాదశ రాశి ఫలాలు',
      'mesha to meena rashi phalalu',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_DAILY_RASHI_PHALALU}}',
    introTe:
      'రాశి ఫలాలు – నేటి రాశి ఫలాలు (Rashi Phalalu Today in Telugu / Rasi Phalalu / Daily Horoscope in Telugu): దృక్సిద్ధాంత గణితం, చంద్రుని నిరయన నక్షత్ర సంచారం, తారాబలం, చంద్రబలం మరియు నవగ్రహ గోచార దృష్టి ఆధారంగా మేషం నుండి మీనం వరకు 12 రాశుల (Mesha, Vrushabha, Mithuna, Karkataka, Simha, Kanya, Tula, Vruschika, Dhanussu, Makara, Kumbha, Meena) నేటి దిన ఫలితాలు ఇక్కడ అందించబడ్డాయి. ప్రతి రాశికి ఉద్యోగం, వ్యాపారం, ఆర్థిక స్థితి, కుటుంబం, ఆరోగ్యం, నేడు చేయవలసిన పని, శుభ సమయం, అదృష్ట సంఖ్య మరియు వైదిక పరిహారాలను తెలుగు మరియు ఇంగ్లీష్ (Telugu & English) భాషలలో చదవండి.',
    howItWorksTitle: 'దృక్సిద్ధాంత రాశి ఫలాలు (Rashi Phalalu) గణన ఎలా పనిచేస్తుంది?',
    howItWorksTe:
      'వేద జ్యోతిషశాస్త్రంలో దిన ఫలితాలు (Daily Rashi Phalalu in Telugu) ప్రధానంగా మీ జన్మ రాశి (Moon Sign) నుండి ఆ రోజు చంద్రుడు సంచరించే స్థానం (చంద్రబలం: 1, 3, 6, 7, 10, 11 స్థానాలు శుభప్రదం) మరియు మీ జన్మ నక్షత్రం నుండి ఆ రోజు నక్షత్రానికి గల తారాబలం ఆధారంగా లెక్కించబడతాయి.',
    termsTitle: 'రాశి ఫలాలలో ముఖ్య జ్యోతిష సూత్రాలు (Key Horoscope Principles)',
    termsListTe: [
      {
        term: 'చంద్రబలం (Chandrabalam – Lunar Transit Strength)',
        meaning: 'జన్మ రాశి నుండి చంద్రుడు 1, 3, 6, 7, 10, 11 స్థానాలలో ఉన్నప్పుడు మానసిక ఉత్సాహం, కార్యసిద్ధి మరియు ధనలాభం కలుగుతాయి.',
      },
      {
        term: 'చంద్రాష్టమం (Chandrashtamam – 8th House Moon)',
        meaning: 'జన్మ రాశి నుండి చంద్రుడు 8వ రాశిలో ఉన్నప్పుడు (చంద్రాష్టమం) కొత్త ఒప్పందాలు, ప్రయాణాలలో ఓర్పు మరియు జాగ్రత్త అవసరం.',
      },
      {
        term: 'గోచార ఫలం (Gochara Phalalu – Planetary Transit Impact)',
        meaning: 'గురు, శని, రాహు-కేతువుల దీర్ఘకాలిక గోచార స్థితికి నేటి చంద్ర సంచారం తోడైనప్పుడు కలిగే తక్షణ దిన ఫలితం.',
      },
    ],
    faqListTe: [
      {
        q: 'ఈ రోజు రాశి ఫలాలు (Today Rashi Phalalu in Telugu) ఎలా చూసుకోవాలి?',
        a: 'ఈ పేజీలో మేషం నుండి మీనం వరకు 12 రాశుల నేటి రాశి ఫలాలు (Rashi Phalalu in Telugu & English) ఇవ్వబడ్డాయి. మీ జన్మ రాశిని లేదా మీ పేరులోని మొదటి అక్షరాన్ని ఎంచుకుని నేటి వృత్తి, ఆర్థిక, కుటుంబ ఫలితాలు, శుభ సమయం మరియు పరిహారం వెంటనే చూసుకోవచ్చు.',
      },
      {
        q: 'రాశి ఫలాలు జన్మ రాశి ప్రకారం చూడాలా లేక పేరు రాశి (Naama Rashi) ప్రకారం చూడాలా?',
        a: 'పుట్టిన తేదీ, సమయం మరియు జన్మ నక్షత్రం తెలిసిన వారు ఖచ్చితంగా జన్మ రాశి (Birth Moon Sign) ప్రకారం చూడాలి. జన్మ వివరాలు తెలియని వారు పిలిచే పేరులోని మొదటి అక్షరం ఆధారంగా వచ్చే నామ రాశి (Name Sign) ప్రకారం చూసుకోవచ్చు.',
      },
      {
        q: 'What is Today Rashi Phalalu (Rasi Phalalu) in Telugu and how is it calculated?',
        a: 'Today Rashi Phalalu (నేటి రాశి ఫలాలు) provides daily Vedic astrology predictions for all 12 zodiac signs (Mesha to Meena) calculated using Drik Siddhanta lunar transit (Gochara Chandrabalam), Nakshatra Tarabalam, and daily planetary aspects (Graha Drishti).',
      },
      {
        q: 'చంద్రాష్టమం (Chandrashtamam) ఉన్న రోజున ఏమి చేయాలి?',
        a: 'మీ రాశికి చంద్రుడు 8వ ఇంట ఉన్న రోజున (చంద్రాష్టమం) ముఖ్యమైన ఆర్థిక నిర్ణయాలు, వాదోపవాదాలు వాయిదా వేసి, శివ పంచాక్షరి మంత్ర జపం లేదా చంద్ర కవచ పారాయణ చేయడం వల్ల మానసిక ప్రశాంతత లభిస్తుంది.',
      },
    ],
  },
  '/janma-kundali': {
    primaryKeyword: 'జన్మ కుండలి తెలుగులో',
    secondaryKeywords: [
      'jathakam by date of birth in telugu',
      'telugu jathakam free',
      'పుట్టిన తేదీ ప్రకారం జాతకం',
      'భావార్థ రత్నాకర 300 రాజయోగాలు',
      'సర్వాష్టకవర్గ షడ్బల జాతకం',
      'ఆయుర్వేద వైద్య జ్యోతిషం',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_JANMA_KUNDALI_INTERPRETATION}}',
    introTe:
      'జన్మ కుండలి తెలుగులో (jathakam by date of birth in telugu & telugu jathakam free): పుట్టిన తేదీ ప్రకారం జాతకం, ఖచ్చితమైన జన్మ సమయం మరియు జన్మస్థలం ఆధారంగా శిశువు జన్మించిన క్షణంలో తూర్పు క్షితిజంలో ఉదయించే రాశిని లగ్నంగా (Ascendant) నిర్ణయించి, నవగ్రహాల స్ఫుటాలను ద్వాదశ భావాలలో నిక్షిప్తం చేసే శాస్త్రీయ చిత్రపటమే జన్మ కుండలి. మా ఉచిత 37-అధ్యాయాల దృక్సిద్ధాంత గణన ద్వారా దక్షిణ/ఉత్తర/తూర్పు భారత చక్రాలు, షోడశవర్గ D1–D60, శ్రీపతి భవ చలిత, సుదర్శన చక్రం, ప్రత్యంతర దశ & డబుల్ ట్రాన్సిట్ తేదీలు, వార్షిక తాజిక వర్షఫల్ (ముద్దా దశ), అష్టోత్తరి & యోగిని దశలు, KP 249 సబ్‌లార్డ్స్, జైమిని చర దశ, జన్మ సమయ సవరణ (BTR Lab), లైవ్ కాస్మిక్ గోచార రాడార్ (Live Sky Wheel & 12-Month Power Graph), మరియు D60 పూర్వజన్మ కర్మ ఫలితాలను ఆఫ్‌లైన్ PWA యాప్ & క్లౌడ్ ఫ్యామిలీ వాల్ట్‌తో తక్షణమే పొందవచ్చు.',
    howItWorksTitle: '37 అధ్యాయాల జన్మ కుండలి తెలుగులో గణన ఎలా పనిచేస్తుంది? (How This Works)',
    howItWorksTe:
      'మీరు పుట్టిన తేదీ, నిమిషాలతో కూడిన సమయం మరియు పుట్టిన నగరాన్ని ఎంచుకోగానే ఆ ప్రాంత అక్షాంశం (Latitude) మరియు రేఖాంశం (Longitude) ఆధారంగా స్థానిక సూర్యోదయం మరియు నిరయన గ్రహ స్ఫుటాలు (Lahiri Chitrapaksha Ayanamsa, NASA JPL DE440 Ephemeris) లెక్కించబడతాయి. తద్వారా జన్మ లగ్నం, అవకహడ చక్రం, సప్తవర్గ D1–D10, KP 249 సబ్‌లార్డ్స్, జైమిని ఇష్టదేవత, భృగు నంది నాడి, సర్వాష్టకవర్గ, షడ్బలం, భావార్థ రత్నాకర 300 రాజయోగాలు, రత్న-రుద్రాక్ష మరియు ఆయుర్వేద త్రిదోష నివేదిక ఏర్పడతాయి.',
    termsTitle: 'జన్మ కుండలిలోని ముఖ్య పదాల వివరణ (Key Terms)',
    termsListTe: [
      {
        term: 'జన్మ లగ్నం, అవకహడ చక్రం & జైమిని ఇష్టదేవత',
        meaning: 'జన్మ సమయానికి తూర్పున ఉదయించే రాశి శరీర తత్వాన్ని, అవకహడ చక్రం గణ-యోని-నాడి-పాయ-నామాక్షరాలను మరియు కారకాంశ (D9) నుండి ఇష్టదైవాన్ని చూపుతాయి.',
      },
      {
        term: '337-బిందు సర్వాష్టకవర్గ, షడ్బలం & సప్తవర్గ D1–D10',
        meaning: 'రాశి (D1), హోరా (D2), ద్రేక్కాణ (D3), చతుర్థాంశ (D4), సప్తాంశ (D7), నవాంశ (D9), దశాంశ (D10) వర్గ బలాలు మరియు 337-బిందు పరాశర ప్రమాణం.',
      },
      {
        term: 'KP 249 కస్ప్ సబ్‌లార్డ్స్ & భృగు నంది నాడి 1-5-9',
        meaning: 'నక్షత్ర నాడీ 249 సబ్‌లార్డ్ (KP-249) 12 భావ కస్ప్ సబ్‌లార్డ్స్ ద్వారా ఉద్యోగ-వివాహ-విదేశీ యోగాల ఖచ్చిత నిర్ధారణ మరియు భృగు నాడి గ్రహ త్రికోణ ఫలితాలు.',
      },
      {
        term: 'రత్న-రుద్రాక్ష పరిహారం & ఆయుర్వేద వైద్య జ్యోతిషం',
        meaning: 'లగ్న యోగకారక గ్రహ రత్నం, ధరించకూడని రత్నాల హెచ్చరిక, ముఖి రుద్రాక్ష, వాత-పిత్త-కఫ త్రిదోష శాతాలు మరియు త్రివిధ రుణ విముక్తి.',
      },
      {
        term: 'వింశోత్తరి మహాదశ & భృగు చక్ర ప్రగతి (120-Year Dasha)',
        meaning: 'జన్మ నక్షత్రాధిపతి నుండి ప్రారంభమయ్యే 9 గ్రహాల 120 సంవత్సరాల జీవిత కాలచక్రం మరియు ఏయే వయస్సులలో ధన-వివాహ-ఉద్యోగ యోగాలు ఫలిస్తాయో తెలిపే కాలమానం.',
      },
    ],
    faqListTe: [
      {
        q: 'జన్మ నక్షత్రం మరియు అవకహడ చక్రం ఎలా తెలుసుకోవాలి?',
        a: 'పుట్టిన తేదీ, ఖచ్చితమైన సమయం మరియు పుట్టిన ఊరును మా జన్మ కుండలి తెలుగులో క్యాలిక్యులేటర్‌లో నమోదు చేయగానే చంద్రుని డిగ్రీల ఆధారంగా జన్మ నక్షత్రం, పాదం, నామాక్షరం, గణం, నాడి, యోని వివరాలు వెంటనే కనిపిస్తాయి.',
      },
      {
        q: 'పుట్టిన తేదీ ప్రకారం జాతకం (Jathakam by Date of Birth in Telugu) ఉచితంగా చూడవచ్చా?',
        a: 'చూడవచ్చు. మా వెబ్‌సైట్‌లో ఎలాంటి రుసుము లేకుండా ఉచితంగా 29 అధ్యాయాల సమగ్ర జాతకం (D1–D10 సప్తవర్గ, KP సబ్‌లార్డ్స్, భృగు నాడి, ఇష్టదేవత, షడ్బలం, 300 రాజయోగాలు, రత్న-రుద్రాక్ష మరియు మహాదశ) తెలుగులో చూసుకోవచ్చు.',
      },
      {
        q: 'KP సబ్‌లార్డ్స్, సప్తవర్గ D1–D10 మరియు అదృష్ట రత్నం జాతకంలో ఎలా తెలుస్తాయి?',
        a: '26, 27, 28, 29 అధ్యాయాలలో భృగు నంది నాడి 1-5-9 సర్క్యూట్లు, D1–D10 వర్గ బలాలు, KP 12 భావ కస్ప్ సబ్‌లార్డ్స్ మరియు లగ్న ఆధారిత రత్న-రుద్రాక్ష సలహాలు స్వయంచాలకంగా గణించబడతాయి.',
      },
      {
        q: 'విదేశాల్లో (USA, UK, Australia) పుట్టిన వారి జన్మ కుండలి ఇక్కడ గణించవచ్చా?',
        a: 'గణించవచ్చు. అంతర్జాతీయ అక్షాంశ-రేఖాంశాలు మరియు టైమ్ జోన్లను UTC ప్రమాణంలోకి మార్చి ఖచ్చితమైన లగ్నాన్ని మా ఇంజిన్ లెక్కిస్తుంది.',
      },
      {
        q: 'రాశి చక్రానికి, నవాంశ మరియు దశాంశ చక్రాలకు తేడా ఏమిటి?',
        a: 'రాశి చక్రం (D1) బాహ్య జీవిత ఘటనలను చూపితే; నవాంశ (D9) గ్రహాల ధర్మ-దాంపత్య బలాన్ని, దశాంశ (D10) ఉద్యోగ-వృత్తి సామర్థ్యాన్ని చూపుతాయి.',
      },
    ],
  },
  '/mee-jatakam': {
    primaryKeyword: 'telugu jathakam pdf',
    secondaryKeywords: [
      'జాతకం pdf',
      'బృహత్ జాతకం',
      'సంపూర్ణ జాతక చక్రం',
      '29 అధ్యాయాల తెలుగు జాతకం pdf',
      'KP సబ్‌లార్డ్స్ & రత్న సలహా pdf',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_BRIHAT_JATAKAM_PDF}}',
    introTe:
      'సంపూర్ణ బృహత్ జాతకం & Telugu Jathakam PDF (జాతకం pdf): మీ పుట్టిన తేదీ, సమయం మరియు ప్రాంతం ఆధారంగా 29 అధ్యాయాలతో కూడిన దృక్సిద్ధాంత రాశి చక్రం, అవకహడ చక్రం, సప్తవర్గ D1–D10, KP 249 సబ్‌లార్డ్స్, భృగు నంది నాడి, జైమిని ఇష్టదేవత, సర్వాష్టకవర్గ, షడ్బలం, భావార్థ రత్నాకర 300 మహారాజ యోగాలు, ఆయుర్వేద వైద్య జ్యోతిషం, అదృష్ట రత్న-రుద్రాక్ష సలహా మరియు 120 ఏళ్ల వింశోత్తరి మహాదశలతో కూడిన తెలుగు జాతకం PDF నివేదికను ఇక్కడ రూపొందించుకోవచ్చు.',
    howItWorksTitle: '29 అధ్యాయాల Telugu Jathakam PDF నివేదిక ఎలా తయారవుతుంది? (How This Works)',
    howItWorksTe:
      'మీ జన్మ వివరాలను నమోదు చేసిన వెంటనే దృక్సిద్ధాంత గణిత సూత్రాలతో అవకహడ చక్రం, గ్రహ స్ఫుటాలు, సప్తవర్గ D1–D10, KP 12 భావ సబ్‌లార్డ్స్, షడ్బల సూచికలు, 337-బిందు సర్వాష్టకవర్గ, భావార్థ రత్నాకర 300 రాజయోగాలు, ఆయుర్వేద త్రిదోష పథ్యాలు, రత్న-రుద్రాక్ష మరియు త్రివిధ రుణ పరిహారాలు గణించబడి PDF గా భద్రపరచుకునేలా సమగ్ర నివేదిక సిద్ధమవుతుంది.',
    termsTitle: 'బృహత్ జాతకం PDF లోని ప్రధాన భాగాలు',
    termsListTe: [
      {
        term: 'పంచాంగ పుట, అవకహడ చక్రం & సప్తవర్గ చక్రాలు (D1–D10)',
        meaning: 'జన్మ నక్షత్ర నామాక్షరాలు, గణ-నాడి-యోని, D1 రాశి, D2 హోరా, D3 ద్రేక్కాణ, D7 సప్తాంశ, D9 నవాంశ మరియు D10 దశాంశ వర్గ బలాలు.',
      },
      {
        term: 'KP సబ్‌లార్డ్స్, జైమిని ఇష్టదేవత, భృగు నాడి & షడ్బలం',
        meaning: 'నక్షత్ర నాడీ 249 (KP-249) 12 భావ కస్ప్ సబ్‌లార్డ్స్, కారకాంశ ఇష్టదేవత, 1-5-9 త్రికోణ నాడి సర్క్యూట్లు మరియు 337-బిందు సర్వాష్టకవర్గ.',
      },
      {
        term: '300 రాజయోగాలు, ఆయుర్వేదం & అదృష్ట రత్న-రుద్రాక్ష సలహా',
        meaning: 'లగ్న యోగకారక ధన సూత్రాలు, వాత-పిత్త-కఫ త్రిదోష ఆరోగ్య మార్గదర్శిని మరియు శాస్త్రోక్త రత్న-రుద్రాక్ష ధారణ.',
      },
    ],
    faqListTe: [
      {
        q: 'Telugu Jathakam PDF ని ఎలా డౌన్‌లోడ్ చేసుకోవాలి?',
        a: 'మీ పుట్టిన తేదీ, సమయం, ఊరు నమోదు చేసి "జాతకం రూపొందించండి" బటన్ నొక్కగానే 29 అధ్యాయాల పూర్తి జాతక నివేదిక వస్తుంది. అక్కడ "Download Jathakam PDF" బటన్ ద్వారా నేరుగా PDF గా సేవ్ చేసుకోవచ్చు.',
      },
      {
        q: 'ఈ జాతకం PDF లో ఎన్ని అధ్యాయాలు మరియు ఎన్ని సంవత్సరాల దశ ఫలితాలు ఉంటాయి?',
        a: 'ఇందులో మొత్తం 29 ప్రామాణిక అధ్యాయాలు (KP Astrology సహా) మరియు పూర్తి 120 సంవత్సరాల వింశోత్తరి మహాదశ-అంతర్దశ తేదీలు ఉంటాయి.',
      },
      {
        q: 'ఇందులో దక్షిణ భారత శైలి రాశి చక్రం ఉంటుందా?',
        a: 'అవును, తెలుగు సంప్రదాయానికి అనుగుణంగా దక్షిణ భారత (South Indian Square Chart) రాశి చక్రం మరియు నవాంశ చక్రం ఉంటాయి.',
      },
      {
        q: 'సప్తమ భావం, వివాహ శైలి మరియు కుజ దోష వివరాలు PDF లో వస్తాయా?',
        a: 'అవును, కాబోయే భాగస్వామి లక్షణాలు, ప్రేమ లేదా పెద్దలు కుదిర్చిన వివాహ సూచన, వివాహ సమయం మరియు కుజ దోష శాతం వివరాలు ప్రత్యేక అధ్యాయాలుగా ఉంటాయి.',
      },
      {
        q: 'నేను నమోదు చేసే పుట్టిన తేదీ వివరాలు సర్వర్‌లో సేవ్ అవుతాయా?',
        a: 'కావు. గోప్యతా విధానం ప్రకారం మీ జన్మ వివరాలు మీ బ్రౌజర్‌లోనే లెక్కించబడతాయి; మీరు స్వయంగా సంప్రదింపుల ఫారమ్ పంపితే తప్ప ఎక్కడా నిల్వ చేయబడవు.',
      },
    ],
  },
  '/sample-jathakam': {
    primaryKeyword: 'నమూనా జాతకం',
    secondaryKeywords: [
      'sample jathakam report pdf',
      'తెలుగు జాతకం నమూనా pdf',
      'telugu horoscope sample report',
      'బృహత్ జాతక నివేదిక pdf',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_SAMPLE_JATHAKAM}}',
    introTe:
      'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం నమూనా బృహత్ జాతక నివేదిక (Sample Telugu Jathakam Report PDF): బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి వైదిక పరాశర సిద్ధాంత గణనతో రూపొందించిన సంపూర్ణ జాతక నమూనా నివేదిక. ఇందులో జనన పంచాంగం, D1 రాశి, D9 నవాంశ, D10 దశమాంశ, D7 సప్తమాంశ చక్రాలు, గ్రహ బలాలు, నీచభంగ రాజయోగం, త్రివిధ కుజదోష విశ్లేషణ, 120 ఏళ్ల వింశోత్తరి దశలు మరియు శాంతి పరిహారాలు ఉంటాయి.',
    howItWorksTitle: 'ఈ నమూనా జాతక నివేదిక ఎలా రూపొందించబడింది? (How This Works)',
    howItWorksTe:
      'హైదరాబాద్‌లో జన్మించిన ప్రముఖ నమూనా జాతకుని వివరాలతో (శ్రీనివాస రావు, 15-ఆగస్టు-1994, ఉదయం 09:30) స్వచ్ఛమైన నాసా JPL ఎఫెమెరిస్ గణితం మరియు లాహిరి అయనాంశతో ఈ సమగ్ర నమూనా తయారుచేయబడింది.',
    termsTitle: 'ఈ నివేదికలోని ముఖ్యాంశాలు (Key Terms)',
    termsListTe: [
      {
        term: 'కార్యనిర్వాహక సంక్షిప్త నివేదిక (Executive Summary)',
        meaning: 'జాతకంలోని టాప్ 5 బలాలు, 3 జాగ్రత్తలు, రాబోయే 12 నెలల గోచార దృక్పథం మరియు ప్రస్తుత మహాదశ-అంతర్దశ సమగ్ర సమాచారం.',
      },
      {
        term: 'గ్రహ స్థానాలు & బలాలు (Planetary Dignities & Strengths)',
        meaning: 'ఉచ్చ, నీచ, స్వక్షేత్ర, మూలత్రికోణ, వర్గోత్తమ, వక్ర మరియు అస్తంగత విశ్లేషణలు డిగ్రీలతో సహా.',
      },
      {
        term: 'త్రివిధ కుజ దోష విశ్లేషణ (Triple Kuja Dosha Check)',
        meaning: 'లగ్నం, చంద్ర లగ్నం మరియు శుక్ర లగ్నాల నుండి సమగ్ర కుజ దోష శాతాల పరిశీలన.',
      },
    ],
    faqListTe: [
      {
        q: 'ఈ నమూనా జాతకం PDF ని డౌన్‌లోడ్ లేదా ప్రింట్ చేసుకోవచ్చా?',
        a: 'అవును, ఈ పేజీలోని "నమూనా PDF డౌన్‌లోడ్ / ప్రింట్ చేయండి" బటన్ ద్వారా పూర్తి లేఅవుట్‌తో వెంటనే డౌన్‌లోడ్ చేసుకోవచ్చు.',
      },
      {
        q: 'నా స్వంత వివరాలతో ఇలాంటి సమగ్ర నివేదిక ఎలా పొందాలి?',
        a: 'మా వెబ్‌సైట్‌లోని "/mee-jatakam" పేజీకి వెళ్లి మీ పుట్టిన తేదీ, సమయం, ఊరు నమోదు చేయడం ద్వారా మీ వ్యక్తిగత సమగ్ర జాతక నివేదికను పొందవచ్చు.',
      },
      {
        q: 'ఈ జాతక నివేదికలో ఇంగ్లీష్ లేదా నార్త్ ఇండియన్ చార్ట్ శైలి ఉంటుందా?',
        a: 'అవును, తెలుగు మరియు ఇంగ్లీష్ ద్విభాషా మోడ్ అలాగే దక్షిణ భారత, ఉత్తర భారత డైమండ్ చక్రాల ఎంపిక ఉంటుంది.',
      },
      {
        q: 'ఈ నివేదికలోని ఫలితాలు ఏ పద్ధతి ప్రకారం గణించబడ్డాయి?',
        a: 'బృహత్ పరాశర హోరా శాస్త్రం, చిత్రపక్ష లాహిరి అయనాంశం మరియు NASA JPL గ్రహ గణితాల ఆధారంగా ఖచ్చితంగా లెక్కించబడ్డాయి.',
      },
    ],
  },
  '/vivaha-pontana': {
    primaryKeyword: 'వివాహ పొంతన 22 పొంతనలు',
    secondaryKeywords: [
      'marriage matching in telugu',
      '22 porutham matching in telugu',
      'pelli pontana',
      'అష్టకూట గుణ మిలనం 36 గుణాలు',
      'రజ్జు నాడీ వేధ దోష పరిహారాలు',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_VIVAHA_PONTANA_VERDICT}}',
    introTe:
      'వివాహ పొంతన (marriage matching in telugu & 22 porutham matching): సనాతన హిందూ వివాహ సంప్రదాయంలో వధూవరుల మధ్య మానసిక అనుబంధం, ఆరోగ్యం, సంతానం, దీర్ఘాయుష్షు మరియు సంసార ఐశ్వర్యం కోసం 36 గుణాల అష్టకూట మిలనంతో పాటు దక్షిణ భారతీయ ప్రాచీన 22 పొంతనల (దిన, గణ, మాహేంద్ర, స్త్రీదీర్ఘ, యోని, రాశి, రాశ్యాధిపతి, వశ్య, రజ్జు, వేధ, నాడీ, వృక్ష, లగ్న, ఆయుల్, లింగ, కేంద్ర, వర్ణ, వాసి, నాట్టు, సేవక, కూడలి, పంచ పక్షి) సమగ్ర గుణమేళనం ఇక్కడ స్వయంచాలకంగా గణించబడుతుంది.',
    howItWorksTitle: '36 గుణాల అష్టకూటం & 22 పొంతనల మహామేళనం ఎలా లెక్కిస్తారు? (How This Works)',
    howItWorksTe:
      'వధువు మరియు వరుడి జన్మ రాశి, జన్మ నక్షత్రం, మరియు పాదాలను ఎంచుకోగానే సాంప్రదాయక 8 కూటాలు (36 గుణాలు) మరియు దక్షిణ భారతీయ 22 ప్రాచీన పొంతనల పట్టిక క్షణాల్లో ప్రత్యక్షమవుతుంది. ఏక రజ్జు దోషం, నాడీ దోషం, భకూట షష్టాష్టక దోషాలకు గల శాస్త్రోక్త మినహాయింపులు (Exceptions) మరియు కుజ దోష శాతాన్ని కూడా ఈ వ్యవస్థ విశ్లేషిస్తుంది.',
    termsTitle: 'వివాహ పొంతనలోని 22 ముఖ్య ప్రమాణాలు (Key 22 Poruthams)',
    termsListTe: [
      {
        term: 'రజ్జు పొంతన (Rajju – మాంగల్య బలం)',
        meaning: 'పాద, కటి, నాభి, కంఠ, శిరో రజ్జువులలో వధూవరుల నక్షత్రాలు వేర్వేరుగా ఉండాలి. ఇది దీర్ఘ సుమంగళీ యోగానికి ప్రధాన మూలస్తంభం.',
      },
      {
        term: 'నాడీ పొంతన (Nadi – త్రిదోష సామ్యం & సంతానం)',
        meaning: 'వాత, పిత్త, కఫ నాడుల సమతుల్యత వల్ల ఆరోగ్యకరమైన, తేజోవంతమైన సంతాన ప్రాప్తి లభిస్తుంది.',
      },
      {
        term: 'దిన & మాహేంద్ర పొంతన (Dina & Mahendra)',
        meaning: 'ఆయురారోగ్యాలు, నిత్య సుఖం, వంశాభివృద్ధి మరియు సుదీర్ఘ కుటుంబ ఐశ్వర్యం.',
      },
      {
        term: 'యోని & వశ్య పొంతన (Yoni & Vasiya)',
        meaning: '14 జంతు యోనుల మధ్య సహజ వైరం లేకుండా పరస్పర దాంపత్య ఆకర్షణ మరియు అంకితభావం.',
      },
      {
        term: 'వృక్ష, ఆయుల్ & పంచ పక్షి పొంతన (Vruksha, Ayul & Pakshi)',
        meaning: 'వంశ వృక్ష విస్తరణ, శతాయుర్దాయ యోగం మరియు సిద్ధుల పంచభూత పంచ పక్షి ప్రాణశక్తి సమన్వయం.',
      },
    ],
    faqListTe: [
      {
        q: 'పెళ్లికి ఎన్ని గుణాలు కలవాలి?',
        a: '36 గుణాల అష్టకూట వివాహ పొంతనలో కనీసం 18 గుణాలు వస్తే వివాహానికి అనుకూలం. 18 నుండి 24 గుణాలు మధ్యమ పొంతన, 24 నుండి 32 గుణాలు ఉత్తమ పొంతన, 32 కంటే ఎక్కువ వస్తే అత్యుత్తమ పొంతనగా పరిగణిస్తారు.',
      },
      {
        q: 'నాడి దోషం ఉంటే మినహాయింపు (Exception) ఉంటుందా?',
        a: 'అవును. వధూవరుల రాశి ఒకటే అయి నక్షత్రాలు వేరైనా, నక్షత్రం ఒకటే అయి రాశులు లేదా పాదాలు వేరైనా ఏకనాడి దోషం వర్తించదని శాస్త్ర ప్రమాణం.',
      },
      {
        q: 'రజ్జు దోషం అంటే ఏమిటి?',
        a: 'వధూవరుల జన్మ నక్షత్రాలు రెండూ ఒకే రజ్జువులో (ముఖ్యంగా శిరో, కంఠ, నాభి రజ్జువులలో) పడితే రజ్జు దోషం అంటారు. అయితే గ్రహమైత్రి మరియు రాశ్యాధిపతి బలం ఉన్నప్పుడు దీని తీవ్రత తగ్గుతుంది.',
      },
      {
        q: 'భకూట దోషం ఎప్పుడు పరిహరింపబడుతుంది?',
        a: 'వధూవరుల రాశుల మధ్య షష్టాష్టక (6-8) లేదా ద్విద్వాదశ (2-12) స్థితి ఉన్నప్పటికీ, ఆ రాశుల అధిపతులు పరస్పర మిత్రులైతే భకూట దోషం తొలగిపోతుంది.',
      },
      {
        q: 'కేవలం పేరు నక్షత్రంతో వివాహ పొంతన చూడవచ్చా?',
        a: 'పుట్టిన తేదీ మరియు సమయం ఉన్నప్పుడు జన్మ నక్షత్రంతోనే వివాహ పొంతన చూడాలి. పుట్టిన వివరాలు పూర్తిగా తెలియని పక్షంలో మాత్రమే వ్యవహార నామ నక్షత్రాన్ని పరిశీలిస్తారు.',
      },
    ],
  },
  '/telugu-baby-names': {
    primaryKeyword: 'నక్షత్రం ప్రకారం పిల్లల పేర్లు',
    secondaryKeywords: [
      'telugu baby names by nakshatra',
      'అబ్బాయిల పేర్లు తెలుగు',
      'అమ్మాయిల పేర్లు తెలుగు',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_BABY_NAMES_NAMAKARANAM}}',
    introTe:
      'నక్షత్రం ప్రకారం పిల్లల పేర్లు (telugu baby names by nakshatra): భారతీయ వైదిక సంప్రదాయంలో శిశువు జన్మించినప్పుడు చంద్రుడు సంచరిస్తున్న నక్షత్రం మరియు ఆ నక్షత్ర పాదానికి కేటాయించబడిన అవకహడ చక్ర అక్షరం ఆధారంగా అబ్బాయిల పేర్లు తెలుగు మరియు అమ్మాయిల పేర్లు తెలుగులో నామకరణం చేయడం వల్ల ఆయురారోగ్యాలు, సద్బుద్ధి కలుగుతాయని శాస్త్ర వచనం.',
    howItWorksTitle: 'నక్షత్రం ప్రకారం పిల్లల పేర్లు ఎలా ఎంచుకోవాలి? (How This Works)',
    howItWorksTe:
      '27 నక్షత్రాలకు ఒక్కో నక్షత్రానికి 4 పాదాల చొప్పున మొత్తం 108 నక్షత్ర పాదాలకు నిర్దిష్టమైన నామ అక్షరాలు ఉంటాయి (ఉదాహరణకు అశ్విని: చూ, చే, చో, లా; రోహిణి: ఓ, వా, వీ, వూ). మీరు శిశువు జన్మ నక్షత్రాన్ని ఎంచుకోగానే ఆ 4 పాదాల అక్షరాలతో మొదలయ్యే అర్థవంతమైన అబ్బాయిల మరియు అమ్మాయిల పేర్లు వాటి తెలుగు అర్థాలతో సహా కనిపిస్తాయి.',
    termsTitle: 'నామకరణ శాస్త్రంలోని ముఖ్య అంశాలు (Key Terms)',
    termsListTe: [
      {
        term: 'జన్మ నామం vs వ్యవహార నామం',
        meaning: 'నక్షత్ర పాద అక్షరంతో పెట్టే పేరు జన్మ నామం (పూజా సంకల్పాలకు వాడేది). అదే అక్షరంతో పిలుపు కోసం పెట్టుకునేది వ్యవహార నామం.',
      },
      {
        term: 'అవకహడ చక్రం (Avakahada Syllable Map)',
        meaning: '27 నక్షత్రాల 108 పాదాలకు స్వర, వ్యంజన అక్షరాలను కేటాయించే సాంప్రదాయ వైదిక పట్టిక.',
      },
      {
        term: 'అక్షర సంఖ్యా నియమం',
        meaning: 'మగపిల్లల పేరులో సరి సంఖ్య (2 లేదా 4) అక్షరాలు, ఆడపిల్లల పేరులో బేసి సంఖ్య (3 లేదా 5) లేదా దీర్ఘాంత నామాలు శుభప్రదం.',
      },
    ],
    faqListTe: [
      {
        q: 'జన్మ నక్షత్రం ఎలా తెలుసుకోవాలి?',
        a: 'శిశువు పుట్టిన తేదీ, సమయం మరియు పుట్టిన ఊరు ఆధారంగా జన్మ కుండలి గణిస్తే ఆ సమయానికి చంద్రుడు ఉన్న నక్షత్రం మరియు పాదం (1, 2, 3 లేదా 4) తెలుస్తాయి.',
      },
      {
        q: 'నామకరణం పుట్టిన ఎన్ని రోజులకు చేయాలి?',
        a: 'జాతశౌచం ముగిసిన తర్వాత 11వ రోజు, 12వ రోజు, 16వ రోజు లేదా 21వ రోజున శుభ తిథి, వార, నక్షత్రాలలో నామకరణం నిర్వహించాలి.',
      },
      {
        q: 'నక్షత్రం ప్రకారం పిల్లల పేర్లు పెడితే ఏమిటి ప్రయోజనం?',
        a: 'జన్మ నక్షత్ర పాద అక్షరంతో పేరు పెట్టి పిలిచినప్పుడల్లా ఆ నక్షత్ర దేవత మరియు రాశ్యాధిపతి యొక్క సానుకూల తరంగాలు శిశువుపై పనిచేస్తాయి.',
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
    primaryKeyword: 'గౌరీ పంచాంగం',
    secondaryKeywords: ['gowri panchangam telugu', 'గౌరీ పంచాంగం ఈ రోజు', 'హోరా చక్రం'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_GOWRI_PANCHANGAM}}',
    introTe:
      'గౌరీ పంచాంగం (gowri panchangam telugu): రోజువారీ పనులలో ప్రత్యేకంగా ముహూర్తం పెట్టించుకోలేని ప్రయాణాలు, వ్యాపార ప్రారంభాలు మరియు ఆర్థిక లావాదేవీలకు తక్షణమే శుభ సమయాన్ని తెలుసుకోవడానికి గౌరీ పంచాంగం ఈ రోజు మరియు నవగ్రహ హోరా చక్రం అత్యంత ప్రామాణికమైనవి.',
    howItWorksTitle: 'గౌరీ పంచాంగం మరియు హోరా చక్రం ఎలా లెక్కిస్తారు? (How This Works)',
    howItWorksTe:
      'సూర్యోదయం నుండి సూర్యాస్తమయం వరకు ఉన్న పగటి కాలాన్ని 8 సమాన భాగాలుగా, రాత్రి కాలాన్ని 8 సమాన భాగాలుగా విభజిస్తే వచ్చేదే గౌరీ పంచాంగం (ఒక్కో భాగం సుమారు 1 గంట 30 నిమిషాలు). ఇందులో అమృతం, శుభం, లాభం, ధనం, ఉద్యోగం అనేవి శుభ ఘడియలు. అలాగే ఒక రోజులోని 24 గంటలను 24 హోరాలుగా (ఒక్కో గంటకు ఒక్కో గ్రహ ఆధిపత్యం) విభజించే విధానాన్ని హోరా చక్రం అంటారు.',
    termsTitle: 'గౌరీ పంచాంగం & హోరా చక్రంలోని ముఖ్య పదాలు',
    termsListTe: [
      {
        term: 'అమృత, శుభ, లాభ, ధన గౌరీ ఘడియలు',
        meaning: 'నూతన వస్తు కొనుగోలుకు, బ్యాంకు పనులకు, ఒప్పందాలకు మరియు ప్రయాణాలకు ఈ నాలుగు గౌరీ కాలాలు అత్యంత అనుకూలమైనవి.',
      },
      {
        term: 'రోగ, చోర, విష గౌరీ ఘడియలు',
        meaning: 'ఈ సమయాలలో ముఖ్యమైన ఆర్థిక పెట్టుబడులు లేదా దూర ప్రయాణాలు ప్రారంభించకపోవడం మంచిది.',
      },
      {
        term: 'గురు, శుక్ర, బుధ, చంద్ర హోరాలు',
        meaning: 'గురు హోర విద్య/బంగారం కొనుగోలుకు; శుక్ర హోర వస్త్ర/వాహన కార్యాలకు; బుధ హోర వ్యాపార ఒప్పందాలకు; చంద్ర హోర ప్రయాణాలకు శ్రేష్ఠం.',
      },
    ],
    faqListTe: [
      {
        q: 'గౌరీ పంచాంగంలో శుభం ఉన్నా రాహుకాలం ఉంటే ఆ సమయం వాడుకోవచ్చా?',
        a: 'రాహుకాలం, వర్జ్యం లేదా దుర్ముహూర్తం ఉన్నప్పుడు గౌరీ పంచాంగంలో శుభం ఉన్నప్పటికీ ఆ సమయాన్ని శుభకార్యాలకు పరిహరించాలి. రాహుకాలం లేని గౌరీ శుభ ఘడియలనే ఎంచుకోవాలి.',
      },
      {
        q: 'హోరా చక్రం ఏ సమయం నుండి మొదలవుతుంది?',
        a: 'ప్రతిరోజూ స్థానిక సూర్యోదయ సమయం నుండి ఆ వారాధిపతి యొక్క మొదటి హోర ప్రారంభమవుతుంది (ఉదా: ఆదివారం సూర్య హోరతో, గురువారం గురు హోరతో మొదలవుతుంది).',
      },
      {
        q: 'గౌరీ పంచాంగం ఈ రోజు సమయాలు ప్రతిరోజూ ఒకేలా ఉంటాయా?',
        a: 'ఉండవు. వారాన్ని బట్టి గౌరీ ఘడియల క్రమం మారుతుంది మరియు స్థానిక సూర్యోదయ సమయాన్ని బట్టి నిమిషాలు మారుతాయి.',
      },
      {
        q: 'ఏ హోరలో కొత్త పని ప్రారంభిస్తే మంచిది?',
        a: 'గురు హోర, శుక్ర హోర, బుధ హోర మరియు పూర్ణ చంద్ర హోరలు సమస్త శుభకార్య ప్రారంభాలకు అనుకూలమైనవి.',
      },
      {
        q: '"హోరా" అనే పదానికి అర్థం ఏమిటి?',
        a: '"అహోరాత్ర" అనే సంస్కృత పదంలో మొదటి, చివరి అక్షరాలు తీసివేయగా ఏర్పడిన "హోరా" (Hora) అంటే ఒక గంట కాల ప్రమాణం.',
      },
    ],
  },
  '/tarabalam-chandrabalam': {
    primaryKeyword: 'తారాబలం',
    secondaryKeywords: ['tarabalam calculator telugu', 'చంద్రబలం', 'తారాబలం ఈ రోజు'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_TARABALAM_CHANDRABALAM}}',
    introTe:
      'తారాబలం (tarabalam calculator telugu): ఏదైనా శుభకార్యం, ప్రయాణం లేదా పూజా సంకల్పం చేసేటప్పుడు ఈ రోజు ఉన్న నక్షత్రం మీ జన్మ నక్షత్రానికి అనుకూలంగా ఉందో లేదో తెలిపే గణనను తారాబలం ఈ రోజు అంటారు; అలాగే ఆ రోజు చంద్రుడు సంచరిస్తున్న రాశి మీ జన్మ రాశికి ఎన్నవ స్థానంలో ఉన్నాడో తెలిపే గణనను చంద్రబలం అంటారు.',
    howItWorksTitle: 'నవతార తారాబలం మరియు చంద్రబలం ఎలా లెక్కిస్తారు? (How This Works)',
    howItWorksTe:
      'మీ జన్మ నక్షత్రం నుండి ఈ రోజు ఉన్న నక్షత్రం వరకు లెక్కించి ఆ సంఖ్యను 9 చే భాగించగా వచ్చే శేషాన్ని బట్టి 9 తారలు నిర్ణయించబడతాయి: 1-జన్మ, 2-సంపత్, 3-విపత్, 4-క్షేమ, 5-ప్రత్యక్, 6-సాధన, 7-నైధన (వధ), 8-మిత్ర, 9/0-పరమ మిత్ర. ఇందులో 2, 4, 6, 8, 9 తారలు శుభప్రదం. అలాగే మీ జన్మ రాశి నుండి నేటి చంద్ర రాశి 1, 3, 6, 7, 10, 11 స్థానాలలో ఉంటే చంద్రబలం ఉన్నట్లు లెక్క.',
    termsTitle: 'నవతారల పేర్లు మరియు చంద్రబల నియమాలు',
    termsListTe: [
      {
        term: 'సంపత్ (2), క్షేమ (4), సాధన (6), మిత్ర (8), పరమ మిత్ర (9)',
        meaning: 'ఈ ఐదు తారలు ధనలాభం, క్షేమకరమైన ప్రయాణం, కార్యసిద్ధి మరియు మిత్ర సహకారాన్ని ఇచ్చే అత్యుత్తమ తారాబలాలు.',
      },
      {
        term: 'విపత్ (3), ప్రత్యక్ (5), నైధన (7) తారలు',
        meaning: 'విపత్ తార ఆటంకాలను, ప్రత్యక్ తార వ్యతిరేకతను, నైధన తార వ్యయాన్ని సూచిస్తాయి కాబట్టి కొత్త పనులకు వీటిని విడిచిపెట్టాలి.',
      },
      {
        term: 'చంద్రాష్టమం (8th House Moon)',
        meaning: 'జన్మ రాశి నుండి 8వ రాశిలో చంద్రుడు సంచరించే రెండున్నర రోజుల కాలాన్ని చంద్రాష్టమం అంటారు. ఈ సమయంలో ముఖ్య నిర్ణయాలు వాయిదా వేయడం మంచిది.',
      },
    ],
    faqListTe: [
      {
        q: 'తారాబలం ఎలా లెక్కిస్తారు?',
        a: 'మీ జన్మ నక్షత్రం నుండి ఆ రోజు ఉన్న దిన నక్షత్రం వరకు లెక్కించి 9 తో భాగిస్తే వచ్చే శేషం 2 (సంపత్), 4 (క్షేమ), 6 (సాధన), 8 (మిత్ర), 9 లేదా 0 (పరమ మిత్ర) అయితే తారాబలం ఉన్నట్లు.',
      },
      {
        q: 'చంద్రబలం ఏయే స్థానాలలో ఉన్నప్పుడు శుభప్రదం?',
        a: 'మీ జన్మ రాశి నుండి ఆ రోజు చంద్రుడు 1, 3, 6, 7, 10, 11 రాశులలో సంచరిస్తున్నప్పుడు పూర్ణ చంద్రబలం ఉంటుంది.',
      },
      {
        q: 'తారాబలం లేకపోయినా అత్యవసర ప్రయాణం చేయాల్సి వస్తే ఏం చేయాలి?',
        a: 'ప్రయాణానికి ముందు ఇష్టదైవ ప్రార్థన చేసి, అభిజిత్ ముహూర్తంలో లేదా శుభ హోరలో బయలుదేరాలని ముహూర్త గ్రంథాలు సూచిస్తున్నాయి.',
      },
      {
        q: 'పర్యాయ తారలు అంటే ఏమిటి?',
        a: '27 నక్షత్రాలను 9 చొప్పున మూడు పర్యాయాలుగా (1–9 మొదటి పర్యాయం, 10–18 రెండవ పర్యాయం, 19–27 మూడవ పర్యాయం) విభజిస్తారు. రెండవ, మూడవ పర్యాయాలలో అశుభ తారల దోషం తక్కువగా ఉంటుంది.',
      },
      {
        q: 'శుక్ల పక్షంలో చంద్రబలం నియమం ఏమిటి?',
        a: 'శుక్ల పక్షంలో చంద్రుడు వృద్ధి చెందుతూ బలంతో ఉంటాడు కాబట్టి 2, 5, 9 స్థానాలు కూడా శుభప్రదంగానే పరిగణించబడతాయి.',
      },
    ],
  },
  '/naama-nakshatra': {
    primaryKeyword: 'పేరు ప్రకారం రాశి',
    secondaryKeywords: ['name nakshatra telugu', 'పేరు మొదటి అక్షరం నక్షత్రం'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_NAAMA_NAKSHATRA}}',
    introTe:
      'పేరు ప్రకారం రాశి (name nakshatra telugu): పుట్టిన తేదీ మరియు సమయం తెలియని వారు తమ పిలుపు పేరులోని మొదటి అక్షరం ద్వారా పేరు మొదటి అక్షరం నక్షత్రం, పాదం మరియు చంద్ర రాశిని అవకహడ చక్ర సూత్రాలతో ఇక్కడ సులభంగా తెలుసుకోవచ్చు.',
    howItWorksTitle: 'పేరు ప్రకారం రాశి & నక్షత్రం ఎలా కనుగొంటారు? (How This Works)',
    howItWorksTe:
      'మీ పేరులోని మొదటి తెలుగు లేదా ఆంగ్ల అక్షరాన్ని ఎంచుకోగానే 27 నక్షత్రాల 108 పాదాల అక్షర పట్టిక (అవకహడ చక్రం) ఆధారంగా ఆ అక్షరానికి చెందిన నక్షత్రం, పాదం, రాశి మరియు రాశ్యాధిపతి వివరాలు కనిపిస్తాయి.',
    termsTitle: 'నామ నక్షత్ర గణనలోని ముఖ్య పదాలు',
    termsListTe: [
      {
        term: 'నామ నక్షత్రం & నామ రాశి',
        meaning: 'వ్యవహార నామంలోని మొదటి అక్షరం ఏ నక్షత్ర పాదానికి చెందుతుందో దానిని నామ నక్షత్రం అని, ఆ పాదం ఉండే రాశిని నామ రాశి అని అంటారు.',
      },
      {
        term: 'అర్చన మరియు సంకల్ప వినియోగం',
        meaning: 'జన్మ నక్షత్రం తెలియని వారు ఆలయాలలో అర్చన చేయించుకునేటప్పుడు మరియు గోచార రాశి ఫలాలు చూసుకునేటప్పుడు పేరు ప్రకారం రాశిని ఉపయోగించవచ్చు.',
      },
    ],
    faqListTe: [
      {
        q: 'పేరు మొదటి అక్షరంతో రాశి ఎలా తెలుస్తుంది?',
        a: 'ప్రతి తెలుగు/సంస్కృత అక్షరం 27 నక్షత్రాలలోని ఒక పాదానికి కేటాయించబడి ఉంటుంది. ఉదాహరణకు "రా" అక్షరం చిత్త నక్షత్ర 3వ పాదం (తులా రాశి) కి చెందుతుంది.',
      },
      {
        q: 'జన్మ రాశికి, పేరు ప్రకారం రాశికి తేడా ఏమిటి?',
        a: 'పుట్టిన సమయానికి చంద్రుడు ఉన్న రాశి జన్మ రాశి; పిలిచే పేరు మొదటి అక్షరం ఆధారంగా వచ్చే రాశి నామ రాశి.',
      },
      {
        q: 'పుట్టిన తేదీ తెలియకపోతే ఏ రాశి ఫలాలు చూడాలి?',
        a: 'పుట్టిన తేదీ, సమయం తెలియని వారు తమ పేరు ప్రకారం రాశి (నామ రాశి) ఆధారంగా గోచార మరియు వార రాశి ఫలాలను చూసుకోవచ్చు.',
      },
      {
        q: 'వ్యాపార సంస్థలకు పేరు పెట్టేటప్పుడు నామ నక్షత్రం చూడాలా?',
        a: 'అవును, యజమాని జన్మ నక్షత్రానికి సంపత్, క్షేమ, సాధన లేదా మిత్ర తార అయ్యే అక్షరంతో వ్యాపార నామం పెట్టడం శుభప్రదం.',
      },
      {
        q: 'జన్మ నక్షత్రం ఎలా తెలుసుకోవాలి?',
        a: 'పుట్టిన తేదీ, సమయం తెలిసినట్లయితే జన్మ కుండలి తెలుగులో పేజీలో నమోదు చేసి అసలు జన్మ నక్షత్రాన్ని తెలుసుకోవచ్చు.',
      },
    ],
  },
  '/nitya-sankalpam': {
    primaryKeyword: 'సంకల్పం తెలుగులో',
    secondaryKeywords: ['pooja sankalpam in telugu', 'నిత్య సంకల్పం'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_NITYA_SANKALPAM}}',
    introTe:
      'సంకల్పం తెలుగులో (pooja sankalpam in telugu): ప్రతిరోజూ ఇంట దీపారాధన, షోడశోపచార పూజ లేదా వ్రతం చేసేటప్పుడు తాము ఉన్న దేశం, కాలం, తెలుగు సంవత్సరం, అయనం, ఋతువు, మాసం, పక్షం, తిథి, వారం మరియు నక్షత్రాలను స్మరించే వేద మంత్రమే నిత్య సంకల్పం.',
    howItWorksTitle: 'నిత్య పూజా సంకల్పం తెలుగులో ఎలా మారుతుంది? (How This Works)',
    howItWorksTe:
      'ఈ రోజు పంచాంగంలోని సంవత్సరం (శ్రీ పరాభవ నామ సంవత్సరం), అయనం, ఋతువు, మాసం, పక్షం, తిథి, వారం మరియు నక్షత్రం ఆటోమేటిక్‌గా సంకల్ప మంత్రంలోకి చేర్చబడతాయి. భారతదేశం (జంబూద్వీపే, భరతవర్షే) మరియు అమెరికా (క్రౌంచద్వీపే, రమణకవర్షే) భక్తులకు వేర్వేరుగా సంకల్ప పాఠం అందించబడింది.',
    termsTitle: 'సంకల్ప మంత్రంలోని ముఖ్య భాగాలు',
    termsListTe: [
      {
        term: 'దేశ కాల సంకీర్తనం',
        meaning: 'మనం నివసిస్తున్న భూభాగం (ద్వీపం, వర్షం, ఖండం, క్షేత్రం) మరియు ప్రస్తుత కాలమానాన్ని (సంవత్సరం, అయనం, ఋతువు, మాసం, తిథి) ఉచ్చరించడం.',
      },
      {
        term: 'గోత్ర నామ స్మరణ',
        meaning: 'పూజ చేసే గృహస్థు తన గోత్రం, తన పేరు, ధర్మపత్ని మరియు సంతానం పేర్లను చెప్పుకుంటూ భగవత్ ప్రీత్యర్థం పూజ చేస్తున్నట్లు సంకల్పించడం.',
      },
    ],
    faqListTe: [
      {
        q: 'పూజలో సంకల్పం ఎందుకు చెప్పుకోవాలి?',
        a: 'సంకల్పం లేకుండా చేసే పూజకు సంపూర్ణ ఫలం ఉండదని స్మృతి వచనం. మనం ఏ ప్రదేశంలో, ఏ శుభ కాలంలో, ఏ ఉద్దేశ్యంతో భగవంతుని ఆరాధిస్తున్నామో తెలియజేసేదే సంకల్పం.',
      },
      {
        q: 'అమెరికాలో (USA) ఉన్నవారు సంకల్పంలో ఏ ద్వీపం చెప్పాలి?',
        a: 'ఉత్తర అమెరికా ఖండంలో నివసించే భక్తులు "క్రౌంచద్వీపే, రమణకవర్షే, ఐంద్రఖండే" అని, తమ సమీప నది/పర్వత ప్రాంతాన్ని స్మరిస్తూ సంకల్పం చెప్పుకోవాలి.',
      },
      {
        q: 'గోత్రం తెలియని వారు సంకల్పంలో ఏ గోత్రం చెప్పాలి?',
        a: 'సొంత గోత్రం తెలియని పక్షంలో "కాస్యప గోత్రోద్భవస్య" లేదా భగవంతుని పేరిట "అచ్యుత గోత్రోద్భవస్య" అని చెప్పుకోవచ్చు.',
      },
      {
        q: 'సంకల్పంలో ఆ రోజు తిథి, నక్షత్రం ఎలా తెలుసుకోవాలి?',
        a: 'ఈ పేజీలో ప్రతిరోజూ ఆ రోజు ఉన్న తిథి, వారం, నక్షత్రం సంకల్ప మంత్రంలో ఆటోమేటిక్‌గా అప్‌డేట్ అవుతాయి కాబట్టి నేరుగా చదువుకోవచ్చు.',
      },
      {
        q: 'సంకల్పం చెప్పుకునేటప్పుడు చేతిలో ఏమి ఉంచుకోవాలి?',
        a: 'కుడి అరచేతిలో కొద్దిగా జలం (నీరు), అక్షతలు, పుష్పం ఉంచుకుని సంకల్పం పఠించి, చివరలో ఆ జలాన్ని పళ్లెంలో విడిచిపెట్టాలి.',
      },
    ],
  },
  '/muhurtham': {
    primaryKeyword: 'శుభ ముహూర్తం',
    secondaryKeywords: [
      'how to choose good muhurtham',
      'when good muhurtham for marriage',
      'when good muhurtham for house warming',
      'when good muhurtham for vehicle purchase',
      'astrology horoscope telugu muhurtham',
      'వివాహ ముహూర్తం',
      'గృహ ప్రవేశ ముహూర్తం',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_MUHURTHAM_FINDER}}',
    introTe:
      'శుభ ముహూర్తం (how to choose good muhurtham): వశిష్ఠ, పరాశర, భృగు, గర్గ మహర్షుల శాస్త్ర ప్రమాణాలతో వివాహం, గృహప్రవేశం, వాహనం, వ్యాపారం, విద్య మరియు 50+ శుభకార్యాల ఆదర్శ ముహూర్త నిర్ణయ విశ్లేషణ.',
    howItWorksTitle: 'శుభ ముహూర్తం ఎలా నిర్ణయిస్తారు? (How Muhurtham is Calculated)',
    howItWorksTe:
      'పంచాంగ శుద్ధి (తిథి, వారం, నక్షత్రం, యోగం, కరణం) తో పాటు వ్యక్తిగత తారాబలం, చంద్రబలం, లగ్న శుద్ధి మరియు ఏకవింశతి (21) మహా దోషాల విచారణ జరిపి దోష రహిత ముహూర్తాన్ని నిర్ణయిస్తారు.',
    termsTitle: 'ముహూర్త శాస్త్రంలోని ముఖ్య విభాగాలు',
    termsListTe: [
      {
        term: 'పంచాంగ శుద్ధి (Panchanga Shuddhi)',
        meaning: 'అమావాస్య, రిక్త తిథులు, వ్యతీపాత, వైధృతి యోగాలు మరియు విష్టి కరణం లేని పవిత్ర కాలం.',
      },
      {
        term: 'ఏకవింశతి దోషాలు (21 Marriage Doshas)',
        meaning: 'వివాహ లగ్నంలో కుజాష్టమం, భృగుషట్కం, పాపకర్తరీ, సప్తమ అశుద్ధి మొదలైన 21 దోషాలు రాకుండా చూచుట.',
      },
      {
        term: 'అభిజిత్ ముహూర్తం (Abhijit Window)',
        meaning: 'మధ్యాహ్న సూర్యోదయ-సూర్యాస్తమయాల మధ్య బిందువు సమయం – బుధవారం తప్ప మిగిలిన రోజులలో సర్వదోష హరం.',
      },
    ],
    faqListTe: [
      {
        q: 'శుభ ముహూర్తం ఎలా చూసుకోవాలి? (How to choose good muhurtham?)',
        a: 'పంచాంగ శుద్ధి, కర్త యొక్క తారాబలం, చంద్రబలం మరియు రాహుకాల-యమగండ-వర్జ్య రహిత శుభ లగ్నాన్ని ఎన్నుకోవాలి.',
      },
      {
        q: 'వివాహానికి ఏ ముహూర్తం మంచిది? (When is good muhurtham for marriage?)',
        a: 'శుక్లపక్షంలో రోహిణి, మృగశిర, మఘ, ఉత్తర, హస్త, స్వాతి, అనూరాధ నక్షత్రాలలో, వృషభ, మిథున, కన్య, తుల, ధనుస్సు లగ్నాలు శ్రేష్టం.',
      },
    ],
  },
  '/vivaha-muhurtham': {
    primaryKeyword: 'వివాహ ముహూర్తాలు 2026-2027',
    secondaryKeywords: ['vivaha muhurtham telugu', 'పెళ్లి ముహూర్తాలు', 'marriage muhurtham dates telugu'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_VIVAHA_MUHURTHAM}}',
    introTe:
      'వివాహ ముహూర్తాలు 2026–2027 (vivaha muhurtham in telugu): ధర్మసింధు, ముహూర్త చింతామణి మరియు ఏకవింశతి (21) దోష పరిహార నియమాల ప్రకారం శుక్లపక్షం, గురు-శుక్ర బలం, లగ్న శుద్ధి మరియు వధూవరుల తారాబలంతో పెళ్లి శుభ ముహూర్తాల సంపూర్ణ వివరాలు.',
    howItWorksTitle: 'దోష రహిత వివాహ ముహూర్తం ఎలా నిర్ణయిస్తారు?',
    howItWorksTe:
      'వివాహ లగ్నానికి 7వ స్థానం పూర్తిగా శూన్యంగా ఉండాలి, 8వ స్థానంలో కుజుడు ఉండరాదు మరియు లత్త, పాత, జామిత్ర, వేధ మొదలైన 21 మహాదోషాలు రాకుండా జాగ్రత్త పడాలి.',
    termsTitle: 'పెళ్లి ముహూర్త ప్రధాన నియమాలు',
    termsListTe: [
      {
        term: 'సప్తమ శుద్ధి & ఏకవింశతి దోష నివారణ',
        meaning: 'వివాహ లగ్నం నుండి సప్తమ భావ శుద్ధి మరియు వధూవరుల తారాబల-చంద్రబల అనుకూలత.',
      },
      {
        term: 'వివాహ శుభ నక్షత్రాలు',
        meaning: 'రోహిణి, మృగశిర, మఘ, ఉత్తర, హస్త, స్వాతి, అనూరాధ, మూల, ఉత్తరాషాఢ, ఉత్తరాభాద్ర, రేవతి.',
      },
    ],
    faqListTe: [
      {
        q: 'వివాహానికి ఏ నక్షత్రాలు అత్యంత శ్రేష్ఠం?',
        a: 'రోహిణి, మృగశిర, మఘ, ఉత్తర, హస్త, స్వాతి, అనూరాధ, ఉత్తరాషాఢ, ఉత్తరాభాద్ర మరియు రేవతి నక్షత్రాలు అత్యుత్తమం.',
      },
      {
        q: 'గురు లేదా శుక్ర మౌఢ్యమిలో వివాహం చేయవచ్చా?',
        a: 'వైదిక శాస్త్రం ప్రకారం గురు-శుక్ర అస్తంగత్వ (మౌఢ్యమి) కాలంలో నూతన వివాహాలు నిర్వహించరాదు.',
      },
    ],
  },
  '/gruha-pravesha-muhurtham': {
    primaryKeyword: 'గృహ ప్రవేశ ముహూర్తాలు 2026-2027',
    secondaryKeywords: ['gruhapravesham muhurtham telugu', 'housewarming dates telugu', 'నూతన గృహ ప్రవేశం'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_GRUHA_PRAVESHA_MUHURTHAM}}',
    introTe:
      'గృహ ప్రవేశ ముహూర్తాలు 2026–2027 (gruha pravesham muhurtham telugu): వశిష్ఠ సంహిత మరియు వాస్తు శాస్త్ర నియమాల ప్రకారం స్థిర లగ్నాలు (వృషభం, సింహం, వృశ్చికం, కుంభం), ఉత్తరాయణ పుణ్యకాలం మరియు 8వ ఇంటి శుద్ధితో కూడిన నూతన గృహప్రవేశ శుభ తేదీలు.',
    howItWorksTitle: 'గృహ ప్రవేశ శుభ లగ్న నియమాలు ఏమిటి?',
    howItWorksTe:
      'నూతన గృహప్రవేశానికి స్థిర లగ్నం ఎన్నుకొని, లగ్నాత్ 8వ స్థానం శూన్యంగా ఉండేలా చూడాలి మరియు ఇంటి యజమాని/యజమానురాలి జన్మ నక్షత్రానికి తారాబలం సరిచూడాలి.',
    termsTitle: 'గృహ ప్రవేశ ముహూర్త శాస్త్ర సూత్రాలు',
    termsListTe: [
      {
        term: 'స్థిర లగ్న శుద్ధి (Fixed Ascendant)',
        meaning: 'కుటుంబ స్థిరత్వం కోసం వృషభం, సింహం, లేదా కుంభ లగ్నాలు అత్యంత శుభప్రదం.',
      },
      {
        term: 'శ్రేష్ఠ తిథులు & నక్షత్రాలు',
        meaning: 'విదియ, తదియ, పంచమి, సప్తమి, దశమి, ఏకాదశి, త్రయోదశి తిథులు మరియు రోహిణి, మృగశిర, పుష్యమి, ఉత్తర, హస్త, చిత్త, అనూరాధ, రేవతి నక్షత్రాలు.',
      },
    ],
    faqListTe: [
      {
        q: 'గృహప్రవేశానికి ఏ రోజులు శ్రేష్ఠం?',
        a: 'సోమవారం, బుధవారం, గురువారం మరియు శుక్రవారాలు గృహప్రవేశానికి అత్యంత అనుకూలం.',
      },
      {
        q: 'గృహప్రవేశంతో పాటు వాస్తు పూజ, గణపతి హోమం ఎందుకు చేయాలి?',
        a: 'వాస్తు పురుషుని శాంతింపజేసి గృహంలో ఆయురారోగ్య ఐశ్వర్యాలు స్థిరంగా ఉండేందుకు వాస్తు హోమం, గోపూజ నిర్వహిస్తారు.',
      },
    ],
  },
  '/muhurtham/november-2026': {
    primaryKeyword: 'నవంబర్ 2026 శుభ ముహూర్తాలు',
    secondaryKeywords: ['november 2026 telugu muhurtham', 'నవంబర్ 2026 పెళ్లి ముహూర్తాలు', 'నవంబర్ 2026 గృహప్రవేశం'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_MUHURTHAM_NOV_2026}}',
    introTe:
      'నవంబర్ 2026 శుభ ముహూర్తాలు (November 2026 Telugu Muhurtham Dates): కార్తీక మరియు మార్గశిర మాసాల పుణ్యదినాలలో వివాహం, గృహప్రవేశం, నూతన వ్యాపారం మరియు వాహన కొనుగోలు కొరకు దృక్సిద్ధాంత పంచాంగ శుద్ధి గల శుభ తేదీలు.',
    howItWorksTitle: 'నవంబర్ 2026 ముహూర్త పరిశీలన విధానం',
    howItWorksTe:
      'నవంబర్ 2026 నెలలోని ప్రతిరోజు సూర్యోదయ తిథి, నక్షత్రం, రాహుకాలం మరియు అభిజిత్ సమయాన్ని బట్టి వివాహ, గృహప్రవేశ, వ్యాపార శుభ దినాలు ఇక్కడ వడపోత చేయబడ్డాయి.',
    termsTitle: 'నవంబర్ 2026 ముఖ్య విశేషాలు',
    termsListTe: [
      {
        term: 'కార్తీక – మార్గశిర పవిత్ర కాలం',
        meaning: 'శ్రీ మహావిష్ణువు యోగనిద్ర నుండి మేల్కొనే ఉత్థాన ఏకాదశి తదుపరి శుభకార్యాలకు అత్యంత ప్రశస్తం.',
      },
    ],
    faqListTe: [
      {
        q: 'నవంబర్ 2026 లో శుభకార్యాలకు అనుకూల రోజులు ఉన్నాయా?',
        a: 'అవును, ఉత్థాన ఏకాదశి (క్షీరాబ్ది ద్వాదశి) అనంతరం కార్తీక శుక్ల మరియు మార్గశిర మాసాలలో పలు వివాహ, గృహప్రవేశ, వాహన ముహూర్తాలు ఉన్నాయి.',
      },
    ],
  },
  '/muhurtham/december-2026': {
    primaryKeyword: 'డిసెంబర్ 2026 శుభ ముహూర్తాలు',
    secondaryKeywords: ['december 2026 telugu muhurtham', 'డిసెంబర్ 2026 పెళ్లి ముహూర్తాలు', 'డిసెంబర్ 2026 గృహప్రవేశం'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_MUHURTHAM_DEC_2026}}',
    introTe:
      'డిసెంబర్ 2026 శుభ ముహూర్తాలు (December 2026 Telugu Muhurtham Dates): మార్గశిర మాసం మరియు ధనుర్మాస ప్రారంభ దినాలలో పంచాంగ శుద్ధి, తారాబలం మరియు శుభ నక్షత్రాలతో కూడిన ముహూర్త క్యాలెండర్.',
    howItWorksTitle: 'డిసెంబర్ 2026 ధనుర్మాస నియమాలు',
    howItWorksTe:
      'సూర్యుడు ధనుస్సు రాశిలోకి ప్రవేశించే ధనుర్మాసంలో శుభ వివాహ, గృహప్రవేశ కార్యాలను సాధారణంగా వాయిదా వేసి, ధనుర్మాస పూర్వ భాగమైన మార్గశిరంలో పూర్తి చేస్తారు.',
    termsTitle: 'డిసెంబర్ 2026 పంచాంగ విభాగం',
    termsListTe: [
      {
        term: 'మార్గశిర శుభ దినాలు',
        meaning: 'డిసెంబర్ మొదటి వారాలలో వివాహ, ఉపనయన, గృహప్రవేశాలకు బలమైన ముహూర్తాలు లభిస్తాయి.',
      },
    ],
    faqListTe: [
      {
        q: 'ధనుర్మాసంలో పెళ్లిళ్లు ఎందుకు చేయరు?',
        a: 'సూర్యుడు గురు క్షేత్రమైన ధనుస్సులో ఉండే మాసం పూర్తిగా భగవదారాధనకు (తిరుప్పావై) అంకితం చేయబడినందున లోక వ్యవహార శుభకార్యాలు చేయరు.',
      },
    ],
  },
  '/muhurtham/january-2027': {
    primaryKeyword: 'జనవరి 2027 శుభ ముహూర్తాలు',
    secondaryKeywords: ['january 2027 telugu muhurtham', 'జనవరి 2027 గృహప్రవేశం', 'ఉత్తరాయణ ముహూర్తాలు 2027'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_MUHURTHAM_JAN_2027}}',
    introTe:
      'జనవరి 2027 శుభ ముహూర్తాలు (January 2027 Telugu Muhurtham Dates): మకర సంక్రాంతి ఉత్తరాయణ పుణ్యకాలం తదుపరి పుష్య – మాఘ మాస ప్రారంభ దినాలలో వ్యాపార, అక్షరాభ్యాస, వాహన మరియు గృహప్రవేశ శుభ సమయాలు.',
    howItWorksTitle: 'జనవరి 2027 ఉత్తరాయణ విశేషం',
    howItWorksTe:
      'మకర సంక్రాంతి తర్వాత సూర్యుడు ఉత్తర దిశగా పయనించే ఉత్తరాయణ కాలం ఆరంభం కావడంతో దేవతానుగ్రహం మరియు శుభకార్య బలం రెట్టింపు అవుతుంది.',
    termsTitle: 'జనవరి 2027 ముఖ్య ఘట్టాలు',
    termsListTe: [
      {
        term: 'ఉత్తరాయణ పుణ్యకాల ఆరంభం',
        meaning: 'సంక్రాంతి అనంతరం నూతన ఆరంభాలు, వ్యాపార విస్తరణ మరియు భూమి పూజలకు శుభప్రదం.',
      },
    ],
    faqListTe: [
      {
        q: 'జనవరి 2027 లో వివాహ, గృహప్రవేశాలకు ఎప్పటి నుండి అనుకూలం?',
        a: 'మకర సంక్రాంతి తర్వాత మాఘ మాస ఆరంభంలో వ్యక్తిగత తారాబలం చూసి శుభ ముహూర్తాలు పెట్టుకోవచ్చు.',
      },
    ],
  },
  '/kuja-dosha': {
    primaryKeyword: 'కుజ దోషం పరిహారాలు',
    secondaryKeywords: ['kuja dosham in telugu', 'manglik dosha telugu', 'కుజ దోషం మినహాయింపులు'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_KUJA_DOSHA}}',
    introTe:
      'కుజ దోషం (Kuja Dosham / Manglik Dosha in Telugu): జన్మ కుండలిలో లగ్నం, చంద్రుడు లేదా శుక్రుని నుండి 1, 2, 4, 7, 8, 12 స్థానాలలో కుజుడు ఉన్నప్పుడు కలిగే కుజ దోష తీవ్రత, బృహత్ పరాశర మినహాయింపులు మరియు శాస్త్రీయ పరిహారాలు.',
    howItWorksTitle: 'కుజ దోషం నిజంగా ఉందో లేదో ఎలా తెలుసుకోవాలి?',
    howItWorksTe:
      'కుజుడు స్వక్షేత్ర (మేష, వృశ్చిక), ఉచ్చ క్షేత్ర (మకర), గురు దృష్టిలో ఉన్నా లేదా వధూవరుల ఇరువురి జాతకాలలో సమదృష్టి ఉన్నా కుజ దోషం పరిహారమవుతుంది.',
    termsTitle: 'కుజ దోష భంగ / మినహాయింపు సూత్రాలు',
    termsListTe: [
      {
        term: 'కుజ దోష స్థానాలు (1, 2, 4, 7, 8, 12)',
        meaning: 'లగ్నాత్ 7వ మరియు 8వ స్థాన కుజుడు మాత్రమే ప్రత్యేక విచారణకు అర్హుడు.',
      },
      {
        term: 'సుబ్రహ్మణ్య & నరసింహ ఆరాధన',
        meaning: 'మంగళవారం కుజ గాయత్రీ, సుబ్రహ్మణ్య కవచం మరియు కందులు దానం దోష శాంతిని ఇస్తాయి.',
      },
    ],
    faqListTe: [
      {
        q: 'కుజ దోషం ఉంటే వివాహం ఆలస్యం అవుతుందా?',
        a: 'మినహాయింపులు లేని తీవ్ర కుజ దోషానికి సమాన దోష జాతకంతో పొంతన చూసుకోవడం ద్వారా దాంపత్యం ఎంతో ఆనందంగా ఉంటుంది.',
      },
      {
        q: 'కుజ దోషానికి సులభమైన వైదిక పరిహారం ఏమిటి?',
        a: 'మంగళవారం సుబ్రహ్మణ్యేశ్వర స్వామి అష్టోత్తరం, అంగారక స్తోత్రం మరియు హనుమాన్ చాలీసా పఠనం ఎంతో శ్రేష్టం.',
      },
    ],
  },
  '/kaal-sarp-dosha': {
    primaryKeyword: 'కాలసర్ప దోషం పరిహారాలు',
    secondaryKeywords: ['kaal sarp dosha telugu', 'రాహు కేతు దోషం', '12 రకాల కాలసర్ప దోషాలు'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_KAAL_SARP_DOSHA}}',
    introTe:
      'కాలసర్ప దోషం (Kaal Sarp Dosha in Telugu): జన్మ కుండలిలో రవి, చంద్ర, కుజ, బుధ, గురు, శుక్ర, శని అనే ఏడు గ్రహాలు రాహు-కేతువుల అక్షానికి ఒకే వైపు బంధింపబడినప్పుడు ఏర్పడే 12 రకాల కాలసర్ప యోగాలు, శుభ లక్షణాలు మరియు శాంతి పరిహారాలు.',
    howItWorksTitle: '12 రకాల కాలసర్ప దోషాలు & రాహు-కేతు సమతుల్యత',
    howItWorksTe:
      'అనంత, కులిక, వాసుకి, శంఖపాల, పద్మ, మహాపద్మ, తక్షక, కర్కోటక, శంఖచూడ, ఘాతక, విషధర మరియు శేషనాగ అనే 12 కాలసర్ప దోషాలు ఉండినా రాహు శాంతి పూజలతో అద్భుత రాజయోగాలుగా మారుతాయి.',
    termsTitle: 'కాలసర్ప శాంతి & శ్రీకాళహస్తి నియమం',
    termsListTe: [
      {
        term: 'ఆశలేని కృషి & ఆకస్మిక విజయం',
        meaning: 'కాలసర్ప యోగం ఉన్నవారు 33 ఏళ్ల తర్వాత విశేష వృత్తి విజయాలను సాధిస్తారు.',
      },
      {
        term: 'రాహు-కేతు శాంతి పూజ',
        meaning: 'శ్రీకాళహస్తి రాహు-కేతు క్షేత్ర దర్శనం, నాగప్రతిష్ఠ, మరియు శివ రుద్రాభిషేకం సర్వోత్తమం.',
      },
    ],
    faqListTe: [
      {
        q: 'కాలసర్ప దోషం ఉంటే అన్నీ కష్టాలే వస్తాయా?',
        a: 'లేదు; రాహు-కేతువులు యోగకారక స్థానాలలో ఉంటే ఇదే కాలసర్ప యోగం వ్యక్తిని అత్యున్నత శిఖరాలకు తీసుకెళ్తుంది.',
      },
      {
        q: 'కాలసర్ప దోషానికి ఇంట్లో చేసుకోదగిన పరిహారం ఏమిటి?',
        a: 'నిత్యం "ఓం నమః శివాయ" జపం, పంచమి నాడు నాగస్తోత్ర పారాయణం మరియు దుర్గా/గణపతి ఆరాధన ఎంతో ఉపశమనాన్నిస్తాయి.',
      },
    ],
  },
  '/shubha-muhurthalu': {
    primaryKeyword: 'శుభ ముహూర్తాలు 2026',
    secondaryKeywords: ['పెళ్లి ముహూర్తాలు 2026', 'గృహప్రవేశ ముహూర్తం', 'vivaha muhurtham 2026'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_SHUBHA_MUHURTHALU_2026}}',
    introTe:
      'శుభ ముహూర్తాలు 2026 (vivaha muhurtham 2026): శ్రీ పరాభవ నామ సంవత్సరంలో పెళ్లి ముహూర్తాలు 2026, గృహప్రవేశ ముహూర్తం, అక్షరాభ్యాసం, అన్నప్రాసన మరియు ఉపనయన కార్యక్రమాలకు గురు-శుక్ర మౌఢ్యమి లేని శుద్ధ తిథి, వార, నక్షత్ర తేదీల జాబితా.',
    howItWorksTitle: 'శుభ ముహూర్తాలు 2026 ఎలా నిర్ణయిస్తారు? (How This Works)',
    howItWorksTe:
      'వివాహ మరియు గృహప్రవేశ ముహూర్తాలకు గురు, శుక్ర గ్రహాల బలం (అస్తంగత్వం/మౌఢ్యమి లేకపోవడం), చతుర్మాస్య నియమాలు, పంచాంగ శుద్ధి మరియు లగ్న శుద్ధిని పరిశీలించి తేదీలు నిర్ణయించబడతాయి.',
    termsTitle: 'ముహూర్త శాస్త్రంలోని ముఖ్య నియమాలు',
    termsListTe: [
      {
        term: 'గురు & శుక్ర మౌఢ్యమి (Combustion Period)',
        meaning: 'గురుడు లేదా శుక్రుడు సూర్యునికి సమీపంలోకి వచ్చి కాంతిహీనులయ్యే కాలాన్ని మౌఢ్యమి అంటారు. ఈ కాలంలో వివాహ, గృహప్రవేశాలు చేయరు.',
      },
      {
        term: 'తారాబలం & చంద్రబలం',
        meaning: 'ఎంచుకున్న ముహూర్త తేదీ నాడు ఉన్న నక్షత్రం మరియు చంద్ర రాశి వధూవరులకు లేదా గృహ యజమానికి అనుకూలంగా ఉండటం.',
      },
    ],
    faqListTe: [
      {
        q: 'శుభ ముహూర్తాలు 2026 లో పెళ్లి ముహూర్తాలకు ఏ మాసాలు అనుకూలం?',
        a: 'మాఘం, ఫాల్గుణం, చైత్రం, వైశాఖం, జ్యేష్ఠం, శ్రావణం, కార్తీకం మరియు మార్గశిర మాసాలలో మౌఢ్యమి లేని రోజులు వివాహానికి శ్రేష్ఠం.',
      },
      {
        q: 'గృహప్రవేశ ముహూర్తం ఏయే మాసాలలో పెట్టకూడదు?',
        a: 'ఆషాఢ, భాద్రపద, ఆశ్వయుజ మరియు పుష్య మాసాలలో నూతన గృహప్రవేశ ముహూర్తాలను సాధారణంగా పరిహరిస్తారు.',
      },
      {
        q: 'వ్యక్తిగత లగ్న ముహూర్తం ఎందుకు ముఖ్యం?',
        a: 'క్యాలెండర్‌లో శుభ తేదీ ఉన్నప్పటికీ, యజమాని లేదా వధూవరుల జన్మ నక్షత్రానికి తారాబలం మరియు అష్టమ శుద్ధి ఉన్న లగ్నాన్ని సిద్ధాంతి గారి చేత నిర్ణయించుకోవాలి.',
      },
      {
        q: 'అభిజిత్ ముహూర్తం అంటే ఏమిటి?',
        a: 'పగటి మధ్యాహ్న కాలంలో ఉండే 8వ ముహూర్తాన్ని అభిజిత్ ముహూర్తం అంటారు; చిన్న శుభకార్యాలకు ఇది ఎంతో అనుకూలం.',
      },
      {
        q: 'పెళ్లికి ఎన్ని గుణాలు కలవాలి?',
        a: 'వివాహ ముహూర్తం పెట్టే ముందు వధూవరుల అష్టకూట పొంతనలో కనీసం 18 గుణాలు మరియు రజ్జు, నాడి శుద్ధి ఉన్నాయో లేదో చూడాలి.',
      },
    ],
  },
  '/ugadi-rashi-phalalu': {
    primaryKeyword: 'ఉగాది రాశి ఫలాలు',
    secondaryKeywords: ['ugadi rashi phalalu 2026-27', 'ఉగాది పంచాంగం', 'ఆదాయం వ్యయం 2026'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_UGADI_RASHI_PHALALU}}',
    introTe:
      'ఉగాది రాశి ఫలాలు (ugadi rashi phalalu 2026-27): శ్రీ పరాభవ నామ సంవత్సర ఉగాది పంచాంగం ప్రకారం మేషం నుండి మీనం వరకు 12 రాశుల వారి ఆదాయం – వ్యయం, రాజపూజ్యం – అవమానం, నవనాయక ఫలితాలు మరియు వార్షిక రాశి ఫలితాలు.',
    howItWorksTitle: 'ఉగాది పంచాంగం ఆదాయ-వ్యయాలు ఎలా గణిస్తారు? (How This Works)',
    howItWorksTe:
      'చైత్ర శుద్ధ పాడ్యమి నాడు ప్రారంభమయ్యే తెలుగు సంవత్సరంలో వారాధిపతి (రాజు), మేఘాధిపతి, సస్యాధిపతి మొదలైన నవనాయకుల ఆధిపత్యం మరియు గురు, శని, రాహు-కేతు గ్రహాల వార్షిక సంచారం ఆధారంగా ద్వాదశ రాశుల ఫలితాలు లెక్కించబడతాయి.',
    termsTitle: 'ఉగాది పంచాంగంలోని ముఖ్య పదాలు',
    termsListTe: [
      {
        term: 'ఆదాయం – వ్యయం (Annual Income vs Expense Index)',
        meaning: 'ఆ తెలుగు సంవత్సరంలో రాశి వారికి ఉండే ఆర్థిక ప్రవాహ నిష్పత్తిని సూచించే సాంప్రదాయ గణన.',
      },
      {
        term: 'రాజపూజ్యం – అవమానం (Social Honor Index)',
        meaning: 'సమాజంలో, వృత్తిలో లభించే గౌరవ మర్యాదలు మరియు జాగ్రత్త వహించవలసిన స్థాయిని తెలిపే సంఖ్యలు.',
      },
    ],
    faqListTe: [
      {
        q: 'ఉగాది రాశి ఫలాలు జన్మ రాశి ప్రకారం చూడాలా లేక పేరు రాశి ప్రకారమా?',
        a: 'పుట్టిన తేదీ, సమయం తెలిసిన వారు జన్మ రాశి (చంద్ర రాశి) ప్రకారం చూడాలి; పుట్టిన వివరాలు తెలియని వారు పిలుపు పేరు మొదటి అక్షరం (నామ రాశి) ప్రకారం చూడవచ్చు.',
      },
      {
        q: '2026–2027 తెలుగు సంవత్సరం పేరు ఏమిటి?',
        a: '2026–2027 తెలుగు సంవత్సరం పేరు "శ్రీ పరాభవ నామ సంవత్సరం".',
      },
      {
        q: 'కందాయ ఫలాలు అంటే ఏమిటి?',
        a: 'జన్మ నక్షత్రం ఆధారంగా సంవత్సరాన్ని మూడు భాగాలుగా (మొదటి, రెండవ, మూడవ కందాయం) విభజించి శుభాశుభాలను తెలిపే పద్ధతి.',
      },
      {
        q: 'ఏలినాటి శని అంటే ఏమిటి?',
        a: 'గోచారంలో శని గ్రహం జన్మ రాశికి 12, 1, 2 స్థానాలలో సంచరించే ఏడున్నర సంవత్సరాల కాలాన్ని ఏలినాటి శని అంటారు.',
      },
      {
        q: 'గురు బలం ఏయే రాశుల వారికి ఉంటుంది?',
        a: 'జన్మ రాశి నుండి గోచార గురువు 2, 5, 7, 9, 11 స్థానాలలో సంచరించే రాశుల వారికి పూర్ణ గురు బలం ఉంటుంది.',
      },
    ],
  },
  '/vastu-shastra-telugu': {
    primaryKeyword: 'వాస్తు శాస్త్రం తెలుగులో',
    secondaryKeywords: ['ఇంటి వాస్తు', 'east facing house vastu in telugu', 'తూర్పు ముఖ ద్వారం వాస్తు'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_VASTU_SHASTRA_TELUGU}}',
    introTe:
      'వాస్తు శాస్త్రం తెలుగులో (east facing house vastu in telugu): గృహ నిర్మాణంలో పంచభూతాల సమతుల్యత, సూర్యరశ్మి, గాలి వెలుతురు మరియు అష్టదిక్పాలకుల నియమాలను వివరించేదే ఇంటి వాస్తు. తూర్పు ముఖ ద్వారం వాస్తు, ఉత్తరం, పశ్చిమం, దక్షిణం సింహద్వార నియమాలు ఇక్కడ వివరంగా ఇవ్వబడ్డాయి.',
    howItWorksTitle: 'ఇంటి వాస్తు & అష్టదిక్పాలక మండలం ఎలా పనిచేస్తుంది? (How This Works)',
    howItWorksTe:
      'భూమి యొక్క అయస్కాంత క్షేత్రం (ఉత్తర-దక్షిణ ధృవాలు) మరియు సూర్య గమనం (తూర్పు-పడమర) ఆధారంగా స్థలాన్ని 9×9 = 81 పదాల వాస్తు పురుష మండలంగా విభజించి వంటగది (ఆగ్నేయం), పూజా గది/బోరు (ఈశాన్యం), ప్రధాన పడకగది (నైరుతి) నిర్ణయిస్తారు.',
    termsTitle: 'వాస్తు శాస్త్రంలోని 8 దిక్కులు & మూలలు',
    termsListTe: [
      {
        term: 'ఈశాన్యం (North-East – జల స్థానం)',
        meaning: 'ఇంటికి అత్యంత పవిత్రమైన దిశ. ఈశాన్యం బరువు లేకుండా, పల్లంగా, పరిశుభ్రంగా ఉండాలి; బోరు/బావి మరియు పూజా మందిరానికి శ్రేష్ఠం.',
      },
      {
        term: 'ఆగ్నేయం (South-East – అగ్ని స్థానం)',
        meaning: 'అగ్ని దేవుని స్థానం కాబట్టి వంటగది (Kitchen) మరియు విద్యుత్ పరికరాలకు ఆగ్నేయ మూల అనుకూలం.',
      },
      {
        term: 'నైరుతి (South-West – నైరుతి మూల)',
        meaning: 'ఇంటి యజమాని పడకగదికి మరియు బరువైన బీరువాలు ఉంచడానికి నైరుతి దిశ అత్యుత్తమం.',
      },
    ],
    faqListTe: [
      {
        q: 'తూర్పు ముఖ ద్వారం వాస్తు (East Facing House Vastu in Telugu) లో సింహద్వారం ఎక్కడ ఉండాలి?',
        a: 'తూర్పు ముఖద్వార గృహానికి తూర్పు-ఈశాన్యం (ఉచ్చ స్థానం) వైపు ప్రధాన ద్వారం పెట్టడం వల్ల సూర్యకాంతి, ఆరోగ్యం మరియు ఐశ్వర్యం లభిస్తాయి.',
      },
      {
        q: 'ఇంటిలో వంటగది ఏ మూలలో ఉండాలి?',
        a: 'వాస్తు శాస్త్రం తెలుగులో నియమాల ప్రకారం ఆగ్నేయ మూలలో తూర్పు ముఖంగా నిలబడి వంట చేసేలా వంటగది ఉండటం ఉత్తమం; ప్రత్యామ్నాయంగా వాయువ్యం వాడుకోవచ్చు.',
      },
      {
        q: 'బోరు లేదా నీటి సంపు ఏ దిశలో తవ్వాలి?',
        a: 'తూర్పు-ఈశాన్యం లేదా ఉత్తర-ఈశాన్యం భాగంలో కర్ణరేఖకు తగలకుండా బోరు లేదా నీటి సంపు ఏర్పాటు చేయాలి.',
      },
      {
        q: 'మెట్లు (Staircase) ఏ దిశలో నిర్మించాలి?',
        a: 'దక్షిణం, పడమర లేదా ఆగ్నేయ/వాయువ్య భాగాలలో సవ్యదిశలో (Clockwise) ఎక్కేలా మెట్లు నిర్మించాలి; ఈశాన్యంలో మెట్లు వేయకూడదు.',
      },
      {
        q: 'గృహప్రవేశానికి ముహూర్తం ఎలా నిర్ణయించాలి?',
        a: 'ఇంటి యజమాని మరియు ఇల్లాలి జన్మ నక్షత్రాలకు తారాబలం, చంద్రబలం ఉన్న శుభ మాసంలో వృషభ, మిథున, కన్య, ధనుస్సు లేదా మీన లగ్నాలలో గృహప్రవేశం చేయాలి.',
      },
    ],
  },
  '/dosha-pariharalu': {
    primaryKeyword: 'ఏలినాటి శని',
    secondaryKeywords: ['kuja dosham telugu', 'కాలసర్ప దోషం', 'shani sade sati telugu', 'అష్టమ శని'],
    authorPlaceholderTag: '{{AUTHOR_NOTE_DOSHA_PARIHARALU}}',
    introTe:
      'ఏలినాటి శని (shani sade sati telugu), అష్టమ శని, అర్ధాష్టమ శని, కుజ దోషం (kuja dosham telugu) మరియు కాలసర్ప దోషం గురించిన శాస్త్రీయ వివరణ మరియు భయం లేని సాత్విక వైదిక శాంతి పరిహారాలు ఇక్కడ అందించబడ్డాయి.',
    howItWorksTitle: 'ఏలినాటి శని మరియు కుజ దోషం ఎలా గుర్తిస్తారు? (How This Works)',
    howItWorksTe:
      'మీ జన్మ రాశి నుండి గోచార శని 12, 1, 2 స్థానాలలో సంచరిస్తున్నప్పుడు ఏలినాటి శని అని, 8వ ఇంట ఉంటే అష్టమ శని అని, 4వ ఇంట ఉంటే అర్ధాష్టమ శని అని అంటారు. అలాగే జన్మ లగ్నం నుండి 1, 2, 4, 7, 8, 12 స్థానాలలో కుజుడు ఉన్నప్పుడు కుజ దోష శాతం మరియు గురు దృష్టి పరిహారం పరిశీలించబడతాయి.',
    termsTitle: 'ప్రధాన గ్రహ దోషాలు & శాస్త్రీయ విశ్లేషణ',
    termsListTe: [
      {
        term: 'ఏలినాటి శని (7.5 Years Sade Sati)',
        meaning: 'వ్యయ శని (2.5 ఏళ్లు), జన్మ శని (2.5 ఏళ్లు), పాద/కుటుంబ శని (2.5 ఏళ్లు) — ఇది మనిషికి క్రమశిక్షణ, ఓర్పు మరియు కర్మపరిపాకాన్ని నేర్పే కాలం.',
      },
      {
        term: 'కుజ దోషం (Kuja / Manglik Dosha)',
        meaning: 'వివాహ పొంతనలో పరిశీలించే అంశం. సొంత ఇల్లు (మేషం, వృశ్చికం), ఉచ్చ రాశి (మకరం) లేదా గురు దృష్టి ఉన్నప్పుడు కుజ దోషం భంగమవుతుంది.',
      },
      {
        term: 'రాహు-కేతు / కాలసర్ప స్థితి',
        meaning: 'రాహు-కేతు అక్షానికి ఒకే వైపు సప్త గ్రహాలు ఉన్నప్పుడు ఏర్పడే స్థితి. దుర్గా, సుబ్రహ్మణ్య మరియు శివారాధనతో ఉపశమనం లభిస్తుంది.',
      },
    ],
    faqListTe: [
      {
        q: 'ఏలినాటి శని అంటే ఏమిటి?',
        a: 'గోచారంలో శని గ్రహం మీ జన్మ రాశికి 12వ ఇంట, జన్మ రాశిలో (1వ ఇంట), మరియు 2వ ఇంట ఒక్కో రాశిలో రెండున్నర ఏళ్ల చొప్పున మొత్తం ఏడున్నర సంవత్సరాలు సంచరించే కాలాన్ని ఏలినాటి శని అంటారు.',
      },
      {
        q: 'ఏలినాటి శని కాలంలో ఏ జాగ్రత్తలు తీసుకోవాలి?',
        a: 'భయపడవలసిన పనిలేదు; క్రమశిక్షణ, నిజాయితీ, శ్రమజీవుల పట్ల గౌరవం, అనవసర అప్పులకు దూరంగా ఉండటం మరియు శనివారం ఆంజనేయ/వేంకటేశ్వర ఆరాధన చేయడం వల్ల శుభ ఫలితాలే కలుగుతాయి.',
      },
      {
        q: 'కుజ దోషం ఉంటే పెళ్లి ఆలస్యం అవుతుందా?',
        a: 'జాతకంలో గురు దృష్టి ఉన్నా లేదా ఎదుటి వారి జాతకంలో సమాన కుజ బలం ఉన్నా దోష సమతుల్యత ఏర్పడి సుఖమయ వివాహం జరుగుతుంది.',
      },
      {
        q: 'అష్టమ శని అంటే ఏమిటి?',
        a: 'జన్మ రాశి నుండి 8వ రాశిలో శని సంచరించే రెండున్నర సంవత్సరాల కాలాన్ని అష్టమ శని అంటారు. ఈ కాలంలో ఓర్పుతో వ్యవహరించడం, రుద్రాభిషేకం చేయడం శ్రేయస్కరం.',
      },
      {
        q: 'నవగ్రహ శాంతికి ఇంట్లో చేసుకోదగిన సులభ పరిహారం ఏమిటి?',
        a: 'ప్రతిరోజూ దీపారాధన చేసి నవగ్రహ స్తోత్రం, ఆదిత్య హృదయం లేదా విష్ణు సహస్రనామ పారాయణం చేయడం మరియు పేదలకు అన్నదానం చేయడం సర్వశ్రేష్ఠమైన పరిహారం.',
      },
    ],
  },
  '/dwadasa-rashi-rahasyalu': {
    primaryKeyword: '12 రాశుల దాంపత్యం & జీవన రహస్యాలు',
    secondaryKeywords: [
      'రాశి ప్రకారం భార్య భర్త మనస్తత్వం',
      'రాశి ప్రకారం పిల్లల విద్యా స్వభావం',
      'రాశి ప్రకారం వ్యాపార భాగస్వామ్యం',
      'రాశి ప్రకారం ఆరోగ్య రక్షణ',
      'పౌర్ణమి అమావాస్య ఏలినాటి శని మనోబలం',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_DWADASA_RASHI}}',
    introTe:
      '12 రాశుల దాంపత్యం & జీవన రహస్యాలు (dwadasa rashi rahasyalu in telugu): మేషం నుండి మీనం వరకు ద్వాదశ చంద్ర రాశుల వారీగా భార్య మరియు భర్తల మనస్తత్వం, పిల్లల సహజ విద్యా శైలి & తల్లిదండ్రుల పెంపక సూత్రాలు, ఆర్థిక ఆకర్షణ & వ్యాపార భాగస్వామ్య అనుకూలత, కాలపురుష అంగ ఆరోగ్య రక్షణ మరియు పౌర్ణమి-అమావాస్య-చంద్రాష్టమ-ఏలినాటి శని మానసిక స్థైర్య విజ్ఞానం.',
    howItWorksTitle: 'చంద్ర రాశి ఆధారిత దాంపత్య, సంతాన, వృత్తి & ఆరోగ్య విశ్లేషణ ఎలా పనిచేస్తుంది?',
    howItWorksTe:
      'వేద జ్యోతిష్య శాస్త్రంలో "చంద్రమా మనసో జాతః" అనే సూత్రం ప్రకారం మనిషి ఆలోచనా విధానం, భావోద్వేగాలు, దాంపత్య అనుబంధం మరియు జీవన శైలిపై జన్మ చంద్ర రాశి మరియు రాశ్యాధిపతి ప్రత్యక్ష ప్రభావం చూపుతారు. అలాగే కాలపురుష చక్రంలో 12 రాశులు శిరస్సు నుండి పాదాల వరకు 12 శరీర అవయవాలకు ప్రాతినిధ్యం వహిస్తాయి.',
    termsTitle: 'ద్వాదశ రాశి జీవన విజ్ఞాన సర్వస్వం – 5 ప్రధాన విభాగాలు',
    termsListTe: [
      {
        term: '1. భార్య & భర్త దాంపత్య మనస్తత్వం (Spouse Psychology by Rashi)',
        meaning: 'ప్రతి రాశికి చెందిన స్త్రీ (భార్యగా) మరియు పురుషుడు (భర్తగా) గృహ నిర్వహణలో, ఆర్థిక క్రమశిక్షణలో మరియు ప్రేమానుబంధంలో ఎలా ప్రవర్తిస్తారో మరియు వారి మధ్య అన్యోన్యతకు పాటించాల్సిన దాంపత్య సూత్రాలు.',
      },
      {
        term: '2. పిల్లల విద్యా స్వభావం & పెంపక మార్గదర్శిని (Child Nature & Parenting)',
        meaning: 'చిన్నారుల జన్మ రాశిని బట్టి వారి ఏకాగ్రత, నేర్చుకునే శైలి మరియు తల్లిదండ్రులు వారిని భయపెట్టకుండా ఉత్సాహపరిచే పెంపక పద్ధతులు.',
      },
      {
        term: '3. వృత్తి, వ్యాపార భాగస్వామ్యం & ధన ఆకర్షణ (Career, Partnerships & Wealth)',
        meaning: 'రాశి తత్వం (అగ్ని, భూ, వాయు, జల) ఆధారంగా రాణించే వృత్తులు, వ్యాపారంలో ఏ రాశుల వారితో భాగస్వామ్యం (Partnership) కలిసివస్తుందో మరియు ధన వృద్ధి నియమాలు.',
      },
      {
        term: '4. కాలపురుష అంగం & ఆరోగ్య రక్షణ (Anatomical Health Care)',
        meaning: 'మేషం (శిరస్సు) నుండి మీనం (పాదాలు) వరకు ప్రతి రాశి పాలించే శరీర భాగాలు, తీసుకోవాల్సిన ఆహార-నిద్ర జాగ్రత్తలు.',
      },
      {
        term: '5. పౌర్ణమి-అమావాస్య చంద్ర తరంగాలు & ఏలినాటి శని మనోబలం',
        meaning: 'తిథుల మార్పులు మరియు శని 30 ఏళ్ల పరిభ్రమణ చక్రం (ఏలినాటి శని, అష్టమ శని, శని పునరాగమనం) సమయంలో మానసిక ఒత్తిడిని జయించే వైదిక ధర్మ సూత్రాలు.',
      },
    ],
    faqListTe: [
      {
        q: 'వివాహ పొంతనలో 36 గుణాలతో పాటు చంద్ర రాశి మనస్తత్వం ఎందుకు చూడాలి?',
        a: 'నక్షత్ర కూటమి బాహ్య పొంతనను తెలుపుతుంది; కానీ దైనందిన సంసారంలో భార్య-భర్తల ఆలోచనలు, ఆర్థిక అలవాట్లు మరియు మాటతీరు కలవడానికి వారి చంద్ర రాశుల మనస్తత్వ అవగాహన ఎంతో కీలకం.',
      },
      {
        q: 'పిల్లల చదువులో జన్మ రాశి ఎలా ఉపయోగపడుతుంది?',
        a: 'అగ్ని రాశుల పిల్లలు ప్రశంసలతో, భూ రాశుల పిల్లలు క్రమబద్ధమైన టైమ్-టేబుల్‌తో, వాయు రాశుల పిల్లలు తార్కిక చర్చలతో, జల రాశుల పిల్లలు ఆప్యాయత మరియు ప్రశాంత వాతావరణంలో అత్యుత్తమంగా చదువుతారు.',
      },
      {
        q: 'వ్యాపార భాగస్వామ్యానికి (Business Partnership) ఏ రాశులు అనుకూలం?',
        a: 'ఆశయాలు మరియు వేగం కలిగిన రాశుల వారికి (మేషం, సింహం, ధనుస్సు) ఆర్థిక క్రమశిక్షణ మరియు వ్యూహాత్మక ఓర్పు గల రాశుల వారు (వృషభం, కన్య, తుల, మకరం) భాగస్వాములుగా ఉంటే వ్యాపారం స్థిరంగా వృద్ధి చెందుతుంది.',
      },
      {
        q: 'పౌర్ణమి, అమావాస్య మరియు చంద్రాష్టమం రోజులలో మనస్సుపై ఎలాంటి ప్రభావం ఉంటుంది?',
        a: 'చంద్రుడు మనోకారకుడు కనుక పౌర్ణమి నాడు భావోద్వేగాల ఉధృతి, అమావాస్య నాడు అంతర్ముఖత, చంద్రాష్టమ (8వ చంద్ర) సమయంలో ఆలోచనా అలసట సహజం; ఆ రోజులలో కీలక వాదనలను వాయిదా వేసి శివ/లలితా ధ్యానం చేయడం శ్రేయస్కరం.',
      },
      {
        q: '28–30 ఏళ్ల వయస్సులో మరియు ఏలినాటి శని కాలంలో మానసిక స్థైర్యం ఎలా నిలుపుకోవాలి?',
        a: 'శని గ్రహం 30 ఏళ్లకు ఒకసారి జన్మ శని స్థానానికి చేరుకుంటాడు; ఇది శిక్షించే కాలం కాదు, బాధ్యత మరియు పరిపక్వత నేర్పే కాలం. క్రమశిక్షణ, శ్రమజీవుల గౌరవం మరియు శనివార ఆరాధనతో ఈ దశలో శాశ్వత విజయం లభిస్తుంది.',
      },
    ],
  },
  '/festivals-calendar': {
    primaryKeyword: 'తెలుగు పండుగలు & వ్రత క్యాలెండర్',
    secondaryKeywords: [
      'ekadashi dates telugu',
      'pradosham dates 2026',
      'sankashtahara chaturthi',
      'pournami amavasya calendar',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_FESTIVALS_CALENDAR}}',
    introTe:
      'తెలుగు పండుగలు & వ్రత క్యాలెండర్ (12-Month Telugu Festivals, Ekadashi, Pradosham, Sankashtahara Chaturthi, Pournami & Amavasya Calendar): దృక్సిద్ధాంత సూర్య-చంద్రుల ఖగోళ దూరం (Elongation) ఆధారంగా రాబోయే 12 నెలల ఏకాదశి, ప్రదోష వ్రతం, సంకష్టహర చతుర్థి, మాస శివరాత్రి, పౌర్ణమి, అమావాస్య మరియు ఉగాది, వినాయక చవితి, విజయదశమి, దీపావళి, మహాశివరాత్రి తేదీలు నిత్య సంకల్ప మంత్రంతో సహా ఇక్కడ లభిస్తాయి.',
    howItWorksTitle: '12 నెలల ఏకాదశి, ప్రదోషం & తెలుగు పండుగల తేదీలు ఎలా లెక్కిస్తారు?',
    howItWorksTe:
      'ప్రతిరోజూ సూర్యోదయ సమయానికి సూర్యుడు మరియు చంద్రుల నిరయన రాశి స్థితుల మధ్య ఉండే డిగ్రీల భేదం (Moon - Sun = Elongation) ఆధారంగా 30 తిథులు నిర్ణయించబడతాయి. 120°–132° మధ్య శుక్ల ఏకాదశి, 144°–156° మధ్య ప్రదోష త్రయోదశి, సూర్య సంక్రమణాల ద్వారా సంక్రాంతి వంటి సౌర పర్వదినాలు ఖచ్చితంగా గణించబడతాయి.',
    termsTitle: 'నిత్య వ్రతాలు & పండుగల శాస్త్రీయ విశేషాలు',
    termsListTe: [
      {
        term: 'ఏకాదశి (Ekadashi – శుక్ల & కృష్ణ పక్షాలు)',
        meaning: 'శ్రీ మహావిష్ణువు ప్రీత్యర్థం నెలకు రెండుసార్లు ఆచరించే పవిత్ర ఉపవాస వ్రతం (వైకుంఠ ఏకాదశి, ఉత్థాన ఏకాదశి సహా).',
      },
      {
        term: 'ప్రదోష వ్రతం (Pradosham – త్రయోదశి సాయంత్రం)',
        meaning: 'సూర్యాస్తమయ సమయంలో (5:30 PM – 7:00 PM) పరమేశ్వరునికి రుద్రాభిషేకం మరియు బిల్వార్చన చేయడం సమస్త దోష నివారకం.',
      },
      {
        term: 'సంకష్టహర చతుర్థి (Sankashtahara Chaturthi)',
        meaning: 'బహుళ చవితి రోజున చంద్రోదయ దర్శనంతో శ్రీ మహాగణపతిని ఆరాధించి కార్య విఘ్నాలను తొలగించుకునే వ్రతం.',
      },
    ],
    faqListTe: [
      {
        q: 'ఏకాదశి వ్రతం ఎప్పుడు ప్రారంభించాలి మరియు పారణ ఎప్పుడు చేయాలి?',
        a: 'సూర్యోదయానికి శుద్ధ ఏకాదశి ఉన్న దినాన ఉపవాసం లేదా అల్పాహార నియమంతో విష్ణు సహస్రనామ పారాయణం చేసి, మరుసటి రోజు ద్వాదశి గడియలలో తులసి తీర్థంతో పారణ చేయాలి.',
      },
      {
        q: 'శని ప్రదోషం, సోమ ప్రదోషం అంటే ఏమిటి?',
        a: 'త్రయోదశి తిథి శనివారం నాడు వస్తే శని ప్రదోషం అని, సోమవారం నాడు వస్తే సోమ ప్రదోషం అని అంటారు; ఇవి అష్టమ/ఏలినాటి శని బాధల నివారణకు పరమ శ్రేష్ఠం.',
      },
      {
        q: 'సంకష్టహర చతుర్థి నాడు చంద్రోదయ సమయం ఎందుకు ముఖ్యం?',
        a: 'బహుళ చవితి నాడు సాయంత్రం ఉపవాసం ఉండి చంద్ర దర్శనం తర్వాత గణపతికి నైవేద్యం సమర్పించి భోజనం చేయడం శాస్త్ర విధి.',
      },
      {
        q: 'పౌర్ణమి నాడు సత్యనారాయణ వ్రతం మరియు అమావాస్య నాడు తర్పణం ఎందుకు చేస్తారు?',
        a: 'శుక్ల పౌర్ణమి చంద్ర పూర్ణ కళా సమయం కనుక శ్రీ సత్యనారాయణ వ్రతానికి, కృష్ణ అమావాస్య పితృ దేవతా అనుగ్రహానికి (తిల తర్పణం) అత్యుత్తమమైనవి.',
      },
      {
        q: 'USA / NRI భక్తులకు పండుగల తేదీలు భారత్‌తో మారుతాయా?',
        a: 'తిథి ప్రపంచమంతా ఒకే క్షణంలో ప్రారంభమైనా, స్థానిక సూర్యోదయాన్ని బట్టి అమెరికా (EST/CST/PST)లో కొన్నిసార్లు ఒక రోజు ముందే వ్రతం రావచ్చు; అందుకే మా నిత్య సంకల్పం పేజీలో దేశం బట్టి వివరాలు అందుబాటులో ఉంటాయి.',
      },
    ],
  },
  '/prashna-kundali': {
    primaryKeyword: 'తక్షణ ప్రశ్న కుండలి (1-249 KP Horary)',
    secondaryKeywords: [
      'kp prashna kundali telugu',
      'horary astrology 1 to 249',
      'krishnamurti paddhati telugu',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_PRASHNA_KUNDALI}}',
    introTe:
      'తక్షణ ప్రశ్న కుండలి (1–249 KP Horary Prashna Kundali in Telugu): పుట్టిన తేదీ లేదా ఖచ్చితమైన జన్మ సమయం తెలియని వారికి, మనసులో సంకల్పించిన 1 నుండి 249 మధ్య ఒక సంఖ్య (KP 249 Sub-Lord Number Table) మరియు ప్రస్తుత సమయ గ్రహ సంచారం ఆధారంగా ఉద్యోగం, వివాహం, ధనం, వ్యాపారం, ఆరోగ్యం, ప్రయాణం/వీసా వంటి అంశాలకు తక్షణ సమాధానం అందించే ప్రాచీన హోరరీ జ్యోతిష విధానం.',
    howItWorksTitle: 'నక్షత్ర నాడీ 249 సబ్‌లార్డ్ (KP Horary Prashna) ఎలా పనిచేస్తుంది?',
    howItWorksTe:
      '360 డిగ్రీల భచక్రాన్ని 27 నక్షత్రాలు × 9 వింశోత్తరి సబ్-లార్డ్ విభాగాలుగా విభజించి (రాశి సరిహద్దుల వద్ద మొత్తం 249 విభాగాలు) ప్రతి సంఖ్యకు ఖచ్చితమైన ప్రశ్న లగ్న రాశి, నక్షత్రాధిపతి మరియు సబ్‌లార్డ్ నిర్ణయించబడతాయి. ఆ సమయపు చంద్ర స్థితి మరియు అంశాధిపతి అనుకూలతతో ఫలితం, శుభ కాలం మరియు శాంతి పరిహారం ఇవ్వబడతాయి.',
    termsTitle: 'KP ప్రశ్న కుండలిలో ముఖ్య అంశాలు',
    termsListTe: [
      {
        term: '1–249 హోరరీ సంఖ్యా పట్టిక (249 KP Sub-Lord Matrix)',
        meaning: 'ప్రశ్నకర్త చిత్తశుద్ధితో ఎంచుకున్న సంఖ్యను బట్టి లగ్న రాశి, నక్షత్రాధిపతి (Star Lord) మరియు సూక్ష్మ సబ్‌లార్డ్ (Sub-Lord) నిర్ధారణ.',
      },
      {
        term: 'భావ కార్యకారులు (House Significators – ABCD)',
        meaning: 'వివాహానికి 2-7-11, ఉద్యోగానికి 2-6-10-11, ఆస్తికి 4-11, ప్రయాణానికి 3-9-12 భావాలతో సబ్‌లార్డ్ సంబంధం.',
      },
    ],
    faqListTe: [
      {
        q: 'పుట్టిన సమయం లేని వారు KP ప్రశ్న కుండలి ఉపయోగించవచ్చా?',
        a: 'అవును. జన్మ తేదీ లేదా సమయం తెలియని వారికి KP 1–249 హోరరీ ప్రశ్న కుండలి అత్యంత ఖచ్చితమైన మార్గదర్శకంగా పనిచేస్తుంది.',
      },
      {
        q: '1 నుండి 249 మధ్య సంఖ్యను ఎలా ఎంచుకోవాలి?',
        a: 'మీ ప్రధాన ప్రశ్నను దైవ స్మరణతో మనసులో భావించి తక్షణమే స్ఫురించిన 1–249 మధ్య సంఖ్యను నమోదు చేయాలి లేదా యాదృచ్ఛిక బటన్ క్లిక్ చేయవచ్చు.',
      },
      {
        q: 'ఒకే ప్రశ్నను వెంటవెంటనే మళ్లీ మళ్లీ అడగవచ్చా?',
        a: 'శాస్త్రం ప్రకారం ఒకే విషయంపై మనసు మారితే తప్ప వరుసగా సంఖ్యలు మారుస్తూ పరీక్షించరాదు; మొదటి సంకల్ప సంఖ్యనే ప్రామాణికంగా తీసుకోవాలి.',
      },
      {
        q: 'KP Astrology లో సబ్‌లార్డ్ (Sub-Lord) పాత్ర ఏమిటి?',
        a: 'ఒక గ్రహం లేదా భావం తన నక్షత్రాధిపతి ద్వారా విషయాన్ని సూచిస్తే, ఆ ఫలితం శుభప్రదమా లేదా ఆలస్యమవుతుందా అనేది చివరి నిర్ణేతగా సబ్‌లార్డ్ తెలుపుతుంది.',
      },
    ],
  },
  '/ratna-rudraksha': {
    primaryKeyword: 'లగ్న రత్నం & రుద్రాక్ష సలహా',
    secondaryKeywords: [
      'gemstone recommendation by lagna telugu',
      'rudraksha by lagna telugu',
      'lucky stone telugu astrology',
    ],
    authorPlaceholderTag: '{{AUTHOR_NOTE_RATNA_RUDRAKSHA}}',
    introTe:
      'లగ్న రత్నం & రుద్రాక్ష సలహాదారు (Lagna-Based Gemstone, Rudraksha & Dosha Remedy Advisor): పరాశర హోర శాస్త్రం మరియు రత్న శాస్త్ర నియమాల ప్రకారం జన్మ లగ్నాధిపతి (1st Lord), పంచమాధిపతి (5th Lord), భాగ్యాధిపతి (9th Lord) యొక్క అదృష్ట రత్నాలు, ధరించకూడని 6-8-12 త్రిక స్థానాధిపతుల రత్నాలు, ముఖి రుద్రాక్ష మరియు శుభ లోహం-వేలు-హోర వివరాలు ఇక్కడ తెలుసుకోండి.',
    howItWorksTitle: 'జన్మ లగ్నం ఆధారంగా అదృష్ట రత్నం & రుద్రాక్ష ఎలా నిర్ణయిస్తారు?',
    howItWorksTe:
      'రత్నధారణ ఎల్లప్పుడూ జనన లగ్నం (Ascendant) మరియు యోగకారక గ్రహ స్థితి ఆధారంగానే ఉండాలి, కేవలం పేరు రాశి ఆధారంగా కాదు. లగ్న, పంచమ, భాగ్య త్రికోణాధిపతుల రత్నాలు ధరించడం వల్ల ఆత్మవిశ్వాసం, ఆరోగ్యం మరియు భాగ్యోదయం కలుగుతాయి; 6, 8, 12 అధిపతుల రత్నాలను నివారించాలి.',
    termsTitle: 'వైదిక రత్న & రుద్రాక్ష ధారణ నియమాలు',
    termsListTe: [
      {
        term: 'జీవ రత్నం & భాగ్య రత్నం (Life Stone & Lucky Bhagya Stone)',
        meaning: 'లగ్నాధిపతి రత్నం శరీర-మనో బలాన్ని (Life Stone), 9వ భాగ్యాధిపతి రత్నం అదృష్ట-ధన ప్రవాహాన్ని (Lucky Stone) వృద్ధి చేస్తాయి.',
      },
      {
        term: 'ముఖి రుద్రాక్ష ధారణ (Sacred Mukhi Rudraksha)',
        meaning: 'రత్నాలకు ప్రత్యామ్నాయంగా ఎటువంటి ప్రతికూలత లేకుండా శివ కటాక్షంతో గ్రహ దోషాలను శాంతింపజేసే పవిత్ర రుద్రాక్ష.',
      },
    ],
    faqListTe: [
      {
        q: 'రత్నాన్ని జన్మ రాశి ప్రకారం ధరించాలా లేక జన్మ లగ్నం ప్రకారమా?',
        a: 'ప్రామాణిక వేద రత్న శాస్త్రం ప్రకారం ఎల్లప్పుడూ జన్మ లగ్నాధిపతి, 5వ లేదా 9వ అధిపతుల బలం చూసి రత్నాన్ని నిర్ణయించాలి.',
      },
      {
        q: '6, 8, 12 భావాధిపతుల రత్నాలు ఎందుకు ధరించకూడదు?',
        a: 'లగ్నం నుండి 6 (రోగ/రుణ), 8 (ఆయుర్విఘ్న), 12 (వ్యయ) అధిపతుల రత్నాలు ధరించడం వల్ల అనవసర ఒత్తిడి పెరిగే అవకాశం ఉంటుంది కనుక వాటికి బదులు దాన-మంత్ర-రుద్రాక్ష పరిహారాలు చేయాలి.',
      },
      {
        q: 'నీలం (Blue Sapphire) ఎవరు పరీక్షించి ధరించాలి?',
        a: 'వృషభ, తుల, మకర, కుంభ లగ్నాల వారికి శని శుభుడు అయినప్పటికీ, నీలాన్ని నేరుగా ధరించే ముందు జాతక పరిశీలన చేయించి ఉపా-రత్నంగా జామునియా (Amethyst) తో ప్రారంభించడం ఉత్తమం.',
      },
      {
        q: 'రుద్రాక్ష ధరించడానికి విశేష నియమాలు ఉంటాయా?',
        a: 'రుద్రాక్ష సర్వశుభప్రదమైన శివ స్వరూపం; సోమవారం పంచామృత/శుద్ధ జల అభిషేకం చేసి "ఓం నమః శివాయ" మంత్రంతో ధరించవచ్చు.',
      },
    ],
  },
};

/**
 * Generates unique metadata for every route according to the strict Keyword Map.
 * Guarantees no two indexable pages share the same primaryKeyword.
 */
export function generatePageMetadata(rawPathname: string): PageSeoMetadata {
  const pathname = (rawPathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const todayIso = getTodayIsoDateIST();
  const todayData = getOrGenerateDayData(todayIso, WEEK_DATA);
  const cleanTithi = todayData.panchanga.tithi.split('(')[0].split('-')[0].trim();
  const cleanNak = todayData.panchanga.nakshatram.split('(')[0].split('-')[0].trim();
  const defaultOgImage = `${SITE_URL}/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg`;
  const defaultRobots = 'index, follow';

  // 0. LEGACY TOWN DOORWAY URLS -> NOINDEX, FOLLOW (Task B)
  const doorwayMatch = pathname.match(
    /^\/(telugu-astrologer-in|neti-panchangam-in|telugu-panchangam-in|vivaha-pontana-jatakam-in)-([a-z0-9-]+)$/i
  );
  if (doorwayMatch) {
    const slug = doorwayMatch[2].toLowerCase();
    const title = clampTitle(`తెలుగు పంచాంగం సమాచారం (${slug}) | Telugu Jyothisham`);
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
      primaryKeyword: `doorway-noindex-${slug}`,
      secondaryKeywords: [],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
      ],
    };
  }

  // 1. HOMEPAGE (/) -> Primary Keyword: "తెలుగు జ్యోతిషం" + H1: "నేటి పంచాంగం (Today Telugu Panchangam)"
  if (pathname === '/') {
    const primaryKeyword = 'తెలుగు జ్యోతిషం';
    const title = clampTitle('నేటి పంచాంగం – తెలుగు జ్యోతిషం | Today Telugu Panchangam');
    const description = clampMetaDescription(
      `తెలుగు జ్యోతిషం & నేటి పంచాంగం (Today Telugu Panchangam): ఈ రోజు తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, రాహుకాలం, జన్మ కుండలి & వివాహ పొంతన.`
    );
    return {
      title,
      description,
      canonical: `${SITE_URL}/`,
      robots: defaultRobots,
      h1: 'నేటి పంచాంగం (Today Telugu Panchangam) – తెలుగు జ్యోతిషం',
      primaryKeyword,
      secondaryKeywords: ['today panchangam in telugu', 'నేటి పంచాంగం', 'telugu jyothisham'],
      ogTitle: title,
      ogDescription: description,
      ogUrl: `${SITE_URL}/`,
      ogImage: defaultOgImage,
      breadcrumbs: [{ name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` }],
    };
  }

  // 2. DAILY PANCHANGAM BY DATE: /panchangam/[yyyy-mm-dd]
  // Primary Keyword: "{తేదీ} పంచాంగం" (e.g. "3 నవంబర్ 2026 పంచాంగం")
  // Title pattern: "నేటి పంచాంగం – {Telugu date} | తిథి, నక్షత్రం, రాహుకాలం"
  const dateMatch = pathname.match(/^\/panchangam\/(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    const isoDate = dateMatch[1];
    const teluguDate = formatIsoToTeluguDate(isoDate);
    const primaryKeyword = `${teluguDate} పంచాంగం`;
    const dData = getOrGenerateDayData(isoDate, WEEK_DATA);
    const tithiShort = dData.panchanga.tithi.split('(')[0].split('-')[0].trim();
    const nakShort = dData.panchanga.nakshatram.split('(')[0].split('-')[0].trim();
    const title = clampTitle(`నేటి పంచాంగం – ${teluguDate} పంచాంగం | తిథి, నక్షత్రం`);
    const description = clampMetaDescription(
      `${teluguDate} పంచాంగం (${isoDate}): తిథి ${tithiShort}, నక్షత్రం ${nakShort}, రాహుకాలం ${dData.ashubha.rahukalam}, వర్జ్యం, అభిజిత్ ముహూర్తం.`
    );
    const canonical = `${SITE_URL}/panchangam/${isoDate}`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: `${teluguDate} పంచాంగం – నేటి పంచాంగం (${isoDate})`,
      primaryKeyword,
      secondaryKeywords: ['రేపటి పంచాంగం', 'నిన్నటి పంచాంగం', `${isoDate} తిథి`],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  // 3. MONTHLY CALENDAR PAGE: /panchangam/calendar
  // Primary Keyword: "తెలుగు క్యాలెండర్ 2026"
  if (pathname === '/panchangam/calendar') {
    const primaryKeyword = 'తెలుగు క్యాలెండర్ 2026';
    const title = clampTitle('తెలుగు క్యాలెండర్ 2026 – నెలవారీ పంచాంగం, తిథి & పండుగలు');
    const description = clampMetaDescription(
      'తెలుగు క్యాలెండర్ 2026: నవంబర్ 2026 పంచాంగం, 2026 పండుగలు, ఏకాదశి తేదీలు, అమావాస్య పౌర్ణమి 2026 మరియు ప్రతిరోజూ రాహుకాలం సమయాలు.'
    );
    const canonical = `${SITE_URL}/panchangam/calendar`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: 'తెలుగు క్యాలెండర్ 2026 – నెలవారీ పంచాంగం & పండుగల తేదీలు',
      primaryKeyword,
      secondaryKeywords: [
        'నవంబర్ 2026 పంచాంగం',
        '2026 పండుగలు',
        'ఏకాదశి తేదీలు',
        'అమావాస్య పౌర్ణమి 2026',
      ],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  // 4. VERIFIED 13 CITY PANCHANGAM PAGES: /panchangam/[city]
  const citySlug = matchCityTimingSlugFromPath(pathname);
  if (citySlug) {
    const cityPanchangam = computeCityLocalPanchangam(todayIso, citySlug);
    const c = cityPanchangam.city;
    const title = clampTitle(
      citySlug === 'usa'
        ? 'Telugu Panchangam USA – అమెరికా NRI తెలుగు పంచాంగం'
        : `${c.nameTe} పంచాంగం – ఈ రోజు తిథి, రాహుకాలం & సూర్యోదయం`
    );
    const description = clampMetaDescription(
      `${c.primaryKeyword} (${c.nameEn}): ఈ రోజు సూర్యోదయం ${cityPanchangam.sunrise}, తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, రాహుకాలం ${cityPanchangam.rahukalam}.`
    );
    const canonical = `${SITE_URL}/panchangam/${citySlug}`;
    const h1Text =
      citySlug === 'usa'
        ? 'అమెరికా తెలుగు పంచాంగం (telugu panchangam usa – NRI Calendar)'
        : `${c.nameTe} పంచాంగం (${c.nameEn} Telugu Panchangam Today)`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: h1Text,
      primaryKeyword: c.primaryKeyword,
      secondaryKeywords: c.secondaryKeywords,
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
        { name: c.primaryKeyword, item: canonical },
      ],
    };
  }

  // 4B. 27 NAKSHATRA PROFILE PAGES: /nakshatra/[slug]
  const nakSlug = matchNakshatraSlugFromPath(pathname);
  if (nakSlug) {
    const nak = findNakshatraBySlug(nakSlug)!;
    const primaryKeyword = `${nak.nameTe} నక్షత్రం`;
    const title = clampTitle(`${nak.nameTe} నక్షత్రం ఫలితాలు, నామ అక్షరాలు | ${nak.nameEn} Nakshatra`);
    const description = clampMetaDescription(
      `${nak.nameTe} నక్షత్రం (${nak.nameEn}): రాశి ${nak.rashiTe}, అధిపతి ${nak.lordTe}, 4 పాదాల అక్షరాలు (${nak.padaSyllablesEn.join(', ')}), స్వభావం, వివాహ పొంతన & పరిహారాలు.`
    );
    const canonical = `${SITE_URL}/nakshatra/${nak.slug}`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: `${nak.nameTe} నక్షత్రం (${nak.nameEn} Nakshatra) – స్వభావం, 4 పాదాలు & వివాహ పొంతన`,
      primaryKeyword,
      secondaryKeywords: [
        `${nak.nameEn} nakshatra in telugu`,
        `${nak.nameTe} నక్షత్రం పిల్లల పేర్లు`,
        `${nak.nameTe} నక్షత్రం వివాహ పొంతన`,
        ...nak.padaSyllablesEn,
      ],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'పిల్లల పేర్లు & నక్షత్రాలు', item: `${SITE_URL}/telugu-baby-names` },
        { name: primaryKeyword, item: canonical },
      ],
      faqItems: [
        {
          q: `${nak.nameTe} నక్షత్రం ఏ రాశికి చెందుతుంది? అధిపతి ఎవరు?`,
          a: `${nak.nameTe} (${nak.nameEn}) నక్షత్రం ${nak.rashiTe} రాశిలో ఉంటుంది. దీని అధిపతి ${nak.lordTe}, అధిదేవత ${nak.deityTe}.`,
        },
        {
          q: `${nak.nameTe} నక్షత్రం 4 పాదాల మొదటి అక్షరాలు ఏవి?`,
          a: `${nak.nameTe} నక్షత్రం 1, 2, 3, 4 పాదాల నామాక్షరాలు వరుసగా: ${nak.padaSyllablesTe.join(', ')}.`,
        },
        {
          q: `${nak.nameTe} నక్షత్రం గణం, నాడి మరియు యోని ఏమిటి?`,
          a: `${nak.nameTe} నక్షత్రం ${nak.ganamTe}, ${nak.nadiTe}, ${nak.yoniTe} మరియు ${nak.rajjuTe} వర్గానికి చెందుతుంది.`,
        },
        {
          q: `${nak.nameTe} నక్షత్రం వారికి ఏ వివాహ నక్షత్రాలు & పరిహారాలు శ్రేష్ఠం?`,
          a: `${nak.marriageTe} శుభ పరిహారం: ${nak.remedyTe}`,
        },
      ],
    };
  }

  // 5. GOCHARA PHALALU ROUTES (/gochara-phalalu, /gochara-phalalu/shani, /gochara-phalalu/guru, /gochara-phalalu/rahu-ketu, /gochara-phalalu/[rashi], /yelinati-shani)
  if (pathname === '/gochara-phalalu') {
    const primaryKeyword = 'గోచార ఫలాలు';
    const title = clampTitle('గోచార ఫలాలు – ఈ నెల నవగ్రహ గోచారం & 12 రాశుల ఫలితాలు');
    const description = clampMetaDescription(
      'గోచార ఫలాలు (ఈ నెల గోచారం): దృక్సిద్ధాంత గణితంతో శని, గురు, రాహు, కేతు గ్రహాల ప్రస్తుత సంచారం మరియు మీ జన్మ రాశి నుండి గోచార ఫలితాలు.'
    );
    const canonical = `${SITE_URL}/gochara-phalalu`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: 'గోచార ఫలాలు – ఈ నెల నవగ్రహ గోచారం & రాశి ఫలితాలు',
      primaryKeyword,
      secondaryKeywords: ['ఈ నెల గోచారం', 'నవగ్రహ గోచారం', 'gochara phalalu in telugu'],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  if (pathname === '/gochara-phalalu/shani') {
    const primaryKeyword = 'శని గోచారం';
    const title = clampTitle('శని గోచారం – 12 రాశుల Shani Gochara Phalalu తెలుగులో');
    const description = clampMetaDescription(
      'శని గోచారం (shani gochara phalalu): ద్వాదశ రాశుల వారికి ప్రస్తుత శని సంచార స్థానం, ఏలినాటి శని, అష్టమ శని మరియు ఆచరించవలసిన ధర్మ నియమాలు.'
    );
    const canonical = `${SITE_URL}/gochara-phalalu/shani`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: 'శని గోచారం – 12 రాశుల శని సంచార ఫలితాలు (Shani Gochara Phalalu)',
      primaryKeyword,
      secondaryKeywords: ['shani gochara phalalu', 'ఏలినాటి శని', 'అష్టమ శని'],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'గోచార ఫలాలు', item: `${SITE_URL}/gochara-phalalu` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  if (pathname === '/gochara-phalalu/guru') {
    const primaryKeyword = 'గురు గోచారం';
    const title = clampTitle('గురు గోచారం – 12 రాశుల Guru Gochara Phalalu తెలుగులో');
    const description = clampMetaDescription(
      'గురు గోచారం (guru gochara phalalu): మేషం నుండి మీనం వరకు 12 రాశుల వారికి బృహస్పతి (గురు) సంచార స్థానం, గురు బలం మరియు శుభకార్య యోగాలు.'
    );
    const canonical = `${SITE_URL}/gochara-phalalu/guru`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: 'గురు గోచారం – 12 రాశుల గురు బలం & ఫలితాలు (Guru Gochara Phalalu)',
      primaryKeyword,
      secondaryKeywords: ['guru gochara phalalu', 'గురు బలం', 'బృహస్పతి గోచారం'],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'గోచార ఫలాలు', item: `${SITE_URL}/gochara-phalalu` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  if (pathname === '/gochara-phalalu/rahu-ketu') {
    const primaryKeyword = 'రాహు కేతు గోచారం';
    const title = clampTitle('రాహు కేతు గోచారం – 12 రాశుల రాహు-కేతు సంచార ఫలితాలు');
    const description = clampMetaDescription(
      'రాహు కేతు గోచారం (rahu ketu gochara phalalu): ద్వాదశ రాశుల వారికి ప్రస్తుత రాహువు మరియు కేతువు సంచార స్థానాలు, జాగ్రత్తలు మరియు పరిహారాలు.'
    );
    const canonical = `${SITE_URL}/gochara-phalalu/rahu-ketu`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: 'రాహు కేతు గోచారం – 12 రాశుల రాహు-కేతు సంచార ఫలితాలు',
      primaryKeyword,
      secondaryKeywords: ['rahu ketu gochara phalalu', 'రాహు సంచారం', 'కేతు సంచారం'],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'గోచార ఫలాలు', item: `${SITE_URL}/gochara-phalalu` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  if (pathname === '/yelinati-shani') {
    const primaryKeyword = 'ఏలినాటి శని ఫలాలు';
    const title = clampTitle('ఏలినాటి శని ఫలాలు – 12 రాశుల సాడేసాతి శని గోచార పరిశీలన');
    const description = clampMetaDescription(
      'ఏలినాటి శని ఫలాలు (yelinati shani phalalu): మీ జన్మ రాశికి ఏలినాటి శని ఏ దశలో ఉంది? వ్యయ, జన్మ, పాద శని దశల బాధ్యతాయుత విశ్లేషణ.'
    );
    const canonical = `${SITE_URL}/yelinati-shani`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: 'ఏలినాటి శని ఫలాలు – సాడేసాతి 3 దశలు & రాశి వారీ పరిశీలన',
      primaryKeyword,
      secondaryKeywords: ['yelinati shani phalalu', 'సాడేసాతి శని', 'శని శాంతి'],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'గోచార ఫలాలు', item: `${SITE_URL}/gochara-phalalu` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  const rashiPhalaluDirectMatch = pathname.match(
    /^\/rashi-phalalu\/(mesham|vrushabham|mithunam|karkatakam|simham|kanya|tula|vruschikam|dhanussu|makaram|kumbham|meenam)$/i
  );
  if (rashiPhalaluDirectMatch) {
    const rSlug = rashiPhalaluDirectMatch[1].toLowerCase() as RashiSlug;
    const rInfo = findRashiBySlug(rSlug);
    const todayFortunes = getDailyRashiFortunes(todayData);
    const matchedFortune = todayFortunes.find((f) => f.id === rSlug);
    const encyc = DWADASA_RASHI_VEDIC_ENCYCLOPEDIA.find((e) => e.id === rSlug);
    const primaryKeyword = `${rInfo.nameTe} రాశి ఫలాలు`;
    const title = clampTitle(`${rInfo.nameTe} నేటి, రేపటి & వార రాశి ఫలాలు | ${rInfo.nameEn} Horoscope Telugu`);
    const description = clampMetaDescription(
      `${rInfo.nameTe} (${rInfo.nameEn} Rashi Phalalu): ${todayData.teediVaram} నాటి ${rInfo.nameTe} నేటి దిన ఫలాలు (${matchedFortune?.statusLabel || 'శుభం'}), రేపటి ఫలాలు, 7-రోజుల వార ఫలాలు & పరిహారం.`
    );
    const canonical = `${SITE_URL}/rashi-phalalu/${rSlug}`;
    const rashiFaqs: { q: string; a: string }[] = [
      {
        q: `${rInfo.nameTe} రాశి వారికి ఈ రోజు (${todayData.teediVaram}) ఫలితం ఎలా ఉంది?`,
        a: matchedFortune
          ? `${rInfo.nameTe} రాశి వారికి నేడు ${matchedFortune.statusLabel} స్థితి ఉంది. ${matchedFortune.grahaDrishtiPhalamTe} శుభ సమయం: ${matchedFortune.luckyTimeWindowTe}, అదృష్ట సంఖ్య: #${matchedFortune.luckyNumber}.`
          : `${rInfo.nameTe} రాశి వారికి దృక్సిద్ధాంత చంద్రబలం, తారాబలం మరియు గ్రహ దృష్టి ఆధారంగా నేటి దిన ఫలాలు ఈ పేజీలో ఇవ్వబడ్డాయి.`,
      },
      {
        q: `${rInfo.nameTe} రాశి అధిపతి ఎవరు? శుభ నక్షత్రాలు ఏవి?`,
        a: `${rInfo.nameTe} (${rInfo.nameEn}) రాశ్యాధిపతి ${encyc?.rashiLordTe || 'నవగ్రహాధిపతి'}. ${encyc?.careerLifeWorkTe || ''}`,
      },
      {
        q: `${rInfo.nameTe} రాశి వారికి నేటి అదృష్ట రంగు, సంఖ్య & పరిహారం ఏమిటి?`,
        a: matchedFortune
          ? `శుభ సమయం: ${matchedFortune.luckyTimeWindowTe}, శుభ రంగు: ${matchedFortune.luckyColor}, అదృష్ట సంఖ్య: #${matchedFortune.luckyNumber}. ఆచరించదగిన పరిహారం: ${matchedFortune.remedy}.`
          : `ఈ పేజీలో నేటి శుభ రంగు, అదృష్ట సంఖ్య, శుభ సమయం మరియు వైదిక పరిహారాలు ఇవ్వబడ్డాయి.`,
      },
      {
        q: `What are Today's ${rInfo.nameEn} Rashi Phalalu (${rInfo.nameTe}) highlights?`,
        a: matchedFortune
          ? `${rInfo.nameEn} Horoscope Today: ${matchedFortune.statusLabelEn}. ${matchedFortune.grahaDrishtiPhalamEn} Lucky Time: ${matchedFortune.luckyTimeWindowTe}, Lucky Number: #${matchedFortune.luckyNumber}.`
          : `Today's ${rInfo.nameEn} Rashi Phalalu calculated using Drik Siddhanta lunar transit and Tarabalam.`,
      },
    ];
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: `${rInfo.nameTe} రాశి ఫలాలు (${rInfo.nameEn}) – నేటి, రేపటి, వార & మాస ఫలితాలు`,
      primaryKeyword,
      secondaryKeywords: [
        `${rInfo.nameEn} daily horoscope telugu`,
        `${rInfo.nameTe} నేటి రాశి ఫలాలు`,
        `${rInfo.nameTe} వార ఫలాలు`,
        'నక్షత్ర తారాబలం',
      ],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'రాశి ఫలాలు', item: `${SITE_URL}/rashi-phalalu` },
        { name: primaryKeyword, item: canonical },
      ],
      faqItems: rashiFaqs,
    };
  }

  const rashiGocharaMatch = pathname.match(
    /^\/gochara-phalalu\/(mesham|vrushabham|mithunam|karkatakam|simham|kanya|tula|vruschikam|dhanussu|makaram|kumbham|meenam)$/i
  );
  if (rashiGocharaMatch) {
    const rSlug = rashiGocharaMatch[1].toLowerCase() as RashiSlug;
    const rInfo = findRashiBySlug(rSlug);
    const primaryKeyword = `${rInfo.nameTe} ఫలాలు`;
    const title = clampTitle(`${primaryKeyword} – నేటి రాశి ఫలాలు, వార & గోచార ఫలితాలు`);
    const description = clampMetaDescription(
      `${primaryKeyword} (${rInfo.nameEn}): ఈ నెల శని, గురు, రాహు-కేతు గోచార స్థితి, వార ఫలాలు మరియు నేటి రాశి ఫలాలు దృక్సిద్ధాంత గణితంతో.`
    );
    const canonical = `${SITE_URL}/gochara-phalalu/${rSlug}`;
    return {
      title,
      description,
      canonical,
      robots: defaultRobots,
      h1: `${primaryKeyword} – గోచార ఫలాలు, వార ఫలాలు & నేటి రాశి ఫలాలు`,
      primaryKeyword,
      secondaryKeywords: ['వార ఫలాలు', 'నేటి రాశి ఫలాలు', `${rInfo.nameEn} transit`],
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'గోచార ఫలాలు', item: `${SITE_URL}/gochara-phalalu` },
        { name: primaryKeyword, item: canonical },
      ],
    };
  }

  // 6. CORE TOOL & CONTENT ROUTES (All titles strictly < 60 chars, unique primaryKeyword per page)
  const routeTable: Record<
    string,
    {
      title: string;
      description: string;
      h1: string;
      primaryKeyword: string;
      secondaryKeywords: string[];
      breadcrumbName: string;
      canonicalPath?: string;
      robots?: string;
    }
  > = {
    '/panchangam': {
      primaryKeyword: 'నేటి పంచాంగం',
      secondaryKeywords: [
        'neti panchangam',
        'ఈ రోజు పంచాంగం',
        'today panchangam in telugu',
        'ఈ రోజు తిథి',
        'ఈ రోజు నక్షత్రం',
        'రాహుకాలం',
        'యమగండం',
        'వర్జ్యం',
        'అభిజిత్ ముహూర్తం',
      ],
      title: 'నేటి పంచాంగం (Neti Panchangam) – ఈ రోజు తిథి, నక్షత్రం',
      description: `నేటి పంచాంగం (neti panchangam / today panchangam in telugu): ఈ రోజు తిథి ${cleanTithi}, ఈ రోజు నక్షత్రం ${cleanNak}, రాహుకాలం, యమగండం, వర్జ్యం & అభిజిత్ ముహూర్తం.`,
      h1: `నేటి పంచాంగం – ఈ రోజు పంచాంగం (${todayData.teediVaram})`,
      breadcrumbName: 'నేటి పంచాంగం',
    },
    '/rashi-phalalu': {
      primaryKeyword: 'రాశి ఫలాలు',
      secondaryKeywords: [
        'నేటి రాశి ఫలాలు',
        'rashi phalalu',
        'rasi phalalu',
        'today rashi phalalu in telugu',
        'rashi phalalu today in telugu',
        'ఈ రోజు రాశి ఫలాలు',
        'neti rashi phalalu',
        'daily horoscope in telugu',
        'ద్వాదశ రాశి ఫలాలు',
      ],
      title: 'రాశి ఫలాలు – నేటి రాశి ఫలాలు | Rashi Phalalu Today Telugu',
      description: `రాశి ఫలాలు (Rashi Phalalu Today in Telugu / Rasi Phalalu): ఈ రోజు (${todayData.teediVaram}, ${cleanNak}) మేషం నుండి మీనం వరకు 12 రాశుల నేటి రాశి ఫలాలు, చంద్రబలం & శుభ సమయం.`,
      h1: `రాశి ఫలాలు – నేటి రాశి ఫలాలు (Today Rashi Phalalu in Telugu – ${todayData.teediVaram})`,
      breadcrumbName: 'రాశి ఫలాలు (Rashi Phalalu)',
    },
    '/janma-kundali': {
      primaryKeyword: 'జన్మ కుండలి తెలుగులో',
      secondaryKeywords: [
        'jathakam by date of birth in telugu',
        'telugu jathakam free',
        'పుట్టిన తేదీ ప్రకారం జాతకం',
        'KP Astrology సబ్‌లార్డ్స్ తెలుగు',
        'రత్న రుద్రాక్ష సలహా',
      ],
      title: 'జన్మ కుండలి తెలుగులో – 29 అధ్యాయాల Jathakam & KP Kundali',
      description:
        'జన్మ కుండలి తెలుగులో (jathakam by date of birth in telugu): పుట్టిన తేదీ ప్రకారం 29 అధ్యాయాల బృహత్ జాతకం, అవకహడ చక్రం, సప్తవర్గ D1–D10, KP 249 సబ్‌లార్డ్స్, భృగు నాడి & మహాదశ ఉచితంగా.',
      h1: 'జన్మ కుండలి తెలుగులో – పుట్టిన తేదీ ప్రకారం 29 అధ్యాయాల బృహత్ జాతకం & KP కుండలి',
      breadcrumbName: 'జన్మ కుండలి తెలుగులో',
    },
    '/mee-jatakam': {
      primaryKeyword: 'telugu jathakam pdf',
      secondaryKeywords: ['జాతకం pdf', 'బృహత్ జాతకం', '29 అధ్యాయాల జాతకం pdf', 'KP జాతకం తెలుగు'],
      title: 'Telugu Jathakam PDF – 29 అధ్యాయాల బృహత్ జాతకం & KP PDF',
      description:
        'Telugu Jathakam PDF (జాతకం pdf): మీ పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా 29 అధ్యాయాల దృక్సిద్ధాంత బృహత్ జాతకం, KP సబ్‌లార్డ్స్, సప్తవర్గ D1–D10, 300 రాజయోగాలు PDF.',
      h1: 'పుట్టిన తేదీతో 29 అధ్యాయాల బృహత్ జాతకం & KP కుండలి – Telugu Jathakam PDF',
      breadcrumbName: 'Telugu Jathakam PDF',
    },
    '/vivaha-pontana': {
      primaryKeyword: 'వివాహ పొంతన',
      secondaryKeywords: [
        'marriage matching in telugu',
        '22 porutham matching in telugu',
        'pelli pontana',
        'అష్టకూట గుణ మిలనం',
        '36 గుణాలు 22 పొంతనలు',
      ],
      title: 'వివాహ పొంతన – 36 గుణాల అష్టకూటం & 22 పొంతనల మహామేళనం',
      description:
        'వివాహ పొంతన (marriage matching in telugu & pelli pontana): వధూవరుల నక్షత్రాల ఆధారంగా 36 గుణాల అష్టకూటం, దక్షిణ భారతీయ 22 పొంతనలు, రజ్జు మరియు కుజ దోష పరిశీలన.',
      h1: 'వివాహ పొంతన – 36 గుణాల అష్టకూట గుణ మిలనం & 22 పొంతనలు (Marriage Matching in Telugu)',
      breadcrumbName: 'వివాహ పొంతన',
    },
    '/telugu-baby-names': {
      primaryKeyword: 'నక్షత్రం ప్రకారం పిల్లల పేర్లు',
      secondaryKeywords: [
        'telugu baby names by nakshatra',
        'అబ్బాయిల పేర్లు తెలుగు',
        'అమ్మాయిల పేర్లు తెలుగు',
      ],
      title: 'నక్షత్రం ప్రకారం పిల్లల పేర్లు – Telugu Baby Names',
      description:
        'నక్షత్రం ప్రకారం పిల్లల పేర్లు (telugu baby names by nakshatra): 27 నక్షత్రాల 4 పాదాల అక్షరాలతో అబ్బాయిల పేర్లు తెలుగు & అమ్మాయిల పేర్లు తెలుగు.',
      h1: 'నక్షత్రం ప్రకారం పిల్లల పేర్లు (Telugu Baby Names by Nakshatra)',
      breadcrumbName: 'నక్షత్రం ప్రకారం పిల్లల పేర్లు',
    },
    '/gowri-panchangam': {
      primaryKeyword: 'గౌరీ పంచాంగం',
      secondaryKeywords: ['gowri panchangam telugu', 'గౌరీ పంచాంగం ఈ రోజు', 'హోరా చక్రం'],
      title: 'గౌరీ పంచాంగం – Gowri Panchangam Telugu & హోరా చక్రం',
      description:
        'గౌరీ పంచాంగం (gowri panchangam telugu): గౌరీ పంచాంగం ఈ రోజు పగలు-రాత్రి శుభ ఘడియలు (అమృతం, శుభం, లాభం, ధనం) మరియు 24 గంటల హోరా చక్రం.',
      h1: 'గౌరీ పంచాంగం – గౌరీ పంచాంగం ఈ రోజు & హోరా చక్రం (Gowri Panchangam Telugu)',
      breadcrumbName: 'గౌరీ పంచాంగం',
    },
    '/tarabalam-chandrabalam': {
      primaryKeyword: 'తారాబలం',
      secondaryKeywords: ['tarabalam calculator telugu', 'చంద్రబలం', 'తారాబలం ఈ రోజు'],
      title: 'తారాబలం క్యాలిక్యులేటర్ – Tarabalam Calculator Telugu',
      description: `తారాబలం (tarabalam calculator telugu): ఈ రోజు నక్షత్రం (${cleanNak}) ఆధారంగా 27 నక్షత్రాల తారాబలం ఈ రోజు మరియు 12 రాశుల చంద్రబలం ఫలితాలు.`,
      h1: 'తారాబలం & చంద్రబలం ఈ రోజు (Tarabalam Calculator Telugu)',
      breadcrumbName: 'తారాబలం',
    },
    '/naama-nakshatra': {
      primaryKeyword: 'పేరు ప్రకారం రాశి',
      secondaryKeywords: ['name nakshatra telugu', 'పేరు మొదటి అక్షరం నక్షత్రం'],
      title: 'పేరు ప్రకారం రాశి & నక్షత్రం – Name Nakshatra Telugu',
      description:
        'పేరు ప్రకారం రాశి (name nakshatra telugu): పుట్టిన సమయం తెలియకపోయినా పేరు మొదటి అక్షరం నక్షత్రం, పాదం, రాశి మరియు నాడి వివరాలను తెలుసుకోండి.',
      h1: 'పేరు ప్రకారం రాశి & మొదటి అక్షరం నక్షత్రం (Name Nakshatra Telugu)',
      breadcrumbName: 'పేరు ప్రకారం రాశి',
    },
    '/nitya-sankalpam': {
      primaryKeyword: 'సంకల్పం తెలుగులో',
      secondaryKeywords: ['pooja sankalpam in telugu', 'నిత్య సంకల్పం'],
      title: 'సంకల్పం తెలుగులో – నిత్య పూజా సంకల్పం (India & USA)',
      description: `సంకల్పం తెలుగులో (pooja sankalpam in telugu): శ్రీ పరాభవ నామ సంవత్సరం (${cleanTithi}, ${cleanNak}) నిత్య సంకల్పం మంత్రం – India & USA.`,
      h1: 'సంకల్పం తెలుగులో – నిత్య సంకల్పం మంత్రం (Pooja Sankalpam in Telugu)',
      breadcrumbName: 'సంకల్పం తెలుగులో',
    },
    '/kartika-abhishekam': {
      primaryKeyword: 'కార్తీక మాస ఏకవార రుద్రాభిషేకం',
      secondaryKeywords: [
        'kartika masam rudrabhishekam',
        'kartika somavaram abhishekam',
        'శ్రీ పరమేశ్వర ఏకవార రుద్రాభిషేకం',
        'కాశీ కాలభైరవ రక్ష',
        'కార్తీక మాసం పూజ గోత్రనామాలు',
      ],
      title: 'కార్తీక మాస ఏకవార రుద్రాభిషేకం – నెల రోజుల నిత్య సంకల్పం & ప్రసాదం',
      description:
        'కార్తీక మాస ఏకవార రుద్రాభిషేకం: నెల రోజుల పాటు మీ గోత్రనామాలతో పరమశివునికి నిత్య సంకల్పం. ప్రసాదంగా కాశీ కాలభైరవ రక్ష, విభూతి, గంధం మరియు ద్వాదశ రాశుల విశేష ఫలితాలు.',
      h1: 'కార్తీక మాస ఏకవార రుద్రాభిషేకం – భక్తుల గోత్రనామాలతో నెల రోజుల నిత్య పూజ',
      breadcrumbName: 'కార్తీక రుద్రాభిషేకం',
    },
    '/muhurtham': {
      primaryKeyword: 'శుభ ముహూర్తం',
      secondaryKeywords: [
        'how to choose good muhurtham',
        'when good muhurtham for marriage',
        'when good muhurtham for house warming',
        'when good muhurtham for vehicle purchase',
        'astrology horoscope telugu muhurtham',
        'వివాహ ముహూర్తం',
        'గృహ ప్రవేశ ముహూర్తం',
        'నేటి మంచి ముహూర్తం',
      ],
      title: 'శుభ ముహూర్తం నిర్ధారణ – వివాహ, గృహప్రవేశ, వ్యాపార ముహూర్తాలు | Muhurtham Finder',
      description:
        'శుభ ముహూర్తం (how to choose good muhurtham): వివాహం, గృహప్రవేశం, వాహనం, వ్యాపారం, బంగారం మరియు 50+ శుభకార్యాల వేద శాస్త్ర ప్రమాణ ముహూర్తాలు (Astrology Horoscope).',
      h1: 'శుభ ముహూర్తం – వేద మహర్షుల ప్రమాణ ముహూర్త నిర్ణయ యంత్రం (Muhurtham Finder)',
      breadcrumbName: 'శుభ ముహూర్తం',
    },
    '/shubha-muhurthalu': {
      primaryKeyword: 'శుభ ముహూర్తాలు 2026',
      secondaryKeywords: ['పెళ్లి ముహూర్తాలు 2026', 'గృహప్రవేశ ముహూర్తం', 'vivaha muhurtham 2026'],
      title: 'శుభ ముహూర్తాలు 2026 – పెళ్లి & గృహప్రవేశ ముహూర్తాలు',
      description:
        'శుభ ముహూర్తాలు 2026 (vivaha muhurtham 2026): పెళ్లి ముహూర్తాలు 2026, గృహప్రవేశ ముహూర్తం, అక్షరాభ్యాసం మరియు అన్నప్రాసన దృక్సిద్ధాంత తేదీలు.',
      h1: 'శుభ ముహూర్తాలు 2026 – పెళ్లి ముహూర్తాలు 2026 & గృహప్రవేశ ముహూర్తం',
      breadcrumbName: 'శుభ ముహూర్తాలు 2026',
    },
    '/vivaha-muhurtham': {
      primaryKeyword: 'వివాహ ముహూర్తాలు 2026-2027',
      secondaryKeywords: ['vivaha muhurtham telugu', 'పెళ్లి శుభ తేదీలు', 'marriage muhurtham dates'],
      title: 'వివాహ ముహూర్తాలు 2026-2027 – పెళ్లి శుభ తేదీలు & లగ్నం',
      description:
        'వివాహ ముహూర్తాలు 2026-2027: దృక్సిద్ధాంత గణితంతో పెళ్లి శుభ తేదీలు, ఏకవింశతి దోష నివారణ, శుభ లగ్నాలు మరియు వధూవరుల తారాబల విచారణ.',
      h1: 'వివాహ ముహూర్తాలు 2026–2027 – దోష రహిత పెళ్లి శుభ తేదీలు & లగ్న నియమాలు',
      breadcrumbName: 'వివాహ ముహూర్తాలు',
    },
    '/gruha-pravesha-muhurtham': {
      primaryKeyword: 'గృహ ప్రవేశ ముహూర్తాలు 2026-2027',
      secondaryKeywords: ['gruhapravesham muhurtham telugu', 'house warming dates telugu', 'నూతన గృహప్రవేశం'],
      title: 'గృహ ప్రవేశ ముహూర్తాలు 2026-2027 – నూతన గృహ శుభ తేదీలు',
      description:
        'గృహ ప్రవేశ ముహూర్తాలు 2026-2027: స్థిర లగ్న శుద్ధి, వశిష్ఠ సంహిత నక్షత్రాలు మరియు వాస్తు పురుష నియమాలతో నూతన గృహప్రవేశ శుభ తేదీలు.',
      h1: 'గృహ ప్రవేశ ముహూర్తాలు 2026–2027 – నూతన గృహప్రవేశ శుభ తేదీలు & వాస్తు పూజ',
      breadcrumbName: 'గృహ ప్రవేశ ముహూర్తాలు',
    },
    '/muhurtham/november-2026': {
      primaryKeyword: 'నవంబర్ 2026 శుభ ముహూర్తాలు',
      secondaryKeywords: ['november 2026 telugu muhurtham', 'నవంబర్ 2026 పెళ్లి ముహూర్తాలు'],
      title: 'నవంబర్ 2026 శుభ ముహూర్తాలు – వివాహ, గృహప్రవేశ తేదీలు',
      description:
        'నవంబర్ 2026 శుభ ముహూర్తాలు: కార్తీక – మార్గశిర మాసాలలో పెళ్లి, గృహప్రవేశం, వాహనం & వ్యాపార శుభ తేదీలు మరియు రాహుకాల సమయాలు.',
      h1: 'నవంబర్ 2026 శుభ ముహూర్తాలు – వివాహ, గృహప్రవేశ & వ్యాపార శుభ దినాలు',
      breadcrumbName: 'నవంబర్ 2026 ముహూర్తాలు',
    },
    '/muhurtham/december-2026': {
      primaryKeyword: 'డిసెంబర్ 2026 శుభ ముహూర్తాలు',
      secondaryKeywords: ['december 2026 telugu muhurtham', 'డిసెంబర్ 2026 పెళ్లి ముహూర్తాలు'],
      title: 'డిసెంబర్ 2026 శుభ ముహూర్తాలు – పెళ్లి & గృహప్రవేశ తేదీలు',
      description:
        'డిసెంబర్ 2026 శుభ ముహూర్తాలు: మార్గశిర శుద్ధ తిథులు, శుభ నక్షత్రాలు మరియు ధనుర్మాస నియమాలతో కూడిన పూర్తి ముహూర్త పట్టిక.',
      h1: 'డిసెంబర్ 2026 శుభ ముహూర్తాలు – మార్గశిర పెళ్లి & గృహప్రవేశ శుభ దినాలు',
      breadcrumbName: 'డిసెంబర్ 2026 ముహూర్తాలు',
    },
    '/muhurtham/january-2027': {
      primaryKeyword: 'జనవరి 2027 శుభ ముహూర్తాలు',
      secondaryKeywords: ['january 2027 telugu muhurtham', 'ఉత్తరాయణ ముహూర్తాలు 2027'],
      title: 'జనవరి 2027 శుభ ముహూర్తాలు – ఉత్తరాయణ శుభ తేదీలు',
      description:
        'జనవరి 2027 శుభ ముహూర్తాలు: మకర సంక్రాంతి ఉత్తరాయణ పుణ్యకాలం తదుపరి గృహప్రవేశం, వ్యాపారం, వాహన కొనుగోలు శుభ దినాల జాబితా.',
      h1: 'జనవరి 2027 శుభ ముహూర్తాలు – ఉత్తరాయణ శుభ తేదీలు & పంచాంగ శుద్ధి',
      breadcrumbName: 'జనవరి 2027 ముహూర్తాలు',
    },
    '/ugadi-rashi-phalalu': {
      primaryKeyword: 'ఉగాది రాశి ఫలాలు',
      secondaryKeywords: ['ugadi rashi phalalu 2026-27', 'ఉగాది పంచాంగం'],
      title: 'ఉగాది రాశి ఫలాలు 2026-27 – శ్రీ పరాభవ ఉగాది పంచాంగం',
      description:
        'ఉగాది రాశి ఫలాలు (ugadi rashi phalalu 2026-27): శ్రీ పరాభవ నామ సంవత్సర ఉగాది పంచాంగం, 12 రాశుల ఆదాయం – వ్యయం, రాజపూజ్యం – అవమానం.',
      h1: 'ఉగాది రాశి ఫలాలు 2026-27 – శ్రీ పరాభవ ఉగాది పంచాంగం',
      breadcrumbName: 'ఉగాది రాశి ఫలాలు',
    },
    '/vastu-shastra-telugu': {
      primaryKeyword: 'వాస్తు శాస్త్రం తెలుగులో',
      secondaryKeywords: [
        'ఇంటి వాస్తు',
        'east facing house vastu in telugu',
        'తూర్పు ముఖ ద్వారం వాస్తు',
      ],
      title: 'వాస్తు శాస్త్రం తెలుగులో – ఇంటి & తూర్పు ముఖ ద్వారం వాస్తు',
      description:
        'వాస్తు శాస్త్రం తెలుగులో (east facing house vastu in telugu): ఇంటి వాస్తు, తూర్పు ముఖ ద్వారం వాస్తు మరియు 8 దిక్కుల అష్టదిక్పాలక గృహ నియమాలు.',
      h1: 'వాస్తు శాస్త్రం తెలుగులో – ఇంటి వాస్తు & తూర్పు ముఖ ద్వారం వాస్తు',
      breadcrumbName: 'వాస్తు శాస్త్రం తెలుగులో',
    },
    '/dosha-pariharalu': {
      primaryKeyword: 'ఏలినాటి శని',
      secondaryKeywords: ['kuja dosham telugu', 'కాలసర్ప దోషం', 'shani sade sati telugu', 'అష్టమ శని'],
      title: 'ఏలినాటి శని, అష్టమ శని & కుజ దోషం పరిహారాలు తెలుగులో',
      description:
        'ఏలినాటి శని (shani sade sati telugu), అష్టమ శని, కుజ దోషం (kuja dosham telugu) మరియు కాలసర్ప దోషం ఉచిత పరిశీలన మరియు సాత్విక పరిహారాలు.',
      h1: 'ఏలినాటి శని, అష్టమ శని & కుజ దోషం శాంతి పరిహారాలు',
      breadcrumbName: 'ఏలినాటి శని & దోష పరిహారాలు',
    },
    '/kuja-dosha': {
      primaryKeyword: 'కుజ దోషం పరిహారాలు',
      secondaryKeywords: ['kuja dosham in telugu', 'manglik dosha telugu', 'కుజ దోషం మినహాయింపులు'],
      title: 'కుజ దోషం (Kuja Dosha Telugu) – లక్షణాలు, భంగం & పరిహారాలు',
      description:
        'కుజ దోషం తెలుగులో (Kuja Dosham): 1, 2, 4, 7, 8, 12 స్థానాల కుజ దోష పరిశీలన, శాస్త్రీయ మినహాయింపులు మరియు సుబ్రహ్మణ్య పరిహారాలు.',
      h1: 'కుజ దోషం (Kuja Dosham Telugu) – 1, 2, 4, 7, 8, 12 స్థానాల విశ్లేషణ & పరిహారాలు',
      breadcrumbName: 'కుజ దోషం',
    },
    '/kaal-sarp-dosha': {
      primaryKeyword: 'కాలసర్ప దోషం పరిహారాలు',
      secondaryKeywords: ['kaal sarp dosha telugu', 'రాహు కేతు దోషం', '12 కాలసర్ప యోగాలు'],
      title: 'కాలసర్ప దోషం (Kaal Sarp Dosha Telugu) – 12 రకాలు & పరిహారాలు',
      description:
        'కాలసర్ప దోషం (Kaal Sarp Dosha Telugu): అనంత నుండి శేషనాగ వరకు 12 రకాల కాలసర్ప దోషాల లక్షణాలు, శుభ ఫలాలు మరియు శ్రీకాళహస్తి పరిహారాలు.',
      h1: 'కాలసర్ప దోషం (Kaal Sarp Dosha Telugu) – 12 రకాలు, ఫలితాలు & శాంతి పరిహారాలు',
      breadcrumbName: 'కాలసర్ప దోషం',
    },
    '/dwadasa-rashi-rahasyalu': {
      primaryKeyword: '12 రాశుల దాంపత్యం & జీవన రహస్యాలు',
      secondaryKeywords: [
        'రాశి ప్రకారం భార్య భర్త మనస్తత్వం',
        'రాశి ప్రకారం పిల్లల విద్యా స్వభావం',
        'రాశి ప్రకారం వ్యాపార భాగస్వామ్యం',
        'రాశి ప్రకారం ఆరోగ్య రక్షణ',
        'పౌర్ణమి అమావాస్య ఏలినాటి శని మనోబలం',
      ],
      title: '12 రాశుల దాంపత్యం, పిల్లలు, వృత్తి, భాగస్వామ్యం & ఆరోగ్యం',
      description:
        'మేషం నుండి మీనం వరకు 12 రాశుల భార్య-భర్త మనస్తత్వం, పిల్లల చదువు & పెంపకం, వ్యాపార భాగస్వామ్యం, ధన ఆకర్షణ, ఆరోగ్యం & పౌర్ణమి-అమావాస్య-శని మనోబలం.',
      h1: 'ద్వాదశ రాశుల దాంపత్యం, సంతానం, వృత్తి-భాగస్వామ్యం & ఆరోగ్య విజ్ఞాన సర్వస్వం',
      breadcrumbName: '12 రాశుల జీవన విజ్ఞానం',
    },
    '/festivals': {
      primaryKeyword: 'తెలుగు పండుగలు 2026',
      secondaryKeywords: ['ఏకాదశి తేదీలు 2026', 'కార్తీక మాసం విశేషాలు', 'పౌర్ణమి అమావాస్య తేదీలు'],
      title: 'తెలుగు పండుగలు 2026 – ఏకాదశి & వ్రత తిథుల క్యాలెండర్',
      description:
        'తెలుగు పండుగలు 2026: కార్తీక మాసం విశేషాలు, ఏకాదశి వ్రతం, సంకష్టహర చతుర్థి, అమావాస్య మరియు పౌర్ణమి తేదీల సంపూర్ణ జాబితా.',
      h1: 'తెలుగు పండుగలు 2026 – ముఖ్య పండుగలు & ఏకాదశి తేదీల క్యాలెండర్',
      breadcrumbName: 'తెలుగు పండుగలు 2026',
    },
    '/services': {
      primaryKeyword: 'వైదిక పూజా సేవలు',
      secondaryKeywords: ['హోమ క్రతువులు', 'ముహూర్త నిర్ణయం'],
      title: 'వైదిక పూజా సేవలు & హోమ క్రతువులు | Telugu Jyothisham',
      description:
        'వైదిక పూజా సేవలు: బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో చండీ హోమం, లక్ష్మీ గణపతి హోమం, వివాహ మరియు గృహప్రవేశ ముహూర్త సేవలు.',
      h1: 'వైదిక పూజా సేవలు & మహా హోమ క్రతువులు',
      breadcrumbName: 'వైదిక పూజా సేవలు',
    },
    '/awards': {
      primaryKeyword: 'జల్లవరం సాయి ధీరజ్ శర్మ పరిచయం',
      secondaryKeywords: [],
      title: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ – మా గురించి | About Us',
      description:
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వ్యవస్థాపకులు, స్మార్త వేద మరియు దృక్సిద్ధాంత జ్యోతిష విద్వాంసులు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పరిచయం.',
      h1: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ – మా గురించి',
      breadcrumbName: 'మా గురించి (About)',
      canonicalPath: '/about',
      robots: 'noindex, follow',
    },
    '/about': {
      primaryKeyword: 'జల్లవరం సాయి ధీరజ్ శర్మ',
      secondaryKeywords: ['శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', 'స్మార్త వేద విద్వాంసులు'],
      title: 'జల్లవరం సాయి ధీరజ్ శర్మ – మా గురించి | Telugu Jyothisham',
      description:
        'జల్లవరం సాయి ధీరజ్ శర్మ: శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వ్యవస్థాపకులు, స్మార్త వేద మరియు దృక్సిద్ధాంత జ్యోతిష విద్వాంసుల శాస్త్రీయ అనుభవం.',
      h1: 'జల్లవరం సాయి ధీరజ్ శర్మ – మా గురించి (About Author & Peetham)',
      breadcrumbName: 'మా గురించి (About)',
    },
    '/contact': {
      primaryKeyword: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం సంప్రదింపులు',
      secondaryKeywords: ['హయత్‌నగర్ హైదరాబాద్', 'జాతక పరిశీలన సంప్రదింపులు'],
      title: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం సంప్రదింపులు | Contact Us',
      description:
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం సంప్రదింపులు: జాతక పరిశీలన, వివాహ పొంతన మరియు ముహూర్త నిర్ణయం కొరకు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని సంప్రదించండి.',
      h1: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం సంప్రదింపులు (Contact Telugu Jyothisham)',
      breadcrumbName: 'సంప్రదించండి (Contact)',
    },
    '/privacy-policy': {
      primaryKeyword: 'గోప్యతా విధానం',
      secondaryKeywords: ['privacy policy', 'జన్మ వివరాల భద్రత'],
      title: 'గోప్యతా విధానం (Privacy Policy) | Telugu Jyothisham',
      description:
        'గోప్యతా విధానం (Privacy Policy): telugujyothisham.com నందు జన్మ కుండలి టూల్స్‌లో నమోదు చేసే పుట్టిన తేదీ వివరాల గోప్యత మరియు కుకీల నిబంధనలు.',
      h1: 'గోప్యతా విధానం (Privacy Policy)',
      breadcrumbName: 'గోప్యతా విధానం',
    },
    '/privacy': {
      primaryKeyword: 'గోప్యతా విధానం సమాచారం',
      secondaryKeywords: [],
      title: 'గోప్యతా విధానం (Privacy Policy) | Telugu Jyothisham',
      description:
        'telugujyothisham.com భక్తుల వ్యక్తిగత సమాచార భద్రత, కుకీల వినియోగం మరియు Google AdSense గోప్యతా నిబంధనల వివరాలు.',
      h1: 'గోప్యతా విధానం (Privacy Policy)',
      breadcrumbName: 'గోప్యతా విధానం',
      canonicalPath: '/privacy-policy',
      robots: 'noindex, follow',
    },
    '/disclaimer': {
      primaryKeyword: 'జ్యోతిష్య గమనిక',
      secondaryKeywords: ['disclaimer', 'for informational and cultural purposes only'],
      title: 'జ్యోతిష్య గమనిక (Disclaimer) | Telugu Jyothisham',
      description:
        'జ్యోతిష్య గమనిక (Disclaimer): telugujyothisham.com నందు ప్రచురించబడే పంచాంగం మరియు జ్యోతిష్య సమాచారం గురించిన ముఖ్య గమనిక (Informational & cultural only).',
      h1: 'జ్యోతిష్య గమనిక (Official Disclaimer)',
      breadcrumbName: 'జ్యోతిష్య గమనిక',
    },
    '/terms-and-conditions': {
      primaryKeyword: 'నిబంధనలు మరియు షరతులు',
      secondaryKeywords: ['terms and conditions'],
      title: 'నిబంధనలు మరియు షరతులు (Terms & Conditions) | జ్యోతిషం',
      description:
        'నిబంధనలు మరియు షరతులు (Terms & Conditions): telugujyothisham.com వెబ్‌సైట్ వినియోగ నిబంధనలు, కాపీరైట్ హక్కులు మరియు మార్గదర్శకాలు.',
      h1: 'నిబంధనలు మరియు షరతులు (Terms & Conditions)',
      breadcrumbName: 'నిబంధనలు మరియు షరతులు',
    },
    '/vedic-articles': {
      primaryKeyword: 'వేద జ్యోతిష శాస్త్రాలు & వ్యాసాలు',
      secondaryKeywords: [
        'vedic astrology articles',
        'భావార్థ రత్నాకర 300 రాజయోగాలు',
        'ఆయుర్వేద వైద్య జ్యోతిషం త్రిదోషాలు',
        'అష్ట మహా జ్యోతిష గ్రంథాల రహస్యాలు',
        'Classical Vedic Parashara Varahamihira archive',
        'Pawan Kalyan raja yoga horoscope',
        'FMGE medical astrology doctor yoga',
        'Swapna shastra dream meaning in Telugu',
      ],
      title: 'వేద జ్యోతిష వ్యాసాలు (16+ Articles) – భావార్థ రత్నాకర, 300 రాజయోగాలు, పరాశర & వైద్య జ్యోతిషం',
      description:
        '16+ ప్రాచీన & ట్రెండింగ్ వేద జ్యోతిష వ్యాసాలు: శ్రీ రామానుజాచార్య భావార్థ రత్నాకర, 300 మహారాజ యోగాలు, ఆయుర్వేద వైద్య జ్యోతిషం, అష్ట మహా గ్రంథాలు, స్వరోదయ, బాలారిష్ట & స్వప్న శాస్త్రం.',
      h1: 'వేద జ్యోతిష శాస్త్ర రహస్యాలు & ప్రాచీన పరిశోధనా వ్యాసాల భాండాగారం (16 Standalone Articles)',
      breadcrumbName: 'వేద శాస్త్రాలు & వ్యాసాలు',
    },
    '/festivals-calendar': {
      primaryKeyword: 'తెలుగు పండుగలు & వ్రత క్యాలెండర్',
      secondaryKeywords: ['ekadashi dates telugu', 'pradosham calendar', 'sankashti chaturthi', 'pournami amavasya dates'],
      title: 'తెలుగు పండుగలు & వ్రత క్యాలెండర్ – ఏకాదశి, ప్రదోషం, పౌర్ణమి',
      description:
        '12 నెలల దృక్సిద్ధాంత తెలుగు పండుగలు & వ్రత క్యాలెండర్: ఏకాదశి, ప్రదోషం, సంకష్టహర చతుర్థి, పౌర్ణమి, అమావాస్య, మాస శివరాత్రి తేదీలు & నిత్య సంకల్పం.',
      h1: '12 నెలల తెలుగు పండుగలు, ఏకాదశి, ప్రదోషం & వ్రత క్యాలెండర్',
      breadcrumbName: 'పండుగలు & వ్రత క్యాలెండర్',
    },
    '/prashna-kundali': {
      primaryKeyword: 'తక్షణ ప్రశ్న కుండలి (1-249 KP Horary)',
      secondaryKeywords: ['kp prashna kundali telugu', 'horary astrology 1 to 249', 'prashna shastra telugu'],
      title: 'KP ప్రశ్న కుండలి (1–249) – తక్షణ హోరరీ ఫలితాలు తెలుగులో',
      description:
        'జన్మ సమయం లేకున్నా 1 నుండి 249 సంఖ్యతో తక్షణ KP ప్రశ్న కుండలి (Horary Prashna Kundali): ఉద్యోగం, వివాహం, వీసా & ఆస్తి ఫలితాలు.',
      h1: 'తక్షణ KP ప్రశ్న కుండలి (1–249 సబ్‌లార్డ్ హోరరీ గణితం)',
      breadcrumbName: 'KP ప్రశ్న కుండలి',
    },
    '/ratna-rudraksha': {
      primaryKeyword: 'లగ్న రత్నం & రుద్రాక్ష సలహా',
      secondaryKeywords: ['lucky gemstone by lagna telugu', 'rudraksha recommendation telugu', 'ratna shastra'],
      title: 'లగ్న రత్నం, రుద్రాక్ష & దోష పరిహార సలహా | Telugu Astrology',
      description:
        'మీ జన్మ లగ్నం ప్రకారం ధరించదగిన అదృష్ట రత్నం, ధరించకూడని రత్నాలు, ముఖి రుద్రాక్ష మరియు వ్యక్తిగత హోమ-పూజా పరిహార మార్గదర్శిని.',
      h1: 'లగ్న ఆధారిత రత్న శాస్త్రం, రుద్రాక్ష & దోష పరిహార మార్గదర్శి',
      breadcrumbName: 'రత్నం & రుద్రాక్ష సలహా',
    },
  };

  const articleMatch = VEDIC_CLASSICAL_ARTICLES.find(
    (a) => pathname === `/${a.slug}`
  );
  if (articleMatch) {
    const canonical = `${SITE_URL}/${articleMatch.slug}`;
    const rawSeoTitle = articleMatch.telugu.seoTitle || `${articleMatch.telugu.title} | వేద జ్యోతిషం`;
    const title = clampTitle(rawSeoTitle, 65);
    const desc = clampMetaDescription(articleMatch.telugu.metaDescription, 160);
    return {
      title,
      description: desc,
      canonical,
      robots: defaultRobots,
      h1: articleMatch.telugu.title,
      primaryKeyword: articleMatch.telugu.primaryKeyword,
      secondaryKeywords: articleMatch.telugu.secondaryKeywords,
      ogTitle: title,
      ogDescription: desc,
      ogUrl: canonical,
      ogImage: `${SITE_URL}${articleMatch.heroImage}`,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: 'వేద శాస్త్రాలు', item: `${SITE_URL}/vedic-articles` },
        { name: articleMatch.telugu.primaryKeyword, item: canonical },
      ],
      faqItems: [
        ...articleMatch.telugu.faqs.map((f) => ({ q: f.question, a: f.answer })),
        ...articleMatch.english.faqs.map((f) => ({ q: f.question, a: f.answer })),
      ],
    };
  }

  const matched = routeTable[pathname];
  if (matched) {
    const canonical = `${SITE_URL}${matched.canonicalPath || pathname}`;
    const title = clampTitle(matched.title);
    const desc = clampMetaDescription(matched.description);
    const guide = TOOL_PAGE_ORIGINAL_GUIDES[pathname];
    return {
      title,
      description: desc,
      canonical,
      robots: matched.robots || defaultRobots,
      h1: matched.h1,
      primaryKeyword: matched.primaryKeyword,
      secondaryKeywords: matched.secondaryKeywords,
      ogTitle: title,
      ogDescription: desc,
      ogUrl: canonical,
      ogImage: defaultOgImage,
      breadcrumbs: [
        { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
        { name: matched.breadcrumbName, item: canonical },
      ],
      faqItems: guide?.faqListTe,
    };
  }

  // Fallback for any legacy alias (/neti-panchangam, /today-panchangam-in-telugu, /ee-roju-panchangam)
  const fallbackTitle = clampTitle('నేటి పంచాంగం (Neti Panchangam) – ఈ రోజు తిథి, నక్షత్రం');
  const fallbackDesc = clampMetaDescription(
    `నేటి పంచాంగం: ఈ రోజు తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, రాహుకాలం, వర్జ్యం, అభిజిత్ ముహూర్తం & రాశి ఫలాలు.`
  );
  return {
    title: fallbackTitle,
    description: fallbackDesc,
    canonical: `${SITE_URL}/panchangam`,
    robots: 'noindex, follow',
    h1: `నేటి పంచాంగం – ఈ రోజు పంచాంగం (${todayData.teediVaram})`,
    primaryKeyword: 'నేటి పంచాంగం',
    secondaryKeywords: [],
    ogTitle: fallbackTitle,
    ogDescription: fallbackDesc,
    ogUrl: `${SITE_URL}/panchangam`,
    ogImage: defaultOgImage,
    breadcrumbs: [
      { name: 'తెలుగు జ్యోతిషం (Home)', item: `${SITE_URL}/` },
      { name: 'నేటి పంచాంగం', item: `${SITE_URL}/panchangam` },
    ],
  };
}

/**
 * Builds clean Schema.org JSON-LD with WebSite, Organization,
 * Person (Jallavaram Sai Dheeraj Sharma), BreadcrumbList, and FAQPage (ONLY when FAQ is visible on the page).
 * Strictly marks up visible content only — no fake reviews, ratings, or awards.
 */
export function buildCleanJsonLdSchema(meta: PageSeoMetadata): Record<string, unknown> {
  const graph: Record<string, unknown>[] = [
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
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
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
        '37-Chapter Janma Kundali, Brihat Jataka, JHora Shodashavarga D1-D60, BTR & Live Sky Radar',
        'KP Astrology (249 Sub-Lords & Horary Prashna Kundali)',
        'Lagna Ratna (Gemstone) & Rudraksha Shastra',
        '12-Month Astronomical Vrata & Telugu Festival Calendar',
        'Ashtakoota 36-Guna & 22-Porutham Vivaha Pontana',
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
  ];

  if (meta.faqItems && meta.faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${meta.canonical}#faq`,
      mainEntity: meta.faqItems.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  const todayIsoForSchema = getTodayIsoDateIST();
  graph.push({
    '@type': 'WebPage',
    '@id': `${meta.canonical}#webpage`,
    url: meta.canonical,
    name: meta.title,
    headline: meta.h1,
    description: meta.description,
    inLanguage: ['te', 'en'],
    datePublished: '2026-01-01',
    dateModified: todayIsoForSchema,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@id': `${SITE_URL}/#organization`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '#rashi-phalalu-featured-snippet'],
    },
  });

  const interactiveAppRoutes = new Set([
    `${SITE_URL}/janma-kundali`,
    `${SITE_URL}/mee-jatakam`,
    `${SITE_URL}/vivaha-pontana`,
    `${SITE_URL}/telugu-baby-names`,
    `${SITE_URL}/muhurtham`,
    `${SITE_URL}/vivaha-muhurtham`,
    `${SITE_URL}/gruha-pravesha-muhurtham`,
    `${SITE_URL}/kuja-dosha`,
    `${SITE_URL}/kaal-sarp-dosha`,
    `${SITE_URL}/prashna-kundali`,
    `${SITE_URL}/ratna-rudraksha`,
    `${SITE_URL}/tarabalam-chandrabalam`,
    `${SITE_URL}/nitya-sankalpam`,
    `${SITE_URL}/festivals-calendar`,
    `${SITE_URL}/gowri-panchangam`,
  ]);
  if (interactiveAppRoutes.has(meta.canonical)) {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${meta.canonical}#webapp`,
      name: meta.h1,
      url: meta.canonical,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'All',
      inLanguage: ['te', 'en'],
      description: meta.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      author: {
        '@id': `${SITE_URL}/#person`,
      },
    });
  }

  if (
    meta.canonical === `${SITE_URL}/rashi-phalalu` ||
    meta.canonical.startsWith(`${SITE_URL}/rashi-phalalu/`)
  ) {
    const todayData = getOrGenerateDayData(todayIsoForSchema, WEEK_DATA);
    const rashiFortunes = getDailyRashiFortunes(todayData);
    graph.push({
      '@type': 'ItemList',
      '@id': `${meta.canonical}#12-rashi-sitelinks`,
      name: `రాశి ఫలాలు – నేటి 12 రాశుల దిన ఫలాలు (Today Rashi Phalalu in Telugu & English – ${todayData.teediVaram})`,
      description:
        'మేషం నుండి మీనం వరకు 12 రాశుల నేటి రాశి ఫలాలు (Mesha, Vrushabha, Mithuna, Karkataka, Simha, Kanya, Tula, Vruschika, Dhanussu, Makara, Kumbha, Meena Daily Horoscope in Telugu & English).',
      numberOfItems: rashiFortunes.length,
      itemListElement: rashiFortunes.map((r, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/rashi-phalalu/${r.id}`,
        name: `${r.teluguName} రాశి ఫలాలు (${r.englishName} Rashi Phalalu Today)`,
        description: `${r.teluguName} రాశి (${r.statusLabel} / ${r.statusLabelEn}): ${r.grahaDrishtiPhalamTe} శుభ సమయం: ${r.luckyTimeWindowTe}, అదృష్ట సంఖ్య: #${r.luckyNumber}, పరిహారం: ${r.remedy}.`,
      })),
    });
  }

  if (meta.canonical === `${SITE_URL}/festivals-calendar`) {
    const [sy, sm] = todayIsoForSchema.split('-').map(Number);
    const monthlyGroups = generate12MonthVratasAndFestivals(sy || 2026, (sm || 11) - 1, 12);
    const upcomingMajor = monthlyGroups
      .flatMap((g) => g.events)
      .filter((e) => e.isMajorFestival || e.category === 'ekadashi' || e.category === 'pournami')
      .slice(0, 15);
    graph.push({
      '@type': 'ItemList',
      '@id': `${SITE_URL}/festivals-calendar#vrata-events`,
      name: '12 నెలల తెలుగు పండుగలు, ఏకాదశి & పౌర్ణమి వ్రత తేదీలు',
      numberOfItems: upcomingMajor.length,
      itemListElement: upcomingMajor.map((ev, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Event',
          name: `${ev.titleTe} (${ev.titleEn})`,
          startDate: ev.isoDate,
          endDate: ev.isoDate,
          description: `${ev.tithiTe} · ${ev.significanceTe}`,
          url: `${SITE_URL}/panchangam/${ev.isoDate}`,
          eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: 'Sreelakshmi Ganapathi Jyothishalayam (Online & Hyderabad)',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Hyderabad',
              addressRegion: 'Telangana',
              addressCountry: 'IN',
            },
          },
        },
      })),
    });
  }

  if (meta.canonical === `${SITE_URL}/vedic-articles`) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${SITE_URL}/vedic-articles#article-list`,
      name: 'వేద జ్యోతిష శాస్త్ర రహస్యాలు & పరిశోధనా వ్యాసాలు (16 Standalone Vedic Astrology Treatises)',
      numberOfItems: VEDIC_CLASSICAL_ARTICLES.length,
      itemListElement: VEDIC_CLASSICAL_ARTICLES.map((art, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/${art.slug}`,
        name: `${art.telugu.title} | ${art.english.title}`,
        image: `${SITE_URL}${art.heroImage}`,
      })),
    });
  }

  const articleMatch = VEDIC_CLASSICAL_ARTICLES.find(
    (a) => meta.canonical === `${SITE_URL}/${a.slug}`
  );
  if (articleMatch) {
    graph.push({
      '@type': 'Article',
      '@id': `${meta.canonical}#article`,
      headline: articleMatch.telugu.title,
      alternativeHeadline: articleMatch.english.title,
      description: articleMatch.telugu.metaDescription,
      image: [
        {
          '@type': 'ImageObject',
          url: `${SITE_URL}${articleMatch.heroImage}`,
          width: 1280,
          height: 720,
          caption: articleMatch.imageAltTe,
        },
      ],
      inLanguage: ['te', 'en'],
      mainEntityOfPage: meta.canonical,
      datePublished: articleMatch.datePublished,
      dateModified: articleMatch.dateModified,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', 'h3'],
      },
      author: {
        '@type': 'Person',
        name: 'Jallavaram Sai Dheeraj Sharma',
        alternateName: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ',
        url: `${SITE_URL}/about`,
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      keywords: [
        articleMatch.telugu.primaryKeyword,
        ...articleMatch.telugu.secondaryKeywords,
        articleMatch.english.primaryKeyword,
        ...articleMatch.english.secondaryKeywords,
      ].join(', '),
      ...(articleMatch.archivalSource
        ? {
            citation: {
              '@type': 'PublicationIssue',
              issueNumber: articleMatch.archivalSource.issue,
              datePublished: String(articleMatch.archivalSource.year),
              isPartOf: {
                '@type': 'Periodical',
                name: articleMatch.archivalSource.publication,
                editor: {
                  '@type': 'Person',
                  name: articleMatch.archivalSource.editor,
                },
                publisher: {
                  '@type': 'Organization',
                  name: articleMatch.archivalSource.publisher,
                },
              },
            },
          }
        : {}),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderRichToolGuideHtml(pathname: string): string {
  const article = VEDIC_CLASSICAL_ARTICLES.find((a) => pathname === `/${a.slug}`);
  if (article) {
    const te = article.telugu;
    const en = article.english;
    const archivalHtml = article.archivalSource
      ? `
        <div style="padding:18px;background:#fefce8;border:2px solid #f59e0b;border-radius:14px;margin-bottom:22px;color:#451a03;">
          <div style="font-size:12px;font-weight:800;text-transform:uppercase;color:#92400e;margin-bottom:6px;">
            📜 చారిత్రక గ్రంథ నివాళి &amp; సౌజన్య ప్రకటన (Archival Citation &amp; Book Tribute – ${article.archivalSource.year})
          </div>
          <p style="margin:0 0 8px;font-size:15px;font-weight:700;">
            మూల పత్రిక: ${escapeHtml(article.archivalSource.publicationTe)} (${escapeHtml(article.archivalSource.issueTe)})
          </p>
          <p style="margin:0 0 8px;font-size:13.5px;">
            <strong>సంపాదకులు (Editor):</strong> ${escapeHtml(article.archivalSource.editorTe)} | 
            <strong>ప్రచురణాలయం (Publisher):</strong> ${escapeHtml(article.archivalSource.publisherTe)}
          </p>
          <ul style="margin:6px 0 10px 18px;font-size:13.5px;">
            ${article.archivalSource.originalArticles
              .map(
                (orig) =>
                  `<li><strong>${escapeHtml(orig.titleTe)}</strong> — రచన: ${escapeHtml(orig.authorTe)} (${escapeHtml(orig.pages)})</li>`
              )
              .join('')}
          </ul>
          <p style="margin:0;font-size:13px;background:#78350f;color:#fef3c7;padding:10px 14px;border-radius:8px;">
            ${escapeHtml(article.archivalSource.tributeNoteTe)}
          </p>
        </div>`
      : '';

    return `
      <article aria-label="${escapeHtml(te.title)}" style="background:#ffffff;border:2px solid #b45309;border-radius:18px;padding:24px;margin-bottom:24px;color:#1e293b;line-height:1.7;">
        <div style="border-bottom:2px solid #fef3c7;padding-bottom:16px;margin-bottom:20px;">
          <span style="display:inline-block;padding:4px 12px;background:#fef3c7;color:#92400e;border-radius:9999px;font-size:12px;font-weight:700;text-transform:uppercase;border:1px solid #fde68a;">
            ${escapeHtml(article.categoryTe)} • ${escapeHtml(article.categoryEn)}
          </span>
          <h1 style="margin:12px 0 8px;font-size:26px;color:#451a03;line-height:1.3;">${escapeHtml(te.title)}</h1>
          <h2 style="margin:0 0 10px;font-size:18px;color:#78350f;font-weight:600;">${escapeHtml(en.title)}</h2>
          <div style="font-size:13px;color:#64748b;">
            <span>రచన / విశ్లేషణ: <strong>బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ</strong></span> • 
            <span>పఠన సమయం: <strong>${article.readTimeMinutes} నిమిషాలు</strong></span> • 
            <span>సంప్రదాయం: <strong>పరాశర &amp; సూర్య సిద్ధాంత వైదిక క్రమం</strong></span>
          </div>
          <div style="margin:16px 0 6px;border-radius:14px;overflow:hidden;border:2px solid #f59e0b;">
            <img src="${escapeHtml(article.heroImage)}" alt="${escapeHtml(article.imageAltTe)}" referrerpolicy="no-referrer" style="width:100%;height:auto;display:block;" />
          </div>
        </div>

        ${archivalHtml}

        <div style="padding:14px 18px;background:#fffbeb;border-left:4px solid #d97706;border-radius:8px;margin-bottom:22px;font-size:15px;color:#78350f;">
          <strong>సారాంశం (Executive Summary):</strong> ${escapeHtml(te.summary)}
        </div>

        ${te.sections
          .map(
            (sec) => `
          <section style="margin-bottom:26px;">
            <h3 style="margin:0 0 8px;font-size:20px;color:#9a3412;">${escapeHtml(sec.heading)}</h3>
            ${sec.subheading ? `<h4 style="margin:0 0 10px;font-size:16px;color:#b45309;">${escapeHtml(sec.subheading)}</h4>` : ''}
            ${
              sec.shloka
                ? `
              <div style="margin:12px 0;padding:14px 18px;background:#fefce8;border:1px dashed #ca8a04;border-radius:10px;text-align:center;">
                <p style="margin:0 0 6px;font-size:16px;font-weight:bold;color:#713f12;letter-spacing:0.5px;">${escapeHtml(sec.shloka.sanskrit)}</p>
                <p style="margin:0;font-size:13.5px;color:#854d0e;font-style:italic;">తాత్పర్యం: ${escapeHtml(sec.shloka.meaning)}</p>
              </div>`
                : ''
            }
            <p style="font-size:15px;color:#334155;margin:8px 0 12px;white-space:pre-line;">${escapeHtml(sec.content)}</p>
            ${
              sec.keyPoints && sec.keyPoints.length > 0
                ? `
              <ul style="margin:8px 0 14px 20px;color:#334155;font-size:14.5px;">
                ${sec.keyPoints.map((pt) => `<li style="margin-bottom:6px;">✦ ${escapeHtml(pt)}</li>`).join('')}
              </ul>`
                : ''
            }
            ${
              sec.table
                ? `
              <div style="overflow-x:auto;margin:14px 0;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left;">
                  <thead>
                    <tr style="background:#fef3c7;color:#78350f;">
                      ${sec.table.headers.map((h) => `<th style="padding:10px;border:1px solid #fde68a;">${escapeHtml(h)}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${sec.table.rows
                      .map(
                        (row) => `
                      <tr style="border-bottom:1px solid #fef3c7;">
                        ${row.map((cell) => `<td style="padding:10px;border:1px solid #fde68a;">${escapeHtml(cell)}</td>`).join('')}
                      </tr>`
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>`
                : ''
            }
          </section>`
          )
          .join('')}

        ${
          te.remedies && te.remedies.length > 0
            ? `
          <section style="margin-bottom:26px;padding:18px;background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;">
            <h3 style="margin:0 0 12px;font-size:19px;color:#9a3412;">శాస్త్రీయ పరిహారాలు &amp; సాధనా మార్గాలు (Vedic Remedies)</h3>
            ${te.remedies
              .map(
                (rem) => `
              <div style="margin-bottom:14px;">
                <h4 style="margin:0 0 4px;font-size:16px;color:#7c2d12;">✦ ${escapeHtml(rem.title)}</h4>
                <p style="margin:0 0 6px;font-size:14.5px;color:#334155;">${escapeHtml(rem.description)}</p>
                ${rem.mantra ? `<div style="padding:8px 12px;background:#ffffff;border:1px dashed #f97316;border-radius:8px;font-weight:600;color:#9a3412;margin:6px 0;">మంత్రం: ${escapeHtml(rem.mantra)}</div>` : ''}
              </div>`
              )
              .join('')}
          </section>`
            : ''
        }

        <section style="margin-bottom:24px;">
          <h3 style="margin:0 0 12px;font-size:19px;color:#78350f;">తరచుగా అడిగే ప్రశ్నలు (Telugu FAQ)</h3>
          <div>
            ${te.faqs
              .map(
                (f) => `
              <div style="margin-bottom:12px;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
                <strong style="display:block;color:#451a03;font-size:15px;margin-bottom:4px;">ప్రశ్న: ${escapeHtml(f.question)}</strong>
                <p style="margin:0;color:#334155;font-size:14.5px;">సమాధానం: ${escapeHtml(f.answer)}</p>
              </div>`
              )
              .join('')}
          </div>
        </section>

        <hr style="border:none;border-top:2px dashed #f59e0b;margin:28px 0;" />

        <section aria-label="${escapeHtml(en.title)}" style="margin-bottom:24px;">
          <h2 style="margin:0 0 10px;font-size:22px;color:#451a03;">${escapeHtml(en.title)}</h2>
          <p style="padding:12px 16px;background:#fffbeb;border-left:4px solid #d97706;border-radius:8px;margin-bottom:18px;font-size:14.5px;color:#78350f;">
            <strong>Executive Summary:</strong> ${escapeHtml(en.summary)}
          </p>
          ${en.sections
            .map(
              (sec) => `
            <div style="margin-bottom:20px;">
              <h3 style="margin:0 0 6px;font-size:18px;color:#9a3412;">${escapeHtml(sec.heading)}</h3>
              ${sec.subheading ? `<h4 style="margin:0 0 8px;font-size:15px;color:#b45309;">${escapeHtml(sec.subheading)}</h4>` : ''}
              <p style="font-size:14.5px;color:#334155;margin:6px 0 10px;white-space:pre-line;">${escapeHtml(sec.content)}</p>
              ${
                sec.table
                  ? `
                <div style="overflow-x:auto;margin:12px 0;">
                  <table style="width:100%;border-collapse:collapse;font-size:13.5px;text-align:left;">
                    <thead>
                      <tr style="background:#fef3c7;color:#78350f;">
                        ${sec.table.headers.map((h) => `<th style="padding:8px;border:1px solid #fde68a;">${escapeHtml(h)}</th>`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${sec.table.rows
                        .map(
                          (row) => `
                        <tr style="border-bottom:1px solid #fef3c7;">
                          ${row.map((cell) => `<td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(cell)}</td>`).join('')}
                        </tr>`
                        )
                        .join('')}
                    </tbody>
                  </table>
                </div>`
                  : ''
              }
            </div>`
            )
            .join('')}

          <h3 style="margin:18px 0 12px;font-size:18px;color:#78350f;">Frequently Asked Questions (English FAQ)</h3>
          <div>
            ${en.faqs
              .map(
                (f) => `
              <div style="margin-bottom:10px;padding:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
                <strong style="display:block;color:#451a03;font-size:14.5px;margin-bottom:4px;">Q: ${escapeHtml(f.question)}</strong>
                <p style="margin:0;color:#334155;font-size:14px;">A: ${escapeHtml(f.answer)}</p>
              </div>`
              )
              .join('')}
          </div>
        </section>

        <div style="padding-top:16px;border-top:1px solid #fef3c7;margin-top:20px;">
          <h4 style="margin:0 0 10px;font-size:15px;color:#78350f;">ఇతర ప్రత్యేక వేద జ్యోతిష వ్యాసాలు (All Standalone Articles):</h4>
          <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:13px;">
            <a href="/vedic-articles" style="color:#b45309;text-decoration:none;font-weight:bold;">📚 అన్ని వ్యాసాలు (Directory)</a>
            ${VEDIC_CLASSICAL_ARTICLES.filter((other) => other.slug !== article.slug)
              .map(
                (other) =>
                  `• <a href="/${other.slug}" style="color:#b45309;text-decoration:none;font-weight:bold;">${escapeHtml(other.telugu.primaryKeyword)} (${escapeHtml(other.english.primaryKeyword)})</a>`
              )
              .join(' ')}
            • <a href="/panchangam" style="color:#b45309;text-decoration:none;font-weight:bold;">నేటి పంచాంగం</a>
            • <a href="/janma-kundali" style="color:#b45309;text-decoration:none;font-weight:bold;">ఉచిత జన్మ కుండలి PDF</a>
          </div>
        </div>
      </article>`;
  }

  if (pathname === '/vedic-articles') {
    return `
      <article aria-label="వేద జ్యోతిష శాస్త్ర రహస్యాలు" style="background:#ffffff;border:2px solid #b45309;border-radius:18px;padding:24px;margin-bottom:24px;color:#1e293b;line-height:1.7;">
        <div style="border-bottom:2px solid #fef3c7;padding-bottom:16px;margin-bottom:20px;">
          <span style="display:inline-block;padding:4px 12px;background:#fef3c7;color:#92400e;border-radius:9999px;font-size:12px;font-weight:700;text-transform:uppercase;border:1px solid #fde68a;">
            ప్రాచీన వేద జ్యోతిష గ్రంథాలు &amp; మహర్షి సిద్ధాంతాలు • Standalone Treatises
          </span>
          <h1 style="margin:12px 0 8px;font-size:26px;color:#451a03;line-height:1.3;">వేద జ్యోతిష శాస్త్ర రహస్యాలు &amp; ప్రాచీన గ్రంథ పరిశోధనా వ్యాసాలు</h1>
          <p style="font-size:15px;color:#78350f;margin:0;">
            మహర్షి పరాశరుని "బృహత్ పరాశర హోరా శాస్త్రం", వరాహమిహిరుని "బృహజ్జాతకం", మహర్షి జైమిని సూత్రాలు, మంత్రేశ్వరుని "ఫలదీపిక", శ్రీ రామానుజాచార్యుల "భావార్థ రత్నాకర", సముద్ర మహర్షి "సాముద్రిక శాస్త్రం", కేరళ "ప్రశ్నమార్గ", "శివ స్వరోదయ శాస్త్రం" మరియు ఆయుర్వేద వైద్య జ్యోతిష గ్రంథాల ఆధారంగా రచించబడిన సంపూర్ణ వ్యాసాలు — ప్రతి వ్యాసం ప్రత్యేక 16:9 చిత్రం మరియు సొంత పేజీ లింక్‌తో.
          </p>
        </div>

        <div style="display:grid;gap:18px;margin-bottom:24px;">
          ${VEDIC_CLASSICAL_ARTICLES.map(
            (art) => `
            <div style="padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
              <div style="margin-bottom:10px;border-radius:10px;overflow:hidden;border:1px solid #f59e0b;">
                <a href="/${art.slug}">
                  <img src="${escapeHtml(art.heroImage)}" alt="${escapeHtml(art.imageAltTe)}" referrerpolicy="no-referrer" style="width:100%;height:auto;display:block;" />
                </a>
              </div>
              <span style="display:inline-block;padding:2px 8px;background:#fef3c7;color:#92400e;border-radius:4px;font-size:11px;font-weight:bold;margin-bottom:6px;">
                ${escapeHtml(art.categoryTe)} • ${art.readTimeMinutes} నిమిషాల పఠనం
              </span>
              <h2 style="margin:0 0 4px;font-size:18px;color:#451a03;">
                <a href="/${art.slug}" style="color:#451a03;text-decoration:none;">${escapeHtml(art.telugu.title)}</a>
              </h2>
              <h3 style="margin:0 0 8px;font-size:14px;color:#78350f;font-weight:600;">
                <a href="/${art.slug}" style="color:#78350f;text-decoration:none;">${escapeHtml(art.english.title)}</a>
              </h3>
              <p style="margin:0 0 10px;font-size:14px;color:#475569;">${escapeHtml(art.telugu.summary)}</p>
              <a href="/${art.slug}" style="display:inline-block;padding:6px 14px;background:#d97706;color:#ffffff;border-radius:8px;font-size:13px;font-weight:bold;text-decoration:none;">
                సంపూర్ణ వ్యాసం చదవండి (Read Full Article) →
              </a>
            </div>`
          ).join('')}
        </div>
      </article>`;
  }

  const guide = TOOL_PAGE_ORIGINAL_GUIDES[pathname];

  if (guide) {
    return `
      <article aria-label="Vedic Tool Detailed Guide in Telugu" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">${escapeHtml(guide.howItWorksTitle)}</h2>
        <p style="margin:0 0 14px;font-size:15px;color:#1e293b;">${escapeHtml(guide.introTe)}</p>
        <p style="margin:0 0 14px;font-size:15px;color:#1e293b;">${escapeHtml(guide.howItWorksTe)}</p>
        <div style="margin:0 0 18px;padding:12px 14px;background:#fffbeb;border:1px solid #d97706;border-radius:10px;font-size:14px;color:#451a03;">
          <strong>బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి అనుభవ సూచన:</strong> వైదిక జ్యోతిష్య గణనలను భయానికి కాకుండా ఆత్మపరిశీలనకు, సకాలంలో సరైన నిర్ణయాలు తీసుకోవడానికి మరియు ధర్మబద్ధమైన జీవనశైలికి మార్గదర్శిగా ఉపయోగించుకోవాలి. (<em>Practical Guidance: Classical Vedic calculations are meant to empower mindful planning, personal discipline, and harmonious decision-making.</em>)
        </div>

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

        <h3 style="margin:0 0 10px;font-size:18px;color:#78350f;">తరచుగా అడిగే 5 ముఖ్య ప్రశ్నలు (5-Question FAQ)</h3>
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

  if (pathname === '/privacy-policy') {
    return `
      <article style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">గోప్యతా విధానం (Privacy Policy – Birth Details &amp; Data Handling)</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#1e293b;">
          <strong>జన్మ వివరాల గోప్యత (How Birth Details Entered into Tools Are Handled):</strong> <strong>telugujyothisham.com</strong> లోని జన్మ కుండలి తెలుగులో, వివాహ పొంతన, తారాబలం మరియు గోచార ఫలాలు గణన సాధనాలలో మీరు నమోదు చేసే పుట్టిన తేదీ, సమయం, పుట్టిన ఊరు మరియు పేరు వివరాలు పూర్తిగా మీ వెబ్ బ్రౌజర్ (Client-Side Memory) లోనే తక్షణ గణన కోసం మాత్రమే ఉపయోగించబడతాయి. <strong>మీరు స్వయంగా పూజా బుకింగ్ లేదా సంప్రదింపుల ఫారమ్ సమర్పిస్తే తప్ప, ఈ జన్మ వివరాలు మా సర్వర్లలో లేదా ఏ ఇతర డేటాబేస్‌లోనూ నిల్వ చేయబడవు (Not stored on external servers).</strong>
        </p>
        <p style="margin:0;font-size:15px;color:#1e293b;">
          వెబ్‌సైట్ నిర్వహణ మరియు ప్రకటనల ప్రదర్శన కోసం Google AdSense ప్రామాణిక కుకీలను (Cookies) ఉపయోగిస్తుంది. భక్తుల వ్యక్తిగత గోప్యత మరియు సమాచార భద్రతకు శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం పూర్తిగా కట్టుబడి ఉంది.
        </p>
      </article>`;
  }

  if (pathname === '/disclaimer') {
    return `
      <article style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">జ్యోతిష్య గమనిక (Official Disclaimer)</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#1e293b;">
          <strong>Important Notice:</strong> All astrological calculations, panchangam timings, kundali reports, marriage compatibility scores, gochara transit interpretations, and remedial suggestions published on <strong>telugujyothisham.com</strong> are provided strictly <strong>for informational and cultural purposes only</strong>.
        </p>
        <p style="margin:0;font-size:15px;color:#1e293b;">
          జ్యోతిష్య గమనిక: ఈ వెబ్‌సైట్‌లో అందించబడే దృక్సిద్ధాంత పంచాంగం, జన్మ కుండలి, వివాహ పొంతన మరియు గోచార ఫలాలు సాంస్కృతిక మరియు ఆధ్యాత్మిక అవగాహన కొరకు మాత్రమే. వైద్య, న్యాయ, ఆర్థిక లేదా మానసిక ఆరోగ్య సంబంధమైన నిర్ణయాలకు జ్యోతిష్య సమాచారాన్ని ప్రత్యామ్నాయంగా భావించరాదు.
        </p>
      </article>`;
  }

  return `
      <article style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">${escapeHtml(metaTitleFallback(pathname))}</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#1e293b;">
          శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (హైదరాబాద్) వ్యవస్థాపకులు, స్మార్త వేద మరియు దృక్సిద్ధాంత జ్యోతిష విద్వాంసులు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పర్యవేక్షణలో ఈ విభాగంలోని గణనలు మరియు శాస్త్ర వివరణలు రూపొందించబడ్డాయి. సూర్య సిద్ధాంతం మరియు ఆధునిక దృక్సిద్ధాంత (Lahiri Chitrapaksha Ayanamsa – NASA JPL DE440 Ephemeris) ఖగోళ గణితాన్ని సమన్వయం చేస్తూ ప్రతి తిథి, నక్షత్రం, యోగం, కరణం మరియు గ్రహ గోచార ఫలితాలు ఖచ్చితంగా లెక్కించబడతాయి.
        </p>
      </article>`;
}

function metaTitleFallback(pathname: string): string {
  if (pathname === '/about') return 'జల్లవరం సాయి ధీరజ్ శర్మ – ఆచార్య పరిచయం & శాస్త్రీయ అనుభవం';
  if (pathname === '/contact') return 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం సంప్రదింపుల వివరాలు (హయత్‌నగర్, హైదరాబాద్)';
  return 'వైదిక శాస్త్ర వివరణ & మార్గదర్శిని (Vedic Shastra Reference)';
}

function renderGocharaServerSection(pathname: string): string {
  const isGocharaRoute =
    pathname === '/gochara-phalalu' ||
    pathname.startsWith('/gochara-phalalu/') ||
    pathname === '/yelinati-shani';
  if (!isGocharaRoute) return '';

  const rashiMatch = pathname.match(
    /^\/gochara-phalalu\/(mesham|vrushabham|mithunam|karkatakam|simham|kanya|tula|vruschikam|dhanussu|makaram|kumbham|meenam)$/i
  );
  const activeRashiSlug: RashiSlug = rashiMatch ? (rashiMatch[1].toLowerCase() as RashiSlug) : 'mesham';
  const report = computeGocharaForRashi(activeRashiSlug);

  return `
    <section aria-label="Gochara Phalalu Server Rendered Transit Analysis" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
      <h2 style="margin:0 0 12px;font-size:21px;color:#451a03;">
        ${escapeHtml(report.rashi.nameTe)} గోచార ఫలాలు – నవగ్రహ సంచార &amp; వేధ స్థితి (${escapeHtml(report.computedAtIstIso)} IST)
      </h2>
      <p style="margin:0 0 14px;font-size:15px;color:#1e293b;">
        దృక్సిద్ధాంత గణిత ఆధారంగా (NASA JPL DE440 Ephemeris, Lahiri Chitrapaksha Ayanamsa) Asia/Kolkata (IST) కాలమానంలో లెక్కించిన ప్రస్తుత గ్రహ సంచార పట్టిక. క్రింది జాబితా నుండి మీ జన్మ రాశిని ఎంచుకుని శని గోచారం, గురు గోచారం, రాహు కేతు గోచారం మరియు 9 గ్రహాల సూత్ర ఫలితాలను చూడవచ్చు.
      </p>

      <div style="margin-bottom:16px;display:flex;flex-wrap:wrap;gap:8px;">
        ${RASHI_LIST.map(
          (r) =>
            `<a href="/gochara-phalalu/${r.slug}" style="padding:6px 12px;background:#fffbeb;border:1px solid #f59e0b;border-radius:8px;color:#78350f;font-weight:700;font-size:13px;text-decoration:none;">${escapeHtml(r.nameTe)} ఫలాలు</a>`
        ).join('\n')}
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14.5px;margin-bottom:16px;">
        <thead>
          <tr style="background:#fef3c7;color:#451a03;text-align:left;">
            <th style="padding:10px;border:1px solid #fde68a;">గ్రహం (Planet)</th>
            <th style="padding:10px;border:1px solid #fde68a;">ప్రస్తుత గోచార రాశి</th>
            <th style="padding:10px;border:1px solid #fde68a;">డిగ్రీలు, నక్షత్రం &amp; గతి</th>
            <th style="padding:10px;border:1px solid #fde68a;">${escapeHtml(report.rashi.nameTe)} నుండి స్థానం</th>
            <th style="padding:10px;border:1px solid #fde68a;">గోచార &amp; వేధ స్థితి</th>
          </tr>
        </thead>
        <tbody>
          ${report.planets
            .map(
              (p) => `
            <tr>
              <td style="padding:8px 10px;border:1px solid #fde68a;font-weight:700;color:#451a03;">${escapeHtml(p.nameTe)}</td>
              <td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(p.rashiNameTe)}</td>
              <td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(p.degreeInRashi)} • ${escapeHtml(p.nakshatraTe)} (${p.pada}వ పాదం) • ${p.isRetrograde ? 'వక్ర గతి' : 'ఋజు గతి'}</td>
              <td style="padding:8px 10px;border:1px solid #fde68a;font-weight:700;color:#9a3412;">${p.houseFromMoon}వ స్థానం</td>
              <td style="padding:8px 10px;border:1px solid #fde68a;">${p.isAuspiciousFromMoon ? (p.hasVedha ? `శుభ స్థానం (${p.vedhaHouseFromMoon}వ ఇంట ${escapeHtml(p.vedhaByPlanetTe || '')} వల్ల వేధ)` : `నిర్వేధ శుభ గోచారం (వేధ స్థానం: ${p.vedhaHouseFromMoon})`) : 'మిశ్రమ / సంయమన కాలం'}</td>
            </tr>`
            )
            .join('\n')}
        </tbody>
      </table>

      <div style="padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:14px;margin-bottom:12px;">
        <h3 style="margin:0 0 6px;font-size:17px;color:#451a03;">శని గోచార సూత్ర ఫలితం &amp; ఏలినాటి శని స్థితి: ${escapeHtml(report.sadeSatiStatusTe)}</h3>
        ${report.saturn.guidance.sutraTe ? `<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#78350f;">${escapeHtml(report.saturn.guidance.sutraTe)}</p>` : ''}
        <p style="margin:0 0 6px;font-size:14.5px;color:#1e293b;">${escapeHtml(report.saturn.guidance.summaryTe)}</p>
        ${report.saturn.guidance.sharmaNoteTe ? `<p style="margin:0 0 6px;font-size:14px;color:#334155;"><strong>శర్మ గారి అనుభవ విశ్లేషణ:</strong> ${escapeHtml(report.saturn.guidance.sharmaNoteTe)}</p>` : ''}
        ${report.saturn.guidance.summaryEn ? `<p style="margin:0 0 6px;font-size:13.5px;color:#475569;"><strong>English Guidance:</strong> ${escapeHtml(report.saturn.guidance.summaryEn)}</p>` : ''}
        <p style="margin:0 0 6px;font-size:14px;color:#991b1b;"><strong>జాగ్రత్త వహించవలసినవి:</strong> ${escapeHtml(report.saturn.guidance.carefulTe)}</p>
        <p style="margin:0;font-size:14px;color:#065f46;"><strong>ఆచరించవలసిన ధర్మ కార్యాలు:</strong> ${escapeHtml(report.saturn.guidance.doTe)}</p>
      </div>

      <div style="padding:14px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;margin-bottom:12px;">
        <h3 style="margin:0 0 6px;font-size:17px;color:#065f46;">గురు గోచార సూత్ర ఫలితం (${escapeHtml(report.jupiter.guidance.phaseTe)})</h3>
        ${report.jupiter.guidance.sutraTe ? `<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#065f46;">${escapeHtml(report.jupiter.guidance.sutraTe)}</p>` : ''}
        <p style="margin:0 0 6px;font-size:14.5px;color:#1e293b;">${escapeHtml(report.jupiter.guidance.summaryTe)}</p>
        ${report.jupiter.guidance.sharmaNoteTe ? `<p style="margin:0 0 6px;font-size:14px;color:#334155;"><strong>శర్మ గారి అనుభవ విశ్లేషణ:</strong> ${escapeHtml(report.jupiter.guidance.sharmaNoteTe)}</p>` : ''}
        ${report.jupiter.guidance.summaryEn ? `<p style="margin:0 0 6px;font-size:13.5px;color:#475569;"><strong>English Guidance:</strong> ${escapeHtml(report.jupiter.guidance.summaryEn)}</p>` : ''}
        <p style="margin:0 0 6px;font-size:14px;color:#991b1b;"><strong>జాగ్రత్త వహించవలసినవి:</strong> ${escapeHtml(report.jupiter.guidance.carefulTe)}</p>
        <p style="margin:0;font-size:14px;color:#065f46;"><strong>ఆచరించవలసిన ధర్మ కార్యాలు:</strong> ${escapeHtml(report.jupiter.guidance.doTe)}</p>
      </div>

      <div style="padding:14px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:14px;margin-bottom:12px;">
        <h3 style="margin:0 0 6px;font-size:17px;color:#1e293b;">రాహు-కేతు గోచార సూత్ర ఫలితం (${escapeHtml(report.rahu.guidance.phaseTe)})</h3>
        ${report.rahu.guidance.sutraTe ? `<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#334155;">${escapeHtml(report.rahu.guidance.sutraTe)}</p>` : ''}
        <p style="margin:0 0 6px;font-size:14.5px;color:#1e293b;">${escapeHtml(report.rahu.guidance.summaryTe)}</p>
        ${report.rahu.guidance.sharmaNoteTe ? `<p style="margin:0 0 6px;font-size:14px;color:#334155;"><strong>శర్మ గారి అనుభవ విశ్లేషణ:</strong> ${escapeHtml(report.rahu.guidance.sharmaNoteTe)}</p>` : ''}
        ${report.rahu.guidance.summaryEn ? `<p style="margin:0 0 6px;font-size:13.5px;color:#475569;"><strong>English Guidance:</strong> ${escapeHtml(report.rahu.guidance.summaryEn)}</p>` : ''}
        <p style="margin:0 0 6px;font-size:14px;color:#991b1b;"><strong>జాగ్రత్త వహించవలసినవి:</strong> ${escapeHtml(report.rahu.guidance.carefulTe)}</p>
        <p style="margin:0;font-size:14px;color:#065f46;"><strong>ఆచరించవలసిన ధర్మ కార్యాలు:</strong> ${escapeHtml(report.rahu.guidance.doTe)}</p>
      </div>

      <div style="padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:14px;margin-bottom:12px;">
        <h3 style="margin:0 0 8px;font-size:17px;color:#451a03;">నవగ్రహ గోచార సూత్ర నియమాలు (రవి, చంద్ర, కుజ, బుధ, శుక్ర &amp; వేధ-వక్ర గతి)</h3>
        <p style="margin:0 0 6px;font-size:14px;color:#1e293b;"><strong>వేధ సూత్రం:</strong> చంద్ర రాశి నుండి గ్రహం శుభ స్థానంలో ఉన్నప్పుడు వేధ స్థానంలో మరొక గ్రహం ఉంటే శుభ ఫలితం మిశ్రమమవుతుంది. రవి-శనులకు, చంద్ర-బుధులకు పరస్పర వేధ దోషం ఉండదు.</p>
        <p style="margin:0 0 6px;font-size:14px;color:#1e293b;"><strong>రవి (3, 6, 10, 11):</strong> ఉద్యోగ ఉన్నతి, ఆరోగ్యం, అధికారుల మద్దతు. <strong>చంద్రుడు (1, 3, 6, 7, 10, 11):</strong> మనోబలం, శుభప్రయాణాలు, కార్యసిద్ధి. <strong>కుజుడు (3, 6, 11):</strong> ధైర్యం, భూలాభం, పోటీలలో విజయం. <strong>బుధుడు (2, 4, 6, 8, 10, 11):</strong> వాణిజ్య, విద్యా, కమ్యూనికేషన్ లాభాలు. <strong>శుక్రుడు (1, 2, 3, 4, 5, 8, 9, 11, 12):</strong> గృహ సౌఖ్యం, శుభకార్యాలు, ఆర్థిక ప్రవాహం.</p>
        <p style="margin:0;font-size:14px;color:#1e293b;"><strong>వక్ర గతి (Retrograde) సూత్రం:</strong> గ్రహాలు వక్ర గతిలో ఉన్నప్పుడు తొందరపాటు కొత్త ఒప్పందాల కంటే పాత పనుల సమీక్ష, అంతర్ముఖ ప్రణాళిక మరియు ఓర్పు అత్యుత్తమ ఫలితాలను ఇస్తాయి.</p>
      </div>

      <p style="margin:8px 0 0;font-size:13px;color:#78350f;">
        <strong>గమనిక (Disclaimer):</strong> ఈ గోచార ఫలాలు సాంస్కృతిక మరియు ఆధ్యాత్మిక సమాచార అవగాహన కొరకు మాత్రమే (For informational and cultural purposes only).
      </p>
    </section>`;
}

function renderDwadasaRashiEncyclopediaServerSection(pathname: string): string {
  const shouldRender =
    pathname === '/dwadasa-rashi-rahasyalu' ||
    pathname === '/panchangam' ||
    pathname === '/vivaha-pontana' ||
    pathname === '/telugu-baby-names' ||
    pathname === '/dosha-pariharalu' ||
    pathname === '/janma-kundali' ||
    pathname === '/mee-jatakam';
  if (!shouldRender) return '';

  return `
    <section aria-label="12 Chandra Rashi Vedic Life Encyclopedia" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
      <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">
        ద్వాదశ రాశుల దాంపత్యం (భార్య-భర్త), పిల్లల విద్యా స్వభావం, వృత్తి-భాగస్వామ్యం &amp; ఆరోగ్య విజ్ఞాన సర్వస్వం
      </h2>
      <p style="margin:0 0 14px;font-size:15px;color:#1e293b;">
        బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో (శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం) చంద్ర రాశి మరియు రాశ్యాధిపతి తత్వం ఆధారంగా మేషం నుండి మీనం వరకు 12 రాశుల సమగ్ర జీవన మార్గదర్శిని:
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin-bottom:18px;">
        ${DWADASA_RASHI_VEDIC_ENCYCLOPEDIA.map(
          (r) => `
          <article style="background:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:14px;">
            <h3 style="margin:0 0 6px;font-size:17px;color:#78350f;">✦ ${escapeHtml(r.rashiNameTe)} (${escapeHtml(r.rashiNameEn)}) – అధిపతి: ${escapeHtml(r.rashiLordTe)}</h3>
            <p style="margin:0 0 6px;font-size:13.5px;color:#1e293b;"><strong>భార్య స్వభావం:</strong> ${escapeHtml(r.wifeProfileTe)}</p>
            <p style="margin:0 0 6px;font-size:13.5px;color:#1e293b;"><strong>భర్త స్వభావం:</strong> ${escapeHtml(r.husbandProfileTe)}</p>
            <p style="margin:0 0 6px;font-size:13.5px;color:#1e293b;"><strong>పిల్లల చదువు &amp; పెంపకం:</strong> ${escapeHtml(r.childNatureAndStudyTe)} ${escapeHtml(r.parentingGuideTe)}</p>
            <p style="margin:0 0 6px;font-size:13.5px;color:#1e293b;"><strong>వృత్తి, వ్యాపార భాగస్వామ్యం &amp; ధనం:</strong> ${escapeHtml(r.careerLifeWorkTe)} ${escapeHtml(r.businessPartnershipTe)} (అనుకూల రాశులు: ${escapeHtml(r.bestPartnerRashisTe)})</p>
            <p style="margin:0 0 6px;font-size:13.5px;color:#1e293b;"><strong>శారీరక ఆరోగ్యం (${escapeHtml(r.kalapurushaAngamTe)}):</strong> ${escapeHtml(r.arogyaRakshaTe)}</p>
            <p style="margin:0;font-size:13px;color:#9a3412;"><strong>వైదిక పరిహారం:</strong> ${escapeHtml(r.vedicRemedyTe)}</p>
          </article>`
        ).join('\n')}
      </div>
      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:14px;padding:16px;">
        <h3 style="margin:0 0 8px;font-size:18px;color:#1e293b;">పౌర్ణమి – అమావాస్య – చంద్రాష్టమ తరంగాలు &amp; శని 30 ఏళ్ల పరిభ్రమణ మనోబల సూత్రాలు</h3>
        ${LUNAR_AND_SHANI_MENTAL_GUIDES.map(
          (g) => `
          <div style="margin-bottom:10px;">
            <strong style="color:#451a03;font-size:15px;">${escapeHtml(g.titleTe)} (${escapeHtml(g.titleEn)}):</strong>
            <p style="margin:4px 0;font-size:14px;color:#334155;">${escapeHtml(g.shastraPrincipleTe)}</p>
          </div>`
        ).join('\n')}
      </div>
    </section>`;
}

/**
 * Builds the lead introductory paragraph (first 100 words) for any route,
 * guaranteeing that meta.primaryKeyword appears naturally in the first paragraph
 * and the Roman-script keyword is mentioned once naturally.
 */
function buildFirstParagraphForRoute(
  pathname: string,
  meta: PageSeoMetadata,
  cityPanchangam: ComputedCityPanchangam
): string {
  if (pathname === '/') {
    return NATURAL_80_WORD_HOMEPAGE_INTRO_TE;
  }
  if (matchCityTimingSlugFromPath(pathname)) {
    return cityPanchangam.city.uniqueIntroTe;
  }
  const dateMatch = pathname.match(/^\/panchangam\/(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    const isoDate = dateMatch[1];
    const teluguDate = formatIsoToTeluguDate(isoDate);
    return `${teluguDate} పంచాంగం (${isoDate} panchangam in telugu) – నేటి పంచాంగం వివరాలు: ఈ రోజు (${cityPanchangam.dayData.teediVaram}) మాసం ${cityPanchangam.masam}, పక్షం ${cityPanchangam.paksham}, తిథి ${cityPanchangam.tithi}, నక్షత్రం ${cityPanchangam.nakshatram}, యోగం ${cityPanchangam.yogam}, కరణం ${cityPanchangam.karanam}, సూర్యోదయం ${cityPanchangam.sunrise}, సూర్యాస్తమయం ${cityPanchangam.sunset}, రాహుకాలం ${cityPanchangam.rahukalam}, యమగండం ${cityPanchangam.yamagandam}, గుళిక కాలం ${cityPanchangam.gulika}, వర్జ్యం ${cityPanchangam.varjyam}, అమృత ఘడియలు ${cityPanchangam.amruthaGadiyalu} మరియు అభిజిత్ ముహూర్తం ${cityPanchangam.abhijitMuhurtham}. నిన్నటి పంచాంగం మరియు రేపటి పంచాంగం లింకులు దిగువన ఇవ్వబడ్డాయి.`;
  }
  if (pathname === '/panchangam/calendar') {
    return 'తెలుగు క్యాలెండర్ 2026 (telugu calendar 2026): నవంబర్ 2026 పంచాంగం, 2026 పండుగలు, ఏకాదశి తేదీలు, అమావాస్య పౌర్ణమి 2026 మరియు ప్రతిరోజూ సూర్యోదయం, తిథి, నక్షత్రం, రాహుకాలం సమయాలతో కూడిన నెలవారీ దృక్సిద్ధాంత పంచాంగ పట్టిక.';
  }
  const guide = TOOL_PAGE_ORIGINAL_GUIDES[pathname];
  if (guide) {
    return guide.introTe;
  }
  return `${meta.primaryKeyword} (${meta.secondaryKeywords[0] || 'telugu jyothisham'}): బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి పర్యవేక్షణలో దృక్సిద్ధాంత గణిత ఆధారంగా (NASA JPL DE440 Ephemeris, Asia/Kolkata IST) రూపొందించబడిన ప్రామాణిక వైదిక జ్యోతిష్య సమాచారం.`;
}

/**
 * Generates raw server-rendered HTML inside <div id="root"> for any route so Googlebot
 * receives complete semantic HTML with real Panchangam data (tithi, nakshatra, yoga, karana,
 * paksha, masa, rahukalam, yamagandam, gulika, varjyam, amrita ghadiyalu, abhijit muhurtham,
 * sunrise, sunset), a single H1, visible calculation methodology line, unique city/tool text,
 * Gochara transits, author bio, and descriptive Telugu internal links.
 */
function renderIndividualRashiSsrSection(pathname: string, dayData: DayData): string {
  const match = pathname.match(
    /^\/rashi-phalalu\/(mesham|vrushabham|mithunam|karkatakam|simham|kanya|tula|vruschikam|dhanussu|makaram|kumbham|meenam)$/i
  );
  if (!match) return '';
  const rSlug = match[1].toLowerCase() as RashiSlug;
  const rInfo = findRashiBySlug(rSlug);
  const fortunes = getDailyRashiFortunes(dayData);
  const rFortune = fortunes.find((f) => f.id === rSlug);
  const gochara = computeGocharaForRashi(rSlug);
  const encyc = DWADASA_RASHI_VEDIC_ENCYCLOPEDIA.find((e) => e.id === rSlug);

  return `
    <section aria-label="${escapeHtml(rInfo.nameTe)} Rashi Phalalu Today, Weekly & Gochara" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">
        <a href="/rashi-phalalu" style="padding:6px 12px;background:#78350f;color:#ffffff;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;">అన్ని 12 రాశులు</a>
        ${RASHI_LIST.map(
          (r) =>
            `<a href="/rashi-phalalu/${r.slug}" style="padding:6px 10px;background:${r.slug === rSlug ? '#d97706' : '#fffbeb'};color:${r.slug === rSlug ? '#ffffff' : '#78350f'};border:1px solid #f59e0b;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;">${escapeHtml(r.nameTe)}</a>`
        ).join('')}
      </div>

      ${
        rFortune
          ? `
      <div id="rashi-phalalu-featured-snippet" style="padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:14px;margin-bottom:16px;">
        <h2 style="margin:0 0 8px;font-size:21px;color:#451a03;">
          ${escapeHtml(rFortune.teluguName)} రాశి నేటి ఫలితాలు (${escapeHtml(rFortune.englishName)} Today – ${escapeHtml(dayData.teediVaram)}) · ${escapeHtml(rFortune.statusLabel)}
        </h2>
        <p style="margin:0 0 8px;font-size:15px;color:#1e293b;"><strong>తెలుగు దిన ఫలితం:</strong> ${escapeHtml(rFortune.grahaDrishtiPhalamTe)} ${escapeHtml(rFortune.careerFinanceLine)}</p>
        <p style="margin:0 0 8px;font-size:14px;color:#334155;"><strong>English Prediction:</strong> ${escapeHtml(rFortune.grahaDrishtiPhalamEn)}</p>
        <p style="margin:0 0 8px;font-size:13.5px;color:#78350f;"><strong>📜 శాస్త్ర ప్రమాణం (${escapeHtml(rFortune.classicalCitationTe)}):</strong> <em>${escapeHtml(rFortune.classicalShlokaTe)}</em> — ${escapeHtml(rFortune.phaladeepikaMeaningTe)}</p>
        <p style="margin:0 0 6px;font-size:13.5px;color:#065f46;"><strong>⚖️ గోచార వేధ &amp; భృగు నాడి:</strong> ${escapeHtml(rFortune.vedhaBadgeTe)} · ${escapeHtml(rFortune.bhriguNadiCircuitTe)}</p>
        <p style="margin:0;font-size:13.5px;color:#9a3412;">
          <strong>శుభ సమయం:</strong> ${escapeHtml(rFortune.luckyTimeWindowTe)} |
          <strong>శుభ రంగు:</strong> ${escapeHtml(rFortune.luckyColor)} |
          <strong>అదృష్ట సంఖ్య:</strong> #${escapeHtml(String(rFortune.luckyNumber))} |
          <strong>పరిహారం:</strong> ${escapeHtml(rFortune.remedy)}
        </p>
      </div>`
          : ''
      }

      ${
        encyc
          ? `
      <div style="padding:16px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:14px;margin-bottom:16px;">
        <h3 style="margin:0 0 8px;font-size:18px;color:#1e293b;">${escapeHtml(encyc.rashiNameTe)} (${escapeHtml(encyc.rashiNameEn)}) స్వభావం, దాంపత్యం, వృత్తి &amp; ఆరోగ్యం (అధిపతి: ${escapeHtml(encyc.rashiLordTe)})</h3>
        <p style="margin:0 0 6px;font-size:14px;color:#1e293b;"><strong>దాంపత్యం &amp; వ్యక్తిత్వం:</strong> ${escapeHtml(encyc.wifeProfileTe)} ${escapeHtml(encyc.husbandProfileTe)}</p>
        <p style="margin:0 0 6px;font-size:14px;color:#1e293b;"><strong>వృత్తి &amp; ధన స్థితి:</strong> ${escapeHtml(encyc.careerLifeWorkTe)} ${escapeHtml(encyc.businessPartnershipTe)}</p>
        <p style="margin:0;font-size:14px;color:#1e293b;"><strong>ఆరోగ్య రక్షణ (${escapeHtml(encyc.kalapurushaAngamTe)}):</strong> ${escapeHtml(encyc.arogyaRakshaTe)} | <strong>వైదిక పరిహారం:</strong> ${escapeHtml(encyc.vedicRemedyTe)}</p>
      </div>`
          : ''
      }

      <div style="padding:14px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;">
        <h3 style="margin:0 0 6px;font-size:17px;color:#065f46;">ప్రస్తుత గోచార ఫలితాలు: ${escapeHtml(gochara.sadeSatiStatusTe)}</h3>
        <p style="margin:0 0 6px;font-size:14px;color:#1e293b;"><strong>శని గోచారం:</strong> ${escapeHtml(gochara.saturn.guidance.summaryTe)}</p>
        <p style="margin:0 0 8px;font-size:14px;color:#1e293b;"><strong>గురు గోచారం:</strong> ${escapeHtml(gochara.jupiter.guidance.summaryTe)}</p>
        <p style="margin:0;font-size:13.5px;font-weight:700;">
          <a href="/gochara-phalalu/${rSlug}" style="color:#065f46;text-decoration:underline;">${escapeHtml(rInfo.nameTe)} సంపూర్ణ నవగ్రహ గోచార పట్టిక చూడండి →</a> •
          <a href="/janma-kundali" style="color:#9a3412;text-decoration:underline;">మీ వ్యక్తిగత 37-అధ్యాయాల జన్మ కుండలి, BTR & D1–D60 చక్రాలు చూడండి →</a>
        </p>
      </div>
    </section>`;
}

function renderFestivalsCalendarSsrSection(pathname: string, todayIso: string): string {
  if (pathname !== '/festivals-calendar') return '';
  const [y, m] = todayIso.split('-').map(Number);
  const groups = generate12MonthVratasAndFestivals(y || 2026, (m || 11) - 1, 12);

  return `
    <section aria-label="12-Month Telugu Festivals Ekadashi Pradosham Calendar" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
      <h2 style="margin:0 0 12px;font-size:21px;color:#451a03;">
        రాబోయే 12 నెలల తెలుగు పండుగలు, ఏకాదశి, ప్రదోషం, సంకష్టహర చతుర్థి, పౌర్ణమి &amp; అమావాస్య తేదీలు
      </h2>
      <p style="margin:0 0 16px;font-size:14.5px;color:#334155;">
        దృక్సిద్ధాంత సూర్య-చంద్రుల ఖగోళ దూరం (Elongation) ఆధారంగా Asia/Kolkata (IST) ప్రకారం లెక్కించిన వ్రత క్యాలెండర్. ఏ తేదీపై క్లిక్ చేసినా ఆ రోజు పూర్తి పంచాంగం మరియు <a href="/nitya-sankalpam" style="color:#9a3412;font-weight:700;">నిత్య పూజా సంకల్పం</a> చూడవచ్చు.
      </p>
      ${groups
        .slice(0, 6)
        .map(
          (g) => `
        <div style="margin-bottom:18px;">
          <h3 style="margin:0 0 8px;font-size:17px;color:#78350f;">📅 ${escapeHtml(g.monthLabelTe)} (${escapeHtml(g.monthLabelEn)})</h3>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
              <thead>
                <tr style="background:#fef3c7;color:#451a03;text-align:left;">
                  <th style="padding:8px;border:1px solid #fde68a;">తేదీ &amp; వారం</th>
                  <th style="padding:8px;border:1px solid #fde68a;">పండుగ / వ్రతం</th>
                  <th style="padding:8px;border:1px solid #fde68a;">తిథి &amp; మాసం</th>
                  <th style="padding:8px;border:1px solid #fde68a;">విశిష్టత</th>
                </tr>
              </thead>
              <tbody>
                ${g.events
                  .map(
                    (ev) => `
                  <tr>
                    <td style="padding:8px;border:1px solid #fde68a;font-weight:700;"><a href="/panchangam/${ev.isoDate}" style="color:#9a3412;">${ev.isoDate}</a> (${escapeHtml(ev.weekdayTe)})</td>
                    <td style="padding:8px;border:1px solid #fde68a;font-weight:700;color:#451a03;">${escapeHtml(ev.titleTe)}</td>
                    <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(ev.tithiTe)} · ${escapeHtml(ev.lunarMonthTe)}</td>
                    <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(ev.significanceTe)}</td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>`
        )
        .join('')}
    </section>`;
}

function renderRatnaAndPrashnaSsrSection(pathname: string): string {
  if (pathname === '/ratna-rudraksha') {
    const lagnaNames = [
      'మేష లగ్నం (Aries)', 'వృషభ లగ్నం (Taurus)', 'మిథున లగ్నం (Gemini)', 'కర్కాటక లగ్నం (Cancer)',
      'సింహ లగ్నం (Leo)', 'కన్య లగ్నం (Virgo)', 'తుల లగ్నం (Libra)', 'వృశ్చిక లగ్నం (Scorpio)',
      'ధనుర్ లగ్నం (Sagittarius)', 'మకర లగ్నం (Capricorn)', 'కుంభ లగ్నం (Aquarius)', 'మీన లగ్నం (Pisces)',
    ];
    return `
      <section aria-label="12 Lagna Ratna and Rudraksha Reference Table" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 12px;font-size:21px;color:#451a03;">
          ద్వాదశ లగ్నాల వారీగా అదృష్ట రత్నాలు, ధరించకూడని రత్నాలు &amp; ముఖి రుద్రాక్ష పట్టిక
        </h2>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead>
              <tr style="background:#fef3c7;color:#451a03;text-align:left;">
                <th style="padding:9px;border:1px solid #fde68a;">జన్మ లగ్నం</th>
                <th style="padding:9px;border:1px solid #fde68a;">ప్రధాన జీవ రత్నం &amp; ఉపా-రత్నం</th>
                <th style="padding:9px;border:1px solid #fde68a;">భాగ్య రత్నం</th>
                <th style="padding:9px;border:1px solid #fde68a;">ధరించకూడని రత్నాలు</th>
                <th style="padding:9px;border:1px solid #fde68a;">ముఖి రుద్రాక్ష &amp; ధారణ మంత్రం</th>
              </tr>
            </thead>
            <tbody>
              ${lagnaNames
                .map((lName, idx) => {
                  const g = computeRatnaRudrakshaAndRemedyAdvisor(idx, [], false);
                  return `
                  <tr>
                    <td style="padding:8px;border:1px solid #fde68a;font-weight:700;color:#451a03;">${escapeHtml(lName)}</td>
                    <td style="padding:8px;border:1px solid #fde68a;"><strong>${escapeHtml(g.primaryGemTe)}</strong><br/>ఉపా-రత్నం: ${escapeHtml(g.upaRatnaTe)}</td>
                    <td style="padding:8px;border:1px solid #fde68a;color:#065f46;font-weight:600;">${escapeHtml(g.bhagyaGemTe)}</td>
                    <td style="padding:8px;border:1px solid #fde68a;color:#991b1b;">${escapeHtml(g.avoidGemsTe)}</td>
                    <td style="padding:8px;border:1px solid #fde68a;"><strong>${escapeHtml(g.rudrakshaTitleTe)}</strong><br/>${escapeHtml(g.mantraTe)}</td>
                  </tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </section>`;
  }

  if (pathname === '/prashna-kundali') {
    const samplePrashna = computeInstantPrashna(108, 'career');
    return `
      <section aria-label="KP 249 Horary Prashna Kundali Snapshot" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
        <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">
          KP 249 హోరరీ ప్రశ్న కుండలి – ప్రశ్న అంశాలు &amp; ప్రస్తుత గ్రహ సంకేతం
        </h2>
        <p style="margin:0 0 12px;font-size:14.5px;color:#1e293b;">
          <strong>ఉదాహరణ హోరరీ #108 (${escapeHtml(samplePrashna.prashnaLagnaTe)}):</strong>
          సబ్‌లార్డ్: ${escapeHtml(samplePrashna.lagnaSubLordTe)} · చంద్ర స్థితి: ${escapeHtml(samplePrashna.moonRashiTe)} (${samplePrashna.moonHouseFromPrashna}వ భావం) ·
          శుభ బలం: ${samplePrashna.score}% · కాల ప్రమాణం: ${escapeHtml(samplePrashna.timingTe)}
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
          ${PRASHNA_TOPICS.map(
            (t) => `
            <div style="padding:10px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
              <strong style="color:#451a03;">✦ ${escapeHtml(t.labelTe)} (${escapeHtml(t.labelEn)})</strong>
              <p style="margin:4px 0 0;font-size:13px;color:#78350f;">పరిశీలించే భావాలు: Houses ${t.targetHouses.join(', ')} · కారక గ్రహం: ${escapeHtml(t.karakaTe)}</p>
            </div>`
          ).join('')}
        </div>
      </section>`;
  }

  return '';
}

function renderNakshatraSsrSection(pathname: string): string {
  const nakSlug = matchNakshatraSlugFromPath(pathname);
  if (!nakSlug) return '';
  const profile = findNakshatraBySlug(nakSlug);
  if (!profile) return '';
  const prev = NAKSHATRA_SEO_PROFILES[(profile.index - 2 + 27) % 27];
  const next = NAKSHATRA_SEO_PROFILES[profile.index % 27];

  return `
    <section aria-label="${escapeHtml(profile.nameEn)} Nakshatra Vedic Profile" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
      <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">
        ${escapeHtml(profile.nameTe)} నక్షత్రం (${escapeHtml(profile.nameEn)}) – శాస్త్రీయ వివరాలు &amp; 4 పాదాల నామాక్షరాలు
      </h2>
      <p style="margin:0 0 14px;font-size:15px;color:#1e293b;">${escapeHtml(profile.traitsTe)} (${escapeHtml(profile.traitsEn)})</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
        <tbody>
          <tr><th style="text-align:left;padding:8px 10px;border:1px solid #fde68a;background:#fffbeb;width:34%;">జన్మ రాశి (Moon Sign)</th><td style="padding:8px 10px;border:1px solid #fde68a;font-weight:700;"><a href="/rashi-phalalu/${profile.rashiSlug}" style="color:#9a3412;">${escapeHtml(profile.rashiTe)} (${escapeHtml(profile.rashiEn)})</a></td></tr>
          <tr><th style="text-align:left;padding:8px 10px;border:1px solid #fde68a;background:#fffbeb;">నక్షత్ర అధిపతి &amp; అధిదేవత</th><td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(profile.lordTe)} (${escapeHtml(profile.lordEn)}) • దేవత: ${escapeHtml(profile.deityTe)}</td></tr>
          <tr><th style="text-align:left;padding:8px 10px;border:1px solid #fde68a;background:#fffbeb;">4 పాదాల నామాక్షరాలు</th><td style="padding:8px 10px;border:1px solid #fde68a;font-weight:700;color:#9a3412;">${escapeHtml(profile.padaSyllablesTe.join(' | '))}</td></tr>
          <tr><th style="text-align:left;padding:8px 10px;border:1px solid #fde68a;background:#fffbeb;">గణం, నాడి, యోని &amp; రజ్జు</th><td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(profile.ganamTe)} • ${escapeHtml(profile.nadiTe)} • ${escapeHtml(profile.yoniTe)} • ${escapeHtml(profile.rajjuTe)}</td></tr>
          <tr><th style="text-align:left;padding:8px 10px;border:1px solid #fde68a;background:#fffbeb;">వృత్తి &amp; ఉద్యోగ రంగాలు</th><td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(profile.careerTe)}</td></tr>
          <tr><th style="text-align:left;padding:8px 10px;border:1px solid #fde68a;background:#fffbeb;">వివాహ పొంతన &amp; శుభ నక్షత్రాలు</th><td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(profile.marriageTe)}</td></tr>
          <tr><th style="text-align:left;padding:8px 10px;border:1px solid #fde68a;background:#ecfdf5;color:#065f46;">ఆరోగ్యం, పరిహారం &amp; మంత్రం</th><td style="padding:8px 10px;border:1px solid #fde68a;">${escapeHtml(profile.healthTe)}<br/><strong>పరిహారం:</strong> ${escapeHtml(profile.remedyTe)}<br/><strong>మంత్రం:</strong> ${escapeHtml(profile.mantraTe)}</td></tr>
        </tbody>
      </table>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px;font-size:13.5px;font-weight:700;">
        <a href="/nakshatra/${prev.slug}" style="color:#9a3412;">← ${escapeHtml(prev.nameTe)} (${escapeHtml(prev.nameEn)})</a>
        <a href="/nakshatra/${next.slug}" style="color:#9a3412;">${escapeHtml(next.nameTe)} (${escapeHtml(next.nameEn)}) →</a>
      </div>
      <p style="margin:0;font-size:13px;line-height:1.9;">
        <strong>27 నక్షత్రాలు:</strong>
        ${NAKSHATRA_SEO_PROFILES.map((n) => `<a href="/nakshatra/${n.slug}" style="color:#9a3412;font-weight:700;">${escapeHtml(n.nameTe)}</a>`).join(' • ')}
      </p>
    </section>`;
}

function renderMonthlyMuhurthamSsrSection(pathname: string): string {
  const monthSpecs: Record<string, { year: number; month: number; labelTe: string }> = {
    '/muhurtham/november-2026': { year: 2026, month: 11, labelTe: 'నవంబర్ 2026' },
    '/muhurtham/december-2026': { year: 2026, month: 12, labelTe: 'డిసెంబర్ 2026' },
    '/muhurtham/january-2027': { year: 2027, month: 1, labelTe: 'జనవరి 2027' },
  };
  const spec = monthSpecs[pathname];
  if (!spec && pathname !== '/vivaha-muhurtham' && pathname !== '/gruha-pravesha-muhurtham') {
    return '';
  }

  const targetYear = spec?.year || 2026;
  const targetMonth = spec?.month || 11;
  const labelTe = spec?.labelTe || 'నవంబర్ – డిసెంబర్ 2026';
  const daysInMonth = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  const rows: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayData = getOrGenerateDayData(iso, WEEK_DATA);
    const tithi = dayData.panchanga.tithi;
    const isAvoidTithi =
      tithi.includes('అమావాస్య') ||
      tithi.includes('చవితి') ||
      tithi.includes('నవమి') ||
      tithi.includes('చతుర్దశి') ||
      tithi.includes('అష్టమి');
    if (!isAvoidTithi) {
      rows.push(`
        <tr>
          <td style="padding:8px;border:1px solid #fde68a;font-weight:700;"><a href="/panchangam/${iso}" style="color:#9a3412;">${iso}</a> (${escapeHtml(dayData.teediVaram)})</td>
          <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(dayData.panchanga.tithi)}</td>
          <td style="padding:8px;border:1px solid #fde68a;">${escapeHtml(dayData.panchanga.nakshatram)}</td>
          <td style="padding:8px;border:1px solid #fde68a;color:#065f46;font-weight:700;">${escapeHtml(dayData.shubha.abhijit)}</td>
          <td style="padding:8px;border:1px solid #fde68a;color:#991b1b;">${escapeHtml(dayData.ashubha.rahukalam)}</td>
        </tr>`);
    }
  }

  return `
    <section aria-label="${escapeHtml(labelTe)} Auspicious Muhurtham Dates" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
      <h2 style="margin:0 0 10px;font-size:21px;color:#451a03;">
        ${escapeHtml(labelTe)} శుభ ముహూర్త దినాలు &amp; పంచాంగ శుద్ధి పట్టిక
      </h2>
      <p style="margin:0 0 14px;font-size:14.5px;color:#334155;">
        ఈ క్రింది తేదీలలో రిక్త తిథులు/అమావాస్య మినహాయించబడినవి. మీ జన్మ నక్షత్ర తారాబలం సరిచూసి శుభ లగ్నంలో కార్యం ప్రారంభించగలరు.
      </p>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="background:#fef3c7;color:#451a03;text-align:left;">
              <th style="padding:8px;border:1px solid #fde68a;">తేదీ &amp; వారం</th>
              <th style="padding:8px;border:1px solid #fde68a;">తిథి (Tithi)</th>
              <th style="padding:8px;border:1px solid #fde68a;">నక్షత్రం (Nakshatram)</th>
              <th style="padding:8px;border:1px solid #fde68a;">అభిజిత్ ముహూర్తం</th>
              <th style="padding:8px;border:1px solid #fde68a;">వర్జించవలసిన రాహుకాలం</th>
            </tr>
          </thead>
          <tbody>
            ${rows.slice(0, 18).join('\n')}
          </tbody>
        </table>
      </div>
    </section>`;
}

export function renderServerHtmlBodyForRoute(rawPathname: string): string {
  const pathname = (rawPathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const meta = generatePageMetadata(pathname);
  const todayIso = getTodayIsoDateIST();

  const dateMatch = pathname.match(/^\/panchangam\/(\d{4}-\d{2}-\d{2})$/);
  const targetIsoDate = dateMatch ? dateMatch[1] : todayIso;

  const matchedCitySlug = matchCityTimingSlugFromPath(pathname);
  const citySlug: CityTimingConfig['slug'] = matchedCitySlug || 'hyderabad';

  const cityPanchangam = computeCityLocalPanchangam(targetIsoDate, citySlug);
  const dayData = cityPanchangam.dayData;
  const prevDate = addDaysIso(targetIsoDate, -1);
  const nextDate = addDaysIso(targetIsoDate, 1);

  const leadIntroTextTe = buildFirstParagraphForRoute(pathname, meta, cityPanchangam);

  const calendar60 = generateStaticDateParams(60, 7);

  const calendarSectionHtml =
    pathname === '/panchangam/calendar'
      ? `
      <section style="margin-top:24px;background:#fff;border:1px solid #f59e0b;border-radius:16px;padding:20px;margin-bottom:24px;">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
          <h2 style="font-size:20px;color:#451a03;margin:0;">తెలుగు క్యాలెండర్ 2026 – నెలవారీ పంచాంగం (Monthly View)</h2>
          <div style="display:flex;gap:10px;font-size:13px;font-weight:700;">
            <a href="/panchangam/2026-10-01" style="padding:6px 12px;background:#fffbeb;border:1px solid #d97706;border-radius:8px;color:#78350f;text-decoration:none;">← మునుపటి నెల (అక్టోబర్ 2026)</a>
            <a href="/panchangam/2026-11-01" style="padding:6px 12px;background:#9a3412;border:1px solid #9a3412;border-radius:8px;color:#fff;text-decoration:none;">నవంబర్ 2026</a>
            <a href="/panchangam/2026-12-01" style="padding:6px 12px;background:#fffbeb;border:1px solid #d97706;border-radius:8px;color:#78350f;text-decoration:none;">తదుపరి నెల (డిసెంబర్ 2026) →</a>
          </div>
        </div>
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
                    <td style="padding:8px 10px;border:1px solid #fde68a;"><a href="/panchangam/${date}" style="color:#9a3412;font-weight:700;">${date} (${escapeHtml(formatIsoToTeluguDate(date))})</a></td>
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

  const isPanchangamOnlyRoute =
    pathname === '/' ||
    pathname === '/panchangam/calendar' ||
    Boolean(dateMatch) ||
    Boolean(matchedCitySlug);

  const nakshatraSsrHtml = renderNakshatraSsrSection(pathname);
  const monthlyMuhurthamHtml = renderMonthlyMuhurthamSsrSection(pathname);
  const individualRashiHtml = renderIndividualRashiSsrSection(pathname, dayData);
  const festivalsCalendarHtml = renderFestivalsCalendarSsrSection(pathname, todayIso);
  const ratnaPrashnaHtml = renderRatnaAndPrashnaSsrSection(pathname);
  const toolGuideHtml = !isPanchangamOnlyRoute && !individualRashiHtml && !nakshatraSsrHtml ? renderRichToolGuideHtml(pathname) : '';
  const gocharaHtml = renderGocharaServerSection(pathname);
  const rashiEncyclopediaHtml = renderDwadasaRashiEncyclopediaServerSection(pathname);
  const rashiPhalaluSsrHtml =
    pathname === '/rashi-phalalu'
      ? (() => {
          const fortunes = getDailyRashiFortunes(dayData);
          return `
        <section aria-label="Today Rashi Phalalu in Telugu and English - 12 Zodiac Signs" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:22px;margin-bottom:24px;">
          <h2 style="margin:0 0 10px;font-size:22px;color:#451a03;">
            రాశి ఫలాలు – నేటి ద్వాదశ రాశి ఫలాలు (Today Rashi Phalalu in Telugu &amp; English – ${escapeHtml(dayData.teediVaram)})
          </h2>
          <p id="rashi-phalalu-featured-snippet" style="margin:0 0 16px;font-size:15px;color:#334155;">
            <strong>Google Featured Summary (తెలుగు &amp; English):</strong> ఈ రోజు (${escapeHtml(dayData.teediVaram)}, నక్షత్రం: ${escapeHtml(cityPanchangam.nakshatram)}) మేషం నుండి మీనం వరకు 12 రాశుల నేటి రాశి ఫలాలు (Rashi Phalalu Today in Telugu / Rasi Phalalu). Daily Telugu Horoscope predictions for all 12 Rasis with Chandrabalam, Lucky Time, Lucky Number, and Vedic Remedies:
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">
            ${fortunes
              .map(
                (r) => `
              <article id="rashi-${escapeHtml(r.id)}" style="border:1px solid #fde68a;background:#fffbeb;border-radius:14px;padding:14px;">
                <h3 style="margin:0 0 6px;font-size:17px;color:#78350f;">
                  <a href="/rashi-phalalu/${escapeHtml(r.id)}" style="color:#78350f;text-decoration:none;">
                    ${escapeHtml(r.teluguName)} రాశి ఫలాలు (${escapeHtml(r.englishName)} Rashi Phalalu)
                  </a> — <span style="color:#065f46;">${escapeHtml(r.statusLabel)} (${escapeHtml(r.statusLabelEn)})</span>
                </h3>
                <p style="margin:0 0 6px;font-size:13px;color:#451a03;background:#fef3c7;padding:6px 10px;border-left:3px solid #b45309;border-radius:6px;">
                  <strong>📜 శాస్త్ర ప్రమాణం (${escapeHtml(r.classicalCitationTe)}):</strong> <em>${escapeHtml(r.classicalShlokaTe)}</em> — ${escapeHtml(r.phaladeepikaMeaningTe)}
                </p>
                <p style="margin:0 0 6px;font-size:13px;color:#065f46;">
                  <strong>⚖️ ఫలదీపిక గోచార వేధ గణితం:</strong> ${escapeHtml(r.vedhaBadgeTe)} — ${escapeHtml(r.vedhaExplanationTe)}
                </p>
                <p style="margin:0 0 6px;font-size:13px;color:#78350f;">
                  <strong>🔱 భృగు నంది నాడి &amp; చంద్రకళా నాడి:</strong> ${escapeHtml(r.bhriguNadiCircuitTe)}
                </p>
                <p style="margin:0 0 6px;font-size:14px;color:#1e293b;"><strong>తెలుగు ఫలితం:</strong> ${escapeHtml(r.grahaDrishtiPhalamTe)} ${escapeHtml(r.careerFinanceLine)}</p>
                <p style="margin:0 0 6px;font-size:13.5px;color:#334155;"><strong>English Horoscope:</strong> ${escapeHtml(r.grahaDrishtiPhalamEn)}</p>
                <p style="margin:0 0 6px;font-size:13px;color:#9a3412;">
                  <strong>శుభ సమయం (Lucky Time):</strong> ${escapeHtml(r.luckyTimeWindowTe)} | 
                  <strong>శుభ రంగు (Color):</strong> ${escapeHtml(r.luckyColor)} | 
                  <strong>సంఖ్య (#):</strong> #${escapeHtml(String(r.luckyNumber))} | 
                  <strong>పరిహారం (Remedy):</strong> ${escapeHtml(r.remedy)}
                </p>
                <p style="margin:0;font-size:12.5px;">
                  <a href="/rashi-phalalu/${escapeHtml(r.id)}" style="color:#9a3412;font-weight:700;text-decoration:underline;">${escapeHtml(r.teluguName)} పూర్తి వార &amp; మాస రాశి ఫలాలు చూడండి →</a>
                </p>
              </article>`
              )
              .join('')}
          </div>
        </section>`;
        })()
      : '';

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
            <a href="/rashi-phalalu" style="padding:6px 12px;background:#b45309;border:1px solid #f59e0b;border-radius:8px;color:#fff;text-decoration:none;font-weight:700;font-size:13px;">✨ నేటి రాశి ఫలాలు (Rashi Phalalu)</a>
            <a href="/panchangam/${nextDate}" style="padding:6px 12px;background:#fff;border:1px solid #d97706;border-radius:8px;color:#78350f;text-decoration:none;font-weight:700;font-size:13px;">రేపటి పంచాంగం (${nextDate}) →</a>
            <a href="/panchangam/calendar" style="padding:6px 12px;background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;color:#78350f;text-decoration:none;font-weight:700;font-size:13px;">📅 తెలుగు క్యాలెండర్ 2026</a>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:13px;">
            <span style="font-weight:700;color:#78350f;">నగర సమయాలు:</span>
            ${SUPPORTED_CITY_SLUGS.map((slug) => {
              const cfg = SUPPORTED_CITY_CONFIGS[slug];
              return `<a href="/panchangam/${slug}" style="color:#9a3412;text-decoration:underline;font-weight:600;">${escapeHtml(cfg.nameTe)}</a>`;
            }).join(' • ')}
          </div>
        </nav>

        ${nakshatraSsrHtml}
        ${monthlyMuhurthamHtml}
        ${individualRashiHtml}
        ${rashiPhalaluSsrHtml}
        ${festivalsCalendarHtml}
        ${ratnaPrashnaHtml}
        ${gocharaHtml}
        ${toolGuideHtml}
        ${rashiEncyclopediaHtml}

        <section aria-label="Daily Telugu Panchangam Data" style="background:#ffffff;border:2px solid #f59e0b;border-radius:18px;padding:20px;margin-bottom:24px;">
          <h2 style="margin:0 0 14px;font-size:22px;color:#451a03;">
            ${escapeHtml(dayData.teediVaram)} – సంపూర్ణ పంచాంగ వివరాలు (${escapeHtml(cityPanchangam.city.nameTe)} సమయాలు)
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tbody>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;width:36%;">సంవత్సరం &amp; మాసం (Masa)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:600;">${escapeHtml(dayData.panchanga.samvatsaram)} • మాసం: ${escapeHtml(cityPanchangam.masam)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">పక్షం (Paksha)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#78350f;">${escapeHtml(cityPanchangam.paksham)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">తిథి (Tithi)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#9a3412;">${escapeHtml(cityPanchangam.tithi)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">నక్షత్రం (Nakshatra)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#9a3412;">${escapeHtml(cityPanchangam.nakshatram)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">యోగం &amp; కరణం (Yoga &amp; Karana)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;">యోగం: ${escapeHtml(cityPanchangam.yogam)} | కరణం: ${escapeHtml(cityPanchangam.karanam)}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fffbeb;">సూర్యోదయం &amp; సూర్యాస్తమయం (Sunrise &amp; Sunset)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;">సూర్యోదయం (Sunrise): <strong>${escapeHtml(cityPanchangam.sunrise)}</strong> | సూర్యాస్తమయం (Sunset): <strong>${escapeHtml(cityPanchangam.sunset)}</strong></td>
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
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#fef2f2;color:#991b1b;">గుళిక కాలం (Gulika Kalam)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#991b1b;">${escapeHtml(cityPanchangam.gulika)}</td>
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
                <th style="text-align:left;padding:10px 12px;border:1px solid #fde68a;background:#ecfdf5;color:#065f46;">అమృత ఘడియలు (Amrita Ghadiyalu)</th>
                <td style="padding:10px 12px;border:1px solid #fde68a;font-weight:700;color:#065f46;">${escapeHtml(cityPanchangam.amruthaGadiyalu)}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin:12px 0 0;font-size:13px;font-family:monospace;color:#78350f;">
            Calculation: Drik Siddhanta, NASA JPL DE440 Ephemeris (Lahiri Chitrapaksha Ayanamsa), location ${escapeHtml(cityPanchangam.city.nameEn)}, timezone IST.
          </p>
        </section>

        ${usaZonesHtml}
        ${calendarSectionHtml}

        <section aria-label="Daily Prediction Summary" style="background:#fffbeb;border:1px solid #fde68a;border-radius:16px;padding:18px;margin-bottom:24px;">
          <h2 style="margin:0 0 8px;font-size:19px;color:#451a03;">నేటి దిన ఫలితం &amp; విశేషం (Daily Vedic Guidance)</h2>
          <p style="margin:0;font-size:15px;color:#1e293b;"><strong>${escapeHtml(dayData.specialEvent || dayData.deity)}:</strong> ${escapeHtml(dayData.phalitham)}</p>
        </section>

        ${(() => {
          let hash = 0;
          for (let i = 0; i < targetIsoDate.length; i++) {
            hash = (hash * 31 + targetIsoDate.charCodeAt(i)) % DAILY_SUBHASHITHALU.length;
          }
          const sloka = DAILY_SUBHASHITHALU[Math.abs(hash) % DAILY_SUBHASHITHALU.length] || DAILY_SUBHASHITHALU[0];
          return `
        <section aria-label="Daily Sanskrit Subhashitham and Modern Practical Quote" style="background:#ffffff;border:2px solid #f59e0b;border-radius:16px;padding:18px;margin-bottom:24px;">
          <h2 style="margin:0 0 8px;font-size:19px;color:#451a03;">నేటి సుభాషిత శ్లోకం &amp; నేటి తరానికి లౌకిక జీవన సందేశం (${escapeHtml(sloka.themeTe)})</h2>
          <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#78350f;">${escapeHtml(sloka.slokamTe)}</p>
          <p style="margin:0 0 8px;font-size:14px;font-style:italic;color:#475569;">${escapeHtml(sloka.slokamEn)}</p>
          <p style="margin:0 0 8px;font-size:14.5px;color:#1e293b;"><strong>సరళ భావం:</strong> ${escapeHtml(sloka.meaningTe)} (${escapeHtml(sloka.meaningEn)})</p>
          <div style="padding:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
            <p style="margin:0 0 6px;font-size:14.5px;font-weight:700;color:#9a3412;">🌟 నేటి తరానికి లౌకిక జీవన సూత్రం: ${escapeHtml(sloka.loukikaQuoteTe)}</p>
            <p style="margin:0;font-size:13.5px;color:#334155;"><strong>Modern Life Quote:</strong> ${escapeHtml(sloka.loukikaQuoteEn)}</p>
          </div>
        </section>`;
        })()}

        <section aria-label="Internal Links to Telugu Astrology Tools" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:18px;margin-bottom:24px;">
          <h2 style="margin:0 0 12px;font-size:18px;color:#451a03;">ముఖ్యమైన తెలుగు జ్యోతిష విభాగాలు (Descriptive Telugu Internal Links)</h2>
          <ul style="margin:0;padding-left:20px;line-height:1.9;">
            <li><a href="/" style="color:#9a3412;font-weight:700;">తెలుగు జ్యోతిషం – నేటి పంచాంగం (Homepage)</a></li>
            <li><a href="/panchangam" style="color:#9a3412;font-weight:700;">నేటి పంచాంగం (Neti Panchangam – ఈ రోజు తిథి, నక్షత్రం, రాహుకాలం)</a></li>
            <li><a href="/rashi-phalalu" style="color:#9a3412;font-weight:700;">నేటి రాశి ఫలాలు – మేషం నుండి మీనం వరకు 12 రాశుల ఫలితాలు</a></li>
            <li><a href="/janma-kundali" style="color:#9a3412;font-weight:700;">జన్మ కుండలి తెలుగులో – 29 అధ్యాయాల బృహత్ జాతకం &amp; KP కుండలి</a></li>
            <li><a href="/prashna-kundali" style="color:#9a3412;font-weight:700;">1–249 KP ప్రశ్న కుండలి (Instant Horary Prashna Predictor)</a></li>
            <li><a href="/ratna-rudraksha" style="color:#9a3412;font-weight:700;">లగ్న రత్నం, రుద్రాక్ష &amp; దోష పరిహార సలహాదారు</a></li>
            <li><a href="/festivals-calendar" style="color:#9a3412;font-weight:700;">12 నెలల తెలుగు పండుగలు, ఏకాదశి, ప్రదోషం &amp; వ్రత క్యాలెండర్</a></li>
            <li><a href="/nitya-sankalpam" style="color:#9a3412;font-weight:700;">నిత్య పూజా సంకల్పం మంత్రం (India &amp; USA EST/CST/PST)</a></li>
            <li><a href="/vivaha-pontana" style="color:#9a3412;font-weight:700;">వివాహ పొంతన – 36 గుణాల అష్టకూట గుణ మిలనం</a></li>
            <li><a href="/telugu-baby-names" style="color:#9a3412;font-weight:700;">నక్షత్రం ప్రకారం పిల్లల పేర్లు (Telugu Baby Names by Nakshatra)</a></li>
            <li><a href="/gowri-panchangam" style="color:#9a3412;font-weight:700;">గౌరీ పంచాంగం &amp; హోరా చక్రం</a></li>
            <li><a href="/tarabalam-chandrabalam" style="color:#9a3412;font-weight:700;">తారాబలం &amp; చంద్రబలం క్యాలిక్యులేటర్</a></li>
            <li><a href="/gochara-phalalu" style="color:#9a3412;font-weight:700;">గోచార ఫలాలు – శని, గురు, రాహు కేతు గోచారం</a></li>
            <li><a href="/dosha-pariharalu" style="color:#9a3412;font-weight:700;">ఏలినాటి శని, అష్టమ శని &amp; కుజ దోష పరిహారాలు</a></li>
            <li><a href="/dwadasa-rashi-rahasyalu" style="color:#9a3412;font-weight:700;">12 రాశుల దాంపత్యం (భార్య-భర్త), పిల్లల విద్యా స్వభావం, వృత్తి-భాగస్వామ్యం &amp; ఆరోగ్యం</a></li>
            <li><a href="/panchangam/calendar" style="color:#9a3412;font-weight:700;">తెలుగు క్యాలెండర్ 2026 – నెలవారీ పంచాంగం</a></li>
          </ul>
          <p style="margin:12px 0 6px;font-size:13.5px;font-weight:700;color:#451a03;">12 రాశుల ప్రత్యేక పేజీలు (Individual Rashi Phalalu Pages):</p>
          <p style="margin:0;font-size:13px;line-height:1.8;">
            ${RASHI_LIST.map((r) => `<a href="/rashi-phalalu/${r.slug}" style="color:#9a3412;font-weight:700;">${escapeHtml(r.nameTe)} రాశి ఫలాలు</a>`).join(' • ')}
          </p>
        </section>

        <aside aria-label="Author Bio" style="background:#fef3c7;border:1px solid #f59e0b;border-radius:16px;padding:18px;margin-bottom:20px;">
          <h2 style="margin:0 0 6px;font-size:17px;color:#451a03;">రచయిత &amp; శాస్త్రీయ పర్యవేక్షణ: బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Jallavaram Sai Dheeraj Sharma)</h2>
          <p style="margin:0;font-size:14px;color:#78350f;">
            శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (పసుమాముల, హయత్‌నగర్, హైదరాబాద్) వ్యవస్థాపకులు, స్మార్త వేద మరియు జ్యోతిష విద్వాంసులు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు 15+ సంవత్సరాల అనుభవంతో దృక్సిద్ధాంత పంచాంగ గణనలు, బృహత్ జాతక కుండలి విశ్లేషణ మరియు వైదిక హోమ క్రతువులను నిర్వహిస్తున్నారు.
          </p>
          <p style="margin:8px 0 0;font-size:12px;color:#78350f;">
            గమనిక: ఈ వెబ్‌సైట్‌లోని పంచాంగం మరియు జ్యోతిష్య సమాచారం సాంస్కృతిక మరియు ఆధ్యాత్మిక సమాచార అవగాహన కొరకు మాత్రమే (For informational and cultural purposes only).
          </p>
          <p style="margin:10px 0 0;font-size:13px;">
            <a href="/about" style="color:#9a3412;font-weight:700;">మా గురించి (About Us)</a> •
            <a href="/contact" style="color:#9a3412;font-weight:700;">సంప్రదించండి (Contact)</a> •
            <a href="/privacy-policy" style="color:#9a3412;font-weight:700;">గోప్యతా విధానం (Privacy Policy)</a> •
            <a href="/terms-and-conditions" style="color:#9a3412;font-weight:700;">నిబంధనలు (Terms)</a> •
            <a href="/disclaimer" style="color:#9a3412;font-weight:700;">జ్యోతిష్య గమనిక (Disclaimer)</a>
          </p>
        </aside>
      </main>`;
}
