import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { OmEmblem } from './OmEmblem';

export interface FooterProps {
  onSelectCity?: (citySlug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity }) => {
  return (
    <footer className="bg-amber-950 text-amber-100/90 pt-14 pb-8 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 pb-10 border-b border-amber-900/80">
          {/* Col 1: Temple info */}
          <div>
            <h4 className="text-xl font-bold font-telugu text-white flex items-center gap-2.5 mb-3">
              <OmEmblem className="w-8 h-8 shrink-0" size={32} />
              <span>శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం</span>
            </h4>
            <p className="text-sm font-telugu text-amber-200/80 leading-relaxed mb-3">
              వేద పండితులు, జ్యోతిష నిపుణులు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి నేతృత్వంలో ప్రాచీన వేద గణిత సిద్ధాంతాల ప్రకారం రోజువారీ పంచాంగం మరియు జ్యోతిష సేవలు అందించబడును.
            </p>
            <a
              href="https://telugujyothisham.com"
              className="inline-block text-xs font-mono font-bold text-amber-300 hover:text-white underline underline-offset-4 mb-2"
            >
              www.telugujyothisham.com
            </a>
            <p className="text-xs font-display tracking-widest uppercase text-amber-400">
              Vedic Almanac &amp; Astrological Research
            </p>
          </div>

          {/* Col 2: Services & Timings */}
          <div>
            <h4 className="text-base font-bold font-telugu text-white mb-3 flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              <span>జ్యోతిషాలయ సమయాలు & సేవలు</span>
            </h4>
            <ul className="text-sm font-telugu space-y-2 text-amber-200/80">
              <li>ఉదయం: 06:30 AM నుండి 12:30 PM వరకు</li>
              <li>సాయంత్రం: 04:30 PM నుండి 08:30 PM వరకు</li>
              <li className="pt-2 text-xs text-amber-300">
                • జాతక పరిశీలన, వివాహ పొంతన, నవగ్రహ శాంతి, వాస్తు సలహాలు
              </li>
              <li className="text-xs text-amber-300">
                • సంపూర్ణ గృహప్రవేశ మరియు వైదిక హోమ క్రతువులు
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Devotee Desk */}
          <div>
            <h4 className="text-base font-bold font-telugu text-white mb-3 flex items-center gap-2">
              <Phone size={16} className="text-amber-400" />
              <span>సంప్రదించవలసిన వివరాలు</span>
            </h4>
            <div className="text-sm font-telugu space-y-3 text-amber-200/90">
              <a
                href={`https://wa.me/918977986166?text=${encodeURIComponent('నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, పూజ / జ్యోతిష వివరాల కోసం సంప్రదిస్తున్నాను.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 rounded-xl text-emerald-200 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  💬
                </div>
                <div>
                  <span className="text-xs text-emerald-300 block font-semibold">వాట్సాప్ సంప్రదింపులు</span>
                  <span className="font-mono text-base font-bold text-white tracking-wide">8977986166</span>
                </div>
              </a>

              <a
                href="tel:+918977986166"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone size={16} className="text-amber-400 shrink-0" />
                <span>ఫోన్ కాల్: <strong className="font-mono text-amber-200 font-semibold tracking-wide">+91 8977986166</strong></span>
              </a>

              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>పసుమాముల, హయత్‌నగర్, హైదరాబాద్</span>
              </p>

              <a
                href="mailto:astrologer@telugujyothisham.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span className="font-mono text-xs text-amber-300">astrologer@telugujyothisham.com</span>
              </a>
            </div>
          </div>
        </div>



        {/* Shloka and Dedication */}
        <div className="pt-8 text-center space-y-3 font-telugu">
          <p className="text-base sm:text-lg font-bold text-amber-300">
            సర్వేజనా సుఖినోభవంతు · లోకాః సమస్తాః సుఖినోభవంతు
          </p>
          <p className="text-xs sm:text-sm text-amber-200/70">
            సమర్పణ: <strong>జల్లవరం సాయి ధీరజ్ శర్మ</strong>
          </p>
          <p className="text-[11px] text-amber-400/60 max-w-2xl mx-auto leading-normal">
            గమనిక: ఈ సమయాలు ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రాంతాలకు సంబంధించిన ప్రామాణిక సూర్యోదయ గణనలు. ప్రాంతీయ అక్షాంశ, రేఖాంశాలను బట్టి కొన్ని నిమిషాల వ్యత్యాసం ఉండవచ్చు. శుభ కార్యాల కోసం శ్రీ ధీరజ్ శర్మ గారి సలహా తప్పనిసరి.
          </p>
        </div>
      </div>
    </footer>
  );
};
