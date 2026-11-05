import { KundaliPlanetDetail } from './astronomyPanchangam';

export interface NaadiRuleCard {
  id: string;
  ruleNoTe: string;
  ruleNoEn: string;
  badgeTe: string;
  badgeEn: string;
  titleTe: string;
  titleEn: string;
  accurateYearsTe: string;
  accurateYearsEn: string;
  analysisTe: string;
  analysisEn: string;
  practicalKeyTe: string;
  practicalKeyEn: string;
}

export interface FastPlanetTransitCard {
  id: string;
  transitPlanetTe: string;
  transitPlanetEn: string;
  natalTargetTe: string;
  natalTargetEn: string;
  accurateTimingWindowTe: string;
  accurateTimingWindowEn: string;
  effectSummaryTe: string;
  effectSummaryEn: string;
  timingAndHoraAdviceTe: string;
  timingAndHoraAdviceEn: string;
  remedyTe: string;
  remedyEn: string;
}

export interface SlowPlanetNaadiTransitCard {
  planetId: string;
  natalPlanetTe: string;
  natalPlanetEn: string;
  natalRashiTe: string;
  natalRashiEn: string;
  natalDegree: string;
  trineRashisTe: string;
  trineRashisEn: string;
  yogaTitleTe: string;
  yogaTitleEn: string;
  accurateYearsBadgeTe: string;
  accurateYearsBadgeEn: string;
  accurateYearsDetailTe: string;
  accurateYearsDetailEn: string;
  primaryTransitTe: string;
  primaryTransitEn: string;
  destinyBreakersTe: string;
  destinyBreakersEn: string;
  lifeMattersTe: string;
  lifeMattersEn: string;
  remedyTe: string;
  remedyEn: string;
}

export interface NaadiLifeDiagnosticsCard {
  id: string;
  categoryTe: string;
  categoryEn: string;
  badgeTe: string;
  badgeEn: string;
  titleTe: string;
  titleEn: string;
  accurateYearsTe: string;
  accurateYearsEn: string;
  detailsTe: string;
  detailsEn: string;
  remedyOrActionTe: string;
  remedyOrActionEn: string;
}

export interface NaadiGemAndRemedyCard {
  id: string;
  badgeTe: string;
  badgeEn: string;
  titleTe: string;
  titleEn: string;
  sankalpaPurposeTe: string;
  sankalpaPurposeEn: string;
  explanationTe: string;
  explanationEn: string;
  procedureTe: string;
  procedureEn: string;
}

export interface CompleteNaadiTransitReport {
  chapter11Rules: NaadiRuleCard[];
  chapter12FastPart1: FastPlanetTransitCard[]; // Sun, Moon, Mars
  chapter12FastPart2: FastPlanetTransitCard[]; // Mercury, Venus + Hora
  chapter13Jupiter: SlowPlanetNaadiTransitCard[]; // 9 Natal Planets (5 on Page 20, 4 on Page 21)
  chapter14Saturn: SlowPlanetNaadiTransitCard[]; // 9 Natal Planets (5 on Page 22, 4 on Page 23)
  chapter15Rahu: SlowPlanetNaadiTransitCard[]; // 9 Natal Planets (5 on Page 24, 4 on Page 25)
  chapter16Ketu: SlowPlanetNaadiTransitCard[]; // 9 Natal Planets (5 on Page 26, 4 on Page 27)
  chapter17Diagnostics: NaadiLifeDiagnosticsCard[]; // Page 28: Vastu, Food, Dream Visuals, Ayurveda
  chapter18GemsAndCowRemedies: NaadiGemAndRemedyCard[]; // Page 29: Gems, Purpose Rules, Diamond Cents, Go-Grasa
}

const RASHI_NAMES: {
  te: string;
  en: string;
  elementTe: string;
  directionTe: string;
  solarMonthTe: string;
  solarMonthEn: string;
}[] = [
  { te: 'మేషం', en: 'Aries', elementTe: 'అగ్ని తత్వం (తూర్పు)', directionTe: 'తూర్పు దిశ', solarMonthTe: 'ఏప్రిల్ 14 – మే 14', solarMonthEn: 'Apr 14 – May 14' },
  { te: 'వృషభం', en: 'Taurus', elementTe: 'భూ తత్వం (దక్షిణం)', directionTe: 'దక్షిణ దిశ', solarMonthTe: 'మే 15 – జూన్ 14', solarMonthEn: 'May 15 – Jun 14' },
  { te: 'మిథునం', en: 'Gemini', elementTe: 'వాయు తత్వం (పడమర)', directionTe: 'పడమర దిశ', solarMonthTe: 'జూన్ 15 – జూలై 15', solarMonthEn: 'Jun 15 – Jul 15' },
  { te: 'కర్కాటకం', en: 'Cancer', elementTe: 'జల తత్వం (ఉత్తరం)', directionTe: 'ఉత్తర దిశ', solarMonthTe: 'జూలై 16 – ఆగస్టు 16', solarMonthEn: 'Jul 16 – Aug 16' },
  { te: 'సింహం', en: 'Leo', elementTe: 'అగ్ని తత్వం (తూర్పు)', directionTe: 'తూర్పు దిశ', solarMonthTe: 'ఆగస్టు 17 – సెప్టెంబర్ 16', solarMonthEn: 'Aug 17 – Sep 16' },
  { te: 'కన్య', en: 'Virgo', elementTe: 'భూ తత్వం (దక్షిణం)', directionTe: 'దక్షిణ దిశ', solarMonthTe: 'సెప్టెంబర్ 17 – అక్టోబర్ 16', solarMonthEn: 'Sep 17 – Oct 16' },
  { te: 'తుల', en: 'Libra', elementTe: 'వాయు తత్వం (పడమర)', directionTe: 'పడమర దిశ', solarMonthTe: 'అక్టోబర్ 17 – నవంబర్ 15', solarMonthEn: 'Oct 17 – Nov 15' },
  { te: 'వృశ్చికం', en: 'Scorpio', elementTe: 'జల తత్వం (ఉత్తరం)', directionTe: 'ఉత్తర దిశ', solarMonthTe: 'నవంబర్ 16 – డిసెంబర్ 15', solarMonthEn: 'Nov 16 – Dec 15' },
  { te: 'ధనుస్సు', en: 'Sagittarius', elementTe: 'అగ్ని తత్వం (తూర్పు)', directionTe: 'తూర్పు దిశ', solarMonthTe: 'డిసెంబర్ 16 – జనవరి 13', solarMonthEn: 'Dec 16 – Jan 13' },
  { te: 'మకరం', en: 'Capricorn', elementTe: 'భూ తత్వం (దక్షిణం)', directionTe: 'దక్షిణ దిశ', solarMonthTe: 'జనవరి 14 – ఫిబ్రవరి 12', solarMonthEn: 'Jan 14 – Feb 12' },
  { te: 'కుంభం', en: 'Aquarius', elementTe: 'వాయు తత్వం (పడమర)', directionTe: 'పడమర దిశ', solarMonthTe: 'ఫిబ్రవరి 13 – మార్చి 13', solarMonthEn: 'Feb 13 – Mar 13' },
  { te: 'మీనం', en: 'Pisces', elementTe: 'జల తత్వం (ఉత్తరం)', directionTe: 'ఉత్తర దిశ', solarMonthTe: 'మార్చి 14 – ఏప్రిల్ 13', solarMonthEn: 'Mar 14 – Apr 13' },
];

function getTrineRashisLabel(rashiIdx: number): { te: string; en: string } {
  const r1 = RASHI_NAMES[rashiIdx % 12];
  const r5 = RASHI_NAMES[(rashiIdx + 4) % 12];
  const r9 = RASHI_NAMES[(rashiIdx + 8) % 12];
  return {
    te: `${r1.te}, ${r5.te}, ${r9.te}`,
    en: `${r1.en}, ${r5.en}, ${r9.en}`,
  };
}

/**
 * Computes exact calendar years & native's ages when Transit Jupiter (గురువు)
 * transits over the target Natal Rashi (1st), its 5th & 9th Trines, and 7th House.
 * Base Astronomical Reference:
 * - 2025–2026 (May 2025 – May 2026): Mithunam (rashiIdx = 2)
 * - 2026–2027 (Jun 2026 – Jun 2027): Karkatakam (rashiIdx = 3)
 * - Advances +1 Rashi per year.
 */
function computeJupiterTransitYears(targetRashiIdx: number, birthYear: number) {
  const getJupiterYearForRashi = (rIdx: number, cycleOffset = 0): number => {
    const offsetFromMithunam = ((rIdx - 2) % 12 + 12) % 12;
    return 2025 + offsetFromMithunam + cycleOffset * 12;
  };

  const directY1 = getJupiterYearForRashi(targetRashiIdx, 0);
  const directY2 = getJupiterYearForRashi(targetRashiIdx, 1);
  const age1 = Math.max(1, directY1 - birthYear);
  const age2 = Math.max(1, directY2 - birthYear);

  // Trine (1, 5, 9) and 7th activation years between 2025 and 2038
  const trine1Idx = targetRashiIdx % 12;
  const trine5Idx = (targetRashiIdx + 4) % 12;
  const trine9Idx = (targetRashiIdx + 8) % 12;
  const opp7Idx = (targetRashiIdx + 6) % 12;

  const activeYears: { year: number; rashiTe: string; rashiEn: string; relTe: string; relEn: string }[] = [];
  for (let y = 2025; y <= 2037; y++) {
    const jupRashiInYear = (2 + (y - 2025)) % 12;
    if (jupRashiInYear === trine1Idx) {
      activeYears.push({
        year: y,
        rashiTe: RASHI_NAMES[jupRashiInYear].te,
        rashiEn: RASHI_NAMES[jupRashiInYear].en,
        relTe: 'జన్మ గ్రహ రాశిపై (1వ స్థానం)',
        relEn: 'Direct on Natal Sign (1H)',
      });
    } else if (jupRashiInYear === trine5Idx) {
      activeYears.push({
        year: y,
        rashiTe: RASHI_NAMES[jupRashiInYear].te,
        rashiEn: RASHI_NAMES[jupRashiInYear].en,
        relTe: 'పంచమ కోణంలో (5వ స్థానం)',
        relEn: '5th Trine Sign (5H)',
      });
    } else if (jupRashiInYear === trine9Idx) {
      activeYears.push({
        year: y,
        rashiTe: RASHI_NAMES[jupRashiInYear].te,
        rashiEn: RASHI_NAMES[jupRashiInYear].en,
        relTe: 'భాగ్య కోణంలో (9వ స్థానం)',
        relEn: '9th Trine Sign (9H)',
      });
    } else if (jupRashiInYear === opp7Idx) {
      activeYears.push({
        year: y,
        rashiTe: RASHI_NAMES[jupRashiInYear].te,
        rashiEn: RASHI_NAMES[jupRashiInYear].en,
        relTe: 'సప్తమ దృష్టి (7వ స్థానం)',
        relEn: '7th Aspect Sign (7H)',
      });
    }
  }

  const topWindows = activeYears.slice(0, 4);
  const badgeTe = `ఖచ్చితమైన ఫలిత సంవత్సరాలు: ${topWindows.map((w) => `${w.year}–${w.year + 1}`).join(', ')}`;
  const badgeEn = `Exact Manifestation Years: ${topWindows.map((w) => `${w.year}–${w.year + 1}`).join(', ')}`;

  const detailTe = `📅 ఈ సూత్రం ఖచ్చితంగా ఫలించే సంవత్సరాలు & మీ వయస్సు: (1) ప్రత్యక్ష గురు సంచారం (${RASHI_NAMES[trine1Idx].te}): ${directY1}–${directY1 + 1} (${age1}–${age1 + 1} ఏళ్ల వయస్సు) & ${directY2}–${directY2 + 1} (${age2}–${age2 + 1} ఏళ్ల వయస్సు) · (2) త్రికోణ & సప్తమ గురు దృష్టి సంవత్సరాలు: ${topWindows
    .map((w) => `${w.year}–${w.year + 1} (${w.rashiTe} - ${w.relTe}, వయస్సు ${Math.max(1, w.year - birthYear)} ఏళ్లు)`)
    .join(' | ')}.`;

  const detailEn = `📅 Exact Years & Ages When This Sutra Manifests: (1) Direct Jupiter Transit (${RASHI_NAMES[trine1Idx].en}): ${directY1}–${directY1 + 1} (Age ${age1}–${age1 + 1}) & ${directY2}–${directY2 + 1} (Age ${age2}–${age2 + 1}) · (2) Trine & 7th Aspect Activation Windows: ${topWindows
    .map((w) => `${w.year}–${w.year + 1} (${w.rashiEn} - ${w.relEn}, Age ${Math.max(1, w.year - birthYear)})`)
    .join(' | ')}.`;

  return { badgeTe, badgeEn, detailTe, detailEn, directY1 };
}

/**
 * Computes exact calendar year ranges & native's ages when Transit Saturn (శని)
 * transits over the target Natal Rashi (1st), its 5th & 9th Trines, and 7th House.
 * Base Astronomical Reference:
 * - Meenam (11): 2025–2027 (Mar 2025 – Jun 2027)
 * - Mesham (0): 2027–2029 (Jun 2027 – Aug 2029)
 * - Vrushabham (1): 2029–2032 (Aug 2029 – Apr 2032)
 * - Mithunam (2): 2032–2034
 * - Karkatakam (3): 2034–2036
 * - Simham (4): 2036–2039
 * - Kanya (5): 2039–2041
 * - Tula (6): 2041–2043
 * - Vruschikam (7): 2043–2046
 * - Dhanussu (8): 2046–2048
 * - Makaram (9): 2048–2050
 * - Kumbham (10): 2050–2052 (and 2023–2025)
 */
const SATURN_RASHI_WINDOWS: Record<number, { startY: number; endY: number }> = {
  11: { startY: 2025, endY: 2027 },
  0: { startY: 2027, endY: 2029 },
  1: { startY: 2029, endY: 2032 },
  2: { startY: 2032, endY: 2034 },
  3: { startY: 2034, endY: 2036 },
  4: { startY: 2036, endY: 2039 },
  5: { startY: 2039, endY: 2041 },
  6: { startY: 2041, endY: 2043 },
  7: { startY: 2043, endY: 2046 },
  8: { startY: 2046, endY: 2048 },
  9: { startY: 2048, endY: 2050 },
  10: { startY: 2023, endY: 2025 },
};

function computeSaturnTransitYears(targetRashiIdx: number, birthYear: number) {
  const r1 = targetRashiIdx % 12;
  const r5 = (targetRashiIdx + 4) % 12;
  const r9 = (targetRashiIdx + 8) % 12;
  const r7 = (targetRashiIdx + 6) % 12;

  const w1 = SATURN_RASHI_WINDOWS[r1];
  const w5 = SATURN_RASHI_WINDOWS[r5];
  const w9 = SATURN_RASHI_WINDOWS[r9];
  const w7 = SATURN_RASHI_WINDOWS[r7];

  const allWindows = [
    { ...w1, rashiTe: RASHI_NAMES[r1].te, rashiEn: RASHI_NAMES[r1].en, relTe: 'జన్మ గ్రహ రాశిపై (1వ స్థానం)', relEn: 'Direct on Natal Sign (1H)' },
    { ...w5, rashiTe: RASHI_NAMES[r5].te, rashiEn: RASHI_NAMES[r5].en, relTe: 'పంచమ కోణంలో (5వ స్థానం)', relEn: '5th Trine (5H)' },
    { ...w9, rashiTe: RASHI_NAMES[r9].te, rashiEn: RASHI_NAMES[r9].en, relTe: 'భాగ్య కోణంలో (9వ స్థానం)', relEn: '9th Trine (9H)' },
    { ...w7, rashiTe: RASHI_NAMES[r7].te, rashiEn: RASHI_NAMES[r7].en, relTe: 'సప్తమ దృష్టి (7వ స్థానం)', relEn: '7th Aspect (7H)' },
  ].sort((a, b) => a.startY - b.startY);

  const badgeTe = `ఖచ్చితమైన ఫలిత సంవత్సరాలు: ${allWindows.slice(0, 3).map((w) => `${w.startY}–${w.endY}`).join(', ')}`;
  const badgeEn = `Exact Manifestation Years: ${allWindows.slice(0, 3).map((w) => `${w.startY}–${w.endY}`).join(', ')}`;

  const detailTe = `📅 ఈ శని నాడీ సూత్రం ఖచ్చితంగా ఫలించే సంవత్సరాలు & వయస్సు: ${allWindows
    .map(
      (w) =>
        `${w.startY}–${w.endY} (${w.rashiTe} - ${w.relTe}, మీ వయస్సు ${Math.max(1, w.startY - birthYear)}–${Math.max(1, w.endY - birthYear)} ఏళ్లు)`
    )
    .join(' | ')}.`;

  const detailEn = `📅 Exact Saturn Transit Manifestation Years & Ages: ${allWindows
    .map(
      (w) =>
        `${w.startY}–${w.endY} (${w.rashiEn} - ${w.relEn}, Age ${Math.max(1, w.startY - birthYear)}–${Math.max(1, w.endY - birthYear)})`
    )
    .join(' | ')}.`;

  return { badgeTe, badgeEn, detailTe, detailEn };
}

/**
 * Computes exact calendar years & ages for Retrograde Rahu & Ketu Transits (1.5 years per Rashi).
 * Astronomical Schedule (2025 to 2043):
 * - rashiIdx 10 (Kumbham): 2025–2026
 * - rashiIdx 9 (Makaram): 2026–2028
 * - rashiIdx 8 (Dhanussu): 2028–2029
 * - rashiIdx 7 (Vruschikam): 2029–2031
 * - rashiIdx 6 (Tula): 2031–2033
 * - rashiIdx 5 (Kanya): 2033–2034
 * - rashiIdx 4 (Simham): 2034–2036
 * - rashiIdx 3 (Karkatakam): 2036–2037
 * - rashiIdx 2 (Mithunam): 2037–2039
 * - rashiIdx 1 (Vrushabham): 2039–2040
 * - rashiIdx 0 (Mesham): 2040–2042
 * - rashiIdx 11 (Meenam): 2042–2043
 */
const NODAL_RASHI_WINDOWS: Record<number, { startY: number; endY: number; periodTe: string; periodEn: string }> = {
  10: { startY: 2025, endY: 2026, periodTe: 'మే 2025 – డిసెంబర్ 2026', periodEn: 'May 2025 – Dec 2026' },
  9: { startY: 2026, endY: 2028, periodTe: 'డిసెంబర్ 2026 – జూన్ 2028', periodEn: 'Dec 2026 – Jun 2028' },
  8: { startY: 2028, endY: 2029, periodTe: 'జూన్ 2028 – డిసెంబర్ 2029', periodEn: 'Jun 2028 – Dec 2029' },
  7: { startY: 2029, endY: 2031, periodTe: 'డిసెంబర్ 2029 – జూలై 2031', periodEn: 'Dec 2029 – Jul 2031' },
  6: { startY: 2031, endY: 2033, periodTe: 'జూలై 2031 – జనవరి 2033', periodEn: 'Jul 2031 – Jan 2033' },
  5: { startY: 2033, endY: 2034, periodTe: 'జనవరి 2033 – జూలై 2034', periodEn: 'Jan 2033 – Jul 2034' },
  4: { startY: 2034, endY: 2036, periodTe: 'జూలై 2034 – ఫిబ్రవరి 2036', periodEn: 'Jul 2034 – Feb 2036' },
  3: { startY: 2036, endY: 2037, periodTe: 'ఫిబ్రవరి 2036 – ఆగస్టు 2037', periodEn: 'Feb 2036 – Aug 2037' },
  2: { startY: 2037, endY: 2039, periodTe: 'ఆగస్టు 2037 – ఫిబ్రవరి 2039', periodEn: 'Aug 2037 – Feb 2039' },
  1: { startY: 2039, endY: 2040, periodTe: 'ఫిబ్రవరి 2039 – సెప్టెంబర్ 2040', periodEn: 'Feb 2039 – Sep 2040' },
  0: { startY: 2040, endY: 2042, periodTe: 'సెప్టెంబర్ 2040 – మార్చి 2042', periodEn: 'Sep 2040 – Mar 2042' },
  11: { startY: 2042, endY: 2043, periodTe: 'మార్చి 2042 – సెప్టెంబర్ 2043', periodEn: 'Mar 2042 – Sep 2043' },
};

function computeNodalTransitYears(targetRashiIdx: number, birthYear: number, nodeType: 'rahu' | 'ketu') {
  // Ketu is always 6 signs away from Rahu; so Ketu is in targetRashiIdx when Rahu is in (targetRashiIdx + 6) % 12
  const lookupIdx = (rIdx: number) => (nodeType === 'rahu' ? rIdx % 12 : (rIdx + 6) % 12);

  const r1 = targetRashiIdx % 12;
  const r5 = (targetRashiIdx + 4) % 12;
  const r9 = (targetRashiIdx + 8) % 12;

  const w1 = NODAL_RASHI_WINDOWS[lookupIdx(r1)];
  const w5 = NODAL_RASHI_WINDOWS[lookupIdx(r5)];
  const w9 = NODAL_RASHI_WINDOWS[lookupIdx(r9)];

  const allWindows = [
    { ...w1, rashiTe: RASHI_NAMES[r1].te, rashiEn: RASHI_NAMES[r1].en, relTe: 'జన్మ గ్రహ రాశిపై (1వ స్థానం)', relEn: 'Direct on Natal Sign (1H)' },
    { ...w5, rashiTe: RASHI_NAMES[r5].te, rashiEn: RASHI_NAMES[r5].en, relTe: 'పంచమ కోణంలో (5వ స్థానం)', relEn: '5th Trine (5H)' },
    { ...w9, rashiTe: RASHI_NAMES[r9].te, rashiEn: RASHI_NAMES[r9].en, relTe: 'భాగ్య కోణంలో (9వ స్థానం)', relEn: '9th Trine (9H)' },
  ].sort((a, b) => a.startY - b.startY);

  const nodeLabelTe = nodeType === 'rahu' ? 'రాహు' : 'కేతు';
  const nodeLabelEn = nodeType === 'rahu' ? 'Rahu' : 'Ketu';

  const badgeTe = `ఖచ్చితమైన ఫలిత సంవత్సరాలు: ${allWindows.map((w) => `${w.startY}–${w.endY}`).join(', ')}`;
  const badgeEn = `Exact Manifestation Years: ${allWindows.map((w) => `${w.startY}–${w.endY}`).join(', ')}`;

  const detailTe = `📅 ఈ ${nodeLabelTe} నాడీ సూత్రం ఖచ్చితంగా ఫలించే సంవత్సరాలు & వయస్సు: ${allWindows
    .map(
      (w) =>
        `${w.periodTe} (${w.rashiTe} - ${w.relTe}, మీ వయస్సు ${Math.max(1, w.startY - birthYear)}–${Math.max(1, w.endY - birthYear)} ఏళ్లు)`
    )
    .join(' | ')}.`;

  const detailEn = `📅 Exact ${nodeLabelEn} Transit Manifestation Windows & Ages: ${allWindows
    .map(
      (w) =>
        `${w.periodEn} (${w.rashiEn} - ${w.relEn}, Age ${Math.max(1, w.startY - birthYear)}–${Math.max(1, w.endY - birthYear)})`
    )
    .join(' | ')}.`;

  return { badgeTe, badgeEn, detailTe, detailEn };
}

export function generateCompleteNaadiTransitReport(
  planets: KundaliPlanetDetail[],
  lagnaIdx: number,
  birthDate = '1994-08-15'
): CompleteNaadiTransitReport {
  const birthYear = Number(birthDate.split('-')[0]) || 1994;

  const findPl = (id: string, fallbackIdx: number) =>
    planets.find((p) => p.id === id) || planets[fallbackIdx] || planets[0];

  const sunPl = findPl('sun', 1);
  const moonPl = findPl('moon', 2);
  const marsPl = findPl('mars', 3);
  const merPl = findPl('mercury', 4);
  const jupPl = findPl('jupiter', 5);
  const venPl = findPl('venus', 6);
  const satPl = findPl('saturn', 7);
  const rahPl = findPl('rahu', 8);
  const ketPl = findPl('ketu', 9);

  const core9Planets: {
    key: string;
    pl: KundaliPlanetDetail;
    nameTe: string;
    nameEn: string;
    karakaTe: string;
    karakaEn: string;
  }[] = [
    { key: 'sun', pl: sunPl, nameTe: 'రవి (సూర్యుడు)', nameEn: 'Natal Sun (Surya)', karakaTe: 'ఆత్మ, తండ్రి, ప్రభుత్వం, కీర్తి & అధికారం', karakaEn: 'Soul, Father, Authority & Fame' },
    { key: 'moon', pl: moonPl, nameTe: 'చంద్రుడు', nameEn: 'Natal Moon (Chandra)', karakaTe: 'మనస్సు, తల్లి, ప్రయాణాలు, జల & ఆహార కారకుడు', karakaEn: 'Mind, Mother, Travel & Sustenance' },
    { key: 'mars', pl: marsPl, nameTe: 'కుజుడు (అంగారకుడు)', nameEn: 'Natal Mars (Kuja)', karakaTe: 'దేహ బలం, సోదరులు, భూమి, ధైర్యం & భర్త (స్త్రీ జాతకంలో)', karakaEn: 'Vitality, Siblings, Land & Courage' },
    { key: 'mercury', pl: merPl, nameTe: 'బుధుడు', nameEn: 'Natal Mercury (Budha)', karakaTe: 'బుద్ధి భోగం, విద్య, వ్యాపారం, వాక్కు & మిత్రులు', karakaEn: 'Intellect, Education, Trade & Speech' },
    { key: 'jupiter', pl: jupPl, nameTe: 'గురువు (బృహస్పతి)', nameEn: 'Natal Jupiter (Guru)', karakaTe: 'జీవ కారకుడు (భోక్తృ), ధర్మం, సంతానం, ధన & జ్ఞానం', karakaEn: 'Jeeva Karaka (Self), Wisdom, Progeny & Wealth' },
    { key: 'venus', pl: venPl, nameTe: 'శుక్రుడు', nameEn: 'Natal Venus (Shukra)', karakaTe: 'ఆనంద భోగం, కళత్రం (భార్య), ధనం, గృహ-వాహన & విలాసం', karakaEn: 'Ananda Bhoga, Spouse, Wealth, Home & Vehicles' },
    { key: 'saturn', pl: satPl, nameTe: 'శని (మందుడు)', nameEn: 'Natal Saturn (Shani)', karakaTe: 'కర్మ కారకుడు, వృత్తి/ఉద్యోగం, ఆయుష్షు & స్థిర శ్రమ', karakaEn: 'Karma Karaka, Profession, Longevity & Discipline' },
    { key: 'rahu', pl: rahPl, nameTe: 'రాహువు', nameEn: 'Natal Rahu', karakaTe: 'కాలపురుష ముఖం, విదేశీ యోగం, ఆకస్మిక వృద్ధి & మాయా శక్తి', karakaEn: 'Foreign Travel, Sudden Rise, Tech & Shadow Force' },
    { key: 'ketu', pl: ketPl, nameTe: 'కేతువు', nameEn: 'Natal Ketu', karakaTe: 'మోక్ష కారకుడు, ధ్వజ కీర్తి, ఆధ్యాత్మికత, వైద్య-న్యాయ-గణిత జ్ఞానం', karakaEn: 'Moksha, Flag of Honor, Healing, Law & Deep Intuition' },
  ];

  const jupRashi = RASHI_NAMES[jupPl.rashiIdx % 12];
  const satRashi = RASHI_NAMES[satPl.rashiIdx % 12];
  const merRashi = RASHI_NAMES[merPl.rashiIdx % 12];
  const venRashi = RASHI_NAMES[venPl.rashiIdx % 12];
  const sunRashi = RASHI_NAMES[sunPl.rashiIdx % 12];
  const rahRashi = RASHI_NAMES[rahPl.rashiIdx % 12];
  const ketRashi = RASHI_NAMES[ketPl.rashiIdx % 12];
  const lagnaRashi = RASHI_NAMES[lagnaIdx % 12];

  const jupOnJup = computeJupiterTransitYears(jupPl.rashiIdx, birthYear);
  const jupOnSat = computeJupiterTransitYears(satPl.rashiIdx, birthYear);
  const jupOnVen = computeJupiterTransitYears(venPl.rashiIdx, birthYear);
  const rahOnJup = computeNodalTransitYears(jupPl.rashiIdx, birthYear, 'rahu');
  const ketOnJup = computeNodalTransitYears(jupPl.rashiIdx, birthYear, 'ketu');

  // ============================================================================
  // CHAPTER 11 (PAGE 17): NAADI TRANSIT CORE RULES & BHOKTR-KARMA-BHOGA GROUPING
  // (Maharshi Bhrigu & Parashara Samhita Tradition — With Exact Years!)
  // ============================================================================
  const chapter11Rules: NaadiRuleCard[] = [
    {
      id: 'naadi-rule-1',
      ruleNoTe: 'మహర్షి నాడీ గోచార సూత్రం #1 · గ్రహ వర్గీకరణ',
      ruleNoEn: 'Maharshi Naadi Transit Axiom #1 · Planetary Grouping',
      badgeTe: 'భోక్తృ · కర్మ · భోగ సమన్వయం',
      badgeEn: 'Bhoktr · Karma · Bhoga Synthesis',
      titleTe: `మీ జాతకంలో భోక్తృ (గురు: ${jupRashi.te}), కర్మ (శని: ${satRashi.te}) & భోగ (బుధ: ${merRashi.te} / శుక్ర: ${venRashi.te}) గ్రహాల నాడీ బంధం`,
      titleEn: `Your Chart’s Bhoktr (Jupiter in ${jupRashi.en}), Karma (Saturn in ${satRashi.en}) & Bhoga (Mercury/Venus) Naadi Matrix`,
      accurateYearsTe: `📅 ఖచ్చితంగా ఫలించే ప్రధాన సంవత్సరాలు: కర్మ-ఉద్యోగ వృద్ధి (${jupOnSat.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}) · ధన-గృహ-వివాహ భోగ వృద్ధి (${jupOnVen.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')})`,
      accurateYearsEn: `📅 Exact Manifestation Years: Career Growth (${jupOnSat.badgeEn.replace('Exact Manifestation Years: ', '')}) · Wealth & Domestic Bliss (${jupOnVen.badgeEn.replace('Exact Manifestation Years: ', '')})`,
      analysisTe: `భృగు మహర్షి మరియు పరాశర మహర్షి ప్రణీత నాడీ జ్యోతిష్య సంహిత ప్రకారం ప్రతి జాతకంలో గురువు 'భోక్తృ' (జీవుడు/అనుభవించేవాడు), శని 'కర్మ కారకుడు' (వృత్తి/క్రియ), బుధుడు 'బుద్ధి భోగ కారకుడు' (విద్య/వ్యాపార బుద్ధి), శుక్రుడు 'ఆనంద భోగ కారకుడు' (ధనం/వివాహ/వాహన సుఖం), రవి 'ఆత్మ-కీర్తి కారకుడు'. మీ జాతకంలో గురువు ${jupRashi.te} రాశిలో (${jupPl.degreeFormatted}), శని ${satRashi.te} రాశిలో (${satPl.degreeFormatted}) ఉండటం వల్ల గోచార గురు-శని గ్రహాలు మీ జన్మ బుధ (${merRashi.te}) మరియు శుక్ర (${venRashi.te}) రాశులతో కోణ (1-5-9) లేదా సప్తమ (7) సంబంధం పొందిన సంవత్సరాలలో వృత్తిలో పదోన్నతి, ఆర్థిక సమృద్ధి మరియు గృహ-వాహన యోగాలు ఖచ్చితంగా సిద్ధిస్తాయి.`,
      analysisEn: `According to the classical Naadi Samhitas of Maharshi Bhrigu and Maharshi Parashara, Jupiter is Bhoktr (the experiencer/Jeeva), Saturn is Karma (action/career), Mercury is Buddhi Bhoga (intellectual enjoyment), and Venus is Ananda Bhoga (wealth & marital bliss). Whenever transit Jupiter or Saturn links in 1-5-9 or 7th to your Natal Mercury (${merRashi.en}) and Venus (${venRashi.en}), major career and financial milestones manifest in those exact calendar years.`,
      practicalKeyTe: `ముఖ్య రహస్యం: గోచార గ్రహాలు మీ జన్మ గ్రహ డిగ్రీలకు (${jupPl.degreeFormatted}) దగ్గరగా వచ్చిన నెలలలో ఫలితాలు 100% తీవ్రతతో నిజమవుతాయి.`,
      practicalKeyEn: `Key Secret: Results peak during the months when transit planets approach the exact degree (${jupPl.degreeFormatted}) of your natal planets.`,
    },
    {
      id: 'naadi-rule-2',
      ruleNoTe: 'మహర్షి నాడీ గోచార సూత్రం #2 · 1-5-9 కోణ & 2-12 నియమం',
      ruleNoEn: 'Maharshi Naadi Transit Axiom #2 · 1-5-9 Trine & 2-12 Linkage',
      badgeTe: `${jupRashi.elementTe} త్రికోణ బలం`,
      badgeEn: 'Trine & 2-12 Activation Rule',
      titleTe: 'జన్మ గ్రహాలకు 1, 5, 9 (త్రికోణ), 7 (సప్తమ) & 2-12 స్థానాల్లో గోచార గ్రహాల ఫలదాన విధానం',
      titleEn: 'How Transit Planets Activate Natal Planets in 1-5-9 Trines, 7th Aspect & 2-12 Positions',
      accurateYearsTe: `📅 మీ జీవ కారక గురు త్రికోణ (${getTrineRashisLabel(jupPl.rashiIdx).te}) స్వర్ణయుగ సంవత్సరాలు: ${jupOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}`,
      accurateYearsEn: `📅 Your Jeeva Karaka Jupiter Trine (${getTrineRashisLabel(jupPl.rashiIdx).en}) Golden Years: ${jupOnJup.badgeEn.replace('Exact Manifestation Years: ', '')}`,
      analysisTe: `భృగు నంది నాడీ శాస్త్ర ప్రమాణం ప్రకారం ఏ గోచార గ్రహమైనా మీ జన్మ గ్రహం ఉన్న రాశిలో (1), లేదా అక్కడి నుండి 5, 9 కోణ రాశులలో, లేదా 7వ రాశిలో సంచరించినప్పుడు ఆ జన్మ గ్రహ కారకత్వాలను పూర్తిగా మేల్కొలుపుతుంది. అలాగే జన్మ గ్రహానికి 2వ రాశిలో (ధన/పురోగతి) లేదా 12వ రాశిలో (వ్యయ/నిర్ణయ మార్పు) గోచార గ్రహం వచ్చినప్పుడు కూడా ఆ గ్రహ ఫలితాలను ప్రభావితం చేస్తుంది. మీ జీవ కారకుడైన గురువు (${jupRashi.te}) యొక్క త్రికోణ రాశులు ${getTrineRashisLabel(jupPl.rashiIdx).te} — ఈ రాశులలో గురువు సంచరించే పైన పేర్కొన్న సంవత్సరాలు మీకు స్వర్ణయుగంలా పనిచేస్తాయి.`,
      analysisEn: `In Maharshi Bhrigu's Naadi system, a transiting planet activates any natal planet when passing through the same sign (1st), its trines (5th & 9th), or opposite sign (7th). Your Natal Jupiter's trine signs (${getTrineRashisLabel(jupPl.rashiIdx).en}) act as high-fortune activation zones during the exact years listed above.`,
      practicalKeyTe: `మీ కర్మ కారక శని త్రికోణ రాశులు: ${getTrineRashisLabel(satPl.rashiIdx).te} — ఈ రాశులలో గురు/శని సంచారం ఉద్యోగ-వ్యాపార స్థిరత్వాన్ని ఇస్తుంది.`,
      practicalKeyEn: `Your Natal Saturn trine signs (${getTrineRashisLabel(satPl.rashiIdx).en}) govern major professional consolidations.`,
    },
    {
      id: 'naadi-rule-3',
      ruleNoTe: 'మహర్షి నాడీ గోచార సూత్రం #3 · స్తంభన (Stambhana) & వక్ర గతి రహస్యం',
      ruleNoEn: 'Maharshi Naadi Transit Axiom #3 · Stationary (Stambhana) & Retrograde Secret',
      badgeTe: 'స్తంభన · వక్ర · పరివర్తన యోగం',
      badgeEn: 'Stationary, Retrograde & Exchange Rules',
      titleTe: 'గోచార గ్రహ స్తంభన (Stationary), వక్ర గతి (Retrograde) & జన్మ-గోచార పరివర్తన ఫలితాలు',
      titleEn: 'Stationary Planets (Stambhana), Retrograde Shifts & Natal-Transit Sign Exchange',
      accurateYearsTe: `📅 ప్రతి సంవత్సరం గురువు (4 నెలలు) & శని (4½ నెలలు) వక్ర/స్తంభన చెందే మాసాలలో మీ జన్మ ${jupRashi.te}, ${satRashi.te} రాశులపై తక్షణ ఫలితం`,
      accurateYearsEn: `📅 Annual 4-Month Jupiter & 4.5-Month Saturn Retrograde/Stationary Windows Triggering ${jupRashi.en} & ${satRashi.en}`,
      analysisTe: `సనాతన జ్యోతిష్య సంహితల ప్రకారం కుజ, బుధ, గురు, శుక్ర, శని గ్రహాలు వక్ర గతిలోకి మారే ముందు మరియు వక్ర గతి నుండి రుజు మార్గంలోకి మారే ముందు కొన్ని రోజులు 'స్తంభన' (Stationary) స్థితిలో ఉంటాయి. ఆ సమయంలో అవి ఉన్న రాశిలోని మీ జన్మ గ్రహాలపై అసాధారణమైన శక్తిని చూపుతాయి. వక్రించిన గ్రహం తన వెనుక రాశి ఫలితాలను కూడా ఇస్తుంది. అంతేకాక, గోచార గ్రహం మరియు జన్మ గ్రహం పరస్పరం రాశులు మార్చుకున్నప్పుడు (Natal-Transit Exchange / పరివర్తన) అసాధ్యమైన పనులు కూడా సులభంగా పూర్తవుతాయి.`,
      analysisEn: `Before turning retrograde or direct, Mars, Mercury, Jupiter, Venus, and Saturn become Stationary (Stambhana), exerting intense focus on natal planets in that sign or trine. Furthermore, when a transit planet and natal planet form a Natal-Transit Sign Exchange (Parivartana), rapid breakthroughs occur.`,
      practicalKeyTe: `సూచన: గురు, శని గ్రహాలు స్తంభన (Stationary) చెందే వారాలలో కీలక ఆర్థిక/ఉద్యోగ ఒప్పందాలలో ఆచితూచి అడుగు వేయాలి.`,
      practicalKeyEn: `Tip: Exercise extra mindfulness during weeks when Jupiter or Saturn turns stationary.`,
    },
    {
      id: 'naadi-rule-4',
      ruleNoTe: 'మహర్షి నాడీ గోచార సూత్రం #4 · జీవ బంధన & దేహ బంధన యోగ తనిఖీ',
      ruleNoEn: 'Maharshi Naadi Transit Axiom #4 · Jeeva Bandhana & Deha Bandhana Check',
      badgeTe: 'విధి భంజక గ్రహ రక్షణ',
      badgeEn: 'Destiny Breaker Protection',
      titleTe: `మీ జాతకంలో రాహు (${rahRashi.te}) – కేతు (${ketRashi.te}) అక్షం & జీవ/దేహ బంధన విమోచన విశ్లేషణ`,
      titleEn: `Your Rahu (${rahRashi.en}) – Ketu (${ketRashi.en}) Axis & Jeeva/Deha Bandhana Evaluation`,
      accurateYearsTe: `📅 జాగ్రత్త & గోగ్రాస పరిహారం పాటించవలసిన సంవత్సరాలు: రాహు గోచారం (${rahOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}) · కేతు గోచారం (${ketOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')})`,
      accurateYearsEn: `📅 Key Precaution & Remedy Years: Rahu Transit (${rahOnJup.badgeEn.replace('Exact Manifestation Years: ', '')}) · Ketu Transit (${ketOnJup.badgeEn.replace('Exact Manifestation Years: ', '')})`,
      analysisTe: `మహర్షి ప్రణీత నాడీ సంహితలలో రాహువు, కేతువు, కుజుడు, చంద్రుడు ఆకస్మిక మలుపులు ఇచ్చే గ్రహాలుగా పరిగణించబడతాయి. పురుషులలో జీవ కారకుడైన గురువుకు (${jupRashi.te}), స్త్రీలలో శుక్రునికి (${venRashi.te}) 2-12 స్థానాల్లో లేదా ఒకే రాశిలో గోచార రాహు-కేతువులు చేరినప్పుడు 'జీవ బంధన' లేదా 'దేహ బంధన' పరిస్థితులు ఏర్పడతాయి. పైన పేర్కొన్న రాహు-కేతు గోచార సంవత్సరాలలో గోగ్రాస దానం (ఆవుకు నానబెట్టిన ధాన్యం-బెల్లం తినిపించడం) మరియు గణపతి-దుర్గా ఆరాధన చేయడం వల్ల ఎటువంటి బంధన దోషమైనా తక్షణమే తొలగిపోతుంది.`,
      analysisEn: `Rahu, Ketu, Mars, and Moon act as sudden destiny-modifying catalysts in Naadi transit. During the exact years listed above when transit Rahu/Ketu links with Natal Jupiter (${jupRashi.en}) or Venus (${venRashi.en}), performing Go-Grasa (cow feeding) and Ganapati-Durga upasana dissolves all blockages.`,
      practicalKeyTe: `పరిహార సూత్రం: గోచార రాహు/కేతువులు మీ జన్మ గురు (${jupRashi.te}) లేదా శుక్ర (${venRashi.te}) రాశిని తాకే సంవత్సరాలలో నవధాన్య గోగ్రాస దానం చేయాలి.`,
      practicalKeyEn: `Remedy Axiom: Feed soaked grains and jaggery to a cow during the years Rahu/Ketu transits over Natal Jupiter or Venus.`,
    },
  ];

  // ============================================================================
  // CHAPTER 12 PART 1 (PAGE 18): FAST-MOVING PLANETS (SUN, MOON, MARS TRANSITS)
  // ============================================================================
  const chapter12FastPart1: FastPlanetTransitCard[] = [
    {
      id: 'fast-sun',
      transitPlanetTe: '1. గోచార రవి (సూర్య) సంచారం — నెలవారీ ఆత్మ-అధికార ట్రిగ్గర్',
      transitPlanetEn: '1. Transit Sun (Surya) on Your Natal Planets — Monthly Authority Trigger',
      natalTargetTe: `మీ జన్మ రవి (${sunRashi.te}), గురు (${jupRashi.te}) & బుధ (${merRashi.te}) రాశులపై సూర్య గోచారం`,
      natalTargetEn: `Transit Sun over Natal Sun (${sunRashi.en}), Jupiter (${jupRashi.en}) & Mercury (${merRashi.en})`,
      accurateTimingWindowTe: `📅 ప్రతి సంవత్సరం ఖచ్చితంగా ఫలించే తేదీలు: (1) శివరాజ యోగ మాసం (జన్మ గురు ${jupRashi.te} పై): ${jupRashi.solarMonthTe} · (2) అధికార వృద్ధి మాసం (జన్మ రవి ${sunRashi.te} పై): ${sunRashi.solarMonthTe} · (3) బుధాదిత్య విజయ మాసం (జన్మ బుధ ${merRashi.te} పై): ${merRashi.solarMonthTe}`,
      accurateTimingWindowEn: `📅 Exact Annual Manifestation Dates: (1) Shivaraja Yoga Month (on Natal Jupiter ${jupRashi.en}): ${jupRashi.solarMonthEn} · (2) Authority Month (on Natal Sun ${sunRashi.en}): ${sunRashi.solarMonthEn} · (3) Budhaditya Month (on Natal Mercury ${merRashi.en}): ${merRashi.solarMonthEn}`,
      effectSummaryTe: `సూర్యుడు ప్రతి రాశిలో 1 నెల పాటు సంచరిస్తాడు. ప్రతి సంవత్సరం ${sunRashi.solarMonthTe} మధ్య గోచార రవి మీ జన్మ రవి (${sunRashi.te}) పై సంచరించే మాసంలో ఆత్మవిశ్వాసం, ప్రభుత్వ/పై అధికారుల గుర్తింపు పెరుగుతాయి. ప్రతి ఏటా ${jupRashi.solarMonthTe} మధ్య జన్మ గురువు (${jupRashi.te}) పై రవి సంచరించే నెలలో 'శివరాజ యోగ' గౌరవం, ప్రమోషన్ అవకాశాలు వస్తాయి. ${merRashi.solarMonthTe} మధ్య జన్మ బుధుని (${merRashi.te}) పై రవి సంచరించే నెలలో బుధాదిత్య యోగంతో పరీక్షలు, ఇంటర్వ్యూలు, ఒప్పందాలలో విజయం లభిస్తుంది. ${satRashi.solarMonthTe} (జన్మ శని ${satRashi.te} పై) మరియు ${rahRashi.solarMonthTe} (జన్మ రాహు ${rahRashi.te} పై) నెలలలో తండ్రి ఆరోగ్యం, కంటి/రక్తపోటు విషయంలో జాగ్రత్త వహించాలి.`,
      effectSummaryEn: `Transit Sun spends one month per sign. Every year during ${jupRashi.solarMonthEn} (over Natal Jupiter in ${jupRashi.en}) and ${merRashi.solarMonthEn} (over Natal Mercury in ${merRashi.en}), it triggers promotion, recognition from superiors, and intellectual success. During ${satRashi.solarMonthEn} (over Natal Saturn), avoid ego clashes with authorities.`,
      timingAndHoraAdviceTe: `సూర్య హోరా రహస్యం: ఆదివారం లేదా ఏ రోజైనా 'సూర్య హోరా' జరుగుతున్నప్పుడు పై అధికారులను కలవడం, ప్రభుత్వ దరఖాస్తులు సమర్పించడం వల్ల తక్షణ సానుకూల ఫలితం వస్తుంది.`,
      timingAndHoraAdviceEn: `Sun Hora Secret: Meet senior officials or submit government applications during Sun Hora for rapid approval.`,
      remedyTe: 'ప్రతిరోజూ ఉదయం సూర్య భగవానునికి రాగి పాత్రతో అర్ఘ్యం సమర్పించి ఆదిత్య హృదయం పఠించండి.',
      remedyEn: 'Offer Arghya to the rising Sun in a copper vessel and recite Aditya Hridayam.',
    },
    {
      id: 'fast-moon',
      transitPlanetTe: '2. గోచార చంద్ర సంచారం — 2¼ రోజుల మనో-భాగ్య గడియారం',
      transitPlanetEn: '2. Transit Moon (Chandra) on Your Natal Planets — 54-Hour Daily Clock',
      natalTargetTe: `మీ జన్మ చంద్ర (${RASHI_NAMES[moonPl.rashiIdx % 12].te}), గురు (${jupRashi.te}) & శుక్ర (${venRashi.te}) రాశులపై చంద్ర గోచారం`,
      natalTargetEn: `Transit Moon over Natal Moon (${RASHI_NAMES[moonPl.rashiIdx % 12].en}), Jupiter (${jupRashi.en}) & Venus (${venRashi.en})`,
      accurateTimingWindowTe: `📅 ప్రతి నెలా (27 రోజుల చక్రంలో) ఖచ్చితంగా ఫలించే 9 అదృష్ట రోజులు: చంద్రుడు ${getTrineRashisLabel(jupPl.rashiIdx).te} రాశులలో సంచరించే 7 రోజులు (గజకేసరి యోగం) & ${venRashi.te} రాశిలో సంచరించే 2¼ రోజులు (ధన-లక్ష్మీ లాభం)`,
      accurateTimingWindowEn: `📅 Exact Monthly Lucky Days (Every 27-Day Cycle): ~7 Days when Moon transits ${getTrineRashisLabel(jupPl.rashiIdx).en} (Gajakesari Yoga) & 2¼ Days in ${venRashi.en} (Wealth & Luxury Flow)`,
      effectSummaryTe: `నాడీ జ్యోతిష్యంలో చంద్రుడు నిమిషాల ముల్లు లాంటివాడు. ప్రతి నెలా గోచార చంద్రుడు మీ జన్మ గురువు (${jupRashi.te}) ఉన్న రాశిలో లేదా దానికి 5, 9, 7 రాశులలో (${getTrineRashisLabel(jupPl.rashiIdx).te}) సంచరించే రోజులలో 'గోచార గజకేసరి యోగం' ఏర్పడి శుభవార్తలు, ఆర్థిక లాభం, కుటుంబ ఆనందం కలుగుతాయి. జన్మ శుక్రుని (${venRashi.te}) పై చంద్రుడు వెళ్లే 2¼ రోజులు ఆభరణాలు, వస్త్ర కొనుగోలు, విందు వినోదాలకు అత్యంత అనుకూలం. జన్మ శని (${satRashi.te}), రాహు (${rahRashi.te}), కేతు (${ketRashi.te}) రాశులపై చంద్రుడు సంచరించే 2 రోజులు ప్రయాణాలలో మరియు మానసిక నిర్ణయాలలో సంయమనం పాటించాలి.`,
      effectSummaryEn: `Transit Moon acts as the minute-hand of Naadi timing. Every month, when Moon transits your Natal Jupiter (${jupRashi.en}) or its trines (${getTrineRashisLabel(jupPl.rashiIdx).en}), it forms Transit Gajakesari Yoga bringing good news and financial inflow. When transiting Natal Venus (${venRashi.en}), luxury purchases and family harmony flourish.`,
      timingAndHoraAdviceTe: `చంద్ర హోరా రహస్యం: ప్రయాణాలు, ఆహార/హోటల్/రియల్ ఎస్టేట్ చర్చలు మరియు కుటుంబ శుభకార్య సంప్రదింపులకు చంద్ర హోరా శ్రేష్ఠం.`,
      timingAndHoraAdviceEn: `Moon Hora Secret: Initiate travel, hospitality, and family discussions during Moon Hora.`,
      remedyTe: 'సోమవారం శివాలయంలో క్షీరాభిషేకం మరియు అమ్మవారికి తెల్లని పుష్పాలతో అర్చన చేయండి.',
      remedyEn: 'Perform milk Abhishekam to Lord Shiva on Mondays and offer white flowers to Goddess Parvati.',
    },
    {
      id: 'fast-mars',
      transitPlanetTe: '3. గోచార కుజ (Mars) సంచారం — 45 రోజుల ధైర్య-భూలాభ-శక్తి చక్రం',
      transitPlanetEn: '3. Transit Mars (Kuja) on Your Natal Planets — 45-Day Action & Property Trigger',
      natalTargetTe: `మీ జన్మ కుజ (${RASHI_NAMES[marsPl.rashiIdx % 12].te}), గురు (${jupRashi.te}) & శుక్ర (${venRashi.te}) రాశులపై కుజ గోచారం`,
      natalTargetEn: `Transit Mars over Natal Mars (${RASHI_NAMES[marsPl.rashiIdx % 12].en}), Jupiter (${jupRashi.en}) & Venus (${venRashi.en})`,
      accurateTimingWindowTe: `📅 ప్రతి 18 నెలల కుజ చక్రంలో (2026–2027 & 2028–2029) గోచార కుజుడు ${getTrineRashisLabel(jupPl.rashiIdx).te} మరియు ${venRashi.te} రాశులలో సంచరించే 45 రోజుల కాలాలు భూ-గృహ-వాహన కొనుగోలుకు ఖచ్చితమైన సమయం`,
      accurateTimingWindowEn: `📅 Every 18-Month Mars Cycle (2026–2027 & 2028–2029): The 45-day windows when Mars transits ${getTrineRashisLabel(jupPl.rashiIdx).en} and ${venRashi.en} trigger property & vehicle gains`,
      effectSummaryTe: `గోచార కుజుడు మీ జన్మ గురువు (${jupRashi.te}) పై లేదా దాని కోణ రాశులలో సంచరించే 45 రోజులు 'గురు-మంగళ యోగం' ఏర్పడి నూతన గృహ నిర్మాణం, స్థల కొనుగోలు మరియు అధికార ప్రాప్తి కలుగుతాయి. జన్మ శుక్రుని (${venRashi.te}) పై కుజుడు సంచరించే కాలంలో 'భృగు-మంగళ యోగం' వల్ల వాహన మార్పు, ఆస్తుల అభివృద్ధి మరియు యువతకు వివాహ సంబంధాలు కుదురుతాయి. అయితే గోచార కుజుడు మీ జన్మ శని (${satRashi.te}), రాహు (${rahRashi.te}) లేదా కేతు (${ketRashi.te}) రాశులపై సంచరించేటప్పుడు లేదా వక్ర/స్తంభన స్థితిలో ఉన్నప్పుడు యంత్రాలు, డ్రైవింగ్, కోపతాపాలు మరియు రక్తపోటు విషయంలో అప్రమత్తంగా ఉండాలి.`,
      effectSummaryEn: `When Transit Mars passes over your Natal Jupiter (${jupRashi.en}), Guru-Mangala Yoga triggers land/home acquisitions and decisive leadership. Over Natal Venus (${venRashi.en}), Bhrigu-Mangala Yoga favors vehicles and passionate enterprise. Over Natal Saturn (${satRashi.en}) or Rahu/Ketu, drive carefully and avoid disputes.`,
      timingAndHoraAdviceTe: `కుజ హోరా హెచ్చరిక: నాడీ సూత్రం ప్రకారం ప్రయాణాలు లేదా శుభ చర్చలను 'కుజ హోరా'లో ప్రారంభించకూడదు; భూమి రిజిస్ట్రేషన్, క్రీడలు, సాంకేతిక పనులకు మాత్రమే కుజ హోరా వాడాలి.`,
      timingAndHoraAdviceEn: `Mars Hora Rule: Avoid starting journeys or peace talks during Mars Hora; use it strictly for engineering, sports, or land inspection.`,
      remedyTe: 'మంగళవారం శ్రీ సుబ్రహ్మణ్య స్వామికి లేదా ఆంజనేయ స్వామికి ఎర్రని పుష్పాలు, కందిపప్పు దానం సమర్పించండి.',
      remedyEn: 'Offer red flowers to Lord Subrahmanya or Hanuman on Tuesdays and donate red gram (toor dal).',
    },
  ];

  // ============================================================================
  // CHAPTER 12 PART 2 (PAGE 19): FAST-MOVING PLANETS (MERCURY, VENUS & HORA SECRETS)
  // ============================================================================
  const chapter12FastPart2: FastPlanetTransitCard[] = [
    {
      id: 'fast-mercury',
      transitPlanetTe: '4. గోచార బుధ (Mercury) సంచారం — విద్యా, వ్యాపార, ఇంటర్వ్యూ & ఒప్పందాల తాళం',
      transitPlanetEn: '4. Transit Mercury (Budha) on Your Natal Planets — Trade, Exams & Agreements',
      natalTargetTe: `మీ జన్మ బుధ (${merRashi.te}), గురు (${jupRashi.te}) & శుక్ర (${venRashi.te}) రాశులపై బుధ గోచారం`,
      natalTargetEn: `Transit Mercury over Natal Mercury (${merRashi.en}), Jupiter (${jupRashi.en}) & Venus (${venRashi.en})`,
      accurateTimingWindowTe: `📅 ప్రతి సంవత్సరం ఖచ్చితంగా ఫలించే మాసాలు: ${jupRashi.solarMonthTe} (${jupRashi.te} గురుపై), ${venRashi.solarMonthTe} (${venRashi.te} శుక్రపై) & ${merRashi.solarMonthTe} (${merRashi.te} బుధపై) — విద్యా, ఇంటర్వ్యూ, వాణిజ్య ఒప్పందాల విజయం`,
      accurateTimingWindowEn: `📅 Exact Annual Peak Windows: Around ${jupRashi.solarMonthEn} (on Natal Jupiter), ${venRashi.solarMonthEn} (on Natal Venus) & ${merRashi.solarMonthEn} (on Natal Mercury)`,
      effectSummaryTe: `భృగు నాడీ జ్యోతిష్యంలో బుధుడు 'బుద్ధి భోగ కారకుడు'. గోచార బుధుడు మీ జన్మ గురువు (${jupRashi.te}) పై సంచరించే కాలంలో ఉన్నత విద్యా ప్రవేశాలు, కౌన్సెలింగ్, బ్యాంకింగ్, సాఫ్ట్‌వేర్ మరియు న్యాయ వివాదాలలో అద్భుత పరిష్కారాలు లభిస్తాయి. జన్మ శుక్రుని (${venRashi.te}) పై బుధుడు సంచరించేటప్పుడు 'లక్ష్మీ-నారాయణ యోగం' ఏర్పడి వ్యాపార విస్తరణ, షేర్లు/పెట్టుబడుల ద్వారా ధన లాభం, గృహ అలంకరణ జరుగుతాయి. జన్మ శని (${satRashi.te}) పై బుధుడు వెళ్లేటప్పుడు వృత్తి నైపుణ్యం పెరుగుతుంది. జన్మ రాహు (${rahRashi.te}) లేదా కేతు (${ketRashi.te}) పై బుధుడు వక్రించినప్పుడు డాక్యుమెంట్లు, సంతకాలు మరియు పాస్‌పోర్ట్/వీసా పత్రాలను రెండుసార్లు సరిచూసుకోవాలి.`,
      effectSummaryEn: `Transit Mercury over your Natal Jupiter (${jupRashi.en}) brings academic distinction, smart counseling, and legal/consulting wins. Over Natal Venus (${venRashi.en}), it forms Lakshmi-Narayana Yoga generating commercial profits and investment gains. Double-check contracts when Mercury transits Natal Rahu/Ketu.`,
      timingAndHoraAdviceTe: `బుధ హోరా రహస్యం: ఉద్యోగ ఇంటర్వ్యూలకు హాజరు కావడానికి, వ్యాపార అగ్రిమెంట్లు వ్రాయడానికి, పుస్తక పఠనానికి మరియు కోడింగ్/అకౌంట్స్ పనులకు 'బుధ హోరా' అత్యుత్తమ విజయాన్ని ఇస్తుంది.`,
      timingAndHoraAdviceEn: `Mercury Hora Secret: Attend job interviews, sign commercial agreements, and study during Mercury Hora for effortless success.`,
      remedyTe: 'బుధవారం శ్రీ మహావిష్ణువుకు తులసి దళాలతో అర్చన చేసి విష్ణు సహస్రనామ స్తోత్రం పఠించండి.',
      remedyEn: 'Offer Tulasi leaves to Lord Maha Vishnu on Wednesdays and chant Vishnu Sahasranama.',
    },
    {
      id: 'fast-venus',
      transitPlanetTe: '5. గోచార శుక్ర (Venus) సంచారం — ఆనంద భోగం, ధన ప్రవాహం, వివాహ & వాహన యోగం',
      transitPlanetEn: '5. Transit Venus (Shukra) on Your Natal Planets — Wealth, Marriage & Luxury Flow',
      natalTargetTe: `మీ జన్మ శుక్ర (${venRashi.te}), గురు (${jupRashi.te}) & శని (${satRashi.te}) రాశులపై శుక్ర గోచారం`,
      natalTargetEn: `Transit Venus over Natal Venus (${venRashi.en}), Jupiter (${jupRashi.en}) & Saturn (${satRashi.en})`,
      accurateTimingWindowTe: `📅 ప్రతి సంవత్సరం గోచార శుక్రుడు ${getTrineRashisLabel(satPl.rashiIdx).te} (కర్మ-ధన లాభం) మరియు ${getTrineRashisLabel(venPl.rashiIdx).te} (గృహ-వాహన-వివాహ సౌఖ్యం) రాశులలో సంచరించే నెలలు మీకు అత్యధిక ఆర్థిక ప్రవాహాన్ని ఇస్తాయి`,
      accurateTimingWindowEn: `📅 Every year when Transit Venus passes through ${getTrineRashisLabel(satPl.rashiIdx).en} (Career Wealth) and ${getTrineRashisLabel(venPl.rashiIdx).en} (Home/Vehicle/Marriage Bliss)`,
      effectSummaryTe: `శుక్రుడు 'ఆనంద భోగ కారకుడు' మరియు సాక్షాత్తు మహాలక్ష్మి స్వరూపం. గోచార శుక్రుడు మీ జన్మ శని (${satRashi.te}) రాశిపై లేదా త్రికోణ రాశులపై (${getTrineRashisLabel(satPl.rashiIdx).te}) సంచరించే కాలంలో ఉద్యోగ-వ్యాపారాల ద్వారా అత్యధిక ఆదాయం, బోనస్, బకాయిల వసూలు జరుగుతాయి. జన్మ శుక్రుని (${venRashi.te}) పై లేదా జన్మ గురువు (${jupRashi.te}) పై గోచార శుక్రుడు వెళ్లేటప్పుడు గృహప్రవేశం, నూతన వాహన కొనుగోలు, బంగారు ఆభరణాల ప్రాప్తి మరియు అవివాహితులకు వివాహ నిశ్చయం జరుగుతాయి. జన్మ కేతువు (${ketRashi.te}) పై శుక్రుడు వెళ్లేటప్పుడు భక్తి, ఆలయ దర్శనాలు పెరుగుతాయి.`,
      effectSummaryEn: `When Transit Venus passes over or trines your Natal Saturn (${satRashi.en}), career earnings and business cashflow surge. Over Natal Venus (${venRashi.en}) or Jupiter (${jupRashi.en}), auspicious ceremonies, jewelry/vehicle purchases, and marriage alliances blossom.`,
      timingAndHoraAdviceTe: `శుక్ర హోరా రహస్యం: బ్యాంకు లోన్ దరఖాస్తులు, రావలసిన బకాయిలు అడగడం, బంగారం/వాహనాలు కొనడం, పెళ్లి చూపులు మరియు శుభ ప్రయాణాలకు 'శుక్ర హోరా' తిరుగులేని లక్ష్మీ కటాక్షాన్ని ఇస్తుంది.`,
      timingAndHoraAdviceEn: `Venus Hora Secret: Apply for loans, recover dues, buy gold/vehicles, or schedule bride/groom meetings during Venus Hora.`,
      remedyTe: 'శుక్రవారం శ్రీ మహాలక్ష్మీ దేవికి తామర పువ్వులతో అర్చన చేసి, ఆవు పాలతో చేసిన పాయసం నివేదించండి.',
      remedyEn: 'Worship Goddess Mahalakshmi on Fridays with lotus flowers and sweet milk kheer.',
    },
    {
      id: 'fast-hora-master',
      transitPlanetTe: '6. నాడీ హోరా & దినచర్య విజయ సూత్రం — నిత్య జీవితంలో గ్రహ సమయ వినియోగం',
      transitPlanetEn: '6. Master Naadi Hora Timing Matrix — Daily Planetary Hour Execution Guide',
      natalTargetTe: `మీ జన్మ లగ్నం (${lagnaRashi.te}) & జన్మ రాశి (${RASHI_NAMES[moonPl.rashiIdx % 12].te}) వారికి నిత్య హోరా మార్గదర్శి`,
      natalTargetEn: `Daily Hora Execution Matrix for ${lagnaRashi.en} Ascendant & ${RASHI_NAMES[moonPl.rashiIdx % 12].en} Moon`,
      accurateTimingWindowTe: `📅 ప్రతిరోజూ (365 రోజులూ) ఉదయం సూర్యోదయం నుండి ప్రారంభమయ్యే 24 గంటల హోరా చక్రంలో గురు, శుక్ర, బుధ హోరాలలో చేపట్టే పనులు 100% సఫలమవుతాయి`,
      accurateTimingWindowEn: `📅 Applicable All 365 Days: Executing key tasks during daily Jupiter, Venus, and Mercury Horas guarantees maximum success`,
      effectSummaryTe: `మహర్షి ప్రణీత హోరా శాస్త్రం ప్రకారం తిథి-నక్షత్రాలతో పాటు ఆ గంటలో నడుస్తున్న 'హోరా' (Planetary Hour) మరియు గోచార చంద్రుని స్థితిని కలిపి చూసినప్పుడు సంపూర్ణ కార్యజయం లభిస్తుంది: (1) గురు హోరా: బ్యాంకు డిపాజిట్లు, వివాహ/శుభకార్య చర్చలు, గురు దర్శనం, ఉన్నత విద్య; (2) శుక్ర హోరా: ధన సేకరణ, వాహన/గృహ కొనుగోలు, ప్రయాణ ప్రారంభం, వైద్య చికిత్స; (3) బుధ హోరా: ఇంటర్వ్యూలు, పరీక్షలు, అగ్రిమెంట్లు, వ్యాపార చర్చలు; (4) శని & కుజ హోరాలు: సాధారణ శుభకార్యాలకు, ప్రయాణాలకు నివారించాలి.`,
      effectSummaryEn: `Combining daily Hora with transit planet links ensures high precision in daily actions: Jupiter Hora for wealth & sacred beginnings; Venus Hora for finance, vehicles, travel & recovery; Mercury Hora for interviews, exams & contracts; avoid Mars & Saturn Horas for new auspicious ventures.`,
      timingAndHoraAdviceTe: `బంగారు సూత్రం: గోచార చంద్రుడు మీ జన్మ గురు (${jupRashi.te}), బుధ (${merRashi.te}), శుక్ర (${venRashi.te}) రాశులలో ఉన్న రోజుల్లో వచ్చే గురు/శుక్ర హోరాలు అఖండ రాజయోగ ముహూర్తాలు!`,
      timingAndHoraAdviceEn: `Golden Rule: Jupiter or Venus Hora on days when Moon transits your Natal Jupiter, Mercury, or Venus acts as a personal Raja Yoga Muhurtha!`,
      remedyTe: 'ముఖ్యమైన పనులకు వెళ్లే ముందు గణపతిని స్మరించి, ఆ రోజు హోరా అధిపతి నామాన్ని 11 సార్లు స్మరించండి.',
      remedyEn: 'Pray to Lord Ganapati and invoke the ruling Hora planet 11 times before stepping out for key tasks.',
    },
  ];

  // ============================================================================
  // CHAPTER 13 (PAGES 20 & 21): JUPITER (JEEVA KARAKA) TRANSIT ON 9 NATAL PLANETS
  // ============================================================================
  const jupiterDataByKey: Record<
    string,
    {
      yogaTe: string;
      yogaEn: string;
      primaryTe: string;
      primaryEn: string;
      breakersTe: string;
      breakersEn: string;
      mattersTe: string;
      mattersEn: string;
      remedyTe: string;
      remedyEn: string;
    }
  > = {
    sun: {
      yogaTe: 'శివరాజ యోగం (గోచార గురు + జన్మ రవి సంయోగం)',
      yogaEn: 'Shivaraja Yoga (Transit Jupiter on Natal Sun)',
      primaryTe: `గోచార గురువు మీ జన్మ రవి (${sunRashi.te} - ${sunPl.degreeFormatted}) రాశిపై లేదా దాని 5, 9 కోణ రాశులలో (${getTrineRashisLabel(sunPl.rashiIdx).te}) సంచరించే కాలం 'శివరాజ యోగం'గా పిలువబడుతుంది. ఆత్మవిశ్వాసం, ప్రభుత్వ/రాజకీయ/ఉన్నతాధికారుల మద్దతు, ఉద్యోగంలో ప్రమోషన్ మరియు తండ్రి గారి ద్వారా శుభ ఫలితాలు కలుగుతాయి.`,
      primaryEn: `When Transit Jupiter passes over or trines your Natal Sun in ${sunRashi.en} (${getTrineRashisLabel(sunPl.rashiIdx).en}), it activates Shivaraja Yoga bringing career elevation, government favor, administrative authority, and paternal blessings.`,
      breakersTe: 'అదే సమయంలో రాహువు/కేతువు దృష్టి ఉంటే అహంకారపూరిత నిర్ణయాలకు దూరంగా ఉండాలి; కుజుని కలయిక ఉంటే అధికార బలం పెరుగుతుంది.',
      breakersEn: 'If simultaneous Rahu/Ketu links occur, avoid egoistic decisions; Mars link boosts executive command.',
      mattersTe: 'ఉద్యోగ హోదా పెరుగుదల, గౌరవ పురస్కారాలు, పుత్ర సంతాన యోగం, తూర్పు దిశ గృహ వాస్తు అనుకూలత.',
      mattersEn: 'Status upgrade, leadership honors, progeny blessings, and favorable East-facing Vastu energy.',
      remedyTe: 'గురువారం మరియు ఆదివారం శివాలయంలో రుద్రాభిషేకం, గోధుమలు మరియు బెల్లం ఆవుకు తినిపించడం శుభప్రదం.',
      remedyEn: 'Perform Rudrabhishekam on Thursdays/Sundays and feed wheat with jaggery to a cow.',
    },
    moon: {
      yogaTe: 'గజకేసరి & గురు-చంద్ర యోగం (గోచార గురు + జన్మ చంద్ర సంయోగం)',
      yogaEn: 'Gajakesari Yoga (Transit Jupiter on Natal Moon)',
      primaryTe: `గోచార గురువు మీ జన్మ రాశి అయిన ${RASHI_NAMES[moonPl.rashiIdx % 12].te} (${moonPl.degreeFormatted}) పై లేదా దాని 5, 9, 7 రాశులపై సంచరించినప్పుడు సంపూర్ణ 'గజకేసరి యోగం' ఫలిస్తుంది. మనశ్శాంతి, సమాజంలో మంచి పేరు, తల్లి గారి ఆరోగ్యం కుదుటపడటం, నివాస మార్పు లేదా శుభ ప్రయాణాలు జరుగుతాయి.`,
      primaryEn: `Transit Jupiter over or trining your Natal Moon in ${RASHI_NAMES[moonPl.rashiIdx % 12].en} triggers Gajakesari Yoga, bestowing mental peace, public goodwill, maternal happiness, and auspicious travels.`,
      breakersTe: 'శని లేదా రాహువు ఏకకాలంలో చంద్రునిపై దృష్టి సారిస్తే అనవసర ఆందోళన, నిద్రలేమి కలుగవచ్చు; ధ్యానం వల్ల నివారణ.',
      breakersEn: 'Simultaneous Saturn/Rahu influence may cause overthinking; regular meditation restores clarity.',
      mattersTe: 'ఆహార-పానీయ వ్యాపార లాభం, జల ప్రయాణాలు, గృహ సౌఖ్యం, వాయువ్య/ఉత్తర దిశల నుండి ధన ప్రవాహం.',
      mattersEn: 'Gains in food/hospitality/consulting, emotional fulfillment, and North/Northwest prosperity.',
      remedyTe: 'పౌర్ణమి నాడు సత్యనారాయణ వ్రతం లేదా లలితా సహస్రనామ పారాయణ, బియ్యం-బెల్లం గోగ్రాస దానం.',
      remedyEn: 'Perform Satyanarayana Pooja or Lalita Sahasranama Parayana on Pournami and feed rice-jaggery to a cow.',
    },
    mars: {
      yogaTe: 'గురు-మంగళ రాజయోగం (గోచార గురు + జన్మ కుజ సంయోగం)',
      yogaEn: 'Guru-Mangala Yoga (Transit Jupiter on Natal Mars)',
      primaryTe: `గోచార గురువు మీ జన్మ కుజుడు ఉన్న ${RASHI_NAMES[marsPl.rashiIdx % 12].te} (${marsPl.degreeFormatted}) రాశిపై లేదా దాని కోణ రాశులలో (${getTrineRashisLabel(marsPl.rashiIdx).te}) సంచరించే సంవత్సరాలలో 'గురు-మంగళ యోగం' ఏర్పడుతుంది. భూమి, ఫ్లాట్, గృహ నిర్మాణం, సోదరుల సహకారం, ఇంజనీరింగ్/వైద్య/పోలీస్/డిఫెన్స్ రంగాలలో విజయం మరియు స్త్రీలకు వివాహ/భర్త పురోగతి లభిస్తాయి.`,
      primaryEn: `Transit Jupiter linking with Natal Mars in ${RASHI_NAMES[marsPl.rashiIdx % 12].en} forms Guru-Mangala Yoga, energizing real estate acquisitions, construction, sibling support, technical/medical success, and marital stability for women.`,
      breakersTe: 'రాహువు/కేతువు తోడైతే భూ వివాదాలు లేదా తొందరపాటు పెట్టుబడుల పట్ల జాగ్రత్త అవసరం.',
      breakersEn: 'Verify land documents thoroughly if Rahu or Ketu simultaneously aspects this sign.',
      mattersTe: 'రియల్ ఎస్టేట్ లాభం, ధైర్యవంతమైన నిర్ణయాలు, శస్త్రచికిత్సల నుండి త్వరగా కోలుకోవడం, దక్షిణ దిశ వాస్తు బలం.',
      mattersEn: 'Property gains, courageous execution, rapid physical recovery, and South-direction Vastu strength.',
      remedyTe: 'గురువారం శ్రీ సుబ్రహ్మణ్య స్వామికి లేదా నరసింహ స్వామికి అభిషేకం, నానబెట్టిన శనగలు-కందిపప్పు గోగ్రాస దానం.',
      remedyEn: 'Worship Lord Subrahmanya or Narasimha on Thursdays and feed soaked chickpeas & red gram to a cow.',
    },
    mercury: {
      yogaTe: 'గురు-బుధ సరస్వతీ జ్ఞాన యోగం (గోచార గురు + జన్మ బుధ సంయోగం)',
      yogaEn: 'Saraswati Jnana Yoga (Transit Jupiter on Natal Mercury)',
      primaryTe: `గోచార గురువు మీ జన్మ బుధుడు ఉన్న ${merRashi.te} (${merPl.degreeFormatted}) రాశిపై లేదా త్రికోణ రాశులలో (${getTrineRashisLabel(merPl.rashiIdx).te}) సంచరించే సంవత్సరాలలో బుద్ధి భోగం వికసిస్తుంది. ఉన్నత విద్య, పోటీ పరీక్షలలో ర్యాంకులు, సాఫ్ట్‌వేర్/IT, అకౌంటింగ్, జ్యోతిష్యం, రచన, వ్యాపార ఒప్పందాలు మరియు భూమి కొనుగోలుకు అత్యుత్తమ కాలం.`,
      primaryEn: `Transit Jupiter over or trining Natal Mercury in ${merRashi.en} illuminates intellect, higher education, competitive exams, IT/software, finance, trade contracts, and commercial expansion.`,
      breakersTe: 'కేతువు కలిస్తే ఆధ్యాత్మిక-గణిత పరిశోధన పెరుగుతుంది; రాహువు కలిస్తే పెద్ద వ్యాపార ఆలోచనలు వస్తాయి.',
      breakersEn: 'Ketu link deepens research and coding skill; Rahu link sparks large-scale commercial ideas.',
      mattersTe: 'విద్యా విజయం, వాక్చాతుర్యం, నూతన వ్యాపార శాఖలు, బంధు-మిత్రుల సహకారం, ఉత్తర/పడమర వాస్తు శుభం.',
      mattersEn: 'Academic honors, eloquent communication, new business branches, and supportive friendships.',
      remedyTe: 'గురువారం & బుధవారం శ్రీ వేంకటేశ్వర స్వామి లేదా హయగ్రీవ ఆరాధన, పెసలు-శనగలు ఆవుకు తినిపించండి.',
      remedyEn: 'Worship Sri Venkateswara or Lord Hayagriva and feed green gram & chickpeas to a cow.',
    },
    jupiter: {
      yogaTe: 'జీవ పునర్జన్మ & బృహస్పతి ఆవర్తన యోగం (గోచార గురు + జన్మ గురు)',
      yogaEn: 'Jeeva Renewal & Jupiter Return Yoga (Transit Jupiter on Natal Jupiter)',
      primaryTe: `ప్రతి 12 సంవత్సరాలకు ఒకసారి గోచార గురువు మీ జన్మ గురువు ఉన్న ${jupRashi.te} (${jupPl.degreeFormatted}) రాశిపై సంచరిస్తాడు (12, 24, 36, 48, 60, 72వ ఏట); ప్రతి 4 ఏళ్లకు ఒకసారి త్రికోణ రాశులలో (${getTrineRashisLabel(jupPl.rashiIdx).te}) సంచరిస్తాడు. ఇది జీవితంలో నూతన శకాన్ని ప్రారంభిస్తుంది: ఆధ్యాత్మిక దీక్ష, సంతాన ప్రాప్తి, గౌరవ పదవులు, ధర్మ కార్యాలు మరియు ఆర్థిక స్థిరత్వం లభిస్తాయి.`,
      primaryEn: `Every 12 years Transit Jupiter returns to your Natal Jupiter sign ${jupRashi.en} (and every 4 years to its trines ${getTrineRashisLabel(jupPl.rashiIdx).en}), marking a major life renaissance: wisdom, childbirth, social prestige, and spiritual grace.`,
      breakersTe: 'జన్మ గురువుపై గోచార గురువు సంచరించేటప్పుడు బరువు పెరగడం (కొలెస్ట్రాల్/లివర్) పట్ల మితాహార నియమం పాటించాలి.',
      breakersEn: 'Maintain a balanced diet and active routine to manage weight/liver metabolism during Jupiter return.',
      mattersTe: 'గురు అనుగ్రహం, సంతాన శుభకార్యాలు, బంగారు ఆభరణాల సేకరణ, ఈశాన్య దిశ వాస్తు పవిత్రత.',
      mattersEn: 'Guru’s grace, celebrations for children, gold acquisition, and Northeast Vastu sanctification.',
      remedyTe: 'ప్రతి గురువారం శ్రీ దక్షిణామూర్తి ఆరాధన, పసుపు-శనగలు-బెల్లం ఆవుకు సమర్పించండి.',
      remedyEn: 'Worship Sri Dakshinamurthy on Thursdays and feed soaked Bengal gram with jaggery to a cow.',
    },
    venus: {
      yogaTe: 'ద్విగురు లక్ష్మీ-కళత్ర యోగం (గోచార గురు + జన్మ శుక్ర సంయోగం)',
      yogaEn: 'Dwi-Guru Lakshmi & Kalatra Yoga (Transit Jupiter on Natal Venus)',
      primaryTe: `గోచార గురువు మీ జన్మ శుక్రుడు ఉన్న ${venRashi.te} (${venPl.degreeFormatted}) రాశిపై లేదా దాని 5, 9, 7 రాశులలో (${getTrineRashisLabel(venPl.rashiIdx).te}) సంచరించే సంవత్సరాలు 'ఆనంద భోగ' వసంత కాలం! అవివాహితులకు వివాహ యోగం, వివాహితులకు దాంపత్య సౌఖ్యం, నూతన గృహ ప్రవేశం, ఖరీదైన వాహనం మరియు అఖండ ధన ప్రవాహం కలుగుతాయి.`,
      primaryEn: `Transit Jupiter over or trining Natal Venus in ${venRashi.en} unlocks Ananda Bhoga: marriage for singles, marital harmony, new housewarming, luxury vehicles, jewelry, and strong wealth accumulation.`,
      breakersTe: 'రాహువు/కుజుడు ఏకకాలంలో తోడైతే విలాస ఖర్చులు పెరగవచ్చు; ప్రణాళికాబద్ధమైన పొదుపుగా మార్చుకోవాలి.',
      breakersEn: 'Channel surplus income into gold or property investments rather than impulsive luxury spending.',
      mattersTe: 'వివాహ శుభకార్యం, గృహ-వాహన ప్రాప్తి, ఆభరణాలు, భార్య/భర్త తరఫున అదృష్టం, ఆగ్నేయ/తూర్పు వాస్తు అభివృద్ధి.',
      mattersEn: 'Wedding celebrations, home/car purchase, prosperity through spouse, and Southeast Vastu harmony.',
      remedyTe: 'గురువారం మరియు శుక్రవారం శ్రీ లక్ష్మీ నారాయణుల ఆరాధన, ఆవుకు అరటిపండ్లు మరియు బొబ్బర్లు/శనగలు తినిపించండి.',
      remedyEn: 'Worship Sri Lakshmi Narayana on Thursdays/Fridays and feed bananas and cowpeas to a cow.',
    },
    saturn: {
      yogaTe: 'ధర్మ-కర్మాధిపతి నాడీ రాజయోగం (గోచార గురు + జన్మ శని సంయోగం)',
      yogaEn: 'Dharma-Karma Naadi Yoga (Transit Jupiter on Natal Saturn)',
      primaryTe: `భృగు నంది నాడీ సిద్ధాంతంలో గురువు (ధర్మం/జీవుడు) తన గోచారంలో మీ జన్మ శని (${satRashi.te} - ${satPl.degreeFormatted}) రాశిపై లేదా దాని కోణ రాశులలో (${getTrineRashisLabel(satPl.rashiIdx).te}) సంచరించినప్పుడు 'ధర్మ-కర్మ సంయోగం' ఏర్పడుతుంది! చాలా కాలంగా పెండింగ్‌లో ఉన్న ఉద్యోగ ప్రమోషన్లు, నూతన వృత్తి ప్రారంభం, పరిశ్రమలు/భూముల ద్వారా లాభం మరియు కఠిన శ్రమకు తగిన ప్రతిఫలం లభిస్తాయి.`,
      primaryEn: `When Transit Jupiter links with your Natal Saturn in ${satRashi.en} (${getTrineRashisLabel(satPl.rashiIdx).en}), Dharma meets Karma! Long-awaited career promotions, new business ventures, and industrial/property rewards materialize.`,
      breakersTe: 'ఇది బాధ్యతలను పెంచే కాలం; క్రమశిక్షణతో, ధర్మబద్ధంగా పనిచేస్తే అత్యున్నత పీఠాన్ని అధిరోహిస్తారు.',
      breakersEn: 'Responsibilities increase alongside authority; ethical perseverance yields lasting institutional leadership.',
      mattersTe: 'ఉద్యోగ స్థిరత్వం, నూతన బాధ్యతలు, సిబ్బంది సహకారం, దీర్ఘకాలిక ఆస్తుల వృద్ధి, పడమర వాస్తు బలం.',
      mattersEn: 'Career stability, senior appointments, workforce loyalty, and long-term asset creation.',
      remedyTe: 'శనివారం శ్రీ వేంకటేశ్వర స్వామి లేదా ఆంజనేయ స్వామి దర్శనం, నల్ల నువ్వులు-శనగలు-బెల్లం గోగ్రాస దానం.',
      remedyEn: 'Visit Lord Venkateswara or Hanuman temple on Saturdays and feed black sesame, chickpeas & jaggery to a cow.',
    },
    rahu: {
      yogaTe: 'గురు-రాహు పరివర్తన & విదేశీ విస్తరణ యోగం (గోచార గురు + జన్మ రాహు)',
      yogaEn: 'Global Expansion & Shadow Transformation (Transit Jupiter on Natal Rahu)',
      primaryTe: `గోచార గురువు మీ జన్మ రాహువు ఉన్న ${rahRashi.te} (${rahPl.degreeFormatted}) రాశిపై లేదా కోణ రాశులలో సంచరించే సంవత్సరాలలో రాహువు యొక్క మాయా శక్తి గురువు యొక్క జ్ఞానంతో నియంత్రించబడుతుంది. విదేశీ ప్రయాణాలు, MNC/గ్లోబల్ కంపెనీలలో ఉద్యోగాలు, నూతన సాంకేతిక రంగాలలో ఆకస్మిక వృద్ధి మరియు పూర్వజన్మ కర్మల నుండి విముక్తి కలుగుతాయి.`,
      primaryEn: `Transit Jupiter over Natal Rahu in ${rahRashi.en} channels Rahu's vast ambition into structured global opportunities, foreign travel, MNC careers, and protection from illusion.`,
      breakersTe: 'పెద్ద మొత్తంలో స్పెక్యులేషన్ లేదా తెలియని వ్యక్తులతో ఆర్థిక లావాదేవీలలో పెద్దల సలహా తీసుకోవాలి.',
      breakersEn: 'Avoid speculative shortcuts; rely on verified mentors and transparent financial documentation.',
      mattersTe: 'విదేశీ వీసా/ప్రయాణ అనుకూలత, సాంకేతిక ఆవిష్కరణలు, దీర్ఘకాలిక రోగాల నుండి ఉపశమనం, నైరుతి వాస్తు సవరణ.',
      mattersEn: 'Visa/foreign travel success, tech innovation, diagnostic clarity in health, and Southwest Vastu balance.',
      remedyTe: 'గురువారం శ్రీ దత్తాత్రేయ లేదా దుర్గా దేవి ఆరాధన, మినుములు మరియు శనగలు ఆవుకు తినిపించండి.',
      remedyEn: 'Worship Lord Dattatreya or Goddess Durga on Thursdays and feed black gram & chickpeas to a cow.',
    },
    ketu: {
      yogaTe: 'కోటీశ్వర & ధ్వజ-మోక్ష జ్ఞాన యోగం (గోచార గురు + జన్మ కేతు సంయోగం)',
      yogaEn: 'Koteeswara & Spiritual Flag Yoga (Transit Jupiter on Natal Ketu)',
      primaryTe: `మహర్షి నాడీ శాస్త్రంలో గురువు (జీవుడు) మరియు కేతువు (ధ్వజం/మోక్షం) కలయిక 'కోటీశ్వర యోగం' మరియు 'ఆధ్యాత్మిక ధ్వజం'గా వర్ణించబడింది. గోచార గురువు మీ జన్మ కేతువు ఉన్న ${ketRashi.te} (${ketPl.degreeFormatted}) రాశిపై లేదా త్రికోణ రాశులలో (${getTrineRashisLabel(ketPl.rashiIdx).te}) సంచరించే సంవత్సరాలలో పుణ్యక్షేత్ర దర్శనాలు, దైవానుగ్రహం, అంతర్దృష్టి, వైద్య-న్యాయ-జ్యోతిష్య రంగాలలో కీర్తి మరియు ఊహించని ధన నిల్వలు కలుగుతాయి.`,
      primaryEn: `In classical Naadi texts, Jupiter uniting with Ketu in ${ketRashi.en} forms Koteeswara & Dhwaja Yoga—raising your flag of honor, deepening spiritual intuition, pilgrimages, and bestowing quiet wealth accumulation.`,
      breakersTe: 'లౌకిక విషయాలపై తాత్కాలిక వైరాగ్యం కలుగవచ్చు; ధర్మబద్ధమైన కర్తవ్య నిర్వహణపై దృష్టి పెట్టాలి.',
      breakersEn: 'Balance spiritual detachment with active fulfillment of family and professional duties.',
      mattersTe: 'తీర్థయాత్రలు, గురు మంత్రోపదేశం, పూర్వీకుల ఆశీస్సులు, వంశ గౌరవం, ఈశాన్య/వాయువ్య వాస్తు శుద్ధి.',
      mattersEn: 'Sacred pilgrimages, mantra initiation, ancestral blessings, and Northeast spiritual purity.',
      remedyTe: 'గురువారం శ్రీ మహాగణపతికి గరిక పూజ, ఉలవలు మరియు శనగలు బెల్లంతో కలిపి ఆవుకు సమర్పించండి.',
      remedyEn: 'Perform Durva grass pooja to Lord Maha Ganapati and feed horse gram & chickpeas with jaggery to a cow.',
    },
  };

  const chapter13Jupiter: SlowPlanetNaadiTransitCard[] = core9Planets.map((item) => {
    const info = jupiterDataByKey[item.key];
    const rashi = RASHI_NAMES[item.pl.rashiIdx % 12];
    const trines = getTrineRashisLabel(item.pl.rashiIdx);
    const yrCalc = computeJupiterTransitYears(item.pl.rashiIdx, birthYear);
    return {
      planetId: `jup-on-${item.key}`,
      natalPlanetTe: `జన్మ ${item.nameTe}`,
      natalPlanetEn: item.nameEn,
      natalRashiTe: rashi.te,
      natalRashiEn: rashi.en,
      natalDegree: item.pl.degreeFormatted,
      trineRashisTe: trines.te,
      trineRashisEn: trines.en,
      yogaTitleTe: info.yogaTe,
      yogaTitleEn: info.yogaEn,
      accurateYearsBadgeTe: yrCalc.badgeTe,
      accurateYearsBadgeEn: yrCalc.badgeEn,
      accurateYearsDetailTe: yrCalc.detailTe,
      accurateYearsDetailEn: yrCalc.detailEn,
      primaryTransitTe: info.primaryTe,
      primaryTransitEn: info.primaryEn,
      destinyBreakersTe: info.breakersTe,
      destinyBreakersEn: info.breakersEn,
      lifeMattersTe: info.mattersTe,
      lifeMattersEn: info.mattersEn,
      remedyTe: info.remedyTe,
      remedyEn: info.remedyEn,
    };
  });

  // ============================================================================
  // CHAPTER 14 (PAGES 22 & 23): SATURN (KARMA KARAKA) TRANSIT ON 9 NATAL PLANETS
  // ============================================================================
  const saturnDataByKey: Record<
    string,
    {
      yogaTe: string;
      yogaEn: string;
      primaryTe: string;
      primaryEn: string;
      breakersTe: string;
      breakersEn: string;
      mattersTe: string;
      mattersEn: string;
      remedyTe: string;
      remedyEn: string;
    }
  > = {
    sun: {
      yogaTe: 'పితృ-కర్మ పరీక్ష & రాజ్య బాధ్యతా యోగం (గోచార శని + జన్మ రవి)',
      yogaEn: 'Authority Responsibility & Karma Test (Transit Saturn on Natal Sun)',
      primaryTe: `గోచార శని మీ జన్మ రవి (${sunRashi.te} - ${sunPl.degreeFormatted}) రాశిపై లేదా 1-5-9-7 రాశులలో (${getTrineRashisLabel(sunPl.rashiIdx).te}) సంచరించే 2½ సంవత్సరాల కాలంలో వృత్తిలో బరువైన బాధ్యతలు, కఠిన శ్రమ తర్వాత ఉన్నత పదవి లభిస్తాయి. పై అధికారులతో, ప్రభుత్వ విభాగాలతో మరియు తండ్రి గారితో ఓర్పు, వినయం పాటించడం వల్ల గొప్ప విజయాన్ని సాధిస్తారు.`,
      primaryEn: `When Transit Saturn passes over or trines your Natal Sun in ${sunRashi.en}, it brings heavy executive responsibilities that forge lasting leadership. Patience with seniors and care for father's health are essential.`,
      breakersTe: 'గోచార గురువు దృష్టి తోడైతే ప్రభుత్వ కాంట్రాక్టులు, రాజకీయ/అడ్మినిస్ట్రేటివ్ పదవులు లభిస్తాయి.',
      breakersEn: 'Simultaneous Jupiter aspect turns this into an administrative promotion and public service yoga.',
      mattersTe: 'ఉద్యోగ బదిలీ/బాధ్యతల పెరుగుదల, తండ్రి ఆరోగ్య సంరక్షణ, ఎముకలు/కంటి జాగ్రత్త, తూర్పు వాస్తు క్రమశిక్షణ.',
      mattersEn: 'Career restructuring, paternal care, bone/eye vitality care, and disciplined leadership.',
      remedyTe: 'శనివారం శ్రీ ఆంజనేయ స్వామికి తమలపాకుల పూజ, ఆదివారం సూర్య నమస్కారాలు, నువ్వులు-గోధుమలు గోగ్రాస దానం.',
      remedyEn: 'Offer betel leaf garland to Lord Hanuman on Saturdays and feed black sesame & wheat to a cow.',
    },
    moon: {
      yogaTe: 'ఏలినాటి శని / కర్మ-మనస్సు పరిపక్వత యోగం (గోచార శని + జన్మ చంద్ర)',
      yogaEn: 'Sade Sati / Emotional Maturity & Karma Yoga (Transit Saturn on Natal Moon)',
      primaryTe: `గోచార శని మీ జన్మ చంద్రుడు ఉన్న ${RASHI_NAMES[moonPl.rashiIdx % 12].te} (${moonPl.degreeFormatted}) రాశికి 12, 1, 2 రాశులలో సంచరించే కాలాన్ని ఏలినాటి శని అని, కోణ రాశులలో (${getTrineRashisLabel(moonPl.rashiIdx).te}) సంచారాన్ని చంద్ర-శని కర్మ యోగమని పిలుస్తారు. ఇది మిమ్మల్ని మానసికంగా దృఢంగా మార్చి, అనవసర భ్రమలను తొలగించి, స్థిరమైన గృహ/వృత్తి పునాదిని నిర్మిస్తుంది.`,
      primaryEn: `Transit Saturn linking with your Natal Moon in ${RASHI_NAMES[moonPl.rashiIdx % 12].en} builds deep emotional resilience, filters out superficial attachments, and establishes solid domestic and career foundations.`,
      breakersTe: 'గోచార గురువు చంద్రునిపై దృష్టి సారిస్తే ఏలినాటి శనిలోనే వివాహం, గృహ నిర్మాణం మరియు విదేశీ యోగం సిద్ధిస్తాయి.',
      breakersEn: 'When supported by Jupiter’s aspect, this period delivers marriage, house construction, or overseas travel.',
      mattersTe: 'నివాస స్థల మార్పు, తల్లి ఆరోగ్యంపై శ్రద్ధ, జలుబు/వాత నివారణ, ధ్యాన సాధన వల్ల మానసిక ప్రశాంతత.',
      mattersEn: 'Relocation or home renovation, maternal care, Vata/Kapha balance, and inner spiritual strength.',
      remedyTe: 'శనివారం శివాలయంలో తిలాభిషేకం (నువ్వుల నూనె దీపం), రుద్ర నమక-చమక శ్రవణం, బియ్యం-నువ్వులు గోగ్రాస దానం.',
      remedyEn: 'Light sesame oil lamp at a Shiva temple on Saturdays and feed rice mixed with black sesame & jaggery to a cow.',
    },
    mars: {
      yogaTe: 'శని-కుజ కర్మ పోరాట & సాంకేతిక విజయ యోగం (గోచార శని + జన్మ కుజ)',
      yogaEn: 'Technical Mastery & Hard-Won Victory Yoga (Transit Saturn on Natal Mars)',
      primaryTe: `గోచార శని మీ జన్మ కుజుడు ఉన్న ${RASHI_NAMES[marsPl.rashiIdx % 12].te} (${marsPl.degreeFormatted}) రాశిపై సంచరించేటప్పుడు కర్మ కారకుడు (శని) మరియు శక్తి కారకుడు (కుజుడు) కలుస్తారు. ఇంజనీరింగ్, నిర్మాణ రంగం, యంత్రాలు, వ్యవసాయం, భూమి సంబంధిత పనులలో కఠిన శ్రమతో కూడిన విజయం లభిస్తుంది. అయితే ఆవేశం, తొందరపాటు నిర్ణయాలు మరియు వాహన వేగాన్ని నియంత్రించాలి.`,
      primaryEn: `Transit Saturn over Natal Mars in ${RASHI_NAMES[marsPl.rashiIdx % 12].en} merges endurance with raw energy—excellent for engineering, manufacturing, construction, and land projects when executed with patience.`,
      breakersTe: 'గురు దృష్టి ఉంటే భూ-ఆస్తి వివాదాలు మీకు అనుకూలంగా పరిష్కారమవుతాయి; రాహు/కేతు తోడైతే యంత్రాల పట్ల జాగ్రత్త.',
      breakersEn: 'Jupiter aspect resolves property disputes favorably; avoid impulsive disputes with siblings or coworkers.',
      mattersTe: 'భూమి/నిర్మాణ పనులు, సోదరులతో సంయమనం, కండరాలు/రక్తపోటు/దంత ఆరోగ్య శ్రద్ధ, దక్షిణ దిశ వాస్తు క్రమబద్ధీకరణ.',
      mattersEn: 'Construction progress, patience with siblings, blood pressure/dental care, and South Vastu order.',
      remedyTe: 'శనివారం మరియు మంగళవారం ఆంజనేయ స్వామికి సిందూర అర్చన, హనుమాన్ చాలీసా పఠనం, నువ్వులు-కందిపప్పు దానం.',
      remedyEn: 'Chant Hanuman Chalisa on Saturdays/Tuesdays and donate black sesame and red gram.',
    },
    mercury: {
      yogaTe: 'శని-బుధ వృత్తి నైపుణ్య & వాణిజ్య స్థిరత్వ యోగం (గోచార శని + జన్మ బుధ)',
      yogaEn: 'Commercial Mastery & Skill Consolidation Yoga (Transit Saturn on Natal Mercury)',
      primaryTe: `గోచార శని మీ జన్మ బుధుడు ఉన్న ${merRashi.te} (${merPl.degreeFormatted}) రాశిపై లేదా దాని 5, 9 కోణ రాశులలో (${getTrineRashisLabel(merPl.rashiIdx).te}) సంచరించే 2½ ఏళ్లలో మీ బుద్ధి కర్మతో అనుసంధానమవుతుంది! నూతన వృత్తి విద్యా కోర్సులు, సాఫ్ట్‌వేర్/అకౌంట్స్/ఆడిటింగ్/వ్యాపార రంగాలలో దీర్ఘకాలిక ఒప్పందాలు, స్థల కొనుగోలు మరియు రచనా-పరిశోధనా విజయాలు లభిస్తాయి.`,
      primaryEn: `Transit Saturn linking with Natal Mercury in ${merRashi.en} grounds your intellect into practical professional mastery, long-term commercial contracts, IT/accounting growth, and land investments.`,
      breakersTe: 'కేతువు తోడైతే నరాల అలసట రాకుండా విశ్రాంతి తీసుకోవాలి; శుక్రుడు తోడైతే వ్యాపార లాభాలు రెట్టింపు అవుతాయి.',
      breakersEn: 'Venus link doubles business profits; ensure adequate rest to prevent nervous fatigue.',
      mattersTe: 'వృత్తిలో శాశ్వత గుర్తింపు, వ్యాపార విస్తరణ, ఆర్థిక ప్రణాళిక, ఉత్తర/పడమర దిశల గృహ-కార్యాలయ అనుకూలత.',
      mattersEn: 'Permanent career credentials, business structure, disciplined accounting, and West/North Vastu gains.',
      remedyTe: 'శనివారం శ్రీ మహావిష్ణువు మరియు ఆంజనేయ స్వామి ఆరాధన, పెసలు-నల్ల నువ్వులు బెల్లంతో ఆవుకు సమర్పించండి.',
      remedyEn: 'Worship Lord Maha Vishnu and Hanuman on Saturdays and feed green gram & black sesame to a cow.',
    },
    jupiter: {
      yogaTe: 'బృహస్పతి-శని సంచిత పుణ్య కర్మ యోగం (గోచార శని + జన్మ గురు)',
      yogaEn: 'Sanchita Punya Karma Yoga (Transit Saturn on Natal Jupiter)',
      primaryTe: `భృగు నంది నాడీ సంహితలో కర్మ కారకుడైన గోచార శని మీ జీవ కారకుడైన జన్మ గురువు (${jupRashi.te} - ${jupPl.degreeFormatted}) పై లేదా త్రికోణ రాశులలో (${getTrineRashisLabel(jupPl.rashiIdx).te}) సంచరించే కాలం పూర్వజన్మ సుకృతాన్ని (సంచిత పుణ్య కర్మను) ఫలింపజేస్తుంది! సమాజంలో పెద్దరికం, ధార్మిక సంస్థలలో బాధ్యత, ఉద్యోగంలో స్థిరమైన పదోన్నతి, గృహ నిర్మాణం మరియు పెద్దల ఆశీస్సులు లభిస్తాయి.`,
      primaryEn: `When Transit Saturn passes over or trines your Natal Jupiter in ${jupRashi.en}, past-life meritorious karma (Sanchita Punya) ripens into social leadership, career elevation, institutional trust, and asset building.`,
      breakersTe: 'ధర్మ మార్గాన్ని విడిచిపెట్టకుండా, నిజాయితీగా వ్యవహరిస్తే శని భగవానుడు రాజయోగ ఫలితాలను ఇస్తాడు.',
      breakersEn: 'Strict adherence to dharma and integrity guarantees enduring prosperity under Saturn-Jupiter synthesis.',
      mattersTe: 'ఉద్యోగ-వ్యాపార గౌరవం, న్యాయ విజయం, సంతాన బాధ్యతల నిర్వహణ, జీర్ణ/కాలేయ ఆరోగ్య క్రమశిక్షణ.',
      mattersEn: 'Institutional honor, legal victory, fulfillment of family duties, and metabolic discipline.',
      remedyTe: 'శనివారం మరియు గురువారం రావి చెట్టు ప్రదక్షిణ, శ్రీ దత్తాత్రేయ/ఈశ్వర ఆరాధన, శనగలు-నువ్వులు గోగ్రాస దానం.',
      remedyEn: 'Perform Pradakshina around the sacred Peepal tree on Saturdays and feed chickpeas & black sesame to a cow.',
    },
    venus: {
      yogaTe: 'శని-శుక్ర మహాలక్ష్మీ కర్మ-భోగ రాజయోగం (గోచార శని + జన్మ శుక్ర)',
      yogaEn: 'Karma-Bhoga Mahalakshmi Yoga (Transit Saturn on Natal Venus)',
      primaryTe: `మహర్షి నాడీ సిద్ధాంతంలో కర్మ కారకుడైన శని మరియు ధన-ఆనంద కారకుడైన శుక్రుడు ప్రాణమిత్రులు! గోచార శని మీ జన్మ శుక్రుడు ఉన్న ${venRashi.te} (${venPl.degreeFormatted}) రాశిపై లేదా దాని 5, 9, 7 రాశులలో (${getTrineRashisLabel(venPl.rashiIdx).te}) సంచరించే 2½ సంవత్సరాలలో వృత్తి/వ్యాపారాల ద్వారా అఖండ ధన సంపాదన, సొంత ఇల్లు, వాహన ప్రాప్తి మరియు కుటుంబ స్థిరత్వం కలుగుతాయి.`,
      primaryEn: `In Naadi astrology, Saturn (Karma) and Venus (Wealth/Bhoga) are supreme allies! Transit Saturn over or trining your Natal Venus in ${venRashi.en} brings peak career earnings, home ownership, vehicles, and financial security.`,
      breakersTe: 'జీవిత భాగస్వామి ఆరోగ్యం మరియు కంటి/చర్మ/కిడ్నీ ఆరోగ్యంపై తగిన శ్రద్ధ చూపుతూ, ధనాన్ని స్థిరాస్తులలో పెట్టుబడి పెట్టాలి.',
      breakersEn: 'Invest incoming wealth into real estate or gold and maintain attentive care toward spouse’s well-being.',
      mattersTe: 'ఉద్యోగ ఆదాయ పెరుగుదల, గృహ-వాహన కొనుగోలు, వివాహ బంధ స్థిరత్వం, ఆగ్నేయ/పడమర వాస్తు ఐశ్వర్యం.',
      mattersEn: 'Income surge, property/vehicle acquisition, marital steadiness, and West/Southeast Vastu prosperity.',
      remedyTe: 'శనివారం శ్రీ వేంకటేశ్వర స్వామికి తులసి-పద్మ అర్చన, బొబ్బర్లు మరియు నల్ల నువ్వులు ఆవుకు తినిపించండి.',
      remedyEn: 'Worship Lord Venkateswara with Tulasi and lotus flowers on Saturdays and feed cowpeas & sesame to a cow.',
    },
    saturn: {
      yogaTe: 'శని ఆవర్తన (Saturn Return) & కర్మ పునర్నిర్మాణ యోగం (గోచార శని + జన్మ శని)',
      yogaEn: 'Saturn Return & Karmic Mastery Cycle (Transit Saturn on Natal Saturn)',
      primaryTe: `ప్రతి 30 సంవత్సరాలకు ఒకసారి గోచార శని మీ జన్మ శని ఉన్న ${satRashi.te} (${satPl.degreeFormatted}) రాశిపైకి వస్తాడు (29-30, 58-60వ ఏట); ప్రతి 10 ఏళ్లకు ఒకసారి కోణ రాశులలో (${getTrineRashisLabel(satPl.rashiIdx).te}) సంచరిస్తాడు. ఇది మీ వృత్తి జీవితాన్ని కొత్త శిఖరాలకు తీసుకెళ్లే కర్మ పునర్నిర్మాణ కాలం. స్వయం ఉపాధి, ఉన్నత నిర్వహణ పదవులు మరియు దీర్ఘకాలిక ఆస్తులు ఏర్పడతాయి.`,
      primaryEn: `Every 30 years Transit Saturn returns to your Natal Saturn sign ${satRashi.en} (and trines it every 10 years), restructuring your career toward enduring authority, self-reliance, and mature achievement.`,
      breakersTe: 'బద్ధకాన్ని వదిలి, శ్రమను గౌరవించే వారికి శని భగవానుడు జీవితకాలపు ఆర్థిక భద్రతను ప్రసాదిస్తాడు.',
      breakersEn: 'Diligence, humility, and respect for workers unlock lifelong financial security during Saturn Return.',
      mattersTe: 'వృత్తి మార్పు లేదా పదోన్నతి, సొంత వ్యాపార విస్తరణ, కీళ్ల/వాత ఆరోగ్య వ్యాయామం, పడమర దిశ వాస్తు బలం.',
      mattersEn: 'Career milestone, business expansion, joint/mobility exercise, and West-direction Vastu strength.',
      remedyTe: 'ప్రతి శనివారం తిల తైల దీపారాధన, శని స్తోత్ర పఠనం, పక్షులకు/కాకులకు ఆహారం & గోగ్రాస దానం.',
      remedyEn: 'Light sesame oil lamp on Saturdays, recite Shani Stotram, and feed crows and cows.',
    },
    rahu: {
      yogaTe: 'శని-రాహు కర్మ విస్తరణ & సాంకేతిక/విదేశీ యోగం (గోచార శని + జన్మ రాహు)',
      yogaEn: 'Global Karma & Industrial Expansion Yoga (Transit Saturn on Natal Rahu)',
      primaryTe: `గోచార శని మీ జన్మ రాహువు ఉన్న ${rahRashi.te} (${rahPl.degreeFormatted}) రాశిపై లేదా కోణ రాశులలో సంచరించేటప్పుడు విదేశీ కంపెనీలు, భారీ పరిశ్రమలు, మైనింగ్, సాఫ్ట్‌వేర్, రవాణా మరియు ప్రజా సంబంధాల రంగాలలో పెద్ద అవకాశాలు లభిస్తాయి. కఠినమైన పనులను కూడా వ్యూహాత్మకంగా పూర్తి చేస్తారు.`,
      primaryEn: `Transit Saturn over or trining Natal Rahu in ${rahRashi.en} opens large-scale opportunities in global enterprises, technology, logistics, and heavy industries through strategic perseverance.`,
      breakersTe: 'చట్టపరమైన నిబంధనలు, పన్నులు మరియు ఆరోగ్య అలవాట్ల విషయంలో పూర్తి పారదర్శకత పాటించాలి.',
      breakersEn: 'Maintain strict compliance with legal/tax regulations and clean lifestyle habits.',
      mattersTe: 'విదేశీ ఉద్యోగ/వ్యాపార సంబంధాలు, పాత అప్పుల పరిష్కారం, వాత-శ్వాస సంబంధిత జాగ్రత్తలు, నైరుతి వాస్తు క్రమశిక్షణ.',
      mattersEn: 'International career links, debt restructuring, respiratory/joint care, and Southwest Vastu stability.',
      remedyTe: 'శనివారం శ్రీ కాళహస్తీశ్వర లేదా శివారాధన, నల్ల నువ్వులు మరియు మినుములు బెల్లంతో ఆవుకు సమర్పించండి.',
      remedyEn: 'Perform Shiva Abhishekam on Saturdays and feed black sesame and black gram with jaggery to a cow.',
    },
    ketu: {
      yogaTe: 'శని-కేతు కర్మ వైరాగ్య & సూక్ష్మ నైపుణ్య యోగం (గోచార శని + జన్మ కేతు)',
      yogaEn: 'Dharmic Detachment & Precision Skill Yoga (Transit Saturn on Natal Ketu)',
      primaryTe: `గోచార శని మీ జన్మ కేతువు ఉన్న ${ketRashi.te} (${ketPl.degreeFormatted}) రాశిపై సంచరించే కాలంలో వైద్య, న్యాయ, ఆడిటింగ్, కోడింగ్, నానో-టెక్నాలజీ, జ్యోతిష్య మరియు ఆధ్యాత్మిక సేవా రంగాలలో అద్భుతమైన నైపుణ్యం లభిస్తుంది. నిస్వార్థంగా చేసే కర్మల వల్ల సమాజంలో శాశ్వత గౌరవం కలుగుతుంది.`,
      primaryEn: `Transit Saturn linking with Natal Ketu in ${ketRashi.en} sharpens precision skills in medicine, law, auditing, coding, research, and spiritual service, earning deep respect through selfless work.`,
      breakersTe: 'ఉద్యోగంలో తొందరపడి రాజీనామా చేయకుండా, గురు దృష్టి వచ్చే వరకు సహనంతో వ్యవహరించాలి.',
      breakersEn: 'Avoid impulsive career resignations; plan transitions methodically with expert guidance.',
      mattersTe: 'పరిశోధనా విజయం, ఆధ్యాత్మిక యాత్రలు, పాదాలు/మోకాళ్ల ఆరోగ్య శ్రద్ధ, పూర్వీకుల ధర్మ కార్యాల నిర్వహణ.',
      mattersEn: 'Research breakthroughs, sacred pilgrimages, knee/foot care, and ancestral dharmic service.',
      remedyTe: 'శనివారం శ్రీ గణపతి మరియు ఆంజనేయ స్వామి దర్శనం, నువ్వులు-ఉలవలు బెల్లంతో ఆవుకు తినిపించండి.',
      remedyEn: 'Worship Lord Ganapati and Hanuman on Saturdays and feed black sesame & horse gram to a cow.',
    },
  };

  const chapter14Saturn: SlowPlanetNaadiTransitCard[] = core9Planets.map((item) => {
    const info = saturnDataByKey[item.key];
    const rashi = RASHI_NAMES[item.pl.rashiIdx % 12];
    const trines = getTrineRashisLabel(item.pl.rashiIdx);
    const yrCalc = computeSaturnTransitYears(item.pl.rashiIdx, birthYear);
    return {
      planetId: `sat-on-${item.key}`,
      natalPlanetTe: `జన్మ ${item.nameTe}`,
      natalPlanetEn: item.nameEn,
      natalRashiTe: rashi.te,
      natalRashiEn: rashi.en,
      natalDegree: item.pl.degreeFormatted,
      trineRashisTe: trines.te,
      trineRashisEn: trines.en,
      yogaTitleTe: info.yogaTe,
      yogaTitleEn: info.yogaEn,
      accurateYearsBadgeTe: yrCalc.badgeTe,
      accurateYearsBadgeEn: yrCalc.badgeEn,
      accurateYearsDetailTe: yrCalc.detailTe,
      accurateYearsDetailEn: yrCalc.detailEn,
      primaryTransitTe: info.primaryTe,
      primaryTransitEn: info.primaryEn,
      destinyBreakersTe: info.breakersTe,
      destinyBreakersEn: info.breakersEn,
      lifeMattersTe: info.mattersTe,
      lifeMattersEn: info.mattersEn,
      remedyTe: info.remedyTe,
      remedyEn: info.remedyEn,
    };
  });

  // ============================================================================
  // CHAPTER 15 (PAGES 24 & 25): RAHU TRANSIT ON 9 NATAL PLANETS
  // ============================================================================
  const rahuDataByKey: Record<
    string,
    {
      yogaTe: string;
      yogaEn: string;
      primaryTe: string;
      primaryEn: string;
      breakersTe: string;
      breakersEn: string;
      mattersTe: string;
      mattersEn: string;
      remedyTe: string;
      remedyEn: string;
    }
  > = {
    sun: {
      yogaTe: 'రాహు-రవి గ్రహణ శక్తి & రాజ్య మలుపు యోగం (గోచార రాహు + జన్మ రవి)',
      yogaEn: 'Solar Eclipse Catalyst & Authority Shift (Transit Rahu on Natal Sun)',
      primaryTe: `గోచార రాహువు అపసవ్య దిశలో ప్రయాణిస్తూ మీ జన్మ రవి (${sunRashi.te} - ${sunPl.degreeFormatted}) రాశిపై సంచరించే 18 నెలల కాలంలో రాజకీయ, ప్రభుత్వ, విదేశీ సంస్థలలో ఆకస్మిక గుర్తింపు లేదా బాధ్యతల మార్పు వస్తుంది. అయితే ఆత్మగౌరవం దెబ్బతినకుండా, తండ్రి గారి ఆరోగ్యం మరియు గుండె/కంటి ఆరోగ్యంపై శ్రద్ధ వహించాలి.`,
      primaryEn: `When Transit Rahu moves over your Natal Sun in ${sunRashi.en}, it triggers dramatic visibility in public or global arenas while requiring humility with authorities and care for paternal and cardiovascular health.`,
      breakersTe: 'గోచార గురువు దృష్టి ఉంటే ఈ కాలంలో ఉన్నత పదవి మరియు విదేశీ ప్రయాణ యోగం సిద్ధిస్తాయి.',
      breakersEn: 'Jupiter’s simultaneous aspect converts this transit into high leadership and overseas elevation.',
      mattersTe: 'ఉద్యోగంలో కొత్త మలుపు, ప్రభుత్వ పత్రాల పట్ల అప్రమత్తత, తండ్రి ఆరోగ్య పరీక్షలు, తూర్పు కిటికీల పరిశుభ్రత.',
      mattersEn: 'Career pivot, meticulous government paperwork, paternal health checkups, and clean East ventilation.',
      remedyTe: 'ఆదివారం దుర్గా దేవి మరియు సూర్య ఆరాధన, గోధుమలు మరియు మినుములు ఆవుకు సమర్పించండి.',
      remedyEn: 'Worship Goddess Durga and Lord Surya on Sundays and feed wheat & black gram to a cow.',
    },
    moon: {
      yogaTe: 'రాహు-చంద్ర మనో-విదేశీ ప్రయాణ & భావోద్వేగ యోగం (గోచార రాహు + జన్మ చంద్ర)',
      yogaEn: 'Overseas Travel & Intuitive Expansion (Transit Rahu on Natal Moon)',
      primaryTe: `గోచార రాహువు మీ జన్మ చంద్రుడు ఉన్న ${RASHI_NAMES[moonPl.rashiIdx % 12].te} (${moonPl.degreeFormatted}) రాశిపై సంచరించే 1½ సంవత్సరాలలో విదేశీ ప్రయాణాలు, నివాస మార్పు, డిజిటల్/మీడియా/ఎగుమతి రంగాలలో ఆకస్మిక వృద్ధి కలుగుతాయి. ఊహాజనిత భయాలు, నిద్రలేమి రాకుండా నిత్యం ధ్యానం, ప్రాణాయామం చేయడం ఎంతో మేలు చేస్తుంది.`,
      primaryEn: `Transit Rahu over Natal Moon in ${RASHI_NAMES[moonPl.rashiIdx % 12].en} stimulates overseas travel, digital/media breakthroughs, and relocation, while calling for mindfulness to keep emotional imagination calm.`,
      breakersTe: 'గురు దృష్టి ఉంటే మానసిక ధైర్యం పెరిగి ఆర్థికంగా పెద్ద విజయాన్ని అందుకుంటారు.',
      breakersEn: 'Jupiter aspect stabilizes the mind and channels imagination into lucrative creative projects.',
      mattersTe: 'విదేశీ/దూర ప్రయాణాలు, తల్లి ఆరోగ్య సంరక్షణ, ఆహార-నీటి పరిశుభ్రత, వాయువ్య దిశ వాస్తు క్రమబద్ధీకరణ.',
      mattersEn: 'Long-distance travel, maternal health care, pure water/food habits, and Northwest Vastu balance.',
      remedyTe: 'సోమవారం శివాలయంలో అభిషేకం, శ్రీ దుర్గా దేవి అర్చన, బియ్యం-మినుములు బెల్లంతో గోగ్రాస దానం.',
      remedyEn: 'Perform Shiva Abhishekam on Mondays, worship Goddess Durga, and feed rice & black gram to a cow.',
    },
    mars: {
      yogaTe: 'రాహు-కుజ శౌర్య-సాంకేతిక & దేహ రక్షణ యోగం (గోచార రాహు + జన్మ కుజ)',
      yogaEn: 'Technological Audacity & Vitality Shield (Transit Rahu on Natal Mars)',
      primaryTe: `గోచార రాహువు మీ జన్మ కుజుడు ఉన్న ${RASHI_NAMES[marsPl.rashiIdx % 12].te} (${marsPl.degreeFormatted}) రాశిపై సంచరించే కాలంలో అసాధారణమైన సాహసం, సాంకేతిక/డిఫెన్స్/రియల్ ఎస్టేట్/క్రీడా రంగాలలో దూకుడు పెరుగుతాయి. అయితే తొందరపాటు నిర్ణయాలు, వాహన వేగం, కోపం మరియు సోదరులతో విభేదాలకు దూరంగా ఉండాలి.`,
      primaryEn: `Transit Rahu over Natal Mars in ${RASHI_NAMES[marsPl.rashiIdx % 12].en} generates bold technological and competitive drive; channel this high voltage into disciplined workouts and work while avoiding road haste.`,
      breakersTe: 'స్త్రీ జాతకంలో కుజునిపై రాహువు వెళ్లేటప్పుడు భర్త ఆరోగ్యం మరియు కుటుంబ సామరస్యంపై ప్రత్యేక శ్రద్ధ చూపాలి.',
      breakersEn: 'In female charts, this transit calls for attentive care toward husband’s health and domestic harmony.',
      mattersTe: 'సాంకేతిక విజయాలు, రక్తదానం/వ్యాయామం వల్ల శక్తి సమతుల్యత, భూమి పత్రాల పరిశీలన, దక్షిణ వాస్తు రక్షణ.',
      mattersEn: 'Technical breakthroughs, regular physical exercise, careful property documentation, and South Vastu care.',
      remedyTe: 'మంగళవారం శ్రీ సుబ్రహ్మణ్య లేదా నరసింహ స్వామి ఆరాధన, కందిపప్పు-మినుములు గోగ్రాస దానం.',
      remedyEn: 'Worship Lord Subrahmanya or Narasimha on Tuesdays and feed red gram & black gram to a cow.',
    },
    mercury: {
      yogaTe: 'రాహు-బుధ డిజిటల్-AI-వాణిజ్య మేధా యోగం (గోచార రాహు + జన్మ బుధ)',
      yogaEn: 'Digital Innovation & Global Commerce Yoga (Transit Rahu on Natal Mercury)',
      primaryTe: `గోచార రాహువు మీ జన్మ బుధుడు ఉన్న ${merRashi.te} (${merPl.degreeFormatted}) రాశిపై లేదా త్రికోణ రాశులలో (${getTrineRashisLabel(merPl.rashiIdx).te}) సంచరించే 18 నెలలు సాఫ్ట్‌వేర్, AI, కమ్యూనికేషన్స్, మీడియా, విదేశీ వాణిజ్యం మరియు స్టాక్/ఫైనాన్స్ విశ్లేషణలకు అద్భుతమైన ఆలోచనలను ఇస్తాయి.`,
      primaryEn: `Transit Rahu linking with Natal Mercury in ${merRashi.en} supercharges out-of-the-box intelligence in software, AI, media, international trade, and financial analytics.`,
      breakersTe: 'సంతకాలు చేసేటప్పుడు, హామీలు (Surety) ఇచ్చేటప్పుడు భ్రమలకు లోనుకాకుండా నిపుణుల సలహా తీసుకోవాలి.',
      breakersEn: 'Avoid standing surety for others and verify all legal/financial clauses before signing.',
      mattersTe: 'నూతన టెక్నాలజీ నైపుణ్యం, విదేశీ భాషా/వ్యాపార లాభం, నరాల/చర్మ ఆరోగ్య శ్రద్ధ, ఉత్తర వాస్తు అభివృద్ధి.',
      mattersEn: 'New tech mastery, foreign trade/language gains, skin/nerve care, and North Vastu enhancement.',
      remedyTe: 'బుధవారం శ్రీ విష్ణు సహస్రనామ పారాయణ, పెసలు మరియు మినుములు బెల్లంతో ఆవుకు తినిపించండి.',
      remedyEn: 'Chant Vishnu Sahasranama on Wednesdays and feed green gram and black gram to a cow.',
    },
    jupiter: {
      yogaTe: 'జీవ-రాహు సంధానం & భౌతిక విస్తరణ యోగం (గోచార రాహు + జన్మ గురు)',
      yogaEn: 'Jeeva-Rahu Material Expansion & Bandhana Shield (Transit Rahu on Natal Jupiter)',
      primaryTe: `గోచార రాహువు మీ జీవ కారకుడైన జన్మ గురువు (${jupRashi.te} - ${jupPl.degreeFormatted}) రాశిపై సంచరించే 18 నెలలలో మీ ఆలోచనలు ఆధ్యాత్మికత నుండి భౌతిక/ఆధునిక/విదేశీ ఆర్థిక లక్ష్యాల వైపు మళ్లుతాయి. విదేశీ ప్రయాణాలు, గ్లోబల్ ప్రాజెక్టులు లభిస్తాయి; అయితే గురు సంప్రదాయాన్ని, పెద్దల సలహాలను విస్మరించకూడదు.`,
      primaryEn: `Transit Rahu over Natal Jupiter in ${jupRashi.en} shifts focus toward ambitious global and material goals; honoring traditional ethics and elders keeps this expansion prosperous and safe.`,
      breakersTe: 'భృగు నాడీ సూత్రం ప్రకారం జన్మ గురువుపై రాహువు వెళ్లేటప్పుడు "జీవ బంధన" రాకుండా నిత్యం శివ/దుర్గా ఆరాధన చేయాలి.',
      breakersEn: 'To prevent Jeeva Bandhana stress during Rahu’s transit over Natal Jupiter, practice daily Shiva or Durga worship.',
      mattersTe: 'విదేశీ అవకాశాలు, పెద్ద ఆర్థిక ప్రణాళికలు, కాలేయ/శ్వాస ఆరోగ్య పరీక్షలు, ఈశాన్య గదిలో బరువులు లేకుండా చూడటం.',
      mattersEn: 'Overseas opportunities, major financial planning, preventive health checkups, and keeping Northeast clutter-free.',
      remedyTe: 'గురువారం శ్రీ దక్షిణామూర్తి & శివ ఆరాధన, శనగలు-మినుములు గోగ్రాస దానం & గో ప్రదక్షిణలు.',
      remedyEn: 'Worship Sri Dakshinamurthy and Lord Shiva on Thursdays, feed chickpeas & black gram to a cow, and perform Go-Pradakshina.',
    },
    venus: {
      yogaTe: 'రాహు-శుక్ర బృహత్ ధన-విలాస-గృహ యోగం (గోచార రాహు + జన్మ శుక్ర)',
      yogaEn: 'Amplified Wealth, Luxury & Glamour Yoga (Transit Rahu on Natal Venus)',
      primaryTe: `భృగు నాడీ జ్యోతిష్యంలో రాహువు ఏ గ్రహాన్ని తాకితే ఆ గ్రహ కారకత్వాన్ని పదింతలు పెంచుతాడు! గోచార రాహువు మీ జన్మ శుక్రుడు ఉన్న ${venRashi.te} (${venPl.degreeFormatted}) రాశిపై లేదా కోణ రాశులలో (${getTrineRashisLabel(venPl.rashiIdx).te}) సంచరించే 18 నెలలలో ఆకస్మిక ధన లాభం, విలాసవంతమైన ఇల్లు, ఖరీదైన కారు, సినీ/కళా/డిజైన్/వ్యాపార రంగాలలో మెరుపు విజయాలు కలుగుతాయి.`,
      primaryEn: `Rahu magnifies Venus’s significations tenfold! Transit Rahu over or trining Natal Venus in ${venRashi.en} brings sudden financial windfalls, lavish home/vehicle upgrades, and success in creative or commercial fields.`,
      breakersTe: 'వివాహేతర ఆకర్షణలకు, దుబారా ఖర్చులకు దూరంగా ఉంటూ జీవిత భాగస్వామి గౌరవాన్ని, ఆరోగ్యాన్ని కాపాడుకోవాలి.',
      breakersEn: 'Maintain marital fidelity, avoid extravagant debt, and prioritize spouse’s health and harmony.',
      mattersTe: 'ఆకస్మిక ఆర్థిక వృద్ధి, నూతన వాహన/గృహ అలంకరణ, ప్రేమ/వివాహ మలుపులు, ఆగ్నేయ వాస్తు పరిశుభ్రత.',
      mattersEn: 'Sudden wealth surge, home/vehicle upgrades, relationship milestones, and clean Southeast Vastu.',
      remedyTe: 'శుక్రవారం శ్రీ దుర్గా దేవికి మరియు మహాలక్ష్మికి కుంకుమార్చన, బొబ్బర్లు-మినుములు బెల్లంతో ఆవుకు తినిపించండి.',
      remedyEn: 'Perform Kumkumarchana to Goddess Durga and Mahalakshmi on Fridays and feed cowpeas & black gram to a cow.',
    },
    saturn: {
      yogaTe: 'రాహు-శని కర్మ విప్లవ & పారిశ్రామిక యోగం (గోచార రాహు + జన్మ శని)',
      yogaEn: 'Industrial Scale & Career Transformation Yoga (Transit Rahu on Natal Saturn)',
      primaryTe: `గోచార రాహువు మీ జన్మ శని ఉన్న ${satRashi.te} (${satPl.degreeFormatted}) రాశిపై సంచరించే కాలంలో మీ వృత్తి జీవితంలో విప్లవాత్మక మార్పులు, నూతన సాంకేతికత స్వీకరణ, విదేశీ క్లయింట్లతో పనులు మరియు భారీ ప్రాజెక్టుల నిర్వహణ జరుగుతాయి. కఠిన శ్రమతో అసాధారణ ఆర్థిక ఫలితాలను సాధిస్తారు.`,
      primaryEn: `Transit Rahu over Natal Saturn in ${satRashi.en} revolutionizes your work methodology, bringing foreign clients, large-scale industrial/IT projects, and massive output through relentless effort.`,
      breakersTe: 'అతిగా పనిచేయడం వల్ల వచ్చే అలసట, కీళ్ల నొప్పులు రాకుండా తగిన విశ్రాంతి తీసుకోవాలి; చట్టబద్ధమైన మార్గంలోనే నడవాలి.',
      breakersEn: 'Balance intense work hours with rest and adhere strictly to ethical and legal standards.',
      mattersTe: 'వృత్తి విస్తరణ, నూతన ఆదాయ మార్గాలు, వాత/ఎముకల ఆరోగ్య శ్రద్ధ, నైరుతి/పడమర వాస్తు బలోపేతం.',
      mattersEn: 'Career scaling, new revenue streams, bone/joint care, and strengthening West/Southwest Vastu.',
      remedyTe: 'శనివారం శ్రీ కాళభైరవ లేదా ఆంజనేయ ఆరాధన, నల్ల నువ్వులు-మినుములు ఆవుకు సమర్పించండి.',
      remedyEn: 'Worship Lord Kalabhairava or Lord Hanuman on Saturdays and feed black sesame & black gram to a cow.',
    },
    rahu: {
      yogaTe: 'రాహు ఆవర్తన (Rahu Return) & కర్మ పథ మార్పు యోగం (గోచార రాహు + జన్మ రాహు)',
      yogaEn: 'Rahu Return & 18-Year Destiny Pivot (Transit Rahu on Natal Rahu)',
      primaryTe: `ప్రతి 18 సంవత్సరాలకు ఒకసారి గోచార రాహువు మీ జన్మ రాహువు ఉన్న ${rahRashi.te} (${rahPl.degreeFormatted}) రాశిపైకి వస్తాడు (18, 36, 54, 72వ ఏట). ఇది జీవితంలో ఒక పెద్ద మలుపును (Destiny Pivot) సూచిస్తుంది: ఉన్నత విద్య/కెరీర్ మార్పు, విదేశీ ప్రయాణం, గృహ మార్పు మరియు కొత్త ఆశయాల ఆవిష్కరణ జరుగుతాయి.`,
      primaryEn: `Every 18 years (ages 18, 36, 54, 72), Transit Rahu returns to your Natal Rahu sign ${rahRashi.en}, triggering a major 18-year destiny pivot in education, career direction, residence, and life ambition.`,
      breakersTe: 'ఈ సమయంలో తొందరపాటు పెట్టుబడులు కాకుండా, అనుభవజ్ఞుల సలహాతో వేసే అడుగులు వచ్చే 18 ఏళ్ల పాటు ఫలితాలను ఇస్తాయి.',
      breakersEn: 'Well-advised decisions made during Rahu Return lay the foundation for the next 18 years of growth.',
      mattersTe: 'జీవిత లక్ష్య పునర్నిర్మాణం, విదేశీ/ఆధునిక అవకాశాలు, అలెర్జీ/నిద్ర జాగ్రత్తలు, నైరుతి దిశ వాస్తు రక్షణ.',
      mattersEn: 'Life goal realignment, global opportunities, immunity/sleep care, and Southwest Vastu protection.',
      remedyTe: 'శ్రీ దుర్గా దేవి ఆరాధన, రాహు కాలంలో దుర్గా దేవికి దీపారాధన, మినుములు-బెల్లం గోగ్రాస దానం.',
      remedyEn: 'Worship Goddess Durga on Tuesdays/Fridays and feed black gram & jaggery to a cow.',
    },
    ketu: {
      yogaTe: 'రాహు-కేతు అక్ష పరివర్తన & అంతర్ముఖ ఆవిష్కరణ యోగం (గోచార రాహు + జన్మ కేతు)',
      yogaEn: 'Nodal Axis Inversion & Karmic Unblocking (Transit Rahu on Natal Ketu)',
      primaryTe: `గోచార రాహువు మీ జన్మ కేతువు ఉన్న ${ketRashi.te} (${ketPl.degreeFormatted}) రాశిపై (మరియు గోచార కేతువు మీ జన్మ రాహువు ${rahRashi.te} పై) సంచరించే కాలం (9, 27, 45, 63వ ఏట) గతంలో ఆగిపోయిన పనులను తిరిగి ప్రారంభిస్తుంది. రహస్య శాస్త్రాలు, వైద్యం, పరిశోధన మరియు ఆధ్యాత్మిక జ్ఞానం భౌతిక విజయానికి తోడ్పడతాయి.`,
      primaryEn: `When Transit Rahu crosses your Natal Ketu in ${ketRashi.en} (around ages 27, 45, 63), previously blocked talents and karmic threads unlock, blending deep intuition with material execution.`,
      breakersTe: 'కుటుంబ సభ్యులతో కమ్యూనికేషన్ గ్యాప్ రాకుండా మనసు విప్పి మాట్లాడటం వల్ల అపార్థాలు తొలగుతాయి.',
      breakersEn: 'Open, transparent communication with family dissolves misunderstandings during nodal inversion.',
      mattersTe: 'నిలిచిపోయిన పనుల కదలిక, ఆధ్యాత్మిక-భౌతిక సమతుల్యత, రోగనిరోధక శక్తి పెంపు, మెట్ల కింద/ద్వార వాస్తు శుద్ధి.',
      mattersEn: 'Revival of stalled projects, spiritual-material balance, immune care, and staircase/entrance Vastu clarity.',
      remedyTe: 'శ్రీ గణపతి మరియు దుర్గా దేవి సంయుక్త ఆరాధన, మినుములు-ఉలవలు బెల్లంతో ఆవుకు తినిపించండి.',
      remedyEn: 'Worship Lord Ganapati and Goddess Durga together and feed black gram & horse gram with jaggery to a cow.',
    },
  };

  const chapter15Rahu: SlowPlanetNaadiTransitCard[] = core9Planets.map((item) => {
    const info = rahuDataByKey[item.key];
    const rashi = RASHI_NAMES[item.pl.rashiIdx % 12];
    const trines = getTrineRashisLabel(item.pl.rashiIdx);
    const yrCalc = computeNodalTransitYears(item.pl.rashiIdx, birthYear, 'rahu');
    return {
      planetId: `rah-on-${item.key}`,
      natalPlanetTe: `జన్మ ${item.nameTe}`,
      natalPlanetEn: item.nameEn,
      natalRashiTe: rashi.te,
      natalRashiEn: rashi.en,
      natalDegree: item.pl.degreeFormatted,
      trineRashisTe: trines.te,
      trineRashisEn: trines.en,
      yogaTitleTe: info.yogaTe,
      yogaTitleEn: info.yogaEn,
      accurateYearsBadgeTe: yrCalc.badgeTe,
      accurateYearsBadgeEn: yrCalc.badgeEn,
      accurateYearsDetailTe: yrCalc.detailTe,
      accurateYearsDetailEn: yrCalc.detailEn,
      primaryTransitTe: info.primaryTe,
      primaryTransitEn: info.primaryEn,
      destinyBreakersTe: info.breakersTe,
      destinyBreakersEn: info.breakersEn,
      lifeMattersTe: info.mattersTe,
      lifeMattersEn: info.mattersEn,
      remedyTe: info.remedyTe,
      remedyEn: info.remedyEn,
    };
  });

  // ============================================================================
  // CHAPTER 16 (PAGES 26 & 27): KETU TRANSIT ON 9 NATAL PLANETS
  // ============================================================================
  const ketuDataByKey: Record<
    string,
    {
      yogaTe: string;
      yogaEn: string;
      primaryTe: string;
      primaryEn: string;
      breakersTe: string;
      breakersEn: string;
      mattersTe: string;
      mattersEn: string;
      remedyTe: string;
      remedyEn: string;
    }
  > = {
    sun: {
      yogaTe: 'శివ-సూర్య ధ్వజ కీర్తి & ఆధ్యాత్మిక తేజో యోగం (గోచార కేతు + జన్మ రవి)',
      yogaEn: 'Flag of Honor & Spiritual Illumination (Transit Ketu on Natal Sun)',
      primaryTe: `మహర్షి నాడీ జ్యోతిష్యంలో కేతువు 'ధ్వజం' (జెండా/కీర్తి) మరియు మోక్ష కారకుడు. గోచార కేతువు మీ జన్మ రవి (${sunRashi.te} - ${sunPl.degreeFormatted}) రాశిపై లేదా కోణ రాశులలో (${getTrineRashisLabel(sunPl.rashiIdx).te}) సంచరించే 18 నెలలలో ధార్మిక, వైద్య, ప్రభుత్వ, పరిశోధనా రంగాలలో నిజాయితీతో కూడిన కీర్తి లభిస్తుంది. ఆత్మవిమర్శ మరియు దైవభక్తి పెరుగుతాయి.`,
      primaryEn: `In Naadi texts, Ketu represents the Flag of Honor (Dhwaja). Transit Ketu over or trining Natal Sun in ${sunRashi.en} brings ethical recognition in medicine, governance, research, and spiritual self-realization.`,
      breakersTe: 'ఉద్యోగంలో తొందరపడి రాజీనామా చేయడం లేదా అధికారులతో వాదనలకు దిగడం నివారించాలి; తండ్రి ఆరోగ్యంపై శ్రద్ధ అవసరం.',
      breakersEn: 'Avoid abrupt career exits or arguments with superiors; attend carefully to father’s vitality.',
      mattersTe: 'ఆధ్యాత్మిక గౌరవం, శివాలయ దర్శనాలు, గుండె/వెన్నెముక/కంటి ఆరోగ్య శ్రద్ధ, తూర్పు దిశలో సూర్యరశ్మి ప్రవేశం.',
      mattersEn: 'Ethical prestige, Shiva temple pilgrimages, spinal/eye care, and bright East sunlight in the home.',
      remedyTe: 'ఆదివారం శ్రీ మహాగణపతి ఆరాధన, సూర్య నమస్కారాలు, గోధుమలు-ఉలవలు గోగ్రాస దానం.',
      remedyEn: 'Worship Lord Maha Ganapati on Sundays and feed wheat & horse gram with jaggery to a cow.',
    },
    moon: {
      yogaTe: 'కేతు-చంద్ర భక్తి-అంతర్దృష్టి & మానసిక ముక్తి యోగం (గోచార కేతు + జన్మ చంద్ర)',
      yogaEn: 'Deep Intuition & Devotional Wisdom Yoga (Transit Ketu on Natal Moon)',
      primaryTe: `గోచార కేతువు మీ జన్మ చంద్రుడు ఉన్న ${RASHI_NAMES[moonPl.rashiIdx % 12].te} (${moonPl.degreeFormatted}) రాశిపై సంచరించే కాలంలో అద్భుతమైన అంతర్దృష్టి (Intuition), మంత్ర సిద్ధి, పుణ్యక్షేత్ర యాత్రలు మరియు జ్యోతిష్య/వైద్య/మనస్తత్వ శాస్త్రాలపై ఆసక్తి పెరుగుతాయి. అనవసర లౌకిక ఆందోళనలను విడిచిపెట్టి దైవ చింతనతో మనశ్శాంతి పొందుతారు.`,
      primaryEn: `Transit Ketu over Natal Moon in ${RASHI_NAMES[moonPl.rashiIdx % 12].en} awakens profound intuition, mantra siddhi, sacred pilgrimages, and healing wisdom.`,
      breakersTe: 'అతిగా ఆలోచించడం (Overthinking) లేదా ఒంటరితనం భావన రాకుండా కుటుంబ సభ్యులతో, సత్సంగాలలో గడపాలి.',
      breakersEn: 'Stay connected with family and uplifting spiritual company to prevent emotional withdrawal.',
      mattersTe: 'పుణ్యక్షేత్ర దర్శనం, తల్లి గారి ఆశీస్సులు & ఆరోగ్య శ్రద్ధ, ధ్యాన-యోగ సాధన, వాయువ్య/ఈశాన్య వాస్తు పవిత్రత.',
      mattersEn: 'Pilgrimages, maternal blessings and care, meditation practice, and pure Northeast Vastu.',
      remedyTe: 'సోమవారం మరియు మంగళవారం శ్రీ మహాగణపతికి గరిక-మోదక నివేదన, బియ్యం-ఉలవలు గోగ్రాస దానం.',
      remedyEn: 'Offer Durva grass and Modaka to Lord Ganapati and feed rice & horse gram with jaggery to a cow.',
    },
    mars: {
      yogaTe: 'కేతు-కుజ విఘ్న నివారణ & శస్త్ర-సాంకేతిక విజయ యోగం (గోచార కేతు + జన్మ కుజ)',
      yogaEn: 'Precision Engineering, Surgery & Obstacle Removal (Transit Ketu on Natal Mars)',
      primaryTe: `గోచార కేతువు మీ జన్మ కుజుడు ఉన్న ${RASHI_NAMES[marsPl.rashiIdx % 12].te} (${marsPl.degreeFormatted}) రాశిపై సంచరించేటప్పుడు సూక్ష్మ సాంకేతికత (Micro-engineering), శస్త్రచికిత్స/వైద్యం, ఫార్మసీ, అగ్ని/విద్యుత్ రంగాలలో నైపుణ్యం పెరుగుతుంది. కోర్టు/భూమి వివాదాలలో తొందరపాటు కాకుండా న్యాయపరమైన రాజీ మార్గం శ్రేయస్కరం.`,
      primaryEn: `Transit Ketu over Natal Mars in ${RASHI_NAMES[marsPl.rashiIdx % 12].en} sharpens precision in surgery, pharmacy, micro-engineering, and technical troubleshooting while advising calm negotiation in land disputes.`,
      breakersTe: 'పదునైన పరికరాలు, అగ్ని, విద్యుత్ మరియు వాహన ప్రయాణాలలో అప్రమత్తత అవసరం; కోపాన్ని జయించాలి.',
      breakersEn: 'Handle sharp instruments, electricity, and vehicles with care; practice calm breathing to cool Pitta.',
      mattersTe: 'సాంకేతిక లోపాల సవరణ, రక్త/పిత్త సమతుల్యత, సోదరులతో సహనం, దక్షిణ దిశలో ఎర్రని దీపారాధన.',
      mattersEn: 'Technical problem-solving, Pitta/blood balance, patience with siblings, and South Vastu harmony.',
      remedyTe: 'మంగళవారం శ్రీ సుబ్రహ్మణ్య స్వామి మరియు గణపతి ఆరాధన, కందిపప్పు-ఉలవలు బెల్లంతో ఆవుకు సమర్పించండి.',
      remedyEn: 'Worship Lord Subrahmanya and Ganapati on Tuesdays and feed red gram & horse gram to a cow.',
    },
    mercury: {
      yogaTe: 'కేతు-బుధ సూక్ష్మ గణిత-కోడింగ్-న్యాయ మేధా యోగం (గోచార కేతు + జన్మ బుధ)',
      yogaEn: 'Coding, Law, Astrology & Nano-Intellect Yoga (Transit Ketu on Natal Mercury)',
      primaryTe: `భృగు నంది నాడీ జ్యోతిష్యంలో కేతువు 'సూక్ష్మ బుద్ధి' మరియు బుధుడు 'తర్క బుద్ధి'. గోచార కేతువు మీ జన్మ బుధుడు ఉన్న ${merRashi.te} (${merPl.degreeFormatted}) రాశిపై లేదా కోణ రాశులలో (${getTrineRashisLabel(merPl.rashiIdx).te}) సంచరించే 18 నెలలలో సాఫ్ట్‌వేర్ కోడింగ్, డేటా సైన్స్, న్యాయశాస్త్రం (Law), ఆడిటింగ్, జ్యోతిష్యం మరియు వేద శాస్త్రాలలో లోతైన పాండిత్యం లభిస్తుంది.`,
      primaryEn: `Transit Ketu linking with Natal Mercury in ${merRashi.en} bestows laser-sharp analytical genius in software coding, data science, law, auditing, astrology, and research.`,
      breakersTe: 'వ్యాపార భాగస్వామ్యాలలో మరియు భూమి రిజిస్ట్రేషన్లలో ప్రతి పత్రాన్ని క్షుణ్ణంగా చదివి నిర్ణయం తీసుకోవాలి.',
      breakersEn: 'Review all commercial partnership deeds and land documents thoroughly before execution.',
      mattersTe: 'పరిశోధనా/కోడింగ్ విజయాలు, న్యాయ-శాస్త్ర జ్ఞానం, నరాల/మెడ ఆరోగ్య వ్యాయామం, ఉత్తర వాస్తు శుద్ధి.',
      mattersEn: 'Coding/research breakthroughs, legal acumen, neck/nerve ergonomics, and North Vastu clarity.',
      remedyTe: 'బుధవారం శ్రీ మహాగణపతికి మరియు విష్ణుమూర్తికి అర్చన, పెసలు-ఉలవలు బెల్లంతో ఆవుకు తినిపించండి.',
      remedyEn: 'Worship Lord Ganapati and Maha Vishnu on Wednesdays and feed green gram & horse gram to a cow.',
    },
    jupiter: {
      yogaTe: 'కేతు-గురు కోటీశ్వర & కేశ ముండన మోక్ష యోగం (గోచార కేతు + జన్మ గురు)',
      yogaEn: 'Koteeswara & Sacred Pilgrimage Yoga (Transit Ketu on Natal Jupiter)',
      primaryTe: `గోచార కేతువు మీ జీవ కారకుడైన జన్మ గురువు (${jupRashi.te} - ${jupPl.degreeFormatted}) రాశిపై లేదా త్రికోణ రాశులలో (${getTrineRashisLabel(jupPl.rashiIdx).te}) సంచరించే 18 నెలలు అత్యంత పవిత్రమైనవి! మహర్షి నాడీ సంహిత రహస్యం ప్రకారం ఈ కాలంలో పుణ్యక్షేత్రంలో (తిరుమల/పళని/కాశీ మొదలైన చోట్ల) 'కేశ ముండనం' (తలనీలాలు సమర్పించడం) చేయడం వల్ల సమస్త జీవ బంధన దోషాలు తొలగిపోయి కోటీశ్వర యోగం, సంతాన వృద్ధి మరియు దైవ రక్షణ కలుగుతాయి.`,
      primaryEn: `When Transit Ketu passes over or trines your Natal Jupiter in ${jupRashi.en}, offering Kesha Mundana (sacred tonsure at a pilgrimage temple like Tirumala) dissolves Jeeva Bandhana and unlocks Koteeswara Yoga and divine grace.`,
      breakersTe: 'పెద్దలు, గురువులు మరియు సంప్రదాయాల పట్ల భక్తి శ్రద్ధలు కలిగి ఉండటం వల్ల అడ్డంకులన్నీ ఆశీస్సులుగా మారుతాయి.',
      breakersEn: 'Reverence toward Gurus, elders, and sacred traditions transforms every obstacle into a blessing.',
      mattersTe: 'తిరుమల/పుణ్యక్షేత్ర దర్శనం, గురు కటాక్షం, గౌరవ పురస్కారాలు, ఈశాన్య పూజా మందిర పవిత్రత.',
      mattersEn: 'Sacred temple pilgrimages, Guru’s blessings, ethical honors, and Northeast altar sanctification.',
      remedyTe: 'పుణ్యక్షేత్రంలో తలనీలాలు సమర్పించడం, శ్రీ గణపతి-దక్షిణామూర్తి ఆరాధన, శనగలు-ఉలవలు గోగ్రాస దానం.',
      remedyEn: 'Offer sacred tonsure (Kesha Daan) at a holy shrine, worship Ganapati & Dakshinamurthy, and feed chickpeas & horse gram to a cow.',
    },
    venus: {
      yogaTe: 'కేతు-శుక్ర దైవిక లక్ష్మీ & గృహ-కళా యోగం (గోచార కేతు + జన్మ శుక్ర)',
      yogaEn: 'Sacred Lakshmi & Spiritual Artistry Yoga (Transit Ketu on Natal Venus)',
      primaryTe: `గోచార కేతువు మీ జన్మ శుక్రుడు ఉన్న ${venRashi.te} (${venPl.degreeFormatted}) రాశిపై లేదా కోణ రాశులలో (${getTrineRashisLabel(venPl.rashiIdx).te}) సంచరించే కాలంలో ఆధ్యాత్మిక కళలు, సంప్రదాయ ఆభరణాలు, వైద్యం, డిజైన్ మరియు ధార్మిక సేవా కార్యక్రమాల ద్వారా ధన లాభం కలుగుతుంది. ఇంట్లో శుభకార్యాలు, వ్రతాలు, పూజలు జరుగుతాయి.`,
      primaryEn: `Transit Ketu over or trining Natal Venus in ${venRashi.en} brings prosperity through traditional arts, healing, design, sacred jewelry, and auspicious religious ceremonies at home.`,
      breakersTe: 'జీవిత భాగస్వామితో చిన్నపాటి అలకలు రాకుండా సహనంతో, ప్రేమతో వ్యవహరించాలి; వాహన నిర్వహణపై శ్రద్ధ పెట్టాలి.',
      breakersEn: 'Practice affectionate communication with your spouse and keep vehicles well-maintained.',
      mattersTe: 'ఇంట్లో వైదిక వ్రతాలు/పూజలు, సంప్రదాయ ఆస్తుల రక్షణ, చర్మ/హార్మోన్ ఆరోగ్య శ్రద్ధ, ఆగ్నేయ దీపారాధన.',
      mattersEn: 'Sacred Vratas at home, preservation of family assets, hormonal/skin care, and Southeast lamp lighting.',
      remedyTe: 'శుక్రవారం శ్రీ వరలక్ష్మీ/మహాలక్ష్మీ ఆరాధన మరియు గణపతి పూజ, బొబ్బర్లు-ఉలవలు బెల్లంతో ఆవుకు తినిపించండి.',
      remedyEn: 'Worship Goddess Mahalakshmi and Lord Ganapati on Fridays and feed cowpeas & horse gram to a cow.',
    },
    saturn: {
      yogaTe: 'కేతు-శని నిష్కామ కర్మ & వృత్తి నైపుణ్య ముక్తి యోగం (గోచార కేతు + జన్మ శని)',
      yogaEn: 'Mastery in Specialized Karma & Liberation (Transit Ketu on Natal Saturn)',
      primaryTe: `గోచార కేతువు మీ జన్మ శని ఉన్న ${satRashi.te} (${satPl.degreeFormatted}) రాశిపై సంచరించే 18 నెలలలో గత కర్మల భారం తగ్గి, ప్రత్యేక నైపుణ్యం కలిగిన రంగాలలో (వైద్యం, న్యాయం, ఆడిట్, IT ఆర్కిటెక్చర్, ఆధ్యాత్మిక బోధన) స్థిరమైన గౌరవం లభిస్తుంది. తొందరపడి ఉద్యోగం మానేయకుండా, ప్రణాళికతో వ్యవహరించాలి.`,
      primaryEn: `Transit Ketu over Natal Saturn in ${satRashi.en} resolves old karmic debts and elevates specialized expertise in medicine, law, IT architecture, and dharmic service.`,
      breakersTe: 'గోచార గురువు దృష్టి తోడైనప్పుడు వృత్తిలో ఉన్నత సలహాదారు (Advisor/Consultant) స్థాయికి ఎదుగుతారు.',
      breakersEn: 'With Jupiter’s aspect, you rise to a respected advisory or senior consultant position.',
      mattersTe: 'ప్రత్యేక వృత్తి గౌరవం, పాత వివాదాల ముగింపు, మోకాళ్లు/కీళ్ల యోగాభ్యాసం, పడమర వాస్తు శుభ్రత.',
      mattersEn: 'Specialized professional authority, closure of old disputes, joint flexibility yoga, and clean West Vastu.',
      remedyTe: 'శనివారం శ్రీ మహాగణపతి మరియు ఆంజనేయ ఆరాధన, నల్ల నువ్వులు-ఉలవలు గోగ్రాస దానం.',
      remedyEn: 'Worship Lord Ganapati and Lord Hanuman on Saturdays, feeding sesame & horse gram to a cow.',
    },
    rahu: {
      yogaTe: 'కేతు-రాహు మాయా నివృత్తి & ఆధ్యాత్మిక జాగృతి యోగం (గోచార కేతు + జన్మ రాహు)',
      yogaEn: 'Dissolution of Illusion & Karmic Clarity (Transit Ketu on Natal Rahu)',
      primaryTe: `గోచార కేతువు మీ జన్మ రాహువు ఉన్న ${rahRashi.te} (${rahPl.degreeFormatted}) రాశిపై సంచరించే కాలంలో గతంలోని భ్రమలు, తప్పుడు స్నేహాలు లేదా నష్టదాయక అలవాట్ల నుండి బయటపడతారు. విదేశీ నివాసం లేదా ఆధునిక రంగాలలో ఉన్నవారికి ఆధ్యాత్మిక శాంతి, స్పష్టత మరియు పూర్వీకుల ఆశీస్సులు లభిస్తాయి.`,
      primaryEn: `Transit Ketu over Natal Rahu in ${rahRashi.en} clears past illusions, filters out unhelpful associations, and brings spiritual clarity and ancestral protection.`,
      breakersTe: 'ఆకస్మిక ఆర్థిక సాహసాలకు పోకుండా, ఉన్న ఆస్తులను మరియు ఆరోగ్యాన్ని కాపాడుకోవడం ఉత్తమ వ్యూహం.',
      breakersEn: 'Focus on consolidating existing assets and wellness rather than risky speculative ventures.',
      mattersTe: 'మానసిక స్పష్టత, పూర్వీకుల పితృ/కుటుంబ ఆశీస్సులు, శ్వాస/రోగనిరోధక శక్తి పెంపు, నైరుతి వాస్తు పవిత్రత.',
      mattersEn: 'Mental clarity, ancestral blessings, respiratory/immune wellness, and Southwest Vastu order.',
      remedyTe: 'మంగళవారం/ఆదివారం శ్రీ మహాగణపతికి అభిషేకం, మినుములు-ఉలవలు బెల్లంతో ఆవుకు తినిపించండి.',
      remedyEn: 'Perform Abhishekam to Lord Maha Ganapati and feed black gram & horse gram with jaggery to a cow.',
    },
    ketu: {
      yogaTe: 'కేతు ఆవర్తన (Ketu Return) & మోక్ష-ప్రజ్ఞా వికాస యోగం (గోచార కేతు + జన్మ కేతు)',
      yogaEn: 'Ketu Return & 18-Year Spiritual Wisdom Cycle (Transit Ketu on Natal Ketu)',
      primaryTe: `ప్రతి 18 సంవత్సరాలకు ఒకసారి గోచార కేతువు మీ జన్మ కేతువు ఉన్న ${ketRashi.te} (${ketPl.degreeFormatted}) రాశిపైకి వస్తాడు (18, 36, 54, 72వ ఏట). ఇది మీ అంతరాత్మ ప్రజ్ఞను మేల్కొలిపే కాలం. జ్యోతిష్యం, వేదాంతం, పరిశోధన, వైద్యం మరియు ధార్మిక సేవలలో అపూర్వమైన అంతర్దృష్టి లభిస్తుంది.`,
      primaryEn: `Every 18 years (ages 18, 36, 54, 72), Transit Ketu returns to your Natal Ketu sign ${ketRashi.en}, awakening higher intuition, research mastery, and spiritual fulfillment.`,
      breakersTe: 'లౌకిక బాధ్యతలను నిర్లక్ష్యం చేయకుండా, ఆధ్యాత్మిక శక్తిని కుటుంబ మరియు సమాజ శ్రేయస్సుకు వినియోగించాలి.',
      breakersEn: 'Integrate spiritual insight into practical family and professional service.',
      mattersTe: 'మంత్ర జప సిద్ధి, అంతర్దృష్టితో సరైన నిర్ణయాలు, వెన్నెముక/నాడీ వ్యవస్థ ఆరోగ్యం, పూజా మందిర తేజస్సు.',
      mattersEn: 'Mantra siddhi, intuitive decision-making, nervous system vitality, and sacred altar radiance.',
      remedyTe: 'ప్రతిరోజూ శ్రీ మహాగణపతి ఆరాధన, ఉలవలు (Horse gram) మరియు బెల్లం ఆవుకు సమర్పించి ప్రదక్షిణలు చేయండి.',
      remedyEn: 'Worship Lord Maha Ganapati daily and feed soaked horse gram with jaggery to a cow.',
    },
  };

  const chapter16Ketu: SlowPlanetNaadiTransitCard[] = core9Planets.map((item) => {
    const info = ketuDataByKey[item.key];
    const rashi = RASHI_NAMES[item.pl.rashiIdx % 12];
    const trines = getTrineRashisLabel(item.pl.rashiIdx);
    const yrCalc = computeNodalTransitYears(item.pl.rashiIdx, birthYear, 'ketu');
    return {
      planetId: `ket-on-${item.key}`,
      natalPlanetTe: `జన్మ ${item.nameTe}`,
      natalPlanetEn: item.nameEn,
      natalRashiTe: rashi.te,
      natalRashiEn: rashi.en,
      natalDegree: item.pl.degreeFormatted,
      trineRashisTe: trines.te,
      trineRashisEn: trines.en,
      yogaTitleTe: info.yogaTe,
      yogaTitleEn: info.yogaEn,
      accurateYearsBadgeTe: yrCalc.badgeTe,
      accurateYearsBadgeEn: yrCalc.badgeEn,
      accurateYearsDetailTe: yrCalc.detailTe,
      accurateYearsDetailEn: yrCalc.detailEn,
      primaryTransitTe: info.primaryTe,
      primaryTransitEn: info.primaryEn,
      destinyBreakersTe: info.breakersTe,
      destinyBreakersEn: info.breakersEn,
      lifeMattersTe: info.mattersTe,
      lifeMattersEn: info.mattersEn,
      remedyTe: info.remedyTe,
      remedyEn: info.remedyEn,
    };
  });

  // ============================================================================
  // CHAPTER 17 (PAGE 28): NAADI VASTU, FOOD LIKING, DREAM VISUALS & AYURVEDA
  // ============================================================================
  const chapter17Diagnostics: NaadiLifeDiagnosticsCard[] = [
    {
      id: 'diag-vastu',
      categoryTe: '1. నాడీ గోచార గృహ వాస్తు దిశా విశ్లేషణ (Naadi Vastu Directions)',
      categoryEn: '1. Personalized Naadi Vastu Directions & Sacred Space Alignment',
      badgeTe: `జీవ దిశ: ${jupRashi.directionTe} · కర్మ దిశ: ${satRashi.directionTe}`,
      badgeEn: 'Jeeva & Karma Vastu Alignment',
      titleTe: `మీ జన్మ గురు (${jupRashi.te}), శుక్ర (${venRashi.te}) & శని (${satRashi.te}) రాశుల ఆధారంగా గృహ వాస్తు రహస్యాలు`,
      titleEn: `Home & Office Vastu Secrets Based on Your Natal Jupiter (${jupRashi.en}), Venus (${venRashi.en}) & Saturn (${satRashi.en})`,
      accurateYearsTe: `📅 గృహ నిర్మాణ / నవీకరణ / స్థల కొనుగోలుకు ఖచ్చితమైన అనుకూల సంవత్సరాలు: ${jupOnVen.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}`,
      accurateYearsEn: `📅 Exact Favorable Years for Home Construction / Renovation / Property Purchase: ${jupOnVen.badgeEn.replace('Exact Manifestation Years: ', '')}`,
      detailsTe: `మహర్షి ప్రణీత నాడీ వాస్తు సిద్ధాంతం ప్రకారం మేష-సింహ-ధనుస్సు రాశులు 'తూర్పు దిశ'ను, వృషభ-కన్య-మకర రాశులు 'దక్షిణ దిశ'ను, మిథున-తుల-కుంభ రాశులు 'పడమర దిశ'ను, కర్కాటక-వృశ్చిక-మీన రాశులు 'ఉత్తర/ఈశాన్య దిశ'ను సూచిస్తాయి. మీ జీవ కారకుడైన గురువు ${jupRashi.te} (${jupRashi.directionTe}) లో ఉండటం వల్ల మీ ఇంటిలో ${jupRashi.directionTe} మరియు ఈశాన్య మూల ఎల్లప్పుడూ పరిశుభ్రంగా, వెలుతురుతో, బరువులు లేకుండా ఉండాలి. మీ ధన కారకుడైన శుక్రుడు ${venRashi.te} (${venRashi.directionTe}) లో ఉన్నందున ఆ దిశలో లక్ష్మీ చిహ్నం లేదా సువాసన పుష్పాలు ఉంచడం వల్ల ధన ప్రవాహం నిరంతరం కొనసాగుతుంది. రాహువు ఉన్న ${rahRashi.directionTe} మరియు కేతువు ఉన్న ${ketRashi.directionTe} లలో పాత ఇనుప సామాన్లు, పగిలిన అద్దాలు ఉంచరాదు.`,
      detailsEn: `In Naadi Vastu, Fire signs govern East, Earth signs South, Air signs West, and Water signs North. With your Natal Jupiter in ${jupRashi.en} (${jupRashi.directionTe}) and Venus in ${venRashi.en} (${venRashi.directionTe}), keeping these zones bright, clutter-free, and sanctified attracts continuous prosperity.`,
      remedyOrActionTe: `వాస్తు సూచన: ప్రతి గురు, శుక్రవారాలలో ఇంటి ఈశాన్యం మరియు ${jupRashi.directionTe} లో ఆవు నెయ్యి దీపం వెలిగించండి.`,
      remedyOrActionEn: `Vastu Action: Light a pure cow-ghee lamp in the Northeast and ${jupRashi.en} zone on Thursdays and Fridays.`,
    },
    {
      id: 'diag-food',
      categoryTe: '2. నాడీ గ్రహ ఆహార అభిరుచులు & సాత్విక శక్తి (Naadi Food Liking & Diet)',
      categoryEn: '2. Planetary Food Affinities & Metabolic Harmony',
      badgeTe: 'గ్రహ రుచులు & ఆరోగ్య పోషణ',
      badgeEn: 'Planetary Tastes & Nutrition',
      titleTe: 'మీ జన్మ & గోచార గ్రహ సంయోగాలను బట్టి మారే ఆహార అభిరుచులు మరియు ఆరోగ్య రహస్యం',
      titleEn: 'How Your Natal & Transit Planets Shape Your Taste Preferences and Vitality',
      accurateYearsTe: `📅 రాహు/శని గోచార సంవత్సరాలైన ${rahOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')} లలో సాత్విక ఆహార నియమం తప్పనిసరిగా పాటించాలి`,
      accurateYearsEn: `📅 Strictly maintain a fresh sattvic diet during the Rahu/Saturn transit years: ${rahOnJup.badgeEn.replace('Exact Manifestation Years: ', '')}`,
      detailsTe: `సనాతన నాడీ సంహితలలో ప్రతి గ్రహానికి ఒక నిర్దిష్ట రుచి మరియు ఆహార తత్వం చెప్పబడింది: గురువు (తీపి, నెయ్యి, శనగలు, పండ్లు), శుక్రుడు (మధురమైన పానీయాలు, పాలు, పెరుగు, బొబ్బర్లు, సుగంధ ద్రవ్యాలు), రవి-కుజులు (కారం, వేడి ఆహారం, గోధుమలు, కందిపప్పు), బుధుడు (ఆకుకూరలు, పెసలు, సమతుల్య ఆహారం), శని-రాహువులు (నువ్వులు, మినుములు, పులుపు/వగరు). గోచారంలో గురువు లేదా శుక్రుడు మీ జన్మ చంద్ర (${RASHI_NAMES[moonPl.rashiIdx % 12].te}) లేదా గురు (${jupRashi.te}) రాశిని తాకినప్పుడు సాత్విక, మధుర ఆహారంపై ఇష్టం పెరుగుతుంది; రాహు/కుజ గోచారంలో కారం, బయటి ఆహారం వైపు మనస్సు లాగుతుంది కాబట్టి ఆ సమయంలో సాత్విక ఆహార నియమం పాటించాలి.`,
      detailsEn: `Classical Naadi texts map each planet to specific dietary tastes: Jupiter/Venus favor sweet, dairy, and sattvic foods; Sun/Mars favor pungent/spicy grains; Mercury favors greens and moong; Saturn/Rahu crave sesame, urad, and fermented foods. Maintaining sattvic nutrition during Rahu/Mars transits protects digestion.`,
      remedyOrActionTe: 'ఆరోగ్య సూత్రం: మీ జన్మ రాశి అధిపతి మరియు గురు గ్రహ బలం కోసం భోజనానికి ముందు అన్నపూర్ణా దేవి స్మరణ చేయండి.',
      remedyOrActionEn: 'Wellness Rule: Offer gratitude before meals and favor fresh, warm sattvic foods during nodal transits.',
    },
    {
      id: 'diag-dreams',
      categoryTe: '3. నాడీ స్వప్న శకున శాస్త్రం (Dream Visuals & Planetary Omens)',
      categoryEn: '3. Naadi Dream Visuals — Decoding Planetary Transit Signals in Dreams',
      badgeTe: 'స్వప్న సంకేతాల రహస్యం',
      badgeEn: 'Dream Omen Diagnostics',
      titleTe: 'గోచార గ్రహాలు మీ జన్మ గ్రహాలను తాకినప్పుడు వచ్చే కలలు (Dream Visuals) మరియు వాటి అర్థాలు',
      titleEn: 'What Your Dreams Reveal About Active Planetary Transits',
      accurateYearsTe: `📅 శుభ స్వప్న ఫలిత సంవత్సరాలు: ${jupOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')} · స్వప్న శాంతి అవసరమైన కాలం: ${ketOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}`,
      accurateYearsEn: `📅 Auspicious Dream Fulfillment Years: ${jupOnJup.badgeEn.replace('Exact Manifestation Years: ', '')} · Dream Remedy Windows: ${ketOnJup.badgeEn.replace('Exact Manifestation Years: ', '')}`,
      detailsTe: `మహర్షి ప్రణీత నాడీ గోచార సంహితలో గోచార గ్రహాలు జన్మ గ్రహాలతో కలిసినప్పుడు వచ్చే కలల (Dream Visuals) గురించి అద్భుతమైన విశ్లేషణ ఉంది: (1) గురు/శుక్ర/బుధ శుభ గోచార సంవత్సరాలలో: దేవాలయాలు, పండితులు, ఏనుగు, ఆవు, పచ్చని తోటలు, ప్రవహించే స్వచ్ఛమైన నీరు, బంగారు ఆభరణాలు లేదా విమాన ప్రయాణం కలలో కనిపిస్తాయి — ఇవి త్వరలో రాబోయే ధనలాభం మరియు శుభకార్యాలకు సంకేతం! (2) శని/రాహు/కేతు పరీక్షా కాలంలో: పాత భవనాలు, చీకటి దారులు, ఎత్తైన కొండలు ఎక్కడం, సర్పాలు లేదా పరీక్షకు ఆలస్యమైనట్లు కలలు వస్తాయి — ఇవి వచ్చినప్పుడు వెంటనే గోగ్రాస దానం మరియు గణపతి/దుర్గా ఆరాధన చేయాలి.`,
      detailsEn: `Classical Naadi tradition decodes dreams as direct planetary transit indicators: seeing temples, elephants, cows, gardens, or clear water signals incoming Jupiter/Venus fortune; dreaming of dark paths, snakes, or climbing steep hills indicates Saturn/Rahu/Ketu activation calling for immediate cow-feeding and Ganapati/Durga prayers.`,
      remedyOrActionTe: 'స్వప్న శాంతి: పీడకలలు వచ్చిన మరుసటి రోజు ఉదయం శివాలయంలో దీపారాధన చేసి ఆవుకు బెల్లం-ధాన్యం తినిపించండి.',
      remedyOrActionEn: 'Dream Remedy: After any unsettling dream, light a lamp at a Shiva temple and feed jaggery & grains to a cow.',
    },
    {
      id: 'diag-ayurveda',
      categoryTe: '4. నాడీ ఆయుర్వేద త్రిదోష (వాత · పిత్త · కఫ) & ఆరోగ్య రక్షణ పట్టిక',
      categoryEn: '4. Naadi Ayurvedic Tridosha (Vata · Pitta · Kapha) Constitutional Matrix',
      badgeTe: `లగ్న తత్వం: ${lagnaRashi.elementTe}`,
      badgeEn: 'Ayurvedic Constitutional Balance',
      titleTe: `మీ జన్మ లగ్నం (${lagnaRashi.te}), రవి (${sunRashi.te}) & చంద్ర (${RASHI_NAMES[moonPl.rashiIdx % 12].te}) స్థితి ప్రకారం ఆయుర్వేద ఆరోగ్య విశ్లేషణ`,
      titleEn: `Ayurvedic Tridosha Balance Based on Your Ascendant (${lagnaRashi.en}), Sun (${sunRashi.en}) & Moon`,
      accurateYearsTe: `📅 ఆరోగ్య పుష్టి & నూతన శక్తి సంవత్సరాలు: ${jupOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}`,
      accurateYearsEn: `📅 Peak Vitality & Rejuvenation Years: ${jupOnJup.badgeEn.replace('Exact Manifestation Years: ', '')}`,
      detailsTe: `నాడీ ఆయుర్వేద సమన్వయం ప్రకారం రవి-కుజులు 'పిత్త దోషాన్ని' (వేడి, జీర్ణక్రియ, రక్తం), శని-రాహు-బుధులు 'వాత దోషాన్ని' (వాయువు, నరాలు, కీళ్లు), చంద్ర-శుక్ర-గురు-కేతువులు 'కఫ/జల సమతుల్యతను' (రోగనిరోధక శక్తి, హార్మోన్లు, శ్లేష్మం) నియంత్రిస్తారు. మీ జాతకంలో గురువు (${jupRashi.te}) మరియు శని (${satRashi.te}) స్థితిని బట్టి గోచార శని/రాహువులు సంచరించే కాలంలో వాత-కీళ్ల-నిద్ర సమతుల్యత కోసం నువ్వుల నూనె అభ్యంగన స్నానం, ప్రాణాయామం; కుజ/రవి గోచారంలో పిత్త శాంతికి మజ్జిగ, కొబ్బరినీరు, చల్లని సాత్విక ఆహారం తీసుకోవడం వల్ల సంపూర్ణ ఆరోగ్యం సిద్ధిస్తుంది.`,
      detailsEn: `In Naadi Ayurveda, Sun/Mars govern Pitta (heat/blood), Saturn/Rahu/Mercury govern Vata (nerves/joints), and Moon/Venus/Jupiter govern Kapha (immunity/hormones). Balancing Vata with pranayama during Saturn/Rahu transits and cooling Pitta during Mars/Sun transits preserves peak vitality.`,
      remedyOrActionTe: 'ఆరోగ్య నియమం: నిత్యం ఉదయం 15 నిమిషాల సూర్యరశ్మిలో ప్రాణాయామం మరియు ధన్వంతరి స్వామి స్మరణ ఆచరించండి.',
      remedyOrActionEn: 'Vitality Practice: Practice 15 minutes of morning Pranayama in sunlight and invoke Lord Dhanvantari.',
    },
  ];

  // ============================================================================
  // CHAPTER 18 (PAGE 29): NAADI GEMSTONE SECRETS, PURPOSE RULES & COW FEEDING
  // (Zero Sanskrit Slokas — Pure Clear Telugu Sankalpa Purpose & Years)
  // ============================================================================
  const venLonInSign = ((venPl.longitude % 30) + 30) % 30;
  const recommendedDiamondCents =
    venLonInSign <= 3 ? 25 : venLonInSign <= 7 ? 35 : venLonInSign <= 12 ? 45 : venLonInSign <= 18 ? 60 : venLonInSign <= 24 ? 75 : 90;

  const chapter18GemsAndCowRemedies: NaadiGemAndRemedyCard[] = [
    {
      id: 'gem-rule-1',
      badgeTe: 'పారదర్శక రత్నాలు (Transparent Gems) · కారకత్వ వృద్ధి',
      badgeEn: 'Transparent Gems · Enhancing Planetary Karakatwa',
      titleTe: '1. కారకత్వ వృద్ధి రత్న నియమం — మాణిక్యం, పచ్చ, పుష్యరాగం, వజ్రం & నీలం ధారణ రహస్యం',
      titleEn: '1. Karakatwa Enhancement Rule — Ruby, Emerald, Yellow Sapphire, Diamond & Blue Sapphire',
      sankalpaPurposeTe: `🎯 సంకల్ప ఉద్దేశ్యం (తెలుగులో): "నా జాతకంలోని గ్రహ శుభ కారకత్వ వృద్ధి ద్వారా ఆయురారోగ్య, ఐశ్వర్య, విద్యా, ఉద్యోగ అభివృద్ధి సిద్ధించుగాక" అని మనస్సులో సంకల్పించుకుని ధరించాలి.`,
      sankalpaPurposeEn: `🎯 Intention Rule: Wear with the clear intention of strengthening the positive life significations (health, wealth, education, career) of the planet.`,
      explanationTe: `మహర్షి ప్రణీత నాడీ రత్న శాస్త్ర రహస్యం ప్రకారం పారదర్శక రత్నాలైన మాణిక్యం (రవి), మరకత పచ్చ (బుధ), కనక పుష్యరాగం (గురు), వజ్రం (శుక్ర), నీలం (శని) అనేవి ఆయా గ్రహాల బలాన్ని, కారకత్వాలను పెంచడానికి పనిచేస్తాయి. జాతకంలో రవి, బుధ, గురు, శుక్ర, శని గ్రహాలు బలహీనంగా ఉన్నప్పుడు వాటి శుభ కారకత్వాలను (ఉద్యోగం, విద్య, సంతానం, ధనం, ఆయుష్షు) పొందడానికి 'కారకత్వ వృద్ధి సంకల్పం' చెప్పుకుని మాత్రమే ధరించాలి.`,
      explanationEn: `According to classical Naadi Gemstone principles, transparent gems (Ruby, Emerald, Yellow Sapphire, Diamond, Blue Sapphire) concentrate cosmic rays to boost weak planets and enhance their positive significations.`,
      procedureTe: `శుక్ర డిగ్రీ వజ్ర ప్రమాణం: మీ జాతకంలో శుక్రుడు ${venRashi.te} (${venPl.degreeFormatted}) లో ఉన్నాడు; నాడీ డిగ్రీ పట్టిక ప్రకారం శుక్ర బలం కోసం ${recommendedDiamondCents} సెంట్ల (Cents) వజ్రం లేదా జిర్కాన్/వైట్ సఫైర్ వెండి/బంగారు ఉంగరంలో శుక్ర హోరాలో (${jupOnVen.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')} సంవత్సరాలలో) ధరించడం విశేష శుభప్రదం.`,
      procedureEn: `Venus Degree Calibration: Based on your Venus placement at ${venPl.degreeFormatted} in ${venRashi.en}, the Naadi degree-table prescribes a ${recommendedDiamondCents}-cent Diamond (or White Sapphire) set in gold/silver worn during Venus Hora.`,
    },
    {
      id: 'gem-rule-2',
      badgeTe: 'విధి భంజక రత్నాలు (Destiny Breaker Gems) · దోష నివారణ',
      badgeEn: 'Destiny Breaker Gems · Negative Effect Prevention',
      titleTe: '2. దోష నివారణ రత్న నియమం — వైఢూర్యం (కేతు), గోమేధికం (రాహు), పగడం (కుజ) & ముత్యం (చంద్ర)',
      titleEn: '2. Dosha Prevention Rule — Cat’s Eye (Ketu), Hessonite (Rahu), Coral (Mars) & Pearl (Moon)',
      sankalpaPurposeTe: `🛡️ సంకల్ప ఉద్దేశ్యం (తెలుగులో): "గోచారంలో రాహు/కేతు/కుజ గ్రహాల వల్ల కలిగే ఆటంకాలు, బంధన దోషాలు తొలగిపోయి రక్షణ లభించుగాక" అని దోష నివారణ ఉద్దేశ్యంతో మాత్రమే ధరించాలి.`,
      sankalpaPurposeEn: `🛡️ Intention Rule: Wear specifically as a protective shield to neutralize obstacles and transit afflictions caused by Rahu, Ketu, Mars, or Moon.`,
      explanationTe: `నాడీ సిద్ధాంతంలో రాహువు, కేతువు, కుజుడు, చంద్రుడు ఆకస్మిక మలుపులు ఇచ్చే గ్రహాలు. వీటి రత్నాలైన గోమేధికం (రాహు), వైఢూర్యం (కేతు), పగడం (కుజ), ముత్యం (చంద్ర) అపారదర్శక స్వభావం కలిగి ఉంటాయి. గోచారంలో రాహు-కేతు-కుజులు మీ జీవ కారక గురువును (${jupRashi.te}) లేదా శుక్రుని (${venRashi.te}) తాకే సంవత్సరాలలో (${rahOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}), ఆ గ్రహాల దుష్ప్రభావాన్ని అడ్డుకోవడానికి 'దోష నివారణ సంకల్పం' చేసి ధరించాలి. ఆ గోచార కాలం ముగిసిన తర్వాత వీటిని తీసివేయవచ్చు.`,
      explanationEn: `Opaque/translucent gems—Hessonite (Rahu), Cat's Eye (Ketu), Coral (Mars), and Pearl (Moon)—act as protective shields against transit afflictions during ${rahOnJup.badgeEn.replace('Exact Manifestation Years: ', '')}.`,
      procedureTe: 'ముఖ్య సూచన: రత్నాన్ని ధరించే ముందు పచ్చి ఆవు పాలు మరియు శుద్ధ జలంతో అభిషేకించి, ఇష్టదైవాన్ని ప్రార్థించి ఆ గ్రహ హోరాలో ధరించాలి.',
      procedureEn: 'Purify the gemstone in raw cow milk and sacred water, pray to your guiding deity, and wear during the planet’s Hora.',
    },
    {
      id: 'cow-remedy-3',
      badgeTe: 'నాడీ పరమ పరిహారం · కామధేను గోగ్రాస దాన విధానం',
      badgeEn: 'Supreme Naadi Remedy · Kamadhenu Go-Grasa Schedule',
      titleTe: '3. ముక్కోటి దేవతల స్వరూపమైన ఆవుకు (గోమాతకు) నవధాన్య-బెల్లం సమర్పణ & ప్రదక్షిణ రహస్యం',
      titleEn: '3. Sacred Cow Feeding (Go-Grasa) with Soaked Grains, Jaggery & Pradakshina Protocol',
      sankalpaPurposeTe: `🐄 గోగ్రాస దాన ఉద్దేశ్యం: ఆవు శరీరంలో సమస్త దేవతలు, నవగ్రహాలు నివసిస్తారు కాబట్టి గోమాతకు ఆహారం తినిపించడం వల్ల ఏ గ్రహ దోషమైనా, జీవ/దేహ బంధనమైనా తక్షణమే తొలగిపోతుంది.`,
      sankalpaPurposeEn: `🐄 Go-Grasa Purpose: Because all deities and Navagrahas reside in Kamadhenu (the sacred cow), feeding soaked grains with jaggery directly resolves planetary blockages.`,
      explanationTe: `భృగు మరియు అగస్త్య మహర్షి నాడీ సంహితలలో అన్ని గ్రహ దోషాలకు, జీవ/దేహ బంధనాలకు అత్యంత శక్తివంతమైన, ప్రత్యక్ష ఫలితాన్ని ఇచ్చే పరిహారం 'గోగ్రాస దానం' (ఆవుకు ఆహారం తినిపించడం). ఏ గ్రహం వల్ల ఇబ్బంది కలుగుతోందో ఆ గ్రహానికి చెందిన ధాన్యాన్ని ఒక రాత్రి ముందే నీటిలో నానబెట్టి, మరుసటి రోజు ఉదయం ఆ గ్రహ హోరాలో పాత బెల్లం (Jaggery) కలిపి ఆవుకు స్వయంగా తినిపించి, ఆవు చుట్టూ ప్రదక్షిణ నమస్కారాలు (9, 11 లేదా 108 సార్లు) చేయాలి.`,
      explanationEn: `In the classical Naadi Samhitas of Maharshi Bhrigu and Agastya, feeding a cow (Kamadhenu) is the supreme living remedy that resolves planetary afflictions immediately. Soak the specific planetary grain overnight, mix it with pure jaggery, feed it to a cow on the planet's day/Hora, and perform circumambulation (Pradakshina).`,
      procedureTe: `నవగ్రహ గోగ్రాస ధాన్య పట్టిక: ☉ రవి: గోధుమలు+బెల్లం (ఆదివారం) · ☽ చంద్ర: బియ్యం+బెల్లం (సోమవారం) · ♂ కుజ: కందిపప్పు+బెల్లం (మంగళవారం) · ☿ బుధ: పెసలు+బెల్లం (బుధవారం) · ♃ గురు: శనగలు+బెల్లం (గురువారం) · ♀ శుక్ర: బొబ్బర్లు/అరటిపండ్లు+బెల్లం (శుక్రవారం) · ♄ శని: నల్ల నువ్వులు+బెల్లం (శనివారం) · ☊ రాహు: మినుములు+బెల్లం · ☋ కేతు: ఉలవలు (Horse gram)+బెల్లం.`,
      procedureEn: `Planetary Grain Schedule: Sun: Wheat + Jaggery · Moon: Rice + Jaggery · Mars: Red Gram + Jaggery · Mercury: Green Gram + Jaggery · Jupiter: Chickpeas + Jaggery · Venus: Cowpeas/Bananas + Jaggery · Saturn: Black Sesame + Jaggery · Rahu: Black Gram (Urad) + Jaggery · Ketu: Horse Gram (Ulvalu) + Jaggery.`,
    },
    {
      id: 'naadi-mantra-4',
      badgeTe: 'నిత్య నాడీ రక్షా కవచం · దైవ ఉపాసనా క్రమం',
      badgeEn: 'Daily Naadi Protection Shield · Divine Upasana',
      titleTe: `4. ${lagnaRashi.te} లగ్నం – ${RASHI_NAMES[moonPl.rashiIdx % 12].te} రాశి వారికి నాడీ గోచార సంపూర్ణ ఆరాధనా నియమం`,
      titleEn: `4. Complete Naadi Transit Divine Worship Protocol for ${lagnaRashi.en} Ascendant`,
      sankalpaPurposeTe: `🙏 ఆరాధ్య దైవ అనుగ్రహం: గణపతి, దుర్గాదేవి, పరమేశ్వరుడు, దక్షిణామూర్తి మరియు లక్ష్మీనారాయణుల స్మరణ వల్ల నవగ్రహ గోచార దోషాలు శాంతించి శుభ యోగాలు ఫలిస్తాయి.`,
      sankalpaPurposeEn: `🙏 Divine Grace: Worshipping Lord Ganapati, Goddess Durga, Lord Shiva, Sri Dakshinamurthy, and Lakshmi Narayana harmonizes all transit cycles.`,
      explanationTe: `మహర్షి ప్రణీత నాడీ గోచార సిద్ధాంతం ప్రకారం: (1) కేతు గోచార ఆటంకాల నివారణకు మరియు ధ్వజ కీర్తికి 'శ్రీ మహాగణపతి ఆరాధన' (${ketOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}), (2) రాహు గోచార భ్రమలు మరియు జీవ బంధన నివారణకు 'శ్రీ దుర్గా దేవి & శివ ఆరాధన' (${rahOnJup.badgeTe.replace('ఖచ్చితమైన ఫలిత సంవత్సరాలు: ', '')}), (3) శని గోచార కర్మ భార నివారణకు 'శ్రీ ఆంజనేయ & రుద్రాభిషేక సేవ', (4) గురు-శుక్ర-బుధ శుభ ఫలితాల వృద్ధికి 'శ్రీ దక్షిణామూర్తి & విష్ణు సహస్రనామ పారాయణ' ఆచరించడం వల్ల 30 పేజీల ఈ బృహత్ జాతక-నాడీ మహాగ్రంథంలోని శుభ యోగాలన్నీ సంపూర్ణంగా ఫలిస్తాయి.`,
      explanationEn: `Combining Ganapati worship (for Ketu), Durga/Shiva worship (for Rahu), Hanuman/Rudra Abhishekam (for Saturn), and Dakshinamurthy/Vishnu Sahasranama (for Jupiter/Mercury/Venus) ensures complete protection and prosperity across all transit cycles.`,
      procedureTe: 'నిత్య నియమం: ఉదయం స్నానానంతరం తూర్పు ముఖంగా దీపారాధన చేసి ఇష్టదైవ నామస్మరణతో దినచర్య ప్రారంభించండి.',
      procedureEn: 'Daily Practice: Light a lamp facing East each morning after bath and offer prayers before beginning your day.',
    },
  ];

  return {
    chapter11Rules,
    chapter12FastPart1,
    chapter12FastPart2,
    chapter13Jupiter,
    chapter14Saturn,
    chapter15Rahu,
    chapter16Ketu,
    chapter17Diagnostics,
    chapter18GemsAndCowRemedies,
  };
}
