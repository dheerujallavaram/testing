import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Sun, MessageCircle, Menu, X, Sparkles, Home, User, Phone, Award } from 'lucide-react';
import { playTempleBell } from '../utils/audioChime';
import { OmEmblem } from './OmEmblem';

export type NavTab = 'home' | 'panchangam' | 'awards' | 'services' | 'about' | 'contact';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenBooking }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBellRing = () => {
    playTempleBell();
  };

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'ప్రధాన పేజీ (హోమ్)', icon: Home },
    { id: 'panchangam', label: 'నిత్య పంచాంగం', icon: Calendar, badge: 'సబ్ మెనూ' },
    { id: 'awards', label: 'పొందిన సత్కారాలు', icon: Award, badge: 'పురస్కారాలు' },
    { id: 'services', label: 'పూజా సేవలు', icon: Sparkles },
    { id: 'about', label: 'గురువుగారి గురించి', icon: User },
    { id: 'contact', label: 'సంప్రదించండి', icon: Phone },
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Zone 1: Brand wordmark & Guruji subtext */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 text-left shrink-0 group cursor-pointer"
          title="శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం - శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ"
        >
          <OmEmblem className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300 group-hover:scale-105 transition-transform shrink-0" size={34} />
          <div>
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white block group-hover:text-amber-200 transition-colors">
              శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం
            </span>
            <span className="text-[11px] text-amber-300 font-semibold block -mt-0.5">
              శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer font-semibold relative ${
                  isActive
                    ? 'bg-amber-800 text-amber-100 shadow-inner border border-amber-600/70'
                    : 'text-amber-200/90 hover:text-white hover:bg-amber-900/60'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-amber-300' : 'text-amber-400/80'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-amber-950 font-bold rounded-full ml-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Bell + Home CTA + Panchangam CTA + Satkaralu CTA + Pooja Booking CTA + Mobile Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Temple Bell */}
          <button
            type="button"
            onClick={handleBellRing}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-900 hover:bg-amber-800 text-amber-200 hover:text-white transition-all shadow-sm cursor-pointer border border-amber-700/60"
            title="కోవెల ఘంటానాదం (Ring Temple Bell)"
            aria-label="Ring Temple Bell"
          >
            <Bell size={16} className="text-amber-300" />
          </button>

          {/* Home Page Direct Action Button */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'home'
                ? 'bg-amber-800 text-amber-100 border-amber-500 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-amber-900/80 hover:bg-amber-800 text-amber-200 hover:text-white border-amber-700/60'
            }`}
            title="ప్రధాన పేజీ (హోమ్)"
          >
            <Home size={14} className="text-amber-300" />
            <span className="hidden sm:inline">హోమ్ పేజీ</span>
            <span className="sm:hidden">హోమ్</span>
          </button>

          {/* Panchangam Direct Action Button */}
          <button
            type="button"
            onClick={() => handleTabClick('panchangam')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'panchangam'
                ? 'bg-amber-800 text-amber-100 border-amber-500 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-amber-500/50 shadow-sm'
            }`}
            title="నిత్య పంచాంగం తెరవండి"
          >
            <Calendar size={14} className="text-amber-300" />
            <span>పంచాంగం</span>
          </button>

          {/* Satkaralu (Awards) Direct Action Button */}
          <button
            type="button"
            onClick={() => handleTabClick('awards')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 cursor-pointer border ${
              activeTab === 'awards'
                ? 'bg-amber-800 text-amber-100 border-amber-500 shadow-inner ring-1 ring-amber-400/50'
                : 'bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 border-amber-600/70 shadow-sm'
            }`}
            title="పొందిన సత్కారాలు & పురస్కారాలు"
          >
            <Award size={14} className="text-amber-300" />
            <span className="hidden sm:inline">పొందిన సత్కారాలు</span>
            <span className="sm:hidden">సత్కారాలు</span>
          </button>

          {/* Primary Pooja Booking CTA */}
          <button
            type="button"
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all transform active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>పూజ బుకింగ్</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-amber-950 border-t border-amber-800 p-4 space-y-2 animate-fadeIn">
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

          <div className="pt-3 border-t border-amber-900">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm"
            >
              <MessageCircle size={18} />
              <span>వాట్సాప్‌లో మాట్లాడండి (8977986166)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
