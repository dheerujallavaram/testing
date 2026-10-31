import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Calendar,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  Home,
  User,
  Phone,
  Award,
  Globe,
  Compass,
  Search,
  ArrowRight,
} from 'lucide-react';
import { playTempleBell } from '../utils/audioChime';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { ASTRO_SEARCH_TOPICS, AstroSearchTopic, searchAstroTopics } from '../data/astroSearchIndex';

export type NavTab = 'home' | 'panchangam' | 'jathakam' | 'awards' | 'services' | 'about' | 'contact';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenBooking: () => void;
  onSelectSearchTopic?: (topic: AstroSearchTopic) => void;
}

const QUICK_SEARCH_CHIPS: { labelTe: string; labelEn: string; query: string }[] = [
  { labelTe: 'వాస్తు (Vastu)', labelEn: 'Vastu', query: 'Vastu' },
  { labelTe: 'ముహూర్తం (Muhurtham)', labelEn: 'Muhurtham', query: 'Muhurtham' },
  { labelTe: 'పూజా సేవలు (Pooja Services)', labelEn: 'Pooja Services', query: 'Pooja services' },
  { labelTe: 'పంచాంగం (Panchangam)', labelEn: 'Panchangam', query: 'Panchangam' },
  { labelTe: 'జాతకం (Jatakam)', labelEn: 'Jatakam', query: 'Jatakam' },
  { labelTe: 'రాశి ఫలాలు (Predictions)', labelEn: 'Predictions', query: 'Horoscope Predictions' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenBooking,
  onSelectSearchTopic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { language, setLanguage, t } = useLanguage();

  const handleBellRing = () => {
    playTempleBell();
  };

  const navItems: {
    id: NavTab;
    label: string;
    shortLabelTe: string;
    shortLabelEn: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
  }[] = [
    { id: 'home', label: t('హోమ్ పేజీ', 'Home'), shortLabelTe: 'హోమ్', shortLabelEn: 'Home', icon: Home },
    { id: 'panchangam', label: t('పంచాంగం', 'Panchangam'), shortLabelTe: 'పంచాంగం', shortLabelEn: 'Panchangam', icon: Calendar },
    {
      id: 'jathakam',
      label: t('మీ జాతకం తెలుసుకోండి', 'Know Your Horoscope'),
      shortLabelTe: 'మీ జాతకం తెలుసుకోండి',
      shortLabelEn: 'Your Horoscope',
      icon: Compass,
    },
    { id: 'awards', label: t('పొందిన సత్కారాలు', 'Honors & Awards'), shortLabelTe: 'సత్కారాలు', shortLabelEn: 'Honors', icon: Award },
    { id: 'services', label: t('పూజా సేవలు', 'Pooja Services'), shortLabelTe: 'పూజా సేవలు', shortLabelEn: 'Pooja Services', icon: Sparkles },
    { id: 'about', label: t('ధీరజ్ శర్మ గారి గురించి', 'About Guruji'), shortLabelTe: 'గురువు గారు', shortLabelEn: 'About Guruji', icon: User },
    { id: 'contact', label: t('సంప్రదించండి', 'Contact'), shortLabelTe: 'సంప్రదించండి', shortLabelEn: 'Contact', icon: Phone },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTopics = searchQuery.trim()
    ? searchAstroTopics(searchQuery)
    : ASTRO_SEARCH_TOPICS.slice(0, 6);

  const handleTopicSelect = (topic: AstroSearchTopic) => {
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    setSearchQuery('');
    if (onSelectSearchTopic) {
      onSelectSearchTopic(topic);
      return;
    }
    onSelectTab(topic.targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTopics.length > 0) {
      handleTopicSelect(filteredTopics[0]);
    }
  };

  // Close search dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, పూజ / జాతక పరిశీలన ముహూర్త సమాచారం కోసం సంప్రదిస్తున్నాను.'
  )}`;

  return (
    <header
      data-nosnippet
      className="sticky top-0 z-40 bg-amber-950 text-white shadow-xl border-b border-amber-800/90 backdrop-blur-md bg-opacity-95 font-telugu"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2">
        {/* Zone 1: Brand wordmark & Sri Dheeraj Sharma Garu subtext */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          title={t(
            'Telugu Jyothisham (తెలుగు జ్యోతిషం) — శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం - శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ',
            'Telugu Jyothisham (తెలుగు జ్యోతిషం) — Sreelakshmi Ganapathi Astrology - Sri Jallavaram Sai Dheeraj Sharma'
          )}
        >
          <OmEmblem className="w-9 h-9 sm:w-11 sm:h-11 group-hover:scale-105 transition-transform shrink-0 drop-shadow-md" size={44} />
          <div>
            <span className="text-sm sm:text-lg md:text-xl font-bold tracking-tight text-white block group-hover:text-amber-200 transition-colors leading-tight">
              {t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', 'Telugu Jyothisham · Sreelakshmi Ganapathi')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-300 font-semibold block">
              {t('తెలుగు జ్యోతిషం (Telugu Jyothisham) · శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Telugu Jyothisham · Sri Jallavaram Sai Dheeraj Sharma Garu')}
            </span>
          </div>
        </button>

        {/* Zone 2: Interactive Astrological Search Bar + Unified Action, Language Switcher & Desktop Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Header Topic Search Bar (Vastu, Muhurtham, Pooja services, Panchangam, Jatakam, Horoscope) */}
          <div ref={searchContainerRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-amber-300 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder={t(
                    'వెతకండి: Vastu, Muhurtham, Pooja, జాతకం...',
                    'Search Vastu, Muhurtham, Pooja, Jatakam...'
                  )}
                  aria-label={t(
                    'జ్యోతిష అంశాలను వెతకండి (Search Vastu, Muhurtham, Pooja services, Panchangam, Jatakam)',
                    'Search astrological topics like Vastu, Muhurtham, Pooja services'
                  )}
                  className="w-40 md:w-52 lg:w-60 pl-8 pr-7 py-1.5 rounded-xl bg-amber-900/90 hover:bg-amber-900 focus:bg-amber-950 text-xs text-white placeholder-amber-300/75 border border-amber-600/80 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 text-amber-300 hover:text-white cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>

            {/* Mobile Search Icon Button (< sm screens) */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-amber-900 hover:bg-amber-800 text-amber-200 hover:text-white transition-all shadow-sm cursor-pointer border border-amber-700/60 shrink-0"
              title={t('వెతకండి (Vastu, Muhurtham, Pooja...)', 'Search Topics')}
              aria-label="Search astrological topics"
            >
              <Search size={15} className="text-amber-300" />
            </button>

            {/* Instant Search Results Popover */}
            {isSearchOpen && (
              <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-[420px] bg-[#240c03] text-white rounded-2xl shadow-2xl border-2 border-amber-500/80 z-50 overflow-hidden">
                {/* Mobile Search Input inside Popover */}
                <form onSubmit={handleSearchSubmit} className="sm:hidden p-2.5 border-b border-amber-800/80 bg-amber-950">
                  <div className="relative flex items-center">
                    <Search size={15} className="absolute left-3 text-amber-300 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('Vastu, Muhurtham, Pooja, Jatakam వెతకండి...', 'Search Vastu, Muhurtham, Pooja...')}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-amber-900/90 text-xs text-white placeholder-amber-300/80 border border-amber-600 focus:outline-none focus:border-amber-400"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 text-amber-300 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </form>

                {/* Quick Filter Chips */}
                <div className="px-3 py-2 bg-amber-950/90 border-b border-amber-800/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      {t('త్వరిత అంశాలు (Quick Topics):', 'Popular Topics:')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[11px] text-amber-300 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_SEARCH_CHIPS.map((chip) => (
                      <button
                        key={chip.query}
                        type="button"
                        onClick={() => {
                          setSearchQuery(chip.query);
                          const matches = searchAstroTopics(chip.query);
                          if (matches.length === 1) {
                            handleTopicSelect(matches[0]);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          searchQuery.toLowerCase() === chip.query.toLowerCase()
                            ? 'bg-amber-400 text-amber-950 border-amber-200 font-bold'
                            : 'bg-amber-900/80 hover:bg-amber-800 text-amber-100 border-amber-700/70'
                        }`}
                      >
                        {language === 'en' ? chip.labelEn : chip.labelTe}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Matching Results List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-amber-900/70">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleTopicSelect(topic)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-amber-900/70 transition-colors flex items-start justify-between gap-2.5 cursor-pointer group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                              {language === 'en' ? topic.categoryEn : topic.categoryTe}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                              {language === 'en' ? topic.titleEn : topic.titleTe}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-200/80 mt-0.5 line-clamp-2">
                            {language === 'en' ? topic.descriptionEn : topic.descriptionTe}
                          </p>
                        </div>
                        <ArrowRight
                          size={15}
                          className="text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-1"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <p className="text-xs text-amber-200">
                        {t(
                          `"${searchQuery}" కోసం ఫలితాలు కనిపించలేదు. క్రింది ప్రధాన విభాగాలను చూడండి:`,
                          `No direct match for "${searchQuery}". Try Vastu, Muhurtham, Pooja Services, or Jatakam.`
                        )}
                      </p>
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTabClick('panchangam')}
                          className="px-3 py-1 rounded-lg bg-amber-400 text-amber-950 text-xs font-bold cursor-pointer"
                        >
                          {t('పంచాంగం & వాస్తు', 'Panchangam & Vastu')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTabClick('services')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                        >
                          {t('పూజా సేవలు', 'Pooja Services')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* State-Based Language Switcher (Telugu / English) */}
          <div
            role="group"
            aria-label="Language Switcher"
            className="inline-flex items-center bg-amber-900/95 border border-amber-600/80 rounded-xl p-0.5 shadow-inner shrink-0"
          >
            <Globe size={13} className="text-amber-300 ml-1.5 mr-1 hidden sm:inline shrink-0" />
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                language === 'te'
                  ? 'bg-amber-400 text-amber-950 shadow-2xs'
                  : 'text-amber-200 hover:text-white'
              }`}
              title="తెలుగులో చూడండి (Switch to Telugu)"
              aria-pressed={language === 'te'}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold font-sans transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-400 text-amber-950 shadow-2xs'
                  : 'text-amber-200 hover:text-white'
              }`}
              title="View in English (Switch to English)"
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>

          {/* 1. Temple Bell */}
          <button
            type="button"
            onClick={handleBellRing}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-900 hover:bg-amber-800 text-amber-200 hover:text-white transition-all shadow-sm cursor-pointer border border-amber-700/60 shrink-0"
            title={t('కోవెల ఘంటానాదం (Ring Temple Bell)', 'Ring Temple Bell')}
            aria-label="Ring Temple Bell"
          >
            <Bell size={15} className="text-amber-300" />
          </button>

          {/* 2. Home Page Button (Desktop lg+) */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'home'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-amber-900/80 hover:bg-amber-800 text-amber-100 hover:text-white border-amber-700/60'
            }`}
            title={t('హోమ్ పేజీ', 'Home')}
          >
            <Home size={14} className="text-amber-300 shrink-0" />
            <span>{t('హోమ్ పేజీ', 'Home')}</span>
          </button>

          {/* 3. Panchangam Button (Desktop md+) */}
          <button
            type="button"
            onClick={() => handleTabClick('panchangam')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'panchangam'
                ? 'bg-amber-400 text-amber-950 border-amber-200 font-bold shadow-sm'
                : 'bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white border-amber-600/60 shadow-sm'
            }`}
            title={t('నిత్య పంచాంగం తెరవండి', 'Open Daily Panchangam')}
          >
            <Calendar size={14} className={activeTab === 'panchangam' ? 'text-amber-950 shrink-0' : 'text-amber-300 shrink-0'} />
            <span>{t('పంచాంగం', 'Panchangam')}</span>
          </button>

          {/* 4. Mee Jatakam Telusukondi Button (Desktop md+) */}
          <button
            type="button"
            onClick={() => handleTabClick('jathakam')}
            className={`hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'jathakam'
                ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 text-amber-950 border-white shadow-md ring-2 ring-amber-300/60'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-amber-950 border-amber-300 shadow-sm'
            }`}
            title={t('మీ జాతకం తెలుసుకోండి (ఉచిత జన్మ కుండలి & సంపూర్ణ జాతక ఫలితాలు)', 'Know Your Horoscope (Free Janma Kundali & Report)')}
          >
            <Compass size={15} className="text-amber-950 shrink-0" />
            <span>{t('మీ జాతకం తెలుసుకోండి', 'Know Your Horoscope')}</span>
          </button>

          {/* 5. Satkaralu (Awards) Button (Desktop xl+) */}
          <button
            type="button"
            onClick={() => handleTabClick('awards')}
            className={`hidden 2xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'awards'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-amber-900/70 hover:bg-amber-800 text-amber-100 border-amber-700/60'
            }`}
          >
            <Award size={14} className="text-amber-300 shrink-0" />
            <span>{t('సత్కారాలు', 'Honors')}</span>
          </button>

          {/* Additional Desktop Links (Services, Contact) */}
          <button
            type="button"
            onClick={() => handleTabClick('services')}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'services'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner'
                : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border-amber-800'
            }`}
          >
            <span>{t('పూజా సేవలు', 'Pooja Services')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('contact')}
            className={`hidden 2xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'contact'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner'
                : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border-amber-800'
            }`}
          >
            <span>{t('సంప్రదించండి', 'Contact')}</span>
          </button>

          {/* Primary Pooja Booking CTA - Shown on lg+ */}
          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all transform active:scale-95 cursor-pointer shrink-0 border border-emerald-400/50"
          >
            <Sparkles size={14} className="shrink-0" />
            <span>{t('పూజ బుకింగ్', 'Book Pooja')}</span>
          </button>

          {/* Mobile / Tablet Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer border border-amber-700/60 shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* STYLISH MOBILE & TABLET QUICK NAVIGATION RIBBON (Visible on < md screens) */}
      <div className="md:hidden bg-[#2b0f04] border-t border-amber-800/80 px-2.5 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isJathakam = item.id === 'jathakam';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 border-amber-200 shadow-sm'
                    : isJathakam
                    ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white border-amber-400/80 shadow-2xs'
                    : 'bg-amber-900/70 text-amber-100 border-amber-800/80 hover:bg-amber-800'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-amber-950 shrink-0' : 'text-amber-300 shrink-0'} />
                <span>{language === 'en' ? item.shortLabelEn : item.shortLabelTe}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-amber-950 border-t border-amber-800 p-4 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 font-bold border border-amber-200'
                    : item.id === 'jathakam'
                    ? 'bg-amber-900/90 text-amber-100 border border-amber-500/70'
                    : 'text-amber-200 hover:bg-amber-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-amber-950' : 'text-amber-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 font-bold rounded-md ${
                      isActive ? 'bg-amber-950 text-amber-200' : 'bg-amber-400 text-amber-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Pooja Booking in Mobile Drawer */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Sparkles size={16} />
              <span>{t('పూజ బుకింగ్ చేయండి', 'Book a Vedic Pooja')}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-amber-900">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm"
            >
              <MessageCircle size={18} />
              <span>
                {t(
                  'ధీరజ్ శర్మ గారితో వాట్సాప్‌లో మాట్లాడండి (8977986166)',
                  'Chat with Guruji on WhatsApp (8977986166)'
                )}
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
