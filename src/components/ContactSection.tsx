import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, Sparkles, CheckCircle } from 'lucide-react';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';

export const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('వివాహ ముహూర్తం');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(
      `నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు 🙏\n` +
      `నా పేరు / Name: ${name || 'భక్తుడు'}\n` +
      `ఫోన్ / Phone: ${phone}\n` +
      `విషయం / Purpose: ${purpose}\n` +
      `సందేశం / Message: ${message || 'సలహా కొరకు సంప్రదిస్తున్నాను.'}`
    );
    window.open(`https://wa.me/918977986166?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 font-telugu max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          {t('అధికారిక సంప్రదింపుల కేంద్రం', 'Official Devotee Helpdesk')}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-950">
          {t('శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి సంప్రదింపుల కేంద్రం', 'Consultation Center — Sri Jallavaram Sai Dheeraj Sharma')}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          {t(
            'మీ జీవిత సమస్యలకు శాస్త్రోక్త మార్గదర్శకత్వం, వివాహ/గృహప్రవేశ ముహూర్తాలు, పూజా కార్యక్రమాల కోసం నేరుగా సంప్రదించండి.',
            'Direct consultation with Sri Dheeraj Sharma for horoscope solutions, marriage/gruhapravesham muhurthams, and sacred homams.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Contact Cards */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* WhatsApp Direct Card */}
          <a
            href="https://wa.me/918977986166?text=%E0%B0%A8%E0%B0%AE%E0%B0%B8%E0%B1%8D%E0%B0%95%E0%B0%BE%E0%B0%B0%E0%B0%82%20%E0%B0%B6%E0%B1%8D%E0%B0%B0%E0%B1%80%20%E0%B0%9C%E0%B0%B2%E0%B1%8D%E0%B0%B2%E0%B0%B5%E0%B0%B0%E0%B0%82%20%E0%B0%B8%E0%B0%BE%E0%B0%AF%E0%B0%BF%20%E0%B0%A7%E0%B1%80%E0%B0%B0%E0%B0%9C%E0%B1%8D%20%E0%B0%B6%E0%B0%B0%E0%B1%8D%E0%B0%AE%20%E0%B0%97%E0%B0%BE%E0%B0%B0%E0%B1%81%2C%20%E0%B0%AA%E0%B1%82%E0%B0%9C%E0%B0%BE%20%E0%B0%B8%E0%B0%AE%E0%B0%BE%E0%B0%9A%E0%B0%BE%E0%B0%B0%E0%B0%82%20%E0%B0%95%E0%B1%8B%E0%B0%B8%E0%B0%82%20%E0%B0%B8%E0%B0%82%E0%B0%AA%E0%B1%8D%E0%B0%B0%E0%B0%A6%E0%B0%BF%E0%B0%B8%E0%B1%8D%E0%B0%A4%E0%B1%81%E0%B0%A8%E0%B1%8D%E0%B0%A8%E0%B0%BE%E0%B0%A8%E0%B1%81."
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle size={26} className="fill-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold block">
                  {t('అధికారిక వాట్సాప్ (WhatsApp)', 'Official Devotee WhatsApp')}
                </span>
                <span className="text-2xl font-mono font-bold tracking-wide">
                  8977986166
                </span>
                <span className="text-xs text-emerald-100 block mt-0.5">
                  {t('వెంటనే చాట్ ప్రారంభించండి →', 'Chat Directly on WhatsApp →')}
                </span>
              </div>
            </div>
          </a>

          {/* Phone Call Card */}
          <a
            href="tel:+918977986166"
            className="p-6 bg-white border border-amber-300 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">
                  {t('నేరుగా ఫోన్ చేయండి', 'Direct Phone Call')}
                </span>
                <span className="text-2xl font-mono font-bold text-amber-950 tracking-wide">
                  +91 8977986166
                </span>
                <span className="text-xs text-amber-700 block mt-0.5">
                  {t('శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు', 'Sri Jallavaram Sai Dheeraj Sharma')}
                </span>
              </div>
            </div>
          </a>

          {/* Address & Timings */}
          <div className="p-6 bg-white border border-amber-200 rounded-2xl shadow-md space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 text-sm block">
                  {t('కేంద్ర కార్యాలయం:', 'Headquarters / Ashram:')}
                </strong>
                <p className="text-slate-600 text-sm">
                  {t(
                    'పసుమాముల, హయత్‌నగర్ (Pasumamula, Hayathnagar), హైదరాబాద్.',
                    'Pasumamula, Hayathnagar, Hyderabad, Telangana & Tirupati, Andhra Pradesh.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-amber-100" data-nosnippet>
              <Clock size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 text-sm block">
                  {t('సంప్రదింపుల సమయాలు:', 'Consultation Hours:')}
                </strong>
                <p className="text-slate-600 text-sm">
                  {t(
                    'ఉదయం 06:30 AM నుండి రాత్రి 08:30 PM వరకు ప్రతిరోజూ',
                    'Daily: 06:30 AM to 08:30 PM IST (Worldwide Online Appointments Available)'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-amber-100">
              <Mail size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 text-sm block">
                  {t('ఈమెయిల్ సంప్రదింపు:', 'Email Inquiries:')}
                </strong>
                <a
                  href="mailto:astrologer@telugujyothisham.com"
                  className="text-amber-800 hover:text-amber-950 font-mono text-sm underline underline-offset-2"
                >
                  astrologer@telugujyothisham.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Consultation Form */}
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-amber-200 pb-3">
              <OmEmblem className="w-6 h-6 text-amber-700" size={24} />
              <h3 className="text-xl font-bold text-amber-950">
                {t('సత్వర సంప్రదింపు సందేశం', 'Direct Devotee Message Form')}
              </h3>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle size={48} className="text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-amber-950">
                  {t('వాట్సాప్ సందేశం పంపబడింది!', 'WhatsApp Inquiry Initiated!')}
                </h4>
                <p className="text-sm text-slate-600">
                  {t(
                    'ధీరజ్ శర్మ గారు మీ వివరాలను పరిశీలించి త్వరలోనే స్పందిస్తారు.',
                    'Sri Dheeraj Sharma will review your details and respond shortly.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('మరో సందేశం పంపండి', 'Send Another Message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    {t('మీ పేరు (Your Name):', 'Your Full Name:')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('మీ పూర్తి పేరు', 'Your Name')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    {t('మీ ఫోన్ / వాట్సాప్ నంబర్:', 'Mobile / WhatsApp Number:')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('10 అంకెల మొబైల్ నంబర్', '10-digit mobile number with country code')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    {t('సంప్రదింపు ఉద్దేశం:', 'Purpose of Consultation / Ritual:')}
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="వివాహ ముహూర్తం">{t('వివాహ ముహూర్తం (Marriage Muhurtham)', 'Marriage Muhurtham Calculation')}</option>
                    <option value="గృహప్రవేశ ముహూర్తం">{t('గృహప్రవేశ ముహూర్తం (Housewarming)', 'Gruhapravesham (Housewarming) Muhurtham')}</option>
                    <option value="శ్రీ చండీ హోమం">{t('శ్రీ చండీ మహా హోమం (Chandi Homam)', 'Sri Maha Chandi Homam')}</option>
                    <option value="శ్రీ లక్ష్మీ గణపతి హోమం">{t('శ్రీ లక్ష్మీ గణపతి హోమం (Lakshmi Ganapathi Homam)', 'Sri Lakshmi Ganapathi Homam')}</option>
                    <option value="జాతక విశ్లేషణ & దోష నివారణ">{t('జాతక విశ్లేషణ & దోష నివారణ (Horoscope Analysis)', 'Horoscope Reading & Dosha Remedies')}</option>
                    <option value="గృహ/వ్యాపార వాస్తు పరిశీలన">{t('గృహ/వ్యాపార వాస్తు పరిశీలన (Vastu Consultation)', 'Home & Business Vastu Consultation')}</option>
                    <option value="ఇతర పూజా కార్యక్రమాలు">{t('ఇతర పూజా కార్యక్రమాలు (Other Vedic Rituals)', 'Other Vedic Pooja / Yagnas')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    {t('సందేశం / ప్రశ్న:', 'Your Message or Question:')}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('మీకు కావలసిన వివరాలు ఇక్కడ తెలియజేయండి...', 'Briefly describe your requirements or query...')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-base shadow-lg transition-transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={18} />
                  <span>{t('వాట్సాప్‌లో ధీరజ్ శర్మ గారికి పంపండి (8977986166)', 'Send to Sri Dheeraj Sharma on WhatsApp')}</span>
                </button>
              </form>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            {t(
              '🔒 మీ గోప్యత గౌరవించబడుతుంది. సమాచారం కేవలం శాస్త్రోక్త పరిశీలన కొరకే వినియోగించబడుతుంది.',
              '🔒 Confidential & Sacred: Your details are kept strictly private for astrological purposes only.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
