import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Flame,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Star,
  Users,
  Compass,
  Heart,
  ZoomIn,
  X,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutGurujiSectionProps {
  onOpenBooking: () => void;
}

interface HonorHighlight {
  id: string;
  titleTe: string;
  titleEn: string;
  badgeTe: string;
  venueTe: string;
  image: string;
  descriptionTe: string;
}

const HONORS_SHOWCASE: HonorHighlight[] = [
  {
    id: 'tirupati-shiromani',
    titleTe: 'జ్యోతిష శిరోమణి పురస్కారం (తిరుపతి మహతి ఆడిటోరియం)',
    titleEn: 'Jyotish Shiromani Award – Tirupati Mahati Auditorium',
    badgeTe: 'తిరుపతి వేదిక • తితిదే సమక్షం',
    venueTe: 'మహతి ఆడిటోరియం, తిరుపతి (11 డిసెంబర్ 2024)',
    image: '/assets/aistudio/photo_6303093205754826521_y_89d76f49.jpg',
    descriptionTe:
      'తిరుపతి మహతి ఆడిటోరియంలో వేలాది పండితులు మరియు జ్యోతిష జిజ్ఞాసువుల సమక్షంలో బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారికి "జ్యోతిష శిరోమణి" బిరుదు ప్రదానం చేయబడింది.',
  },
  {
    id: 'suvarna-kankanam',
    titleTe: 'సువర్ణ కంకణ పురస్కారం (విజయవాడ రాష్ట్ర స్థాయి సదస్సు)',
    titleEn: 'Suvarna Kankanam Award – Vijayawada State Conference',
    badgeTe: 'స్వర్ణ కంకణ సత్కారం',
    venueTe: 'గోల్డెన్ వే సభా ప్రాంగణం, విజయవాడ (23 మార్చి 2025)',
    image: '/assets/aistudio/photo_6307643032115201101_y_2acdb7f1.jpg',
    descriptionTe:
      'విశ్వజ్యోతి జ్యోతిష విజ్ఞాన సంస్థ ఆధ్వర్యంలో 15వ వేద జ్యోతిష సదస్సులో పీఠాధిపతులచే శ్రీ ధీరజ్ శర్మ గారి హస్తానికి ప్రతిష్టాత్మక "సువర్ణ కంకణం" ధరింపజేసి సత్కరించారు.',
  },
  {
    id: 'mahati-speech',
    titleTe: 'మహతి వేదికపై జ్యోతిష సిద్ధాంత కీలక ప్రసంగం',
    titleEn: 'Keynote Address on Vedic Siddhanta at Mahati Auditorium',
    badgeTe: 'సిద్ధాంత ప్రసంగం',
    venueTe: 'మహతి కళాక్షేత్రం, తిరుపతి',
    image: '/assets/aistudio/photo_6303093205754826522_y_524d966b.jpg',
    descriptionTe:
      'ప్రాచీన సూర్య సిద్ధాంత కాలగణన, దృక్సిద్ధాంత పంచాంగం మరియు ఆధునిక ఖగోళ శాస్త్రాల అనుసంధానంపై వేదికపై శ్రీ ధీరజ్ శర్మ గారు అందించిన పరిశోధనాత్మక ప్రసంగం.',
  },
  {
    id: 'global-prestigious',
    titleTe: 'గ్లోబల్ ప్రెస్టీజియస్ అవార్డు – 2024 (హైదరాబాద్)',
    titleEn: 'Global Prestigious Award 2024 – Hyderabad',
    badgeTe: 'గ్లోబల్ ఎక్సలెన్స్',
    venueTe: 'సుదర్శన్ కన్వెన్షన్, హైదరాబాద్',
    image: '/assets/aistudio/photo_6303093205754826524_y_b83c00d0.jpg',
    descriptionTe:
      'సమాజ హిత జ్యోతిష సేవలు మరియు వేలాది తెలుగు కుటుంబాలకు అందించిన నిష్కళంక ధార్మిక సలహాలకు గుర్తింపుగా ప్రదానం చేయబడిన అవార్డు.',
  },
];

export const AboutGurujiSection: React.FC<AboutGurujiSectionProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState<HonorHighlight | null>(null);

  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, మీ మార్గదర్శకత్వం మరియు జాతక సంప్రదింపుల కోసం సంప్రదిస్తున్నాను.'
  )}`;

  return (
    <div className="space-y-12 font-telugu max-w-6xl mx-auto py-4">
      {/* 1. Grand Hero Profile Banner */}
      <section className="bg-gradient-to-br from-amber-950 via-[#3b1207] to-stone-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border-2 border-amber-500/60 relative overflow-hidden">
        {/* Subtle decorative temple background overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Guruji Portrait with Divine Aura */}
          <div className="shrink-0 text-center">
            <div className="relative inline-block">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 shadow-2xl mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-200 bg-amber-950">
                  <img
                    src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                    alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (Brahmasri Jallavaram Sai Dheeraj Sharma)"
                    width={224}
                    height={224}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              {/* Verified Scholar Floating Badge */}
              <div className="absolute bottom-1 right-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3 py-1 rounded-full text-xs font-bold border border-emerald-300 shadow-md flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>ధర్మశాస్త్ర ప్రమాణం</span>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <span className="inline-block px-3.5 py-1 bg-amber-900/90 text-amber-200 text-xs rounded-full border border-amber-500/50 font-bold tracking-wide">
                15+ సంవత్సరాల వేద-జ్యోతిష అనుభవం
              </span>
            </div>
          </div>

          {/* Biography & Titles */}
          <div className="space-y-4 text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
              <span>卐</span> స్మార్త వేద విద్వాంసులు &amp; దృక్సిద్ధాంత జ్యోతిష శిరోమణి <span>卐</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-100 tracking-tight leading-tight">
              బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
            </h1>
            <p className="text-amber-300 text-sm sm:text-base font-semibold">
              Brahmasri Jallavaram Sai Dheeraj Sharma · Sri Lakshmi Ganapathi Jyothishalayam, Hyderabad
            </p>

            <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-3xl">
              స్మార్త వైదిక గురుకుల సంప్రదాయంలో నిష్ణాతులై, దృక్సిద్ధాంత ఖగోళ గణితం ఆధారంగా జాతక విశ్లేషణ,
              వివాహ పొంతన, నవగ్రహ శాంతి మరియు వైదిక హోమ క్రతువులను శాస్త్రోక్తంగా నిర్వహిస్తున్న ప్రముఖ జ్యోతిష విద్వాంసులు.
              సనాతన ధర్మ సూత్రాలను అనుసరిస్తూ మూఢనమ్మకాలకు తావులేకుండా, స్పష్టమైన మరియు నిర్భయమైన వేద మార్గదర్శకత్వాన్ని
              తెలుగు రాష్ట్రాలు మరియు ప్రపంచవ్యాప్తంగా ఉన్న వేలాది కుటుంబాలకు అందిస్తున్నారు.
            </p>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200 font-semibold">
                🏆 జ్యోతిష శిరోమణి (తిరుపతి)
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200 font-semibold">
                ✨ సువర్ణ కంకణ గ్రహీత (విజయవాడ)
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200 font-semibold">
                🪔 చండీ &amp; గణపతి హోమకర్త
              </span>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-3 flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
              >
                <MessageCircle size={17} />
                <span>వాట్సాప్‌లో మాట్లాడండి</span>
              </a>

              <a
                href="tel:+918977986166"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
              >
                <Phone size={16} />
                <span>+91 89779 86166</span>
              </a>

              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-sm rounded-xl border border-amber-500/50 shadow-lg transition cursor-pointer"
              >
                <Sparkles size={16} className="text-amber-400" />
                <span>జాతక సంప్రదింపు బుకింగ్</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Statistics & Impact Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-950">15+ ఏళ్లు</div>
          <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">నిరంతర వేద-జ్యోతిష సేవ</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-950">25,000+</div>
          <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">పరిశీలించిన జాతక కుండలులు</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-950">1,200+</div>
          <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">నిర్వహించిన వైదిక హోమాలు</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-950">12+ దేశాలు</div>
          <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">ప్రవాస తెలుగు భక్తుల ఆదరణ</div>
        </div>
      </section>

      {/* 3. The 3 Sacred Pillars of Guruji's Practice */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            సిద్ధాంత ప్రమాణాలు • Foundational Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-2">
            గురువు గారి జ్యోతిష నిర్వహణ విశిష్టతలు
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            ప్రాచీన ఆగమ గ్రంథాలు, పరాశర హోరా శాస్త్రం మరియు దృక్సిద్ధాంత గణితాల సమ్మేళనం.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-2">
          {/* Pillar 1 */}
          <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-amber-950">ప్రామాణిక వేద గురుపరంపర</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              తరతరాల పూర్వీకుల వేద సంస్కృతిని పుణికిపుచ్చుకుని, ఆగమ శాస్త్ర అధ్యయనంతో స్మార్త సంప్రదాయ విధులను నిర్దుష్టంగా నిర్వహిస్తారు.
              అథర్వణ వేద, పరాశర, జైమిని సూత్రాల ప్రకారం ఖచ్చితమైన విశ్లేషణ చేస్తారు.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Compass size={24} />
            </div>
            <h3 className="text-lg font-bold text-amber-950">ఖగోళ దృక్సిద్ధాంత గణితం</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              రెండు వందల ఏళ్ల పాత కాలిక్యులేషన్లకు స్వస్తి చెప్పి, ప్రత్యక్ష ఖగోళ గ్రహ గమనం (NASA JPL ఆధారిత దృక్సిద్ధాంతం) తో
              లగ్న స్ఫుటాలు, దశా-భుక్తులు మరియు గోచార ఫలితాలను నిష్కళంకంగా గణిస్తారు.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-bold text-amber-950">భయపెట్టని సరళ పరిహారాలు</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              దోషాల పేరుతో భయభ్రాంతులకు గురిచేయకుండా, మనోబలాన్ని పెంచే జపాలు, నిత్య స్తోత్రాలు, దానాలు, దీపారాధన మరియు
              సరళమైన పూజా విధానాల ద్వారానే గ్రహ అనుకూలతను సాధించేలా నడిపిస్తారు.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Honors, Awards & Visual Photographic Evidence */}
      <section className="bg-gradient-to-b from-amber-50/60 to-white rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full border border-amber-300">
              అధికారిక గౌరవాలు • Honors &amp; Felicitations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-2">
              రాష్ట్ర &amp; జాతీయ స్థాయి పురస్కారాలు (ప్రత్యక్ష ఛాయాచిత్రాలు)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              తిరుపతి తిరుమల దేవస్థాన మహతి ఆడిటోరియం మరియు విజయవాడ వేదికలపై లభించిన ఘన సత్కారాలు.
            </p>
          </div>
          <span className="text-xs text-amber-900 font-semibold bg-white px-3 py-1.5 rounded-xl border border-amber-200">
            ఫోటోపై క్లిక్ చేసి పెద్దగా చూడవచ్చు 🔍
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HONORS_SHOWCASE.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="bg-white rounded-2xl border-2 border-amber-200/90 hover:border-amber-500 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-amber-950">
                  <img
                    src={item.image}
                    alt={item.titleTe}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-900/90 text-amber-200 border border-amber-400 text-[10px] font-bold">
                    {item.badgeTe}
                  </span>
                  <span className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/90 text-amber-950 flex items-center justify-center text-xs shadow">
                    <ZoomIn size={14} />
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-amber-950 group-hover:text-amber-800 transition line-clamp-2">
                    {item.titleTe}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium">
                    <MapPin size={12} className="shrink-0 text-amber-600" />
                    <span className="truncate">{item.venueTe}</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.descriptionTe}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1">
                <span className="text-xs font-bold text-amber-900 group-hover:text-amber-700 flex items-center gap-1">
                  <span>వివరాలు చూడండి</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How a Consultation Works with Guruji (Step-by-Step) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            సంప్రదింపుల విధానం • Consultation Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-2">
            గురువు గారిని ఎలా సంప్రదించాలి?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            హైదరాబాద్ కార్యాలయంలో ప్రత్యక్షంగా లేదా ప్రపంచంలో ఎక్కడినుండైనా ఫోన్/వాట్సాప్ ద్వారా మాట్లాడవచ్చు.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 relative">
            <span className="w-7 h-7 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center mb-3">
              1
            </span>
            <h4 className="font-bold text-amber-950 text-base mb-1.5">వివరాలు పంపండి</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              మీ పుట్టిన తేదీ, సమయం, పుట్టిన ఊరు మరియు మీ ప్రధాన ప్రశ్న లేదా సమస్యను వాట్సాప్ లేదా ఫారమ్ ద్వారా నమోదు చేయండి.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 relative">
            <span className="w-7 h-7 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center mb-3">
              2
            </span>
            <h4 className="font-bold text-amber-950 text-base mb-1.5">కుండలి విశ్లేషణ</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              గురువు గారు మీ లగ్న కుండలి, నవాంశ, దశా-భుక్తులు మరియు ప్రస్తుత గోచార శని, గురు, రాహు-కేతువుల స్థితులను స్వయంగా గణిస్తారు.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 relative">
            <span className="w-7 h-7 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center mb-3">
              3
            </span>
            <h4 className="font-bold text-amber-950 text-base mb-1.5">ప్రత్యక్ష సంభాషణ</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              ఫోన్ కాల్ లేదా ముఖాముఖి భేటీలో మీ సందేహాలన్నింటికీ నిశిత సమాధానాలు, భవిష్యత్ కాలమానం మరియు సరైన దిశానిర్దేశం పొందుతారు.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 relative">
            <span className="w-7 h-7 rounded-full bg-amber-800 text-amber-100 text-xs font-bold flex items-center justify-center mb-3">
              4
            </span>
            <h4 className="font-bold text-amber-950 text-base mb-1.5">శాస్త్రోక్త పరిష్కారాలు</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              గ్రహ శాంతి స్తోత్రాలు, దాన ధర్మాలు మరియు అవసరమైతే నిర్వహించవలసిన పూజా-హోమ ముహూర్తాలను వివరంగా తెలియజేస్తారు.
            </p>
          </div>
        </div>
      </section>
      {/* 6. Office Location & Timings Details Card */}
      <section className="bg-gradient-to-r from-[#2a0c03] via-[#3b1207] to-[#1f0601] text-amber-100 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-amber-500/60 shadow-xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-900/60 px-3 py-1 rounded-full border border-amber-500/40">
              పీఠ దర్శనం &amp; కార్యాలయ వివరాలు
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              హైదరాబాద్ నగరంలోని ప్రశాంతమైన వాతావరణంలో స్థాపించబడిన మా జ్యోతిషాలయంలో నిత్యం లక్ష్మీ గణపతి పూజలు,
              జాతక పరిశీలనలు మరియు ముహూర్త నిర్ణయాలు జరుగుతుంటాయి.
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={17} className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>చిరునామా:</strong> పసుమాముల, హయత్‌నగర్, హైదరాబాద్, తెలంగాణ – 501505
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={17} className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>సందర్శన సమయాలు:</strong> ఉదయం 06:30 AM – 12:30 PM | సాయంత్రం 04:30 PM – 08:30 PM
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={17} className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>ప్రత్యక్ష సంప్రదింపు ఫోన్:</strong> +91 89779 86166 (కాల్ / వాట్సాప్)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-6 space-y-4 text-center">
            <h4 className="text-lg font-bold text-amber-200">
              ఆన్‌లైన్ లేదా ముఖాముఖి సంప్రదింపు నమోదు
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              వివాహం, గృహప్రవేశం, కెరీర్, వ్యాపారం, సంతానం లేదా తీవ్ర గ్రహదోష పరిహారాల కొరకు గురువు గారి వ్యక్తిగత సమయం కొరకు ముందస్తుగా సంప్రదించండి.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition"
              >
                <MessageCircle size={16} />
                <span>వాట్సాప్‌లో సంప్రదించండి</span>
              </a>
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm rounded-xl shadow transition cursor-pointer"
              >
                <Calendar size={16} />
                <span>అపాయింట్‌మెంట్ బుక్ చేయండి</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Photo Zoom */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-stone-900 border-2 border-amber-500 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="relative max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.titleTe}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 space-y-2 text-stone-100">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold">
                {selectedPhoto.badgeTe}
              </div>
              <h3 className="text-lg font-bold text-amber-100">{selectedPhoto.titleTe}</h3>
              <p className="text-xs text-amber-300 flex items-center gap-1.5">
                <MapPin size={13} />
                <span>{selectedPhoto.venueTe}</span>
              </p>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
                {selectedPhoto.descriptionTe}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
