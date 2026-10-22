import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    'నమస్కారం శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు, నాకు పూజ / జాతక పరిశీలన ముహూర్త సమాచారం కావాలి.'
  )}`;

  return (
    <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip badge on hover/desktop */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 bg-white/95 hover:bg-white text-emerald-900 px-3.5 py-2 rounded-full shadow-lg border border-emerald-300 text-xs font-bold font-telugu backdrop-blur-xs transition-all hover:scale-105"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>గురువుగారితో వాట్సాప్‌లో మాట్లాడండి (8977986166)</span>
      </a>

      {/* Pulsing Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        title="శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారితో వాట్సాప్ చాట్ చేయండి (8977986166)"
        aria-label="Chat on WhatsApp with Jallavaram Sai Dheeraj Sharma garu"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none group-hover:opacity-75" />
        <MessageCircle size={30} className="relative z-10 fill-white" />
      </a>
    </aside>
  );
};
