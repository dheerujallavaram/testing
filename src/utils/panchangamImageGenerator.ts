import { DayData } from '../types/panchangam';
import { RashiDailyFortune } from './panchangaLogic';
import { translatePanchangamString, Language } from '../context/LanguageContext';

/**
 * Helper to wrap text onto canvas lines using strictly left-aligned LTR rendering
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  const words = text.trim().split(/\s+/);
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

/**
 * Safely centers text inside a horizontal box while keeping ctx.textAlign = 'left'
 * (Prevents mobile Canvas 2D HarfBuzz complex script clipping bug with textAlign='center')
 */
function drawMeasuredCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  boxX: number,
  boxWidth: number,
  y: number,
  padding = 20
) {
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  const maxAllowedWidth = boxWidth - padding * 2;
  const measuredWidth = Math.min(ctx.measureText(text).width, maxAllowedWidth);
  const startX = boxX + Math.max(padding, (boxWidth - measuredWidth) / 2);
  ctx.fillText(text, startX, y, maxAllowedWidth);
}

/**
 * Draws a rounded rectangle on a 2D canvas context
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
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

/**
 * Draws the Left-Aligned Sacred Temple Emblem + Header used across cards in Telugu or English
 */
function drawLeftAlignedTempleHeader(
  ctx: CanvasRenderingContext2D,
  subtitleText: string,
  lang: Language = 'te'
) {
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';

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
  ctx.font = 'bold 54px serif';
  drawMeasuredCenteredText(ctx, 'ॐ', 60, 122, 128, 10);

  ctx.fillStyle = '#451a03';
  ctx.font = lang === 'en' ? 'bold 22px sans-serif' : 'bold 24px "Noto Serif Telugu", serif';
  drawMeasuredCenteredText(ctx, lang === 'en' ? 'Shubham' : 'శుభం', 60, 122, 174, 10);

  // Left-aligned Temple Headings (x = 204)
  const headerX = 204;
  const maxHeaderWidth = 816;

  ctx.fillStyle = '#fde68a';
  ctx.font = lang === 'en' ? 'bold 24px sans-serif' : 'bold 25px "Noto Serif Telugu", serif';
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
  ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 25px "Noto Serif Telugu", serif';
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
 * Generates a 1080x1440 WhatsApp Status / Instagram Portrait PNG image of the Daily Panchangam
 * in either Telugu or English.
 */
export async function downloadDailyPanchangamCardImage(
  day: DayData,
  lang: Language = 'te'
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.textAlign = 'left';
  ctx.direction = 'ltr';

  // 1. Sacred Parchment & Maroon Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
  bgGrad.addColorStop(0, '#451a03'); // Deep temple amber-950
  bgGrad.addColorStop(0.18, '#78350f');
  bgGrad.addColorStop(0.185, '#fffbeb'); // Warm parchment cream
  bgGrad.addColorStop(0.88, '#fef3c7');
  bgGrad.addColorStop(0.885, '#451a03');
  bgGrad.addColorStop(1, '#290f02');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1440);

  // Outer ornamental golden border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, 24, 24, 1032, 1392, 28);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 36, 36, 1008, 1368, 22);
  ctx.stroke();

  // 2. Left-Aligned Top Temple Header
  const headerSubtitle =
    lang === 'en'
      ? 'Om Sri Lakshmi Ganapataye Namaha • Drik Siddhanta Daily Panchangam'
      : 'ఓం శ్రీలక్ష్మి గణపతయే నమః • దృక్సిద్ధాంత నిత్య పంచాంగం';
  drawLeftAlignedTempleHeader(ctx, headerSubtitle, lang);

  // Date Pill Banner
  drawRoundedRect(ctx, 64, 222, 952, 72, 36);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#3b1103';
  ctx.font = lang === 'en' ? 'bold 29px sans-serif' : 'bold 31px "Noto Serif Telugu", serif';
  const datePillText =
    lang === 'en'
      ? `📅 ${translatePanchangamString(day.teediVaram, 'en')}  •  ${translatePanchangamString(day.panchanga.samvatsaram, 'en')}`
      : `📅 ${day.teediVaram}  •  ${day.panchanga.samvatsaram}`;
  ctx.fillText(datePillText, 96, 269, 890);

  // 3. Samvatsaram & Masam Bar
  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 25px sans-serif' : 'bold 27px "Noto Serif Telugu", serif';
  const masamBarText =
    lang === 'en'
      ? `🕉️ Month: ${translatePanchangamString(day.panchanga.masam, 'en')}   •   Presiding Deity: ${translatePanchangamString(day.deity, 'en')}`
      : `🕉️ మాసం: ${day.panchanga.masam}   •   ఆరాధ్య దైవం: ${day.deity}`;
  ctx.fillText(masamBarText, 72, 342, 936);

  // 4. Core Panchangam Limbs Card (White Box)
  drawRoundedRect(ctx, 64, 372, 952, 364, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.stroke();

  const limbs =
    lang === 'en'
      ? [
          { label: '🌙 Tithi:', value: translatePanchangamString(day.panchanga.tithi, 'en') },
          { label: '⭐ Nakshatram:', value: translatePanchangamString(day.panchanga.nakshatram, 'en') },
          {
            label: '✨ Yogam & Karanam:',
            value: `${translatePanchangamString(day.panchanga.yogam, 'en')}  |  ${translatePanchangamString(day.panchanga.karanam, 'en')}`,
          },
          { label: '🌅 Sunrise / Sunset:', value: '06:15 AM  /  05:52 PM IST' },
          {
            label: '🪔 Deity & Lucky Color:',
            value: `${translatePanchangamString(day.deity, 'en')}  |  ${translatePanchangamString(day.luckyColor, 'en')}`,
          },
        ]
      : [
          { label: '🌙 తిథి:', value: day.panchanga.tithi },
          { label: '⭐ నక్షత్రం:', value: day.panchanga.nakshatram },
          { label: '✨ యోగం & కరణం:', value: `${day.panchanga.yogam}  |  ${day.panchanga.karanam}` },
          { label: '🌅 సూర్యోదయం / అస్తమయం:', value: 'ఉదయం 06:15 AM  /  సాయంత్రం 05:52 PM' },
          { label: '🪔 ఆరాధ్య దైవం & శుభ రంగు:', value: `${day.deity}  |  ${day.luckyColor}` },
        ];

  let rowY = 430;
  limbs.forEach((item, idx) => {
    ctx.fillStyle = '#92400e';
    ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 24px "Noto Serif Telugu", serif';
    ctx.fillText(item.label, 92, rowY);

    ctx.fillStyle = '#1e293b';
    ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 24px "Noto Serif Telugu", serif';
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

  // 5. Two-Column Muhurtham Boxes (Green Auspicious & Red Inauspicious)
  drawRoundedRect(ctx, 64, 760, 460, 250, 22);
  ctx.fillStyle = '#ecfdf5';
  ctx.fill();
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#065f46';
  ctx.font = lang === 'en' ? 'bold 25px sans-serif' : 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? '✅ Auspicious Timings' : '✅ శుభ సమయాలు', 92, 808);

  ctx.fillStyle = '#047857';
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Abhijit Muhurtham:' : 'అభిజిత్ ముహూర్తం:', 92, 852);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(translatePanchangamString(day.shubha.abhijit, lang), 92, 885, 405);

  ctx.fillStyle = '#047857';
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Amrutha Ghadayalu:' : 'అమృత ఘడియలు:', 92, 932);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 20px sans-serif' : 'bold 21px "Noto Serif Telugu", serif';
  ctx.fillText(translatePanchangamString(day.shubha.amrutha.slice(0, 38), lang), 92, 965, 405);

  // Right: Ashubha Samayalu
  drawRoundedRect(ctx, 556, 760, 460, 250, 22);
  ctx.fillStyle = '#fff1f2';
  ctx.fill();
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#9f1239';
  ctx.font = lang === 'en' ? 'bold 25px sans-serif' : 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? '⚠️ Inauspicious Timings' : '⚠️ వర్జించవలసిన సమయాలు', 584, 808);

  ctx.fillStyle = '#be123c';
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Rahu Kalam:' : 'రాహు కాలం:', 584, 852);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(translatePanchangamString(day.ashubha.rahukalam, lang), 584, 885, 405);

  ctx.fillStyle = '#be123c';
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? 'Varjyam:' : 'వర్జ్యం:', 584, 932);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? 'bold 20px sans-serif' : 'bold 21px "Noto Serif Telugu", serif';
  ctx.fillText(translatePanchangamString(day.ashubha.varjyam.slice(0, 38), lang), 584, 965, 405);

  // 6. Today's Vishesham / Phalitham Box
  drawRoundedRect(ctx, 64, 1035, 952, 210, 22);
  ctx.fillStyle = '#fffbeb';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#92400e';
  ctx.font = lang === 'en' ? 'bold 25px sans-serif' : 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? '🌸 Today Significance & Divine Worship:'
      : '🌸 నేటి పంచాంగ విశేషం & దైవ ఆరాధన:',
    94,
    1082
  );

  ctx.fillStyle = '#1e293b';
  ctx.font = lang === 'en' ? '23px sans-serif' : '24px "Noto Serif Telugu", serif';
  const visheshamText = translatePanchangamString(day.phalitham || 'సర్వజన శుభకృత్', lang);
  wrapCanvasText(ctx, visheshamText, 94, 1126, 890, 36, 3);

  // 7. Bottom Footer Branding
  ctx.fillStyle = '#fde68a';
  ctx.font = lang === 'en' ? 'bold 24px sans-serif' : 'bold 25px "Noto Serif Telugu", serif';
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
  ctx.font = 'bold 32px sans-serif';
  drawMeasuredCenteredText(
    ctx,
    '📞 WhatsApp: +91 8977986166   |   🌐 www.telugujyothisham.com',
    64,
    952,
    1368,
    16
  );

  // Export & trigger download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const fileName =
      lang === 'en'
        ? `english-panchangam-${day.id}-telugujyothisham.png`
        : `telugu-panchangam-${day.id}.png`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }, 'image/png');
}

/**
 * Generates a 1080x1920 (9:16 Full-Screen WhatsApp Status & Instagram Story) Sacred Temple Card PNG
 * for any individual Rashi ("నేటి రాశి ఫలం - Daily Horoscope Prediction") in Telugu or English.
 */
export async function downloadRashiStatusCardImage(
  day: DayData,
  rashi: RashiDailyFortune,
  lang: Language = 'te'
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.textAlign = 'left';
  ctx.direction = 'ltr';

  const isFav = rashi.status === 'favorable';
  const isCaution = rashi.status === 'caution';

  // 1. Sacred Temple 9:16 Vertical Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGrad.addColorStop(0, '#3b1103');
  bgGrad.addColorStop(0.155, '#6b270a');
  bgGrad.addColorStop(0.16, '#fffbeb');
  bgGrad.addColorStop(0.835, '#fef3c7');
  bgGrad.addColorStop(0.84, '#3b1103');
  bgGrad.addColorStop(1, '#1e0801');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Ornamental Double Golden Temple Border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 7;
  drawRoundedRect(ctx, 24, 24, 1032, 1872, 34);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 38, 38, 1004, 1844, 26);
  ctx.stroke();

  // 2. Left-Aligned Top Temple Branding Header
  const headerSubtitle =
    lang === 'en'
      ? 'Om Sri Lakshmi Ganapataye Namaha • Daily Zodiac Horoscope (English)'
      : 'ఓం శ్రీలక్ష్మి గణపతయే నమః • నేటి రాశి ఫలం (Daily Horoscope)';
  drawLeftAlignedTempleHeader(ctx, headerSubtitle, lang);

  // Date & Tithi/Nakshatra Pill
  const shortTithi = day.panchanga.tithi.split(/[-–(]/)[0].trim();
  const shortNak = day.panchanga.nakshatram.split(/[-–(]/)[0].trim();
  drawRoundedRect(ctx, 60, 222, 960, 68, 34);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  ctx.fillStyle = '#3b1103';
  ctx.font = lang === 'en' ? 'bold 26px sans-serif' : 'bold 28px "Noto Serif Telugu", serif';
  const pillDateText =
    lang === 'en'
      ? `📅 ${translatePanchangamString(day.teediVaram, 'en')}  •  Tithi: ${translatePanchangamString(shortTithi, 'en')}  •  Star: ${translatePanchangamString(shortNak, 'en')}`
      : `📅 ${day.teediVaram}  •  తిథి: ${shortTithi}  •  నక్షత్రం: ${shortNak}`;
  ctx.fillText(pillDateText, 92, 266, 896);

  // 3. Rashi Hero Title Card
  drawRoundedRect(ctx, 60, 314, 960, 212, 26);
  ctx.fillStyle = isFav ? '#ecfdf5' : isCaution ? '#fff1f2' : '#ffffff';
  ctx.fill();
  ctx.strokeStyle = isFav ? '#059669' : isCaution ? '#e11d48' : '#d97706';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.font = lang === 'en' ? 'bold 44px sans-serif' : 'bold 46px "Noto Serif Telugu", serif';
  const heroTitle =
    lang === 'en'
      ? `✨ ${rashi.englishName} Zodiac (${rashi.teluguName})`
      : `✨ ${rashi.teluguName} రాశి (${rashi.englishName})`;
  ctx.fillText(heroTitle, 92, 384, 550);

  // Status Pill Badge on Right
  const pillX = 644;
  const pillW = 344;
  drawRoundedRect(ctx, pillX, 336, pillW, 60, 30);
  ctx.fillStyle = isFav ? '#047857' : isCaution ? '#be123c' : '#b45309';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 25px "Noto Serif Telugu", serif';
  const statusBadgeText = lang === 'en' ? rashi.statusLabelEn : rashi.statusLabel;
  drawMeasuredCenteredText(ctx, statusBadgeText, pillX, pillW, 375, 16);

  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 24px sans-serif' : 'bold 25px "Noto Serif Telugu", serif';
  const subMetaText =
    lang === 'en'
      ? `Lord: ${rashi.lordEn}   •   Vedic Symbol: ${rashi.vedicSymbolNameEn}`
      : `అధిపతి: ${rashi.lord}   •   చిహ్నం: ${rashi.vedicSymbolName}`;
  ctx.fillText(subMetaText, 92, 444, 896);

  ctx.fillStyle = isFav ? '#065f46' : isCaution ? '#9f1239' : '#92400e';
  ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 24px "Noto Serif Telugu", serif';
  const transitText =
    lang === 'en'
      ? `🪐 Planetary Transit: ${rashi.englishNavagrahaLabel}`
      : `🪐 గోచార స్థితి: ${rashi.navagrahaTransitLabel}`;
  ctx.fillText(transitText, 92, 494, 896);

  // 4. Graha Drishti & Sancharam Box
  drawRoundedRect(ctx, 60, 546, 960, 314, 26);
  ctx.fillStyle = '#fffbeb';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 25px sans-serif' : 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? '🪐 Planetary Aspect & Transit Influence:'
      : '🪐 నేటి గ్రహ దృష్టి & గ్రహ సంచార ఫలితం:',
    92,
    596,
    896
  );

  ctx.fillStyle = '#b45309';
  ctx.font = lang === 'en' ? 'bold 22px sans-serif' : 'bold 23px "Noto Serif Telugu", serif';
  const aspectHeadline =
    lang === 'en'
      ? `✨ ${rashi.grahaDrishtiHeadlineEn}  (${rashi.grahaDrishtiTimeEn})`
      : `✨ ${rashi.grahaDrishtiHeadlineTe}  (${rashi.grahaDrishtiTimeTe})`;
  ctx.fillText(aspectHeadline, 92, 636, 896);

  ctx.fillStyle = '#1e293b';
  ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 24px "Noto Serif Telugu", serif';
  const aspectBody = lang === 'en' ? rashi.grahaDrishtiPhalamEn : rashi.grahaDrishtiPhalamTe;
  wrapCanvasText(ctx, aspectBody, 92, 684, 896, 40, 4);

  // 5. Career, Finance, Family & Daily Guidance Card
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
  ctx.font = lang === 'en' ? 'bold 25px sans-serif' : 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? '💼 Career & Financial Outlook:' : '💼 వృత్తి, ఉద్యోగం & ధనలాభం:', 92, 930);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? '23px sans-serif' : '24px "Noto Serif Telugu", serif';
  wrapCanvasText(ctx, cleanCareerText, 92, 970, 896, 36, 2);

  ctx.fillStyle = '#92400e';
  ctx.font = lang === 'en' ? 'bold 25px sans-serif' : 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? '🏡 Family, Health & Personal Life:' : '🏡 కుటుంబం & ఆరోగ్యం:', 92, 1062);
  ctx.fillStyle = '#0f172a';
  ctx.font = lang === 'en' ? '23px sans-serif' : '24px "Noto Serif Telugu", serif';
  wrapCanvasText(ctx, cleanFamilyText, 92, 1102, 896, 36, 2);

  // Do Today & Avoid Today Pills inside the box
  drawRoundedRect(ctx, 88, 1184, 904, 72, 16);
  ctx.fillStyle = '#ecfdf5';
  ctx.fill();
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#065f46';
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  wrapCanvasText(
    ctx,
    lang === 'en' ? `✅ Do Today: ${rashi.doTodayEn}` : `✅ నేడు చేయవలసిన పని: ${rashi.doTodayTe}`,
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
  ctx.font = lang === 'en' ? 'bold 21px sans-serif' : 'bold 22px "Noto Serif Telugu", serif';
  wrapCanvasText(
    ctx,
    lang === 'en' ? `⚠️ Avoid Today: ${rashi.avoidTodayEn}` : `⚠️ నేడు జాగ్రత్త: ${rashi.avoidTodayTe}`,
    108,
    1312,
    864,
    30,
    2
  );

  // 6. Shubha Samayam, Lucky Color & Vedic Remedy Card
  drawRoundedRect(ctx, 60, 1380, 960, 218, 26);
  ctx.fillStyle = '#fef3c7';
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 24px "Noto Serif Telugu", serif';
  const luckyLine =
    lang === 'en'
      ? `⏰ Lucky Time: ${rashi.luckyTimeWindowEn}   •   🎨 Color: ${rashi.luckyColorEn}   •   🔢 Lucky #: #${rashi.luckyNumber}`
      : `⏰ శుభ సమయం: ${rashi.luckyTimeWindowTe}   •   🎨 రంగు: ${rashi.luckyColor}   •   🔢 సంఖ్య: #${rashi.luckyNumber}`;
  ctx.fillText(luckyLine, 92, 1432, 896);

  ctx.fillStyle = '#78350f';
  ctx.font = lang === 'en' ? 'bold 24px sans-serif' : 'bold 25px "Noto Serif Telugu", serif';
  ctx.fillText(lang === 'en' ? '🪔 Daily Vedic Remedy:' : '🪔 నేటి శాస్త్రోక్త పరిహారం:', 92, 1486);
  ctx.fillStyle = '#1e293b';
  ctx.font = lang === 'en' ? 'bold 23px sans-serif' : 'bold 24px "Noto Serif Telugu", serif';
  wrapCanvasText(ctx, lang === 'en' ? rashi.remedyEn : rashi.remedy, 92, 1528, 896, 36, 2);

  // 7. Bottom Viral Footer
  ctx.fillStyle = '#fde68a';
  ctx.font = lang === 'en' ? 'bold 24px sans-serif' : 'bold 25px "Noto Serif Telugu", serif';
  ctx.fillText(
    lang === 'en'
      ? '✨ Free 100-Page Kundali PDF, Daily Panchangam & Astrology:'
      : '✨ ఉచిత 100 పేజీల జన్మ కుండలి PDF, నేటి పంచాంగం & రాశి ఫలాల కోసం చూడండి:',
    68,
    1662,
    944
  );

  // Prominent Gold Website CTA Badge
  drawRoundedRect(ctx, 68, 1688, 944, 88, 44);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#3b1103';
  ctx.font = 'bold 42px sans-serif';
  drawMeasuredCenteredText(ctx, '🌐 www.telugujyothisham.com', 68, 944, 1747, 24);

  ctx.fillStyle = '#ffffff';
  ctx.font = lang === 'en' ? 'bold 24px sans-serif' : 'bold 26px "Noto Serif Telugu", sans-serif';
  ctx.fillText(
    lang === 'en'
      ? '📞 Vedic Consultation & Homam inquiries on WhatsApp: +91 8977986166'
      : '📞 వ్యక్తిగత జాతక పరిశీలన & హోమాల కొరకు WhatsApp: +91 8977986166',
    68,
    1832,
    944
  );

  // Export & trigger download
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const fileName =
        lang === 'en'
          ? `english-horoscope-${rashi.id}-${day.id}-telugujyothisham.png`
          : `${rashi.id}-rashi-phalam-${day.id}-telugujyothisham.png`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      resolve();
    }, 'image/png');
  });
}
