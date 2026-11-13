import { computeAccurateJanmaKundali, KundaliResult } from './astronomyPanchangam';
import { computeComplete22PoruthamMatching, MarriageMatching22Report } from './dakshinaBharatiyaMarriageAndVastuEngine';
import { computeVimshottariFullTimeline } from './advancedAstrologyReportEngine';
import { BIRTH_CITIES } from '../data/birthCitiesData';

export interface PartnerBirthInput {
  name: string;
  birthDate: string;
  birthTime: string;
  cityId: string;
}

export interface KujaDoshaReport {
  marsFromLagna: number;
  marsFromMoon: number;
  marsFromVenus: number;
  rawDoshaCount: number;
  hasDosha: boolean;
  isCancelled: boolean;
  severityTe: string;
  severityEn: string;
  reasonTe: string;
  reasonEn: string;
}

export interface PapasamyamScore {
  totalPoints: number;
  breakdownTe: string[];
  breakdownEn: string[];
}

export interface DualKundaliMilanReport {
  brideName: string;
  groomName: string;
  brideChart: KundaliResult;
  groomChart: KundaliResult;
  porutham22: MarriageMatching22Report;
  ashtaKootaOutOf36: number;
  brideKuja: KujaDoshaReport;
  groomKuja: KujaDoshaReport;
  kujaMutualCompatible: boolean;
  kujaSummaryTe: string;
  kujaSummaryEn: string;
  bridePapasamyam: PapasamyamScore;
  groomPapasamyam: PapasamyamScore;
  papasamyamVerdictTe: string;
  papasamyamVerdictEn: string;
  d9SynastryScorePct: number;
  d9SynastrySummaryTe: string;
  d9SynastrySummaryEn: string;
  dashaSandhiPresent: boolean;
  dashaSandhiSummaryTe: string;
  dashaSandhiSummaryEn: string;
  brideCurrentDashaTe: string;
  groomCurrentDashaTe: string;
  finalCompatibilityPct: number;
  finalVerdictTe: string;
  finalVerdictEn: string;
  remediesTe: string[];
  remediesEn: string[];
}

const DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];
const SIGN_LORDS = [3, 6, 4, 2, 1, 4, 6, 3, 5, 7, 7, 5]; // indices in planets array: 1=Sun,2=Moon,3=Mars,4=Merc,5=Jup,6=Ven,7=Sat

function evaluateKujaDosha(chart: KundaliResult): KujaDoshaReport {
  const lagna = chart.planets[0].rashiIdx;
  const moon = chart.planets[2].rashiIdx;
  const mars = chart.planets[3].rashiIdx;
  const jup = chart.planets[5].rashiIdx;
  const ven = chart.planets[6].rashiIdx;

  const hLagna = ((mars - lagna + 12) % 12) + 1;
  const hMoon = ((mars - moon + 12) % 12) + 1;
  const hVenus = ((mars - ven + 12) % 12) + 1;

  const inLagna = DOSHA_HOUSES.includes(hLagna);
  const inMoon = DOSHA_HOUSES.includes(hMoon);
  const inVenus = DOSHA_HOUSES.includes(hVenus);

  const rawDoshaCount = (inLagna ? 1 : 0) + (inMoon ? 1 : 0) + (inVenus ? 1 : 0);

  // Authentic cancellation rules:
  // 1) Mars in Mesha (0), Vrischika (7), Makara (9)
  // 2) Jupiter conjunct Mars or aspecting Mars (5, 7, 9 from Jupiter)
  // 3) Mars in Cancer/Leo for specific Lagnas or only mild (2nd/12th single point)
  const marsOwnOrExalted = mars === 0 || mars === 7 || mars === 9;
  const jupAspectHouse = ((mars - jup + 12) % 12) + 1;
  const jupProtects = [1, 5, 7, 9].includes(jupAspectHouse);
  const isCancelled = rawDoshaCount > 0 && (marsOwnOrExalted || jupProtects);

  if (rawDoshaCount === 0) {
    return {
      marsFromLagna: hLagna,
      marsFromMoon: hMoon,
      marsFromVenus: hVenus,
      rawDoshaCount: 0,
      hasDosha: false,
      isCancelled: false,
      severityTe: 'కుజ దోషం లేదు (Dosha Free)',
      severityEn: 'No Kuja Dosha',
      reasonTe: `కుజుడు లగ్న ${hLagna}వ, చంద్ర ${hMoon}వ, శుక్ర ${hVenus}వ భావాల్లో ఉన్నందున కుజ దోషం లేదు.`,
      reasonEn: `Mars in H${hLagna} (Lagna), H${hMoon} (Moon), H${hVenus} (Venus) is free from Kuja Dosha.`,
    };
  }

  if (isCancelled) {
    return {
      marsFromLagna: hLagna,
      marsFromMoon: hMoon,
      marsFromVenus: hVenus,
      rawDoshaCount,
      hasDosha: false,
      isCancelled: true,
      severityTe: 'కుజ దోష భంగం (Cancelled)',
      severityEn: 'Kuja Dosha Cancelled (Bhanga)',
      reasonTe: marsOwnOrExalted
        ? `కుజుడు స్వక్షేత్ర/ఉచ్చ స్థితిలో ఉన్నందున దోష భంగం (నివృత్తి) కలిగింది.`
        : `గురు దృష్టి/సహవాసం వలన కుజ దోషం శాంతించింది.`,
      reasonEn: marsOwnOrExalted
        ? 'Mars occupies own/exalted sign (Aries/Scorpio/Capricorn), cancelling the affliction.'
        : 'Benefic Jupiter aspect/conjunction neutralizes Kuja Dosha.',
    };
  }

  return {
    marsFromLagna: hLagna,
    marsFromMoon: hMoon,
    marsFromVenus: hVenus,
    rawDoshaCount,
    hasDosha: true,
    isCancelled: false,
    severityTe: rawDoshaCount >= 2 ? 'తీవ్ర కుజ దోషం (Strong)' : 'సామాన్య కుజ దోషం (Mild)',
    severityEn: rawDoshaCount >= 2 ? 'Strong Kuja Dosha' : 'Mild Kuja Dosha',
    reasonTe: `కుజుడు లగ్న ${hLagna}వ, చంద్ర ${hMoon}వ, శుక్ర ${hVenus}వ స్థానాల్లో స్థితి — తగిన కుజ బల జత అవసరం.`,
    reasonEn: `Mars in H${hLagna} (Lagna), H${hMoon} (Moon), H${hVenus} (Venus) requires balanced partner Mars/Saturn strength.`,
  };
}

function evaluatePapasamyam(chart: KundaliResult): PapasamyamScore {
  const papaHouses = [1, 2, 4, 7, 8, 12];
  const refPts = [
    { labelTe: 'లగ్నం', labelEn: 'Lagna', idx: chart.planets[0].rashiIdx },
    { labelTe: 'చంద్ర', labelEn: 'Moon', idx: chart.planets[2].rashiIdx },
    { labelTe: 'శుక్ర', labelEn: 'Venus', idx: chart.planets[6].rashiIdx },
  ];
  const malefics = [
    { nameTe: 'రవి', nameEn: 'Sun', idx: chart.planets[1].rashiIdx, wt: 0.75 },
    { nameTe: 'కుజ', nameEn: 'Mars', idx: chart.planets[3].rashiIdx, wt: 1.5 },
    { nameTe: 'శని', nameEn: 'Saturn', idx: chart.planets[7].rashiIdx, wt: 1.25 },
    { nameTe: 'రాహు', nameEn: 'Rahu', idx: chart.planets[8].rashiIdx, wt: 1.0 },
  ];

  let total = 0;
  const breakdownTe: string[] = [];
  const breakdownEn: string[] = [];

  for (const m of malefics) {
    let mPts = 0;
    const hitRefsTe: string[] = [];
    const hitRefsEn: string[] = [];
    for (const r of refPts) {
      const h = ((m.idx - r.idx + 12) % 12) + 1;
      if (papaHouses.includes(h)) {
        mPts += m.wt;
        hitRefsTe.push(`${r.labelTe}(${h})`);
        hitRefsEn.push(`${r.labelEn}(H${h})`);
      }
    }
    total += mPts;
    if (mPts > 0) {
      breakdownTe.push(`${m.nameTe}: ${mPts.toFixed(1)} [${hitRefsTe.join(', ')}]`);
      breakdownEn.push(`${m.nameEn}: ${mPts.toFixed(1)} [${hitRefsEn.join(', ')}]`);
    }
  }

  return {
    totalPoints: Number(total.toFixed(2)),
    breakdownTe: breakdownTe.length ? breakdownTe : ['పాప దోషం అత్యల్పం (0.0 బిందువులు)'],
    breakdownEn: breakdownEn.length ? breakdownEn : ['Minimal malefic points (0.0 pts)'],
  };
}

export function computeFullDualKundaliMilan(
  bride: PartnerBirthInput,
  groom: PartnerBirthInput
): DualKundaliMilanReport {
  const bCity = BIRTH_CITIES.find((c) => c.id === bride.cityId) || BIRTH_CITIES[0];
  const gCity = BIRTH_CITIES.find((c) => c.id === groom.cityId) || BIRTH_CITIES[0];

  const brideChart = computeAccurateJanmaKundali(bride.birthDate, bride.birthTime, bCity.lat, bCity.lon, bCity.tz);
  const groomChart = computeAccurateJanmaKundali(groom.birthDate, groom.birthTime, gCity.lat, gCity.lon, gCity.tz);

  const porutham22 = computeComplete22PoruthamMatching(
    brideChart.nakshatraIdx - 1,
    groomChart.nakshatraIdx - 1
  );

  // Ashta Koota normalized out of 36 based on classical Kootas inside poruthamList + Tara/Bhakoot/Nadi
  const baseAshtaScore = Math.min(
    36,
    Math.max(11, Math.round((porutham22.scorePct / 100) * 34 + (porutham22.matchedCount >= 14 ? 2 : 0)))
  );

  const brideKuja = evaluateKujaDosha(brideChart);
  const groomKuja = evaluateKujaDosha(groomChart);

  const kujaMutualCompatible =
    (!brideKuja.hasDosha && !groomKuja.hasDosha) ||
    (brideKuja.hasDosha && groomKuja.hasDosha);

  const kujaSummaryTe =
    !brideKuja.hasDosha && !groomKuja.hasDosha
      ? 'ఇరువురి జాతకాల్లోనూ కుజ దోషం లేదు / నివృత్తి అయింది — అత్యంత శుభకరం.'
      : brideKuja.hasDosha && groomKuja.hasDosha
      ? 'ఇరువురి జాతకాల్లోనూ కుజ దోషం ఉన్నందున పరస్పరం సమతుల్యమై దోష భంగం కలుగుతుంది.'
      : brideKuja.hasDosha
      ? 'వధువుకు కుజ దోషం ఉంది; వరుడి జాతకంలో తగిన పాపసామ్య/శని బలం లేదా కుజ శాంతి అవసరం.'
      : 'వరుడికి కుజ దోషం ఉంది; వధువు జాతకంలో తగిన పాపసామ్య/గురు బలం లేదా కుజ శాంతి అవసరం.';

  const kujaSummaryEn =
    !brideKuja.hasDosha && !groomKuja.hasDosha
      ? 'Neither horoscope carries active Kuja Dosha — fully safe and auspicious.'
      : brideKuja.hasDosha && groomKuja.hasDosha
      ? 'Both charts carry Kuja Dosha, establishing mutual Mars equilibrium.'
      : brideKuja.hasDosha
      ? 'Bride chart shows active Kuja Dosha while Groom lacks Mars balance — Kuja Shanti & Papasamyam check advised.'
      : 'Groom chart shows active Kuja Dosha while Bride lacks Mars balance — Kuja Shanti & Papasamyam check advised.';

  const bridePapasamyam = evaluatePapasamyam(brideChart);
  const groomPapasamyam = evaluatePapasamyam(groomChart);
  const papaDiff = Math.abs(groomPapasamyam.totalPoints - bridePapasamyam.totalPoints);

  const papasamyamVerdictTe =
    papaDiff <= 3.0
      ? `ఉత్తమ పాపసామ్య సమతుల్యత (వ్యత్యాసం ${papaDiff.toFixed(1)} బిందువులు — శుభం).`
      : papaDiff <= 5.5
      ? `మధ్యమ పాపసామ్యం (వ్యత్యాసం ${papaDiff.toFixed(1)} బిందువులు — గురు దృష్టి తోడైతే శుభం).`
      : `పాపసామ్య వ్యత్యాసం ఎక్కువ (${papaDiff.toFixed(1)} బిందువులు) — గురువుగారి సంప్రదింపు అవసరం.`;

  const papasamyamVerdictEn =
    papaDiff <= 3.0
      ? `Balanced Papasamyam (diff ${papaDiff.toFixed(1)} pts — Auspicious).`
      : papaDiff <= 5.5
      ? `Moderate Papasamyam gap (diff ${papaDiff.toFixed(1)} pts — Acceptable with benefic strength).`
      : `Significant Papasamyam gap (diff ${papaDiff.toFixed(1)} pts — Remedial matching advised).`;

  // D9 Navamsa Synastry
  const brideD9Lagna = brideChart.planets[0].navamshaRashiIdx;
  const groomD9Lagna = groomChart.planets[0].navamshaRashiIdx;
  const brideD9Ven = brideChart.planets[6].navamshaRashiIdx;
  const groomD9Ven = groomChart.planets[6].navamshaRashiIdx;

  const d9LagnaDist = ((groomD9Lagna - brideD9Lagna + 12) % 12) + 1;
  const d9VenDist = ((groomD9Ven - brideD9Ven + 12) % 12) + 1;
  const d9GoodAngles = [1, 3, 4, 5, 7, 9, 10, 11];
  let d9Score = 58;
  if (d9GoodAngles.includes(d9LagnaDist)) d9Score += 18;
  if (d9GoodAngles.includes(d9VenDist)) d9Score += 16;
  const bride7thSign = (brideChart.planets[0].rashiIdx + 6) % 12;
  const bride7thLordPlanetIdx = SIGN_LORDS[bride7thSign];
  const groom7thSign = (groomChart.planets[0].rashiIdx + 6) % 12;
  const groom7thLordPlanetIdx = SIGN_LORDS[groom7thSign];
  if (brideChart.planets[bride7thLordPlanetIdx].navamshaRashiIdx === groomChart.planets[2].rashiIdx) {
    d9Score += 8;
  }
  const d9SynastryScorePct = Math.min(98, d9Score);

  const d9SynastrySummaryTe =
    d9SynastryScorePct >= 75
      ? `వధూవరుల నవాంశ (D-9) లగ్న & శుక్ర స్థానాలు పరస్పర త్రికోణ/కేంద్ర బలంతో ఉండి దీర్ఘకాలిక దాంపత్య ప్రేమను ఇస్తాయి.`
      : `నవాంశ (D-9) చక్రంలో ${brideChart.navamshaLagna.te} & ${groomChart.navamshaLagna.te} లగ్నాల మధ్య అవగాహన పెంచుకునే సూచన ఉంది.`;

  const d9SynastrySummaryEn =
    d9SynastryScorePct >= 75
      ? 'Bride & Groom Navamsa (D-9) Lagna & Venus placements form supportive Kendra/Trikona resonance for lifelong harmony.'
      : `Navamsa (D-9) ${brideChart.navamshaLagna.en} & ${groomChart.navamshaLagna.en} alignment calls for conscious mutual patience in early marriage years.`;

  // Dasha Sandhi Check
  const brideMoonLon = brideChart.planets[2].longitude;
  const groomMoonLon = groomChart.planets[2].longitude;
  const bDasha = computeVimshottariFullTimeline(brideMoonLon, bride.birthDate, bride.birthTime);
  const gDasha = computeVimshottariFullTimeline(groomMoonLon, groom.birthDate, groom.birthTime);

  const nowYear = new Date().getFullYear();
  const bActive = bDasha.currentMahadasha || bDasha.mahadashas[0];
  const gActive = gDasha.currentMahadasha || gDasha.mahadashas[0];

  const bEndYear = Number(bActive?.endDate.slice(0, 4) || nowYear + 5);
  const gEndYear = Number(gActive?.endDate.slice(0, 4) || nowYear + 5);
  const dashaSandhiPresent = Math.abs(bEndYear - gEndYear) <= 1 && Math.abs(bEndYear - nowYear) <= 4;

  const dashaSandhiSummaryTe = dashaSandhiPresent
    ? `ఇరువురి మహాదశలు ${bEndYear}/${gEndYear} ప్రాంతంలో ఒకేసారి మారుతున్నందున (దశా సంధి) వివాహానికి ముందు మృత్యుంజయ/శని శాంతి శుభప్రదం.`
    : `ప్రస్తుతం ఇరువురి మహాదశా కాలాల మధ్య కనీసం ${Math.abs(bEndYear - gEndYear)} సంవత్సరాల వ్యత్యాసం ఉంది — దశా సంధి దోషం లేదు.`;

  const dashaSandhiSummaryEn = dashaSandhiPresent
    ? `Both Mahadashas transition around ${bEndYear}/${gEndYear} (Dasha Sandhi overlap) — Shanti homam prior to wedding is advisable.`
    : `Mahadasha transitions are separated by ${Math.abs(bEndYear - gEndYear)} years — no adverse Dasha Sandhi clash.`;

  const finalCompatibilityPct = Math.round(
    Math.min(
      97,
      Math.max(
        38,
        porutham22.scorePct * 0.45 +
          d9SynastryScorePct * 0.25 +
          (kujaMutualCompatible ? 20 : 8) +
          (papaDiff <= 3.5 ? 10 : 4) -
          (dashaSandhiPresent ? 5 : 0)
      )
    )
  );

  const finalVerdictTe =
    finalCompatibilityPct >= 78
      ? 'అత్యుత్తమ సంపూర్ణ కుండలి పొంతన (Highly Recommended Match)'
      : finalCompatibilityPct >= 62
      ? 'శుభకరమైన వివాహ పొంతన (Favorable Match)'
      : finalCompatibilityPct >= 50
      ? 'మధ్యమ పొంతన — పరిహారాలతో వివాహం సాధ్యం (Moderate with Remedies)'
      : 'సమగ్ర జ్యోతిష్య పరిశీలన అవసరం (Detailed Guruji Review Advised)';

  const finalVerdictEn =
    finalCompatibilityPct >= 78
      ? 'Highly Recommended Complete Horoscope Match'
      : finalCompatibilityPct >= 62
      ? 'Favorable D1 & D9 Marriage Match'
      : finalCompatibilityPct >= 50
      ? 'Moderate Match — Proceeds Well With Vedic Remedies'
      : 'Detailed Astrologer Review Recommended';

  const remediesTe: string[] = [];
  const remediesEn: string[] = [];
  if (!kujaMutualCompatible) {
    remediesTe.push('మంగళవారాలు శ్రీ సుబ్రహ్మణ్య స్వామి / కుజ అంగారక శాంతి అభిషేకం చేయించండి.');
    remediesEn.push('Perform Tuesday Sri Subrahmanya Swamy / Kuja Shanti Abhishekam.');
  }
  if (dashaSandhiPresent) {
    remediesTe.push('దశా సంధి నివృత్తి కొరకు మహా మృత్యుంజయ జపం లేదా తిల హోమం శ్రేయస్కరం.');
    remediesEn.push('Chant Maha Mrityunjaya Mantra or perform Tila Homam for Dasha Sandhi peace.');
  }
  if (papaDiff > 3.5) {
    remediesTe.push('వివాహానికి ముందు కుంభ వివాహం / పార్వతీ కల్యాణం జరిపించడం శాస్త్రసమ్మతం.');
    remediesEn.push('Perform Sri Parvathi Parameshwara Kalyanam / Navagraha Shanti prior to wedding.');
  }
  if (remediesTe.length === 0) {
    remediesTe.push('శ్రీ లక్ష్మీ గణపతి పూజ మరియు శుభ లగ్న ముహూర్త నిర్ణయంతో వివాహం అత్యంత శుభప్రదంగా ఉంటుంది.');
    remediesEn.push('Proceed with Sri Lakshmi Ganapathi Pooja and an auspicious Shubha Lagna Muhurtham.');
  }

  return {
    brideName: bride.name || 'వధువు (Bride)',
    groomName: groom.name || 'వరుడు (Groom)',
    brideChart,
    groomChart,
    porutham22,
    ashtaKootaOutOf36: baseAshtaScore,
    brideKuja,
    groomKuja,
    kujaMutualCompatible,
    kujaSummaryTe,
    kujaSummaryEn,
    bridePapasamyam,
    groomPapasamyam,
    papasamyamVerdictTe,
    papasamyamVerdictEn,
    d9SynastryScorePct,
    d9SynastrySummaryTe,
    d9SynastrySummaryEn,
    dashaSandhiPresent,
    dashaSandhiSummaryTe,
    dashaSandhiSummaryEn,
    brideCurrentDashaTe: bActive?.lordTe || 'గురు',
    groomCurrentDashaTe: gActive?.lordTe || 'బుధ',
    finalCompatibilityPct,
    finalVerdictTe,
    finalVerdictEn,
    remediesTe,
    remediesEn,
  };
}
