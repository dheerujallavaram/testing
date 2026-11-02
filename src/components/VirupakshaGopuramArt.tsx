import React from 'react';

/**
 * VirupakshaGatewayScene
 * Full-color geometric vector artwork inspired by Ranganath Krishnamani's (Liquidink Design)
 * iconic Dribbble illustration "Virupaksha gateway - WIP".
 *
 * Designed as an unobstructed visual panorama stage (never placed messy behind body text):
 * - Radiant Golden-Apricot to Vermilion-Crimson Sunset Sky
 * - Giant Glowing Surya Disc behind the central 9-tiered Virupaksha Raya Gopuram
 * - Golden rim-lit Dravidian stepped tiers, Shala roof, and 7 Kalasham finials
 * - Hampi boulder landscape & temple palm silhouettes
 * - Foreground carved Mandapam stone pillars, stepped corbel brackets, and hanging brass bells
 */
export const VirupakshaGatewayScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 1440 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full select-none ${className}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Hampi Virupaksha Raya Gopuram and Mandapam Sunset Illustration"
    >
      <defs>
        {/* Ranganath Krishnamani Signature Sunset Sky Gradient */}
        <linearGradient id="virupakshaSky" x1="720" y1="0" x2="720" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4A0E17" />
          <stop offset="22%" stopColor="#8C1D2C" />
          <stop offset="48%" stopColor="#D94E28" />
          <stop offset="74%" stopColor="#F7941D" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>

        {/* Giant Radiant Sunset Sun Disc */}
        <radialGradient id="virupakshaSun" cx="50%" cy="55%" r="48%" fx="50%" fy="55%">
          <stop offset="0%" stopColor="#FFFDF0" stopOpacity="1" />
          <stop offset="35%" stopColor="#FFE07D" stopOpacity="0.92" />
          <stop offset="70%" stopColor="#FF9F1C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E63946" stopOpacity="0" />
        </radialGradient>

        {/* Gopuram Silhouette Gradient (Deep Crimson-Plum to Rich Terracotta) */}
        <linearGradient id="gopuramBody" x1="720" y1="30" x2="720" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5C131E" />
          <stop offset="50%" stopColor="#420C14" />
          <stop offset="100%" stopColor="#26050A" />
        </linearGradient>

        {/* Foreground Mandapam Pillar Dark Silhouette */}
        <linearGradient id="mandapamPillar" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#24050A" />
          <stop offset="50%" stopColor="#380A12" />
          <stop offset="100%" stopColor="#1C0307" />
        </linearGradient>

        {/* Golden Rim Light */}
        <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD166" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#FFF3B0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFD166" stopOpacity="0.2" />
        </linearGradient>

        {/* Brass Bell Gradient */}
        <linearGradient id="brassBell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="45%" stopColor="#F7A01D" />
          <stop offset="100%" stopColor="#6B141A" />
        </linearGradient>
      </defs>

      {/* 1. Rich Sunset Sky Canvas */}
      <rect width="1440" height="420" fill="url(#virupakshaSky)" />

      {/* 2. Atmospheric Diagonal Sun Rays */}
      <g opacity="0.22">
        <polygon points="720,250 180,0 290,0" fill="#FFF3B0" />
        <polygon points="720,250 420,0 520,0" fill="#FFF3B0" />
        <polygon points="720,250 670,0 770,0" fill="#FFF3B0" />
        <polygon points="720,250 920,0 1020,0" fill="#FFF3B0" />
        <polygon points="720,250 1150,0 1260,0" fill="#FFF3B0" />
      </g>

      {/* 3. Giant Glowing Hampi Sun Disc & Sacred Concentric Rings */}
      <circle cx="720" cy="245" r="240" fill="url(#virupakshaSun)" />
      <circle cx="720" cy="245" r="165" fill="#FFF7CC" fillOpacity="0.35" />
      <circle cx="720" cy="245" r="125" fill="#FFFDF2" fillOpacity="0.55" />
      <circle
        cx="720"
        cy="245"
        r="195"
        stroke="#FFF3B0"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeDasharray="6 8"
      />

      {/* 4. Distant Hampi Boulder Hills & Horizon Layers */}
      <path
        d="M0 365 L140 325 L245 348 L370 305 L510 345 L620 355 L820 355 L940 338 L1085 298 L1215 342 L1330 320 L1440 355 L1440 420 L0 420 Z"
        fill="#7A1C24"
        fillOpacity="0.55"
      />
      <path
        d="M0 382 L190 352 L310 370 L460 342 L590 372 L850 372 L995 344 L1140 368 L1290 346 L1440 375 L1440 420 L0 420 Z"
        fill="#521018"
        fillOpacity="0.8"
      />

      {/* 5. Distant Secondary Temple Vimana & Mandapam Silhouettes (Left & Right Courtyard) */}
      <g fill="#4A0E17" opacity="0.85">
        {/* Left Miniature Gopuram Shrine */}
        <polygon points="355,305 395,305 388,288 362,288" />
        <polygon points="348,324 402,324 395,307 355,307" />
        <rect x="342" y="324" width="66" height="55" />
        <circle cx="375" cy="283" r="3" fill="#FFD166" />

        {/* Right Miniature Gopuram Shrine */}
        <polygon points="1045,305 1085,305 1078,288 1052,288" />
        <polygon points="1038,324 1092,324 1085,307 1045,307" />
        <rect x="1032" y="324" width="66" height="55" />
        <circle cx="1065" cy="283" r="3" fill="#FFD166" />
      </g>

      {/* ================================================================= */}
      {/* 6. CENTRAL 9-TIERED VIRUPAKSHA RAYA GOPURAM (ICONIC FOCAL TOWER)  */}
      {/* ================================================================= */}
      <g>
        {/* Top Barrel-Vaulted Shala Crown (Mahanasika) */}
        <path
          d="M666 56 C666 38, 774 38, 774 56 L782 66 L658 66 Z"
          fill="#4A0E17"
          stroke="#FFD166"
          strokeWidth="1.2"
        />
        {/* Kirtimukha / Central Finial Arch */}
        <circle cx="720" cy="48" r="5" fill="#FFD166" />

        {/* 7 Golden Kalasham Finials Atop the Gopuram */}
        {[678, 692, 706, 720, 734, 748, 762].map((kx) => (
          <g key={`kalasham-${kx}`}>
            <line x1={kx} y1="22" x2={kx} y2="38" stroke="#FFF3B0" strokeWidth="1.8" />
            <circle cx={kx} cy="32" r="3.2" fill="#FFD166" />
            <circle cx={kx} cy="26" r="1.8" fill="#FFFDF0" />
          </g>
        ))}

        {/* 9 Stepped Tiers (Talams) of the Virupaksha Raya Gopuram */}
        {[
          { y: 66, w: 118, h: 24 },
          { y: 92, w: 138, h: 25 },
          { y: 119, w: 158, h: 27 },
          { y: 148, w: 180, h: 29 },
          { y: 179, w: 204, h: 31 },
          { y: 212, w: 230, h: 33 },
          { y: 247, w: 258, h: 35 },
          { y: 284, w: 288, h: 38 },
          { y: 324, w: 322, h: 58 },
        ].map((tier, idx) => {
          const x = 720 - tier.w / 2;
          const trapTopW = tier.w - 8;
          const trapTopX = 720 - trapTopW / 2;
          const nicheCount = Math.min(9, idx + 4);
          const spacing = tier.w / (nicheCount + 1);

          return (
            <g key={`gopuram-tier-${idx}`}>
              {/* Trapezoidal Tier Silhouette */}
              <polygon
                points={`${trapTopX},${tier.y} ${trapTopX + trapTopW},${tier.y} ${x + tier.w},${tier.y + tier.h} ${x},${tier.y + tier.h}`}
                fill="url(#gopuramBody)"
              />

              {/* Golden Rim-Lit Cornice (Kapota) Overhang */}
              <rect
                x={x - 5}
                y={tier.y - 2.5}
                width={tier.w + 10}
                height="4"
                rx="1"
                fill="#7A1C24"
              />
              <line
                x1={x - 5}
                y1={tier.y - 2.5}
                x2={x + tier.w + 5}
                y2={tier.y - 2.5}
                stroke="#FFD166"
                strokeOpacity="0.85"
                strokeWidth="1.3"
              />

              {/* Dravidian Miniature Shala / Kuta Pavilions Along Each Tier */}
              {Array.from({ length: nicheCount }).map((_, nIdx) => {
                const nx = x + spacing * (nIdx + 1);
                if (Math.abs(nx - 720) < 15) return null;
                return (
                  <g key={`pavilion-${idx}-${nIdx}`}>
                    <rect
                      x={nx - 4}
                      y={tier.y + 5}
                      width="8"
                      height={tier.h - 6}
                      fill="#691620"
                    />
                    <line
                      x1={nx - 4}
                      y1={tier.y + 5}
                      x2={nx + 4}
                      y2={tier.y + 5}
                      stroke="#F7A01D"
                      strokeOpacity="0.7"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Central Glowing Kudu / Nasika Corridor Window */}
              <path
                d={`M710 ${tier.y + tier.h} L710 ${tier.y + 8} Q720 ${tier.y + 1} 730 ${tier.y + 8} L730 ${tier.y + tier.h} Z`}
                fill="#240408"
                stroke="#FFB703"
                strokeOpacity="0.75"
                strokeWidth="1"
              />
              {/* Warm Inner Sanctum Lamp Glow inside Central Window */}
              <circle
                cx="720"
                cy={tier.y + tier.h * 0.58}
                r="2.2"
                fill="#FFE07D"
                opacity="0.85"
              />
            </g>
          );
        })}

        {/* Gopuram Massive Stone Base (Adhisthana) & Glowing Sanctum Gateway */}
        <rect x="535" y="380" width="370" height="40" fill="#210307" />
        <line x1="535" y1="380" x2="905" y2="380" stroke="#FFD166" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Central Raya Gopuram Entrance Archway (Filled with Warm Golden Light) */}
        <path
          d="M694 420 L694 352 L705 338 L735 338 L746 352 L746 420 Z"
          fill="url(#virupakshaSun)"
          stroke="#FFD166"
          strokeWidth="1.5"
        />
      </g>

      {/* ================================================================= */}
      {/* 7. FOREGROUND HAMPI MANDAPAM PILLARS & HANGING TEMPLE BELLS       */}
      {/*    (Signature framing device from Ranganath's Virupaksha shot)    */}
      {/* ================================================================= */}

      {/* Top Mandapam Stone Lintel Beam */}
      <rect x="0" y="0" width="1440" height="22" fill="#1C0307" />
      <rect x="0" y="22" width="1440" height="8" fill="#320810" />
      <line x1="0" y1="30" x2="1440" y2="30" stroke="#F7941D" strokeOpacity="0.45" strokeWidth="1" />

      {/* LEFT FOREGROUND CARVED MANDAPAM PILLARS */}
      <g>
        {/* Outer Left Pillar */}
        <rect x="0" y="24" width="68" height="396" fill="url(#mandapamPillar)" />
        {/* Stepped Corbel Bracket (Potika) */}
        <path d="M68 28 L145 28 L132 48 L68 48 Z" fill="#2A060C" />
        <path d="M68 48 L120 48 L108 66 L68 66 Z" fill="#3B0A12" />
        {/* Golden Rim Highlight on Pillar Inner Edge */}
        <line x1="68" y1="66" x2="68" y2="420" stroke="#FFB703" strokeOpacity="0.5" strokeWidth="1.2" />

        {/* Second Left Mandapam Pillar */}
        <rect x="175" y="42" width="38" height="378" fill="url(#mandapamPillar)" />
        {/* Stepped Capital & Base Mouldings */}
        <path d="M142 30 L246 30 L236 46 L152 46 Z" fill="#2E070E" />
        <rect x="167" y="46" width="54" height="12" fill="#460D16" />
        <rect x="169" y="155" width="50" height="10" fill="#460D16" />
        <rect x="169" y="275" width="50" height="10" fill="#460D16" />
        <rect x="163" y="382" width="62" height="38" fill="#1A0206" />
        {/* Warm Sunset Rim Light on Pillar Side Facing the Sun */}
        <line x1="213" y1="58" x2="213" y2="382" stroke="#FFD166" strokeOpacity="0.75" strokeWidth="1.5" />
      </g>

      {/* RIGHT FOREGROUND CARVED MANDAPAM PILLARS */}
      <g>
        {/* Outer Right Pillar */}
        <rect x="1372" y="24" width="68" height="396" fill="url(#mandapamPillar)" />
        <path d="M1372 28 L1295 28 L1308 48 L1372 48 Z" fill="#2A060C" />
        <path d="M1372 48 L1320 48 L1332 66 L1372 66 Z" fill="#3B0A12" />
        <line x1="1372" y1="66" x2="1372" y2="420" stroke="#FFB703" strokeOpacity="0.5" strokeWidth="1.2" />

        {/* Second Right Mandapam Pillar */}
        <rect x="1227" y="42" width="38" height="378" fill="url(#mandapamPillar)" />
        <path d="M1194 30 L1298 30 L1288 46 L1204 46 Z" fill="#2E070E" />
        <rect x="1219" y="46" width="54" height="12" fill="#460D16" />
        <rect x="1221" y="155" width="50" height="10" fill="#460D16" />
        <rect x="1221" y="275" width="50" height="10" fill="#460D16" />
        <rect x="1215" y="382" width="62" height="38" fill="#1A0206" />
        {/* Warm Sunset Rim Light on Pillar Side Facing the Sun */}
        <line x1="1227" y1="58" x2="1227" y2="382" stroke="#FFD166" strokeOpacity="0.75" strokeWidth="1.5" />
      </g>

      {/* ================================================================= */}
      {/* 8. HANGING BRASS TEMPLE BELLS (GHANTA) & BIRDS IN FLIGHT          */}
      {/* ================================================================= */}
      {[
        { x: 118, chainH: 95, scale: 1 },
        { x: 288, chainH: 68, scale: 0.82 },
        { x: 1152, chainH: 68, scale: 0.82 },
        { x: 1322, chainH: 95, scale: 1 },
      ].map((bell, bIdx) => (
        <g key={`temple-bell-${bIdx}`} transform={`translate(${bell.x}, 30)`}>
          {/* Brass Chain Links */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={bell.chainH}
            stroke="#FFD166"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          {/* Bell Dome */}
          <g transform={`translate(0, ${bell.chainH}) scale(${bell.scale})`}>
            <circle cx="0" cy="0" r="4" fill="#FFD166" />
            <path
              d="M-12 22 C-12 8, -7 2, 0 2 C7 2, 12 8, 12 22 L16 27 L-16 27 Z"
              fill="url(#brassBell)"
              stroke="#FFF3B0"
              strokeWidth="1"
            />
            <circle cx="0" cy="30" r="3.5" fill="#FFF3B0" />
          </g>
        </g>
      ))}

      {/* Flock of Temple Birds Flying Across the Golden Sunset Sky */}
      <g stroke="#4A0E17" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M510 135 Q516 128 522 135 Q528 128 534 135" />
        <path d="M538 122 Q543 116 548 122 Q553 116 558 122" />
        <path d="M490 150 Q494 145 498 150 Q502 145 506 150" />
        <path d="M885 118 Q891 111 897 118 Q903 111 909 118" />
        <path d="M915 132 Q920 126 925 132 Q930 126 935 132" />
      </g>

      {/* Courtyard Stone Floor Step & Golden Reflection */}
      <rect x="0" y="404" width="1440" height="16" fill="#160205" />
      <line x1="213" y1="404" x2="1227" y2="404" stroke="url(#goldRim)" strokeWidth="2" />
    </svg>
  );
};

// Keep backwards-compatible alias if imported elsewhere
export const VirupakshaGopuramBackdrop = VirupakshaGatewayScene;

/**
 * GopuramSectionHeader
 * Clean, ornate South Indian Dravidian section header with vibrant vermilion & marigold accents.
 */
export const GopuramSectionHeader: React.FC<{
  kicker: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
}> = ({ kicker, title, subtitle, align = 'left', light = false }) => {
  const isCenter = align === 'center';
  return (
    <div className={`${isCenter ? 'text-center mx-auto max-w-3xl' : 'text-left'} space-y-2`}>
      <div
        className={`flex items-center gap-2 text-xs font-semibold tracking-wider ${
          isCenter ? 'justify-center' : 'justify-start'
        } ${light ? 'text-amber-300/95' : 'text-orange-900'}`}
      >
        <svg width="16" height="12" viewBox="0 0 18 14" fill="none" className="shrink-0 text-amber-700" aria-hidden="true">
          <path d="M9 0L11.5 4H6.5L9 0ZM4.5 5H13.5V8.5H4.5V5ZM2 9.5H16V13.5H2V9.5Z" fill="currentColor" />
        </svg>
        <span>{kicker}</span>
      </div>
      <h2
        className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
          light ? 'text-white' : 'text-stone-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
            isCenter ? 'mx-auto' : ''
          } ${light ? 'text-amber-100/90' : 'text-stone-600'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

