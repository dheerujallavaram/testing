import { DayData } from '../types/panchangam';

export type PanchangamSubTab = 'main' | 'gowri-hora' | 'tarabalam' | 'sankalpam';

/**
 * Automated Daily Panchangam & Jyothisham SEO Engine
 * Dynamically injects rich JSON-LD structured data (NewsArticle, Dataset, Event, FAQPage)
 * for the active day & route so Google Search, Google Discover, and AI Overviews
 * automatically index fresh daily Telugu Panchangam data every single day.
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

  const articleHeadline = `${day.teediVaram} తెలుగు పంచాంగం (Neti Panchangam) — తిథి: ${cleanTithi}, నక్షత్రం: ${cleanNakshatra}, రాహుకాలం: ${day.ashubha.rahukalam}`;

  const graphNodes: Record<string, unknown>[] = [
    {
      '@type': 'NewsArticle',
      '@id': `${fullUrl}#daily-panchangam-${day.id}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl,
      },
      headline: articleHeadline,
      alternativeHeadline: `Today Panchangam in Telugu (${day.teediVaram}) - Ee Roju Panchangam & Rashi Phalalu`,
      description: `${day.teediVaram} నాటి దృక్సిద్ధాంత తెలుగు పంచాంగం: ${day.panchanga.samvatsaram}, ${day.panchanga.masam}, తిథి: ${day.panchanga.tithi}, నక్షత్రం: ${day.panchanga.nakshatram}, యోగం: ${day.panchanga.yogam}, కరణం: ${day.panchanga.karanam}, రాహుకాలం: ${day.ashubha.rahukalam}, అమృత ఘడియలు: ${day.shubha.amrutha}.`,
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
        name: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (Telugu Jyothisham)',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon-512x512.png`,
          width: 512,
          height: 512,
        },
      },
      image: [`${baseUrl}/favicon-512x512.png`],
      about: [
        { '@type': 'Thing', name: 'Neti Panchangam (నేటి పంచాంగం)' },
        { '@type': 'Thing', name: 'Today Panchangam in Telugu (ఈ రోజు పంచాంగం)' },
        { '@type': 'Thing', name: `Tithi: ${cleanTithi}` },
        { '@type': 'Thing', name: `Nakshatram: ${cleanNakshatra}` },
      ],
    },
    {
      '@type': 'Dataset',
      '@id': `${fullUrl}#panchangam-dataset-${day.id}`,
      name: `${day.teediVaram} — దృక్సిద్ధాంత తెలుగు పంచాంగ గణనలు (Daily Telugu Almanac Dataset)`,
      description: `Complete astronomical and Vedic Panchangam parameters for ${day.teediVaram} (${day.isoDate}): Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, Yamagandam, Varjyam, Gowri Panchangam, Hora Chakram, and 12 Rashi Gochara positions.`,
      url: fullUrl,
      temporalCoverage: day.isoDate,
      inLanguage: ['te', 'en'],
      creator: {
        '@id': `${baseUrl}/#organization`,
      },
      variableMeasured: [
        `సంవత్సరం (Samvatsaram): ${day.panchanga.samvatsaram}`,
        `మాసం (Masam): ${day.panchanga.masam}`,
        `తిథి (Tithi): ${day.panchanga.tithi}`,
        `నక్షత్రం (Nakshatram): ${day.panchanga.nakshatram}`,
        `యోగం (Yogam): ${day.panchanga.yogam}`,
        `కరణం (Karanam): ${day.panchanga.karanam}`,
        `రాహుకాలం (Rahu Kalam): ${day.ashubha.rahukalam}`,
        `యమగండం (Yamagandam): ${day.ashubha.yamagandam}`,
        `వర్జ్యం (Varjyam): ${day.ashubha.varjyam}`,
        `అమృత ఘడియలు (Amrutha Gadiyalu): ${day.shubha.amrutha}`,
        `అభిజిత్ ముహూర్తం (Abhijit Muhurtham): ${day.shubha.abhijit}`,
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${fullUrl}#daily-faq-${day.id}`,
      mainEntity: [
        {
          '@type': 'Question',
          name: `ఈ రోజు తిథి ఏమిటి? (${day.teediVaram} - Today Tithi in Telugu)`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${day.teediVaram} నాడు ${day.panchanga.masam}, తిథి: ${day.panchanga.tithi}.`,
          },
        },
        {
          '@type': 'Question',
          name: `ఈ రోజు నక్షత్రం ఏమిటి? (${day.teediVaram} - Today Nakshatram in Telugu)`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${day.teediVaram} నాడు నక్షత్రం: ${day.panchanga.nakshatram}. ${day.chandra.navataraBalam}`,
          },
        },
        {
          '@type': 'Question',
          name: `ఈ రోజు రాహుకాలం, యమగండం మరియు వర్జ్యం సమయాలు ఏవి? (${day.teediVaram})`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${day.teediVaram} నాడు రాహుకాలం: ${day.ashubha.rahukalam}, యమగండం: ${day.ashubha.yamagandam}, వర్జ్యం: ${day.ashubha.varjyam}, దుర్ముహూర్తం: ${day.ashubha.durmuhurtham}.`,
          },
        },
        {
          '@type': 'Question',
          name: `ఈ రోజు అమృత ఘడియలు మరియు అభిజిత్ ముహూర్తం ఎప్పుడు? (${day.teediVaram})`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${day.teediVaram} నాడు అమృత ఘడియలు: ${day.shubha.amrutha}, అభిజిత్ ముహూర్తం: ${day.shubha.abhijit}.`,
          },
        },
        {
          '@type': 'Question',
          name: `ఈ రోజు చంద్రబలం మరియు చంద్రాష్టమం ఏ రాశుల వారికి ఉంది? (${day.teediVaram})`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${day.chandra.sancharam} ${day.chandra.chandrashtamam}`,
          },
        },
      ],
    },
  ];

  if (day.specialEvent) {
    graphNodes.push({
      '@type': 'Event',
      '@id': `${fullUrl}#festival-event-${day.id}`,
      name: `${day.specialEvent} — ${day.teediVaram}`,
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

  // Sub-tab specific WebApplication schema boost
  if (panchangamSubTab !== 'main') {
    const subTabMeta: Record<Exclude<PanchangamSubTab, 'main'>, { name: string; desc: string }> = {
      'gowri-hora': {
        name: `నేటి గౌరీ పంచాంగం & హోరా చక్రం (${day.teediVaram})`,
        desc: `${day.teediVaram} పగటి మరియు రాత్రి 8 గౌరీ పంచాంగ సమయాలు (అమృతం, లాభం, శుభం, ధనం, చరం) మరియు 24 గ్రహ హోరా చక్రం.`,
      },
      tarabalam: {
        name: `నేటి తారాబలం & చంద్రబలం క్యాలిక్యులేటర్ (${day.teediVaram})`,
        desc: `${day.teediVaram} (${cleanNakshatra}) నాడు 27 నక్షత్రాల వారికి నవతార తారాబలం మరియు 12 రాశుల వారికి చంద్రబలం గణన.`,
      },
      sankalpam: {
        name: `నేటి పూజా సంకల్పం & నిత్య స్తోత్రం (${day.teediVaram})`,
        desc: `${day.teediVaram} (${day.panchanga.samvatsaram}, ${day.panchanga.masam}, ${cleanTithi}, ${cleanNakshatra}) భారతదేశం మరియు NRI భక్తుల నిత్య పూజా సంకల్పం.`,
      },
    };
    const meta = subTabMeta[panchangamSubTab];
    if (meta) {
      graphNodes.push({
        '@type': 'SoftwareApplication',
        name: meta.name,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'All',
        description: meta.desc,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      });
    }
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
