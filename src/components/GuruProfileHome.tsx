import React, { useState, Suspense, lazy } from 'react';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle,
  Award,
  BookOpen,
  Flame,
  Home,
  Users,
  Star,
  Compass,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Clock,
  MapPin,
  Mail,
  Sun,
  Download,
  ShieldAlert,
  Baby,
} from 'lucide-react';
import { DayData, PoojaService } from '../types/panchangam';
import { POOJA_SERVICES } from '../data/panchangamData';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { getFeaturedDailyRashiSnippet } from '../utils/dailySeoEngine';

const ShaniDoshaChecker = lazy(() =>
  import('./ShaniDoshaChecker').then((m) => ({ default: m.ShaniDoshaChecker }))
);
const NakshatraBabyNames = lazy(() =>
  import('./NakshatraBabyNames').then((m) => ({ default: m.NakshatraBabyNames }))
);
const VastuChakraGuide = lazy(() =>
  import('./VastuChakraGuide').then((m) => ({ default: m.VastuChakraGuide }))
);

export interface GuruProfileHomeProps {
  currentDay: DayData;
  onNavigateToPanchangam: () => void;
  onNavigateToJathakam?: () => void;
  onNavigateToAwards?: () => void;
  onOpenBooking: (service?: PoojaService) => void;
  onSelectCity?: (citySlug: string) => void;
}

export const GuruProfileHome: React.FC<GuruProfileHomeProps> = ({
  currentDay,
  onNavigateToPanchangam,
  onNavigateToJathakam,
  onNavigateToAwards,
  onOpenBooking,
}) => {
  const { t, tr } = useLanguage();
  const [activeHomeTool, setActiveHomeTool] = useState<'shani' | 'babynames' | 'vastu'>('shani');
  const cleanTithi = currentDay.panchanga.tithi?.split('-')[0]?.trim() || currentDay.panchanga.tithi;
  const cleanNakshatra = currentDay.panchanga.nakshatram?.split('-')[0]?.trim() || currentDay.panchanga.nakshatram;
  const featuredRashi = getFeaturedDailyRashiSnippet(currentDay);

  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నేను పూజా కార్యక్రమం / 100 పేజీల జన్మ కుండలి PDF / ముహూర్తం కొరకు సంప్రదిస్తున్నాను.'
  )}`;

  const achievements = [
    {
      icon: Award,
      title: t('15+ ఏళ్ల వేద సంప్రదాయం', '15+ Years of Vedic Heritage'),
      desc: t(
        'స్మార్త వైదిక శాస్త్రాలలో నిష్ణాతులు & గురుపరంపర ప్రముఖ జ్యోతిష్యులు.',
        'Excellence in Smartha Vedic treatises and authentic Guru Parampara.'
      ),
    },
    {
      icon: Users,
      title: t('5,000+ కుటుంబాల విశ్వాసం', '5,000+ Devotee Families'),
      desc: t(
        'తెలుగు రాష్ట్రాలు మరియు విదేశాలలో అసంఖ్యాక భక్తుల ఆదరణ.',
        'Trusted guidance across Andhra Pradesh, Telangana, and global NRI communities.'
      ),
    },
    {
      icon: Flame,
      title: t('మహా హోమ క్రతు ప్రవీణులు', 'Master of Sacred Homams'),
      desc: t(
        'చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర హోమాలలో అఖండ ప్రతిభ.',
        'Accomplished practitioner of Chandi, Lakshmi Ganapathi, Sudarshana, and Rudra homams.'
      ),
    },
    {
      icon: Compass,
      title: t('దోషరహిత సిద్ధ ముహూర్తాలు', 'Flawless Siddha Muhurthams'),
      desc: t(
        'లగ్న శుద్ధితో వివాహం, గృహప్రవేశాలకు శుభప్రదమైన ఫలితాలు.',
        'Astrological precision for marriage and housewarming with impeccable lagna purity.'
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
      highlight: t('అత్యంత ప్రజాదరణ పొందిన సేవ', 'Most Popular Service'),
    },
    {
      id: 'chandi-homam',
      title: t('శ్రీ చండీ & లక్ష్మీ గణపతి మహా హోమం', 'Sri Chandi & Lakshmi Ganapathi Maha Homam'),
      desc: t(
        'శత్రు బాధలు, నరదృష్టి, ఆర్థిక సంక్షోభాలు తొలగి అఖండ విజయాలు, అష్టైశ్వర్యాలు సిద్ధించేలా శాస్త్రోక్తంగా స్వయంగా మంత్రోచ్ఛారణతో హోమ క్రతువు నిర్వహణ.',
        'Vedic fire rituals conducted with authentic mantra chanting to remove negative energies, financial obstacles, and bestow peace and prosperity.'
      ),
      icon: Flame,
      highlight: t('సర్వ సంకట నివారణ', 'All-Affliction Relief'),
    },
    {
      id: 'jathaka-parisheelana',
      title: t('ఖచ్చితమైన జాతక విశ్లేషణ & దోష నివారణ', 'Accurate Horoscope Analysis & Remedies'),
      desc: t(
        'జన్మ కుండలి, రాశి చక్రం, దశ-అంతర్దశల సమగ్ర గణనతో ఉద్యోగం, విద్య, వివాహం, సంతాన ప్రాప్తి కోసం సరళమైన వేద పరిహారాల మార్గదర్శనం.',
        'In-depth horoscope reading covering birth chart, Mahadasha, and remedial solutions for career, marriage, education, and health.'
      ),
      icon: BookOpen,
      highlight: t('దృక్సిద్ధాంత ఖగోళ గణితం', 'Drik Siddhanta Precision'),
    },
  ];

  const testimonials = [
    {
      name: t('కె. రామకృష్ణ & పద్మావతి', 'K. Ramakrishna & Padmavathi'),
      location: t('హైదరాబాద్', 'Hyderabad'),
      comment: t(
        'మా అబ్బాయి వివాహ ముహూర్తం మరియు వివాహ పొంతన విషయంలో గురువుగారు ఇచ్చిన సలహాలు ఎంతో ఉపయోగపడ్డాయి. వివాహం అద్భుతంగా జరిగింది.',
        'Guruji’s marriage compatibility guidance and muhurtham determination for our son was remarkably accurate and blessed.'
      ),
      rating: 5,
    },
    {
      name: t('శ్రీనివాస రావు గారు', 'Srinivasa Rao'),
      location: t('డల్లాస్, అమెరికా (USA NRI)', 'Dallas, USA'),
      comment: t(
        '100 పేజీల బృహత్ జాతక కుండలి రిపోర్ట్ తీసుకున్నాను. నా వ్యాపార మరియు కెరీర్ ప్రణాళికకు ఎంతో ఉపయోగపడింది. గురువుగారికి కృతజ్ఞతలు.',
        'The 100-page Brihat Jataka PDF report provided astonishingly clear life predictions. Highly recommended for overseas Telugu families.'
      ),
      rating: 5,
    },
    {
      name: t('ఎం. లక్ష్మీ ప్రసన్న', 'M. Lakshmi Prasanna'),
      location: t('విజయవాడ', 'Vijayawada'),
      comment: t(
        'గృహప్రవేశ ముహూర్తం మరియు నవగ్రహ శాంతి హోమం గురువుగారి సమక్షంలో జరిపించుకున్నాము. ఇంట్లో అఖండమైన శాంతి, శ్రేయస్సు లభించింది.',
        'We performed our Gruhapravesham and Navagraha Homam under Guruji’s divine guidance. It brought immense peace and prosperity.'
      ),
      rating: 5,
    },
  ];

  return (
    <div className="space-y-10 font-telugu max-w-6xl mx-auto">
      {/* ============================================================== */}
      {/* 1. HERO BIO CARD (GURUJI PROFILE & AUTHENTIC LINEAGE)          */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-amber-950 via-[#3b1506] to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-500/60 relative overflow-hidden">
        {/* Subtle decorative aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
          {/* Avatar with sacred golden ring */}
          <div className="shrink-0 text-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 shadow-2xl mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-200 bg-amber-950">
                <img
                  src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                  alt="శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                  width={176}
                  height={176}
                  loading="eager"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <span className="inline-block mt-3 px-3 py-1 bg-amber-900/90 text-amber-200 text-xs rounded-full border border-amber-500/60 font-semibold shadow-xs">
              {t('స్మార్త వైదిక ప్రవీణులు & ప్రముఖ జ్యోతిష్యులు', 'Vedic Scholar & Eminent Astrologer')}
            </span>
          </div>

          {/* Description & Action buttons */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <OmEmblem className="w-6 h-6 text-amber-400" size={24} />
              <span className="text-amber-300 text-xs font-bold uppercase tracking-widest font-display">
                {t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · తిరుపతి క్షేత్రం', 'Sri Lakshmi Ganapathi Jyothishalayam · Tirupati')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Brahmasri Jallavaram Sai Dheeraj Sharma')}
            </h1>

            <p className="text-amber-100/95 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
              {t(
                'సనాతన గురుకుల వేద సంప్రదాయంలో శిక్షణ పొంది, దృక్సిద్ధాంత ఖగోళ గణితం ఆధారంగా జాతక పరిశీలన, వివాహ పొంతన, 100 పేజీల బృహత్ జాతక కుండలి నివేదిక మరియు సమగ్ర హోమ క్రతువులను శాస్త్రోక్తంగా నిర్వహించే ప్రముఖ వైదిక పండితులు.',
                'Renowned Vedic scholar and astrologer practicing authentic Drik-Siddhanta astrology, comprehensive 100-page Kundali Grantham generation, flaw-free muhurtham determination, and sacred Maha Homams.'
              )}
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 justify-center md:justify-start">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle size={17} />
                <span>{t('వాట్సాప్‌లో సంప్రదించండి', 'Chat on WhatsApp')}</span>
              </a>

              <a
                href="tel:+918977986166"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-900/90 hover:bg-amber-800 text-white font-semibold rounded-xl text-xs sm:text-sm border border-amber-600/70 transition-colors shadow-sm"
              >
                <Phone size={15} />
                <span>+91 89779 86166</span>
              </a>

              {onNavigateToAwards && (
                <button
                  type="button"
                  onClick={onNavigateToAwards}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 font-semibold rounded-xl text-xs sm:text-sm border border-amber-500/50 transition-colors cursor-pointer"
                >
                  <Award size={15} className="text-amber-400" />
                  <span>{t('పొందిన సత్కారాలు', 'Awards & Honors')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TODAY'S PANCHANGAM QUICK GLANCE STRIP                       */}
      {/* ============================================================== */}
      <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 shrink-0 border border-amber-300">
            <Sun size={24} className="text-amber-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              {t('నేటి విశేష పంచాంగం & రాశి ఫలం', 'Today Panchangam & Featured Forecast')}
            </span>
            <p className="text-sm sm:text-base font-bold text-amber-950">
              {tr(currentDay.teediVaram)} • {cleanTithi} • {cleanNakshatra}
            </p>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
              {currentDay.phalitham || `${featuredRashi.rashiNameTe}: ${featuredRashi.predictionTe}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToPanchangam}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-102 cursor-pointer shrink-0"
        >
          <span>{t('నేటి సంపూర్ణ పంచాంగం చూడండి', 'View Today Panchangam')}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. PILLARS OF TRADITION (4 ACHIEVEMENTS)                       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-amber-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mb-3">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-amber-950 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 4. 100-PAGE JANMA KUNDALI FEATURED HIGHLIGHT BANNER            */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-500/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left flex-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            <span>{t('సంపూర్ణ బృహత్ జాతక గ్రంథం • 100-Page Kundali PDF', 'Brihat Jataka Life Kundali PDF')}</span>
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white">
            {t('మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF రిపోర్ట్ పొందండి', 'Get Your Complete 100-Page Janma Kundali PDF')}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
            {t(
              'పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా దృక్సిద్ధాంత రాశి చక్రం (D1), నవాంశ (D9), 12 స్థానాల విశ్లేషణ, 120 ఏళ్ల వింశోత్తరి మహాదశ, భృగు చక్ర 96 ఏళ్ల కాలగమనం మరియు అదృష్ట రత్న పరిహారాలు పొందండి.',
              'Generate an authentic 100-page Telugu Kundali with D1 Rashi, D9 Navamsha, 12 Bhava synthesis, 120-year Mahadasha timeline, Bhrigu progression, and gemstone remedies.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onNavigateToJathakam) {
              onNavigateToJathakam();
            } else {
              window.open(whatsappUrl, '_blank');
            }
          }}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-black text-sm shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Download size={18} />
          <span>{t('ఉచిత కుండలి నివేదిక పొందండి', 'Generate Kundali Now')}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 4B. 3 HIGH-DEMAND INTERACTIVE VEDIC TOOLS (SHANI, BABY, VASTU) */}
      {/* ============================================================== */}
      <section
        id="home-interactive-tools"
        aria-label="Interactive Shani Dosha, Baby Naming and Vastu Checkers"
        className="bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 border-2 border-amber-300 rounded-3xl p-4 sm:p-7 shadow-lg space-y-6 scroll-mt-24"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
              ✨ {t('ఉచిత ఆన్‌లైన్ జ్యోతిష & వాస్తు సేవలు • Free Vedic Checkers', 'Free Interactive Vedic Checkers')}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-amber-950">
              {t(
                'ఏలినాటి శని చెకర్, 27 నక్షత్రాల పిల్లల పేర్లు & గృహ వాస్తు చక్రం',
                'Elinati Shani Checker, 27 Nakshatra Baby Names & Gruha Vastu Guide'
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveHomeTool('shani')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeHomeTool === 'shani'
                  ? 'bg-amber-900 text-white border-amber-950 shadow-md scale-[1.02]'
                  : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <ShieldAlert size={16} className={activeHomeTool === 'shani' ? 'text-amber-300' : 'text-amber-700'} />
              <span>🪐 {t('ఏలినాటి శని & దోష చెకర్', 'Shani & Dosha Checker')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHomeTool('babynames')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeHomeTool === 'babynames'
                  ? 'bg-amber-900 text-white border-amber-950 shadow-md scale-[1.02]'
                  : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Baby size={16} className={activeHomeTool === 'babynames' ? 'text-amber-300' : 'text-amber-700'} />
              <span>👶 {t('27 నక్షత్రాల పిల్లల పేర్లు', '27 Star Baby Names')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHomeTool('vastu')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeHomeTool === 'vastu'
                  ? 'bg-amber-900 text-white border-amber-950 shadow-md scale-[1.02]'
                  : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Compass size={16} className={activeHomeTool === 'vastu' ? 'text-amber-300' : 'text-amber-700'} />
              <span>🏠 {t('ఇంటి ముఖద్వార & వాస్తు చెకర్', 'House Vastu Checker')}</span>
            </button>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="py-12 text-center text-sm font-bold text-amber-900 animate-pulse">
              జ్యోతిష సమాచారం లోడ్ అవుతోంది... • Loading Vedic Tool...
            </div>
          }
        >
          {activeHomeTool === 'shani' && (
            <ShaniDoshaChecker onOpenBooking={() => onOpenBooking()} />
          )}
          {activeHomeTool === 'babynames' && <NakshatraBabyNames />}
          {activeHomeTool === 'vastu' && <VastuChakraGuide />}
        </Suspense>
      </section>

      {/* ============================================================== */}
      {/* 5. CORE SACRED SERVICES                                        */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              {t('ప్రముఖ సేవలు • Vedic Services', 'Sacred Vedic Services')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
              {t('శ్రీ ధీరజ్ శర్మ గారి ప్రత్యేక సేవా విభాగాలు', 'Specialized Services Conducted by Guruji')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coreServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white border-2 border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
                      {service.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-amber-950">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{service.desc}</p>
                </div>

                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const match = POOJA_SERVICES.find((p) => p.id === service.id) || POOJA_SERVICES[0];
                      onOpenBooking(match);
                    }}
                    className="text-xs font-bold text-amber-900 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('వివరాల కొరకు నమోదు', 'Book / Inquire')}</span>
                    <ArrowRight size={14} />
                  </button>

                  <a
                    href={`https://wa.me/918977986166?text=${encodeURIComponent(
                      `నమస్కారం గురూజీ, "${service.title}" గురించి సంప్రదించాలనుకుంటున్నాను.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. DEVOTEE TESTIMONIALS (విశ్వసనీయత & భక్తుల అనుభవాలు)         */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {t('భక్తుల అనుభవాలు • Testimonials', 'Devotee Experiences')}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
            {t('తెలుగు రాష్ట్రాలు & విదేశీ భక్తుల విశ్వసనీయత', 'Trusted by Families Across the World')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-white border border-amber-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{testi.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950">{testi.name}</span>
                <span className="text-slate-500 text-[11px]">{testi.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. DEVOTEE CONSULTATION BANNER                                  */}
      {/* ============================================================== */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-amber-950">
            {t(
              'మీ కుటుంబ శుభకార్యం కోసం శ్రీ ధీరజ్ శర్మ గారిని సంప్రదించండి',
              'Consult Sri Dheeraj Sharma for Your Auspicious Family Ceremonies'
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
            {t(
              'వివాహం, గృహప్రవేశం, చండీ హోమం లేదా జాతక పరిశీలన కొరకు ముందస్తుగా తేదీలు నమోదు చేసుకోగలరు.',
              'Reserve your dates in advance for weddings, gruhapravesham rituals, personal homams, or in-depth horoscope analysis.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-105 inline-flex items-center gap-2"
          >
            <MessageCircle size={16} />
            <span>{t('వాట్సాప్ అపాయింట్‌మెంట్', 'WhatsApp Appointment')}</span>
          </a>

          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="px-5 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            {t('పూజ సంకల్ప బుకింగ్', 'Book Consultation')}
          </button>
        </div>
      </div>
    </div>
  );
};
