import React from 'react';
import { ShieldCheck, Compass, Calendar, BookOpen, Heart, Baby, MapPin, Phone, Mail, Lock, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HubSectionId } from './VedicAstrologyHub';
import { LegalDocType } from './LegalComplianceModal';
import { getTodayIsoDateIST } from '../seo/panchangamSsrEngine';

export interface AuthorBioAndInternalLinksProps {
  onNavigateHome: () => void;
  onNavigatePanchangam: (isoDate?: string) => void;
  onNavigateCalendar: () => void;
  onNavigateHubSection: (section: HubSectionId, path: string) => void;
  onSelectCityTiming: (citySlug: 'hyderabad' | 'vijayawada' | 'visakhapatnam' | 'usa') => void;
  onNavigateAbout: () => void;
  onNavigateContact: () => void;
  onOpenLegal: (doc: LegalDocType) => void;
}

export const AuthorBioAndInternalLinks: React.FC<AuthorBioAndInternalLinksProps> = ({
  onNavigateHome,
  onNavigatePanchangam,
  onNavigateCalendar,
  onNavigateHubSection,
  onSelectCityTiming,
  onNavigateAbout,
  onNavigateContact,
  onOpenLegal,
}) => {
  const { t } = useLanguage();
  const todayIso = getTodayIsoDateIST();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 space-y-6 font-telugu no-print">
      {/* 1. Mandatory Telugu Internal Links Section: Home, Today's Panchangam, and 3+ Related Tools */}
      <nav
        aria-label="ముఖ్యమైన తెలుగు జ్యోతిష అంతర్గత లింకులు (Related Telugu Astrology Links)"
        className="bg-gradient-to-r from-[#fff8ec] via-amber-50/90 to-[#fff8ec] rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Compass size={14} className="text-amber-700" />
              <span>{t('ముఖ్యమైన జ్యోతిష విభాగాలు • Essential Vedic Links', 'Essential Vedic Links')}</span>
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-amber-950">
              {t(
                'నేటి పంచాంగం, జన్మ కుండలి, వివాహ పొంతన & నక్షత్ర పిల్లల పేర్లు',
                'Today Panchangam, Janma Kundali, Vivaha Pontana & Baby Names'
              )}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <Compass size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                హోమ్ పేజీ – నేటి పంచాంగం (Today Telugu Panchangam)
              </span>
              <span className="text-xs text-slate-600">
                ఈ రోజు తిథి, నక్షత్రం, రాహుకాలం, వర్జ్యం &amp; అభిజిత్ ముహూర్తం
              </span>
            </div>
          </a>

          <a
            href={`/panchangam/${todayIso}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigatePanchangam(todayIso);
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <Calendar size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                నేటి సంపూర్ణ తెలుగు పంచాంగం ({todayIso})
              </span>
              <span className="text-xs text-slate-600">
                పంచాంగం, లగ్న ప్రమాణాలు, గౌరీ పంచాంగం &amp; 12 రాశుల ఫలితాలు
              </span>
            </div>
          </a>

          <a
            href="/janma-kundali"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHubSection('kundali', '/janma-kundali');
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <BookOpen size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                పుట్టిన తేదీతో ఉచిత తెలుగు జాతకం (Jathakam by Date of Birth)
              </span>
              <span className="text-xs text-slate-600">
                దక్షిణ భారత రాశి చక్రం (D1), నవాంశ (D9) &amp; 120 ఏళ్ల వింశోత్తరి మహాదశ
              </span>
            </div>
          </a>

          <a
            href="/vivaha-pontana"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHubSection('pontana', '/vivaha-pontana');
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <Heart size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                36 గుణాల అష్టకూట వివాహ పొంతన (Vivaha Pontana Telugu)
              </span>
              <span className="text-xs text-slate-600">
                వధూవరుల నక్షత్ర పొంతన, నాడి, రజ్జు మరియు కుజ దోష పరిశీలన
              </span>
            </div>
          </a>

          <a
            href="/telugu-baby-names"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHubSection('babynames', '/telugu-baby-names');
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <Baby size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                27 నక్షత్రాల తెలుగు పిల్లల పేర్లు (Telugu Baby Names by Nakshatra)
              </span>
              <span className="text-xs text-slate-600">
                అశ్విని నుండి రేవతి వరకు 4 పాదాల నామ అక్షరాలతో పిల్లల పేర్లు
              </span>
            </div>
          </a>

          <a
            href="/panchangam/calendar"
            onClick={(e) => {
              e.preventDefault();
              onNavigateCalendar();
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <Calendar size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                నెలవారీ తెలుగు పంచాంగం క్యాలెండర్ (60 రోజుల తిథులు)
              </span>
              <span className="text-xs text-slate-600">
                రాబోయే 60 రోజుల తిథి, నక్షత్రం, రాహుకాలం &amp; ముహూర్త జాబితా
              </span>
            </div>
          </a>
        </div>

        {/* City Local Panchangam Links */}
        <div className="pt-3 border-t border-amber-200/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-extrabold text-amber-950 flex items-center gap-1">
            <MapPin size={13} className="text-amber-700" />
            <span>నగరాల వారీగా నేటి పంచాంగ సమయాలు:</span>
          </span>
          {(
            [
              { slug: 'hyderabad', label: 'హైదరాబాద్ నేటి పంచాంగం (Hyderabad)' },
              { slug: 'vijayawada', label: 'విజయవాడ నేటి పంచాంగం (Vijayawada)' },
              { slug: 'visakhapatnam', label: 'విశాఖపట్నం నేటి పంచాంగం (Visakhapatnam)' },
              { slug: 'usa', label: 'అమెరికా తెలుగు పంచాంగం (USA EST/CST/PST)' },
            ] as const
          ).map((c) => (
            <a
              key={c.slug}
              href={`/panchangam/${c.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCityTiming(c.slug);
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold transition-colors"
            >
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 2. Verified Author Bio Card (Jallavaram Sai Dheeraj Sharma) */}
      <aside
        aria-label="రచయిత పరిచయం – బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
        className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-xs flex flex-col md:flex-row items-center gap-5"
      >
        <img
          src="/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg"
          alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Jallavaram Sai Dheeraj Sharma)"
          width={88}
          height={88}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover object-top border-2 border-amber-500 shadow-sm shrink-0"
        />
        <div className="flex-1 text-center md:text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-bold">
            <ShieldCheck size={13} className="text-emerald-700" />
            <span>రచయిత &amp; సిద్ధాంత పర్యవేక్షణ • Verified Vedic Astrologer</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-amber-950">
            బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (Jallavaram Sai Dheeraj Sharma)
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (హైదరాబాద్) వ్యవస్థాపకులు, స్మార్త వేద మరియు దృక్సిద్ధాంత జ్యోతిష విద్వాంసులు. 15+ సంవత్సరాల వైదిక అనుభవంతో దైనందిన తెలుగు పంచాంగ గణనలు, బృహత్ జాతక కుండలి విశ్లేషణ, 36 గుణాల వివాహ పొంతన మరియు వైదిక హోమ క్రతువులను నిర్వహిస్తున్నారు.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-bold text-amber-900">
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigateAbout();
              }}
              className="hover:text-orange-700 underline"
            >
              మా గురించి (About Author)
            </a>
            <span>•</span>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigateContact();
              }}
              className="hover:text-orange-700 underline"
            >
              సంప్రదించండి (Contact Us)
            </a>
            <span>•</span>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal('privacy');
              }}
              className="hover:text-orange-700 underline"
            >
              గోప్యతా విధానం (Privacy Policy)
            </a>
            <span>•</span>
            <a
              href="/disclaimer"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal('disclaimer');
              }}
              className="hover:text-orange-700 underline"
            >
              జ్యోతిష్య గమనిక (Disclaimer)
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
};

export interface StandaloneLegalPageProps {
  activeDoc: LegalDocType;
  onSelectDoc: (doc: LegalDocType) => void;
  onBackHome: () => void;
}

export const StandaloneLegalPage: React.FC<StandaloneLegalPageProps> = ({
  activeDoc,
  onSelectDoc,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-telugu">
      <div className="bg-gradient-to-r from-amber-950 via-[#3b1506] to-amber-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500 shadow-lg">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1">
          శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • www.telugujyothisham.com
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100">
          {activeDoc === 'privacy' && 'గోప్యతా విధానం (Privacy Policy)'}
          {activeDoc === 'terms' && 'నిబంధనలు & షరతులు (Terms & Conditions)'}
          {activeDoc === 'disclaimer' && 'జ్యోతిష్య & వెబ్‌సైట్ గమనిక (Disclaimer)'}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href="/privacy-policy"
          onClick={(e) => {
            e.preventDefault();
            onSelectDoc('privacy');
          }}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${
            activeDoc === 'privacy'
              ? 'bg-amber-900 text-amber-100'
              : 'bg-white text-amber-950 border border-amber-300'
          }`}
        >
          <Lock size={14} />
          <span>గోప్యతా విధానం (Privacy Policy)</span>
        </a>
        <a
          href="/disclaimer"
          onClick={(e) => {
            e.preventDefault();
            onSelectDoc('disclaimer');
          }}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${
            activeDoc === 'disclaimer'
              ? 'bg-amber-900 text-amber-100'
              : 'bg-white text-amber-950 border border-amber-300'
          }`}
        >
          <AlertCircle size={14} />
          <span>జ్యోతిష్య గమనిక (Disclaimer)</span>
        </a>
        <a
          href="/terms-and-conditions"
          onClick={(e) => {
            e.preventDefault();
            onSelectDoc('terms');
          }}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${
            activeDoc === 'terms'
              ? 'bg-amber-900 text-amber-100'
              : 'bg-white text-amber-950 border border-amber-300'
          }`}
        >
          <FileText size={14} />
          <span>నిబంధనలు (Terms &amp; Conditions)</span>
        </a>
      </div>

      <article className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-4 text-sm sm:text-base text-slate-800 leading-relaxed">
        {activeDoc === 'privacy' && (
          <>
            <h2 className="text-lg font-extrabold text-amber-950">
              1. భక్తుల సమాచార గోప్యత (Information We Collect)
            </h2>
            <p>
              <strong>www.telugujyothisham.com</strong> నందు నేటి పంచాంగం, రాశి ఫలాలు, ఉచిత జన్మ కుండలి, 36 గుణాల వివాహ పొంతన మరియు నక్షత్ర పిల్లల పేర్లను చూసుకోవడానికి ఎటువంటి వ్యక్తిగత రిజిస్ట్రేషన్ అవసరం లేదు. మీరు స్వచ్ఛందంగా పూజా సంకల్పం లేదా జాతక పరిశీలన కొరకు అందించే జన్మ వివరాలు కేవలం వైదిక సేవ కొరకు మాత్రమే ఉపయోగించబడతాయి.
            </p>
            <h2 className="text-lg font-extrabold text-amber-950">
              2. కుకీలు &amp; Google AdSense విధానం (Cookies &amp; Advertising)
            </h2>
            <p>
              ఈ వెబ్‌సైట్ Google AdSense ద్వారా ప్రకటనలను ప్రదర్శించవచ్చు. Google మరియు దాని భాగస్వాములు వినియోగదారుల గత సందర్శనల ఆధారంగా ప్రకటనలను చూపడానికి కుకీలను (DART cookies) ఉపయోగిస్తారు. వినియోగదారులు Google Ads Settings ద్వారా వ్యక్తిగతీకరించిన ప్రకటనలను నియంత్రించవచ్చు.
            </p>
          </>
        )}

        {activeDoc === 'disclaimer' && (
          <>
            <h2 className="text-lg font-extrabold text-amber-950">
              1. ప్రాంతీయ సూర్యోదయ సమయ వ్యత్యాసాలు (Regional Coordinate Variations)
            </h2>
            <p>
              ఈ వెబ్‌సైట్‌లోని పంచాంగ సమయాలు (తిథి, నక్షత్రం, రాహుకాలం, వర్జ్యం, అభిజిత్ ముహూర్తం) హైదరాబాద్, విజయవాడ, విశాఖపట్నం మరియు అమెరికా (USA) అక్షాంశ రేఖాంశాల ఆధారంగా దృక్సిద్ధాంత గణితంతో గణించబడ్డాయి. స్థానిక సూర్యోదయాన్ని బట్టి కొన్ని నిమిషాల వ్యత్యాసం ఉండవచ్చు.
            </p>
            <h2 className="text-lg font-extrabold text-amber-950">
              2. ఆధ్యాత్మిక &amp; జ్యోతిష్య సూచన (Spiritual Advisory Notice &amp; Cultural Purpose)
            </h2>
            <p>
              ఈ వెబ్‌సైట్‌లో అందించబడిన పంచాంగం, జాతక విశ్లేషణ, వివాహ పొంతన మరియు పరిహార సమాచారం సాంస్కృతిక మరియు ఆధ్యాత్మిక అవగాహన కొరకు మాత్రమే (For informational and cultural purposes only). ఇవి వృత్తిపరమైన వైద్య, న్యాయ లేదా ఆర్థిక సలహాలకు ప్రత్యామ్నాయం కాదు.
            </p>
          </>
        )}

        {activeDoc === 'terms' && (
          <>
            <h2 className="text-lg font-extrabold text-amber-950">
              1. వెబ్‌సైట్ వినియోగ నిబంధనలు (Terms of Use)
            </h2>
            <p>
              శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (www.telugujyothisham.com) నందు ప్రచురించబడిన దైనందిన పంచాంగం, జ్యోతిష్య గణనలు మరియు వ్యాసాలు భక్తుల ఆధ్యాత్మిక సమాచారం కొరకు ఉద్దేశించబడ్డాయి.
            </p>
          </>
        )}

        <div className="pt-4 border-t border-amber-200 flex flex-wrap gap-4 text-xs sm:text-sm text-amber-950">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <MapPin size={15} className="text-amber-700" />
            Pasumamula, Hayathnagar, Hyderabad, Telangana – 501505
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold">
            <Phone size={15} className="text-amber-700" />
            +91 8977986166
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold">
            <Mail size={15} className="text-amber-700" />
            astrologer@telugujyothisham.com
          </span>
        </div>
      </article>
    </div>
  );
};
