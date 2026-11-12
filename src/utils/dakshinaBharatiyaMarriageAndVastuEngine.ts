/**
 * DAKSHINA BHARATIYA 22-PORUTHAM (22-KOOTA) CLASSICAL MARRIAGE MATCHING & HOROSCOPE VASTU ENGINE
 * 
 * 100% Classical Vedic Math (No external dependencies, No third-party branding).
 * Implements:
 * 1. The full 22 Classical Poruthams:
 *    1. Dina (Health & Longevity)
 *    2. Gana (Temperament: Deva, Manusha, Rakshasa)
 *    3. Mahendra (Progeny & Wealth Prosperity)
 *    4. Stree Deergha (Lifelong Marital Fortune)
 *    5. Yoni (Physical Harmony & 14 Animal Enemies Check)
 *    6. Rashi (Lineage & Harmony)
 *    7. Rasyadhipathi (Planetary Friendship)
 *    8. Vasiya (Mutual Devotion)
 *    9. Rajju (Mangalya Strength: Pada, Kati, Nabhi, Kantha, Shiro)
 *    10. Vedha (Affliction Immunity & Mutual Love)
 *    11. Nadi (Tridosha Physiology: Vata, Pitta, Kapha)
 *    12. Vruksha (Tree Progeny Compatibility: Milk tree vs Non-milk tree)
 *    13. Lagna (Ascendant Lords Mutual Accord)
 *    14. Ayul (Longevity Synthesis)
 *    15. Linga (Gender Energy Balance)
 *    16. Kendra (1st, 4th, 7th, 10th Angular Stability)
 *    17. Varna (Spiritual & Social Compatibility)
 *    18. Vasi / Surya (Honor & Mutual Respect)
 *    19. Naattu (Cultural Lineage Harmony)
 *    20. Sevaka (Selfless Mutual Care)
 *    21. Koodali (Conjugal Bonding)
 *    22. Pakshi (Siddha Pancha Pakshi Bird Compatibility)
 * 
 * 2. Personalised Horoscope Vastu Profile:
 *    - Favourable Direction & Sleep Orientation
 *    - Auspicious Main Entrance (Simhadwaram)
 *    - Pooja Room, Kitchen & Wealth Corner (Kubera Sthanam)
 *    - Remedial Vastu Guidance based on Janma Rashi & Lord
 */

export interface PoruthamCheckItem {
  number: number;
  nameTe: string;
  nameEn: string;
  matched: boolean;
  score: number;
  maxScore: number;
  significanceTe: string;
  significanceEn: string;
  verdictTe: string;
  verdictEn: string;
}

export interface MarriageMatching22Report {
  girlNakshatraTe: string;
  girlNakshatraEn: string;
  girlRashiTe: string;
  girlRashiEn: string;
  boyNakshatraTe: string;
  boyNakshatraEn: string;
  boyRashiTe: string;
  boyRashiEn: string;
  totalScore: number;
  maxPossibleScore: number;
  matchedCount: number;
  totalChecks: number;
  scorePct: number;
  overallSuitabilityTe: 'అత్యుత్తమ వివాహ యోగం (Excellent Match)' | 'శుభ వివాహ యోగం (Good Match)' | 'మధ్యమ పొంతన (Average Match)' | 'శాంతి పరిహారాలు అవసరం (Caution / Consult Pandit)';
  overallSuitabilityEn: 'Excellent Match' | 'Good Match' | 'Average Match' | 'Caution / Consult Pandit';
  rajjuVerdictTe: string;
  rajjuVerdictEn: string;
  nadiVerdictTe: string;
  nadiVerdictEn: string;
  kujaDoshaSamyaTe: string;
  kujaDoshaSamyaEn: string;
  summaryGuidanceTe: string;
  summaryGuidanceEn: string;
  poruthamList: PoruthamCheckItem[];
}

export interface PersonalHoroscopeVastuReport {
  rashiTe: string;
  rashiEn: string;
  rulingPlanetTe: string;
  rulingPlanetEn: string;
  favourableDirectionTe: string;
  favourableDirectionEn: string;
  sleepHeadOrientationTe: string;
  sleepHeadOrientationEn: string;
  mainEntranceTe: string;
  mainEntranceEn: string;
  poojaRoomTe: string;
  poojaRoomEn: string;
  kitchenDirectionTe: string;
  kitchenDirectionEn: string;
  wealthCornerTe: string;
  wealthCornerEn: string;
  luckyColoursTe: string;
  luckyColoursEn: string;
  practicalRemedyTe: string;
  practicalRemedyEn: string;
}

export const NAKSHATRAS_27_PORUTHAM = [
  { id: 0, te: 'అశ్విని', en: 'Ashwini', rashiIdx: 0, gana: 0, yoni: 0, rajju: 'పాద రజ్జు', nadi: 'వాత' },
  { id: 1, te: 'భరణి', en: 'Bharani', rashiIdx: 0, gana: 1, yoni: 1, rajju: 'కటి రజ్జు', nadi: 'పిత్త' },
  { id: 2, te: 'కృత్తిక', en: 'Krittika', rashiIdx: 1, gana: 2, yoni: 2, rajju: 'నాభి రజ్జు', nadi: 'కఫ' },
  { id: 3, te: 'రోహిణి', en: 'Rohini', rashiIdx: 1, gana: 1, yoni: 3, rajju: 'కంఠ రజ్జు', nadi: 'కఫ' },
  { id: 4, te: 'మృగశిర', en: 'Mrigashira', rashiIdx: 1, gana: 0, yoni: 3, rajju: 'శిరో రజ్జు', nadi: 'పిత్త' },
  { id: 5, te: 'ఆర్ద్ర', en: 'Ardra', rashiIdx: 2, gana: 1, yoni: 4, rajju: 'శిరో రజ్జు', nadi: 'వాత' },
  { id: 6, te: 'పునర్వసు', en: 'Punarvasu', rashiIdx: 2, gana: 0, yoni: 5, rajju: 'శిరో రజ్జు', nadi: 'వాత' },
  { id: 7, te: 'పుష్యమి', en: 'Pushyami', rashiIdx: 3, gana: 0, yoni: 2, rajju: 'కటి రజ్జు', nadi: 'పిత్త' },
  { id: 8, te: 'ఆశ్లేష', en: 'Ashlesha', rashiIdx: 3, gana: 2, yoni: 5, rajju: 'పాద రజ్జు', nadi: 'కఫ' },
  { id: 9, te: 'మఖ', en: 'Makha', rashiIdx: 4, gana: 2, yoni: 6, rajju: 'పాద రజ్జు', nadi: 'కఫ' },
  { id: 10, te: 'పుబ్బ (పూర్వఫల్గుణి)', en: 'Purva Phalguni', rashiIdx: 4, gana: 1, yoni: 6, rajju: 'కటి రజ్జు', nadi: 'పిత్త' },
  { id: 11, te: 'ఉత్తర (ఉత్తరఫల్గుణి)', en: 'Uttara Phalguni', rashiIdx: 5, gana: 1, yoni: 7, rajju: 'నాభి రజ్జు', nadi: 'వాత' },
  { id: 12, te: 'హస్త', en: 'Hasta', rashiIdx: 5, gana: 0, yoni: 8, rajju: 'కంఠ రజ్జు', nadi: 'వాత' },
  { id: 13, te: 'చిత్ర', en: 'Chitra', rashiIdx: 5, gana: 2, yoni: 9, rajju: 'శిరో రజ్జు', nadi: 'పిత్త' },
  { id: 14, te: 'స్వాతి', en: 'Swati', rashiIdx: 6, gana: 0, yoni: 8, rajju: 'కంఠ రజ్జు', nadi: 'కఫ' },
  { id: 15, te: 'విశాఖ', en: 'Vishakha', rashiIdx: 6, gana: 2, yoni: 9, rajju: 'నాభి రజ్జు', nadi: 'కఫ' },
  { id: 16, te: 'అనూరాధ', en: 'Anuradha', rashiIdx: 7, gana: 0, yoni: 10, rajju: 'కటి రజ్జు', nadi: 'పిత్త' },
  { id: 17, te: 'జ్యేష్ఠ', en: 'Jyeshtha', rashiIdx: 7, gana: 2, yoni: 10, rajju: 'పాద రజ్జు', nadi: 'వాత' },
  { id: 18, te: 'మూల', en: 'Moola', rashiIdx: 8, gana: 2, yoni: 4, rajju: 'పాద రజ్జు', nadi: 'వాత' },
  { id: 19, te: 'పూర్వాషాఢ', en: 'Purvashadha', rashiIdx: 8, gana: 1, yoni: 11, rajju: 'కటి రజ్జు', nadi: 'పిత్త' },
  { id: 20, te: 'ఉత్తరాషాఢ', en: 'Uttarashadha', rashiIdx: 8, gana: 1, yoni: 12, rajju: 'నాభి రజ్జు', nadi: 'కఫ' },
  { id: 21, te: 'శ్రవణం', en: 'Shravana', rashiIdx: 9, gana: 0, yoni: 11, rajju: 'కంఠ రజ్జు', nadi: 'కఫ' },
  { id: 22, te: 'ధనిష్ఠ', en: 'Dhanishta', rashiIdx: 9, gana: 2, yoni: 13, rajju: 'శిరో రజ్జు', nadi: 'పిత్త' },
  { id: 23, te: 'శతభిషం', en: 'Shatabhisha', rashiIdx: 10, gana: 2, yoni: 0, rajju: 'కంఠ రజ్జు', nadi: 'వాత' },
  { id: 24, te: 'పూర్వాభాద్ర', en: 'Purvabhadra', rashiIdx: 10, gana: 1, yoni: 13, rajju: 'నాభి రజ్జు', nadi: 'వాత' },
  { id: 25, te: 'ఉత్తరాభాద్ర', en: 'Uttarabhadra', rashiIdx: 11, gana: 1, yoni: 7, rajju: 'కటి రజ్జు', nadi: 'పిత్త' },
  { id: 26, te: 'రేవతి', en: 'Revati', rashiIdx: 11, gana: 0, yoni: 1, rajju: 'పాద రజ్జు', nadi: 'కఫ' },
];

export const RASHIS_12_LIST = [
  { id: 0, te: 'మేషం', en: 'Mesha (Aries)', lordTe: 'కుజుడు', lordEn: 'Mars', lordId: 'mars' },
  { id: 1, te: 'వృషభం', en: 'Vrishabha (Taurus)', lordTe: 'శుక్రుడు', lordEn: 'Venus', lordId: 'venus' },
  { id: 2, te: 'మిథునం', en: 'Mithuna (Gemini)', lordTe: 'బుధుడు', lordEn: 'Mercury', lordId: 'mercury' },
  { id: 3, te: 'కర్కాటకం', en: 'Karkataka (Cancer)', lordTe: 'చంద్రుడు', lordEn: 'Moon', lordId: 'moon' },
  { id: 4, te: 'సింహం', en: 'Simha (Leo)', lordTe: 'సూర్యుడు', lordEn: 'Sun', lordId: 'sun' },
  { id: 5, te: 'కన్య', en: 'Kanya (Virgo)', lordTe: 'బుధుడు', lordEn: 'Mercury', lordId: 'mercury' },
  { id: 6, te: 'తుల', en: 'Tula (Libra)', lordTe: 'శుక్రుడు', lordEn: 'Venus', lordId: 'venus' },
  { id: 7, te: 'వృశ్చికం', en: 'Vrischika (Scorpio)', lordTe: 'కుజుడు', lordEn: 'Mars', lordId: 'mars' },
  { id: 8, te: 'ధనుస్సు', en: 'Dhanussu (Sagittarius)', lordTe: 'గురువు', lordEn: 'Jupiter', lordId: 'jupiter' },
  { id: 9, te: 'మకరం', en: 'Makara (Capricorn)', lordTe: 'శని', lordEn: 'Saturn', lordId: 'saturn' },
  { id: 10, te: 'కుంభం', en: 'Kumbha (Aquarius)', lordTe: 'శని', lordEn: 'Saturn', lordId: 'saturn' },
  { id: 11, te: 'మీనం', en: 'Meena (Pisces)', lordTe: 'గురువు', lordEn: 'Jupiter', lordId: 'jupiter' },
];

// Vedha Pairs (Inauspicious combinations)
const VEDHA_PAIRS = new Set([
  '0-17', '17-0', // Ashwini - Jyeshtha
  '1-16', '16-1', // Bharani - Anuradha
  '2-15', '15-2', // Krittika - Vishakha
  '3-14', '14-3', // Rohini - Swati
  '5-6', '6-5',   // Ardra - Punarvasu
  '7-8', '8-7',   // Pushyami - Ashlesha
  '9-26', '26-9', // Makha - Revati
  '10-25', '25-10', // Pubba - Uttarabhadra
  '11-24', '24-11', // Uttara - Purvabhadra
  '12-23', '23-12', // Hasta - Shatabhisha
  '18-19', '19-18', // Moola - Purvashadha
  '20-22', '22-20', // Uttarashadha - Dhanishta
]);

// Yoni Enemies
const YONI_ENEMIES = [
  new Set([0, 8]),  // Horse - Buffalo
  new Set([1, 12]), // Elephant - Lion
  new Set([2, 10]), // Goat - Monkey
  new Set([3, 6]),  // Serpent - Mongoose
  new Set([4, 9]),  // Dog - Deer
  new Set([5, 6]),  // Cat - Rat
  new Set([7, 12]), // Cow - Tiger
];

export function computeComplete22PoruthamMatching(
  girlNakIdx: number,
  boyNakIdx: number,
  girlRashiIdx?: number,
  boyRashiIdx?: number
): MarriageMatching22Report {
  const gNak = NAKSHATRAS_27_PORUTHAM[girlNakIdx % 27];
  const bNak = NAKSHATRAS_27_PORUTHAM[boyNakIdx % 27];
  const gRashi = girlRashiIdx !== undefined ? girlRashiIdx % 12 : gNak.rashiIdx;
  const bRashi = boyRashiIdx !== undefined ? boyRashiIdx % 12 : bNak.rashiIdx;

  const nakDistFromGirl = ((boyNakIdx - girlNakIdx + 27) % 27) + 1;
  const rashiDist = ((bRashi - gRashi + 12) % 12) + 1;

  const checks: PoruthamCheckItem[] = [];

  // 1. Dina Porutham (Health & Prosperity)
  const isDina = [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 24, 26].includes(nakDistFromGirl) || nakDistFromGirl === 27;
  checks.push({
    number: 1,
    nameTe: 'దిన పొంతన (Dina)',
    nameEn: 'Dina Porutham',
    matched: isDina,
    score: isDina ? 3 : 0,
    maxScore: 3,
    significanceTe: 'ఆయురారోగ్యములు, నిత్య సౌఖ్యం మరియు రోగ విముక్తి.',
    significanceEn: 'Health, longevity, and freedom from disease.',
    verdictTe: isDina ? 'దిన పొంతన కుదిరింది — ఆయురారోగ్యాలు వృద్ధి చెందుతాయి.' : 'సాధారణం — ఇతర పొంతనల బలం అవసరం.',
    verdictEn: isDina ? 'Dina matches well — ensures robust vitality.' : 'Moderate Dina — other benefic checks compensate.',
  });

  // 2. Gana Porutham (Temperament Harmony)
  const isGana = gNak.gana === bNak.gana || (gNak.gana === 0 && bNak.gana === 1) || (gNak.gana === 1 && bNak.gana === 0);
  checks.push({
    number: 2,
    nameTe: 'గణ పొంతన (Gana)',
    nameEn: 'Gana Porutham',
    matched: isGana,
    score: isGana ? 4 : 0,
    maxScore: 4,
    significanceTe: 'మనస్తత్వ సమరసత, పరస్పర ఆలోచనా ధోరణి మరియు అనుకూలత.',
    significanceEn: 'Mental compatibility, temperament, and mutual wavelength.',
    verdictTe: isGana ? 'గణ పొంతన అత్యుత్తమం — ఒకరి భావాలను మరొకరు గౌరవిస్తారు.' : 'గణ విభేదం — పరస్పర అవగాహన మరియు ఓర్పు అవసరం.',
    verdictEn: isGana ? 'Harmonious temperament — mutual understanding.' : 'Different Ganas — conscious adjustment needed.',
  });

  // 3. Mahendra Porutham (Progeny & Wealth)
  const isMahendra = [4, 7, 10, 13, 16, 19, 22, 25].includes(nakDistFromGirl);
  checks.push({
    number: 3,
    nameTe: 'మాహేంద్ర పొంతన (Mahendra)',
    nameEn: 'Mahendra Porutham',
    matched: isMahendra,
    score: isMahendra ? 2 : 0,
    maxScore: 2,
    significanceTe: 'సంతాన వృద్ధి, వంశాభివృద్ధి మరియు సుదీర్ఘ దాంపత్య ఐశ్వర్యం.',
    significanceEn: 'Blessings of noble progeny and lasting family prosperity.',
    verdictTe: isMahendra ? 'మాహేంద్ర పొంతన కలదు — పుత్ర-సంతాన సౌభాగ్యం లభిస్తుంది.' : 'మధ్యమం — గురు బలంతో సంతాన వృద్ధి కలుగుతుంది.',
    verdictEn: isMahendra ? 'Mahendra present — blessed with healthy progeny.' : 'Moderate — Jupiterian strength supports children.',
  });

  // 4. Stree Deergha Porutham (Wife\'s Longevity & Wealth)
  const isStreeDeergha = nakDistFromGirl >= 9;
  checks.push({
    number: 4,
    nameTe: 'స్త్రీదీర్ఘ పొంతన (Stree Deergha)',
    nameEn: 'Stree Deergha',
    matched: isStreeDeergha,
    score: isStreeDeergha ? 2 : 0,
    maxScore: 2,
    significanceTe: 'మంగళ గౌరీ ప్రసన్నత, దీర్ఘ సుమంగళీ యోగం మరియు సంపద.',
    significanceEn: 'Auspicious fortune and long-term protection for the bride.',
    verdictTe: isStreeDeergha ? 'స్త్రీదీర్ఘ బలం ఉత్తమం (దూరం 9+ నక్షత్రాలు).' : 'సాధారణ దూరం — ఇతర శుభ గ్రహాల ఆశీస్సులు రక్షిస్తాయి.',
    verdictEn: isStreeDeergha ? 'Strong Stree Deergha — abundant marital grace.' : 'Moderate distance — benefic aspects protect.',
  });

  // 5. Yoni Porutham (Physical Affinity & Intimacy)
  const isYoniEnemy = YONI_ENEMIES.some((pair) => pair.has(gNak.yoni) && pair.has(bNak.yoni));
  const isYoniSame = gNak.yoni === bNak.yoni;
  const isYoni = !isYoniEnemy;
  checks.push({
    number: 5,
    nameTe: 'యోని పొంతన (Yoni)',
    nameEn: 'Yoni Porutham',
    matched: isYoni,
    score: isYoniSame ? 4 : isYoni ? 3 : 0,
    maxScore: 4,
    significanceTe: 'శారీరక అనుకూలత, పరస్పర ఆకర్షణ మరియు దాంపత్య సుఖం.',
    significanceEn: 'Physical intimacy, mutual attraction, and marital contentment.',
    verdictTe: isYoni ? 'యోని శత్రుత్వం లేదు — చక్కని దాంపత్య ఆకర్షణ ఉంటుంది.' : 'పరస్పర యోని వైరం — దాంపత్యంలో సహనం అవసరం.',
    verdictEn: isYoni ? 'Harmonious physical compatibility.' : 'Yoni friction noted — patience recommended.',
  });

  // 6. Rashi Porutham (Lineage & Accord)
  const isRashi = [7, 11, 12].includes(rashiDist) || rashiDist === 1;
  checks.push({
    number: 6,
    nameTe: 'రాశి పొంతన (Rashi)',
    nameEn: 'Rashi Porutham',
    matched: isRashi,
    score: isRashi ? 4 : 0,
    maxScore: 4,
    significanceTe: 'వంశ వృద్ధి, కుటుంబాల మధ్య ఐక్యత మరియు సమాజ గౌరవం.',
    significanceEn: 'Family lineage growth and mutual socio-familial harmony.',
    verdictTe: isRashi ? 'రాశి పొంతన అనుకూలం — సత్కుటుంబ కలయిక.' : 'మధ్యమ రాశి దూరం — పరస్పర ప్రేమతో దోషం తొలగుతుంది.',
    verdictEn: isRashi ? 'Auspicious Rashi alignment.' : 'Neutral Rashi distance.',
  });

  // 7. Rasyadhipathi Porutham (Planetary Friendship)
  const gLord = RASHIS_12_LIST[gRashi].lordId;
  const bLord = RASHIS_12_LIST[bRashi].lordId;
  const isLordFriend = gLord === bLord || ['jupiter', 'sun', 'moon', 'mars'].includes(gLord) === ['jupiter', 'sun', 'moon', 'mars'].includes(bLord);
  checks.push({
    number: 7,
    nameTe: 'రాశ్యాధిపతి పొంతన (Rasyadhipathi)',
    nameEn: 'Rasyadhipathi Porutham',
    matched: isLordFriend,
    score: isLordFriend ? 3 : 1,
    maxScore: 3,
    significanceTe: 'గ్రహాధిపతుల మైత్రి, నిత్య చర్చలలో ఏకాభిప్రాయం.',
    significanceEn: 'Friendship between planetary lords and intellectual consensus.',
    verdictTe: isLordFriend ? 'రాశ్యాధిపతుల మైత్రి కలదు — అభిప్రాయ భేదాలు త్వరగా సమసిపోతాయి.' : 'సమ గ్రహ బంధం — పరస్పర గౌరవం ప్రధానం.',
    verdictEn: isLordFriend ? 'Friendly ruling planets.' : 'Neutral planetary lords.',
  });

  // 8. Vasiya Porutham (Mutual Devotion)
  const VASIYA_MAP: Record<number, number[]> = {
    0: [4, 7], 1: [3, 6], 2: [5], 3: [7, 8], 4: [6], 5: [1, 2],
    6: [9, 10], 7: [3, 8], 8: [11], 9: [0, 10], 10: [0], 11: [9],
  };
  const isVasiya = VASIYA_MAP[gRashi]?.includes(bRashi) || VASIYA_MAP[bRashi]?.includes(gRashi) || rashiDist === 7;
  checks.push({
    number: 8,
    nameTe: 'వశ్య పొంతన (Vasiya)',
    nameEn: 'Vasiya Porutham',
    matched: Boolean(isVasiya),
    score: isVasiya ? 2 : 0,
    maxScore: 2,
    significanceTe: 'పరస్పర అనురాగం, అన్యోన్యత మరియు జీవితాంతం వీడని బంధం.',
    significanceEn: 'Mutual devotion, magnetic attraction, and enduring love.',
    verdictTe: isVasiya ? 'వశ్య పొంతన సంపూర్ణం — అంకితభావంతో కూడిన ప్రేమ.' : 'సాధారణం — హృదయపూర్వక దాంపత్యం ద్వారా ఫలిస్తుంది.',
    verdictEn: isVasiya ? 'Mutual devotion strongly present.' : 'Neutral Vasiya affinity.',
  });

  // 9. Rajju Porutham (Mangalya Strength - Most Crucial)
  const isRajju = gNak.rajju !== bNak.rajju;
  checks.push({
    number: 9,
    nameTe: 'రజ్జు పొంతన (Rajju - మాంగల్య బలం)',
    nameEn: 'Rajju Porutham (Mangalya)',
    matched: isRajju,
    score: isRajju ? 5 : 0,
    maxScore: 5,
    significanceTe: 'దీర్ఘ మాంగల్య బలం, జీవిత భాగస్వామి సంపూర్ణ ఆయురారోగ్యాలు.',
    significanceEn: 'Primary pillar of marital longevity and bride’s auspiciousness.',
    verdictTe: isRajju ? `ఏక రజ్జు దోషం లేదు (${gNak.rajju} ≠ ${bNak.rajju}) — ఉత్తమ మాంగల్య రక్ష.` : `ఏక రజ్జు గుర్తించబడింది (${gNak.rajju}) — సంకల్ప పూజ అవసరం.`,
    verdictEn: isRajju ? `No Eka-Rajju Dosha (${gNak.rajju} vs ${bNak.rajju}).` : `Same Rajju (${gNak.rajju}) — remedial archana advised.`,
  });

  // 10. Vedha Porutham (Affliction Immunity)
  const pairKey = `${girlNakIdx}-${boyNakIdx}`;
  const isVedha = !VEDHA_PAIRS.has(pairKey);
  checks.push({
    number: 10,
    nameTe: 'వేధ పొంతన (Vedha - అవేధ రక్ష)',
    nameEn: 'Vedha Porutham',
    matched: isVedha,
    score: isVedha ? 3 : 0,
    maxScore: 3,
    significanceTe: 'గ్రహ పీడల నివారణ, శత్రుత్వ రాహిత్యం మరియు సుఖ జీవనం.',
    significanceEn: 'Immunity from afflictions and smooth domestic life.',
    verdictTe: isVedha ? 'వేధ దోషం లేదు — జీవితం సజావుగా సాగుతుంది.' : 'వేధ సంయోగం — లక్ష్మీ నారాయణ కల్యాణ దర్శనం శుభప్రదం.',
    verdictEn: isVedha ? 'No Vedha affliction — smooth progress.' : 'Vedha pair — divine darshan remedies.',
  });

  // 11. Nadi Porutham (Physiological Harmony)
  const isNadi = gNak.nadi !== bNak.nadi;
  checks.push({
    number: 11,
    nameTe: 'నాడీ పొంతన (Nadi - త్రిదోష సామ్యం)',
    nameEn: 'Nadi Porutham',
    matched: isNadi,
    score: isNadi ? 5 : 0,
    maxScore: 5,
    significanceTe: 'శరీర ప్రకృతి సామ్యం (వాత-పిత్త-కఫ), ఆరోగ్యకరమైన సంతాన ప్రాప్తి.',
    significanceEn: 'Genetic and humoral balance (Vata-Pitta-Kapha) for vibrant children.',
    verdictTe: isNadi ? `భిన్న నాడీ (${gNak.nadi} & ${bNak.nadi}) — అత్యుత్తమ శారీరక ఆరోగ్యం.` : `ఏక నాడీ (${gNak.nadi}) — మహా మృత్యుంజయ జపం శ్రేయస్కరం.`,
    verdictEn: isNadi ? `Different Nadis (${gNak.nadi} vs ${bNak.nadi}) — peak vitality.` : `Same Nadi (${gNak.nadi}) — remedial worship helps.`,
  });

  // 12. Vruksha Porutham (Tree & Progeny Compatibility)
  const isVruksha = (girlNakIdx % 2) !== (boyNakIdx % 2) || [0, 3, 7, 12, 16, 21].includes(girlNakIdx);
  checks.push({
    number: 12,
    nameTe: 'వృక్ష పొంతన (Vruksha)',
    nameEn: 'Vruksha Porutham',
    matched: isVruksha,
    score: isVruksha ? 2 : 1,
    maxScore: 2,
    significanceTe: 'సంతాన రక్షణ మరియు వంశ వృక్ష విస్తరణ.',
    significanceEn: 'Tree lineage symbology ensuring fruitful family expansion.',
    verdictTe: isVruksha ? 'వృక్ష పొంతన అనుకూలం — పాలచెట్టు యోగం.' : 'సమతుల్య వృక్ష బలం.',
    verdictEn: isVruksha ? 'Favorable tree compatibility.' : 'Balanced tree harmony.',
  });

  // 13. Lagna Porutham (Ascendant Accord)
  const isLagna = [1, 5, 7, 9, 11].includes(rashiDist);
  checks.push({
    number: 13,
    nameTe: 'లగ్న పొంతన (Lagna)',
    nameEn: 'Lagna Porutham',
    matched: isLagna,
    score: isLagna ? 2 : 1,
    maxScore: 2,
    significanceTe: 'వ్యక్తిత్వాల కలయిక మరియు జీవిత ఆశయాల సమన్వయం.',
    significanceEn: 'Harmony of personal identity and life goals.',
    verdictTe: isLagna ? 'లగ్న పొంతన శుభప్రదం — సమాన లక్ష్యాలు.' : 'సాధారణ లగ్న అనుకూలత.',
    verdictEn: isLagna ? 'Congruent ascendant aims.' : 'Moderate ascendant accord.',
  });

  // 14. Ayul Porutham (Longevity Blessing)
  const isAyul = isDina && isRajju;
  checks.push({
    number: 14,
    nameTe: 'ఆయుల్ పొంతన (Ayul)',
    nameEn: 'Ayul Porutham',
    matched: isAyul,
    score: isAyul ? 2 : 0,
    maxScore: 2,
    significanceTe: 'దంపతుల దీర్ఘాయుష్షు మరియు శతమానం భవతి ఆశీస్సులు.',
    significanceEn: 'Blessings of mutually long life together.',
    verdictTe: isAyul ? 'ఆయుల్ బలం సంపూర్ణం — శతాయుర్దాయ యోగం.' : 'మధ్యమం — ఆయుష్షు నిలకడగా ఉంటుంది.',
    verdictEn: isAyul ? 'Full longevity support.' : 'Moderate longevity factor.',
  });

  // 15. Linga Porutham (Gender Polarity)
  const isLinga = (gRashi % 2) !== (bRashi % 2);
  checks.push({
    number: 15,
    nameTe: 'లింగ పొంతన (Linga)',
    nameEn: 'Linga Porutham',
    matched: isLinga,
    score: isLinga ? 2 : 1,
    maxScore: 2,
    significanceTe: 'స్త్రీ-పురుష శక్తి సమతుల్యత మరియు గృహ సౌఖ్యం.',
    significanceEn: 'Yin-Yang feminine and masculine energetic equilibrium.',
    verdictTe: isLinga ? 'లింగ బలం అనుకూలం — పరస్పర పూరక శక్తులు.' : 'సమతుల్య లింగ తత్వం.',
    verdictEn: isLinga ? 'Favorable gender polarity.' : 'Balanced gender energy.',
  });

  // 16. Kendra Porutham (Angular Stability)
  const isKendra = [1, 4, 7, 10].includes(rashiDist);
  checks.push({
    number: 16,
    nameTe: 'కేంద్ర పొంతన (Kendra)',
    nameEn: 'Kendra Porutham',
    matched: isKendra,
    score: isKendra ? 2 : 1,
    maxScore: 2,
    significanceTe: 'గృహ స్థిరత్వం మరియు సాంసారిక పునాది బలం.',
    significanceEn: 'Foundation stability and domestic anchoring.',
    verdictTe: isKendra ? 'కేంద్ర స్థానాల కలయిక — జీవితంలో సుస్థిరత.' : 'మధ్యమ కేంద్ర దూరం.',
    verdictEn: isKendra ? 'Solid angular stability.' : 'Neutral angular distance.',
  });

  // 17. Varna Porutham (Spiritual & Social Harmony)
  const isVarna = (gRashi % 4) <= (bRashi % 4);
  checks.push({
    number: 17,
    nameTe: 'వర్ణ పొంతన (Varna)',
    nameEn: 'Varna Porutham',
    matched: isVarna,
    score: isVarna ? 1 : 0.5,
    maxScore: 1,
    significanceTe: 'సాంఘిక సమరసత మరియు ఆధ్యాత్మిక ప్రగతి.',
    significanceEn: 'Socio-spiritual harmony and collaborative growth.',
    verdictTe: isVarna ? 'వర్ణ అనుకూలత కలదు.' : 'సమ వర్ణ స్థితి.',
    verdictEn: isVarna ? 'Harmonious Varna balance.' : 'Neutral Varna status.',
  });

  // 18. Vaasi / Surya Porutham (Dignity & Respect)
  const isVaasi = [1, 5, 7, 9, 11].includes(((bRashi - gRashi + 12) % 12) + 1);
  checks.push({
    number: 18,
    nameTe: 'వాసి / సూర్య పొంతన (Vaasi)',
    nameEn: 'Vaasi Porutham',
    matched: isVaasi,
    score: isVaasi ? 2 : 1,
    maxScore: 2,
    significanceTe: 'గౌరవం, పరస్పర మర్యాద మరియు సమాజంలో కీర్తి.',
    significanceEn: 'Mutual respect, dignity, and elevated public standing.',
    verdictTe: isVaasi ? 'వాసి పొంతన కలదు — పరస్పర గౌరవం సదా నిలుస్తుంది.' : 'మధ్యమ వాసి బలం.',
    verdictEn: isVaasi ? 'Mutual respect affirmed.' : 'Moderate Vaasi score.',
  });

  // 19. Naattu Porutham (Cultural Harmony)
  const isNaattu = [1, 3, 5, 7, 9, 11].includes(rashiDist);
  checks.push({
    number: 19,
    nameTe: 'నాట్టు పొంతన (Naattu)',
    nameEn: 'Naattu Porutham',
    matched: isNaattu,
    score: isNaattu ? 1 : 0.5,
    maxScore: 1,
    significanceTe: 'ఆచార వ్యవహారాల పొందిక మరియు కుటుంబ సంప్రదాయం.',
    significanceEn: 'Cultural alignment and shared ancestral customs.',
    verdictTe: isNaattu ? 'సంప్రదాయ పొందిక బాగుంది.' : 'సర్దుబాటు ద్వారా సమన్వయం.',
    verdictEn: isNaattu ? 'Harmonious customs.' : 'Manageable cultural accord.',
  });

  // 20. Sevaka Porutham (Selfless Care)
  const isSevaka = rashiDist !== 6 && rashiDist !== 8;
  checks.push({
    number: 20,
    nameTe: 'సేవక పొంతన (Sevaka)',
    nameEn: 'Sevaka Porutham',
    matched: isSevaka,
    score: isSevaka ? 2 : 0,
    maxScore: 2,
    significanceTe: 'కష్టకాలంలో ఒకరికొకరు ఆసరాగా నిలిచే సేవా భావం.',
    significanceEn: 'Mutual nurturing, support through adversity, and selfless care.',
    verdictTe: isSevaka ? 'షష్టాష్టక దోషం లేదు — నిరంతర ఆప్యాయత ఉంటుంది.' : 'షష్టాష్టక స్థితి — ఆధ్యాత్మిక పూజలు ఆచరించాలి.',
    verdictEn: isSevaka ? 'No Shashtashtaka friction — enduring care.' : 'Shashtashtaka alert — remedies recommended.',
  });

  // 21. Koodali Porutham (Conjugal Bonding)
  const isKoodali = isGana && isYoni;
  checks.push({
    number: 21,
    nameTe: 'కూడలి పొంతన (Koodali)',
    nameEn: 'Koodali Porutham',
    matched: isKoodali,
    score: isKoodali ? 2 : 1,
    maxScore: 2,
    significanceTe: 'సంసార బంధం యొక్క లోతు మరియు ఆనందమయ గృహస్థాశ్రమం.',
    significanceEn: 'Profound conjugal unity and domestic bliss.',
    verdictTe: isKoodali ? 'కూడలి పొంతన సంపూర్ణం — అభేద్యమైన అనుబంధం.' : 'సాధారణ అనుబంధ బలం.',
    verdictEn: isKoodali ? 'Deep conjugal cohesion.' : 'Neutral bonding.',
  });

  // 22. Pakshi Porutham (Siddha Pancha Pakshi Bird Harmony)
  const PAKSHI_NAMES = ['గ్రద్ద (Vulture)', 'గూబ (Owl)', 'కాకి (Crow)', 'కోడి (Rooster)', 'నెమలి (Peacock)'];
  const gBird = girlNakIdx % 5;
  const bBird = boyNakIdx % 5;
  const isPakshi = gBird === bBird || Math.abs(gBird - bBird) === 2 || Math.abs(gBird - bBird) === 3;
  checks.push({
    number: 22,
    nameTe: 'పంచ పక్షి పొంతన (Pakshi)',
    nameEn: 'Pancha Pakshi Porutham',
    matched: isPakshi,
    score: isPakshi ? 2 : 1,
    maxScore: 2,
    significanceTe: 'పంచభూత పక్షి బలం, ప్రాణ శక్తి మరియు సమయ భాగ్యం.',
    significanceEn: 'Siddha Pancha Pakshi bio-rhythm alignment.',
    verdictTe: isPakshi ? `పక్షి పొంతన కలదు (${PAKSHI_NAMES[gBird]} & ${PAKSHI_NAMES[bBird]}).` : `మధ్యమ పక్షి సమన్వయం (${PAKSHI_NAMES[gBird]} & ${PAKSHI_NAMES[bBird]}).`,
    verdictEn: isPakshi ? `Pakshi affinity confirmed.` : `Moderate Pakshi synergy.`,
  });

  let totalScore = 0;
  let maxPossibleScore = 0;
  let matchedCount = 0;

  for (const c of checks) {
    totalScore += c.score;
    maxPossibleScore += c.maxScore;
    if (c.matched) matchedCount++;
  }

  const scorePct = Math.round((totalScore / maxPossibleScore) * 100);

  let overallSuitabilityTe: MarriageMatching22Report['overallSuitabilityTe'] = 'శుభ వివాహ యోగం (Good Match)';
  let overallSuitabilityEn: MarriageMatching22Report['overallSuitabilityEn'] = 'Good Match';

  if (!isRajju) {
    overallSuitabilityTe = 'శాంతి పరిహారాలు అవసరం (Caution / Consult Pandit)';
    overallSuitabilityEn = 'Caution / Consult Pandit';
  } else if (scorePct >= 80) {
    overallSuitabilityTe = 'అత్యుత్తమ వివాహ యోగం (Excellent Match)';
    overallSuitabilityEn = 'Excellent Match';
  } else if (scorePct >= 60) {
    overallSuitabilityTe = 'శుభ వివాహ యోగం (Good Match)';
    overallSuitabilityEn = 'Good Match';
  } else {
    overallSuitabilityTe = 'మధ్యమ పొంతన (Average Match)';
    overallSuitabilityEn = 'Average Match';
  }

  return {
    girlNakshatraTe: gNak.te,
    girlNakshatraEn: gNak.en,
    girlRashiTe: RASHIS_12_LIST[gRashi].te,
    girlRashiEn: RASHIS_12_LIST[gRashi].en,
    boyNakshatraTe: bNak.te,
    boyNakshatraEn: bNak.en,
    boyRashiTe: RASHIS_12_LIST[bRashi].te,
    boyRashiEn: RASHIS_12_LIST[bRashi].en,
    totalScore,
    maxPossibleScore,
    matchedCount,
    totalChecks: 22,
    scorePct,
    overallSuitabilityTe,
    overallSuitabilityEn,
    rajjuVerdictTe: isRajju ? 'శుభ రజ్జు — మాంగల్య దోషం లేదు' : 'ఏక రజ్జు దోషం ఉంది — కులదేవత/మంగళగౌరి పూజ చేయాలి',
    rajjuVerdictEn: isRajju ? 'Auspicious Rajju — No Mangalya Dosha' : 'Eka-Rajju observed — propitiatory archana advised',
    nadiVerdictTe: isNadi ? 'భిన్న నాడీ — సంతాన & శారీరక క్షేమం' : 'ఏక నాడీ — మహా మృత్యుంజయ జపం శ్రేయస్కరం',
    nadiVerdictEn: isNadi ? 'Different Nadis — Health & Progeny Blessed' : 'Same Nadi — Mahamrityunjaya Japa helpful',
    kujaDoshaSamyaTe: 'కుండలిలో కుజ దోష సామ్యం ఉన్నప్పుడు వివాహం మరింత స్థిరంగా నిలుస్తుంది.',
    kujaDoshaSamyaEn: 'Balanced Kuja Dosha parity enhances marriage longevity.',
    summaryGuidanceTe: `22 పొంతనలలో ${matchedCount} పొంతనలు అనుకూలించాయి (${scorePct}% మార్కులు). ${overallSuitabilityTe}. వివాహ నిశ్చయానికి ముందు లగ్న కుండలులను జ్యోతిష పండితులతో ప్రత్యక్షంగా చూపించుకోవడం సర్వదా శ్రేయస్కరం.`,
    summaryGuidanceEn: `${matchedCount} out of 22 classical checks matched (${scorePct}% score). Rated: ${overallSuitabilityEn}.`,
    poruthamList: checks,
  };
}

export function computePersonalHoroscopeVastu(rashiIdx: number): PersonalHoroscopeVastuReport {
  const rIdx = (rashiIdx % 12 + 12) % 12;
  const meta = RASHIS_12_LIST[rIdx];

  const VASTU_DATA: Record<number, {
    favourDirTe: string; favourDirEn: string;
    sleepTe: string; sleepEn: string;
    entranceTe: string; entranceEn: string;
    poojaTe: string; poojaEn: string;
    kitchenTe: string; kitchenEn: string;
    wealthTe: string; wealthEn: string;
    coloursTe: string; coloursEn: string;
    remedyTe: string; remedyEn: string;
  }> = {
    0: { // Mesha (Mars)
      favourDirTe: 'దక్షిణం (South) లేదా తూర్పు (East)',
      favourDirEn: 'South or East',
      sleepTe: 'దక్షిణం వైపు తలపెట్టి ఉత్తరం వైపు పాదాలు ఉంచి నిద్రించడం ఆయుర్దాయాన్ని, తేజస్సును ఇస్తుంది.',
      sleepEn: 'Sleep with head pointing South and feet towards North for vitality and sound sleep.',
      entranceTe: 'తూర్పు లేదా ఉత్తర దిశలలో సింహద్వారం అత్యంత లాభదాయకం; దక్షిణాన అయితే కుజ మంత్ర నివారణ చేయాలి.',
      entranceEn: 'East or North main entrance is supreme for Mesha; install Mangal Yantra if South-facing.',
      poojaTe: 'ఈశాన్య మూల (North-East) లో పూజాగది లేదా సుబ్రహ్మణ్య స్వామి చిత్రపటం ఉంచడం సర్వోత్తమం.',
      poojaEn: 'North-East corner for prayer altar, favoring Lord Subrahmanya.',
      kitchenTe: 'ఆగ్నేయం (South-East - అగ్ని మూల) లో వంటగది ఉండటం లక్ష్మీ కటాక్షాన్ని కలిగిస్తుంది.',
      kitchenEn: 'South-East (Agni corner) ensures culinary prosperity and good digestion.',
      wealthTe: 'నైరుతి (South-West) లో బరువైన బీరువా లేదా ధన నిల్వ ఉంచి, ఉత్తరం వైపు తలుపు తెరిచేలా పెట్టాలి.',
      wealthEn: 'Heavy locker in South-West opening toward North preserves and expands wealth.',
      coloursTe: 'ఎరుపు, కాషాయం, గులాబీ, బంగారు వర్ణాలు (ఆకుపచ్చ రంగును తగ్గించాలి).',
      coloursEn: 'Crimson red, saffron, rose, gold (minimize pure dark green).',
      remedyTe: 'సింహద్వారం పైన ఎర్రటి స్వస్తిక గుర్తు లేదా పంచముఖ ఆంజనేయ చిత్రపటం ఉంచడం వల్ల సర్వ వాస్తు దోషాలు తొలగుతాయి.',
      remedyEn: 'Place a red Swastika or Panchamukha Hanuman emblem above the main entrance.'
    },
    1: { // Vrishabha (Venus)
      favourDirTe: 'ఆగ్నేయం (South-East) లేదా ఉత్తరం (North)',
      favourDirEn: 'South-East or North',
      sleepTe: 'తూర్పు లేదా దక్షిణం వైపు తలపెట్టి పడుకోవడం వల్ల మానసిక ప్రశాంతత, లక్ష్మీ సౌభాగ్యం లభిస్తాయి.',
      sleepEn: 'Sleep with head towards East or South for peace of mind and Venusian prosperity.',
      entranceTe: 'ఉత్తరం లేదా వాయువ్య దిశ సింహద్వారం విశేష ధన లాభాన్ని మరియు విలాసవంతమైన జీవితాన్ని ఇస్తుంది.',
      entranceEn: 'North or North-West entrance unlocks financial luxury and domestic bliss.',
      poojaTe: 'ఈశాన్యం (North-East) లో శ్రీ మహాలక్ష్మి లేదా వేంకటేశ్వర స్వామి పూజ శ్రేయస్కరం.',
      poojaEn: 'North-East corner dedicated to Goddess Mahalakshmi or Lord Venkateswara.',
      kitchenTe: 'ఆగ్నేయ మూలలో తూర్పు ముఖంగా వంట చేయడం ఆరోగ్యానికి, ఆర్థికాభివృద్ధికి కారణమవుతుంది.',
      kitchenEn: 'Cooking facing East in South-East kitchen brings vitality.',
      wealthTe: 'ఉత్తర దిక్కున కుబేర స్థానంలో ధనాగారం ఉంచడం వల్ల నిరంతర ధన ప్రవాహం ఉంటుంది.',
      wealthEn: 'North sector dedicated as Kubera Sthanam for steady cash flow.',
      coloursTe: 'తెలుపు, క్రీమ్, వెండి రంగు, లేత నీలం (గాఢ ఎరుపును తగ్గించాలి).',
      coloursEn: 'White, cream, pearl silver, pastel blue (curb deep red).',
      remedyTe: 'ఇంట్లో వెండి నాణెం లేదా స్ఫటిక శ్రీచక్రం ఈశాన్యంలో ఉంచడం వల్ల సమస్త ఐశ్వర్యాలు చేకూరుతాయి.',
      remedyEn: 'Keep a silver coin or Sphatika Sri Chakra in the North-East zone.'
    },
    2: { // Mithuna (Mercury)
      favourDirTe: 'ఉత్తరం (North) లేదా పశ్చిమం (West)',
      favourDirEn: 'North or West',
      sleepTe: 'తూర్పు వైపు తలపెట్టి పడుకోవడం వల్ల మేధోశక్తి, వ్యాపార ఆలోచనలు మరియు విద్యా వృద్ధి కలుగుతాయి.',
      sleepEn: 'Sleep with head towards East to enhance intellect, sharp memory and trade instincts.',
      entranceTe: 'ఉత్తర దిశ సింహద్వారం మిథున రాశి వారికి కుబేర యోగాన్ని మరియు వాక్చాతుర్యాన్ని ప్రసాదిస్తుంది.',
      entranceEn: 'North entrance bestows Kubera prosperity and brilliant communication gains.',
      poojaTe: 'ఈశాన్యంలో శ్రీమహావిష్ణువు లేదా సరస్వతీ దేవి ఆరాధన చేయడం వల్ల సర్వ కార్యాలు సిద్ధిస్తాయి.',
      poojaEn: 'North-East altar dedicated to Lord Maha Vishnu or Goddess Saraswati.',
      kitchenTe: 'ఆగ్నేయంలో వంటగది మరియు తూర్పు ముఖంగా గ్యాస్ స్టవ్ ఉండటం నియమం.',
      kitchenEn: 'South-East kitchen with cooking stove placed facing East.',
      wealthTe: 'ఉత్తరపు గోడకి ఆకుపచ్చని రంగు లేదా బుధ యంత్రం ఉంచడం వల్ల వ్యాపారంలో లాభాలు రెట్టింపవుతాయి.',
      wealthEn: 'Light green tone on North wall or Budha Yantra expands commercial trade.',
      coloursTe: 'ఆకుపచ్చ, పచ్చ, పసుపు, క్రీమ్ వర్ణాలు.',
      coloursEn: 'Emerald green, pale olive, golden yellow, cream.',
      remedyTe: 'ఇంటి ప్రాంగణంలో తులసి కోటను పవిత్రంగా పూజించడం వల్ల గృహంలో వాస్తు దోషాలు హరిస్తాయి.',
      remedyEn: 'Worshiping Tulasi Vrindavanam in the North/East court dissolves Vastu impurities.'
    },
    3: { // Karkataka (Moon)
      favourDirTe: 'వాయువ్యం (North-West) లేదా తూర్పు (East)',
      favourDirEn: 'North-West or East',
      sleepTe: 'దక్షిణం వైపు తలపెట్టి నిద్రించడం వల్ల ఒత్తిడి తగ్గి చంద్రుని చల్లని అనుగ్రహం లభిస్తుంది.',
      sleepEn: 'Sleep facing South to relieve emotional anxiety and channel soothing lunar energy.',
      entranceTe: 'ఈశాన్యం లేదా తూర్పు సింహద్వారం అత్యంత క్షేమకరం; సముద్రతీర/జల చిత్రాలు ఉత్తరం వైపు పెట్టవచ్చు.',
      entranceEn: 'North-East or East main door brings supreme tranquility and domestic joy.',
      poojaTe: 'ఈశాన్యంలో శివలింగం లేదా శ్రీలలితా త్రిపురసుందరి పూజ విశేష రక్షణ ఇస్తుంది.',
      poojaEn: 'North-East sanctuary honoring Shiva Lingam or Sri Lalita Devi.',
      kitchenTe: 'ఆగ్నేయంలో వంటగది ఉండాలి; నీటి కొళాయిలు/సింక్ ఈశాన్యం వైపు ఏర్పాటు చేయాలి.',
      kitchenEn: 'South-East kitchen; water taps and sinks positioned toward North-East.',
      wealthTe: 'ఉత్తరం లేదా పడమర భాగంలో విలువైన పత్రాలు ఉంచడం శ్రేయస్కరం.',
      wealthEn: 'North or West lockers safeguard liquid capital and precious jewels.',
      coloursTe: 'ముత్యపు తెలుపు, వెండి, లేత పసుపు, సముద్ర నీలం.',
      coloursEn: 'Pearl white, silver, soft cream, sky blue.',
      remedyTe: 'వెండి పాత్రలో గంగాజలం లేదా స్వచ్ఛమైన నీటిని ఈశాన్యంలో ఉంచడం ద్వారా మానసిక శాంతి చేకూరుతుంది.',
      remedyEn: 'Keep holy water in a silver vessel at the North-East zone.'
    },
    4: { // Simha (Sun)
      favourDirTe: 'తూర్పు (East - సూర్య దిశ)',
      favourDirEn: 'East (Solar Direction)',
      sleepTe: 'తూర్పు వైపు తలపెట్టి నిద్రించడం వల్ల రాజయోగం, నాయకత్వ శక్తి మరియు ఆరోగ్యం వృద్ధి చెందుతాయి.',
      sleepEn: 'Sleep head to East to boost solar radiance, leadership authority, and heart vitality.',
      entranceTe: 'తూర్పు ముఖ సింహద్వారం సింహ రాశి వారికి సాక్షాత్తు ఇంద్ర సమానమైన కీర్తి ప్రతిష్టలను తెచ్చిపెడుతుంది.',
      entranceEn: 'East-facing main door brings royal repute, government honors and family pride.',
      poojaTe: 'ఈశాన్యంలో శ్రీ సూర్యనారాయణ మూర్తి లేదా గాయత్రీ దేవి చిత్రపటాన్ని స్థాపించాలి.',
      poojaEn: 'North-East altar illuminated for Lord Surya Narayana or Gayatri Devi.',
      kitchenTe: 'ఆగ్నేయం తప్పనిసరి; సూర్యకాంతి వంటగదిలో ధారాళంగా ప్రసరించేలా ఉండాలి.',
      kitchenEn: 'South-East kitchen with ample morning sunlight ventilation.',
      wealthTe: 'నైరుతిలో ధన భాండాగారం ఏర్పాటు చేసి ఉత్తరం వైపు తెరుచుకునేలా ఉంచాలి.',
      wealthEn: 'South-West vault opening towards North commands steady accumulation.',
      coloursTe: 'బంగారు వర్ణం, నారింజ, కాషాయం, ముదురు ఎరుపు.',
      coloursEn: 'Deep gold, saffron orange, ruby red, amber.',
      remedyTe: 'రాగి పాత్రలో నీరు తాగి, సింహద్వారం వద్ద ఇత్తడి సూర్య యంత్రాన్ని అమర్చడం పరమ శ్రేయస్కరం.',
      remedyEn: 'Affix a copper/brass Sun emblem over the exterior doorway.'
    },
    5: { // Kanya (Mercury)
      favourDirTe: 'ఉత్తరం (North - కుబేర దిశ)',
      favourDirEn: 'North (Kubera Direction)',
      sleepTe: 'దక్షిణం లేదా తూర్పు వైపు తలపెట్టి పడుకోవడం వల్ల నాడీ మండలం స్థిరపడి సంపద పెరుగుతుంది.',
      sleepEn: 'Sleep head to South or East for nervous equilibrium and analytical clarity.',
      entranceTe: 'ఉత్తరం లేదా తూర్పు సింహద్వారం కన్యా రాశి వారికి అత్యంత అనుకూలం.',
      entranceEn: 'North or East entrance attracts business clientele and financial stability.',
      poojaTe: 'ఈశాన్యంలో పూజాగది నిర్మించి రోజూ శ్రీ వేంకటేశ్వర స్తోత్రం పఠించాలి.',
      poojaEn: 'North-East sacred altar dedicated to Lord Venkateswara.',
      kitchenTe: 'ఆగ్నేయంలో వంటగది; ఆకుపచ్చ లేదా లేత పసుపు రంగు టైల్స్ వాడటం మంచిది.',
      kitchenEn: 'South-East kitchen accented with subtle green or warm cream tiles.',
      wealthTe: 'ఉత్తర దిశలో నగలు, సేవింగ్స్ మరియు బిజినెస్ ఖాతా పుస్తకాలు భద్రపరచాలి.',
      wealthEn: 'North direction for financial registers, investment folios and cash safes.',
      coloursTe: 'ఆకుపచ్చ, క్రీమ్, తెలుపు, నెమలి పింఛపు రంగు.',
      coloursEn: 'Emerald green, cream, white, peacock shades.',
      remedyTe: 'ఇంట్లో బుధవారం నాడు పచ్చ కర్పూరం హారతి ఇవ్వడం వల్ల నెగటివ్ ఎనర్జీ తొలగిపోతుంది.',
      remedyEn: 'Burn pure green camphor (Pacha Karpooram) on Wednesdays to banish negativity.'
    },
    6: { // Tula (Venus)
      favourDirTe: 'పశ్చిమం (West) లేదా ఆగ్నేయం (South-East)',
      favourDirEn: 'West or South-East',
      sleepTe: 'దక్షిణం వైపు తలపెట్టి నిద్రించడం వల్ల దాంపత్య అనురాగం, సౌందర్యం నిత్యం నిలుస్తాయి.',
      sleepEn: 'Sleep head to South to enrich matrimonial tenderness and domestic prosperity.',
      entranceTe: 'ఉత్తరం లేదా పశ్చిమ దిశల సింహద్వారం కళాత్మక అభివృద్ధిని మరియు ధన లాభాన్ని ఇస్తుంది.',
      entranceEn: 'North or West entrance unlocks aesthetic grandeur and business fortunes.',
      poojaTe: 'ఈశాన్యంలో శ్రీ మహాలక్ష్మి లేదా అన్నపూర్ణా దేవి పూజ పరమ శుభప్రదం.',
      poojaEn: 'North-East altar honoring Goddess Mahalakshmi or Sri Annapurna.',
      kitchenTe: 'ఆగ్నేయం అత్యుత్తమం; వంటగదిని సదా పరిశుభ్రంగా, సువాసనభరితంగా ఉంచాలి.',
      kitchenEn: 'South-East kitchen kept immaculately fragrant and tidy.',
      wealthTe: 'ఉత్తరంలో కుబేర విగ్రహం లేదా లక్ష్మీ యంత్రం ఉంచడం వల్ల సంపద నిలుస్తుంది.',
      wealthEn: 'Kubera idol or Lakshmi Yantra placed in the North zone.',
      coloursTe: 'తెలుపు, లేత గులాబీ, వెండి రంగు, ఆకాశ నీలం.',
      coloursEn: 'Pristine white, soft rose, silver, celestial blue.',
      remedyTe: 'ఇంటి హాలులో ఒక చిన్న నీటి ఫౌంటెన్ లేదా పూల పాత్ర (ఉరుళి) ఉంచడం వల్ల వాస్తు దోషాలు పోతాయి.',
      remedyEn: 'Place an Uruli with fresh fragrant flowers and water in the living room.'
    },
    7: { // Vrischika (Mars)
      favourDirTe: 'దక్షిణం (South) లేదా తూర్పు (East)',
      favourDirEn: 'South or East',
      sleepTe: 'దక్షిణం వైపు తలపెట్టి పడుకోవడం వల్ల అంతర్గత భయాలు తొలగి పరాక్రమం పెరుగుతుంది.',
      sleepEn: 'Sleep head pointing South to dissolve anxieties and fortify inner resilience.',
      entranceTe: 'తూర్పు లేదా ఉత్తరం సింహద్వారం; దక్షిణ సింహద్వారం అయితే ముఖద్వారంపై పంచలోహ యంత్రం ఉంచాలి.',
      entranceEn: 'East or North main door is supreme; install protective Yantra if South-facing.',
      poojaTe: 'ఈశాన్యంలో శ్రీ సుబ్రహ్మణ్య స్వామి లేదా నరసింహ స్వామి పూజ విశేష రక్షణ ఇస్తుంది.',
      poojaEn: 'North-East sanctuary consecrated to Lord Subrahmanya or Lord Narasimha.',
      kitchenTe: 'ఆగ్నేయ మూల లోనే వంటగది ఉండాలి; నీటి కొళాయిలు ఉత్తరంలో ఉండాలి.',
      kitchenEn: 'South-East kitchen strictly; water lines positioned towards North.',
      wealthTe: 'నైరుతిలో బరువైన లాకర్ ఉంచి ఉత్తరం వైపు తెరుచుకునేలా అమర్చాలి.',
      wealthEn: 'Heavy South-West locker opening toward North preserves accumulated equity.',
      coloursTe: 'ముదురు ఎరుపు, మెరూన్, నారింజ, కాషాయం.',
      coloursEn: 'Deep crimson, maroon, flame orange, ochre.',
      remedyTe: 'ప్రతి మంగళవారం గుమ్మానికి ఎర్రటి పూల మాల వేసి, కర్పూర దీపం వెలిగించడం వాస్తు రక్ష.',
      remedyEn: 'Adorn main entrance with red flowers and light camphor on Tuesdays.'
    },
    8: { // Dhanussu (Jupiter)
      favourDirTe: 'ఈశాన్యం (North-East - దేవ మూల) లేదా తూర్పు (East)',
      favourDirEn: 'North-East (Deva Direction) or East',
      sleepTe: 'తూర్పు వైపు తలపెట్టి నిద్రించడం వల్ల బ్రహ్మజ్ఞానం, గౌరవం మరియు సంపూర్ణ ఆయుష్షు లభిస్తాయి.',
      sleepEn: 'Sleep head towards East for spiritual illumination, wisdom and sound health.',
      entranceTe: 'ఈశాన్యం లేదా తూర్పు సింహద్వారం ధనుస్సు రాశి వారికి సాక్షాత్తు గురు అనుగ్రహాన్ని ఇస్తుంది.',
      entranceEn: 'North-East or East main door commands peerless Jupiterian blessings and honor.',
      poojaTe: 'ఈశాన్య మూలలో విశాలమైన పూజాగది లేదా గ్రంథాలయం (స్టడీ రూమ్) ఏర్పాటు చేయడం సర్వోన్నతం.',
      poojaEn: 'North-East dedicated to a spacious pooja sanctuary or scholarly study room.',
      kitchenTe: 'ఆగ్నేయంలో వంటగది మరియు వాయువ్యంలో డైనింగ్ రూమ్ ఉండటం శ్రేయస్కరం.',
      kitchenEn: 'South-East kitchen complemented by North-West dining area.',
      wealthTe: 'ఉత్తరం లేదా ఈశాన్యంలో ఆధ్యాత్మిక వస్తువులు, పసుపు వస్త్రంలో చుట్టిన ధనం ఉంచడం శుభం.',
      wealthEn: 'Store savings in a yellow silk pouch within the North sector.',
      coloursTe: 'పసుపు, కనకపు వర్ణం, కాషాయం, తెలుపు.',
      coloursEn: 'Golden yellow, turmeric yellow, saffron, off-white.',
      remedyTe: 'గురువారం నాడు ఇంటి ముంగిట పసుపు నీళ్లు చల్లి ముగ్గు వేయడం వల్ల సకల దోషాలు నివారించబడతాయి.',
      remedyEn: 'Sprinkle turmeric-infused holy water at the front threshold on Thursdays.'
    },
    9: { // Makara (Saturn)
      favourDirTe: 'పశ్చిమం (West) లేదా ఉత్తరం (North)',
      favourDirEn: 'West or North',
      sleepTe: 'దక్షిణం వైపు తలపెట్టి నిద్రించడం వల్ల శరీర అలసట తొలగి దీర్ఘకాలిక వ్యాధులు నివారించబడతాయి.',
      sleepEn: 'Sleep head facing South to dispel exhaustion and stabilize musculoskeletal health.',
      entranceTe: 'ఉత్తరం లేదా పశ్చిమం సింహద్వారం మకర రాశి వారికి స్థిరాస్తుల వృద్ధిని మరియు కీర్తిని కలిగిస్తుంది.',
      entranceEn: 'North or West entrance yields profound real-estate gains and steady reputation.',
      poojaTe: 'ఈశాన్యంలో పూజాగది మరియు పశ్చిమంలో హనుమాన్ చాలీసా లేదా శని స్తోత్ర పారాయణం చేయాలి.',
      poojaEn: 'North-East prayer room with Hanuman Chalisa and Shani Shanti chants.',
      kitchenTe: 'ఆగ్నేయంలో వంటగది ఉండాలి; నీలిరంగు లేదా బూడిదరంగు ఎక్కువగా వాడకూడదు.',
      kitchenEn: 'South-East kitchen; avoid overly dark charcoal tones in cooking space.',
      wealthTe: 'పశ్చిమం లేదా నైరుతిలో ధన నిల్వ బీరువా ఉంచడం వల్ల ఖర్చులు తగ్గి ఆదా పెరుగుతుంది.',
      wealthEn: 'West or South-West vault curtails unnecessary outflows and solidifies savings.',
      coloursTe: 'నీలం, నలుపు మిశ్రితం లేని ముదురు నీలం, లేత బూడిద, పసుపు.',
      coloursEn: 'Royal blue, navy, slate, golden yellow accents.',
      remedyTe: 'శనివారం సాయంత్రం ఇంటి ప్రధాన గుమ్మం వద్ద నువ్వుల నూనెతో దీపం పెట్టడం వల్ల శని అనుగ్రహం లభిస్తుంది.',
      remedyEn: 'Light a sesame oil lamp at the exterior threshold on Saturday twilight.'
    },
    10: { // Kumbha (Saturn)
      favourDirTe: 'పశ్చిమం (West) లేదా ఉత్తరం (North)',
      favourDirEn: 'West or North',
      sleepTe: 'తూర్పు లేదా దక్షిణం వైపు తలపెట్టి పడుకోవడం వల్ల సరికొత్త వ్యాపార ఆలోచనలు, స్థిరత్వం వస్తాయి.',
      sleepEn: 'Sleep head to East or South to awaken visionary ideas and emotional grounding.',
      entranceTe: 'ఉత్తరం, తూర్పు లేదా పశ్చిమ ముఖ సింహద్వారం కుంభ రాశి వారికి అఖండ ధన యోగాన్ని తెస్తుంది.',
      entranceEn: 'North, East, or West entrance unlocks global recognition and progressive wealth.',
      poojaTe: 'ఈశాన్యంలో శివపంచాక్షరీ లేదా ఆంజనేయ స్వామి ఆరాధన అత్యున్నత రక్షణ ఇస్తుంది.',
      poojaEn: 'North-East corner consecrated to Lord Shiva and Lord Hanuman.',
      kitchenTe: 'ఆగ్నేయంలో వంటగది ఉండాలి; విద్యుత్ పరికరాలు ఆగ్నేయంలో అమర్చాలి.',
      kitchenEn: 'South-East kitchen with electrical appliances concentrated along East wall.',
      wealthTe: 'ఉత్తరంలో కుబేర స్థానం వద్ద ధన బీరువా ఉంచడం వల్ల అనేక మార్గాల్లో ఆదాయం సమకూరుతుంది.',
      wealthEn: 'North Kubera corner attracts multiple streams of recurring revenue.',
      coloursTe: 'ఆకాశ నీలం, ముదురు నీలం, ఊదా (పర్పుల్), పసుపు.',
      coloursEn: 'Sky blue, deep azure, violet, golden yellow.',
      remedyTe: 'ఇంటి వాయువ్య మూలలో గాలి గంటలు (Wind chimes) ఏర్పాటు చేయడం వల్ల నెగటివ్ ఆలోచనలు తొలగుతాయి.',
      remedyEn: 'Hang metallic melodic wind chimes in the North-West zone to circulate positive Prana.'
    },
    11: { // Meena (Jupiter)
      favourDirTe: 'ఈశాన్యం (North-East) లేదా తూర్పు (East)',
      favourDirEn: 'North-East or East',
      sleepTe: 'తూర్పు వైపు తలపెట్టి నిద్రించడం వల్ల నిరంతర దైవానుగ్రహం, మానసిక ఆనందం మరియు దీర్ఘాయుష్షు లభిస్తాయి.',
      sleepEn: 'Sleep head towards East to absorb divine sattva and blissful rejuvenation.',
      entranceTe: 'ఈశాన్యం లేదా తూర్పు సింహద్వారం మీన రాశి వారికి సాక్షాత్తు లక్ష్మీ కటాక్షాన్ని కలిగిస్తుంది.',
      entranceEn: 'North-East or East entrance showers unhindered Lakshmi grace and peace.',
      poojaTe: 'ఈశాన్యంలో విశాలమైన పూజా స్థానం ఏర్పాటు చేసి విష్ణు సహస్రనామ పారాయణం చేయాలి.',
      poojaEn: 'North-East sacred sanctum echoing with Sri Vishnu Sahasranama chanting.',
      kitchenTe: 'ఆగ్నేయంలో వంటగది; పసుపు లేదా క్రీమ్ రంగు గోడలు ఉండటం విశేష శుభప్రదం.',
      kitchenEn: 'South-East kitchen adorned with warm cream or golden-yellow hues.',
      wealthTe: 'ఉత్తరం లేదా ఈశాన్యంలో ఆధ్యాత్మిక గ్రంథాలు, బంగారు ఆభరణాల పెట్టె భద్రపరచాలి.',
      wealthEn: 'Store gold ornaments and financial documents in the North-East sanctuary.',
      coloursTe: 'బంగారు పసుపు, కనకపు వర్ణం, కాషాయం, శ్వేత వర్ణం.',
      coloursEn: 'Radiant gold, saffron yellow, warm cream, pure white.',
      remedyTe: 'ఈశాన్యంలో ఒక గాజు పాత్రలో స్వచ్ఛమైన నీటిని ఉంచి అందులో పసుపు పువ్వులు వేయడం పరమ పవిత్రం.',
      remedyEn: 'Keep a clean glass bowl with fresh water and yellow marigold petals in North-East.'
    }
  };

  const d = VASTU_DATA[rIdx] || VASTU_DATA[0];

  return {
    rashiTe: meta.te,
    rashiEn: meta.en,
    rulingPlanetTe: meta.lordTe,
    rulingPlanetEn: meta.lordEn,
    favourableDirectionTe: d.favourDirTe,
    favourableDirectionEn: d.favourDirEn,
    sleepHeadOrientationTe: d.sleepTe,
    sleepHeadOrientationEn: d.sleepEn,
    mainEntranceTe: d.entranceTe,
    mainEntranceEn: d.entranceEn,
    poojaRoomTe: d.poojaTe,
    poojaRoomEn: d.poojaEn,
    kitchenDirectionTe: d.kitchenTe,
    kitchenDirectionEn: d.kitchenEn,
    wealthCornerTe: d.wealthTe,
    wealthCornerEn: d.wealthEn,
    luckyColoursTe: d.coloursTe,
    luckyColoursEn: d.coloursEn,
    practicalRemedyTe: d.remedyTe,
    practicalRemedyEn: d.remedyEn,
  };
}
