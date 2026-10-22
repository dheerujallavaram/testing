import React from 'react';
import { Moon, AlertOctagon, Compass, CheckCircle2 } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface ChandraNavataraProps {
  day: DayData;
}

export const ChandraNavatara: React.FC<ChandraNavataraProps> = ({ day }) => {
  const { t, tr } = useLanguage();

  return (
    <div className="bg-white border border-amber-200/90 shadow-lg p-6 sm:p-8 rounded-2xl">
      <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-6">
        <h3 className="text-2xl text-amber-950 flex items-center gap-2.5 font-bold font-telugu">
          <Moon size={24} className="text-amber-600" />
          <span>{t('చంద్ర నవతార బలం & చంద్రాష్టమ వివరాలు', 'Chandra Navatara Balam & Chandrashtamam')}</span>
        </h3>
        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 font-telugu font-semibold">
          {t('గోచార చంద్ర బలం', 'Lunar Transit Strength')}
        </span>
      </div>

      <div className="space-y-6">
        {/* Chandra Sancharam */}
        <div className="border-l-4 border-amber-600 pl-4 sm:pl-5 py-1">
          <p className="text-amber-950 font-bold mb-1.5 text-lg font-telugu flex items-center gap-2">
            <Compass size={18} className="text-amber-700" />
            <span>{t('చంద్ర సంచారం (అనుకూల రాశులు)', 'Chandra Sancharam (Moon Transit & Favorable Rashis)')}</span>
          </p>
          <p className="text-slate-800 leading-relaxed font-telugu text-base">
            {tr(day.chandra.sancharam)}
          </p>
        </div>

        {/* Chandrashtamam Alert */}
        <div className="border-l-4 border-rose-600 bg-rose-50/70 p-4 sm:p-5 rounded-r-xl border-y border-r border-rose-200">
          <div className="flex items-center gap-2 text-rose-950 font-bold mb-1.5 text-lg font-telugu">
            <AlertOctagon size={20} className="text-rose-600 shrink-0" />
            <span>{t('చంద్రాష్టమం హెచ్చరిక', 'Chandrashtamam Caution (8th-House Moon)')}</span>
          </div>
          <p className="text-slate-900 leading-relaxed font-telugu text-base font-medium">
            {tr(day.chandra.chandrashtamam)}
          </p>
          <p className="text-xs text-rose-800 font-telugu mt-2">
            {t(
              'పరిహారం: చంద్రాష్టమ ప్రభావం తగ్గేందుకు శివ పంచాక్షరీ జపం (ఓం నమః శివాయ) లేదా దుర్గా స్తోత్రం పఠించండి.',
              'Remedy: Chant Shiva Panchakshari Mantra (Om Namah Shivaya) or Durga Stotram to pacify 8th-house lunar effects.'
            )}
          </p>
        </div>

        {/* Navatara Balam */}
        <div className="border-l-4 border-emerald-600 pl-4 sm:pl-5 py-1">
          <p className="text-emerald-950 font-bold mb-1.5 text-lg font-telugu flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>{t('నవతార బలం (శుభ నక్షత్రాలు)', 'Navatara Balam (Auspicious Star Harmony)')}</span>
          </p>
          <p className="text-slate-800 leading-relaxed font-telugu text-base">
            {tr(day.chandra.navataraBalam)}
          </p>
        </div>
      </div>
    </div>
  );
};
