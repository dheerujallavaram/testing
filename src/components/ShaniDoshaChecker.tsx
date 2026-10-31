import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  MessageCircle,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RashiGlyph } from './RashiGlyph';

export interface RashiShaniTransitInfo {
  id: string;
  nameTe: string;
  nameEn: string;
  nakshatrasTe: string;
  shaniHouseFromMoon: number;
  statusType: 'sade-sati' | 'ashtama-ardhashtama' | 'kantaka' | 'rajayoga' | 'favorable';
  badgeTe: string;
  badgeEn: string;
  phaseDetailTe: string;
  phaseDetailEn: string;
  impactTe: string;
  impactEn: string;
  guruRahuNoteTe: string;
  guruRahuNoteEn: string;
  mantraTe: string;
  remedyTe: string;
  remedyEn: string;
}

export const RASHI_SHANI_TRANSIT_DB: RashiShaniTransitInfo[] = [
  {
    id: 'mesham',
    nameTe: 'మేష రాశి',
    nameEn: 'Aries (Mesham)',
    nakshatrasTe: 'అశ్విని (4 పాదాలు), భరణి (4 పాదాలు), కృత్తిక (1వ పాదం)',
    shaniHouseFromMoon: 12,
    statusType: 'sade-sati',
    badgeTe: '⚠️ ఏలినాటి శని — 1వ దశ (ప్రారంభం)',
    badgeEn: 'Sade Sati Phase 1 (12th House)',
    phaseDetailTe: 'వ్యయ స్థాన శని సంచారం (మొదటి 2.5 సంవత్సరాల దశ)',
    phaseDetailEn: 'Saturn in 12th House from Moon (Rising Phase of Sade Sati)',
    impactTe:
      'జన్మ రాశికి 12వ స్థానమైన మీన రాశిలో శని సంచారం వల్ల ఏలినాటి శని మొదటి దశ నడుస్తోంది. అనవసర ఖర్చులు, దూర ప్రయాణాలు, నిద్రలేమి ఉండే అవకాశం ఉంది. అయితే విదేశీ ప్రయత్నాలు, ఆధ్యాత్మిక కార్యక్రమాలకు ఇది అనుకూల సమయం.',
    impactEn:
      'Saturn transiting the 12th house initiates Phase 1 of Sade Sati. Watch out for unplanned expenses and sleep disturbances; favorable for overseas and spiritual pursuits.',
    guruRahuNoteTe:
      'లాభ స్థానంలో (11వ ఇంట) రాహువు మరియు శుభ గురు దృష్టి వల్ల ఆర్థికంగా పెద్ద లోటు రాకుండా రక్షణ ఉంటుంది.',
    guruRahuNoteEn:
      'Rahu in the 11th house and Jupiter’s benefic aspect protect income flow and career stability.',
    mantraTe: '“ఓం శం శనైశ్చరాయ నమః” (రోజుకు 27 సార్లు) & హనుమాన్ చాలీసా పారాయణ',
    remedyTe:
      'ప్రతి శనివారం శని తైలాభిషేకం, నల్ల నువ్వుల దీపం వెలిగించడం, ఆంజనేయ స్వామికి ఆకుపూజ మరియు ఏలినాటి శని శాంతి జపం చేయించాలి.',
    remedyEn:
      'Perform Shani Tailabhishekam on Saturdays, light a sesame oil lamp, and worship Lord Hanuman.',
  },
  {
    id: 'vrushabham',
    nameTe: 'వృషభ రాశి',
    nameEn: 'Taurus (Vrushabham)',
    nakshatrasTe: 'కృత్తిక (2,3,4 పాదాలు), రోహిణి (4 పాదాలు), మృగశిర (1,2 పాదాలు)',
    shaniHouseFromMoon: 11,
    statusType: 'rajayoga',
    badgeTe: '✅ ఏలినాటి శని లేదు — లాభ శని రాజయోగం!',
    badgeEn: 'No Shani Dosha — 11th House Labha Shani Yoga!',
    phaseDetailTe: '11వ స్థాన (లాభ స్థాన) శని సంచారం — అత్యంత శుభప్రదం',
    phaseDetailEn: 'Saturn in 11th House of Gains — Supreme Financial & Career Yoga',
    impactTe:
      'మీ రాశికి ఏలినాటి శని గానీ, అష్టమ శని గానీ లేవు! పైగా 11వ స్థానమైన లాభ స్థానంలో శని భగవానుడు సంచరించడం వల్ల అఖండ ధనలాభం, ఉద్యోగంలో ప్రమోషన్, భూ-గృహ లాభాలు మరియు గత కష్టాల నుండి సంపూర్ణ విముక్తి కలుగుతుంది.',
    impactEn:
      'Zero Shani Dosha! Saturn in the 11th house bestows extraordinary financial gains, property acquisition, and career elevation.',
    guruRahuNoteTe:
      'గురు బలం కూడా అనుకూలంగా ఉన్నందున కుటుంబంలో శుభకార్యాలు, వివాహ ప్రయత్నాలు వెంటనే ఫలిస్తాయి.',
    guruRahuNoteEn:
      'Benefic Jupiter further accelerates auspicious family events and wealth accumulation.',
    mantraTe: '“ఓం శ్రీం హ్రీం శ్రీం కమలే కమలాలయే ప్రసీద ప్రసీద”',
    remedyTe:
      'ఈ రాజయోగ ఫలితాలు సంపూర్ణంగా అందడానికి శుక్రవారం మహాలక్ష్మి పూజ, శనివారం వేంకటేశ్వర స్వామి దర్శనం చేయండి.',
    remedyEn:
      'Worship Goddess Mahalakshmi on Fridays and Lord Venkateswara on Saturdays to maximize blessings.',
  },
  {
    id: 'mithunam',
    nameTe: 'మిథున రాశి',
    nameEn: 'Gemini (Mithunam)',
    nakshatrasTe: 'మృగశిర (3,4 పాదాలు), ఆరుద్ర (4 పాదాలు), పునర్వసు (1,2,3 పాదాలు)',
    shaniHouseFromMoon: 10,
    statusType: 'favorable',
    badgeTe: '✨ ఏలినాటి శని లేదు — కర్మ స్థాన శని',
    badgeEn: 'No Sade Sati — 10th House Career Shani',
    phaseDetailTe: '10వ స్థాన (రాజ్య/ఉద్యోగ స్థాన) శని సంచారం',
    phaseDetailEn: 'Saturn in 10th House of Profession & Karma',
    impactTe:
      'మీ రాశికి ఏలినాటి శని లేదు. 10వ స్థానంలో శని సంచారం వల్ల ఉద్యోగ, వ్యాపారాలలో పనిభారం పెరిగినా, కష్టానికి తగిన ఉన్నత పదవి మరియు గుర్తింపు లభిస్తాయి.',
    impactEn:
      'No Sade Sati. Saturn in the 10th house increases professional responsibilities while rewarding diligence with lasting authority.',
    guruRahuNoteTe:
      'భాగ్య స్థాన రాహువు & గురు సంచారం వల్ల విదేశీ యోగం, నూతన వ్యాపార ఒప్పందాలు కలిసివస్తాయి.',
    guruRahuNoteEn:
      'Jupiter and Rahu support higher education, spiritual pilgrimages, and new ventures.',
    mantraTe: '“ఓం నమో భగవతే వాసుదేవాయ” & విష్ణు సహస్రనామ పారాయణ',
    remedyTe:
      'బుధవారం శ్రీ మహావిష్ణువు ఆరాధన, శనివారం పేదలకు అన్నదానం చేయడం వల్ల వృత్తిలో ఆటంకాలు తొలగుతాయి.',
    remedyEn:
      'Recite Sri Vishnu Sahasranama on Wednesdays and offer Annadanam on Saturdays.',
  },
  {
    id: 'karkatakam',
    nameTe: 'కర్కాటక రాశి',
    nameEn: 'Cancer (Karkatakam)',
    nakshatrasTe: 'పునర్వసు (4వ పాదం), పుష్యమి (4 పాదాలు), ఆశ్లేష (4 పాదాలు)',
    shaniHouseFromMoon: 9,
    statusType: 'favorable',
    badgeTe: '🎉 అష్టమ శని తొలగిపోయింది — భాగ్య శని!',
    badgeEn: 'Ashtama Shani Ended — 9th House Bhagya Shani!',
    phaseDetailTe: '9వ స్థాన (భాగ్య స్థాన) శని సంచారం — అష్టమ శని నుండి విముక్తి',
    phaseDetailEn: 'Saturn in 9th House — Complete Relief from Ashtama Shani',
    impactTe:
      'గత 2.5 ఏళ్లుగా మిమ్మల్ని ఇబ్బంది పెట్టిన అష్టమ శని పూర్తిగా తొలగిపోయింది! ఇప్పుడు 9వ స్థానంలో శని సంచారం వల్ల నిలిచిపోయిన పనులు పూర్తవుతాయి, మానసిక ప్రశాంతత మరియు ఆర్థిక అభివృద్ధి కలుగుతాయి.',
    impactEn:
      'Complete relief from 8th-house Ashtama Shani! Saturn in the 9th house restores peace of mind, luck, and stalled finances.',
    guruRahuNoteTe:
      'అష్టమ రాహువు ఉన్నందున ఆరోగ్యం & వాహన ప్రయాణాలలో మాత్రం కొద్దిపాటి జాగ్రత్త అవసరం.',
    guruRahuNoteEn:
      'With Rahu in the 8th house, perform Durga/Shiva archana for smooth health and travel.',
    mantraTe: '“ఓం నమః శివాయ” & రుద్ర కవచ పారాయణ',
    remedyTe:
      'సోమవారం శివాభిషేకం, దుర్గాదేవి ఆరాధన మరియు రాహు-కేతు శాంతి పూజ జరిపించడం అత్యంత శుభప్రదం.',
    remedyEn:
      'Perform Rudrabhishekam on Mondays and Rahu-Ketu Shanti Archana.',
  },
  {
    id: 'simham',
    nameTe: 'సింహ రాశి',
    nameEn: 'Leo (Simham)',
    nakshatrasTe: 'మఖ (4 పాదాలు), పుబ్బ (4 పాదాలు), ఉత్తర (1వ పాదం)',
    shaniHouseFromMoon: 8,
    statusType: 'ashtama-ardhashtama',
    badgeTe: '⚠️ అష్టమ శని నడుస్తోంది (8వ స్థానం)',
    badgeEn: 'Ashtama Shani Active (8th House Transit)',
    phaseDetailTe: 'అష్టమ స్థాన శని సంచారం — శాంతి పరిహారాలు తప్పనిసరి',
    phaseDetailEn: 'Saturn in 8th House from Moon (Ashtama Shani Period)',
    impactTe:
      'మీ రాశికి 8వ స్థానంలో శని సంచారం వల్ల "అష్టమ శని" నడుస్తోంది. పనులలో జాప్యం, ఆకస్మిక ఖర్చులు, ఆరోగ్య విషయంలో శ్రద్ధ అవసరం. కొత్త పెట్టుబడులు, హామీ సంతకాల విషయంలో తొందరపాటు వద్దు.',
    impactEn:
      'Ashtama Shani (8th house Saturn) is active. Avoid impulsive investments, take care of health, and practice patience in career matters.',
    guruRahuNoteTe:
      'జన్మ కేతువు & సప్తమ రాహువు ఉన్నందున భార్యాభర్తల మధ్య, భాగస్వామ్య వ్యాపారాలలో సంయమనం పాటించాలి.',
    guruRahuNoteEn:
      'With Ketu in 1st and Rahu in 7th, maintain harmony in marital and business partnerships.',
    mantraTe: '“నీలాంజన సమాభాసం రవిపుత్రం యమాగ్రజమ్...” శని స్తోత్రం & ఆదిత్య హృదయం',
    remedyTe:
      'అష్టమ శని దోష నివారణకు శని గ్రహ శాంతి హోమం / తైలాభిషేకం, ప్రతి ఆదివారం సూర్య ఆరాధన, శనివారం ఆంజనేయ స్వామి దర్శనం తప్పక చేయాలి.',
    remedyEn:
      'Perform Ashtama Shani Shanti Homam / Tailabhishekam, recite Aditya Hrudayam, and worship Lord Hanuman.',
  },
  {
    id: 'kanya',
    nameTe: 'కన్యా రాశి',
    nameEn: 'Virgo (Kanya)',
    nakshatrasTe: 'ఉత్తర (2,3,4 పాదాలు), హస్త (4 పాదాలు), చిత్త (1,2 పాదాలు)',
    shaniHouseFromMoon: 7,
    statusType: 'kantaka',
    badgeTe: '⚖️ కంటక శని (7వ స్థానం) — మిశ్రమ ఫలం',
    badgeEn: 'Kantaka Shani (7th House) — Moderate Care',
    phaseDetailTe: 'సప్తమ స్థాన శని సంచారం (కంటక శని)',
    phaseDetailEn: 'Saturn in 7th House from Moon (Partnerships & Spouse)',
    impactTe:
      'మీ రాశికి ఏలినాటి శని లేదు, కానీ 7వ స్థానంలో శని సంచారం (కంటక శని) వల్ల వివాహ సంబంధాలలో, భాగస్వామ్య వ్యాపారాలలో నిదానంగా నిర్ణయాలు తీసుకోవాలి. కష్టపడితే స్థిరమైన విజయం లభిస్తుంది.',
    impactEn:
      'No Sade Sati, but Saturn in the 7th house advises patience in marital discussions and business partnerships.',
    guruRahuNoteTe:
      '6వ ఇంట రాహువు వల్ల శత్రు జయం, కోర్టు వ్యవహారాలలో విజయం మరియు రుణ విముక్తి కలుగుతాయి!',
    guruRahuNoteEn:
      'Rahu in the 6th house grants strong victory over competitors and debt clearance.',
    mantraTe: '“ఓం నమో నారాయణాయ” & సుదర్శన అష్టకం',
    remedyTe:
      'శనివారం వేంకటేశ్వర స్వామికి తులసి మాల సమర్పణ, నువ్వుల నూనెతో దీపారాధన చేయడం శుభకరం.',
    remedyEn:
      'Offer Tulasi garland to Lord Venkateswara and light a sesame lamp on Saturdays.',
  },
  {
    id: 'tula',
    nameTe: 'తులా రాశి',
    nameEn: 'Libra (Tula)',
    nakshatrasTe: 'చిత్త (3,4 పాదాలు), స్వాతి (4 పాదాలు), విశాఖ (1,2,3 పాదాలు)',
    shaniHouseFromMoon: 6,
    statusType: 'rajayoga',
    badgeTe: '✅ శని దోషం లేదు — 6వ ఇంట శని విజయ యోగం!',
    badgeEn: 'No Shani Dosha — 6th House Shatru-Jaya Yoga!',
    phaseDetailTe: '6వ స్థాన (రోగ/శత్రు జయ స్థాన) శని సంచారం — రాజయోగం',
    phaseDetailEn: 'Saturn in 6th House — Victory Over Obstacles & Debts',
    impactTe:
      'తులా రాశి వారికి శని యోగకారకుడు! పైగా 6వ స్థానంలో శని సంచారం వల్ల శత్రువులపై విజయం, పాత అప్పుల నుండి విముక్తి, దీర్ఘకాలిక రోగాల నివారణ మరియు పోటీ పరీక్షలలో, ఉద్యోగంలో అఖండ విజయం లభిస్తుంది.',
    impactEn:
      'Saturn in the 6th house is a classic Rajayoga position! Expect debt clearance, victory in competitive exams/litigation, and career growth.',
    guruRahuNoteTe:
      'భాగ్య గురు బలం తోడవడంతో ఆర్థికంగా మరియు సామాజికంగా ఉన్నత స్థాయికి చేరుకుంటారు.',
    guruRahuNoteEn:
      'Benefic Jupiter in the 9th house brings fortune, promotions, and divine grace.',
    mantraTe: '“ఓం శ్రీ మహాలక్ష్మ్యై నమః” & కనకధారా స్తోత్రం',
    remedyTe:
      'శుక్రవారం లక్ష్మీ ఆరాధన, శనివారం నవగ్రహ ప్రదక్షిణ చేయడం వల్ల ఈ రాజయోగం రెట్టింపు ఫలితాన్నిస్తుంది.',
    remedyEn:
      'Recite Kanakadhara Stotram on Fridays and perform Navagraha Pradakshina on Saturdays.',
  },
  {
    id: 'vruschikam',
    nameTe: 'వృశ్చిక రాశి',
    nameEn: 'Scorpio (Vruschikam)',
    nakshatrasTe: 'విశాఖ (4వ పాదం), అనురాధ (4 పాదాలు), జ్యేష్ఠ (4 పాదాలు)',
    shaniHouseFromMoon: 5,
    statusType: 'favorable',
    badgeTe: '🎉 అర్ధాష్టమ శని తొలగింది — పంచమ శని!',
    badgeEn: 'Ardhashtama Shani Ended — 5th House Transit',
    phaseDetailTe: '5వ స్థాన (పంచమ స్థాన) శని సంచారం — అర్ధాష్టమ శని నుండి విముక్తి',
    phaseDetailEn: 'Saturn in 5th House — Relief from 4th-House Ardhashtama Shani',
    impactTe:
      'గత 2.5 ఏళ్లుగా ఉన్న అర్ధాష్టమ శని పూర్తిగా తొలగిపోయింది! గృహ, వాహన సౌఖ్యం తిరిగి లభిస్తుంది. 5వ ఇంట శని వల్ల సంతానం విషయంలో మరియు షేర్ మార్కెట్ పెట్టుబడులలో ఆలోచించి అడుగు వేయాలి.',
    impactEn:
      'Relief from Ardhashtama Shani restores domestic peace. Plan investments and children’s education thoughtfully.',
    guruRahuNoteTe:
      '4వ ఇంట రాహువు ఉన్నందున గృహ నిర్మాణ పనులలో వాస్తు నియమాలు ఖచ్చితంగా పాటించాలి.',
    guruRahuNoteEn:
      'Follow Vastu principles carefully during home renovations while Rahu transits the 4th house.',
    mantraTe: '“ఓం శరవణభవాయ నమః” & సుబ్రహ్మణ్య భుజంగ స్తోత్రం',
    remedyTe:
      'మంగళవారం సుబ్రహ్మణ్య స్వామి ఆరాధన, శనివారం ఆంజనేయ స్వామికి తమలపాకుల పూజ చేయించండి.',
    remedyEn:
      'Worship Lord Subrahmanya on Tuesdays and offer betel leaf archana to Hanuman on Saturdays.',
  },
  {
    id: 'dhanussu',
    nameTe: 'ధనుస్సు రాశి',
    nameEn: 'Sagittarius (Dhanussu)',
    nakshatrasTe: 'మూల (4 పాదాలు), పూర్వాషాఢ (4 పాదాలు), ఉత్తరాషాఢ (1వ పాదం)',
    shaniHouseFromMoon: 4,
    statusType: 'ashtama-ardhashtama',
    badgeTe: '⚠️ అర్ధాష్టమ శని నడుస్తోంది (4వ స్థానం)',
    badgeEn: 'Ardhashtama Shani Active (4th House Transit)',
    phaseDetailTe: 'చతుర్థ స్థాన శని సంచారం (అర్ధాష్టమ శని — 2.5 సంవత్సరాలు)',
    phaseDetailEn: 'Saturn in 4th House from Moon (Domestic & Work Pressure)',
    impactTe:
      'మీ రాశికి 4వ స్థానంలో శని సంచారం వల్ల "అర్ధాష్టమ శని" నడుస్తోంది. పని ఒత్తిడి, తల్లిగారి ఆరోగ్యం, గృహ/వాహన మరమ్మత్తుల ఖర్చులు ఉండే అవకాశం ఉంది. అయితే సప్తమ గురు దృష్టి వల్ల ఆర్థికంగా మరియు వివాహ పరంగా శుభ ఫలితాలే ఉంటాయి.',
    impactEn:
      'Ardhashtama Shani (4th house Saturn) brings work pressure and home maintenance expenses, while Jupiter’s 7th-house aspect strongly protects income and family.',
    guruRahuNoteTe:
      '3వ ఇంట రాహువు వల్ల ధైర్య సాహసాలు, సోదరుల సహకారం మరియు ఆదాయ వృద్ధి బాగుంటాయి.',
    guruRahuNoteEn:
      'Rahu in the 3rd house gives strong courage, initiative, and financial resilience.',
    mantraTe: '“ఓం శ్రీ గురుభ్యో నమః” & దశరథ కృత శని స్తోత్రం',
    remedyTe:
      'అర్ధాష్టమ శని నివారణకు శనివారం తిల తైలాభిషేకం, గురువారం దత్తాత్రేయ / దక్షిణామూర్తి ఆరాధన చేయించాలి.',
    remedyEn:
      'Perform Shani Tailabhishekam on Saturdays and worship Lord Dakshinamurthy on Thursdays.',
  },
  {
    id: 'makaram',
    nameTe: 'మకర రాశి',
    nameEn: 'Capricorn (Makaram)',
    nakshatrasTe: 'ఉత్తరాషాఢ (2,3,4 పాదాలు), శ్రవణం (4 పాదాలు), ధనిష్ఠ (1,2 పాదాలు)',
    shaniHouseFromMoon: 3,
    statusType: 'rajayoga',
    badgeTe: '✅ ఏలినాటి శని పూర్తిగా తొలగిపోయింది — రాజయోగం!',
    badgeEn: 'Sade Sati Completely Ended — 3rd House Rajayoga!',
    phaseDetailTe: '3వ స్థాన (पराक्रम స్థాన) శని సంచారం — 7.5 ఏళ్ల ఏలినాటి శని నుండి విముక్తి',
    phaseDetailEn: 'Saturn in 3rd House — Complete Liberation from 7.5-Year Sade Sati!',
    impactTe:
      'మకర రాశి వారికి శుభవార్త! గత 7.5 సంవత్సరాలుగా నడిచిన ఏలినాటి శని పూర్తిగా ముగిసిపోయింది. ఇప్పుడు 3వ స్థానంలో శని సంచారం వల్ల పట్టిందల్లా బంగారం అవుతుంది. నూతన ఉద్యోగం, ధనలాభం, గృహ యోగం, సంపూర్ణ మనశ్శాంతి లభిస్తాయి.',
    impactEn:
      'Great news for Capricorn! Your 7.5-year Sade Sati is completely over. Saturn in the 3rd house brings monumental success, wealth, and peace.',
    guruRahuNoteTe:
      '2వ ఇంట రాహువు ఉన్నందున మాట విషయంలో మాత్రమే సున్నితంగా ఉండాలి; ఆర్థిక ప్రవాహం అద్భుతంగా ఉంటుంది.',
    guruRahuNoteEn:
      'Keep speech gentle while Rahu transits the 2nd house; financial growth is highly favored.',
    mantraTe: '“ఓం నమో వేంకటేశాయ” & ఆంజనేయ దండకం',
    remedyTe:
      'శని భగవానుని కృతజ్ఞతా పూర్వకంగా శనివారం ఆలయ దర్శనం, పేదలకు అన్నదానం చేయండి.',
    remedyEn:
      'Offer gratitude prayers to Lord Venkateswara and Hanuman on Saturdays.',
  },
  {
    id: 'kumbham',
    nameTe: 'కుంభ రాశి',
    nameEn: 'Aquarius (Kumbham)',
    nakshatrasTe: 'ధనిష్ఠ (3,4 పాదాలు), శతభిషం (4 పాదాలు), పూర్వాభాద్ర (1,2,3 పాదాలు)',
    shaniHouseFromMoon: 2,
    statusType: 'sade-sati',
    badgeTe: '⚠️ ఏలినాటి శని — 3వ (చివరి) దశ',
    badgeEn: 'Sade Sati Phase 3 (Final 2.5 Years)',
    phaseDetailTe: 'కుటుంబ/ధన స్థాన శని సంచారం (విడుదల దశ — తీవ్రత తగ్గుతుంది)',
    phaseDetailEn: 'Saturn in 2nd House from Moon (Setting Phase of Sade Sati)',
    impactTe:
      'జన్మ శని (2వ దశ) పూర్తి అయి, ఇప్పుడు ఏలినాటి శని చివరి (3వ) దశలోకి ప్రవేశించారు. గత రెండేళ్ల కంటే ఇప్పుడు మానసిక ఒత్తిడి బాగా తగ్గుతుంది. శని మీ రాశ్యాధిపతి కాబట్టి ఆర్థిక స్థిరత్వం ఇస్తాడు, కానీ మాట తొందరపాటు మరియు కుటుంబ వాదనలు నివారించాలి.',
    impactEn:
      'You have exited peak Janma Shani and entered the final setting phase of Sade Sati. Pressure eases significantly; practice polite speech and financial discipline.',
    guruRahuNoteTe:
      'జన్మ రాహువు ఉన్నందున పంచమ గురు దృష్టి సహాయంతో ధ్యానం, రుద్రాభిషేకం చేయడం వల్ల మంచి ఆలోచనలు కలుగుతాయి.',
    guruRahuNoteEn:
      'Benefic 5th-house Jupiter aspect balances Janma Rahu, bringing clarity and children’s progress.',
    mantraTe: '“ఓం శం శనైశ్చరాయ నమః” & మహా మృత్యుంజయ మంత్రం',
    remedyTe:
      'శనివారం నవగ్రహ ఆలయంలో నువ్వుల దీపం, శివాభిషేకం మరియు రాహు-శని శాంతి జపం చేయించడం శ్రేష్ఠం.',
    remedyEn:
      'Light a sesame oil lamp on Saturdays and perform Rudrabhishekam for Rahu-Shani peace.',
  },
  {
    id: 'meenam',
    nameTe: 'మీన రాశి',
    nameEn: 'Pisces (Meenam)',
    nakshatrasTe: 'పూర్వాభాద్ర (4వ పాదం), ఉత్తరాభాద్ర (4 పాదాలు), రేవతి (4 పాదాలు)',
    shaniHouseFromMoon: 1,
    statusType: 'sade-sati',
    badgeTe: '⚠️ ఏలినాటి శని — 2వ దశ (జన్మ శని)',
    badgeEn: 'Sade Sati Phase 2 (Peak Janma Shani)',
    phaseDetailTe: 'జన్మ రాశిలో శని సంచారం (మధ్య దశ — 2.5 సంవత్సరాలు)',
    phaseDetailEn: 'Saturn in 1st House / Moon Sign (Peak Phase of Sade Sati)',
    impactTe:
      'మీ జన్మ రాశిలోనే శని సంచారం వల్ల ఏలినాటి శని రెండవ దశ (జన్మ శని) నడుస్తోంది. పనిభారం, ఆలస్యాలు, ఆరోగ్యం పట్ల శ్రద్ధ అవసరం. అయితే క్రమశిక్షణతో, ధర్మబద్ధంగా పనిచేసే వారికి శని భగవానుడు శాశ్వతమైన కీర్తిని, ఆర్థిక పునాదిని ఇస్తాడు.',
    impactEn:
      'Peak Janma Shani (Saturn in 1st house) requires patience, health care, and hard work. Saturn rewards dharmic perseverance with lasting achievements.',
    guruRahuNoteTe:
      'రాశ్యాధిపతి గురుడు ఉచ్చ/శుభ స్థానాలలో సంచరిస్తున్నందున ఏలినాటి శని తీవ్రత నుండి గొప్ప దైవ రక్షణ లభిస్తుంది.',
    guruRahuNoteEn:
      'Your ruling planet Jupiter provides strong divine protection against Sade Sati challenges.',
    mantraTe: '“ఓం నమో నారాయణాయ” & దశరథ కృత శని స్తోత్రం',
    remedyTe:
      'జన్మ శని దోష నివారణకు ప్రతి శనివారం తిల హోమం లేదా శని తైలాభిషేకం, ఆంజనేయ స్వామి ఆరాధన మరియు గురువారం శనగల దానం తప్పక చేయాలి.',
    remedyEn:
      'Perform Tila Homam or Shani Tailabhishekam, worship Lord Hanuman on Saturdays, and offer chickpeas on Thursdays.',
  },
];

export const ShaniDoshaChecker: React.FC<{ onOpenBooking?: () => void }> = ({ onOpenBooking }) => {
  const { language, t } = useLanguage();
  const [selectedRashiId, setSelectedRashiId] = useState<string>('mesham');
  const [kujaHouse, setKujaHouse] = useState<number>(7);

  const activeRashi =
    RASHI_SHANI_TRANSIT_DB.find((r) => r.id === selectedRashiId) || RASHI_SHANI_TRANSIT_DB[0];

  const isKujaDoshaHouse = [1, 2, 4, 7, 8, 12].includes(kujaHouse);

  const getBadgeColors = (type: RashiShaniTransitInfo['statusType']) => {
    switch (type) {
      case 'sade-sati':
      case 'ashtama-ardhashtama':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'kantaka':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'rajayoga':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      default:
        return 'bg-sky-100 text-sky-950 border-sky-300';
    }
  };

  return (
    <div id="shani-dosha-checker" className="space-y-8 font-telugu scroll-mt-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#2e1005] to-amber-950 text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-500/60 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
              <ShieldAlert size={15} className="text-amber-400" />
              <span>
                {t(
                  '2026–2027 దృక్సిద్ధాంత శని & నవగ్రహ గోచార పరిశీలన',
                  '2026–2027 Drik Siddhanta Shani & Dosha Calculator'
                )}
              </span>
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white">
              {t(
                'ఏలినాటి శని, అష్టమ శని & కుజ దోష చెకర్ (Shani & Dosha Checker)',
                'Elinati Shani (Sade Sati), Ashtama Shani & Kuja Dosha Checker'
              )}
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-3xl leading-relaxed">
              {t(
                'మీ జన్మ రాశిని ఎంచుకొని ప్రస్తుతం మీకు ఏలినాటి శని, అర్ధాష్టమ శని లేదా అష్టమ శని ఉందో లేదో, గురు-రాహు బలం ఎలా ఉందో మరియు దానికి చేయవలసిన శాస్త్రోక్త పరిహారాలను వెంటనే తెలుసుకోండి.',
                'Select your Moon Sign (Rashi) below to instantly check if you are under Sade Sati (Elinati Shani), Ashtama Shani, or Rajayoga Shani, along with authentic Vedic remedies.'
              )}
            </p>
          </div>

          <div className="bg-amber-900/70 border border-amber-400/50 rounded-2xl px-4 py-3 text-xs text-amber-100 shrink-0">
            <span className="font-bold text-amber-300 block">
              🪐 {t('ప్రస్తుత శని సంచారం:', 'Current Saturn Transit:')}
            </span>
            <span className="text-sm font-extrabold text-white block mt-0.5">
              {t('మీన రాశి (Pisces)', 'Meena Rashi (Pisces)')}
            </span>
            <span className="text-[11px] text-amber-200/90 block mt-0.5">
              {t('ఏలినాటి శని: కుంభం, మీనం, మేషం', 'Sade Sati: Aquarius, Pisces, Aries')}
            </span>
          </div>
        </div>
      </div>

      {/* 12 Rashi Selector Grid */}
      <div className="space-y-3">
        <label className="block text-xs sm:text-sm font-bold text-amber-950">
          👇 {t('మీ జన్మ రాశిని నొక్కండి (Select Your Rashi):', 'Click Your Moon Sign (Rashi):')}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {RASHI_SHANI_TRANSIT_DB.map((item) => {
            const isSelected = item.id === selectedRashiId;
            const hasDosha =
              item.statusType === 'sade-sati' || item.statusType === 'ashtama-ardhashtama';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedRashiId(item.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-900 text-white border-amber-950 ring-2 ring-amber-400 shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-amber-50/80 text-slate-900 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    <RashiGlyph rashi={item.id} size={15} />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950'
                        : hasDosha
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.shaniHouseFromMoon}వ స్థానం
                  </span>
                </div>
                <div className="mt-2">
                  <strong className="text-xs sm:text-sm font-bold block leading-tight">
                    {language === 'te' ? item.nameTe : item.nameEn.split(' ')[0]}
                  </strong>
                  <span
                    className={`text-[10px] block mt-0.5 truncate ${
                      isSelected ? 'text-amber-200' : 'text-slate-500'
                    }`}
                  >
                    {hasDosha
                      ? t('శని పరిహారం అవసరం', 'Remedy Advised')
                      : t('శుభ గోచారం', 'Favorable')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Rashi Detailed Shani & Gochara Report Card */}
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900">
                <RashiGlyph rashi={activeRashi.id} size={22} />
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-amber-950">
                  {language === 'te' ? activeRashi.nameTe : activeRashi.nameEn}
                </h4>
                <p className="text-xs text-slate-600">
                  <strong className="text-amber-900">{t('జన్మ నక్షత్రాలు:', 'Birth Stars:')}</strong>{' '}
                  {activeRashi.nakshatrasTe}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`px-4 py-2.5 rounded-2xl border-2 font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 self-start lg:self-center ${getBadgeColors(
              activeRashi.statusType
            )}`}
          >
            <span>{language === 'te' ? activeRashi.badgeTe : activeRashi.badgeEn}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Shani Impact Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
              🪐 {language === 'te' ? activeRashi.phaseDetailTe : activeRashi.phaseDetailEn}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {language === 'te' ? activeRashi.impactTe : activeRashi.impactEn}
            </p>
          </div>

          {/* Guru & Rahu-Ketu Protection Note */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
              <Sparkles size={15} className="text-sky-700" />
              <span>
                {t(
                  'గురు బలం & రాహు-కేతు గోచార సమన్వయం:',
                  'Jupiter & Rahu-Ketu Transit Balance:'
                )}
              </span>
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {language === 'te' ? activeRashi.guruRahuNoteTe : activeRashi.guruRahuNoteEn}
            </p>
            <div className="pt-2 border-t border-sky-200/80 text-xs text-sky-950">
              <strong>🕉️ {t('జపించవలసిన మంత్రం:', 'Recommended Mantra:')}</strong>{' '}
              <span>{activeRashi.mantraTe}</span>
            </div>
          </div>
        </div>

        {/* Vedic Remedy & Direct WhatsApp CTA */}
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Flame size={16} className="text-emerald-700" />
              <span>
                {t(
                  'బ్రహ్మశ్రీ ధీరజ్ శర్మ సిద్ధాంతి గారి శాస్త్రోక్త పరిహార సూచన:',
                  'Vedic Shanti Remedy by Brahmasri Dheeraj Sharma Siddhanthi:'
                )}
              </span>
            </span>
            <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-relaxed">
              {language === 'te' ? activeRashi.remedyTe : activeRashi.remedyEn}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={`https://wa.me/918977986166?text=${encodeURIComponent(
                `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ సిద్ధాంతి గారు, నాది "${activeRashi.nameTe}" (${activeRashi.badgeTe}). నా జాతకంలో శని/గ్రహ దోష పరిశీలన మరియు శాంతి పరిహార పూజ కోసం సంప్రదిస్తున్నాను.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-sm inline-flex items-center gap-2 transition-transform hover:scale-102"
            >
              <MessageCircle size={16} />
              <span>
                {t('శని శాంతి / జాతక పరిశీలన (WhatsApp)', 'Consult Guruji on WhatsApp')}
              </span>
            </a>

            {onOpenBooking && (
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-4 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('నవగ్రహ శాంతి హోమం బుకింగ్', 'Book Navagraha Homam')}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Interactive Kuja Dosha (Manglik) House Checker */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-amber-950 flex items-center gap-2">
              <Star size={18} className="text-amber-700" />
              <span>
                {t(
                  'తక్షణ కుజ దోష (Manglik Dosha) స్థాన చెకర్',
                  'Instant Kuja Dosha (Manglik) House Checker'
                )}
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {t(
                'మీ జన్మ లగ్నం లేదా చంద్ర రాశి నుండి కుజుడు (Mars) ఎన్నవ స్థానంలో ఉన్నాడో ఎంచుకోండి:',
                'Select which house Mars (Kuja) occupies from your Lagna or Moon sign:'
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setKujaHouse(h)}
                className={`w-9 h-9 rounded-xl font-bold text-xs cursor-pointer border transition-colors ${
                  kujaHouse === h
                    ? 'bg-amber-900 text-white border-amber-950 shadow-xs'
                    : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-100'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isKujaDoshaHouse
              ? 'bg-rose-50/90 border-rose-300 text-rose-950'
              : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              {isKujaDoshaHouse ? (
                <AlertTriangle size={17} className="text-rose-700 shrink-0" />
              ) : (
                <CheckCircle2 size={17} className="text-emerald-700 shrink-0" />
              )}
              <span>
                {isKujaDoshaHouse
                  ? t(
                      `${kujaHouse}వ స్థానంలో కుజుడు: కుజ దోష స్థానం (గురు దృష్టి / స్వక్షేత్ర మినహాయింపులు పరిశీలించాలి)`,
                      `Mars in ${kujaHouse}th House: Kuja Dosha Indicated (Check Jupiter aspect exceptions)`
                    )
                  : t(
                      `${kujaHouse}వ స్థానంలో కుజుడు: కుజ దోషం లేదు! (సంపూర్ణ శుభ స్థానం)`,
                      `Mars in ${kujaHouse}th House: No Kuja Dosha! (Auspicious Placement)`
                    )}
              </span>
            </div>
            <p className="text-xs text-slate-700">
              {isKujaDoshaHouse
                ? t(
                    'గమనిక: మేష, వృశ్చిక, మకర, కర్కాటక రాశులలో ఉన్నా లేదా గురు/బుధ దృష్టి ఉన్నా కుజ దోష భంగం (పరిహారం) జరుగుతుంది. సుబ్రహ్మణ్య ఆరాధన శ్రేష్ఠం.',
                    'Note: Kuja Dosha is cancelled if Mars is in Aries, Scorpio, Capricorn, Cancer, or aspected by Jupiter.'
                  )
                : t(
                    'లగ్నం నుండి 3, 5, 6, 9, 10, 11 స్థానాలలో కుజుడు ఉండటం వల్ల కుజ దోషం వర్తించదు. వివాహ పొంతనకు అనుకూలం.',
                    'Mars in 3, 5, 6, 9, 10, or 11 does not cause Kuja Dosha and supports strong vitality.'
                  )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
