import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Telugu fonts
const fontPathRegular = path.join(__dirname, 'fonts', 'NotoSerifTelugu.ttf');
const fontPathBold = path.join(__dirname, 'fonts', 'NotoSerifTelugu-Bold.ttf');
if (fs.existsSync(fontPathRegular)) {
  GlobalFonts.registerFromPath(fontPathRegular, 'Noto Serif Telugu');
}
if (fs.existsSync(fontPathBold)) {
  GlobalFonts.registerFromPath(fontPathBold, 'Noto Serif Telugu');
}

function drawRoundedRect(
  ctx: any,
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

function drawCenteredText(ctx: any, text: string, centerX: number, y: number, maxWidth?: number) {
  ctx.textAlign = 'center';
  if (maxWidth) {
    ctx.fillText(text, centerX, y, maxWidth);
  } else {
    ctx.fillText(text, centerX, y);
  }
}

// Draw traditional golden floral diya lamp
function drawDiya(ctx: any, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Flame glow
  const glow = ctx.createRadialGradient(0, -22, 2, 0, -22, 32);
  glow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.55)');
  glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -22, 32, 0, Math.PI * 2);
  ctx.fill();

  // Flame outer
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(0, -36);
  ctx.quadraticCurveTo(10, -22, 6, -10);
  ctx.quadraticCurveTo(0, -4, -6, -10);
  ctx.quadraticCurveTo(-10, -22, 0, -36);
  ctx.closePath();
  ctx.fill();

  // Flame core
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.moveTo(0, -30);
  ctx.quadraticCurveTo(6, -20, 3, -12);
  ctx.quadraticCurveTo(0, -6, -3, -12);
  ctx.quadraticCurveTo(-6, -20, 0, -30);
  ctx.closePath();
  ctx.fill();

  // Brass bowl
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(-22, -6);
  ctx.quadraticCurveTo(-26, 8, 0, 14);
  ctx.quadraticCurveTo(26, 8, 22, -6);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Brass base
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(-12, 14);
  ctx.lineTo(12, 14);
  ctx.lineTo(16, 22);
  ctx.lineTo(-16, 22);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Draw small vector lotus / star ornament
function drawOrnament(ctx: any, cx: number, cy: number, color = '#b45309', size = 8) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export async function generateAmmaBirthdayPoster(mode: 'portrait' | 'family'): Promise<Buffer> {
  const width = 1240;
  const height = 1754; // Exact A4 proportion (1 : 1.4145)
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Rich Sandalwood / Parchment Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fffefb');
  bgGrad.addColorStop(0.3, '#fdfbf2');
  bgGrad.addColorStop(0.7, '#faf4e4');
  bgGrad.addColorStop(1, '#f7edd7');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Triple Sacred Borders (Royal Maroon & Polished Gold)
  ctx.strokeStyle = '#881337'; // Royal Maroon
  ctx.lineWidth = 10;
  drawRoundedRect(ctx, 28, 28, width - 56, height - 56, 28);
  ctx.stroke();

  ctx.strokeStyle = '#d97706'; // Gold
  ctx.lineWidth = 3.5;
  drawRoundedRect(ctx, 44, 44, width - 88, height - 88, 22);
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b'; // Amber Gold
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 52, 52, width - 104, height - 104, 18);
  ctx.stroke();

  // Corner Rosettes
  const corners = [
    [64, 64],
    [width - 64, 64],
    [64, height - 64],
    [width - 64, height - 64],
  ];
  ctx.fillStyle = '#881337';
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 3. TOP ROYAL TEMPLE HEADER CARD (SITE BRANDING & INVOCATIONS)
  const headerY = 62;
  const headerH = 172;
  const topGrad = ctx.createLinearGradient(64, headerY, width - 64, headerY + headerH);
  topGrad.addColorStop(0, '#380a0a');
  topGrad.addColorStop(0.5, '#6b1414');
  topGrad.addColorStop(1, '#380a0a');
  ctx.fillStyle = topGrad;
  drawRoundedRect(ctx, 64, headerY, width - 128, headerH, 18);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 69, headerY + 5, width - 138, headerH - 10, 15);
  ctx.stroke();

  // Top Invocations
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '|| శ్రీ మాత్రే నమః  •  శ్రీ లక్ష్మీగణపతయే నమః  •  శ్రీ గురుభ్యో నమః ||',
    width / 2,
    headerY + 36
  );

  // Main Temple Brand
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Noto Serif Telugu"';
  drawCenteredText(ctx, 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', width / 2, headerY + 86, 1000);

  // Services Subtitle
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 21px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'వేద జ్యోతిషం  •  గృహ/వ్యాపార వాస్తు  •  శాస్త్రోక్త స్మార్త పురోహిత సేవలు',
    width / 2,
    headerY + 123
  );

  // Guruji Identity & Official URL
  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 18px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ  |  ఫోన్: 7013079166 / 8977986166  |  www.telugujyothisham.com',
    width / 2,
    headerY + 155,
    1100
  );

  // 4. AUSPICIOUS BIRTHDAY BANNER SCROLL
  const bannerY = 248;
  const bannerH = 78;
  const bannerGrad = ctx.createLinearGradient(72, bannerY, width - 72, bannerY + bannerH);
  bannerGrad.addColorStop(0, '#fef3c7');
  bannerGrad.addColorStop(0.5, '#fde68a');
  bannerGrad.addColorStop(1, '#fef3c7');
  ctx.fillStyle = bannerGrad;
  drawRoundedRect(ctx, 72, bannerY, width - 144, bannerH, 16);
  ctx.fill();

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 72, bannerY, width - 144, bannerH, 16);
  ctx.stroke();

  // Side Ornaments on Banner
  drawOrnament(ctx, 120, bannerY + 40, '#991b1b', 10);
  drawOrnament(ctx, width - 120, bannerY + 40, '#991b1b', 10);

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 31px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '|| పరమపూజ్య మాతృమూర్తికి జన్మదిన శుభాకాంక్షలు ||',
    width / 2,
    bannerY + 41
  );

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 18.5px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '|| ఆయురారోగ్య ఐశ్వర్య సద్బుద్ధి నిత్య సంతోష ప్రాప్తిరస్తు ||',
    width / 2,
    bannerY + 68
  );

  // 5. CENTERPIECE PHOTOGRAPH EMBEDDING
  const photoPath = path.resolve(
    process.cwd(),
    'public/assets/aistudio/e2234e43-86a4-47bf-9987-bc6c040b713c_b443295b.jpeg'
  );
  const img = await loadImage(photoPath);

  if (mode === 'portrait') {
    // Mode A: Focus on Amma's serene, smiling portrait
    const frameW = 490;
    const frameH = 650;
    const frameX = (width - frameW) / 2;
    const frameY = 346;

    // Glowing halo behind frame
    const halo = ctx.createRadialGradient(
      frameX + frameW / 2,
      frameY + frameH / 2,
      120,
      frameX + frameW / 2,
      frameY + frameH / 2,
      380
    );
    halo.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    halo.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
    halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(frameX - 60, frameY - 40, frameW + 120, frameH + 80);

    // Diya lamps flanking the frame
    drawDiya(ctx, frameX - 70, frameY + frameH / 2, 1.4);
    drawDiya(ctx, frameX + frameW + 70, frameY + frameH / 2, 1.4);

    drawDiya(ctx, frameX - 60, frameY + frameH - 60, 1.2);
    drawDiya(ctx, frameX + frameW + 60, frameY + frameH - 60, 1.2);

    // Outer Gold Card Frame
    ctx.fillStyle = '#b45309';
    drawRoundedRect(ctx, frameX - 10, frameY - 10, frameW + 20, frameH + 20, 26);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, frameX - 6, frameY - 6, frameW + 12, frameH + 12, 24);
    ctx.stroke();

    // Clip & Draw Amma
    ctx.save();
    drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 20);
    ctx.clip();

    // Source coordinates for Amma crop from 1500x1000 original:
    ctx.drawImage(img, 955, 280, 465, 620, frameX, frameY, frameW, frameH);
    ctx.restore();

    // Inner gold border over picture
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 20);
    ctx.stroke();
  } else {
    // Mode B: Full Family Wedding Photograph
    const frameW = 960;
    const frameH = 640;
    const frameX = (width - frameW) / 2;
    const frameY = 346;

    // Glowing halo
    const halo = ctx.createRadialGradient(
      frameX + frameW / 2,
      frameY + frameH / 2,
      150,
      frameX + frameW / 2,
      frameY + frameH / 2,
      520
    );
    halo.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
    halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(frameX - 40, frameY - 30, frameW + 80, frameH + 60);

    // Flanking Diyas
    drawDiya(ctx, frameX - 45, frameY + frameH / 2, 1.3);
    drawDiya(ctx, frameX + frameW + 45, frameY + frameH / 2, 1.3);

    // Outer Gold Card Frame
    ctx.fillStyle = '#b45309';
    drawRoundedRect(ctx, frameX - 10, frameY - 10, frameW + 20, frameH + 20, 24);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, frameX - 6, frameY - 6, frameW + 12, frameH + 12, 22);
    ctx.stroke();

    // Clip & Draw full family
    ctx.save();
    drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 18);
    ctx.clip();
    ctx.drawImage(img, 0, 0, img.width, img.height, frameX, frameY, frameW, frameH);
    ctx.restore();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 18);
    ctx.stroke();
  }

  // 6. HEARTFELT DEDICATED QUOTE CARD (FROM GURUJI)
  const quoteCardY = 1018;
  const quoteCardH = 432;
  const quoteCardW = width - 144;
  const quoteCardX = 72;

  // Cream parchment with gold border
  ctx.fillStyle = '#fffdf7';
  drawRoundedRect(ctx, quoteCardX, quoteCardY, quoteCardW, quoteCardH, 20);
  ctx.fill();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, quoteCardX, quoteCardY, quoteCardW, quoteCardH, 20);
  ctx.stroke();

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, quoteCardX + 5, quoteCardY + 5, quoteCardW - 10, quoteCardH - 10, 16);
  ctx.stroke();

  // Quote Header Strip
  const quoteHeadH = 42;
  const quoteHeadGrad = ctx.createLinearGradient(
    quoteCardX,
    quoteCardY,
    quoteCardX + quoteCardW,
    quoteCardY + quoteHeadH
  );
  quoteHeadGrad.addColorStop(0, '#781515');
  quoteHeadGrad.addColorStop(1, '#540d0d');
  ctx.fillStyle = quoteHeadGrad;

  ctx.beginPath();
  ctx.moveTo(quoteCardX + 20, quoteCardY);
  ctx.lineTo(quoteCardX + quoteCardW - 20, quoteCardY);
  ctx.quadraticCurveTo(quoteCardX + quoteCardW, quoteCardY, quoteCardX + quoteCardW, quoteCardY + 20);
  ctx.lineTo(quoteCardX + quoteCardW, quoteCardY + quoteHeadH);
  ctx.lineTo(quoteCardX, quoteCardY + quoteHeadH);
  ctx.lineTo(quoteCardX, quoteCardY + 20);
  ctx.quadraticCurveTo(quoteCardX, quoteCardY, quoteCardX + 20, quoteCardY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 20px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '|| మాతృ సంస్తుతి  •  మాతృ రుణం తీర్చుకోలేనిది ||',
    width / 2,
    quoteCardY + 28
  );

  // Exact Quote requested by User in Large, Bold, Crisp Letters
  let textY = quoteCardY + 84;

  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 31px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '“ మాతృదేవో భవ ”',
    width / 2,
    textY
  );

  textY += 46;
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 25.5px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'అనే వేద వాక్కుకు నిలువెత్తు నిదర్శనం నువ్వు.',
    width / 2,
    textY
  );

  textY += 46;
  ctx.fillStyle = '#881337';
  ctx.font = 'bold 24.5px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'నా ప్రతి సంకల్పంలోనూ, ప్రతి విజయంలోనూ నీ ఆశీస్సులే మూలం.',
    width / 2,
    textY,
    quoteCardW - 60
  );

  textY += 46;
  ctx.fillStyle = '#334155';
  ctx.font = '22px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'శ్రీలక్ష్మీగణపతి, పరమేశ్వరుని సంపూర్ణ దివ్యానుగ్రహంతో మీరు సదా ఆయురారోగ్యాలతో,',
    width / 2,
    textY,
    quoteCardW - 50
  );

  textY += 38;
  ctx.font = '22px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'సకల సుఖశాంతులు, ఆనంద ఐశ్వర్యాలతో నిండు నూరేళ్లు వర్ధిల్లాలని మనసారా ప్రార్థిస్తూ...',
    width / 2,
    textY,
    quoteCardW - 50
  );

  textY += 54;
  // Prominent Birthday Greeting Line
  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 34px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '|| శ్రీరస్తు • జన్మదిన శుభాకాంక్షలు అమ్మా! • శుభమస్తు ||',
    width / 2,
    textY
  );

  // Little sub-text
  textY += 36;
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 20px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '— మీ చరణ కమలములకు భక్తి ప్రపత్తులతో శతకోటి పాదాభివందనములు —',
    width / 2,
    textY
  );

  // 7. FOOTER CARD (GURUJI DEDICATION & OFFICIAL BRAND DETAILS)
  const footY = 1472;
  const footH = 142;
  const footW = width - 128;
  const footX = 64;

  const footGrad = ctx.createLinearGradient(footX, footY, footX + footW, footY + footH);
  footGrad.addColorStop(0, '#380a0a');
  footGrad.addColorStop(0.5, '#5e1010');
  footGrad.addColorStop(1, '#380a0a');
  ctx.fillStyle = footGrad;
  drawRoundedRect(ctx, footX, footY, footW, footH, 18);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, footX + 5, footY + 5, footW - 10, footH - 10, 14);
  ctx.stroke();

  ctx.fillStyle = '#fed7aa';
  ctx.font = '19px "Noto Serif Telugu"';
  drawCenteredText(ctx, 'భవదీయుడు / మీ పాదసేవలో నిరంతరం:', width / 2, footY + 34);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 27px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ  (పురోహితులు & జ్యోతిష విద్వాంసులు)',
    width / 2,
    footY + 68,
    footW - 40
  );

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 20px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం  •  హయత్‌నగర్, హైదరాబాద్  •  ఫోన్: 7013079166 / 8977986166',
    width / 2,
    footY + 101,
    footW - 40
  );

  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 17.5px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'www.telugujyothisham.com  •  సర్వేజనాః సుఖినోభవంతు  •  సమస్త సన్మంగళాని భవంతు',
    width / 2,
    footY + 128,
    footW - 40
  );

  // Bottom-most copyright line
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 16px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    '|| శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం అధికారిక ప్రత్యేక ప్రచురణ  •  TeluguJyothisham.com ||',
    width / 2,
    height - 38
  );

  return canvas.toBuffer('image/png');
}

export async function saveAllBirthdayAssets() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  console.log('🎨 Generating Amma Birthday Portrait Card...');
  const portraitPngBuffer = await generateAmmaBirthdayPoster('portrait');
  const portraitPngPath = path.join(publicDir, 'amma-janmadina-shubhakankshalu.png');
  fs.writeFileSync(portraitPngPath, portraitPngBuffer);

  // Create A4 PDF for portrait
  const portraitPdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const b64Portrait = `data:image/png;base64,${portraitPngBuffer.toString('base64')}`;
  portraitPdf.addImage(b64Portrait, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  const portraitPdfPath = path.join(publicDir, 'amma-janmadina-shubhakankshalu.pdf');
  const portraitPdfBuffer = Buffer.from(portraitPdf.output('arraybuffer'));
  fs.writeFileSync(portraitPdfPath, portraitPdfBuffer);

  console.log('🎨 Generating Amma Birthday Family Card...');
  const familyPngBuffer = await generateAmmaBirthdayPoster('family');
  const familyPngPath = path.join(publicDir, 'amma-janmadina-shubhakankshalu-family.png');
  fs.writeFileSync(familyPngPath, familyPngBuffer);

  // Create A4 PDF for family
  const familyPdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const b64Family = `data:image/png;base64,${familyPngBuffer.toString('base64')}`;
  familyPdf.addImage(b64Family, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  const familyPdfPath = path.join(publicDir, 'amma-janmadina-shubhakankshalu-family.pdf');
  const familyPdfBuffer = Buffer.from(familyPdf.output('arraybuffer'));
  fs.writeFileSync(familyPdfPath, familyPdfBuffer);

  // Copy to dist if dist exists
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'amma-janmadina-shubhakankshalu.png'), portraitPngBuffer);
    fs.writeFileSync(path.join(distDir, 'amma-janmadina-shubhakankshalu.pdf'), portraitPdfBuffer);
    fs.writeFileSync(path.join(distDir, 'amma-janmadina-shubhakankshalu-family.png'), familyPngBuffer);
    fs.writeFileSync(path.join(distDir, 'amma-janmadina-shubhakankshalu-family.pdf'), familyPdfBuffer);
  }

  console.log(`✅ Amma Portrait PNG: ${portraitPngPath} (${(portraitPngBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Amma Portrait PDF: ${portraitPdfPath} (${(portraitPdfBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Amma Family PNG: ${familyPngPath} (${(familyPngBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Amma Family PDF: ${familyPdfPath} (${(familyPdfBuffer.length / 1024).toFixed(1)} KB)`);
}

saveAllBirthdayAssets().catch(console.error);
