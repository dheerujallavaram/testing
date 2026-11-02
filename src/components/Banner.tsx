import React from 'react';
import { Compass, Sunrise, Moon, Bell } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { VirupakshaGatewayScene } from './VirupakshaGopuramArt';
import { playTempleBell } from '../utils/audioChime';

interface BannerProps {
  currentDay: DayData;
  activeLagnaName?: string;
  onOpenBooking: () => void;
}

export const Banner: React.FC<BannerProps> = ({ currentDay, activeLagnaName }) => {
  const { t, tr } = useLanguage();
  const cleanTithi = currentDay.panchanga.tithi.split('-')[0]?.trim() || currentDay.panchanga.tithi;
  const cleanNakshatra = currentDay.panchanga.nakshatram.split('-')[0]?.trim() || currentDay.panchanga.nakshatram;
  const cleanYogam = currentDay.panchanga.yogam.split('-')[0]?.trim() || currentDay.panchanga.yogam;

  const moonRashiDisplay = (() => {
    const moonEntry = Object.entries(currentDay.grahaStithi).find(([, val]) => val?.includes('చంద్రుడు'));
    if (moonEntry) {
      const rashiMap: Record<string, string> = {
        mesham: 'మేష రాశి',
        vrushabham: 'వృషభ రాశి',
        mithunam: 'మిథున రాశి',
        karkatakam: 'కర్కాటక రాశి',
        simham: 'సింహ రాశి',
        kanya: 'కన్యా రాశి',
        tula: 'తులా రాశి',
        vruschikam: 'వృశ్చిక రాశి',
        dhanussu: 'ధనుస్సు రాశి',
        makaram: 'మకర రాశి',
        kumbham: 'కుంభ రాశి',
        meenam: 'మీన రాశి',
      };
      return tr(rashiMap[moonEntry[0]] || 'కుంభ రాశి');
    }
    const match = currentDay.chandra.sancharam.match(/చంద్రుడు\s+([^\s]+)\s+రాశి/);
    return match ? tr(`${match[1]} రాశి`) : t('శుభ సంచారం', 'Auspicious Transit');
  })();

  const sunriseTime =
    currentDay.lagnalu[0]?.samayam.match(/ఉదయం\s*[\d:]+\s*(AM|PM)/)?.[0] || 'ఉదయం 06:15 AM';

  return (
    <section className="rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/70 bg-gradient-to-b from-[#2A050C] via-[#3A0912] to-[#24040A] text-amber-50">
      {/* TOP STAGE: Unobstructed Virupaksha Gateway Sunset Panorama */}
      <div className="relative w-full h-44 sm:h-56 lg:h-64 overflow-hidden border-b border-amber-400/40">
        <VirupakshaGatewayScene className="w-full h-full object-cover" />

        <button
          type="button"
          onClick={() => playTempleBell()}
          title={t('ఆలయ గంటను మోగించండి', 'Ring Sacred Temple Bell')}
          className="absolute top-3 right-3 sm:top-4 sm:right-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A050C]/80 hover:bg-[#460D16] text-amber-200 border border-amber-400/50 text-xs font-bold shadow-lg backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Bell size={14} className="text-amber-300 animate-bounce" />
          <span>{t('ఆలయ గంట', 'Ring Bell')}</span>
        </button>
      </div>

      {/* BOTTOM STAGE: Clean High-Contrast Panchangam Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 text-center">
        <p
          className="text-amber-300 text-xs sm:text-sm font-semibold font-telugu mb-2 tracking-wide"
          data-nosnippet
        >
          {t(
            'శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్ · ప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే',
            'Shuklambaradharam Vishnum Shashivarnam Chaturbhujam · Prasannavadanam Dhyayet Sarvavighnopashantaye'
          )}
        </p>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-telugu text-white tracking-tight leading-tight mb-3">
          {t(
            `ఈ రోజు తెలుగు పంచాంగం (${currentDay.teediVaram})`,
            `Daily Telugu Panchangam (${tr(currentDay.teediVaram)})`
          )}
        </h1>

        <p className="text-xs sm:text-sm font-bold text-amber-200 tracking-wide mb-4 max-w-3xl mx-auto">
          {t(
            `${currentDay.panchanga.samvatsaram} · ${currentDay.panchanga.masam} · తిథి: ${cleanTithi} · నక్షత్రం: ${cleanNakshatra} · యోగం: ${cleanYogam}`,
            `${tr(currentDay.panchanga.samvatsaram)} · ${tr(currentDay.panchanga.masam)} · Tithi: ${tr(cleanTithi)} · Nakshatram: ${tr(cleanNakshatra)}`
          )}
        </p>

        {/* Highlight Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs sm:text-sm font-telugu">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-amber-400/40 text-amber-100">
            <Sunrise size={16} className="text-amber-300" />
            <span>
              {t('సూర్యోదయం:', 'Sunrise:')} <strong className="text-white">{tr(sunriseTime)}</strong>
            </span>
          </div>

          {activeLagnaName && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-200">
              <Compass size={16} className="text-amber-300" />
              <span>
                {t('ప్రస్తుత లగ్నం:', 'Active Lagna:')} <strong className="text-white">{tr(activeLagnaName)}</strong>
              </span>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-amber-400/40 text-amber-100">
            <Moon size={16} className="text-amber-300" />
            <span>
              {t('చంద్ర రాశి:', 'Moon Sign:')} <strong className="text-white">{moonRashiDisplay}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
