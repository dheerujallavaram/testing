import { DayData } from '../types/panchangam';
import { findNakshatraClassicData } from '../data/krishnaRauNakshatraData';
import { getDailyRashiFortunes } from './panchangaLogic';

export type PanchangamSubTab = 'main' | 'gowri-hora' | 'tarabalam' | 'sankalpam';

export interface HeadMetaPayload {
  title: string;
  description: string;
  canonicalUrl: string;
  lang?: string;
}

export interface FeaturedDailyRashiSnippet {
  rashiId: string;
  rashiNameTe: string;
  rashiNameEn: string;
  statusLabelTe: string;
  predictionTe: string;
  predictionEn: string;
  remedyTe: string;
}

const RASHI_TE_LABELS: Record<string, string> = {
  mesham: 'మేషం',
  vrushabham: 'వృషభం',
  mithunam: 'మిథునం',
  karkatakam: 'కర్కాటకం',
  simham: 'సింహం',
  kanya: 'కన్య',
  tula: 'తుల',
  vruschikam: 'వృశ్చికం',
  dhanussu: 'ధనుస్సు',
  makaram: 'మకరం',
  kumbham: 'కుంభం',
  meenam: 'మీనం',
};

/**
 * Selects a featured/random Rashi Phalitham for the given day (seeded by the date so all 12 Rashis
 * rotate naturally across days, prioritizing auspicious/favorable transits for engaging search snippets).
 */
export function getFeaturedDailyRashiSnippet(day: DayData): FeaturedDailyRashiSnippet {
  const fortunes = getDailyRashiFortunes(day);
  const favorableList = fortunes.filter((f) => f.status === 'favorable');
  const pool = favorableList.length > 0 ? favorableList : fortunes;

  const dateSeed = (day.isoDate || '2026-10-27')
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const picked = pool[dateSeed % pool.length] || fortunes[0];

  const cleanPredictionTe = (picked?.careerFinanceLine || picked?.summary || day.phalitham)
    .replace(/\s+/g, ' ')
    .trim();

  return {
    rashiId: picked?.id || 'mesham',
    rashiNameTe: `${picked?.teluguName || 'మేష'} రాశి`,
    rashiNameEn: `${picked?.englishName || 'Aries'} (${picked?.teluguName || 'మేషం'})`,
    statusLabelTe: picked?.statusLabel || 'శుభం',
    predictionTe: cleanPredictionTe,
    predictionEn:
      picked?.englishFullSummary ||
      'Auspicious planetary transit brings career growth, financial gains, and family harmony today.',
    remedyTe: picked?.remedy || 'శ్రీ లక్ష్మీ గణపతి ఆరాధన శుభప్రదం',
  };
}

/**
 * Builds the front-loaded Google Search snippet for "Telugu Jyothisham" (Brand / Home / Jathakam queries).
 */
export function buildTeluguJyothishamBrandSnippet(
  day: DayData,
  lang: 'te' | 'en' = 'te'
): string {
  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;
  const featuredRashi = getFeaturedDailyRashiSnippet(day);

  if (lang === 'en') {
    return `Panchangam, Jatakam, Jyothisham, Horoscope & Astrology Predictions — Today Nakshatram: ${cleanNakshatra} (${day.teediVaram}, Tithi: ${cleanTithi}) | Daily Astrological Prediction: ${featuredRashi.rashiNameEn} (${featuredRashi.predictionTe}) | Free 100-Page Janma Kundali Jatakam PDF, Vastu, Muhurtham & Pooja Services — telugujyothisham.com.`;
  }

  return `Panchangam, Jatakam, Jyothisham, Horoscope & Astrology Predictions (తెలుగు జ్యోతిషం) — Daily Telugu Panchangam: ఈ రోజు నక్షత్రం ${cleanNakshatra} (${day.teediVaram}, తిథి: ${cleanTithi}) | Astrological Prediction (నేటి ${featuredRashi.rashiNameTe} ఫలం: ${featuredRashi.predictionTe}) | 100 పేజీల జన్మ కుండలి Jatakam PDF, Vastu, Muhurtham & Pooja Services (${day.shubha.amrutha}).`;
}

/**
 * Builds the front-loaded Google Search snippet for "Neti Panchangam" / "Telugu Panchangam" queries.
 */
export function buildNetiPanchangamSearchSnippet(
  day: DayData,
  lang: 'te' | 'en' = 'te'
): string {
  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;
  const featuredRashi = getFeaturedDailyRashiSnippet(day);

  if (lang === 'en') {
    return `Panchangam, Jatakam, Jyothisham, Horoscope & Astrological Predictions (${day.teediVaram}): Tithi ${cleanTithi}, Nakshatram ${cleanNakshatra}, Shubha Muhurtham: ${day.shubha.amrutha}, Abhijit: ${day.shubha.abhijit} | Daily Horoscope Prediction (${featuredRashi.rashiNameEn}): ${featuredRashi.predictionTe} | 100-Page Janma Kundali PDF.`;
  }

  return `Daily Telugu Panchangam, Jatakam, Jyothisham, Horoscope & Astrology Predictions — ఈ రోజు పంచాంగం (${day.teediVaram}): తిథి ${cleanTithi}, నక్షత్రం ${cleanNakshatra}, శుభ సమయం: ${day.shubha.amrutha} | Daily Horoscope Prediction (నేటి ${featuredRashi.rashiNameTe} ఫలం: ${featuredRashi.predictionTe}) | 100 పేజీల జన్మ కుండలి PDF (రాహుకాలం: ${day.ashubha.rahukalam}).`;
}

/**
 * Formats the current day's Grahasthiti (Navagraha Rashi positions) into a concise,
 * unique daily planetary transit summary for search engine meta-descriptions and schema.
 */
export function buildDailyGrahasthitiSnippet(grahaStithi: Record<string, string>): string {
  const entries = Object.entries(grahaStithi)
    .filter(([, planets]) => Boolean(planets && planets.trim()))
    .map(([rashiKey, planets]) => {
      const rashiLabel = RASHI_TE_LABELS[rashiKey] || rashiKey;
      const cleanPlanets = planets.replace(/\n+/g, ', ').trim();
      return `${rashiLabel}లో ${cleanPlanets}`;
    });

  return entries.length > 0
    ? entries.join('; ')
    : 'సూర్య-చంద్ర-గురు-శని నవగ్రహ గోచార సంచారం';
}

/**
 * High-performance helper to atomically update document head meta tags without redundant DOM creation.
 */
export function syncHeadMetaTags(payload: HeadMetaPayload): void {
  if (typeof document === 'undefined') return;

  if (payload.title && document.title !== payload.title) {
    document.title = payload.title;
  }
  if (payload.lang && document.documentElement.lang !== payload.lang) {
    document.documentElement.lang = payload.lang;
  }

  const upsertMeta = (selector: string, attrKey: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrKey, attrVal);
      document.head.appendChild(el);
    }
    if (el.getAttribute('content') !== content) {
      el.setAttribute('content', content);
    }
  };

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  if (canonicalEl.getAttribute('href') !== payload.canonicalUrl) {
    canonicalEl.setAttribute('href', payload.canonicalUrl);
  }

  upsertMeta('meta[name="description"]', 'name', 'description', payload.description);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', payload.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', payload.description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', payload.canonicalUrl);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', payload.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', payload.description);
  upsertMeta('meta[name="twitter:url"]', 'name', 'twitter:url', payload.canonicalUrl);
}

/**
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) Schema Builder
 * Establishes verified Vedic scholar credentials, awards, classical text citations, and editorial policies.
 */
export function buildEEATAuthoritySchema(baseUrl: string): Record<string, unknown>[] {
  return [
    {
      '@type': 'Person',
      '@id': `${baseUrl}/#guruji-eeat`,
      name: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ సిద్ధాంతి (Brahmasri Jallavaram Sai Dheeraj Sharma)',
      alternateName: [
        'Sri Jallavaram Sai Dheeraj Sharma',
        'Dheeraj Sharma Siddhanti',
        'జల్లవరం సాయి ధీరజ్ శర్మ',
      ],
      jobTitle: 'Founder, Chief Vedic Astrologer (Siddhanti) & Smartha Veda Vidwan',
      url: `${baseUrl}/about`,
      image: `${baseUrl}/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg`,
      worksFor: {
        '@id': `${baseUrl}/#organization`,
      },
      knowsLanguage: ['te', 'sa', 'en', 'hi'],
      knowsAbout: [
        'Drik Siddhanta Panchangam (దృక్సిద్ధాంత పంచాంగ గణన)',
        'Brihat Jataka & Parashara Hora Shastra (బృహత్ జాతక & పరాశర హోరా శాస్త్రం)',
        'Bhrigu Chakra Paddhati (భృగు చక్ర పద్ధతి)',
        'Muhurtha Chintamani & Nakshatra Chudamani (ముహూర్త చింతామణి & నక్షత్ర చూడామణి)',
        'Ashtakoota 36-Guna Vivaha Pontana (36 గుణాల వివాహ పొంతన)',
        'Gruha Vastu Shastra (గృహ వాస్తు శాస్త్రం)',
        'Sri Chandi Homam, Rudra Homam & Smartha Vaidika Kratuvulu',
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Vedic Astrology & Smartha Shastra Certification',
          name: 'స్మార్త వేద & జ్యోతిష విద్వాన్ (Smartha Veda & Jyothisha Vidwan)',
        },
      ],
      award: [
        'సువర్ణ కంకణ సత్కారం (Suvarna Kankanam Vedic Honor)',
        'జ్యోతిష విద్వాన్ పురస్కారం (Jyothisha Vidwan Citation)',
        'వైదిక పీఠ ఆశీర్వచన సత్కారం (Vedic Peetham Felicitations)',
      ],
    },
    {
      '@type': ['AstrologyService', 'ProfessionalService', 'Organization'],
      '@id': `${baseUrl}/#organization`,
      name: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — Telugu Jyothisham (తెలుగు జ్యోతిషం)',
      alternateName: [
        'Telugu Jyothisham',
        'తెలుగు జ్యోతిషం',
        'Sreelakshmi Ganapathi Jyothishalayam',
        'telugujyothisham.com',
      ],
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon-512x512.png`,
        width: 512,
        height: 512,
      },
      image: `${baseUrl}/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg`,
      founder: {
        '@id': `${baseUrl}/#guruji-eeat`,
      },
      telephone: '+91-8977986166',
      email: 'astrologer@telugujyothisham.com',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Pasumamula, Hayathnagar',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        postalCode: '501505',
        addressCountry: 'IN',
      },
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Canada' },
        { '@type': 'Country', name: 'Australia' },
      ],
      publishingPrinciples: `${baseUrl}/terms-and-conditions`,
      verificationFactCheckingPolicy: `${baseUrl}/disclaimer`,
      subjectOf: [
        {
          '@type': 'DigitalDocument',
          name: 'Telugu Jyothisham LLMO Knowledge Graph (llms.txt)',
          url: `${baseUrl}/llms.txt`,
        },
        {
          '@type': 'DigitalDocument',
          name: 'Telugu Jyothisham Extended AEO & GEO Knowledge Base (llms-full.txt)',
          url: `${baseUrl}/llms-full.txt`,
        },
      ],
    },
  ];
}

/**
 * GEO (Generative Engine Optimization): 12 Rashi Daily Horoscope & Graha Drishti ItemList Schema
 * Allows Google AI Overviews, Gemini, Perplexity, and ChatGPT Search to cite any of the 12 Rashis directly.
 */
export function buildDaily12RashiItemListSchema(
  day: DayData,
  fullUrl: string
): Record<string, unknown> {
  const fortunes = getDailyRashiFortunes(day);
  return {
    '@type': 'ItemList',
    '@id': `${fullUrl}#daily-12-rashi-horoscope-${day.id}`,
    name: `నేటి ద్వాదశ రాశి ఫలాలు & గ్రహ దృష్టి ఫలితాలు (${day.teediVaram}) — Today 12 Rashi Horoscope in Telugu`,
    description: `${day.teediVaram} నాటి 12 రాశుల (మేషం నుండి మీనం వరకు) దిన ఫలాలు, గ్రహ సంచారం, గ్రహ దృష్టి ప్రభావం, శుభ సమయం మరియు పరిహారాలు.`,
    numberOfItems: fortunes.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: fortunes.map((r, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: `${r.teluguName} రాశి (${r.englishName}) — ${day.teediVaram} నేటి రాశి ఫలం & గ్రహ దృష్టి`,
      description: `${r.teluguName} రాశి (${r.statusLabel}): ${r.grahaDrishtiHeadlineTe} (${r.grahaDrishtiTimeTe}) — ${r.grahaDrishtiPhalamTe} కెరీర్ & ధనలాభం: ${r.careerFinanceLine} నేడు చేయవలసిన పని: ${r.doTodayTe} జాగ్రత్త: ${r.avoidTodayTe} శుభ సమయం: ${r.luckyTimeWindowTe}. పరిహారం: ${r.remedy}.`,
      url: `${fullUrl}#dina-phalam`,
    })),
  };
}

/**
 * AEO (Answer Engine Optimization): HowTo Schema for Step-by-Step Answer Snippets
 */
export function buildStandardizedHowToSchema(baseUrl: string): Record<string, unknown> {
  return {
    '@type': 'HowTo',
    '@id': `${baseUrl}/#howto-janma-kundali`,
    name: 'తెలుగులో ఉచిత జన్మ కుండలి (100 పేజీల PDF) మరియు 36 గుణాల వివాహ పొంతన ఎలా చూసుకోవాలి?',
    description:
      'పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా దృక్సిద్ధాంత జన్మ కుండలి (D1 రాశి చక్రం, D9 నవాంశ, మహాదశ, భృగు చక్రం) మరియు వధూవరుల 36 గుణాల వివాహ పొంతన చూసుకునే విధానం.',
    inLanguage: ['te', 'en'],
    totalTime: 'PT1M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'మీ జాతకం తెలుసుకోండి విభాగాన్ని తెరవండి',
        text: 'www.telugujyothisham.com/mee-jatakam పేజీకి వెళ్లండి.',
        url: `${baseUrl}/mee-jatakam`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'పుట్టిన తేదీ, సమయం మరియు ప్రాంతం నమోదు చేయండి',
        text: 'మీ పేరు, పుట్టిన తేదీ (Date of Birth), పుట్టిన సమయం (Time of Birth), మరియు పుట్టిన ఊరు (India లేదా USA/NRI సిటీ) ఎంచుకోండి.',
        url: `${baseUrl}/mee-jatakam`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'సంపూర్ణ జన్మ కుండలి & PDF రిపోర్ట్ పొందండి',
        text: 'వెంటనే D1 రాశి చక్రం, D9 నవాంశ, 12 స్థానాల ఫలితాలు, వింశోత్తరి మహాదశ, భృగు చక్ర ఫలితాలు మరియు రత్న/రుద్రాక్ష పరిహారాలతో కూడిన జాతక గ్రంథాన్ని చూసి ప్రింట్/PDF డౌన్‌లోడ్ చేసుకోండి.',
        url: `${baseUrl}/janma-kundali`,
      },
    ],
  };
}

/**
 * Builds the standardized Schema.org WebApplication object optimized for 'Neti Panchangam'
 * and Telugu Jyothisham interactive rich snippets.
 */
export function buildStandardizedWebApplicationSchema(
  day: DayData,
  fullUrl: string,
  panchangamSubTab: PanchangamSubTab,
  uniqueDailyDescription: string
): Record<string, unknown> {
  const baseUrl = 'https://www.telugujyothisham.com';
  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;
  const featuredRashi = getFeaturedDailyRashiSnippet(day);

  const subTabNames: Record<PanchangamSubTab, string> = {
    main: `Neti Panchangam (ఈ రోజు పంచాంగం - ${day.teediVaram}): తిథి ${cleanTithi}, నక్షత్రం ${cleanNakshatra} | Telugu Jyothisham (తెలుగు జ్యోతిషం) — 100 పేజీల జన్మ కుండలి PDF`,
    'gowri-hora': `Neti Panchangam — నేటి గౌరీ పంచాంగం & హోరా చక్రం (${day.teediVaram}) | Telugu Jyothisham`,
    tarabalam: `Neti Panchangam — నేటి తారాబలం & చంద్రబలం క్యాలిక్యులేటర్ (${day.teediVaram}) | Telugu Jyothisham`,
    sankalpam: `Neti Panchangam — నేటి పూజా సంకల్పం మంత్రం (${day.teediVaram}) | Telugu Jyothisham`,
  };

  return {
    '@type': 'WebApplication',
    '@id': `${baseUrl}/#webapp`,
    name: subTabNames[panchangamSubTab] || subTabNames.main,
    alternateName: [
      'Neti Panchangam',
      'నేటి పంచాంగం',
      'Today Panchangam in Telugu',
      'ఈ రోజు పంచాంగం',
      'Ee Roju Panchangam',
      'Telugu Jyothisham',
      'తెలుగు జ్యోతిషం',
      'Telugu Panchangam',
      'తెలుగు పంచాంగం',
    ],
    url: fullUrl,
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'Vedic Astrology, Neti Panchangam & Horoscope Calculator',
    operatingSystem: 'All',
    browserRequirements: 'Requires HTML5 / JavaScript',
    softwareVersion: `2026.${day.isoDate.replace(/-/g, '')}`,
    inLanguage: ['te', 'en'],
    isAccessibleForFree: true,
    datePublished: `${day.isoDate}T05:30:00+05:30`,
    dateModified: `${day.isoDate}T06:00:00+05:30`,
    description: uniqueDailyDescription,
    featureList: [
      `ఈ రోజు పంచాంగం (Neti Panchangam - ${day.teediVaram}): తిథి ${cleanTithi}, నక్షత్రం ${cleanNakshatra}, శుభ సమయం: ${day.shubha.amrutha}`,
      `మీ రాశి ప్రకారం నేటి ${featuredRashi.rashiNameTe} ఫలం: ${featuredRashi.predictionTe}`,
      'మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF రిపోర్ట్ పొందండి (100-Page Janma Kundali PDF)',
      `నేటి రాహుకాలం (${day.ashubha.rahukalam}) & అభిజిత్ ముహూర్తం (${day.shubha.abhijit})`,
      '12 రాశుల దిన ఫలాలు & గ్రహ దృష్టి ఫలితాలు (Today Rasi Phalalu & Graha Drishti in Telugu)',
      '36 గుణాల అష్టకూట వివాహ పొంతన (Marriage Compatibility)',
      'పగలు & రాత్రి గౌరీ పంచాంగం మరియు 24 గంటల నవగ్రహ హోరా చక్రం',
      '27 నక్షత్రాల నవతార తారాబలం & 12 రాశుల చంద్రబలం గణన',
    ],
    screenshot: `${baseUrl}/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg`,
    author: {
      '@id': `${baseUrl}/#guruji-eeat`,
    },
    reviewedBy: {
      '@id': `${baseUrl}/#guruji-eeat`,
    },
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      name: 'Free Daily Telugu Panchangam (Neti Panchangam) & 100-Page Janma Kundali PDF Report',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: fullUrl,
    },
    potentialAction: {
      '@type': 'ViewAction',
      name: `View Neti Panchangam (${day.teediVaram})`,
      target: [
        `${baseUrl}/panchangam`,
        `${baseUrl}/neti-panchangam`,
        `${baseUrl}/today-panchangam-in-telugu`,
      ],
    },
  };
}

/**
 * Builds the standardized Schema.org FAQPage object specifically engineered to trigger
 * AEO (Answer Engine Optimization) & GEO snippets for 'Neti Panchangam', 'Today Panchangam in Telugu', and 'ఈ రోజు పంచాంగం'.
 */
export function buildStandardizedDailyFaqSchema(
  day: DayData,
  fullUrl: string,
  nakshatraLord: string,
  nakshatraDeity: string,
  nakshatraAuspicious: string,
  grahasthitiSummary: string
): Record<string, unknown> {
  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;
  const featuredRashi = getFeaturedDailyRashiSnippet(day);

  return {
    '@type': 'FAQPage',
    '@id': `${fullUrl}#faq`,
    inLanguage: ['te', 'en'],
    name: `Neti Panchangam (${day.teediVaram}) — నేటి తెలుగు పంచాంగం తరచుగా అడిగే ప్రశ్నలు (AEO & GEO Verified FAQ)`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#panchangam-quick-summary', '#prerender-lead-snippet', 'h1', 'h2', 'dl'],
    },
    mainEntity: [
      {
        '@type': 'Question',
        name: `నేటి పంచాంగం (Neti Panchangam - ${day.teediVaram}) లో ఈ రోజు తిథి, నక్షత్రం, శుభ సమయం మరియు రాశి ఫలం ఏమిటి?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ఈ రోజు పంచాంగం (${day.teediVaram}): నేటి తిథి ${cleanTithi}, ఈ రోజు నక్షత్రం ${cleanNakshatra} (అధిపతి: ${nakshatraLord}, దేవత: ${nakshatraDeity}), శుభ సమయం (అమృత ఘడియలు): ${day.shubha.amrutha}, అభిజిత్ ముహూర్తం: ${day.shubha.abhijit} | మీ రాశి ప్రకారం నేటి ${featuredRashi.rashiNameTe} ఫలం: ${featuredRashi.predictionTe} | రాహుకాలం: ${day.ashubha.rahukalam}. మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF రిపోర్ట్ పొందండి.`,
        },
      },
      {
        '@type': 'Question',
        name: `తెలుగు జ్యోతిషం (Telugu Jyothisham) లో ఈ రోజు నక్షత్రం ప్రకారం రాశి ఫలితం మరియు 100 పేజీల జన్మ కుండలి PDF ఎలా పొందాలి?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ఈ రోజు నక్షత్రం ${cleanNakshatra} (${day.teediVaram}). మీ రాశి ప్రకారం నేటి ${featuredRashi.rashiNameTe} ఫలితం: ${featuredRashi.predictionTe}. www.telugujyothisham.com లో మీ పుట్టిన తేదీ, సమయం, ప్రాంతం వివరాలతో మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF రిపోర్ట్ (D1 రాశి చక్రం, D9 నవాంశ, 12 భావాల ఫలితాలు, వింశోత్తరి మహాదశ & భృగు చక్ర ఫలితాలు) వెంటనే పొందవచ్చు.`,
        },
      },
      {
        '@type': 'Question',
        name: `ఈ రోజు తిథి మరియు నక్షత్రం ఏమిటి? (${day.teediVaram} - Today Tithi & Nakshatram in Telugu)`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ఈ రోజు (${day.teediVaram}) ${day.panchanga.masam}, తిథి: ${day.panchanga.tithi}, నక్షత్రం: ${day.panchanga.nakshatram}. ముహూర్త చింతామణి మరియు నక్షత్ర చూడామణి ప్రకారం ఈ నక్షత్రంలో చేయుటకు అనుకూలమైన శుభకార్యాలు: ${nakshatraAuspicious}.`,
        },
      },
      {
        '@type': 'Question',
        name: `ఈ రోజు శుభ సమయం, అమృత ఘడియలు మరియు అభిజిత్ ముహూర్తం ఎప్పుడు? (${day.teediVaram} Shubha Samayam)`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${day.teediVaram} నాడు శుభ సమయాలు — అమృత ఘడియలు (Amrutha Gadiyalu): ${day.shubha.amrutha}, అభిజిత్ ముహూర్తం (Abhijit Muhurtham): ${day.shubha.abhijit}. రాహుకాలం: ${day.ashubha.rahukalam}, యమగండం: ${day.ashubha.yamagandam}, వర్జ్యం: ${day.ashubha.varjyam}.`,
        },
      },
      {
        '@type': 'Question',
        name: `ఈ రోజు నవగ్రహ గ్రహస్థితి (Grahasthiti), గ్రహ సంచారం మరియు గ్రహ దృష్టి (Graha Drishti) ఏ రాశుల వారికి అనుకూలంగా ఉంది? (${day.teediVaram})`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${day.teediVaram} నాటి నవగ్రహ గోచార గ్రహస్థితి: [${grahasthitiSummary}]. ${day.chandra.sancharam} ${day.chandra.chandrashtamam} ${day.chandra.navataraBalam} ప్రతి రాశి వారికి నేటి గ్రహ దృష్టి వల్ల ఉద్యోగం, ధనలాభం, కుటుంబం మరియు ఆరోగ్యంలో కలిగే సులభమైన లౌకిక ఫలితాలు మరియు శుభ సమయాలు అందుబాటులో ఉన్నాయి.`,
        },
      },
    ],
  };
}

/**
 * Automated Daily Panchangam & Jyothisham SEO + AEO + GEO + LLMO + AISEO + E-E-A-T Engine
 */
export function syncAutomatedDailySeoSchema(
  day: DayData,
  activeRoute: string,
  panchangamSubTab: PanchangamSubTab = 'main'
): void {
  if (typeof document === 'undefined') return;

  const baseUrl = 'https://www.telugujyothisham.com';
  const cleanPath = activeRoute === '/' ? '/' : activeRoute.replace(/\/+$/, '');
  const fullUrl = `${baseUrl}${cleanPath}`;

  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;
  const featuredRashi = getFeaturedDailyRashiSnippet(day);

  // Lookup deep Nakshatra profile (Deity, Ruling Planet, Muhurtha Chintamani & Yavanacharya Phala)
  const nakshatraProfile = findNakshatraClassicData(cleanNakshatra);
  const nakshatraLord = nakshatraProfile?.lordTe || 'నక్షత్రాధిపతి';
  const nakshatraDeity = nakshatraProfile?.deityTe || 'అధిష్ఠాన దేవత';
  const nakshatraAuspicious =
    nakshatraProfile?.forEverybody.auspiciousFor.slice(0, 4).join(', ') ||
    'నిత్య దైవారాధన, శుభకార్యాలు';

  // Build unique daily Grahasthiti summary from current day's planetary Rashi placements
  const grahasthitiSummary = buildDailyGrahasthitiSnippet(day.grahaStithi || {});

  const brandSnippet = buildTeluguJyothishamBrandSnippet(day, 'te');
  const netiPanchangamSnippet = buildNetiPanchangamSearchSnippet(day, 'te');

  const uniqueDailyArticleMetaDescription =
    cleanPath === '/' || cleanPath === '/mee-jatakam' || cleanPath === '/janma-kundali'
      ? `${brandSnippet} నేటి గ్రహస్థితి: [${grahasthitiSummary}] — యవనాచార్యుల మతం, ముహూర్త చింతామణి & బృహత్ జాతక గ్రంథ ప్రమాణాలతో.`
      : `${netiPanchangamSnippet} నేటి గ్రహస్థితి: [${grahasthitiSummary}] — యవనాచార్యుల మతం, ముహూర్త చింతామణి, నక్షత్ర చూడామణి & బృహత్ జాతక గ్రంథ ప్రమాణాలతో.`;

  // Sync <meta name="article:description"> and daily Panchangam/Home meta description tags
  let articleMetaEl = document.querySelector('meta[name="article:description"]') as HTMLMetaElement | null;
  if (!articleMetaEl) {
    articleMetaEl = document.createElement('meta');
    articleMetaEl.setAttribute('name', 'article:description');
    document.head.appendChild(articleMetaEl);
  }
  articleMetaEl.setAttribute('content', uniqueDailyArticleMetaDescription);

  const isBrandHomeRoute =
    cleanPath === '/' || cleanPath === '/mee-jatakam' || cleanPath === '/janma-kundali';
  const isNetiPanchangamRoute =
    cleanPath === '/panchangam' ||
    cleanPath === '/neti-panchangam' ||
    cleanPath === '/today-panchangam-in-telugu' ||
    cleanPath === '/ee-roju-panchangam';

  if ((isBrandHomeRoute || isNetiPanchangamRoute) && panchangamSubTab === 'main') {
    const snippetToInject = isBrandHomeRoute ? brandSnippet : netiPanchangamSnippet;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', snippetToInject);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', snippetToInject);

    const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescEl) twitterDescEl.setAttribute('content', snippetToInject);
  }

  const backendDailyKeywords = [
    'Panchangam',
    'jatakam',
    'Jyothisham',
    'horoscope',
    'astrology',
    'astrological',
    'Predictions',
    'prediction',
    'astrological predictions',
    'horoscope prediction',
    'daily horoscope predictions',
    'astrology predictions',
    'Vastu',
    'Muhurtham',
    'Pooja services',
    'Neti Panchangam',
    'నేటి పంచాంగం',
    'Today Panchangam in Telugu',
    'ఈ రోజు పంచాంగం',
    'Ee Roju Panchangam',
    'Telugu Jyothisham',
    'తెలుగు జ్యోతిషం',
    'Telugu astrology',
    'Telugu horoscope',
    'Telugu jatakam',
    'Telugu jathakam',
    'Telugu Panchangam',
    'తెలుగు జాతకం',
    'తెలుగు పంచాంగం',
    'తెలుగు రాశి ఫలాలు',
    'గ్రహ దృష్టి ఫలితాలు',
    'నేటి గ్రహ దృష్టి',
    'గ్రహ సంచారం 2026',
    'Graha Drishti Phalithalu in Telugu',
    'Graha Sancharam 2026 Telugu',
    'మేష రాశి నేటి ఫలితాలు',
    'వృషభ రాశి నేటి ఫలితాలు',
    'మిథున రాశి నేటి ఫలితాలు',
    'కర్కాటక రాశి నేటి ఫలితాలు',
    'సింహ రాశి నేటి ఫలితాలు',
    'కన్యా రాశి నేటి ఫలితాలు',
    'తులా రాశి నేటి ఫలితాలు',
    'వృశ్చిక రాశి నేటి ఫలితాలు',
    'ధనుస్సు రాశి నేటి ఫలితాలు',
    'మకర రాశి నేటి ఫలితాలు',
    'కుంభ రాశి నేటి ఫలితాలు',
    'మీన రాశి నేటి ఫలితాలు',
    'Online Jathakam in Telugu by Date of Birth',
    'Free Janma Kundali in Telugu',
    'Today Rasi Phalalu in Telugu',
    'Marriage Matching in Telugu',
    'Vivaha Pontana Telugu',
    'Vadhuvu Varudu 36 Guna Melanam',
    'Subha Muhurtham Dates in Telugu',
    'Today Tithi & Nakshatram in Telugu',
    'Rahu Kalam Today in Telugu',
    'Amrutha Gadiyalu Today in Telugu',
    'USA NRI Telugu Panchangam CST EST PST',
    'Kuja Dosha & Kalasarpa Dosha Nivarana',
    'Telugu Baby Names by Nakshatra',
    'Gruha Vastu Shastra in Telugu',
    `${cleanNakshatra} నక్షత్ర ఫలాలు`,
    `${cleanTithi} తిథి ఫలితం`,
    `${featuredRashi.rashiNameTe} నేటి ఫలితం`,
    'మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF పొందండి',
    'యవనాచార్యుల మతం',
    'భృగు చక్ర పద్ధతి',
    'బృహత్ జాతక గ్రంథం',
    'ముహూర్త చింతామణి',
    'నక్షత్ర చూడామణి',
  ];

  const articleHeadline = `ఈ రోజు పంచాంగం (Neti Panchangam - ${day.teediVaram}) | తిథి: ${cleanTithi}, నక్షత్రం: ${cleanNakshatra}, శుభ సమయం: ${day.shubha.amrutha} | నేటి ${featuredRashi.rashiNameTe} ఫలితం & 100 పేజీల జన్మ కుండలి PDF — Telugu Jyothisham`;

  const eeatNodes = buildEEATAuthoritySchema(baseUrl);
  const webAppNode = buildStandardizedWebApplicationSchema(
    day,
    fullUrl,
    panchangamSubTab,
    uniqueDailyArticleMetaDescription
  );
  const faqPageNode = buildStandardizedDailyFaqSchema(
    day,
    fullUrl,
    nakshatraLord,
    nakshatraDeity,
    nakshatraAuspicious,
    grahasthitiSummary
  );
  const rashiItemListNode = buildDaily12RashiItemListSchema(day, fullUrl);
  const howToNode = buildStandardizedHowToSchema(baseUrl);

  const graphNodes: Record<string, unknown>[] = [
    ...eeatNodes,
    webAppNode,
    faqPageNode,
    rashiItemListNode,
    howToNode,
    {
      '@type': 'NewsArticle',
      '@id': `${fullUrl}#daily-panchangam-${day.id}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl,
      },
      headline: articleHeadline,
      alternativeHeadline: `Neti Panchangam | Today Panchangam in Telugu (${day.teediVaram}) - ${cleanNakshatra} Nakshatra & Grahasthiti`,
      description: uniqueDailyArticleMetaDescription,
      abstract: uniqueDailyArticleMetaDescription,
      articleBody: `${uniqueDailyArticleMetaDescription} ${day.phalitham} ${nakshatraProfile?.yavanacharyaTe || ''}`,
      datePublished: `${day.isoDate}T05:30:00+05:30`,
      dateModified: `${day.isoDate}T06:00:00+05:30`,
      inLanguage: ['te', 'en'],
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#panchangam-quick-summary', '#prerender-lead-snippet', 'h1', 'h2', 'dl'],
      },
      author: {
        '@id': `${baseUrl}/#guruji-eeat`,
      },
      reviewedBy: {
        '@id': `${baseUrl}/#guruji-eeat`,
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
      citation: [
        'Brihat Jataka (బృహత్ జాతకం) by Acharya Varahamihira',
        'Yavanacharya Jataka (యవనాచార్యుల మతం)',
        'Muhurtha Chintamani (ముహూర్త చింతామణి)',
        'Nakshatra Chudamani (నక్షత్ర చూడామణి)',
        'Drik Siddhanta Solar & Lunar Ephemeris (దృక్సిద్ధాంత గణన)',
      ],
      image: [
        `${baseUrl}/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg`,
        `${baseUrl}/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg`,
        `${baseUrl}/favicon-512x512.png`,
      ],
      keywords: backendDailyKeywords,
      about: [
        { '@type': 'Thing', name: 'Neti Panchangam (నేటి పంచాంగం / Today Panchangam in Telugu)' },
        { '@type': 'Thing', name: 'Telugu Jyothisham (తెలుగు జ్యోతిషం)' },
        { '@type': 'Thing', name: 'Telugu Astrology & Telugu Horoscope (తెలుగు రాశి ఫలాలు & గ్రహ దృష్టి)' },
        { '@type': 'Thing', name: 'Telugu Jathakam (తెలుగు జాతకం & బృహత్ జాతక గ్రంథం)' },
        { '@type': 'Thing', name: `Nakshatram: ${cleanNakshatra} (${nakshatraLord} / ${nakshatraDeity})` },
        { '@type': 'Thing', name: `Grahasthiti: ${grahasthitiSummary}` },
        { '@type': 'Thing', name: `Tithi: ${cleanTithi}` },
      ],
    },
    {
      '@type': 'Dataset',
      '@id': `${fullUrl}#panchangam-dataset-${day.id}`,
      name: `Neti Panchangam (${day.teediVaram}) — Telugu Jyothisham దృక్సిద్ధాంత గ్రహస్థితి & నక్షత్ర గణనలు`,
      description: uniqueDailyArticleMetaDescription,
      keywords: backendDailyKeywords,
      url: fullUrl,
      temporalCoverage: day.isoDate,
      inLanguage: ['te', 'en'],
      isAccessibleForFree: true,
      license: `${baseUrl}/terms-and-conditions`,
      creator: {
        '@id': `${baseUrl}/#organization`,
      },
      citation: [
        'Drik Siddhanta Panchanga Ganitham (Lahiri Chitrapaksha Ayanamsha)',
        'Muhurtha Chintamani & Kalamrutham',
      ],
      variableMeasured: [
        `సంవత్సరం (Samvatsaram): ${day.panchanga.samvatsaram}`,
        `మాసం (Masam): ${day.panchanga.masam}`,
        `తిథి (Tithi): ${day.panchanga.tithi}`,
        `నక్షత్రం (Nakshatram): ${day.panchanga.nakshatram} (అధిపతి: ${nakshatraLord}, దేవత: ${nakshatraDeity})`,
        `నేటి గ్రహస్థితి (Grahasthiti): ${grahasthitiSummary}`,
        `యోగం (Yogam): ${day.panchanga.yogam}`,
        `కరణం (Karanam): ${day.panchanga.karanam}`,
        `రాహుకాలం (Rahu Kalam): ${day.ashubha.rahukalam}`,
        `యమగండం (Yamagandam): ${day.ashubha.yamagandam}`,
        `వర్జ్యం (Varjyam): ${day.ashubha.varjyam}`,
        `అమృత ఘడియలు (Amrutha Gadiyalu): ${day.shubha.amrutha}`,
        `అభిజిత్ ముహూర్తం (Abhijit Muhurtham): ${day.shubha.abhijit}`,
      ],
    },
  ];

  if (day.specialEvent) {
    graphNodes.push({
      '@type': 'Event',
      '@id': `${fullUrl}#festival-event-${day.id}`,
      name: `${day.specialEvent} — ${day.teediVaram} (Neti Panchangam)`,
      startDate: `${day.isoDate}T06:00:00+05:30`,
      endDate: `${day.isoDate}T23:59:00+05:30`,
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      description: `${day.teediVaram} విశేషం: ${day.specialEvent}. ${day.phalitham}`,
      location: {
        '@type': 'Place',
        name: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (Telugu Jyothisham)',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          addressCountry: 'IN',
        },
      },
      organizer: {
        '@id': `${baseUrl}/#organization`,
      },
    });
  }

  let scriptEl = document.getElementById('automated-daily-panchangam-schema') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'automated-daily-panchangam-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  scriptEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graphNodes,
  });
}
