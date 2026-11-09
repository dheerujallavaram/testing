import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Noto Serif Telugu fonts
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

// Word-wrap function for Telugu canvas text
function wrapText(ctx: any, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export interface StorySection {
  title: string;
  badge: string;
  paragraphs: string[];
}

export const KEDARESWARA_SECTIONS_PAGE1: StorySection[] = [
  {
    title: '1. కైలాస సభా వైభవం & భృంగి మహర్షి నృత్యం',
    badge: 'కథా ప్రారంభం',
    paragraphs: [
      'పరమేశ్వరుని అర్థాంగి పార్వతీదేవి తన పతి శరీరంలో అర్థభాగం పొందు నిమిత్తము చేసిన పరమ పవిత్ర వ్రతమైన కేదారేశ్వర వ్రతం గురించి చెబుతాను. శ్రద్ధతో వినవలసింది అని సూత మహర్షి శౌనకాది మునులకు ఉపదేశించారు.',
      'పూర్వం పరమశివుడు పార్వతీ సమేతుడై కైలాసంలో నిండుసభలో కొలువై ఉన్నారు. సిద్ధ-సాధ్య-కింపురుష-యక్ష-గంధర్వులు శివుడిని సేవిస్తున్నారు. దేవముని గణాలు శివుడిని స్తుతిస్తున్నారు. ఋషులు, మునులు, అగ్ని, వాయువు, వరుణుడు, సూర్యచంద్రులు, తారలు, నవగ్రహాలు, ప్రమథగణాలు, కుమారస్వామి, వినాయకుడు, వీరభద్రుడు, నందీశ్వరుడు సభలో ఆసీనులై ఉన్నారు. నారద, తుంబురులు శివలీలాగానం చేస్తున్నారు. సమస్త వృక్షములు, దివ్య పుష్పాలతో చతుర్దశ భువనాలు పులకిస్తున్నాయి.',
      'అలాంటి ఆనందకోలాహలంలో పరమ శివభక్తాగ్రగణ్యుడైన భృంగురీటి ఆనందపులకితుడై నాట్యం చేయసాగాడు. అతడు వినోదభరిత నాట్యభంగిమలతో సభాసదులను, శివుడ్ని మెప్పించాడు. శివుడు అతన్ని అభినందించి ప్రక్కనే ఉన్న పార్వతిని విడిచిపెట్టి సింహాసనంపై నుండి లేచి భృంగురీటిని తన అమృత హస్తంతో తట్టి ఆశీర్వదించాడు. అదే అదునుగా భృంగి మొదలుకొని వందిమాగధులు శివుడికి మాత్రమే ప్రదక్షిణం చేసి నమస్కరించారు.',
    ],
  },
  {
    title: '2. జగన్మాత పార్వతీదేవి వైరాగ్యం & గౌతమాశ్రమ ప్రవేశం',
    badge: 'అర్థాంగ ప్రాప్తి సంకల్పం',
    paragraphs: [
      'ఇది గమనించిన పార్వతి భర్తను చేరి "నాథా! నన్ను విడిచి మీకు మాత్రమే వీరు నమస్కరించారు. ఆటపాటలతో మిమ్మల్ని మెప్పించి మీనుండి నన్ను వేరుచేసి ఇలా ఎలా చేశారు?" అని ప్రశ్నించింది. అప్పుడు సదాశివుడు సతీమణి పార్వతిని దగ్గరకు తీసుకుని "దేవీ! పరమార్థ విదులైన యోగులు ముక్తి స్వరూపుడనైన నన్ను మాత్రమే ఆశ్రయిస్తారు, నీవలన ప్రయోజనం కలుగదని నిన్ను ఉపేక్షించి నాకు మాత్రమే నమస్కరించారు" అని జవాబు ఇచ్చాడు.',
      'సాక్షాత్ పరమేశ్వరుని ఇల్లాలినై ఉండి కూడా శివునితో సమానమైన దండప్రణామాలకు నోచుకోని అయోగ్యురాలినా అని కోపగించి, ఈశ్వరునితో సమానమైన యోగ్యతను సంపాదించడం కోసం తపస్సు చేయాలని పార్వతీదేవి నిశ్చయించుకుంది. కైలాసాన్ని వదిలి పక్షుల కిలకిలా రావాలతో, పవిత్ర యజ్ఞధూమాలతో విలసిల్లుతున్న గౌతమ మహర్షి ఆశ్రమానికి విచ్చేసింది.',
      'ఆశ్రమవాసులు ఆమెను చూసి అతిథిమర్యాదలు చేసి "తల్లీ నీవు ఎవరివి? ఎక్కడినుండి వచ్చావు? నీ రాకకు గల అగత్యం ఏమిటి?" అని ప్రశ్నించారు. అందుకు పార్వతి "నేను హిమవంతుని పుత్రికను, సాక్షాత్ పరమేశ్వరుని ఇల్లాలిని. శివుని సతిగా నా నాథునితో సమానమైన యోగ్యతను పొంది ఆయన శరీరంలో అర్థభాగాన్ని పొందడానికి తగిన వ్రతాన్ని నాకు ఉపదేశించండి" అని ప్రార్థించింది.',
    ],
  },
  {
    title: '3. గౌతమ మహర్షిచే కేదారేశ్వర వ్రతోపదేశం & విధివిధానం',
    badge: 'వ్రత విధి & సిద్ధికాలం',
    paragraphs: [
      'గౌతమ మహర్షి సంతుష్టుడై "జగజ్జననీ! ఈప్సితార్థదాయకమైన ఉత్తమ వ్రతం కేదారేశ్వర వ్రతం. దీనిని భాద్రపద శుక్ల అష్టమి నాడు ఆరంభించాలి. శుచిగా స్నానమాచరించి 21 దారముల తోరణాన్ని చేతికి ధరించి, షోడశోపచారాలతో కేదారేశ్వరుని పూజించి ఉపవాసం ఉండాలి. ధాన్యపురాశిపై పూర్ణకుంభాన్ని ఉంచి, 21 సార్లు సూత్రాన్ని చుట్టి, పట్టువస్త్రం, నవరత్నాలు లేదా సువర్ణాన్ని ఉంచి పూజించాలి. 21 మంది బ్రాహ్మణుల పాదాలు కడిగి కదళీ-పనస ఫలాలు, తాంబూల దక్షిణలతో తృప్తిపరచాలి. అష్టమి నుండి అమావాస్య వరకు నిష్ఠతో ఈ వ్రతాన్ని ఆచరిస్తే ఈశ్వరుడు సంపూర్ణంగా అనుగ్రహిస్తాడు" అని వివరించారు.',
      'గౌతమ మహర్షి చెప్పిన విధివిధానాలతో పార్వతీదేవి భక్తిప్రపత్తులతో కేదారేశ్వర వ్రతాన్ని ఆచరించింది. పరమేశ్వరుడు ప్రత్యక్షమై సంతుష్టాంతరంగితుడై జగజ్జననిని తన శరీరంలో వామభాగమున (సగభాగమున) నిలిపి అర్ధనారీశ్వరుడుగా అనుగ్రహించాడు. పార్వతీదేవి సంతుష్టురాలై భర్తతో కలసి కైలాసానికి చేరుకుంది.',
    ],
  },
];

export const KEDARESWARA_SECTIONS_PAGE2: StorySection[] = [
  {
    title: '4. గంధర్వుడు చిత్రాంగదుడు & ఉజ్జయినీ రాజు వజ్రదంతుని సార్వభౌమత్వం',
    badge: 'భూలోక ప్రచారం',
    paragraphs: [
      'కొంతకాలానికి నందికేశ్వరుని వలన ఈ కేదారేశ్వర వ్రత మహత్తును విన్న చిత్రాంగదుడు అనే గంధర్వుడు, మానవాళి క్షేమం కొరకు భూలోకానికి విచ్చేసి ఉజ్జయినీ నగర మహారాజైన వజ్రదంతునికి ఈ వ్రత విధిని ఉపదేశించాడు.',
      'వజ్రదంతుడు అత్యంత భక్తిశ్రద్ధలతో కేదారేశ్వర వ్రతాన్ని ఆచరించి, సమస్త శత్రువులను జయించి, అఖండ రాజ్యసౌభాగ్యాలతో చక్రవర్తి (సార్వభౌముడు) అయ్యాడు.',
    ],
  },
  {
    title: '5. వైశ్య పుత్రికలు పుణ్యవతి, భాగ్యవతిల వ్రతాచరణ & రాజభోగాలు',
    badge: 'కష్ట నివారణ & సౌభాగ్య ప్రాప్తి',
    paragraphs: [
      'ఉజ్జయినీ నగరంలో ఒక పేద వైశ్యునికి పుణ్యవతి, భాగ్యవతి అనే ఇద్దరు కుమార్తెలు జన్మించారు. వారు తండ్రి అనుమతితో ఒక వటవృక్షం కింద చేరి తోరణాలు కట్టుకుని నిష్ఠతో కేదారేశ్వర వ్రతం చేసుకున్నారు. వారి భక్తికి మెచ్చిన మహేశ్వరుడు పూజాసామాగ్రిని అనుగ్రహించి, వారికి దివ్య రూపం, సకల ఐశ్వర్యాలు ప్రసాదించాడు.',
      'యుక్తవయస్సు రాగానే పెద్దామె పుణ్యవతిని ఉజ్జయినీ మహారాజు, చిన్నామె భాగ్యవతిని చోళ దేశపు రాజు పరిణయమాడారు. వారి తండ్రి అయిన వైశ్యుడు కూడా రాజభోగాలు, పుత్రసంతానంతో చిరకాలం సుఖంగా జీవించాడు.',
    ],
  },
  {
    title: '6. వ్రత విస్మరణ దోషం, భాగ్యవతి దీనస్థితి & పునఃవ్రత ఫలం',
    badge: 'వ్రత నిష్ఠా మహత్యం & సంపూర్ణ ఫలశ్రుతి',
    paragraphs: [
      'కాలక్రమంలో చిన్నకుమార్తె భాగ్యవతి ఐశ్వర్యమదంతో కేదారేశ్వర వ్రతాన్ని మరిచిపోయింది. శివానుగ్రహం నశించి, భర్త ఆగ్రహానికి గురై కుమారునితో సహా రాజ్యం నుండి బహిష్కరించబడి ఒక బోయవాని ఇంట దీనంగా ఆశ్రయం పొందింది.',
      'ఆమె తన కుమారుని ఉజ్జయినీ రాణి అయిన పెద్దతల్లి వద్దకు సహాయం కోసం పంపింది. పెద్దతల్లి ఇచ్చిన ధనంతో కుమారుడు తిరిగివస్తుండగా, మార్గమధ్యంలో పరమశివుడే చోరుని (దొంగ) రూపంలో వచ్చి ఆ ధనాన్ని రెండుసార్లు అపహరించాడు. మూడవసారి శివుడు ఆకాశవాణి రూపంలో "ఓయీ! నీ తల్లి కేదారేశ్వర వ్రతాన్ని మానివేసిన కారణంగా ఈ ధనం మీకు దక్కదు" అని ప్రబోధించాడు.',
      'ఈ వృత్తాంతం తెలుసుకున్న పెద్దతల్లి పుణ్యవతి, తన చెల్లెలి కుమారునితో స్వయంగా కేదారేశ్వర వ్రతం చేయించి ధనసహాయం చేసింది. తల్లి భాగ్యవతికి వ్రతం చేయమని ఉపదేశించింది. భాగ్యవతి తన తప్పును తెలుసుకుని పశ్చాత్తాపంతో కేదారేశ్వర వ్రతాన్ని కల్పోక్తంగా ఆచరించింది. తక్షణమే చోళ మహారాజు సకల సైన్యంతో వచ్చి భాగ్యవతిని, కుమారుని సగౌరవంగా రాజధానికి తీసుకెళ్ళాడు. ఆమె ప్రతి సంవత్సరం కేదారవ్రతాన్ని ఆచరిస్తూ సకల సౌభాగ్యాలతో తరించింది.',
      'ఫలశ్రుతి: ఎవరు ఈ కేదారేశ్వర వ్రతాన్ని నియమనిష్టలతో కల్పోక్తంగా ఆచరిస్తారో, వారు సమస్త దారిద్ర్య దోషాలనుండి విముక్తులై, సకల సౌభాగ్యాలతో జీవించి అంత్యమున కైలాస ప్రాప్తి పొందుతారు. || ఇతి శ్రీ కేదారేశ్వర వ్రత కథ సంపూర్ణం ||',
    ],
  },
];

// Canvas dimensions strictly proportional to A4 (1350 x 1909 -> exactly 210mm x 297mm)
const CANVAS_WIDTH = 1350;
const CANVAS_HEIGHT = 1909;

function renderPage(
  ctx: any,
  width: number,
  height: number,
  pageNumber: number,
  totalPages: number,
  sections: StorySection[]
) {
  // 1. Divine Sandal Parchment Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fdfaf2');
  bgGrad.addColorStop(0.5, '#fffefb');
  bgGrad.addColorStop(1, '#f9f3e4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Triple Sacred Borders (Gold & Maroon)
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 28, 28, width - 56, height - 56, 26);
  ctx.stroke();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3.5;
  drawRoundedRect(ctx, 42, 42, width - 84, height - 84, 20);
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 50, 50, width - 100, height - 100, 16);
  ctx.stroke();

  // Corner Dots
  const corners = [
    [60, 60],
    [width - 60, 60],
    [60, height - 60],
    [width - 60, height - 60],
  ];
  ctx.fillStyle = '#991b1b';
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. TOP ROYAL HEADER CARD (TEMPLE BRANDING)
  const headerY = 56;
  const headerHeight = 180;
  const topGrad = ctx.createLinearGradient(60, headerY, width - 60, headerY + headerHeight);
  topGrad.addColorStop(0, '#3b0a0a');
  topGrad.addColorStop(0.5, '#631010');
  topGrad.addColorStop(1, '#3b0a0a');
  ctx.fillStyle = topGrad;
  drawRoundedRect(ctx, 60, headerY, width - 120, headerHeight, 18);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 65, headerY + 5, width - 130, headerHeight - 10, 15);
  ctx.stroke();

  // Header Text
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu"';
  drawCenteredText(ctx, '|| ఓం నమః శివాయ  •  శ్రీ సాంబసదాశివాయ నమః  •  శ్రీ మాత్రే నమః ||', width / 2, headerY + 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Noto Serif Telugu"';
  drawCenteredText(ctx, 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', width / 2, headerY + 86, 1100);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 22.5px "Noto Serif Telugu"';
  drawCenteredText(ctx, 'వేద జ్యోతిషం  •  గృహ/వ్యాపార వాస్తు  •  శాస్త్రోక్త స్మార్త పురోహిత సేవలు', width / 2, headerY + 125);

  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 18.5px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ  |  ఫోన్: 7013079166 / 8977986166  |  www.telugujyothisham.com',
    width / 2,
    headerY + 160,
    1150
  );

  // 4. VRATA KATHA TITLE BANNER
  const titleY = 252;
  const titleHeight = 58;
  ctx.fillStyle = '#fef3c7';
  drawRoundedRect(ctx, 68, titleY, width - 136, titleHeight, 14);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 29px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    `శ్రీ కేదారేశ్వర స్వామి పవిత్ర వ్రత కథ (భాగం - ${pageNumber})`,
    width / 2,
    titleY + 39
  );

  // Page indicator badge
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 18px "Noto Serif Telugu"';
  ctx.textAlign = 'right';
  ctx.fillText(`పుట ${pageNumber} / ${totalPages}`, width - 90, titleY + 37);

  // 5. STORY SECTIONS BODY - BEAUTIFULLY ENCLOSED CARDS
  const contentWidth = width - 144; // 1206 px wide
  const boxX = 72;
  const cardPaddingX = 26;
  const textAvailableWidth = contentWidth - cardPaddingX * 2; // 1154 px wide

  // Distinct typography tailored per page for maximum legibility and zero squishing
  const fontSizeNum = pageNumber === 1 ? 22 : 24;
  const lineHeight = pageNumber === 1 ? 36.5 : 40.5;
  const parGap = pageNumber === 1 ? 16 : 22;
  const cardGap = pageNumber === 1 ? 22 : 30;
  const headerBarH = pageNumber === 1 ? 42 : 46;
  const topPadToText = pageNumber === 1 ? 30 : 34; // Generous distance between header bar and first line
  const bottomCardPad = pageNumber === 1 ? 20 : 26;

  let currentCardY = 328;

  for (const sec of sections) {
    // 5a. Pre-calculate lines for each paragraph to compute total card height
    ctx.font = `${fontSizeNum}px "Noto Serif Telugu"`;
    const wrappedParagraphs: string[][] = [];
    let textBlockHeight = topPadToText;

    for (let pi = 0; pi < sec.paragraphs.length; pi++) {
      const p = sec.paragraphs[pi];
      const lines = wrapText(ctx, p, textAvailableWidth);
      wrappedParagraphs.push(lines);
      textBlockHeight += lines.length * lineHeight;
      if (pi < sec.paragraphs.length - 1) {
        textBlockHeight += parGap;
      }
    }
    const cardHeight = headerBarH + textBlockHeight + bottomCardPad;

    // 5b. Draw Card Container (Soft Cream Parchment with Gold Border)
    ctx.fillStyle = '#fffdf7';
    drawRoundedRect(ctx, boxX, currentCardY, contentWidth, cardHeight, 14);
    ctx.fill();

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.8;
    drawRoundedRect(ctx, boxX, currentCardY, contentWidth, cardHeight, 14);
    ctx.stroke();

    // 5c. Draw Card Header Strip (Rich Crimson / Maroon)
    const cardHeadGrad = ctx.createLinearGradient(boxX, currentCardY, boxX + contentWidth, currentCardY + headerBarH);
    cardHeadGrad.addColorStop(0, '#781515');
    cardHeadGrad.addColorStop(1, '#540d0d');
    ctx.fillStyle = cardHeadGrad;
    
    // Draw top rounded bar
    ctx.beginPath();
    ctx.moveTo(boxX + 14, currentCardY);
    ctx.lineTo(boxX + contentWidth - 14, currentCardY);
    ctx.quadraticCurveTo(boxX + contentWidth, currentCardY, boxX + contentWidth, currentCardY + 14);
    ctx.lineTo(boxX + contentWidth, currentCardY + headerBarH);
    ctx.lineTo(boxX, currentCardY + headerBarH);
    ctx.lineTo(boxX, currentCardY + 14);
    ctx.quadraticCurveTo(boxX, currentCardY, boxX + 14, currentCardY);
    ctx.closePath();
    ctx.fill();

    // Gold divider line below header bar
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(boxX, currentCardY + headerBarH);
    ctx.lineTo(boxX + contentWidth, currentCardY + headerBarH);
    ctx.stroke();

    // Section Title (Left)
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 21px "Noto Serif Telugu"';
    ctx.textAlign = 'left';
    ctx.fillText(sec.title, boxX + 20, currentCardY + (headerBarH / 2) + 7);

    // Section Badge (Right)
    ctx.fillStyle = '#fed7aa';
    ctx.font = 'bold 17px "Noto Serif Telugu"';
    ctx.textAlign = 'right';
    ctx.fillText(`[ ${sec.badge} ]`, boxX + contentWidth - 20, currentCardY + (headerBarH / 2) + 7);

    // 5d. Render Story Text inside Card with spacious, uncompressed typography
    let lineY = currentCardY + headerBarH + topPadToText;
    ctx.fillStyle = '#1c1917';
    ctx.font = `${fontSizeNum}px "Noto Serif Telugu"`;
    ctx.textAlign = 'left';

    for (let pi = 0; pi < wrappedParagraphs.length; pi++) {
      const lines = wrappedParagraphs[pi];
      for (const line of lines) {
        ctx.fillText(line, boxX + cardPaddingX, lineY);
        lineY += lineHeight;
      }
      lineY += parGap;
    }

    currentCardY += cardHeight + cardGap;
  }

  // 6. GURUJI BLESSINGS STRIP (ABOVE FOOTER)
  const blessY = 1716;
  const blessH = 74;
  ctx.fillStyle = '#fef3c7';
  drawRoundedRect(ctx, 68, blessY, width - 136, blessH, 14);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 20.5px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'పరమేశ్వరుని కృపాకటాక్షాలతో సమస్త మనోభీష్టములు సిద్ధించుగాక  •  || శుభమ్ భూయాత్ ||',
    width / 2,
    blessY + 31
  );

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 19px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'పురోహితులు & జ్యోతిష విద్వాంసులు: బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ  |  హయత్‌నగర్, హైదరాబాద్  |  ఫోన్: 7013079166',
    width / 2,
    blessY + 59
  );

  // 7. BOTTOM ROYAL FOOTER STRIP (SITE URL & DETAILS)
  const botY = 1804;
  const botH = 82;
  const botGrad = ctx.createLinearGradient(60, botY, width - 60, botY + botH);
  botGrad.addColorStop(0, '#3b0a0a');
  botGrad.addColorStop(0.5, '#631010');
  botGrad.addColorStop(1, '#3b0a0a');
  ctx.fillStyle = botGrad;
  drawRoundedRect(ctx, 60, botY, width - 120, botH, 16);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.8;
  drawRoundedRect(ctx, 65, botY + 4, width - 130, botH - 8, 14);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం  •  www.telugujyothisham.com  •  వాట్సాప్ & కాల్: +91 7013079166 / 8977986166',
    width / 2,
    botY + 33
  );

  ctx.fillStyle = '#fed7aa';
  ctx.font = '16.5px "Noto Serif Telugu"';
  drawCenteredText(
    ctx,
    'దృక్సిద్ధాంత నిత్య పంచాంగం • రాశి ఫలాలు • ఉచిత బృహత్ జాతకం (PDF) • వివాహ పొంతన • వాస్తు & సమస్త పూజా సేవలు',
    width / 2,
    botY + 63
  );
}

export function generateKedareshwaraCanvas(pageNumber: number): Buffer {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext('2d');

  const sections = pageNumber === 1 ? KEDARESWARA_SECTIONS_PAGE1 : KEDARESWARA_SECTIONS_PAGE2;
  renderPage(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, pageNumber, 2, sections);

  return canvas.toBuffer('image/png');
}

export function saveKedareshwaraFiles() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  // Page 1
  const page1Buffer = generateKedareshwaraCanvas(1);
  const page1PngPath = path.join(publicDir, 'kedareshwara-vrata-katha-page1.png');
  fs.writeFileSync(page1PngPath, page1Buffer);

  // Page 2
  const page2Buffer = generateKedareshwaraCanvas(2);
  const page2PngPath = path.join(publicDir, 'kedareshwara-vrata-katha-page2.png');
  fs.writeFileSync(page2PngPath, page2Buffer);

  // Complete PDF with both pages (Strict A4 portrait: 210mm x 297mm)
  const pdfDoc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const b64Page1 = `data:image/png;base64,${page1Buffer.toString('base64')}`;
  pdfDoc.addImage(b64Page1, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  pdfDoc.addPage('a4', 'portrait');
  const b64Page2 = `data:image/png;base64,${page2Buffer.toString('base64')}`;
  pdfDoc.addImage(b64Page2, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  const pdfPath = path.join(publicDir, 'kedareshwara-vrata-katha.pdf');
  const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  // Copy to dist if dist exists
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'kedareshwara-vrata-katha-page1.png'), page1Buffer);
    fs.writeFileSync(path.join(distDir, 'kedareshwara-vrata-katha-page2.png'), page2Buffer);
    fs.writeFileSync(path.join(distDir, 'kedareshwara-vrata-katha.pdf'), pdfBuffer);
  }

  console.log(`✅ Kedareshwara Page 1 PNG: ${page1PngPath} (${(page1Buffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Kedareshwara Page 2 PNG: ${page2PngPath} (${(page2Buffer.length / 1024).toFixed(1)} KB)`);
  console.log(`✅ Kedareshwara 2-Page Complete PDF: ${pdfPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
}

// Automatically execute when run directly
saveKedareshwaraFiles();
