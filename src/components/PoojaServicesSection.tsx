import React from 'react';
import { Sparkles, Calendar, Clock, Flame, Shield, ArrowRight } from 'lucide-react';
import { POOJA_SERVICES } from '../data/panchangamData';
import { PoojaService } from '../types/panchangam';

interface PoojaServicesSectionProps {
  onSelectService: (service: PoojaService) => void;
}

export const PoojaServicesSection: React.FC<PoojaServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="my-16 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-display">
          Vedic Rituals & Homams
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-telugu text-amber-950 mt-1">
          శ్రీలక్ష్మి గణపతి వైదిక పూజా & హోమ సేవలు
        </h2>
        <p className="text-slate-600 font-telugu text-base mt-2">
          వేద పండితులు, జ్యోతిష విశారదులు శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే సంప్రదాయబద్ధంగా నిర్వహించబడే విశిష్ట పూజలు & ముహూర్త నిర్ణయాలు.
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
                {service.teluguName}
              </h3>
              <p className="text-xs text-amber-800 font-display tracking-wide mb-3">
                {service.name}
              </p>

              <p className="text-sm text-slate-700 font-telugu leading-relaxed mb-4">
                {service.description}
              </p>

              <div className="space-y-2 text-xs text-slate-600 font-telugu border-t border-slate-100 pt-3">
                <p className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-600 shrink-0" />
                  <span>సమయం: <strong>{service.duration}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-600 shrink-0" />
                  <span>ప్రయోజనం: <strong>{service.benefits}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-600 shrink-0" />
                  <span>అనుకూల దినాలు: {service.recommendedDays}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectService(service)}
              className="mt-6 w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-telugu font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>ఈ పూజను బుక్ చేయండి</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
