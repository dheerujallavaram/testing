import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Compass } from 'lucide-react';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { HubSectionId } from './VedicAstrologyHub';
import { LegalDocType } from './LegalComplianceModal';

export interface FooterProps {
  onSelectCity?: (citySlug: string) => void;
  onNavigateHubSection?: (section: HubSectionId, path: string) => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenAdmin?: () => void;
}

const SEO_HUB_LINKS: { section: HubSectionId; path: string; labelTe: string; labelEn: string }[] = [
  { section: 'pontana', path: '/neti-panchangam', labelTe: 'నేటి పంచాంగం (Neti Panchangam)', labelEn: 'Neti Panchangam (Today Panchangam)' },
  { section: 'pontana', path: '/today-panchangam-in-telugu', labelTe: 'ఈ రోజు పంచాంగం (Today Panchangam in Telugu)', labelEn: 'Today Panchangam in Telugu - ఈ రోజు పంచాంగం' },
  { section: 'kundali', path: '/janma-kundali', labelTe: 'ఉచిత తెలుగు జన్మ కుండలి & మహాదశ (Free Janam Kundli)', labelEn: 'Free Telugu Janma Kundali & Mahadasha' },
  { section: 'pontana', path: '/gowri-panchangam', labelTe: 'గౌరీ పంచాంగం & హోరా చక్రం (Gowri Panchangam)', labelEn: 'Today Gowri Panchangam & Hora Timings' },
  { section: 'pontana', path: '/tarabalam-chandrabalam', labelTe: 'తారాబలం & చంద్రబలం క్యాలిక్యులేటర్', labelEn: 'Tarabalam & Chandrabalam Calculator' },
  { section: 'pontana', path: '/nitya-sankalpam', labelTe: 'నేటి పూజా సంకల్పం మంత్రం (India & USA NRI)', labelEn: 'Today Telugu Pooja Sankalpam' },
  { section: 'pontana', path: '/vivaha-pontana', labelTe: '36 గుణాల వివాహ పొంతన (Vivaha Pontana)', labelEn: '36-Point Marriage Compatibility' },
  { section: 'akshara', path: '/naama-nakshatra', labelTe: 'పేరు మొదటి అక్షరంతో రాశి & నక్షత్రం', labelEn: 'Name First Letter Rashi Finder' },
  { section: 'babynames', path: '/telugu-baby-names', labelTe: '27 నక్షత్రాల తెలుగు పిల్లల పేర్లు', labelEn: 'Telugu Baby Names by Nakshatra' },
  { section: 'ugadi', path: '/ugadi-rashi-phalalu', labelTe: 'శ్రీ పరాభవ నామ సంవత్సర ఉగాది రాశి ఫలాలు', labelEn: 'Ugadi Yearly Horoscope 2026-2027' },
  { section: 'muhurtham', path: '/shubha-muhurthalu', labelTe: 'శుభ ముహూర్తాలు & పండుగల క్యాలెండర్', labelEn: 'Auspicious Muhurthams & Festivals' },
  { section: 'vastu', path: '/vastu-shastra-telugu', labelTe: 'గృహ వాస్తు చక్రం & దిక్పాలక నియమాలు', labelEn: 'Telugu Gruha Vastu Shastra Guide' },
  { section: 'dosha', path: '/dosha-pariharalu', labelTe: 'కుజ, కాలసర్ప, ఏలినాటి శని దోష పరిహారాలు', labelEn: 'Kuja, Kalasarpa & Shani Dosha Remedies' },
];

const POPULAR_CITY_LINKS: { slug: string; nameTe: string; nameEn: string }[] = [
  { slug: 'hyderabad', nameTe: 'హైదరాబాద్ జ్యోతిష్యులు', nameEn: 'Hyderabad' },
  { slug: 'vijayawada', nameTe: 'విజయవాడ', nameEn: 'Vijayawada' },
  { slug: 'visakhapatnam', nameTe: 'విశాఖపట్నం', nameEn: 'Visakhapatnam' },
  { slug: 'tirupati', nameTe: 'తిరుపతి', nameEn: 'Tirupati' },
  { slug: 'guntur', nameTe: 'గుంటూరు', nameEn: 'Guntur' },
  { slug: 'warangal', nameTe: 'వరంగల్', nameEn: 'Warangal' },
  { slug: 'rajahmundry', nameTe: 'రాజమండ్రి', nameEn: 'Rajahmundry' },
  { slug: 'bengaluru', nameTe: 'బెంగళూరు', nameEn: 'Bengaluru' },
  { slug: 'dallas', nameTe: 'డల్లాస్ (USA)', nameEn: 'Dallas TX' },
  { slug: 'new-jersey', nameTe: 'న్యూ జెర్సీ (USA)', nameEn: 'New Jersey' },
  { slug: 'san-jose', nameTe: 'బే ఏరియా (USA)', nameEn: 'San Jose CA' },
  { slug: 'london', nameTe: 'లండన్ (UK)', nameEn: 'London UK' },
  { slug: 'sydney', nameTe: 'సిడ్నీ (Australia)', nameEn: 'Sydney AU' },
  { slug: 'toronto', nameTe: 'టొరంటో (Canada)', nameEn: 'Toronto CA' },
];

export const Footer: React.FC<FooterProps> = ({
  onSelectCity,
  onNavigateHubSection,
  onOpenLegal,
  onOpenAdmin,
}) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-amber-950 text-amber-100/90 pt-14 pb-8 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 pb-10 border-b border-amber-900/80" data-nosnippet>
          {/* Col 1: Temple info */}
          <div>
            <h4 className="text-xl font-bold font-telugu text-white flex items-center gap-2.5 mb-3">
              <OmEmblem className="w-8 h-8 shrink-0" size={32} />
              <span>{t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (Telugu Jyothisham)', 'Telugu Jyothisham · Sreelakshmi Ganapathi Astrology')}</span>
            </h4>
            <p className="text-sm font-telugu text-amber-200/80 leading-relaxed mb-3">
              {t(
                'తెలుగు జ్యోతిషం (Telugu Jyothisham) — ఈ రోజు నక్షత్రం, తిథి, శుభ సమయం, మీ రాశి ప్రకారం నేటి ద్వాదశ రాశి ఫలితాలు మరియు మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF రిపోర్ట్ పొందండి. బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి దృక్సిద్ధాంత పంచాంగం.',
                'Telugu Jyothisham (తెలుగు జ్యోతిషం) — Check Today Nakshatram, Tithi, Shubha Samayam, Daily Rashi Phalalu according to your sign, and get your 100-page Janma Kundali PDF report.'
              )}
            </p>
            <a
              href="https://www.telugujyothisham.com"
              className="inline-block text-xs font-mono font-bold text-amber-300 hover:text-white underline underline-offset-4 mb-2"
            >
              Telugu Jyothisham — www.telugujyothisham.com
            </a>
            <p className="text-xs font-telugu font-semibold text-amber-400">
              {t('మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF పొందండి • నేటి పంచాంగం & రాశి ఫలాలు', 'Get Your 100-Page Janma Kundali PDF • Today Panchangam & Horoscope')}
            </p>
          </div>

          {/* Col 2: Services & Timings */}
          <div data-nosnippet>
            <h4 className="text-base font-bold font-telugu text-white mb-3 flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              <span>{t('జ్యోతిషాలయ సమయాలు & సేవలు', 'Timings & Sacred Services')}</span>
            </h4>
            <ul className="text-sm font-telugu space-y-2 text-amber-200/80">
              <li>{t('ఉదయం: 06:30 AM నుండి 12:30 PM వరకు', 'Morning: 06:30 AM to 12:30 PM')}</li>
              <li>{t('సాయంత్రం: 04:30 PM నుండి 08:30 PM వరకు', 'Evening: 04:30 PM to 08:30 PM')}</li>
              <li className="pt-2 text-xs text-amber-300">
                • {t('జాతక పరిశీలన, 100 పేజీల జన్మ కుండలి PDF, వివాహ పొంతన, వాస్తు సలహాలు', 'Horoscope analysis, 100-page Janma Kundali PDF, marriage matching & Vastu guidance')}
              </li>
              <li className="text-xs text-amber-300">
                • {t('సంపూర్ణ గృహప్రవేశ మరియు వైదిక హోమ క్రతువులు', 'Comprehensive Gruhapravesam & Vedic Homam rituals')}
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Devotee Desk */}
          <div data-nosnippet>
            <h4 className="text-base font-bold font-telugu text-white mb-3 flex items-center gap-2">
              <Phone size={16} className="text-amber-400" />
              <span>{t('సంప్రదించవలసిన వివరాలు', 'Contact & Devotee Desk')}</span>
            </h4>
            <div className="text-sm font-telugu space-y-3 text-amber-200/90">
              <a
                href={`https://wa.me/918977986166?text=${encodeURIComponent('నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, పూజ / జ్యోతిష వివరాల కోసం సంప్రదిస్తున్నాను.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 rounded-xl text-emerald-200 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  💬
                </div>
                <div>
                  <span className="text-xs text-emerald-300 block font-semibold">{t('వాట్సాప్ సంప్రదింపులు', 'WhatsApp Desk')}</span>
                  <span className="font-mono text-base font-bold text-white tracking-wide">8977986166</span>
                </div>
              </a>

              <a
                href="tel:+918977986166"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone size={16} className="text-amber-400 shrink-0" />
                <span>{t('ఫోన్ కాల్: ', 'Direct Call: ')}<strong className="font-mono text-amber-200 font-semibold tracking-wide">+91 8977986166</strong></span>
              </a>

              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{t('పసుమాముల, హయత్‌నగర్, హైదరాబాద్', 'Pasumamula, Hayathnagar, Hyderabad, Telangana')}</span>
              </p>

              <a
                href="mailto:astrologer@telugujyothisham.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span className="font-mono text-xs text-amber-300">astrologer@telugujyothisham.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Crawlable SEO Internal Links for Vedic Tools & Global Telugu Cities */}
        <div className="py-6 border-b border-amber-900/80 space-y-4 font-telugu">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
              <Compass size={13} />
              <span>{t('ముఖ్యమైన జ్యోతిష & పంచాంగ విభాగాలు (Quick Astrology Tools)', 'Vedic Astrology Calculators & Guides')}</span>
            </h5>
            <div className="flex flex-wrap gap-2">
              {SEO_HUB_LINKS.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    if (onNavigateHubSection) {
                      e.preventDefault();
                      onNavigateHubSection(item.section, item.path);
                    }
                  }}
                  className="text-xs bg-amber-900/60 hover:bg-amber-800 text-amber-100 border border-amber-700/60 px-3 py-1.5 rounded-xl transition-colors"
                >
                  {language === 'en' ? item.labelEn : item.labelTe}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <MapPin size={13} />
              <span>{t('ప్రపంచవ్యాప్త తెలుగు జ్యోతిష సేవలు (India & NRI Cities)', 'Global Telugu Astrologer & Purohit Services')}</span>
            </h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-amber-300/80">
              {POPULAR_CITY_LINKS.map((city) => (
                <a
                  key={city.slug}
                  href={`/telugu-astrologer-in-${city.slug}`}
                  onClick={(e) => {
                    if (onSelectCity) {
                      e.preventDefault();
                      onSelectCity(city.slug);
                    }
                  }}
                  className="hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  {language === 'en' ? `Telugu Astrologer in ${city.nameEn}` : city.nameTe}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Google E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) Shastra Pramana Verification */}
        <div
          itemScope
          itemType="https://schema.org/Person"
          className="py-5 border-b border-amber-900/80 font-telugu"
        >
          <div className="bg-amber-900/40 border border-amber-700/60 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-4xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-600/50 px-2.5 py-0.5 rounded-md">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>
                  {t(
                    'శాస్త్ర ప్రమాణ & జ్యోతిష విద్వాన్ ధృవీకరణ • Verified Vedic Authority',
                    'Verified Vedic Shastra Authority & Editorial Review'
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {t('శాస్త్రీయ పర్యవేక్షణ & రచన: ', 'Authored & Reviewed by: ')}
                <span itemProp="name" className="text-amber-300">
                  {t(
                    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ సిద్ధాంతి గారు (స్మార్త వేద & జ్యోతిష విద్వాంసులు)',
                    'Brahmasri Jallavaram Sai Dheeraj Sharma Siddhanti (Smartha Veda & Jyothisha Vidwan)'
                  )}
                </span>
              </p>
              <p className="text-[11px] sm:text-xs text-amber-200/85 leading-relaxed">
                {t(
                  'ఈ వెబ్‌సైట్‌లోని దైనందిన పంచాంగం, గ్రహ సంచారం, గ్రహ దృష్టి ఫలితాలు, 36 గుణాల వివాహ పొంతన మరియు 100 పేజీల బృహత్ జాతక కుండలి గణనలు దృక్సిద్ధాంతం, వరాహమిహిరుల బృహత్ జాతకం, యవనాచార్యుల మతం, ముహూర్త చింతామణి మరియు నక్షత్ర చూడామణి గ్రంథ ప్రమాణాల ఆధారంగా ధృవీకరించబడ్డాయి.',
                  'All daily Panchangam calculations, Graha Drishti predictions, 36-Guna Vivaha Pontana, and 100-page Janma Kundali reports are verified against Drik Siddhanta ephemeris, Varahamihira Brihat Jataka, Yavanacharya Jataka, and Muhurtha Chintamani.'
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 shrink-0 w-full lg:w-auto text-[11px]">
              <div className="bg-amber-950/90 border border-amber-700/70 rounded-xl px-3 py-2 text-amber-100">
                <span className="text-amber-400 font-bold block">15+ సం|| అనుభవం</span>
                <span>స్మార్త &amp; జ్యోతిష సేవ</span>
              </div>
              <div className="bg-amber-950/90 border border-amber-700/70 rounded-xl px-3 py-2 text-amber-100">
                <span className="text-amber-400 font-bold block">దృక్సిద్ధాంత గణన</span>
                <span>1900–2100 ఖగోళ ప్రమాణం</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shloka, Legal Policy Links (AdSense Compliance) and Dedication */}
        <div className="pt-8 text-center space-y-3 font-telugu">
          <p className="text-base sm:text-lg font-bold text-amber-300">
            {t('సర్వేజనా సుఖినోభవంతు · లోకాః సమస్తాః సుఖినోభవంతు', 'Sarvejana Sukhinobhavantu · Lokah Samastah Sukhino Bhavantu')}
          </p>
          <p className="text-xs sm:text-sm text-amber-200/70">
            {t('సమర్పణ: ', 'Devotedly presented by: ')}<strong>{t('జల్లవరం సాయి ధీరజ్ శర్మ', 'Jallavaram Sai Dheeraj Sharma')}</strong>
          </p>

          {/* Privacy Policy, Terms & Disclaimer Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-amber-300/90">
            <a
              href="/privacy-policy"
              onClick={(e) => {
                if (onOpenLegal) {
                  e.preventDefault();
                  onOpenLegal('privacy');
                }
              }}
              className="hover:text-white underline underline-offset-4 transition-colors"
            >
              {t('గోప్యతా విధానం (Privacy Policy)', 'Privacy Policy')}
            </a>
            <span className="text-amber-700">•</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => {
                if (onOpenLegal) {
                  e.preventDefault();
                  onOpenLegal('terms');
                }
              }}
              className="hover:text-white underline underline-offset-4 transition-colors"
            >
              {t('నిబంధనలు (Terms & Conditions)', 'Terms & Conditions')}
            </a>
            <span className="text-amber-700">•</span>
            <a
              href="/disclaimer"
              onClick={(e) => {
                if (onOpenLegal) {
                  e.preventDefault();
                  onOpenLegal('disclaimer');
                }
              }}
              className="hover:text-white underline underline-offset-4 transition-colors"
            >
              {t('జ్యోతిష్య గమనిక (Disclaimer)', 'Disclaimer')}
            </a>
          </div>

          <p className="text-[11px] text-amber-400/60 max-w-2xl mx-auto leading-normal">
            {t(
              'గమనిక: ఈ సమయాలు ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రాంతాలకు సంబంధించిన ప్రామాణిక సూర్యోదయ గణనలు. ప్రాంతీయ అక్షాంశ, రేఖాంశాలను బట్టి కొన్ని నిమిషాల వ్యత్యాసం ఉండవచ్చు. శుభ కార్యాల కోసం శ్రీ ధీరజ్ శర్మ గారి సలహా తప్పనిసరి.',
              'Note: Timings are computed based on standard astrological planetary calculations for AP, Telangana & worldwide coordinates. Exact planetary transit times may vary slightly by local longitude/latitude.'
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

