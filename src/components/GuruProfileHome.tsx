import React from 'react';
import {
  Phone,
  MessageCircle,
  Award,
  BookOpen,
  Flame,
  Home,
  Users,
  Star,
  CheckCircle2,
  Compass,
  ArrowRight,
  MapPin,
  Sun,
  Download,
  ShieldAlert,
  Bell,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DayData, PoojaService } from '../types/panchangam';
import { POOJA_SERVICES } from '../data/panchangamData';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { VirupakshaGatewayScene, GopuramSectionHeader } from './VirupakshaGopuramArt';
import { playTempleBell } from '../utils/audioChime';
import {
  NATURAL_80_WORD_HOMEPAGE_INTRO_TE,
  addDaysIso,
  computeCityLocalPanchangam,
  getTodayIsoDateIST,
} from '../seo/panchangamSsrEngine';
import { DailySubhashithamCard } from './DailySubhashithamCard';
import { DevoteeReviewsSection } from './DevoteeReviewsSection';

export interface GuruProfileHomeProps {
  currentDay: DayData;
  onNavigateToPanchangam: (isoDate?: string) => void;
  onNavigateToRashiPhalalu?: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToCityPanchangam?: (citySlug: 'hyderabad' | 'vijayawada' | 'visakhapatnam' | 'usa') => void;
  onNavigateToJathakam?: () => void;
  onNavigateToAwards?: () => void;
  onNavigateToArticle?: (slug: string) => void;
  onOpenBooking: (service?: PoojaService) => void;
  onSelectCity?: (citySlug: string) => void;
}

export const GuruProfileHome: React.FC<GuruProfileHomeProps> = ({
  currentDay,
  onNavigateToPanchangam,
  onNavigateToRashiPhalalu,
  onNavigateToCalendar,
  onNavigateToCityPanchangam,
  onNavigateToJathakam,
  onNavigateToArticle,
  onOpenBooking,
}) => {
  const { t, tr } = useLanguage();

  const todayIso = currentDay.isoDate || getTodayIsoDateIST();
  const prevIso = addDaysIso(todayIso, -1);
  const nextIso = addDaysIso(todayIso, 1);
  const hydPanchangam = computeCityLocalPanchangam(todayIso, 'hyderabad');

  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నేను పూజా కార్యక్రమం / సమగ్ర బృహత్ జాతక నివేదిక PDF / ముహూర్తం కొరకు సంప్రదిస్తున్నాను.'
  )}`;

  const cityCards = (['hyderabad', 'vijayawada', 'visakhapatnam', 'usa'] as const).map((slug) =>
    computeCityLocalPanchangam(todayIso, slug)
  );

  const achievements = [
    {
      icon: Award,
      title: t('15+ ఏళ్ల వేద సంప్రదాయం', '15+ Years of Vedic Heritage'),
      desc: t(
        'స్మార్త వైదిక శాస్త్రాలలో నిష్ణాతులు & గురుపరంపర జ్యోతిష్య విద్వాంసులు.',
        'Excellence in Smartha Vedic treatises and authentic Guru Parampara.'
      ),
    },
    {
      icon: Users,
      title: t('5,000+ కుటుంబాల విశ్వాసం', '5,000+ Devotee Families'),
      desc: t(
        'తెలుగు రాష్ట్రాలు మరియు విదేశాలలో భక్తుల ఆదరణ.',
        'Trusted guidance across Andhra Pradesh, Telangana, and global NRI communities.'
      ),
    },
    {
      icon: Flame,
      title: t('మహా హోమ క్రతు ప్రవీణులు', 'Vedic Homam Practitioner'),
      desc: t(
        'చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర హోమాల నిర్వహణ.',
        'Practitioner of Chandi, Lakshmi Ganapathi, Sudarshana, and Rudra homams.'
      ),
    },
    {
      icon: Compass,
      title: t('సిద్ధ ముహూర్త నిర్ణయం', 'Siddha Muhurtham Calculation'),
      desc: t(
        'లగ్న శుద్ధితో వివాహం, గృహప్రవేశాలకు శాస్త్రోక్త ముహూర్త నిర్ణయం.',
        'Astrological precision for marriage and housewarming with lagna purity.'
      ),
    },
  ];

  const coreServices = [
    {
      id: 'vivaha-muhurtham',
      title: t('వివాహ & గృహప్రవేశ ముహూర్త నిర్ణయం', 'Marriage & Gruhapravesham Muhurtham'),
      desc: t(
        'దంపతుల జన్మ నక్షత్రాలు, లగ్న శుద్ధి మరియు గురు-శుక్ర బలాలను పరిశీలించి అన్యోన్య దాంపత్యం, గృహ శాంతిని ప్రసాదించే అమృత ముహూర్తాల నిర్ణయం.',
        'Determining auspicious muhurtham by examining birth constellations, lagna purity, and planetary strengths for harmonious marriage and lasting household peace.'
      ),
      icon: Home,
      highlight: t('ముహూర్త విభాగం', 'Muhurtham Desk'),
    },
    {
      id: 'chandi-homam',
      title: t('శ్రీ చండీ & లక్ష్మీ గణపతి మహా హోమం', 'Sri Chandi & Lakshmi Ganapathi Maha Homam'),
      desc: t(
        'శత్రు బాధలు, నరదృష్టి, ఆర్థిక సంక్షోభాలు తొలగి అష్టైశ్వర్యాలు సిద్ధించేలా శాస్త్రోక్తంగా స్వయంగా మంత్రోచ్ఛారణతో హోమ క్రతువు నిర్వహణ.',
        'Vedic fire rituals conducted with authentic mantra chanting to remove negative energies, financial obstacles, and bestow peace and prosperity.'
      ),
      icon: Flame,
      highlight: t('వైదిక హోమ క్రతువులు', 'Sacred Fire Rituals'),
    },
    {
      id: 'jathaka-parisheelana',
      title: t('జాతక విశ్లేషణ & దోష నివారణ', 'Horoscope Analysis & Remedies'),
      desc: t(
        'జన్మ కుండలి, రాశి చక్రం, దశ-అంతర్దశల సమగ్ర గణనతో ఉద్యోగం, విద్య, వివాహం, సంతాన ప్రాప్తి కోసం సరళమైన వేద పరిహారాల మార్గదర్శనం.',
        'In-depth horoscope reading covering birth chart, Mahadasha, and remedial solutions for career, marriage, education, and health.'
      ),
      icon: BookOpen,
      highlight: t('దృక్సిద్ధాంత ఖగోళ గణితం', 'Drik Siddhanta Precision'),
    },
  ];



  return (
    <div className="space-y-12 font-telugu max-w-6xl mx-auto">
      {/* ============================================================== */}
      {/* 1. HERO SHOWCASE: VIRUPAKSHA GATEWAY & GURUJI HERO PORTRAIT     */}
      {/*    (Uses H2 for Guruji's name so Homepage strictly keeps ONE H1) */}
      {/* ============================================================== */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500 bg-[#2b0902] text-white">
        <div className="relative w-full h-52 sm:h-68 lg:h-76 overflow-hidden border-b-2 border-amber-400/60">
          <VirupakshaGatewayScene className="w-full h-full object-cover" />

          <button
            type="button"
            onClick={() => playTempleBell()}
            title={t('ఆలయ గంటను మోగించండి (Ring Sacred Temple Bell)', 'Ring Sacred Temple Bell')}
            className="absolute top-3 right-3 sm:top-4 sm:right-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/85 hover:bg-amber-900 text-amber-200 border border-amber-400/70 text-xs font-bold shadow-lg backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
          >
            <Bell size={14} className="text-amber-300 animate-bounce" />
            <span>{t('ఆలయ గంట', 'Ring Bell')}</span>
          </button>

          <div className="absolute top-3 left-3 sm:left-5 z-20 hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/50 text-[11px] text-amber-200 font-semibold backdrop-blur-xs">
            <OmEmblem className="w-4 h-4 text-amber-300 shrink-0" size={16} />
            <span>శ్రీ విరూపాక్ష &amp; శ్రీలక్ష్మి గణపతి ఆశీస్సులతో • సనాతన దృక్సిద్ధాంత జ్యోతిషాలయం</span>
          </div>
        </div>

        <div className="relative px-6 pb-8 pt-4 sm:px-10 sm:pb-10 sm:pt-6 bg-gradient-to-b from-[#2b0902] via-[#3a0e03] to-[#230701]">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 -mt-16 sm:-mt-20 relative z-20">
            <div className="shrink-0 text-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 shadow-2xl mx-auto ring-4 ring-[#2b0902]">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-100 bg-amber-950">
                  <img
                    src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                    alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (Jallavaram Sai Dheeraj Sharma)"
                    width={160}
                    height={160}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-cover object-top block"
                  />
                </div>
              </div>
              <span className="inline-block mt-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-amber-950 font-extrabold text-[11px] sm:text-xs px-3.5 py-1 rounded-full shadow-md border border-amber-200">
                {t('స్మార్త వైదిక & జ్యోతిష్య విద్వాంసులు', 'Smartha Veda & Jyothisha Vidwan')}
              </span>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2.5 pt-2 md:pt-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/80 border border-amber-400/50 text-amber-200 text-xs font-medium">
                <OmEmblem className="w-4 h-4 text-amber-300 shrink-0" size={16} />
                <span>
                  {t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • హైదరాబాద్', 'Sri Lakshmi Ganapathi Jyothishalayam • Hyderabad')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 leading-tight">
                {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Brahmasri Jallavaram Sai Dheeraj Sharma')}
              </h2>

              <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {t(
                  'సనాతన గురుకుల వేద సంప్రదాయంలో శిక్షణ పొంది, దృక్సిద్ధాంత ఖగోళ గణితం ఆధారంగా జాతక పరిశీలన, 36 గుణాల వివాహ పొంతన, సమగ్ర బృహత్ జాతక కుండలి నివేదిక PDF మరియు సమగ్ర హోమ క్రతువులను శాస్త్రోక్తంగా నిర్వహించే వైదిక పండితులు.',
                  'Vedic scholar and astrologer practicing Drik-Siddhanta astrology, comprehensive Brihat Jataka Kundali Grantham PDF generation, muhurtham determination, and sacred Maha Homams.'
                )}
              </p>

              <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageCircle size={16} />
                  <span>{t('వాట్సాప్‌లో సంప్రదించండి', 'Chat on WhatsApp')}</span>
                </a>

                <a
                  href="tel:+918977986166"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
                >
                  <Phone size={15} />
                  <span>+91 89779 86166</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PRIMARY SEO SECTION: SINGLE H1 "నేటి పంచాంగం (Today Telugu Panchangam)" */}
      {/*    + Natural 80-Word Intro + Complete Server-Rendered Almanac  */}
      {/* ============================================================== */}
      <section
        aria-label="నేటి పంచాంగం (Today Telugu Panchangam)"
        className="bg-gradient-to-r from-[#fff8ec] via-amber-50/95 to-[#fff8ec] rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-lg space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 border-b border-amber-200 pb-5">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-900 text-amber-100 text-xs font-extrabold tracking-wide shadow-2xs">
              <Sun size={14} className="text-amber-300" />
              <span>{tr(currentDay.teediVaram)} • దృక్సిద్ధాంత పంచాంగం ({todayIso})</span>
            </div>

            {/* STRICTLY ONE H1 ON THE HOMEPAGE */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-950 tracking-tight leading-tight">
              నేటి పంచాంగం (Today Telugu Panchangam)
            </h1>

            <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
              {NATURAL_80_WORD_HOMEPAGE_INTRO_TE}
            </p>
          </div>

          {/* Prev / Next / Calendar Links */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={`/panchangam/${prevIso}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToPanchangam(prevIso);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-colors"
            >
              <ChevronLeft size={14} />
              <span>నిన్న ({prevIso})</span>
            </a>
            <a
              href={`/panchangam/${nextIso}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToPanchangam(nextIso);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-colors"
            >
              <span>రేపు ({nextIso})</span>
              <ChevronRight size={14} />
            </a>
            <a
              href="/panchangam/calendar"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateToCalendar) onNavigateToCalendar();
                else onNavigateToPanchangam();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold transition-colors"
            >
              <Calendar size={14} className="text-amber-300" />
              <span>60 రోజుల క్యాలెండర్</span>
            </a>
          </div>
        </div>

        {/* Core Panchangam Data Grid (Tithi, Nakshatra, Rahukalam, Varjyam, Abhijit) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              తిథి • Today Tithi
            </span>
            <strong className="text-base sm:text-lg font-extrabold text-amber-950 mt-1 block">
              {tr(currentDay.panchanga.tithi)}
            </strong>
            <span className="text-xs text-slate-600 mt-1 block">
              {tr(currentDay.panchanga.masam)}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              నక్షత్రం • Today Nakshatram
            </span>
            <strong className="text-base sm:text-lg font-extrabold text-orange-950 mt-1 block">
              {tr(currentDay.panchanga.nakshatram)}
            </strong>
            <span className="text-xs text-slate-600 mt-1 block">
              యోగం: {tr(currentDay.panchanga.yogam)} • కరణం: {tr(currentDay.panchanga.karanam)}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              సూర్యోదయం &amp; సూర్యాస్తమయం • Sunrise / Sunset
            </span>
            <strong className="text-base sm:text-lg font-extrabold text-amber-950 mt-1 block">
              {hydPanchangam.sunrise} – {hydPanchangam.sunset}
            </strong>
            <span className="text-xs text-slate-600 mt-1 block">
              {tr(currentDay.panchanga.samvatsaram)}
            </span>
          </div>

          <div className="bg-rose-50/90 rounded-2xl p-4 border-2 border-rose-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-rose-700" />
              <span>రాహుకాలం • Rahukalam (వర్జ్యం / Avoid)</span>
            </span>
            <strong className="text-base sm:text-lg font-extrabold text-rose-950 mt-1 block">
              {tr(currentDay.ashubha.rahukalam)}
            </strong>
            <span className="text-xs text-rose-800 mt-1 block">
              యమగండం: {tr(currentDay.ashubha.yamagandam)}
            </span>
          </div>

          <div className="bg-rose-50/90 rounded-2xl p-4 border-2 border-rose-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <Clock size={14} className="text-rose-700" />
              <span>వర్జ్యం • Varjyam (అశుభ సమయం)</span>
            </span>
            <strong className="text-base sm:text-lg font-extrabold text-rose-950 mt-1 block">
              {tr(currentDay.ashubha.varjyam)}
            </strong>
            <span className="text-xs text-rose-800 mt-1 block">
              దుర్ముహూర్తం: {tr(currentDay.ashubha.durmuhurtham)}
            </span>
          </div>

          <div className="bg-emerald-50/90 rounded-2xl p-4 border-2 border-emerald-300 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-700" />
              <span>అభిజిత్ ముహూర్తం &amp; అమృత ఘడియలు (శుభం)</span>
            </span>
            <strong className="text-base sm:text-lg font-extrabold text-emerald-950 mt-1 block">
              అభిజిత్: {tr(currentDay.shubha.abhijit)}
            </strong>
            <span className="text-xs text-emerald-900 font-semibold mt-1 block">
              అమృత ఘడియలు: {tr(currentDay.shubha.amrutha)}
            </span>
          </div>
        </div>

        {/* Visible Calculation Standard Line (E-E-A-T Requirement 7) */}
        <p className="text-xs font-mono text-amber-900/90">
          Calculation: Drik Siddhanta, Lahiri Chitrapaksha Ayanamsa (NASA JPL DE440 Ephemeris), location: Hyderabad (17.3850° N, 78.4867° E)
        </p>

        {/* Footer Strip of Almanac: City Links & Full Panchangam Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-amber-200/80">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1">
              <MapPin size={14} className="text-amber-700" />
              <span>నగర సమయాలు:</span>
            </span>
            {cityCards.map((c) => (
              <a
                key={c.city.slug}
                href={`/panchangam/${c.city.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToCityPanchangam) onNavigateToCityPanchangam(c.city.slug);
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold transition-colors"
              >
                {c.city.nameTe} ({c.sunrise})
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={`/panchangam/${todayIso}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToPanchangam(todayIso);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{t('నేటి సంపూర్ణ పంచాంగం', 'Full Daily Panchangam')}</span>
              <ArrowRight size={15} className="text-amber-300" />
            </a>
            <a
              href="/rashi-phalalu"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateToRashiPhalalu) onNavigateToRashiPhalalu();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-extrabold text-xs sm:text-sm shadow-md border border-amber-500 transition-all cursor-pointer"
            >
              <Sparkles size={15} className="text-amber-900" />
              <span>{t('నేటి 12 రాశుల ఫలితాలు', 'Today 12 Rashi Phalalu')}</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2B. DAILY SUBHASHITHA SLOKAM & MODERN LOUKIKA QUOTE CARD       */}
      {/* ============================================================== */}
      <DailySubhashithamCard isoDate={todayIso} />

      {/* ============================================================== */}
      {/* 3. PILLARS OF TRADITION (4 COMPACT CREDENTIAL CARDS)           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border-2 border-amber-200/90 shadow-xs hover:border-amber-400 transition-all flex items-start gap-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 4. 100-PAGE JANMA KUNDALI GRANTHAM BANNER                      */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen size={13} />
            <span>{t('పుట్టిన తేదీతో ఉచిత జన్మ కుండలి • Jathakam by Date of Birth in Telugu', 'Free Janma Kundali & Brihat Jataka Grantham')}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-amber-100">
            {t('మీ పుట్టిన తేదీ, సమయంతో ఉచిత తెలుగు జన్మ కుండలి & సమగ్ర బృహత్ జాతక నివేదిక PDF పొందండి', 'Get Your Free Telugu Janma Kundali & Comprehensive Brihat Jataka PDF Report')}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl">
            {t(
              'పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా దృక్సిద్ధాంత రాశి చక్రం (D1), నవాంశ (D9), 12 స్థానాల విశ్లేషణ, 120 ఏళ్ల వింశోత్తరి మహాదశ, భృగు చక్ర 96 ఏళ్ల కాలగమనం మరియు అదృష్ట రత్న పరిహారాలు పొందండి.',
              'Generate an authentic Telugu Kundali with D1 Rashi, D9 Navamsha, 12 Bhava synthesis, 120-year Mahadasha timeline, Bhrigu progression, and gemstone remedies.'
            )}
          </p>
        </div>

        <a
          href="/janma-kundali"
          onClick={(e) => {
            if (onNavigateToJathakam) {
              e.preventDefault();
              onNavigateToJathakam();
            }
          }}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-extrabold text-sm shadow-lg transition-all cursor-pointer shrink-0 inline-flex items-center gap-2"
        >
          <Download size={17} />
          <span>{t('ఉచిత కుండలి నివేదిక పొందండి', 'Generate Kundali Now')}</span>
        </a>
      </div>
      {/* ============================================================== */}
      {/* 5. FEATURED VEDIC ARTICLES & SHASTRA TREATISES (EDITORIAL)     */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              <BookOpen size={13} />
              {t('జ్యోతిష విజ్ఞాన వ్యాసాలు • Classical Research Library', 'Classical Vedic Shastra Articles')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-telugu mt-2">
              {t('ప్రాచీన వేద జ్యోతిష వ్యాసాలు & శాస్త్ర గ్రంథాలు', 'Featured Classical Vedic Astrology Treatises')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {t(
                'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే ప్రామాణిక గ్రంథాల ఆధారంగా రచించబడిన విశిష్ట పరిశోధనాత్మక వ్యాసాలు.',
                'Scholarly, authentic Vedic research treatises and scriptural guidelines written by Brahmasri Jallavaram Sai Dheeraj Sharma.'
              )}
            </p>
          </div>

          <a
            href="/vedic-articles"
            onClick={(e) => {
              e.preventDefault();
              try {
                window.history.pushState({ tab: 'vyasalu', vedicArticles: true }, '', '/vedic-articles');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } catch {}
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>{t('అన్ని వ్యాసాలు (14+) →', 'View All Articles (14+) →')}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Article Card 1 */}
          <article className="bg-white rounded-2xl border-2 border-amber-200/90 hover:border-amber-400 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300">స్వరోదయం</span>
                <span className="flex items-center gap-1 text-slate-500"><Clock size={12} /> 18 నిమిషాలు</span>
              </div>
              <h3 className="text-base font-bold text-amber-950 group-hover:text-amber-800 transition line-clamp-2">
                స్వరోదయ శాస్త్రం – శ్వాస నాడీ విజ్ఞానం, పంచభూత తత్త్వాలు &amp; నిత్య విజయ రహస్యాలు
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                ఇడా (చంద్ర), పింగళ (సూర్య), సుషుమ్నా నాడీ గమనం, పంచభూత తత్త్వాలు మరియు ప్రతి పనిలోనూ నిశ్చయ విజయం సాధించే ప్రాతఃకాల శ్వాస పరీక్షా విధి.
              </p>
            </div>
            <a
              href="/swarodaya-shastra"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateToArticle) onNavigateToArticle('swarodaya-shastra');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 group-hover:text-amber-700 cursor-pointer pt-3 border-t border-amber-100"
            >
              <span>పూర్తి వ్యాసం చదవండి</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </article>

          {/* Article Card 2 */}
          <article className="bg-white rounded-2xl border-2 border-amber-200/90 hover:border-amber-400 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300">దోష పరిహారం</span>
                <span className="flex items-center gap-1 text-slate-500"><Clock size={12} /> 22 నిమిషాలు</span>
              </div>
              <h3 className="text-base font-bold text-amber-950 group-hover:text-amber-800 transition line-clamp-2">
                బాలారిష్ట దోష శాంతి – నవజాత శిశు గ్రహ దోషాలు &amp; ఆయుర్దాయ శాస్త్ర ప్రమాణాలు
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                జాతక పారిజాతం మరియు బృహత్పరాశర హోరా శాస్త్రాల ప్రకారం శిశువులకు సంభవించే బాలారిష్ట యోగాలు మరియు మృత్యుంజయ శాంతి ప్రక్రియలు.
              </p>
            </div>
            <a
              href="/balarishta-dosha-shanti"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateToArticle) onNavigateToArticle('balarishta-dosha-shanti');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 group-hover:text-amber-700 cursor-pointer pt-3 border-t border-amber-100"
            >
              <span>పూర్తి వ్యాసం చదవండి</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </article>

          {/* Article Card 3 */}
          <article className="bg-white rounded-2xl border-2 border-amber-200/90 hover:border-amber-400 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300">సాముద్రికం</span>
                <span className="flex items-center gap-1 text-slate-500"><Clock size={12} /> 19 నిమిషాలు</span>
              </div>
              <h3 className="text-base font-bold text-amber-950 group-hover:text-amber-800 transition line-clamp-2">
                హస్త సాముద్రిక రేఖల విజ్ఞానం – ఆయుష్షు, ధన, భాగ్య రేఖల శాస్త్రీయ రహస్యాలు
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                చేతిలోని ఆయుర్రేఖ, మాతృరేఖ, పితృరేఖ, శని భాగ్యరేఖ, రవి కీర్తిరేఖల గుహ్య సంకేతాలు మరియు పర్వతాల ప్రాశస్త్య విశ్లేషణ.
              </p>
            </div>
            <a
              href="/hasta-samudrika-rekhala-vignanam"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateToArticle) onNavigateToArticle('hasta-samudrika-rekhala-vignanam');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 group-hover:text-amber-700 cursor-pointer pt-3 border-t border-amber-100"
            >
              <span>పూర్తి వ్యాసం చదవండి</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </article>

          {/* Article Card 4 */}
          <article className="bg-white rounded-2xl border-2 border-amber-300 hover:border-amber-500 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 border border-amber-400">అష్ట మహా గ్రంథాలు &amp; నాడి</span>
                <span className="flex items-center gap-1 text-slate-500"><Clock size={12} /> 24 నిమిషాలు</span>
              </div>
              <h3 className="text-base font-bold text-amber-950 group-hover:text-amber-800 transition line-clamp-2">
                అష్ట మహా జ్యోతిష గ్రంథాల రహస్యాలు – పరాశర, ఫలదీపిక గోచార వేధ &amp; భృగు నంది నాడి
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                బృహత్ పరాశర హోరా శాస్త్రం, మంత్రేశ్వరుని ఫలదీపిక గోచార వేధ/విపరీత వేధ గణిత సూత్రాలు, సారావళి మరియు భృగు నంది నాడి 1-5-9 సర్క్యూట్ రహస్యాలు.
              </p>
            </div>
            <a
              href="/ashtagrantha-parashara-nadi-jyotisha-rahasyalu"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateToArticle) onNavigateToArticle('ashtagrantha-parashara-nadi-jyotisha-rahasyalu');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 group-hover:text-amber-700 cursor-pointer pt-3 border-t border-amber-100"
            >
              <span>పూర్తి వ్యాసం చదవండి</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </article>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. CORE SACRED SERVICES                                        */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <GopuramSectionHeader
          kicker={t('వైదిక సేవా విభాగాలు • Sacred Vedic Services', 'Sacred Vedic Services')}
          title={t('శ్రీ ధీరజ్ శర్మ గారి ప్రత్యేక సేవా విభాగాలు', 'Specialized Services Conducted by Guruji')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-300/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 text-amber-200 flex items-center justify-center shadow-sm">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {service.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-amber-950">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{service.desc}</p>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} /> {t('శాస్త్రోక్త నిర్వహణ', 'Authentic Vidhanam')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const match = POOJA_SERVICES.find((p) => p.id === service.id) || POOJA_SERVICES[0];
                      onOpenBooking(match);
                    }}
                    className="text-xs font-bold text-amber-900 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('బుక్ చేయండి', 'Book Now')}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. DEVOTEE TESTIMONIALS & USER REVIEWS                         */}
      {/* ============================================================== */}
      <DevoteeReviewsSection />
    </div>
  );
};
