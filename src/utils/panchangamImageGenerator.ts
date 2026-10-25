import { DayData } from '../types/panchangam';

/**
 * Helper to wrap text onto canvas lines
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
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1) {
        const remaining = words.slice(n).join(' ');
        ctx.fillText(
          remaining.length > 55 ? remaining.slice(0, 52) + '...' : remaining,
          x,
          currentY
        );
        return currentY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
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
 * Generates a 1080x1440 WhatsApp Status / Instagram Portrait PNG image of the Daily Panchangam
 */
export async function downloadDailyPanchangamCardImage(day: DayData): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

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

  // 2. Top Temple Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText('ఓం శ్రీలక్ష్మి గణపతయే నమః • దృక్సిద్ధాంత నిత్య పంచాంగం', 540, 82);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px "Noto Serif Telugu", serif';
  ctx.fillText('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', 540, 145);

  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 28px "Noto Serif Telugu", serif';
  ctx.fillText('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (వేద పండితులు & జ్యోతిష నిపుణులు)', 540, 195);

  // Date Pill Banner
  drawRoundedRect(ctx, 90, 225, 900, 74, 37);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 34px "Noto Serif Telugu", serif';
  ctx.fillText(`📅 ${day.teediVaram}`, 540, 274);

  // 3. Samvatsaram & Masam Bar
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 28px "Noto Serif Telugu", serif';
  ctx.fillText(`${day.panchanga.samvatsaram}  •  ${day.panchanga.masam}`, 540, 345);

  // 4. Core Panchangam Limbs Card (White Box)
  drawRoundedRect(ctx, 64, 375, 952, 360, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = 'left';
  const limbs = [
    { label: '🌙 తిథి:', value: day.panchanga.tithi },
    { label: '⭐ నక్షత్రం:', value: day.panchanga.nakshatram },
    { label: '✨ యోగం & కరణం:', value: `${day.panchanga.yogam}  |  ${day.panchanga.karanam}` },
    { label: '🌅 సూర్యోదయం / అస్తమయం:', value: 'ఉదయం 06:34 AM  /  సాయంత్రం 05:40 PM' },
    { label: '🪔 ఆరాధ్య దైవం & శుభ రంగు:', value: `${day.deity}  |  ${day.luckyColor}` },
  ];

  let rowY = 432;
  limbs.forEach((item, idx) => {
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 25px "Noto Serif Telugu", serif';
    ctx.fillText(item.label, 96, rowY);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 25px "Noto Serif Telugu", serif';
    const maxValWidth = 600;
    const displayVal = item.value.length > 48 ? item.value.slice(0, 46) + '...' : item.value;
    ctx.fillText(displayVal, 415, rowY, maxValWidth);

    if (idx < limbs.length - 1) {
      ctx.beginPath();
      ctx.moveTo(96, rowY + 20);
      ctx.lineTo(984, rowY + 20);
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    rowY += 66;
  });

  // 5. Two-Column Muhurtham Boxes (Green Auspicious & Red Inauspicious)
  // Left: Shubha Samayalu
  drawRoundedRect(ctx, 64, 760, 460, 250, 22);
  ctx.fillStyle = '#ecfdf5';
  ctx.fill();
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText('✅ శుభ సమయాలు', 92, 808);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText('అభిజిత్ ముహూర్తం:', 92, 852);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(day.shubha.abhijit, 92, 885, 405);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText('అమృత ఘడియలు:', 92, 932);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 21px "Noto Serif Telugu", serif';
  ctx.fillText(day.shubha.amrutha.slice(0, 38), 92, 965, 405);

  // Right: Ashubha Samayalu
  drawRoundedRect(ctx, 556, 760, 460, 250, 22);
  ctx.fillStyle = '#fff1f2';
  ctx.fill();
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#9f1239';
  ctx.font = 'bold 27px "Noto Serif Telugu", serif';
  ctx.fillText('⚠️ వర్జించవలసిన సమయాలు', 584, 808);

  ctx.fillStyle = '#be123c';
  ctx.font = 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText('రాహు కాలం:', 584, 852);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText(day.ashubha.rahukalam, 584, 885, 405);

  ctx.fillStyle = '#be123c';
  ctx.font = 'bold 22px "Noto Serif Telugu", serif';
  ctx.fillText('వర్జ్యం:', 584, 932);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 21px "Noto Serif Telugu", serif';
  ctx.fillText(day.ashubha.varjyam.slice(0, 38), 584, 965, 405);

  // 6. Today's Vishesham / Phalitham Box
  drawRoundedRect(ctx, 64, 1035, 952, 210, 22);
  ctx.fillStyle = '#fffbeb';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText('🌸 నేటి పంచాంగ విశేషం & దైవ ఆరాధన:', 94, 1082);

  ctx.fillStyle = '#1e293b';
  ctx.font = '24px "Noto Serif Telugu", serif';
  wrapCanvasText(ctx, day.phalitham || 'సర్వజన శుభకృత్', 94, 1126, 890, 36, 3);

  // 7. Bottom Footer Branding
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 26px "Noto Serif Telugu", serif';
  ctx.fillText('జాతక పరిశీలన, వివాహ ముహూర్తాలు & హోమాల కొరకు సంప్రదించండి:', 540, 1318);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px "Noto Serif Telugu", sans-serif';
  ctx.fillText('📞 WhatsApp: +91 8977986166   |   🌐 www.telugujyothisham.com', 540, 1368);

  // Export & trigger download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const fileName = `telugu-panchangam-${day.id}.png`;
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
