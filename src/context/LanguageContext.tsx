import React, { createContext, useContext, useState } from 'react';

export type Language = 'te' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (te: string, en: string) => string;
  tr: (text: string) => string;
}

const RASHI_EN_STEMS: Record<string, string> = {
  'మేషం': 'Aries (Mesha)',
  'మేష': 'Aries (Mesha)',
  'వృషభం': 'Taurus (Vrushabha)',
  'వృషభ': 'Taurus (Vrushabha)',
  'మిథునం': 'Gemini (Mithuna)',
  'మిథున': 'Gemini (Mithuna)',
  'కర్కాటకం': 'Cancer (Karkataka)',
  'కర్కాటక': 'Cancer (Karkataka)',
  'సింహం': 'Leo (Simha)',
  'సింహ': 'Leo (Simha)',
  'కన్య': 'Virgo (Kanya)',
  'కన్యా': 'Virgo (Kanya)',
  'తుల': 'Libra (Tula)',
  'తులా': 'Libra (Tula)',
  'వృశ్చికం': 'Scorpio (Vruschika)',
  'వృశ్చిక': 'Scorpio (Vruschika)',
  'ధనుస్సు': 'Sagittarius (Dhanus)',
  'ధను': 'Sagittarius (Dhanus)',
  'మకరం': 'Capricorn (Makara)',
  'మకర': 'Capricorn (Makara)',
  'కుంభం': 'Aquarius (Kumbha)',
  'కుంభ': 'Aquarius (Kumbha)',
  'మీనం': 'Pisces (Meena)',
  'మీన': 'Pisces (Meena)',
};

function translateChandrashtamamSentence(text: string): string {
  for (const [stem, en] of Object.entries(RASHI_EN_STEMS)) {
    if (text.includes(stem)) {
      return `Chandrashtamam for ${en} today. Natives of this sign are advised to exercise caution and defer major travels, new agreements, or risky decisions.`;
    }
  }
  return text;
}

function translateChandraSancharamSentence(text: string): string {
  let inRashi = 'Moon Transit';
  for (const [stem, en] of Object.entries(RASHI_EN_STEMS)) {
    if (text.includes(stem + ' రాశిలో') || text.includes(stem + 'లో')) {
      inRashi = en;
      break;
    }
  }

  const favList: string[] = [];
  for (const [stem, en] of Object.entries(RASHI_EN_STEMS)) {
    if (text.includes(stem) && !text.includes(stem + ' రాశిలో') && !text.includes(stem + 'లో')) {
      const short = en.split(' ')[0];
      if (!favList.includes(short)) favList.push(short);
    }
  }

  const favStr = favList.length > 0 ? favList.join(', ') : 'Allied Signs';
  return `Moon is transiting in ${inRashi}. Favorable lunar strength (Chandra Balam) and auspicious results for: ${favStr}.`;
}

// Comprehensive Vedic Panchangam Telugu -> English dictionary
const RAW_PANCHANGAM_TERMS: [string, string][] = [
  // Samvatsaram, Ayanam & Rutuvu
  ['శ్రీ పరాభవ నామ సంవత్సరం', 'Sri Parabhava Nama Samvatsaram'],
  ['శ్రీ ప్లవంగ నామ సంవత్సరం', 'Sri Plavanga Nama Samvatsaram'],
  ['శ్రీ విశ్వావసు నామ సంవత్సరం', 'Sri Vishwavasu Nama Samvatsaram'],
  ['శ్రీ క్రోధన నామ సంవత్సరం', 'Sri Krodhana Nama Samvatsaram'],
  ['శ్రీ శోభకృతు నామ సంవత్సరం', 'Sri Shobhakritu Nama Samvatsaram'],
  ['శ్రీ శుభకృతు నామ సంవత్సరం', 'Sri Shubhakritu Nama Samvatsaram'],
  ['శ్రీ ఆనంద నామ సంవత్సరం', 'Sri Ananda Nama Samvatsaram'],
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
  ['ఆశ్వయుజ మాసం, శుక్ల పక్షం', 'Ashwayuja Masam, Shukla Paksham (Waxing Moon)'],
  ['ఆశ్వయుజ మాసం, కృష్ణ పక్షం', 'Ashwayuja Masam, Krishna Paksham (Waning Moon)'],
  ['కార్తీక మాసం, శుక్ల పక్షం', 'Kartika Masam, Shukla Paksham (Waxing Moon)'],
  ['కార్తీక మాసం, కృష్ణ పక్షం', 'Kartika Masam, Krishna Paksham (Waning Moon)'],
  ['మార్గశిర మాసం, శుక్ల పక్షం', 'Margashira Masam, Shukla Paksham (Waxing Moon)'],
  ['మార్గశిర మాసం, కృష్ణ పక్షం', 'Margashira Masam, Krishna Paksham (Waning Moon)'],
  ['పుష్య మాసం, శుక్ల పక్షం', 'Pushya Masam, Shukla Paksham (Waxing Moon)'],
  ['పుష్య మాసం, కృష్ణ పక్షం', 'Pushya Masam, Krishna Paksham (Waning Moon)'],
  ['మాఘ మాసం, శుక్ల పక్షం', 'Magha Masam, Shukla Paksham (Waxing Moon)'],
  ['మాఘ మాసం, కృష్ణ పక్షం', 'Magha Masam, Krishna Paksham (Waning Moon)'],
  ['ఫాల్గుణ మాసం, శుక్ల పక్షం', 'Phalguna Masam, Shukla Paksham (Waxing Moon)'],
  ['ఫాల్గుణ మాసం, కృష్ణ పక్షం', 'Phalguna Masam, Krishna Paksham (Waning Moon)'],
  ['చైత్ర మాసం, శుక్ల పక్షం', 'Chaitra Masam, Shukla Paksham (Waxing Moon)'],
  ['చైత్ర మాసం, కృష్ణ పక్షం', 'Chaitra Masam, Krishna Paksham (Waning Moon)'],
  ['వైశాఖ మాసం, శుక్ల పక్షం', 'Vaishakha Masam, Shukla Paksham (Waxing Moon)'],
  ['వైశాఖ మాసం, కృష్ణ పక్షం', 'Vaishakha Masam, Krishna Paksham (Waning Moon)'],
  ['జ్యేష్ఠ మాసం, శుక్ల పక్షం', 'Jyeshtha Masam, Shukla Paksham (Waxing Moon)'],
  ['జ్యేష్ఠ మాసం, కృష్ణ పక్షం', 'Jyeshtha Masam, Krishna Paksham (Waning Moon)'],
  ['ఆషాఢ మాసం, శుక్ల పక్షం', 'Ashadha Masam, Shukla Paksham (Waxing Moon)'],
  ['ఆషాఢ మాసం, కృష్ణ పక్షం', 'Ashadha Masam, Krishna Paksham (Waning Moon)'],
  ['శ్రావణ మాసం, శుక్ల పక్షం', 'Shravana Masam, Shukla Paksham (Waxing Moon)'],
  ['శ్రావణ మాసం, కృష్ణ పక్షం', 'Shravana Masam, Krishna Paksham (Waning Moon)'],
  ['భాద్రపద మాసం, శుక్ల పక్షం', 'Bhadrapada Masam, Shukla Paksham (Waxing Moon)'],
  ['భాద్రపద మాసం, కృష్ణ పక్షం', 'Bhadrapada Masam, Krishna Paksham (Waning Moon)'],
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
  ['శుక్లపక్షం', 'Shukla Paksham (Waxing Moon)'],
  ['కృష్ణపక్షం', 'Krishna Paksham (Waning Moon)'],
  ['బహుళపక్షం', 'Bahula Paksham (Waning Moon)'],
  ['శుక్లపక్ష', 'Shukla Paksha'],
  ['కృష్ణపక్ష', 'Krishna Paksha'],
  ['బహుళపక్ష', 'Bahula Paksha'],
  ['నక్షత్రం', 'Nakshatram'],
  ['నక్షత్ర', 'Nakshatra'],
  ['పక్షం', 'Paksham'],
  ['తిథి', 'Tithi'],
  ['కరణం', 'Karanam'],
  ['యోగం', 'Yogam'],

  // English Calendar Months in Telugu
  ['అక్టోబర్', 'October'],
  ['నవంబర్', 'November'],
  ['డిసెంబర్', 'December'],
  ['జనవరి', 'January'],
  ['ఫిబ్రవరి', 'February'],
  ['మార్చి', 'March'],
  ['ఏప్రిల్', 'April'],
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
  ['ఉత్తరాషాడ', 'Uttarashadha'],
  ['పూర్వాషాడ', 'Purvashadha'],
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
  ['మఖ', 'Magha'],
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

  // Adjectives & Modifiers
  ['కార్తీక', 'Kartika'],
  ['శుక్ల', 'Shukla'],
  ['కృష్ణ', 'Krishna'],
  ['మరుసటి రోజు', 'Next Day'],
  ['మరుసటి', 'Next'],
  ['పూర్తి రోజు', 'Full Day'],
  ['పూర్తి', 'Full'],
  ['రోజు', 'Day'],
  ['ఎరుపు', 'Red'],
  ['నారింజ', 'Orange'],

  // Yogas (with and without "యోగం")
  ['విష్కంభ యోగం', 'Vishkambha Yoga'],
  ['ప్రీతి యోగం', 'Priti Yoga'],
  ['ఆయుష్మాన్ యోగం', 'Ayushman Yoga'],
  ['సౌభాగ్య యోగం', 'Saubhagya Yoga'],
  ['శోభన యోగం', 'Shobhana Yoga'],
  ['అతిగండ యోగం', 'Atiganda Yoga'],
  ['సుకర్మణ యోగం', 'Sukarma Yoga'],
  ['సుకర్మ యోగం', 'Sukarma Yoga'],
  ['ధృతి యోగం', 'Dhriti Yoga'],
  ['శూల యోగం', 'Shoola Yoga'],
  ['గండ యోగం', 'Ganda Yoga'],
  ['వృద్ధి యోగం', 'Vriddhi Yoga'],
  ['ధ్రువ యోగం', 'Dhruva Yoga'],
  ['ధృవ యోగం', 'Dhruva Yoga'],
  ['వ్యాఘాత యోగం', 'Vyaghata Yoga'],
  ['హర్షణ యోగం', 'Harshana Yoga'],
  ['వజ్ర యోగం', 'Vajra Yoga'],
  ['సిద్ధి యోగం', 'Siddhi Yoga'],
  ['వ్యతీపాత యోగం', 'Vyatipata Yoga'],
  ['వరియాన్ యోగం', 'Variyan Yoga'],
  ['వరీయాన్ యోగం', 'Variyan Yoga'],
  ['పరిఘ యోగం', 'Parigha Yoga'],
  ['శివ యోగం', 'Shiva Yoga'],
  ['సిద్ధ యోగం', 'Siddha Yoga'],
  ['సాధ్య యోగం', 'Sadhya Yoga'],
  ['శుభ యోగం', 'Shubha Yoga'],
  ['శుక్ల యోగం', 'Shukla Yoga'],
  ['బ్రహ్మ యోగం', 'Brahma Yoga'],
  ['ఇంద్ర యోగం', 'Indra (Aindra) Yoga'],
  ['ఐంద్ర యోగం', 'Aindra Yoga'],
  ['వైధృతి యోగం', 'Vaidhriti Yoga'],

  // Karanas (with and without "కరణం")
  ['విష్టి (భద్ర) కరణం', 'Vishti (Bhadra) Karana'],
  ['చతుష్పాద కరణం', 'Chatushpada Karana'],
  ['కింస్తుఘ్న కరణం', 'Kimstughna Karana'],
  ['తైతుల కరణం', 'Taitula Karana'],
  ['గరిజ కరణం', 'Garija Karana'],
  ['వణిజ కరణం', 'Vanija Karana'],
  ['శకుని కరణం', 'Shakuni Karana'],
  ['శకున కరణం', 'Shakuna Karana'],
  ['శకు\u09a8 కరణం', 'Shakuna Karana'],
  ['నాగ కరణం', 'Naga Karana'],
  ['నాగవ కరణం', 'Nagava Karana'],
  ['బాలవ కరణం', 'Balava Karana'],
  ['కౌలవ కరణం', 'Kaulava Karana'],
  ['విష్టి కరణం', 'Vishti Karana'],
  ['బవ కరణం', 'Bava Karana'],
  ['తైతుల', 'Taitula'],
  ['గరిజ', 'Garija'],
  ['వణిజ', 'Vanija'],
  ['శకుని', 'Shakuni'],
  ['శకున', 'Shakuna'],
  ['శకు\u09a8', 'Shakuna'],
  ['కౌలవ', 'Kaulava'],
  ['బాలవ', 'Balava'],
  ['విష్టి', 'Vishti'],
  ['బవ', 'Bava'],

  // Lagnas & Rashis (Long compound names first)
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
  ['ధనుర్లగ్నం', 'Dhanur Lagnam (Sagittarius Ascendant)'],
  ['మేషలగ్నం', 'Mesha Lagnam (Aries Ascendant)'],
  ['వృషభలగ్నం', 'Vrushabha Lagnam (Taurus Ascendant)'],
  ['మిథునలగ్నం', 'Mithuna Lagnam (Gemini Ascendant)'],
  ['కర్కాటకలగ్నం', 'Karkataka Lagnam (Cancer Ascendant)'],
  ['సింహలగ్నం', 'Simha Lagnam (Leo Ascendant)'],
  ['కన్యాలగ్నం', 'Kanya Lagnam (Virgo Ascendant)'],
  ['తులాలగ్నం', 'Tula Lagnam (Libra Ascendant)'],
  ['వృశ్చికలగ్నం', 'Vruschika Lagnam (Scorpio Ascendant)'],
  ['మకరలగ్నం', 'Makara Lagnam (Capricorn Ascendant)'],
  ['కుంభలగ్నం', 'Kumbha Lagnam (Aquarius Ascendant)'],
  ['మీనలగ్నం', 'Meena Lagnam (Pisces Ascendant)'],

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
  ['శని దేవుడు', 'Lord Shani (Saturn)'],
  ['శనీశ్వరుడు', 'Lord Shaneeshwara'],
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
  ['నైధన తార (వధ)', 'Naidhana Tara (Caution Star)'],
  ['నైధన తార', 'Naidhana Tara (Caution Star)'],
  ['మిత్ర తార', 'Mitra Tara (Friendly Star)'],

  // Deities
  ['శ్రీ దక్షిణామూర్తి, శ్రీ సాయిబాబా, గురు రాఘవేంద్ర స్వామి', 'Lord Dakshinamurthy, Sri Shirdi Sai Baba, Guru Raghavendra Swamy'],
  ['శ్రీ వేంకటేశ్వర స్వామి, ఆంజనేయ స్వామి, శని దేవుడు', 'Lord Venkateswara, Lord Hanuman, Lord Shani'],
  ['శ్రీ మహాలక్ష్మి దేవి, శ్రీ లలితా త్రిపుర సుందరి', 'Goddess Sri Mahalakshmi Devi, Sri Lalitha Tripura Sundari'],
  ['శ్రీ మహాలక్ష్మి దేవి, లలితా త్రిపురసుందరి', 'Goddess Sri Mahalakshmi Devi, Sri Lalitha Tripura Sundari'],
  ['సూర్య భగవానుడు, శ్రీ లక్ష్మీ నరసింహ స్వామి', 'Lord Surya Bhagavan, Sri Lakshmi Narasimha Swamy'],
  ['శ్రీ సుబ్రహ్మణ్య స్వామి, ఆంజనేయ స్వామి', 'Lord Subrahmanya Swamy, Lord Hanuman'],
  ['సుబ్రహ్మణ్య స్వామి, ఆంజనేయ స్వామి', 'Lord Subrahmanya Swamy, Lord Hanuman'],
  ['శ్రీ దక్షిణామూర్తి, శ్రీ దత్తాత్రేయుడు', 'Lord Dakshinamurthy, Lord Dattatreya'],
  ['దక్షిణామూర్తి, దత్తాత్రేయ స్వామి', 'Lord Dakshinamurthy, Lord Dattatreya'],
  ['శ్రీ విఘ్నేశ్వరుడు, శ్రీ మహావిష్ణువు', 'Lord Vigneshwara (Ganesha), Lord Maha Vishnu'],
  ['శ్రీ మహావిష్ణువు, శ్రీ దక్షిణామూర్తి', 'Lord Maha Vishnu, Lord Dakshinamurthy'],
  ['శ్రీ మహాలక్ష్మి, శ్రీ మహావిష్ణువు', 'Goddess Mahalakshmi, Lord Maha Vishnu'],
  ['సోమశేఖరుడు (శివుడు), చంద్ర దేవుడు', 'Lord Shiva (Somashekhara), Lord Chandra (Moon)'],
  ['పరమేశ్వరుడు (శివుడు), పార్వతీ దేవి', 'Lord Shiva (Parameshwara), Goddess Parvati Devi'],
  ['పరమశివుడు, శ్రీ పార్వతీ దేవి', 'Lord Shiva (Parama Shiva), Goddess Parvati Devi'],
  ['శ్రీ వేంకటేశ్వర స్వామి, శనీశ్వరుడు', 'Lord Venkateswara Swamy, Lord Shaneeshwara'],
  ['సూర్య భగవానుడు, పరమ శివుడు', 'Lord Surya Bhagavan, Lord Parama Shiva'],
  ['శ్రీ సూర్య భగవానుడు', 'Lord Surya Narayana Bhagavan'],
  ['శ్రీ మహాలక్ష్మి దేవి', 'Goddess Sri Mahalakshmi Devi'],
  ['పరమశివుడు', 'Lord Shiva (Parama Shiva)'],

  // Colors
  ['ఆకుపచ్చ (Green)', 'Emerald Green'],
  ['పసుపు (Yellow)', 'Bright Yellow'],
  ['గులాబీ, తెలుపు (Pink/White)', 'Pink & White'],
  ['గులాబీ / తెలుపు (Pink/White)', 'Pink & White'],
  ['గులాబీ / తెలుపు (Cream)', 'Rose Pink / Cream'],
  ['తెలుపు, గులాబీ (White/Pink)', 'White & Pink'],
  ['నలుపు / నీలం (Blue/Black)', 'Royal Blue & Black'],
  ['నీలం, నలుపు (Blue/Dark Navy)', 'Royal Blue & Dark Navy'],
  ['నీలం, నలుపు (Blue/Black)', 'Royal Blue & Black'],
  ['ఎరుపు / కాషాయం (Red/Saffron)', 'Crimson Red / Saffron'],
  ['ఎరుపు, కాషాయం (Red/Vermilion)', 'Crimson Red & Vermilion'],
  ['ఎరుపు, కాషాయం (Red/Orange)', 'Crimson Red & Saffron Orange'],
  ['ఎరుపు / నారింజ (Red/Orange)', 'Crimson Red & Bright Orange'],
  ['తెలుపు / లేత పసుపు (White/Cream)', 'Pristine White / Cream'],
  ['తెలుపు, వెండి (White/Silver)', 'Pearl White & Silver'],
  ['పసుపు / బంగారు (Yellow/Gold)', 'Golden Yellow'],
  ['పసుపు, బంగారు (Yellow/Gold)', 'Golden Yellow'],

  // Time & Status Connectors (Exact phrases)
  ['సూర్యోదయం నుండి', 'from Sunrise to'],
  ['సూర్యాస్తమయం వరకు', 'until Sunset'],
  ['సూర్యోదయం', 'Sunrise'],
  ['సూర్యాస్తమయం', 'Sunset'],
  ['తెల్లవారుజామున', 'Early Morning'],
  ['అర్ధరాత్రి', 'Midnight'],
  ['మధ్యాహ్నం', 'Afternoon'],
  ['సాయంత్రం', 'Evening'],
  ['ఉదయం', 'Morning'],
  ['రాత్రి', 'Night'],
  ['తదుపరి', 'followed by'],
  ['పూర్తిగా', 'Full Day'],
  ['వరకు', ''],
  ['యోగం', 'Yoga'],
  ['కరణం', 'Karana'],
  ['అమృత ఘడియలు', 'Amrutha Gadiyalu'],
  ['రాహుకాలం', 'Rahu Kalam'],
  ['యమగండం', 'Yamagandam'],
  ['దుర్ముహూర్తం', 'Durmuhurtham'],
  ['వర్జ్యం', 'Varjyam'],
  ['అభిజిత్ ముహూర్తం', 'Abhijit Muhurtham'],
  ['చంద్ర సంచారం', 'Moon Transit'],
  ['చంద్రాష్టమం', 'Chandrashtamam'],
  ['నవతార బలం', 'Navatara Strength'],
  ['అత్యంత అనుకూలం', 'Highly Favorable'],
  ['అనుకూలం', 'Favorable'],
  ['సాధారణం', 'Moderate'],
  ['ప్రతికూలం', 'Caution Advised'],
  ['శుభప్రదం', 'Auspicious'],
  ['శుభం', 'Auspicious'],
  ['అశుభం', 'Inauspicious'],
  ['మధ్యమం', 'Average'],
];

// Sort dictionary by length descending so longer phrases match first
const SORTED_PANCHANGAM_TERMS = [...RAW_PANCHANGAM_TERMS].sort((a, b) => b[0].length - a[0].length);

export function translatePanchangamString(text: string, lang: Language): string {
  if (lang === 'te' || !text) return text;

  // Handle Chandrashtamam Alert Sentences
  if (text.includes('చంద్రాష్టమం') && (text.includes('కావున') || text.includes('వాయిదా'))) {
    return translateChandrashtamamSentence(text);
  }

  // Handle Chandra Sancharam Transit Sentences
  if (text.includes('సంచరిస్తున్నాడు') || (text.includes('చంద్రబలం') && text.includes('కావున'))) {
    return translateChandraSancharamSentence(text);
  }

  let result = text;

  // Safe Gregorian month replacement for May (protecting 'మేషం', etc.)
  result = result.replace(/\bమే\b/g, 'May').replace(/(\d{1,2})\s+మే\s+(\d{4})/g, '$1 May $2');

  for (const [te, en] of SORTED_PANCHANGAM_TERMS) {
    if (result.includes(te)) {
      result = result.split(te).join(en);
    }
  }

  // Clean up any remaining formatting artifacts
  return result
    .replace(/\s+to\s+to\b/gi, ' to')
    .replace(/\bto\s*\(\s*followed by/gi, '(followed by')
    .replace(/\s+/g, ' ')
    .trim();
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
