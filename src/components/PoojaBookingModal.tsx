import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, User, Phone, MapPin, Sparkles, Send } from 'lucide-react';
import { POOJA_SERVICES, ALL_RASHIS, NAKSHATRAS } from '../data/panchangamData';
import { PoojaService, BookingSubmission } from '../types/panchangam';
import { OmEmblem } from './OmEmblem';
import { auth, createBookingRecordInFirestore } from '../firebase';

interface PoojaBookingModalProps {
  isOpen: boolean;
  selectedService?: PoojaService | null;
  onClose: () => void;
}

export const PoojaBookingModal: React.FC<PoojaBookingModalProps> = ({
  isOpen,
  selectedService,
  onClose,
}) => {
  const [poojaId, setPoojaId] = useState<string>(selectedService?.id || POOJA_SERVICES[0].id);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [gotram, setGotram] = useState<string>('');
  const [rashi, setRashi] = useState<string>(ALL_RASHIS[0].name);
  const [nakshatram, setNakshatram] = useState<string>(NAKSHATRAS[0].telugu);
  const [date, setDate] = useState<string>('2026-12-04');
  const [location, setLocation] = useState<'temple' | 'home' | 'online'>('temple');
  const [sankalpamNote, setSankalpamNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingSubmission | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const isKundaliPdfSelected = poojaId === 'kundali-100-pdf';
  const currentPooja = isKundaliPdfSelected
    ? {
        id: 'kundali-100-pdf',
        name: '100-Page Janma Kundali PDF Report',
        teluguName: '100 పేజీల సంపూర్ణ జన్మ కుండలి PDF రిపోర్ట్',
      }
    : POOJA_SERVICES.find((p) => p.id === poojaId) || POOJA_SERVICES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('దయచేసి భక్తుని పేరు నమోదు చేయండి (Please enter your name).');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి (Please enter a valid 10-digit phone number).');
      return;
    }

    setErrorMessage('');
    const refId = `SLG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: BookingSubmission = {
      id: refId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gotram: gotram.trim() || 'కాశ్యప / శివ గోత్రం',
      rashi,
      nakshatram,
      poojaId: currentPooja.id,
      poojaName: currentPooja.teluguName,
      date,
      location,
      sankalpamNote: sankalpamNote.trim(),
      createdAt: new Date().toISOString(),
    };

    if (auth.currentUser && auth.currentUser.emailVerified) {
      try {
        await createBookingRecordInFirestore({
          referenceCode: refId,
          inquiryType: isKundaliPdfSelected ? 'kundali_pdf' : 'pooja',
          serviceName: currentPooja.teluguName,
          devoteeName: newBooking.name,
          phone: newBooking.phone,
          gotram: newBooking.gotram,
          rashi: newBooking.rashi,
          nakshatram: newBooking.nakshatram,
          preferredDate: newBooking.date,
          birthTime: '',
          birthPlace:
            location === 'temple' ? 'కోవెలలో' : location === 'home' ? 'స్వగృహంలో' : 'ఆన్‌లైన్ సంకల్పం',
          notes: newBooking.sankalpamNote || '',
          status: 'pending',
        });
      } catch {
        // Proceed with local receipt & WhatsApp even if offline
      }
    }

    setSubmittedBooking(newBooking);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSubmittedBooking(null);
    setName('');
    setPhone('');
    setGotram('');
    onClose();
  };

  const generateWhatsAppMessage = (b: BookingSubmission) => {
    return encodeURIComponent(
      `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు 🙏\nనేను శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వెబ్‌సైట్ ద్వారా పూజ బుకింగ్ చేశాను.\n\n` +
      `బుకింగ్ ఐడీ: ${b.id}\n` +
      `సేవ: ${b.poojaName}\n` +
      `భక్తుని పేరు: ${b.name}\n` +
      `గోత్రం: ${b.gotram}\n` +
      `రాశి & నక్షత్రం: ${b.rashi} / ${b.nakshatram}\n` +
      `తేదీ: ${b.date}\n` +
      `ప్రాంతం: ${b.location === 'temple' ? 'కోవెలలో' : b.location === 'home' ? 'స్వగృహంలో' : 'ఆన్‌లైన్ సంకల్పం'}\n` +
      `ఫోన్: ${b.phone}\n\n` +
      `దయచేసి ముహూర్తం మరియు సంకల్ప వివరాలను నిర్ధారించండి.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-amber-300 overflow-hidden my-8 animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <OmEmblem className="w-8 h-8 text-amber-300" size={32} />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-telugu text-white">
                వైదిక పూజా సంకల్ప బుకింగ్
              </h3>
              <p className="text-xs text-amber-200 font-telugu">
                శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · శ్రీ సాయి ధీరజ్ శర్మ గారు
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-amber-950/50 hover:bg-amber-950 text-amber-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {isSubmitted && submittedBooking ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-2xl font-bold font-telugu text-amber-950 mb-1">
                పూజ బుకింగ్ విజయవంతమైంది!
              </h4>
              <p className="text-sm font-telugu text-slate-600 mb-6">
                మీ సంకల్ప వివరాలు నమోదు చేయబడ్డాయి. శ్రీ ధీరజ్ శర్మ గారు త్వరలోనే మిమ్మల్ని సంప్రదిస్తారు.
              </p>

              {/* Receipt Box */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-left text-sm font-telugu space-y-2 mb-6">
                <p className="flex justify-between border-b border-amber-200/60 pb-1.5">
                  <span className="text-slate-600">బుకింగ్ రిఫరెన్స్:</span>
                  <strong className="text-amber-900 font-mono text-base">{submittedBooking.id}</strong>
                </p>
                <p className="flex justify-between border-b border-amber-200/60 pb-1.5">
                  <span className="text-slate-600">పూజా సేవ:</span>
                  <strong className="text-slate-900">{submittedBooking.poojaName}</strong>
                </p>
                <p className="flex justify-between border-b border-amber-200/60 pb-1.5">
                  <span className="text-slate-600">భక్తుని పేరు:</span>
                  <strong className="text-slate-900">{submittedBooking.name}</strong>
                </p>
                <p className="flex justify-between border-b border-amber-200/60 pb-1.5">
                  <span className="text-slate-600">గోత్రం / నక్షత్రం:</span>
                  <strong className="text-slate-900">{submittedBooking.gotram} / {submittedBooking.nakshatram}</strong>
                </p>
                <p className="flex justify-between pb-0.5">
                  <span className="text-slate-600">తేదీ & వేదిక:</span>
                  <strong className="text-slate-900">
                    {submittedBooking.date} ({submittedBooking.location === 'temple' ? 'కోవెలలో' : submittedBooking.location === 'home' ? 'స్వగృహంలో' : 'ఆన్‌లైన్'})
                  </strong>
                </p>
              </div>

              {/* WhatsApp forward button */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/918977986166?text=${generateWhatsAppMessage(submittedBooking)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-telugu font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <Send size={18} />
                  <span>ధీరజ్ శర్మ గారికి వాట్సాప్‌లో వివరాలు పంపండి (8977986166)</span>
                </a>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-telugu font-medium text-sm transition-colors cursor-pointer"
                >
                  ముగింపు (Close)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs sm:text-sm font-telugu text-rose-800">
                  {errorMessage}
                </div>
              )}

              {/* Select Pooja */}
              <div>
                <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                  పూజా / హోమ సేవను ఎంచుకోండి:
                </label>
                <select
                  value={poojaId}
                  onChange={(e) => setPoojaId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="kundali-100-pdf">
                    📜 100 పేజీల సంపూర్ణ జన్మ కుండలి PDF రిపోర్ట్ (100-Page Janma Kundali PDF)
                  </option>
                  {POOJA_SERVICES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.teluguName} ({p.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Devotee Name & Phone */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                    భక్తుని పేరు (Devotee Name) *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="మీ పూర్తి పేరు"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                    ఫోన్ నంబర్ (Phone Number) *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10 అంకెల మొబైల్ నంబర్"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Gotram & Date */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                    గోత్రం (Gotram)
                  </label>
                  <input
                    type="text"
                    value={gotram}
                    onChange={(e) => setGotram(e.target.value)}
                    placeholder="ఉదా: కాశ్యప, వశిష్ట..."
                    className="w-full px-3 py-2 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                    కోరిన పూజా తేదీ (Preferred Date)
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rashi & Nakshatram */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                    రాశి (Rashi)
                  </label>
                  <select
                    value={rashi}
                    onChange={(e) => setRashi(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {ALL_RASHIS.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                    నక్షత్రం (Nakshatram)
                  </label>
                  <select
                    value={nakshatram}
                    onChange={(e) => setNakshatram(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {NAKSHATRAS.map((n) => (
                      <option key={n.index} value={n.telugu}>
                        {n.index}. {n.telugu} ({n.english})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location options */}
              <div>
                <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                  పూజ వేదిక (Pooja Location):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocation('temple')}
                    className={`py-2 px-3 rounded-xl border text-xs font-telugu font-semibold transition-all cursor-pointer ${
                      location === 'temple'
                        ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    కోవెలలో
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('home')}
                    className={`py-2 px-3 rounded-xl border text-xs font-telugu font-semibold transition-all cursor-pointer ${
                      location === 'home'
                        ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    స్వగృహంలో
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('online')}
                    className={`py-2 px-3 rounded-xl border text-xs font-telugu font-semibold transition-all cursor-pointer ${
                      location === 'online'
                        ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    ఆన్‌లైన్ సంకల్పం
                  </button>
                </div>
              </div>

              {/* Special Sankalpam Note */}
              <div>
                <label className="block text-xs font-semibold text-amber-900 font-telugu mb-1.5">
                  సంకల్ప కోరిక / ప్రత్యేక ఉద్దేశం (Special Prayer Intention):
                </label>
                <textarea
                  rows={2}
                  value={sankalpamNote}
                  onChange={(e) => setSankalpamNote(e.target.value)}
                  placeholder="ఉదా: ఉద్యోగ ప్రాప్తి, వివాహ ప్రయత్నం, ఆరోగ్యం..."
                  className="w-full px-3 py-2 bg-slate-50 border border-amber-300 rounded-xl font-telugu text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl font-telugu font-bold text-base shadow-lg transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  సంకల్ప బుకింగ్ నిర్ధారించండి
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
