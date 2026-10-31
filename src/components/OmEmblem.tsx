import React, { useId } from 'react';

interface OmEmblemProps {
  className?: string;
  size?: number;
}

/**
 * Sacred Sri Lakshmi Ganapathi Emblem (Lord Ganesha Traditional Temple Icon)
 * Renders an ornate golden-haloed Lord Ganapathi illustration with Kireetam (crown),
 * sacred Vibhuti & Kumkuma Tilak, elephant ears, Ekadanta (tusk), and curved trunk holding a Modakam.
 */
export const OmEmblem: React.FC<OmEmblemProps> = ({ className = 'w-9 h-9', size = 38 }) => {
  const rawId = useId().replace(/:/g, '');
  const bgId = `ganapathiBgGrad-${rawId}`;
  const rimId = `goldRimGrad-${rawId}`;
  const crownId = `goldCrownGrad-${rawId}`;
  const skinId = `ganapathiSkinGrad-${rawId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="శ్రీ మహా గణపతి (Lord Sri Maha Ganapathi)"
      role="img"
    >
      <defs>
        <radialGradient id={bgId} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#991B1B" />
          <stop offset="70%" stopColor="#7F1D1D" />
          <stop offset="100%" stopColor="#450A0A" />
        </radialGradient>
        <linearGradient id={rimId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id={crownId} x1="33" y1="13" x2="67" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id={skinId} x1="20" y1="35" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* 1. Outer Sacred Golden Halo Circle */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill={`url(#${bgId})`}
        stroke={`url(#${rimId})`}
        strokeWidth="3.5"
      />

      {/* Inner Temple Arch / Prabhavali Ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="#FCD34D"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />

      {/* Sacred Lotus Petals at Base */}
      <path
        d="M24 82 C32 75, 42 76, 50 82 C58 76, 68 75, 76 82 C67 88, 33 88, 24 82 Z"
        fill="#F43F5E"
        stroke="#FDE68A"
        strokeWidth="1.2"
      />
      <path
        d="M34 84 C40 77, 46 77, 50 83 C54 77, 60 77, 66 84 C58 89, 42 89, 34 84 Z"
        fill="#FB7185"
        stroke="#FEF08A"
        strokeWidth="1"
      />

      {/* Left & Right Sacred Ears (Karna) */}
      <path
        d="M32 42 C16 36, 13 50, 19 61 C23 67, 30 65, 34 59 Z"
        fill={`url(#${skinId})`}
        stroke="#B45309"
        strokeWidth="1.6"
      />
      <path
        d="M68 42 C84 36, 87 50, 81 61 C77 67, 70 65, 66 59 Z"
        fill={`url(#${skinId})`}
        stroke="#B45309"
        strokeWidth="1.6"
      />
      {/* Inner Ear Detail */}
      <path d="M28 46 C20 44, 19 53, 23 58" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M72 46 C80 44, 81 53, 77 58" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />

      {/* Royal Golden Kireetam (Temple Crown) */}
      <path
        d="M33 37 L38 20 L45 27 L50 13 L55 27 L62 20 L67 37 Z"
        fill={`url(#${crownId})`}
        stroke="#FEF08A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Crown Kalasham Top Finial */}
      <circle cx="50" cy="11" r="2.5" fill="#FDE047" />
      {/* Crown Central Ruby Gem */}
      <circle cx="50" cy="27" r="3.2" fill="#E11D48" stroke="#FEF08A" strokeWidth="1" />
      {/* Crown Base Band */}
      <rect x="31" y="35" width="38" height="5" rx="2.5" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.2" />

      {/* Lord Ganapathi Face & Curved Trunk (Vakratunda) */}
      <path
        d="M33 40 C33 38, 67 38, 67 40 C69 51, 65 60, 58 64 C56 71, 58 76, 63 75 C67 74, 68 70, 65 68 C63 67, 64 64, 67 65 C72 67, 73 74, 67 79 C60 83, 47 81, 44 71 C43 67, 42 63, 41 61 C35 58, 31 50, 33 40 Z"
        fill={`url(#${skinId})`}
        stroke="#92400E"
        strokeWidth="1.6"
      />

      {/* Sacred Vibhuti Tripundra & Red Kumkuma Tilak on Forehead */}
      <line x1="42" y1="44" x2="58" y2="44" stroke="#FFFBEB" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="40" y1="47" x2="60" y2="47" stroke="#FFFBEB" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="43" y1="50" x2="57" y2="50" stroke="#FFFBEB" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50 42 L53 48 L50 52 L47 48 Z" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.7" />

      {/* Compassionate Eyes (Netra) */}
      <path d="M37 52 Q41 49 45 52" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="41" cy="52.5" r="1.5" fill="#451A03" />
      <path d="M55 52 Q59 49 63 52" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="59" cy="52.5" r="1.5" fill="#451A03" />

      {/* Ekadanta — Left Whole Tusk & Right Broken Tusk */}
      <path d="M41 62 L36 68 L43 65 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
      <path d="M58 62 L62 65 L57 65 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />

      {/* Trunk Sacred Horizontal Lines */}
      <path d="M47 63 Q51 64 54 63" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 68 Q52 69 55 67" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />

      {/* Golden Modakam / Laddu Held in Curved Trunk Tip */}
      <circle cx="65" cy="71" r="4.2" fill="#FBBF24" stroke="#FFFBEB" strokeWidth="1.2" />
      <circle cx="64" cy="70" r="1" fill="#FEF08A" />
    </svg>
  );
};

