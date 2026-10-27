import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
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
import { MuhurthaTimings } from './components/MuhurthaTimings';
import { ActionControls } from './components/ActionControls';
import { Footer } from './components/Footer';
import { GuruProfileHome } from './components/GuruProfileHome';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CitySEOData, findCityBySlug } from './data/citiesData';
import { PanchangamQuickSummary } from './components/PanchangamQuickSummary';
import { syncAutomatedDailySeoSchema } from './utils/dailySeoEngine';
import { downloadDailyPanchangamCardImage } from './utils/panchangamImageGenerator';
import { getOrGenerateDayData } from './utils/astronomyPanchangam';
import type { HubSectionId } from './components/VedicAstrologyHub';
import type { LegalDocType } from './components/LegalComplianceModal';

export type PanchangamSubTab = 'main' | 'gowri-hora' | 'tarabalam' | 'sankalpam';

// Lazy-loaded heavy interactive components, below-the-fold calculators, modals & secondary routes
const RashiChakra = lazy(() =>
  import('./components/RashiChakra').then((m) => ({ default: m.RashiChakra }))
);
const LagnaPramanalu = lazy(() =>
  import('./components/LagnaPramanalu').then((m) => ({ default: m.LagnaPramanalu }))
);
const ChandraNavatara = lazy(() =>
  import('./components/ChandraNavatara').then((m) => ({ default: m.ChandraNavatara }))
);
const DevoteeCompatibilityChecker = lazy(() =>
  import('./components/DevoteeCompatibilityChecker').then((m) => ({
    default: m.DevoteeCompatibilityChecker,
  }))
);
const GowriHoraPanchangam = lazy(() =>
  import('./components/GowriHoraPanchangam').then((m) => ({ default: m.GowriHoraPanchangam }))
);
const TarabalamCalculator = lazy(() =>
  import('./components/TarabalamCalculator').then((m) => ({ default: m.TarabalamCalculator }))
);
const DailySankalpamStotra = lazy(() =>
  import('./components/DailySankalpamStotra').then((m) => ({ default: m.DailySankalpamStotra }))
);
const VedicAstrologyHub = lazy(() =>
  import('./components/VedicAstrologyHub').then((m) => ({ default: m.VedicAstrologyHub }))
);
const JanmaKundaliGenerator = lazy(() =>
  import('./components/JanmaKundaliGenerator').then((m) => ({ default: m.JanmaKundaliGenerator }))
);
const DailyNakshatraArticle = lazy(() =>
  import('./components/DailyNakshatraArticle').then((m) => ({ default: m.DailyNakshatraArticle }))
);
const DailyAstrologyInsights = lazy(() =>
  import('./components/DailyAstrologyInsights').then((m) => ({ default: m.DailyAstrologyInsights }))
);
const PanchangamFAQ = lazy(() =>
  import('./components/PanchangamFAQ').then((m) => ({ default: m.PanchangamFAQ }))
);
const PoojaBookingModal = lazy(() =>
  import('./components/PoojaBookingModal').then((m) => ({ default: m.PoojaBookingModal }))
);
const LegalComplianceModal = lazy(() =>
  import('./components/LegalComplianceModal').then((m) => ({ default: m.LegalComplianceModal }))
);
const CityAstrologyPage = lazy(() =>
  import('./components/CityAstrologyPage').then((m) => ({ default: m.CityAstrologyPage }))
);
const AwardsSection = lazy(() =>
  import('./components/AwardsSection').then((m) => ({ default: m.AwardsSection }))
);
const UpcomingRitualCountdown = lazy(() =>
  import('./components/UpcomingRitualCountdown').then((m) => ({
    default: m.UpcomingRitualCountdown,
  }))
);
const PoojaServicesSection = lazy(() =>
  import('./components/PoojaServicesSection').then((m) => ({ default: m.PoojaServicesSection }))
);
const AboutGurujiSection = lazy(() =>
  import('./components/AboutGurujiSection').then((m) => ({ default: m.AboutGurujiSection }))
);
const ContactSection = lazy(() =>
  import('./components/ContactSection').then((m) => ({ default: m.ContactSection }))
);

const SectionLoader: React.FC<{ minHeight?: string }> = ({ minHeight = 'min-h-[280px]' }) => (
  <div
    className={`w-full ${minHeight} rounded-3xl bg-amber-100/40 border border-amber-200/70 animate-pulse flex items-center justify-center p-6`}
    aria-hidden="true"
  >
    <span className="text-xs font-semibold text-amber-800/70 tracking-wide">
      లోడ్ అవుతోంది... • Loading Vedic Data...
    </span>
  </div>
);

export const TAB_PATHS: Record<NavTab, string> = {
  home: '/',
  panchangam: '/panchangam',
  jathakam: '/mee-jatakam',
  awards: '/awards',
  services: '/services',
  about: '/about',
  contact: '/contact',
};

export const PANCHANGAM_SUBTAB_PATHS: Record<PanchangamSubTab, string> = {
  main: '/panchangam',
  'gowri-hora': '/gowri-panchangam',
  tarabalam: '/tarabalam-chandrabalam',
  sankalpam: '/nitya-sankalpam',
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
    pathname === '/mee-jatakam' ||
    pathname.endsWith('/mee-jatakam') ||
    pathname === '/janma-kundali' ||
    hash === '#jathakam' ||
    hash === '#mee-jatakam'
  ) {
    return 'jathakam';
  }
  if (
    pathname === '/panchangam' ||
    pathname.endsWith('/panchangam') ||
    pathname === '/neti-panchangam' ||
    pathname === '/today-panchangam-in-telugu' ||
    pathname === '/ee-roju-panchangam' ||
    pathname === '/gowri-panchangam' ||
    pathname === '/tarabalam-chandrabalam' ||
    pathname === '/nitya-sankalpam' ||
    pathname === '/telugu-baby-names' ||
    pathname === '/vastu-shastra-telugu' ||
    pathname === '/vivaha-pontana' ||
    pathname === '/naama-nakshatra' ||
    pathname === '/ugadi-rashi-phalalu' ||
    pathname === '/shubha-muhurthalu' ||
    pathname === '/festivals' ||
    pathname === '/dosha-pariharalu' ||
    hash === '#panchangam' ||
    hash === '#dina-phalam' ||
    hash === '#rashi-chakram' ||
    hash === '#muhurthalu' ||
    hash === '#panchangam-faq' ||
    hash === '#vedic-astrology-hub'
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

export function resolvePanchangamSubTabFromLocation(): PanchangamSubTab {
  if (typeof window === 'undefined') return 'main';
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (pathname === '/gowri-panchangam') return 'gowri-hora';
  if (pathname === '/tarabalam-chandrabalam') return 'tarabalam';
  if (pathname === '/nitya-sankalpam') return 'sankalpam';
  return 'main';
}

export function resolveHubSectionFromLocation(): HubSectionId {
  if (typeof window === 'undefined') return 'pontana';
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (pathname === '/janma-kundali') return 'kundali';
  if (pathname === '/naama-nakshatra') return 'akshara';
  if (pathname === '/telugu-baby-names') return 'babynames';
  if (pathname === '/ugadi-rashi-phalalu') return 'ugadi';
  if (pathname === '/shubha-muhurthalu' || pathname === '/festivals') return 'muhurtham';
  if (pathname === '/vastu-shastra-telugu') return 'vastu';
  if (pathname === '/dosha-pariharalu') return 'dosha';
  return 'pontana';
}

export function resolveLegalDocFromLocation(): LegalDocType | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (pathname === '/privacy-policy') return 'privacy';
  if (pathname === '/terms-and-conditions') return 'terms';
  if (pathname === '/disclaimer') return 'disclaimer';
  return null;
}

const LEGAL_DOC_PATHS: Record<LegalDocType, string> = {
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  disclaimer: '/disclaimer',
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => resolveTabFromLocation());
  const [panchangamSubTab, setPanchangamSubTab] = useState<PanchangamSubTab>(() =>
    resolvePanchangamSubTabFromLocation()
  );
  const [hubSection, setHubSection] = useState<HubSectionId>(() => resolveHubSectionFromLocation());
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(() => resolveLegalDocFromLocation());
  const [selectedCity, setSelectedCity] = useState<CitySEOData | null>(() => resolveCityFromLocation());
  const [selectedDayId, setSelectedDayId] = useState<string>(() => getTodayAndTomorrowIds(WEEK_DATA).todayId);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedPoojaForBooking, setSelectedPoojaForBooking] = useState<PoojaService | null>(null);
  const { t, tr, language } = useLanguage();

  const currentDay = getOrGenerateDayData(selectedDayId, WEEK_DATA);

  const handleSelectTab = useCallback((tab: NavTab) => {
    setSelectedCity(null);
    setActiveTab(tab);
    if (tab === 'panchangam') {
      setPanchangamSubTab('main');
    }
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

  const handleSelectPanchangamSubTab = useCallback((subTab: PanchangamSubTab) => {
    setSelectedCity(null);
    setActiveTab('panchangam');
    setPanchangamSubTab(subTab);
    if (typeof window !== 'undefined') {
      const targetPath = PANCHANGAM_SUBTAB_PATHS[subTab] || '/panchangam';
      try {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ tab: 'panchangam', panchangamSubTab: subTab }, '', targetPath);
        }
      } catch {}
    }
  }, []);

  const handleNavigateHubSection = useCallback((section: HubSectionId, path: string) => {
    setSelectedCity(null);
    if (section === 'kundali' || path === '/janma-kundali' || path === '/mee-jatakam') {
      setActiveTab('jathakam');
      if (typeof window !== 'undefined') {
        try {
          window.history.pushState({ tab: 'jathakam' }, '', '/mee-jatakam');
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setActiveTab('panchangam');
    if (path === '/gowri-panchangam') {
      setPanchangamSubTab('gowri-hora');
    } else if (path === '/tarabalam-chandrabalam') {
      setPanchangamSubTab('tarabalam');
    } else if (path === '/nitya-sankalpam') {
      setPanchangamSubTab('sankalpam');
    } else {
      setPanchangamSubTab('main');
      setHubSection(section);
    }

    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== path) {
          window.history.pushState({ tab: 'panchangam', hubSection: section }, '', path);
        }
      } catch {}
      setTimeout(() => {
        if (
          path === '/neti-panchangam' ||
          path === '/today-panchangam-in-telugu' ||
          path === '/ee-roju-panchangam' ||
          path === '/gowri-panchangam' ||
          path === '/tarabalam-chandrabalam' ||
          path === '/nitya-sankalpam'
        ) {
          const subNavEl = document.getElementById('panchangam-sub-tabs');
          if (subNavEl && path !== '/neti-panchangam' && path !== '/today-panchangam-in-telugu' && path !== '/ee-roju-panchangam') {
            subNavEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }
        const el = document.getElementById('vedic-astrology-hub');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
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

  const handleOpenLegal = useCallback((doc: LegalDocType) => {
    setActiveLegalDoc(doc);
    if (typeof window !== 'undefined') {
      try {
        const targetPath = LEGAL_DOC_PATHS[doc];
        if (targetPath && window.location.pathname !== targetPath) {
          window.history.pushState({ legalDoc: doc }, '', targetPath);
        }
      } catch {}
    }
  }, []);

  const handleCloseLegal = useCallback(() => {
    setActiveLegalDoc(null);
    if (typeof window !== 'undefined') {
      try {
        const fallbackPath = TAB_PATHS[activeTab] || '/';
        if (['/privacy-policy', '/terms-and-conditions', '/disclaimer'].includes(window.location.pathname)) {
          window.history.pushState({ tab: activeTab }, '', fallbackPath);
        }
      } catch {}
    }
  }, [activeTab]);

  // Listen to browser Back / Forward navigation (popstate)
  useEffect(() => {
    const onPopState = () => {
      const matchedCity = resolveCityFromLocation();
      setSelectedCity(matchedCity);
      setActiveLegalDoc(resolveLegalDocFromLocation());
      if (!matchedCity) {
        setActiveTab(resolveTabFromLocation());
        setPanchangamSubTab(resolvePanchangamSubTabFromLocation());
        setHubSection(resolveHubSectionFromLocation());
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync document title, canonical link, og:url, meta tags, and Automated Daily JSON-LD Schema dynamically
  useEffect(() => {
    if (selectedCity) return; // CityAstrologyPage component manages its own programmatic metadata

    const rawPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/' : '/';
    const isEvergreenHubRoute = [
      '/neti-panchangam',
      '/today-panchangam-in-telugu',
      '/ee-roju-panchangam',
      '/gowri-panchangam',
      '/tarabalam-chandrabalam',
      '/nitya-sankalpam',
      '/janma-kundali',
      '/telugu-baby-names',
      '/vastu-shastra-telugu',
      '/vivaha-pontana',
      '/naama-nakshatra',
      '/ugadi-rashi-phalalu',
      '/shubha-muhurthalu',
      '/festivals',
      '/dosha-pariharalu',
    ].includes(rawPath);

    const path = isEvergreenHubRoute && activeTab === 'panchangam'
      ? rawPath
      : activeTab === 'panchangam' && panchangamSubTab !== 'main'
      ? PANCHANGAM_SUBTAB_PATHS[panchangamSubTab]
      : TAB_PATHS[activeTab] || '/';
    const canonicalHref = `https://www.telugujyothisham.com${path === '/' ? '/' : path}`;

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

    const cleanTithi = currentDay.panchanga.tithi.split('(')[0].trim();
    const cleanNakshatra = currentDay.panchanga.nakshatram.split('(')[0].trim();

    const evergreenSeoMeta: Record<string, { titleTe: string; titleEn: string; descTe: string; descEn: string }> = {
      '/neti-panchangam': {
        titleTe: `Neti Panchangam (${currentDay.teediVaram}) | నేటి పంచాంగం - ${cleanTithi}, ${cleanNakshatra} — telugujyothisham.com`,
        titleEn: `Neti Panchangam (${currentDay.teediVaram}) | Today Panchangam in Telugu - ${cleanTithi} — telugujyothisham.com`,
        descTe: `${currentDay.teediVaram} నేటి పంచాంగం (Neti Panchangam) & Today Panchangam in Telugu: తిథి ${currentDay.panchanga.tithi}, నక్షత్రం ${currentDay.panchanga.nakshatram}, రాహుకాలం ${currentDay.ashubha.rahukalam}, అమృత ఘడియలు ${currentDay.shubha.amrutha} & 12 రాశుల దిన ఫలాలు.`,
        descEn: `${currentDay.teediVaram} Neti Panchangam (నేటి పంచాంగం) & Today Panchangam in Telugu: Tithi ${currentDay.panchanga.tithi}, Nakshatram ${currentDay.panchanga.nakshatram}, Rahu Kalam ${currentDay.ashubha.rahukalam} & Daily Horoscope at telugujyothisham.com.`,
      },
      '/today-panchangam-in-telugu': {
        titleTe: `Today Panchangam in Telugu (${currentDay.teediVaram}) - ఈ రోజు పంచాంగం: ${cleanTithi}, ${cleanNakshatra} — telugujyothisham.com`,
        titleEn: `Today Panchangam in Telugu (${currentDay.teediVaram}) - ఈ రోజు పంచాంగం - Neti Panchangam — telugujyothisham.com`,
        descTe: `Today Panchangam in Telugu (${currentDay.teediVaram}) - తిథి: ${currentDay.panchanga.tithi}, నక్షత్రం: ${currentDay.panchanga.nakshatram}, యోగం: ${currentDay.panchanga.yogam}, రాహుకాలం: ${currentDay.ashubha.rahukalam}, అమృత ఘడియలు: ${currentDay.shubha.amrutha}.`,
        descEn: `Today Panchangam in Telugu (${currentDay.teediVaram}) - Tithi: ${currentDay.panchanga.tithi}, Nakshatram: ${currentDay.panchanga.nakshatram}, Rahu Kalam: ${currentDay.ashubha.rahukalam}, Durmuhurtham & 12 Rashi Phalithalu.`,
      },
      '/ee-roju-panchangam': {
        titleTe: `ఈ రోజు పంచాంగం (${currentDay.teediVaram}) | Ee Roju Panchangam - ${cleanTithi}, ${cleanNakshatra} — telugujyothisham.com`,
        titleEn: `Ee Roju Panchangam (${currentDay.teediVaram}) | Today Panchangam in Telugu — telugujyothisham.com`,
        descTe: `ఈ రోజు పంచాంగం (${currentDay.teediVaram}) - తిథి ${currentDay.panchanga.tithi}, నక్షత్రం ${currentDay.panchanga.nakshatram}, రాహుకాలం ${currentDay.ashubha.rahukalam}, వర్జ్యం ${currentDay.ashubha.varjyam} & 12 రాశుల దిన ఫలాలు.`,
        descEn: `Ee Roju Panchangam (${currentDay.teediVaram}) - Today Panchangam in Telugu - Tithi ${currentDay.panchanga.tithi}, Nakshatram ${currentDay.panchanga.nakshatram} & Auspicious Timings.`,
      },
      '/gowri-panchangam': {
        titleTe: `నేటి గౌరీ పంచాంగం & హోరా చక్రం (${currentDay.teediVaram}) | Gowri Panchangam Telugu — telugujyothisham.com`,
        titleEn: `Today Gowri Panchangam & Planetary Hora Timings in Telugu (${currentDay.teediVaram}) — telugujyothisham.com`,
        descTe: `${currentDay.teediVaram} పగలు & రాత్రి గౌరీ పంచాంగం (అమృత, శుభ, లాభ, ధన, ఉద్యోగ ఘడియలు) మరియు 24 గంటల నవగ్రహ హోరా చక్రం (గురు, శుక్ర, బుధ, చంద్ర హోరలు) సమయాలు.`,
        descEn: `Live Day and Night Gowri Panchangam auspicious slots (Amrutha, Shubha, Labha, Dhana) and 24-hour Planetary Hora Chakram timings in Telugu for ${currentDay.teediVaram}.`,
      },
      '/tarabalam-chandrabalam': {
        titleTe: `నేటి తారాబలం & చంద్రబలం క్యాలిక్యులేటర్ (${currentDay.teediVaram}) | 27 నక్షత్రాల నవతార చక్రం — telugujyothisham.com`,
        titleEn: `Today Tarabalam & Chandrabalam Calculator in Telugu (${currentDay.teediVaram}) — telugujyothisham.com`,
        descTe: `${currentDay.teediVaram} నక్షత్రం (${cleanNakshatra}) ఆధారంగా 27 నక్షత్రాల నేటి తారాబలం (పరమ మిత్ర, సంపత్, క్షేమ, సాధన తారలు) మరియు 12 రాశుల చంద్రబలం, చంద్రాష్టమ వివరాలు.`,
        descEn: `Check your personal Nakshatra Tarabalam (Navatara 1-9) and Rashi Chandrabalam for today (${currentDay.teediVaram}, ${cleanNakshatra}) online in Telugu.`,
      },
      '/nitya-sankalpam': {
        titleTe: `నేటి పూజా సంకల్పం మంత్రం (${currentDay.teediVaram}) | జంబూద్వీపే & NRI క్రౌంచద్వీపే సంకల్పం — telugujyothisham.com`,
        titleEn: `Today Telugu Pooja Sankalpam Mantra (${currentDay.teediVaram}) | India & USA NRI Sankalpam — telugujyothisham.com`,
        descTe: `${currentDay.teediVaram} (శ్రీ పరాభవ నామ సంవత్సరం, ${currentDay.panchanga.masam}, ${cleanTithi}, ${cleanNakshatra}) ఆటోమేటిక్ తెలుగు నిత్య పూజా సంకల్పం (భారతదేశం, అమెరికా, యూరప్, ఆస్ట్రేలియా) & నేటి స్తోత్ర పారాయణ.`,
        descEn: `Automated daily Telugu Pooja Sankalpam text & audio for ${currentDay.teediVaram} with Jambudweepe (India) and Krounchadweepe (USA/Canada) options.`,
      },
      '/janma-kundali': {
        titleTe: 'ఉచిత తెలుగు జన్మ కుండలి & వింశోత్తరి మహాదశ | Free Janam Kundli in Telugu — telugujyothisham.com',
        titleEn: 'Free Janma Kundali in Telugu | South Indian Rashi Chart & 120-Year Mahadasha — telugujyothisham.com',
        descTe: 'మీ పుట్టిన తేదీ, సమయం, స్థలం ఆధారంగా ఉచిత తెలుగు జన్మ కుండలి (దక్షిణ భారత రాశి చక్రం), జన్మ రాశి, నక్షత్రం, పాదం, లగ్నం మరియు 120 ఏళ్ల వింశోత్తరి మహాదశ ఫలితాలు.',
        descEn: 'Generate your free Telugu Janma Kundali (South Indian Birth Chart), Janma Rashi, Nakshatra Pada, Lagna, and 120-year Vimshottari Mahadasha periods online.',
      },
      '/telugu-baby-names': {
        titleTe: '27 నక్షత్రాల తెలుగు పిల్లల పేర్లు | జన్మ నక్షత్ర అక్షరాలతో బాబు & పాప పేర్లు — telugujyothisham.com',
        titleEn: 'Telugu Baby Names by Nakshatra & Pada | All 27 Stars Boy & Girl Names — telugujyothisham.com',
        descTe: 'అశ్విని నుండి రేవతి వరకు 27 నక్షత్రాల 4 పాదాల నామ అక్షరాలతో (చూ, చే, చో, లా మొదలైనవి) అర్థవంతమైన తెలుగు అబ్బాయిల మరియు అమ్మాయిల పేర్ల పట్టిక.',
        descEn: 'Explore auspicious Telugu boy and girl baby names with meanings organized by all 27 Vedic Nakshatras and 4 Padas.',
      },
      '/vastu-shastra-telugu': {
        titleTe: 'గృహ వాస్తు చక్రం & అష్ట దిక్పాలక వాస్తు నియమాలు | Telugu Vastu Guide — telugujyothisham.com',
        titleEn: 'Telugu Gruha Vastu Shastra Guide | Interactive 8-Direction Vastu Compass — telugujyothisham.com',
        descTe: 'తూర్పు, ఉత్తరం, ఈశాన్యం, ఆగ్నేయం, నైరుతి, వాయువ్యం — 8 దిక్కుల అష్ట దిక్పాలక గృహ వాస్తు చక్రం, పూజా గది, వంట గది, మాస్టర్ బెడ్ రూమ్ వాస్తు నియమాలు & దోష పరిహారాలు.',
        descEn: 'Interactive 8-direction Ashta Dikpala Gruha Vastu Shastra guide in Telugu for main entrance, pooja room, kitchen, and bedroom placement.',
      },
      '/vivaha-pontana': {
        titleTe: 'వివాహ పొంతన & 36 గుణ మిళనం | అష్టకూట వధూవరుల రాశి పొంతన — telugujyothisham.com',
        titleEn: '36-Point Marriage Compatibility (Vivaha Pontana) | Ashtakoota Guna Milan — telugujyothisham.com',
        descTe: 'వధూవరుల రాశుల ఆధారంగా 36 గుణాల అష్టకూట వివాహ పొంతన (వర్ణ, వశ్య, తార, యోని, గ్రహ మైత్రి, గణ, భకూట, నాడి) ఉచితంగా లెక్కించండి. శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి జ్యోతిష విశ్లేషణ.',
        descEn: 'Calculate authentic 36-point Vedic Ashtakoota Guna Milan marriage compatibility for bride and groom Rashis online at telugujyothisham.com.',
      },
      '/naama-nakshatra': {
        titleTe: 'పేరు మొదటి అక్షరంతో రాశి & నక్షత్రం | 27 నక్షత్రాల నామ అక్షర పట్టిక — telugujyothisham.com',
        titleEn: 'Find Rashi & Nakshatra by Name First Letter | Telugu Naama Nakshatra Finder — telugujyothisham.com',
        descTe: 'పుట్టిన సమయం తెలియకపోయినా మీ పేరు మొదటి అక్షరం (చూ, చే, చో, లా మొదలైనవి) ద్వారా మీ జన్మ రాశి, నక్షత్రం, గణం, నాడి మరియు రజ్జు వివరాలను వెంటనే తెలుసుకోండి.',
        descEn: 'Instantly find your Vedic Moon Sign (Rashi), Nakshatra, Gana, Nadi, and Rajju using the first syllable of your name across all 27 Nakshatras.',
      },
      '/ugadi-rashi-phalalu': {
        titleTe: 'శ్రీ పరాభవ నామ సంవత్సర ఉగాది రాశి ఫలాలు 2026-2027 | ఆదాయం - వ్యయం — telugujyothisham.com',
        titleEn: 'Sri Parabhava Nama Samvatsara Ugadi Rashi Phalalu 2026-2027 | Aadayam Vyayam — telugujyothisham.com',
        descTe: '2026-2027 శ్రీ పరాభవ నామ సంవత్సర ద్వాదశ రాశుల ఉగాది పంచాంగం, ఆదాయం - వ్యయం, రాజపూజ్యం - అవమానం మరియు వార్షిక గ్రహ శాంతి పరిహారాలు.',
        descEn: 'Complete 2026-2027 Sri Parabhava Nama Samvatsara Telugu Ugadi yearly horoscope, Aadayam-Vyayam, Rajapujyam-Avamanam, and remedies for all 12 Rashis.',
      },
      '/shubha-muhurthalu': {
        titleTe: 'శుభ ముహూర్తాలు 2026-2027 | వివాహం, గృహప్రవేశం, అక్షరాభ్యాసం తేదీలు — telugujyothisham.com',
        titleEn: 'Shubha Muhurtham Dates 2026-2027 | Marriage, Gruhapravesham & Pooja Timings — telugujyothisham.com',
        descTe: 'వివాహం, గృహప్రవేశం, అక్షరాభ్యాసం, అన్నప్రాసన మరియు వాహన కొనుగోలుకు దృక్సిద్ధాంత ప్రామాణిక శుభ ముహూర్త తేదీలు, లగ్న సమయాలు మరియు ఏకాదశి, పౌర్ణమి తిథుల క్యాలెండర్.',
        descEn: 'Verified auspicious Telugu Muhurtham dates for weddings, Gruhapravesham, Aksharabhyasam, Annaprasana, and Ekadashi/Pournami festival calendar.',
      },
      '/festivals': {
        titleTe: 'తెలుగు పండుగలు & తిథుల క్యాలెండర్ | ఏకాదశి, పౌర్ణమి, అమావాస్య తేదీలు — telugujyothisham.com',
        titleEn: 'Telugu Festivals & Tithi Calendar | Ekadashi, Pournami, Chaturthi Dates — telugujyothisham.com',
        descTe: 'ఏకాదశి, పౌర్ణమి, అమావాస్య, సంకష్టహర చతుర్థి, సుబ్రహ్మణ్య షష్ఠి మరియు ప్రదోషం తిథుల తేదీలు, పండుగల విశేషాలు.',
        descEn: 'Find upcoming Telugu festival dates, Ekadashi, Pournami, Amavasya, Sankashtahara Chaturthi, and Pradosham timings.',
      },
      '/dosha-pariharalu': {
        titleTe: 'కుజ దోషం, కాలసర్ప దోషం & ఏలినాటి శని నివారణ పరిహారాలు — telugujyothisham.com',
        titleEn: 'Kuja Dosha, Kalasarpa Dosha & Elinati Shani Remedies | Vedic Shanti Guide — telugujyothisham.com',
        descTe: 'జాతకంలోని కుజ దోషం, కాలసర్ప దోషం, ఏలినాటి శని, అష్టమ శని మరియు గండమూల నక్షత్ర దోషాలకు శాస్త్రోక్త వైదిక శాంతి పరిహారాలు మరియు హోమ వివరాలు.',
        descEn: 'Authentic Vedic astrology guide and Shanti remedies for Kuja Dosha (Manglik), Kalasarpa Dosha, Sade Sati (Elinati Shani), and Gandamoola Nakshatras.',
      },
    };

    const titlesTelugu: Record<NavTab, string> = {
      home: `Neti Panchangam (${currentDay.teediVaram}) | నేటి తెలుగు పంచాంగం, తిథి (${cleanTithi}), నక్షత్రం (${cleanNakshatra}), రాశి ఫలాలు — telugujyothisham.com`,
      panchangam: `నేటి పంచాంగం (${currentDay.teediVaram}) | Today Panchangam in Telugu - తిథి: ${cleanTithi}, నక్షత్రం: ${cleanNakshatra} — telugujyothisham.com`,
      jathakam: 'మీ జాతకం తెలుసుకోండి | ఉచిత తెలుగు జన్మ కుండలి & సంపూర్ణ బృహత్ జాతక ఫలితాల గ్రంథం — telugujyothisham.com',
      awards: 'పొందిన సత్కారాలు & పురస్కారాలు | శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (telugujyothisham.com/awards)',
      services: 'వైదిక పూజా సేవలు & హోమాలు | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/services)',
      about: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి గురించి | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/about)',
      contact: 'సంప్రదించండి | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/contact)',
    };

    const titlesEnglish: Record<NavTab, string> = {
      home: `Neti Panchangam (${currentDay.teediVaram}) | Today Panchangam in Telugu - ${cleanTithi}, ${cleanNakshatra} — telugujyothisham.com`,
      panchangam: `Today Panchangam in Telugu (${currentDay.teediVaram}) - ఈ రోజు పంచాంగం: ${cleanTithi}, ${cleanNakshatra} — telugujyothisham.com`,
      jathakam: 'Know Your Horoscope | Free Telugu Janma Kundali & Brihat Jathaka Grantham — telugujyothisham.com',
      awards: 'Vedic Honors & Awards | Sri Jallavaram Sai Dheeraj Sharma — telugujyothisham.com/awards',
      services: 'Vedic Homams & Rituals | Sri Chandi Homam, Lakshmi Kubera Yagam — telugujyothisham.com/services',
      about: 'About Sri Jallavaram Sai Dheeraj Sharma | Renowned Vedic Astrologer — telugujyothisham.com/about',
      contact: 'Contact Vedic Astrologer & Purohit | Sri Lakshmi Ganapathi Astrology — telugujyothisham.com/contact',
    };

    const descriptionsTelugu: Record<NavTab, string> = {
      home: `${currentDay.teediVaram} నేటి పంచాంగం (Neti Panchangam / Today Panchangam in Telugu): తిథి ${currentDay.panchanga.tithi}, నక్షత్రం ${currentDay.panchanga.nakshatram}, రాహుకాలం ${currentDay.ashubha.rahukalam}, అమృత ఘడియలు ${currentDay.shubha.amrutha}, గౌరీ పంచాంగం, జన్మ కుండలి & 12 రాశుల దిన ఫలాలు.`,
      panchangam: `${currentDay.teediVaram} ఈ రోజు తెలుగు పంచాంగం (Today Panchangam in Telugu): తిథి ${currentDay.panchanga.tithi}, నక్షత్రం ${currentDay.panchanga.nakshatram}, రాహుకాలం ${currentDay.ashubha.rahukalam}, గౌరీ పంచాంగం, హోరా చక్రం, తారాబలం, నిత్య సంకల్పం & 12 రాశుల దిన ఫలాలు.`,
      jathakam: 'మీ పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా ఉచిత తెలుగు జన్మ కుండలి (D1 రాశి చక్రం, D9 నవాంశ చక్రం), ద్వాదశ స్థానాల ఫలితాలు, 120 ఏళ్ల వింశోత్తరి మహాదశ మరియు సంపూర్ణ బృహత్ జాతక మహాగ్రంథం.',
      awards: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు పొందిన జ్యోతిష సత్కారాలు, బిరుదులు మరియు పూజా పురస్కారాల వివరాలు.',
      services: 'శ్రీ చండీ హోమం, లక్ష్మీ గణపతి హోమం, సుదర్శన హోమం, వివాహ, గృహప్రవేశ క్రతువులు శాస్త్రోక్తంగా నిర్వహించబడును.',
      about: 'జ్యోతిష పండితులు, స్మార్త వేద విద్వాంసులు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్యాత్మిక ప్రస్థానం మరియు అనుభవం.',
      contact: 'జ్యోతిష సంప్రదింపులు, ముహూర్త నిర్ణయం మరియు పూజా బుకింగ్ కొరకు శ్రీ ధీరజ్ శర్మ గారిని సంప్రదించండి.',
    };

    const descriptionsEnglish: Record<NavTab, string> = {
      home: `Today Panchangam in Telugu (${currentDay.teediVaram} / Neti Panchangam): Tithi ${currentDay.panchanga.tithi}, Nakshatram ${currentDay.panchanga.nakshatram}, Rahu Kalam ${currentDay.ashubha.rahukalam}, Amrutha Gadiyalu, Free Janma Kundali & Daily Horoscope.`,
      panchangam: `Today Panchangam in Telugu (${currentDay.teediVaram}): Tithi ${currentDay.panchanga.tithi}, Nakshatram ${currentDay.panchanga.nakshatram}, Rahu Kalam ${currentDay.ashubha.rahukalam}, Gowri Panchangam, Hora Timings, Tarabalam & 12 Rashi Phalalu.`,
      jathakam: 'Generate your free Telugu Janma Kundali (D1 Rashi, D9 Navamsha), 12-house predictions, 96-year Bhrigu Chakra progression, Lucky Gemstones, and comprehensive horoscope report.',
      awards: 'Prestigious Vedic awards, golden kankanam citations, and state-level felicitations conferred upon Sri Jallavaram Sai Dheeraj Sharma.',
      services: 'Authentic Vedic homams, Sri Chandi Sahitha Rudra Homam, Gruhapravesham, wedding muhurthams, and online sankalpam booking for global NRI devotees.',
      about: 'Profile and spiritual journey of renowned Vedic scholar and astrologer Sri Jallavaram Sai Dheeraj Sharma.',
      contact: 'Consult renowned Telugu astrologer and Smartha purohit Sri Dheeraj Sharma for horoscope consultation, muhurtham, and pooja bookings.',
    };

    const matchedEvergreen = isEvergreenHubRoute && activeTab === 'panchangam'
      ? evergreenSeoMeta[rawPath]
      : activeTab === 'panchangam' && panchangamSubTab !== 'main'
      ? evergreenSeoMeta[PANCHANGAM_SUBTAB_PATHS[panchangamSubTab]]
      : undefined;

    const targetTitle = matchedEvergreen
      ? language === 'en'
        ? matchedEvergreen.titleEn
        : matchedEvergreen.titleTe
      : (language === 'en' ? titlesEnglish : titlesTelugu)[activeTab] || titlesTelugu.home;

    const targetDesc = matchedEvergreen
      ? language === 'en'
        ? matchedEvergreen.descEn
        : matchedEvergreen.descTe
      : (language === 'en' ? descriptionsEnglish : descriptionsTelugu)[activeTab] || descriptionsTelugu.home;

    document.title = targetTitle;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }

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

    // Inject/update automated daily JSON-LD schema for Google Search & AI Overviews
    syncAutomatedDailySeoSchema(currentDay, path, panchangamSubTab);
  }, [activeTab, panchangamSubTab, hubSection, language, selectedCity, currentDay]);

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
        <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
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
        </Suspense>
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
        {activeTab === 'awards' && (
          <Suspense fallback={<SectionLoader minHeight="min-h-[500px]" />}>
            <AwardsSection />
          </Suspense>
        )}

        {/* TAB: MEE JATAKAM TELUSUKONDI (మీ జాతకం తెలుసుకోండి — సంపూర్ణ బృహత్ జాతక మహాగ్రంథం) */}
        {activeTab === 'jathakam' && (
          <div className="space-y-10">
            <div className="bg-gradient-to-r from-amber-950 via-[#3b1506] to-amber-950 text-white rounded-3xl p-5 sm:p-8 border-2 border-amber-500/60 shadow-lg no-print">
              <div className="max-w-4xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block">
                  {t(
                    'శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం · బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
                    'Sri Lakshmi Ganapathi Jyothishalayam · Brahmasri Jallavaram Sai Dheeraj Sharma'
                  )}
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {t(
                    'మీ జాతకం తెలుసుకోండి — ఉచిత జన్మ కుండలి & సంపూర్ణ బృహత్ జాతక మహాగ్రంథం',
                    'Know Your Horoscope — Free Janma Kundali & Comprehensive Vedic Predictions'
                  )}
                </h1>
                <p className="text-xs sm:text-base text-amber-100/90 leading-relaxed">
                  {t(
                    'మీ పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా దృక్సిద్ధాంత రాశి చక్రం (D1), నవాంశ చక్రం (D9), సూర్య-చంద్ర ఆత్మ-మనస్సు విశ్లేషణ, పంచభూత గ్రహ బలం, 1 నుండి 12 స్థానాల సంపూర్ణ ఫలితాలు, 96 ఏళ్ల భృగు చక్ర కాలగమనం, వింశోత్తరి మహాదశ మరియు అదృష్ట రత్న/రుద్రాక్ష పరిహారాలు.',
                    'Enter your birth details below to generate your D1 Rashi Chart, D9 Navamsha, 8-Chapter Brihat Jathaka Grantham, all 12 House predictions, 96-year Bhrigu progression, and Vedic remedies.'
                  )}
                </p>
              </div>
            </div>

            <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
              <JanmaKundaliGenerator onOpenBooking={() => handleOpenBooking()} />
            </Suspense>

            <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
              <VedicAstrologyHub
                initialSection="pontana"
                onOpenBooking={() => handleOpenBooking()}
              />
            </Suspense>
          </div>
        )}

        {/* TAB 2: DEDICATED SUB-MENU FOR PANCHANGAM */}
        {activeTab === 'panchangam' && (
          <div className="space-y-10">
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

            {/* Selected Date Header + 1-Click WhatsApp Status Card Download */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-amber-200/80 pb-4">
              <div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest font-display">
                  {t('ఎంచుకున్న రోజు వివరాలు • Selected Day Overview', 'Selected Day Overview')}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-950 font-telugu mt-0.5">
                  {tr(currentDay.label)} {t('పంచాంగం', 'Panchangam')}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-base sm:text-lg text-amber-900 font-semibold font-telugu bg-amber-100/70 px-4 py-1.5 rounded-xl border border-amber-200">
                  {tr(currentDay.teediVaram)}
                </p>
                <button
                  type="button"
                  onClick={() => downloadDailyPanchangamCardImage(currentDay)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  <span>📲</span>
                  <span>
                    {t(
                      'వాట్సాప్ స్టేటస్ పంచాంగం ఇమేజ్ డౌన్‌లోడ్',
                      'Download WhatsApp Status Card'
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* LEVEL-2 PANCHANGAM SUB-TABS (2-Level Clean Navigation Architecture) */}
            <nav
              id="panchangam-sub-tabs"
              aria-label="Daily Panchangam Sub-Sections"
              className="bg-gradient-to-r from-amber-950 via-[#3b1506] to-amber-950 p-2 sm:p-3 rounded-2xl border-2 border-amber-500/50 shadow-md scroll-mt-24"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {(
                  [
                    {
                      id: 'main' as PanchangamSubTab,
                      href: '/panchangam',
                      badge: '1. పంచాంగం & రాశి ఫలాలు',
                      titleTe: '📅 ప్రధాన పంచాంగం & దిన ఫలం',
                      titleEn: '📅 Main Panchangam & Horoscope',
                    },
                    {
                      id: 'gowri-hora' as PanchangamSubTab,
                      href: '/gowri-panchangam',
                      badge: '2. తక్షణ శుభ సమయం',
                      titleTe: '⏳ గౌరీ పంచాంగం & హోరా చక్రం',
                      titleEn: '⏳ Gowri Panchangam & Hora',
                    },
                    {
                      id: 'tarabalam' as PanchangamSubTab,
                      href: '/tarabalam-chandrabalam',
                      badge: '3. వ్యక్తిగత బలం',
                      titleTe: '🌟 తారాబలం & చంద్రబలం',
                      titleEn: '🌟 Tarabalam & Chandrabalam',
                    },
                    {
                      id: 'sankalpam' as PanchangamSubTab,
                      href: '/nitya-sankalpam',
                      badge: '4. నిత్య పూజ & NRI సంకల్పం',
                      titleTe: '🙏 నేటి సంకల్పం & నిత్య స్తోత్రం',
                      titleEn: '🙏 Daily Sankalpam & Stotra',
                    },
                  ] as const
                ).map((tab) => {
                  const isActive = panchangamSubTab === tab.id;
                  return (
                    <a
                      key={tab.id}
                      href={tab.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectPanchangamSubTab(tab.id);
                      }}
                      className={`flex flex-col items-start justify-center px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 border-amber-200 shadow-md font-bold'
                          : 'bg-amber-900/50 hover:bg-amber-900/80 text-amber-100 border-amber-700/60'
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold ${
                          isActive ? 'text-amber-950/80' : 'text-amber-300/90'
                        }`}
                      >
                        {tab.badge}
                      </span>
                      <span className="text-xs sm:text-sm font-bold mt-0.5 leading-snug">
                        {language === 'en' ? tab.titleEn : tab.titleTe}
                      </span>
                    </a>
                  );
                })}
              </div>
            </nav>

            {/* SUB-TAB 2: GOWRI PANCHANGAM & HORA CHAKRAM */}
            {panchangamSubTab === 'gowri-hora' && (
              <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                <GowriHoraPanchangam day={currentDay} />
              </Suspense>
            )}

            {/* SUB-TAB 3: TARABALAM & CHANDRABALAM CALCULATOR */}
            {panchangamSubTab === 'tarabalam' && (
              <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                <TarabalamCalculator day={currentDay} />
              </Suspense>
            )}

            {/* SUB-TAB 4: DAILY POOJA SANKALPAM & STOTRA */}
            {panchangamSubTab === 'sankalpam' && (
              <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                <DailySankalpamStotra day={currentDay} />
              </Suspense>
            )}

            {/* SUB-TAB 1 (DEFAULT): MAIN PANCHANGAM OVERVIEW */}
            {panchangamSubTab === 'main' && (
              <>
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
                      <Suspense fallback={<SectionLoader minHeight="min-h-[480px]" />}>
                        <RashiChakra day={currentDay} />
                      </Suspense>
                    </div>
                  </div>
                </section>

                {/* Muhurthas: Auspicious vs Inauspicious Times */}
                <section id="muhurthalu" className="scroll-mt-24">
                  <MuhurthaTimings day={currentDay} />
                </section>

                {/* 12 Lagnas with Active Time Indicator */}
                <section id="lagnalu" className="scroll-mt-24">
                  <Suspense fallback={<SectionLoader minHeight="min-h-[320px]" />}>
                    <LagnaPramanalu day={currentDay} />
                  </Suspense>
                </section>

                {/* Chandra Sancharam, Chandrashtamam, Navatara Balam */}
                <section>
                  <Suspense fallback={<SectionLoader minHeight="min-h-[320px]" />}>
                    <ChandraNavatara day={currentDay} />
                  </Suspense>
                </section>

                {/* Interactive Personal Zodiac & Nakshatra Checker */}
                <Suspense fallback={<SectionLoader minHeight="min-h-[360px]" />}>
                  <DevoteeCompatibilityChecker day={currentDay} />
                </Suspense>
              </>
            )}

            {/* Complete Vedic Astrology & Muhurtham SEO Hub (Free Janma Kundali, Marriage Compatibility, Name Syllable Star Finder, Baby Names, Ugadi Aadayam-Vyayam, Shubha Muhurthams, Gruha Vastu & Dosha Remedies) */}
            <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
              <VedicAstrologyHub
                initialSection={hubSection}
                onOpenBooking={() => handleOpenBooking()}
              />
            </Suspense>

            {/* Daily In-Depth Nakshatra & Tithi Phala Article (Based on Krishna Rau's Classical Text) */}
            <Suspense fallback={<SectionLoader minHeight="min-h-[360px]" />}>
              <DailyNakshatraArticle
                currentDay={currentDay}
                onOpenBooking={() => handleOpenBooking()}
              />
            </Suspense>

            {/* Daily Astrology Guidance Insights & Simulated Live Planetary Movement Stream */}
            <Suspense fallback={<SectionLoader minHeight="min-h-[320px]" />}>
              <DailyAstrologyInsights
                onOpenBooking={() => handleOpenBooking()}
              />
            </Suspense>

            {/* Beginner-Friendly Panchangam FAQ Section (Tithi, Nakshatra, Muhurtham, etc.) */}
            <Suspense fallback={<SectionLoader minHeight="min-h-[320px]" />}>
              <PanchangamFAQ />
            </Suspense>

            {/* Sharing & Quick Action Controls */}
            <ActionControls
              day={currentDay}
              onOpenBooking={() => handleOpenBooking()}
            />
          </div>
        )}

        {/* TAB 3: POOJA SERVICES & LIVE UPCOMING RITUAL COUNTDOWN */}
        {activeTab === 'services' && (
          <Suspense fallback={<SectionLoader minHeight="min-h-[520px]" />}>
            <div className="space-y-10">
              {/* Live Upcoming Temple Event & Homam Countdown Section */}
              <UpcomingRitualCountdown
                onOpenBooking={(service) => handleOpenBooking(service)}
              />

              <PoojaServicesSection
                onSelectService={(service) => handleOpenBooking(service)}
              />
            </div>
          </Suspense>
        )}

        {/* TAB 4: ABOUT GURUJI */}
        {activeTab === 'about' && (
          <Suspense fallback={<SectionLoader minHeight="min-h-[480px]" />}>
            <AboutGurujiSection onOpenBooking={() => handleOpenBooking()} />
          </Suspense>
        )}

        {/* TAB 5: CONTACT */}
        {activeTab === 'contact' && (
          <Suspense fallback={<SectionLoader minHeight="min-h-[480px]" />}>
            <ContactSection />
          </Suspense>
        )}
      </main>
      )}

      {/* Floating WhatsApp Action Widget (8977986166) */}
      <FloatingWhatsApp />

      {/* Booking Modal — Lazy loaded only when opened */}
      {isBookingOpen && (
        <Suspense fallback={null}>
          <PoojaBookingModal
            isOpen={isBookingOpen}
            selectedService={selectedPoojaForBooking}
            onClose={handleCloseBooking}
          />
        </Suspense>
      )}

      {/* Legal & AdSense Compliance Modal — Lazy loaded only when opened */}
      {activeLegalDoc && (
        <Suspense fallback={null}>
          <LegalComplianceModal
            activeDoc={activeLegalDoc}
            onClose={handleCloseLegal}
            onSelectDoc={handleOpenLegal}
          />
        </Suspense>
      )}

      {/* Footer */}
      <Footer
        onSelectCity={handleSelectCity}
        onNavigateHubSection={handleNavigateHubSection}
        onOpenLegal={handleOpenLegal}
      />
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


