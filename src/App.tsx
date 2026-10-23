import React, { useState, useEffect, useCallback } from 'react';
import { WEEK_DATA } from './data/panchangamData';
import { PoojaService } from './types/panchangam';
import { findActiveLagna, getTodayAndTomorrowIds } from './utils/panchangaLogic';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header, NavTab } from './components/Header';
import { Banner } from './components/Banner';
import { DaySelector } from './components/DaySelector';
import { DayVisheshamCard } from './components/DayVisheshamCard';
import { DailyHoroscope } from './components/DailyHoroscope';
import { PanchangaCard } from './components/PanchangaCard';
import { RashiChakra } from './components/RashiChakra';
import { MuhurthaTimings } from './components/MuhurthaTimings';
import { LagnaPramanalu } from './components/LagnaPramanalu';
import { ChandraNavatara } from './components/ChandraNavatara';
import { DevoteeCompatibilityChecker } from './components/DevoteeCompatibilityChecker';
import { PanchangamFAQ } from './components/PanchangamFAQ';
import { ActionControls } from './components/ActionControls';
import { PoojaServicesSection } from './components/PoojaServicesSection';
import { PoojaBookingModal } from './components/PoojaBookingModal';
import { Footer } from './components/Footer';
import { GuruProfileHome } from './components/GuruProfileHome';
import { AboutGurujiSection } from './components/AboutGurujiSection';
import { AwardsSection } from './components/AwardsSection';
import { ContactSection } from './components/ContactSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CityAstrologyPage } from './components/CityAstrologyPage';
import { DailyNakshatraArticle } from './components/DailyNakshatraArticle';
import { CitySEOData, findCityBySlug } from './data/citiesData';
import { PanchangamQuickSummary } from './components/PanchangamQuickSummary';
import { DailyAstrologyInsights } from './components/DailyAstrologyInsights';

export const TAB_PATHS: Record<NavTab, string> = {
  home: '/',
  panchangam: '/panchangam',
  awards: '/awards',
  services: '/services',
  about: '/about',
  contact: '/contact',
};

export function resolveCityFromLocation(): CitySEOData | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  
  if (pathname.startsWith('/telugu-astrologer-in-')) {
    const slug = pathname.replace('/telugu-astrologer-in-', '');
    const found = findCityBySlug(slug);
    if (found) return found;
  }
  
  // Also check query param ?city=
  try {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    if (cityParam) {
      const found = findCityBySlug(cityParam);
      if (found) return found;
    }
  } catch {}

  return null;
}

export function resolveTabFromLocation(): NavTab {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();

  if (
    pathname === '/panchangam' ||
    pathname.endsWith('/panchangam') ||
    hash === '#panchangam' ||
    hash === '#dina-phalam' ||
    hash === '#rashi-chakram' ||
    hash === '#muhurthalu' ||
    hash === '#panchangam-faq'
  ) {
    return 'panchangam';
  }
  if (pathname === '/awards' || pathname.endsWith('/awards') || hash === '#awards') {
    return 'awards';
  }
  if (pathname === '/services' || pathname.endsWith('/services') || hash === '#services') {
    return 'services';
  }
  if (pathname === '/about' || pathname.endsWith('/about') || hash === '#about') {
    return 'about';
  }
  if (pathname === '/contact' || pathname.endsWith('/contact') || hash === '#contact') {
    return 'contact';
  }
  return 'home';
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => resolveTabFromLocation());
  const [selectedCity, setSelectedCity] = useState<CitySEOData | null>(() => resolveCityFromLocation());
  const [selectedDayId, setSelectedDayId] = useState<string>(() => getTodayAndTomorrowIds(WEEK_DATA).todayId);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedPoojaForBooking, setSelectedPoojaForBooking] = useState<PoojaService | null>(null);
  const { t, tr } = useLanguage();

  const handleSelectTab = useCallback((tab: NavTab) => {
    setSelectedCity(null);
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetPath = TAB_PATHS[tab] || '/';
      try {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ tab }, '', targetPath);
        }
      } catch {
        // Fallback if pushState is restricted by sandboxed environment
      }
    }
  }, []);

  const handleSelectCity = useCallback((citySlug: string) => {
    const city = findCityBySlug(citySlug);
    if (city) {
      setSelectedCity(city);
      if (typeof window !== 'undefined') {
        const targetPath = `/telugu-astrologer-in-${city.slug}`;
        try {
          if (window.location.pathname !== targetPath) {
            window.history.pushState({ city: city.slug }, '', targetPath);
          }
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  // Listen to browser Back / Forward navigation (popstate)
  useEffect(() => {
    const onPopState = () => {
      const matchedCity = resolveCityFromLocation();
      setSelectedCity(matchedCity);
      if (!matchedCity) {
        setActiveTab(resolveTabFromLocation());
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync document title, canonical link, og:url, and meta tags dynamically with current tab route (when not in city page)
  useEffect(() => {
    if (selectedCity) return; // CityAstrologyPage component manages its own programmatic metadata
    const path = TAB_PATHS[activeTab] || '/';
    const canonicalHref = `https://telugujyothisham.com${path === '/' ? '/' : path}`;

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', canonicalHref);
    }

    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) {
      ogUrlEl.setAttribute('content', canonicalHref);
    }

    const twitterUrlEl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrlEl) {
      twitterUrlEl.setAttribute('content', canonicalHref);
    }

    const titles: Record<NavTab, string> = {
      home: 'పంచాంగం & రాశి ఫలితాలు | నేటి తెలుగు పంచాంగం, తిథి, నక్షత్రం, దిన ఫలం — telugujyothisham.com',
      panchangam: 'పంచాంగం | నేటి తెలుగు పంచాంగం, తిథి, నక్షత్రం, రాహుకాలం, దిన ఫలం — telugujyothisham.com/panchangam',
      awards: 'పొందిన సత్కారాలు & పురస్కారాలు | శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (telugujyothisham.com/awards)',
      services: 'వైదిక పూజా సేవలు & హోమాలు | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/services)',
      about: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి గురించి | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/about)',
      contact: 'సంప్రదించండి | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/contact)',
    };

    const descriptions: Record<NavTab, string> = {
      home: 'పంచాంగం (Panchangam) - నేటి తెలుగు పంచాంగం, 12 రాశుల దిన ఫలాలు, తిథి, నక్షత్రం, యోగం, కరణం, వర్జ్యం, రాహుకాలం మరియు శుభ ముహూర్తాలు. ప్రతిరోజూ తాజా పంచాంగం telugujyothisham.com లో చూడండి.',
      panchangam: 'పంచాంగం (Panchangam) - నేటి ఖచ్చితమైన తెలుగు పంచాంగం, తిథి, నక్షత్రం, యోగం, కరణం, వర్జ్యం, అమృత ఘడియలు, రాహుకాలం, 12 రాశుల దిన ఫలాలు మరియు దక్షిణ భారత రాశి చక్రం. శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం దృక్సిద్ధాంత ప్రామాణిక ఫలితాలు.',
      awards: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు పొందిన జ్యోతిష సత్కారాలు, బిరుదులు మరియు పూజా పురస్కారాల వివరాలు.',
      services: 'శ్రీ చండీ హోమం, లక్ష్మీ గణపతి హోమం, సుదర్శన హోమం, వివాహ, గృహప్రవేశ క్రతువులు శాస్త్రోక్తంగా నిర్వహించబడును.',
      about: 'జ్యోతిష పండితులు, స్మార్త వేద విద్వాంసులు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్యాత్మిక ప్రస్థానం మరియు అనుభవం.',
      contact: 'జ్యోతిష సంప్రదింపులు, ముహూర్త నిర్ణయం మరియు పూజా బుకింగ్ కొరకు శ్రీ ధీరజ్ శర్మ గారిని సంప్రదించండి.',
    };

    const targetTitle = titles[activeTab] || titles.home;
    const targetDesc = descriptions[activeTab] || descriptions.home;

    document.title = targetTitle;

    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', targetTitle);

    const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleEl) twitterTitleEl.setAttribute('content', targetTitle);

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', targetDesc);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', targetDesc);

    const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescEl) twitterDescEl.setAttribute('content', targetDesc);
  }, [activeTab]);

  const currentDay = WEEK_DATA.find((d) => d.id === selectedDayId) ?? WEEK_DATA[0];

  // Calculate active lagna name for hero banner
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const activeLagna = findActiveLagna(currentDay.lagnalu, currentMinutes);

  const handleOpenBooking = (service?: PoojaService) => {
    setSelectedPoojaForBooking(service || null);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedPoojaForBooking(null);
  };

  const handleNavigateToPanchangam = () => {
    handleSelectTab('panchangam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAwards = () => {
    handleSelectTab('awards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#faf7f2] text-slate-900 font-telugu">
      {/* Top Navigation with language switcher, tabs, bell & booking CTA */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Router based on Active Tab or Programmatic City Page */}
      {selectedCity ? (
        <CityAstrologyPage
          city={selectedCity}
          onOpenBooking={(service) =>
            handleOpenBooking(
              service
                ? ({
                    id: 'city-service',
                    name: service,
                    description: service,
                    teluguName: service,
                    costINR: 'సంప్రదించండి',
                    costUSD: 'Contact',
                    idealFor: 'భక్తుల విశేష సంకల్పం',
                    samagriList: ['పసుపు', 'కుంకుమ', 'హారతి', 'నవధాన్యాలు'],
                    duration: 'శాస్త్రోక్తంగా'
                  } as unknown as PoojaService)
                : undefined
            )
          }
          onNavigateHome={() => handleSelectTab('home')}
          onNavigatePanchangam={() => handleSelectTab('panchangam')}
          onSelectCity={handleSelectCity}
        />
      ) : (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* TAB 1: HOME (SRI DHEERAJ SHARMA GARU PROFILE) */}
        {activeTab === 'home' && (
          <GuruProfileHome
            currentDay={currentDay}
            onNavigateToPanchangam={handleNavigateToPanchangam}
            onNavigateToAwards={handleNavigateToAwards}
            onOpenBooking={(service) => handleOpenBooking(service)}
          />
        )}

        {/* TAB: HONORS & AWARDS (పొందిన సత్కారాలు) */}
        {activeTab === 'awards' && <AwardsSection />}

        {/* TAB 2: DEDICATED SUB-MENU FOR PANCHANGAM */}
        {activeTab === 'panchangam' && (
          <div className="space-y-12">
            {/* Sub-menu banner for Panchangam */}
            <Banner
              currentDay={currentDay}
              activeLagnaName={activeLagna?.lagnam}
              onOpenBooking={() => handleOpenBooking()}
            />

            {/* Week & Month Day Selector */}
            <DaySelector
              days={WEEK_DATA}
              selectedDayId={selectedDayId}
              onSelectDay={(dayId) => setSelectedDayId(dayId)}
            />

            {/* Selected Date Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-amber-200/80 pb-4">
              <div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest font-display">
                  {t('ఎంచుకున్న రోజు వివరాలు • Selected Day Overview', 'Selected Day Overview')}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-950 font-telugu mt-0.5">
                  {tr(currentDay.label)} {t('పంచాంగం', 'Panchangam')}
                </h1>
              </div>
              <p className="text-base sm:text-lg text-amber-900 font-semibold font-telugu bg-amber-100/70 px-4 py-1.5 rounded-xl border border-amber-200">
                {tr(currentDay.teediVaram)}
              </p>
            </div>

            {/* Fast Facts & AI Generative Engine Optimization (Google Zero-Click Answer Card) */}
            <PanchangamQuickSummary day={currentDay} />

            {/* Day Special Vishesham / Phalitham */}
            <DayVisheshamCard day={currentDay} />

            {/* Daily Horoscope (దిన ఫలం) for all 12 Rashis */}
            <DailyHoroscope day={currentDay} />

            {/* Core 2-Column: Panchanga Limbs & South Indian Rashi Kundli */}
            <section id="panchangam" className="scroll-mt-24">
              <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                <PanchangaCard day={currentDay} />
                <div id="rashi-chakram" className="scroll-mt-24 h-full">
                  <RashiChakra day={currentDay} />
                </div>
              </div>
            </section>

            {/* Muhurthas: Auspicious vs Inauspicious Times */}
            <section id="muhurthalu" className="scroll-mt-24">
              <MuhurthaTimings day={currentDay} />
            </section>

            {/* 12 Lagnas with Active Time Indicator */}
            <section id="lagnalu" className="scroll-mt-24">
              <LagnaPramanalu day={currentDay} />
            </section>

            {/* Chandra Sancharam, Chandrashtamam, Navatara Balam */}
            <section>
              <ChandraNavatara day={currentDay} />
            </section>

            {/* Interactive Personal Zodiac & Nakshatra Checker */}
            <DevoteeCompatibilityChecker day={currentDay} />

            {/* Daily In-Depth Nakshatra & Tithi Phala Article (Based on Krishna Rau's Classical Text) */}
            <DailyNakshatraArticle
              currentDay={currentDay}
              onOpenBooking={() => handleOpenBooking()}
            />

            {/* Daily Astrology Guidance Insights & Simulated Live Planetary Movement Stream */}
            <DailyAstrologyInsights
              onOpenBooking={() => handleOpenBooking()}
            />

            {/* Beginner-Friendly Panchangam FAQ Section (Tithi, Nakshatra, Muhurtham, etc.) */}
            <PanchangamFAQ />

            {/* Sharing & Quick Action Controls */}
            <ActionControls
              day={currentDay}
              onOpenBooking={() => handleOpenBooking()}
            />
          </div>
        )}

        {/* TAB 3: POOJA SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
                Vedic Rituals & Homams
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-amber-950">
                {t('వైదిక పూజా సేవలు & క్రతువులు', 'Vedic Pooja Services & Homams')}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t(
                  'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి నేతృత్వంలో సమస్త పూజలు, వివాహ, గృహప్రవేశ క్రతువులు మరియు శాంతి హోమాలు శాస్త్రోక్తంగా స్వయంగా నిర్వహించబడును.',
                  'All Vedic rituals, weddings, Gruhapravesham ceremonies, and Shanti Homams are personally conducted according to authentic Shastra traditions by Sri Jallavaram Sai Dheeraj Sharma Garu.'
                )}
              </p>
            </div>

            <PoojaServicesSection
              onSelectService={(service) => handleOpenBooking(service)}
            />
          </div>
        )}

        {/* TAB 4: ABOUT GURUJI */}
        {activeTab === 'about' && (
          <AboutGurujiSection onOpenBooking={() => handleOpenBooking()} />
        )}

        {/* TAB 5: CONTACT */}
        {activeTab === 'contact' && <ContactSection />}
      </main>
      )}

      {/* Floating WhatsApp Action Widget (8977986166) */}
      <FloatingWhatsApp />

      {/* Booking Modal */}
      <PoojaBookingModal
        isOpen={isBookingOpen}
        selectedService={selectedPoojaForBooking}
        onClose={handleCloseBooking}
      />

      {/* Footer */}
      <Footer onSelectCity={handleSelectCity} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
