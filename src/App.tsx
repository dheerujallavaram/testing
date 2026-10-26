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
import { UpcomingRitualCountdown } from './components/UpcomingRitualCountdown';
import { VedicAstrologyHub, HubSectionId } from './components/VedicAstrologyHub';
import { LegalComplianceModal, LegalDocType } from './components/LegalComplianceModal';

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
    pathname === '/neti-panchangam' ||
    pathname === '/today-panchangam-in-telugu' ||
    pathname === '/ee-roju-panchangam' ||
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

export function resolveHubSectionFromLocation(): HubSectionId {
  if (typeof window === 'undefined') return 'pontana';
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (pathname === '/naama-nakshatra') return 'akshara';
  if (pathname === '/ugadi-rashi-phalalu') return 'ugadi';
  if (pathname === '/shubha-muhurthalu' || pathname === '/festivals') return 'muhurtham';
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
  const [hubSection, setHubSection] = useState<HubSectionId>(() => resolveHubSectionFromLocation());
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(() => resolveLegalDocFromLocation());
  const [selectedCity, setSelectedCity] = useState<CitySEOData | null>(() => resolveCityFromLocation());
  const [selectedDayId, setSelectedDayId] = useState<string>(() => getTodayAndTomorrowIds(WEEK_DATA).todayId);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedPoojaForBooking, setSelectedPoojaForBooking] = useState<PoojaService | null>(null);
  const { t, tr, language } = useLanguage();

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

  const handleNavigateHubSection = useCallback((section: HubSectionId, path: string) => {
    setSelectedCity(null);
    setActiveTab('panchangam');
    setHubSection(section);
    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== path) {
          window.history.pushState({ tab: 'panchangam', hubSection: section }, '', path);
        }
      } catch {}
      setTimeout(() => {
        if (path === '/neti-panchangam' || path === '/today-panchangam-in-telugu' || path === '/ee-roju-panchangam') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setHubSection(resolveHubSectionFromLocation());
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync document title, canonical link, og:url, and meta tags dynamically with current tab or evergreen SEO route
  useEffect(() => {
    if (selectedCity) return; // CityAstrologyPage component manages its own programmatic metadata

    const rawPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/' : '/';
    const isEvergreenHubRoute = [
      '/neti-panchangam',
      '/today-panchangam-in-telugu',
      '/ee-roju-panchangam',
      '/vivaha-pontana',
      '/naama-nakshatra',
      '/ugadi-rashi-phalalu',
      '/shubha-muhurthalu',
      '/festivals',
      '/dosha-pariharalu',
    ].includes(rawPath);

    const path = isEvergreenHubRoute && activeTab === 'panchangam' ? rawPath : TAB_PATHS[activeTab] || '/';
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

    const evergreenSeoMeta: Record<string, { titleTe: string; titleEn: string; descTe: string; descEn: string }> = {
      '/neti-panchangam': {
        titleTe: 'Neti Panchangam | నేటి పంచాంగం - Today Panchangam in Telugu - ఈ రోజు పంచాంగం — telugujyothisham.com',
        titleEn: 'Neti Panchangam | Today Panchangam in Telugu - ఈ రోజు పంచాంగం - నేటి పంచాంగం — telugujyothisham.com',
        descTe: 'Neti Panchangam (నేటి పంచాంగం) & Today Panchangam in Telugu (ఈ రోజు పంచాంగం) - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం), Varjyam(వర్జ్యం), Amrutha Gadiyalu(అమృత ఘడియలు) & 12 Rashi Phalalu.',
        descEn: 'Neti Panchangam (నేటి పంచాంగం) & Today Panchangam in Telugu (ఈ రోజు పంచాంగం) - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం) & Daily Horoscope at telugujyothisham.com.',
      },
      '/today-panchangam-in-telugu': {
        titleTe: 'Today Panchangam in Telugu - ఈ రోజు పంచాంగం - నేటి పంచాంగం (Neti Panchangam) — telugujyothisham.com',
        titleEn: 'Today Panchangam in Telugu - ఈ రోజు పంచాంగం - Neti Panchangam — telugujyothisham.com',
        descTe: 'Today Panchangam in Telugu - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం), Yamagandam(యమగండం), Varjyam(వర్జ్యం), Amrutha Gadiyalu(అమృత ఘడియలు) — telugujyothisham.com.',
        descEn: 'Today Panchangam in Telugu - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం), Durmuhurtham(దుర్ముహూర్తం) & 12 Rashi Phalithalu.',
      },
      '/ee-roju-panchangam': {
        titleTe: 'ఈ రోజు పంచాంగం (Ee Roju Panchangam) | Today Panchangam in Telugu - నేటి పంచాంగం — telugujyothisham.com',
        titleEn: 'Ee Roju Panchangam (ఈ రోజు పంచాంగం) | Today Panchangam in Telugu - Neti Panchangam — telugujyothisham.com',
        descTe: 'ఈ రోజు పంచాంగం (Ee Roju Panchangam / Neti Panchangam) - Today Panchangam in Telugu - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం) & 12 రాశుల దిన ఫలాలు.',
        descEn: 'Ee Roju Panchangam (ఈ రోజు పంచాంగం) - Today Panchangam in Telugu - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం) & Auspicious Timings.',
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
      home: 'Neti Panchangam | Today Panchangam in Telugu - ఈ రోజు పంచాంగం - నేటి పంచాంగం — telugujyothisham.com',
      panchangam: 'Neti Panchangam | Today Panchangam in Telugu - ఈ రోజు పంచాంగం - నేటి పంచాంగం — telugujyothisham.com/panchangam',
      awards: 'పొందిన సత్కారాలు & పురస్కారాలు | శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (telugujyothisham.com/awards)',
      services: 'వైదిక పూజా సేవలు & హోమాలు | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/services)',
      about: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి గురించి | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/about)',
      contact: 'సంప్రదించండి | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com/contact)',
    };

    const titlesEnglish: Record<NavTab, string> = {
      home: 'Neti Panchangam | Today Panchangam in Telugu - ఈ రోజు పంచాంగం - నేటి పంచాంగం — telugujyothisham.com',
      panchangam: 'Today Panchangam in Telugu - ఈ రోజు పంచాంగం - Neti Panchangam — telugujyothisham.com/panchangam',
      awards: 'Vedic Honors & Awards | Sri Jallavaram Sai Dheeraj Sharma — telugujyothisham.com/awards',
      services: 'Vedic Homams & Rituals | Sri Chandi Homam, Lakshmi Kubera Yagam — telugujyothisham.com/services',
      about: 'About Sri Jallavaram Sai Dheeraj Sharma | Renowned Vedic Astrologer — telugujyothisham.com/about',
      contact: 'Contact Vedic Astrologer & Purohit | Sri Lakshmi Ganapathi Astrology — telugujyothisham.com/contact',
    };

    const descriptionsTelugu: Record<NavTab, string> = {
      home: 'Neti Panchangam (నేటి పంచాంగం) & Today Panchangam in Telugu (ఈ రోజు పంచాంగం) - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం), Varjyam(వర్జ్యం), Amrutha Gadiyalu(అమృత ఘడియలు) & 12 Rashi Phalalu at telugujyothisham.com.',
      panchangam: 'Today Panchangam in Telugu (ఈ రోజు పంచాంగం - నేటి పంచాంగం - Neti Panchangam) - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం), Durmuhurtham(దుర్ముహూర్తం), Varjyam(వర్జ్యం) & 12 రాశుల దిన ఫలాలు.',
      awards: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు పొందిన జ్యోతిష సత్కారాలు, బిరుదులు మరియు పూజా పురస్కారాల వివరాలు.',
      services: 'శ్రీ చండీ హోమం, లక్ష్మీ గణపతి హోమం, సుదర్శన హోమం, వివాహ, గృహప్రవేశ క్రతువులు శాస్త్రోక్తంగా నిర్వహించబడును.',
      about: 'జ్యోతిష పండితులు, స్మార్త వేద విద్వాంసులు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్యాత్మిక ప్రస్థానం మరియు అనుభవం.',
      contact: 'జ్యోతిష సంప్రదింపులు, ముహూర్త నిర్ణయం మరియు పూజా బుకింగ్ కొరకు శ్రీ ధీరజ్ శర్మ గారిని సంప్రదించండి.',
    };

    const descriptionsEnglish: Record<NavTab, string> = {
      home: 'Today Panchangam in Telugu (ఈ రోజు పంచాంగం / Neti Panchangam) - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం), Amrutha Gadiyalu & Daily Horoscope.',
      panchangam: 'Today Panchangam in Telugu - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం), Rahu Kalam(రాహుకాలం), Varjyam(వర్జ్యం), Durmuhurtham & 12 Rashi Phalalu by Sri Lakshmi Ganapathi Astrology.',
      awards: 'Prestigious Vedic awards, golden kankanam citations, and state-level felicitations conferred upon Sri Jallavaram Sai Dheeraj Sharma.',
      services: 'Authentic Vedic homams, Sri Chandi Sahitha Rudra Homam, Gruhapravesham, wedding muhurthams, and online sankalpam booking for global NRI devotees.',
      about: 'Profile and spiritual journey of renowned Vedic scholar and astrologer Sri Jallavaram Sai Dheeraj Sharma.',
      contact: 'Consult renowned Telugu astrologer and Smartha purohit Sri Dheeraj Sharma for horoscope consultation, muhurtham, and pooja bookings.',
    };

    const matchedEvergreen = isEvergreenHubRoute && activeTab === 'panchangam' ? evergreenSeoMeta[rawPath] : undefined;

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
  }, [activeTab, hubSection, language, selectedCity]);

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

            {/* Complete Vedic Astrology & Muhurtham SEO Hub (Marriage Compatibility, Name Syllable Star Finder, Ugadi Aadayam-Vyayam, Shubha Muhurthams & Dosha Remedies) */}
            <VedicAstrologyHub
              initialSection={hubSection}
              onOpenBooking={() => handleOpenBooking()}
            />

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

        {/* TAB 3: POOJA SERVICES & LIVE UPCOMING RITUAL COUNTDOWN */}
        {activeTab === 'services' && (
          <div className="space-y-10">
            {/* Live Upcoming Temple Event & Homam Countdown Section */}
            <UpcomingRitualCountdown
              onOpenBooking={(service) => handleOpenBooking(service)}
            />

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

      {/* Legal & AdSense Compliance Modal (Privacy Policy, Terms & Conditions, Disclaimer) */}
      <LegalComplianceModal
        activeDoc={activeLegalDoc}
        onClose={handleCloseLegal}
        onSelectDoc={handleOpenLegal}
      />

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


