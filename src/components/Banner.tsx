import React from 'react';
import { Sparkles, Compass, Sunrise, Moon } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface BannerProps {
  currentDay: DayData;
  activeLagnaName?: string;
  onOpenBooking: () => void;
}

export const Banner: React.FC<BannerProps> = ({ currentDay, activeLagnaName }) => {
  const { t, tr } = useLanguage();

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
    <section className="relative bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50 overflow-hidden py-12 lg:py-16 border-b-2 border-amber-600/50 rounded-2xl">
      {/* Subtle traditional sacred background geometric pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffd166_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Sanskrit invocation */}
          <p className="text-amber-300 text-sm sm:text-base font-semibold font-telugu mb-2 flex items-center justify-center gap-2 drop-shadow-xs">
            <span>
              {t(
                'శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్ · ప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే',
                'Shuklambaradharam Vishnum Shashivarnam Chaturbhujam · Prasannavadanam Dhyayet Sarvavighnopashantaye'
              )}
            </span>
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-telugu text-white tracking-tight drop-shadow-sm mb-3">
            {t(
              'తెలుగు జ్యోతిషం (Telugu Jyothisham) — నేటి పంచాంగం & రాశి ఫలితాలు',
              'Telugu Jyothisham | Today Panchangam in Telugu (ఈ రోజు పంచాంగం - Neti Panchangam)'
            )}
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-amber-300/95 tracking-wide mb-2">
            Telugu Jyothisham (తెలుగు జ్యోతిషం) · Neti Panchangam · Today Panchangam in Telugu - Tithi(తిథి), Nakshatram(నక్షత్రం), Yogam(యోగం), Karanam(కరణం), Vaaram(వారం), Masam(మాసం)
          </p>

          <p className="text-base sm:text-lg text-amber-100/90 font-telugu leading-relaxed mb-6 max-w-2xl mx-auto">
            {tr(currentDay.panchanga.samvatsaram)} · {tr(currentDay.panchanga.masam)} —{' '}
            {t(
              'తిథి, నక్షత్రం, యోగం, కరణం, లగ్నాలు, రాహుకాలం, రాశి చక్ర గోచారం మరియు శుభ/అశుభ ముహూర్తాల ప్రామాణిక వివరాలు.',
              'Authentic Drik Siddhanta Tithi, Nakshatra, Yogam, Karanam, Lagnas, Rahu Kalam, Planetary Rashi Chart & Auspicious Muhurtha Timings.'
            )}
          </p>

          {/* Quick status badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-telugu">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-800/80 border border-amber-600/40 text-amber-100 shadow-inner">
              <Sunrise size={16} className="text-amber-300" />
              <span>
                {t('సూర్యోదయం:', 'Sunrise:')} {tr(sunriseTime)}
              </span>
            </div>
            {activeLagnaName && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-600/80 border border-amber-400/50 text-white shadow-md animate-pulse">
                <Compass size={16} className="text-amber-200" />
                <span>
                  {t('ఇప్పుడు నడుస్తున్నది:', 'Current Ascendant (Lagna):')}{' '}
                  <strong>{tr(activeLagnaName)}</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-800/80 border border-amber-600/40 text-amber-100 shadow-inner">
              <Moon size={16} className="text-amber-300" />
              <span>
                {t('చంద్ర సంచారం:', 'Moon Transit:')} {moonRashiDisplay}
              </span>
            </div>
            {currentDay.specialEvent && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-900/70 border border-rose-500/50 text-rose-200 shadow-inner">
                <Sparkles size={16} className="text-rose-300" />
                <span>{tr(currentDay.specialEvent)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
