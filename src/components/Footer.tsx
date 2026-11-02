import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Compass } from 'lucide-react';
import { OmEmblem } from './OmEmblem';
import { useLanguage } from '../context/LanguageContext';
import { HubSectionId } from './VedicAstrologyHub';
import { LegalDocType } from './LegalComplianceModal';

export interface FooterProps {
  onSelectCity?: (citySlug: string) => void;
  onNavigateHubSection?: (section: HubSectionId, path: string) => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenAdmin?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
}

const SEO_HUB_LINKS: { section: HubSectionId; path: string; labelTe: string; labelEn: string }[] = [
  { section: 'pontana', path: '/panchangam', labelTe: 'నేటి పంచాంగం (Today Telugu Panchangam)', labelEn: 'Today Telugu Panchangam (నేటి పంచాంగం)' },
  { section: 'pontana', path: '/panchangam/calendar', labelTe: '60 రోజుల తెలుగు పంచాంగం క్యాలెండర్', labelEn: '60-Day Monthly Telugu Panchangam Calendar' },
  { section: 'kundali', path: '/janma-kundali', labelTe: 'పుట్టిన తేదీతో ఉచిత జన్మ కుండలి (Jathakam by Date of Birth)', labelEn: 'Jathakam by Date of Birth in Telugu' },
  { section: 'pontana', path: '/vivaha-pontana', labelTe: '36 గుణాల వివాహ పొంతన (Vivaha Pontana Telugu)', labelEn: '36-Point Vivaha Pontana Marriage Matching' },
  { section: 'babynames', path: '/telugu-baby-names', labelTe: '27 నక్షత్రాల తెలుగు పిల్లల పేర్లు (Telugu Baby Names)', labelEn: 'Telugu Baby Names by Nakshatra' },
  { section: 'pontana', path: '/gowri-panchangam', labelTe: 'గౌరీ పంచాంగం & హోరా చక్రం', labelEn: 'Today Gowri Panchangam & Hora Timings' },
  { section: 'pontana', path: '/tarabalam-chandrabalam', labelTe: 'తారాబలం & చంద్రబలం క్యాలిక్యులేటర్', labelEn: 'Tarabalam & Chandrabalam Calculator' },
  { section: 'pontana', path: '/nitya-sankalpam', labelTe: 'నేటి పూజా సంకల్పం మంత్రం (India & USA)', labelEn: 'Today Telugu Pooja Sankalpam' },
  { section: 'akshara', path: '/naama-nakshatra', labelTe: 'పేరు మొదటి అక్షరంతో రాశి & నక్షత్రం', labelEn: 'Naama Nakshatra Rashi Finder' },
  { section: 'ugadi', path: '/ugadi-rashi-phalalu', labelTe: 'శ్రీ పరాభవ నామ సంవత్సర ఉగాది రాశి ఫలాలు', labelEn: 'Ugadi Yearly Horoscope 2026-2027' },
  { section: 'muhurtham', path: '/shubha-muhurthalu', labelTe: 'శుభ ముహూర్తాలు & పండుగల క్యాలెండర్', labelEn: 'Auspicious Muhurthams & Festivals' },
  { section: 'vastu', path: '/vastu-shastra-telugu', labelTe: 'గృహ వాస్తు చక్రం & దిక్పాలక నియమాలు', labelEn: 'Telugu Gruha Vastu Shastra Guide' },
  { section: 'dosha', path: '/dosha-pariharalu', labelTe: 'ఏలినాటి శని, అష్టమ శని & కుజ దోష పరిహారాలు', labelEn: 'Elinati Shani & Kuja Dosha Remedies' },
];

const VERIFIED_CITY_PANCHANGAM_LINKS: {
  slug: 'hyderabad' | 'vijayawada' | 'visakhapatnam' | 'usa';
  nameTe: string;
  nameEn: string;
}[] = [
  { slug: 'hyderabad', nameTe: 'హైదరాబాద్ నేటి పంచాంగం (Hyderabad)', nameEn: 'Hyderabad Telugu Panchangam' },
  { slug: 'vijayawada', nameTe: 'విజయవాడ నేటి పంచాంగం (Vijayawada)', nameEn: 'Vijayawada Telugu Panchangam' },
  { slug: 'visakhapatnam', nameTe: 'విశాఖపట్నం నేటి పంచాంగం (Visakhapatnam)', nameEn: 'Visakhapatnam Telugu Panchangam' },
  { slug: 'usa', nameTe: 'అమెరికా తెలుగు పంచాంగం (USA EST/CST/PST)', nameEn: 'USA NRI Telugu Panchangam' },
];

export const Footer: React.FC<FooterProps> = ({
  onSelectCity,
  onNavigateHubSection,
  onOpenLegal,
  onNavigateAbout,
  onNavigateContact,
}) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-amber-950 via-[#2a0c03] to-[#1a0701] text-amber-200/80 pt-14 pb-10 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-amber-800/50">
          {/* Col 1: Temple info */}
          <div>
            <h4 className="text-lg font-bold font-telugu text-amber-100 flex items-center gap-2.5 mb-3">
              <OmEmblem className="w-7 h-7 shrink-0" size={28} />
              <span>
                {t(
                  'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (Telugu Jyothisham)',
                  'Telugu Jyothisham • Sreelakshmi Ganapathi Astrology'
                )}
              </span>
            </h4>
            <p className="text-xs sm:text-sm font-telugu text-amber-200/85 leading-relaxed mb-3">
              {t(
                'తెలుగు జ్యోతిషం (Telugu Jyothisham) — బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి దృక్సిద్ధాంత పంచాంగ గణనతో ప్రతిరోజూ నేటి పంచాంగం, తిథి, నక్షత్రం, రాహుకాలం, వర్జ్యం, అభిజిత్ ముహూర్తం, ద్వాదశ రాశి ఫలాలు మరియు ఉచిత జన్మ కుండలి సేవలు.',
                'Telugu Jyothisham — Daily Drik Siddhanta Telugu Panchangam, Tithi, Nakshatra, Rahu Kalam, Varjyam, Abhijit Muhurtham, Rashi Phalalu, and Janma Kundali by Brahmasri Jallavaram Sai Dheeraj Sharma.'
              )}
            </p>
            <a
              href="https://www.telugujyothisham.com/"
              className="inline-block text-xs font-mono font-bold text-amber-300 bg-amber-900/60 hover:bg-amber-800 px-3 py-1 rounded-full border border-amber-500/50 transition-colors"
            >
              🌐 https://www.telugujyothisham.com
            </a>
          </div>

          {/* Col 2: Services & Timings */}
          <div>
            <h4 className="text-base font-bold font-telugu text-amber-100 mb-3 flex items-center gap-2">
              <Clock size={18} className="text-amber-400" />
              <span>{t('జ్యోతిషాలయ సమయాలు & సేవలు', 'Timings & Sacred Services')}</span>
            </h4>
            <ul className="text-xs sm:text-sm font-telugu space-y-2 text-amber-200/85">
              <li>• {t('ఉదయం: 06:30 AM నుండి 12:30 PM వరకు', 'Morning: 06:30 AM to 12:30 PM')}</li>
              <li>• {t('సాయంత్రం: 04:30 PM నుండి 08:30 PM వరకు', 'Evening: 04:30 PM to 08:30 PM')}</li>
              <li className="pt-1 text-amber-300 font-medium">
                ✦{' '}
                {t(
                  'జాతక పరిశీలన, జన్మ కుండలి PDF, 36 గుణాల వివాహ పొంతన & వాస్తు సలహాలు',
                  'Horoscope analysis, Janma Kundali PDF, 36-Guna marriage matching & Vastu guidance'
                )}
              </li>
              <li className="text-amber-300 font-medium">
                ✦{' '}
                {t(
                  'సంపూర్ణ గృహప్రవేశ మరియు వైదిక హోమ క్రతువులు',
                  'Comprehensive Gruhapravesam & Vedic Homam rituals'
                )}
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-base font-bold font-telugu text-amber-100 mb-3 flex items-center gap-2">
              <Phone size={18} className="text-amber-400" />
              <span>{t('సంప్రదించవలసిన వివరాలు', 'Contact & Devotee Desk')}</span>
            </h4>
            <div className="text-xs sm:text-sm font-telugu space-y-3 text-amber-200/85">
              <a
                href={`https://wa.me/918977986166?text=${encodeURIComponent(
                  'నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, పూజ / జ్యోతిష వివరాల కోసం సంప్రదిస్తున్నాను.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-500/50 rounded-2xl text-emerald-100 transition-colors"
              >
                <span className="text-xl">💬</span>
                <div>
                  <span className="text-xs text-emerald-300 block font-bold">
                    {t('వాట్సాప్ సంప్రదింపులు (WhatsApp)', 'WhatsApp Desk')}
                  </span>
                  <span className="font-mono text-base font-bold text-white tracking-wider">
                    +91 89779 86166
                  </span>
                </div>
              </a>

              <a
                href="tel:+918977986166"
                className="flex items-center gap-2 hover:text-amber-100 transition-colors"
              >
                <Phone size={15} className="text-amber-400 shrink-0" />
                <span>
                  {t('ఫోన్ కాల్: ', 'Direct Call: ')}
                  <strong className="font-mono text-amber-300 text-sm">
                    +91 8977986166
                  </strong>
                </span>
              </a>

              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-1" />
                <span>
                  {t(
                    'పసుమాముల, హయత్‌నగర్, హైదరాబాద్ – 501505',
                    'Pasumamula, Hayathnagar, Hyderabad, Telangana – 501505'
                  )}
                </span>
              </p>

              <a
                href="mailto:astrologer@telugujyothisham.com"
                className="flex items-center gap-2 hover:text-amber-100 transition-colors"
              >
                <Mail size={15} className="text-amber-400 shrink-0" />
                <span className="font-mono text-xs text-amber-300">
                  astrologer@telugujyothisham.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Crawlable SEO Internal Links for Vedic Tools & Verified City Timings */}
        <div className="py-6 border-b border-amber-800/50 space-y-5 font-telugu">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-3 flex items-center gap-1.5">
              <Compass size={14} className="text-amber-400" />
              <span>
                {t(
                  'ముఖ్యమైన జ్యోతిష & పంచాంగ విభాగాలు • Quick Astrology Tools',
                  'Vedic Astrology Calculators & Guides'
                )}
              </span>
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
                  className="text-xs bg-amber-900/55 hover:bg-amber-700 text-amber-100 border border-amber-600/50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  ✦ {language === 'en' ? item.labelEn : item.labelTe}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2.5 flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-400" />
              <span>
                {t(
                  'నగరాల వారీగా ఖగోళ పంచాంగ సమయాలు • City Local Panchangam Timings',
                  'City Local Telugu Panchangam Timings'
                )}
              </span>
            </h5>
            <div className="flex flex-wrap gap-2.5 text-xs text-amber-200">
              {VERIFIED_CITY_PANCHANGAM_LINKS.map((city) => (
                <a
                  key={city.slug}
                  href={`/panchangam/${city.slug}`}
                  onClick={(e) => {
                    if (onSelectCity) {
                      e.preventDefault();
                      onSelectCity(city.slug);
                    }
                  }}
                  className="bg-amber-900/40 hover:bg-amber-800/80 px-3 py-1 rounded-full border border-amber-700/50 hover:text-white transition-colors"
                >
                  {language === 'en' ? city.nameEn : city.nameTe}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* E-E-A-T Author Bio Verification */}
        <div
          itemScope
          itemType="https://schema.org/Person"
          className="py-6 border-b border-amber-800/50 font-telugu"
        >
          <div className="bg-amber-950/60 border border-amber-700/50 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-4xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>
                  {t(
                    'రచయిత & సిద్ధాంత పర్యవేక్షణ • Verified Vedic Authority',
                    'Verified Vedic Shastra Authority & Editorial Review'
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-100">
                {t('శాస్త్రీయ పర్యవేక్షణ & రచన: ', 'Authored & Reviewed by: ')}
                <span itemProp="name" className="text-amber-300">
                  {t(
                    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (Jallavaram Sai Dheeraj Sharma)',
                    'Brahmasri Jallavaram Sai Dheeraj Sharma (Smartha Veda & Jyothisha Vidwan)'
                  )}
                </span>
              </p>
              <p className="text-[11px] sm:text-xs text-amber-200/80 leading-relaxed">
                {t(
                  'ఈ వెబ్‌సైట్‌లోని దైనందిన పంచాంగం, గ్రహ సంచారం, 36 గుణాల వివాహ పొంతన మరియు బృహత్ జాతక కుండలి గణనలు దృక్సిద్ధాంతం, వరాహమిహిరుల బృహత్ జాతకం మరియు ముహూర్త చింతామణి గ్రంథ ప్రమాణాల ఆధారంగా ధృవీకరించబడ్డాయి.',
                  'All daily Panchangam calculations, 36-Guna Vivaha Pontana, and Janma Kundali reports are verified against Drik Siddhanta ephemeris, Varahamihira Brihat Jataka, and Muhurtha Chintamani.'
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 shrink-0 w-full lg:w-auto text-[11px]">
              <div className="bg-amber-900/50 border border-amber-600/40 rounded-xl px-3 py-2 text-amber-100">
                <span className="text-amber-300 font-bold block">15+ సం|| అనుభవం</span>
                <span>స్మార్త &amp; జ్యోతిష సేవ</span>
              </div>
              <div className="bg-amber-900/50 border border-amber-600/40 rounded-xl px-3 py-2 text-amber-100">
                <span className="text-amber-300 font-bold block">దృక్సిద్ధాంత గణన</span>
                <span>ఖగోళ సూర్యోదయ ప్రమాణం</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Links: About, Contact, Privacy, Disclaimer, Terms */}
        <div className="pt-8 text-center space-y-2 font-telugu">
          <p className="text-sm sm:text-base font-bold text-amber-300">
            {t(
              'సర్వేజనా సుఖినోభవంతు • లోకాః సమస్తాః సుఖినోభవంతు',
              'Sarvejana Sukhinobhavantu • Lokah Samastah Sukhino Bhavantu'
            )}
          </p>
          <p className="text-xs text-amber-400/75">
            {t('సమర్పణ: ', 'Devotedly presented by: ')}
            <strong className="text-amber-200">
              {t('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ (Jallavaram Sai Dheeraj Sharma)', 'Jallavaram Sai Dheeraj Sharma')}
            </strong>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] sm:text-xs text-amber-300/90 font-semibold">
            <a
              href="/about"
              onClick={(e) => {
                if (onNavigateAbout) {
                  e.preventDefault();
                  onNavigateAbout();
                }
              }}
              className="hover:text-white underline transition-colors"
            >
              {t('మా గురించి (About Us)', 'About Us')}
            </a>
            <span className="text-amber-600">•</span>
            <a
              href="/contact"
              onClick={(e) => {
                if (onNavigateContact) {
                  e.preventDefault();
                  onNavigateContact();
                }
              }}
              className="hover:text-white underline transition-colors"
            >
              {t('సంప్రదించండి (Contact Us)', 'Contact Us')}
            </a>
            <span className="text-amber-600">•</span>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                if (onOpenLegal) {
                  e.preventDefault();
                  onOpenLegal('privacy');
                }
              }}
              className="hover:text-white underline transition-colors"
            >
              {t('గోప్యతా విధానం (Privacy Policy)', 'Privacy Policy')}
            </a>
            <span className="text-amber-600">•</span>
            <a
              href="/disclaimer"
              onClick={(e) => {
                if (onOpenLegal) {
                  e.preventDefault();
                  onOpenLegal('disclaimer');
                }
              }}
              className="hover:text-white underline transition-colors"
            >
              {t('జ్యోతిష్య గమనిక (Disclaimer)', 'Disclaimer')}
            </a>
            <span className="text-amber-600">•</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => {
                if (onOpenLegal) {
                  e.preventDefault();
                  onOpenLegal('terms');
                }
              }}
              className="hover:text-white underline transition-colors"
            >
              {t('నిబంధనలు (Terms & Conditions)', 'Terms & Conditions')}
            </a>
          </div>

          <p className="text-[11px] text-amber-500/60 max-w-2xl mx-auto leading-normal pt-2">
            {t(
              'గమనిక: ఈ వెబ్‌సైట్‌లోని పంచాంగం మరియు జ్యోతిష్య సమాచారం సాంస్కృతిక మరియు ఆధ్యాత్మిక సమాచార అవగాహన కొరకు మాత్రమే (For informational and cultural purposes only).',
              'Disclaimer: All astrological and panchangam information on this site is provided for informational and cultural purposes only.'
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};
