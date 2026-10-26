import React from 'react';
import { ShieldCheck, FileText, AlertCircle, X, Lock, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type LegalDocType = 'privacy' | 'terms' | 'disclaimer';

interface LegalComplianceModalProps {
  activeDoc: LegalDocType | null;
  onClose: () => void;
  onSelectDoc: (doc: LegalDocType) => void;
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  activeDoc,
  onClose,
  onSelectDoc,
}) => {
  const { t } = useLanguage();

  if (!activeDoc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-telugu"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="bg-[#faf7f2] border-2 border-amber-400 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-600/50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={22} className="text-amber-400 shrink-0" />
            <div>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-bold text-amber-100">
                {activeDoc === 'privacy' && t('గోప్యతా విధానం (Privacy Policy)', 'Privacy Policy')}
                {activeDoc === 'terms' && t('నిబంధనలు & షరతులు (Terms & Conditions)', 'Terms & Conditions')}
                {activeDoc === 'disclaimer' && t('జ్యోతిష్య గమనిక (Disclaimer)', 'Astrological & Website Disclaimer')}
              </h2>
              <p className="text-xs text-amber-300/80 font-sans">
                శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • www.telugujyothisham.com
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-800/80 hover:bg-amber-700 text-amber-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-amber-100/70 border-b border-amber-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => onSelectDoc('privacy')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeDoc === 'privacy'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-50'
            }`}
          >
            <Lock size={14} />
            <span>Privacy Policy (గోప్యతా విధానం)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDoc('terms')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeDoc === 'terms'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-50'
            }`}
          >
            <FileText size={14} />
            <span>Terms &amp; Conditions (నిబంధనలు)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDoc('disclaimer')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeDoc === 'disclaimer'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-50'
            }`}
          >
            <AlertCircle size={14} />
            <span>Disclaimer (గమనిక)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
          {activeDoc === 'privacy' && (
            <article className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="font-bold text-amber-950">
                  Effective Date: October 2026 | Website: https://telugujyothisham.com
                </p>
                <p className="text-slate-700 mt-1">
                  శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (Sreelakshmi Ganapathi Astrology Centre - telugujyothisham.com) నందు భక్తులు మరియు సందర్శకుల వ్యక్తిగత గోప్యతకు మేము అత్యంత ప్రాధాన్యతనిస్తాము.
                </p>
              </div>

              <h3 className="text-base font-bold text-amber-950">1. Information We Collect (మేము సేకరించే వివరాలు)</h3>
              <p>
                When you visit <strong>telugujyothisham.com</strong> to view the Daily Telugu Panchangam (నేటి పంచాంగం), Rashi Phalalu, or use our Vedic calculators (such as 36-Point Vivaha Pontana and Naama Nakshatra Finder), no personal registration is required. If you voluntarily contact Guruji Sri Jallavaram Sai Dheeraj Sharma for Pooja Booking, Homam Sankalpam, or Horoscope Consultation via WhatsApp or our booking form, we only collect the details you provide (such as Name, Gotram, Nakshatram, Birth Date/Time, and Contact Number) solely to perform your requested Vedic service.
              </p>

              <h3 className="text-base font-bold text-amber-950">2. Google AdSense &amp; Cookies Policy (కుకీలు &amp; ప్రకటనల విధానం)</h3>
              <p>
                We may use third-party advertising companies, including <strong>Google AdSense</strong>, to serve ads when you visit our website.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to <strong>telugujyothisham.com</strong> or other websites on the internet.
                </li>
                <li>
                  Google&apos;s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 underline font-semibold"
                  >
                    Google Ads Settings
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 underline font-semibold"
                  >
                    www.aboutads.info
                  </a>.
                </li>
              </ul>

              <h3 className="text-base font-bold text-amber-950">3. Log Files &amp; Analytics</h3>
              <p>
                Like most standard websites, telugujyothisham.com utilizes standard server log files (browser type, ISP, date/time stamp, referring/exit pages) to improve site performance, mobile responsiveness, and user experience for global Telugu devotees.
              </p>

              <h3 className="text-base font-bold text-amber-950">4. Data Security (డేటా భద్రత)</h3>
              <p>
                భక్తులు పూజా సంకల్పం లేదా జాతక పరిశీలన కొరకు పంపే జన్మ వివరాలు పూర్తిగా గోప్యంగా ఉంచబడతాయి. మేము మీ ఫోన్ నంబర్ లేదా వ్యక్తిగత వివరాలను ఎట్టి పరిస్థితులలోనూ ఇతరులకు విక్రయించము లేదా షేర్ చేయము.
              </p>
            </article>
          )}

          {activeDoc === 'terms' && (
            <article className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="font-bold text-amber-950">
                  Terms of Use for https://telugujyothisham.com
                </p>
                <p className="text-slate-700 mt-1">
                  ఈ వెబ్‌సైట్‌ను ఉపయోగించడం ద్వారా దిగువ పేర్కొన్న నిబంధనలకు మీరు అంగీకరిస్తున్నారు.
                </p>
              </div>

              <h3 className="text-base font-bold text-amber-950">1. Purpose of Content (వెబ్‌సైట్ ఉద్దేశ్యం)</h3>
              <p>
                All daily Panchangam timings (Tithi, Nakshatram, Yogam, Karanam, Rahu Kalam, Yamagandam, Varjyam, Amrutha Gadiyalu), Rashi Phalalu, Vivaha Pontana calculations, and Vedic articles published on <strong>telugujyothisham.com</strong> are prepared according to classical Drik Siddhanta and Vedic astrological treatises for spiritual, cultural, and educational guidance.
              </p>

              <h3 className="text-base font-bold text-amber-950">2. Intellectual Property Rights (కాపీరైట్ హక్కులు)</h3>
              <p>
                All content, Telugu Panchangam tables, classical Nakshatra analyses, software calculators, and branding related to <strong>శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</strong> are the intellectual property of telugujyothisham.com. Devotees are welcome to share daily Panchangam status images and WhatsApp links for personal and devotional use with proper attribution.
              </p>

              <h3 className="text-base font-bold text-amber-950">3. Pooja &amp; Muhurtham Consultations</h3>
              <p>
                వివాహం, గృహప్రవేశం, శంకుస్థాపన, చండీ హోమం, లక్ష్మీ గణపతి హోమం మొదలైన వైదిక కార్యక్రమాల కొరకు బుకింగ్ చేసుకునే భక్తులు నేరుగా గురువుగారి అధికారిక వాట్సాప్ (+91 8977986166) ద్వారా సంప్రదించి సమయాన్ని నిర్ధారించుకోగలరు.
              </p>
            </article>
          )}

          {activeDoc === 'disclaimer' && (
            <article className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="font-bold text-amber-950">
                  Vedic Astrological &amp; Panchangam Disclaimer (ముఖ్య గమనిక)
                </p>
              </div>

              <h3 className="text-base font-bold text-amber-950">1. Regional Sunrise &amp; Coordinate Variations</h3>
              <p>
                ఈ వెబ్‌సైట్‌లోని రోజువారీ పంచాంగ సమయాలు (తిథి, నక్షత్రం, రాహుకాలం, వర్జ్యం, లగ్న ప్రమాణాలు) ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రామాణిక సూర్యోదయ గణనల ఆధారంగా ఇవ్వబడ్డాయి. మీరు నివసించే నగరం లేదా దేశం (USA, UK, Australia, Canada మొదలైనవి) యొక్క అక్షాంశ, రేఖాంశాలను బట్టి కొన్ని నిమిషాల వ్యత్యాసం ఉండవచ్చు.
              </p>

              <h3 className="text-base font-bold text-amber-950">2. Spiritual &amp; Advisory Nature of Astrology</h3>
              <p>
                Vedic Astrology (జ్యోతిష్య శాస్త్రం), Rashi Phalalu, compatibility scores (Guna Milan), and remedial rituals (Dosha Pariharalu) are based on ancient Hindu Shastras and faith. While every effort is made by <strong>Sri Jallavaram Sai Dheeraj Sharma Garu</strong> to ensure astronomical and shastric accuracy, astrological guidance should not be used as a substitute for professional medical, legal, or financial advice.
              </p>
            </article>
          )}

          {/* Official Contact Footer inside Legal Document (Required for AdSense Transparency) */}
          <div className="bg-white border border-amber-300 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-amber-950 text-xs sm:text-sm uppercase tracking-wider">
              Publisher &amp; Grievance Contact Details (సంప్రదించవలసిన చిరునామా):
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-700 pt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} className="text-amber-700" />
                Pasumamula, Hayathnagar, Hyderabad, Telangana, India
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone size={14} className="text-amber-700" />
                +91 8977986166
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail size={14} className="text-amber-700" />
                astrologer@telugujyothisham.com
              </span>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 py-3.5 bg-amber-100/60 border-t border-amber-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors"
          >
            {t('మూసివేయండి (Close)', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
