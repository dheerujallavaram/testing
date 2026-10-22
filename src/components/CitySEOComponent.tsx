import React, { useEffect } from 'react';
import { 
  MapPin, Phone, MessageCircle, Calendar, Sparkles, 
  CheckCircle2, Clock, ShieldCheck, Star, Flame, Mail, Home
} from 'lucide-react';

export interface CitySEOComponentProps {
  cityName: string;
  state: string;
  country?: 'India' | 'USA' | string;
  teluguName?: string;
  localArea?: string;
  addressPlaceholder?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  onBookPooja?: (serviceName?: string) => void;
  onNavigateHome?: () => void;
}

/**
 * Reusable CitySEOComponent
 * Generates localized SEO-optimized content, Schema.org LocalBusiness / ProfessionalService structured data,
 * and relevant local address placeholders for programmatic SEO landing pages.
 */
export const CitySEOComponent: React.FC<CitySEOComponentProps> = ({
  cityName,
  state,
  country = 'India',
  teluguName,
  localArea,
  addressPlaceholder,
  phone = '+91 8977986166',
  email = 'astrologer@telugujyothisham.com',
  timezone,
  onBookPooja,
  onNavigateHome,
}) => {
  const isUSA = country === 'USA' || state.toLowerCase().includes('usa') || ['texas', 'california', 'new jersey', 'georgia', 'illinois', 'washington', 'virginia', 'florida', 'north carolina'].includes(state.toLowerCase());
  const teluguLabel = teluguName || cityName;
  const canonicalCitySlug = `${cityName.toLowerCase().replace(/\s+/g, '-')}${state ? `-${state.toLowerCase().replace(/\s+/g, '-')}` : ''}`;
  const canonicalUrl = `https://telugujyothisham.com/telugu-astrologer-in-${canonicalCitySlug}`;

  // Default address placeholder if not passed
  const resolvedAddress = addressPlaceholder || (
    isUSA
      ? `${cityName} NRI Telugu Consultation Desk, ${localArea ? `${localArea}, ` : ''}${cityName}, ${state}, USA`
      : `శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం సంప్రదింపుల కేంద్రం, ${localArea ? `${localArea}, ` : ''}${cityName}, ${state}`
  );

  const whatsappMessage = encodeURIComponent(
    `నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నేను ${cityName} (${state}) నుండి సంప్రదిస్తున్నాను. జాతక పరిశీలన / పూజా సేవల వివరాలు కావాలి.`
  );
  const whatsappUrl = `https://wa.me/918977986166?text=${whatsappMessage}`;

  // Inject Localized SEO Head Metadata & LocalBusiness Schema.org
  useEffect(() => {
    const pageTitle = `Best Telugu Astrologer and Purohit Services in ${cityName}, ${state} | శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం`;
    const pageDesc = `${cityName} (${teluguLabel}) లోని భక్తుల కొరకు ప్రముఖ జ్యోతిష పండితులు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే జాతక పరిశీలన, వివాహ & గృహప్రవేశ ముహూర్తాలు, శ్రీ చండీ, లక్ష్మీ గణపతి హోమాలు మరియు వైదిక పూజా సేవలు.`;

    document.title = pageTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', canonicalUrl);

    // Schema.org LocalBusiness / ProfessionalService with local address placeholder
    const schemaId = `city-seo-jsonld-${canonicalCitySlug}`;
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${canonicalUrl}#localbusiness`,
      "name": `శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం - Best Telugu Astrologer in ${cityName}`,
      "image": "https://telugujyothisham.com/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg",
      "telephone": phone,
      "email": email,
      "url": canonicalUrl,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": resolvedAddress,
        "addressLocality": cityName,
        "addressRegion": state,
        "addressCountry": isUSA ? "US" : "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "addressCountry": isUSA ? "US" : "IN"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": cityName
        },
        {
          "@type": "AdministrativeArea",
          "name": state
        }
      ],
      "founder": {
        "@type": "Person",
        "name": "శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Sri Jallavaram Sai Dheeraj Sharma)",
        "jobTitle": "Vedic Astrologer & Smartha Purohit"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "06:30",
          "closes": "20:30"
        }
      ],
      "priceRange": "₹₹",
      "knowsAbout": [
        "Telugu Astrology",
        "Kundali Matching",
        "Vivaha Muhurtham",
        "Gruhapravesham Muhurtham",
        "Chandi Homam",
        "Lakshmi Ganapathi Homam",
        "Navagraha Dosha Nivarana"
      ]
    };

    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(schemaId);
      if (el) el.remove();
    };
  }, [cityName, state, teluguLabel, canonicalUrl, canonicalCitySlug, resolvedAddress, isUSA, phone, email]);

  return (
    <section className="bg-amber-50/50 rounded-2xl p-6 sm:p-10 border border-amber-200/90 shadow-lg text-stone-900 font-telugu max-w-5xl mx-auto my-6">
      
      {/* Top Breadcrumb & Home Link */}
      {onNavigateHome && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-amber-900 hover:text-amber-700 flex items-center gap-1 font-semibold cursor-pointer underline underline-offset-4"
          >
            <Home size={13} />
            <span>&larr; హోమ్ పేజీకి తిరిగి వెళ్లండి (Back to Home)</span>
          </button>
        </div>
      )}

      {/* Main Header & SEO Title */}
      <div className="border-b border-amber-200 pb-6 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold mb-3">
          <Sparkles size={14} className="text-amber-700" />
          <span>{isUSA ? '🇺🇸 USA NRI Telugu Vedic Consultation' : '🔱 శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం'}</span>
          {timezone && (
            <span className="bg-amber-800 text-amber-100 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {timezone}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-amber-950 tracking-tight leading-tight">
          Best Telugu Astrologer and Purohit Services in {cityName}
        </h1>
        <p className="text-lg sm:text-xl text-amber-800 font-bold mt-1">
          {teluguLabel} లో ప్రముఖ వేద జ్యోతిష &amp; పురోహిత సేవలు
        </p>

        {/* Local Address & Service Desk Placeholder */}
        <div className="mt-4 p-3.5 bg-white/90 rounded-xl border border-amber-200 shadow-2xs flex items-start gap-2.5">
          <MapPin size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-950 block">
              సేవా కేంద్రం &amp; చిరునామా (Local Address &amp; Service Desk):
            </span>
            <span className="text-stone-700 block font-medium mt-0.5">
              {resolvedAddress}
            </span>
            <span className="text-[11px] text-amber-800 block mt-1">
              (ప్రత్యక్ష దర్శనం లేదా ఆన్‌లైన్ లైవ్ హెచ్‌డీ వీడియో ద్వారా సేవలందించబడును)
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Intro */}
      <div className="prose prose-amber max-w-none text-stone-700 text-sm sm:text-base leading-relaxed mb-8">
        <p>
          <strong>{cityName} ({state})</strong> లోని తెలుగు భక్తుల కోసం ప్రముఖ స్మార్త వేద విద్వాంసులు, జ్యోతిష పండితులు{' '}
          <strong className="text-amber-900 font-bold">శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు</strong> శాస్త్రోక్త సాంప్రదాయ పద్ధతిలో సమగ్ర జాతక పరిశీలన, వివాహ ముహూర్త నిర్ణయం, గృహప్రవేశం మరియు పవిత్ర హోమ క్రతువుల సేవలను అందిస్తున్నారు.
        </p>
        {isUSA && (
          <p className="bg-amber-100/60 p-3 rounded-lg border border-amber-200 text-xs sm:text-sm text-amber-950 mt-2">
            <strong>అమెరికా తెలుగు కుటుంబాల కోసం:</strong> {cityName} లో నివసించే NRI భక్తుల స్థానిక సమయానికి ({timezone || 'US'} Timezone) అనుకూలంగా ఆన్‌లైన్ ద్వారా శ్రీ సత్యనారాయణ స్వామి వ్రతము, నక్షత్ర శాంతి మరియు కుటుంబ విశేష పూజలు ప్రత్యక్షంగా నిర్వహించబడును.
          </p>
        )}
      </div>

      {/* 4 Pillars of Services in City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-1">
            <Star size={16} className="text-amber-600" />
            <span>సంపూర్ణ జాతక పరిశీలన (Horoscope)</span>
          </div>
          <p className="text-xs text-stone-600 leading-normal">
            లగ్న, నవాంశ చక్రాలు, దశాభుక్తులు, ఉద్యోగ, వ్యాపార, వివాహ సమస్యల సమగ్ర పరిష్కారాలు.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-1">
            <Clock size={16} className="text-amber-600" />
            <span>వివాహ &amp; గృహప్రవేశ ముహూర్తాలు</span>
          </div>
          <p className="text-xs text-stone-600 leading-normal">
            {cityName} స్థానిక సూర్యోదయ కాలమానాన్ని గణించి అత్యంత బలమైన శుభ ముహూర్త నిర్ణయం.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-1">
            <Flame size={16} className="text-amber-600" />
            <span>చండీ &amp; లక్ష్మీ గణపతి హోమాలు</span>
          </div>
          <p className="text-xs text-stone-600 leading-normal">
            శత్రుబాధల నివారణ, సర్వకార్య జయము మరియు ఐశ్వర్య ప్రాప్తి కొరకు శాస్త్రోక్త హోమ క్రతువులు.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-1">
            <ShieldCheck size={16} className="text-amber-600" />
            <span>దోష నివారణ &amp; రత్నధారణ మార్గదర్శనం</span>
          </div>
          <p className="text-xs text-stone-600 leading-normal">
            కుజ దోషం, శని సాడే సాతి, కాలసర్ప దోషాలకు సరళమైన వేద పరిహారాలు మరియు మానసిక ధైర్యం.
          </p>
        </div>
      </div>

      {/* Action Buttons & Contact */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-amber-200">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-sm transition-all cursor-pointer"
        >
          <MessageCircle size={16} />
          <span>{cityName} వాట్సాప్ సంప్రదింపులు</span>
        </a>

        {onBookPooja && (
          <button
            type="button"
            onClick={() => onBookPooja(`Vedic Service for ${cityName}`)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-2.5 rounded-xl shadow-md text-sm transition-all cursor-pointer"
          >
            <Sparkles size={16} />
            <span>పూజా బుకింగ్ (Book Online Pooja)</span>
          </button>
        )}

        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="inline-flex items-center gap-2 bg-white text-stone-800 border border-amber-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors"
        >
          <Phone size={15} className="text-amber-700" />
          <span>{phone}</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-xs font-mono ml-auto"
        >
          <Mail size={14} className="text-amber-700" />
          <span>{email}</span>
        </a>
      </div>

    </section>
  );
};
