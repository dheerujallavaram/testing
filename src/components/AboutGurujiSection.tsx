import React from 'react';
import { Award, BookOpen, Flame, MapPin, Phone, MessageCircle, Mail, CheckCircle, ShieldCheck } from 'lucide-react';
import { OmEmblem } from './OmEmblem';

interface AboutGurujiSectionProps {
  onOpenBooking: () => void;
}

export const AboutGurujiSection: React.FC<AboutGurujiSectionProps> = ({ onOpenBooking }) => {
  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, మీ మార్గదర్శకత్వం కోసం సంప్రదిస్తున్నాను.'
  )}`;

  return (
    <div className="space-y-12 font-telugu max-w-5xl mx-auto py-4">
      {/* Bio Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-amber-600/50 flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0 text-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-xl mx-auto">
            <div className="w-full h-full rounded-full overflow-hidden border border-amber-300 bg-amber-950">
              <img
                src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
                alt="శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <span className="inline-block mt-3 px-3 py-1 bg-amber-800 text-amber-200 text-xs rounded-full border border-amber-600 font-semibold">
            వైదిక పండితులు & ప్రముఖ జ్యోతిష్యులు
          </span>
        </div>

        <div className="space-y-3.5 text-center md:text-left">
          <span className="text-amber-300 text-xs uppercase tracking-widest font-semibold block">
            Vedic Scholar & Astrologer Profile
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
          </h2>
          <p className="text-amber-200 font-medium text-sm sm:text-base leading-relaxed">
            స్మార్త వైదిక ప్రవీణులు, ప్రముఖ జ్యోతిష నిపుణులు. ప్రాచీన గురుకుల వేద సంప్రదాయంలో శిక్షణ పొంది, వేద మంత్రోచ్ఛారణతో యజ్ఞ యాగాదులు, శుభ ముహూర్త నిర్ణయం మరియు జాతక పరిశీలనలో సుదీర్ఘ అనుభవం కలిగిన ప్రముఖులు.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start text-xs sm:text-sm">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl transition-transform hover:scale-105"
            >
              <MessageCircle size={16} />
              <span>వాట్సాప్: 8977986166</span>
            </a>
            <a
              href="tel:+918977986166"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white font-semibold rounded-xl border border-amber-600 transition-colors"
            >
              <Phone size={15} />
              <span>కాల్: 8977986166</span>
            </a>
          </div>
        </div>
      </div>

      {/* Pillars of Tradition */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-md">
          <BookOpen size={28} className="text-amber-700 mb-3" />
          <h3 className="text-lg font-bold text-amber-950 mb-2">వేద గురుపరంపర</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            తరతరాల పూర్వీకుల వేద సంస్కృతిని పుణికిపుచ్చుకుని, ప్రామాణిక గ్రంథాల అధ్యయనంతో సమస్త క్రతువులను శాస్త్రోక్తంగా నిర్వహించే గురుపీఠం.
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-md">
          <Flame size={28} className="text-amber-700 mb-3" />
          <h3 className="text-lg font-bold text-amber-950 mb-2">హోమ యజ్ఞ క్రతువులు</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            శ్రీ చండీ సప్తశతి, లక్ష్మీ గణపతి, సుదర్శన, మృత్యుంజయ మహా హోమాలను నిర్దుష్టమైన వైదిక స్వర విన్యాసంతో జరిపించి సంపూర్ణ ఫలాన్ని చేకూర్చుతారు.
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-md">
          <Award size={28} className="text-amber-700 mb-3" />
          <h3 className="text-lg font-bold text-amber-950 mb-2">నిష్కళంక జ్యోతిషం</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            మూఢనమ్మకాలు లేకుండా, దృక్సిద్ధాంత ఖగోళ గణితం ఆధారంగా జాతక పరిశీలన, వివాహ పొంతన మరియు పరిహారాలను మాత్రమే సూచిస్తారు.
          </p>
        </div>
      </div>

      {/* Devotee Commitment */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-xl font-bold text-amber-950">
            మీ కుటుంబ శుభకార్యం కోసం గురువుగారిని సంప్రదించండి
          </h4>
          <p className="text-sm text-slate-700 max-w-xl leading-relaxed">
            వివాహం, గృహప్రవేశం లేదా హోమ క్రతువుల కొరకు ముందస్తుగా తేదీలు నమోదు చేసుకోగలరు.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenBooking}
          className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
        >
          పూజ సంకల్ప బుకింగ్
        </button>
      </div>
    </div>
  );
};
