import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useLanguage();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-300 hover:bg-amber-200 text-amber-950 font-extrabold text-[11px] sm:text-xs shadow-sm transition-all cursor-pointer shrink-0 whitespace-nowrap"
        title={t('మొబైల్ యాప్‌గా ఇన్‌స్టాల్ చేయండి (Offline Panchangam)', 'Install Telugu Jyothisham App')}
      >
        <Download size={13} className="shrink-0" />
        <span className="hidden lg:inline">{t('యాప్ ఇన్‌స్టాల్', 'Install App')}</span>
        <span className="lg:hidden">{t('యాప్', 'App')}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-400/60 font-bold text-[11px] sm:text-xs cursor-pointer shrink-0 whitespace-nowrap"
        >
          <Smartphone size={13} className="shrink-0" />
          <span>{t('యాప్ ఇన్‌స్టాల్', 'Install App')}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-6 shadow-2xl border-2 border-amber-400 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="text-base font-extrabold text-amber-950">
                  {t('iPhone / iPad లో యాప్ ఇన్‌స్టాల్ చేయండి', 'Install on iPhone / iPad')}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                1. {t('Safari కింద ఉన్న', 'Tap the')} <strong>Share</strong>{' '}
                {t('బటన్ నొక్కండి.', 'button in Safari toolbar.')}
                <br />
                2. {t('కిందికి స్క్రోల్ చేసి', 'Scroll down and tap')}{' '}
                <strong>Add to Home Screen</strong> {t('ఎంచుకోండి.', 'to install offline access.')}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-amber-900 hover:bg-amber-800 py-2.5 text-xs font-bold text-white cursor-pointer"
              >
                {t('సరే (Close)', 'Got It')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
