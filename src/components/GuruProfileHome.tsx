import React, { useState, Suspense, lazy } from 'react';
import {
  Phone,
  MessageCircle,
  Award,
  BookOpen,
  Flame,
  Home,
  Users,
  Star,
  Compass,
  ArrowRight,
  MapPin,
  Sun,
  Download,
  ShieldAlert,
  Baby,
  Bell,
} from 'lucide-react';
import { DayData, PoojaService } from '../types/panchangam';
import { POOJA_SERVICES } from '../data/panchangamData';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { getFeaturedDailyRashiSnippet } from '../utils/dailySeoEngine';
import { VirupakshaGatewayScene, GopuramSectionHeader } from './VirupakshaGopuramArt';
import { playTempleBell } from '../utils/audioChime';

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
  onSelectCity,
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
      accent: 'from-amber-500 to-orange-600',
    },
    {
      icon: Users,
      title: t('5,000+ కుటుంబాల విశ్వాసం', '5,000+ Devotee Families'),
      desc: t(
        'తెలుగు రాష్ట్రాలు మరియు విదేశాలలో అసంఖ్యాక భక్తుల ఆదరణ.',
        'Trusted guidance across Andhra Pradesh, Telangana, and global NRI communities.'
      ),
      accent: 'from-orange-500 to-red-600',
    },
    {
      icon: Flame,
      title: t('మహా హోమ క్రతు ప్రవీణులు', 'Master of Sacred Homams'),
      desc: t(
        'చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర హోమాలలో అఖండ ప్రతిభ.',
        'Accomplished practitioner of Chandi, Lakshmi Ganapathi, Sudarshana, and Rudra homams.'
      ),
      accent: 'from-red-600 to-rose-700',
    },
    {
      icon: Compass,
      title: t('దోషరహిత సిద్ధ ముహూర్తాలు', 'Flawless Siddha Muhurthams'),
      desc: t(
        'లగ్న శుద్ధితో వివాహం, గృహప్రవేశాలకు శుభప్రదమైన ఫలితాలు.',
        'Astrological precision for marriage and housewarming with impeccable lagna purity.'
      ),
      accent: 'from-amber-600 to-yellow-600',
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
      highlight: t('ప్రధాన ముహూర్త విభాగం', 'Primary Muhurtham Desk'),
    },
    {
      id: 'chandi-homam',
      title: t('శ్రీ చండీ & లక్ష్మీ గణపతి మహా హోమం', 'Sri Chandi & Lakshmi Ganapathi Maha Homam'),
      desc: t(
        'శత్రు బాధలు, నరదృష్టి, ఆర్థిక సంక్షోభాలు తొలగి అఖండ విజయాలు, అష్టైశ్వర్యాలు సిద్ధించేలా శాస్త్రోక్తంగా స్వయంగా మంత్రోచ్ఛారణతో హోమ క్రతువు నిర్వహణ.',
        'Vedic fire rituals conducted with authentic mantra chanting to remove negative energies, financial obstacles, and bestow peace and prosperity.'
      ),
      icon: Flame,
      highlight: t('వైదిక హోమ క్రతువులు', 'Sacred Fire Rituals'),
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
      {/* 1. GRAND VIRUPAKSHA GATEWAY SUNSET SHOWCASE & GURUJI HERO      */}
      {/*    (Unobstructed Sunset Gopuram Art Stage + Clean Bio Panel)   */}
      {/* ============================================================== */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/70 bg-gradient-to-b from-[#2A050C] via-[#3A0912] to-[#24040A] text-white">
        {/* TOP STAGE: Dedicated Full-Color Virupaksha Gateway Sunset Illustration */}
        <div className="relative w-full h-52 sm:h-68 lg:h-80 overflow-hidden border-b border-amber-400/40">
          <VirupakshaGatewayScene className="w-full h-full object-cover" />

          {/* Interactive Temple Bell Button in Corner of the Mandapam */}
          <button
            type="button"
            onClick={() => playTempleBell()}
            title={t('ఆలయ గంటను మోగించండి (Ring Sacred Temple Bell)', 'Ring Sacred Temple Bell')}
            className="absolute top-3 right-3 sm:top-4 sm:right-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A050C]/80 hover:bg-[#460D16] text-amber-200 border border-amber-400/50 text-xs font-bold shadow-lg backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Bell size={14} className="text-amber-300 animate-bounce" />
            <span>{t('ఆలయ గంట', 'Ring Bell')}</span>
          </button>

          {/* Subtle Sanskrit Shloka Ribbon at Top Center */}
          <div className="absolute top-3 left-3 sm:left-5 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2A050C]/75 border border-amber-400/40 text-[11px] text-amber-200 font-semibold backdrop-blur-xs">
            <OmEmblem className="w-4 h-4 text-amber-300" size={16} />
            <span>శ్రీ విరూపాక్ష &amp; శ్రీలక్ష్మి గణపతి ఆశీస్సులతో · సనాతన దృక్సిద్ధాంత జ్యోతిషాలయం</span>
          </div>
        </div>

        {/* BOTTOM STAGE: Clean High-Contrast Guruji Profile & Direct Actions */}
        <div className="relative px-5 pb-7 pt-4 sm:px-10 sm:pb-9 sm:pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 -mt-16 sm:-mt-20 relative z-20">
            {/* Guruji Portrait Framed in Radiant Temple Gold */}
            <div className="shrink-0 text-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-amber-500 via-yellow-300 to-orange-500 shadow-2xl mx-auto ring-4 ring-[#2A050C]">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-100 bg-[#2A050C]">
                  <img
                    src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                    alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                    width={160}
                    height={160}
                    loading="eager"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <span className="inline-block mt-2.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[11px] font-bold tracking-wide">
                {t('స్మార్త వైదిక ప్రవీణులు · ప్రముఖ జ్యోతిష్యులు', 'Smartha Veda Vidwan · Eminent Astrologer')}
              </span>
            </div>

            {/* Clean Uncluttered Bio & Action Buttons */}
            <div className="flex-1 text-center md:text-left space-y-2.5 pt-2 md:pt-14">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                <OmEmblem className="w-5 h-5 text-amber-400" size={20} />
                <span>
                  {t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · హైదరాబాద్', 'Sri Lakshmi Ganapathi Jyothishalayam · Hyderabad')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Brahmasri Jallavaram Sai Dheeraj Sharma')}
              </h1>

              <p className="text-amber-100/95 text-xs sm:text-sm sm:leading-relaxed max-w-3xl">
                {t(
                  'సనాతన గురుకుల వేద సంప్రదాయంలో శిక్షణ పొంది, దృక్సిద్ధాంత ఖగోళ గణితం ఆధారంగా జాతక పరిశీలన, 36 గుణాల వివాహ పొంతన, 100 పేజీల బృహత్ జాతక కుండలి నివేదిక మరియు సమగ్ర హోమ క్రతువులను శాస్త్రోక్తంగా నిర్వహించే ప్రముఖ వైదిక పండితులు.',
                  'Renowned Vedic scholar and astrologer practicing authentic Drik-Siddhanta astrology, comprehensive 100-page Kundali Grantham generation, flaw-free muhurtham determination, and sacred Maha Homams.'
                )}
              </p>

              <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-all hover:scale-[1.02]"
                >
                  <MessageCircle size={17} />
                  <span>{t('వాట్సాప్‌లో సంప్రదించండి', 'Chat on WhatsApp')}</span>
                </a>

                <a
                  href="tel:+918977986166"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-amber-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all"
                >
                  <Phone size={15} />
                  <span>+91 89779 86166</span>
                </a>

                {onNavigateToAwards && (
                  <button
                    type="button"
                    onClick={onNavigateToAwards}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-amber-200 font-semibold rounded-xl text-xs sm:text-sm border border-amber-400/50 transition-colors cursor-pointer"
                  >
                    <Award size={15} className="text-amber-300" />
                    <span>{t('పొందిన సత్కారాలు', 'Awards & Honors')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TODAY'S PANCHANGAM HIGHLIGHT BAR                            */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-300/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Sun size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-800">
              <span>{t('నేటి విశేష పంచాంగం', 'Today Panchangam Almanac')}</span>
              <span aria-hidden="true">•</span>
              <span>{tr(currentDay.teediVaram)}</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-amber-950 mt-0.5">
              {t('తిథి:', 'Tithi:')} <span className="text-orange-800">{cleanTithi}</span>{' '}
              <span className="text-amber-400 mx-1.5">|</span> {t('నక్షత్రం:', 'Nakshatram:')}{' '}
              <span className="text-orange-800">{cleanNakshatra}</span>
            </p>
            <p className="text-xs text-amber-900/85 mt-0.5">
              {t('శుభ సమయం (అమృత ఘడియలు):', 'Amrutha Gadiyalu:')} <strong>{tr(currentDay.shubha.amrutha)}</strong> • {t('రాహుకాలం:', 'Rahu Kalam:')} <strong>{tr(currentDay.ashubha.rahukalam)}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToPanchangam}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-900 to-red-900 hover:from-amber-800 hover:to-red-800 text-amber-100 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
        >
          <span>{t('నేటి సంపూర్ణ పంచాంగం & రాశి ఫలాలు చూడండి', 'View Full Panchangam & Predictions')}</span>
          <ArrowRight size={16} className="text-amber-300" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. PILLARS OF TRADITION (4 ELEVATED ROYAL CARDS)               */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {achievements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-md hover:shadow-xl transition-shadow relative overflow-hidden group"
            >
              <div className={`h-1.5 inset-x-0 top-0 absolute bg-gradient-to-r ${item.accent}`} />
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center shadow-md mb-3.5`}
              >
                <Icon size={20} />
              </div>
              <h3 className="text-base font-extrabold text-amber-950 mb-1.5">{item.title}</h3>
              <p className="text-xs text-amber-900/80 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 4. 100-PAGE JANMA KUNDALI GRANTHAM BANNER                      */}
      {/* ============================================================== */}
      <div className="mandapam-dark-frame text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left flex-1 relative z-10">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
            {t('సంపూర్ణ బృహత్ జాతక గ్రంథం · 100-Page Kundali PDF', 'Brihat Jataka Life Kundali Grantham')}
          </div>
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
          className="relative z-10 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-extrabold text-sm shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
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
        className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200/90 shadow-lg space-y-6 scroll-mt-24"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-4">
          <GopuramSectionHeader
            kicker={t('ఉచిత ఆన్‌లైన్ జ్యోతిష & వాస్తు గణనలు · Free Vedic Checkers', 'Free Interactive Vedic Checkers')}
            title={t(
              'ఏలినాటి శని చెకర్, 27 నక్షత్రాల పిల్లల పేర్లు & గృహ వాస్తు చక్రం',
              'Elinati Shani Checker, 27 Nakshatra Baby Names & Gruha Vastu Guide'
            )}
          />

          {/* Vibrant Segmented Tool Selector */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 bg-amber-50 rounded-2xl border border-amber-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveHomeTool('shani')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeHomeTool === 'shani'
                  ? 'bg-gradient-to-r from-amber-900 to-red-900 text-white shadow-md'
                  : 'text-amber-950 hover:bg-amber-100/80'
              }`}
            >
              <ShieldAlert size={16} className={activeHomeTool === 'shani' ? 'text-amber-300' : 'text-red-700'} />
              <span>{t('ఏలినాటి శని & దోష చెకర్', 'Shani & Dosha Checker')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHomeTool('babynames')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeHomeTool === 'babynames'
                  ? 'bg-gradient-to-r from-amber-900 to-red-900 text-white shadow-md'
                  : 'text-amber-950 hover:bg-amber-100/80'
              }`}
            >
              <Baby size={16} className={activeHomeTool === 'babynames' ? 'text-amber-300' : 'text-orange-700'} />
              <span>{t('27 నక్షత్రాల పిల్లల పేర్లు', '27 Star Baby Names')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHomeTool('vastu')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeHomeTool === 'vastu'
                  ? 'bg-gradient-to-r from-amber-900 to-red-900 text-white shadow-md'
                  : 'text-amber-950 hover:bg-amber-100/80'
              }`}
            >
              <Compass size={16} className={activeHomeTool === 'vastu' ? 'text-amber-300' : 'text-amber-800'} />
              <span>{t('ఇంటి ముఖద్వార & వాస్తు చెకర్', 'House Vastu Checker')}</span>
            </button>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="py-12 text-center text-sm font-bold text-amber-900">
              జ్యోతిష సమాచారం లోడ్ అవుతోంది... · Loading Vedic Tool...
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
      <div className="space-y-5">
        <GopuramSectionHeader
          kicker={t('వైదిక సేవా విభాగాలు · Sacred Vedic Services', 'Sacred Vedic Services')}
          title={t('శ్రీ ధీరజ్ శర్మ గారి ప్రత్యేక సేవా విభాగాలు', 'Specialized Services Conducted by Guruji')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="h-1.5 inset-x-0 top-0 absolute bg-gradient-to-r from-amber-500 via-orange-500 to-red-600" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-50 text-orange-800 border border-amber-200">
                      {service.highlight}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-orange-700 flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-amber-950">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">{service.desc}</p>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const match = POOJA_SERVICES.find((p) => p.id === service.id) || POOJA_SERVICES[0];
                      onOpenBooking(match);
                    }}
                    className="text-xs font-extrabold text-orange-800 hover:text-red-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('వివరాల కొరకు నమోదు / బుకింగ్', 'Book / Inquire')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. DEVOTEE TESTIMONIALS (విశ్వసనీయత & భక్తుల అనుభవాలు)         */}
      {/* ============================================================== */}
      <div className="space-y-5">
        <GopuramSectionHeader
          kicker={t('భక్తుల అనుభవాలు · Devotee Testimonials', 'Devotee Experiences')}
          title={t('తెలుగు రాష్ట్రాలు & విదేశీ భక్తుల విశ్వసనీయత', 'Trusted by Families Across the World')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-md flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-amber-950/90 italic leading-relaxed">
                  "{testi.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950">{testi.name}</span>
                <span className="text-orange-800 font-semibold text-[11px]">{testi.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. DEVOTEE CONSULTATION BANNER                                  */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-extrabold text-amber-950">
            {t(
              'మీ కుటుంబ శుభకార్యం కోసం శ్రీ ధీరజ్ శర్మ గారిని సంప్రదించండి',
              'Consult Sri Dheeraj Sharma for Your Auspicious Family Ceremonies'
            )}
          </h3>
          <p className="text-xs sm:text-sm text-amber-900/85 max-w-xl leading-relaxed">
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
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors inline-flex items-center gap-2"
          >
            <MessageCircle size={16} />
            <span>{t('వాట్సాప్ అపాయింట్‌మెంట్', 'WhatsApp Appointment')}</span>
          </a>

          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-900 to-red-900 hover:from-amber-800 hover:to-red-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer whitespace-nowrap"
          >
            {t('పూజ సంకల్ప బుకింగ్', 'Book Consultation')}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 8. HYDERABAD & TELANGANA LOCAL JYOTHISHAM HUB (LOCAL SEO)       */}
      {/* ============================================================== */}
      <section
        aria-label="Hyderabad and Telangana Telugu Astrology & Jyothisham Services"
        className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-md space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
          <GopuramSectionHeader
            kicker={t('హైదరాబాద్ & తెలంగాణ జ్యోతిష సేవా కేంద్రం · Local Jyothisham Hub', 'Hyderabad & Telangana Vedic Astrology Hub')}
            title={t(
              'హైదరాబాద్ & తెలంగాణ రాష్ట్ర వ్యాప్తంగా తెలుగు జ్యోతిష్యం, జాతకం & వాస్తు సేవలు',
              'Best Telugu Astrologer & Jyothisham Services in Hyderabad & Telangana'
            )}
            subtitle={t(
              'ప్రధాన పీఠం: పసుమాముల, హయత్‌నగర్, హైదరాబాద్ (501505). గ్రేటర్ హైదరాబాద్‌లోని అన్ని ప్రాంతాలు మరియు తెలంగాణలోని 33 జిల్లాల భక్తులకు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే దృక్సిద్ధాంత పంచాంగం, జాతక పరిశీలన, 36 గుణాల వివాహ పొంతన, గృహ వాస్తు మరియు వైదిక హోమ క్రతువులు ప్రత్యక్షంగా మరియు ఆన్‌లైన్ ద్వారా అందించబడును.',
              'Headquartered at Pasumamula, Hayathnagar, Hyderabad (501505). Serving families across Greater Hyderabad and all 33 Telangana districts with authentic Drik Siddhanta Panchangam, Jathakam analysis, 36-Guna marriage matching, Gruha Vastu, and Vedic Homams.'
            )}
          />
          <a
            href="https://www.google.com/maps?q=Pasumamula,Hayathnagar,Hyderabad,Telangana+501505"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-colors"
          >
            <MapPin size={14} className="text-orange-700" />
            <span>{t('హైదరాబాద్ పీఠం మ్యాప్', 'Hyderabad Center Map')}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Greater Hyderabad Localities */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
              <Compass size={14} className="text-orange-700 shrink-0" />
              <span>
                {t(
                  'గ్రేటర్ హైదరాబాద్ జ్యోతిష సేవా ప్రాంతాలు (Hyderabad Localities)',
                  'Greater Hyderabad Astrology Service Areas'
                )}
              </span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                { slug: 'hyderabad', te: 'హైదరాబాద్ (Hyderabad)', en: 'Hyderabad' },
                { slug: 'hayathnagar', te: 'హయత్‌నగర్ (Hayathnagar)', en: 'Hayathnagar' },
                { slug: 'lb-nagar', te: 'ఎల్బీ నగర్ (LB Nagar)', en: 'LB Nagar' },
                { slug: 'dilsukhnagar', te: 'దిల్‌సుఖ్‌నగర్ (Dilsukhnagar)', en: 'Dilsukhnagar' },
                { slug: 'vanasthalipuram', te: 'వనస్థలిపురం (Vanasthalipuram)', en: 'Vanasthalipuram' },
                { slug: 'kukatpally', te: 'కూకట్‌పల్లి / KPHB', en: 'Kukatpally' },
                { slug: 'madhapur', te: 'మాదాపూర్ (Madhapur)', en: 'Madhapur' },
                { slug: 'gachibowli', te: 'గచ్చిబౌలి (Gachibowli)', en: 'Gachibowli' },
                { slug: 'miyapur', te: 'మియాపూర్ (Miyapur)', en: 'Miyapur' },
                { slug: 'kondapur', te: 'కొండాపూర్ (Kondapur)', en: 'Kondapur' },
                { slug: 'uppal', te: 'ఉప్పల్ (Uppal)', en: 'Uppal' },
                { slug: 'secunderabad', te: 'సికింద్రాబాద్ (Secunderabad)', en: 'Secunderabad' },
                { slug: 'jubilee-hills', te: 'జూబ్లీహిల్స్ (Jubilee Hills)', en: 'Jubilee Hills' },
                { slug: 'banjara-hills', te: 'బంజారాహిల్స్ (Banjara Hills)', en: 'Banjara Hills' },
                { slug: 'manikonda', te: 'మణికొండ (Manikonda)', en: 'Manikonda' },
                { slug: 'kompally', te: 'కొంపల్లి (Kompally)', en: 'Kompally' },
                { slug: 'nizampet', te: 'నిజాంపేట్ (Nizampet)', en: 'Nizampet' },
                { slug: 'bachupally', te: 'బాచుపల్లి (Bachupally)', en: 'Bachupally' },
                { slug: 'ameerpet', te: 'అమీర్‌పేట్ (Ameerpet)', en: 'Ameerpet' },
                { slug: 'malkajgiri', te: 'మల్కాజ్‌గిరి (Malkajgiri)', en: 'Malkajgiri' },
              ].map((loc) => (
                <a
                  key={loc.slug}
                  href={`/telugu-astrologer-in-${loc.slug}`}
                  onClick={(e) => {
                    if (onSelectCity) {
                      e.preventDefault();
                      onSelectCity(loc.slug);
                    }
                  }}
                  className="text-[11px] sm:text-xs bg-amber-50/70 hover:bg-amber-100 text-amber-950 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors font-medium"
                >
                  {t(loc.te, `Astrologer in ${loc.en}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Telangana 33 Districts Major Hubs */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
              <MapPin size={14} className="text-orange-700 shrink-0" />
              <span>
                {t(
                  'తెలంగాణ జిల్లాల్లో తెలుగు జ్యోతిష్యం (Telangana Districts)',
                  'Telangana Districts Telugu Jyothisham & Jathakam'
                )}
              </span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                { slug: 'warangal', te: 'వరంగల్ (Warangal)', en: 'Warangal' },
                { slug: 'hanamkonda', te: 'హన్మకొండ (Hanamkonda)', en: 'Hanamkonda' },
                { slug: 'karimnagar', te: 'కరీంనగర్ (Karimnagar)', en: 'Karimnagar' },
                { slug: 'nizamabad', te: 'నిజామాబాద్ (Nizamabad)', en: 'Nizamabad' },
                { slug: 'khammam', te: 'ఖమ్మం (Khammam)', en: 'Khammam' },
                { slug: 'nalgonda', te: 'నల్గొండ (Nalgonda)', en: 'Nalgonda' },
                { slug: 'suryapet', te: 'సూర్యాపేట (Suryapet)', en: 'Suryapet' },
                { slug: 'siddipet', te: 'సిద్దిపేట (Siddipet)', en: 'Siddipet' },
                { slug: 'mahbubnagar', te: 'మహబూబ్‌నగర్ (Mahbubnagar)', en: 'Mahbubnagar' },
                { slug: 'sangareddy', te: 'సంగారెడ్డి (Sangareddy)', en: 'Sangareddy' },
                { slug: 'adilabad', te: 'ఆదిలాబాద్ (Adilabad)', en: 'Adilabad' },
                { slug: 'mancherial', te: 'మంచిర్యాల (Mancherial)', en: 'Mancherial' },
                { slug: 'jagtial', te: 'జగిత్యాల (Jagtial)', en: 'Jagtial' },
                { slug: 'kamareddy', te: 'కామారెడ్డి (Kamareddy)', en: 'Kamareddy' },
                { slug: 'bhongir', te: 'భువనగిరి / యాదాద్రి (Bhongir)', en: 'Bhongir' },
                { slug: 'kothagudem', te: 'కొత్తగూడెం (Kothagudem)', en: 'Kothagudem' },
                { slug: 'medak', te: 'మెదక్ (Medak)', en: 'Medak' },
                { slug: 'vikarabad', te: 'వికారాబాద్ (Vikarabad)', en: 'Vikarabad' },
                { slug: 'wanaparthy', te: 'వనపర్తి (Wanaparthy)', en: 'Wanaparthy' },
                { slug: 'gadwal', te: 'గద్వాల (Gadwal)', en: 'Gadwal' },
              ].map((dist) => (
                <a
                  key={dist.slug}
                  href={`/telugu-astrologer-in-${dist.slug}`}
                  onClick={(e) => {
                    if (onSelectCity) {
                      e.preventDefault();
                      onSelectCity(dist.slug);
                    }
                  }}
                  className="text-[11px] sm:text-xs bg-amber-50/70 hover:bg-amber-100 text-amber-950 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors font-medium"
                >
                  {t(dist.te, `Astrologer in ${dist.en}`)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
