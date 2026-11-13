import React from 'react';
import { ShieldCheck, Compass, Calendar, BookOpen, Heart, Baby, MapPin, Phone, Mail, Lock, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HubSectionId } from './VedicAstrologyHub';
import { LegalDocType } from './LegalComplianceModal';
import {
  CityTimingConfig,
  SUPPORTED_CITY_CONFIGS,
  SUPPORTED_CITY_SLUGS,
  getTodayIsoDateIST,
} from '../seo/panchangamSsrEngine';

export interface AuthorBioAndInternalLinksProps {
  onNavigateHome: () => void;
  onNavigatePanchangam: (isoDate?: string) => void;
  onNavigateCalendar: () => void;
  onNavigateHubSection: (section: HubSectionId, path: string) => void;
  onSelectCityTiming: (citySlug: CityTimingConfig['slug']) => void;
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
                పుట్టిన తేదీతో 25-అధ్యాయాల ఉచిత జాతకం (Jathakam PDF)
              </span>
              <span className="text-xs text-slate-600">
                D1 రాశి, D9 నవాంశ, షోడశవర్గ, భావార్థ రత్నాకర &amp; 300 రాజయోగాలు
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
                36 గుణాల &amp; 22-పొంతనల వివాహ పొంతన (Vivaha Pontana)
              </span>
              <span className="text-xs text-slate-600">
                అష్టకూట 36 గుణములు + దక్షిణాది 22 పొంతనలు, రజ్జు, నాడీ &amp; కుజ దోషం
              </span>
            </div>
          </a>

          <a
            href="/muhurtham"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHubSection('muhurtham', '/muhurtham');
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <Compass size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                వివాహ, గృహప్రవేశ శుభ ముహూర్తాలు (Shubha Muhurtham)
              </span>
              <span className="text-xs text-slate-600">
                పెళ్లి, గృహప్రవేశం, అన్నప్రాశన, నామకరణం &amp; వ్యాపార ముహూర్త నిర్ణయం
              </span>
            </div>
          </a>

          <a
            href="/rashi-phalalu"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHubSection('rashiguide', '/rashi-phalalu');
            }}
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <BookOpen size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                నేటి ద్వాదశ రాశి ఫలాలు (Daily 12 Rashi Phalalu)
              </span>
              <span className="text-xs text-slate-600">
                మేషం నుండి మీనం వరకు 12 రాశుల దిన, వార, మాస &amp; గురు-శని గోచార ఫలితాలు
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
                27 నక్షత్రాల తెలుగు పిల్లల పేర్లు (Telugu Baby Names)
              </span>
              <span className="text-xs text-slate-600">
                అశ్విని నుండి రేవతి వరకు 4 పాదాల నామ అక్షరాలతో సంప్రదాయ పేర్లు
              </span>
            </div>
          </a>

          <a
            href="/bhavartha-ratnakara-300-raja-yogalu-ayurveda-jyotisham"
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white hover:bg-amber-100/70 border border-amber-200 hover:border-amber-400 transition-all group"
          >
            <FileText size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 group-hover:text-orange-800 block">
                భావార్థ రత్నాకర &amp; 300 రాజయోగాల గ్రంథం (Vedic Shastra)
              </span>
              <span className="text-xs text-slate-600">
                12 లగ్నాల ధన సూత్రాలు, ఆయుర్వేద వైద్య జ్యోతిషం &amp; 16 ప్రాచీన వ్యాసాలు
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
          {SUPPORTED_CITY_SLUGS.map((slug) => {
            const cfg = SUPPORTED_CITY_CONFIGS[slug];
            return (
              <a
                key={slug}
                href={`/panchangam/${slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCityTiming(slug);
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold transition-colors"
              >
                {cfg.nameTe} ({cfg.nameEn.split(' ')[0]})
              </a>
            );
          })}
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
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-4">
              <p className="font-bold text-amber-950">
                Effective Date: 2026 | Website: https://www.telugujyothisham.com | Publisher: శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం
              </p>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (www.telugujyothisham.com) భక్తులు మరియు వెబ్‌సైట్ సందర్శకుల వ్యక్తిగత గోప్యతను గౌరవిస్తుంది మరియు రక్షిస్తుంది.
              </p>
            </div>

            <h2 className="text-lg font-extrabold text-amber-950">
              1. భక్తుల సమాచార సేకరణ (Information We Collect)
            </h2>
            <p>
              <strong>www.telugujyothisham.com</strong> నందు నేటి తెలుగు పంచాంగం, ద్వాదశ రాశి ఫలాలు, ఉచిత జన్మ కుండలి, 36 గుణాల వివాహ పొంతన, నక్షత్ర పిల్లల పేర్లు మరియు జ్యోతిష్య వ్యాసాలను పరిశీలించడానికి ఎటువంటి రిజిస్ట్రేషన్ లేదా లాగిన్ అవసరం లేదు. మీరు స్వచ్ఛందంగా పూజా సంకల్పం, హోమం లేదా జాతక సంప్రదింపుల కొరకు అందించే వివరాలు (పేరు, గోత్రం, నక్షత్రం, పుట్టిన తేదీ/సమయం) కేవలం సదరు వైదిక సేవల కొరకు మాత్రమే వినియోగించబడతాయి.
            </p>

            <h2 className="text-lg font-extrabold text-amber-950">
              2. Google AdSense &amp; కుకీల విధానం (Google AdSense &amp; DoubleClick DART Cookies Policy)
            </h2>
            <p>
              ఈ వెబ్‌సైట్ నిర్వహణ ఖర్చుల కొరకు మూడవ పక్ష ప్రకటన సేవలైన <strong>Google AdSense</strong> ప్రకటనలను ప్రదర్శించవచ్చు. Google AdSense నిబంధనల ప్రకారం:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Third-Party Vendors:</strong> Google తో సహా ఇతర మూడవ పక్ష ప్రచురణకర్తలు వినియోగదారులు మా వెబ్‌సైట్‌ను లేదా ఇంటర్నెట్‌లోని ఇతర సైట్‌లను గతంలో సందర్శించిన వివరాల ఆధారంగా ప్రకటనలను అందించడానికి కుకీలను (Cookies) ఉపయోగిస్తారు.
              </li>
              <li>
                <strong>DoubleClick DART Cookie:</strong> Google తన ప్రకటన కుకీలను ఉపయోగించడం ద్వారా మా వినియోగదారులకు వారి ఆసక్తులకు అనుగుణమైన ప్రకటనలను ప్రదర్శించగలదు.
              </li>
              <li>
                <strong>Opt-Out (వ్యక్తిగతీకరించిన ప్రకటనల నియంత్రణ):</strong> వినియోగదారులు తమ బ్రౌజర్‌లో వ్యక్తిగతీకరించిన ప్రకటనలను నిలిపివేయడానికి Google ప్రకటనల సెట్టింగ్‌ల పేజీని సందర్శించవచ్చు:{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline font-bold"
                >
                  https://adssettings.google.com/
                </a>{' '}
                లేదా నెట్‌వర్క్ అడ్వర్టైజింగ్ పోర్టల్:{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline font-bold"
                >
                  www.aboutads.info
                </a>.
              </li>
            </ul>

            <h2 className="text-lg font-extrabold text-amber-950">
              3. లాగ్ ఫైల్స్ &amp; వెబ్ అనలిటిక్స్ (Log Files &amp; Web Analytics)
            </h2>
            <p>
              సాధారణ వెబ్‌సైట్ల వలెనే telugujyothisham.com సర్వర్ లాగ్ ఫైల్స్ (IP అడ్రస్, బ్రౌజర్ రకం, ఇంటర్నెట్ సర్వీస్ ప్రొవైడర్, తేదీ మరియు సమయం, పేజీల సందర్శన సమయం) ను కేవలం సైట్ సాంకేతిక భద్రత, వేగం మరియు వినియోగదారుల అనుభవాన్ని మెరుగుపరచడానికి మాత్రమే ఉపయోగిస్తుంది. ఈ వివరాలు ఏ విధమైన వ్యక్తిగత గుర్తింపుతో ముడిపడి ఉండవు.
            </p>

            <h2 className="text-lg font-extrabold text-amber-950">
              4. పిల్లల సమాచార రక్షణ (Children&apos;s Online Privacy Protection - COPPA)
            </h2>
            <p>
              మా వెబ్‌సైట్ 13 సంవత్సరాల కంటే తక్కువ వయస్సు గల పిల్లల నుండి ఎటువంటి వ్యక్తిగత సమాచారాన్ని ఉద్దేశపూర్వకంగా సేకరించదు. తల్లిదండ్రులు లేదా సంరక్షకులు తమ పిల్లల వివరాలు నమోదు కాకుండా పర్యవేక్షించవలసిందిగా కోరడమైనది.
            </p>

            <h2 className="text-lg font-extrabold text-amber-950">
              5. డేటా గోప్యత &amp; భద్రతా హామీ (Data Confidentiality Guarantee)
            </h2>
            <p>
              భక్తులు సమర్పించిన వ్యక్తిగత వివరాలను, ఫోన్ నంబర్లను ఎట్టి పరిస్థితుల్లోనూ ఏ ఇతర మూడవ పక్ష సంస్థలకు విక్రయించము లేదా వ్యాపార ప్రయోజనాలకు ఉపయోగించము. మీ సమాచారం పూర్తిగా సురక్షితం.
            </p>

            <h2 className="text-lg font-extrabold text-amber-950">
              6. సంప్రదింపు అధికారి (Grievance &amp; Contact Officer)
            </h2>
            <p>
              గోప్యతా విధానంపై ఏవైనా సందేహాలు లేదా సలహాలు ఉన్నచో నేరుగా మా జ్యోతిషాలయాన్ని సంప్రదించవచ్చు:
              <br />
              <strong>చిరునామా:</strong> పసుమాముల, హయత్‌నగర్, హైదరాబాద్, తెలంగాణ – 501505
              <br />
              <strong>ఈమెయిల్:</strong> astrologer@telugujyothisham.com | <strong>ఫోన్:</strong> +91 89779 86166
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
