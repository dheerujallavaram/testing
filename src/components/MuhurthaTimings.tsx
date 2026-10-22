import React from 'react';
import { Shield, AlertTriangle, Sunrise, Sparkles, Ban, CheckCircle2 } from 'lucide-react';
import { DayData } from '../types/panchangam';

interface MuhurthaTimingsProps {
  day: DayData;
}

export const MuhurthaTimings: React.FC<MuhurthaTimingsProps> = ({ day }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Shubha Samayalu Card */}
      <div className="bg-white border-t-4 border-emerald-600 border-x border-b border-emerald-100 shadow-lg p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4 mb-6">
            <h3 className="text-2xl text-emerald-950 flex items-center gap-2.5 font-bold font-telugu">
              <Shield size={24} className="text-emerald-600" />
              <span>శుభ సమయాలు (ముహూర్తాలు)</span>
            </h3>
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-telugu font-semibold">
              శుభ కార్యాలకు శ్రేష్ఠం
            </span>
          </div>

          <div className="space-y-4">
            {/* Abhijit Muhurtham */}
            <div className="border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 rounded-xl hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-base font-telugu">
                  <Sunrise size={18} className="text-emerald-600" />
                  <span>అభిజిత్ ముహూర్తం</span>
                </p>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-telugu font-medium">
                  అత్యుత్తమం
                </span>
              </div>
              <p className="text-base sm:text-lg leading-snug text-slate-900 font-bold font-telugu">
                {day.shubha.abhijit}
              </p>
              <p className="text-xs text-emerald-800 mt-1 font-telugu">
                విజయ ముహూర్తం — సర్వ శుభ కార్యాలకు, నూతన ప్రారంభాలకు అనువైన సమయం.
              </p>
            </div>

            {/* Amrutha Ghadayalu */}
            <div className="border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 rounded-xl hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-base font-telugu">
                  <Sparkles size={18} className="text-emerald-600" />
                  <span>అమృత ఘడియలు</span>
                </p>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-telugu font-medium">
                  అమృత కాలం
                </span>
              </div>
              <p className="text-base sm:text-lg leading-snug text-slate-900 font-bold font-telugu">
                {day.shubha.amrutha}
              </p>
              <p className="text-xs text-emerald-800 mt-1 font-telugu">
                అమృత ఘడియలలో చేపట్టిన పనులు ఆటంకాలు లేకుండా పూర్తవుతాయి.
              </p>
            </div>

            {/* Brahma Muhurtham */}
            <div className="border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 rounded-xl hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="flex items-center gap-2 text-emerald-900 font-bold text-base font-telugu">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>బ్రహ్మ ముహూర్తం</span>
                </p>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-telugu font-medium">
                  సాధనా కాలం
                </span>
              </div>
              <p className="text-base sm:text-lg leading-snug text-slate-900 font-bold font-telugu">
                తెల్లవారుజామున 04:58 AM నుండి ఉదయం 05:46 AM వరకు
              </p>
              <p className="text-xs text-emerald-800 mt-1 font-telugu">
                జపం, ధ్యానం, దైవ ప్రార్థన మరియు విద్యాభ్యాసానికి పరమ పవిత్రమైన వేళ.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-emerald-800 font-telugu bg-emerald-100/50 p-2.5 rounded-lg border border-emerald-200">
          గమనిక: అభిజిత్ ముహూర్తంలో రాహు కాల ప్రభావం శూన్యమవుతుంది.
        </p>
      </div>

      {/* Ashubha Samayalu Card */}
      <div className="bg-white border-t-4 border-rose-600 border-x border-b border-rose-100 shadow-lg p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6">
            <h3 className="text-2xl text-rose-950 flex items-center gap-2.5 font-bold font-telugu">
              <AlertTriangle size={24} className="text-rose-600" />
              <span>అశుభ సమయాలు (వర్జించవలసినవి)</span>
            </h3>
            <span className="text-xs px-2.5 py-1 bg-rose-50 text-rose-800 rounded-md border border-rose-200 font-telugu font-semibold">
              పనులు వాయిదా వేయండి
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Rahukalam */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>రాహు కాలం</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">ప్రయాణాలు వద్దు</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {day.ashubha.rahukalam}
              </p>
            </div>

            {/* Yamagandam */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>యమగండం</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">ఆటంకాలు</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {day.ashubha.yamagandam}
              </p>
            </div>

            {/* Durmuhurtham */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>దుర్ముహూర్తం</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">ప్రారంభాలు వద్దు</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {day.ashubha.durmuhurtham}
              </p>
            </div>

            {/* Varjyam */}
            <div className="border border-rose-200 bg-rose-50/60 p-3.5 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <p className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-telugu">
                  <Ban size={16} className="text-rose-600" />
                  <span>వర్జ్యం</span>
                </p>
                <span className="text-[10px] text-rose-800 font-medium font-telugu">విష ఘడియలు</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-telugu">
                {day.ashubha.varjyam}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-rose-800 font-telugu bg-rose-100/50 p-2.5 rounded-lg border border-rose-200">
          శాస్త్ర సలహా: ఈ సమయాలలో ముఖ్యమైన ఆర్థిక లావాదేవీలు, కొత్త పనులు మరియు ప్రయాణాలు ప్రారంభించకపోవడం మంచిది.
        </p>
      </div>
    </div>
  );
};
