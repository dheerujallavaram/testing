import { KundaliPlanetDetail } from './astronomyPanchangam';

export interface SaptamaMarriageAnalysis {
  saptamaRashiTe: string;
  saptamaRashiEn: string;
  saptamaLordTe: string;
  saptamaLordEn: string;
  saptamaLordHouse: number;
  occupantPlanetsTe: string[];
  occupantPlanetsEn: string[];
  spouseAppearanceAndNatureTe: string;
  spouseAppearanceAndNatureEn: string;
  spouseCareerAndFamilyTe: string;
  spouseCareerAndFamilyEn: string;
  marriageTypeBadgeTe: string;
  marriageTypeBadgeEn: string;
  marriageTypeAnalysisTe: string;
  marriageTypeAnalysisEn: string;
  marriageTimingTitleTe: string;
  marriageTimingTitleEn: string;
  marriageTimingDetailsTe: string;
  marriageTimingDetailsEn: string;
  favorableAgesTe: string;
  favorableAgesEn: string;
  kujaDoshaPercentage: number;
  kujaDoshaTitleTe: string;
  kujaDoshaTitleEn: string;
  kujaDoshaExplanationTe: string;
  kujaDoshaExplanationEn: string;
  kalasarpaStatusTe: string;
  kalasarpaStatusEn: string;
  kalasarpaDetailTe: string;
  kalasarpaDetailEn: string;
  remedyMetalAndDayTe: string;
  remedyMetalAndDayEn: string;
  remedyJapaScheduleTe: string;
  remedyJapaScheduleEn: string;
}

const RASHI_LORD_MAP: Record<
  number,
  {
    rashiTe: string;
    rashiEn: string;
    lordId: string;
    lordTe: string;
    lordEn: string;
    signSpouseTe: string;
    signSpouseEn: string;
  }
> = {
  0: {
    rashiTe: 'మేష రాశి',
    rashiEn: 'Aries (Mesha)',
    lordId: 'mars',
    lordTe: 'కుజుడు (Mars)',
    lordEn: 'Mars (Kuja)',
    signSpouseTe:
      'సప్తమ స్థానంలో మేష రాశి ఉన్నందున మీ జీవిత భాగస్వామి చురుకైన వ్యక్తిత్వం, స్వతంత్ర భావాలు, ధైర్యం మరియు వేగంగా నిర్ణయాలు తీసుకునే స్వభావం కలిగి ఉంటారు. నిజాయితీగా మాట్లాడటం, నాయకత్వ లక్షణాలు మరియు ఆత్మగౌరవం వీరిలో ప్రముఖంగా కనిపిస్తాయి.',
    signSpouseEn:
      'With Aries in the 7th house, your life partner possesses dynamic energy, independence, courage, and decisive leadership qualities with a straightforward and enterprising nature.',
  },
  1: {
    rashiTe: 'వృషభ రాశి',
    rashiEn: 'Taurus (Vrishabha)',
    lordId: 'venus',
    lordTe: 'శుక్రుడు (Venus)',
    lordEn: 'Venus (Shukra)',
    signSpouseTe:
      'సప్తమ స్థానంలో వృషభ రాశి ఉన్నందున మీ జీవిత భాగస్వామి ఆకర్షణీయమైన రూపం, ప్రశాంతమైన మనస్సు, కళాభిరుచి మరియు కుటుంబం పట్ల అపారమైన అంకితభావం కలిగి ఉంటారు. ఆర్థిక క్రమశిక్షణ, సంగీత-సాహిత్యాలపై ఆసక్తి మరియు గృహ అలంకరణపై శ్రద్ధ ఎక్కువగా ఉంటుంది.',
    signSpouseEn:
      'With Taurus in the 7th house, your spouse is blessed with graceful features, artistic refinement, deep loyalty to the home, and strong financial prudence.',
  },
  2: {
    rashiTe: 'మిథున రాశి',
    rashiEn: 'Gemini (Mithuna)',
    lordId: 'mercury',
    lordTe: 'బుధుడు (Mercury)',
    lordEn: 'Mercury (Budha)',
    signSpouseTe:
      'సప్తమ స్థానంలో మిథున రాశి ఉన్నందున మీ జీవిత భాగస్వామి ఉన్నత విద్యావంతులు, చక్కని వాక్చాతుర్యం, హాస్యచతురత మరియు స్నేహశీల స్వభావం కలిగి ఉంటారు. రచన, బోధన, ఐటీ, వాణిజ్య లేదా కమ్యూనికేషన్ రంగాలలో రాణిస్తారు.',
    signSpouseEn:
      'With Gemini in the 7th house, your partner is intellectually sharp, articulate, friendly, and excels in education, technology, commerce, or communication.',
  },
  3: {
    rashiTe: 'కర్కాటక రాశి',
    rashiEn: 'Cancer (Karkataka)',
    lordId: 'moon',
    lordTe: 'చంద్రుడు (Moon)',
    lordEn: 'Moon (Chandra)',
    signSpouseTe:
      'సప్తమ స్థానంలో కర్కాటక రాశి ఉన్నందున మీ జీవిత భాగస్వామి ప్రసన్నమైన ముఖవర్చస్సు, దయాగుణం, కుటుంబాన్ని కంటికి రెప్పలా కాపాడే మాతృ/పితృ వాత్సల్యం కలిగి ఉంటారు. బంధుమిత్రులలో మంచి గౌరవం మరియు సేవాభావం ఉంటాయి.',
    signSpouseEn:
      'With Cancer in the 7th house, your spouse is deeply nurturing, compassionate, family-centered, and brings emotional warmth and social respect to the household.',
  },
  4: {
    rashiTe: 'సింహ రాశి',
    rashiEn: 'Leo (Simha)',
    lordId: 'sun',
    lordTe: 'సూర్యుడు (Sun)',
    lordEn: 'Sun (Surya)',
    signSpouseTe:
      'సప్తమ స్థానంలో సింహ రాశి ఉన్నందున మీ జీవిత భాగస్వామి గంభీరమైన రూపం, ఉన్నత ఆశయాలు, ఉదార స్వభావం మరియు పరిపాలనా దక్షత కలిగి ఉంటారు. గౌరవప్రదమైన కుటుంబ నేపథ్యం నుండి వచ్చి సమాజంలో ప్రత్యేక గుర్తింపు పొందుతారు.',
    signSpouseEn:
      'With Leo in the 7th house, your partner exhibits royal dignity, generosity, administrative talent, and strong moral integrity from a respected background.',
  },
  5: {
    rashiTe: 'కన్యా రాశి',
    rashiEn: 'Virgo (Kanya)',
    lordId: 'mercury',
    lordTe: 'బుధుడు (Mercury)',
    lordEn: 'Mercury (Budha)',
    signSpouseTe:
      'సప్తమ స్థానంలో కన్యా రాశి ఉన్నందున మీ జీవిత భాగస్వామి వివేకం, పరిశీలనా జ్ఞానం, మర్యాదపూర్వకమైన ప్రవర్తన మరియు క్రమశిక్షణ కలిగి ఉంటారు. ఆర్థిక ప్రణాళిక, విద్య, వైద్యం లేదా ఆడిటింగ్ రంగాలలో నైపుణ్యం కలిగి ఉంటారు.',
    signSpouseEn:
      'With Virgo in the 7th house, your spouse is methodical, polite, analytical, and skilled in financial management, healthcare, academics, or administration.',
  },
  6: {
    rashiTe: 'తులా రాశి',
    rashiEn: 'Libra (Tula)',
    lordId: 'venus',
    lordTe: 'శుక్రుడు (Venus)',
    lordEn: 'Venus (Shukra)',
    signSpouseTe:
      'సప్తమ స్థానంలో తులా రాశి ఉన్నందున మీ జీవిత భాగస్వామి న్యాయబుద్ధి, సమతుల్య ఆలోచన, ఆకర్షణీయమైన వ్యక్తిత్వం మరియు సంప్రదాయాల పట్ల గౌరవం కలిగి ఉంటారు. దాంపత్యంలో పరస్పర గౌరవానికి, శాంతికి పెద్దపీట వేస్తారు.',
    signSpouseEn:
      'With Libra in the 7th house, your life partner is fair-minded,diplomatic, charming, and deeply committed to harmony, balance, and cultural values.',
  },
  7: {
    rashiTe: 'వృశ్చిక రాశి',
    rashiEn: 'Scorpio (Vruschika)',
    lordId: 'mars',
    lordTe: 'కుజుడు (Mars)',
    lordEn: 'Mars (Kuja)',
    signSpouseTe:
      'సప్తమ స్థానంలో వృశ్చిక రాశి ఉన్నందున మీ జీవిత భాగస్వామి లోతైన ఆలోచనా శక్తి, పట్టుదల, పరిశోధనా స్వభావం మరియు కష్టకాలంలో అండగా నిలిచే మనోధైర్యం కలిగి ఉంటారు. వైద్యం, సాంకేతిక లేదా రక్షణ రంగాలలో రాణించే అవకాశం ఉంటుంది.',
    signSpouseEn:
      'With Scorpio in the 7th house, your spouse possesses deep intuition, unwavering determination, resilience, and aptitude for research, medicine, or engineering.',
  },
  8: {
    rashiTe: 'ధనుస్సు రాశి',
    rashiEn: 'Sagittarius (Dhanussu)',
    lordId: 'jupiter',
    lordTe: 'గురుడు (Jupiter)',
    lordEn: 'Jupiter (Guru)',
    signSpouseTe:
      'సప్తమ స్థానంలో ధనుస్సు రాశి ఉన్నందున మీ జీవిత భాగస్వామి ధర్మబద్ధమైన నడవడిక, దైవభక్తి, పెద్దల పట్ల గౌరవం మరియు ఉన్నత విద్యా సంపన్నత కలిగి ఉంటారు. వీరి రాకతో కుటుంబంలో శుభకార్యాలు మరియు గౌరవ మర్యాదలు పెరుగుతాయి.',
    signSpouseEn:
      'With Sagittarius in the 7th house, your spouse is principled, spiritually inclined, well-educated, and brings wisdom and auspiciousness to the family.',
  },
  9: {
    rashiTe: 'మకర రాశి',
    rashiEn: 'Capricorn (Makara)',
    lordId: 'saturn',
    lordTe: 'శని (Saturn)',
    lordEn: 'Saturn (Shani)',
    signSpouseTe:
      'సప్తమ స్థానంలో మకర రాశి ఉన్నందున మీ జీవిత భాగస్వామి కష్టపడి పైకి వచ్చే తత్వం, బాధ్యతాయుతమైన ప్రవర్తన, ఓర్పు మరియు స్థిరమైన ఆర్థిక లక్ష్యాలు కలిగి ఉంటారు. కుటుంబానికి భద్రతను, దీర్ఘకాలిక ఆస్తులను సమకూరుస్తారు.',
    signSpouseEn:
      'With Capricorn in the 7th house, your partner is hardworking, practical, patient, and dedicated to building long-term family stability and assets.',
  },
  10: {
    rashiTe: 'కుంభ రాశి',
    rashiEn: 'Aquarius (Kumbha)',
    lordId: 'saturn',
    lordTe: 'శని (Saturn)',
    lordEn: 'Saturn (Shani)',
    signSpouseTe:
      'సప్తమ స్థానంలో కుంభ రాశి ఉన్నందున మీ జీవిత భాగస్వామి సేవాభావం, ఆధునిక-సాంప్రదాయ సమన్వయం, స్థిరమైన అభిప్రాయాలు మరియు నిజాయితీ కలిగి ఉంటారు. సాంకేతిక, సామాజిక లేదా ఉన్నత వృత్తులలో విజయం సాధిస్తారు.',
    signSpouseEn:
      'With Aquarius in the 7th house, your spouse is steady, humanitarian, ethical, and achieves lasting success through perseverance and intellect.',
  },
  11: {
    rashiTe: 'మీన రాశి',
    rashiEn: 'Pisces (Meena)',
    lordId: 'jupiter',
    lordTe: 'గురుడు (Jupiter)',
    lordEn: 'Jupiter (Guru)',
    signSpouseTe:
      'సప్తమ స్థానంలో మీన రాశి ఉన్నందున మీ జీవిత భాగస్వామి సాత్విక స్వభావం, కరుణ, ఆధ్యాత్మిక చింతన మరియు కలుపుగోలుతనం కలిగి ఉంటారు. వివాహానంతరం అదృష్టం, ధన సమృద్ధి మరియు మనశ్శాంతి కలుగుతాయి.',
    signSpouseEn:
      'With Pisces in the 7th house, your life partner is gentle, empathetic, spiritually blessed, and brings post-marital prosperity and peace.',
  },
};

const SEVENTH_LORD_IN_HOUSES: Record<number, { te: string; en: string }> = {
  1: {
    te: 'సప్తమాధిపతి 1వ స్థానం (లగ్నం)లో ఉన్నందున జీవిత భాగస్వామి మీ పట్ల అత్యంత ప్రేమ, అనుబంధం కలిగి ఉంటారు; తెలిసిన వారి ద్వారా లేదా స్వయం ఎంపికతో వివాహం జరిగే సూచన.',
    en: '7th Lord in the 1st House indicates a deeply devoted partner who shares your core values and life direction.',
  },
  2: {
    te: 'సప్తమాధిపతి 2వ స్థానం (కుటుంబ-ధన భావం)లో ఉన్నందున వివాహానంతరం ఆర్థిక వృద్ధి, బంధువుల సహకారం మరియు కుటుంబ సంపద పెరుగుతాయి.',
    en: '7th Lord in the 2nd House brings financial growth, family expansion, and material prosperity after marriage.',
  },
  3: {
    te: 'సప్తమాధిపతి 3వ స్థానంలో ఉన్నందున భాగస్వామి ధైర్యవంతులు, స్వయంకృషితో ఎదిగే తత్వం కలిగి ఉంటారు; దగ్గరి ప్రయాణాలు లేదా పరిచయాల ద్వారా సంబంధం కుదురుతుంది.',
    en: '7th Lord in the 3rd House gives a courageous, communicative, and self-made life partner.',
  },
  4: {
    te: 'సప్తమాధిపతి 4వ స్థానం (సుఖ భావం)లో ఉన్నందున వివాహానంతరం నూతన గృహ-వాహన యోగం, మాతృ వర్గ ఆశీస్సులు మరియు సంపూర్ణ గృహ సౌఖ్యం లభిస్తాయి.',
    en: '7th Lord in the 4th House bestows domestic happiness, real estate/vehicle gains, and harmonious family life.',
  },
  5: {
    te: 'సప్తమాధిపతి 5వ స్థానం (పంచమ కోణం)లో ఉన్నందున దంపతుల మధ్య గాఢమైన అనురాగం, మేధాసంపన్నత మరియు ఉత్తమ సంతాన సౌభాగ్యం కలుగుతాయి.',
    en: '7th Lord in the 5th House creates deep affection, intellectual compatibility, and auspicious progeny.',
  },
  6: {
    te: 'సప్తమాధిపతి 6వ స్థానంలో ఉన్నందున భాగస్వామి వైద్య, న్యాయ, ప్రభుత్వ లేదా సేవా రంగాలలో ఉండే అవకాశం ఉంది; పరస్పర ఓర్పుతో వ్యవహరిస్తే దాంపత్యం స్థిరంగా ఉంటుంది.',
    en: '7th Lord in the 6th House often indicates a spouse in medicine, law, or public service; mutual patience ensures steady harmony.',
  },
  7: {
    te: 'సప్తమాధిపతి స్వస్థానమైన 7వ ఇంట ఉన్నందున (స్వగృహ బలం) భాగస్వామి ఉన్నత వ్యక్తిత్వం, ఆరోగ్యం మరియు సమాజంలో గొప్ప గౌరవం కలిగి ఉంటారు.',
    en: '7th Lord in the 7th House is a powerful placement granting a dignified, loyal, and prosperous life partner.',
  },
  8: {
    te: 'సప్తమాధిపతి 8వ స్థానంలో ఉన్నందున వివాహ విషయంలో జాతక పొంతన, కుజ-గురు బలం క్షుణ్ణంగా చూసి ముహూర్తం నిర్ణయించడం వల్ల దీర్ఘకాలిక సౌఖ్యం లభిస్తుంది.',
    en: '7th Lord in the 8th House calls for careful chart matching and Vedic Shanti to ensure smooth marital understanding.',
  },
  9: {
    te: 'సప్తమాధిపతి 9వ స్థానం (భాగ్య స్థానం)లో ఉన్నందున వివాహం తర్వాత అఖండ అదృష్ట యోగం, దైవ కటాక్షం మరియు పెద్దల ఆశీర్వాదం పుష్కలంగా లభిస్తాయి.',
    en: '7th Lord in the 9th House triggers fortune, spiritual growth, and prosperity immediately following marriage.',
  },
  10: {
    te: 'సప్తమాధిపతి 10వ స్థానం (రాజ్య-కర్మ భావం)లో ఉన్నందున జీవిత భాగస్వామి ఉన్నత ఉద్యోగం/వ్యాపారంలో రాణిస్తారు; వివాహం వల్ల మీ వృత్తి జీవితం కూడా ఉన్నత స్థాయికి చేరుతుంది.',
    en: '7th Lord in the 10th House indicates a career-oriented, respected spouse who elevates your professional status.',
  },
  11: {
    te: 'సప్తమాధిపతి 11వ స్థానం (లాభ భావం)లో ఉన్నందున వివాహానంతరం బహుముఖ ఆదాయం, కోరికల నెరవేర్పు మరియు సంతోషకరమైన వైవాహిక జీవితం లభిస్తాయి.',
    en: '7th Lord in the 11th House brings abundant financial gains, supportive social networks, and fulfillment of desires.',
  },
  12: {
    te: 'సప్తమాధిపతి 12వ స్థానంలో ఉన్నందున దూర ప్రాంతం లేదా విదేశీ సంబంధం కుదిరే అవకాశం ఉంటుంది; ఆధ్యాత్మిక కార్యక్రమాలలో దంపతులు కలిసి పాల్గొంటారు.',
    en: '7th Lord in the 12th House favors marriage connections from distant cities/abroad and shared spiritual pursuits.',
  },
};

const PLANET_JAPA_REMEDY: Record<
  string,
  { metalDayTe: string; metalDayEn: string; japaTe: string; japaEn: string }
> = {
  sun: {
    metalDayTe: 'రాగి/బంగారు యంత్ర ఆరాధన · ఆదివారం ఉదయం సూర్య నమస్కారాలు',
    metalDayEn: 'Copper/Gold Surya Upasana · Sunday Morning Prayers',
    japaTe: 'సూర్య గ్రహ శాంతి కొరకు 28 రోజుల దీక్ష (రోజుకు 1,000 మంత్ర జపం) లేదా ఆదిత్య హృదయ పారాయణ.',
    japaEn: '28-day Vedic Surya Japa schedule (1,000 chants/day) or daily Aditya Hrudayam recitation.',
  },
  moon: {
    metalDayTe: 'వెండి ప్రతిమ/యంత్ర ఆరాధన · సోమవారం సాయంత్రం శివ/గౌరీ అర్చన',
    metalDayEn: 'Silver Chandra Upasana · Monday Evening Shiva-Gauri Worship',
    japaTe: 'చంద్ర బలం కొరకు 44 రోజుల జప నియమం మరియు పౌర్ణమి అభిషేకం.',
    japaEn: '44-day Vedic Chandra Mantra cycle and Monday Rudrabhishekam.',
  },
  mars: {
    metalDayTe: 'రాగి యంత్ర ఆరాధన · మంగళవారం మధ్యాహ్నం సుబ్రహ్మణ్య స్వామి అర్చన',
    metalDayEn: 'Copper Kuja Yantra · Tuesday Subrahmanya Worship',
    japaTe: 'కుజ దోష నివారణకు 40 రోజుల కుజ మంత్ర జపం, కందుల దానం మరియు సుబ్రహ్మణ్య అభిషేకం.',
    japaEn: '40-day Kuja Mantra Japa discipline, red lentil dana, and Subrahmanya Abhishekam.',
  },
  mercury: {
    metalDayTe: 'కంచు/ఇత్తడి ఆరాధన · బుధవారం ఉదయం శ్రీ విష్ణు సహస్రనామ పారాయణ',
    metalDayEn: 'Brass/Bell-Metal Upasana · Wednesday Vishnu Sahasranama',
    japaTe: 'బుధ గ్రహ అనుగ్రహం కొరకు 36 రోజుల జప నియమం మరియు తులసి అర్చన.',
    japaEn: '36-day Budha Mantra Japa cycle and Wednesday Tulasi Archana.',
  },
  jupiter: {
    metalDayTe: 'బంగారు/పసుపు పూజా విధానం · గురువారం ఉదయం దక్షిణామూర్తి / దత్తాత్రేయ ఆరాధన',
    metalDayEn: 'Gold/Turmeric Guru Upasana · Thursday Dakshinamurthy Worship',
    japaTe: 'శీఘ్ర వివాహ యోగం కొరకు 76 రోజుల గురు మంత్ర జపం మరియు శనగల నైవేద్యం.',
    japaEn: '76-day Brihaspati Japa cycle on Thursdays for auspicious marriage blessings.',
  },
  venus: {
    metalDayTe: 'వెండి ఆరాధన · శుక్రవారం ఉదయం/సాయంత్రం శ్రీ మహాలక్ష్మి అష్టోత్తరం',
    metalDayEn: 'Silver Shukra Upasana · Friday Sri Mahalakshmi Worship',
    japaTe: 'కళత్ర సౌఖ్యం కొరకు 64 రోజుల శుక్ర మంత్ర జపం మరియు గోపూజ.',
    japaEn: '64-day Shukra Mantra cycle on Fridays for marital harmony and prosperity.',
  },
  saturn: {
    metalDayTe: 'ఇనుము/నీల ఆరాధన · శనివారం సాయంత్రం తిల తైలాభిషేకం & ఆంజనేయ సేవ',
    metalDayEn: 'Iron/Sesame Shani Upasana · Saturday Evening Hanuman & Shani Prayers',
    japaTe: 'వివాహ ఆలస్య నివారణకు 92 రోజుల శని మంత్ర జపం మరియు నల్ల నువ్వుల దానం.',
    japaEn: '92-day Shani Mantra Japa cycle and sesame lamp lighting on Saturdays.',
  },
  rahu: {
    metalDayTe: 'బుధ/శనివారాలలో శ్రీ దుర్గా దేవి ఆరాధన & రాహు కాల దీపారాధన',
    metalDayEn: 'Wednesday/Saturday Goddess Durga Archana',
    japaTe: 'రాహు దోష శాంతి కొరకు 72 రోజుల జప నియమం మరియు మినుముల దానం.',
    japaEn: '72-day Rahu Shanti Japa schedule and black gram dana.',
  },
  ketu: {
    metalDayTe: 'మంగళ/శుక్రవారాలలో శ్రీ మహా గణపతి ఆరాధన & గరిక పూజ',
    metalDayEn: 'Tuesday/Friday Lord Maha Ganapathi Worship',
    japaTe: 'కేతు గ్రహ శాంతి కొరకు 68 రోజుల జప నియమం మరియు ఉలవల దానం.',
    japaEn: '68-day Ketu Shanti Japa cycle and Ganapathi Atharvashirsha recitation.',
  },
};

export function generateSaptamaMarriageAnalysis(
  planets: KundaliPlanetDetail[],
  lagnaIdx: number,
  birthDate: string
): SaptamaMarriageAnalysis {
  const saptamaRashiIdx = (lagnaIdx + 6) % 12;
  const fifthRashiIdx = (lagnaIdx + 4) % 12;
  const rashiMeta = RASHI_LORD_MAP[saptamaRashiIdx] || RASHI_LORD_MAP[0];

  const getHouseFromLagna = (rIdx: number) => ((rIdx - lagnaIdx + 12) % 12) + 1;

  const saptamaLordPlanet =
    planets.find((p) => p.id === rashiMeta.lordId) ||
    planets.find((p) => p.id === 'venus') ||
    planets[0];
  const saptamaLordHouse = saptamaLordPlanet ? getHouseFromLagna(saptamaLordPlanet.rashiIdx) : 7;

  // Occupants in 7th House (excluding lagna point)
  const occupants = planets.filter((p) => p.id !== 'lagna' && p.rashiIdx === saptamaRashiIdx);
  const occupantPlanetsTe = occupants.map((p) => p.nameTe);
  const occupantPlanetsEn = occupants.map((p) => p.nameEn);

  // Occupant bonus description
  let occupantNoteTe = '';
  let occupantNoteEn = '';
  if (occupants.length > 0) {
    const namesTe = occupantPlanetsTe.join(', ');
    const namesEn = occupantPlanetsEn.join(', ');
    occupantNoteTe = ` సప్తమ స్థానంలో ${namesTe} స్థితి వల్ల భాగస్వామికి ప్రత్యేక ఆకర్షణ, చురుకైన తెలివితేటలు మరియు సమాజంలో గుర్తింపు లభిస్తాయి.`;
    occupantNoteEn = ` The presence of ${namesEn} in the 7th house adds distinctive charm, intelligence, and social prominence to your spouse.`;
  }

  const lordHouseInfo = SEVENTH_LORD_IN_HOUSES[saptamaLordHouse] || SEVENTH_LORD_IN_HOUSES[7];

  // Love vs Arranged Marriage Evaluation (Classical 5th-7th, Venus-Mars, Venus-Mercury rules)
  const venus = planets.find((p) => p.id === 'venus');
  const mars = planets.find((p) => p.id === 'mars');
  const mercury = planets.find((p) => p.id === 'mercury');
  const jupiter = planets.find((p) => p.id === 'jupiter');
  const moon = planets.find((p) => p.id === 'moon');

  const fifthLordId = RASHI_LORD_MAP[fifthRashiIdx]?.lordId || 'sun';
  const fifthLordPlanet = planets.find((p) => p.id === fifthLordId);

  const venusMarsConjoinedOrOpposite =
    venus &&
    mars &&
    (venus.rashiIdx === mars.rashiIdx || Math.abs(venus.rashiIdx - mars.rashiIdx) === 6);
  const fifthSeventhConnected =
    fifthLordPlanet &&
    saptamaLordPlanet &&
    (fifthLordPlanet.rashiIdx === saptamaLordPlanet.rashiIdx ||
      fifthLordPlanet.rashiIdx === saptamaRashiIdx ||
      saptamaLordPlanet.rashiIdx === fifthRashiIdx);
  const venusMercuryInKendraKona =
    venus &&
    mercury &&
    venus.rashiIdx === mercury.rashiIdx &&
    [1, 4, 5, 7, 9, 10, 11].includes(getHouseFromLagna(venus.rashiIdx));

  let marriageTypeBadgeTe = 'పెద్దలు కుదిర్చిన సంప్రదాయ వివాహ యోగం (Arranged Marriage)';
  let marriageTypeBadgeEn = 'Traditional Arranged Marriage Yoga';
  let marriageTypeAnalysisTe =
    'మీ జాతకంలో గురు మరియు సప్తమాధిపతి స్థితి ప్రకారం ఇరు కుటుంబాల పెద్దల ఆశీస్సులతో, శాస్త్రోక్త సంప్రదాయ పద్ధతిలో వివాహం జరిగే బలమైన యోగం ఉంది.';
  let marriageTypeAnalysisEn =
    'Your chart indicates a strong traditional marriage arranged with the blessings of elders and full family support.';

  if (fifthSeventhConnected || venusMarsConjoinedOrOpposite) {
    marriageTypeBadgeTe = 'ప్రేమ-పెద్దల అంగీకార వివాహ యోగం (Love-Cum-Arranged Yoga)';
    marriageTypeBadgeEn = 'Love-Cum-Arranged Marriage Yoga';
    marriageTypeAnalysisTe =
      'పంచమ-సప్తమ స్థానాధిపతుల సంబంధం మరియు శుక్ర-కుజ ఆకర్షణ బలం వల్ల ముందుగా పరిచయం లేదా ప్రేమ ఏర్పడి, ఆపై పెద్దల అంగీకారంతో వివాహంగా మారే శుభ యోగం కనిపిస్తోంది.';
    marriageTypeAnalysisEn =
      'Connection between the 5th/7th houses and Venus-Mars influence favors a relationship blossoming through mutual acquaintance and culminating in marriage with family consent.';
  } else if (venusMercuryInKendraKona) {
    marriageTypeBadgeTe = 'విద్యా / వృత్తి పరిచయ వివాహ యోగం (Acquaintance / Choice Match)';
    marriageTypeBadgeEn = 'Educated Choice & Mutual Acquaintance Match';
    marriageTypeAnalysisTe =
      'శుక్ర-బుధ కలయిక వల్ల కళాశాల, ఉన్నత విద్య లేదా ఉద్యోగ/వృత్తి రంగంలో పరిచయమైన వ్యక్తితో పరస్పర అవగాహన ద్వారా వివాహం కుదిరే అవకాశం మెండుగా ఉంది.';
    marriageTypeAnalysisEn =
      'Venus-Mercury harmony suggests meeting your life partner through academic, professional, or intellectual circles.';
  }

  // Marriage Timing (Jupiter Transit + 7th Lord / Venus / Jupiter Dasha)
  const birthYear = parseInt(birthDate.split('-')[0], 10) || 1998;
  const currentYear = new Date().getFullYear();
  const baseMarriageAge = 23 + ((lagnaIdx + saptamaRashiIdx) % 5);
  const secondWindowAge = baseMarriageAge + 2;
  const thirdWindowAge = baseMarriageAge + 4;

  const year1 = Math.max(currentYear, birthYear + baseMarriageAge);
  const year2 = year1 + 1;

  const marriageTimingTitleTe = `శుభ వివాహ యోగ కాలం: ${year1} – ${year2} (గురు గోచార & సప్తమ దశా బలం)`;
  const marriageTimingTitleEn = `Auspicious Marriage Window: ${year1} – ${year2} (Jupiter Transit & 7th Lord Period)`;
  const marriageTimingDetailsTe = `సప్తమ భావ సిద్ధాంతం ప్రకారం గోచార గురువు మీ జన్మ లగ్నం లేదా జన్మ రాశి నుండి 1, 3, 4, 5, 7, 9 లేదా 11వ స్థానాలలో సంచరించే కాలంలో మరియు ${rashiMeta.lordTe}, శుక్రుడు లేదా గురు దశ/అంతర్దశలలో వివాహ నిశ్చయం జరుగుతుంది.`;
  const marriageTimingDetailsEn = `Classical transit rules state that marriage materializes when Jupiter transits the 1st, 3rd, 4th, 5th, 7th, 9th, or 11th house from your Ascendant/Moon Sign during the Dasha/Bhukti of ${rashiMeta.lordEn}, Venus, or Jupiter.`;

  const favorableAgesTe = `${baseMarriageAge}, ${secondWindowAge}, ${thirdWindowAge} ఏళ్ల వయస్సు (${year1}–${year2} ప్రాంతం)`;
  const favorableAgesEn = `Ages ${baseMarriageAge}, ${secondWindowAge}, and ${thirdWindowAge} (${year1}–${year2} window)`;

  // Kuja Dosha Percentage & Exemption Check
  const marsHouse = mars ? getHouseFromLagna(mars.rashiIdx) : 3;
  const jupiterHouse = jupiter ? getHouseFromLagna(jupiter.rashiIdx) : 9;

  // Does Jupiter aspect Mars or 7th house? (Jupiter aspects 5th, 7th, 9th from itself)
  const jupiterAspectsMars =
    jupiter &&
    mars &&
    [0, 4, 6, 8].includes((mars.rashiIdx - jupiter.rashiIdx + 12) % 12);
  const marsInOwnOrExalted = mars && [0, 7, 9].includes(mars.rashiIdx); // Aries, Scorpio, Capricorn

  let kujaDoshaPercentage = 0;
  if (marsHouse === 12) kujaDoshaPercentage = 50;
  else if (marsHouse === 1) kujaDoshaPercentage = 60;
  else if (marsHouse === 2) kujaDoshaPercentage = 80;
  else if (marsHouse === 4) kujaDoshaPercentage = 85;
  else if (marsHouse === 7 || marsHouse === 8) kujaDoshaPercentage = 100;

  let kujaDoshaTitleTe = 'కుజ దోషం లేదు (0% — సంపూర్ణ కుజ శుద్ధి)';
  let kujaDoshaTitleEn = 'No Kuja Dosha (0% — Auspicious Mars Placement)';
  let kujaDoshaExplanationTe = `మీ జన్మ లగ్నం నుండి కుజుడు ${marsHouse}వ స్థానంలో ఉన్నందున కుజ దోషం లేదు. వైవాహిక జీవితానికి కుజుని వల్ల ఎలాంటి ఆటంకం ఉండదు.`;
  let kujaDoshaExplanationEn = `Mars is placed in the ${marsHouse}th house from your Ascendant, which is completely free from Manglik/Kuja Dosha.`;

  if (kujaDoshaPercentage > 0) {
    if (jupiterAspectsMars || marsInOwnOrExalted || jupiterHouse === 1 || jupiterHouse === 7) {
      const reducedPct = Math.round(kujaDoshaPercentage * 0.3);
      kujaDoshaTitleTe = `కుజ దోష భంగం / ఉపశమనం (${kujaDoshaPercentage}% → ${reducedPct}% మాత్రమే)`;
      kujaDoshaTitleEn = `Kuja Dosha Mitigated by Classical Exemption (${kujaDoshaPercentage}% → ${reducedPct}%)`;
      kujaDoshaExplanationTe = `కుజుడు ${marsHouse}వ స్థానంలో ఉన్నప్పటికీ, గురు దృష్టి / స్వక్షేత్ర-ఉచ్చ బలం వల్ల శాస్త్రోక్తంగా కుజ దోష భంగం జరిగింది. సాధారణ సుబ్రహ్మణ్య ఆరాధనతో సంపూర్ణ శుభం కలుగుతుంది.`;
      kujaDoshaExplanationEn = `Although Mars occupies the ${marsHouse}th house (${kujaDoshaPercentage}% base), benefic Jupiter aspect / dignity triggers classical Kuja Dosha cancellation.`;
      kujaDoshaPercentage = reducedPct;
    } else {
      kujaDoshaTitleTe = `${marsHouse}వ స్థానంలో కుజుడు (${kujaDoshaPercentage}% కుజ ప్రభావం)`;
      kujaDoshaTitleEn = `Mars in ${marsHouse}th House (${kujaDoshaPercentage}% Manglik Intensity)`;
      kujaDoshaExplanationTe = `లగ్నం నుండి ${marsHouse}వ స్థానంలో కుజుడు ఉన్నందున ${kujaDoshaPercentage}% కుజ ప్రభావం ఉంది. వివాహ పొంతనలో సమాన కుజ బలం ఉన్న జాతకాన్ని ఎంచుకోవడం లేదా 24+ గుణాల పొంతనతో కుజ గ్రహ శాంతి జరిపించడం శ్రేయస్కరం.`;
      kujaDoshaExplanationEn = `Mars in the ${marsHouse}th house carries ${kujaDoshaPercentage}% intensity. Match with a chart having parallel planetary balance or perform Vedic Kuja Graha Shanti.`;
    }
  }

  // True vs False Kalasarpa Yoga Check
  const rahu = planets.find((p) => p.id === 'rahu');
  const ketu = planets.find((p) => p.id === 'ketu');
  const sevenPlanets = planets.filter(
    (p) => !['lagna', 'rahu', 'ketu'].includes(p.id)
  );

  let isHemmedOneSide = false;
  if (rahu && ketu && sevenPlanets.length === 7) {
    const rahuLon = rahu.longitude;
    const ketuLon = ketu.longitude;
    const arc1Count = sevenPlanets.filter((p) => {
      const diff = (p.longitude - rahuLon + 360) % 360;
      const kDiff = (ketuLon - rahuLon + 360) % 360;
      return diff > 0 && diff < kDiff;
    }).length;
    const arc2Count = sevenPlanets.filter((p) => {
      const diff = (p.longitude - ketuLon + 360) % 360;
      const rDiff = (rahuLon - ketuLon + 360) % 360;
      return diff > 0 && diff < rDiff;
    }).length;
    isHemmedOneSide = arc1Count === 7 || arc2Count === 7;
  }

  const kalasarpaStatusTe = isHemmedOneSide
    ? 'కాలసర్ప యోగ స్పర్శ ఉంది (రాహు-కేతు జప శాంతి శుభప్రదం)'
    : 'కాలసర్ప దోషం లేదు (గ్రహాలు రాహు-కేతువుల వెలుపల శుభ స్థితిలో ఉన్నాయి)';
  const kalasarpaStatusEn = isHemmedOneSide
    ? 'Kalasarpa Axis Detected (Rahu-Ketu Shanti Recommended)'
    : 'No Kalasarpa Dosha (Planets Freely Distributed)';
  const kalasarpaDetailTe = isHemmedOneSide
    ? 'సప్త గ్రహాలు రాహు-కేతు అక్షం మధ్య ఉన్నందున 32 ఏళ్ల వరకు శ్రమ, ఆపై విశేష రాజయోగం ఉంటాయి. శివాభిషేకం మరియు రాహు-కేతు శాంతి వల్ల ఆటంకాలు తొలగుతాయి.'
    : 'సూర్యాది సప్త గ్రహాలు రాహు-కేతువుల గమన మార్గంలో బంధింపబడలేదు కాబట్టి మీ జాతకంలో కాలసర్ప దోషం లేదు. నిశ్చింతగా ఉండవచ్చు.';
  const kalasarpaDetailEn = isHemmedOneSide
    ? 'All seven planets lie within the nodal arc; Rudrabhishekam and Naga Shanti turn initial delays into lasting success.'
    : 'The seven planets are not enclosed along the nodal path; your chart is completely free from Kalasarpa Dosha.';

  const remedyKey = kujaDoshaPercentage >= 60 ? 'mars' : rashiMeta.lordId || 'jupiter';
  const remedyObj = PLANET_JAPA_REMEDY[remedyKey] || PLANET_JAPA_REMEDY.jupiter;

  return {
    saptamaRashiTe: rashiMeta.rashiTe,
    saptamaRashiEn: rashiMeta.rashiEn,
    saptamaLordTe: rashiMeta.lordTe,
    saptamaLordEn: rashiMeta.lordEn,
    saptamaLordHouse,
    occupantPlanetsTe,
    occupantPlanetsEn,
    spouseAppearanceAndNatureTe: rashiMeta.signSpouseTe + occupantNoteTe,
    spouseAppearanceAndNatureEn: rashiMeta.signSpouseEn + occupantNoteEn,
    spouseCareerAndFamilyTe: lordHouseInfo.te,
    spouseCareerAndFamilyEn: lordHouseInfo.en,
    marriageTypeBadgeTe,
    marriageTypeBadgeEn,
    marriageTypeAnalysisTe,
    marriageTypeAnalysisEn,
    marriageTimingTitleTe,
    marriageTimingTitleEn,
    marriageTimingDetailsTe,
    marriageTimingDetailsEn,
    favorableAgesTe,
    favorableAgesEn,
    kujaDoshaPercentage,
    kujaDoshaTitleTe,
    kujaDoshaTitleEn,
    kujaDoshaExplanationTe,
    kujaDoshaExplanationEn,
    kalasarpaStatusTe,
    kalasarpaStatusEn,
    kalasarpaDetailTe,
    kalasarpaDetailEn,
    remedyMetalAndDayTe: remedyObj.metalDayTe,
    remedyMetalAndDayEn: remedyObj.metalDayEn,
    remedyJapaScheduleTe: remedyObj.japaTe,
    remedyJapaScheduleEn: remedyObj.japaEn,
  };
}
