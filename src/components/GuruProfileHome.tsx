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
  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నేను పూజా కార్యక్రమం / జాతక పరిశీలన ముహూర్తం కొరకు సంప్రదిస్తున్నాను.'
  )}`;

  const achievements = [
    {
      icon: Award,
      title: '15+ ఏళ్ల వేద సంప్రదాయం',
      desc: 'స్మార్త వైదిక శాస్త్రాలలో నిష్ణాతులు & గురుపరంపర ప్రముఖ జ్యోతిష్యులు',
    },
    {
      icon: Users,
      title: '5,000+ కుటుంబాల విశ్వాసం',
      desc: 'తెలుగు రాష్ట్రాలు మరియు విదేశాలలో అసంఖ్యాక భక్తుల ఆదరణ',
    },
    {
      icon: Flame,
      title: 'మహా హోమ క్రతు ప్రవీణులు',
      desc: 'చండీ, లక్ష్మీ గణపతి, సుదర్శన, రుద్ర హోమాలలో అఖండ ప్రతిభ',
    },
    {
      icon: Compass,
      title: 'దోషరహిత సిద్ధ ముహూర్తాలు',
      desc: 'లగ్న శుద్ధితో వివాహం, గృహప్రవేశాలకు శుభప్రదమైన ఫలితాలు',
    },
  ];

  const coreServices = [
    {
      id: 'vivaha-muhurtham',
      title: 'వివాహ & గృహప్రవేశ ముహూర్త నిర్ణయం',
      desc: 'దంపతుల జన్మ నక్షత్రాలు, లగ్న శుద్ధి మరియు గురు-శుక్ర బలాలను పరిశీలించి అన్యోన్య దాంపత్యం, గృహ శాంతిని ప్రసాదించే అమృత ముహూర్తాల నిర్ణయం.',
      icon: Home,
      highlight: 'అత్యంత ప్రజాదరణ పొందిన సేవ',
    },
    {
      id: 'chandi-homam',
      title: 'శ్రీ చండీ & లక్ష్మీ గణపతి మహా హోమం',
      desc: 'శత్రు బాధలు, నరదృష్టి, ఆర్థిక సంక్షోభాలు తొలగి అఖండ విజయాలు, అష్టైశ్వర్యాలు సిద్ధించేలా శాస్త్రోక్తంగా స్వయంగా మంత్రోచ్ఛారణతో హోమ క్రతువు నిర్వహణ.',
      icon: Flame,
      highlight: 'సర్వ సంకట నివారణ',
    },
    {
      id: 'jathaka-parisheelana',
      title: 'ఖచ్చితమైన జాతక విశ్లేషణ & దోష నివారణ',
      desc: 'జన్మ కుండలి, రాశి చక్రం, దశ-అంతర్దశల సమగ్ర గణనతో ఉద్యోగం, విద్య, వివాహం, సంతాన ప్రాప్తి కోసం సరళమైన వేద పరిహారాల మార్గదర్శనం.',
      icon: Star,
      highlight: 'దృక్సిద్ధాంత ప్రామాణికం',
    },
    {
      id: 'vastu-consultation',
      title: 'గృహ & వ్యాపార వాస్తు సంప్రదింపులు',
      desc: 'గృహ నిర్మాణం, ఫ్లాట్స్, విల్లాలు మరియు వ్యాపార సంస్థలలో శక్తి ప్రవాహాన్ని క్రమబద్ధీకరించి, సుఖ సంతోషాలు మరియు వ్యాపార లాభాలు చేకూరేలా వాస్తు సలహాలు.',
      icon: Compass,
      highlight: 'శాస్త్రోక్త మార్పులు',
    },
  ];

  const testimonials = [
    {
      name: 'రామకృష్ణ శాస్త్రి & కుటుంబం',
      place: 'విజయవాడ',
      text: 'జల్లవరం సాయి ధీరజ్ శర్మ గారి అమృత ముహూర్తంలో మా అమ్మాయి వివాహం జరిగింది. ధీరజ్ శర్మ గారి వాక్శుద్ధి, శాస్త్ర పరిజ్ఞానం అనితరసాధ్యం. వారి ఆశీస్సులతో నేడు మా కుటుంబం ఎంతో సంతోషంగా ఉంది.',
      rating: 5,
    },
    {
      name: 'శ్రీనివాసరావు (సాఫ్ట్‌వేర్ ఇంజనీర్)',
      place: 'హైదరాబాద్',
      text: 'మా నూతన గృహప్రవేశం మరియు లక్ష్మీ గణపతి హోమం ధీరజ్ శర్మ గారి ఆధ్వర్యంలో ఎంతో భక్తి శ్రద్ధలతో సంపూర్ణంగా జరిగింది. పూజా విధానం, మంత్రాల ఉచ్చారణ అద్భుతం.',
      rating: 5,
    },
    {
      name: 'వెంకటేశ్వర్లు & లక్ష్మి',
      place: 'తిరుపతి',
      text: 'చాలా కాలంగా పెండింగ్‌లో ఉన్న ఉద్యోగ సమస్యకు ధీరజ్ శర్మ గారి జాతక పరిశీలన మరియు దోష పరిహార హోమం అద్భుత ఫలితాన్ని ఇచ్చింది. సాయి ధీరజ్ శర్మ గారికి మా హృదయపూర్వక ధన్యవాదాలు.',
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
                <span>జ్యోతిష శిరోమణి</span>
              </div>
            </div>

            {/* Profile Intro & Title */}
            <div className="flex-1 space-y-4">
              <div className="inline-block px-3 py-1 bg-amber-800/80 border border-amber-600/40 rounded-lg text-amber-300 text-xs font-semibold">
                స్మార్త వైదిక పండితులు & జ్యోతిష్యులు
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-medium leading-relaxed max-w-2xl">
                శాస్త్రోక్త పద్ధతిలో మీ కుటుంబ క్షేమం, వంశాభివృద్ధి, వివాహ, గృహప్రవేశ ముహూర్త నిర్ణయం మరియు సమస్త దోష నివారణ కోసం ప్రత్యక్ష వైదిక సేవలు.
              </p>

              {/* Contact direct badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-700/60 text-amber-200">
                  <MapPin size={15} className="text-amber-400" />
                  <span>పసుమాముల, హయత్‌నగర్ (హైదరాబాద్)</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 font-telugu font-bold">
                  <MessageCircle size={15} className="text-emerald-400" />
                  <span>వాట్సాప్: <strong className="font-mono tracking-wide text-white">8977986166</strong></span>
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
                  <span>నిత్య పంచాంగం</span>
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
                  <span>వాట్సాప్ (8977986166)</span>
                </a>

                {/* 3. Pooja Booking */}
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="flex items-center gap-2 px-4 py-3.5 bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-500/60 font-semibold rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm"
                >
                  <Flame size={16} className="text-amber-400" />
                  <span>పూజ బుకింగ్</span>
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
                <span>ప్రామాణిక శాస్త్ర నిరూపితం</span>
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
              <span>నేటి పంచాంగ సంక్షిప్త దర్శనం</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
              {currentDay.teediVaram}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {currentDay.panchanga.samvatsaram} · {currentDay.panchanga.masam}
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToPanchangam}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
          >
            <span>సంపూర్ణ పంచాంగం & రాశి చక్రం తెరవండి</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-xs text-slate-500 block mb-1">తిథి</span>
            <span className="text-sm sm:text-base font-bold text-amber-950 block">
              {currentDay.panchanga.tithi.split('-')[0].trim()}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-xs text-slate-500 block mb-1">నక్షత్రం</span>
            <span className="text-sm sm:text-base font-bold text-amber-950 block">
              {currentDay.panchanga.nakshatram.split('-')[0].trim()}
            </span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-xs text-emerald-800 font-semibold block mb-1">శుభ ముహూర్తం</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-950 block">
              {currentDay.shubha.abhijit}
            </span>
          </div>

          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-2xs">
            <span className="text-xs text-rose-800 font-semibold block mb-1">రాహు కాలం</span>
            <span className="text-xs sm:text-sm font-bold text-rose-950 block">
              {currentDay.ashubha.rahukalam}
            </span>
          </div>
        </div>

        {/* Special note */}
        {currentDay.phalitham && (
          <div className="mt-5 p-4 rounded-xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm text-amber-950 leading-relaxed flex items-start gap-2.5">
            <Sparkles size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">నేటి ప్రామాణిక విశేషం: </strong>
              <span>{currentDay.phalitham}</span>
            </div>
          </div>
        )}
      </section>

      {/* 4. Core Specialization & Services by Sri Dheeraj Sharma Garu */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Vedic Services & Consultations
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-950">
            శ్రీ ధీరజ్ శర్మ గారి ముఖ్య వైదిక సేవలు
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            సమస్త వైదిక కర్మలు, హోమాలు, ముహూర్త నిర్ణయాలు ప్రాచీన వేదోక్త శాస్త్రాల ప్రకారం స్వయంగా జల్లవరం సాయి ధీరజ్ శర్మ గారిచే నిర్వహించబడును.
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
                    <span>వాట్సాప్‌లో అడగండి (8977986166)</span>
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
                    <span>పూజ బుకింగ్</span>
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
            Devotee Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            భక్తుల అనుభవాలు & కృతజ్ఞతలు
          </h2>
          <p className="text-amber-200/80 text-sm">
            శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆశీస్సులతో శుభకార్యాలు జరుపుకున్న భక్తుల మాటలు.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-amber-900/60 border border-amber-700/60 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed italic mb-4">
                  "{t.text}"
                </p>
              </div>
              <div className="pt-3 border-t border-amber-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-200">{t.name}</span>
                <span className="text-amber-400/80">{t.place}</span>
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
              ప్రత్యక్ష & ఆన్‌లైన్ సంప్రదింపులు
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              ధీరజ్ శర్మ గారితో నేరుగా మాట్లాడండి
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
              వివాహం, గృహప్రవేశం, చండీ హోమం, జాతక దోష నివారణ కొరకు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని నేరుగా ఫోన్ లేదా వాట్సాప్ ద్వారా సంప్రదించవచ్చు.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-sm text-amber-200">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-amber-400" />
                <span>పసుమాముల, హయత్‌నగర్ (Pasumamula, Hayathnagar)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-amber-400" />
                <span>ఉదయం 06:30 AM – రాత్రి 08:30 PM</span>
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
              శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle size={20} />
              <span>వాట్సాప్ చాట్ ప్రారంభించండి</span>
            </a>

            <a
              href="tel:+918977986166"
              className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={16} />
              <span>కాల్ చేయండి (+91 8977986166)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
