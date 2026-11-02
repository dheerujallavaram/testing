import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const OUT_DIR = path.resolve(process.cwd(), 'public/assets/zodiac');

interface RashiSvgDef {
  id: string;
  telugu: string;
  english: string;
  paths: string[];
  circles?: Array<{ cx: number; cy: number; r: number }>;
  accentPaths?: string[];
}

const RASHI_DEFS: RashiSvgDef[] = [
  {
    id: 'mesham',
    telugu: 'మేషం',
    english: 'Aries',
    paths: [
      'M12 20.5V8',
      'M12 8C10 4.8 5.8 3.8 3.8 7c-1.5 2.3-.4 5.2 2.2 5.2 2 0 4-2 6-4.2',
      'M12 8c2-3.2 6.2-4.2 8.2-1 1.5 2.3.4 5.2-2.2 5.2-2 0-4-2-6-4.2',
    ],
    circles: [{ cx: 12, cy: 5, r: 0.9 }],
  },
  {
    id: 'vrushabham',
    telugu: 'వృషభం',
    english: 'Taurus',
    paths: ['M4.5 4.2c2.5 3.6 5.2 4.6 7.5 4.6s5-1 7.5-4.6'],
    circles: [
      { cx: 12, cy: 14.3, r: 5.7 },
      { cx: 12, cy: 14.3, r: 1.4 },
    ],
  },
  {
    id: 'mithunam',
    telugu: 'మిథునం',
    english: 'Gemini',
    paths: [
      'M4 4.5C8 6.2 16 6.2 20 4.5',
      'M4 19.5c4-1.7 12-1.7 16 0',
      'M9 5.5v13',
      'M15 5.5v13',
    ],
    circles: [
      { cx: 12, cy: 12, r: 1.1 },
    ],
  },
  {
    id: 'karkatakam',
    telugu: 'కర్కాటకం',
    english: 'Cancer',
    paths: [
      'M10.5 9.2C13.2 9.2 18.8 8.2 20 4.5',
      'M13.5 14.8C10.8 14.8 5.2 15.8 4 19.5',
    ],
    circles: [
      { cx: 7.2, cy: 9.2, r: 3.4 },
      { cx: 16.8, cy: 14.8, r: 3.4 },
    ],
  },
  {
    id: 'simham',
    telugu: 'సింహం',
    english: 'Leo',
    paths: [
      'M8.6 12.6C9.6 7.8 13.6 4.8 17.2 6.4c3 1.3 2.5 5.6.4 7.1-2 1.5-3 3-2.5 5.5.4 1.9 2 2.4 3.1 1.9',
    ],
    circles: [{ cx: 6.8, cy: 15.2, r: 3.1 }],
  },
  {
    id: 'kanya',
    telugu: 'కన్య',
    english: 'Virgo',
    paths: [
      'M4 6.5c1-1.5 3-2 4.5-.5S10 10 10 18',
      'M8.5 7.5C9.5 6 11.5 5.5 13 7s1.5 4 1.5 11',
      'M13 7.5c1-1.5 3-2 4.5-.5s1.5 4 1.5 11',
      'M17.5 13.2c1.6-1 3.1-1 4 .6s.4 4-2.1 6l-3.6 2.4',
    ],
  },
  {
    id: 'tula',
    telugu: 'తుల',
    english: 'Libra',
    paths: [
      'M4 18.8h16',
      'M4 14.2h4.6a3.6 3.6 0 1 1 6.8 0H20',
    ],
    circles: [{ cx: 12, cy: 10.5, r: 1.1 }],
  },
  {
    id: 'vruschikam',
    telugu: 'వృశ్చికం',
    english: 'Scorpio',
    paths: [
      'M3.8 6.5c1-1.5 3-2 4.4-.5S9.6 10 9.6 17.8',
      'M8.2 7.5C9.2 6 11.2 5.5 12.6 7s1.4 4 1.4 10.8',
      'M12.6 7.5c1-1.5 3-2 4.4-.5s1.4 4 1.4 10.8l2.2-2.4h2.6',
      'M21.2 12.4v5.4l-2.6-2.4',
    ],
  },
  {
    id: 'dhanussu',
    telugu: 'ధనుస్సు',
    english: 'Sagittarius',
    paths: [
      'M5 19L19.5 4.5',
      'M13.5 4.5h6v6',
      'M8.2 11.2l4.6 4.6',
      'M6.5 7.5C11.5 6.5 17.5 12.5 16.5 17.5',
    ],
  },
  {
    id: 'makaram',
    telugu: 'మకరం',
    english: 'Capricorn',
    paths: [
      'M4 6.5c1-1.5 3-2 4.5-.5S10 10 10 18',
      'M8.5 7.5C9.5 6 11.5 5.5 13 7s1.5 4 1.5 11',
      'M14.5 11.5c2 1 4 3 3.5 5.5-.5 2.5-2.5 3.5-4 2-1.5-1.5-1-4.5 2-6 2-1 4.5 0 5 1.5',
    ],
  },
  {
    id: 'kumbham',
    telugu: 'కుంభం',
    english: 'Aquarius',
    paths: [
      'M3.5 9.5l2.8-2.4 2.8 2.4 2.8-2.4 2.8 2.4 2.8-2.4 2.8 2.4',
      'M3.5 15.5l2.8-2.4 2.8 2.4 2.8-2.4 2.8 2.4 2.8-2.4 2.8 2.4',
    ],
  },
  {
    id: 'meenam',
    telugu: 'మీనం',
    english: 'Pisces',
    paths: [
      'M6.2 4.2c3 4.2 3 11.4 0 15.6',
      'M17.8 4.2c-3 4.2-3 11.4 0 15.6',
      'M4 12h16',
    ],
    circles: [
      { cx: 12, cy: 12, r: 1.2 },
    ],
  },
];

function buildMedallionSvg(def: RashiSvgDef): string {
  const pathElements = def.paths
    .map(
      (d) => `<path d="${d}" fill="none" stroke="url(#goldStroke)" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" filter="url(#dropShadow)" />`
    )
    .join('\n');

  const circleElements = (def.circles || [])
    .map(
      (c) =>
        `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="none" stroke="url(#goldStroke)" stroke-width="2.25" filter="url(#dropShadow)" />`
    )
    .join('\n');

  // 16 outer temple lotus/sunburst notches around medallion
  const ticks: string[] = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i * 15 * Math.PI) / 180;
    const x1 = 128 + Math.cos(angle) * 108;
    const y1 = 128 + Math.sin(angle) * 108;
    const x2 = 128 + Math.cos(angle) * 116;
    const y2 = 128 + Math.sin(angle) * 116;
    ticks.push(
      `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#fbbf24" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round" />`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stop-color="#5c1d09" />
        <stop offset="55%" stop-color="#361005" />
        <stop offset="100%" stop-color="#1c0702" />
      </radialGradient>
      <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="35%" stop-color="#f59e0b" />
        <stop offset="70%" stop-color="#b45309" />
        <stop offset="100%" stop-color="#fde047" />
      </linearGradient>
      <linearGradient id="goldStroke" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22">
        <stop offset="0%" stop-color="#fffbeb" />
        <stop offset="30%" stop-color="#fde047" />
        <stop offset="70%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1.1" flood-color="#000000" flood-opacity="0.65" />
      </filter>
    </defs>

    <!-- Outer Sacred Medallion Circle -->
    <circle cx="128" cy="128" r="122" fill="url(#bgGrad)" stroke="url(#rimGrad)" stroke-width="7" />
    <circle cx="128" cy="128" r="104" fill="none" stroke="#fbbf24" stroke-opacity="0.4" stroke-width="1.8" stroke-dasharray="5 4" />
    ${ticks.join('\n    ')}

    <!-- Subtle Inner Halo -->
    <circle cx="128" cy="128" r="78" fill="#f59e0b" fill-opacity="0.08" />

    <!-- Scaled 24x24 Astrological Symbol in Center -->
    <g transform="translate(44, 44) scale(7)">
      ${pathElements}
      ${circleElements}
    </g>
  </svg>`;
}

function buildGlyphOnlySvg(def: RashiSvgDef): string {
  const pathElements = def.paths
    .map(
      (d) => `<path d="${d}" fill="none" stroke="url(#glyphStroke)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`
    )
    .join('\n');

  const circleElements = (def.circles || [])
    .map(
      (c) =>
        `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="none" stroke="url(#glyphStroke)" stroke-width="2.3" />`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="glyphStroke" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22">
        <stop offset="0%" stop-color="#d97706" />
        <stop offset="50%" stop-color="#b45309" />
        <stop offset="100%" stop-color="#78350f" />
      </linearGradient>
    </defs>
    ${pathElements}
    ${circleElements}
  </svg>`;
}

async function generateAll() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const def of RASHI_DEFS) {
    // 1. Medallion PNG (256x256)
    const medallionSvg = buildMedallionSvg(def);
    const medallionDataUri = `data:image/svg+xml;base64,${Buffer.from(medallionSvg).toString('base64')}`;
    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    const img = await loadImage(medallionDataUri);
    ctx.drawImage(img, 0, 0, 256, 256);
    const outPath = path.join(OUT_DIR, `${def.id}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));

    // 2. Transparent Symbol PNG (128x128)
    const glyphSvg = buildGlyphOnlySvg(def);
    const glyphDataUri = `data:image/svg+xml;base64,${Buffer.from(glyphSvg).toString('base64')}`;
    const gCanvas = createCanvas(128, 128);
    const gCtx = gCanvas.getContext('2d');
    const gImg = await loadImage(glyphDataUri);
    gCtx.drawImage(gImg, 0, 0, 128, 128);
    const glyphOutPath = path.join(OUT_DIR, `${def.id}-symbol.png`);
    fs.writeFileSync(glyphOutPath, gCanvas.toBuffer('image/png'));

    console.log(`Generated ${def.id}.png and ${def.id}-symbol.png`);
  }
}

generateAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
