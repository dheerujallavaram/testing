import { DayData } from '../types/panchangam';

export interface DailyJHoraYogiPakshiReport {
  yogiSphutaDeg: string;
  yogiNakshatraTe: string;
  yogiNakshatraEn: string;
  yogiPlanetTe: string;
  yogiPlanetEn: string;
  sahayogiPlanetTe: string;
  sahayogiPlanetEn: string;
  avayogiNakshatraTe: string;
  avayogiNakshatraEn: string;
  avayogiPlanetTe: string;
  avayogiPlanetEn: string;
  yogiGuidanceTe: string;
  yogiGuidanceEn: string;
  rulingPakshiTe: string;
  rulingPakshiEn: string;
  pakshiPalanaWindowTe: string;
  pakshiPalanaWindowEn: string;
  pakshiBhojanaWindowTe: string;
  pakshiBhojanaWindowEn: string;
}

export interface JaiminiCharaKarakaItem {
  karakaCode: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK';
  karakaTitleTe: string;
  karakaTitleEn: string;
  planetTe: string;
  planetEn: string;
  rashiTe: string;
  rashiEn: string;
  degreeInSign: string;
  significanceTe: string;
  significanceEn: string;
}

export interface KundaliJHoraMasterReport {
  charaKarakas: JaiminiCharaKarakaItem[];
  arudhaLagna: {
    rashiTe: string;
    rashiEn: string;
    houseFromLagna: number;
    meaningTe: string;
    meaningEn: string;
  };
  upapadaLagna: {
    rashiTe: string;
    rashiEn: string;
    houseFromLagna: number;
    meaningTe: string;
    meaningEn: string;
  };
  induLagna: {
    rashiTe: string;
    rashiEn: string;
    totalKalas: number;
    houseFromLagna: number;
    meaningTe: string;
    meaningEn: string;
  };
  bhriguBindu: {
    rashiTe: string;
    rashiEn: string;
    degreeFormatted: string;
    houseFromLagna: number;
    meaningTe: string;
    meaningEn: string;
  };
  natalYogiProfile: {
    yogiNakshatraTe: string;
    yogiNakshatraEn: string;
    yogiPlanetTe: string;
    yogiPlanetEn: string;
    sahayogiPlanetTe: string;
    sahayogiPlanetEn: string;
    avayogiPlanetTe: string;
    avayogiPlanetEn: string;
    meaningTe: string;
    meaningEn: string;
  };
  santanaAndAyurSphutas: {
    beejaSphutaRashiTe: string;
    beejaSphutaRashiEn: string;
    kshetraSphutaRashiTe: string;
    kshetraSphutaRashiEn: string;
    trisphutaRashiTe: string;
    trisphutaRashiEn: string;
    santanaMeaningTe: string;
    santanaMeaningEn: string;
  };
}

const NAKSHATRA_27_LIST: { te: string; en: string; lordTe: string; lordEn: string }[] = [
  { te: 'అశ్విని', en: 'Ashwini', lordTe: 'కేతువు', lordEn: 'Ketu' },
  { te: 'భరణి', en: 'Bharani', lordTe: 'శుక్రుడు', lordEn: 'Venus (Shukra)' },
  { te: 'కృత్తిక', en: 'Krittika', lordTe: 'సూర్యుడు', lordEn: 'Sun (Surya)' },
  { te: 'రోహిణి', en: 'Rohini', lordTe: 'చంద్రుడు', lordEn: 'Moon (Chandra)' },
  { te: 'మృగశిర', en: 'Mrigashira', lordTe: 'కుజుడు', lordEn: 'Mars (Kuja)' },
  { te: 'ఆర్ద్ర', en: 'Ardra', lordTe: 'రాహువు', lordEn: 'Rahu' },
  { te: 'పునర్వసు', en: 'Punarvasu', lordTe: 'గురుడు', lordEn: 'Jupiter (Guru)' },
  { te: 'పుష్యమి', en: 'Pushyami', lordTe: 'శని', lordEn: 'Saturn (Shani)' },
  { te: 'ఆశ్లేష', en: 'Ashlesha', lordTe: 'బుధుడు', lordEn: 'Mercury (Budha)' },
  { te: 'మఖ', en: 'Magha', lordTe: 'కేతువు', lordEn: 'Ketu' },
  { te: 'పుబ్బ', en: 'Purva Phalguni', lordTe: 'శుక్రుడు', lordEn: 'Venus (Shukra)' },
  { te: 'ఉత్తర', en: 'Uttara Phalguni', lordTe: 'సూర్యుడు', lordEn: 'Sun (Surya)' },
  { te: 'హస్త', en: 'Hasta', lordTe: 'చంద్రుడు', lordEn: 'Moon (Chandra)' },
  { te: 'చిత్త', en: 'Chitta', lordTe: 'కుజుడు', lordEn: 'Mars (Kuja)' },
  { te: 'స్వాతి', en: 'Swati', lordTe: 'రాహువు', lordEn: 'Rahu' },
  { te: 'విశాఖ', en: 'Vishakha', lordTe: 'గురుడు', lordEn: 'Jupiter (Guru)' },
  { te: 'అనూరాధ', en: 'Anuradha', lordTe: 'శని', lordEn: 'Saturn (Shani)' },
  { te: 'జ్యేష్ఠ', en: 'Jyeshtha', lordTe: 'బుధుడు', lordEn: 'Mercury (Budha)' },
  { te: 'మూల', en: 'Mula', lordTe: 'కేతువు', lordEn: 'Ketu' },
  { te: 'పూర్వాషాఢ', en: 'Purvashadha', lordTe: 'శుక్రుడు', lordEn: 'Venus (Shukra)' },
  { te: 'ఉత్తరాషాఢ', en: 'Uttarashadha', lordTe: 'సూర్యుడు', lordEn: 'Sun (Surya)' },
  { te: 'శ్రవణం', en: 'Shravana', lordTe: 'చంద్రుడు', lordEn: 'Moon (Chandra)' },
  { te: 'ధనిష్ఠ', en: 'Dhanishta', lordTe: 'కుజుడు', lordEn: 'Mars (Kuja)' },
  { te: 'శతభిషం', en: 'Shatabhisha', lordTe: 'రాహువు', lordEn: 'Rahu' },
  { te: 'పూర్వాభాద్ర', en: 'Purvabhadra', lordTe: 'గురుడు', lordEn: 'Jupiter (Guru)' },
  { te: 'ఉత్తరాభాద్ర', en: 'Uttarabhadra', lordTe: 'శని', lordEn: 'Saturn (Shani)' },
  { te: 'రేవతి', en: 'Revati', lordTe: 'బుధుడు', lordEn: 'Mercury (Budha)' },
];

const RASHI_12_META: {
  id: string;
  te: string;
  en: string;
  lordId: string;
  lordTe: string;
  lordEn: string;
  induKalas: number;
}[] = [
  { id: 'mesham', te: 'మేషం', en: 'Aries (Mesha)', lordId: 'mars', lordTe: 'కుజుడు', lordEn: 'Mars (Kuja)', induKalas: 6 },
  { id: 'vrushabham', te: 'వృషభం', en: 'Taurus (Vrushabha)', lordId: 'venus', lordTe: 'శుక్రుడు', lordEn: 'Venus (Shukra)', induKalas: 12 },
  { id: 'mithunam', te: 'మిథునం', en: 'Gemini (Mithuna)', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury (Budha)', induKalas: 8 },
  { id: 'karkatakam', te: 'కర్కాటకం', en: 'Cancer (Karkataka)', lordId: 'moon', lordTe: 'చంద్రుడు', lordEn: 'Moon (Chandra)', induKalas: 16 },
  { id: 'simham', te: 'సింహం', en: 'Leo (Simha)', lordId: 'sun', lordTe: 'సూర్యుడు', lordEn: 'Sun (Surya)', induKalas: 30 },
  { id: 'kanya', te: 'కన్య', en: 'Virgo (Kanya)', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury (Budha)', induKalas: 8 },
  { id: 'tula', te: 'తుల', en: 'Libra (Tula)', lordId: 'venus', lordTe: 'శుక్రుడు', lordEn: 'Venus (Shukra)', induKalas: 12 },
  { id: 'vruschikam', te: 'వృశ్చికం', en: 'Scorpio (Vruschika)', lordId: 'mars', lordTe: 'కుజుడు', lordEn: 'Mars (Kuja)', induKalas: 6 },
  { id: 'dhanussu', te: 'ధనుస్సు', en: 'Sagittarius (Dhanussu)', lordId: 'jupiter', lordTe: 'గురుడు', lordEn: 'Jupiter (Guru)', induKalas: 10 },
  { id: 'makaram', te: 'మకరం', en: 'Capricorn (Makara)', lordId: 'saturn', lordTe: 'శని', lordEn: 'Saturn (Shani)', induKalas: 1 },
  { id: 'kumbham', te: 'కుంభం', en: 'Aquarius (Kumbha)', lordId: 'saturn', lordTe: 'శని', lordEn: 'Saturn (Shani)', induKalas: 1 },
  { id: 'meenam', te: 'మీనం', en: 'Pisces (Meena)', lordId: 'jupiter', lordTe: 'గురుడు', lordEn: 'Jupiter (Guru)', induKalas: 10 },
];

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Computes PyJHora's Daily Yogi–Sahayogi–Avayogi Planet & Pancha Pakshi Ruling Bird
 */
export function computeDailyJHoraYogiAndPakshi(day: DayData): DailyJHoraYogiPakshiReport {
  // Determine Sun & Moon approximate sidereal longitudes from day's grahaStithi & nakshatram
  let sunRashiIdx = 6;
  let moonRashiIdx = 0;

  for (let i = 0; i < RASHI_12_META.length; i++) {
    const rId = RASHI_12_META[i].id;
    const pStr = day.grahaStithi?.[rId] || '';
    if (pStr.includes('సూర్యుడు')) sunRashiIdx = i;
    if (pStr.includes('చంద్రుడు')) moonRashiIdx = i;
  }

  let nakIdx = NAKSHATRA_27_LIST.findIndex((n) => (day.panchanga?.nakshatram || '').includes(n.te));
  if (nakIdx < 0) nakIdx = Math.floor((moonRashiIdx * 30) / (360 / 27)) % 27;

  const dayOfMonth = parseInt((day.isoDate || '2026-11-11').split('-')[2] || '11', 10) || 11;
  const sunLon = sunRashiIdx * 30 + ((dayOfMonth + 14) % 30);
  const moonLon = nakIdx * (360 / 27) + 6.66;

  // PyJHora sphuta.py formula: Yogi Sphuta = (Sun + Moon + 93°20') % 360
  const yogiSphuta = norm360(sunLon + moonLon + 93 + 20 / 60);
  const yogiNakIdx = Math.floor(yogiSphuta / (360 / 27)) % 27;
  const yogiRashiIdx = Math.floor(yogiSphuta / 30) % 12;

  // Avayogi Sphuta = (Yogi Sphuta + 186°40') % 360
  const avayogiSphuta = norm360(yogiSphuta + 186 + 40 / 60);
  const avayogiNakIdx = Math.floor(avayogiSphuta / (360 / 27)) % 27;

  const yogiNak = NAKSHATRA_27_LIST[yogiNakIdx] || NAKSHATRA_27_LIST[0];
  const sahayogiRashi = RASHI_12_META[yogiRashiIdx] || RASHI_12_META[0];
  const avayogiNak = NAKSHATRA_27_LIST[avayogiNakIdx] || NAKSHATRA_27_LIST[14];

  // Pancha Pakshi Shastra Ruling Bird of the Day (based on Paksha & Weekday)
  const isKrishnaPaksha = (day.panchanga?.masam || '').includes('బహుళ') || (day.panchanga?.masam || '').includes('కృష్ణ');
  const dow = new Date(`${day.isoDate || '2026-11-11'}T06:00:00Z`).getUTCDay();

  const pakshiByDowShukla: { te: string; en: string; palanaTe: string; palanaEn: string; bhojanaTe: string; bhojanaEn: string }[] = [
    { te: 'భేరుండ / డేగ (Vulture/Hawk)', en: 'Hawk (Bherunda)', palanaTe: '08:24 AM – 10:48 AM', palanaEn: '08:24 AM – 10:48 AM', bhojanaTe: '06:00 AM – 08:24 AM', bhojanaEn: '06:00 AM – 08:24 AM' },
    { te: 'గుడ్లగూబ (Owl)', en: 'Owl (Uluka)', palanaTe: '10:48 AM – 01:12 PM', palanaEn: '10:48 AM – 01:12 PM', bhojanaTe: '08:24 AM – 10:48 AM', bhojanaEn: '08:24 AM – 10:48 AM' },
    { te: 'భేరుండ / డేగ (Vulture/Hawk)', en: 'Hawk (Bherunda)', palanaTe: '08:24 AM – 10:48 AM', palanaEn: '08:24 AM – 10:48 AM', bhojanaTe: '06:00 AM – 08:24 AM', bhojanaEn: '06:00 AM – 08:24 AM' },
    { te: 'గుడ్లగూబ (Owl)', en: 'Owl (Uluka)', palanaTe: '10:48 AM – 01:12 PM', palanaEn: '10:48 AM – 01:12 PM', bhojanaTe: '08:24 AM – 10:48 AM', bhojanaEn: '08:24 AM – 10:48 AM' },
    { te: 'కాకి (Crow)', en: 'Crow (Kaka)', palanaTe: '01:12 PM – 03:36 PM', palanaEn: '01:12 PM – 03:36 PM', bhojanaTe: '10:48 AM – 01:12 PM', bhojanaEn: '10:48 AM – 01:12 PM' },
    { te: 'కోడి (Cock)', en: 'Cock (Kukkuta)', palanaTe: '03:36 PM – 06:00 PM', palanaEn: '03:36 PM – 06:00 PM', bhojanaTe: '01:12 PM – 03:36 PM', bhojanaEn: '01:12 PM – 03:36 PM' },
    { te: 'నెమలి (Peacock)', en: 'Peacock (Mayura)', palanaTe: '06:00 AM – 08:24 AM', palanaEn: '06:00 AM – 08:24 AM', bhojanaTe: '03:36 PM – 06:00 PM', bhojanaEn: '03:36 PM – 06:00 PM' },
  ];

  const pakshiByDowKrishna: { te: string; en: string; palanaTe: string; palanaEn: string; bhojanaTe: string; bhojanaEn: string }[] = [
    { te: 'కోడి (Cock)', en: 'Cock (Kukkuta)', palanaTe: '08:24 AM – 10:48 AM', palanaEn: '08:24 AM – 10:48 AM', bhojanaTe: '01:12 PM – 03:36 PM', bhojanaEn: '01:12 PM – 03:36 PM' },
    { te: 'నెమలి (Peacock)', en: 'Peacock (Mayura)', palanaTe: '10:48 AM – 01:12 PM', palanaEn: '10:48 AM – 01:12 PM', bhojanaTe: '06:00 AM – 08:24 AM', bhojanaEn: '06:00 AM – 08:24 AM' },
    { te: 'కోడి (Cock)', en: 'Cock (Kukkuta)', palanaTe: '08:24 AM – 10:48 AM', palanaEn: '08:24 AM – 10:48 AM', bhojanaTe: '01:12 PM – 03:36 PM', bhojanaEn: '01:12 PM – 03:36 PM' },
    { te: 'కాకి (Crow)', en: 'Crow (Kaka)', palanaTe: '01:12 PM – 03:36 PM', palanaEn: '01:12 PM – 03:36 PM', bhojanaTe: '10:48 AM – 01:12 PM', bhojanaEn: '10:48 AM – 01:12 PM' },
    { te: 'భేరుండ / డేగ (Vulture/Hawk)', en: 'Hawk (Bherunda)', palanaTe: '03:36 PM – 06:00 PM', palanaEn: '03:36 PM – 06:00 PM', bhojanaTe: '08:24 AM – 10:48 AM', bhojanaEn: '08:24 AM – 10:48 AM' },
    { te: 'గుడ్లగూబ (Owl)', en: 'Owl (Uluka)', palanaTe: '06:00 AM – 08:24 AM', palanaEn: '06:00 AM – 08:24 AM', bhojanaTe: '03:36 PM – 06:00 PM', bhojanaEn: '03:36 PM – 06:00 PM' },
    { te: 'నెమలి (Peacock)', en: 'Peacock (Mayura)', palanaTe: '10:48 AM – 01:12 PM', palanaEn: '10:48 AM – 01:12 PM', bhojanaTe: '06:00 AM – 08:24 AM', bhojanaEn: '06:00 AM – 08:24 AM' },
  ];

  const pakshi = (isKrishnaPaksha ? pakshiByDowKrishna : pakshiByDowShukla)[dow] || pakshiByDowShukla[0];

  return {
    yogiSphutaDeg: `${Math.floor(yogiSphuta)}° ${Math.round((yogiSphuta % 1) * 60)}'`,
    yogiNakshatraTe: yogiNak.te,
    yogiNakshatraEn: yogiNak.en,
    yogiPlanetTe: yogiNak.lordTe,
    yogiPlanetEn: yogiNak.lordEn,
    sahayogiPlanetTe: sahayogiRashi.lordTe,
    sahayogiPlanetEn: sahayogiRashi.lordEn,
    avayogiNakshatraTe: avayogiNak.te,
    avayogiNakshatraEn: avayogiNak.en,
    avayogiPlanetTe: avayogiNak.lordTe,
    avayogiPlanetEn: avayogiNak.lordEn,
    yogiGuidanceTe: `దృక్సిద్ధాంత యోగి స్ఫుట గణితం ప్రకారం నేటి యోగి నక్షత్రం "${yogiNak.te}" (యోగి గ్రహం: ${yogiNak.lordTe}, సహయోగి: ${sahayogiRashi.lordTe}). నేడు ${yogiNak.lordTe} మరియు ${sahayogiRashi.lordTe} హోరలలో తలపెట్టే శుభకార్యాలు, ఆర్థిక లావాదేవీలు అఖండ విజయాన్ని ఇస్తాయి. అవయోగి గ్రహం (${avayogiNak.lordTe}) హోరలో వివాదాలకు దూరంగా ఉండాలి.`,
    yogiGuidanceEn: `Per Vedic Drik Siddhanta Sphuta math, today's Yogi Nakshatra is ${yogiNak.en} (Yogi Lord: ${yogiNak.lordEn}, Sahayogi: ${sahayogiRashi.lordEn}). Initiating key tasks during ${yogiNak.lordEn} or ${sahayogiRashi.lordEn} Hora brings prosperity, while caution is advised during Avayogi (${avayogiNak.lordEn}) Hora.`,
    rulingPakshiTe: pakshi.te,
    rulingPakshiEn: pakshi.en,
    pakshiPalanaWindowTe: pakshi.palanaTe,
    pakshiPalanaWindowEn: pakshi.palanaEn,
    pakshiBhojanaWindowTe: pakshi.bhojanaTe,
    pakshiBhojanaWindowEn: pakshi.bhojanaEn,
  };
}

/**
 * Computes PyJHora's Jaimini Chara Karakas, Arudha Lagna (AL), Upapada Lagna (UL),
 * Indu Lagna (Wealth Ascendant), Bhrigu Bindu, Natal Yogi-Avayogi, and Beeja-Kshetra Sphutas.
 */
export function computeKundaliJHoraSphutasAndJaimini(
  planets: {
    id: string;
    nameTe: string;
    nameEn: string;
    rashiIdx: number;
    longitude: number;
  }[],
  lagnaIdx: number
): KundaliJHoraMasterReport {
  const sevenIds = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const sevenPlanets = planets
    .filter((p) => sevenIds.includes(p.id))
    .map((p) => {
      const degInSign = norm360(p.longitude) % 30;
      return {
        ...p,
        degInSign,
      };
    })
    .sort((a, b) => b.degInSign - a.degInSign);

  const karakaDefinitions: {
    code: JaiminiCharaKarakaItem['karakaCode'];
    titleTe: string;
    titleEn: string;
    sigTe: string;
    sigEn: string;
  }[] = [
    {
      code: 'AK',
      titleTe: 'ఆత్మకారకుడు (Atmakaraka - AK)',
      titleEn: 'Atmakaraka (AK - Soul Significator)',
      sigTe: 'జాతక చక్రానికి మహారాజు. ఆత్మ లక్ష్యం, అంతరంగ శక్తి మరియు ఆధ్యాత్మిక పురోగతిని నిర్ణయిస్తాడు.',
      sigEn: 'Supreme King of the birth chart; governs soul purpose, inner strength, and ultimate destiny.',
    },
    {
      code: 'AmK',
      titleTe: 'అమాత్యకారకుడు (Amatyakaraka - AmK)',
      titleEn: 'Amatyakaraka (AmK - Career & Minister)',
      sigTe: 'వృత్తి, ఉద్యోగ ఉన్నతి, రాజసన్మానం మరియు ఆర్థిక సలహా శక్తిని ప్రసాదించే మంత్రి గ్రహం.',
      sigEn: 'Minister planet governing career elevation, administrative authority, and professional counsel.',
    },
    {
      code: 'BK',
      titleTe: 'భ్రాతృకారకుడు (Bhratrukaraka - BK)',
      titleEn: 'Bhratrukaraka (BK - Siblings & Guru)',
      sigTe: 'సోదరులు, గురువుల ఆశీస్సులు, ధైర్యం మరియు స్వయంకృషికి కారకుడు.',
      sigEn: 'Signifies siblings, mentors/Gurus, courage, and righteous action.',
    },
    {
      code: 'MK',
      titleTe: 'మాతృకారకుడు (Matrukaraka - MK)',
      titleEn: 'Matrukaraka (MK - Mother & Property)',
      sigTe: 'తల్లిగారి ఆశీస్సులు, మానసిక ప్రశాంతత, భూమి, స్వంత గృహం మరియు వాహన సౌఖ్యాన్ని ఇస్తాడు.',
      sigEn: 'Governs maternal blessings, emotional peace, real estate, home, and vehicles.',
    },
    {
      code: 'PK',
      titleTe: 'పుత్రకారకుడు (Putrakaraka - PK)',
      titleEn: 'Putrakaraka (PK - Progeny & Wisdom)',
      sigTe: 'సంతాన సౌఖ్యం, ఉన్నత విద్య, సృజనాత్మక మేధస్సు మరియు పూర్వపుణ్య ఫలాన్ని సూచిస్తాడు.',
      sigEn: 'Signifies children, higher intelligence, creative authorship, and past-life merit.',
    },
    {
      code: 'GK',
      titleTe: 'జ్ఞాతికారకుడు (Gnatikaraka - GK)',
      titleEn: 'Gnatikaraka (GK - Rivals & Resilience)',
      sigTe: 'పోటీదారులపై విజయం, రోగనిరోధక శక్తి మరియు సవాళ్లను అధిగమించే పట్టుదలను ఇస్తాడు.',
      sigEn: 'Governs victory over competitors, immunity, and problem-solving grit.',
    },
    {
      code: 'DK',
      titleTe: 'దారకారకుడు (Darakaraka - DK)',
      titleEn: 'Darakaraka (DK - Spouse & Partnerships)',
      sigTe: 'జీవిత భాగస్వామి స్వభావం, వివాహ సౌభాగ్యం మరియు వ్యాపార భాగస్వామ్య లాభాలను నిర్ణయిస్తాడు.',
      sigEn: 'Signifies spouse temperament, marital harmony, and business partnerships.',
    },
  ];

  const charaKarakas: JaiminiCharaKarakaItem[] = karakaDefinitions.map((def, i) => {
    const p = sevenPlanets[i] || sevenPlanets[0];
    const rMeta = RASHI_12_META[p?.rashiIdx ?? 0] || RASHI_12_META[0];
    const deg = p ? p.degInSign : 15;
    const dInt = Math.floor(deg);
    const mInt = Math.round((deg - dInt) * 60);
    return {
      karakaCode: def.code,
      karakaTitleTe: def.titleTe,
      karakaTitleEn: def.titleEn,
      planetTe: p?.nameTe || 'సూర్యుడు',
      planetEn: p?.nameEn || 'Sun',
      rashiTe: rMeta.te,
      rashiEn: rMeta.en,
      degreeInSign: `${dInt}° ${String(mInt).padStart(2, '0')}'`,
      significanceTe: def.sigTe,
      significanceEn: def.sigEn,
    };
  });

  const findLordRashiIdx = (houseRashiIdx: number): number => {
    const lordId = RASHI_12_META[houseRashiIdx]?.lordId || 'mars';
    const found = planets.find((p) => p.id === lordId);
    return found ? found.rashiIdx : houseRashiIdx;
  };

  // Jaimini Arudha Pada formula with classical Swastha-Daridra (1st/7th -> +9 houses) exception
  const computeArudhaSignIdx = (baseSignIdx: number): number => {
    const lordSignIdx = findLordRashiIdx(baseSignIdx);
    const dist = (lordSignIdx - baseSignIdx + 12) % 12;
    let arudhaIdx = (lordSignIdx + dist) % 12;
    const diffFromBase = (arudhaIdx - baseSignIdx + 12) % 12;
    if (diffFromBase === 0 || diffFromBase === 6) {
      arudhaIdx = (arudhaIdx + 9) % 12;
    }
    return arudhaIdx;
  };

  const alIdx = computeArudhaSignIdx(lagnaIdx);
  const ulIdx = computeArudhaSignIdx((lagnaIdx + 11) % 12); // Arudha of 12th house = Upapada Lagna (UL)

  const alMeta = RASHI_12_META[alIdx] || RASHI_12_META[0];
  const ulMeta = RASHI_12_META[ulIdx] || RASHI_12_META[0];
  const alHouse = ((alIdx - lagnaIdx + 12) % 12) + 1;
  const ulHouse = ((ulIdx - lagnaIdx + 12) % 12) + 1;

  // Indu Lagna (Wealth Ascendant)
  const sunP = planets.find((p) => p.id === 'sun') || planets[1];
  const moonP = planets.find((p) => p.id === 'moon') || planets[2];
  const marsP = planets.find((p) => p.id === 'mars') || planets[3];
  const jupP = planets.find((p) => p.id === 'jupiter') || planets[5];
  const venP = planets.find((p) => p.id === 'venus') || planets[6];
  const rahuP = planets.find((p) => p.id === 'rahu') || planets[8];

  const moonRashiIdx = moonP?.rashiIdx ?? 0;
  const ninthFromLagnaSign = (lagnaIdx + 8) % 12;
  const ninthFromMoonSign = (moonRashiIdx + 8) % 12;
  const totalKalas =
    (RASHI_12_META[ninthFromLagnaSign]?.induKalas || 10) +
    (RASHI_12_META[ninthFromMoonSign]?.induKalas || 10);
  const induOffset = totalKalas % 12 === 0 ? 12 : totalKalas % 12;
  const induRashiIdx = (moonRashiIdx + induOffset - 1) % 12;
  const induMeta = RASHI_12_META[induRashiIdx] || RASHI_12_META[0];
  const induHouse = ((induRashiIdx - lagnaIdx + 12) % 12) + 1;

  // Bhrigu Bindu (Midpoint from Rahu to Moon)
  const rahuLon = norm360(rahuP?.longitude ?? 300);
  const moonLon = norm360(moonP?.longitude ?? 60);
  const arcRahuToMoon = norm360(moonLon - rahuLon);
  const bhriguBinduLon = norm360(rahuLon + arcRahuToMoon / 2);
  const bbRashiIdx = Math.floor(bhriguBinduLon / 30) % 12;
  const bbMeta = RASHI_12_META[bbRashiIdx] || RASHI_12_META[0];
  const bbDegInSign = bhriguBinduLon % 30;
  const bbHouse = ((bbRashiIdx - lagnaIdx + 12) % 12) + 1;

  // Natal Yogi – Sahayogi – Avayogi
  const sunLon = norm360(sunP?.longitude ?? 0);
  const yogiSphuta = norm360(sunLon + moonLon + 93 + 20 / 60);
  const yogiNakIdx = Math.floor(yogiSphuta / (360 / 27)) % 27;
  const yogiRashiIdx = Math.floor(yogiSphuta / 30) % 12;
  const avayogiSphuta = norm360(yogiSphuta + 186 + 40 / 60);
  const avayogiNakIdx = Math.floor(avayogiSphuta / (360 / 27)) % 27;

  const yogiNak = NAKSHATRA_27_LIST[yogiNakIdx] || NAKSHATRA_27_LIST[0];
  const sahayogiRashi = RASHI_12_META[yogiRashiIdx] || RASHI_12_META[0];
  const avayogiNak = NAKSHATRA_27_LIST[avayogiNakIdx] || NAKSHATRA_27_LIST[14];

  // Beeja Sphuta, Kshetra Sphuta & Trisphuta
  const venLon = norm360(venP?.longitude ?? 120);
  const jupLon = norm360(jupP?.longitude ?? 90);
  const marsLon = norm360(marsP?.longitude ?? 30);
  const lagnaLon = norm360(planets[0]?.longitude ?? lagnaIdx * 30 + 15);

  const beejaLon = norm360(sunLon + venLon + jupLon);
  const kshetraLon = norm360(moonLon + marsLon + jupLon);
  const trisphutaLon = norm360(lagnaLon + moonLon + jupLon);

  const beejaMeta = RASHI_12_META[Math.floor(beejaLon / 30) % 12] || RASHI_12_META[0];
  const kshetraMeta = RASHI_12_META[Math.floor(kshetraLon / 30) % 12] || RASHI_12_META[0];
  const trisphutaMeta = RASHI_12_META[Math.floor(trisphutaLon / 30) % 12] || RASHI_12_META[0];

  return {
    charaKarakas,
    arudhaLagna: {
      rashiTe: alMeta.te,
      rashiEn: alMeta.en,
      houseFromLagna: alHouse,
      meaningTe: `జైమిని ఆరూఢ లగ్నం (AL) మీ కుండలిలో ${alMeta.te} రాశిలో (లగ్నం నుండి ${alHouse}వ భావం) ఏర్పడింది. ఇది బాహ్య ప్రపంచంలో మీ హోదా, కీర్తి ప్రతిష్ఠలు మరియు భౌతిక విజయాలను శాసిస్తుంది.`,
      meaningEn: `Jaimini Arudha Lagna (AL) falls in ${alMeta.en} (${alHouse}th house from Ascendant), governing your public image, material status, and worldly rise.`,
    },
    upapadaLagna: {
      rashiTe: ulMeta.te,
      rashiEn: ulMeta.en,
      houseFromLagna: ulHouse,
      meaningTe: `జైమిని ఉపపాద లగ్నం (UL - వివాహ ఆరూఢం) ${ulMeta.te} రాశిలో (${ulHouse}వ భావం, అధిపతి: ${ulMeta.lordTe}) నిలిచింది. దీనివల్ల సంస్కారవంతమైన జీవిత భాగస్వామి మరియు వివాహానంతరం కుటుంబ భాగ్యోదయం కలుగుతాయి.`,
      meaningEn: `Jaimini Upapada Lagna (UL - Marriage Arudha) occupies ${ulMeta.en} (${ulHouse}th house, ruled by ${ulMeta.lordEn}), indicating a devoted spouse and post-marital prosperity.`,
    },
    induLagna: {
      rashiTe: induMeta.te,
      rashiEn: induMeta.en,
      totalKalas,
      houseFromLagna: induHouse,
      meaningTe: `జగన్నాథ హోర "ఇందు లగ్న" (కోటీశ్వర ధన లగ్న) గణితం ప్రకారం మీ ఇందు లగ్నం ${induMeta.te} రాశి (లగ్నం నుండి ${induHouse}వ భావం, అధిపతి: ${induMeta.lordTe}). ${induMeta.lordTe} మహాదశ/అంతర్దశలలో మరియు గురువు ${induMeta.te} రాశిని వీక్షించే కాలంలో విశేష ధనయోగం, స్థిరాస్తి వృద్ధి కలుగుతాయి.`,
      meaningEn: `Your Indu Lagna (Wealth Ascendant) falls in ${induMeta.en} (${induHouse}th from Lagna, Lord: ${induMeta.lordEn}). Dasha/Bhukti periods of ${induMeta.lordEn} and transits over ${induMeta.en} unlock major wealth accumulation.`,
    },
    bhriguBindu: {
      rashiTe: bbMeta.te,
      rashiEn: bbMeta.en,
      degreeFormatted: `${Math.floor(bbDegInSign)}° ${Math.round((bbDegInSign % 1) * 60)}'`,
      houseFromLagna: bbHouse,
      meaningTe: `రాహు-చంద్రుల మధ్య బిందువైన "భృగు బిందువు" (Destiny Point) ${bbMeta.te} రాశిలో (${Math.floor(bbDegInSign)}° వద్ద, ${bbHouse}వ భావం) ఉంది. గోచారంలో గురువు లేదా శని ${bbMeta.te} రాశిలో ప్రవేశించినప్పుడు జీవితంలో ఆకస్మిక భాగ్యోదయం, విదేశీ/ఉద్యోగ శుభ పరిణామాలు సంభవిస్తాయి.`,
      meaningEn: `The Bhrigu Bindu (Rahu-Moon midpoint) is at ${Math.floor(bbDegInSign)}° in ${bbMeta.en} (${bbHouse}th house). Whenever transiting Jupiter or Saturn crosses ${bbMeta.en}, fated breakthroughs manifest.`,
    },
    natalYogiProfile: {
      yogiNakshatraTe: yogiNak.te,
      yogiNakshatraEn: yogiNak.en,
      yogiPlanetTe: yogiNak.lordTe,
      yogiPlanetEn: yogiNak.lordEn,
      sahayogiPlanetTe: sahayogiRashi.lordTe,
      sahayogiPlanetEn: sahayogiRashi.lordEn,
      avayogiPlanetTe: avayogiNak.lordTe,
      avayogiPlanetEn: avayogiNak.lordEn,
      meaningTe: `మీ జన్మ కుండలికి శాశ్వత యోగి నక్షత్రం "${yogiNak.te}" — కనుక "${yogiNak.lordTe}" (యోగి గ్రహం) మరియు "${sahayogiRashi.lordTe}" (సహయోగి గ్రహం) మీకు జీవితకాల ధన-విజయ ప్రదాతలు. అవయోగి గ్రహమైన "${avayogiNak.lordTe}" అంతర్దశలలో శాంతి పరిహారాలు పాటించడం శ్రేయస్కరం.`,
      meaningEn: `Your natal Yogi Nakshatra is ${yogiNak.en}, making ${yogiNak.lordEn} (Yogi Planet) and ${sahayogiRashi.lordEn} (Sahayogi) your lifelong bestowers of fortune, while ${avayogiNak.lordEn} (Avayogi) requires mindful remedies.`,
    },
    santanaAndAyurSphutas: {
      beejaSphutaRashiTe: beejaMeta.te,
      beejaSphutaRashiEn: beejaMeta.en,
      kshetraSphutaRashiTe: kshetraMeta.te,
      kshetraSphutaRashiEn: kshetraMeta.en,
      trisphutaRashiTe: trisphutaMeta.te,
      trisphutaRashiEn: trisphutaMeta.en,
      santanaMeaningTe: `సంతాన బలాన్ని చూపే బీజ స్ఫుటం ${beejaMeta.te} రాశిలో, క్షేత్ర స్ఫుటం ${kshetraMeta.te} రాశిలో మరియు ప్రాణ-దేహ-మృత్యు త్రిస్ఫుటం ${trisphutaMeta.te} రాశిలో నిలిచాయి. ఇది సత్సంతాన వృద్ధిని మరియు దీర్ఘాయుష్షును ధృవీకరిస్తోంది.`,
      santanaMeaningEn: `Beeja Sphuta in ${beejaMeta.en}, Kshetra Sphuta in ${kshetraMeta.en}, and Trisphuta in ${trisphutaMeta.en} confirm strong progeny vitality and robust longevity.`,
    },
  };
}
