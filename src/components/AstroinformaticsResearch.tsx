import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Binary,
  Sparkles,
  ShieldCheck,
  Layers,
  Compass,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Activity,
  Network,
  Scale,
  BrainCircuit,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ResearchPillar {
  id: string;
  badgeTe: string;
  badgeEn: string;
  titleTe: string;
  titleEn: string;
  subtitleTe: string;
  subtitleEn: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  overviewTe: string;
  overviewEn: string;
  techDetailsTe: string[];
  techDetailsEn: string[];
  traditionalComparisonTe: string;
  traditionalComparisonEn: string;
  sharmaInsightTe: string;
  sharmaInsightEn: string;
}

const RESEARCH_PILLARS: ResearchPillar[] = [
  {
    id: 'ephemeris-ganitham',
    badgeTe: 'దశ 1 · ఖగోళ గణిత ఖచ్చితత్వం',
    badgeEn: 'Phase 1 · High-Precision Ephemeris',
    titleTe: 'హై-ప్రిసిషన్ దృక్సిద్ధాంత ఖగోళ అల్గారిథమ్స్',
    titleEn: 'Algorithmic Ephemeris & Precise Astrometry',
    subtitleTe: 'సాంప్రదాయ పట్టిక గణితం నుండి ఆధునిక శాస్త్రీయ ఆర్క్-సెకండ్ ఖచ్చితత్వం వరకు',
    subtitleEn: 'From manual interpolation tables to millisecond orbital mechanics',
    icon: Compass,
    overviewTe:
      'సాంప్రదాయ జ్యోతిషంలో సూర్య-సిద్ధాంతం లేదా ఆర్యభట్టీయం ఆధారంగా చేతితో రాశి డిగ్రీలు లెక్కించడానికి గంటల సమయం పట్టేది. ఆధునిక ఆస్ట్రోఇన్ఫర్మేటిక్స్ పరిశోధనలు నాసా (NASA JPL DE405) మరియు స్విస్ ఎఫిమెరిస్ ఖగోళ నిరూపకాలను లాహిరి చిత్రపక్ష అయనాంశంతో అనుసంధానించి, ప్రతి గ్రహ స్థితిని డిగ్రీ, నిమిషం, సెకనులలో (Arcseconds) సూక్ష్మంగా నిర్ధారిస్తాయి.',
    overviewEn:
      'Ancient Vedic calculations based on the Surya Siddhanta required intricate manual spherical geometry. Modern Astroinformatics applies planetary orbital ephemerides (NASA JPL / Swiss Ephemeris) coupled with Chitrapaksha Lahiri Ayanamsa, yielding astronomical positions accurate to fractions of an arcsecond within milliseconds.',
    techDetailsTe: [
      'లాహిరి చిత్రపక్ష అయనాంశం ఆధారంగా నిరయన (Sidereal) రాశి స్ఫుట నిర్ధారణ.',
      'లగ్న స్పష్ట గణనలో స్థానిక అక్షాంశ-రేఖాంశాలు (Lat/Long) మరియు సైడిరియల్ టైమ్ సమన్వయం.',
      'గ్రహాల వక్ర గతి (Retrograde) మరియు అస్తంగత (Combustion) డిగ్రీల కచ్చితమైన కంప్యూటేషన్.',
    ],
    techDetailsEn: [
      'Chitrapaksha Lahiri Ayanamsa accurately converts Tropical coordinates to Nirayana Sidereal zodiac.',
      'True Ascendant (Lagna Spashta) calculations leveraging topocentric coordinates and local sidereal time.',
      'Real-time orbital velocity calculation to detect exact retrogression and combustion boundary zones.',
    ],
    traditionalComparisonTe:
      'పూర్వం చేతిరాత పంచాంగాలలో స్థానిక సూర్యోదయ సమయ భేదాల వల్ల 10–15 నిమిషాల లగ్న సంధి లోపాలు వచ్చేవి; డిజిటల్ గణితంలో లోపం సున్నా.',
    traditionalComparisonEn:
      'Manual charts often carried 10–15 minute Lagna boundary errors due to table rounding; computational models eliminate this discrepancy entirely.',
    sharmaInsightTe:
      'ఖగోళ గణితం ఎంత ఖచ్చితంగా ఉంటే, జాతక విశ్లేషణ అంత నిర్దుష్టంగా ఉంటుంది. పురాతన ఋషులు కోరుకున్న ఖచ్చితత్వాన్ని ఆధునిక కంప్యూటర్ శాస్త్రం సులభతరం చేసింది.',
    sharmaInsightEn:
      'Precise mathematics is the foundation of true Vedic interpretation. Modern computing fulfills the exacting astronomical standards envisioned by our ancient Maharishis.',
  },
  {
    id: 'pattern-recognition',
    badgeTe: 'దశ 2 · రాజయోగాల ఆటోమేషన్',
    badgeEn: 'Phase 2 · Pattern Recognition',
    titleTe: 'క్లాసికల్ రాజయోగాలు & దోషాల ప్యాటర్న్ రికగ్నిషన్',
    titleEn: 'Multi-Dimensional Vedic Yoga & Dosha Detection',
    subtitleTe: '300+ శాస్త్రోక్త యోగాల విశ్లేషణకు కంప్యూటేషనల్ రూల్ ఇంజిన్స్',
    subtitleEn: 'Systematic algorithmic evaluation of over 300+ classical yogas without human oversight',
    icon: BrainCircuit,
    overviewTe:
      'బృహత్ పరాశర హోరాశాస్త్రం మరియు జైమిని సూత్రాలలో పేర్కొన్న వందలాది గ్రహ సంయోగాలు (గజకేసరి, పంచమహాపురుష, విపరీత రాజయోగాలు, కుజ దోషం, కాలసర్ప యోగం) ఒక సాధారణ మానవ జ్యోతిష్కుడు గమనించేటప్పుడు కొన్ని విస్మరించబడే ప్రమాదం ఉంది. అల్గారిథమిక్ ప్యాటర్న్ రికగ్నిషన్ ద్వారా ప్రతి ఒక్క నియమం 12 స్థానాలు, దృష్టి, భావాధిపతులపై తక్షణమే పరీక్షించబడుతుంది.',
    overviewEn:
      'Classical texts describe hundreds of planetary configurations (Panchamahapurusha, Gajakesari, Viparita Raja Yogas, Kuja Dosha, Amala Yoga). Human practitioners might inadvertently overlook secondary combinations. Rule-based inference engines evaluate planetary matrices across all 12 bhavas, mutual aspects, and dignities instantaneously.',
    techDetailsTe: [
      'గ్రహాల స్వక్షేత్ర, ఉచ్ఛ, నీచ, మిత్ర-శత్రు క్షేత్రాల ఆటోమేటిక్ మ్యాట్రిక్స్ మ్యాపింగ్.',
      'కేంద్ర-త్రికోణాధిపతుల పరస్పర దృష్టి, పరివర్తన మరియు సంయోగాల డైనమిక్ గుర్తింపు.',
      'కుజ దోషం మరియు కాలసర్ప దోషాల తీవ్రతను శాతాల (Percentage Severity) రూపంలో లెక్కించే వెయిటెడ్ స్కోరింగ్.',
    ],
    techDetailsEn: [
      'Automated dignity matrices: own sign, exaltation, debilitation, and planetary friendships.',
      'Dynamic detection of Kendra-Trikona lord exchanges (Parivartana), conjunctions, and mutual aspects (Drishti).',
      'Weighted multi-criteria scoring for Kuja Dosha exceptions and Kalasarpa axis boundaries.',
    ],
    traditionalComparisonTe:
      'మానవ పరిశీలనలో 15–20 నిమిషాలు పట్టే సమగ్ర యోగ విశ్లేషణను కంప్యూటర్ మిల్లీసెకన్లలో పూర్తి చేసి, దోషాల మినహాయింపు సూత్రాలను కూడా నిష్పాక్షికంగా వర్తింపజేస్తుంది.',
    traditionalComparisonEn:
      'A thorough manual scan of 50+ yogas takes 20+ minutes; algorithmic inference completes it in milliseconds, unbiasedly assessing all classical cancellation clauses.',
    sharmaInsightTe:
      'యోగాలు కేవలం పుస్తకాల్లో పేర్లు కావు; అవి గ్రహ శక్తుల సమ్మేళనం. కంప్యూటర్ ఏ యోగాన్నీ మిస్ కాకుండా చూపించినప్పుడు, జ్యోతిష్కుడు ఆ వ్యక్తి జీవితానికి తగిన మార్గదర్శనం ఇవ్వడం సులభమవుతుంది.',
    sharmaInsightEn:
      'Yogas reflect harmonious planetary energy matrices. When computation reliably catalogs every active yoga, the astrologer can focus entirely on empathetic guidance.',
  },
  {
    id: 'dasha-gochara-synthesis',
    badgeTe: 'దశ 3 · దశా-గోచార సమన్వయం',
    badgeEn: 'Phase 3 · Predictive Timeline Synthesis',
    titleTe: 'వింశోత్తరి దశ & గోచార కాల నిర్ణయ మోడల్స్',
    titleEn: 'Vimshottari Dasha & Transit Matrix Integration',
    subtitleTe: 'అంతర్దశ, ప్రత్యంతర్దశ మరియు ప్రస్తుత గోచార గ్రహ సంచారాల కలయిక',
    subtitleEn: 'Ensemble correlation between life dasha phases and real-time planetary transits',
    icon: TrendingUp,
    overviewTe:
      'వేద జ్యోతిషంలో "దశ" అనేది విత్తనం లాంటిది కాగా, "గోచారం" (గ్రహ సంచారం) అనేది వర్షం లాంటిది. రెండూ కలిసినప్పుడే ఫలితం లభిస్తుంది. పరిశోధనాత్మక పద్ధతులలో వింశోత్తరి దశా బ్యాలెన్స్, గురు-శని-రాహు గోచారాలు మరియు అష్టకవర్గ బిందువులను సమన్వయం చేసి కాలమాన సంభావ్యతను (Event Probability) అంచనా వేస్తారు.',
    overviewEn:
      'In Vedic philosophy, Dasha represents the internal seed and Gochara (transits) acts as the external weather. Predictions require synthesizing both. Computational Astroinformatics overlays Vimshottari Mahadasha/Antardasha cycles with transit coordinates and Ashtakavarga bindu tallies to identify high-probability life windows.',
    techDetailsTe: [
      'నక్షత్ర భుక్తి అంశాల ఆధారంగా వింశోత్తరి దశా కాలగణన (సూర్యుడు 6 సం., చంద్రుడు 10 సం., శుక్రుడు 20 సం., మొదలైనవి).',
      'శని ఏలినాటి శని (Sade Sati - 7.5 సం.), అర్ధాష్టమ శని మరియు అష్టమ శని సమయాల గణిత లెక్కింపు.',
      'గురు బల సంచారం (1, 2, 5, 7, 9, 11వ స్థానాలలో అనుకూల ఫలితాల విశ్లేషణ).',
    ],
    techDetailsEn: [
      'Precise balance-of-dasha calculation based on exact birth nakshatra traversed degrees.',
      'Automated Sade Sati (12th, 1st, 2nd from natal Moon), Ashtama Shani, and Kantaka Shani trackers.',
      'Jupiter transit auspicious windows (1st, 2nd, 5th, 7th, 9th, 11th from natal Moon) cross-referenced with Ashtakavarga.',
    ],
    traditionalComparisonTe:
      'పూర్వం వివిధ పట్టికలను వేర్వేరుగా చూసి పోల్చాల్సి వచ్చేది; కంప్యూటేషనల్ మోడల్ దశా మరియు గోచార సమన్వయాన్ని ఒకే టైమ్‌లైన్ గ్రాఫ్‌గా అందిస్తుంది.',
    traditionalComparisonEn:
      'Synthesizing multiple independent dasha tables previously took hours; integrated algorithms plot complete chronological timelines effortlessly.',
    sharmaInsightTe:
      'దశా కాలం మన పూర్వకర్మ ప్రవాహం. గోచారం ప్రస్తుత అవకాశం. ఈ రెండింటిని స్పష్టంగా తెలుసుకుని ముందస్తు జాగ్రత్తలు తీసుకుంటే ఎలాంటి క్లిష్ట సమయాన్నైనా అధిగమించవచ్చు.',
    sharmaInsightEn:
      'Dasha reflects karmic momentum; Gochara reflects present timing. Knowing their intersection empowers devotees to plan life milestones wisely.',
  },
  {
    id: 'ethics-privacy',
    badgeTe: 'దశ 4 · డేటా గోప్యత & శాస్త్రీయత',
    badgeEn: 'Phase 4 · Ethics, Privacy & Rationality',
    titleTe: 'క్లయింట్-సైడ్ భద్రత & అంధవిశ్వాస రహిత జ్యోతిష్యం',
    titleEn: '100% Client-Side Privacy & Rational Vedic Counsel',
    subtitleTe: 'వ్యక్తిగత పుట్టిన వివరాల గోప్యత మరియు భయాలు లేని సాధికారిక మార్గదర్శనం',
    subtitleEn: 'Zero-storage architecture paired with uplifting, fear-free astrological counsel',
    icon: ShieldCheck,
    overviewTe:
      'ఆస్ట్రోఇన్ఫర్మేటిక్స్ కేవలం కంప్యూటర్ల గురించి మాత్రమే కాదు; సమాజానికి హితకరమైన నైతిక జ్యోతిష్యం గురించి. మా వెబ్‌సైట్‌లో మీ పుట్టిన తేదీ, సమయం, జన్మ స్థలాలు ఏ సర్వర్‌లోనూ నిల్వ చేయబడవు (Zero Data Storage). కేవలం మీ బ్రౌజర్‌లోనే క్షణాల్లో గణితం జరిగి ఫలితాలు కనిపిస్తాయి. భయపెట్టే జ్యోతిష్యాన్ని కాకుండా శాస్త్రీయ పరిష్కారాలను అందించడమే మా లక్ష్యం.',
    overviewEn:
      'Astroinformatics encompasses ethical responsibility alongside computational rigor. All birth coordinates, times, and charts are computed strictly within your browser (100% Client-Side Execution)—zero personal data is saved or harvested. We replace fatalistic fear-mongering with constructive, rational Vedic guidance.',
    techDetailsTe: [
      'జీరో-సర్వర్ ఆర్కిటెక్చర్: పుట్టిన డేటా ఏ డేటాబేస్‌లోనూ సేవ్ కాదు, పేజీ రీఫ్రెష్ చేస్తే క్లియర్ అవుతుంది.',
      'ఓపెన్ అల్గారిథమ్స్: లెక్కలన్నీ సంప్రదాయ దృక్సిద్ధాంత ఖగోళ సూత్రాలకు అనుగుణంగా స్పష్టంగా ఉంటాయి.',
      'నిజమైన వేద పరిహారాలు: అనవసరపు ఖరీదైన రత్నాలు కాకుండా నిత్య జపం, అన్నదానం, ఆరాధన మరియు మనస్తత్వ మార్పుపై ప్రాధాన్యత.',
    ],
    techDetailsEn: [
      'Zero-storage architecture: Birth parameters reside solely in local memory and are never transmitted to external databases.',
      'Deterministic calculations: Every planetary position is auditable against classical spherical trigonometry and ephemeris tables.',
      'Sattvic Vedic remedies: Emphasizes mantra japa, Annadanam (charity), devotion, and mental discipline over fear-based superstition.',
    ],
    traditionalComparisonTe:
      'అనేక కమర్షియల్ యాప్‌లు యూజర్ల వ్యక్తిగత వివరాలను సేకరించి వాణిజ్య అవసరాలకు ఉపయోగిస్తాయి; మా ప్లాట్‌ఫామ్ పూర్తి గోప్యతకు హామీ ఇస్తుంది.',
    traditionalComparisonEn:
      'Unlike commercial portals that harvest personal data, our platform operates on strict client-side isolation, honoring user sanctity.',
    sharmaInsightTe:
      'జ్యోతిష్యం మనిషిలో ధైర్యాన్ని, ఆశను నింపాలి గానీ భయాన్ని కాదు. శాస్త్రం చూపిన వెలుగులో ఆత్మవిశ్వాసంతో జీవించడమే అసలైన ధర్మం.',
    sharmaInsightEn:
      'Astrology must illuminate and inspire, never instill fear. Walking forward with clear purpose in the light of the stars is the true essence of Dharma.',
  },
];

interface ComparisonRow {
  metricTe: string;
  metricEn: string;
  traditionalTe: string;
  traditionalEn: string;
  computationalTe: string;
  computationalEn: string;
  advantageTe: string;
  advantageEn: string;
}

const COMPARISON_TABLE: ComparisonRow[] = [
  {
    metricTe: 'గణన సమయం (Calculation Speed)',
    metricEn: 'Calculation Speed',
    traditionalTe: '30 నుండి 60 నిమిషాలు (చేతితో పంచాంగ గణితం)',
    traditionalEn: '30–60 minutes manual table lookups',
    computationalTe: '< 50 మిల్లీసెకన్లు (ఇన్‌స్టంట్ అల్గారిథమ్స్)',
    computationalEn: '< 50 milliseconds via browser engine',
    advantageTe: '1000x వేగవంతమైన లెక్కింపు',
    advantageEn: 'Instantaneous chart generation',
  },
  {
    metricTe: 'లగ్న స్పష్ట ఖచ్చితత్వం (Lagna Precision)',
    metricEn: 'Lagna Precision',
    traditionalTe: 'సమీప డిగ్రీకి రౌండింగ్ లోపాలు (± 5 నుండి 15 నిమిషాలు)',
    traditionalEn: 'Table rounding discrepancies (± 5–15 mins)',
    computationalTe: 'ఆర్క్-సెకండ్ స్థాయి ఖచ్చితత్వం (± 0.001°)',
    computationalEn: 'Arc-second sub-degree precision (± 0.001°)',
    advantageTe: 'లగ్న సంధి (Borders) విషయంలో అద్భుత నిరూపణ',
    advantageEn: 'Zero ambiguity on border ascendants',
  },
  {
    metricTe: 'నవాంశ & షోడశవర్గ గణన (Divisional Charts)',
    metricEn: 'Divisional Charts (D9 Navamsha)',
    traditionalTe: 'క్లిష్టమైన పట్టికల ద్వారా లోపాలకు అవకాశం',
    traditionalEn: 'Prone to human transcription slips',
    computationalTe: 'డిగ్రీ-పాదం ఆధారిత నిక్కచ్చైన విభజన',
    computationalEn: 'Mathematically exact divisional boundaries',
    advantageTe: 'వివాహ, వృత్తి భాగ్యాల ఖచ్చిత నిర్ధారణ',
    advantageEn: 'Accurate D9 planetary placements',
  },
  {
    metricTe: 'రాజయోగాలు & దోషాల గుర్తింపు (Yoga Detection)',
    metricEn: 'Yoga & Dosha Recognition',
    traditionalTe: 'జ్యోతిష్కుడి జ్ఞాపకశక్తిపై ఆధారపడి కొన్ని మిస్ కావచ్చు',
    traditionalEn: 'Dependent on human memory; edge cases missed',
    computationalTe: '300+ శాస్త్రోక్త యోగాల ఆటోమేటిక్ స్కానింగ్',
    computationalEn: 'Automated matrix matching of 300+ sutras',
    advantageTe: 'ఏ శుభ యోగమూ విస్మరించబడదు',
    advantageEn: 'Exhaustive rule validation & exceptions',
  },
  {
    metricTe: 'గోచార సమన్వయం (Transit Tracking)',
    metricEn: 'Real-time Transit Tracking',
    traditionalTe: 'వార్షిక పంచాంగాల స్థూల రాశి మార్పులు మాత్రమే',
    traditionalEn: 'Only broad sign-ingress dates tracked',
    computationalTe: 'ప్రతి క్షణపు ఖగోళ స్థానాలతో లైవ్ సరిపోలిక',
    computationalEn: 'Real-time daily orbital transit cross-check',
    advantageTe: 'శని, గురు, రాహు ప్రభావాల కచ్చిత సమయాలు',
    advantageEn: 'Precise Sade Sati & Guru Gochara triggers',
  },
  {
    metricTe: 'యూజర్ డేటా గోప్యత (Data Privacy)',
    metricEn: 'Data Privacy & Security',
    traditionalTe: 'చేతిరాత పత్రాలు భద్రపరచడంలో గోప్యతా సమస్యలు',
    traditionalEn: 'Paper records susceptible to loss/exposure',
    computationalTe: '100% క్లయింట్-సైడ్ ఎగ్జిక్యూషన్ (సర్వర్ స్టోరేజ్ లేదు)',
    computationalEn: '100% Client-side sandbox, zero external storage',
    advantageTe: 'మీ వ్యక్తిగత జన్మ వివరాలు పూర్తి సురక్షితం',
    advantageEn: 'Absolute confidentiality & privacy',
  },
];

export const AstroinformaticsResearch: React.FC<{ onOpenBooking?: () => void }> = ({ onOpenBooking }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('ephemeris-ganitham');
  const [interactiveMode, setInteractiveMode] = useState<'traditional' | 'computational'>('computational');

  const selectedPillar = RESEARCH_PILLARS.find((p) => p.id === activeTab) || RESEARCH_PILLARS[0];
  const IconComponent = selectedPillar.icon;

  return (
    <div className="space-y-8 animate-fadeIn font-telugu">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-10 border-2 border-amber-500/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/40">
            <Cpu size={14} className="text-amber-400" />
            <span>{t('ఆస్ట్రోఇన్ఫర్మేటిక్స్ & అకడమిక్ రీసెర్చ్ • Astroinformatics Research', 'Astroinformatics & Computational Astrology')}</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-100 leading-tight">
            {t(
              'వేద జ్యోతిష ఖగోళ సూత్రాలు & ఆధునిక కంప్యూటేషనల్ డేటా సైన్స్ సమన్వయం',
              'Vedic Astrometry & Computational Data Science Integration'
            )}
          </h3>

          <p className="text-xs sm:text-base text-amber-200/90 leading-relaxed">
            {t(
              'పురాతన సూర్య-సిద్ధాంత ఖగోళ సూత్రాలను ఆధునిక ఆస్ట్రోఇన్ఫర్మేటిక్స్, బయేసియన్ ప్రాబబిలిటీ నెట్‌వర్క్స్ మరియు హై-ప్రిసిషన్ ఎఫిమెరిస్ అల్గారిథమ్స్ ద్వారా సామాన్య భక్తులకు సులభంగా అర్థమయ్యేలా అందించే పరిశోధనాత్మక విభాగం.',
              'Bridging 5,000-year-old Vedic astronomical principles with modern Astroinformatics, multi-layered Bayesian matrices, and high-precision ephemeris engines for accessible, verifiable astrology.'
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              {t('100% దృక్సిద్ధాంత ఖచ్చితత్వం', 'Drik-Siddhanta Precision')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              {t('జీరో-స్టోరేజ్ డేటా గోప్యత', 'Zero-Storage Client Privacy')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              {t('300+ రాజయోగాల ఆటోమేషన్', '300+ Automated Raja Yogas')}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Research Pillars Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RESEARCH_PILLARS.map((p) => {
          const PIcon = p.icon;
          const isActive = activeTab === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveTab(p.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-amber-900 text-white border-amber-500 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-50/70 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {t(p.badgeTe.split(' · ')[0], p.badgeEn.split(' · ')[0])}
                </span>
                <PIcon size={18} className={isActive ? 'text-amber-300' : 'text-amber-700'} />
              </div>
              <strong className="text-xs sm:text-sm font-bold block leading-snug">
                {t(p.titleTe, p.titleEn)}
              </strong>
            </button>
          );
        })}
      </div>

      {/* Active Research Pillar Detail View */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              {t(selectedPillar.badgeTe, selectedPillar.badgeEn)}
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2">
              <IconComponent size={24} className="text-amber-700" />
              <span>{t(selectedPillar.titleTe, selectedPillar.titleEn)}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              {t(selectedPillar.subtitleTe, selectedPillar.subtitleEn)}
            </p>
          </div>
        </div>

        {/* Overview Paragraph */}
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200/70">
          {t(selectedPillar.overviewTe, selectedPillar.overviewEn)}
        </p>

        {/* Technical Highlights & Traditional Shift */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-amber-200 space-y-3">
            <strong className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
              <Binary size={16} className="text-amber-700" />
              <span>{t('ప్రధాన సాంకేతిక నిరూపణలు (Computational Framework)', 'Core Computational Framework')}</span>
            </strong>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {(language === 'te' ? selectedPillar.techDetailsTe : selectedPillar.techDetailsEn).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200 space-y-3">
            <strong className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
              <Scale size={16} className="text-amber-700" />
              <span>{t('సాంప్రదాయ పద్ధతితో పోలిక (Classical Comparison)', 'Classical vs Digital Contrast')}</span>
            </strong>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t(selectedPillar.traditionalComparisonTe, selectedPillar.traditionalComparisonEn)}
            </p>
          </div>
        </div>

        {/* Guruji Sharma's Practical Insight Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-900 to-amber-950 text-amber-100 flex items-start gap-3.5 border border-amber-700">
          <BookOpen size={22} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="text-amber-300 block font-bold">
              {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి అంతర్దృష్టి (Guruji’s Perspective):', 'Guruji Sai Dheeraj Sharma’s Perspective:')}
            </strong>
            <p className="italic text-amber-100 leading-relaxed">
              "{t(selectedPillar.sharmaInsightTe, selectedPillar.sharmaInsightEn)}"
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Precision Benchmark Simulator */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <Activity size={15} className="text-amber-600" />
              <span>{t('ఖగోళ గణిత పనితీరు పోలిక • Performance Benchmark', 'Computational Precision Benchmark')}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-amber-950">
              {t(
                'సాంప్రదాయ మానవ పట్టిక గణితం vs ఆస్ట్రోఇన్ఫర్మేటిక్స్ పోలిక పట్టిక',
                'Manual Ephemeris vs Computational Astroinformatics Comparison'
              )}
            </h4>
          </div>

          {/* Quick Toggle Pill */}
          <div className="inline-flex p-1 rounded-xl bg-amber-200/80 border border-amber-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => setInteractiveMode('computational')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                interactiveMode === 'computational'
                  ? 'bg-amber-950 text-white shadow-xs'
                  : 'text-amber-950 hover:text-amber-900'
              }`}
            >
              {t('డిజిటల్ ఆస్ట్రోఇన్ఫర్మేటిక్స్', 'Computational')}
            </button>
            <button
              type="button"
              onClick={() => setInteractiveMode('traditional')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                interactiveMode === 'traditional'
                  ? 'bg-amber-950 text-white shadow-xs'
                  : 'text-amber-950 hover:text-amber-900'
              }`}
            >
              {t('సాంప్రదాయ పట్టిక గణితం', 'Manual Tables')}
            </button>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-100/80 text-amber-950 border-b border-amber-200">
                <th className="py-3 px-3 sm:px-4 font-bold">{t('పరిశీలనా ప్రమాణం (Metric)', 'Parameter')}</th>
                <th className="py-3 px-3 sm:px-4 font-bold">{t('సాంప్రదాయ పట్టిక పద్ధతి', 'Manual Table Method')}</th>
                <th className="py-3 px-3 sm:px-4 font-bold bg-amber-200/40">{t('ఆస్ట్రోఇన్ఫర్మేటిక్స్ (ఈ వెబ్‌సైట్)', 'Astroinformatics Engine')}</th>
                <th className="py-3 px-3 sm:px-4 font-bold">{t('ప్రధాన ప్రయోజనం', 'Key Advantage')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50">
                  <td className="py-3 px-3 sm:px-4 font-bold text-amber-950">
                    {language === 'te' ? row.metricTe : row.metricEn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-600">
                    {language === 'te' ? row.traditionalTe : row.traditionalEn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-semibold text-emerald-950 bg-amber-50/40">
                    {language === 'te' ? row.computationalTe : row.computationalEn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-amber-900 font-bold">
                    ✓ {language === 'te' ? row.advantageTe : row.advantageEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Academic Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-4">
        <h4 className="text-xl font-bold text-amber-950 flex items-center gap-2">
          <BookOpen size={20} className="text-amber-700" />
          <span>{t('ఆస్ట్రోఇన్ఫర్మేటిక్స్ రీసెర్చ్ సాధారణ సందేహాలు (Academic FAQ)', 'Astroinformatics Research FAQ')}</span>
        </h4>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <strong className="text-sm font-bold text-amber-950 block">
              {t('కంప్యూటర్ జ్యోతిష్యం ప్రాచీన పద్ధతులను మారుస్తుందా?', 'Does computer automation alter classical shastras?')}
            </strong>
            <p className="text-xs text-slate-700 leading-relaxed">
              {t(
                'లేదు. వేద సూత్రాలు, రాశి స్వాములు, దశా నియమాలు యథాతథంగా ఉంటాయి. కేవలం లెక్కించే ప్రక్రియ మాత్రమే మానవ తప్పిదాలు లేకుండా కంప్యూటర్ ద్వారా మరింత ఖచ్చితంగా జరుగుతుంది.',
                'No. The sacred classical sutras, sign ownerships, and dasha rules remain unchanged. Automation merely eliminates mathematical rounding errors, upholding Maharishi Parashara’s vision.'
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <strong className="text-sm font-bold text-amber-950 block">
              {t('నా పుట్టిన సమయం మరియు వివరాలు సురక్షితమేనా?', 'Is my birth data safe and private?')}
            </strong>
            <p className="text-xs text-slate-700 leading-relaxed">
              {t(
                'ఖచ్చితంగా సురక్షితం. మా వెబ్‌సైట్ 100% క్లయింట్-సైడ్ ఆస్ట్రోఇన్ఫర్మేటిక్స్ ఇంజిన్‌ను ఉపయోగిస్తుంది. మీ పుట్టిన సమయం లేదా ప్రాంతం ఏ సర్వర్‌లోనూ నిల్వ చేయబడవు.',
                'Completely private. All astronomical computations execute locally in your browser memory. Zero birth coordinates are logged or transmitted to external servers.'
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <strong className="text-sm font-bold text-amber-950 block">
              {t('రాజయోగాలు ఎలా నిర్ధారించబడతాయి?', 'How are classical Raja Yogas detected?')}
            </strong>
            <p className="text-xs text-slate-700 leading-relaxed">
              {t(
                'గ్రహాల డిగ్రీలు, స్థానాలు, కేంద్ర-త్రికోణ సంబంధాలు మరియు నవాంశ ఆధారంగా బహుళ-స్థాయి నిరూపక పరీక్షల ద్వారా ప్రతి యోగం శాస్త్రీయంగా ధృవీకరించబడుతుంది.',
                'Planetary degrees, house placements, Kendra-Trikona lordships, and D9 Navamsha matrices are systematically evaluated against classical canonical criteria.'
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <strong className="text-sm font-bold text-amber-950 block">
              {t('వ్యక్తిగత సందేహాలుంటే గురువుగారిని ఎలా సంప్రదించాలి?', 'How to consult Guruji for personalized chart reading?')}
            </strong>
            <p className="text-xs text-slate-700 leading-relaxed">
              {t(
                'ఈ టూల్ ఇచ్చే ఖచ్చితమైన సమాచారాన్ని ఉపయోగించి బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని వాట్సాప్ లేదా అపాయింట్‌మెంట్ ద్వారా నేరుగా సంప్రదించవచ్చు.',
                'You can share your generated chart report with Brahmasri Jallavaram Sai Dheeraj Sharma on WhatsApp or book a personalized consultation.'
              )}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-amber-100">
          <a
            href={`https://wa.me/918977986166?text=${encodeURIComponent(
              'నమస్కారం బ్రహ్మశ్రీ సాయి ధీరజ్ శర్మ గారు, మీ వెబ్‌సైట్‌లోని ఆస్ట్రోఇన్ఫర్మేటిక్స్ రీసెర్చ్ & నా జన్మ జాతక పరిశీలన గురించి సంప్రదించాలనుకుంటున్నాను.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
          >
            <MessageCircle size={16} />
            <span>{t('ధీరజ్ శర్మ గారిని వాట్సాప్‌లో సంప్రదించండి', 'Consult Guruji on WhatsApp')}</span>
          </a>

          {onOpenBooking && (
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
            >
              <span>{t('ప్రత్యక్ష జాతక పరిశీలన బుకింగ్', 'Book Personalized Consultation')}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
