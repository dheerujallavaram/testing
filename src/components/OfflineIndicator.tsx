import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-900 border border-amber-400 px-3.5 py-2 text-xs font-bold text-amber-100 shadow-xl no-print">
      <WifiOff size={14} className="text-amber-300 shrink-0" />
      <span>
        {t(
          'ఆఫ్‌లైన్ మోడ్ — సేవ్ చేసిన పంచాంగం & రాశి ఫలాలు పనిచేస్తున్నాయి.',
          'Offline Mode — Cached Panchangam & Horoscope data active.'
        )}
      </span>
    </div>
  );
};
