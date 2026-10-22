import React, { useState } from 'react';
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

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedDayId, setSelectedDayId] = useState<string>(() => getTodayAndTomorrowIds(WEEK_DATA).todayId);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedPoojaForBooking, setSelectedPoojaForBooking] = useState<PoojaService | null>(null);
  const { t, tr } = useLanguage();

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
    setActiveTab('panchangam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAwards = () => {
    setActiveTab('awards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#faf7f2] text-slate-900 font-telugu">
      {/* Top Navigation with language switcher, tabs, bell & booking CTA */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Router based on Active Tab */}
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
                <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 font-telugu mt-0.5">
                  {tr(currentDay.label)} {t('పంచాంగం', 'Panchangam')}
                </h2>
              </div>
              <p className="text-base sm:text-lg text-amber-900 font-semibold font-telugu bg-amber-100/70 px-4 py-1.5 rounded-xl border border-amber-200">
                {tr(currentDay.teediVaram)}
              </p>
            </div>

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

      {/* Floating WhatsApp Action Widget (8977986166) */}
      <FloatingWhatsApp />

      {/* Booking Modal */}
      <PoojaBookingModal
        isOpen={isBookingOpen}
        selectedService={selectedPoojaForBooking}
        onClose={handleCloseBooking}
      />

      {/* Footer */}
      <Footer />
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
