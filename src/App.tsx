import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
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
import { syncHeadMetaTags } from './utils/dailySeoEngine';
import { resolveLocalizedCityRoute, LocalizedPageIntent } from './components/SEOContentManager';
import { getOrGenerateDayData } from './utils/astronomyPanchangam';
import type { HubSectionId } from './components/VedicAstrologyHub';
import type { LegalDocType } from './components/LegalComplianceModal';
import type { ClientKundaliPrefill } from './components/AdminDashboard';
import { LiveSiteAnnouncementBanner } from './components/LiveSiteAnnouncementBanner';
import { KartikaScrollingTicker } from './components/KartikaScrollingTicker';
import { AstroSearchTopic, searchAstroTopics } from './data/astroSearchIndex';
import { DailyPanchangamRouteBar } from './components/DailyPanchangamRouteView';
import {
  AuthorBioAndInternalLinks,
  StandaloneLegalPage,
} from './components/AuthorBioAndInternalLinks';
import {
  CityTimingConfig,
  buildCleanJsonLdSchema,
  generatePageMetadata,
} from './seo/panchangamSsrEngine';
import { DailySubhashithamCard } from './components/DailySubhashithamCard';

export type PanchangamSubTab = 'main' | 'gowri-hora' | 'tarabalam' | 'sankalpam';

const RashiChakra = lazy(() =>
  import('./components/RashiChakra').then((m) => ({ default: m.RashiChakra }))
);
const LagnaPramanalu = lazy(() =>
  import('./components/LagnaPramanalu').then((m) => ({ default: m.LagnaPramanalu }))
);
const ChandraNavatara = lazy(() =>
  import('./components/ChandraNavatara').then((m) => ({ default: m.ChandraNavatara }))
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
const SampleJathakamPage = lazy(() =>
  import('./components/SampleJathakamPage').then((m) => ({ default: m.SampleJathakamPage }))
);
const GocharaPhalaluView = lazy(() =>
  import('./components/GocharaPhalaluView').then((m) => ({ default: m.GocharaPhalaluView }))
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
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const MuhurthamCalculator = lazy(() =>
  import('./components/MuhurthamCalculator').then((m) => ({ default: m.MuhurthamCalculator }))
);
const KartikaAbhishekamPage = lazy(() =>
  import('./components/KartikaAbhishekamPage').then((m) => ({ default: m.KartikaAbhishekamPage }))
);
const DwadasaRashiVedicGuide = lazy(() =>
  import('./components/DwadasaRashiVedicGuide').then((m) => ({ default: m.DwadasaRashiVedicGuide }))
);
const VedicArticleReader = lazy(() =>
  import('./components/VedicArticleReader').then((m) => ({ default: m.VedicArticleReader }))
);
const VedicArticlesDirectory = lazy(() =>
  import('./components/VedicArticlesDirectory').then((m) => ({ default: m.VedicArticlesDirectory }))
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

const LazyViewportSection: React.FC<{
  children: React.ReactNode;
  minHeight?: string;
  rootMargin?: string;
}> = ({ children, minHeight = 'min-h-[480px]', rootMargin = '320px' }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={containerRef} className="h-full">
      {isVisible ? (
        <Suspense fallback={<SectionLoader minHeight={minHeight} />}>{children}</Suspense>
      ) : (
        <SectionLoader minHeight={minHeight} />
      )}
    </div>
  );
};

export const TAB_PATHS: Record<NavTab, string> = {
  home: '/',
  panchangam: '/panchangam',
  vyasalu: '/vedic-articles',
  kartika: '/kartika-abhishekam',
  muhurtham: '/muhurtham',
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

function resolveInitialIsoDateFromLocation(): string {
  if (typeof window !== 'undefined') {
    const m = window.location.pathname.match(/^\/panchangam\/(\d{4}-\d{2}-\d{2})\/?$/);
    if (m) return m[1];
  }
  return getTodayAndTomorrowIds(WEEK_DATA).todayId;
}

function resolveCalendarViewFromLocation(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.replace(/\/+$/, '') === '/panchangam/calendar';
}

function resolveCityTimingSlugFromLocation(): CityTimingConfig['slug'] | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const m = pathname.match(
    /^\/(?:panchangam|panchangam\/city|neti-panchangam-in)[/-](hyderabad|vijayawada|visakhapatnam|usa)$/
  );
  return m ? (m[1] as CityTimingConfig['slug']) : null;
}

export function resolveCityFromLocation(): CitySEOData | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  // Let /panchangam/[city] and /neti-panchangam-in-[city] for our 4 primary cities render in the Panchangam local timings view
  if (resolveCityTimingSlugFromLocation()) return null;

  const localizedMatch = resolveLocalizedCityRoute(pathname);
  if (localizedMatch) return localizedMatch.city;

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

export function resolveCityIntentFromLocation(): LocalizedPageIntent {
  if (typeof window === 'undefined') return 'astrologer-purohit';
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const localizedMatch = resolveLocalizedCityRoute(pathname);
  return localizedMatch?.intent || 'astrologer-purohit';
}

export function resolveTabFromLocation(): NavTab {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();

  if (
    pathname === '/kartika-abhishekam' ||
    pathname.startsWith('/kartika') ||
    pathname === '/rudrabhishekam' ||
    pathname === '/kartika-masam' ||
    pathname === '/kartika-somavaram' ||
    hash === '#kartika' ||
    hash === '#rudrabhishekam'
  ) {
    return 'kartika';
  }
  if (
    pathname === '/muhurtham' ||
    pathname.startsWith('/muhurtham/') ||
    pathname === '/shubha-muhurthalu' ||
    pathname === '/shubha-muhurtham' ||
    pathname === '/vivaha-muhurtham' ||
    pathname === '/gruha-pravesha-muhurtham' ||
    pathname === '/manchi-muhurtham' ||
    hash === '#muhurtham' ||
    hash === '#muhurthalu'
  ) {
    return 'muhurtham';
  }
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
    pathname === '/vedic-articles' ||
    pathname === '/vyasalu' ||
    pathname === '/shastras' ||
    pathname === '/dwadasa-rashi-rahasyalu' ||
    pathname === '/astroinformatics-research' ||
    pathname === '/research' ||
    hash === '#vyasalu' ||
    hash === '#vedic-articles' ||
    hash === '#shastras' ||
    hash === '#dwadasa-rashi-vedic-encyclopedia' ||
    hash === '#research'
  ) {
    return 'vyasalu';
  }
  if (
    pathname === '/panchangam' ||
    pathname.startsWith('/panchangam/') ||
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
    pathname === '/festivals' ||
    pathname === '/dosha-pariharalu' ||
    pathname === '/gochara-phalalu' ||
    pathname.startsWith('/gochara-phalalu/') ||
    pathname === '/yelinati-shani' ||
    Boolean(resolveCityTimingSlugFromLocation()) ||
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
  if (pathname === '/dwadasa-rashi-rahasyalu') return 'rashiguide';
  if (pathname === '/astroinformatics-research' || pathname === '/research') return 'research';
  if (pathname === '/vedic-articles' || pathname === '/shastras') return 'shastras';
  return 'pontana';
}

export function resolveVedicArticleSlugFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (pathname === '/swarodaya-shastra') return 'swarodaya-shastra';
  if (pathname === '/balarishta-dosha-shanti') return 'balarishta-dosha-shanti';
  if (pathname === '/prashna-nimitta-shastra') return 'prashna-nimitta-shastra';
  if (pathname === '/graha-vakra-gati') return 'graha-vakra-gati';
  if (pathname === '/surya-siddhanta-kala-ganana') return 'surya-siddhanta-kala-ganana';
  if (
    pathname === '/classical-astrology-faq' ||
    pathname === '/vedic-astro-qa-1959' ||
    pathname === '/jyotish-faq'
  )
    return 'classical-astrology-faq';
  if (pathname === '/jyotisha-paribhasha-rahasyalu') return 'jyotisha-paribhasha-rahasyalu';
  if (
    pathname === '/hasta-samudrika-rekhala-vignanam' ||
    pathname === '/palmistry-telugu' ||
    pathname === '/hasta-samudrikam'
  )
    return 'hasta-samudrika-rekhala-vignanam';
  if (
    pathname === '/why-are-geminis-so-powerful' ||
    pathname === '/mithuna-rashi-power' ||
    pathname === '/gemini-superpowers-iq'
  )
    return 'why-are-geminis-so-powerful';
  if (
    pathname === '/who-is-libras-true-love' ||
    pathname === '/libra-soulmate-compatibility' ||
    pathname === '/how-do-you-explain-astrology'
  )
    return 'who-is-libras-true-love';
  if (
    pathname === '/pawan-kalyan-raja-yoga-horoscope-analysis' ||
    pathname === '/pawan-kalyan-jathakam' ||
    pathname === '/pawan-kalyan-astrology'
  )
    return 'pawan-kalyan-raja-yoga-horoscope-analysis';
  if (
    pathname === '/cricket-sports-astrology-ind-u19-vs-uae-u19-prashna-guide' ||
    pathname === '/ind-u19-vs-uae-u19-astrology' ||
    pathname === '/cricket-prashna-shastra'
  )
    return 'cricket-sports-astrology-ind-u19-vs-uae-u19-prashna-guide';
  if (
    pathname === '/swapna-shastra-dream-meaning-medical-astrology-1944' ||
    pathname === '/swapna-shastra-telugu' ||
    pathname === '/snake-dream-meaning-astrology'
  )
    return 'swapna-shastra-dream-meaning-medical-astrology-1944';
  if (
    pathname === '/fmge-medical-astrology-doctor-yoga-exam-success-guide' ||
    pathname === '/fmge-exam-astrology' ||
    pathname === '/doctor-yoga-in-kundali'
  )
    return 'fmge-medical-astrology-doctor-yoga-exam-success-guide';
  return null;
}

export function resolveVedicDirectoryFromLocation(): boolean {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();
  return (
    pathname === '/vedic-articles' ||
    pathname === '/vyasalu' ||
    pathname === '/shastras' ||
    hash === '#vyasalu' ||
    hash === '#vedic-articles' ||
    hash === '#shastras'
  );
}

export function resolveLegalDocFromLocation(): LegalDocType | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (pathname === '/privacy-policy' || pathname === '/privacy') return 'privacy';
  if (pathname === '/terms-and-conditions') return 'terms';
  if (pathname === '/disclaimer') return 'disclaimer';
  return null;
}

export function resolveAdminFromLocation(): boolean {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();
  return pathname === '/admin' || pathname.endsWith('/admin') || hash === '#admin';
}

export function resolveSampleJathakamFromLocation(): boolean {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();
  return pathname === '/sample-jathakam' || pathname === '/sample-report' || hash === '#sample-jathakam';
}

const LEGAL_DOC_PATHS: Record<LegalDocType, string> = {
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  disclaimer: '/disclaimer',
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => resolveTabFromLocation());
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(() =>
    resolveVedicArticleSlugFromLocation()
  );
  const [isVedicDirectoryView, setIsVedicDirectoryView] = useState<boolean>(() =>
    resolveVedicDirectoryFromLocation()
  );
  const [isAdminView, setIsAdminView] = useState<boolean>(() => resolveAdminFromLocation());
  const [isSampleJathakamView, setIsSampleJathakamView] = useState<boolean>(() =>
    resolveSampleJathakamFromLocation()
  );
  const [prefillClient, setPrefillClient] = useState<ClientKundaliPrefill | null>(null);
  const [panchangamSubTab, setPanchangamSubTab] = useState<PanchangamSubTab>(() =>
    resolvePanchangamSubTabFromLocation()
  );
  const [hubSection, setHubSection] = useState<HubSectionId>(() => resolveHubSectionFromLocation());
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(() =>
    resolveLegalDocFromLocation()
  );
  const [selectedCity, setSelectedCity] = useState<CitySEOData | null>(() =>
    resolveCityFromLocation()
  );
  const [selectedCityIntent, setSelectedCityIntent] = useState<LocalizedPageIntent>(() =>
    resolveCityIntentFromLocation()
  );
  const [selectedDayId, setSelectedDayId] = useState<string>(() =>
    resolveInitialIsoDateFromLocation()
  );
  const [isCalendarView, setIsCalendarView] = useState<boolean>(() =>
    resolveCalendarViewFromLocation()
  );
  const [activeCityTimingSlug, setActiveCityTimingSlug] = useState<CityTimingConfig['slug'] | null>(
    () => resolveCityTimingSlugFromLocation()
  );
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedPoojaForBooking, setSelectedPoojaForBooking] = useState<PoojaService | null>(null);
  const { t, tr, language } = useLanguage();

  const currentDay = getOrGenerateDayData(selectedDayId, WEEK_DATA);

  const handleSelectVedicArticle = useCallback((slug: string) => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setIsCalendarView(false);
    setIsSampleJathakamView(false);
    setIsVedicDirectoryView(false);
    setActiveArticleSlug(slug);
    if (typeof window !== 'undefined') {
      try {
        const targetPath = `/${slug}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ articleSlug: slug }, '', targetPath);
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNavigateVedicDirectory = useCallback(() => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setIsCalendarView(false);
    setIsSampleJathakamView(false);
    setActiveArticleSlug(null);
    setIsVedicDirectoryView(false);
    setActiveTab('vyasalu');
    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== '/vedic-articles') {
          window.history.pushState({ tab: 'vyasalu', vedicArticles: true }, '', '/vedic-articles');
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNavigateToSampleJathakam = useCallback(() => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setIsCalendarView(false);
    setActiveArticleSlug(null);
    setIsVedicDirectoryView(false);
    setIsSampleJathakamView(true);
    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== '/sample-jathakam') {
          window.history.pushState({ sampleJathakam: true }, '', '/sample-jathakam');
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleOpenAdmin = useCallback(() => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsSampleJathakamView(false);
    setActiveArticleSlug(null);
    setIsVedicDirectoryView(false);
    setIsAdminView(true);
    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== '/admin') {
          window.history.pushState({ admin: true }, '', '/admin');
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectTab = useCallback((tab: NavTab) => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setIsCalendarView(false);
    setIsSampleJathakamView(false);
    setActiveArticleSlug(null);
    setIsVedicDirectoryView(false);
    setActiveCityTimingSlug(null);
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
      } catch {}
    }
  }, []);

  const handleSelectIsoDateRoute = useCallback((isoDate: string) => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setIsCalendarView(false);
    setActiveTab('panchangam');
    setPanchangamSubTab('main');
    setSelectedDayId(isoDate);
    if (typeof window !== 'undefined') {
      const targetPath = `/panchangam/${isoDate}`;
      try {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ tab: 'panchangam', isoDate }, '', targetPath);
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleToggleCalendarRoute = useCallback((show: boolean) => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setActiveTab('panchangam');
    setPanchangamSubTab('main');
    setIsCalendarView(show);
    if (typeof window !== 'undefined') {
      const targetPath = show ? '/panchangam/calendar' : '/panchangam';
      try {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ tab: 'panchangam', calendar: show }, '', targetPath);
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectCityTimingRoute = useCallback((citySlug: CityTimingConfig['slug'] | null) => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setIsCalendarView(false);
    setActiveTab('panchangam');
    setPanchangamSubTab('main');
    setActiveCityTimingSlug(citySlug);
    if (typeof window !== 'undefined') {
      const targetPath = citySlug ? `/panchangam/${citySlug}` : '/panchangam';
      try {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ tab: 'panchangam', citySlug }, '', targetPath);
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectPanchangamSubTab = useCallback((subTab: PanchangamSubTab) => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsCalendarView(false);
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

  const handleNavigateHubSection = useCallback(
    (section: HubSectionId, path: string) => {
      setSelectedCity(null);
      setActiveLegalDoc(null);
      if (path === '/panchangam/calendar') {
        handleToggleCalendarRoute(true);
        return;
      }
      if (path === '/sample-jathakam' || path === '/sample-report') {
        handleNavigateToSampleJathakam();
        return;
      }
      if (section === 'kundali' || path === '/janma-kundali' || path === '/mee-jatakam') {
        setIsSampleJathakamView(false);
        setActiveTab('jathakam');
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState({ tab: 'jathakam' }, '', path);
          } catch {}
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (
        section === 'shastras' ||
        section === 'rashiguide' ||
        section === 'research' ||
        path === '/vedic-articles' ||
        path === '/vyasalu' ||
        path === '/shastras' ||
        path === '/dwadasa-rashi-rahasyalu' ||
        path === '/astroinformatics-research'
      ) {
        handleNavigateVedicDirectory();
        return;
      }
      setIsSampleJathakamView(false);
      setActiveTab('panchangam');
      setIsCalendarView(false);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [handleToggleCalendarRoute, handleNavigateToSampleJathakam]
  );

  const handleSelectCity = useCallback(
    (citySlug: string, routePath?: string) => {
      const norm = citySlug.toLowerCase();
      if (
        norm === 'hyderabad' ||
        norm === 'vijayawada' ||
        norm === 'visakhapatnam' ||
        norm === 'usa'
      ) {
        handleSelectCityTimingRoute(norm);
        return;
      }
      const city = findCityBySlug(citySlug);
      if (city) {
        setSelectedCity(city);
        setActiveLegalDoc(null);
        const targetPath = routePath || `/telugu-astrologer-in-${city.slug}`;
        const matched = resolveLocalizedCityRoute(targetPath);
        setSelectedCityIntent(matched?.intent || 'astrologer-purohit');
        if (typeof window !== 'undefined') {
          try {
            if (window.location.pathname !== targetPath) {
              window.history.pushState({ city: city.slug }, '', targetPath);
            }
          } catch {}
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    [handleSelectCityTimingRoute]
  );

  const handleOpenLegal = useCallback((doc: LegalDocType) => {
    setSelectedCity(null);
    setIsAdminView(false);
    setActiveLegalDoc(doc);
    if (typeof window !== 'undefined') {
      try {
        const targetPath = LEGAL_DOC_PATHS[doc];
        if (targetPath && window.location.pathname !== targetPath) {
          window.history.pushState({ legalDoc: doc }, '', targetPath);
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectSearchTopic = useCallback((topic: AstroSearchTopic) => {
    setSelectedCity(null);
    setActiveLegalDoc(null);
    setIsAdminView(false);
    setIsCalendarView(false);

    const rawPath = topic.targetPath.toLowerCase().replace(/\/+$/, '') || '/';
    const articleSlugMatch = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
    if (
      [
        'swarodaya-shastra',
        'balarishta-dosha-shanti',
        'prashna-nimitta-shastra',
        'graha-vakra-gati',
        'surya-siddhanta-kala-ganana',
        'classical-astrology-faq',
        'jyotisha-paribhasha-rahasyalu',
        'hasta-samudrika-rekhala-vignanam',
        'why-are-geminis-so-powerful',
        'who-is-libras-true-love',
        'pawan-kalyan-raja-yoga-horoscope-analysis',
        'cricket-sports-astrology-ind-u19-vs-uae-u19-prashna-guide',
        'swapna-shastra-dream-meaning-medical-astrology-1944',
      ].includes(articleSlugMatch)
    ) {
      handleSelectVedicArticle(articleSlugMatch);
      return;
    }
    if (
      rawPath === '/vedic-articles' ||
      rawPath === '/vyasalu' ||
      rawPath === '/shastras' ||
      rawPath === '/dwadasa-rashi-rahasyalu' ||
      rawPath === '/astroinformatics-research'
    ) {
      handleNavigateVedicDirectory();
      return;
    }

    setActiveArticleSlug(null);
    setIsVedicDirectoryView(false);
    setActiveTab(topic.targetTab);

    if (topic.panchangamSubTab) {
      setPanchangamSubTab(topic.panchangamSubTab);
    } else if (topic.targetTab === 'panchangam') {
      setPanchangamSubTab('main');
    }

    if (topic.hubSection) {
      setHubSection(topic.hubSection);
    }

    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== topic.targetPath) {
          window.history.pushState(
            {
              tab: topic.targetTab,
              hubSection: topic.hubSection,
              panchangamSubTab: topic.panchangamSubTab,
            },
            '',
            topic.targetPath
          );
        }
      } catch {}

      setTimeout(() => {
        if (topic.scrollToElementId) {
          const el = document.getElementById(topic.scrollToElementId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 120);
    }
  }, [handleNavigateVedicDirectory, handleSelectVedicArticle]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || params.get('search');
      if (q && q.trim()) {
        const matches = searchAstroTopics(q);
        if (matches.length > 0) {
          handleSelectSearchTopic(matches[0]);
        }
      }
    } catch {}
  }, [handleSelectSearchTopic]);

  useEffect(() => {
    const onPopState = () => {
      const matchedCity = resolveCityFromLocation();
      setSelectedCity(matchedCity);
      setSelectedCityIntent(resolveCityIntentFromLocation());
      setActiveLegalDoc(resolveLegalDocFromLocation());
      setIsAdminView(resolveAdminFromLocation());
      setIsSampleJathakamView(resolveSampleJathakamFromLocation());
      setIsCalendarView(resolveCalendarViewFromLocation());
      setActiveCityTimingSlug(resolveCityTimingSlugFromLocation());
      setSelectedDayId(resolveInitialIsoDateFromLocation());
      setActiveArticleSlug(resolveVedicArticleSlugFromLocation());
      setIsVedicDirectoryView(resolveVedicDirectoryFromLocation());
      if (!matchedCity) {
        setActiveTab(resolveTabFromLocation());
        setPanchangamSubTab(resolvePanchangamSubTabFromLocation());
        setHubSection(resolveHubSectionFromLocation());
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Synchronize generateMetadata() output and clean JSON-LD Schema on every route change
  useEffect(() => {
    if (selectedCity) return;

    const currentPath =
      typeof window !== 'undefined'
        ? window.location.pathname.replace(/\/+$/, '') || '/'
        : activeArticleSlug
        ? `/${activeArticleSlug}`
        : isVedicDirectoryView
        ? '/vedic-articles'
        : TAB_PATHS[activeTab] || '/';

    const meta = generatePageMetadata(currentPath);

    syncHeadMetaTags({
      title: meta.title,
      description: meta.description,
      canonicalUrl: meta.canonical,
      robots: meta.robots,
      lang: language,
      ogImage: meta.ogImage,
    });

    if (typeof document !== 'undefined') {
      const schemaScript = document.getElementById('core-site-schema');
      if (schemaScript) {
        schemaScript.textContent = JSON.stringify(buildCleanJsonLdSchema(meta));
      }
    }
  }, [
    activeTab,
    activeArticleSlug,
    isVedicDirectoryView,
    panchangamSubTab,
    hubSection,
    language,
    selectedCity,
    selectedDayId,
    isCalendarView,
    activeCityTimingSlug,
    activeLegalDoc,
  ]);

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

  const handleNavigateToPanchangam = useCallback(
    (isoDate?: string) => {
      if (isoDate) {
        handleSelectIsoDateRoute(isoDate);
      } else {
        handleSelectTab('panchangam');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [handleSelectIsoDateRoute, handleSelectTab]
  );

  const handleNavigateToAwards = () => {
    handleSelectTab('awards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#faf7f2] text-[#2a1205] font-telugu">
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenBooking={() => handleOpenBooking()}
        onSelectSearchTopic={handleSelectSearchTopic}
      />

      {!isAdminView && (
        <div className="no-print">
          <KartikaScrollingTicker
            onNavigateKartika={() => {
              handleSelectTab('kartika');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {!isAdminView && (
        <div className="no-print">
          <LiveSiteAnnouncementBanner
            onNavigateJathakam={() => {
              handleSelectTab('jathakam');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigatePanchangam={() => handleNavigateToPanchangam()}
            onOpenBooking={() => handleOpenBooking()}
          />
        </div>
      )}

      {activeArticleSlug ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
            <VedicArticleReader
              articleSlug={activeArticleSlug}
              onNavigateArticle={handleSelectVedicArticle}
              onNavigateHome={() => handleNavigateVedicDirectory()}
              onOpenBooking={() => handleOpenBooking()}
            />
          </Suspense>
        </main>
      ) : activeTab === 'vyasalu' || isVedicDirectoryView ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
            <VedicArticlesDirectory
              onSelectArticle={handleSelectVedicArticle}
              onOpenBooking={() => handleOpenBooking()}
              currentDay={currentDay}
            />
          </Suspense>
        </main>
      ) : isAdminView ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
            <AdminDashboard
              currentDay={currentDay}
              onBackToSite={() => handleSelectTab('home')}
              onOpenClientKundali={(client) => {
                setPrefillClient(client);
                setIsAdminView(false);
                setActiveTab('jathakam');
                if (typeof window !== 'undefined') {
                  try {
                    window.history.pushState({ tab: 'jathakam' }, '', '/mee-jatakam');
                  } catch {}
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </Suspense>
        </main>
      ) : isSampleJathakamView ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
            <SampleJathakamPage
              onNavigateToJathakam={() => {
                setIsSampleJathakamView(false);
                handleSelectTab('jathakam');
              }}
              onOpenBooking={() => handleOpenBooking()}
            />
          </Suspense>
        </main>
      ) : activeLegalDoc ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          <StandaloneLegalPage
            activeDoc={activeLegalDoc}
            onSelectDoc={handleOpenLegal}
            onBackHome={() => handleSelectTab('home')}
          />
        </main>
      ) : selectedCity ? (
        <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
          <CityAstrologyPage
            city={selectedCity}
            currentDay={currentDay}
            intent={selectedCityIntent}
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
                      duration: 'శాస్త్రోక్తంగా',
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
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          {/* TAB 1: HOME (నేటి పంచాంగం – Today Telugu Panchangam + Guruji Profile) */}
          {activeTab === 'home' && (
            <GuruProfileHome
              currentDay={currentDay}
              onNavigateToPanchangam={handleNavigateToPanchangam}
              onNavigateToCalendar={() => handleToggleCalendarRoute(true)}
              onNavigateToCityPanchangam={(citySlug) => handleSelectCityTimingRoute(citySlug)}
              onNavigateToJathakam={() => {
                handleSelectTab('jathakam');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToAwards={handleNavigateToAwards}
              onOpenBooking={(service) => handleOpenBooking(service)}
              onSelectCity={handleSelectCity}
            />
          )}

          {/* TAB: HONORS & AWARDS */}
          {activeTab === 'awards' && (
            <Suspense fallback={<SectionLoader minHeight="min-h-[500px]" />}>
              <AwardsSection />
            </Suspense>
          )}

          {/* TAB: MEE JATAKAM TELUSUKONDI / JANMA KUNDALI */}
          {activeTab === 'jathakam' && (
            <div className="space-y-8 print:space-y-0">
              <div className="bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/80 shadow-xl no-print">
                <div className="max-w-4xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block">
                    {t(
                      'శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం • బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
                      'Sri Lakshmi Ganapathi Jyothishalayam • Brahmasri Jallavaram Sai Dheeraj Sharma'
                    )}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 leading-tight">
                    {generatePageMetadata(
                      typeof window !== 'undefined' ? window.location.pathname : '/mee-jatakam'
                    ).h1}
                  </h1>
                  <p className="text-xs sm:text-base text-amber-200/90 leading-relaxed">
                    {t(
                      'మీ పుట్టిన తేదీ, సమయం, ప్రాంతం ఆధారంగా దృక్సిద్ధాంత రాశి చక్రం (D1), నవాంశ చక్రం (D9), సూర్య-చంద్ర ఆత్మ-మనస్సు విశ్లేషణ, పంచభూత గ్రహ బలం, 1 నుండి 12 స్థానాల సంపూర్ణ ఫలితాలు, భృగు చక్ర పద్ధతి 96 ఏళ్ల కాలచక్ర గమనం, వింశోత్తరి మహాదశ మరియు అదృష్ట రత్న/రుద్రాక్ష పరిహారాలు.',
                      'Enter your birth details below to generate your D1 Rashi Chart, D9 Navamsha, 8-Section Brihat Jataka Horoscope Report, all 12 House predictions, Bhrigu Chakra Paddhati 96-year life progression, and Vedic remedies.'
                    )}
                  </p>
                </div>
              </div>

              <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
                <JanmaKundaliGenerator
                  onOpenBooking={() => handleOpenBooking()}
                  prefillClient={prefillClient}
                />
              </Suspense>

              <div className="no-print">
                <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                  <VedicAstrologyHub
                    initialSection="pontana"
                    onOpenBooking={() => handleOpenBooking()}
                  />
                </Suspense>
              </div>
            </div>
          )}

          {/* TAB: KARTIKA MASAM RUDRABHISHEKAM */}
          {activeTab === 'kartika' && (
            <Suspense fallback={<SectionLoader minHeight="min-h-[700px]" />}>
              <KartikaAbhishekamPage />
            </Suspense>
          )}

          {/* TAB: MUHURTHAM FINDER & VEDIC SUTRA EXPLORER */}
          {activeTab === 'muhurtham' && (
            <Suspense fallback={<SectionLoader minHeight="min-h-[600px]" />}>
              <MuhurthamCalculator />
            </Suspense>
          )}

          {/* TAB 2: PANCHANGAM (/panchangam, /panchangam/[yyyy-mm-dd], /panchangam/calendar, /panchangam/[city]) */}
          {activeTab === 'panchangam' && (
            <div className="space-y-8">
              <Banner
                currentDay={currentDay}
                activeLagnaName={activeLagna?.lagnam}
                customH1={
                  generatePageMetadata(
                    typeof window !== 'undefined' ? window.location.pathname : '/panchangam'
                  ).h1
                }
                onOpenBooking={() => handleOpenBooking()}
              />

              {/* Prev/Next Day Links, 60-Day Monthly Calendar Toggle, and City Timings Switcher */}
              <DailyPanchangamRouteBar
                selectedIsoDate={selectedDayId}
                activeCitySlug={activeCityTimingSlug}
                isCalendarView={isCalendarView}
                onSelectIsoDate={handleSelectIsoDateRoute}
                onSelectCitySlug={handleSelectCityTimingRoute}
                onToggleCalendarView={handleToggleCalendarRoute}
              />

              {/* Gochara Phalalu Interactive Calculator (shown at top on /gochara-phalalu* and /yelinati-shani, or accessible anytime) */}
              {typeof window !== 'undefined' &&
                (window.location.pathname.startsWith('/gochara-phalalu') ||
                  window.location.pathname === '/yelinati-shani') && (
                  <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                    <GocharaPhalaluView
                      initialPathname={window.location.pathname}
                      onNavigateGocharaRoute={(targetPath) => {
                        try {
                          window.history.pushState({ gocharaPath: targetPath }, '', targetPath);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        } catch {}
                      }}
                    />
                  </Suspense>
                )}

              <DaySelector
                days={WEEK_DATA}
                selectedDayId={selectedDayId}
                onSelectDay={(dayId) => handleSelectIsoDateRoute(dayId)}
              />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-amber-300/70 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
                    {t('ఎంచుకున్న రోజు వివరాలు • Selected Day Overview', 'Selected Day Overview')}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold text-amber-950 font-telugu mt-0.5">
                    {tr(currentDay.label)} {t('పంచాంగం & రాశి ఫలాలు', 'Panchangam & Predictions')}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base sm:text-xl text-amber-900 font-bold font-telugu bg-amber-100/80 px-4 py-1.5 rounded-full border border-amber-300">
                    {tr(currentDay.teediVaram)}
                  </p>
                </div>
              </div>

              <nav
                id="panchangam-sub-tabs"
                aria-label="Daily Panchangam Sub-Sections"
                className="bg-gradient-to-r from-amber-100 via-[#fff7e6] to-amber-100 p-2 rounded-3xl border-2 border-amber-400/90 shadow-md scroll-mt-24"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {(
                    [
                      {
                        id: 'main' as PanchangamSubTab,
                        href: '/panchangam',
                        badge: 'నిత్య పంచాంగం & ద్వాదశ రాశి ఫలాలు',
                        titleTe: 'సంపూర్ణ పంచాంగం & రాశి ఫలాలు',
                        titleEn: 'Panchangam & Daily Predictions',
                      },
                      {
                        id: 'gowri-hora' as PanchangamSubTab,
                        href: '/gowri-panchangam',
                        badge: 'తక్షణ శుభ సమయం',
                        titleTe: 'గౌరీ పంచాంగం & హోరా చక్రం',
                        titleEn: 'Gowri Panchangam & Hora',
                      },
                      {
                        id: 'tarabalam' as PanchangamSubTab,
                        href: '/tarabalam-chandrabalam',
                        badge: 'వ్యక్తిగత బలం',
                        titleTe: 'తారాబలం & చంద్రబలం చెకర్',
                        titleEn: 'Tarabalam & Chandrabalam',
                      },
                      {
                        id: 'sankalpam' as PanchangamSubTab,
                        href: '/nitya-sankalpam',
                        badge: 'నిత్య పూజ & సంకల్పం',
                        titleTe: 'నేటి సంకల్పం & నిత్య స్తోత్రం',
                        titleEn: 'Daily Sankalpam & Stotra',
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
                        className={`flex flex-col items-start justify-center px-3.5 py-2.5 rounded-2xl border text-left transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-900 via-[#3b1205] to-amber-950 text-amber-100 border-amber-400 shadow-md scale-[1.01]'
                            : 'bg-white/95 hover:bg-amber-50 text-amber-950 border-amber-300/80'
                        }`}
                      >
                        <span
                          className={`text-[10px] uppercase tracking-wider font-extrabold ${
                            isActive ? 'text-amber-300' : 'text-amber-700'
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

              {panchangamSubTab === 'gowri-hora' && (
                <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                  <GowriHoraPanchangam day={currentDay} />
                </Suspense>
              )}

              {panchangamSubTab === 'tarabalam' && (
                <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                  <TarabalamCalculator day={currentDay} />
                </Suspense>
              )}

              {panchangamSubTab === 'sankalpam' && (
                <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                  <DailySankalpamStotra day={currentDay} />
                </Suspense>
              )}

              {panchangamSubTab === 'main' && (
                <>
                  {/* సంపూర్ణ నిత్య పంచాంగం (PANCHANGAM FIRST) */}
                  <PanchangamQuickSummary day={currentDay} />

                  {/* నేటి సుభాషిత శ్లోకం & నేటి తరానికి లౌకిక జీవన సందేశం (Image Download in Telugu & English) */}
                  <DailySubhashithamCard isoDate={currentDay.isoDate || selectedDayId} />

                  <section id="panchangam" className="scroll-mt-24">
                    <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                      <PanchangaCard day={currentDay} />
                      <div id="rashi-chakram" className="scroll-mt-24 h-full">
                        <LazyViewportSection minHeight="min-h-[480px]">
                          <RashiChakra day={currentDay} />
                        </LazyViewportSection>
                      </div>
                    </div>
                  </section>

                  <section id="muhurthalu" className="scroll-mt-24">
                    <MuhurthaTimings day={currentDay} />
                  </section>

                  <section id="lagnalu" className="scroll-mt-24">
                    <Suspense fallback={<SectionLoader minHeight="min-h-[320px]" />}>
                      <LagnaPramanalu day={currentDay} />
                    </Suspense>
                  </section>

                  <section>
                    <Suspense fallback={<SectionLoader minHeight="min-h-[320px]" />}>
                      <ChandraNavatara day={currentDay} />
                    </Suspense>
                  </section>

                  {/* నేటి దిన ఫలితం & ద్వాదశ రాశి ఫలాలు (PREDICTIONS NEXT) */}
                  <div className="pt-6 border-t-4 border-amber-400/80">
                    <div className="bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-500 shadow-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="inline-block text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400 text-amber-950 mb-2">
                          {t(
                            'నేటి దిన ఫలితాలు & ద్వాదశ రాశి ఫలాలు • Daily Predictions & Horoscope',
                            'Daily Predictions & 12-Rashi Horoscope'
                          )}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-telugu text-amber-100">
                          {t(
                            'నేటి సమగ్ర దిన ఫలితం, ద్వాదశ రాశి ఫలాలు & నక్షత్ర విశ్లేషణ',
                            'Comprehensive Daily Prediction, 12-Rashi Horoscope & Star Analysis'
                          )}
                        </h2>
                        <p className="text-xs sm:text-sm text-amber-200/90 font-telugu mt-1">
                          {t(
                            'నేటి పంచాంగం మరియు ముహూర్త సమయాల ఆధారంగా తిథి-నక్షత్ర దిన ఫలితం మరియు 12 రాశుల విస్తృత ఫలితాలను ఇక్కడ చదవండి.',
                            'Explore today’s detailed daily predictions and 12-Rashi horoscopes calculated from today’s Panchangam below.'
                          )}
                        </p>
                      </div>
                      <a
                        href="#dina-phalam"
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-extrabold text-xs sm:text-sm shadow-md whitespace-nowrap shrink-0 self-start md:self-auto"
                      >
                        {t('12 రాశుల ఫలితాలు చూడండి ↓', 'Jump to 12 Rashis ↓')}
                      </a>
                    </div>

                    <div className="space-y-8">
                      <DayVisheshamCard day={currentDay} />
                      <DailyHoroscope day={currentDay} />
                    </div>
                  </div>
                </>
              )}

              {/* Interactive Vedic Astrology Hub (Vivaha Pontana, Baby Names, Vastu, Dosha) */}
              <Suspense fallback={<SectionLoader minHeight="min-h-[420px]" />}>
                <VedicAstrologyHub
                  initialSection={hubSection}
                  onOpenBooking={() => handleOpenBooking()}
                />
              </Suspense>

              <Suspense fallback={<SectionLoader minHeight="min-h-[320px]" />}>
                <PanchangamFAQ />
              </Suspense>

              <ActionControls day={currentDay} onOpenBooking={() => handleOpenBooking()} />
            </div>
          )}

          {/* TAB 3: POOJA SERVICES */}
          {activeTab === 'services' && (
            <Suspense fallback={<SectionLoader minHeight="min-h-[520px]" />}>
              <div className="space-y-10">
                <UpcomingRitualCountdown
                  variant="full"
                  days={WEEK_DATA}
                  onOpenBooking={(service) => handleOpenBooking(service)}
                  onSelectDate={(isoDate) => handleSelectIsoDateRoute(isoDate)}
                />
                <PoojaServicesSection onSelectService={(service) => handleOpenBooking(service)} />
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

      {/* Site-Wide Internal Links (Home, Today's Panchangam, 3+ Related Tools in Telugu) & Author Bio */}
      {!isAdminView && (
        <div className="no-print">
          <AuthorBioAndInternalLinks
            onNavigateHome={() => handleSelectTab('home')}
            onNavigatePanchangam={handleNavigateToPanchangam}
            onNavigateCalendar={() => handleToggleCalendarRoute(true)}
            onNavigateHubSection={handleNavigateHubSection}
            onSelectCityTiming={(slug) => handleSelectCityTimingRoute(slug)}
            onNavigateAbout={() => handleSelectTab('about')}
            onNavigateContact={() => handleSelectTab('contact')}
            onOpenLegal={handleOpenLegal}
          />
        </div>
      )}

      <div className="no-print">
        <FloatingWhatsApp />
      </div>

      {isBookingOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-amber-300">
                <p className="text-sm font-bold text-amber-900 font-telugu animate-pulse">
                  పూజా బుకింగ్ ఫారమ్ లోడ్ అవుతోంది... • Loading Booking Form...
                </p>
              </div>
            </div>
          }
        >
          <PoojaBookingModal
            isOpen={isBookingOpen}
            selectedService={selectedPoojaForBooking}
            onClose={handleCloseBooking}
          />
        </Suspense>
      )}

      <Footer
        onSelectCity={handleSelectCity}
        onNavigateHubSection={handleNavigateHubSection}
        onOpenLegal={handleOpenLegal}
        onOpenAdmin={handleOpenAdmin}
        onNavigateAbout={() => handleSelectTab('about')}
        onNavigateContact={() => handleSelectTab('contact')}
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
