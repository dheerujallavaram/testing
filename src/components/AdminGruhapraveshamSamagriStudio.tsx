import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  FileText,
  Home,
  Flame,
  Heart,
  Plus,
  RotateCcw,
  Share2,
  Loader2,
} from 'lucide-react';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';

export interface SamagriItem {
  id: string;
  nameTe: string;
  qtyTe: string;
}

export interface SamagriSection {
  id: 'vastu' | 'homam' | 'vratam' | 'kalyanam';
  titleTe: string;
  subtitleTe: string;
  enabled: boolean;
  items: SamagriItem[];
}

export const DEFAULT_TELANGANA_GRUHAPRAVESHAM_SECTIONS: SamagriSection[] = [
  {
    id: 'vastu',
    titleTe: '1. వాస్తు పూజ & గృహప్రవేశం సామాగ్రి',
    subtitleTe: 'కలశ స్థాపన, గణపతి పూజ, పుణ్యాహవాచనం & గృహ వాస్తు పూజ కొరకు',
    enabled: true,
    items: [
      { id: 'v1', nameTe: 'లక్ష్మి గణపతి దేవుడి ఫోటో', qtyTe: '1' },
      { id: 'v2', nameTe: 'పసుపు', qtyTe: '300 గ్రా॥ (300g)' },
      { id: 'v3', nameTe: 'కుంకుమ', qtyTe: '300 గ్రా॥ (300g)' },
      { id: 'v4', nameTe: 'గంధం', qtyTe: '1 డబ్బా' },
      { id: 'v5', nameTe: 'సున్నం', qtyTe: '1 డబ్బా' },
      { id: 'v6', nameTe: 'అగరు వత్తులు (అగరబత్తీలు)', qtyTe: '2 బాక్సులు (2 Box)' },
      { id: 'v7', nameTe: 'హారతి కర్పూరం', qtyTe: '1 ప్యాకెట్ (1P)' },
      { id: 'v8', nameTe: 'అగ్గిపెట్టె', qtyTe: '1' },
      { id: 'v9', nameTe: 'దీపం వత్తులు', qtyTe: '1 ప్యాకెట్ (1P)' },
      { id: 'v10', nameTe: 'బళ్ళారి వక్కలు', qtyTe: 'పావు కిలో (250g)' },
      { id: 'v11', nameTe: 'ఖర్జూర (ఎండు ఖర్జూరాలు)', qtyTe: 'అర కేజీ (1/2 kg)' },
      { id: 'v12', nameTe: 'పసుపు కొమ్ములు', qtyTe: 'పావు కిలో (250g)' },
      { id: 'v13', nameTe: 'కుడుకలు (ఎండు కొబ్బరి చిప్పలు)', qtyTe: '25' },
      { id: 'v14', nameTe: 'చిల్లర కాయిన్స్ (నాణేలు)', qtyTe: '50' },
      { id: 'v15', nameTe: 'కొబ్బరికాయలు', qtyTe: '15' },
      { id: 'v16', nameTe: 'బూడిద గుమ్మడికాయలు', qtyTe: '2 (కొట్టేది 1, కట్టేది 1)' },
      { id: 'v17', nameTe: 'తెల్ల దొడ్డు దారం', qtyTe: '1 బంతి' },
      { id: 'v18', nameTe: 'మార్వాడి దారం (రక్షా సూత్రం)', qtyTe: '1 బంతి' },
      { id: 'v19', nameTe: 'ఉట్టి (గుమ్మడికాయ కట్టడానికి)', qtyTe: '1' },
      { id: 'v20', nameTe: 'ముత్యం - పగడం', qtyTe: '1 సెట్' },
      { id: 'v21', nameTe: 'Ramraj 9×5 ధోతి (ఏదైనా రంగు)', qtyTe: '1 (Any Colour)' },
      { id: 'v22', nameTe: 'జాకెట్ ముక్కలు (రవిక గుడ్డలు)', qtyTe: '16' },
      { id: 'v23', nameTe: 'దీపం కుందులు (ప్రమిదలు)', qtyTe: '1 సెట్' },
      { id: 'v24', nameTe: 'కలశం చెంబులు (రాగి / ఇత్తడి / స్టీల్)', qtyTe: '5' },
      { id: 'v25', nameTe: 'రాగి చెంబులు', qtyTe: '2' },
      { id: 'v26', nameTe: 'రాగి గ్లాసులు పెద్దవి', qtyTe: '3' },
      { id: 'v27', nameTe: 'ఆవు మూత్రం (గోమూత్రం)', qtyTe: '1 బాటిల్' },
      { id: 'v28', nameTe: 'గంగా జలం', qtyTe: '1 బాటిల్' },
      { id: 'v29', nameTe: 'బియ్యం', qtyTe: '20 కేజీలు (20 kg)' },
      { id: 'v30', nameTe: 'తమలపాకులు', qtyTe: '100' },
      { id: 'v31', nameTe: 'విడి పూలు', qtyTe: '1 కేజీ (1 kg)' },
      { id: 'v32', nameTe: 'పూలమాల (మల్లె మాల / చామంతి)', qtyTe: '2–3 మూరలు' },
      { id: 'v33', nameTe: 'దీపం నూనె', qtyTe: '1 లీటర్' },
      { id: 'v34', nameTe: 'మంచి నూనె', qtyTe: '1 లీటర్ (1L)' },
      { id: 'v35', nameTe: 'పల్లీలు (వేరుశనగ గుళ్ళు)', qtyTe: '1 కేజీ (1 kg)' },
      { id: 'v36', nameTe: 'చక్కెర (శక్కరి)', qtyTe: '1 కేజీ (1 kg)' },
      {
        id: 'v37',
        nameTe: 'నవధాన్యాలు (9 రకాల ధాన్యాలు/పప్పులు కలిపి సెట్)',
        qtyTe: '1 సెట్ / 1 కేజీ',
      },
      { id: 'v38', nameTe: 'బెల్లం', qtyTe: '1 గడ్డ' },
      { id: 'v39', nameTe: 'అరటి పండ్లు', qtyTe: '2 డజన్లు' },
      { id: 'v40', nameTe: 'పండ్లు (5 రకాలు)', qtyTe: 'తగినన్ని' },
      { id: 'v41', nameTe: 'నిమ్మకాయలు', qtyTe: '15' },
      { id: 'v42', nameTe: 'పాలు పొంగించడానికి కొత్త గిన్నె', qtyTe: '1' },
    ],
  },
  {
    id: 'homam',
    titleTe: '2. హోమం సామాగ్రి (గణపతి / వాస్తు హోమం)',
    subtitleTe: 'అగ్ని ప్రతిష్ఠాపన, ఆహుతులు & పూర్ణాహుతి కొరకు',
    enabled: true,
    items: [
      { id: 'h1', nameTe: 'సమిధలు (మోదుగ / రావి మొ॥)', qtyTe: '6 కట్టలు' },
      { id: 'h2', nameTe: 'ఇటుకలు, ఇసుక (హోమ గుండం కొరకు)', qtyTe: 'తగినన్ని' },
      { id: 'h3', nameTe: 'దర్భలు', qtyTe: '1 కట్ట' },
      { id: 'h4', nameTe: 'ఆవు నెయ్యి (హోమం కొరకు)', qtyTe: '1 కేజీ (1 kg)' },
      { id: 'h5', nameTe: 'నెయ్యి గిన్నె & చెంచా', qtyTe: '1' },
      { id: 'h6', nameTe: 'హోమం పొడి (హోమ ద్రవ్యాలు)', qtyTe: '1 ప్యాకెట్ (1P)' },
      { id: 'h7', nameTe: 'తెల్ల ఆవాలు', qtyTe: '100 గ్రా॥ (100g)' },
      { id: 'h8', nameTe: 'పూర్ణాహుతి సెట్', qtyTe: '1 సెట్' },
    ],
  },
  {
    id: 'vratam',
    titleTe: '3. వ్రతం సామాగ్రి (శ్రీ సత్యనారాయణ స్వామి వ్రతం)',
    subtitleTe: 'మండపారాధన, పంచామృత అభిషేకం & సత్యనారాయణ వ్రత కథ కొరకు',
    enabled: true,
    items: [
      { id: 'vr1', nameTe: 'స్వామి వారి ఫోటో', qtyTe: '1' },
      { id: 'vr2', nameTe: 'తెల్ల బట్ట (పీఠం మీదికి)', qtyTe: '1' },
      { id: 'vr3', nameTe: 'రవ్వ, శక్కరి (ప్రసాదంకి)', qtyTe: 'తగినంత' },
      { id: 'vr4', nameTe: 'తేనె', qtyTe: '1 చిన్న బాటిల్' },
      { id: 'vr5', nameTe: 'ఆవు పాలు', qtyTe: '100 గ్రా॥ (100g)' },
      { id: 'vr6', nameTe: 'పెరుగు', qtyTe: '100 గ్రా॥ (100g)' },
      { id: 'vr7', nameTe: 'హారతి కడ (పళ్ళెం), పూజా గంట', qtyTe: '1 సెట్' },
      { id: 'vr8', nameTe: 'స్వామి వారి ప్రతిమ (రూపు)', qtyTe: '1' },
      { id: 'vr9', nameTe: 'Dry Fruits (కాజు, ద్రాక్ష, బాదం మొ॥)', qtyTe: 'తగినన్ని' },
    ],
  },
  {
    id: 'kalyanam',
    titleTe: '4. కళ్యాణం సామాగ్రి (స్వామి వారి కళ్యాణం)',
    subtitleTe: 'మాంగళ్య ధారణ, తలంబ్రాలు & కళ్యాణ మహోత్సవం కొరకు',
    enabled: true,
    items: [
      { id: 'k1', nameTe: 'ధోతీ', qtyTe: '1' },
      { id: 'k2', nameTe: 'చీర', qtyTe: '1' },
      { id: 'k3', nameTe: 'శాలువా', qtyTe: '1' },
      { id: 'k4', nameTe: 'తువాలు (టవల్స్)', qtyTe: '2' },
      { id: 'k5', nameTe: 'బాసింగాలు', qtyTe: '2' },
      { id: 'k6', nameTe: 'పుస్తె - మెట్టెలు', qtyTe: '1 సెట్' },
      { id: 'k7', nameTe: 'గాజులు', qtyTe: '1 సెట్' },
      { id: 'k8', nameTe: 'నల్లపూసలు', qtyTe: '1 సెట్' },
      { id: 'k9', nameTe: 'జీలకర్ర - బెల్లం', qtyTe: '50 గ్రా॥ (50g)' },
      { id: 'k10', nameTe: 'పాలు, పెరుగు', qtyTe: '50 గ్రా॥ (50g)' },
    ],
  },
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCenteredTextSafe(
  ctx: CanvasRenderingContext2D,
  text: string,
  boxX: number,
  boxW: number,
  y: number,
  padding = 24
) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  const maxW = Math.max(60, boxW - padding * 2);
  const fontMatch = ctx.font.match(/(\d+(?:\.\d+)?)px/);
  let px = fontMatch ? parseFloat(fontMatch[1]) : 26;
  const minPx = Math.max(14, Math.floor(px * 0.6));

  while (px > minPx && ctx.measureText(text).width > maxW) {
    px -= 1;
    ctx.font = ctx.font.replace(/\d+(?:\.\d+)?px/, `${px}px`);
  }

  const w = ctx.measureText(text).width;
  const startX = Math.max(boxX + padding, Math.round(boxX + (boxW - w) / 2));
  ctx.fillText(text, startX, y);
  ctx.restore();
}

function drawLeftFitTextSafe(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  minPx = 15
) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  const fontMatch = ctx.font.match(/(\d+(?:\.\d+)?)px/);
  let px = fontMatch ? parseFloat(fontMatch[1]) : 22;

  while (px > minPx && ctx.measureText(text).width > maxW) {
    px -= 1;
    ctx.font = ctx.font.replace(/\d+(?:\.\d+)?px/, `${px}px`);
  }

  ctx.fillText(text, x, y);
  ctx.restore();
}

export const AdminGruhapraveshamSamagriStudio: React.FC = () => {
  const { isGuruAdmin } = useIsGuruAdmin();
  const [sections, setSections] = useState<SamagriSection[]>(
    DEFAULT_TELANGANA_GRUHAPRAVESHAM_SECTIONS
  );
  const [clientName, setClientName] = useState<string>('');
  const [muhurthamDate, setMuhurthamDate] = useState<string>('');
  const [muhurthamTime, setMuhurthamTime] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>(
    'గమనిక: పూజా ద్రవ్యములు అన్నీ స్వచ్ఛమైనవి, నాణ్యమైనవి తీసుకురాగలరు. పప్పుల స్థానంలో నవధాన్యాలు (9 రకాలు) మరియు కలశం చెంబులు 5 తప్పనిసరిగా సిద్ధం చేసుకోగలరు.'
  );
  const [isGeneratingImg, setIsGeneratingImg] = useState<boolean>(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState<boolean>(false);
  const [newItemSection, setNewItemSection] = useState<SamagriSection['id']>('vastu');
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemQty, setNewItemQty] = useState<string>('');

  // Strictly hidden from normal users!
  if (!isGuruAdmin) {
    return null;
  }

  const toggleSection = (id: SamagriSection['id']) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === newItemSection
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: `${newItemSection}-${Date.now()}`,
                  nameTe: newItemName.trim(),
                  qtyTe: newItemQty.trim() || '1',
                },
              ],
            }
          : s
      )
    );
    setNewItemName('');
    setNewItemQty('');
  };

  const handleRemoveItem = (secId: SamagriSection['id'], itemId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
      )
    );
  };

  const handleResetDefault = () => {
    setSections(DEFAULT_TELANGANA_GRUHAPRAVESHAM_SECTIONS);
  };

  const buildWhatsAppShareText = () => {
    const lines: string[] = [
      `🕉️ *ఓం శ్రీలక్ష్మి గణపతయే నమః • శ్రీ మాత్రే నమః* 🕉️`,
      `🏛️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం*`,
      `🙏 *బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు*`,
      `_(ప్రముఖ వేద జ్యోతిష్య, వాస్తు, ముహూర్త & స్మార్త పురోహితులు - హైదరాబాద్)_`,
      `📞 *WhatsApp / Call:* +91 89779 86166`,
      `🌐 *వెబ్‌సైట్:* https://www.telugujyothisham.com`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🏡 *తెలంగాణ గృహప్రవేశం పూజా సామాగ్రి జాబితా*`,
    ];

    if (clientName.trim() || muhurthamDate.trim() || muhurthamTime.trim()) {
      if (clientName.trim()) lines.push(`👤 *యజమాని పేరు:* ${clientName.trim()}`);
      if (muhurthamDate.trim()) lines.push(`📅 *ముహూర్త తేదీ:* ${muhurthamDate.trim()}`);
      if (muhurthamTime.trim()) lines.push(`⏰ *శుభ సమయం:* ${muhurthamTime.trim()}`);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    }

    sections
      .filter((s) => s.enabled)
      .forEach((sec) => {
        lines.push(``);
        lines.push(`✨ *${sec.titleTe}*`);
        sec.items.forEach((it, idx) => {
          lines.push(`${idx + 1}. ${it.nameTe} — *${it.qtyTe}*`);
        });
      });

    if (customNote.trim()) {
      lines.push(``);
      lines.push(`📌 *${customNote.trim()}*`);
    }

    lines.push(``);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🌟 *మా జ్యోతిషాలయ ప్రత్యేక సేవలు (www.telugujyothisham.com):*`);
    lines.push(`✅ 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF)`);
    lines.push(`✅ శాస్త్రోక్త వివాహ పొంతన (36 గుణముల అష్టకూట & నాడీ పరిశీలన)`);
    lines.push(`✅ శుభ ముహూర్త నిర్ణయం (గృహప్రవేశం, వివాహం, నూతన వ్యాపారం, నామకరణం)`);
    lines.push(`✅ గృహ/వ్యాపార వాస్తు & గ్రహ దోష నివారణ శాంతి పూజలు`);
    lines.push(`📞 *సంప్రదించండి:* +91 89779 86166 | 🌐 https://www.telugujyothisham.com`);

    return lines.join('\n');
  };

  const handleCopyWhatsAppText = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppShareText());
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2800);
    } catch {}
  };

  /**
   * Generates a High-Resolution A4 Royal Temple Pooja Samagri Poster PNG (1600 x 2420)
   * with the full Site Advertisement Header & Footer for Admin Download.
   */
  const handleDownloadPosterImage = async () => {
    if (isGeneratingImg) return;
    setIsGeneratingImg(true);
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const W = 1600;
      const H = 2480;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Royal Cream & Gold Temple Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#fffbeb');
      bgGrad.addColorStop(0.5, '#fef9c3');
      bgGrad.addColorStop(1, '#fffbeb');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Outer & Inner Borders
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 10;
      drawRoundedRect(ctx, 20, 20, W - 40, H - 40, 32);
      ctx.stroke();

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, 34, 34, W - 68, H - 68, 24);
      ctx.stroke();

      // 2. GRAND SITE ADVERTISEMENT HEADER (Top Royal Crimson-Gold Banner)
      drawRoundedRect(ctx, 48, 48, W - 96, 360, 28);
      const headGrad = ctx.createLinearGradient(48, 48, W - 48, 408);
      headGrad.addColorStop(0, '#2a0702');
      headGrad.addColorStop(0.5, '#4c1106');
      headGrad.addColorStop(1, '#2a0702');
      ctx.fillStyle = headGrad;
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Om Medallion on Left & Right
      for (const omX of [96, W - 216]) {
        drawRoundedRect(ctx, omX, 82, 120, 120, 28);
        const omG = ctx.createLinearGradient(omX, 82, omX + 120, 202);
        omG.addColorStop(0, '#fde047');
        omG.addColorStop(1, '#d97706');
        ctx.fillStyle = omG;
        ctx.fill();
        ctx.fillStyle = '#2a0702';
        ctx.font = 'bold 64px serif';
        drawCenteredTextSafe(ctx, 'ॐ', omX, 120, 162, 10);
      }

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 25px "Noto Serif Telugu", serif';
      drawCenteredTextSafe(
        ctx,
        '🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః  •  శ్రీ మాత్రే నమః  •  శుభమస్తు 🕉️',
        230,
        W - 460,
        98,
        16
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px "Noto Serif Telugu", serif';
      drawCenteredTextSafe(
        ctx,
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
        230,
        W - 460,
        164,
        16
      );

      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 31px "Noto Serif Telugu", sans-serif';
      drawCenteredTextSafe(
        ctx,
        'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (వేద జ్యోతిష్య, వాస్తు, ముహూర్త & స్మార్త పురోహితులు)',
        140,
        W - 280,
        214,
        16
      );

      // Gold Contact & Website Pill inside Header
      drawRoundedRect(ctx, 130, 238, W - 260, 68, 34);
      const pillGrad = ctx.createLinearGradient(130, 238, W - 130, 306);
      pillGrad.addColorStop(0, '#fde047');
      pillGrad.addColorStop(0.5, '#f59e0b');
      pillGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = pillGrad;
      ctx.fill();

      ctx.fillStyle = '#2a0702';
      ctx.font = 'bold 32px sans-serif';
      drawCenteredTextSafe(
        ctx,
        '🌐 www.telugujyothisham.com    •    📞 WhatsApp / Call: +91 89779 86166',
        130,
        W - 260,
        283,
        24
      );

      // Services Advertisement Strip inside Header
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 23px "Noto Serif Telugu", sans-serif';
      drawCenteredTextSafe(
        ctx,
        '★ 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF)  •  ★ వివాహ పొంతన  •  ★ శుభ ముహూర్త నిర్ణయం  •  ★ వాస్తు & హోమ క్రతువులు',
        68,
        W - 136,
        352,
        18
      );

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 21px "Noto Serif Telugu", sans-serif';
      drawCenteredTextSafe(
        ctx,
        'గృహప్రవేశం, సత్యనారాయణ వ్రతం, వివాహం, చండీ/రుద్ర/గణపతి హోమాలు శాస్త్రోక్తంగా నిర్వహించబడును',
        68,
        W - 136,
        388,
        18
      );

      // 3. TITLE RIBBON: తెలంగాణ గృహప్రవేశం పూజా సామాగ్రి జాబితా
      drawRoundedRect(ctx, 48, 424, W - 96, 108, 22);
      ctx.fillStyle = '#7c2d12';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 40px "Noto Serif Telugu", serif';
      drawCenteredTextSafe(
        ctx,
        '🏡 తెలంగాణ సాంప్రదాయ గృహప్రవేశం పూజా సామాగ్రి జాబితా',
        48,
        W - 96,
        476,
        24
      );

      const metaLine =
        clientName.trim() || muhurthamDate.trim() || muhurthamTime.trim()
          ? `యజమాని: ${clientName.trim() || '________________'}   •   తేదీ: ${muhurthamDate.trim() || '____________'}   •   ముహూర్త సమయం: ${muhurthamTime.trim() || '____________'}`
          : 'వాస్తు పూజ  •  గణపతి / వాస్తు హోమం  •  శ్రీ సత్యనారాయణ స్వామి వ్రతం  •  స్వామి వారి కళ్యాణం';

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
      drawCenteredTextSafe(ctx, metaLine, 48, W - 96, 515, 24);

      // 4. TWO-COLUMN MAIN BODY (y = 548 to 2270)
      const colW = (W - 120) / 2; // 740px each
      const leftX = 48;
      const rightX = 48 + colW + 24;

      const vastuSec = sections.find((s) => s.id === 'vastu');
      const otherSecs = sections.filter((s) => s.id !== 'vastu' && s.enabled);

      // LEFT COLUMN: 1. Vastu Pooja Samagri
      if (vastuSec && vastuSec.enabled) {
        drawRoundedRect(ctx, leftX, 548, colW, 1715, 24);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Section Header
        drawRoundedRect(ctx, leftX, 548, colW, 64, 22);
        ctx.fillStyle = '#9a3412';
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 28px "Noto Serif Telugu", serif';
        drawCenteredTextSafe(ctx, `✨ ${vastuSec.titleTe}`, leftX, colW, 590, 18);

        let vy = 642;
        const rowStep = Math.min(38, Math.floor(1600 / Math.max(1, vastuSec.items.length)));
        vastuSec.items.forEach((item, idx) => {
          if (idx % 2 === 1) {
            ctx.fillStyle = '#fffbeb';
            ctx.fillRect(leftX + 8, vy - 25, colW - 16, rowStep - 2);
          }

          const isHighlight =
            item.nameTe.includes('కలశం చెంబులు') || item.nameTe.includes('నవధాన్యాలు');

          ctx.fillStyle = isHighlight ? '#9a3412' : '#1e293b';
          ctx.font = `${isHighlight ? 'bold' : 'bold'} 21px "Noto Serif Telugu", sans-serif`;
          drawLeftFitTextSafe(
            ctx,
            `☐ ${idx + 1}. ${item.nameTe}`,
            leftX + 20,
            vy,
            colW - 235,
            15
          );

          ctx.fillStyle = isHighlight ? '#b45309' : '#0f172a';
          ctx.font = 'bold 21px "Noto Serif Telugu", sans-serif';
          drawLeftFitTextSafe(ctx, item.qtyTe, leftX + colW - 205, vy, 188, 15);

          vy += rowStep;
        });
      }

      // RIGHT COLUMN: 2. Homam, 3. Vratam, 4. Kalyanam + Website Ad Card
      let ry = 548;
      for (const sec of otherSecs) {
        const secH = 74 + sec.items.length * 40 + 16;
        drawRoundedRect(ctx, rightX, ry, colW, secH, 24);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();

        drawRoundedRect(ctx, rightX, ry, colW, 60, 22);
        ctx.fillStyle = '#9a3412';
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 26px "Noto Serif Telugu", serif';
        drawCenteredTextSafe(ctx, `✨ ${sec.titleTe}`, rightX, colW, ry + 40, 18);

        let iy = ry + 94;
        sec.items.forEach((item, idx) => {
          if (idx % 2 === 1) {
            ctx.fillStyle = '#fffbeb';
            ctx.fillRect(rightX + 8, iy - 26, colW - 16, 36);
          }
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 21px "Noto Serif Telugu", sans-serif';
          drawLeftFitTextSafe(
            ctx,
            `☐ ${idx + 1}. ${item.nameTe}`,
            rightX + 20,
            iy,
            colW - 235,
            15
          );

          ctx.fillStyle = '#7c2d12';
          ctx.font = 'bold 21px "Noto Serif Telugu", sans-serif';
          drawLeftFitTextSafe(ctx, item.qtyTe, rightX + colW - 205, iy, 188, 15);

          iy += 40;
        });

        ry += secH + 22;
      }

      // Special Note + Website Services Box in remaining Right Column space
      const remH = Math.max(240, 2263 - ry);
      drawRoundedRect(ctx, rightX, ry, colW, remH, 24);
      const promoGrad = ctx.createLinearGradient(rightX, ry, rightX, ry + remH);
      promoGrad.addColorStop(0, '#2a0702');
      promoGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = promoGrad;
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px "Noto Serif Telugu", serif';
      drawCenteredTextSafe(
        ctx,
        '🌟 శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — మా ప్రత్యేక సేవలు 🌟',
        rightX,
        colW,
        ry + 46,
        18
      );

      const adBullets = [
        '📜 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF రిపోర్ట్)',
        '💑 శాస్త్రోక్త వివాహ పొంతన (36 గుణముల అష్టకూట, కుజ & నాడీ పరిశీలన)',
        '🏡 శుభ ముహూర్త నిర్ణయం (గృహప్రవేశం, వివాహం, వ్యాపారం, నామకరణం)',
        '🔱 గృహ/వ్యాపార వాస్తు పరిశీలన & నవగ్రహ / చండీ / రుద్ర హోమాలు',
        '📅 ప్రతిరోజూ ఉచిత దృక్సిద్ధాంత పంచాంగం & 12 రాశి ఫలాలు',
      ];
      let ay = ry + 92;
      for (const b of adBullets) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 21px "Noto Serif Telugu", sans-serif';
        drawLeftFitTextSafe(ctx, b, rightX + 24, ay, colW - 48, 16);
        ay += 38;
      }

      if (ry + remH - ay > 65) {
        drawRoundedRect(ctx, rightX + 24, ay + 6, colW - 48, 56, 16);
        ctx.fillStyle = '#fde047';
        ctx.fill();
        ctx.fillStyle = '#2a0702';
        ctx.font = 'bold 24px sans-serif';
        drawCenteredTextSafe(
          ctx,
          '🌐 www.telugujyothisham.com  •  📞 +91 89779 86166',
          rightX + 24,
          colW - 48,
          ay + 43,
          16
        );
      }

      // 5. BOTTOM FOOTER BANNER
      drawRoundedRect(ctx, 48, 2282, W - 96, 146, 24);
      ctx.fillStyle = '#2a0702';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 25px "Noto Serif Telugu", sans-serif';
      drawCenteredTextSafe(
        ctx,
        customNote,
        68,
        W - 136,
        2330,
        20
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      drawCenteredTextSafe(
        ctx,
        'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ • 📞 +91 89779 86166 • 🌐 www.telugujyothisham.com',
        68,
        W - 136,
        2392,
        20
      );

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `telangana-gruhapravesham-samagri-list-${
        clientName.trim() ? clientName.trim().replace(/\s+/g, '-') : 'telugujyothisham'
      }.png`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => link.remove(), 1000);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  /**
   * Triggers clean A4 PDF / Print Mode using a dedicated print stylesheet container
   */
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-br from-[#2b0902] via-amber-950 to-[#1f0501] text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-400 shadow-2xl space-y-6 font-telugu">
      {/* Top Admin Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/40 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>🔒 అడ్మిన్-ఓన్లీ • తెలంగాణ గృహప్రవేశం పూజా సామాగ్రి పత్రం (యూజర్లకు కనిపించదు)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-amber-100">
            🏡 తెలంగాణ గృహప్రవేశం పూజా సామాగ్రి లిస్ట్ (సైట్ అడ్వర్టైజ్‌మెంట్ హెడర్‌తో)
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90">
            వాస్తు పూజ (<strong>కలశం చెంబులు 5</strong> & పప్పుల స్థానంలో <strong>నవధాన్యాలు</strong>తో) • హోమం • వ్రతం • కళ్యాణం — మీకు మాత్రమే కనిపించే HD ఫోటో & PDF డౌన్‌లోడ్ స్టూడియో.
          </p>
        </div>

        {/* Primary Download & Copy Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={isGeneratingImg}
            onClick={handleDownloadPosterImage}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            {isGeneratingImg ? (
              <Loader2 size={17} className="animate-spin text-amber-950" />
            ) : (
              <Download size={17} className="text-amber-950" />
            )}
            <span>📥 HD సామాగ్రి పోస్టర్ డౌన్‌లోడ్ (PNG ఫోటో)</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-300/60 font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            <Printer size={17} />
            <span>🖨️ A4 PDF / ప్రింట్ సేవ్ చేయండి</span>
          </button>

          <button
            type="button"
            onClick={handleCopyWhatsAppText}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-400/60 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            {copiedWhatsApp ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
            <span>
              {copiedWhatsApp
                ? 'WhatsApp లిస్ట్ కాపీ అయింది ✓'
                : '📋 WhatsApp మెసేజ్ కాపీ (సైట్ హెడర్‌తో)'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleResetDefault}
            title="డిఫాల్ట్ లిస్ట్ రీసెట్ చేయండి"
            className="inline-flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-black/40 hover:bg-black/60 text-amber-300 border border-amber-700/60 text-xs font-bold cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>రీసెట్</span>
          </button>
        </div>
      </div>

      {/* Admin Customization Controls (Client Name, Date, Section Toggles, Add Item) */}
      <div className="bg-black/35 rounded-2xl p-4 border border-amber-500/40 space-y-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-amber-300 block mb-1">
              👤 యజమాని పేరు (ఐచ్ఛికం - పత్రంపై కనిపిస్తుంది):
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="ఉదా: శ్రీ రమేష్ గారు & దంపతులు"
              className="w-full px-3 py-2 rounded-xl bg-amber-950/90 border border-amber-500/50 text-xs text-white placeholder-amber-300/40"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-amber-300 block mb-1">
              📅 గృహప్రవేశం తేదీ (ఐచ్ఛికం):
            </label>
            <input
              type="text"
              value={muhurthamDate}
              onChange={(e) => setMuhurthamDate(e.target.value)}
              placeholder="ఉదా: 22-11-2026 (ఆదివారం)"
              className="w-full px-3 py-2 rounded-xl bg-amber-950/90 border border-amber-500/50 text-xs text-white placeholder-amber-300/40"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-amber-300 block mb-1">
              ⏰ శుభ ముహూర్త సమయం (ఐచ్ఛికం):
            </label>
            <input
              type="text"
              value={muhurthamTime}
              onChange={(e) => setMuhurthamTime(e.target.value)}
              placeholder="ఉదా: ఉదయం 08:45 ని॥ (ధనుర్లగ్నం)"
              className="w-full px-3 py-2 rounded-xl bg-amber-950/90 border border-amber-500/50 text-xs text-white placeholder-amber-300/40"
            />
          </div>
        </div>

        {/* Section Checkboxes + Quick Add Item */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-amber-800/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-amber-300">
              ✅ పత్రంలో కావలసిన విభాగాలు:
            </span>
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => toggleSection(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  sec.enabled
                    ? 'bg-amber-400 text-amber-950 border-amber-200 shadow-sm'
                    : 'bg-amber-950/70 text-amber-300/60 border-amber-700/50'
                }`}
              >
                {sec.enabled ? '✓ ' : '+ '}
                {sec.titleTe.split('(')[0].trim()} ({sec.items.length})
              </button>
            ))}
          </div>

          <form onSubmit={handleAddItem} className="flex flex-wrap items-center gap-2">
            <select
              value={newItemSection}
              onChange={(e) => setNewItemSection(e.target.value as SamagriSection['id'])}
              className="bg-amber-950 border border-amber-500/60 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-100"
            >
              <option value="vastu">1. వాస్తు పూజ</option>
              <option value="homam">2. హోమం</option>
              <option value="vratam">3. వ్రతం</option>
              <option value="kalyanam">4. కళ్యాణం</option>
            </select>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="కొత్త వస్తువు పేరు..."
              className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-500/60 text-xs text-white placeholder-amber-300/50 w-40"
            />
            <input
              type="text"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              placeholder="పరిమాణం (ఉదా: 2)"
              className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-500/60 text-xs text-white placeholder-amber-300/50 w-28"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
            >
              <Plus size={14} />
              <span>యాడ్ చేయండి</span>
            </button>
          </form>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PRINTABLE & PREVIEW SHEET WITH GRAND SITE ADVERTISEMENT HEADER         */}
      {/* ===================================================================== */}
      <div
        id="gruhapravesham-samagri-print-sheet"
        className="bg-[#fffbeb] text-slate-900 rounded-3xl p-5 sm:p-8 border-4 border-amber-600 shadow-2xl space-y-6"
      >
        {/* GRAND SITE ADVERTISEMENT HEADER */}
        <div className="bg-gradient-to-r from-[#2a0702] via-[#4a1005] to-[#2a0702] text-white rounded-2xl p-5 sm:p-6 border-2 border-amber-400 shadow-lg text-center space-y-2.5">
          <div className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide">
            🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః • శ్రీ మాత్రే నమః • శుభమస్తు 🕉️
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
            శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం
          </h3>
          <p className="text-sm sm:text-lg font-extrabold text-amber-300">
            బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు
            <span className="block sm:inline sm:ml-2 text-xs sm:text-sm font-semibold text-amber-200/90">
              (ప్రముఖ వేద జ్యోతిష్య, వాస్తు, ముహూర్త & స్మార్త పురోహితులు - హైదరాబాద్)
            </span>
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-extrabold text-xs sm:text-base shadow">
            <span>🌐 www.telugujyothisham.com</span>
            <span>•</span>
            <span>📞 WhatsApp / Call: +91 89779 86166</span>
          </div>

          <div className="pt-1 text-[11px] sm:text-xs font-bold text-amber-200 leading-relaxed max-w-4xl mx-auto">
            🌟 <strong>మా వెబ్‌సైట్ ప్రత్యేక సేవలు:</strong> 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF) • శాస్త్రోక్త వివాహ పొంతన • శుభ ముహూర్త నిర్ణయం (గృహప్రవేశం, వివాహం, వ్యాపారం, నామకరణం) • గృహ/వ్యాపార వాస్తు & సకల గ్రహ దోష శాంతి హోమాలు
          </div>
        </div>

        {/* Document Title & Optional Client Details */}
        <div className="bg-amber-900 text-white rounded-2xl px-4 py-3.5 text-center border-2 border-amber-500 space-y-1">
          <h4 className="text-lg sm:text-2xl font-extrabold text-amber-200">
            🏡 తెలంగాణ సాంప్రదాయ గృహప్రవేశం పూజా సామాగ్రి జాబితా
          </h4>
          {(clientName.trim() || muhurthamDate.trim() || muhurthamTime.trim()) && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-bold text-white pt-1">
              {clientName.trim() && <span>👤 యజమాని: {clientName.trim()}</span>}
              {muhurthamDate.trim() && <span>📅 తేదీ: {muhurthamDate.trim()}</span>}
              {muhurthamTime.trim() && <span>⏰ శుభ సమయం: {muhurthamTime.trim()}</span>}
            </div>
          )}
        </div>

        {/* 2-Column Grid of Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): 1. Vastu Pooja */}
          {sections
            .filter((s) => s.id === 'vastu' && s.enabled)
            .map((sec) => (
              <div
                key={sec.id}
                className="lg:col-span-7 bg-white rounded-2xl border-2 border-amber-400 shadow-sm overflow-hidden"
              >
                <div className="bg-amber-800 text-amber-100 px-4 py-3 flex items-center justify-between">
                  <div>
                    <h5 className="text-base sm:text-lg font-extrabold text-amber-200">
                      ✨ {sec.titleTe}
                    </h5>
                    <p className="text-[11px] text-amber-100/80">{sec.subtitleTe}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-200 text-xs font-extrabold">
                    {sec.items.length} వస్తువులు
                  </span>
                </div>

                <div className="divide-y divide-amber-100">
                  {sec.items.map((item, idx) => {
                    const isSpecial =
                      item.nameTe.includes('కలశం చెంబులు') ||
                      item.nameTe.includes('నవధాన్యాలు');
                    return (
                      <div
                        key={item.id}
                        className={`px-3.5 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm ${
                          isSpecial
                            ? 'bg-amber-100/90 font-extrabold text-amber-950'
                            : idx % 2 === 1
                              ? 'bg-amber-50/40 text-slate-800'
                              : 'bg-white text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-amber-700 font-bold shrink-0">
                            ☐ {idx + 1}.
                          </span>
                          <span className="font-bold break-words">
                            {item.nameTe}
                            {isSpecial && (
                              <span className="ml-1.5 inline-block px-1.5 py-0.5 text-[10px] rounded bg-amber-700 text-white font-extrabold">
                                ముఖ్యమైనది
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-extrabold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-lg border border-amber-300/70">
                            {item.qtyTe}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(sec.id, item.id)}
                            title="తൊలగించు"
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1 print:hidden cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Right Column (5 cols): 2. Homam, 3. Vratam, 4. Kalyanam */}
          <div className="lg:col-span-5 space-y-6">
            {sections
              .filter((s) => s.id !== 'vastu' && s.enabled)
              .map((sec) => (
                <div
                  key={sec.id}
                  className="bg-white rounded-2xl border-2 border-amber-400 shadow-sm overflow-hidden"
                >
                  <div className="bg-amber-800 text-amber-100 px-4 py-3 flex items-center justify-between">
                    <div>
                      <h5 className="text-base font-extrabold text-amber-200">
                        ✨ {sec.titleTe}
                      </h5>
                      <p className="text-[11px] text-amber-100/80">{sec.subtitleTe}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-200 text-xs font-extrabold">
                      {sec.items.length}
                    </span>
                  </div>

                  <div className="divide-y divide-amber-100">
                    {sec.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`px-3.5 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm ${
                          idx % 2 === 1 ? 'bg-amber-50/40' : 'bg-white'
                        } text-slate-800`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-amber-700 font-bold shrink-0">
                            ☐ {idx + 1}.
                          </span>
                          <span className="font-bold break-words">{item.nameTe}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-extrabold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-lg border border-amber-300/70">
                            {item.qtyTe}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(sec.id, item.id)}
                            title="తొలగించు"
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1 print:hidden cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {/* Website Services Advertisement Card inside the Sheet */}
            <div className="bg-gradient-to-br from-[#2a0702] to-amber-950 text-white rounded-2xl p-4 sm:p-5 border-2 border-amber-500 shadow-md space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                🌟 శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — ప్రత్యేక సేవలు
              </div>
              <ul className="space-y-1.5 text-xs text-amber-100 font-semibold leading-relaxed">
                <li>✅ 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF)</li>
                <li>✅ శాస్త్రోక్త వివాహ పొంతన (36 గుణముల అష్టకూట & నాడీ పరిశీలన)</li>
                <li>✅ గృహప్రవేశం, వివాహం, నూతన వ్యాపార శుభ ముహూర్త నిర్ణయం</li>
                <li>✅ గృహ / వ్యాపార వాస్తు & నవగ్రహ / గణపతి / రుద్ర / చండీ హోమాలు</li>
              </ul>
              <div className="pt-2 border-t border-amber-700/60 text-center">
                <div className="text-xs sm:text-sm font-extrabold text-amber-300">
                  🌐 www.telugujyothisham.com • 📞 +91 89779 86166
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note & Brand Signature */}
        <div className="bg-amber-100/90 border-2 border-amber-400 rounded-2xl p-4 text-center space-y-1.5">
          <p className="text-xs sm:text-sm font-extrabold text-amber-950">{customNote}</p>
          <p className="text-xs font-bold text-amber-900">
            🙏 సర్వే జనాః సుఖినో భవంతు • శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (www.telugujyothisham.com) • WhatsApp: +91 89779 86166
          </p>
        </div>
      </div>
    </div>
  );
};
