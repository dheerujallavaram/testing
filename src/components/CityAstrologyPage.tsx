import React, { useEffect, useState } from 'react';
import { 
  MapPin, Phone, MessageCircle, Calendar, Sparkles, 
  ChevronRight, Globe, ShieldCheck, 
  Clock, Flame, Star, Compass
} from 'lucide-react';
import { CitySEOData } from '../data/citiesData';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { SEOContentManager, LocalizedPageIntent } from './SEOContentManager';

export interface CityAstrologyPageProps {
  city: CitySEOData;
  currentDay?: DayData;
  intent?: LocalizedPageIntent;
  onOpenBooking?: (serviceName?: string) => void;
  onNavigateHome?: () => void;
  onNavigatePanchangam?: () => void;
  onSelectCity?: (citySlug: string, routePath?: string) => void;
}

export const CityAstrologyPage: React.FC<CityAstrologyPageProps> = ({
  city,
  currentDay,
  intent = 'astrologer-purohit',
  onOpenBooking,
  onNavigateHome,
  onNavigatePanchangam,
  onSelectCity,
}) => {
  const { t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isUSA = city.regionType === 'USA';
  const canonicalUrl = `https://www.telugujyothisham.com/telugu-astrologer-in-${city.slug}`;

  // WhatsApp Pre-filled message tailored to the city
  const whatsappText = encodeURIComponent(
    `నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నేను ${city.name} (${city.stateTelugu || city.state}) నుండి సంప్రదిస్తున్నాను. జాతక పరిశీలన / పూజా సేవల వివరాలు తెలుసుకోవాలనుకుంటున్నాను.`
  );
  const whatsappUrl = `https://wa.me/918977986166?text=${whatsappText}`;

  // Dynamic SEO Injection for programmatic page
  useEffect(() => {
    const shortCity = city.name.slice(0, 18);
    const pageTitle = isUSA
      ? `Telugu Astrologer in ${shortCity}, ${city.state} - Jyothisham`
      : `Telugu Astrologer in ${shortCity} - Telugu Jyothisham.com`;

    const rawDesc = isUSA
      ? `Trusted Telugu Astrologer & Vedic Purohit in ${city.name}, ${city.state}. Online Jatakam PDF, Muhurtham, Panchangam & Homam - telugujyothisham.com.`
      : `${city.name} (${city.teluguName}) భక్తుల కొరకు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే జాతక పరిశీలన, ముహూర్తాలు, పంచాంగం & హోమాలు - telugujyothisham.com.`;
    const pageDescription = rawDesc.length <= 158 ? rawDesc : rawDesc.slice(0, 155) + '...';

    document.title = pageTitle.slice(0, 60);

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDescription);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // OpenGraph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDescription);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    // Twitter Tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', pageTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', pageDescription);

    const twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute('content', canonicalUrl);

    // JSON-LD Structured Data for LocalBusiness & Breadcrumb
    const scriptId = 'programmatic-seo-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://telugujyothisham.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Telugu Astrologer by City",
              "item": "https://telugujyothisham.com/#cities"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${city.name} (${city.teluguName})`,
              "item": canonicalUrl
            }
          ]
        },
        {
          "@type": "ProfessionalService",
          "@id": `${canonicalUrl}#service`,
          "name": `శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం - Telugu Astrologer in ${city.name}`,
          "image": "https://telugujyothisham.com/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg",
          "telephone": "+91-8977986166",
          "email": "astrologer@telugujyothisham.com",
          "url": canonicalUrl,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city.name,
            "addressRegion": city.state,
            "addressCountry": city.country === 'USA' ? 'US' : 'IN'
          },
          "areaServed": {
            "@type": "City",
            "name": city.name
          },
          "founder": {
            "@type": "Person",
            "name": "శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Sri Jallavaram Sai Dheeraj Sharma)"
          },
          "knowsAbout": [
            "Telugu Astrology",
            "Daily Telugu Panchangam",
            "Kundali Matching",
            "Vivaha Muhurtham",
            "Gruhapravesham Muhurtham",
            "Chandi Homam",
            "Lakshmi Ganapathi Homam",
            "Kuja Dosha Nivarana",
            "Satyanarayana Swamy Vratham"
          ],
          "priceRange": "₹₹"
        },
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "mainEntity": [
            {
              "@type": "Question",
              "name": `${city.name} నుండి శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని ఎలా సంప్రదించవచ్చు? (How to consult Sri Dheeraj Sharma from ${city.name}?)`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${city.name} మరియు పరిసర ప్రాంతాల భక్తులు వాట్సాప్ (+91-8977986166) లేదా ఫోన్ కాల్ ద్వారా నేరుగా అపాయింట్‌మెంట్ బుక్ చేసుకుని వీడియో కాల్ లేదా ఫోన్ కన్సల్టేషన్ ద్వారా జాతక పరిశీలన పొందవచ్చు.`
              }
            },
            {
              "@type": "Question",
              "name": `${city.name} లో గృహప్రవేశం మరియు వివాహ ముహూర్తాలు నిర్ణయిస్తారా? (Do you calculate Muhurthams for ${city.name} coordinates?)`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `అవును, ${city.name} యొక్క స్థానిక అక్షాంశ, రేఖాంశాలు (Latitude & Longitude) మరియు సూర్యోదయ కాలమానాన్ని గణించి అత్యంత శుభప్రదమైన లగ్న ముహూర్తాలను నిర్ణయిస్తారు.`
              }
            },
            {
              "@type": "Question",
              "name": isUSA 
                ? `Can Telugu NRIs in ${city.name}, ${city.state} perform online Vedic Homams in USA timezones?`
                : `${city.name} లో ప్రత్యక్షంగా లేదా ఆన్‌లైన్ ద్వారా హోమాలు నిర్వహించవచ్చా?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": isUSA
                  ? `Yes, Sri Dheeraj Sharma conducts authentic Vedic live HD poojas synchronized with USA timezones (${city.timezone || 'US'}) including Satyanarayana Vratham, Ayushya Homam, Chandi Homam, and Nakshatra Shanti.`
                  : `అవును, శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం ద్వారా శాస్త్రోక్తంగా శ్రీ చండీ హోమం, లక్ష్మీ గణపతి హోమం, సుదర్శన హోమం మరియు నవగ్రహ శాంతులు ప్రత్యక్షంగా లేదా లైవ్ స్ట్రీమింగ్ ద్వారా నిర్వహించబడును.`
              }
            }
          ]
        }
      ]
    };

    scriptTag.textContent = JSON.stringify(jsonLdData);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [city, canonicalUrl, isUSA]);



  const faqs = [
    {
      q: `${city.name} నుండి శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని ఎలా సంప్రదించవచ్చు?`,
      qEn: `How can families in ${city.name} consult Sri Jallavaram Sai Dheeraj Sharma?`,
      a: `${city.name} మరియు పరిసర ప్రాంతాల భక్తులు నేరుగా వాట్సాప్ (+91-8977986166) లేదా ఫోన్ ద్వారా అపాయింట్‌మెంట్ తీసుకోవచ్చు. ఆన్‌లైన్ జాతక పరిశీలన కోసం మీ పుట్టిన తేదీ, సమయం, పుట్టిన ప్రదేశం వివరాలను వాట్సాప్‌లో పంపించవచ్చు.`
    },
    {
      q: `${city.name} కోసం ప్రత్యేకంగా శుభ ముహూర్తాలు లెక్కిస్తారా?`,
      qEn: `Do you calculate auspicious Muhurthams based on ${city.name} local coordinates?`,
      a: `తప్పకుండా! వివాహం, గృహప్రవేశం, ఉపనయనం, నామకరణం వంటి ఏ శుభకార్యానికైనా ${city.name} ప్రాంతపు ఖచ్చితమైన సూర్యోదయ, సూర్యాస్తమయ సమయాలు మరియు లగ్న ప్రమాణాలను గణించి సంపూర్ణ శుభ ముహూర్తం నిర్ణయించబడుతుంది.`
    },
    {
      q: isUSA 
        ? `${city.name} (${city.state}) Telugu NRI భక్తులకు టైమ్‌జోన్ అనుకూలంగా ఉంటుందా?` 
        : `${city.name} లో హోమాలు, పూజా క్రతువులు ఎలా నిర్వహిస్తారు?`,
      qEn: isUSA 
        ? `Are consultation timings synchronized with ${city.timezone || 'US'} timezone?`
        : `How are Homams and Vedic poojas conducted for devotees in ${city.name}?`,
      a: isUSA
        ? `అవును! అమెరికాలోని ${city.name} (${city.state}) లో నివసించే తెలుగు కుటుంబాలకు వారి స్థానిక కాలమానానికి (${city.timezone || 'US'} Timezone - ఈవెనింగ్ లేదా వీకెండ్స్) అనుకూలంగా వీడియో కాల్ ద్వారా సంప్రదింపులు మరియు ఆన్‌లైన్ లైవ్ పూజా కార్యక్రమాలు నిర్వహించబడతాయి.`
        : `${city.name} లోని భక్తుల గృహాలలో లేదా పవిత్ర క్షేత్రాలలో శాస్త్రోక్త స్మార్త విధివిధానాల ప్రకారం శ్రీ చండీ హోమం, లక్ష్మీ గణపతి హోమం, సుదర్శన హోమం మరియు నవగ్రహ శాంతి హోమాలు నిర్వహించబడును.`
    },
    {
      q: `జాతక పరిశీలనలో ఏయే అంశాలు విశ్లేషిస్తారు?`,
      qEn: `What key astrological aspects are analyzed in the horoscope consultation?`,
      a: `దశాభుక్తులు, గోచార గ్రహ స్థితులు, గురు బలము, శని సాడే సాతి ప్రభావం, కుజ దోషం, కాలసర్ప దోషం, ఉద్యోగం, వ్యాపారం, వివాహ యోగం మరియు ఆరోగ్య అంశాలను సమగ్రంగా పరిశీలించి సులభమైన పరిహారాలు, ధైర్యం సూచించబడతాయి.`
    }
  ];

  return (
    <article className="min-h-screen bg-gradient-to-b from-amber-50/70 via-stone-50 to-amber-100/40 text-stone-900 font-telugu pb-16">
      
      {/* 1. Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" className="bg-amber-950 text-amber-200 text-xs py-2.5 px-4 border-b border-amber-800">
        <div className="max-w-6xl mx-auto flex items-center flex-wrap gap-1.5">
          <button 
            type="button"
            onClick={onNavigateHome}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            హోమ్ (Home)
          </button>
          <ChevronRight size={13} className="text-amber-400" />
          <span className="text-amber-300">తెలుగు జ్యోతిష కేంద్రాలు (City Directory)</span>
          <ChevronRight size={13} className="text-amber-400" />
          <span className="text-white font-bold">{city.name} ({city.teluguName})</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* 2. Programmatic Hero Section */}
        <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 text-white rounded-2xl p-6 sm:p-10 shadow-2xl border-2 border-amber-600/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {/* Region Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold mb-4">
              <MapPin size={15} className="text-amber-400 shrink-0" />
              <span>
                {city.state} • {city.country === 'USA' ? 'NRI USA Telugu Community' : 'ఆంధ్ర & తెలంగాణ'}
              </span>
              {city.timezone && (
                <span className="bg-amber-600/80 text-white px-2 py-0.5 rounded text-[11px] font-mono">
                  {city.timezone}
                </span>
              )}
            </div>

            {/* Dynamic SEO H1 */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-100 tracking-tight leading-tight mb-4 font-telugu drop-shadow-sm">
              Best Telugu Astrologer and Purohit Services in {city.name}
              <span className="block text-xl sm:text-3xl text-amber-300 font-bold mt-1">
                ({city.teluguName} లో ప్రముఖ వేద జ్యోతిష &amp; పురోహిత సేవలు)
              </span>
            </h1>

            {/* Localized Narrative Paragraph */}
            <p className="text-amber-100/95 text-base sm:text-lg leading-relaxed max-w-4xl mb-6">
              {isUSA ? (
                <>
                  శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం ఆధ్వర్యంలో ప్రముఖ స్మార్త వేద విద్వాంసులు, జ్యోతిష పండితులు{' '}
                  <strong className="text-amber-300 font-bold">శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</strong>,{' '}
                  <strong>{city.name} ({city.state})</strong> లోని ప్రవాస తెలుగు కుటుంబాలకు (Telugu NRIs) వారి స్థానిక కాలమానానికి అనుగుణంగా ({city.timezone || 'US'} Timezone) ఆన్‌లైన్ జాతక పరిశీలన, గృహప్రవేశం, వివాహ శుభ ముహూర్తాలు మరియు ప్రత్యక్ష లైవ్ వేదిక పూజా సేవలను అందిస్తున్నారు.
                </>
              ) : (
                <>
                  శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం ఆధ్వర్యంలో ప్రముఖ జ్యోతిష పండితులు, స్మార్త వేద విద్వాంసులు{' '}
                  <strong className="text-amber-300 font-bold">శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</strong>,{' '}
                  <strong>{city.name} ({city.teluguName})</strong> మరియు పరిసర ప్రాంతాల భక్తులకు ప్రామాణిక వేద జ్యోతిష సేవలను అందిస్తున్నారు. వివాహ ముహూర్తాలు, గృహప్రవేశం, జాతక పరిశీలన, నవగ్రహ దోష నివారణ మరియు పవిత్ర హోమ క్రతువుల కొరకు నేరుగా సంప్రదించవచ్చు.
                </>
              )}
            </p>

            {/* Popular Local Localities in the City */}
            {city.popularAreas && city.popularAreas.length > 0 && (
              <div className="mb-8 pt-2 border-t border-amber-800/60">
                <p className="text-xs sm:text-sm text-amber-300 font-medium mb-2 flex items-center gap-1.5">
                  <Compass size={14} className="text-amber-400" />
                  {city.name} లోని ప్రధాన ప్రాంతాలు (Serving all localities in {city.name}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {city.popularAreas.map((area, idx) => (
                    <span 
                      key={idx}
                      className="bg-amber-900/60 border border-amber-600/40 text-amber-200 text-xs px-2.5 py-1 rounded-md"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-emerald-900/40 transition-all text-sm sm:text-base cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>వాట్సాప్‌లో సంప్రదించండి (WhatsApp)</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenBooking && onOpenBooking(`Vedic Consultation for ${city.name}`)}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-5 py-3 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all text-sm sm:text-base cursor-pointer"
              >
                <Sparkles size={18} />
                <span>పూజా సేవ బుకింగ్ (Book Pooja)</span>
              </button>

              <a
                href="tel:+918977986166"
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold px-4 py-3 rounded-xl border border-amber-700/60 transition-all text-sm sm:text-base"
              >
                <Phone size={16} />
                <span>+91 8977986166</span>
              </a>

              {onNavigatePanchangam && (
                <button
                  type="button"
                  onClick={onNavigatePanchangam}
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white text-xs sm:text-sm font-semibold underline underline-offset-4 px-2 py-1 ml-auto cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>నేటి పంచాంగం చూడండి &rarr;</span>
                </button>
              )}
            </div>

          </div>
        </section>

        {/* 3. Six Core Vedic Astrology Services in City */}
        <section className="mt-12">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Vedic Services in {city.name}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mt-2 font-telugu">
              {city.name} ({city.teluguName}) లో లభించే ప్రధాన జ్యోతిష &amp; పూజా సేవలు
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto mt-1">
              శాస్త్రోక్త దృక్సిద్ధాంత పద్ధతిలో శ్రీ ధీరజ్ శర్మ గారి ప్రత్యేక మార్గదర్శకత్వం
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Service 1 */}
            <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Star size={20} />
              </div>
              <h3 className="text-lg font-bold text-amber-950 mb-1.5">
                జాతక పరిశీలన &amp; కుండలి విశ్లేషణ
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                {city.name} భక్తుల కొరకు లగ్న, నవాంశ, దశాభుక్తుల సమగ్ర విశ్లేషణ. ఉద్యోగ, వ్యాపార, సంతాన మరియు కుటుంబ సమస్యలకు శాస్త్రోక్త మార్గదర్శకత్వం.
              </p>
              <span className="text-xs font-semibold text-amber-700">Horoscope Consultation</span>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-bold text-amber-950 mb-1.5">
                వివాహ &amp; గృహప్రవేశ శుభ ముహూర్తాలు
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                {city.name} స్థానిక అక్షాంశ రేఖాంశాల ప్రకారం దోషరహితమైన అమృత ఘడియలతో కూడిన ఉత్తమ వివాహ, గృహప్రవేశ మరియు వ్యాపార ప్రారంభ ముహూర్తాలు.
              </p>
              <span className="text-xs font-semibold text-amber-700">Auspicious Muhurtham Calculation</span>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Flame size={20} />
              </div>
              <h3 className="text-lg font-bold text-amber-950 mb-1.5">
                శ్రీ చండీ &amp; లక్ష్మీ గణపతి హోమం
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                దృష్టి దోషాలు, శత్రుపీడల నివారణకు చండీ హోమం, సమస్త కార్యసిద్ధికి సంకటహర లక్ష్మీ గణపతి హోమం {city.serviceMode} లో నిర్వహించబడును.
              </p>
              <span className="text-xs font-semibold text-amber-700">Sacred Vedic Homams</span>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-amber-950 mb-1.5">
                నవగ్రహ &amp; కుజ దోష నివారణ శాంతి
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                శని సాడే సాతి, రాహు-కేతు దోషాలు, కాలసర్ప దోషం మరియు కుజ దోషాలకు శాస్త్రోక్త పూజలు, తగిన రత్నధారణ మరియు పరిహారాల మార్గదర్శనం.
              </p>
              <span className="text-xs font-semibold text-amber-700">Dosha Nivarana &amp; Remedies</span>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-bold text-amber-950 mb-1.5">
                సత్యనారాయణ స్వామి వ్రతం &amp; నామకరణం
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                నూతన గృహ ప్రవేశంలో మరియు విశేష పర్వదినాలలో శ్రీ సత్యనారాయణ స్వామి వ్రతము, శిశువులకు నక్షత్ర నామకరణ సంస్కారాలు శాస్త్రోక్తంగా నిర్వహణ.
              </p>
              <span className="text-xs font-semibold text-amber-700">Vedic Samskaras &amp; Vrathams</span>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Globe size={20} />
              </div>
              <h3 className="text-lg font-bold text-amber-950 mb-1.5">
                {isUSA ? 'NRI USA Special Video Consultations' : 'ప్రత్యక్ష దర్శనం & ఆన్‌లైన్ సేవలు'}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                {isUSA ? (
                  <>
                    అమెరికా లోని {city.name} తెలుగు కుటుంబాల కోసం {city.timezone || 'US'} కాలమానంలో ప్రత్యేక సమయ కేటాయింపుతో కూడిన ప్రైవేట్ వీడియో కన్సల్టేషన్లు.
                  </>
                ) : (
                  <>
                    {city.name} మరియు ఆంధ్ర, తెలంగాణ భక్తులకు నేరుగా ఫోన్, వాట్సాప్ మరియు ఆన్‌లైన్ వీడియో ద్వారా నిరంతర అందుబాటులో సేవలు.
                  </>
                )}
              </p>
              <span className="text-xs font-semibold text-amber-700">
                {isUSA ? 'USA Timezone Support' : 'Direct & Online Consultation'}
              </span>
            </div>
          </div>
        </section>

        {/* 4. Why Choose Sri Dheeraj Sharma in this City */}
        <section className="mt-12 bg-amber-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-amber-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <span className="text-amber-400 font-bold text-sm tracking-wide uppercase">ప్రామాణిక స్మార్త సంప్రదాయం</span>
              <h3 className="text-xl font-bold text-white">100% ప్రామాణిక వేద రీతి</h3>
              <p className="text-amber-100/80 text-xs sm:text-sm leading-relaxed">
                గురుపరంపర ద్వారా అందిన స్మార్త వేద విజ్ఞానంతో కచ్చితమైన ముహూర్త నిర్ణయం మరియు క్రతువుల నిర్వహణ.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-amber-400 font-bold text-sm tracking-wide uppercase">ధైర్యం ఇచ్చే మార్గదర్శనం</span>
              <h3 className="text-xl font-bold text-white">భయం లేకుండా సన్మార్గం</h3>
              <p className="text-amber-100/80 text-xs sm:text-sm leading-relaxed">
                దోషాల పేరుతో భయపెట్టకుండా సులభమైన జప, తప, దాన పరిహారాలతో మానసిక స్థైర్యాన్ని నింపే సంభాషణ.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-amber-400 font-bold text-sm tracking-wide uppercase">గ్లోబల్ తెలుగు కమ్యూనిటీ</span>
              <h3 className="text-xl font-bold text-white">ఆంధ్ర, తెలంగాణ &amp; USA NRIs</h3>
              <p className="text-amber-100/80 text-xs sm:text-sm leading-relaxed">
                {city.name} సహా ప్రపంచవ్యాప్తంగా వేలాది తెలుగు కుటుంబాలకు సేవలందిస్తున్న విశ్వసనీయ జ్యోతిషాలయం.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Localized FAQ Accordion for this City */}
        <section className="mt-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950 font-telugu">
              తరచుగా అడిగే ప్రశ్నలు (Frequently Asked Questions - {city.name})
            </h2>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-amber-50/50 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="text-sm sm:text-base font-bold text-amber-950 block">
                        {faq.q}
                      </span>
                      <span className="text-xs text-stone-500 font-sans block mt-0.5">
                        {faq.qEn}
                      </span>
                    </div>
                    <ChevronRight 
                      size={18} 
                      className={`text-amber-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-stone-700 text-xs sm:text-sm leading-relaxed border-t border-amber-100">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. SEOContentManager: Temple Proximity, Local Coordinates & 500+ Localized City Routes */}
        <SEOContentManager
          city={city}
          currentDay={currentDay}
          intent={intent}
          onSelectCityRoute={(slug, routePath) => onSelectCity && onSelectCity(slug, routePath)}
          onNavigatePanchangam={onNavigatePanchangam}
          onOpenBooking={onOpenBooking}
        />

        {/* 7. Discreet Spiritual Consultation Note */}
        <section className="mt-14 pt-8 border-t border-amber-200 text-center">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            {city.name} ({city.teluguName}) మరియు పరిసర ప్రాంతాల భక్తులకు నిరంతర ఆధ్యాత్మిక తోడ్పాటు
          </p>
          <p className="text-xs text-stone-600 max-w-xl mx-auto">
            శాస్త్రోక్త సంప్రదాయ పద్ధతిలో మీ కుటుంబ క్షేమం, ఉద్యోగ, వివాహ, గృహప్రవేశ శుభ ముహూర్తాల కోసం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని నేరుగా సంప్రదించవచ్చు.
          </p>
        </section>

      </div>
    </article>
  );
};
