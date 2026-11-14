import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { createCanvas, GlobalFonts, SKRSContext2D } from '@napi-rs/canvas';
import { WEEK_DATA } from '../src/data/panchangamData';
import { getOrGenerateDayData } from '../src/utils/astronomyPanchangam';
import { getTodayIsoDateIST, computeCityLocalPanchangam } from '../src/seo/panchangamSsrEngine';
import { translatePanchangamString } from '../src/context/LanguageContext';
import { DayData } from '../src/types/panchangam';
import { getDailyRashiFortunes, RashiDailyFortune } from '../src/utils/panchangaLogic';
import {
  generateDailyVideoSocialPack,
  getSpotlightRashiIndex,
  DailyVideoSocialPack,
} from '../src/utils/dailyPanchangamVideoRecorder';

const WIDTH = 1080;
const HEIGHT = 1920;

let fontsRegistered = false;
export function registerAvailableFonts() {
  if (fontsRegistered) return;
  fontsRegistered = true;
  const scriptFontPath = path.resolve(process.cwd(), 'scripts', 'fonts', 'NotoSerifTelugu.ttf');
  const candidates = [
    scriptFontPath,
    '/usr/share/fonts/truetype/noto/NotoSerifTelugu-Bold.ttf',
    '/usr/share/fonts/truetype/noto/NotoSerifTelugu-Regular.ttf',
    '/usr/share/fonts/truetype/noto/NotoSansTelugu-Bold.ttf',
    '/usr/share/fonts/truetype/noto/NotoSansTelugu-Regular.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  ];
  for (const fp of candidates) {
    if (fs.existsSync(fp)) {
      try {
        GlobalFonts.registerFromPath(fp, 'Noto Serif Telugu');
      } catch {
        // Ignore font registration error
      }
    }
  }
}

function cleanText(text: string): string {
  return (text || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function drawRoundedRect(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCentered(
  ctx: SKRSContext2D,
  text: string,
  boxX: number,
  boxW: number,
  y: number,
  pad = 24
) {
  ctx.textAlign = 'left';
  const clean = cleanText(text);
  const maxW = Math.max(40, boxW - pad * 2);
  const measured = Math.min(ctx.measureText(clean).width, maxW);
  const startX = boxX + Math.max(pad, (boxW - measured) / 2);
  ctx.fillText(clean, startX, y, maxW);
}

function drawWrapped(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
) {
  ctx.textAlign = 'left';
  const words = cleanText(text).split(/\s+/);
  let line = '';
  let curY = y;
  let count = 0;

  for (let i = 0; i < words.length; i++) {
    const test = `${line}${words[i]} `;
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, curY, maxWidth);
      line = `${words[i]} `;
      curY += lineHeight;
      count++;
      if (count >= maxLines - 1) {
        const rest = words.slice(i).join(' ');
        ctx.fillText(rest.length > 68 ? `${rest.slice(0, 65)}...` : rest, x, curY, maxWidth);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, curY, maxWidth);
  }
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number): number {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
}

function getStaggeredMotion(sceneProgress: number, delay = 0, duration = 0.16) {
  const raw = clamp01((sceneProgress - delay) / Math.max(0.01, duration));
  const eased = easeOutCubic(raw);
  return {
    alpha: Math.max(0.04, eased),
    offsetY: Math.round((1 - eased) * 42),
  };
}

/**
 * Ambient 12-Spoke Celestial Zodiac Mandala & Twinkling Golden Stardust backdrop
 */
function drawCelestialBackdrop(ctx: SKRSContext2D, progress: number) {
  // Warm breathing aura at center
  const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI * 10);
  const radGrad = ctx.createRadialGradient(WIDTH / 2, 1020, 80, WIDTH / 2, 1020, 640);
  radGrad.addColorStop(0, `rgba(245, 158, 11, ${0.14 + pulse * 0.06})`);
  radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle rotating 12-Spoke Zodiac Chakra in background
  ctx.save();
  ctx.translate(WIDTH / 2, 1020);
  ctx.rotate(progress * Math.PI * 1.5);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.09)';
  ctx.lineWidth = 2.5;
  for (const r of [240, 360, 480]) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let s = 0; s < 12; s++) {
    const angle = (s * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 140, Math.sin(angle) * 140);
    ctx.lineTo(Math.cos(angle) * 480, Math.sin(angle) * 480);
    ctx.stroke();
  }
  ctx.restore();

  // 24 Twinkling Golden Stardust Particles drifting upward
  for (let i = 0; i < 24; i++) {
    const px = ((i * 197 + 83) % (WIDTH - 120)) + 60;
    const speed = 0.25 + ((i * 37) % 10) * 0.05;
    const py = (((i * 251 + 120) - progress * HEIGHT * speed) % HEIGHT + HEIGHT) % HEIGHT;
    const twinkle = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(progress * Math.PI * 18 + i * 1.7));
    const radius = 2 + (i % 3) * 1.4;
    ctx.fillStyle = `rgba(253, 224, 71, ${twinkle.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderBrandIntroScene(
  ctx: SKRSContext2D,
  dayData: DayData,
  kind: 'panchangam' | 'rashi',
  lang: 'te' | 'en',
  progress: number
) {
  const tr = (v: string) => (lang === 'en' ? translatePanchangamString(v, 'en') : v);
  const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI * 4);

  // Sacred Counter-Rotating Lotus Mandala
  ctx.save();
  ctx.translate(WIDTH / 2, 540);
  ctx.rotate(progress * Math.PI * 2);
  ctx.strokeStyle = `rgba(251, 191, 36, ${0.24 + pulse * 0.14})`;
  ctx.lineWidth = 4;
  for (const r of [145, 225, 315]) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let p = 0; p < 12; p++) {
    const a = (p * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 225, Math.sin(a) * 225, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  const scaleM = getStaggeredMotion(progress, 0.0, 0.35);
  ctx.save();
  ctx.globalAlpha = scaleM.alpha;
  ctx.translate(0, scaleM.offsetY);

  drawRoundedRect(ctx, WIDTH / 2 - 110, 430, 220, 220, 48);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#3b1103';
  ctx.font = 'bold 58px "Noto Serif Telugu", serif';
  drawCentered(ctx, lang === 'en' ? 'OM' : 'ఓం', WIDTH / 2 - 110, 220, 535, 16);
  ctx.font = 'bold 34px "Noto Serif Telugu", serif';
  drawCentered(ctx, lang === 'en' ? 'SHUBHAM' : 'శుభం', WIDTH / 2 - 110, 220, 605, 16);
  ctx.restore();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 30px "Noto Serif Telugu", serif';
  drawCentered(
    ctx,
    lang === 'en' ? 'OM SRI MAHA GANADHIPATAYE NAMAHA' : 'ఓం శ్రీ మహాగణాధిపతయే నమః',
    60,
    WIDTH - 120,
    730,
    20
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px "Noto Serif Telugu", serif';
  drawCentered(
    ctx,
    lang === 'en' ? 'Sri Lakshmi Ganapathi Jyothishalayam' : 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    50,
    WIDTH - 100,
    815,
    20
  );

  drawRoundedRect(ctx, 84, 865, WIDTH - 168, 96, 48);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 42px "Noto Serif Telugu", sans-serif';
  drawCentered(ctx, 'www.telugujyothisham.com', 84, WIDTH - 168, 926, 24);

  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 30px "Noto Serif Telugu", serif';
  drawCentered(
    ctx,
    lang === 'en'
      ? 'Brahmasri Jallavaram Sai Dheeraj Sharma (Hyderabad)'
      : 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (హైదరాబాద్)',
    60,
    WIDTH - 120,
    1035,
    20
  );

  drawRoundedRect(ctx, 76, 1110, WIDTH - 152, 260, 32);
  ctx.fillStyle = 'rgba(255, 251, 235, 0.96)';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 38px "Noto Serif Telugu", serif';
  drawCentered(
    ctx,
    kind === 'panchangam'
      ? lang === 'en'
        ? 'TODAY DAILY PANCHANGAM & TIMINGS'
        : 'నేటి దృక్సిద్ధాంత పంచాంగం & శుభ సమయాలు'
      : lang === 'en'
        ? 'TODAY 12 ZODIAC SIGNS HOROSCOPE'
        : 'నేటి ద్వాదశ రాశి ఫలాలు & గోచార విశ్లేషణ',
    76,
    WIDTH - 152,
    1195,
    24
  );

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 34px "Noto Serif Telugu", serif';
  drawCentered(
    ctx,
    `${tr(dayData.teediVaram)} • ${dayData.isoDate}`,
    76,
    WIDTH - 152,
    1275,
    24
  );
}

function renderBrandOutroAdScene(
  ctx: SKRSContext2D,
  lang: 'te' | 'en',
  sceneProgress = 1
) {
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 40px "Noto Serif Telugu", serif';
  drawCentered(
    ctx,
    lang === 'en' ? 'OUR VEDIC ASTROLOGY & POOJA SERVICES' : 'మన వెబ్‌సైట్ ప్రత్యేక జ్యోతిష్య & పూజా సేవలు',
    64,
    WIDTH - 128,
    420,
    20
  );

  const services =
    lang === 'en'
      ? [
          { t: '1. Free 100-Page Janma Kundali PDF', d: 'Complete 37-Chapter Horoscope, Dasha & Remedies' },
          { t: '2. Marriage Compatibility (36 Guna Milan)', d: 'Accurate Nakshatra, Kuja Dosha & Rajju Analysis' },
          { t: '3. Shubha Muhurthas & Baby Names', d: 'Wedding, Gruhapravesham & 27-Star Naming Guide' },
          { t: '4. Gruhapravesham, Vastu & Chandi Homam', d: 'Authentic Telangana Vedic Poojas & Samagri Guide' },
          { t: '5. Daily Panchangam & 12-Rashi Forecast', d: 'Live Tithi, Nakshatra, Rahukalam & Tarabalam' },
          { t: '6. Direct Personal Consultation with Guruji', d: 'Horoscope Reading & Remedies via Phone / WhatsApp' },
        ]
      : [
          { t: '1. 100 పేజీల సంపూర్ణ జన్మ కుండలి PDF', d: '37 అధ్యాయాల బృహత్ జాతకం, దశలు & పరిహారాలు' },
          { t: '2. వివాహ పొంతన (36 గుణ మేళన & కుజ దోషం)', d: 'వధూవరుల నక్షత్ర కూటమి & రజ్జు దోష పరిశీలన' },
          { t: '3. శుభ ముహూర్తాలు & నక్షత్ర నామకరణం', d: 'వివాహం, గృహప్రవేశం, ఉపనయనం & పిల్లల పేర్లు' },
          { t: '4. గృహప్రవేశం, వాస్తు పూజ & చండీ హోమాలు', d: 'శాస్త్రోక్త వైదిక పూజలు, అభిషేకాలు & వ్రతాలు' },
          { t: '5. నిత్య పంచాంగం & 12 రాశుల ఫలితాలు', d: 'తిథి, నక్షత్రం, రాహుకాలం, తారాబలం & గోచారం' },
          { t: '6. గురువుగారితో వ్యక్తిగత జాతక సంప్రదింపులు', d: 'ఫోన్ / వాట్సాప్ ద్వారా ప్రత్యక్ష జ్యోతిష్య సలహాలు' },
        ];

  let y = 468;
  services.forEach((srv, idx) => {
    const m = getStaggeredMotion(sceneProgress, idx * 0.06, 0.2);
    ctx.save();
    ctx.globalAlpha = m.alpha;
    ctx.translate(0, m.offsetY);
    drawRoundedRect(ctx, 72, y, WIDTH - 144, 146, 24);
    ctx.fillStyle = '#fffbeb';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#9a3412';
    ctx.font = 'bold 30px "Noto Serif Telugu", serif';
    ctx.fillText(srv.t, 104, y + 54, WIDTH - 208);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 25px "Noto Serif Telugu", serif';
    ctx.fillText(srv.d, 104, y + 106, WIDTH - 208);
    ctx.restore();
    y += 162;
  });

  const ctaPulse = 0.96 + 0.04 * Math.sin(sceneProgress * Math.PI * 6);
  ctx.save();
  ctx.translate(WIDTH / 2, 1545);
  ctx.scale(ctaPulse, ctaPulse);
  ctx.translate(-WIDTH / 2, -1545);
  drawRoundedRect(ctx, 72, 1460, WIDTH - 144, 170, 32);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 42px "Noto Serif Telugu", sans-serif';
  drawCentered(ctx, 'www.telugujyothisham.com', 72, WIDTH - 144, 1525, 20);
  ctx.font = 'bold 32px "Noto Serif Telugu", serif';
  drawCentered(
    ctx,
    'WhatsApp Consultation: +91 89779 86166',
    72,
    WIDTH - 144,
    1588,
    20
  );
  ctx.restore();
}

function renderRashiReelServerFrame(
  ctx: SKRSContext2D,
  dayData: DayData,
  fortunes: RashiDailyFortune[],
  spotlightIdx: number,
  lang: 'te' | 'en',
  progress: number
) {
  const tr = (v: string) => (lang === 'en' ? translatePanchangamString(v, 'en') : v);
  const spot = fortunes[spotlightIdx] || fortunes[0];
  const others = fortunes.filter((_, idx) => idx !== spotlightIdx);

  if (progress < 0.11) {
    renderBrandIntroScene(ctx, dayData, 'rashi', lang, progress / 0.11);
    return;
  }
  if (progress >= 0.83) {
    renderBrandOutroAdScene(ctx, lang, (progress - 0.83) / 0.17);
    return;
  }

  const bodyProg = (progress - 0.11) / (0.83 - 0.11);

  if (bodyProg < 0.36) {
    const spotProg = bodyProg / 0.36;
    const cardMotion = getStaggeredMotion(spotProg, 0, 0.22);
    ctx.save();
    ctx.globalAlpha = cardMotion.alpha;
    ctx.translate(0, cardMotion.offsetY);
    // Spotlight Rashi Full Prediction Scene
    drawRoundedRect(ctx, 72, 370, WIDTH - 144, 78, 39);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.fillStyle = '#2a0702';
    ctx.font = 'bold 30px "Noto Serif Telugu", serif';
    drawCentered(
      ctx,
      lang === 'en'
        ? `SPOTLIGHT SIGN OF THE DAY: ${spot.englishName.toUpperCase()} (FULL PREDICTION)`
        : `నేటి విశేష రాశి (సంపూర్ణ ఫలితం): ${spot.teluguName} రాశి (${spot.englishName})`,
      72,
      WIDTH - 144,
      420,
      20
    );

    drawRoundedRect(ctx, 72, 468, WIDTH - 144, 1140, 32);
    ctx.fillStyle = '#fffbeb';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 42px "Noto Serif Telugu", serif';
    ctx.fillText(
      lang === 'en'
        ? `${spot.englishName} (${spot.teluguName}) — ${spot.statusLabelEn}`
        : `${spot.teluguName} రాశి (${spot.englishName}) — ${spot.statusLabel}`,
      104,
      538,
      WIDTH - 208
    );

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 26px "Noto Serif Telugu", serif';
    ctx.fillText(
      lang === 'en'
        ? `Transit: ${spot.englishNavagrahaLabel} • Star Lord: ${spot.lordEn}`
        : `గోచారం: ${spot.navagrahaTransitLabel} • అధిపతి: ${spot.lord}`,
      104,
      590,
      WIDTH - 208
    );

    const careerText =
      lang === 'en'
        ? spot.englishFullSummary.split('\n')[1]?.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim() || spot.englishFullSummary
        : spot.careerFinanceLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();

    const wealthText =
      lang === 'en'
        ? spot.englishWealthBusiness || spot.englishDairyam
        : spot.wealthBusinessLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();

    const healthText =
      lang === 'en'
        ? spot.englishHealthVitality || spot.doTodayEn
        : spot.familyHealthLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();

    const remedyText = lang === 'en' ? spot.remedyEn : spot.remedy;

    const sections =
      lang === 'en'
        ? [
            { h: '1. Career & Job Outlook:', b: careerText },
            { h: '2. Wealth & Financial Growth:', b: wealthText },
            { h: '3. Family, Health & Action:', b: `${healthText} • Do: ${spot.doTodayEn}` },
            { h: '4. Lucky Time, Color & Remedy:', b: `${spot.luckyTimeWindowEn} | Color: ${spot.luckyColorEn} | ${remedyText}` },
          ]
        : [
            { h: '1. ఉద్యోగం & వృత్తి రహస్యం:', b: careerText },
            { h: '2. ఆర్థికం & వ్యాపార వృద్ధి:', b: wealthText },
            { h: '3. కుటుంబం, ఆరోగ్యం & సూచన:', b: `${healthText} • నేడు చేయవలసిన పని: ${spot.doTodayTe}` },
            { h: '4. శుభ సమయం, రంగు & పరిహారం:', b: `${spot.luckyTimeWindowTe} | రంగు: ${spot.luckyColor} | ${remedyText}` },
          ];

    let sy = 640;
    for (const sec of sections) {
      drawRoundedRect(ctx, 98, sy, WIDTH - 196, 212, 22);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#9a3412';
      ctx.font = 'bold 27px "Noto Serif Telugu", serif';
      ctx.fillText(sec.h, 124, sy + 46, WIDTH - 248);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 25px "Noto Serif Telugu", serif';
      drawWrapped(ctx, sec.b, 124, sy + 92, WIDTH - 248, 36, 3);
      sy += 230;
    }
    ctx.restore();
  } else {
    // Remaining 11 Rashis in 2 pages (6 + 5) + Website Traffic Hook Banner
    const isFirstBatch = bodyProg < 0.68;
    const batchProg = isFirstBatch ? (bodyProg - 0.36) / 0.32 : (bodyProg - 0.68) / 0.32;
    const batch = isFirstBatch ? others.slice(0, 6) : others.slice(6, 11);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 34px "Noto Serif Telugu", serif';
    drawCentered(
      ctx,
      lang === 'en'
        ? `OTHER ZODIAC SIGNS SUMMARY (${isFirstBatch ? 'PART 1/2' : 'PART 2/2'})`
        : `మిగతా రాశుల నేటి సంక్షిప్త ఫలితాలు (${isFirstBatch ? 'భాగం 1/2' : 'భాగం 2/2'})`,
      72,
      WIDTH - 144,
      405,
      20
    );

    let ry = 438;
    batch.forEach((r, idx) => {
      const rm = getStaggeredMotion(batchProg, idx * 0.055, 0.2);
      ctx.save();
      ctx.globalAlpha = rm.alpha;
      ctx.translate(0, rm.offsetY);
      drawRoundedRect(ctx, 72, ry, WIDTH - 144, 168, 24);
      ctx.fillStyle = '#fffbeb';
      ctx.fill();
      ctx.strokeStyle = r.status === 'favorable' ? '#10b981' : r.status === 'caution' ? '#f43f5e' : '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = '#451a03';
      ctx.font = 'bold 30px "Noto Serif Telugu", serif';
      ctx.fillText(
        lang === 'en'
          ? `${r.englishName} (${r.teluguName}) — ${r.statusLabelEn}`
          : `${r.teluguName} రాశి (${r.englishName}) — ${r.statusLabel}`,
        102,
        ry + 50,
        WIDTH - 204
      );

      const line1 =
        lang === 'en'
          ? `${r.doTodayEn} • Lucky: ${r.luckyColorEn} (#${r.luckyNumber})`
          : `${r.doTodayTe} • శుభ రంగు: ${r.luckyColor} (#${r.luckyNumber})`;
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px "Noto Serif Telugu", serif';
      ctx.fillText(cleanText(line1), 102, ry + 98, WIDTH - 204);

      const line2 =
        lang === 'en'
          ? `Remedy: ${r.remedyEn}`
          : `పరిహారం: ${r.remedy}`;
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 23px "Noto Serif Telugu", serif';
      ctx.fillText(cleanText(line2), 102, ry + 142, WIDTH - 204);
      ctx.restore();

      ry += 182;
    });

    // Website Traffic Hook Banner
    drawRoundedRect(ctx, 72, 1540, WIDTH - 144, 108, 26);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.fillStyle = '#2a0702';
    ctx.font = 'bold 27px "Noto Serif Telugu", serif';
    drawCentered(
      ctx,
      lang === 'en'
        ? `Like ${spot.englishName}, read YOUR sign's full 4-domain prediction on:`
        : `${spot.teluguName} రాశి లాగే మీ రాశి పూర్తి 4-రంగాల ఫలితం కోసం ఇప్పుడే చూడండి:`,
      72,
      WIDTH - 144,
      1582,
      18
    );
    ctx.font = 'bold 34px "Noto Serif Telugu", sans-serif';
    drawCentered(ctx, 'www.telugujyothisham.com', 72, WIDTH - 144, 1628, 18);
  }
}

export function renderCliFrame(
  ctx: SKRSContext2D,
  isoDate: string,
  lang: 'te' | 'en',
  citySlug: 'hyderabad' | 'vijayawada' | 'visakhapatnam' | 'tirupati',
  progress: number,
  kind: 'panchangam' | 'rashi' = 'panchangam'
) {
  const dayData = getOrGenerateDayData(isoDate, WEEK_DATA);
  const cityPanchangam = computeCityLocalPanchangam(isoDate, citySlug);
  const tr = (v: string) => (lang === 'en' ? translatePanchangamString(v, 'en') : v);

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#2a0702');
  bg.addColorStop(0.28, '#5c1808');
  bg.addColorStop(0.65, '#3d1005');
  bg.addColorStop(1, '#1e0502');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Smooth Celestial Mandala + Twinkling Golden Stardust
  drawCelestialBackdrop(ctx, progress);

  // Golden border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 28, 28, WIDTH - 56, HEIGHT - 56, 36);
  ctx.stroke();

  // Top Header
  drawRoundedRect(ctx, 76, 76, 128, 128, 26);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#3b1103';
  ctx.font = 'bold 46px "Noto Serif Telugu", serif';
  drawCentered(ctx, lang === 'en' ? 'OM' : 'ఓం', 76, 128, 155, 10);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 25px "Noto Serif Telugu", sans-serif';
  ctx.fillText(
    lang === 'en' ? 'OM SRI LAKSHMI GANAPATAYE NAMAHA' : 'ఓం శ్రీలక్ష్మి గణపతయే నమః',
    228,
    112,
    780
  );
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en' ? 'Sri Lakshmi Ganapathi Jyothishalayam' : 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    228,
    162,
    780
  );
  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 23px "Noto Serif Telugu", sans-serif';
  ctx.fillText(
    lang === 'en'
      ? `Brahmasri Jallavaram Sai Dheeraj Sharma • ${cityPanchangam.city.nameEn}`
      : `బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు • ${cityPanchangam.city.nameTe}`,
    228,
    202,
    780
  );

  // Date pill
  drawRoundedRect(ctx, 76, 236, WIDTH - 152, 78, 39);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 31px "Noto Serif Telugu", sans-serif';
  drawCentered(
    ctx,
    `${tr(dayData.teediVaram)} • ${isoDate}`,
    76,
    WIDTH - 152,
    286,
    24
  );

  if (kind === 'rashi') {
    const fortunes = getDailyRashiFortunes(dayData);
    const spotIdx = getSpotlightRashiIndex(dayData, fortunes, 'auto');
    renderRashiReelServerFrame(ctx, dayData, fortunes, spotIdx, lang, progress);
  } else {
    if (progress < 0.11) {
      renderBrandIntroScene(ctx, dayData, 'panchangam', lang, progress / 0.11);
    } else if (progress >= 0.83) {
      renderBrandOutroAdScene(ctx, lang, (progress - 0.83) / 0.17);
    } else {
      const bodyProg = (progress - 0.11) / (0.83 - 0.11);
      const scene = bodyProg < 0.36 ? 1 : bodyProg < 0.70 ? 2 : 3;

      if (scene === 1) {
        const s1Prog = bodyProg / 0.36;
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 42px "Noto Serif Telugu", serif';
        drawCentered(
          ctx,
          lang === 'en' ? "TODAY'S TELUGU PANCHANGAM" : 'నేటి దృక్సిద్ధాంత పంచాంగం',
          76,
          WIDTH - 152,
          410,
          20
        );

        const rows = [
          { k: lang === 'en' ? 'Masam / Paksham' : 'మాసం & పక్షం', v: tr(cityPanchangam.masam) },
          { k: lang === 'en' ? 'Tithi' : 'తిథి', v: tr(cityPanchangam.tithi) },
          { k: lang === 'en' ? 'Nakshatram' : 'నక్షత్రం', v: tr(cityPanchangam.nakshatram) },
          { k: lang === 'en' ? 'Yogam / Karanam' : 'యోగం & కరణం', v: `${tr(cityPanchangam.yogam)} | ${tr(cityPanchangam.karanam)}` },
          { k: lang === 'en' ? 'Sunrise / Sunset' : 'సూర్యోదయం / సూర్యాస్తమయం', v: `${cityPanchangam.sunrise} / ${cityPanchangam.sunset}` },
          { k: lang === 'en' ? 'Presiding Deity' : 'ఆరాధ్య దైవం', v: tr(dayData.deity) },
        ];

        let ry = 455;
        rows.forEach((row, idx) => {
          const rm = getStaggeredMotion(s1Prog, idx * 0.055, 0.2);
          ctx.save();
          ctx.globalAlpha = rm.alpha;
          ctx.translate(0, rm.offsetY);
          drawRoundedRect(ctx, 76, ry, WIDTH - 152, 168, 28);
          ctx.fillStyle = '#fffbeb';
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#9a3412';
          ctx.font = 'bold 28px "Noto Serif Telugu", sans-serif';
          ctx.fillText(row.k, 112, ry + 54, WIDTH - 224);
          ctx.fillStyle = '#290f02';
          ctx.font = 'bold 36px "Noto Serif Telugu", serif';
          ctx.fillText(cleanText(row.v), 112, ry + 118, WIDTH - 224);
          ctx.restore();
          ry += 188;
        });
      } else if (scene === 2) {
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 42px "Noto Serif Telugu", serif';
        drawCentered(
          ctx,
          lang === 'en' ? 'AUSPICIOUS & CAUTION TIMINGS' : 'నేటి శుభ & అశుభ సమయాలు',
          76,
          WIDTH - 152,
          410,
          20
        );

        drawRoundedRect(ctx, 76, 460, WIDTH - 152, 480, 32);
        ctx.fillStyle = '#ecfdf5';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 36px "Noto Serif Telugu", serif';
        ctx.fillText(
          lang === 'en' ? 'SHUBHA MUHURTHAM' : 'శుభ సమయాలు (మంచి ఘడియలు)',
          116,
          535,
          WIDTH - 232
        );

        const good = [
          { k: lang === 'en' ? 'Abhijit Muhurtham' : 'అభిజిత్ ముహూర్తం', v: tr(cityPanchangam.abhijitMuhurtham) },
          { k: lang === 'en' ? 'Amrutha Gadiyalu' : 'అమృత ఘడియలు', v: tr(cityPanchangam.amruthaGadiyalu) },
          { k: lang === 'en' ? 'Moon Transit (Chandra)' : 'నేటి చంద్ర సంచారం', v: tr(dayData.chandra.sancharam) },
        ];
        let gy = 605;
        for (const item of good) {
          ctx.fillStyle = '#047857';
          ctx.font = 'bold 27px "Noto Serif Telugu", sans-serif';
          ctx.fillText(item.k, 116, gy, WIDTH - 232);
          ctx.fillStyle = '#022c22';
          ctx.font = 'bold 35px "Noto Serif Telugu", serif';
          ctx.fillText(cleanText(item.v), 116, gy + 48, WIDTH - 232);
          gy += 112;
        }

        drawRoundedRect(ctx, 76, 980, WIDTH - 152, 600, 32);
        ctx.fillStyle = '#fff1f2';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fillStyle = '#9f1239';
        ctx.font = 'bold 36px "Noto Serif Telugu", serif';
        ctx.fillText(
          lang === 'en' ? 'AVOID ASHUBHA TIMINGS' : 'వర్జించవలసిన అశుభ సమయాలు',
          116,
          1055,
          WIDTH - 232
        );

        const bad = [
          { k: lang === 'en' ? 'Rahu Kalam' : 'రాహుకాలం', v: tr(cityPanchangam.rahukalam) },
          { k: lang === 'en' ? 'Yamagandam' : 'యమగండం', v: tr(cityPanchangam.yamagandam) },
          { k: lang === 'en' ? 'Varjyam' : 'వర్జ్యం', v: tr(cityPanchangam.varjyam) },
          { k: lang === 'en' ? 'Durmuhurtham' : 'దుర్ముహూర్తం', v: tr(cityPanchangam.durmuhurtham) },
        ];
        let by = 1130;
        for (const item of bad) {
          ctx.fillStyle = '#be123c';
          ctx.font = 'bold 27px "Noto Serif Telugu", sans-serif';
          ctx.fillText(item.k, 116, by, WIDTH - 232);
          ctx.fillStyle = '#4c0519';
          ctx.font = 'bold 34px "Noto Serif Telugu", serif';
          ctx.fillText(cleanText(item.v), 116, by + 44, WIDTH - 232);
          by += 112;
        }
      } else {
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 42px "Noto Serif Telugu", serif';
        drawCentered(
          ctx,
          lang === 'en' ? 'DAILY SPIRITUAL GUIDANCE' : 'నేటి దిన విశేషం & శుభ సందేశం',
          76,
          WIDTH - 152,
          410,
          20
        );

        drawRoundedRect(ctx, 76, 465, WIDTH - 152, 540, 32);
        ctx.fillStyle = '#fffbeb';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#9a3412';
        ctx.font = 'bold 34px "Noto Serif Telugu", serif';
        ctx.fillText(cleanText(tr(dayData.specialEvent || dayData.deity)), 116, 535, WIDTH - 232);
        ctx.fillStyle = '#290f02';
        ctx.font = '34px "Noto Serif Telugu", serif';
        drawWrapped(ctx, tr(dayData.phalitham), 116, 615, WIDTH - 232, 54, 6);

        drawRoundedRect(ctx, 76, 1045, WIDTH - 152, 310, 30);
        ctx.fillStyle = '#fef3c7';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 30px "Noto Serif Telugu", sans-serif';
        ctx.fillText(
          lang === 'en'
            ? `Lucky Color: ${cleanText(tr(dayData.luckyColor))}`
            : `నేటి శుభ రంగు: ${cleanText(tr(dayData.luckyColor))}`,
          116,
          1115,
          WIDTH - 232
        );
        ctx.fillStyle = '#9a3412';
        ctx.font = 'bold 30px "Noto Serif Telugu", serif';
        drawWrapped(
          ctx,
          `${lang === 'en' ? 'Chandrashtamam: ' : 'చంద్రాష్టమం / దైవం: '}${tr(dayData.chandra.chandrashtamam)} • ${tr(dayData.deity)}`,
          116,
          1185,
          WIDTH - 232,
          46,
          3
        );

        drawRoundedRect(ctx, 96, 1405, WIDTH - 192, 165, 34);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.fillStyle = '#2a0702';
        ctx.font = 'bold 34px "Noto Serif Telugu", serif';
        drawCentered(
          ctx,
          lang === 'en' ? '12 Rashi Phalalu & Free Janma Kundali' : '12 రాశి ఫలాలు & ఉచిత జాతకం కోసం',
          96,
          WIDTH - 192,
          1475,
          20
        );
        ctx.font = 'bold 42px sans-serif';
        drawCentered(ctx, 'www.telugujyothisham.com', 96, WIDTH - 192, 1535, 20);
      }
    }
  }

  // Progress bar + Footer
  const barW = WIDTH - 152;
  drawRoundedRect(ctx, 76, 1685, barW, 12, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fill();
  drawRoundedRect(ctx, 76, 1685, Math.max(24, barW * progress), 12, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 30px "Noto Serif Telugu", sans-serif';
  drawCentered(
    ctx,
    'www.telugujyothisham.com • +91 89779 86166',
    76,
    WIDTH - 152,
    1768,
    20
  );
}

const renderedReelCache = new Map<
  string,
  { mp4Buffer: Buffer; filename: string; socialPack: DailyVideoSocialPack }
>();

/**
 * Generates a Full HD (1080x1920) 60-Second MP4 video buffer in Node.js for Telegram Bot broadcasting,
 * along with its full copy-ready Title, Caption, and Trending Hashtags.
 * Results are cached per (isoDate, kind, lang) in-process so social auto-uploaders reuse the exact MP4.
 */
export function generateServerDailyReelVideoBuffer(
  dayData: DayData,
  kind: 'panchangam' | 'rashi',
  lang: 'te' | 'en'
): {
  mp4Buffer: Buffer;
  filename: string;
  socialPack: DailyVideoSocialPack;
} {
  registerAvailableFonts();
  const isoDate = dayData.isoDate || getTodayIsoDateIST();
  const cacheKey = `${isoDate}::${kind}::${lang}`;
  const cached = renderedReelCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const durationSec = 60;
  const inputFps = 8; // 480 smooth motion-graphics frames encoded into 30fps H.264 stream
  const totalFrames = durationSec * inputFps;

  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), `slg-reel-${kind}-${lang}-`));
  const mp4Path = path.join(tmpBase, `Sri_Lakshmi_Ganapathi_${kind}_${lang}_${isoDate}_1080p.mp4`);

  try {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < totalFrames; i++) {
      const progress = i / Math.max(1, totalFrames - 1);
      renderCliFrame(ctx, isoDate, lang, 'hyderabad', progress, kind);
      const framePath = path.join(tmpBase, `frame-${String(i).padStart(4, '0')}.jpg`);
      fs.writeFileSync(framePath, canvas.toBuffer('image/jpeg', 92));
    }

    const customBgmCandidates = [
      process.env.CUSTOM_BGM_MP3_PATH || '',
      path.resolve(process.cwd(), 'scripts', 'audio', 'temple_bgm.mp3'),
      path.resolve(process.cwd(), 'public', 'audio', 'temple_bgm.mp3'),
    ].filter(Boolean);
    const customBgmPath = customBgmCandidates.find((p) => fs.existsSync(p));

    // Soothing Carnatic Bhupali/Hamsadhwani Tanpura + Singing Bowl Bell Chimes + Pentatonic Flute Soundscape
    const tanpuraL = '0.035*sin(2*PI*138.59*t)+0.025*sin(2*PI*207.65*t)+0.018*sin(2*PI*277.18*t)';
    const bell = '0.065*exp(-1.35*mod(t,10))*(sin(2*PI*554.37*t)+0.45*sin(2*PI*830.61*t)+0.25*sin(2*PI*1108.73*t))';
    const fluteFreq =
      '277.18*between(mod(t,21),0,3.5)+311.13*between(mod(t,21),3.5,7)+349.23*between(mod(t,21),7,10.5)+415.30*between(mod(t,21),10.5,14)+466.16*between(mod(t,21),14,17.5)+554.37*between(mod(t,21),17.5,21)';
    const fluteEnv = '0.042*pow(sin(PI*mod(t,3.5)/3.5),2)';
    const leftExpr = `(${tanpuraL})+0.95*(${bell})+(${fluteEnv})*sin(2*PI*(${fluteFreq})*t)`;
    const rightExpr = `(${tanpuraL})+0.95*(${bell})+(${fluteEnv})*sin(2*PI*(${fluteFreq})*(t+0.004))`;

    const ffmpegArgs = customBgmPath
      ? [
          '-y',
          '-framerate',
          String(inputFps),
          '-i',
          path.join(tmpBase, 'frame-%04d.jpg'),
          '-stream_loop',
          '-1',
          '-t',
          String(durationSec),
          '-i',
          customBgmPath,
          '-af',
          'volume=0.85,afade=t=in:st=0:d=1.5,afade=t=out:st=57.0:d=3.0',
          '-c:v',
          'libx264',
          '-pix_fmt',
          'yuv420p',
          '-r',
          '30',
          '-preset',
          'ultrafast',
          '-crf',
          '20',
          '-c:a',
          'aac',
          '-b:a',
          '160k',
          '-shortest',
          '-movflags',
          '+faststart',
          mp4Path,
        ]
      : [
          '-y',
          '-framerate',
          String(inputFps),
          '-i',
          path.join(tmpBase, 'frame-%04d.jpg'),
          '-f',
          'lavfi',
          '-t',
          String(durationSec),
          '-i',
          `aevalsrc='${leftExpr}|${rightExpr}':s=44100`,
          '-af',
          'lowpass=f=2200,aecho=0.8:0.88:70|130:0.35|0.22,afade=t=in:st=0:d=1.8,afade=t=out:st=57.0:d=3.0',
          '-c:v',
          'libx264',
          '-pix_fmt',
          'yuv420p',
          '-r',
          '30',
          '-preset',
          'ultrafast',
          '-crf',
          '20',
          '-c:a',
          'aac',
          '-b:a',
          '160k',
          '-shortest',
          '-movflags',
          '+faststart',
          mp4Path,
        ];

    execFileSync('ffmpeg', ffmpegArgs, { stdio: 'ignore' });

    const mp4Buffer = fs.readFileSync(mp4Path);
    const socialPack = generateDailyVideoSocialPack(dayData, kind, lang, 'auto');
    const filename = `Sri_Lakshmi_Ganapathi_${kind === 'panchangam' ? 'Panchangam' : '12_Rashi_Phalalu'}_${lang.toUpperCase()}_${isoDate}_60s_HD.mp4`;

    const result = { mp4Buffer, filename, socialPack };
    renderedReelCache.set(cacheKey, result);

    const saveDir = process.env.SAVE_DAILY_REELS_DIR;
    if (saveDir) {
      try {
        fs.mkdirSync(saveDir, { recursive: true });
        fs.writeFileSync(path.join(saveDir, filename), mp4Buffer);
        fs.writeFileSync(
          path.join(saveDir, `${filename.replace(/\.mp4$/, '')}-caption.txt`),
          socialPack.fullPostText,
          'utf-8'
        );
      } catch {}
    }

    return result;
  } finally {
    try {
      fs.rmSync(tmpBase, { recursive: true, force: true });
    } catch {}
  }
}

function parseArg(name: string, fallback: string): string {
  const match = process.argv.find((a) => a.startsWith(`--${name}=`));
  return match ? match.split('=')[1] : fallback;
}

export async function main() {
  registerAvailableFonts();
  const isoDate = parseArg('date', getTodayIsoDateIST());
  const lang = (parseArg('lang', 'te') === 'en' ? 'en' : 'te') as 'te' | 'en';
  const kind = (parseArg('kind', 'panchangam') === 'rashi' ? 'rashi' : 'panchangam') as
    | 'panchangam'
    | 'rashi';

  const dayData = getOrGenerateDayData(isoDate, WEEK_DATA);
  const { mp4Buffer, filename, socialPack } = generateServerDailyReelVideoBuffer(dayData, kind, lang);

  const outDir = path.resolve(process.cwd(), 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const mp4Path = path.join(outDir, filename);
  const captionPath = path.join(outDir, `${filename.replace(/\.mp4$/, '')}-caption.txt`);

  fs.writeFileSync(mp4Path, mp4Buffer);
  fs.writeFileSync(captionPath, socialPack.fullPostText, 'utf-8');

  console.log(`✅ 60s HD Video saved: ${mp4Path}`);
  console.log(`✅ Caption & hashtags: ${captionPath}`);
}

if (process.argv[1]?.includes('generateDailyPanchangamReel')) {
  main().catch((err) => {
    console.error('❌ Failed to generate daily Reel:', err);
    process.exit(1);
  });
}
