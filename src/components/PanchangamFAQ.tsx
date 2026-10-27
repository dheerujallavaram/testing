import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Moon,
  Star,
  Sunrise,
  Clock,
  ShieldAlert,
  Compass,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FAQItem {
  id: string;
  termTe: string;
  termEn: string;
  englishSubtitle: string;
  questionTe: string;
  questionEn: string;
  answerTe: string;
  answerEn: string;
  tipTe: string;
  tipEn: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'telugu-jyothisham-overview',
    termTe: 'తెలుగు జ్యోతిషం (Telugu Jyothisham)',
    termEn: 'Telugu Jyothisham',
    englishSubtitle: 'Telugu Jyothisham (Vedic Astrology & Almanac)',
    questionTe: 'తెలుగు జ్యోతిషం (Telugu Jyothisham) అంటే ఏమిటి? ప్రధాన సేవలు మరియు వివరాలు ఏవి?',
    questionEn: 'What is Telugu Jyothisham and what Vedic astrology services are provided?',
    answerTe:
      'తెలుగు జ్యోతిషం (Telugu Jyothisham) అనేది వేద జ్యోతిషశాస్త్రం ఆధారంగా రోజువారీ పంచాంగం (తిథి, నక్షత్రం, యోగం, కరణం, రాహుకాలం, దుర్ముహూర్తం మరియు అభిజిత్ ముహూర్తాల సమాచారం), ద్వాదశ రాశి ఫలాలు మరియు ఉచిత జన్మ కుండలి వివరాలను అందించే ప్రామాణిక విధానం. శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం (www.telugujyothisham.com) ద్వారా బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో దృక్సిద్ధాంత పంచాంగం, సంపూర్ణ జాతక ఫలితాలు, 36 గుణాల వివాహ పొంతన మరియు వైదిక హోమ సేవలు అందించబడుతున్నాయి.',
    answerEn:
      'Telugu Jyothisham is the authentic Vedic astrology system providing daily Telugu Panchangam (Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, Durmuhurtham, and Abhijit Muhurtham), 12 Rashi Phalalu, and free Janma Kundali birth chart calculations at www.telugujyothisham.com.',
    tipTe: 'ప్రతిరోజూ తెలుగు జ్యోతిషం (Telugu Jyothisham) పంచాంగం మరియు మీ జన్మ కుండలి గ్రహ స్థితిని పరిశీలించుకోవడం ద్వారా శుభ ముహూర్తాలలో కార్యాలు ప్రారంభించి సంపూర్ణ విజయం పొందవచ్చు.',
    tipEn: 'Consult Telugu Jyothisham daily for accurate Drik Siddhanta timings, Janma Kundali analysis, and auspicious muhurthams.',
    icon: Sparkles,
  },
  {
    id: 'panchangam-basics',
    termTe: 'పంచాంగం',
    termEn: 'Panchangam',
    englishSubtitle: 'Panchangam (Five Limbs of Time)',
    questionTe: 'పంచాంగం అంటే ఏమిటి? దీనిలో ఉండే 5 అంగాలు ఏవి?',
    questionEn: 'What is Panchangam and what are its 5 foundational limbs?',
    answerTe:
      '"పంచ" అనగా ఐదు, "అంగములు" అనగా భాగాలు. తిథి (Tithi), వారము (Vara), నక్షత్రము (Nakshatra), యోగము (Yoga), కరణము (Karana) అనే ఐదు ప్రధాన కాలమాన భాగాల కలయికనే "పంచాంగం" అంటారు. ప్రతిరోజూ సూర్య-చంద్రుల గమనాన్ని బట్టి మారే ప్రకృతి శక్తులను తెలుసుకుని, ఏ పని ఏ సమయంలో చేస్తే శుభం కలుగుతుందో నిర్ణయించడానికి ఇది ప్రామాణిక వేద మార్గదర్శి.',
    answerEn:
      '"Pancha" means five and "Anga" means limb. The Vedic calendar is built upon five astronomical limbs: Tithi (Lunar Day), Vara (Weekday), Nakshatra (Star Constellation), Yoga (Luni-Solar angular synergy), and Karana (Half Lunar Day). Together, they track the daily cosmic alignment of the Sun and Moon to guide auspicious human action.',
    tipTe: 'నిత్యం ఉదయాన్నే పంచాంగ శ్రవణం లేదా పఠనం చేయడం వల్ల గంగా స్నాన ఫలితం, ఆయురారోగ్య ఐశ్వర్యాలు కలుగుతాయని శాస్త్ర వచనం.',
    tipEn: 'Reading the daily Panchangam each morning helps align your schedule with favorable cosmic windows.',
    icon: BookOpen,
  },
  {
    id: 'tithi-meaning',
    termTe: 'తిథి',
    termEn: 'Tithi (Lunar Day)',
    englishSubtitle: 'Tithi (Lunar Day)',
    questionTe: 'తిథి (Tithi) అంటే ఏమిటి? శుక్ల పక్షం, కృష్ణ పక్షం ఎలా ఏర్పడతాయి?',
    questionEn: 'What is a Tithi, and how do Shukla Paksham and Krishna Paksham work?',
    answerTe:
      'ఆకాశంలో సూర్యుడు మరియు చంద్రుని మధ్య దూరం 12 డిగ్రీలు పెరగడానికి పట్టే కాలాన్ని ఒక "తిథి" అంటారు. అమావాస్య మరుసటి రోజు నుండి పౌర్ణమి వరకు చంద్రకళలు వృద్ధి చెందే 15 రోజులను "శుక్ల పక్షం" (పాడ్యమి నుండి పౌర్ణమి వరకు) అని, పౌర్ణమి మరుసటి రోజు నుండి అమావాస్య వరకు చంద్రకళలు తగ్గే 15 రోజులను "కృష్ణ / బహుళ పక్షం" అని అంటారు.',
    answerEn:
      'A Tithi is the time taken for the longitudinal angle between the Moon and the Sun to increase by 12°. A lunar month has 30 Tithis divided into two fortnights: Shukla Paksham (15 waxing days from New Moon to Full Moon) and Krishna/Bahula Paksham (15 waning days from Full Moon to New Moon).',
    tipTe: 'పండుగలు, వ్రతాలు మరియు పితృ కార్యాలు ప్రధానంగా తిథి ఆధారంగానే నిర్ణయించబడతాయి (ఉదా: ఏకాదశి వ్రతం, చవితి, పౌర్ణమి).',
    tipEn: 'Vedic festivals, fasts (such as Ekadashi or Chaturthi), and rituals are determined primarily by the Tithi.',
    icon: Moon,
  },
  {
    id: 'nakshatram-meaning',
    termTe: 'నక్షత్రం',
    termEn: 'Nakshatra (Star)',
    englishSubtitle: 'Nakshatra (Lunar Mansion)',
    questionTe: 'నక్షత్రం (Nakshatra) అంటే ఏమిటి? రోజువారీ నక్షత్రం ఎందుకు ముఖ్యం?',
    questionEn: 'What is a Nakshatra and why is the daily star important?',
    answerTe:
      'చంద్రుడు భూమి చుట్టూ తిరిగే 360 డిగ్రీల రాశి చక్రాన్ని 27 సమాన భాగాలుగా (ఒక్కొక్కటి 13°20′) విభజించారు. వీటినే అశ్విని నుండి రేవతి వరకు గల "27 నక్షత్రాలు" అంటారు. ఏ రోజున చంద్రుడు ఏ నక్షత్ర మండలంలో సంచరిస్తాడో దానిని ఆ రోజు నక్షత్రంగా పిలుస్తారు. మనిషి మనస్సుపై చంద్రుని ప్రభావం అత్యధికంగా ఉంటుంది కాబట్టి నక్షత్ర బలం చాలా కీలకం.',
    answerEn:
      'The 360° zodiac belt is divided into 27 equal star sectors of 13°20′ each, from Ashwini to Revati, called Nakshatras. The constellation occupied by the Moon on a given day is that day’s Nakshatra. Because the Moon governs the mind, daily Nakshatra energy strongly influences success and emotional harmony.',
    tipTe: 'ప్రయాణాలు, నూతన వస్తు కొనుగోలు, విద్యాభ్యాసం మరియు వివాహాది శుభకార్యాలలో మీ జన్మ నక్షత్రానికి ఆ రోజు నక్షత్రం అనుకూలంగా ఉందో లేదో (తారాబలం) చూస్తారు.',
    tipEn: 'Before travel, purchases, or ceremonies, check whether the day’s Nakshatra is harmonious with your birth star (Tara Balam).',
    icon: Star,
  },
  {
    id: 'muhurtham-meaning',
    termTe: 'ముహూర్తం',
    termEn: 'Muhurtham',
    englishSubtitle: 'Muhurtham & Abhijit',
    questionTe: 'శుభ ముహూర్తం, అభిజిత్ ముహూర్తం మరియు అమృత ఘడియలు అంటే ఏమిటి?',
    questionEn: 'What are Shubha Muhurtham, Abhijit Muhurtham, and Amrutha Ghadayalu?',
    answerTe:
      'ఏదైనా ముఖ్యమైన పనిని ప్రారంభించడానికి తిథి, వారం, నక్షత్రం మరియు లగ్న బలాలు అన్నీ అనుకూలంగా ఉండే పవిత్ర సమయాన్ని "ముహూర్తం" అంటారు. ప్రతిరోజూ మధ్యాహ్నం సూర్యుడు నడినెత్తిపై ఉండే సమయాన్ని "అభిజిత్ ముహూర్తం" అంటారు (బుధవారం మినహా). అలాగే ప్రతి నక్షత్రంలో ఉండే అత్యంత శుభప్రదమైన సమయాన్ని "అమృత ఘడియలు" అంటారు.',
    answerEn:
      'A Muhurtham is an auspiciously elected time window when Tithi, Vara, Nakshatra, and Lagna align favorably. Abhijit Muhurtham occurs around local solar noon and is universally auspicious for urgent tasks. Amrutha Ghadayalu is the "nectar window" within each daily Nakshatra that brings obstacle-free completion.',
    tipTe: 'తప్పనిసరి పరిస్థితుల్లో తక్షణమే ఏదైనా శుభకార్యం లేదా ప్రయాణం చేయాల్సి వచ్చినప్పుడు అభిజిత్ ముహూర్తం లేదా అమృత ఘడియలు అత్యంత శ్రేష్ఠమైనవి.',
    tipEn: 'When you need to start an important task or journey on short notice, choose Abhijit Muhurtham or Amrutha Ghadayalu.',
    icon: Sunrise,
  },
  {
    id: 'yogam-karanam',
    termTe: 'యోగం & కరణం',
    termEn: 'Yoga & Karana',
    englishSubtitle: 'Yoga & Karana',
    questionTe: 'పంచాంగంలో ఉండే యోగం (Yoga) మరియు కరణం (Karana) అంటే ఏమిటి?',
    questionEn: 'What do Yoga and Karana mean in the daily Panchangam?',
    answerTe:
      'సూర్య, చంద్రుల రేఖాంశాల మొత్తాన్ని బట్టి ఏర్పడే 27 విభాగాలను "యోగాలు" (విష్కంభ, ప్రీతి, ఆయుష్మాన్, సౌభాగ్య, సిద్ధి మొదలైనవి) అంటారు. ఇక ఒక తిథిలో సగభాగాన్ని (6 డిగ్రీల సూర్య-చంద్ర అంతరాన్ని) "కరణం" అంటారు; ప్రతి తిథికి రెండు కరణాలు ఉంటాయి (బవ, బాలవ, కౌలవ మొదలైనవి).',
    answerEn:
      'Yoga is calculated by adding the longitudes of the Sun and Moon and dividing into 27 combinations (such as Siddhi, Shubha, Amrutha). Karana is half of a Tithi (a 6° lunar-solar separation); every Tithi consists of two Karanas (such as Bava, Balava, Kaulava) that govern practical task execution.',
    tipTe: 'సిద్ధి, అమృత, శుభ యోగాలలో మరియు శుభ కరణాలలో చేపట్టిన పనులు ఆటంకాలు లేకుండా సత్ఫలితాలను ఇస్తాయి.',
    tipEn: 'Undertakings begun during Siddhi, Shubha, or Amrutha Yogas and auspicious Karanas yield lasting results.',
    icon: Sparkles,
  },
  {
    id: 'rahukalam-varjyam',
    termTe: 'రాహు కాలం & వర్జ్యం',
    termEn: 'Rahu Kalam & Varjyam',
    englishSubtitle: 'Rahu Kalam, Yamagandam & Varjyam',
    questionTe: 'రాహు కాలం, యమగండం, దుర్ముహూర్తం మరియు వర్జ్యం ఎందుకు వదిలివేయాలి?',
    questionEn: 'Why should Rahu Kalam, Yamagandam, Durmuhurtham, and Varjyam be avoided?',
    answerTe:
      'ప్రతిరోజూ సూర్యోదయం నుండి సూర్యాస్తమయం వరకు ఉండే పగటి కాలంలో సుమారు 1 గంట 30 నిమిషాల పాటు రాహు గ్రహ ఆధిపత్యం ఉండే సమయాన్ని "రాహు కాలం" అంటారు. అలాగే ప్రతి నక్షత్రంలో ఉండే విషతుల్యమైన సమయాన్ని "వర్జ్యం" అని, అశుభ ఘడియలను "దుర్ముహూర్తం / యమగండం" అని అంటారు.',
    answerEn:
      'Rahu Kalam is a daily 90-minute daytime window ruled by Rahu. Varjyam is an inauspicious segment within each Nakshatra, and Yamagandam / Durmuhurtham are periods prone to delays. Vedic tradition advises avoiding these windows when starting brand-new ventures.',
    tipTe: 'ఈ సమయాలలో కేవలం "కొత్త పనులు, శుభకార్యాలు, ఆర్థిక ఒప్పందాలు" మాత్రమే ప్రారంభించకూడదు. ఇప్పటికే చేస్తున్న రోజువారీ పనులు, ఆఫీసు పనులు, దైవ ప్రార్థనలు నిరభ్యంతరంగా చేసుకోవచ్చు.',
    tipEn: 'Only avoid initiating new ceremonies, contracts, or journeys during these times; routine daily work and prayers can continue normally.',
    icon: ShieldAlert,
  },
  {
    id: 'lagna-pramanam',
    termTe: 'లగ్నం',
    termEn: 'Lagna (Ascendant)',
    englishSubtitle: 'Lagna (Rising Sign)',
    questionTe: 'లగ్న ప్రమాణాలు (Lagna) అంటే ఏమిటి? స్థిర లగ్నం ఎందుకు కోరుకుంటారు?',
    questionEn: 'What is Lagna (Ascendant) and why are Sthira Lagnas preferred?',
    answerTe:
      'భూమి తన చుట్టూ తాను తిరగడం వల్ల తూర్పు క్షితిజంలో (Horizon) ప్రతి రెండు గంటలకు ఒక రాశి ఉదయిస్తుంది; దీనినే "లగ్నం" అంటారు. 24 గంటలలో మేషం నుండి మీనం వరకు 12 లగ్నాలు వస్తాయి. వీటిని చర (కదిలేవి), స్థిర (నిలకడైనవి), ద్విస్వభావ (రెండు స్వభావాలు గలవి) లగ్నాలుగా విభజించారు.',
    answerEn:
      'As the Earth rotates, each of the 12 zodiac signs rises on the eastern horizon for roughly two hours—this rising sign is the Lagna. Lagnas are classified into Chara (Movable), Sthira (Fixed: Vrushabha, Simha, Vruschika, Kumbha), and Dwiswabhava (Dual).',
    tipTe: 'వివాహం, గృహప్రవేశం, శంకుస్థాపన, ఉద్యోగంలో చేరడం వంటివి శాశ్వతంగా నిలిచి ఉండాలి కాబట్టి "స్థిర లగ్నాలలో" (వృషభ, సింహ, వృశ్చిక, కుంభ లగ్నాలు) ముహూర్తం పెడతారు.',
    tipEn: 'Weddings, housewarmings (Gruhapravesham), and foundations are scheduled during Sthira (Fixed) Lagnas for permanence and stability.',
    icon: Clock,
  },
  {
    id: 'tarabalam-chandrashtamam',
    termTe: 'తారాబలం & చంద్రాష్టమం',
    termEn: 'Tara Balam & Chandrashtamam',
    englishSubtitle: 'Personal Star & Moon Compatibility',
    questionTe: 'తారాబలం (Tara Balam) మరియు చంద్రాష్టమం (Chandrashtamam) ఎలా చూస్తారు?',
    questionEn: 'How are Tara Balam and Chandrashtamam calculated for an individual?',
    answerTe:
      'మీ జన్మ నక్షత్రం నుండి ఆ రోజు ఉన్న నక్షత్రం వరకు లెక్కించగా వచ్చే 9 తారల చక్రాన్ని "తారాబలం" అంటారు (సంపత్, క్షేమ, సాధక, మిత్ర, పరమ మిత్ర తారలు శుభప్రదం). ఇక ఆ రోజు గోచార చంద్రుడు మీ జన్మ రాశి నుండి 8వ రాశిలో సంచరించడాన్ని "చంద్రాష్టమం" అంటారు (సుమారు 2¼ రోజులు ఉంటుంది).',
    answerEn:
      'Counting from your birth Nakshatra to the day’s Nakshatra in cycles of 9 gives your Tara Balam (Sampat, Kshema, Sadhaka, Mitra, and Parama Mitra Taras are favorable). Chandrashtamam occurs when the transiting Moon passes through the 8th sign from your birth Moon sign (lasting ~2¼ days).',
    tipTe: 'చంద్రాష్టమం ఉన్న రోజున మనస్సు కొంత ఆందోళనగా ఉండే అవకాశం ఉంటుంది కాబట్టి, పెద్ద వివాదాలు లేదా కీలక నిర్ణయాలు వాయిదా వేసుకుని శివారాధన చేయడం శ్రేయస్కరం.',
    tipEn: 'On Chandrashtamam days, stay calm, avoid major arguments or high-risk decisions, and chant Shiva mantras.',
    icon: Compass,
  },
  {
    id: 'vivaha-pontana-36-gunalu',
    termTe: 'వివాహ పొంతన (36 గుణాలు)',
    termEn: 'Marriage Matching (36 Points)',
    englishSubtitle: 'Ashtakoota Guna Milan',
    questionTe: 'వివాహ పొంతనలో 36 గుణాలకు గాను కనీసం ఎన్ని పాయింట్లు రావాలి?',
    questionEn: 'How many points out of 36 are required in Ashtakoota Guna Milan for marriage?',
    answerTe:
      'వేద జ్యోతిష్య శాస్త్రం ప్రకారం వివాహ పొంతనలో వర్ణ (1), వశ్య (2), తార (3), యోని (4), గ్రహ మైత్రి (5), గణ (6), భకూట (7), నాడి (8) అనే 8 కూటాలకు కలిపి మొత్తం 36 గుణాలు ఉంటాయి. శాస్త్ర ప్రకారం వివాహానికి కనీసం 18 గుణాలు మరియు అంతకంటే ఎక్కువ రావడం శుభప్రదం. ముఖ్యంగా నాడి కూటం (8 పాయింట్లు) మరియు రజ్జు పొంతన తప్పనిసరిగా చూడాలి.',
    answerEn:
      'In Vedic Ashtakoota Guna Milan, compatibility is evaluated across 8 Kootas totaling 36 points. A score of 18 or more points out of 36 is considered auspicious for marriage, with special emphasis on Nadi Koota (8 points), Bhakoota (7 points), and Rajju matching.',
    tipTe: 'కేవలం గుణాల సంఖ్య మాత్రమే కాకుండా వధూవరుల వ్యక్తిగత జాతకంలో కుజ దోషం, సప్తమ స్థాన బలం మరియు దశా సంధిని కూడా గురువుగారి చేత పరిశీలింపజేయాలి.',
    tipEn: 'Beyond the 36-point score, always verify Kuja Dosha, 7th house strength, and Dasha compatibility.',
    icon: Sparkles,
  },
  {
    id: 'naama-nakshatra-rashi',
    termTe: 'నామ నక్షత్రం & రాశి',
    termEn: 'Rashi by Name First Letter',
    englishSubtitle: 'Naama Nakshatra Lookup',
    questionTe: 'పుట్టిన సమయం తెలియకపోతే పేరు మొదటి అక్షరంతో రాశి, నక్షత్రం ఎలా తెలుసుకోవాలి?',
    questionEn: 'How can I find my Rashi and Nakshatra using the first syllable of my name?',
    answerTe:
      'పుట్టిన తేదీ లేదా ఖచ్చితమైన సమయం తెలియని వారు తమ పిలిచే పేరులోని మొదటి అక్షరం (ఉదాహరణకు: చూ, చే, చో, లా — అశ్విని నక్షత్రం, మేష రాశి) ఆధారంగా "నామ నక్షత్రం" మరియు "నామ రాశి"ని తెలుసుకోవచ్చు. అశ్విని నుండి రేవతి వరకు గల 27 నక్షత్రాలలోని 108 పాదాలకు నిర్దిష్ట తెలుగు అక్షరాలు కేటాయించబడ్డాయి.',
    answerEn:
      'When exact birth time is unavailable, Vedic astrology uses Naama Nakshatra—matching the first phonetic syllable of your spoken name against the 108 Padas of the 27 Nakshatras to determine your functional Moon Sign (Rashi) and birth star.',
    tipTe: 'దేవాలయ అర్చనలు, గోత్రనామాల సంకల్పం మరియు రోజువారీ రాశి ఫలితాలు చూసుకోవడానికి నామ నక్షత్రం, నామ రాశిని నిరభ్యంతరంగా ఉపయోగించవచ్చు.',
    tipEn: 'Naama Rashi and Naama Nakshatra can be used for temple Archana sankalpam and checking daily transit fortunes.',
    icon: Star,
  },
  {
    id: 'ugadi-aadayam-vyayam',
    termTe: 'ఉగాది ఆదాయం - వ్యయం',
    termEn: 'Ugadi Aadayam & Vyayam',
    englishSubtitle: 'Sri Parabhava Nama Samvatsara 2026–2027',
    questionTe: 'ఉగాది పంచాంగంలో ఆదాయం - వ్యయం, రాజపూజ్యం - అవమానం అంటే ఏమిటి?',
    questionEn: 'What do Aadayam, Vyayam, Rajapujyam, and Avamanam mean in the Ugadi Panchangam?',
    answerTe:
      'ప్రతి తెలుగు సంవత్సరాది (ఉగాది) నాడు నవగ్రహాల వార్షిక సంచారాన్ని బట్టి 12 రాశుల వారికి ఆదాయం (ధన ప్రాప్తి), వ్యయం (ఖర్చులు), రాజపూజ్యం (గౌరవ మర్యాదలు, పదవీ లాభం) మరియు అవమానం నిష్పత్తులను పంచాంగ శ్రవణంలో గణిస్తారు. శ్రీ పరాభవ నామ సంవత్సర (2026–2027) పూర్తి రాశి ఫలాలు మా పేజీలో అందుబాటులో ఉన్నాయి.',
    answerEn:
      'In the annual Telugu Ugadi Panchangam, Aadayam (financial inflow) vs. Vyayam (expenditure) and Rajapujyam (social honor & authority) vs. Avamanam indicate the yearly macro-fortune ratios for each of the 12 zodiac signs.',
    tipTe: 'వ్యయం ఎక్కువగా ఉన్న రాశుల వారు ఆర్థిక ప్రణాళిక పాటిస్తూ, దానధర్మాలు మరియు శుభకార్యాల రూపంలో ఖర్చు చేస్తే అశుభ వ్యయం తగ్గుతుంది.',
    tipEn: 'Channeling periods of higher Vyayam into spiritual charity, investments, and family ceremonies neutralizes unexpected expenses.',
    icon: BookOpen,
  },
  {
    id: 'dosha-pariharalu-guide',
    termTe: 'దోష నివారణ పరిహారాలు',
    termEn: 'Kuja, Kalasarpa & Shani Remedies',
    englishSubtitle: 'Vedic Dosha Shanti',
    questionTe: 'కుజ దోషం, కాలసర్ప దోషం మరియు ఏలినాటి శని నివారణకు శాస్త్రోక్త పరిహారాలు ఏమిటి?',
    questionEn: 'What are the authentic Vedic remedies for Kuja Dosha, Kalasarpa Dosha, and Sade Sati?',
    answerTe:
      'జాతకంలో కుజ దోషం ఉన్నవారు మంగళవారం సుబ్రహ్మణ్య స్వామి ఆరాధన, కుజ గ్రహ జపం చేయించాలి. కాలసర్ప దోషం ఉన్నవారు రాహు-కేతు శాంతి హోమం, రుద్రాభిషేకం జరిపించాలి. ఏలినాటి శని లేదా అష్టమ శని నడుస్తున్న వారు శనివారం తైలాభిషేకం, నల్ల నువ్వుల దానం మరియు ఆంజనేయ స్వామి ఆరాధన చేయడం వల్ల దోష తీవ్రత తగ్గి శుభ ఫలితాలు కలుగుతాయి.',
    answerEn:
      'Kuja Dosha is pacified through Subrahmanya Abhishekam and Kuja Graha Japa; Kalasarpa Dosha through Rahu-Ketu Shanti Homam and Rudrabhishekam; and Elinati Shani (Sade Sati) through Shani Tailabhishekam, Hanuman archana, and sesame dana on Saturdays.',
    tipTe: 'ఏ దోషానికైనా భయపడకుండా, వ్యక్తిగత జాతకంలోని గ్రహ దృష్టి మరియు దశా బలాన్ని బట్టి సరైన శాంతి పరిహారం ఆచరిస్తే సంపూర్ణ శుభం కలుగుతుంది.',
    tipEn: 'Every planetary affliction has a classical Vedic remedial prescription—consult an experienced scholar for personalized sankalpam.',
    icon: ShieldAlert,
  },
];

export const PanchangamFAQ: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['tithi-meaning', 'nakshatram-meaning', 'muhurtham-meaning']);
  const { language, t } = useLanguage();

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allExpanded = openIds.length === FAQ_ITEMS.length;

  const handleToggleAll = () => {
    if (allExpanded) {
      setOpenIds([]);
    } else {
      setOpenIds(FAQ_ITEMS.map((item) => item.id));
    }
  };

  return (
    <section
      id="panchangam-faq"
      className="bg-white border border-amber-300 shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8 scroll-mt-24 font-telugu"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest font-bold text-amber-800 font-display bg-amber-100 px-3 py-1 rounded-md border border-amber-300 mb-2">
            <HelpCircle size={14} className="text-amber-700" />
            <span>Panchangam Beginner’s Guide • {t('పంచాంగ పరిజ్ఞానం (FAQ)', 'Terminology Explained (FAQ)')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-950 flex items-center gap-2.5">
            <span>
              {t(
                'పంచాంగ పదాల వివరణ — సందేహాలు & సమాధానాలు',
                'Panchangam Terminology — Frequently Asked Questions'
              )}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {t(
              'నిత్య పంచాంగంలోని తిథి, నక్షత్రం, ముహూర్తం, లగ్నం మరియు రాహుకాలం వంటి ముఖ్యమైన పదాలను సులభంగా అర్థం చేసుకోవడానికి సరళమైన వివరణ.',
              'Clear, beginner-friendly explanations of essential Vedic Panchangam concepts including Tithi, Nakshatra, Muhurtham, Lagna, and Rahu Kalam.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleAll}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer shrink-0"
        >
          {allExpanded
            ? t('అన్నీ మూసివేయండి (Collapse All)', 'Collapse All')
            : t('అన్నీ తెరవండి (Expand All)', 'Expand All')}
        </button>
      </div>

      {/* Quick Term Chips for Mobile & Desktop Jump */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none -mx-1 px-1">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!openIds.includes(item.id)) {
                  setOpenIds((prev) => [...prev, item.id]);
                }
                const el = document.getElementById(`faq-card-${item.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                isOpen
                  ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                  : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {language === 'en' ? item.termEn : item.termTe}
            </button>
          );
        })}
      </div>

      {/* Accordion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 items-start">
        {FAQ_ITEMS.map((item) => {
          const Icon = item.icon;
          const isOpen = openIds.includes(item.id);

          return (
            <div
              key={item.id}
              id={`faq-card-${item.id}`}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-amber-400 shadow-sm'
                  : 'bg-slate-50/40 hover:bg-amber-50/30 border-amber-200/80'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
                      isOpen
                        ? 'bg-amber-800 text-amber-100 border-amber-700'
                        : 'bg-amber-100/80 text-amber-900 border-amber-300'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200/70 text-amber-950">
                        {language === 'en' ? item.termEn : item.termTe}
                      </span>
                      <span className="text-[11px] text-slate-500 font-sans">
                        {language === 'en' ? item.termTe : item.englishSubtitle}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-amber-950 leading-snug">
                      {language === 'en' ? item.questionEn : item.questionTe}
                    </h3>
                  </div>
                </div>

                <div className="text-amber-800 p-1 rounded-lg bg-amber-100/60 shrink-0 mt-1">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-amber-200/60 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {language === 'en' ? item.answerEn : item.answerTe}
                  </p>
                  <div className="bg-amber-100/60 border border-amber-300/80 rounded-xl p-3 text-xs text-amber-950 leading-relaxed flex items-start gap-2">
                    <Sparkles size={15} className="text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">
                        {t('ఆచరణాత్మక సూచన: ', 'Practical Tip: ')}
                      </strong>
                      <span>{language === 'en' ? item.tipEn : item.tipTe}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
