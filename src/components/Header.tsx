import React, { useState } from 'react';
import { Bell, Calendar, MessageCircle, Menu, X, Sparkles, Home, User, Phone, Award, Globe } from 'lucide-react';
import { playTempleBell } from '../utils/audioChime';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';

export type NavTab = 'home' | 'panchangam' | 'awards' | 'services' | 'about' | 'contact';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { language, setLanguage, t } = useLanguage();

  const handleBellRing = () => {
    playTempleBell();
  };

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: string }[] = [
    { id: 'home', label: t('హోమ్ పేజీ', 'Home'), icon: Home },
    { id: 'panchangam', label: t('పంచాంగం', 'Panchangam'), icon: Calendar },
    { id: 'awards', label: t('పొందిన సత్కారాలు', 'Honors & Awards'), icon: Award },
    { id: 'services', label: t('పూజా సేవలు', 'Pooja Services'), icon: Sparkles },
    { id: 'about', label: t('ధీరజ్ శర్మ గారి గురించి', 'About Guruji'), icon: User },
    { id: 'contact', label: t('సంప్రదించండి', 'Contact'), icon: Phone },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, పూజ / జాతక పరిశీలన ముహూర్త సమాచారం కోసం సంప్రదిస్తున్నాను.'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-amber-950 text-white shadow-xl border-b border-amber-800/90 backdrop-blur-md bg-opacity-95 font-telugu">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5">
        {/* Zone 1: Brand wordmark & Sri Dheeraj Sharma Garu subtext */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          title={t(
            'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం - శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ',
            'Sreelakshmi Ganapathi Astrology - Sri Jallavaram Sai Dheeraj Sharma'
          )}
        >
          <OmEmblem className="w-10 h-10 sm:w-11 sm:h-11 group-hover:scale-105 transition-transform shrink-0 drop-shadow-md" size={44} />
          <div>
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white block group-hover:text-amber-200 transition-colors leading-tight">
              {t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', 'Sreelakshmi Ganapathi Astrology')}
            </span>
            <span className="text-[11px] text-amber-300 font-semibold block">
              {t('శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Sri Jallavaram Sai Dheeraj Sharma Garu')}
            </span>
          </div>
        </button>

        {/* Zone 2: Unified Action, Language Switcher & Navigation Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* State-Based Language Switcher (Telugu / English) */}
          <div
            role="group"
            aria-label="Language Switcher"
            className="inline-flex items-center bg-amber-900/95 border border-amber-600/80 rounded-xl p-0.5 shadow-inner shrink-0"
          >
            <Globe size={13} className="text-amber-300 ml-1.5 mr-1 hidden xs:inline sm:inline shrink-0" />
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
              English
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

          {/* 2. Home Page Button (Hidden on extra small mobile, visible on sm+) */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'home'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-amber-900/80 hover:bg-amber-800 text-amber-100 hover:text-white border-amber-700/60'
            }`}
            title={t('హోమ్ పేజీ', 'Home')}
          >
            <Home size={14} className="text-amber-300 shrink-0" />
            <span>{t('హోమ్ పేజీ', 'Home')}</span>
          </button>

          {/* 3. Panchangam Button (Always available on all viewports) */}
          <button
            type="button"
            onClick={() => handleTabClick('panchangam')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'panchangam'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-amber-500/50 shadow-sm'
            }`}
            title={t('నిత్య పంచాంగం తెరవండి', 'Open Daily Panchangam')}
          >
            <Calendar size={14} className="text-amber-300 shrink-0" />
            <span>{t('పంచాంగం', 'Panchangam')}</span>
          </button>

          {/* 4. Satkaralu (Awards) Button (Hidden on extra small mobile, visible on md+) */}
          <button
            type="button"
            onClick={() => handleTabClick('awards')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'awards'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 border-amber-600/70 shadow-sm'
            }`}
            title={t('పొందిన సత్కారాలు & పురస్కారాలు', 'Honors & Awards')}
          >
            <Award size={14} className="text-amber-300 shrink-0" />
            <span>{t('పొందిన సత్కారాలు', 'Honors')}</span>
          </button>

          {/* Additional Desktop Links (Services, About, Contact) */}
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
            onClick={() => handleTabClick('about')}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'about'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner'
                : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border-amber-800'
            }`}
          >
            <span>{t('ధీరజ్ శర్మ గారి గురించి', 'About Guruji')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('contact')}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'contact'
                ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-inner'
                : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border-amber-800'
            }`}
          >
            <span>{t('సంప్రదించండి', 'Contact')}</span>
          </button>

          {/* Primary Pooja Booking CTA - Shown on tablet & desktop (sm+) */}
          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all transform active:scale-95 cursor-pointer shrink-0"
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
                    ? 'bg-amber-800 text-white border border-amber-600'
                    : 'text-amber-200 hover:bg-amber-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-amber-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-amber-950 font-bold rounded-full">
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
