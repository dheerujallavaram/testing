import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  BookOpen,
  Search,
  Filter,
  ShieldAlert,
  ChevronRight,
  Flame,
  Droplets,
  Wind,
  Layers,
  ChevronDown,
  Sun,
  Moon,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  MUHURTHA_ACTIVITIES,
  MARRIAGE_EKAVIMSATI_DOSHAS,
  SHIVA_MUHURTHA_SYSTEM,
  PANCHA_BHOOTA_TATWAS,
  MuhurthaActivityRule,
  MuhurthaCategory,
  evaluateActivityMuhurtha,
} from '../utils/muhurthamEngine';
import { NAKSHATRAS, WEEK_DATA } from '../data/panchangamData';
import { useLanguage } from '../context/LanguageContext';
import { OmEmblem } from './OmEmblem';

const CATEGORY_TABS: { id: MuhurthaCategory | 'all'; labelTe: string; labelEn: string; icon: string }[] = [
  { id: 'all', labelTe: 'అన్ని ముహూర్తాలు (All)', labelEn: 'All Muhurthams', icon: '✨' },
  { id: 'marriage', labelTe: 'వివాహం & దాంపత్యం', labelEn: 'Marriage & Conjugal', icon: '💍' },
  { id: 'samskara', labelTe: 'షోడశ సంస్కారాలు', labelEn: 'Vedic Samskaras', icon: '🪔' },
  { id: 'construction', labelTe: 'గృహ & వాస్తు', labelEn: 'House & Vastu', icon: '🏠' },
  { id: 'business', labelTe: 'వ్యాపార & వాణిజ్యం', labelEn: 'Business & Trade', icon: '🏢' },
  { id: 'finance', labelTe: 'ధన & రుణాలు', labelEn: 'Finance & Wealth', icon: '💰' },
  { id: 'education', labelTe: 'విద్యా & జ్ఞానం', labelEn: 'Education & Learning', icon: '📚' },
  { id: 'career', labelTe: 'ఉద్యోగ & వృత్తి', labelEn: 'Career & Duty', icon: '💼' },
  { id: 'travel', labelTe: 'ప్రయాణ & వాహనం', labelEn: 'Travel & Vehicles', icon: '🚗' },
  { id: 'health', labelTe: 'ఆరోగ్యం & చికిత్స', labelEn: 'Health & Surgery', icon: '🌿' },
  { id: 'micro_systems', labelTe: 'సూక్ష్మ ముహూర్త విధానాలు', labelEn: 'Special Micro Systems', icon: '⏳' },
];

const SEO_FAQS = [
  {
    qTe: 'శుభ ముహూర్తం ఎలా చూసుకోవాలి? (How to choose good muhurtham?)',
    qEn: 'How to calculate and select an auspicious Muhurtham?',
    aTe: 'శుభ ముహూర్తాన్ని నిర్ణయించడానికి పంచాంగ శుద్ధి (తిథి, వారం, నక్షత్రం, యోగం, కరణం) తో పాటు, కర్త యొక్క జన్మ నక్షత్రానికి తారాబలము మరియు చంద్రబలము సరిచూడాలి. ముఖ్యంగా రాహుకాలం, యమగండం, వర్జ్యం (విష ఘడియలు), దుర్ముహూర్తం లేని శుభ లగ్నాన్ని ఎన్నుకోవాలి. వివాహానికైతే ఏకవింశతి (21) మహా దోషాలు నివారించవలెను.',
    aEn: 'To select an auspicious Muhurtham, verify Panchanga Shuddhi (Tithi, Vara, Nakshatra, Yoga, Karana) along with the individual’s Tara Balam and Chandra Balam. Discard inauspicious windows such as Rahu Kalam, Yamagandam, Varjyam, and Durmuhurtham. For marriage, ensure clearance of the 21 major classical doshas.',
  },
  {
    qTe: 'వివాహానికి ఏ ముహూర్తం మంచిది? (When is good muhurtham for marriage?)',
    qEn: 'When is the best Muhurtham for marriage in Telugu Vedic Astrology?',
    aTe: 'శుక్లపక్షంలో రోహిణి, మృగశిర, మఘ, ఉత్తర, హస్త, స్వాతి, అనూరాధ, ఉత్తరాషాఢ, ఉత్తరాభాద్ర, రేవతి నక్షత్రాలలో, వృషభ, మిథున, కన్య, తుల, ధనుస్సు, కుంభ లగ్నాలు అత్యంత శ్రేష్టం. లగ్నానికి 7వ స్థానం పూర్తిగా శూన్యంగా ఉండాలి, 8వ ఇంట కుజుడు ఉండరాదు.',
    aEn: 'Marriage is ideal during Shukla Paksha under stars like Rohini, Mrigashira, Magha, Uttara, Hasta, Swati, Anuradha, and Revati. The 7th house from wedding ascendant must be vacant, and Mars must avoid the 8th house.',
  },
  {
    qTe: 'గృహ ప్రవేశానికి ఎప్పుడు ముహూర్తం పెట్టాలి? (When is good muhurtham for house warming?)',
    qEn: 'When should Housewarming (Gruha Pravesham) be performed?',
    aTe: 'మాఘ, ఫాల్గుణ, వైశాఖ, జ్యేష్ఠ మాసాలలో ఉత్తరాయణ పుణ్యకాలంలో స్థిర లగ్నమైన వృషభం, సింహం, లేదా కుంభ లగ్నంలో రోహిణి, మృగశిర, ఉత్తర, హస్త, చిత్త, అనూరాధ నక్షత్రాలలో గృహ ప్రవేశం చేయడం సర్వ సంపత్కరమని వశిష్ఠ సంహిత వివరిస్తోంది.',
    aEn: 'Gruha Pravesham is supreme during Uttarayana in the months of Magha, Phalguna, Vaisakha, and Jyeshtha during fixed signs (Taurus, Leo, Aquarius) under auspicious constellations.',
  },
  {
    qTe: 'బంగారం కొనుగోలు చేయడానికి ఏ రోజు శ్రేష్టం? (When is good muhurtham for gold purchase?)',
    qEn: 'Which is the most auspicious day to buy gold and jewellery?',
    aTe: 'గురువారం లేదా శుక్రవారం నాడు పుష్యమి నక్షత్రం (గురు పుష్య యోగం), రోహిణి, హస్త, శ్రవణం నక్షత్రాలలో గురు హోర లేదా శుక్ర హోర సమయంలో బంగారం కొంటే ఆ సంపద అక్షయమై రోజురోజుకూ వృద్ధి చెందుతుంది.',
    aEn: 'Purchasing gold on Thursday or Friday under Pushyami (Guru Pushya Yoga), Rohini, Hasta, or Shravana during Jupiter or Venus Hora guarantees continuous multiplication of wealth.',
  },
  {
    qTe: 'అప్పు ఎప్పుడు తీసుకోవాలి? ఏ రోజు అస్సలు తీసుకోకూడదు? (Which day not to take a loan?)',
    qEn: 'When should one take or avoid loans in Vedic astrology?',
    aTe: 'హస్త నక్షత్రం ఉన్న రోజున, అలాగే మంగళవారం మరియు ఆదివారాలలో అస్సలు రుణం తీసుకోరాదు. అలా తీసుకుంటే అప్పుల ఊబిలో చిక్కుకుంటారు. రుణం త్వరగా తీరిపోవాలంటే చర లగ్నంలో (కర్కాటకం, తుల) తీసుకోవాలి. అప్పు తీర్చడానికి మంగళవారం నాడు భరణి నక్షత్రం అత్యుత్తమమైనది.',
    aEn: 'Never borrow on Hasta nakshatra, Sunday, or Tuesday. To quickly discharge loans, borrow in a movable ascendant. To permanently extinguish debts, make repayment on Tuesday under Bharani nakshatra.',
  },
  {
    qTe: 'అభిజిత్ ముహూర్తం అంటే ఏమిటి? ఎందుకు అంత పవిత్రమైనది? (What is Abhijit Muhurtham?)',
    qEn: 'What is Abhijit Muhurtha and why is it considered all-fault destroying?',
    aTe: 'మధ్యాహ్న సూర్యుని 8వ ముహూర్తాన్ని "అభిజిత్ ముహూర్తం" అంటారు. ఇది సూర్యోదయం, సూర్యాస్తమయాల మధ్య బిందువుకు అటు 24 నిమిషాలు, ఇటు 24 నిమిషాలు ఉంటుంది. బుధవారం మినహా మిగిలిన అన్ని రోజుల్లో అభిజిత్ ముహూర్తంలో ప్రారంభించే ఏ శుభకార్యానికైనా సమస్త గ్రహ దోషాలను హరించే దివ్య శక్తి ఉంటుంది.',
    aEn: 'Abhijit is the 8th solar muhurtha occurring at solar noon (24 minutes before and after). Except on Wednesdays, it possesses the supreme power to annihilate astronomical flaws and grant success.',
  },
];

export const MuhurthamCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<MuhurthaCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('vivaham');
  const [selectedJanmaNakshatra, setSelectedJanmaNakshatra] = useState<number>(0);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'articles' | 'doshas' | 'microsystems'>('calculator');

  // Filter activities
  const filteredActivities = useMemo(() => {
    return MUHURTHA_ACTIVITIES.filter((act) => {
      const catMatch = selectedCategory === 'all' || act.category === selectedCategory;
      if (!catMatch) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        act.nameTe.toLowerCase().includes(query) ||
        act.nameEn.toLowerCase().includes(query) ||
        act.categoryNameTe.toLowerCase().includes(query) ||
        act.taglineTe.toLowerCase().includes(query) ||
        act.seoKeywords.some((kw) => kw.toLowerCase().includes(query))
      );
    });
  }, [selectedCategory, searchQuery]);

  const activeActivity = useMemo(() => {
    return (
      MUHURTHA_ACTIVITIES.find((a) => a.id === selectedActivityId) || MUHURTHA_ACTIVITIES[0]
    );
  }, [selectedActivityId]);

  // Derive today's current Panchanga factors for live evaluation
  const todayPanchanga = WEEK_DATA[0];
  const cleanTithi = todayPanchanga.panchanga.tithi.split('-')[0].trim();
  const cleanNakshatra = todayPanchanga.panchanga.nakshatram.split('-')[0].trim();
  const dayName = todayPanchanga.label;

  const evaluationResult = useMemo(() => {
    return evaluateActivityMuhurtha(
      activeActivity,
      {
        tithiName: cleanTithi,
        varaName: dayName,
        nakshatraName: cleanNakshatra,
        isRahuKalamNow: false,
        isYamagandamNow: false,
        isDurmuhurthamNow: false,
        isVarjyamNow: false,
      },
      selectedJanmaNakshatra,
      3 // Example Day Nakshatra Index (Rohini/Mrigashira)
    );
  }, [activeActivity, cleanTithi, dayName, cleanNakshatra, selectedJanmaNakshatra]);

  return (
    <div className="w-full bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-amber-100/40 text-slate-800 py-8 px-3 sm:px-6 lg:px-8">
      {/* Top Hero & SEO Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-amber-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-400/30">
                <Sparkles size={14} className="text-amber-400" />
                వేద మహర్షుల ప్రమాణ సంహిత • Vedic Classical Muhurtha Finder
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-amber-100 tracking-tight">
                శుభ ముహూర్తం నిర్ధారణ యంత్రం
              </h1>
              <p className="text-amber-200/90 text-sm sm:text-base max-w-3xl leading-relaxed">
                వశిష్ఠ, పరాశర, భృగు, గర్గ మహర్షుల శాస్త్ర ప్రమాణాలతో వివాహం, గృహ ప్రవేశం, వ్యాపారం, విద్య,
                ఆభరణాలు, రుణాలు మరియు సమస్త శుభకార్యాల ఆదర్శ ముహూర్త నిర్ణయ విశ్లేషణ.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start text-xs text-amber-300/80">
                <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">✓ పంచాంగ శుద్ధి</span>
                <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">✓ తారాబల & చంద్రబలము</span>
                <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">✓ ఏకవింశతి దోష రహితం</span>
                <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">✓ అభిజిత్ & శివ ముహూర్తం</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-amber-950/50 rounded-2xl border border-amber-500/30 text-center min-w-[200px]">
              <OmEmblem className="w-16 h-16 text-amber-400 mb-2 drop-shadow" />
              <span className="text-xs text-amber-300 font-medium">సర్వతోముఖ శుభ సాధనం</span>
              <span className="text-[11px] text-amber-400/80">శ్రీ గురు పరంపర ప్రాశస్త్యం</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sub Navigation Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/90 backdrop-blur rounded-2xl border border-amber-200/80 shadow-sm">
          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'calculator'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Compass size={16} />
            ముహూర్త నిర్ధారణ (Finder)
          </button>
          <button
            onClick={() => setActiveSubTab('articles')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'articles'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <BookOpen size={16} />
            శాస్త్ర ప్రమాణ వ్యాసాలు (Guides)
          </button>
          <button
            onClick={() => setActiveSubTab('doshas')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'doshas'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <ShieldAlert size={16} />
            21 వివాహ మహా దోషాలు & పరిహారాలు
          </button>
          <button
            onClick={() => setActiveSubTab('microsystems')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'microsystems'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Clock size={16} />
            శివ & తత్త్వ సూక్ష్మ కాలాలు
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search & Category Chips */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="వెతకండి (ఉదా: వివాహం, కారు, బంగారం, రుణం, ఇల్లు, how to...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
                <Filter size={14} />
                <span>మొత్తం శుభ కార్యాలు: <strong className="text-amber-800">{filteredActivities.length}</strong></span>
              </div>
            </div>

            {/* Category horizontal scrolling bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    selectedCategory === cat.id
                      ? 'bg-amber-800 text-white border-amber-800 shadow'
                      : 'bg-amber-50/70 text-slate-700 border-amber-200/60 hover:bg-amber-100/50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.labelTe}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredActivities.map((act) => {
              const isSelected = act.id === selectedActivityId;
              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivityId(act.id)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg border-amber-600 scale-[1.02]'
                      : 'bg-white hover:bg-amber-50/60 text-slate-800 border-amber-200/70 shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5">
                    <span
                      className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full inline-block ${
                        isSelected ? 'bg-amber-900/40 text-amber-200' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {act.categoryNameTe}
                    </span>
                    <h3 className={`text-base font-bold font-serif line-clamp-1 ${isSelected ? 'text-white' : 'text-amber-950'}`}>
                      {act.nameTe}
                    </h3>
                    <p className={`text-xs line-clamp-2 ${isSelected ? 'text-amber-100/90' : 'text-slate-600'}`}>
                      {act.taglineTe}
                    </p>
                  </div>
                  <div className={`mt-3 pt-2 text-[11px] flex items-center justify-between border-t ${
                    isSelected ? 'border-amber-400/40 text-amber-200' : 'border-amber-100 text-amber-700'
                  }`}>
                    <span className="font-medium">నియమావళి & శ్లోక సూత్రం</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Activity Dashboard */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-amber-300/80 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-6">
              <div>
                <span className="text-xs font-bold text-amber-700 tracking-wide uppercase bg-amber-100 px-3 py-1 rounded-full">
                  {activeActivity.categoryNameTe}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-2">
                  {activeActivity.nameTe}
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  {activeActivity.taglineTe}
                </p>
              </div>

              {/* Devotee Janma Nakshatra Selector for Custom Tara Balam */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex flex-col gap-1.5 min-w-[240px]">
                <label className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-600" />
                  మీ జన్మ నక్షత్రం (తారాబల పరిశీలన):
                </label>
                <select
                  value={selectedJanmaNakshatra}
                  onChange={(e) => setSelectedJanmaNakshatra(Number(e.target.value))}
                  className="w-full text-xs bg-white border border-amber-300 rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {NAKSHATRAS.map((nak, idx) => (
                    <option key={nak.index} value={idx}>
                      {nak.index}. {nak.telugu} ({nak.lord})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Real-time Suitability Evaluation Card */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 p-5 rounded-2xl border border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-white shadow ${
                  evaluationResult.score >= 75
                    ? 'bg-emerald-600'
                    : evaluationResult.score >= 50
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}>
                  <span className="text-lg leading-none">{evaluationResult.score}%</span>
                  <span className="text-[10px] uppercase tracking-wider mt-0.5">అనుకూలత</span>
                </div>
                <div>
                  <div className="text-xs text-amber-800 font-semibold">నేటి ఖగోళ ముహూర్త ఫలితం:</div>
                  <div className="text-lg font-bold text-slate-900">{evaluationResult.grade}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    తిథి: {cleanTithi} • వారం: {dayName} • నక్షత్రం: {cleanNakshatra}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-amber-200/80 w-full md:w-auto">
                {evaluationResult.reasonsTe.map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
                {evaluationResult.doshasDetectedTe.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-rose-700 font-medium">
                    <AlertTriangle size={13} className="shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Classical Shastra Pramana Sutram Section */}
            <div className="bg-amber-950 text-amber-100 rounded-2xl p-6 border border-amber-600/40 relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen size={16} />
                మహర్షి ప్రణీత శాస్త్ర ప్రమాణ సూత్రం • {activeActivity.shastraSource}
              </div>
              <blockquote className="font-serif text-base sm:text-lg text-amber-200 italic my-2 pl-4 border-l-2 border-amber-400">
                {activeActivity.shastraPramanaSutram}
              </blockquote>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mt-3 bg-amber-900/60 p-3 rounded-xl border border-amber-800">
                <strong>శాస్త్రార్థ తాత్పర్యం:</strong> {activeActivity.sutraMeaningTe}
              </p>
            </div>

            {/* In-depth 4 Pillars Grid (Tithis, Varas, Nakshatras, Lagnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tithis */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar size={14} className="text-amber-700" />
                  అనుకూల తిథులు
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activeActivity.favorableTithis.map((t, i) => (
                    <span key={i} className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      ✓ {t}
                    </span>
                  ))}
                </div>
                {activeActivity.unfavorableTithis.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="text-[10px] text-rose-700 font-semibold block mb-1">వర్జ్య తిథులు:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeActivity.unfavorableTithis.map((t, i) => (
                        <span key={i} className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                          ✗ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Varas */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sun size={14} className="text-amber-700" />
                  అనుకూల వారాలు
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activeActivity.favorableVaras.map((v, i) => (
                    <span key={i} className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      ✓ {v}
                    </span>
                  ))}
                </div>
                {activeActivity.unfavorableVaras.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="text-[10px] text-rose-700 font-semibold block mb-1">వర్జ్య వారాలు:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeActivity.unfavorableVaras.map((v, i) => (
                        <span key={i} className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                          ✗ {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nakshatras */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles size={14} className="text-amber-700" />
                  అనుకూల నక్షత్రాలు
                </h4>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {activeActivity.favorableNakshatras.map((n, i) => (
                    <span key={i} className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      ✓ {n}
                    </span>
                  ))}
                </div>
                {activeActivity.unfavorableNakshatras.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="text-[10px] text-rose-700 font-semibold block mb-1">వర్జ్య నక్షత్రాలు:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeActivity.unfavorableNakshatras.map((n, i) => (
                        <span key={i} className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                          ✗ {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lagnas */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Compass size={14} className="text-amber-700" />
                  శుభ లగ్నాలు
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activeActivity.favorableLagnas.map((l, i) => (
                    <span key={i} className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                      ✓ {l}
                    </span>
                  ))}
                </div>
                {activeActivity.avoidableLagnas.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="text-[10px] text-rose-700 font-semibold block mb-1">వర్జ్య లగ్నాలు:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeActivity.avoidableLagnas.map((l, i) => (
                        <span key={i} className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                          ✗ {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* How to choose & When to perform Action Guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-amber-200">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  ఈ ముహూర్తం ఎలా ఎన్నుకోవాలి? (How to choose):
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {activeActivity.howToChooseTe.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/60">
                      <span className="font-bold text-amber-800 shrink-0">{i + 1}.</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock size={16} className="text-amber-600" />
                  ఎప్పుడు ఆచరించాలి? (When to perform):
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {activeActivity.whenToPerformTe.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 bg-orange-50/40 p-2.5 rounded-xl border border-orange-200/60">
                      <span className="font-bold text-orange-800 shrink-0">❖</span>
                      <span>{point}</span>
                    </li>
                  ))}
                  {activeActivity.exemptionsPariharaluTe.map((point, i) => (
                    <li key={`p-${i}`} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="font-bold text-emerald-800 shrink-0">పరిహారం:</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SHASTRA PRAMANA ARTICLES (SEO FRIENDLY) */}
      {activeSubTab === 'articles' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-200 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              శాస్త్ర ప్రమాణ ముహూర్త విజ్ఞాన సర్వస్వం
            </h2>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              ప్రాచీన మహర్షులు బోధించిన ఖగోళ సూత్రాలు, సమయ శక్తులు మరియు జీవితంలోని ప్రతి ముఖ్య కార్యానికి
              ముహూర్త నిర్ణయ పద్ధతులు సమగ్రంగా వివరించబడ్డాయి.
            </p>
          </div>

          <div className="space-y-6">
            {MUHURTHA_ACTIVITIES.map((act) => (
              <article
                key={act.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/80 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
                      {act.categoryNameTe}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                      {act.nameTe}
                    </h3>
                  </div>
                  <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    ప్రమాణం: {act.shastraSource}
                  </span>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 text-xs sm:text-sm text-slate-800 space-y-2">
                  <div className="font-serif italic text-amber-950 font-semibold">
                    {act.shastraPramanaSutram}
                  </div>
                  <div className="text-slate-700">
                    <strong>తాత్పర్యం:</strong> {act.sutraMeaningTe}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      ఎలా చూసుకోవాలి? (Selection Rules):
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {act.howToChooseTe.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <AlertTriangle size={14} className="text-rose-600" />
                      వర్జ్య దోషాలు & పరిహారాలు (Doshas & Remedies):
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {act.prohibitedFactorsTe.map((p, i) => (
                        <li key={i} className="text-rose-700">{p}</li>
                      ))}
                      {act.exemptionsPariharaluTe.map((ex, i) => (
                        <li key={`e-${i}`} className="text-emerald-700 font-medium">పరిహారం: {ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: 21 MARRIAGE DOSHAS & EXEMPTIONS */}
      {activeSubTab === 'doshas' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-rose-500/30 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider border border-rose-500/30">
              ఏకవింశతి దోష విచారణ • 21 Classical Marriage Doshas
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-rose-100">
              వివాహ ఏకవింశతి మహా దోషాలు & శాస్త్రీయ పరిహారాలు
            </h2>
            <p className="text-rose-200/90 text-sm max-w-3xl leading-relaxed">
              వశిష్ఠ సంహిత, పరాశర హోరా శాస్త్రం మరియు ముహూర్త చింతామణి నిర్దేశించిన 21 వివాహ లగ్న దోషాలు.
              లగ్నంలో గురు-శుక్రుల శుభ దృష్టి లేదా కేంద్ర బలం ఉన్నప్పుడు లభించే పరిహార సూత్రాలు.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARRIAGE_EKAVIMSATI_DOSHAS.map((dosha) => (
              <div
                key={dosha.number}
                className="bg-white rounded-2xl p-5 shadow-sm border border-amber-200/80 hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold font-serif">
                      {dosha.number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      dosha.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {dosha.severity === 'critical' ? 'మహా దోషం' : 'దోషం'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-serif text-slate-900">
                    {dosha.nameTe}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dosha.descriptionTe}
                  </p>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block text-[11px] text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    శాస్త్రీయ పరిహారం (Remedy):
                  </span>
                  <p className="text-[11px] leading-relaxed">{dosha.pariharaTe}</p>
                  <span className="text-[9px] text-emerald-700 block text-right italic font-serif">
                    — {dosha.shastraPramanam}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: SHIVA MUHURTHA & PANCHA BHOOTA TATWAS */}
      {activeSubTab === 'microsystems' && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Shiva Muhurtha (45-min cycle) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
                45 నిమిషాల శివ చక్ర కాలాలు
              </span>
              <h2 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                శివ ముహూర్త చక్రం (సత్వ, రజో, తమో గుణ విభజన)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                ప్రాచీన శివాగమ సాంప్రదాయం ప్రకారం సమయం ప్రతి 45 నిమిషాలకు త్రిగుణాల రూపంలో మారుతుంది.
                సాత్విక శివ ముహూర్తంలో ప్రారంభించిన కార్యాలు నిరాటంకంగా సిద్ధిస్తాయి.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SHIVA_MUHURTHA_SYSTEM.map((slot) => (
                <div
                  key={slot.index}
                  className={`rounded-2xl p-6 border flex flex-col justify-between space-y-4 ${
                    slot.guna === 'సాత్విక'
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50/60 border-emerald-300'
                      : slot.guna === 'రాజసిక'
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50/60 border-amber-300'
                      : 'bg-gradient-to-br from-rose-50 to-red-50/60 border-rose-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white shadow-xs">
                        {slot.durationMinutes} నిమిషాలు
                      </span>
                      <span className="text-xs font-semibold">{slot.guna} గుణం</span>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-slate-900">
                      {slot.nameTe}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {slot.natureTe}
                    </p>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-black/5 text-xs space-y-1">
                    <strong className="text-[11px] block text-slate-900">అనుకూల కార్యాలు:</strong>
                    <span className="text-slate-600">{slot.suitableActivitiesTe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pancha Bhoota Tatwa Kshipra Muhurtha */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
                క్షిప్ర ముహూర్త గణితం
              </span>
              <h2 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                పంచభూత తత్త్వ సూక్ష్మ ముహూర్త నిర్ణయం
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                సూర్యోదయం నుండి సమయం పృథ్వీ (6 ని), జల (12 ని), తేజో (18 ని), వాయు (24 ని), ఆకాశ (30 ని) తత్త్వాలలో
                సంచరిస్తుంది. పృథ్వీ, జల తత్త్వాలు సమస్త భౌతిక శుభ కార్యాలకు ఉత్తమోత్తమం.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PANCHA_BHOOTA_TATWAS.map((tatwa, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                    tatwa.isFavorable
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-slate-50 border-slate-200 opacity-90'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                      <span>{tatwa.durationMinutes} నిమిషాలు</span>
                      <span>{tatwa.isFavorable ? '✓ శుభం' : '✗ వర్జ్యం'}</span>
                    </div>
                    <h4 className="text-base font-bold font-serif text-slate-900">
                      {tatwa.tatwaTe}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {tatwa.elementNatureTe}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-amber-200/60 text-[11px]">
                    <span className="font-semibold text-slate-800 block mb-0.5">ఉత్తమమైనవి:</span>
                    <span className="text-slate-600">{tatwa.suitableForTe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO FAQS ACCORDION (Rich Search Visibility) */}
      <div className="max-w-7xl mx-auto mt-12 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-200 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
            <HelpCircle size={14} />
            తరచూ అడిగే ప్రశ్నలు • Frequently Asked Astrology & Muhurtham Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            ముహూర్తం మరియు జ్యోతిష్య సందేహాలు
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            గూగుల్ సెర్చ్‌లో అత్యధికంగా అడిగే ప్రశ్నలకు ప్రామాణిక మహర్షి సంహితల సమాధానాలు.
          </p>
        </div>

        <div className="space-y-3">
          {SEO_FAQS.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-amber-200/70 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-amber-50/40 hover:bg-amber-100/50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                    {faq.qTe}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-amber-800 shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-amber-100 space-y-2">
                    <p>{faq.aTe}</p>
                    <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-2">
                      {faq.aEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
