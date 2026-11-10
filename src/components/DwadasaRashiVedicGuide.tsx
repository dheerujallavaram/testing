import React, { useState } from 'react';
import {
  Heart,
  Baby,
  Briefcase,
  Activity,
  Moon,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  DWADASA_RASHI_VEDIC_ENCYCLOPEDIA,
  LUNAR_AND_SHANI_MENTAL_GUIDES,
} from '../data/dwadasaRashiVedicEncyclopedia';
import { RashiGlyph } from './RashiGlyph';
import { useLanguage } from '../context/LanguageContext';

export type RashiGuideCategory =
  | 'all'
  | 'spouse'
  | 'parenting'
  | 'career'
  | 'health'
  | 'lunar-shani';

interface DwadasaRashiVedicGuideProps {
  initialRashiId?: string;
  initialCategory?: RashiGuideCategory;
  onOpenBooking?: () => void;
}

export const DwadasaRashiVedicGuide: React.FC<DwadasaRashiVedicGuideProps> = ({
  initialRashiId = 'mesham',
  initialCategory = 'all',
  onOpenBooking,
}) => {
  const { language, t } = useLanguage();
  const [selectedRashiId, setSelectedRashiId] = useState<string>(initialRashiId);
  const [activeCategory, setActiveCategory] = useState<RashiGuideCategory>(initialCategory);
  const [showAllRashisOverview, setShowAllRashisOverview] = useState<boolean>(false);

  const selectedEntry =
    DWADASA_RASHI_VEDIC_ENCYCLOPEDIA.find((r) => r.id === selectedRashiId) ||
    DWADASA_RASHI_VEDIC_ENCYCLOPEDIA[0];

  const categoryTabs: {
    id: RashiGuideCategory;
    labelTe: string;
    labelEn: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    {
      id: 'all',
      labelTe: 'సంపూర్ణ రాశి దర్శిని (అన్నీ)',
      labelEn: 'Complete Rashi Profile (All)',
      icon: BookOpen,
    },
    {
      id: 'spouse',
      labelTe: 'భార్య – భర్తల మనస్తత్వం',
      labelEn: 'Wife & Husband Psychology',
      icon: Heart,
    },
    {
      id: 'parenting',
      labelTe: 'పిల్లల స్వభావం & పెంపకం',
      labelEn: 'Child Nature & Parenting',
      icon: Baby,
    },
    {
      id: 'career',
      labelTe: 'వృత్తి, భాగస్వామ్యం & ధనయోగం',
      labelEn: 'Career, Business & Wealth',
      icon: Briefcase,
    },
    {
      id: 'health',
      labelTe: 'చంద్ర రాశి మనస్సు & ఆరోగ్యం',
      labelEn: 'Moon Sign Mind & Health',
      icon: Activity,
    },
    {
      id: 'lunar-shani',
      labelTe: 'పౌర్ణమి-అమావాస్య & శని ప్రభావం',
      labelEn: 'Lunar Tides & Saturn Guide',
      icon: Moon,
    },
  ];

  const handleConsultWhatsApp = (rashiName: string) => {
    const msg = `నమస్కారం బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, మా జన్మ రాశి (${rashiName}) ప్రకారం వివాహ దాంపత్యం, పిల్లల విద్యా భవిష్యత్తు, వ్యాపార-వృత్తి మరియు గ్రహ శాంతి పరిహారాల గురించి వ్యక్తిగత జాతక పరిశీలన కోరుకుంటున్నాను.`;
    window.open(`https://wa.me/918977986166?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <article
      id="dwadasa-rashi-vedic-encyclopedia"
      className="bg-white border border-amber-200/90 rounded-3xl p-5 sm:p-8 shadow-xl space-y-8 font-telugu"
    >
      {/* Editorial Header */}
      <header className="border-b border-amber-200 pb-6 space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
          {t(
            'శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం • బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో',
            'Sri Lakshmi Ganapathi Jyothishalayam • Guided by Brahmasri Jallavaram Sai Dheeraj Sharma'
          )}
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950 leading-tight">
          {t(
            'ద్వాదశ రాశుల సంపూర్ణ జీవన విజ్ఞాన సర్వస్వం — దాంపత్యం, సంతానం, వృత్తి, ధనాకర్షణ & ఆరోగ్య రహస్యాలు',
            '12 Chandra Rashi Complete Vedic Life Encyclopedia — Spouse Psychology, Parenting, Career, Wealth & Health'
          )}
        </h2>
        <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-4xl">
          {t(
            'వేద జ్యోతిష్య శాస్త్రం ప్రకారం ప్రతి మనిషి జన్మ రాశి (చంద్ర రాశి) మరియు రాశ్యాధిపతి ప్రభావం వారి వైవాహిక దాంపత్యం, భార్యాభర్తల ఆలోచనా విధానం, పిల్లల చదువు-పెంపకం, వ్యాపార భాగస్వామ్యం, ధన సంపాదన మరియు శారీరక-మానసిక ఆరోగ్యంపై ఎలా ఉంటుందో క్రింద మీ రాశిని ఎంచుకుని వివరంగా తెలుసుకోండి.',
            'Select any Moon Sign (Chandra Rashi) below to explore authentic Vedic insights on Wife & Husband marital psychology, child education & parenting guide, business partnership compatibility, wealth attraction, and physical-mental health.'
          )}
        </p>
      </header>

      {/* Interactive Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-amber-50/90 p-2 rounded-2xl border border-amber-200">
        {categoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-900 text-amber-50 shadow-xs'
                  : 'text-amber-950 hover:bg-amber-100/80'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-amber-300' : 'text-amber-700'} />
              <span>{language === 'te' ? tab.labelTe : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 12 Rashi Interactive Selector Grid */}
      {activeCategory !== 'lunar-shani' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-amber-950">
              {t(
                'మీ జన్మ రాశిని (చంద్ర రాశిని) ఎంచుకోండి:',
                'Select Your Birth Moon Sign (Chandra Rashi):'
              )}
            </h3>
            <button
              type="button"
              onClick={() => setShowAllRashisOverview(!showAllRashisOverview)}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-700 cursor-pointer whitespace-nowrap"
            >
              {showAllRashisOverview
                ? t('ఒక్క రాశి వివరాలు మాత్రమే చూడండి', 'Show Single Selected Rashi')
                : t('12 రాశుల జాబితా ఒకేసారి చదవండి (SEO Full View)', 'View All 12 Rashis Together')}
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {DWADASA_RASHI_VEDIC_ENCYCLOPEDIA.map((rashi) => {
              const isSelected = selectedRashiId === rashi.id;
              return (
                <button
                  key={rashi.id}
                  type="button"
                  onClick={() => {
                    setSelectedRashiId(rashi.id);
                    setShowAllRashisOverview(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#3b0a0a] to-amber-950 text-amber-100 border-amber-500 shadow-md'
                      : 'bg-amber-50/40 hover:bg-amber-100/60 text-amber-950 border-amber-200'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    <RashiGlyph rashi={rashi.id} size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold truncate">
                      {language === 'te' ? rashi.rashiNameTe : rashi.rashiNameEn.split(' ')[0]}
                    </p>
                    <p
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-amber-300/90' : 'text-stone-600'
                      }`}
                    >
                      {language === 'te'
                        ? rashi.rashiLordTe.split(' ')[0]
                        : rashi.rashiLordEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Rashi Detailed Profile (or All 12 Rashis when toggled) */}
      {activeCategory !== 'lunar-shani' && (
        <div className="space-y-10">
          {(showAllRashisOverview ? DWADASA_RASHI_VEDIC_ENCYCLOPEDIA : [selectedEntry]).map(
            (entry) => (
              <div
                key={entry.id}
                className="bg-[#faf7f2] border border-amber-300/90 rounded-3xl p-5 sm:p-7 space-y-6"
              >
                {/* Rashi Banner Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-amber-200">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center shrink-0 border border-amber-500">
                      <RashiGlyph rashi={entry.id} size={26} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                        {language === 'te'
                          ? `${entry.index}. ${entry.rashiNameTe} (${entry.rashiNameEn}) — సంపూర్ణ జీవన విశ్లేషణ`
                          : `${entry.index}. ${entry.rashiNameEn} — Complete Vedic Analysis`}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-stone-700 mt-1">
                        <span>
                          <strong>{t('రాశ్యాధిపతి:', 'Ruling Planet:')}</strong>{' '}
                          {language === 'te' ? entry.rashiLordTe : entry.rashiLordEn}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          <strong>{t('తత్వం:', 'Element:')}</strong>{' '}
                          {language === 'te' ? entry.tatvamTe : entry.tatvamEn}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          <strong>{t('నక్షత్ర పాదాలు:', 'Nakshatras:')}</strong>{' '}
                          {language === 'te' ? entry.nakshatrasTe : entry.nakshatrasEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConsultWhatsApp(entry.rashiNameTe)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start lg:self-auto"
                  >
                    <MessageCircle size={16} />
                    <span>
                      {t('గురువుగారిని వాట్సాప్‌లో సంప్రదించండి', 'Consult Guruji on WhatsApp')}
                    </span>
                  </button>
                </div>

                {/* 1. SPOUSE PSYCHOLOGY (WIFE & HUSBAND) */}
                {(activeCategory === 'all' || activeCategory === 'spouse') && (
                  <section className="space-y-4">
                    <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
                      <Heart size={18} className="text-rose-700 shrink-0" />
                      <span>
                        {language === 'te'
                          ? `01. ${entry.rashiNameTe} భార్య – భర్తల మనస్తత్వం & దాంపత్య రహస్యం`
                          : `01. ${entry.rashiNameEn} Wife & Husband Marital Psychology`}
                      </span>
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-800">
                          {t(
                            'వధువు / భార్య స్వభావం (Wife Nature)',
                            'Bride / Wife Temperament'
                          )}
                        </p>
                        <h5 className="text-base font-extrabold text-amber-950">
                          {language === 'te'
                            ? `${entry.rashiNameTe}లో జన్మించిన ఇల్లాలు`
                            : `The ${entry.rashiNameEn.split(' ')[0]} Wife`}
                        </h5>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te' ? entry.wifeProfileTe : entry.wifeProfileEn}
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                          {t(
                            'వరుడు / భర్త స్వభావం (Husband Nature)',
                            'Groom / Husband Temperament'
                          )}
                        </p>
                        <h5 className="text-base font-extrabold text-amber-950">
                          {language === 'te'
                            ? `${entry.rashiNameTe}లో జన్మించిన పురుషుడు (భర్త)`
                            : `The ${entry.rashiNameEn.split(' ')[0]} Husband`}
                        </h5>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te' ? entry.husbandProfileTe : entry.husbandProfileEn}
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-950">
                      <strong>
                        {t('దాంపత్య అన్యోన్యత సూత్రం:', 'Marital Harmony Principle:')}{' '}
                      </strong>
                      <span>
                        {language === 'te'
                          ? entry.maritalHarmonySutraTe
                          : entry.maritalHarmonySutraEn}
                      </span>
                    </div>
                  </section>
                )}

                {/* 2. PARENTING & CHILD NATURE */}
                {(activeCategory === 'all' || activeCategory === 'parenting') && (
                  <section className="space-y-4 pt-2 border-t border-amber-200/70">
                    <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
                      <Baby size={18} className="text-amber-700 shrink-0" />
                      <span>
                        {language === 'te'
                          ? `02. ${entry.rashiNameTe} పిల్లల స్వభావం, విద్యా ప్రతిభ & తల్లిదండ్రులకు సూచనలు`
                          : `02. ${entry.rashiNameEn} Child Psychology, Study Habits & Parenting Guide`}
                      </span>
                    </h4>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-amber-800">
                          {t('శిశువు / పిల్లల సహజ ప్రతిభ & చదువు', 'Child Nature & Learning Style')}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te'
                            ? entry.childNatureAndStudyTe
                            : entry.childNatureAndStudyEn}
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-emerald-800">
                          {t('తల్లిదండ్రులు పెంచాల్సిన విధానం', 'How Parents Should Guide Them')}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te' ? entry.parentingGuideTe : entry.parentingGuideEn}
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-amber-900">
                          {t(
                            `${entry.rashiNameTe} తల్లిదండ్రుల స్వభావం`,
                            `The ${entry.rashiNameEn.split(' ')[0]} Parent`
                          )}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te'
                            ? entry.parentTemperamentTe
                            : entry.parentTemperamentEn}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* 3. CAREER, BUSINESS PARTNERSHIPS & WEALTH */}
                {(activeCategory === 'all' || activeCategory === 'career') && (
                  <section className="space-y-4 pt-2 border-t border-amber-200/70">
                    <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
                      <Briefcase size={18} className="text-amber-800 shrink-0" />
                      <span>
                        {language === 'te'
                          ? `03. ${entry.rashiNameTe} జీవన వృత్తి, వ్యాపార భాగస్వామ్యం & ధనాకర్షణ రహస్యం`
                          : `03. ${entry.rashiNameEn} Life Work, Business Partnerships & Wealth Attraction`}
                      </span>
                    </h4>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-amber-900">
                          {t('అనుకూల ఉద్యోగ & వృత్తి రంగాలు', 'Ideal Professions & Career')}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te' ? entry.careerLifeWorkTe : entry.careerLifeWorkEn}
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-amber-900">
                          {t('వ్యాపార భాగస్వామ్య పొంతన', 'Business Partnership Suitability')}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te'
                            ? entry.businessPartnershipTe
                            : entry.businessPartnershipEn}
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-emerald-800">
                          {t('ధనాకర్షణ & ఆస్తుల వృద్ధి', 'Wealth & Money Attraction')}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te' ? entry.wealthAttractionTe : entry.wealthAttractionEn}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-amber-200 rounded-2xl p-3.5 text-xs sm:text-sm text-stone-800 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <strong className="text-amber-950">
                          {t(
                            'వివాహం & వ్యాపార భాగస్వామ్యానికి అత్యంత అనుకూల రాశులు:',
                            'Most Harmonious Rashis for Marriage & Business:'
                          )}{' '}
                        </strong>
                        <span>
                          {language === 'te'
                            ? entry.bestPartnerRashisTe
                            : entry.bestPartnerRashisEn}
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                {/* 4. CHANDRA RASHI MIND & MEDICAL ASTROLOGY (HEALTH) */}
                {(activeCategory === 'all' || activeCategory === 'health') && (
                  <section className="space-y-4 pt-2 border-t border-amber-200/70">
                    <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
                      <Activity size={18} className="text-emerald-700 shrink-0" />
                      <span>
                        {language === 'te'
                          ? `04. ${entry.rashiNameTe} చంద్ర మానసిక తత్వం, శరీర అవయవ ప్రభావం & ఆరోగ్య రక్షణ`
                          : `04. ${entry.rashiNameEn} Lunar Disposition, Anatomical Influence & Health Guide`}
                      </span>
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-amber-800">
                          {t('చంద్ర రాశి అంతరంగం & మనస్తత్వం', 'Chandra Rashi Mental Blueprint')}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te'
                            ? entry.chandraManasikaTatvamTe
                            : entry.chandraManasikaTatvamEn}
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-1.5">
                        <p className="text-xs font-bold text-emerald-800">
                          {t(
                            `కాలపురుష అవయవ స్థానం (${entry.kalapurushaAngamTe}) & ఆరోగ్య జాగ్రత్తలు`,
                            `Anatomical Governance (${entry.kalapurushaAngamEn}) & Health Care`
                          )}
                        </p>
                        <p className="text-sm text-stone-800 leading-relaxed">
                          {language === 'te' ? entry.arogyaRakshaTe : entry.arogyaRakshaEn}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-amber-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          {t('శాస్త్రోక్త గ్రహ శాంతి & ఆరాధన పరిహారం', 'Vedic Propitiation & Remedy')}
                        </p>
                        <p className="text-sm font-medium">
                          {language === 'te' ? entry.vedicRemedyTe : entry.vedicRemedyEn}
                        </p>
                      </div>
                      {onOpenBooking && (
                        <button
                          type="button"
                          onClick={onOpenBooking}
                          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                        >
                          {t('పూజ / అభిషేకం బుక్ చేయండి', 'Book Vedic Pooja')}
                        </button>
                      )}
                    </div>
                  </section>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* 5. LUNAR TIDES (PURNIMA / AMAVASYA / CHANDRASHTAMAM) & SATURN TRANSIT (ELINATI SHANI) MENTAL RESILIENCE GUIDE */}
      {(activeCategory === 'all' || activeCategory === 'lunar-shani') && (
        <section className="space-y-6 pt-4 border-t-2 border-amber-300">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
              {t(
                'వేద జ్యోతిష్య మనోవిజ్ఞాన శాస్త్రం • VEDIC ASTRO-PSYCHOLOGY & TRANSIT RESILIENCE',
                'Vedic Astro-Psychology & Planetary Transit Resilience'
              )}
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2">
              <Moon size={22} className="text-amber-700 shrink-0" />
              <span>
                {t(
                  '05. మనస్సుపై చంద్ర కళల ప్రభావం (పౌర్ణమి–అమావాస్య) & శని గోచార (ఏలినాటి శని) మనోధైర్య మార్గదర్శి',
                  '05. How Lunar Tides & Saturn Transits Influence Moods — And How to Overcome Worry'
                )}
              </span>
            </h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {LUNAR_AND_SHANI_MENTAL_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="bg-[#faf7f2] border border-amber-300 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-amber-800">
                      {language === 'te' ? guide.subtitleTe : guide.subtitleEn}
                    </p>
                    <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 mt-0.5">
                      {language === 'te' ? guide.titleTe : guide.titleEn}
                    </h4>
                  </div>

                  <p className="text-sm text-stone-800 leading-relaxed bg-white p-4 rounded-2xl border border-amber-200">
                    {language === 'te' ? guide.shastraPrincipleTe : guide.shastraPrincipleEn}
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                      {t('ఆచరణాత్మక జీవన సూత్రాలు:', 'Practical Dharmic Steps:')}
                    </p>
                    <ul className="space-y-2">
                      {(language === 'te'
                        ? guide.practicalGuidanceTe
                        : guide.practicalGuidanceEn
                      ).map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-stone-800 leading-relaxed"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-emerald-700 shrink-0 mt-0.5"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-100/80 border border-amber-300 rounded-2xl p-3.5 text-xs sm:text-sm text-amber-950">
                  <strong className="inline-flex items-center gap-1 text-amber-900">
                    <Sparkles size={14} />
                    <span>{t('శాంతి పరిహారం:', 'Vedic Remedy:')}</span>
                  </strong>{' '}
                  <span>{language === 'te' ? guide.remedyTe : guide.remedyEn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. GLOBAL ZODIAC RANKINGS, GEMINI POWER/IQ & LIBRA TRUE LOVE / SOULMATE PILLAR GUIDES */}
      <section className="space-y-6 pt-6 border-t-2 border-amber-300">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {t(
              'ప్రపంచ రాశి ర్యాంకింగ్స్ & ఆత్మబంధువు విశ్లేషణ • GLOBAL ZODIAC POWER, IQ & SOULMATE GUIDES',
              'Global Zodiac Power, IQ, Soulmate & 4 Pillars of Astrology Guides'
            )}
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2">
            <Sparkles size={22} className="text-amber-700 shrink-0" />
            <span>
              {t(
                '06. మిథున రాశి సూపర్ పవర్స్ (Why Are Geminis So Powerful?) & తుల రాశి నిజమైన ప్రేమ (Who Is Libra’s True Love?)',
                '06. Why Are Geminis So Powerful? & Who Is Libra’s True Love? (Complete Ranking Guides)'
              )}
            </span>
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Card 1: Why Are Geminis So Powerful & Global Zodiac Rankings */}
          <div className="bg-gradient-to-br from-[#fffdf7] to-[#fff5e0] border-2 border-amber-400 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-md">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-100 text-[10px] font-extrabold uppercase tracking-wider">
                  {t('మిథున రాశి శక్తి & IQ • Gemini Power & IQ', 'Gemini Power, IQ & Rankings')}
                </span>
                <span className="text-xs font-bold text-amber-800">
                  {t('18 నిమిషాల సమగ్ర వ్యాసం', '18 Min Pillar Treatise')}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 leading-snug">
                {t(
                  'మిథున రాశి వారు ఎందుకు అంత శక్తివంతులు? (Why Are Geminis So Powerful?) – IQ, సూపర్ పవర్స్ & టాప్ 3 శక్తివంతమైన రాశులు',
                  'Why Are Geminis So Powerful? – Gemini IQ, Superpowers, #1 Soulmate & Top 3 Most Powerful, Rarest, Richest Zodiac Signs'
                )}
              </h4>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {t(
                  'బుధ గ్రహ మేధాశక్తి, మిథున రాశి రహస్య ప్రతిభ (Hidden Talents), IQ స్థాయి (120–135+), ఆకర్షణ రహస్యం, #1 Soulmate (తుల/కుంభం), డ్రీమ్ జాబ్ మరియు ప్రపంచంలో అత్యంత శక్తివంతమైన 3 రాశులు (Scorpio, Leo, Aries/Capricorn), అత్యంత అరుదైన రాశి (Aquarius), అందమైన రాశులు (Libra, Taurus), అదృష్ట రాశులు (Sagittarius, Pisces) మరియు ధనిక రాశుల పూర్తి విశ్లేషణ.',
                  'Complete Vedic and psychological answers to: Why are Geminis so powerful? Do Geminis have a high IQ? Is Gemini a devil or angel? Who is Gemini’s #1 soulmate? Plus definitive rankings for the top 3 most powerful (Scorpio, Leo, Aries/Capricorn), rarest (Aquarius), most beautiful (Libra, Taurus, Pisces), luckiest (Sagittarius, Pisces), richest, and Big 3 zodiac signs.'
                )}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Why are Geminis so powerful?',
                  'Do Geminis have a high IQ?',
                  'Top 3 most powerful zodiac signs',
                  'Top 3 rarest zodiac signs',
                  'Richest & luckiest zodiac signs',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-white text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="/why-are-geminis-so-powerful"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-amber-50 font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>
                {t(
                  'మిథున రాశి శక్తి & 12 రాశుల ర్యాంకింగ్స్ వ్యాసం చదవండి →',
                  'Read Full Gemini Power & Zodiac Rankings Guide →'
                )}
              </span>
            </a>
          </div>

          {/* Card 2: Who Is Libra's True Love & 4 Pillars of Astrology */}
          <div className="bg-gradient-to-br from-[#fffdf7] to-[#fff5e0] border-2 border-amber-400 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-md">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-900 text-rose-100 text-[10px] font-extrabold uppercase tracking-wider">
                  {t('తుల రాశి ప్రేమ & వివాహం • Libra True Love', 'Libra Soulmate & 4 Pillars')}
                </span>
                <span className="text-xs font-bold text-amber-800">
                  {t('19 నిమిషాల సమగ్ర వ్యాసం', '19 Min Pillar Treatise')}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 leading-snug">
                {t(
                  'తుల రాశి వారి నిజమైన ప్రేమ ఎవరు? (Who Is Libra’s True Love?) – వివాహ పొంతన, కర్కాటక రాశి #1 ఆత్మబంధువు & జ్యోతిష 4 మూలస్తంభాలు',
                  'Who Is Libra’s True Love? – Who Libras Usually Marry, Red Flags, Cancer’s #1 Soulmate & The 4 Pillars of Astrology'
                )}
              </h4>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {t(
                  'శుక్ర గ్రహ తుల రాశి వారికి వాయు తత్త్వ రాశులైన మిథునం (Gemini), కుంభం (Aquarius) మరియు అగ్ని రాశులైన సింహం (Leo), మేషం (Aries) ఎందుకు నిజమైన ప్రేమ భాగస్వాములు అవుతారు? తుల రాశి వివాహ నిబద్ధత, Red Flags, కర్కాటక రాశి #1 ఆత్మబంధువు (Scorpio/Pisces) మరియు జ్యోతిష శాస్త్ర 4 మూలస్తంభాల (Planets, 12 Signs, 12 Houses, Aspects/Dashas) సులభ వివరణ.',
                  'Discover why fellow Air signs (Gemini, Aquarius) and Fire signs (Leo, Aries) are Libra’s true love and lifelong marriage partners, Libra red flags and loyalty, who Cancer’s #1 soulmate is (Scorpio/Pisces), how to explain astrology to a beginner, and the 4 Pillars of Astrology.'
                )}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Who is Libra's true love?",
                  'Who do Libras usually marry?',
                  "Who is Cancer's #1 soulmate?",
                  'What are the 4 pillars of astrology?',
                  'How do you explain astrology?',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-white text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="/who-is-libras-true-love"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-amber-50 font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>
                {t(
                  'తుల రాశి ప్రేమ & జ్యోతిష మూలస్తంభాల వ్యాసం చదవండి →',
                  'Read Full Libra Soulmate & Astrology Pillars Guide →'
                )}
              </span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
};

