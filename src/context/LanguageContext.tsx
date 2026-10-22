import React, { createContext, useContext, useState } from 'react';

export type Language = 'te' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (te: string, en: string) => string;
  tr: (text: string) => string;
}

// Comprehensive Vedic Panchangam Telugu -> English dictionary (ordered longest-first for accurate replacement)
const PANCHANGAM_TERM_MAP: [string, string][] = [
  // Samvatsaram & Ayanam & Rutuvu
  ['శ్రీ పరాభవ నామ సంవత్సరం', 'Sri Parabhava Nama Samvatsaram'],
  ['శ్రీ విశ్వావసు నామ సంవత్సరం', 'Sri Vishwavasu Nama Samvatsaram'],
  ['దక్షిణాయనం', 'Dakshinayanam (Southern Solstice)'],
  ['ఉత్తరాయణం', 'Uttarayanam (Northern Solstice)'],
  ['శరద్ ఋతువు', 'Sharad Rutu (Autumn)'],
  ['హేమంత ఋతువు', 'Hemanta Rutu (Pre-Winter)'],
  ['శిశిర ఋతువు', 'Shishira Rutu (Winter)'],
  ['వసంత ఋతువు', 'Vasanta Rutu (Spring)'],
  ['గ్రీష్మ ఋతువు', 'Grishma Rutu (Summer)'],
  ['వర్ష ఋతువు', 'Varsha Rutu (Monsoon)'],
  ['శరదృతువు - నిర్మల ఆకాశం, ఆధ్యాత్మిక సాధన కాలం', 'Sharad Rutu — Clear skies & sacred spiritual season'],
  ['హేమంత ఋతువు - చలి కాలం, ధనుర్మాస పూజలు', 'Hemanta Rutu — Sacred winter & Dhanurmasa worship'],
  ['శిశిర ఋతువు - శివరాత్రి పర్వదిన సమయం', 'Shishira Rutu — Sacred Maha Shivaratri season'],
  ['వసంత ఋతువు - నవ వసంతం, ఉగాది కాలం', 'Vasanta Rutu — Auspicious Ugadi & spring season'],
  ['గ్రీష్మ ఋతువు - అధిక ఉష్ణోగ్రత సమయం', 'Grishma Rutu — Summer solstice period'],
  ['వర్ష ఋతువు - పవిత్ర వ్రతాలు, పూజల కాలం', 'Varsha Rutu — Sacred monsoon vows & worship'],

  // Lunar Months & Pakshams
  ['ఆశ్వయుజ మాసం', 'Ashwayuja Masam'],
  ['కార్తీక మాసం', 'Kartika Masam'],
  ['మార్గశిర మాసం', 'Margashira Masam'],
  ['పుష్య మాసం', 'Pushya Masam'],
  ['మాఘ మాసం', 'Magha Masam'],
  ['ఫాల్గుణ మాసం', 'Phalguna Masam'],
  ['చైత్ర మాసం', 'Chaitra Masam'],
  ['వైశాఖ మాసం', 'Vaishakha Masam'],
  ['జ్యేష్ఠ మాసం', 'Jyeshtha Masam'],
  ['ఆషాఢ మాసం', 'Ashadha Masam'],
  ['శ్రావణ మాసం', 'Shravana Masam'],
  ['భాద్రపద మాసం', 'Bhadrapada Masam'],
  ['శుక్ల పక్షం', 'Shukla Paksham (Waxing Moon)'],
  ['కృష్ణ పక్షం', 'Krishna Paksham (Waning Moon)'],
  ['బహుళ పక్షం', 'Bahula Paksham (Waning Moon)'],

  // English Calendar Months in Telugu
  ['అక్టోబర్', 'October'],
  ['నవంబర్', 'November'],
  ['డిసెంబర్', 'December'],
  ['జనవరి', 'January'],
  ['ఫిబ్రవరి', 'February'],
  ['మార్చి', 'March'],
  ['ఏప్రిల్', 'April'],
  ['మే', 'May'],
  ['జూన్', 'June'],
  ['జూలై', 'July'],
  ['ఆగస్టు', 'August'],
  ['సెప్టెంబర్', 'September'],

  // Weekdays (Varam)
  ['ఆదివారం', 'Sunday (Aadivaram)'],
  ['సోమవారం', 'Monday (Somavaram)'],
  ['మంగళవారం', 'Tuesday (Mangalavaram)'],
  ['బుధవారం', 'Wednesday (Budhavaram)'],
  ['గురువారం', 'Thursday (Guruvaram)'],
  ['శుక్రవారం', 'Friday (Shukravaram)'],
  ['శనివారం', 'Saturday (Shanivaram)'],

  // Tithis
  ['పాడ్యమి', 'Padyami (Pratipada)'],
  ['విదియ', 'Vidiya (Dwitiya)'],
  ['తదియ', 'Tadiya (Tritiya)'],
  ['చవితి', 'Chavithi (Chaturthi)'],
  ['పంచమి', 'Panchami'],
  ['షష్ఠి', 'Shashthi'],
  ['సప్తమి', 'Saptami'],
  ['అష్టమి', 'Ashtami'],
  ['నవమి', 'Navami'],
  ['దశమి', 'Dashami'],
  ['ఏకాదశి', 'Ekadashi'],
  ['ద్వాదశి', 'Dwadashi'],
  ['త్రయోదశి', 'Trayodashi'],
  ['చతుర్దశి', 'Chaturdashi'],
  ['పౌర్ణమి', 'Pournami (Full Moon)'],
  ['అమావాస్య', 'Amavasya (New Moon)'],

  // 27 Nakshatras
  ['ఉత్తరాభాద్ర', 'Uttarabhadra'],
  ['పూర్వాభాద్ర', 'Purvabhadra'],
  ['ఉత్తరాషాఢ', 'Uttarashadha'],
  ['పూర్వాషాఢ', 'Purvashadha'],
  ['ఉత్తర ఫల్గుణి', 'Uttara Phalguni'],
  ['పుబ్బ (పూర్వ ఫల్గుణి)', 'Pubba (Purva Phalguni)'],
  ['పూర్వ ఫల్గుణి', 'Purva Phalguni'],
  ['మృగశిర', 'Mrigashira'],
  ['పునర్వసు', 'Punarvasu'],
  ['పుష్యమి', 'Pushyami'],
  ['ఆశ్లేష', 'Ashlesha'],
  ['అశ్విని', 'Ashwini'],
  ['భరణి', 'Bharani'],
  ['కృత్తిక', 'Krittika'],
  ['రోహిణి', 'Rohini'],
  ['ఆరుద్ర', 'Arudra'],
  ['మఘ', 'Magha'],
  ['పుబ్బ', 'Pubba'],
  ['ఉత్తర', 'Uttara'],
  ['హస్త', 'Hasta'],
  ['చిత్త', 'Chitta'],
  ['స్వాతి', 'Swati'],
  ['విశాఖ', 'Vishakha'],
  ['అనురాధ', 'Anuradha'],
  ['జ్యేష్ఠ', 'Jyeshtha'],
  ['మూల', 'Moola'],
  ['శ్రవణం', 'Shravanam'],
  ['ధనిష్ఠ', 'Dhanishtha'],
  ['శతభిషం', 'Shatabhisham'],
  ['రేవతి', 'Revati'],

  // Yogas
  ['విష్కంభ', 'Vishkambha'],
  ['ఆయుష్మాన్', 'Ayushman'],
  ['సౌభాగ్య', 'Saubhagya'],
  ['శోభన', 'Shobhana'],
  ['అతిగండ', 'Atiganda'],
  ['సుకర్మ', 'Sukarma'],
  ['ధృతి', 'Dhriti'],
  ['శూల', 'Shoola'],
  ['గండ', 'Ganda'],
  ['వృద్ధి', 'Vriddhi'],
  ['ధ్రువ', 'Dhruva'],
  ['వ్యాఘాత', 'Vyaghata'],
  ['హర్షణ', 'Harshana'],
  ['వజ్ర', 'Vajra'],
  ['సిద్ధి', 'Siddhi'],
  ['వ్యతీపాత', 'Vyatipata'],
  ['వరీయాన్', 'Variyan'],
  ['పరిఘ', 'Parigha'],
  ['శివ', 'Shiva'],
  ['సిద్ధ', 'Siddha'],
  ['సాధ్య', 'Sadhya'],
  ['శుభ', 'Shubha'],
  ['శుక్ల', 'Shukla'],
  ['బ్రహ్మ', 'Brahma'],
  ['ఐంద్ర', 'Aindra'],
  ['వైధృతి', 'Vaidhriti'],
  ['ప్రీతి', 'Preeti'],

  // Karanas
  ['కింస్తుఘ్న', 'Kimstughna'],
  ['చతుష్పాద', 'Chatushpada'],
  ['భద్ర (విష్టి)', 'Bhadra (Vishti)'],
  ['బాలవ', 'Balava'],
  ['కౌలవ', 'Kaulava'],
  ['తైతిల', 'Taitila'],
  ['గరజి', 'Garaji'],
  ['వణిజ', 'Vanija'],
  ['శకుని', 'Shakuni'],
  ['నాగవ', 'Nagava'],
  ['విష్టి', 'Vishti'],
  ['బవ', 'Bava'],

  // Lagnas & Rashis
  ['మేష లగ్నం', 'Mesha Lagnam (Aries Ascendant)'],
  ['వృషభ లగ్నం', 'Vrushabha Lagnam (Taurus Ascendant)'],
  ['మిథున లగ్నం', 'Mithuna Lagnam (Gemini Ascendant)'],
  ['కర్కాటక లగ్నం', 'Karkataka Lagnam (Cancer Ascendant)'],
  ['సింహ లగ్నం', 'Simha Lagnam (Leo Ascendant)'],
  ['కన్యా లగ్నం', 'Kanya Lagnam (Virgo Ascendant)'],
  ['తుల లగ్నం', 'Tula Lagnam (Libra Ascendant)'],
  ['తులా లగ్నం', 'Tula Lagnam (Libra Ascendant)'],
  ['వృశ్చిక లగ్నం', 'Vruschika Lagnam (Scorpio Ascendant)'],
  ['ధనుస్సు లగ్నం', 'Dhanussu Lagnam (Sagittarius Ascendant)'],
  ['మకర లగ్నం', 'Makara Lagnam (Capricorn Ascendant)'],
  ['కుంభ లగ్నం', 'Kumbha Lagnam (Aquarius Ascendant)'],
  ['మీన లగ్నం', 'Meena Lagnam (Pisces Ascendant)'],

  ['మేష రాశి', 'Mesha Rashi (Aries)'],
  ['వృషభ రాశి', 'Vrushabha Rashi (Taurus)'],
  ['మిథున రాశి', 'Mithuna Rashi (Gemini)'],
  ['కర్కాటక రాశి', 'Karkataka Rashi (Cancer)'],
  ['సింహ రాశి', 'Simha Rashi (Leo)'],
  ['కన్యా రాశి', 'Kanya Rashi (Virgo)'],
  ['తులా రాశి', 'Tula Rashi (Libra)'],
  ['తుల రాశి', 'Tula Rashi (Libra)'],
  ['వృశ్చిక రాశి', 'Vruschika Rashi (Scorpio)'],
  ['ధనుస్సు రాశి', 'Dhanussu Rashi (Sagittarius)'],
  ['మకర రాశి', 'Makara Rashi (Capricorn)'],
  ['కుంభ రాశి', 'Kumbha Rashi (Aquarius)'],
  ['మీన రాశి', 'Meena Rashi (Pisces)'],

  ['మేషం', 'Mesham (Aries)'],
  ['వృషభం', 'Vrushabham (Taurus)'],
  ['మిథునం', 'Mithunam (Gemini)'],
  ['కర్కాటకం', 'Karkatakam (Cancer)'],
  ['సింహం', 'Simham (Leo)'],
  ['కన్య', 'Kanya (Virgo)'],
  ['తుల', 'Tula (Libra)'],
  ['వృశ్చికం', 'Vruschikam (Scorpio)'],
  ['ధనుస్సు', 'Dhanussu (Sagittarius)'],
  ['మకరం', 'Makaram (Capricorn)'],
  ['కుంభం', 'Kumbham (Aquarius)'],
  ['మీనం', 'Meenam (Pisces)'],

  // Planets (Navagrahas)
  ['సూర్యుడు (రవి)', 'Surya (Sun)'],
  ['సూర్యుడు', 'Surya (Sun)'],
  ['చంద్రుడు', 'Chandra (Moon)'],
  ['కుజుడు (అంగారకుడు)', 'Kuja (Mars)'],
  ['కుజుడు', 'Kuja (Mars)'],
  ['బుధుడు', 'Budha (Mercury)'],
  ['గురుడు (బృహస్పతి)', 'Guru (Jupiter)'],
  ['గురుడు', 'Guru (Jupiter)'],
  ['శుక్రుడు', 'Shukra (Venus)'],
  ['శని (మందుడు)', 'Shani (Saturn)'],
  ['శని', 'Shani (Saturn)'],
  ['రాహువు', 'Rahu'],
  ['కేతువు', 'Ketu'],

  // Tara Balam Names
  ['పరమ మిత్ర తార', 'Parama Mitra Tara (Supreme Friend Star)'],
  ['జన్మ తార', 'Janma Tara (Birth Star)'],
  ['సంపత్ తార', 'Sampat Tara (Wealth Star)'],
  ['విపత్ తార', 'Vipat Tara (Obstacle Star)'],
  ['క్షేమ తార', 'Kshema Tara (Well-being Star)'],
  ['ప్రత్యక్ తార', 'Pratyak Tara (Hurdle Star)'],
  ['సాధక తార', 'Sadhaka Tara (Success Star)'],
  ['నైధన తార', 'Naidhana Tara (Caution Star)'],
  ['మిత్ర తార', 'Mitra Tara (Friendly Star)'],

  // Common Deities & Colors
  ['శ్రీ మహా విష్ణువు', 'Lord Maha Vishnu'],
  ['శ్రీ వెంకటేశ్వర స్వామి', 'Lord Venkateswara'],
  ['పరమేశ్వరుడు', 'Lord Shiva'],
  ['శ్రీ దక్షిణామూర్తి / సాయిబాబా', 'Lord Dakshinamurthy / Sai Baba'],
  ['శ్రీ లక్ష్మీ దేవి / లలితా త్రిపురసుందరి', 'Goddess Maha Lakshmi / Lalita Devi'],
  ['శ్రీ సుబ్రహ్మణ్య స్వామి / ఆంజనేయ స్వామి', 'Lord Subrahmanya / Lord Hanuman'],
  ['శ్రీ సూర్య భగవానుడు', 'Lord Surya Narayana'],
  ['పసుపు / బంగారు రంగు', 'Yellow / Golden'],
  ['తెలుపు / క్రీమ్', 'White / Cream'],
  ['ఆకుపచ్చ', 'Emerald Green'],
  ['ఎరుపు / కాషాయం', 'Crimson / Saffron'],
  ['నీలం / తెలుపు', 'Royal Blue / White'],
  ['గులాబీ / తెలుపు', 'Rose Pink / White'],

  // Time & Status connectors
  ['తెల్లవారుజామున', 'Early Morning'],
  ['మధ్యాహ్నం', 'Afternoon'],
  ['సాయంత్రం', 'Evening'],
  ['ఉదయం', 'Morning'],
  ['రాత్రి', 'Night'],
  ['తదుపరి', 'Next:'],
  ['పూర్తిగా', 'Full Day'],
  ['నుండి', 'to'],
  ['వరకు', ''],
  ['యోగం', 'Yoga'],
  ['కరణం', 'Karana'],
];

export function translatePanchangamString(text: string, lang: Language): string {
  if (lang === 'te' || !text) return text;
  let result = text;
  for (const [te, en] of PANCHANGAM_TERM_MAP) {
    if (result.includes(te)) {
      result = result.split(te).join(en);
    }
  }
  return result.replace(/\s+/g, ' ').trim();
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'te',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (te) => te,
  tr: (text) => text,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('te');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'te' ? 'en' : 'te'));
  };

  const t = (te: string, en: string): string => (language === 'en' ? en : te);
  const tr = (text: string): string => translatePanchangamString(text, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => useContext(LanguageContext);
