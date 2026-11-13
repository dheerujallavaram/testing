import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createCanvas, GlobalFonts, SKRSContext2D } from '@napi-rs/canvas';
import { WEEK_DATA } from '../src/data/panchangamData';
import { getOrGenerateDayData } from '../src/utils/astronomyPanchangam';
import { getTodayIsoDateIST, computeCityLocalPanchangam } from '../src/seo/panchangamSsrEngine';
import { translatePanchangamString } from '../src/context/LanguageContext';

const WIDTH = 1080;
const HEIGHT = 1920;

function registerAvailableFonts() {
  const candidates = [
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
        GlobalFonts.registerFromPath(fp);
      } catch {
        // Ignore font registration error
      }
    }
  }
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
  const maxW = Math.max(40, boxW - pad * 2);
  const measured = Math.min(ctx.measureText(text).width, maxW);
  const startX = boxX + Math.max(pad, (boxW - measured) / 2);
  ctx.fillText(text, startX, y, maxW);
}

function drawWrapped(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 5
) {
  ctx.textAlign = 'left';
  const words = text.trim().split(/\s+/);
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
        ctx.fillText(rest.length > 72 ? `${rest.slice(0, 69)}...` : rest, x, curY, maxWidth);
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

function renderCliFrame(
  ctx: SKRSContext2D,
  isoDate: string,
  lang: 'te' | 'en',
  citySlug: 'hyderabad' | 'vijayawada' | 'visakhapatnam' | 'tirupati',
  progress: number
) {
  const dayData = getOrGenerateDayData(isoDate, WEEK_DATA);
  const cityPanchangam = computeCityLocalPanchangam(isoDate, citySlug);
  const tr = (v: string) => (lang === 'en' ? translatePanchangamString(v, 'en') : v);
  const scene = progress < 0.36 ? 1 : progress < 0.70 ? 2 : 3;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#2a0702');
  bg.addColorStop(0.28, '#5c1808');
  bg.addColorStop(0.65, '#3d1005');
  bg.addColorStop(1, '#1e0502');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle rotating Mandala
  ctx.save();
  ctx.translate(WIDTH / 2, 760);
  ctx.rotate(progress * Math.PI * 0.55);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.14)';
  ctx.lineWidth = 3;
  for (const r of [180, 360, 540]) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Golden border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 28, 28, WIDTH - 56, HEIGHT - 56, 36);
  ctx.stroke();

  // Top Header
  drawRoundedRect(ctx, 76, 86, 134, 134, 28);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#3b1103';
  ctx.font = 'bold 64px serif';
  drawCentered(ctx, 'ॐ', 76, 134, 172, 10);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 26px "Noto Serif Telugu", sans-serif';
  ctx.fillText(
    lang === 'en' ? 'OM SRI LAKSHMI GANAPATAYE NAMAHA' : 'ఓం శ్రీలక్ష్మి గణపతయే నమః',
    236,
    122,
    760
  );
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en' ? 'Sri Lakshmi Ganapathi Jyothishalayam' : 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    236,
    176,
    760
  );
  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
  ctx.fillText(
    lang === 'en'
      ? `Brahmasri Jallavaram Sai Dheeraj Sharma • ${cityPanchangam.city.nameEn}`
      : `బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు • ${cityPanchangam.city.nameTe}`,
    236,
    218,
    760
  );

  // Date pill
  drawRoundedRect(ctx, 76, 260, WIDTH - 152, 86, 43);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 34px "Noto Serif Telugu", sans-serif';
  drawCentered(
    ctx,
    `📅 ${tr(dayData.teediVaram)} • ${isoDate}`,
    76,
    WIDTH - 152,
    315,
    24
  );

  if (scene === 1) {
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 46px "Noto Serif Telugu", serif';
    drawCentered(
      ctx,
      lang === 'en' ? "TODAY'S TELUGU PANCHANGAM" : 'నేటి దృక్సిద్ధాంత పంచాంగం',
      76,
      WIDTH - 152,
      435,
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

    let ry = 490;
    for (const row of rows) {
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
      ctx.font = 'bold 38px "Noto Serif Telugu", serif';
      ctx.fillText(row.v, 112, ry + 118, WIDTH - 224);
      ry += 188;
    }
  } else if (scene === 2) {
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 44px "Noto Serif Telugu", serif';
    drawCentered(
      ctx,
      lang === 'en' ? 'AUSPICIOUS & CAUTION TIMINGS' : 'నేటి శుభ & అశుభ సమయాలు',
      76,
      WIDTH - 152,
      435,
      20
    );

    drawRoundedRect(ctx, 76, 490, WIDTH - 152, 480, 32);
    ctx.fillStyle = '#ecfdf5';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 38px "Noto Serif Telugu", serif';
    ctx.fillText(
      lang === 'en' ? 'SHUBHA MUHURTHAM' : 'శుభ సమయాలు (మంచి ఘడియలు)',
      116,
      565,
      WIDTH - 232
    );

    const good = [
      { k: lang === 'en' ? 'Abhijit Muhurtham' : 'అభిజిత్ ముహూర్తం', v: tr(cityPanchangam.abhijitMuhurtham) },
      { k: lang === 'en' ? 'Amrutha Gadiyalu' : 'అమృత ఘడియలు', v: tr(cityPanchangam.amruthaGadiyalu) },
      { k: lang === 'en' ? 'Moon Transit (Chandra)' : 'నేటి చంద్ర సంచారం', v: tr(dayData.chandra.sancharam) },
    ];
    let gy = 635;
    for (const item of good) {
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 28px "Noto Serif Telugu", sans-serif';
      ctx.fillText(item.k, 116, gy, WIDTH - 232);
      ctx.fillStyle = '#022c22';
      ctx.font = 'bold 38px "Noto Serif Telugu", serif';
      ctx.fillText(item.v, 116, gy + 50, WIDTH - 232);
      gy += 112;
    }

    drawRoundedRect(ctx, 76, 1015, WIDTH - 152, 595, 32);
    ctx.fillStyle = '#fff1f2';
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#9f1239';
    ctx.font = 'bold 38px "Noto Serif Telugu", serif';
    ctx.fillText(
      lang === 'en' ? 'AVOID ASHUBHA TIMINGS' : 'వర్జించవలసిన అశుభ సమయాలు',
      116,
      1090,
      WIDTH - 232
    );

    const bad = [
      { k: lang === 'en' ? 'Rahu Kalam' : 'రాహుకాలం', v: tr(cityPanchangam.rahukalam) },
      { k: lang === 'en' ? 'Yamagandam' : 'యమగండం', v: tr(cityPanchangam.yamagandam) },
      { k: lang === 'en' ? 'Varjyam' : 'వర్జ్యం', v: tr(cityPanchangam.varjyam) },
      { k: lang === 'en' ? 'Durmuhurtham' : 'దుర్ముహూర్తం', v: tr(cityPanchangam.durmuhurtham) },
    ];
    let by = 1165;
    for (const item of bad) {
      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 28px "Noto Serif Telugu", sans-serif';
      ctx.fillText(item.k, 116, by, WIDTH - 232);
      ctx.fillStyle = '#4c0519';
      ctx.font = 'bold 36px "Noto Serif Telugu", serif';
      ctx.fillText(item.v, 116, by + 46, WIDTH - 232);
      by += 112;
    }
  } else {
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 44px "Noto Serif Telugu", serif';
    drawCentered(
      ctx,
      lang === 'en' ? 'DAILY SPIRITUAL GUIDANCE' : 'నేటి దిన విశేషం & శుభ సందేశం',
      76,
      WIDTH - 152,
      435,
      20
    );

    drawRoundedRect(ctx, 76, 495, WIDTH - 152, 540, 32);
    ctx.fillStyle = '#fffbeb';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#9a3412';
    ctx.font = 'bold 34px "Noto Serif Telugu", serif';
    ctx.fillText(tr(dayData.specialEvent || dayData.deity), 116, 565, WIDTH - 232);
    ctx.fillStyle = '#290f02';
    ctx.font = '34px "Noto Serif Telugu", serif';
    drawWrapped(ctx, tr(dayData.phalitham), 116, 645, WIDTH - 232, 54, 6);

    drawRoundedRect(ctx, 76, 1075, WIDTH - 152, 310, 30);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 30px "Noto Serif Telugu", sans-serif';
    ctx.fillText(
      lang === 'en'
        ? `Lucky Color: ${tr(dayData.luckyColor)}`
        : `నేటి శుభ రంగు: ${tr(dayData.luckyColor)}`,
      116,
      1145,
      WIDTH - 232
    );
    ctx.fillStyle = '#9a3412';
    ctx.font = 'bold 30px "Noto Serif Telugu", serif';
    drawWrapped(
      ctx,
      `${lang === 'en' ? 'Chandrashtamam: ' : 'చంద్రాష్టమం / దైవం: '}${tr(dayData.chandra.chandrashtamam)} • ${tr(dayData.deity)}`,
      116,
      1215,
      WIDTH - 232,
      46,
      3
    );

    drawRoundedRect(ctx, 96, 1435, WIDTH - 192, 165, 34);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.fillStyle = '#2a0702';
    ctx.font = 'bold 36px "Noto Serif Telugu", serif';
    drawCentered(
      ctx,
      lang === 'en' ? '12 Rashi Phalalu & Free Janma Kundali' : '12 రాశి ఫలాలు & ఉచిత జాతకం కోసం',
      96,
      WIDTH - 192,
      1505,
      20
    );
    ctx.font = 'bold 42px sans-serif';
    drawCentered(ctx, 'www.telugujyothisham.com', 96, WIDTH - 192, 1565, 20);
  }

  // Progress bar + Footer
  const barW = WIDTH - 152;
  drawRoundedRect(ctx, 76, 1675, barW, 12, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fill();
  drawRoundedRect(ctx, 76, 1675, Math.max(24, barW * progress), 12, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 30px sans-serif';
  drawCentered(ctx, 'www.telugujyothisham.com • +91 89779 86166', 76, WIDTH - 152, 1760, 20);
}

function parseArg(name: string, fallback: string): string {
  const match = process.argv.find((a) => a.startsWith(`--${name}=`));
  return match ? match.split('=')[1] : fallback;
}

export async function main() {
  registerAvailableFonts();
  const isoDate = parseArg('date', getTodayIsoDateIST());
  const lang = (parseArg('lang', 'te') === 'en' ? 'en' : 'te') as 'te' | 'en';
  const citySlug = (parseArg('city', 'hyderabad') || 'hyderabad') as
    | 'hyderabad'
    | 'vijayawada'
    | 'visakhapatnam'
    | 'tirupati';
  const fps = Math.max(10, Math.min(30, parseInt(parseArg('fps', '20'), 10) || 20));
  const durationSec = Math.max(6, Math.min(30, parseInt(parseArg('duration', '12'), 10) || 12));
  const totalFrames = fps * durationSec;

  const outDir = path.resolve(process.cwd(), 'output');
  const tmpFramesDir = path.join(outDir, `.frames-${isoDate}-${lang}`);
  fs.mkdirSync(tmpFramesDir, { recursive: true });

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  console.log(`🎬 Rendering ${totalFrames} frames (9:16 ${WIDTH}x${HEIGHT} @ ${fps}fps) for ${isoDate} (${lang})...`);
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / Math.max(1, totalFrames - 1);
    renderCliFrame(ctx, isoDate, lang, citySlug, progress);
    const framePath = path.join(tmpFramesDir, `frame-${String(i).padStart(4, '0')}.png`);
    fs.writeFileSync(framePath, canvas.toBuffer('image/png'));
  }

  const mp4Path = path.join(outDir, `daily-reel-${isoDate}-${lang}.mp4`);
  const latestPath = path.join(outDir, `daily-reel-latest-${lang}.mp4`);

  // Synthesize gentle ambient tanpura chord directly via ffmpeg sine audio filter + encode H.264 MP4
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-framerate',
      String(fps),
      '-i',
      path.join(tmpFramesDir, 'frame-%04d.png'),
      '-f',
      'lavfi',
      '-t',
      String(durationSec),
      '-i',
      'aevalsrc=0.04*sin(2*PI*138.59*t)+0.03*sin(2*PI*207.65*t)+0.02*sin(2*PI*277.18*t):s=44100:c=stereo',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-r',
      '30',
      '-preset',
      'veryfast',
      '-crf',
      '22',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-shortest',
      '-movflags',
      '+faststart',
      mp4Path,
    ],
    { stdio: 'inherit' }
  );

  fs.copyFileSync(mp4Path, latestPath);
  fs.rmSync(tmpFramesDir, { recursive: true, force: true });

  // Also write ready-to-upload caption + hashtags file
  const dayData = getOrGenerateDayData(isoDate, WEEK_DATA);
  const captionPath = path.join(outDir, `daily-reel-${isoDate}-${lang}-caption.txt`);
  const captionText = [
    `📅 ${dayData.teediVaram} (${isoDate}) | నేటి తెలుగు పంచాంగం & శుభ సమయాలు`,
    ``,
    `🌙 తిథి: ${dayData.panchanga.tithi}`,
    `⭐ నక్షత్రం: ${dayData.panchanga.nakshatram}`,
    `✅ అభిజిత్ ముహూర్తం: ${dayData.shubha.abhijit}`,
    `✅ అమృత ఘడియలు: ${dayData.shubha.amrutha}`,
    `⚠️ రాహుకాలం: ${dayData.ashubha.rahukalam}`,
    ``,
    `🔮 మీ 12 రాశి ఫలాలు & ఉచిత 37-అధ్యాయాల జన్మ కుండలి PDF కోసం:`,
    `🌐 https://www.telugujyothisham.com/panchangam/${isoDate}`,
    ``,
    `#TeluguPanchangam #NetiPanchangam #RashiPhalalu #TeluguAstrology #DailyPanchangam #BhaktiShorts #TeluguShorts #Rahukalam`,
  ].join('\n');
  fs.writeFileSync(captionPath, captionText, 'utf-8');

  console.log(`✅ Video saved: ${mp4Path}`);
  console.log(`✅ Latest copy: ${latestPath}`);
  console.log(`✅ Caption & hashtags: ${captionPath}`);
}

if (process.argv[1]?.includes('generateDailyPanchangamReel')) {
  main().catch((err) => {
    console.error('❌ Failed to generate daily Reel:', err);
    process.exit(1);
  });
}
