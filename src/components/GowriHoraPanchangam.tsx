import React, { useState, useMemo } from 'react';
import { Sun, Moon, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface GowriHoraPanchangamProps {
  day: DayData;
}

type GowriNameKey = 'udvegam' | 'charam' | 'labham' | 'amrutham' | 'kalam' | 'shubham' | 'rogam' | 'dhanam';

interface GowriMeta {
  key: GowriNameKey;
  te: string;
  en: string;
  quality: 'good' | 'bad' | 'neutral';
  verdictTe: string;
  verdictEn: string;
  suitableTe: string;
  suitableEn: string;
}

const GOWRI_META: Record<GowriNameKey, GowriMeta> = {
  amrutham: {
    key: 'amrutham',
    te: 'అమృతం',
    en: 'Amrutham',
    quality: 'good',
    verdictTe: 'పరమ శుభం (Best)',
    verdictEn: 'Supreme Auspicious',
    suitableTe: 'నూతన వ్యాపార ప్రారంభం, ఆభరణాల కొనుగోలు, వివాహ చర్చలు, పూజాది కార్యక్రమాలు',
    suitableEn: 'New ventures, buying gold, marriage talks, sacred rituals',
  },
  shubham: {
    key: 'shubham',
    te: 'శుభం',
    en: 'Shubham',
    quality: 'good',
    verdictTe: 'శుభప్రదం (Auspicious)',
    verdictEn: 'Auspicious',
    suitableTe: 'శుభ కార్యాలు, విద్యారంభం, రిజిస్ట్రేషన్లు, గృహ సంబంధిత పనులు',
    suitableEn: 'Auspicious ceremonies, education, property registration',
  },
  labham: {
    key: 'labham',
    te: 'లాభం',
    en: 'Labham',
    quality: 'good',
    verdictTe: 'ధన లాభం (Gainful)',
    verdictEn: 'Financial Gain',
    suitableTe: 'పెట్టుబడులు, వ్యాపార ఒప్పందాలు, బ్యాంకింగ్, నూతన వస్తు కొనుగోలు',
    suitableEn: 'Investments, business contracts, banking, shopping',
  },
  dhanam: {
    key: 'dhanam',
    te: 'ధనం',
    en: 'Dhanam',
    quality: 'good',
    verdictTe: 'ఐశ్వర్యప్రదం (Prosperous)',
    verdictEn: 'Prosperity',
    suitableTe: 'ధన లావాదేవీలు, వసూళ్లు, ఆర్థిక ప్రణాళికలు, బంగారం కొనుగోలు',
    suitableEn: 'Financial transactions, wealth planning, gold purchase',
  },
  charam: {
    key: 'charam',
    te: 'చరం',
    en: 'Charam',
    quality: 'good',
    verdictTe: 'మధ్యమ శుభం (Good for Travel)',
    verdictEn: 'Good for Mobility',
    suitableTe: 'ప్రయాణాలు, వాహన కొనుగోలు, స్థల మార్పిడి, మార్కెటింగ్ పనులు',
    suitableEn: 'Travel, vehicle purchase, logistics, field work',
  },
  udvegam: {
    key: 'udvegam',
    te: 'ఉద్వేగం',
    en: 'Udvegam',
    quality: 'bad',
    verdictTe: 'అశుభం — ఆందోళన (Avoid)',
    verdictEn: 'Avoid New Starts',
    suitableTe: 'నూతన పనులు వాయిదా వేయాలి; ప్రభుత్వ సంబంధిత సాధారణ పనులు మాత్రమే చేయవచ్చు',
    suitableTeEn: 'Postpone new beginnings; routine administrative tasks only',
    suitableEn: 'Postpone new beginnings; routine tasks only',
  } as unknown as GowriMeta,
  kalam: {
    key: 'kalam',
    te: 'కాలం',
    en: 'Kalam',
    quality: 'bad',
    verdictTe: 'అశుభం — విఘ్నాలు (Inauspicious)',
    verdictEn: 'Inauspicious',
    suitableTe: 'శుభకార్యాలు, ప్రయాణాలు, ఆర్థిక లావాదేవీలు నిషిద్ధం. దైవ ధ్యానం ఉత్తమం',
    suitableEn: 'Avoid auspicious works and financial agreements; chant mantras',
  },
  rogam: {
    key: 'rogam',
    te: 'రోగం',
    en: 'Rogam',
    quality: 'bad',
    verdictTe: 'అశుభం — పీడ (Inauspicious)',
    verdictEn: 'Inauspicious',
    suitableTe: 'కొత్త పనులు ప్రారంభించరాదు; వైద్య సంప్రదింపులు, విశ్రాంతికి మాత్రమే పరిమితం',
    suitableEn: 'Do not start new ventures; suitable only for rest or medical checkups',
  },
};

// Traditional Telugu Siddhantha 8-part Day & Night Gowri Panchangam order per weekday (0=Sun..6=Sat)
const DAY_GOWRI_ORDER: Record<number, GowriNameKey[]> = {
  0: ['udvegam', 'charam', 'labham', 'amrutham', 'kalam', 'shubham', 'rogam', 'dhanam'], // ఆదివారం
  1: ['amrutham', 'kalam', 'shubham', 'rogam', 'udvegam', 'charam', 'labham', 'dhanam'], // సోమవారం
  2: ['rogam', 'udvegam', 'charam', 'labham', 'amrutham', 'kalam', 'shubham', 'dhanam'], // మంగళవారం
  3: ['labham', 'amrutham', 'kalam', 'shubham', 'rogam', 'udvegam', 'charam', 'dhanam'], // బుధవారం
  4: ['shubham', 'rogam', 'udvegam', 'charam', 'labham', 'amrutham', 'kalam', 'dhanam'], // గురువారం
  5: ['charam', 'labham', 'amrutham', 'kalam', 'shubham', 'rogam', 'udvegam', 'dhanam'], // శుక్రవారం
  6: ['kalam', 'shubham', 'rogam', 'udvegam', 'charam', 'labham', 'amrutham', 'dhanam'], // శనివారం
};

const NIGHT_GOWRI_ORDER: Record<number, GowriNameKey[]> = {
  0: ['shubham', 'amrutham', 'charam', 'rogam', 'kalam', 'labham', 'udvegam', 'dhanam'],
  1: ['charam', 'rogam', 'kalam', 'labham', 'udvegam', 'shubham', 'amrutham', 'dhanam'],
  2: ['kalam', 'labham', 'udvegam', 'shubham', 'amrutham', 'charam', 'rogam', 'dhanam'],
  3: ['udvegam', 'shubham', 'amrutham', 'charam', 'rogam', 'kalam', 'labham', 'dhanam'],
  4: ['amrutham', 'charam', 'rogam', 'kalam', 'labham', 'udvegam', 'shubham', 'dhanam'],
  5: ['rogam', 'kalam', 'labham', 'udvegam', 'shubham', 'amrutham', 'charam', 'dhanam'],
  6: ['labham', 'udvegam', 'shubham', 'amrutham', 'charam', 'rogam', 'kalam', 'dhanam'],
};

const DAY_TIME_SLOTS = [
  { startMin: 360, endMin: 450, label: '06:00 AM – 07:30 AM' },
  { startMin: 450, endMin: 540, label: '07:30 AM – 09:00 AM' },
  { startMin: 540, endMin: 630, label: '09:00 AM – 10:30 AM' },
  { startMin: 630, endMin: 720, label: '10:30 AM – 12:00 PM' },
  { startMin: 720, endMin: 810, label: '12:00 PM – 01:30 PM' },
  { startMin: 810, endMin: 900, label: '01:30 PM – 03:00 PM' },
  { startMin: 900, endMin: 990, label: '03:00 PM – 04:30 PM' },
  { startMin: 990, endMin: 1080, label: '04:30 PM – 06:00 PM' },
];

const NIGHT_TIME_SLOTS = [
  { startMin: 1080, endMin: 1170, label: '06:00 PM – 07:30 PM' },
  { startMin: 1170, endMin: 1260, label: '07:30 PM – 09:00 PM' },
  { startMin: 1260, endMin: 1350, label: '09:00 PM – 10:30 PM' },
  { startMin: 1350, endMin: 1440, label: '10:30 PM – 12:00 AM' },
  { startMin: 0, endMin: 90, label: '12:00 AM – 01:30 AM' },
  { startMin: 90, endMin: 180, label: '01:30 AM – 03:00 AM' },
  { startMin: 180, endMin: 270, label: '03:00 AM – 04:30 AM' },
  { startMin: 270, endMin: 360, label: '04:30 AM – 06:00 AM' },
];

// Chaldean/Vedic Hora sequence: Sun -> Venus -> Mercury -> Moon -> Saturn -> Jupiter -> Mars
type PlanetKey = 'surya' | 'shukra' | 'budha' | 'chandra' | 'shani' | 'guru' | 'kuja';

interface HoraPlanetInfo {
  key: PlanetKey;
  nameTe: string;
  nameEn: string;
  quality: 'good' | 'neutral' | 'caution';
  effectTe: string;
  effectEn: string;
}

const HORA_SEQUENCE: HoraPlanetInfo[] = [
  {
    key: 'surya',
    nameTe: 'సూర్య హోర (Sun)',
    nameEn: 'Surya Hora (Sun)',
    quality: 'neutral',
    effectTe: 'ప్రభుత్వ పనులు, అధికారులను కలవడం, రాజకీయ చర్చలు, దరఖాస్తులకు అనుకూలం',
    effectEn: 'Government work, meeting officials, leadership initiatives',
  },
  {
    key: 'shukra',
    nameTe: 'శుక్ర హోర (Venus)',
    nameEn: 'Shukra Hora (Venus)',
    quality: 'good',
    effectTe: 'వివాహ చర్చలు, బంగారం/వస్త్రాలు/వాహన కొనుగోలు, ప్రయాణాలు, శుభకార్యాలకు పరమ శుభం',
    effectEn: 'Best for marriage talks, buying jewelry/vehicles, travel, arts',
  },
  {
    key: 'budha',
    nameTe: 'బుధ హోర (Mercury)',
    nameEn: 'Budha Hora (Mercury)',
    quality: 'good',
    effectTe: 'విద్యారంభం, వ్యాపార ఒప్పందాలు, అకౌంట్స్, సాఫ్ట్‌వేర్, రిజిస్ట్రేషన్లకు శుభప్రదం',
    effectEn: 'Auspicious for education, trade contracts, accounts, agreements',
  },
  {
    key: 'chandra',
    nameTe: 'చంద్ర హోర (Moon)',
    nameEn: 'Chandra Hora (Moon)',
    quality: 'good',
    effectTe: 'ప్రయాణాలు, ఆహార/జల సంబంధిత వ్యాపారాలు, కుటుంబ శుభకార్యాలకు అనుకూలం',
    effectEn: 'Favorable for travel, hospitality, family harmony, fast tasks',
  },
  {
    key: 'shani',
    nameTe: 'శని హోర (Saturn)',
    nameEn: 'Shani Hora (Saturn)',
    quality: 'caution',
    effectTe: 'నూతన శుభకార్యాలు వాయిదా వేయాలి; భూమి, ఇనుము, యంత్రాల పనులకు మాత్రమే అనుకూలం',
    effectEn: 'Avoid auspicious starts; suitable for machinery, land, or labor work',
  },
  {
    key: 'guru',
    nameTe: 'గురు హోర (Jupiter)',
    nameEn: 'Guru Hora (Jupiter)',
    quality: 'good',
    effectTe: 'సర్వ శుభకార్యాలకు శ్రేష్ఠం — వివాహం, గృహప్రవేశం, ధన నిల్వ, పూజలు, బ్యాంక్ పనులు',
    effectEn: 'Supreme for all auspicious events, banking, ceremonies, education',
  },
  {
    key: 'kuja',
    nameTe: 'కుజ హోర (Mars)',
    nameEn: 'Kuja Hora (Mars)',
    quality: 'caution',
    effectTe: 'శుభకార్యాలకు నిషిద్ధం; భూ వివాద పరిష్కారం, క్రీడలు, సాహస కార్యాలు చేయవచ్చు',
    effectEn: 'Avoid peaceful starts; suited for athletics, engineering, land checks',
  },
];

// Starting index in HORA_SEQUENCE for each weekday (0=Sun..6=Sat)
const WEEKDAY_START_HORA_INDEX: Record<number, number> = {
  0: 0, // ఆదివారం -> సూర్య హోర
  1: 3, // సోమవారం -> చంద్ర హోర
  2: 6, // మంగళవారం -> కుజ హోర
  3: 2, // బుధవారం -> బుధ హోర
  4: 5, // గురువారం -> గురు హోర
  5: 1, // శుక్రవారం -> శుక్ర హోర
  6: 4, // శనివారం -> శని హోర
};

function getWeekdayNumber(day: DayData): number {
  const [y, m, d] = day.isoDate.split('-').map(Number);
  if (y && m && d) {
    return new Date(y, m - 1, d).getDay();
  }
  if (day.label.includes('ఆది')) return 0;
  if (day.label.includes('సోమ')) return 1;
  if (day.label.includes('మంగళ')) return 2;
  if (day.label.includes('బుధ')) return 3;
  if (day.label.includes('గురు')) return 4;
  if (day.label.includes('శుక్ర')) return 5;
  return 6;
}

function formatHourSlot(hourOffsetFrom6AM: number): { label: string; startMin: number; endMin: number } {
  const startH = (6 + hourOffsetFrom6AM) % 24;
  const endH = (startH + 1) % 24;
  const fmt = (h: number) => {
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, '0')}:00 ${suffix}`;
  };
  return {
    label: `${fmt(startH)} – ${fmt(endH)}`,
    startMin: startH * 60,
    endMin: startH * 60 + 60,
  };
}

export const GowriHoraPanchangam: React.FC<GowriHoraPanchangamProps> = ({ day }) => {
  const { t, tr } = useLanguage();
  const [gowriPeriod, setGowriPeriod] = useState<'day' | 'night'>('day');
  const [horaFilter, setHoraFilter] = useState<'all' | 'shubha'>('all');

  const weekdayIndex = useMemo(() => getWeekdayNumber(day), [day]);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayGowriRows = useMemo(() => {
    const keys = DAY_GOWRI_ORDER[weekdayIndex] || DAY_GOWRI_ORDER[0];
    return DAY_TIME_SLOTS.map((slot, idx) => ({
      ...slot,
      meta: GOWRI_META[keys[idx]],
      isActive: currentMinutes >= slot.startMin && currentMinutes < slot.endMin,
    }));
  }, [weekdayIndex, currentMinutes]);

  const nightGowriRows = useMemo(() => {
    const keys = NIGHT_GOWRI_ORDER[weekdayIndex] || NIGHT_GOWRI_ORDER[0];
    return NIGHT_TIME_SLOTS.map((slot, idx) => ({
      ...slot,
      meta: GOWRI_META[keys[idx]],
      isActive: currentMinutes >= slot.startMin && currentMinutes < slot.endMin,
    }));
  }, [weekdayIndex, currentMinutes]);

  const horaRows = useMemo(() => {
    const startIdx = WEEKDAY_START_HORA_INDEX[weekdayIndex] ?? 0;
    return Array.from({ length: 24 }, (_, i) => {
      const planet = HORA_SEQUENCE[(startIdx + i) % 7];
      const slot = formatHourSlot(i);
      const isActive = currentMinutes >= slot.startMin && currentMinutes < slot.endMin;
      return {
        index: i + 1,
        ...slot,
        planet,
        isActive,
        isDayHora: i < 12,
      };
    });
  }, [weekdayIndex, currentMinutes]);

  const activeGowri = [...dayGowriRows, ...nightGowriRows].find((r) => r.isActive) || dayGowriRows[0];
  const activeHora = horaRows.find((r) => r.isActive) || horaRows[0];

  const displayedGowriRows = gowriPeriod === 'day' ? dayGowriRows : nightGowriRows;
  const displayedHoras = horaFilter === 'shubha' ? horaRows.filter((h) => h.planet.quality === 'good') : horaRows;

  return (
    <div className="space-y-8 font-telugu">
      {/* Live Current Gowri & Hora Status Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/60 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-1">
              {t('దృక్సిద్ధాంత కాల విభాగం • Gowri Panchangam & Planetary Hora', 'Vedic Time Division • Gowri Panchangam & Hora')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {tr(day.label)} {t('గౌరీ పంచాంగం & హోరా చక్రం', 'Gowri Panchangam & Hora Chakram')}
            </h2>
            <p className="text-sm text-amber-200/90 mt-1">
              {tr(day.teediVaram)} · {t('సూర్యోదయం 06:00 AM ప్రామాణిక గణన', 'Standard 06:00 AM Sunrise Calculation')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5 shrink-0">
            <div className="bg-amber-950/90 border border-amber-600/60 rounded-2xl p-4">
              <span className="text-xs text-amber-300 block mb-0.5">
                {t('ప్రస్తుత గౌరీ కాలం (Current Gowri)', 'Current Gowri Period')}
              </span>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>{t(activeGowri.meta.te, activeGowri.meta.en)}</span>
                <span className="text-xs font-normal text-amber-300">·</span>
                <span
                  className={`text-xs font-bold ${
                    activeGowri.meta.quality === 'good' ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {t(activeGowri.meta.verdictTe, activeGowri.meta.verdictEn)}
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums text-amber-200/80 block mt-1">
                {activeGowri.label}
              </span>
            </div>

            <div className="bg-amber-950/90 border border-amber-600/60 rounded-2xl p-4">
              <span className="text-xs text-amber-300 block mb-0.5">
                {t('ప్రస్తుత గ్రహ హోర (Current Hora)', 'Current Planetary Hora')}
              </span>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>{t(activeHora.planet.nameTe, activeHora.planet.nameEn)}</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-amber-200/80 block mt-1">
                {activeHora.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: GOWRI PANCHANGAM (8 DAY + 8 NIGHT SLOTS) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-100">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
              {t('1. నేటి గౌరీ పంచాంగం (అష్ట కాల విభాగాలు)', '1. Daily Gowri Panchangam (8 Time Slots)')}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {t(
                'అమృతం, శుభం, లాభం, ధనం, చరం కాలాలు శుభకార్యాలకు అత్యంత అనుకూలం.',
                'Amrutham, Shubham, Labham, Dhanam, and Charam are auspicious for starting important tasks.'
              )}
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="inline-flex items-center gap-1 p-1 bg-amber-100/80 rounded-xl border border-amber-200 self-start">
            <button
              type="button"
              onClick={() => setGowriPeriod('day')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                gowriPeriod === 'day'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <Sun size={15} />
              <span>{t('పగటి గౌరీ పంచాంగం (Day)', 'Day Gowri (6AM–6PM)')}</span>
            </button>
            <button
              type="button"
              onClick={() => setGowriPeriod('night')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                gowriPeriod === 'night'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <Moon size={15} />
              <span>{t('రాత్రి గౌరీ పంచాంగం (Night)', 'Night Gowri (6PM–6AM)')}</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {displayedGowriRows.map((row, idx) => {
            const isGood = row.meta.quality === 'good';
            return (
              <div
                key={row.label}
                className={`rounded-2xl p-4 border transition-colors ${
                  row.isActive
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50'
                    : isGood
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : 'bg-rose-50/40 border-rose-200/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-mono tabular-nums font-semibold text-slate-700">
                    0{idx + 1}. {row.label}
                  </span>
                  {row.isActive && (
                    <span className="text-amber-800 font-bold">
                      {t('ప్రస్తుత కాలం', 'Active Now')}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-lg font-bold text-slate-900">
                    {t(row.meta.te, row.meta.en)}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      isGood ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {isGood ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    <span>{t(row.meta.verdictTe, row.meta.verdictEn)}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(row.meta.suitableTe, row.meta.suitableEn)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: 24 PLANETARY HORA CHAKRAM */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-100">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
              {t('2. 24 గంటల నవగ్రహ హోరా చక్రం (Planetary Hora Timings)', '2. 24-Hour Planetary Hora Chakram')}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {t(
                'గురు, శుక్ర, బుధ, చంద్ర హోరలు శుభకార్యాలు, ఆర్థిక లావాదేవీలు మరియు ప్రయాణాలకు అత్యుత్తమం.',
                'Jupiter (Guru), Venus (Shukra), Mercury (Budha), and Moon (Chandra) Horas are ideal for auspicious works.'
              )}
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-amber-100/80 rounded-xl border border-amber-200 self-start">
            <button
              type="button"
              onClick={() => setHoraFilter('all')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                horaFilter === 'all'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              {t('మొత్తం 24 హోరలు (All 24)', 'All 24 Horas')}
            </button>
            <button
              type="button"
              onClick={() => setHoraFilter('shubha')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                horaFilter === 'shubha'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <Sparkles size={14} />
              <span>{t('శుభ హోరలు మాత్రమే (Auspicious Only)', 'Auspicious Horas Only')}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-amber-200 text-xs uppercase tracking-wider text-amber-900 bg-amber-50/70">
                <th className="py-3 px-4 font-bold">{t('సమయం (Time Slot)', 'Time Slot')}</th>
                <th className="py-3 px-4 font-bold">{t('గ్రహ హోర (Planet Hora)', 'Planetary Hora')}</th>
                <th className="py-3 px-4 font-bold">{t('ఫలితం (Status)', 'Quality')}</th>
                <th className="py-3 px-4 font-bold">{t('చేయదగిన పనులు (Recommended Activities)', 'Recommended Activities')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-sm">
              {displayedHoras.map((row) => {
                const isGood = row.planet.quality === 'good';
                const isCaution = row.planet.quality === 'caution';
                return (
                  <tr
                    key={row.index}
                    className={
                      row.isActive
                        ? 'bg-amber-100/70 font-semibold'
                        : 'hover:bg-amber-50/40 transition-colors'
                    }
                  >
                    <td className="py-3.5 px-4 font-mono tabular-nums text-xs sm:text-sm text-slate-800 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} className="text-amber-700 shrink-0" />
                        <span>{row.label}</span>
                      </span>
                      {row.isActive && (
                        <span className="ml-2 text-xs font-bold text-amber-900">
                          · {t('ప్రస్తుతం', 'Now')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-950 whitespace-nowrap">
                      {t(row.planet.nameTe, row.planet.nameEn)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold ${
                          isGood
                            ? 'text-emerald-800'
                            : isCaution
                            ? 'text-rose-800'
                            : 'text-amber-800'
                        }`}
                      >
                        {isGood ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>{t('శుభ హోర', 'Auspicious')}</span>
                          </>
                        ) : isCaution ? (
                          <>
                            <AlertTriangle size={14} />
                            <span>{t('జాగ్రత్త / సాధారణం', 'Avoid New Starts')}</span>
                          </>
                        ) : (
                          <span>{t('మధ్యమం', 'Moderate')}</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-700">
                      {t(row.planet.effectTe, row.planet.effectEn)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
