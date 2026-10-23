import React from 'react';
import { Sparkles, Calendar, Clock, Flame, Shield, ArrowRight } from 'lucide-react';
import { POOJA_SERVICES } from '../data/panchangamData';
import { PoojaService } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface PoojaServicesSectionProps {
  onSelectService: (service: PoojaService) => void;
}

export const PoojaServicesSection: React.FC<PoojaServicesSectionProps> = ({ onSelectService }) => {
  const { t, language } = useLanguage();

  return (
    <section id="services" className="my-8 scroll-mt-24 font-telugu">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-display bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          {t('వైదిక క్రతువులు & హోమాలు', 'Authentic Vedic Homams & Rituals')}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-telugu text-amber-950 mt-2">
          {t('శ్రీలక్ష్మి గణపతి వైదిక పూజా & హోమ సేవలు', 'Sreelakshmi Ganapathi Vedic Pooja & Homam Services')}
        </h2>
        <p className="text-slate-600 font-telugu text-base mt-2">
          {t(
            'వేద పండితులు, జ్యోతిష విశారదులు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే సంప్రదాయబద్ధంగా నిర్వహించబడే విశిష్ట పూజలు & ముహూర్త నిర్ణయాలు.',
            'Venerable Vedic rituals, sacred fire ceremonies, and precise muhurtham consultations conducted strictly according to Shastra traditions by Sri Jallavaram Sai Dheeraj Sharma.'
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POOJA_SERVICES.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-amber-200/90 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {service.category === 'homam' ? (
                  <Flame size={24} className="text-amber-700" />
                ) : service.category === 'abhishekam' ? (
                  <Sparkles size={24} className="text-amber-700" />
                ) : service.category === 'muhurtham' ? (
                  <Calendar size={24} className="text-amber-700" />
                ) : (
                  <Shield size={24} className="text-amber-700" />
                )}
              </div>

              <h3 className="text-xl font-bold text-amber-950 font-telugu mb-1">
                {language === 'en' ? service.name : service.teluguName}
              </h3>
              <p className="text-xs text-amber-800 font-display tracking-wide mb-3">
                {language === 'en' ? service.teluguName : service.name}
              </p>

              <p className="text-sm text-slate-700 font-telugu leading-relaxed mb-4">
                {language === 'en' && service.englishDescription
                  ? service.englishDescription
                  : service.description}
              </p>

              <div className="space-y-2 text-xs text-slate-600 font-telugu border-t border-slate-100 pt-3">
                <p className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-600 shrink-0" />
                  <span>
                    {t('సమయం:', 'Duration:')}{' '}
                    <strong>
                      {language === 'en' && service.englishDuration
                        ? service.englishDuration
                        : service.duration}
                    </strong>
                  </span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-600 shrink-0" />
                  <span>
                    {t('ప్రయోజనం:', 'Benefits:')}{' '}
                    <strong>
                      {language === 'en' && service.englishBenefits
                        ? service.englishBenefits
                        : service.benefits}
                    </strong>
                  </span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-600 shrink-0" />
                  <span>
                    {t('అనుకూల దినాలు:', 'Ideal Timings:')}{' '}
                    {language === 'en' && service.englishRecommendedDays
                      ? service.englishRecommendedDays
                      : service.recommendedDays}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectService(service)}
              className="mt-6 w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-telugu font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{t('ఈ పూజను బుక్ చేయండి', 'Book This Vedic Pooja')}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

