/**
 * EXPANDED VEDIC ASTROLOGY CALCULATORS (IDEAS 1–4):
 *  1. Vimshottari Mahadasha -> Antardasha -> Pratyantardasha (Exact ISO Dates) + Guru-Shani Double Transit Date Windows
 *  2. Personal Daily Horoscope Score % (Natal Nakshatra + Rashi + Today Panchangam Tarabalam/Chandrabalam/Amrutha)
 *  3. Tajika Varshaphal (Annual Solar Return: Muntha, Varsheshwara, Panchadhikari & 365-Day Mudda Dasha)
 *  4. Multi-Dasha Systems: Ashtottari Mahadasha (108 Yrs) & Yogini Dasha (36 Yrs)
 */

import { DayData } from '../types/panchangam';
import { KundaliPlanetDetail } from './astronomyPanchangam';

const RASHI_TE = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
];

const RASHI_EN = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karkataka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
  'Dhanussu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
];

const RASHI_PRIMARY_LORD_ID = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter',
];

const PLANET_META_MAP: Record<string, { te: string; en: string }> = {
  ketu: { te: 'కేతువు', en: 'Ketu' },
  venus: { te: 'శుక్రుడు', en: 'Venus' },
  sun: { te: 'సూర్యుడు', en: 'Sun' },
  moon: { te: 'చంద్రుడు', en: 'Moon' },
  mars: { te: 'కుజుడు', en: 'Mars' },
  rahu: { te: 'రాహువు', en: 'Rahu' },
  jupiter: { te: 'గురుడు', en: 'Jupiter' },
  saturn: { te: 'శని', en: 'Saturn' },
  mercury: { te: 'బుధుడు', en: 'Mercury' },
};

const VIMSHOTTARI_SEQ: { id: string; te: string; en: string; years: number }[] = [
  { id: 'ketu', te: 'కేతువు', en: 'Ketu', years: 7 },
  { id: 'venus', te: 'శుక్రుడు', en: 'Venus', years: 20 },
  { id: 'sun', te: 'సూర్యుడు', en: 'Sun', years: 6 },
  { id: 'moon', te: 'చంద్రుడు', en: 'Moon', years: 10 },
  { id: 'mars', te: 'కుజుడు', en: 'Mars', years: 7 },
  { id: 'rahu', te: 'రాహువు', en: 'Rahu', years: 18 },
  { id: 'jupiter', te: 'గురుడు', en: 'Jupiter', years: 16 },
  { id: 'saturn', te: 'శని', en: 'Saturn', years: 19 },
  { id: 'mercury', te: 'బుధుడు', en: 'Mercury', years: 17 },
];

const MS_PER_YEAR = 365.2425 * 86400 * 1000;
const MS_PER_DAY = 86400 * 1000;

function formatIsoFromMs(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseBirthMs(birthDate: string, birthTime = '09:30'): number {
  const [y, m, d] = birthDate.split('-').map(Number);
  const [hr, min] = birthTime.split(':').map(Number);
  return Date.UTC(y || 1994, (m || 8) - 1, d || 15, hr || 9, min || 30);
}

// ============================================================================
// 1. VIMSHOTTARI PRATYANTARDASHA (3-LEVEL) + GURU-SHANI DOUBLE TRANSIT WINDOWS
// ============================================================================
export interface PratyantardashaItem {
  lordId: string;
  lordTe: string;
  lordEn: string;
  days: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  effectTe: string;
  effectEn: string;
}

export interface AntardashaWithPratyantara {
  lordId: string;
  lordTe: string;
  lordEn: string;
  yearsDecimal: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  pratyantaras: PratyantardashaItem[];
}

export interface MahadashaThreeLevel {
  lordId: string;
  lordTe: string;
  lordEn: string;
  durationYears: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  antardashas: AntardashaWithPratyantara[];
}

export interface DoubleTransitEventWindow {
  eventKey: 'marriage' | 'career' | 'property' | 'overseas';
  titleTe: string;
  titleEn: string;
  windowLabelTe: string;
  windowLabelEn: string;
  confidencePercent: number;
  basisTe: string;
  basisEn: string;
  actionTipTe: string;
  actionTipEn: string;
}

export interface PratyantardashaAndDoubleTransitResult {
  mahadashas: MahadashaThreeLevel[];
  currentMahadasha: MahadashaThreeLevel;
  currentAntardasha: AntardashaWithPratyantara;
  currentPratyantardasha: PratyantardashaItem;
  doubleTransitWindows: DoubleTransitEventWindow[];
}

const PRATYANTARA_BRIEF_TE: Record<string, string> = {
  sun: 'అధికారం, ఆత్మవిశ్వాసం, ప్రభుత్వ/పై అధికారుల మద్దతు & పితృ శుభం.',
  moon: 'మనశ్శాంతి, ప్రయాణాలు, గృహ సౌఖ్యం & మాతృ సహకారం.',
  mars: 'ధైర్యం, భూమి/ఆస్తి విషయాల్లో వేగం, పోటీ పరీక్షల్లో విజయం.',
  mercury: 'వ్యాపార లాభాలు, కమ్యూనికేషన్, అకౌంట్స్ & విద్యా వృద్ధి.',
  jupiter: 'శుభకార్యాలు, ధార్మిక ఆలోచనలు, ఆర్థిక వృద్ధి & గురు ఆశీస్సులు.',
  venus: 'వివాహ-దాంపత్య సౌఖ్యం, కళలు, వాహన-భోగ భాగ్యాలు.',
  saturn: 'క్రమశిక్షణ, దీర్ఘకాలిక శ్రమకు ఫలితం, సేవారంగ స్థిరత్వం.',
  rahu: 'ఆకస్మిక అవకాశాలు, విదేశీ సంపర్కం, టెక్నాలజీలో కొత్త మలుపు.',
  ketu: 'ఆధ్యాత్మిక దృష్టి, పరిశోధన, అనాసక్తి & అంతర్ముఖ వివేకం.',
};

const PRATYANTARA_BRIEF_EN: Record<string, string> = {
  sun: 'Authority, visibility, senior support, and vitality.',
  moon: 'Emotional clarity, short travel, domestic harmony, and focus.',
  mars: 'Initiative, real estate momentum, and competitive courage.',
  mercury: 'Commerce, analytical breakthroughs, contracts, and skill gains.',
  jupiter: 'Expansion, wisdom, mentors, and auspicious ceremonies.',
  venus: 'Romance, harmony, comforts, luxury, and creative rewards.',
  saturn: 'Disciplined execution, structural consolidation, and career grit.',
  rahu: 'Unconventional breakthroughs, technology growth, and overseas links.',
  ketu: 'Spiritual insight, research focus, and quiet inner clarity.',
};

export function computePratyantardashaAndDoubleTransit(
  moonLongitude: number,
  birthDate: string,
  birthTime: string,
  lagnaIdx: number
): PratyantardashaAndDoubleTransitResult {
  const normLon = ((moonLongitude % 360) + 360) % 360;
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(normLon / nakSpan) % 27;
  const fractionPassed = (normLon - nakIdx * nakSpan) / nakSpan;
  const balanceFrac = Math.max(0.01, 1 - fractionPassed);

  const startSeqIdx = nakIdx % 9;
  const birthMs = parseBirthMs(birthDate, birthTime);
  const nowMs = Date.now();

  // Compute exact cursor starting from theoretical birth start (adjusted backward for elapsed first dasha fraction)
  const firstCfg = VIMSHOTTARI_SEQ[startSeqIdx];
  const firstElapsedYears = firstCfg.years * fractionPassed;
  let mahaCursorMs = birthMs - firstElapsedYears * MS_PER_YEAR;

  const mahadashas: MahadashaThreeLevel[] = [];

  for (let m = 0; m < 9; m++) {
    const mCfg = VIMSHOTTARI_SEQ[(startSeqIdx + m) % 9];
    const fullDurationMs = mCfg.years * MS_PER_YEAR;
    const rawStartMs = m === 0 ? birthMs : mahaCursorMs;
    const rawEndMs = mahaCursorMs + fullDurationMs;
    const actualDisplayYears = m === 0 ? Number((mCfg.years * balanceFrac).toFixed(2)) : mCfg.years;

    let antarCursorMs = mahaCursorMs;
    const antardashas: AntardashaWithPratyantara[] = [];

    for (let a = 0; a < 9; a++) {
      const aCfg = VIMSHOTTARI_SEQ[(startSeqIdx + m + a) % 9];
      const antarDurYears = (mCfg.years * aCfg.years) / 120;
      const antarDurMs = antarDurYears * MS_PER_YEAR;
      const aStartMs = antarCursorMs;
      const aEndMs = antarCursorMs + antarDurMs;

      let pratyCursorMs = antarCursorMs;
      const pratyantaras: PratyantardashaItem[] = [];

      for (let p = 0; p < 9; p++) {
        const pCfg = VIMSHOTTARI_SEQ[(startSeqIdx + m + a + p) % 9];
        const pDurMs = (antarDurMs * pCfg.years) / 120;
        const pStartMs = pratyCursorMs;
        const pEndMs = pratyCursorMs + pDurMs;
        const isCurrentP = nowMs >= pStartMs && nowMs < pEndMs;

        pratyantaras.push({
          lordId: pCfg.id,
          lordTe: pCfg.te,
          lordEn: pCfg.en,
          days: Math.max(1, Math.round(pDurMs / MS_PER_DAY)),
          startDate: formatIsoFromMs(pStartMs),
          endDate: formatIsoFromMs(pEndMs),
          isCurrent: isCurrentP,
          effectTe: PRATYANTARA_BRIEF_TE[pCfg.id] || '',
          effectEn: PRATYANTARA_BRIEF_EN[pCfg.id] || '',
        });

        pratyCursorMs = pEndMs;
      }

      const isCurrentA = nowMs >= aStartMs && nowMs < aEndMs;
      antardashas.push({
        lordId: aCfg.id,
        lordTe: aCfg.te,
        lordEn: aCfg.en,
        yearsDecimal: Number(antarDurYears.toFixed(2)),
        startDate: formatIsoFromMs(aStartMs),
        endDate: formatIsoFromMs(aEndMs),
        isCurrent: isCurrentA,
        pratyantaras,
      });

      antarCursorMs = aEndMs;
    }

    const isCurrentM = nowMs >= rawStartMs && nowMs < rawEndMs;
    mahadashas.push({
      lordId: mCfg.id,
      lordTe: mCfg.te,
      lordEn: mCfg.en,
      durationYears: actualDisplayYears,
      startDate: formatIsoFromMs(rawStartMs),
      endDate: formatIsoFromMs(rawEndMs),
      isCurrent: isCurrentM,
      antardashas,
    });

    mahaCursorMs = rawEndMs;
  }

  const currentMahadasha = mahadashas.find((x) => x.isCurrent) || mahadashas[0];
  const currentAntardasha =
    currentMahadasha.antardashas.find((x) => x.isCurrent) || currentMahadasha.antardashas[0];
  const currentPratyantardasha =
    currentAntardasha.pratyantaras.find((x) => x.isCurrent) || currentAntardasha.pratyantaras[0];

  // Double Transit Evaluation (2026–2029)
  // Major Jupiter windows: 2026-06..2027-06 (Cancer=3), 2027-07..2028-07 (Leo=4), 2028-08..2029-09 (Virgo=5)
  // Major Saturn windows: 2026..2027-05 (Pisces=11), 2027-06..2029+ (Aries=0)
  const lagnaHouse7 = (lagnaIdx + 6) % 12;
  const lagnaHouse10 = (lagnaIdx + 9) % 12;
  const lagnaHouse4 = (lagnaIdx + 3) % 12;
  const lagnaHouse9 = (lagnaIdx + 8) % 12;

  const isSignAspectedByCancerLeoVirgo = (targetSign: number) =>
    [3, 4, 5].some((jSign) => {
      const diff = (targetSign - jSign + 12) % 12;
      return diff === 0 || diff === 4 || diff === 6 || diff === 8;
    });

  const doubleTransitWindows: DoubleTransitEventWindow[] = [
    {
      eventKey: 'marriage',
      titleTe: '1. వివాహ & భాగస్వామ్య శుభయోగం (Marriage / Partnership Window)',
      titleEn: '1. Marriage & Partnership Double Transit Window',
      windowLabelTe: isSignAspectedByCancerLeoVirgo(lagnaHouse7)
        ? 'నవంబర్ 2026 – జూన్ 2027 & ఆగస్ట్ 2027 – మే 2028'
        : 'జూలై 2027 – అక్టోబర్ 2028',
      windowLabelEn: isSignAspectedByCancerLeoVirgo(lagnaHouse7)
        ? 'Nov 2026 – Jun 2027 & Aug 2027 – May 2028'
        : 'Jul 2027 – Oct 2028',
      confidencePercent: isSignAspectedByCancerLeoVirgo(lagnaHouse7) ? 89 : 74,
      basisTe: `సప్తమ స్థానం (${RASHI_TE[lagnaHouse7]}) పై గురు–శనుల డబుల్ ట్రాన్సిట్ దృష్టి + ప్రస్తుత ${currentAntardasha.lordTe} భుక్తి అనుసంధానం.`,
      basisEn: `Jupiter-Saturn double aspect activating your 7th house (${RASHI_EN[lagnaHouse7]}) paired with active ${currentAntardasha.lordEn} Bhukti.`,
      actionTipTe: 'శుక్రవారం లక్ష్మీనారాయణ స్మరణ, జాతక పొంతన పరిశీలనకు అనుకూల సమయం.',
      actionTipEn: 'Ideal period to finalize matches and perform Friday Lakshmi-Narayana prayers.',
    },
    {
      eventKey: 'career',
      titleTe: '2. ఉద్యోగ మార్పు, పదోన్నతి & వ్యాపార విస్తరణ (Career Rise Window)',
      titleEn: '2. Career Promotion & Job Switch Double Transit Window',
      windowLabelTe: isSignAspectedByCancerLeoVirgo(lagnaHouse10)
        ? 'డిసెంబర్ 2026 – సెప్టెంబర్ 2027'
        : 'ఆగస్ట్ 2027 – జూలై 2028',
      windowLabelEn: isSignAspectedByCancerLeoVirgo(lagnaHouse10)
        ? 'Dec 2026 – Sep 2027'
        : 'Aug 2027 – Jul 2028',
      confidencePercent: isSignAspectedByCancerLeoVirgo(lagnaHouse10) ? 91 : 78,
      basisTe: `దశమ స్థానం (${RASHI_TE[lagnaHouse10]}) మరియు కర్మ కారకుడు శని గోచార బలం ఆధారంగా నిర్ణయించబడింది.`,
      basisEn: `Calculated from Double Transit activation of your 10th house (${RASHI_EN[lagnaHouse10]}) and Saturn transit aspects.`,
      actionTipTe: `${currentPratyantardasha.lordTe} ప్రత్యంతర దశలో (${currentPratyantardasha.startDate} – ${currentPratyantardasha.endDate}) కీలక ఇంటర్వ్యూలు/అప్లికేషన్లు పంపడం శుభం.`,
      actionTipEn: `Submit key applications during active ${currentPratyantardasha.lordEn} Pratyantardasha (${currentPratyantardasha.startDate} – ${currentPratyantardasha.endDate}).`,
    },
    {
      eventKey: 'property',
      titleTe: '3. సొంత ఇల్లు, భూమి & వాహన కొనుగోలు (Real Estate / Property Window)',
      titleEn: '3. Property, Home & Vehicle Acquisition Window',
      windowLabelTe: isSignAspectedByCancerLeoVirgo(lagnaHouse4)
        ? 'జనవరి 2027 – డిసెంబర్ 2027'
        : 'ఏప్రిల్ 2028 – మార్చి 2029',
      windowLabelEn: isSignAspectedByCancerLeoVirgo(lagnaHouse4)
        ? 'Jan 2027 – Dec 2027'
        : 'Apr 2028 – Mar 2029',
      confidencePercent: isSignAspectedByCancerLeoVirgo(lagnaHouse4) ? 86 : 72,
      basisTe: `చతుర్థ స్థానం (${RASHI_TE[lagnaHouse4]}) పై ఉచ్చ/బలమైన గురు దృష్టి గృహ నిర్మాణ పనులను వేగవంతం చేస్తుంది.`,
      basisEn: `Strong Guru transit over your 4th house (${RASHI_EN[lagnaHouse4]}) unlocks fixed assets and home ownership.`,
      actionTipTe: 'భూమి/గృహ రిజిస్ట్రేషన్ ముందు శని-మంగళవారాలు కాకుండా గురు/శుక్రవార ముహూర్తాలు ఎంచుకోండి.',
      actionTipEn: 'Prefer Thursday or Friday Shubha Muhurtham for property registration.',
    },
    {
      eventKey: 'overseas',
      titleTe: '4. విదేశీ ప్రయాణం, వీసా & ఆర్థిక మైలురాయి (Foreign / Wealth Window)',
      titleEn: '4. Overseas Travel, Visa & Major Financial Milestone',
      windowLabelTe: isSignAspectedByCancerLeoVirgo(lagnaHouse9)
        ? 'నవంబర్ 2026 – జూలై 2027'
        : 'సెప్టెంబర్ 2027 – జూన్ 2028',
      windowLabelEn: isSignAspectedByCancerLeoVirgo(lagnaHouse9)
        ? 'Nov 2026 – Jul 2027'
        : 'Sep 2027 – Jun 2028',
      confidencePercent: isSignAspectedByCancerLeoVirgo(lagnaHouse9) ? 85 : 75,
      basisTe: `నవమ భాగ్య స్థానం (${RASHI_TE[lagnaHouse9]}) & 12వ విదేశీ స్థానం గోచార సమన్వయం.`,
      basisEn: `Synchronized transit over your 9th house (${RASHI_EN[lagnaHouse9]}) and 12th house of overseas fortune.`,
      actionTipTe: 'బుధవారం విష్ణు సహస్రనామ స్మరణ వీసా & ఫైనాన్స్ అడ్డంకులను తొలగిస్తుంది.',
      actionTipEn: 'Wednesday Vishnu Sahasranama clears documentation and international hurdles.',
    },
  ];

  return {
    mahadashas,
    currentMahadasha,
    currentAntardasha,
    currentPratyantardasha,
    doubleTransitWindows,
  };
}

// ============================================================================
// 2. PERSONAL DAILY HOROSCOPE SCORE % (TARABALAM + CHANDRABALAM + TIMING)
// ============================================================================
export const TWENTY_SEVEN_STARS_TE = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష',
  'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనురాధ', 'జ్యేష్ఠ',
  'మూల', 'పూర్వాషాఢ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి',
];

export const TWENTY_SEVEN_STARS_EN = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'Purvashadha', 'Uttarashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purvabhadra', 'Uttarabhadra', 'Revati',
];

const TARA_TABLE = [
  { num: 1, te: 'జన్మ తార (1)', en: 'Janma Tara (1)', favorable: false, pts: 18 },
  { num: 2, te: 'సంపత్ తార (2) — ధన/కార్యసిద్ధి', en: 'Sampat Tara (2) — Wealth & Gains', favorable: true, pts: 40 },
  { num: 3, te: 'విపత్ తార (3) — జాగ్రత్త', en: 'Vipat Tara (3) — Caution Needed', favorable: false, pts: 8 },
  { num: 4, te: 'క్షేమ తార (4) — క్షేమం/సుఖం', en: 'Kshema Tara (4) — Wellbeing', favorable: true, pts: 38 },
  { num: 5, te: 'ప్రత్యక్ తార (5) — అడ్డంకి', en: 'Pratyak Tara (5) — Obstacles', favorable: false, pts: 12 },
  { num: 6, te: 'సాధన తార (6) — కార్యసాధన', en: 'Sadhana Tara (6) — Accomplishment', favorable: true, pts: 42 },
  { num: 7, te: 'నైధన తార (7) — నష్టం/విశ్రాంతి', en: 'Naidhana Tara (7) — Rest & Precaution', favorable: false, pts: 4 },
  { num: 8, te: 'మిత్ర తార (8) — మిత్రలాభం', en: 'Mitra Tara (8) — Friendly Support', favorable: true, pts: 39 },
  { num: 9, te: 'పరమ మిత్ర తార (9) — అత్యుత్తమం', en: 'Parama Mitra Tara (9) — Supreme Luck', favorable: true, pts: 45 },
];

export interface PersonalDailyScoreReport {
  scorePercent: number;
  statusTe: string;
  statusEn: string;
  statusTier: 'excellent' | 'good' | 'caution';
  todayNakshatraTe: string;
  todayMoonSignTe: string;
  taraInfoTe: string;
  taraInfoEn: string;
  chandraHouse: number;
  chandraStatusTe: string;
  chandraStatusEn: string;
  luckyHoursTe: string;
  luckyHoursEn: string;
  doAdviceTe: string;
  doAdviceEn: string;
  avoidAdviceTe: string;
  avoidAdviceEn: string;
  mantraTe: string;
}

export function computePersonalDailyHoroscopeScore(
  day: DayData,
  natalNakIdx: number, // 0..26
  natalRashiIdx: number // 0..11
): PersonalDailyScoreReport {
  // Find today's Moon Rashi & Nakshatra from DayData
  const RASHI_ORDER_KEYS = [
    'mesham', 'vrushabham', 'mithunam', 'karkatakam', 'simham', 'kanya',
    'tula', 'vruschikam', 'dhanussu', 'makaram', 'kumbham', 'meenam',
  ];
  let todayMoonRashiIdx = 0;
  for (let i = 0; i < 12; i++) {
    const val = day.grahaStithi[RASHI_ORDER_KEYS[i] as keyof typeof day.grahaStithi] || '';
    if (val.includes('చంద్రుడు')) {
      todayMoonRashiIdx = i;
      break;
    }
  }

  const nakField = (day.panchanga?.nakshatram || '').split('(')[0].split('-')[0].trim();
  let todayNakIdx = TWENTY_SEVEN_STARS_TE.findIndex((star) => nakField.includes(star));
  if (todayNakIdx < 0) todayNakIdx = (todayMoonRashiIdx * 2 + 1) % 27;

  // Tarabalam: count from natalNakIdx to todayNakIdx (1..27 -> mod 9)
  const distNak = ((todayNakIdx - natalNakIdx + 27) % 27) + 1;
  const taraRem = ((distNak - 1) % 9); // 0..8 -> Tara 1..9
  const tara = TARA_TABLE[taraRem];

  // Chandrabalam: count from natalRashiIdx to todayMoonRashiIdx (1..12)
  const chandraHouse = ((todayMoonRashiIdx - natalRashiIdx + 12) % 12) + 1;
  const goodChandraHouses = new Set([1, 3, 6, 7, 10, 11]);
  const isChandrashtama = chandraHouse === 8;
  const chandraPts = isChandrashtama
    ? 6
    : goodChandraHouses.has(chandraHouse)
    ? 44
    : chandraHouse === 12 || chandraHouse === 4
    ? 18
    : 28;

  const chandraStatusTe = isChandrashtama
    ? `చంద్రాష్టమం (8వ చంద్రుడు) — అత్యంత జాగ్రత్త`
    : goodChandraHouses.has(chandraHouse)
    ? `శుభ చంద్రబలం (${chandraHouse}వ స్థానం)`
    : `మధ్యమ చంద్రబలం (${chandraHouse}వ స్థానం)`;

  const chandraStatusEn = isChandrashtama
    ? `Chandrashtama (8th Moon) — Observe Precaution`
    : goodChandraHouses.has(chandraHouse)
    ? `Strong Chandrabalam (House ${chandraHouse})`
    : `Moderate Chandrabalam (House ${chandraHouse})`;

  // Combined weighted score (5..98)
  const rawScore = Math.min(97, Math.max(22, tara.pts + chandraPts + 9));
  const statusTier: 'excellent' | 'good' | 'caution' =
    rawScore >= 76 ? 'excellent' : rawScore >= 52 ? 'good' : 'caution';

  const statusTe =
    statusTier === 'excellent'
      ? 'అత్యంత శుభదినం (Peak Auspicious Day)'
      : statusTier === 'good'
      ? 'సానుకూల మధ్యమ దినం (Favorable Day)'
      : 'ధ్యాన-జాగ్రత్త దినం (Take Extra Care)';

  const statusEn =
    statusTier === 'excellent'
      ? 'Peak Auspicious Day'
      : statusTier === 'good'
      ? 'Balanced & Favorable Day'
      : 'Quiet Caution Recommended';

  const luckyHoursTe = `${day.shubha?.amrutha || 'ఉదయం 07:30–09:00'} & అభిజిత్ (${day.shubha?.abhijit || '11:48–12:36'})`;
  const luckyHoursEn = `Amrutha (${day.shubha?.amrutha || 'Morning'}) & Abhijit (${day.shubha?.abhijit || 'Noon'})`;

  const doAdviceTe =
    statusTier === 'excellent'
      ? 'కొత్త ఒప్పందాలు, ఆర్థిక పెట్టుబడులు, ప్రయాణాలు మరియు శుభచర్చలకు నేడు అద్భుతమైన బలం ఉంది.'
      : statusTier === 'good'
      ? 'రోజువారీ పనులు పూర్తి చేయడం, కుటుంబ చర్చలు మరియు పెండింగ్ పనులకు అనుకూలం.'
      : 'ప్రశాంతంగా నిత్య ధ్యానం, పెండింగ్ రివ్యూ మరియు ఆరోగ్యంపై శ్రద్ధ పెట్టడం శ్రేష్టం.';

  const doAdviceEn =
    statusTier === 'excellent'
      ? 'Great day for key agreements, financial decisions, networking, and auspicious launches.'
      : statusTier === 'good'
      ? 'Ideal for completing routine work, family discussions, and structured progress.'
      : 'Best suited for calm review, meditation, rest, and steady behind-the-scenes work.';

  const avoidAdviceTe = `రాహుకాలం (${day.ashubha?.rahukalam || '09:00–10:30'}) & వర్జ్యం (${day.ashubha?.varjyam || 'వర్జ్య సమయం'}) వేళ కీలక నిర్ణయాలు వాయిదా వేయండి.`;
  const avoidAdviceEn = `Avoid starting major commitments during Rahu Kalam (${day.ashubha?.rahukalam || ''}) and Varjyam.`;

  const mantraTe = isChandrashtama
    ? 'ఓం నమః శివాయ (108 సార్లు) లేదా చంద్ర అష్టోత్తరం.'
    : tara.favorable
    ? 'ఓం శ్రీ మహాగణాధిపతయే నమః · సంపత్-సాధన తారా సిద్ధి.'
    : 'ఓం నమో నారాయణాయ (21 సార్లు) · హనుమాన్ చాలీసా పఠనం.';

  return {
    scorePercent: rawScore,
    statusTe,
    statusEn,
    statusTier,
    todayNakshatraTe: nakField || TWENTY_SEVEN_STARS_TE[todayNakIdx],
    todayMoonSignTe: RASHI_TE[todayMoonRashiIdx],
    taraInfoTe: tara.te,
    taraInfoEn: tara.en,
    chandraHouse,
    chandraStatusTe,
    chandraStatusEn,
    luckyHoursTe,
    luckyHoursEn,
    doAdviceTe,
    doAdviceEn,
    avoidAdviceTe,
    avoidAdviceEn,
    mantraTe,
  };
}

// ============================================================================
// 3. TAJIKA VARSHAPHAL (SOLAR RETURN, MUNTHA, VARSHESHWARA & MUDDA DASHA)
// ============================================================================
export interface MuddaDashaItem {
  lordId: string;
  lordTe: string;
  lordEn: string;
  days: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  verdictTe: string;
  verdictEn: string;
}

export interface TajikaVarshaphalReport {
  targetYear: number;
  ageInYear: number;
  birthdayRangeLabel: string;
  munthaSignIdx: number;
  munthaRashiTe: string;
  munthaRashiEn: string;
  munthaHouseFromVarshaLagna: number;
  munthaLordTe: string;
  munthaLordEn: string;
  munthaVerdictTe: string;
  munthaVerdictEn: string;
  varshaLagnaIdx: number;
  varshaLagnaTe: string;
  varshaLagnaEn: string;
  varsheshwaraTe: string;
  varsheshwaraEn: string;
  annualScore: number;
  muddaDashas: MuddaDashaItem[];
}

export function computeTajikaVarshaphal(
  planets: KundaliPlanetDetail[],
  natalLagnaIdx: number,
  birthDate: string,
  targetYear: number
): TajikaVarshaphalReport {
  const [bY, bM, bD] = birthDate.split('-').map(Number);
  const age = Math.max(0, targetYear - (bY || 1994));

  // Muntha progresses 1 sign per year from Natal Lagna
  const munthaSignIdx = (natalLagnaIdx + age) % 12;

  // Approximate Solar Return Varsha Lagna shift: Sun returns to exact natal degree, Ascendant advances by ~87.7°/year (solar yr excess ~0.2422d = ~87.2° ~ 3 signs per year modulo weekday shift)
  const varshaLagnaIdx = (natalLagnaIdx + ((age * 3) % 12)) % 12;
  const munthaHouseFromVarshaLagna = ((munthaSignIdx - varshaLagnaIdx + 12) % 12) + 1;

  const munthaLordId = RASHI_PRIMARY_LORD_ID[munthaSignIdx];
  const varshaLagnaLordId = RASHI_PRIMARY_LORD_ID[varshaLagnaIdx];
  const natalLagnaLordId = RASHI_PRIMARY_LORD_ID[natalLagnaIdx];

  // Varsheshwara (Year Lord) selection: strong candidate among Muntha Lord / Varsha Lagna Lord / Tri-Rashi Lord
  const candidateLords = [munthaLordId, varshaLagnaLordId, natalLagnaLordId];
  const varsheshwaraId = candidateLords[age % candidateLords.length];
  const varsheshwaraMeta = PLANET_META_MAP[varsheshwaraId] || PLANET_META_MAP.jupiter;
  const munthaLordMeta = PLANET_META_MAP[munthaLordId] || PLANET_META_MAP.sun;

  const auspiciousMunthaHouses = new Set([1, 2, 3, 5, 9, 10, 11]);
  const isMunthaGood = auspiciousMunthaHouses.has(munthaHouseFromVarshaLagna);
  const annualScore = isMunthaGood ? 84 : munthaHouseFromVarshaLagna === 4 || munthaHouseFromVarshaLagna === 7 ? 74 : 61;

  const munthaVerdictTe = isMunthaGood
    ? `ముంథా ${RASHI_TE[munthaSignIdx]} (${munthaHouseFromVarshaLagna}వ భావం) లో శుభస్థానంలో ఉన్నందున ఈ జన్మసంవత్సరంలో కీర్తి, ధనాభివృద్ధి & అనుకున్న కార్యాలు సిద్ధించును.`
    : `ముంథా ${munthaHouseFromVarshaLagna}వ భావంలో ఉన్నందున శ్రమతో కూడిన విజయం లభిస్తుంది; వర్షేశ్వరుడు ${varsheshwaraMeta.te} ఆరాధన విశేష శుభం తెస్తుంది.`;

  const munthaVerdictEn = isMunthaGood
    ? `Muntha placed in auspicious House ${munthaHouseFromVarshaLagna} (${RASHI_EN[munthaSignIdx]}) brings strong recognition, income gains, and milestone execution this solar year.`
    : `Muntha in House ${munthaHouseFromVarshaLagna} advises steady patience and focusing on ${varsheshwaraMeta.en} remedies throughout the year.`;

  // Mudda Dasha (Annual 365-day breakdown starting from birthday in targetYear)
  const moonPlanet = planets.find((p) => p.id === 'moon') || planets[2];
  const moonNakIdx = moonPlanet?.nakshatraIdx ?? 0;
  const startDashaIdx = (moonNakIdx + age) % 9;

  const startMs = Date.UTC(targetYear, (bM || 8) - 1, bD || 15);
  const nowMs = Date.now();
  let cursorMs = startMs;
  const muddaDashas: MuddaDashaItem[] = [];

  for (let i = 0; i < 9; i++) {
    const cfg = VIMSHOTTARI_SEQ[(startDashaIdx + i) % 9];
    // Mudda proportion = (planet_years / 120) * 365.2425 days
    const daysExact = (cfg.years / 120) * 365.2425;
    const durMs = daysExact * MS_PER_DAY;
    const endMs = cursorMs + durMs;
    muddaDashas.push({
      lordId: cfg.id,
      lordTe: cfg.te,
      lordEn: cfg.en,
      days: Math.round(daysExact),
      startDate: formatIsoFromMs(cursorMs),
      endDate: formatIsoFromMs(endMs),
      isCurrent: nowMs >= cursorMs && nowMs < endMs,
      verdictTe: PRATYANTARA_BRIEF_TE[cfg.id] || '',
      verdictEn: PRATYANTARA_BRIEF_EN[cfg.id] || '',
    });
    cursorMs = endMs;
  }

  const endBirthdayStr = formatIsoFromMs(startMs + 365.2425 * MS_PER_DAY);
  const startBirthdayStr = formatIsoFromMs(startMs);

  return {
    targetYear,
    ageInYear: age,
    birthdayRangeLabel: `${startBirthdayStr} → ${endBirthdayStr}`,
    munthaSignIdx,
    munthaRashiTe: RASHI_TE[munthaSignIdx],
    munthaRashiEn: RASHI_EN[munthaSignIdx],
    munthaHouseFromVarshaLagna,
    munthaLordTe: munthaLordMeta.te,
    munthaLordEn: munthaLordMeta.en,
    munthaVerdictTe,
    munthaVerdictEn,
    varshaLagnaIdx,
    varshaLagnaTe: RASHI_TE[varshaLagnaIdx],
    varshaLagnaEn: RASHI_EN[varshaLagnaIdx],
    varsheshwaraTe: varsheshwaraMeta.te,
    varsheshwaraEn: varsheshwaraMeta.en,
    annualScore,
    muddaDashas,
  };
}

// ============================================================================
// 4. ASHTOTTARI DASHA (108 YEARS) & YOGINI DASHA (36 YEARS)
// ============================================================================
export interface AlternateDashaRow {
  lordTe: string;
  lordEn: string;
  years: number;
  startYear: number;
  endYear: number;
  isCurrent: boolean;
  themeTe: string;
  themeEn: string;
}

export interface MultiDashaSystemsBundle {
  ashtottariList: AlternateDashaRow[];
  activeAshtottari: AlternateDashaRow;
  yoginiList: AlternateDashaRow[];
  activeYogini: AlternateDashaRow;
}

const ASHTOTTARI_SEQ: { te: string; en: string; years: number; themeTe: string; themeEn: string }[] = [
  { te: 'సూర్యుడు', en: 'Sun (Surya)', years: 6, themeTe: 'అధికారం, గుర్తింపు & పితృ అనుగ్రహం', themeEn: 'Leadership, authority & honors' },
  { te: 'చంద్రుడు', en: 'Moon (Chandra)', years: 15, themeTe: 'మానసిక సౌఖ్యం, సంపద & కుటుంబ వృద్ధి', themeEn: 'Emotional peace, domestic harmony & popularity' },
  { te: 'కుజుడు', en: 'Mars (Kuja)', years: 8, themeTe: 'భూమి/ఇల్లు, పరాక్రమం & వృత్తి సాహసం', themeEn: 'Real estate, courage & decisive action' },
  { te: 'బుధుడు', en: 'Mercury (Budha)', years: 17, themeTe: 'వ్యాపారం, విద్య, బుద్ధికుశలత & వాక్చాతుర్యం', themeEn: 'Commerce, education, media & sharp intellect' },
  { te: 'శని', en: 'Saturn (Shani)', years: 10, themeTe: 'నిర్మాణాత్మక శ్రమ, సేవ & దీర్ఘకాలిక విజయం', themeEn: 'Structured effort, endurance & lasting status' },
  { te: 'గురుడు', en: 'Jupiter (Guru)', years: 19, themeTe: 'ధనం, సంతానం, ధర్మకార్యాలు & వివేకం', themeEn: 'Wisdom, wealth expansion, family & grace' },
  { te: 'రాహువు', en: 'Rahu', years: 12, themeTe: 'విదేశీ అవకాశాలు, టెక్నాలజీ & ఆకస్మిక పురోగతి', themeEn: 'Breakthrough ambition, tech & foreign fortune' },
  { te: 'శుక్రుడు', en: 'Venus (Shukra)', years: 21, themeTe: 'వివాహం, కళలు, ఐశ్వర్యం & భోగభాగ్యాలు', themeEn: 'Marriage, luxuries, arts & refined wealth' },
];

const YOGINI_SEQ: { te: string; en: string; years: number; lordTe: string; themeTe: string; themeEn: string }[] = [
  { te: 'మంగళ (చంద్ర)', en: 'Mangala (Moon)', years: 1, lordTe: 'చంద్రుడు', themeTe: 'శుభారంభం, మనోధైర్యం & సత్కార్య సిద్ధి', themeEn: 'Auspicious beginnings & inner serenity' },
  { te: 'పింగళ (సూర్య)', en: 'Pingala (Sun)', years: 2, lordTe: 'సూర్యుడు', themeTe: 'తేజస్సు, ఆరోగ్య జాగ్రత్త & ఉద్యోగ పురోగతి', themeEn: 'Vitality, leadership drive & disciplined focus' },
  { te: 'ధాన్య (గురు)', en: 'Dhanya (Jupiter)', years: 3, lordTe: 'గురుడు', themeTe: 'ధన ధాన్య వృద్ధి, అభీష్ట సిద్ధి & గురు కృప', themeEn: 'Abundance, luck, honors & wise investments' },
  { te: 'భ్రామరి (కుజ)', en: 'Bhramari (Mars)', years: 4, lordTe: 'కుజుడు', themeTe: 'ప్రయాణాలు, స్థానచలనం & శ్రమతో విజయం', themeEn: 'Relocation, dynamic travel & active toil' },
  { te: 'భద్రిక (బుధ)', en: 'Bhadrika (Mercury)', years: 5, lordTe: 'బుధుడు', themeTe: 'ఉన్నత విద్య, స్నేహలాభం & వ్యాపార విజయం', themeEn: 'Scholarship, partnerships & career growth' },
  { te: 'ఉల్క (శని)', en: 'Ulka (Saturn)', years: 6, lordTe: 'శని', themeTe: 'బాధ్యతలు, ఆర్థిక జాగ్రత్త & అనుభవ పాఠం', themeEn: 'Karmic responsibility & cautious consolidation' },
  { te: 'సిద్ధ (శుక్ర)', en: 'Siddha (Venus)', years: 7, lordTe: 'శుక్రుడు', themeTe: 'అఖండ కార్యసిద్ధి, వివాహ-గృహ సౌఖ్యం & ఐశ్వర్యం', themeEn: 'Peak fulfillment, marriage, comforts & grace' },
  { te: 'సంకట (రాహు)', en: 'Sankata (Rahu)', years: 8, lordTe: 'రాహువు', themeTe: 'సవాళ్లను జయించి విదేశీ/నూతన మార్గం వేయుట', themeEn: 'Overcoming crossroads via radical transformation' },
];

export function computeAshtottariAndYoginiDashas(
  moonNakIdx: number, // 0..26 (Ashwini=0..Revati=26)
  balanceFraction: number,
  birthDate: string
): MultiDashaSystemsBundle {
  const birthYear = Number(birthDate.split('-')[0]) || 1994;
  const currentYear = new Date().getFullYear();

  // 1. Ashtottari (28 Nakshatra mapping incl. Abhijit between 20 & 21; simplified classical start from Ardra=5)
  const ardaOffset = (moonNakIdx - 5 + 27) % 27;
  const ashStartIdx = Math.floor(ardaOffset / 3.375) % 8;
  let ashCursor = birthYear;
  const ashtottariList: AlternateDashaRow[] = [];

  for (let i = 0; i < 8; i++) {
    const cfg = ASHTOTTARI_SEQ[(ashStartIdx + i) % 8];
    const dur = i === 0 ? Math.max(1, Math.round(cfg.years * balanceFraction)) : cfg.years;
    const startY = ashCursor;
    const endY = ashCursor + dur;
    ashCursor = endY;
    ashtottariList.push({
      lordTe: cfg.te,
      lordEn: cfg.en,
      years: dur,
      startYear: startY,
      endYear: endY,
      isCurrent: currentYear >= startY && currentYear < endY,
      themeTe: cfg.themeTe,
      themeEn: cfg.themeEn,
    });
  }

  // 2. Yogini Dasha (36-yr cycles across lifetime; classical index = ((NakNum_1based) + 3) % 8, 0=>8)
  const nak1Based = moonNakIdx + 1;
  const yogStartIdx = ((nak1Based + 3 - 1) % 8);
  let yogCursor = birthYear;
  const yoginiList: AlternateDashaRow[] = [];

  // Show 2 full 36-year cycles (72+ yrs) so adult ages are always covered
  for (let i = 0; i < 16; i++) {
    const cfg = YOGINI_SEQ[(yogStartIdx + i) % 8];
    const dur = i === 0 ? Math.max(1, Math.round(cfg.years * balanceFraction)) : cfg.years;
    const startY = yogCursor;
    const endY = yogCursor + dur;
    yogCursor = endY;
    yoginiList.push({
      lordTe: cfg.te,
      lordEn: cfg.en,
      years: dur,
      startYear: startY,
      endYear: endY,
      isCurrent: currentYear >= startY && currentYear < endY,
      themeTe: cfg.themeTe,
      themeEn: cfg.themeEn,
    });
  }

  return {
    ashtottariList,
    activeAshtottari: ashtottariList.find((x) => x.isCurrent) || ashtottariList[0],
    yoginiList,
    activeYogini: yoginiList.find((x) => x.isCurrent) || yoginiList[0],
  };
}
