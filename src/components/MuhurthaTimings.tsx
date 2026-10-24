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
      <div className="bg-white border-t-4 border-emerald-600 border-x border-b border-emerald-100 shadow-lg p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4 mb-6">
            <h3 className="text-2xl text-emerald-950 flex items-center gap-2.5 font-bold font-telugu">
              <Shield size={24} className="text-emerald-600" />
              <span>{t('శుభ సమయాలు (ముహూర్తాలు)', 'Auspicious Timings (Shubha Muhurtham)')}</span>
            </h3>
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-telugu font-semibold">
              {t('శుభ కార్యాలకు శ్రేష్ఠం', 'Best for Good Works')}
            </span>
          </div>

          <div className="space-y-4">
            {/* Abhijit Muhurtham */}
            <div className="border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 rounded-xl hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-base font-telugu">
                  <Sunrise size={18} className="text-emerald-600" />
                  <span>{t('అభిజిత్ ముహూర్తం', 'Abhijit Muhurtham (Midday Victory Window)')}</span>
                </p>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-telugu font-medium">
                  {t('అత్యుత్తమం', 'Most Auspicious')}
                </span>
              </div>
              <p className="text-base sm:text-lg leading-snug text-slate-900 font-bold font-telugu">
                {tr(day.shubha.abhijit)}
              </p>
              <p className="text-xs text-emerald-800 mt-1 font-telugu">
                {t(
                  'విజయ ముహూర్తం — సర్వ శుభ కార్యాలకు, నూతన ప్రారంభాలకు అనువైన సమయం.',
                  'Victory Muhurtham — Ideal for all auspicious activities and important new beginnings.'
                )}
              </p>
            </div>

            {/* Amrutha Ghadayalu */}
            <div className="border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 rounded-xl hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-base font-telugu">
                  <Sparkles size={18} className="text-emerald-600" />
                  <span>{t('అమృత ఘడియలు', 'Amrutha Ghadayalu (Nectar Period)')}</span>
                </p>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-telugu font-medium">
                  {t('అమృత కాలం', 'Amrutha Kalam')}
                </span>
              </div>
              <p className="text-base sm:text-lg leading-snug text-slate-900 font-bold font-telugu">
                {tr(day.shubha.amrutha)}
              </p>
              <p className="text-xs text-emerald-800 mt-1 font-telugu">
                {t(
                  'అమృత ఘడియలలో చేపట్టిన పనులు ఆటంకాలు లేకుండా పూర్తవుతాయి.',
                  'Tasks initiated during Amrutha Ghadayalu progress smoothly without obstacles.'
                )}
              </p>
            </div>

            {/* Brahma Muhurtham */}
            <div className="border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 rounded-xl hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-base font-telugu">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>{t('బ్రహ్మ ముహూర్తం', 'Brahma Muhurtham (Sacred Dawn)')}</span>
                </p>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-telugu font-medium">
                  {t('సాధనా కాలం', 'Spiritual Window')}
                </span>
              </div>
              <p className="text-base sm:text-lg leading-snug text-slate-900 font-bold font-telugu">
                {t(
                  'తెల్లవారుజామున 04:58 AM నుండి ఉదయం 05:46 AM వరకు',
                  'Early Morning 04:58 AM to Morning 05:46 AM'
                )}
              </p>
              <p className="text-xs text-emerald-800 mt-1 font-telugu">
                {t(
                  'జపం, ధ్యానం, దైవ ప్రార్థన మరియు విద్యాభ్యాసానికి పరమ పవిత్రమైన వేళ.',
                  'Sacred pre-dawn hours best suited for meditation, mantra japa, prayer, and study.'
                )}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-emerald-800 font-telugu bg-emerald-100/50 p-2.5 rounded-lg border border-emerald-200">
          {t(
            'గమనిక: అభిజిత్ ముహూర్తంలో రాహు కాల ప్రభావం శూన్యమవుతుంది.',
            'Note: Abhijit Muhurtham neutralizes minor planetary doshas during midday.'
          )}
        </p>
      </div>

      {/* Ashubha Samayalu Card */}
      <div className="bg-white border-t-4 border-rose-600 border-x border-b border-rose-100 shadow-lg p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6">
            <h3 className="text-2xl text-rose-950 flex items-center gap-2.5 font-bold font-telugu">
              <AlertTriangle size={24} className="text-rose-600" />
              <span>{t('అశుభ సమయాలు (వర్జించవలసినవి)', 'Inauspicious Timings (Times to Avoid)')}</span>
            </h3>
            <span className="text-xs px-2.5 py-1 bg-rose-50 text-rose-800 rounded-md border border-rose-200 font-telugu font-semibold">
              {t('పనులు వాయిదా వేయండి', 'Postpone New Starts')}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Rahukalam */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>{t('రాహు కాలం', 'Rahu Kalam')}</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">
                  {t('ప్రయాణాలు వద్దు', 'Avoid New Starts')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {tr(day.ashubha.rahukalam)}
              </p>
            </div>

            {/* Yamagandam */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <Ban size={16} className="text-rose-600" />
                  <span>{t('యమగండం', 'Yamagandam')}</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">
                  {t('ఆటంకాలు', 'Obstacles')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {tr(day.ashubha.yamagandam)}
              </p>
            </div>

            {/* Durmuhurtham */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>{t('దుర్ముహూర్తం', 'Durmuhurtham')}</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">
                  {t('నిషిద్ధం', 'Prohibited')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {tr(day.ashubha.durmuhurtham)}
              </p>
            </div>

            {/* Varjyam */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>{t('వర్జ్యం', 'Varjyam')}</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">
                  {t('విష ఘడియలు', 'Dosha Time')}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {tr(day.ashubha.varjyam)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-rose-800 font-telugu bg-rose-100/50 p-2.5 rounded-lg border border-rose-200">
          {t(
            'గమనిక: అత్యవసర సమయాలలో అభిజిత్ ముహూర్తాన్ని ఎంచుకోవచ్చు.',
            'Note: In urgent situations, Abhijit Muhurtham may be chosen.'
          )}
        </p>
      </div>
    </div>
  );
};
