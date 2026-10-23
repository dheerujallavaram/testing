import React from 'react';
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
} from 'lucide-react';
import { DayData, PoojaService } from '../types/panchangam';
import { POOJA_SERVICES } from '../data/panchangamData';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';

interface GuruProfileHomeProps {
  currentDay: DayData;
  onNavigateToPanchangam: () => void;
  onNavigateToAwards?: () => void;
  onOpenBooking: (service?: PoojaService) => void;
}

export const GuruProfileHome: React.FC<GuruProfileHomeProps> = ({
  currentDay,
  onNavigateToPanchangam,
  onNavigateToAwards,
  onOpenBooking,
}) => {
  const { t, tr, language } = useLanguage();
  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నేను పూజా కార్యక్రమం / జాతక పరిశీలన ముహూర్తం కొరకు సంప్రదిస్తున్నాను.'
  )}`;

  const achievements = [
    {
      icon: Award,
      title: t('15+ ఏళ్ల వేద సంప్రదాయం', '15+ Years of Vedic Heritage'),
      desc: t('స్మార్త వైదిక శాస్త్రాలలో నిష్ణాతులు & గురుపరంపర ప్రముఖ జ్యోతిష్యులు', 'Excellence in Smartha Vedic treatises and authentic Guru Parampara.'),
    },
    {
      icon: Users,
      title: t('5,000+ కుటుంబాల విశ్వాసం', '5,000+ Devotee Families'),
      desc: t('తెలుగు రాష్ట్రాలు మరియు విదేశాలలో అసంఖ్యాక భక్తుల ఆదరణ', 'Trusted guidance across Andhra Pradesh, Telangana, and global NRI communities.'),
    },
    {
      icon: Flame,
      title: t('మహా హోమ క్రతు ప్రవీణులు', 'Master of Sacred Homams'),
      desc: t('చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర హోమాలలో అఖండ ప్రతిభ', 'Accomplished practitioner of Chandi, Lakshmi Ganapathi, Sudarshana, and Rudra homams.'),
    },
    {
      icon: Compass,
      title: t('దోషరహిత సిద్ధ ముహూర్తాలు', 'Flawless Siddha Muhurthams'),
      desc: t('లగ్న శుద్ధితో వివాహం, గృహప్రవేశాలకు శుభప్రదమైన ఫలితాలు', 'Astrological precision for marriage and housewarming with impeccable lagna purity.'),
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
        'Complete birth chart calculations, Dasha-Antardasha analysis, and Shastra-prescribed remedies for career, education, marriage, and progeny.'
      ),
      icon: Star,
      highlight: t('దృక్సిద్ధాంత ప్రామాణికం', 'Drik-Siddhanta Precision'),
    },
    {
      id: 'vastu-consultation',
      title: t('గృహ & వ్యాపార వాస్తు సంప్రదింపులు', 'Home & Commercial Vastu Consultation'),
      desc: t(
        'గృహ నిర్మాణం, ఫ్లాట్స్, విల్లాలు మరియు వ్యాపార సంస్థలలో శక్తి ప్రవాహాన్ని క్రమబద్ధీకరించి, సుఖ సంతోషాలు మరియు వ్యాపార లాభాలు చేకూరేలా వాస్తు సలహాలు.',
        'Harmonizing spatial energy flow in residences, villas, apartments, and business establishments without unnecessary structural demolition.'
      ),
      icon: Compass,
      highlight: t('శాస్త్రోక్త మార్పులు', 'Shastra Compliance'),
    },
  ];

  const testimonials = [
    {
      name: t('రామకృష్ణ శాస్త్రి & కుటుంబం', 'Ramakrishna Sastry & Family'),
      place: t('విజయవాడ', 'Vijayawada'),
      text: t(
        'జల్లవరం సాయి ధీరజ్ శర్మ గారి అమృత ముహూర్తంలో మా అమ్మాయి వివాహం జరిగింది. ధీరజ్ శర్మ గారి వాక్శుద్ధి, శాస్త్ర పరిజ్ఞానం అనితరసాధ్యం. వారి ఆశీస్సులతో నేడు మా కుటుంబం ఎంతో సంతోషంగా ఉంది.',
        'Our daughter’s wedding was conducted under the auspicious muhurtham fixed by Sri Dheeraj Sharma. His Vedic command and astrological expertise are truly exceptional.'
      ),
      rating: 5,
    },
    {
      name: t('శ్రీనివాసరావు (సాఫ్ట్‌వేర్ ఇంజనీర్)', 'Srinivasa Rao (Software Architect)'),
      place: t('హైదరాబాద్', 'Hyderabad'),
      text: t(
        'మా నూతన గృహప్రవేశం మరియు లక్ష్మీ గణపతి హోమం ధీరజ్ శర్మ గారి ఆధ్వర్యంలో ఎంతో భక్తి శ్రద్ధలతో సంపూర్ణంగా జరిగింది. పూజా విధానం, మంత్రాల ఉచ్చారణ అద్భుతం.',
        'Our new housewarming and Lakshmi Ganapathi Homam were performed with profound devotion by Sri Dheeraj Sharma. His ritual precision and authentic mantras gave immense peace.'
      ),
      rating: 5,
    },
    {
      name: t('వెంకటేశ్వర్లు & లక్ష్మి', 'Venkateswarlu & Lakshmi'),
      place: t('తిరుపతి', 'Tirupati'),
      text: t(
        'చాలా కాలంగా పెండింగ్‌లో ఉన్న ఉద్యోగ సమస్యకు ధీరజ్ శర్మ గారి జాతక పరిశీలన మరియు దోష పరిహార హోమం అద్భుత ఫలితాన్ని ఇచ్చింది. సాయి ధీరజ్ శర్మ గారికి మా హృదయపూర్వక ధన్యవాదాలు.',
        'Sri Dheeraj Sharma’s horoscope analysis and remedial homam cleared prolonged career hurdles swiftly. Our heartfelt gratitude to Guruji.'
      ),
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-12 font-telugu">
      {/* 1. Grand Hero Showcase of Sri Dheeraj Sharma Garu */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50 rounded-3xl shadow-2xl border-2 border-amber-600/40 p-6 sm:p-12 lg:p-16">
        {/* Sacred background ambient pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffd166_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Glowing aura circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Sanskrit invocation */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/80 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
              <Sparkles size={14} className="text-amber-400" />
              <span>|| శ్రీ గురుభ్యోన్నమః · శ్రీలక్ష్మి గణపతి ప్రసన్నం ||</span>
            </span>
          </div>

          {/* Hero Profile Block */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 text-center lg:text-left">
            {/* Sri Dheeraj Sharma Garu Profile Portrait inside Circular Golden Frame */}
            <div className="shrink-0 relative group">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-2xl relative">
                <div className="w-full h-full rounded-full bg-amber-950 overflow-hidden border-2 border-amber-300/80 relative shadow-inner">
                  <img
                    src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                    alt="శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white text-xs font-bold px-3.5 py-1 rounded-full border border-amber-300 shadow-lg whitespace-nowrap flex items-center gap-1.5">
                <Award size={13} className="text-amber-300" />
                <span>{t('జ్యోతిష శిరోమణి', 'Jyothisha Shiromani')}</span>
              </div>
            </div>

            {/* Profile Intro & Title */}
            <div className="flex-1 space-y-4">
              <div className="inline-block px-3 py-1 bg-amber-800/80 border border-amber-600/40 rounded-lg text-amber-300 text-xs font-semibold">
                {t('స్మార్త వైదిక పండితులు & జ్యోతిష్యులు', 'Smartha Vedic Scholar & Astrologer')}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                {t('శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Sri Jallavaram Sai Dheeraj Sharma')}
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-medium leading-relaxed max-w-2xl">
                {t(
                  'శాస్త్రోక్త పద్ధతిలో మీ కుటుంబ క్షేమం, వంశాభివృద్ధి, వివాహ, గృహప్రవేశ ముహూర్త నిర్ణయం మరియు సమస్త దోష నివారణ కోసం ప్రత్యక్ష వైదిక సేవలు.',
                  'Direct Vedic consultations, flawless wedding & housewarming muhurthams, and authentic homam ceremonies conducted strictly according to ancient Shastras.'
                )}
              </p>

              {/* Contact direct badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-700/60 text-amber-200">
                  <MapPin size={15} className="text-amber-400" />
                  <span>{t('పసుమాముల, హయత్‌నగర్ (హైదరాబాద్)', 'Hayathnagar, Hyderabad & Tirupati')}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 font-telugu font-bold">
                  <MessageCircle size={15} className="text-emerald-400" />
                  <span>{t('వాట్సాప్:', 'WhatsApp:')} <strong className="font-mono tracking-wide text-white">8977986166</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
                {/* 1. Go to Panchangam sub-menu */}
                <button
                  type="button"
                  onClick={onNavigateToPanchangam}
                  className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-bold rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base"
                >
                  <Calendar size={18} />
                  <span>{t('నిత్య పంచాంగం', 'Daily Panchangam')}</span>
                  <ArrowRight size={16} />
                </button>

                {/* 2. WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  <MessageCircle size={18} />
                  <span>{t('వాట్సాప్ (8977986166)', 'WhatsApp Chat')}</span>
                </a>

                {/* 3. Pooja Booking */}
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="flex items-center gap-2 px-4 py-3.5 bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-500/60 font-semibold rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm"
                >
                  <Flame size={16} className="text-amber-400" />
                  <span>{t('పూజ బుకింగ్', 'Book Pooja / Homam')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Prestigious Credibility Highlights ("Hype ichey vishayalu") */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {achievements.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white border border-amber-200/90 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-amber-950 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 flex items-center gap-1.5 text-xs text-amber-800 font-semibold">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>{t('ప్రామాణిక శాస్త్ర నిరూపితం', 'Authentic Shastric Guidance')}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Today's Panchangam Glance Card (Direct Bridge to Sub-menu) */}
      <section className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full mb-2">
              <Calendar size={14} />
              <span>{t('నేటి పంచాంగ సంక్షిప్త దర్శనం', "Today's Panchangam Glance")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
              {tr(currentDay.teediVaram)}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {tr(currentDay.panchanga.samvatsaram)} · {tr(currentDay.panchanga.masam)}
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToPanchangam}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
          >
            <span>{t('సంపూర్ణ పంచాంగం & రాశి చక్రం తెరవండి', 'Open Full Panchangam & Rasi Chakra')}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-xs text-slate-500 block mb-1">{t('తిథి', 'Tithi')}</span>
            <span className="text-sm sm:text-base font-bold text-amber-950 block">
              {tr(currentDay.panchanga.tithi.split('-')[0].trim())}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-xs text-slate-500 block mb-1">{t('నక్షత్రం', 'Nakshatram')}</span>
            <span className="text-sm sm:text-base font-bold text-amber-950 block">
              {tr(currentDay.panchanga.nakshatram.split('-')[0].trim())}
            </span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-xs text-emerald-800 font-semibold block mb-1">{t('శుభ ముహూర్తం', 'Auspicious Muhurtham')}</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-950 block">
              {tr(currentDay.shubha.abhijit)}
            </span>
          </div>

          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-2xs">
            <span className="text-xs text-rose-800 font-semibold block mb-1">{t('రాహు కాలం', 'Rahu Kalam')}</span>
            <span className="text-xs sm:text-sm font-bold text-rose-950 block">
              {tr(currentDay.ashubha.rahukalam)}
            </span>
          </div>
        </div>

        {/* Special note */}
        {currentDay.phalitham && (
          <div className="mt-5 p-4 rounded-xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm text-amber-950 leading-relaxed flex items-start gap-2.5">
            <Sparkles size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">{t('నేటి ప్రామాణిక విశేషం: ', "Today's Astrological Significance: ")}</strong>
              <span>{tr(currentDay.phalitham)}</span>
            </div>
          </div>
        )}

        {/* Daily Classical Nakshatra & Tithi Article Teaser (Krishna Rau Treatise) */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-900 to-amber-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-600/60 shadow-md">
          <div className="flex items-start gap-3">
            <BookOpen size={22} className="text-amber-400 shrink-0 mt-1" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                {t('ప్రాచీన శాస్త్ర విశ్లేషణ • Classical Nakshatra Article', 'Classical Shastric Analysis • Nakshatra Treatise')}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {t(
                  `నేటి నక్షత్ర ఫల విశ్లేషణ (${currentDay.panchanga.nakshatram.split(/[-–—]/)[0]?.trim()} నక్షత్రం)`,
                  `Today's Nakshatra Phala Analysis (${tr(currentDay.panchanga.nakshatram.split(/[-–—]/)[0]?.trim())})`
                )}
              </h4>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {t(
                  'ఎన్.ఎన్. కృష్ణారావు గారి గ్రంథం ఆధారంగా పాద ఫలాలు, నేడు చేయదగిన శుభ కార్యాలు & యవనాచార్యుల మతం.',
                  'Pada predictions, auspicious deeds permitted today & Yavanacharya traditions based on N.N. Krishna Rau treatise.'
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToPanchangam}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer shadow-sm"
          >
            <span>{t('పూర్తి వ్యాసం చదవండి', 'Read Full Article')}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 4. Core Specialization & Services by Sri Dheeraj Sharma Garu */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Vedic Services & Consultations
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-950">
            {t('శ్రీ ధీరజ్ శర్మ గారి ముఖ్య వైదిక సేవలు', 'Vedic Services by Sri Dheeraj Sharma Garu')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t(
              'సమస్త వైదిక కర్మలు, హోమాలు, ముహూర్త నిర్ణయాలు ప్రాచీన వేదోక్త శాస్త్రాల ప్రకారం స్వయంగా జల్లవరం సాయి ధీరజ్ శర్మ గారిచే నిర్వహించబడును.',
              'All Vedic rituals, sacred homams, and muhurtham determinations are personally conducted according to classical Shastras by Sri Jallavaram Sai Dheeraj Sharma.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {coreServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
                      {service.highlight}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-amber-950 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/918977986166?text=${encodeURIComponent(
                      `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, నాకు "${service.title}" సేవ గురించి వివరాలు మరియు సంప్రదింపు సమయం కావాలి.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-300 transition-colors"
                  >
                    <MessageCircle size={15} />
                    <span>{t('వాట్సాప్‌లో అడగండి (8977986166)', 'Inquire on WhatsApp (8977986166)')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const matched = POOJA_SERVICES.find((p) =>
                        p.teluguName.includes(service.title.split(' ')[0])
                      );
                      onOpenBooking(matched || POOJA_SERVICES[0]);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 hover:text-white hover:bg-amber-800 bg-amber-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <span>{t('పూజ బుకింగ్', 'Book Pooja / Homam')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Devotee Testimonials & Trust */}
      <section className="bg-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-600/40 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-900/80 px-3 py-1 rounded-full border border-amber-600/50">
            {t('భక్తుల అనుభవాలు', 'Devotee Experiences')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {t('భక్తుల అనుభవాలు & కృతజ్ఞతలు', 'Devotee Experiences & Gratitude')}
          </h2>
          <p className="text-amber-200/80 text-sm">
            {t(
              'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆశీస్సులతో శుభకార్యాలు జరుపుకున్న భక్తుల మాటలు.',
              'Heartfelt blessings and testimonials from devotees who performed sacred Vedic ceremonies with Sri Jallavaram Sai Dheeraj Sharma.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((tItem, idx) => (
            <div
              key={idx}
              className="bg-amber-900/60 border border-amber-700/60 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(tItem.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed italic mb-4">
                  "{tItem.text}"
                </p>
              </div>
              <div className="pt-3 border-t border-amber-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-200">{tItem.name}</span>
                <span className="text-amber-400/80">{tItem.place}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Direct Contact & Consultation Card (Highlighting WhatsApp: 8977986166) */}
      <section id="contact-guruji" className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-amber-400/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-amber-700/80 border border-amber-500/60 rounded-full text-xs font-semibold text-amber-200">
              {t('ప్రత్యక్ష & ఆన్‌లైన్ సంప్రదింపులు', 'In-Person & Online Consultations')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {t('ధీరజ్ శర్మ గారితో నేరుగా మాట్లాడండి', 'Speak Directly with Guruji Sri Dheeraj Sharma')}
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
              {t(
                'వివాహం, గృహప్రవేశం, చండీ హోమం, జాతక దోష నివారణ కొరకు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని నేరుగా ఫోన్ లేదా వాట్సాప్ ద్వారా సంప్రదించవచ్చు.',
                'For Vivaha, Gruhapravesam, Chandi Homam, and Jathaka Dosha remedies, consult Sri Jallavaram Sai Dheeraj Sharma directly via phone or WhatsApp.'
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-sm text-amber-200">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-amber-400" />
                <span>{t('పసుమాముల, హయత్‌నగర్', 'Pasumamula, Hayathnagar, Hyderabad')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-amber-400" />
                <span>{t('ఉదయం 06:30 AM – రాత్రి 08:30 PM', '06:30 AM – 08:30 PM (Daily)')}</span>
              </span>
            </div>
          </div>

          {/* Quick Contact Action Box */}
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-4 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
              Official WhatsApp & Phone
            </span>
            <a
              href="tel:+918977986166"
              className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-mono tracking-wider block hover:text-amber-700 transition-colors"
            >
              8977986166
            </a>
            <p className="text-xs text-slate-600">
              {t('శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Sri Jallavaram Sai Dheeraj Sharma Garu')}
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle size={20} />
              <span>{t('వాట్సాప్ చాట్ ప్రారంభించండి', 'Start WhatsApp Chat')}</span>
            </a>

            <a
              href="tel:+918977986166"
              className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={16} />
              <span>{t('కాల్ చేయండి (+91 8977986166)', 'Call Now (+91 8977986166)')}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

