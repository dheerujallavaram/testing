import React from 'react';
import {
  Sparkles,
  Star,
  Heart,
  Briefcase,
  ShieldCheck,
  Baby,
  ArrowLeft,
  ArrowRight,
  Compass,
} from 'lucide-react';
import {
  NAKSHATRA_SEO_PROFILES,
  NakshatraSeoProfile,
  findNakshatraBySlug,
} from '../data/nakshatraSeoProfiles';
import { useLanguage } from '../context/LanguageContext';
import type { HubSectionId } from './VedicAstrologyHub';

interface NakshatraSeoPageProps {
  nakshatraSlug: string;
  onSelectNakshatra: (slug: string) => void;
  onNavigateRashi: (rashiSlug: string) => void;
  onNavigateHubSection: (section: HubSectionId, path: string) => void;
  onOpenBooking: () => void;
}

export const NakshatraSeoPage: React.FC<NakshatraSeoPageProps> = ({
  nakshatraSlug,
  onSelectNakshatra,
  onNavigateRashi,
  onNavigateHubSection,
  onOpenBooking,
}) => {
  const { t, language } = useLanguage();
  const profile: NakshatraSeoProfile =
    findNakshatraBySlug(nakshatraSlug) || NAKSHATRA_SEO_PROFILES[0];

  const prevProfile =
    NAKSHATRA_SEO_PROFILES[(profile.index - 2 + 27) % 27] || NAKSHATRA_SEO_PROFILES[26];
  const nextProfile =
    NAKSHATRA_SEO_PROFILES[profile.index % 27] || NAKSHATRA_SEO_PROFILES[0];

  return (
    <div className="space-y-8 font-telugu">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/90 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400 text-amber-950">
            <Star size={13} />
            <span>
              {t(
                `27 నక్షత్రాలు (${profile.index}/27) • ${profile.nameEn} Nakshatra`,
                `Nakshatra ${profile.index} of 27 • ${profile.nameEn}`
              )}
            </span>
          </span>
          <span className="text-xs font-mono text-amber-300 bg-amber-900/70 px-3 py-1 rounded-full border border-amber-500/40">
            /nakshatra/{profile.slug}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 leading-tight">
          {t(
            `${profile.nameTe} నక్షత్రం ఫలితాలు, 4 పాదాల నామ అక్షరాలు & వివాహ పొంతన (${profile.nameEn})`,
            `${profile.nameEn} (${profile.nameTe}) Nakshatra Traits, 4 Pada Syllables & Compatibility`
          )}
        </h1>

        <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed max-w-4xl">
          {language === 'en' ? profile.traitsEn : profile.traitsTe}
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => onNavigateHubSection('babynames', '/telugu-baby-names')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm cursor-pointer transition-all"
          >
            <Baby size={15} />
            <span>{t(`${profile.nameTe} పిల్లల పేర్లు చూడండి`, `Baby Names for ${profile.nameEn}`)}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateHubSection('pontana', '/vivaha-pontana')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-400/60 font-bold text-xs sm:text-sm cursor-pointer transition-all"
          >
            <Heart size={15} />
            <span>{t('36 గుణాల వివాహ పొంతన చెక్ చేయండి', 'Check Marriage Compatibility')}</span>
          </button>
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-amber-300/40 font-bold text-xs sm:text-sm cursor-pointer transition-all"
          >
            <Sparkles size={15} />
            <span>{t('గురువు గారిని సంప్రదించండి', 'Consult Guruji')}</span>
          </button>
        </div>
      </div>

      {/* Astrological Identity & 4 Pada Letters */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold text-amber-950 flex items-center gap-2 border-b border-amber-200 pb-3">
            <Compass size={20} className="text-amber-700" />
            <span>{t('శాస్త్రీయ నక్షత్ర వివరములు (Vedic Parameters)', 'Vedic Astrological Parameters')}</span>
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <dt className="text-xs font-bold text-amber-800">{t('జన్మ రాశి (Moon Sign)', 'Moon Sign (Rashi)')}</dt>
              <dd className="font-extrabold text-amber-950 mt-0.5">
                <a
                  href={`/rashi-phalalu/${profile.rashiSlug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateRashi(profile.rashiSlug);
                  }}
                  className="underline hover:text-orange-700"
                >
                  {language === 'en' ? profile.rashiEn : profile.rashiTe}
                </a>
              </dd>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <dt className="text-xs font-bold text-amber-800">{t('నక్షత్ర అధిపతి (Planetary Lord)', 'Ruling Planet')}</dt>
              <dd className="font-extrabold text-amber-950 mt-0.5">
                {profile.lordTe} ({profile.lordEn})
              </dd>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <dt className="text-xs font-bold text-amber-800">{t('అధిదేవత (Presiding Deity)', 'Presiding Deity')}</dt>
              <dd className="font-extrabold text-amber-950 mt-0.5">
                {language === 'en' ? profile.deityEn : profile.deityTe}
              </dd>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <dt className="text-xs font-bold text-amber-800">{t('నక్షత్ర చిహ్నం (Symbol)', 'Symbol')}</dt>
              <dd className="font-extrabold text-amber-950 mt-0.5">{profile.symbolTe}</dd>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <dt className="text-xs font-bold text-amber-800">{t('గణం & నాడి (Gana & Nadi)', 'Gana & Nadi')}</dt>
              <dd className="font-extrabold text-amber-950 mt-0.5">
                {profile.ganamTe} • {profile.nadiTe}
              </dd>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <dt className="text-xs font-bold text-amber-800">{t('యోని & రజ్జు (Yoni & Rajju)', 'Yoni & Rajju')}</dt>
              <dd className="font-extrabold text-amber-950 mt-0.5">
                {profile.yoniTe} • {profile.rajjuTe}
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold text-amber-950 flex items-center gap-2 border-b border-amber-200 pb-3">
            <Baby size={20} className="text-amber-700" />
            <span>{t('4 పాదాల నామాక్షరాలు (4 Pada Starting Letters)', '4 Pada Naming Syllables')}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.padaSyllablesTe.map((syl, i) => (
              <div
                key={syl}
                className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 text-center"
              >
                <span className="text-[11px] font-bold uppercase text-amber-800 block">
                  {t(`${i + 1}వ పాదం`, `Pada ${i + 1}`)}
                </span>
                <strong className="text-lg sm:text-xl font-extrabold text-amber-950 block mt-1">
                  {language === 'en' ? profile.padaSyllablesEn[i] : syl}
                </strong>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1">
            <strong className="block">{t('నక్షత్ర గాయత్రీ / ఆరాధన మంత్రం:', 'Sacred Nakshatra Mantra:')}</strong>
            <p className="font-bold text-emerald-900">{profile.mantraTe}</p>
          </div>
        </section>
      </div>

      {/* Career, Marriage, Health, Remedies */}
      <div className="grid md:grid-cols-3 gap-5">
        <article className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs space-y-2">
          <h3 className="text-lg font-extrabold text-amber-950 flex items-center gap-2">
            <Briefcase size={18} className="text-amber-700" />
            <span>{t('వృత్తి & ఉద్యోగ రంగాలు', 'Suitable Careers')}</span>
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{profile.careerTe}</p>
        </article>

        <article className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs space-y-2">
          <h3 className="text-lg font-extrabold text-amber-950 flex items-center gap-2">
            <Heart size={18} className="text-rose-600" />
            <span>{t('వివాహ పొంతన & దాంపత్యం', 'Marriage Compatibility')}</span>
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{profile.marriageTe}</p>
        </article>

        <article className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs space-y-2">
          <h3 className="text-lg font-extrabold text-amber-950 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-700" />
            <span>{t('ఆరోగ్యం & వైదిక పరిహారం', 'Health & Vedic Remedy')}</span>
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>{t('ఆరోగ్యం:', 'Health:')}</strong> {profile.healthTe}
          </p>
          <p className="text-sm text-emerald-900 font-semibold leading-relaxed">
            <strong>{t('పరిహారం:', 'Remedy:')}</strong> {profile.remedyTe}
          </p>
        </article>
      </div>

      {/* Prev / Next Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          href={`/nakshatra/${prevProfile.slug}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectNakshatra(prevProfile.slug);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold text-sm"
        >
          <ArrowLeft size={16} />
          <span>{`${prevProfile.nameTe} (${prevProfile.nameEn})`}</span>
        </a>
        <a
          href={`/nakshatra/${nextProfile.slug}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectNakshatra(nextProfile.slug);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold text-sm"
        >
          <span>{`${nextProfile.nameTe} (${nextProfile.nameEn})`}</span>
          <ArrowRight size={16} />
        </a>
      </div>

      {/* All 27 Nakshatras Directory Grid */}
      <section className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-amber-950">
          {t('27 నక్షత్రాల సంపూర్ణ వివరాలు (All 27 Vedic Nakshatras)', 'Explore All 27 Vedic Nakshatras')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {NAKSHATRA_SEO_PROFILES.map((n) => {
            const isActive = n.slug === profile.slug;
            return (
              <a
                key={n.slug}
                href={`/nakshatra/${n.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectNakshatra(n.slug);
                }}
                className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-amber-900 text-amber-100 border-amber-900 shadow-xs'
                    : 'bg-amber-50/70 hover:bg-amber-100 text-amber-950 border-amber-200'
                }`}
              >
                {n.index}. {language === 'en' ? n.nameEn : n.nameTe}
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
};
