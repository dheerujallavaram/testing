/**
 * ShareChat 2-Minute (120s) AI Human Voice Website Promo Video Configuration
 * Shared between the FFmpeg + Neural TTS video generator and AdminShareChatVideoStudio.
 */

export type PromoLanguage = 'te' | 'en';

export interface PromoChapter {
  index: number;
  startSec: number;
  endSec: number;
  timestampLabel: string;
  titleTe: string;
  titleEn: string;
  badgeTe: string;
  badgeEn: string;
  scriptTe: string;
  scriptEn: string;
}

export interface PromoVideoAsset {
  lang: PromoLanguage;
  label: string;
  voiceLabel: string;
  publicUrl: string;
  downloadFileName: string;
  durationLabel: string;
  resolutionLabel: string;
  captionTitle: string;
  captionBody: string;
  hashtags: string;
}

export const SHARECHAT_PROMO_CHAPTERS: PromoChapter[] = [
  {
    index: 0,
    startSec: 0,
    endSec: 15,
    timestampLabel: '00:00',
    titleTe: 'ఓం శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం పరిచయం',
    titleEn: 'Sacred Temple Intro & Brand Hook',
    badgeTe: 'పరిచయం',
    badgeEn: 'INTRO',
    scriptTe:
      'నమస్కారం! శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం కు స్వాగతం. బ్రహ్మశ్రీ సాయి ధీరజ్ శర్మ గారి వేద జ్యోతిష వేదిక, తెలుగు జ్యోతిషం డాట్ కామ్!',
    scriptEn:
      'Namaskaram! Welcome to Sri Lakshmi Ganapathi Jyothishalayam, Hyderabad. Guided by Brahmasri Sai Dheeraj Sharma, explore authentic Vedic astrology at Telugu Jyothisham dot com.',
  },
  {
    index: 1,
    startSec: 15,
    endSec: 30,
    timestampLabel: '00:15',
    titleTe: 'నేటి దృక్సిద్ధాంత పంచాంగం & లైవ్ కుండలి',
    titleEn: 'Daily Drik Panchangam & Live 4×4 Kundali',
    badgeTe: '01 / 06',
    badgeEn: '01 / 06',
    scriptTe:
      'ప్రతిరోజూ ఉదయం, నాసా దృక్సిద్ధాంత తెలుగు పంచాంగం. తిథి, నక్షత్రం, రాహుకాలం, శుభ ముహూర్తాలు, మరియు లైవ్ కుండలి చక్రం ఉచితంగా చూడండి.',
    scriptEn:
      'Every morning, get NASA Drik Siddhanta Telugu Panchangam with exact Tithi, Nakshatra, Rahukalam, Abhijit Muhurtham, and a live Kundali chart for India and NRI cities.',
  },
  {
    index: 2,
    startSec: 30,
    endSec: 45,
    timestampLabel: '00:30',
    titleTe: 'ఉచిత 37-అధ్యాయాల బృహత్ జాతకం PDF',
    titleEn: 'Free 37-Chapter 100+ Page Janma Kundali PDF',
    badgeTe: '02 / 06',
    badgeEn: '02 / 06',
    scriptTe:
      'మీ పుట్టిన తేదీతో, ముప్పై ఏడు అధ్యాయాల సంపూర్ణ తెలుగు జాతకం పి డి ఎఫ్ ఉచితంగా పొందండి. షోడశవర్గ చక్రాలు, వింశోత్తరి దశలు, మూడు వందల రాజయోగాలు అన్నీ ఉంటాయి.',
    scriptEn:
      'Generate your complete thirty-seven chapter Janma Kundali PDF free! Includes D1 to D60 charts, one hundred twenty year Vimshottari Dashas, and three hundred Rajayogas.',
  },
  {
    index: 3,
    startSec: 45,
    endSec: 60,
    timestampLabel: '00:45',
    titleTe: '6-మెథడ్ జన్మ సమయ శుద్ధి (BTR) & కవలల D60',
    titleEn: '6-Method Birth Time Rectification & Twins D60',
    badgeTe: '03 / 06',
    badgeEn: '03 / 06',
    scriptTe:
      'పుట్టిన సమయం కొంచెం తప్పుగా ఉందా? తెలుగులో మొట్టమొదటి ఆరు పద్ధతుల జన్మ సమయ శుద్ధి ల్యాబ్ తో, ప్రాణపద లగ్నం ద్వారా ఖచ్చిత సమయం తెలుసుకోండి.',
    scriptEn:
      'Unsure of your exact birth time? Use our classical six-method Birth Time Rectification Lab with Pranapada Lagna, KP sub-lords, and real life-event Dasha verification.',
  },
  {
    index: 4,
    startSec: 60,
    endSec: 75,
    timestampLabel: '01:00',
    titleTe: 'ద్వాదశ రాశి ఫలాలు & గోచార రాడార్',
    titleEn: '12 Rashi Phalalu & Live Gochara Sky Radar',
    badgeTe: '04 / 06',
    badgeEn: '04 / 06',
    scriptTe:
      'మేషం నుండి మీనం వరకు నేటి రాశి ఫలాలు, ఏలినాటి శని, గురు, రాహు కేతు గోచార ఫలితాలు, మరియు లైవ్ ఖగోళ గ్రహ రాడార్ ఉచితంగా చూడండి.',
    scriptEn:
      'Check daily Rashi Phalalu for all twelve zodiac signs, Sade Sati Saturn and Jupiter transit alerts, plus our live celestial sky radar tracking exact planetary degrees.',
  },
  {
    index: 5,
    startSec: 75,
    endSec: 90,
    timestampLabel: '01:15',
    titleTe: 'వివాహ పొంతన · శుభ ముహూర్తాలు · పిల్లల పేర్లు',
    titleEn: '36-Guna Marriage Match, Muhurtham & Baby Names',
    badgeTe: '05 / 06',
    badgeEn: '05 / 06',
    scriptTe:
      'ముప్పై ఆరు గుణాల వివాహ పొంతన, కుజ దోష పరీక్ష, శుభ ముహూర్త స్కానర్, ఇరవై ఏడు నక్షత్రాల పిల్లల పేర్లు, మరియు వాస్తు అన్నీ ఇక్కడ ఉచితం.',
    scriptEn:
      'Verify thirty-six Guna marriage matching with Kuja Dosha check, scan ninety days of personal Muhurtham dates, browse Nakshatra baby names, and explore Vastu guides free.',
  },
  {
    index: 6,
    startSec: 90,
    endSec: 105,
    timestampLabel: '01:30',
    titleTe: 'వైదిక పూజలు, హోమాలు & గురువుగారి సంప్రదింపు',
    titleEn: 'Vedic Poojas, Homas & Personal Consultation',
    badgeTe: '06 / 06',
    badgeEn: '06 / 06',
    scriptTe:
      'ఉద్యోగం, వివాహం, వ్యాపారం లేదా దోష పరిహారాల కోసం, బ్రహ్మశ్రీ సాయి ధీరజ్ శర్మ గారితో జాతక పరిశీలన మరియు వైదిక హోమాల సేవలు పొందండి.',
    scriptEn:
      'For career, marriage, business, or dosha remedies, consult Brahmasri Sai Dheeraj Sharma directly for horoscope analysis, Vastu, and authentic Vedic Homas worldwide.',
  },
  {
    index: 7,
    startSec: 105,
    endSec: 120,
    timestampLabel: '01:45',
    titleTe: 'వెబ్‌సైట్ సందర్శన & ShareChat CTA',
    titleEn: 'Visit Website, WhatsApp & ShareChat CTA',
    badgeTe: 'సంప్రదింపు',
    badgeEn: 'CTA',
    scriptTe:
      'ఇప్పుడే సందర్శించండి, తెలుగు జ్యోతిషం డాట్ కామ్. వాట్సాప్ నంబర్, 89779, 86166. షేర్ చాట్ లో ఫాలో అవ్వండి, షేర్ చేయండి. శుభం భూయాత్!',
    scriptEn:
      'Visit telugujyothisham dot com today! Message WhatsApp at plus nine one, 89779, 86166. Follow us on ShareChat and share with your family. Shubham Bhuyat!',
  },
];

export const SHARECHAT_PROMO_ASSETS: Record<PromoLanguage, PromoVideoAsset> = {
  te: {
    lang: 'te',
    label: 'తెలుగు AI Human Voice (2:00 HD)',
    voiceLabel: 'Neural Telugu Voice (te-IN-MohanNeural) + Raga Hamsadhwani',
    publicUrl: '/assets/videos/telugujyothisham-sharechat-promo-2min-te.mp4',
    downloadFileName: 'telugujyothisham-sharechat-promo-2min-telugu.mp4',
    durationLabel: '02:00 (120s)',
    resolutionLabel: '720×1280 (9:16 HD MP4)',
    captionTitle: '🙏 శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — ఉచిత తెలుగు పంచాంగం, జాతకం PDF & వివాహ పొంతన!',
    captionBody: `🙏 నమస్కారం! మీ జీవిత ప్రశ్నలకు 100% శాస్త్రీయ వేద జ్యోతిష సమాధానం — ఇప్పుడు ఉచితంగా ఒకే వెబ్‌సైట్‌లో!

✨ www.telugujyothisham.com లో మీకు ఉచితంగా లభించే సేవలు:
📅 ప్రతిరోజూ ఉదయం దృక్సిద్ధాంత (NASA) తెలుగు పంచాంగం & లైవ్ 4×4 కుండలి
📜 37-అధ్యాయాల 100+ పేజీల సంపూర్ణ తెలుగు జాతకం PDF డౌన్‌లోడ్
⏱️ తెలుగులో మొట్టమొదటి 6-మెథడ్ జన్మ సమయ శుద్ధి (Birth Time Rectification) & కవలల D60
♈ మేషం నుండి మీనం వరకు 12 రాశుల దిన ఫలాలు & ఏలినాటి శని గోచారం
💍 36 గుణాల వివాహ పొంతన, శుభ ముహూర్తాలు & 27 నక్షత్రాల పిల్లల పేర్లు

📞 వ్యక్తిగత జాతక పరిశీలన, వాస్తు & వైదిక హోమాల కోసం:
బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (హైదరాబాద్)
WhatsApp / Call: +91 89779 86166
🌐 వెబ్‌సైట్: https://www.telugujyothisham.com

🙏 ఈ వీడియోను మీ కుటుంబ సభ్యులకు & మిత్రులకు తప్పక షేర్ చేయండి! ఫాలో అవ్వండి!`,
    hashtags:
      '#TeluguJyothisham #TeluguPanchangam #RashiPhalalu #Jathakam #VedicAstrology #ShareChatTelugu #శ్రీలక్ష్మిగణపతిజ్యోతిషాలయం #తెలుగుపంచాంగం #రాశిఫలాలు #వివాహపొంతన #HyderabadAstrologer #Telangana #AndhraPradesh',
  },
  en: {
    lang: 'en',
    label: 'English AI Human Voice (2:00 HD)',
    voiceLabel: 'Neural Indian English Voice (en-IN-PrabhatNeural) + Raga Hamsadhwani',
    publicUrl: '/assets/videos/telugujyothisham-sharechat-promo-2min-en.mp4',
    downloadFileName: 'telugujyothisham-sharechat-promo-2min-english.mp4',
    durationLabel: '02:00 (120s)',
    resolutionLabel: '720×1280 (9:16 HD MP4)',
    captionTitle: '🙏 Telugu Jyothisham — Free Drik Panchangam, 37-Chapter Janma Kundali PDF & Marriage Match!',
    captionBody: `🙏 Namaskaram! Discover 100% authentic Drik Siddhanta Vedic Astrology — free on one sacred portal!

✨ Free Tools on www.telugujyothisham.com:
📅 Daily NASA Drik Siddhanta Telugu Panchangam & Live 4×4 Kundali (India & USA/NRI)
📜 Free 37-Chapter 100+ Page Janma Kundali PDF (D1–D60, 120-Yr Dashas, 300 Rajayogas)
⏱️ 6-Method Classical Birth Time Rectification (BTR Lab) & Twins D60 Split
♈ Daily 12 Rashi Phalalu, Sade Sati Alerts & Live Planetary Sky Radar
💍 36-Guna Ashtakoota Marriage Matching, 90-Day Muhurtham Scanner & 27 Nakshatra Baby Names

📞 Personal Horoscope Reading, Vastu & Vedic Homas (India & Worldwide NRI):
Brahmasri Jallavaram Sai Dheeraj Sharma — Sri Lakshmi Ganapathi Jyothishalayam, Hyderabad
WhatsApp / Call: +91 89779 86166
🌐 Visit: https://www.telugujyothisham.com

🙏 Follow us on ShareChat and share this video with your family & friends!`,
    hashtags:
      '#TeluguJyothisham #VedicAstrology #TeluguPanchangam #FreeKundali #BirthTimeRectification #MarriageMatching #RashiPhalalu #ShareChat #HyderabadAstrologer #NRI #IndianAstrology #Jyothisham',
  },
};
