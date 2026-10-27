import { DayData } from '../types/panchangam';
import { findNakshatraClassicData } from '../data/krishnaRauNakshatraData';

export type PanchangamSubTab = 'main' | 'gowri-hora' | 'tarabalam' | 'sankalpam';

export interface HeadMetaPayload {
  title: string;
  description: string;
  canonicalUrl: string;
  lang?: string;
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

  const subTabNames: Record<PanchangamSubTab, string> = {
    main: `Neti Panchangam (నేటి పంచాంగం - ${day.teediVaram}) | Telugu Jyothisham (తెలుగు జ్యోతిషం) & ಜన్మ కుండలి`,
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
      `Neti Panchangam (నేటి పంచాంగం - ${day.teediVaram}): తిథి ${cleanTithi}, నక్షత్రం ${cleanNakshatra}`,
      `నేటి రాహుకాలం (${day.ashubha.rahukalam}) & అమృత ఘడియలు (${day.shubha.amrutha})`,
      '12 రాశుల దిన ఫలాలు (Today Rasi Phalalu in Telugu)',
      'ఉచిత తెలుగు జన్మ కుండలి & బృహత్ జాతక గ్రంథ ఫలితాలు (Free Janma Kundali)',
      '36 గుణాల అష్టకూట వివాహ పొంతన (Marriage Compatibility)',
      'పగలు & రాత్రి గౌరీ పంచాంగం మరియు 24 గంటల నవగ్రహ హోరా చక్రం',
      '27 నక్షత్రాల నవతార తారాబలం & 12 రాశుల చంద్రబలం గణన',
      'భారతదేశం (జంబూద్వీపే) & అమెరికా NRI (క్రౌంచద్వీపే) నిత్య పూజా సంకల్పం',
    ],
    screenshot: `${baseUrl}/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg`,
    author: {
      '@type': 'Person',
      name: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ సిద్ధాంతి (Brahmasri Jallavaram Sai Dheeraj Sharma)',
      url: `${baseUrl}/about`,
    },
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      name: 'Free Daily Telugu Panchangam (Neti Panchangam) & Janma Kundali',
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
 * Google Search rich snippets for 'Neti Panchangam', 'Today Panchangam in Telugu', and 'ఈ రోజు పంచాంగం'.
 */
export function buildStandardizedDailyFaqSchema(
  day: DayData,
  fullUrl: string,
  nakshatraLord: string,
  nakshatraDeity: string,
  nakshatraAuspicious: string,
  grahasthitiSummary: string
): Record<string, unknown> {
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;

  return {
    '@type': 'FAQPage',
    '@id': `${fullUrl}#faq`,
    inLanguage: ['te', 'en'],
    name: `Neti Panchangam (${day.teediVaram}) — నేటి తెలుగు పంచాంగం తరచుగా అడిగే ప్రశ్నలు (FAQ)`,
    mainEntity: [
      {
        '@type': 'Question',
        name: `నేటి పంచాంగం (Neti Panchangam - ${day.teediVaram}) తిథి, నక్షత్రం మరియు రాహుకాలం వివరాలు ఏమిటి?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${day.teediVaram} (${day.isoDate}) నాటి నేటి పంచాంగం (Neti Panchangam / Today Panchangam in Telugu) ప్రకారం — సంవత్సరం: ${day.panchanga.samvatsaram}, మాసం: ${day.panchanga.masam}, తిథి: ${day.panchanga.tithi}, నక్షత్రం: ${day.panchanga.nakshatram} (అధిపతి: ${nakshatraLord}, అధిష్ఠాన దేవత: ${nakshatraDeity}), యోగం: ${day.panchanga.yogam}, కరణం: ${day.panchanga.karanam}, రాహుకాలం: ${day.ashubha.rahukalam}, అమృత ఘడియలు: ${day.shubha.amrutha}, అభిజిత్ ముహూర్తం: ${day.shubha.abhijit}.`,
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
        name: `నేటి పంచాంగం ప్రకారం ఈ రోజు రాహుకాలం, యమగండం మరియు వర్జ్యం సమయాలు ఏవి? (${day.teediVaram} Rahu Kalam Today)`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${day.teediVaram} నాడు అశుభ సమయాలు — రాహుకాలం (Rahu Kalam): ${day.ashubha.rahukalam}, యమగండం (Yamagandam): ${day.ashubha.yamagandam}, వర్జ్యం (Varjyam): ${day.ashubha.varjyam}, దుర్ముహూర్తం (Durmuhurtham): ${day.ashubha.durmuhurtham}.`,
        },
      },
      {
        '@type': 'Question',
        name: `ఈ రోజు అమృత ఘడియలు మరియు అభిజిత్ ముహూర్తం ఎప్పుడు? (${day.teediVaram} Shubha Muhurtham Timings)`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${day.teediVaram} నాడు శుభ సమయాలు — అమృత ఘడియలు (Amrutha Gadiyalu): ${day.shubha.amrutha}, అభిజిత్ ముహూర్తం (Abhijit Muhurtham): ${day.shubha.abhijit}. ఈ సమయాలు నూతన శుభకార్య ప్రారంభాలకు అత్యంత శ్రేష్ఠమైనవి.`,
        },
      },
      {
        '@type': 'Question',
        name: `ఈ రోజు నవగ్రహ గ్రహస్థితి (Grahasthiti) మరియు చంద్రబలం ఏ రాశుల వారికి అనుకూలంగా ఉంది? (${day.teediVaram})`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${day.teediVaram} నాటి నవగ్రహ గోచార గ్రహస్థితి: [${grahasthitiSummary}]. ${day.chandra.sancharam} ${day.chandra.chandrashtamam} ${day.chandra.navataraBalam}`,
        },
      },
      {
        '@type': 'Question',
        name: `తెలుగు జ్యోతిషం (Telugu Jyothisham) లో నేటి పంచాంగం మరియు ఉచిత జన్మ కుండలి ఎలా చూసుకోవాలి?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `www.telugujyothisham.com లో ప్రతిరోజూ దృక్సిద్ధాంత గణనలతో కూడిన నేటి పంచాంగం (Neti Panchangam), గౌరీ పంచాంగం, హోరా చక్రం, తారాబలం మరియు బృహత్ జాతక గ్రంథం & భృగు చక్ర పద్ధతి ఆధారంగా ఉచిత తెలుగు జన్మ కుండలి (Free Janma Kundali), 36 గుణాల వివాహ పొంతన వివరాలను వెంటనే చూసుకోవచ్చు.`,
        },
      },
    ],
  };
}

/**
 * Automated Daily Panchangam & Jyothisham SEO Engine
 * Dynamically generates fresh, unique article meta-descriptions and injects standardized
 * Schema.org JSON-LD structured data (WebApplication, FAQPage, NewsArticle, Dataset, Event)
 * based on the current day's Nakshatra and Grahasthiti data to maximize rich snippet eligibility
 * for 'Neti Panchangam' and Telugu astrology search queries.
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

  // Lookup deep Nakshatra profile (Deity, Ruling Planet, Muhurtha Chintamani & Yavanacharya Phala)
  const nakshatraProfile = findNakshatraClassicData(cleanNakshatra);
  const nakshatraLord = nakshatraProfile?.lordTe || 'నక్షత్రాధిపతి';
  const nakshatraDeity = nakshatraProfile?.deityTe || 'అధిష్ఠాన దేవత';
  const nakshatraAuspicious =
    nakshatraProfile?.forEverybody.auspiciousFor.slice(0, 4).join(', ') ||
    'నిత్య దైవారాధన, శుభకార్యాలు';

  // Build unique daily Grahasthiti summary from current day's planetary Rashi placements
  const grahasthitiSummary = buildDailyGrahasthitiSnippet(day.grahaStithi || {});

  // Unique daily Article Meta-Description combining Nakshatra + Grahasthiti + Panchanga limbs
  const uniqueDailyArticleMetaDescription = `Neti Panchangam (నేటి పంచాంగం - ${day.teediVaram}, ${day.isoDate}) | తెలుగు జ్యోతిషం (Telugu Jyothisham): తిథి ${day.panchanga.tithi}, ${cleanNakshatra} నక్షత్రం (అధిపతి: ${nakshatraLord}, దేవత: ${nakshatraDeity}; శుభకార్యాలు: ${nakshatraAuspicious}), నేటి గ్రహస్థితి: [${grahasthitiSummary}], రాహుకాలం: ${day.ashubha.rahukalam}, అమృత ఘడియలు: ${day.shubha.amrutha} — యవనాచార్యుల మతం, ముహూర్త చింతామణి, నక్షత్ర చూడామణి & బృహత్ జాతక గ్రంథ ప్రమాణాలతో.`;

  // Sync <meta name="article:description"> and daily Panchangam/Home meta description tags
  let articleMetaEl = document.querySelector('meta[name="article:description"]') as HTMLMetaElement | null;
  if (!articleMetaEl) {
    articleMetaEl = document.createElement('meta');
    articleMetaEl.setAttribute('name', 'article:description');
    document.head.appendChild(articleMetaEl);
  }
  articleMetaEl.setAttribute('content', uniqueDailyArticleMetaDescription);

  const isDailyPanchangamRoute =
    cleanPath === '/' ||
    cleanPath === '/panchangam' ||
    cleanPath === '/neti-panchangam' ||
    cleanPath === '/today-panchangam-in-telugu' ||
    cleanPath === '/ee-roju-panchangam';

  if (isDailyPanchangamRoute && panchangamSubTab === 'main') {
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', uniqueDailyArticleMetaDescription);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', uniqueDailyArticleMetaDescription);

    const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescEl) twitterDescEl.setAttribute('content', uniqueDailyArticleMetaDescription);
  }

  // Backend popular daily Telugu astrology search keywords (kept hidden from visible UI)
  const backendDailyKeywords = [
    'Neti Panchangam',
    'నేటి పంచాంగం',
    'Today Panchangam in Telugu',
    'ఈ రోజు పంచాంగం',
    'Ee Roju Panchangam',
    'Telugu Jyothisham',
    'తెలుగు జ్యోతిషం',
    'Telugu astrology',
    'Telugu horoscope',
    'Telugu jathakam',
    'Telugu Panchangam',
    'తెలుగు జాతకం',
    'తెలుగు పంచాంగం',
    'తెలుగు రాశి ఫలాలు',
    'Online Jathakam in Telugu by Date of Birth',
    'Free Janma Kundali in Telugu',
    'Today Rasi Phalalu in Telugu',
    'Marriage Matching in Telugu',
    'Vivaha Pontana Telugu',
    'Vadhuvu Varudu 36 Guna Melanam',
    'Subha Muhurtham Dates in Telugu',
    'Today Tithi & Nakshatram in Telugu',
    'Rahu Kalam Today in Telugu',
    'Kuja Dosha & Kalasarpa Dosha Nivarana',
    'Telugu Baby Names by Nakshatra',
    'Gruha Vastu Shastra in Telugu',
    `${cleanNakshatra} నక్షత్ర ఫలాలు`,
    `${cleanTithi} తిథి ఫలితం`,
    'యవనాచార్యుల మతం',
    'భృగు చక్ర పద్ధతి',
    'బృహత్ జాతక గ్రంథం',
    'ముహూర్త చింతామణి',
    'నక్షత్ర చూడామణి',
  ];

  const articleHeadline = `Neti Panchangam (నేటి పంచాంగం - ${day.teediVaram}) | Telugu Jyothisham (తెలుగు జ్యోతిషం) — తిథి: ${cleanTithi}, నక్షత్రం: ${cleanNakshatra}, గ్రహస్థితి & రాహుకాలం: ${day.ashubha.rahukalam}`;

  // Standardized WebApplication & FAQPage nodes for Rich Snippet eligibility
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

  const graphNodes: Record<string, unknown>[] = [
    webAppNode,
    faqPageNode,
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
      author: {
        '@type': 'Person',
        name: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ సిద్ధాంతి (Brahmasri Jallavaram Sai Dheeraj Sharma)',
        url: `${baseUrl}/about`,
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Telugu Jyothisham (తెలుగు జ్యోతిషం) — శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon-512x512.png`,
          width: 512,
          height: 512,
        },
      },
      image: [
        `${baseUrl}/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg`,
        `${baseUrl}/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg`,
        `${baseUrl}/favicon-512x512.png`,
      ],
      keywords: backendDailyKeywords,
      about: [
        { '@type': 'Thing', name: 'Neti Panchangam (నేటి పంచాంగం / Today Panchangam in Telugu)' },
        { '@type': 'Thing', name: 'Telugu Jyothisham (తెలుగు జ్యోతిషం)' },
        { '@type': 'Thing', name: 'Telugu Astrology & Telugu Horoscope (తెలుగు రాశి ఫలాలు)' },
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
