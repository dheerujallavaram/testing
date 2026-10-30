import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Sparkles, ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { db, type SiteAnnouncementDoc } from '../firebase';
import { useLanguage } from '../context/LanguageContext';

interface LiveSiteAnnouncementBannerProps {
  onNavigateJathakam: () => void;
  onNavigatePanchangam: () => void;
  onOpenBooking: () => void;
}

export const LiveSiteAnnouncementBanner: React.FC<LiveSiteAnnouncementBannerProps> = ({
  onNavigateJathakam,
  onNavigatePanchangam,
  onOpenBooking,
}) => {
  const { language, t } = useLanguage();
  const [announcement, setAnnouncement] = useState<SiteAnnouncementDoc | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'siteAnnouncements'), where('isActive', '==', true));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setAnnouncement(null);
          return;
        }
        const docSnap = snapshot.docs[0];
        setAnnouncement({
          id: docSnap.id,
          ...(docSnap.data() as Omit<SiteAnnouncementDoc, 'id'>),
        });
      },
      () => {
        // Silently ignore if offline
      }
    );
    return () => unsubscribe();
  }, []);

  if (!announcement || !announcement.isActive) return null;

  const handleAction = () => {
    if (announcement.ctaTarget === 'jathakam') {
      onNavigateJathakam();
    } else if (announcement.ctaTarget === 'panchangam') {
      onNavigatePanchangam();
    } else if (announcement.ctaTarget === 'booking') {
      onOpenBooking();
    } else if (announcement.ctaTarget === 'whatsapp') {
      window.open(
        `https://wa.me/918977986166?text=${encodeURIComponent(
          `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, వెబ్‌సైట్ ప్రకటన (${announcement.titleTe}) చూసి సంప్రదిస్తున్నాను.`
        )}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div
      data-nosnippet
      className="bg-gradient-to-r from-[#2c0e04] via-amber-950 to-[#2c0e04] text-amber-100 border-b-2 border-amber-500/70 shadow-md no-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 font-telugu">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400 text-amber-950 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>{announcement.badgeTe}</span>
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-amber-200">
              {language === 'en' ? announcement.titleEn : announcement.titleTe}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            {language === 'en' ? announcement.messageEn : announcement.messageTe}
          </p>
          {announcement.consultationHoursTe && (
            <p className="text-[11px] text-amber-300/90 flex items-center gap-1.5 pt-0.5">
              <Clock size={12} className="text-amber-400 shrink-0" />
              <span>
                {t('సంప్రదింపు సమయాలు: ', 'Consultation Hours: ')}
                <strong>{announcement.consultationHoursTe}</strong>
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            {announcement.ctaTarget === 'whatsapp' ? <MessageCircle size={15} /> : <Sparkles size={15} />}
            <span>{announcement.ctaLabelTe}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
