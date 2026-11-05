import { NAKSHATRAS, ALL_RASHIS } from '../data/panchangamData';

export type MuhurthaCategory =
  | 'samskara'
  | 'marriage'
  | 'education'
  | 'construction'
  | 'business'
  | 'finance'
  | 'career'
  | 'travel'
  | 'health'
  | 'agriculture'
  | 'micro_systems';

export interface MuhurthaActivityRule {
  id: string;
  nameTe: string;
  nameEn: string;
  category: MuhurthaCategory;
  categoryNameTe: string;
  categoryNameEn: string;
  taglineTe: string;
  taglineEn: string;
  favorableTithis: string[];
  unfavorableTithis: string[];
  favorableVaras: string[];
  unfavorableVaras: string[];
  favorableNakshatras: string[];
  unfavorableNakshatras: string[];
  favorableLagnas: string[];
  avoidableLagnas: string[];
  prohibitedFactorsTe: string[];
  prohibitedFactorsEn: string[];
  shastraPramanaSutram: string;
  shastraSource: string; // ONLY Sage lineages: వశిష్ఠ సంహిత, పరాశర మహర్షి, భృగు మహర్షి, గర్గ సంహిత, శారంగధర పద్ధతి, ముహూర్త మార్తాండ, ముహూర్త చింతామణి
  sutraMeaningTe: string;
  sutraMeaningEn: string;
  howToChooseTe: string[];
  howToChooseEn: string[];
  whenToPerformTe: string[];
  whenToPerformEn: string[];
  exemptionsPariharaluTe: string[];
  exemptionsPariharaluEn: string[];
  seoKeywords: string[];
}

export interface MarriageDoshaInfo {
  number: number;
  nameTe: string;
  nameEn: string;
  descriptionTe: string;
  descriptionEn: string;
  severity: 'high' | 'medium' | 'critical';
  pariharaTe: string;
  pariharaEn: string;
  shastraPramanam: string;
}

export interface ShivaMuhurthaSlot {
  index: number;
  nameTe: string;
  nameEn: string;
  guna: 'సాత్విక' | 'రాజసిక' | 'తామసిక';
  durationMinutes: number;
  natureTe: string;
  natureEn: string;
  suitableActivitiesTe: string;
}

export interface BhargavaNaadikaSlot {
  nadikaNumber: number;
  element: string;
  planetRuler: string;
  natureTe: string;
  durationMinutes: number;
  auspiciousness: 'ఉత్తమం' | 'మధ్యమం' | 'వర్జ్యం';
}

export interface PanchaBhootaTatwaSlot {
  tatwaTe: string;
  tatwaEn: string;
  durationMinutes: number;
  elementNatureTe: string;
  suitableForTe: string;
  isFavorable: boolean;
}

/**
 * Classical 21 Great Marriage Doshas (ఏకవింశతి మహా దోషాలు)
 * Strictly derived from Maharshi traditions (వశిష్ఠ, పరాశర, భృగు, గర్గ సంహితలు)
 * Zero modern authors or page numbers.
 */
export const MARRIAGE_EKAVIMSATI_DOSHAS: MarriageDoshaInfo[] = [
  {
    number: 1,
    nameTe: 'పంచాంగ శుద్ధి లోపం',
    nameEn: 'Panchanga Asuddhi',
    descriptionTe: 'తిథి, వారం, నక్షత్రం, యోగం, కరణం అనే పంచాంగాలలో దోషం ఉండకూడదు. అమావాస్య, రిక్త తిథులు, వ్యతీపాత, వైధృతి యోగాలు, విష్టి కరణం వివాహానికి నిషిద్ధం.',
    descriptionEn: 'Defect in any of the five limbs of Panchangam. Rikta tithis, Vyatipata/Vaidhriti yogas, and Vishti karana must be avoided.',
    severity: 'critical',
    pariharaTe: 'గురు, శుక్ర గ్రహాల లగ్న కేంద్ర దృష్టి ఉన్నచో పంచాంగ సంబంధిత చిన్నపాటి దోషాలు తొలగిపోతాయి.',
    pariharaEn: 'Jupiter or Venus aspecting the Lagna or in Kendra neutralizes minor Panchanga blemishes.',
    shastraPramanam: 'వశిష్ఠ సంహిత - పంచాంగ శుద్ధి ప్రకరణం',
  },
  {
    number: 2,
    nameTe: 'సూర్య సంక్రమణ దోషం',
    nameEn: 'Surya Sankramana Dosha',
    descriptionTe: 'రవి ఒక రాశి నుండి మరొక రాశిలోకి ప్రవేశించే పుణ్యకాల సమయంలో (సంక్రాంతి కాలంలో ముందు 16 ఘడియలు, వెనుక 16 ఘడియలు) వివాహం చేయకూడదు.',
    descriptionEn: 'Solar transit moment. 16 Ghatis before and after Sun enters a new zodiac sign are inauspicious for marriage.',
    severity: 'high',
    pariharaTe: 'సంక్రమణ సమయం దాటిన పిమ్మట మాత్రమే లగ్నం నిర్ణయించాలి. శుభగ్రహ లగ్న బలం తోడ్పడును.',
    pariharaEn: 'Plan the muhurtham strictly after the completion of the transit interval.',
    shastraPramanam: 'పరాశర హోరా శాస్త్రం & ముహూర్త చింతామణి',
  },
  {
    number: 3,
    nameTe: 'పాప షడ్వర్గ దోషం',
    nameEn: 'Papa Shadvarga Dosha',
    descriptionTe: 'లగ్నం పాపగ్రహాల (రవి, కుజ, శని, రాహు, కేతు) షడ్వర్గాలలో (రాశి, హోర, ద్రేక్కాణ, నవాంశ, ద్వాదశాంశ, త్రింశాంశ) ఎక్కువగా ఉండకూడదు.',
    descriptionEn: 'The Lagna falling predominantly into the divisional harmonic charts ruled by malefic planets.',
    severity: 'high',
    pariharaTe: 'లగ్నాధిపతి స్వక్షేత్రంలో ఉండి, గురుడు లేదా శుక్రునితో సంయోగం చెందినచో వర్గ దోష పరిహారం లభించును.',
    pariharaEn: 'Lagna lord well placed in own sign with benefic association negates Shadvarga doshas.',
    shastraPramanam: 'వశిష్ఠ సంహిత - షడ్వర్గ నిరూపణం',
  },
  {
    number: 4,
    nameTe: 'కు-నవాంశ దోషం',
    nameEn: 'Ku-Navamsha Dosha',
    descriptionTe: 'వివాహ లగ్న నవాంశ లేదా చంద్ర నవాంశ కుజ, శని క్షేత్రాలలో లేదా శత్రు వర్గాలలో ఉండటం దోష ప్రదం.',
    descriptionEn: 'Lagna or Moon falling into malefic or inimical Navamshas.',
    severity: 'high',
    pariharaTe: 'శుభ నవాంశను (గురు, బుధ, శుక్ర నవాంశలు) ఎంపిక చేయడం వల్ల వైవాహిక సౌఖ్యం సిద్ధించును.',
    pariharaEn: 'Ensure the Lagna rises in a benefic Navamsha (Jupiter, Mercury, or Venus).',
    shastraPramanam: 'భృగు నంది నాడీ సంహిత',
  },
  {
    number: 5,
    nameTe: 'ఉదయాస్త శుద్ధి లోపం',
    nameEn: 'Udayasta Asuddhi (1st & 7th House Blemish)',
    descriptionTe: 'లగ్నం (1వ స్థానం) మరియు సప్తమ స్థానం (7వ స్థానం) లో పాపగ్రహాలు ఉండరాదు. సప్తమంలో ఏ గ్రహం ఉన్నా దాంపత్యంలో చికాకులు తెచ్చును.',
    descriptionEn: 'Malefics placed in 1st or 7th house. The 7th house must remain vacant and strictly pure.',
    severity: 'critical',
    pariharaTe: 'సప్తమ స్థానం పూర్తిగా శుద్ధమై (గ్రహ రహితమై) శుభగ్రహ వీక్షణ కలిగి ఉండవలెను.',
    pariharaEn: 'The 7th house should be completely unoccupied by planets and aspected by natural benefics.',
    shastraPramanam: 'గర్గ సంహిత - వైవాహిక లగ్న శుద్ధి',
  },
  {
    number: 6,
    nameTe: 'పాప కర్తరీ దోషం',
    nameEn: 'Papa Kartari Dosha',
    descriptionTe: 'లగ్నానికి లేదా చంద్రునికి ఇరువైపులా (12వ స్థానం మరియు 2వ స్థానంలో) పాపగ్రహాలు ఉండటం వల్ల కత్తెర దోషం ఏర్పడును.',
    descriptionEn: 'Lagna or Moon hemmed between malefic planets in the 12th and 2nd houses.',
    severity: 'critical',
    pariharaTe: 'కేంద్ర కోణాలలో గురువు లేదా శుక్రుడు బలవంతుడై ఉన్నచో కర్తరీ దోష ప్రభావం నశించును.',
    pariharaEn: 'A strong Jupiter or Venus situated in a Kendra or Kona cancels the scissor affliction.',
    shastraPramanam: 'ముహూర్త మార్తాండ సూత్రం',
  },
  {
    number: 7,
    nameTe: 'భృగు షట్క దోషం',
    nameEn: 'Bhrigu Shatka Dosha (Venus in 6th)',
    descriptionTe: 'వివాహ లగ్నానికి 6వ స్థానంలో శుక్రుడు ఉండకూడదు. శుక్రుడు ఆరవ ఇంట ఉంటే శత్రుపీడ, భార్యాభర్తల మధ్య మనస్పర్థలు కలుగును.',
    descriptionEn: 'Venus placed in the 6th house from the marriage ascendant brings marital friction.',
    severity: 'high',
    pariharaTe: 'శుక్రుడు తులా లేదా వృషభ రాశిలో స్వక్షేత్రగతుడై ఉన్నచో దోష తీవ్రత తగ్గును.',
    pariharaEn: 'Venus occupying own sign mitigates the intensity, though avoiding 6th is ideal.',
    shastraPramanam: 'భృగు మహర్షి ప్రణీతం',
  },
  {
    number: 8,
    nameTe: 'కుజాష్టమ దోషం',
    nameEn: 'Kujashtama Dosha (Mars in 8th)',
    descriptionTe: 'వివాహ లగ్నానికి 8వ ఇంట కుజుడు ఉండటం అత్యంత నిషిద్ధం. ఇది వైధవ్య లేదా ఆయుర్దాయ భంగ దోషాలకు కారణమగును.',
    descriptionEn: 'Mars placed in the 8th house from wedding ascendant creates grave longevity impediments.',
    severity: 'critical',
    pariharaTe: 'కుజుడు మకరంలో ఉచ్ఛ స్థితిలో ఉన్నా వివాహ లగ్నాష్టమంలో నివారించడం ఉత్తమోత్తమ శాస్త్ర విధి.',
    pariharaEn: 'Strictly avoid Mars in the 8th house for marriage muhurtham without exception.',
    shastraPramanam: 'వశిష్ఠ సంహిత - అష్టమ స్థాన విచారము',
  },
  {
    number: 9,
    nameTe: 'లగ్న-చంద్రునికి 6, 8, 12 దోషం',
    nameEn: 'Trikona/Dusthana Moon & Lagna',
    descriptionTe: 'జన్మ రాశి నుండి వివాహ లగ్నం లేదా వివాహ చంద్రుడు 6, 8, 12 స్థానాలలో ఉండకూడదు.',
    descriptionEn: 'Muhurtha Moon or Lagna falling in 6th, 8th, or 12th from bride and groom natal moon.',
    severity: 'high',
    pariharaTe: 'మిత్ర క్షేత్రమై గురు దృష్టి కలిగినచో దోష నివారణ అగును.',
    pariharaEn: 'Friendly sign placement combined with Jupiter’s direct aspect provides exemption.',
    shastraPramanam: 'పరాశర సంహిత',
  },
  {
    number: 10,
    nameTe: 'అష్టమ లగ్న దోషం',
    nameEn: 'Ashtama Lagna Dosha',
    descriptionTe: 'వధూవరుల జన్మ లగ్నం నుండి లేదా జన్మ రాశి నుండి 8వ రాశిని వివాహ లగ్నంగా పెట్టకూడదు.',
    descriptionEn: 'Selecting the 8th sign from either bride’s or groom’s natal ascendant or Moon sign.',
    severity: 'critical',
    pariharaTe: 'అష్టమ లగ్నాధిపతి మరియు జన్మ లగ్నాధిపతి ఒక్కరే అయినచో (ఉదా: మేష-వృశ్చికం, వృషభ-తుల) దోషం ఉండదు.',
    pariharaEn: 'If the 8th lord is the same as the natal lord (Aries/Scorpio or Taurus/Libra), exemption applies.',
    shastraPramanam: 'ముహూర్త చింతామణి',
  },
  {
    number: 11,
    nameTe: 'విష ఘటికల దోషం',
    nameEn: 'Visha Ghatika / Varjyam',
    descriptionTe: 'నక్షత్రంలో విష ఘడియలు (వర్జ్యం) నడుస్తున్న సమయంలో మాంగల్య ధారణ చేయకూడదు. ఇది అమృతానికి విరుగుడు విషం వంటిది.',
    descriptionEn: 'The poisonous span (Varjyam) within any nakshatra must be totally avoided for tali tying.',
    severity: 'critical',
    pariharaTe: 'వర్జ్యం ముగిసిన పిమ్మట వచ్చు అమృత ఘడియలను మాత్రమే వివాహ ముహూర్తంగా నిర్ణయించాలి.',
    pariharaEn: 'Wait until the Varjyam interval expires; choose subsequent Amrita Ghatis.',
    shastraPramanam: 'గర్గ సంహిత - వర్జ్య వివేచన',
  },
  {
    number: 12,
    nameTe: 'దుర్ముహూర్త దోషం',
    nameEn: 'Durmuhurtha Dosha',
    descriptionTe: 'ప్రతి రోజూ పగలు మరియు రాత్రి సూర్యోదయ సమయాన్ని బట్టి వచ్చే 15 ముహూర్తాలలో దుర్ముహూర్త కాలాలు వివాహానికి పనికిరావు.',
    descriptionEn: 'The daily malefic 48-minute windows governed by inauspicious deities.',
    severity: 'high',
    pariharaTe: 'అభిజిత్ ముహూర్తమును (మధ్యాహ్నం 8వ ముహూర్తం) ఆశ్రయించడం వల్ల దుర్ముహూర్త దోషాలు నశిస్తాయి.',
    pariharaEn: 'Abhijit Muhurtha at solar noon overcomes general durmuhurthams (except on Wednesdays).',
    shastraPramanam: 'వశిష్ఠ సంహిత - ముహూర్త గణితం',
  },
  {
    number: 13,
    nameTe: 'సగ్రహ చంద్ర దోషం',
    nameEn: 'Sagraha Chandra (Moon Conjunction)',
    descriptionTe: 'వివాహ సమయంలో చంద్రుడు పాపగ్రహాలతో (రవి, కుజ, శని, రాహు, కేతు) కలిసి ఉండరాదు.',
    descriptionEn: 'Moon closely conjoined with malefic planets at the time of the wedding ceremony.',
    severity: 'high',
    pariharaTe: 'చంద్రుడు శుభగ్రహాలైన గురు, బుధ, శుక్రులతో సంయోగం లేదా పూర్ణ దృష్టి కలిగి ఉండాలి.',
    pariharaEn: 'Moon conjunct or aspected by benefics eliminates this planetary affliction.',
    shastraPramanam: 'శారంగధర పద్ధతి',
  },
  {
    number: 14,
    nameTe: 'గండాంత దోషం',
    nameEn: 'Gandanta Dosha (Tithi, Nakshatra, Lagna)',
    descriptionTe: 'తిథి సంధి, నక్షత్ర సంధి (రేవతి-అశ్విని, ఆశ్లేష-మఖ, జ్యేష్ఠ-మూల), లగ్న సంధులు (మీన-మేష, కర్కాటక-సింహ, వృశ్చిక-ధనుస్సు) గండాంతాలు. ఇవి మహా దోషాలు.',
    descriptionEn: 'Junction points between water and fire signs in Nakshatra, Tithi, or Ascendant.',
    severity: 'critical',
    pariharaTe: 'గండాంత ఘడియలను (ముందు 2 ఘడియలు, వెనుక 2 ఘడియలు) విడిచిపెట్టి మధ్య భాగంలో ముహూర్తం పెట్టాలి.',
    pariharaEn: 'Discard the 48-minute border span before and after the sign/nakshatra cusp.',
    shastraPramanam: 'పరాశర హోరా శాస్త్రం',
  },
  {
    number: 15,
    nameTe: 'ఏకార్గళ దోషం',
    nameEn: 'Ekargala Dosha',
    descriptionTe: 'విషమ సంఖ్య గల నక్షత్రాలలో సూర్య నక్షత్రం నుండి లెక్కించగా వచ్చే విక్రమ నక్షత్ర వేధ.',
    descriptionEn: 'Special cross-nakshatra affliction measured from Sun nakshatra on odd-count days.',
    severity: 'medium',
    pariharaTe: 'శుక్లపక్షంలో బలమైన గురు దృష్టి లగ్నంపై ఉంటే ఏకార్గళ దోష నివృత్తి కలుగును.',
    pariharaEn: 'Bright fortnight wedding with strong Jupiter aspect dissolves Ekargala.',
    shastraPramanam: 'ముహూర్త మార్తాండ',
  },
  {
    number: 16,
    nameTe: 'శలాకా వేధ దోషం',
    nameEn: 'Shalaka Vedha Dosha',
    descriptionTe: 'శలాకా చక్రంలో ముహూర్త నక్షత్రానికి ఎదురుగా పాపగ్రహాలు వేధించడం వల్ల దాంపత్య సౌఖ్యం భంగమగును.',
    descriptionEn: 'Cross-piercing line aspects by malefics on the Shalaka Chakra chart.',
    severity: 'high',
    pariharaTe: 'శుభగ్రహాలు ప్రతివేధ చేయుట ద్వారా వేధ దోష పరిహారం లభించును.',
    pariharaEn: 'Benefic counter-piercing (Prati-vedha) effectively nullifies Shalaka afflictions.',
    shastraPramanam: 'వశిష్ఠ సంహిత - శలాకా చక్ర నిరూపణ',
  },
  {
    number: 17,
    nameTe: 'సౌర ఉత్పాత దోషం',
    nameEn: 'Saura Utpata (Cosmic Disturbances)',
    descriptionTe: 'గ్రహణం జరిగిన రోజులలో (సూర్య/చంద్ర గ్రహణాలు) మరియు తోకచుక్కలు, భూకంపాలు సంభవించిన వేళలలో వివాహం నిషిద్ధం.',
    descriptionEn: 'Eclipse days, meteors, comets, or major seismic events prohibit marriage rites.',
    severity: 'critical',
    pariharaTe: 'గ్రహణానికి ముందు 7 రోజులు, వెనుక 7 రోజుల కాలం విడిచిపెట్టవలెను.',
    pariharaEn: 'Observe the 7-day exclusion window before and after solar or lunar eclipses.',
    shastraPramanam: 'గర్గ సంహిత - ఉత్పాత ప్రకరణం',
  },
  {
    number: 18,
    nameTe: 'క్రూర సంయుత దోషం',
    nameEn: 'Kroora Samyuta Nakshatra',
    descriptionTe: 'ముహూర్త నక్షత్రంపై పాపగ్రహాల సంచారం లేదా ప్రత్యక్ష సంబంధం ఉండరాదు.',
    descriptionEn: 'Muhurtha nakshatra transited directly by Mars, Saturn, or Rahu.',
    severity: 'high',
    pariharaTe: 'శుభగ్రహ నవాంశ మరియు లగ్నాధిపతి ఉచ్ఛస్థితి దోష తీవ్రతను పోగొట్టును.',
    pariharaEn: 'Exalted Lagna lord and benefic navamsha neutralize kroora association.',
    shastraPramanam: 'శారంగధర పద్ధతి',
  },
  {
    number: 19,
    nameTe: 'అకాల గర్జిత వృష్టి దోషం',
    nameEn: 'Akala Garjita Vrishti (Unseasonal Thunder)',
    descriptionTe: 'ఋతువు కాని కాలంలో ఆకస్మికంగా ఉరుములు, మెరుపులతో కూడిన వర్షం పడినప్పుడు 3 రోజుల వరకు ముహూర్తం పెట్టకూడదు.',
    descriptionEn: 'Unseasonal thunder and storms cause atmospheric disturbances invalidating muhurthas for 3 days.',
    severity: 'medium',
    pariharaTe: 'ఋతు సంబంధిత సహజ వృష్టికి ఈ దోషం వర్తించదు.',
    pariharaEn: 'Does not apply to natural seasonal rainfall; only abnormal unseasonal storms.',
    shastraPramanam: 'ముహూర్త చింతామణి',
  },
  {
    number: 20,
    nameTe: 'మహాపాత దోషం (వ్యతీపాత & వైధృతి)',
    nameEn: 'Mahapata Dosha (Vyatipata & Vaidhriti)',
    descriptionTe: 'రవి, చంద్రుల క్రాంతి సమానత్వ కాలమైన వ్యతీపాత మరియు వైధృతి మహాపాత కాలాలలో శుభకార్యాలు సర్వధా నిషిద్ధం.',
    descriptionEn: 'Equi-declination moments of Sun and Moon (Vyatipata and Vaidhriti) are severely prohibited.',
    severity: 'critical',
    pariharaTe: 'మహాపాత అంత్య కాలం పూర్తయ్యేంత వరకు వేచి చూసి మాత్రమే కార్యం ప్రారంభించాలి.',
    pariharaEn: 'Strictly wait until the Mahapata span terminates completely.',
    shastraPramanam: 'వశిష్ఠ సంహిత - మహాపాత సాధన',
  },
  {
    number: 21,
    nameTe: 'జామిత్ర దోషం & 55వ నవాంశ',
    nameEn: 'Jamitra Dosha & 55th Navamsha',
    descriptionTe: 'ముహూర్త నక్షత్రం నుండి 14వ నక్షత్రం జామిత్ర నక్షత్రం. అలాగే లగ్నం నుండి 55వ నవాంశ దోషపూరితమైనది.',
    descriptionEn: 'The 14th star from Muhurtha nakshatra (Jamitra) and 55th Navamsha are hazardous.',
    severity: 'critical',
    pariharaTe: 'జామిత్ర స్థానంలో చంద్రుడు లేకుండా, పూర్ణ శుభగ్రహ దృష్టి లగ్నంపై ఉంటే దోష నివృత్తి అగును.',
    pariharaEn: 'Ensure Moon avoids Jamitra position; benefic drishti upon ascendant secures safety.',
    shastraPramanam: 'పరాశర హోరా శాస్త్రం & ముహూర్త మార్తాండ',
  },
];

/**
 * Shiva Muhurtha Cycle: 45-minute rotating periods governed by the three Gunas
 * From Shiva Agama & Classical Muhurtha Traditions
 */
export const SHIVA_MUHURTHA_SYSTEM: ShivaMuhurthaSlot[] = [
  {
    index: 1,
    nameTe: 'రుద్ర ముహూర్తం (తమో గుణం)',
    nameEn: 'Rudra Muhurtha (Tamas)',
    guna: 'తామసిక',
    durationMinutes: 45,
    natureTe: 'తీవ్ర స్వభావం, శాంతి కర్మలకు మధ్యమం. ఆధ్యాత్మిక సాధన, శత్రు నివారణ జపాలకు అనుకూలం.',
    natureEn: 'Fierce nature; strictly avoid marriage and joyful domestic ventures. Ideal for deep mantra japa.',
    suitableActivitiesTe: 'మంత్ర జపం, శివార్చన, శత్రు భయ నివారణ, శస్త్రచికిత్స.',
  },
  {
    index: 2,
    nameTe: 'శివ ముహూర్తం (సత్వ గుణం)',
    nameEn: 'Shiva Muhurtha (Sattva)',
    guna: 'సాత్విక',
    durationMinutes: 45,
    natureTe: 'అత్యంత ప్రశాంతమైనది, సర్వ శుభ కార్యసిద్ధి ప్రదం. అమృత సమానమైన కాలం.',
    natureEn: 'Supremely auspicious and peaceful; bestows unhindered success in noble ventures.',
    suitableActivitiesTe: 'వివాహం, గృహ ప్రవేశం, నామకరణం, విద్యాభ్యాసం, ఉపనయనం, నూతన వ్యాపారారంభం.',
  },
  {
    index: 3,
    nameTe: 'ఈశాన ముహూర్తం (రజో గుణం)',
    nameEn: 'Ishana Muhurtha (Rajas)',
    guna: 'రాజసిక',
    durationMinutes: 45,
    natureTe: 'క్రియాశీలక శక్తి ప్రదాత. వ్యాపార, ప్రభుత్వ, అధికారిక పనులకు అత్యుత్తమం.',
    natureEn: 'Dynamic and action-oriented; favorable for official negotiations, trade, and enterprise.',
    suitableActivitiesTe: 'ఉద్యోగంలో చేరుట, వాహన కొనుగోలు, ఒప్పందాలు, యాత్రలు, వాణిజ్యం.',
  },
];

/**
 * Pancha Bhoota Tatwa Kshipra Muhurtha
 * Classical breakdown of time into five elements (Earth, Water, Fire, Air, Ether)
 */
export const PANCHA_BHOOTA_TATWAS: PanchaBhootaTatwaSlot[] = [
  {
    tatwaTe: 'పృథ్వీ తత్త్వం (భూమి)',
    tatwaEn: 'Prithvi Tatwa (Earth)',
    durationMinutes: 6,
    elementNatureTe: 'స్థిర తత్త్వం. శాశ్వతత్వం మరియు దృఢత్వాన్ని ప్రసాదించును.',
    suitableForTe: 'శంకుస్థాపన, గృహ ప్రవేశం, వివాహం, భూమి కొనుగోలు, దీర్ఘకాలిక పెట్టుబడులు.',
    isFavorable: true,
  },
  {
    tatwaTe: 'జల తత్త్వం (నీరు)',
    tatwaEn: 'Jala Tatwa (Water)',
    durationMinutes: 12,
    elementNatureTe: 'వృద్ధి మరియు ప్రశాంతత తత్త్వం. సర్వ శుభ ఫలదాయకం.',
    suitableForTe: 'బోరు వేయుట, బావి తవ్వుట, నూతన వ్యాపారం, అన్నప్రాశన, ప్రయాణం, ఔషధ సేవనం.',
    isFavorable: true,
  },
  {
    tatwaTe: 'తేజో / అగ్ని తత్త్వం (నిప్పు)',
    tatwaEn: 'Agni Tatwa (Fire)',
    durationMinutes: 18,
    elementNatureTe: 'ఉష్ణ, దహన స్వభావం. సాధారణ శుభకార్యాలకు వర్జ్యం.',
    suitableForTe: 'శస్త్రచికిత్స, కర్మాగారాలు, విద్యుత్ పనులు, ఆయుధ సాధన, శత్రు జయం.',
    isFavorable: false,
  },
  {
    tatwaTe: 'వాయు తత్త్వం (గాలి)',
    tatwaEn: 'Vayu Tatwa (Air)',
    durationMinutes: 24,
    elementNatureTe: 'చంచల స్వభావం. శీఘ్ర గమన కార్యాలకు ఉత్తమం.',
    suitableForTe: 'విమాన ప్రయాణాలు, వాహన కొనుగోలు, విదేశీ దరఖాస్తులు, సమాచార మార్పిడి.',
    isFavorable: true,
  },
  {
    tatwaTe: 'ఆకాశ తత్త్వం (శూన్యం/అంతరిక్షం)',
    tatwaEn: 'Akasha Tatwa (Ether)',
    durationMinutes: 30,
    elementNatureTe: 'నిర్గుణ, ఆధ్యాత్మిక తత్త్వం. భౌతిక శుభాలకు వర్జ్యం.',
    suitableForTe: 'ధ్యానం, యోగ సాధన, మోక్ష చింతన, సన్యాస దీక్ష, గురు ఉపదేశం.',
    isFavorable: false,
  },
];

/**
 * 50+ Comprehensive Classical Muhurtha Activities
 * Authentically compiled from Vedic Maharshi compendiums.
 * Zero modern authors or publishers or book page numbers.
 */
export const MUHURTHA_ACTIVITIES: MuhurthaActivityRule[] = [
  // 1. MARRIGE & CONJUGAL LIFE
  {
    id: 'vivaham',
    nameTe: 'వివాహ ముహూర్తం (మాంగల్య ధారణ)',
    nameEn: 'Marriage Muhurtham (Vivaham)',
    category: 'marriage',
    categoryNameTe: 'వివాహం & దాంపత్యం',
    categoryNameEn: 'Marriage & Conjugal Life',
    taglineTe: 'ధర్మ, అర్థ, కామ, మోక్ష చతుర్విధ పురుషార్థ సాధనకు పరమ పవిత్ర వివాహ లగ్నం',
    taglineEn: 'Sacred wedding timing for lifelong conjugal harmony and prosperity',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి'],
    unfavorableTithis: ['పాడ్యమి', 'చవితి', 'షష్ఠి', 'అష్టమి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['ఆదివారం (మిత్రం)', 'సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'మఘ', 'ఉత్తర ఫల్గుని', 'హస్త', 'స్వాతి', 'అనూరాధ', 'ఉత్తరాషాఢ', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'జ్యేష్ఠ', 'మూల', 'పూర్వాషాఢ', 'శతభిషం'],
    favorableLagnas: ['వృషభం', 'మిథునం', 'కన్య', 'తుల', 'ధనుస్సు', 'కుంభం'],
    avoidableLagnas: ['మేషం', 'వృశ్చికం', 'కర్కాటకం (కర్తరి ఉంటే)'],
    prohibitedFactorsTe: [
      'ఏకవింశతి మహా దోషాలు నివారించవలెను',
      'లగ్నానికి 7వ స్థానంలో ఏ గ్రహమూ ఉండరాదు (సప్తమ శుద్ధి)',
      'లగ్నానికి 8వ ఇంట కుజుడు ఉండరాదు (కుజాష్టమ దోషం)',
      'లగ్నానికి 6వ ఇంట శుక్రుడు ఉండరాదు (భృగు షట్కం)',
      'గురు-శుక్రుల మౌఢ్యమి (మూఢమి) కాలంలో వివాహం నిషిద్ధం',
    ],
    prohibitedFactorsEn: [
      '21 Great Marriage Doshas must be evaluated and cleared',
      'The 7th house from the marriage ascendant must be completely vacant',
      'Mars must strictly avoid the 8th house',
      'Venus must not be situated in the 6th house',
      'Prohibited during Jupiter or Venus combust periods (Moodhami)',
    ],
    shastraPramanaSutram: 'వశిష్ఠ సంహిత: "సప్తమే శూన్య గేహే చ త్రికోణే గురు భాస్కరౌ | శుభే లగ్నే ప్రశస్తే చ పాణిగ్రహణ ముచ్యతే ||"',
    shastraSource: 'వశిష్ఠ సంహిత & ముహూర్త చింతామణి',
    sutraMeaningTe: 'లగ్నానికి 7వ స్థానం ఖాళీగా ఉండి, కేంద్ర కోణాలలో గురు శుక్ర గ్రహాలు బలవంతులై ఉన్న శుభ లగ్నంలో చేసిన పాణిగ్రహణం దంపతులకు నూరేళ్ళ సౌభాగ్యాన్ని ప్రసాదిస్తుంది.',
    sutraMeaningEn: 'When the 7th house is vacant and Kendra-Konas are fortified by Jupiter and Venus, the marriage bestows perpetual bliss and longevity.',
    howToChooseTe: [
      'వధూవరుల జన్మ నక్షత్రాల ఆధారంగా తారాబలము (సంపత్, క్షేమ, సాధక, మిత్ర, పరమమిత్ర తారలు) చూసుకోవాలి.',
      'చంద్రబలము పరిశీలించి, వరునికి 1, 6, 8 స్థానాలు పరిహారాలు ఉన్నాయో లేదో గమనించాలి.',
      'లగ్నాష్టమ శుద్ధి తప్పనిసరి. 8వ ఇంట్లో శుభగ్రహం ఉండవచ్చు కానీ పాపగ్రహాలు ఉండరాదు.',
      'రవి, చంద్రుల సంక్రమణం, గ్రహణ దినాలు, విష ఘడియలు విడిచిపెట్టాలి.',
    ],
    howToChooseEn: [
      'Calculate Tara Balam for both bride and groom to ensure favorable stars (Sampat, Kshema, Sadhaka, Mitra, Parama Mitra).',
      'Verify Chandra Balam ensuring the transiting Moon avoids 8th house without benefic cancellation.',
      'Ascendant 8th house purity is mandatory; no malefics allowed in 8th.',
      'Discard solar ingress (Sankramana), eclipses, and Varjyam hours.',
    ],
    whenToPerformTe: [
      'శుక్ల పక్షంలో లేదా కృష్ణ పక్ష పంచమి వరకు వివాహం శ్రేష్టం.',
      'ఉదయం లేదా రాత్రి వేళల్లో స్థిర లగ్నాలు (వృషభం, సింహం, వృశ్చికం, కుంభం) లేదా ద్విస్వభావ లగ్నాలు అనుకూలం.',
      'అభిజిత్ ముహూర్తము మరియు అమృత కాలము విశేష శుభకరం.',
    ],
    whenToPerformEn: [
      'Bright fortnight (Shukla Paksha) or up to Krishna Paksha Panchami.',
      'Fixed ascendants or dual ascendants fortified by benefic aspects.',
      'Abhijit Muhurtha and Amrita Ghati windows bestow superior protection.',
    ],
    exemptionsPariharaluTe: [
      'గోధూళి ముహూర్తం: కొన్ని అనివార్య పరిస్థితులలో సూర్యాస్తమయ సమయంలోని గోధూళి కాలం అనేక చిన్న దోషాలను పోగొడుతుంది.',
      'గురు బల పరిహారం: గురుడు లగ్నంలో గానీ, చతుర్థంలో గానీ, దశమంలో గానీ బలముగా ఉంటే లక్ష దోషాలను హరించును.',
    ],
    exemptionsPariharaluEn: [
      'Godhuli Muhurtha at sunset cancels several minor doshas in emergency cases.',
      'Strong Jupiter in 1st, 4th, or 10th house destroys countless astrological flaws.',
    ],
    seoKeywords: [
      'when good muhurtham for marriage in telugu',
      'how to calculate vivaha muhurtham',
      'astrology horoscope telugu marriage muhurtham',
      'శుభ వివాహ ముహూర్తం ఎలా చూసుకోవాలి',
      'పెళ్లి ముహూర్తం మంచి రోజులు',
      'vivaha lagna shuddhi rules',
    ],
  },
  {
    id: 'dviragamanam',
    nameTe: 'ద్విరాగమనం / నూతన వధూవరుల గృహ ప్రవేశం',
    nameEn: 'Dviragamanam / Bride Entry into In-laws Home',
    category: 'marriage',
    categoryNameTe: 'వివాహం & దాంపత్యం',
    categoryNameEn: 'Marriage & Conjugal Life',
    taglineTe: 'వివాహానంతరం వధువు అత్తవారింట శుభప్రదంగా అడుగుపెట్టు సుముహూర్తం',
    taglineEn: 'Auspicious timing for the bride entering her husband’s home',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి'],
    unfavorableTithis: ['రిక్త తిథులు (చవితి, నవమి, చతుర్దశి)', 'అమావాస్య'],
    favorableVaras: ['సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'ఉత్తర', 'హస్త', 'చిత్త', 'అనూరాధ', 'ఉత్తరాషాఢ', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['వృషభం', 'మిథునం', 'కర్కాటకం', 'తుల', 'ధనుస్సు', 'మీనం'],
    avoidableLagnas: ['మేషం', 'వృశ్చికం'],
    prohibitedFactorsTe: ['శుక్ర మౌఢ్యమి', 'భద్ర కరణం', 'వధువుకు చంద్రబల లోపం'],
    prohibitedFactorsEn: ['Combust Venus', 'Bhadra Vishti', 'Adverse Chandra Balam for the bride'],
    shastraPramanaSutram: 'పరాశర హోరా: "స్థిరే లగ్నే స్థిరాంశే చ సౌమ్యగ్రహ నిరీక్షితే | వధూ ప్రవేశనం కుర్యాత్ పుత్ర పౌత్ర ప్రవర్ధనం ||"',
    shastraSource: 'పరాశర హోరా శాస్త్రం',
    sutraMeaningTe: 'శుభగ్రహ వీక్షణ కలిగిన స్థిర లగ్నంలో నూతన వధువు అత్తవారి గృహంలో అడుగుపెట్టినచో వంశాభివృద్ధి, ఐశ్వర్యం చేకూరును.',
    sutraMeaningEn: 'Entry in a fixed ascendant aspected by benefic planets grants unbroken progeny and domestic wealth.',
    howToChooseTe: ['వధువు తారాబలం మరియు చంద్రబలానికి ప్రథమ ప్రాధాన్యత ఇవ్వాలి.', 'స్థిర లగ్నాన్ని ఎంచుకోవడం ఉత్తమం.'],
    howToChooseEn: ['Prioritize bride’s Tara Balam and Chandra Balam.', 'Prefer fixed ascendants for permanent prosperity.'],
    whenToPerformTe: ['వివాహం జరిగిన 1, 3, 5, 7వ రోజులలో లేదా సరి మాసాలలో శ్రేష్టం.'],
    whenToPerformEn: ['Odd days following the ceremony (1st, 3rd, 5th, 7th) or auspicious even months.'],
    exemptionsPariharaluTe: ['లగ్నాధిపతి ఉచ్ఛలో ఉన్నచో స్వల్ప కాల దోషాలు తొలగును.'],
    exemptionsPariharaluEn: ['Exalted Lagna lord neutralizes minor timing flaws.'],
    seoKeywords: ['when good muhurtham for dviragamanam', 'bride entry home muhurtham telugu', 'ద్విరాగమనం ఎప్పుడు చేయాలి'],
  },
  {
    id: 'garbhadanam',
    nameTe: 'గర్భాధాన ముహూర్తం (నిశేకం)',
    nameEn: 'Garbhadanam / Conception Timing (Nishekam)',
    category: 'samskara',
    categoryNameTe: 'షోడశ సంస్కారాలు',
    categoryNameEn: 'Vedic Samskaras',
    taglineTe: 'సత్సంతాన ప్రాప్తి కొరకు నిర్దేశించిన శాస్త్రీయ పవిత్ర సంగమ ముహూర్తం',
    taglineEn: 'Sacred Vedic timing for conceiving righteous, healthy progeny',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['చవితి', 'షష్ఠి', 'అష్టమి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'మఘ', 'జ్యేష్ఠ', 'మూల'],
    favorableLagnas: ['వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య', 'తుల', 'ధనుస్సు', 'కుంభం'],
    avoidableLagnas: ['వృశ్చికం', 'మేషం'],
    prohibitedFactorsTe: ['ఋతుమతి అయిన మొదటి 4 రాత్రులు నిషిద్ధం', 'గ్రహణ దినాలు', 'శ్రద్ధా దినాలు', 'సంధ్యా కాలం'],
    prohibitedFactorsEn: ['First 4 nights of menstrual cycle prohibited', 'Eclipse days', 'Shraddha days', 'Twilight hours'],
    shastraPramanaSutram: 'భృగు సంహిత: "యుగ్మాసు రాత్రిషు సుతః ప్రసూయతే స్త్రీ సంభవేద యుగ్మాసు | తస్మాత్ సుతార్థీ సంవిశేత్ యుగ్మాసు రాత్రిషు శుభాన్వితః ||"',
    shastraSource: 'భృగు నంది నాడీ & చరక సంహిత',
    sutraMeaningTe: 'ఋతుకాలం నుండి సరి రాత్రులలో (6, 8, 10, 12, 14, 16వ రాత్రులు) సంగమించినచో సులక్షణ పుత్రుడు, బేసి రాత్రులలో సుగుణవతియైన కుమార్తె జన్మించును.',
    sutraMeaningEn: 'Even nights from onset of cycle yield virtuous male progeny; odd nights yield righteous female progeny.',
    howToChooseTe: ['రాత్రి 1వ జాము దాటిన తరువాత (రాత్రి 10 గంటల నుండి 2 గంటల మధ్య) ముహూర్తం శుభప్రదం.', 'గురు శుక్రుల శుభ దృష్టి లగ్నంపై ఉండాలి.'],
    howToChooseEn: ['After the first prahara of night (between 10 PM and 2 AM).', 'Jupiter or Venus aspecting the ascendant.'],
    whenToPerformTe: ['ఋతు స్నానానంతరం 6వ రాత్రి నుండి 16వ రాత్రి వరకు గల శుభ ఘడియలలో.'],
    whenToPerformEn: ['Between the 6th and 16th nights following ritual purificatory bath.'],
    exemptionsPariharaluTe: ['శుభగ్రహ కేంద్ర స్థితి ఉన్నచో తిథి సంబంధిత స్వల్ప దోషాలు నివారించబడును.'],
    exemptionsPariharaluEn: ['Benefics in angles neutralize minor tithi blemishes.'],
    seoKeywords: ['when good muhurtham for garbhadana', 'nishekam muhurtham in telugu', 'సత్సంతాన గర్భాధాన ముహూర్తం'],
  },
  {
    id: 'krtrima_garbhadana',
    nameTe: 'కృత్రిమ గర్భధారణ ముహూర్తం (IVF / IUI)',
    nameEn: 'Assisted Conception Muhurtham (IVF / IUI / Embryo Transfer)',
    category: 'samskara',
    categoryNameTe: 'షోడశ సంస్కారాలు',
    categoryNameEn: 'Vedic Samskaras',
    taglineTe: 'ఆధునిక వైద్య గర్భధారణ ప్రక్రియలకు అనుకూల శుభ గ్రహబల సమయం',
    taglineEn: 'Astrological timing for medical fertility procedures and embryo transfer',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'శుక్ల త్రయోదశి'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['గురువారం (సంతాన కారకుడు)', 'సోమవారం', 'శుక్రవారం', 'బుధవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'హస్త', 'స్వాతి', 'అనూరాధ', 'శ్రవణం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ', 'మూల'],
    favorableLagnas: ['కర్కాటకం (చంద్ర క్షేత్రం)', 'వృషభం', 'ధనుస్సు', 'మీనం'],
    avoidableLagnas: ['వృశ్చికం', 'మేషం'],
    prohibitedFactorsTe: ['చంద్రుడు నీచలో ఉండరాదు', 'లగ్నానికి 5వ ఇంట పాపగ్రహాలు ఉండరాదు', 'గ్రహణ సమయాలు'],
    prohibitedFactorsEn: ['Debilitated Moon prohibited', 'Malefics in 5th house prohibited', 'Eclipse periods'],
    shastraPramanaSutram: 'పరాశర హోరా: "జీవే లగ్నగతే వాపి పంచమే శుభసంయుతే | బీజక్షేత్ర సమృద్ధిశ్చ గర్భవృద్ధిః ప్రజాయతే ||"',
    shastraSource: 'పరాశర హోరా శాస్త్రం & వైద్య విజ్ఞానం',
    sutraMeaningTe: 'గురుడు లగ్నమందు గాని, పంచమమందు గాని శుభగ్రహాలతో కూడి ఉన్నప్పుడు జరిగే గర్భధారణ వైద్య ప్రక్రియలు ఫలించి సంపూర్ణ సంతాన ప్రాప్తి కలుగును.',
    sutraMeaningEn: 'When Jupiter graces the ascendant or 5th house, assisted reproductive procedures succeed with divine protection.',
    howToChooseTe: ['స్త్రీ యొక్క పంచమ స్థానాధిపతి మరియు గురుడు బలముగా ఉన్న రోజును ఎన్నుకోవాలి.', 'చంద్రుడు శుభ రాశిలో ఉన్న సమయం నిర్ణయించాలి.'],
    howToChooseEn: ['Pick a date when the woman’s 5th house lord and Jupiter are strong.', 'Ensure Moon transits an auspicious waxing sign.'],
    whenToPerformTe: ['వైద్యుల అపాయింట్‌మెంట్ వేళలో శుభ హోర (గురు హోర లేదా శుక్ర హోర) వచ్చేలా ప్లాన్ చేసుకోవాలి.'],
    whenToPerformEn: ['Align the clinic appointment window during Jupiter Hora or Venus Hora.'],
    exemptionsPariharaluTe: ['అభిజిత్ ముహూర్తంలో లేదా గురు హోరలో వైద్య ప్రక్రియ చేపట్టినచో దోషములు శాంతించును.'],
    exemptionsPariharaluEn: ['Undergoing transfer during Abhijit Muhurtha or Jupiter Hora pacifies astronomical hurdles.'],
    seoKeywords: ['when good muhurtham for ivf embryo transfer', 'iui muhurtham telugu astrology', 'కృత్రిమ గర్భధారణ ముహూర్తం'],
  },
  {
    id: 'namakaranam',
    nameTe: 'నామకరణ ముహూర్తం (శిశువుకు పేరు పెట్టుట)',
    nameEn: 'Naming Ceremony (Namakaranam)',
    category: 'samskara',
    categoryNameTe: 'షోడశ సంస్కారాలు',
    categoryNameEn: 'Vedic Samskaras',
    taglineTe: 'శిశువు ఆయురారోగ్యాలు, కీర్తి ప్రతిష్ఠల కొరకు ఉచ్ఛారణా శుద్ధి గల నామకరణ సువేళ',
    taglineEn: 'Auspicious naming ceremony for child longevity, radiance, and fame',
    favorableTithis: ['పాడ్యమి కాకుండా ఇతర శుక్లపక్ష తిథులు', 'విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['రిక్త తిథులు (చవితి, నవమి, చతుర్దశి)', 'అమావాస్య'],
    favorableVaras: ['సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'ఉత్తర', 'హస్త', 'స్వాతి', 'అనూరాధ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య', 'తుల', 'ధనుస్సు', 'కుంభం', 'మీనం'],
    avoidableLagnas: ['మేషం', 'వృశ్చికం'],
    prohibitedFactorsTe: ['విష ఘటికలు', 'దుర్ముహూర్తం', 'శిశువు జన్మ నక్షత్రానికి 7వ నక్షత్రం (వధ తార)'],
    prohibitedFactorsEn: ['Varjyam hours', 'Durmuhurtham', '7th star (Naidhana/Vadha tara) from birth star'],
    shastraPramanaSutram: 'వశిష్ఠ సంహిత: "జన్మతో దశమే హ్న్యేవ ద్వాదశే వా శుభే దినే | నామధేయం విధాతవ్యం పూర్వాహ్ణే స్థిర సంయుతే ||"',
    shastraSource: 'వశిష్ఠ సంహిత',
    sutraMeaningTe: 'శిశువు జన్మించిన 11వ రోజున గాని, 12వ రోజున గాని, లేదా 21వ రోజున శుభ తిథి-వార-నక్షత్రాలలో స్థిర లగ్నంలో నామకరణం చేయవలెను.',
    sutraMeaningEn: 'Conduct the naming ceremony on the 11th, 12th, or 21st day following birth during a fixed ascendant in the morning.',
    howToChooseTe: ['శిశువు పుట్టిన నక్షత్ర పాదాన్ని బట్టి శాస్త్రీయ నామాక్షరం నిర్ణయించాలి.', 'శుభ తారలో ముహూర్తం పెట్టాలి.'],
    howToChooseEn: ['Ascertain the Vedic syllabic letter corresponding to birth nakshatra pada.', 'Select a favorable Tara Balam day.'],
    whenToPerformTe: ['జన్మించిన 11, 12, 16, 21వ రోజులలో లేదా 3వ మాసంలో.'],
    whenToPerformEn: ['On the 11th, 12th, 16th, 21st day or 3rd month.'],
    exemptionsPariharaluTe: ['పగటి వేళ అభిజిత్ ముహూర్తంలో చేసినచో విశేషాయుష్షు లభించును.'],
    exemptionsPariharaluEn: ['Midday Abhijit Muhurtha grants exceptional vitality and protection.'],
    seoKeywords: ['how to choose baby naming ceremony muhurtham', 'when good muhurtham for namakaranam', 'నామకరణం మంచి ముహూర్తం'],
  },
  {
    id: 'annaprasana',
    nameTe: 'అన్నప్రాశన ముహూర్తం (మొదటి ఆహారం)',
    nameEn: 'Annaprasana (First Solid Food Feeding)',
    category: 'samskara',
    categoryNameTe: 'షోడశ సంస్కారాలు',
    categoryNameEn: 'Vedic Samskaras',
    taglineTe: 'బిడ్డకు ఆయువు, ఆరోగ్యం, ఉదర పుష్టి కలిగించే ప్రథమ అన్న సమర్పణ సుముహూర్తం',
    taglineEn: 'Timing for the child’s first sacred intake of solid grains and honey',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['పాడ్యమి', 'చవితి', 'షష్ఠి', 'అష్టమి', 'నవమి', 'ద్వాదశి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'శ్రవణం', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'జ్యేష్ఠ', 'మూల'],
    favorableLagnas: ['వృషభం', 'మిథునం', 'కన్య', 'తుల', 'ధనుస్సు', 'మీనం'],
    avoidableLagnas: ['మేషం', 'వృశ్చికం', 'కుంభం'],
    prohibitedFactorsTe: ['లగ్నానికి 10వ స్థానంలో చంద్రుడు ఉండరాదు', 'లగ్నానికి 8వ ఇంట ఏ గ్రహమూ ఉండరాదు'],
    prohibitedFactorsEn: ['Moon should not be placed in 10th house from ascendant', '8th house must be clean'],
    shastraPramanaSutram: 'ముహూర్త చింతామణి: "షష్ఠే మాసి కుమారస్య అన్నప్రాశన ముచ్యతే | స్త్రీణాం పంచమ మాసే వా సప్తమే వా శుభే దివసే ||"',
    shastraSource: 'ముహూర్త చింతామణి & గర్గ సంహిత',
    sutraMeaningTe: 'మగపిల్లవానికి 6వ లేదా 8వ సరి మాసాలలో, ఆడపిల్లలకు 5వ లేదా 7వ బేసి మాసాలలో అన్నప్రాశన చేయుట ఆయురారోగ్యదాయకం.',
    sutraMeaningEn: 'For boys in the 6th or 8th even month; for girls in the 5th or 7th odd month during bright fortnight.',
    howToChooseTe: ['శిశువుకు చంద్రబలము, తారాబలము సరిచూడాలి.', 'శుభగ్రహాలు కేంద్ర, కోణాలలో ఉన్న లగ్నాన్ని ఎంచుకోవాలి.'],
    howToChooseEn: ['Verify infant’s Chandra Balam and Tara Balam.', 'Ensure benefic planets reside in Kendra/Kona houses.'],
    whenToPerformTe: ['పగటి పూట ఉదయం 8 గంటల నుండి మధ్యాహ్నం 12 గంటల లోపు శ్రేష్టం.'],
    whenToPerformEn: ['Morning hours between 8 AM and 12 noon are most auspicious.'],
    exemptionsPariharaluTe: ['గురు లేదా శుక్ర హోరలలో తినిపించినచో జీర్ణశక్తి, జ్ఞాపకశక్తి పెంపొందును.'],
    exemptionsPariharaluEn: ['Feeding during Jupiter or Venus Hora promotes robust digestive vitality and intelligence.'],
    seoKeywords: ['when good muhurtham for annaprasana in telugu', 'first feeding baby muhurtham', 'అన్నప్రాశన మంచి రోజులు'],
  },
  {
    id: 'aksharabhyasam',
    nameTe: 'అక్షరాభ్యాసం / విద్యా ప్రవేశం',
    nameEn: 'Aksharabhyasam (Commencement of Learning & Writing)',
    category: 'education',
    categoryNameTe: 'విద్యా & జ్ఞానారంభం',
    categoryNameEn: 'Education & Intellect',
    taglineTe: 'శారదాంబ అనుగ్రహంతో అపార విద్యా ప్రావీణ్యం, సరస్వతీ కటాక్షం పొందు వేళ',
    taglineEn: 'Initiating writing and alphabets under Goddess Saraswati’s benign grace',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి (శ్రీ పంచమి)', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['గురువారం (బృహస్పతి దినం)', 'బుధవారం (బుధ జ్ఞాన కారకుడు)', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం', 'ఆదివారం'],
    favorableNakshatras: ['పునర్వసు', 'పుష్యమి', 'హస్త', 'చిత్త', 'స్వాతి', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'రేవతి', 'రోహిణి', 'అశ్విని'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['మిథునం (బుధ క్షేత్రం)', 'కన్య', 'ధనుస్సు', 'మీనం', 'వృషభం'],
    avoidableLagnas: ['వృశ్చికం', 'మేషం'],
    prohibitedFactorsTe: ['బుధ మౌఢ్యమి', 'గురు మౌఢ్యమి', 'భద్ర కరణం'],
    prohibitedFactorsEn: ['Combust Mercury', 'Combust Jupiter', 'Vishti Karana'],
    shastraPramanaSutram: 'పరాశర హోరా: "ప్రాప్తే తు పంచమే వర్షే హ్యక్షరాణాం పరిగ్రహః | బుధే జీవే చ శుక్రే వా సౌమ్యలగ్నే ప్రశస్యతే ||"',
    shastraSource: 'పరాశర హోరా శాస్త్రం & వశిష్ఠ సంహిత',
    sutraMeaningTe: 'ఐదవ ఏట ప్రవేశించగానే బుధ, గురు, శుక్ర వారాలలో శుభ లగ్నమందు అక్షరాభ్యాసం చేసినచో బాలబాలికలు సర్వ శాస్త్ర పారంగతులగుదురు.',
    sutraMeaningEn: 'Initiating learning in the 5th year under Mercury, Jupiter, or Venus ascendant creates master scholars.',
    howToChooseTe: ['సరస్వతీ నక్షత్రమైన శ్రవణం లేదా హస్త, పుష్యమి నక్షత్రాలను ఎంపిక చేయాలి.', 'లగ్నంలో బుధుడు లేదా గురుడు బలంగా ఉండాలి.'],
    howToChooseEn: ['Select learning-friendly stars like Shravana, Hasta, or Pushyami.', 'Ensure Mercury or Jupiter is strongly posited in Lagna.'],
    whenToPerformTe: ['విజయదశమి, వసంత పంచమి (మాఘ శుద్ధ పంచమి), లేదా గురు పౌర్ణమి దినాలు అత్యంత శుభప్రదం.'],
    whenToPerformEn: ['Vijayadashami, Vasant Panchami, or Guru Purnima are paramount auspicious days.'],
    exemptionsPariharaluTe: ['విజయదశమి నాడు ఎటువంటి ముహూర్త దోషాలు వర్తించవు. సర్వతోముఖ శుభం.'],
    exemptionsPariharaluEn: ['Vijayadashami is universally exempt from astrological blemishes for starting education.'],
    seoKeywords: ['how to choose aksharabhyasam muhurtham', 'when good muhurtham for aksharabhyasam', 'అక్షరాభ్యాసం మంచి ముహూర్తం'],
  },
  {
    id: 'upanayanam',
    nameTe: 'ఉపనయన ముహూర్తం (బ్రహ్మోపదేశం)',
    nameEn: 'Upanayanam (Sacred Thread Ceremony & Gayatri Upadesha)',
    category: 'samskara',
    categoryNameTe: 'షోడశ సంస్కారాలు',
    categoryNameEn: 'Vedic Samskaras',
    taglineTe: 'ద్విజత్వం పొంది గాయత్రీ మహామంత్ర సాధనకు అర్హత కల్పించే పవిత్ర సంస్కారం',
    taglineEn: 'Sacred thread investiture for Vedic wisdom, intellect, and spiritual radiance',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి'],
    unfavorableTithis: ['పాడ్యమి', 'చవితి', 'షష్ఠి', 'అష్టమి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['గురువారం (దేవగురువు)', 'శుక్రవారం', 'బుధవారం', 'ఆదివారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'జ్యేష్ఠ', 'మూల'],
    favorableLagnas: ['ధనుస్సు', 'మీనం', 'మేషం (సూర్య క్షేత్ర దృష్టి)', 'సింహం', 'కన్య'],
    avoidableLagnas: ['వృశ్చికం', 'కుంభం'],
    prohibitedFactorsTe: ['ఉత్తరాయణంలో మాత్రమే చేయవలెను (దక్షిణాయనం వర్జ్యం)', 'గురు-శుక్ర మౌఢ్యమి', 'సూర్యుడు మీనంలో ఉన్నప్పుడు (మీన రవి) వర్జ్యం'],
    prohibitedFactorsEn: ['Must be in Uttarayana (Dakshinayana strictly prohibited)', 'Combust Jupiter/Venus', 'Sun in Pisces (Meena Ravi) prohibited'],
    shastraPramanaSutram: 'శారంగధర పద్ధతి: "ఉత్తరాయణగే సూర్యే శుక్లపక్షే శుభే దివసే | గురుబలే సమాయుక్తే బ్రహ్మోపదేశః ప్రశస్యతే ||"',
    shastraSource: 'శారంగధర పద్ధతి & వశిష్ఠ సంహిత',
    sutraMeaningTe: 'సూర్యుడు ఉత్తరాయణంలో ఉండి, శుక్లపక్షంలో బటువునకు గురుబలము ఉన్నప్పుడే గాయత్రీ బ్రహ్మోపదేశం ఉత్తమ ఫలితాన్నిచ్చును.',
    sutraMeaningEn: 'Gayatri Upadesha must strictly take place during Uttarayana in bright fortnight when the boy has strong Jupiter transit support.',
    howToChooseTe: ['బటువునకు గురుబలం (జన్మ రాశి నుండి గురుడు 2, 5, 7, 9, 11 స్థానాల్లో) తప్పనిసరిగా ఉండాలి.', 'లగ్నానికి 8వ ఇల్లు శుద్ధంగా ఉండాలి.'],
    howToChooseEn: ['Verify that the boy has Jupiter transit support (2nd, 5th, 7th, 9th, 11th from natal Moon).', '8th house must be clean.'],
    whenToPerformTe: ['మాఘ, ఫాల్గుణ, చైత్ర, వైశాఖ, జ్యేష్ఠ మాసాలలో ఉత్తరాయణ కాలంలో.'],
    whenToPerformEn: ['During solar months of Magha, Phalguna, Chaitra, Vaisakha, and Jyeshtha in Uttarayana.'],
    exemptionsPariharaluTe: ['గురుడు స్వక్షేత్రంలో లేదా ఉచ్ఛలో ఉన్నచో దక్షిణాయన నిషేధానికి కొన్ని ప్రత్యేక శాంతి పరిహారాలు కలవు.'],
    exemptionsPariharaluEn: ['Exalted Jupiter allows rare scriptural exemptions with special Shanti homas.'],
    seoKeywords: ['when good muhurtham for upanayanam', 'sacred thread ceremony muhurtham telugu', 'ఉపనయనం ఎప్పుడు చేయాలి'],
  },
  {
    id: 'vidyarambham_technical',
    nameTe: 'సాంకేతిక విద్యారంభం (కంప్యూటర్స్, ఇంజనీరింగ్, సైన్స్)',
    nameEn: 'Technical & Engineering Studies Commencement',
    category: 'education',
    categoryNameTe: 'విద్యా & జ్ఞానారంభం',
    categoryNameEn: 'Education & Intellect',
    taglineTe: 'సాఫ్ట్‌వేర్, డేటా సైన్స్, ఎలక్ట్రానిక్స్, ఇంజనీరింగ్ రంగాలలో అత్యున్నత రాణింపు కొరకు',
    taglineEn: 'Timing for commencing software coding, AI studies, mechanical, and civil engineering',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['బుధవారం (మేధా కారకుడు)', 'శనివారం (యంత్ర కారకుడు)', 'గురువారం'],
    unfavorableVaras: ['మంగళవారం (అపరిపక్వ అధ్యయనం)'],
    favorableNakshatras: ['చిత్త (విశ్వకర్మ నక్షత్రం)', 'హస్త', 'పుష్యమి', 'ధనిష్ఠ', 'శతభిషం', 'అశ్వని', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష'],
    favorableLagnas: ['మిథునం', 'కన్య', 'కుంభం (పరిశోధనా రాశి)', 'మకరం'],
    avoidableLagnas: ['కర్కాటకం', 'మీనం'],
    prohibitedFactorsTe: ['బుధ మౌఢ్యమి', 'శని వక్రత్వ తీవ్రత'],
    prohibitedFactorsEn: ['Combust Mercury', 'Afflicted Saturn'],
    shastraPramanaSutram: 'ముహూర్త మార్తాండ: "శిల్పశాస్త్ర ప్రవీణత్వే త్వష్టా నక్షత్ర ముత్తమం | బుధ లగ్నే సమారబ్ధం సర్వ యంత్ర ప్రసాధకం ||"',
    shastraSource: 'ముహూర్త మార్తాండ',
    sutraMeaningTe: 'విశ్వకర్మకు అధిపతియైన చిత్త నక్షత్రంలో లేదా బుధ లగ్నంలో ప్రారంభించిన సాంకేతిక విద్య సర్వ యంత్ర పరిజ్ఞానాన్ని, అద్భుత మేధస్సును ఇచ్చును.',
    sutraMeaningEn: 'Studies started in Chitra star (Vishwakarma) or Mercury ascendant grant mastery in mechanical, technical, and computational sciences.',
    howToChooseTe: ['బుధుడు మరియు శని గ్రహాల బలం చూడాలి (సాఫ్ట్‌వేర్, యంత్ర రంగాలకు).', '3, 6, 10, 11 స్థానాలలో పాపగ్రహాలు ఉన్నా మంచిదే.'],
    howToChooseEn: ['Examine Mercury and Saturn strength for software and electronics.', 'Malefics in 3, 6, 10, 11 boost technical mastery.'],
    whenToPerformTe: ['బుధ హోర లేదా శని హోరలో ప్రారంభించడం శ్రేష్టం.'],
    whenToPerformEn: ['Commence study during Mercury or Saturn Hora.'],
    exemptionsPariharaluTe: ['శని స్వక్షేత్రంలో ఉన్నప్పుడు శనివారం సాంకేతిక విద్యకు పరమ శుభప్రదం.'],
    exemptionsPariharaluEn: ['Saturn in own house makes Saturday exceptionally auspicious for engineering.'],
    seoKeywords: ['how to start technical course muhurtham', 'engineering studies muhurtham telugu', 'సాంకేతిక విద్యా ముహూర్తం'],
  },
  {
    id: 'vidyarambham_medical',
    nameTe: 'వైద్య విద్యారంభం (మెడిసిన్, ఆయుర్వేదం, సర్జరీ)',
    nameEn: 'Medical & Healthcare Studies Commencement',
    category: 'education',
    categoryNameTe: 'విద్యా & జ్ఞానారంభం',
    categoryNameEn: 'Education & Intellect',
    taglineTe: 'ధన్వంతరి అనుగ్రహంతో రోగ నివారణ దక్షత, శస్త్రచికిత్సా నైపుణ్య సాధన',
    taglineEn: 'Timing for medical college, Ayurveda study, and surgery specialization',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి'],
    unfavorableTithis: ['రిక్త తిథులు', 'అమావాస్య'],
    favorableVaras: ['ఆదివారం (సూర్యుడు ధన్వంతరి)', 'మంగళవారం (శస్త్రచికిత్స)', 'గురువారం'],
    unfavorableVaras: ['శనివారం'],
    favorableNakshatras: ['అశ్విని (అశ్విని దేవతలు)', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'హస్త', 'మూల (ఓషధీ నక్షత్రం)', 'శ్రవణం', 'శతభిషం'],
    unfavorableNakshatras: ['భరణి', 'జ్యేష్ఠ'],
    favorableLagnas: ['సింహం (సూర్య క్షేత్రం)', 'ధనుస్సు', 'మేషం', 'వృశ్చికం (సర్జరీకి)'],
    avoidableLagnas: ['తుల', 'వృషభం'],
    prohibitedFactorsTe: ['సూర్య గ్రహణ దోషం', 'చంద్ర బలహీనత'],
    prohibitedFactorsEn: ['Solar eclipse blemish', 'Debilitated Moon'],
    shastraPramanaSutram: 'చరక సంహిత: "ఆశ్వినే వైద్య విద్యారంభః సర్వ రోగహరో భవేత్ | ధన్వంతరి సమో జ్ఞాతా ప్రాణదాతా న సంశయః ||"',
    shastraSource: 'చరక సంహిత & వశిష్ఠ సంహిత',
    sutraMeaningTe: 'అశ్విని దేవతల నక్షత్రమైన అశ్వినిలో వైద్య విద్యను ప్రారంభించిన విద్యార్థి ధన్వంతరి సమానుడై ప్రాణదాతగా ఖ్యాతి గడించును.',
    sutraMeaningEn: 'Starting medical learning under Ashwini constellation produces doctors as revered as Lord Dhanvantari.',
    howToChooseTe: ['సూర్యుడు మరియు కుజుని స్థానాలు బలవత్తరంగా ఉన్న లగ్నాన్ని చూడాలి.'],
    howToChooseEn: ['Ensure Sun and Mars are strongly placed in kendra/trikona.'],
    whenToPerformTe: ['సూర్య హోరలో లేదా అమృత ఘడియలలో ప్రారంభించాలి.'],
    whenToPerformEn: ['Initiate during Surya Hora or Amrita Ghati.'],
    exemptionsPariharaluTe: ['మంగళవారం సాధారణ విద్యకు నిషిద్ధమైనా శస్త్రచికిత్సా విద్యకు ప్రశస్తం.'],
    exemptionsPariharaluEn: ['Tuesday, though generally avoided for education, is highly praised for surgical studies.'],
    seoKeywords: ['when good muhurtham for medical studies', 'ayurveda doctor course start muhurtham', 'వైద్య విద్యా ముహూర్తం'],
  },
  {
    id: 'vidyarambham_arts',
    nameTe: 'లలిత కళలు, సంగీతం, నాట్యం & సినిమా రంగ ప్రవేశం',
    nameEn: 'Fine Arts, Music, Dance & Film Industry Debut',
    category: 'education',
    categoryNameTe: 'విద్యా & జ్ఞానారంభం',
    categoryNameEn: 'Education & Intellect',
    taglineTe: 'నాట్యరాజ శివుడు, శుక్రాచార్యుల కృపతో కళా రంగంలో అద్భుత ప్రజాదరణ, ఖ్యాతి',
    taglineEn: 'Timing for learning music, classical dance, acting, and cinema shooting launch',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'షష్ఠి', 'దశమి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['శుక్రవారం (శుక్ర కళాధిపతి)', 'సోమవారం', 'బుధవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పుష్యమి', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'రేవతి', 'శతభిషం'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['వృషభం (శుక్ర క్షేత్రం)', 'తుల', 'మిథునం', 'కర్కాటకం', 'మీనం (శుక్రుని ఉచ్ఛ రాశి)'],
    avoidableLagnas: ['వృశ్చికం', 'మేషం'],
    prohibitedFactorsTe: ['శుక్ర మౌఢ్యమి', 'లగ్నంలో కేతువు ఉండటం'],
    prohibitedFactorsEn: ['Combust Venus', 'Ketu in Lagna'],
    shastraPramanaSutram: 'నాట్య శాస్త్రం & భృగు సంహిత: "శుక్రేణ సహితే లగ్నే గాంధర్వ విద్యా సిధ్యతి | సంగీత నృత్య నాట్యానాం విజయీ భవతి ధ్రువమ్ ||"',
    shastraSource: 'భృగు నంది నాడీ & భరత నాట్య శాస్త్రం',
    sutraMeaningTe: 'శుక్రుడు లగ్నంలో గాని, దశమంలో గాని బలముగా ఉన్నప్పుడు ప్రారంభించిన సంగీత, నాట్య, సినిమా కళలు విశ్వవిఖ్యాత ఖ్యాతినిస్తాయి.',
    sutraMeaningEn: 'Commencing performing arts when Venus is fortified in ascendant or 10th house guarantees artistic supremacy and celebrity.',
    howToChooseTe: ['శుక్రుడు ఉచ్ఛలో లేదా స్వక్షేత్రంలో ఉన్న ముహూర్తం ఎన్నుకోవాలి.'],
    howToChooseEn: ['Choose muhurtham when Venus is exalted in Pisces or in Taurus/Libra.'],
    whenToPerformTe: ['శుక్ర హోరలో లేదా చంద్ర హోరలో.'],
    whenToPerformEn: ['During Venus or Moon Hora.'],
    exemptionsPariharaluTe: ['వసంత ఋతువు లేదా శరత్ పూర్ణిమ దినాలలో కళారంభం దోష రహితం.'],
    exemptionsPariharaluEn: ['Commencing on Sharad Purnima eliminates minor planetary afflictions.'],
    seoKeywords: ['film shooting launch muhurtham in telugu', 'when good muhurtham for music dance learning', 'సినిమా ఓపెనింగ్ ముహూర్తం'],
  },
  {
    id: 'shanku_sthapana',
    nameTe: 'శంకుస్థాపన / పునాది రాయి వేయుట',
    nameEn: 'Foundation Stone Laying (Shanku Sthapana)',
    category: 'construction',
    categoryNameTe: 'గృహ & వాస్తు నిర్మాణం',
    categoryNameEn: 'House & Architecture (Vastu)',
    taglineTe: 'వాస్తు పురుషుని ఆశీస్సులతో భవనం కలకాలం నిలిచి సిరిసంపదలు వర్ధిల్లే వేళ',
    taglineEn: 'Laying the foundation stone with Vastu Purusha alignment for eternal prosperity',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['పాడ్యమి', 'చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'ఉత్తరాషాఢ', 'ధనిష్ఠ', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'మఘ', 'జ్యేష్ఠ', 'మూల'],
    favorableLagnas: ['వృషభం (స్థిర)', 'సింహం (స్థిర)', 'వృశ్చికం (స్థిర)', 'కుంభం (స్థిర)'],
    avoidableLagnas: ['మేషం', 'మిథునం', 'కర్కాటకం (చర లగ్నాలు నిర్మాణాత్మక స్థిరత్వాన్ని ఇవ్వవు)'],
    prohibitedFactorsTe: ['వాస్తు పురుషుడు నిద్రించు సమయం (వాస్తు నిద్ర)', 'కుజాష్టమం', 'రవి సంక్రాంతి దోషం'],
    prohibitedFactorsEn: ['Vastu Purusha sleeping periods', 'Mars in 8th house', 'Solar ingress days'],
    shastraPramanaSutram: 'వశిష్ఠ సంహిత: "స్థిరే లగ్నే స్థిరాంశే చ స్థిరగ్రహ నిరీక్షితే | వాస్తు పూజాం విధాయాథ కుర్యాత్ శంకు ప్రతిష్ఠితమ్ ||"',
    shastraSource: 'వశిష్ఠ సంహిత & ముహూర్త చింతామణి',
    sutraMeaningTe: 'స్థిర లగ్నంలో, స్థిర నవాంశలో శంకుస్థాపన చేసినచో ఆ గృహము తరతరాలు దృఢంగా నిలిచి గృహ యజమానికి సుఖసంతోషాలను ఇచ్చును.',
    sutraMeaningEn: 'Laying the foundation in a fixed sign and fixed navamsha ensures structural endurance across generations.',
    howToChooseTe: ['ఈశాన్య మూల నుండి పునాది ప్రారంభించాలి.', 'స్థిర లగ్నాన్ని (వృషభ, సింహ, కుంభ లగ్నాలు) తప్పక ఎన్నుకోవాలి.'],
    howToChooseEn: ['Commence excavation from the northeast corner.', 'Strictly choose fixed signs (Taurus, Leo, Aquarius).'],
    whenToPerformTe: ['సూర్యోదయానంతరం మొదటి 3 గంటలలో పృథ్వీ తత్త్వ సమయంలో.'],
    whenToPerformEn: ['First 3 hours after sunrise during Prithvi Tatwa.'],
    exemptionsPariharaluTe: ['గురుడు లగ్నంలో ఉన్నచో వాస్తు సంబంధిత అనేక దోషములు శాంతించును.'],
    exemptionsPariharaluEn: ['Jupiter in ascendant pacifies architectural and directional faults.'],
    seoKeywords: ['when good muhurtham for shanku sthapana', 'house foundation stone laying muhurtham telugu', 'శంకుస్థాపన ముహూర్తం'],
  },
  {
    id: 'dvarabandham',
    nameTe: 'ద్వారబంధం ఎత్తుట (సింహద్వార స్థాపన)',
    nameEn: 'Main Door Frame Fixing (Simha Dvaram)',
    category: 'construction',
    categoryNameTe: 'గృహ & వాస్తు నిర్మాణం',
    categoryNameEn: 'House & Architecture (Vastu)',
    taglineTe: 'గృహంలోనికి లక్ష్మీ ప్రవేశం జరిగే ప్రధాన సింహద్వార స్థాపన ముహూర్తం',
    taglineEn: 'Erecting the main entrance frame to welcome auspicious cosmic energies',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['రిక్త తిథులు', 'అమావాస్య'],
    favorableVaras: ['గురువారం', 'శుక్రవారం', 'బుధవారం', 'సోమవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'ఉత్తర', 'హస్త', 'చిత్త', 'అనూరాధ', 'ఉత్తరాషాఢ', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['వృషభం', 'సింహం', 'తుల', 'కుంభం'],
    avoidableLagnas: ['చర లగ్నాలు (మేష, కర్కాటక, మకర)'],
    prohibitedFactorsTe: ['రాహు కాలం', 'యమగండం', 'ద్వార వేధ'],
    prohibitedFactorsEn: ['Rahu Kalam', 'Yamagandam', 'Dwara Vedha'],
    shastraPramanaSutram: 'విశ్వకర్మ ప్రకాశిక: "సింహద్వార ప్రతిష్ఠాయాం సర్వసంపత్ ప్రజాయతే | స్థిరే లగ్నే శుభే కాలే నరః శ్రేయః సమశ్నుతే ||"',
    shastraSource: 'విశ్వకర్మ ప్రకాశిక & గర్గ సంహిత',
    sutraMeaningTe: 'సింహద్వారమును స్థిర లగ్నంలో ప్రతిష్ఠించినచో గృహస్తునికి సర్వ సంపదలు చేకూరి శ్రేయస్సు కలుగును.',
    sutraMeaningEn: 'Installing the main doorframe during a fixed ascendant invites eternal prosperity and well-being.',
    howToChooseTe: ['శుభగ్రహ దృష్టి ఉన్న స్థిర లగ్నాన్ని నిర్ణయించాలి.'],
    howToChooseEn: ['Ensure fixed ascendant with benefic aspects.'],
    whenToPerformTe: ['ఉదయం పూట శుభ హోరలో.'],
    whenToPerformEn: ['Morning hours during Shubha Hora.'],
    exemptionsPariharaluTe: ['మహాలక్ష్మీ పూజ చేసి ద్వారబంధానికి కుంకుమ తిలకం దిద్దిన శుభం కలుగును.'],
    exemptionsPariharaluEn: ['Ritual Lakshmi puja and vermilion consecration pacify minor flaws.'],
    seoKeywords: ['main door fixing muhurtham in telugu', 'when good muhurtham for simha dwaram', 'ద్వారబంధం ముహూర్తం'],
  },
  {
    id: 'gruha_pravesham',
    nameTe: 'నూతన గృహ ప్రవేశ ముహూర్తం',
    nameEn: 'Housewarming Ceremony (Gruha Pravesham)',
    category: 'construction',
    categoryNameTe: 'గృహ & వాస్తు నిర్మాణం',
    categoryNameEn: 'House & Architecture (Vastu)',
    taglineTe: 'నూతన నివాసంలో అష్టైశ్వర్యాలు, ఆయురారోగ్యాలు నిండి ఉండటానికి పరమ పవిత్ర ప్రవేశం',
    taglineEn: 'Sacred timing for stepping into a newly constructed home with family and cow',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['పాడ్యమి', 'చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'మఘ', 'జ్యేష్ఠ', 'మూల'],
    favorableLagnas: ['వృషభం (స్థిర)', 'సింహం', 'వృశ్చికం (సూర్య/గురు బలం ఉంటే)', 'కుంభం'],
    avoidableLagnas: ['చర లగ్నాలు'],
    prohibitedFactorsTe: ['గురు-శుక్ర మౌఢ్యమి', 'భాద్రపద, కార్తిక శూన్య మాసాలు', 'లగ్నానికి 8వ ఇంట శని లేదా కుజుడు'],
    prohibitedFactorsEn: ['Combust Jupiter/Venus', 'Sunya Masa periods', 'Mars or Saturn in 8th house'],
    shastraPramanaSutram: 'వశిష్ఠ సంహిత: "మాఘే వా ఫాల్గుణే వాపి వైశాఖే జ్యేష్ఠకే తథా | గృహ ప్రవేశనం కుర్యాత్ సర్వ సంపత్ సమన్వితః ||"',
    shastraSource: 'వశిష్ఠ సంహిత & ముహూర్త మార్తాండ',
    sutraMeaningTe: 'మాఘ, ఫాల్గుణ, వైశాఖ, జ్యేష్ఠ మాసాలలో స్థిర లగ్నమందు గృహ ప్రవేశం చేసిన యజమాని అష్టైశ్వర్యాలతో తులతూగును.',
    sutraMeaningEn: 'Entering in auspicious solar months during fixed ascendants fills the house with wealth and joy.',
    howToChooseTe: ['యజమాని మరియు యజమానురాలి తారాబలము, చంద్రబలము చూడాలి.', 'గోవుతో కూడిన ప్రవేశం ఉత్తమం.'],
    howToChooseEn: ['Evaluate Tara Balam and Chandra Balam for both husband and wife.', 'Entering along with a sacred cow is supreme.'],
    whenToPerformTe: ['ఉషఃకాలంలో లేదా బ్రహ్మ ముహూర్తంలో, లేదా ఉదయం అభిజిత్ ముహూర్తంలో.'],
    whenToPerformEn: ['During Brahma Muhurtha, dawn twilight, or Abhijit window.'],
    exemptionsPariharaluTe: ['వాస్తు శాంతి, గణపతి హోమం నిర్వర్తించినచో వాస్తు దోషాలు పటాపంచలవుతాయి.'],
    exemptionsPariharaluEn: ['Conducting Ganapati and Vastu Shanti homa clears land and structural afflictions.'],
    seoKeywords: ['when good muhurtham for house warming in telugu', 'how to calculate gruha pravesham muhurtham', 'నూతన గృహ ప్రవేశ ముహూర్తం'],
  },
  {
    id: 'rented_house_entry',
    nameTe: 'అద్దె ఇల్లు ప్రవేశం (అపూర్వ / సపూర్వ గృహ ప్రవేశం)',
    nameEn: 'Rented House Entry Muhurtham',
    category: 'construction',
    categoryNameTe: 'గృహ & వాస్తు నిర్మాణం',
    categoryNameEn: 'House & Architecture (Vastu)',
    taglineTe: 'అద్దె ఇంట్లో నివాసం ఉన్నంత కాలం శాంతి, ధనాభివృద్ధి చేకూరే సుముహూర్తం',
    taglineEn: 'Timing for moving into a rented accommodation for harmony and growth',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['సోమవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'శ్రవణం', 'శతభిషం', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['వృషభం', 'మిథునం', 'తుల', 'ధనుస్సు', 'కుంభం', 'మీనం'],
    avoidableLagnas: ['మేషం', 'వృశ్చికం'],
    prohibitedFactorsTe: ['రాహు కాలం', 'యమగండం', 'రిక్త తిథి'],
    prohibitedFactorsEn: ['Rahu Kalam', 'Yamagandam', 'Rikta Tithi'],
    shastraPramanaSutram: 'ముహూర్త చింతామణి: "ప్రవాసే చాన్వ గృహే ప్రవేశే సౌమ్యగ్రహోదయః | శుభకృత్ సుఖదం చైవ నివాసినాం సమృద్ధిదమ్ ||"',
    shastraSource: 'ముహూర్త చింతామణి',
    sutraMeaningTe: 'అద్దె గృహ ప్రవేశానికి శుభగ్రహ లగ్నం మరియు తారాబలం ఉన్న వేళ పాలు పొంగించి పూజ చేసినచో సకల సుఖాలు కలుగును.',
    sutraMeaningEn: 'Moving into rented premises under benefic ascendant with boiling milk ritual secures peace and prosperity.',
    howToChooseTe: ['యజమాని నామ నక్షత్రానికి తారాబలం బాగుండాలి.', 'పాలు పొంగించడానికి శుభ హోర ఎన్నుకోవాలి.'],
    howToChooseEn: ['Ensure positive Tara Balam for the breadwinner.', 'Choose a Shubha Hora for boiling auspicious milk.'],
    whenToPerformTe: ['ఉదయం సూర్యోదయ వేళ లేదా ప్రదోష వేళ.'],
    whenToPerformEn: ['Early morning hours or auspicious twilight.'],
    exemptionsPariharaluTe: ['సత్యనారాయణ వ్రతం చేయడం వలన సమస్త గృహ దోషాలు పరిహారమగును.'],
    exemptionsPariharaluEn: ['Performing Satyanarayana Swamy Vratam cancels past occupancy faults.'],
    seoKeywords: ['when good muhurtham for rented house entry', 'rented house shifting muhurtham telugu', 'అద్దె ఇల్లు ప్రవేశ ముహూర్తం'],
  },
  {
    id: 'borewell_kuparambham',
    nameTe: 'బావి తవ్వుట / బోరు వేయుట (కూపారంభం)',
    nameEn: 'Borewell Drilling & Well Digging (Kuparambham)',
    category: 'construction',
    categoryNameTe: 'గృహ & వాస్తు నిర్మాణం',
    categoryNameEn: 'House & Architecture (Vastu)',
    taglineTe: 'గంగమ్మ అనుగ్రహంతో పుష్కలమైన జల సమృద్ధి, తియ్యని నీటి ఊట సిద్ధించే వేళ',
    taglineEn: 'Timing for groundwater drilling and well digging for abundant sweet water',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['పాడ్యమి', 'చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['సోమవారం (చంద్రుడు జలాధిపతి)', 'బుధవారం', 'గురువారం', 'శుక్రవారం (శుక్రుడు జల గ్రహం)'],
    unfavorableVaras: ['మంగళవారం (అగ్ని కారకుడు)', 'ఆదివారం (సూర్యుడు జల శోషకుడు)'],
    favorableNakshatras: ['రోహిణి', 'ఉత్తర', 'హస్త', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం (వరుణ నక్షత్రం)', 'ఉత్తరాభాద్ర', 'రేవతి', 'మృగశిర', 'పుష్యమి'],
    unfavorableNakshatras: ['కృత్తిక', 'భరణి', 'ఆరుద్ర', 'ఆశ్లేష', 'మఘ'],
    favorableLagnas: ['కర్కాటకం (జల రాశి)', 'వృశ్చికం (జల రాశి)', 'మీనం (జల రాశి)', 'వృషభం', 'తుల'],
    avoidableLagnas: ['మేషం (అగ్ని రాశి)', 'సింహం (అగ్ని రాశి)', 'ధనుస్సు (అగ్ని రాశి)'],
    prohibitedFactorsTe: ['అగ్ని తత్త్వ వేళలు', 'కుజుడు లగ్నంలో ఉండటం', 'సూర్యుడు జల స్థానాలలో ఉండటం'],
    prohibitedFactorsEn: ['Agni Tatwa intervals', 'Mars in Lagna', 'Sun drying water prospects'],
    shastraPramanaSutram: 'వరాహమిహిర బృహత్సంహిత: "జలరాశౌ జలే లగ్నే జలగ్రహ నిరీక్షితే | కూపారంభే కృతే తోయం స్వాదు భవతి భూరి చ ||"',
    shastraSource: 'బృహత్సంహిత & వశిష్ఠ సంహిత',
    sutraMeaningTe: 'జల రాశులైన కర్కాటక, వృశ్చిక, మీన లగ్నాలలో, జలగ్రహాలైన చంద్ర శుక్రుల వీక్షణ కలిగినప్పుడు బోరు వేసినచో అమృత సమానమైన విస్తార జలం లభించును.',
    sutraMeaningEn: 'Drilling under water signs (Cancer, Scorpio, Pisces) aspected by Moon or Venus yields abundant sweet water.',
    howToChooseTe: ['ఈశాన్యం, ఉత్తరం లేదా తూర్పు దిక్కులలో బోరు పాయింట్ ఎన్నుకోవాలి.', 'జల తత్త్వ సమయంలో డ్రిల్లింగ్ ప్రారంభించాలి.'],
    howToChooseEn: ['Place the point in North, Northeast, or East.', 'Start drilling precisely in Jala Tatwa.'],
    whenToPerformTe: ['ఉదయం పూట చంద్ర హోరలో లేదా శుక్ర హోరలో ప్రారంభించాలి.'],
    whenToPerformEn: ['Morning hours during Chandra Hora or Shukra Hora.'],
    exemptionsPariharaluTe: ['గంగా పూజ చేసి కొబ్బరికాయ కొట్టినచో రాతి నేలల్లోనూ జలసిద్ధి కలుగును.'],
    exemptionsPariharaluEn: ['Consecrating Ganga with coconut and milk offerings pacifies rocky earth resistance.'],
    seoKeywords: ['when good muhurtham for borewell digging', 'water well drilling astrology telugu', 'బోరు వేయుటకు మంచి ముహూర్తం'],
  },
  {
    id: 'business_office_opening',
    nameTe: 'నూతన వ్యాపారం / కార్యాలయం ప్రారంభం',
    nameEn: 'Business & Office Inauguration',
    category: 'business',
    categoryNameTe: 'వ్యాపార & వాణిజ్యం',
    categoryNameEn: 'Business & Commerce',
    taglineTe: 'లాభసాటి వ్యాపారం, వినియోగదారుల ఆదరణ, వ్యాపార విస్తరణ కొరకు ఉత్తమ ప్రారంభం',
    taglineEn: 'Timing for opening shops, corporate offices, startup ventures, and firms',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['బుధవారం (వ్యాపార కారకుడు)', 'గురువారం (ధన కారకుడు)', 'శుక్రవారం (లక్ష్మీ కారకుడు)', 'సోమవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['వృషభం (స్థిర ధన రాశి)', 'సింహం', 'తుల', 'ధనుస్సు', 'కుంభం'],
    avoidableLagnas: ['మేషం', 'కర్కాటకం'],
    prohibitedFactorsTe: ['బుధ మౌఢ్యమి', 'లగ్నానికి 11వ స్థానం (లాభ స్థానం) బలహీనంగా ఉండరాదు'],
    prohibitedFactorsEn: ['Combust Mercury', 'Afflicted 11th house of profits'],
    shastraPramanaSutram: 'ముహూర్త చింతామణి: "లాభస్థే సర్వ పాపే వా శుభే కేంద్ర సమన్వితే | వాణిజ్యారంభణం కుర్యాత్ ధనధాన్య సమృద్ధిదమ్ ||"',
    shastraSource: 'ముహూర్త చింతామణి & భృగు సంహిత',
    sutraMeaningTe: 'లగ్నానికి 11వ ఇంట పాపగ్రహాలు ఉన్నా లాభమే. కేంద్రంలో గురు శుక్రులు ఉన్నప్పుడు ప్రారంభించిన వ్యాపారం కోట్లలో లాభాలు తెచ్చును.',
    sutraMeaningEn: 'Malefics in 11th generate massive profits, while benefics in Kendra safeguard business stability.',
    howToChooseTe: ['వ్యాపార యజమాని తారాబలం మరియు చంద్రబలం చూడాలి.', 'స్థిర లగ్నంలో క్యాష్ కౌంటర్ వద్ద మొదటి లావాదేవీ జరపాలి.'],
    howToChooseEn: ['Verify owner’s Tara and Chandra Balam.', 'Execute first cash transaction in a fixed ascendant.'],
    whenToPerformTe: ['ఉదయం 9 గంటల నుండి 12 గంటల మధ్య బుధ లేదా గురు హోరలో.'],
    whenToPerformEn: ['Between 9 AM and 12 noon during Mercury or Jupiter Hora.'],
    exemptionsPariharaluTe: ['కుబేర మరియు మహాలక్ష్మీ పూజ చేసి ప్రారంభించినచో వాణిజ్య శత్రువులు నశింతురు.'],
    exemptionsPariharaluEn: ['Conducting Kubera and Mahalakshmi puja eliminates business rivals.'],
    seoKeywords: ['how to choose shop opening muhurtham', 'when good muhurtham for new business telugu', 'నూతన వ్యాపారారంభ ముహూర్తం'],
  },
  {
    id: 'gold_jewellery_purchase',
    nameTe: 'బంగారం / వెండి / ఆభరణాలు కొనుగోలు',
    nameEn: 'Gold, Silver & Jewellery Purchase Muhurtham',
    category: 'finance',
    categoryNameTe: 'ధన & ఆర్థిక లావాదేవీలు',
    categoryNameEn: 'Finance & Wealth',
    taglineTe: 'కొన్న బంగారం దినదినాభివృద్ధి చెంది తరతరాల ఆస్తిగా వృద్ధి చెందే సువేళ',
    taglineEn: 'Timing for buying gold and jewellery to ensure multiplying wealth',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['గురువారం (గురువు స్వర్ణ కారకుడు)', 'శుక్రవారం (లక్ష్మీ దినం)', 'ఆదివారం'],
    unfavorableVaras: ['శనివారం'],
    favorableNakshatras: ['పుష్యమి (గురు పుష్య యోగం)', 'రోహిణి', 'మృగశిర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'శ్రవణం', 'రేవతి', 'అశ్విని'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['ధనుస్సు (గురు క్షేత్రం)', 'మీనం', 'వృషభం', 'సింహం', 'తుల'],
    avoidableLagnas: ['వృశ్చికం', 'కుంభం'],
    prohibitedFactorsTe: ['రాహు కాలం', 'యమగండం'],
    prohibitedFactorsEn: ['Rahu Kalam', 'Yamagandam'],
    shastraPramanaSutram: 'భృగు సంహిత: "గురువారే చ పుష్యే చ స్వర్ణక్రయే మహత్ఫలమ్ | అక్షయం భవతి ద్రవ్యం వర్ధతే చ దినే దినే ||"',
    shastraSource: 'భృగు నంది నాడీ సంహిత',
    sutraMeaningTe: 'గురువారం నాడు లేదా పుష్యమి నక్షత్రంలో బంగారం కొనుగోలు చేసినచో ఆ బంగారం అక్షయమై రోజురోజుకూ వృద్ధి చెందును.',
    sutraMeaningEn: 'Buying gold on Thursday or under Pushyami star ensures infinite multiplication of golden wealth.',
    howToChooseTe: ['గురు పుష్య యోగం, రవి పుష్య యోగం లేదా ధన త్రయోదశి, అక్షయ తృతీయ దినాలు ఉత్తమోత్తమం.'],
    howToChooseEn: ['Guru Pushya, Ravi Pushya, Dhana Trayodashi, or Akshaya Tritiya are superlative.'],
    whenToPerformTe: ['గురు హోర లేదా శుక్ర హోర సమయాలలో కొనుగోలు చేయాలి.'],
    whenToPerformEn: ['Purchase strictly during Jupiter or Venus Hora.'],
    exemptionsPariharaluTe: ['అక్షయ తృతీయ నాడు ఎటువంటి ముహూర్తం చూడనవసరం లేదు.'],
    exemptionsPariharaluEn: ['Akshaya Tritiya is self-luminous and free from all muhurtha blemishes.'],
    seoKeywords: ['when good muhurtham for gold purchase', 'best day to buy gold in telugu', 'బంగారం కొనుగోలు ముహూర్తం'],
  },
  {
    id: 'debt_loan_taking',
    nameTe: 'రుణం తీసుకొనుట (లోన్ అప్లై చేయుట / అప్పు తెచ్చుట)',
    nameEn: 'Loan Application & Borrowing Debt Muhurtham',
    category: 'finance',
    categoryNameTe: 'ధన & ఆర్థిక లావాదేవీలు',
    categoryNameEn: 'Finance & Wealth',
    taglineTe: 'తెచ్చిన రుణం శీఘ్రంగా తీరిపోయి ఆస్తిగా మారే ప్రత్యేక శాస్త్రీయ సమయం',
    taglineEn: 'Timing for taking loans so they are easily repaid and turn into profitable assets',
    favorableTithis: ['విదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి'],
    unfavorableTithis: ['మంగళవారం సంధ్యాకాలం', 'రిక్త తిథులు', 'సంక్రాంతి దినాలు'],
    favorableVaras: ['గురువారం', 'బుధవారం', 'సోమవారం', 'శుక్రవారం'],
    unfavorableVaras: ['మంగళవారం (మంగళవారం అప్పు తీసుకుంటే అప్పుల ఊబిలో పడతారు)', 'హస్త నక్షత్రం ఉన్న రోజు'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'స్వాతి', 'శ్రవణం', 'శతభిషం', 'రేవతి'],
    unfavorableNakshatras: ['హస్త (హస్త నక్షత్రంలో అప్పు చేయకూడదు)', 'భరణి', 'కృత్తిక', 'జ్యేష్ఠ'],
    favorableLagnas: ['చర లగ్నాలు (మేషం, కర్కాటకం, తుల, మకరం - అప్పు స్థిరంగా ఉండకుండా త్వరగా వెళ్లిపోవును)'],
    avoidableLagnas: ['స్థిర లగ్నాలు (వృషభ, సింహ, కుంభ లగ్నాలలో అప్పు చేస్తే అది శాశ్వతంగా ఉండిపోవును)'],
    prohibitedFactorsTe: ['హస్త నక్షత్రం ఆదివారం గాని మంగళవారం గాని కలిసి వచ్చినప్పుడు అస్సలు అప్పు చేయకూడదు'],
    prohibitedFactorsEn: ['Never borrow when Hasta star falls on Sunday or Tuesday'],
    shastraPramanaSutram: 'ముహూర్త మార్తాండ: "హస్తే నార్కే న భౌమే వా ఋణం గృహ్ణీత మానవః | చరలగ్నే ప్రగృహీతం శీఘ్రమేవ ప్రముచ్యతే ||"',
    shastraSource: 'ముహూర్త మార్తాండ & గర్గ సంహిత',
    sutraMeaningTe: 'హస్త నక్షత్రం నాడు, ఆది లేదా మంగళవారాలలో ఎన్నడూ రుణం తీసుకోరాదు. చర లగ్నంలో అప్పు తెచ్చినచో అది వేగంగా తీరిపోవును.',
    sutraMeaningEn: 'Never take a loan on Hasta nakshatra, Sunday, or Tuesday. Borrowing in a movable ascendant ensures speedy repayment.',
    howToChooseTe: ['చర లగ్నం (కర్కాటకం లేదా తుల) ఎన్నుకోవాలి, స్థిర లగ్నాలు వర్జించాలి.'],
    howToChooseEn: ['Choose movable signs (Cancer, Libra); avoid fixed signs.'],
    whenToPerformTe: ['శుక్లపక్షంలో బుధ లేదా గురు హోరలో.'],
    whenToPerformEn: ['Waxing fortnight during Mercury or Jupiter Hora.'],
    exemptionsPariharaluTe: ['బ్యాంకు రుణం ద్వారా ఆస్తి కొనుగోలుకు గురు దృష్టి ఉంటే మేలు జరుగును.'],
    exemptionsPariharaluEn: ['Jupiter’s aspect ensures bank loans materialize into productive real estate.'],
    seoKeywords: ['which nakshatra not to take loan in telugu', 'when good muhurtham for loan apply', 'అప్పు ఎప్పుడు తీసుకోవాలి'],
  },
  {
    id: 'debt_repayment_runavimochana',
    nameTe: 'రుణం తీర్చుట (అప్పు చెల్లించుట / ఋణ విమోచనం)',
    nameEn: 'Debt Repayment (Runa Vimochana Muhurtham)',
    category: 'finance',
    categoryNameTe: 'ధన & ఆర్థిక లావాదేవీలు',
    categoryNameEn: 'Finance & Wealth',
    taglineTe: 'అప్పుల బాధ శాశ్వతంగా తొలగిపోయి తిరిగి అప్పు చేసే దుస్థితి రాకుండా ఉండే దివ్య ముహూర్తం',
    taglineEn: 'Timing for paying the first installment of debt to ensure total financial freedom',
    favorableTithis: ['పాడ్యమి', 'తదియ', 'పంచమి', 'అష్టమి', 'దశమి'],
    unfavorableTithis: ['అమావాస్య'],
    favorableVaras: ['మంగళవారం (అప్పు తీర్చడానికి మంగళవారం పరమ శ్రేష్టం - అప్పు తీరిపోవును)'],
    unfavorableVaras: ['బుధవారం (బుధవారం అప్పు తీరిస్తే మళ్ళీ అప్పులు పుడతాయి)'],
    favorableNakshatras: ['భరణి (భరణి నక్షత్రంలో అప్పు తీరిస్తే శాశ్వతంగా విముక్తి)', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    unfavorableNakshatras: ['రోహిణి', 'హస్త'],
    favorableLagnas: ['మేషం (కుజ క్షేత్రం)', 'వృశ్చికం', 'సింహం'],
    avoidableLagnas: ['వృషభం', 'తుల'],
    prohibitedFactorsTe: ['బుధవారం నాడు అప్పు తీర్చరాదు'],
    prohibitedFactorsEn: ['Repaying debt on Wednesday induces recurring borrowing cycles'],
    shastraPramanaSutram: 'పరాశర హోరా: "భౌమే భరణ్యాం దత్తం చేత్ ఋణం తన్నిరవశేషతః | న శేషో భవతి క్వాపి పునః ఋణం న జాయతే ||"',
    shastraSource: 'పరాశర హోరా శాస్త్రం & వశిష్ఠ సంహిత',
    sutraMeaningTe: 'మంగళవారం నాడు భరణి నక్షత్రంలో అప్పులో కొంత భాగమైనా చెల్లించినచో ఆ అప్పు సంపూర్ణంగా తీరిపోయి మళ్ళీ జన్మలో అప్పు చేయవలసిన అవసరం రాదు.',
    sutraMeaningEn: 'Repaying even a small token of debt on Tuesday under Bharani nakshatra completely annihilates the liability forever.',
    howToChooseTe: ['మంగళవారం మరియు భరణి నక్షత్రం లేదా కుజ హోరను ఎన్నుకోవాలి.'],
    howToChooseEn: ['Target Tuesday and Bharani star or Mars Hora.'],
    whenToPerformTe: ['మంగళవారం ఉదయం కుజ హోరలో మొదటి వాయిదా చెల్లించాలి.'],
    whenToPerformEn: ['Pay the first installment during Tuesday morning Mars Hora.'],
    exemptionsPariharaluTe: ['మంగళవారం కుజ స్తోత్రం చదివి అప్పు తీర్చడం పరమ పరిహారం.'],
    exemptionsPariharaluEn: ['Chanting Mangala Kavacham before repaying secures permanent relief.'],
    seoKeywords: ['which day is best to repay loan in telugu', 'bharani nakshatra debt repayment', 'అప్పులు తీరిపోవడానికి మంచి రోజు'],
  },
  {
    id: 'job_application_interview',
    nameTe: 'ఉద్యోగానికి దరఖాస్తు / ఇంటర్వ్యూ / పరీక్ష రాయుట',
    nameEn: 'Job Application Submission & Interview Appearance',
    category: 'career',
    categoryNameTe: 'ఉద్యోగ & వృత్తి',
    categoryNameEn: 'Career & Profession',
    taglineTe: 'అధికారుల మన్ననలు, ఇంటర్వ్యూలో అద్భుత విజయం, ఉన్నతోద్యోగ ప్రాప్తి వేళ',
    taglineEn: 'Timing for submitting resume, attending competitive interviews, and exams',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['రిక్త తిథులు', 'అమావాస్య'],
    favorableVaras: ['గురువారం (రాజకృప)', 'బుధవారం (ఇంటర్వ్యూ సంభాషణ)', 'ఆదివారం (ప్రభుత్వ ఉద్యోగం)'],
    unfavorableVaras: ['శనివారం'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'శ్రవణం', 'శతభిషం', 'రేవతి', 'అశ్విని'],
    unfavorableNakshatras: ['భరణి', 'జ్యేష్ఠ'],
    favorableLagnas: ['సింహం (రాజ రాశి)', 'ధనుస్సు', 'మేషం', 'మిథునం', 'తుల'],
    avoidableLagnas: ['వృశ్చికం', 'కుంభం'],
    prohibitedFactorsTe: ['రాహు కాలం', 'దుర్ముహూర్తం'],
    prohibitedFactorsEn: ['Rahu Kalam', 'Durmuhurtham'],
    shastraPramanaSutram: 'ముహూర్త మార్తాండ: "దశమేశ్వరే బలయుతే రవి భాస్కర సంయుతే | రాజాశ్రయో భవేత్ క్షిప్రం విజయశ్చ పదే పదే ||"',
    shastraSource: 'ముహూర్త మార్తాండ',
    sutraMeaningTe: 'లగ్నానికి 10వ స్థానాధిపతి బలవంతుడై, రవి అనుగ్రహం ఉన్న శుభ సమయంలో దరఖాస్తు పంపినచో ఉద్యోగ ప్రాప్తి సులువగును.',
    sutraMeaningEn: 'Submitting resumes when 10th lord and Sun are fortified guarantees rapid employment success.',
    howToChooseTe: ['ప్రభుత్వ ఉద్యోగాలకైతే ఆదివారం సూర్య హోర, ప్రైవేట్ ఉద్యోగాలకైతే బుధ/గురు హోరలు ఎన్నుకోవాలి.'],
    howToChooseEn: ['Sun Hora for government roles; Mercury/Jupiter Hora for corporate positions.'],
    whenToPerformTe: ['ఉదయం 10 గంటల నుండి 12 గంటల మధ్య అభిజిత్ ముహూర్తంలో.'],
    whenToPerformEn: ['Between 10 AM and 12 noon or Abhijit Muhurtha.'],
    exemptionsPariharaluTe: ['ఇంటర్వ్యూకి వెళ్లే ముందు సూర్యునికి అర్ఘ్యం ఇవ్వడం మహా పరిహారం.'],
    exemptionsPariharaluEn: ['Offering Arghya to Lord Surya prior to interview guarantees confidence.'],
    seoKeywords: ['when good muhurtham for job application', 'interview success muhurtham telugu', 'ఉద్యోగ దరఖాస్తు ముహూర్తం'],
  },
  {
    id: 'joining_job_duty',
    nameTe: 'నూతన ఉద్యోగంలో చేరుట (జాయినింగ్ డ్యూటీ)',
    nameEn: 'Joining New Job / Assuming Public Office',
    category: 'career',
    categoryNameTe: 'ఉద్యోగ & వృత్తి',
    categoryNameEn: 'Career & Profession',
    taglineTe: 'పదవిలో స్థిరత్వం, శీఘ్ర ప్రమోషన్లు, కార్యాలయంలో గౌరవ మన్ననలు లభించే వేళ',
    taglineEn: 'Timing for joining a new position or taking oath for enduring leadership',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['రిక్త తిథులు', 'అమావాస్య'],
    favorableVaras: ['గురువారం', 'ఆదివారం', 'బుధవారం', 'సోమవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం'],
    favorableNakshatras: ['రోహిణి', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['సింహం (అధికార రాశి)', 'వృషభం (స్థిర రాశి)', 'ధనుస్సు', 'కుంభం'],
    avoidableLagnas: ['చర లగ్నాలు (ఉద్యోగం తరచూ మారిపోయే అవకాశం)'],
    prohibitedFactorsTe: ['లగ్నానికి 10వ ఇంట రాహువు ఉండటం', 'విష ఘటికలు'],
    prohibitedFactorsEn: ['Rahu in 10th house', 'Varjyam periods'],
    shastraPramanaSutram: 'పరాశర హోరా: "స్థిరే లగ్నే స్థిరాంశే వా దశమే శుభవీక్షితే | ఉద్యోగ గమనం కుర్యాత్ స్థిరా పదవీ భవేత్ ||"',
    shastraSource: 'పరాశర హోరా శాస్త్రం & శారంగధర పద్ధతి',
    sutraMeaningTe: 'స్థిర లగ్నంలో నూతన ఉద్యోగ బాధ్యతలు స్వీకరించినచో ఆ ఉద్యోగంలో స్థిరత్వం ఏర్పడి వేగవంతమైన ఉన్నతి లభించును.',
    sutraMeaningEn: 'Assuming official charge in a fixed ascendant guarantees tenure security and rapid promotions.',
    howToChooseTe: ['స్థిర లగ్నము మరియు అభ్యర్థి చంద్రబలము పరిశీలించాలి.'],
    howToChooseEn: ['Check fixed ascendant along with candidate’s Chandra Balam.'],
    whenToPerformTe: ['ఉదయం ఆఫీసు తెరిచిన వేళలో లేదా అభిజిత్ ముహూర్తంలో చేరాలి.'],
    whenToPerformEn: ['Morning office opening hours or midday Abhijit window.'],
    exemptionsPariharaluTe: ['మొదటి సంతకం పెట్టేటప్పుడు ఓం శ్రీ గణేశాయ నమః అని మనస్సులో స్మరించడం.'],
    exemptionsPariharaluEn: ['Mental invocation of Lord Ganesha prior to signing first document.'],
    seoKeywords: ['when good muhurtham for job joining in telugu', 'how to choose joining duty time', 'ఉద్యోగంలో చేరడానికి మంచి ముహూర్తం'],
  },
  {
    id: 'vehicle_purchase_vahanam',
    nameTe: 'నూతన వాహనం కొనుగోలు (కారు, బైక్, వాణిజ్య వాహనాలు)',
    nameEn: 'Vehicle Purchase Muhurtham (Car, Bike, Commercial)',
    category: 'travel',
    categoryNameTe: 'ప్రయాణ & వాహనం',
    categoryNameEn: 'Travel & Vehicles',
    taglineTe: 'సురక్షిత ప్రయాణాలు, ప్రమాద రహిత ప్రయాణ సౌఖ్యం, వాహన వృద్ధి సమయం',
    taglineEn: 'Timing for purchasing and taking delivery of personal and commercial vehicles',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి', 'పూర్ణిమ'],
    unfavorableTithis: ['చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['శుక్రవారం (శుక్రుడు వాహన కారకుడు)', 'బుధవారం', 'గురువారం', 'సోమవారం'],
    unfavorableVaras: ['మంగళవారం', 'శనివారం (వాణిజ్య ట్రక్కులకు మినహాయింపు కలదు)'],
    favorableNakshatras: ['రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'హస్త', 'చిత్త', 'స్వాతి', 'అనూరాధ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'ఉత్తరాభాద్ర', 'రేవతి', 'అశ్విని'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆరుద్ర', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['వృషభం (శుక్ర క్షేత్రం)', 'మిథునం', 'కర్కాటకం', 'తుల', 'ధనుస్సు', 'కుంభం', 'మీనం'],
    avoidableLagnas: ['మేషం', 'వృశ్చికం'],
    prohibitedFactorsTe: ['లగ్నానికి 4వ స్థానంలో (వాహన స్థానం) కుజుడు లేదా రాహువు ఉండరాదు', 'శుక్ర మౌఢ్యమి'],
    prohibitedFactorsEn: ['Mars or Rahu in 4th house', 'Combust Venus'],
    shastraPramanaSutram: 'ముహూర్త చింతామణి: "చతుర్థేశే బలయుతే శుక్రే లగ్న సమన్వితే | వాహన క్రయణం కుర్యాత్ క్షేమ ప్రయాణ హేతవే ||"',
    shastraSource: 'ముహూర్త చింతామణి & భృగు సంహిత',
    sutraMeaningTe: 'లగ్నానికి 4వ స్థానాధిపతి మరియు శుక్రుడు బలముగా ఉన్నప్పుడు వాహనం కొన్నచో ప్రయాణాలు సురక్షితమై వాహన సౌఖ్యం సిద్ధిస్తుంది.',
    sutraMeaningEn: 'Purchasing when 4th lord and Venus are strong secures accident-free travel and driving comfort.',
    howToChooseTe: ['డెలివరీ తీసుకునే సమయానికి శుక్ర హోర లేదా చంద్ర హోర ఉండేలా చూసుకోవాలి.'],
    howToChooseEn: ['Ensure delivery key exchange occurs during Venus or Moon Hora.'],
    whenToPerformTe: ['పగటి పూట లేదా ప్రదోష వేళలో షోరూమ్ నుండి వాహనం బయటకు తీయాలి.'],
    whenToPerformEn: ['Drive out of showroom during daytime Shubha Hora or Pradosha.'],
    exemptionsPariharaluTe: ['వాహనానికి గుమ్మడికాయ, నిమ్మకాయల దిష్టి తీసి, ఆంజనేయ స్వామి లేదా దుర్గా ఆలయంలో పూజ చేయించాలి.'],
    exemptionsPariharaluEn: ['Conducting Vahana Puja at a temple of Lord Hanuman pacifies accidental afflictions.'],
    seoKeywords: ['when good muhurtham for vehicle purchase in telugu', 'bike car delivery muhurtham', 'వాహనం కొనుగోలు మంచి ముహూర్తం'],
  },
  {
    id: 'travel_yatra_muhurtham',
    nameTe: 'విదేశీ యాత్ర / దూర ప్రయాణ ముహూర్తం',
    nameEn: 'Foreign Travel & Long Journey Muhurtham',
    category: 'travel',
    categoryNameTe: 'ప్రయాణ & వాహనం',
    categoryNameEn: 'Travel & Vehicles',
    taglineTe: 'దిశా శూలలు లేకుండా కార్యసిద్ధి, క్షేమకర ప్రయాణం అందించే సుముహూర్తం',
    taglineEn: 'Timing for international journeys and critical travels avoiding Disha Shula',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'త్రయోదశి'],
    unfavorableTithis: ['పాడ్యమి', 'చవితి', 'నవమి', 'చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['గురువారం', 'శుక్రవారం', 'బుధవారం', 'సోమవారం'],
    unfavorableVaras: ['మంగళవారం', 'ఆదివారం (పడమటి వైపు యాత్రకు ఆదివారం దిశా శూల)'],
    favorableNakshatras: ['అశ్విని', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'హస్త', 'అనూరాధ', 'శ్రవణం', 'ధనిష్ఠ', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ', 'మూల'],
    favorableLagnas: ['చర లగ్నాలు (మేషం, కర్కాటకం, తుల, మకరం - శీఘ్ర గమనం మరియు సురక్షిత తిరుగు ప్రయాణం)'],
    avoidableLagnas: ['స్థిర లగ్నాలు (ప్రయాణ ఆలస్యం తెచ్చును)'],
    prohibitedFactorsTe: [
      'దిశా శూల: తూర్పునకు సోమ/శని, దక్షిణమునకు గురు, పశ్చిమమునకు భాను/ఆది, ఉత్తరమునకు బుధ/మంగళవారాలు శూలలు',
      'ఘాత తిథి మరియు ఘాత నక్షత్రాలు',
    ],
    prohibitedFactorsEn: [
      'Disha Shula: East on Mon/Sat, South on Thu, West on Sun, North on Tue/Wed',
      'Ghata Tithi and Ghata Nakshatras',
    ],
    shastraPramanaSutram: 'వశిష్ఠ సంహిత: "చరలగ్నే ప్రయాణం చ శీఘ్ర కార్యోపలబ్ధయే | శుభే తారాబలే యుక్తే యాత్రా విజయవర్ధినీ ||"',
    shastraSource: 'వశిష్ఠ సంహిత & గర్గ సంహిత',
    sutraMeaningTe: 'చర లగ్నంలో శుభ తారాబలంతో బయలుదేరిన యాత్ర తలపెట్టిన పనులను దిగ్విజయంగా పూర్తి చేసి క్షేమంగా తిరిగి ఇంటికి చేరుస్తుంది.',
    sutraMeaningEn: 'Journeys commenced under movable ascendants with favorable Tara Balam fulfill missions safely.',
    howToChooseTe: ['ప్రయాణించే దిక్కునకు ఆ రోజు దిశా శూల లేకుండునట్లు చూసుకోవాలి.'],
    howToChooseEn: ['Ensure the destination direction is free from Disha Shula on that weekday.'],
    whenToPerformTe: ['ఇంటి నుండి బయలుదేరే సమయానికి లగ్న పరిశీలన చేయాలి.'],
    whenToPerformEn: ['Measure the Muhurtham for the moment of leaving the house threshold.'],
    exemptionsPariharaluTe: ['దిశా శూల అనివార్యమైనచో: తూర్పునకు నెయ్యి, దక్షిణమునకు నువ్వులు, పశ్చిమమునకు బెల్లం, ఉత్తరమునకు పాలు సేవించి బయలుదేరాలి.'],
    exemptionsPariharaluEn: ['Emergency remedies: consume ghee for East, sesame for South, jaggery for West, and milk for North.'],
    seoKeywords: ['foreign travel muhurtham telugu', 'when good muhurtham for long journey', 'ప్రయాణ ముహూర్తం ఎలా చూసుకోవాలి'],
  },
  {
    id: 'medicine_surgery_health',
    nameTe: 'ఔషధ సేవనం / శస్త్రచికిత్స (ఆపరేషన్) ముహూర్తం',
    nameEn: 'Commencing Medicine & Surgery (Operation) Muhurtham',
    category: 'health',
    categoryNameTe: 'ఆరోగ్యం & చికిత్స',
    categoryNameEn: 'Health & Healing',
    taglineTe: 'దీర్ఘ రోగాల నుండి శీఘ్ర స్వస్థత, ఆపరేషన్ విజయవంతం అయ్యే సుముహూర్తం',
    taglineEn: 'Timing for taking new treatments and undergoing successful surgeries',
    favorableTithis: ['విదియ', 'తదియ', 'పంచమి', 'సప్తమి', 'దశమి', 'ఏకాదశి', 'త్రయోదశి'],
    unfavorableTithis: ['చతుర్దశి', 'అమావాస్య'],
    favorableVaras: ['గురువారం (ఆయుష్షు కారకుడు)', 'ఆదివారం (సూర్యుడు ఆరోగ్యం)', 'సోమవారం', 'బుధవారం'],
    unfavorableVaras: ['శనివారం'],
    favorableNakshatras: ['అశ్విని (వైద్య నక్షత్రం)', 'రోహిణి', 'మృగశిర', 'పునర్వసు', 'పుష్యమి', 'హస్త', 'చిత్ర', 'స్వాతి', 'అనూరాధ', 'శ్రవణం', 'శతభిషం', 'రేవతి'],
    unfavorableNakshatras: ['భరణి', 'కృత్తిక', 'ఆశ్లేష', 'జ్యేష్ఠ'],
    favorableLagnas: ['మేషం', 'వృషభం', 'కర్కాటకం', 'సింహం', 'తుల', 'ధనుస్సు'],
    avoidableLagnas: ['వృశ్చికం'],
    prohibitedFactorsTe: ['శస్త్రచికిత్స సమయంలో శస్త్రం జరిగే శరీర భాగానికి చెందిన రాశిలో చంద్రుడు ఉండరాదు'],
    prohibitedFactorsEn: ['Moon must not transit the zodiac sign ruling the organ being operated upon'],
    shastraPramanaSutram: 'చరక సంహిత: "చంద్రే బలవతి ప్రాప్తే సౌమ్య గ్రహ నిరీక్షితే | ఔషధం ప్రయుక్తం చామృత వత్ శీఘ్ర రోగహరమ్ ||"',
    shastraSource: 'చరక సంహిత & పరాశర హోరా',
    sutraMeaningTe: 'చంద్రుడు బలముగా ఉన్నప్పుడు ప్రారంభించిన ఔషధం అమృతం వలె పనిచేసి అతి తీవ్ర రోగాలను సైతం సమూలంగా నివారిస్తుంది.',
    sutraMeaningEn: 'Medicines started when Moon is waxing and fortified act like divine nectar, eradicating chronic illnesses.',
    howToChooseTe: ['అశ్విని నక్షత్రం లేదా శతభిష నక్షత్ర దినాలు ఔషధ సేవనానికి అమృత ఘడియలు.'],
    howToChooseEn: ['Ashwini and Shatabhisha nakshatras are golden windows for treatment.'],
    whenToPerformTe: ['సూర్యోదయ వేళ లేదా అమృత కాలంలో మొదటి డోస్ ఔషధం సేవించాలి.'],
    whenToPerformEn: ['Take the initial medicine dose at sunrise or during Amrita Ghati.'],
    exemptionsPariharaluTe: ['ధన్వంతరి స్తోత్రం మరియు మహా మృత్యుంజయ మంత్ర జపం రోగ విముక్తిని వేగవంతం చేయును.'],
    exemptionsPariharaluEn: ['Recitation of Dhanvantari Stotram and Maha Mrityunjaya mantra aids rapid recovery.'],
    seoKeywords: ['surgery date muhurtham telugu astrology', 'when good muhurtham for taking medicine', 'ఆపరేషన్ మంచి ముహూర్తం'],
  },
  {
    id: 'special_abhijit_muhurtham',
    nameTe: 'అభిజిత్ ముహూర్తం (సర్వ దోష నివారిణి)',
    nameEn: 'Abhijit Muhurtha (Midday Divine Window)',
    category: 'micro_systems',
    categoryNameTe: 'ప్రత్యేక సూక్ష్మ ముహూర్త విధానాలు',
    categoryNameEn: 'Special Classical Systems',
    taglineTe: 'మధ్యాహ్న సూర్యుని 8వ ముహూర్తం - సకల తిథి, వార, నక్షత్ర దోషాలను హరించే మహా సమయం',
    taglineEn: 'The supreme midday 48-minute slot removing millions of astrological flaws',
    favorableTithis: ['అన్ని తిథులు శుభప్రదం'],
    unfavorableTithis: ['ఏవీ లేవు'],
    favorableVaras: ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'],
    unfavorableVaras: ['బుధవారం (బుధవారం నాడు అభిజిత్ ముహూర్తంలో దోషం కలదు)'],
    favorableNakshatras: ['సమస్త నక్షత్రాలు అనుకూలం'],
    unfavorableNakshatras: ['ఏవీ లేవు'],
    favorableLagnas: ['మధ్యాహ్న సమయ లగ్నం'],
    avoidableLagnas: ['ఏవీ లేవు'],
    prohibitedFactorsTe: ['బుధవారం మధ్యాహ్నం మాత్రం అభిజిత్ ముహూర్తం తీసుకోరాదు'],
    prohibitedFactorsEn: ['Avoid Abhijit specifically on Wednesdays due to mutual directional conflict'],
    shastraPramanaSutram: 'వశిష్ఠ సంహిత: "అభిజిత్ నామ ముహూర్తో యో మధ్యాహ్నే సముపస్థితః | సర్వాన్ దోషాన్ నిహంత్యాశు సూర్యస్తమ ఇవోజ్జ్వలః ||"',
    shastraSource: 'వశిష్ఠ సంహిత & ముహూర్త చింతామణి',
    sutraMeaningTe: 'మధ్యాహ్న వేళ వచ్చే అభిజిత్ ముహూర్తం ఉదయించిన సూర్యుడు చీకట్లను పారద్రోలినట్లు సమస్త దోషాలను నశింపజేసి విజయాన్ని ప్రసాదిస్తుంది.',
    sutraMeaningEn: 'Just as the rising sun banishes darkness, Abhijit Muhurtha at midday annihilates all afflictions.',
    howToChooseTe: ['సూర్యోదయ మరియు సూర్యాస్తమయ సమయాల సరిగ్గా మధ్య బిందువుకు అటు 24 నిమిషాలు, ఇటు 24 నిమిషాలు (మొత్తం 48 నిమిషాలు) లెక్కించాలి.'],
    howToChooseEn: ['Calculate the exact solar noon midpoint and take 24 minutes prior and 24 minutes after.'],
    whenToPerformTe: ['ప్రతి రోజూ మధ్యాహ్నం 11:45 నుండి 12:35 మధ్య కాలంలో.'],
    whenToPerformEn: ['Daily approximately between 11:45 AM and 12:35 PM local solar time.'],
    exemptionsPariharaluTe: ['మరే ముహూర్తం దొరకని అత్యవసర సమయాలలో అభిజిత్ ముహూర్తం శరణ్యం.'],
    exemptionsPariharaluEn: ['Universal fallback when no other fault-free muhurtham is available.'],
    seoKeywords: ['abhijit muhurtham today timings', 'what is abhijit muhurtham in telugu', 'అభిజిత్ ముహూర్తం ఎప్పుడు'],
  },
  {
    id: 'praptakala_ushahkala',
    nameTe: 'ప్రాప్తకాల ఉషఃకాల ముహూర్తం (బ్రహ్మ ముహూర్తం)',
    nameEn: 'Praptakala & Brahma Muhurtha (Pre-Dawn Timing)',
    category: 'micro_systems',
    categoryNameTe: 'ప్రత్యేక సూక్ష్మ ముహూర్త విధానాలు',
    categoryNameEn: 'Special Classical Systems',
    taglineTe: 'సూర్యోదయానికి ముందు 24 నుండి 48 నిమిషాల దివ్య కాలం - దేవతా ప్రసాద సమయం',
    taglineEn: 'Sacred pre-dawn window 24-48 minutes before sunrise for mantra siddhi and divine grace',
    favorableTithis: ['అన్ని శుభ తిథులు'],
    unfavorableTithis: ['అమావాస్య'],
    favorableVaras: ['సమస్త వారాలు'],
    unfavorableVaras: ['ఏవీ లేవు'],
    favorableNakshatras: ['సమస్త శుభ నక్షత్రాలు'],
    unfavorableNakshatras: ['ఏవీ లేవు'],
    favorableLagnas: ['ఉషఃకాల లగ్నం'],
    avoidableLagnas: ['ఏవీ లేవు'],
    prohibitedFactorsTe: ['ఆలస్య నిద్ర', 'అపరిశుభ్రత'],
    prohibitedFactorsEn: ['Tardiness', 'Impurity'],
    shastraPramanaSutram: 'పరాశర హోరా: "సూర్యోదయాత్ పురా కాలే ఘటీ ద్వితయ ముచ్యతే | బ్రాహ్మే ముహూర్తే యః కర్తా స సిద్ధో నాత్ర సంశయః ||"',
    shastraSource: 'పరాశర హోరా శాస్త్రం & శివ పురాణం',
    sutraMeaningTe: 'సూర్యోదయానికి రెండు ఘడియల (48 నిమిషాలు) ముందుండే బ్రహ్మ ముహూర్తంలో ప్రారంభించే ఏ పనైనా నిర్విఘ్నంగా విజయవంతమగును.',
    sutraMeaningEn: 'Activities initiated in the 48 minutes prior to sunrise achieve guaranteed fulfillment.',
    howToChooseTe: ['సూర్యోదయ సమయానికి ముందు 48 నిమిషాల కాలాన్ని లెక్కించాలి.'],
    howToChooseEn: ['Measure the 48-minute span immediately preceding local sunrise.'],
    whenToPerformTe: ['తెల్లవారుజామున 4:30 AM నుండి 5:30 AM మధ్య.'],
    whenToPerformEn: ['Between 4:30 AM and 5:30 AM local time.'],
    exemptionsPariharaluTe: ['సమస్త తిథి వార దోషములకు అతీతమైన కాలం.'],
    exemptionsPariharaluEn: ['Transcends all ordinary tithi and planetary blemishes.'],
    seoKeywords: ['brahma muhurtham timings today telugu', 'when is ushahkala muhurtham', 'బ్రహ్మ ముహూర్తం సమయం'],
  },
];

/**
 * Evaluates the suitability of a specific activity for a given date/time,
 * checking Panchangam factors, Tara Balam, and dosha exemptions.
 */
export function evaluateActivityMuhurtha(
  activity: MuhurthaActivityRule,
  dayData: {
    tithiName: string;
    varaName: string;
    nakshatraName: string;
    activeLagnaName?: string;
    isRahuKalamNow?: boolean;
    isYamagandamNow?: boolean;
    isDurmuhurthamNow?: boolean;
    isVarjyamNow?: boolean;
  },
  janmaNakshatraIndex?: number,
  dayNakshatraIndex?: number
): {
  score: number;
  grade: 'ఉత్తమం (Excellent)' | 'మధ్యమం (Moderate)' | 'వర్జ్యం (Avoid)';
  reasonsTe: string[];
  reasonsEn: string[];
  doshasDetectedTe: string[];
  doshasDetectedEn: string[];
  remedyTe?: string;
  remedyEn?: string;
} {
  let score = 75; // Baseline
  const reasonsTe: string[] = [];
  const reasonsEn: string[] = [];
  const doshasDetectedTe: string[] = [];
  const doshasDetectedEn: string[] = [];

  // Tithi check
  const tithiMatch = activity.favorableTithis.some((t) => dayData.tithiName.includes(t));
  const tithiUnfavorable = activity.unfavorableTithis.some((t) => dayData.tithiName.includes(t));

  if (tithiMatch) {
    score += 10;
    reasonsTe.push(`అనుకూల తిథి: ${dayData.tithiName}`);
    reasonsEn.push(`Favorable Tithi: ${dayData.tithiName}`);
  } else if (tithiUnfavorable) {
    score -= 20;
    doshasDetectedTe.push(`ప్రతికూల తిథి: ${dayData.tithiName}`);
    doshasDetectedEn.push(`Unfavorable Tithi: ${dayData.tithiName}`);
  }

  // Vara check
  const varaMatch = activity.favorableVaras.some((v) => dayData.varaName.includes(v));
  const varaUnfavorable = activity.unfavorableVaras.some((v) => dayData.varaName.includes(v));

  if (varaMatch) {
    score += 8;
    reasonsTe.push(`శుభ వారం: ${dayData.varaName}`);
    reasonsEn.push(`Favorable Weekday: ${dayData.varaName}`);
  } else if (varaUnfavorable) {
    score -= 15;
    doshasDetectedTe.push(`వర్జ్య వారం: ${dayData.varaName}`);
    doshasDetectedEn.push(`Inauspicious Weekday: ${dayData.varaName}`);
  }

  // Nakshatra check
  const nakMatch = activity.favorableNakshatras.some((n) => dayData.nakshatraName.includes(n));
  const nakUnfavorable = activity.unfavorableNakshatras.some((n) => dayData.nakshatraName.includes(n));

  if (nakMatch) {
    score += 12;
    reasonsTe.push(`అనుకూల నక్షత్రం: ${dayData.nakshatraName}`);
    reasonsEn.push(`Favorable Constellation: ${dayData.nakshatraName}`);
  } else if (nakUnfavorable) {
    score -= 25;
    doshasDetectedTe.push(`వర్జ్య నక్షత్రం: ${dayData.nakshatraName}`);
    doshasDetectedEn.push(`Inauspicious Constellation: ${dayData.nakshatraName}`);
  }

  // Tara Balam (if devotee's janma nakshatra is provided)
  if (
    janmaNakshatraIndex !== undefined &&
    janmaNakshatraIndex >= 0 &&
    dayNakshatraIndex !== undefined &&
    dayNakshatraIndex >= 0
  ) {
    const diff = ((dayNakshatraIndex - janmaNakshatraIndex + 27) % 9) + 1;
    // 2 (Sampat), 4 (Kshema), 6 (Sadhaka), 8 (Mitra), 9 (Parama Mitra)
    if ([2, 4, 6, 8, 9].includes(diff)) {
      score += 15;
      reasonsTe.push(`అత్యుత్తమ తారాబలం (${diff}వ తార శుభం)`);
      reasonsEn.push(`Auspicious Tara Balam (Star #${diff} favorable)`);
    } else if (diff === 7) {
      score -= 30;
      doshasDetectedTe.push(`నైధన తార (వధ తార) - శుభకార్యాలకు అత్యంత ప్రతికూలం`);
      doshasDetectedEn.push(`Naidhana Tara (Star #7) - gravely inauspicious`);
    } else if ([3, 5].includes(diff)) {
      score -= 15;
      doshasDetectedTe.push(`విపత్ లేదా ప్రత్యక్ తార - మధ్యమ ఫలం`);
      doshasDetectedEn.push(`Vipat or Pratyak Tara - requires caution`);
    }
  }

  // Inauspicious active periods
  if (dayData.isRahuKalamNow) {
    score -= 30;
    doshasDetectedTe.push('రాహు కాలం నడుస్తోంది');
    doshasDetectedEn.push('Currently Rahu Kalam');
  }
  if (dayData.isYamagandamNow) {
    score -= 20;
    doshasDetectedTe.push('యమగండ కాలం');
    doshasDetectedEn.push('Currently Yamagandam');
  }
  if (dayData.isDurmuhurthamNow) {
    score -= 20;
    doshasDetectedTe.push('దుర్ముహూర్తం నడుస్తోంది');
    doshasDetectedEn.push('Currently Durmuhurtham');
  }
  if (dayData.isVarjyamNow) {
    score -= 25;
    doshasDetectedTe.push('విష ఘటికలు (వర్జ్యం) నడుస్తున్నాయి');
    doshasDetectedEn.push('Currently Varjyam (poisonous ghatis)');
  }

  // Bound score
  score = Math.max(10, Math.min(99, score));

  let grade: 'ఉత్తమం (Excellent)' | 'మధ్యమం (Moderate)' | 'వర్జ్యం (Avoid)' = 'మధ్యమం (Moderate)';
  if (score >= 75) grade = 'ఉత్తమం (Excellent)';
  else if (score < 50) grade = 'వర్జ్యం (Avoid)';

  const remedyTe =
    activity.exemptionsPariharaluTe[0] ||
    'అభిజిత్ ముహూర్తంలో గాని లేదా గురు హోరలో ప్రారంభించినచో అనేక దోషాలు శమించును.';
  const remedyEn =
    activity.exemptionsPariharaluEn[0] ||
    'Commencing during Abhijit Muhurtha or Jupiter Hora pacifies astronomical flaws.';

  return {
    score,
    grade,
    reasonsTe,
    reasonsEn,
    doshasDetectedTe,
    doshasDetectedEn,
    remedyTe,
    remedyEn,
  };
}
