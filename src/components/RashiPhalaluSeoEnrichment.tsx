import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Compass,
  Clock,
  Star,
  BookOpen,
} from 'lucide-react';
import { DayData } from '../types/panchangam';
import {
  RASHI_META_LIST,
  findMoonRashiIndex,
  getDailyRashiFortunes,
} from '../utils/panchangaLogic';
import { RashiGlyph } from './RashiGlyph';
import { useLanguage } from '../context/LanguageContext';

interface RashiPhalaluSeoEnrichmentProps {
  day: DayData;
  onJumpToRashi?: (rashiId: string) => void;
}

interface NakshatraRashiMapItem {
  nakshatraTe: string;
  nakshatraEn: string;
  rashiId: string;
  rashiTe: string;
  rashiEn: string;
  syllablesTe: string;
  syllablesEn: string[];
  deityTe: string;
}

const NAKSHATRA_TO_RASHI_LIST: NakshatraRashiMapItem[] = [
  {
    nakshatraTe: 'అశ్విని (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Ashwini (All 4 Padas)',
    rashiId: 'mesham',
    rashiTe: 'మేష రాశి',
    rashiEn: 'Mesha (Aries)',
    syllablesTe: 'చూ, చే, చో, లా',
    syllablesEn: ['chu', 'che', 'cho', 'la'],
    deityTe: 'అశ్వినీ దేవతలు • సుబ్రహ్మణ్య ఆరాధన',
  },
  {
    nakshatraTe: 'భరణి (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Bharani (All 4 Padas)',
    rashiId: 'mesham',
    rashiTe: 'మేష రాశి',
    rashiEn: 'Mesha (Aries)',
    syllablesTe: 'లీ, లూ, లే, లో',
    syllablesEn: ['li', 'lu', 'le', 'lo'],
    deityTe: 'యమధర్మరాజు • లక్ష్మీ నరసింహ ఆరాధన',
  },
  {
    nakshatraTe: 'కృత్తిక (1వ పాదం)',
    nakshatraEn: 'Krittika (Pada 1)',
    rashiId: 'mesham',
    rashiTe: 'మేష రాశి',
    rashiEn: 'Mesha (Aries)',
    syllablesTe: 'ఆ',
    syllablesEn: ['a', 'aa'],
    deityTe: 'అగ్ని దేవుడు • సూర్య / కార్తికేయ ఆరాధన',
  },
  {
    nakshatraTe: 'కృత్తిక (2,3,4 పాదాలు)',
    nakshatraEn: 'Krittika (Padas 2,3,4)',
    rashiId: 'vrushabham',
    rashiTe: 'వృషభ రాశి',
    rashiEn: 'Vrushabha (Taurus)',
    syllablesTe: 'ఈ, ఊ, ఏ',
    syllablesEn: ['i', 'ee', 'u', 'oo', 'e'],
    deityTe: 'అగ్ని దేవుడు • మహాలక్ష్మి ఆరాధన',
  },
  {
    nakshatraTe: 'రోహిణి (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Rohini (All 4 Padas)',
    rashiId: 'vrushabham',
    rashiTe: 'వృషభ రాశి',
    rashiEn: 'Vrushabha (Taurus)',
    syllablesTe: 'ఓ, వా, వీ, వూ',
    syllablesEn: ['o', 'va', 'vi', 'vee', 'vu'],
    deityTe: 'బ్రహ్మ దేవుడు • శ్రీకృష్ణ / వేంకటేశ్వర ఆరాధన',
  },
  {
    nakshatraTe: 'మృగశిర (1,2 పాదాలు)',
    nakshatraEn: 'Mrigashira (Padas 1,2)',
    rashiId: 'vrushabham',
    rashiTe: 'వృషభ రాశి',
    rashiEn: 'Vrushabha (Taurus)',
    syllablesTe: 'వే, వో',
    syllablesEn: ['ve', 'vo'],
    deityTe: 'చంద్రుడు • గౌరీ / లక్ష్మీ ఆరాధన',
  },
  {
    nakshatraTe: 'మృగశిర (3,4 పాదాలు)',
    nakshatraEn: 'Mrigashira (Padas 3,4)',
    rashiId: 'mithunam',
    rashiTe: 'మిథున రాశి',
    rashiEn: 'Mithuna (Gemini)',
    syllablesTe: 'కా, కీ',
    syllablesEn: ['ka', 'ki', 'kee'],
    deityTe: 'చంద్రుడు • మహావిష్ణు ఆరాధన',
  },
  {
    nakshatraTe: 'ఆర్ద్ర (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Ardra (All 4 Padas)',
    rashiId: 'mithunam',
    rashiTe: 'మిథున రాశి',
    rashiEn: 'Mithuna (Gemini)',
    syllablesTe: 'కూ, ఖం, ఙ, ఛా',
    syllablesEn: ['ku', 'kham', 'nga', 'cha'],
    deityTe: 'రుద్రుడు • శివ రుద్రాభిషేకం',
  },
  {
    nakshatraTe: 'పునర్వసు (1,2,3 పాదాలు)',
    nakshatraEn: 'Punarvasu (Padas 1,2,3)',
    rashiId: 'mithunam',
    rashiTe: 'మిథున రాశి',
    rashiEn: 'Mithuna (Gemini)',
    syllablesTe: 'కే, కో, హా',
    syllablesEn: ['ke', 'ko', 'ha'],
    deityTe: 'అదితి • శ్రీరామ ఆరాధన',
  },
  {
    nakshatraTe: 'పునర్వసు (4వ పాదం)',
    nakshatraEn: 'Punarvasu (Pada 4)',
    rashiId: 'karkatakam',
    rashiTe: 'కర్కాటక రాశి',
    rashiEn: 'Karkataka (Cancer)',
    syllablesTe: 'హీ',
    syllablesEn: ['hi', 'hee'],
    deityTe: 'అదితి • గౌరీ / శివ ఆరాధన',
  },
  {
    nakshatraTe: 'పుష్యమి (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Pushyami (All 4 Padas)',
    rashiId: 'karkatakam',
    rashiTe: 'కర్కాటక రాశి',
    rashiEn: 'Karkataka (Cancer)',
    syllablesTe: 'హూ, హే, హో, డా',
    syllablesEn: ['hu', 'he', 'ho', 'da'],
    deityTe: 'బృహస్పతి • దక్షిణామూర్తి / లక్ష్మీ ఆరాధన',
  },
  {
    nakshatraTe: 'ఆశ్లేష (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Ashlesha (All 4 Padas)',
    rashiId: 'karkatakam',
    rashiTe: 'కర్కాటక రాశి',
    rashiEn: 'Karkataka (Cancer)',
    syllablesTe: 'డీ, డూ, డే, డో',
    syllablesEn: ['di', 'du', 'de', 'do'],
    deityTe: 'నాగ దేవతలు • సుబ్రహ్మణ్య ఆరాధన',
  },
  {
    nakshatraTe: 'మఖ (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Magha (All 4 Padas)',
    rashiId: 'simham',
    rashiTe: 'సింహ రాశి',
    rashiEn: 'Simha (Leo)',
    syllablesTe: 'మా, మీ, మూ, మే',
    syllablesEn: ['ma', 'mi', 'mu', 'me'],
    deityTe: 'పితృ దేవతలు • సూర్య నారాయణ ఆరాధన',
  },
  {
    nakshatraTe: 'పుబ్బ / పూర్వ ఫల్గుణి (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Purva Phalguni (All 4 Padas)',
    rashiId: 'simham',
    rashiTe: 'సింహ రాశి',
    rashiEn: 'Simha (Leo)',
    syllablesTe: 'మో, టా, టీ, టూ',
    syllablesEn: ['mo', 'ta', 'ti', 'tu'],
    deityTe: 'భగుడు • లలితా / సూర్య ఆరాధన',
  },
  {
    nakshatraTe: 'ఉత్తర ఫల్గుణి (1వ పాదం)',
    nakshatraEn: 'Uttara Phalguni (Pada 1)',
    rashiId: 'simham',
    rashiTe: 'సింహ రాశి',
    rashiEn: 'Simha (Leo)',
    syllablesTe: 'టే',
    syllablesEn: ['te'],
    deityTe: 'అర్యముడు • ఆదిత్య హృదయ పారాయణ',
  },
  {
    nakshatraTe: 'ఉత్తర ఫల్గుణి (2,3,4 పాదాలు)',
    nakshatraEn: 'Uttara Phalguni (Padas 2,3,4)',
    rashiId: 'kanya',
    rashiTe: 'కన్యా రాశి',
    rashiEn: 'Kanya (Virgo)',
    syllablesTe: 'టో, పా, పీ',
    syllablesEn: ['to', 'pa', 'pi', 'pee'],
    deityTe: 'అర్యముడు • వేంకటేశ్వర ఆరాధన',
  },
  {
    nakshatraTe: 'హస్త (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Hasta (All 4 Padas)',
    rashiId: 'kanya',
    rashiTe: 'కన్యా రాశి',
    rashiEn: 'Kanya (Virgo)',
    syllablesTe: 'పూ, షం, ణా, ఠా',
    syllablesEn: ['pu', 'sha', 'shri', 'sri', 'na', 'tha'],
    deityTe: 'సవితృ (సూర్యుడు) • గాయత్రీ / విష్ణు ఆరాధన',
  },
  {
    nakshatraTe: 'చిత్త (1,2 పాదాలు)',
    nakshatraEn: 'Chitta (Padas 1,2)',
    rashiId: 'kanya',
    rashiTe: 'కన్యా రాశి',
    rashiEn: 'Kanya (Virgo)',
    syllablesTe: 'పే, పో',
    syllablesEn: ['pe', 'po'],
    deityTe: 'త్వష్ట • లక్ష్మీ నరసింహ ఆరాధన',
  },
  {
    nakshatraTe: 'చిత్త (3,4 పాదాలు)',
    nakshatraEn: 'Chitta (Padas 3,4)',
    rashiId: 'tula',
    rashiTe: 'తులా రాశి',
    rashiEn: 'Tula (Libra)',
    syllablesTe: 'రా, రీ',
    syllablesEn: ['ra', 'ri', 'ree'],
    deityTe: 'త్వష్ట • మహాలక్ష్మి ఆరాధన',
  },
  {
    nakshatraTe: 'స్వాతి (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Swati (All 4 Padas)',
    rashiId: 'tula',
    rashiTe: 'తులా రాశి',
    rashiEn: 'Tula (Libra)',
    syllablesTe: 'రూ, రే, రో, తా',
    syllablesEn: ['ru', 're', 'ro', 'ta'],
    deityTe: 'వాయు దేవుడు • నరసింహ / ఆంజనేయ ఆరాధన',
  },
  {
    nakshatraTe: 'విశాఖ (1,2,3 పాదాలు)',
    nakshatraEn: 'Vishakha (Padas 1,2,3)',
    rashiId: 'tula',
    rashiTe: 'తులా రాశి',
    rashiEn: 'Tula (Libra)',
    syllablesTe: 'తీ, తూ, తే',
    syllablesEn: ['ti', 'tu', 'te'],
    deityTe: 'ఇంద్రాగ్నులు • సుబ్రహ్మణ్య / లక్ష్మీ ఆరాధన',
  },
  {
    nakshatraTe: 'విశాఖ (4వ పాదం)',
    nakshatraEn: 'Vishakha (Pada 4)',
    rashiId: 'vruschikam',
    rashiTe: 'వృశ్చిక రాశి',
    rashiEn: 'Vruschika (Scorpio)',
    syllablesTe: 'తో',
    syllablesEn: ['to'],
    deityTe: 'ఇంద్రాగ్నులు • కార్తికేయ ఆరాధన',
  },
  {
    nakshatraTe: 'అనూరాధ (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Anuradha (All 4 Padas)',
    rashiId: 'vruschikam',
    rashiTe: 'వృశ్చిక రాశి',
    rashiEn: 'Vruschika (Scorpio)',
    syllablesTe: 'నా, నీ, నూ, నే',
    syllablesEn: ['na', 'ni', 'nee', 'nu', 'ne'],
    deityTe: 'మిత్రుడు • లక్ష్మీ నారాయణ ఆరాధన',
  },
  {
    nakshatraTe: 'జ్యేష్ఠ (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Jyeshtha (All 4 Padas)',
    rashiId: 'vruschikam',
    rashiTe: 'వృశ్చిక రాశి',
    rashiEn: 'Vruschika (Scorpio)',
    syllablesTe: 'నో, యా, యీ, యూ',
    syllablesEn: ['no', 'ya', 'yi', 'yu'],
    deityTe: 'ఇంద్రుడు • వేంకటేశ్వర / ఆంజనేయ ఆరాధన',
  },
  {
    nakshatraTe: 'మూల (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Moola (All 4 Padas)',
    rashiId: 'dhanussu',
    rashiTe: 'ధనుస్సు రాశి',
    rashiEn: 'Dhanussu (Sagittarius)',
    syllablesTe: 'యే, యో, భా, భీ',
    syllablesEn: ['ye', 'yo', 'bha', 'bhi'],
    deityTe: 'నిరృతి • ఆంజనేయ / దత్తాత్రేయ ఆరాధన',
  },
  {
    nakshatraTe: 'పూర్వాషాఢ (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Purvashadha (All 4 Padas)',
    rashiId: 'dhanussu',
    rashiTe: 'ధనుస్సు రాశి',
    rashiEn: 'Dhanussu (Sagittarius)',
    syllablesTe: 'భూ, ధా, ఫా, ఢా',
    syllablesEn: ['bhu', 'dha', 'pha', 'dha'],
    deityTe: 'ఆపః (జల దేవత) • దక్షిణామూర్తి ఆరాధన',
  },
  {
    nakshatraTe: 'ఉత్తరాషాఢ (1వ పాదం)',
    nakshatraEn: 'Uttarashadha (Pada 1)',
    rashiId: 'dhanussu',
    rashiTe: 'ధనుస్సు రాశి',
    rashiEn: 'Dhanussu (Sagittarius)',
    syllablesTe: 'భే',
    syllablesEn: ['bhe'],
    deityTe: 'విశ్వేదేవతలు • గణపతి / గురు ఆరాధన',
  },
  {
    nakshatraTe: 'ఉత్తరాషాఢ (2,3,4 పాదాలు)',
    nakshatraEn: 'Uttarashadha (Padas 2,3,4)',
    rashiId: 'makaram',
    rashiTe: 'మకర రాశి',
    rashiEn: 'Makara (Capricorn)',
    syllablesTe: 'భో, జా, జీ',
    syllablesEn: ['bho', 'ja', 'ji', 'jee'],
    deityTe: 'విశ్వేదేవతలు • వేంకటేశ్వర / శని ఆరాధన',
  },
  {
    nakshatraTe: 'శ్రవణం (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Shravana (All 4 Padas)',
    rashiId: 'makaram',
    rashiTe: 'మకర రాశి',
    rashiEn: 'Makara (Capricorn)',
    syllablesTe: 'జూ, జే, జో, ఖా',
    syllablesEn: ['ju', 'je', 'jo', 'kha'],
    deityTe: 'శ్రీ మహావిష్ణువు • వేంకటేశ్వర ఆరాధన',
  },
  {
    nakshatraTe: 'ధనిష్ఠ (1,2 పాదాలు)',
    nakshatraEn: 'Dhanishtha (Padas 1,2)',
    rashiId: 'makaram',
    rashiTe: 'మకర రాశి',
    rashiEn: 'Makara (Capricorn)',
    syllablesTe: 'గా, గీ',
    syllablesEn: ['ga', 'gi', 'gee'],
    deityTe: 'అష్ట వసువులు • శివ / సుబ్రహ్మణ్య ఆరాధన',
  },
  {
    nakshatraTe: 'ధనిష్ఠ (3,4 పాదాలు)',
    nakshatraEn: 'Dhanishtha (Padas 3,4)',
    rashiId: 'kumbham',
    rashiTe: 'కుంభ రాశి',
    rashiEn: 'Kumbha (Aquarius)',
    syllablesTe: 'గూ, గే',
    syllablesEn: ['gu', 'ge'],
    deityTe: 'అష్ట వసువులు • శివ / ఆంజనేయ ఆరాధన',
  },
  {
    nakshatraTe: 'శతభిషం (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Shatabhisha (All 4 Padas)',
    rashiId: 'kumbham',
    rashiTe: 'కుంభ రాశి',
    rashiEn: 'Kumbha (Aquarius)',
    syllablesTe: 'గో, సా, సీ, సూ',
    syllablesEn: ['go', 'sa', 'si', 'see', 'su', 'sai'],
    deityTe: 'వరుణ దేవుడు • మృత్యుంజయ / శివ ఆరాధన',
  },
  {
    nakshatraTe: 'పూర్వాభాద్ర (1,2,3 పాదాలు)',
    nakshatraEn: 'Purvabhadra (Padas 1,2,3)',
    rashiId: 'kumbham',
    rashiTe: 'కుంభ రాశి',
    rashiEn: 'Kumbha (Aquarius)',
    syllablesTe: 'సే, సో, దా',
    syllablesEn: ['se', 'so', 'da'],
    deityTe: 'అజైకపాదుడు • దక్షిణామూర్తి / శివ ఆరాధన',
  },
  {
    nakshatraTe: 'పూర్వాభాద్ర (4వ పాదం)',
    nakshatraEn: 'Purvabhadra (Pada 4)',
    rashiId: 'meenam',
    rashiTe: 'మీన రాశి',
    rashiEn: 'Meena (Pisces)',
    syllablesTe: 'దీ',
    syllablesEn: ['di', 'dee'],
    deityTe: 'అజైకపాదుడు • దత్తాత్రేయ ఆరాధన',
  },
  {
    nakshatraTe: 'ఉత్తరాభాద్ర (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Uttarabhadra (All 4 Padas)',
    rashiId: 'meenam',
    rashiTe: 'మీన రాశి',
    rashiEn: 'Meena (Pisces)',
    syllablesTe: 'దూ, థ, ఝ, ఞ',
    syllablesEn: ['du', 'tha', 'jha', 'jna'],
    deityTe: 'అహిర్బుధ్న్యుడు • శివ / గురు ఆరాధన',
  },
  {
    nakshatraTe: 'రేవతి (1,2,3,4 పాదాలు)',
    nakshatraEn: 'Revati (All 4 Padas)',
    rashiId: 'meenam',
    rashiTe: 'మీన రాశి',
    rashiEn: 'Meena (Pisces)',
    syllablesTe: 'దే, దో, చా, చీ',
    syllablesEn: ['de', 'do', 'cha', 'chi'],
    deityTe: 'పూషణుడు • శ్రీ రంగనాథ / విష్ణు ఆరాధన',
  },
];

const RASHI_PHALALU_FAQS: { qTe: string; qEn: string; aTe: string; aEn: string }[] = [
  {
    qTe: '1. నేటి రాశి ఫలాలు జన్మ రాశి ప్రకారం చూడాలా లేక పిలిచే పేరు (నామ రాశి) ప్రకారం చూడాలా?',
    qEn: '1. Should I check Daily Rashi Phalalu by Birth Moon Sign (Janma Rashi) or Name Sign (Naama Rashi)?',
    aTe: 'వేద జ్యోతిషశాస్త్రం ప్రకారం మీకు పుట్టిన తేదీ, ఖచ్చితమైన సమయం మరియు జన్మ నక్షత్రం తెలిసినట్లయితే "జన్మ రాశి" (Moon Sign) ప్రకారమే దిన ఫలాలు, గోచార ఫలాలు మరియు వివాహ పొంతన చూడాలి. పుట్టిన సమయం తెలియని వారు, నిత్య వ్యవహారంలో పిలిచే పేరులోని మొదటి అక్షరం ఆధారంగా వచ్చే "నామ రాశి" (Name Sign) ప్రకారం రాశి ఫలాలు చూసుకోవచ్చు.',
    aEn: 'According to Vedic Astrology, if you know your exact birth date, time, and birth star, always check predictions using your Janma Rashi (Birth Moon Sign). If birth details are unknown, use your Naama Rashi based on the first syllable of your spoken name.',
  },
  {
    qTe: '2. చంద్రాష్టమం (Chandrashtamam) అంటే ఏమిటి? ఆ రోజు ఏ నియమాలు పాటించాలి?',
    qEn: '2. What is Chandrashtamam (8th House Moon Transit) and what precautions should be taken?',
    aTe: 'మీ జన్మ రాశి నుండి చంద్రుడు గోచార రీత్యా 8వ రాశిలో సంచరించే సుమారు 2¼ రోజుల (54 గంటల) కాలాన్ని "చంద్రాష్టమం" అంటారు. చంద్రుడు మనస్సుకు కారకుడు కాబట్టి ఈ సమయంలో అనవసర ఆందోళన, తొందరపాటు నిర్ణయాలు వచ్చే అవకాశం ఉంటుంది. అందుకే చంద్రాష్టమం ఉన్న రోజున కొత్త ఆర్థిక ఒప్పందాలు, వివాదాలు వాయిదా వేసి, శివారాధన లేదా చంద్ర కవచ పారాయణ చేయడం శ్రేయస్కరం.',
    aEn: 'When the transiting Moon passes through the 8th house from your natal Moon sign (for ~54 hours every month), it is called Chandrashtamam. Since the Moon governs the mind, avoid impulsive financial decisions or arguments on that day and chant Shiva Panchakshari.',
  },
  {
    qTe: '3. చంద్రబలం ఏయే స్థానాలలో శుభప్రదంగా ఉంటుంది?',
    qEn: '3. Which Lunar Transit houses give auspicious Chandrabalam?',
    aTe: 'గోచార శాస్త్ర సూత్రం ప్రకారం జన్మ రాశి నుండి చంద్రుడు 1 (జన్మం), 3 (తృతీయం), 6 (షష్ఠం), 7 (సప్తమం), 10 (దశమం), మరియు 11 (లాభం) స్థానాలలో సంచరించే రోజులలో సంపూర్ణ చంద్రబలం ఉంటుంది. ఈ రోజులలో చేపట్టిన పనులు, ప్రయాణాలు మరియు ఆర్థిక ప్రయత్నాలు త్వరగా ఫలిస్తాయి.',
    aEn: 'In Vedic Gochara Shastra, when the Moon transits the 1st, 3rd, 6th, 7th, 10th, or 11th house from your Janma Rashi, it confers strong Chandrabalam—bringing mental clarity, financial gain, and success in undertakings.',
  },
  {
    qTe: '4. ఒకే రాశిలో పుట్టిన ఇద్దరు వ్యక్తులకు ఒకే రోజు ఫలితాలు ఎందుకు భిన్నంగా ఉంటాయి?',
    qEn: '4. Why do two people born in the same Rashi experience different results on the same day?',
    aTe: 'దిన ఫలాలు (Daily Rashi Phalalu) అనేవి చంద్ర గోచారంపై ఆధారపడిన సాధారణ గ్రహ వాతావరణ సూచికలు. అయితే ప్రతి వ్యక్తికి జన్మ లగ్నం (Ascendant), జన్మ కుండలిలో గ్రహాల డిగ్రీలు మరియు ప్రస్తుతం నడుస్తున్న వింశోత్తరి మహాదశ–అంతర్దశ వేర్వేరుగా ఉంటాయి. గోచార ఫలితాలకు మీ వ్యక్తిగత దశాబలం తోడైనప్పుడే పూర్తి ఫలితం నిర్ధారణ అవుతుంది.',
    aEn: 'Daily Rashi Phalalu reflect general lunar transit weather for a Moon sign. However, two individuals of the same Rashi have different Ascendants (Lagna), natal planetary degrees, and active Vimshottari Mahadasha-Antardasha periods, which personalize the final outcome.',
  },
];

export const RashiPhalaluSeoEnrichment: React.FC<RashiPhalaluSeoEnrichmentProps> = ({
  day,
  onJumpToRashi,
}) => {
  const { language, t, tr } = useLanguage();
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedNakshatraIdx, setSelectedNakshatraIdx] = useState<number>(-1);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const moonRashiIdx = findMoonRashiIndex(day);
  const moonRashiMeta = RASHI_META_LIST[moonRashiIdx] || RASHI_META_LIST[0];
  const rashiCards = useMemo(() => getDailyRashiFortunes(day), [day]);

  const favorableRashis = rashiCards.filter((r) => r.status === 'favorable');
  const mixedRashis = rashiCards.filter((r) => r.status === 'mixed');
  const cautionRashis = rashiCards.filter((r) => r.status === 'caution');

  // Match user's typed name or selected Nakshatra to a Rashi
  const matchedRashiResult = useMemo(() => {
    if (selectedNakshatraIdx >= 0 && NAKSHATRA_TO_RASHI_LIST[selectedNakshatraIdx]) {
      const nakItem = NAKSHATRA_TO_RASHI_LIST[selectedNakshatraIdx];
      const fortune = rashiCards.find((r) => r.id === nakItem.rashiId);
      return { nakItem, fortune };
    }

    const q = nameInput.trim().toLowerCase();
    if (!q) return null;

    // Check Telugu syllable match first
    for (const item of NAKSHATRA_TO_RASHI_LIST) {
      const teSyls = item.syllablesTe.split(',').map((s) => s.trim());
      if (teSyls.some((syl) => syl && q.startsWith(syl.charAt(0)))) {
        const fortune = rashiCards.find((r) => r.id === item.rashiId);
        return { nakItem: item, fortune };
      }
    }

    // Check English prefix match (longest prefix first)
    let bestItem: NakshatraRashiMapItem | null = null;
    let bestLen = 0;
    for (const item of NAKSHATRA_TO_RASHI_LIST) {
      for (const enSyl of item.syllablesEn) {
        if (q.startsWith(enSyl) && enSyl.length > bestLen) {
          bestLen = enSyl.length;
          bestItem = item;
        }
      }
    }

    // Fallback by first English letter if needed
    if (!bestItem) {
      const firstChar = q.charAt(0);
      const letterFallbackMap: Record<string, string> = {
        a: 'mesham',
        b: 'dhanussu',
        c: 'mesham',
        d: 'meenam',
        e: 'vrushabham',
        g: 'kumbham',
        h: 'karkatakam',
        i: 'vrushabham',
        j: 'makaram',
        k: 'mithunam',
        l: 'mesham',
        m: 'simham',
        n: 'vruschikam',
        o: 'vrushabham',
        p: 'kanya',
        r: 'tula',
        s: 'kumbham',
        t: 'tula',
        u: 'vrushabham',
        v: 'vrushabham',
        y: 'dhanussu',
      };
      const fallbackRashiId = letterFallbackMap[firstChar];
      if (fallbackRashiId) {
        bestItem =
          NAKSHATRA_TO_RASHI_LIST.find((n) => n.rashiId === fallbackRashiId) || null;
      }
    }

    if (bestItem) {
      const fortune = rashiCards.find((r) => r.id === bestItem!.rashiId);
      return { nakItem: bestItem, fortune };
    }

    return null;
  }, [nameInput, selectedNakshatraIdx, rashiCards]);

  const cleanNak = day.panchanga.nakshatram.split('(')[0].split('-')[0].trim();

  return (
    <div className="space-y-8 min-w-0">
      {/* ===================================================================== */}
      {/* 0. GOOGLE POSITION #0 FEATURED SNIPPET (TELUGU + ENGLISH) & SERP BOX   */}
      {/* ===================================================================== */}
      <section
        id="rashi-phalalu-featured-snippet"
        aria-label="రాశి ఫలాలు – Today Rashi Phalalu in Telugu & English Featured Summary"
        className="bg-white border-2 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-md space-y-5"
      >
        <div className="border-b border-amber-200 pb-3">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-900 text-amber-100">
            raasi phalalu • rashi phalalu today in telugu • నేటి రాశి ఫలాలు
          </span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950 font-telugu mt-2">
            రాశి ఫలాలు – నేటి రాశి ఫలాలు (Today Rashi Phalalu in Telugu &amp; English – {tr(day.teediVaram)})
          </h2>
        </div>

        {/* Direct Bilingual Answer Paragraphs for Google Position #0 Featured Snippet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
              తెలుగు సారాంశం (Telugu Featured Snippet Text)
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong>రాశి ఫలాలు – నేటి రాశి ఫలాలు ({ day.teediVaram }):</strong> ఈ రోజు చంద్రుడు{' '}
              <strong>{moonRashiMeta.teluguName} రాశి</strong> ({cleanNak} నక్షత్రం) యందు సంచరిస్తున్నాడు. దృక్సిద్ధాంత గోచార చంద్రబలం ప్రకారం నేడు{' '}
              <strong>{favorableRashis.map((r) => r.teluguName).join(', ')}</strong> రాశుల వారికి విశేష కార్యసిద్ధి, ధనలాభం మరియు వృత్తి పురోగతి కలుగుతాయి. మేషం నుండి మీనం వరకు 12 రాశుల నేటి దిన ఫలాలు, శుభ సమయం, అదృష్ట సంఖ్య మరియు వైదిక పరిహారాలు క్రింద ఇవ్వబడ్డాయి.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 font-sans">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block">
              English Summary (Google English Search Snippet Text)
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong>Rashi Phalalu Today in Telugu (Rasi Phalalu – {day.teediVaram}):</strong> Today the Moon transits{' '}
              <strong>{moonRashiMeta.englishName} ({moonRashiMeta.teluguName})</strong> in {cleanNak} Nakshatra. Based on Drik Siddhanta Lunar Transit (Gochara Chandrabalam),{' '}
              <strong>{favorableRashis.map((r) => r.englishName.split(' ')[0]).join(', ')}</strong> signs enjoy favorable career growth and financial gains today. Read complete daily horoscope predictions for all 12 Rasis (Mesha to Meena) with lucky timings and remedies below.
            </p>
          </div>
        </div>

        {/* Live Google Search Snippet Preview (SERP Title + Description + 12 Rashi Sitelinks) */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              🔍 Google Search Snippet Preview (తెలుగు &amp; English SERP Display)
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              https://www.telugujyothisham.com/rashi-phalalu
            </span>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-1.5">
            <div className="text-xs text-slate-600 flex items-center gap-1.5 truncate">
              <span className="w-4 h-4 rounded-full bg-amber-900 text-amber-200 inline-flex items-center justify-center text-[9px] font-bold shrink-0">
                ఓం
              </span>
              <span className="font-semibold text-slate-800">Telugu Jyothisham</span>
              <span>› rashi-phalalu</span>
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-[#1a0dab] leading-snug">
              రాశి ఫలాలు – నేటి రాశి ఫలాలు | Rashi Phalalu Today Telugu
            </h3>
            <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed">
              <strong>రాశి ఫలాలు</strong> (<strong>Rashi Phalalu Today in Telugu</strong> / <strong>Rasi Phalalu</strong>): ఈ రోజు ({day.teediVaram}, {cleanNak}) మేషం నుండి మీనం వరకు 12 రాశుల <strong>నేటి రాశి ఫలాలు</strong>, చంద్రబలం, శుభ సమయం, అదృష్ట సంఖ్య &amp; వైదిక పరిహారాలు.
            </p>
            {/* 12 Rashi Sitelink Jump Pills (Matches ItemList Schema #rashi-mesham .. #rashi-meenam) */}
            <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
              {rashiCards.map((r) => (
                <a
                  key={r.id}
                  href={`#rashi-${r.id}`}
                  onClick={() => onJumpToRashi?.(r.id)}
                  className="text-[11px] font-bold text-[#1a0dab] hover:underline bg-blue-50/70 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200/70 transition-colors"
                >
                  {r.teluguName} ({r.englishName.split(' ')[0]})
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 1. TODAY'S CHANDRABALAM & CHANDRASHTAMAM LIVE SUMMARY BANNER           */}
      {/* ===================================================================== */}
      <section
        aria-label="నేటి చంద్రబలం మరియు చంద్రాష్టమ రాశుల విభజన"
        className="bg-gradient-to-br from-[#fff9f0] via-white to-amber-50/80 border-2 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-md"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-amber-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              {t('నేటి చంద్ర గోచార స్థితి • Daily Lunar Transit', 'Daily Lunar Transit Summary')}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950 font-telugu mt-2">
              {t(
                `నేడు చంద్రుడు ${moonRashiMeta.teluguName} రాశిలో సంచారం — 12 రాశుల చంద్రబలం`,
                `Today Moon Transits ${moonRashiMeta.englishName} (${moonRashiMeta.teluguName}) — 12-Rashi Chandrabalam`
              )}
            </h2>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-300 self-start sm:self-auto">
            {tr(day.panchanga.nakshatram)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Favorable Rashis Card */}
          <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs sm:text-sm mb-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>
                {t(
                  `శుభ చంద్రబలం గల రాశులు (${favorableRashis.length})`,
                  `Favorable Chandrabalam (${favorableRashis.length})`
                )}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mb-2.5">
              {t(
                'ఈ రాశుల వారికి నేడు (1, 3, 6, 7, 10, 11 చంద్ర స్థానాలు) కార్యసిద్ధి, ధనలాభం & ఉత్సాహం:',
                'Strong lunar support today for career, finance, and new initiatives:'
              )}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {favorableRashis.map((r) => (
                <a
                  key={r.id}
                  href="#dina-phalam"
                  onClick={() => onJumpToRashi?.(r.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold shadow-2xs transition-colors"
                >
                  <RashiGlyph rashi={r.id} size={12} className="text-emerald-700 shrink-0" />
                  <span>{language === 'en' ? r.englishName : r.teluguName}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Mixed Rashis Card */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs sm:text-sm mb-2">
              <Info size={16} className="text-amber-700 shrink-0" />
              <span>
                {t(
                  `మిశ్రమ ఫలితాలు గల రాశులు (${mixedRashis.length})`,
                  `Moderate / Mixed Transit (${mixedRashis.length})`
                )}
              </span>
            </div>
            <p className="text-[11px] text-amber-900 mb-2.5">
              {t(
                'ప్రణాళికాబద్ధమైన కృషితో పనులు పూర్తి చేసుకునే రాశులు (మిశ్రమ ఫలితం):',
                'Steady progress through planned effort and patience today:'
              )}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mixedRashis.map((r) => (
                <a
                  key={r.id}
                  href="#dina-phalam"
                  onClick={() => onJumpToRashi?.(r.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold shadow-2xs transition-colors"
                >
                  <RashiGlyph rashi={r.id} size={12} className="text-amber-700 shrink-0" />
                  <span>{language === 'en' ? r.englishName : r.teluguName}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Caution / Chandrashtamam Card */}
          <div className="bg-rose-50/80 border-2 border-rose-300 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-rose-950 font-extrabold text-xs sm:text-sm mb-2">
              <AlertTriangle size={16} className="text-rose-700 shrink-0" />
              <span>
                {t(
                  `చంద్రాష్టమం / జాగ్రత్త రాశులు (${cautionRashis.length})`,
                  `Chandrashtamam / Caution (${cautionRashis.length})`
                )}
              </span>
            </div>
            <p className="text-[11px] text-rose-900 mb-2.5">
              {t(
                'నేడు తొందరపాటు నిర్ణయాలు మాని, దైవారాధన & ఓర్పు పాటించవలసిన రాశులు:',
                'Practice patience, avoid hasty commitments, and chant daily mantras:'
              )}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cautionRashis.map((r) => (
                <a
                  key={r.id}
                  href="#dina-phalam"
                  onClick={() => onJumpToRashi?.(r.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-rose-100 text-rose-950 border border-rose-300 text-xs font-bold shadow-2xs transition-colors"
                >
                  <RashiGlyph rashi={r.id} size={12} className="text-rose-700 shrink-0" />
                  <span>{language === 'en' ? r.englishName : r.teluguName}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. INTERACTIVE NAME / NAKSHATRA TO RASHI FINDER ("నా రాశి ఏమిటి?")      */}
      {/* ===================================================================== */}
      <section
        aria-label="మీ పేరు లేదా నక్షత్రం ద్వారా మీ రాశిని తెలుసుకోండి"
        className="bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-500 shadow-lg"
      >
        <div className="max-w-3xl space-y-2 mb-5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400 text-amber-950">
            <Sparkles size={13} />
            <span>{t('తక్షణ రాశి చెకర్ • Instant Rashi Finder', 'Instant Rashi Finder')}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-100">
            {t(
              'మీ రాశి ఏమిటో తెలియదా? మీ పేరు లేదా జన్మ నక్షత్రంతో ఇప్పుడే తెలుసుకోండి',
              'Don’t Know Your Rashi? Find by Your Name or Birth Nakshatra'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            {t(
              'మీ పిలిచే పేరును (తెలుగు లేదా ఇంగ్లీష్‌లో) టైప్ చేయండి లేదా మీ జన్మ నక్షత్రాన్ని ఎంచుకోండి — వెంటనే మీ రాశి మరియు నేటి రాశి ఫలితం కనిపిస్తాయి.',
              'Type your spoken name or select your birth star (Nakshatra) to immediately see your Rashi and today’s prediction.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Type Name */}
          <div className="bg-amber-900/50 border border-amber-500/50 rounded-2xl p-4">
            <label className="block text-xs font-bold text-amber-200 mb-2">
              {t('1. మీ పేరు లేదా మొదటి అక్షరం టైప్ చేయండి:', '1. Type Your Name or First Syllable:')}
            </label>
            <div className="flex items-center gap-2 bg-amber-950 border border-amber-400/70 rounded-xl px-3.5 py-2.5">
              <Search size={16} className="text-amber-300 shrink-0" />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setSelectedNakshatraIdx(-1);
                }}
                placeholder={t('ఉదా: సాయి, రమేష్, లక్ష్మి, Kiran, Ravi...', 'e.g., Sai, Ramesh, Lakshmi, Kiran...')}
                className="w-full bg-transparent text-sm text-white placeholder-amber-300/60 focus:outline-none"
              />
              {nameInput && (
                <button
                  type="button"
                  onClick={() => setNameInput('')}
                  className="text-xs text-amber-300 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Option B: Pick Nakshatra */}
          <div className="bg-amber-900/50 border border-amber-500/50 rounded-2xl p-4">
            <label className="block text-xs font-bold text-amber-200 mb-2">
              {t('2. లేదా మీ జన్మ నక్షత్రాన్ని ఎంచుకోండి (27 నక్షత్రాలు):', '2. Or Select Your Birth Nakshatra:')}
            </label>
            <select
              value={selectedNakshatraIdx}
              onChange={(e) => {
                setSelectedNakshatraIdx(Number(e.target.value));
                setNameInput('');
              }}
              aria-label={t('జన్మ నక్షత్రం ఎంచుకోండి', 'Select Birth Nakshatra')}
              className="w-full bg-amber-950 border border-amber-400/70 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value={-1}>
                {t('-- మీ నక్షత్రం / పాదం ఎంచుకోండి --', '-- Select Your Nakshatra --')}
              </option>
              {NAKSHATRA_TO_RASHI_LIST.map((item, idx) => (
                <option key={idx} value={idx}>
                  {language === 'en'
                    ? `${item.nakshatraEn} → ${item.rashiEn} (${item.syllablesTe})`
                    : `${item.nakshatraTe} → ${item.rashiTe} (${item.syllablesTe})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Instant Matched Rashi Result Box */}
        {matchedRashiResult && matchedRashiResult.fortune && (
          <div className="mt-5 bg-gradient-to-r from-amber-100 via-white to-amber-50 text-amber-950 rounded-2xl p-4 sm:p-5 border-2 border-amber-400 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center shrink-0">
                  <RashiGlyph rashi={matchedRashiResult.fortune.id} size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block">
                    {t('మీ రాశి & నక్షత్ర వివరాలు • Your Rashi Match', 'Your Matched Rashi')}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-amber-950">
                    {language === 'en'
                      ? `${matchedRashiResult.fortune.englishName} (${matchedRashiResult.fortune.teluguName})`
                      : `${matchedRashiResult.fortune.teluguName} రాశి (${matchedRashiResult.fortune.englishName})`}
                  </h3>
                  <p className="text-xs text-slate-700">
                    {t('నక్షత్ర అక్షరాలు:', 'Syllables:')} <strong>{matchedRashiResult.nakItem.syllablesTe}</strong> •{' '}
                    {t('రాశ్యాధిపతి:', 'Lord:')} <strong>{matchedRashiResult.fortune.lord}</strong>
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-900 text-amber-100 text-xs font-bold self-start sm:self-auto">
                {language === 'en'
                  ? matchedRashiResult.fortune.statusLabelEn
                  : matchedRashiResult.fortune.statusLabel}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-2">
              <strong className="text-amber-950">{t('నేటి ఫలితం:', 'Today’s Prediction:')} </strong>
              {language === 'en'
                ? matchedRashiResult.fortune.grahaDrishtiPhalamEn
                : matchedRashiResult.fortune.grahaDrishtiPhalamTe}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-amber-900">
              <span>
                <strong>{t('శుభ సమయం:', 'Lucky Time:')}</strong>{' '}
                {matchedRashiResult.fortune.luckyTimeWindowTe} •{' '}
                <strong>{t('శుభ సంఖ్య:', 'Lucky #:')}</strong> #{matchedRashiResult.fortune.luckyNumber}
              </span>
              <a
                href="#dina-phalam"
                onClick={() => onJumpToRashi?.(matchedRashiResult.fortune!.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold text-xs transition-colors"
              >
                {t('పూర్తి రాశి ఫలితం కార్డ్ చూడండి ↑', 'View Full Rashi Card ↑')}
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ===================================================================== */}
      {/* 3. 12-RASHI QUICK COMPARISON SCOREBOARD (Mobile Cards + Desktop Table)*/}
      {/* ===================================================================== */}
      <section
        aria-label="12 రాశుల నేటి అదృష్ట సంఖ్యలు, రంగులు మరియు పరిహారాల పట్టిక"
        className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-md"
      >
        <div className="mb-5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            {t('12 రాశుల సమగ్ర పట్టిక • Quick Comparison Chart', '12-Rashi Quick Glance Table')}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-telugu mt-2">
            {t(
              'మేషం నుండి మీనం వరకు — నేటి అదృష్ట సమయం, రంగు, సంఖ్య & జప మంత్రం',
              'Mesha to Meena — Today’s Lucky Time, Color, Number & Vedic Mantra'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'మొబైల్‌లో అడ్డంగా స్క్రోల్ చేయాల్సిన అవసరం లేకుండా ప్రతి రాశి వివరాలు క్రింద స్పష్టంగా అందించబడ్డాయి.',
              'Quick reference guide for all 12 Rashis with lucky timings, colors, numbers, and daily mantras.'
            )}
          </p>
        </div>

        {/* Mobile Stacked Cards (< sm) — Zero Horizontal Panning */}
        <div className="sm:hidden space-y-3">
          {rashiCards.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <RashiGlyph rashi={r.id} size={16} className="text-amber-800 shrink-0" />
                  <strong className="text-sm font-extrabold text-amber-950">
                    {language === 'en' ? r.englishName : `${r.teluguName} రాశి`}
                  </strong>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900">
                  {language === 'en' ? r.statusLabelEn : r.statusLabel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">
                    {t('శుభ సమయం', 'Lucky Time')}
                  </span>
                  <strong className="text-slate-900">
                    {language === 'en' ? r.luckyTimeWindowEn : r.luckyTimeWindowTe}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">
                    {t('రంగు & సంఖ్య', 'Color & #')}
                  </span>
                  <strong className="text-slate-900">
                    {language === 'en' ? r.luckyColorEn : r.luckyColor} • #{r.luckyNumber}
                  </strong>
                </div>
              </div>
              <div className="text-xs text-amber-950 bg-white/90 rounded-xl px-2.5 py-1.5 border border-amber-200/70">
                <strong>{t('మంత్రం:', 'Mantra:')}</strong>{' '}
                {language === 'en' ? r.mantraEn : r.mantraTe}
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop Table (sm+) */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-amber-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-950 text-amber-100">
                <th className="py-3 px-4 font-bold">{t('రాశి (Sign)', 'Rashi (Sign)')}</th>
                <th className="py-3 px-4 font-bold">{t('నేటి స్థితి', 'Status')}</th>
                <th className="py-3 px-4 font-bold">{t('శుభ సమయం', 'Lucky Time')}</th>
                <th className="py-3 px-4 font-bold">{t('శుభ రంగు & సంఖ్య', 'Color & #')}</th>
                <th className="py-3 px-4 font-bold">{t('నేటి జప మంత్రం', 'Daily Mantra')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-200/70">
              {rashiCards.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50/40'}>
                  <td className="py-3 px-4 font-extrabold text-amber-950">
                    <div className="flex items-center gap-2">
                      <RashiGlyph rashi={r.id} size={15} className="text-amber-700 shrink-0" />
                      <span>
                        {language === 'en'
                          ? `${r.englishName} (${r.teluguName})`
                          : `${r.teluguName} (${r.englishName})`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${
                        r.status === 'favorable'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : r.status === 'caution'
                          ? 'bg-rose-50 text-rose-900 border-rose-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {language === 'en' ? r.statusLabelEn : r.statusLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">
                    {language === 'en' ? r.luckyTimeWindowEn : r.luckyTimeWindowTe}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    <strong>{language === 'en' ? r.luckyColorEn : r.luckyColor}</strong> •{' '}
                    <span className="text-amber-900 font-bold">#{r.luckyNumber}</span>
                  </td>
                  <td className="py-3 px-4 text-amber-950 font-semibold">
                    {language === 'en' ? r.mantraEn : r.mantraTe}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. SEO FAQ ACCORDION ON DAILY RASHI PHALALU & CHANDRABALAM            */}
      {/* ===================================================================== */}
      <section
        aria-label="రాశి ఫలాలపై తరచుగా అడిగే ప్రశ్నలు"
        className="bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 border-2 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-md"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block">
              {t('శాస్త్రీయ సందేహాలు • Vedic Horoscope FAQ', 'Vedic Horoscope FAQ')}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950 font-telugu">
              {t(
                'రాశి ఫలాలు, చంద్రబలం & చంద్రాష్టమంపై తరచుగా అడిగే ప్రశ్నలు',
                'Frequently Asked Questions on Daily Rashi Phalalu & Lunar Transit'
              )}
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {RASHI_PHALALU_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-amber-300/90 bg-white overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left font-bold text-xs sm:text-base text-amber-950 hover:bg-amber-50/80 cursor-pointer"
                >
                  <span className="flex items-start gap-2 min-w-0">
                    <HelpCircle size={17} className="text-amber-700 shrink-0 mt-0.5" />
                    <span className="break-words">{language === 'en' ? faq.qEn : faq.qTe}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-amber-800 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-amber-800 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-amber-100">
                    {language === 'en' ? faq.aEn : faq.aTe}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
