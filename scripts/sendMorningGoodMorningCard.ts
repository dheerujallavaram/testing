/**
 * Daily Morning 6:00 AM IST "శుభోదయం పంచాంగం + సుభాషితం" Photo Card Generator & Sender
 *
 * Generates two 1080x1350 HD PNG cards in Royal Temple Maroon & Gold:
 * 1. Morning Panchangam Summary Card (Tithi, Nakshatram, Amrutha, Abhijit, Rahukalam, Varjyam)
 * 2. Daily Subhashitham Sloka + Modern Life Takeaway Card
 *
 * Automatically sends both HD photo cards to Telegram (and optional Social Webhook).
 * Usage:
 *   npx tsx scripts/sendMorningGoodMorningCard.ts
 *   npx tsx scripts/sendMorningGoodMorningCard.ts --dry-run
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts, Image as CanvasImage, loadImage, SKRSContext2D } from '@napi-rs/canvas';
import { DayData } from '../src/types/panchangam';
import { getDailySubhashitham, SubhashithamItem } from '../src/data/subhashithamData';
import { computeLivePanchangamSheet } from '../src/utils/livePanchangamSheetEngine';
import {
  MinimalCanvasContext2D,
  paintRoyalPanchangamSheet,
  RoyalCardAspect,
} from '../src/utils/royalPanchangamCanvasRenderer';
import {
  BOT_TOKEN,
  getMainInlineKeyboard,
  getTodayISTData,
  loadSavedChatIds,
  saveChatId,
  sendTelegramPhotoBuffer,
} from './telegramBot';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function stripCanvasEmojis(text?: string | null): string {
  return String(text || '')
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

function drawCenteredSingleLine(
  ctx: SKRSContext2D,
  rawText: string,
  centerX: number,
  y: number,
  maxWidth = 940
) {
  const text = stripCanvasEmojis(rawText);
  ctx.save();
  ctx.textAlign = 'left';
  let textWidth = ctx.measureText(text).width;
  if (textWidth > maxWidth) {
    const match = ctx.font.match(/(\d+(?:\.\d+)?)px/);
    if (match) {
      let px = parseFloat(match[1]);
      while (px > 15 && textWidth > maxWidth) {
        px -= 1;
        ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, `${px}px`);
        textWidth = ctx.measureText(text).width;
      }
    }
  }
  const x = Math.round(centerX - textWidth / 2);
  ctx.fillText(text, x, y, maxWidth);
  ctx.restore();
}

function wrapLines(
  ctx: SKRSContext2D,
  rawText: string,
  maxWidth: number
): string[] {
  const paragraphs = rawText.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const cleanPara = stripCanvasEmojis(para);
    if (!cleanPara) {
      lines.push('');
      continue;
    }
    const words = cleanPara.split(/\s+/);
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function drawCenteredWrappedText(
  ctx: SKRSContext2D,
  rawText: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 10
): number {
  ctx.save();
  ctx.textAlign = 'left';
  const lines = wrapLines(ctx, rawText, maxWidth).slice(0, maxLines);
  let y = startY;
  for (const line of lines) {
    if (!line) {
      y += Math.round(lineHeight * 0.45);
      continue;
    }
    const w = ctx.measureText(line).width;
    ctx.fillText(line, Math.round(centerX - Math.min(w, maxWidth) / 2), y, maxWidth);
    y += lineHeight;
  }
  ctx.restore();
  return y;
}

function drawLeftAlignedWrappedText(
  ctx: SKRSContext2D,
  rawText: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
): number {
  ctx.save();
  ctx.textAlign = 'left';
  const lines = wrapLines(ctx, rawText, maxWidth).slice(0, maxLines);
  let y = startY;
  for (const line of lines) {
    if (!line) {
      y += Math.round(lineHeight * 0.4);
      continue;
    }
    ctx.fillText(line, x, y, maxWidth);
    y += lineHeight;
  }
  ctx.restore();
  return y;
}

let cachedGuruPortraitImg: CanvasImage | null | undefined;

async function loadGuruPortraitAsync(): Promise<CanvasImage | undefined> {
  if (cachedGuruPortraitImg !== undefined) return cachedGuruPortraitImg || undefined;
  try {
    const imgPath = path.resolve(
      process.cwd(),
      'public/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg'
    );
    if (fs.existsSync(imgPath)) {
      const img = await loadImage(imgPath);
      cachedGuruPortraitImg = img;
      return img;
    }
  } catch (err) {
    console.warn('⚠️ Portrait image fallback:', err);
  }
  cachedGuruPortraitImg = null;
  return undefined;
}

/**
 * Card 1: Royal Temple Manuscript Panchangam + Live 4x4 South Indian Kundali Card
 * Used automatically by Morning 6:00 AM IST Telegram + OpenMausBot (Facebook Page, Instagram & LinkedIn).
 */
export async function renderMorningPanchangamCardBuffer(
  day: DayData,
  aspect: RoyalCardAspect = 'feed_4_5'
): Promise<Buffer> {
  registerFonts();
  const width = 1080;
  const height = aspect === 'story_9_16' ? 1920 : 1350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const snap = computeLivePanchangamSheet(day);
  const avatarImage = await loadGuruPortraitAsync();

  paintRoyalPanchangamSheet(ctx as unknown as MinimalCanvasContext2D, snap, {
    aspect,
    avatarImage,
  });

  return canvas.toBuffer('image/png');
}

/**
 * Card 2: 1080x1350 Morning Subhashitham Quote Card (Pure Royal Temple Maroon & Gold)
 */
export function renderMorningSubhashithamCardBuffer(
  item: SubhashithamItem,
  day: DayData
): Buffer {
  registerFonts();
  const width = 1080;
  const height = 1350;
  const centerX = width / 2;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Royal Temple Maroon Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#260600');
  bgGrad.addColorStop(0.35, '#421004');
  bgGrad.addColorStop(0.7, '#2b0700');
  bgGrad.addColorStop(1, '#1a0300');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Radial Gold Shimmer
  const radGrad = ctx.createRadialGradient(
    centerX,
    height * 0.45,
    60,
    centerX,
    height * 0.45,
    width * 0.62
  );
  radGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
  radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, width, height);

  // Double Gold Border & Corner Dots
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = 'rgba(252, 211, 77, 0.55)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  const cornerCoords = [
    [50, 50],
    [width - 50, 50],
    [50, height - 50],
    [width - 50, height - 50],
  ];
  ctx.fillStyle = '#fcd34d';
  for (const [cx, cy] of cornerCoords) {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Header
  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 26px "Noto Serif Telugu", serif';
  drawCenteredSingleLine(
    ctx,
    `శుభోదయం • శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (${day.isoDate})`,
    centerX,
    102
  );

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 23px "Noto Serif Telugu", "Noto Sans", sans-serif';
  drawCenteredSingleLine(ctx, `${item.themeTe} • ${item.themeEn}`, centerX, 144);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 260, 170);
  ctx.lineTo(centerX + 260, 170);
  ctx.stroke();

  let cursorY = 222;

  // Sanskrit Slokam Section
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 23px "Noto Serif Telugu", "Noto Sans", sans-serif';
  drawCenteredSingleLine(ctx, 'మూల సంస్కృత సుభాషిత శ్లోకం', centerX, cursorY);
  cursorY += 48;

  const slokaMaxWidth = width - 170;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Noto Serif Telugu", serif';
  cursorY = drawCenteredWrappedText(ctx, item.slokamTe, centerX, cursorY, slokaMaxWidth, 46, 4);
  cursorY += 8;

  ctx.fillStyle = '#fde68a';
  ctx.font = 'italic 22px "Noto Serif Telugu", Georgia, serif';
  cursorY = drawCenteredWrappedText(ctx, item.slokamEn, centerX, cursorY, slokaMaxWidth, 34, 4);
  cursorY += 16;

  // Meaning
  ctx.fillStyle = '#fed7aa';
  ctx.font = '23px "Noto Serif Telugu", sans-serif';
  cursorY = drawCenteredWrappedText(
    ctx,
    `తాత్పర్యం: ${item.meaningTe}`,
    centerX,
    cursorY,
    slokaMaxWidth,
    38,
    4
  );
  cursorY += 26;

  // Highlighted Cream Box for Modern Life Quote
  const boxW = 920;
  const boxX = (width - boxW) / 2;
  const textInnerW = boxW - 80;

  ctx.font = 'bold 26px "Noto Serif Telugu", sans-serif';
  const quoteTeLines = wrapLines(ctx, item.loukikaQuoteTe, textInnerW);
  ctx.font = 'bold 22px "Noto Serif Telugu", Georgia, serif';
  const quoteEnLines = wrapLines(ctx, item.loukikaQuoteEn, textInnerW);

  const boxHeight = Math.min(
    460,
    54 + 42 + quoteTeLines.length * 40 + 16 + quoteEnLines.length * 32 + 34
  );
  const boxTop = Math.min(cursorY, height - 150 - boxHeight);

  ctx.fillStyle = 'rgba(255, 251, 235, 0.97)';
  drawRoundedRect(ctx, boxX, boxTop, boxW, boxHeight, 26);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.stroke();

  let innerY = boxTop + 46;
  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
  drawCenteredSingleLine(ctx, 'నేటి తరానికి లౌకిక జీవన సందేశం (Life Takeaway)', centerX, innerY, boxW - 40);
  innerY += 46;

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 26px "Noto Serif Telugu", sans-serif';
  innerY = drawCenteredWrappedText(ctx, item.loukikaQuoteTe, centerX, innerY, textInnerW, 40, 5);
  innerY += 10;

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 22px "Noto Serif Telugu", Georgia, serif';
  drawCenteredWrappedText(ctx, item.loukikaQuoteEn, centerX, innerY, textInnerW, 32, 5);

  // Footer
  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 25px "Noto Serif Telugu", serif';
  drawCenteredSingleLine(
    ctx,
    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు • శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    centerX,
    height - 102,
    940
  );
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 23px "Noto Serif Telugu", "Noto Sans", sans-serif';
  drawCenteredSingleLine(
    ctx,
    'www.telugujyothisham.com  •  WhatsApp: +91 89779 86166',
    centerX,
    height - 66,
    940
  );

  return canvas.toBuffer('image/png');
}

export async function runMorningGoodMorningAutomation(dryRun = false) {
  const { day } = getTodayISTData();
  const subhashitham = getDailySubhashitham(day.isoDate);

  const panchangamPng = await renderMorningPanchangamCardBuffer(day);
  const subhashithamPng = renderMorningSubhashithamCardBuffer(subhashitham, day);

  if (dryRun) {
    const outDir = path.join(os.tmpdir(), 'morning-preview');
    fs.mkdirSync(outDir, { recursive: true });
    const p1 = path.join(outDir, `morning-panchangam-${day.isoDate}.png`);
    const p2 = path.join(outDir, `morning-subhashitham-${day.isoDate}.png`);
    fs.writeFileSync(p1, panchangamPng);
    fs.writeFileSync(p2, subhashithamPng);
    console.log(`✅ Dry run rendered cards:\n  1. ${p1} (${panchangamPng.byteLength} bytes)\n  2. ${p2} (${subhashithamPng.byteLength} bytes)`);
    return;
  }

  const morningPanchangamCaption = [
    `🌅 *శుభోదయం! నేటి పంచాంగం (${day.teediVaram})*`,
    `📅 ${day.panchanga.samvatsaram} • ${day.panchanga.masam}`,
    ``,
    `🌙 *తిథి:* ${day.panchanga.tithi}`,
    `⭐ *నక్షత్రం:* ${day.panchanga.nakshatram}`,
    `✨ *అమృత ఘడియలు:* ${day.shubha.amrutha}`,
    `🌞 *అభిజిత్ ముహూర్తం:* ${day.shubha.abhijit}`,
    `⚠️ *రాహు కాలం:* ${day.ashubha.rahukalam}`,
    ``,
    `📜 *సంపూర్ణ రాశి ఫలాలు & ఉచిత 100 పేజీల జాతకం PDF:* https://www.telugujyothisham.com`,
    `📞 *సంప్రదించండి (WhatsApp):* +91 89779 86166`,
    ``,
    `#Subhodayam #TeluguPanchangam #TodayPanchangam #TeluguJyothisham`,
  ].join('\n');

  const subhashithamCaption = [
    `🕉️ *నేటి సుభాషితం — ${subhashitham.themeTe}*`,
    ``,
    `📜 *శ్లోకం:*\n${subhashitham.slokamTe}`,
    ``,
    `💡 *తాత్పర్యం:* ${subhashitham.meaningTe}`,
    ``,
    `🌟 *నేటి తరానికి సందేశం:*\n${subhashitham.loukikaQuoteTe}`,
    ``,
    `— *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు*`,
    `🌐 https://www.telugujyothisham.com | 📞 +91 89779 86166`,
    ``,
    `#TeluguQuotes #Subhashitham #DailyWisdom #GoodMorningTelugu #TeluguJyothisham`,
  ].join('\n');

  if (BOT_TOKEN) {
    try {
      const updRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
      const updJson = (await updRes.json()) as {
        ok: boolean;
        result?: Array<{
          message?: { chat: { id: number } };
          channel_post?: { chat: { id: number } };
        }>;
      };
      if (updJson.ok && Array.isArray(updJson.result)) {
        for (const u of updJson.result) {
          if (u.message?.chat?.id) saveChatId(u.message.chat.id);
          if (u.channel_post?.chat?.id) saveChatId(u.channel_post.chat.id);
        }
      }
    } catch {}

    const chatIds = loadSavedChatIds();
    if (chatIds.length === 0) {
      console.log('ℹ️ No Telegram chat IDs found. Set TELEGRAM_CHAT_ID secret or message the bot.');
    } else {
      for (const chatId of chatIds) {
        const ok1 = await sendTelegramPhotoBuffer(
          chatId,
          panchangamPng,
          `morning-panchangam-${day.isoDate}.png`,
          morningPanchangamCaption
        );
        const ok2 = await sendTelegramPhotoBuffer(
          chatId,
          subhashithamPng,
          `morning-subhashitham-${day.isoDate}.png`,
          subhashithamCaption,
          getMainInlineKeyboard()
        );
        console.log(
          `✅ Sent Morning Good Morning Cards to Telegram Chat ${chatId}: Panchangam=${ok1}, Subhashitham=${ok2}`
        );
      }
    }
  }

  // OpenMausBot Automated Multi-Platform Social Publishing (Facebook Page, Instagram, LinkedIn, Postiz & Webhook)
  try {
    const { runOpenMausSocialEngine } = await import('./openMausSocialEngine');
    const socialOutcome = await runOpenMausSocialEngine({ publish: true });
    console.log(`🐾 [OpenMausBot Morning Auto-Post] ${socialOutcome.summary}`);
    for (const r of socialOutcome.results) {
      console.log(`  ${r.success ? '✅' : '⚠️'} [${r.channel}] ${r.message}`);
    }
  } catch (socialErr) {
    console.warn('⚠️ OpenMausBot social auto-post warning:', socialErr);
  }
}

if (process.argv[1]?.includes('sendMorningGoodMorningCard')) {
  const dryRun = process.argv.includes('--dry-run');
  runMorningGoodMorningAutomation(dryRun)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Morning 6 AM Good Morning automation failed:', err);
      process.exit(1);
    });
}
