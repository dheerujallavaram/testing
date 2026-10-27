import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Star, Compass, Clock, Flame, ShieldCheck, 
  BookOpen, ChevronRight, MessageCircle, Phone, Calendar, 
  HelpCircle, CheckCircle2, AlertTriangle, UserCheck, Award
} from 'lucide-react';
import { DayData } from '../types/panchangam';
import { 
  NAKSHATRA_CLASSIC_DATA, 
  TITHI_CLASSIC_DATA, 
  NakshatraClassicData, 
  findNakshatraClassicData,
  findTithiClassicData
} from '../data/krishnaRauNakshatraData';
import { useLanguage } from '../context/LanguageContext';

export interface DailyNakshatraArticleProps {
  currentDay: DayData;
  onOpenBooking?: () => void;
}

export const DailyNakshatraArticle: React.FC<DailyNakshatraArticleProps> = ({
  currentDay,
  onOpenBooking,
}) => {
  const { t } = useLanguage();

  // Extract raw star name from currentDay (e.g., "ధనిష్ఠ - సూర్యోదయం నుండి...")
  const activeStarName = useMemo(() => {
    const raw = currentDay.panchanga.nakshatram || '';
    const match = raw.split(/[-–—]/)[0]?.trim();
    return match || 'ధనిష్ఠ';
  }, [currentDay]);

  // Extract raw tithi name
  const activeTithiName = useMemo(() => {
    const raw = currentDay.panchanga.tithi || '';
    const match = raw.split(/[-–—]/)[0]?.trim();
    return match || 'దశమి';
  }, [currentDay]);

  // State to allow user to toggle between today's active star and exploring other stars
  const [selectedStarSlug, setSelectedStarSlug] = useState<string>(() => {
    const matched = findNakshatraClassicData(activeStarName);
    return matched ? matched.slug : 'dhanishta';
  });

  // When day changes, sync to that day's star
  useEffect(() => {
    const matched = findNakshatraClassicData(activeStarName);
    if (matched) {
      setSelectedStarSlug(matched.slug);
    }
  }, [activeStarName]);

  const activeNakshatra: NakshatraClassicData = useMemo(() => {
    return (
      NAKSHATRA_CLASSIC_DATA.find((n) => n.slug === selectedStarSlug) ||
      NAKSHATRA_CLASSIC_DATA[0]
    );
  }, [selectedStarSlug]);

  const activeTithi = useMemo(() => {
    return findTithiClassicData(activeTithiName) || TITHI_CLASSIC_DATA[9];
  }, [activeTithiName]);

  // Schema.org Article Structured Data Injection for daily SEO freshness
  useEffect(() => {
    const scriptId = 'daily-nakshatra-article-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const grahasthitiPairs = Object.entries(currentDay.grahaStithi || {})
      .filter(([, p]) => Boolean(p && p.trim()))
      .map(([rashi, p]) => `${rashi}: ${p.replace(/\n+/g, ', ')}`)
      .join('; ');

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://telugujyothisham.com/panchangam#nakshatra-${activeNakshatra.slug}`
      },
      "headline": `నేటి నక్షత్ర ఫల విశ్లేషణ: ${activeNakshatra.nameTe} నక్షత్రం - యవనాచార్యుల మతం, ముహూర్త చింతామణి & నక్షత్ర చూడామణి (${currentDay.teediVaram})`,
      "description": `${currentDay.teediVaram} (${currentDay.isoDate}) నాటి ${activeNakshatra.nameTe} నక్షత్ర విశేషాలు (అధిపతి: ${activeNakshatra.lordTe}, దేవత: ${activeNakshatra.deityTe}), 4 పాదాల ఫలాలు, ముహూర్త చింతామణి శుభకార్యాలు (${activeNakshatra.forEverybody.auspiciousFor.slice(0, 4).join(', ')}), యవనాచార్యుల మతం, నక్షత్ర చూడామణి మరియు నేటి గ్రహస్థితి (${grahasthitiPairs}).`,
      "image": "https://telugujyothisham.com/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg",
      "author": {
        "@type": "Person",
        "name": "శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Sri Jallavaram Sai Dheeraj Sharma)",
        "jobTitle": "Vedic Astrologer & Smartha Purohit"
      },
      "publisher": {
        "@type": "Organization",
        "name": "శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం",
        "logo": {
          "@type": "ImageObject",
          "url": "https://telugujyothisham.com/favicon-192x192.png"
        }
      },
      "datePublished": currentDay.isoDate,
      "dateModified": currentDay.isoDate,
      "inLanguage": "te",
      "keywords": [
        `${activeNakshatra.nameTe} నక్షత్ర ఫలాలు`,
        `${activeNakshatra.nameEn} Nakshatra Phala Telugu`,
        "యవనాచార్యుల మతం",
        "ముహూర్త చింతామణి",
        "నక్షత్ర చూడామణి",
        "Today Telugu Panchangam",
        "Tithi Nakshatra Phalam",
        "Telugu Jyothisham",
        "శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం"
      ]
    };

    scriptTag.textContent = JSON.stringify(articleSchema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [activeNakshatra, currentDay]);

  const whatsappText = encodeURIComponent(
    `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, నేను నేటి పంచాంగంలో ${activeNakshatra.nameTe} నక్షత్రం & ${activeTithi.nameTe} ఫలితాలు చదివాను. నా వ్యక్తిగత జాతక పరిశీలన / పూజ కొరకు సంప్రదిస్తున్నాను.`
  );
  const whatsappUrl = `https://wa.me/918977986166?text=${whatsappText}`;

  return (
    <section 
      id="nakshatra-phala-article" 
      className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden font-telugu scroll-mt-20 my-10"
    >
      {/* 1. Article Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Metadata pill */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold">
              <BookOpen size={13} />
              <span>యవనాచార్యుల మతం · ముహూర్త చింతామణి · నక్షత్ర చూడామణి</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-800/80 text-amber-100 px-2.5 py-1 rounded-full text-xs">
              <Calendar size={12} />
              <span>{currentDay.teediVaram}</span>
            </span>
          </div>

          {/* Editorial Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-100 tracking-tight leading-tight mb-3">
            {activeNakshatra.nameTe} నక్షత్ర విశేష ఫల విశ్లేషణ
          </h2>
          <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed max-w-3xl">
            <strong>యవనాచార్యుల మతం, ముహూర్త చింతామణి మరియు నక్షత్ర చూడామణి</strong> మహర్షి ప్రమాణాల ప్రకారం నేటి నక్షత్ర స్వభావం, 4 పాదాల ఫలాలు, అందరికీ చేయదగిన శుభ కార్యాలు, ప్రయాణ సూచనలు మరియు విశేష ఫలితాలు.
          </p>

          {/* Author Byline */}
          <div className="mt-5 pt-4 border-t border-amber-800/80 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-amber-200">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-amber-400" />
              <span>
                ధర్మ ప్రవచన పర్యవేక్షణ: <strong>శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</strong> (స్మార్త వేద పండితులు)
              </span>
            </div>
            <span className="text-amber-400/80 font-mono text-xs">
              నక్షత్ర సంఖ్య: {activeNakshatra.id} / 27
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive 27-Nakshatra Selector Bar */}
      <div className="bg-amber-100/70 p-4 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-amber-800" />
          <span className="text-xs sm:text-sm font-bold text-amber-950">
            మీ జన్మ నక్షత్రం లేదా ఇతర నక్షత్ర ఫలాలను చూడండి:
          </span>
        </div>

        <select
          value={selectedStarSlug}
          onChange={(e) => setSelectedStarSlug(e.target.value)}
          className="bg-white border-2 border-amber-400 text-amber-950 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-600 cursor-pointer"
        >
          {NAKSHATRA_CLASSIC_DATA.map((star) => (
            <option key={star.slug} value={star.slug}>
              {star.id}. {star.nameTe} ({star.nameEn}) - {star.rashiTe.split(';')[0]}
            </option>
          ))}
        </select>
      </div>

      <div className="p-6 sm:p-10 space-y-10">
        
        {/* 3. Star Core Identity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-amber-50 p-3.5 sm:p-4 rounded-xl border border-amber-200">
            <span className="text-[11px] text-stone-500 block">రాశి మండలం (Zodiac Sign)</span>
            <span className="text-xs sm:text-sm font-bold text-amber-950 block mt-0.5">
              {activeNakshatra.rashiTe}
            </span>
          </div>

          <div className="bg-amber-50 p-3.5 sm:p-4 rounded-xl border border-amber-200">
            <span className="text-[11px] text-stone-500 block">నక్షత్రాధిపతి (Planetary Lord)</span>
            <span className="text-xs sm:text-sm font-bold text-amber-950 block mt-0.5">
              {activeNakshatra.lordTe}
            </span>
          </div>

          <div className="bg-amber-50 p-3.5 sm:p-4 rounded-xl border border-amber-200">
            <span className="text-[11px] text-stone-500 block">అధిష్ఠాన దేవత (Presiding Deity)</span>
            <span className="text-xs sm:text-sm font-bold text-amber-950 block mt-0.5">
              {activeNakshatra.deityTe}
            </span>
          </div>

          <div className="bg-amber-50 p-3.5 sm:p-4 rounded-xl border border-amber-200">
            <span className="text-[11px] text-stone-500 block">నక్షత్ర స్వభావం (Category)</span>
            <span className={`text-xs sm:text-sm font-bold block mt-0.5 ${
              activeNakshatra.natureClass.includes('ఉత్తమం') ? 'text-emerald-700' : 
              activeNakshatra.natureClass.includes('మధ్యమం') ? 'text-amber-800' : 'text-red-700'
            }`}>
              {activeNakshatra.natureClass}
            </span>
          </div>
        </div>

        {/* 4. Notable Personalities Born under this Star */}
        {activeNakshatra.notablePersonalities && activeNakshatra.notablePersonalities.length > 0 && (
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm shrink-0">
              <UserCheck size={18} className="text-amber-600" />
              <span>ఈ నక్షత్రంలో జన్మించిన చారిత్రక ప్రముఖులు:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeNakshatra.notablePersonalities.map((person, idx) => (
                <span 
                  key={idx}
                  className="bg-white px-3 py-1 rounded-lg border border-amber-200 text-xs font-semibold text-stone-800 shadow-2xs"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. Native Personality & Characteristics */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Star size={18} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-950">
              {activeNakshatra.nameTe} నక్షత్ర జాతకుల సహజ వ్యక్తిత్వం &amp; స్వభావం
            </h3>
          </div>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed bg-amber-50/40 p-4 sm:p-5 rounded-2xl border border-amber-200/80">
            {activeNakshatra.nativeCharacteristics}
          </p>
        </section>

        {/* 6. Four Quarters (పాద విభజన) Detailed Phala */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-950">
              చతుష్పాద ఫలితాలు (Detailed Results for the 4 Quarters)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeNakshatra.padaPhalas.map((padaInfo) => (
              <div 
                key={padaInfo.pada}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-amber-950 text-sm sm:text-base">
                    {padaInfo.pada}వ పాదం: {padaInfo.classicalName}
                  </span>
                  <span className="text-[11px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                    Quarter {padaInfo.pada}
                  </span>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  {padaInfo.teluguPhala}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. For EVERYBODY: Daily Activity Auspiciousness (ఈ రోజు అందరికీ సాధారణ దిన ఫలం) */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-6 sm:p-8 rounded-3xl border-2 border-amber-300">
          <div className="flex items-center gap-2.5 mb-4">
            <CheckCircle2 size={22} className="text-emerald-700 shrink-0" />
            <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
              ఈ రోజు అందరికీ శుభకార్య విచారణ (Daily Auspiciousness for EVERYBODY)
            </h3>
          </div>

          <p className="text-stone-800 text-sm sm:text-base font-medium leading-relaxed mb-4">
            {activeNakshatra.forEverybody.summaryTe}
          </p>

          <div>
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-2">
              ముహూర్త చింతామణి &amp; నక్షత్ర చూడామణి ప్రకారం ఈ నక్షత్రంలో ప్రారంభించదగిన కార్యములు:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeNakshatra.forEverybody.auspiciousFor.map((act, i) => (
                <span 
                  key={i}
                  className="bg-white text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs flex items-center gap-1.5"
                >
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  {act}
                </span>
              ))}
            </div>
          </div>

          {activeNakshatra.forEverybody.inauspiciousFor && activeNakshatra.forEverybody.inauspiciousFor.length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
                జాగ్రత్తలు / ఈ పనులకు దూరంగా ఉండాలి:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeNakshatra.forEverybody.inauspiciousFor.map((inAct, i) => (
                  <span 
                    key={i}
                    className="bg-amber-100/90 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                  >
                    <AlertTriangle size={13} className="text-amber-700" />
                    {inAct}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 8. Journeys & Visha Naadi + Health/Disease (2-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Journeys Card */}
          <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Compass size={20} className="text-amber-700" />
              <h4 className="font-bold text-amber-950 text-base sm:text-lg">
                ప్రయాణ విచారణ &amp; దిశలు (Journeys)
              </h4>
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4">
              {activeNakshatra.journeysTe}
            </p>
            <div className="bg-amber-100/80 p-3 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
              <Clock size={16} className="text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">విష నాడి సమయం (Visha Naadi):</span>
                <span>{activeNakshatra.vishaNaadiTe}</span>
              </div>
            </div>
          </div>

          {/* Health & Fever Card */}
          <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-emerald-700" />
              <h4 className="font-bold text-amber-950 text-base sm:text-lg">
                ఆరోగ్య విచారణ &amp; రోగ శాంతి (Health &amp; Shanti)
              </h4>
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4">
              {activeNakshatra.healthFeverTe}
            </p>
            {activeNakshatra.birthMarkTe && (
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-stone-700">
                <span className="font-bold text-amber-900 block">పుట్టుమచ్చ లక్షణం (Birth Mark):</span>
                <span>{activeNakshatra.birthMarkTe}</span>
              </div>
            )}
          </div>
        </div>

        {/* 9. Yavanacharya Maharshi Verdict */}
        <section className="bg-amber-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800/80 flex items-center justify-center text-amber-300 shrink-0 mt-1">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block mb-1">
                యవనాచార్యుల మతం • Yavanacharya Maharshi Siddhantam
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-amber-100 mb-2">
                యవనాచార్యుల మతం ప్రకారం {activeNakshatra.nameTe} నక్షత్ర స్త్రీ జాతక &amp; కుటుంబ సౌభాగ్య ఫలం:
              </h4>
              <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed italic font-serif">
                "{activeNakshatra.yavanacharyaTe}"
              </p>
            </div>
          </div>
        </section>

        {/* 10. Associated Tithi Phalam for Today */}
        <section className="bg-amber-50/60 p-6 sm:p-8 rounded-3xl border border-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200">
            <div>
              <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block">
                నేటి తిథి మహాత్మ్యం • Tithi Characteristics
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-amber-950 font-telugu">
                {activeTithi.nameTe} ({activeTithi.nameEn}) - {activeTithi.natureTe}
              </h4>
            </div>
            <span className="text-xs bg-amber-200/90 text-amber-950 font-bold px-3 py-1 rounded-full">
              తిథి సంఖ్య: {activeTithi.tithiNum}
            </span>
          </div>

          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4">
            <strong>ఈ తిథి జాతకుల స్వభావం:</strong> {activeTithi.nativeCharacteristics}
          </p>

          <div>
            <span className="text-xs font-bold text-amber-900 uppercase block mb-2">
              ఈ తిథి రోజున చేయదగిన పనులు (Auspicious Tithi Activities):
            </span>
            <div className="flex flex-wrap gap-2">
              {activeTithi.auspiciousActivities.map((act, idx) => (
                <span 
                  key={idx}
                  className="bg-white border border-amber-300 px-3 py-1 rounded-lg text-xs font-semibold text-stone-800 shadow-2xs"
                >
                  ✓ {act}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Astrologer Advice & Direct Consultation CTA */}
        <section className="bg-gradient-to-r from-amber-100 via-stone-50 to-amber-100 p-6 sm:p-8 rounded-3xl border-2 border-amber-400 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold bg-amber-200/80 px-3 py-1 rounded-full inline-block">
              ధైర్యం &amp; మార్గదర్శనం
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-amber-950">
              మీ జన్మ నక్షత్రం, పాద నిర్ణయం మరియు వ్యక్తిగత జాతక పరిశీలన
            </h4>
            <p className="text-stone-700 text-xs sm:text-sm max-w-2xl leading-relaxed">
              నక్షత్ర మరియు గోచార ఫలితాలు సాధారణ సూచనలు మాత్రమే. మీ జనన సమయ లగ్నం, నవాంశ చక్రం, ప్రస్తుత దశాభుక్తులు మరియు అష్టకవర్గ బిందువులను సమగ్రంగా పరిశీలించి శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు ఖచ్చితమైన భవిష్యత్ నిర్ణయం, ముహూర్తం మరియు శాస్త్రోక్త పరిహారాలు అందిస్తారు.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>గురూజీ గారిని సంప్రదించండి</span>
            </a>

            {onOpenBooking && (
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-5 py-3.5 rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
              >
                <Sparkles size={18} />
                <span>పూజా బుకింగ్</span>
              </button>
            )}
          </div>
        </section>

      </div>
    </section>
  );
};
