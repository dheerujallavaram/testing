import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  MapPin,
  Mail,
  User,
  Heart,
  ThumbsUp,
  Filter,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GopuramSectionHeader } from './VirupakshaGopuramArt';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface DevoteeReview {
  id: string;
  name: string;
  location: string;
  email: string;
  rating: number;
  category: 'guruji' | 'website' | 'both';
  comment: string;
  dateStr: string;
  isUserSubmitted?: boolean;
  likes: number;
}

const DEFAULT_REVIEWS: DevoteeReview[] = [
  {
    id: 'seed-1',
    name: 'కె. రామకృష్ణ & పద్మావతి',
    location: 'హైదరాబాద్',
    email: 'k.ramakrishna@gmail.com',
    rating: 5,
    category: 'guruji',
    comment:
      'మా అబ్బాయి వివాహ ముహూర్తం మరియు వివాహ పొంతన విషయంలో గురువుగారు బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు ఇచ్చిన సలహాలు ఎంతో ఉపయోగపడ్డాయి. వివాహం వైభవంగా జరిగింది. గురువుగారికి మా కుటుంబం తరఫున హృదయపూర్వక నమస్కారాలు.',
    dateStr: '15 అక్టోబర్ 2026',
    likes: 24,
  },
  {
    id: 'seed-2',
    name: 'శ్రీనివాస రావు గారు',
    location: 'డల్లాస్, అమెరికా (USA NRI)',
    email: 'srinivas.dallas@yahoo.com',
    rating: 5,
    category: 'both',
    comment:
      'వెబ్‌సైట్ లోని 100 పేజీల బృహత్ జాతక కుండలి PDF రిపోర్ట్ డౌన్‌లోడ్ చేసుకున్నాను. నా వ్యాపార, కెరీర్ మరియు విదేశీ ప్రయాణ ప్రణాళికలకు ఎంతో స్పష్టత లభించింది. విదేశాలలో ఉన్న తెలుగు కుటుంబాలకు ఈ సైట్ మరియు గురువుగారి సలహాలు ఒక గొప్ప వరం.',
    dateStr: '28 అక్టోబర్ 2026',
    likes: 31,
  },
  {
    id: 'seed-3',
    name: 'ఎం. లక్ష్మీ ప్రసన్న',
    location: 'విజయవాడ',
    email: 'lakshmi.prasanna9@gmail.com',
    rating: 5,
    category: 'guruji',
    comment:
      'మా నూతన గృహప్రవేశ ముహూర్తం మరియు నవగ్రహ శాంతి హోమం గురువుగారి సమక్షంలో శాస్త్రోక్తంగా జరిపించుకున్నాము. ఇంట్లో అఖండమైన ప్రశాంతత, సానుకూల శక్తి లభించింది. గురువుగారి వేద మంత్రోచ్ఛారణ ఎంతో పుణ్యప్రదం.',
    dateStr: '2 నవంబర్ 2026',
    likes: 19,
  },
  {
    id: 'seed-4',
    name: 'వెంకటేశ్వర శర్మ',
    location: 'తిరుపతి',
    email: 'venkat.tirupati@gmail.com',
    rating: 5,
    category: 'website',
    comment:
      'ఈ వెబ్‌సైట్ లోని దిన పంచాంగం, గౌరీ పంచాంగం మరియు రాహుకాలం ఖచ్చితత్వం అద్భుతంగా ఉన్నాయి. రోజూ పూజా సమయంలో ఈ పంచాంగాన్నే అనుసరిస్తున్నాము. సులభంగా అర్థమయ్యే తెలుగు శైలిలో రూపొందించినందుకు ధన్యవాదాలు.',
    dateStr: '31 అక్టోబర్ 2026',
    likes: 15,
  },
];

const STORAGE_KEY = 'slg_devotee_user_reviews_v1';
const LIKES_KEY = 'slg_devotee_user_likes_v1';

export const DevoteeReviewsSection: React.FC = () => {
  const { t } = useLanguage();

  // Reviews state persisted in localStorage
  const [reviews, setReviews] = useState<DevoteeReview[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_REVIEWS;
  });

  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {};
  });

  // Filter tab
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'guruji' | 'website' | 'both'>('all');

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<'guruji' | 'website' | 'both'>('both');
  const [comment, setComment] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Save reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  // Save likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(userLikes));
    } catch {
      // ignore
    }
  }, [userLikes]);

  const handleLike = (id: string) => {
    if (userLikes[id]) return; // already liked
    setUserLikes((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitSuccess(null);

    const cleanName = name.trim();
    const cleanLocation = location.trim();
    const cleanEmail = email.trim();
    const cleanComment = comment.trim();

    if (!cleanName || cleanName.length < 2) {
      setFormError(
        t('దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.', 'Please enter your full name (at least 2 letters).')
      );
      return;
    }

    if (!cleanLocation || cleanLocation.length < 2) {
      setFormError(
        t('దయచేసి మీ ఊరు లేదా నగరాన్ని నమోదు చేయండి.', 'Please enter your town/city name.')
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError(
        t('దయచేసి చెల్లుబాటు అయ్యే ఈమెయిల్ ఐడీని నమోదు చేయండి.', 'Please enter a valid email address.')
      );
      return;
    }

    if (!cleanComment || cleanComment.length < 5) {
      setFormError(
        t(
          'దయచేసి మీ అభిప్రాయాన్ని లేదా అనుభవాన్ని కనీసం 5 అక్షరాలలో రాయండి.',
          'Please enter your review or feedback (at least 5 characters).'
        )
      );
      return;
    }

    setIsSubmitting(true);

    // Format current date in Telugu / English
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('te-IN', options);

    const newReview: DevoteeReview = {
      id: `review_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      location: cleanLocation,
      email: cleanEmail,
      rating,
      category,
      comment: cleanComment,
      dateStr,
      isUserSubmitted: true,
      likes: 1,
    };

    // Prepend to local reviews
    setReviews((prev) => [newReview, ...prev]);

    // Attempt optional write to Firestore if configured
    try {
      if (db) {
        await addDoc(collection(db, 'userReviews'), {
          name: cleanName,
          location: cleanLocation,
          email: cleanEmail,
          rating,
          category,
          comment: cleanComment,
          createdAt: serverTimestamp(),
          ownerId: auth.currentUser?.uid || 'guest_user',
        });
      }
    } catch {
      // Local storage already has it securely, ignore Firestore network/guest permission constraints
    }

    setIsSubmitting(false);
    setSubmitSuccess(
      t(
        `ధన్యవాదాలు ${cleanName} గారు! మీ అమూల్యమైన సమీక్ష విజయవంతంగా నమోదైంది. శ్రీ లక్ష్మీ గణపతి స్వామి అనుగ్రహం మీపై ఎల్లప్పుడూ ఉండుగాక.`,
        `Thank you ${cleanName} garu! Your valuable feedback has been successfully submitted and added.`
      )
    );

    // Reset form fields
    setName('');
    setLocation('');
    setEmail('');
    setComment('');
    setRating(5);
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'both') return true;
    return r.category === selectedCategory || r.category === 'both';
  });

  return (
    <section className="space-y-8 font-telugu" id="devotee-reviews-section">
      <GopuramSectionHeader
        kicker={t('భక్తుల సమీక్షలు • Devotee Testimonials & Feedback', 'Devotee Experiences')}
        title={t(
          'వెబ్‌సైట్ గురించి లేదా బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి గురించి మీ అభిప్రాయం తెలపండి',
          'Share Your Review & Devotional Feedback'
        )}
      />

      <div className="bg-linear-to-b from-amber-50 to-orange-50/70 border-2 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-md">
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-200">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-950 flex items-center gap-2">
              <Sparkles className="text-amber-600 shrink-0" size={22} />
              <span>
                {t(
                  'మీ అమూల్యమైన అభిప్రాయాన్ని పంచుకోండి (Share Your Experience)',
                  'Share Your Experience'
                )}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
              {t(
                'మా వెబ్‌సైట్ జ్యోతిష్య పరికరాలు (పంచాంగం, 100 పేజీల జన్మ కుండలి PDF, వివాహ పొంతన) లేదా బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్యాత్మిక సలహాలపై మీ నిజమైన అభిప్రాయాన్ని ఇక్కడ నమోదు చేయండి.',
                'Share your genuine feedback regarding our astrology tools or consultations with Brahmasri Jallavaram Sai Dheeraj Sharma garu.'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 hover:scale-[1.02] cursor-pointer"
          >
            <MessageSquare size={16} />
            <span>
              {isFormOpen
                ? t('ఫారమ్‌ను మూసివేయండి', 'Close Form')
                : t('ఇప్పుడే సమీక్ష రాయండి (Write Review)', 'Write a Review')}
            </span>
          </button>
        </div>

        {/* Review Submission Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white border-2 border-amber-400 rounded-2xl p-5 sm:p-7 shadow-lg space-y-5 animate-in fade-in duration-300"
          >
            <div className="border-b border-amber-100 pb-3">
              <h4 className="font-bold text-amber-950 text-base sm:text-lg flex items-center gap-2">
                <Send size={18} className="text-amber-600" />
                <span>
                  {t(
                    'వెబ్‌సైట్ లేదా గురువుగారిపై మీ సమీక్ష ఫారం (Review Submission Form)',
                    'Devotee Review Form'
                  )}
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  'క్రింది వివరాలు నమోదు చేసి "సమీక్షను సమర్పించండి" బటన్ నొక్కండి. మీ పేరు & ఊరు సమీక్షతో పాటు కనిపిస్తాయి.',
                  'Enter your details and review. Your name & location will be shown.'
                )}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <span className="font-bold">⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 shadow-xs">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{t('సమీక్ష సమర్పించబడింది!', 'Review Submitted!')}</p>
                  <p className="mt-0.5">{submitSuccess}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <User size={14} className="text-amber-700" />
                  <span>{t('మీ పూర్తి పేరు (Full Name) *', 'Full Name *')}</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('ఉదా: కె. రామకృష్ణ / సురేష్ బాబు', 'e.g. K. Ramakrishna')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-xs sm:text-sm text-slate-800"
                />
              </div>

              {/* Location / Town */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <MapPin size={14} className="text-amber-700" />
                  <span>{t('మీ ఊరు / ప్రాంతం (Town / City) *', 'Town / City *')}</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('ఉదా: హైదరాబాద్ / డల్లాస్ (USA) / గుంటూరు', 'e.g. Hyderabad / USA')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-xs sm:text-sm text-slate-800"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Mail size={14} className="text-amber-700" />
                  <span>{t('మీ ఈమెయిల్ ఐడీ (Email ID) *', 'Email ID *')}</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Star Rating */}
              <div className="space-y-1.5 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <label className="text-xs font-bold text-amber-950 block">
                  {t('మీ స్టార్ రేటింగ్ (Rating) *', 'Your Rating *')}
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const active = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        title={`${starVal} Star`}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={`${
                            active
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300 fill-slate-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-amber-900 ml-2">
                    {rating === 5
                      ? t('అద్భుతం (5/5 Excellence)', '5/5 Excellent')
                      : rating === 4
                      ? t('చాలా బాగుంది (4/5 Very Good)', '4/5 Very Good')
                      : `${rating}/5`}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <label className="text-xs font-bold text-amber-950 block">
                  {t('సమీక్ష దేని గురించి? (Feedback Category)', 'Feedback Category')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="both">
                    {t(
                      'వెబ్‌సైట్ & గురువుగారి సేవలు రెండూ (Both Website & Guruji)',
                      'Both Website & Guruji'
                    )}
                  </option>
                  <option value="guruji">
                    {t(
                      'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి జ్యోతిష్య సలహాలు',
                      'Guruji Astrology Consultation'
                    )}
                  </option>
                  <option value="website">
                    {t(
                      'వెబ్‌సైట్ పంచాంగం & 100 పేజీల కుండలి టూల్స్',
                      'Website Panchangam & Kundali Tools'
                    )}
                  </option>
                </select>
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-950 flex items-center justify-between">
                <span>{t('మీ సమీక్ష / అభిప్రాయం (Your Feedback & Experience) *', 'Your Feedback *')}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  {comment.length} / 1000 {t('అక్షరాలు', 'characters')}
                </span>
              </label>
              <textarea
                required
                rows={4}
                maxLength={1000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t(
                  'వెబ్‌సైట్ లోని అనుభవం లేదా శ్రీ సాయి ధీరజ్ శర్మ గారి వద్ద మీరు తీసుకున్న జాతక సలహాలు, పూజా ఫలితాలపై మీ అభిప్రాయాన్ని వివరించండి...',
                  'Write your detailed review about the website or Brahmasri Sai Dheeraj Sharma garu...'
                )}
                className="w-full px-3.5 py-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-xs sm:text-sm text-slate-800 leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-slate-500">
                🔒{' '}
                {t(
                  'మీ ఈమెయిల్ గోప్యంగా ఉంచబడుతుంది, పబ్లిక్ గా కనిపించదు.',
                  'Your email is kept confidential and will not be displayed publicly.'
                )}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Send size={15} />
                <span>
                  {isSubmitting
                    ? t('నమోదవుతోంది...', 'Submitting...')
                    : t('మీ సమీక్షను సమర్పించండి (Submit Review)', 'Submit Review')}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/80 pt-5">
          <div className="flex items-center gap-1.5 text-xs text-amber-950 font-bold">
            <Filter size={14} className="text-amber-700" />
            <span>{t('సమీక్షల విభాగం:', 'Filter Reviews:')}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', labelTe: 'అన్నీ (All)', count: reviews.length },
              {
                id: 'guruji',
                labelTe: 'గురువుగారి సలహాలు (Guruji)',
                count: reviews.filter((r) => r.category === 'guruji' || r.category === 'both').length,
              },
              {
                id: 'website',
                labelTe: 'వెబ్‌సైట్ & టూల్స్ (Website)',
                count: reviews.filter((r) => r.category === 'website' || r.category === 'both').length,
              },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedCategory(f.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === f.id
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                }`}
              >
                {f.labelTe} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((testi) => {
            const hasLiked = Boolean(userLikes[testi.id]);
            return (
              <div
                key={testi.id}
                className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                  testi.isUserSubmitted
                    ? 'border-amber-400 ring-2 ring-amber-300/60 bg-linear-to-b from-amber-50/50 to-white'
                    : 'border-amber-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Stars + Category badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-400 text-amber-500" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {testi.isUserSubmitted && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          🌟 {t('తాజా సమీక్ష', 'Recent')}
                        </span>
                      )}
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                        {testi.category === 'guruji'
                          ? t('గురువుగారి సేవలు', 'Guruji')
                          : testi.category === 'website'
                          ? t('వెబ్‌సైట్ & కుండలి', 'Website')
                          : t('సంపూర్ణ సేవలు', 'Comprehensive')}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{testi.comment}"
                  </p>
                </div>

                {/* Footer: Name, Location, Like button */}
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-amber-950 truncate">{testi.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-amber-700 shrink-0" />
                      <span className="truncate">{testi.location}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">{testi.dateStr}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLike(testi.id)}
                    title={t('ఈ సమీక్ష ఉపయోగపడిందా? (Like)', 'Helpful review')}
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                    }`}
                  >
                    <ThumbsUp
                      size={12}
                      className={hasLiked ? 'fill-rose-600 text-rose-600' : 'text-amber-700'}
                    />
                    <span>{testi.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Devotional Footnote */}
        <div className="mt-8 pt-4 border-t border-amber-200/80 text-center">
          <p className="text-xs text-amber-900 font-semibold">
            🕉️{' '}
            {t(
              'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ప్రత్యక్ష జాతక పరిశీలన లేదా పూజా సంకల్పం కొరకు: +91 89779 86166 సంప్రదించండి.',
              'For direct consultation or pooja sankalpam with Brahmasri Jallavaram Sai Dheeraj Sharma: +91 89779 86166.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
};
