import { DayData, PoojaService } from '../types/panchangam';
import { WEEK_DATA } from '../data/panchangamData';

export type EventCategory = 'festival' | 'yagnam' | 'homam' | 'abhishekam' | 'vratam' | 'muhurtham';

export interface DynamicCalendarEvent {
  id: string;
  source: 'calendar' | 'temple_ritual';
  category: EventCategory;
  categoryLabelTe: string;
  categoryLabelEn: string;
  titleTe: string;
  titleEn: string;
  targetDateISO: string; // ISO 8601 with local time for live ticking
  isoDate: string; // "YYYY-MM-DD"
  dateDisplayTe: string;
  dateDisplayEn: string;
  timeTe: string;
  timeEn: string;
  tithiTe?: string;
  nakshatraTe?: string;
  deityTe?: string;
  luckyColorTe?: string;
  muhurthamTe?: string;
  muhurthamEn?: string;
  descriptionTe: string;
  descriptionEn: string;
  benefitsTe: string[];
  benefitsEn: string[];
  ritualsTe?: string[];
  ritualsEn?: string[];
  venueTe?: string;
  venueEn?: string;
  priestNoteTe?: string;
  priestNoteEn?: string;
  poojaServiceMatch?: Partial<PoojaService>;
}

// Scheduled Grand Temple Fire Ceremonies & Yagnams conducted at the Kshetram
const TEMPLE_GRAND_RITUALS: DynamicCalendarEvent[] = [
  {
    id: 'chandi-rudra-maha-yagnam-2026',
    source: 'temple_ritual',
    category: 'yagnam',
    categoryLabelTe: 'వైదిక మహాయజ్ఞం',
    categoryLabelEn: 'Vedic Maha Yagnam',
    titleTe: 'శ్రీ మహా చండీ సహిత అతిరుద్ర మహాయజ్ఞం',
    titleEn: 'Sri Maha Chandi Sahitha Atirudra Maha Yagnam',
    targetDateISO: '2026-11-15T07:30:00+05:30',
    isoDate: '2026-11-15',
    dateDisplayTe: '15 నవంబర్ 2026 (కార్తీక సోమవారం)',
    dateDisplayEn: 'November 15, 2026 (Kartika Somavaram)',
    timeTe: 'ఉదయం 07:30 AM నుండి మధ్యాహ్నం 01:30 PM వరకు',
    timeEn: '07:30 AM to 01:30 PM IST',
    tithiTe: 'కార్తీక శుద్ధ షష్ఠి',
    nakshatraTe: 'శ్రవణం నక్షత్రం',
    deityTe: 'శ్రీ చండీ పరమేశ్వరి, పరమశివుడు (రుద్రుడు)',
    muhurthamTe: 'కుమార షష్ఠి & అభిజిత్ ముహూర్తం (ఉదయం 11:35 AM)',
    muhurthamEn: 'Kumara Shashthi & Abhijit Muhurtham (11:35 AM IST)',
    venueTe: 'శ్రీలక్ష్మి గణపతి వైదిక క్షేత్రం, తిరుపతి (Live Webcast for Global Devotees)',
    venueEn: 'Sreelakshmi Ganapathi Vedic Kshetram, Tirupati (Global Live Webcast)',
    descriptionTe: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో 11 మంది స్మార్త వేద పండితులచే సంపూర్ణ చండీ సప్తశతి పారాయణం, మహన్యాసపూర్వక ఏకాదశ రుద్రాభిషేకం మరియు మహా పూర్ణాహుతి శాస్త్రోక్తంగా నిర్వహించబడును.',
    descriptionEn: 'Conducted under the personal auspices of Sri Jallavaram Sai Dheeraj Sharma with 11 Vedic scholars. Features complete Chandi Saptashati parayanam, Ekadasa Rudrabhishekam with Mahanyasam, and Maha Purnahuti.',
    benefitsTe: [
      'సకల గ్రహ దోష నివారణ & అష్టమ శని, ఏలినాటి శని ఉపశమనం',
      'శత్రుపీడా నివారణ & సమస్త ఋణ విముక్తి',
      'కుటుంబంలో దీర్ఘకాలిక శాంతి, ఆయురారోగ్య ఐశ్వర్య సిద్ధి',
      'వ్యాపార, ఉద్యోగ రంగాలలో ఆకస్మిక రాజయోగ ప్రాప్తి'
    ],
    benefitsEn: [
      'Alleviation of severe planetary doshas, Sade Sati & Ashtama Shani',
      'Neutralization of negative energies, hidden rivals, and financial debts',
      'Lasting peace, health, harmony, and prosperity for the entire family',
      'Breakthrough success and auspicious Rajayoga in business and career'
    ],
    ritualsTe: [
      'గణపతి పూజ & పుణ్యాహవాచనం',
      'మహన్యాసపూర్వక ఏకాదశ రుద్రాభిషేకం',
      'శ్రీ చండీ నవాక్షరీ మూలమంత్ర జపం & సప్తశతి హోమం',
      'సువాసినీ పూజ, కన్యా పూజ & మహా పూర్ణాహుతి'
    ],
    ritualsEn: [
      'Ganapathi Pooja & Sacred Punyahavachanam',
      'Mahanyasa-purvaka Ekadasa Rudrabhishekam',
      'Sri Chandi Navakshari Moola Mantra Japa & Saptashati Homam',
      'Suvasini Pooja, Kanya Pooja & Sacred Maha Purnahuti'
    ],
    priestNoteTe: 'శ్రీ ధీరజ్ శర్మ గారు స్వయంగా ప్రతి భక్తుని గోత్ర నామాలతో ప్రత్యక్ష సంకల్పం చేయుదురు. లైవ్ లింక్ మరియు సంకల్ప వీడియో పంపబడును.',
    priestNoteEn: 'Sri Dheeraj Sharma personally chants each devotee family’s Gotranamalu. Private Live webcast provided.',
    poojaServiceMatch: {
      id: 'chandi-homam',
      name: 'Maha Chandi Homam',
      teluguName: 'శ్రీ మహా చండీ సహిత అతిరుద్ర మహాయజ్ఞం'
    }
  },
  {
    id: 'kartika-deepotsavam-rudrabhishekam-2026',
    source: 'temple_ritual',
    category: 'abhishekam',
    categoryLabelTe: 'కార్తీక పూర్ణిమ దీపోత్సవం',
    categoryLabelEn: 'Kartika Pournami Deepotsavam',
    titleTe: 'కార్తీక పూర్ణిమ జ్వాలా తోరణం & కోటి దీపోత్సవం',
    titleEn: 'Kartika Pournami Jwala Toranam & Koti Deepotsavam',
    targetDateISO: '2026-11-24T18:00:00+05:30',
    isoDate: '2026-11-24',
    dateDisplayTe: '24 నవంబర్ 2026 (కార్తీక పౌర్ణమి)',
    dateDisplayEn: 'November 24, 2026 (Kartika Pournami)',
    timeTe: 'సాయంత్రం 06:00 PM నుండి రాత్రి 09:30 PM వరకు',
    timeEn: '06:00 PM to 09:30 PM IST',
    tithiTe: 'కార్తీక పౌర్ణమి (శివకేశవ ప్రీతికరం)',
    nakshatraTe: 'కృత్తిక నక్షత్రం',
    deityTe: 'పరమశివుడు (జ్వాలా లింగేశ్వరుడు), శ్రీమన్నారాయణుడు',
    muhurthamTe: 'ప్రదోష కాలం & జ్వాలా తోరణ ముహూర్తం (సాయంత్రం 06:15 PM)',
    muhurthamEn: 'Pradosha Sandhya & Jwala Toranam (06:15 PM IST)',
    venueTe: 'శ్రీలక్ష్మి గణపతి క్షేత్రం, తిరుపతి (Live Streamed to Devotees)',
    venueEn: 'Sreelakshmi Ganapathi Kshetram, Tirupati (Live Streamed)',
    descriptionTe: 'సంవత్సరంలో అత్యంత మహిమాన్వితమైన కార్తీక పౌర్ణమి నాడు శివానుగ్రహం కొరకు విశేష రుద్రాభిషేకం, జ్వాలా తోరణ దర్శనం మరియు కోటి దీపారాధన సంకల్పం.',
    descriptionEn: 'Special Ekadasa Rudrabhishekam, holy Jwala Toranam crossing, and Koti Deepam illumination on the spiritually charged night of Kartika Pournami.',
    benefitsTe: [
      'సంతాన లేమి, వివాహ విలంబ దోషాల పరిహారం',
      'పితృ శాప నివారణ & వంశాభివృద్ధి',
      'ఆత్మశాంతి, మానసిక ఒత్తిడి నివారణ & మోక్ష ప్రాప్తి'
    ],
    benefitsEn: [
      'Relief from ancestral afflictions (Pitri Dosha) and marriage delays',
      'Blessings of healthy progeny and family lineage growth',
      'Inner tranquility, relief from chronic stress, and spiritual bliss'
    ],
    ritualsTe: [
      'పంచామృత క్షీరాభిషేకం & బిల్వార్చన',
      'జ్వాలా తోరణ ప్రవేశం & కార్తీక మహా దీపారాధన',
      'గోత్ర నామాలతో 365 వత్తుల దీపారాధన సంకల్పం'
    ],
    ritualsEn: [
      'Panchamrita Abhishekam & Bilva Archana',
      'Jwala Toranam entry & Kartika Maha Deepotsavam',
      '365-wick Deepam sankalpam in devotee Gotranamalu'
    ],
    priestNoteTe: 'భక్తుల తరపున కార్తీక పౌర్ణమి దీపాలు వెలిగించి, విభూతి & కుంకుమ ప్రసాదం కొరియర్ ద్వారా పంపబడును.',
    priestNoteEn: 'Ghee lamps will be personally lit in the names of registered families with sacred prasadam dispatched.',
    poojaServiceMatch: {
      id: 'rudrabhishekam',
      name: 'Kartika Rudrabhishekam & Deepotsavam',
      teluguName: 'కార్తీక పూర్ణిమ జ్వాలా తోరణం & కోటి దీపోత్సవం'
    }
  },
  {
    id: 'lakshmi-kubera-dhana-prapti-2026',
    source: 'temple_ritual',
    category: 'homam',
    categoryLabelTe: 'ధన ప్రాప్తి మహాయాగం',
    categoryLabelEn: 'Wealth & Prosperity Maha Yagam',
    titleTe: 'శ్రీ లక్ష్మీ కుబేర ధన ప్రాప్తి మహాయాగం',
    titleEn: 'Sri Lakshmi Kubera Dhana Prapti Maha Yagam',
    targetDateISO: '2026-11-27T08:30:00+05:30',
    isoDate: '2026-11-27',
    dateDisplayTe: '27 నవంబర్ 2026 (మార్గశిర శుక్ల గురువారం)',
    dateDisplayEn: 'November 27, 2026 (Margashira Shukla Guruvaram)',
    timeTe: 'ఉదయం 08:30 AM నుండి 12:30 PM వరకు',
    timeEn: '08:30 AM to 12:30 PM IST',
    tithiTe: 'తదియ / చతుర్థి శుభ తిథి',
    nakshatraTe: 'పునర్వసు నక్షత్రం',
    deityTe: 'శ్రీ మహాలక్ష్మి దేవి, శ్రీ కుబేర స్వామి',
    muhurthamTe: 'కనకధార యోగం & ధన ముహూర్తం (ఉదయం 09:15 AM)',
    muhurthamEn: 'Kanakadhara Yoga Auspicious Hour (09:15 AM IST)',
    venueTe: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం యాగశాల, తిరుపతి',
    venueEn: 'Sreelakshmi Ganapathi Yagashala, Tirupati (Global Live Stream)',
    descriptionTe: 'ఆర్థిక ఇబ్బందుల నుండి విముక్తి, వ్యాపార విస్తరణ మరియు స్థిర లక్ష్మీ కటాక్షం కోసం నిర్వహించబడే పరమ పవిత్రమైన కుబేర పాశుపత లక్ష్మీ యజ్ఞం.',
    descriptionEn: 'Vedic rite invoking Goddess Mahalakshmi and Lord Kubera for elimination of financial blockages, steady prosperity, and sustainable wealth.',
    benefitsTe: [
      'దీర్ఘకాలిక వ్యాపార నష్టాల నివారణ & క్రయవిక్రయ లాభం',
      'గృహ ప్రాప్తి, స్థిరాస్తి కొనుగోలులో ఆటంకాలు తొలగింపు',
      'కుబేర యంత్ర సిద్ధి & అఖండ సంపద వృద్ధి'
    ],
    benefitsEn: [
      'Elimination of persistent business losses and commercial roadblocks',
      'Removes obstacles in acquiring property, homes, and land assets',
      'Consecration of energized Kubera Yantram for perpetual abundance'
    ],
    ritualsTe: [
      'కనకధార స్తోత్ర పారాయణం & 1008 అష్టోత్తర అర్చన',
      'శ్రీసూక్త విధాతృ హోమం & పాయసాన్న ఆహుతులు',
      'కుబేర మంత్ర సంపుటిక హోమం & స్వర్ణ పుష్పార్చన'
    ],
    ritualsEn: [
      'Kanakadhara Stotra Parayanam & Ashtottara Archana',
      'Sri Sukta Vidhatru Homam with sacred offerings',
      'Kubera Mantra Samputika Homam & Consecration'
    ],
    priestNoteTe: 'ఈ యాగంలో పాల్గొనే భక్తులకు పూజించిన కుబేర నాణెం మరియు లక్ష్మీ రక్షా యంత్రం పంపబడును.',
    priestNoteEn: 'Sanctified Kubera coin and Lakshmi Raksha Yantram will be delivered to registered families.',
    poojaServiceMatch: {
      id: 'ganapathi-homam',
      name: 'Lakshmi Kubera Maha Yagam',
      teluguName: 'శ్రీ లక్ష్మీ కుబేర ధన ప్రాప్తి మహాయాగం'
    }
  }
];

// Helper to derive English name for a festival
function getEnglishFestivalTitle(teTitle: string): string {
  if (teTitle.includes('సంకష్టహర చతుర్థి')) return 'Sankashtahara Chaturthi (Ganesh Fasting)';
  if (teTitle.includes('భాను సప్తమి')) return 'Bhanu Saptami (Surya Jayanti Observance)';
  if (teTitle.includes('పాపాంకుశ ఏకాదశి')) return 'Papankusha Ekadashi Vratam';
  if (teTitle.includes('ఆశ్వయుజ పౌర్ణమి')) return 'Ashwayuja Pournami (Sharad Purnima)';
  if (teTitle.includes('రమా ఏకాదశి')) return 'Rama Ekadashi Vratam';
  if (teTitle.includes('ధంతేరాస్') || teTitle.includes('ధన త్రయోదశి')) return 'Dhanteras / Dhana Trayodashi';
  if (teTitle.includes('దీపావళి')) return 'Diwali (Maha Lakshmi Pooja)';
  if (teTitle.includes('కార్తీక పౌర్ణమి')) return 'Kartika Pournami & Jwala Toranam';
  if (teTitle.includes('వైకుంఠ')) return 'Vaikunta Ekadashi & Gita Jayanti';
  if (teTitle.includes('దత్తాత్రేయ')) return 'Sri Dattatreya Jayanti';
  if (teTitle.includes('సంక్రాంతి')) return 'Makara Sankranti / Pongal';
  if (teTitle.includes('మహా శివరాత్రి')) return 'Maha Shivaratri Mahotsavam';
  if (teTitle.includes('ఉగాది')) return 'Telugu Ugadi Festival (New Year)';
  if (teTitle.includes('శ్రీ రామ నవమి')) return 'Sri Rama Navami Kalyanotsavam';
  if (teTitle.includes('హనుమాన్')) return 'Sri Hanuman Jayanti';
  if (teTitle.includes('ఏకాదశి')) return 'Sacred Ekadashi Fasting Day';
  if (teTitle.includes('పౌర్ణమి')) return 'Sacred Pournami (Satyanarayana Vratham)';
  if (teTitle.includes('అమావాస్య')) return 'Sacred Amavasya (Ancestral Offerings)';
  return teTitle;
}

// Convert a calendar DayData item into a DynamicCalendarEvent
function createEventFromDayData(day: DayData, customTitle?: string): DynamicCalendarEvent {
  const titleTe = customTitle || day.specialEvent || `${day.panchanga.masam} విశేష పర్వదినం`;
  const titleEn = getEnglishFestivalTitle(titleTe);

  // Extract clean tithi & nakshatra
  const cleanTithi = day.panchanga.tithi ? day.panchanga.tithi.split('-')[0].trim() : '';
  const cleanNak = day.panchanga.nakshatram ? day.panchanga.nakshatram.split('-')[0].trim() : '';

  // Extract best muhurtham time
  const muhurtham = day.shubha.abhijit && !day.shubha.abhijit.includes('లేదు')
    ? day.shubha.abhijit
    : day.shubha.amrutha && !day.shubha.amrutha.includes('లేదు')
    ? day.shubha.amrutha
    : 'ఉదయం 06:30 AM నుండి ఉదయం 10:30 AM వరకు';

  // Construct target ISO for countdown (default 06:00:00 AM on that date in IST)
  const targetDateISO = `${day.isoDate}T06:00:00+05:30`;

  let category: EventCategory = 'festival';
  if (titleTe.includes('వ్రతం') || titleTe.includes('ఏకాదశి') || titleTe.includes('చతుర్థి')) {
    category = 'vratam';
  } else if (titleTe.includes('హోమం') || titleTe.includes('యజ్ఞం')) {
    category = 'homam';
  } else if (titleTe.includes('అభిషేకం')) {
    category = 'abhishekam';
  }

  const categoryLabels: Record<EventCategory, { te: string; en: string }> = {
    festival: { te: 'పంచాంగ పర్వదినం', en: 'Panchangam Festival' },
    vratam: { te: 'శుభ వ్రతం & ఉపవాసం', en: 'Sacred Vratam & Fasting' },
    homam: { te: 'వైదిక హోమం', en: 'Vedic Homam' },
    yagnam: { te: 'మహా యజ్ఞం', en: 'Maha Yagnam' },
    abhishekam: { te: 'దివ్య అభిషేకం', en: 'Divine Abhishekam' },
    muhurtham: { te: 'శుభ ముహూర్తం', en: 'Auspicious Muhurtham' },
  };

  return {
    id: `cal-evt-${day.isoDate}`,
    source: 'calendar',
    category,
    categoryLabelTe: categoryLabels[category].te,
    categoryLabelEn: categoryLabels[category].en,
    titleTe,
    titleEn,
    targetDateISO,
    isoDate: day.isoDate,
    dateDisplayTe: day.teediVaram,
    dateDisplayEn: `${day.dateNum} ${day.monthName || 'Month'} (${day.label})`,
    timeTe: `శుభ ముహూర్తం: ${muhurtham}`,
    timeEn: `Auspicious Timings: ${muhurtham}`,
    tithiTe: cleanTithi,
    nakshatraTe: cleanNak,
    deityTe: day.deity,
    luckyColorTe: day.luckyColor,
    muhurthamTe: muhurtham,
    muhurthamEn: muhurtham,
    descriptionTe: day.phalitham || `ఈ పవిత్ర దినాన ${day.deity} ఆరాధన చేయడం మరియు ఉపవాస నియమాలు పాటించడం వల్ల సకల దోషాలు తొలగి, సర్వకార్య సిద్ధి కలుగుతుంది.`,
    descriptionEn: `On this sacred day, propitiation of ${day.deity} grants spiritual purification, eliminates karmic obstacles, and bestows peace and auspicious blessings.`,
    benefitsTe: [
      `${day.deity} విశేష అనుగ్రహ ప్రాప్తి`,
      'గ్రహ దోష నివారణ & మనశ్శాంతి',
      'కుటుంబంలో శుభ కార్యాల నిర్వహణకు అనుకూల బలం',
      'వృత్తి వ్యాపారాలలో ఆటంకాలు తొలగింపు'
    ],
    benefitsEn: [
      `Divine blessings from ${day.deity}`,
      'Neutralization of adverse planetary transits and peace of mind',
      'Harmonious conditions for sacred family milestones',
      'Removal of career and business roadblocks'
    ],
    venueTe: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం & స్వగృహం (ఆన్‌లైన్ సంకల్పం)',
    venueEn: 'Sreelakshmi Ganapathi Jyothishalayam & Devotee Home',
    priestNoteTe: 'ఈ పర్వదినాన మీ కుటుంబ గోత్ర నామాలతో అర్చన లేదా సంకల్పం కొరకు శ్రీ సాయి ధీరజ్ శర్మ గారిని సంప్రదించండి.',
    priestNoteEn: 'Consult Sri Sai Dheeraj Sharma to conduct personal Sankalpam and archana in your family gotranamalu.',
    poojaServiceMatch: {
      id: category === 'abhishekam' ? 'rudrabhishekam' : category === 'homam' ? 'ganapathi-homam' : 'satyanarayana-vratham',
      name: titleEn,
      teluguName: titleTe,
    }
  };
}

/**
 * Dynamically extract and sort all upcoming festivals and temple rituals from the calendar dataset
 * @param days Calendar dataset (defaults to WEEK_DATA)
 * @param referenceDate Optional current reference date (defaults to today)
 * @param maxCount Maximum number of upcoming events to return (default 8)
 */
export function getUpcomingCalendarEvents(
  days: DayData[] = WEEK_DATA,
  referenceDate: Date = new Date(),
  maxCount: number = 8
): {
  events: DynamicCalendarEvent[];
  nextUpcoming: DynamicCalendarEvent | null;
  todayEvent: DynamicCalendarEvent | null;
} {
  // Compute YYYY-MM-DD for today in local time
  const y = referenceDate.getFullYear();
  const m = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const d = String(referenceDate.getDate()).padStart(2, '0');
  const todayIso = `${y}-${m}-${d}`;

  const extractedList: DynamicCalendarEvent[] = [];
  const visitedDates = new Set<string>();

  // 1. Scan calendar dataset for days >= todayIso with special events or major tithis
  for (const day of days) {
    if (day.isoDate < todayIso) continue;

    // Has explicit specialEvent (e.g. "సంకష్టహర చతుర్థి వ్రతం", "భాను సప్తమి", "వైకుంఠ ఏకాదశి")
    if (day.specialEvent && !visitedDates.has(day.isoDate)) {
      extractedList.push(createEventFromDayData(day, day.specialEvent));
      visitedDates.add(day.isoDate);
      continue;
    }

    // Detect major tithis if no explicit specialEvent
    const tithi = day.panchanga?.tithi || '';
    if (tithi.includes('ఏకాదశి') && !visitedDates.has(day.isoDate)) {
      extractedList.push(createEventFromDayData(day, `${day.panchanga.masam || 'మాస'} ఏకాదశి వ్రతం`));
      visitedDates.add(day.isoDate);
    } else if (tithi.includes('పౌర్ణమి') && !visitedDates.has(day.isoDate)) {
      extractedList.push(createEventFromDayData(day, `${day.panchanga.masam || 'మాస'} పౌర్ణమి సత్యనారాయణ వ్రతం`));
      visitedDates.add(day.isoDate);
    } else if (tithi.includes('అమావాస్య') && !visitedDates.has(day.isoDate)) {
      extractedList.push(createEventFromDayData(day, `${day.panchanga.masam || 'మాస'} అమావాస్య పితృ తర్పణ దినం`));
      visitedDates.add(day.isoDate);
    }
  }

  // 2. Merge temple grand rituals that are >= todayIso
  for (const ritual of TEMPLE_GRAND_RITUALS) {
    if (ritual.isoDate >= todayIso) {
      extractedList.push(ritual);
    }
  }

  // 3. Sort chronologically by targetDateISO ascending
  extractedList.sort((a, b) => {
    return new Date(a.targetDateISO).getTime() - new Date(b.targetDateISO).getTime();
  });

  // Limit to maxCount
  const trimmed = extractedList.slice(0, maxCount);

  // Identify if any event is happening today
  const todayEvent = trimmed.find((e) => e.isoDate === todayIso) || null;

  // The next immediate upcoming event (if todayEvent is currently active, it's either today's or the very next one)
  const nextUpcoming = trimmed[0] || null;

  return {
    events: trimmed,
    nextUpcoming,
    todayEvent,
  };
}
