import React from 'react';
import { Sparkles, Compass, Sunrise, Moon, Bell } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { VirupakshaGatewayScene } from './VirupakshaGopuramArt';
import { playTempleBell } from '../utils/audioChime';

interface BannerProps {
  currentDay: DayData;
  activeLagnaName?: string;
  customH1?: string;
  onOpenBooking: () => void;
}

export const Banner: React.FC<BannerProps> = ({ currentDay, activeLagnaName, customH1 }) => {
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
    <section className="rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/80 bg-[#2b0902] text-amber-50">
      {/* TOP STAGE: Unobstructed Virupaksha Gateway Sunset Panorama */}
      <div className="relative w-full h-44 sm:h-56 lg:h-64 overflow-hidden border-b-2 border-amber-400/50">
        <VirupakshaGatewayScene className="w-full h-full object-cover" />

        {/* Interactive Temple Bell Button */}
        <button
          type="button"
          onClick={() => playTempleBell()}
          title={t('ఆలయ గంటను మోగించండి', 'Ring Sacred Temple Bell')}
          className="absolute top-3 right-3 sm:top-4 sm:right-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-400/70 text-xs font-bold shadow-lg backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
        >
          <Bell size={14} className="text-amber-300 animate-bounce" />
          <span>{t('ఆలయ గంట', 'Ring Bell')}</span>
        </button>
      </div>

      {/* BOTTOM STAGE: Clean, High-Contrast Panchangam Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center bg-gradient-to-b from-[#2b0902] via-[#380d04] to-[#240702]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/70 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-medium mb-3 shadow-inner">
          <Sparkles size={14} className="text-amber-300 shrink-0" />
          <span>
            {t(
              'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి గణన',
              'Sreelakshmi Ganapathi Astrology • Calculated by Brahmasri Jallavaram Sai Dheeraj Sharma'
            )}
          </span>
        </div>

        <p
          className="text-amber-300/95 text-xs sm:text-base font-medium font-telugu mb-2 tracking-wide"
          data-nosnippet
        >
          {t(
            '“శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్ • ప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే”',
            '“Shuklambaradharam Vishnum Shashivarnam Chaturbhujam • Prasannavadanam Dhyayet Sarvavighnopashantaye”'
          )}
        </p>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-telugu text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-wide leading-tight mb-2">
          {customH1 ||
            t(
              `ఈ రోజు తెలుగు పంచాంగం (${currentDay.teediVaram})`,
              `Daily Telugu Panchangam (${tr(currentDay.teediVaram)})`
            )}
        </h1>

        <p className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wider mb-5">
          {t(
            `${currentDay.panchanga.samvatsaram} • ${currentDay.panchanga.masam} • తిథి: ${cleanTithi} • నక్షత్రం: ${cleanNakshatra} • యోగం: ${cleanYogam}`,
            `${tr(currentDay.panchanga.samvatsaram)} • ${tr(currentDay.panchanga.masam)} • Tithi: ${tr(cleanTithi)} • Nakshatram: ${tr(cleanNakshatra)}`
          )}
        </p>

        {/* Quick Live Status Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-telugu">
          <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-500/40 px-3.5 py-2 rounded-xl">
            <Sunrise size={16} className="text-amber-400 shrink-0" />
            <span className="text-amber-200">
              {t('సూర్యోదయం:', 'Sunrise:')} <strong className="text-white">{tr(sunriseTime)}</strong>
            </span>
          </div>

          {activeLagnaName && (
            <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-400/50 px-3.5 py-2 rounded-xl">
              <Compass size={16} className="text-amber-300 shrink-0" />
              <span className="text-amber-200">
                {t('ప్రస్తుత లగ్నం:', 'Active Lagna:')} <strong className="text-yellow-300">{tr(activeLagnaName)}</strong>
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-500/40 px-3.5 py-2 rounded-xl">
            <Moon size={16} className="text-amber-300 shrink-0" />
            <span className="text-amber-200">
              {t('చంద్ర రాశి:', 'Moon Sign:')} <strong className="text-white">{moonRashiDisplay}</strong>
            </span>
          </div>
        </div>

        {/* Visible Calculation Standard Line (E-E-A-T Requirement 7) */}
        <p className="mt-4 text-[11px] sm:text-xs font-mono text-amber-200/85">
          Calculation: Drik Siddhanta, Lahiri Chitrapaksha Ayanamsa (NASA JPL DE440 Ephemeris), location: Hyderabad (17.3850° N, 78.4867° E)
        </p>
      </div>
    </section>
  );
};
