import { DayData } from '../types/panchangam';

export interface ClassicalGocharaHouseSutra {
  house: number;
  sanskritShlokaTe: string;
  sanskritShlokaEn: string;
  granthaCitationTe: string;
  granthaCitationEn: string;
  phaladeepikaMeaningTe: string;
  phaladeepikaMeaningEn: string;
  brihatSamhitaSutraTe: string;
  brihatSamhitaSutraEn: string;
  saravaliDrishtiNoteTe: string;
  saravaliDrishtiNoteEn: string;
  uttaraKalamritaRemedyRuleTe: string;
  uttaraKalamritaRemedyRuleEn: string;
  ashtakavargaBinduRuleTe: string;
  ashtakavargaBinduRuleEn: string;
  isAuspiciousGochara: boolean;
  vedhaPairHouse: number;
}

export interface GocharaVedhaEvaluation {
  isAuspiciousBase: boolean;
  vedhaPairHouse: number;
  hasObstructionVedha: boolean;
  hasVipareetaVedhaRelief: boolean;
  obstructingPlanetsTe: string[];
  obstructingPlanetsEn: string[];
  budhaExceptionApplied: boolean;
  vedhaBadgeTe: string;
  vedhaBadgeEn: string;
  vedhaExplanationTe: string;
  vedhaExplanationEn: string;
  bhriguNadiCircuitTe: string;
  bhriguNadiCircuitEn: string;
  chandraKalaNadiSecretTe: string;
  chandraKalaNadiSecretEn: string;
}

export interface ClassicalGranthaOverview {
  id: string;
  titleTe: string;
  titleEn: string;
  authorTe: string;
  authorEn: string;
  eraTe: string;
  eraEn: string;
  coreFocusTe: string;
  coreFocusEn: string;
  signatureShlokaTe: string;
  signatureShlokaMeaningTe: string;
  signatureShlokaMeaningEn: string;
  howUsedInPredictionsTe: string;
  howUsedInPredictionsEn: string;
}

export interface KundaliGranthaDecree {
  granthaId: string;
  granthaNameTe: string;
  granthaNameEn: string;
  authorTe: string;
  authorEn: string;
  chapterRefTe: string;
  chapterRefEn: string;
  sanskritShlokaTe: string;
  sutraHeadlineTe: string;
  sutraHeadlineEn: string;
  personalizedAnalysisTe: string;
  personalizedAnalysisEn: string;
  practicalGuidanceTe: string;
  practicalGuidanceEn: string;
}

/**
 * 8 IMMORTAL CLASSICAL JYOTISHA TREATISES (అష్ట మహా జ్యోతిష గ్రంథాలు)
 * Synthesized from Brihat Parashara Hora Shastra, Phaladeepika, Brihat Jataka,
 * Saravali, Jataka Parijata, Uttara Kalamrita, Sarvartha Chintamani, and Bhrigu Nandi Nadi.
 */
export const EIGHT_CLASSICAL_GRANTHAS: ClassicalGranthaOverview[] = [
  {
    id: 'bphs',
    titleTe: 'బృహత్ పరాశర హోరా శాస్త్రం (Brihat Parashara Hora Shastra)',
    titleEn: 'Brihat Parashara Hora Shastra (BPHS)',
    authorTe: 'మహర్షి పరాశరుడు (Maharshi Parashara)',
    authorEn: 'Maharshi Parashara',
    eraTe: 'వేద కాలం • మూల సిద్ధాంత గ్రంథం (97 అధ్యాయాలు)',
    eraEn: 'Vedic Era • Supreme Foundational Treatise (97 Chapters)',
    coreFocusTe: 'షోడశ వర్గ కుండలులు, వింశోత్తరి మహాదశ, రాజయోగాలు, భావాధిపతుల ఫలితాలు & సుదర్శన చక్రం',
    coreFocusEn: 'Shodashavarga Charts, Vimshottari Dasha, Raja Yogas, Bhava Lords & Sudarshana Chakra',
    signatureShlokaTe: '“హోరేతి శాస్త్రం విపులం పరాశరమునిర్మతమ్ | జన్మకాలగ్రహస్థిత్యా ఫలం వక్ష్యామి తత్త్వతః ||”',
    signatureShlokaMeaningTe: 'మహర్షి పరాశరునిచే ఉపదేశించబడిన హోరా శాస్త్రం ద్వారా జన్మకాల గ్రహ స్థితి మరియు గోచార గమనాన్ని సమన్వయం చేసి జీవుని పూర్వపుణ్య ఫలాన్ని నిర్ణయించవచ్చు.',
    signatureShlokaMeaningEn: 'Through the vast science of Hora taught by Sage Parashara, the fruits of past karma are revealed by synthesizing natal planetary placements with transits.',
    howUsedInPredictionsTe: 'రాశి స్వభావం, లగ్నాధిపతి బలం, త్రికోణ-కేంద్ర ఆధిపత్యం మరియు వింశోత్తరి దశా-అంతర్దశల కాలగమన విశ్లేషణకు మూల ప్రమాణం.',
    howUsedInPredictionsEn: 'Primary authority for evaluating Rashi nature, Lagna Lord dignity, Kendra-Trikona Raja Yogas, and Vimshottari Dasha periods.',
  },
  {
    id: 'phaladeepika',
    titleTe: 'ఫలదీపిక (Phaladeepika)',
    titleEn: 'Phaladeepika of Mantreswara',
    authorTe: 'మంత్రేశ్వరుడు (Acharya Mantreswara)',
    authorEn: 'Acharya Mantreswara',
    eraTe: '13వ–16వ శతాబ్దం • కేరళ జ్యోతిష సంప్రదాయం (28 అధ్యాయాలు)',
    eraEn: '13th–16th Century • South Indian Classical Tradition (28 Chapters)',
    coreFocusTe: 'గోచార ఫలాలు (26వ అధ్యాయం), గోచార వేధ నియమాలు, పంచ మహాపురుష యోగాలు, నీచభంగ రాజయోగం',
    coreFocusEn: 'Gochara Transits (Chapter 26), Vedha Obstruction Rules, Pancha Mahapurusha & Neecha Bhanga Yogas',
    signatureShlokaTe: '“సౌఖ్యం తేజోఽర్థలాభం జయమపి చ యశః సంపదారోగ్యమిష్టమ్ | శత్రుఘ్నం చాపి చంద్రః సృజతి నిజగృహాత్ త్ర్యాయషట్సప్తదశైకాదశస్థః ||”',
    signatureShlokaMeaningTe: 'జన్మ రాశి నుండి 1, 3, 6, 7, 10, 11 స్థానాలలో చంద్రుడు సంచరించేటప్పుడు సౌఖ్యం, తేజస్సు, ధనలాభం, శత్రుజయం, కీర్తి మరియు ఆరోగ్యాన్ని ప్రసాదిస్తాడు (వేధ లేనిచో).',
    signatureShlokaMeaningEn: 'When the Moon transits the 1st, 3rd, 6th, 7th, 10th, and 11th houses from Janma Rashi without Vedha obstruction, he bestows happiness, wealth, victory, and health.',
    howUsedInPredictionsTe: 'ప్రతిరోజూ 12 రాశుల దిన ఫలాలలో చంద్ర గోచార స్థానం మరియు దానికి ఎదురయ్యే "గోచార వేధ / వామ వేధ" (Vedha Sthana) గణనకు ప్రత్యక్ష ప్రమాణం.',
    howUsedInPredictionsEn: 'Direct mathematical basis for daily 12-Rashi lunar transit fortunes and real-time Gochara Vedha (obstruction/cancellation) checks.',
  },
  {
    id: 'brihat-jataka',
    titleTe: 'బృహజ్జాతకం & బృహత్ సంహిత (Brihat Jataka & Samhita)',
    titleEn: 'Brihat Jataka & Brihat Samhita',
    authorTe: 'ఆచార్య వరాహమిహిరుడు (Varahamihira)',
    authorEn: 'Acharya Varahamihira',
    eraTe: '6వ శతాబ్దం • ఉజ్జయిని ఖగోళ సిద్ధాంతం',
    eraEn: '6th Century CE • Ujjain Astronomical School',
    coreFocusTe: 'చంద్ర క్రియలు, నక్షత్ర పాద ఫలితాలు, గోచార అధ్యాయం (బృహత్ సంహిత 104వ అధ్యాయం), నభస యోగాలు',
    coreFocusEn: 'Chandra Kriyas, Nakshatra Pada effects, Gocharadhyaya (Brihat Samhita Ch. 104), Nabhasa Yogas',
    signatureShlokaTe: '“ఉపచయభవనగతః శశీ స్వభవనే వా శుభదః సదా నృణామ్ | ఇతరభవనగతోఽపి శుభగ్రహదృష్టో బలవాన్ భవేత్ ||”',
    signatureShlokaMeaningTe: 'చంద్రుడు ఉపచయ స్థానాలలో (3, 6, 10, 11) లేదా స్వరాశిలో ఉన్నప్పుడు సదా శుభప్రదుడు; ఇతర స్థానాలలో ఉన్నప్పటికీ శుభగ్రహ దృష్టి పొందినచో బలవంతుడై రక్షిస్తాడు.',
    signatureShlokaMeaningEn: 'The Moon in Upachaya houses (3, 6, 10, 11) or in the 1st/7th house is ever auspicious; even in other houses, benefic aspects render him protective.',
    howUsedInPredictionsTe: 'దినచర్య, ఆహార-నిద్ర నియమాలు, మానసిక స్థితి మరియు నక్షత్ర పాదాల వారీగా సూక్ష్మ గోచార ఫలితాల నిర్ణయానికి ఉపయోగపడుతుంది.',
    howUsedInPredictionsEn: 'Used for daily vitality, emotional balance, Nakshatra-pada transit nuances, and Moon-Sign personality synthesis.',
  },
  {
    id: 'saravali',
    titleTe: 'సారావళి (Saravali of Kalyana Varma)',
    titleEn: 'Saravali of King Kalyana Varma',
    authorTe: 'రాజా కల్యాణ వర్మ (Raja Kalyana Varma)',
    authorEn: 'King Kalyana Varma',
    eraTe: '10వ శతాబ్దం • వ్యాఘ్రపాద పుర రాజర్షి సంప్రదాయం (55 అధ్యాయాలు)',
    eraEn: '10th Century CE • Classical Royal Treatise (55 Chapters)',
    coreFocusTe: 'ద్విగ్రహ-త్రిగ్రహ యుతులు, చంద్రునిపై ఇతర గ్రహాల దృష్టి ఫలితాలు, ద్రేక్కాణ-నవాంశ స్వరూపాలు',
    coreFocusEn: 'Planetary Conjunctions, Planetary Aspects on Moon (Chandra Drishti Phala), Drekkana & Navamsha',
    signatureShlokaTe: '“చంద్రే గురుणा దృష్టే ధర్మमतिః కీర్తిమాన్ ధనాఢ్యశ్చ | భార్గవదృష్టే సుఖభాక్ సౌమ్యೇন బుధేన విద్యావాన్ ||”',
    signatureShlokaMeaningTe: 'చంద్రునిపై గురు దృష్టి పడినప్పుడు ధర్మబుద్ధి, కీర్తి, ధనలాభం; శుక్ర దృష్టి పడినప్పుడు సుఖభోగాలు; బుధ దృష్టి పడినప్పుడు విద్యా-వ్యాపార కౌశలం లభిస్తాయి.',
    signatureShlokaMeaningEn: 'When the Moon is aspected by Jupiter, one gains righteousness, fame, and wealth; aspected by Venus, luxury; aspected by Mercury, intellect and trade success.',
    howUsedInPredictionsTe: 'నేటి రాశిలో సంచరించే చంద్రునిపై ఏ గ్రహ దృష్టి (సూర్య, కుజ, బుధ, గురు, శుక్ర, శని దృష్టి) పడుతుందో గణించి తక్షణ ఫలితాన్ని చెప్పడానికి.',
    howUsedInPredictionsEn: 'Powers the daily Graha Drishti (Planetary Aspect on Moon) engine for each zodiac sign.',
  },
  {
    id: 'jataka-parijata',
    titleTe: 'జాతక పారిజాతం (Jataka Parijata)',
    titleEn: 'Jataka Parijata of Vaidyanatha Dikshita',
    authorTe: 'వైద్యనాథ దీక్షితులు (Vaidyanatha Dikshita)',
    authorEn: 'Vaidyanatha Dikshita',
    eraTe: '15వ శతాబ్దం • దక్షిణాది స్మార్త జ్యోతిష పీఠం (18 అధ్యాయాలు)',
    eraEn: '15th Century CE • South Indian Smartha Tradition (18 Chapters)',
    coreFocusTe: 'భావ పర్యాయ ఫలాలు, ఆయుర్దాయ నిర్ణయం, గజకేసరి-చామర-శంఖ-భేరీ రాజయోగాలు, దశా సంధి విశ్లేషణ',
    coreFocusEn: 'Bhava-Lord Permutations, Longevity, Gajakesari-Chamara-Sankha-Bheri Yogas, Dasha Sandhi',
    signatureShlokaTe: '“లగ్నాధిపో బలయుతః శుభవీక్షితో వా కేంద్రాత్రికోణగత ఏవ కరోతి రాజ్యమ్ |”',
    signatureShlokaMeaningTe: 'లగ్నాధిపతి లేదా రాశ్యాధిపతి బలవంతుడై శుభగ్రహ వీక్షణతో కేంద్ర-ত্রికోణాలలో నిలిచినప్పుడు జాతకునికి రాజతుల్యమైన గౌరవాన్ని, అఖండ విజయాన్ని ప్రసాదిస్తాడు.',
    signatureShlokaMeaningEn: 'When the Lagna or Rashi Lord is strong and aspected by benefics in a Kendra or Trikona, it confers royal authority and enduring prosperity.',
    howUsedInPredictionsTe: 'జన్మ కుండలిలో 12 భావాధిపతుల స్థితిగతులను మరియు రాజయోగాల పూర్తి స్థాయిని నిర్ధారించడానికి.',
    howUsedInPredictionsEn: 'Used in the Janma Kundali engine to evaluate the 12 Bhava Lords and classical Raja Yogas.',
  },
  {
    id: 'uttara-kalamrita',
    titleTe: 'ఉత్తర కాలామృతం (Uttara Kalamrita)',
    titleEn: 'Uttara Kalamrita of Mahakavi Kalidasa',
    authorTe: 'మహాకవి కాళిదాసు (Kalidasa)',
    authorEn: 'Mahakavi Kalidasa',
    eraTe: '17వ శతాబ్దం • వేంకటేశ్వర పీఠ సంప్రదాయం (285 శ్లోకాలు)',
    eraEn: '17th Century CE • South Indian Classical Verse Treatise',
    coreFocusTe: 'సూక్ష్మ గ్రహ కారకత్వాలు, విపరీత రాజయోగం (హర్ష, సరళ, విమల), వక్ర గ్రహ బలం, శాస్త్రోక్త శాంతి పరిహారాలు',
    coreFocusEn: 'Micro-Karakatvas, Vipareeta Raja Yogas, Retrograde Planet Strength, Scriptural Remedies',
    signatureShlokaTe: '“దుఃస్థానాధిపతిర్దుఃస్థానగతో యది విపరీతరాజయోగకృత్ ధనకీర్తిసుఖప్రదః ||”',
    signatureShlokaMeaningTe: '6, 8, 12 స్థానాల అధిపతులు ఆయా దుఃస్థానాలలోనే సంచరించినప్పుడు "విపరీత రాజయోగం" ఏర్పడి ఆకస్మిక ధనలాభం, శత్రుజయం మరియు కీర్తి కలుగుతాయి.',
    signatureShlokaMeaningEn: 'When lords of the 6th, 8th, or 12th occupy dusthana houses, they trigger Vipareeta Raja Yoga, bringing sudden victory and financial elevation.',
    howUsedInPredictionsTe: 'ప్రతి రాశికి ఆధునిక వృత్తి-వ్యాపార కారకత్వాలు మరియు గ్రహ దోషాలకు వేదోక్త శాంతి పరిహారాలను సూచించడానికి.',
    howUsedInPredictionsEn: 'Provides detailed career/life significations (Karakatvas) and authentic Vedic remedial prescriptions.',
  },
  {
    id: 'sarvartha-chintamani',
    titleTe: 'సర్వార్థ చింతామణి (Sarvartha Chintamani)',
    titleEn: 'Sarvartha Chintamani of Venkatesha Daivagna',
    authorTe: 'వెంకటేశ దైవజ్ఞుడు (Venkatesha Sharma)',
    authorEn: 'Venkatesha Daivagna',
    eraTe: '16వ శతాబ్దం • విజయనగర-దక్కన్ సాంప్రదాయం (16 అధ్యాయాలు)',
    eraEn: '16th Century CE • Vijayanagara-Deccan Tradition (16 Chapters)',
    coreFocusTe: 'దశా-భుక్తి సూక్ష్మ ఫలితాలు, ద్వాదశ భావ విశ్లేషణ, శుభ-పాప కర్తరీ యోగాలు',
    coreFocusEn: 'Dasha-Bhukti Micro-Predictions, 12-Bhava Analysis, Subha & Papa Kartari Yogas',
    signatureShlokaTe: '“దశానాథస్య గోచారే శుభరాశిగతస్య చ | తద్దశాफलం సంపూర్ణం లభతే నాత్ర సంశయః ||”',
    signatureShlokaMeaningTe: 'దశానాథుడు గోచారంలో శుభ రాశిలో సంచరించే కాలంలో ఆ మహాదశ యొక్క శుభ ఫలితాలు నూరు శాతం నిరాటంకంగా సిద్ధిస్తాయి.',
    signatureShlokaMeaningEn: 'When the ruling Dasha lord transits an auspicious sign in Gochara, the full auspicious fruits of the Dasha manifest without doubt.',
    howUsedInPredictionsTe: 'జన్మ కుండలిలోని మహాదశలను మరియు ప్రస్తుత గోచార గ్రహ సంచారాన్ని అనుసంధానించడానికి.',
    howUsedInPredictionsEn: 'Synthesizes natal Vimshottari Dasha periods with active planetary transits.',
  },
  {
    id: 'bhrigu-nandi-nadi',
    titleTe: 'భృగు నంది నాడి & చంద్రకళా నాడి (Bhrigu Nandi & Chandra Kala Nadi)',
    titleEn: 'Bhrigu Nandi Nadi & Deva Keralam (Chandra Kala Nadi)',
    authorTe: 'మహర్షి భృగువు & అచ్యుత పండితుడు (Bhrigu & Achyuta)',
    authorEn: 'Maharshi Bhrigu & Achyuta (Deva Keralam)',
    eraTe: 'ప్రాచీన తాళపత్ర నాడీ సంప్రదాయం • తమిళ/ఆంధ్ర నాడీ పీఠం',
    eraEn: 'Ancient Palm-Leaf Nadi Tradition • South Indian Nadi Lineage',
    coreFocusTe: '1-5-9 త్రికోణ గ్రహ సంబంధాలు, కర్మకారక శని & జీవకారక గురు గోచార నాడీ సూత్రాలు, చంద్ర ఘటికా ట్రిగ్గర్',
    coreFocusEn: '1-5-9 Trinal Planetary Circuits, Karma-Karaka Saturn & Jeeva-Karaka Jupiter Transit Triggers',
    signatureShlokaTe: '“జీవకర్మకారకయోః త్రికోణసంబంధే చంద్రగోచారసంయోగాత్ తత్కాలే కార్యాণাం సిద్ధిః ||”',
    signatureShlokaMeaningTe: 'జీవకారకుడైన గురువు, కర్మకారకుడైన శనిపై గోచార చంద్రుడు త్రికోణ (1-5-9) లేదా సప్తమ/లాభ సంబంధం ఏర్పరిచిన రోజున వృత్తి-ధన-శుభకార్య సిద్ధి తక్షణమే కలుగుతుంది.',
    signatureShlokaMeaningEn: 'When the transiting Moon establishes a trinal (1-5-9) or 7th/11th link with Jeeva-Karaka Jupiter and Karma-Karaka Saturn, immediate career and financial events manifest.',
    howUsedInPredictionsTe: 'భావాలతో నిమిత్తం లేకుండా గ్రహ కారకత్వాల త్రికోణ (1-5-9) సంబంధాల ద్వారా నేటి ఖచ్చితమైన సంఘటనలను (Event Prediction) గుర్తించడానికి.',
    howUsedInPredictionsEn: 'Pinpoints concrete daily and monthly life events using Nadi planetary Karakatva circuits.',
  },
];

/**
 * 12 GOCHARA BHAVA SUTRAS FROM PHALADEEPIKA (CH. 26), BRIHAT SAMHITA (CH. 104),
 * SARAVALI, AND UTTARA KALAMRITA
 */
export const CLASSICAL_GOCHARA_SUTRAS_BY_HOUSE: Record<number, ClassicalGocharaHouseSutra> = {
  1: {
    house: 1,
    sanskritShlokaTe: '“జన్మని శశీ శరీరసుఖదం మృష్టాన్నభోగప్రదం శయ్యావస్త్రవిభూషణాదిలభనం ప్రీతిం చ ధత్తే నృణామ్ ||”',
    sanskritShlokaEn: 'Janmani shashi sharira-sukhadam mrishtanna-bhogapradam shayya-vastra-vibhushanadi-labhanam pritim cha dhatte nrinam ||',
    granthaCitationTe: 'ఫలదీపిక (26.18) & వరాహమిహిర బృహత్ సంహిత (104.5)',
    granthaCitationEn: 'Phaladeepika (26.18) & Varahamihira Brihat Samhita (104.5)',
    phaladeepikaMeaningTe: 'జన్మ రాశిలో (1వ స్థానంలో) చంద్రుడు సంచరించేటప్పుడు శారీరక సౌఖ్యం, మృష్టాన్న భోజనం, నూతన వస్త్రాభరణ లాభం, మనోల్లాసం మరియు సమాజంలో గౌరవ మర్యాదలు కలుగుతాయి.',
    phaladeepikaMeaningEn: 'When the Moon transits the 1st house (Janma Rashi), one enjoys bodily comfort, delicious food, acquisition of fine garments/ornaments, and mental joy.',
    brihatSamhitaSutraTe: 'ఆచార్య వరాహమిహిరుని సూత్రం ప్రకారం జన్మ చంద్రుడు తేజస్సును, ఆత్మవిశ్వాసాన్ని పెంచి తలపెట్టిన పనులలో ఉత్సాహాన్ని ఇస్తాడు.',
    brihatSamhitaSutraEn: 'According to Varahamihira, Janma Chandra enhances personal aura, self-confidence, and enthusiasm in new undertakings.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: జన్మ చంద్రునిపై శుభగ్రహ దృష్టి ఉన్నచో రాజసన్మానం, అధికారుల మద్దతు లభిస్తుంది.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Benefic aspect on the 1st-house Moon brings honor from authorities and leadership recognition.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: చంద్ర బలం స్థిరంగా ఉండటానికి తెల్లని పుష్పాలతో శివార్చన లేదా లక్ష్మీనారాయణ ధ్యానం ఉత్తమం.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Worship Lord Shiva or Lakshmi Narayana with white flowers to amplify lunar grace.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: ఈ రాశిలో 4 లేదా అంతకంటే ఎక్కువ బిందువులు ఉంటే నేడు నూతన ప్రారంభాలకు అద్భుత సిద్ధి.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: 4 or more bindus in this sign guarantee exceptional success in new initiatives today.',
    isAuspiciousGochara: true,
    vedhaPairHouse: 5,
  },
  2: {
    house: 2,
    sanskritShlokaTe: '“విత్తక్షతిం చ కురుతే ద్వితీయభవనే గతో హిమాంశుర్నృణామ్ | కార్యాণাం చ విలంబనం స్వవచనే సంయమనం కారయేత్ ||”',
    sanskritShlokaEn: 'Vittakshatim cha kurute dwitiya-bhavane gato himamshur-nrinam | karyanam cha vilambanam swavachane samyamanam karayet ||',
    granthaCitationTe: 'ఫలదీపిక (26.19) & సారావళి గోచార ప్రకరణం',
    granthaCitationEn: 'Phaladeepika (26.19) & Saravali Gochara Prakaranam',
    phaladeepikaMeaningTe: 'ద్వితీయ స్థానంలో (2వ కుటుంబ-ధన స్థానంలో) చంద్ర సంచారం ఉన్నప్పుడు అనుకోని ఖర్చులు, పనులలో స్వల్ప జాప్యం ఉండవచ్చు; అయితే వాక్సంయమనం పాటిస్తే కుటుంబ శాంతి నిలుస్తుంది.',
    phaladeepikaMeaningEn: 'Moon in the 2nd house indicates unscheduled expenses and minor delays; practicing gentle speech preserves domestic harmony and financial safety.',
    brihatSamhitaSutraTe: 'బృహత్ సంహిత సూత్రం: సప్తమ స్థానంలో (7వ ఇంట) శుభగ్రహం ఉన్నచో "విపరీత వేధ" ఏర్పడి ద్వితీయ చంద్రుని దోషం తొలగి ధనలాభం కలుగుతుంది.',
    brihatSamhitaSutraEn: 'Brihat Samhita Rule: A planet in the 7th house creates Vipareeta Vedha, neutralizing 2nd-house delays and bringing financial gain.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: గురు లేదా బుధ సంబంధం ఏర్పడినప్పుడు వాక్చాతుర్యంతో క్లిష్టమైన సమస్యలను సైతం పరిష్కరిస్తారు.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Jupiter or Mercury influence turns 2nd-house Moon into diplomatic eloquence and wise counsel.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ లక్ష్మీ గణపతి స్తోత్ర పఠనం మరియు గోమాతకు బెల్లం సమర్పించడం వల్ల వాక్శుద్ధి, ధన రక్షణ కలుగుతాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Reciting Sri Lakshmi Ganapathi Stotram and offering jaggery to Gau Mata protects wealth and speech.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: 2వ ఇంట శుభ కక్ష్య సంచారం ఉన్న సమయంలో కుటుంబ పెద్దల సలహాతో ఆర్థిక నిర్ణయాలు తీసుకోవాలి.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Consult family elders before signing financial documents during 2nd-house transit.',
    isAuspiciousGochara: false,
    vedhaPairHouse: 7,
  },
  3: {
    house: 3,
    sanskritShlokaTe: '“తృతీయభవనే శశీ ద్రవిణలాభమారోగ్యతాం రిపుక్షయమభీష్టదాం జయమతీవ హర్షం దిశేత్ ||”',
    sanskritShlokaEn: 'Tritiya-bhavane shashi dravina-labham-arogyatam ripukshayam-abhishtadam jayam-ativa harsham dishet ||',
    granthaCitationTe: 'ఫలదీపిక (26.19) & బృహత్ పరాశర హోరా శాస్త్రం',
    granthaCitationEn: 'Phaladeepika (26.19) & Brihat Parashara Hora Shastra',
    phaladeepikaMeaningTe: 'తృతీయ స్థానంలో (3వ పరాక్రమ స్థానంలో) చంద్రుడు సంచరించేటప్పుడు విశేష ద్రవ్య లాభం, సంపూర్ణ ఆరోగ్యం, శత్రుజయం, సోదర సహకారం మరియు మనోభీష్ట సిద్ధి కలుగుతాయి.',
    phaladeepikaMeaningEn: 'Moon in the 3rd house bestows abundant financial gains, robust health, triumph over competitors, sibling support, and fulfillment of desires.',
    brihatSamhitaSutraTe: 'వరాహమిహిర బృహత్ సంహిత (104.6): తృతీయ చంద్రుడు నూతన ప్రయత్నాలలో సాహసోపేతమైన విజయాన్ని, ప్రయాణ లాభాన్ని ప్రసాదిస్తాడు.',
    brihatSamhitaSutraEn: 'Varahamihira Brihat Samhita (104.6): 3rd-house Moon grants bold victories in new ventures and profitable short journeys.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: ఉపచయ స్థానమైన 3వ ఇంట చంద్రుడు కర్మశీలతను పెంచి తక్షణ ఫలితాన్ని ఇస్తాడు.',
    saravaliDrishtiNoteEn: 'Saravali Rule: In the 3rd Upachaya house, the Moon energizes initiative and delivers swift professional rewards.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ సుబ్రహ్మణ్య లేదా ఆంజనేయ ఆరాధన వల్ల పరాక్రమ బలం రెట్టింపు అవుతుంది.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Worshipping Lord Subrahmanya or Hanuman doubles your courage and executive power.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: 9వ ఇంట వేధ లేనిచో తృతీయ చంద్రుడు నూరు శాతం రాజయోగ తుల్య ఫలితాన్ని ఇస్తాడు.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: When unobstructed by the 9th house, 3rd-house Moon delivers 100% victorious results.',
    isAuspiciousGochara: true,
    vedhaPairHouse: 9,
  },
  4: {
    house: 4,
    sanskritShlokaTe: '“చతుర్థభవనే శశీ మనసి చింతనం కార్యభారం గృహే సంయమనం తథా జననిసౌఖ్యరక్షాం వదేత్ ||”',
    sanskritShlokaEn: 'Chaturtha-bhavane shashi manasi chintanam karyabharam grihe samyamanam tatha janani-saukhya-raksham vadet ||',
    granthaCitationTe: 'ఫలదీపిక (26.20) & జాతక పారిజాతం',
    granthaCitationEn: 'Phaladeepika (26.20) & Jataka Parijata',
    phaladeepikaMeaningTe: 'చతుర్థ స్థానంలో (4వ సుఖ స్థానంలో) చంద్ర సంచారం ఉన్నప్పుడు గృహ-కార్యాలయ బాధ్యతలు పెరుగుతాయి; ఓర్పు, ప్రశాంతత పాటిస్తే గృహ సౌఖ్యం నిలుస్తుంది.',
    phaladeepikaMeaningEn: 'Moon in the 4th house increases domestic and workplace responsibilities; maintaining calm patience safeguards household peace.',
    brihatSamhitaSutraTe: 'బృహత్ సంహిత సూత్రం: దశమ స్థానంలో (10వ ఇంట) గ్రహ సంచారం ఉంటే "విపరీత వేధ" ద్వారా 4వ ఇంటి ఒత్తిడి తొలగి వృత్తిలో మేలు జరుగుతుంది.',
    brihatSamhitaSutraEn: 'Brihat Samhita Rule: Planetary presence in the 10th house triggers Vipareeta Vedha, converting 4th-house pressure into career progress.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: 4వ ఇంటి చంద్రుడు దశమ స్థానాన్ని (10వ ఇల్లు) నేరుగా వీక్షిస్తాడు కాబట్టి వృత్తిపై ఏకాగ్రత నిలుపుకోవాలి.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Since 4th-house Moon directly aspects the 10th house of career, steady focus at work is rewarded.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ దుర్గాదేవి లేదా గౌరీదేవి స్తోత్ర పఠనం వల్ల మానసిక ప్రశాంతత, మాతృ వర్గ సౌఖ్యం లభిస్తాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Chanting Sri Durga or Gauri Stotram restores inner serenity and maternal well-being.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: స్థిరాస్తి లేదా వాహన ఒప్పందాలలో పత్రాలను నిశితంగా పరిశీలించి ముందడుగు వేయాలి.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Verify property and vehicle documents carefully before finalizing agreements today.',
    isAuspiciousGochara: false,
    vedhaPairHouse: 10,
  },
  5: {
    house: 5,
    sanskritShlokaTe: '“పంచమభవనే శశీ మతివిచారణం ధీబలం సుతार्थచింతనం తథా కులదేవతాస్మరణం दिशेत् ||”',
    sanskritShlokaEn: 'Panchama-bhavane shashi mati-vicharanam dhibalam sutartha-chintanam tatha kuladevata-smaranam dishet ||',
    granthaCitationTe: 'ఫలదీపిక (26.20) & సర్వార్థ చింతామణి',
    granthaCitationEn: 'Phaladeepika (26.20) & Sarvartha Chintamani',
    phaladeepikaMeaningTe: 'పంచమ స్థానంలో (5వ పూర్వపుణ్య-బుద్ధి స్థానంలో) చంద్రుడు సంచరించేటప్పుడు లోతైన ఆలోచనలు, సంతాన భవిష్యత్తుపై ప్రణాళికలు, పరిశోధనా ఆసక్తి ఉంటాయి; ఊహాజనిత పెట్టుబడులలో జాగ్రత్త అవసరం.',
    phaladeepikaMeaningEn: 'Moon in the 5th house stimulates deep contemplation, planning for children, and research; avoid hasty speculative trades.',
    brihatSamhitaSutraTe: 'బృహత్ సంహిత సూత్రం: జన్మ రాశిలో (1వ ఇంట) గ్రహం ఉన్నచో విపరీత వేధ ఏర్పడి పంచమ చంద్రుడు గొప్ప ప్రజ్ఞను, మంత్ర సిద్ధిని ఇస్తాడు.',
    brihatSamhitaSutraEn: 'Brihat Samhita Rule: A planet in the 1st house creates Vipareeta Vedha, turning 5th-house Moon into sharp intuitive brilliance.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: 5వ ఇంటి చంద్రుడు 11వ లాభ స్థానాన్ని వీక్షిస్తాడు కనుక బుద్ధిబలంతో చేసే దీర్ఘకాలిక పనులు ఫలిస్తాయి.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Because 5th-house Moon aspects the 11th house of gains, wise long-term planning yields rich fruits.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ మేధా దక్షిణామూర్తి లేదా కులదేవతా స్మరణ వల్ల బుద్ధి వికాసం, పూర్వపుణ్య రక్షణ కలుగుతాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Praying to Sri Medha Dakshinamurthy or Kuladevata sharpens intellect and invokes past merit.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: విద్యా, బోధన, కౌన్సెలింగ్ మరియు శాస్త్ర అధ్యయనానికి ఇది అనుకూలమైన సమయం.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Favorable transit for academic study, teaching, advisory work, and spiritual mantra japa.',
    isAuspiciousGochara: false,
    vedhaPairHouse: 1,
  },
  6: {
    house: 6,
    sanskritShlokaTe: '“షష్ఠే శశీ విత్తసుఖారోగ్యలాభం శత్రుక్షయం ఋణవిమోచనం చ | కార్యాণাం సిద్ధిం కురుతే నృణాం సదా ||”',
    sanskritShlokaEn: 'Shashthe shashi vitta-sukharogya-labham shatrukshayam rina-vimochanam cha | karyanam siddhim kurute nrinam sada ||',
    granthaCitationTe: 'ఫలదీపిక (26.21) & వరాహమిహిర బృహత్ సంహిత (104.7)',
    granthaCitationEn: 'Phaladeepika (26.21) & Varahamihira Brihat Samhita (104.7)',
    phaladeepikaMeaningTe: 'షష్ఠ స్థానంలో (6వ శత్రు-రుణ-రోగ జయ స్థానంలో) చంద్ర సంచారం వల్ల ధనలాభం, ఆరోగ్య కుదుటపాటు, శత్రువులపై పైచేయి, రుణ విముక్తి మరియు పెండింగ్ పనులలో విజయం లభిస్తాయి.',
    phaladeepikaMeaningEn: 'Moon in the 6th house brings financial gain, recovery of health, victory over rivals, relief from debts, and clearance of pending tasks.',
    brihatSamhitaSutraTe: 'వరాహమిహిరుని సూత్రం: ఉపచయమైన 6వ ఇంట చంద్రుడు పోటీ పరీక్షలు, న్యాయ వ్యవహారాలు మరియు వృత్తిపరమైన సవాళ్లలో జయాన్ని ఇస్తాడు.',
    brihatSamhitaSutraEn: 'Varahamihira Rule: In the 6th Upachaya house, Moon grants triumph in competitive exams, legal matters, and workplace challenges.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: షష్ఠ చంద్రుడు కష్టపడి పనిచేసే శక్తిని, రోగనిరోధక బలాన్ని పెంపొందిస్తాడు.',
    saravaliDrishtiNoteEn: 'Saravali Rule: 6th-house Moon strengthens physical stamina, discipline, and administrative efficiency.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ విష్ణు సహస్రనామ పారాయణం లేదా లక్ష్మీ నరసింహ స్వామి స్మరణ శత్రు-రుణ బాధలను సమూలంగా తొలగిస్తుంది.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Chanting Sri Vishnu Sahasranamam or worshipping Lord Lakshmi Narasimha removes all obstacles.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: 12వ ఇంట వేధ లేనిచో షష్ఠ చంద్రుడు మొండి బకాయిలను సైతం వసూలు చేయిస్తాడు.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Unobstructed by the 12th house, 6th-house Moon recovers long-pending dues.',
    isAuspiciousGochara: true,
    vedhaPairHouse: 12,
  },
  7: {
    house: 7,
    sanskritShlokaTe: '“సప్తమే తు శశీ సౌఖ్యం వాహనాన్నధనాగమమ్ | కలత్రమిత్రసంయోగం సమ్మానం చ ప్రయచ్ఛతి ||”',
    sanskritShlokaEn: 'Saptame tu shashi saukhyam vahananna-dhanagamam | kalatra-mitra-samyogam sammanam cha prayachhati ||',
    granthaCitationTe: 'ఫలదీపిక (26.21) & బృహజ్జాతకం',
    granthaCitationEn: 'Phaladeepika (26.21) & Brihat Jataka',
    phaladeepikaMeaningTe: 'సప్తమ స్థానంలో (7వ కళత్ర-భాగస్వామ్య స్థానంలో) చంద్రుడు సంచరించేటప్పుడు దాంపత్య సౌఖ్యం, భాగస్వామ్య వ్యాపార లాభం, వాహన సౌకర్యం, మిత్రుల కలయిక మరియు సామాజిక గౌరవం లభిస్తాయి.',
    phaladeepikaMeaningEn: 'Moon in the 7th house bestows marital harmony, profitable business partnerships, comfortable travel, and social honor.',
    brihatSamhitaSutraTe: 'వరాహమిహిర బృహత్ సంహిత (104.8): సప్తమ చంద్రుడు జన్మ రాశిని నేరుగా పూర్ణ దృష్టితో చూస్తాడు కాబట్టి మనస్సు ప్రఫుల్లంగా ఉండి ధనలాభం కలుగుతుంది.',
    brihatSamhitaSutraEn: 'Varahamihira Brihat Samhita (104.8): Because 7th-house Moon casts its full aspect on Janma Rashi, it brings cheerfulness and prosperity.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: ప్రజాసంబంధాలు (PR), క్లయింట్ సమావేశాలు మరియు వివాహ శుభకార్య చర్చలకు అత్యంత అనుకూలం.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Highly auspicious for public relations, client negotiations, and marriage alliance discussions.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ లలితా సహస్రనామ / అష్టోత్తర పఠనం వల్ల కుటుంబ అన్యోన్యత, భాగస్వామ్య శుభం వర్ధిల్లుతాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Reciting Sri Lalita Ashtottaram enhances spousal harmony and business goodwill.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: 2వ ఇంట వేధ లేనిచో సప్తమ చంద్రుడు నూతన ఒప్పందాలలో గొప్ప విజయాన్ని ఇస్తాడు.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: When unobstructed by the 2nd house, 7th-house Moon ensures lucrative commercial agreements.',
    isAuspiciousGochara: true,
    vedhaPairHouse: 2,
  },
  8: {
    house: 8,
    sanskritShlokaTe: '“అష్టమస్థే విధౌ కార్యవిలంబో మానసాకులం | ఈశ్వరారాధనాత్ శాంతిః మౌనధైర్యేణ రక్షణమ్ ||”',
    sanskritShlokaEn: 'Ashtamasthe vidhau karya-vilambo manasakulam | ishwararadhanat shantih mauna-dhairyena rakshanam ||',
    granthaCitationTe: 'ఫలదీపిక (26.22) & ప్రశ్న మార్గం (చంద్రాష్టమ ప్రకరణం)',
    granthaCitationEn: 'Phaladeepika (26.22) & Prasna Marga (Chandrashtamam Rule)',
    phaladeepikaMeaningTe: 'అష్టమ స్థానంలో (8వ ఇంట - చంద్రాష్టమం) చంద్రుడు ఉన్నప్పుడు పనులలో జాప్యం, మానసిక ఆందోళన ఉండవచ్చు; కొత్త పనులు వాయిదా వేసి రొటీన్ బాధ్యతలపై దృష్టి పెట్టడం శ్రేయస్కరం.',
    phaladeepikaMeaningEn: 'Moon in the 8th house (Chandrashtamam) calls for patience, avoiding new risky ventures, and focusing calmly on routine duties.',
    brihatSamhitaSutraTe: 'బృహత్ సంహిత సూత్రం: ఏకాదశ స్థానంలో (11వ ఇంట) గ్రహం ఉన్నచో "విపరీత వేధ" ఏర్పడి చంద్రాష్టమ తీవ్రత తగ్గి దైవ రక్షణ లభిస్తుంది.',
    brihatSamhitaSutraEn: 'Brihat Samhita Rule: A planet in the 11th house creates Vipareeta Vedha, cushioning Chandrashtamam and providing protective grace.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: 8వ ఇంటి చంద్రుడు కేవలం రెండుంపావు రోజుల తాత్కాలిక పరీక్ష మాత్రమే; మౌనం, ఓర్పు సర్వదా రక్ష.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Chandrashtamam lasts only 54 hours; mindful silence and patience prevent all workplace or domestic friction.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: రుద్రాభిషేకం, మహా మృత్యుంజయ మంత్ర జపం మరియు శివ పంచాక్షరీ స్మరణ చంద్రాష్టమ దోషాన్ని సంపూర్ణంగా నివారిస్తాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Chanting Maha Mrityunjaya Mantra and Om Namah Shivaya neutralizes all 8th-house lunar obstacles.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: ఈ రెండు రోజులు వాదోపవాదాలకు, భారీ ఆర్థిక రిస్కులకు దూరంగా ఉండటం విజ్ఞుల లక్షణం.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Postpone major financial speculation and heated debates during this 2-day window.',
    isAuspiciousGochara: false,
    vedhaPairHouse: 11,
  },
  9: {
    house: 9,
    sanskritShlokaTe: '“నవమస్థే శశాంకే తు ధర్మచింతా ప్రవాసకృత్ | గురుదేవతానమస్కారాత్ పుణ్యకీర్తిర్వర్ధతే ||”',
    sanskritShlokaEn: 'Navamasthe shashanke tu dharmachinta pravasakrit | guru-devata-namaskarat punya-kirtir-vardhate ||',
    granthaCitationTe: 'ఫలదీపిక (26.22) & దేవకేరళం (చంద్రకళా నాడి)',
    granthaCitationEn: 'Phaladeepika (26.22) & Deva Keralam (Chandra Kala Nadi)',
    phaladeepikaMeaningTe: 'నవమ స్థానంలో (9వ భాగ్య-ధర్మ స్థానంలో) చంద్ర సంచారం ఉన్నప్పుడు ధర్మకార్యాలు, తీర్థయాత్రలు, దూర ప్రయాణాలు, ఉన్నత విద్యా పరిశోధన మరియు పెద్దల ఆశీస్సులు కలుగుతాయి.',
    phaladeepikaMeaningEn: 'Moon in the 9th house favors spiritual observances, long-distance connections, higher education, and blessings from elders and mentors.',
    brihatSamhitaSutraTe: 'చంద్రకళా నాడి సూత్రం: భాగ్య స్థానంలో సంచరించే చంద్రుడు పూర్వపుణ్యాన్ని తట్టిలేపి ధర్మబద్ధమైన పనులలో విజయాన్ని ఇస్తాడు.',
    brihatSamhitaSutraEn: 'Chandra Kala Nadi Rule: Moon in the 9th Bhava awakens past-life merit (Purva Punya) and rewards ethical actions.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: 9వ ఇంటి చంద్రుడు 3వ పరాక్రమ స్థానాన్ని వీక్షిస్తాడు కనుక సత్యనిష్ఠతో చేసే ప్రయత్నాలు సత్ఫలితాలను ఇస్తాయి.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Aspecting the 3rd house of effort, 9th-house Moon blesses righteous communication and study.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ వేంకటేశ్వర స్వామి దర్శనం మరియు గురు గ్రహ స్తోత్ర పఠనం భాగ్య వృద్ధిని కలుగజేస్తాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Worshipping Lord Venkateswara and Guru Brihaspati amplifies fortune and grace.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: విదేశీ వ్యవహారాలు, ఉన్నత విద్య, ఆధ్యాత్మిక దీక్షలకు అత్యంత అనుకూలమైన సమయం.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Auspicious for overseas communications, higher research, and temple visits.',
    isAuspiciousGochara: true,
    vedhaPairHouse: 3,
  },
  10: {
    house: 10,
    sanskritShlokaTe: '“దశమస్థే నిశానాథే సిద్ధిః సర్వాभिకాంక్షితా | అధికారో యశో లాభః కర్మసిద్ధిర్నిరంతరమ్ ||”',
    sanskritShlokaEn: 'Dashamasthe nishanathe siddhih sarvabhikankshita | adhikaro yasho labhah karmasiddhir-nirantaram ||',
    granthaCitationTe: 'ఫలదీపిక (26.23) & వరాహమిహిర బృహత్ సంహిత (104.9)',
    granthaCitationEn: 'Phaladeepika (26.23) & Varahamihira Brihat Samhita (104.9)',
    phaladeepikaMeaningTe: 'దశమ స్థానంలో (10వ కర్మ-రాజ్య స్థానంలో) చంద్రుడు సంచరించేటప్పుడు తలపెట్టిన ప్రతి పనిలోనూ సంపూర్ణ కార్యసిద్ధి, ఉద్యోగంలో అధికార ప్రాప్తి, పై అధికారుల ప్రశంసలు, కీర్తి మరియు ధనలాభం కలుగుతాయి.',
    phaladeepikaMeaningEn: 'Moon in the 10th house (Karma Sthana) grants complete accomplishment of goals, career authority, recognition from superiors, and wealth.',
    brihatSamhitaSutraTe: 'వరాహమిహిర బృహత్ సంహిత (104.9): దశమ చంద్రుడు ఆజ్ఞాశక్తిని, వృత్తిపరమైన ఉన్నతిని మరియు ప్రభుత్వ/అధికారిక పనులలో జయాన్ని ప్రసాదిస్తాడు.',
    brihatSamhitaSutraEn: 'Varahamihira Brihat Samhita (104.9): 10th-house Moon confers executive command, professional elevation, and success in official tasks.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: కేంద్ర-ఉపచయమైన 10వ ఇంట చంద్రుడు అత్యంత బలవంతుడై రాజయోగ తుల్య ఫలితాన్ని ఇస్తాడు.',
    saravaliDrishtiNoteEn: 'Saravali Rule: In the 10th Kendra-Upachaya house, the Moon attains peak directional strength to reward career efforts.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ ఆదిత్య హృదయ స్తోత్ర పఠనం మరియు నారాయణ స్మరణ ఉద్యోగ-వ్యాపార విజయాలను స్థిరపరుస్తాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Chanting Sri Aditya Hrudayam and Narayana Nama cements career prestige.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: 4వ ఇంట వేధ లేనిచో దశమ చంద్రుడు పదోన్నతి, నూతన కాంట్రాక్టులను శీఘ్రంగా సిద్ధింపజేస్తాడు.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Unobstructed by the 4th house, 10th-house Moon accelerates promotions and major contracts.',
    isAuspiciousGochara: true,
    vedhaPairHouse: 4,
  },
  11: {
    house: 11,
    sanskritShlokaTe: '“ఏకాదశే శశీ కuryat సర్వలాభం మనోరథమ్ | మిత్రాగమం ధనప్రాప్తిం హర్షం చైవాధికం సదా ||”',
    sanskritShlokaEn: 'Ekadashe shashi kuryat sarva-labham manoratham | mitragamam dhanapraptim harsham chaivadhikam sada ||',
    granthaCitationTe: 'ఫలదీపిక (26.23) & బృహత్ పరాశర హోరా శాస్త్రం',
    granthaCitationEn: 'Phaladeepika (26.23) & Brihat Parashara Hora Shastra',
    phaladeepikaMeaningTe: 'ఏకాదశ స్థానంలో (11వ లాభ స్థానంలో) చంద్రుడు సంచరించేటప్పుడు సర్వతోముఖ లాభం, మనోభీష్ట సిద్ధి, ఆకస్మిక ధనప్రాప్తి, మిత్రుల కలయిక మరియు గృహంలో శుభకార్య ఆనందం కలుగుతాయి.',
    phaladeepikaMeaningEn: 'Moon in the 11th house (Labha Sthana) brings all-round financial gains, fulfillment of cherished wishes, meeting with friends, and joyful prosperity.',
    brihatSamhitaSutraTe: 'వరాహమిహిర బృహత్ సంహిత (104.10): 11వ ఇంట చంద్రుడు తక్కువ శ్రమతోనే అధిక ఆదాయాన్ని, నూతన ఆస్తుల చేరికను ప్రసాదిస్తాడు.',
    brihatSamhitaSutraEn: 'Varahamihira Brihat Samhita (104.10): 11th-house Moon yields high returns on effort, recovery of dues, and material abundance.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: సర్వోత్తమ ఉపచయ స్థానమైన 11వ ఇంట చంద్రుడు వ్యాపార విస్తరణకు, పెట్టుబడులకు తిరుగులేని బలాన్ని ఇస్తాడు.',
    saravaliDrishtiNoteEn: 'Saravali Rule: In the supreme 11th Upachaya house, the Moon blesses commercial expansion and wealth creation.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ మహాలక్ష్మి అష్టకం / కనకధారా స్తోత్ర పఠనం మరియు నేతి దీపారాధన అఖండ లక్ష్మీ కటాక్షాన్ని ఇస్తాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Reciting Sri Kanakadhara Stotram and lighting a ghee lamp invokes enduring Lakshmi Kataksham.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: 8వ ఇంట వేధ లేనిచో ఏకాదశ చంద్రుడు ఆర్థిక వ్యవహారాలలో సంపూర్ణ విజయాన్ని ఇస్తాడు.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Unobstructed by the 8th house, 11th-house Moon delivers peak financial windfalls.',
    isAuspiciousGochara: true,
    vedhaPairHouse: 8,
  },
  12: {
    house: 12,
    sanskritShlokaTe: '“ద్వాదశస్థే నిశానాథే శుభకార్యার্থమర్థవ్యయః | దానధర్మక్రియాభిశ్చ పుణ్యలాభో భవేద్ధ్రువమ్ ||”',
    sanskritShlokaEn: 'Dwadashasthe nishanathe shubhakaryartham-arthavyayah | dana-dharma-kriyabhish-cha punyalabho bhaved-dhruvam ||',
    granthaCitationTe: 'ఫలదీపిక (26.24) & జాతక పారిజాతం',
    granthaCitationEn: 'Phaladeepika (26.24) & Jataka Parijata',
    phaladeepikaMeaningTe: 'ద్వాదశ స్థానంలో (12వ వ్యయ-మోక్ష స్థానంలో) చంద్ర సంచారం ఉన్నప్పుడు గృహ అవసరాలు, శుభకార్యాలు లేదా ప్రయాణాల నిమిత్తం ఖర్చులు పెరుగుతాయి; దానధర్మాలు చేయడం వల్ల ఆర్థిక నష్టం తొలగి పుణ్యఫలం లభిస్తుంది.',
    phaladeepikaMeaningEn: 'Moon in the 12th house brings expenses for family, travel, or auspicious causes; performing charity transforms expenditure into spiritual merit.',
    brihatSamhitaSutraTe: 'బృహత్ సంహిత సూత్రం: షష్ఠ స్థానంలో (6వ ఇంట) గ్రహం ఉన్నచో "విపరీత వేధ" ఏర్పడి ద్వాదశ చంద్రుని వ్యయం నియంత్రించబడుతుంది.',
    brihatSamhitaSutraEn: 'Brihat Samhita Rule: A planet in the 6th house creates Vipareeta Vedha, curbing unnecessary 12th-house expenses.',
    saravaliDrishtiNoteTe: 'సారావళి ప్రమాణం: విదేశీ కంపెనీలు (MNCs), ఎగుమతి-దిగుమతి వ్యాపారాలు మరియు ఆధ్యాత్మిక సాధనకు 12వ ఇంటి చంద్రుడు అనుకూలం.',
    saravaliDrishtiNoteEn: 'Saravali Rule: Favorable for overseas enterprises, export-import trade, meditation, and restful rejuvenation.',
    uttaraKalamritaRemedyRuleTe: 'ఉత్తర కాలామృత సూత్రం: శ్రీ ఆంజనేయ స్వామి స్తోత్ర పఠనం మరియు అన్నదానం శుభ వ్యయాన్ని, మనశ్శాంతిని ప్రసాదిస్తాయి.',
    uttaraKalamritaRemedyRuleEn: 'Uttara Kalamrita Rule: Reciting Hanuman Chalisa and offering Annadanam ensures peaceful sleep and protected finances.',
    ashtakavargaBinduRuleTe: 'అష్టకవర్గ ప్రమాణం: నేడు అప్పులు ఇవ్వడం లేదా హామీ సంతకాలు చేయడం వాయిదా వేసి, రాత్రి తగినంత విశ్రాంతి తీసుకోవాలి.',
    ashtakavargaBinduRuleEn: 'Ashtakavarga Rule: Avoid lending money or standing surety today, and prioritize restful sleep.',
    isAuspiciousGochara: false,
    vedhaPairHouse: 6,
  },
};

const RASHI_ID_ORDER = [
  'mesham',
  'vrushabham',
  'mithunam',
  'karkatakam',
  'simham',
  'kanya',
  'tula',
  'vruschikam',
  'dhanussu',
  'makaram',
  'kumbham',
  'meenam',
];

const PLANET_LIST_FOR_VEDHA: { te: string; en: string; isBudha?: boolean }[] = [
  { te: 'సూర్యుడు', en: 'Sun (Surya)' },
  { te: 'కుజుడు', en: 'Mars (Kuja)' },
  { te: 'బుధుడు', en: 'Mercury (Budha)', isBudha: true },
  { te: 'గురుడు', en: 'Jupiter (Guru)' },
  { te: 'శుక్రుడు', en: 'Venus (Shukra)' },
  { te: 'శని', en: 'Saturn (Shani)' },
  { te: 'రాహువు', en: 'Rahu' },
  { te: 'కేతువు', en: 'Ketu' },
];

/**
 * Evaluates Phaladeepika Gochara Vedha (వేధ / విపరీత వేధ) & Bhrigu Nandi Nadi Circuits
 * for a specific Rashi on the given DayData.
 */
export function evaluateClassicalGocharaVedhaAndNadi(
  day: DayData,
  rashiIdx: number,
  gocharaHouse: number
): GocharaVedhaEvaluation {
  const sutra = CLASSICAL_GOCHARA_SUTRAS_BY_HOUSE[gocharaHouse] || CLASSICAL_GOCHARA_SUTRAS_BY_HOUSE[1];
  const vedhaHouse = sutra.vedhaPairHouse;
  const vedhaRashiIdx = (rashiIdx + vedhaHouse - 1) % 12;
  const vedhaRashiId = RASHI_ID_ORDER[vedhaRashiIdx] || 'mesham';
  const planetsInVedhaSignStr = day.grahaStithi?.[vedhaRashiId] || '';

  const rawPlanetsTe: string[] = [];
  const rawPlanetsEn: string[] = [];
  let budhaFound = false;

  for (const p of PLANET_LIST_FOR_VEDHA) {
    if (planetsInVedhaSignStr.includes(p.te)) {
      if (p.isBudha) {
        budhaFound = true;
      } else {
        rawPlanetsTe.push(p.te);
        rawPlanetsEn.push(p.en);
      }
    }
  }

  const isAuspiciousBase = sutra.isAuspiciousGochara;
  const hasObstructionVedha = isAuspiciousBase && rawPlanetsTe.length > 0;
  const hasVipareetaVedhaRelief = !isAuspiciousBase && (rawPlanetsTe.length > 0 || budhaFound);

  let vedhaBadgeTe = '';
  let vedhaBadgeEn = '';
  let vedhaExplanationTe = '';
  let vedhaExplanationEn = '';

  if (isAuspiciousBase) {
    if (!hasObstructionVedha) {
      if (budhaFound) {
        vedhaBadgeTe = `నిర్వేధ శుభ గోచారం (${vedhaHouse}వ ఇంట బుధుడు - పితాపుత్ర అవేధ నియమం)`;
        vedhaBadgeEn = `Unobstructed Auspicious Transit (Mercury-Moon Exception in ${vedhaHouse}th)`;
        vedhaExplanationTe = `ఫలదీపిక (26.31) "పితాపుత్రౌ తథా సౌరిశశాంకౌ నైవ వేధకౌ" సూత్రం ప్రకారం ${vedhaHouse}వ వేధ స్థానంలో బుధుడు ఉన్నప్పటికీ చంద్ర-బుధులకు వేధ ఉండదు. కనుక ${gocharaHouse}వ ఇంటి శుభ ఫలితాలు నూరు శాతం నిరాటంకంగా సిద్ధిస్తాయి.`;
        vedhaExplanationEn = `Per Phaladeepika (26.31), Mercury in the ${vedhaHouse}th Vedha house does NOT obstruct his father the Moon. Hence, ${gocharaHouse}th-house auspicious results manifest 100% unobstructed.`;
      } else {
        vedhaBadgeTe = `నిర్వేధ పూర్ణ శుభ యోగం (${vedhaHouse}వ వేధ స్థానం శుద్ధం)`;
        vedhaBadgeEn = `100% Unobstructed Auspicious Gochara (No Vedha in ${vedhaHouse}th)`;
        vedhaExplanationTe = `ఫలదీపిక గోచార వేధ నియమం ప్రకారం ${gocharaHouse}వ ఇంటి చంద్రునికి ${vedhaHouse}వ స్థానంలో ఎటువంటి వేధ గ్రహాలు లేవు. అందువల్ల నేడు మీకు పూర్ణ చంద్ర బలం మరియు కార్యసిద్ధి లభిస్తాయి.`;
        vedhaExplanationEn = `Per Phaladeepika Gochara Vedha rules, the ${vedhaHouse}th Vedha house is completely free of obstructing planets, granting full lunar strength today.`;
      }
    } else {
      vedhaBadgeTe = `పాక్షిక గోచార వేధ (${vedhaHouse}వ ఇంట ${rawPlanetsTe.join(', ')})`;
      vedhaBadgeEn = `Partial Gochara Vedha (${rawPlanetsEn.join(', ')} in ${vedhaHouse}th House)`;
      vedhaExplanationTe = `ఫలదీపిక వేధ గణితం ప్రకారం ${gocharaHouse}వ ఇంట చంద్రుడు శుభుడే అయినప్పటికీ, ${vedhaHouse}వ వేధ స్థానంలో (${rawPlanetsTe.join(', ')}) సంచారం వల్ల పనులలో స్వల్ప ప్రయత్నం/ఓర్పు అవసరమవుతుంది. నేటి జప మంత్ర పఠనంతో వేధ తొలగి శుభం కలుగుతుంది.`;
      vedhaExplanationEn = `While Moon in the ${gocharaHouse}th house is auspicious, ${rawPlanetsEn.join(', ')} in the paired ${vedhaHouse}th house creates partial Vedha—steady perseverance and today's mantra unlock full success.`;
    }
  } else {
    if (hasVipareetaVedhaRelief) {
      const reliefNamesTe = [...rawPlanetsTe, ...(budhaFound ? ['బుధుడు'] : [])].join(', ');
      const reliefNamesEn = [...rawPlanetsEn, ...(budhaFound ? ['Mercury'] : [])].join(', ');
      vedhaBadgeTe = `విపరీత వేధ రక్షణ యోగం (${vedhaHouse}వ ఇంట ${reliefNamesTe})`;
      vedhaBadgeEn = `Vipareeta Vedha Protection (${reliefNamesEn} in ${vedhaHouse}th House)`;
      vedhaExplanationTe = `బృహత్ సంహిత & ఫలదీపిక "విపరీత వేధ" సూత్రం ప్రకారం ${gocharaHouse}వ ఇంట చంద్ర సంచారం మిశ్రమమైనప్పటికీ, దాని వేధ స్థానమైన ${vedhaHouse}వ ఇంట (${reliefNamesTe}) ఉండటం వల్ల అశుభం తొలగి రక్షణ కవచంలా పనిచేస్తుంది!`;
      vedhaExplanationEn = `By the classical rule of Vipareeta Vedha, planetary presence (${reliefNamesEn}) in the paired ${vedhaHouse}th house neutralizes the ${gocharaHouse}th-house Moon's challenges and acts as a protective shield!`;
    } else {
      vedhaBadgeTe = `సమ్యక్ సంయమన గోచారం (${gocharaHouse}వ స్థానం)`;
      vedhaBadgeEn = `Mindful Equilibrium Transit (${gocharaHouse}th House)`;
      vedhaExplanationTe = `ఫలదీపిక (26వ అధ్యాయం) ప్రకారం ${gocharaHouse}వ ఇంట చంద్ర సంచార సమయంలో తొందరపాటు నిర్ణయాలు మాని, శాస్త్రోక్త పరిహారం మరియు ప్రశాంత దినచర్య పాటించడం వల్ల సత్ఫలితాలు లభిస్తాయి.`;
      vedhaExplanationEn = `Per Phaladeepika Chapter 26, practicing calm mindfulness and reciting the prescribed mantra during ${gocharaHouse}th-house lunar transit ensures smooth progress.`;
    }
  }

  // Bhrigu Nandi Nadi & Chandra Kala Nadi Trinal (1-5-9) / Kendra Circuit Calculation
  const moonRashiIdx = (rashiIdx + gocharaHouse - 1) % 12;
  const trine1Idx = moonRashiIdx;
  const trine5Idx = (moonRashiIdx + 4) % 12;
  const trine9Idx = (moonRashiIdx + 8) % 12;
  const opp7Idx = (moonRashiIdx + 6) % 12;

  const trinePlanetsTe: string[] = [];
  const trinePlanetsEn: string[] = [];

  for (const checkIdx of [trine1Idx, trine5Idx, trine9Idx, opp7Idx]) {
    const rId = RASHI_ID_ORDER[checkIdx];
    const pStr = day.grahaStithi?.[rId] || '';
    for (const p of PLANET_LIST_FOR_VEDHA) {
      if (pStr.includes(p.te) && !trinePlanetsTe.includes(p.te)) {
        trinePlanetsTe.push(p.te);
        trinePlanetsEn.push(p.en);
      }
    }
  }

  let bhriguNadiCircuitTe = '';
  let bhriguNadiCircuitEn = '';

  if (trinePlanetsTe.includes('గురుడు') && trinePlanetsTe.includes('శని')) {
    bhriguNadiCircuitTe =
      'భృగు నంది నాడి "ధర్మ-కర్మాధిపతి నాడీ యోగం": నేడు గోచార చంద్రుడు జీవకారకుడైన గురువు మరియు కర్మకారకుడైన శనితో త్రికోణ/సప్తమ నాడీ బంధం ఏర్పరుస్తున్నాడు. వృత్తి, ఉద్యోగ బాధ్యతలలో పెద్దల ఆశీస్సులతో కీలక పురోగతి కలుగుతుంది.';
    bhriguNadiCircuitEn =
      'Bhrigu Nandi Nadi (Guru-Shani Dharma-Karma Circuit): Transiting Moon links with Jupiter (Jeeva) and Saturn (Karma) in the Nadi circuit, activating career respect and steady work execution.';
  } else if (trinePlanetsTe.includes('గురుడు')) {
    bhriguNadiCircuitTe =
      'భృగు నంది నాడి "గురు-చంద్ర జీవ నాడీ బంధం": గోచార చంద్రునికి గురువుతో త్రికోణ/కేంద్ర నాడీ సంబంధం ఏర్పడింది. ఇది గజకేసరి తుల్యమైన బుద్ధి వికాసాన్ని, శుభవార్తలను మరియు గౌరవాన్ని ప్రసాదిస్తుంది.';
    bhriguNadiCircuitEn =
      'Bhrigu Nandi Nadi (Guru-Chandra Jeeva Circuit): Transiting Moon connects with Jupiter in the Nadi trine/axis, bestowing wisdom, protection, and auspicious news.';
  } else if (trinePlanetsTe.includes('శుక్రుడు') || trinePlanetsTe.includes('బుధుడు')) {
    bhriguNadiCircuitTe =
      'భృగు నంది నాడి "లక్ష్మీ-వాణి ధన నాడీ బంధం": గోచార చంద్రుడు శుక్ర/బుధ గ్రహాలతో నాడీ సంబంధం కలిగి ఉన్నందున వాణిజ్య చర్చలు, ఆర్థిక లావాదేవీలు మరియు కుటుంబ సౌఖ్యానికి అనుకూల స్పందన లభిస్తుంది.';
    bhriguNadiCircuitEn =
      'Bhrigu Nandi Nadi (Shukra-Budha Dhana Circuit): Transiting Moon activates Venus/Mercury Nadi links, favoring financial transactions, communication, and domestic comfort.';
  } else if (trinePlanetsTe.includes('కుజుడు') || trinePlanetsTe.includes('సూర్యుడు')) {
    bhriguNadiCircuitTe =
      'భృగు నంది నాడి "ఆదిత్య-భౌమ తేజో నాడీ బంధం": గోచార చంద్రుడు రవి/కుజ గ్రహాలతో నాడీ సంబంధం పొందుతున్నందున కార్యనిర్వహణ శక్తి, ధైర్యం మరియు అధికారులతో సంప్రదింపులు ఫలిస్తాయి.';
    bhriguNadiCircuitEn =
      'Bhrigu Nandi Nadi (Surya-Kuja Tejas Circuit): Transiting Moon links with Sun/Mars, energizing decisive action, administrative tasks, and vitality.';
  } else {
    bhriguNadiCircuitTe =
      'భృగు నంది నాడి "స్వతంత్ర మనో-ప్రయాణ నాడీ గమనం": నేడు చంద్రుడు స్వతంత్ర నాడీ కక్ష్యలో సంచరిస్తూ ఆత్మపరిశీలన, ప్రశాంత ప్రణాళిక మరియు దైవ చింతనకు బలాన్ని ఇస్తున్నాడు.';
    bhriguNadiCircuitEn =
      'Bhrigu Nandi Nadi (Independent Lunar Circuit): Transiting Moon moves through a calm Nadi arc, favoring steady planning and spiritual poise.';
  }

  const chandraKalaNadiSecretTe = `దేవకేరళం (చంద్రకళా నాడి) రహస్యం: ${sutra.brihatSamhitaSutraTe} ${sutra.ashtakavargaBinduRuleTe}`;
  const chandraKalaNadiSecretEn = `Deva Keralam (Chandra Kala Nadi) Secret: ${sutra.brihatSamhitaSutraEn} ${sutra.ashtakavargaBinduRuleEn}`;

  return {
    isAuspiciousBase,
    vedhaPairHouse: vedhaHouse,
    hasObstructionVedha,
    hasVipareetaVedhaRelief,
    obstructingPlanetsTe: rawPlanetsTe,
    obstructingPlanetsEn: rawPlanetsEn,
    budhaExceptionApplied: budhaFound,
    vedhaBadgeTe,
    vedhaBadgeEn,
    vedhaExplanationTe,
    vedhaExplanationEn,
    bhriguNadiCircuitTe,
    bhriguNadiCircuitEn,
    chandraKalaNadiSecretTe,
    chandraKalaNadiSecretEn,
  };
}

const RASHI_NAMES_TE = [
  'మేష',
  'వృషభ',
  'మిథున',
  'కర్కాటక',
  'సింహ',
  'కన్యా',
  'తులా',
  'వృశ్చిక',
  'ధనుస్సు',
  'మకర',
  'కుంభ',
  'మీన',
];

const RASHI_NAMES_EN = [
  'Aries (Mesha)',
  'Taurus (Vrushabha)',
  'Gemini (Mithuna)',
  'Cancer (Karkataka)',
  'Leo (Simha)',
  'Virgo (Kanya)',
  'Libra (Tula)',
  'Scorpio (Vruschika)',
  'Sagittarius (Dhanussu)',
  'Capricorn (Makara)',
  'Aquarius (Kumbha)',
  'Pisces (Meena)',
];

const RASHI_LORDS_TE = [
  'కుజుడు',
  'శుక్రుడు',
  'బుధుడు',
  'చంద్రుడు',
  'సూర్యుడు',
  'బుధుడు',
  'శుక్రుడు',
  'కుజుడు',
  'గురుడు',
  'శని',
  'శని',
  'గురుడు',
];

const RASHI_LORDS_EN = [
  'Mars (Kuja)',
  'Venus (Shukra)',
  'Mercury (Budha)',
  'Moon (Chandra)',
  'Sun (Surya)',
  'Mercury (Budha)',
  'Venus (Shukra)',
  'Mars (Kuja)',
  'Jupiter (Guru)',
  'Saturn (Shani)',
  'Saturn (Shani)',
  'Jupiter (Guru)',
];

/**
 * Generates 8 personalized Classical Grantha Decrees for any Janma Kundali
 */
export function evaluateEightClassicalGranthasForKundali(params: {
  lagnaRashiIndex: number;
  moonRashiIndex: number;
  sunRashiIndex: number;
  nakshatraNameTe: string;
  nakshatraNameEn: string;
  planetRashis: { id: string; nameTe: string; nameEn: string; rashiIndex: number }[];
}): KundaliGranthaDecree[] {
  const { lagnaRashiIndex, moonRashiIndex, sunRashiIndex, nakshatraNameTe, nakshatraNameEn, planetRashis } = params;

  const lagnaTe = RASHI_NAMES_TE[lagnaRashiIndex] || 'మేష';
  const lagnaEn = RASHI_NAMES_EN[lagnaRashiIndex] || 'Aries';
  const lagnaLordTe = RASHI_LORDS_TE[lagnaRashiIndex] || 'కుజుడు';
  const lagnaLordEn = RASHI_LORDS_EN[lagnaRashiIndex] || 'Mars';

  const moonTe = RASHI_NAMES_TE[moonRashiIndex] || 'మేష';
  const moonEn = RASHI_NAMES_EN[moonRashiIndex] || 'Aries';

  const getPlanetHouseFromLagna = (pId: string) => {
    const p = planetRashis.find((x) => x.id === pId);
    if (!p) return 1;
    return ((p.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
  };

  const getPlanetRashiIdx = (pId: string) => {
    const p = planetRashis.find((x) => x.id === pId);
    return p ? p.rashiIndex : 0;
  };

  const guruHouse = getPlanetHouseFromLagna('jupiter');
  const shaniHouse = getPlanetHouseFromLagna('saturn');
  const shukraHouse = getPlanetHouseFromLagna('venus');
  const budhaHouse = getPlanetHouseFromLagna('mercury');
  const kujaHouse = getPlanetHouseFromLagna('mars');
  const sunHouse = ((sunRashiIndex - lagnaRashiIndex + 12) % 12) + 1;
  const moonHouse = ((moonRashiIndex - lagnaRashiIndex + 12) % 12) + 1;

  const guruMoonDiff = ((getPlanetRashiIdx('jupiter') - moonRashiIndex + 12) % 12) + 1;
  const isGajakesari = [1, 4, 7, 10].includes(guruMoonDiff);

  const sunBudhaSame = sunRashiIndex === getPlanetRashiIdx('mercury');

  // Bhrigu Nandi Nadi: Trine/Opposite check between Saturn (Karma) and Jupiter (Jeeva) or Venus (Dhana)
  const shaniRashi = getPlanetRashiIdx('saturn');
  const guruRashi = getPlanetRashiIdx('jupiter');
  const shukraRashi = getPlanetRashiIdx('venus');
  const shaniGuruDiff = ((guruRashi - shaniRashi + 12) % 12) + 1;
  const shaniShukraDiff = ((shukraRashi - shaniRashi + 12) % 12) + 1;

  return [
    {
      granthaId: 'bphs',
      granthaNameTe: '1. బృహత్ పరాశర హోరా శాస్త్రం (Brihat Parashara Hora Shastra)',
      granthaNameEn: '1. Brihat Parashara Hora Shastra (BPHS)',
      authorTe: 'మహర్షి పరాశరుడు',
      authorEn: 'Maharshi Parashara',
      chapterRefTe: 'భావ ఫలాధ్యాయం & రాజయోగాధ్యాయం (అధ్యాయం 24 & 39)',
      chapterRefEn: 'Bhava Phala & Raja Yoga Adhyaya (Ch. 24 & 39)',
      sanskritShlokaTe: '“లగ్నాధిపః స్వోచ్చసుహృత్క్షేత్రే కేంద్రత్రికోణే వా స్థితః శ్రీమాన్ కీర్తియుతః ||”',
      sutraHeadlineTe: `${lagnaTe} లగ్న ప్రమాణం • లగ్నాధిపతి ${lagnaLordTe} & సుదర్శన చక్ర బలం`,
      sutraHeadlineEn: `${lagnaEn} Ascendant Decree • Lord ${lagnaLordEn} & Sudarshana Strength`,
      personalizedAnalysisTe: `మహర్షి పరాశరుని హోరా శాస్త్రం ప్రకారం మీ జన్మ లగ్నం ${lagnaTe} లగ్నం (అధిపతి: ${lagnaLordTe}), జన్మ రాశి ${moonTe} రాశి (${nakshatraNameTe} నక్షత్రం). లగ్నం నుండి సూర్యుడు ${sunHouse}వ స్థానంలో, చంద్రుడు ${moonHouse}వ స్థానంలో, గురువు ${guruHouse}వ స్థానంలో నిలిచారు. సుదర్శన చక్ర సిద్ధాంతం ప్రకారం లగ్నం శరీర ప్రజ్ఞను, చంద్రుడు మనోబలాన్ని, సూర్యుడు ఆత్మగౌరవాన్ని సూచిస్తారు. మీ కుండలిలో కేంద్ర-త్రికోణ బలం వల్ల స్వయంకృషితో ఉన్నత స్థానానికి చేరుకునే ధర్మ-కర్మ యోగం కలదు.`,
      personalizedAnalysisEn: `According to Maharshi Parashara's BPHS, your Ascendant is ${lagnaEn} (ruled by ${lagnaLordEn}) and Moon Sign is ${moonEn} (${nakshatraNameEn}). With Sun in the ${sunHouse}th house, Moon in the ${moonHouse}th, and Jupiter in the ${guruHouse}th from Lagna, the Sudarshana triad grants strong self-made authority, resilience, and Dharmic elevation.`,
      practicalGuidanceTe: `పరాశర మహర్షి సూచన: ప్రతి గురువారం మరియు మీ లగ్నాధిపతి వారంలో కులదేవతా స్మరణ చేయడం వల్ల రాజయోగ ఫలితాలు త్వరితగతిన సిద్ధిస్తాయి.`,
      practicalGuidanceEn: `Parashara Guidance: Honor your Lagna Lord (${lagnaLordEn}) and Kuladevata weekly to unlock full Raja Yoga potential.`,
    },
    {
      granthaId: 'phaladeepika',
      granthaNameTe: '2. మంత్రేశ్వరుని ఫలదీపిక (Phaladeepika)',
      granthaNameEn: '2. Phaladeepika of Mantreswara',
      authorTe: 'ఆచార్య మంత్రేశ్వరుడు',
      authorEn: 'Acharya Mantreswara',
      chapterRefTe: 'యోగాధ్యాయం (అధ్యాయం 6) & గోచార ప్రకరణం (అధ్యాయం 26)',
      chapterRefEn: 'Yoga Adhyaya (Ch. 6) & Gochara Prakaranam (Ch. 26)',
      sanskritShlokaTe: isGajakesari
        ? '“కేంద్రే దేవగురౌ మృగాంకతనయాత్ యోగః స గౌరీపతేః గజకేసరీతి కଥିతః తేజోధనజ్ఞానదః ||”'
        : '“బుధాదిత్యౌ సాయుజ్యగతౌ నిపుణాఖ్యయోగకృత్ విద్యావినయసంపన్నః కీర్తిమాన్ జనవల్లభః ||”',
      sutraHeadlineTe: isGajakesari
        ? 'ఫలదీపిక గజకేసరి / శుభ కేంద్ర యోగ ప్రమాణం'
        : sunBudhaSame
        ? 'ఫలదీపిక బుధాదిత్య (నిపుణ) యోగ ప్రమాణం'
        : 'ఫలదీపిక శుభ కర్తరీ & భావ బల ప్రమాణం',
      sutraHeadlineEn: isGajakesari
        ? 'Phaladeepika Gajakesari / Kendra Yoga Decree'
        : sunBudhaSame
        ? 'Phaladeepika Budhaditya (Nipuna) Yoga Decree'
        : 'Phaladeepika Planetary Dignity & Yoga Decree',
      personalizedAnalysisTe: isGajakesari
        ? `మంత్రేశ్వరుని ఫలదీపిక (6వ అధ్యాయం) ప్రకారం మీ కుండలిలో చంద్రుని నుండి గురువు ${guruMoonDiff}వ కేంద్ర స్థానంలో నిలిచి పవిత్రమైన "గజకేసరి యోగం" ఏర్పరుస్తున్నాడు. దీనివల్ల సమాజంలో గౌరవ ప్రతిష్ఠలు, సంక్షోభ సమయాలలో దైవ రక్షణ, స్థిరాస్తి మరియు విజ్ఞాన సంపద లభిస్తాయి.`
        : sunBudhaSame
        ? `మంత్రేశ్వరుని ఫలదీపిక ప్రకారం మీ కుండలిలో రవి-బుధుల కలయిక వల్ల "నిపుణ (బుధాదిత్య) యోగం" ఏర్పడింది (${sunHouse}వ భావం). దీనివల్ల వాక్చాతుర్యం, లెక్కలు/సాంకేతిక/వ్యాపార నైపుణ్యం మరియు ఉన్నతాధికారుల మన్ననలు లభిస్తాయి.`
        : `మంత్రేశ్వరుని ఫలదీపిక ప్రకారం మీ కుండలిలో శుక్రుడు ${shukraHouse}వ భావంలో, బుధుడు ${budhaHouse}వ భావంలో సంచరిస్తూ బుద్ధి కుశలతను, ఆర్థిక పురోగతిని ప్రసాదిస్తున్నారు. జీవిత మధ్యభాగం నుండి ఆర్థిక స్థిరత్వం రెట్టింపు అవుతుంది.`,
      personalizedAnalysisEn: isGajakesari
        ? `Per Mantreswara's Phaladeepika (Ch. 6), Jupiter in the ${guruMoonDiff}th Kendra from the Moon forms the auspicious Gajakesari Yoga, bestowing lasting reputation, wisdom, and divine protection during life's turning points.`
        : sunBudhaSame
        ? `Per Phaladeepika, the conjunction of Sun and Mercury in the ${sunHouse}th house forms Nipuna (Budhaditya) Yoga, granting sharp analytical intellect, administrative skill, and public respect.`
        : `Per Phaladeepika, the placement of Venus in the ${shukraHouse}th house and Mercury in the ${budhaHouse}th house endows practical intelligence and progressive financial stability.`,
      practicalGuidanceTe: `ఫలదీపిక సూచన: మీ జన్మ రాశి (${moonTe}) నుండి చంద్రుడు 1, 3, 6, 7, 10, 11 స్థానాలలో వేధ రహితంగా సంచరించే రోజులలో ముఖ్యమైన ఒప్పందాలు చేసుకోండి.`,
      practicalGuidanceEn: `Phaladeepika Guidance: Schedule major agreements when the transiting Moon occupies houses 1, 3, 6, 7, 10, or 11 from your natal ${moonEn} Moon without Vedha.`,
    },
    {
      granthaId: 'brihat-jataka',
      granthaNameTe: '3. వరాహమిహిరుని బృహజ్జాతకం (Brihat Jataka)',
      granthaNameEn: '3. Brihat Jataka of Varahamihira',
      authorTe: 'ఆచార్య వరాహమిహిరుడు',
      authorEn: 'Acharya Varahamihira',
      chapterRefTe: 'రాశిశీల అధ్యాయం (అధ్యాయం 18) & నక్షత్ర ఫలాధ్యాయం (అధ్యాయం 16)',
      chapterRefEn: 'Rashi-Shila Adhyaya (Ch. 18) & Nakshatra Phala (Ch. 16)',
      sanskritShlokaTe: '“చంద్రస్థానవశాన్నృణాం మనోవృత్తిః ప్రవర్తతే | త్ర్యాయషట్సప్తదశలాభగైః శుభైః సిద్ధిరుత్తమా ||”',
      sutraHeadlineTe: `${moonTe} చంద్ర రాశి శీలము & ${nakshatraNameTe} నక్షత్ర తేజస్సు`,
      sutraHeadlineEn: `${moonEn} Lunar Temperament & ${nakshatraNameEn} Constellation Aura`,
      personalizedAnalysisTe: `వరాహమిహిరుని బృహజ్జాతకం ప్రకారం ${moonTe} రాశి మరియు ${nakshatraNameTe} నక్షత్రంలో జన్మించిన మీరు ఆత్మగౌరవం, సత్యనిష్ఠ మరియు ఆపదలో ఉన్నవారిని ఆదుకునే సహృదయం కలిగి ఉంటారు. మీ మనోకారకుడైన చంద్రుడు లగ్నం నుండి ${moonHouse}వ స్థానంలో ఉండటం వల్ల అంతర్దృష్టి (Intuition) చాలా బలంగా ఉంటుంది.`,
      personalizedAnalysisEn: `According to Varahamihira's Brihat Jataka, birth in ${moonEn} Rashi under ${nakshatraNameEn} Nakshatra endows strong self-respect, sincerity, and deep intuitive perception with the Moon in the ${moonHouse}th house.`,
      practicalGuidanceTe: `వరాహమిహిర సూచన: ప్రతి పౌర్ణమి రోజున చంద్ర దర్శనం మరియు దుర్గా/శివ ఆరాధన మీ మానసిక శక్తిని పదింతలు పెంచుతుంది.`,
      practicalGuidanceEn: `Varahamihira Guidance: Observing Pournami prayers strengthens your lunar intuition and emotional equilibrium.`,
    },
    {
      granthaId: 'saravali',
      granthaNameTe: '4. కల్యాణ వర్మ సారావళి (Saravali)',
      granthaNameEn: '4. Saravali of King Kalyana Varma',
      authorTe: 'రాజా కల్యాణ వర్మ',
      authorEn: 'King Kalyana Varma',
      chapterRefTe: 'గ్రహ యుతి & దృష్టి ఫలాధ్యాయం (అధ్యాయం 15–30)',
      chapterRefEn: 'Graha Yuti & Drishti Phala Adhyaya (Ch. 15–30)',
      sanskritShlokaTe: '“శుభగ్రహైర్వీక్షితః సంయుతో వా శశీ నరాణాం కురుతేఽర్థసిద్ధిమ్ ||”',
      sutraHeadlineTe: `సారావళి కర్మ-పరాక్రమ విశ్లేషణ (కుజుడు ${kujaHouse}వ ఇంట, శని ${shaniHouse}వ ఇంట)`,
      sutraHeadlineEn: `Saravali Action & Perseverance Matrix (Mars in ${kujaHouse}th, Saturn in ${shaniHouse}th)`,
      personalizedAnalysisTe: `కల్యాణ వర్మ రచించిన సారావళి గ్రంథ ప్రమాణం ప్రకారం మీ కుండలిలో పరాక్రమ కారకుడైన కుజుడు ${kujaHouse}వ భావంలో, కర్మకారకుడైన శని ${shaniHouse}వ భావంలో సంచరిస్తున్నారు. ఈ స్థితి వల్ల జీవితంలో ఎదురయ్యే సవాళ్లను ధైర్యంగా ఎదుర్కొని, స్వంత కాళ్లపై నిలబడి స్థిరమైన ఆస్తులను, గౌరవాన్ని నిర్మించుకుంటారు.`,
      personalizedAnalysisEn: `Per King Kalyana Varma's Saravali, Mars in the ${kujaHouse}th house and Saturn in the ${shaniHouse}th house forge an unyielding capacity to overcome obstacles and build lasting assets through self-reliant effort.`,
      practicalGuidanceTe: `సారావళి సూచన: శని-మంగళవారాలలో ఆంజనేయ స్వామి లేదా సుబ్రహ్మణ్య ఆరాధన చేయడం వల్ల కార్యవిఘ్నాలు తొలగిపోతాయి.`,
      practicalGuidanceEn: `Saravali Guidance: Worshipping Lord Hanuman or Subrahmanya on Tuesdays and Saturdays clears operational delays.`,
    },
    {
      granthaId: 'jataka-parijata',
      granthaNameTe: '5. వైద్యనాథ దీక్షితుల జాతక పారిజాతం (Jataka Parijata)',
      granthaNameEn: '5. Jataka Parijata of Vaidyanatha Dikshita',
      authorTe: 'వైద్యనాథ దీక్షితులు',
      authorEn: 'Vaidyanatha Dikshita',
      chapterRefTe: 'భావ ఫలాధ్యాయం (అధ్యాయం 11–15)',
      chapterRefEn: 'Bhava Phala Adhyaya (Ch. 11–15)',
      sanskritShlokaTe: '“భాగ్యే గురౌ వా శుభదృష్టియుక్తే ధర్మక్రియావిత్తయశోఽభివృద్ధిః ||”',
      sutraHeadlineTe: `జాతక పారిజాత భాగ్య-కుటుంబ సౌఖ్య ప్రమాణం (గురువు ${guruHouse}వ భావం)`,
      sutraHeadlineEn: `Jataka Parijata Fortune & Prosperity Decree (Jupiter in ${guruHouse}th Bhava)`,
      personalizedAnalysisTe: `వైద్యనాథ దీక్షితుల జాతక పారిజాతం ప్రకారం మీ కుండలిలో దేవగురువైన బృహస్పతి ${guruHouse}వ భావంలో నిలిచి, తన శుభ దృష్టుల ద్వారా మీ పూర్వపుణ్య మరియు కుటుంబ స్థానాలను రక్షిస్తున్నాడు. దీనివల్ల ఆర్థిక ఇబ్బందులు ఎదురైనా సరైన సమయానికి ధన సహాయం, పెద్దల ఆశీర్వాదం లభిస్తాయి.`,
      personalizedAnalysisEn: `According to Vaidyanatha Dikshita's Jataka Parijata, Jupiter placed in the ${guruHouse}th Bhava casts protective trinal aspects across your chart, ensuring timely financial providence and elder blessings.`,
      practicalGuidanceTe: `జాతక పారిజాత సూచన: గురువులకు, పండితులకు గౌరవం ఇవ్వడం మరియు అన్నదాన కార్యక్రమాలలో పాల్గొనడం మీ భాగ్య బలాన్ని పెంచుతుంది.`,
      practicalGuidanceEn: `Jataka Parijata Guidance: Respecting teachers/scholars and supporting Annadanam multiplies your 9th-house Bhagya merit.`,
    },
    {
      granthaId: 'uttara-kalamrita',
      granthaNameTe: '6. మహాకవి కాళిదాసు ఉత్తర కాలామృతం (Uttara Kalamrita)',
      granthaNameEn: '6. Uttara Kalamrita of Mahakavi Kalidasa',
      authorTe: 'మహాకవి కాళిదాసు',
      authorEn: 'Mahakavi Kalidasa',
      chapterRefTe: 'కారకత్వ & యోగ ఖండం (ఖండం 4 & 5)',
      chapterRefEn: 'Karakatva & Yoga Khanda (Sections 4 & 5)',
      sanskritShlokaTe: '“విద్యావ్యాపారవాణిజ్యకళాకౌశల్యకారకౌ బుధశుక్రౌ శుభస్థానగతౌ లక్ష్మీకటాక్షదౌ ||”',
      sutraHeadlineTe: `ఉత్తర కాలామృత సూక్ష్మ కారకత్వ & లక్ష్మీ కటాక్ష విశ్లేషణ`,
      sutraHeadlineEn: `Uttara Kalamrita Micro-Karakatva & Lakshmi Grace Analysis`,
      personalizedAnalysisTe: `మహాకవి కాళిదాసు రచించిన ఉత్తర కాలామృతం ప్రకారం మీ కుండలిలో విద్యా-వ్యాపార కారకుడైన బుధుడు (${budhaHouse}వ ఇంట), సంపద-వాహన కారకుడైన శుక్రుడు (${shukraHouse}వ ఇంట) సంచరిస్తున్నారు. ఈ కలయిక/స్థితి వల్ల ఆధునిక సాంకేతికత, వాణిజ్యం, సలహా రంగం లేదా వృత్తి నైపుణ్యాల ద్వారా గృహ-వాహన సౌఖ్యాలు సిద్ధిస్తాయి.`,
      personalizedAnalysisEn: `Per Mahakavi Kalidasa's Uttara Kalamrita, Mercury in the ${budhaHouse}th house and Venus in the ${shukraHouse}th house activate strong micro-significations for commerce, technology, advisory skills, and acquisition of home and vehicles.`,
      practicalGuidanceTe: `ఉత్తర కాలామృత సూచన: శుక్రవారం నాడు మహాలక్ష్మి అష్టోత్తర పఠనం మరియు బుధవారం విష్ణు సహస్రనామ పారాయణం ఆర్థిక వృద్ధికి పరమౌషధం.`,
      practicalGuidanceEn: `Uttara Kalamrita Guidance: Chanting Mahalakshmi Ashtottaram on Fridays and Vishnu Sahasranamam on Wednesdays sustains wealth inflow.`,
    },
    {
      granthaId: 'sarvartha-chintamani',
      granthaNameTe: '7. వెంకటేశ దైవజ్ఞుని సర్వార్థ చింతామణి (Sarvartha Chintamani)',
      granthaNameEn: '7. Sarvartha Chintamani of Venkatesha Daivagna',
      authorTe: 'వెంకటేశ దైవజ్ఞుడు',
      authorEn: 'Venkatesha Daivagna',
      chapterRefTe: 'దశా ఫలాధ్యాయం & దశమ భావ విచారణ',
      chapterRefEn: 'Dasha Phala & Dashama Bhava Prakaranam',
      sanskritShlokaTe: '“దశమస్థగ్రహైర్వాపి దశమేశేన సంయుతైః | నరో భవతి కర్మాఢ్యో రాజమాన్యో ధనాన్వితః ||”',
      sutraHeadlineTe: `సర్వార్థ చింతామణి దశా-గోచార సమన్వయ సూత్రం`,
      sutraHeadlineEn: `Sarvartha Chintamani Dasha-Transit Synthesis Decree`,
      personalizedAnalysisTe: `వెంకటేశ దైవజ్ఞుని సర్వార్థ చింతామణి ప్రకారం జాతకునికి మహాదశ నాథుడు మరియు గోచార గురు-శనులు అనుకూల రాశులలో ప్రవేశించినప్పుడే కర్మఫలం పరిపక్వమవుతుంది. మీ ${lagnaTe} లగ్నానికి మరియు ${moonTe} రాశికి వచ్చే 3 నుండి 5 సంవత్సరాల కాలంలో వృత్తిపరమైన స్థిరత్వం, కుటుంబంలో శుభకార్య నిర్వహణ స్పష్టంగా కనిపిస్తున్నాయి.`,
      personalizedAnalysisEn: `According to Venkatesha Daivagna's Sarvartha Chintamani, natal promises mature when the active Dasha lord aligns with transiting Jupiter and Saturn. For your ${lagnaEn} Lagna and ${moonEn} Moon, the coming cycle strongly favors career consolidation and auspicious family milestones.`,
      practicalGuidanceTe: `సర్వార్థ చింతామణి సూచన: దశా సంధి కాలాలలో నవగ్రహ ప్రదక్షిణ లేదా రుద్రాభిషేకం జరిపించడం వల్ల శుభ ఫలితాలు నిరాటంకంగా అందుతాయి.`,
      practicalGuidanceEn: `Sarvartha Chintamani Guidance: Perform Navagraha prayers or Rudrabhishekam during Dasha transitions for seamless progress.`,
    },
    {
      granthaId: 'bhrigu-nandi-nadi',
      granthaNameTe: '8. భృగు నంది నాడి & చంద్రకళా నాడి (Bhrigu Nandi & Chandra Kala Nadi)',
      granthaNameEn: '8. Bhrigu Nandi Nadi & Chandra Kala Nadi',
      authorTe: 'మహర్షి భృగువు & అచ్యుత పండితుడు',
      authorEn: 'Maharshi Bhrigu & Achyuta',
      chapterRefTe: 'కర్మ-జీవ నాడీ త్రికోణ సూత్రం (Nadi Karakatva Sutra)',
      chapterRefEn: 'Karma-Jeeva Trinal Nadi Circuit',
      sanskritShlokaTe: '“మందజీవయోః త్రికోణే వా సప్తమే ధనకర్మవృద్ధిః నిశ్చితా ||”',
      sutraHeadlineTe: `భృగు నంది నాడి కర్మకారక శని – జీవకారక గురు – ధనకారక శుక్ర సర్క్యూట్`,
      sutraHeadlineEn: `Bhrigu Nandi Nadi Saturn (Karma) – Jupiter (Jeeva) – Venus (Dhana) Circuit`,
      personalizedAnalysisTe: `భృగు నంది నాడి రహస్య సూత్రం ప్రకారం మీ జన్మ కుండలిలో కర్మకారకుడైన శని నుండి జీవకారకుడైన గురువు ${shaniGuruDiff}వ రాశిలో, ధనకారకుడైన శుక్రుడు ${shaniShukraDiff}వ రాశిలో నిలిచారు. ${
        [1, 5, 9, 7, 11].includes(shaniGuruDiff)
          ? 'శని-గురువుల మధ్య బలమైన నాడీ సంబంధం ఉన్నందువల్ల ధర్మబద్ధమైన వృత్తి, గౌరవప్రదమైన ఉద్యోగం/వ్యాపారం మరియు సమాజంలో ప్రత్యేక గుర్తింపు లభిస్తాయి.'
          : 'శని-గురు-శుక్ర గ్రహాల గమనం వల్ల కఠిన శ్రమ తర్వాత తిరుగులేని ఆర్థిక పురోగతి, స్వంత గృహ యోగం మరియు కుటుంబ అభివృద్ధి నిశ్చయంగా సిద్ధిస్తాయి.'
      }`,
      personalizedAnalysisEn: `By Bhrigu Nandi Nadi directional rules, from Karma-Karaka Saturn, Jeeva-Karaka Jupiter is in the ${shaniGuruDiff}th sign and Dhana-Karaka Venus is in the ${shaniShukraDiff}th sign. ${
        [1, 5, 9, 7, 11].includes(shaniGuruDiff)
          ? 'This forms a powerful Dharma-Karma Nadi link, guaranteeing dignified career authority, ethical wealth, and social respect.'
          : 'This Nadi progression ensures that disciplined perseverance blossoms into enduring financial prosperity and property ownership.'
      }`,
      practicalGuidanceTe: `నాడీ గ్రంథ సూచన: గోచార గురువు మీ జన్మ శని, శుక్ర లేదా చంద్రునిపై త్రికోణ (1, 5, 9) దృష్టి వేసిన ప్రతి సంవత్సరం మీ జీవితంలో ఒక పెద్ద శుభ పరిణామం జరుగుతుంది.`,
      practicalGuidanceEn: `Nadi Guidance: Every year when transiting Jupiter casts a trinal (1-5-9) aspect on your natal Saturn, Venus, or Moon, a major milestone in career or wealth is triggered.`,
    },
  ];
}
