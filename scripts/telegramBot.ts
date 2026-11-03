import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts, SKRSContext2D } from '@napi-rs/canvas';
import { getOrGenerateDayData } from '../src/utils/astronomyPanchangam';
import { getDailyRashiFortunes, RashiDailyFortune } from '../src/utils/panchangaLogic';
import { DayData } from '../src/types/panchangam';
import { translatePanchangamString } from '../src/context/LanguageContext';
import { WEEK_DATA } from '../src/data/panchangamData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Noto Serif Telugu font for crisp Telugu ligature shaping in Node.js
const fontPath = path.join(__dirname, 'fonts', 'NotoSerifTelugu.ttf');
if (fs.existsSync(fontPath)) {
  GlobalFonts.registerFromPath(fontPath, 'Noto Serif Telugu');
}

const DEFAULT_BOT_TOKEN = '9209965871:AAEa0mqf-gCfYFmKnGop1g4Ns6X5EosGdXY';
export const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
const SUBSCRIBERS_FILE = path.join(__dirname, '.telegram_subscribers.json');

const RASHI_COMMANDS: Record<string, string> = {
  mesham: 'మేషం (Aries)',
  vrushabham: 'వృషభం (Taurus)',
  mithunam: 'మిథునం (Gemini)',
  karkatakam: 'కర్కాటకం (Cancer)',
  simham: 'సింహం (Leo)',
  kanya: 'కన్య (Virgo)',
  tula: 'తుల (Libra)',
  vruschikam: 'వృశ్చికం (Scorpio)',
  dhanussu: 'ధనుస్సు (Sagittarius)',
  makaram: 'మకరం (Capricorn)',
  kumbham: 'కుంభం (Aquarius)',
  meenam: 'మీనం (Pisces)',
};

/**
 * Strip emojis that may not exist in Noto Serif Telugu on headless Linux servers
 */
function cleanServerText(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Gets current IST Date object (UTC + 5:30)
 */
export function getTodayISTDate(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 3600000);
}

export function getTodayISTData(): { day: DayData; fortunes: RashiDailyFortune[] } {
  const istNow = getTodayISTDate();
  const yyyy = istNow.getFullYear();
  const mm = String(istNow.getMonth() + 1).padStart(2, '0');
  const dd = String(istNow.getDate()).padStart(2, '0');
  const isoDate = `${yyyy}-${mm}-${dd}`;
  const day = getOrGenerateDayData(isoDate, WEEK_DATA);
  const fortunes = getDailyRashiFortunes(day);
  return { day, fortunes };
}

function drawRoundedRect(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawMeasuredCenteredText(
  ctx: SKRSContext2D,
  text: string,
  boxX: number,
  boxWidth: number,
  y: number,
  padding = 20
) {
  ctx.textAlign = 'left';
  const maxAllowedWidth = boxWidth - padding * 2;
  const measuredWidth = Math.min(ctx.measureText(text).width, maxAllowedWidth);
  const startX = boxX + Math.max(padding, (boxWidth - measuredWidth) / 2);
  ctx.fillText(text, startX, y, maxAllowedWidth);
}

function wrapCanvasText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  ctx.textAlign = 'left';
  const words = cleanServerText(text).split(/\s+/);
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY, maxWidth);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1) {
        const remaining = words.slice(n).join(' ');
        ctx.fillText(
          remaining.length > 68 ? remaining.slice(0, 65) + '...' : remaining,
          x,
          currentY,
          maxWidth
        );
        return currentY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY, maxWidth);
    currentY += lineHeight;
  }
  return currentY;
}

function drawLeftAlignedTempleHeader(
  ctx: SKRSContext2D,
  subtitleText: string,
  lang: 'te' | 'en' = 'te'
) {
  ctx.textAlign = 'left';

  // Sacred Golden Emblem Badge on the Left
  drawRoundedRect(ctx, 60, 58, 122, 142, 22);
  const emblemGrad = ctx.createLinearGradient(60, 58, 182, 200);
  emblemGrad.addColorStop(0, '#fbbf24');
  emblemGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = emblemGrad;
  ctx.fill();
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#3b1103';
  ctx.font = 'bold 42px "Noto Serif Telugu", serif';
  drawMeasuredCenteredText(ctx, 'ఓం', 60, 122, 125, 10);

  ctx.fillStyle = '#451a03';
  ctx.font = lang === 'en' ? 'bold 22px "Noto Serif Telugu", serif' : 'bold 24px "Noto Serif Telugu", serif';
  drawMeasuredCenteredText(ctx, lang === 'en' ? 'Shubham' : 'శుభం', 60, 122, 174, 10);

  const headerX = 204;
  const maxHeaderWidth = 816;

  ctx.fillStyle = '#fde68a';
  ctx.font = lang === 'en' ? 'bold 24px "Noto Serif Telugu", serif' : 'bold 25px "Noto Serif Telugu", serif';
  ctx.fillText(subtitleText, headerX, 90, maxHeaderWidth);

  ctx.fillStyle = '#ffffff';
  ctx.font = lang === 'en' ? 'bold 42px "Noto Serif Telugu", serif' : 'bold 46px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en' ? 'Sri Lakshmi Ganapathi Jyothishalayam' : 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    headerX,
    148,
    maxHeaderWidth
  );

  ctx.fillStyle = '#fcd34d';
  ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 25px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? 'Brahmasri Jallavaram Sai Dheeraj Sharma (Vedic Astrologer)'
      : 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (వేద జ్యోతిష నిపుణులు)',
    headerX,
    192,
    maxHeaderWidth
  );
}

/**
 * Renders 1080x1440 Daily Panchangam PNG Buffer in Node.js (Telugu or English)
 */
export function renderDailyPanchangamPngBuffer(day: DayData, lang: 'te' | 'en' = 'te'): Buffer {
  const canvas = createCanvas(1080, 1440);
  const ctx = canvas.getContext('2d');
  ctx.textAlign = 'left';

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
  bgGrad.addColorStop(0, '#451a03');
  bgGrad.addColorStop(0.18, '#78350f');
  bgGrad.addColorStop(0.185, '#fffbeb');
  bgGrad.addColorStop(0.88, '#fef3c7');
  bgGrad.addColorStop(0.885, '#451a03');
  bgGrad.addColorStop(1, '#290f02');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1440);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, 24, 24, 1032, 1392, 28);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 36, 36, 1008, 1368, 22);
  ctx.stroke();

  const headerSubtitle =
    lang === 'en'
      ? 'Om Sri Lakshmi Ganapataye Namaha • Drik Siddhanta Daily Panchangam'
      : 'ఓం శ్రీలక్ష్మి గణపతయే నమః • దృక్సిద్ధాంత నిత్య పంచాంగం';
  drawLeftAlignedTempleHeader(ctx, headerSubtitle, lang);

  drawRoundedRect(ctx, 64, 222, 952, 72, 36);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#3b1103';
  ctx.font = lang === 'en' ? 'bold 28px "Noto Serif Telugu", serif' : 'bold 30px "Noto Serif Telugu", serif';
  const datePillText =
    lang === 'en'
      ? `Date: ${cleanServerText(translatePanchangamString(day.teediVaram, 'en'))}  •  ${cleanServerText(translatePanchangamString(day.panchanga.samvatsaram, 'en'))}`
      : `తేదీ: ${cleanServerText(day.teediVaram)}  •  ${cleanServerText(day.panchanga.samvatsaram)}`;
  ctx.fillText(datePillText, 96, 269, 890);

  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 27px "Noto Serif Telugu", serif';
  const masamBarText =
    lang === 'en'
      ? `Month: ${cleanServerText(translatePanchangamString(day.panchanga.masam, 'en'))}   •   Deity: ${cleanServerText(translatePanchangamString(day.deity, 'en'))}`
      : `మాసం: ${cleanServerText(day.panchanga.masam)}   •   ఆరాధ్య దైవం: ${cleanServerText(day.deity)}`;
  ctx.fillText(masamBarText, 72, 342, 936);

  drawRoundedRect(ctx, 64, 372, 952, 364, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.stroke();

  const limbs =
    lang === 'en'
      ? [
          { label: '• Tithi:', value: cleanServerText(translatePanchangamString(day.panchanga.tithi, 'en')) },
          { label: '• Nakshatram:', value: cleanServerText(translatePanchangamString(day.panchanga.nakshatram, 'en')) },
          {
            label: '• Yogam & Karanam:',
            value: `${cleanServerText(translatePanchangamString(day.panchanga.yogam, 'en'))}  |  ${cleanServerText(translatePanchangamString(day.panchanga.karanam, 'en'))}`,
          },
          { label: '• Sunrise / Sunset:', value: '06:15 AM  /  05:52 PM IST' },
          {
            label: '• Deity & Lucky Color:',
            value: `${cleanServerText(translatePanchangamString(day.deity, 'en'))}  |  ${cleanServerText(translatePanchangamString(day.luckyColor, 'en'))}`,
          },
        ]
      : [
          { label: '• తిథి:', value: cleanServerText(day.panchanga.tithi) },
          { label: '• నక్షత్రం:', value: cleanServerText(day.panchanga.nakshatram) },
          { label: '• యోగం & కరణం:', value: `${cleanServerText(day.panchanga.yogam)}  |  ${cleanServerText(day.panchanga.karanam)}` },
          { label: '• సూర్యోదయం / అస్తమయం:', value: 'ఉదయం 06:15 AM  /  సాయంత్రం 05:52 PM' },
          { label: '• ఆరాధ్య దైవం & శుభ రంగు:', value: `${cleanServerText(day.deity)}  |  ${cleanServerText(day.luckyColor)}` },
        ];

  let rowY = 430;
  limbs.forEach((item, idx) => {
    ctx.fillStyle = '#92400e';
    ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 24px "Noto Serif Telugu", serif';
    ctx.fillText(item.label, 92, rowY);

    ctx.fillStyle = '#1e293b';
    ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 24px "Noto Serif Telugu", serif';
    const maxValWidth = 560;
    const displayVal = item.value.length > 50 ? item.value.slice(0, 48) + '...' : item.value;
    ctx.fillText(displayVal, 425, rowY, maxValWidth);

    if (idx < limbs.length - 1) {
      ctx.beginPath();
      ctx.moveTo(92, rowY + 20);
      ctx.lineTo(988, rowY + 20);
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    rowY += 66;
  });

  // Left: Shubha Samayalu
  drawRoundedRect(ctx, 64, 760, 460, 250, 22);
  ctx.fillStyle = '#ecfdf5';
  ctx.fill();
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#065f46';
  ctx.font = lang === 'en' ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Auspicious Timings (Shubha)' : 'శుభ సమయాలు (Auspicious)', 92, 808);

  ctx.fillStyle = '#047857';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Abhijit Muhurtham:' : 'అభిజిత్ ముహూర్తం:', 92, 852);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(cleanServerText(translatePanchangamString(day.shubha.abhijit, lang)), 92, 885, 405);

  ctx.fillStyle = '#047857';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Amrutha Ghadayalu:' : 'అమృత ఘడియలు:', 92, 932);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 20px "Noto Serif Telugu", serif' : 'bold 21px "Noto Serif Telugu", serif';
  ctx.fillText(cleanServerText(translatePanchangamString(day.shubha.amrutha, lang)).slice(0, 38), 92, 965, 405);

  // Right: Ashubha Samayalu
  drawRoundedRect(ctx, 556, 760, 460, 250, 22);
  ctx.fillStyle = '#fff1f2';
  ctx.fill();
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#9f1239';
  ctx.font = lang === 'en' ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Inauspicious Timings' : 'వర్జించవలసిన సమయాలు', 584, 808);

  ctx.fillStyle = '#be123c';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Rahu Kalam:' : 'రాహు కాలం:', 584, 852);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(cleanServerText(translatePanchangamString(day.ashubha.rahukalam, lang)), 584, 885, 405);

  ctx.fillStyle = '#be123c';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Varjyam:' : 'వర్జ్యం:', 584, 932);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 20px "Noto Serif Telugu", serif' : 'bold 21px "Noto Serif Telugu", serif';
  ctx.fillText(cleanServerText(translatePanchangamString(day.ashubha.varjyam, lang)).slice(0, 38), 584, 965, 405);

  // Vishesham Box
  drawRoundedRect(ctx, 64, 1035, 952, 210, 22);
  ctx.fillStyle = '#fffbeb';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#92400e';
  ctx.font = lang === 'en' ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? '🌸 Today Significance & Divine Worship:'
      : '🌸 నేటి పంచాంగ విశేషం & దైవ ఆరాధన:',
    94,
    1082
  );

  ctx.fillStyle = '#1e293b';
  ctx.font = lang === 'en' ? '23px "Noto Serif Telugu", serif' : '24px "Noto Serif Telugu", serif';
  const visheshamText = cleanServerText(translatePanchangamString(day.phalitham || 'సర్వజన శుభకృత్', lang));
  wrapCanvasText(ctx, visheshamText, 94, 1126, 890, 36, 3);

  ctx.fillStyle = '#fde68a';
  ctx.font = lang === 'en' ? 'bold 24px "Noto Serif Telugu", serif' : 'bold 25px "Noto Serif Telugu", serif';
  drawMeasuredCenteredText(
    ctx,
    lang === 'en'
      ? 'For Horoscope Analysis, Vedic Muhurthas & Poojas Consultation:'
      : 'జాతక పరిశీలన, వివాహ ముహూర్తాలు & హోమాల కొరకు సంప్రదించండి:',
    64,
    952,
    1315,
    16
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Noto Serif Telugu", serif';
  drawMeasuredCenteredText(
    ctx,
    'WhatsApp: +91 8977986166   |   www.telugujyothisham.com',
    64,
    952,
    1368,
    16
  );

  return canvas.toBuffer('image/png');
}

/**
 * Renders 1080x1920 Rashi Horoscope Status Card PNG Buffer in Node.js (Telugu or English)
 */
export function renderRashiCardPngBuffer(
  day: DayData,
  rashi: RashiDailyFortune,
  lang: 'te' | 'en' = 'te'
): Buffer {
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext('2d');
  ctx.textAlign = 'left';

  const isFav = rashi.status === 'favorable';
  const isCaution = rashi.status === 'caution';

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGrad.addColorStop(0, '#3b1103');
  bgGrad.addColorStop(0.155, '#6b270a');
  bgGrad.addColorStop(0.16, '#fffbeb');
  bgGrad.addColorStop(0.835, '#fef3c7');
  bgGrad.addColorStop(0.84, '#3b1103');
  bgGrad.addColorStop(1, '#1e0801');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 7;
  drawRoundedRect(ctx, 24, 24, 1032, 1872, 34);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 38, 38, 1004, 1844, 26);
  ctx.stroke();

  const headerSubtitle =
    lang === 'en'
      ? 'Om Sri Lakshmi Ganapataye Namaha • Daily Zodiac Horoscope (English)'
      : 'ఓం శ్రీలక్ష్మి గణపతయే నమః • నేటి రాశి ఫలం (Daily Horoscope)';
  drawLeftAlignedTempleHeader(ctx, headerSubtitle, lang);

  const shortTithi = cleanServerText(day.panchanga.tithi.split(/[-–(]/)[0]);
  const shortNak = cleanServerText(day.panchanga.nakshatram.split(/[-–(]/)[0]);
  drawRoundedRect(ctx, 60, 222, 960, 68, 34);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  ctx.fillStyle = '#3b1103';
  ctx.font = lang === 'en' ? 'bold 26px "Noto Serif Telugu", serif' : 'bold 28px "Noto Serif Telugu", serif';
  const pillDateText =
    lang === 'en'
      ? `${cleanServerText(translatePanchangamString(day.teediVaram, 'en'))}  •  Tithi: ${cleanServerText(translatePanchangamString(shortTithi, 'en'))}  •  Star: ${cleanServerText(translatePanchangamString(shortNak, 'en'))}`
      : `${cleanServerText(day.teediVaram)}  •  తిథి: ${shortTithi}  •  నక్షత్రం: ${shortNak}`;
  ctx.fillText(pillDateText, 92, 266, 896);

  drawRoundedRect(ctx, 60, 314, 960, 212, 26);
  ctx.fillStyle = isFav ? '#ecfdf5' : isCaution ? '#fff1f2' : '#ffffff';
  ctx.fill();
  ctx.strokeStyle = isFav ? '#059669' : isCaution ? '#e11d48' : '#d97706';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.font = lang === 'en' ? 'bold 44px "Noto Serif Telugu", serif' : 'bold 46px "Noto Serif Telugu", serif';
  const heroTitle =
    lang === 'en'
      ? `${cleanServerText(rashi.englishName)} Zodiac (${rashi.teluguName})`
      : `${cleanServerText(rashi.teluguName)} రాశి (${rashi.englishName})`;
  ctx.fillText(heroTitle, 92, 384, 550);

  const pillX = 644;
  const pillW = 344;
  drawRoundedRect(ctx, pillX, 336, pillW, 60, 30);
  ctx.fillStyle = isFav ? '#047857' : isCaution ? '#be123c' : '#b45309';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 25px "Noto Serif Telugu", serif';
  const statusLabel = lang === 'en' ? cleanServerText(rashi.statusLabelEn) : cleanServerText(rashi.statusLabel);
  drawMeasuredCenteredText(ctx, statusLabel, pillX, pillW, 375, 16);

  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 25px "Noto Serif Telugu", serif';
  const subMetaText =
    lang === 'en'
      ? `Lord: ${cleanServerText(rashi.lordEn)}   •   Vedic Symbol: ${cleanServerText(rashi.vedicSymbolNameEn)}`
      : `అధిపతి: ${cleanServerText(rashi.lord)}   •   చిహ్నం: ${cleanServerText(rashi.vedicSymbolName)}`;
  ctx.fillText(subMetaText, 92, 444, 896);

  ctx.fillStyle = isFav ? '#065f46' : isCaution ? '#9f1239' : '#92400e';
  ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 24px "Noto Serif Telugu", serif';
  const transitText =
    lang === 'en'
      ? `Planetary Transit: ${cleanServerText(rashi.englishNavagrahaLabel)}`
      : `గోచార స్థితి: ${cleanServerText(rashi.navagrahaTransitLabel)}`;
  ctx.fillText(transitText, 92, 494, 896);

  // Graha Drishti Box
  drawRoundedRect(ctx, 60, 546, 960, 314, 26);
  ctx.fillStyle = '#fffbeb';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? 'Planetary Aspect & Transit Influence:'
      : 'నేటి గ్రహ దృష్టి & గ్రహ సంచార ఫలితం:',
    92,
    596,
    896
  );

  ctx.fillStyle = '#b45309';
  ctx.font = lang === 'en' ? 'bold 22px "Noto Serif Telugu", serif' : 'bold 23px "Noto Serif Telugu", serif';
  const aspectHeadline =
    lang === 'en'
      ? `• ${cleanServerText(rashi.grahaDrishtiHeadlineEn)}  (${cleanServerText(rashi.grahaDrishtiTimeEn)})`
      : `• ${cleanServerText(rashi.grahaDrishtiHeadlineTe)}  (${cleanServerText(rashi.grahaDrishtiTimeTe)})`;
  ctx.fillText(aspectHeadline, 92, 636, 896);

  ctx.fillStyle = '#1e293b';
  ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 24px "Noto Serif Telugu", serif';
  const aspectBody = lang === 'en' ? rashi.grahaDrishtiPhalamEn : rashi.grahaDrishtiPhalamTe;
  wrapCanvasText(ctx, aspectBody, 92, 684, 896, 40, 4);

  // Career & Family Card
  drawRoundedRect(ctx, 60, 880, 960, 480, 26);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.stroke();

  const cleanCareerText =
    lang === 'en'
      ? rashi.englishFullSummary.split('\n')[1]?.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim() || rashi.englishFullSummary
      : rashi.careerFinanceLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();

  const cleanFamilyText =
    lang === 'en'
      ? rashi.englishFullSummary.split('\n')[2]?.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim() || rashi.englishDairyam
      : rashi.familyHealthLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();

  ctx.fillStyle = '#92400e';
  ctx.font = lang === 'en' ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? '• Career & Financial Outlook:' : '• వృత్తి, ఉద్యోగం & ధనలాభం:', 92, 930);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? '23px "Noto Serif Telugu", serif' : '24px "Noto Serif Telugu", serif';
  wrapCanvasText(ctx, cleanCareerText, 92, 970, 896, 36, 2);

  ctx.fillStyle = '#92400e';
  ctx.font = lang === 'en' ? 'bold 25px "Noto Serif Telugu", serif' : 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? '• Family, Health & Personal:' : '• కుటుంబం & ఆరోగ్యం:', 92, 1062);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? '23px "Noto Serif Telugu", serif' : '24px "Noto Serif Telugu", serif';
  wrapCanvasText(ctx, cleanFamilyText, 92, 1102, 896, 36, 2);

  drawRoundedRect(ctx, 88, 1184, 904, 72, 16);
  ctx.fillStyle = '#ecfdf5';
  ctx.fill();
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#065f46';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  wrapCanvasText(
    ctx,
    lang === 'en' ? `Do Today: ${rashi.doTodayEn}` : `నేడు చేయవలసిన పని: ${rashi.doTodayTe}`,
    108,
    1228,
    864,
    30,
    2
  );

  drawRoundedRect(ctx, 88, 1268, 904, 72, 16);
  ctx.fillStyle = '#fff1f2';
  ctx.fill();
  ctx.strokeStyle = '#fecdd3';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#9f1239';
  ctx.font = lang === 'en' ? 'bold 21px "Noto Serif Telugu", serif' : 'bold 22px "Noto Serif Telugu", serif';
  wrapCanvasText(
    ctx,
    lang === 'en' ? `Avoid Today: ${rashi.avoidTodayEn}` : `నేడు జాగ్రత్త: ${rashi.avoidTodayTe}`,
    108,
    1312,
    864,
    30,
    2
  );

  // Remedy Box
  drawRoundedRect(ctx, 60, 1380, 960, 218, 26);
  ctx.fillStyle = '#fef3c7';
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 24px "Noto Serif Telugu", serif';
  const luckyLine =
    lang === 'en'
      ? `Lucky Time: ${cleanServerText(rashi.luckyTimeWindowEn)}  •  Color: ${cleanServerText(rashi.luckyColorEn)}  •  Lucky #: #${rashi.luckyNumber}`
      : `శుభ సమయం: ${cleanServerText(rashi.luckyTimeWindowTe)}  •  రంగు: ${cleanServerText(rashi.luckyColor)}  •  సంఖ్య: #${rashi.luckyNumber}`;
  ctx.fillText(luckyLine, 92, 1432, 896);

  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 24px "Noto Serif Telugu", serif' : 'bold 25px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Daily Vedic Remedy:' : 'నేటి శాస్త్రోక్త పరిహారం:', 92, 1486);
  ctx.fillStyle = '#1e293b';
  ctx.font = lang === 'en' ? 'bold 23px "Noto Serif Telugu", serif' : 'bold 24px "Noto Serif Telugu", serif';
  wrapCanvasText(ctx, lang === 'en' ? rashi.remedyEn : rashi.remedy, 92, 1528, 896, 36, 2);

  // Footer
  ctx.fillStyle = '#fde68a';
  ctx.font = lang === 'en' ? 'bold 24px "Noto Serif Telugu", serif' : 'bold 25px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? 'Free 100-Page Kundali PDF, Daily Panchangam & Astrology:'
      : 'ఉచిత 100 పేజీల జన్మ కుండలి PDF, నేటి పంచాంగం & రాశి ఫలాల కోసం చూడండి:',
    68,
    1662,
    944
  );

  drawRoundedRect(ctx, 68, 1688, 944, 88, 44);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#3b1103';
  ctx.font = 'bold 42px "Noto Serif Telugu", serif';
  drawMeasuredCenteredText(ctx, 'www.telugujyothisham.com', 68, 944, 1747, 24);

  ctx.fillStyle = '#ffffff';
  ctx.font = lang === 'en' ? 'bold 24px "Noto Serif Telugu", serif' : 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? 'WhatsApp Consultation: +91 8977986166'
      : 'వ్యక్తిగత జాతక పరిశీలన & హోమాల కొరకు WhatsApp: +91 8977986166',
    68,
    1832,
    944
  );

  return canvas.toBuffer('image/png');
}

/**
 * Builds captions for Telegram, Instagram & LinkedIn (Telugu or English)
 */
export function buildPanchangamTelegramCaption(day: DayData, lang: 'te' | 'en' = 'te'): string {
  if (lang === 'en') {
    const shortTithi = translatePanchangamString(day.panchanga.tithi.split(/[-–(]/)[0].trim(), 'en');
    const shortNak = translatePanchangamString(day.panchanga.nakshatram.split(/[-–(]/)[0].trim(), 'en');
    const dateEn = translatePanchangamString(day.teediVaram, 'en');
    const samvatEn = translatePanchangamString(day.panchanga.samvatsaram, 'en');
    const masamEn = translatePanchangamString(day.panchanga.masam, 'en');
    const yogamEn = translatePanchangamString(day.panchanga.yogam, 'en');
    const karanamEn = translatePanchangamString(day.panchanga.karanam, 'en');

    return [
      `🕉 *Om Sri Lakshmi Ganapataye Namaha*`,
      `🏛 *Sri Lakshmi Ganapathi Jyothishalayam*`,
      `✍️ *Brahmasri Jallavaram Sai Dheeraj Sharma*`,
      ``,
      `📅 *Daily Telugu Panchangam in English (${dateEn})*`,
      `• *Year & Month:* ${samvatEn}, ${masamEn}`,
      `• *Tithi:* ${shortTithi}`,
      `• *Nakshatram (Star):* ${shortNak}`,
      `• *Yogam & Karanam:* ${yogamEn} | ${karanamEn}`,
      ``,
      `✅ *Auspicious Timings:*`,
      `• Abhijit Muhurtham: ${translatePanchangamString(day.shubha.abhijit, 'en')}`,
      `• Amrutha Ghadayalu: ${translatePanchangamString(day.shubha.amrutha, 'en')}`,
      ``,
      `⚠️ *Inauspicious Timings:*`,
      `• Rahu Kalam: ${translatePanchangamString(day.ashubha.rahukalam, 'en')}`,
      `• Yamagandam: ${translatePanchangamString(day.ashubha.yamagandam, 'en')}`,
      ``,
      `✨ *Free 100-Page Kundali PDF & 12 Signs Horoscope:*`,
      `🌐 https://www.telugujyothisham.com`,
      `📞 *WhatsApp Consultation:* +91 8977986166`,
    ].join('\n');
  }

  const shortTithi = day.panchanga.tithi.split(/[-–(]/)[0].trim();
  const shortNak = day.panchanga.nakshatram.split(/[-–(]/)[0].trim();
  return [
    `🕉 *ఓం శ్రీలక్ష్మి గణపతయే నమః*`,
    `🏛 *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం*`,
    `✍️ *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు*`,
    ``,
    `📅 *నేటి తెలుగు పంచాంగం (${day.teediVaram})*`,
    `• *సంవత్సరం & మాసం:* ${day.panchanga.samvatsaram}, ${day.panchanga.masam}`,
    `• *తిథి:* ${shortTithi}`,
    `• *నక్షత్రం:* ${shortNak}`,
    `• *యోగం & కరణం:* ${day.panchanga.yogam} | ${day.panchanga.karanam}`,
    ``,
    `✅ *శుభ సమయాలు:*`,
    `• అభిజిత్ ముహూర్తం: ${day.shubha.abhijit}`,
    `• అమృత ఘడియలు: ${day.shubha.amrutha}`,
    ``,
    `⚠️ *వర్జించవలసిన సమయాలు:*`,
    `• రాహు కాలం: ${day.ashubha.rahukalam}`,
    `• యమగండం: ${day.ashubha.yamagandam}`,
    ``,
    `✨ *ఉచిత 100 పేజీల జన్మ కుండలి PDF & 12 రాశుల ఫలితాల కోసం:*`,
    `🌐 https://www.telugujyothisham.com`,
    `📞 *WhatsApp సంప్రదింపులు:* +91 8977986166`,
  ].join('\n');
}

export function buildAll12RashisPredictionsText(
  day: DayData,
  fortunes: RashiDailyFortune[]
): string[] {
  const header = [
    `🪐 *ద్వాదశ రాశి ఫలాలు • Daily Horoscope (Telugu & English)*`,
    `📅 *${day.teediVaram}* | *తిథి:* ${day.panchanga.tithi.split(/[-–(]/)[0].trim()} | *నక్షత్రం:* ${day.panchanga.nakshatram.split(/[-–(]/)[0].trim()}`,
    `━━━━━━━━━━━━━━━━━━━━`,
  ].join('\n');

  const formatBilingual = (r: RashiDailyFortune) => {
    const careerTe = r.careerFinanceLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();
    const careerEn = r.englishFullSummary.split('\n')[1]?.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim() || r.englishFullSummary;

    return [
      `${r.symbol} *${r.teluguName} రాశి (${r.englishName})* — *${r.statusLabel}* | _${r.statusLabelEn}_`,
      `🪐 *గోచారం / Transit:* ${r.navagrahaTransitLabel} • ${r.englishNavagrahaLabel}`,
      `🔍 *గ్రహ దృష్టి:* ${r.grahaDrishtiHeadlineTe}`,
      ``,
      `🇮🇳 *తెలుగు:* ${careerTe}`,
      `• *శుభ సమయం:* ${r.luckyTimeWindowTe} | *రంగు:* ${r.luckyColor} | *పరిహారం:* ${r.remedy}`,
      ``,
      `🇬🇧 *English:* ${careerEn}`,
      `• *Lucky Time:* ${r.luckyTimeWindowEn} | *Color:* ${r.luckyColorEn} | *Remedy:* ${r.remedyEn}`,
    ].join('\n');
  };

  const part1 = fortunes.slice(0, 4).map(formatBilingual);
  const part2 = fortunes.slice(4, 8).map(formatBilingual);
  const part3 = fortunes.slice(8, 12).map(formatBilingual);

  const footer = [
    `━━━━━━━━━━━━━━━━━━━━`,
    `📜 *ఉచిత 100 పేజీల జన్మ కుండలి PDF & పంచాంగం • Free 100-Page Kundali PDF:*`,
    `🌐 https://www.telugujyothisham.com`,
    `📞 *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ:* +91 8977986166`,
  ].join('\n');

  return [
    `${header}\n\n${part1.join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n')}`,
    `🪐 *నేటి రాశి ఫలాలు • Part 2 (సింహం నుండి వృశ్చికం / Leo to Scorpio)*\n━━━━━━━━━━━━━━━━━━━━\n\n${part2.join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n')}`,
    `🪐 *నేటి రాశి ఫలాలు • Part 3 (ధనుస్సు నుండి మీనం / Sagittarius to Pisces)*\n━━━━━━━━━━━━━━━━━━━━\n\n${part3.join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n')}\n\n${footer}`,
  ];
}

export function buildEnglishOnlyPredictionsText(
  day: DayData,
  fortunes: RashiDailyFortune[]
): string[] {
  const header = [
    `🪐 *Daily Zodiac Horoscope & Planetary Aspect Forecast (English)*`,
    `📅 *${day.teediVaram}*`,
    `━━━━━━━━━━━━━━━━━━━━`,
  ].join('\n');

  const formatEn = (r: RashiDailyFortune) => {
    const careerEn = r.englishFullSummary.split('\n')[1]?.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim() || r.englishFullSummary;
    return [
      `${r.symbol} *${r.englishName} (${r.teluguName})* — *${r.statusLabelEn}*`,
      `• *Transit:* ${r.englishNavagrahaLabel}`,
      `• *Planetary Aspect:* ${r.grahaDrishtiHeadlineEn} (${r.grahaDrishtiTimeEn})`,
      `• *Forecast:* ${careerEn}`,
      `• *Do Today:* ${r.doTodayEn}`,
      `• *Avoid Today:* ${r.avoidTodayEn}`,
      `• *Lucky Time:* ${r.luckyTimeWindowEn} | *Color:* ${r.luckyColorEn} | *#${r.luckyNumber}*`,
      `• *Vedic Remedy:* ${r.remedyEn}`,
    ].join('\n');
  };

  const firstHalf = fortunes.slice(0, 6).map(formatEn);
  const secondHalf = fortunes.slice(6, 12).map(formatEn);

  const footer = [
    `━━━━━━━━━━━━━━━━━━━━`,
    `🌐 *Free 100-Page Kundali & Vedic Astrology:* https://www.telugujyothisham.com`,
    `📞 *WhatsApp Consultation:* +91 8977986166`,
  ].join('\n');

  return [
    `${header}\n\n${firstHalf.join('\n\n')}`,
    `🪐 *Daily Horoscope (Libra to Pisces - ${day.teediVaram})*\n━━━━━━━━━━━━━━━━━━━━\n\n${secondHalf.join('\n\n')}\n\n${footer}`,
  ];
}

export function buildTeluguOnlyPredictionsText(
  day: DayData,
  fortunes: RashiDailyFortune[]
): string[] {
  const header = [
    `🪐 *నేటి ద్వాదశ రాశి ఫలాలు & గ్రహ దృష్టి ఫలితాలు*`,
    `📅 *${day.teediVaram}* | *తిథి:* ${day.panchanga.tithi.split(/[-–(]/)[0].trim()}`,
    `━━━━━━━━━━━━━━━━━━━━`,
  ].join('\n');

  const formatTe = (r: RashiDailyFortune) => {
    const career = r.careerFinanceLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();
    return [
      `${r.symbol} *${r.teluguName} రాశి (${r.englishName})* — _${r.statusLabel}_`,
      `• *గ్రహ దృష్టి:* ${r.grahaDrishtiHeadlineTe}`,
      `• *ఫలితం:* ${career}`,
      `• *నేడు చేయవలసిన పని:* ${r.doTodayTe}`,
      `• *నేడు జాగ్రత్త:* ${r.avoidTodayTe}`,
      `• *శుభ సమయం:* ${r.luckyTimeWindowTe} | *రంగు:* ${r.luckyColor}`,
      `• *పరిహారం:* ${r.remedy}`,
    ].join('\n');
  };

  const firstHalf = fortunes.slice(0, 6).map(formatTe);
  const secondHalf = fortunes.slice(6, 12).map(formatTe);

  const footer = [
    `━━━━━━━━━━━━━━━━━━━━`,
    `📜 *మీ పుట్టిన తేదీతో ఉచిత 100 పేజీల జన్మ కుండలి PDF & పంచాంగం:*`,
    `🌐 https://www.telugujyothisham.com`,
    `📞 *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ:* +91 8977986166`,
  ].join('\n');

  return [
    `${header}\n\n${firstHalf.join('\n\n')}`,
    `🪐 *నేటి రాశి ఫలాలు (తులా రాశి నుండి మీన రాశి వరకు - ${day.teediVaram})*\n━━━━━━━━━━━━━━━━━━━━\n\n${secondHalf.join('\n\n')}\n\n${footer}`,
  ];
}

export function buildInstagramLinkedInSocialCopy(
  day: DayData,
  fortunes: RashiDailyFortune[]
): string {
  const shortTithi = day.panchanga.tithi.split(/[-–(]/)[0].trim();
  const shortNak = day.panchanga.nakshatram.split(/[-–(]/)[0].trim();
  const topRashis = fortunes
    .slice(0, 12)
    .map((r) => `✨ ${r.teluguName} (${r.englishName}): ${r.statusLabel} — ${r.remedy}`)
    .join('\n');

  return [
    `📸 *INSTAGRAM & LINKEDIN READY POST COPY (Copy & Paste):*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః | నేటి తెలుగు పంచాంగం & ద్వాదశ రాశి ఫలాలు (${day.teediVaram})`,
    ``,
    `📅 తేదీ: ${day.teediVaram} (${day.panchanga.samvatsaram}, ${day.panchanga.masam})`,
    `🌙 తిథి: ${shortTithi} | ⭐ నక్షత్రం: ${shortNak}`,
    `✅ అభిజిత్ ముహూర్తం: ${day.shubha.abhijit} | అమృత ఘడియలు: ${day.shubha.amrutha}`,
    `⚠️ రాహు కాలం: ${day.ashubha.rahukalam}`,
    ``,
    `🪐 నేటి 12 రాశుల గోచార స్థితి & పరిహారాలు:`,
    topRashis,
    ``,
    `📜 మీ పుట్టిన తేదీ, సమయంతో ఉచిత 100 పేజీల జన్మ కుండలి (Jatakam) PDF, ఏలినాటి శని చెకర్, 27 నక్షత్రాల పిల్లల పేర్లు & గృహ వాస్తు కోసం మా వెబ్‌సైట్ చూడండి:`,
    `🌐 https://www.telugujyothisham.com`,
    ``,
    `✍️ బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు`,
    `🏛️ శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం | 📞 WhatsApp: +91 8977986166`,
    ``,
    `#TeluguPanchangam #TeluguJyothisham #RasiPhalalu #TodayPanchangam #TeluguAstrology #Jatakam #Horoscope #VedicAstrology #NRI #TeluguNRIs #Hyderabad #Vijayawada #Tirupati #Visakhapatnam`,
  ].join('\n');
}

/**
 * Telegram API Helpers
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  replyMarkup?: object
): Promise<boolean> {
  // Telegram has a hard limit of 4096 characters per message
  if (text.length > 3800) {
    const chunks: string[] = [];
    const paragraphs = text.split('\n\n');
    let current = '';
    for (const para of paragraphs) {
      if ((current + '\n\n' + para).length > 3600) {
        if (current) chunks.push(current.trim());
        current = para;
      } else {
        current = current ? `${current}\n\n${para}` : para;
      }
    }
    if (current) chunks.push(current.trim());

    let allOk = true;
    for (let i = 0; i < chunks.length; i++) {
      const isLast = i === chunks.length - 1;
      const ok = await sendSingleTelegramMessage(chatId, chunks[i], isLast ? replyMarkup : undefined);
      if (!ok) allOk = false;
    }
    return allOk;
  }

  return sendSingleTelegramMessage(chatId, text, replyMarkup);
}

async function sendSingleTelegramMessage(
  chatId: string | number,
  text: string,
  replyMarkup?: object
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
    disable_web_page_preview: false,
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { ok: boolean; description?: string };
    if (!data.ok) {
      console.warn(`[Telegram] Markdown message failed (${data.description}), retrying plain text...`);
      delete payload.parse_mode;
      const retryRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const retryData = (await retryRes.json()) as { ok: boolean; description?: string };
      return retryData.ok;
    }
    return true;
  } catch (err) {
    console.error(`[Telegram] sendSingleTelegramMessage error for ${chatId}:`, err);
    return false;
  }
}

export async function sendTelegramPhotoBuffer(
  chatId: string | number,
  pngBuffer: Buffer,
  fileName: string,
  caption: string,
  replyMarkup?: object
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  async function executeSend(useMarkdown: boolean) {
    const form = new FormData();
    form.append('chat_id', String(chatId));
    form.append('caption', caption.slice(0, 1020));
    if (useMarkdown) {
      form.append('parse_mode', 'Markdown');
    }
    const blob = new Blob([new Uint8Array(pngBuffer)], { type: 'image/png' });
    form.append('photo', blob, fileName);
    if (replyMarkup) {
      form.append('reply_markup', JSON.stringify(replyMarkup));
    }
    const res = await fetch(url, { method: 'POST', body: form });
    return (await res.json()) as { ok: boolean; description?: string };
  }

  try {
    let result = await executeSend(true);
    if (!result.ok) {
      console.warn(`[Telegram] sendPhoto Markdown failed (${result.description}), retrying without parse_mode...`);
      result = await executeSend(false);
    }
    return result.ok;
  } catch (err) {
    console.error(`[Telegram] sendTelegramPhotoBuffer error for ${chatId}:`, err);
    return false;
  }
}

export function getMainInlineKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '📅 పంచాంగం HD (Telugu)', callback_data: 'cmd_panchangam' },
        { text: '🇬🇧 Panchangam HD (English)', callback_data: 'cmd_panchangam_en' },
      ],
      [
        { text: '🪐 12 రాశుల ఫలితాలు (All 12)', callback_data: 'cmd_predictions' },
        { text: '🇬🇧 English Predictions', callback_data: 'cmd_english' },
      ],
      [
        { text: '🖼️ 12 Status Cards (Telugu)', callback_data: 'cmd_allcards' },
        { text: '🇬🇧 12 Status Cards (English)', callback_data: 'cmd_cards_en' },
      ],
      [
        { text: '📸 Insta & LinkedIn కాపీ', callback_data: 'cmd_social' },
        { text: '🚀 ఆటో-పోస్ట్ (LinkedIn & Insta)', callback_data: 'cmd_autopost' },
      ],
      [
        { text: '♈ మేషం', callback_data: 'rashi_mesham' },
        { text: '♉ వృషభం', callback_data: 'rashi_vrushabham' },
        { text: '♊ మిథునం', callback_data: 'rashi_mithunam' },
        { text: '♋ కర్కాటకం', callback_data: 'rashi_karkatakam' },
      ],
      [
        { text: '♌ సింహం', callback_data: 'rashi_simham' },
        { text: '♍ కన్య', callback_data: 'rashi_kanya' },
        { text: '♎ తుల', callback_data: 'rashi_tula' },
        { text: '♏ వృశ్చికం', callback_data: 'rashi_vruschikam' },
      ],
      [
        { text: '♐ ధనుస్సు', callback_data: 'rashi_dhanussu' },
        { text: '♑ మకరం', callback_data: 'rashi_makaram' },
        { text: '♒ కుంభం', callback_data: 'rashi_kumbham' },
        { text: '♓ మీనం', callback_data: 'rashi_meenam' },
      ],
      [
        {
          text: '🌐 www.telugujyothisham.com ఓపెన్ చేయండి',
          url: 'https://www.telugujyothisham.com',
        },
      ],
    ],
  };
}

export function loadSavedChatIds(): string[] {
  const envChatIds = (process.env.TELEGRAM_CHAT_ID || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  let fileIds: string[] = [];
  if (fs.existsSync(SUBSCRIBERS_FILE)) {
    try {
      fileIds = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
    } catch {
      fileIds = [];
    }
  }
  return Array.from(new Set([...envChatIds, ...fileIds]));
}

export function saveChatId(chatId: string | number): void {
  const existing = loadSavedChatIds();
  const strId = String(chatId);
  if (!existing.includes(strId)) {
    existing.push(strId);
    try {
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    } catch {}
  }
}

export async function sendFullDailyBundleToChat(chatId: string | number): Promise<void> {
  const { day, fortunes } = getTodayISTData();
  const panchangamBuffer = renderDailyPanchangamPngBuffer(day);
  const panchangamCaption = buildPanchangamTelegramCaption(day);

  await sendTelegramPhotoBuffer(
    chatId,
    panchangamBuffer,
    `telugu-panchangam-${day.isoDate || day.id}.png`,
    panchangamCaption,
    getMainInlineKeyboard()
  );

  const predictionMessages = buildAll12RashisPredictionsText(day, fortunes);
  for (const msg of predictionMessages) {
    await sendTelegramMessage(chatId, msg);
  }
}

export async function sendSingleRashiCardToChat(
  chatId: string | number,
  rashiId: string,
  lang: 'te' | 'en' = 'te'
): Promise<void> {
  const { day, fortunes } = getTodayISTData();
  const rashi = fortunes.find((f) => f.id === rashiId) || fortunes[0];
  const pngBuffer = renderRashiCardPngBuffer(day, rashi, lang);
  const cleanCareerTe = rashi.careerFinanceLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim();
  const cleanCareerEn =
    rashi.englishFullSummary.split('\n')[1]?.replace(/^[0-9]+\.\s*[^:]+:\s*/, '').trim() ||
    rashi.englishFullSummary;

  const caption =
    lang === 'en'
      ? [
          `${rashi.symbol} *${rashi.englishName} Daily Horoscope (${rashi.teluguName})*`,
          `• *Transit:* ${rashi.statusLabelEn} • ${rashi.englishNavagrahaLabel}`,
          `• *Planetary Aspect:* ${rashi.grahaDrishtiHeadlineEn} (${rashi.grahaDrishtiTimeEn})`,
          ``,
          `🇬🇧 *Forecast:* ${cleanCareerEn}`,
          `• *Do Today:* ${rashi.doTodayEn}`,
          `• *Avoid Today:* ${rashi.avoidTodayEn}`,
          `• *Lucky Time:* ${rashi.luckyTimeWindowEn} | *Color:* ${rashi.luckyColorEn} | *Remedy:* ${rashi.remedyEn}`,
          ``,
          `🌐 *Free 100-Page Kundali PDF:* https://www.telugujyothisham.com`,
          `📞 *WhatsApp:* +91 8977986166`,
        ].join('\n')
      : [
          `${rashi.symbol} *నేటి ${rashi.teluguName} రాశి ఫలం • Today's ${rashi.englishName} Forecast*`,
          `• *గోచారం / Transit:* ${rashi.statusLabel} (${rashi.statusLabelEn}) • ${rashi.navagrahaTransitLabel}`,
          `• *గ్రహ దృష్టి / Aspect:* ${rashi.grahaDrishtiHeadlineTe}`,
          ``,
          `🇮🇳 *తెలుగు:* ${cleanCareerTe}`,
          `• *శుభ సమయం:* ${rashi.luckyTimeWindowTe} | *రంగు:* ${rashi.luckyColor} | *పరిహారం:* ${rashi.remedy}`,
          ``,
          `🇬🇧 *English:* ${cleanCareerEn}`,
          `• *Lucky Time:* ${rashi.luckyTimeWindowEn} | *Color:* ${rashi.luckyColorEn} | *Remedy:* ${rashi.remedyEn}`,
          ``,
          `🌐 *Free 100-Page Kundali PDF:* https://www.telugujyothisham.com`,
          `📞 *WhatsApp:* +91 8977986166`,
        ].join('\n');

  await sendTelegramPhotoBuffer(
    chatId,
    pngBuffer,
    `${lang === 'en' ? 'en-' : ''}${rashi.id}-${day.isoDate || day.id}.png`,
    caption,
    {
      inline_keyboard: [
        [
          {
            text: lang === 'en' ? '🇮🇳 Telugu Card' : '🇬🇧 English Card',
            callback_data: lang === 'en' ? `rashi_${rashi.id}` : `rashi_${rashi.id}_en`,
          },
          {
            text: '🌐 telugujyothisham.com',
            url: 'https://www.telugujyothisham.com',
          },
        ],
      ],
    }
  );
}

async function registerBotCommands() {
  const commands = [
    { command: 'start', description: 'నేటి పంచాంగం + 12 రాశుల ఫలితాలు & మెనూ' },
    { command: 'panchangam', description: 'నేటి పంచాంగం HD ఇమేజ్ కార్డ్ & వివరాలు (Telugu)' },
    { command: 'panchangam_en', description: 'Daily Panchangam HD Image Card in English' },
    { command: 'predictions', description: '12 Zodiac Signs Daily Forecast (Telugu & English)' },
    { command: 'english', description: '12 Signs Daily Horoscope (English Only)' },
    { command: 'telugu', description: '12 రాశుల దిన ఫలాలు (Telugu Only)' },
    { command: 'allcards', description: '12 రాశుల WhatsApp/Instagram Status కార్డులు (Telugu)' },
    { command: 'cards_en', description: '12 Signs Status Image Cards in English' },
    { command: 'social', description: 'Instagram & LinkedIn రెడీమేడ్ పోస్ట్ క్యాప్షన్' },
    { command: 'autopost', description: '🚀 LinkedIn & Instagram ఆటోమేటెడ్ పబ్లిషింగ్' },
    { command: 'mesham', description: 'మేష రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'vrushabham', description: 'వృషభ రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'mithunam', description: 'మిథున రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'karkatakam', description: 'కర్కాటక రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'simham', description: 'సింహ రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'kanya', description: 'కన్యా రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'tula', description: 'తులా రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'vruschikam', description: 'వృశ్చిక రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'dhanussu', description: 'ధనుస్సు రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'makaram', description: 'మకర రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'kumbham', description: 'కుంభ రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
    { command: 'meenam', description: 'మీన రాశి నేటి ఫలితం & ఇమేజ్ కార్డ్' },
  ];

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands }),
  });
}

export async function handleCommandOrCallback(chatId: number | string, command: string) {
  saveChatId(chatId);
  const cleanCmd = command.replace(/^\//, '').split('@')[0].toLowerCase().trim();

  try {
    if (cleanCmd === 'start' || cleanCmd === 'help') {
      await sendTelegramMessage(
        chatId,
        '🙏 *నమస్కారం! శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం అధికారిక Telegram బాట్‌కు స్వాగతం!*\n\nనేటి పంచాంగం HD ఇమేజ్ మరియు 12 రాశుల ఫలితాలు (తెలుగు & English) సిద్ధమయ్యాయి, క్రింద వివరాలు చూడండి 👇'
      );
      await sendFullDailyBundleToChat(chatId);
      return;
    }

    if (cleanCmd === 'panchangam' || cleanCmd === 'cmd_panchangam') {
      const { day } = getTodayISTData();
      const buf = renderDailyPanchangamPngBuffer(day, 'te');
      await sendTelegramPhotoBuffer(
        chatId,
        buf,
        `telugu-panchangam-${day.isoDate || day.id}.png`,
        buildPanchangamTelegramCaption(day, 'te'),
        getMainInlineKeyboard()
      );
      return;
    }

    if (cleanCmd === 'panchangam_en' || cleanCmd === 'cmd_panchangam_en') {
      const { day } = getTodayISTData();
      const buf = renderDailyPanchangamPngBuffer(day, 'en');
      await sendTelegramPhotoBuffer(
        chatId,
        buf,
        `english-panchangam-${day.isoDate || day.id}.png`,
        buildPanchangamTelegramCaption(day, 'en'),
        getMainInlineKeyboard()
      );
      return;
    }

    if (cleanCmd === 'predictions' || cleanCmd === 'rashiphalalu' || cleanCmd === 'cmd_predictions') {
      const { day, fortunes } = getTodayISTData();
      const msgs = buildAll12RashisPredictionsText(day, fortunes);
      for (let i = 0; i < msgs.length; i++) {
        const isLast = i === msgs.length - 1;
        await sendTelegramMessage(chatId, msgs[i], isLast ? getMainInlineKeyboard() : undefined);
      }
      return;
    }

    if (cleanCmd === 'english' || cleanCmd === 'cmd_english') {
      const { day, fortunes } = getTodayISTData();
      const msgs = buildEnglishOnlyPredictionsText(day, fortunes);
      for (let i = 0; i < msgs.length; i++) {
        const isLast = i === msgs.length - 1;
        await sendTelegramMessage(chatId, msgs[i], isLast ? getMainInlineKeyboard() : undefined);
      }
      return;
    }

    if (cleanCmd === 'telugu' || cleanCmd === 'cmd_telugu') {
      const { day, fortunes } = getTodayISTData();
      const msgs = buildTeluguOnlyPredictionsText(day, fortunes);
      for (let i = 0; i < msgs.length; i++) {
        const isLast = i === msgs.length - 1;
        await sendTelegramMessage(chatId, msgs[i], isLast ? getMainInlineKeyboard() : undefined);
      }
      return;
    }

    if (cleanCmd === 'social' || cleanCmd === 'cmd_social') {
      const { day, fortunes } = getTodayISTData();
      const copy = buildInstagramLinkedInSocialCopy(day, fortunes);
      await sendTelegramMessage(chatId, copy, getMainInlineKeyboard());
      return;
    }

    if (cleanCmd === 'autopost' || cleanCmd === 'cmd_autopost' || cleanCmd === 'publish_social') {
      const hasConfig = Boolean(
        process.env.SOCIAL_WEBHOOK_URL ||
        process.env.LINKEDIN_ACCESS_TOKEN ||
        (process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID)
      );

      if (!hasConfig) {
        const guideText = [
          `🚀 *LinkedIn & Instagram ఆటోమేటెడ్ పోస్టింగ్ గైడ్*`,
          ``,
          `ప్రస్తుతం బాట్ వద్ద రోజువారీ పంచాంగం HD ఇమేజ్ & రాశి ఫలితాలు సిద్ధంగా ఉన్నాయి. వీటిని ఆటోమేటిక్‌గా పబ్లిష్ చేయడానికి 2 ఉత్తమ మార్గాలు ఉన్నాయి:`,
          ``,
          `*1️⃣ అత్యంత సులువైన పద్ధతి (Make.com లేదా Zapier Webhook - 5 నిమిషాలు):*`,
          `• [Make.com](https://www.make.com) లో ఉచిత అకౌంట్ తీసుకొని *Custom Webhook* క్రియేట్ చేయండి.`,
          `• ఆ Webhook కి LinkedIn Create Post & Instagram Publish Photo మాడ్యూల్స్ జతచేయండి.`,
          `• Webhook URL ను \`.env\` లో \`SOCIAL_WEBHOOK_URL\` గా ఇవ్వండి.`,
          `• ఇక ప్రతిరోజూ బాట్ ఆటోమేటిక్‌గా ఇమేజ్ + క్యాప్షన్ పంపి పోస్ట్ చేస్తుంది!`,
          ``,
          `*2️⃣ డైరెక్ట్ API పద్ధతి (No Third-Party Tool):*`,
          `• *LinkedIn:* developer.linkedin.com లో యాప్ క్రియేట్ చేసి \`LINKEDIN_ACCESS_TOKEN\` & \`LINKEDIN_PERSON_URN\` సెట్ చేయండి.`,
          `• *Instagram:* developers.facebook.com లో \`INSTAGRAM_ACCESS_TOKEN\` & \`INSTAGRAM_ACCOUNT_ID\` సెట్ చేయండి.`,
          ``,
          `*3️⃣ ఇప్పుడే తక్షణమే పోస్ట్ చేయాలా?*`,
          `క్రింద ఉన్న 📸 *Insta & LinkedIn కాపీ* బటన్ నొక్కితే రెడీమేడ్ క్యాప్షన్ + హ్యాష్‌ట్యాగ్స్ సిద్ధంగా వస్తాయి.`,
        ].join('\n');

        await sendTelegramMessage(chatId, guideText, {
          inline_keyboard: [
            [
              { text: '📸 రెడీమేడ్ క్యాప్షన్ పొందండి', callback_data: 'cmd_social' },
              { text: '📅 పంచాంగం HD కార్డ్', callback_data: 'cmd_panchangam' },
            ],
            [
              { text: '💼 LinkedIn లో పోస్ట్ చేయండి', url: 'https://www.linkedin.com/feed/' },
              { text: '📸 Instagram లో పోస్ట్ చేయండి', url: 'https://www.instagram.com/' },
            ],
          ],
        });
        return;
      }

      await sendTelegramMessage(chatId, '⏳ *LinkedIn & Instagram ఆటోమేటిక్ పోస్టింగ్ ప్రారంభమవుతోంది...*');
      const { executeDailySocialPosting } = await import('./socialPublisher');
      const { results, summary } = await executeDailySocialPosting();

      const resultLines = results.map(
        (r) => `${r.success ? '✅' : '❌'} *${r.channel.toUpperCase()}:* ${r.message}`
      );
      await sendTelegramMessage(
        chatId,
        `📊 *ఆటో-పోస్టింగ్ ఫలితం:*\n${summary}\n\n${resultLines.join('\n')}`,
        getMainInlineKeyboard()
      );
      return;
    }

    if (cleanCmd === 'allcards' || cleanCmd === 'cmd_allcards') {
      await sendTelegramMessage(
        chatId,
        '⏳ *12 రాశుల తెలుగు HD Status ఇమేజ్ కార్డులు తయారవుతున్నాయి... వరుసగా వస్తున్నాయి:*'
      );
      for (const rashiId of Object.keys(RASHI_COMMANDS)) {
        await sendSingleRashiCardToChat(chatId, rashiId, 'te');
      }
      return;
    }

    if (cleanCmd === 'cards_en' || cleanCmd === 'cmd_cards_en') {
      await sendTelegramMessage(
        chatId,
        '⏳ *Generating 12 Zodiac Signs HD Status Image Cards in English... Arriving in sequence:*'
      );
      for (const rashiId of Object.keys(RASHI_COMMANDS)) {
        await sendSingleRashiCardToChat(chatId, rashiId, 'en');
      }
      return;
    }

    // Single Rashi English command check (e.g., rashi_mesham_en or mesham_en)
    const isEnglishRashi = cleanCmd.endsWith('_en');
    const baseKey = cleanCmd.replace(/_en$/, '').replace(/^rashi_/, '');
    if (RASHI_COMMANDS[baseKey]) {
      await sendSingleRashiCardToChat(chatId, baseKey, isEnglishRashi ? 'en' : 'te');
      return;
    }

    // Default fallback: send today's Panchangam + Predictions bundle
    await sendFullDailyBundleToChat(chatId);
  } catch (cmdErr) {
    console.error(`[Telegram] Error handling command ${command} for ${chatId}:`, cmdErr);
    await sendTelegramMessage(
      chatId,
      '⚠️ వివరాలు పంపడంలో అంతరాయం ఏర్పడింది. దయచేసి /start నొక్కండి.'
    );
  }
}

let isDaemonRunning = false;

/**
 * Starts the 24/7 Long-Polling Telegram Bot + Daily 06:00 AM IST Auto-Scheduler
 */
export async function startTelegramBotDaemon() {
  if (isDaemonRunning) return;
  if (process.env.ENABLE_TELEGRAM_POLLING !== 'true') {
    return;
  }
  isDaemonRunning = true;

  console.log('🕉️ Starting @telugujyothisham_bot (Telugu Jyothisham Daily Panchangam Bot)...');
  await registerBotCommands();
  console.log('✅ Registered Bot Menu Commands (/start, /panchangam, /predictions, /allcards, /social, /mesham..)');

  let offset = 0;
  let lastAutoBroadcastDate = '';
  let consecutiveErrors = 0;

  // Daily 06:00 AM IST automatic broadcast check every 60 seconds
  setInterval(async () => {
    try {
      const istNow = getTodayISTDate();
      const yyyy = istNow.getFullYear();
      const mm = String(istNow.getMonth() + 1).padStart(2, '0');
      const dd = String(istNow.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;

      if (istNow.getHours() === 6 && istNow.getMinutes() <= 5 && lastAutoBroadcastDate !== dateKey) {
        const subscribers = loadSavedChatIds();
        if (subscribers.length > 0) {
          lastAutoBroadcastDate = dateKey;
          for (const chatId of subscribers) {
            await sendFullDailyBundleToChat(chatId);
          }
          console.log(`✅ Auto-broadcasted daily Panchangam & Predictions for ${dateKey} to ${subscribers.length} chats.`);
        }
      }
    } catch (err) {
      console.error('Auto-schedule check error:', err);
    }
  }, 60000);

  // Long-polling loop for instant Telegram responses
  while (true) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=25`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const data = (await res.json()) as {
        ok: boolean;
        result?: Array<{
          update_id: number;
          message?: { chat: { id: number }; text?: string };
          channel_post?: { chat: { id: number }; text?: string };
          callback_query?: {
            id: string;
            message?: { chat: { id: number } };
            data?: string;
          };
        }>;
      };

      consecutiveErrors = 0;

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          try {
            if (update.message?.chat?.id) {
              const chatId = update.message.chat.id;
              const text = update.message.text || '/start';
              console.log(`📩 [Telegram] Message from ${chatId}: ${text}`);
              await handleCommandOrCallback(chatId, text);
            } else if (update.channel_post?.chat?.id) {
              const chatId = update.channel_post.chat.id;
              saveChatId(chatId);
              if (update.channel_post.text && update.channel_post.text.startsWith('/')) {
                console.log(`📢 [Telegram] Channel post from ${chatId}: ${update.channel_post.text}`);
                await handleCommandOrCallback(chatId, update.channel_post.text);
              }
            } else if (update.callback_query?.message?.chat?.id && update.callback_query.data) {
              const chatId = update.callback_query.message.chat.id;
              const cbData = update.callback_query.data;
              console.log(`🔘 [Telegram] Callback click from ${chatId}: ${cbData}`);
              // Answer callback query so loading spinner stops on Telegram mobile
              await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  callback_query_id: update.callback_query.id,
                  text: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వివరాలు వస్తున్నాయి...',
                }),
              });
              await handleCommandOrCallback(chatId, cbData);
            }
          } catch (updateErr) {
            console.error(`[Telegram] Error processing update ${update.update_id}:`, updateErr);
          }
        }
      }
    } catch (err: unknown) {
      consecutiveErrors++;
      const waitTimeSec = Math.min(60, 5 * Math.pow(1.5, Math.min(consecutiveErrors, 6)));
      console.warn(`[Telegram] Polling connection paused (${(err as { message?: string })?.message || 'timeout'}). Retrying in ${Math.round(waitTimeSec)}s...`);
      await new Promise((r) => setTimeout(r, waitTimeSec * 1000));
    }
  }
}

// Run daemon if executed directly
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMain) {
  startTelegramBotDaemon();
}
