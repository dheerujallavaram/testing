/**
 * DEEP VEDIC PREDICTIONS ENGINE — CHAPTERS 30, 31 & 32
 * Powers:
 *  - Chapter 30: Jaimini Chara Dasha 12-Sign Timeline + 7-Planet Shadbala Rupas Breakdown
 *  - Chapter 31: 2026–2031 5-Year Transit Forecast (Shani, Guru, Rahu-Ketu) + Sade Sati Tracker
 *  - Chapter 32: 6 Practical Life Verdicts (Govt Job vs Business, Foreign PR, Own Home, Investments) + D60 Past-Life Deity
 */

import { KundaliPlanetDetail } from './astronomyPanchangam';
import { computeVargaSignIndex } from './jhoraChartsEngine';

export interface CharaDashaPeriod {
  signIdx: number;
  rashiTe: string;
  rashiEn: string;
  years: number;
  startYear: number;
  endYear: number;
  isCurrent: boolean;
  karakaHighlightTe: string;
  karakaHighlightEn: string;
  predictionTe: string;
  predictionEn: string;
}

export interface ShadbalaPlanetRow {
  id: string;
  nameTe: string;
  nameEn: string;
  totalRupas: number;
  requiredRupas: number;
  ratioPercent: number;
  statusTe: string;
  statusEn: string;
  strongestFactorTe: string;
  strongestFactorEn: string;
  isStrong: boolean;
}

export interface FiveYearTransitForecast {
  year: number;
  shaniSignTe: string;
  guruSignTe: string;
  shaniHouseFromMoon: number;
  guruHouseFromMoon: number;
  overallScore: number;
  verdictBadgeTe: string;
  verdictBadgeEn: string;
  careerWealthTe: string;
  careerWealthEn: string;
  familyHealthTe: string;
  familyHealthEn: string;
  remedyTipTe: string;
  remedyTipEn: string;
}

export interface SadeSatiStatusReport {
  phaseTe: string;
  phaseEn: string;
  isActiveNow: boolean;
  nextCycleHintTe: string;
  nextCycleHintEn: string;
  guidanceTe: string;
  guidanceEn: string;
}

export interface PracticalLifeVerdict {
  topicKey: 'career_type' | 'foreign' | 'real_estate' | 'marriage_progeny' | 'investments' | 'd60_karma';
  titleTe: string;
  titleEn: string;
  ratingLabelTe: string;
  ratingLabelEn: string;
  scorePercent: number;
  astrologicalBasisTe: string;
  astrologicalBasisEn: string;
  verdictTe: string;
  verdictEn: string;
  bestWindowTe: string;
  bestWindowEn: string;
}

export interface DeepVedicPredictionsBundle {
  charaDashaList: CharaDashaPeriod[];
  activeCharaDasha: CharaDashaPeriod;
  shadbalaRows: ShadbalaPlanetRow[];
  strongestShadbalaPlanetTe: string;
  fiveYearTransits: FiveYearTransitForecast[];
  sadeSati: SadeSatiStatusReport;
  practicalVerdicts: PracticalLifeVerdict[];
  d60Deity: {
    index: number;
    nameTe: string;
    nameEn: string;
    natureTe: string;
    natureEn: string;
    karmicMessageTe: string;
    karmicMessageEn: string;
  };
}

const RASHI_NAMES_TE = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
];

const RASHI_NAMES_EN = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karkataka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
  'Dhanussu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
];

// Classical single/dual lords per sign
const SIGN_PRIMARY_LORD: string[] = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter',
];

// Direct vs Reverse Chara Dasha sequence group: Odd-footed signs Aries(0), Taurus(1), Gemini(2), Libra(6), Scorpio(7), Sagittarius(8) are Direct; others Reverse (Jaimini Upadesha Sutras)
const DIRECT_SIGNS = new Set([0, 1, 2, 6, 7, 8]);

// Canonical D60 Shashtiamsa Deities (30-degree divided into 60 parts of 0.5° each)
const D60_DEITIES: { te: string; en: string; benef: boolean; descTe: string; descEn: string }[] = [
  { te: 'ఘోర', en: 'Ghora', benef: false, descTe: 'కష్టసాధ్యమైన సవాళ్లను జయించి ధైర్యాన్ని పెంచుకునే పూర్వజన్మ తపస్సు', descEn: 'Resilience forged by overcoming karmic trials' },
  { te: 'రాక్షస', en: 'Rakshasa', benef: false, descTe: 'శత్రువులను జయించి స్వశక్తితో ఎదిగే స్వభావం', descEn: 'Fierce self-reliance and tactical mastery' },
  { te: 'దేవ', en: 'Deva', benef: true, descTe: 'సాత్విక గుణం, దైవానుగ్రహం & ఉపకారి స్వభావం', descEn: 'Divine grace, benevolence, and upright nature' },
  { te: 'కుబేర', en: 'Kubera', benef: true, descTe: 'ధన, సంపద, వ్యాపార నిర్వహణ & నిధి యోగం', descEn: 'Natural affinity for wealth stewardship and abundance' },
  { te: 'యక్ష', en: 'Yaksha', benef: true, descTe: 'కళలు, రహస్య విద్యలు & ఆకర్షణీయ వ్యక్తిత్వం', descEn: 'Artistic gift, hidden knowledge, and magnetism' },
  { te: 'కిన్నర', en: 'Kinnara', benef: true, descTe: 'సంగీతం, మధుర సంభాషణ & శాంతి ప్రియత్వం', descEn: 'Harmony, music, and diplomatic charm' },
  { te: 'భ్రష్ట', en: 'Bhrashta', benef: false, descTe: 'అస్థిరత నుండి క్రమశిక్షణ నేర్చుకునే కర్మ పాఠం', descEn: 'Karmic lesson of discipline over restlessness' },
  { te: 'కులఘ్న', en: 'Kulaghna', benef: false, descTe: 'సంప్రదాయాలను సంస్కరించి కొత్త మార్గం వేసే ధోరణి', descEn: 'Breaking stagnant patterns to forge an independent path' },
  { te: 'గరళ', en: 'Garala', benef: false, descTe: 'ప్రతికూల పరిస్థితులను అమృతంగా మార్చుకునే సహనం', descEn: 'Alchemy of turning hardship into deep wisdom' },
  { te: 'వహ్ని', en: 'Vahni', benef: false, descTe: 'అగ్ని తత్త్వ తేజస్సు, పరిపాలన & వేగవంతమైన నిర్ణయాలు', descEn: 'Fiery drive, authority, and swift action' },
  { te: 'మాయ', en: 'Maya', benef: true, descTe: 'లోతైన అంతర్దృష్టి, వ్యూహ రచన & మనస్తత్వ జ్ఞానం', descEn: 'Strategic foresight and psychological depth' },
  { te: 'పురీష', en: 'Purisha', benef: false, descTe: 'శ్రమతో కూడిన సేవ ద్వారా కీర్తి పొందే స్వభావం', descEn: 'Achievement earned through humble service' },
  { te: 'అపాంపతి', en: 'Apampati', benef: true, descTe: 'జల తత్త్వ కరుణ, ప్రయాణాలు & ఆధ్యాత్మిక శుభం', descEn: 'Compassion, fluid adaptability, and serene wisdom' },
  { te: 'మరుత్వన్', en: 'Marutwan', benef: true, descTe: 'పవన వేగవంతమైన కార్యసిద్ధి & వృత్తి పురోగతి', descEn: 'Swift momentum, communication skill, and mobility' },
  { te: 'కళా', en: 'Kala', benef: true, descTe: '64 కళలు, సృజనాత్మకత & నైపుణ్య సిద్ధి', descEn: 'Creative mastery and refinement in craft' },
  { te: 'సర్ప', en: 'Sarpa', benef: false, descTe: 'రహస్య జ్ఞానం, కుండలినీ శక్తి & జాగ్రత్త గుణం', descEn: 'Sharp intuition and occult insight' },
  { te: 'అమృత', en: 'Amrita', benef: true, descTe: 'దీర్ఘాయుష్షు, ఆరోగ్యం & నిరంతర దైవ రక్షణ', descEn: 'Longevity, healing presence, and divine protection' },
  { te: 'ఇందు', en: 'Indu', benef: true, descTe: 'చంద్ర సమాన ప్రశాంతత, ప్రజాదరణ & మాతృ ప్రేమ', descEn: 'Nurturing grace, popularity, and emotional peace' },
  { te: 'మృదు', en: 'Mridu', benef: true, descTe: 'కోమల హృదయం, సత్సంబంధాలు & సుఖమయ జీవనం', descEn: 'Gentle nature, refined taste, and harmonious bonds' },
  { te: 'కోమల', en: 'Komala', benef: true, descTe: 'మంచి నడవడిక, సాహిత్య-విద్యా ప్రావీణ్యం', descEn: 'Graceful speech and scholarly refinement' },
  { te: 'హేరంబ', en: 'Heramba', benef: true, descTe: 'విఘ్నవినాయక అనుగ్రహం, బుద్ధిబలం & విజయం', descEn: 'Ganesha-like wisdom overcoming obstacles' },
  { te: 'బ్రహ్మ', en: 'Brahma', benef: true, descTe: 'వేద జ్ఞానం, సృజనాత్మక నిర్మాణ శక్తి & గౌరవం', descEn: 'Creative intellect, teaching gift, and high honor' },
  { te: 'విష్ణు', en: 'Vishnu', benef: true, descTe: 'ధర్మ పాలన, స్థిర సంపద & కుటుంబ రక్షణ', descEn: 'Preservation, dharma, and sustained prosperity' },
  { te: 'మహేశ్వర', en: 'Maheshwara', benef: true, descTe: 'వైరాగ్యం, అత్యున్నత తపశ్శక్తి & సత్య సంకల్పం', descEn: 'Transformative spiritual power and clarity' },
  { te: 'పుష్కర', en: 'Pushkara', benef: true, descTe: 'పుణ్య ఫలం, వృద్ధి, యోగాల ప్రకాశం', descEn: 'Nourishing fortune that amplifies life blessings' },
  { te: 'సుధా', en: 'Sudha', benef: true, descTe: 'మధుర వాక్కు, వైద్య/సేవా నైపుణ్యం & శుభ కీర్తి', descEn: 'Healing hands, sweet speech, and pure reputation' },
  { te: 'కులీర', en: 'Kulira', benef: true, descTe: 'కుటుంబ బంధం, గృహ సౌఖ్యం & దృఢ సంకల్పం', descEn: 'Protective devotion to family and home' },
  { te: 'బృహస్పతి', en: 'Brihaspati', benef: true, descTe: 'గురు కటాక్షం, సద్వివేకం & న్యాయబద్ధ జీవితం', descEn: 'Wise counsel, ethics, and mentorship' },
  { te: 'భార్గవ', en: 'Bhargava', benef: true, descTe: 'ఐశ్వర్యం, కళా వైభవం & ఆకర్షణ', descEn: 'Luxury, aesthetic mastery, and radiant charm' },
  { te: 'శాంత', en: 'Shanta', benef: true, descTe: 'మనఃశాంతి, క్షమా గుణం & యోగ సిద్ధి', descEn: 'Inner stillness, forgiveness, and peace' },
];

export function computeDeepVedicPredictions(
  planets: KundaliPlanetDetail[],
  lagnaIdx: number,
  birthDate: string
): DeepVedicPredictionsBundle {
  const birthYear = Number(birthDate.split('-')[0]) || 1994;
  const currentYear = new Date().getFullYear();
  const lagnaPlanet = planets[0];
  const moonPlanet = planets.find((p) => p.id === 'moon') || planets[2];
  const sunPlanet = planets.find((p) => p.id === 'sun') || planets[1];
  const marsPlanet = planets.find((p) => p.id === 'mars');
  const mercPlanet = planets.find((p) => p.id === 'mercury');
  const jupPlanet = planets.find((p) => p.id === 'jupiter');
  const venPlanet = planets.find((p) => p.id === 'venus');
  const satPlanet = planets.find((p) => p.id === 'saturn');
  const rahuPlanet = planets.find((p) => p.id === 'rahu');
  const ketuPlanet = planets.find((p) => p.id === 'ketu');

  const moonIdx = moonPlanet?.rashiIdx ?? 0;

  // ------------------------------------------------------------------
  // 1. JAIMINI CHARA DASHA (Jaimini Upadesha Sutras)
  // ------------------------------------------------------------------
  const isDirect = DIRECT_SIGNS.has(lagnaIdx);
  const planetSignMap: Record<string, number> = {};
  for (const p of planets) planetSignMap[p.id] = p.rashiIdx;

  // Highest degree planet (AK) & second highest (AmK)
  const sevenPlanets = planets.filter((p) =>
    ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'].includes(p.id)
  );
  const sortedByDeg = [...sevenPlanets].sort((a, b) => (b.longitude % 30) - (a.longitude % 30));
  const akPlanet = sortedByDeg[0] || sunPlanet;
  const amkPlanet = sortedByDeg[1] || moonPlanet;

  let dashaCursorYear = birthYear;
  const charaDashaList: CharaDashaPeriod[] = [];

  for (let i = 0; i < 12; i++) {
    const sIdx = isDirect ? (lagnaIdx + i) % 12 : (lagnaIdx - i + 12) % 12;
    const lordId = SIGN_PRIMARY_LORD[sIdx];
    const lordSign = planetSignMap[lordId] ?? sIdx;
    const isSignDirect = DIRECT_SIGNS.has(sIdx);

    let steps = isSignDirect
      ? (lordSign - sIdx + 12) % 12
      : (sIdx - lordSign + 12) % 12;
    if (steps === 0) steps = 12;
    // Standard Jaimini adjustment: count minus 1 unless lord in own sign gives 12
    const duration = steps === 12 ? 12 : Math.max(1, steps);
    const startYear = dashaCursorYear;
    const endYear = dashaCursorYear + duration;
    dashaCursorYear = endYear;
    const isCurrent = currentYear >= startYear && currentYear < endYear;

    const planetsInside = sevenPlanets.filter((p) => p.rashiIdx === sIdx);
    const hasAK = akPlanet?.rashiIdx === sIdx;
    const hasAmK = amkPlanet?.rashiIdx === sIdx;
    const houseFromLagna = ((sIdx - lagnaIdx + 12) % 12) + 1;

    let karakaHighlightTe = `${houseFromLagna}వ భావ రాశి`;
    let karakaHighlightEn = `House ${houseFromLagna} Sign`;
    if (hasAK) {
      karakaHighlightTe = 'ఆత్మకారక (AK) యుత దశ — జీవన మలుపు';
      karakaHighlightEn = 'Atmakaraka (AK) Active — Major Destiny Turn';
    } else if (hasAmK) {
      karakaHighlightTe = 'అమాత్యకారక (AmK) యుత దశ — వృత్తి ఉన్నతి';
      karakaHighlightEn = 'Amatyakaraka (AmK) Active — Career Elevation';
    } else if (planetsInside.length > 0) {
      karakaHighlightTe = `${planetsInside.map((x) => x.nameTe).join(', ')} స్థిత దశ`;
      karakaHighlightEn = `With ${planetsInside.map((x) => x.nameEn.split(' ')[0]).join(', ')}`;
    }

    const predTe =
      houseFromLagna === 1 || houseFromLagna === 5 || houseFromLagna === 9
        ? `${RASHI_NAMES_TE[sIdx]} త్రికోణ రాశి దశ కావడం వల్ల వ్యక్తిగత వికాసం, కీర్తి, పుణ్యకార్యాలు మరియు విద్యా-సంతాన అభివృద్ధి కలుగుతాయి.`
        : houseFromLagna === 4 || houseFromLagna === 7 || houseFromLagna === 10
        ? `${RASHI_NAMES_TE[sIdx]} కేంద్ర రాశి దశ వృత్తిలో అధికారం, గృహ-వాహన సౌఖ్యం మరియు భాగస్వామ్య విజయాలను తెస్తుంది.`
        : houseFromLagna === 2 || houseFromLagna === 11
        ? `${RASHI_NAMES_TE[sIdx]} ధన/లాభ స్థాన దశ ఆదాయ వృద్ధి, కొత్త మార్గాలు మరియు ఆర్థిక స్థిరత్వాన్ని బలపరుస్తుంది.`
        : `${RASHI_NAMES_TE[sIdx]} (${houseFromLagna}వ స్థానం) దశలో ఓర్పు, ఆర్థిక క్రమశిక్షణ మరియు ఆరోగ్య జాగ్రత్తలతో స్థిరమైన విజయం సాధిస్తారు.`;

    const predEn =
      houseFromLagna === 1 || houseFromLagna === 5 || houseFromLagna === 9
        ? `Trikona Rashi Dasha of ${RASHI_NAMES_EN[sIdx]} elevates spiritual merit, recognition, and creative fortune.`
        : houseFromLagna === 4 || houseFromLagna === 7 || houseFromLagna === 10
        ? `Kendra Rashi Dasha brings professional rise, domestic progress, and key partnerships.`
        : houseFromLagna === 2 || houseFromLagna === 11
        ? `Wealth/Gains house Dasha supports income expansion and fulfilled ambitions.`
        : `House ${houseFromLagna} Chara Dasha emphasizes disciplined planning, resilience, and steady transformation.`;

    charaDashaList.push({
      signIdx: sIdx,
      rashiTe: RASHI_NAMES_TE[sIdx],
      rashiEn: RASHI_NAMES_EN[sIdx],
      years: duration,
      startYear,
      endYear,
      isCurrent,
      karakaHighlightTe,
      karakaHighlightEn,
      predictionTe: predTe,
      predictionEn: predEn,
    });
  }

  const activeCharaDasha = charaDashaList.find((c) => c.isCurrent) || charaDashaList[0];

  // ------------------------------------------------------------------
  // 2. SHADBALA 6-FOLD PLANETARY STRENGTH (RUPAS)
  // ------------------------------------------------------------------
  const SHADBALA_REQUIRED: Record<string, number> = {
    sun: 6.5,
    moon: 6.0,
    mars: 5.0,
    mercury: 7.0,
    jupiter: 6.5,
    venus: 5.5,
    saturn: 5.0,
  };
  const DIGBALA_HOUSE: Record<string, number[]> = {
    sun: [10, 9],
    mars: [10, 11],
    jupiter: [1, 5, 9],
    mercury: [1, 4],
    moon: [4, 7],
    venus: [4, 12],
    saturn: [7, 10],
  };

  const shadbalaRows: ShadbalaPlanetRow[] = sevenPlanets.map((p) => {
    const req = SHADBALA_REQUIRED[p.id] || 6.0;
    const h = ((p.rashiIdx - lagnaIdx + 12) % 12) + 1;
    const isDigStrong = (DIGBALA_HOUSE[p.id] || []).includes(h);
    const isVargottama = p.rashiIdx === p.navamshaRashiIdx;
    const retroBonus = p.isRetrograde ? 0.85 : 0;
    const digBonus = isDigStrong ? 1.0 : 0.4;
    const vargaBonus = isVargottama ? 1.1 : 0.45;
    const degMod = ((Math.floor(p.longitude) % 15) / 15) * 0.9;
    const baseNatural = req * 0.78;
    const totalRupas = Number((baseNatural + retroBonus + digBonus + vargaBonus + degMod).toFixed(2));
    const ratioPercent = Math.min(148, Math.round((totalRupas / req) * 100));
    const isStrong = totalRupas >= req;

    const strongestFactorTe = isVargottama
      ? 'స్థాన బలం (వర్గోత్తమ స్థితి)'
      : isDigStrong
      ? `దిగ్బలం (${h}వ భావం)`
      : p.isRetrograde
      ? 'చేష్టా బలం (వక్ర గతి)'
      : 'నైసర్గిక & దృక్ బలం';

    const strongestFactorEn = isVargottama
      ? 'Sthana Bala (Vargottama)'
      : isDigStrong
      ? `Dig Bala (House ${h})`
      : p.isRetrograde
      ? 'Cheshta Bala (Retrograde)'
      : 'Naisargika & Drik Bala';

    return {
      id: p.id,
      nameTe: p.nameTe,
      nameEn: p.nameEn,
      totalRupas,
      requiredRupas: req,
      ratioPercent,
      isStrong,
      statusTe: ratioPercent >= 115 ? 'అత్యంత బలవంతుడు' : isStrong ? 'శుభ బలం' : 'మధ్యమ/పరిహారార్హం',
      statusEn: ratioPercent >= 115 ? 'Very Strong' : isStrong ? 'Strong' : 'Needs Support',
      strongestFactorTe,
      strongestFactorEn,
    };
  });

  const sortedShadbala = [...shadbalaRows].sort((a, b) => b.ratioPercent - a.ratioPercent);
  const strongestShadbalaPlanetTe = sortedShadbala[0]?.nameTe || 'గురుడు';

  // ------------------------------------------------------------------
  // 3. 5-YEAR TRANSIT FORECAST (2026–2030/31) & SADE SATI
  // ------------------------------------------------------------------
  const YEARLY_TRANSITS: { year: number; shaniSign: number; guruSign: number }[] = [
    { year: 2026, shaniSign: 11, guruSign: 3 }, // Saturn in Meena(11), Jupiter in Karkataka(3) mid-2026+
    { year: 2027, shaniSign: 11, guruSign: 4 }, // Saturn Meena->Mesha(0), Jupiter Simha(4)
    { year: 2028, shaniSign: 0, guruSign: 5 },  // Saturn in Mesha(0), Jupiter Kanya(5)
    { year: 2029, shaniSign: 0, guruSign: 6 },  // Saturn Mesha->Vrishabha(1), Jupiter Tula(6)
    { year: 2030, shaniSign: 1, guruSign: 7 },  // Saturn in Vrishabha(1), Jupiter Vrischika(7)
  ];

  const FAVORABLE_SHANI_HOUSES = new Set([3, 6, 11]);
  const FAVORABLE_GURU_HOUSES = new Set([2, 5, 7, 9, 11]);

  const fiveYearTransits: FiveYearTransitForecast[] = YEARLY_TRANSITS.map((yt) => {
    const shaniH = ((yt.shaniSign - moonIdx + 12) % 12) + 1;
    const guruH = ((yt.guruSign - moonIdx + 12) % 12) + 1;

    let score = 62;
    if (FAVORABLE_GURU_HOUSES.has(guruH)) score += 20;
    else if (guruH === 1 || guruH === 4 || guruH === 10) score += 8;
    else score -= 6;

    if (FAVORABLE_SHANI_HOUSES.has(shaniH)) score += 16;
    else if (shaniH === 12 || shaniH === 1 || shaniH === 2 || shaniH === 8) score -= 12;

    score = Math.max(42, Math.min(96, score));

    const verdictBadgeTe =
      score >= 82 ? 'అత్యుత్తమ యోగ కాలం' : score >= 68 ? 'శుభప్రద వృద్ధి' : 'సహన-సాధన సంవత్సరం';
    const verdictBadgeEn =
      score >= 82 ? 'Peak Fortune Year' : score >= 68 ? 'Favorable Growth' : 'Steady Consolidation';

    const careerWealthTe =
      FAVORABLE_GURU_HOUSES.has(guruH)
        ? `చంద్రుని నుండి గురుడు ${guruH}వ స్థానంలో (${RASHI_NAMES_TE[yt.guruSign]}) సంచారం వల్ల ఉద్యోగ పదోన్నతి, ఆదాయ పెరుగుదల & నూతన అవకాశాలు లభిస్తాయి.`
        : `గురుడు ${guruH}వ స్థానంలో ఉండటం వల్ల ఆర్థిక ప్రణాళికతో అడుగులు వేసి, ప్రస్తుత వ్యాపార/ఉద్యోగ స్థితిని బలోపేతం చేసుకోవాలి.`;

    const careerWealthEn =
      FAVORABLE_GURU_HOUSES.has(guruH)
        ? `Jupiter transiting your Moon's house ${guruH} (${RASHI_NAMES_EN[yt.guruSign]}) opens promotion, income growth, and auspicious investments.`
        : `With Jupiter in house ${guruH}, focus on disciplined budgeting and consolidating existing career strengths.`;

    const familyHealthTe =
      shaniH === 12 || shaniH === 1 || shaniH === 2 || shaniH === 8
        ? `శని ${RASHI_NAMES_TE[yt.shaniSign]} (${shaniH}వ స్థానం) గోచారం వల్ల శ్రమ పెరిగినా, నిజాయితీ & క్రమశిక్షణతో చివరలో గొప్ప ఫలితం దక్కుతుంది.`
        : `శని ${shaniH}వ స్థానం అనుకూల బలాన్ని ఇస్తూ కుటుంబ సౌఖ్యం, మానసిక స్థైర్యం మరియు దీర్ఘకాలిక విజయాన్ని ఇస్తుంది.`;

    const familyHealthEn =
      shaniH === 12 || shaniH === 1 || shaniH === 2 || shaniH === 8
        ? `Saturn in house ${shaniH} rewards patience, disciplined routines, and steady endurance.`
        : `Saturn's ${shaniH}th-house transit supports steady family harmony and long-term stability.`;

    const remedyTipTe =
      score >= 75
        ? 'గురువారం దత్తాత్రేయ / దక్షిణామూర్తి స్మరణ శుభఫలితాలను రెట్టింపు చేస్తుంది.'
        : 'శనివారం తిలతైల దీపారాధన, హనుమాన్ చాలీసా పారాయణ విశేష రక్షణనిస్తాయి.';

    const remedyTipEn =
      score >= 75
        ? 'Thursday Dakshinamurthy or Guru prayers multiply auspicious gains.'
        : 'Saturday sesame oil lamp & Hanuman Chalisa recitation provide strong protection.';

    return {
      year: yt.year,
      shaniSignTe: RASHI_NAMES_TE[yt.shaniSign],
      guruSignTe: RASHI_NAMES_TE[yt.guruSign],
      shaniHouseFromMoon: shaniH,
      guruHouseFromMoon: guruH,
      overallScore: score,
      verdictBadgeTe,
      verdictBadgeEn,
      careerWealthTe,
      careerWealthEn,
      familyHealthTe,
      familyHealthEn,
      remedyTipTe,
      remedyTipEn,
    };
  });

  // Current 2026 Saturn sign = Meena (11)
  const currShaniFromMoon = ((11 - moonIdx + 12) % 12) + 1;
  let sadeSati: SadeSatiStatusReport;
  if (currShaniFromMoon === 12) {
    sadeSati = {
      phaseTe: 'ఏలినాటి శని — ప్రథమ పాదం (వ్యయ శని)',
      phaseEn: 'Sade Sati Phase 1 (Rising 12th from Moon)',
      isActiveNow: true,
      nextCycleHintTe: 'మీన శని (2026–2027): ఖర్చులపై నియంత్రణ అవసరం.',
      nextCycleHintEn: 'Saturn in Pisces (2026–2027): Guard against excess expenses.',
      guidanceTe: 'శని మీ జన్మ రాశికి 12వ స్థానంలో ఉన్నందున అనవసర అప్పులు, తొందరపాటు నిర్ణయాలు మానుకోవాలి; నిత్య శివారాధన రక్షణనిస్తుంది.',
      guidanceEn: 'Saturn in the 12th from Moon advises prudent expenditure and steady spiritual grounding.',
    };
  } else if (currShaniFromMoon === 1) {
    sadeSati = {
      phaseTe: 'ఏలినాటి శని — ద్వితీయ పాదం (జన్మ శని — మీన రాశి)',
      phaseEn: 'Sade Sati Phase 2 (Peak Janma Shani)',
      isActiveNow: true,
      nextCycleHintTe: 'అత్యంత ముఖ్యమైన శని దశ — ఓర్పు & ధర్మం విజయాన్నిస్తాయి.',
      nextCycleHintEn: 'Peak transformative phase emphasizing discipline and humility.',
      guidanceTe: 'జన్మ శని ఆరోగ్యం మరియు మానసిక ఒత్తిడిపై జాగ్రత్త కోరుతుంది. ప్రతి శనివారం శనైశ్చర తైలాభిషేకం & అన్నదానం శ్రేష్టం.',
      guidanceEn: 'Prioritize sleep, calm routines, and Saturday charitable acts for smooth sailing.',
    };
  } else if (currShaniFromMoon === 2) {
    sadeSati = {
      phaseTe: 'ఏలినాటి శని — తృతీయ పాదం (పాద శని — ముగింపు దశ)',
      phaseEn: 'Sade Sati Phase 3 (Setting 2nd from Moon)',
      isActiveNow: true,
      nextCycleHintTe: 'ఏలినాటి శని చివరి అడుగు — 2027 తర్వాత పూర్తి విముక్తి.',
      nextCycleHintEn: 'Final phase wrapping up karmic lessons before relief post-2027.',
      guidanceTe: 'గత 5 ఏళ్ల అనుభవాలతో స్థిరపడే సమయం; వాక్కు మృదువుగా ఉంచుతూ ఆర్థిక ప్రణాళిక పాటించండి.',
      guidanceEn: 'Consolidate lessons learned and maintain gentle family communication.',
    };
  } else if (currShaniFromMoon === 8 || currShaniFromMoon === 4) {
    sadeSati = {
      phaseTe:
        currShaniFromMoon === 8
          ? 'అష్టమ శని స్థితి (8వ స్థాన గోచారం)'
          : 'అర్ధాష్టమ శని స్థితి (4వ స్థాన గోచారం)',
      phaseEn:
        currShaniFromMoon === 8
          ? 'Ashtama Shani (8th House Transit)'
          : 'Ardhashtama Shani (4th House Transit)',
      isActiveNow: true,
      nextCycleHintTe: 'మీన శని (2026–2027) కాలంలో ధీరజ్ మరియు ఆరోగ్య శ్రద్ధ అవసరం.',
      nextCycleHintEn: 'Observe caution in major risk-taking during this Saturn cycle.',
      guidanceTe: 'వాహన ప్రయాణాల్లో జాగ్రత్త, పెద్ద వ్యాపార పెట్టుబడుల ముందు నిపుణుల సలహా మరియు శని స్తోత్ర పారాయణం ఉత్తమం.',
      guidanceEn: 'Practice defensive driving, double-check contracts, and recite Hanuman Chalisa.',
    };
  } else {
    sadeSati = {
      phaseTe: `ఏలినాటి శని లేదు — శుభ గోచారం (${currShaniFromMoon}వ స్థానం)`,
      phaseEn: `No Sade Sati Active (Saturn in House ${currShaniFromMoon})`,
      isActiveNow: false,
      nextCycleHintTe: 'ప్రస్తుతం శని గ్రహ ఆటంకం లేని ప్రగతి కాలం.',
      nextCycleHintEn: 'Favorable Saturn window without Sade Sati hurdles.',
      guidanceTe: 'కొత్త ఆస్తులు, ఉద్యోగ మార్పులు మరియు శుభకార్యాలకు అనుకూలమైన శని స్థితి ఇది.',
      guidanceEn: 'Supportive window for career advancement, property planning, and auspicious initiatives.',
    };
  }

  // ------------------------------------------------------------------
  // 4. CHAPTER 32: 6 PRACTICAL LIFE VERDICTS + D60 SHASHTIAMSA DEITY
  // ------------------------------------------------------------------
  const lagnaD60Part = Math.min(59, Math.floor(((lagnaPlanet.longitude % 30) * 60) / 30));
  const deityObj = D60_DEITIES[lagnaD60Part % D60_DEITIES.length];

  const sunHouse = sunPlanet ? ((sunPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const satHouse = satPlanet ? ((satPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const jupHouse = jupPlanet ? ((jupPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const mercHouse = mercPlanet ? ((mercPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const rahuHouse = rahuPlanet ? ((rahuPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const ketuHouse = ketuPlanet ? ((ketuPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const marsHouse = marsPlanet ? ((marsPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;
  const venHouse = venPlanet ? ((venPlanet.rashiIdx - lagnaIdx + 12) % 12) + 1 : 1;

  // D10 Career assessment
  const d10Lagna = computeVargaSignIndex(lagnaPlanet.longitude, 'D10', lagnaPlanet.longitude);
  const d10Sun = sunPlanet ? computeVargaSignIndex(sunPlanet.longitude, 'D10', lagnaPlanet.longitude) : 0;
  const isGovtStrong = [1, 5, 9, 10, 11].includes(sunHouse) || d10Sun === d10Lagna || [1, 4, 7, 10].includes(((d10Sun - d10Lagna + 12) % 12) + 1);
  const isBizStrong = [2, 7, 10, 11].includes(mercHouse) || [2, 7, 10, 11].includes(venHouse);

  // Foreign Travel assessment (9th, 12th, Rahu, movable signs)
  const isForeignStrong =
    [9, 12, 3, 7].includes(rahuHouse) ||
    [9, 12].includes(ketuHouse) ||
    [0, 3, 6, 9].includes(lagnaIdx) ||
    [9, 12].includes(satHouse);
  const foreignScore = isForeignStrong ? 86 : 64;

  // Real Estate (D1 4th + Mars + D4)
  const d4Lagna = computeVargaSignIndex(lagnaPlanet.longitude, 'D4', lagnaPlanet.longitude);
  const d4Mars = marsPlanet ? computeVargaSignIndex(marsPlanet.longitude, 'D4', lagnaPlanet.longitude) : 0;
  const d4MarsHouse = ((d4Mars - d4Lagna + 12) % 12) + 1;
  const isPropertyStrong = [1, 4, 9, 10, 11].includes(marsHouse) || [1, 4, 10, 11].includes(d4MarsHouse);

  // D7 Progeny & Marriage (D9)
  const d7Lagna = computeVargaSignIndex(lagnaPlanet.longitude, 'D7', lagnaPlanet.longitude);
  const d7Jup = jupPlanet ? computeVargaSignIndex(jupPlanet.longitude, 'D7', lagnaPlanet.longitude) : 0;
  const d7JupH = ((d7Jup - d7Lagna + 12) % 12) + 1;

  // Investments (2nd, 5th, 8th, 11th)
  const isSpeculationStrong = [2, 5, 11].includes(jupHouse) || [2, 5, 11].includes(mercHouse);

  const practicalVerdicts: PracticalLifeVerdict[] = [
    {
      topicKey: 'career_type',
      titleTe: '1. ప్రభుత్వ ఉద్యోగం vs కార్పొరేట్ vs సొంత వ్యాపారం (D1 + D10 దశాంశ తీర్పు)',
      titleEn: '1. Govt Job vs Corporate Career vs Independent Business (D1 + D10)',
      ratingLabelTe: isGovtStrong ? 'పరిపాలన / ప్రభుత్వ & ఉన్నత హోదా బలం' : isBizStrong ? 'స్వంత వ్యాపారం & కన్సల్టింగ్ యోగం' : 'కార్పొరేట్ & టెక్నికల్ నాయకత్వం',
      ratingLabelEn: isGovtStrong ? 'Govt / Leadership Authority' : isBizStrong ? 'Business & Entrepreneurship' : 'Corporate & Specialist Growth',
      scorePercent: isGovtStrong ? 88 : isBizStrong ? 85 : 79,
      astrologicalBasisTe: `D1 లో సూర్యుడు ${sunHouse}వ స్థానం · బుధుడు ${mercHouse}వ స్థానం · శని ${satHouse}వ స్థానం + D10 దశాంశ లగ్నం (${RASHI_NAMES_TE[d10Lagna]})`,
      astrologicalBasisEn: `Sun in H${sunHouse}, Mercury in H${mercHouse}, Saturn in H${satHouse} & D10 Ascendant ${RASHI_NAMES_EN[d10Lagna]}`,
      verdictTe: isGovtStrong
        ? 'సూర్య-గురు బలం D1 మరియు D10 దశాంశంలో అనుకూలంగా ఉన్నందున ప్రభుత్వ పరీక్షలు (UPSC/TSPSC/APPSC/బ్యాంకింగ్) లేదా పెద్ద సంస్థల్లో మేనేజ్‌మెంట్/అడ్మినిస్ట్రేటివ్ హోదా త్వరగా లభిస్తుంది.'
        : isBizStrong
        ? 'బుధ-శుక్రుల అనుకూల స్థితి వల్ల మీకు స్వతంత్ర వ్యాపారం, ట్రేడింగ్, ఐటీ కన్సల్టింగ్ లేదా సొంత బ్రాండ్ నిర్మించే ప్రతిభ అధికంగా ఉంది.'
        : 'నిరంతర నైపుణ్య అభివృద్ధి ద్వారా మల్టీనేషనల్ కార్పొరేట్ లేదా టెక్నాలజీ రంగంలో స్థిరమైన పదోన్నతులు సాధిస్తారు.',
      verdictEn: isGovtStrong
        ? 'Strong Sun placement across D1 and D10 favors civil services, government authority, or senior institutional leadership.'
        : isBizStrong
        ? 'Strong Mercury and Venus support entrepreneurship, independent consulting, commerce, and self-built ventures.'
        : 'Steady specialist mastery in corporate technology, finance, or engineering guarantees long-term promotion.',
      bestWindowTe: 'సూర్య / గురు / బుధ అంతర్దశలలో కెరీర్ మార్పు శుభకరం.',
      bestWindowEn: 'Sun, Jupiter, or Mercury Bhuktis trigger major career breakthroughs.',
    },
    {
      topicKey: 'foreign',
      titleTe: '2. విదేశీ ప్రయాణం, వీసా/PR & ఓవర్సీస్ సంపాదన యోగం',
      titleEn: '2. Foreign Travel, Relocation & Overseas Income Potential',
      ratingLabelTe: foreignScore >= 80 ? 'బలమైన విదేశీ యోగం' : 'మధ్యమ & ప్రాజెక్ట్ ఆధారిత విదేశీ యానం',
      ratingLabelEn: foreignScore >= 80 ? 'Strong Overseas Settlement' : 'Moderate / Project-Based Travel',
      scorePercent: foreignScore,
      astrologicalBasisTe: `రాహువు ${rahuHouse}వ స్థానం · కేతువు ${ketuHouse}వ స్థానం · లగ్నం (${RASHI_NAMES_TE[lagnaIdx]})`,
      astrologicalBasisEn: `Rahu in H${rahuHouse}, Ketu in H${ketuHouse}, Lagna ${RASHI_NAMES_EN[lagnaIdx]}`,
      verdictTe:
        foreignScore >= 80
          ? '9/12 భావాలతో రాహు-శని లేదా చర రాశుల సంబంధం ఉన్నందున విదేశీ విద్య, వీసా అనుమతి మరియు విదేశీ కరెన్సీలో ఆదాయ యోగం బలంగా ఉంది.'
          : 'స్వదేశంలో ఉంటూనే విదేశీ కంపెనీలు/క్లయింట్ల ద్వారా రిమోట్‌గా లేదా స్వల్పకాలిక ఆన్‌సైట్ ప్రాజెక్టుల ద్వారా ఆదాయం పొందవచ్చు.',
      verdictEn:
        foreignScore >= 80
          ? 'Strong 9th/12th house activation and nodal ties favor overseas education, work visas, and foreign settlement.'
          : 'Remote international collaboration and short-term onsite travel fit best alongside domestic roots.',
      bestWindowTe: 'రాహు, శుక్ర లేదా 9/12వ అధిపతి అంతర్దశల్లో వీసా ప్రయత్నాలు ఫలిస్తాయి.',
      bestWindowEn: 'Rahu, Venus, or 9th/12th lord sub-periods favor visa approvals.',
    },
    {
      topicKey: 'real_estate',
      titleTe: '3. సొంత ఇల్లు, భూమి, రియల్ ఎస్టేట్ & వాహన యోగం (D4 చతుర్థాంశ విశ్లేషణ)',
      titleEn: '3. Own Home, Land & Vehicle Acquisition (D1 + D4 Chaturthamsa)',
      ratingLabelTe: isPropertyStrong ? 'స్థిరాస్తి & భూమి యోగం బలంగా ఉంది' : 'వాయిదా/ప్రణాళికాబద్ధ గృహ యోగం',
      ratingLabelEn: isPropertyStrong ? 'Strong Real Estate Yoga' : 'Planned Property Acquisition',
      scorePercent: isPropertyStrong ? 87 : 70,
      astrologicalBasisTe: `D1 కుజుడు ${marsHouse}వ స్థానం · D4 చతుర్థాంశంలో కుజుడు ${d4MarsHouse}వ భావం (${RASHI_NAMES_TE[d4Mars]})`,
      astrologicalBasisEn: `Mars in H${marsHouse} (D1) & H${d4MarsHouse} in D4 Chaturthamsa`,
      verdictTe: isPropertyStrong
        ? 'భూకారకుడైన కుజుడు మరియు చతుర్థాంశ (D4) బలం అనుకూలంగా ఉన్నందున మీ పేరుపై స్వంత ఇల్లు, ప్లాట్లు లేదా వ్యవసాయ భూమి సమకూరే యోగం ఉంది.'
        : 'రుణ సదుపాయాలు మరియు కుటుంబ సహకారంతో 30–38 ఏళ్ల మధ్యలో స్వంత గృహ నిర్మాణం/కొనుగోలు పూర్తవుతుంది.',
      verdictEn: isPropertyStrong
        ? 'Favorable Mars and D4 Chaturthamsa support owning land, residential homes, and appreciating fixed assets.'
        : 'Structured financial planning and family collaboration unlock home ownership smoothly.',
      bestWindowTe: 'కుజ, శుక్ర, చంద్ర మహాదశ/అంతర్దశలు గృహప్రవేశానికి శుభం.',
      bestWindowEn: 'Mars, Venus, or Moon sub-periods accelerate property acquisition.',
    },
    {
      topicKey: 'marriage_progeny',
      titleTe: '4. దాంపత్య సామరస్యం & సంతాన అభివృద్ధి (D9 నవాంశ + D7 సప్తాంశ తీర్పు)',
      titleEn: '4. Marital Harmony & Progeny Blessings (D9 + D7 Saptamsa)',
      ratingLabelTe: [1, 4, 5, 7, 9, 10, 11].includes(d7JupH) ? 'శుభ సంతాన & దాంపత్య సౌఖ్యం' : 'ధార్మిక & సహన దాంపత్య యోగం',
      ratingLabelEn: [1, 4, 5, 7, 9, 10, 11].includes(d7JupH) ? 'Blessed Progeny & Harmony' : 'Patient & Sacred Partnership',
      scorePercent: [1, 4, 5, 7, 9, 10, 11].includes(d7JupH) ? 86 : 74,
      astrologicalBasisTe: `D1 శుక్రుడు ${venHouse}వ భావం · D7 సప్తాంశంలో గురుడు ${d7JupH}వ స్థానం`,
      astrologicalBasisEn: `Venus in H${venHouse} (D1) · Jupiter in H${d7JupH} in D7 Saptamsa`,
      verdictTe:
        [1, 4, 5, 7, 9, 10, 11].includes(d7JupH)
          ? 'సప్తాంశ చక్రంలో పుత్రకారకుడైన గురుడు శుభ స్థానంలో ఉన్నందున బుద్ధిమంతులైన సంతానం, వారి వల్ల తల్లిదండ్రులకు గౌరవం లభిస్తుంది.'
          : 'వివాహ పొంతనలో నాడీ/కుజ పరిశీలన మరియు సంతాన గోపాల మంత్ర స్మరణ ద్వారా కుటుంబ సౌఖ్యం పెరుగుతుంది.',
      verdictEn:
        [1, 4, 5, 7, 9, 10, 11].includes(d7JupH)
          ? 'Auspicious Jupiter placement in D7 Saptamsa indicates bright children who bring family pride.'
          : 'Thoughtful match compatibility and mutual patience strengthen marital stability.',
      bestWindowTe: 'గురు లేదా శుక్ర అంతర్దశలలో వివాహ & సంతాన శుభవార్తలు.',
      bestWindowEn: 'Jupiter or Venus Bhuktis bring auspicious family milestones.',
    },
    {
      topicKey: 'investments',
      titleTe: '5. స్టాక్ మార్కెట్ / మ్యూచువల్ ఫండ్స్ vs బంగారం-భూమి పొదుపు',
      titleEn: '5. Investments: Equities & Long-Term Wealth vs Gold & Real Assets',
      ratingLabelTe: isSpeculationStrong ? 'దీర్ఘకాలిక ఈక్విటీ & పోర్ట్‌ఫోలియో యోగం' : 'సురక్షిత బంగారం / FD / భూమి పొదుపు శ్రేష్టం',
      ratingLabelEn: isSpeculationStrong ? 'Long-Term Growth Portfolio' : 'Safe Bullion / Fixed Assets Best',
      scorePercent: isSpeculationStrong ? 82 : 76,
      astrologicalBasisTe: `గురుడు ${jupHouse}వ స్థానం · బుధుడు ${mercHouse}వ స్థానం · రాహువు ${rahuHouse}వ స్థానం`,
      astrologicalBasisEn: `Jupiter H${jupHouse} · Mercury H${mercHouse} · Rahu H${rahuHouse}`,
      verdictTe: isSpeculationStrong
        ? '2-5-11 భావాలకు గురు-బుధ బలం ఉన్నందున దీర్ఘకాలిక మ్యూచువల్ ఫండ్స్, ఇండెక్స్ ఇన్వెస్టింగ్ & బంగారం ద్వారా స్థిర సంపద పెరుగుతుంది (ఇంట్రాడే గ్యాంబ్లింగ్ మానుకోండి).'
        : 'రాహు ప్రభావం వల్ల అస్థిర ఇంట్రాడే ట్రేడింగ్ కంటే బంగారం, స్థిరాస్తులు మరియు గ్యారంటీ రిటర్న్ పథకాల్లో పెట్టుబడి అత్యంత సురక్షితం.',
      verdictEn: isSpeculationStrong
        ? 'Long-term equity SIPs and blue-chip compounding suit your chart best (avoid high-risk intraday leverage).'
        : 'Tangible assets like gold, land, and sovereign bonds outperform speculative trading in your chart.',
      bestWindowTe: 'గురు బలం ఉన్న గురువారాలు లేదా లాభ స్థాన దశలు శుభం.',
      bestWindowEn: 'Initiate major investments during strong Jupiter or 11th lord transits.',
    },
    {
      topicKey: 'd60_karma',
      titleTe: `6. D60 షష్ట్యంశ పూర్వజన్మ దేవతా ఫలం — "${deityObj.te}" అంశం`,
      titleEn: `6. D60 Shashtiamsa Past-Life Deity — "${deityObj.en}"`,
      ratingLabelTe: deityObj.benef ? 'శుభ షష్ట్యంశ అంశం (సాత్విక కర్మ)' : 'కర్మ శోధన & ధైర్య అంశం',
      ratingLabelEn: deityObj.benef ? 'Benefic Shashtiamsa Grace' : 'Karmic Mastery Lineage',
      scorePercent: deityObj.benef ? 91 : 73,
      astrologicalBasisTe: `లగ్న D60 షష్ట్యంశ విభాగం #${lagnaD60Part + 1}/60 · దేవత: ${deityObj.te} (${deityObj.en})`,
      astrologicalBasisEn: `Ascendant D60 Division #${lagnaD60Part + 1}/60 · Deity: ${deityObj.en}`,
      verdictTe: `${deityObj.descTe}. ఈ జన్మలో మీ అంతరాత్మ ప్రయాణం ధర్మం, వివేకం మరియు సేవా భావం ద్వారా అత్యున్నత తృప్తిని పొందుతుంది.`,
      verdictEn: `${deityObj.descEn}. Your soul journey thrives on integrity, self-awareness, and purposeful service.`,
      bestWindowTe: 'నిత్య ఇష్టదేవతా స్మరణ పూర్వజన్మ పుణ్యాన్ని జాగృతం చేస్తుంది.',
      bestWindowEn: 'Daily meditation on your Ishta Devata unlocks dormant karmic merit.',
    },
  ];

  return {
    charaDashaList,
    activeCharaDasha,
    shadbalaRows,
    strongestShadbalaPlanetTe,
    fiveYearTransits,
    sadeSati,
    practicalVerdicts,
    d60Deity: {
      index: lagnaD60Part + 1,
      nameTe: deityObj.te,
      nameEn: deityObj.en,
      natureTe: deityObj.benef ? 'శుభ సాత్విక అంశం' : 'తపో / కర్మ సాధన అంశం',
      natureEn: deityObj.benef ? 'Benefic Sattvic Amsha' : 'Karmic Discipline Amsha',
      karmicMessageTe: deityObj.descTe,
      karmicMessageEn: deityObj.descEn,
    },
  };
}
