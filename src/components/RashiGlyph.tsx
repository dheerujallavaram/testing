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

const RASHI_META_MAP: Record<
  RashiId,
  {
    id: RashiId;
    labelTe: string;
    labelEn: string;
    pngPath: string;
    symbolPngPath: string;
  }
> = {
  mesham: {
    id: 'mesham',
    labelTe: 'మేషం (Aries)',
    labelEn: 'Aries (Mesham)',
    pngPath: '/assets/zodiac/mesham.png',
    symbolPngPath: '/assets/zodiac/mesham-symbol.png',
  },
  vrushabham: {
    id: 'vrushabham',
    labelTe: 'వృషభం (Taurus)',
    labelEn: 'Taurus (Vrushabham)',
    pngPath: '/assets/zodiac/vrushabham.png',
    symbolPngPath: '/assets/zodiac/vrushabham-symbol.png',
  },
  mithunam: {
    id: 'mithunam',
    labelTe: 'మిథునం (Gemini)',
    labelEn: 'Gemini (Mithunam)',
    pngPath: '/assets/zodiac/mithunam.png',
    symbolPngPath: '/assets/zodiac/mithunam-symbol.png',
  },
  karkatakam: {
    id: 'karkatakam',
    labelTe: 'కర్కాటకం (Cancer)',
    labelEn: 'Cancer (Karkatakam)',
    pngPath: '/assets/zodiac/karkatakam.png',
    symbolPngPath: '/assets/zodiac/karkatakam-symbol.png',
  },
  simham: {
    id: 'simham',
    labelTe: 'సింహం (Leo)',
    labelEn: 'Leo (Simham)',
    pngPath: '/assets/zodiac/simham.png',
    symbolPngPath: '/assets/zodiac/simham-symbol.png',
  },
  kanya: {
    id: 'kanya',
    labelTe: 'కన్య (Virgo)',
    labelEn: 'Virgo (Kanya)',
    pngPath: '/assets/zodiac/kanya.png',
    symbolPngPath: '/assets/zodiac/kanya-symbol.png',
  },
  tula: {
    id: 'tula',
    labelTe: 'తుల (Libra)',
    labelEn: 'Libra (Tula)',
    pngPath: '/assets/zodiac/tula.png',
    symbolPngPath: '/assets/zodiac/tula-symbol.png',
  },
  vruschikam: {
    id: 'vruschikam',
    labelTe: 'వృశ్చికం (Scorpio)',
    labelEn: 'Scorpio (Vruschikam)',
    pngPath: '/assets/zodiac/vruschikam.png',
    symbolPngPath: '/assets/zodiac/vruschikam-symbol.png',
  },
  dhanussu: {
    id: 'dhanussu',
    labelTe: 'ధనుస్సు (Sagittarius)',
    labelEn: 'Sagittarius (Dhanussu)',
    pngPath: '/assets/zodiac/dhanussu.png',
    symbolPngPath: '/assets/zodiac/dhanussu-symbol.png',
  },
  makaram: {
    id: 'makaram',
    labelTe: 'మకరం (Capricorn)',
    labelEn: 'Capricorn (Makaram)',
    pngPath: '/assets/zodiac/makaram.png',
    symbolPngPath: '/assets/zodiac/makaram-symbol.png',
  },
  kumbham: {
    id: 'kumbham',
    labelTe: 'కుంభం (Aquarius)',
    labelEn: 'Aquarius (Kumbham)',
    pngPath: '/assets/zodiac/kumbham.png',
    symbolPngPath: '/assets/zodiac/kumbham-symbol.png',
  },
  meenam: {
    id: 'meenam',
    labelTe: 'మీనం (Pisces)',
    labelEn: 'Pisces (Meenam)',
    pngPath: '/assets/zodiac/meenam.png',
    symbolPngPath: '/assets/zodiac/meenam-symbol.png',
  },
};

export function normalizeRashiId(rashi: RashiId | string): RashiId {
  const norm = rashi.toLowerCase().trim();
  switch (norm) {
    case 'mesham':
    case 'aries':
      return 'mesham';
    case 'vrushabham':
    case 'taurus':
      return 'vrushabham';
    case 'mithunam':
    case 'gemini':
      return 'mithunam';
    case 'karkatakam':
    case 'cancer':
      return 'karkatakam';
    case 'simham':
    case 'leo':
      return 'simham';
    case 'kanya':
    case 'virgo':
      return 'kanya';
    case 'tula':
    case 'libra':
      return 'tula';
    case 'vruschikam':
    case 'scorpio':
      return 'vruschikam';
    case 'dhanussu':
    case 'sagittarius':
      return 'dhanussu';
    case 'makaram':
    case 'capricorn':
      return 'makaram';
    case 'kumbham':
    case 'aquarius':
      return 'kumbham';
    case 'meenam':
    case 'pisces':
      return 'meenam';
    default:
      return 'mesham';
  }
}

export function getRashiPngUrl(rashi: RashiId | string, mode: 'medallion' | 'symbol' = 'medallion'): string {
  const key = normalizeRashiId(rashi);
  const meta = RASHI_META_MAP[key];
  return mode === 'symbol' ? meta.symbolPngPath : meta.pngPath;
}

interface RashiGlyphProps {
  rashi: RashiId | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  variant?: 'medallion' | 'symbol';
}

export const RashiGlyph: React.FC<RashiGlyphProps> = ({
  rashi,
  size = 24,
  className = '',
  variant = 'medallion',
}) => {
  const key = normalizeRashiId(rashi);
  const meta = RASHI_META_MAP[key];
  const src = variant === 'symbol' ? meta.symbolPngPath : meta.pngPath;

  return (
    <img
      src={src}
      alt={meta.labelTe}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`inline-block object-contain select-none rounded-full ${className}`}
    />
  );
};

/**
 * Renders an iconic Vedic astrological PNG medallion badge with gold/bronze ornamentation
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
  const key = normalizeRashiId(rashi);
  const meta = RASHI_META_MAP[key];

  const sizeMap = {
    sm: { box: 'w-8 h-8 p-0.5', img: 28 },
    md: { box: 'w-11 h-11 p-0.5', img: 40 },
    lg: { box: 'w-14 h-14 p-1', img: 50 },
  };

  const variantMap = {
    amber: 'bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 border-amber-400 shadow-xs',
    emerald: 'bg-gradient-to-br from-emerald-200 via-amber-100 to-emerald-300 border-emerald-400 shadow-xs',
    rose: 'bg-gradient-to-br from-rose-200 via-amber-100 to-rose-300 border-rose-400 shadow-xs',
    gold: 'bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-500 border-amber-500 shadow-sm',
  };

  const cfg = sizeMap[size];
  const style = variantMap[variant];

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 border-2 transition-all overflow-hidden ${cfg.box} ${style} ${className}`}
    >
      <img
        src={meta.pngPath}
        alt={meta.labelTe}
        width={cfg.img}
        height={cfg.img}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-full select-none"
      />
    </div>
  );
};
