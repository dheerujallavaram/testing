/**
 * ShareChat 2-Minute (120s) Vertical 9:16 HD Website Promotional Video Ad Generator
 * Dual Language Edition: Telugu (te-IN-MohanNeural) + English (en-IN-PrabhatNeural)
 *
 * Renders two studio-grade 120-second HD MP4s (720x1280, H.264 + AAC Stereo)
 * with crystal-clear natural human Neural AI voiceover blended over a soft ducked
 * Raga Hamsadhwani Veena/Tanpura devotional soundtrack + Temple Bell chimes:
 *   1) public/assets/videos/telugujyothisham-sharechat-promo-2min-te.mp4
 *   2) public/assets/videos/telugujyothisham-sharechat-promo-2min-en.mp4
 *
 * Usage:
 *   npx tsx scripts/generateShareChatPromoVideo.ts         (renders BOTH te & en)
 *   npx tsx scripts/generateShareChatPromoVideo.ts te      (renders Telugu only)
 *   npx tsx scripts/generateShareChatPromoVideo.ts en      (renders English only)
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts, Image as CanvasImage, loadImage, SKRSContext2D } from '@napi-rs/canvas';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { getTodayISTData } from './telegramBot';
import { computeLivePanchangamSheet, LivePanchangamSheetSnapshot } from '../src/utils/livePanchangamSheetEngine';
import { PromoLanguage, SHARECHAT_PROMO_CHAPTERS } from '../src/data/shareChatPromoConfig';

function teTimeToEn(str: string): string {
  return str
    .replace(/తె\.\s*(\d+:\d+)/g, '$1 AM')
    .replace(/ఉ\.\s*(\d+:\d+)/g, '$1 AM')
    .replace(/మ\.\s*(\d+:\d+)/g, '$1 PM')
    .replace(/సా\.\s*(\d+:\d+)/g, '$1 PM')
    .replace(/రా\.\s*(\d+:\d+)/g, '$1 PM')
    .replace(/వరకు/g, 'till')
    .replace(/ఈ రోజు లేవు/g, 'None today')
    .replace(/లేవు/g, 'None')
    .trim();
}

const TE_TO_EN_TERMS: Record<string, string> = {
  'శుక్ల': 'Shukla',
  'కృష్ణ': 'Krishna',
  'పాడ్యమి': 'Padyami',
  'విదియ': 'Vidiya',
  'తదియ': 'Tadiya',
  'చవితి': 'Chavithi',
  'పంచమి': 'Panchami',
  'షష్ఠి': 'Shashthi',
  'సప్తమి': 'Saptami',
  'అష్టమి': 'Ashtami',
  'నవమి': 'Navami',
  'దశమి': 'Dashami',
  'ఏకాదశి': 'Ekadashi',
  'ద్వాదశి': 'Dwadashi',
  'త్రయోదశి': 'Trayodashi',
  'చతుర్దశి': 'Chaturdashi',
  'పౌర్ణమి': 'Pournami',
  'అమావాస్య': 'Amavasya',
  'అశ్విని': 'Ashwini',
  'భరణి': 'Bharani',
  'కృత్తిక': 'Krittika',
  'రోహిణి': 'Rohini',
  'మృగశిర': 'Mrigashira',
  'ఆరుద్ర': 'Ardra',
  'పునర్వసు': 'Punarvasu',
  'పుష్యమి': 'Pushyami',
  'ఆశ్లేష': 'Ashlesha',
  'మఖ': 'Magha',
  'పుబ్బ': 'Pubba',
  'ఉత్తర': 'Uttara',
  'హస్త': 'Hasta',
  'చిత్త': 'Chitta',
  'స్వాతి': 'Swati',
  'విశాఖ': 'Vishakha',
  'అనూరాధ': 'Anuradha',
  'జ్యేష్ఠ': 'Jyeshtha',
  'మూల': 'Moola',
  'పూర్వాషాఢ': 'Purvashadha',
  'ఉత్తరాషాఢ': 'Uttarashadha',
  'శ్రవణం': 'Shravanam',
  'ధనిష్ఠ': 'Dhanishtha',
  'శతభిషం': 'Shatabhisham',
  'పూర్వాభాద్ర': 'Purvabhadra',
  'ఉత్తరాభాద్ర': 'Uttarabhadra',
  'రేవతి': 'Revati',
  'వజ్ర': 'Vajra',
  'సిద్ధి': 'Siddhi',
  'వ్యాఘాతం': 'Vyaghata',
  'హర్షణం': 'Harshana',
  'వణిజ': 'Vanija',
  'బవ': 'Bava',
  'బాలవ': 'Balava',
  'కౌలవ': 'Kaulava',
  'తైతుల': 'Taitula',
  'గరజి': 'Garaja',
  'విష్టి': 'Vishti',
  'యోగం': 'Yogam',
  'కరణం': 'Karanam',
};

function teTermToEn(str: string): string {
  return str
    .split(/\s+/)
    .map((w) => TE_TO_EN_TERMS[w] || w)
    .join(' ');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const W = 720;
const H = 1280;
const FPS = 20;
const SCENE_DUR_SEC = 15;
const DURATION_SEC = SHARECHAT_PROMO_CHAPTERS.length * SCENE_DUR_SEC; // 120s = exact 2:00
const TOTAL_FRAMES = FPS * DURATION_SEC; // 2400 frames

function registerFonts() {
  const fontCandidates = [
    path.join(__dirname, 'fonts', 'NotoSerifTelugu.ttf'),
    path.join(__dirname, 'fonts', 'NotoSerifTelugu-Bold.ttf'),
    '/usr/share/fonts/truetype/noto/NotoSerifTelugu-Bold.ttf',
    '/usr/share/fonts/truetype/noto/NotoSerifTelugu-Regular.ttf',
  ];
  for (const fp of fontCandidates) {
    try {
      if (fs.existsSync(fp)) {
        GlobalFonts.registerFromPath(fp, 'Noto Serif Telugu');
      }
    } catch {}
  }
}

function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

function easeOutCubic(t: number): number {
  const x = clamp(t, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutQuad(t: number): number {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function roundRect(ctx: SKRSContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function drawCenteredText(ctx: SKRSContext2D, text: string, cx: number, y: number, maxW: number) {
  ctx.save();
  ctx.textAlign = 'left';
  const w = Math.min(ctx.measureText(text).width, maxW);
  ctx.fillText(text, Math.round(cx - w / 2), y, maxW);
  ctx.restore();
}

function drawWrappedCenteredText(
  ctx: SKRSContext2D,
  text: string,
  cx: number,
  startY: number,
  maxW: number,
  lineH: number
): number {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);

  let y = startY;
  for (const line of lines) {
    drawCenteredText(ctx, line, cx, y, maxW);
    y += lineH;
  }
  return y;
}

function drawCircularPortrait(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  radius: number,
  portrait?: CanvasImage
) {
  ctx.save();
  const aura = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius + 24);
  aura.addColorStop(0, 'rgba(245, 196, 81, 0.48)');
  aura.addColorStop(1, 'rgba(245, 196, 81, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
  ctx.fillStyle = '#E5B44B';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
  ctx.fillStyle = '#3B0A0C';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (portrait && portrait.width > 0 && portrait.height > 0) {
    const crop = Math.min(portrait.width, portrait.height);
    const sx = Math.round((portrait.width - crop) / 2);
    const sy = Math.round(Math.max(0, (portrait.height - crop) * 0.14));
    ctx.drawImage(portrait, sx, sy, crop, crop, cx - radius, cy - radius, radius * 2, radius * 2);
  } else {
    ctx.fillStyle = '#5A1408';
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.fillStyle = '#FDE68A';
    ctx.font = `bold ${Math.round(radius * 0.85)}px "Noto Serif Telugu", serif`;
    drawCenteredText(ctx, 'ఓం', cx, cy + Math.round(radius * 0.3), radius * 1.6);
  }
  ctx.restore();
}

function drawRotatingMandala(ctx: SKRSContext2D, cx: number, cy: number, radius: number, angleRad: number, alpha = 0.12) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.strokeStyle = `rgba(245, 196, 81, ${alpha})`;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * radius * 0.35, Math.sin(a) * radius * 0.35);
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.stroke();

    const aMid = a + Math.PI / 12;
    ctx.beginPath();
    ctx.arc(
      Math.cos(aMid) * radius * 0.88,
      Math.sin(aMid) * radius * 0.88,
      radius * 0.12,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawTempleBackdrop(ctx: SKRSContext2D, tSec: number, sceneIdx: number, lang: PromoLanguage) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  if (sceneIdx % 2 === 0) {
    grad.addColorStop(0, '#5A1408');
    grad.addColorStop(0.45, '#330809');
    grad.addColorStop(1, '#180509');
  } else {
    grad.addColorStop(0, '#4A1009');
    grad.addColorStop(0.5, '#2A0812');
    grad.addColorStop(1, '#14050B');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  drawRotatingMandala(ctx, W / 2, H * 0.44, 340, tSec * 0.08, 0.1);
  drawRotatingMandala(ctx, W / 2, H * 0.44, 210, -tSec * 0.12, 0.08);

  // Floating gentle golden dust motes
  for (let i = 0; i < 18; i++) {
    const seed = i * 97.3;
    const x = ((seed * 13 + Math.sin(tSec * 0.5 + i) * 28) % (W - 40)) + 20;
    const y = H - ((tSec * (18 + (i % 5) * 6) + seed * 19) % H);
    const r = 1.6 + (i % 3) * 0.9;
    const a = 0.2 + 0.25 * Math.sin(tSec * 2 + i);
    ctx.fillStyle = `rgba(245, 196, 81, ${a.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer antique gold temple frame
  ctx.strokeStyle = 'rgba(201, 150, 52, 0.72)';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.strokeStyle = 'rgba(201, 150, 52, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, W - 52, H - 52);

  // Top persistent brand strip
  ctx.fillStyle = 'rgba(20, 4, 4, 0.58)';
  ctx.fillRect(28, 28, W - 56, 62);
  ctx.fillStyle = '#F5C451';
  ctx.font = lang === 'te' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 19px Georgia, serif';
  drawCenteredText(
    ctx,
    lang === 'te'
      ? 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · www.telugujyothisham.com'
      : 'SRI LAKSHMI GANAPATHI JYOTHISHALAYAM · www.telugujyothisham.com',
    W / 2,
    67,
    W - 80
  );

  // Subtle animated golden voice waveform visualizer at bottom-right above footer
  const waveX = W - 120;
  const waveY = H - 144;
  ctx.save();
  for (let b = 0; b < 9; b++) {
    const hBar = 6 + Math.abs(Math.sin(tSec * 7.5 + b * 0.85)) * 16;
    ctx.fillStyle = 'rgba(245, 196, 81, 0.72)';
    roundRect(ctx, waveX + b * 8, waveY + (22 - hBar) / 2, 4.5, hBar, 2);
    ctx.fill();
  }
  ctx.restore();

  // Bottom persistent ShareChat CTA ribbon & progress bar
  const footerY = H - 118;
  ctx.fillStyle = 'rgba(18, 4, 4, 0.86)';
  ctx.fillRect(28, footerY, W - 56, 88);
  ctx.fillStyle = '#C99634';
  ctx.fillRect(28, footerY, W - 56, 2.5);

  ctx.fillStyle = '#FFFDF7';
  ctx.font = lang === 'te' ? 'bold 22px "Noto Serif Telugu", sans-serif' : 'bold 21px Georgia, sans-serif';
  drawCenteredText(
    ctx,
    lang === 'te'
      ? 'WhatsApp సంప్రదింపు: +91 89779 86166'
      : 'WhatsApp Consultation: +91 89779 86166',
    W / 2,
    footerY + 38,
    W - 84
  );

  ctx.fillStyle = '#F5C451';
  ctx.font = lang === 'te' ? 'bold 17px "Noto Serif Telugu", sans-serif' : 'bold 16px sans-serif';
  drawCenteredText(
    ctx,
    lang === 'te'
      ? 'ఉచిత పంచాంగం · జాతకం PDF · వివాహ పొంతన · ముహూర్తాలు'
      : 'Free Panchangam · 37-Ch Kundali PDF · Marriage Match · BTR Lab',
    W / 2,
    footerY + 69,
    W - 84
  );

  // 2-minute progress hairline
  const progress = clamp(tSec / DURATION_SEC, 0, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.fillRect(28, H - 24, W - 56, 5);
  ctx.fillStyle = '#F5C451';
  ctx.fillRect(28, H - 24, Math.round((W - 56) * progress), 5);
}

function drawFeatureCard(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  badgeText: string,
  reveal: number,
  lang: PromoLanguage
) {
  const e = easeOutCubic(reveal);
  if (e <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = e;
  const dy = (1 - e) * 24;

  roundRect(ctx, x, y + dy, w, h, 18);
  ctx.fillStyle = '#FAF5EA';
  ctx.fill();
  ctx.strokeStyle = '#C99634';
  ctx.lineWidth = 2;
  ctx.stroke();

  roundRect(ctx, x + 16, y + dy + Math.round((h - 48) / 2), 48, 48, 12);
  ctx.fillStyle = '#5A1408';
  ctx.fill();
  ctx.fillStyle = '#F5C451';
  ctx.font = lang === 'te' ? 'bold 20px "Noto Serif Telugu", serif' : 'bold 18px Georgia, serif';
  drawCenteredText(ctx, badgeText, x + 40, y + dy + Math.round(h / 2) + 7, 44);

  ctx.fillStyle = '#2B0705';
  ctx.font = lang === 'te' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 22px Georgia, serif';
  ctx.fillText(title, x + 80, y + dy + 42, w - 98);

  ctx.fillStyle = '#57534E';
  ctx.font = lang === 'te' ? '600 18px "Noto Serif Telugu", sans-serif' : '600 16px sans-serif';
  ctx.fillText(subtitle, x + 80, y + dy + 72, w - 98);

  ctx.restore();
}

function drawSceneLabel(ctx: SKRSContext2D, chapterNum: string, label: string, y: number, reveal: number, lang: PromoLanguage) {
  const e = easeOutCubic(reveal);
  ctx.save();
  ctx.globalAlpha = e;
  roundRect(ctx, W / 2 - 245, y - 28, 490, 42, 21);
  ctx.fillStyle = 'rgba(245, 196, 81, 0.16)';
  ctx.fill();
  ctx.strokeStyle = '#E5B44B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#FDE68A';
  ctx.font = lang === 'te' ? 'bold 18px "Noto Serif Telugu", sans-serif' : 'bold 17px Georgia, serif';
  drawCenteredText(ctx, `${chapterNum} · ${label}`, W / 2, y, 460);
  ctx.restore();
}

function drawFrame(
  ctx: SKRSContext2D,
  frameIdx: number,
  snap: LivePanchangamSheetSnapshot,
  lang: PromoLanguage,
  portrait?: CanvasImage
) {
  const tSec = frameIdx / FPS;
  const sceneIdx = Math.min(7, Math.floor(tSec / SCENE_DUR_SEC));
  const localT = tSec - sceneIdx * SCENE_DUR_SEC;
  const isTe = lang === 'te';

  drawTempleBackdrop(ctx, tSec, sceneIdx, lang);

  const fadeIn = clamp(localT / 0.65, 0, 1);
  const fadeOut = sceneIdx === 7 ? 1 : clamp((SCENE_DUR_SEC - localT) / 0.65, 0, 1);
  const sceneAlpha = Math.min(fadeIn, fadeOut);

  ctx.save();
  ctx.globalAlpha = sceneAlpha;

  // =========================================================================
  // SCENE 0 (00:00 - 00:15): SACRED TEMPLE HOOK & BRAND INTRO
  // =========================================================================
  if (sceneIdx === 0) {
    drawSceneLabel(
      ctx,
      isTe ? 'ఓం శ్రీలక్ష్మి గణపతయే నమః' : 'OM SRI LAKSHMI GANAPATHAYE NAMAH',
      isTe ? 'వెబ్‌సైట్ పరిచయం' : 'OFFICIAL INTRO',
      152,
      localT / 0.8,
      lang
    );

    const pulse = 1 + Math.sin(localT * 1.4) * 0.02;
    drawCircularPortrait(ctx, W / 2, 326, Math.round(110 * pulse), portrait);

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 37px "Noto Serif Telugu", serif' : 'bold 34px Georgia, serif';
    drawWrappedCenteredText(
      ctx,
      isTe
        ? 'మీ జీవిత ప్రశ్నలకు శాస్త్రీయ వేద జ్యోతిష సమాధానం!'
        : 'Authentic Drik Siddhanta Vedic Astrology for Every Milestone!',
      W / 2,
      512,
      W - 88,
      50
    );

    ctx.fillStyle = '#F5C451';
    ctx.font = isTe ? 'bold 27px "Noto Serif Telugu", serif' : 'bold 25px Georgia, serif';
    drawCenteredText(
      ctx,
      isTe ? 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు' : 'Brahmasri Jallavaram Sai Dheeraj Sharma',
      W / 2,
      642,
      W - 80
    );

    ctx.fillStyle = '#EAD7B7';
    ctx.font = isTe ? '600 22px "Noto Serif Telugu", sans-serif' : '600 20px sans-serif';
    drawCenteredText(
      ctx,
      isTe ? 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · హైదరాబాద్' : 'Sri Lakshmi Ganapathi Jyothishalayam · Hyderabad',
      W / 2,
      686,
      W - 80
    );

    const boxReveal = easeOutCubic((localT - 1.0) / 0.9);
    ctx.save();
    ctx.globalAlpha = sceneAlpha * boxReveal;
    roundRect(ctx, 56, 738, W - 112, 350, 22);
    ctx.fillStyle = '#FAF5EA';
    ctx.fill();
    ctx.strokeStyle = '#C99634';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#5A1408';
    ctx.font = isTe ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 23px Georgia, serif';
    drawCenteredText(
      ctx,
      isTe ? 'తెలుగువారి విశ్వసనీయ జ్యోతిష వేదిక' : 'Trusted Vedic Astrology Portal Worldwide',
      W / 2,
      790,
      W - 150
    );

    const bullets = isTe
      ? [
          '100% దృక్సిద్ధాంత (NASA JPL) ఖచ్చిత గణన',
          'ఉచిత నిత్య తెలుగు పంచాంగం & లైవ్ కుండలి',
          'ఉచిత 37-అధ్యాయాల సంపూర్ణ జాతకం PDF',
          '6-మెథడ్ జన్మ సమయ శుద్ధి (BTR) & ముహూర్తాలు',
          'ఇండియా & USA / NRI భక్తుల కోసం ప్రత్యేక సేవలు',
        ]
      : [
          '100% NASA JPL Drik Siddhanta Precision',
          'Free Daily Telugu Panchangam & Live Kundali',
          'Free 37-Chapter Complete Janma Kundali PDF',
          '6-Method Birth Time Rectification & Muhurtham',
          'Dedicated Astrology & Homa Services for India & NRI',
        ];
    ctx.font = isTe ? 'bold 21px "Noto Serif Telugu", sans-serif' : 'bold 19px sans-serif';
    bullets.forEach((b, i) => {
      const bAlpha = easeOutCubic((localT - 1.8 - i * 0.7) / 0.6);
      const by = 848 + i * 44;
      ctx.save();
      ctx.globalAlpha = sceneAlpha * bAlpha;
      // Crisp vector emerald badge with drawn checkmark stroke (no font tofu box!)
      ctx.beginPath();
      ctx.arc(92, by - 7, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#007a52';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(86.5, by - 7);
      ctx.lineTo(90.5, by - 3);
      ctx.lineTo(97.5, by - 11);
      ctx.stroke();

      ctx.fillStyle = '#1C1917';
      ctx.fillText(b, 114, by, W - 196);
      ctx.restore();
    });
    ctx.restore();
  }

  // =========================================================================
  // SCENE 1 (00:15 - 00:30): DAILY PANCHANGAM + LIVE 4x4 KUNDALI SHOWCASE
  // =========================================================================
  else if (sceneIdx === 1) {
    drawSceneLabel(
      ctx,
      '01 / 06',
      isTe ? 'నేటి దృక్సిద్ధాంత పంచాంగం & లైవ్ కుండలి' : 'DAILY DRIK PANCHANGAM & LIVE KUNDALI',
      150,
      localT / 0.7,
      lang
    );

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 34px "Noto Serif Telugu", serif' : 'bold 32px Georgia, serif';
    drawWrappedCenteredText(
      ctx,
      isTe
        ? 'ప్రతిరోజూ ఉదయం 1-స్క్రీన్ తెలుగు పంచాంగం & లైవ్ గ్రహస్థితి!'
        : 'Every Morning: 1-Screen Drik Panchangam & Live Sky Chart!',
      W / 2,
      225,
      W - 84,
      46
    );

    const cardY = 318;
    const cardH = 560;
    roundRect(ctx, 48, cardY, W - 96, cardH, 22);
    ctx.fillStyle = '#FAF5EA';
    ctx.fill();
    ctx.strokeStyle = '#C99634';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    roundRect(ctx, 56, cardY + 8, W - 112, 66, 16);
    ctx.fillStyle = '#4B1008';
    ctx.fill();
    ctx.fillStyle = '#F5C451';
    ctx.font = isTe ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 21px Georgia, serif';
    drawCenteredText(
      ctx,
      isTe
        ? `${snap.dayNumber} ${snap.monthYearTe} · ${snap.weekdayTe} (${snap.cityTe})`
        : `${snap.dayNumber} ${snap.monthYearEn} · ${snap.weekdayEn} (${snap.cityEn})`,
      W / 2,
      cardY + 49,
      W - 140
    );

    const angas = isTe
      ? [
          { k: 'తిథి', v: snap.tithiNameTe, end: snap.tithiEndTe },
          { k: 'నక్షత్రం', v: snap.nakshatraNameTe, end: snap.nakshatraEndTe },
          { k: 'యోగం', v: snap.yogamNameTe, end: snap.yogamEndTe },
          { k: 'కరణం', v: snap.karanamNameTe, end: snap.karanamEndTe },
        ]
      : [
          { k: 'Tithi', v: teTermToEn(snap.tithiNameTe), end: teTimeToEn(snap.tithiEndTe) },
          { k: 'Nakshatra', v: teTermToEn(snap.nakshatraNameTe), end: teTimeToEn(snap.nakshatraEndTe) },
          { k: 'Yogam', v: teTermToEn(snap.yogamNameTe), end: teTimeToEn(snap.yogamEndTe) },
          { k: 'Karanam', v: teTermToEn(snap.karanamNameTe), end: teTimeToEn(snap.karanamEndTe) },
        ];
    angas.forEach((a, idx) => {
      const ry = cardY + 108 + idx * 54;
      ctx.fillStyle = '#8B2611';
      ctx.font = isTe ? 'bold 19px "Noto Serif Telugu", sans-serif' : 'bold 18px sans-serif';
      ctx.fillText(a.k, 76, ry, 118);

      ctx.fillStyle = '#1C1917';
      ctx.font = isTe ? 'bold 22px "Noto Serif Telugu", serif' : 'bold 21px Georgia, serif';
      ctx.fillText(a.v, 196, ry, 235);

      ctx.fillStyle = '#57534E';
      ctx.font = isTe ? 'bold 17px "Noto Serif Telugu", sans-serif' : 'bold 16px sans-serif';
      const wEnd = Math.min(ctx.measureText(a.end).width, 200);
      ctx.fillText(a.end, W - 76 - wEnd, ry, 200);

      if (idx < 3) {
        ctx.strokeStyle = '#E8D9BC';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(76, ry + 16);
        ctx.lineTo(W - 76, ry + 16);
        ctx.stroke();
      }
    });

    const boxY = cardY + 340;
    const halfW = (W - 160) / 2;
    roundRect(ctx, 72, boxY, halfW, 198, 16);
    ctx.fillStyle = '#EFF8F3';
    ctx.fill();
    ctx.strokeStyle = '#86C9A5';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#065F46';
    ctx.font = isTe ? 'bold 20px "Noto Serif Telugu", serif' : 'bold 19px Georgia, serif';
    ctx.fillText(isTe ? 'శుభ సమయాలు' : 'Shubha Timings', 90, boxY + 34, 240);
    ctx.fillStyle = '#1C1917';
    ctx.font = isTe ? 'bold 17px "Noto Serif Telugu", sans-serif' : 'bold 15px sans-serif';
    ctx.fillText(`${isTe ? 'సూర్యోదయం' : 'Sunrise'}: ${isTe ? snap.sunriseTe : teTimeToEn(snap.sunriseTe)}`, 90, boxY + 72, 245);
    ctx.fillText(`${isTe ? 'అభిజిత్' : 'Abhijit'}: ${isTe ? snap.abhijitTe : teTimeToEn(snap.abhijitTe)}`, 90, boxY + 108, 245);
    ctx.fillText(`${isTe ? 'అమృత' : 'Amrutha'}: ${isTe ? snap.amruthaTe : teTimeToEn(snap.amruthaTe)}`, 90, boxY + 144, 245);
    ctx.fillText(`${isTe ? 'బ్రహ్మ' : 'Brahma'}: ${isTe ? snap.brahmaMuhurthamTe : teTimeToEn(snap.brahmaMuhurthamTe)}`, 90, boxY + 178, 245);

    const rBoxX = 72 + halfW + 16;
    roundRect(ctx, rBoxX, boxY, halfW, 198, 16);
    ctx.fillStyle = '#FDF2F2';
    ctx.fill();
    ctx.strokeStyle = '#E8A5A5';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#991B1B';
    ctx.font = isTe ? 'bold 20px "Noto Serif Telugu", serif' : 'bold 19px Georgia, serif';
    ctx.fillText(isTe ? 'అశుభ సమయాలు' : 'Ashubha Timings', rBoxX + 18, boxY + 34, 240);
    ctx.fillStyle = '#1C1917';
    ctx.font = isTe ? 'bold 17px "Noto Serif Telugu", sans-serif' : 'bold 15px sans-serif';
    ctx.fillText(`${isTe ? 'రాహుకాలం' : 'Rahu'}: ${isTe ? snap.rahukalamTe : teTimeToEn(snap.rahukalamTe)}`, rBoxX + 18, boxY + 72, 245);
    ctx.fillText(`${isTe ? 'యమగండం' : 'Yama'}: ${isTe ? snap.yamagandamTe : teTimeToEn(snap.yamagandamTe)}`, rBoxX + 18, boxY + 108, 245);
    ctx.fillText(`${isTe ? 'గుళిక' : 'Gulika'}: ${isTe ? snap.gulikaTe : teTimeToEn(snap.gulikaTe)}`, rBoxX + 18, boxY + 144, 245);
    ctx.fillText(`${isTe ? 'వర్జ్యం' : 'Varjyam'}: ${isTe ? snap.varjyamTe : teTimeToEn(snap.varjyamTe)}`, rBoxX + 18, boxY + 178, 245);

    drawFeatureCard(
      ctx,
      48,
      912,
      W - 96,
      100,
      isTe ? 'హైదరాబాద్ · విజయవాడ · విశాఖ · USA NRI' : 'Hyderabad · Vijayawada · Vizag · USA / NRI',
      isTe ? '1-క్లిక్ HD WhatsApp Story & 4×4 లైవ్ కుండలి డౌన్‌లోడ్!' : '1-Click HD WhatsApp Story & Live 4×4 South Indian Kundali!',
      'HD',
      (localT - 1.5) / 0.8,
      lang
    );
  }

  // =========================================================================
  // SCENE 2 (00:30 - 00:45): FREE 37-CHAPTER JANMA KUNDALI PDF
  // =========================================================================
  else if (sceneIdx === 2) {
    drawSceneLabel(
      ctx,
      '02 / 06',
      isTe ? 'ఉచిత 37-అధ్యాయాల బృహత్ జాతకం PDF' : 'FREE 37-CHAPTER JANMA KUNDALI PDF',
      150,
      localT / 0.7,
      lang
    );

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 35px "Noto Serif Telugu", serif' : 'bold 32px Georgia, serif';
    drawWrappedCenteredText(
      ctx,
      isTe
        ? 'పుట్టిన తేదీ, సమయంతో 100+ పేజీల సంపూర్ణ తెలుగు జాతకం ఉచితంగా!'
        : 'Generate Your 100+ Page Complete Vedic Horoscope PDF Free!',
      W / 2,
      228,
      W - 80,
      48
    );

    const cards = isTe
      ? [
          { b: 'D60', t: 'షోడశవర్గ D1 నుండి D60 చక్రాలు', s: 'దక్షిణ, ఉత్తర, తూర్పు భారత శైలులు & శ్రీపతి భవ చలిత' },
          { b: 'దశ', t: '120 ఏళ్ల వింశోత్తరి & ప్రత్యంతర దశ', s: 'అష్టోత్తరి, యోగిని, జైమిని చర దశ & తాజిక వర్షఫల్' },
          { b: '300', t: '300 రాజయోగాలు & 337 సర్వాష్టకవర్గ', s: 'గజకేసరి, ధర్మ-కర్మాధిపతి, షడ్బలం & ఇష్టదేవత' },
          { b: 'KP', t: 'KP 249 సబ్‌లార్డ్స్ & భృగు నంది నాడి', s: 'ఉద్యోగం, వివాహం, విదేశీయాన యోగాల సూక్ష్మ ఫలితం' },
          { b: 'PDF', t: 'తక్షణమే 1-క్లిక్ ప్రింటబుల్ PDF డౌన్‌లోడ్', s: 'ఆయుర్వేద త్రిదోష, రత్న-రుద్రాక్ష & పరిహారాలతో!' },
        ]
      : [
          { b: 'D60', t: 'Shodashavarga D1 to D60 Charts', s: 'South, North & East Indian styles + Sripati Bhava Chalit' },
          { b: '120Y', t: '120-Year Vimshottari & Pratyantar Dasha', s: 'Ashtottari, Yogini, Jaimini Chara Dasha & Tajika Varshaphal' },
          { b: '300', t: '300 Rajayogas & 337 Sarvashtakavarga', s: 'Gajakesari, Shadbala strength, Ishta Devata & Doshas' },
          { b: 'KP', t: 'KP 249 Sub-Lords & Bhrigu Nandi Nadi', s: 'Precision career, marriage, wealth & foreign travel timing' },
          { b: 'PDF', t: 'Instant 1-Click Printable Book PDF', s: 'Includes Gemstone, Rudraksha, Ayurveda & Vedic Remedies!' },
        ];

    cards.forEach((c, i) => {
      drawFeatureCard(ctx, 48, 360 + i * 124, W - 96, 106, c.t, c.s, c.b, (localT - 0.6 - i * 0.7) / 0.7, lang);
    });
  }

  // =========================================================================
  // SCENE 3 (00:45 - 01:00): 6-METHOD BIRTH TIME RECTIFICATION (BTR)
  // =========================================================================
  else if (sceneIdx === 3) {
    drawSceneLabel(
      ctx,
      '03 / 06',
      isTe ? '6-మెథడ్ జన్మ సమయ శుద్ధి (BTR Lab)' : '6-METHOD BIRTH TIME RECTIFICATION LAB',
      150,
      localT / 0.7,
      lang
    );

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 35px "Noto Serif Telugu", serif' : 'bold 32px Georgia, serif';
    drawWrappedCenteredText(
      ctx,
      isTe
        ? 'పుట్టిన సమయం 5–60 నిమిషాలు తప్పుగా ఉందా? చింతించకండి!'
        : 'Birth Time Uncertain by 5–60 Minutes? Pinpoint It Scientifically!',
      W / 2,
      228,
      W - 84,
      48
    );

    ctx.fillStyle = '#F5C451';
    ctx.font = isTe ? 'bold 22px "Noto Serif Telugu", sans-serif' : 'bold 19px sans-serif';
    drawCenteredText(
      ctx,
      isTe
        ? 'తెలుగులో మొట్టమొదటి 6-మెథడ్ ఆన్‌లైన్ జన్మ సమయ శుద్ధి టూల్'
        : 'Classical 6-Method Vedic BTR Engine — Free Online',
      W / 2,
      344,
      W - 80
    );

    const btrCards = isTe
      ? [
          { b: '1', t: 'ప్రాణపద లగ్నం (BPHS సూర్యోదయ గణన)', s: 'శిశువు మొదటి శ్వాస విఘటికలతో 1-5-9 త్రికోణ పరీక్ష' },
          { b: '2', t: 'కుండ స్ఫుట (81× చంద్రుడు) & పంచ తత్వం', s: '90 నిమిషాల సూర్యోదయ తత్వ చక్రంతో లగ్న శుద్ధి' },
          { b: '3', t: 'KP 249 సబ్‌లార్డ్ & మండి-లగ్న పరీక్ష', s: 'ప్రతి 4–8 నిమిషాలకు మారే లగ్న ఉప-అధిపతి నిర్ధారణ' },
          { b: '4', t: 'మీ నిజ జీవిత ఘటనలతో దశా వెరిఫికేషన్', s: 'వివాహం, ఉద్యోగం, సంతానం, గృహం తేదీలతో మహాదశ పరీక్ష' },
          { b: 'D60', t: 'కవల పిల్లల జాతక విభజన (2 నిమిషాల D60)', s: '1-నిమిషం స్టెప్‌తో కవలల సూక్ష్మ కర్మ భేదం తెలుసుకోండి!' },
        ]
      : [
          { b: '1', t: 'Pranapada Lagna (BPHS Sunrise Formula)', s: 'Verifies 1-5-9 trine harmony from first breath vighatikas' },
          { b: '2', t: 'Kunda Sphuta (81× Moon) & Pancha Tatwa', s: '90-minute sunrise element cycle & Moon harmonic lock' },
          { b: '3', t: 'KP 249 Sub-Lord & Mandi-Lagna Check', s: 'Ascendant sub-lord precision shifting every 4–8 minutes' },
          { b: '4', t: 'Real Life-Event Dasha Verification', s: 'Cross-checks Marriage, Career, Home & Childbirth dates' },
          { b: 'D60', t: 'Twins Shashtiamsa (D60) Karma Split', s: 'Separates identical twins born just 2 minutes apart!' },
        ];

    btrCards.forEach((c, i) => {
      drawFeatureCard(ctx, 48, 382 + i * 122, W - 96, 104, c.t, c.s, c.b, (localT - 0.6 - i * 0.7) / 0.7, lang);
    });
  }

  // =========================================================================
  // SCENE 4 (01:00 - 01:15): 12 RASHI PHALALU & GOCHARA RADAR
  // =========================================================================
  else if (sceneIdx === 4) {
    drawSceneLabel(
      ctx,
      '04 / 06',
      isTe ? 'ద్వాదశ రాశి ఫలాలు & గోచార రాడార్' : '12 RASHI PHALALU & LIVE SKY RADAR',
      150,
      localT / 0.7,
      lang
    );

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 35px "Noto Serif Telugu", serif' : 'bold 32px Georgia, serif';
    drawWrappedCenteredText(
      ctx,
      isTe
        ? 'మేషం నుండి మీనం వరకు నేటి రాశి ఫలాలు & శని-గురు గోచారం!'
        : 'Daily Horoscope for All 12 Rashis & Saturn-Jupiter Transits!',
      W / 2,
      228,
      W - 80,
      48
    );

    const rashis = isTe
      ? ['మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య', 'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం']
      : ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
    const activePulseIdx = Math.floor(localT * 1.4) % 12;
    const gridX = 54;
    const gridY = 354;
    const tileW = (W - 108 - 28) / 3;
    const tileH = 92;

    rashis.forEach((rName, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const tx = gridX + col * (tileW + 14);
      const ty = gridY + row * (tileH + 14);
      const isLit = idx === activePulseIdx;

      roundRect(ctx, tx, ty, tileW, tileH, 16);
      ctx.fillStyle = isLit ? '#F5C451' : '#FAF5EA';
      ctx.fill();
      ctx.strokeStyle = isLit ? '#FFFDF7' : '#C99634';
      ctx.lineWidth = isLit ? 3 : 1.5;
      ctx.stroke();

      ctx.fillStyle = isLit ? '#2B0705' : '#4A1208';
      ctx.font = isTe ? 'bold 24px "Noto Serif Telugu", serif' : 'bold 21px Georgia, serif';
      drawCenteredText(ctx, rName, tx + tileW / 2, ty + 46, tileW - 16);

      ctx.fillStyle = isLit ? '#3B0A0C' : '#6B7280';
      ctx.font = isTe ? 'bold 14px "Noto Serif Telugu", sans-serif' : 'bold 13px sans-serif';
      drawCenteredText(ctx, isTe ? 'నేటి దిన ఫలం' : 'Daily Forecast', tx + tileW / 2, ty + 74, tileW - 16);
    });

    drawFeatureCard(
      ctx,
      48,
      804,
      W - 96,
      104,
      isTe ? 'ఏలినాటి శని · అష్టమ శని · గురు & రాహు-కేతు' : 'Sade Sati · Ashtama Shani · Jupiter & Rahu-Ketu',
      isTe ? 'మీ రాశికి 12 నెలల గోచార బలం & సులభ వైదిక పరిహారాలు' : '12-month transit strength score & practical Vedic remedies',
      isTe ? 'గో' : 'TR',
      (localT - 1.0) / 0.8,
      lang
    );

    drawFeatureCard(
      ctx,
      48,
      924,
      W - 96,
      104,
      isTe ? 'లైవ్ ఖగోళ గ్రహ రాడార్ (Live Sky Wheel)' : 'Live Celestial Sky Wheel Radar',
      isTe ? 'ప్రస్తుత నవగ్రహ డిగ్రీలు & వక్ర గ్రహాల ప్రత్యక్ష వీక్షణ' : 'Real-time Navagraha degrees, Nakshatras & retrogrades',
      isTe ? 'నవ' : 'SKY',
      (localT - 1.8) / 0.8,
      lang
    );
  }

  // =========================================================================
  // SCENE 5 (01:15 - 01:30): VIVAHA PONTANA, MUHURTHAM & BABY NAMES
  // =========================================================================
  else if (sceneIdx === 5) {
    drawSceneLabel(
      ctx,
      '05 / 06',
      isTe ? 'వివాహ పొంతన · ముహూర్తాలు · పిల్లల పేర్లు' : 'MARRIAGE MATCH · MUHURTHAM · BABY NAMES',
      150,
      localT / 0.7,
      lang
    );

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 35px "Noto Serif Telugu", serif' : 'bold 32px Georgia, serif';
    drawWrappedCenteredText(
      ctx,
      isTe
        ? 'ప్రతి శుభకార్యానికి శాస్త్రీయ తెలుగు జ్యోతిష సాధనాలు ఉచితం!'
        : 'Sacred Vedic Tools for Every Family Milestone — Free!',
      W / 2,
      228,
      W - 80,
      48
    );

    const tools = isTe
      ? [
          { b: '36', t: '36 గుణాల వివాహ పొంతన (Ashtakoota)', s: 'వధూవరుల నాడి, భకూట, గణ, మాంగల్య & కుజ దోష పరీక్ష' },
          { b: '90', t: '90 రోజుల వ్యక్తిగత శుభ ముహూర్త స్కానర్', s: 'వివాహం, గృహప్రవేశం, వాహనం, వ్యాపార శుభ తేదీలు' },
          { b: '27', t: '27 నక్షత్రాల తెలుగు పిల్లల పేర్లు', s: 'నక్షత్ర పాదం & నామాక్షరం ప్రకారం అర్థవంతమైన పేర్లు' },
          { b: 'గౌరీ', t: 'గౌరీ పంచాంగం · తారాబలం · నిత్య సంకల్పం', s: 'ఇండియా & అమెరికా (EST/CST/PST) పూజా సంకల్పం' },
          { b: 'వాస్తు', t: 'గృహ వాస్తు చక్రం & 12 నెలల పండుగలు', s: 'ఏకాదశి, ప్రదోషం, పౌర్ణమి, కార్తీక మాస వ్రత క్యాలెండర్' },
        ]
      : [
          { b: '36', t: '36-Guna Ashtakoota Marriage Matching', s: 'Nadi, Bhakoot, Gana, Rajju & Kuja Dosha compatibility' },
          { b: '90', t: '90-Day Personal Muhurtham Scanner', s: 'Auspicious dates for Wedding, Griha Pravesh & Business' },
          { b: '27', t: '27 Nakshatra Telugu Baby Names', s: 'Meaningful names by Pada starting syllables & meanings' },
          { b: 'NRI', t: 'Gowri Panchangam · Tarabalam · Sankalpam', s: 'Instant Pooja Sankalpam for India & USA (EST/CST/PST)' },
          { b: 'VASTU', t: 'Home Vastu Chakra & Festival Calendar', s: 'Ekadashi, Pradosham, Pournami & Karthika Vrata dates' },
        ];

    tools.forEach((c, i) => {
      drawFeatureCard(ctx, 48, 362 + i * 122, W - 96, 104, c.t, c.s, c.b, (localT - 0.6 - i * 0.7) / 0.7, lang);
    });
  }

  // =========================================================================
  // SCENE 6 (01:30 - 01:45): POOJAS, HOMAS & PERSONAL GURUJI CONSULTATION
  // =========================================================================
  else if (sceneIdx === 6) {
    drawSceneLabel(
      ctx,
      '06 / 06',
      isTe ? 'వైదిక పూజలు, హోమాలు & వ్యక్తిగత సంప్రదింపు' : 'VEDIC POOJAS, HOMAS & CONSULTATION',
      150,
      localT / 0.7,
      lang
    );

    drawCircularPortrait(ctx, W / 2, 300, 88, portrait);

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 31px "Noto Serif Telugu", serif' : 'bold 28px Georgia, serif';
    drawCenteredText(
      ctx,
      isTe ? 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు' : 'Brahmasri Jallavaram Sai Dheeraj Sharma',
      W / 2,
      434,
      W - 70
    );

    ctx.fillStyle = '#F5C451';
    ctx.font = isTe ? 'bold 20px "Noto Serif Telugu", sans-serif' : 'bold 18px sans-serif';
    drawCenteredText(
      ctx,
      isTe ? 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · హైదరాబాద్ (India & NRI)' : 'Sri Lakshmi Ganapathi Jyothishalayam · Hyderabad (India & NRI)',
      W / 2,
      470,
      W - 70
    );

    const services = isTe
      ? [
          { b: 'ఓం', t: 'సంపూర్ణ జాతక పరిశీలన & వివాహ పొంతన', s: 'ఉద్యోగం, వ్యాపారం, విదేశీయానం, సంతానం & ఆరోగ్య మార్గదర్శనం' },
          { b: 'హో', t: 'గణపతి, చండీ, సుదర్శన & నవగ్రహ హోమాలు', s: 'శాస్త్రోక్త వేద మంత్రాలతో ప్రత్యక్ష & ఆన్‌లైన్ సంకల్ప పూజలు' },
          { b: 'రత్న', t: 'లగ్న రత్నం, రుద్రాక్ష & దోష పరిహారాలు', s: 'కుజ, కాలసర్ప, పితృ, ఏలినాటి శని దోషాలకు అసలైన పరిష్కారం' },
          { b: 'వాస్తు', t: 'గృహ & వ్యాపార వాస్తు సలహా + ముహూర్త నిర్ణయం', s: 'ఇండియా, USA, UK, కెనడా, ఆస్ట్రేలియా భక్తులకు ఫోన్/వీడియో కాల్' },
        ]
      : [
          { b: 'OM', t: 'In-Depth Horoscope & Marriage Analysis', s: 'Career, Business, Abroad Settlement, Progeny & Health' },
          { b: 'HOMA', t: 'Ganapathi, Chandi, Sudarshana & Navagraha', s: 'Authentic Vedic Homas in person & via Online Sankalpam' },
          { b: 'GEM', t: 'Gemstone, Rudraksha & Dosha Remedies', s: 'Shastra-backed remedies for Kuja, Kalasarpa & Sade Sati' },
          { b: 'NRI', t: 'Home & Office Vastu + Muhurtham Selection', s: 'Direct Phone / Video Consultation for India, USA, UK & AUS' },
        ];

    services.forEach((c, i) => {
      drawFeatureCard(ctx, 48, 512 + i * 124, W - 96, 106, c.t, c.s, c.b, (localT - 0.6 - i * 0.75) / 0.7, lang);
    });
  }

  // =========================================================================
  // SCENE 7 (01:45 - 02:00): STRONG SHARECHAT CTA FINALE
  // =========================================================================
  else {
    drawSceneLabel(
      ctx,
      isTe ? 'సర్వే జనాః సుఖినో భవంతు' : 'SARVE JANAH SUKHINO BHAVANTU',
      isTe ? 'ఇప్పుడే సందర్శించండి' : 'VISIT TODAY',
      152,
      localT / 0.7,
      lang
    );

    const glowScale = 1 + Math.sin(localT * 2.2) * 0.025;
    drawCircularPortrait(ctx, W / 2, 315, Math.round(105 * glowScale), portrait);

    ctx.fillStyle = '#FFFDF7';
    ctx.font = isTe ? 'bold 35px "Noto Serif Telugu", serif' : 'bold 32px Georgia, serif';
    drawWrappedCenteredText(
      ctx,
      isTe
        ? 'ఇప్పుడే Google లో సెర్చ్ చేయండి — ఉచితంగా మీ జాతకం & పంచాంగం చూడండి!'
        : 'Visit Our Website Today — Free Horoscope & Daily Panchangam!',
      W / 2,
      488,
      W - 84,
      48
    );

    roundRect(ctx, 56, 616, W - 112, 118, 22);
    ctx.fillStyle = '#F5C451';
    ctx.fill();
    ctx.strokeStyle = '#FFFDF7';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#2B0705';
    ctx.font = 'bold 33px Georgia, "Noto Serif Telugu", serif';
    drawCenteredText(ctx, 'www.telugujyothisham.com', W / 2, 668, W - 140);
    ctx.font = isTe ? 'bold 20px "Noto Serif Telugu", sans-serif' : 'bold 19px sans-serif';
    drawCenteredText(
      ctx,
      isTe ? 'Google సెర్చ్: "Telugu Jyothisham"' : 'Search on Google: "Telugu Jyothisham"',
      W / 2,
      708,
      W - 140
    );

    // Emerald WhatsApp CTA Box (#007a52 WCAG AA)
    roundRect(ctx, 56, 760, W - 112, 116, 22);
    ctx.fillStyle = '#007a52';
    ctx.fill();
    ctx.strokeStyle = '#A7F3D0';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = isTe ? 'bold 22px "Noto Serif Telugu", sans-serif' : 'bold 20px sans-serif';
    drawCenteredText(
      ctx,
      isTe ? 'వ్యక్తిగత జాతక & పూజా సంప్రదింపు (WhatsApp / Call)' : 'Personal Horoscope & Pooja Consultation (WhatsApp)',
      W / 2,
      804,
      W - 140
    );
    ctx.font = 'bold 34px Georgia, sans-serif';
    drawCenteredText(ctx, '+91 89779 86166', W / 2, 852, W - 140);

    const scPulse = easeInOutQuad((Math.sin(localT * 3) + 1) / 2);
    roundRect(ctx, 56, 906, W - 112, 165, 22);
    ctx.fillStyle = `rgba(250, 245, 234, ${(0.94 + scPulse * 0.06).toFixed(2)})`;
    ctx.fill();
    ctx.strokeStyle = '#C99634';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#5A1408';
    ctx.font = isTe ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 23px Georgia, serif';
    drawCenteredText(
      ctx,
      isTe ? 'ShareChat లో ఫాలో అవ్వండి · షేర్ చేయండి!' : 'Follow on ShareChat & Share with Family!',
      W / 2,
      956,
      W - 140
    );

    ctx.fillStyle = '#1C1917';
    ctx.font = isTe ? 'bold 20px "Noto Serif Telugu", sans-serif' : 'bold 18px sans-serif';
    drawCenteredText(
      ctx,
      isTe ? 'మీ కుటుంబ సభ్యులకు & మిత్రులకు తప్పక షేర్ చేయండి' : 'Daily Panchangam, Rashi Phalalu & Vedic Wisdom',
      W / 2,
      998,
      W - 140
    );

    ctx.fillStyle = '#8B2611';
    ctx.font = isTe ? 'bold 19px "Noto Serif Telugu", serif' : 'bold 17px Georgia, serif';
    drawCenteredText(
      ctx,
      isTe ? 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం · హైదరాబాద్' : 'Sri Lakshmi Ganapathi Jyothishalayam · Hyderabad',
      W / 2,
      1042,
      W - 140
    );
  }

  ctx.restore();
}

/**
 * Generates a soothing 120-second Indian classical devotional instrumental WAV
 * (Tanpura Sa-Pa drone + Raga Hamsadhwani plucked melody + Temple Bell at each 15s transition).
 */
function generateDevotionalSoundtrackWav(outWavPath: string) {
  const sampleRate = 22050;
  const totalSamples = sampleRate * DURATION_SEC;
  const pcm = new Int16Array(totalSamples);

  const scale = [261.63, 293.66, 329.63, 392.0, 493.88, 523.25, 587.33, 659.25];
  const melodyPattern = [0, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 6, 5, 4, 3, 0, 1, 2, 3, 2, 1, 0, 3, 2];
  const noteDurSec = 1.25;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    const droneEnv = 0.78 + 0.22 * Math.sin(2 * Math.PI * 0.25 * t);
    const tanpura =
      (Math.sin(2 * Math.PI * 130.81 * t) * 0.48 +
        Math.sin(2 * Math.PI * 196.0 * t) * 0.26 +
        Math.sin(2 * Math.PI * 261.63 * t) * 0.16 +
        Math.sin(2 * Math.PI * 392.0 * t) * 0.08) *
      0.18 *
      droneEnv;

    const stepIdx = Math.floor(t / noteDurSec);
    const localNoteT = t - stepIdx * noteDurSec;
    const freq = scale[melodyPattern[stepIdx % melodyPattern.length]];
    const attack = Math.min(1, localNoteT / 0.09);
    const decay = Math.exp(-localNoteT * 2.1);
    const vibrato = 1 + 0.003 * Math.sin(2 * Math.PI * 4.5 * t);
    const melody =
      (Math.sin(2 * Math.PI * freq * vibrato * t) * 0.72 +
        Math.sin(2 * Math.PI * freq * 2 * vibrato * t) * 0.2 +
        Math.sin(2 * Math.PI * freq * 3 * vibrato * t) * 0.06) *
      attack *
      decay *
      0.22;

    const sceneLocalT = t % SCENE_DUR_SEC;
    let bell = 0;
    if (sceneLocalT < 4.0) {
      const bAttack = Math.min(1, sceneLocalT / 0.012);
      const bDecay = Math.exp(-sceneLocalT * 1.25);
      bell =
        (Math.sin(2 * Math.PI * 523.25 * sceneLocalT) * 0.52 +
          Math.sin(2 * Math.PI * 1046.5 * sceneLocalT) * 0.25 +
          Math.sin(2 * Math.PI * 1567.98 * sceneLocalT) * 0.15 +
          Math.sin(2 * Math.PI * 2093.0 * sceneLocalT) * 0.08) *
        bAttack *
        bDecay *
        0.25;
    }

    const masterFade = Math.min(1, t / 1.2, Math.max(0, (DURATION_SEC - t) / 2.5));
    const sample = clamp((tanpura + melody + bell) * masterFade, -0.95, 0.95);
    pcm[i] = Math.round(sample * 32767);
  }

  const dataBytes = pcm.length * 2;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataBytes, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataBytes, 40);

  fs.writeFileSync(outWavPath, Buffer.concat([header, Buffer.from(pcm.buffer)]));
}

function getAudioDurationSec(filePath: string): number {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filePath],
    { encoding: 'utf8' }
  ).trim();
  const parsed = parseFloat(out);
  return Number.isFinite(parsed) ? parsed : 10;
}

/**
 * Synthesizes one natural human-sounding Neural AI voice clip via Microsoft Edge Neural TTS
 * with automatic retry for rock-solid reliability.
 */
async function synthesizeNeuralVoiceClip(
  text: string,
  voiceName: string,
  rate: string,
  outMp3Path: string
): Promise<number> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(text, { rate });
      const chunks: Buffer[] = [];
      for await (const c of audioStream) {
        chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
      }
      const buf = Buffer.concat(chunks);
      if (buf.length < 1000) {
        throw new Error(`Synthesized audio too small (${buf.length} bytes)`);
      }
      fs.writeFileSync(outMp3Path, buf);
      return getAudioDurationSec(outMp3Path);
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
  throw lastErr;
}

/**
 * Builds the final 120.0s studio mixed soundtrack:
 * - Synthesizes all 8 chapter human AI voiceover clips
 * - Places each clip cleanly at its exact 15s chapter start (+0.75s)
 * - Gently fits any clip > 13.6s with natural atempo so zero overlap ever happens
 * - Blends crisp normalized voiceover over soft ducked Raga Hamsadhwani background music
 */
async function buildMasterAudioTrack(
  lang: PromoLanguage,
  musicWavPath: string,
  workDir: string
): Promise<string> {
  const voiceName = lang === 'te' ? 'te-IN-MohanNeural' : 'en-IN-PrabhatNeural';
  const rate = lang === 'te' ? '-3%' : '-2%';

  console.log(`🎙️  Synthesizing 8-chapter natural human AI voiceover (${voiceName})...`);
  const clipPaths: string[] = [];
  const clipDelaysMs: number[] = [];
  const clipTempos: number[] = [];

  for (const ch of SHARECHAT_PROMO_CHAPTERS) {
    const script = lang === 'te' ? ch.scriptTe : ch.scriptEn;
    const mp3Path = path.join(workDir, `voice_${lang}_ch${ch.index}.mp3`);
    const dur = await synthesizeNeuralVoiceClip(script, voiceName, rate, mp3Path);

    // Ensure clip fits comfortably inside 13.6s of the 15s window (with 0.7s lead-in & 0.7s breathing room)
    const maxSlotSec = 13.6;
    const tempo = dur > maxSlotSec ? Math.min(1.22, Number((dur / maxSlotSec).toFixed(3))) : 1.0;
    const effectiveDur = dur / tempo;
    const startOffsetMs = Math.round(ch.startSec * 1000 + 700);

    clipPaths.push(mp3Path);
    clipDelaysMs.push(startOffsetMs);
    clipTempos.push(tempo);
    console.log(
      `   [Ch ${ch.index + 1}/8 @ ${ch.timestampLabel}] raw=${dur.toFixed(2)}s, tempo=${tempo}x -> fit=${effectiveDur.toFixed(2)}s`
    );
  }

  const masterAudioPath = path.join(workDir, `master_audio_${lang}.m4a`);
  const ffArgs: string[] = ['-y', '-i', musicWavPath];
  for (const cp of clipPaths) {
    ffArgs.push('-i', cp);
  }

  // Filtergraph:
  // [0:a] soft ducked devotional music bed (0.14 volume so every syllable of human voice is crystal clear)
  // [1:a]..[8:a] each voiceover clip cleaned with highpass=80, optional atempo, delayed to exact scene slot
  const filters: string[] = [];
  filters.push(`[0:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.14[bgm]`);

  const voiceLabels: string[] = [];
  clipPaths.forEach((_, idx) => {
    const inIdx = idx + 1;
    const delayMs = clipDelaysMs[idx];
    const tempo = clipTempos[idx];
    const tempoFilter = tempo > 1.001 ? `atempo=${tempo},` : '';
    const vLbl = `v${idx}`;
    filters.push(
      `[${inIdx}:a]aformat=sample_rates=44100:channel_layouts=stereo,highpass=f=80,${tempoFilter}volume=1.35,adelay=${delayMs}|${delayMs}[${vLbl}]`
    );
    voiceLabels.push(`[${vLbl}]`);
  });

  // Combine all 8 non-overlapping voice clips without attenuation (normalize=0), then clean vocal presence
  filters.push(
    `${voiceLabels.join('')}amix=inputs=${voiceLabels.length}:duration=longest:dropout_transition=0:normalize=0,dynaudnorm=f=150:g=15:p=0.92[voice_bus]`
  );
  // Mix voice bus + ducked devotional music bed cleanly to exact 120.0s
  filters.push(
    `[bgm][voice_bus]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.96,atrim=0:${DURATION_SEC}[outa]`
  );

  ffArgs.push(
    '-filter_complex',
    filters.join(';'),
    '-map',
    '[outa]',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    '-ar',
    '44100',
    '-ac',
    '2',
    masterAudioPath
  );

  execFileSync('ffmpeg', ffArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
  console.log(`✅ Master studio audio ready (${lang.toUpperCase()}): ${getAudioDurationSec(masterAudioPath).toFixed(2)}s`);
  return masterAudioPath;
}

async function renderLanguageVideo(
  lang: PromoLanguage,
  snap: LivePanchangamSheetSnapshot,
  musicWavPath: string,
  workDir: string,
  portrait?: CanvasImage
) {
  const outRelPath = `public/assets/videos/telugujyothisham-sharechat-promo-2min-${lang}.mp4`;
  const outAbsPath = path.resolve(process.cwd(), outRelPath);
  fs.mkdirSync(path.dirname(outAbsPath), { recursive: true });

  const masterAudioPath = await buildMasterAudioTrack(lang, musicWavPath, workDir);

  console.log(`🎬 Rendering ${lang.toUpperCase()} video (${TOTAL_FRAMES} frames, ${W}x${H} @ ${FPS}fps = 02:00)...`);

  const ffmpegArgs = [
    '-y',
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-pix_fmt', 'rgba',
    '-s', `${W}x${H}`,
    '-r', String(FPS),
    '-i', 'pipe:0',
    '-i', masterAudioPath,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'copy',
    '-shortest',
    '-movflags', '+faststart',
    outAbsPath,
  ];

  const ff = spawn('ffmpeg', ffmpegArgs, { stdio: ['pipe', 'ignore', 'pipe'] });
  let stderrTail = '';
  ff.stderr.on('data', (chunk: Buffer) => {
    stderrTail = (stderrTail + chunk.toString()).slice(-1200);
  });

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    drawFrame(ctx, f, snap, lang, portrait);
    const rawBuf = Buffer.from(ctx.getImageData(0, 0, W, H).data.buffer);
    if (!ff.stdin.write(rawBuf)) {
      await new Promise<void>((resolve) => ff.stdin.once('drain', resolve));
    }
    if (f > 0 && f % 600 === 0) {
      console.log(`   [${lang.toUpperCase()}] ${f}/${TOTAL_FRAMES} frames (${Math.round((f / TOTAL_FRAMES) * 100)}%)`);
    }
  }
  ff.stdin.end();

  await new Promise<void>((resolve, reject) => {
    ff.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderrTail}`));
    });
  });

  const stats = fs.statSync(outAbsPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  const finalDur = getAudioDurationSec(outAbsPath);
  console.log(`✅ ${lang.toUpperCase()} ShareChat 2-Min HD Video Ready: ${outRelPath} (${sizeMb} MB, ${finalDur.toFixed(2)}s)`);
}

async function main() {
  registerFonts();
  const arg = (process.argv[2] || '').toLowerCase();
  const langs: PromoLanguage[] = arg === 'te' ? ['te'] : arg === 'en' ? ['en'] : ['te', 'en'];

  const { day } = getTodayISTData();
  const snap = computeLivePanchangamSheet(day);

  let portrait: CanvasImage | undefined;
  const portraitPath = path.resolve(
    process.cwd(),
    'public/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg'
  );
  if (fs.existsSync(portraitPath)) {
    portrait = await loadImage(portraitPath);
  }

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tj-sharechat-promo-'));
  try {
    const musicWavPath = path.join(workDir, 'devotional_bed.wav');
    console.log('🎵 Synthesizing 120s Raga Hamsadhwani + Temple Bell devotional bed...');
    generateDevotionalSoundtrackWav(musicWavPath);

    for (const lang of langs) {
      await renderLanguageVideo(lang, snap, musicWavPath, workDir, portrait);
    }
  } finally {
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((err) => {
  console.error('❌ Video generation failed:', err);
  process.exit(1);
});
