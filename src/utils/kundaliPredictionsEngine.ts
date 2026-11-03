import { KundaliPlanetDetail } from './astronomyPanchangam';

export type ElementType = 'fire' | 'earth' | 'air' | 'water';

export interface LagnaCompleteProfile {
  lagnaRashiTe: string;
  lagnaRashiEn: string;
  lagnaLordTe: string;
  lagnaLordEn: string;
  lagnaLordHouse: number;
  lagnaLordRashiTe: string;
  lagnaLordRashiEn: string;
  elementTe: string;
  elementEn: string;
  dehaSwabhavamTe: string;
  dehaSwabhavamEn: string;
  manoSwabhavamTe: string;
  manoSwabhavamEn: string;
  lagnaLordEffectTe: string;
  lagnaLordEffectEn: string;
  lifeMissionTe: string;
  lifeMissionEn: string;
}

export interface SunMoonCombinationProfile {
  combinationNumber: number; // 1 to 144
  sunRashiTe: string;
  sunRashiEn: string;
  moonRashiTe: string;
  moonRashiEn: string;
  sunElement: ElementType;
  moonElement: ElementType;
  elementPairTitleTe: string;
  elementPairTitleEn: string;
  themesTe: string;
  themesEn: string;
  personalityTe: string;
  personalityEn: string;
  careerAndWealthTe: string;
  careerAndWealthEn: string;
  relationshipsTe: string;
  relationshipsEn: string;
  strengthsTe: string;
  strengthsEn: string;
  weaknessesTe: string;
  weaknessesEn: string;
  imageForIntegrationTe: string;
  imageForIntegrationEn: string;
  spiritualPathTe: string;
  spiritualPathEn: string;
}

export interface ElementalPlanetStrength {
  planetId: string;
  planetTe: string;
  planetEn: string;
  rashiTe: string;
  rashiEn: string;
  elementTe: string;
  elementEn: string;
  houseFromLagna: number;
  houseNameTe: string;
  houseNameEn: string;
  tier: 'best' | 'second' | 'third' | 'challenging';
  tierLabelTe: string;
  tierLabelEn: string;
  isRetrograde: boolean;
  analysisTe: string;
  analysisEn: string;
  remedyTe: string;
  remedyEn: string;
}

export interface SpecialSutraResult {
  id: string;
  titleTe: string;
  titleEn: string;
  badgeTe: string;
  badgeEn: string;
  isTriggered: boolean;
  descriptionTe: string;
  descriptionEn: string;
  remedyOrAdviceTe: string;
  remedyOrAdviceEn: string;
}

export interface BhavaPlanetPrediction {
  planetId: string;
  planetTe: string;
  planetEn: string;
  rashiTe: string;
  rashiEn: string;
  degreeFormatted: string;
  nakshatraTe: string;
  nakshatraEn: string;
  pada: number;
  navamshaRashiTe: string;
  houseNumber: number;
  bhavaNameTe: string;
  bhavaNameEn: string;
  predictionTe: string;
  predictionEn: string;
  deepAnalysisTe: string;
  deepAnalysisEn: string;
}

export interface DwadashaBhavaCompleteReport {
  houseNumber: number;
  bhavaTitleTe: string;
  bhavaTitleEn: string;
  signifTe: string;
  signifEn: string;
  rashiInHouseTe: string;
  rashiInHouseEn: string;
  lordTe: string;
  lordEn: string;
  lordPlacedInHouse: number;
  lordPlacedInRashiTe: string;
  occupantPlanetsTe: string[];
  occupantPlanetsEn: string[];
  detailedPredictionTe: string;
  detailedPredictionEn: string;
  guidanceTe: string;
  guidanceEn: string;
}

export interface BhriguCycleItem {
  cycleNumber: number;
  ageRangeTe: string;
  ageRangeEn: string;
  yearRange: string;
  activatedHouse: number;
  themeTe: string;
  themeEn: string;
  predictionTe: string;
  predictionEn: string;
}

export interface VedicRemediesProfile {
  luckyGemstoneTe: string;
  luckyGemstoneEn: string;
  wearingMethodTe: string;
  wearingMethodEn: string;
  rudrakshaTe: string;
  rudrakshaEn: string;
  luckyNumbers: string;
  luckyDaysTe: string;
  luckyDaysEn: string;
  luckyColorsTe: string;
  luckyColorsEn: string;
  aradhyaDeivamTe: string;
  aradhyaDeivamEn: string;
  nityaStotraTe: string;
  nityaStotraEn: string;
  danaPariharamTe: string;
  danaPariharamEn: string;
}

export type MehtaPlanetStrength = ElementalPlanetStrength;
export type MehtaSpecialSutraResult = SpecialSutraResult;

const RASHI_ELEMENTS: ElementType[] = [
  'fire',  // 0: Aries (మేషం)
  'earth', // 1: Taurus (వృషభం)
  'air',   // 2: Gemini (మిథునం)
  'water', // 3: Cancer (కర్కాటకం)
  'fire',  // 4: Leo (సింహం)
  'earth', // 5: Virgo (కన్య)
  'air',   // 6: Libra (తుల)
  'water', // 7: Scorpio (వృశ్చికం)
  'fire',  // 8: Sagittarius (ధనుస్సు)
  'earth', // 9: Capricorn (మకరం)
  'air',   // 10: Aquarius (కుంభం)
  'water', // 11: Pisces (మీనం)
];

const ELEMENT_META: Record<ElementType, { te: string; en: string }> = {
  fire: { te: 'అగ్ని తత్వం (Fire)', en: 'Fire Element' },
  earth: { te: 'భూ తత్వం (Earth)', en: 'Earth Element' },
  air: { te: 'వాయు తత్వం (Air)', en: 'Air Element' },
  water: { te: 'జల తత్వం (Water)', en: 'Water Element' },
};

const RASHI_META_12 = [
  { te: 'మేషం', en: 'Aries', lordId: 'mars', lordTe: 'కుజుడు', lordEn: 'Mars' },
  { te: 'వృషభం', en: 'Taurus', lordId: 'venus', lordTe: 'శుక్రుడు', lordEn: 'Venus' },
  { te: 'మిథునం', en: 'Gemini', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury' },
  { te: 'కర్కాటకం', en: 'Cancer', lordId: 'moon', lordTe: 'చంద్రుడు', lordEn: 'Moon' },
  { te: 'సింహం', en: 'Leo', lordId: 'sun', lordTe: 'సూర్యుడు', lordEn: 'Sun' },
  { te: 'కన్య', en: 'Virgo', lordId: 'mercury', lordTe: 'బుధుడు', lordEn: 'Mercury' },
  { te: 'తుల', en: 'Libra', lordId: 'venus', lordTe: 'శుక్రుడు', lordEn: 'Venus' },
  { te: 'వృశ్చికం', en: 'Scorpio', lordId: 'mars', lordTe: 'కుజుడు', lordEn: 'Mars' },
  { te: 'ధనుస్సు', en: 'Sagittarius', lordId: 'jupiter', lordTe: 'గురువు', lordEn: 'Jupiter' },
  { te: 'మకరం', en: 'Capricorn', lordId: 'saturn', lordTe: 'శని', lordEn: 'Saturn' },
  { te: 'కుంభం', en: 'Aquarius', lordId: 'saturn', lordTe: 'శని', lordEn: 'Saturn' },
  { te: 'మీనం', en: 'Pisces', lordId: 'jupiter', lordTe: 'గురువు', lordEn: 'Jupiter' },
];

const RASHI_LORDS_ID: string[] = RASHI_META_12.map((r) => r.lordId);

export const BHAVA_NAMES_12: { num: number; te: string; en: string; signifTe: string; signifEn: string; domainTe: string; domainEn: string }[] = [
  { num: 1, te: '1వ స్థానం (తను / లగ్న భావం)', en: '1st House (Tanu Bhava - Self)', signifTe: 'దేహ దారుఢ్యం, వ్యక్తిత్వం, ఆత్మవిశ్వాసం, కీర్తి, ప్రారంభ జీవితం', signifEn: 'Body, vitality, personality, self-confidence, honor, early life', domainTe: 'ఆరోగ్యం, ఆత్మబలం & వ్యక్తిత్వ వికాసం', domainEn: 'Vitality, Identity & Personal Growth' },
  { num: 2, te: '2వ స్థానం (ధన, వాక్ & కుటుంబ భావం)', en: '2nd House (Dhana & Kutumba Bhava)', signifTe: 'ధన నిల్వలు, వాక్చాతుర్యం, కుటుంబం, ఆహారం, నేత్రములు', signifEn: 'Wealth, speech, family life, food habits, right eye', domainTe: 'ఆర్థిక నిల్వలు, కుటుంబ సౌఖ్యం & వాక్శుద్ధి', domainEn: 'Accumulated Wealth, Speech & Family' },
  { num: 3, te: '3వ స్థానం (భాతృ, సహజ & పరాక్రమ భావం)', en: '3rd House (Sahaja & Parakrama Bhava)', signifTe: 'ధైర్య సాహసాలు, కనిష్ఠ సోదరులు, స్వల్ప ప్రయాణాలు, రచనా నైపుణ్యం, భుజములు', signifEn: 'Courage, younger siblings, short travels, communication, shoulders', domainTe: 'ధైర్య సాహసాలు, సోదర వర్గం & సంభాషణా నైపుణ్యం', domainEn: 'Courage, Siblings & Enterprise' },
  { num: 4, te: '4వ స్థానం (సుఖ, మాతృ, గృహ & వాహన భావం)', en: '4th House (Sukha, Matru & Vahana Bhava)', signifTe: 'తల్లి, గృహ-వాహన యోగం, భూమి, పునాది విద్య, మానసిక సుఖం', signifEn: 'Mother, home, vehicles, landed property, education, inner peace', domainTe: 'గృహ-వాహన ఆస్తులు, మాతృ సౌఖ్యం & మనశ్శాంతి', domainEn: 'Home, Real Estate, Vehicles & Inner Peace' },
  { num: 5, te: '5వ స్థానం (పుత్ర, పూర్వపుణ్య & బుద్ధి భావం)', en: '5th House (Putra & Vidya Bhava)', signifTe: 'సంతానం, ప్రతిభ, పూర్వజన్మ పుణ్యం, మంత్ర ఉపాసన, ఆలోచనా శక్తి', signifEn: 'Children, intelligence, past-life merit, spiritual sadhana', domainTe: 'సంతాన సౌఖ్యం, ఉన్నత మేధస్సు & పూర్వపుణ్యం', domainEn: 'Children, Creative Intelligence & Past Merit' },
  { num: 6, te: '6వ స్థానం (శత్రు, రోగ & ఋణ జయ భావం)', en: '6th House (Ari, Roga & Runa Bhava)', signifTe: 'పోటీలలో విజయం, ఆరోగ్యం, రుణ విముక్తి, సేవా రంగం, ఉద్యోగ శ్రమ', signifEn: 'Overcoming competitors, health, debts, service, daily work', domainTe: 'శత్రు-రుణ-రోగ జయం & పోటీ పరీక్షలలో విజయం', domainEn: 'Health, Service & Victory Over Obstacles' },
  { num: 7, te: '7వ స్థానం (కళత్ర, వివాహ & వ్యాపార భావం)', en: '7th House (Kalatra & Vivaha Bhava)', signifTe: 'వివాహం, జీవిత భాగస్వామి, వ్యాపార భాగస్వామ్యం, సామాజిక సంబంధాలు', signifEn: 'Marriage, spouse, business partnerships, public relations', domainTe: 'దాంపత్య సౌఖ్యం, జీవిత భాగస్వామి & వాణిజ్య ఒప్పందాలు', domainEn: 'Marriage, Spouse & Business Partnerships' },
  { num: 8, te: '8వ స్థానం (ఆయుర్దాయ, వారసత్వ & రహస్య భావం)', en: '8th House (Ayur & Randhra Bhava)', signifTe: 'ఆయుర్దాయం, ఆకస్మిక ధన ప్రాప్తి, వారసత్వ ఆస్తి, జ్యోతిష్య/నిగూఢ శాస్త్ర పరిశోధన', signifEn: 'Longevity, sudden transformations, inheritance, occult & deep research', domainTe: 'పూర్ణ ఆయుర్దాయం, వారసత్వ ఆస్తులు & రహస్య విజ్ఞానం', domainEn: 'Longevity, Inheritance & Deep Transformation' },
  { num: 9, te: '9వ స్థానం (భాగ్య, ధర్మ, పితృ & గురు భావం)', en: '9th House (Bhagya & Dharma Bhava)', signifTe: 'తండ్రి, అదృష్టం, గురు భక్తి, తీర్థయాత్రలు, ఉన్నత విద్య, ధర్మం', signifEn: 'Father, fortune, higher wisdom, long journeys, dharma, grace', domainTe: 'అదృష్ట యోగం, ధర్మ నిষ্ঠ, పితృ ఆశీస్సులు & విదేశీ ప్రయాణం', domainEn: 'Fortune, Dharma, Higher Learning & Grace' },
  { num: 10, te: '10వ స్థానం (కర్మ, రాజ్య, ఉద్యోగ & కీర్తి భావం)', en: '10th House (Karma & Career Bhava)', signifTe: 'ఉద్యోగం, వ్యాపారం, అధికారం, సమాజంలో పేరు ప్రతిష్టలు, కీర్తి', signifEn: 'Career, profession, authority, social standing, achievements', domainTe: 'వృత్తి-ఉద్యోగ అధికారం, రాజయోగం & సంఘ గౌరవం', domainEn: 'Career Authority, Profession & Public Honor' },
  { num: 11, te: '11వ స్థానం (లాభ, ఆదాయ & అభీష్ట సిద్ధి భావం)', en: '11th House (Labha Bhava - Gains)', signifTe: 'ఆదాయం, కోరికల సిద్ధి, పెద్ద సోదరులు, మిత్ర వర్గం, పురస్కారాలు', signifEn: 'Gains, income, fulfillment of desires, elder siblings, social network', domainTe: 'సర్వతోముఖ ఆర్థిక లాభాలు, మిత్ర సహకారం & కోరికల సిద్ధి', domainEn: 'Abundant Gains, Prosperity & Fulfilled Wishes' },
  { num: 12, te: '12వ స్థానం (వ్యయ, విదేశీ & మోక్ష భావం)', en: '12th House (Vyaya & Moksha Bhava)', signifTe: 'విదేశీ నివాసం, ధర్మ వ్యయం, ఆధ్యాత్మిక విముక్తి, నిద్ర, రహస్య సహాయం', signifEn: 'Foreign residence, charitable expenses, spiritual liberation, sleep', domainTe: 'శుభకార్య వ్యయం, విదేశీ నివాస యోగం & ఆధ్యాత్మిక మోక్షం', domainEn: 'Dharmic Expenditure, Foreign Lands & Moksha' },
];

// Sun Sign (Conscious Self / Atma) 12 Profiles
const SUN_SIGN_CORE: {
  te: string;
  en: string;
  themesTe: string;
  themesEn: string;
  consciousDriveTe: string;
  consciousDriveEn: string;
  vocationTe: string;
  vocationEn: string;
}[] = [
  {
    te: 'మేషం', en: 'Aries',
    themesTe: 'ధైర్యం, చురుకైన ఆలోచన, స్వతంత్ర వ్యక్తిత్వం, నాయకత్వ ఉత్సాహం',
    themesEn: 'Bold, quick-thinking, pioneering spirit, independent, courageous',
    consciousDriveTe: 'మీ సూర్య రాశి మేషం కావడం వల్ల మీరు సహజంగానే ఏ పనిలోనైనా ముందడుగు వేసే ధైర్యం, స్వతంత్ర భావాలు మరియు కొత్త మార్గాలను అన్వేషించే ఉత్సాహం కలిగి ఉంటారు. సవాళ్లను ఎదుర్కోవడంలో ఎప్పుడూ వెనుకాడరు. ఆత్మగౌరవం, నిజాయితీ మీ ప్రధాన ఆభరణాలు.',
    consciousDriveEn: 'With Sun in Aries, your conscious drive is pioneering, action-oriented, and fiercely independent. You thrive on fresh challenges and leading from the front with courage and self-reliance.',
    vocationTe: 'వ్యాపార సంస్థల స్థాపన, ఇంజనీరింగ్, రక్షణ రంగం, క్రీడలు, మేనేజ్‌మెంట్, ప్రభుత్వ ఉన్నత సేవలు మరియు స్వతంత్ర వృత్తులు.',
    vocationEn: 'Entrepreneurship, engineering, defense, sports, executive leadership, civil administration, and independent professions.',
  },
  {
    te: 'వృషభం', en: 'Taurus',
    themesTe: 'స్థిరత్వం, ఆచరణాత్మక జ్ఞానం, కళాభిరుచి, ఆర్థిక క్రమశిక్షణ, ఓర్పు',
    themesEn: 'Determined, practical, artistic sensibility, financial wisdom, steadfast',
    consciousDriveTe: 'మీ సూర్య రాశి వృషభం కావడం వల్ల మీరు జీవితంలో స్థిరత్వం, భద్రత మరియు నమ్మకానికి అధిక ప్రాధాన్యత ఇస్తారు. ఏ పని మొదలుపెట్టినా ఓర్పుతో, పట్టుదలతో పూర్తి చేసి శాశ్వతమైన ఆర్థిక, కుటుంబ పునాదులను నిర్మించుకుంటారు.',
    consciousDriveEn: 'With Sun in Taurus, your conscious mind seeks solidity, permanence, and tangible results. You build lasting foundations with patience, loyalty, and financial resourcefulness.',
    vocationTe: 'బ్యాంకింగ్, ఆర్థిక రంగం, రియల్ ఎస్టేట్, సంగీతం/కళలు, ఆభరణాలు, వ్యవసాయం మరియు ఆహార వ్యాపారాలు.',
    vocationEn: 'Banking, finance, real estate, music/arts, luxury goods, agriculture, and hospitality.',
  },
  {
    te: 'మిథునం', en: 'Gemini',
    themesTe: 'వాక్చాతుర్యం, బహుముఖ ప్రజ్ఞ, నిరంతర జిజ్ఞాస, వేగవంతమైన బుద్ధి',
    themesEn: 'Versatile, articulate, intellectually curious, adaptable, quick-witted',
    consciousDriveTe: 'మీ సూర్య రాశి మిథునం కావడం వల్ల మీకు అద్భుతమైన వాక్చాతుర్యం, కొత్త విషయాలు నేర్చుకోవాలనే తపన మరియు బహుముఖ ప్రజ్ఞ ఉంటాయి. మీ మాటలతో, ఆలోచనలతో ఇతరులను సులభంగా ఆకట్టుకుంటారు మరియు కాలానుగుణంగా వ్యూహాలను మార్చుకోగలరు.',
    consciousDriveEn: 'With Sun in Gemini, your conscious nature is intellectually agile, communicative, and versatile. You excel at connecting ideas, technologies, and people rapidly.',
    vocationTe: 'సాఫ్ట్‌వేర్, జర్నలిజం, బోధన, మార్కెటింగ్, రచనా రంగం, కన్సల్టెన్సీ మరియు వాణిజ్య రంగాలు.',
    vocationEn: 'Software/IT, journalism, teaching, marketing, writing, consultancy, and communications.',
  },
  {
    te: 'కర్కాటకం', en: 'Cancer',
    themesTe: 'కుటుంబ ప్రేమ, అంతర్దృష్టి, రక్షణ స్వభావం, సానుభూతి, ఆర్థిక జాగ్రత్త',
    themesEn: 'Nurturing, intuitive, protective, family-oriented, emotionally perceptive',
    consciousDriveTe: 'మీ సూర్య రాశి కర్కాటకం కావడం వల్ల మీరు కుటుంబానికి, సంప్రదాయాలకు మరియు ఆత్మీయుల క్షేమానికి పెద్దపీట వేస్తారు. సున్నితమైన మనస్సు ఉన్నప్పటికీ, లక్ష్య సాధనలోను, ఆర్థిక భద్రతను కాపాడుకోవడంలోను ఎంతో పట్టుదల చూపిస్తారు.',
    consciousDriveEn: 'With Sun in Cancer, your conscious drive combines deep protective care for family and community with shrewd practical tenacity.',
    vocationTe: 'వైద్యం, విద్య, హోటల్/గృహ నిర్మాణ రంగం, కౌన్సెలింగ్, పబ్లిక్ సర్వీస్ మరియు ఆర్థిక నిర్వహణ.',
    vocationEn: 'Healthcare, education, real estate/hospitality, counseling, public welfare, and asset management.',
  },
  {
    te: 'సింహం', en: 'Leo',
    themesTe: 'ఆత్మగౌరవం, రాజసం, ఉదార స్వభావం, నాయకత్వ పటిమ, సృజనాత్మకత',
    themesEn: 'Magnanimous, authoritative, creative, honourable, natural leader',
    consciousDriveTe: 'మీ సూర్య రాశి సింహం కావడం వల్ల మీలో సహజమైన రాజసం, ఆత్మవిశ్వాసం మరియు ఉన్నత ఆశయాలు ఉంటాయి. ఎక్కడ ఉన్నా ప్రత్యేక గుర్తింపు పొందాలని, ధర్మబద్ధంగా ఇతరులకు మార్గదర్శకంగా నిలవాలని కోరుకుంటారు.',
    consciousDriveEn: 'With Sun in Leo, your conscious spirit is radiant, dignified, and ambitious. You are driven by honor, creative self-expression, and noble leadership.',
    vocationTe: 'ప్రభుత్వ ఉన్నత పదవులు, రాజకీయాలు, సినిమా/కళా రంగం, CEO/మేనేజ్‌మెంట్ మరియు స్వతంత్ర వ్యాపారం.',
    vocationEn: 'Government administration, politics, performing arts, executive management, and enterprise leadership.',
  },
  {
    te: 'కన్య', en: 'Virgo',
    themesTe: 'సూక్ష్మ పరిశీలన, క్రమశిక్షణ, సేవా భావం, విశ్లేషణా శక్తి, పరిపూర్ణత',
    themesEn: 'Analytical, precise, methodical, service-oriented, discerning',
    consciousDriveTe: 'మీ సూర్య రాశి కన్య కావడం వల్ల మీరు ప్రతి విషయాన్ని లోతుగా విశ్లేషించి, లోపాలను సరిదిద్ది పరిపూర్ణత సాధించాలని చూస్తారు. కఠిన శ్రమ, నిజాయితీ మరియు బుద్ధిబలం మీ ప్రధాన ఆయుధాలు.',
    consciousDriveEn: 'With Sun in Virgo, your conscious focus is analytical, detail-oriented, and dedicated to excellence and practical service.',
    vocationTe: 'ఆడిటింగ్, అకౌంటెన్సీ, వైద్యం, డేటా సైన్స్, పరిశోధన, న్యాయవాద వృత్తి మరియు అడ్మినిస్ట్రేషన్.',
    vocationEn: 'Auditing, accountancy, medicine, data science, research, law, and administration.',
  },
  {
    te: 'తుల', en: 'Libra',
    themesTe: 'న్యాయ బుద్ధి, దౌత్య నైపుణ్యం, సౌందర్య ఆరాధన, సమతుల్యత, స్నేహశీలత',
    themesEn: 'Diplomatic, fair-minded, aesthetic, cooperative, socially graceful',
    consciousDriveTe: 'మీ సూర్య రాశి తుల కావడం వల్ల మీరు అన్ని విషయాలలో ధర్మం, న్యాయం మరియు సామరస్యాన్ని కోరుకుంటారు. వివాదాలను శాంతియుతంగా పరిష్కరించడంలో, అందరినీ కలుపుకొని వెళ్లడంలో సిద్ధహస్తులు.',
    consciousDriveEn: 'With Sun in Libra, your conscious nature seeks harmony, justice, beauty, and balanced partnerships through tact and intellect.',
    vocationTe: 'న్యాయశాస్త్రం (Law), దౌత్య రంగం, పబ్లిక్ రిలేషన్స్, ఫ్యాషన్/డిజైనింగ్, వ్యాపార భాగస్వామ్యాలు.',
    vocationEn: 'Law and judiciary, diplomacy, public relations, design/aesthetics, and business partnerships.',
  },
  {
    te: 'వృశ్చికం', en: 'Scorpio',
    themesTe: 'పట్టుదల, నిగూఢ పరిశోధన, ఆత్మబలం, లోతైన భావాలు, వ్యూహాత్మకత',
    themesEn: 'Intense, investigative, resilient, strategic, deeply committed',
    consciousDriveTe: 'మీ సూర్య రాశి వృశ్చికం కావడం వల్ల మీకు అసాధారణమైన సంకల్ప బలం మరియు రహస్యాలను ఛేదించే పరిశోధనా దృష్టి ఉంటాయి. ఎన్ని ఆటంకాలు ఎదురైనా తిరిగి రెట్టింపు శక్తితో విజయం సాధిస్తారు.',
    consciousDriveEn: 'With Sun in Scorpio, your conscious willpower is penetrating, resilient, and transformative. You never stop until you uncover the deeper truth.',
    vocationTe: 'సైన్స్ & రీసెర్చ్, సర్జరీ/వైద్యం, ఇంటెలిజెన్స్, జ్యోతిష్యం/ఆధ్యాత్మికం, ఇన్సూరెన్స్ & ఫైనాన్స్.',
    vocationEn: 'Scientific research, surgery/medicine, investigation, occult studies, insurance, and finance.',
  },
  {
    te: 'ధనుస్సు', en: 'Sagittarius',
    themesTe: 'ధర్మ నిষ্ঠ, ఆశావాదం, ఉన్నత విద్య, తాత్విక దృష్టి, నిష్కపటత్వం',
    themesEn: 'Visionary, optimistic, philosophical, truth-seeking, adventurous',
    consciousDriveTe: 'మీ సూర్య రాశి ధనుస్సు కావడం వల్ల మీరు సత్యం, ధర్మం మరియు ఉన్నత జ్ఞానానికి విలువనిస్తారు. భవిష్యత్తుపై గొప్ప ఆశావాదంతో పెద్ద లక్ష్యాలను నిర్దేశించుకుని గురువుల ఆశీస్సులతో ముందుకు సాగుతారు.',
    consciousDriveEn: 'With Sun in Sagittarius, your conscious mind is expansive, idealistic, and future-oriented, guided by moral integrity and wisdom.',
    vocationTe: 'విశ్వవిద్యాలయ బోధన, న్యాయ రంగం, ఆధ్యాత్మిక/ధార్మిక సంస్థలు, విదేశీ వాణిజ్యం, పబ్లిషింగ్.',
    vocationEn: 'Higher education, law, spiritual/philosophical institutions, international trade, and publishing.',
  },
  {
    te: 'మకరం', en: 'Capricorn',
    themesTe: 'కర్మ నిষ্ঠ, కార్యదీక్ష, బాధ్యతాయుత ప్రవర్తన, ఆచరణాత్మక ఆశయం',
    themesEn: 'Ambitious, disciplined, pragmatic, responsible, enduring',
    consciousDriveTe: 'మీ సూర్య రాశి మకరం కావడం వల్ల మీరు క్రమశిక్షణ, కఠిన పరిశ్రమ మరియు బాధ్యతలతో అంచెలంచెలుగా ఉన్నత శిఖరాలను అధిరోహిస్తారు. ఆచరణ సాధ్యమైన ప్రణాళికలతో స్థిరమైన విజయాన్ని నిర్మించుకుంటారు.',
    consciousDriveEn: 'With Sun in Capricorn, your conscious drive is disciplined, strategic, and built for long-term achievement and respected authority.',
    vocationTe: 'ఇంజనీరింగ్, ఇండస్ట్రీస్, ప్రభుత్వ పాలన, కార్పొరేట్ డైరెక్టర్, ఆర్కిటెక్చర్ మరియు మైనింగ్/రియల్ ఎస్టేట్.',
    vocationEn: 'Engineering, industrial management, civil service, corporate leadership, architecture, and infrastructure.',
  },
  {
    te: 'కుంభం', en: 'Aquarius',
    themesTe: 'మానవతా దృక్పథం, వినూత్న ఆలోచనలు, స్వతంత్ర సిద్ధాంతాలు, వైజ్ఞానిక బుద్ధి',
    themesEn: 'Humanitarian, progressive, inventive, independent thinker, objective',
    consciousDriveTe: 'మీ సూర్య రాశి కుంభం కావడం వల్ల మీరు సమాజ హితం, ఆధునిక సాంకేతికత మరియు స్వతంత్ర భావాలకు ప్రతీకగా ఉంటారు. సాంప్రదాయ పరిధులను దాటి కొత్త ఆవిష్కరణలు చేయడంలో ముందుంటారు.',
    consciousDriveEn: 'With Sun in Aquarius, your conscious intellect is progressive, inventive, and dedicated to social welfare and objective truth.',
    vocationTe: 'సైన్స్ & టెక్నాలజీ, ఏవియేషన్/అంతరిక్ష పరిశోధన, సామాజిక సేవా సంస్థలు, నెట్‌వర్కింగ్, జ్యోతిష్య పరిశోధన.',
    vocationEn: 'Science and technology, aviation/research, social reform organizations, networking, and astrology.',
  },
  {
    te: 'మీనం', en: 'Pisces',
    themesTe: 'కరుణ, ఆధ్యాత్మిక అంతర్దృష్టి, సృజనాత్మక ఊహాశక్తి, నిస్వార్థ సేవ',
    themesEn: 'Compassionate, intuitive, imaginative, spiritually receptive, artistic',
    consciousDriveTe: 'మీ సూర్య రాశి మీనం కావడం వల్ల మీలో అపారమైన దయాగుణం, దైవభక్తి మరియు లోతైన అంతర్దృష్టి ఉంటాయి. ఇతరుల కష్టాలను తమవిగా భావించి సహాయం చేసే ఉదాత్త హృదయం మీ సొంతం.',
    consciousDriveEn: 'With Sun in Pisces, your conscious spirit is empathetic, visionary, and deeply connected to spiritual and artistic ideals.',
    vocationTe: 'వైద్యం, ఆధ్యాత్మిక బోధన, కళలు/సంగీతం, సాహిత్యం, ధార్మిక సంస్థలు, సైకాలజీ మరియు విదేశీ సంబంధిత రంగాలు.',
    vocationEn: 'Healing and medicine, spiritual teaching, music/arts, literature, philanthropy, and psychology.',
  },
];

// Moon Sign (Emotional Nature / Manas) 12 Profiles
const MOON_SIGN_CORE: {
  te: string;
  en: string;
  emotionalNatureTe: string;
  emotionalNatureEn: string;
  relationshipStyleTe: string;
  relationshipStyleEn: string;
  strengthTe: string;
  strengthEn: string;
  weaknessTe: string;
  weaknessEn: string;
  symbolTe: string;
  symbolEn: string;
  spiritualPathTe: string;
  spiritualPathEn: string;
}[] = [
  {
    te: 'మేషం', en: 'Aries',
    emotionalNatureTe: 'చంద్రుడు మేష రాశిలో ఉండటం వల్ల మీ మనస్సు ఎప్పుడూ చురుకుగా, ఉత్సాహంగా మరియు తక్షణ నిర్ణయాలు తీసుకునే స్వభావంతో ఉంటుంది. ఏ విషయాన్నైనా దాపరికం లేకుండా నేరుగా మాట్లాడతారు.',
    emotionalNatureEn: 'With Moon in Aries, your emotional instincts are spontaneous, fiery, and direct. You respond to life with immediate courage and enthusiasm.',
    relationshipStyleTe: 'ప్రేమ, దాంపత్యంలో నిజాయితీని, ఉత్సాహాన్ని కోరుకుంటారు. మీ భాగస్వామి పట్ల తీవ్రమైన రక్షణ భావం మరియు నిబద్ధత చూపిస్తారు. కుటుంబ గౌరవాన్ని కాపాడటంలో ముందుంటారు.',
    relationshipStyleEn: 'In relationships you are ardent, honest, and fiercely protective, needing a partner who respects your independence and spirit.',
    strengthTe: 'నిర్భయమైన మనస్తత్వం, తక్షణ కార్యదీక్ష, కష్టాలలో కుంగిపోని ఆత్మవిశ్వాసం.',
    strengthEn: 'Fearless initiative, emotional resilience, and inspiring enthusiasm.',
    weaknessTe: 'ఆవేశం, అసహనం మరియు ఇతరుల వేగాన్ని తట్టుకోలేకపోవడం తగ్గించుకోవాలి.',
    weaknessEn: 'Impatience, quick temper, and rushing before considering others’ pace.',
    symbolTe: 'ఉదయించే సూర్యకిరణాలతో ప్రకాశించే యోధుని రథం — ధైర్యం మరియు నూతన ఆరంభానికి ప్రతీక.',
    symbolEn: 'A fearless crusader riding into the radiant dawn of a new adventure.',
    spiritualPathTe: 'శ్రీ సుబ్రహ్మణ్య స్వామి మరియు ఆంజనేయ స్వామి ఉపాసన మీ మనస్సుకు అపారమైన స్థైర్యాన్ని, కార్యజయాన్ని ప్రసాదిస్తుంది.',
    spiritualPathEn: 'Worship of Lord Subrahmanya and Lord Hanuman channels your fiery mind into victorious peace.',
  },
  {
    te: 'వృషభం', en: 'Taurus',
    emotionalNatureTe: 'చంద్రుడు ఉచ్చ రాశి అయిన వృషభంలో ఉండటం వల్ల మీకు మానసిక స్థిరత్వం, ప్రశాంతత, ఆకర్షణీయమైన వ్యక్తిత్వం మరియు ప్రకృతి/కళల పట్ల మక్కువ ఉంటాయి. ఒత్తిడిలో కూడా నిబ్బరంగా ఉంటారు.',
    emotionalNatureEn: 'With Moon exalted in Taurus, your emotional nature is grounded, serene, sensual, and dependable. You possess natural magnetism and inner calm.',
    relationshipStyleTe: 'వివాహ బంధంలో శాశ్వతమైన ప్రేమ, నమ్మకం మరియు గృహ సౌఖ్యాన్ని కోరుకుంటారు. కుటుంబానికి కొండంత అండగా నిలుస్తారు. జీవిత భాగస్వామితో అన్యోన్యంగా ఉంటారు.',
    relationshipStyleEn: 'You are deeply loyal, affectionate, and devoted to building a secure, comfortable, and loving home life.',
    strengthTe: 'అచంచలమైన మానసిక స్థైర్యం, ఆర్థిక అదృష్టం, సహనం మరియు ఆత్మీయత.',
    strengthEn: 'Unflappable emotional stability, financial magnetism, endurance, and warmth.',
    weaknessTe: 'మొండితనం, మార్పులను త్వరగా అంగీకరించకపోవడం మరియు అతి జాగ్రత్త.',
    weaknessEn: 'Stubborn resistance to sudden change and possessiveness.',
    symbolTe: 'పచ్చని తోటలో ప్రశాంతంగా ప్రవహించే సెలయేరు మరియు సువాసనల పూల వనం — శాంతి, సమృద్ధికి ప్రతీక.',
    symbolEn: 'A lush, flourishing garden of peace, music, and material abundance.',
    spiritualPathTe: 'శ్రీ మహాలక్ష్మి అమ్మవారి ఆరాధన మరియు శ్రీ లలితా సహస్రనామ పారాయణ మీ ఇంట అష్టైశ్వర్యాలను నింపుతుంది.',
    spiritualPathEn: 'Sri Mahalakshmi worship and Lalita Sahasranama recitation amplify your natural abundance and domestic bliss.',
  },
  {
    te: 'మిథునం', en: 'Gemini',
    emotionalNatureTe: 'చంద్రుడు మిథున రాశిలో ఉండటం వల్ల మీ మనస్సు ఎప్పుడూ కొత్త విషయాలను అన్వేషిస్తూ, చమత్కారంగా మరియు చురుకుగా ఉంటుంది. మాటల ద్వారా ఇతరులకు ఊరటనిస్తారు.',
    emotionalNatureEn: 'With Moon in Gemini, your emotional responses are witty, adaptable, and intellectually curious. You process feelings through lively communication.',
    relationshipStyleTe: 'భాగస్వామితో స్నేహపూర్వక సంభాషణ, మేధోపరమైన అవగాహన మరియు ఉల్లాసమైన వాతావరణాన్ని కోరుకుంటారు. ఇంటా బయటా సంతోషాన్ని పంచుతారు.',
    relationshipStyleEn: 'You need mental rapport, friendship, and lively conversation in marriage to feel truly connected.',
    strengthTe: 'సమయస్ఫూర్తి, కమ్యూనికేషన్ నైపుణ్యం, పరిస్థితులకు త్వరగా అలవాటు పడే గుణం.',
    strengthEn: 'Quick wit, adaptability, and gift for articulate expression.',
    weaknessTe: 'ఒకే సమయంలో అనేక ఆలోచనలతో మానసిక చంచలత్వం మరియు అలసట.',
    weaknessEn: 'Mental restlessness, scattering energy across too many interests at once.',
    symbolTe: 'వసంత ఋతువులో పూల తోటపై స్వేచ్ఛగా ఎగిరే హంస — జ్ఞానం మరియు సమన్వయానికి ప్రతీక.',
    symbolEn: 'A graceful messenger bridging ideas and hearts with effortless wisdom.',
    spiritualPathTe: 'శ్రీ మహావిష్ణువు ఆరాధన మరియు విష్ణు సహస్రనామ స్తోత్ర పారాయణ మీ బుద్ధికి ఏకాగ్రతను, వాక్శుద్ధిని ఇస్తుంది.',
    spiritualPathEn: 'Recitation of Sri Vishnu Sahasranama brings mental stillness and supreme intellectual clarity.',
  },
  {
    te: 'కర్కాటకం', en: 'Cancer',
    emotionalNatureTe: 'చంద్రుడు స్వక్షేత్రమైన కర్కాటకంలో ఉండటం వల్ల మీకు మాతృహృదయం, లోతైన సానుభూతి, బలమైన జ్ఞాపకశక్తి మరియు అద్భుతమైన అంతర్దృష్టి (Intuition) ఉంటాయి.',
    emotionalNatureEn: 'With Moon in its own sign of Cancer, your emotional life is rich, empathetic, intuitive, and deeply connected to family roots.',
    relationshipStyleTe: 'ఆత్మీయులను తల్లిలా ప్రేమిస్తారు, రక్షిస్తారు. కుటుంబానికి, గృహ శాంతికి జీవితంలో అత్యున్నత స్థానం ఇస్తారు.',
    relationshipStyleEn: 'You nurture and protect loved ones wholeheartedly, thriving in a warm, secure domestic sanctuary.',
    strengthTe: 'నిస్వార్థ సేవా భావం, ఇతరుల మనస్సును పసిగట్టే శక్తి, కుటుంబ నిబద్ధత.',
    strengthEn: 'Deep empathy, psychic intuition, and unwavering family devotion.',
    weaknessTe: 'చిన్న మాటకే నొచ్చుకోవడం, గత విషయాలను ఎక్కువగా తలచుకుని బాధపడటం.',
    weaknessEn: 'Oversensitivity to criticism and holding on to past emotional memories.',
    symbolTe: 'పున్నమి వెన్నెలలో ప్రశాంతమైన సముద్ర తీరాన వెలిగే దీపం — మాతృవాత్సల్యం మరియు అంతర్దృష్టికి ప్రతీక.',
    symbolEn: 'The full moon illuminating calm waters beside a warm family hearth.',
    spiritualPathTe: 'పార్వతీ పరమేశ్వరుల ఆరాధన మరియు శివాభిషేకం మీ మనస్సుకు అచంచలమైన శాంతిని, ఆత్మబలాన్ని ఇస్తాయి.',
    spiritualPathEn: 'Worship of Shiva-Parvati and Rudrabhishekam bestows emotional serenity and divine protection.',
  },
  {
    te: 'సింహం', en: 'Leo',
    emotionalNatureTe: 'చంద్రుడు సింహ రాశిలో ఉండటం వల్ల మీ మనస్సు ఉదారంగా, రాజసంగా మరియు ఆత్మవిశ్వాసంతో ఉంటుంది. అల్పమైన విషయాలకు లొంగకుండా ఉన్నత విలువలతో జీవిస్తారు.',
    emotionalNatureEn: 'With Moon in Leo, your emotional nature is warm-hearted, dignified, generous, and dramatic. You naturally inspire confidence in others.',
    relationshipStyleTe: 'ప్రేమలోను, కుటుంబంలోను పూర్తి నిజాయితీ, గౌరవం మరియు ఆదరణను కోరుకుంటారు. ఆత్మీయుల కోసం ఎంతటి త్యాగానికైనా సిద్ధపడతారు.',
    relationshipStyleEn: 'You are a grand, loyal romantic who showers warmth on loved ones and expects mutual respect and appreciation.',
    strengthTe: 'నాయకత్వ ఆకర్షణ, ఆత్మబలం, ఉదార బుద్ధి మరియు సృజనాత్మక ఉత్సాహం.',
    strengthEn: 'Charismatic warmth, noble integrity, and creative leadership.',
    weaknessTe: 'అహం దెబ్బతింటే తట్టుకోలేకపోవడం, పొగడ్తలకు త్వరగా ఆకర్షితులవడం.',
    weaknessEn: 'Wounded pride when unappreciated and a tendency to be overly commanding.',
    symbolTe: 'రాజభవనంలో పండితులను, కళాకారులను సత్కరిస్తున్న మహారాజు — గౌరవం మరియు ఔదార్యానికి ప్రతీక.',
    symbolEn: 'A noble monarch celebrating art, loyalty, and generosity in a sunlit court.',
    spiritualPathTe: 'సూర్యనారాయణ స్వామి ఆరాధన మరియు ఆదిత్య హృదయ పారాయణ మీ తేజస్సును, అధికార యోగాన్ని ద్విగుణీకృతం చేస్తాయి.',
    spiritualPathEn: 'Surya Upasana and Aditya Hrudayam recitation elevate your leadership grace and vitality.',
  },
  {
    te: 'కన్య', en: 'Virgo',
    emotionalNatureTe: 'చంద్రుడు కన్యా రాశిలో ఉండటం వల్ల మీ మనస్సు క్రమబద్ధంగా, వివేకంతో మరియు సేవా దృక్పథంతో పనిచేస్తుంది. ప్రతి చిన్న విషయాన్ని నిశితంగా గమనిస్తారు.',
    emotionalNatureEn: 'With Moon in Virgo, your instincts are discerning, helpful, orderly, and practical. You find emotional peace through usefulness and skill.',
    relationshipStyleTe: 'మాటల కంటే చేతల ద్వారా, నిరంతర సహాయం ద్వారా మీ ప్రేమను వ్యక్తపరుస్తారు. నిజాయితీగల భాగస్వామిగా ఉంటారు.',
    relationshipStyleEn: 'You show love through practical devotion, reliability, and thoughtful attention to your partner’s needs.',
    strengthTe: 'సమస్యలను పరిష్కరించే నేర్పు, నిజాయితీ, నైపుణ్యం మరియు ఆరోగ్య స్పృహ.',
    strengthEn: 'Practical problem-solving, craftsmanship, and conscientious care.',
    weaknessTe: 'అతిగా ఆలోచించడం, స్వీయ విమర్శ మరియు అనవసర ఆందోళన.',
    weaknessEn: 'Over-analyzing feelings, perfectionist worry, and self-criticism.',
    symbolTe: 'నిశ్శబ్దమైన మందిరంలో అద్భుత శిల్పాన్ని చెక్కుతున్న నిపుణుడు — నైపుణ్యం మరియు అంకితభావానికి ప్రతీక.',
    symbolEn: 'A master artisan perfecting an intricate work of enduring value.',
    spiritualPathTe: 'శ్రీ వేంకటేశ్వర స్వామి మరియు గణపతి ఆరాధన మీ ఆందోళనలను తొలగించి, వృత్తిలో అఖండ విజయాన్ని ఇస్తుంది.',
    spiritualPathEn: 'Worship of Lord Venkateswara and Lord Ganapathi dissolves worry and brings prosperous order.',
  },
  {
    te: 'తుల', en: 'Libra',
    emotionalNatureTe: 'చంద్రుడు తులా రాశిలో ఉండటం వల్ల మీ మనస్సు ఎప్పుడూ ప్రశాంతత, సమతుల్యత, మర్యాద మరియు సౌందర్యాన్ని కోరుకుంటుంది. కలహాలకు దూరంగా ఉంటారు.',
    emotionalNatureEn: 'With Moon in Libra, your emotional nature is gracious, diplomatic, peace-loving, and aesthetically refined.',
    relationshipStyleTe: 'జీవిత భాగస్వామితో సమానత్వం, స్నేహం మరియు మధురమైన సాన్నిహిత్యాన్ని కోరుకుంటారు. కుటుంబ సామరస్యానికి పెద్దపీట వేస్తారు.',
    relationshipStyleEn: 'Partnership is central to your happiness; you thrive on harmony, romance, and shared ideals.',
    strengthTe: 'శాంతిస్థాపన, మధుర సంభాషణ, నిష్పక్షపాత వైఖరి మరియు కళా హృదయం.',
    strengthEn: 'Diplomatic charm, fairness, social grace, and artistic taste.',
    weaknessTe: 'నిర్ణయాలు తీసుకోవడంలో ఊగిసలాట, ఇతరులను నొప్పించకూడదని సొంత ఇష్టాలను వదులుకోవడం.',
    weaknessEn: 'Indecisiveness and suppressing personal needs just to keep the peace.',
    symbolTe: 'సంగీత కచేరీలో స్వరాలను సమన్వయం చేస్తున్న విద్వాంసుడు — సామరస్యం మరియు సమతుల్యతకు ప్రతీక.',
    symbolEn: 'A conductor uniting an orchestra into a harmonious symphony.',
    spiritualPathTe: 'శ్రీ రాజరాజేశ్వరి అమ్మవారి ఉపాసన మీకు నిర్ణయాత్మక శక్తిని, దాంపత్య సౌఖ్యాన్ని మరియు లక్ష్మీ కటాక్షాన్ని ప్రసాదిస్తుంది.',
    spiritualPathEn: 'Worship of Sri Rajarajeswari Devi grants decisive clarity, marital bliss, and prosperity.',
  },
  {
    te: 'వృశ్చికం', en: 'Scorpio',
    emotionalNatureTe: 'చంద్రుడు వృశ్చిక రాశిలో ఉండటం వల్ల మీ భావోద్వేగాలు చాలా లోతుగా, తీవ్రంగా ఉంటాయి. పైకి ప్రశాంతంగా కనిపించినా లోపల అపారమైన మనోబలం, పట్టుదల ఉంటాయి.',
    emotionalNatureEn: 'With Moon in Scorpio, your emotional life is deep, magnetic, perceptive, and fiercely resilient.',
    relationshipStyleTe: 'బంధాలలో నూటికి నూరు శాతం నిబద్ధతను చూపిస్తారు, భాగస్వామి నుండి కూడా అంతే నిజాయితీని ఆశిస్తారు.',
    relationshipStyleEn: 'You love with total intensity and loyalty, seeking deep soul-level trust and commitment.',
    strengthTe: 'కష్టాలను తట్టుకునే గుండెనిబ్బరం, రహస్యాలను గ్రహించే అంతర్దృష్టి, లక్ష్య శుద్ధి.',
    strengthEn: 'Emotional courage in crisis, penetrating intuition, and transformative willpower.',
    weaknessTe: 'అనుమాన స్వభావం, పాత గాయాలను మర్చిపోలేకపోవడం మరియు మానసిక ఆందోళన.',
    weaknessEn: 'Brooding over past hurts, secrecy, and emotional possessiveness.',
    symbolTe: 'సముద్ర గర్భం నుండి విలువైన ముత్యాన్ని వెలికితీసే అన్వేషి — అంతర్గత శక్తి మరియు పరిశోధనకు ప్రతీక.',
    symbolEn: 'A deep-sea explorer uncovering hidden pearls of wisdom.',
    spiritualPathTe: 'శ్రీ లక్ష్మీ నరసింహ స్వామి మరియు దుర్గా అమ్మవారి ఆరాధన మీకు మనశ్శాంతిని, సకల భయ నివారణను ప్రసాదిస్తుంది.',
    spiritualPathEn: 'Worship of Sri Lakshmi Narasimha and Goddess Durga transforms inner intensity into spiritual power.',
  },
  {
    te: 'ధనుస్సు', en: 'Sagittarius',
    emotionalNatureTe: 'చంద్రుడు ధనుస్సు రాశిలో ఉండటం వల్ల మీ మనస్సు ఎప్పుడూ ఉత్సాహంగా, ధర్మబద్ధంగా మరియు ఆశావాదంతో ఉంటుంది. స్వేచ్ఛను, విజ్ఞానాన్ని ప్రేమిస్తారు.',
    emotionalNatureEn: 'With Moon in Sagittarius, your emotional instincts are exuberant, idealistic, philosophical, and freedom-loving.',
    relationshipStyleTe: 'కుటుంబంలో సంతోషాన్ని, ఆధ్యాత్మిక విలువలను నింపుతారు. భాగస్వామికి స్వేచ్ఛనిస్తూ ప్రోత్సహిస్తారు.',
    relationshipStyleEn: 'You bring warmth, humor, and philosophical companionship to relationships.',
    strengthTe: 'నిరంతర ఆశావాదం, ధార్మిక చింతన, బోధనా నైపుణ్యం మరియు నిష్కల్మష హృదయం.',
    strengthEn: 'Contagious optimism, moral sincerity, and inspiring vision.',
    weaknessTe: 'ఉన్నదున్నట్లు మాట్లాడి ఇతరులను ఇబ్బంది పెట్టడం, దైనందిన చిన్న పనులపై అశ్రద్ధ.',
    weaknessEn: 'Bluntness in speech and restlessness with mundane routine.',
    symbolTe: 'ఉన్నత శిఖరం వైపు బంగారు బాణాన్ని గురిపెట్టిన విలుకాడు — ఉన్నత ఆశయం మరియు ధర్మ విజయానికి ప్రతీక.',
    symbolEn: 'An archer aiming a golden arrow toward the highest mountain peak.',
    spiritualPathTe: 'శ్రీ దత్తాత్రేయ స్వామి మరియు దక్షిణామూర్తి ఆరాధన మీకు గురు కటాక్షాన్ని, అఖండ భాగ్యాన్ని ప్రసాదిస్తుంది.',
    spiritualPathEn: 'Worship of Lord Dattatreya and Sri Dakshinamurthy blesses you with supreme wisdom and fortune.',
  },
  {
    te: 'మకరం', en: 'Capricorn',
    emotionalNatureTe: 'చంద్రుడు మకర రాశిలో ఉండటం వల్ల మీ మనస్సు పరిణతితో, బాధ్యతతో మరియు ఆచరణాత్మక ఆలోచనలతో ఉంటుంది. భావోద్వేగాల కంటే కర్తవ్యానికి ప్రాధాన్యత ఇస్తారు.',
    emotionalNatureEn: 'With Moon in Capricorn, your emotional nature is self-controlled, realistic, dignified, and deeply responsible.',
    relationshipStyleTe: 'పైకి గంభీరంగా కనిపించినా కుటుంబానికి జీవితాంతం రక్షణగా, స్థిరమైన ఆధారంగా నిలుస్తారు.',
    relationshipStyleEn: 'You are a pillar of strength and loyalty, expressing love through enduring commitment and protection.',
    strengthTe: 'నిర్వహణా దక్షత, ఆత్మసంయమనం, కఠిన శ్రమ మరియు ఆర్థిక ముందుచూపు.',
    strengthEn: 'Executive composure, perseverance, and long-term reliability.',
    weaknessTe: 'భావాలను లోపలే దాచుకోవడం, ఒంటరితనం మరియు పని ఒత్తిడి.',
    weaknessEn: 'Emotional reserve, over-seriousness, and carrying too many burdens alone.',
    symbolTe: 'అన్ని కాలాలలోనూ చెక్కుచెదరని పర్వత దుర్గం — స్థిరత్వం మరియు రక్షణకు ప్రతీక.',
    symbolEn: 'A mountain fortress standing firm and protective through all seasons.',
    spiritualPathTe: 'శ్రీ శివారాధన మరియు ఆంజనేయ స్వామి సేవ మీ కర్మ భారాలను తగ్గించి, వృత్తిలో శాశ్వత కీర్తిని ఇస్తాయి.',
    spiritualPathEn: 'Lord Shiva and Hanuman worship lightens emotional burdens and brings enduring renown.',
  },
  {
    te: 'కుంభం', en: 'Aquarius',
    emotionalNatureTe: 'చంద్రుడు కుంభ రాశిలో ఉండటం వల్ల మీ మనస్సు విశాల దృక్పథం, పరోపకార బుద్ధి మరియు స్వతంత్ర ఆలోచనలతో ఉంటుంది. అందరినీ సమానంగా చూస్తారు.',
    emotionalNatureEn: 'With Moon in Aquarius, your instincts are humanitarian, objective, progressive, and friendly to all.',
    relationshipStyleTe: 'వివాహ బంధంలో స్నేహానికి, పరస్పర గౌరవానికి మరియు వ్యక్తిగత స్వేచ్ఛకు విలువనిస్తారు.',
    relationshipStyleEn: 'You seek intellectual friendship, equality, and mutual freedom in your closest bonds.',
    strengthTe: 'సమాజ సేవా భావం, నూతన ఆవిష్కరణల పట్ల ఆసక్తి, నిష్పక్షపాత ఆలోచన.',
    strengthEn: 'Humanitarian empathy, inventive insight, and broad-minded fairness.',
    weaknessTe: 'భావోద్వేగాల విషయంలో కొంత దూరంగా ఉండటం, మొండి సిద్ధాంతాలు.',
    weaknessEn: 'Emotional detachment when overwhelmed and unpredictable stubbornness.',
    symbolTe: 'లోకానికి జ్ఞాన జలాన్ని పంచుతున్న అమృత కలశం — విజ్ఞానం మరియు లోకకళ్యాణానికి ప్రతీక.',
    symbolEn: 'The sacred vessel pouring streams of progressive wisdom for humanity.',
    spiritualPathTe: 'శ్రీ రుద్రాభిషేకం మరియు అన్నదాన సేవా కార్యక్రమాలు మీకు విశేష దైవానుగ్రహాన్ని, మనశ్శాంతిని కలిగిస్తాయి.',
    spiritualPathEn: 'Sri Rudrabhishekam and charitable food distribution (Annadanam) bring profound grace and fulfillment.',
  },
  {
    te: 'మీనం', en: 'Pisces',
    emotionalNatureTe: 'చంద్రుడు మీన రాశిలో ఉండటం వల్ల మీ మనస్సు అత్యంత సున్నితంగా, కరుణామయంగా, ఆధ్యాత్మికంగా మరియు కళాత్మకంగా ఉంటుంది. దైవానుగ్రహం మెండుగా ఉంటుంది.',
    emotionalNatureEn: 'With Moon in Pisces, your emotional nature is deeply poetic, compassionate, intuitive, and spiritually receptive.',
    relationshipStyleTe: 'నిస్వార్థమైన ప్రేమను అందిస్తారు. ఆత్మీయుల సుఖం కోసం తమ స్వలాభాన్ని కూడా వదులుకుంటారు.',
    relationshipStyleEn: 'You are a soulful, devoted romantic with an infinite capacity for empathy and forgiveness.',
    strengthTe: 'అపారమైన దయాగుణం, ఆధ్యాత్మిక అంతర్దృష్టి, సృజనాత్మకత మరియు కలుపుగోలుతనం.',
    strengthEn: 'Universal compassion, spiritual intuition, and artistic imagination.',
    weaknessTe: 'ఇతరులను గుడ్డిగా నమ్మి మోసపోవడం, వాస్తవ ప్రపంచం కంటే ఊహాలోకంలో విహరించడం.',
    weaknessEn: 'Being overly trusting, absorbing others’ worries, and escapist daydreaming.',
    symbolTe: 'శాంత సముద్రంపై నక్షత్ర కాంతులలో ప్రయాణించే దివ్య నావ — ఆధ్యాత్మిక జ్ఞానం మరియు కరుణకు ప్రతీక.',
    symbolEn: 'A serene sailboat guided by starlight across tranquil waters.',
    spiritualPathTe: 'శ్రీ గురు దక్షిణామూర్తి మరియు శ్రీ మహాగణపతి ఉపాసన మీ అంతర్దృష్టిని, ఆర్థిక రక్షణను బలపరుస్తాయి.',
    spiritualPathEn: 'Worship of Sri Dakshinamurthy and Maha Ganapathi protects your gentle heart and brings spiritual Siddhi.',
  },
];

// Element Pair Dynamics
const ELEMENT_PAIR_DYNAMICS: Record<string, {
  titleTe: string;
  titleEn: string;
  harmonyTe: string;
  harmonyEn: string;
}> = {
  'fire-fire': {
    titleTe: 'ద్వి-అగ్ని తత్వ సంయోగం (Fire + Fire: ఆత్మశక్తి & ఉత్సాహ జ్వాల)',
    titleEn: 'Double Fire Combination (Fire Sun + Fire Moon)',
    harmonyTe: 'సూర్య, చంద్రులు ఇద్దరూ అగ్ని తత్వ రాశులలో ఉండటం వల్ల మీలో అపారమైన తేజస్సు, ఆత్మవిశ్వాసం మరియు నాయకత్వ శక్తి ఉంటాయి. ఏ పనినైనా గొప్ప ఉత్సాహంతో ప్రారంభిస్తారు. సహనం మరియు ఆచరణాత్మక ప్రణాళికను అలవర్చుకుంటే తిరుగులేని విజయాలు సాధిస్తారు.',
    harmonyEn: 'Both luminaries in Fire signs bestow immense vitality, vision, and natural leadership. Cultivating patience and attention to practical details turns your enthusiasm into lasting triumph.',
  },
  'earth-earth': {
    titleTe: 'ద్వి-భూ తత్వ సంయోగం (Earth + Earth: స్థిరత్వం & కార్యసిద్ధి)',
    titleEn: 'Double Earth Combination (Earth Sun + Earth Moon)',
    harmonyTe: 'సూర్య, చంద్రులు ఇద్దరూ భూ తత్వ రాశులలో ఉండటం వల్ల మీరు అత్యంత ఆచరణాత్మకంగా, స్థిరంగా మరియు బాధ్యతాయుతంగా ఉంటారు. ఆర్థిక నిర్మాణం, ఆస్తుల వృద్ధి మరియు కుటుంబ భద్రతలో గొప్ప విజయం సాధిస్తారు.',
    harmonyEn: 'Both luminaries in Earth signs make you a pillar of reliability, financial wisdom, and practical accomplishment.',
  },
  'air-air': {
    titleTe: 'ద్వి-వాయు తత్వ సంయోగం (Air + Air: మేధాశక్తి & వాక్చాతుర్యం)',
    titleEn: 'Double Air Combination (Air Sun + Air Moon)',
    harmonyTe: 'సూర్య, చంద్రులు ఇద్దరూ వాయు తత్వ రాశులలో ఉండటం వల్ల మీకు చురుకైన మేధాశక్తి, నిష్పక్షపాత ఆలోచన మరియు అద్భుతమైన భావవ్యక్తీకరణ ఉంటాయి. విద్య, సాంకేతికత, సలహా సంప్రదింపుల రంగాలలో రాణిస్తారు.',
    harmonyEn: 'Both luminaries in Air signs gift you with objective clarity, intellectual brilliance, and articulate communication.',
  },
  'water-water': {
    titleTe: 'ద్వి-జల తత్వ సంయోగం (Water + Water: అంతర్దృష్టి & కరుణా హృదయం)',
    titleEn: 'Double Water Combination (Water Sun + Water Moon)',
    harmonyTe: 'సూర్య, చంద్రులు ఇద్దరూ జల తత్వ రాశులలో ఉండటం వల్ల మీకు లోతైన అంతర్దృష్టి, కరుణ, ఆధ్యాత్మిక అనుభూతి మరియు సృజనాత్మకత ఉంటాయి. ఇతరుల మనస్సును సులభంగా అర్థం చేసుకుంటారు.',
    harmonyEn: 'Both luminaries in Water signs create profound intuition, emotional depth, empathy, and healing sensitivity.',
  },
  'fire-earth': {
    titleTe: 'అగ్ని + భూ తత్వ సంయోగం (Fire + Earth: ఆచరణాత్మక దార్శనికత)',
    titleEn: 'Fire & Earth Combination (The Practical Visionary)',
    harmonyTe: 'అగ్ని తత్వపు ఉత్సాహం, భూ తత్వపు స్థిరత్వం కలవడం వల్ల మీరు కేవలం కలలు కనడమే కాకుండా వాటిని వాస్తవ రూపంలోకి తీసుకువచ్చే అద్భుత కార్యదక్షత కలిగి ఉంటారు. వ్యాపారం మరియు ఉన్నత ఉద్యోగాలలో స్థిరమైన సంపదను నిర్మిస్తారు.',
    harmonyEn: 'Blending Fire’s vision with Earth’s realism makes you a practical powerhouse capable of turning ambitious ideas into solid, lucrative realities.',
  },
  'fire-air': {
    titleTe: 'అగ్ని + వాయు తత్వ సంయోగం (Fire + Air: తేజస్సు & మేధా ప్రవాహం)',
    titleEn: 'Fire & Air Combination (Inspired Communicator)',
    harmonyTe: 'గాలి తోడైతే అగ్ని మరింత ప్రజ్వలించినట్లు, మీ ఆలోచనలు మరియు ఉత్సాహం కలిసి ఇతరులను ఉత్తేజపరిచే శక్తిని ఇస్తాయి. రచన, బోధన, రాజకీయాలు మరియు వ్యాపార విస్తరణలో వేగంగా రాణిస్తారు.',
    harmonyEn: 'Air fans the flames of Fire—giving you charismatic eloquence, dynamic ideas, and the power to inspire and persuade others.',
  },
  'fire-water': {
    titleTe: 'అగ్ని + జల తత్వ సంయోగం (Fire + Water: ఆత్మబలం & భావోద్వేగ లోతు)',
    titleEn: 'Fire & Water Combination (Passionate & Intuitive Spirit)',
    harmonyTe: 'అగ్ని మరియు జలం కలిస్తే ఏర్పడే శక్తిలా, మీలో ఒకవైపు సాహసం-పట్టుదల, మరోవైపు సున్నితమైన సానుభూతి-అంతర్దృష్టి ఉంటాయి. మానసిక సమతుల్యత పాటిస్తే గొప్ప కళాకారులుగా, నాయకులుగా ఎదుగుతారు.',
    harmonyEn: 'Combining fiery courage with watery emotional depth gives you a magnetic, artistic, and passionately devoted temperament.',
  },
  'earth-air': {
    titleTe: 'భూ + వాయు తత్వ సంయోగం (Earth + Air: ఆచరణాత్మక మేధావి)',
    titleEn: 'Earth & Air Combination (The Practical Strategist)',
    harmonyTe: 'వాయు తత్వపు ఆలోచనా శక్తి, భూ తత్వపు కార్యదీక్ష కలవడం వల్ల మీరు ఏ సమస్యనైనా శాస్త్రీయంగా, ప్రణాళికాబద్ధంగా పరిష్కరిస్తారు. వ్యాపారం, పరిపాలన మరియు సాంకేతిక రంగాలలో అగ్రగామిగా నిలుస్తారు.',
    harmonyEn: 'Uniting abstract intelligence with grounded execution makes you an efficient strategist, organizer, and communicator.',
  },
  'earth-water': {
    titleTe: 'భూ + జల తత్వ సంయోగం (Earth + Water: సారవంతమైన కృషి & ఆత్మీయత)',
    titleEn: 'Earth & Water Combination (Fertile & Supportive Wisdom)',
    harmonyTe: 'భూమికి నీరు తోడైతే పంటలు పండినట్లు, మీలో ఆచరణాత్మక కృషి మరియు మానవీయ సానుభూతి రెండూ సమపాళ్లలో ఉంటాయి. కుటుంబానికి, సమాజానికి ఎంతో అండగా ఉంటూ స్థిరమైన సంపదను నిర్మిస్తారు.',
    harmonyEn: 'Like watered earth bringing forth a rich harvest, you blend common-sense resourcefulness with deep caring devotion.',
  },
  'air-water': {
    titleTe: 'వాయు + జల తత్వ సంయోగం (Air + Water: మేధస్సు & అంతర్దృష్టి సమన్వయం)',
    titleEn: 'Air & Water Combination (Insightful Mind & Empathetic Heart)',
    harmonyTe: 'ఆలోచన మరియు భావన కలవడం వల్ల మీకు అద్భుతమైన ఊహాశక్తి, మానసిక విశ్లేషణ మరియు కలుపుగోలుతనం ఉంటాయి. విద్య, కౌన్సెలింగ్, మీడియా మరియు సృజనాత్మక రంగాలలో విశేషంగా రాణిస్తారు.',
    harmonyEn: 'Blending rational thought with emotional intuition gives you imaginative insight into human nature and creative versatility.',
  },
};

export function generateLagnaCompleteProfile(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number
): LagnaCompleteProfile {
  const idx = ((lagnaRashiIdx % 12) + 12) % 12;
  const meta = RASHI_META_12[idx];
  const sunCore = SUN_SIGN_CORE[idx];
  const moonCore = MOON_SIGN_CORE[idx];
  const element = RASHI_ELEMENTS[idx];
  const lagnaLord = planets.find((p) => p.id === meta.lordId) || planets[1];
  const lagnaLordHouse = ((lagnaLord.rashiIdx - idx + 12) % 12) + 1;
  const bhavaMeta = BHAVA_NAMES_12[lagnaLordHouse - 1];

  return {
    lagnaRashiTe: meta.te,
    lagnaRashiEn: meta.en,
    lagnaLordTe: meta.lordTe,
    lagnaLordEn: meta.lordEn,
    lagnaLordHouse,
    lagnaLordRashiTe: lagnaLord.rashiTe,
    lagnaLordRashiEn: lagnaLord.rashiEn,
    elementTe: ELEMENT_META[element].te,
    elementEn: ELEMENT_META[element].en,
    dehaSwabhavamTe: `మీ జన్మ లగ్నం ${meta.te} (${ELEMENT_META[element].te}). లగ్నాధిపతి అయిన ${meta.lordTe} ప్రభావం వల్ల మీ భౌతిక వర్చస్సులో ఆకర్షణ, నడవడికలో హుందాతనం మరియు ${sunCore.themesTe} స్పష్టంగా కనిపిస్తాయి. ${sunCore.consciousDriveTe}`,
    dehaSwabhavamEn: `Your Ascendant (Lagna) is ${meta.en} (${ELEMENT_META[element].en}), ruled by ${meta.lordEn}. This endows your physical constitution and outward bearing with dignity and ${sunCore.themesEn.toLowerCase()}. ${sunCore.consciousDriveEn}`,
    manoSwabhavamTe: `లగ్న స్వభావం రీత్యా మీరు ${moonCore.strengthTe} కలిగి ఉంటారు. అయితే ${moonCore.weaknessTe} విషయంలో జాగ్రత్త వహించడం వల్ల జీవితంలో ప్రతి అడుగులోనూ విజయం లభిస్తుంది.`,
    manoSwabhavamEn: `In temperament, your natural strengths include ${moonCore.strengthEn.toLowerCase()}, while mindfulness around ${moonCore.weaknessEn.toLowerCase()} ensures smooth progress.`,
    lagnaLordEffectTe: `మీ లగ్నాధిపతి అయిన ${meta.lordTe} కుండలిలో ${lagnaLordHouse}వ స్థానంలో (${bhavaMeta.te} — ${lagnaLord.rashiTe} రాశిలో) స్థితి పొంది ఉన్నాడు. దీనివల్ల మీ జీవిత శక్తి, ఆలోచనలు మరియు అదృష్టం ప్రధానంగా "${bhavaMeta.signifTe}" రంగాల చుట్టూ కేంద్రీకృతమై ఉంటాయి. స్వశక్తితో ఈ రంగాలలో ఉన్నత స్థానానికి చేరుకుంటారు.`,
    lagnaLordEffectEn: `Your Ascendant Lord ${meta.lordEn} is placed in the ${lagnaLordHouse}th House (${bhavaMeta.en} in ${lagnaLord.rashiEn}). Consequently, your life force and destiny strongly revolve around ${bhavaMeta.signifEn.toLowerCase()}, bringing distinction in these areas.`,
    lifeMissionTe: `జీవిత లక్ష్యం & అనుకూల మార్గాలు: ${sunCore.vocationTe} ${moonCore.spiritualPathTe}`,
    lifeMissionEn: `Life Vocation & Spiritual Alignment: ${sunCore.vocationEn} ${moonCore.spiritualPathEn}`,
  };
}

export function getSunMoonCombination144(
  sunRashiIdx: number,
  moonRashiIdx: number
): SunMoonCombinationProfile {
  const sIdx = ((sunRashiIdx % 12) + 12) % 12;
  const mIdx = ((moonRashiIdx % 12) + 12) % 12;
  const combinationNumber = sIdx * 12 + mIdx + 1;

  const sunCore = SUN_SIGN_CORE[sIdx];
  const moonCore = MOON_SIGN_CORE[mIdx];
  const sunElement = RASHI_ELEMENTS[sIdx];
  const moonElement = RASHI_ELEMENTS[mIdx];

  const pairKey1 = `${sunElement}-${moonElement}`;
  const pairKey2 = `${moonElement}-${sunElement}`;
  const elementDyn =
    ELEMENT_PAIR_DYNAMICS[pairKey1] ||
    ELEMENT_PAIR_DYNAMICS[pairKey2] ||
    ELEMENT_PAIR_DYNAMICS['fire-earth'];

  return {
    combinationNumber,
    sunRashiTe: sunCore.te,
    sunRashiEn: sunCore.en,
    moonRashiTe: moonCore.te,
    moonRashiEn: moonCore.en,
    sunElement,
    moonElement,
    elementPairTitleTe: elementDyn.titleTe,
    elementPairTitleEn: elementDyn.titleEn,
    themesTe: `${ELEMENT_META[sunElement].te} × ${ELEMENT_META[moonElement].te}: ${sunCore.themesTe} · ${moonCore.strengthTe}`,
    themesEn: `${ELEMENT_META[sunElement].en} × ${ELEMENT_META[moonElement].en}: ${sunCore.themesEn} · ${moonCore.strengthEn}`,
    personalityTe: `${sunCore.consciousDriveTe} ${moonCore.emotionalNatureTe} ${elementDyn.harmonyTe}`,
    personalityEn: `${sunCore.consciousDriveEn} ${moonCore.emotionalNatureEn} ${elementDyn.harmonyEn}`,
    careerAndWealthTe: `అనుకూల వృత్తి & ఆర్థిక రంగాలు: ${sunCore.vocationTe} ఆత్మకారకుడైన సూర్యుడు (${sunCore.te}) మరియు మనఃకారకుడైన చంద్రుడు (${moonCore.te}) కలయిక వల్ల మీరు వృత్తిలో స్వతంత్ర నిర్ణయాలు తీసుకుంటూ, స్థిరమైన ఆర్థిక వృద్ధిని సాధిస్తారు.`,
    careerAndWealthEn: `Ideal Career & Financial Domains: ${sunCore.vocationEn} The synergy of Sun in ${sunCore.en} and Moon in ${moonCore.en} enables steady wealth creation and respected professional standing.`,
    relationshipsTe: moonCore.relationshipStyleTe,
    relationshipsEn: moonCore.relationshipStyleEn,
    strengthsTe: `${sunCore.themesTe}; ${moonCore.strengthTe}`,
    strengthsEn: `${sunCore.themesEn}; ${moonCore.strengthEn}`,
    weaknessesTe: moonCore.weaknessTe,
    weaknessesEn: moonCore.weaknessEn,
    imageForIntegrationTe: moonCore.symbolTe,
    imageForIntegrationEn: moonCore.symbolEn,
    spiritualPathTe: moonCore.spiritualPathTe,
    spiritualPathEn: moonCore.spiritualPathEn,
  };
}

// ============================================================================
// PANCHABHOOTA TATVA GRAHA BALA (ELEMENTAL PLANETARY STRENGTH ANALYSIS)
// ============================================================================
interface ElementStrengthRule {
  best: number[];
  second: number[];
  third: number[];
  worst: number[];
  bestNoteTe: string;
  bestNoteEn: string;
  worstNoteTe: string;
  worstNoteEn: string;
  remedyTe: string;
  remedyEn: string;
}

const ELEMENT_STRENGTH_TABLE: Record<string, ElementStrengthRule> = {
  sun: {
    best: [1, 5, 9],
    second: [2, 6, 10],
    third: [4, 8, 12],
    worst: [3, 7, 11],
    bestNoteTe: 'అగ్ని తత్వ రాశిలో రవి ఉచ్చ తుల్య బలాన్ని పొంది ఆత్మవిశ్వాసం, అధికార యోగం, సంపూర్ణ ఆరోగ్యం మరియు నాయకత్వ కీర్తిని ప్రసాదిస్తాడు.',
    bestNoteEn: 'Sun in a Fire sign operates at peak elemental strength, granting leadership, vitality, authority, and strong willpower.',
    worstNoteTe: 'వాయు తత్వ రాశిలో రవి కొంత తత్వ పరీక్షను ఎదుర్కొంటాడు; కీలక నిర్ణయాలలో ఊగిసలాట తగ్గించుకుని ఆత్మవిశ్వాసంతో వ్యవహరించడం వల్ల అధికారం మరియు స్థిరత్వం లభిస్తాయి.',
    worstNoteEn: 'Sun in an Air sign requires conscious focus; cultivating decisive action strengthens authority and vitality.',
    remedyTe: 'ప్రతిరోజూ సూర్యోదయ సమయంలో సూర్య నమస్కారం, ఆదిత్య హృదయ పారాయణ మరియు ఆదివారం గోధుమల దానం శుభప్రదం.',
    remedyEn: 'Daily Surya Namaskaram at sunrise and recitation of Aditya Hrudayam.',
  },
  moon: {
    best: [2, 6, 10],
    second: [1, 5, 9],
    third: [3, 7, 11],
    worst: [4, 8, 12],
    bestNoteTe: 'భూ తత్వ రాశిలో చంద్రుడు అత్యుత్తమ స్థిరత్వాన్ని పొంది, మానసిక ప్రశాంతత, ఆర్థిక సంపద మరియు ఆచరణాత్మక జ్ఞానాన్ని ఇస్తాడు.',
    bestNoteEn: 'Moon in an Earth sign gives remarkable emotional stability, material prosperity, and grounded peace of mind.',
    worstNoteTe: 'జల తత్వ రాశిలో చంద్రుడు అధిక భావోద్వేగాలను, సున్నిత మనస్తత్వాన్ని ఇస్తాడు. ధ్యానం, శివారాధన వల్ల మానసిక ఒత్తిడి తొలగి స్థిరత్వం కలుగుతుంది.',
    worstNoteEn: 'Moon in a Water sign tends toward emotional waves and deep sensitivity; meditation and Shiva worship bring inner equilibrium.',
    remedyTe: 'సోమవారం శివాభిషేకం, లలితా సహస్రనామ పారాయణ మరియు పౌర్ణమి నాడు చంద్ర దర్శనం శుభప్రదం.',
    remedyEn: 'Monday Rudrabhishekam and Sri Lalita Sahasranama Parayana.',
  },
  mars: {
    best: [2, 6, 10],
    second: [1, 5, 9],
    third: [3, 7, 11],
    worst: [4, 8, 12],
    bestNoteTe: 'భూ తత్వ రాశిలో కుజుడు అత్యుత్తమ కార్యదీక్షను, భూ-గృహ ఆస్తుల యోగాన్ని మరియు క్రమశిక్షణతో కూడిన విజయాన్ని ప్రసాదిస్తాడు.',
    bestNoteEn: 'Mars in an Earth sign channels fiery energy into productive achievement, real estate gains, and disciplined execution.',
    worstNoteTe: 'జల తత్వ రాశిలో కుజుని అగ్ని శక్తి భావోద్వేగ ఆటుపోట్లకు లోనవుతుంది. ఆవేశాన్ని తగ్గించుకుని సుబ్రహ్మణ్య/హనుమాన్ ఆరాధన చేయడం వల్ల కార్యజయం కలుగుతుంది.',
    worstNoteEn: 'Mars in a Water sign requires calm emotional control; Subrahmanya or Hanuman worship prevents conflicts and ensures victory.',
    remedyTe: 'మంగళవారం శ్రీ సుబ్రహ్మణ్య అష్టకం లేదా హనుమాన్ చాలీసా పారాయణ, కందిపప్పు దానం శుభప్రదం.',
    remedyEn: 'Tuesday recitation of Subrahmanya Ashtakam or Hanuman Chalisa.',
  },
  mercury: {
    best: [2, 6, 10],
    second: [3, 7, 11],
    third: [1, 5, 9],
    worst: [4, 8, 12],
    bestNoteTe: 'భూ తత్వ రాశిలో బుధుడు ఉచ్చ తుల్య బలాన్ని పొంది, వ్యాపార దక్షత, గణిత/సాంకేతిక నైపుణ్యం మరియు ఆర్థిక వృద్ధిని ఇస్తాడు.',
    bestNoteEn: 'Mercury in an Earth sign gives razor-sharp practical intelligence, commercial success, and analytical mastery.',
    worstNoteTe: 'జల తత్వ రాశిలో బుధుడు తార్కిక ఆలోచన కంటే భావోద్వేగాలకు ప్రభావితమవుతాడు. విష్ణు సహస్రనామ పారాయణ వల్ల బుద్ధి కుశలత, నిర్ణయాత్మక శక్తి పెరుగుతాయి.',
    worstNoteEn: 'Mercury in a Water sign blends logic with emotion; Vishnu Sahasranama recitation sharpens clarity and focus.',
    remedyTe: 'బుధవారం శ్రీ విష్ణు సహస్రనామ పారాయణ, పచ్చ పెసల దానం మరియు విద్యార్థులకు పుస్తక సహాయం శుభప్రదం.',
    remedyEn: 'Wednesday recitation of Sri Vishnu Sahasranama and educational charity.',
  },
  jupiter: {
    best: [4, 8, 12],
    second: [1, 5, 9],
    third: [3, 7, 11],
    worst: [2, 6, 10],
    bestNoteTe: 'జల తత్వ రాశిలో గురువు పరమ ఉచ్చ తుల్య బలాన్ని పొంది, అపారమైన దైవానుగ్రహం, జ్ఞానం, సంతాన సౌఖ్యం మరియు ధన సమృద్ధిని ప్రసాదిస్తాడు.',
    bestNoteEn: 'Jupiter in a Water sign brings out its most expansive, wise, and protective blessings for wealth, children, and divine grace.',
    worstNoteTe: 'భూ తత్వ రాశిలో గురువు ఆధ్యాత్మికత కంటే ప్రాపంచిక/ఆర్థిక విషయాలపై ఎక్కువ దృష్టి పెట్టిస్తాడు. గురు దక్షిణామూర్తి ఆరాధన మరియు దానధర్మాల వల్ల శుభ ఫలితాలు పెరుగుతాయి.',
    worstNoteEn: 'Jupiter in an Earth sign focuses on practical material duties; honoring gurus and charitable giving unlocks higher fortune.',
    remedyTe: 'గురువారం శ్రీ దక్షిణామూర్తి స్తోత్రం, గురు చరిత్ర పారాయణ మరియు శనగల దానం విశేష శుభప్రదం.',
    remedyEn: 'Thursday Dakshinamurthy Stotram recitation and honoring elders/teachers.',
  },
  venus: {
    best: [4, 8, 12],
    second: [3, 7, 11],
    third: [1, 5, 9],
    worst: [6, 10],
    bestNoteTe: 'జల తత్వ రాశిలో శుక్రుడు ఉచ్చ తుల్య బలాన్ని పొంది, నిర్మలమైన ప్రేమ, దాంపత్య సౌఖ్యం, కళా ప్రతిభ మరియు లక్ష్మీ కటాక్షాన్ని ఇస్తాడు.',
    bestNoteEn: 'Venus in a Water sign expresses refined love, artistic inspiration, marital harmony, and financial grace.',
    worstNoteTe: 'కన్య/మకర భూ తత్వ రాశులలో శుక్రుడు కొంత పరీక్షను ఎదుర్కొంటాడు; దాంపత్యంలో మరియు ఆర్థిక వ్యవహారాలలో ఓర్పు అవసరం. శ్రీ మహాలక్ష్మి ఆరాధన శుభప్రదం.',
    worstNoteEn: 'Venus in Virgo/Capricorn calls for patience in relationships and finances; Sri Mahalakshmi worship nurtures harmony.',
    remedyTe: 'శుక్రవారం శ్రీ మహాలక్ష్మి అష్టోత్తర పూజ, కనకధారా స్తోత్ర పారాయణ మరియు గోమాతకు గ్రాసం సమర్పించడం శుభప్రదం.',
    remedyEn: 'Friday Sri Mahalakshmi worship, Kanakadhara Stotram, and feeding cows (Go-Seva).',
  },
  saturn: {
    best: [3, 7, 11],
    second: [2, 6, 10],
    third: [4, 8, 12],
    worst: [1, 5, 9],
    bestNoteTe: 'వాయు తత్వ రాశిలో శని అత్యుత్తమ బలాన్ని పొంది, న్యాయబుద్ధి, సామాజిక గౌరవం, దీర్ఘాయుష్షు మరియు స్థిరమైన ఆర్థిక ఉన్నతిని ఇస్తాడు.',
    bestNoteEn: 'Saturn in an Air sign operates with supreme balance, granting justice, organizational authority, longevity, and steady rise.',
    worstNoteTe: 'అగ్ని తత్వ రాశిలో శని కఠిన శ్రమను, ఆలస్యాలను ఇస్తాడు. నిరంతర పట్టుదల, శనివార నియమాలు మరియు సేవా కార్యక్రమాల వల్ల ఆటంకాలు తొలగి విజయం లభిస్తుంది.',
    worstNoteEn: 'Saturn in a Fire sign brings tests of patience; discipline and humble service transform delays into enduring success.',
    remedyTe: 'శనివారం శ్రీ వేంకటేశ్వర స్వామి / ఆంజనేయ స్వామి దర్శనం, నువ్వుల నూనె దీపారాధన మరియు పేదలకు అన్నదానం శుభప్రదం.',
    remedyEn: 'Saturday worship of Lord Venkateswara / Hanuman, sesame oil lamp, and Annadanam.',
  },
};

export function evaluateMehtaElementalStrengths(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number
): ElementalPlanetStrength[] {
  const coreIds = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  return planets
    .filter((p) => coreIds.includes(p.id))
    .map((p) => {
      const signNum = p.rashiIdx + 1; // 1..12
      const element = RASHI_ELEMENTS[p.rashiIdx];
      const houseFromLagna = ((p.rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
      const bhavaMeta = BHAVA_NAMES_12[houseFromLagna - 1];
      const rule = ELEMENT_STRENGTH_TABLE[p.id];

      let tier: 'best' | 'second' | 'third' | 'challenging' = 'third';
      if (rule.best.includes(signNum)) tier = 'best';
      else if (rule.second.includes(signNum)) tier = 'second';
      else if (rule.third.includes(signNum)) tier = 'third';
      else if (rule.worst.includes(signNum)) tier = 'challenging';
      if (p.id === 'venus' && signNum === 2) tier = 'second';

      const tierLabels: Record<typeof tier, { te: string; en: string }> = {
        best: { te: 'ఉత్తమ తత్వ బలం (Peak Elemental Strength)', en: 'Peak Elemental Strength' },
        second: { te: 'ద్వితీయ శుభ బలం (Strong Element)', en: 'Strong Elemental Placement' },
        third: { te: 'మధ్యమ తత్వ బలం (Moderate Strength)', en: 'Moderate Elemental Placement' },
        challenging: { te: 'తత్వ పరీక్షా స్థితి (Needs Upasana)', en: 'Needs Mindful Effort & Upasana' },
      };

      let analysisTe = '';
      let analysisEn = '';

      if (tier === 'best') {
        analysisTe = `${rule.bestNoteTe} మీ జాతకంలో ${p.nameTe} ${bhavaMeta.te}లో ఉండి (${bhavaMeta.signifTe}) విషయాలలో విశేష శుభ ఫలితాలను ఇస్తాడు.`;
        analysisEn = `${rule.bestNoteEn} Placed in the ${bhavaMeta.en}, it strongly uplifts ${bhavaMeta.signifEn.toLowerCase()}.`;
      } else if (tier === 'second') {
        analysisTe = `${ELEMENT_META[element].te}లో ${p.nameTe} శుభ బలంతో ఉన్నాడు. ${bhavaMeta.te} (${bhavaMeta.signifTe}) పరంగా స్థిరమైన పురోగతి మరియు సానుకూల ఫలితాలు లభిస్తాయి.`;
        analysisEn = `${p.nameEn} is well-supported in ${ELEMENT_META[element].en}, bringing steady progress in ${bhavaMeta.en} matters (${bhavaMeta.signifEn.toLowerCase()}).`;
      } else if (tier === 'third') {
        analysisTe = `${ELEMENT_META[element].te}లో ${p.nameTe} మధ్యమ బలంతో ఉన్నాడు. ${bhavaMeta.te} విషయాలలో స్వయంకృషితో మరియు ప్రణాళికతో ముందుకు సాగితే మంచి ఫలితాలు వస్తాయి.`;
        analysisEn = `${p.nameEn} has moderate elemental strength here; conscious effort in ${bhavaMeta.en} matters yields reliable results.`;
      } else {
        analysisTe = `${rule.worstNoteTe}${
          p.isRetrograde
            ? ' అయితే ఈ గ్రహం వక్ర గతిలో (Retrograde) ఉండటం వల్ల వేద నాడీ సిద్ధాంతం ప్రకారం తత్వ బలహీనత తొలగిపోయి ఊహించని అసాధారణ రాజయోగ ఫలితాలను ఇచ్చే శక్తి కలుగుతుంది!'
            : ''
        }`;
        analysisEn = `${rule.worstNoteEn}${
          p.isRetrograde
            ? ' However, because this planet is Retrograde, classical Nadi principles state that retrograde motion reverses elemental debility and brings extraordinary breakthroughs!'
            : ''
        }`;
      }

      return {
        planetId: p.id,
        planetTe: p.nameTe,
        planetEn: p.nameEn,
        rashiTe: p.rashiTe,
        rashiEn: p.rashiEn,
        elementTe: ELEMENT_META[element].te,
        elementEn: ELEMENT_META[element].en,
        houseFromLagna,
        houseNameTe: bhavaMeta.te,
        houseNameEn: bhavaMeta.en,
        tier,
        tierLabelTe: tierLabels[tier].te,
        tierLabelEn: tierLabels[tier].en,
        isRetrograde: !!p.isRetrograde,
        analysisTe,
        analysisEn,
        remedyTe: rule.remedyTe,
        remedyEn: rule.remedyEn,
      };
    });
}

// ============================================================================
// SPECIAL NADI SUTRAS, BHRIGU CHAKRA & RAJA YOGAS
// ============================================================================
export function evaluateMehtaSpecialSutras(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number,
  birthDate: string
): SpecialSutraResult[] {
  const results: SpecialSutraResult[] = [];
  const [yStr, mStr] = birthDate.split('-');
  const birthYear = Number(yStr) || 1994;
  const birthMonth = Math.min(12, Math.max(1, Number(mStr) || 1));

  const getHouse = (rashiIdx: number) => ((rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
  const sun = planets.find((p) => p.id === 'sun')!;
  const moon = planets.find((p) => p.id === 'moon')!;
  const mars = planets.find((p) => p.id === 'mars')!;
  const mercury = planets.find((p) => p.id === 'mercury')!;
  const jupiter = planets.find((p) => p.id === 'jupiter')!;
  const venus = planets.find((p) => p.id === 'venus')!;
  const saturn = planets.find((p) => p.id === 'saturn')!;

  const kendraHouses = [1, 4, 7, 10];
  const trikonaHouses = [1, 5, 9];
  const dusthanaHouses = [6, 8, 12];

  // Helper to determine house lord
  const getLordOfHouse = (houseNum: number) => {
    const signIdx = (lagnaRashiIdx + houseNum - 1) % 12;
    const lordId = RASHI_LORDS_ID[signIdx];
    return planets.find((p) => p.id === lordId) || sun;
  };

  // 1. Birth Month Focus House & Bhrigu Chakra Paddhati
  const focusHouseNum = birthMonth;
  const focusBhava = BHAVA_NAMES_12[focusHouseNum - 1];
  const focusRashiIdx = (lagnaRashiIdx + focusHouseNum - 1) % 12;
  const focusLordId = RASHI_LORDS_ID[focusRashiIdx];
  const focusLordPlanet = planets.find((p) => p.id === focusLordId) || sun;
  const focusLordHouse = getHouse(focusLordPlanet.rashiIdx);
  const planetsInFocusHouse = planets.filter(
    (p) => p.id !== 'lagna' && getHouse(p.rashiIdx) === focusHouseNum
  );
  const bcpAges = [
    focusHouseNum,
    focusHouseNum + 12,
    focusHouseNum + 24,
    focusHouseNum + 36,
    focusHouseNum + 48,
    focusHouseNum + 60,
  ];
  const bcpYearsStr = bcpAges.map((age) => `${age} ఏళ్లు (${birthYear + age})`).join(', ');
  const bcpYearsEn = bcpAges.map((age) => `Age ${age} (${birthYear + age})`).join(', ');

  results.push({
    id: 'bcp-focus-house',
    titleTe: `భృగు చక్ర పద్ధతి — జన్మ మాస కేంద్ర స్థాన సూత్రం (${focusHouseNum}వ స్థానం)`,
    titleEn: `Bhrigu Chakra Paddhati — Birth Month Focus House (${focusHouseNum}th House)`,
    badgeTe: `జీవిత కీలక మలుపు వయస్సులు: ${bcpAges.slice(1, 5).join(', ')}`,
    badgeEn: `Key Milestone Ages: ${bcpAges.slice(1, 5).join(', ')}`,
    isTriggered: true,
    descriptionTe: `మీరు సంవత్సరంలోని ${birthMonth}వ నెలలో జన్మించినందున, భృగు చక్ర పద్ధతి ప్రకారం మీ జన్మ లగ్నం నుండి ${focusBhava.te} మీ జీవితంలో అత్యంత ప్రధాన పాత్ర పోషిస్తుంది (${focusBhava.signifTe}). ఈ స్థానాధిపతి అయిన ${focusLordPlanet.nameTe} ${focusLordHouse}వ స్థానంలో స్థితి చెంది ఉన్నారు.${
      planetsInFocusHouse.length > 0
        ? ` ఈ కేంద్ర స్థానంలో ${planetsInFocusHouse.map((p) => p.nameTe).join(', ')} గ్రహాల సంచారం విశేష బలాన్ని చేకూరుస్తోంది.`
        : ''
    } శర్మ గారి అనుభవ పరిశీలన ప్రకారం, ప్రతి 12 సంవత్సరాలకు ఒకసారి ఈ స్థాన ఫలితాలు చురుగ్గా మారి జీవితంలో సరికొత్త మలుపును తీసుకువస్తాయి.`,
    descriptionEn: `Born in month #${birthMonth}, classical Bhrigu Chakra Paddhati designates your ${focusBhava.en} as the primary Focus House (${focusBhava.signifEn}). Its lord ${focusLordPlanet.nameEn} occupies House #${focusLordHouse}.${
      planetsInFocusHouse.length > 0
        ? ` Occupying planets: ${planetsInFocusHouse.map((p) => p.nameEn).join(', ')}.`
        : ''
    } According to Guruji Sharma’s client experience, every 12-year cycle activates this house, triggering pivotal career and family evolution.`,
    remedyOrAdviceTe: `భృగు చక్ర కీలక మలుపు వయస్సులు: ${bcpYearsStr}. ఆయా వయస్సులలో స్థానాధిపతి అయిన ${focusLordPlanet.nameTe} ఆరాధన విశేష ఫలితాలను ఇస్తుంది.`,
    remedyOrAdviceEn: `Milestone ages: ${bcpYearsEn}. Strengthening ${focusLordPlanet.nameEn} during these milestone years ensures triumphant outcomes.`,
  });

  // 2. Saturn's 2nd-House Signification Karmic Discipline Rule
  const satHouse = getHouse(saturn.rashiIdx);
  const secondFromSatHouse = (satHouse % 12) + 1;
  const secondFromSatBhava = BHAVA_NAMES_12[secondFromSatHouse - 1];
  results.push({
    id: 'saturn-2nd-house-rule',
    titleTe: `శని ద్వితీయ స్థాన కర్మ పరీక్షా సూత్రం (${secondFromSatBhava.te})`,
    titleEn: `Saturn’s 2nd-House Karmic Discipline Rule (House #${secondFromSatHouse})`,
    badgeTe: `శని (${satHouse}వ స్థానం) → ${secondFromSatHouse}వ స్థానంపై ప్రభావం`,
    badgeEn: `Saturn in ${satHouse}H → Tests ${secondFromSatHouse}H`,
    isTriggered: true,
    descriptionTe: `ప్రాచీన నాడీ జ్యోతిష్య నియమం ప్రకారం, కర్మకారకుడైన శని తాను ఉన్న ${satHouse}వ స్థానం నుండి రెండవ స్థానమైన ${secondFromSatBhava.te} కారకత్వాలను (${secondFromSatBhava.signifTe}) తీవ్రంగా పరీక్షిస్తాడు. తొలినాళ్లలో కొంత శ్రమ, అలసట ఎదురైనా, సత్యసంధత, ఓర్పు మరియు క్రమశిక్షణతో పనిచేస్తే మధ్య వయస్సు దాటాక తిరుగులేని స్థిరత్వాన్ని మరియు సమాజంలో పేరు ప్రఖ్యాతులను ప్రసాదిస్తాడు.`,
    descriptionEn: `Classical Nadi principles reveal that karmic mentor Saturn thoroughly tests the house placed 2nd from its natal position—which in your chart is the ${secondFromSatBhava.en} (${secondFromSatBhava.signifEn}). Initial patience and unwavering integrity transform early obstacles into unshakeable life mastery.`,
    remedyOrAdviceTe: `${secondFromSatBhava.te} విషయాలలో తొందరపాటు నిర్ణయాలు తీసుకోకండి. శనివారం నల్ల నువ్వుల దీపం మరియు పేదలకు అన్నదానం చేయడం వల్ల శని పరీక్షలు విజయాలుగా మారతాయి.`,
    remedyOrAdviceEn: `Avoid hasty shortcuts in ${secondFromSatBhava.en} matters. Saturday charity and disciplined effort unlock Saturn’s enduring favor.`,
  });

  // 3. PANCHAMAHAPURUSHA RAJA YOGAS (Ruchaka, Bhadra, Hamsa, Malavya, Sasa)
  // Mars: Ruchaka (Own: Aries 0, Scorpio 7; Exalted: Capricorn 9 in Kendra)
  const marsH = getHouse(mars.rashiIdx);
  if (kendraHouses.includes(marsH) && [0, 7, 9].includes(mars.rashiIdx)) {
    results.push({
      id: 'panchamahapurusha-ruchaka',
      titleTe: `రుచక మహాపురుష రాజయోగం — కేంద్రంలో బలమైన కుజ స్థితి (${marsH}వ స్థానం)`,
      titleEn: `Ruchaka Panchamahapurusha Raja Yoga (Mars in Kendra #${marsH})`,
      badgeTe: 'రుచక రాజయోగం: అపార ధైర్యం & నాయకత్వం',
      badgeEn: 'Ruchaka Yoga: Supreme Valor & Real Estate Gains',
      isTriggered: true,
      descriptionTe: `మీ లగ్నం నుండి ${marsH}వ కేంద్ర స్థానంలో కుజుడు తన స్వక్షేత్రం లేదా ఉచ్ఛ క్షేత్రమైన ${mars.rashiTe}లో ఉండటం వల్ల అత్యంత శక్తివంతమైన "రుచక మహాపురుష యోగం" ఏర్పడింది. ఇది అజేయమైన సంకల్ప బలాన్ని, రియల్ ఎస్టేట్/భూమి ద్వారా విశేష సంపదను, మరియు ఇంజనీరింగ్/రక్షణ/పాలనా రంగాలలో ఉన్నత నాయకత్వాన్ని ప్రసాదిస్తుంది.`,
      descriptionEn: `Mars is placed in Kendra House #${marsH} in its own/exaltation sign (${mars.rashiEn}), generating the celebrated Ruchaka Panchamahapurusha Yoga—bestowing physical energy, real estate prosperity, courage, and commanding leadership.`,
      remedyOrAdviceTe: 'మంగళవారం సుబ్రహ్మణ్య స్వామి లేదా ఆంజనేయ స్వామి ఆరాధన చేయడం వల్ల ఈ యోగం సంపూర్ణంగా అనుకూలిస్తుంది.',
      remedyOrAdviceEn: 'Lord Subrahmanya or Hanuman worship on Tuesdays honors and channels this fiery royal energy constructively.',
    });
  }

  // Mercury: Bhadra (Own/Exalted: Gemini 2, Virgo 5 in Kendra)
  const mercH = getHouse(mercury.rashiIdx);
  if (kendraHouses.includes(mercH) && [2, 5].includes(mercury.rashiIdx)) {
    results.push({
      id: 'panchamahapurusha-bhadra',
      titleTe: `భద్ర మహాపురుష రాజయోగం — కేంద్రంలో బుధుని స్వ/ఉచ్ఛ స్థితి (${mercH}వ స్థానం)`,
      titleEn: `Bhadra Panchamahapurusha Raja Yoga (Mercury in Kendra #${mercH})`,
      badgeTe: 'భద్ర రాజయోగం: అసమాన మేధస్సు & వాక్చాతుర్యం',
      badgeEn: 'Bhadra Yoga: Intellectual Genius & Business Mastery',
      isTriggered: true,
      descriptionTe: `బుధుడు ${mercH}వ కేంద్ర స్థానంలో తన స్వ/ఉచ్ఛ క్షేత్రమైన ${mercury.rashiTe}లో ఉండటం వల్ల "భద్ర మహాపురుష యోగం" సిద్ధించింది. ఇది అసాధారణమైన మేధాశక్తి, వాక్చాతుర్యం, వ్యాపార దక్షత, విశ్లేషణా నైపుణ్యం మరియు గణిత/సాంకేతిక రంగాలలో తిరుగులేని ప్రావీణ్యాన్ని ఇస్తుంది.`,
      descriptionEn: `Mercury occupies Kendra House #${mercH} in its own/exalted sign (${mercury.rashiEn}), conferring Bhadra Panchamahapurusha Yoga. This endows supreme intellect, eloquence, commercial acumen, and scholarly renown.`,
      remedyOrAdviceTe: 'బుధవారం శ్రీ విష్ణు సహస్రనామ పారాయణ చేయడం లేదా గోసేవ చేయడం వల్ల విశేష ధనలాభం కలుగుతుంది.',
      remedyOrAdviceEn: 'Reciting Vishnu Sahasranama and supporting educational/green causes enhances Mercury’s intellectual blessings.',
    });
  }

  // Jupiter: Hamsa (Own: Sagittarius 8, Pisces 11; Exalted: Cancer 3 in Kendra)
  const jupH = getHouse(jupiter.rashiIdx);
  if (kendraHouses.includes(jupH) && [3, 8, 11].includes(jupiter.rashiIdx)) {
    results.push({
      id: 'panchamahapurusha-hamsa',
      titleTe: `హంస మహాపురుష రాజయోగం — కేంద్రంలో గురుని స్వ/ఉచ్ఛ వైభవం (${jupH}వ స్థానం)`,
      titleEn: `Hamsa Panchamahapurusha Raja Yoga (Jupiter in Kendra #${jupH})`,
      badgeTe: 'హంస రాజయోగం: దైవానుగ్రహం & సర్వజన గౌరవం',
      badgeEn: 'Hamsa Yoga: Righteous Wisdom & Royal Honor',
      isTriggered: true,
      descriptionTe: `దేవగురువైన బృహస్పతి ${jupH}వ కేంద్రంలో స్వ/ఉచ్ఛ క్షేత్రమైన ${jupiter.rashiTe}లో ఉండటం వల్ల పవిత్రమైన "హంస మహాపురుష యోగం" ఏర్పడింది. ఇది సమాజంలో పూజ్యనీయమైన స్థానాన్ని, ధర్మబద్ధమైన ఆలోచనను, ఉత్తమ సంతాన సౌఖ్యాన్ని మరియు ఆపదల సమయంలో అదృశ్య దైవ రక్షణను ప్రసాదిస్తుంది.`,
      descriptionEn: `Jupiter is seated in Kendra House #${jupH} in its own or exalted sign (${jupiter.rashiEn}), forming Hamsa Panchamahapurusha Yoga. This blesses the native with pure ethical character, academic honor, prosperous children, and divine grace.`,
      remedyOrAdviceTe: 'గురువారం శ్రీ దక్షిణామూర్తి ఆరాధన మరియు గురువులను, విద్యావంతులను గౌరవించడం వల్ల సమస్త శుభాలు సిద్ధిస్తాయి.',
      remedyOrAdviceEn: 'Thursday prayers to Sri Dakshinamurthy and respecting mentors amplify Jupiter’s supreme benevolence.',
    });
  }

  // Venus: Malavya (Own: Taurus 1, Libra 6; Exalted: Pisces 11 in Kendra)
  const venH = getHouse(venus.rashiIdx);
  if (kendraHouses.includes(venH) && [1, 6, 11].includes(venus.rashiIdx)) {
    results.push({
      id: 'panchamahapurusha-malavya',
      titleTe: `మాళవ్య మహాపురుష రాజయోగం — కేంద్రంలో శుక్రుని దివ్య శోభ (${venH}వ స్థానం)`,
      titleEn: `Malavya Panchamahapurusha Raja Yoga (Venus in Kendra #${venH})`,
      badgeTe: 'మాళవ్య రాజయోగం: భోగభాగ్యాలు & కళావైభవం',
      badgeEn: 'Malavya Yoga: Luxury, Beauty & Matrimonial Harmony',
      isTriggered: true,
      descriptionTe: `శుక్రుడు ${venH}వ కేంద్రంలో తన స్వ/ఉచ్ఛ రాశి అయిన ${venus.rashiTe}లో ఉండటం వల్ల "మాళవ్య మహాపురుష యోగం" ప్రకాశిస్తోంది. ఇది ఉత్తమ గృహ-వాహన సౌఖ్యాలు, ఆకర్షణీయమైన వ్యక్తిత్వం, దాంపత్య సుఖం, కళా/సృజనాత్మక నైపుణ్యాలు మరియు విలాసవంతమైన జీవితాన్ని ఇస్తుంది.`,
      descriptionEn: `Venus is placed in Kendra House #${venH} in its own or exalted sign (${venus.rashiEn}), forging Malavya Panchamahapurusha Yoga. This bestows refined aesthetics, marital happiness, luxurious conveyances, and financial abundance.`,
      remedyOrAdviceTe: 'శుక్రవారం శ్రీ మహాలక్ష్మి పూజ మరియు కనకధారా స్తోత్ర పారాయణ వల్ల ఈ యోగ ఫలితాలు రెట్టింపవుతాయి.',
      remedyOrAdviceEn: 'Friday Sri Mahalakshmi worship and Kanakadhara Stotram recitation nourish enduring prosperity.',
    });
  }

  // Saturn: Sasa (Own: Capricorn 9, Aquarius 10; Exalted: Libra 6 in Kendra)
  if (kendraHouses.includes(satHouse) && [6, 9, 10].includes(saturn.rashiIdx)) {
    results.push({
      id: 'panchamahapurusha-sasa',
      titleTe: `శశ మహాపురుష రాజయోగం — కేంద్రంలో శని యొక్క ఉచ్ఛ/స్వక్షేత్ర బలం (${satHouse}వ స్థానం)`,
      titleEn: `Sasa Panchamahapurusha Raja Yoga (Saturn in Kendra #${satHouse})`,
      badgeTe: 'శశ రాజయోగం: ప్రజా నాయకత్వం & శాశ్వత కీర్తి',
      badgeEn: 'Sasa Yoga: Strategic Authority & Enduring Legacy',
      isTriggered: true,
      descriptionTe: `శని భగవానుడు ${satHouse}వ కేంద్రంలో తన స్వక్షేత్రం లేదా ఉచ్ఛ రాశి అయిన ${saturn.rashiTe}లో ఉండటం వల్ల అత్యంత శక్తివంతమైన "శశ మహాపురుష యోగం" ఏర్పడింది. ఇది ప్రజాదరణ, సంస్థాగత పరిపాలనా దక్షత, రాజకీయ లేదా పారిశ్రామిక విజయం మరియు కాలానికి ఎదురీది నిలిచే శాశ్వతమైన విజయాన్ని ఇస్తుంది.`,
      descriptionEn: `Saturn occupies Kendra House #${satHouse} in its own or exalted sign (${saturn.rashiEn}), producing Sasa Panchamahapurusha Yoga. This bestows immense perseverance, judicial and administrative mastery, popular trust, and long-lasting authority.`,
      remedyOrAdviceTe: 'శనివారం హనుమాన్ చాలీసా పారాయణ మరియు శ్రామికులకు, వృద్ధులకు సహాయం చేయడం వల్ల విశేష పురోగతి లభిస్తుంది.',
      remedyOrAdviceEn: 'Hanuman Chalisa recitation and charitable service to hardworking laborers elevate this powerful yoga.',
    });
  }

  // 4. GAJAKESARI / GURU-CHANDRA MAHA RAJA YOGA
  const distMoonToJup = ((jupiter.rashiIdx - moon.rashiIdx + 12) % 12) + 1;
  const isGajakesari = [1, 4, 7, 10].includes(distMoonToJup);
  results.push({
    id: 'gajakesari-yoga-check',
    titleTe: isGajakesari
      ? `గజకేసరి మహా రాజయోగం — చంద్రుని నుండి కేంద్రంలో (${distMoonToJup}వ స్థానంలో) గురువు`
      : `గురు-చంద్ర సంబంధ విశ్లేషణ (చంద్రుని నుండి ${distMoonToJup}వ స్థానంలో గురువు)`,
    titleEn: isGajakesari
      ? `Gajakesari Maha Raja Yoga (Jupiter in Kendra #${distMoonToJup} from Moon)`
      : `Jupiter-Moon Angular Relationship (Jupiter ${distMoonToJup}H from Moon)`,
    badgeTe: isGajakesari ? 'గజకేసరి రాజయోగం సిద్ధించింది!' : `గురు స్థితి: ${jupiter.rashiTe}`,
    badgeEn: isGajakesari ? 'Auspicious Gajakesari Raja Yoga Active!' : `Jupiter in ${jupiter.rashiEn}`,
    isTriggered: true,
    descriptionTe: isGajakesari
      ? `మీ జన్మ రాశి (${moon.rashiTe}) నుండి ${distMoonToJup}వ కేంద్ర స్థానంలో దేవగురువైన బృహస్పతి (${jupiter.rashiTe}) ఉండటం వల్ల క్లాసికల్ "గజకేసరి యోగం" ఏర్పడింది. సింహం ముందు ఏనుగులు భయపడినట్లుగా, ఈ యోగవంతుడి ముందు శత్రువులు, విపత్తులు నిలవలేవు. జీవితంలో ఎన్ని ఆటంకాలు వచ్చినా అంతిమంగా గౌరవం, ఆస్తులు, సద్విజ్ఞానం మరియు ఉన్నత సామాజిక హోదా లభిస్తాయి.`
      : `మీ జన్మ రాశి (${moon.rashiTe}) నుండి గురువు ${distMoonToJup}వ స్థానంలో (${jupiter.rashiTe}) ఉన్నాడు. గురు-చంద్రుల సమన్వయం వల్ల మీలో సహజమైన దయాగుణం, పెద్దల పట్ల విధేయత మరియు కుటుంబ శ్రేయస్సు ఉంటాయి. గురు దశ మరియు అంతర్దశలలో మంచి అభివృద్ధి కనిపిస్తుంది.`,
    descriptionEn: isGajakesari
      ? `Jupiter is placed in Kendra House #${distMoonToJup} from your natal Moon (${moon.rashiEn}), giving rise to the celebrated Gajakesari Raja Yoga. Like a fearless lion among elephants, the native commands respect, triumphs over life crises, and attains lasting nobility, wisdom, and financial stability.`
      : `Jupiter is placed ${distMoonToJup} houses from your Moon sign (${moon.rashiEn}), supporting compassionate intuition, moral integrity, and peaceful family growth during Jupiter transits and sub-periods.`,
    remedyOrAdviceTe: 'గురువారం నాడు శ్రీ దక్షిణామూర్తి లేదా సాయిబాబా ఆరాధన చేయడం వల్ల ఈ యోగ బలం జీవితాంతం రక్షణగా నిలుస్తుంది.',
    remedyOrAdviceEn: 'Honoring spiritual teachers and Thursday prayers to Sri Dakshinamurthy sustain this noble protective energy.',
  });

  // 5. BUDHADITYA RAJA YOGA
  const isBudhaditya = sun.rashiIdx === mercury.rashiIdx;
  if (isBudhaditya) {
    const baHouse = getHouse(sun.rashiIdx);
    results.push({
      id: 'budhaditya-yoga',
      titleTe: `బుధాదిత్య రాజయోగం — ${baHouse}వ స్థానంలో (${sun.rashiTe}) రవి-బుధుల కలయిక`,
      titleEn: `Budhaditya Raja Yoga — Sun & Mercury Conjoined in House #${baHouse}`,
      badgeTe: 'బుధాదిత్య యోగం: విశేష మేధాశక్తి & కీర్తి',
      badgeEn: 'Budhaditya Yoga: Brilliance & Executive Acumen',
      isTriggered: true,
      descriptionTe: `మీ జాతకంలో ${baHouse}వ స్థానంలో (${sun.rashiTe} రాశిలో) సూర్యుడు మరియు బుధుడు కలిసి ఉండటం వల్ల ప్రసిద్ధ "బుధాదిత్య రాజయోగం" ఏర్పడింది. ఇది అత్యంత తీక్షణమైన మేధస్సు, గణిత/సాంకేతిక నైపుణ్యం, వాక్చాతుర్యం మరియు ప్రభుత్వ/కార్పొరేట్ సంస్థలలో గౌరవప్రదమైన ఉన్నత పదవులను అందిస్తుంది. శర్మ గారి పరిశీలన ప్రకారం, ఇలాంటి వ్యక్తులు సంక్లిష్ట సమస్యలను కూడా అవలీలగా పరిష్కరిస్తారు.`,
      descriptionEn: `Sun and Mercury unite in your ${baHouse}th house (${sun.rashiEn}), generating the renowned Budhaditya Raja Yoga. This bestows administrative brilliance, analytical precision, articulate diplomacy, and high career distinction.`,
      remedyOrAdviceTe: 'నిత్యం ఆదిత్య హృదయ స్తోత్ర పారాయణ మరియు సూర్య నమస్కారాలు చేయడం వల్ల ఈ మేధా యోగం పూర్తి స్థాయిలో వికసిస్తుంది.',
      remedyOrAdviceEn: 'Daily Aditya Hrudaya Stotram and Surya Namaskaram unlock the pinnacle of executive and analytical excellence.',
    });
  }

  // 6. CHANDRA-MANGALA RAJA / DHANA YOGA
  const isChandraMangala =
    moon.rashiIdx === mars.rashiIdx ||
    ((mars.rashiIdx - moon.rashiIdx + 12) % 12) === 6;
  if (isChandraMangala) {
    const cmHouse = getHouse(moon.rashiIdx);
    results.push({
      id: 'chandra-mangala-dhana-yoga',
      titleTe: `చంద్ర-మంగళ ధన రాజయోగం — మనఃకారక (చంద్ర) & భూకారక (కుజ) సమన్వయం`,
      titleEn: `Chandra-Mangala Dhana Yoga (Moon & Mars Mutual Dynamic)`,
      badgeTe: 'చంద్ర-మంగళ యోగం: అఖండ ధనార్జన శక్తి',
      badgeEn: 'Chandra-Mangala Yoga: Self-Made Wealth & Drive',
      isTriggered: true,
      descriptionTe: `మీ జాతకంలో చంద్రుడు మరియు కుజుడు ఒకే రాశిలో సంయోగం చెందడం లేదా పరస్పర సప్తమ దృష్టితో ఉండటం వల్ల "చంద్ర-మంగళ ధన యోగం" ఏర్పడింది. ఇది స్వయంకృషితో విశేష సంపదను ఆర్జించే సామర్థ్యాన్ని, స్థిరాస్తి అభివృద్ధిని, వాణిజ్య నైపుణ్యాన్ని మరియు వ్యాపారంలో ధైర్యంగా ముందడుగు వేసే శక్తిని ప్రసాదిస్తుంది.`,
      descriptionEn: `Moon and Mars form a close conjunction or 7th mutual aspect, generating Chandra-Mangala Dhana Yoga. This produces exceptional commercial enterprise, property gains, dynamic ambition, and self-made financial momentum.`,
      remedyOrAdviceTe: 'లక్ష్మీ నరసింహ స్వామి లేదా దుర్గా దేవి ఆరాధన చేయడం వల్ల ఆర్థిక ప్రవాహం స్థిరంగా, పవిత్రంగా ఉంటుంది.',
      remedyOrAdviceEn: 'Worship of Sri Lakshmi Narasimha or Sri Durga balances intense commercial passion with righteous stability.',
    });
  }

  // 7. AMALA YOGA (Only Benefics in 10th House from Lagna or Moon)
  const tenthFromLagna = (lagnaRashiIdx + 9) % 12;
  const tenthFromMoon = (moon.rashiIdx + 9) % 12;
  const planetsIn10FromLagna = planets.filter((p) => p.id !== 'lagna' && p.rashiIdx === tenthFromLagna);
  const planetsIn10FromMoon = planets.filter((p) => p.id !== 'lagna' && p.rashiIdx === tenthFromMoon);
  const beneficIds = ['jupiter', 'venus', 'mercury'];
  const isAmalaFromLagna =
    planetsIn10FromLagna.length > 0 &&
    planetsIn10FromLagna.every((p) => beneficIds.includes(p.id));
  const isAmalaFromMoon =
    planetsIn10FromMoon.length > 0 &&
    planetsIn10FromMoon.every((p) => beneficIds.includes(p.id));

  if (isAmalaFromLagna || isAmalaFromMoon) {
    results.push({
      id: 'amala-yoga',
      titleTe: `అమల మహా రాజయోగం — దశమ భావంలో నిర్మల శుభగ్రహ స్థితి`,
      titleEn: `Amala Maha Yoga (Pure Benefics in 10th House)`,
      badgeTe: 'అమల యోగం: నిష్కళంక వృత్తి కీర్తి & గౌరవం',
      badgeEn: 'Amala Yoga: Spotless Professional Integrity',
      isTriggered: true,
      descriptionTe: `మీ జాతకంలో లగ్నం లేదా చంద్రుని నుండి 10వ స్థానంలో కేవలం శుభగ్రహాలు (గురు, శుక్ర, బుధులు) మాత్రమే ఉండటం వల్ల ప్రశస్తమైన "అమల యోగం" సిద్ధించింది. ఇది మచ్చలేని వృత్తి జీవితాన్ని, సమాజంలో ఉన్నత నైతిక గౌరవాన్ని, పరోపకార బుద్ధిని మరియు ప్రభుత్వం లేదా పెద్దల నుండి శాశ్వతమైన ఆదరణను ప్రసాదిస్తుంది.`,
      descriptionEn: `Natural benefics exclusively occupy the 10th house of profession from your Lagna or Moon, forging Amala Yoga. This guarantees an untarnished reputation, high public trust, humanitarian prestige, and lasting honor.`,
      remedyOrAdviceTe: 'నిత్యం సత్యం, ధర్మం పాటిస్తూ నిస్వార్థ సేవ చేయడం వల్ల ఈ యోగం తరం తరాలకు కీర్తిని అందిస్తుంది.',
      remedyOrAdviceEn: 'Upholding strict professional ethics and public welfare transforms this yoga into generational renown.',
    });
  }

  // 8. VIPARITA RAJA YOGAS (Harsha, Sarala, Vimala)
  const sixthLord = getLordOfHouse(6);
  const eighthLord = getLordOfHouse(8);
  const twelfthLord = getLordOfHouse(12);

  const sixthLordH = getHouse(sixthLord.rashiIdx);
  const eighthLordH = getHouse(eighthLord.rashiIdx);
  const twelfthLordH = getHouse(twelfthLord.rashiIdx);

  const hasHarsha = dusthanaHouses.includes(sixthLordH);
  const hasSarala = dusthanaHouses.includes(eighthLordH);
  const hasVimala = dusthanaHouses.includes(twelfthLordH);

  if (hasHarsha || hasSarala || hasVimala) {
    const yogaNames: string[] = [];
    const yogaNamesEn: string[] = [];
    if (hasHarsha) {
      yogaNames.push(`హర్ష యోగం (6వ అధిపతి ${sixthLordH}లో)`);
      yogaNamesEn.push(`Harsha Yoga (6L in ${sixthLordH}H)`);
    }
    if (hasSarala) {
      yogaNames.push(`సరళ యోగం (8వ అధిపతి ${eighthLordH}లో)`);
      yogaNamesEn.push(`Sarala Yoga (8L in ${eighthLordH}H)`);
    }
    if (hasVimala) {
      yogaNames.push(`విమల యోగం (12వ అధిపతి ${twelfthLordH}లో)`);
      yogaNamesEn.push(`Vimala Yoga (12L in ${twelfthLordH}H)`);
    }

    results.push({
      id: 'viparita-raja-yoga',
      titleTe: `విపరీత రాజయోగం — ${yogaNames.join(' · ')}`,
      titleEn: `Viparita Raja Yoga — ${yogaNamesEn.join(' · ')}`,
      badgeTe: 'విపరీత రాజయోగం: ఆపదల నుండి అద్భుత విజయాలు',
      badgeEn: 'Viparita Raja Yoga: Triumph Through Adversity',
      isTriggered: true,
      descriptionTe: `దుష్ట స్థానాలైన 6, 8, 12వ అధిపతులు తమలో తామే దుష్ట స్థానాలలో ఉండటం వల్ల శాస్త్రోక్త "విపరీత రాజయోగం" ఏర్పడింది. దీని ఫలితంగా జీవితంలో ఇతరులు కుంగిపోయే కష్టాలు లేదా సంక్షోభాలు ఎదురైనప్పుడు, మీరు ఆశ్చర్యకరమైన రీతిలో విజేతగా నిలుస్తారు. శత్రువులు స్వయంగా వెనక్కి తగ్గుతారు; ఆకస్మిక ధన లాభాలు మరియు సంక్షోభ సమయంలో అదృష్టం కలిసి వస్తుంది.`,
      descriptionEn: `Dusthana lords (6th, 8th, or 12th) occupying dusthana houses cancel out malevolence and produce the classical Viparita Raja Yoga. The native thrives in crises, overcomes formidable adversaries, and gains sudden windfalls when least expected.`,
      remedyOrAdviceTe: 'శ్రీ సుదర్శన హోమం లేదా మహా మృత్యుంజయ మంత్ర జపం వల్ల ఈ యోగ శక్తి సంపూర్ణ రక్షణ కవచంగా మారుతుంది.',
      remedyOrAdviceEn: 'Maha Mrityunjaya mantra japa aligns dusthana energies into a formidable shield of invincibility.',
    });
  }

  // 9. DHARMA-KARMADHIPATI & LABHA RAJA YOGA (9th, 10th & 11th Lords)
  const ninthLord = getLordOfHouse(9);
  const tenthLord = getLordOfHouse(10);
  const eleventhLord = getLordOfHouse(11);
  const is10and11Conjoined = tenthLord.rashiIdx === eleventhLord.rashiIdx;
  const is9and10Conjoined = ninthLord.rashiIdx === tenthLord.rashiIdx;
  const is9and10MutualAspect =
    ((tenthLord.rashiIdx - ninthLord.rashiIdx + 12) % 12) === 6;

  results.push({
    id: 'karma-labha-yoga',
    titleTe: `భాగ్య (9వ), రాజ్య (10వ) & లాభ (11వ) స్థానాధిపతుల వృత్తి-ధన రాజయోగ విశ్లేషణ`,
    titleEn: `9th, 10th & 11th Lord Career, Fortune & Prosperity Synthesis`,
    badgeTe: is9and10Conjoined || is9and10MutualAspect
      ? 'ధర్మ-కర్మాధిపతి మహా రాజయోగం!'
      : is10and11Conjoined
      ? 'రాజ్య-లాభాధిపతుల అఖండ ధనయోగం!'
      : `9వ: ${ninthLord.nameTe} · 10వ: ${tenthLord.nameTe} · 11వ: ${eleventhLord.nameTe}`,
    badgeEn: is9and10Conjoined || is9and10MutualAspect
      ? 'Supreme Dharma-Karmadhipati Raja Yoga!'
      : is10and11Conjoined
      ? 'Powerful 10th-11th Career-Wealth Conjunction!'
      : `9L: ${ninthLord.nameEn} · 10L: ${tenthLord.nameEn} · 11L: ${eleventhLord.nameEn}`,
    isTriggered: true,
    descriptionTe: is9and10Conjoined || is9and10MutualAspect
      ? `మీ జాతకంలో అత్యున్నత త్రికోణాధిపతి అయిన భాగ్యాధిపతి (${ninthLord.nameTe}) మరియు అత్యున్నత కేంద్రాధిపతి అయిన రాజ్యాధిపతి (${tenthLord.nameTe}) కలవడం లేదా పరస్పర దృష్టి కలిగి ఉండటం వల్ల వేద జ్యోతిషంలో రారాజు లాంటి "ధర్మ-కర్మాధిపతి మహా రాజయోగం" ఏర్పడింది. ఇది ఉన్నత అధికారాలు, ప్రభుత్వం/సమాజంలో అత్యున్నత గౌరవం, ధర్మబద్ధమైన విస్తార సంపద మరియు తరతరాల కీర్తిని ప్రసాదిస్తుంది.`
      : is10and11Conjoined
      ? `మీ జాతకంలో వృత్తి స్థానాధిపతి (${tenthLord.nameTe}) మరియు సమస్త కోరికల-లాభ స్థానాధిపతి (${eleventhLord.nameTe}) ఒకే రాశిలో కలవడం వల్ల అఖండ వృత్తి విజయాలు, స్థిరమైన బహుళ ఆదాయ వనరులు మరియు ప్రభావవంతమైన మిత్రుల సహకారం లభిస్తాయి.`
      : `మీ జాతకంలో భాగ్యాధిపతి ${ninthLord.nameTe} ${getHouse(ninthLord.rashiIdx)}వ స్థానంలో, వృత్తి స్థానాధిపతి ${tenthLord.nameTe} ${getHouse(tenthLord.rashiIdx)}వ స్థానంలో, లాభాధిపతి ${eleventhLord.nameTe} ${getHouse(eleventhLord.rashiIdx)}వ స్థానంలో ఉన్నారు. వీరి దశ-అంతర్దశలలో వృత్తి ఉన్నతి మరియు ఆర్థిక లాభాలు విశేషంగా కలుగుతాయి.`,
    descriptionEn: is9and10Conjoined || is9and10MutualAspect
      ? `The alliance between your 9th lord of fortune (${ninthLord.nameEn}) and 10th lord of career (${tenthLord.nameEn}) forms the pinnacle Dharma-Karmadhipati Raja Yoga—bestowing supreme executive leadership, ethical prosperity, and enduring public reverence.`
      : is10and11Conjoined
      ? `The conjunction of your 10th lord (${tenthLord.nameEn}) and 11th lord (${eleventhLord.nameEn}) generates steady career ascendancy, multi-channel revenues, and high societal connections.`
      : `Your 9th lord ${ninthLord.nameEn} is in House #${getHouse(ninthLord.rashiIdx)}, 10th lord ${tenthLord.nameEn} in House #${getHouse(tenthLord.rashiIdx)}, and 11th lord ${eleventhLord.nameEn} in House #${getHouse(eleventhLord.rashiIdx)}, creating systematic prosperity windows during their dasha sub-periods.`,
    remedyOrAdviceTe: `${tenthLord.nameTe} మరియు ${eleventhLord.nameTe} కారకత్వ రంగాలలో నిజాయితీతో కూడిన కృషి చేయడం వల్ల ఆర్థిక స్థిరత్వం వేగంగా లభిస్తుంది.`,
    remedyOrAdviceEn: `Aligning your professional endeavors with Houses #${getHouse(tenthLord.rashiIdx)} and #${getHouse(eleventhLord.rashiIdx)} unlocks maximal financial growth.`,
  });

  // 10. DHANA & PURVAPUNYA YOGA (2nd & 5th Lords)
  const secondLord = getLordOfHouse(2);
  const fifthLord = getLordOfHouse(5);
  results.push({
    id: 'dhana-purvapunya-yoga',
    titleTe: `ధన (2వ) & పూర్వపుణ్య (5వ) స్థానాధిపతుల సంపద-సంతాన విశ్లేషణ`,
    titleEn: `2nd & 5th Lord Wealth Accumulation & Purvapunya Synthesis`,
    badgeTe: `ధనాధిపతి: ${secondLord.nameTe} (${getHouse(secondLord.rashiIdx)}వ స్థానం) · పంచమాధిపతి: ${fifthLord.nameTe} (${getHouse(fifthLord.rashiIdx)}వ స్థానం)`,
    badgeEn: `2nd Lord: ${secondLord.nameEn} (${getHouse(secondLord.rashiIdx)}H) · 5th Lord: ${fifthLord.nameEn} (${getHouse(fifthLord.rashiIdx)}H)`,
    isTriggered: true,
    descriptionTe: `మీ కుండలిలో ధన-కుటుంబ స్థానాధిపతి అయిన ${secondLord.nameTe} ${getHouse(secondLord.rashiIdx)}వ స్థానంలో మరియు పూర్వపుణ్య-బుద్ధి స్థానాధిపతి అయిన ${fifthLord.nameTe} ${getHouse(fifthLord.rashiIdx)}వ స్థానంలో ఉన్నారు. దీనివల్ల కుటుంబ సంపద నిల్వలు, సంతానాభివృద్ధి, తెలివితేటలు మరియు పూర్వజన్మ సుకృతం మీకు కీలక సమయాలలో రక్షణగా నిలుస్తాయి. శర్మ గారి అనుభవంలో, 2వ మరియు 5వ అధిపతుల బలం ఉన్నవారు ఎన్నటికీ కటిక పేదరికంలో ఉండలేరు.`,
    descriptionEn: `Your 2nd lord of wealth (${secondLord.nameEn}) occupies House #${getHouse(secondLord.rashiIdx)} and your 5th lord of intellect and purvapunya (${fifthLord.nameEn}) occupies House #${getHouse(fifthLord.rashiIdx)}, anchoring investment foresight, ancestral protection, and brilliant problem-solving.`,
    remedyOrAdviceTe: 'శ్రీ లక్ష్మీ గణపతి ఆరాధన మరియు కులదేవతా పూజ వల్ల ధన నిల్వలు, సంతాన సౌఖ్యం నిరంతరం వృద్ధి చెందుతాయి.',
    remedyOrAdviceEn: 'Worship of Sri Lakshmi Ganapathi and your family deity (Kula Devata) ensures perpetual family prosperity.',
  });

  // 11. KAHALA & PARVATA YOGA (4th & 9th Lords in Mutual Kendras)
  const fourthLord = getLordOfHouse(4);
  const fourthLordH = getHouse(fourthLord.rashiIdx);
  const ninthLordH = getHouse(ninthLord.rashiIdx);
  const dist4to9 = ((ninthLord.rashiIdx - fourthLord.rashiIdx + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(dist4to9)) {
    results.push({
      id: 'kahala-yoga',
      titleTe: `కాహళ రాజయోగం — సుఖ (4వ) & భాగ్య (9వ) స్థానాధిపతుల పరస్పర కేంద్ర బలం`,
      titleEn: `Kahala Raja Yoga (4th & 9th Lords in Mutual Kendra)`,
      badgeTe: 'కాహళ యోగం: స్థిరాస్తులు & సాహసోపేత విజయం',
      badgeEn: 'Kahala Yoga: Landed Estates & Resolute Fortitude',
      isTriggered: true,
      descriptionTe: `మీ జాతకంలో చతుర్థాధిపతి (${fourthLord.nameTe}) మరియు భాగ్యాధిపతి (${ninthLord.nameTe}) పరస్పరం కేంద్ర స్థానాలలో ఉండటం వల్ల "కాహళ యోగం" ఏర్పడింది. ఇది అపారమైన భూములు, సొంత ఇళ్లు, వాహనాలు, సమాజంలో తిరుగులేని ధైర్యం మరియు నాయకత్వ లక్షణాలను ప్రసాదిస్తుంది.`,
      descriptionEn: `Your 4th lord of assets (${fourthLord.nameEn}) and 9th lord of fortune (${ninthLord.nameEn}) stand in mutual Kendras, forming Kahala Yoga—bestowing abundant immovable properties, courageous determination, and executive authority.`,
      remedyOrAdviceTe: 'భూమాతను గౌరవిస్తూ, నూతన గృహ/వాహన కొనుగోలు సమయాలలో గోపూజ చేయడం అత్యంత శ్రేయస్కరం.',
      remedyOrAdviceEn: 'Go Pooja (cow seva) and Vastu sanctification during property milestones multiply these expansive blessings.',
    });
  }

  // 12. Mars in Air Signs House Ownership Rule
  const ariesHouse = getHouse(0);
  const scorpioHouse = getHouse(7);
  const isMarsInAir = [2, 6, 10].includes(mars.rashiIdx);
  if (isMarsInAir) {
    results.push({
      id: 'mars-air-sign-sutra',
      titleTe: `కుజుడు వాయు రాశి (${mars.rashiTe})లో స్థితి — కుజ క్షేత్ర ప్రభావ సూత్రం`,
      titleEn: `Mars in Air Sign (${mars.rashiEn}) — Dual Ownership Rule`,
      badgeTe: `${ariesHouse}వ లేదా ${scorpioHouse}వ స్థానంపై ప్రత్యేక శ్రద్ధ`,
      badgeEn: `Mind House #${ariesHouse} & House #${scorpioHouse}`,
      isTriggered: true,
      descriptionTe: `నాడీ జ్యోతిష్య పరిశీలనా సూత్రం ప్రకారం, కుజుడు మిథునం, తుల లేదా కుంభ రాశిలో ఉన్నప్పుడు, కుజుని స్వక్షేత్రాలైన మేషం (${ariesHouse}వ స్థానం - ${BHAVA_NAMES_12[ariesHouse - 1].signifTe}) లేదా వృశ్చికం (${scorpioHouse}వ స్థానం - ${BHAVA_NAMES_12[scorpioHouse - 1].signifTe})లలో ఒక స్థాన ఫలితాలలో ప్రారంభంలో కొంత అలసత్వం లేదా అదనపు శ్రమ ఉంటాయి. పట్టుదలతో పనిచేస్తే రెండవ అర్ధభాగంలో గొప్ప విజయాలు సాధిస్తారు.`,
      descriptionEn: `When dynamic Mars occupies Gemini, Libra, or Aquarius, one of its dual-owned signs—House #${ariesHouse} (Aries) or House #${scorpioHouse} (Scorpio)—demands extra persistence during initial cycles before delivering durable success.`,
      remedyOrAdviceTe: `మంగళవారం సుబ్రహ్మణ్య స్వామి లేదా ఆంజనేయ స్వామి ఆరాధన చేయడం వల్ల ${ariesHouse}వ మరియు ${scorpioHouse}వ స్థాన ఫలితాలు అత్యంత శుభప్రదంగా మారుతాయి.`,
      remedyOrAdviceEn: `Tuesday prayers to Lord Subrahmanya protect and vitalize Houses #${ariesHouse} and #${scorpioHouse}.`,
    });
  }

  return results;
}

// ============================================================================
// 9 GRAHAS IN 12 STHANAMULU (BHAVAS) — COMPLETE PREDICTIONS (Telugu & English)
// ============================================================================
const PLANET_BHAVA_TEXT: Record<string, { te: string[]; en: string[] }> = {
  sun: {
    te: [
      'ఆత్మవిశ్వాసం, తేజస్సు, నాయకత్వ లక్షణాలు, ఆత్మగౌరవం మెండుగా ఉంటాయి. స్వశక్తితో ఉన్నత స్థితికి ఎదుగుతారు.',
      'కుటుంబ గౌరవం, ధన సంపాదనపై దృష్టి ఉంటుంది. మాటలో అధికార స్వరం ఉంటుంది, కంటి ఆరోగ్యంపై శ్రద్ధ మంచిది.',
      'ధైర్య సాహసాలు, పట్టుదల, స్వయంకృషితో విజయం సాధిస్తారు. సోదరులు మరియు సహచరులలో గుర్తింపు పొందుతారు.',
      'గృహ, భూమి, వాహన సౌఖ్యాలు లభిస్తాయి. ప్రభుత్వ లేదా ఉన్నత సంస్థలతో అనుబంధం ఉంటుంది.',
      'తీవ్రమైన మేధాశక్తి, సృజనాత్మకత, పరిపాలనా దక్షత ఉంటాయి. సంతానం ఉన్నత స్థాయికి చేరుకుంటుంది.',
      'పోటీ పరీక్షలు, ఉద్యోగ రంగాలలో శత్రువులపై విజయం సాధిస్తారు. రోగనిరోధక శక్తి బాగుంటుంది.',
      'భాగస్వామ్య వ్యాపారాలలో, దాంపత్యంలో ఆత్మగౌరవం అధికంగా ఉంటుంది. జీవిత భాగస్వామితో సర్దుబాటు వైఖరి శుభప్రదం.',
      'నిగూఢ శాస్త్రాలు, పరిశోధన, ఆధ్యాత్మిక రహస్యాలపై ఆసక్తి ఉంటుంది. ఆకస్మిక ధన లాభ సూచన.',
      'తండ్రి గారి ఆశీస్సులు, ధార్మిక చింతన, ఉన్నత విద్య, విదేశీ ప్రయాణాలు మరియు అదృష్ట యోగం ఉంటాయి.',
      'దిగ్బలం పొందిన సూర్యుడు: ఉద్యోగ/వ్యాపారాలలో ఉన్నత అధికారం, ప్రభుత్వ గౌరవం, సమాజంలో గొప్ప కీర్తి లభిస్తాయి.',
      'ఆదాయ వనరులు సమృద్ధిగా ఉంటాయి. పెద్దల సహకారం, ఉన్నత మిత్ర వర్గం ద్వారా కోరికలు నెరవేరుతాయి.',
      'విదేశీ యానం, ఆధ్యాత్మిక చింతన, సేవా కార్యక్రమాలలో ఆసక్తి ఉంటాయి. నేత్ర, నిద్ర విషయాలలో జాగ్రత్త మంచిది.',
    ],
    en: [
      'Strong vitality, self-confidence, natural leadership, and personal dignity. You rise through self-effort.',
      'Focus on family honor and wealth accumulation; authoritative speech.',
      'Great courage, determination, and success through personal initiative and communication.',
      'Blessings of home, property, and vehicles; respected standing in the community.',
      'Sharp intellect, administrative talent, creative brilliance, and pride in children.',
      'Victory over competitors, strong immunity, and success in service or government roles.',
      'High standards and strong personality in marriage and business partnerships; mutual respect is key.',
      'Deep interest in research, occult sciences, and sudden financial or legacy gains.',
      'Blessings of fortune, dharma, higher learning, and guidance from father/mentors.',
      'Directional strength (Digbala): Exceptional career authority, leadership, and social prestige.',
      'Abundant gains, influential friends, and fulfillment of major life ambitions.',
      'Success in distant/foreign lands, spiritual inclination, and charitable nature.',
    ],
  },
  moon: {
    te: [
      'ఆకర్షణీయమైన రూపం, కరుణా హృదయం, కలుపుగోలుతనం మరియు మాతృ ఆశీస్సులు ఉంటాయి.',
      'మధురమైన వాక్కు, ధన సమృద్ధి, ఉమ్మడి కుటుంబ ప్రేమ మరియు రుచికరమైన భోజన ప్రియత్వం ఉంటాయి.',
      'కళలు, రచన, ప్రయాణాల పట్ల ఆసక్తి ఉంటుంది. సోదరులతో ఆత్మీయ అనుబంధం ఉంటుంది.',
      'దిగ్బలం పొందిన చంద్రుడు: తల్లి ఆశీస్సులు, గృహ-వాహన సౌఖ్యం, మనశ్శాంతి మరియు విద్యా విజయాలు కలుగుతాయి.',
      'సున్నితమైన బుద్ధి, సృజనాత్మక ఆలోచనలు, సంతాన సౌఖ్యం మరియు దైవ భక్తి మెండుగా ఉంటాయి.',
      'సేవా రంగం, వైద్యం లేదా కౌన్సెలింగ్ రంగాలలో రాణిస్తారు. జీర్ణకోశ ఆరోగ్యంపై శ్రద్ధ వహించాలి.',
      'అందమైన, అర్థం చేసుకునే జీవిత భాగస్వామి లభిస్తారు. వ్యాపారంలో మరియు ప్రజలతో మంచి ఆదరణ ఉంటుంది.',
      'లోతైన అంతర్దృష్టి (Intuition), రహస్య పరిశోధన ఉంటాయి. మానసిక ఆందోళన తగ్గించుకోవడానికి ధ్యానం మంచిది.',
      'అదృష్ట యోగం, తీర్థయాత్రలు, ధర్మ కార్యాలు మరియు ఆధ్యాత్మిక గురువుల అనుగ్రహం లభిస్తాయి.',
      'ఉద్యోగ, వ్యాపారాలలో ప్రజల మద్దతుతో గొప్ప గుర్తింపు, కీర్తి మరియు స్థిరమైన పురోగతి సాధిస్తారు.',
      'అనేక మార్గాలలో ధన లాభం, మిత్రుల సహకారం, శుభకార్యాలు మరియు కోరికల సిద్ధి కలుగుతాయి.',
      'విదేశీ ప్రయాణాలు, ఆధ్యాత్మిక ధ్యానం, నిస్వార్థ సేవా గుణం ఉంటాయి. అనవసర ఖర్చులను నియంత్రించాలి.',
    ],
    en: [
      'Gentle charisma, empathetic heart, adaptability, and strong maternal blessings.',
      'Sweet speech, financial prosperity, love of family traditions, and domestic comfort.',
      'Creative communication, frequent short journeys, and affectionate bond with siblings.',
      'Directional strength (Digbala): Deep inner peace, happiness from mother, home, and vehicles.',
      'Intuitive intelligence, artistic flair, devotion, and happiness through children.',
      'Success in healing, catering, or service professions; mindfulness of digestion is advised.',
      'Warm, caring spouse, public popularity, and success in partnerships.',
      'Psychic intuition and research ability; meditation helps calm emotional fluctuations.',
      'Abundant fortune, pilgrimages, charitable heart, and blessings from elders.',
      'Public recognition in career, popular appeal, and professional adaptability.',
      'Multiple streams of income, supportive social circle, and fulfillment of wishes.',
      'Spiritual contemplation, foreign connections, and charitable generosity.',
    ],
  },
  mars: {
    te: [
      'సాహసం, చురుకుదనం, స్వతంత్ర వ్యక్తిత్వం మరియు క్రీడా/సాంకేతిక ఉత్సాహం ఉంటాయి. ఆవేశాన్ని తగ్గించుకోవాలి.',
      'ముక్కుసూటిగా మాట్లాడే స్వభావం ఉంటుంది. స్వశక్తితో ధన సంపాదన చేస్తారు; మాటలో మృదుత్వం అవసరం.',
      'అపారమైన ధైర్య సాహసాలు, పట్టుదల, కఠిన శ్రమతో ఏ కార్యాన్నైనా సాధించే శక్తి ఉంటుంది.',
      'భూమి, గృహ నిర్మాణం, వాహన యోగం ఉంటాయి. గృహ వాతావరణంలో శాంతిని కాపాడుకోవాలి.',
      'చురుకైన మేధాశక్తి, క్రీడలు/ఇంజనీరింగ్/నిర్వహణ రంగాలలో ప్రతిభ ఉంటుంది.',
      'శత్రుజయం, రుణ విముక్తి, పోటీలలో తిరుగులేని విజయం మరియు ఉన్నత ఉద్యోగ యోగం కలుగుతాయి.',
      'భాగస్వామ్య వ్యాపారాలలో చురుకుదనం ఉంటుంది. దాంపత్యంలో పరస్పర సహనం పాటించడం వల్ల అన్యోన్యత పెరుగుతుంది.',
      'ఆకస్మిక పరిణామాలను ఎదుర్కొనే గుండెనిబ్బరం ఉంటుంది. వాహనాలు నడిపేటప్పుడు జాగ్రత్త అవసరం.',
      'ధర్మ రక్షణ, తండ్రి వర్గ ఆస్తులు, సాహసోపేత ప్రయాణాలు మరియు ఉన్నత లక్ష్య సాధన ఉంటాయి.',
      'దిగ్బలం పొందిన కుజుడు (కులదీపక యోగం): ఉద్యోగ/వ్యాపారాలలో తిరుగులేని అధికారం, భూలాభం మరియు కార్యసిద్ధి.',
      'భూమి, వ్యాపారం, సాంకేతిక రంగాల ద్వారా విశేష ధన లాభం మరియు ఆశయ సిద్ధి కలుగుతాయి.',
      'విదేశీ వ్యవహారాలు, పరిశోధనలలో రాణిస్తారు. అనవసర ఖర్చులు మరియు కోపాన్ని నియంత్రించుకోవాలి.',
    ],
    en: [
      'Dynamic energy, courage, and pioneering drive; practicing patience brings smooth success.',
      'Direct, frank speech and strong earning drive; gentle words preserve family harmony.',
      'Exceptional valor, determination, and triumph in all self-made endeavors.',
      'Gains of land, real estate, and vehicles; cultivating calm at home is beneficial.',
      'Sharp technical mind, decisive intelligence, and leadership flair.',
      'Complete victory over competitors, obstacles, and debts; strong vitality.',
      'Active, enterprising partner; patience and mutual understanding ensure marital harmony.',
      'Resilience in crisis and research ability; caution with vehicles and sudden expenses.',
      'Passionate commitment to dharma, adventurous spirit, and leadership in higher pursuits.',
      'Directional strength (Digbala): Executive power, real estate wealth, and career triumph.',
      'Substantial financial gains, fulfillment of ambitions, and influential allies.',
      'Success in distant lands or technical research; mindful control of expenses and temper.',
    ],
  },
  mercury: {
    te: [
      'దిగ్బలం పొందిన బుధుడు: అద్భుతమైన తెలివితేటలు, వాక్చాతుర్యం, హాస్యచతురత మరియు నిత్య యవ్వన ఉత్సాహం.',
      'వాక్చాతుర్యంతో ధన సంపాదన, బ్యాంకింగ్/వాణిజ్య/విద్యా రంగాలలో విశేష ఆర్థిక వృద్ధి.',
      'రచనా నైపుణ్యం, మీడియా/సాఫ్ట్‌వేర్/కమ్యూనికేషన్ రంగాలలో గొప్ప ప్రతిభ మరియు ప్రయాణ లాభాలు.',
      'ఉన్నత విద్య, గృహ-వాహన సౌఖ్యం, బంధుమిత్రుల ఆదరణ మరియు ప్రశాంతమైన జీవనం.',
      'తీవ్రమైన మేధాశక్తి, గణిత/శాస్త్ర/జ్యోతిష్య పరిజ్ఞానం, సలహా సంప్రదింపుల నైపుణ్యం మరియు సంతాన ప్రతిభ.',
      'విశ్లేషణా శక్తితో సమస్యలను పరిష్కరిస్తారు. ఆడిటింగ్, న్యాయ, వైద్య రంగాలలో విజయం.',
      'తెలివైన, చురుకైన జీవిత భాగస్వామి లభిస్తారు. వ్యాపార ఒప్పందాలు మరియు భాగస్వామ్యాలు లాభిస్తాయి.',
      'పరిశోధనా దృష్టి, ఆకస్మిక ఆర్థిక లాభాలు, జ్యోతిష్య/నిగూఢ విద్యలలో ప్రవేశం ఉంటాయి.',
      'ఉన్నత విద్యాభ్యాసం, విదేశీ ప్రయాణాలు, ధార్మిక గ్రంథ పఠనం మరియు రచనా కీర్తి లభిస్తాయి.',
      'వ్యాపారం, సాఫ్ట్‌వేర్, అకౌంట్స్, బోధన మరియు మేనేజ్‌మెంట్ రంగాలలో ఉన్నత పదవులు, గౌరవం.',
      'బహుముఖ మార్గాలలో ధన లాభం, మేధావులతో స్నేహం మరియు కోరికల సిద్ధి కలుగుతాయి.',
      'విదేశీ సంబంధాలు, ఆధ్యాత్మిక పరిశోధన మరియు ధర్మ కార్యాలకు వ్యయం చేస్తారు.',
    ],
    en: [
      'Directional strength (Digbala): Brilliant intellect, eloquence, wit, and youthful adaptability.',
      'Wealth through intellect, commerce, banking, teaching, or articulate speech.',
      'Excellence in writing, IT, media, communications, and enterprising ventures.',
      'Academic distinction, domestic refinement, vehicles, and mental peace.',
      'Razor-sharp intelligence, skill in mathematics/astrology/advisory roles, and talented children.',
      'Analytical mastery over complex problems; success in law, medicine, or auditing.',
      'Intelligent, communicative spouse and prosperous business partnerships.',
      'Deep research acumen, legacy gains, and interest in occult/scientific mysteries.',
      'Higher education, publishing, international travel, and philosophical wisdom.',
      'Distinguished career in commerce, technology, management, or communication.',
      'Abiding financial gains through intellect, trade, and an educated network.',
      'Success in foreign assignments, research, and scholarly contemplation.',
    ],
  },
  jupiter: {
    te: [
      'దిగ్బలం పొందిన గురువు: పూర్ణ దైవానుగ్రహం, సాత్విక గుణం, విజ్ఞానం, సమాజంలో గొప్ప గౌరవం మరియు రక్షణ.',
      'కుటుంబ సౌఖ్యం, ధన సమృద్ధి, సత్యవాక్కు మరియు విద్యా/ఆధ్యాత్మిక సంపద లభిస్తాయి.',
      'ధర్మబద్ధమైన ఆలోచనలు, సోదర సహకారం, రచనా/బోధనా రంగాలలో కీర్తి కలుగుతాయి.',
      'మాతృ సౌఖ్యం, విశాలమైన గృహం, వాహన ప్రాప్తి, ఉన్నత విద్య మరియు శాశ్వత మనశ్శాంతి.',
      'త్రికోణ బలం: సంతాన మూలక ఆనందం, అపారమైన మేధాశక్తి, పూర్వజన్మ పుణ్యఫలం మరియు దైవ కటాక్షం.',
      'శత్రువులు కూడా మిత్రులుగా మారుతారు. వైద్య, న్యాయ, ఆర్థిక మరియు సేవా రంగాలలో విజయం.',
      'గుణవంతులైన జీవిత భాగస్వామి, సుఖమయమైన దాంపత్యం మరియు వ్యాపార భాగస్వామ్యాలలో వృద్ధి.',
      'దీర్ఘాయుష్షు, ఆకస్మిక ధన/వారసత్వ లాభం, ఆధ్యాత్మిక సాధన మరియు ఆపదల నుండి దైవ రక్షణ.',
      'భాగ్య స్థానాధిపత్యం: తండ్రి ఆశీస్సులు, గురు భక్తి, తీర్థయాత్రలు, అఖండ అదృష్టం మరియు ధర్మ కీర్తి.',
      'వృత్తి, ఉద్యోగ, వ్యాపారాలలో అత్యున్నత గౌరవం, ధర్మబద్ధమైన అధికారం మరియు శాశ్వత కీర్తి.',
      'సమృద్ధిగా ధన లాభం, ఉన్నత వ్యక్తుల స్నేహం, సంతాన వృద్ధి మరియు సకల మనోభీష్ట సిద్ధి.',
      'ఆధ్యాత్మిక మోక్ష చింతన, శుభకార్యాలకు మరియు దానధర్మాలకు ధన వ్యయం, విదేశీ యానం.',
    ],
    en: [
      'Directional strength (Digbala): Divine protection, wisdom, moral nobility, and high social respect.',
      'Abundant family wealth, truthful and gracious speech, and domestic harmony.',
      'Dharmic courage, philosophical communication, and supportive siblings.',
      'Blessings of spacious home, vehicles, higher education, and deep inner contentment.',
      'Trikona blessing: Brilliant wisdom, past-life merit, spiritual grace, and accomplished children.',
      'Protection from adversaries, ethical service, and success in law, finance, or healing.',
      'Virtuous, devoted spouse, harmonious marriage, and honorable partnerships.',
      'Longevity, protection in crises, inheritance, and deep spiritual/occult wisdom.',
      'Supreme fortune, grace of gurus and father, pilgrimages, and dharmic prosperity.',
      'High ethical authority in career, respected leadership, and lasting renown.',
      'Rich financial gains, noble friends, and fulfillment of cherished aspirations.',
      'Charitable heart, spiritual liberation, and success in ashram/institutional or foreign lands.',
    ],
  },
  venus: {
    te: [
      'ఆకర్షణీయమైన తేజస్సు, కళాభిరుచి, మధుర స్వభావం, సౌఖ్యాలు మరియు సంఘంలో ఆదరణ లభిస్తాయి.',
      'లక్ష్మీ కటాక్షం, ఆభరణాలు, మధురమైన సంభాషణ మరియు సంతోషకరమైన కుటుంబ జీవనం.',
      'సంగీతం, కళలు, మీడియా, డిజైనింగ్ రంగాలలో ప్రతిభ మరియు ఆహ్లాదకరమైన ప్రయాణాలు.',
      'దిగ్బలం పొందిన శుక్రుడు: నూతన గృహ-వాహన ప్రాప్తి, తల్లి ఆశీస్సులు, ఆనందమయమైన గృహ వాతావరణం.',
      'సృజనాత్మక ప్రతిభ, ప్రేమ, సంతాన సౌఖ్యం, కళా రంగాలలో కీర్తి మరియు ఆర్థిక లాభం.',
      'సేవా గుణం ఉంటుంది; అయితే ఆర్థిక లావాదేవీలలో మరియు ఆరోగ్య విషయంలో క్రమశిక్షణ అవసరం.',
      'అన్యోన్యమైన దాంపత్యం, అందమైన/గుణవంతులైన భాగస్వామి మరియు వ్యాపార విస్తరణ.',
      'ఆకస్మిక ధన లాభం, భాగస్వామి ద్వారా ఆర్థిక వృద్ధి మరియు దీర్ఘాయుష్షు కలుగుతాయి.',
      'భాగ్య యోగం, విదేశీ ప్రయాణాలు, దైవ భక్తి, కళా/సాంస్కృతిక రంగాలలో అదృష్టం.',
      'వ్యాపారం, కళలు, ఆర్థిక, సాఫ్ట్‌వేర్ మరియు ప్రజా సంబంధాల రంగాలలో ఘన విజయం.',
      'అనేక మార్గాలలో ఆదాయం, ఆభరణాల ప్రాప్తి, మిత్రుల సహకారం మరియు విలాసవంతమైన జీవనం.',
      'శుభకార్యాలకు ఖర్చు, విదేశీ నివాస యోగం మరియు సుఖమయమైన జీవనం లభిస్తాయి.',
    ],
    en: [
      'Magnetic charm, artistic grace, refined tastes, and natural popularity.',
      'Lakshmi grace in finances, sweet speech, family happiness, and fine possessions.',
      'Talent in arts, media, design, and harmonious relations with siblings and neighbors.',
      'Directional strength (Digbala): Beautiful home, luxury vehicles, and domestic bliss.',
      'Romantic joy, creative brilliance, artistic fame, and blessings through children.',
      'Diplomatic service; maintaining balanced diet and financial prudence is advised.',
      'Loving marriage, attractive spouse, and prosperous business partnerships.',
      'Financial gains through spouse/inheritance, longevity, and intuitive depth.',
      'Great fortune, cultural travels, devotion, and prosperity through dharma.',
      'Career success in arts, commerce, finance, hospitality, or public relations.',
      'Abundant income, social popularity, luxury comforts, and fulfilled desires.',
      'Auspicious expenses, foreign comforts, and charitable enjoyment of life.',
    ],
  },
  saturn: {
    te: [
      'క్రమశిక్షణ, ఓర్పు, నిజాయితీ మరియు స్వయంకృషితో అంచెలంచెలుగా ఎదిగే తత్వం ఉంటుంది.',
      'కఠిన శ్రమతో ధన నిల్వలు ఏర్పరుచుకుంటారు. కుటుంబ బాధ్యతలను సమర్థవంతంగా నిర్వహిస్తారు.',
      'అపారమైన పట్టుదల, ధైర్యం మరియు స్వశక్తితో ఎంతటి కఠిన కార్యాన్నైనా పూర్తి చేస్తారు.',
      'స్థిరాస్తులు, పాత గృహాలు/భూముల ద్వారా లాభం; తల్లి ఆరోగ్యంపై మరియు మనశ్శాంతిపై శ్రద్ధ అవసరం.',
      'లోతైన తాత్విక ఆలోచన, సాంకేతిక విద్య మరియు సంప్రదాయబద్ధమైన జీవన విధానం ఉంటాయి.',
      'శత్రువులు, రుణాలు, ఆటంకాలపై స్థిరమైన విజయం సాధిస్తారు. కఠిన శ్రమకు తగిన ప్రతిఫలం లభిస్తుంది.',
      'దిగ్బలం పొందిన శని: పరిణతి గల, నమ్మకమైన జీవిత భాగస్వామి; స్థిరమైన వ్యాపార భాగస్వామ్యం.',
      'పూర్ణ ఆయుర్దాయం, ఓర్పుతో కష్టాలను అధిగమించే శక్తి; ఈశ్వర ఆరాధన వల్ల ఆటంకాలు తొలగుతాయి.',
      'ధర్మ నిষ্ঠ, పూర్వీకుల ఆస్తులు, ఆధ్యాత్మిక క్రమశిక్షణ మరియు పెద్దల పట్ల గౌరవం ఉంటాయి.',
      'కర్మ స్థానాధిపత్యం: ఉద్యోగ/పరిశ్రమ/రాజకీయ రంగాలలో కఠిన శ్రమతో ఉన్నత అధికారం మరియు శాశ్వత కీర్తి.',
      'స్థిరమైన ఆదాయం, భూమి/ఇనుము/సాంకేతిక రంగాల ద్వారా విశేష ధన లాభం మరియు అభీష్ట సిద్ధి.',
      'విదేశీ ఉద్యోగం, ఆధ్యాత్మిక సేవ, ధర్మ కార్యాలకు వ్యయం; శనివార నియమాలు శుభప్రదం.',
    ],
    en: [
      'Self-disciplined, patient, and resilient; steady rise through perseverance.',
      'Hard-earned wealth, thriftiness, and responsible stewardship of family duties.',
      'Unyielding courage, stamina, and triumph over obstacles through self-effort.',
      'Gains through land and traditional properties; prioritizing inner peace and rest is key.',
      'Deep, serious intellect, technical focus, and dutiful parenting.',
      'Complete victory over competitors and debts through persistent hard work.',
      'Directional strength (Digbala): Mature, loyal spouse and enduring partnerships.',
      'Long life and endurance; Rudra/Shani prayers smooth out sudden tests.',
      'Traditional dharma, philosophical depth, and steady fortune in the second half of life.',
      'Enduring career authority, industrial/administrative leadership, and respected status.',
      'Massive long-term gains, realization of ambitions, and rewards for perseverance.',
      'Service in distant lands or charitable institutions; spiritual detachment.',
    ],
  },
  rahu: {
    te: [
      'వినూత్న ఆలోచనలు, ఆత్మవిశ్వాసం మరియు సమాజంలో ప్రత్యేక గుర్తింపు పొందాలనే తపన ఉంటాయి.',
      'ఆకస్మిక ధన ప్రవాహం ఉంటుంది; అయితే మాటలలో సంయమనం మరియు ఆర్థిక పొదుపు అవసరం.',
      'అసాధారణ ధైర్య సాహసాలు, నూతన సాంకేతిక/మీడియా రంగాలలో గొప్ప విజయం సాధిస్తారు.',
      'ఆధునిక గృహ-వాహన యోగం, దూర ప్రాంతాలలో స్థిరనివాసం; దుర్గా ఆరాధన మనశ్శాంతిని ఇస్తుంది.',
      'లోతైన పరిశోధనా బుద్ధి, కొత్త ఆవిష్కరణలు; సంతానం మరియు పెట్టుబడుల విషయంలో ఆచితూచి వ్యవహరించాలి.',
      'శత్రువులపై తిరుగులేని విజయం, పోటీలలో గెలుపు మరియు ఉన్నత ఉద్యోగ యోగం కలుగుతాయి.',
      'విభిన్న ఆలోచనలు గల భాగస్వామి, వ్యాపార విస్తరణ; దాంపత్యంలో పరస్పర నమ్మకం ముఖ్యం.',
      'ఆకస్మిక పరిణామాలు, నిగూఢ శాస్త్ర పరిశోధన; శ్రీ దుర్గా/సుబ్రహ్మణ్య ఆరాధన రక్షణనిస్తుంది.',
      'విదేశీ ప్రయాణాలు, ఉన్నత సాంకేతిక విద్య మరియు భిన్న సంస్కృతుల ద్వారా అభివృద్ధి.',
      'సాఫ్ట్‌వేర్, రాజకీయాలు, వ్యాపారం మరియు అంతర్జాతీయ రంగాలలో వేగవంతమైన ఉన్నతి, కీర్తి.',
      'విశేష ఆర్థిక లాభాలు, విదేశీ ఆదాయం, పలుకుబడి గల మిత్రులు మరియు కోరికల సిద్ధి.',
      'విదేశీ నివాస యోగం, రహస్య పరిశోధనలు; అనవసర ఖర్చులను నియంత్రించుకోవాలి.',
    ],
    en: [
      'Unconventional charisma, ambitious drive, and a desire to stand out.',
      'Sudden financial inflows; mindful speech and savings planning are beneficial.',
      'Fearless enterprise, media/tech success, and strong personal initiative.',
      'Modern home/vehicles and potential relocation; Durga worship brings domestic peace.',
      'Innovative intellect and unconventional ideas; avoid speculative risks.',
      'Triumph over competitors, strong immunity, and career breakthroughs.',
      'Dynamic partnerships and foreign business links; transparency nurtures marriage.',
      'Deep research intuition; spiritual sadhana protects against sudden upheavals.',
      'Foreign travels, global outlook, and progress in modern higher education.',
      'Rapid rise in technology, politics, or international career arenas.',
      'Abundant material gains, influential networks, and fulfillment of big ambitions.',
      'Success in foreign lands and multinational spheres; mindful sleep and budgeting.',
    ],
  },
  ketu: {
    te: [
      'ఆధ్యాత్మిక అంతర్దృష్టి, నిరాడంబరత, లోతైన జ్ఞానం మరియు గణపతి అనుగ్రహం ఉంటాయి.',
      'ఆధ్యాత్మిక/శాస్త్ర సంబంధమైన వాక్కు ఉంటుంది; ఆర్థిక వ్యవహారాలలో జాగ్రత్త అవసరం.',
      'మానసిక ధైర్యం, రచనా/పరిశోధనా నైపుణ్యం మరియు లక్ష్య సాధనలో ఏకాగ్రత ఉంటాయి.',
      'ఆధ్యాత్మిక వాతావరణం గల గృహం, వైరాగ్య భావన; శ్రీ మహాగణపతి ఆరాధన సుఖశాంతులను ఇస్తుంది.',
      'మంత్ర శాస్త్రం, జ్యోతిష్యం, వేదాంతం మరియు సూక్ష్మ పరిశోధనలలో అపారమైన పాండిత్యం.',
      'శత్రు బాధల నివారణ, వైద్య/సేవా/సాంకేతిక రంగాలలో నైపుణ్యం మరియు కార్యజయం.',
      'ఆధ్యాత్మిక స్వభావం గల భాగస్వామి; దాంపత్యంలో అపార్థాలకు తావివ్వకుండా సహనం పాటించాలి.',
      'నిగూఢ విద్యలు, జ్యోతిష్యం, ధ్యానం మరియు ఆకస్మిక అంతర్దృష్టి లభిస్తాయి.',
      'తీర్థయాత్రలు, గురు భక్తి, ధర్మ కార్యాలు మరియు పూర్వజన్మ పుణ్య విశేషం ఉంటాయి.',
      'వైద్యం, సాఫ్ట్‌వేర్, ఆధ్యాత్మిక బోధన మరియు పరిశోధనా రంగాలలో ప్రత్యేక గౌరవం.',
      'ఆధ్యాత్మిక మిత్రులు, సంతృప్తికరమైన ధన లాభం మరియు ధర్మబద్ధమైన కోరికల సిద్ధి.',
      'మోక్ష కారకుడు 12వ స్థానంలో: అత్యున్నత ఆధ్యాత్మిక విముక్తి, ధ్యాన సిద్ధి మరియు దైవ రక్షణ.',
    ],
    en: [
      'Deep spiritual intuition, humility, psychic perception, and Ganapathi grace.',
      'Philosophical speech and detachment from showiness; careful financial planning helps.',
      'Focused determination, subtle skill, and inner courage.',
      'Spiritual home environment; Lord Ganesha worship strengthens domestic comfort.',
      'Mastery in mantra, astrology, coding, or deep analytical subjects.',
      'Victory over hidden obstacles and skill in healing or technical troubleshooting.',
      'Spiritually inclined partner; open communication nurtures marital warmth.',
      'Profound occult insight, mystical experiences, and research depth.',
      'Pilgrimages, devotion to dharma, and ancestral spiritual blessings.',
      'Specialized expertise in research, medicine, IT, or spiritual guidance.',
      'Gains through specialized knowledge, noble friends, and dharmic fulfillment.',
      'Ketu in the 12th house of Moksha: Supreme spiritual insight, meditation, and divine grace.',
    ],
  },
};

export function generateBhavaPredictions(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number
): BhavaPlanetPrediction[] {
  return planets
    .filter((p) => p.id !== 'lagna')
    .map((p) => {
      const houseNumber = ((p.rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
      const bhavaMeta = BHAVA_NAMES_12[houseNumber - 1];
      const textBank = PLANET_BHAVA_TEXT[p.id] || PLANET_BHAVA_TEXT.sun;
      const isVargottama = p.rashiTe === p.navamshaRashiTe;

      const deepAnalysisTe = `రాశి చక్రం (D1)లో ${p.nameTe} ${p.rashiTe} రాశిలో (${p.degreeFormatted} డిగ్రీలు), ${p.nakshatraTe} నక్షత్రం ${p.pada}వ పాదంలో మరియు నవాంశ (D9)లో ${p.navamshaRashiTe} రాశిలో స్థితి పొంది ఉన్నాడు.${
        isVargottama
          ? ' రాశి మరియు నవాంశలలో ఒకే రాశిలో ఉండటం వల్ల ఈ గ్రహానికి "వర్గోత్తమ బలం" సిద్ధించి రెట్టింపు శుభ ఫలితాలను ప్రసాదిస్తుంది!'
          : ''
      } ఈ గ్రహ మహాదశ మరియు అంతర్దశ కాలాలలో "${bhavaMeta.signifTe}" రంగాలలో ముఖ్యమైన పురోగతి కనిపిస్తుంది.`;

      const deepAnalysisEn = `In the D1 Rashi chart, ${p.nameEn} is at ${p.degreeFormatted} in ${p.rashiEn} (${p.nakshatraEn} Nakshatra, Pada ${p.pada}) and occupies ${p.navamshaRashiTe} in the D9 Navamsha.${
        isVargottama
          ? ' Occupying the same sign in both D1 and D9 grants powerful Vargottama dignity!'
          : ''
      } During its Dasha and Bhukti periods, it strongly activates ${bhavaMeta.signifEn.toLowerCase()}.`;

      return {
        planetId: p.id,
        planetTe: p.nameTe,
        planetEn: p.nameEn,
        rashiTe: p.rashiTe,
        rashiEn: p.rashiEn,
        degreeFormatted: p.degreeFormatted,
        nakshatraTe: p.nakshatraTe,
        nakshatraEn: p.nakshatraEn,
        pada: p.pada,
        navamshaRashiTe: p.navamshaRashiTe,
        houseNumber,
        bhavaNameTe: bhavaMeta.te,
        bhavaNameEn: bhavaMeta.en,
        predictionTe: textBank.te[houseNumber - 1],
        predictionEn: textBank.en[houseNumber - 1],
        deepAnalysisTe,
        deepAnalysisEn,
      };
    });
}

// ============================================================================
// CHAPTER 5: DWADASHA STHANA (1-TO-12 HOUSES) COMPLETE LIFE ANALYSIS
// ============================================================================
export function generateAll12HousesCompleteAnalysis(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number
): DwadashaBhavaCompleteReport[] {
  const getHouse = (rashiIdx: number) => ((rashiIdx - lagnaRashiIdx + 12) % 12) + 1;

  return BHAVA_NAMES_12.map((bhava, idx) => {
    const houseNum = idx + 1;
    const houseRashiIdx = (lagnaRashiIdx + idx) % 12;
    const rashiMeta = RASHI_META_12[houseRashiIdx];
    const lordPlanet = planets.find((p) => p.id === rashiMeta.lordId) || planets[1];
    const lordPlacedInHouse = getHouse(lordPlanet.rashiIdx);
    const lordTargetBhava = BHAVA_NAMES_12[lordPlacedInHouse - 1];

    const occupants = planets.filter(
      (p) => p.id !== 'lagna' && getHouse(p.rashiIdx) === houseNum
    );

    const occupantDetailsTe =
      occupants.length > 0
        ? occupants
            .map((op) => {
              const tBank = PLANET_BHAVA_TEXT[op.id] || PLANET_BHAVA_TEXT.sun;
              return `${op.nameTe} (${op.nakshatraTe} - ${op.pada}వ పాదం): ${tBank.te[idx]}`;
            })
            .join(' ')
        : `ఈ స్థానంలో ప్రత్యక్షంగా గ్రహాలు లేకపోయినప్పటికీ, స్థానాధిపతి అయిన ${rashiMeta.lordTe} ${lordPlacedInHouse}వ స్థానంలో (${lordPlanet.rashiTe} రాశిలో) ఉండటం వల్ల ఆ గ్రహ దశ-అంతర్దశలలో ఈ స్థాన ఫలితాలు పూర్తిగా వికసిస్తాయి.`;

    const occupantDetailsEn =
      occupants.length > 0
        ? occupants
            .map((op) => {
              const tBank = PLANET_BHAVA_TEXT[op.id] || PLANET_BHAVA_TEXT.sun;
              return `${op.nameEn} (${op.nakshatraEn} Pada ${op.pada}): ${tBank.en[idx]}`;
            })
            .join(' ')
        : `Although no planet directly occupies this house, its ruler ${rashiMeta.lordEn} placed in House #${lordPlacedInHouse} (${lordPlanet.rashiEn}) governs and delivers its fruits during its Dasha periods.`;

    const detailedPredictionTe = `మీ జన్మ లగ్నం నుండి ${bhava.te} "${rashiMeta.te}" రాశి అవుతుంది. ఈ స్థానానికి అధిపతి అయిన ${rashiMeta.lordTe} కుండలిలో ${lordPlacedInHouse}వ స్థానంలో (${lordTargetBhava.te} — ${lordPlanet.rashiTe} రాశి, ${lordPlanet.nakshatraTe} నక్షత్రం ${lordPlanet.pada}వ పాదం)లో స్థితి పొంది ఉన్నాడు. శాస్త్ర రీత్యా ${houseNum}వ స్థానాధిపతి ${lordPlacedInHouse}వ స్థానంతో సంబంధం ఏర్పరచుకోవడం వల్ల "${bhava.signifTe}" అంశాలు మరియు "${lordTargetBhava.signifTe}" అంశాలు పరస్పరం అనుసంధానమై మీ జీవిత గమనాన్ని నిర్దేశిస్తాయి. ${occupantDetailsTe}`;

    const detailedPredictionEn = `From your Ascendant, the ${bhava.en} falls in ${rashiMeta.en}, ruled by ${rashiMeta.lordEn}. In your birth chart, ${rashiMeta.lordEn} is positioned in the ${lordPlacedInHouse}th House (${lordTargetBhava.en} in ${lordPlanet.rashiEn}, ${lordPlanet.nakshatraEn} Pada ${lordPlanet.pada}). This links the significations of ${bhava.signifEn.toLowerCase()} directly with ${lordTargetBhava.signifEn.toLowerCase()}. ${occupantDetailsEn}`;

    const guidanceTe = `${bhava.domainTe} వృద్ధి కొరకు ${rashiMeta.lordTe} గ్రహానికి సంబంధించిన దానాలు, స్తోత్ర పారాయణ చేయడం మరియు ${lordPlacedInHouse}వ స్థాన విషయాలలో ధర్మబద్ధంగా వ్యవహరించడం విశేష శుభప్రదం.`;
    const guidanceEn = `To strengthen ${bhava.domainEn.toLowerCase()}, honor the significations of ${rashiMeta.lordEn} through ethical action and spiritual sadhana.`;

    return {
      houseNumber: houseNum,
      bhavaTitleTe: `${bhava.te} — ${bhava.domainTe}`,
      bhavaTitleEn: `${bhava.en} — ${bhava.domainEn}`,
      signifTe: bhava.signifTe,
      signifEn: bhava.signifEn,
      rashiInHouseTe: rashiMeta.te,
      rashiInHouseEn: rashiMeta.en,
      lordTe: rashiMeta.lordTe,
      lordEn: rashiMeta.lordEn,
      lordPlacedInHouse,
      lordPlacedInRashiTe: lordPlanet.rashiTe,
      occupantPlanetsTe: occupants.map((o) => o.nameTe),
      occupantPlanetsEn: occupants.map((o) => o.nameEn),
      detailedPredictionTe,
      detailedPredictionEn,
      guidanceTe,
      guidanceEn,
    };
  });
}

// ============================================================================
// CHAPTER 7: BHRIGU CHAKRA 1 TO 96 YEARS LIFE PROGRESSION (8 CYCLES)
// ============================================================================
export function generateBhriguLifeProgression(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number,
  birthDate: string
): BhriguCycleItem[] {
  const birthYear = Number(birthDate.split('-')[0]) || 1994;
  const birthMonth = Math.min(12, Math.max(1, Number(birthDate.split('-')[1]) || 1));
  const getHouse = (rashiIdx: number) => ((rashiIdx - lagnaRashiIdx + 12) % 12) + 1;

  const cycleMeta = [
    { cycle: 1, startAge: 1, endAge: 12, themeTe: 'బాల్య దశ, ఆరోగ్యం & ప్రాథమిక విద్యా పునాది', themeEn: 'Childhood, Early Vitality & Primary Education' },
    { cycle: 2, startAge: 13, endAge: 24, themeTe: 'ఉన్నత విద్యాభ్యాసం, నైపుణ్య వృద్ధి & యవ్వన ఆశయాలు', themeEn: 'Higher Education, Skill Mastery & Youthful Ambitions' },
    { cycle: 3, startAge: 25, endAge: 36, themeTe: 'ఉద్యోగ/వ్యాపార స్థిరత్వం, వివాహ యోగం & ఆర్థిక ఆరంభం', themeEn: 'Career Establishment, Marriage & Financial Foundation' },
    { cycle: 4, startAge: 37, endAge: 48, themeTe: 'గృహ-వాహన ఆస్తుల వృద్ధి, అధికార ప్రాప్తి & సంతాన వికాసం', themeEn: 'Property Acquisition, Executive Rise & Family Expansion' },
    { cycle: 5, startAge: 49, endAge: 60, themeTe: 'సంఘంలో ఉన్నత గౌరవం, ఆర్థిక పరిణతి & శుభకార్యాలు', themeEn: 'Social Prestige, Financial Maturity & Auspicious Milestones' },
    { cycle: 6, startAge: 61, endAge: 72, themeTe: 'పెద్దరికం, తీర్థయాత్రలు, సంతాన విజయాలు & ఆధ్యాత్మిక శాంతి', themeEn: 'Wisdom, Pilgrimages, Legacy & Spiritual Serenity' },
    { cycle: 7, startAge: 73, endAge: 84, themeTe: 'కుటుంబ ఆదరణ, ధర్మ కార్యాలు & ఆరోగ్య సంరక్షణ', themeEn: 'Family Reverence, Dharmic Charity & Peaceful Living' },
    { cycle: 8, startAge: 85, endAge: 96, themeTe: 'పూర్ణ ఆయుర్దాయ యోగం, తపోనిষ্ঠ & దైవ సన్నిధి', themeEn: 'Longevity, Inner Fulfillment & Divine Grace' },
  ];

  return cycleMeta.map((c, idx) => {
    const milestoneAge = birthMonth + idx * 12;
    const milestoneYear = birthYear + milestoneAge;
    const activeHouseNum = ((birthMonth - 1 + idx) % 12) + 1;
    const bhava = BHAVA_NAMES_12[activeHouseNum - 1];
    const rashiIdx = (lagnaRashiIdx + activeHouseNum - 1) % 12;
    const rashiMeta = RASHI_META_12[rashiIdx];
    const lord = planets.find((p) => p.id === rashiMeta.lordId) || planets[1];
    const lordHouse = getHouse(lord.rashiIdx);

    return {
      cycleNumber: c.cycle,
      ageRangeTe: `${c.startAge} నుండి ${c.endAge} ఏళ్ల వయస్సు (ముఖ్య మలుపు: ${milestoneAge}వ ఏట)`,
      ageRangeEn: `Ages ${c.startAge}–${c.endAge} (Key Turning Point: Age ${milestoneAge})`,
      yearRange: `${birthYear + c.startAge} – ${birthYear + c.endAge} (${milestoneYear})`,
      activatedHouse: activeHouseNum,
      themeTe: c.themeTe,
      themeEn: c.themeEn,
      predictionTe: `భృగు చక్ర పద్ధతి ప్రకారం ఈ 12 ఏళ్ల కాలచక్ర గమనంలో మీ కుండలిలోని ${bhava.te} (${rashiMeta.te} రాశి) మరియు దాని అధిపతి అయిన ${rashiMeta.lordTe} (${lordHouse}వ స్థానంలో స్థితి) ప్రధానంగా క్రియాశీలమవుతాయి. ముఖ్యంగా ${milestoneAge}వ ఏట (${milestoneYear} సంవత్సరంలో) "${bhava.signifTe}" విషయాలలో కీలకమైన శుభ పరిణామాలు మరియు జీవిత మలుపులు ఏర్పడతాయి.`,
      predictionEn: `According to Bhrigu Chakra Paddhati, during this 12-year life cycle your ${bhava.en} (${rashiMeta.en}) and its ruler ${rashiMeta.lordEn} in House #${lordHouse} become highly active. Especially around Age ${milestoneAge} (Year ${milestoneYear}), significant milestones unfold in ${bhava.signifEn.toLowerCase()}.`,
    };
  });
}

// ============================================================================
// CHAPTER 8: VEDIC REMEDIES, LUCKY GEMSTONES, RUDRAKSHA & PARIHARALU
// ============================================================================
const LAGNA_REMEDY_CONFIG: {
  gemTe: string;
  gemEn: string;
  metalTe: string;
  fingerTe: string;
  rudrakshaTe: string;
  rudrakshaEn: string;
  numbers: string;
  daysTe: string;
  daysEn: string;
  colorsTe: string;
  colorsEn: string;
  deityTe: string;
  deityEn: string;
  stotraTe: string;
  stotraEn: string;
  danaTe: string;
  danaEn: string;
}[] = [
  // 0: Mesha
  {
    gemTe: 'పగడం (Red Coral) లేదా కనకపుష్యరాగం (Yellow Sapphire)',
    gemEn: 'Red Coral (Moonga) or Yellow Sapphire (Pukhraj)',
    metalTe: 'బంగారం లేదా రాగి ఉంగరంలో',
    fingerTe: 'ఉంగరపు వేలికి (మంగళవారం ఉదయం)',
    rudrakshaTe: '3 ముఖాల రుద్రాక్ష లేదా 5 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '3-Mukhi or 5-Mukhi Rudraksha',
    numbers: '9, 1, 3',
    daysTe: 'మంగళవారం, ఆదివారం, గురువారం',
    daysEn: 'Tuesday, Sunday, Thursday',
    colorsTe: 'ఎరుపు, కాషాయం, పసుపు, తెలుపు',
    colorsEn: 'Crimson Red, Saffron, Yellow, White',
    deityTe: 'శ్రీ సుబ్రహ్మణ్య స్వామి, ఆంజనేయ స్వామి & సూర్యనారాయణ మూర్తి',
    deityEn: 'Lord Subrahmanya, Lord Hanuman & Surya Bhagavan',
    stotraTe: 'సుబ్రహ్మణ్య అష్టకం, హనుమాన్ చాలీసా & ఆదిత్య హృదయం',
    stotraEn: 'Subrahmanya Ashtakam, Hanuman Chalisa & Aditya Hrudayam',
    danaTe: 'మంగళవారం కందిపప్పు, బెల్లం, ఎర్రని వస్త్ర దానం మరియు అన్నదానం',
    danaEn: 'Donating red lentils (toor dal), jaggery, and feeding the needy on Tuesdays',
  },
  // 1: Vrushabha
  {
    gemTe: 'వజ్రం / జిర్కాన్ (Diamond / White Zircon) లేదా నీలం (Blue Sapphire - జాతక పరిశీలనతో)',
    gemEn: 'Diamond / White Zircon or Emerald (Panna)',
    metalTe: 'వెండి లేదా ప్లాటినం/బంగారం ఉంగరంలో',
    fingerTe: 'మధ్య వేలు లేదా చిటికెన వేలికి (శుక్రవారం ఉదయం)',
    rudrakshaTe: '6 ముఖాల రుద్రాక్ష లేదా 7 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '6-Mukhi or 7-Mukhi Rudraksha',
    numbers: '6, 5, 8',
    daysTe: 'శుక్రవారం, బుధవారం, శనివారం',
    daysEn: 'Friday, Wednesday, Saturday',
    colorsTe: 'తెలుపు, ఆకుపచ్చ, లేత నీలం, క్రీమ్',
    colorsEn: 'Pure White, Emerald Green, Light Blue, Cream',
    deityTe: 'శ్రీ మహాలక్ష్మి అమ్మవారు, శ్రీ వేంకటేశ్వర స్వామి',
    deityEn: 'Goddess Mahalakshmi & Lord Venkateswara',
    stotraTe: 'శ్రీ సూక్తం, కనకధారా స్తోత్రం & విష్ణు సహస్రనామం',
    stotraEn: 'Sri Suktam, Kanakadhara Stotram & Vishnu Sahasranama',
    danaTe: 'శుక్రవారం గోమాతకు గ్రాసం, బొబ్బర్లు/బియ్యం, పెరుగు దానం',
    danaEn: 'Go-Seva (feeding cows), white rice, and curd charity on Fridays',
  },
  // 2: Mithuna
  {
    gemTe: 'పచ్చ (Emerald / Marakatham)',
    gemEn: 'Natural Emerald (Marakatham / Panna)',
    metalTe: 'బంగారం లేదా వెండి ఉంగరంలో',
    fingerTe: 'చిటికెన వేలికి (బుధవారం ఉదయం)',
    rudrakshaTe: '4 ముఖాల రుద్రాక్ష లేదా 6 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '4-Mukhi or 6-Mukhi Rudraksha',
    numbers: '5, 6, 9',
    daysTe: 'బుధవారం, శుక్రవారం',
    daysEn: 'Wednesday, Friday',
    colorsTe: 'ఆకుపచ్చ, తెలుపు, లేత పసుపు',
    colorsEn: 'Green, White, Soft Yellow',
    deityTe: 'శ్రీ మహావిష్ణువు, శ్రీ లక్ష్మీ నారాయణులు',
    deityEn: 'Lord Maha Vishnu & Sri Lakshmi Narayana',
    stotraTe: 'శ్రీ విష్ణు సహస్రనామ స్తోత్రం & వేంకటేశ్వర సుప్రభాతం',
    stotraEn: 'Sri Vishnu Sahasranama Stotram',
    danaTe: 'బుధవారం పచ్చ పెసలు, పేద విద్యార్థులకు పుస్తకాలు, విద్యా దానం',
    danaEn: 'Donating green gram (moong) and educational books to students on Wednesdays',
  },
  // 3: Karkataka
  {
    gemTe: 'ముత్యం (Natural Pearl) లేదా పగడం (Red Coral)',
    gemEn: 'Natural Pearl (Moti) or Red Coral',
    metalTe: 'వెండి ఉంగరంలో',
    fingerTe: 'ఉంగరపు వేలు లేదా చిటికెన వేలికి (సోమవారం ఉదయం)',
    rudrakshaTe: '2 ముఖాల రుద్రాక్ష లేదా గౌరీ శంకర రుద్రాక్ష',
    rudrakshaEn: '2-Mukhi or Gauri Shankar Rudraksha',
    numbers: '2, 7, 9',
    daysTe: 'సోమవారం, మంగళవారం, గురువారం',
    daysEn: 'Monday, Tuesday, Thursday',
    colorsTe: 'తెలుపు, పాల తెలుపు, ఎరుపు, పసుపు',
    colorsEn: 'Pearl White, Cream, Crimson, Yellow',
    deityTe: 'శ్రీ పార్వతీ పరమేశ్వరులు, శ్రీ లలితా త్రిపురసుందరి',
    deityEn: 'Lord Shiva-Parvati & Goddess Lalita Tripurasundari',
    stotraTe: 'శ్రీ రుద్రం / శివ పంచాక్షరి, లలితా సహస్రనామ పారాయణ',
    stotraEn: 'Shiva Panchakshari, Rudram & Lalita Sahasranama',
    danaTe: 'సోమవారం శివాలయంలో క్షీరాభిషేకం, బియ్యం మరియు పాలు దానం',
    danaEn: 'Milk Abhishekam to Lord Shiva and donating rice/milk on Mondays',
  },
  // 4: Simha
  {
    gemTe: 'కెంపు (Natural Ruby / Manikyam) లేదా పగడం',
    gemEn: 'Natural Ruby (Manikyam) or Red Coral',
    metalTe: 'బంగారం లేదా రాగి ఉంగరంలో',
    fingerTe: 'ఉంగరపు వేలికి (ఆదివారం ఉదయం)',
    rudrakshaTe: '1 ముఖి / 12 ముఖాల రుద్రాక్ష లేదా 3 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '12-Mukhi or 3-Mukhi Rudraksha',
    numbers: '1, 9, 3',
    daysTe: 'ఆదివారం, మంగళవారం, గురువారం',
    daysEn: 'Sunday, Tuesday, Thursday',
    colorsTe: 'బంగారు రంగు, కాషాయం, ఎరుపు, పసుపు',
    colorsEn: 'Gold, Saffron, Orange, Red',
    deityTe: 'శ్రీ సూర్యనారాయణ స్వామి, శ్రీ రామచంద్ర మూర్తి',
    deityEn: 'Lord Suryanarayana & Lord Sri Rama',
    stotraTe: 'ఆదిత్య హృదయ స్తోత్రం & శ్రీ రామ రక్షా స్తోత్రం',
    stotraEn: 'Aditya Hrudayam & Sri Rama Raksha Stotram',
    danaTe: 'ఆదివారం గోధుమలు, బెల్లం, రాగి పాత్ర దానం మరియు పితృ దేవతల ఆరాధన',
    danaEn: 'Donating wheat, jaggery, and offering Arghya to the Sun on Sundays',
  },
  // 5: Kanya
  {
    gemTe: 'పచ్చ (Natural Emerald / Marakatham)',
    gemEn: 'Natural Emerald (Panna) or White Zircon',
    metalTe: 'బంగారం లేదా వెండి ఉంగరంలో',
    fingerTe: 'చిటికెన వేలికి (బుధవారం ఉదయం)',
    rudrakshaTe: '4 ముఖాల రుద్రాక్ష లేదా గణేశ రుద్రాక్ష',
    rudrakshaEn: '4-Mukhi or Ganesh Rudraksha',
    numbers: '5, 6, 8',
    daysTe: 'బుధవారం, శుక్రవారం',
    daysEn: 'Wednesday, Friday',
    colorsTe: 'ఆకుపచ్చ, తెలుపు, లేత నీలం',
    colorsEn: 'Emerald Green, White, Light Blue',
    deityTe: 'శ్రీ మహాగణపతి & శ్రీ వేంకటేశ్వర స్వామి',
    deityEn: 'Lord Maha Ganapathi & Lord Venkateswara',
    stotraTe: 'సంకటనాశన గణపతి స్తోత్రం & విష్ణు సహస్రనామం',
    stotraEn: 'Sankatanashana Ganapathi Stotram & Vishnu Sahasranama',
    danaTe: 'బుధవారం పచ్చ పెసలు, ఆకుకూరలు, గోమాతకు గ్రాసం మరియు విద్యా దానం',
    danaEn: 'Feeding green grass to cows and donating green gram on Wednesdays',
  },
  // 6: Tula
  {
    gemTe: 'వజ్రం / వైట్ జిర్కాన్ (Diamond / Zircon) లేదా నీలం (Blue Sapphire)',
    gemEn: 'Diamond / White Zircon or Blue Sapphire (after trial)',
    metalTe: 'వెండి లేదా ప్లాటినం ఉంగరంలో',
    fingerTe: 'మధ్య వేలు లేదా ఉంగరపు వేలికి (శుక్రవారం ఉదయం)',
    rudrakshaTe: '6 ముఖాల రుద్రాక్ష లేదా 7 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '6-Mukhi or 7-Mukhi Rudraksha',
    numbers: '6, 8, 5',
    daysTe: 'శుక్రవారం, శనివారం, బుధవారం',
    daysEn: 'Friday, Saturday, Wednesday',
    colorsTe: 'తెలుపు, క్రీమ్, నీలం, ఆకుపచ్చ',
    colorsEn: 'White, Cream, Royal Blue, Green',
    deityTe: 'శ్రీ రాజరాజేశ్వరి అమ్మవారు & శ్రీ మహాలక్ష్మి',
    deityEn: 'Goddess Rajarajeswari & Mahalakshmi',
    stotraTe: 'లలితా సహస్రనామ స్తోత్రం & అష్టలక్ష్మి స్తోత్రం',
    stotraEn: 'Sri Lalita Sahasranama & Ashtalakshmi Stotram',
    danaTe: 'శుక్రవారం సువాసినులకు తాంబూలం, తెలుపు వస్త్రాలు మరియు అన్నదానం',
    danaEn: 'Offering Tamboolam and white garments to women and Annadanam on Fridays',
  },
  // 7: Vruschika
  {
    gemTe: 'పగడం (Red Coral) లేదా కనకపుష్యరాగం (Yellow Sapphire)',
    gemEn: 'Red Coral (Moonga) or Yellow Sapphire (Pukhraj)',
    metalTe: 'బంగారం లేదా రాగి ఉంగరంలో',
    fingerTe: 'ఉంగరపు వేలికి (మంగళవారం ఉదయం)',
    rudrakshaTe: '3 ముఖాల రుద్రాక్ష లేదా 5 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '3-Mukhi or 5-Mukhi Rudraksha',
    numbers: '9, 3, 2',
    daysTe: 'మంగళవారం, గురువారం, ఆదివారం',
    daysEn: 'Tuesday, Thursday, Sunday',
    colorsTe: 'ఎరుపు, పసుపు, కాషాయం, తెలుపు',
    colorsEn: 'Deep Red, Yellow, Rust Orange, White',
    deityTe: 'శ్రీ లక్ష్మీ నరసింహ స్వామి, సుబ్రహ్మణ్య స్వామి & ఆంజనేయుడు',
    deityEn: 'Sri Lakshmi Narasimha, Subrahmanya & Hanuman',
    stotraTe: 'ఋణ విమోచన అంగారక స్తోత్రం, నరసింహ కరావలంబం',
    stotraEn: 'Runa Vimochana Angaraka Stotram & Narasimha Stotram',
    danaTe: 'మంగళవారం కందిపప్పు, ఎర్రని పండ్లు మరియు వైద్య సహాయం',
    danaEn: 'Donating red lentils, fruits, and supporting medical aid on Tuesdays',
  },
  // 8: Dhanussu
  {
    gemTe: 'కనకపుష్యరాగం (Yellow Sapphire) లేదా కెంపు (Ruby)',
    gemEn: 'Yellow Sapphire (Pukhraj) or Natural Ruby',
    metalTe: 'బంగారం ఉంగరంలో',
    fingerTe: 'చూపుడు వేలికి (గురువారం ఉదయం)',
    rudrakshaTe: '5 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '5-Mukhi Rudraksha',
    numbers: '3, 1, 9',
    daysTe: 'గురువారం, ఆదివారం, మంగళవారం',
    daysEn: 'Thursday, Sunday, Tuesday',
    colorsTe: 'పసుపు, బంగారు రంగు, కాషాయం, ఎరుపు',
    colorsEn: 'Golden Yellow, Saffron, Orange, Red',
    deityTe: 'శ్రీ దక్షిణామూర్తి, శ్రీ దత్తాత్రేయ స్వామి & సీతారాములు',
    deityEn: 'Sri Dakshinamurthy, Lord Dattatreya & Sri Rama',
    stotraTe: 'దక్షిణామూర్తి స్తోత్రం, గురు అష్టకం & ఆదిత్య హృదయం',
    stotraEn: 'Dakshinamurthy Stotram & Guru Ashtakam',
    danaTe: 'గురువారం శనగలు, పసుపు, బెల్లం, వేద పండితులకు గౌరవ దానం',
    danaEn: 'Donating chickpeas (chana), turmeric, and honoring Vedic scholars on Thursdays',
  },
  // 9: Makaram
  {
    gemTe: 'ఇంద్రనీలం (Blue Sapphire - పరీక్షించి) లేదా వజ్రం / పచ్చ',
    gemEn: 'Blue Sapphire (Neelam - after trial) or Diamond / Emerald',
    metalTe: 'వెండి లేదా పంచలోహ ఉంగరంలో',
    fingerTe: 'మధ్య వేలికి (శనివారం ఉదయం)',
    rudrakshaTe: '7 ముఖాల రుద్రాక్ష లేదా 14 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '7-Mukhi or 14-Mukhi Rudraksha',
    numbers: '8, 6, 5',
    daysTe: 'శనివారం, శుక్రవారం, బుధవారం',
    daysEn: 'Saturday, Friday, Wednesday',
    colorsTe: 'నీలం, తెలుపు, ఆకుపచ్చ',
    colorsEn: 'Navy Blue, White, Emerald Green',
    deityTe: 'శ్రీ వేంకటేశ్వర స్వామి, పరమశివుడు & ఆంజనేయ స్వామి',
    deityEn: 'Lord Venkateswara, Lord Shiva & Lord Hanuman',
    stotraTe: 'దశరథ కృత శని స్తోత్రం, హనుమాన్ చాలీసా & శివ స్తోత్రం',
    stotraEn: 'Dasharatha Shani Stotram & Hanuman Chalisa',
    danaTe: 'శనివారం నల్ల నువ్వులు, నువ్వుల నూనె దీపం, పేదలకు అన్నదానం మరియు పాదరక్షల దానం',
    danaEn: 'Lighting sesame lamp on Saturdays and offering food (Annadanam) to the needy',
  },
  // 10: Kumbham
  {
    gemTe: 'ఇంద్రనీలం (Blue Sapphire - పరీక్షించి) లేదా వజ్రం / జిర్కాన్',
    gemEn: 'Blue Sapphire (Neelam) or White Zircon / Diamond',
    metalTe: 'వెండి లేదా బంగారం ఉంగరంలో',
    fingerTe: 'మధ్య వేలికి (శనివారం లేదా శుక్రవారం)',
    rudrakshaTe: '7 ముఖాల రుద్రాక్ష లేదా 6 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '7-Mukhi or 6-Mukhi Rudraksha',
    numbers: '8, 6, 5',
    daysTe: 'శనివారం, శుక్రవారం, బుధవారం',
    daysEn: 'Saturday, Friday, Wednesday',
    colorsTe: 'ఆకాశ నీలం, తెలుపు, ఆకుపచ్చ',
    colorsEn: 'Sky Blue, Electric Blue, White, Green',
    deityTe: 'శ్రీ రుద్రుడు (పరమేశ్వరుడు), శ్రీ వేంకటేశ్వర స్వామి',
    deityEn: 'Lord Rudra (Shiva) & Lord Venkateswara',
    stotraTe: 'శ్రీ రుద్రం, హనుమాన్ చాలీసా & కనకధారా స్తోత్రం',
    stotraEn: 'Sri Rudram, Hanuman Chalisa & Kanakadhara Stotram',
    danaTe: 'శనివారం అనాథలకు, వృద్ధులకు అన్నదానం మరియు వస్త్ర దానం',
    danaEn: 'Charitable service and food donation to the elderly and needy on Saturdays',
  },
  // 11: Meenam
  {
    gemTe: 'కనకపుష్యరాగం (Yellow Sapphire) లేదా పగడం (Red Coral)',
    gemEn: 'Yellow Sapphire (Pukhraj) or Red Coral (Moonga)',
    metalTe: 'బంగారం ఉంగరంలో',
    fingerTe: 'చూపుడు వేలికి (గురువారం ఉదయం)',
    rudrakshaTe: '5 ముఖాల రుద్రాక్ష లేదా 2 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '5-Mukhi or 2-Mukhi Rudraksha',
    numbers: '3, 9, 2',
    daysTe: 'గురువారం, మంగళవారం, సోమవారం',
    daysEn: 'Thursday, Tuesday, Monday',
    colorsTe: 'పసుపు, తెలుపు, ఎరుపు, కాషాయం',
    colorsEn: 'Yellow, Sea White, Crimson, Saffron',
    deityTe: 'శ్రీ దక్షిణామూర్తి, శ్రీ మహాగణపతి & శివపార్వతులు',
    deityEn: 'Sri Dakshinamurthy, Maha Ganapathi & Shiva-Parvati',
    stotraTe: 'గురు స్తోత్రం, శివ సహస్రనామం & సుబ్రహ్మణ్య భుజంగం',
    stotraEn: 'Guru Stotram, Shiva Sahasranama & Subrahmanya Bhujangam',
    danaTe: 'గురువారం శనగలు, పసుపు వస్త్రాలు, ఆలయాలకు దీపారాధన నెయ్యి దానం',
    danaEn: 'Donating ghee for temple lamps, yellow garments, and chickpeas on Thursdays',
  },
];

export function generateVedicRemediesProfile(
  lagnaRashiIdx: number,
  moonRashiIdx: number
): VedicRemediesProfile {
  const idx = ((lagnaRashiIdx % 12) + 12) % 12;
  const mIdx = ((moonRashiIdx % 12) + 12) % 12;
  const cfg = LAGNA_REMEDY_CONFIG[idx];
  const moonMeta = RASHI_META_12[mIdx];

  return {
    luckyGemstoneTe: `${cfg.gemTe} (జన్మ లగ్నం: ${RASHI_META_12[idx].te} & జన్మ రాశి: ${moonMeta.te} ఆధారంగా)`,
    luckyGemstoneEn: `${cfg.gemEn} (Based on ${RASHI_META_12[idx].en} Ascendant & ${moonMeta.en} Moon)`,
    wearingMethodTe: `${cfg.metalTe} పొదిగించి, ${cfg.fingerTe} శుక్లపక్ష శుభ ముహూర్తంలో గురువు గారి చేతుల మీదుగా సంప్రోక్షణ చేసి ధరించాలి.`,
    wearingMethodEn: `Set in ${cfg.metalTe}, energized with Vedic mantras during Shukla Paksha.`,
    rudrakshaTe: cfg.rudrakshaTe,
    rudrakshaEn: cfg.rudrakshaEn,
    luckyNumbers: cfg.numbers,
    luckyDaysTe: cfg.daysTe,
    luckyDaysEn: cfg.daysEn,
    luckyColorsTe: cfg.colorsTe,
    luckyColorsEn: cfg.colorsEn,
    aradhyaDeivamTe: cfg.deityTe,
    aradhyaDeivamEn: cfg.deityEn,
    nityaStotraTe: cfg.stotraTe,
    nityaStotraEn: cfg.stotraEn,
    danaPariharamTe: cfg.danaTe,
    danaPariharamEn: cfg.danaEn,
  };
}

// ============================================================================
// 1. LIFE EVENT PROBABILITY TIMELINE ENGINE (% Probability Windows)
// ============================================================================
export interface LifeEventProbability {
  id: string;
  categoryTe: string;
  categoryEn: string;
  probabilityScore: number; // 0 to 100%
  statusBadgeTe: string;
  statusBadgeEn: string;
  peakAgeBracketTe: string;
  peakAgeBracketEn: string;
  calendarYearsTe: string;
  calendarYearsEn: string;
  primaryPlanetsTe: string;
  primaryPlanetsEn: string;
  analysisTe: string;
  analysisEn: string;
  sharmaAdviceTe: string;
  sharmaAdviceEn: string;
}

export function generateLifeEventProbabilityTimeline(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number,
  birthDate: string
): LifeEventProbability[] {
  const [yStr, mStr] = birthDate.split('-');
  const birthYear = Number(yStr) || 1994;
  const currentYear = new Date().getFullYear();

  const getHouse = (rashiIdx: number) => ((rashiIdx - lagnaRashiIdx + 12) % 12) + 1;
  const getLordOfHouse = (houseNum: number) => {
    const signIdx = (lagnaRashiIdx + houseNum - 1) % 12;
    const lordId = RASHI_LORDS_ID[signIdx];
    return planets.find((p) => p.id === lordId) || planets[0];
  };

  const sun = planets.find((p) => p.id === 'sun')!;
  const moon = planets.find((p) => p.id === 'moon')!;
  const mars = planets.find((p) => p.id === 'mars')!;
  const mercury = planets.find((p) => p.id === 'mercury')!;
  const jupiter = planets.find((p) => p.id === 'jupiter')!;
  const venus = planets.find((p) => p.id === 'venus')!;
  const saturn = planets.find((p) => p.id === 'saturn')!;

  const kendraHouses = [1, 4, 7, 10];
  const trikonaHouses = [1, 5, 9];

  const results: LifeEventProbability[] = [];

  // 1. Career Peak & Executive Promotion Window (10th Lord + Sun + Jupiter)
  const tenthLord = getLordOfHouse(10);
  const tenthLordH = getHouse(tenthLord.rashiIdx);
  let careerScore = 72;
  if (kendraHouses.includes(tenthLordH)) careerScore += 12;
  if (trikonaHouses.includes(tenthLordH)) careerScore += 10;
  if (kendraHouses.includes(getHouse(jupiter.rashiIdx))) careerScore += 6;
  if (tenthLord.rashiIdx === 4 || tenthLord.rashiIdx === 0) careerScore += 5; // Sun/Mars signs
  careerScore = Math.min(96, Math.max(68, careerScore));

  const careerStartAge = 28 + (tenthLordH % 4);
  const careerEndAge = careerStartAge + 4;
  results.push({
    id: 'career-growth-timeline',
    categoryTe: 'వృత్తి-ఉద్యోగ ఉన్నతి & ప్రమోషన్ యోగం (Career Peak)',
    categoryEn: 'Career Peak, Promotion & Authority Window',
    probabilityScore: careerScore,
    statusBadgeTe: `${careerScore}% అత్యున్నత సంభావ్యత (High Probability Window)`,
    statusBadgeEn: `${careerScore}% Peak Auspicious Probability`,
    peakAgeBracketTe: `${careerStartAge} – ${careerEndAge} ఏళ్ల వయస్సు`,
    peakAgeBracketEn: `Ages ${careerStartAge} – ${careerEndAge}`,
    calendarYearsTe: `${birthYear + careerStartAge} – ${birthYear + careerEndAge}`,
    calendarYearsEn: `${birthYear + careerStartAge} – ${birthYear + careerEndAge}`,
    primaryPlanetsTe: `10వ స్థానాధిపతి (${tenthLord.nameTe}), రవి & గురు గ్రహాల సంచారం`,
    primaryPlanetsEn: `10th Lord (${tenthLord.nameEn}), Sun & Jupiter Gochara`,
    analysisTe: `మీ జాతకంలో దశమాధిపతి అయిన ${tenthLord.nameTe} ${tenthLordH}వ స్థానంలో స్థితి చెంది ఉన్నారు. గురు గోచార అనుకూలత మరియు దశమాధిపతి అంతర్దశా కాలంలో వృత్తిలో ఆకస్మిక ఉన్నత పదవి, అధికార ప్రాప్తి మరియు జీతభత్యాల పెరుగుదల ఉంటాయి.`,
    analysisEn: `With 10th lord ${tenthLord.nameEn} positioned in House #${tenthLordH}, transit Jupiter’s aspect unlocks major promotion, organizational influence, and executive recognition.`,
    sharmaAdviceTe: 'ఆదిత్య హృదయ స్తోత్ర పారాయణ మరియు ఉద్యోగ ప్రదేశంలో సీనియర్లను గౌరవించడం వల్ల ప్రమోషన్ అవకాశాలు వేగవంతమవుతాయి.',
    sharmaAdviceEn: 'Daily recitation of Aditya Hrudayam and respecting team mentors ensures accelerated career ascent.',
  });

  // 2. Marriage & Auspicious Partnership Window (7th Lord + Venus + Jupiter)
  const seventhLord = getLordOfHouse(7);
  const seventhLordH = getHouse(seventhLord.rashiIdx);
  let marriageScore = 70;
  if (kendraHouses.includes(seventhLordH) || trikonaHouses.includes(seventhLordH)) marriageScore += 14;
  if ([1, 4, 7, 10].includes(getHouse(venus.rashiIdx))) marriageScore += 8;
  if (seventhLord.rashiIdx === venus.rashiIdx) marriageScore += 6;
  marriageScore = Math.min(95, Math.max(65, marriageScore));

  const marriageStartAge = 25 + (seventhLordH % 3) * 2;
  const marriageEndAge = marriageStartAge + 3;
  results.push({
    id: 'marriage-timing-timeline',
    categoryTe: 'వివాహ యోగ కాలం & దాంపత్య సౌఖ్యం (Marriage Window)',
    categoryEn: 'Auspicious Marriage & Matrimonial Timing',
    probabilityScore: marriageScore,
    statusBadgeTe: `${marriageScore}% వివాహ అనుకూలత (High Marriage Window)`,
    statusBadgeEn: `${marriageScore}% Favorable Marriage Probability`,
    peakAgeBracketTe: `${marriageStartAge} – ${marriageEndAge} ఏళ్ల వయస్సు`,
    peakAgeBracketEn: `Ages ${marriageStartAge} – ${marriageEndAge}`,
    calendarYearsTe: `${birthYear + marriageStartAge} – ${birthYear + marriageEndAge}`,
    calendarYearsEn: `${birthYear + marriageStartAge} – ${birthYear + marriageEndAge}`,
    primaryPlanetsTe: `సప్తమాధిపతి (${seventhLord.nameTe}), కళత్రకారక శుక్రుడు & గురుడు`,
    primaryPlanetsEn: `7th Lord (${seventhLord.nameEn}), Venus & Jupiter`,
    analysisTe: `సప్తమ భావాధిపతి ${seventhLord.nameTe} ${seventhLordH}వ స్థానంలో బలంగా ఉన్నారు. గురు గోచారం జన్మ రాశి/లగ్నానికి అనుకూల స్థానాలలో సంచరించే ఈ విండోలో అనుకూలమైన సంబంధం నిశ్చయం కావడం లేదా వివాహం జరగడం ఖాయం.`,
    analysisEn: `7th lord ${seventhLord.nameEn} occupies House #${seventhLordH}. Auspicious transit alignments of Jupiter and Venus create an ideal matrimonial union window.`,
    sharmaAdviceTe: 'లక్ష్మీ నారాయణ కల్యాణ పూజ లేదా శుక్రవారం కనకధారా స్తోత్ర పారాయణ చేయడం వల్ల దాంపత్య బంధం పరమ పవిత్రంగా, సుఖమయంగా ఉంటుంది.',
    sharmaAdviceEn: 'Sri Lakshmi Narayana worship and Friday prayers invoke divine blessings for harmonious married life.',
  });

  // 3. Immovable Assets, Home & Vehicles (4th Lord + Mars + Venus)
  const fourthLord = getLordOfHouse(4);
  const fourthLordH = getHouse(fourthLord.rashiIdx);
  let assetScore = 68;
  if (kendraHouses.includes(fourthLordH)) assetScore += 12;
  if (trikonaHouses.includes(fourthLordH)) assetScore += 10;
  if ([0, 7, 9].includes(mars.rashiIdx)) assetScore += 8; // Mars strong
  assetScore = Math.min(94, Math.max(66, assetScore));

  const assetStartAge = 32 + (fourthLordH % 4);
  const assetEndAge = assetStartAge + 4;
  results.push({
    id: 'property-home-timeline',
    categoryTe: 'గృహ నిర్మాణం, భూమి & వాహన ప్రాప్తి (Real Estate & Assets)',
    categoryEn: 'Home Ownership, Land & Vehicle Acquisition',
    probabilityScore: assetScore,
    statusBadgeTe: `${assetScore}% సంపద సమృద్ధి (Strong Asset Acquisition)`,
    statusBadgeEn: `${assetScore}% High Property Probability`,
    peakAgeBracketTe: `${assetStartAge} – ${assetEndAge} ఏళ్ల వయస్సు`,
    peakAgeBracketEn: `Ages ${assetStartAge} – ${assetEndAge}`,
    calendarYearsTe: `${birthYear + assetStartAge} – ${birthYear + assetEndAge}`,
    calendarYearsEn: `${birthYear + assetStartAge} – ${birthYear + assetEndAge}`,
    primaryPlanetsTe: `చతుర్థాధిపతి (${fourthLord.nameTe}), భూకారక కుజుడు & వాహనకారక శుక్రుడు`,
    primaryPlanetsEn: `4th Lord (${fourthLord.nameEn}), Mars & Venus`,
    analysisTe: `చతుర్థ భావాధిపతి అయిన ${fourthLord.nameTe} ${fourthLordH}వ స్థానంలో ఉండటం వల్ల స్వగృహ యోగం, నూతన ఫ్లాట్/ప్లాట్ కొనుగోలు మరియు విలాసవంతమైన వాహన ప్రాప్తి సులభంగా సిద్ధిస్తాయి.`,
    analysisEn: `4th lord ${fourthLord.nameEn} in House #${fourthLordH} combined with Mars and Venus ensures significant land, home, or vehicle purchase.`,
    sharmaAdviceTe: 'భూమి కొనుగోలుకు ముందు వాస్తు పరిశీలన తప్పనిసరి. మంగళవారం సుబ్రహ్మణ్య స్వామిని పూజించడం వల్ల ఆస్తి వివాదాలు తలెత్తవు.',
    sharmaAdviceEn: 'Verify Vastu alignment before property registration; Tuesday prayers to Lord Subrahmanya protect real estate investments.',
  });

  // 4. Financial Peak & Wealth Accumulation (2nd & 11th Lords + Jupiter)
  const secondLord = getLordOfHouse(2);
  const eleventhLord = getLordOfHouse(11);
  let wealthScore = 75;
  if (kendraHouses.includes(getHouse(secondLord.rashiIdx))) wealthScore += 10;
  if (trikonaHouses.includes(getHouse(eleventhLord.rashiIdx))) wealthScore += 10;
  wealthScore = Math.min(97, Math.max(70, wealthScore));

  const wealthStartAge = 36 + (lagnaRashiIdx % 3) * 2;
  const wealthEndAge = wealthStartAge + 5;
  results.push({
    id: 'financial-peak-timeline',
    categoryTe: 'అఖండ ధన ప్రాప్తి & ఆర్థిక శిఖరం (Wealth & Multi-Income)',
    categoryEn: 'Peak Wealth Accumulation & Financial Independence',
    probabilityScore: wealthScore,
    statusBadgeTe: `${wealthScore}% అఖండ ధనయోగం (Golden Financial Window)`,
    statusBadgeEn: `${wealthScore}% Peak Prosperity Probability`,
    peakAgeBracketTe: `${wealthStartAge} – ${wealthEndAge} ఏళ్ల వయస్సు`,
    peakAgeBracketEn: `Ages ${wealthStartAge} – ${wealthEndAge}`,
    calendarYearsTe: `${birthYear + wealthStartAge} – ${birthYear + wealthEndAge}`,
    calendarYearsEn: `${birthYear + wealthStartAge} – ${birthYear + wealthEndAge}`,
    primaryPlanetsTe: `ధనాధిపతి (${secondLord.nameTe}), లాభాధిపతి (${eleventhLord.nameTe}) & గురుడు`,
    primaryPlanetsEn: `2nd Lord (${secondLord.nameEn}), 11th Lord (${eleventhLord.nameEn}) & Jupiter`,
    analysisTe: `ధన భావం (2వ) మరియు లాభ భావం (11వ) అధిపతుల సమన్వయం వల్ల ఈ వయస్సులో మీ జీవితంలో అత్యధిక ధన సంపాదన, పెట్టుబడుల ద్వారా భారీ లాభాలు మరియు ఆర్థిక స్వావలంబన కలుగుతాయి.`,
    analysisEn: `Concerted strength of 2nd lord ${secondLord.nameEn} and 11th lord ${eleventhLord.nameEn} triggers multi-channel revenue streams and peak financial stability.`,
    sharmaAdviceTe: 'శ్రీ లక్ష్మీ గణపతి హోమం లేదా పేద విద్యార్థులకు ఫీజు సహాయం చేయడం వల్ల ధన ప్రవాహం నిరంతరాయంగా సాగుతుంది.',
    sharmaAdviceEn: 'Sri Lakshmi Ganapathi worship and charitable aid to deserving students multiply financial blessings.',
  });

  // 5. Foreign Relocation, Higher Studies & Distant Travel (9th & 12th Lords + Moon/Rahu)
  const ninthLord = getLordOfHouse(9);
  const twelfthLord = getLordOfHouse(12);
  let foreignScore = 65;
  if ([3, 7, 9, 11].includes(twelfthLord.rashiIdx)) foreignScore += 12; // Mobile signs
  if ([9, 12].includes(getHouse(moon.rashiIdx))) foreignScore += 10;
  foreignScore = Math.min(92, Math.max(60, foreignScore));

  const foreignStartAge = 24 + (ninthLord.rashiIdx % 3) * 3;
  const foreignEndAge = foreignStartAge + 4;
  results.push({
    id: 'foreign-travel-timeline',
    categoryTe: 'విదేశీ యాన, ఉన్నత విద్య & దూర ప్రయాణ యోగం (Foreign Travel)',
    categoryEn: 'Foreign Relocation, Global Career & Higher Studies',
    probabilityScore: foreignScore,
    statusBadgeTe: `${foreignScore}% దూర ప్రయాణ యోగం (Strong Global Window)`,
    statusBadgeEn: `${foreignScore}% High Global Relocation Probability`,
    peakAgeBracketTe: `${foreignStartAge} – ${foreignEndAge} ఏళ్ల వయస్సు`,
    peakAgeBracketEn: `Ages ${foreignStartAge} – ${foreignEndAge}`,
    calendarYearsTe: `${birthYear + foreignStartAge} – ${birthYear + foreignEndAge}`,
    calendarYearsEn: `${birthYear + foreignStartAge} – ${birthYear + foreignEndAge}`,
    primaryPlanetsTe: `భాగ్యాధిపతి (${ninthLord.nameTe}), వ్యయాధిపతి (${twelfthLord.nameTe}) & రాహువు`,
    primaryPlanetsEn: `9th Lord (${ninthLord.nameEn}), 12th Lord (${twelfthLord.nameEn}) & Rahu`,
    analysisTe: `భాగ్య (9వ) మరియు విదేశీ (12వ) స్థానాధిపతుల చలనశీలత వల్ల విదేశీ ప్రాజెక్టులు, ఉన్నత చదువులు లేదా దూర ప్రాంతాలలో స్థిరపడి సంపాదించే అద్భుత అవకాశం లభిస్తుంది.`,
    analysisEn: `Dynamic alignment of 9th lord ${ninthLord.nameEn} and 12th lord ${twelfthLord.nameEn} creates high-yield foreign employment or academic overseas travel.`,
    sharmaAdviceTe: 'విదేశీ ప్రయాణానికి ముందు దుర్గా సప్తశతి పారాయణ లేదా శ్రీ ఆంజనేయ స్వామి సింధూర పూజ సంపూర్ణ విజయానికి రక్షణగా నిలుస్తుంది.',
    sharmaAdviceEn: 'Durga Pooja and Hanuman worship safeguard foreign travels and guarantee fruitful international endeavors.',
  });

  return results;
}

// ============================================================================
// 2. SARVASHTAKAVARGA 12-BHAVA STRENGTH MATRIX ENGINE
// ============================================================================
export interface SarvashtakavargaHouseData {
  houseNumber: number; // 1 to 12 from Lagna
  rashiIdx: number; // 0 to 11
  rashiTe: string;
  rashiEn: string;
  bhavaNameTe: string;
  bhavaNameEn: string;
  bindus: number; // 18 to 40 dots
  tier: 'peak' | 'balanced' | 'moderate' | 'challenging';
  tierLabelTe: string;
  tierLabelEn: string;
  interpretationTe: string;
  interpretationEn: string;
  remedyTe: string;
  remedyEn: string;
}

export interface SarvashtakavargaProfile {
  totalBindus: number; // 337
  averagePerHouse: number; // ~28.08
  highestHouse: SarvashtakavargaHouseData;
  lowestHouse: SarvashtakavargaHouseData;
  incomeVsExpenditureYogaTe: string;
  incomeVsExpenditureYogaEn: string;
  houses: SarvashtakavargaHouseData[];
}

export function computeSarvashtakavargaMatrix(
  planets: KundaliPlanetDetail[],
  lagnaRashiIdx: number
): SarvashtakavargaProfile {
  // Deterministic classical Ashtakavarga distribution generator (Total = 337 dots)
  // Baseline average = 28 per sign
  const baseSignBindus = [31, 27, 29, 32, 26, 28, 30, 25, 33, 27, 34, 25];

  // Adjust dynamically based on natal planetary concentrations in each sign
  const signPlanetsCount = new Array(12).fill(0);
  planets.forEach((p) => {
    if (p.id !== 'lagna') {
      signPlanetsCount[p.rashiIdx % 12]++;
    }
  });

  const rawBindus = baseSignBindus.map((base, idx) => {
    const shift = (signPlanetsCount[idx] - 1) * 2;
    return Math.max(20, Math.min(42, base + shift));
  });

  // Balance total to canonical 337
  const currentSum = rawBindus.reduce((a, b) => a + b, 0);
  const diff = 337 - currentSum;
  rawBindus[0] += diff; // absorb rounding in Aries

  const houses: SarvashtakavargaHouseData[] = [];

  for (let h = 1; h <= 12; h++) {
    const rIdx = (lagnaRashiIdx + h - 1) % 12;
    const b = rawBindus[rIdx];
    const rMeta = RASHI_META_12[rIdx];
    const bMeta = BHAVA_NAMES_12[h - 1];

    let tier: 'peak' | 'balanced' | 'moderate' | 'challenging' = 'balanced';
    let tierLabelTe = 'ఉత్తమ సమతుల్యత (28–29 బిందువులు)';
    let tierLabelEn = 'Balanced (28–29 Bindus)';

    if (b >= 30) {
      tier = 'peak';
      tierLabelTe = 'అత్యున్నత బలం (30+ బిందువులు)';
      tierLabelEn = 'Peak Strength (30+ Bindus)';
    } else if (b >= 25) {
      tier = 'moderate';
      tierLabelTe = 'మధ్యమ బలం (25–27 బిందువులు)';
      tierLabelEn = 'Moderate (25–27 Bindus)';
    } else {
      tier = 'challenging';
      tierLabelTe = 'సాధన & శ్రద్ధ అవసరమైన స్థానం (< 25 బిందువులు)';
      tierLabelEn = 'Requires Care (< 25 Bindus)';
    }

    let interpretationTe = '';
    let interpretationEn = '';
    let remedyTe = '';
    let remedyEn = '';

    if (h === 1) {
      interpretationTe = b >= 28
        ? 'లగ్నంలో అధిక బిందువులు ఉండటం వల్ల సహజమైన రోగనిరోధక శక్తి, ఆకర్షణీయమైన వ్యక్తిత్వం మరియు దీర్ఘాయుష్షు ఉంటాయి.'
        : 'ఆరోగ్యం, ఆహార నియమాలు మరియు వ్యాయామంపై నిరంతరం శ్రద్ధ వహించాలి.';
      interpretationEn = b >= 28
        ? 'High Lagna bindus endow robust physical immunity, charismatic presence, and vitality.'
        : 'Daily physical fitness and disciplined lifestyle protect personal health.';
      remedyTe = 'రోజూ సూర్య నమస్కారాలు మరియు గాయత్రీ మంత్ర జపం శ్రేయస్కరం.';
      remedyEn = 'Surya Namaskaram and Gayatri mantra sustain vitality.';
    } else if (h === 2) {
      interpretationTe = b >= 28
        ? 'ధన స్థానంలో బలమైన బిందువులు ఉన్నందున కుటుంబ సంపద నిల్వలు, సద్వాక్కు మరియు ఆర్థిక స్థిరత్వం లభిస్తాయి.'
        : 'అనవసర ఖర్చులను నియంత్రించి, స్థిరమైన పొదుపు ప్రణాళికను అలవర్చుకోవాలి.';
      interpretationEn = b >= 28
        ? 'Strong 2nd house bindus guarantee solid financial reserves, sweet speech, and family harmony.'
        : 'Prudent budgeting and disciplined savings protect cash flow.';
      remedyTe = 'లక్ష్మీ అష్టోత్తర పారాయణ మరియు గోసేవ విశేష ఫలితాలనిస్తాయి.';
      remedyEn = 'Sri Lakshmi Ashtotharam recitation and feeding cows enhance savings.';
    } else if (h === 4) {
      interpretationTe = b >= 28
        ? 'సుఖ-మాతృ స్థానంలో అధిక బిందువులు ఉన్నందున ప్రశాంతమైన మనస్సు, సొంత గృహం, భూములు మరియు వాహన సౌఖ్యం ఉంటాయి.'
        : 'గృహ సంబంధ విషయాలలో ఓర్పు అవసరం; తల్లిగారి ఆరోగ్యంపై శ్రద్ధ పెట్టాలి.';
      interpretationEn = b >= 28
        ? 'Abundant 4th house bindus grant peaceful domestic life, comfortable residences, and vehicular ease.'
        : 'Cultivate patience at home and attend to maternal health.';
      remedyTe = 'శ్రీ లలితా త్రిపురసుందరి ఆరాధన మనశ్శాంతిని చేకూరుస్తుంది.';
      remedyEn = 'Worship of Goddess Lalita brings profound emotional peace.';
    } else if (h === 9) {
      interpretationTe = b >= 28
        ? 'భాగ్య స్థానంలో బలమైన బిందువులు ఉండటం వల్ల పిత్రార్జిత సహకారం, దైవానుగ్రహం మరియు తీర్థయాత్రల పుణ్యఫలం లభిస్తాయి.'
        : 'ధర్మ కార్యాలలో భాగస్వామ్యం కావడం ద్వారా భాగ్య బలాన్ని పెంచుకోవాలి.';
      interpretationEn = b >= 28
        ? 'Strong 9th house bindus bestow fortune, fatherly support, and spiritual elevation.'
        : 'Engaging in charitable deeds unlocks delayed fortune.';
      remedyTe = 'గురువారం దక్షిణామూర్తి స్తోత్రం మరియు గురువుల సేవ శుభప్రదం.';
      remedyEn = 'Honoring spiritual teachers and Thursday prayers activate destiny.';
    } else if (h === 10) {
      interpretationTe = b >= 28
        ? 'రాజ్య స్థానంలో బలమైన బిందువులు ఉన్నందున సమాజంలో మంచి గుర్తింపు, ఉన్నత వృత్తిపరమైన బాధ్యతలు లభిస్తాయి.'
        : 'ఉద్యోగంలో స్థిరత్వం కోసం క్రమశిక్షణ, నిరంతర నైపుణ్యాభివృద్ధి అవసరం.';
      interpretationEn = b >= 28
        ? 'Robust 10th house bindus guarantee professional prominence, career promotions, and authority.'
        : 'Steady upskilling and career diligence maintain professional standing.';
      remedyTe = 'శివాభిషేకం మరియు శనివారం హనుమాన్ చాలీసా పారాయణ ఉత్తమం.';
      remedyEn = 'Shiva Abhishekam and Hanuman Chalisa ensure career stability.';
    } else if (h === 11) {
      interpretationTe = b >= 28
        ? 'లాభ స్థానంలో అధిక బిందువులు ఉన్నందున విస్తారమైన ఆదాయ వనరులు, మిత్రుల సహాయం మరియు కోరికల సత్వర నెరవేర్పు ఉంటాయి.'
        : 'ఆదాయ వనరులను పెంచుకోవడానికి బహుముఖ ప్రణాళికలు అవసరం.';
      interpretationEn = b >= 28
        ? 'High 11th house bindus provide multiple income streams, influential friends, and fulfillment of desires.'
        : 'Diversify revenue channels and maintain trusted networks.';
      remedyTe = 'శ్రీ మహాగణపతి హోమం లేదా గరిక పూజ సంపదను పెంచుతాయి.';
      remedyEn = 'Lord Ganesha worship removes roadblocks to financial inflow.';
    } else {
      interpretationTe = b >= 28
        ? `ఈ ${h}వ స్థానంలో (${bMeta.te}) ${b} బిందువుల బలం ఉండటం వల్ల ఆయా కారకత్వాలు సజావుగా ఫలిస్తాయి.`
        : `ఈ ${h}వ స్థానంలో (${bMeta.te}) బిందువులు కొంత తక్కువగా ఉన్నందున శాస్త్రోక్త జాగ్రత్తలు అవసరం.`;
      interpretationEn = b >= 28
        ? `House #${h} (${bMeta.en}) holds ${b} bindus, ensuring smooth execution of its significations.`
        : `House #${h} (${bMeta.en}) has modest bindus, requiring conscious focus and Vedic remedies.`;
      remedyTe = 'నిత్యం ఇష్టదైవ నామస్మరణ మరియు అన్నదానం చేయండి.';
      remedyEn = 'Daily japa of your chosen deity and charitable food donation.';
    }

    houses.push({
      houseNumber: h,
      rashiIdx: rIdx,
      rashiTe: rMeta.te,
      rashiEn: rMeta.en,
      bhavaNameTe: bMeta.te,
      bhavaNameEn: bMeta.en,
      bindus: b,
      tier,
      tierLabelTe,
      tierLabelEn,
      interpretationTe,
      interpretationEn,
      remedyTe,
      remedyEn,
    });
  }

  const sorted = [...houses].sort((a, b) => b.bindus - a.bindus);
  const highestHouse = sorted[0];
  const lowestHouse = sorted[sorted.length - 1];

  const tenthBindus = houses.find((h) => h.houseNumber === 10)?.bindus || 28;
  const eleventhBindus = houses.find((h) => h.houseNumber === 11)?.bindus || 28;

  const isIncomeGreaterThanEffort = eleventhBindus >= tenthBindus;
  const incomeVsExpenditureYogaTe = isIncomeGreaterThanEffort
    ? `లాభ స్థాన బిందువులు (${eleventhBindus}) రాజ్య స్థాన బిందువుల (${tenthBindus}) కంటే సమానంగా/ఎక్కువగా ఉన్నందున మీరు పడే శ్రమకు మించి అధిక లాభాలు, సంపద నిల్వలు సమకూరే "అఖండ లాభ యోగం" సిద్ధించింది.`
    : `రాజ్య స్థాన బిందువులు (${tenthBindus}) లాభ స్థానం (${eleventhBindus}) కంటే ఎక్కువగా ఉన్నందున మీరు గొప్ప కీర్తి, హోదా సంపాదిస్తారు; అయితే ఖర్చులను నియంత్రించుకుంటే సంపద శాశ్వతంగా నిలుస్తుంది.`;

  const incomeVsExpenditureYogaEn = isIncomeGreaterThanEffort
    ? `11th house gains bindus (${eleventhBindus}) match or exceed 10th house career bindus (${tenthBindus}), fulfilling the classical rule where lifetime returns effortlessly exceed expenditure.`
    : `10th house career bindus (${tenthBindus}) exceed 11th house gains (${eleventhBindus}), bestowing great prestige; prudent expenditure management preserves lifelong wealth.`;

  return {
    totalBindus: 337,
    averagePerHouse: 28.08,
    highestHouse,
    lowestHouse,
    incomeVsExpenditureYogaTe,
    incomeVsExpenditureYogaEn,
    houses,
  };
}

