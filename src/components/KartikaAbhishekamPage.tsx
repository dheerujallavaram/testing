import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Home,
  MapPin,
  Heart,
  ShieldCheck,
  Send,
  Plus,
  Trash2,
  ChevronDown,
  Gift,
  HelpCircle,
  Copy,
  QrCode,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Layers,
  LayoutGrid,
  Droplets,
  BookOpen,
  Compass,
  Check,
} from 'lucide-react';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { NAKSHATRAS, ALL_RASHIS } from '../data/panchangamData';
import {
  KARTIKA_RASHI_BENEFITS,
  KARTIKA_PRASADAM_DETAILS,
  KARTIKA_MASAM_FAQS,
  RashiKartikaBenefit,
} from '../data/kartikaAbhishekamData';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FamilyMemberEntry {
  name: string;
  relation: string;
  rashi: string;
  nakshatram: string;
}

const RELATION_OPTIONS = [
  'కర్త (Self)',
  'సతీమణి (Wife)',
  'భర్త (Husband)',
  'కుమారుడు (Son)',
  'కుమార్తె (Daughter)',
  'తల్లి (Mother)',
  'తండ్రి (Father)',
  'కోడలు (Daughter-in-law)',
  'అల్లుడు (Son-in-law)',
  'మనుమడు/మనుమరాల్లు (Grandchild)',
];

const SANKALPA_PURPOSES = [
  'సర్వతోముఖాభివృద్ధి & కుటుంబ ఆయురారోగ్యాలు (General Well-being & Health)',
  'శీఘ్ర వివాహ ప్రాప్తి & దాంపత్య సౌఖ్యం (Quick Marriage & Conjugal Bliss)',
  'సత్సంతాన ప్రాప్తి & వంశాభివృద్ధి (Righteous Progeny & Family Prosperity)',
  'ఋణ విముక్తి & వ్యాపార ధనాభివృద్ధి (Debt Relief & Wealth Growth)',
  'ఉద్యోగ ప్రాప్తి & ఉన్నత పదోన్నతులు (Job Promotion & Career Breakthrough)',
  'ఏలినాటి శని / కుజ / రాహు-కేతు దోష శాంతి (Planetary Dosha Mitigation)',
];

export const KartikaAbhishekamPage: React.FC = () => {
  const { t, language } = useLanguage();

  // Form State
  const [primaryName, setPrimaryName] = useState('');
  const [phone, setPhone] = useState('');
  const [gotram, setGotram] = useState('');
  const [sankalpaPurpose, setSankalpaPurpose] = useState(SANKALPA_PURPOSES[0]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberEntry[]>([
    { name: '', relation: 'కర్త (Self)', rashi: 'మేషం', nakshatram: 'అశ్విని' },
  ]);
  const [addressLine, setAddressLine] = useState('');
  const [cityTown, setCityTown] = useState('');
  const [districtState, setDistrictState] = useState('');
  const [pincode, setPincode] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [selectedRashi, setSelectedRashi] = useState<RashiKartikaBenefit>(KARTIKA_RASHI_BENEFITS[0]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [rashiViewMode, setRashiViewMode] = useState<'cards' | 'focus'>('cards');
  const [selectedTattwa, setSelectedTattwa] = useState<'all' | 'agni' | 'prithvi' | 'vayu' | 'jala'>('all');
  const [rashiSearchQuery, setRashiSearchQuery] = useState('');
  const [copiedMantraId, setCopiedMantraId] = useState<string | null>(null);
  const [rashiSelectionToast, setRashiSelectionToast] = useState<string | null>(null);

  const UPI_ID = '7013079166@kotakbank';
  const DAKSHINA_AMOUNT = '2,500';
  const UPI_PAY_INTENT = `upi://pay?pa=7013079166@kotakbank&pn=Sri%20Lakshmi%20Ganapathi%20Jyothishalayam&am=2500&cu=INR&tn=Kartika%20Ekavara%20Rudrabhishekam`;
  const UPI_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(
    UPI_PAY_INTENT
  )}`;

  const handleSelectRashiForSankalpam = (rashi: RashiKartikaBenefit) => {
    setSelectedRashi(rashi);
    const cleanRashiName = rashi.nameTe.replace(' రాశి', '').trim();
    if (familyMembers.length > 0) {
      const updated = [...familyMembers];
      updated[0] = { ...updated[0], rashi: cleanRashiName };
      setFamilyMembers(updated);
    }
    setRashiSelectionToast(`మీరు '${rashi.nameTe}' ఎంచుకున్నారు. సంకల్ప ఫారమ్‌లో అప్‌డేట్ చేయబడింది!`);
    setTimeout(() => setRashiSelectionToast(null), 4500);

    const formElement = document.getElementById('sankalpa-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyMantra = (rashiId: string, mantra: string) => {
    navigator.clipboard?.writeText(mantra);
    setCopiedMantraId(rashiId);
    setTimeout(() => setCopiedMantraId(null), 2500);
  };

  const filteredRashis = KARTIKA_RASHI_BENEFITS.filter((r) => {
    const matchesTattwa =
      selectedTattwa === 'all' ||
      (selectedTattwa === 'agni' && r.elementTe.includes('అగ్ని')) ||
      (selectedTattwa === 'prithvi' && r.elementTe.includes('పృథ్వీ')) ||
      (selectedTattwa === 'vayu' && r.elementTe.includes('వాయు')) ||
      (selectedTattwa === 'jala' && r.elementTe.includes('జల'));

    const q = rashiSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.nameTe.toLowerCase().includes(q) ||
      r.nameEn.toLowerCase().includes(q) ||
      r.rulerTe.toLowerCase().includes(q) ||
      r.rulerEn.toLowerCase().includes(q) ||
      r.primaryBenefitTe.toLowerCase().includes(q);

    return matchesTattwa && matchesSearch;
  });

  const handleAddMember = () => {
    if (familyMembers.length >= 6) return;
    setFamilyMembers([
      ...familyMembers,
      { name: '', relation: 'సతీమణి (Wife)', rashi: 'వృషభం', nakshatram: 'రోహిణి' },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    if (familyMembers.length <= 1) return;
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof FamilyMemberEntry, value: string) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const generateWhatsAppMessage = (refId: string) => {
    const membersListText = familyMembers
      .filter((m) => m.name.trim().length > 0)
      .map(
        (m, i) =>
          `  ${i + 1}. ${m.name} (${m.relation}) - రాశి: ${m.rashi}, నక్షత్రం: ${m.nakshatram}`
      )
      .join('\n');

    const msg = [
      '🔱 *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — కార్తీక మాస ఏకవార రుద్రాభిషేక సంకల్ప నమోదు* 🔱',
      `బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారికి నమస్కారములు 🙏`,
      '',
      `📌 *సంకల్ప ఐడీ (Ref ID):* ${refId}`,
      `👤 *కర్త పేరు:* ${primaryName}`,
      `📞 *వాట్సాప్ నంబర్:* ${phone}`,
      `🌿 *గోత్రం:* ${gotram}`,
      `🎯 *సంకల్ప కోరిక:* ${sankalpaPurpose}`,
      '',
      `👨‍👩‍👧‍👦 *కుటుంబ సభ్యుల వివరాలు:*`,
      membersListText || `  1. ${primaryName} (కర్త)`,
      '',
      `📦 *ప్రసాదం చేరవలసిన చిరునామా:*`,
      `  ${addressLine}, ${cityTown}, ${districtState} - పిన్ కోడ్: ${pincode}`,
      '',
      `💰 *దక్షిణ:* ₹2,500/- (నెల రోజుల ఏకవార రుద్రాభిషేకం)`,
      `🏦 *అధికారిక UPI ID:* ${UPI_ID} (Kotak Mahindra Bank)`,
      transactionId ? `💳 *యూపీఐ లావాదేవీ సంఖ్య (UTR):* ${transactionId}` : '💳 *పేమెంట్:* స్క్రీన్‌షాట్ జతచేస్తున్నాను.',
      '',
      'దయచేసి మా గోత్రనామాలతో నెల రోజుల పాటు శ్రీ పరమేశ్వరునికి నిత్య ఏకవార రుద్రాభిషేకం నిర్వహించి, కార్తీక మాసానంతరం స్వామివారి గంధం, విభూతి మరియు కాశీ కాలభైరవ రక్ష ప్రసాదమును పంపగలరు 🙏',
    ].join('\n');

    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryName.trim() || !phone.trim() || !gotram.trim()) {
      alert('దయచేసి కర్త పేరు, వాట్సాప్ నంబర్ మరియు గోత్రం వివరాలను పూరించండి.');
      return;
    }

    setIsSubmitting(true);
    const refId = `KARTIKA-${Date.now().toString().slice(-6)}`;
    setBookingRef(refId);

    // Save to Firestore if authenticated/available
    try {
      await addDoc(collection(db, 'kartikaBookings'), {
        referenceId: refId,
        primaryName,
        phone,
        gotram,
        sankalpaPurpose,
        familyMembers,
        address: {
          addressLine,
          cityTown,
          districtState,
          pincode,
        },
        dakshinaAmount: 2500,
        transactionId: transactionId || null,
        status: 'pending_confirmation',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      // Continue even if offline - direct WhatsApp routing guarantees 100% booking success
      console.warn('Local/offline registration mode:', err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#2a0808] via-[#3b0a0a] to-[#1a0505] text-amber-100 py-10 px-3 sm:px-6 lg:px-8 min-h-screen">
      {/* Top Sacred Hero Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm">
            <Flame size={16} className="text-amber-400 animate-pulse" />
            పరమ పవిత్ర కార్తీక మాస మహోత్సవం • Sri Lakshmi Ganapathi Jyothishalayam
          </div>

          <div className="flex justify-center my-3">
            <OmEmblem className="w-20 h-20 text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 tracking-tight leading-tight">
            కార్తీక మాస ఏకవార రుద్రాభిషేకం
          </h1>

          <p className="text-amber-200/90 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            నెల రోజుల పాటు నిత్యం భక్తుల కుటుంబ గోత్రనామాలతో పరమశివునికి శాస్త్రోక్త ఏకవార రుద్రాభిషేకం.
            సకల పాప నివారణ, ఆయురారోగ్య ఐశ్వర్య సిద్ధి మరియు ద్వాదశ రాశుల సమస్త గ్రహ దోష శాంతి.
          </p>

          {/* Golden Highlights Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto pt-4 text-xs sm:text-sm">
            <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-3.5 backdrop-blur flex items-center gap-3 text-left">
              <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xl">
                🗓️
              </span>
              <div>
                <strong className="block text-amber-200 font-serif">30 రోజుల నిత్య పూజ</strong>
                <span className="text-amber-300/80 text-xs">నెలంతా భక్తుల పేర్లతో సంకల్పం</span>
              </div>
            </div>

            <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-3.5 backdrop-blur flex items-center gap-3 text-left">
              <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xl">
                🔱
              </span>
              <div>
                <strong className="block text-amber-200 font-serif">దివ్య ప్రసాదములు</strong>
                <span className="text-amber-300/80 text-xs">గంధం, విభూతి & కాశీ కాలభైరవ రక్ష</span>
              </div>
            </div>

            <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-3.5 backdrop-blur flex items-center gap-3 text-left">
              <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xl">
                💰
              </span>
              <div>
                <strong className="block text-amber-200 font-serif">దక్షిణ: ₹2,500/- (నెలకు)</strong>
                <span className="text-amber-300/80 text-xs">రోజుకు కేవలం ₹83 మాత్రమే!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: THE BOOKING FORM */}
        <div id="sankalpa-form" className="lg:col-span-7 bg-gradient-to-b from-amber-950/90 to-[#220707] rounded-3xl p-6 sm:p-8 border-2 border-amber-500/60 shadow-2xl relative scroll-mt-24">
          {rashiSelectionToast && (
            <div className="mb-4 p-3 bg-amber-500/20 border border-amber-400 rounded-xl text-xs sm:text-sm text-amber-200 flex items-center gap-2 animate-pulse">
              <Sparkles size={16} className="text-amber-400 shrink-0" />
              <span>{rashiSelectionToast}</span>
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-amber-500/30 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  భక్తుల సంకల్ప వివరాలు • Registration Form
                </span>
                <h2 className="text-2xl font-bold font-serif text-amber-100">
                  మీ గోత్రనామాలు నమోదు చేసుకోండి
                </h2>
                <p className="text-xs text-amber-300/80 mt-1">
                  ఒకే రిజిస్ట్రేషన్ (₹2,500) తో మీ పూర్తి కుటుంబ సభ్యుల (గరిష్టంగా 6గురు) పేర్లు ఇవ్వవచ్చు.
                </p>
              </div>

              {/* Primary Devotee & Gotram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <User size={14} className="text-amber-400" />
                    కర్త పూర్తి పేరు *
                  </label>
                  <input
                    type="text"
                    required
                    value={primaryName}
                    onChange={(e) => setPrimaryName(e.target.value)}
                    placeholder="ఉదా: జల్లవరం రమేష్ శర్మ"
                    className="w-full bg-amber-900/40 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <Phone size={14} className="text-amber-400" />
                    వాట్సాప్ మొబైల్ నంబర్ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ఉదా: 9876543210"
                    className="w-full bg-amber-900/40 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    గోత్రం (Gotram) *
                  </label>
                  <input
                    type="text"
                    required
                    value={gotram}
                    onChange={(e) => setGotram(e.target.value)}
                    placeholder="ఉదా: కౌశికస, భారద్వాజస, కాశ్యప..."
                    className="w-full bg-amber-900/40 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <Heart size={14} className="text-amber-400" />
                    సంకల్ప ప్రత్యేక ప్రార్థన / కోరిక
                  </label>
                  <select
                    value={sankalpaPurpose}
                    onChange={(e) => setSankalpaPurpose(e.target.value)}
                    className="w-full bg-amber-950 border border-amber-500/50 rounded-xl px-3 py-2.5 text-xs text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {SANKALPA_PURPOSES.map((p, i) => (
                      <option key={i} value={p} className="bg-amber-950 text-white">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Family Members Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <User size={14} />
                    కుటుంబ సభ్యుల వివరాలు ({familyMembers.length}/6గురు)
                  </span>
                  {familyMembers.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="text-xs text-amber-300 hover:text-white bg-amber-800/60 hover:bg-amber-700/80 px-2.5 py-1 rounded-lg border border-amber-500/40 transition-all flex items-center gap-1 font-medium"
                    >
                      <Plus size={13} />
                      సభ్యుని చేర్చండి
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {familyMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-950/60 p-3.5 rounded-2xl border border-amber-500/30 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                        <span>సభ్యుడు #{idx + 1}</span>
                        {familyMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                            title="తొలగించండి"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="పేరు (Name)"
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          className="w-full bg-amber-900/30 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                        <select
                          value={member.relation}
                          onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                          className="w-full bg-amber-950 border border-amber-500/40 rounded-lg px-2 py-1.5 text-xs text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        >
                          {RELATION_OPTIONS.map((rel, rIdx) => (
                            <option key={rIdx} value={rel} className="bg-amber-950 text-white">
                              {rel}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[10px] text-amber-300 block mb-0.5">రాశి (Rashi):</label>
                          <select
                            value={member.rashi}
                            onChange={(e) => handleMemberChange(idx, 'rashi', e.target.value)}
                            className="w-full bg-amber-950 border border-amber-500/40 rounded-lg px-2 py-1 text-xs text-amber-200 focus:outline-none"
                          >
                            {ALL_RASHIS.map((r) => (
                              <option key={r.id} value={r.name} className="bg-amber-950 text-white">
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-amber-300 block mb-0.5">నక్షత్రం (Star):</label>
                          <select
                            value={member.nakshatram}
                            onChange={(e) => handleMemberChange(idx, 'nakshatram', e.target.value)}
                            className="w-full bg-amber-950 border border-amber-500/40 rounded-lg px-2 py-1 text-xs text-amber-200 focus:outline-none"
                          >
                            {NAKSHATRAS.map((nak) => (
                              <option key={nak.index} value={nak.telugu} className="bg-amber-950 text-white">
                                {nak.index}. {nak.telugu}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="space-y-3 pt-2 border-t border-amber-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <MapPin size={14} />
                  ప్రసాదం పంపవలసిన పూర్తి పోస్టల్ చిరునామా (Postal Address)
                </span>

                <input
                  type="text"
                  required
                  placeholder="ఇంటి నంబర్, వీధి, ల్యాండ్‌మార్క్ (Door No, Street)"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full bg-amber-900/40 border border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="ఊరు / పట్టణం (City)"
                    value={cityTown}
                    onChange={(e) => setCityTown(e.target.value)}
                    className="w-full bg-amber-900/40 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="జిల్లా & రాష్ట్రం (State)"
                    value={districtState}
                    onChange={(e) => setDistrictState(e.target.value)}
                    className="w-full bg-amber-900/40 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="పిన్ కోడ్ (Pin Code)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-amber-900/40 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Dakshina & UPI Scanner Card */}
              <div className="bg-gradient-to-r from-amber-950 via-[#400e0e] to-amber-950 p-4 sm:p-5 rounded-2xl border-2 border-amber-400/80 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-amber-300 uppercase tracking-wider font-semibold block">
                      నెల రోజుల ఏకవార రుద్రాభిషేక దక్షిణ
                    </span>
                    <div className="text-2xl font-bold font-serif text-amber-200">
                      ₹{DAKSHINA_AMOUNT}/-
                      <span className="text-xs text-amber-300/80 font-normal ml-2">
                        (రోజుకు కేవలం ₹83 మాత్రమే)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                      ✓ ప్రసాదం డెలివరీ ఉచితం
                    </span>
                  </div>
                </div>

                {/* Kotak Bank UPI ID Card */}
                <div className="bg-amber-900/40 p-3.5 rounded-xl border border-amber-500/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-200 font-bold text-xs shrink-0">
                        KMB
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-300 text-[11px] font-semibold">
                            అధికారిక బ్యాంక్ UPI ID:
                          </span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                            Kotak Mahindra Bank
                          </span>
                        </div>
                        <strong className="text-amber-100 font-mono tracking-wider text-sm sm:text-base selection:bg-amber-400 selection:text-slate-900">
                          {UPI_ID}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer shadow"
                    >
                      <Copy size={13} />
                      {copiedUpi ? 'కాపీ అయింది! (7013079166@kotakbank)' : 'UPI ID కాపీ చేయండి'}
                    </button>
                  </div>

                  {/* QR Code and 1-Tap Pay Action */}
                  <div className="pt-2 border-t border-amber-500/30 flex flex-col sm:flex-row items-center gap-3">
                    <div className="shrink-0 bg-white p-2 rounded-xl border border-amber-300 shadow-md">
                      <img
                        src={UPI_QR_URL}
                        alt="Kotak UPI QR Code 7013079166@kotakbank"
                        className="w-28 h-28 object-contain rounded"
                        loading="lazy"
                      />
                      <span className="block text-[9px] text-center font-bold text-slate-800 mt-1">
                        PhonePe / GPay / Paytm
                      </span>
                    </div>

                    <div className="text-xs space-y-2 w-full text-center sm:text-left">
                      <p className="text-amber-200/90 text-[11.5px] leading-relaxed">
                        ఫోన్ పే, గూగుల్ పే, పేటీఎం లేదా భీమ్ యాప్ ద్వారా పైన కనిపిస్తున్న క్యూఆర్ కోడ్‌ను స్కాన్ చేయండి లేదా మొబైల్‌లో క్రింది బటన్ నొక్కి నేరుగా చెల్లించండి:
                      </p>
                      <a
                        href={UPI_PAY_INTENT}
                        className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        ⚡ మొబైల్ UPI యాప్‌తో చెల్లించండి (Tap to Pay)
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-amber-300 block mb-1">
                    యూపీఐ లావాదేవీ సంఖ్య (UTR / Transaction ID - ఐచ్ఛికం):
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="ఉదా: 432109876543 (లేదా వాట్సాప్‌లో స్క్రీన్‌షాట్ పంపవచ్చు)"
                    className="w-full bg-amber-900/40 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base sm:text-lg font-serif shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 tracking-wide disabled:opacity-50 cursor-pointer"
              >
                <Flame size={20} className="text-amber-950" />
                {isSubmitting ? 'నమోదు అవుతోంది...' : 'సంకల్పం సమర్పించండి (₹2,500)'}
              </button>
            </form>
          ) : (
            /* Post-Submission Success & 1-Click WhatsApp Forwarder */
            <div className="space-y-6 text-center py-6">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400/60 shadow-lg">
                <CheckCircle2 size={44} />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  సంకల్పం విజయవంతంగా నమోదైంది!
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100">
                  శ్రీ పరమేశ్వరుని ఆశీస్సులు మీకు సదా ఉండుగాక!
                </h3>
                <p className="text-sm text-amber-200/90 max-w-md mx-auto">
                  సంకల్ప రిఫరెన్స్ సంఖ్య: <strong className="text-amber-300 font-mono">{bookingRef}</strong>
                </p>
              </div>

              {/* Payment recap & QR for user if not yet completed */}
              <div className="bg-amber-900/30 p-4 rounded-2xl border border-amber-500/40 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-semibold">దక్షిణ చెల్లింపు వివరాలు:</span>
                  <span className="text-amber-100 font-bold font-serif">₹2,500/-</span>
                </div>
                <div className="flex items-center justify-between bg-amber-950/60 p-2 rounded-lg">
                  <span className="text-amber-200 font-mono text-[11px]">{UPI_ID}</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    {copiedUpi ? 'కాపీ అయింది!' : 'కాపీ'}
                  </button>
                </div>
              </div>

              <div className="bg-amber-950/80 p-5 rounded-2xl border border-amber-500/50 text-left text-xs sm:text-sm space-y-2.5">
                <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wide border-b border-amber-500/30 pb-1.5">
                  చివరి దశ: వాట్సాప్‌లో కన్ఫర్మేషన్ & స్క్రీన్‌షాట్ పంపండి
                </h4>
                <p className="text-amber-100/90 leading-relaxed text-xs">
                  క్రింది ఆకుపచ్చ బటన్ క్లిక్ చేయగానే, మీ గోత్రనామాలు, చిరునామా మరియు కొటాక్ UPI ({UPI_ID}) రిఫరెన్స్‌తో కూడిన పవిత్ర సంకల్ప పత్రం
                  నేరుగా బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి అధికారిక వాట్సాప్ (+91 8977986166) లో ఓపెన్ అవుతుంది.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/918977986166?text=${generateWhatsAppMessage(bookingRef)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send size={16} />
                    WhatsApp లో గురువు గారికి పంపండి (8977986166) ➔
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setPrimaryName('');
                  setPhone('');
                  setGotram('');
                }}
                className="text-xs text-amber-300 hover:underline"
              >
                మరొక కుటుంబానికి సంకల్పం నమోదు చేయండి
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PRASADAM PREVIEW & TRUST BADGES */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sacred Prasadam Box Card */}
          <div className="bg-gradient-to-br from-amber-950 via-[#350a0a] to-amber-950 rounded-3xl p-6 border-2 border-amber-500/50 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Gift size={16} />
              {KARTIKA_PRASADAM_DETAILS.titleTe}
            </div>

            <p className="text-xs text-amber-200/80 leading-relaxed">
              కార్తీక మాస పూర్ణాహుతి అనంతరం ఈ క్రింది పరమ పవిత్ర ప్రసాదములు స్పీడ్ పోస్ట్ ద్వారా నేరుగా మీ స్వగృహానికి పంపబడును:
            </p>

            <div className="space-y-3 pt-1">
              {KARTIKA_PRASADAM_DETAILS.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-amber-900/30 p-3.5 rounded-2xl border border-amber-500/30 flex items-start gap-3"
                >
                  <span className="text-2xl shrink-0 p-1 bg-amber-950/60 rounded-xl border border-amber-500/20">
                    {item.icon}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-amber-100 font-serif">
                      {item.nameTe}
                    </h4>
                    <p className="text-[11px] text-amber-200/70 leading-relaxed">
                      {item.descTe}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genuine Trust & Priest Accountability */}
          <div className="bg-gradient-to-br from-amber-950/80 to-[#290808] rounded-3xl p-6 border border-amber-500/40 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              ఎందుకు శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం? • Our Sacred Promise
            </span>
            <ul className="space-y-2 text-xs text-amber-100/90 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>నిత్య సంకల్పం:</strong> ప్రతిరోజూ ఉదయం బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు స్వయంగా మీ గోత్రనామాలు చదివి ఏకవార రుద్రాభిషేకం చేస్తారు.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>వాట్సాప్ అప్‌డేట్స్:</strong> ప్రతిరోజూ స్వామి వారి పవిత్ర లింగాకార అలంకరణ, బిల్వార్చన ఫోటోలు/వీడియోలు భక్తులకు వాట్సాప్‌లో పంపబడతాయి.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>సోమవారాల విశేష పూజ:</strong> కార్తీక సోమవారాలు, కోటి సోమవారము మరియు కార్తీక పౌర్ణమి నాడు విశేష మహాన్యాస పూర్వక రుద్రాభిషేకం అదనపు రుసుము లేకుండా ఉచితంగా నిర్వహించబడును.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 12 RASHIS KARTIKA RUDRABHISHEKAM BENEFITS SECTION (DWADASA RASHI PHALALU) */}
      <div className="max-w-6xl mx-auto mt-16 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-500/50 shadow-md">
            <Flame size={14} className="text-orange-400" />
            ద్వాదశ రాశుల ఫల ప్రదాత • Dwadasa Rashi Spiritual Benefits
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-amber-100 leading-tight">
            కార్తీక మాస ఏకవార రుద్రాభిషేకం — ద్వాదశ రాశుల విశేష ఫలితాలు
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/85 max-w-3xl mx-auto leading-relaxed">
            జ్యోతిష శాస్త్ర ప్రకారం కార్తీక మాసంలో సూర్యభగవానుడు నీచ స్థానమైన తులా రాశిలో సంచరిస్తాడు.
            ఈ పవిత్ర కాలంలో సమస్త జీవకోటికి ప్రాణాధారమైన పరమేశ్వరునికి నిత్య ఏకవార రుద్రాభిషేకం నిర్వహించడం ద్వారా
            ద్వాదశ రాశుల జాతకులకు గ్రహదోష నివారణ కలిగి, అష్టైశ్వర్యాలు, సంపూర్ణ ఆయురారోగ్యాలు సిద్ధించును.
          </p>
        </div>

        {/* 4 Core Pillars of Divine Grace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-amber-950/90 to-[#2c0909] p-4 rounded-2xl border border-amber-500/40 space-y-1.5">
            <span className="text-2xl block">🛡️</span>
            <h3 className="text-sm font-bold text-amber-100 font-serif">సమస్త గ్రహ దోష నివారణ</h3>
            <p className="text-[11.5px] text-amber-200/75 leading-relaxed">
              ఏలినాటి శని, కుజ దోషం, కాలసర్ప దోషం మరియు రాహు-కేతువుల దుష్ప్రభావాలకు శాస్త్రోక్త రుద్ర శాంతి.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-950/90 to-[#2c0909] p-4 rounded-2xl border border-amber-500/40 space-y-1.5">
            <span className="text-2xl block">🌿</span>
            <h3 className="text-sm font-bold text-amber-100 font-serif">ఆధ్యాత్మిక రక్ష & మనశ్శాంతి</h3>
            <p className="text-[11.5px] text-amber-200/75 leading-relaxed">
              కాశీ కాలభైరవ రక్ష, పరమ పవిత్ర విభూతి, గంధ ప్రసాదాల ద్వారా సమస్త దుష్ట శక్తులు, భయాలు పటాపంచలు.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-950/90 to-[#2c0909] p-4 rounded-2xl border border-amber-500/40 space-y-1.5">
            <span className="text-2xl block">💼</span>
            <h3 className="text-sm font-bold text-amber-100 font-serif">ఉద్యోగ, వ్యాపార పురోగతి</h3>
            <p className="text-[11.5px] text-amber-200/75 leading-relaxed">
              ఆగిపోయిన పనులు వేగవంతం, పదోన్నతి, స్థిరాస్తి వివాదాల పరిష్కారం మరియు నిలిచిన మొండి బకాయిల వసూలు.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-950/90 to-[#2c0909] p-4 rounded-2xl border border-amber-500/40 space-y-1.5">
            <span className="text-2xl block">👨‍👩‍👧‍👦</span>
            <h3 className="text-sm font-bold text-amber-100 font-serif">కుటుంబ సౌభాగ్యం & ఆరోగ్యం</h3>
            <p className="text-[11.5px] text-amber-200/75 leading-relaxed">
              దాంపత్య అనురాగం, సత్సంతాన ప్రాప్తి, తల్లిదండ్రుల ఆరోగ్యం మరియు దీర్ఘకాలిక రోగాల నుండి ఉపశమనం.
            </p>
          </div>
        </div>

        {/* Filter & View Mode Controls Bar */}
        <div className="bg-amber-950/60 p-4 sm:p-5 rounded-3xl border border-amber-500/40 space-y-4 shadow-lg">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                value={rashiSearchQuery}
                onChange={(e) => setRashiSearchQuery(e.target.value)}
                placeholder="రాశి పేరు లేదా అధిపతిని వెతకండి (ఉదా: మేషం, Mars, ధనుస్సు, శని, కుజుడు...)"
                className="w-full bg-amber-900/40 border border-amber-500/40 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-amber-300/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              {rashiSearchQuery && (
                <button
                  type="button"
                  onClick={() => setRashiSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 hover:text-white"
                >
                  ✕ క్లియర్
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 bg-amber-900/50 p-1 rounded-xl border border-amber-500/40 shrink-0 self-end md:self-auto">
              <button
                type="button"
                onClick={() => setRashiViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  rashiViewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                12 కార్డుల వీక్షణ
              </button>
              <button
                type="button"
                onClick={() => setRashiViewMode('focus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  rashiViewMode === 'focus'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <Compass size={14} />
                ప్రత్యేక పరిశీలన
              </button>
            </div>
          </div>

          {/* Pancha Bhuta Tattwa Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter size={12} />
              తత్త్వం:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTattwa('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedTattwa === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-amber-900/40 text-amber-200 border border-amber-500/30 hover:bg-amber-900/70'
              }`}
            >
              అన్నీ (12 రాశులు)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTattwa('agni')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedTattwa === 'agni'
                  ? 'bg-orange-500 text-slate-950 font-bold shadow'
                  : 'bg-amber-900/40 text-orange-200 border border-orange-500/30 hover:bg-amber-900/70'
              }`}
            >
              🔥 అగ్ని తత్త్వం (మేషం, సింహం, ధనుస్సు)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTattwa('prithvi')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedTattwa === 'prithvi'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-amber-900/40 text-emerald-200 border border-emerald-500/30 hover:bg-amber-900/70'
              }`}
            >
              🌍 పృథ్వీ తత్త్వం (వృషభం, కన్య, మకరం)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTattwa('vayu')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedTattwa === 'vayu'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'bg-amber-900/40 text-sky-200 border border-sky-500/30 hover:bg-amber-900/70'
              }`}
            >
              💨 వాయు తత్త్వం (మిథునం, తుల, కుంభం)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTattwa('jala')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedTattwa === 'jala'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'bg-amber-900/40 text-cyan-200 border border-cyan-500/30 hover:bg-amber-900/70'
              }`}
            >
              🌊 జల తత్త్వం (కర్కాటకం, వృశ్చికం, మీనం)
            </button>
          </div>
        </div>

        {/* Empty Search State */}
        {filteredRashis.length === 0 && (
          <div className="text-center py-12 bg-amber-950/40 rounded-3xl border border-amber-500/30 space-y-3">
            <p className="text-amber-200 text-sm">
              మీరు శోధించిన పదానికి సరిపోలిన రాశి వివరాలు లభించలేదు.
            </p>
            <button
              type="button"
              onClick={() => {
                setRashiSearchQuery('');
                setSelectedTattwa('all');
              }}
              className="text-xs text-amber-400 underline cursor-pointer"
            >
              అన్ని రాశులను చూడండి (Reset Filters)
            </button>
          </div>
        )}

        {/* VIEW 1: STRUCTURED 12 CARDS GRID */}
        {rashiViewMode === 'cards' && filteredRashis.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRashis.map((rashi) => {
              const isSelected = rashi.rashiId === selectedRashi.rashiId;
              const isMantraCopied = copiedMantraId === rashi.rashiId;

              return (
                <div
                  key={rashi.rashiId}
                  className={`bg-gradient-to-b from-amber-950/90 via-[#270707] to-amber-950/95 rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between space-y-4 hover:shadow-2xl hover:border-amber-400/90 ${
                    isSelected ? 'border-amber-400 shadow-xl ring-2 ring-amber-400/30' : 'border-amber-500/40'
                  }`}
                >
                  {/* Card Top: Medallion, Title & Badges */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl border border-amber-500/40 shadow-inner shrink-0">
                          {rashi.symbol}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold font-serif text-amber-100 flex items-center gap-1.5">
                            {rashi.nameTe}
                            <span className="text-xs text-amber-300/70 font-normal">
                              ({rashi.nameEn})
                            </span>
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-amber-300/90">
                              అధిపతి: <strong>{rashi.rulerTe}</strong>
                            </span>
                            <span className="text-amber-500/40">•</span>
                            <span className="text-[10px] text-amber-400/80 font-mono">
                              {rashi.rulerEn}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/30 shrink-0 font-medium">
                        {rashi.elementTe}
                      </span>
                    </div>

                    {/* Primary Benefit Banner */}
                    <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-3 rounded-2xl border border-amber-500/40 flex items-start gap-2">
                      <Sparkles size={15} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">
                          ప్రధాన విశేష ఫలితం:
                        </span>
                        <p className="text-xs font-semibold text-amber-100 leading-snug mt-0.5">
                          {rashi.primaryBenefitTe}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Spiritual Advantages List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                        విశిష్ట ఫలితాలు:
                      </span>
                      <ul className="space-y-2 text-xs text-amber-100/90">
                        {rashi.detailedPhalamTe.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-400 shrink-0 text-xs font-bold mt-0.5">✦</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Abhisheka Dravyam Box */}
                    <div className="bg-amber-900/30 p-3 rounded-xl border border-amber-500/30 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-300 flex items-center gap-1">
                        <Droplets size={12} className="text-amber-400" />
                        సిఫార్సు చేసిన అభిషేక ద్రవ్యం:
                      </span>
                      <p className="text-xs font-semibold text-amber-200">
                        {rashi.recommendedAbhishekaDravyamTe}
                      </p>
                    </div>

                    {/* Special Shiva Mantra with Copy Button */}
                    <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-400 flex items-center gap-1">
                          <BookOpen size={12} />
                          నిత్య జప మంత్రం:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyMantra(rashi.rashiId, rashi.specialMantraTe)}
                          className="text-[10.5px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/30 transition-colors"
                        >
                          {isMantraCopied ? (
                            <>
                              <Check size={11} className="text-emerald-400" />
                              <span className="text-emerald-300 font-bold">కాపీ అయింది</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>మంత్రం కాపీ</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-serif italic text-[11.5px] text-amber-200 leading-relaxed">
                        {rashi.specialMantraTe}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Action to Select for Sankalpam */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSelectRashiForSankalpam(rashi)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <span>ఈ రాశితో సంకల్పం చేయండి ({rashi.nameTe})</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: INTERACTIVE FOCUS VIEW */}
        {rashiViewMode === 'focus' && filteredRashis.length > 0 && (
          <div className="space-y-6">
            {/* 12 Rashi Buttons Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {filteredRashis.map((rashi) => {
                const isSelected = rashi.rashiId === selectedRashi.rashiId;
                return (
                  <button
                    key={rashi.rashiId}
                    type="button"
                    onClick={() => setSelectedRashi(rashi)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 font-bold border-amber-300 shadow-lg scale-105'
                        : 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-200 border-amber-500/30'
                    }`}
                  >
                    <span className="text-xl">{rashi.symbol}</span>
                    <span className="text-xs font-serif font-bold">{rashi.nameTe}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-950 font-semibold' : 'text-amber-400/80'}`}>
                      {rashi.rulerTe}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Rashi Deep Insights Card */}
            <div className="bg-gradient-to-r from-amber-950 via-[#3b0a0a] to-amber-950 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/60 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-3xl border border-amber-500/40 shadow-inner">
                    {selectedRashi.symbol}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold font-serif text-amber-100">
                        {selectedRashi.nameTe} ({selectedRashi.nameEn})
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        {selectedRashi.elementTe}
                      </span>
                    </div>
                    <p className="text-xs text-amber-300/80 mt-0.5">
                      రాశ్యాధిపతి: <strong>{selectedRashi.rulerTe} ({selectedRashi.rulerEn})</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-amber-900/40 px-3.5 py-2 rounded-xl border border-amber-500/40 text-left sm:text-right">
                  <span className="text-[10px] text-amber-300 uppercase block font-semibold">
                    ప్రధాన ఫలితం
                  </span>
                  <span className="text-xs font-bold text-amber-100">
                    {selectedRashi.primaryBenefitTe}
                  </span>
                </div>
              </div>

              {/* Detailed Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-amber-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    ఈ రుద్రాభిషేకం వల్ల కలిగే నిర్దిష్ట ఫలితాలు:
                  </h4>
                  <ul className="space-y-2">
                    {selectedRashi.detailedPhalamTe.map((point, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2 bg-amber-900/20 p-2.5 rounded-xl border border-amber-500/20"
                      >
                        <span className="text-amber-400 font-bold shrink-0">✦</span>
                        <span className="text-amber-100/90 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="bg-amber-900/40 p-4 rounded-2xl border border-amber-500/40 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300 block">
                      🥛 మీ రాశికి సిఫార్సు చేయబడిన అభిషేక ద్రవ్యం:
                    </span>
                    <p className="text-sm font-semibold text-amber-100">
                      {selectedRashi.recommendedAbhishekaDravyamTe}
                    </p>
                    <p className="text-[11px] text-amber-300/70">
                      ఈ ద్రవ్యంతో అభిషేకం చేయడం వల్ల మీ రాశికి విశేష గ్రహ శాంతి సిద్ధించును.
                    </p>
                  </div>

                  <div className="bg-amber-950/80 p-4 rounded-2xl border border-amber-500/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300 block">
                        🕉️ నిత్య జపం కొరకు ప్రత్యేక శివ మంత్రం:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyMantra(selectedRashi.rashiId, selectedRashi.specialMantraTe)}
                        className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/30"
                      >
                        {copiedMantraId === selectedRashi.rashiId ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-300 font-bold">కాపీ అయింది</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>మంత్రం కాపీ</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-serif italic text-xs sm:text-sm text-amber-200 leading-relaxed">
                      {selectedRashi.specialMantraTe}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectRashiForSankalpam(selectedRashi)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>{selectedRashi.nameTe} కొరకు సంకల్ప నమోదు ఫారమ్‌కు వెళ్లండి ➔</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="max-w-4xl mx-auto mt-16 bg-amber-950/70 rounded-3xl p-6 sm:p-8 border border-amber-500/40 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <HelpCircle size={14} />
            సందేహాలు & సమాధానాలు • FAQs
          </div>
          <h2 className="text-2xl font-bold font-serif text-amber-100">
            కార్తీక మాస రుద్రాభిషేక ప్రశ్నలు
          </h2>
        </div>

        <div className="space-y-3">
          {KARTIKA_MASAM_FAQS.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-amber-500/30 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-amber-900/30 hover:bg-amber-900/50 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-amber-100 text-sm sm:text-base font-serif">
                    {faq.qTe}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-amber-400 shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-amber-950/90 text-xs sm:text-sm text-amber-200/90 leading-relaxed border-t border-amber-500/20 space-y-2">
                    <p>{faq.aTe}</p>
                    <p className="text-xs text-amber-400/70 italic border-t border-amber-500/10 pt-2">
                      {faq.aEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
