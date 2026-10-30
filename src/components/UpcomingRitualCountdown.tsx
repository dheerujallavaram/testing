import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  CalendarPlus,
  Compass,
  Share2,
  ChevronRight,
  Sun,
  Eye,
} from 'lucide-react';
import { PoojaService, DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { WEEK_DATA } from '../data/panchangamData';
import {
  DynamicCalendarEvent,
  getUpcomingCalendarEvents,
} from '../utils/calendarEventExtractor';

export interface UpcomingRitualCountdownProps {
  onOpenBooking: (service?: PoojaService) => void;
  onSelectDate?: (isoDate: string) => void;
  variant?: 'full' | 'hero' | 'compact';
  days?: DayData[];
  maxEvents?: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isToday: boolean;
  isExpired: boolean;
}

function calculateTimeRemaining(targetIso: string, eventIsoDate: string): TimeRemaining {
  const now = new Date();
  const targetTime = new Date(targetIso).getTime();
  const diff = targetTime - now.getTime();

  // Check if today matches the event date
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayIso = `${y}-${m}-${d}`;
  const isToday = eventIsoDate === todayIso;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isToday,
      isExpired: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    isToday,
    isExpired: false,
  };
}

export const UpcomingRitualCountdown: React.FC<UpcomingRitualCountdownProps> = ({
  onOpenBooking,
  onSelectDate,
  variant = 'full',
  days = WEEK_DATA,
  maxEvents = 8,
}) => {
  const { t, language } = useLanguage();

  // 1. Dynamically fetch upcoming events from the existing calendar dataset
  const { events, nextUpcoming, todayEvent } = useMemo(() => {
    return getUpcomingCalendarEvents(days, new Date(), maxEvents);
  }, [days, maxEvents]);

  // Selected event state: default to immediate next event (or today's event)
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    return todayEvent?.id || nextUpcoming?.id || events[0]?.id || '';
  });

  // Keep selected event synced if list updates
  useEffect(() => {
    if (events.length > 0 && !events.some((e) => e.id === selectedEventId)) {
      setSelectedEventId(todayEvent?.id || nextUpcoming?.id || events[0]?.id || '');
    }
  }, [events, selectedEventId, todayEvent, nextUpcoming]);

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || nextUpcoming || events[0];
  }, [events, selectedEventId, nextUpcoming]);

  // 2. Real-time second-by-second ticking countdown
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => {
    if (!currentEvent) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isToday: false, isExpired: false };
    }
    return calculateTimeRemaining(currentEvent.targetDateISO, currentEvent.isoDate);
  });

  useEffect(() => {
    if (!currentEvent) return;
    setTimeLeft(calculateTimeRemaining(currentEvent.targetDateISO, currentEvent.isoDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(currentEvent.targetDateISO, currentEvent.isoDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEvent]);

  // 3. Inject Schema.org Event JSON-LD for Google Event Rich Results & AI Crawlers
  useEffect(() => {
    if (!currentEvent) return;
    const scriptId = 'upcoming-calendar-ritual-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const eventSchema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: language === 'en' ? currentEvent.titleEn : currentEvent.titleTe,
      alternateName: [currentEvent.titleEn, currentEvent.titleTe],
      startDate: currentEvent.targetDateISO,
      endDate: new Date(new Date(currentEvent.targetDateISO).getTime() + 6 * 60 * 60 * 1000).toISOString(),
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: [
        {
          '@type': 'Place',
          name: language === 'en' ? (currentEvent.venueEn || 'Tirupati Vedic Kshetram') : (currentEvent.venueTe || 'శ్రీలక్ష్మి గణపతి క్షేత్రం, తిరుపతి'),
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Tirupati',
            addressRegion: 'Andhra Pradesh',
            addressCountry: 'IN',
          },
        },
        {
          '@type': 'VirtualLocation',
          url: 'https://www.telugujyothisham.com/services',
        },
      ],
      description: language === 'en' ? currentEvent.descriptionEn : currentEvent.descriptionTe,
      organizer: {
        '@type': 'Person',
        name: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Sri Jallavaram Sai Dheeraj Sharma)',
        url: 'https://www.telugujyothisham.com/about',
        jobTitle: 'Vedic Astrologer & Smartha Purohit',
      },
    };

    scriptTag.textContent = JSON.stringify(eventSchema, null, 2);
  }, [currentEvent, language]);

  if (!currentEvent) {
    return null;
  }

  // Booking CTA Handler
  const handleBookingClick = () => {
    const service: PoojaService = {
      id: currentEvent.poojaServiceMatch?.id || 'chandi-homam',
      name: currentEvent.titleEn,
      teluguName: currentEvent.titleTe,
      category: currentEvent.category === 'abhishekam' ? 'abhishekam' : 'homam',
      duration: language === 'en' ? currentEvent.timeEn : currentEvent.timeTe,
      benefits: language === 'en' ? currentEvent.benefitsEn[0] : currentEvent.benefitsTe[0],
      recommendedDays: language === 'en' ? currentEvent.dateDisplayEn : currentEvent.dateDisplayTe,
      description: language === 'en' ? currentEvent.descriptionEn : currentEvent.descriptionTe,
    };
    onOpenBooking(service);
  };

  // Google Calendar Link Generator
  const googleCalendarUrl = useMemo(() => {
    const title = language === 'en' ? currentEvent.titleEn : currentEvent.titleTe;
    const desc = language === 'en' ? currentEvent.descriptionEn : currentEvent.descriptionTe;
    const loc = currentEvent.venueTe || 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం, తిరుపతి';
    const start = new Date(currentEvent.targetDateISO);
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${formatTime(start)}/${formatTime(end)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${dates}&details=${encodeURIComponent(
      desc + '\n\nశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ: 8977986166\nhttps://www.telugujyothisham.com'
    )}&location=${encodeURIComponent(loc)}`;
  }, [currentEvent, language]);

  // WhatsApp Share URL
  const whatsappShareUrl = useMemo(() => {
    const title = language === 'en' ? currentEvent.titleEn : currentEvent.titleTe;
    const dateStr = language === 'en' ? currentEvent.dateDisplayEn : currentEvent.dateDisplayTe;
    const muhurtham = currentEvent.muhurthamTe || currentEvent.timeTe;
    const text = `🕉️ *రాబోయే విశేష పర్వదినం / క్రతువు: ${title}*\n📅 తేదీ: ${dateStr}\n⏰ ముహూర్తం: ${muhurtham}\n🌟 విశేషం: ${currentEvent.descriptionTe}\n\nగోత్ర నామాలతో సంకల్పం & జాతక పరిశీలన కొరకు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని సంప్రదించండి:\n📞 8977986166\n🌐 https://www.telugujyothisham.com`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [currentEvent, language]);

  // WhatsApp Priest Inquiry Link
  const whatsappInquiryUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, రాబోయే "${currentEvent.titleTe}" (${currentEvent.dateDisplayTe}) పర్వదినాన నా కుటుంబ గోత్ర నామాలతో సంకల్పం చేయించుకోవాలని అనుకుంటున్నాను. పూజా విధి మరియు వివరాలు తెలియజేయగలరు.`
  )}`;

  // ==========================================
  // COMPACT / HERO STRIP VARIANT (FOR PANCHANGAM & HOME PAGES)
  // ==========================================
  if (variant === 'compact') {
    return (
      <aside
        aria-label="Upcoming Festival and Ritual Countdown Banner"
        className="w-full bg-gradient-to-r from-amber-950 via-[#2e1107] to-amber-950 text-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-500/70 shadow-lg relative overflow-hidden font-telugu my-4"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Event info & badge */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[11px] font-bold text-amber-300">
                <Flame size={12} className="text-amber-400 animate-pulse" />
                <span>{language === 'en' ? currentEvent.categoryLabelEn : currentEvent.categoryLabelTe}</span>
              </span>

              {timeLeft.isToday ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500 text-[11px] font-bold text-red-300 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {t('నేడు పర్వదినం!', 'Happening Today!')}
                </span>
              ) : timeLeft.days === 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-[11px] font-bold text-emerald-300">
                  {t('రేపే శుభ దినం!', 'Tomorrow!')}
                </span>
              ) : null}

              <span className="text-xs text-amber-300/80 font-medium">
                📅 {language === 'en' ? currentEvent.dateDisplayEn : currentEvent.dateDisplayTe}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
              {language === 'en' ? currentEvent.titleEn : currentEvent.titleTe}
            </h3>

            <p className="text-xs text-amber-200/80 line-clamp-1">
              ✨ {currentEvent.tithiTe ? `${currentEvent.tithiTe} • ` : ''}
              {currentEvent.deityTe ? `దైవం: ${currentEvent.deityTe} • ` : ''}
              {currentEvent.muhurthamTe ? `ముహూర్తం: ${currentEvent.muhurthamTe}` : ''}
            </p>
          </div>

          {/* Right: Countdown Cards + Quick CTA */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Live Timer Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-black/50 border border-amber-500/60 rounded-xl px-2.5 py-1.5 text-center min-w-[46px]">
                <span className="text-lg sm:text-xl font-black font-mono text-amber-200 block leading-none">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-400 block mt-0.5">
                  {t('రోజులు', 'Days')}
                </span>
              </div>

              <span className="text-amber-500 font-bold">:</span>

              <div className="bg-black/50 border border-amber-500/60 rounded-xl px-2.5 py-1.5 text-center min-w-[46px]">
                <span className="text-lg sm:text-xl font-black font-mono text-amber-200 block leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-400 block mt-0.5">
                  {t('గంటలు', 'Hrs')}
                </span>
              </div>

              <span className="text-amber-500 font-bold">:</span>

              <div className="bg-black/50 border border-amber-500/60 rounded-xl px-2.5 py-1.5 text-center min-w-[46px]">
                <span className="text-lg sm:text-xl font-black font-mono text-amber-200 block leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-400 block mt-0.5">
                  {t('నిమి', 'Min')}
                </span>
              </div>

              <span className="text-amber-500 font-bold">:</span>

              <div className="bg-black/50 border-2 border-amber-400 rounded-xl px-2.5 py-1.5 text-center min-w-[46px] ring-2 ring-amber-400/20">
                <span className="text-lg sm:text-xl font-black font-mono text-amber-400 block leading-none animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-300 block mt-0.5">
                  {t('సెక', 'Sec')}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {onSelectDate && currentEvent.source === 'calendar' && (
                <button
                  type="button"
                  onClick={() => onSelectDate(currentEvent.isoDate)}
                  className="px-3 py-2 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-700/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="ఈ రోజు పంచాంగం వివరాలు చూడండి"
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline">{t('పంచాంగం', 'Panchangam')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleBookingClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-102"
              >
                <span>{t('సంకల్పం', 'Sankalpam')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Multi-event Quick Switcher Pills */}
        {events.length > 1 && (
          <div className="relative z-10 flex items-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-amber-800/60 no-scrollbar">
            <span className="text-[11px] font-bold text-amber-400 shrink-0 font-display">
              {t('తదుపరి పర్వదినాలు:', 'Next Observances:')}
            </span>
            {events.slice(0, 5).map((evt) => {
              const isSelected = evt.id === currentEvent.id;
              return (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                      : 'bg-amber-950/70 text-amber-300 border-amber-800/80 hover:bg-amber-900/70'
                  }`}
                >
                  <Sparkles size={11} className={isSelected ? 'text-amber-200' : 'text-amber-400'} />
                  <span>{language === 'en' ? evt.titleEn : evt.titleTe}</span>
                </button>
              );
            })}
          </div>
        )}
      </aside>
    );
  }

  // ==========================================
  // FULL EXPANDED VARIANT (FOR SERVICES TAB & DEDICATED SECTIONS)
  // ==========================================
  return (
    <section
      aria-label="Upcoming Vedic Ritual and Festival Countdown"
      className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-amber-50 rounded-3xl p-5 sm:p-9 shadow-2xl border-2 border-amber-500/70 relative overflow-hidden font-telugu my-6"
    >
      {/* Decorative Golden Aura Glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag & Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-amber-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Flame size={24} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400 block font-display">
              {t('క్యాలెండర్ లైవ్ కౌంట్‌డౌన్ • Automated Calendar Countdown', 'Automated Vedic Calendar Countdown')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t('రాబోయే విశేష దేవాలయ పర్వదినాలు & వైదిక మహాయజ్ఞాలు', 'Upcoming Sacred Temple Festivals & Maha Yagnams')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timeLeft.isToday ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/90 border border-red-500 text-xs font-bold text-red-200 shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>{t('నేడు పర్వదినం ప్రత్యక్ష ప్రసారం', 'TODAY: Sacred Observance Active')}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-900/60 border border-amber-500/60 text-xs font-semibold text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{t('సంకల్ప నమోదులు ప్రారంభమైనవి', 'Sankalpam Registrations Open')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Multi-Event Switcher Bar */}
      {events.length > 1 && (
        <div className="relative z-10 my-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 font-display flex items-center gap-1.5">
              <Compass size={14} className="text-amber-400" />
              {t('రాబోయే క్రతువులు & పర్వదినాలు ఎంచుకోండి:', 'Select Upcoming Sacred Event:')}
            </span>
            <span className="text-[11px] text-amber-400/80 font-mono">
              {events.length} {t('విశేష పర్వదినాలు', 'Events Synced')}
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {events.map((evt) => {
              const isSelected = evt.id === currentEvent.id;
              return (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-400 shadow-lg scale-102 ring-2 ring-amber-400/30'
                      : 'bg-amber-950/60 text-amber-200 border-amber-800/70 hover:bg-amber-900/60 hover:border-amber-700'
                  }`}
                >
                  <Sparkles size={13} className={isSelected ? 'text-amber-100' : 'text-amber-400'} />
                  <span className="font-bold">
                    {language === 'en' ? evt.titleEn : evt.titleTe}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isSelected ? 'bg-amber-800 text-white' : 'bg-black/40 text-amber-300'
                    }`}
                  >
                    {evt.isoDate.slice(5)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Countdown Highlight Display */}
      <div className="relative z-10 grid lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-black/45 backdrop-blur-md rounded-2xl p-5 sm:p-8 border border-amber-500/50 shadow-xl">
        {/* Left Column: Event Details & Vedic Significance */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-lg border border-amber-500/40 font-bold uppercase tracking-wider">
              {language === 'en' ? currentEvent.categoryLabelEn : currentEvent.categoryLabelTe}
            </span>

            {currentEvent.source === 'calendar' ? (
              <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 text-xs rounded-lg border border-emerald-600/50 font-semibold">
                {t('దృక్సిద్ధాంత పంచాంగ విశేషం', 'Dynamic Calendar Event')}
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-red-950/80 text-red-300 text-xs rounded-lg border border-red-500/60 font-semibold">
                {t('క్షేత్ర ప్రధాన యజ్ఞం', 'Kshetram Maha Yagnam')}
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {language === 'en' ? currentEvent.titleEn : currentEvent.titleTe}
          </h3>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-telugu">
            {language === 'en' ? currentEvent.descriptionEn : currentEvent.descriptionTe}
          </p>

          {/* Date, Time, Deity & Muhurtham Metas Grid */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-amber-100">
            <div className="flex items-center gap-2.5 bg-amber-950/70 border border-amber-800/80 p-3 rounded-xl">
              <Calendar size={18} className="text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-300 block uppercase font-sans">
                  {t('తేదీ / దినం', 'Sacred Date')}
                </span>
                <span className="font-bold text-amber-100">
                  {language === 'en' ? currentEvent.dateDisplayEn : currentEvent.dateDisplayTe}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-amber-950/70 border border-amber-800/80 p-3 rounded-xl">
              <Clock size={18} className="text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-300 block uppercase font-sans">
                  {t('శుభ ముహూర్తం / సమయం', 'Auspicious Muhurtham')}
                </span>
                <span className="font-bold text-amber-100">
                  {currentEvent.muhurthamTe || currentEvent.timeTe}
                </span>
              </div>
            </div>

            {currentEvent.deityTe && (
              <div className="flex items-center gap-2.5 bg-amber-950/70 border border-amber-800/80 p-3 rounded-xl">
                <Sun size={18} className="text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-amber-300 block uppercase font-sans">
                    {t('ఇష్ట దైవం / ప్రార్థన', 'Presiding Deity')}
                  </span>
                  <span className="font-bold text-amber-100">{currentEvent.deityTe}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 bg-amber-950/70 border border-amber-800/80 p-3 rounded-xl">
              <MapPin size={18} className="text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-300 block uppercase font-sans">
                  {t('వేదిక & లైవ్ ప్రసారం', 'Venue & Webcast')}
                </span>
                <span className="font-semibold text-xs leading-snug">
                  {language === 'en' ? (currentEvent.venueEn || 'Tirupati Vedic Kshetram') : (currentEvent.venueTe || 'శ్రీలక్ష్మి గణపతి వైదిక క్షేత్రం, తిరుపతి')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Digital Countdown Cards & CTAs */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-5 bg-gradient-to-b from-amber-950/80 via-black/70 to-amber-950/90 p-5 sm:p-7 rounded-2xl border-2 border-amber-500/60 shadow-inner">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase font-display flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" />
              {t('ముహూర్త ప్రారంభానికి మిగిలిన సమయం', 'Countdown to Sacred Muhurtham')}
            </span>

            {timeLeft.isToday && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                LIVE
              </span>
            )}
          </div>

          {/* 4-Box Digital Clock Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full text-center">
            {/* Days */}
            <div className="bg-amber-950/90 border border-amber-500/70 rounded-2xl p-2.5 sm:p-3 shadow-lg transform transition-transform hover:scale-103">
              <span className="text-2xl sm:text-4xl font-black text-amber-200 font-mono tracking-tight block leading-tight">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mt-1">
                {t('రోజులు', 'Days')}
              </span>
            </div>

            {/* Hours */}
            <div className="bg-amber-950/90 border border-amber-500/70 rounded-2xl p-2.5 sm:p-3 shadow-lg transform transition-transform hover:scale-103">
              <span className="text-2xl sm:text-4xl font-black text-amber-200 font-mono tracking-tight block leading-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mt-1">
                {t('గంటలు', 'Hours')}
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-amber-950/90 border border-amber-500/70 rounded-2xl p-2.5 sm:p-3 shadow-lg transform transition-transform hover:scale-103">
              <span className="text-2xl sm:text-4xl font-black text-amber-200 font-mono tracking-tight block leading-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mt-1">
                {t('నిమిషాలు', 'Mins')}
              </span>
            </div>

            {/* Seconds (Pulsing Amber) */}
            <div className="bg-amber-950/90 border-2 border-amber-400 rounded-2xl p-2.5 sm:p-3 shadow-lg ring-2 ring-amber-400/30 transform transition-transform hover:scale-103">
              <span className="text-2xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight block leading-tight animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider block mt-1">
                {t('సెకన్లు', 'Secs')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleBookingClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/40 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>{t('గోత్ర నామాలతో సంకల్ప పూజ నమోదు', 'Register Gotranamalu for Sankalpam')}</span>
              <ArrowRight size={16} />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer truncate"
              >
                <MessageCircle size={14} className="shrink-0" />
                <span className="truncate">{t('వాట్సాప్ సంకల్పం', 'WhatsApp Sankalpam')}</span>
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-700/80 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer truncate"
              >
                <CalendarPlus size={14} className="shrink-0 text-amber-400" />
                <span className="truncate">{t('క్యాలెండర్‌కు జోడించు', 'Add to Calendar')}</span>
              </a>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {onSelectDate && currentEvent.source === 'calendar' && (
                <button
                  type="button"
                  onClick={() => onSelectDate(currentEvent.isoDate)}
                  className="text-xs text-amber-300 hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye size={13} />
                  <span>{t('పంచాంగంలో ఈ రోజు చూడండి', 'View Date in Panchangam')}</span>
                </button>
              )}

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-300 hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors cursor-pointer ml-auto"
              >
                <Share2 size={13} />
                <span>{t('భక్తులతో పంచుకోండి', 'Share Details')}</span>
              </a>
            </div>
          </div>

          <p className="text-[11px] text-amber-300/80 text-center flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck size={14} className="text-amber-400 shrink-0" />
            <span>
              {language === 'en'
                ? 'Personalized Vedic Sankalpam conducted by Sri Dheeraj Sharma Garu'
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
            <span>{t('ఈ పర్వదిన / యజ్ఞ శుభ ఫలితాలు (Sacred Benefits):', 'Spiritual & Material Benefits:')}</span>
          </h4>
          <ul className="space-y-1.5 text-amber-100/90 font-telugu">
            {(language === 'en' ? currentEvent.benefitsEn : currentEvent.benefitsTe).map((b, i) => (
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
            <span>
              {currentEvent.ritualsTe
                ? t('నిర్వహించబడే క్రతువులు (Rituals Performed):', 'Rituals Performed in Maha Yagnam:')
                : t('వేద సూచన & పూజా విధానం (Pooja Vidhi):', 'Vedic Upasana & Observance:')}
            </span>
          </h4>
          <ul className="space-y-1.5 text-amber-100/90 font-telugu">
            {currentEvent.ritualsTe ? (
              (language === 'en' ? (currentEvent.ritualsEn || []) : currentEvent.ritualsTe).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{t('ప్రాతఃకాల స్నానం చేసి ఇష్ట దైవానికి నేతి దీపారాధన', 'Morning sacred bath followed by offering ghee lamp to the presiding deity')}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentEvent.priestNoteTe || t('గోత్ర నామాలతో ప్రత్యక్ష సంకల్పం చేయించుకోవడం ఉత్తమ ఫలితాలను ఇస్తుంది', 'Personal Gotranamalu sankalpam yields peak auspicious results')}</span>
                </li>
                {currentEvent.luckyColorTe && (
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>{t(`శుభ వర్ణం: ${currentEvent.luckyColorTe} వస్త్రధారణ శుభప్రదం`, `Lucky Color: ${currentEvent.luckyColorTe}`)}</span>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};
