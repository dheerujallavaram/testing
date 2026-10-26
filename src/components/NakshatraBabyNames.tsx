import React, { useState, useMemo } from 'react';
import { Search, Baby, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BabyNameEntry {
  nakshatraIndex: number;
  nakshatraTe: string;
  nakshatraEn: string;
  rashiTe: string;
  syllables: string[];
  boyNames: { nameTe: string; nameEn: string; meaningTe: string }[];
  girlNames: { nameTe: string; nameEn: string; meaningTe: string }[];
}

const NAKSHATRA_BABY_NAMES_DB: BabyNameEntry[] = [
  {
    nakshatraIndex: 1,
    nakshatraTe: 'అశ్విని',
    nakshatraEn: 'Ashwini',
    rashiTe: 'మేష రాశి',
    syllables: ['చూ (Chu)', 'చే (Che)', 'చో (Cho)', 'లా (La)'],
    boyNames: [
      { nameTe: 'చేతన్ రామ్ (Chetan Ram)', nameEn: 'Chetan Ram', meaningTe: 'చైతన్యవంతుడు, శ్రీరాముని తేజస్సు' },
      { nameTe: 'లక్ష్మీకాంత్ (Lakshmikant)', nameEn: 'Lakshmikant', meaningTe: 'శ్రీ మహావిష్ణువు' },
      { nameTe: 'చోళేశ్వర్ (Choleshwar)', nameEn: 'Choleshwar', meaningTe: 'పరమశివుడు' },
    ],
    girlNames: [
      { nameTe: 'చేతన శ్రీ (Chetana Sri)', nameEn: 'Chetana Sri', meaningTe: 'దివ్య జ్ఞానం, లక్ష్మీ స్వరూపం' },
      { nameTe: 'లాస్య ప్రియ (Lasya Priya)', nameEn: 'Lasya Priya', meaningTe: 'పార్వతీ దేవి నాట్య స్వరూపం' },
      { nameTe: 'లావణ్య (Lavanya)', nameEn: 'Lavanya', meaningTe: 'సౌందర్యవతి, కృప కలిగినది' },
    ],
  },
  {
    nakshatraIndex: 2,
    nakshatraTe: 'భరణి',
    nakshatraEn: 'Bharani',
    rashiTe: 'మేష రాశి',
    syllables: ['లీ (Li)', 'లూ (Lu)', 'లే (Le)', 'లో (Lo)'],
    boyNames: [
      { nameTe: 'లోకేశ్వర్ (Lokeshwar)', nameEn: 'Lokeshwar', meaningTe: 'ముల్లోకాలకు అధిపతి' },
      { nameTe: 'లీలాధర్ (Leeladhar)', nameEn: 'Leeladhar', meaningTe: 'శ్రీకృష్ణ భగవానుడు' },
      { nameTe: 'లోహిత్ కుమార్ (Lohit Kumar)', nameEn: 'Lohit Kumar', meaningTe: 'కుజ/సుబ్రహ్మణ్య తేజస్సు' },
    ],
    girlNames: [
      { nameTe: 'లీలావతి (Leelavathi)', nameEn: 'Leelavathi', meaningTe: 'దైవ లీలల స్వరూపిణి' },
      { nameTe: 'లేఖన శ్రీ (Lekhana Sri)', nameEn: 'Lekhana Sri', meaningTe: 'సరస్వతీ దేవి అనుగ్రహం' },
      { nameTe: 'లోపాముద్ర (Lopamudra)', nameEn: 'Lopamudra', meaningTe: 'అగస్త్య మహర్షి ధర్మపత్ని' },
    ],
  },
  {
    nakshatraIndex: 3,
    nakshatraTe: 'కృత్తిక',
    nakshatraEn: 'Krittika',
    rashiTe: 'మేషం (1) / వృషభం (2,3,4)',
    syllables: ['ఆ (Aa)', 'ఈ (Ee)', 'ఊ (Oo)', 'ఏ (Ae)'],
    boyNames: [
      { nameTe: 'ఆదిత్య వర్మ (Aditya Varma)', nameEn: 'Aditya Varma', meaningTe: 'సూర్య భగవానుని తేజస్సు' },
      { nameTe: 'ఈశ్వర్ చరణ్ (Eshwar Charan)', nameEn: 'Eshwar Charan', meaningTe: 'పరమేశ్వరుని ఆశీస్సులు' },
      { nameTe: 'ఏకాంత్ సాయి (Ekanth Sai)', nameEn: 'Ekanth Sai', meaningTe: 'నిశ్చలమైన మనస్సు కలవాడు' },
    ],
    girlNames: [
      { nameTe: 'ఆద్య శ్రీ (Aadya Sri)', nameEn: 'Aadya Sri', meaningTe: 'ఆదిశక్తి అమ్మవారు' },
      { nameTe: 'ఈశాని (Eshani)', nameEn: 'Eshani', meaningTe: 'పార్వతీ దేవి' },
      { nameTe: 'ఏకతా దేవి (Ekatha Devi)', nameEn: 'Ekatha Devi', meaningTe: 'ఐక్యత మరియు శాంతి స్వరూపం' },
    ],
  },
  {
    nakshatraIndex: 4,
    nakshatraTe: 'రోహిణి',
    nakshatraEn: 'Rohini',
    rashiTe: 'వృషభ రాశి',
    syllables: ['ఓ (O)', 'వా (Va)', 'వీ (Vi)', 'వూ (Vu)'],
    boyNames: [
      { nameTe: 'ఓంకార్ నాథ్ (Omkar Nath)', nameEn: 'Omkar Nath', meaningTe: 'ప్రణవ స్వరూపుడైన శివుడు' },
      { nameTe: 'వాసుదేవ కృష్ణ (Vasudeva Krishna)', nameEn: 'Vasudeva Krishna', meaningTe: 'శ్రీ మహావిష్ణువు' },
      { nameTe: 'వీర రాఘవ (Veera Raghava)', nameEn: 'Veera Raghava', meaningTe: 'శ్రీరామచంద్రుడు' },
    ],
    girlNames: [
      { nameTe: 'వాగ్దేవి (Vagdevi)', nameEn: 'Vagdevi', meaningTe: 'సరస్వతీ మాత' },
      { nameTe: 'వీణా పాణి (Veena Pani)', nameEn: 'Veena Pani', meaningTe: 'సంగీత విద్యా స్వరూపిణి' },
      { nameTe: 'వాసవి కన్యక (Vasavi Kanyaka)', nameEn: 'Vasavi Kanyaka', meaningTe: 'శ్రీ వాసవీ కన్యకా పరమేశ్వరి' },
    ],
  },
  {
    nakshatraIndex: 5,
    nakshatraTe: 'మృగశిర',
    nakshatraEn: 'Mrigashira',
    rashiTe: 'వృషభం (1,2) / మిథునం (3,4)',
    syllables: ['వే (Ve)', 'వో (Vo)', 'కా (Ka)', 'కీ (Ki)'],
    boyNames: [
      { nameTe: 'వేంకటేశ్వర్లు / వేదాంత్ (Vedanth)', nameEn: 'Vedanth', meaningTe: 'వేద జ్ఞాన శిఖరం' },
      { nameTe: 'కార్తికేయ (Karthikeya)', nameEn: 'Karthikeya', meaningTe: 'శ్రీ సుబ్రహ్మణ్య స్వామి' },
      { nameTe: 'కీర్తి వర్ధన్ (Keerthi Vardhan)', nameEn: 'Keerthi Vardhan', meaningTe: 'యశస్సును పెంచేవాడు' },
    ],
    girlNames: [
      { nameTe: 'వేదవతి (Vedavathi)', nameEn: 'Vedavathi', meaningTe: 'శ్రీ పద్మావతి అమ్మవారు' },
      { nameTe: 'కాత్యాయని (Katyayani)', nameEn: 'Katyayani', meaningTe: 'నవదుర్గలలో ఆరవ రూపం' },
      { nameTe: 'కీర్తన శ్రీ (Keerthana Sri)', nameEn: 'Keerthana Sri', meaningTe: 'దైవ సంకీర్తన' },
    ],
  },
  {
    nakshatraIndex: 6,
    nakshatraTe: 'ఆరుద్ర',
    nakshatraEn: 'Ardra',
    rashiTe: 'మిథున రాశి',
    syllables: ['కూ (Ku)', 'ఖం (Kham)', 'ఙ (Nga)', 'ఛా (Cha)'],
    boyNames: [
      { nameTe: 'కుమార స్వామి (Kumara Swamy)', nameEn: 'Kumara Swamy', meaningTe: 'శ్రీ స్కందుడు' },
      { nameTe: 'కుశల్ రామ్ (Kushal Ram)', nameEn: 'Kushal Ram', meaningTe: 'నేర్పరి, క్షేమకరుడు' },
      { nameTe: 'ఛాయాపతి (Chayapathi)', nameEn: 'Chayapathi', meaningTe: 'సూర్య భగవానుడు' },
    ],
    girlNames: [
      { nameTe: 'కుందన ప్రియ (Kundana Priya)', nameEn: 'Kundana Priya', meaningTe: 'స్వచ్ఛమైన బంగారం వంటిది' },
      { nameTe: 'కుసుమ లత (Kusuma Latha)', nameEn: 'Kusuma Latha', meaningTe: 'పుష్ప మాలిక' },
      { nameTe: 'ఛాయా దేవి (Chaya Devi)', nameEn: 'Chaya Devi', meaningTe: 'సూర్య పత్ని' },
    ],
  },
  {
    nakshatraIndex: 7,
    nakshatraTe: 'పునర్వసు',
    nakshatraEn: 'Punarvasu',
    rashiTe: 'మిథునం (1,2,3) / కర్కాటకం (4)',
    syllables: ['కే (Ke)', 'కో (Ko)', 'హా (Ha)', 'హీ (Hi)'],
    boyNames: [
      { nameTe: 'కేశవ నారాయణ (Keshava)', nameEn: 'Keshava', meaningTe: 'శ్రీ మహావిష్ణువు' },
      { nameTe: 'కోదండ రామ్ (Kodanda Ram)', nameEn: 'Kodanda Ram', meaningTe: 'పునర్వసు నక్షత్ర జాతుడైన శ్రీరాముడు' },
      { nameTe: 'హరిహరన్ (Hariharan)', nameEn: 'Hariharan', meaningTe: 'శివకేశవుల స్వరూపం' },
    ],
    girlNames: [
      { nameTe: 'హారిక శ్రీ (Harika Sri)', nameEn: 'Harika Sri', meaningTe: 'మనోహరమైన లక్ష్మీ కళ' },
      { nameTe: 'హిమబిందు (Himabindu)', nameEn: 'Himabindu', meaningTe: 'మంచు బిందువు వలె స్వచ్ఛమైనది' },
      { nameTe: 'కోమల వల్లి (Komala Valli)', nameEn: 'Komala Valli', meaningTe: 'గోదాదేవి / లక్ష్మీదేవి' },
    ],
  },
  {
    nakshatraIndex: 8,
    nakshatraTe: 'పుష్యమి',
    nakshatraEn: 'Pushyami',
    rashiTe: 'కర్కాటక రాశి',
    syllables: ['హూ (Hu)', 'హే (He)', 'హో (Ho)', 'డా (Da)'],
    boyNames: [
      { nameTe: 'హేమంత్ కుమార్ (Hemanth)', nameEn: 'Hemanth', meaningTe: 'బంగారం / హేమంత ఋతువు' },
      { nameTe: 'హేరంబ గణేష్ (Heramba)', nameEn: 'Heramba', meaningTe: 'సింహ వాహన గణపతి' },
      { nameTe: 'హోమేశ్వర్ (Homeshwar)', nameEn: 'Homeshwar', meaningTe: 'యజ్ఞ స్వరూపుడు' },
    ],
    girlNames: [
      { nameTe: 'హేమలత / హేమశ్రీ (Hema Sri)', nameEn: 'Hema Sri', meaningTe: 'బంగారు లక్ష్మి' },
      { nameTe: 'హేమావతి (Hemavathi)', nameEn: 'Hemavathi', meaningTe: 'పార్వతీ అమ్మవారు' },
      { nameTe: 'హోమిక (Homika)', nameEn: 'Homika', meaningTe: 'పవిత్ర యజ్ఞ జ్వాల' },
    ],
  },
  {
    nakshatraIndex: 9,
    nakshatraTe: 'ఆశ్లేష',
    nakshatraEn: 'Ashlesha',
    rashiTe: 'కర్కాటక రాశి',
    syllables: ['డీ (Di)', 'డూ (Du)', 'డే (De)', 'డో (Do)'],
    boyNames: [
      { nameTe: 'దివాకర్ / దీక్షిత్ (Deekshith)', nameEn: 'Deekshith', meaningTe: 'నిষ্ঠాగరిష్ఠుడు' },
      { nameTe: 'దుర్గా ప్రసాద్ (Durga Prasad)', nameEn: 'Durga Prasad', meaningTe: 'అమ్మవారి అనుగ్రహం' },
      { nameTe: 'దేవేంద్ర నాథ్ (Devendra)', nameEn: 'Devendra', meaningTe: 'దేవతల రాజు ఇంద్రుడు' },
    ],
    girlNames: [
      { nameTe: 'దీపిక శ్రీ (Deepika Sri)', nameEn: 'Deepika Sri', meaningTe: 'కాంతి ప్రదాయిని' },
      { nameTe: 'దుర్గా భవాని (Durga Bhavani)', nameEn: 'Durga Bhavani', meaningTe: 'జగన్మాత' },
      { nameTe: 'దేవయాని (Devayani)', nameEn: 'Devayani', meaningTe: 'దైవ శక్తి సంపన్నురాలు' },
    ],
  },
  {
    nakshatraIndex: 10,
    nakshatraTe: 'మఖ',
    nakshatraEn: 'Magha',
    rashiTe: 'సింహ రాశి',
    syllables: ['మా (Ma)', 'మీ (Mi)', 'మూ (Mu)', 'మే (Me)'],
    boyNames: [
      { nameTe: 'మాధవ కృష్ణ (Madhava)', nameEn: 'Madhava', meaningTe: 'లక్ష్మీపతి శ్రీకృష్ణుడు' },
      { nameTe: 'మారుతి నందన్ (Maruthi)', nameEn: 'Maruthi', meaningTe: 'ఆంజనేయ స్వామి' },
      { nameTe: 'మురళీ మనోహర్ (Murali)', nameEn: 'Murali Manohar', meaningTe: 'వేణుగోపాలుడు' },
    ],
    girlNames: [
      { nameTe: 'మానస శ్రీ (Manasa Sri)', nameEn: 'Manasa Sri', meaningTe: 'پవిత్ర హృదయం కలది' },
      { nameTe: 'మీనాక్షి (Meenakshi)', nameEn: 'Meenakshi', meaningTe: 'మధురై మీనాక్షి అమ్మవారు' },
      { nameTe: 'మేఘన (Meghana)', nameEn: 'Meghana', meaningTe: 'వర్ష మేఘం వలె చల్లనిది' },
    ],
  },
  {
    nakshatraIndex: 11,
    nakshatraTe: 'పుబ్బ (పూర్వ ఫల్గుణి)',
    nakshatraEn: 'Pubba',
    rashiTe: 'సింహ రాశి',
    syllables: ['మో (Mo)', 'టా (Ta)', 'టీ (Ti)', 'టూ (Tu)'],
    boyNames: [
      { nameTe: 'మోహన్ రామ్ (Mohan Ram)', nameEn: 'Mohan Ram', meaningTe: 'ఆకర్షణీయమైన శ్రీరాముడు' },
      { nameTe: 'మోక్షిత్ (Mokshith)', nameEn: 'Mokshith', meaningTe: 'ముక్తి మార్గగామి' },
      { nameTe: 'తరుణ్ తేజ్ (Tarun Tej)', nameEn: 'Tarun Tej', meaningTe: 'నిత్య నూతన తేజస్సు' },
    ],
    girlNames: [
      { nameTe: 'మోహన ప్రియ (Mohana Priya)', nameEn: 'Mohana Priya', meaningTe: 'దివ్య సౌందర్యవతి' },
      { nameTe: 'మోక్షద (Mokshada)', nameEn: 'Mokshada', meaningTe: 'మోక్షాన్ని ప్రసాదించే దేవి' },
      { nameTe: 'తులసి దేవి (Tulasi Devi)', nameEn: 'Tulasi Devi', meaningTe: 'విష్ణు ప్రియ తులసి' },
    ],
  },
  {
    nakshatraIndex: 12,
    nakshatraTe: 'ఉత్తర (ఉత్తర ఫల్గుణి)',
    nakshatraEn: 'Uttara',
    rashiTe: 'సింహం (1) / కన్య (2,3,4)',
    syllables: ['టే (Te)', 'టో (To)', 'పా (Pa)', 'పీ (Pi)'],
    boyNames: [
      { nameTe: 'పవన్ కుమార్ (Pavan Kumar)', nameEn: 'Pavan Kumar', meaningTe: 'వాయుపుత్రుడు' },
      { nameTe: 'పరమేశ్వర్ (Parameshwar)', nameEn: 'Parameshwar', meaningTe: 'మహాదేవుడు' },
      { nameTe: 'పీతాంబర్ (Peethambar)', nameEn: 'Peethambar', meaningTe: 'శ్రీ మహావిష్ణువు' },
    ],
    girlNames: [
      { nameTe: 'పావని శ్రీ (Pavani Sri)', nameEn: 'Pavani Sri', meaningTe: 'పవిత్ర గంగా ప్రవాహం' },
      { nameTe: 'పద్మావతి (Padmavathi)', nameEn: 'Padmavathi', meaningTe: 'అలమేలు మంగమ్మ' },
      { nameTe: 'పార్వతి (Parvathi)', nameEn: 'Parvathi', meaningTe: 'జగన్మాత గౌరీదేవి' },
    ],
  },
  {
    nakshatraIndex: 13,
    nakshatraTe: 'హస్త',
    nakshatraEn: 'Hasta',
    rashiTe: 'కన్యా రాశి',
    syllables: ['పూ (Pu)', 'షం (Sha)', 'ణా (Na)', 'ఠా (Tha)'],
    boyNames: [
      { nameTe: 'పురుషోత్తమ్ (Purushotham)', nameEn: 'Purushotham', meaningTe: 'శ్రీరామ / మహావిష్ణువు' },
      { nameTe: 'షణ్ముఖ నాథ్ (Shanmukha)', nameEn: 'Shanmukha', meaningTe: 'శ్రీ సుబ్రహ్మణ్య స్వామి' },
      { nameTe: 'పునీత్ రాజ్ (Puneeth)', nameEn: 'Puneeth', meaningTe: 'నిర్మలమైన మనస్సు కలవాడు' },
    ],
    girlNames: [
      { nameTe: 'పూజిత శ్రీ (Poojitha Sri)', nameEn: 'Poojitha Sri', meaningTe: 'అర్చించబడే దేవి' },
      { nameTe: 'షర్మిల (Sharmila)', nameEn: 'Sharmila', meaningTe: 'ఆనంద ప్రదాయిని' },
      { nameTe: 'పూర్ణిమ (Poornima)', nameEn: 'Poornima', meaningTe: 'పున్నమి చంద్రిక' },
    ],
  },
  {
    nakshatraIndex: 14,
    nakshatraTe: 'చిత్త',
    nakshatraEn: 'Chitta',
    rashiTe: 'కన్య (1,2) / తుల (3,4)',
    syllables: ['పే (Pe)', 'పో (Po)', 'రా (Ra)', 'రీ (Ri)'],
    boyNames: [
      { nameTe: 'రామచంద్ర / రాఘవేంద్ర (Raghavendra)', nameEn: 'Raghavendra', meaningTe: 'శ్రీ రాఘవేంద్ర స్వామి' },
      { nameTe: 'రాజేంద్ర ప్రసాద్ (Rajendra)', nameEn: 'Rajendra', meaningTe: 'రాజులకు రాజు' },
      { nameTe: 'రిషి కుమార్ (Rishi Kumar)', nameEn: 'Rishi Kumar', meaningTe: 'మహర్షి తేజస్సు' },
    ],
    girlNames: [
      { nameTe: 'రాజేశ్వరి (Rajeshwari)', nameEn: 'Rajeshwari', meaningTe: 'శ్రీ రాజరాజేశ్వరి అమ్మవారు' },
      { nameTe: 'రాధిక శ్రీ (Radhika Sri)', nameEn: 'Radhika Sri', meaningTe: 'శ్రీకృష్ణ ప్రియ రాధాదేవి' },
      { nameTe: 'రితిక (Rithika)', nameEn: 'Rithika', meaningTe: 'సత్యం మరియు ధర్మం' },
    ],
  },
  {
    nakshatraIndex: 15,
    nakshatraTe: 'స్వాతి',
    nakshatraEn: 'Swati',
    rashiTe: 'తులా రాశి',
    syllables: ['రూ (Ru)', 'రే (Re)', 'రో (Ro)', 'తా (Ta)'],
    boyNames: [
      { nameTe: 'రుద్ర తేజ్ (Rudra Tej)', nameEn: 'Rudra Tej', meaningTe: 'శివ తేజస్సు' },
      { nameTe: 'రేవంత్ కుమార్ (Revanth)', nameEn: 'Revanth', meaningTe: 'సూర్య పుత్రుడు' },
      { nameTe: 'రోహిత్ శర్మ (Rohith)', nameEn: 'Rohith', meaningTe: 'ఉదయించే సూర్య కిరణం' },
    ],
    girlNames: [
      { nameTe: 'రుక్మిణి దేవి (Rukmini Devi)', nameEn: 'Rukmini Devi', meaningTe: 'శ్రీకృష్ణ పట్టమహిషి' },
      { nameTe: 'రేవతి శ్రీ (Revathi Sri)', nameEn: 'Revathi Sri', meaningTe: 'సమృద్ధిని ఇచ్చే తార' },
      { nameTe: 'తారకేశ్వరి (Tarakeshwari)', nameEn: 'Tarakeshwari', meaningTe: 'పార్వతీ దేవి' },
    ],
  },
  {
    nakshatraIndex: 16,
    nakshatraTe: 'విశాఖ',
    nakshatraEn: 'Vishakha',
    rashiTe: 'తుల (1,2,3) / వృశ్చికం (4)',
    syllables: ['తీ (Ti)', 'తూ (Tu)', 'తే (Te)', 'తో (To)'],
    boyNames: [
      { nameTe: 'తిరుమలేశ్ (Tirumalesh)', nameEn: 'Tirumalesh', meaningTe: 'శ్రీ వేంకటేశ్వర స్వామి' },
      { nameTe: 'తేజోమయ్ (Tejomay)', nameEn: 'Tejomay', meaningTe: 'దివ్య కాంతి పుంజం' },
      { nameTe: 'తోషిత్ రామ్ (Toshith)', nameEn: 'Toshith', meaningTe: 'సంతోషాన్ని పంచేవాడు' },
    ],
    girlNames: [
      { nameTe: 'తేజస్విని (Tejaswini)', nameEn: 'Tejaswini', meaningTe: 'బ్రహ్మ తేజస్సు కలది' },
      { nameTe: 'తిరుమల శ్రీ (Tirumala Sri)', nameEn: 'Tirumala Sri', meaningTe: 'శ్రీదేవి అనుగ్రహం' },
      { nameTe: 'తులజా భవాని (Tulaja Bhavani)', nameEn: 'Tulaja Bhavani', meaningTe: 'శక్తి స్వరూపిణి' },
    ],
  },
  {
    nakshatraIndex: 17,
    nakshatraTe: 'అనురాధ',
    nakshatraEn: 'Anuradha',
    rashiTe: 'వృశ్చిక రాశి',
    syllables: ['నా (Na)', 'నీ (Ni)', 'నూ (Nu)', 'నే (Ne)'],
    boyNames: [
      { nameTe: 'నారాయణ మూర్తి (Narayana)', nameEn: 'Narayana', meaningTe: 'శ్రీ మహావిష్ణువు' },
      { nameTe: 'నిఖిల్ తేజ్ (Nikhil Tej)', nameEn: 'Nikhil Tej', meaningTe: 'సంపూర్ణమైన తేజస్సు' },
      { nameTe: 'నీలకంఠేశ్వర్ (Neelakantheshwar)', nameEn: 'Neelakantheshwar', meaningTe: 'పరమశివుడు' },
    ],
    girlNames: [
      { nameTe: 'నిహారిక (Niharika)', nameEn: 'Niharika', meaningTe: 'నక్షత్ర మండలం / మంచు బిందువు' },
      { nameTe: 'నీరజ శ్రీ (Neeraja Sri)', nameEn: 'Neeraja Sri', meaningTe: 'పద్మాసన లక్ష్మీదేవి' },
      { nameTe: 'నేత్రావతి (Nethravathi)', nameEn: 'Nethravathi', meaningTe: 'పుణ్య నది' },
    ],
  },
  {
    nakshatraIndex: 18,
    nakshatraTe: 'జ్యేష్ఠ',
    nakshatraEn: 'Jyeshtha',
    rashiTe: 'వృశ్చిక రాశి',
    syllables: ['నో (No)', 'యా (Ya)', 'యీ (Yi)', 'యూ (Yu)'],
    boyNames: [
      { nameTe: 'యశ్వంత్ రాజ్ (Yashwanth)', nameEn: 'Yashwanth', meaningTe: 'కీర్తి ప్రతిష్ఠలు కలవాడు' },
      { nameTe: 'యుగంధర్ (Yugandhar)', nameEn: 'Yugandhar', meaningTe: 'శ్రీకృష్ణ పరమాత్మ' },
      { nameTe: 'యాజ్ఞవల్క్య (Yagnavalkya)', nameEn: 'Yagnavalkya', meaningTe: 'మహర్షి' },
    ],
    girlNames: [
      { nameTe: 'యామిని ప్రియ (Yamini Priya)', nameEn: 'Yamini Priya', meaningTe: 'చంద్ర కాంతి గల రాత్రి' },
      { nameTe: 'యశోద శ్రీ (Yashoda Sri)', nameEn: 'Yashoda Sri', meaningTe: 'శ్రీకృష్ణుని తల్లి' },
      { nameTe: 'యుక్త ముఖి (Yuktha)', nameEn: 'Yuktha', meaningTe: 'బుద్ధిమంతురాలు' },
    ],
  },
  {
    nakshatraIndex: 19,
    nakshatraTe: 'మూల',
    nakshatraEn: 'Moola',
    rashiTe: 'ధనుస్సు రాశి',
    syllables: ['యే (Ye)', 'యో (Yo)', 'భా (Bha)', 'భీ (Bhi)'],
    boyNames: [
      { nameTe: 'యోగేశ్వర్ (Yogeshwar)', nameEn: 'Yogeshwar', meaningTe: 'శ్రీకృష్ణుడు / పరమశివుడు' },
      { nameTe: 'భాను ప్రకాష్ (Bhanu Prakash)', nameEn: 'Bhanu Prakash', meaningTe: 'సూర్య తేజస్సు' },
      { nameTe: 'భీమ శంకర్ (Bheema Shankar)', nameEn: 'Bheema Shankar', meaningTe: 'ద్వాదశ జ్యోతిర్లింగ స్వరూపం' },
    ],
    girlNames: [
      { nameTe: 'భార్గవి శ్రీ (Bhargavi Sri)', nameEn: 'Bhargavi Sri', meaningTe: 'మహాలక్ష్మీ అమ్మవారు' },
      { nameTe: 'యోగిత (Yogitha)', nameEn: 'Yogitha', meaningTe: 'ధ్యాన నిష్ఠ కలది' },
      { nameTe: 'భావన (Bhavana)', nameEn: 'Bhavana', meaningTe: 'సత్సంకల్పం కలిగినది' },
    ],
  },
  {
    nakshatraIndex: 20,
    nakshatraTe: 'పూర్వాషాఢ',
    nakshatraEn: 'Purvashadha',
    rashiTe: 'ధనుస్సు రాశి',
    syllables: ['భూ (Bhu)', 'ధా (Dha)', 'ఫా (Pha)', 'ఢా (Dha)'],
    boyNames: [
      { nameTe: 'భువనేశ్వర్ (Bhuvaneshwar)', nameEn: 'Bhuvaneshwar', meaningTe: 'లోకాధిపతి' },
      { nameTe: 'ధనుంజయ్ (Dhanunjay)', nameEn: 'Dhanunjay', meaningTe: 'అర్జునుడు / విష్ణువు' },
      { nameTe: 'ఫణీంద్ర నాథ్ (Phaneendra)', nameEn: 'Phaneendra', meaningTe: 'ఆదిశేషుడు' },
    ],
    girlNames: [
      { nameTe: 'భువనేశ్వరి (Bhuvaneshwari)', nameEn: 'Bhuvaneshwari', meaningTe: 'దశ మహావిద్యలలో జగన్మాత' },
      { nameTe: 'ధాత్రి శ్రీ (Dhathri Sri)', nameEn: 'Dhathri Sri', meaningTe: 'భూదేవి / తులసి' },
      { nameTe: 'ధనలక్ష్మి (Dhanalakshmi)', nameEn: 'Dhanalakshmi', meaningTe: 'ఐశ్వర్య లక్ష్మి' },
    ],
  },
  {
    nakshatraIndex: 21,
    nakshatraTe: 'ఉత్తరాషాఢ',
    nakshatraEn: 'Uttarashadha',
    rashiTe: 'ధనుస్సు (1) / మకరం (2,3,4)',
    syllables: ['భే (Bhe)', 'భో (Bho)', 'జా (Ja)', 'జీ (Ji)'],
    boyNames: [
      { nameTe: 'జగదీశ్వర్ (Jagadeeshwar)', nameEn: 'Jagadeeshwar', meaningTe: 'విశ్వనాథుడు' },
      { nameTe: 'జయరామ్ (Jayaram)', nameEn: 'Jayaram', meaningTe: 'విజయ రాముడు' },
      { nameTe: 'జీవన్ కుమార్ (Jeevan)', nameEn: 'Jeevan', meaningTe: 'ప్రాణశక్తి కలవాడు' },
    ],
    girlNames: [
      { nameTe: 'జానకి దేవి (Janaki Devi)', nameEn: 'Janaki Devi', meaningTe: 'సీతా మహాదేవి' },
      { nameTe: 'జయలక్ష్మి (Jayalakshmi)', nameEn: 'Jayalakshmi', meaningTe: 'విజయ లక్ష్మి' },
      { nameTe: 'జీవిత శ్రీ (Jeevitha Sri)', nameEn: 'Jeevitha Sri', meaningTe: 'సంతోషకరమైన జీవనం' },
    ],
  },
  {
    nakshatraIndex: 22,
    nakshatraTe: 'శ్రవణం',
    nakshatraEn: 'Shravanam',
    rashiTe: 'మకర రాశి',
    syllables: ['జూ (Ju)', 'జే (Je)', 'జో (Jo)', 'ఖా (Kha)'],
    boyNames: [
      { nameTe: 'జోగేశ్వర రావు (Jogeshwar)', nameEn: 'Jogeshwar', meaningTe: 'పరమేశ్వరుడు' },
      { nameTe: 'జయదేవ్ (Jayadev)', nameEn: 'Jayadev', meaningTe: 'గీతగోవింద కర్త / విష్ణు భక్తుడు' },
      { nameTe: 'జ్యోతిర్మయ్ (Jyothirmay)', nameEn: 'Jyothirmay', meaningTe: 'కాంతి స్వరూపుడు' },
    ],
    girlNames: [
      { nameTe: 'జ్యోత్స్న శ్రీ (Jyothsna Sri)', nameEn: 'Jyothsna Sri', meaningTe: 'వెన్నెల కాంతి' },
      { nameTe: 'జోషిత (Joshitha)', nameEn: 'Joshitha', meaningTe: 'ఆనందభరితమైనది' },
      { nameTe: 'జయంతి (Jayanthi)', nameEn: 'Jayanthi', meaningTe: 'విజయాన్ని ఇచ్చే దేవి' },
    ],
  },
  {
    nakshatraIndex: 23,
    nakshatraTe: 'ధనిష్ఠ',
    nakshatraEn: 'Dhanishtha',
    rashiTe: 'మకరం (1,2) / కుంభం (3,4)',
    syllables: ['గా (Ga)', 'గీ (Gi)', 'గూ (Gu)', 'గే (Ge)'],
    boyNames: [
      { nameTe: 'గణేశ్ / గౌతమ్ (Gowtham)', nameEn: 'Gowtham', meaningTe: 'గౌతమ మహర్షి' },
      { nameTe: 'గిరిధర్ గోపాల్ (Giridhar)', nameEn: 'Giridhar', meaningTe: 'గోవర్ధన గిరిధారి శ్రీకృష్ణుడు' },
      { nameTe: 'గుణశేఖర్ (Gunashekhar)', nameEn: 'Gunashekhar', meaningTe: 'సద్గుణ సంపన్నుడు' },
    ],
    girlNames: [
      { nameTe: 'గాయత్రి దేవి (Gayathri Devi)', nameEn: 'Gayathri Devi', meaningTe: 'వేదమాత గాయత్రి' },
      { nameTe: 'గీతాంజలి (Geethanjali)', nameEn: 'Geethanjali', meaningTe: 'భక్తి గీత మాలిక' },
      { nameTe: 'గౌతమి శ్రీ (Gowthami Sri)', nameEn: 'Gowthami Sri', meaningTe: 'పవిత్ర గోదావరి నది' },
    ],
  },
  {
    nakshatraIndex: 24,
    nakshatraTe: 'శతభిషం',
    nakshatraEn: 'Shatabhisham',
    rashiTe: 'కుంభ రాశి',
    syllables: ['గో (Go)', 'సా (Sa)', 'సీ (Si)', 'సూ (Su)'],
    boyNames: [
      { nameTe: 'గోవింద రాజ్ (Govinda Raj)', nameEn: 'Govinda Raj', meaningTe: 'శ్రీ వేంకటేశ్వర స్వామి' },
      { nameTe: 'సాయి ధీరజ్ (Sai Dheeraj)', nameEn: 'Sai Dheeraj', meaningTe: 'ధైర్యం మరియు సద్గురు అనుగ్రహం' },
      { nameTe: 'సూర్య నారాయణ (Surya Narayana)', nameEn: 'Surya Narayana', meaningTe: 'ప్రత్యక్ష దైవం సూర్యుడు' },
    ],
    girlNames: [
      { nameTe: 'సాహితి శ్రీ (Sahithi Sri)', nameEn: 'Sahithi Sri', meaningTe: 'సాహిత్య సరస్వతి' },
      { nameTe: 'సీతా మహాలక్ష్మి (Seetha Mahalakshmi)', nameEn: 'Seetha Mahalakshmi', meaningTe: 'జగన్మాత సీతాదేవి' },
      { nameTe: 'సువర్ణ లత (Suvarna Latha)', nameEn: 'Suvarna Latha', meaningTe: 'బంగారు తీగ' },
    ],
  },
  {
    nakshatraIndex: 25,
    nakshatraTe: 'పూర్వాభాద్ర',
    nakshatraEn: 'Purvabhadra',
    rashiTe: 'కుంభం (1,2,3) / మీనం (4)',
    syllables: ['సే (Se)', 'సో (So)', 'దా (Da)', 'దీ (Di)'],
    boyNames: [
      { nameTe: 'సోమశేఖర్ (Somashekhar)', nameEn: 'Somashekhar', meaningTe: 'చంద్రుని ధరించిన శివుడు' },
      { nameTe: 'దామోదర్ రావు (Damodar)', nameEn: 'Damodar', meaningTe: 'శ్రీ మహావిష్ణువు' },
      { nameTe: 'దీపక్ తేజ్ (Deepak Tej)', nameEn: 'Deepak Tej', meaningTe: 'దివ్య జ్యోతి' },
    ],
    girlNames: [
      { nameTe: 'సోమ్య శ్రీ (Sowmya Sri)', nameEn: 'Sowmya Sri', meaningTe: 'శాంత స్వభావం కలది' },
      { nameTe: 'దాక్షాయణి (Dakshayani)', nameEn: 'Dakshayani', meaningTe: 'పార్వతీ దేవి' },
      { nameTe: 'దీప్తి ప్రియ (Deepthi Priya)', nameEn: 'Deepthi Priya', meaningTe: 'కాంతిమంతమైనది' },
    ],
  },
  {
    nakshatraIndex: 26,
    nakshatraTe: 'ఉత్తరాభాద్ర',
    nakshatraEn: 'Uttarabhadra',
    rashiTe: 'మీన రాశి',
    syllables: ['దూ (Du)', 'థ (Tha)', 'ఝ (Jha)', 'ఞ (Nya)'],
    boyNames: [
      { nameTe: 'దుష్యంత్ కుమార్ (Dushyanth)', nameEn: 'Dushyanth', meaningTe: 'చంద్రవంశ మహారాజు' },
      { nameTe: 'ధీరజ్ వర్మ (Dheeraj Varma)', nameEn: 'Dheeraj Varma', meaningTe: 'స్థిరచిత్తం, ధైర్యం కలవాడు' },
      { nameTe: 'జ్ఞానేశ్వర్ (Gnaneshwar)', nameEn: 'Gnaneshwar', meaningTe: 'జ్ఞాన స్వరూపుడు' },
    ],
    girlNames: [
      { nameTe: 'ఝాన్సీ లక్ష్మి (Jhansi Lakshmi)', nameEn: 'Jhansi Lakshmi', meaningTe: 'వీర లక్ష్మి' },
      { nameTe: 'దుర్గా శ్రీ (Durga Sri)', nameEn: 'Durga Sri', meaningTe: 'కనకదుర్గమ్మ అనుగ్రహం' },
      { nameTe: 'జ్ఞాన ప్రసూనాంబ (Gnana Prasunamba)', nameEn: 'Gnana Prasunamba', meaningTe: 'శ్రీకాళహస్తి అమ్మవారు' },
    ],
  },
  {
    nakshatraIndex: 27,
    nakshatraTe: 'రేవతి',
    nakshatraEn: 'Revati',
    rashiTe: 'మీన రాశి',
    syllables: ['దే (De)', 'దో (Do)', 'చా (Cha)', 'చీ (Chi)'],
    boyNames: [
      { nameTe: 'దేవరాజ్ / దేవాంశ్ (Devansh)', nameEn: 'Devansh', meaningTe: 'దైవ అంశతో జన్మించినవాడు' },
      { nameTe: 'చాణక్య రామ్ (Chanakya)', nameEn: 'Chanakya', meaningTe: 'నీతి శాస్త్ర కోవిదుడు' },
      { nameTe: 'చిరంజీవి (Chiranjeevi)', nameEn: 'Chiranjeevi', meaningTe: 'దీర్ఘాయుష్మంతుడు (ఆంజనేయుడు)' },
    ],
    girlNames: [
      { nameTe: 'దేవిక శ్రీ (Devika Sri)', nameEn: 'Devika Sri', meaningTe: 'పవిత్ర దేవతా స్వరూపం' },
      { nameTe: 'చారులత (Charulatha)', nameEn: 'Charulatha', meaningTe: 'అందమైన తీగ' },
      { nameTe: 'చిన్మయి (Chinmayi)', nameEn: 'Chinmayi', meaningTe: 'శుద్ధ చైతన్య స్వరూపిణి' },
    ],
  },
];

export const NakshatraBabyNames: React.FC = () => {
  const { t } = useLanguage();
  const [selectedNakshatra, setSelectedNakshatra] = useState<number>(0); // 0 = All
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl'>('all');

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return NAKSHATRA_BABY_NAMES_DB.filter((entry) => {
      if (selectedNakshatra !== 0 && entry.nakshatraIndex !== selectedNakshatra) return false;
      if (!q) return true;
      const hay = [
        entry.nakshatraTe,
        entry.nakshatraEn,
        entry.rashiTe,
        ...entry.syllables,
        ...entry.boyNames.map((b) => `${b.nameTe} ${b.nameEn} ${b.meaningTe}`),
        ...entry.girlNames.map((g) => `${g.nameTe} ${g.nameEn} ${g.meaningTe}`),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [selectedNakshatra, searchQuery]);

  return (
    <div className="space-y-6 font-telugu">
      {/* Header & Filter Bar */}
      <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 border border-amber-200/90 space-y-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
            <Baby size={22} className="text-amber-700" />
            <span>
              {t(
                '27 నక్షత్రాల పాదాల వారీగా తెలుగు పిల్లల పేర్లు (Nakshatra Baby Names)',
                '27 Nakshatra Telugu Baby Names with Starting Syllables & Meanings'
              )}
            </span>
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {t(
              'శిశువు జన్మ నక్షత్రం మరియు పాద అక్షరాల ఆధారంగా శాస్త్రోక్తమైన మగ మరియు ఆడ పిల్లల పేర్లు, వాటి అర్థాలు.',
              'Find auspicious Vedic boy and girl names aligned with birth Nakshatra syllables (Nama Nakshatra Aksharas).'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="baby-nakshatra-filter" className="block text-xs font-bold text-amber-950 mb-1">
              {t('జన్మ నక్షత్రం ఎంచుకోండి:', 'Filter by Nakshatra:')}
            </label>
            <select
              id="baby-nakshatra-filter"
              value={selectedNakshatra}
              onChange={(e) => setSelectedNakshatra(Number(e.target.value))}
              className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-600 focus:outline-none"
            >
              <option value={0}>{t('మొత్తం 27 నక్షత్రాలు (All 27 Stars)', 'All 27 Nakshatras')}</option>
              {NAKSHATRA_BABY_NAMES_DB.map((item) => (
                <option key={item.nakshatraIndex} value={item.nakshatraIndex}>
                  {item.nakshatraIndex}. {item.nakshatraTe} ({item.nakshatraEn}) — {item.syllables.join(', ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="baby-search-input" className="block text-xs font-bold text-amber-950 mb-1">
              {t('మొదటి అక్షరం లేదా పేరుతో వెతకండి:', 'Search by Syllable or Name:')}
            </label>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                id="baby-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ఉదా: చూ, చే, ఆ, కార్తికేయ, లాస్య...', 'e.g. Chu, Che, Aditya, Lasya...')}
                className="w-full rounded-xl border border-amber-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold text-amber-950 mb-1">
              {t('లింగం ఎంపిక (Gender):', 'Gender Filter:')}
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-amber-100/80 rounded-xl border border-amber-200">
              <button
                type="button"
                onClick={() => setGenderFilter('all')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  genderFilter === 'all' ? 'bg-amber-900 text-white' : 'text-amber-950'
                }`}
              >
                {t('అన్నీ (All)', 'All')}
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter('boy')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  genderFilter === 'boy' ? 'bg-amber-900 text-white' : 'text-amber-950'
                }`}
              >
                {t('మగ (Boys)', 'Boys')}
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter('girl')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  genderFilter === 'girl' ? 'bg-amber-900 text-white' : 'text-amber-950'
                }`}
              >
                {t('ఆడ (Girls)', 'Girls')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredList.map((entry) => (
          <div
            key={entry.nakshatraIndex}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3 border-b border-amber-100 pb-3">
              <div>
                <span className="text-xs font-mono tabular-nums text-amber-800 font-bold">
                  #{String(entry.nakshatraIndex).padStart(2, '0')} · {entry.rashiTe}
                </span>
                <h4 className="text-xl font-bold text-amber-950 flex items-center gap-1.5">
                  <Star size={16} className="text-amber-600" />
                  <span>
                    {entry.nakshatraTe} ({entry.nakshatraEn})
                  </span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">{t('4 పాదాల అక్షరాలు:', '4 Pada Syllables:')}</span>
                <span className="text-xs sm:text-sm font-bold text-amber-900">
                  {entry.syllables.join(' · ')}
                </span>
              </div>
            </div>

            {(genderFilter === 'all' || genderFilter === 'boy') && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-2">
                  {t('మగ పిల్లల పేర్లు (Auspicious Boy Names):', 'Auspicious Boy Names:')}
                </h5>
                <div className="space-y-2">
                  {entry.boyNames.map((b) => (
                    <div key={b.nameEn} className="bg-sky-50/50 border border-sky-200/70 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <strong className="text-sm font-bold text-slate-900">{b.nameTe}</strong>
                      <span className="text-xs text-slate-600">{b.meaningTe}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(genderFilter === 'all' || genderFilter === 'girl') && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2">
                  {t('ఆడ పిల్లల పేర్లు (Auspicious Girl Names):', 'Auspicious Girl Names:')}
                </h5>
                <div className="space-y-2">
                  {entry.girlNames.map((g) => (
                    <div key={g.nameEn} className="bg-rose-50/50 border border-rose-200/70 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <strong className="text-sm font-bold text-slate-900">{g.nameTe}</strong>
                      <span className="text-xs text-slate-600">{g.meaningTe}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
