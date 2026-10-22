import React from 'react';

export type RashiId =
  | 'mesham'
  | 'vrushabham'
  | 'mithunam'
  | 'karkatakam'
  | 'simham'
  | 'kanya'
  | 'tula'
  | 'vruschikam'
  | 'dhanussu'
  | 'makaram'
  | 'kumbham'
  | 'meenam';

interface RashiGlyphProps {
  rashi: RashiId | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const RashiGlyph: React.FC<RashiGlyphProps> = ({
  rashi,
  size = 24,
  className = '',
  strokeWidth = 2,
}) => {
  const normId = rashi.toLowerCase().trim();

  // Clean, authentic, iconic vector astrological glyphs for all 12 Rashis
  switch (normId) {
    case 'mesham':
    case 'aries':
      // The Ram (మేషం) - Classical Ram Horns
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="మేషం (Aries)"
        >
          <path d="M12 21V8" />
          <path d="M12 8C10 5 6 4 4 7c-1.5 2.2-.5 5 2 5 2 0 4-2 6-4" />
          <path d="M12 8c2-3 6-4 8-1 1.5 2.2.5 5-2 5-2 0-4-2-6-4" />
        </svg>
      );

    case 'vrushabham':
    case 'taurus':
      // The Bull (వృషభం) - Bull Head & Celestial Horns
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="వృషభం (Taurus)"
        >
          <circle cx="12" cy="14" r="6" />
          <path d="M5 4c2.5 3.5 5 4.5 7 4.5s4.5-1 7-4.5" />
        </svg>
      );

    case 'mithunam':
    case 'gemini':
      // The Twins (మిథునం) - Divine Dual Columns with Top & Base Pillars
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="మిథునం (Gemini)"
        >
          <path d="M4 4.5C8 6 16 6 20 4.5" />
          <path d="M4 19.5c4-1.5 12-1.5 16 0" />
          <path d="M9 5.5v13" />
          <path d="M15 5.5v13" />
        </svg>
      );

    case 'karkatakam':
    case 'cancer':
      // The Crab (కర్కాటకం) - Sacred Yin-Yang / Dual Claws
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="కర్కాటకం (Cancer)"
        >
          <circle cx="7" cy="9.5" r="3.5" />
          <path d="M10.5 9.5C13 9.5 19 8.5 20 4.5" />
          <circle cx="17" cy="14.5" r="3.5" />
          <path d="M13.5 14.5C11 14.5 5 15.5 4 19.5" />
        </svg>
      );

    case 'simham':
    case 'leo':
      // The Lion (సింహం) - Royal Mane and Graceful Tail
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="సింహం (Leo)"
        >
          <circle cx="7" cy="15" r="3" />
          <path d="M8.5 12.5C9.5 8 13.5 5 17 6.5c3 1.3 2.5 5.5.5 7-2 1.5-3 3-2.5 5.5.4 2 2 2.5 3 2" />
        </svg>
      );

    case 'kanya':
    case 'virgo':
      // The Maiden (కన్య) - Divine Wing & Sheaf of Grain
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="కన్య (Virgo)"
        >
          <path d="M4 6.5c1-1.5 3-2 4.5-.5S10 10 10 18" />
          <path d="M8.5 7.5C9.5 6 11.5 5.5 13 7s1.5 4 1.5 11" />
          <path d="M13 7.5c1-1.5 3-2 4.5-.5s1.5 4 1.5 11" />
          <path d="M17.5 13.5c1.5-1 3-1 4 .5s.5 4-2 6l-3.5 2.5" />
        </svg>
      );

    case 'tula':
    case 'libra':
      // The Scales (తుల) - Sacred Balance of Justice & Harmony
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="తుల (Libra)"
        >
          <path d="M4 19h16" />
          <path d="M4 14h16" />
          <path d="M12 6a3.5 3.5 0 0 1 3.5 3.5H8.5A3.5 3.5 0 0 1 12 6Z" />
        </svg>
      );

    case 'vruschikam':
    case 'scorpio':
      // The Scorpion (వృశ్చికం) - Stinger Arrow Barb
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="వృశ్చికం (Scorpio)"
        >
          <path d="M4 6.5c1-1.5 3-2 4.5-.5S10 10 10 18" />
          <path d="M8.5 7.5C9.5 6 11.5 5.5 13 7s1.5 4 1.5 11" />
          <path d="M13 7.5c1-1.5 3-2 4.5-.5s1.5 4 1.5 11l2-2.5h3" />
          <path d="M21 12.5v5.5l-2.5-2.5" />
        </svg>
      );

    case 'dhanussu':
    case 'sagittarius':
      // The Archer (ధనుస్సు) - Celestial Bow & Drawn Arrow
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="ధనుస్సు (Sagittarius)"
        >
          <path d="M5 19 20 4" />
          <path d="M14 4h6v6" />
          <path d="M8.5 11.5 12.5 15.5" />
        </svg>
      );

    case 'makaram':
    case 'capricorn':
      // The Makara (మకరం) - Sacred Horned Creature & Tail Loop
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="మకరం (Capricorn)"
        >
          <path d="M4 6.5c1-1.5 3-2 4.5-.5S10 10 10 18" />
          <path d="M8.5 7.5C9.5 6 11.5 5.5 13 7s1.5 4 1.5 11" />
          <path d="M14.5 11.5c2 1 4 3 3.5 5.5-.5 2.5-2.5 3.5-4 2-1.5-1.5-1-4.5 2-6 2-1 4.5 0 5 1.5" />
        </svg>
      );

    case 'kumbham':
    case 'aquarius':
      // The Water Pot (కుంభం) - Dual Cosmic Amrita Waves
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="కుంభం (Aquarius)"
        >
          <path d="m3.5 9 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 2 1.5" />
          <path d="m3.5 15 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 2 1.5" />
        </svg>
      );

    case 'meenam':
    case 'pisces':
      // The Two Fishes (మీనం) - Dual Matsya Connected by Sacred Cord
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="మీనం (Pisces)"
        >
          <path d="M6 4c2.5 4 2.5 12 0 16" />
          <path d="M18 4c-2.5 4-2.5 12 0 16" />
          <path d="M4 12h16" />
        </svg>
      );

    default:
      // Fallback sacred star
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
};

/**
 * Renders an iconic Vedic astrological emblem badge with gold/bronze ornamentation
 */
interface RashiMedallionProps {
  rashi: RashiId | string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'amber' | 'emerald' | 'rose' | 'gold';
  className?: string;
}

export const RashiMedallion: React.FC<RashiMedallionProps> = ({
  rashi,
  size = 'md',
  variant = 'amber',
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 14, stroke: 1.8 },
    md: { box: 'w-10 h-10', icon: 20, stroke: 2 },
    lg: { box: 'w-13 h-13', icon: 26, stroke: 2.2 },
  };

  const variantMap = {
    amber: 'bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200/80 text-amber-900 border-amber-300/90 shadow-xs',
    emerald: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-200/80 text-emerald-900 border-emerald-300/90 shadow-xs',
    rose: 'bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200/80 text-rose-900 border-rose-300/90 shadow-xs',
    gold: 'bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-500 text-amber-950 border-amber-500 shadow-sm',
  };

  const cfg = sizeMap[size];
  const style = variantMap[variant];

  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 border transition-all ${cfg.box} ${style} ${className}`}
    >
      <RashiGlyph rashi={rashi} size={cfg.icon} strokeWidth={cfg.stroke} />
    </div>
  );
};
