import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Noto Serif Telugu font
const fontPath = path.join(__dirname, 'fonts', 'NotoSerifTelugu.ttf');
if (fs.existsSync(fontPath)) {
  GlobalFonts.registerFromPath(fontPath, 'Noto Serif Telugu');
}

interface PramanaPatramData {
  refId: string;
  isSample: boolean;
  gotram: string;
  kartaName: string;
  wifeName: string;
  childrenNames: string;
  dakshinaText: string;
  dateText: string;
  outputPath: string;
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

export function generatePramanaPatramImage(data: PramanaPatramData): Buffer {
  const width = 1200;
  const height = 1600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Rich Divine Background (Sacred ivory/sandal parchment)
  ctx.fillStyle = '#faf7ee';
  ctx.fillRect(0, 0, width, height);

  // Subtle parchment texture tint
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fbf8ef');
  bgGrad.addColorStop(0.5, '#fffdf8');
  bgGrad.addColorStop(1, '#f7f2e4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ornate Golden Outer Borders
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 28, 28, width - 56, height - 56, 28);
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 40, 40, width - 80, height - 80, 22);
  ctx.stroke();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 48, 48, width - 96, height - 96, 18);
  ctx.stroke();

  // Corner decorative flourishes
  const corners = [
    [58, 58],
    [width - 58, 58],
    [58, height - 58],
    [width - 58, height - 58],
  ];
  ctx.fillStyle = '#b45309';
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. TOP ROYAL MAROON BANNER CARD
  const topGrad = ctx.createLinearGradient(60, 56, width - 60, 246);
  topGrad.addColorStop(0, '#3b0707');
  topGrad.addColorStop(0.5, '#5c1010');
  topGrad.addColorStop(1, '#3b0707');
  ctx.fillStyle = topGrad;
  drawRoundedRect(ctx, 60, 56, width - 120, 190, 16);
  ctx.fill();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 64, 60, width - 128, 182, 14);
  ctx.stroke();

  // Top Invocational Mantra
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, '|| ఓం శ్రీలక్ష్మి గణపతయే నమః  •  ఓం నమః శివాయ  •  శ్రీ మాత్రే నమః ||', width / 2, 92);

  // TEMPLE NAME & GURUJI
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', width / 2, 148, 960);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 23px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో', width / 2, 190);

  ctx.fillStyle = '#fed7aa';
  ctx.font = '17px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'అధికారిక వేదిక: www.telugujyothisham.com   |   వాట్సాప్: +91 8977986166', width / 2, 224);

  // Horizontal divider
  ctx.fillStyle = '#b45309';
  ctx.fillRect(80, 260, width - 160, 3);

  // Sample Watermark if sample
  if (data.isSample) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
    ctx.font = 'bold 110px "Noto Serif Telugu", serif';
    ctx.textAlign = 'center';
    ctx.fillText('నమూనా పత్రం • SAMPLE', 0, 0);
    ctx.restore();
  }

  // 6. CERTIFICATE EMBLEM & TITLE
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 36px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'కార్తీక మాస పవిత్ర ఏకవార రుద్రాభిషేక', width / 2, 320);

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 44px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'సంకల్ప ధ్రువీకరణ ప్రమాణ పత్రము', width / 2, 375);

  ctx.fillStyle = '#78350f';
  ctx.font = 'italic 20px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'శ్రీ సాంబసదాశివ అనుగ్రహ కటాక్ష సిద్ధిరస్తు • సర్వాభీష్ట ఫలప్రాప్తిరస్తు', width / 2, 415);

  // Certificate Meta Strip (Ref ID & Date)
  ctx.fillStyle = '#fef3c7';
  drawRoundedRect(ctx, 100, 440, width - 200, 52, 14);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 20px "Noto Serif Telugu", serif';
  ctx.textAlign = 'left';
  ctx.fillText(`సంకల్ప రిఫరెన్స్ సంఖ్య: ${data.refId}`, 130, 474);
  ctx.textAlign = 'right';
  ctx.fillText(`పూజా కాలం: ${data.dateText}`, width - 130, 474);

  // 7. DEVOTEE SANKALPA CARD (Gold parchment box)
  const cardY = 520;
  const cardH = 430;
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, 100, cardY, width - 200, cardH, 20);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Card Header Ribbon
  ctx.fillStyle = '#78350f';
  drawRoundedRect(ctx, 100, cardY, width - 200, 56, 18);
  ctx.fill();
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 24px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'పూజా కర్తల పవిత్ర గోత్రనామముల వివరములు', width / 2, cardY + 38);

  // Devotee details table inside the card
  const details: { label: string; val: string; color: string; bold: boolean }[] = [
    { label: 'పవిత్ర గోత్రము:', val: `${data.gotram} గోత్రోద్భవః`, color: '#991b1b', bold: true },
  ];

  if (data.wifeName && data.wifeName !== '—') {
    details.push(
      { label: 'కర్త / గృహపతి:', val: `${data.kartaName} గారు`, color: '#1e293b', bold: true },
      { label: 'ధర్మపత్ని:', val: `${data.wifeName} గారు`, color: '#1e293b', bold: true },
      { label: 'సుపుత్రుడు / కుటుంబ సభ్యులు:', val: `${data.childrenNames} గారు`, color: '#1e293b', bold: true }
    );
  } else {
    details.push(
      { label: 'మాతృమూర్తి / పూజా కర్త:', val: `${data.kartaName} గారు`, color: '#1e293b', bold: true },
      { label: 'సుపుత్రుడు / సంకల్ప కర్త:', val: `${data.childrenNames} గారు`, color: '#1e293b', bold: true },
      { label: 'సంకల్ప విశేషం:', val: 'కార్తీక మాస పరమశివ ఏకవార రుద్రాభిషేకం', color: '#78350f', bold: true }
    );
  }

  let currentLineY = cardY + 115;
  for (const item of details) {
    // Label
    ctx.textAlign = 'left';
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 24px "Noto Serif Telugu", serif';
    ctx.fillText(item.label, 140, currentLineY);

    // Value
    ctx.fillStyle = item.color;
    ctx.font = item.bold ? 'bold 27px "Noto Serif Telugu", serif' : '25px "Noto Serif Telugu", serif';
    ctx.fillText(item.val, 500, currentLineY);

    // Divider dot line
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(140, currentLineY + 18);
    ctx.lineTo(width - 140, currentLineY + 18);
    ctx.stroke();

    currentLineY += 66;
  }

  // Sankalpam Purpose inside card bottom
  ctx.fillStyle = '#451a03';
  ctx.font = 'italic bold 20px "Noto Serif Telugu", serif';
  drawCenteredText(
    ctx,
    'సంకల్పం: కుటుంబ క్షేమ, స్థైర్య, విజయ, ఆయురారోగ్య ఐశ్వర్యాభివృద్ధి & సమస్త గ్రహదోష నివారణార్థం',
    width / 2,
    cardY + 395,
    920
  );

  // 8. DAKSHINA & PRASADAM DISPATCH SECTION
  const dakshinaY = 980;
  ctx.fillStyle = '#fef9c3';
  drawRoundedRect(ctx, 100, dakshinaY, width - 200, 150, 20);
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 24px "Noto Serif Telugu", serif';
  ctx.fillText('• రుద్రాభిషేక దక్షిణ: ₹2,500/- (నెల రోజుల పూజకు సంపూర్ణంగా స్వీకరించబడినది)', 140, dakshinaY + 45);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 21px "Noto Serif Telugu", serif';
  ctx.fillText('• భక్తుల స్వగృహానికి స్పీడ్ పోస్ట్ ద్వారా చేర్చబడు దివ్య ప్రసాదములు:', 140, dakshinaY + 86);

  ctx.fillStyle = '#451a03';
  ctx.font = '19px "Noto Serif Telugu", serif';
  ctx.fillText('   - పరమశివుని చందన గంధం   - మహాన్యాస వేద విభూతి   - కాశీ విశ్వనాథుని కాలభైరవ రక్షా సూత్రం', 150, dakshinaY + 122);

  // 9. SACRED VEDIC BLESSINGS SHLOKA
  const shlokaY = 1170;
  ctx.fillStyle = '#fdf2e9';
  drawRoundedRect(ctx, 100, shlokaY, width - 200, 140, 20);
  ctx.fill();
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 22px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'ఓం త్ర్యంబకం యజామహే సుగంధిం పుష్టివర్ధనమ్ |', width / 2, shlokaY + 45);
  drawCenteredText(ctx, 'ఉర్వారుకమివ బంధనాన్ మృత్యోర్ముక్షీయ మామృతాత్ ||', width / 2, shlokaY + 80);

  ctx.fillStyle = '#9a3412';
  ctx.font = '19px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'శ్రీ సాంబసదాశివుని దివ్య కృపాకటాక్షములు మీ కుటుంబమునకు సదా రక్షగా ఉండుగాక!', width / 2, shlokaY + 115);

  // 10. OFFICIAL SEAL & PRIEST SIGNATURE FOOTER
  const signY = 1350;

  // Left side: Official Trust Seal
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(230, signY + 45, 50, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 15px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'శ్రీలక్ష్మి గణపతి', 230, signY + 35);
  drawCenteredText(ctx, 'జ్యోతిషాలయం', 230, signY + 55);
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 12px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, '★ అధికారిక ముద్ర ★', 230, signY + 75);

  // Center: Sacred Blessing
  ctx.fillStyle = '#78350f';
  ctx.font = 'italic bold 21px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'ధర్మో రక్షతి రక్షితః • శుభం భవతు', width / 2, signY + 50);

  // Right side: Guruji Signature & Title
  ctx.textAlign = 'right';
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 25px "Noto Serif Telugu", serif';
  ctx.fillText('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ', width - 120, signY + 30);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 19px "Noto Serif Telugu", serif';
  ctx.fillText('ప్రధానార్చకులు & వేద జ్యోతిష నిపుణులు', width - 120, signY + 62);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px "Noto Serif Telugu", serif';
  ctx.fillText('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (హైదరాబాద్)', width - 120, signY + 90);

  // 11. BOTTOM ROYAL MAROON STRIP
  const botGrad = ctx.createLinearGradient(60, 1520, width - 60, 1564);
  botGrad.addColorStop(0, '#3b0707');
  botGrad.addColorStop(0.5, '#5c1010');
  botGrad.addColorStop(1, '#3b0707');
  ctx.fillStyle = botGrad;
  drawRoundedRect(ctx, 60, 1520, width - 120, 44, 10);
  ctx.fill();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 62, 1522, width - 124, 40, 8);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 17px "Noto Serif Telugu", serif';
  drawCenteredText(
    ctx,
    'www.telugujyothisham.com   •   వాట్సాప్: +91 8977986166   •   Kotak UPI: 7013079166@kotakbank',
    width / 2,
    1548
  );

  return canvas.toBuffer('image/png');
}

function saveAsPdf(pngBuffer: Buffer, outputPath: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const base64Img = `data:image/png;base64,${pngBuffer.toString('base64')}`;
  doc.addImage(base64Img, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  const pdfArrayBuffer = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfArrayBuffer));
}

// Generate both certificates (PNG + PDF)
export function runCertificateGeneration() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  // 1. Kishan Rao Certificate
  const kishanData: PramanaPatramData = {
    refId: 'SLG-KARTIKA-2026-BH701',
    isSample: false,
    gotram: 'భరద్వాజస',
    kartaName: 'కిషన్ రావ్',
    wifeName: 'మాలతి',
    childrenNames: 'రాఘవేంద్ర రావు',
    dakshinaText: '₹2,500/-',
    dateText: 'కార్తీక మాసము (నవంబర్ 2026)',
    outputPath: path.join(publicDir, 'pramana-patram-kishan-rao.png'),
  };

  const kishanBuffer = generatePramanaPatramImage(kishanData);
  fs.writeFileSync(kishanData.outputPath, kishanBuffer);
  const kishanPdfPath = path.join(publicDir, 'pramana-patram-kishan-rao.pdf');
  saveAsPdf(kishanBuffer, kishanPdfPath);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'pramana-patram-kishan-rao.png'), kishanBuffer);
    fs.writeFileSync(path.join(distDir, 'pramana-patram-kishan-rao.pdf'), fs.readFileSync(kishanPdfPath));
  }
  console.log(`✅ Generated PNG: ${kishanData.outputPath} (${(kishanBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Generated PDF: ${kishanPdfPath} (${(fs.statSync(kishanPdfPath).size / 1024).toFixed(1)} KB)`);

  // 2. Dummy Sample Certificate for Group Sharing
  const sampleData: PramanaPatramData = {
    refId: 'SLG-KARTIKA-SAMPLE-001',
    isSample: true,
    gotram: 'కౌశికస (నమూనా)',
    kartaName: 'సురేష్ శర్మ (నమూనా)',
    wifeName: 'లక్ష్మీ ప్రసన్న',
    childrenNames: 'సాయి కార్తీక్, మేఘన',
    dakshinaText: '₹2,500/-',
    dateText: 'కార్తీక మాసము (నవంబర్ 2026)',
    outputPath: path.join(publicDir, 'pramana-patram-sample.png'),
  };

  const sampleBuffer = generatePramanaPatramImage(sampleData);
  fs.writeFileSync(sampleData.outputPath, sampleBuffer);
  const samplePdfPath = path.join(publicDir, 'pramana-patram-sample.pdf');
  saveAsPdf(sampleBuffer, samplePdfPath);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'pramana-patram-sample.png'), sampleBuffer);
    fs.writeFileSync(path.join(distDir, 'pramana-patram-sample.pdf'), fs.readFileSync(samplePdfPath));
  }
  console.log(`✅ Generated PNG: ${sampleData.outputPath} (${(sampleBuffer.length / 1024).toFixed(1)} KB)`);
  // 3. Munipalle Bhavani Devi & Sriharsha Manikanta Anjaneya Sharma Certificate
  const sriharshaData: PramanaPatramData = {
    refId: 'SLG-KARTIKA-2026-KA702',
    isSample: false,
    gotram: 'కణ్వాస',
    kartaName: 'మునిపల్లె భవాని దేవి',
    wifeName: '—',
    childrenNames: 'శ్రీహర్ష మణికంఠ ఆంజనేయ శర్మ',
    dakshinaText: '₹2,500/-',
    dateText: 'కార్తీక మాసము (నవంబర్ 2026)',
    outputPath: path.join(publicDir, 'pramana-patram-sriharsha.png'),
  };

  const sriharshaBuffer = generatePramanaPatramImage(sriharshaData);
  fs.writeFileSync(sriharshaData.outputPath, sriharshaBuffer);
  const sriharshaPdfPath = path.join(publicDir, 'pramana-patram-sriharsha.pdf');
  saveAsPdf(sriharshaBuffer, sriharshaPdfPath);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'pramana-patram-sriharsha.png'), sriharshaBuffer);
    fs.writeFileSync(path.join(distDir, 'pramana-patram-sriharsha.pdf'), fs.readFileSync(sriharshaPdfPath));
  }
  console.log(`✅ Generated PNG: ${sriharshaData.outputPath} (${(sriharshaBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Generated PDF: ${sriharshaPdfPath} (${(fs.statSync(sriharshaPdfPath).size / 1024).toFixed(1)} KB)`);
}

runCertificateGeneration();
