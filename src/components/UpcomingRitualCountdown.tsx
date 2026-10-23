import React, { useState, useEffect } from 'react';
import { 
  Flame, Calendar, Clock, MapPin, Sparkles, 
  ArrowRight, MessageCircle, CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { PoojaService } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

export interface UpcomingEvent {
  id: string;
  teluguTitle: string;
  englishTitle: string;
  category: 'homam' | 'abhishekam' | 'yagnam';
  targetDateISO: string; // ISO 8601 string for countdown
  dateDisplayTelugu: string;
  dateDisplayEnglish: string;
  timeTelugu: string;
  timeEnglish: string;
  muhurthamSignificanceTelugu: string;
  muhurthamSignificanceEnglish: string;
  venueTelugu: string;
  venueEnglish: string;
  descriptionTelugu: string;
  descriptionEnglish: string;
  benefitsTelugu: string[];
  benefitsEnglish: string[];
  ritualsTelugu: string[];
  ritualsEnglish: string[];
  priestNoteTelugu: string;
  priestNoteEnglish: string;
  poojaServiceMatch?: Partial<PoojaService>;
}

export const UPCOMING_RITUALS: UpcomingEvent[] = [
  {
    id: 'chandi-rudra-maha-yagnam',
    teluguTitle: 'శ్రీ మహా చండీ సహిత అతిరుద్ర మహాయజ్ఞం',
    englishTitle: 'Sri Maha Chandi Sahitha Atirudra Maha Yagnam',
    category: 'yagnam',
    targetDateISO: '2026-11-15T07:30:00+05:30',
    dateDisplayTelugu: '15 నవంబర్ 2026 (కార్తీక సోమవారం)',
    dateDisplayEnglish: 'November 15, 2026 (Kartika Somavaram)',
    timeTelugu: 'ఉదయం 07:30 AM నుండి మధ్యాహ్నం 01:30 PM వరకు',
    timeEnglish: '07:30 AM to 01:30 PM IST',
    muhurthamSignificanceTelugu: 'కార్తీక శుద్ధ షష్ఠి - కుమార షష్ఠి శుభ ముహూర్తం (అత్యంత శక్తివంతమైన క్షణం)',
    muhurthamSignificanceEnglish: 'Kartika Shuddha Shashthi — Highly Auspicious Divine Alignment',
    venueTelugu: 'శ్రీలక్ష్మి గణపతి వైదిక క్షేత్రం, తిరుపతి (Live Webcast for USA & Global NRIs)',
    venueEnglish: 'Sreelakshmi Ganapathi Vedic Kshetram, Tirupati (Live Webcast for NRIs & Global Devotees)',
    descriptionTelugu: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో 11 మంది స్మార్త వేద పండితులచే సంపూర్ణ చండీ సప్తశతి పారాయణం, మహన్యాసపూర్వక ఏకాదశ రుద్రాభిషేకం మరియు మహా పూర్ణాహుతి శాస్త్రోక్తంగా నిర్వహించబడును.',
    descriptionEnglish: 'Conducted under the personal auspices of Sri Jallavaram Sai Dheeraj Sharma with 11 Vedic scholars. Features complete Chandi Saptashati parayanam, Ekadasa Rudrabhishekam with Mahanyasam, and Maha Purnahuti.',
    benefitsTelugu: [
      'సకల గ్రహ దోష నివారణ & అష్టమ శని, ఏలినాటి శని ఉపశమనం',
      'శత్రుపీడా నివారణ & సమస్త ఋణ విముక్తి',
      'కుటుంబంలో దీర్ఘకాలిక శాంతి, ఆయురారోగ్య ఐశ్వర్య సిద్ధి',
      'వ్యాపార, ఉద్యోగ రంగాలలో ఆకస్మిక రాజయోగ ప్రాప్తి'
    ],
    benefitsEnglish: [
      'Alleviation of severe planetary doshas, Sade Sati & Ashtama Shani',
      'Neutralization of negative energies, hidden rivals, and financial debts',
      'Lasting peace, health, harmony, and prosperity for the entire family',
      'Breakthrough success and auspicious Rajayoga in business and career'
    ],
    ritualsTelugu: [
      'గణపతి పూజ & పుణ్యాహవాచనం',
      'మహన్యాసపూర్వక ఏకాదశ రుద్రాభిషేకం',
      'శ్రీ చండీ నవాక్షరీ మూలమంత్ర జపం & సప్తశతి హోమం',
      'సువాసినీ పూజ, కన్యా పూజ & మహా పూర్ణాహుతి',
      'రక్షా సూత్ర ధారణ & పవిత్ర భస్మ ప్రసాదం కొరియర్ ద్వారా పంపబడును'
    ],
    ritualsEnglish: [
      'Ganapathi Pooja & Sacred Punyahavachanam',
      'Mahanyasa-purvaka Ekadasa Rudrabhishekam',
      'Sri Chandi Navakshari Moola Mantra Japa & Saptashati Homam',
      'Suvasini Pooja, Kanya Pooja & Sacred Maha Purnahuti',
      'Sanctified Raksha Sutra & Bhasma Prasadam shipped to registered devotees'
    ],
    priestNoteTelugu: 'శ్రీ ధీరజ్ శర్మ గారు స్వయంగా ప్రతి భక్తుని గోత్ర నామాలతో ప్రత్యక్ష సంకల్పం చేయుదురు. ప్రత్యక్షంగా హాజరు కాలేని భక్తులకు లైవ్ లింక్ మరియు సంకల్ప వీడియో పంపబడును.',
    priestNoteEnglish: 'Sri Dheeraj Sharma will personally chant each devotee family’s Gotranamalu during the sacred Sankalpam. A private Live webcast link and personalized Sankalpam video will be sent to remote & NRI devotees.',
    poojaServiceMatch: {
      id: 'chandi-homam',
      name: 'Maha Chandi Homam',
      teluguName: 'శ్రీ మహా చండీ సహిత అతిరుద్ర మహాయజ్ఞం'
    }
  },
  {
    id: 'lakshmi-kubera-dhana-prapti',
    teluguTitle: 'శ్రీ లక్ష్మీ కుబేర ధన ప్రాప్తి మహాయాగం',
    englishTitle: 'Sri Lakshmi Kubera Dhana Prapti Maha Yagam',
    category: 'homam',
    targetDateISO: '2026-11-27T08:30:00+05:30',
    dateDisplayTelugu: '27 నవంబర్ 2026 (మార్గశిర శుక్ల గురువారం)',
    dateDisplayEnglish: 'November 27, 2026 (Margashira Shukla Guruvaram)',
    timeTelugu: 'ఉదయం 08:30 AM నుండి 12:30 PM వరకు',
    timeEnglish: '08:30 AM to 12:30 PM IST',
    muhurthamSignificanceTelugu: 'కనకధార యోగం & ధన త్రయోదశి శుభ ముహూర్తం',
    muhurthamSignificanceEnglish: 'Kanakadhara Yoga — Sovereign Wealth & Abundance Alignment',
    venueTelugu: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం యాగశాల, తిరుపతి',
    venueEnglish: 'Sreelakshmi Ganapathi Yagashala, Tirupati (Global Live Stream)',
    descriptionTelugu: 'ఆర్థిక ఇబ్బందుల నుండి విముక్తి, వ్యాపార విస్తరణ మరియు స్థిర లక్ష్మీ కటాక్షం కోసం నిర్వహించబడే పరమ పవిత్రమైన కుబేర పాశుపత లక్ష్మీ యజ్ఞం.',
    descriptionEnglish: 'An authentic Vedic rite invoking Goddess Mahalakshmi and Lord Kubera for elimination of persistent financial blockages, steady prosperity, and sustainable wealth.',
    benefitsTelugu: [
      'దీర్ఘకాలిక వ్యాపార నష్టాల నివారణ & క్రయవిక్రయ లాభం',
      'గృహ ప్రాప్తి, స్థిరాస్తి కొనుగోలులో ఆటంకాలు తొలగింపు',
      'కుబేర యంత్ర సిద్ధి & అఖండ సంపద వృద్ధి'
    ],
    benefitsEnglish: [
      'Elimination of persistent business losses and commercial roadblocks',
      'Removes obstacles in acquiring property, homes, and land assets',
      'Consecration of energized Kubera Yantram for perpetual abundance'
    ],
    ritualsTelugu: [
      'కనకధార స్తోత్ర పారాయణం',
      'శ్రీసూక్త విధాతృ హోమం & పాయసాన్న ఆహుతులు',
      'కుబేర మంత్ర సంపుటిక హోమం & స్వర్ణ పుష్పార్చన'
    ],
    ritualsEnglish: [
      'Kanakadhara Stotra Parayanam with 1008 chants',
      'Sri Sukta Vidhatru Homam with sacred ghee and payasam offerings',
      'Kubera Mantra Samputika Homam & Consecrated Golden Flower Pooja'
    ],
    priestNoteTelugu: 'ఈ యాగంలో పాల్గొనే భక్తులకు పూజించిన కుబేర నాణెం మరియు లక్ష్మీ రక్షా తాయెత్తు పంపబడును.',
    priestNoteEnglish: 'Sanctified Kubera coin and Lakshmi Raksha coin will be consecrated and delivered to registered families.',
    poojaServiceMatch: {
      id: 'ganapathi-homam',
      name: 'Lakshmi Kubera Maha Yagam',
      teluguName: 'శ్రీ లక్ష్మీ కుబేర ధన ప్రాప్తి మహాయాగం'
    }
  },
  {
    id: 'kartika-deepotsavam-rudrabhishekam',
    teluguTitle: 'కార్తీక పూర్ణిమ జ్వాలా తోరణం & కోటి దీపోత్సవం',
    englishTitle: 'Kartika Pournami Jwala Toranam & Koti Deepotsavam',
    category: 'abhishekam',
    targetDateISO: '2026-11-24T18:00:00+05:30',
    dateDisplayTelugu: '24 నవంబర్ 2026 (కార్తీక పౌర్ణమి)',
    dateDisplayEnglish: 'November 24, 2026 (Kartika Pournami)',
    timeTelugu: 'సాయంత్రం 06:00 PM నుండి రాత్రి 09:30 PM వరకు',
    timeEnglish: '06:00 PM to 09:30 PM IST',
    muhurthamSignificanceTelugu: 'కార్తీక పౌర్ణమి శివకేశవ ప్రీతికరం - సకల పాపక్షయం',
    muhurthamSignificanceEnglish: 'Kartika Full Moon — Supreme Sacred Night of Divine Illumination',
    venueTelugu: 'శ్రీ కాళహస్తి క్షేత్ర ప్రాంగణం (ప్రత్యక్ష వేదిక)',
    venueEnglish: 'Sri Kalahasti Kshetram Environs (Live Broadcast)',
    descriptionTelugu: 'సంవత్సరంలో అత్యంత మహిమాన్వితమైన కార్తీక పౌర్ణమి నాడు శివానుగ్రహం కొరకు విశేష రుద్రాభిషేకం, జ్వాలా తోరణ దర్శనం మరియు కోటి దీపారాధన సంకల్పం.',
    descriptionEnglish: 'Special Ekadasa Rudrabhishekam, holy Jwala Toranam crossing, and Koti Deepam illumination on the most spiritually charged night of Kartika Pournami.',
    benefitsTelugu: [
      'సంతాన లేమి, వివాహ విలంబ దోషాల పరిహారం',
      'పితృ శాప నివారణ & వంశాభివృద్ధి',
      'ఆత్మశాంతి, మానసిక ఒత్తిడి నివారణ & మోక్ష ప్రాప్తి'
    ],
    benefitsEnglish: [
      'Relief from ancestral curses (Pitri Dosha) and delayed marital alliances',
      'Blessings of healthy progeny and lineage continuation',
      'Profound inner peace, mental serenity, and spiritual liberation'
    ],
    ritualsTelugu: [
      'పంచామృత క్షీరాభిషేకం & విభూతి అభిషేకం',
      'బిల్వార్చన సహస్ర నామావళి',
      'జ్వాలా తోరణ ప్రవేశం & కార్తీక మహా దీపారాధన'
    ],
    ritualsEnglish: [
      'Sacred Panchamrita & Vibhooti Abhishekam to Spatika Lingam',
      'Sahasranama Bilvarchana with sacred Bilva leaves',
      'Jwala Toranam procession & Kartika Maha Deepam illumination'
    ],
    priestNoteTelugu: 'భక్తుల తరపున కార్తీక పౌర్ణమి దీపాలు వెలిగించి, విభూతి ప్రసాదం అందజేయబడును.',
    priestNoteEnglish: 'Ghee lamps will be personally lit in the names of registered families with sacred Vibhooti dispatched.',
    poojaServiceMatch: {
      id: 'rudrabhishekam',
      name: 'Kartika Rudrabhishekam & Deepotsavam',
      teluguName: 'కార్తీక పూర్ణిమ జ్వాలా తోరణం & కోటి దీపోత్సవం'
    }
  }
];

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const difference = new Date(targetIso).getTime() - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

interface UpcomingRitualCountdownProps {
  onOpenBooking: (service?: PoojaService) => void;
}

export const UpcomingRitualCountdown: React.FC<UpcomingRitualCountdownProps> = ({ onOpenBooking }) => {
  const { t, language } = useLanguage();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const currentEvent = UPCOMING_RITUALS[selectedEventIndex] || UPCOMING_RITUALS[0];
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(currentEvent.targetDateISO));

  // Live timer tick every second
  useEffect(() => {
    setTimeLeft(calculateTimeRemaining(currentEvent.targetDateISO));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(currentEvent.targetDateISO));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentEvent.targetDateISO]);

  // Inject Schema.org Event JSON-LD for Google Event Rich Results & AI crawlers
  useEffect(() => {
    const scriptId = 'upcoming-ritual-event-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const eventSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": language === 'en' ? currentEvent.englishTitle : currentEvent.teluguTitle,
      "alternateName": [currentEvent.englishTitle, currentEvent.teluguTitle],
      "startDate": currentEvent.targetDateISO,
      "endDate": new Date(new Date(currentEvent.targetDateISO).getTime() + 6 * 60 * 60 * 1000).toISOString(),
      "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": [
        {
          "@type": "Place",
          "name": language === 'en' ? currentEvent.venueEnglish : currentEvent.venueTelugu,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Tirupati",
            "addressRegion": "Andhra Pradesh",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "VirtualLocation",
          "url": "https://telugujyothisham.com/services"
        }
      ],
      "image": "https://telugujyothisham.com/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg",
      "description": language === 'en' ? currentEvent.descriptionEnglish : currentEvent.descriptionTelugu,
      "organizer": {
        "@type": "Person",
        "name": "శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Sri Jallavaram Sai Dheeraj Sharma)",
        "url": "https://telugujyothisham.com/about",
        "jobTitle": "Vedic Astrologer & Smartha Purohit"
      },
      "performer": {
        "@type": "Person",
        "name": "శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://telugujyothisham.com/services",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-10-01T00:00:00Z"
      }
    };

    scriptTag.textContent = JSON.stringify(eventSchema, null, 2);
  }, [currentEvent, language]);

  const handleBookingClick = () => {
    const service: PoojaService = {
      id: currentEvent.poojaServiceMatch?.id || 'chandi-homam',
      name: currentEvent.englishTitle,
      teluguName: currentEvent.teluguTitle,
      category: currentEvent.category === 'abhishekam' ? 'abhishekam' : 'homam',
      duration: language === 'en' ? currentEvent.timeEnglish : currentEvent.timeTelugu,
      benefits: language === 'en' ? currentEvent.benefitsEnglish[0] : currentEvent.benefitsTelugu[0],
      recommendedDays: language === 'en' ? currentEvent.dateDisplayEnglish : currentEvent.dateDisplayTelugu,
      description: language === 'en' ? currentEvent.descriptionEnglish : currentEvent.descriptionTelugu,
    };
    onOpenBooking(service);
  };

  const whatsappInquiryUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, రాబోయే "${currentEvent.teluguTitle}" (${currentEvent.dateDisplayTelugu}) లో నా కుటుంబ గోత్ర నామాలతో సంకల్పం చేయించుకోవాలని అనుకుంటున్నాను. వివరాలు తెలియజేయగలరు.`
  )}`;

  return (
    <section 
      aria-label="Upcoming Vedic Ritual Countdown"
      className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-amber-50 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-500/70 relative overflow-hidden font-telugu my-8"
    >
      {/* Decorative Golden Aura Glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-amber-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400 block font-display">
              {t('రాబోయే మహా క్రతువు • Live Countdown', 'Upcoming Sacred Temple Event • Live Countdown')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t('శ్రీ గురూజీ నేతృత్వంలో విశిష్ట యజ్ఞ క్రతువులు', 'Major Upcoming Vedic Yagnas by Guruji')}
            </h2>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-xs font-semibold text-red-200">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>{t('రిజిస్ట్రేషన్స్ ప్రారంభమైనవి', 'Sankalpam Registrations Open')}</span>
        </div>
      </div>

      {/* Event Selector Switcher Tabs */}
      <div className="relative z-10 flex flex-wrap gap-2.5 my-6">
        {UPCOMING_RITUALS.map((evt, idx) => (
          <button
            key={evt.id}
            type="button"
            onClick={() => setSelectedEventIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
              selectedEventIndex === idx
                ? 'bg-amber-600 text-white border-amber-400 shadow-lg scale-102'
                : 'bg-amber-950/60 text-amber-200 border-amber-800/70 hover:bg-amber-900/60'
            }`}
          >
            <Sparkles size={14} className={selectedEventIndex === idx ? 'text-amber-200' : 'text-amber-400'} />
            <span className="truncate max-w-[220px] sm:max-w-none">
              {language === 'en' ? evt.englishTitle : evt.teluguTitle}
            </span>
          </button>
        ))}
      </div>

      {/* Main Countdown Highlight Display */}
      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-amber-600/40">
        
        {/* Left: Event Details & Muhurtham */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-lg border border-amber-500/40 font-semibold">
            {language === 'en' ? currentEvent.category.toUpperCase() : 'వైదిక మహా క్రతువు'}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-100 leading-tight">
            {language === 'en' ? currentEvent.englishTitle : currentEvent.teluguTitle}
          </h3>

          <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed">
            {language === 'en' ? currentEvent.descriptionEnglish : currentEvent.descriptionTelugu}
          </p>

          {/* Date, Time & Venue Metas */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-amber-100">
            <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-800/70 p-2.5 rounded-xl">
              <Calendar size={16} className="text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-300 block uppercase font-sans">
                  {t('తేదీ / దినం', 'Sacred Date')}
                </span>
                <span className="font-bold">
                  {language === 'en' ? currentEvent.dateDisplayEnglish : currentEvent.dateDisplayTelugu}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-800/70 p-2.5 rounded-xl">
              <Clock size={16} className="text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-300 block uppercase font-sans">
                  {t('సమయం / ముహూర్తం', 'Auspicious Time')}
                </span>
                <span className="font-bold">
                  {language === 'en' ? currentEvent.timeEnglish : currentEvent.timeTelugu}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-2 bg-amber-950/60 border border-amber-800/70 p-2.5 rounded-xl">
              <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-amber-300 block uppercase font-sans">
                  {t('వేదిక & లైవ్ ప్రసారం', 'Venue & Webcast')}
                </span>
                <span className="font-semibold text-xs leading-snug">
                  {language === 'en' ? currentEvent.venueEnglish : currentEvent.venueTelugu}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Digital Countdown Cards */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-5 bg-gradient-to-b from-amber-900/60 to-black/60 p-6 rounded-2xl border border-amber-500/50 shadow-inner">
          <span className="text-xs font-bold tracking-widest text-amber-300 uppercase font-display flex items-center gap-1.5">
            <Clock size={14} className="text-amber-400" />
            {t('మహా క్రతువు ప్రారంభానికి మిగిలిన సమయం', 'Time Remaining Until Maha Yagnam')}
          </span>

          {timeLeft.isExpired ? (
            <div className="py-8 text-center text-amber-300 font-bold">
              <Sparkles size={32} className="mx-auto mb-2 text-amber-400 animate-spin" />
              <p className="text-lg">{t('ఈ క్రతువు ప్రస్తుతం జరుగుతున్నది / ముగిసింది.', 'This Sacred Event is currently underway or completed.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm text-center">
              {/* Days */}
              <div className="bg-amber-950/90 border border-amber-500/70 rounded-2xl p-2.5 sm:p-3 shadow-lg">
                <span className="text-2xl sm:text-4xl font-black text-amber-200 font-mono tracking-tight block">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mt-1">
                  {t('రోజులు', 'Days')}
                </span>
              </div>

              {/* Hours */}
              <div className="bg-amber-950/90 border border-amber-500/70 rounded-2xl p-2.5 sm:p-3 shadow-lg">
                <span className="text-2xl sm:text-4xl font-black text-amber-200 font-mono tracking-tight block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mt-1">
                  {t('గంటలు', 'Hours')}
                </span>
              </div>

              {/* Minutes */}
              <div className="bg-amber-950/90 border border-amber-500/70 rounded-2xl p-2.5 sm:p-3 shadow-lg">
                <span className="text-2xl sm:text-4xl font-black text-amber-200 font-mono tracking-tight block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mt-1">
                  {t('నిమిషాలు', 'Mins')}
                </span>
              </div>

              {/* Seconds (Pulsing Amber) */}
              <div className="bg-amber-950/90 border-2 border-amber-400 rounded-2xl p-2.5 sm:p-3 shadow-lg ring-2 ring-amber-400/30">
                <span className="text-2xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight block animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider block mt-1">
                  {t('సెకన్లు', 'Secs')}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleBookingClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/40 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>{t('గోత్ర నామాలతో సంకల్పం నమోదు చేయండి', 'Register Gotranamalu for Sankalpam')}</span>
              <ArrowRight size={16} />
            </button>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>{t('వాట్సాప్‌లో వివరాలు & సంకల్ప రుసుము అడగండి', 'Inquire on WhatsApp (Gotranamalu)')}</span>
            </a>
          </div>

          <p className="text-[11px] text-amber-300/80 text-center flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-amber-400 shrink-0" />
            <span>
              {language === 'en' 
                ? 'Direct Vedic Sankalpam conducted by Sri Dheeraj Sharma Garu' 
                : 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు స్వయంగా సంకల్పం చేయుదురు'}
            </span>
          </p>
        </div>
      </div>

      {/* Highlights & Benefits Checklist */}
      <div className="relative z-10 mt-6 grid sm:grid-cols-2 gap-4 bg-amber-950/40 border border-amber-800/60 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm">
        <div>
          <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
            <Sparkles size={14} className="text-amber-400" />
            <span>{t('ఈ యజ్ఞం ద్వారా లభించే శుభ ఫలితాలు (Benefits):', 'Sacred Spiritual & Material Benefits:')}</span>
          </h4>
          <ul className="space-y-1.5 text-amber-100/90">
            {(language === 'en' ? currentEvent.benefitsEnglish : currentEvent.benefitsTelugu).map((b, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
            <Flame size={14} className="text-amber-400" />
            <span>{t('నిర్వహించబడే క్రతువులు (Rituals Included):', 'Rituals Performed in Maha Yagnam:')}</span>
          </h4>
          <ul className="space-y-1.5 text-amber-100/90">
            {(language === 'en' ? currentEvent.ritualsEnglish : currentEvent.ritualsTelugu).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
