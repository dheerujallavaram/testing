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

export function generateDeepavaliPoojaSamagriCanvas(): Buffer {
  const width = 1200;
  const height = 1850;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Divine Parchment Background
  ctx.fillStyle = '#faf7ee';
  ctx.fillRect(0, 0, width, height);

  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fdfbf4');
  bgGrad.addColorStop(0.5, '#fffef9');
  bgGrad.addColorStop(1, '#f6f0dd');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Triple Sacred Borders (Gold & Deep Amber)
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 7;
  drawRoundedRect(ctx, 24, 24, width - 48, height - 48, 26);
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 36, 36, width - 72, height - 72, 20);
  ctx.stroke();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 44, 44, width - 88, height - 88, 16);
  ctx.stroke();

  // Corner decorative dots
  const corners = [
    [52, 52],
    [width - 52, 52],
    [52, height - 52],
    [width - 52, height - 52],
  ];
  ctx.fillStyle = '#b45309';
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. TOP ROYAL HEADER CARD (TEMPLE & PUROHITAM / JYOTHISHAM BRANDING)
  const topGrad = ctx.createLinearGradient(54, 52, width - 54, 265);
  topGrad.addColorStop(0, '#380a0a');
  topGrad.addColorStop(0.5, '#5e1010');
  topGrad.addColorStop(1, '#380a0a');
  ctx.fillStyle = topGrad;
  drawRoundedRect(ctx, 54, 52, width - 108, 215, 18);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 58, 56, width - 116, 207, 16);
  ctx.stroke();

  // Top Auspicious Shanti Invocations
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, '|| శ్రీరస్తు  •  శుభమస్తు  •  శ్రీ కనకమహాలక్ష్మీ ప్రసన్నః  •  అవిఘ్నమస్తు ||', width / 2, 88);

  // Main Peetham Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', width / 2, 142, 980);

  // Services Banner: Jyothisham & Purohitam
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 23px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'వేద జ్యోతిషం  •  గృహ / వ్యాపార వాస్తు  •  శాస్త్రోక్త స్మార్త పురోహిత సేవలు', width / 2, 185);

  // Acharya Name & Official Contact
  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 19px "Noto Serif Telugu", serif';
  drawCenteredText(
    ctx,
    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ  (పురోహితులు & జ్యోతిష విద్వాంసులు)  |  ఫోన్: 7013079166 / 8977986166',
    width / 2,
    224,
    1000
  );

  ctx.fillStyle = '#fbcfe8';
  ctx.font = '16px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'అధికారిక వెబ్‌సైట్: www.telugujyothisham.com   |   స్థలం: హయత్‌నగర్, హైదరాబాద్', width / 2, 252);

  // 4. MAIN FESTIVAL BANNER RIBBON
  const festY = 285;
  ctx.fillStyle = '#fef3c7';
  drawRoundedRect(ctx, 70, festY, width - 140, 72, 16);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 30px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'దీపావళి పర్వదిన శ్రీ మహాలక్ష్మీ పూజా సామగ్రి & కార్యక్రమ వివరములు', width / 2, festY + 46);

  // 5. TWO-COLUMN PUJA SAMAGRI CARDS
  const colY = 372;
  const colH = 880;
  const colW = (width - 160) / 2; // 520 px each
  const col1X = 70;
  const col2X = col1X + colW + 20;

  // --- COLUMN 1: పూజా ద్రవ్యములు (Sacred Ingredients) ---
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, col1X, colY, colW, colH, 18);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Col 1 Header
  ctx.fillStyle = '#78350f';
  drawRoundedRect(ctx, col1X, colY, colW, 48, 16);
  ctx.fill();
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, '1. ప్రధాన పూజా సామగ్రి & ద్రవ్యములు', col1X + colW / 2, colY + 32);

  // Column 1 Items
  const col1Items: [string, string][] = [
    ['పసుపు', '50 గ్రాములు'],
    ['కుంకుమ', '50 గ్రాములు'],
    ['గంధము', '1 డబ్బా'],
    ['తమలపాకులు', '50 ఆకులు'],
    ['వక్కలు', '15 సంఖ్య'],
    ['అగరుబత్తీలు', '1 ప్యాకెట్'],
    ['హారతి కర్పూరం', '50 గ్రాములు'],
    ['విడిపూలు', 'అరకిలో (తాజావి)'],
    ['పూలమాల', 'యథాశక్తి (స్వామి/అమ్మవారికి)'],
    ['గరిక & మామిడికొమ్మలు', 'తగినంత'],
    ['కొబ్బరికాయలు', '3 కాయలు'],
    ['అరటిపండ్లు', '1 డజను'],
    ['గుమ్మడికాయలు', '2 (మామూలుది 1, పండుది 1)'],
    ['ఐదు రకాల పండ్లు', 'శక్తికొలది నైవేద్యార్థం'],
    ['కలశం చెంబులు', '2 సంఖ్య'],
    ['బెల్లం', 'కొద్దిగా (నైవేద్యం)'],
    ['వత్తుల ప్యాకెట్', '1 ప్యాకెట్'],
    ['నువ్వులనూనె & ఆవునెయ్యి', 'దీపారాధనకు తగినంత'],
    ['అగ్గిపెట్టెలు', '1-2 సంఖ్య'],
    ['బియ్యం', '2 కిలోలు'],
    ['కొత్త లెక్కల పుస్తకాలు / పెన్నులు', 'వ్యాపార/గృహ ఆశీర్వచనానికి'],
    ['నాణేలు / కాయిన్స్', 'రూపాయి / వెండి కాయిన్స్'],
  ];

  let c1Y = colY + 76;
  ctx.font = '16.5px "Noto Serif Telugu", serif';
  for (const [name, qty] of col1Items) {
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';
    ctx.fillText(`• ${name}`, col1X + 16, c1Y);

    ctx.fillStyle = '#991b1b';
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px "Noto Serif Telugu", serif';
    ctx.fillText(qty, col1X + colW - 16, c1Y);

    ctx.font = '16.5px "Noto Serif Telugu", serif';
    // thin divider
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(col1X + 16, c1Y + 7);
    ctx.lineTo(col1X + colW - 16, c1Y + 7);
    ctx.stroke();

    c1Y += 36;
  }

  // --- COLUMN 2: పంచామృతాలు, పాత్రలు & పరికరములు ---
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, col2X, colY, colW, colH, 18);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Col 2 Header
  ctx.fillStyle = '#78350f';
  drawRoundedRect(ctx, col2X, colY, colW, 48, 16);
  ctx.fill();
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, '2. పంచామృతాలు, పాత్రలు & పరికరములు', col2X + colW / 2, colY + 32);

  // Section 2A: పంచామృతాలు (Box)
  const panchaY = colY + 60;
  ctx.fillStyle = '#fffbeb';
  drawRoundedRect(ctx, col2X + 14, panchaY, colW - 28, 170, 12);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 17px "Noto Serif Telugu", serif';
  ctx.textAlign = 'left';
  ctx.fillText('• పంచామృతములు (తగినంత సిద్ధం చేసుకొనవలెను):', col2X + 26, panchaY + 28);

  const panchaItems = [
    '• ఆవు పాలు (కొద్దిగా)',
    '• ఆవు పెరుగు (కొద్దిగా)',
    '• స్వచ్ఛమైన ఆవునెయ్యి (కొద్దిగా)',
    '• స్వచ్ఛమైన తేనె (కొద్దిగా)',
    '• తెల్ల పంచదార (కొద్దిగా)',
  ];
  let pY = panchaY + 54;
  ctx.fillStyle = '#334155';
  ctx.font = '16px "Noto Serif Telugu", serif';
  for (const p of panchaItems) {
    ctx.fillText(p, col2X + 32, pY);
    pY += 24;
  }

  // Section 2B: పూజా పాత్రలు & వస్తువులు
  const patraY = panchaY + 185;
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 17px "Noto Serif Telugu", serif';
  ctx.textAlign = 'left';
  ctx.fillText('• పూజకు కావలసిన గృహ పాత్రలు & వస్తువులు:', col2X + 20, patraY);

  const col2Items: string[] = [
    '• దీపారాధన కుందులు (2 లేదా తగినన్ని)',
    '• పళ్ళెములు (పూల పళ్ళెం, ప్రసాదం పళ్ళెం)',
    '• పూజా ట్రేలు & గ్లాసులు',
    '• కప్పు గిన్నెలు & విడి గిన్నెలు',
    '• పంచపాత్రలు – 2 సెట్లు (ఉద్ధరిణెలతో)',
    '• ఏకహారతి & పూజా ఘంట',
    '• చాకు + కత్తెర (పండ్లు, పువ్వుల కొరకు)',
    '• పూజా పీటలు & కూర్చునుటకు ఆసనములు',
    '• కొబ్బరికాయ కొట్టే రాయి (శుభ్రముగా కడిగినది)',
  ];

  let c2Y = patraY + 30;
  ctx.fillStyle = '#1e293b';
  ctx.font = '16px "Noto Serif Telugu", serif';
  for (const item of col2Items) {
    ctx.fillText(item, col2X + 22, c2Y);

    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(col2X + 22, c2Y + 7);
    ctx.lineTo(col2X + colW - 22, c2Y + 7);
    ctx.stroke();

    c2Y += 34;
  }

  // Section 2C: ప్రాంగణ శుద్ధి గమనిక Box
  const noticeY = c2Y + 14;
  ctx.fillStyle = '#ecfdf5';
  drawRoundedRect(ctx, col2X + 14, noticeY, colW - 28, 175, 12);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 16.5px "Noto Serif Telugu", serif';
  ctx.textAlign = 'left';
  ctx.fillText('• పూజా ప్రాంగణ శుద్ధి & అలంకరణ నియమములు:', col2X + 24, noticeY + 28);

  ctx.fillStyle = '#1e293b';
  ctx.font = '15px "Noto Serif Telugu", serif';
  ctx.fillText('• పూజా స్థలాన్ని శుభ్రముగా కడిగించి పవిత్రం చేయాలి.', col2X + 28, noticeY + 58);
  ctx.fillText('• ప్రధాన ద్వారానికి పచ్చి మామిడి తోరణం కట్టాలి.', col2X + 28, noticeY + 88);
  ctx.fillText('• అవకాశం ఉంటే బంతిపూల మాలలు కూడా కట్టవలెను.', col2X + 28, noticeY + 118);
  ctx.fillText('• ముంగిట్లో లక్ష్మీ కటాక్షానికి బియ్యప్పిండి ముగ్గులు వేయాలి.', col2X + 28, noticeY + 148);

  // 6. KARYAKRAMA VIVARALU (PUJA SEQUENCE) & BLESSINGS
  const seqY = 1268;
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, 70, seqY, width - 140, 160, 18);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Sequence Ribbon Header
  ctx.fillStyle = '#7c2d12';
  drawRoundedRect(ctx, 70, seqY, width - 140, 42, 16);
  ctx.fill();
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, '3. దీపావళి లక్ష్మీపూజా కార్యక్రమ క్రమము (Pooja Ritual Order)', width / 2, seqY + 28);

  // Sequence Steps (horizontal grid-like layout)
  const steps = [
    '1. గణపతి పూజ & పుణ్యాహవాచనం',
    '2. మహాలక్ష్మీ, సరస్వతీ అష్టోత్తర పూజ',
    '3. నూతన ఖాతా పుస్తక పూజ & లేఖిని పూజ',
    '4. మహామంగళహారతి & సామూహిక ఆశీర్వచనం',
    '5. ఆఫీస్ / వ్యాపార సంస్థకు గుమ్మడికాయ దిష్టి తీయడం',
  ];

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 17px "Noto Serif Telugu", serif';
  ctx.textAlign = 'left';

  let sY = seqY + 70;
  ctx.fillText(`• ${steps[0]}`, 100, sY);
  ctx.fillText(`• ${steps[1]}`, 600, sY);

  sY += 34;
  ctx.fillText(`• ${steps[2]}`, 100, sY);
  ctx.fillText(`• ${steps[3]}`, 600, sY);

  sY += 34;
  ctx.fillStyle = '#991b1b';
  ctx.fillText(`• ${steps[4]}  —  || శుభమ్ భూయాత్ ||`, 100, sY);

  // 7. PUROHIT & ASTROLOGY CONSULTATION AD / PROMOTIONAL CARD
  const adY = 1445;
  const adGrad = ctx.createLinearGradient(70, adY, width - 70, adY + 225);
  adGrad.addColorStop(0, '#fef3c7');
  adGrad.addColorStop(0.5, '#fffbeb');
  adGrad.addColorStop(1, '#fed7aa');
  ctx.fillStyle = adGrad;
  drawRoundedRect(ctx, 70, adY, width - 140, 225, 20);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Ad Badge
  ctx.fillStyle = '#991b1b';
  drawRoundedRect(ctx, 96, adY + 16, 320, 36, 10);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Noto Serif Telugu", serif';
  drawCenteredText(ctx, 'జ్యోతిషం & పురోహితం విశేష సేవలు', 256, adY + 40);

  // Ad Headings
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 24px "Noto Serif Telugu", serif';
  ctx.textAlign = 'left';
  ctx.fillText('మీ ఇల్లు, వ్యాపార సంస్థలకు శాస్త్రోక్త పూజలు & జాతక పరిశీలన కొరకు సంప్రదించండి', 100, adY + 84);

  // Services Bullet Grid
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 17.5px "Noto Serif Telugu", serif';
  ctx.fillText('• జాతక పరిశీలన & 100 పేజీల జన్మ కుండలి (PDF)', 100, adY + 118);
  ctx.fillText('• వివాహ పొంతన, శుభ ముహూర్త నిర్ణయములు', 600, adY + 118);

  ctx.fillText('• గృహప్రవేశం, చండీ / లక్ష్మీ గణపతి హోమములు', 100, adY + 150);
  ctx.fillText('• కార్తీక మాస ఏకవార రుద్రాభిషేక నిత్య సంకల్పం', 600, adY + 150);

  // Priest Contact Highlight Strip inside Ad Box
  const contactStripY = adY + 172;
  ctx.fillStyle = '#78350f';
  drawRoundedRect(ctx, 90, contactStripY, width - 180, 42, 10);
  ctx.fill();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 19px "Noto Serif Telugu", serif';
  drawCenteredText(
    ctx,
    'పురోహితులు: బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ  |  సంప్రదించండి: 7013079166 / 8977986166',
    width / 2,
    contactStripY + 28
  );

  // 8. BOTTOM ROYAL FOOTER STRIP
  const botY = 1688;
  const botGrad = ctx.createLinearGradient(54, botY, width - 54, botY + 84);
  botGrad.addColorStop(0, '#380a0a');
  botGrad.addColorStop(0.5, '#5e1010');
  botGrad.addColorStop(1, '#380a0a');
  ctx.fillStyle = botGrad;
  drawRoundedRect(ctx, 54, botY, width - 108, 84, 16);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 58, botY + 4, width - 116, 76, 14);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 18px "Noto Serif Telugu", serif';
  drawCenteredText(
    ctx,
    'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం  •  www.telugujyothisham.com  •  వాట్సాప్ & కాల్: +91 7013079166 / 8977986166',
    width / 2,
    botY + 36
  );

  ctx.fillStyle = '#fed7aa';
  ctx.font = '15px "Noto Serif Telugu", serif';
  drawCenteredText(
    ctx,
    'దృక్సిద్ధాంత నిత్య పంచాంగం • రాశి ఫలాలు • ఉచిత జాతకం • ముహూర్తాలు • పూజా సేవలు కొరకు మా వెబ్‌సైట్‌ను దర్శించండి',
    width / 2,
    botY + 64
  );

  return canvas.toBuffer('image/png');
}

export function saveDeepavaliFiles() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  const pngBuffer = generateDeepavaliPoojaSamagriCanvas();
  const pngPath = path.join(publicDir, 'deepavali-lakshmi-pooja-samagri.png');
  fs.writeFileSync(pngPath, pngBuffer);

  // PDF Generation with proportional A4 / clean margins
  const pdfDoc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const base64Img = `data:image/png;base64,${pngBuffer.toString('base64')}`;
  pdfDoc.addImage(base64Img, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  const pdfPath = path.join(publicDir, 'deepavali-lakshmi-pooja-samagri.pdf');
  const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'deepavali-lakshmi-pooja-samagri.png'), pngBuffer);
    fs.writeFileSync(path.join(distDir, 'deepavali-lakshmi-pooja-samagri.pdf'), pdfBuffer);
  }

  console.log(`✅ Deepavali PNG: ${pngPath} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Deepavali PDF: ${pdfPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
}

saveDeepavaliFiles();
