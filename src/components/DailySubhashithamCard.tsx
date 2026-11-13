import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Image as ImageIcon,
  Film,
  Loader2,
  Hash,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';
import {
  DailyReelResult,
  generateDailySubhashithamReelVideo,
  generateSubhashithamSocialPack,
} from '../utils/dailyPanchangamVideoRecorder';

export interface SubhashithamItem {
  id: number;
  category: 'success' | 'mindset' | 'speech' | 'resilience' | 'dharma';
  themeTe: string;
  themeEn: string;
  slokamTe: string;
  slokamEn: string;
  meaningTe: string;
  meaningEn: string;
  loukikaQuoteTe: string;
  loukikaQuoteEn: string;
}

export const DAILY_SUBHASHITHALU: SubhashithamItem[] = [
  {
    id: 1,
    category: 'success',
    themeTe: 'ఆత్మవిశ్వాసం & కార్యసిద్ధి',
    themeEn: 'Self-Belief & Execution',
    slokamTe: 'క్రియాసిద్ధిః సత్త్వే భవతి మహతాం నోపకరణే',
    slokamEn: 'Kriyāsiddhiḥ sattve bhavati mahatāṃ nopakaraṇe',
    meaningTe:
      'గొప్పవారికి ఏ పనిలోనైనా విజయం వారి సంకల్ప బలం, మనోధైర్యం వల్లే లభిస్తుంది కానీ కేవలం బయటి పరికరాల వల్ల కాదు.',
    meaningEn:
      'True achievement flows from inner resolve and character, not merely from external tools or resources.',
    loukikaQuoteTe:
      '“నా దగ్గర సరైన వనరులు లేవు, సపోర్ట్ లేదు అని ఆగిపోకండి. మీ సంకల్పం బలంగా ఉంటే చిన్న అవకాశంతోనే పెద్ద విజయాన్ని నిర్మించగలరు. పరికరాలు కాదు, మీ పట్టుదలే మీ ఆయుధం!”',
    loukikaQuoteEn:
      '“Stop waiting for perfect resources or validation. When your inner grit is unshakeable, you turn ordinary tools into extraordinary results. Mindset beats equipment every single time.”',
  },
  {
    id: 2,
    category: 'success',
    themeTe: 'సమయ పాలన & ఆర్థిక వృద్ధి',
    themeEn: 'Time & Wealth Mastery',
    slokamTe:
      'క్షణశః కణశశ్చైవ విద్యామర్థం చ సాధయేత్ |\nక్షణత్యాగే కుతో విద్యా కణత్యాగే కుతో ధనమ్ ||',
    slokamEn:
      'Kṣaṇaśaḥ kaṇaśaścaiva vidyāmarthaṃ ca sādhayet |\nKṣaṇatyāge kuto vidyā kaṇatyāge kuto dhanam ||',
    meaningTe:
      'ప్రతి క్షణాన్ని సద్వినియోగం చేసుకుంటూ విద్యను, ప్రతి చిన్న నాణేన్ని జాగ్రత్త చేస్తూ ధనాన్ని సంపాదించాలి. క్షణాలను వృథా చేస్తే విద్య రాదు, చిన్న మొత్తాలను నిర్లక్ష్యం చేస్తే సంపద నిలవదు.',
    meaningEn:
      'Build knowledge moment by moment and wealth coin by coin. Wasting small moments costs wisdom; wasting small savings costs prosperity.',
    loukikaQuoteTe:
      '“ఈరోజుల్లో రీల్స్ చూస్తూ పోగొట్టే 15 నిమిషాలు, ఆన్‌లైన్‌లో అకారణంగా ఖర్చు చేసే చిన్న మొత్తాలే మన భవిష్యత్తును నిర్ణయిస్తాయి. రోజుకు ఒక కొత్త నైపుణ్యం, చిన్న పొదుపు — ఇదే ఈ తరానికి అసలైన సక్సెస్ ఫార్ములా!”',
    loukikaQuoteEn:
      '“Compound interest works on both your habits and your bank balance. Protect your daily 30 minutes of learning and your small consistent investments—they quietly build an unstoppable future.”',
  },
  {
    id: 3,
    category: 'mindset',
    themeTe: 'స్వయంకృషి & మనోబలం',
    themeEn: 'Self-Leadership & Discipline',
    slokamTe:
      'ఉద్ధరేదాత్మనాత్మానం నాత్మానమవసాదయేత్ |\nఆత్మైవ హ్యాత్మనో బంధురాత్మైవ రిపురాత్మనః ||',
    slokamEn:
      'Uddharedātmanātmānaṃ nātmānamavasādayet |\nĀtmaiva hyātmano bandhurātmaiva ripurātmanaḥ ||',
    meaningTe:
      'మనల్ని మనమే ఉద్ధరించుకోవాలి, ఎప్పుడూ కృంగిపోకూడదు. క్రమశిక్షణ ఉంటే మన మనస్సే మనకు ఉత్తమ మిత్రుడు; నియంత్రణ లేకపోతే మన మనస్సే మనకు శత్రువు.',
    meaningEn:
      'Elevate yourself through your own effort and never talk yourself down. A disciplined mind is your greatest ally; an undisciplined mind is your own obstacle.',
    loukikaQuoteTe:
      '“మిమ్మల్ని ఎవరో వచ్చి మోటివేట్ చేస్తారని ఎదురుచూడకండి. మీ ఆలోచనలను మీరు అదుపులో పెట్టుకుంటే మీకంటే గొప్ప బెస్ట్ ఫ్రెండ్ మరొకరు ఉండరు. నిరాశను వదిలి మీ పట్ల మీరు నమ్మకంగా నిలబడండి!”',
    loukikaQuoteEn:
      '“Nobody is coming to rescue your mindset—and that is your greatest superpower. Train your inner voice to encourage rather than sabotage you; become your own strongest ally.”',
  },
  {
    id: 4,
    category: 'resilience',
    themeTe: 'వర్తమానంపై దృష్టి (No Overthinking)',
    themeEn: 'Present Focus & Mental Clarity',
    slokamTe:
      'గతశోకో న కర్తవ్యో భవిష్యం నైవ చింతయేత్ |\nవర్తమానేషు కార్యేషు వర్తయంతి విచక్షణాః ||',
    slokamEn:
      'Gataśoko na kartavyo bhaviṣyaṃ naiva cintayet |\nVartamāneṣu kāryeṣu vartayanti vicakṣaṇāḥ ||',
    meaningTe:
      'గడిచిపోయిన దాని గురించి విచారించవద్దు, రాబోయే భవిష్యత్తు గురించి అతిగా భయపడవద్దు. విజ్ఞులు ఎప్పుడూ చేతిలో ఉన్న వర్తమాన పనిపైనే పూర్తి శ్రద్ధ పెడతారు.',
    meaningEn:
      'Do not grieve over what has passed or obsess anxiously over the future; the wise pour their full intelligence into the task right in front of them.',
    loukikaQuoteTe:
      '“గతంలో జరిగిన తప్పుల గురించి గిల్ట్, రేపు ఏమవుతుందో అన్న యాంగ్జైటీ — ఈ రెండూ ఈరోజు మీ శక్తిని లాగేస్తాయి. ఓవర్‌థింకింగ్ ఆపి, ఈ రోజు మీ ముందున్న పనిని 100% శ్రద్ధతో పూర్తి చేయండి!”',
    loukikaQuoteEn:
      '“Overthinking yesterday’s mistakes and tomorrow’s uncertainties drains today’s energy. Close the mental tabs, anchor yourself in the present hour, and execute what is in front of you.”',
  },
  {
    id: 5,
    category: 'success',
    themeTe: 'నిరంతర కృషి & ఆర్థిక స్వావలంబన',
    themeEn: 'Hard Work & Peace of Mind',
    slokamTe:
      'ఉద్యోగే నాస్తి దారిద్ర్యం జపతో నాస్తి పాతకమ్ |\nమౌనినః కలహో నాస్తి న భయం చాస్తి జాగ్రతః ||',
    slokamEn:
      'Udyoge nāsti dāridryaṃ japato nāsti pātakam |\nMauninaḥ kalaho nāsti na bhayaṃ cāsti jāgrataḥ ||',
    meaningTe:
      'నిరంతరం శ్రమించేవాడికి పేదరికం ఉండదు, భగవన్నామ స్మరణ చేసేవాడికి పాపచింత ఉండదు, సంయమనం పాటించేవాడికి గొడవలు ఉండవు, అప్రమత్తంగా ఉండేవాడికి భయం ఉండదు.',
    meaningEn:
      'Diligent effort banishes scarcity, mindfulness clears negativity, measured silence prevents conflict, and alertness removes fear.',
    loukikaQuoteTe:
      '“జీవితంలో నాలుగు సింపుల్ సూత్రాలు: కష్టపడి పనిచేస్తే ఆర్థిక భయం ఉండదు, అనవసర వాదనల్లో మౌనంగా ఉంటే మనశ్శాంతి పోదు, ప్రతి విషయంలో అలర్ట్‌గా ఉంటే ఎవరికీ భయపడాల్సిన అవసరం రాదు!”',
    loukikaQuoteEn:
      '“Four timeless life hacks: Consistent work eliminates financial stress, inner mindfulness clears mental clutter, strategic silence avoids toxic drama, and sharp awareness keeps you fearless.”',
  },
  {
    id: 6,
    category: 'resilience',
    themeTe: 'ఓర్పు & స్థిరమైన ఎదుగుదల',
    themeEn: 'Patience & Step-by-Step Growth',
    slokamTe:
      'శనైః పంథాః శనైః కంథాః శనైః పర్వతలంఘనమ్ |\nశనైర్విద్యా శనైర్విత్తం పంచైతాని శనైః శనైః ||',
    slokamEn:
      'Śanaiḥ panthāḥ śanaiḥ kanthāḥ śanaiḥ parvatalaṅghanam |\nŚanairvidyā śanairvittaṃ pañcaitāni śanaiḥ śanaiḥ ||',
    meaningTe:
      'సుదీర్ఘ ప్రయాణం, నైపుణ్య నిర్మాణం, కొండను ఎక్కడం, లోతైన విద్య, మరియు స్థిరమైన సంపద — ఈ ఐదూ అంచెలంచెలుగా, ఓర్పుతోనే సాధ్యమవుతాయి.',
    meaningEn:
      'Long journeys, craftsmanship, climbing great heights, deep mastery, and lasting wealth—these five are always achieved step by step.',
    loukikaQuoteTe:
      '“ఇన్‌స్టంట్ సక్సెస్, రాత్రికి రాత్రే ధనవంతులవ్వాలనే ఆరాటం వల్లే ఒత్తిడి పెరుగుతోంది. గొప్ప కెరీర్ అయినా, ఆర్థిక స్థిరత్వం అయినా ఒక్కో మెట్టు ఎక్కితేనే నిలబడుతుంది. ప్రక్రియను నమ్మండి, ఓర్పుతో సాగండి!”',
    loukikaQuoteEn:
      '“In an era obsessed with overnight success, remember that real mastery, career altitude, and lasting wealth are built brick by brick. Trust the slow, steady climb.”',
  },
  {
    id: 7,
    category: 'speech',
    themeTe: 'మాట తీరు & కమ్యూనికేషన్ పవర్',
    themeEn: 'Power of Articulate Speech',
    slokamTe:
      'కేయూరా న విభూషయంతి పురుషం హారా న చంద్రోజ్జ్వలాః |\nవాణ్యేకా సమలంకరోతి పురుషం యా సంస్కృతా ధార్యతే ||',
    slokamEn:
      'Keyūrā na vibhūṣayanti puruṣaṃārā na candrojjvalāḥ |\nVāṇyekā samalaṅkaroti puruṣaṃ yā saṃskṛtā dhāryate ||',
    meaningTe:
      'మనిషికి ఖరీదైన ఆభరణాలు, హారాలు అసలైన అందాన్ని ఇవ్వవు; సంస్కారవంతమైన, మృదువైన, స్పష్టమైన మాటతీరు మాత్రమే శాశ్వతమైన గౌరవాన్ని ఇస్తుంది.',
    meaningEn:
      'Expensive ornaments fade in value, but cultured, respectful, and articulate communication adorns a person forever.',
    loukikaQuoteTe:
      '“మీరు వేసుకునే బ్రాండెడ్ దుస్తుల కంటే, మీరు ఎదుటివారితో మాట్లాడే విధానమే మీ అసలైన వ్యక్తిత్వాన్ని చూపిస్తుంది. మర్యాదతో కూడిన స్పష్టమైన కమ్యూనికేషన్ ఉంటే ఏ రంగంలోనైనా మీరే లీడర్!”',
    loukikaQuoteEn:
      '“Luxury labels fade, but emotional intelligence and respectful communication never go out of style. How you speak to people is your truest personal brand.”',
  },
  {
    id: 8,
    category: 'mindset',
    themeTe: 'సమతుల్యత (Work-Life Balance)',
    themeEn: 'Balance & Moderation',
    slokamTe:
      'అతి దర్పాద్ధతా లంకా అతి మానాచ్చ కౌరవాః |\nఅతి దానాద్బలిర్బద్ధో హ్యతి సర్వత్ర వర్జయేత్ ||',
    slokamEn:
      'Ati darpāddhatā laṅkā ati mānācca kauravāḥ |\nAti dānādbalirbaddho hyati sarvatra varjayet ||',
    meaningTe:
      'అతి గర్వం, అతి పంతం, పరిమితికి మించిన పోకడలు ఎప్పుడూ అనర్థానికే దారితీస్తాయి. అందుకే జీవితంలో ప్రతి విషయంలోనూ "అతి" (Extreme) విడిచిపెట్టి సమతుల్యత పాటించాలి.',
    meaningEn:
      'Excess in pride, stubbornness, or even unmeasured giving leads to downfall; wisdom lies in practicing balance in all spheres of life.',
    loukikaQuoteTe:
      '“పనిలోనైనా, ఖర్చులోనైనా, సోషల్ మీడియా వాడకంలోనైనా, చివరికి ఎమోషన్స్‌లోనైనా "అతి" ఎప్పుడూ ప్రమాదమే. బ్యాలెన్స్ (సమతుల్యత) తెలిసినవాడే జీవితాన్ని ప్రశాంతంగా గెలుస్తాడు!”',
    loukikaQuoteEn:
      '“Whether it is hustle culture, screen time, spending, or emotional attachment—extremes lead to burnout. Sustainable success belongs to those who master balance.”',
  },
  {
    id: 9,
    category: 'dharma',
    themeTe: 'ఆలోచన, మాట, ఆచరణ ఏకత్వం (Integrity)',
    themeEn: 'Authentic Integrity',
    slokamTe:
      'మనస్యేకం వచస్యేకం కర్మణ్యేకం మహాత్మనామ్ |\nమనస్యన్యద్వచస్యన్యత్ కార్యే చాన్యద్ దురాత్మనామ్ ||',
    slokamEn:
      'Manasyekaṃ vacasyekaṃ karmaṇyekaṃ mahātmanām |\nManasyanyadvacasyanyat kārye cānyad durātmanām ||',
    meaningTe:
      'మహాత్ముల మనస్సులో ఆలోచన, నోటి మాట, చేసే పని — ఈ మూడూ ఒకేలా (నిజాయితీగా) ఉంటాయి. కపటులకు ఆలోచన ఒకటి, మాట మరొకటి, చేత ఇంకొకటిగా ఉంటాయి.',
    meaningEn:
      'Great individuals align their thoughts, words, and actions into one truth, whereas inconsistency breeds distrust.',
    loukikaQuoteTe:
      '“బయటకి ఒకలా నటిస్తూ లోపల మరొకలా ఉండటం వల్ల మనశ్శాంతి ఉండదు. మీ ఆలోచన, మీ మాట, మీ పని — ఈ మూడూ నిజాయితీగా ఒకే లైన్‌లో ఉన్నప్పుడు మీకు తిరుగులేని ఆత్మవిశ్వాసం వస్తుంది!”',
    loukikaQuoteEn:
      '“True confidence comes when your private thoughts, public words, and daily actions are in complete alignment. Authenticity is the highest form of peace.”',
  },
  {
    id: 10,
    category: 'resilience',
    themeTe: 'కష్టసుఖాలలో స్థిరత్వం (Emotional Resilience)',
    themeEn: 'Resilience Through Ups & Downs',
    slokamTe:
      'సుఖస్యానంతరం దుఃఖం దుఃఖస్యానంతరం సుఖమ్ |\nద్వయమేతద్ధి జంతూనామలంఘ్యం దినరాత్రివత్ ||',
    slokamEn:
      'Sukhasyānantaraṃ duḥkhaṃ duḥkhasyānantaraṃ sukham |\nDvayametaddhi jantūnāmalaṅghyaṃ dinarātrivat ||',
    meaningTe:
      'పగలు తర్వాత రాత్రి, రాత్రి తర్వాత పగలు ఎలా సహజమో, జీవితంలో సుఖం తర్వాత కష్టం, కష్టం తర్వాత సుఖం కూడా అలాగే మారుతూ ఉంటాయి.',
    meaningEn:
      'Just as day follows night and night follows day, phases of ease and challenge naturally alternate in human life.',
    loukikaQuoteTe:
      '“ఇప్పుడున్న కష్టం శాశ్వతం కాదు! చీకటి రాత్రి తర్వాత సూర్యోదయం ఎంత నిజమో, మీ కష్టకాలం తర్వాత వచ్చే మంచి రోజులు కూడా అంతే నిజం. ఓర్పుతో ఈ దశను దాటండి, విజయం మీదే!”',
    loukikaQuoteEn:
      '“No tough season is permanent. Just as sunrise inevitably follows the darkest night, your current struggle is preparing the ground for your next breakthrough. Keep going.”',
  },
  {
    id: 11,
    category: 'success',
    themeTe: 'ప్రతిభకే పట్టం (Merit Over Background)',
    themeEn: 'Skill & Character Over Status',
    slokamTe:
      'గుణాః పూజాస్థానం గుణిషు న చ లింగం న చ వయః |\nగుణాః సర్వత్ర పూజ్యంతే న మహత్యోఽపి సంపదః ||',
    slokamEn:
      'Guṇāḥ pūjāsthānaṃ guṇiṣu na ca liṅgaṃ na ca vayaḥ |\nGuṇāḥ sarvatra pūjyante na mahatyo’pi sampadaḥ ||',
    meaningTe:
      'నిజమైన ప్రతిభ, సద్గుణాలు ఉన్నచోట వయస్సుతో గానీ, స్థాయితో గానీ సంబంధం లేకుండా గౌరవం లభిస్తుంది. కేవలం ఆడంబరం కంటే గుణమే అంతటా పూజించబడుతుంది.',
    meaningEn:
      'True excellence and character command respect everywhere, regardless of age, background, or material display.',
    loukikaQuoteTe:
      '“నా వయస్సు చిన్నది, నాకు బ్యాక్‌గ్రౌండ్ లేదు అని సంకోచించకండి. ఈ పోటీ ప్రపంచంలో మీ స్కిల్ (నైపుణ్యం), మీ మంచి ప్రవర్తనే మిమ్మల్ని అందరికంటే ముందు నిలబెడతాయి!”',
    loukikaQuoteEn:
      '“Never let your age or humble beginnings hold you back. When your skill is sharp and your character is solid, every room eventually makes space for you.”',
  },
  {
    id: 12,
    category: 'mindset',
    themeTe: 'సమస్య రాకముందే ముందుచూపు (Proactive Thinking)',
    themeEn: 'Foresight & Preparation',
    slokamTe:
      'చింతనీయా హి విపదామాదావేవ ప్రతిక్రియా |\nన కూపఖననం యుక్తం ప్రదీప్తే వహ్నినా గృహే ||',
    slokamEn:
      'Cintanīyā hi vipadāmādāveva pratikriyā |\nNa kūpakhananaṃ yuktaṃ pradīpte vahninā gṛhe ||',
    meaningTe:
      'ఇల్లు తగలబడుతున్నప్పుడు బావి తవ్వడం మొదలుపెట్టడం వివేకం కాదు; సమస్య రాకముందే దాని పరిష్కారాన్ని, రక్షణను సిద్ధం చేసుకోవాలి.',
    meaningEn:
      'Do not wait until the house is on fire to dig a well; wise individuals prepare solutions and reserves well in advance.',
    loukikaQuoteTe:
      '“అత్యవసర సమయం వచ్చాక అప్పుల కోసం పరిగెత్తడం కంటే, ఆరోగ్యం చెడిపోయాక బాధపడటం కంటే — ముందే ఎమర్జెన్సీ ఫండ్ (పొదుపు), రోజువారీ వ్యాయామం అలవాటు చేసుకోవడమే అసలైన తెలివితేటలు!”',
    loukikaQuoteEn:
      '“Don’t start digging a well when the crisis hits. Build your emergency savings, upgrade your skills, and protect your health while life is calm.”',
  },
  {
    id: 13,
    category: 'speech',
    themeTe: 'మంచి మాట – సానుకూల శక్తి',
    themeEn: 'Kindness in Communication',
    slokamTe:
      'ప్రియవాక్యప్రదానేన సర్వే తుష్యంతి జంతవః |\nతస్మాత్తదేవ వక్తవ్యం వచనే కా దరిద్రతా ||',
    slokamEn:
      'Priyavākyapradānena sarve tuṣyanti jantavaḥ |\nTasmāttadeva vaktavyaṃ vacane kā daridratā ||',
    meaningTe:
      'ఆప్యాయమైన, మర్యాదపూర్వకమైన మాటల వల్ల ప్రతి ఒక్కరూ సంతోషిస్తారు. మంచి మాట మాట్లాడటానికి పైసా ఖర్చు కాదు కదా, మరి మంచి మాటలో పిసినారితనం ఎందుకు?',
    meaningEn:
      'Kind and encouraging words uplift everyone around you—and since kindness costs nothing, why ever be stingy with it?',
    loukikaQuoteTe:
      '“ఇంట్లో కుటుంబ సభ్యులైనా, ఆఫీసులో సహోద్యోగులైనా — ఒక చిన్న ప్రశంస, మర్యాదపూర్వకమైన మాట వారి రోజంతా మార్చేస్తుంది. మంచి మాట మాట్లాడటానికి ఖర్చు ఉండదు కానీ దాని విలువ వెలకట్టలేనిది!”',
    loukikaQuoteEn:
      '“A word of genuine appreciation costs zero rupees yet builds priceless goodwill at home and at work. Never be stingy with encouragement.”',
  },
  {
    id: 14,
    category: 'dharma',
    themeTe: 'నిజమైన మిత్రుడు & మేలు చేసే విమర్శ',
    themeEn: 'Valuing Honest Feedback',
    slokamTe:
      'అప్రియాణ్యపి కుర్వాణో యః ప్రియః ప్రియ ఏవ సః |\nఅప్రియస్య చ పథ్యస్య వక్తా శ్రోతా చ దుర్లభః ||',
    slokamEn:
      'Apriyāṇyapi kurvāṇo yaḥ priyaḥ priya eva saḥ |\nApriyasya ca pathyasya vaktā śrotā ca durlabhaḥ ||',
    meaningTe:
      'వినడానికి కష్టంగా ఉన్నా మన మంచికోసం నిజం చెప్పేవాడే నిజమైన శ్రేయోభిలాషి. చేదుగా ఉన్నా మేలు చేసే సత్యాన్ని చెప్పేవారూ, దాన్ని ఓర్పుతో వినేవారూ అరుదు.',
    meaningEn:
      'Those who speak constructive truth for your growth are your truest well-wishers, even when the feedback feels uncomfortable at first.',
    loukikaQuoteTe:
      '“మిమ్మల్ని ఎప్పుడూ పొగిడే భజన బృందం కంటే, మీ తప్పును సరిదిద్ది సరైన దారి చూపించే ఒక్క నిజాయితీ గల స్నేహితుడు లేదా గురువు చాలు జీవితంలో ఎదగడానికి!”',
    loukikaQuoteEn:
      '“Surround yourself with people who care enough to give you honest feedback rather than empty flattery. Constructive truth is the fuel of personal growth.”',
  },
  {
    id: 15,
    category: 'mindset',
    themeTe: 'ఆలోచనా విధానమే విజయానికి మూలం',
    themeEn: 'Power of Intention & Belief',
    slokamTe:
      'యాదృశీ భావనా యస్య సిద్ధిర్భవతి తాదృశీ |\nమన ఏవ మనుష్యాణాం కారణం బంధమోక్షయోః ||',
    slokamEn:
      'Yādṛśī bhāvanā yasya siddhirbhavati tādṛśī |\nMana eva manuṣyāṇāṃ kāraṇaṃ bandhamokṣayoḥ ||',
    meaningTe:
      'మనిషి మనస్సులో ఎలాంటి గట్టి భావన (సంకల్పం) ఉంటుందో, ఫలితం కూడా అలాగే సిద్ధిస్తుంది. మన బంధానికైనా, వికాసానికైనా మన మనస్సే ప్రధాన కారణం.',
    meaningEn:
      'As is the depth of your conviction, so is the outcome you achieve; the mind itself is the architect of limitation or liberation.',
    loukikaQuoteTe:
      '“నా వల్ల కాదు అనుకుంటే అక్కడే ఆగిపోతారు; నేను నేర్చుకుని సాధించగలను అనుకుంటే దారులు అవే తెరుచుకుంటాయి. మీ ఆలోచనా దృక్పథమే (Mindset) మీ జీవిత ఫలితాన్ని రాస్తుంది!”',
    loukikaQuoteEn:
      '“Your results mirror your dominant mindset. Shift from ‘Can I do this?’ to ‘How will I master this?’ and watch new doors open.”',
  },
  {
    id: 16,
    category: 'success',
    themeTe: 'ఆరోగ్యమే మహాభాగ్యం (Health First)',
    themeEn: 'Health & Mindful Living',
    slokamTe:
      'యుక్తాహారవిహారస్య యుక్తచేష్టస్య కర్మసు |\nయుక్తస్వప్నావబోధస్య యోగో భవతి దుఃఖహా ||',
    slokamEn:
      'Yuktāhāravihārasya yuktaceṣṭasya karmasu |\nYuktasvapnāvabodhasya yogo bhavati duḥkhahā ||',
    meaningTe:
      'సరైన ఆహారం, తగిన వ్యాయామం/విశ్రాంతి, పనిలో సమతుల్యత, వేళకు నిద్ర మరియు మేల్కొలుపు పాటించేవారికి శారీరక, మానసిక ఒత్తిడులు దరిచేరవు.',
    meaningEn:
      'For one who maintains balanced nutrition, purposeful work, and timely sleep and waking, stress and sorrow naturally dissolve.',
    loukikaQuoteTe:
      '“అర్ధరాత్రి వరకు ఫోన్ చూడటం, సమయానికి భోజనం చేయకపోవడం వల్ల ఎంత సంపాదించినా ఆనందం ఉండదు. మంచి ఆహారం, 7 గంటల నిద్ర, క్రమబద్ధమైన పని — ఇదే అన్నిటికంటే పెద్ద ఐశ్వర్యం!”',
    loukikaQuoteEn:
      '“No career milestone can compensate for neglected health. Timely nutrition, quality sleep, and mindful work routines are the ultimate wealth.”',
  },
];

export interface DailySubhashithamCardProps {
  isoDate?: string;
}

export const DailySubhashithamCard: React.FC<DailySubhashithamCardProps> = ({ isoDate }) => {
  const { t } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();

  const initialIndex = useMemo(() => {
    const str = isoDate || new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % DAILY_SUBHASHITHALU.length;
    }
    return Math.abs(hash) % DAILY_SUBHASHITHALU.length;
  }, [isoDate]);

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [cardLangMode, setCardLangMode] = useState<'te' | 'en' | 'both'>('both');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoStatus, setVideoStatus] = useState<string>('');
  const [videoResult, setVideoResult] = useState<DailyReelResult | null>(null);
  const [showSocialPack, setShowSocialPack] = useState<boolean>(false);
  const [copiedSocialField, setCopiedSocialField] = useState<string>('');

  const item = DAILY_SUBHASHITHALU[currentIndex] || DAILY_SUBHASHITHALU[0];

  const socialPack = useMemo(
    () => generateSubhashithamSocialPack(item, cardLangMode === 'en' ? 'en' : 'te'),
    [item, cardLangMode]
  );

  const handleCopySocialField = async (fieldKey: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSocialField(fieldKey);
      setTimeout(() => setCopiedSocialField(''), 2500);
    } catch {}
  };

  const handleDownloadSubhashithamVideo = async (mode: 'te' | 'en' | 'both' = cardLangMode) => {
    if (isRecordingVideo) return;
    setIsRecordingVideo(true);
    setVideoProgress(0);
    setVideoResult(null);
    setVideoStatus('30 సెకన్ల సుభాషితం & జీవన సందేశం 9:16 వీడియో సిద్ధమవుతోంది...');
    try {
      const res = await generateDailySubhashithamReelVideo(item, mode, (pct, label) => {
        setVideoProgress(pct);
        setVideoStatus(label);
      });
      setVideoResult(res);
    } catch (e) {
      console.error('Failed to record subhashitham video:', e);
    } finally {
      setIsRecordingVideo(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DAILY_SUBHASHITHALU.length) % DAILY_SUBHASHITHALU.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_SUBHASHITHALU.length);
  };

  const handleRandom = () => {
    const nextIdx = (currentIndex + 1 + Math.floor(Math.random() * (DAILY_SUBHASHITHALU.length - 1))) % DAILY_SUBHASHITHALU.length;
    setCurrentIndex(nextIdx);
  };

  const buildShareText = (mode: 'te' | 'en' | 'both' = cardLangMode) => {
    if (mode === 'en') {
      return `✨ *Daily Vedic Wisdom & Modern Life Quote* ✨\n\n📜 *Sanskrit Sloka:*\n${item.slokamEn}\n\n💡 *Meaning:* ${item.meaningEn}\n\n🌟 *Today's Practical Takeaway:*\n${item.loukikaQuoteEn}\n\n— *Brahmasri Jallavaram Sai Dheeraj Sharma*\n🔗 https://www.telugujyothisham.com`;
    }
    if (mode === 'te') {
      return `✨ *నేటి సుభాషిత శ్లోకం & జీవన సూత్రం* ✨\n\n📜 *శ్లోకం:*\n${item.slokamTe}\n\n💡 *భావం:* ${item.meaningTe}\n\n🌟 *నేటి తరానికి లౌకిక సందేశం:*\n${item.loukikaQuoteTe}\n\n— *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ*\n🔗 https://www.telugujyothisham.com`;
    }
    return `✨ *నేటి సుభాషిత శ్లోకం & జీవన సూత్రం (Daily Wisdom)* ✨\n\n📜 *శ్లోకం:*\n${item.slokamTe}\n(${item.slokamEn})\n\n🌟 *నేటి తరానికి లౌకిక సందేశం:*\n${item.loukikaQuoteTe}\n\n💡 *Modern Takeaway:*\n${item.loukikaQuoteEn}\n\n— *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ*\n🔗 https://www.telugujyothisham.com`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(cardLangMode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(buildShareText(cardLangMode));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Helper to draw a single centered line guaranteed across all browsers without overflowing borders
  const drawCenteredLine = (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    y: number,
    maxWidth = 940
  ) => {
    ctx.save();
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    let textWidth = ctx.measureText(text).width;
    if (textWidth > maxWidth) {
      const m = ctx.font.match(/(\d+(?:\.\d+)?)px/);
      if (m) {
        let px = parseFloat(m[1]);
        while (px > 14 && textWidth > maxWidth) {
          px -= 1;
          ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, `${px}px`);
          textWidth = ctx.measureText(text).width;
        }
      }
    }
    const x = Math.round(centerX - textWidth / 2);
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // Helper to wrap text and draw every single line centered around centerX
  const drawCenteredWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    startY: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    ctx.save();
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    const paragraphs = text.split('\n');
    let currentY = startY;

    for (const para of paragraphs) {
      if (!para.trim()) {
        currentY += lineHeight * 0.5;
        continue;
      }
      const words = para.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const word = words[n];
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine.length > 0) {
          const lineWidth = ctx.measureText(currentLine.trim()).width;
          const lineX = Math.round(centerX - lineWidth / 2);
          ctx.fillText(currentLine.trim(), lineX, currentY);
          currentLine = word;
          currentY += lineHeight;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        const lineWidth = ctx.measureText(currentLine.trim()).width;
        const lineX = Math.round(centerX - lineWidth / 2);
        ctx.fillText(currentLine.trim(), lineX, currentY);
        currentY += lineHeight;
      }
    }

    ctx.restore();
    return currentY;
  };

  // Helper to measure height needed for wrapped text
  const measureWrappedHeight = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const paragraphs = text.split('\n');
    let lineCount = 0;

    for (const para of paragraphs) {
      if (!para.trim()) {
        lineCount += 0.5;
        continue;
      }
      const words = para.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const word = words[n];
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine.length > 0) {
          lineCount++;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        lineCount++;
      }
    }

    return Math.max(1, lineCount) * lineHeight;
  };

  // Cross-browser safe rounded rectangle
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  };

  const handleDownloadQuoteImage = async (langMode: 'te' | 'en' | 'both') => {
    setIsDownloading(true);
    try {
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {}
      }

      const canvas = document.createElement('canvas');
      const width = 1080;
      const height = langMode === 'both' ? 1350 : 1080;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      const centerX = width / 2; // Exact center point: 540px

      // 1. Rich Temple Maroon & Deep Burgundy Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#260600');
      bgGrad.addColorStop(0.35, '#421004');
      bgGrad.addColorStop(0.7, '#2b0700');
      bgGrad.addColorStop(1, '#1a0300');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Radial Gold Shimmer in Center
      const radGrad = ctx.createRadialGradient(
        centerX,
        height * 0.45,
        60,
        centerX,
        height * 0.45,
        width * 0.6
      );
      radGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Double Gold Borders (Mathematically Centered)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.strokeStyle = 'rgba(252, 211, 77, 0.55)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      // Small corner ornaments
      const drawCornerDot = (cx: number, cy: number) => {
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCornerDot(50, 50);
      drawCornerDot(width - 50, 50);
      drawCornerDot(50, height - 50);
      drawCornerDot(width - 50, height - 50);

      // 3. Top Header Section (100% Centered)
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 26px "Noto Serif Telugu", "Tiro Telugu", Georgia, serif';
      drawCenteredLine(
        ctx,
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • నిత్య సుభాషిత జీవన సూత్రం',
        centerX,
        105
      );

      ctx.fillStyle = '#fde68a';
      ctx.font = '600 21px system-ui, -apple-system, sans-serif';
      const badgeLabel =
        langMode === 'en'
          ? `DAILY VEDIC WISDOM • ${item.themeEn.toUpperCase()}`
          : `${item.themeTe} • ${item.themeEn}`;
      drawCenteredLine(ctx, badgeLabel, centerX, 145);

      // Centered decorative gold divider
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 240, 172);
      ctx.lineTo(centerX + 240, 172);
      ctx.stroke();

      let cursorY = 220;

      // 4. Sanskrit Slokam Section (100% Centered)
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 23px system-ui, -apple-system, sans-serif';
      drawCenteredLine(
        ctx,
        langMode === 'en' ? '✦ CLASSICAL SANSKRIT SLOKA ✦' : '✦ మూల సంస్కృత సుభాషిత శ్లోకం ✦',
        centerX,
        cursorY
      );
      cursorY += 45;

      const slokaMaxWidth = width - 180;

      if (langMode === 'te' || langMode === 'both') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px "Noto Serif Telugu", "Tiro Telugu", serif';
        cursorY = drawCenteredWrappedText(
          ctx,
          item.slokamTe,
          centerX,
          cursorY,
          slokaMaxWidth,
          46
        );
        cursorY += 8;
      }

      if (langMode === 'en' || langMode === 'both') {
        ctx.fillStyle = '#fde68a';
        ctx.font = 'italic 23px Georgia, serif';
        cursorY = drawCenteredWrappedText(
          ctx,
          item.slokamEn,
          centerX,
          cursorY,
          slokaMaxWidth,
          36
        );
        cursorY += 10;
      }

      // 5. Simple Meaning (Tatparyam - 100% Centered)
      ctx.fillStyle = '#fed7aa';
      ctx.font = '22px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      const meaningText =
        langMode === 'en'
          ? `Meaning: ${item.meaningEn}`
          : `తాత్పర్యం: ${item.meaningTe}`;
      cursorY = drawCenteredWrappedText(
        ctx,
        meaningText,
        centerX,
        cursorY + 6,
        slokaMaxWidth,
        36
      );
      cursorY += 24;

      // 6. Highlighted Modern Loukika Quote Card Box (Centered & Dynamically Sized)
      const boxW = Math.min(940, width - 140); // 940px wide, centered
      const boxX = Math.round((width - boxW) / 2); // 70px margin on both sides
      const boxTop = cursorY;
      const textInnerWidth = boxW - 80;

      // Measure height for inner text dynamically
      ctx.font = 'bold 26px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      const quoteTeHeight =
        langMode === 'te' || langMode === 'both'
          ? measureWrappedHeight(ctx, item.loukikaQuoteTe, textInnerWidth, 42)
          : 0;

      ctx.font = langMode === 'both' ? 'bold 22px Georgia, serif' : 'bold 26px Georgia, serif';
      const quoteEnHeight =
        langMode === 'en' || langMode === 'both'
          ? measureWrappedHeight(ctx, item.loukikaQuoteEn, textInnerWidth, langMode === 'both' ? 34 : 42)
          : 0;

      const titleHeight = 44;
      const boxPaddingTop = 40;
      const boxPaddingBottom = 36;
      const spaceBetween = langMode === 'both' ? 16 : 0;
      const calculatedBoxHeight =
        boxPaddingTop + titleHeight + quoteTeHeight + spaceBetween + quoteEnHeight + boxPaddingBottom;

      // Draw cream card box
      ctx.fillStyle = 'rgba(255, 251, 235, 0.97)';
      drawRoundedRect(ctx, boxX, boxTop, boxW, calculatedBoxHeight, 26);
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Card Header Title (Centered inside box)
      let innerY = boxTop + boxPaddingTop;
      ctx.fillStyle = '#9a3412';
      ctx.font = 'bold 23px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      drawCenteredLine(
        ctx,
        langMode === 'en'
          ? '🌟 MODERN GENERATION LIFE TAKEAWAY 🌟'
          : '🌟 నేటి తరానికి లౌకిక జీవన సందేశం (Practical Takeaway) 🌟',
        centerX,
        innerY
      );
      innerY += titleHeight;

      // Telugu Quote inside box (Centered line by line)
      if (langMode === 'te' || langMode === 'both') {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 26px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
        innerY = drawCenteredWrappedText(
          ctx,
          item.loukikaQuoteTe,
          centerX,
          innerY,
          textInnerWidth,
          42
        );
        innerY += spaceBetween;
      }

      // English Quote inside box (Centered line by line)
      if (langMode === 'en' || langMode === 'both') {
        ctx.fillStyle = langMode === 'both' ? '#334155' : '#1e293b';
        ctx.font = langMode === 'both' ? 'bold 22px Georgia, serif' : 'bold 26px Georgia, serif';
        innerY = drawCenteredWrappedText(
          ctx,
          item.loukikaQuoteEn,
          centerX,
          innerY,
          textInnerWidth,
          langMode === 'both' ? 34 : 42
        );
      }

      // 7. Footer Branding (100% Centered at Bottom)
      const footerY = height - 105;
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 24px "Noto Serif Telugu", "Tiro Telugu", sans-serif';
      drawCenteredLine(
        ctx,
        'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Brahmasri Jallavaram Sai Dheeraj Sharma)',
        centerX,
        footerY
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      drawCenteredLine(ctx, '🌐 www.telugujyothisham.com', centerX, footerY + 38);

      // Trigger PNG Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `telugujyothisham-quote-${item.id}-${langMode}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to generate quote image:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      id="daily-subhashitham-quotes"
      aria-label="Daily Sanskrit Subhashitham Slokam and Practical Modern Life Quote"
      className="bg-gradient-to-br from-[#2b0800] via-[#3d0e04] to-[#240600] text-white rounded-3xl p-5 sm:p-8 border-2 border-amber-500/90 shadow-xl space-y-6 font-telugu"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>
              {t(
                'నిత్య సుభాషిత శ్లోకం & నేటి తరానికి లౌకిక జీవన సూత్రం • Daily Quote Card',
                'Daily Subhashitha Sloka & Modern Generation Life Quote'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-amber-100 leading-tight">
            {t(
              `నేటి సుభాషిత శ్లోకం & లౌకిక జీవన సందేశం (#${item.id})`,
              `Today's Sanskrit Sloka & Practical Life Quote (#${item.id})`
            )}
          </h2>
        </div>

        {/* Language Mode & Sloka Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-black/35 p-1 border border-amber-500/40">
            {[
              { id: 'both' as const, label: 'తెలుగు + English' },
              { id: 'te' as const, label: 'తెలుగు మాత్రమే' },
              { id: 'en' as const, label: 'English Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCardLangMode(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  cardLangMode === tab.id
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              title="మునుపటి శ్లోకం (Previous Quote)"
              className="p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleRandom}
              className="px-3 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle size={13} />
              <span>{t('మరొక శ్లోకం', 'Next Wisdom')}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="తదుపరి శ్లోకం (Next Quote)"
              className="p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Quote Card Preview */}
      <div className="bg-gradient-to-b from-[#3b0c03] to-[#230600] rounded-3xl p-5 sm:p-7 border-2 border-amber-400/80 shadow-inner space-y-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-300 border-b border-amber-500/25 pb-3">
          <span>✦ {item.themeTe} ({item.themeEn})</span>
          <span className="font-mono text-amber-200/80">
            శ్లోకం #{item.id} / {DAILY_SUBHASHITHALU.length}
          </span>
        </div>

        {/* Slokam Block */}
        <div className="text-center space-y-2.5 py-2">
          {(cardLangMode === 'te' || cardLangMode === 'both') && (
            <p className="text-lg sm:text-2xl font-extrabold text-amber-200 leading-relaxed whitespace-pre-line">
              {item.slokamTe}
            </p>
          )}
          {(cardLangMode === 'en' || cardLangMode === 'both') && (
            <p className="text-sm sm:text-base italic text-amber-100/90 font-serif whitespace-pre-line">
              {item.slokamEn}
            </p>
          )}
        </div>

        {/* Direct Simple Meaning (Tatparyam) */}
        <div className="bg-black/30 rounded-2xl p-4 border border-amber-500/30 space-y-1.5 text-xs sm:text-sm">
          {(cardLangMode === 'te' || cardLangMode === 'both') && (
            <p className="text-amber-100 leading-relaxed">
              <strong className="text-amber-300">సరళ భావం:</strong> {item.meaningTe}
            </p>
          )}
          {(cardLangMode === 'en' || cardLangMode === 'both') && (
            <p className="text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300">Simple Meaning:</strong> {item.meaningEn}
            </p>
          )}
        </div>

        {/* Modern Loukika Takeaway (For Today's Generation) */}
        <div className="bg-[#fffbeb] text-slate-900 rounded-2xl p-5 sm:p-6 border-2 border-amber-400 shadow-md space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-900 uppercase tracking-wide">
              <Sparkles size={15} className="text-amber-700" />
              <span>
                {cardLangMode === 'en'
                  ? 'Modern Generation Practical Takeaway'
                  : 'నేటి తరానికి లౌకిక జీవన సందేశం (Practical Life Quote)'}
              </span>
            </span>
          </div>

          {(cardLangMode === 'te' || cardLangMode === 'both') && (
            <p className="text-base sm:text-lg font-extrabold text-amber-950 leading-relaxed">
              {item.loukikaQuoteTe}
            </p>
          )}

          {(cardLangMode === 'en' || cardLangMode === 'both') && (
            <p
              className={`${
                cardLangMode === 'both'
                  ? 'text-xs sm:text-sm text-slate-700 border-t border-amber-200 pt-2.5'
                  : 'text-base sm:text-lg text-amber-950'
              } font-bold leading-relaxed`}
            >
              {item.loukikaQuoteEn}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-bold text-amber-900 border-t border-amber-200/80">
            <span>— బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ</span>
            <span className="font-mono">www.telugujyothisham.com</span>
          </div>
        </div>
      </div>

      {/* Download 30s Reel Video & HD Image (Admin / Studio Only) + Share Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 pt-1">
        {isGuruAdmin ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isRecordingVideo}
              onClick={() => handleDownloadSubhashithamVideo(cardLangMode)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-65 text-white border-2 border-amber-200 font-extrabold text-xs sm:text-sm shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isRecordingVideo ? (
                <Loader2 size={16} className="animate-spin text-amber-200" />
              ) : (
                <Film size={16} className="text-amber-100" />
              )}
              <span>
                {isRecordingVideo
                  ? `రికార్డింగ్ ${videoProgress}%...`
                  : '🎬 అడ్మిన్: 30s సుభాషితం వీడియో డౌన్‌లోడ్ (9:16)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSocialPack((prev) => !prev)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 border-2 border-amber-400 font-extrabold text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Hash size={15} className="text-amber-300" />
              <span>🔒 క్యాప్షన్ & Hashtags</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={() => handleDownloadQuoteImage('te')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-extrabold text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download size={16} />
              <span>🔒 తెలుగు కోట్ ఇమేజ్ (PNG)</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={() => handleDownloadQuoteImage('en')}
              className="px-3.5 py-2.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-100 border border-amber-400/70 font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <ImageIcon size={15} />
              <span>🔒 English Quote (PNG)</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={() => handleDownloadQuoteImage('both')}
              className="px-3.5 py-2.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-100 border border-amber-400/70 font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Download size={15} />
              <span>🔒 Telugu + English (PNG)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 border border-amber-400/40 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              {copied ? <Check size={15} className="text-emerald-300" /> : <Copy size={15} />}
              <span>{copied ? 'కాపీ అయింది!' : '🔒 Copy Quote'}</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Share2 size={15} />
            <span>WhatsApp Status / Share</span>
          </button>
        </div>
      </div>

      {/* Admin-Only 30s Video Progress / Ready Download Bar */}
      {isGuruAdmin && (isRecordingVideo || videoResult) && (
        <div className="bg-black/45 border border-amber-400/70 rounded-2xl p-4 space-y-2.5">
          {isRecordingVideo ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-amber-200">
                <span>🎬 {videoStatus}</span>
                <span>{videoProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-amber-950 rounded-full overflow-hidden border border-amber-600/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-amber-300/90">
                స్టార్టింగ్ సైట్ నేమ్ యానిమేషన్ (0–4.5s) + సుభాషిత శ్లోకం & నేటి తరానికి సందేశం (4.5–24s) + వెబ్‌సైట్ సేవల యాడ్ (24–30s) • 30 సెకన్లు పూర్తికాగానే ఆటోమేటిక్‌గా డౌన్‌లోడ్ అవుతుంది.
              </p>
            </div>
          ) : (
            videoResult && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs sm:text-sm font-extrabold text-emerald-300">
                  ✅ మీ 30 సెకన్ల సుభాషితం 9:16 వీడియో సిద్ధమైంది! ({videoResult.filename})
                </div>
                <a
                  href={videoResult.url}
                  download={videoResult.filename}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md"
                >
                  <Download size={15} />
                  <span>మళ్ళీ డౌన్‌లోడ్ చేయండి</span>
                </a>
              </div>
            )
          )}
        </div>
      )}

      {/* Admin-Only Subhashitham Video Title, Caption & Hashtags Copy Drawer */}
      {isGuruAdmin && showSocialPack && (
        <div className="bg-black/50 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 space-y-3 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-700/60 pb-2.5">
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
                <Hash size={15} />
                <span>🔒 అడ్మిన్ మాత్రమే: 30s సుభాషితం వీడియో టైటిల్, క్యాప్షన్ & Hashtags (#{item.id})</span>
              </span>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                YouTube Shorts, Instagram Reels & WhatsApp Status కోసమే సిద్ధం చేసిన శ్లోకం + భావం + వెబ్‌సైట్ సేవల క్యాప్షన్
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopySocialField('all', socialPack.fullPostText)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer shadow-sm"
            >
              {copiedSocialField === 'all' ? <Check size={14} /> : <Copy size={14} />}
              <span>
                {copiedSocialField === 'all'
                  ? 'మొత్తం పోస్ట్ కాపీ అయింది!'
                  : 'మొత్తం పోస్ట్ కాపీ చేయండి (Title + Caption + Hashtags)'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-amber-950/70 border border-amber-700/60 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300">1. వీడియో టైటిల్ (Title)</span>
                <button
                  type="button"
                  onClick={() => handleCopySocialField('title', socialPack.youtubeTitle)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-[11px] font-bold cursor-pointer"
                >
                  {copiedSocialField === 'title' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSocialField === 'title' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-amber-100 font-bold leading-relaxed select-all">
                {socialPack.youtubeTitle}
              </p>
            </div>

            <div className="bg-amber-950/70 border border-amber-700/60 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300">2. క్యాప్షన్ & సైట్ సేవలు</span>
                <button
                  type="button"
                  onClick={() => handleCopySocialField('caption', socialPack.caption)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-[11px] font-bold cursor-pointer"
                >
                  {copiedSocialField === 'caption' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSocialField === 'caption' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[11px] text-amber-100/95 whitespace-pre-wrap font-telugu leading-relaxed max-h-36 overflow-y-auto select-all">
                {socialPack.caption}
              </pre>
            </div>

            <div className="bg-amber-950/70 border border-amber-700/60 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300">3. వైరల్ Hashtags</span>
                <button
                  type="button"
                  onClick={() => handleCopySocialField('tags', socialPack.hashtags)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-[11px] font-bold cursor-pointer"
                >
                  {copiedSocialField === 'tags' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSocialField === 'tags' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-300 font-mono leading-relaxed break-words select-all">
                {socialPack.hashtags}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
