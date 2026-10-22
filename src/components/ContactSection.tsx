import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, Sparkles, CheckCircle } from 'lucide-react';
import { OmEmblem } from './OmEmblem';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('వివాహ ముహూర్తం');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(
      `నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు 🙏\n` +
      `నా పేరు: ${name || 'భక్తుడు'}\n` +
      `ఫోన్: ${phone}\n` +
      `విషయం: ${purpose}\n` +
      `సందేశం: ${message || 'సలహా కొరకు సంప్రదిస్తున్నాను.'}`
    );
    window.open(`https://wa.me/918977986166?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 font-telugu max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
          Official Devotee Helpdesk
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-950">
          శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి సంప్రదింపుల కేంద్రం
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          మీ జీవిత సమస్యలకు శాస్త్రోక్త మార్గదర్శకత్వం, వివాహ/గృహప్రవేశ ముహూర్తాలు, పూజా కార్యక్రమాల కోసం నేరుగా సంప్రదించండి.
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
                  అధికారిక వాట్సాప్ (WhatsApp)
                </span>
                <span className="text-2xl font-mono font-bold tracking-wide">
                  8977986166
                </span>
                <span className="text-xs text-emerald-100 block mt-0.5">
                  వెంటనే చాట్ ప్రారంభించండి →
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
                  నేరుగా ఫోన్ చేయండి
                </span>
                <span className="text-2xl font-mono font-bold text-amber-950 tracking-wide">
                  +91 8977986166
                </span>
                <span className="text-xs text-amber-700 block mt-0.5">
                  శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
                </span>
              </div>
            </div>
          </a>

          {/* Address & Timings */}
          <div className="p-6 bg-white border border-amber-200 rounded-2xl shadow-md space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 text-sm block">కేంద్ర కార్యాలయం:</strong>
                <p className="text-slate-600 text-sm">
                  పసుమాముల, హయత్‌నగర్ (Pasumamula, Hayathnagar), హైదరాబాద్.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-amber-100">
              <Clock size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 text-sm block">సంప్రదింపుల సమయాలు:</strong>
                <p className="text-slate-600 text-sm">
                  ఉదయం 06:30 AM నుండి రాత్రి 08:30 PM వరకు ప్రతిరోజూ
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-amber-100">
              <Mail size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 text-sm block">ఈమెయిల్ సంప్రదింపు:</strong>
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
                సత్వర సంప్రదింపు సందేశం
              </h3>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle size={48} className="text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-amber-950">
                  వాట్సాప్ సందేశం పంపబడింది!
                </h4>
                <p className="text-sm text-slate-600">
                  ధీరజ్ శర్మ గారు మీ వివరాలను పరిశీలించి త్వరలోనే స్పందిస్తారు.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold"
                >
                  మరో సందేశం పంపండి
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    మీ పేరు (Your Name):
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="మీ పూర్తి పేరు"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    మీ ఫోన్ / వాట్సాప్ నంబర్:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10 అంకెల మొబైల్ నంబర్"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    సంప్రదింపు ఉద్దేశం:
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="వివాహ ముహూర్తం">వివాహ ముహూర్తం (Marriage Muhurtham)</option>
                    <option value="గృహప్రవేశ ముహూర్తం">గృహప్రవేశ ముహూర్తం (Housewarming)</option>
                    <option value="శ్రీ చండీ హోమం">శ్రీ చండీ మహా హోమం (Chandi Homam)</option>
                    <option value="శ్రీ లక్ష్మీ గణపతి హోమం">శ్రీ లక్ష్మీ గణపతి హోమం (Lakshmi Ganapathi Homam)</option>
                    <option value="జాతక విశ్లేషణ & దోష నివారణ">జాతక విశ్లేషణ & దోష నివారణ (Horoscope Analysis)</option>
                    <option value="గృహ/వ్యాపార వాస్తు పరిశీలన">గృహ/వ్యాపార వాస్తు పరిశీలన (Vastu Consultation)</option>
                    <option value="ఇతర పూజా కార్యక్రమాలు">ఇతర పూజా కార్యక్రమాలు (Other Vedic Rituals)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    సందేశం / ప్రశ్న:
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="మీకు కావలసిన వివరాలు ఇక్కడ తెలియజేయండి..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-base shadow-lg transition-transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={18} />
                  <span>వాట్సాప్‌లో ధీరజ్ శర్మ గారికి పంపండి (8977986166)</span>
                </button>
              </form>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            🔒 మీ గోప్యత గౌరవించబడుతుంది. సమాచారం కేవలం శాస్త్రోక్త పరిశీలన కొరకే వినియోగించబడుతుంది.
          </p>
        </div>
      </div>
    </div>
  );
};
