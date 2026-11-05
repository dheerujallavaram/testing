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
  Globe,
  Compass,
  Search,
  ArrowRight,
  Clock,
  Flame,
} from 'lucide-react';
import { playTempleBell } from '../utils/audioChime';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { ASTRO_SEARCH_TOPICS, AstroSearchTopic, searchAstroTopics } from '../data/astroSearchIndex';

export type NavTab = 'home' | 'panchangam' | 'kartika' | 'muhurtham' | 'jathakam' | 'awards' | 'services' | 'about' | 'contact';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenBooking: () => void;
  onSelectSearchTopic?: (topic: AstroSearchTopic) => void;
}

const QUICK_SEARCH_CHIPS: { labelTe: string; labelEn: string; query: string }[] = [
  { labelTe: 'కార్తీక రుద్రాభిషేకం (Kartika Abhishekam)', labelEn: 'Kartika Puja', query: 'Kartika Abhishekam' },
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
  const [isRinging, setIsRinging] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { language, setLanguage, t } = useLanguage();

  const handleBellRing = () => {
    setIsRinging(true);
    playTempleBell();
    setTimeout(() => setIsRinging(false), 1200);
  };

  const navItems: {
    id: NavTab;
    label: string;
    shortLabelTe: string;
    shortLabelEn: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { id: 'home', label: t('హోమ్ పేజీ', 'Home'), shortLabelTe: 'హోమ్', shortLabelEn: 'Home', icon: Home },
    { id: 'panchangam', label: t('నేటి పంచాంగం', 'Panchangam'), shortLabelTe: 'పంచాంగం', shortLabelEn: 'Panchangam', icon: Calendar },
    {
      id: 'kartika',
      label: t('కార్తీక రుద్రాభిషేకం', 'Kartika Abhishekam'),
      shortLabelTe: 'కార్తీక పూజ',
      shortLabelEn: 'Kartika Puja',
      icon: Flame,
    },
    {
      id: 'muhurtham',
      label: t('శుభ ముహూర్తం', 'Muhurtham Finder'),
      shortLabelTe: 'ముహూర్తం',
      shortLabelEn: 'Muhurtham',
      icon: Clock,
    },
    {
      id: 'jathakam',
      label: t('మీ జాతకం తెలుసుకోండి', 'Horoscope & Tools'),
      shortLabelTe: 'మీ జాతకం',
      shortLabelEn: 'Horoscope',
      icon: Compass,
    },
    { id: 'services', label: t('పూజా సేవలు', 'Pooja Services'), shortLabelTe: 'పూజా సేవలు', shortLabelEn: 'Services', icon: Sparkles },
    { id: 'about', label: t('గురువు గారి గురించి', 'About Guruji'), shortLabelTe: 'గురువు గారు', shortLabelEn: 'About', icon: User },
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
      className="sticky top-0 z-40 bg-gradient-to-r from-amber-950 via-[#3b1506] to-amber-950 text-white shadow-xl border-b-2 border-amber-500/80 backdrop-blur-md"
    >
      {/* Top Bar: Brand + Quick Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Title + Ganapathi Emblem */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer min-w-0 flex-1 overflow-hidden"
          title={t(
            'Telugu Jyothisham (తెలుగు జ్యోతిషం) — శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
            'Telugu Jyothisham — Sreelakshmi Ganapathi Astrology'
          )}
        >
          <div className="relative flex items-center justify-center p-0.5 rounded-full bg-gradient-to-b from-amber-200/30 to-amber-600/30 shadow-md group-hover:scale-105 transition-transform shrink-0">
            <OmEmblem className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" size={48} />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm sm:text-xl font-bold font-telugu tracking-wide text-amber-100 block leading-tight truncate">
                {t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', 'Sreelakshmi Ganapathi Astrology')}
              </span>
              <span className="hidden xl:inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 shrink-0">
                Telugu Jyothisham
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-300/90 font-telugu tracking-wider truncate">
              {t(
                'తెలుగు జ్యోతిషం • శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ • హైదరాబాద్',
                'Telugu Jyothisham • Sri Jallavaram Sai Dheeraj Sharma'
              )}
            </p>
          </div>
        </button>

        {/* Right Action Buttons (Row 1 - Cleanly separated from Ganapathi Emblem) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher: తెలుగు / English */}
          <div
            role="group"
            aria-label="Language Switcher"
            className="inline-flex items-center bg-amber-900/90 border border-amber-400/60 rounded-full p-0.5 shadow-inner shrink-0"
          >
            <Globe size={13} className="text-amber-300 ml-1.5 mr-1 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold font-telugu transition-all cursor-pointer ${
                language === 'te'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-xs'
                  : 'text-amber-100 hover:text-white'
              }`}
              title="తెలుగులో చూడండి (View in Telugu)"
              aria-pressed={language === 'te'}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold font-sans transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-xs'
                  : 'text-amber-100 hover:text-white'
              }`}
              title="View in English"
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={handleBellRing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-500/50 transition-all shadow-inner text-xs font-telugu cursor-pointer shrink-0"
            title={t('కోవెల ఘంటానాదం (Ring Temple Bell)', 'Ring Temple Bell')}
            aria-label="Ring Temple Bell"
          >
            <Bell
              size={15}
              className={`text-amber-300 transition-transform ${
                isRinging ? 'animate-bounce scale-125 text-yellow-300' : ''
              }`}
            />
            <span className="hidden xl:inline">{t('ఘంటానాదం', 'Bell')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-amber-950 font-bold text-xs sm:text-sm rounded-full shadow-md transition-all font-telugu cursor-pointer shrink-0"
          >
            <Sparkles size={15} />
            <span>{t('పూజ బుకింగ్', 'Book Pooja')}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all font-telugu shrink-0"
          >
            <MessageCircle size={15} />
            <span className="hidden lg:inline">{t('వాట్సాప్ సంప్రదింపు', 'WhatsApp')}</span>
            <span className="lg:hidden">8977986166</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-amber-900/80 text-amber-200 hover:bg-amber-800 border border-amber-600/50 cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Row 2: Navigation Tabs + Dedicated Topic Search Bar */}
      <div ref={searchContainerRef} className="relative bg-[#240a02]/95 border-t border-amber-700/50">
        {/* Mobile & Tablet (< lg): Quick Tab Strip + Search Button */}
        <nav
          aria-label="Quick Mobile Navigation"
          className="lg:hidden px-2.5 py-1.5 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-telugu font-bold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-sm'
                      : 'bg-amber-950/80 text-amber-100/90 border border-amber-700/50 hover:bg-amber-900'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-amber-950' : 'text-amber-400'} />
                  <span>{language === 'en' ? item.shortLabelEn : item.shortLabelTe}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-400/70 text-xs font-telugu font-bold cursor-pointer shrink-0 shadow-xs"
            title={t('వెతకండి (Search Topics)', 'Search Topics')}
            aria-label="Search astrological topics"
          >
            <Search size={13} className="text-amber-300 shrink-0" />
            <span>{t('వెతకండి', 'Search')}</span>
          </button>
        </nav>

        {/* Desktop (lg+): Primary Navigation Tabs + Search Input */}
        <nav aria-label="Primary Navigation" className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-1.5 xl:gap-2 flex-wrap">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-xl text-sm font-telugu font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-md font-bold scale-[1.02]'
                        : 'text-amber-100/90 hover:bg-amber-900/70 hover:text-amber-200'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-amber-950' : 'text-amber-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Search Form cleanly placed in Navigation Row */}
            <form onSubmit={handleSearchSubmit} className="flex items-center shrink-0">
              <div className="flex items-center gap-2 w-64 xl:w-80 px-3.5 py-1.5 rounded-full bg-amber-950/90 hover:bg-amber-900/90 focus-within:bg-amber-950 border border-amber-500/70 focus-within:border-amber-300 transition-all shadow-inner">
                <Search size={14} className="text-amber-300 shrink-0 pointer-events-none" />
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
                    'వెతకండి: వాస్తు, ముహూర్తం, పూజ, పంచాంగం, జాతకం...',
                    'Search: Vastu, Muhurtham, Pooja, Panchangam, Jatakam...'
                  )}
                  aria-label={t('జ్యోతిష అంశాలను వెతకండి', 'Search astrological topics')}
                  className="w-full bg-transparent text-xs font-telugu text-white placeholder-amber-200/75 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="text-amber-300 hover:text-white cursor-pointer shrink-0"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </nav>

        {/* Search Dropdown Panel */}
        {isSearchOpen && (
          <div className="max-w-7xl mx-auto relative">
            <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-4 lg:right-8 top-28 sm:top-full sm:mt-1.5 sm:w-[420px] bg-[#2a0c03] text-white rounded-2xl shadow-2xl border-2 border-amber-400/80 z-50 overflow-hidden font-telugu">
              {/* Mobile Search Input inside Popover */}
              <form onSubmit={handleSearchSubmit} className="lg:hidden p-3 border-b border-amber-800/80">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950 border border-amber-500">
                  <Search size={15} className="text-amber-300 shrink-0 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(
                      'వాస్తు, ముహూర్తం, పూజ, పంచాంగం, జాతకం వెతకండి...',
                      'Search Vastu, Muhurtham, Pooja, Panchangam...'
                    )}
                    className="w-full bg-transparent text-xs text-white placeholder-amber-200/70 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-amber-300 hover:text-white shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>

              {/* Quick Filter Chips for the 6 Core Topics */}
              <div className="px-3.5 py-2.5 bg-amber-950/90 border-b border-amber-800/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {t('ముఖ్య విభాగాలు • Popular Topics', 'Popular Astrological Topics')}
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
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                        searchQuery.toLowerCase() === chip.query.toLowerCase()
                          ? 'bg-amber-400 text-amber-950 border-amber-200'
                          : 'bg-amber-900/70 hover:bg-amber-800 text-amber-100 border-amber-600/60'
                      }`}
                    >
                      {language === 'en' ? chip.labelEn : chip.labelTe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matching Results List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-amber-800/50">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full text-left px-4 py-3 hover:bg-amber-900/70 transition-colors flex items-start justify-between gap-3 cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {language === 'en' ? topic.categoryEn : topic.categoryTe}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-amber-100 group-hover:text-amber-300 mt-1">
                          {language === 'en' ? topic.titleEn : topic.titleTe}
                        </div>
                        <p className="text-[11px] text-amber-200/80 mt-0.5 line-clamp-2">
                          {language === 'en' ? topic.descriptionEn : topic.descriptionTe}
                        </p>
                      </div>
                      <ArrowRight
                        size={15}
                        className="text-amber-400 group-hover:translate-x-1 transition-transform shrink-0 mt-2"
                      />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <p className="text-xs text-amber-200">
                      {t(
                        `"${searchQuery}" కోసం ప్రత్యక్ష ఫలితాలు కనిపించలేదు. క్రింది ప్రధాన విభాగాలను చూడండి:`,
                        `No direct match for "${searchQuery}". Explore our main sections:`
                      )}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                      {ASTRO_SEARCH_TOPICS.slice(0, 4).map((fallback) => (
                        <button
                          key={fallback.id}
                          type="button"
                          onClick={() => handleTopicSelect(fallback)}
                          className="px-3 py-1 rounded-full bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-bold cursor-pointer"
                        >
                          {language === 'en' ? fallback.categoryEn : fallback.categoryTe}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#240a02] border-t border-amber-700/60 px-4 py-4 space-y-2 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-telugu font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-bold shadow-md'
                    : 'text-amber-100 hover:bg-amber-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-amber-950' : 'text-amber-400'} />
                  <span>{item.label}</span>
                </div>
                <span className="text-xs opacity-75">→</span>
              </button>
            );
          })}

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-amber-800/60">
            <button
              type="button"
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-amber-950 rounded-xl font-bold font-telugu text-sm shadow-md cursor-pointer"
            >
              <Sparkles size={16} />
              <span>{t('ఆన్‌లైన్ పూజ బుకింగ్ చేయండి', 'Book a Vedic Pooja Online')}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold font-telugu text-sm shadow-md"
            >
              <MessageCircle size={16} />
              <span>{t('వాట్సాప్ సంప్రదింపు (8977986166)', 'WhatsApp Guruji (8977986166)')}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
