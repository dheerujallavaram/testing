import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  ShieldCheck,
  LogIn,
  LogOut,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  MessageCircle,
  Sparkles,
  FileText,
  Megaphone,
  Users,
  Smartphone,
  ArrowLeft,
  Phone,
  Calendar,
  Search,
  Printer,
  Save,
} from 'lucide-react';
import {
  auth,
  db,
  ADMIN_OWNER_EMAIL,
  isUserSuperAdmin,
  signInWithGooglePopup,
  signOutAdmin,
  upsertLiveSiteAnnouncement,
  createBookingRecordInFirestore,
  updateBookingStatusInFirestore,
  deleteBookingFromFirestore,
  createKundaliRecordInFirestore,
  updateKundaliRecordInFirestore,
  deleteKundaliRecordFromFirestore,
  handleFirestoreError,
  OperationType,
  type BookingInquiryDoc,
  type KundaliRecordDoc,
  type SiteAnnouncementDoc,
} from '../firebase';
import { ALL_RASHIS, NAKSHATRAS, POOJA_SERVICES } from '../data/panchangamData';
import { computeAccurateJanmaKundali } from '../utils/astronomyPanchangam';
import { DayData } from '../types/panchangam';
import { OmEmblem } from './OmEmblem';

export interface ClientKundaliPrefill {
  name: string;
  birthDate: string;
  birthTime: string;
  cityId: string;
  autoOpenPrint?: boolean;
}

interface AdminDashboardProps {
  currentDay: DayData;
  onBackToSite: () => void;
  onOpenClientKundali: (client: ClientKundaliPrefill) => void;
}

const ADMIN_BIRTH_CITIES = [
  { id: 'hyderabad', labelTe: 'హైదరాబాద్ (Hyderabad, TS)', lat: 17.385, lon: 78.4867, tz: 5.5 },
  { id: 'vijayawada', labelTe: 'విజయవాడ (Vijayawada, AP)', lat: 16.5062, lon: 80.648, tz: 5.5 },
  { id: 'visakhapatnam', labelTe: 'విశాఖపట్నం (Visakhapatnam, AP)', lat: 17.6868, lon: 83.2185, tz: 5.5 },
  { id: 'tirupati', labelTe: 'తిరుపతి (Tirupati, AP)', lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { id: 'warangal', labelTe: 'వరంగల్ (Warangal, TS)', lat: 17.9689, lon: 79.5941, tz: 5.5 },
  { id: 'guntur', labelTe: 'గుంటూరు (Guntur, AP)', lat: 16.3067, lon: 80.4365, tz: 5.5 },
  { id: 'rajahmundry', labelTe: 'రాజమండ్రి (Rajahmundry, AP)', lat: 17.0005, lon: 81.804, tz: 5.5 },
  { id: 'nellore', labelTe: 'నెల్లూరు (Nellore, AP)', lat: 14.4426, lon: 79.9865, tz: 5.5 },
  { id: 'kurnool', labelTe: 'కర్నూలు (Kurnool, AP)', lat: 15.8281, lon: 78.0373, tz: 5.5 },
  { id: 'karimnagar', labelTe: 'కరీంనగర్ (Karimnagar, TS)', lat: 18.4386, lon: 79.1288, tz: 5.5 },
  { id: 'nizamabad', labelTe: 'నిజామాబాద్ (Nizamabad, TS)', lat: 18.6725, lon: 78.0941, tz: 5.5 },
  { id: 'khammam', labelTe: 'ఖమ్మం (Khammam, TS)', lat: 17.2473, lon: 80.1514, tz: 5.5 },
  { id: 'anantapur', labelTe: 'అనంతపురం (Anantapur, AP)', lat: 14.6819, lon: 77.6006, tz: 5.5 },
  { id: 'kadapa', labelTe: 'కడప (Kadapa, AP)', lat: 14.4673, lon: 78.8242, tz: 5.5 },
  { id: 'bengaluru', labelTe: 'బెంగళూరు (Bengaluru, KA)', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { id: 'chennai', labelTe: 'చెన్నై (Chennai, TN)', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { id: 'dallas', labelTe: 'డల్లాస్, అమెరికా (Dallas, USA)', lat: 32.7767, lon: -96.797, tz: -6 },
  { id: 'newyork', labelTe: 'న్యూయార్క్, అమెరికా (New York, USA)', lat: 40.7128, lon: -74.006, tz: -5 },
  { id: 'sanjose', labelTe: 'కాలిఫోర్నియా (San Jose, USA)', lat: 37.3382, lon: -121.8863, tz: -8 },
  { id: 'london', labelTe: 'లండన్ (London, UK)', lat: 51.5072, lon: -0.1276, tz: 0 },
  { id: 'sydney', labelTe: 'సిడ్నీ (Sydney, Australia)', lat: -33.8688, lon: 151.2093, tz: 10 },
];

const VIMSHOTTARI_LORDS_TE = [
  { lordTe: 'కేతు మహాదశ', years: 7 },
  { lordTe: 'శుక్ర మహాదశ', years: 20 },
  { lordTe: 'రవి (సూర్య) మహాదశ', years: 6 },
  { lordTe: 'చంద్ర మహాదశ', years: 10 },
  { lordTe: 'కుజ మహాదశ', years: 7 },
  { lordTe: 'రాహు మహాదశ', years: 18 },
  { lordTe: 'గురు మహాదశ', years: 16 },
  { lordTe: 'శని మహాదశ', years: 19 },
  { lordTe: 'బుధ మహాదశ', years: 17 },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentDay,
  onBackToSite,
  onOpenClientKundali,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'kundali' | 'announcements'>('bookings');
  const [statusFeedback, setStatusFeedback] = useState<string>('');

  // Firestore Real-time States
  const [bookings, setBookings] = useState<BookingInquiryDoc[]>([]);
  const [kundaliRecords, setKundaliRecords] = useState<KundaliRecordDoc[]>([]);
  const [liveAnnouncement, setLiveAnnouncement] = useState<SiteAnnouncementDoc | null>(null);

  // Filters for Bookings
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddBookingForm, setShowAddBookingForm] = useState<boolean>(false);

  // New Booking Form State
  const [newBookingType, setNewBookingType] = useState<'pooja' | 'kundali_pdf' | 'muhurtham' | 'consultation'>('kundali_pdf');
  const [newServiceName, setNewServiceName] = useState<string>('100 పేజీల సంపూర్ణ జన్మ కుండలి PDF రిపోర్ట్');
  const [newDevoteeName, setNewDevoteeName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newGotram, setNewGotram] = useState<string>('');
  const [newRashi, setNewRashi] = useState<string>(ALL_RASHIS[0].name);
  const [newNakshatram, setNewNakshatram] = useState<string>(NAKSHATRAS[0].telugu);
  const [newDate, setNewDate] = useState<string>('1995-06-15');
  const [newBirthTime, setNewBirthTime] = useState<string>('09:30');
  const [newBirthPlace, setNewBirthPlace] = useState<string>('హైదరాబాద్');
  const [newNotes, setNewNotes] = useState<string>('');

  // Quick Kundali Calculator & Record Form State
  const [kClientName, setKClientName] = useState<string>('');
  const [kPhone, setKPhone] = useState<string>('');
  const [kGotram, setKGotram] = useState<string>('');
  const [kBirthDate, setKBirthDate] = useState<string>('1994-08-15');
  const [kBirthTime, setKBirthTime] = useState<string>('09:30');
  const [kCityId, setKCityId] = useState<string>('hyderabad');
  const [kGuruNotes, setKGuruNotes] = useState<string>('');
  const [kPdfDelivered, setKPdfDelivered] = useState<boolean>(false);

  // Announcement Form State
  const [annBadgeTe, setAnnBadgeTe] = useState<string>('గురువుగారి నేటి విశేష సందేశం');
  const [annTitleTe, setAnnTitleTe] = useState<string>(
    `ఈ రోజు నక్షత్రం: ${currentDay.panchanga.nakshatram.split('(')[0].trim()} — విశేష జ్యోతిష్య & ముహూర్త సూచన`
  );
  const [annTitleEn, setAnnTitleEn] = useState<string>(
    `Today Special Nakshatra & Horoscope Guidance — Sri Sai Dheeraj Sharma`
  );
  const [annMessageTe, setAnnMessageTe] = useState<string>(
    'మీ పుట్టిన తేదీ, సమయం ఆధారంగా 100 పేజీల సంపూర్ణ బృహత్ జాతక కుండలి PDF రిపోర్ట్, వివాహ పొంతన మరియు దోష నివారణ పరిహారాల కొరకు ఇప్పుడే సంప్రదించండి.'
  );
  const [annMessageEn, setAnnMessageEn] = useState<string>(
    'Get your personalized 100-page Brihat Jataka Janma Kundali PDF report, marriage compatibility, and Vedic remedies directly on WhatsApp.'
  );
  const [annCtaLabelTe, setAnnCtaLabelTe] = useState<string>('మీ జన్మ కుండలి 100 పేజీల PDF పొందండి');
  const [annCtaTarget, setAnnCtaTarget] = useState<'jathakam' | 'panchangam' | 'booking' | 'whatsapp'>('jathakam');
  const [annHoursTe, setAnnHoursTe] = useState<string>(
    'ఉదయం 06:30 AM – 12:30 PM | సాయంత్రం 04:30 PM – 08:30 PM'
  );
  const [annIsActive, setAnnIsActive] = useState<boolean>(true);

  const isAdmin = isUserSuperAdmin(user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Attach Firestore listeners only when auth is ready and user is authenticated
  useEffect(() => {
    if (!authReady || !user) {
      setBookings([]);
      setKundaliRecords([]);
      return;
    }

    const bookingsQuery = isAdmin
      ? collection(db, 'bookings')
      : query(collection(db, 'bookings'), where('ownerId', '==', user.uid));

    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const list: BookingInquiryDoc[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<BookingInquiryDoc, 'id'>),
        }));
        list.sort((a, b) => {
          const tA = a.createdAt?.toMillis?.() ?? 0;
          const tB = b.createdAt?.toMillis?.() ?? 0;
          return tB - tA;
        });
        setBookings(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'bookings');
      }
    );

    const kundaliQuery = isAdmin
      ? collection(db, 'kundaliRecords')
      : query(collection(db, 'kundaliRecords'), where('ownerId', '==', user.uid));

    const unsubKundali = onSnapshot(
      kundaliQuery,
      (snapshot) => {
        const list: KundaliRecordDoc[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<KundaliRecordDoc, 'id'>),
        }));
        list.sort((a, b) => {
          const tA = a.createdAt?.toMillis?.() ?? 0;
          const tB = b.createdAt?.toMillis?.() ?? 0;
          return tB - tA;
        });
        setKundaliRecords(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'kundaliRecords');
      }
    );

    const annQuery = isAdmin
      ? collection(db, 'siteAnnouncements')
      : query(collection(db, 'siteAnnouncements'), where('isActive', '==', true));

    const unsubAnn = onSnapshot(
      annQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const d = snapshot.docs[0];
          const data = { id: d.id, ...(d.data() as Omit<SiteAnnouncementDoc, 'id'>) };
          setLiveAnnouncement(data);
          setAnnBadgeTe(data.badgeTe);
          setAnnTitleTe(data.titleTe);
          setAnnTitleEn(data.titleEn);
          setAnnMessageTe(data.messageTe);
          setAnnMessageEn(data.messageEn);
          setAnnCtaLabelTe(data.ctaLabelTe);
          setAnnCtaTarget(data.ctaTarget);
          setAnnHoursTe(data.consultationHoursTe);
          setAnnIsActive(data.isActive);
        }
      },
      () => {}
    );

    return () => {
      unsubBookings();
      unsubKundali();
      unsubAnn();
    };
  }, [authReady, user, isAdmin]);

  // Live astronomical computation for the Admin Kundali Calculator
  const selectedKundaliCity = useMemo(
    () => ADMIN_BIRTH_CITIES.find((c) => c.id === kCityId) || ADMIN_BIRTH_CITIES[0],
    [kCityId]
  );

  const computedKundaliPreview = useMemo(() => {
    const astro = computeAccurateJanmaKundali(
      kBirthDate,
      kBirthTime,
      selectedKundaliCity.lat,
      selectedKundaliCity.lon,
      selectedKundaliCity.tz
    );
    const birthYear = Number(kBirthDate.split('-')[0]) || 1994;
    const startDashaIdx = (astro.nakshatraIdx - 1) % 9;
    const currentYear = new Date().getFullYear();
    let cursorYear = birthYear;
    let activeDashaTe = VIMSHOTTARI_LORDS_TE[startDashaIdx].lordTe;

    for (let i = 0; i < 9; i++) {
      const cfg = VIMSHOTTARI_LORDS_TE[(startDashaIdx + i) % 9];
      const duration = i === 0 ? Math.max(1, Math.round(cfg.years * astro.balanceFraction)) : cfg.years;
      const startY = cursorYear;
      const endY = cursorYear + duration;
      cursorYear = endY;
      if (currentYear >= startY && currentYear < endY) {
        activeDashaTe = `${cfg.lordTe} (${startY} - ${endY})`;
        break;
      }
    }

    return {
      rashiTe: astro.rashi.te,
      nakshatraTe: `${astro.nakshatraName} (${astro.pada}వ పాదం)`,
      lagnaTe: astro.lagna.te,
      navamshaLagnaTe: astro.navamshaLagna.te,
      activeDashaTe,
    };
  }, [kBirthDate, kBirthTime, selectedKundaliCity]);

  const showToast = (msg: string) => {
    setStatusFeedback(msg);
    setTimeout(() => setStatusFeedback(''), 4000);
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithGooglePopup();
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Google లాగిన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
      );
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevoteeName.trim() || !newPhone.trim()) return;
    await createBookingRecordInFirestore({
      referenceCode: `SLG-${Math.floor(100000 + Math.random() * 900000)}`,
      inquiryType: newBookingType,
      serviceName: newServiceName,
      devoteeName: newDevoteeName,
      phone: newPhone,
      gotram: newGotram || 'కాశ్యప గోత్రం',
      rashi: newRashi,
      nakshatram: newNakshatram,
      preferredDate: newDate,
      birthTime: newBirthTime,
      birthPlace: newBirthPlace,
      notes: newNotes,
      status: isAdmin ? 'confirmed' : 'pending',
    });
    setNewDevoteeName('');
    setNewPhone('');
    setNewNotes('');
    setShowAddBookingForm(false);
    showToast('✅ కస్టమర్ బుకింగ్ / కుండలి ఎంక్వైరీ విజయవంతంగా సేవ్ చేయబడింది!');
  };

  const handleSaveKundaliRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kClientName.trim()) return;
    await createKundaliRecordInFirestore({
      clientName: kClientName,
      phone: kPhone,
      gotram: kGotram,
      birthDate: kBirthDate,
      birthTime: kBirthTime,
      birthCityId: selectedKundaliCity.id,
      birthCityLabel: selectedKundaliCity.labelTe,
      rashiTe: computedKundaliPreview.rashiTe,
      nakshatraTe: computedKundaliPreview.nakshatraTe,
      lagnaTe: computedKundaliPreview.lagnaTe,
      activeDashaTe: computedKundaliPreview.activeDashaTe,
      guruNotes: kGuruNotes,
      pdfDelivered: kPdfDelivered,
    });
    setKClientName('');
    setKPhone('');
    setKGotram('');
    setKGuruNotes('');
    showToast('✅ జాతకుని కుండలి రికార్డు డేటాబేస్‌లో సేవ్ చేయబడింది!');
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsertLiveSiteAnnouncement({
      badgeTe: annBadgeTe,
      titleTe: annTitleTe,
      titleEn: annTitleEn,
      messageTe: annMessageTe,
      messageEn: annMessageEn,
      ctaLabelTe: annCtaLabelTe,
      ctaTarget: annCtaTarget,
      consultationHoursTe: annHoursTe,
      isActive: annIsActive,
    });
    showToast(
      annIsActive
        ? '✅ వెబ్‌సైట్ లైవ్ ప్రకటన అప్‌డేట్ చేయబడింది! ఇప్పుడు హోమ్ పేజీలో కనిపిస్తుంది.'
        : 'ℹ️ వెబ్‌సైట్ ప్రకటన ఆఫ్ చేయబడింది (Hidden from site).'
    );
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingFilter !== 'all' && b.status !== bookingFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.devoteeName.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.referenceCode.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookings, bookingFilter, searchQuery]);

  const formatBookingWhatsAppReply = (b: BookingInquiryDoc) => {
    const cleanPhone = b.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone || '918977986166';
    const msg =
      `ఓం శ్రీ మహాగణాధిపతయే నమః 🙏\n` +
      `నమస్కారం ${b.devoteeName} గారు,\n` +
      `శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ) నుండి మీ అభ్యర్థన నిర్ధారించబడింది.\n\n` +
      `📌 రిఫరెన్స్: ${b.referenceCode}\n` +
      `🕉️ సేవ: ${b.serviceName}\n` +
      `🌟 రాశి / నక్షత్రం: ${b.rashi} / ${b.nakshatram}\n` +
      `📅 తేదీ: ${b.preferredDate}${b.birthTime ? ` (${b.birthTime})` : ''}\n` +
      `📍 ప్రాంతం: ${b.birthPlace}\n` +
      (b.notes ? `📝 సూచన: ${b.notes}\n` : '') +
      `\nశుభం భూయాత్! — www.telugujyothisham.com`;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  };

  const formatKundaliWhatsAppShare = (rec: KundaliRecordDoc) => {
    const cleanPhone = rec.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone || '918977986166';
    const msg =
      `ఓం శ్రీ లక్ష్మీ గణపతయే నమః 🙏\n` +
      `సంపూర్ణ దృక్సిద్ధాంత జన్మ కుండలి విశ్లేషణ — బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ\n\n` +
      `👤 పేరు: ${rec.clientName}\n` +
      `📅 పుట్టిన తేదీ & సమయం: ${rec.birthDate} | ${rec.birthTime}\n` +
      `📍 జన్మ స్థలం: ${rec.birthCityLabel}\n` +
      `🌙 జన్మ రాశి: ${rec.rashiTe}\n` +
      `⭐ జన్మ నక్షత్రం: ${rec.nakshatraTe}\n` +
      `🌅 జన్మ లగ్నం (D1): ${rec.lagnaTe}\n` +
      `⏳ ప్రస్తుత మహాదశ: ${rec.activeDashaTe}\n` +
      (rec.guruNotes ? `\n🔱 గురువుగారి పరిహార సూచనలు:\n${rec.guruNotes}\n` : '') +
      `\nశ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — www.telugujyothisham.com (8977986166)`;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-8 font-telugu pb-12" data-nosnippet>
      {/* Top Admin Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#3b1506] to-amber-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/70 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center shrink-0">
              <OmEmblem className="w-8 h-8 text-amber-300" size={32} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-amber-950 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck size={13} />
                  <span>అధికారిక అడ్మిన్ యాప్ • ADMIN PORTAL</span>
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold">
                    ✓ Super Admin Verified ({user?.email})
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
                శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — అడ్మిన్ కంట్రోల్ ప్యానెల్
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
                బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి కస్టమర్ బుకింగ్స్, 100-పేజీల జన్మ కుండలి PDF జనరేటర్ & లైవ్ వెబ్‌సైట్ మేనేజ్‌మెంట్
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-900/70 hover:bg-amber-800 text-amber-100 border border-amber-600/60 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>వెబ్‌సైట్‌కు తిరిగి వెళ్ళండి</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={() => signOutAdmin()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-600/50 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>లాగ్ అవుట్ (Sign Out)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {statusFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-emerald-100 border-2 border-emerald-400 font-bold text-sm shadow-lg flex items-center justify-between">
          <span>{statusFeedback}</span>
          <button
            type="button"
            onClick={() => setStatusFeedback('')}
            className="text-xs underline ml-4 cursor-pointer"
          >
            మూసివేయి
          </button>
        </div>
      )}

      {/* Authentication Gate */}
      {!authReady ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-amber-200 shadow-sm">
          <p className="text-base font-bold text-amber-900 animate-pulse">
            అడ్మిన్ సెషన్ తనిఖీ చేయబడుతోంది... • Checking Admin Session...
          </p>
        </div>
      ) : !user ? (
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Login Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-extrabold">
                <ShieldCheck size={15} />
                <span>Google భద్రతా లాగిన్ • Secure Admin Sign-In</span>
              </span>
              <h2 className="text-2xl font-extrabold text-amber-950">
                అడ్మిన్ ప్యానెల్‌లోకి ప్రవేశించండి
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                ఈ అడ్మిన్ ప్యానెల్ కేవలం <strong>{ADMIN_OWNER_EMAIL}</strong> (బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి) Google ఖాతాకు మాత్రమే పూర్తి యాక్సెస్ ఇస్తుంది.
              </p>
              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 font-semibold">
                  {authError}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-800 hover:to-amber-700 text-white font-extrabold text-base shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <LogIn size={20} />
                <span>Google ఖాతాతో లాగిన్ అవ్వండి ({ADMIN_OWNER_EMAIL})</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                🔒 Firebase Enterprise Zero-Trust భద్రతతో రక్షించబడింది. పాస్‌వర్డ్ లీక్ అయ్యే ప్రమాదం లేదు.
              </p>
            </div>
          </div>

          {/* Mobile PWA App Install Guide Card */}
          <div className="bg-amber-50/90 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-amber-950">
              <Smartphone size={24} className="text-amber-700 shrink-0" />
              <h3 className="text-lg sm:text-xl font-extrabold">
                మీ ఫోన్‌లో దీన్ని &ldquo;Admin App&rdquo; లాగా ఎలా ఇన్‌స్టాల్ చేసుకోవాలి?
              </h3>
            </div>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 list-decimal list-inside leading-relaxed">
              <li>
                మీ మొబైల్ ఫోన్‌లో Chrome లేదా Safari బ్రౌజర్‌లో <strong>www.telugujyothisham.com/admin</strong> ఓపెన్ చేయండి.
              </li>
              <li>
                పైన కుడివైపున ఉన్న <strong>3 చుక్కలు (⋮ మెనూ)</strong> క్లిక్ చేసి <strong>&ldquo;Add to Home Screen&rdquo;</strong> లేదా <strong>&ldquo;Install App&rdquo;</strong> నొక్కండి.
              </li>
              <li>
                అంతే! మీ ఫోన్ స్క్రీన్ మీద <strong>శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం Admin</strong> యాప్ ఐకాన్ వచ్చేస్తుంది.
              </li>
              <li>
                ఇకపై మీరు ఒక్క ట్యాప్‌తో కస్టమర్ల జాతకాలు, 100-పేజీల PDF లు, బుకింగ్స్ మరియు సైట్ ప్రకటనలు మీ ఫోన్ నుండే కంట్రోల్ చేయవచ్చు!
              </li>
            </ol>
          </div>
        </div>
      ) : !isAdmin ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase">
                లాగిన్ అయిన ఖాతా • Signed In Account
              </span>
              <h2 className="text-xl font-bold text-amber-950">{user.email}</h2>
              <p className="text-xs text-slate-600 mt-1">
                గమనిక: పూర్తి అడ్మిన్ కంట్రోల్స్ కేవలం <strong>{ADMIN_OWNER_EMAIL}</strong> ఖాతాకు మాత్రమే అందుబాటులో ఉంటాయి. మీరు ఆ ఖాతాతో లాగిన్ అవ్వడానికి కింద బటన్ నొక్కండి.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 cursor-pointer"
            >
              వేరే Google ఖాతా ఎంచుకోండి ({ADMIN_OWNER_EMAIL})
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Admin KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">మొత్తం బుకింగ్స్ & ఎంక్వైరీలు</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1">{bookings.length}</p>
              <span className="text-[11px] text-amber-800 font-semibold">
                పెండింగ్: {bookings.filter((b) => b.status === 'pending').length}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">100-పేజీల కుండలి PDF ఎంక్వైరీలు</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1">
                {bookings.filter((b) => b.inquiryType === 'kundali_pdf').length + kundaliRecords.length}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold">
                సేవ్ చేసిన కుండలిలు: {kundaliRecords.length}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">పూర్తయిన సేవలు (Completed)</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">
                {bookings.filter((b) => b.status === 'completed').length +
                  kundaliRecords.filter((k) => k.pdfDelivered).length}
              </p>
              <span className="text-[11px] text-slate-500 font-semibold">
                PDF డెలివరీ: {kundaliRecords.filter((k) => k.pdfDelivered).length}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">వెబ్‌సైట్ లైవ్ ప్రకటన స్థితి</span>
              <p className="text-lg sm:text-xl font-extrabold text-amber-950 mt-1">
                {liveAnnouncement?.isActive ? '🟢 ఆన్‌లో ఉంది (Live)' : '⚪ ఆఫ్‌లో ఉంది'}
              </p>
              <span className="text-[11px] text-amber-800 font-semibold truncate block">
                {liveAnnouncement?.titleTe || 'ఇంకా ప్రకటన సెట్ చేయలేదు'}
              </span>
            </div>
          </div>

          {/* 3-Tab Admin Navigation */}
          <div className="bg-amber-950 p-2 rounded-2xl border-2 border-amber-500/60 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('bookings')}
              className={`py-3 px-4 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'bookings'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-extrabold shadow-md'
                  : 'text-amber-100 hover:bg-amber-900/70'
              }`}
            >
              <Users size={20} className="shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">1. CRM & Bookings</div>
                <div className="text-sm font-bold">📋 బుకింగ్స్ & PDF ఎంక్వైరీలు ({bookings.length})</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('kundali')}
              className={`py-3 px-4 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'kundali'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-extrabold shadow-md'
                  : 'text-amber-100 hover:bg-amber-900/70'
              }`}
            >
              <FileText size={20} className="shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">2. 100-Page PDF Tool</div>
                <div className="text-sm font-bold">📜 కుండలి PDF జనరేటర్ & రికార్డులు ({kundaliRecords.length})</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('announcements')}
              className={`py-3 px-4 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'announcements'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-extrabold shadow-md'
                  : 'text-amber-100 hover:bg-amber-900/70'
              }`}
            >
              <Megaphone size={20} className="shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">3. Live Website Control</div>
                <div className="text-sm font-bold">📢 సైట్ లైవ్ ప్రకటన & సమయాలు</div>
              </div>
            </button>
          </div>

          {/* TAB 1: BOOKINGS & INQUIRIES CRM */}
          {activeSubTab === 'bookings' && (
            <div className="space-y-6">
              {/* Filter & Action Bar */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'all', label: 'అన్నీ (All)' },
                      { id: 'pending', label: 'పెండింగ్ (Pending)' },
                      { id: 'confirmed', label: 'నిర్ధారించినవి (Confirmed)' },
                      { id: 'completed', label: 'పూర్తయినవి (Completed)' },
                      { id: 'cancelled', label: 'రద్దయినవి (Cancelled)' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBookingFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        bookingFilter === f.id
                          ? 'bg-amber-800 text-white'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative flex-1 sm:w-64">
                    <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="పేరు / ఫోన్ / ID వెతకండి..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-amber-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddBookingForm(!showAddBookingForm)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>+ కొత్త బుకింగ్ / కస్టమర్ జోడించండి</span>
                  </button>
                </div>
              </div>

              {/* Add Booking Form */}
              {showAddBookingForm && (
                <form
                  onSubmit={handleCreateBooking}
                  className="bg-amber-50/90 rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <h3 className="text-lg font-extrabold text-amber-950">
                      కొత్త కస్టమర్ బుకింగ్ / 100-పేజీల కుండలి PDF ఎంక్వైరీ నమోదు
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddBookingForm(false)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                    >
                      మూసివేయి ✕
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">ఎంక్వైరీ రకం *</label>
                      <select
                        value={newBookingType}
                        onChange={(e) => {
                          const val = e.target.value as 'pooja' | 'kundali_pdf' | 'muhurtham' | 'consultation';
                          setNewBookingType(val);
                          if (val === 'kundali_pdf') {
                            setNewServiceName('100 పేజీల సంపూర్ణ జన్మ కుండలి PDF రిపోర్ట్');
                          } else if (val === 'muhurtham') {
                            setNewServiceName('శుభ ముహూర్త నిర్ణయం (వివాహ / గృహప్రవేశం)');
                          } else if (val === 'consultation') {
                            setNewServiceName('వ్యక్తిగత జ్యోతిష సంప్రదింపు & దోష పరిహారం');
                          } else {
                            setNewServiceName(POOJA_SERVICES[0].teluguName);
                          }
                        }}
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                      >
                        <option value="kundali_pdf">📜 100 పేజీల జన్మ కుండలి PDF</option>
                        <option value="pooja">🔥 వైదిక పూజ / హోమం బుకింగ్</option>
                        <option value="muhurtham">📅 శుభ ముహూర్త నిర్ణయం</option>
                        <option value="consultation">🙏 జ్యోతిష సంప్రదింపు</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">సేవ పేరు *</label>
                      <input
                        type="text"
                        required
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">భక్తుని / జాతకుని పేరు *</label>
                      <input
                        type="text"
                        required
                        value={newDevoteeName}
                        onChange={(e) => setNewDevoteeName(e.target.value)}
                        placeholder="పూర్తి పేరు"
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">వాట్సాప్ / ఫోన్ నంబర్ *</label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="10 అంకెల నంబర్"
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">గోత్రం</label>
                      <input
                        type="text"
                        value={newGotram}
                        onChange={(e) => setNewGotram(e.target.value)}
                        placeholder="ఉదా: కాశ్యప, భరద్వాజ..."
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">పుట్టిన తేదీ / పూజా తేదీ</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">పుట్టిన సమయం (కుండలికి)</label>
                      <input
                        type="time"
                        value={newBirthTime}
                        onChange={(e) => setNewBirthTime(e.target.value)}
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">జన్మ స్థలం / పూజ ప్రాంతం</label>
                      <input
                        type="text"
                        value={newBirthPlace}
                        onChange={(e) => setNewBirthPlace(e.target.value)}
                        placeholder="ఉదా: హైదరాబాద్, విజయవాడ..."
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1">రాశి</label>
                        <select
                          value={newRashi}
                          onChange={(e) => setNewRashi(e.target.value)}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                        >
                          {ALL_RASHIS.map((r) => (
                            <option key={r.id} value={r.name}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1">నక్షత్రం</label>
                        <select
                          value={newNakshatram}
                          onChange={(e) => setNewNakshatram(e.target.value)}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                        >
                          {NAKSHATRAS.map((n) => (
                            <option key={n.index} value={n.telugu}>
                              {n.telugu}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      సంకల్ప కోరిక / అడ్మిన్ నోట్స్
                    </label>
                    <input
                      type="text"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="ఉదా: వివాహ పొంతన, 100 పేజీల PDF వాట్సాప్‌లో పంపాలి..."
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-extrabold shadow-md cursor-pointer"
                    >
                      బుకింగ్ సేవ్ చేయండి
                    </button>
                  </div>
                </form>
              )}

              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-amber-200 space-y-3">
                  <p className="text-base font-bold text-amber-950">
                    ప్రస్తుతం ఈ విభాగంలో బుకింగ్స్ ఏవీ లేవు.
                  </p>
                  <p className="text-xs text-slate-500">
                    వెబ్‌సైట్‌లో భక్తులు పూజ / 100-పేజీల కుండలి బుక్ చేసినా లేదా మీరు పైన &ldquo;+ కొత్త బుకింగ్&rdquo; నొక్కినా ఇక్కడ కనిపిస్తాయి.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-xs hover:border-amber-400 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950">
                            {b.referenceCode}
                          </span>
                          <span
                            className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                              b.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-900'
                                : b.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-900'
                                : b.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-amber-200/80 text-amber-950'
                            }`}
                          >
                            {b.status === 'completed'
                              ? '✓ పూర్తయింది (Completed)'
                              : b.status === 'confirmed'
                              ? '● నిర్ధారించబడింది (Confirmed)'
                              : b.status === 'cancelled'
                              ? '✕ రద్దయింది (Cancelled)'
                              : '⏳ పెండింగ్ (Pending)'}
                          </span>
                          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            {b.serviceName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${b.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                          >
                            <Phone size={13} />
                            <span>{b.phone}</span>
                          </a>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block">భక్తుని పేరు:</span>
                          <strong className="text-slate-900 text-sm">{b.devoteeName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">గోత్రం / రాశి / నక్షత్రం:</span>
                          <strong className="text-slate-900">
                            {b.gotram} • {b.rashi} ({b.nakshatram})
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">తేదీ & సమయం:</span>
                          <strong className="text-slate-900">
                            <Calendar size={12} className="inline mr-1 text-amber-700" />
                            {b.preferredDate} {b.birthTime ? `• ${b.birthTime}` : ''}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">ప్రాంతం / వేదిక:</span>
                          <strong className="text-slate-900">{b.birthPlace}</strong>
                        </div>
                      </div>

                      {b.notes && (
                        <p className="text-xs bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 text-amber-950">
                          <strong>సంకల్ప కోరిక / నోట్స్:</strong> {b.notes}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={formatBookingWhatsAppReply(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-extrabold shadow-xs"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp కన్ఫర్మేషన్ పంపండి</span>
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              onOpenClientKundali({
                                name: b.devoteeName,
                                birthDate: b.preferredDate.match(/^\d{4}-\d{2}-\d{2}$/)
                                  ? b.preferredDate
                                  : '1994-08-15',
                                birthTime: b.birthTime || '09:30',
                                cityId: 'hyderabad',
                                autoOpenPrint: true,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-200 text-xs font-bold cursor-pointer"
                          >
                            <Printer size={14} />
                            <span>100-పేజీల కుండలి PDF తెరవండి</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateBookingStatusInFirestore(b.id, 'confirmed')}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold cursor-pointer"
                          >
                            <CheckCircle2 size={13} className="inline mr-1" />
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBookingStatusInFirestore(b.id, 'completed')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer"
                          >
                            <CheckCircle2 size={13} className="inline mr-1" />
                            Complete
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBookingStatusInFirestore(b.id, 'cancelled')}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold cursor-pointer"
                          >
                            <XCircle size={13} className="inline mr-1" />
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBookingFromFirestore(b.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 100-PAGE KUNDALI PDF GENERATOR & SAVED HOROSCOPE RECORDS */}
          {activeSubTab === 'kundali' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Left 7 Cols: Quick Client Kundali Calculator & Record Creator */}
                <form
                  onSubmit={handleSaveKundaliRecord}
                  className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4"
                >
                  <div className="border-b border-amber-200 pb-3">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Admin Instant Kundali & 100-Page PDF Tool
                    </span>
                    <h3 className="text-xl font-extrabold text-amber-950">
                      జాతకుని కుండలి గణన & 100-పేజీల PDF జనరేటర్
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        జాతకుని పూర్తి పేరు (Client Name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={kClientName}
                        onChange={(e) => setKClientName(e.target.value)}
                        placeholder="ఉదా: వెంకట రమణ"
                        className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        వాట్సాప్ ఫోన్ నంబర్ (WhatsApp Number)
                      </label>
                      <input
                        type="tel"
                        value={kPhone}
                        onChange={(e) => setKPhone(e.target.value)}
                        placeholder="10 అంకెల మొబైల్ నంబర్"
                        className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        పుట్టిన తేదీ (Birth Date) *
                      </label>
                      <input
                        type="date"
                        required
                        value={kBirthDate}
                        onChange={(e) => setKBirthDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        పుట్టిన సమయం (Birth Time) *
                      </label>
                      <input
                        type="time"
                        required
                        value={kBirthTime}
                        onChange={(e) => setKBirthTime(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        జన్మ స్థలం (Birth City - India & NRI)
                      </label>
                      <select
                        value={kCityId}
                        onChange={(e) => setKCityId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                      >
                        {ADMIN_BIRTH_CITIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.labelTe}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        గోత్రం (Gotram)
                      </label>
                      <input
                        type="text"
                        value={kGotram}
                        onChange={(e) => setKGotram(e.target.value)}
                        placeholder="ఉదా: భరద్వాజ గోత్రం"
                        className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      గురువుగారి ప్రత్యేక జ్యోతిష్య & పరిహార సూచనలు (Guruji Custom Remedies / Notes):
                    </label>
                    <textarea
                      rows={3}
                      value={kGuruNotes}
                      onChange={(e) => setKGuruNotes(e.target.value)}
                      placeholder="ఉదా: గురు బలం కోసం ప్రతి గురువారం దత్తాత్రేయ స్తోత్ర పారాయణ మరియు గోసేవ చేయవలెను..."
                      className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kPdfDelivered}
                      onChange={(e) => setKPdfDelivered(e.target.checked)}
                      className="rounded border-amber-400"
                    />
                    <span>100-పేజీల కుండలి PDF కస్టమర్‌కు వాట్సాప్‌లో పంపబడింది (Mark PDF Delivered)</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-extrabold shadow-md cursor-pointer"
                    >
                      <Save size={16} />
                      <span>కుండలి రికార్డు సేవ్ చేయండి</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenClientKundali({
                          name: kClientName || 'శ్రీనివాస రావు',
                          birthDate: kBirthDate,
                          birthTime: kBirthTime,
                          cityId: kCityId,
                          autoOpenPrint: true,
                        })
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-md cursor-pointer"
                    >
                      <Printer size={16} />
                      <span>📜 పూర్తి 100-పేజీల కుండలి PDF ప్రింట్ / డౌన్‌లోడ్ తెరవండి</span>
                    </button>
                  </div>
                </form>

                {/* Right 5 Cols: Live Computed Drik-Siddhanta Preview */}
                <div className="lg:col-span-5 bg-gradient-to-br from-amber-950 via-[#3b1506] to-amber-950 text-white rounded-3xl p-6 border-2 border-amber-500/70 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-800 pb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                        NASA DE405 + లహిరి చిత్రపక్ష అయనాంశం
                      </span>
                      <h4 className="text-lg font-extrabold text-white">
                        తక్షణ దృక్సిద్ధాంత జాతక సారాంశం
                      </h4>
                    </div>
                    <Sparkles size={20} className="text-amber-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-700/60">
                      <span className="text-amber-300 block">జన్మ రాశి (Moon Sign):</span>
                      <strong className="text-base text-white">{computedKundaliPreview.rashiTe}</strong>
                    </div>
                    <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-700/60">
                      <span className="text-amber-300 block">జన్మ నక్షత్రం & పాదం:</span>
                      <strong className="text-base text-white">{computedKundaliPreview.nakshatraTe}</strong>
                    </div>
                    <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-700/60">
                      <span className="text-amber-300 block">జన్మ లగ్నం (D1 Lagna):</span>
                      <strong className="text-base text-amber-200">{computedKundaliPreview.lagnaTe}</strong>
                    </div>
                    <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-700/60">
                      <span className="text-amber-300 block">నవాంశ లగ్నం (D9):</span>
                      <strong className="text-base text-amber-200">{computedKundaliPreview.navamshaLagnaTe}</strong>
                    </div>
                  </div>

                  <div className="bg-amber-400/15 p-3.5 rounded-xl border border-amber-400/50 text-xs">
                    <span className="text-amber-300 block font-bold">ప్రస్తుత వింశోత్తరి మహాదశ:</span>
                    <strong className="text-sm text-amber-100">{computedKundaliPreview.activeDashaTe}</strong>
                  </div>

                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    💡 మీరు పక్కన ఉన్న ఫారమ్‌లో వివరాలు ఎంటర్ చేసి <strong>&ldquo;పూర్తి 100-పేజీల కుండలి PDF ప్రింట్ / డౌన్‌లోడ్ తెరవండి&rdquo;</strong> నొక్కగానే జాతకుని D1, D9 చక్రాలు, 12 భావాల ఫలితాలు, 96 ఏళ్ల భృగు చక్ర గమనం మరియు పరిహారాలతో పూర్తి PDF రిపోర్ట్ సిద్ధమవుతుంది.
                  </p>
                </div>
              </div>

              {/* Saved Kundali Records List */}
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-amber-950">
                  సేవ్ చేసిన జాతకుల కుండలి రికార్డులు ({kundaliRecords.length})
                </h3>
                {kundaliRecords.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 text-xs text-slate-600">
                    ఇంకా కుండలి రికార్డులు సేవ్ చేయలేదు. పైన ఉన్న ఫారమ్‌లో వివరాలు ఎంటర్ చేసి సేవ్ చేయండి.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {kundaliRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-2.5">
                          <div>
                            <h4 className="text-base font-extrabold text-amber-950">{rec.clientName}</h4>
                            <p className="text-xs text-slate-500">
                              {rec.birthDate} • {rec.birthTime} • {rec.birthCityLabel}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              updateKundaliRecordInFirestore(rec.id, {
                                pdfDelivered: !rec.pdfDelivered,
                              })
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                              rec.pdfDelivered
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {rec.pdfDelivered ? '✓ PDF పంపబడింది' : '⏳ PDF పెండింగ్'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
                          <div>
                            <span className="text-slate-500">రాశి / నక్షత్రం:</span>{' '}
                            <strong className="text-amber-950">
                              {rec.rashiTe} • {rec.nakshatraTe}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500">లగ్నం / దశ:</span>{' '}
                            <strong className="text-amber-950">
                              {rec.lagnaTe} • {rec.activeDashaTe}
                            </strong>
                          </div>
                        </div>

                        {rec.guruNotes && (
                          <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <strong>పరిహార సూచన:</strong> {rec.guruNotes}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onOpenClientKundali({
                                  name: rec.clientName,
                                  birthDate: rec.birthDate,
                                  birthTime: rec.birthTime,
                                  cityId: rec.birthCityId,
                                  autoOpenPrint: true,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-200 text-xs font-bold cursor-pointer"
                            >
                              <Printer size={13} />
                              <span>100-పేజీల PDF తెరవండి</span>
                            </button>

                            <a
                              href={formatKundaliWhatsAppShare(rec)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-bold"
                            >
                              <MessageCircle size={13} />
                              <span>WhatsApp కు పంపండి</span>
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteKundaliRecordFromFirestore(rec.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE WEBSITE ANNOUNCEMENTS & CONSULTATION HOURS */}
          {activeSubTab === 'announcements' && (
            <form
              onSubmit={handleSaveAnnouncement}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Live Homepage & Header Bulletin Control
                  </span>
                  <h3 className="text-xl font-extrabold text-amber-950">
                    వెబ్‌సైట్ పైన కనిపించే లైవ్ ప్రకటన & సంప్రదింపు సమయాలు
                  </h3>
                  <p className="text-xs text-slate-600">
                    ఇక్కడ మీరు సేవ్ చేసే మెసేజ్ వెంటనే <strong>www.telugujyothisham.com</strong> ఓపెన్ చేసే ప్రతి విజిటర్‌కు పైన కనిపిస్తుంది.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-100 border border-amber-300 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={annIsActive}
                    onChange={(e) => setAnnIsActive(e.target.checked)}
                    className="w-4 h-4 accent-amber-800"
                  />
                  <span className="text-xs sm:text-sm font-extrabold text-amber-950">
                    {annIsActive ? '🟢 వెబ్‌సైట్‌లో కనిపించేలా ఆన్ (Active)' : '⚪ ఆఫ్ చేయబడింది (Hidden)'}
                  </span>
                </label>
              </div>

              {/* 1-Click Quick Templates */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-900 block">
                  ⚡ 1-క్లిక్ రెడీమేడ్ టెంప్లేట్లు (Quick Fill Presets):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cleanNak = currentDay.panchanga.nakshatram.split('(')[0].trim();
                      const cleanTithi = currentDay.panchanga.tithi.split('(')[0].trim();
                      setAnnBadgeTe('నేటి విశేష జ్యోతిష్య సూచన');
                      setAnnTitleTe(
                        `ఈ రోజు నక్షత్రం: ${cleanNak} | తిథి: ${cleanTithi} — మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF పొందండి`
                      );
                      setAnnTitleEn(
                        `Today's Nakshatram: ${cleanNak} | Get Your 100-Page Janma Kundali PDF Report`
                      );
                      setAnnMessageTe(
                        `నేటి శుభ సమయం: ${currentDay.shubha.amrutha}. మీ రాశి ఫలితాలు, వివాహ పొంతన మరియు 100 పేజీల బృహత్ జాతక PDF రిపోర్ట్ కొరకు శ్రీ సాయి ధీరజ్ శర్మ గారిని సంప్రదించండి.`
                      );
                      setAnnCtaLabelTe('మీ జన్మ కుండలి 100 పేజీల PDF పొందండి');
                      setAnnCtaTarget('jathakam');
                      setAnnIsActive(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950 cursor-pointer"
                  >
                    1. నేటి నక్షత్రం & 100-పేజీల కుండలి ఆఫర్
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnnBadgeTe('విశేష హోమ & పూజా సంకల్పం');
                      setAnnTitleTe(
                        'శ్రీ చండీ సహిత రుద్ర హోమం & లక్ష్మీ గణపతి హోమం — ఆన్‌లైన్ / ప్రత్యక్ష సంకల్ప బుకింగ్స్ జరుగుతున్నాయి'
                      );
                      setAnnTitleEn(
                        'Sri Chandi Sahitha Rudra Homam & Lakshmi Ganapathi Homam — Bookings Open'
                      );
                      setAnnMessageTe(
                        'గ్రహ దోష నివారణ, వివాహ, ఉద్యోగ, వ్యాపార అభివృద్ధి కొరకు మీ గోత్ర నామాలతో శాస్త్రోక్త హోమ సంకల్పం నమోదు చేసుకోండి.'
                      );
                      setAnnCtaLabelTe('పూజ / హోమం సంకల్పం బుక్ చేయండి');
                      setAnnCtaTarget('booking');
                      setAnnIsActive(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950 cursor-pointer"
                  >
                    2. విశేష చండీ హోమం / పూజా సంకల్పం ప్రకటన
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnnBadgeTe('నేరుగా వాట్సాప్ సంప్రదింపు');
                      setAnnTitleTe(
                        'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారితో వ్యక్తిగత జ్యోతిష్య & ముహూర్త సంప్రదింపులు'
                      );
                      setAnnTitleEn(
                        'Direct Horoscope & Muhurtham Consultation with Sri Jallavaram Sai Dheeraj Sharma'
                      );
                      setAnnMessageTe(
                        'వివాహ ముహూర్తాలు, గృహప్రవేశం, నూతన వ్యాపార ముహూర్తాలు మరియు జాతక పరిశీలన కొరకు వాట్సాప్ (8977986166) ద్వారా సంప్రదించండి.'
                      );
                      setAnnCtaLabelTe('వాట్సాప్‌లో సంప్రదించండి (8977986166)');
                      setAnnCtaTarget('whatsapp');
                      setAnnIsActive(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950 cursor-pointer"
                  >
                    3. ముహూర్త నిర్ణయం & వాట్సాప్ సంప్రదింపు
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    బ్యాడ్జ్ టెక్స్ట్ (Badge Label - Telugu) *
                  </label>
                  <input
                    type="text"
                    required
                    value={annBadgeTe}
                    onChange={(e) => setAnnBadgeTe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    సంప్రదింపు సమయాలు (Consultation Hours) *
                  </label>
                  <input
                    type="text"
                    required
                    value={annHoursTe}
                    onChange={(e) => setAnnHoursTe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    ప్రధాన శీర్షిక తెలుగులో (Main Headline - Telugu) *
                  </label>
                  <input
                    type="text"
                    required
                    value={annTitleTe}
                    onChange={(e) => setAnnTitleTe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    పూర్తి వివరణ తెలుగులో (Detailed Message - Telugu) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={annMessageTe}
                    onChange={(e) => setAnnMessageTe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    బటన్ పేరు (CTA Button Text) *
                  </label>
                  <input
                    type="text"
                    required
                    value={annCtaLabelTe}
                    onChange={(e) => setAnnCtaLabelTe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    బటన్ నొక్కితే ఎక్కడికి వెళ్ళాలి? (Button Target)
                  </label>
                  <select
                    value={annCtaTarget}
                    onChange={(e) =>
                      setAnnCtaTarget(e.target.value as 'jathakam' | 'panchangam' | 'booking' | 'whatsapp')
                    }
                    className="w-full p-2.5 bg-slate-50 border border-amber-300 rounded-xl text-xs font-bold"
                  >
                    <option value="jathakam">📜 మీ జాతకం / 100-పేజీల కుండలి PDF పేజీకి</option>
                    <option value="panchangam">📅 నేటి పంచాంగం పేజీకి</option>
                    <option value="booking">🔥 పూజా / హోమ బుకింగ్ ఫారమ్‌కు</option>
                    <option value="whatsapp">💬 నేరుగా WhatsApp (8977986166) కు</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white text-sm font-extrabold shadow-lg cursor-pointer"
                >
                  <Save size={18} />
                  <span>లైవ్ ప్రకటనను వెబ్‌సైట్‌లో పబ్లిష్ చేయండి</span>
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};
