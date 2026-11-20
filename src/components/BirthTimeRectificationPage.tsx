import React, { useMemo, useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Compass,
  Sparkles,
  BookOpen,
  MessageCircle,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sun,
  Layers,
} from 'lucide-react';
import { BIRTH_CITIES } from '../data/birthCitiesData';
import { useLanguage } from '../context/LanguageContext';
import {
  BTR_LIFE_EVENT_CATALOG,
  BTRCandidateSlot,
  BTRCluesInput,
  BTRLifeEventInput,
  BTRLifeEventType,
  runBirthTimeRectificationScan,
} from '../utils/btrAndCosmicRadarEngine';

export interface BirthTimeRectificationPageProps {
  onOpenKundaliWithTime?: (params: {
    birthDate: string;
    birthTime: string;
    cityId: string;
  }) => void;
  onSelectArticle?: (slug: string) => void;
  onOpenBooking?: () => void;
}

const PRECISION_MODES: Array<{
  id: 'fine' | 'standard' | 'wide';
  windowMinutes: number;
  stepMinutes: number;
  labelTe: string;
  labelEn: string;
}> = [
  {
    id: 'fine',
    windowMinutes: 15,
    stepMinutes: 1,
    labelTe: '±15 నిమిషాలు (ప్రతి 1 నిమిషం · D60 స్థాయి)',
    labelEn: '±15 min (1-min step · D60 Precision)',
  },
  {
    id: 'standard',
    windowMinutes: 30,
    stepMinutes: 2,
    labelTe: '±30 నిమిషాలు (ప్రతి 2 నిమిషాలు · D9/D10)',
    labelEn: '±30 min (2-min step · D9/D10)',
  },
  {
    id: 'wide',
    windowMinutes: 60,
    stepMinutes: 5,
    labelTe: '±60 నిమిషాలు (ప్రతి 5 నిమిషాలు · లగ్న శోధన)',
    labelEn: '±60 min (5-min step · Broad Lagna Scan)',
  },
];

const BTR_ARTICLES_LINKS = [
  {
    slug: 'janma-samaya-shuddhi-birth-time-rectification-telugu',
    titleTe: 'పుట్టిన సమయం సరిగ్గా తెలియకపోతే జాతకం ఎలా చూడాలి? (సంపూర్ణ BTR గైడ్)',
    titleEn: 'Complete Telugu Guide to Birth Time Rectification (When Birth Time Is Uncertain)',
    tagTe: 'సంపూర్ణ గైడ్',
    tagEn: 'Master Guide',
  },
  {
    slug: 'pranapada-lagna-kunda-sphuta-btr-rahasyam',
    titleTe: 'ప్రాణపద లగ్నం & కుండ స్ఫుట (81× చంద్రుడు): బృహత్ పరాశర రహస్యం',
    titleEn: 'BPHS Pranapada Lagna & 81x Moon Kunda Sphuta Rectification Formula',
    tagTe: 'పరాశర సిద్ధాంతం',
    tagEn: 'BPHS Classical',
  },
  {
    slug: 'kp-cuspal-sublord-ruling-planets-btr-telugu',
    titleTe: 'KP కస్పల్ సబ్‌లార్డ్ & రూలింగ్ ప్లానెట్స్ ద్వారా నిమిషాల స్థాయిలో జన్మ సమయ శుద్ధి',
    titleEn: 'KP Cuspal Sub-Lord & Ruling Planets Method for Exact Birth Time Rectification',
    tagTe: 'KP 249 పద్ధతి',
    tagEn: 'KP 249 Method',
  },
  {
    slug: 'twins-horoscope-d60-shashtiamsa-telugu',
    titleTe: 'కవల పిల్లల జాతకాలు (Twins Horoscope): 2 నిమిషాల తేడా & D60 షష్ట్యంశ రహస్యం',
    titleEn: 'Twins Horoscope Differentiation: How D60 Shashtiamsa Shifts Every 2 Minutes',
    tagTe: 'కవలలు · D60',
    tagEn: 'Twins · D60',
  },
];

const BTR_FAQS = [
  {
    qTe: 'జన్మ సమయ శుద్ధి (Birth Time Rectification - BTR) అంటే ఏమిటి? ఎవరికి ఇది అవసరం?',
    qEn: 'What is Birth Time Rectification (BTR) and who needs it?',
    aTe: 'పుట్టిన సమయం హాస్పిటల్ రికార్డులో 5 నుండి 60 నిమిషాల తేడా ఉన్నా, లేదా లగ్న సంధి (Lagna Sandhi) వద్ద ఉన్నా D1 లగ్నం, D9 నవాంశ, D10 దశాంశ, KP సబ్‌లార్డ్ మరియు దశా ఫలితాలు పూర్తిగా మారిపోతాయి. గత జీవిత సంఘటనల తేదీలు, ప్రాణపద లగ్నం, కుండ స్ఫుట మరియు పంచ తత్వాల ఆధారంగా అసలైన ఖచ్చితమైన జన్మ సమయాన్ని నిర్ధారించే శాస్త్రీయ ప్రక్రియే BTR.',
    aEn: 'Even a 5–30 minute error in recorded birth time can shift the Ascendant (Lagna), D9 Navamsa, D10 Dasamsa, or KP Cuspal Sub-Lord. Birth Time Rectification (BTR) cross-verifies classical BPHS formulas (Pranapada, Kunda, Pancha Tatwa) and dated life milestones against Vimshottari Dashas to pinpoint the true moment of birth.',
  },
  {
    qTe: 'ప్రాణపద లగ్నం (Pranapada Lagna) మరియు కుండ స్ఫుట (Kunda Sphuta) ఎలా పనిచేస్తాయి?',
    qEn: 'How do BPHS Pranapada Lagna and Kunda Sphuta verify birth time?',
    aTe: 'బృహత్ పరాశర హోరా శాస్త్రం ప్రకారం సూర్యోదయం నుండి గడిచిన విఘటికల ఆధారంగా లెక్కించే ప్రాణపద లగ్నం శిశువు యొక్క మొదటి శ్వాస (ప్రాణశక్తి)ని సూచిస్తుంది. మానవ జన్మలో ప్రాణపద లగ్నం జన్మ లగ్నానికి లేదా నవాంశ లగ్నానికి 1, 5, 9 లేదా 7వ స్థానంలో ఉండాలి. అలాగే చంద్రుని స్ఫుటాన్ని 81తో గుణించగా వచ్చే కుండ స్ఫుట కూడా లగ్నానికి త్రికోణంలో ఉండటం శాస్త్రీయ నిర్ధారణ.',
    aEn: 'Per Brihat Parashara Hora Shastra, Pranapada is computed from elapsed Vighatikas since local sunrise and must fall in Trikona (1, 5, 9) or 7th to the Natal or Navamsa Lagna for human births. Kunda Sphuta (81 × Moon Longitude) similarly resonates in Trikona (1, 5, 9) to the true Lagna.',
  },
  {
    qTe: 'కవల పిల్లలకు (Twins) పుట్టిన తేదీ & రాశి ఒకటే ఉన్నా జీవిత ఫలితాలు ఎందుకు వేరుగా ఉంటాయి?',
    qEn: 'Why do twins born minutes apart have different destinies in Vedic Astrology?',
    aTe: 'D1 రాశి లగ్నం 2 గంటలకు ఒకసారి మారుతుంది, కానీ D9 నవాంశ ప్రతి ~13 నిమిషాలకు, D10 దశాంశ ప్రతి ~12 నిమిషాలకు, KP సబ్‌లార్డ్ ప్రతి ~4–8 నిమిషాలకు, మరియు D60 షష్ట్యంశ ప్రతి ~2 నిమిషాలకు మారిపోతుంది. అందువల్ల కవల పిల్లల మధ్య ఉన్న 3–10 నిమిషాల తేడా వల్ల వారి D60 మరియు KP సబ్‌లార్డ్స్ పూర్తిగా మారి వేర్వేరు జీవిత ఫలితాలు ఇస్తాయి.',
    aEn: 'While the D1 Lagna spans ~2 hours, D9 Navamsa shifts every ~13 minutes, D10 Dasamsa every ~12 minutes, KP Sub-Lord every ~4–8 minutes, and D60 Shashtiamsa every ~2 minutes. Thus even a 3–5 minute gap between twins transforms their karma and dasha fructification.',
  },
  {
    qTe: 'ఉచిత ఆన్‌లైన్ BTR తర్వాత గురుజీ వ్యక్తిగత పరిశీలన ఎప్పుడు అవసరం?',
    qEn: 'When should I consult Brahmasri Jallavaram Sai Dheeraj Sharma for manual BTR?',
    aTe: 'ఈ ఆన్‌లైన్ 6-మెథడ్ టూల్ మీ సందేహాన్ని నిమిషాల పరిధిలోకి తగ్గిస్తుంది. అయితే మీకు పుట్టిన సమయం 2 గంటలకు పైగా తెలియకపోయినా, కవల పిల్లల జాతక విభజన కావాలన్నా, లేదా వివాహం/విదేశీయానం వంటి పెద్ద నిర్ణయాల కోసం సెకన్ల స్థాయి D60 + ప్రశ్న కుండలి + నాడి నిర్ధారణ కావాలంటే బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి వ్యక్తిగత సంప్రదింపు ఉత్తమం.',
    aEn: 'This 6-method calculator narrows ±15 to ±60 minute uncertainty quickly. If your birth time uncertainty exceeds 2 hours, or you require second-level D60 Shashtiamsa, Horary Prashna, or Twin Differentiation, a manual verification by Brahmasri Jallavaram Sai Dheeraj Sharma is recommended.',
  },
];

export const BirthTimeRectificationPage: React.FC<BirthTimeRectificationPageProps> = ({
  onOpenKundaliWithTime,
  onSelectArticle,
  onOpenBooking,
}) => {
  const { language, t } = useLanguage();

  const [birthDate, setBirthDate] = useState<string>('1994-08-18');
  const [approxTime, setApproxTime] = useState<string>('09:30');
  const [cityId, setCityId] = useState<string>(BIRTH_CITIES[0]?.id || 'hyderabad');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [precisionId, setPrecisionId] = useState<'fine' | 'standard' | 'wide'>('standard');
  const [siblingHint, setSiblingHint] = useState<BTRCluesInput['siblingHint']>('none');
  const [careerHint, setCareerHint] = useState<BTRCluesInput['careerHint']>('tech_finance');
  const [marriageHint, setMarriageHint] = useState<BTRCluesInput['marriageTimingHint']>('normal');

  // Optional Real Life Milestones for Dasha Verification
  const [lifeEvents, setLifeEvents] = useState<BTRLifeEventInput[]>([
    { id: 'ev-1', type: 'first_job', date: '2017-07-10' },
  ]);
  const [newEventType, setNewEventType] = useState<BTRLifeEventType>('marriage');
  const [newEventDate, setNewEventDate] = useState<string>('2022-05-14');

  const [selectedTimeStr, setSelectedTimeStr] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number>(0);

  const filteredCities = useMemo(() => {
    const q = cityFilter.trim().toLowerCase();
    if (!q) return BIRTH_CITIES.slice(0, 80);
    return BIRTH_CITIES.filter(
      (c) => c.labelEn.toLowerCase().includes(q) || c.labelTe.toLowerCase().includes(q)
    ).slice(0, 80);
  }, [cityFilter]);

  const activePrecision = PRECISION_MODES.find((p) => p.id === precisionId) || PRECISION_MODES[1];

  const report = useMemo(
    () =>
      runBirthTimeRectificationScan({
        birthDate,
        approxTime,
        cityId,
        siblingHint,
        careerHint,
        marriageTimingHint: marriageHint,
        windowMinutes: activePrecision.windowMinutes,
        stepMinutes: activePrecision.stepMinutes,
        lifeEvents,
      }),
    [
      birthDate,
      approxTime,
      cityId,
      siblingHint,
      careerHint,
      marriageHint,
      activePrecision.windowMinutes,
      activePrecision.stepMinutes,
      lifeEvents,
    ]
  );

  const inspectedCandidate: BTRCandidateSlot = useMemo(() => {
    if (selectedTimeStr) {
      const found = report.candidates.find((c) => c.timeStr === selectedTimeStr);
      if (found) return found;
    }
    return report.bestCandidate;
  }, [report, selectedTimeStr]);

  const topCandidates = useMemo(() => {
    const sorted = [...report.candidates].sort((a, b) => b.matchScore - a.matchScore);
    const top12 = sorted.slice(0, 12);
    // Ensure input time (offset 0) is also visible for comparison
    const inputSlot = report.candidates.find((c) => c.offsetMins === 0);
    if (inputSlot && !top12.some((c) => c.timeStr === inputSlot.timeStr)) {
      top12.push(inputSlot);
    }
    return top12.sort((a, b) => a.offsetMins - b.offsetMins);
  }, [report.candidates]);

  const handleAddEvent = () => {
    if (!newEventDate || lifeEvents.length >= 6) return;
    setLifeEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}`,
        type: newEventType,
        date: newEventDate,
      },
    ]);
  };

  const handleRemoveEvent = (id: string) => {
    setLifeEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const selectedCityObj = BIRTH_CITIES.find((c) => c.id === cityId) || BIRTH_CITIES[0];
  const waText = encodeURIComponent(
    `నమస్కారం గురుజీ! నేను telugujyothisham.com లో జన్మ సమయ శుద్ధి (BTR) చెక్ చేశాను.\nపుట్టిన తేదీ: ${birthDate}\nఅంచనా సమయం: ${approxTime} (సిఫార్సు: ${report.recommendedTime})\nనగరం: ${selectedCityObj?.labelEn || cityId}\nదయచేసి వ్యక్తిగత D60 & ప్రాణపద జన్మ సమయ శుద్ధి అపాయింట్‌మెంట్ వివరాలు తెలియజేయండి.`
  );

  return (
    <div className="space-y-8 font-telugu">
      {/* ROYAL TEMPLE MANUSCRIPT HERO BANNER */}
      <section className="rounded-3xl overflow-hidden border-2 border-[#C99634] bg-gradient-to-br from-[#5A1408] via-[#3B0A0C] to-[#1E0810] text-[#FFFDF7] shadow-xl">
        <div className="p-6 sm:p-8 lg:p-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C99634]/35 pb-4">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#F5C451]">
              {t(
                'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · 6-మెథడ్ శాస్త్రీయ ప్రయోగశాల',
                'Sri Lakshmi Ganapathi Jyothishalayam · 6-Method Classical Lab'
              )}
            </span>
            <span className="text-xs font-semibold text-[#EAD7B7]">
              {t(
                'బృహత్ పరాశర · ప్రాణపద · కుండ · KP 249 · D60',
                'BPHS · Pranapada · Kunda · KP 249 · D60'
              )}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug text-[#FFFDF7]">
            {t(
              'జన్మ సమయ శుద్ధి క్యాలిక్యులేటర్ (Birth Time Rectification in Telugu)',
              'Birth Time Rectification Calculator (జన్మ సమయ శుద్ధి — BPHS & KP)'
            )}
          </h1>

          <p className="text-sm sm:text-base text-[#F2E5CF] max-w-4xl leading-relaxed">
            {t(
              'పుట్టిన సమయం 5 నుండి 60 నిమిషాల వరకు అస్పష్టంగా ఉందా? బృహత్ పరాశర హోరా శాస్త్రంలోని ప్రాణపద లగ్నం, కుండ స్ఫుట (81× చంద్రుడు), సూర్యోదయ పంచ తత్వం, KP 249 లగ్న సబ్‌లార్డ్, మండి-లగ్న మరియు మీ నిజమైన జీవిత సంఘటనల (వివాహం, ఉద్యోగం, సంతానం, గృహం) వింశోత్తరి దశా పరీక్షతో ఖచ్చితమైన జన్మ సమయాన్ని ఉచితంగా కనుగొనండి.',
              'Uncertain about your exact birth time by 5 to 60 minutes? Cross-verify candidate times across 6 authentic Vedic astrology methods — BPHS Pranapada Lagna, 81× Moon Kunda Sphuta, Sunrise Pancha Tatwa, KP 249 Cuspal Sub-Lord, Mandi-Lagna, and Vimshottari Mahadasha–Antardasha checks on your real dated life milestones.'
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="rounded-xl bg-white/5 border border-[#C99634]/35 px-3.5 py-2.5">
              <div className="text-[#F5C451] font-bold">{t('ప్రాణపద & కుండ', 'Pranapada & Kunda')}</div>
              <div className="text-[#EFE4D1] mt-0.5">{t('సూర్యోదయ విఘటిక గణన', 'Exact Sunrise Vighatika')}</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-[#C99634]/35 px-3.5 py-2.5">
              <div className="text-[#F5C451] font-bold">{t('KP 249 సబ్‌లార్డ్', 'KP 249 Sub-Lord')}</div>
              <div className="text-[#EFE4D1] mt-0.5">{t('లగ్న నక్షత్ర & ఉప-అధిపతి', 'Ascendant Star & Sub')}</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-[#C99634]/35 px-3.5 py-2.5">
              <div className="text-[#F5C451] font-bold">{t('వర్గ సెన్సిటివిటీ', 'Varga Sensitivity')}</div>
              <div className="text-[#EFE4D1] mt-0.5">{t('D9 (13m) · D10 (12m) · D60 (2m)', 'D9 · D10 · D60 Shifts')}</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-[#C99634]/35 px-3.5 py-2.5">
              <div className="text-[#F5C451] font-bold">{t('జీవిత ఘటనల దశ', 'Life-Event Dashas')}</div>
              <div className="text-[#EFE4D1] mt-0.5">{t('మహాదశ & అంతర్దశ నిర్ధారణ', 'Maha & Antar Verification')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BTR WORKBENCH */}
      <section className="rounded-3xl bg-[#FAF5EA] border-2 border-[#D8BE8B] p-5 sm:p-7 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DFC89B] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B0A0C] flex items-center gap-2">
              <Clock size={22} className="text-[#8B2611]" />
              <span>{t('1. మీ అంచనా జన్మ వివరాలు & జీవిత ఘటనలు నమోదు చేయండి', '1. Enter Approximate Birth Details & Life Milestones')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-1">
              {t(
                'లాహిరి చిత్రపక్ష అయనాంశం (NASA JPL DE440) ఆధారంగా స్థానిక సూర్యోదయం మరియు ప్రతి నిమిషపు లగ్న గణన జరుగుతుంది.',
                'Calculated live using Lahiri Chitrapaksha Ayanamsa and exact local astronomical sunrise.'
              )}
            </p>
          </div>
          <div className="text-xs font-bold text-[#6E260E] bg-[#F4E7CC] border border-[#D8B979] rounded-xl px-3.5 py-2 shrink-0 flex items-center gap-2">
            <Sun size={15} className="text-[#9A3412]" />
            <span>
              {t('స్థానిక సూర్యోదయం:', 'Local Sunrise:')}{' '}
              <span className="font-mono">{report.sunriseLocalStr}</span>
            </span>
          </div>
        </div>

        {/* Core Birth Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <label className="block space-y-1.5">
            <span className="font-bold text-[#3B0A0C] text-xs">{t('పుట్టిన తేదీ (Birth Date)', 'Birth Date')}</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setSelectedTimeStr(null);
              }}
              className="w-full rounded-xl border border-[#C9AA71] bg-white px-3.5 py-2.5 font-semibold text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#8B2611]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="font-bold text-[#3B0A0C] text-xs">{t('అంచనా పుట్టిన సమయం (Approx Time)', 'Approximate Birth Time')}</span>
            <input
              type="time"
              value={approxTime}
              onChange={(e) => {
                setApproxTime(e.target.value);
                setSelectedTimeStr(null);
              }}
              className="w-full rounded-xl border border-[#C9AA71] bg-white px-3.5 py-2.5 font-semibold text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#8B2611]"
            />
          </label>

          <div className="space-y-1.5">
            <span className="font-bold text-[#3B0A0C] text-xs block">{t('పుట్టిన ప్రాంతం (Birth City)', 'Birth City')}</span>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder={t('నగరం పేరు వెతకండి...', 'Filter city...')}
              className="w-full rounded-t-xl border border-b-0 border-[#C9AA71] bg-[#FFFDF8] px-3 py-1.5 text-xs text-[#1C1917] focus:outline-none"
            />
            <select
              value={cityId}
              onChange={(e) => {
                setCityId(e.target.value);
                setSelectedTimeStr(null);
              }}
              className="w-full rounded-b-xl border border-[#C9AA71] bg-white px-3 py-2 text-xs font-bold text-[#1C1917]"
            >
              {filteredCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'en' ? c.labelEn : c.labelTe}
                </option>
              ))}
            </select>
          </div>

          <label className="block space-y-1.5">
            <span className="font-bold text-[#3B0A0C] text-xs">{t('సందేహ పరిధి (Uncertainty Window)', 'Search Window & Precision')}</span>
            <select
              value={precisionId}
              onChange={(e) => {
                setPrecisionId(e.target.value as 'fine' | 'standard' | 'wide');
                setSelectedTimeStr(null);
              }}
              className="w-full rounded-xl border border-[#C9AA71] bg-white px-3 py-2.5 text-xs font-bold text-[#1C1917]"
            >
              {PRECISION_MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {language === 'en' ? m.labelEn : m.labelTe}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Behavioral & Family Clues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <label className="block space-y-1.5">
            <span className="font-bold text-[#44403C]">{t('తోబుట్టువుల స్థితి (3వ / 11వ భావం)', 'Siblings Clue (3rd / 11th House)')}</span>
            <select
              value={siblingHint}
              onChange={(e) => setSiblingHint(e.target.value as BTRCluesInput['siblingHint'])}
              className="w-full rounded-xl border border-[#D4BC8B] bg-white px-3 py-2.5 font-bold text-[#1C1917]"
            >
              <option value="none">{t('ఏకైక సంతానం / సమానం', 'Only Child / Balanced')}</option>
              <option value="younger_more">{t('కనిష్ఠ సోదరులు ఎక్కువ (Younger)', 'Younger Siblings Prominent')}</option>
              <option value="elder_more">{t('జ్యేష్ఠ సోదరులు ఎక్కువ (Elder)', 'Elder Siblings Prominent')}</option>
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="font-bold text-[#44403C]">{t('ప్రధాన వృత్తి రంగం (D10 దశాంశ & తత్వం)', 'Career Domain (D10 & Tatwa)')}</span>
            <select
              value={careerHint}
              onChange={(e) => setCareerHint(e.target.value as BTRCluesInput['careerHint'])}
              className="w-full rounded-xl border border-[#D4BC8B] bg-white px-3 py-2.5 font-bold text-[#1C1917]"
            >
              <option value="tech_finance">{t('టెక్ / సాఫ్ట్‌వేర్ / ఫైనాన్స్ / గణితం', 'Tech / Software / Finance / Analytical')}</option>
              <option value="govt_leadership">{t('ప్రభుత్వం / మేనేజ్‌మెంట్ / నాయకత్వం', 'Government / Administration / Leadership')}</option>
              <option value="creative_business">{t('వ్యాపారం / కళలు / మీడియా / మార్కెటింగ్', 'Business / Creative / Media')}</option>
              <option value="healthcare_service">{t('వైద్యం / విద్య / ఆధ్యాత్మిక సేవ', 'Healthcare / Teaching / Healing Service')}</option>
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="font-bold text-[#44403C]">{t('వివాహ సమయ స్వభావం (7వ భావం & D9)', 'Marriage Timing Pattern (7th & D9)')}</span>
            <select
              value={marriageHint}
              onChange={(e) => setMarriageHint(e.target.value as BTRCluesInput['marriageTimingHint'])}
              className="w-full rounded-xl border border-[#D4BC8B] bg-white px-3 py-2.5 font-bold text-[#1C1917]"
            >
              <option value="normal">{t('సాధారణ వయసు (24–28 సం.)', 'Standard Age (24–28 yrs)')}</option>
              <option value="early">{t('త్వరగా వివాహం (<24 సం.)', 'Early Marriage (<24 yrs)')}</option>
              <option value="delayed">{t('ఆలస్య వివాహం (>29 సం.)', 'Delayed Marriage (>29 yrs)')}</option>
              <option value="unmarried">{t('ఇంకా వివాహం కాలేదు', 'Not Married Yet')}</option>
            </select>
          </label>
        </div>

        {/* Real Dated Life-Events Verifier */}
        <div className="rounded-2xl bg-white border border-[#DFC89B] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#3B0A0C]">
                {t(
                  '2. నిజమైన జీవిత సంఘటనల తేదీలు జోడించండి (వింశోత్తరి దశ పరీక్ష)',
                  '2. Add Real Dated Life Milestones (Vimshottari Dasha Verification)'
                )}
              </h3>
              <p className="text-xs text-[#57534E]">
                {t(
                  'మీ జీవితంలో జరిగిన 2–4 ముఖ్య తేదీలు (వివాహం, మొదటి ఉద్యోగం, సంతానం, గృహప్రవేశం, సర్జరీ) వేస్తే ఖచ్చితత్వం రెట్టింపు అవుతుంది.',
                  'Adding 2–4 real event dates dramatically improves rectification accuracy by verifying active Mahadasha & Antardasha house activation.'
                )}
              </p>
            </div>
            <span className="text-xs font-bold text-[#7C2D12] shrink-0">
              {lifeEvents.length}/6 {t('ఘటనలు', 'events')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end text-xs">
            <label className="sm:col-span-6 space-y-1">
              <span className="font-bold text-[#44403C]">{t('ఘటన రకం (Event Type)', 'Event Category')}</span>
              <select
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as BTRLifeEventType)}
                className="w-full rounded-xl border border-[#D4BC8B] bg-[#FAF5EA]/60 px-3 py-2 font-bold text-[#1C1917]"
              >
                {(Object.keys(BTR_LIFE_EVENT_CATALOG) as BTRLifeEventType[]).map((k) => (
                  <option key={k} value={k}>
                    {language === 'en'
                      ? BTR_LIFE_EVENT_CATALOG[k].labelEn
                      : BTR_LIFE_EVENT_CATALOG[k].labelTe}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-4 space-y-1">
              <span className="font-bold text-[#44403C]">{t('జరిగిన తేదీ (Event Date)', 'Event Date')}</span>
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full rounded-xl border border-[#D4BC8B] bg-[#FAF5EA]/60 px-3 py-2 font-semibold text-[#1C1917]"
              />
            </label>

            <button
              type="button"
              onClick={handleAddEvent}
              disabled={lifeEvents.length >= 6}
              className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#5A1408] hover:bg-[#3B0A0C] disabled:opacity-50 text-white font-bold cursor-pointer transition-colors"
            >
              <Plus size={15} />
              <span>{t('జోడించు', 'Add')}</span>
            </button>
          </div>

          {lifeEvents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {lifeEvents.map((ev) => {
                const meta = BTR_LIFE_EVENT_CATALOG[ev.type];
                const check = inspectedCandidate.eventChecks.find((c) => c.eventId === ev.id);
                return (
                  <div
                    key={ev.id}
                    className={`rounded-xl border p-3 text-xs flex items-start justify-between gap-2 ${
                      check?.verified
                        ? 'bg-[#EFF8F3] border-[#86C9A5]'
                        : 'bg-[#FDF8EE] border-[#E3CFA4]'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-extrabold text-[#1C1917] truncate">
                        {language === 'en' ? meta.labelEn : meta.labelTe}
                      </div>
                      <div className="font-mono text-[11px] text-[#57534E]">{ev.date}</div>
                      {check && (
                        <div
                          className={`text-[11px] font-semibold mt-1 ${
                            check.verified ? 'text-[#065F46]' : 'text-[#9A3412]'
                          }`}
                        >
                          {check.verified ? '✓ ' : '• '}
                          {language === 'en' ? check.reasonEn : check.reasonTe}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(ev.id)}
                      aria-label="Remove event"
                      className="text-[#78716C] hover:text-[#B91C1C] p-1 cursor-pointer shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* RECOMMENDED TIME + 6-METHOD CONSENSUS SCOREBOARD */}
      <section className="rounded-3xl bg-white border-2 border-[#C99634] shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#3B0A0C] via-[#51110A] to-[#260605] text-white p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#C99634]">
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F5C451]">
              {inspectedCandidate.timeStr === report.recommendedTime
                ? t('అత్యధిక శాస్త్రీయ సమన్వయ సమయం (Top Classical Match)', 'Highest Classical Consensus Time')
                : t('మీరు ఎంచుకున్న పరిశీలన సమయం (Selected Candidate)', 'Inspecting Candidate Time')}
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#FFFDF7]">
                {inspectedCandidate.timeStr}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#F5C451]">
                {language === 'en'
                  ? `${inspectedCandidate.d1LagnaEn} Lagna (${inspectedCandidate.lagnaDegreeFormatted})`
                  : `${inspectedCandidate.d1LagnaTe} లగ్నం (${inspectedCandidate.lagnaDegreeFormatted})`}
              </span>
              <span className="text-xs font-bold bg-[#007a52] text-white px-2.5 py-1 rounded-lg">
                {t('శాస్త్రీయ స్కోర్:', 'Match Score:')} {inspectedCandidate.matchScore}%
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#EFE3CE] max-w-3xl">
              {language === 'en' ? report.summaryEn : report.summaryTe}
            </p>
          </div>

          {onOpenKundaliWithTime && (
            <button
              type="button"
              onClick={() =>
                onOpenKundaliWithTime({
                  birthDate,
                  birthTime: inspectedCandidate.timeStr,
                  cityId,
                })
              }
              className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F5C451] hover:bg-[#eab338] text-[#2B0705] font-extrabold text-xs sm:text-sm shadow cursor-pointer transition-colors"
            >
              <CheckCircle2 size={17} />
              <span>
                {t(
                  `${inspectedCandidate.timeStr} తో 37-అధ్యాయాల జాతకం చూడండి →`,
                  `Open 37-Ch Kundali for ${inspectedCandidate.timeStr} →`
                )}
              </span>
            </button>
          )}
        </div>

        {/* 6 Classical Methods Breakdown Cards */}
        <div className="p-5 sm:p-6 bg-[#FAF5EA]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-white border border-[#DFC89B] p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#5A1408]">{t('1. ప్రాణపద లగ్నం (BPHS)', '1. BPHS Pranapada Lagna')}</span>
              <span className={`font-mono font-extrabold ${inspectedCandidate.pranapadaAligned ? 'text-[#065F46]' : 'text-[#9A3412]'}`}>
                {inspectedCandidate.methodBreakdown.pranapada}/20
              </span>
            </div>
            <div className="text-sm font-bold text-[#1C1917]">
              {language === 'en' ? inspectedCandidate.pranapadaSignEn : inspectedCandidate.pranapadaSignTe}
            </div>
            <p className="text-[#57534E]">
              {inspectedCandidate.pranapadaAligned
                ? t('✓ జన్మ/నవాంశ లగ్నంతో త్రికోణ (1-5-9) లేదా 7వ సమన్వయం ఉంది.', '✓ Aligns in Trikona (1-5-9) or 7th with D1/D9 Lagna.')
                : t('• ప్రాణపద సమన్వయానికి సమీప నిమిషాలను సరిపోల్చండి.', '• Compare nearby minutes for closer Pranapada Trikona alignment.')}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#DFC89B] p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#5A1408]">{t('2. కుండ స్ఫుట (81× చంద్రుడు)', '2. Kunda Sphuta (81× Moon)')}</span>
              <span className={`font-mono font-extrabold ${inspectedCandidate.kundaAligned ? 'text-[#065F46]' : 'text-[#9A3412]'}`}>
                {inspectedCandidate.methodBreakdown.kunda}/18
              </span>
            </div>
            <div className="text-sm font-bold text-[#1C1917]">
              {language === 'en' ? report.kundaSignEn : report.kundaSignTe}
            </div>
            <p className="text-[#57534E]">
              {inspectedCandidate.kundaAligned
                ? t('✓ చంద్రుని 81వ భాగం లగ్నంతో త్రికోణంలో సరిపోయింది.', '✓ Moon × 81 Kunda resonates in Trikona with Lagna.')
                : t('• కుండ స్ఫుటతో నేరుగా త్రికోణం లేదు.', '• Outside primary Kunda Trikona window.')}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#DFC89B] p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#5A1408]">{t('3. పంచ తత్వ శోధన', '3. Sunrise Pancha Tatwa')}</span>
              <span className="font-mono font-extrabold text-[#065F46]">
                {inspectedCandidate.methodBreakdown.tatwa}/13
              </span>
            </div>
            <div className="text-sm font-bold text-[#1C1917]">
              {language === 'en' ? inspectedCandidate.tatwaEn : inspectedCandidate.tatwaTe}
            </div>
            <p className="text-[#57534E]">
              {t(`సూర్యోదయం (${report.sunriseLocalStr}) నుండి 90 నిమిషాల శాస్త్రీయ తత్వ చక్రం.`, `90-min classical Tatwa cycle from local sunrise (${report.sunriseLocalStr}).`)}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#DFC89B] p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#5A1408]">{t('4. KP 249 లగ్న సబ్‌లార్డ్', '4. KP 249 Lagna Sub-Lord')}</span>
              <span className="font-mono font-extrabold text-[#065F46]">
                {inspectedCandidate.methodBreakdown.kpSubLord}/17
              </span>
            </div>
            <div className="text-sm font-bold text-[#1C1917]">
              {t('నక్షత్రాధిపతి:', 'Star:')}{' '}
              {language === 'en' ? inspectedCandidate.kpStarLordEn : inspectedCandidate.kpStarLordTe} ·{' '}
              {t('సబ్:', 'Sub:')}{' '}
              <span className="text-[#8B2611]">
                {language === 'en' ? inspectedCandidate.kpSubLordEn : inspectedCandidate.kpSubLordTe}
              </span>
            </div>
            <p className="text-[#57534E]">
              {t('KP పద్ధతిలో లగ్న సబ్‌లార్డ్ ప్రతి 4–8 నిమిషాలకు మారుతుంది.', 'In KP astrology, Ascendant Sub-Lord shifts every 4–8 minutes.')}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#DFC89B] p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#5A1408]">{t('5. వర్గ చక్రాలు & మండి-లగ్న', '5. Varga D9/D10/D60 & Mandi')}</span>
              <span className="font-mono font-extrabold text-[#065F46]">
                {inspectedCandidate.methodBreakdown.vargaAndClues}/23
              </span>
            </div>
            <div className="text-sm font-bold text-[#1C1917]">
              D9 {language === 'en' ? inspectedCandidate.d9NavamshaLagnaEn : inspectedCandidate.d9NavamshaLagnaTe} · D10{' '}
              {language === 'en' ? inspectedCandidate.d10DasamshaLagnaEn : inspectedCandidate.d10DasamshaLagnaTe} · D60 #{inspectedCandidate.d60ShashtiamsaNum}
            </div>
            <p className="text-[#57534E]">
              {t('మండి స్థానం:', 'Mandi Sign:')} {language === 'en' ? report.mandiSignEn : report.mandiSignTe}
              {inspectedCandidate.mandiAligned ? t(' (✓ కేంద్ర/త్రికోణం)', ' (✓ Kendra/Trikona)') : ''}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#DFC89B] p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#5A1408]">{t('6. జీవిత ఘటనల దశా పరీక్ష', '6. Life-Event Dasha Proof')}</span>
              <span className="font-mono font-extrabold text-[#065F46]">
                {inspectedCandidate.methodBreakdown.lifeEvents}/20
              </span>
            </div>
            <div className="text-sm font-bold text-[#1C1917]">
              {inspectedCandidate.eventTotalCount > 0
                ? `${inspectedCandidate.eventMatchesCount} / ${inspectedCandidate.eventTotalCount} ${t('ఘటనలు నిర్ధారితమయ్యాయి', 'milestones verified')}`
                : t('ఘటన తేదీలు ఇంకా జోడించలేదు', 'Add dated milestones above')}
            </div>
            <p className="text-[#57534E]">
              {t('మహాదశ & అంతర్దశ అధిపతుల భావ అనుసంధానం ఆధారంగా గణన.', 'Checks active Mahadasha & Antardasha lordship against event houses.')}
            </p>
          </div>
        </div>

        {/* Interactive Candidate Comparison Table */}
        <div className="p-5 sm:p-6 space-y-3 border-t border-[#E6D3AB]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-[#3B0A0C] flex items-center gap-2">
              <Layers size={18} className="text-[#8B2611]" />
              <span>
                {t(
                  'అగ్ర క్యాండిడేట్ జన్మ సమయాల పోలిక (క్లిక్ చేసి పూర్తి వివరాలు చూడండి)',
                  'Top Candidate Birth Time Comparison (Click any row to inspect)'
                )}
              </span>
            </h3>
            <span className="text-xs text-[#57534E]">
              {t(`మొత్తం ${report.candidates.length} సమయాలను పరీక్షించాము`, `Scanned ${report.candidates.length} candidate slots`)}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#DFC89B]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#3B0A0C] text-[#FDE68A]">
                  <th className="py-2.5 px-3">{t('సమయం', 'Time')}</th>
                  <th className="py-2.5 px-3">{t('D1 లగ్నం', 'D1 Lagna')}</th>
                  <th className="py-2.5 px-3">{t('D9 నవాంశ', 'D9')}</th>
                  <th className="py-2.5 px-3">{t('D10 దశాంశ', 'D10')}</th>
                  <th className="py-2.5 px-3">D60</th>
                  <th className="py-2.5 px-3">{t('KP సబ్‌లార్డ్', 'KP Sub')}</th>
                  <th className="py-2.5 px-3">{t('ప్రాణపద · కుండ', 'Pranapada · Kunda')}</th>
                  <th className="py-2.5 px-3">{t('స్కోర్', 'Score')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE4CE] bg-white">
                {topCandidates.map((c) => {
                  const isBest = c.timeStr === report.recommendedTime;
                  const isSelected = c.timeStr === inspectedCandidate.timeStr;
                  return (
                    <tr
                      key={c.timeStr}
                      onClick={() => setSelectedTimeStr(c.timeStr)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#FFF3D6] font-bold'
                          : isBest
                            ? 'bg-[#EFF8F3] hover:bg-[#E1F3E9]'
                            : 'hover:bg-[#FAF5EA]'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-[#3B0A0C] whitespace-nowrap">
                        {c.timeStr}{' '}
                        <span className="text-[10px] text-[#78716C]">
                          {c.offsetMins === 0 ? '(Input)' : `(${c.offsetMins > 0 ? '+' : ''}${c.offsetMins}m)`}
                        </span>
                        {isBest && (
                          <span className="ml-1.5 text-[10px] font-extrabold text-[#065F46]">★</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {language === 'en' ? c.d1LagnaEn : c.d1LagnaTe}{' '}
                        <span className="text-[10px] font-mono text-[#78716C]">{c.lagnaDegreeFormatted}</span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {language === 'en' ? c.d9NavamshaLagnaEn : c.d9NavamshaLagnaTe}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {language === 'en' ? c.d10DasamshaLagnaEn : c.d10DasamshaLagnaTe}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#57534E]">#{c.d60ShashtiamsaNum}</td>
                      <td className="py-2.5 px-3 font-bold text-[#7C2D12] whitespace-nowrap">
                        {language === 'en' ? c.kpSubLordEn : c.kpSubLordTe}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] whitespace-nowrap">
                        <span className={c.pranapadaAligned ? 'text-[#065F46] font-bold' : 'text-[#78716C]'}>
                          {c.pranapadaAligned ? '✓' : '·'} {language === 'en' ? c.pranapadaSignEn : c.pranapadaSignTe}
                        </span>
                        {' / '}
                        <span className={c.kundaAligned ? 'text-[#065F46] font-bold' : 'text-[#78716C]'}>
                          {c.kundaAligned ? t('✓ కుండ', '✓ Kunda') : '—'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-extrabold text-[#007a52]">
                        {c.matchScore}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HIGH-CONVERSION GURUJI MANUAL BTR CONSULTATION BANNER (WCAG AA #007a52) */}
      <section className="rounded-3xl bg-gradient-to-br from-[#3B0A0C] via-[#4A120A] to-[#230705] text-white border-2 border-[#C99634] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[#F5C451] flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{t('వ్యక్తిగత D60 & కవల పిల్లల జన్మ సమయ శుద్ధి సేవ', 'Personal D60, Prashna & Twins Rectification Service')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFDF7]">
            {t(
              'పుట్టిన సమయం 2 గంటలకు పైగా తెలియదా? లేదా సెకన్ల స్థాయి D60 నిర్ధారణ కావాలా?',
              'Birth Time Uncertain by 2+ Hours or Need Second-Level D60 Verification?'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#EFE3CE] leading-relaxed">
            {t(
              'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు మీ గత జీవిత ఘటనలు, తల్లిదండ్రుల వివరాలు, ప్రశ్న కుండలి, KP రూలింగ్ ప్లానెట్స్ మరియు D60 షష్ట్యంశ ఆధారంగా వ్యక్తిగతంగా మీ ఖచ్చితమైన జన్మ సమయాన్ని నిర్ధారిస్తారు.',
              'Brahmasri Jallavaram Sai Dheeraj Sharma personally rectifies uncertain birth charts using classical BPHS Pranapada, KP Ruling Planets, Prashna Horary, and D60 Shashtiamsa analysis.'
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={`https://wa.me/918977986166?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#007a52] hover:bg-[#006342] text-white font-extrabold text-sm shadow-md transition-colors"
          >
            <MessageCircle size={18} />
            <span>{t('గురుజీతో WhatsApp సంప్రదింపు', 'Consult Guruji on WhatsApp')}</span>
          </a>
          {onOpenBooking && (
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F5C451] hover:bg-[#e5b540] text-[#2B0705] font-extrabold text-sm cursor-pointer transition-colors"
            >
              <Compass size={17} />
              <span>{t('అపాయింట్‌మెంట్ బుక్ చేయండి', 'Book Consultation')}</span>
            </button>
          )}
        </div>
      </section>

      {/* 4 ORIGINAL TELUGU + ENGLISH CLASSICAL BTR ARTICLES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B0A0C] flex items-center gap-2">
            <BookOpen size={21} className="text-[#8B2611]" />
            <span>{t('జన్మ సమయ శుద్ధి (BTR) శాస్త్రీయ వ్యాసాలు', 'Classical Birth Time Rectification Guides')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BTR_ARTICLES_LINKS.map((art) => (
            <a
              key={art.slug}
              href={`/${art.slug}`}
              onClick={(e) => {
                if (onSelectArticle) {
                  e.preventDefault();
                  onSelectArticle(art.slug);
                }
              }}
              className="group rounded-2xl bg-[#FAF5EA] hover:bg-white border border-[#DFC89B] hover:border-[#C99634] p-5 flex flex-col justify-between gap-3 transition-all shadow-sm"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B2611]">
                  {language === 'en' ? art.tagEn : art.tagTe}
                </span>
                <h3 className="text-base font-extrabold text-[#1C1917] group-hover:text-[#5A1408] leading-snug">
                  {language === 'en' ? art.titleEn : art.titleTe}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007a52]">
                <span>{t('పూర్తి శాస్త్రీయ వ్యాసం చదవండి', 'Read Full Classical Guide')}</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* BILINGUAL FAQ SECTION (Matches JSON-LD FAQPage Schema) */}
      <section className="rounded-3xl bg-white border border-[#DFC89B] p-5 sm:p-7 space-y-4 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B0A0C] flex items-center gap-2">
          <HelpCircle size={21} className="text-[#8B2611]" />
          <span>{t('జన్మ సమయ శుద్ధి (BTR) — తరచుగా అడిగే ప్రశ్నలు', 'Birth Time Rectification — Frequently Asked Questions')}</span>
        </h2>

        <div className="divide-y divide-[#EFE4CE]">
          {BTR_FAQS.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                  className="w-full text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-extrabold text-sm sm:text-base text-[#1C1917]">
                    {language === 'en' ? item.qEn : item.qTe}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-[#8B2611] shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-[#78716C] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                    {language === 'en' ? item.aEn : item.aTe}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
