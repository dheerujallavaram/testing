export interface RashiVedicEncyclopediaEntry {
  id: string;
  index: number;
  rashiNameTe: string;
  rashiNameEn: string;
  rashiLordTe: string;
  rashiLordEn: string;
  tatvamTe: string;
  tatvamEn: string;
  nakshatrasTe: string;
  nakshatrasEn: string;
  kalapurushaAngamTe: string;
  kalapurushaAngamEn: string;

  // 1. Spouse Psychology (Wife & Husband Nature + Marital Harmony)
  wifeProfileTe: string;
  wifeProfileEn: string;
  husbandProfileTe: string;
  husbandProfileEn: string;
  maritalHarmonySutraTe: string;
  maritalHarmonySutraEn: string;

  // 2. Parenting & Child Nature (Child Psychology, Study Habits & Parenting Guide)
  childNatureAndStudyTe: string;
  childNatureAndStudyEn: string;
  parentingGuideTe: string;
  parentingGuideEn: string;
  parentTemperamentTe: string;
  parentTemperamentEn: string;

  // 3. Career, Business Partnerships & Wealth Attraction
  careerLifeWorkTe: string;
  careerLifeWorkEn: string;
  businessPartnershipTe: string;
  businessPartnershipEn: string;
  wealthAttractionTe: string;
  wealthAttractionEn: string;
  bestPartnerRashisTe: string;
  bestPartnerRashisEn: string;

  // 4. Chandra Rashi Mental Disposition & Physical Health (Vedic Medical Astrology)
  chandraManasikaTatvamTe: string;
  chandraManasikaTatvamEn: string;
  arogyaRakshaTe: string;
  arogyaRakshaEn: string;

  // 5. Vedic Remedy & Aradhana
  vedicRemedyTe: string;
  vedicRemedyEn: string;
}

export interface LunarAndShaniMentalGuide {
  id: string;
  titleTe: string;
  titleEn: string;
  subtitleTe: string;
  subtitleEn: string;
  shastraPrincipleTe: string;
  shastraPrincipleEn: string;
  practicalGuidanceTe: string[];
  practicalGuidanceEn: string[];
  remedyTe: string;
  remedyEn: string;
}

export const DWADASA_RASHI_VEDIC_ENCYCLOPEDIA: RashiVedicEncyclopediaEntry[] = [
  {
    id: 'mesham',
    index: 1,
    rashiNameTe: 'మేష రాశి',
    rashiNameEn: 'Aries (Mesha Rashi)',
    rashiLordTe: 'కుజుడు (అంగారకుడు)',
    rashiLordEn: 'Mars (Kuja)',
    tatvamTe: 'అగ్ని తత్వం • చర రాశి',
    tatvamEn: 'Fire Element • Movable Sign',
    nakshatrasTe: 'అశ్విని (4 పాదాలు), భరణి (4 పాదాలు), కృత్తిక (1వ పాదం)',
    nakshatrasEn: 'Ashwini (1–4), Bharani (1–4), Krittika (1)',
    kalapurushaAngamTe: 'శిరస్సు, మెదడు & ముఖ మండలం',
    kalapurushaAngamEn: 'Head, Brain & Facial Region',

    wifeProfileTe:
      'మేష రాశిలో జన్మించిన ఇల్లాలు స్వతంత్ర భావాలు, చురుకైన కార్యాచరణ మరియు ఆత్మగౌరవం కలిగి ఉంటుంది. ఇంటి పనులను, కుటుంబ బాధ్యతలను వేగంగా, క్రమశిక్షణతో చక్కబెడుతుంది. భర్తకు కష్టకాలంలో ధైర్యాన్ని నూరిపోసే గొప్ప శక్తి ఈమె సొంతం. మనసులో కల్మషం లేకుండా నిజాయితీగా మాట్లాడుతుంది. భర్త తన ఆలోచనలకు గౌరవం ఇస్తూ, ప్రేమగా ప్రశంసిస్తే కుటుంబానికి అండగా నిలుస్తుంది.',
    wifeProfileEn:
      'A bride born in Mesha Rashi possesses dynamic initiative, self-respect, and admirable domestic efficiency. She stands as a pillar of courage for her husband during challenges, speaks with candid honesty, and thrives when her individuality and efforts are appreciated with warmth.',

    husbandProfileTe:
      'మేష రాశి పురుషుడు ఉత్సాహం, సాహసం మరియు నాయకత్వ లక్షణాలు కలిగినవాడు. కుటుంబానికి ఎలాంటి లోటు రాకుండా చూడాలనే తపన ఎక్కువగా ఉంటుంది. నిర్ణయాలు వేగంగా తీసుకుంటాడు. అప్పుడప్పుడు కోపం త్వరగా వచ్చినా క్షణంలోనే మర్చిపోయే నిష్కల్మష హృదయం ఇతనిది. గృహంలో ప్రశాంత వాతావరణం, ఓర్పుతో కూడిన సంభాషణ ఇతనిని మరింత ఉన్నతునిగా మారుస్తాయి.',
    husbandProfileEn:
      'A husband of Mesha Rashi is enterprising, protective, and naturally decisive. He works tirelessly to provide comfort for his family. Though occasionally quick-tempered due to Mars, he holds no grudges and responds deeply to gentle, patient communication at home.',

    maritalHarmonySutraTe:
      'కుజాధిపత్య రాశి కావున దంపతులు వాదనలలో పంతాలకు పోకుండా మౌనం, ఓర్పు పాటించాలి. మంగళవారం సుబ్రహ్మణ్య స్వామి ఆరాధన దాంపత్య అన్యోన్యతను పెంచుతుంది.',
    maritalHarmonySutraEn:
      'Since Mars rules this sign, avoiding impulsive arguments and practicing patient listening ensures lifelong marital bliss. Tuesday Subrahmanya worship brings harmony.',

    childNatureAndStudyTe:
      'మేష రాశి పిల్లలు అపారమైన చురుకుదనం, జిజ్ఞాస మరియు పోటీతత్వం కలిగి ఉంటారు. ఏకధాటిగా ఒకే చోట కూర్చుని చదవడం కంటే ప్రాక్టికల్ ప్రయోగాలు, క్రీడలు, నాయకత్వ బాధ్యతలలో త్వరగా నేర్చుకుంటారు. వీరికి జ్ఞాపకశక్తి తీక్షణంగా ఉంటుంది.',
    childNatureAndStudyEn:
      'Children of Mesha Rashi are energetic, curious, and naturally competitive. They learn fastest through active hands-on exploration, sports, and leadership challenges rather than passive rote memorization.',

    parentingGuideTe:
      'ఈ రాశి పిల్లలను కఠినంగా దండించడం లేదా భయపెట్టడం చేయకూడదు; అలా చేస్తే మొండితనం పెరుగుతుంది. వారి శక్తిని క్రీడలు, సైన్స్, సాంకేతిక విద్య వైపు మళ్లించి, చిన్న విజయాలను ప్రశంసిస్తూ ప్రోత్సహిస్తే అద్భుత విజయాలు సాధిస్తారు.',
    parentingGuideEn:
      'Guide Mesha children through affectionate encouragement and constructive challenges rather than harsh reprimands. Channeling their abundant physical energy into sports and STEM pursuits yields academic excellence.',

    parentTemperamentTe:
      'మేష రాశి తల్లిదండ్రులు పిల్లలకు ధైర్యం, స్వావలంబన నేర్పుతారు. అయితే పిల్లల స్థాయికి తగ్గట్టుగా ఓర్పు వహించి వారి భావాలను ఆలకించడం శ్రేయస్కరం.',
    parentTemperamentEn:
      'As parents, Mesha natives instill courage and self-reliance in their children, and benefit from cultivating extra patience with slower-paced children.',

    careerLifeWorkTe:
      'ఇంజనీరింగ్, రక్షణ రంగం (పోలీస్/మిలిటరీ), వైద్య శస్త్రచికిత్స, రియల్ ఎస్టేట్, క్రీడలు, ఐటీ మేనేజ్‌మెంట్ మరియు సొంత వ్యాపార రంగాలలో మేష రాశి వారు అగ్రస్థానానికి చేరుకుంటారు. ఇతరుల కింద పనిచేయడం కంటే స్వతంత్ర బాధ్యతలున్న పదవులలో రాణిస్తారు.',
    careerLifeWorkEn:
      'Mesha natives excel in engineering, defense/administrative services, surgery, real estate, entrepreneurship, and executive leadership roles where independent initiative is rewarded.',

    businessPartnershipTe:
      'వ్యాపారంలో మేష రాశి వారు కొత్త ప్రాజెక్టులను ప్రారంభించడంలో దిట్ట. అయితే ఆర్థిక లెక్కలు మరియు దీర్ఘకాలిక నిర్వహణ కోసం సహనం కలిగిన భాగస్వామితో కలిస్తే వ్యాపారం నిరంతరం వృద్ధి చెందుతుంది.',
    businessPartnershipEn:
      'In business, Mesha natives are brilliant pioneers and rainmakers. Pairing with a steady, detail-oriented partner for financial execution creates a powerhouse enterprise.',

    wealthAttractionTe:
      'భూమి, గృహ నిర్మాణం, లోహాలు మరియు సాంకేతిక పెట్టుబడుల ద్వారా వీరికి విశేష ధనలాభం కలుగుతుంది. ఆవేశంలో ఖర్చు చేయకుండా ప్రణాళికాబద్ధంగా పొదుపు చేయడం వల్ల స్థిర ఆస్తులు ఏర్పడతాయి.',
    wealthAttractionEn:
      'Wealth flows strongly through land, infrastructure, technology, and bold ventures. Disciplined budgeting turns their high earning capacity into lasting generational assets.',

    bestPartnerRashisTe: 'సింహం, ధనుస్సు, మిథునం, కుంభం మరియు తులా రాశులు',
    bestPartnerRashisEn: 'Leo (Simham), Sagittarius (Dhanussu), Gemini (Mithunam), Aquarius (Kumbham) & Libra (Tula)',

    chandraManasikaTatvamTe:
      'చంద్రుడు మేష రాశిలో ఉన్నప్పుడు మనస్సు ఉత్సాహంగా, నిర్భయంగా మరియు ఆశావాదంతో ఉంటుంది. కష్టాలకు వెరవని మనోధైర్యం, తక్షణ నిర్ణయ సామర్థ్యం వీరి ప్రత్యేకత.',
    chandraManasikaTatvamEn:
      'With the Moon in Aries, the mind is fearless, optimistic, and action-oriented, endowed with remarkable resilience and quick analytical reflexes.',

    arogyaRakshaTe:
      'కాలపురుష చక్రంలో శిరస్సును పాలించే రాశి కావున తలనొప్పి, కంటి అలసట, రక్తపోటు, శరీరంలో వేడి (పిత్త తత్వం) పెరగకుండా చూసుకోవాలి. తగినంత నిద్ర, ప్రాణాయామం, చల్లని జలపానం మరియు సాత్విక ఆహారం ఆరోగ్యానికి రక్ష.',
    arogyaRakshaEn:
      'Governing the head and brain, Mesha natives should guard against migraines, eye strain, and excess body heat (Pitta). Regular sleep, Pranayama, and cooling hydration maintain peak vitality.',

    vedicRemedyTe:
      'మంగళవారం శ్రీ సుబ్రహ్మణ్య స్వామి లేదా ఆంజనేయ స్వామి ఆరాధన, కందిపప్పు దానం మరియు కార్తీక మాస రుద్రాభిషేకం సర్వశుభాలను ప్రసాదిస్తాయి.',
    vedicRemedyEn:
      'Worshipping Lord Subrahmanya or Lord Hanuman on Tuesdays, offering red lentils, and performing Rudrabhishekam bestow protection and prosperity.',
  },
  {
    id: 'vrushabham',
    index: 2,
    rashiNameTe: 'వృషభ రాశి',
    rashiNameEn: 'Taurus (Vrishabha Rashi)',
    rashiLordTe: 'శుక్రుడు (భార్గవుడు)',
    rashiLordEn: 'Venus (Shukra)',
    tatvamTe: 'భూ తత్వం • స్థిర రాశి',
    tatvamEn: 'Earth Element • Fixed Sign',
    nakshatrasTe: 'కృత్తిక (2, 3, 4 పాదాలు), రోహిణి (4 పాదాలు), మృగశిర (1, 2 పాదాలు)',
    nakshatrasEn: 'Krittika (2–4), Rohini (1–4), Mrigashira (1–2)',
    kalapurushaAngamTe: 'ముఖం, కంఠం, స్వరపేటిక & మెడ',
    kalapurushaAngamEn: 'Face, Throat, Vocal Cords & Neck',

    wifeProfileTe:
      'వృషభ రాశి ఇల్లాలు సాక్షాత్తు గృహలక్ష్మి స్వరూపం. ఓర్పు, సహనం, మధురమైన సంభాషణ మరియు కళాత్మక అభిరుచి ఈమె భూషణాలు. ఇంటిని ఆహ్లాదకరంగా అలంకరించడం, రుచికరమైన వంటలతో కుటుంబాన్ని ఆదరించడం మరియు ఆర్థిక పొదుపులో ఈమెకు సాటిలేరు. భర్త పట్ల అచంచలమైన విశ్వాసం, ప్రేమ కలిగి ఉంటుంది.',
    wifeProfileEn:
      'A Vrishabha Rashi wife embodies grace, patience, and domestic prosperity. Gifted with culinary and artistic refinement, she transforms the house into a peaceful sanctuary, manages family finances with wisdom, and remains steadfastly devoted to her spouse.',

    husbandProfileTe:
      'వృషభ రాశి భర్త స్థిరమైన మనస్సు, కష్టపడి పనిచేసే తత్వం మరియు కుటుంబ భద్రతకు పెద్దపీట వేసే స్వభావం కలవాడు. ఆడంబరపు మాటల కంటే ఆచరణలో ప్రేమను చూపిస్తాడు. భార్యాపిల్లలకు మంచి ఇల్లు, వాహనం, ఆర్థిక భద్రత కల్పించడానికి నిరంతరం శ్రమిస్తాడు.',
    husbandProfileEn:
      'A Vrishabha Rashi husband is dependable, practical, and deeply family-oriented. He expresses love through concrete actions, providing lasting financial security, a comfortable home, and unwavering emotional stability.',

    maritalHarmonySutraTe:
      'శుక్రాధిపత్య స్థిర రాశి కావున ఒకసారి అభిప్రాయం ఏర్పరచుకుంటే మార్చుకోవడం కష్టం. పరస్పర సంభాషణలో మృదుత్వం, శుక్రవారం లక్ష్మీ నారాయణుల ఆరాధన దాంపత్యాన్ని సుసంపన్నం చేస్తాయి.',
    maritalHarmonySutraEn:
      'As a fixed Venusian sign, avoiding stubbornness during disagreements and worshipping Sri Lakshmi Narayana on Fridays deepens marital affection.',

    childNatureAndStudyTe:
      'వృషభ రాశి పిల్లలు ప్రశాంత స్వభావం, ఏకాగ్రత మరియు కళల పట్ల ఆసక్తి కలిగి ఉంటారు. ఏ విషయాన్నైనా నిదానంగా నేర్చుకున్నా, ఒక్కసారి అర్థం చేసుకుంటే జీవితాంతం మర్చిపోరు. సంగీతం, చిత్రలేఖనం, గణితం మరియు వాణిజ్య శాస్త్రాలలో ప్రతిభ కనబరుస్తారు.',
    childNatureAndStudyEn:
      'Children born in Vrishabha Rashi are calm, methodical, and blessed with retentive memory. Once they grasp a concept, they never forget it, showing natural flair for music, fine arts, mathematics, and commerce.',

    parentingGuideTe:
      'వీరిని తొందరపెట్టడం లేదా ఇతరులతో పోల్చడం చేయకూడదు. ప్రేమతో కూడిన ప్రోత్సాహం, క్రమబద్ధమైన దినచర్య మరియు ఆహ్లాదకరమైన చదువుల వాతావరణం కల్పిస్తే ఉన్నత విద్యావంతులవుతారు.',
    parentingGuideEn:
      'Avoid rushing Vrishabha children or comparing them with peers. A structured routine, peaceful study environment, and gentle praise unlock their highest potential.',

    parentTemperamentTe:
      'వృషభ రాశి తల్లిదండ్రులు పిల్లలకు అమితమైన ప్రేమ, రక్షణ మరియు సంప్రదాయ విలువలను అందిస్తారు.',
    parentTemperamentEn:
      'Vrishabha parents are deeply nurturing, protective, and ground their children in strong family traditions and financial wisdom.',

    careerLifeWorkTe:
      'బ్యాంకింగ్, ఫైనాన్స్, చార్టర్డ్ అకౌంటెన్సీ, ఆభరణాలు, వస్త్ర వ్యాపారం, రియల్ ఎస్టేట్, వ్యవసాయం, ఆహార రంగం, సంగీత-కళా రంగాలు మరియు సాఫ్ట్‌వేర్ ఆర్కిటెక్చర్ రంగాలలో వీరు అద్భుతంగా రాణిస్తారు.',
    careerLifeWorkEn:
      'Vrishabha natives thrive in banking, wealth management, jewelry, textiles, real estate, hospitality, agriculture, fine arts, and enterprise software.',

    businessPartnershipTe:
      'వ్యాపార భాగస్వామ్యంలో వీరు అత్యంత నమ్మకస్తులు. నష్టభయం (Risk) తక్కువగా ఉండి, స్థిరమైన లాభాలు వచ్చే వ్యాపారాలలో వీరి భాగస్వామ్యం సంస్థకు బలమైన ఆర్థిక పునాదిని ఇస్తుంది.',
    businessPartnershipEn:
      'Highly trustworthy in partnerships, Vrishabha natives bring fiscal discipline, asset stability, and long-term endurance to any commercial venture.',

    wealthAttractionTe:
      'చంద్రుడు ఉచ్చ స్థితి పొందే ఈ రాశి వారికి సహజంగానే ధనాకర్షణ శక్తి ఎక్కువ. బంగారం, భూమి, ఫిక్స్‌డ్ డిపాజిట్లు మరియు దీర్ఘకాలిక పెట్టుబడుల ద్వారా అఖండ సంపదను నిర్మిస్తారు.',
    wealthAttractionEn:
      'Where the Moon is exalted, Vrishabha naturally attracts wealth, building substantial reserves through gold, land, and prudent long-term investments.',

    bestPartnerRashisTe: 'కర్కాటకం, కన్య, మకరం, మీనం మరియు వృశ్చిక రాశులు',
    bestPartnerRashisEn: 'Cancer (Karkatakam), Virgo (Kanya), Capricorn (Makaram), Pisces (Meenam) & Scorpio (Vruschikam)',

    chandraManasikaTatvamTe:
      'వృషభ రాశిలో చంద్రుడు ఉచ్చ బలాన్ని పొందుతాడు కాబట్టి వీరికి మానసిక స్థైర్యం, సహనం, క్షమాగుణం మరియు ఆత్మవిశ్వాసం పుష్కలంగా ఉంటాయి.',
    chandraManasikaTatvamEn:
      'Because the Moon is exalted in Taurus, natives possess exceptional emotional poise, loyalty, aesthetic appreciation, and inner peace.',

    arogyaRakshaTe:
      'కంఠం, టాన్సిల్స్, థైరాయిడ్ మరియు మెడ భాగాలపై శ్రద్ధ వహించాలి. అతి చల్లని పానీయాలు తగ్గించడం, గొంతుకు సంబంధించిన వ్యాయామాలు మరియు మితమైన ఆహార నియమాలు పాటించడం ఉత్తమం.',
    arogyaRakshaEn:
      'Ruling the throat and neck, natives should care for vocal cords, thyroid balance, and metabolism through warm herbal infusions and regular brisk walking.',

    vedicRemedyTe:
      'శుక్రవారం శ్రీ మహాలక్ష్మి అష్టోత్తర పారాయణ, గోపూజ మరియు శివాభిషేకం వల్ల అష్టైశ్వర్యాలు సిద్ధిస్తాయి.',
    vedicRemedyEn:
      'Reciting Sri Mahalakshmi Ashtottaram on Fridays, performing Go-Pooja, and Monday Rudrabhishekam bring enduring prosperity.',
  },
  {
    id: 'mithunam',
    index: 3,
    rashiNameTe: 'మిథున రాశి',
    rashiNameEn: 'Gemini (Mithuna Rashi)',
    rashiLordTe: 'బుధుడు (సౌమ్యుడు)',
    rashiLordEn: 'Mercury (Budha)',
    tatvamTe: 'వాయు తత్వం • ద్విস্বభావ రాశి',
    tatvamEn: 'Air Element • Dual Sign',
    nakshatrasTe: 'మృగశిర (3, 4 పాదాలు), ఆరుద్ర (4 పాదాలు), పునర్వసు (1, 2, 3 పాదాలు)',
    nakshatrasEn: 'Mrigashira (3–4), Ardra (1–4), Punarvasu (1–3)',
    kalapurushaAngamTe: 'భుజాలు, చేతులు, ఊపిరితిత్తులు & నాడీ మండలం',
    kalapurushaAngamEn: 'Shoulders, Arms, Lungs & Nervous System',

    wifeProfileTe:
      'మిథున రాశి ఇల్లాలు చురుకైన తెలివితేటలు, సమయస్ఫూర్తి మరియు కలుపుగోలుతనం కలిగి ఉంటుంది. భర్తకు కేవలం భార్యగానే కాక, మంచి స్నేహితురాలిగా, సలహాదారుగా వ్యవహరిస్తుంది. గృహ నిర్వహణతో పాటు విద్యా, ఉద్యోగ, ఆర్థిక విషయాలలో భర్తకు చేదోడువాదోడుగా నిలుస్తుంది.',
    wifeProfileEn:
      'A Mithuna Rashi wife is intellectually vibrant, articulate, and adaptable. She serves as both a loving spouse and an insightful best friend, offering wise counsel in career and domestic matters alike.',

    husbandProfileTe:
      'మిథున రాశి భర్త చక్కని వాక్చాతుర్యం, హాస్యచతురత మరియు బహుముఖ ప్రజ్ఞ కలవాడు. కుటుంబ సభ్యులను ఆనందంగా ఉంచడానికి ఇష్టపడతాడు. వృత్తిలో మేధాశక్తితో ఎదుగుతాడు. భార్య తన ఆలోచనలను పంచుకుంటూ, ఉత్సాహంగా సహకరిస్తే దాంపత్యం నిత్యనూతనంగా సాగుతుంది.',
    husbandProfileEn:
      'A Mithuna Rashi husband is witty, communicative, and versatile. He keeps the household lively, succeeds through intellect, and cherishes a partner who engages in meaningful conversation.',

    maritalHarmonySutraTe:
      'బుధాధిపత్య ద్విస్వభావ రాశి కావున చిన్న విషయాలపై అతిగా ఆలోచించడం తగ్గించాలి. బుధవారం శ్రీ విష్ణు సహస్రనామ పారాయణ దంపతుల మధ్య మానసిక ఐక్యతను పెంచుతుంది.',
    maritalHarmonySutraEn:
      'Governed by Mercury, avoiding over-analysis and chanting Sri Vishnu Sahasranama on Wednesdays fosters deep emotional and intellectual harmony.',

    childNatureAndStudyTe:
      'మిథున రాశి పిల్లలు అద్భుతమైన భాషా నైపుణ్యం, వేగంగా గ్రహించే శక్తి (Quick Grasp) మరియు బహుముఖ ఆసక్తులు కలిగి ఉంటారు. గణితం, కంప్యూటర్స్, రచన, ఉపన్యాసం మరియు విదేశీ భాషలలో సులభంగా రాణిస్తారు.',
    childNatureAndStudyEn:
      'Mithuna children are gifted with rapid comprehension, linguistic flair, and curiosity. They excel in mathematics, coding, debate, writing, and analytical subjects.',

    parentingGuideTe:
      'వీరి మనస్సు ఒక విషయం నుండి మరొక విషయానికి వేగంగా మారుతుంటుంది కాబట్టి, ఏకాగ్రత (Concentration) మరియు పనిని పూర్తిచేసే పట్టుదల నేర్పించాలి. వీరి ప్రశ్నలకు ఓపికగా సమాధానాలు చెబుతూ మేధోపరమైన పుస్తకాలు అందిస్తే ఉన్నత శిఖరాలను అధిరోహిస్తారు.',
    parentingGuideEn:
      'Help Mithuna children cultivate sustained focus to complete one task before starting another. Answering their curious questions patiently builds exceptional scholarly confidence.',

    parentTemperamentTe:
      'మిథున రాశి తల్లిదండ్రులు పిల్లలతో స్నేహితుల్లా మెలుగుతూ వారి ఆలోచనలను ప్రోత్సహిస్తారు.',
    parentTemperamentEn:
      'Mithuna parents relate to their children as approachable mentors, encouraging open dialogue and academic curiosity.',

    careerLifeWorkTe:
      'సాఫ్ట్‌వేర్ & ఐటీ, జర్నలిజం, మీడియా, అకౌంటింగ్, ఆడిటింగ్, ఉపాధ్యాయ వృత్తి, న్యాయవాద రంగం, మార్కెటింగ్, వ్యాపార కన్సల్టెన్సీ మరియు కమ్యూనికేషన్ రంగాలలో వీరు విశేషంగా రాణిస్తారు.',
    careerLifeWorkEn:
      'Ideal careers include software engineering, data science, journalism, teaching, law, chartered accountancy, diplomacy, and management consulting.',

    businessPartnershipTe:
      'వ్యాపార ఒప్పందాలు, మార్కెటింగ్ మరియు కస్టమర్ రిలేషన్స్‌లో మిథున రాశి వారు అగ్రగాములు. స్థిరమైన కార్యాచరణ కలిగిన భాగస్వామితో జతకడితే వ్యాపారాన్ని అనేక శాఖలుగా విస్తరిస్తారు.',
    businessPartnershipEn:
      'Mithuna natives excel in negotiation, strategy, and client acquisition, scaling businesses rapidly when paired with an operational partner.',

    wealthAttractionTe:
      'మేధాశక్తి, కన్సల్టెన్సీ, షేర్లు/వాణిజ్యం మరియు బహుళ ఆదాయ మార్గాల (Multiple Income Streams) ద్వారా ధనాన్ని ఆకర్షిస్తారు. ఆర్థిక ప్రణాళికలో స్థిరత్వం పాటిస్తే గొప్ప సంపద నిలుస్తుంది.',
    wealthAttractionEn:
      'Wealth is generated through intellectual capital, commerce, and diversified income streams, amplified by consistent long-term asset allocation.',

    bestPartnerRashisTe: 'తుల, కుంభం, మేషం, సింహం మరియు కన్యా రాశులు',
    bestPartnerRashisEn: 'Libra (Tula), Aquarius (Kumbham), Aries (Mesham), Leo (Simham) & Virgo (Kanya)',

    chandraManasikaTatvamTe:
      'మిథున రాశిలో చంద్రుడు ఉన్నవారు చురుకైన బుద్ధి, కాలానుగుణంగా మారే నేర్పు మరియు సానుకూల దృక్పథం కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Gemini bestows mental agility, adaptability, eloquence, and a youthful, inquisitive outlook on life.',

    arogyaRakshaTe:
      'ఊపిరితిత్తులు, శ్వాసకోశం, భుజాలు మరియు నాడీ వ్యవస్థపై శ్రద్ధ అవసరం. మానసిక ఒత్తిడి, నిద్రలేమి లేకుండా చూసుకోవాలి. ఉదయపు నడక, ప్రాణాయామం మరియు ఆకుకూరల ఆహారం ఆరోగ్యాన్ని కాపాడతాయి.',
    arogyaRakshaEn:
      'Ruling the lungs, shoulders, and nervous system, natives benefit from deep breathing exercises (Pranayama), restful sleep, and stress-free evening routines.',

    vedicRemedyTe:
      'బుధవారం శ్రీ వేంకటేశ్వర స్వామి లేదా మహావిష్ణువు ఆరాధన, తులసి అర్చన మరియు పెసల దానం విశేష శుభఫలితాలను ఇస్తాయి.',
    vedicRemedyEn:
      'Worshipping Lord Venkateswara on Wednesdays with Tulasi leaves and reciting Vishnu Sahasranama bestows clarity and prosperity.',
  },
  {
    id: 'karkatakam',
    index: 4,
    rashiNameTe: 'కర్కాటక రాశి',
    rashiNameEn: 'Cancer (Karkataka Rashi)',
    rashiLordTe: 'చంద్రుడు (సోముడు)',
    rashiLordEn: 'Moon (Chandra)',
    tatvamTe: 'జల తత్వం • చర రాశి',
    tatvamEn: 'Water Element • Movable Sign',
    nakshatrasTe: 'పునర్వసు (4వ పాదం), పుష్యమి (4 పాదాలు), ఆశ్లేష (4 పాదాలు)',
    nakshatrasEn: 'Punarvasu (4), Pushyami (1–4), Ashlesha (1–4)',
    kalapurushaAngamTe: 'వక్షస్థలం, జీర్ణకోశం & ఉదరం',
    kalapurushaAngamEn: 'Chest, Stomach & Digestive System',

    wifeProfileTe:
      'కర్కాటక రాశి ఇల్లాలు మమతానురాగాలకు ప్రతిరూపం. కుటుంబాన్ని, భర్తను, పిల్లలను కంటికి రెప్పలా కాపాడుకుంటుంది. సాంప్రదాయ పూజలు, అతిథి మర్యాదలు మరియు గృహ సౌభాగ్యానికి అత్యధిక ప్రాధాన్యత ఇస్తుంది. సున్నితమైన మనస్సు కలది కావున భర్త ఇచ్చే చిన్న ఆప్యాయత, భరోసా ఈమెకు కొండంత బలాన్ని ఇస్తాయి.',
    wifeProfileEn:
      'A Karkataka Rashi wife is the heart of the home—deeply affectionate, intuitive, and devoted to family traditions. She nurtures everyone around her and blossoms when surrounded by emotional warmth and security.',

    husbandProfileTe:
      'కర్కాటక రాశి భర్త కుటుంబాన్ని ప్రేమించే తత్వం, దయాగుణం మరియు బాధ్యతాయుతమైన స్వభావం కలవాడు. తల్లిదండ్రుల పట్ల, భార్యాపిల్లల పట్ల అపారమైన అనుబంధం కలిగి ఉంటాడు. ఆర్థికంగా కుటుంబానికి భద్రత కల్పించడంలో ముందుంటాడు.',
    husbandProfileEn:
      'A Karkataka Rashi husband is caring, protective, and deeply attached to home and family. He works with quiet determination to build a secure nest and cherishes domestic peace above all.',

    maritalHarmonySutraTe:
      'చంద్రాధిపత్య జల రాశి కావున చిన్న మాటకే నొచ్చుకునే సున్నితత్వం ఉంటుంది. దంపతులు మనసు విప్పి మాట్లాడుకోవడం, సోమవారం శివపార్వతుల ఆరాధన చేయడం వల్ల అన్యోన్యత వర్ధిల్లుతుంది.',
    maritalHarmonySutraEn:
      'Ruled by the Moon, emotional sensitivity should be met with gentle reassurance. Worshipping Lord Shiva and Goddess Parvati on Mondays strengthens the marital bond.',

    childNatureAndStudyTe:
      'కర్కాటక రాశి పిల్లలు అద్భుతమైన ఊహాశక్తి, జ్ఞాపకశక్తి మరియు సున్నితమైన హృదయం కలిగి ఉంటారు. తల్లిదండ్రుల ప్రేమ, ప్రోత్సాహం ఉన్నప్పుడు చదువులో అగ్రస్థానంలో నిలుస్తారు. వైద్యం, సాహిత్యం, చరిత్ర, జీవశాస్త్రం మరియు సృజనాత్మక రంగాలలో రాణిస్తారు.',
    childNatureAndStudyEn:
      'Karkataka children possess vivid imagination, strong memory, and deep empathy. They flourish academically in supportive environments, excelling in medicine, life sciences, literature, and arts.',

    parentingGuideTe:
      'ఈ పిల్లలు తల్లిదండ్రుల మూడ్స్‌ను త్వరగా గ్రహిస్తారు. ఇంట్లో ప్రశాంత వాతావరణం ఉంచుతూ, భయం పోగొట్టి ఆత్మవిశ్వాసం నూరిపోస్తే వీరిలోని అంతర్గత ప్రతిభ బయటపడుతుంది.',
    parentingGuideEn:
      'Because Karkataka children are emotionally perceptive, maintaining a harmonious home atmosphere and offering steady encouragement builds lifelong self-confidence.',

    parentTemperamentTe:
      'కర్కాటక రాశి తల్లిదండ్రులు పిల్లల పట్ల అవ్యాజమైన మాతృ/పితృ వాత్సల్యం చూపిస్తారు; అయితే పిల్లలకు స్వతంత్రంగా నిర్ణయాలు తీసుకునే అలవాటు కూడా నేర్పాలి.',
    parentTemperamentEn:
      'Karkataka parents are exceptionally devoted and nurturing, and should gradually encourage independent decision-making as their children grow.',

    careerLifeWorkTe:
      'వైద్యం, నర్సింగ్, ఫార్మసీ, విద్యా రంగం, బ్యాంకింగ్, రియల్ ఎస్టేట్, హోటల్/ఆహార వ్యాపారం, సముద్ర/జల సంబంధిత వ్యాపారాలు మరియు ప్రజాసేవ రంగాలలో ఉన్నత విజయాలు సాధిస్తారు.',
    careerLifeWorkEn:
      'Favorable fields include healthcare, medicine, education, banking, real estate, hospitality, marine enterprises, and public administration.',

    businessPartnershipTe:
      'గురువు ఉచ్చ స్థితి పొందే రాశి కావున వీరి సలహాలు వ్యాపారానికి శుభప్రదం. నమ్మకమైన భాగస్వాములతో కలిసి చేసే గృహ, ఆహార, విద్యా మరియు ఆర్థిక వ్యాపారాలు విశేష లాభాలనిస్తాయి.',
    businessPartnershipEn:
      'Where Jupiter is exalted, Karkataka natives bring ethical wisdom and public trust to business partnerships, thriving in real estate, food, and financial sectors.',

    wealthAttractionTe:
      'పొదుపు చేసే స్వభావం, పూర్వీకుల ఆస్తులు, గృహ-భూమి పెట్టుబడులు మరియు వెండి/బంగారం ద్వారా వీరికి ధన సమృద్ధి కలుగుతుంది.',
    wealthAttractionEn:
      'Natural savers, Karkataka natives accumulate substantial wealth through residential property, land, precious metals, and prudent family investments.',

    bestPartnerRashisTe: 'వృశ్చికం, మీనం, వృషభం, కన్య మరియు మకర రాశులు',
    bestPartnerRashisEn: 'Scorpio (Vruschikam), Pisces (Meenam), Taurus (Vrushabham), Virgo (Kanya) & Capricorn (Makaram)',

    chandraManasikaTatvamTe:
      'చంద్రుని స్వక్షేత్రం కావున వీరికి అంతర్దృష్టి (Intuition), కరుణ, ఆధ్యాత్మిక భక్తి మరియు కుటుంబాన్ని కలుపుకుపోయే గుణం పుష్కలంగా ఉంటాయి.',
    chandraManasikaTatvamEn:
      'In the Moon’s own sign, natives are blessed with profound intuition, compassion, spiritual devotion, and emotional depth.',

    arogyaRakshaTe:
      'జీర్ణకోశం, ఉదరం మరియు కఫ సంబంధిత సమస్యలు రాకుండా చూసుకోవాలి. మానసిక ఆందోళన జీర్ణశక్తిపై ప్రభావం చూపుతుంది కాబట్టి సమయానికి గోరువెచ్చని సాత్విక ఆహారం తీసుకోవడం, ధ్యానం చేయడం ఉత్తమం.',
    arogyaRakshaEn:
      'Governing the chest and stomach, maintaining emotional calm directly supports digestion. Warm, freshly prepared meals and meditation keep vitality strong.',

    vedicRemedyTe:
      'సోమవారం శివాభిషేకం, గౌరీ దేవి ఆరాధన మరియు పౌర్ణమి నాడు చంద్ర దర్శనం/క్షీరాన్న దానం మనశ్శాంతిని, ఐశ్వర్యాన్ని ఇస్తాయి.',
    vedicRemedyEn:
      'Performing Rudrabhishekam on Mondays, worshipping Goddess Gauri, and offering rice kheer on Purnima bring mental peace and abundance.',
  },
  {
    id: 'simham',
    index: 5,
    rashiNameTe: 'సింహ రాశి',
    rashiNameEn: 'Leo (Simha Rashi)',
    rashiLordTe: 'సూర్యుడు (రవి)',
    rashiLordEn: 'Sun (Surya)',
    tatvamTe: 'అగ్ని తత్వం • స్థిర రాశి',
    tatvamEn: 'Fire Element • Fixed Sign',
    nakshatrasTe: 'మఖ (4 పాదాలు), పుబ్బ (4 పాదాలు), ఉత్తర (1వ పాదం)',
    nakshatrasEn: 'Magha (1–4), Pubba (1–4), Uttara (1)',
    kalapurushaAngamTe: 'హృదయం, వెన్నెముక & జీవశక్తి',
    kalapurushaAngamEn: 'Heart, Spine & Vital Prana',

    wifeProfileTe:
      'సింహ రాశి ఇల్లాలు రాజసమైన వ్యక్తిత్వం, ఆత్మవిశ్వాసం, ఉదార స్వభావం మరియు కుటుంబాన్ని ఉన్నత స్థాయిలో నిలబెట్టాలనే ఆశయం కలిగి ఉంటుంది. ఇంటికి వచ్చే బంధుమిత్రులను ఘనంగా ఆదరిస్తుంది. భర్త గౌరవాన్ని సమాజంలో పెంచుతుంది. భర్త తన పట్ల నిజాయితీగా ఉంటూ గౌరవ మర్యాదలు ఇస్తే ప్రాణమిస్తుంది.',
    wifeProfileEn:
      'A Simha Rashi wife possesses regal dignity, generosity, and high moral standards. She upholds family honor in society, hosts guests graciously, and radiates warmth when treated with respect and loyalty.',

    husbandProfileTe:
      'సింహ రాశి భర్త గంభీరమైన స్వభావం, నాయకత్వ పటిమ మరియు రక్షణాత్మక హృదయం కలవాడు. కుటుంబానికి పెద్దదిక్కుగా ఉంటూ అందరి బాధ్యతలను తన భుజస్కంధాలపై మోస్తాడు. చిన్నచిన్న విషయాలను పట్టించుకోని విశాల హృదయుడు. ఇంట్లో తన మాటకు గౌరవం లభిస్తే కుటుంబాన్ని మహారాజులా చూసుకుంటాడు.',
    husbandProfileEn:
      'A Simha Rashi husband is magnanimous, protective, and naturally authoritative. He takes pride in providing the best for his family and responds with boundless generosity when respected at home.',

    maritalHarmonySutraTe:
      'సూర్యాధిపత్య రాశి కావున దాంపత్యంలో అహంభావానికి (Ego) తావు ఇవ్వకూడదు. ఆదివారం సూర్య నమస్కారాలు, ఆదిత్య హృదయ పారాయణ కుటుంబ తేజస్సును పెంచుతాయి.',
    maritalHarmonySutraEn:
      'Ruled by the Sun, setting aside pride in domestic discussions and reciting Aditya Hrudayam on Sundays ensures radiant marital harmony.',

    childNatureAndStudyTe:
      'సింహ రాశి పిల్లలు పుట్టుకతోనే నాయకత్వ లక్షణాలు, ధైర్యం మరియు ఆత్మగౌరవం కలిగి ఉంటారు. తరగతి గదిలో ముందుండాలని కోరుకుంటారు. పరిపాలన, సైన్స్, రాజకీయాలు, వైద్యం మరియు సాంస్కృతిక కార్యక్రమాలలో చురుకుగా రాణిస్తారు.',
    childNatureAndStudyEn:
      'Simha children are natural leaders with bright confidence and noble ambitions. They thrive when given responsibility and excel in science, medicine, public speaking, and organizational roles.',

    parentingGuideTe:
      'ఈ రాశి పిల్లలను నలుగురి ముందు విమర్శించకూడదు; దానివల్ల వారి ఆత్మగౌరవం దెబ్బతింటుంది. ఏకాంతంగా ప్రేమతో మంచిచెడులు వివరిస్తూ, వారికి బాధ్యతలు అప్పగిస్తే క్రమశిక్షణతో కూడిన విజేతలుగా ఎదుగుతారు.',
    parentingGuideEn:
      'Never criticize a Simha child in front of others, as it wounds their dignity. Private, respectful guidance combined with leadership responsibilities brings out their noblest qualities.',

    parentTemperamentTe:
      'సింహ రాశి తల్లిదండ్రులు పిల్లల భవిష్యత్తు కోసం ఎంతటి త్యాగానికైనా సిద్ధపడతారు మరియు పిల్లలను ఉన్నత ఆశయాలతో పెంచుతారు.',
    parentTemperamentEn:
      'Simha parents are fiercely proud and supportive of their children, inspiring them to aim for excellence and ethical integrity.',

    careerLifeWorkTe:
      'ప్రభుత్వ ఉన్నత ఉద్యోగాలు (IAS/IPS/Group-1), రాజకీయాలు, కార్పొరేట్ సీఈఓ/మేనేజ్‌మెంట్, వైద్య రంగం, బంగారం/రత్నాల వ్యాపారం మరియు స్వతంత్ర సంస్థల అధిపతులుగా వీరు గొప్ప కీర్తిని గడిస్తారు.',
    careerLifeWorkEn:
      'Simha natives shine in civil services, government administration, executive leadership, cardiology/medicine, bullion trade, and institutional governance.',

    businessPartnershipTe:
      'వ్యాపారంలో వీరు ప్రధాన నిర్ణయాధికారిగా (Managing Partner) ఉండటానికి ఇష్టపడతారు. పారదర్శకత, నిజాయితీ ఉన్న భాగస్వాములతో కలిసి భారీ సంస్థలను నిర్మిస్తారు.',
    businessPartnershipEn:
      'Best suited as visionary managing partners, Simha natives build prestigious enterprises when paired with diplomatic and detail-focused associates.',

    wealthAttractionTe:
      'ఉన్నత పదవులు, ప్రభుత్వ కాంట్రాక్టులు, బంగారం, భూమి మరియు వారసత్వ ఆస్తుల ద్వారా వీరికి ధన ప్రాప్తి కలుగుతుంది. దానధర్మాలు చేసే ఉదార గుణం వల్ల లక్ష్మీ కటాక్షం నిరంతరం ఉంటుంది.',
    wealthAttractionEn:
      'Wealth comes through authority, high-level career positions, gold, and real estate, sustained by their noble and charitable disposition.',

    bestPartnerRashisTe: 'మేషం, ధనుస్సు, మిథునం మరియు తులా రాశులు',
    bestPartnerRashisEn: 'Aries (Mesham), Sagittarius (Dhanussu), Gemini (Mithunam) & Libra (Tula)',

    chandraManasikaTatvamTe:
      'సింహ రాశిలో చంద్రుడు ఉన్నవారు స్థిరమైన సంకల్ప బలం, ఆత్మవిశ్వాసం, సత్యనిষ্ঠ మరియు పరోపకార బుద్ధి కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Leo bestows unwavering willpower, nobility of character, warmth, and natural moral authority.',

    arogyaRakshaTe:
      'హృదయం, రక్తప్రసరణ మరియు వెన్నెముక ఆరోగ్యంపై శ్రద్ధ వహించాలి. అధిక శ్రమ, కోపం తగ్గించి సూర్యోదయ నడక, యోగాభ్యాసం మరియు తక్కువ ఉప్పు-నూనె గల సాత్విక ఆహారం తీసుకోవాలి.',
    arogyaRakshaEn:
      'Governing the heart and spine, natives should maintain cardiovascular fitness, upright posture, and balanced stress management through morning walks and yoga.',

    vedicRemedyTe:
      'ఆదివారం సూర్య భగవానునికి అర్ఘ్య ప్రదానం, ఆదిత్య హృదయ స్తోత్ర పారాయణ మరియు శివాభిషేకం ఆయురారోగ్య ఐశ్వర్యాలను ప్రసాదిస్తాయి.',
    vedicRemedyEn:
      'Offering Surya Arghyam on Sundays, chanting Aditya Hrudayam, and performing Rudrabhishekam bestow vitality and royal success.',
  },
  {
    id: 'kanya',
    index: 6,
    rashiNameTe: 'కన్యా రాశి',
    rashiNameEn: 'Virgo (Kanya Rashi)',
    rashiLordTe: 'బుధుడు (సౌమ్యుడు)',
    rashiLordEn: 'Mercury (Budha)',
    tatvamTe: 'భూ తత్వం • ద్విస్వభావ రాశి',
    tatvamEn: 'Earth Element • Dual Sign',
    nakshatrasTe: 'ఉత్తర (2, 3, 4 పాదాలు), హస్త (4 పాదాలు), చిత్త (1, 2 పాదాలు)',
    nakshatrasEn: 'Uttara (2–4), Hasta (1–4), Chitta (1–2)',
    kalapurushaAngamTe: 'ఉదర దిగువ భాగం, ప్రేగులు & నాడీ వ్యవస్థ',
    kalapurushaAngamEn: 'Lower Abdomen, Intestines & Enteric Nervous System',

    wifeProfileTe:
      'కన్యా రాశి ఇల్లాలు వివేకం, పరిశుభ్రత, క్రమశిక్షణ మరియు ఆర్థిక చతురత కలిగిన ఆదర్శ గృహిణి. ఇంటి బడ్జెట్‌ను రూపాయి వృథా కాకుండా ప్రణాళికాబద్ధంగా నిర్వహిస్తుంది. కుటుంబ సభ్యుల ఆరోగ్యం, పిల్లల చదువులపై ప్రత్యేక శ్రద్ధ చూపుతుంది. భర్తకు ప్రతి పనిలోనూ విలువైన సూచనలు ఇస్తుంది.',
    wifeProfileEn:
      'A Kanya Rashi wife is intelligent, orderly, and remarkably prudent. She manages household finances and family health with meticulous care, offering practical wisdom that elevates the entire family.',

    husbandProfileTe:
      'కన్యా రాశి భర్త విశ్లేషణాత్మక మేధస్సు, నిజాయితీ మరియు కష్టపడి పనిచేసే స్వభావం కలవాడు. దుబారా ఖర్చులకు దూరంగా ఉంటూ కుటుంబానికి భవిష్యత్తు నిధిని ఏర్పరుస్తాడు. భార్య పట్ల మర్యాదగా, బాధ్యతాయుతంగా వ్యవహరిస్తాడు.',
    husbandProfileEn:
      'A Kanya Rashi husband is analytical, conscientious, and dependable. He plans methodically for the family’s future security and values cleanliness, honesty, and mutual respect in marriage.',

    maritalHarmonySutraTe:
      'బుధుని ఉచ్చ రాశి కావున ప్రతి విషయంలోనూ అతి ఖచ్చితత్వం (Perfectionism) ఆశించకుండా, భాగస్వామిని ప్రేమతో అర్థం చేసుకోవాలి. బుధవారం విష్ణు ఆరాధన శుభప్రదం.',
    maritalHarmonySutraEn:
      'Where Mercury is exalted, replacing critical perfectionism with appreciative warmth makes married life deeply fulfilling.',

    childNatureAndStudyTe:
      'కన్యా రాశి పిల్లలు చదువులో అత్యంత శ్రద్ధ, క్రమశిక్షణ మరియు సూక్ష్మ పరిశీలనా శక్తి కలిగి ఉంటారు. గణితం, సైన్స్, మెడిసిన్, అకౌంటెన్సీ మరియు కంప్యూటర్ రంగాలలో అగ్రశ్రేణి మార్కులు సాధిస్తారు.',
    childNatureAndStudyEn:
      'Kanya children are studious, neat, and analytically sharp. They excel naturally in mathematics, medicine, coding, sciences, and competitive examinations.',

    parentingGuideTe:
      'ఈ పిల్లలు పరీక్షల సమయంలో స్వయంగా ఒత్తిడికి గురయ్యే స్వభావం కలిగి ఉంటారు. తల్లిదండ్రులు వీరికి మార్కుల భయం పెట్టకుండా, ధైర్యం చెబుతూ ప్రోత్సహిస్తే అత్యున్నత విద్యా శిఖరాలను చేరుకుంటారు.',
    parentingGuideEn:
      'Since Kanya children are naturally self-critical, reassure them during exams and celebrate their effort so they remain relaxed and confident.',

    parentTemperamentTe:
      'కన్యా రాశి తల్లిదండ్రులు పిల్లల ఆరోగ్యం, ఆహారం మరియు విద్యా క్రమశిక్షణ పట్ల అత్యంత శ్రద్ధ వహిస్తారు.',
    parentTemperamentEn:
      'Kanya parents provide organized, health-conscious, and academically enriching upbringing for their children.',

    careerLifeWorkTe:
      'చార్టర్డ్ అకౌంటెన్సీ (CA), ఆడిటింగ్, సాఫ్ట్‌వేర్ ఇంజనీరింగ్, డేటా అనలిటిక్స్, వైద్యం, ఫార్మసీ, బ్యాంకింగ్, విద్యా బోధన, ప్రచురణ మరియు వాణిజ్య రంగాలలో వీరు అద్భుత విజయాలు సాధిస్తారు.',
    careerLifeWorkEn:
      'Kanya natives excel as chartered accountants, software architects, data analysts, physicians, pharmacists, educators, and financial auditors.',

    businessPartnershipTe:
      'వ్యాపారంలో లాభనష్టాలను ఖచ్చితంగా అంచనా వేయగల నిపుణులు. ఏ వ్యాపార సంస్థలోనైనా కన్యా రాశి భాగస్వామి ఉంటే ఆర్థిక నష్టాలు రాకుండా సంస్థ సురక్షితంగా లాభాల బాటలో నడుస్తుంది.',
    businessPartnershipEn:
      'In business partnerships, Kanya natives provide unmatched financial auditing, risk control, and operational quality assurance.',

    wealthAttractionTe:
      'బుద్ధిబలం, వాణిజ్య నైపుణ్యం, క్రమబద్ధమైన పొదుపు (SIP/Investments) మరియు వాణిజ్య ఆస్తుల ద్వారా వీరు స్థిరమైన ధనవంతులవుతారు.',
    wealthAttractionEn:
      'Wealth is built steadily through analytical investments, professional expertise, commercial real estate, and disciplined compounding.',

    bestPartnerRashisTe: 'వృషభం, మకరం, కర్కాటకం, వృశ్చికం మరియు మిథున రాశులు',
    bestPartnerRashisEn: 'Taurus (Vrushabham), Capricorn (Makaram), Cancer (Karkatakam), Scorpio (Vruschikam) & Gemini (Mithunam)',

    chandraManasikaTatvamTe:
      'కన్యా రాశిలో చంద్రుడు ఉన్నవారు విచక్షణా జ్ఞానం, సేవాభావం, మర్యాద మరియు సమస్యలను శాస్త్రీయంగా పరిష్కరించే నేర్పు కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Virgo bestows keen discernment, practicality, helpfulness, and a refined, problem-solving intellect.',

    arogyaRakshaTe:
      'జీర్ణవ్యవస్థ, ప్రేగులు మరియు నాడీ మండలంపై శ్రద్ధ వహించాలి. అతిగా ఆలోచించడం వల్ల గ్యాస్ట్రిక్/అజీర్తి సమస్యలు రావచ్చు. పీచు పదార్థం గల ఆహారం, మజ్జిగ మరియు తగినంత విశ్రాంతి ఆరోగ్యానికి మేలు చేస్తాయి.',
    arogyaRakshaEn:
      'Governing the digestive tract and nerves, natives thrive on fiber-rich sattvic food, probiotics, and mindfulness practices that quiet mental worry.',

    vedicRemedyTe:
      'బుధవారం శ్రీ వేంకటేశ్వర స్వామి అర్చన, విష్ణు సహస్రనామ పారాయణ మరియు గోవుకు ఆకుకూరలు/గ్రాసం సమర్పించడం శుభప్రదం.',
    vedicRemedyEn:
      'Worshipping Lord Venkateswara on Wednesdays, chanting Vishnu Sahasranama, and feeding green fodder to cows bring peace and prosperity.',
  },
  {
    id: 'tula',
    index: 7,
    rashiNameTe: 'తులా రాశి',
    rashiNameEn: 'Libra (Tula Rashi)',
    rashiLordTe: 'శుక్రుడు (భార్గవుడు)',
    rashiLordEn: 'Venus (Shukra)',
    tatvamTe: 'వాయు తత్వం • చర రాశి',
    tatvamEn: 'Air Element • Movable Sign',
    nakshatrasTe: 'చిత్త (3, 4 పాదాలు), స్వాతి (4 పాదాలు), విశాఖ (1, 2, 3 పాదాలు)',
    nakshatrasEn: 'Chitta (3–4), Swati (1–4), Vishakha (1–3)',
    kalapurushaAngamTe: 'మూత్రపిండాలు (కిడ్నీలు), నడుము & అంతర్గత సమతుల్యత',
    kalapurushaAngamEn: 'Kidneys, Lower Back & Lumbar Balance',

    wifeProfileTe:
      'తులా రాశి ఇల్లాలు సౌందర్యం, చిరునవ్వు, న్యాయబుద్ధి మరియు సమతుల్య స్వభావం కలిగి ఉంటుంది. గొడవలకు దూరంగా ఉంటూ ఇంట్లో శాంతి సామరస్యాలను కాపాడుతుంది. అత్తవారింటిని, పుట్టింటిని సమాన గౌరవంతో చూసుకునే చాకచక్యం ఈమె సొంతం. భర్తకు ఉత్తమ జీవిత భాగస్వామిగా నిలుస్తుంది.',
    wifeProfileEn:
      'A Tula Rashi wife is graceful, diplomatic, and fair-minded. She fosters peace across extended families, adorns the home with beauty, and brings balanced wisdom to every marital decision.',

    husbandProfileTe:
      'తులా రాశి భర్త సంస్కారవంతుడు, భార్య మనోభావాలను గౌరవించేవాడు మరియు కుటుంబంలో అందరినీ సమానంగా ప్రేమించే స్వభావం కలవాడు. ఏ నిర్ణయమైనా భార్యతో చర్చించి తీసుకుంటాడు. కఠినమైన మాటల కంటే సామరస్యంగా సమస్యలను పరిష్కరిస్తాడు.',
    husbandProfileEn:
      'A Tula Rashi husband is courteous, equitable, and deeply partnership-oriented. He treats his wife as a true equal, values harmony at home, and excels in resolving family matters with tact.',

    maritalHarmonySutraTe:
      'శుక్రాధిపత్య సప్తమ రాశి కావున వీరికి దాంపత్యమే ప్రాణవాయువు. నిర్ణయాలు తీసుకోవడంలో ఊగిసలాట తగ్గించి, శుక్రవారం లలితా సహస్రనామ పారాయణ చేయడం శుభప్రదం.',
    maritalHarmonySutraEn:
      'Ruled by Venus, mutual decisiveness and Friday recitation of Sri Lalita Sahasranama keep marital love evergreen.',

    childNatureAndStudyTe:
      'తులా రాశి పిల్లలు మర్యాదస్తులు, స్నేహశీలురు మరియు కళాత్మక-తార్కిక మేధస్సు కలవారు. న్యాయశాస్త్రం, వాణిజ్యం, డిజైనింగ్, దౌత్యం, ఐటీ మరియు మేనేజ్‌మెంట్ రంగాలలో రాణిస్తారు.',
    childNatureAndStudyEn:
      'Tula children are polite, cooperative, and intellectually balanced, showing natural aptitude for law, commerce, architecture, design, and technology.',

    parentingGuideTe:
      'ఈ పిల్లలు ఘర్షణ వాతావరణాన్ని తట్టుకోలేరు. ప్రశాంతమైన గృహ వాతావరణంలో సానుకూల ప్రోత్సాహం అందిస్తూ, సొంతంగా వేగంగా నిర్ణయాలు తీసుకునే అలవాటు నేర్పిస్తే గొప్ప స్థాయికి చేరుకుంటారు.',
    parentingGuideEn:
      'Provide a peaceful, harmonious study space and gently train Tula children to make timely independent decisions without hesitation.',

    parentTemperamentTe:
      'తులా రాశి తల్లిదండ్రులు పిల్లల పట్ల నిష్పక్షపాతంగా, స్నేహపూర్వకంగా ఉంటూ ఉత్తమ సంస్కారాన్ని నేర్పుతారు.',
    parentTemperamentEn:
      'Tula parents are fair,listening-oriented, and raise children with refined manners and social grace.',

    careerLifeWorkTe:
      'న్యాయవాద వృత్తి, న్యాయమూర్తులు, వ్యాపార వాణిజ్య రంగాలు, బ్యాంకింగ్, డిప్లొమసీ, ఐటీ కన్సల్టెన్సీ, ఫ్యాషన్/జ్యువెలరీ, ఆర్కిటెక్చర్ మరియు ప్రజా సంబంధాల రంగాలలో అగ్రగాములుగా ఉంటారు.',
    careerLifeWorkEn:
      'Ideal professions include law, judiciary, corporate management, banking, diplomacy, architecture, luxury retail, and public relations.',

    businessPartnershipTe:
      'ద్వాదశ రాశులలో వ్యాపార భాగస్వామ్యానికి (Business Partnership) అత్యంత అనుకూలమైన రాశి తుల. శని ఉచ్చ స్థితి పొందే రాశి కావున వీరు న్యాయంగా, ధర్మంగా భాగస్వామ్య వ్యాపారాలను నడిపించి ఉభయులకూ లాభాలు చేకూరుస్తారు.',
    businessPartnershipEn:
      'The premier sign of partnerships (where Saturn is exalted), Tula natives excel in joint ventures, upholding fairness, contracts, and long-term profitability.',

    wealthAttractionTe:
      'వాణిజ్య వ్యాపారాలు, భాగస్వామ్య సంస్థలు, విలువైన ఆభరణాలు మరియు వాణిజ్య భవనాల ద్వారా వీరికి విశేష ధనయోగం కలుగుతుంది.',
    wealthAttractionEn:
      'Wealth flows steadily through commerce, joint enterprises, commercial properties, and high-value trade.',

    bestPartnerRashisTe: 'మిథునం, కుంభం, సింహం, ధనుస్సు మరియు మేష రాశులు',
    bestPartnerRashisEn: 'Gemini (Mithunam), Aquarius (Kumbham), Leo (Simham), Sagittarius (Dhanussu) & Aries (Mesham)',

    chandraManasikaTatvamTe:
      'తులా రాశిలో చంద్రుడు ఉన్నవారు శాంతిপ্রియులు, న్యాయవాదులు, కలుపుగోలు స్వభావం మరియు లౌకిక చాకచక్యం కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Libra grants a serene, diplomatic, socially graceful, and justice-loving temperament.',

    arogyaRakshaTe:
      'మూత్రపిండాలు (కిడ్నీలు), నడుము భాగం మరియు చక్కెర స్థాయిలపై శ్రద్ధ వహించాలి. ప్రతిరోజూ తగినంత మంచినీరు త్రాగడం, నడుము వ్యాయామాలు చేయడం ఆరోగ్యానికి మేలు చేస్తుంది.',
    arogyaRakshaEn:
      'Governing the kidneys and lower back, ample pure water intake, balanced sugar consumption, and core-strengthening yoga preserve vitality.',

    vedicRemedyTe:
      'శుక్రవారం శ్రీ మహాలక్ష్మి / లలితా దేవి ఆరాధన మరియు శనివారం వేంకటేశ్వర స్వామి దర్శనం సకల శుభాలను ఇస్తాయి.',
    vedicRemedyEn:
      'Worshipping Goddess Mahalakshmi on Fridays and Lord Venkateswara on Saturdays bestows fortune and harmony.',
  },
  {
    id: 'vruschikam',
    index: 8,
    rashiNameTe: 'వృశ్చిక రాశి',
    rashiNameEn: 'Scorpio (Vruschika Rashi)',
    rashiLordTe: 'కుజుడు (అంగారకుడు)',
    rashiLordEn: 'Mars (Kuja)',
    tatvamTe: 'జల తత్వం • స్థిర రాశి',
    tatvamEn: 'Water Element • Fixed Sign',
    nakshatrasTe: 'విశాఖ (4వ పాదం), అనురాధ (4 పాదాలు), జ్యేష్ఠ (4 పాదాలు)',
    nakshatrasEn: 'Vishakha (4), Anuradha (1–4), Jyeshtha (1–4)',
    kalapurushaAngamTe: 'రోగనిరోధక శక్తి & మూలాధార చక్ర స్థానం',
    kalapurushaAngamEn: 'Immune Vitality & Regenerative System',

    wifeProfileTe:
      'వృశ్చిక రాశి ఇల్లాలు అపారమైన మనోధైర్యం, పట్టుదల మరియు కుటుంబాన్ని కష్టాల నుండి రక్షించే శక్తి కలిగి ఉంటుంది. పైకి గంభీరంగా కనిపించినా అంతరంగంలో భర్త, పిల్లల పట్ల అవ్యాజమైన ప్రేమ ఉంటుంది. రహస్యాలను కాపాడటంలో, ఆర్థిక నిల్వలను పెంచడంలో అత్యంత నేర్పరి.',
    wifeProfileEn:
      'A Vruschika Rashi wife possesses deep inner strength, loyalty, and protective devotion. She guards family dignity and finances with wisdom and stands unshaken beside her spouse through every test of life.',

    husbandProfileTe:
      'వృశ్చిక రాశి భర్త లోతైన ఆలోచనా శక్తి, కష్టపడి పైకి వచ్చే పట్టుదల మరియు కుటుంబానికి రక్షణ కవచంలా నిలిచే స్వభావం కలవాడు. ఏ పని తలపెట్టినా పూర్తి చేసేవరకు విశ్రమించడు. తనను నమ్మినవారికి ప్రాణమిచ్చే నిజాయితీ ఇతని సొంతం.',
    husbandProfileEn:
      'A Vruschika Rashi husband is determined, perceptive, and fiercely protective of his loved ones. He achieves remarkable breakthroughs through perseverance and values deep, unshakeable trust in marriage.',

    maritalHarmonySutraTe:
      'కుజాధిపత్య జల రాశి కావున పాత విషయాలను మనసులో పెట్టుకోకుండా క్షమాగుణం, మృదు సంభాషణ అలవరచుకోవాలి. మంగళవారం సుబ్రహ్మణ్య అభిషేకం, సోమవారం శివారాధన ఉత్తమం.',
    maritalHarmonySutraEn:
      'Letting go of past grievances and practicing open communication, alongside Tuesday Subrahmanya and Monday Shiva worship, ensures deep marital peace.',

    childNatureAndStudyTe:
      'వృశ్చిక రాశి పిల్లలు తీక్షణమైన మేధస్సు, పరిశోధనా స్వభావం (Research Mindset) మరియు ఏకాగ్రత కలిగి ఉంటారు. వైద్యం, శస్త్రచికిత్స, రసాయన శాస్త్రం, ఇంజనీరింగ్, సైబర్ సెక్యూరిటీ మరియు ఉన్నత శాస్త్ర పరిశోధనలలో అద్భుతంగా రాణిస్తారు.',
    childNatureAndStudyEn:
      'Vruschika children have penetrating intellects and investigative curiosity, excelling in medicine, surgery, chemistry, engineering, and scientific research.',

    parentingGuideTe:
      'ఈ పిల్లలు తమ భావాలను బయటకు త్వరగా చెప్పుకోరు. తల్లిదండ్రులు వారితో ప్రేమగా మాట్లాడుతూ, వారిలోని పరిశోధనా శక్తిని సరైన విద్యా మార్గంలో పెడితే అసాధారణ విజయాలు సాధిస్తారు.',
    parentingGuideEn:
      'Build warm trust so Vruschika children share their feelings openly, and channel their intense focus into advanced academic and scientific projects.',

    parentTemperamentTe:
      'వృశ్చిక రాశి తల్లిదండ్రులు పిల్లల భద్రత, క్రమశిక్షణ మరియు ఉన్నత భవిష్యత్తు కోసం ఎంతో నిబద్ధతతో కృషి చేస్తారు.',
    parentTemperamentEn:
      'Vruschika parents are deeply committed to their children’s protection, resilience, and long-term career mastery.',

    careerLifeWorkTe:
      'వైద్య రంగం (సర్జన్లు/ఫార్మసీ), రక్షణ & పోలీస్ శాఖ, సైంటిఫిక్ రీసెర్చ్, సాఫ్ట్‌వేర్/సైబర్ సెక్యూరిటీ, ఇన్సూరెన్స్, మైనింగ్, కెమికల్స్ మరియు ప్రభుత్వ పరిపాలనా రంగాలలో ఉన్నత స్థానాలను అధిరోహిస్తారు.',
    careerLifeWorkEn:
      'Vruschika natives excel in medicine, surgery, defense, scientific research, cybersecurity, insurance, pharmaceuticals, and strategic administration.',

    businessPartnershipTe:
      'వ్యాపారంలో ఆటుపోట్లను తట్టుకుని నిలబడే ధైర్యం వీరికి ఉంటుంది. ఆర్థిక పారదర్శకత కలిగిన భాగస్వాములతో కలిసి పరిశ్రమలు, వైద్య లేదా సాంకేతిక సంస్థలను విజయవంతంగా నడుపుతారు.',
    businessPartnershipEn:
      'Resilient and strategic in business, Vruschika natives excel in industrial, healthcare, and technology ventures with transparent partners.',

    wealthAttractionTe:
      'భూమి, పరిశ్రమలు, ఇన్సూరెన్స్, దీర్ఘకాలిక పెట్టుబడులు మరియు ఆకస్మిక ధనయోగాల ద్వారా వీరికి సంపద చేకూరుతుంది.',
    wealthAttractionEn:
      'Wealth accumulates through real estate, research-driven enterprises, insurance, and patient long-term investments.',

    bestPartnerRashisTe: 'కర్కాటకం, మీనం, వృషభం, కన్య మరియు మకర రాశులు',
    bestPartnerRashisEn: 'Cancer (Karkatakam), Pisces (Meenam), Taurus (Vrushabham), Virgo (Kanya) & Capricorn (Makaram)',

    chandraManasikaTatvamTe:
      'వృశ్చిక రాశిలో చంద్రుడు ఉన్నవారు గొప్ప సంకల్ప బలం, ఆత్మస్థైర్యం మరియు ఆధ్యాత్మిక-మంత్ర శాస్త్రాల పట్ల ఆసక్తి కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Scorpio imparts deep emotional resilience, willpower, intuitive perception, and spiritual depth.',

    arogyaRakshaTe:
      'రోగనిరోధక శక్తి, రక్తశుద్ధి మరియు జీర్ణవ్యవస్థపై శ్రద్ధ వహించాలి. కారం, మసాలాలు తగ్గించి, తగినంత మంచినీరు, పండ్లు మరియు ధ్యానం అలవరచుకోవడం వల్ల సంపూర్ణ ఆరోగ్యం లభిస్తుంది.',
    arogyaRakshaEn:
      'Supporting immune vitality and hydration while moderating spicy foods and practicing daily meditation ensures robust lifelong health.',

    vedicRemedyTe:
      'మంగళవారం శ్రీ సుబ్రహ్మణ్య స్వామి అభిషేకం, హనుమాన్ చాలీసా పారాయణ మరియు సోమవారం రుద్రాభిషేకం సర్వదోష నివారిణి.',
    vedicRemedyEn:
      'Tuesday Subrahmanya Abhishekam, chanting Hanuman Chalisa, and Monday Rudrabhishekam bestow mental peace and victory.',
  },
  {
    id: 'dhanussu',
    index: 9,
    rashiNameTe: 'ధనుస్సు రాశి',
    rashiNameEn: 'Sagittarius (Dhanussu Rashi)',
    rashiLordTe: 'దేవగురు బృహస్పతి (గురుడు)',
    rashiLordEn: 'Jupiter (Guru)',
    tatvamTe: 'అగ్ని తత్వం • ద్విస్వభావ రాశి',
    tatvamEn: 'Fire Element • Dual Sign',
    nakshatrasTe: 'మూల (4 పాదాలు), పూర్వాషాఢ (4 పాదాలు), ఉత్తరాషాఢ (1వ పాదం)',
    nakshatrasEn: 'Moola (1–4), Purvashadha (1–4), Uttarashadha (1)',
    kalapurushaAngamTe: 'తొడలు, తుంటి భాగం & కాలేయం (లివర్)',
    kalapurushaAngamEn: 'Thighs, Hips & Hepatic System',

    wifeProfileTe:
      'ధనుస్సు రాశి ఇల్లాలు ధర్మబద్ధమైన నడవడిక, దైవభక్తి, ఉత్సాహం మరియు విద్యా సంపన్నత కలిగి ఉంటుంది. ఇంటిని ఆధ్యాత్మిక శోభతో, సానుకూల శక్తితో నింపుతుంది. భర్త అభివృద్ధికి మంచి మార్గదర్శిగా నిలుస్తుంది. నిజాయితీగా మాట్లాడుతుంది, పెద్దలను గౌరవిస్తుంది.',
    wifeProfileEn:
      'A Dhanussu Rashi wife is principled, optimistic, and spiritually inclined. She brings auspiciousness, wisdom, and cheerful enthusiasm into the household, inspiring her husband and children toward noble goals.',

    husbandProfileTe:
      'ధనుస్సు రాశి భర్త ధర్మం, న్యాయం, ఉదార స్వభావం మరియు ఉన్నత ఆశయాలు కలవాడు. కుటుంబానికి మంచి పేరు ప్రతిష్ఠలు తీసుకువస్తాడు. భార్యాపిల్లలను విద్యా, ఆధ్యాత్మిక, సామాజిక రంగాలలో ప్రోత్సహిస్తాడు. కపటం లేని నిర్మలమైన మనస్సు ఇతనిది.',
    husbandProfileEn:
      'A Dhanussu Rashi husband is ethical, generous, and forward-looking. He leads the family with wisdom, supports his spouse’s growth, and commands natural respect in society.',

    maritalHarmonySutraTe:
      'గురు ఆధిపత్య రాశి కావున దంపతులు ఉన్నత ఆదర్శాలతో ఉంటారు. మాటలలో తొందరపాటు లేకుండా సున్నితత్వం పాటించడం, గురువారం దక్షిణామూర్తి / దత్తాత్రేయ ఆరాధన చేయడం శ్రేష్ఠం.',
    maritalHarmonySutraEn:
      'Ruled by Jupiter, tempering blunt speech with gentleness and worshipping Lord Dakshinamurthy on Thursdays brings lifelong marital grace.',

    childNatureAndStudyTe:
      'ధనుస్సు రాశి పిల్లలు చురుకైన మేధస్సు, ఉన్నత విద్యాభ్యాస యోగం మరియు క్రీడా-సాంస్కృతిక ఆసక్తులు కలిగి ఉంటారు. న్యాయశాస్త్రం, ఇంజనీరింగ్, మేనేజ్‌మెంట్, తత్వశాస్త్రం మరియు విదేశీ విద్యలలో విశేషంగా రాణిస్తారు.',
    childNatureAndStudyEn:
      'Dhanussu children are bright, truthful, and eager learners with strong prospects for higher and international education in engineering, law, sciences, and management.',

    parentingGuideTe:
      'వీరికి నీతి కథలు, ఉన్నత ఆశయాలు చెబితే త్వరగా స్ఫూర్తి పొందుతారు. స్వేచ్ఛతో కూడిన క్రమశిక్షణ ఇస్తే చదువులోనూ, సమాజంలోనూ ఆదర్శంగా నిలుస్తారు.',
    parentingGuideEn:
      'Inspire Dhanussu children through noble ideals, mentorship, and outdoor sports; they respond brilliantly to trust and ethical guidance.',

    parentTemperamentTe:
      'ధనుస్సు రాశి తల్లిదండ్రులు పిల్లలకు ఉత్తమ గురువులుగా ఉంటూ ధర్మం, విద్య మరియు సంస్కారాన్ని నేర్పుతారు.',
    parentTemperamentEn:
      'Dhanussu parents act as wise mentors, imparting strong moral values, optimism, and love for learning.',

    careerLifeWorkTe:
      'విద్యా సంస్థలు, ప్రొఫెసర్లు, న్యాయమూర్తులు, బ్యాంకింగ్ & ఫైనాన్స్, ఐటీ మేనేజ్‌మెంట్, ప్రభుత్వ సలహాదారులు, ఆధ్యాత్మిక-ధార్మిక సంస్థలు మరియు విదేశీ వాణిజ్య రంగాలలో వీరు అగ్రస్థానానికి చేరుకుంటారు.',
    careerLifeWorkEn:
      'Dhanussu natives excel as professors, jurists, financial executives, IT directors, institutional leaders, counselors, and international entrepreneurs.',

    businessPartnershipTe:
      'వీరి భాగస్వామ్యం వ్యాపారానికి అదృష్టాన్ని, నైతిక విలువలను తెస్తుంది. విద్యా, ఆర్థిక, రియల్ ఎస్టేట్ మరియు టెక్నాలజీ రంగాలలో వీరి భాగస్వామ్యం అత్యంత విజయవంతమవుతుంది.',
    businessPartnershipEn:
      'Bringing integrity and expansive vision, Dhanussu partners attract institutional trust and steady expansion in business ventures.',

    wealthAttractionTe:
      'గురు బలం వల్ల వీరికి గౌరవప్రదమైన మార్గాలలో ధనలాభం, భూ-గృహ యోగం మరియు సమాజంలో రాజపూజ్యం లభిస్తాయి.',
    wealthAttractionEn:
      'Blessed by Jupiter, wealth arrives through honorable professions, real estate, advisory roles, and long-term equity growth.',

    bestPartnerRashisTe: 'మేషం, సింహం, తుల, కుంభం మరియు మీన రాశులు',
    bestPartnerRashisEn: 'Aries (Mesham), Leo (Simham), Libra (Tula), Aquarius (Kumbham) & Pisces (Meenam)',

    chandraManasikaTatvamTe:
      'ధనుస్సు రాశిలో చంద్రుడు ఉన్నవారు ఆశావాదం, ధర్మచింతన, పెద్దల పట్ల భక్తి మరియు పరోపకార గుణం కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Sagittarius bestows unshakeable optimism, philosophical wisdom, truthfulness, and a generous spirit.',

    arogyaRakshaTe:
      'తొడలు, తుంటి నరాలు (Sciatica) మరియు కాలేయం (లివర్) ఆరోగ్యంపై శ్రద్ధ వహించాలి. నూనె, తీపి పదార్థాలు మితంగా తీసుకుంటూ ప్రతిరోజూ నడక, యోగా చేయడం ఉత్తమం.',
    arogyaRakshaEn:
      'Governing the hips, thighs, and liver, daily walking, stretching, and moderating rich/sweet foods maintain agile vitality.',

    vedicRemedyTe:
      'గురువారం శ్రీ దక్షిణామూర్తి / సాయిబాబా / దత్తాత్రేయ ఆరాధన, శనగల నైవేద్యం మరియు శివాభిషేకం సర్వశుభప్రదం.',
    vedicRemedyEn:
      'Worshipping Guru Dakshinamurthy or Lord Dattatreya on Thursdays and performing Rudrabhishekam bring wisdom and fortune.',
  },
  {
    id: 'makaram',
    index: 10,
    rashiNameTe: 'మకర రాశి',
    rashiNameEn: 'Capricorn (Makara Rashi)',
    rashiLordTe: 'శని భగవానుడు (మందుడు)',
    rashiLordEn: 'Saturn (Shani)',
    tatvamTe: 'భూ తత్వం • చర రాశి',
    tatvamEn: 'Earth Element • Movable Sign',
    nakshatrasTe: 'ఉత్తరాషాఢ (2, 3, 4 పాదాలు), శ్రవణం (4 పాదాలు), ధనిష్ఠ (1, 2 పాదాలు)',
    nakshatrasEn: 'Uttarashadha (2–4), Shravanam (1–4), Dhanishtha (1–2)',
    kalapurushaAngamTe: 'మోకాళ్లు, కీళ్లు & అస్థిపంజర (ఎముకల) వ్యవస్థ',
    kalapurushaAngamEn: 'Knees, Joints & Skeletal Structure',

    wifeProfileTe:
      'మకర రాశి ఇల్లాలు ఓర్పు, కార్యదీక్ష, ఆర్థిక క్రమశిక్షణ మరియు కుటుంబ గౌరవాన్ని నిలబెట్టే గొప్ప గుణం కలది. కష్టసుఖాలలో భర్తకు వెన్నెముకలా నిలుస్తుంది. దుబారా చేయకుండా ప్రతి రూపాయిని కుటుంబ భవిష్యత్తు కోసం, పిల్లల ఉన్నతి కోసం జాగ్రత్త చేస్తుంది.',
    wifeProfileEn:
      'A Makara Rashi wife is patient, dignified, and exceptionally resourceful. She stands as a rock of support for her husband, building lasting family prestige and financial security through quiet dedication.',

    husbandProfileTe:
      'మకర రాశి భర్త కఠిన శ్రమ, నిబద్ధత మరియు బాధ్యతాయుతమైన వ్యక్తిత్వం కలవాడు. మాటల కంటే చేతలతో కుటుంబానికి రక్షణ కల్పిస్తాడు. వయస్సు పెరిగే కొద్దీ ఉన్నత పదవులు, ఆస్తులు సంపాదించి కుటుంబాన్ని సుఖపెడతాడు.',
    husbandProfileEn:
      'A Makara Rashi husband is industrious, reliable, and deeply committed to family duty. He builds enduring wealth and social standing step by step through perseverance.',

    maritalHarmonySutraTe:
      'శని ఆధిపత్య రాశి కావున పని ఒత్తిడిని ఇంటికి తీసుకురాకుండా కుటుంబంతో ఆనందంగా గడపాలి. శనివారం శ్రీ వేంకటేశ్వర స్వామి ఆరాధన దాంపత్య సౌఖ్యాన్ని పెంచుతుంది.',
    maritalHarmonySutraEn:
      'Ruled by Saturn, balancing career ambition with warm family time and worshipping Lord Venkateswara on Saturdays brings deep domestic joy.',

    childNatureAndStudyTe:
      'మకర రాశి పిల్లలు చిన్నప్పటి నుండే పెద్దవారిలా ఆలోచించే పరిణతి, పట్టుదల మరియు లక్ష్యశుద్ధి కలిగి ఉంటారు. ఇంజనీరింగ్, సివిల్ సర్వీసెస్, మెడిసిన్, కామర్స్ మరియు మేనేజ్‌మెంట్ రంగాలలో క్రమశిక్షణతో చదివి విజయం సాధిస్తారు.',
    childNatureAndStudyEn:
      'Makara children are mature, disciplined, and goal-oriented. Their steady perseverance leads to top achievements in engineering, civil services, commerce, and medicine.',

    parentingGuideTe:
      'ఈ పిల్లలు తమ బాధ్యతలను తామే నిర్వహిస్తారు; అయితే అప్పుడప్పుడు ఆటపాటలు, ఉల్లాసం ఉండేలా తల్లిదండ్రులు ప్రోత్సహిస్తూ ప్రేమను వ్యక్తపరిస్తే వీరి ఆత్మవిశ్వాసం రెట్టింపు అవుతుంది.',
    parentingGuideEn:
      'Because Makara children are naturally serious and diligent, warm praise and joyful family recreation keep their spirits bright.',

    parentTemperamentTe:
      'మకర రాశి తల్లిదండ్రులు పిల్లలకు కష్టపడి పనిచేసే తత్వం, సమయపాలన మరియు ఆర్థిక విలువలను నేర్పుతారు.',
    parentTemperamentEn:
      'Makara parents instill strong work ethic, integrity, and practical life skills in their children.',

    careerLifeWorkTe:
      'సివిల్ & మెకానికల్ ఇంజనీరింగ్, రియల్ ఎస్టేట్, నిర్మాణ రంగం, ఐటీ ప్రాజెక్ట్ మేనేజ్‌మెంట్, ప్రభుత్వ పరిపాలన, పరిశ్రమలు, మైనింగ్ మరియు ఆర్థిక సంస్థలలో అత్యున్నత స్థాయికి ఎదుగుతారు.',
    careerLifeWorkEn:
      'Makara natives excel in civil/software engineering, infrastructure, manufacturing, corporate administration, real estate, and public governance.',

    businessPartnershipTe:
      'కుజుడు ఉచ్చ స్థితి పొందే రాశి కావున మకర రాశి వారికి కార్యనిర్వహణ శక్తి (Execution Power) అపారం. భాగస్వామ్య వ్యాపారాలలో దీర్ఘకాలిక స్థిరత్వాన్ని, నమ్మకాన్ని అందిస్తారు.',
    businessPartnershipEn:
      'Where Mars is exalted, Makara partners bring unmatched execution discipline, reliability, and long-term structural growth to enterprises.',

    wealthAttractionTe:
      'శ్రమ, భూమి, గృహ నిర్మాణం, పరిశ్రమలు మరియు దీర్ఘకాలిక ఆస్తుల ద్వారా వీరు స్థిరమైన కుబేరులవుతారు. వీరి సంపద తరతరాలకు నిలుస్తుంది.',
    wealthAttractionEn:
      'Wealth is built steadily through land, real estate, industrial enterprises, and disciplined long-term investments.',

    bestPartnerRashisTe: 'వృషభం, కన్య, వృశ్చికం, మీనం మరియు కర్కాటక రాశులు',
    bestPartnerRashisEn: 'Taurus (Vrushabham), Virgo (Kanya), Scorpio (Vruschikam), Pisces (Meenam) & Cancer (Karkatakam)',

    chandraManasikaTatvamTe:
      'మకర రాశిలో చంద్రుడు ఉన్నవారు ఆచరణాత్మక ఆలోచన, ఓర్పు, కష్టాలను తట్టుకునే గుండెనిబ్బరం మరియు కార్యసాధన కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Capricorn grants practical wisdom, patience, emotional steadiness, and unwavering determination.',

    arogyaRakshaTe:
      'మోకాళ్లు, కీళ్లు, ఎముకలు మరియు వాత సంబంధిత నొప్పులు రాకుండా చూసుకోవాలి. కాల్షియం పుష్కలంగా ఉన్న ఆహారం, నువ్వుల నూనె మర్దన మరియు తేలికపాటి వ్యాయామం ఆరోగ్యానికి రక్ష.',
    arogyaRakshaEn:
      'Governing knees, joints, and bones, calcium-rich nutrition, warm oil massage, and regular joint mobility exercises keep the body strong.',

    vedicRemedyTe:
      'శనివారం శ్రీ వేంకటేశ్వర స్వామి లేదా ఆంజనేయ స్వామి ఆరాధన, నువ్వుల దీపం మరియు శివాభిషేకం సర్వశుభప్రదం.',
    vedicRemedyEn:
      'Worshipping Lord Venkateswara or Lord Hanuman on Saturdays and lighting a sesame lamp bring lasting peace and success.',
  },
  {
    id: 'kumbham',
    index: 11,
    rashiNameTe: 'కుంభ రాశి',
    rashiNameEn: 'Aquarius (Kumbha Rashi)',
    rashiLordTe: 'శని భగవానుడు (మందుడు)',
    rashiLordEn: 'Saturn (Shani)',
    tatvamTe: 'వాయు తత్వం • స్థిర రాశి',
    tatvamEn: 'Air Element • Fixed Sign',
    nakshatrasTe: 'ధనిష్ఠ (3, 4 పాదాలు), శతభిషం (4 పాదాలు), పూర్వాభాద్ర (1, 2, 3 పాదాలు)',
    nakshatrasEn: 'Dhanishtha (3–4), Shatabhisham (1–4), Purvabhadra (1–3)',
    kalapurushaAngamTe: 'పిక్కలు, చీలమండలు & రక్తప్రసరణ వ్యవస్థ',
    kalapurushaAngamEn: 'Calves, Ankles & Circulatory System',

    wifeProfileTe:
      'కుంభ రాశి ఇల్లాలు ఉదార హృదయం, సేవాభావం, ఆధునిక-సాంప్రదాయ విలువల సమన్వయం కలిగి ఉంటుంది. భర్తకు నిజమైన మిత్రురాలిగా, కష్టసుఖాలలో సమాన భాగస్వామిగా నిలుస్తుంది. బంధుమిత్రులకు సహాయం చేయడంలో, కుటుంబాన్ని వివేకంతో నడిపించడంలో ముందుంటుంది.',
    wifeProfileEn:
      'A Kumbha Rashi wife is compassionate, progressive yet rooted in values, and deeply loyal. She supports her spouse with intellectual companionship and humanitarian warmth.',

    husbandProfileTe:
      'కుంభ రాశి భర్త నిజాయితీ, పరిశోధనా బుద్ధి, మానవతా దృక్పథం మరియు స్థిరమైన అభిప్రాయాలు కలవాడు. ఆడంబరాలకు పోకుండా కుటుంబానికి శాశ్వతమైన సౌకర్యాలను సమకూరుస్తాడు. భార్య వ్యక్తిత్వాన్ని, స్వేచ్ఛను గౌరవిస్తాడు.',
    husbandProfileEn:
      'A Kumbha Rashi husband is principled, intellectually deep, and respectful of his wife’s individuality. He works steadily for family welfare and social good.',

    maritalHarmonySutraTe:
      'శని మూలత్రికోణ రాశి కావున దంపతులు ఆలోచనలలోనే ఉండిపోకుండా మనసులోని ప్రేమను తరచుగా వ్యక్తపరచాలి. శనివారం శివ-ఆంజనేయ ఆరాధన దాంపత్య బలాన్ని ఇస్తుంది.',
    maritalHarmonySutraEn:
      'Expressing affection openly and worshipping Lord Shiva and Lord Hanuman on Saturdays strengthens emotional closeness in marriage.',

    childNatureAndStudyTe:
      'కుంభ రాశి పిల్లలు వినూత్న ఆలోచనలు (Innovation), శాస్త్రీయ దృక్పథం మరియు అసాధారణ మేధస్సు కలిగి ఉంటారు. ఆర్టిఫిషియల్ ఇంటెలిజెన్స్, కంప్యూటర్ సైన్స్, స్పేస్/ఏరోస్పేస్, ఎలక్ట్రానిక్స్, వైద్య పరిశోధన రంగాలలో అద్భుత ప్రతిభ చూపుతారు.',
    childNatureAndStudyEn:
      'Kumbha children are inventive thinkers with scientific curiosity, excelling in computer science, AI, electronics, astronomy, and medical research.',

    parentingGuideTe:
      'వీరి వినూత్న ఆలోచనలను ప్రోత్సహిస్తూ, శాస్త్రీయ కారణాలతో మంచిచెడులు వివరిస్తే ఎంతో ఆనందంగా పాటిస్తారు. స్నేహపూర్వక మార్గదర్శనం వీరిని గొప్ప శాస్త్రవేత్తలుగా, నిపుణులుగా తీర్చిదిద్దుతుంది.',
    parentingGuideEn:
      'Explain rules with logical reasoning and encourage their original ideas; Kumbha children blossom under intelligent, respectful mentorship.',

    parentTemperamentTe:
      'కుంభ రాశి తల్లిదండ్రులు పిల్లలకు మానవతా విలువలు, స్వతంత్ర ఆలోచన మరియు సామాజిక బాధ్యతను నేర్పుతారు.',
    parentTemperamentEn:
      'Kumbha parents raise broad-minded, ethical, and intellectually independent children.',

    careerLifeWorkTe:
      'సాఫ్ట్‌వేర్ & టెక్నాలజీ, ఇంజనీరింగ్, శాస్త్రీయ పరిశోధన, వైద్యం, విద్యా రంగం, ప్రభుత్వ సర్వీసులు, ఏవియేషన్ మరియు సామాజిక సేవా సంస్థలలో వీరు విశేషంగా రాణిస్తారు.',
    careerLifeWorkEn:
      'Kumbha natives thrive in software engineering, scientific research, medicine, aviation, academia, and public administration.',

    businessPartnershipTe:
      'నూతన టెక్నాలజీ, కన్సల్టెన్సీ మరియు పరిశ్రమల స్థాపనలో వీరి ఆలోచనలు అమోఘం. చురుకైన మార్కెటింగ్ భాగస్వామితో కలిస్తే వ్యాపారం గొప్ప విజయాన్ని అందుకుంటుంది.',
    businessPartnershipEn:
      'Visionary innovators in business, Kumbha natives build enduring tech and industrial ventures when paired with dynamic commercial partners.',

    wealthAttractionTe:
      'సాంకేతిక నైపుణ్యం, మేధో సంపత్తి, భూమి మరియు దీర్ఘకాలిక పెట్టుబడుల ద్వారా వీరికి స్థిరమైన ధనయోగం కలుగుతుంది.',
    wealthAttractionEn:
      'Wealth flows through technology, specialized expertise, real estate, and patient long-term equity holdings.',

    bestPartnerRashisTe: 'మిథునం, తుల, మేషం మరియు ధనుస్సు రాశులు',
    bestPartnerRashisEn: 'Gemini (Mithunam), Libra (Tula), Aries (Mesham) & Sagittarius (Dhanussu)',

    chandraManasikaTatvamTe:
      'కుంభ రాశిలో చంద్రుడు ఉన్నవారు నిస్వార్థ సేవాభావం, తాత్విక చింతన, స్థిరమైన మైత్రి మరియు లోతైన పరిశీలనా జ్ఞానం కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Aquarius bestows humanitarian empathy, philosophical depth, loyal friendship, and objective wisdom.',

    arogyaRakshaTe:
      'రక్తప్రసరణ, పిక్కలు, చీలమండలు మరియు నాడీ వ్యవస్థపై శ్రద్ధ వహించాలి. తగినంత నడక, ప్రాణాయామం మరియు వేళకు నిద్రపోవడం వల్ల ఆరోగ్యం బాగుంటుంది.',
    arogyaRakshaEn:
      'Governing circulation and ankles, regular walking, pranayama, and consistent sleep cycles keep vitality high.',

    vedicRemedyTe:
      'శనివారం నవగ్రహ ప్రదక్షిణ, ఆంజనేయ స్వామి ఆరాధన మరియు సోమవారం రుద్రాభిషేకం సకల ఆటంకాలను తొలగిస్తాయి.',
    vedicRemedyEn:
      'Saturday Hanuman worship, Navagraha Pradakshina, and Monday Rudrabhishekam remove obstacles and bring prosperity.',
  },
  {
    id: 'meenam',
    index: 12,
    rashiNameTe: 'మీన రాశి',
    rashiNameEn: 'Pisces (Meena Rashi)',
    rashiLordTe: 'దేవగురు బృహస్పతి (గురుడు)',
    rashiLordEn: 'Jupiter (Guru)',
    tatvamTe: 'జల తత్వం • ద్విస్వభావ రాశి',
    tatvamEn: 'Water Element • Dual Sign',
    nakshatrasTe: 'పూర్వాభాద్ర (4వ పాదం), ఉత్తరాభాద్ర (4 పాదాలు), రేవతి (4 పాదాలు)',
    nakshatrasEn: 'Purvabhadra (4), Uttarabhadra (1–4), Revati (1–4)',
    kalapurushaAngamTe: 'పాదాలు, శోషరస (లింఫాటిక్) వ్యవస్థ & ఆధ్యాత్మిక చైతన్యం',
    kalapurushaAngamEn: 'Feet, Lymphatic System & Spiritual Consciousness',

    wifeProfileTe:
      'మీన రాశి ఇల్లాలు సాత్విక గుణం, కరుణ, క్షమాగుణం మరియు అపారమైన దైవభక్తి కలిగిన ఉత్తమ ఇల్లాలు. శుక్రుడు ఉచ్చ స్థితి పొందే రాశి కావున ఈమె అడుగుపెట్టిన ఇల్లు ప్రేమతో, ధనధాన్యాలతో కళకళలాడుతుంది. భర్త పట్ల అంకితభావం, పెద్దల పట్ల భక్తి కలిగి ఉంటుంది.',
    wifeProfileEn:
      'Where Venus is exalted, a Meena Rashi wife radiates unconditional love, spiritual grace, and artistic sensitivity. Her presence brings peace, devotion, and post-marital prosperity to the home.',

    husbandProfileTe:
      'మీన రాశి భర్త సహృదయుడు, ధర్మమార్గంలో నడిచేవాడు మరియు కుటుంబాన్ని ఆప్యాయంగా ఆదరించే స్వభావం కలవాడు. ఇతరుల కష్టాలను తనవిగా భావించి సహాయం చేస్తాడు. భార్యాపిల్లల ఆనందమే తన ఆనందంగా భావిస్తాడు.',
    husbandProfileEn:
      'A Meena Rashi husband is gentle, wise, and deeply devoted to his family. He leads with empathy, spiritual integrity, and generous care for his spouse and children.',

    maritalHarmonySutraTe:
      'గురు స్వక్షేత్రం మరియు శుక్ర ఉచ్చ క్షేత్రం కావున దాంపత్యం సుఖమయంగా ఉంటుంది. ఆర్థిక విషయాలలో ఆచరణాత్మక ప్రణాళిక పాటించడం, గురువారం దక్షిణామూర్తి ఆరాధన చేయడం ఉత్తమం.',
    maritalHarmonySutraEn:
      'Blessed by Jupiter and exalted Venus, combining emotional warmth with practical financial planning and Thursday Guru worship ensures marital bliss.',

    childNatureAndStudyTe:
      'మీన రాశి పిల్లలు అద్భుతమైన జ్ఞాపకశక్తి, సృజనాత్మకత, వినయం మరియు పెద్దల పట్ల గౌరవం కలిగి ఉంటారు. వైద్యం, విద్యా బోధన, సాఫ్ట్‌వేర్, సంగీతం, సాహిత్యం మరియు పరిశోధనా రంగాలలో సులభంగా రాణిస్తారు.',
    childNatureAndStudyEn:
      'Meena children are intuitive, respectful, and imaginatively gifted, excelling in medicine, education, software, literature, and creative arts.',

    parentingGuideTe:
      'ఈ పిల్లలు అత్యంత సున్నిత మనస్కులు. వీరికి భయం కలిగించే వాతావరణం లేకుండా ప్రేమతో ప్రోత్సహిస్తూ, ఆత్మవిశ్వాసం మరియు సమయపాలన నేర్పిస్తే ఉన్నత శిఖరాలను అందుకుంటారు.',
    parentingGuideEn:
      'Nurture Meena children with gentle encouragement and structured habits; warm emotional support turns their natural intuition into academic brilliance.',

    parentTemperamentTe:
      'మీన రాశి తల్లిదండ్రులు పిల్లలను అమితమైన వాత్సల్యంతో, ఆధ్యాత్మిక విలువలతో పెంచుతారు.',
    parentTemperamentEn:
      'Meena parents are deeply affectionate and instill compassion, devotion, and wisdom in their children.',

    careerLifeWorkTe:
      'వైద్య రంగం, విద్యా సంస్థలు/ప్రొఫెసర్లు, బ్యాంకింగ్, ఫైనాన్స్, సాఫ్ట్‌వేర్, విదేశీ వాణిజ్యం, సముద్ర యానం, కౌన్సెలింగ్ మరియు ధార్మిక/ఆధ్యాత్మిక రంగాలలో గొప్ప విజయాన్ని, గౌరవాన్ని పొందుతారు.',
    careerLifeWorkEn:
      'Meena natives thrive in medicine, higher education, finance, software, international trade, counseling, and spiritual institutions.',

    businessPartnershipTe:
      'నిజాయితీ మరియు విశ్వాసానికి మారుపేరైన వీరు వ్యాపార భాగస్వామ్యంలో శుభప్రదులు. ఆచరణాత్మక లౌకిక చాకచక్యం గల భాగస్వామితో కలిస్తే వ్యాపారం నిరంతరం వృద్ధి చెందుతుంది.',
    businessPartnershipEn:
      'Ethical and trustworthy in business, Meena natives prosper greatly when paired with an operationally sharp partner.',

    wealthAttractionTe:
      'శుక్ర ఉచ్చ బలం మరియు గురు అనుగ్రహం వల్ల వీరికి జీవితంలో ధనధాన్యాలకు లోటు ఉండదు. విద్యా, వైద్య, విదేశీ మరియు భూ పెట్టుబడుల ద్వారా సంపద వృద్ధి చెందుతుంది.',
    wealthAttractionEn:
      'Supported by Jupiter and exalted Venus, Meena natives attract steady wealth through knowledge professions, real estate, and ethical investments.',

    bestPartnerRashisTe: 'కర్కాటకం, వృశ్చికం, వృషభం, కన్య మరియు మకర రాశులు',
    bestPartnerRashisEn: 'Cancer (Karkatakam), Scorpio (Vruschikam), Taurus (Vrushabham), Virgo (Kanya) & Capricorn (Makaram)',

    chandraManasikaTatvamTe:
      'మీన రాశిలో చంద్రుడు ఉన్నవారు శాంత స్వభావం, దైవభక్తి, లోతైన అంతర్దృష్టి మరియు సమస్త జీవుల పట్ల కరుణ కలిగి ఉంటారు.',
    chandraManasikaTatvamEn:
      'Moon in Pisces bestows serene spirituality, empathy, artistic intuition, and a forgiving heart.',

    arogyaRakshaTe:
      'పాదాలు, కఫ తత్వం మరియు రోగనిరోధక శక్తిపై శ్రద్ధ వహించాలి. తగినంత విశ్రాంతి, గోరువెచ్చని ఆహారం మరియు ధ్యానం/ప్రాణాయామం ఆరోగ్యాన్ని కాపాడతాయి.',
    arogyaRakshaEn:
      'Governing the feet and lymphatic system, warm nutrition, restful sleep, and daily meditation preserve vibrant health.',

    vedicRemedyTe:
      'గురువారం శ్రీ దక్షిణామూర్తి ఆరాధన, శివ-పార్వతుల రుద్రాభిషేకం మరియు విష్ణు సహస్రనామ పారాయణ సర్వశుభప్రదం.',
    vedicRemedyEn:
      'Thursday Guru Dakshinamurthy worship, Rudrabhishekam, and chanting Vishnu Sahasranama bestow peace, health, and abundance.',
  },
];

export const LUNAR_AND_SHANI_MENTAL_GUIDES: LunarAndShaniMentalGuide[] = [
  {
    id: 'lunar-tides-moods',
    titleTe: 'చంద్ర కళలు (పౌర్ణమి – అమావాస్య) & మనస్సుపై ప్రభావం — శాస్త్రీయ విశ్లేషణ',
    titleEn: 'Lunar Tides (Purnima – Amavasya) & Their Influence on the Mind',
    subtitleTe: '“చంద్రమా మనసో జాతః” — వేద జ్యోతిష్య మనోవిజ్ఞాన రహస్యం',
    subtitleEn: 'Vedic Astro-Psychology of Moon Phases & Chandrashtamam',
    shastraPrincipleTe:
      'వేద పురుష సూక్తం “చంద్రమా మనసో జాతః” అని బోధిస్తోంది — అనగా మనస్సుకు అధిపతి చంద్రుడు. సముద్రపు నీటిపై చంద్రుని గురుత్వాకర్షణ శక్తి వల్ల పౌర్ణమి, అమావాస్యలలో అలలు ఎలా ఉవ్వెత్తున ఎగిసిపడతాయో, 70% జల తత్వంతో కూడిన మానవ శరీరంలోని నాడీ వ్యవస్థ మరియు మనస్సుపై కూడా శుక్ల-కృష్ణ పక్ష తిథులు అంతే ప్రభావాన్ని చూపుతాయి. శుక్ల పక్షంలో (పాడ్యమి నుండి పౌర్ణమి వరకు) చంద్ర కళలు వృద్ధి చెందే కొద్దీ ఉత్సాహం, ఆత్మవిశ్వాసం పెరుగుతాయి. బహుళ (కృష్ణ) పక్షం చివరి తిథులలో (త్రయోదశి, చతుర్దశి, అమావాస్య) మరియు చంద్రుడు జన్మ రాశికి 8వ ఇంట సంచరించే “చంద్రాష్టమం” (2.25 రోజుల) కాలంలో కారణం లేకుండానే మానసిక అలసట, ఆందోళన లేదా నిరుత్సాహం కలగడం సహజం.',
    shastraPrincipleEn:
      'According to the Vedic Purusha Suktam (“Chandrama Manaso Jatah”), the Moon governs the human mind and fluids. Just as lunar gravity creates ocean tides during Purnima and Amavasya, the waxing and waning Moon directly influences human neurotransmitters and emotional equilibrium. During Waxing Moon (Shukla Paksha), vitality rises; during late Waning Moon (Amavasya) or the 2.25-day Chandrashtamam (Moon transiting 8th from birth sign), temporary mental fatigue or worry can arise naturally.',
    practicalGuidanceTe: [
      'చంద్రాష్టమం లేదా అమావాస్య రోజులలో కారణం లేకుండా మనస్సు కలత చెందితే అది కేవలం 2 రోజుల తాత్కాలిక గ్రహ సంచార ప్రభావమేనని గ్రహించి నిశ్చింతగా ఉండాలి.',
      'ఆ రెండు రోజులలో కీలక వాదనలు, పెద్ద ఆర్థిక ఒప్పందాలు వాయిదా వేసుకుని ప్రశాంతంగా నిత్య విధులు నిర్వర్తించాలి.',
      'రాత్రి వేళ తగినంత నిద్ర, స్వచ్ఛమైన మంచినీరు మరియు సాత్విక ఆహారం తీసుకోవడం వల్ల చంద్ర బలం స్థిరంగా ఉంటుంది.',
    ],
    practicalGuidanceEn: [
      'Recognize that unexplained low moods during Amavasya or Chandrashtamam are temporary 48-hour lunar tides that pass quickly.',
      'Postpone heated arguments or impulsive financial decisions during your 2.25-day Chandrashtamam window.',
      'Prioritize restful sleep, hydration, and calm breathing to stabilize lunar energy.',
    ],
    remedyTe:
      'సోమవారం శివాభిషేకం, “ఓం నమః శివాయ” పంచాక్షరీ జపం మరియు పౌర్ణమి నాడు చంద్ర దర్శనం మనోబలాన్ని ప్రసాదిస్తాయి.',
    remedyEn:
      'Monday Rudrabhishekam, chanting “Om Namah Shivaya”, and peaceful meditation during Purnima restore supreme mental clarity.',
  },
  {
    id: 'shani-transit-resilience',
    titleTe: 'శని భగవానుని 30 ఏళ్ల కాలచక్రం & ఏలినాటి శని మనోధైర్య మార్గదర్శి',
    titleEn: 'Saturn’s 30-Year Cycle & Overcoming Worry During Elinati Shani (Sade Sati)',
    subtitleTe: 'శని భగవానుడు భయపెట్టే గ్రహం కాదు — కర్మశుద్ధితో రాజయోగం ఇచ్చే న్యాయమూర్తి',
    subtitleEn: 'Why Saturn Transits Test Patience & How They Forge Lasting Success',
    shastraPrincipleTe:
      'నవగ్రహాలలో శని భగవానుడు ఒక్కో రాశిలో 2.5 సంవత్సరాలు సంచరిస్తూ మొత్తం 12 రాశులను చుట్టి రావడానికి సుమారు 29.5 నుండి 30 సంవత్సరాలు పడుతుంది. జన్మ రాశికి 12, 1, 2 స్థానాలలో శని సంచరించే కాలాన్ని “ఏలినాటి శని” అని, 4వ ఇంట “అర్ధాష్టమ శని” అని, 8వ ఇంట “అష్టమ శని” అని అంటారు. ఈ కాలంలో పనులలో కొంత ఆలస్యం, శారీరక అలసట లేదా భవిష్యత్తుపై ఆందోళన కలగవచ్చు. కానీ శాస్త్ర రహస్యం ఏమిటంటే — బంగారాన్ని అగ్నిలో పుటం పెడితేనే ఆభరణంగా మారినట్లు, శని భగవానుడు మనిషికి ఓర్పు, క్రమశిక్షణ, పొదుపు మరియు నిజాయితీని నేర్పి, ఆ దశ ముగిసేలోపు స్థిరమైన గృహ, ఉద్యోగ, ఆర్థిక విజయాలను ప్రసాదిస్తాడు.',
    shastraPrincipleEn:
      'Saturn takes approximately 29.5 to 30 years to complete one full zodiacal orbit, spending 2.5 years in each sign. When Saturn transits the 12th, 1st, or 2nd house from the birth Moon (Elinati Shani / Sade Sati) or the 8th house (Ashtama Shani), tasks may require extra effort and mental resilience. In Vedic astrology, Saturn is the supreme teacher of discipline (Dharma-Raja)—refining character like gold in fire and rewarding patient, ethical effort with enduring property, career authority, and wisdom.',
    practicalGuidanceTe: [
      'ఏలినాటి శని లేదా జన్మ శని నడుస్తున్నప్పుడు భయపడటం మానివేసి, ప్రతి పనిని క్రమశిక్షణతో, నిజాయితీగా పూర్తి చేయాలి.',
      'నిరాశ ఆవహించినప్పుడు ఏకాంతంగా కూర్చుని బాధపడకుండా, శారీరక వ్యాయామం, దైవ దర్శనం మరియు పెద్దల సాంగత్యం అలవరచుకోవాలి.',
      'శని భగవానునికి సేవాభావం అంటే అత్యంత ప్రీతి; పేదలకు, వృద్ధులకు, వికలాంగులకు చేతనైన సహాయం చేస్తే శని దోషం తక్షణమే శుభయోగంగా మారుతుంది.',
    ],
    practicalGuidanceEn: [
      'Replace fear of Saturn transits with structured daily discipline, patience, and ethical perseverance.',
      'Counteract heavy moods with morning sunlight, physical activity, and constructive service rather than isolation.',
      'Charitable service to the elderly, workers, and the needy transforms Saturn’s test into a lifelong blessing.',
    ],
    remedyTe:
      'శనివారం ఆంజనేయ స్వామి లేదా వేంకటేశ్వర స్వామి దర్శనం, తిల తైలాభిషేకం మరియు కార్తీక మాస ఏకవార రుద్రాభిషేకం శని గ్రహ అనుగ్రహాన్ని ప్రసాదిస్తాయి.',
    remedyEn:
      'Saturday worship of Lord Hanuman or Lord Venkateswara, lighting a sesame oil lamp, and performing Rudrabhishekam invoke Saturn’s auspicious grace.',
  },
];

export function getRashiEncyclopediaByIdOrIndex(
  keyOrIndex: string | number
): RashiVedicEncyclopediaEntry {
  if (typeof keyOrIndex === 'number') {
    const idx = ((keyOrIndex % 12) + 12) % 12;
    return DWADASA_RASHI_VEDIC_ENCYCLOPEDIA[idx] || DWADASA_RASHI_VEDIC_ENCYCLOPEDIA[0];
  }
  const clean = String(keyOrIndex).toLowerCase().trim();
  const aliasMap: Record<string, string> = {
    aries: 'mesham',
    mesha: 'mesham',
    mesham: 'mesham',
    taurus: 'vrushabham',
    vrishabha: 'vrushabham',
    vrushabham: 'vrushabham',
    gemini: 'mithunam',
    mithuna: 'mithunam',
    mithunam: 'mithunam',
    cancer: 'karkatakam',
    karkataka: 'karkatakam',
    karkatakam: 'karkatakam',
    leo: 'simham',
    simha: 'simham',
    simham: 'simham',
    virgo: 'kanya',
    kanya: 'kanya',
    libra: 'tula',
    tula: 'tula',
    scorpio: 'vruschikam',
    vruschika: 'vruschikam',
    vruschikam: 'vruschikam',
    sagittarius: 'dhanussu',
    dhanu: 'dhanussu',
    dhanussu: 'dhanussu',
    capricorn: 'makaram',
    makara: 'makaram',
    makaram: 'makaram',
    aquarius: 'kumbham',
    kumbha: 'kumbham',
    kumbham: 'kumbham',
    pisces: 'meenam',
    meena: 'meenam',
    meenam: 'meenam',
  };
  const targetId = aliasMap[clean] || clean;
  return (
    DWADASA_RASHI_VEDIC_ENCYCLOPEDIA.find((r) => r.id === targetId) ||
    DWADASA_RASHI_VEDIC_ENCYCLOPEDIA[0]
  );
}
