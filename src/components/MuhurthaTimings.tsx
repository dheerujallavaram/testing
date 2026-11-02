import React from 'react';
import { Shield, AlertTriangle, Sunrise, Sparkles, Ban, CheckCircle2 } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface MuhurthaTimingsProps {
  day: DayData;
}

export const MuhurthaTimings: React.FC<MuhurthaTimingsProps> = ({ day }) => {
  const { t, tr } = useLanguage();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Shubha Samayalu Card */}
      <div className="bg-gradient-to-br from-emerald-50/95 via-white to-teal-50/80 border-2 border-emerald-400/70 p-6 sm:p-8 rounded-3xl shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between border-b-2 border-emerald-200/70 pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block">
                {t('శుభ కార్యాలకు శ్రేష్ఠం • Auspicious Windows', 'Auspicious Windows')}
              </span>
              <h3 className="text-xl sm:text-2xl text-emerald-950 flex items-center gap-2.5 font-bold font-telugu mt-0.5">
                <Shield size={24} className="text-emerald-600 shrink-0" />
                <span>{t('శుభ సమయాలు & శుభ ముహూర్తాలు (Shubha Muhurtham)', 'Shubha Muhurtham & Auspicious Timings')}</span>
              </h3>
            </div>
            <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold font-telugu border border-emerald-300 shrink-0">
              {t('శుభప్రదం', 'Auspicious')}
            </span>
          </div>

          <div className="space-y-4">
            {/* Abhijit Muhurtham */}
            <div className="bg-white/95 border border-emerald-300/80 p-4 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base font-telugu">
                  <Sunrise size={18} className="text-emerald-600" />
                  <span>{t('అభిజిత్ ముహూర్తం', 'Abhijit Muhurtham (Midday Victory Window)')}</span>
                </p>
                <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-telugu font-bold">
                  {t('అత్యుత్తమం', 'Most Auspicious')}
                </span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-emerald-950 font-bold font-telugu">
                {tr(day.shubha.abhijit)}
              </p>
              <p className="text-xs text-slate-600 mt-1 font-telugu">
                {t(
                  'విజయ ముహూర్తం — సర్వ శుభ కార్యాలకు, నూతన ప్రారంభాలకు అనువైన సమయం.',
                  'Victory Muhurtham — Ideal for all auspicious activities and important new beginnings.'
                )}
              </p>
            </div>

            {/* Amrutha Ghadayalu */}
            <div className="bg-white/95 border border-emerald-300/80 p-4 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base font-telugu">
                  <Sparkles size={18} className="text-emerald-600" />
                  <span>{t('అమృత ఘడియలు', 'Amrutha Ghadayalu (Nectar Period)')}</span>
                </p>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-telugu font-semibold">
                  {t('అమృత కాలం', 'Amrutha Kalam')}
                </span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-emerald-950 font-bold font-telugu">
                {tr(day.shubha.amrutha)}
              </p>
              <p className="text-xs text-slate-600 mt-1 font-telugu">
                {t(
                  'అమృత ఘడియలలో చేపట్టిన పనులు ఆటంకాలు లేకుండా పూర్తవుతాయి.',
                  'Tasks initiated during Amrutha Ghadayalu progress smoothly without obstacles.'
                )}
              </p>
            </div>

            {/* Brahma Muhurtham */}
            <div className="bg-white/95 border border-emerald-300/80 p-4 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base font-telugu">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>{t('బ్రహ్మ ముహూర్తం', 'Brahma Muhurtham (Sacred Dawn)')}</span>
                </p>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-telugu font-semibold">
                  {t('సాధనా కాలం', 'Spiritual Window')}
                </span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-emerald-950 font-bold font-telugu">
                {t(
                  'తెల్లవారుజామున 04:58 AM నుండి ఉదయం 05:46 AM వరకు',
                  'Early Morning 04:58 AM to Morning 05:46 AM'
                )}
              </p>
              <p className="text-xs text-slate-600 mt-1 font-telugu">
                {t(
                  'జపం, ధ్యానం, దైవ ప్రార్థన మరియు విద్యాభ్యాసానికి పరమ పవిత్రమైన వేళ.',
                  'Sacred pre-dawn hours best suited for meditation, mantra japa, prayer, and study.'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-emerald-200/80 text-xs text-emerald-800 font-telugu">
          ✨{' '}
          {t(
            'గమనిక: అభిజిత్ ముహూర్తంలో రాహు కాల ప్రభావం శూన్యమవుతుంది.',
            'Note: Abhijit Muhurtham neutralizes minor planetary doshas during midday.'
          )}
        </div>
      </div>

      {/* Ashubha Samayalu Card */}
      <div className="bg-gradient-to-br from-rose-50/95 via-white to-orange-50/80 border-2 border-rose-400/70 p-6 sm:p-8 rounded-3xl shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between border-b-2 border-rose-200/70 pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-700 block">
                {t('పనులు వాయిదా వేయండి • Inauspicious Windows', 'Inauspicious Windows')}
              </span>
              <h3 className="text-xl sm:text-2xl text-rose-950 flex items-center gap-2.5 font-bold font-telugu mt-0.5">
                <AlertTriangle size={24} className="text-rose-600 shrink-0" />
                <span>{t('అశుభ సమయాలు (వర్జించవలసినవి)', 'Inauspicious Timings (Times to Avoid)')}</span>
              </h3>
            </div>
            <span className="text-xs px-3 py-1 bg-rose-100 text-rose-900 rounded-full font-bold font-telugu border border-rose-300 shrink-0">
              {t('జాగ్రత్త', 'Caution')}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Rahukalam */}
            <div className="bg-white/95 border border-rose-300/80 p-3.5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>{t('రాహు కాలం', 'Rahu Kalam')}</span>
                </p>
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-semibold font-telugu">
                  {t('ప్రయాణాలు వద్దు', 'Avoid New Starts')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-rose-950 font-telugu">
                {tr(day.ashubha.rahukalam)}
              </p>
            </div>

            {/* Yamagandam */}
            <div className="bg-white/95 border border-rose-300/80 p-3.5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <Ban size={16} className="text-rose-600" />
                  <span>{t('యమగండం', 'Yamagandam')}</span>
                </p>
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-semibold font-telugu">
                  {t('ఆటంకాలు', 'Obstacles')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-rose-950 font-telugu">
                {tr(day.ashubha.yamagandam)}
              </p>
            </div>

            {/* Durmuhurtham */}
            <div className="bg-white/95 border border-rose-300/80 p-3.5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>{t('దుర్ముహూర్తం', 'Durmuhurtham')}</span>
                </p>
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-semibold font-telugu">
                  {t('నిషిద్ధం', 'Prohibited')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-rose-950 font-telugu">
                {tr(day.ashubha.durmuhurtham)}
              </p>
            </div>

            {/* Varjyam */}
            <div className="bg-white/95 border border-rose-300/80 p-3.5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>{t('వర్జ్యం', 'Varjyam')}</span>
                </p>
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-semibold font-telugu">
                  {t('విష ఘడియలు', 'Dosha Time')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-rose-950 font-telugu">
                {tr(day.ashubha.varjyam)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-rose-200/80 text-xs text-rose-800 font-telugu">
          ⚠️{' '}
          {t(
            'గమనిక: అత్యవసర సమయాలలో అభిజిత్ ముహూర్తాన్ని ఎంచుకోవచ్చు.',
            'Note: In urgent situations, Abhijit Muhurtham may be chosen.'
          )}
        </div>
      </div>
    </div>
  );
};
