import React, { useState, useMemo, Suspense, lazy } from 'react';
import {
  Heart,
  Search,
  Sparkles,
  Calendar,
  ShieldAlert,
  BookOpen,
  MessageCircle,
  ArrowRight,
  Star,
  CheckCircle2,
  Flame,
  Compass,
  Baby,
  ScrollText,
} from 'lucide-react';
import { RashiCompatibilityTool } from './RashiCompatibilityTool';
import { WEEK_DATA } from '../data/panchangamData';
import { useLanguage } from '../context/LanguageContext';
import { RashiGlyph } from './RashiGlyph';

const JanmaKundaliGenerator = lazy(() =>
  import('./JanmaKundaliGenerator').then((m) => ({ default: m.JanmaKundaliGenerator }))
);
const NakshatraBabyNames = lazy(() =>
  import('./NakshatraBabyNames').then((m) => ({ default: m.NakshatraBabyNames }))
);
const VastuChakraGuide = lazy(() =>
  import('./VastuChakraGuide').then((m) => ({ default: m.VastuChakraGuide }))
);
const ShaniDoshaChecker = lazy(() =>
  import('./ShaniDoshaChecker').then((m) => ({ default: m.ShaniDoshaChecker }))
);

export type HubSectionId =
  | 'pontana'
  | 'kundali'
  | 'akshara'
  | 'babynames'
  | 'vastu'
  | 'ugadi'
  | 'muhurtham'
  | 'dosha';

interface VedicAstrologyHubProps {
  initialSection?: HubSectionId;
  onOpenBooking: () => void;
}

interface NakshatraSyllableRow {
  index: number;
  nakshatraTe: string;
  nakshatraEn: string;
  syllablesTe: string;
  syllablesEn: string;
  rashiId: string;
  rashiTe: string;
  rashiEn: string;
  nakshatraLord: string;
  rashiLord: string;
  ganam: string;
  nadi: string;
  rajju: string;
}

const NAKSHATRA_SYLLABLE_TABLE: NakshatraSyllableRow[] = [
  { index: 1, nakshatraTe: 'అశ్విని', nakshatraEn: 'Ashwini', syllablesTe: 'చూ, చే, చో, లా', syllablesEn: 'Chu, Che, Cho, La', rashiId: 'mesham', rashiTe: 'మేషం', rashiEn: 'Aries', nakshatraLord: 'కేతువు (Ketu)', rashiLord: 'కుజుడు (Mars)', ganam: 'దేవ గణం', nadi: 'ఆది నాడి', rajju: 'పాద రజ్జు' },
  { index: 2, nakshatraTe: 'భరణి', nakshatraEn: 'Bharani', syllablesTe: 'లీ, లూ, లే, లో', syllablesEn: 'Li, Lu, Le, Lo', rashiId: 'mesham', rashiTe: 'మేషం', rashiEn: 'Aries', nakshatraLord: 'శుక్రుడు (Venus)', rashiLord: 'కుజుడు (Mars)', ganam: 'మనుష్య గణం', nadi: 'మధ్య నాడి', rajju: 'ఊరు రజ్జు' },
  { index: 3, nakshatraTe: 'కృత్తిక', nakshatraEn: 'Krittika', syllablesTe: 'ఆ (మేషం) | ఈ, ఊ, ఏ (వృషభం)', syllablesEn: 'A, Ee, U, E', rashiId: 'vrushabham', rashiTe: 'మేషం (1వ పాదం) / వృషభం (2,3,4)', rashiEn: 'Aries / Taurus', nakshatraLord: 'సూర్యుడు (Sun)', rashiLord: 'కుజుడు / శుక్రుడు', ganam: 'రాక్షస గణం', nadi: 'అంత్య నాడి', rajju: 'నాభి రజ్జు' },
  { index: 4, nakshatraTe: 'రోహిణి', nakshatraEn: 'Rohini', syllablesTe: 'ఓ, వా, వీ, వూ', syllablesEn: 'O, Va, Vi, Vu', rashiId: 'vrushabham', rashiTe: 'వృషభం', rashiEn: 'Taurus', nakshatraLord: 'చంద్రుడు (Moon)', rashiLord: 'శుక్రుడు (Venus)', ganam: 'మనుష్య గణం', nadi: 'అంత్య నాడి', rajju: 'కంఠ రజ్జు' },
  { index: 5, nakshatraTe: 'మృగశిర', nakshatraEn: 'Mrigashira', syllablesTe: 'వే, వో (వృషభం) | కా, కీ (మిథునం)', syllablesEn: 'Ve, Vo, Ka, Ki', rashiId: 'mithunam', rashiTe: 'వృషభం (1,2) / మిథునం (3,4)', rashiEn: 'Taurus / Gemini', nakshatraLord: 'కుజుడు (Mars)', rashiLord: 'శుక్రుడు / బుధుడు', ganam: 'దేవ గణం', nadi: 'మధ్య నాడి', rajju: 'శిరో రజ్జు' },
  { index: 6, nakshatraTe: 'ఆరుద్ర', nakshatraEn: 'Ardra', syllablesTe: 'కూ, ఖం, ఙ, ఛా', syllablesEn: 'Ku, Gha, Nga, Cha', rashiId: 'mithunam', rashiTe: 'మిథునం', rashiEn: 'Gemini', nakshatraLord: 'రాహువు (Rahu)', rashiLord: 'బుధుడు (Mercury)', ganam: 'మనుష్య గణం', nadi: 'ఆది నాడి', rajju: 'కంఠ రజ్జు' },
  { index: 7, nakshatraTe: 'పునర్వసు', nakshatraEn: 'Punarvasu', syllablesTe: 'కే, కో, హా (మిథునం) | హీ (కర్కాటకం)', syllablesEn: 'Ke, Ko, Ha, Hi', rashiId: 'karkatakam', rashiTe: 'మిథునం (1,2,3) / కర్కాటకం (4)', rashiEn: 'Gemini / Cancer', nakshatraLord: 'గురుడు (Jupiter)', rashiLord: 'బుధుడు / చంద్రుడు', ganam: 'దేవ గణం', nadi: 'ఆది నాడి', rajju: 'నాభి రజ్జు' },
  { index: 8, nakshatraTe: 'పుష్యమి', nakshatraEn: 'Pushyami', syllablesTe: 'హూ, హే, హో, డా', syllablesEn: 'Hu, He, Ho, Da', rashiId: 'karkatakam', rashiTe: 'కర్కాటకం', rashiEn: 'Cancer', nakshatraLord: 'శని (Saturn)', rashiLord: 'చంద్రుడు (Moon)', ganam: 'దేవ గణం', nadi: 'మధ్య నాడి', rajju: 'ఊరు రజ్జు' },
  { index: 9, nakshatraTe: 'ఆశ్లేష', nakshatraEn: 'Ashlesha', syllablesTe: 'డీ, డూ, డే, డో', syllablesEn: 'Di, Du, De, Do', rashiId: 'karkatakam', rashiTe: 'కర్కాటకం', rashiEn: 'Cancer', nakshatraLord: 'బుధుడు (Mercury)', rashiLord: 'చంద్రుడు (Moon)', ganam: 'రాక్షస గణం', nadi: 'అంత్య నాడి', rajju: 'పాద రజ్జు' },
  { index: 10, nakshatraTe: 'మఖ', nakshatraEn: 'Magha', syllablesTe: 'మా, మీ, మూ, మే', syllablesEn: 'Ma, Mi, Mu, Me', rashiId: 'simham', rashiTe: 'సింహం', rashiEn: 'Leo', nakshatraLord: 'కేతువు (Ketu)', rashiLord: 'సూర్యుడు (Sun)', ganam: 'రాక్షస గణం', nadi: 'అంత్య నాడి', rajju: 'పాద రజ్జు' },
  { index: 11, nakshatraTe: 'పుబ్బ (పూర్వ ఫల్గుణి)', nakshatraEn: 'Pubba', syllablesTe: 'మో, టా, టీ, టూ', syllablesEn: 'Mo, Ta, Ti, Tu', rashiId: 'simham', rashiTe: 'సింహం', rashiEn: 'Leo', nakshatraLord: 'శుక్రుడు (Venus)', rashiLord: 'సూర్యుడు (Sun)', ganam: 'మనుష్య గణం', nadi: 'మధ్య నాడి', rajju: 'ఊరు రజ్జు' },
  { index: 12, nakshatraTe: 'ఉత్తర (ఉత్తర ఫల్గుణి)', nakshatraEn: 'Uttara', syllablesTe: 'టే (సింహం) | టో, పా, పీ (కన్య)', syllablesEn: 'Te, To, Pa, Pi', rashiId: 'kanya', rashiTe: 'సింహం (1) / కన్య (2,3,4)', rashiEn: 'Leo / Virgo', nakshatraLord: 'సూర్యుడు (Sun)', rashiLord: 'సూర్యుడు / బుధుడు', ganam: 'మనుష్య గణం', nadi: 'ఆది నాడి', rajju: 'నాభి రజ్జు' },
  { index: 13, nakshatraTe: 'హస్త', nakshatraEn: 'Hasta', syllablesTe: 'పూ, షం, ణా, ఠా', syllablesEn: 'Pu, Sha, Na, Tha', rashiId: 'kanya', rashiTe: 'కన్య', rashiEn: 'Virgo', nakshatraLord: 'చంద్రుడు (Moon)', rashiLord: 'బుధుడు (Mercury)', ganam: 'దేవ గణం', nadi: 'ఆది నాడి', rajju: 'కంఠ రజ్జు' },
  { index: 14, nakshatraTe: 'చిత్త', nakshatraEn: 'Chitta', syllablesTe: 'పే, పో (కన్య) | రా, రీ (తుల)', syllablesEn: 'Pe, Po, Ra, Ri', rashiId: 'tula', rashiTe: 'కన్య (1,2) / తుల (3,4)', rashiEn: 'Virgo / Libra', nakshatraLord: 'కుజుడు (Mars)', rashiLord: 'బుధుడు / శుక్రుడు', ganam: 'రాక్షస గణం', nadi: 'మధ్య నాడి', rajju: 'శిరో రజ్జు' },
  { index: 15, nakshatraTe: 'స్వాతి', nakshatraEn: 'Swati', syllablesTe: 'రూ, రే, రో, తా', syllablesEn: 'Ru, Re, Ro, Ta', rashiId: 'tula', rashiTe: 'తుల', rashiEn: 'Libra', nakshatraLord: 'రాహువు (Rahu)', rashiLord: 'శుక్రుడు (Venus)', ganam: 'దేవ గణం', nadi: 'అంత్య నాడి', rajju: 'కంఠ రజ్జు' },
  { index: 16, nakshatraTe: 'విశాఖ', nakshatraEn: 'Vishakha', syllablesTe: 'తీ, తూ, తే (తుల) | తో (వృశ్చికం)', syllablesEn: 'Ti, Tu, Te, To', rashiId: 'vruschikam', rashiTe: 'తుల (1,2,3) / వృశ్చికం (4)', rashiEn: 'Libra / Scorpio', nakshatraLord: 'గురుడు (Jupiter)', rashiLord: 'శుక్రుడు / కుజుడు', ganam: 'రాక్షస గణం', nadi: 'అంత్య నాడి', rajju: 'నాభి రజ్జు' },
  { index: 17, nakshatraTe: 'అనురాధ', nakshatraEn: 'Anuradha', syllablesTe: 'నా, నీ, నూ, నే', syllablesEn: 'Na, Ni, Nu, Ne', rashiId: 'vruschikam', rashiTe: 'వృశ్చికం', rashiEn: 'Scorpio', nakshatraLord: 'శని (Saturn)', rashiLord: 'కుజుడు (Mars)', ganam: 'దేవ గణం', nadi: 'మధ్య నాడి', rajju: 'ఊరు రజ్జు' },
  { index: 18, nakshatraTe: 'జ్యేష్ఠ', nakshatraEn: 'Jyeshtha', syllablesTe: 'నో, యా, యీ, యూ', syllablesEn: 'No, Ya, Yi, Yu', rashiId: 'vruschikam', rashiTe: 'వృశ్చికం', rashiEn: 'Scorpio', nakshatraLord: 'బుధుడు (Mercury)', rashiLord: 'కుజుడు (Mars)', ganam: 'రాక్షస గణం', nadi: 'ఆది నాడి', rajju: 'పాద రజ్జు' },
  { index: 19, nakshatraTe: 'మూల', nakshatraEn: 'Moola', syllablesTe: 'యే, యో, భా, భీ', syllablesEn: 'Ye, Yo, Bha, Bhi', rashiId: 'dhanussu', rashiTe: 'ధనుస్సు', rashiEn: 'Sagittarius', nakshatraLord: 'కేతువు (Ketu)', rashiLord: 'గురుడు (Jupiter)', ganam: 'రాక్షస గణం', nadi: 'ఆది నాడి', rajju: 'పాద రజ్జు' },
  { index: 20, nakshatraTe: 'పూర్వాషాఢ', nakshatraEn: 'Purvashadha', syllablesTe: 'భూ, ధా, ఫా, ఢా', syllablesEn: 'Bhu, Dha, Pha, Dha', rashiId: 'dhanussu', rashiTe: 'ధనుస్సు', rashiEn: 'Sagittarius', nakshatraLord: 'శుక్రుడు (Venus)', rashiLord: 'గురుడు (Jupiter)', ganam: 'మనుష్య గణం', nadi: 'మధ్య నాడి', rajju: 'ఊరు రజ్జు' },
  { index: 21, nakshatraTe: 'ఉత్తరాషాఢ', nakshatraEn: 'Uttarashadha', syllablesTe: 'భే (ధనుస్సు) | భో, జా, జీ (మకరం)', syllablesEn: 'Bhe, Bho, Ja, Ji', rashiId: 'makaram', rashiTe: 'ధనుస్సు (1) / మకరం (2,3,4)', rashiEn: 'Sagittarius / Capricorn', nakshatraLord: 'సూర్యుడు (Sun)', rashiLord: 'గురుడు / శని', ganam: 'మనుష్య గణం', nadi: 'అంత్య నాడి', rajju: 'నాభి రజ్జు' },
  { index: 22, nakshatraTe: 'శ్రవణం', nakshatraEn: 'Shravanam', syllablesTe: 'జూ, జే, జో, ఖా', syllablesEn: 'Ju, Je, Jo, Kha', rashiId: 'makaram', rashiTe: 'మకరం', rashiEn: 'Capricorn', nakshatraLord: 'చంద్రుడు (Moon)', rashiLord: 'శని (Saturn)', ganam: 'దేవ గణం', nadi: 'అంత్య నాడి', rajju: 'కంఠ రజ్జు' },
  { index: 23, nakshatraTe: 'ధనిష్ఠ', nakshatraEn: 'Dhanishtha', syllablesTe: 'గా, గీ (మకరం) | గూ, గే (కుంభం)', syllablesEn: 'Ga, Gi, Gu, Ge', rashiId: 'kumbham', rashiTe: 'మకరం (1,2) / కుంభం (3,4)', rashiEn: 'Capricorn / Aquarius', nakshatraLord: 'కుజుడు (Mars)', rashiLord: 'శని (Saturn)', ganam: 'రాక్షస గణం', nadi: 'మధ్య నాడి', rajju: 'శిరో రజ్జు' },
  { index: 24, nakshatraTe: 'శతభిషం', nakshatraEn: 'Shatabhisham', syllablesTe: 'గో, సా, సీ, సూ', syllablesEn: 'Go, Sa, Si, Su', rashiId: 'kumbham', rashiTe: 'కుంభం', rashiEn: 'Aquarius', nakshatraLord: 'రాహువు (Rahu)', rashiLord: 'శని (Saturn)', ganam: 'రాక్షస గణం', nadi: 'ఆది నాడి', rajju: 'కంఠ రజ్జు' },
  { index: 25, nakshatraTe: 'పూర్వాభాద్ర', nakshatraEn: 'Purvabhadra', syllablesTe: 'సే, సో, దా (కుంభం) | దీ (మీనం)', syllablesEn: 'Se, So, Da, Di', rashiId: 'meenam', rashiTe: 'కుంభం (1,2,3) / మీనం (4)', rashiEn: 'Aquarius / Pisces', nakshatraLord: 'గురుడు (Jupiter)', rashiLord: 'శని / గురుడు', ganam: 'మనుష్య గణం', nadi: 'ఆది నాడి', rajju: 'నాభి రజ్జు' },
  { index: 26, nakshatraTe: 'ఉత్తరాభాద్ర', nakshatraEn: 'Uttarabhadra', syllablesTe: 'దూ, థ, ఝ, ఞ', syllablesEn: 'Du, Tha, Jha, Nya', rashiId: 'meenam', rashiTe: 'మీనం', rashiEn: 'Pisces', nakshatraLord: 'శని (Saturn)', rashiLord: 'గురుడు (Jupiter)', ganam: 'మనుష్య గణం', nadi: 'మధ్య నాడి', rajju: 'ఊరు రజ్జు' },
  { index: 27, nakshatraTe: 'రేవతి', nakshatraEn: 'Revati', syllablesTe: 'దే, దో, చా, చీ', syllablesEn: 'De, Do, Cha, Chi', rashiId: 'meenam', rashiTe: 'మీనం', rashiEn: 'Pisces', nakshatraLord: 'బుధుడు (Mercury)', rashiLord: 'గురుడు (Jupiter)', ganam: 'దేవ గణం', nadi: 'అంత్య నాడి', rajju: 'పాద రజ్జు' },
];

interface UgadiRashiStat {
  id: string;
  nameTe: string;
  nameEn: string;
  aadayam: number;
  vyayam: number;
  rajapujyam: number;
  avamanam: number;
  summaryTe: string;
  summaryEn: string;
  remedyTe: string;
  remedyEn: string;
}

const UGADI_YEARLY_STATS: UgadiRashiStat[] = [
  { id: 'mesham', nameTe: 'మేష రాశి', nameEn: 'Aries (Mesham)', aadayam: 8, vyayam: 14, rajapujyam: 4, avamanam: 3, summaryTe: 'గురు బలం అనుకూలంగా ఉన్నందున గృహ నిర్మాణ ప్రయత్నాలు ఫలిస్తాయి. ఆర్థిక వ్యవహారాలలో ఆచితూచి అడుగు వేయాలి. ఉద్యోగస్తులకు ప్రమోషన్ సూచనలు.', summaryEn: 'Favorable Jupiter transit supports property acquisition and career elevation. Exercise prudence in major investments.', remedyTe: 'మంగళవారం సుబ్రహ్మణ్య స్వామి ఆరాధన, కందిపప్పు దానం శుభప్రదం.', remedyEn: 'Worship Lord Subrahmanya on Tuesdays and offer red lentils.' },
  { id: 'vrushabham', nameTe: 'వృషభ రాశి', nameEn: 'Taurus (Vrushabham)', aadayam: 2, vyayam: 8, rajapujyam: 7, avamanam: 3, summaryTe: 'రాజపూజ్యం అధికంగా ఉన్నందున సంఘంలో గౌరవ మర్యాదలు పెరుగుతాయి. శుభకార్య ప్రయత్నాలు సులభంగా నెరవేరుతాయి. వ్యాపార విస్తరణకు అనుకూల కాలం.', summaryEn: 'High Rajapujyam brings social prestige, successful family ceremonies, and profitable business expansion.', remedyTe: 'శుక్రవారం మహాలక్ష్మి అష్టోత్తర పారాయణ, గోపూజ శ్రేష్ఠం.', remedyEn: 'Recite Sri Mahalakshmi Ashtottaram on Fridays and perform Go-Pooja.' },
  { id: 'mithunam', nameTe: 'మిథున రాశి', nameEn: 'Gemini (Mithunam)', aadayam: 5, vyayam: 5, rajapujyam: 3, avamanam: 6, summaryTe: 'ఆదాయ వ్యయాలు సమానంగా ఉంటాయి. విదేశీ ప్రయాణాలు మరియు ఉన్నత విద్యా ప్రయత్నాలు విజయవంతమవుతాయి. ఆరోగ్యం విషయంలో శ్రద్ధ అవసరం.', summaryEn: 'Balanced income and expenditure. Overseas travel and higher education succeed smoothly.', remedyTe: 'బుధవారం విష్ణు సహస్రనామ స్తోత్ర పారాయణ చేయండి.', remedyEn: 'Chant Sri Vishnu Sahasranama Stotram on Wednesdays.' },
  { id: 'karkatakam', nameTe: 'కర్కాటక రాశి', nameEn: 'Cancer (Karkatakam)', aadayam: 14, vyayam: 2, rajapujyam: 6, avamanam: 6, summaryTe: 'అత్యధిక ఆదాయం (14) ఉన్నందున గతంలోని ఆర్థిక ఇబ్బందులు తొలగి ధన నిల్వలు పెరుగుతాయి. నూతన వాహన, ఆభరణ ప్రాప్తి కలుగుతుంది.', summaryEn: 'Supreme financial inflow (Aadayam 14) clears past debts and brings new vehicles, gold, and family joy.', remedyTe: 'సోమవారం శివాభిషేకం మరియు దుర్గాదేవి ఆరాధన చేయండి.', remedyEn: 'Perform Rudrabhishekam on Mondays and worship Goddess Durga.' },
  { id: 'simham', nameTe: 'సింహ రాశి', nameEn: 'Leo (Simham)', aadayam: 2, vyayam: 14, rajapujyam: 2, avamanam: 2, summaryTe: 'శుభకార్యాల నిమిత్తం ధన వ్యయం ఉంటుంది. ప్రభుత్వ సంబంధిత పనులలో ఓర్పుతో వ్యవహరించాలి. సంతాన పురోగతి ఆనందాన్నిస్తుంది.', summaryEn: 'Expenditure toward auspicious family events. Patience in official matters yields steady long-term rewards.', remedyTe: 'ఆదివారం ఆదిత్య హృదయ పారాయణ, సూర్య నమస్కారాలు చేయండి.', remedyEn: 'Recite Aditya Hrudayam on Sundays and offer Arghyam to Surya.' },
  { id: 'kanya', nameTe: 'కన్యా రాశి', nameEn: 'Virgo (Kanya)', aadayam: 5, vyayam: 5, rajapujyam: 5, avamanam: 2, summaryTe: 'భాగ్య స్థాన గురు సంచారం వల్ల అదృష్ట యోగం పడుతుంది. అవివాహితులకు వివాహ నిశ్చయం అవుతుంది. భూ-గృహ లాభం కలుగుతుంది.', summaryEn: 'Auspicious planetary alignment brings marriage prospects, real estate gains, and spiritual fulfillment.', remedyTe: 'బుధవారం శ్రీ వేంకటేశ్వర స్వామి దర్శనం మరియు తులసి అర్చన.', remedyEn: 'Worship Lord Venkateswara with Tulasi leaves on Wednesdays.' },
  { id: 'tula', nameTe: 'తులా రాశి', nameEn: 'Libra (Tula)', aadayam: 2, vyayam: 8, rajapujyam: 1, avamanam: 5, summaryTe: 'వృత్తి వ్యాపారాలలో శ్రమకు తగిన ప్రతిఫలం లభిస్తుంది. నూతన భాగస్వామ్య ఒప్పందాలలో పెద్దల సలహా తీసుకోవడం ఉత్తమం.', summaryEn: 'Hard work in profession pays off steadily. Consult elders before signing major new partnership deeds.', remedyTe: 'లలితా సహస్రనామ పారాయణ మరియు కనకधारा స్తోత్రం చదవండి.', remedyEn: 'Recite Sri Lalita Sahasranama and Kanakadhara Stotram.' },
  { id: 'vruschikam', nameTe: 'వృశ్చిక రాశి', nameEn: 'Scorpio (Vruschikam)', aadayam: 8, vyayam: 14, rajapujyam: 4, avamanam: 5, summaryTe: 'సప్తమ గురు దృష్టి వల్ల వివాహ, ఉద్యోగ ప్రయత్నాలు వేగంగా ఫలిస్తాయి. సమాజంలో పలుకుబడి ఉన్న వ్యక్తుల సహకారం లభిస్తుంది.', summaryEn: 'Jupiter’s aspect accelerates marriage and career breakthroughs with strong support from influential figures.', remedyTe: 'మంగళవారం హనుమాన్ చాలీసా పారాయణ, సుబ్రహ్మణ్య అభిషేకం.', remedyEn: 'Chant Hanuman Chalisa on Tuesdays and perform Subrahmanya Abhishekam.' },
  { id: 'dhanussu', nameTe: 'ధనుస్సు రాశి', nameEn: 'Sagittarius (Dhanussu)', aadayam: 11, vyayam: 5, rajapujyam: 7, avamanam: 5, summaryTe: 'ఆదాయం (11) మరియు రాజపూజ్యం (7) రెండూ అత్యుత్తమంగా ఉన్నాయి. కోర్టు వివాదాలు, శత్రు బాధలు తొలగి సంపూర్ణ విజయం లభిస్తుంది.', summaryEn: 'Excellent Aadayam (11) and Rajapujyam (7) bring victory in legal matters, financial growth, and leadership honors.', remedyTe: 'గురువారం దత్తాత్రేయ లేదా సాయిబాబా ఆరాధన, శనగల నైవేద్యం.', remedyEn: 'Worship Lord Dattatreya or Dakshinamurthy on Thursdays.' },
  { id: 'makaram', nameTe: 'మకర రాశి', nameEn: 'Capricorn (Makaram)', aadayam: 8, vyayam: 11, rajapujyam: 3, avamanam: 1, summaryTe: 'ఏలినాటి శని ప్రభావం పూర్తిగా తొలగిపోయినందున మానసిక ప్రశాంతత, వృత్తిలో స్థిరత్వం మరియు సంతాన సౌఖ్యం కలుగుతాయి.', summaryEn: 'Relief from Sade Sati brings mental peace, career stability, and auspicious news regarding children.', remedyTe: 'శనివారం వేంకటేశ్వర స్వామి ఆరాధన, నువ్వుల దీపం వెలిగించండి.', remedyEn: 'Light a sesame oil lamp on Saturdays and worship Lord Venkateswara.' },
  { id: 'kumbham', nameTe: 'కుంభ రాశి', nameEn: 'Aquarius (Kumbham)', aadayam: 8, vyayam: 11, rajapujyam: 6, avamanam: 1, summaryTe: 'రాజపూజ్యం (6) బలంగా ఉన్నందున రాజకీయ, సామాజిక రంగాల వారికి పదవీ యోగం. గృహ, వాహన సౌఖ్యం కలుగుతుంది.', summaryEn: 'Strong Rajapujyam (6) and minimal Avamanam (1) bestow authority, recognition, and comfort in home life.', remedyTe: 'శనివారం నవగ్రహ ప్రదక్షిణ, ఆంజనేయ స్వామి ఆరాధన శుభం.', remedyEn: 'Perform Navagraha Pradakshina and worship Lord Hanuman on Saturdays.' },
  { id: 'meenam', nameTe: 'మీన రాశి', nameEn: 'Pisces (Meenam)', aadayam: 11, vyayam: 5, rajapujyam: 2, avamanam: 4, summaryTe: 'ఆదాయం (11) విశేషంగా ఉన్నందున ఆర్థిక ఇబ్బందులు ఉండవు. ఏలినాటి శని నడుస్తున్నందున ఆరోగ్యం మరియు మాట విషయంలో సంయమనం పాటించాలి.', summaryEn: 'Abundant Aadayam (11) ensures financial security. Practice mindfulness in health and speech during Saturn transit.', remedyTe: 'గురువారం శివ-పార్వతుల అర్చన మరియు రుద్రాభిషేకం చేయించండి.', remedyEn: 'Perform Rudrabhishekam and worship Lord Shiva and Guru Dakshinamurthy.' },
];

const SHUBHA_MUHURTHAM_LIST = [
  {
    categoryTe: 'వివాహ ముహూర్తాలు (Marriage Dates)',
    categoryEn: 'Wedding Muhurthams (Vivaha)',
    items: [
      { dateTe: '18 నవంబర్ 2026 (బుధవారం)', tithiTe: 'కార్తీక శుద్ధ అష్టమి / నవమి', nakshatraTe: 'శతభిషం / పూర్వాభాద్ర', lagnamTe: 'మీన లగ్నం (రాత్రి 08:42 PM)' },
      { dateTe: '22 నవంబర్ 2026 (ఆదివారం)', tithiTe: 'కార్తీక శుద్ధ త్రయోదశి', nakshatraTe: 'అశ్విని / భరణి', lagnamTe: 'మేష లగ్నం (రాత్రి 10:15 PM)' },
      { dateTe: '25 నవంబర్ 2026 (బుధవారం)', tithiTe: 'కార్తీక బహుళ విదియ', nakshatraTe: 'రోహిణి / మృగశిర', lagnamTe: 'మిథున లగ్నం (రాత్రి 09:24 PM)' },
      { dateTe: '04 డిసెంబర్ 2026 (శుక్రవారం)', tithiTe: 'కార్తీక బహుళ దశమి', nakshatraTe: 'హస్త', lagnamTe: 'వృషభ లగ్నం (తెల్లవారుజామున 04:30 AM)' },
    ],
  },
  {
    categoryTe: 'గృహప్రవేశ ముహూర్తాలు (Housewarming)',
    categoryEn: 'Gruhapravesham Muhurthams',
    items: [
      { dateTe: '15 నవంబర్ 2026 (ఆదివారం)', tithiTe: 'కార్తీక శుద్ధ షష్ఠి', nakshatraTe: 'శ్రవణం', lagnamTe: 'కుంభ లగ్నం (ఉదయం 09:15 AM)' },
      { dateTe: '20 నవంబర్ 2026 (శుక్రవారం)', tithiTe: 'కార్తీక శుద్ధ ఏకాదశి', nakshatraTe: 'ఉత్తరాభాద్ర / రేవతి', lagnamTe: 'ధనుర్లగ్నం (ఉదయం 08:10 AM)' },
      { dateTe: '27 నవంబర్ 2026 (శుక్రవారం)', tithiTe: 'కార్తీక బహుళ తదియ', nakshatraTe: 'మృగశిర', lagnamTe: 'మీన లగ్నం (ఉదయం 10:40 AM)' },
    ],
  },
  {
    categoryTe: 'అక్షరాభ్యాసం, అన్నప్రాసన & వాహన కొనుగోలు',
    categoryEn: 'Aksharabhyasam, Annaprasana & Vehicle Purchase',
    items: [
      { dateTe: '14 నవంబర్ 2026 (శనివారం)', tithiTe: 'కార్తీక శుద్ధ పంచమి', nakshatraTe: 'ఉత్తరాషాఢ / శ్రవణం', lagnamTe: 'వృశ్చిక లగ్నం (ఉదయం 07:45 AM - వాహన & అన్నప్రాసన)' },
      { dateTe: '19 నవంబర్ 2026 (గురువారం)', tithiTe: 'కార్తీక శుద్ధ దశమి', nakshatraTe: 'పూర్వాభాద్ర', lagnamTe: 'ధనుర్లగ్నం (ఉదయం 08:30 AM - అక్షరాభ్యాసం)' },
      { dateTe: '02 డిసెంబర్ 2026 (బుధవారం)', tithiTe: 'కార్తీక బహుళ అష్టమి', nakshatraTe: 'ఉత్తర / హస్త', lagnamTe: 'మకర లగ్నం (ఉదయం 10:15 AM - వాహన & వ్యాపార ప్రారంభం)' },
    ],
  },
];

const DOSHA_REMEDIES_LIST = [
  {
    titleTe: 'కుజ దోషం (Manglik / Kuja Dosha)',
    titleEn: 'Kuja Dosha (Mars Affliction in 1, 2, 4, 7, 8, 12 Houses)',
    descTe: 'లగ్నం, చంద్రుడు లేదా శుక్రుని నుండి 1, 2, 4, 7, 8, 12 స్థానాలలో కుజుడు ఉన్నప్పుడు కుజ దోషం ఏర్పడుతుంది. అయితే గురు దృష్టి ఉన్నా, స్వక్షేత్ర/ఉచ్చ స్థితిలో ఉన్నా దోష పరిహారం జరుగుతుంది. భయపడవలసిన పనిలేదు.',
    descEn: 'Occurs when Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus. Classical exceptions apply when aspected by Jupiter.',
    remedyTe: 'కుజ గ్రహ శాంతి జపం, శ్రీ సుబ్రహ్మణ్య స్వామి అభిషేకం, కందుల దానం లేదా కుంభ వివాహ శాంతి.',
    remedyEn: 'Kuja Graha Shanti Japa, Sri Subrahmanya Abhishekam, and red lentil dana.',
  },
  {
    titleTe: 'కాలసర్ప దోషం (Kalasarpa Yoga / Dosha)',
    titleEn: 'Kalasarpa Dosha (All Planets Hemmed Between Rahu & Ketu)',
    descTe: 'జాతక చక్రంలో రాహు-కేతువుల మధ్య మిగిలిన సప్త గ్రహాలు బంధించబడినప్పుడు పనులలో ఆలస్యం, మానసిక ఆందోళన కలుగుతాయి. ఇది 32 ఏళ్ల తర్వాత రాజయోగంగా కూడా మారుతుంది.',
    descEn: 'Formed when all seven planets are positioned on one side of the Rahu-Ketu axis. Proper propitiation transforms obstacles into spiritual and material elevation.',
    remedyTe: 'రాహు-కేతు జప సహిత కాలసర్ప శాంతి హోమం, మహాన్యాస పూర్వక రుద్రాభిషేకం మరియు నాగ ప్రతిష్ఠ/పూజ.',
    remedyEn: 'Rahu-Ketu Shanti Homam, Mahanyasa Purvaka Rudrabhishekam, and Subrahmanya / Naga archana.',
  },
  {
    titleTe: 'ఏలినాటి శని & అర్ధాష్టమ శని (Sade Sati)',
    titleEn: 'Elinati Shani (Sade Sati) & Ashtama Shani',
    descTe: 'జన్మ రాశికి 12, 1, 2 స్థానాలలో శని సంచరించే 7.5 సంవత్సరాల కాలాన్ని ఏలినాటి శని అంటారు (ప్రస్తుతం కుంభ, మీన, మేష రాశుల వారికి). శని దేవుడు క్రమశిక్షణ, ధర్మం పాటించేవారికి ఉన్నత ఫలితాలనిస్తాడు.',
    descEn: 'The 7.5-year transit of Saturn across the 12th, 1st, and 2nd houses from Moon (currently Aquarius, Pisces, and Aries). Rewards discipline, humility, and dharmic service.',
    remedyTe: 'శని తైలాభిషేకం, తిల హోమం, ఆంజనేయ స్వామి ఆరాధన మరియు శనివారం నల్ల నువ్వుల దానం.',
    remedyEn: 'Shani Tailabhishekam, Tila Homam, Hanuman worship, and sesame seed dana on Saturdays.',
  },
  {
    titleTe: 'గండమూల నక్షత్ర దోషం (Ashwini, Ashlesha, Magha, Jyeshtha, Moola, Revati)',
    titleEn: 'Gandamoola Nakshatra Shanti (Junction Stars)',
    descTe: 'అశ్విని, ఆశ్లేష, మఖ, జ్యేష్ఠ, మూల, రేవతి నక్షత్రాలలో జన్మించిన శిశువులకు 27వ రోజున లేదా జన్మ నక్షత్రం తిరిగి వచ్చిన రోజున శాంతి జరిపించడం వల్ల సంపూర్ణ ఆయురారోగ్యాలు కలుగుతాయి.',
    descEn: 'Children born in water-fire junction stars (Ashwini, Ashlesha, Magha, Jyeshtha, Moola, Revati) thrive with longevity and brilliance after performing standard 27th-day Nakshatra Shanti.',
    remedyTe: '27 నక్షత్రాల ఉదక శాంతి, నవగ్రహ & నక్షత్ర హోమం, బంగారు/వెండి ప్రతిమ దానాలు.',
    remedyEn: '27-Nakshatra Udaka Shanti, Nakshatra Homam, and Kalasha Abhishekam.',
  },
];

export const HUB_SECTION_PATHS: Record<HubSectionId, string> = {
  pontana: '/vivaha-pontana',
  kundali: '/janma-kundali',
  akshara: '/naama-nakshatra',
  babynames: '/telugu-baby-names',
  vastu: '/vastu-shastra-telugu',
  ugadi: '/ugadi-rashi-phalalu',
  muhurtham: '/shubha-muhurthalu',
  dosha: '/dosha-pariharalu',
};

export const VedicAstrologyHub: React.FC<VedicAstrologyHubProps> = ({
  initialSection = 'pontana',
  onOpenBooking,
}) => {
  const { language, t, tr } = useLanguage();
  const [activeSection, setActiveSection] = useState<HubSectionId>(initialSection);
  const [syllableSearch, setSyllableSearch] = useState<string>('');
  const [tithiSearch, setTithiSearch] = useState<string>('ఏకాదశి');

  React.useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const handleSelectSection = (sec: HubSectionId) => {
    setActiveSection(sec);
    if (typeof window !== 'undefined') {
      try {
        const targetPath = HUB_SECTION_PATHS[sec];
        if (targetPath && window.location.pathname !== targetPath) {
          window.history.pushState({ hubSection: sec }, '', targetPath);
        }
      } catch {}
    }
  };

  const filteredSyllables = useMemo(() => {
    const q = syllableSearch.trim().toLowerCase();
    if (!q) return NAKSHATRA_SYLLABLE_TABLE;
    return NAKSHATRA_SYLLABLE_TABLE.filter(
      (row) =>
        row.syllablesTe.toLowerCase().includes(q) ||
        row.syllablesEn.toLowerCase().includes(q) ||
        row.nakshatraTe.toLowerCase().includes(q) ||
        row.nakshatraEn.toLowerCase().includes(q) ||
        row.rashiTe.toLowerCase().includes(q) ||
        row.rashiEn.toLowerCase().includes(q)
    );
  }, [syllableSearch]);

  // Extract special festivals & tithi occurrences from WEEK_DATA
  const matchedFestivalDays = useMemo(() => {
    const q = tithiSearch.trim().toLowerCase();
    return WEEK_DATA.filter((d) => {
      if (!q || q === 'all') return Boolean(d.specialEvent);
      return (
        d.panchanga.tithi.toLowerCase().includes(q) ||
        (d.specialEvent && d.specialEvent.toLowerCase().includes(q)) ||
        d.phalitham.toLowerCase().includes(q)
      );
    }).slice(0, 12);
  }, [tithiSearch]);

  const navButtons: { id: HubSectionId; labelTe: string; labelEn: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'kundali', labelTe: 'ఉచిత జన్మ కుండలి & మహాదశ', labelEn: 'Free Janma Kundali & Dasha', icon: ScrollText },
    { id: 'pontana', labelTe: 'వివాహ రాశి పొంతన (36 గుణాలు)', labelEn: 'Marriage Guna Milan (36 Pts)', icon: Heart },
    { id: 'akshara', labelTe: 'పేరు మొదటి అక్షరంతో రాశి-నక్షత్రం', labelEn: 'Name First Letter Rashi Finder', icon: Search },
    { id: 'babynames', labelTe: '27 నక్షత్రాల పిల్లల పేర్లు', labelEn: '27 Nakshatra Baby Names', icon: Baby },
    { id: 'vastu', labelTe: 'గృహ వాస్తు చక్రం', labelEn: 'Gruha Vastu Compass', icon: Compass },
    { id: 'ugadi', labelTe: 'ఉగాది వార్షిక రాశి ఫలాలు', labelEn: 'Ugadi Yearly Horoscope', icon: Sparkles },
    { id: 'muhurtham', labelTe: 'శుభ ముహూర్తాలు & తిథులు', labelEn: 'Shubha Muhurthams & Tithis', icon: Calendar },
    { id: 'dosha', labelTe: 'ఏలినాటి శని & దోషాల చెకర్', labelEn: 'Elinati Shani & Dosha Checker', icon: ShieldAlert },
  ];

  return (
    <section
      id="vedic-astrology-hub"
      className="my-10 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 border-2 border-amber-300 rounded-3xl p-4 sm:p-8 shadow-xl space-y-6 font-telugu scroll-mt-24"
    >
      {/* Top Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-200/80 px-3.5 py-1 rounded-full border border-amber-400">
          <BookOpen size={14} className="text-amber-800" />
          <span>{t('సంపూర్ణ జ్యోతిష విజ్ఞాన కేంద్రం • Vedic Astrology Tools', 'Complete Vedic Astrology & Muhurtham Tools')}</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-amber-950">
          {t(
            'వివాహ పొంతన, నామ నక్షత్రం, ఉగాది ఆదాయ-వ్యయాలు & శుభ ముహూర్తాలు',
            'Marriage Compatibility, Name Star Finder, Yearly Horoscope & Muhurthams'
          )}
        </h2>
        <p className="text-xs sm:text-base text-slate-600">
          {t(
            'భక్తులు తమ రాశి పొంతన, పేరు అక్షర నక్షత్రం, వార్షిక ఆదాయ-వ్యయాలు, పండుగ తిథులు మరియు దోష పరిహారాలను ఒకే చోట శాస్త్రోక్తంగా తెలుసుకోవచ్చు.',
            'Explore classical 36-point marriage matching, birth star by name syllable, Ugadi Aadayam-Vyayam, auspicious dates, and Vedic remedies.'
          )}
        </p>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-amber-200">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeSection === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => handleSelectSection(btn.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                isActive
                  ? 'bg-amber-900 text-white border-amber-950 shadow-md scale-[1.01]'
                  : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-100/70'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-amber-300' : 'text-amber-700'} />
              <span>{language === 'te' ? btn.labelTe : btn.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 0: FREE JANMA KUNDALI & VIMSHOTTARI MAHADASA */}
      {activeSection === 'kundali' && (
        <div className="animate-fadeIn">
          <Suspense fallback={<div className="py-12 text-center text-sm text-amber-900">జన్మ కుండలి లోడ్ అవుతోంది...</div>}>
            <JanmaKundaliGenerator onOpenBooking={onOpenBooking} />
          </Suspense>
        </div>
      )}

      {/* SECTION 1: 36-POINT MARRIAGE COMPATIBILITY (VIVAHA PONTANA) */}
      {activeSection === 'pontana' && (
        <div className="animate-fadeIn">
          <RashiCompatibilityTool
            onConsultGuruji={(bride, groom, score) => {
              const msg = `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, వధువు రాశి (${bride}) మరియు వరుడి రాశి (${groom}) అష్టకూట గుణ మిలనం స్కోరు ${score}/36 వచ్చింది. పూర్తి నక్షత్ర పాద పొంతన మరియు వివాహ ముహూర్తం కోసం సంప్రదించాలనుకుంటున్నాను.`;
              window.open(`https://wa.me/918977986166?text=${encodeURIComponent(msg)}`, '_blank');
            }}
          />
        </div>
      )}

      {/* SECTION: 27 NAKSHATRA BABY NAMES */}
      {activeSection === 'babynames' && (
        <div className="animate-fadeIn">
          <Suspense fallback={<div className="py-12 text-center text-sm text-amber-900">నక్షత్ర పిల్లల పేర్లు లోడ్ అవుతున్నాయి...</div>}>
            <NakshatraBabyNames />
          </Suspense>
        </div>
      )}

      {/* SECTION: GRUHA VASTU CHAKRA GUIDE */}
      {activeSection === 'vastu' && (
        <div className="animate-fadeIn">
          <Suspense fallback={<div className="py-12 text-center text-sm text-amber-900">వాస్తు చక్రం లోడ్ అవుతోంది...</div>}>
            <VastuChakraGuide />
          </Suspense>
        </div>
      )}

      {/* SECTION 2: NAAMA NAKSHATRA & RASHI BY FIRST LETTER */}
      {activeSection === 'akshara' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-950">
                {t('పేరులోని మొదటి అక్షరంతో మీ రాశి & నక్షత్రం తెలుసుకోండి', 'Find Your Rashi & Nakshatra by First Syllable of Name')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                {t(
                  'పుట్టిన సమయం తెలియని వారు తమ పేరు మొదటి అక్షరం (ఉదా: చూ, చే, కా, మా, రా, సా, గూ) టైప్ చేసి రాశి, నక్షత్రం, గణం, నాడి తెలుసుకోవచ్చు.',
                  'Type your name’s starting syllable (e.g., Chu, Ka, Ma, Ra, Sa, Gu) or Nakshatra to find your Rashi, Gana, Nadi, and Rajju.'
                )}
              </p>
            </div>

            <div className="relative w-full md:w-80 shrink-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-700" />
              <input
                type="text"
                value={syllableSearch}
                onChange={(e) => setSyllableSearch(e.target.value)}
                placeholder={t('అక్షరం లేదా నక్షత్రం వెతకండి (ఉదా: రా, రోహిణి)...', 'Search syllable or star (e.g. Ra, Rohini)...')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-amber-400 text-sm text-amber-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[540px] overflow-y-auto pr-1">
            {filteredSyllables.map((row) => (
              <div
                key={row.index}
                className="bg-white border border-amber-200/90 rounded-2xl p-4 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      #{row.index} {language === 'te' ? row.nakshatraTe : row.nakshatraEn}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                      <RashiGlyph rashi={row.rashiId} size={13} className="text-amber-700" />
                      <span>{language === 'te' ? row.rashiTe : row.rashiEn}</span>
                    </span>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 mb-2.5">
                    <span className="text-[11px] text-slate-500 block">
                      {t('నామ నక్షత్ర అక్షరాలు (4 పాదాలు):', '4 Pada Syllables:')}
                    </span>
                    <span className="text-base font-extrabold text-amber-950">
                      {language === 'te' ? row.syllablesTe : `${row.syllablesEn} (${row.syllablesTe})`}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-amber-100">
                  <div className="flex justify-between">
                    <span>{t('నక్షత్రాధిపతి:', 'Star Lord:')}</span>
                    <strong className="text-slate-900">{row.nakshatraLord}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('గణం & నాడి:', 'Gana & Nadi:')}</span>
                    <strong className="text-emerald-800">{row.ganam} · {row.nadi}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('రజ్జు వర్గం:', 'Rajju Group:')}</span>
                    <strong className="text-amber-900">{row.rajju}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: UGADI YEARLY RASHI PHALALU (AADAYAM - VYAYAM) */}
      {activeSection === 'ugadi' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
                శ్రీ పరాభవ నామ సంవత్సర ఉగాది పంచాంగం (2026–2027)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {t('ద్వాదశ రాశుల ఆదాయం - వ్యయం & రాజపూజ్యం - అవమానం', '12 Rashis Yearly Aadayam-Vyayam & Transit Forecast')}
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs sm:text-sm shrink-0 cursor-pointer"
            >
              {t('వార్షిక గ్రహ శాంతి బుకింగ్', 'Book Yearly Graha Shanti')}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {UGADI_YEARLY_STATS.map((stat) => (
              <div
                key={stat.id}
                className="bg-white border border-amber-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-amber-100">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <RashiGlyph rashi={stat.id} size={18} />
                      </div>
                      <h4 className="text-lg font-bold text-amber-950">
                        {language === 'te' ? stat.nameTe : stat.nameEn}
                      </h4>
                    </div>
                  </div>

                  {/* Aadayam / Vyayam / Rajapujyam / Avamanam Pills */}
                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center">
                      <span className="text-[11px] text-emerald-800 block">{t('ఆదాయం', 'Aadayam (Income)')}</span>
                      <span className="text-lg font-extrabold text-emerald-950 font-mono">{stat.aadayam}</span>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-2 text-center">
                      <span className="text-[11px] text-rose-800 block">{t('వ్యయం', 'Vyayam (Expense)')}</span>
                      <span className="text-lg font-extrabold text-rose-950 font-mono">{stat.vyayam}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-center">
                      <span className="text-[11px] text-amber-800 block">{t('రాజపూజ్యం', 'Rajapujyam (Honor)')}</span>
                      <span className="text-lg font-extrabold text-amber-950 font-mono">{stat.rajapujyam}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center">
                      <span className="text-[11px] text-slate-600 block">{t('అవమానం', 'Avamanam')}</span>
                      <span className="text-lg font-extrabold text-slate-800 font-mono">{stat.avamanam}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {language === 'te' ? stat.summaryTe : stat.summaryEn}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                  <strong className="font-bold text-amber-900">{t('శాస్త్రోక్త పరిహారం: ', 'Vedic Remedy: ')}</strong>
                  <span>{language === 'te' ? stat.remedyTe : stat.remedyEn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: SHUBHA MUHURTHAMS & TITHI / FESTIVAL FINDER */}
      {activeSection === 'muhurtham' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Part A: Tithi & Festival Date Finder */}
          <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-amber-950">
                  {t('తెలుగు తిథి & పండుగల తేదీల అన్వేషణ (Tithi & Festival Date Finder)', 'Telugu Tithi & Festival Date Finder')}
                </h3>
                <p className="text-xs text-slate-600">
                  {t(
                    'ఏకాదశి, పౌర్ణమి, అమావాస్య, చవితి, షష్ఠి లేదా మీ పితృ/జన్మ తిథి ఏ ఇంగ్లీష్ తేదీన వచ్చిందో వెంటనే చూడండి.',
                    'Quickly find upcoming English calendar dates for Ekadashi, Pournami, Amavasya, Chaturthi, or any lunar Tithi.'
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['ఏకాదశి', 'పౌర్ణమి', 'అమావాస్య', 'చవితి', 'షష్ఠి', 'త్రయోదశి'].map((tithiTag) => (
                  <button
                    key={tithiTag}
                    type="button"
                    onClick={() => setTithiSearch(tithiTag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                      tithiSearch === tithiTag
                        ? 'bg-amber-800 text-white border-amber-900'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {tr(tithiTag)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchedFestivalDays.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">{tr(d.teediVaram)}</span>
                    <span className="text-sm font-extrabold text-amber-950 block mt-0.5">
                      {tr(d.panchanga.tithi)}
                    </span>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      {t('నక్షత్రం:', 'Star:')} {tr(d.panchanga.nakshatram.split('-')[0])}
                    </span>
                  </div>
                  {d.specialEvent && (
                    <span className="mt-2 inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-200/80 text-amber-950">
                      ★ {tr(d.specialEvent)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Part B: Verified Shubha Muhurtham Tables */}
          <div className="grid lg:grid-cols-3 gap-5">
            {SHUBHA_MUHURTHAM_LIST.map((group) => (
              <div
                key={group.categoryEn}
                className="bg-white border border-amber-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <h4 className="text-lg font-bold text-amber-950 border-b border-amber-100 pb-2.5 mb-3">
                    {language === 'te' ? group.categoryTe : group.categoryEn}
                  </h4>
                  <div className="space-y-3">
                    {group.items.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                        <span className="font-bold text-emerald-950 text-sm block">{m.dateTe}</span>
                        <span className="text-slate-700 block"><strong>తిథి:</strong> {m.tithiTe}</span>
                        <span className="text-slate-700 block"><strong>నక్షత్రం:</strong> {m.nakshatraTe}</span>
                        <span className="text-emerald-900 font-semibold block"><strong>లగ్నం:</strong> {m.lagnamTe}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/918977986166?text=${encodeURIComponent(
                    `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, మా జన్మ నక్షత్రం ప్రకారం "${group.categoryTe}" కొరకు వ్యక్తిగత ముహూర్త నిర్ణయం కావాలి.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={15} />
                  <span>{t('మీ నక్షత్రానికి వ్యక్తిగత ముహూర్తం అడగండి', 'Request Personal Muhurtham on WhatsApp')}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: INTERACTIVE SHANI DOSHA CHECKER & VEDIC DOSHA REMEDIES GUIDE */}
      {activeSection === 'dosha' && (
        <div className="space-y-8 animate-fadeIn">
          <Suspense fallback={<div className="py-12 text-center text-sm text-amber-900">శని & దోష చెకర్ లోడ్ అవుతోంది...</div>}>
            <ShaniDoshaChecker onOpenBooking={onOpenBooking} />
          </Suspense>

          <div className="grid md:grid-cols-2 gap-5">
            {DOSHA_REMEDIES_LIST.map((dosha) => (
              <div
                key={dosha.titleEn}
                className="bg-white border border-amber-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                    <Flame size={18} className="text-amber-600 shrink-0" />
                    <span>{language === 'te' ? dosha.titleTe : dosha.titleEn}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {language === 'te' ? dosha.descTe : dosha.descEn}
                  </p>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                    <strong className="font-bold text-emerald-900">{t('శాస్త్రోక్త శాంతి పరిహారం: ', 'Recommended Vedic Shanti: ')}</strong>
                    <span>{language === 'te' ? dosha.remedyTe : dosha.remedyEn}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/918977986166?text=${encodeURIComponent(
                      `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, జాతకంలోని "${dosha.titleTe}" పరిశీలన మరియు శాంతి పరిహార పూజ గురించి సంప్రదించాలనుకుంటున్నాను.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-300"
                  >
                    <MessageCircle size={14} />
                    <span>{t('ధీరజ్ శర్మ గారిని వాట్సాప్‌లో అడగండి', 'Ask Guruji on WhatsApp')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-700 cursor-pointer"
                  >
                    <span>{t('శాంతి హోమం బుకింగ్', 'Book Shanti Homam')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
