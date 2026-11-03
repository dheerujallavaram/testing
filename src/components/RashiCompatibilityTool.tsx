import React, { useState, useMemo } from 'react';
import {
  Heart,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shield,
  Users,
  ArrowRight,
  Flame,
  Scale,
  BookOpen,
  Star,
} from 'lucide-react';
import { RASHI_CHART_ORDER } from '../data/panchangamData';
import { useLanguage } from '../context/LanguageContext';

export interface RashiCompatibilityProps {
  defaultBrideRashi?: string;
  defaultGroomRashi?: string;
  onConsultGuruji?: (brideRashi: string, groomRashi: string, score: number) => void;
}

interface KootaBreakdown {
  nameTelugu: string;
  nameEnglish: string;
  maxPoints: number;
  scoredPoints: number;
  descriptionTelugu: string;
  descriptionEnglish: string;
}

export interface PanchaKalyanaPillar {
  id: string;
  titleTe: string;
  titleEn: string;
  scorePct: number;
  summaryTe: string;
  summaryEn: string;
}

interface NakshatraMeta {
  id: number;
  nameTe: string;
  nameEn: string;
  nadi: 'Adi' | 'Madhya' | 'Antya';
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  rajju: 'Pada' | 'Uru' | 'Nabhi' | 'Kantha' | 'Shiro';
  rajjuTe: string;
  dashaLordTe: string;
  dashaLordEn: string;
}

const NAKSHATRA_27_LIST: NakshatraMeta[] = [
  { id: 1, nameTe: 'అశ్విని', nameEn: 'Ashwini', nadi: 'Adi', gana: 'Deva', rajju: 'Pada', rajjuTe: 'పాద రజ్జు', dashaLordTe: 'కేతువు', dashaLordEn: 'Ketu' },
  { id: 2, nameTe: 'భరణి', nameEn: 'Bharani', nadi: 'Madhya', gana: 'Manushya', rajju: 'Uru', rajjuTe: 'ఊరు రజ్జు', dashaLordTe: 'శుక్రుడు', dashaLordEn: 'Venus' },
  { id: 3, nameTe: 'కృత్తిక', nameEn: 'Krittika', nadi: 'Antya', gana: 'Rakshasa', rajju: 'Nabhi', rajjuTe: 'నాభి రజ్జు', dashaLordTe: 'సూర్యుడు', dashaLordEn: 'Sun' },
  { id: 4, nameTe: 'రోహిణి', nameEn: 'Rohini', nadi: 'Antya', gana: 'Manushya', rajju: 'Kantha', rajjuTe: 'కంఠ రజ్జు', dashaLordTe: 'చంద్రుడు', dashaLordEn: 'Moon' },
  { id: 5, nameTe: 'మృగశిర', nameEn: 'Mrigashira', nadi: 'Madhya', gana: 'Deva', rajju: 'Shiro', rajjuTe: 'శిరో రజ్జు', dashaLordTe: 'కుజుడు', dashaLordEn: 'Mars' },
  { id: 6, nameTe: 'ఆరుద్ర', nameEn: 'Ardra', nadi: 'Adi', gana: 'Manushya', rajju: 'Kantha', rajjuTe: 'కంఠ రజ్జు', dashaLordTe: 'రాహువు', dashaLordEn: 'Rahu' },
  { id: 7, nameTe: 'పునర్వసు', nameEn: 'Punarvasu', nadi: 'Adi', gana: 'Deva', rajju: 'Nabhi', rajjuTe: 'నాభి రజ్జు', dashaLordTe: 'గురుడు', dashaLordEn: 'Jupiter' },
  { id: 8, nameTe: 'పుష్యమి', nameEn: 'Pushyami', nadi: 'Madhya', gana: 'Deva', rajju: 'Uru', rajjuTe: 'ఊరు రజ్జు', dashaLordTe: 'శని', dashaLordEn: 'Saturn' },
  { id: 9, nameTe: 'ఆశ్లేష', nameEn: 'Ashlesha', nadi: 'Antya', gana: 'Rakshasa', rajju: 'Pada', rajjuTe: 'పాద రజ్జు', dashaLordTe: 'బుధుడు', dashaLordEn: 'Mercury' },
  { id: 10, nameTe: 'మఖ', nameEn: 'Magha', nadi: 'Antya', gana: 'Rakshasa', rajju: 'Pada', rajjuTe: 'పాద రజ్జు', dashaLordTe: 'కేతువు', dashaLordEn: 'Ketu' },
  { id: 11, nameTe: 'పుబ్బ', nameEn: 'Purva Phalguni', nadi: 'Madhya', gana: 'Manushya', rajju: 'Uru', rajjuTe: 'ఊరు రజ్జు', dashaLordTe: 'శుక్రుడు', dashaLordEn: 'Venus' },
  { id: 12, nameTe: 'ఉత్తర', nameEn: 'Uttara Phalguni', nadi: 'Adi', gana: 'Manushya', rajju: 'Nabhi', rajjuTe: 'నాభి రజ్జు', dashaLordTe: 'సూర్యుడు', dashaLordEn: 'Sun' },
  { id: 13, nameTe: 'హస్త', nameEn: 'Hasta', nadi: 'Adi', gana: 'Deva', rajju: 'Kantha', rajjuTe: 'కంఠ రజ్జు', dashaLordTe: 'చంద్రుడు', dashaLordEn: 'Moon' },
  { id: 14, nameTe: 'చిత్త', nameEn: 'Chitra', nadi: 'Madhya', gana: 'Rakshasa', rajju: 'Shiro', rajjuTe: 'శిరో రజ్జు', dashaLordTe: 'కుజుడు', dashaLordEn: 'Mars' },
  { id: 15, nameTe: 'స్వాతి', nameEn: 'Swati', nadi: 'Antya', gana: 'Deva', rajju: 'Kantha', rajjuTe: 'కంఠ రజ్జు', dashaLordTe: 'రాహువు', dashaLordEn: 'Rahu' },
  { id: 16, nameTe: 'విశాఖ', nameEn: 'Vishakha', nadi: 'Antya', gana: 'Rakshasa', rajju: 'Nabhi', rajjuTe: 'నాభి రజ్జు', dashaLordTe: 'గురుడు', dashaLordEn: 'Jupiter' },
  { id: 17, nameTe: 'అనురాధ', nameEn: 'Anuradha', nadi: 'Madhya', gana: 'Deva', rajju: 'Uru', rajjuTe: 'ఊరు రజ్జు', dashaLordTe: 'శని', dashaLordEn: 'Saturn' },
  { id: 18, nameTe: 'జ్యేష్ఠ', nameEn: 'Jyeshtha', nadi: 'Adi', gana: 'Rakshasa', rajju: 'Pada', rajjuTe: 'పాద రజ్జు', dashaLordTe: 'బుధుడు', dashaLordEn: 'Mercury' },
  { id: 19, nameTe: 'మూల', nameEn: 'Moola', nadi: 'Adi', gana: 'Rakshasa', rajju: 'Pada', rajjuTe: 'పాద రజ్జు', dashaLordTe: 'కేతువు', dashaLordEn: 'Ketu' },
  { id: 20, nameTe: 'పూర్వాషాఢ', nameEn: 'Purvashadha', nadi: 'Madhya', gana: 'Manushya', rajju: 'Uru', rajjuTe: 'ఊరు రజ్జు', dashaLordTe: 'శుక్రుడు', dashaLordEn: 'Venus' },
  { id: 21, nameTe: 'ఉత్తరాషాఢ', nameEn: 'Uttarashadha', nadi: 'Antya', gana: 'Manushya', rajju: 'Nabhi', rajjuTe: 'నాభి రజ్జు', dashaLordTe: 'సూర్యుడు', dashaLordEn: 'Sun' },
  { id: 22, nameTe: 'శ్రవణం', nameEn: 'Shravanam', nadi: 'Antya', gana: 'Deva', rajju: 'Kantha', rajjuTe: 'కంఠ రజ్జు', dashaLordTe: 'చంద్రుడు', dashaLordEn: 'Moon' },
  { id: 23, nameTe: 'ధనిష్ఠ', nameEn: 'Dhanishtha', nadi: 'Madhya', gana: 'Rakshasa', rajju: 'Shiro', rajjuTe: 'శిరో రజ్జు', dashaLordTe: 'కుజుడు', dashaLordEn: 'Mars' },
  { id: 24, nameTe: 'శతభిషం', nameEn: 'Shatabhisham', nadi: 'Adi', gana: 'Rakshasa', rajju: 'Kantha', rajjuTe: 'కంఠ రజ్జు', dashaLordTe: 'రాహువు', dashaLordEn: 'Rahu' },
  { id: 25, nameTe: 'పూర్వాభాద్ర', nameEn: 'Purvabhadra', nadi: 'Adi', gana: 'Manushya', rajju: 'Nabhi', rajjuTe: 'నాభి రజ్జు', dashaLordTe: 'గురుడు', dashaLordEn: 'Jupiter' },
  { id: 26, nameTe: 'ఉత్తరాభాద్ర', nameEn: 'Uttarabhadra', nadi: 'Madhya', gana: 'Manushya', rajju: 'Uru', rajjuTe: 'ఊరు రజ్జు', dashaLordTe: 'శని', dashaLordEn: 'Saturn' },
  { id: 27, nameTe: 'రేవతి', nameEn: 'Revati', nadi: 'Antya', gana: 'Deva', rajju: 'Pada', rajjuTe: 'పాద రజ్జు', dashaLordTe: 'బుధుడు', dashaLordEn: 'Mercury' },
];

const RASHI_METADATA: Record<
  string,
  {
    index: number;
    varna: number; // 1..4
    vashya: string;
    taraGroup: number;
    yoni: string;
    grahaLord: string;
    gana: 'Deva' | 'Manushya' | 'Rakshasa';
    nadi: 'Adi' | 'Madhya' | 'Antya';
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
    defaultNakId: number;
  }
> = {
  mesham: { index: 1, varna: 3, vashya: 'Chatushpada', taraGroup: 1, yoni: 'Ashwa', grahaLord: 'Kuja', gana: 'Deva', nadi: 'Adi', element: 'Fire', defaultNakId: 1 },
  vrushabham: { index: 2, varna: 2, vashya: 'Chatushpada', taraGroup: 2, yoni: 'Gaja', grahaLord: 'Shukra', gana: 'Manushya', nadi: 'Madhya', element: 'Earth', defaultNakId: 4 },
  mithunam: { index: 3, varna: 1, vashya: 'Dwipada', taraGroup: 3, yoni: 'Mesha', grahaLord: 'Budha', gana: 'Manushya', nadi: 'Antya', element: 'Air', defaultNakId: 6 },
  karkatakam: { index: 4, varna: 4, vashya: 'Jalachara', taraGroup: 1, yoni: 'Sarpa', grahaLord: 'Chandra', gana: 'Deva', nadi: 'Adi', element: 'Water', defaultNakId: 8 },
  simham: { index: 5, varna: 3, vashya: 'Vanachara', taraGroup: 2, yoni: 'Mushika', grahaLord: 'Surya', gana: 'Rakshasa', nadi: 'Madhya', element: 'Fire', defaultNakId: 10 },
  kanya: { index: 6, varna: 2, vashya: 'Dwipada', taraGroup: 3, yoni: 'Gau', grahaLord: 'Budha', gana: 'Manushya', nadi: 'Antya', element: 'Earth', defaultNakId: 13 },
  tula: { index: 7, varna: 1, vashya: 'Dwipada', taraGroup: 1, yoni: 'Mahisha', grahaLord: 'Shukra', gana: 'Deva', nadi: 'Adi', element: 'Air', defaultNakId: 15 },
  vruschikam: { index: 8, varna: 4, vashya: 'Keeta', taraGroup: 2, yoni: 'Vyaghra', grahaLord: 'Kuja', gana: 'Rakshasa', nadi: 'Madhya', element: 'Water', defaultNakId: 17 },
  dhanussu: { index: 9, varna: 3, vashya: 'Dwipada', taraGroup: 3, yoni: 'Mriga', grahaLord: 'Guru', gana: 'Deva', nadi: 'Antya', element: 'Fire', defaultNakId: 19 },
  makaram: { index: 10, varna: 2, vashya: 'Jalachara', taraGroup: 1, yoni: 'Vanara', grahaLord: 'Shani', gana: 'Rakshasa', nadi: 'Adi', element: 'Earth', defaultNakId: 22 },
  kumbham: { index: 11, varna: 1, vashya: 'Dwipada', taraGroup: 2, yoni: 'Nakula', grahaLord: 'Shani', gana: 'Deva', nadi: 'Madhya', element: 'Air', defaultNakId: 24 },
  meenam: { index: 12, varna: 4, vashya: 'Jalachara', taraGroup: 3, yoni: 'Simha', grahaLord: 'Guru', gana: 'Deva', nadi: 'Antya', element: 'Water', defaultNakId: 27 },
};

const FRIENDLY_LORDS: Record<string, string[]> = {
  Surya: ['Chandra', 'Kuja', 'Guru'],
  Chandra: ['Surya', 'Budha', 'Guru'],
  Kuja: ['Surya', 'Chandra', 'Guru'],
  Budha: ['Surya', 'Shukra', 'Shani'],
  Guru: ['Surya', 'Chandra', 'Kuja'],
  Shukra: ['Budha', 'Shani'],
  Shani: ['Budha', 'Shukra'],
};

const KUJA_HOUSE_OPTIONS: {
  house: number;
  labelTe: string;
  labelEn: string;
  doshaPct: number;
  impactTe: string;
  impactEn: string;
}[] = [
  {
    house: 0,
    labelTe: 'కుజ దోషం లేదు (3, 5, 6, 9, 10, 11 స్థానాలు)',
    labelEn: 'No Kuja Dosha (Mars in 3, 5, 6, 9, 10, 11H)',
    doshaPct: 0,
    impactTe: 'జాతకంలో కుజుడు అనుకూల స్థానంలో ఉన్నాడు. కుజ దోష ప్రభావం లేదు.',
    impactEn: 'Mars is placed in a non-afflicting house. Zero Manglik Dosha.',
  },
  {
    house: 12,
    labelTe: '12వ స్థానంలో కుజుడు (వ్యయ స్థానం — 50% ప్రభావం)',
    labelEn: 'Mars in 12th House (50% Mild Intensity)',
    doshaPct: 50,
    impactTe: 'వ్యయ స్థాన కుజుని వల్ల ఖర్చులు లేదా స్వల్ప మానసిక ఒత్తిడి మాత్రమే ఉంటుంది (50% ప్రభావం). శుభ గ్రహ దృష్టితో సులభంగా తొలగుతుంది.',
    impactEn: 'Mild 50% Mars influence related to expenditure and family adjustments; easily balanced by benefic aspects.',
  },
  {
    house: 1,
    labelTe: '1వ స్థానంలో కుజుడు (లగ్న స్థానం — 60% ప్రభావం)',
    labelEn: 'Mars in 1st House / Ascendant (60% Moderate Intensity)',
    doshaPct: 60,
    impactTe: 'లగ్న కుజుని వల్ల పట్టుదల, ఆవేశం ఉంటాయి (60% ప్రభావం). ఓర్పు మరియు సమాన దోష జాతకంతో శుభప్రదం.',
    impactEn: 'Moderate 60% Mars influence imparting strong willpower and quick temper; harmonized through mutual patience.',
  },
  {
    house: 2,
    labelTe: '2వ స్థానంలో కుజుడు (కుటుంబ స్థానం — 80% ప్రభావం)',
    labelEn: 'Mars in 2nd House (80% South Indian Tradition)',
    doshaPct: 80,
    impactTe: 'దక్షిణ భారత సంప్రదాయంలో 2వ స్థానం (7వ ఇంటికి అష్టమం) కుటుంబ మరియు మాట తీరుపై 80% ప్రభావం చూపుతుంది.',
    impactEn: 'Significant 80% influence on speech, savings, and domestic harmony in South Indian astrology.',
  },
  {
    house: 4,
    labelTe: '4వ స్థానంలో కుజుడు (సుఖ స్థానం — 85% ప్రభావం)',
    labelEn: 'Mars in 4th House (85% Domestic Comfort Impact)',
    doshaPct: 85,
    impactTe: 'చతుర్థ కుజుడు సప్తమ స్థానంపై చతుర్థ దృష్టి వేస్తాడు కాబట్టి గృహ వాతావరణంపై 85% ప్రభావం ఉంటుంది.',
    impactEn: '85% intensity affecting domestic peace via Mars’s 4th aspect onto the 7th house of marriage.',
  },
  {
    house: 7,
    labelTe: '7వ స్థానంలో కుజుడు (కళత్ర స్థానం — 100% ప్రభావం)',
    labelEn: 'Mars in 7th House (100% Full Kalatra Impact)',
    doshaPct: 100,
    impactTe: 'కళత్ర స్థానంలో కుజుడు 100% పూర్ణ కుజ దోష ప్రభావాన్ని ఇస్తాడు. ఎదుటి వారి జాతకంలో కూడా సమాన కుజ/శని బలం లేదా కుజ శాంతి తప్పనిసరి.',
    impactEn: '100% direct placement in the 7th house; requires matching planetary balance or authentic Vedic Kuja Shanti.',
  },
  {
    house: 8,
    labelTe: '8వ స్థానంలో కుజుడు (మాంగల్య స్థానం — 100% ప్రభావం)',
    labelEn: 'Mars in 8th House (100% Mangalya Bhava Impact)',
    doshaPct: 100,
    impactTe: 'అష్టమ స్థాన కుజుడు 100% తీవ్ర ప్రభావాన్ని చూపుతాడు. గురు దృష్టి లేదా సమాన కుజ దోష జాతకంతో వివాహం చేయడం ఉత్తమం.',
    impactEn: '100% intensity in the 8th house of longevity; requires matching chart balance or Guru Drishti mitigation.',
  },
];

export function calculateAshtakootaGunaMilan(brideKey: string, groomKey: string): {
  totalScore: number;
  maxTotal: number;
  kootas: KootaBreakdown[];
  verdictTelugu: string;
  verdictEnglish: string;
  recommendationTelugu: string;
  recommendationEnglish: string;
  status: 'excellent' | 'good' | 'moderate' | 'caution';
  panchaYogas: PanchaKalyanaPillar[];
  bhakootExemptionActive: boolean;
} {
  const b = RASHI_METADATA[brideKey] || RASHI_METADATA.mesham;
  const g = RASHI_METADATA[groomKey] || RASHI_METADATA.vrushabham;

  // 1. Varna Koota (1 point)
  const varnaScore = g.varna >= b.varna ? 1 : 0.5;

  // 2. Vashya Koota (2 points)
  const vashyaScore = b.vashya === g.vashya ? 2 : b.element === g.element ? 1.5 : 1;

  // 3. Tara Koota (3 points)
  const diff = ((g.index - b.index + 12) % 12) + 1;
  const taraScore = [1, 2, 4, 6, 8, 9, 11].includes(diff) ? 3 : 1.5;

  // 4. Yoni Koota (4 points)
  const yoniScore = b.yoni === g.yoni ? 4 : b.element === g.element ? 3 : 2;

  // 5. Graha Maitri Koota (5 points)
  let maitriScore = 2.5;
  const lordsAreFriendly =
    b.grahaLord === g.grahaLord ||
    (Boolean(FRIENDLY_LORDS[b.grahaLord]?.includes(g.grahaLord)) &&
      Boolean(FRIENDLY_LORDS[g.grahaLord]?.includes(b.grahaLord)));

  if (b.grahaLord === g.grahaLord) {
    maitriScore = 5;
  } else if (lordsAreFriendly) {
    maitriScore = 5;
  } else if (
    FRIENDLY_LORDS[b.grahaLord]?.includes(g.grahaLord) ||
    FRIENDLY_LORDS[g.grahaLord]?.includes(b.grahaLord)
  ) {
    maitriScore = 4;
  } else {
    maitriScore = 1;
  }

  // 6. Gana Koota (6 points)
  let ganaScore = 3;
  if (b.gana === g.gana) {
    ganaScore = 6;
  } else if (
    (b.gana === 'Deva' && g.gana === 'Manushya') ||
    (b.gana === 'Manushya' && g.gana === 'Deva')
  ) {
    ganaScore = 5;
  } else {
    ganaScore = 1;
  }

  // 7. Bhakoot / Rashi Koota (7 points) + Graha Maitri Exemption Check
  let bhakootScore = 7;
  let bhakootExemptionActive = false;
  if (diff === 2 || diff === 12) {
    if (lordsAreFriendly) {
      bhakootScore = 6;
      bhakootExemptionActive = true;
    } else {
      bhakootScore = 2;
    }
  } else if (diff === 6 || diff === 8) {
    if (lordsAreFriendly) {
      bhakootScore = 5;
      bhakootExemptionActive = true;
    } else {
      bhakootScore = 0;
    }
  } else if (diff === 5 || diff === 9) {
    if (lordsAreFriendly) {
      bhakootScore = 7;
      bhakootExemptionActive = true;
    } else {
      bhakootScore = 3.5;
    }
  }

  // 8. Nadi Koota (8 points)
  const nadiScore = b.nadi !== g.nadi ? 8 : b.index === g.index ? 4 : 0;

  const kootas: KootaBreakdown[] = [
    {
      nameTelugu: 'వర్ణ కూటమి',
      nameEnglish: 'Varna (Spiritual & Work Nature)',
      maxPoints: 1,
      scoredPoints: varnaScore,
      descriptionTelugu: 'ఇరువురి కర్మ స్వభావం మరియు ఆధ్యాత్మిక అవగాహన',
      descriptionEnglish: 'Mutual work ethic and spiritual compatibility',
    },
    {
      nameTelugu: 'వశ్య కూటమి',
      nameEnglish: 'Vashya (Mutual Attraction)',
      maxPoints: 2,
      scoredPoints: vashyaScore,
      descriptionTelugu: 'దంపతుల మధ్య అనురాగం మరియు ఆకర్షణ బలం',
      descriptionEnglish: 'Mutual affection and magnetic harmony',
    },
    {
      nameTelugu: 'తారా కూటమి',
      nameEnglish: 'Tara (Destiny & Longevity)',
      maxPoints: 3,
      scoredPoints: taraScore,
      descriptionTelugu: 'ఆయుర్దాయం, అదృష్టం మరియు శుభ ఫలితాల స్థితి',
      descriptionEnglish: 'Health, fortune, and auspicious destiny alignment',
    },
    {
      nameTelugu: 'యోని కూటమి',
      nameEnglish: 'Yoni (Intimacy & Temperament)',
      maxPoints: 4,
      scoredPoints: yoniScore,
      descriptionTelugu: 'శారీరక, మానసిక స్వభావ పొంతన',
      descriptionEnglish: 'Natural temperament and biological harmony',
    },
    {
      nameTelugu: 'గ్రహ మైత్రి',
      nameEnglish: 'Graha Maitri (Planetary Friendship)',
      maxPoints: 5,
      scoredPoints: maitriScore,
      descriptionTelugu: 'రాశ్యాధిపతుల మధ్య మిత్రత్వం మరియు మానసిక ఐక్యత',
      descriptionEnglish: 'Psychological harmony between Rashi ruling lords',
    },
    {
      nameTelugu: 'గణ కూటమి',
      nameEnglish: 'Gana (Core Disposition)',
      maxPoints: 6,
      scoredPoints: ganaScore,
      descriptionTelugu: 'దేవ, మనుష్య, రాక్షస గణ స్వభావాల పొంతన',
      descriptionEnglish: 'Alignment of core life values and behavior',
    },
    {
      nameTelugu: 'భకూట (రాశి కూటమి)',
      nameEnglish: 'Bhakoot (Family & Prosperity)',
      maxPoints: 7,
      scoredPoints: bhakootScore,
      descriptionTelugu: bhakootExemptionActive
        ? 'రాశ్యాధిపతుల మిత్రత్వం వల్ల భకూట దోష పరిహారం (శుభం)'
        : 'కుటుంబ వృద్ధి, ఆర్థిక పురోగతి మరియు అన్యోన్యత',
      descriptionEnglish: bhakootExemptionActive
        ? 'Bhakoot conflict neutralized by friendly Rashi lords'
        : 'Financial growth, family welfare, and emotional bond',
    },
    {
      nameTelugu: 'నాడీ కూటమి',
      nameEnglish: 'Nadi (Vital Energy & Progeny)',
      maxPoints: 8,
      scoredPoints: nadiScore,
      descriptionTelugu: 'ఆరోగ్యం, జీవశక్తి మరియు సంతాన సౌభాగ్యం',
      descriptionEnglish: 'Genetic vitality, health, and progeny blessing',
    },
  ];

  const totalScore = kootas.reduce((acc, k) => acc + k.scoredPoints, 0);

  // 5 Classical Pillars of Marriage (Saubhagya, Santati, Swasthya, Sampatti, Samaj)
  const saubhagyaPct = Math.min(98, Math.round(((maitriScore + vashyaScore + taraScore) / 10) * 95));
  const santatiPct = Math.min(98, Math.round(((nadiScore + bhakootScore + yoniScore) / 19) * 92 + 8));
  const swasthyaPct = Math.min(98, Math.round(((nadiScore + taraScore) / 11) * 90 + 10));
  const sampattiPct = Math.min(98, Math.round(((bhakootScore + maitriScore + varnaScore) / 13) * 92 + 8));
  const samajPct = Math.min(98, Math.round(((ganaScore + maitriScore + varnaScore) / 12) * 92 + 8));

  const panchaYogas: PanchaKalyanaPillar[] = [
    {
      id: 'saubhagya',
      titleTe: '1. సౌభాగ్య యోగం (అన్యోన్యత & దీర్ఘాయుష్షు)',
      titleEn: '1. Saubhagya Yoga (Mutual Longevity & Bond)',
      scorePct: saubhagyaPct,
      summaryTe: 'భార్యాభర్తల మధ్య మానసిక అనుబంధం, పరస్పర గౌరవం మరియు దీర్ఘకాల దాంపత్య స్థిరత్వం.',
      summaryEn: 'Emotional companionship, mutual understanding, and lifelong marital longevity.',
    },
    {
      id: 'santati',
      titleTe: '2. సంతతి యోగం (సంతాన సౌభాగ్యం)',
      titleEn: '2. Santati Yoga (Progeny & Lineage)',
      scorePct: santatiPct,
      summaryTe: 'సత్సంతాన ప్రాప్తి, పిల్లల విద్యాభివృద్ధి మరియు తల్లిదండ్రుల పట్ల భక్తి శ్రద్ధలు.',
      summaryEn: 'Healthy progeny, children’s educational excellence, and family continuity.',
    },
    {
      id: 'swasthya',
      titleTe: '3. స్వాస్థ్య యోగం (ఆరోగ్య సమన్వయం)',
      titleEn: '3. Swasthya Yoga (Health & Vitality)',
      scorePct: swasthyaPct,
      summaryTe: 'దంపతులిద్దరి శారీరక-మానసిక ఆరోగ్య బలం మరియు నాడీ శక్తి సమతుల్యత.',
      summaryEn: 'Physical vitality, constitutional harmony, and domestic well-being.',
    },
    {
      id: 'sampatti',
      titleTe: '4. సంపత్తి యోగం (గృహ & ఆర్థిక వృద్ధి)',
      titleEn: '4. Sampatti Yoga (Wealth & Prosperity)',
      scorePct: sampattiPct,
      summaryTe: 'వివాహానంతరం ధన సంపాదన, గృహ-వాహన యోగం మరియు ఆర్థిక భద్రత.',
      summaryEn: 'Post-marriage financial growth, property acquisition, and material security.',
    },
    {
      id: 'samaj',
      titleTe: '5. సమాజ యోగం (కుటుంబ & సంఘ గౌరవం)',
      titleEn: '5. Samaj Yoga (Family & Social Harmony)',
      scorePct: samajPct,
      summaryTe: 'అత్తవారింటితో మరియు బంధుమిత్రులతో సఖ్యత, సమాజంలో గౌరవ మర్యాదలు.',
      summaryEn: 'Cordial ties with extended families and strong social standing.',
    },
  ];

  let status: 'excellent' | 'good' | 'moderate' | 'caution' = 'good';
  let verdictTelugu = '';
  let verdictEnglish = '';
  let recommendationTelugu = '';
  let recommendationEnglish = '';

  if (totalScore >= 26) {
    status = 'excellent';
    verdictTelugu = 'ఉత్తమ వివాహ పొంతన ( శ్రేష్ఠమైన గుణ మిలనం )';
    verdictEnglish = 'Excellent Compatibility (Uttama Guna Milan)';
    recommendationTelugu = 'ఈ రెండు రాశుల మధ్య గ్రహ మైత్రి మరియు అష్టకూట బలం చాలా శ్రేష్ఠంగా ఉంది. వివాహానికి మరియు భాగస్వామ్యానికి అత్యంత అనుకూలం.';
    recommendationEnglish = 'Strong planetary friendship and Ashtakoota harmony. Highly auspicious for marriage and long-term partnership.';
  } else if (totalScore >= 18) {
    status = 'good';
    verdictTelugu = 'శుభ పొంతన ( మధ్యమ / అనుకూల గుణ మిలనం )';
    verdictEnglish = 'Good Compatibility (Auspicious Match)';
    recommendationTelugu = 'శాస్త్రోక్తంగా 18 గుణాల కంటే ఎక్కువ వచ్చినందున వివాహానికి అనుకూలం. నక్షత్ర పాద భేదాలను కూడా పరిశీలించి ముహూర్తం నిర్ణయించవచ్చు.';
    recommendationEnglish = 'Scores above the classical 18-point threshold. Suitable for marriage after verifying exact Nakshatra Padas.';
  } else if (totalScore >= 14) {
    status = 'moderate';
    verdictTelugu = 'సాధారణ పొంతన ( గ్రహ శాంతి / పాద పరిశీలన అవసరం )';
    verdictEnglish = 'Moderate Match (Requires Nakshatra & Lagna Verification)';
    recommendationTelugu = 'రాశి పొంతన సాధారణంగా ఉంది. వ్యక్తిగత జన్మ కుండలిలోని లగ్నం, సప్తమ స్థానం మరియు గురు బలం పరిశీలించి నిర్ణయం తీసుకోవాలి.';
    recommendationEnglish = 'Average Rashi match. Full individual birth chart (Lagna, 7th house, and Jupiter strength) should be examined by Guruji.';
  } else {
    status = 'caution';
    verdictTelugu = 'తక్కువ గుణ బలం ( జ్యోతిష పరిహార పరిశీలన తప్పనిసరి )';
    verdictEnglish = 'Low Guna Score (Detailed Shastric Consultation Required)';
    recommendationTelugu = 'అష్టకూటములలో నాడీ లేదా భకూట దోష ప్రభావం కనిపిస్తోంది. శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే సంపూర్ణ జాతక పరిశీలన చేయించగలరు.';
    recommendationEnglish = 'Indicates Bhakoot or Nadi dosha tendencies. Please consult Sri Jallavaram Sai Dheeraj Sharma for remedies and chart analysis.';
  }

  return {
    totalScore,
    maxTotal: 36,
    kootas,
    verdictTelugu,
    verdictEnglish,
    recommendationTelugu,
    recommendationEnglish,
    status,
    panchaYogas,
    bhakootExemptionActive,
  };
}

export const RashiCompatibilityTool: React.FC<RashiCompatibilityProps> = ({
  defaultBrideRashi = 'mesham',
  defaultGroomRashi = 'vrushabham',
  onConsultGuruji,
}) => {
  const { language, t } = useLanguage();
  const [brideRashi, setBrideRashi] = useState<string>(defaultBrideRashi);
  const [groomRashi, setGroomRashi] = useState<string>(defaultGroomRashi);

  // Advanced Nakshatra, Pada & Kuja House Selectors for Deep Shastric Verification
  const [brideNakId, setBrideNakId] = useState<number>(1); // Ashwini
  const [bridePada, setBridePada] = useState<number>(1);
  const [groomNakId, setGroomNakId] = useState<number>(4); // Rohini
  const [groomPada, setGroomPada] = useState<number>(2);

  const [brideKujaHouse, setBrideKujaHouse] = useState<number>(0);
  const [groomKujaHouse, setGroomKujaHouse] = useState<number>(0);

  const handleBrideRashiChange = (newRashi: string) => {
    setBrideRashi(newRashi);
    const meta = RASHI_METADATA[newRashi];
    if (meta) setBrideNakId(meta.defaultNakId);
  };

  const handleGroomRashiChange = (newRashi: string) => {
    setGroomRashi(newRashi);
    const meta = RASHI_METADATA[newRashi];
    if (meta) setGroomNakId(meta.defaultNakId);
  };

  const result = useMemo(
    () => calculateAshtakootaGunaMilan(brideRashi, groomRashi),
    [brideRashi, groomRashi]
  );

  // Deep Nakshatra, Nadi Exemption, Rajju & Kuja Dosha Balancing Analysis
  const deepShastricAnalysis = useMemo(() => {
    const bNak = NAKSHATRA_27_LIST.find((n) => n.id === brideNakId) || NAKSHATRA_27_LIST[0];
    const gNak = NAKSHATRA_27_LIST.find((n) => n.id === groomNakId) || NAKSHATRA_27_LIST[3];

    // 1. Nadi Check & Classical Exemptions (Pad-Vedh, Same Rashi Diff Star, Same Star Diff Rashi/Pada)
    const sameNadi = bNak.nadi === gNak.nadi;
    let nadiExemptionReasonTe = '';
    let nadiExemptionReasonEn = '';
    let isNadiSafe = !sameNadi;

    if (sameNadi) {
      if (brideRashi === groomRashi && bNak.id !== gNak.id) {
        isNadiSafe = true;
        nadiExemptionReasonTe =
          'ఏక రాశి – భిన్న నక్షత్ర నియమం: వధూవరులిద్దరి రాశి ఒకటే అయి నక్షత్రాలు వేరుగా ఉన్నందున ఏకనాడి దోషం వర్తించదు (శుభం).';
        nadiExemptionReasonEn =
          'Same Moon Sign with different birth stars neutralizes Nadi Dosha according to classical scriptures.';
      } else if (bNak.id === gNak.id && brideRashi !== groomRashi) {
        isNadiSafe = true;
        nadiExemptionReasonTe =
          'ఏక నక్షత్ర – భిన్న రాశి నియమం: నక్షత్రం ఒకటే అయి రాశులు వేరుగా ఉన్నందున ఏకనాడి దోషం పరిహరింపబడింది.';
        nadiExemptionReasonEn =
          'Common constellation spanning two different Moon Signs cancels Nadi Dosha.';
      } else if (bNak.id === gNak.id && bridePada !== groomPada) {
        isNadiSafe = true;
        nadiExemptionReasonTe = `పాద భేద మినహాయింపు: ఒకే నక్షత్రం అయినప్పటికీ పాదాలు వేరుగా (${bridePada}వ పాదం & ${groomPada}వ పాదం) ఉన్నందున వివాహానికి అనుకూలం.`;
        nadiExemptionReasonEn = `Different quarters (Pada ${bridePada} vs Pada ${groomPada}) mitigate single-star Nadi conflict.`;
      } else if (
        ((bridePada === 1 || bridePada === 4) && (groomPada === 2 || groomPada === 3)) ||
        ((bridePada === 2 || bridePada === 3) && (groomPada === 1 || groomPada === 4))
      ) {
        isNadiSafe = true;
        nadiExemptionReasonTe =
          'పాద-వేధ ఉపశమన నియమం: ఒకరి జన్మ నక్షత్రం 1/4 పాదాలలో, మరొకరిది 2/3 పాదాలలో ఉన్నందున నాడి దోష తీవ్రత తగ్గుతుంది.';
        nadiExemptionReasonEn =
          'Pad-Vedh quarter offset (1st/4th quarter paired with 2nd/3rd quarter) reduces Nadi Dosha intensity.';
      } else {
        nadiExemptionReasonTe =
          'ఇరువురిది ఒకే నాడి. వ్యక్తిగత నవాంశ (D9) మరియు గురు/శుక్ర బలం పరిశీలించి నాడి శాంతి జరిపించడం శ్రేయస్కరం.';
        nadiExemptionReasonEn =
          'Common Nadi detected; verify Navamsha chart strength and perform Nadi Shanti before marriage.';
      }
    } else {
      nadiExemptionReasonTe = `భిన్న నాడి శుద్ధి: వధువు (${bNak.nadi} నాడి) మరియు వరుడు (${gNak.nadi} నాడి) వేర్వేరు నాడులు కాబట్టి సంపూర్ణ ఆరోగ్య & సంతాన బలం (8/8).`;
      nadiExemptionReasonEn = `Distinct Nadis (${bNak.nadi} & ${gNak.nadi}) grant full 8/8 vitality and progeny harmony.`;
    }

    // 2. South Indian Tri-Rajju / Pancha-Rajju Check
    const sameRajju = bNak.rajju === gNak.rajju;
    const rajjuStatusTe = !sameRajju
      ? `భిన్న రజ్జు శుద్ధి: వధువు (${bNak.rajjuTe}) మరియు వరుడు (${gNak.rajjuTe}) వేర్వేరు రజ్జువులలో ఉన్నందున రజ్జు దోషం లేదు (దీర్ఘ మాంగల్య బలం).`
      : `ఏక రజ్జు గమనిక (${bNak.rajjuTe}): ఇద్దరి నక్షత్రాలు ఒకే రజ్జువులో ఉన్నాయి. అయితే రాశ్యాధిపతుల మైత్రి లేదా ఆరోహణ-అవరోహణ భేదం ఉంటే దోషం ఉండదు.`;
    const rajjuStatusEn = !sameRajju
      ? `Distinct Rajju groups (${bNak.rajju} vs ${gNak.rajju}) ensure strong marital longevity without Rajju Dosha.`
      : `Same Rajju group (${bNak.rajju}) noted; mitigated if Rashi lords are friendly or stars move in opposite Arohana/Avarohana directions.`;

    // 3. Kuja Dosha Percentage & Balancing Logic
    const bKuja = KUJA_HOUSE_OPTIONS.find((k) => k.house === brideKujaHouse) || KUJA_HOUSE_OPTIONS[0];
    const gKuja = KUJA_HOUSE_OPTIONS.find((k) => k.house === groomKujaHouse) || KUJA_HOUSE_OPTIONS[0];

    let kujaVerdictTe = '';
    let kujaVerdictEn = '';
    let kujaBalanced = true;

    if (bKuja.doshaPct === 0 && gKuja.doshaPct === 0) {
      kujaVerdictTe = 'ఉభయ జాతకాలలో కుజ దోషం లేదు — సంపూర్ణ శుభం (0% దోషం).';
      kujaVerdictEn = 'Both charts are completely free from Kuja / Manglik Dosha (0%).';
    } else if (bKuja.doshaPct > 0 && gKuja.doshaPct > 0) {
      kujaBalanced = true;
      kujaVerdictTe = `కుజ దోష సమతుల్యత (Dosha Samyam): వధువు (${bKuja.doshaPct}%) మరియు వరుడు (${gKuja.doshaPct}%) ఇద్దరి జాతకాలలో సమాన కుజ బలం ఉన్నందున దోష భంగం అయి వివాహం అత్యంత శుభప్రదంగా సాగుతుంది.`;
      kujaVerdictEn = `Mutual Kuja Dosha Cancellation: Parallel Mars placement in both charts (${bKuja.doshaPct}% & ${gKuja.doshaPct}%) neutralizes the affliction.`;
    } else {
      const activePct = Math.max(bKuja.doshaPct, gKuja.doshaPct);
      if (activePct <= 60 && result.totalScore >= 24) {
        kujaBalanced = true;
        kujaVerdictTe = `ముహూర్త గణపతి మినహాయింపు నియమం: ఒకరి జాతకంలో ${activePct}% స్వల్ప కుజ ప్రభావం ఉన్నప్పటికీ, అష్టకూట గుణాలు 24+ (${result.totalScore}/36) వచ్చినందున దోషం పరిహరింపబడింది.`;
        kujaVerdictEn = `Classical Muhurtha Exemption: Mild ${activePct}% Mars placement is automatically mitigated when Guna Milan exceeds 24 points (${result.totalScore}/36).`;
      } else {
        kujaBalanced = false;
        kujaVerdictTe = `ఒకరి జాతకంలో మాత్రమే ${activePct}% కుజ ప్రభావం ఉంది. గురు దృష్టి (Jupiter Aspect), నవాంశ (D9) స్థితి పరిశీలించి కుజ గ్రహ శాంతి / సుబ్రహ్మణ్య అభిషేకం జరిపించడం ఉత్తమం.`;
        kujaVerdictEn = `Single-side ${activePct}% Mars influence detected. Verify Jupiter’s benefic aspect in D1/D9 or perform Subrahmanya Kuja Shanti.`;
      }
    }

    // 4. Gana Dosha Exception Check ("మైత్రీ చేత్ గణ దోషో న విద్యతే")
    const bGana = bNak.gana;
    const gGana = gNak.gana;
    const isGanaConflict = (bGana === 'Rakshasa' && gGana !== 'Rakshasa') || (gGana === 'Rakshasa' && bGana !== 'Rakshasa');
    const maitriPts = result.kootas.find((k) => k.nameTelugu.includes('గ్రహ మైత్రి'))?.scoredPoints ?? 0;
    const isGanaExempted = isGanaConflict && maitriPts >= 4;
    const ganaStatusTe = !isGanaConflict
      ? 'గణ అనుకూలత: ఇరువర్గాల గణ స్వభావాలు అనుకూలంగా ఉన్నాయి (దోషం లేదు).'
      : isGanaExempted
      ? 'శాస్త్రోక్త గణ దోష మినహాయింపు (మైత్రీ చేత్ గణ దోషో న విద్యతే): రాశ్యాధిపతుల మధ్య బలమైన మిత్రత్వం (4+/5) ఉన్నందున గణ దోషం పూర్తిగా రద్దయింది.'
      : 'గణ భేదం: ఒకరిది రాక్షస గణం, మరొకరిది దేవ/మనుష్య గణం. పరస్పర సర్దుబాటు వైఖరి మరియు గురు ఆరాధన శ్రేయస్కరం.';
    const ganaStatusEn = !isGanaConflict
      ? 'Gana Harmony: Naturally compatible temperaments.'
      : isGanaExempted
      ? 'Gana Dosha Mitigated by High Planetary Friendship (Maitri Ched Gana Dosho Na Vidyate).'
      : 'Gana Friction: One partner possesses Rakshasa Gana; mutual patience and Jupiter worship recommended.';

    // 5. Bhakoot Dosha Exception Check ("షష్టాష్టకేపి మైత్రే సతి న దోషః")
    const bhakootKoota = result.kootas.find((k) => k.nameTelugu.includes('భకూట'));
    const isBhakootExempted = bhakootKoota?.descriptionTelugu.includes('పరిహారం') || false;
    const bhakootStatusTe = (bhakootKoota?.scoredPoints ?? 7) >= 7
      ? 'సంపూర్ణ భకూట శుద్ధి: రాశుల మధ్య ద్వి-ద్వాదశ, షష్టాష్టక దోషాలు లేవు (7/7 శుభం).'
      : isBhakootExempted
      ? 'భకూట దోష పరిహారం (షష్టాష్టకేపి మైత్రే సతి న దోషః): రాశ్యాధిపతుల పరస్పర మిత్రత్వం వల్ల సంసారానికి ఎలాంటి ఆటంకం లేదు.'
      : 'భకూట గమనిక: ద్వి-ద్వాదశ లేదా షష్టాష్టక స్థితి ఉంది. వివాహానంతరం పరస్పర ఆర్థిక పారదర్శకత మరియు శివపార్వతుల పూజ శుభకరం.';
    const bhakootStatusEn = (bhakootKoota?.scoredPoints ?? 7) >= 7
      ? 'Pure Bhakoot Harmony: Free from 2-12 or 6-8 rashi tensions (7/7).'
      : isBhakootExempted
      ? 'Bhakoot Conflict Neutralized: Planetary ruler friendship supersedes angular tension.'
      : 'Bhakoot Note: Angular difference observed; financial transparency and Shiva-Parvati worship recommended.';

    return {
      bNak,
      gNak,
      isNadiSafe,
      nadiExemptionReasonTe,
      nadiExemptionReasonEn,
      sameRajju,
      rajjuStatusTe,
      rajjuStatusEn,
      bKuja,
      gKuja,
      kujaBalanced,
      kujaVerdictTe,
      kujaVerdictEn,
      isGanaConflict,
      isGanaExempted,
      ganaStatusTe,
      ganaStatusEn,
      isBhakootExempted,
      bhakootStatusTe,
      bhakootStatusEn,
    };
  }, [brideNakId, bridePada, groomNakId, groomPada, brideRashi, groomRashi, brideKujaHouse, groomKujaHouse, result.totalScore, result.kootas]);

  const brideObj = RASHI_CHART_ORDER.find((r) => r.key === brideRashi) || RASHI_CHART_ORDER[0];
  const groomObj = RASHI_CHART_ORDER.find((r) => r.key === groomRashi) || RASHI_CHART_ORDER[1];

  const statusBadgeColors = {
    excellent: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    good: 'bg-amber-100 text-amber-900 border-amber-300',
    moderate: 'bg-orange-100 text-orange-900 border-orange-300',
    caution: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-5 sm:p-8 shadow-xl space-y-7 font-telugu">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Heart size={13} className="text-rose-600 fill-rose-600" />
            <span>
              {t(
                'అష్టకూట గుణ మిలనం • రజ్జు • నాడి మినహాయింపులు • కుజ దోష శాతం (%)',
                '36-Point Guna Milan • Rajju • Nadi Exemptions • Kuja Dosha %'
              )}
            </span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1.5">
            {t(
              'వధూవరుల 36 గుణాల వివాహ పొంతన & సప్తమ భావ దోష పరిహార గణన',
              'Complete Marriage Compatibility, 5-Pillar Yoga & Dosha Exemption Calculator'
            )}
          </h3>
        </div>
      </div>

      {/* Two Rashi + Nakshatra + Pada + Kuja Selectors */}
      <div className="grid sm:grid-cols-2 gap-6 bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80">
        {/* Input 1: Bride / Partner 1 */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <label className="block text-sm font-extrabold text-amber-950">
              👰 {t('వధువు వివరాలు (Bride Details)', 'Bride / Partner 1 Details')}
            </label>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {brideObj.name}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('1. వధువు జన్మ రాశి (Moon Sign):', '1. Bride Moon Sign (Rashi):')}
            </label>
            <select
              value={brideRashi}
              onChange={(e) => handleBrideRashiChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/50 border border-amber-300 text-amber-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {RASHI_CHART_ORDER.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.symbol} {language === 'te' ? `${r.name} (${r.english})` : `${r.english} (${r.name})`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('2. జన్మ నక్షత్రం:', '2. Birth Star:')}
              </label>
              <select
                value={brideNakId}
                onChange={(e) => setBrideNakId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm focus:outline-none"
              >
                {NAKSHATRA_27_LIST.map((n) => (
                  <option key={n.id} value={n.id}>
                    {language === 'te' ? `${n.id}. ${n.nameTe}` : `${n.id}. ${n.nameEn}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('పాదం:', 'Pada:')}
              </label>
              <select
                value={bridePada}
                onChange={(e) => setBridePada(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm focus:outline-none"
              >
                {[1, 2, 3, 4].map((p) => (
                  <option key={p} value={p}>
                    {p}వ పాదం
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('3. వధువు కుండలిలో కుజ స్థానం (ఐచ్ఛికం):', '3. Bride Mars (Kuja) House:')}
            </label>
            <select
              value={brideKujaHouse}
              onChange={(e) => setBrideKujaHouse(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 font-semibold text-xs focus:outline-none"
            >
              {KUJA_HOUSE_OPTIONS.map((opt) => (
                <option key={opt.house} value={opt.house}>
                  {language === 'te' ? opt.labelTe : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-slate-600 pt-1">
            {t('రాశ్యాధిపతి:', 'Ruling Lord:')} <strong>{brideObj.lord}</strong> · {t('రజ్జు:', 'Rajju:')}{' '}
            <strong>{deepShastricAnalysis.bNak.rajjuTe}</strong> · {t('దశా నాథుడు:', 'Dasha Lord:')}{' '}
            <strong>{deepShastricAnalysis.bNak.dashaLordTe}</strong>
          </p>
        </div>

        {/* Input 2: Groom / Partner 2 */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <label className="block text-sm font-extrabold text-amber-950">
              🤵 {t('వరుడి వివరాలు (Groom Details)', 'Groom / Partner 2 Details')}
            </label>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {groomObj.name}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('1. వరుడి జన్మ రాశి (Moon Sign):', '1. Groom Moon Sign (Rashi):')}
            </label>
            <select
              value={groomRashi}
              onChange={(e) => handleGroomRashiChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/50 border border-amber-300 text-amber-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {RASHI_CHART_ORDER.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.symbol} {language === 'te' ? `${r.name} (${r.english})` : `${r.english} (${r.name})`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('2. జన్మ నక్షత్రం:', '2. Birth Star:')}
              </label>
              <select
                value={groomNakId}
                onChange={(e) => setGroomNakId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm focus:outline-none"
              >
                {NAKSHATRA_27_LIST.map((n) => (
                  <option key={n.id} value={n.id}>
                    {language === 'te' ? `${n.id}. ${n.nameTe}` : `${n.id}. ${n.nameEn}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('పాదం:', 'Pada:')}
              </label>
              <select
                value={groomPada}
                onChange={(e) => setGroomPada(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm focus:outline-none"
              >
                {[1, 2, 3, 4].map((p) => (
                  <option key={p} value={p}>
                    {p}వ పాదం
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('3. వరుడి కుండలిలో కుజ స్థానం (ఐచ్ఛికం):', '3. Groom Mars (Kuja) House:')}
            </label>
            <select
              value={groomKujaHouse}
              onChange={(e) => setGroomKujaHouse(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 font-semibold text-xs focus:outline-none"
            >
              {KUJA_HOUSE_OPTIONS.map((opt) => (
                <option key={opt.house} value={opt.house}>
                  {language === 'te' ? opt.labelTe : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-slate-600 pt-1">
            {t('రాశ్యాధిపతి:', 'Ruling Lord:')} <strong>{groomObj.lord}</strong> · {t('రజ్జు:', 'Rajju:')}{' '}
            <strong>{deepShastricAnalysis.gNak.rajjuTe}</strong> · {t('దశా నాథుడు:', 'Dasha Lord:')}{' '}
            <strong>{deepShastricAnalysis.gNak.dashaLordTe}</strong>
          </p>
        </div>
      </div>

      {/* Score Summary Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-amber-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-600/50">
        <div className="space-y-2 text-center md:text-left">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${statusBadgeColors[result.status]}`}>
            {language === 'te' ? result.verdictTelugu : result.verdictEnglish}
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-amber-100">
            {brideObj.name} ({deepShastricAnalysis.bNak.nameTe}-{bridePada}) + {groomObj.name} ({deepShastricAnalysis.gNak.nameTe}-{groomPada})
          </h4>
          <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl leading-relaxed">
            {language === 'te' ? result.recommendationTelugu : result.recommendationEnglish}
          </p>
        </div>

        <div className="bg-amber-950/90 border-2 border-amber-400 rounded-2xl px-6 py-4 text-center shrink-0">
          <span className="text-xs text-amber-300 uppercase tracking-wider block">
            {t('మొత్తం గుణములు', 'Total Guna Score')}
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">
            {result.totalScore} <span className="text-lg text-amber-100">/ {result.maxTotal}</span>
          </span>
        </div>
      </div>

      {/* 8 Kootas Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {result.kootas.map((koota) => (
          <div
            key={koota.nameEnglish}
            className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-amber-950">
                  {language === 'te' ? koota.nameTelugu : koota.nameEnglish.split(' (')[0]}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {koota.scoredPoints} / {koota.maxPoints}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {language === 'te' ? koota.descriptionTelugu : koota.descriptionEnglish}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* NEW: 5 Pillars of Marriage (Pancha-Kalyana Yogas) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {t('పంచ-కళ్యాణ వివాహ యోగాల విశ్లేషణ • 5 Pillars of Marital Life', '5 Classical Pillars of Marital Harmony')}
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-amber-950">
              {t(
                'సౌభాగ్య, సంతతి, స్వాస్థ్య, సంపత్తి & సమాజ యోగాల బలం',
                'Saubhagya, Santati, Swasthya, Sampatti & Samaj Yoga Index'
              )}
            </h4>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {result.panchaYogas.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-xl p-3.5 border border-amber-200/90 shadow-2xs flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <strong className="text-xs sm:text-sm font-bold text-amber-950">
                    {language === 'te' ? pillar.titleTe : pillar.titleEn}
                  </strong>
                  <span className="text-xs font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {pillar.scorePct}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 rounded-full"
                    style={{ width: `${pillar.scorePct}%` }}
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  {language === 'te' ? pillar.summaryTe : pillar.summaryEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Smart Canonical Exceptions & Kuja Dosha Balancing Report (5 Pillars) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-700" />
          <h4 className="text-sm sm:text-base font-bold text-amber-950 uppercase tracking-wide">
            {t(
              'శాస్త్రోక్త మినహాయింపుల విశ్లేషణ ఇంజిన్ • Smart Canonical Exceptions & Remedies',
              'Smart Canonical Exceptions & Dosha Mitigation Engine'
            )}
          </h4>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Nadi Dosha & Pada-Vedh Exemption */}
          <div
            className={`rounded-2xl p-4 border ${
              deepShastricAnalysis.isNadiSafe
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-amber-50/80 border-amber-300'
            } space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">
                {t('1. నాడీ & పాద-వేధ మినహాయింపు', '1. Nadi & Pada-Vedh Exemption')}
              </span>
              <CheckCircle2
                size={16}
                className={deepShastricAnalysis.isNadiSafe ? 'text-emerald-700' : 'text-amber-700'}
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
              {language === 'te'
                ? deepShastricAnalysis.nadiExemptionReasonTe
                : deepShastricAnalysis.nadiExemptionReasonEn}
            </p>
          </div>

          {/* Card 2: Gana Dosha Exception */}
          <div
            className={`rounded-2xl p-4 border ${
              !deepShastricAnalysis.isGanaConflict || deepShastricAnalysis.isGanaExempted
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-amber-50/80 border-amber-300'
            } space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">
                {t('2. గణ దోష శాస్త్రోక్త నివృత్తి', '2. Gana Dosha Maitri Mitigation')}
              </span>
              <Users
                size={16}
                className={!deepShastricAnalysis.isGanaConflict || deepShastricAnalysis.isGanaExempted ? 'text-emerald-700' : 'text-amber-700'}
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
              {language === 'te'
                ? deepShastricAnalysis.ganaStatusTe
                : deepShastricAnalysis.ganaStatusEn}
            </p>
          </div>

          {/* Card 3: Bhakoot Dosha Exception */}
          <div
            className={`rounded-2xl p-4 border ${
              deepShastricAnalysis.isBhakootExempted || !deepShastricAnalysis.bhakootStatusTe.includes('గమనిక')
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-amber-50/80 border-amber-300'
            } space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">
                {t('3. భకూట దోష మిత్రత్వ ఉపశమనం', '3. Bhakoot Friendship Exemption')}
              </span>
              <Scale
                size={16}
                className={deepShastricAnalysis.isBhakootExempted || !deepShastricAnalysis.bhakootStatusTe.includes('గమనిక') ? 'text-emerald-700' : 'text-amber-700'}
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
              {language === 'te'
                ? deepShastricAnalysis.bhakootStatusTe
                : deepShastricAnalysis.bhakootStatusEn}
            </p>
          </div>

          {/* Card 4: South Indian Rajju & Dasha Sandhi Check */}
          <div
            className={`rounded-2xl p-4 border ${
              !deepShastricAnalysis.sameRajju
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-amber-50/80 border-amber-300'
            } space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">
                {t('4. దక్షిణ భారత రజ్జు బలం', '4. South Indian Rajju Longevity')}
              </span>
              <Shield
                size={16}
                className={!deepShastricAnalysis.sameRajju ? 'text-emerald-700' : 'text-amber-700'}
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
              {language === 'te'
                ? deepShastricAnalysis.rajjuStatusTe
                : deepShastricAnalysis.rajjuStatusEn}
            </p>
          </div>

          {/* Card 5: Kuja Dosha Percentage & Balancing */}
          <div
            className={`rounded-2xl p-4 border sm:col-span-2 lg:col-span-2 ${
              deepShastricAnalysis.kujaBalanced
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-rose-50/80 border-rose-300'
            } space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">
                {t('5. కుజ దోష శాతం (%) & సమతుల్యత (Dosha Samyam)', '5. Kuja Dosha % & Mutual Cancellation')}
              </span>
              <Flame
                size={16}
                className={deepShastricAnalysis.kujaBalanced ? 'text-emerald-700' : 'text-rose-700'}
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
              {language === 'te'
                ? deepShastricAnalysis.kujaVerdictTe
                : deepShastricAnalysis.kujaVerdictEn}
            </p>
          </div>
        </div>
      </div>

      {onConsultGuruji && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-950 text-white p-5 rounded-2xl border border-amber-700">
          <div className="space-y-1 text-center sm:text-left">
            <strong className="text-sm sm:text-base text-amber-200 block">
              {t(
                'సప్తమ భావం, నవాంశ (D9) & వివాహ ముహూర్త నిర్ణయం కోసం సంప్రదించండి',
                'Consult Brahmasri Jallavaram Sai Dheeraj Sharma for Complete D1/D9 Marriage Matching'
              )}
            </strong>
            <p className="text-xs text-amber-100/80">
              {t(
                'కేవలం రాశి నక్షత్రాలే కాకుండా వధూవరుల సప్తమ స్థానం, కుజ-శని-రాహు సమతుల్యత మరియు దశా సంధిని గురువుగారు స్వయంగా పరిశీలిస్తారు.',
                'Personalized verification of 7th house, Navamsha, Dasha-Sandhi, and auspicious wedding Muhurtham.'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onConsultGuruji(brideObj.name, groomObj.name, result.totalScore)}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
          >
            <span>{t('పూర్తి జాతక పొంతన కోసం వాట్సాప్ చేయండి', 'Consult Guruji on WhatsApp')}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
