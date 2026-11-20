import { LivePanchangamSheetSnapshot } from './livePanchangamSheetEngine';

export type RoyalCardAspect = 'story_9_16' | 'feed_4_5';

export interface MinimalCanvasContext2D {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  font: string;
  textAlign: CanvasTextAlign;
  save(): void;
  restore(): void;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  arc(x: number, y: number, r: number, startAngle: number, endAngle: number): void;
  clip(): void;
  fill(): void;
  stroke(): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  measureText(text: string): { width: number };
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  drawImage(...args: any[]): void;
}

function stripEmoji(text: string): string {
  return String(text || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function roundRectPath(
  ctx: MinimalCanvasContext2D,
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

function drawCenteredText(
  ctx: MinimalCanvasContext2D,
  text: string,
  centerX: number,
  y: number,
  maxWidth: number
) {
  const clean = stripEmoji(text);
  ctx.save();
  ctx.textAlign = 'left';
  const measured = Math.min(ctx.measureText(clean).width, maxWidth);
  ctx.fillText(clean, Math.round(centerX - measured / 2), y, maxWidth);
  ctx.restore();
}

function drawRightAlignedText(
  ctx: MinimalCanvasContext2D,
  text: string,
  rightX: number,
  y: number,
  maxWidth: number
) {
  const clean = stripEmoji(text);
  ctx.save();
  ctx.textAlign = 'left';
  const measured = Math.min(ctx.measureText(clean).width, maxWidth);
  ctx.fillText(clean, Math.round(rightX - measured), y, maxWidth);
  ctx.restore();
}

function drawCircularPortrait(
  ctx: MinimalCanvasContext2D,
  cx: number,
  cy: number,
  radius: number,
  avatarImage?: unknown
) {
  // Outer antique gold ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 5, 0, Math.PI * 2);
  ctx.fillStyle = '#E5B44B';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
  ctx.fillStyle = '#3B0805';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (avatarImage) {
    try {
      const imgObj = avatarImage as {
        naturalWidth?: number;
        naturalHeight?: number;
        width?: number;
        height?: number;
      };
      const iw = imgObj.naturalWidth || imgObj.width || 0;
      const ih = imgObj.naturalHeight || imgObj.height || 0;
      if (iw > 0 && ih > 0) {
        const cropSize = Math.min(iw, ih);
        const sx = Math.round((iw - cropSize) / 2);
        const sy = Math.round(Math.max(0, (ih - cropSize) * 0.14));
        ctx.drawImage(
          avatarImage,
          sx,
          sy,
          cropSize,
          cropSize,
          cx - radius,
          cy - radius,
          radius * 2,
          radius * 2
        );
      } else {
        ctx.drawImage(avatarImage, cx - radius, cy - radius, radius * 2, radius * 2);
      }
    } catch {
      const grad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      grad.addColorStop(0, '#7A1C0E');
      grad.addColorStop(1, '#3B0805');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.fillStyle = '#FDE68A';
      ctx.font = `bold ${Math.round(radius * 0.9)}px "Noto Serif Telugu", serif`;
      drawCenteredText(ctx, 'ఓం', cx, cy + Math.round(radius * 0.3), radius * 1.6);
    }
  } else {
    const grad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    grad.addColorStop(0, '#7A1C0E');
    grad.addColorStop(1, '#3B0805');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.fillStyle = '#FDE68A';
    ctx.font = `bold ${Math.round(radius * 0.9)}px "Noto Serif Telugu", serif`;
    drawCenteredText(ctx, 'ఓం', cx, cy + Math.round(radius * 0.3), radius * 1.6);
  }
  ctx.restore();
}

/**
 * Draws the Royal Temple Manuscript Panchangam + Live South Indian Kundali Sheet
 * Works identically on Browser Canvas2D and Node.js @napi-rs/canvas.
 */
export function paintRoyalPanchangamSheet(
  ctx: MinimalCanvasContext2D,
  snap: LivePanchangamSheetSnapshot,
  options?: {
    aspect?: RoyalCardAspect;
    avatarImage?: unknown;
  }
) {
  const aspect: RoyalCardAspect = options?.aspect || 'feed_4_5';
  const isStory = aspect === 'story_9_16';
  const W = 1080;
  const H = isStory ? 1920 : 1350;

  ctx.textAlign = 'left';

  // 1. Warm Archival Palm-Leaf Ivory Canvas
  ctx.fillStyle = '#FAF5EA';
  ctx.fillRect(0, 0, W, H);

  // Subtle decorative outer antique gold border
  ctx.strokeStyle = '#C99634';
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, W - 24, H - 24);

  // 2. Royal Temple Maroon-Sindoor Header Band
  const headerH = isStory ? 186 : 134;
  const headerGrad = ctx.createLinearGradient(0, 0, W, headerH);
  headerGrad.addColorStop(0, '#5E1508');
  headerGrad.addColorStop(0.5, '#3E0B05');
  headerGrad.addColorStop(1, '#260503');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, W, headerH);

  // Gold hairline beneath header
  ctx.fillStyle = '#D9A441';
  ctx.fillRect(0, headerH - 4, W, 4);

  // Portrait in Header
  const avatarR = isStory ? 56 : 42;
  const avatarCx = 86;
  const avatarCy = Math.round(headerH / 2);
  drawCircularPortrait(ctx, avatarCx, avatarCy, avatarR, options?.avatarImage);

  // Header Brand Typography
  const textX = avatarCx + avatarR + 24;
  ctx.fillStyle = '#FFFDF7';
  ctx.font = `bold ${isStory ? 38 : 31}px "Noto Serif Telugu", serif`;
  ctx.fillText('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', textX, isStory ? 84 : 61, 560);

  ctx.fillStyle = '#F6D37B';
  ctx.font = `600 ${isStory ? 23 : 19}px "Noto Serif Telugu", sans-serif`;
  ctx.fillText('బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు · హైదరాబాద్', textX, isStory ? 128 : 96, 570);

  // Header Right Tag
  ctx.fillStyle = '#FDE68A';
  ctx.font = `bold ${isStory ? 28 : 23}px "Noto Serif Telugu", serif`;
  drawRightAlignedText(ctx, 'నేటి పంచాంగం', W - 36, isStory ? 82 : 59, 250);
  ctx.fillStyle = '#E8C57B';
  ctx.font = `600 ${isStory ? 21 : 17}px "Noto Serif Telugu", sans-serif`;
  drawRightAlignedText(ctx, `లైవ్ గ్రహస్థితి · ${snap.liveTimeLabel}`, W - 36, isStory ? 122 : 92, 260);

  // =========================================================================
  // 3. MAIN ASYMMETRIC SPLIT (Left Calendar Spine + Right 4-Anga & Kundali)
  // =========================================================================
  const padX = 28;
  const topY = headerH + (isStory ? 24 : 16);
  const gap = 20;
  const leftW = 316;
  const rightX = padX + leftW + gap;
  const rightW = W - rightX - padX;
  const upperSectionH = isStory ? 1020 : 728;

  // --- LEFT CALENDAR SPINE (Deep Royal Temple Maroon-Indigo — Signature Palette) ---
  roundRectPath(ctx, padX, topY, leftW, upperSectionH, 22);
  const railGrad = ctx.createLinearGradient(padX, topY, padX, topY + upperSectionH);
  railGrad.addColorStop(0, '#3C0A0C');
  railGrad.addColorStop(0.55, '#270A17');
  railGrad.addColorStop(1, '#1A0A1A');
  ctx.fillStyle = railGrad;
  ctx.fill();
  ctx.strokeStyle = '#C99634';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const railCenterX = padX + leftW / 2;

  // Huge Date Number
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${isStory ? 116 : 86}px Georgia, "Noto Serif Telugu", serif`;
  drawCenteredText(ctx, snap.dayNumber, railCenterX, topY + (isStory ? 124 : 90), leftW - 32);

  // Month & Year
  ctx.fillStyle = '#F5C451';
  ctx.font = `bold ${isStory ? 30 : 24}px "Noto Serif Telugu", serif`;
  drawCenteredText(ctx, snap.monthYearTe, railCenterX, topY + (isStory ? 174 : 128), leftW - 28);

  // Weekday · City
  ctx.fillStyle = '#E2D4C5';
  ctx.font = `600 ${isStory ? 22 : 18}px "Noto Serif Telugu", sans-serif`;
  drawCenteredText(
    ctx,
    `${snap.weekdayTe} · ${snap.cityTe}`,
    railCenterX,
    topY + (isStory ? 210 : 158),
    leftW - 24
  );

  // Subtle divider line
  ctx.strokeStyle = 'rgba(217, 164, 65, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX + 28, topY + (isStory ? 236 : 176));
  ctx.lineTo(padX + leftW - 28, topY + (isStory ? 236 : 176));
  ctx.stroke();

  // Vertical Golden Timeline Spine (6 Calendar Items)
  const timelineItems = [
    { label: 'సంవత్సరం', val: snap.samvatsaramShortTe },
    { label: 'అయనం', val: snap.ayanamTe },
    { label: 'ఋతువు', val: snap.rutuvuTe },
    { label: 'మాసం', val: snap.masamTe },
    { label: 'పక్షం', val: snap.pakshamTe },
    { label: 'వారం', val: snap.weekdayTe },
  ];

  const tlStartY = topY + (isStory ? 286 : 212);
  const tlStep = isStory ? 84 : 60;
  const tlLineX = padX + 34;

  // Vertical golden thread
  ctx.strokeStyle = 'rgba(229, 180, 75, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(tlLineX, tlStartY);
  ctx.lineTo(tlLineX, tlStartY + tlStep * (timelineItems.length - 1));
  ctx.stroke();

  timelineItems.forEach((item, idx) => {
    const iy = tlStartY + idx * tlStep;
    ctx.beginPath();
    ctx.arc(tlLineX, iy, isStory ? 7.5 : 6, 0, Math.PI * 2);
    ctx.fillStyle = '#F5C451';
    ctx.fill();

    ctx.fillStyle = '#DFC39B';
    ctx.font = `600 ${isStory ? 20 : 15}px "Noto Serif Telugu", sans-serif`;
    ctx.fillText(item.label, tlLineX + 20, iy - (isStory ? 4 : 2), leftW - 70);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${isStory ? 29 : 22}px "Noto Serif Telugu", serif`;
    ctx.fillText(item.val, tlLineX + 20, iy + (isStory ? 30 : 23), leftW - 70);
  });

  // Bottom Temple Crest Box inside Rail
  const crestBoxH = isStory ? 228 : 150;
  const crestBoxY = topY + upperSectionH - crestBoxH - 18;
  roundRectPath(ctx, padX + 18, crestBoxY, leftW - 36, crestBoxH, 16);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(217, 164, 65, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  drawCircularPortrait(
    ctx,
    railCenterX,
    crestBoxY + (isStory ? 84 : 56),
    isStory ? 54 : 38,
    options?.avatarImage
  );

  ctx.fillStyle = '#FDE68A';
  ctx.font = `bold ${isStory ? 22 : 17}px "Noto Serif Telugu", serif`;
  drawCenteredText(
    ctx,
    'జల్లవరం సాయి ధీరజ్ శర్మ',
    railCenterX,
    crestBoxY + (isStory ? 174 : 118),
    leftW - 52
  );
  ctx.fillStyle = '#D9C5AD';
  ctx.font = `600 ${isStory ? 17 : 13}px sans-serif`;
  drawCenteredText(
    ctx,
    'Drik Siddhanta · Lahiri',
    railCenterX,
    crestBoxY + (isStory ? 204 : 138),
    leftW - 52
  );

  // --- RIGHT TOP: 4-ANGA PANCHANGA LEDGER (Tithi, Nakshatra, Yoga, Karana) ---
  const angaH = isStory ? 344 : 238;
  roundRectPath(ctx, rightX, topY, rightW, angaH, 20);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#DFC89B';
  ctx.lineWidth = 2;
  ctx.stroke();

  const angaRows = [
    { label: 'తిథి', value: snap.tithiNameTe, end: snap.tithiEndTe, accent: '#9A3412' },
    { label: 'నక్షత్రం', value: snap.nakshatraNameTe, end: snap.nakshatraEndTe, accent: '#6B21A8' },
    { label: 'యోగం', value: snap.yogamNameTe, end: snap.yogamEndTe, accent: '#047857' },
    { label: 'కరణం', value: snap.karanamNameTe, end: snap.karanamEndTe, accent: '#9D174D' },
  ];

  const rowH = angaH / 4;
  angaRows.forEach((row, idx) => {
    const ry = topY + idx * rowH;
    if (idx > 0) {
      ctx.strokeStyle = '#EFE6D5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rightX + 20, ry);
      ctx.lineTo(rightX + rightW - 20, ry);
      ctx.stroke();
    }

    // Small refined square marker (not a thick left border)
    ctx.fillStyle = row.accent;
    ctx.beginPath();
    ctx.arc(rightX + 26, ry + rowH * 0.34, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = row.accent;
    ctx.font = `bold ${isStory ? 20 : 15}px "Noto Serif Telugu", sans-serif`;
    ctx.fillText(row.label, rightX + 40, ry + rowH * 0.4, 240);

    ctx.fillStyle = '#1C1917';
    ctx.font = `bold ${isStory ? 31 : 24}px "Noto Serif Telugu", serif`;
    ctx.fillText(row.value, rightX + 40, ry + rowH * 0.8, rightW * 0.52);

    // Clean right-aligned timing label (archival editorial style)
    ctx.fillStyle = '#44403C';
    ctx.font = `bold ${isStory ? 22 : 17}px "Noto Serif Telugu", sans-serif`;
    drawRightAlignedText(ctx, row.end, rightX + rightW - 24, ry + rowH * 0.64, rightW * 0.44);
  });

  // --- RIGHT BOTTOM: LIVE 4x4 SOUTH INDIAN KUNDALI (గ్రహస్థితి) ---
  const kundaliY = topY + angaH + 16;
  const kundaliH = upperSectionH - angaH - 16;

  roundRectPath(ctx, rightX, kundaliY, rightW, kundaliH, 20);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#DFC89B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Kundali Title Bar
  ctx.fillStyle = '#5E1508';
  ctx.font = `bold ${isStory ? 22 : 17}px "Noto Serif Telugu", serif`;
  ctx.fillText(
    `దక్షిణ భారత కుండలి (గ్రహస్థితి) · ${snap.liveTimeLabel} IST`,
    rightX + 20,
    kundaliY + (isStory ? 36 : 28),
    rightW - 40
  );

  const gridPad = isStory ? 18 : 14;
  const gridTop = kundaliY + (isStory ? 50 : 38);
  const gridW = rightW - gridPad * 2;
  const gridH = kundaliH - (isStory ? 68 : 52);
  const cellW = gridW / 4;
  const cellH = gridH / 4;
  const gridX = rightX + gridPad;

  // Draw 12 Outer Houses
  for (const h of snap.houses) {
    const cx = gridX + h.gridCol * cellW;
    const cy = gridTop + h.gridRow * cellH;

    // Subtle ivory-gold tint for Moon sign, warm paper for others
    ctx.fillStyle = h.isChandraRashi
      ? '#FFF6DE'
      : h.isLagnaRashi
        ? '#FEF4F2'
        : '#FFFDFA';
    ctx.fillRect(cx, cy, cellW, cellH);

    ctx.strokeStyle = '#C99634';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cellW, cellH);

    // Subtle Rashi name in bottom-right corner
    ctx.fillStyle = h.isChandraRashi ? '#854D0E' : '#78716C';
    ctx.font = `600 ${isStory ? 18 : 14}px "Noto Serif Telugu", sans-serif`;
    drawRightAlignedText(ctx, h.rashiTe, cx + cellW - 8, cy + cellH - 8, cellW - 14);

    // Draw planets inside this house in neat 2-column rows
    const pFont = isStory ? 29 : 22;
    const pColStep = Math.round(cellW * 0.44);
    const pRowStep = isStory ? 38 : 29;
    h.planets.slice(0, 6).forEach((p, pIdx) => {
      const col = pIdx % 2;
      const row = Math.floor(pIdx / 2);
      const px = cx + 12 + col * pColStep;
      const py = cy + (isStory ? 38 : 29) + row * pRowStep;

      ctx.fillStyle = p.color;
      ctx.font = `bold ${pFont}px "Noto Serif Telugu", serif`;
      ctx.fillText(p.shortTe, px, py, pColStep + 14);
      if (p.isRetrograde) {
        const baseW = ctx.measureText(p.shortTe).width;
        ctx.font = `bold ${Math.round(pFont * 0.54)}px sans-serif`;
        ctx.fillText('R', px + baseW + 2, py - Math.round(pFont * 0.34), 18);
      }
    });
  }

  // Center 2x2 Sanctuary Hub inside Kundali
  const hubX = gridX + cellW;
  const hubY = gridTop + cellH;
  const hubW = cellW * 2;
  const hubH = cellH * 2;
  const hubGrad = ctx.createLinearGradient(hubX, hubY, hubX + hubW, hubY + hubH);
  hubGrad.addColorStop(0, '#FDF5E2');
  hubGrad.addColorStop(1, '#F7E7C4');
  ctx.fillStyle = hubGrad;
  ctx.fillRect(hubX, hubY, hubW, hubH);
  ctx.strokeStyle = '#C99634';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(hubX, hubY, hubW, hubH);

  const hubCenterX = hubX + hubW / 2;
  const hubCenterY = hubY + hubH / 2;

  ctx.fillStyle = '#7C2D12';
  ctx.font = `bold ${isStory ? 34 : 26}px "Noto Serif Telugu", serif`;
  drawCenteredText(ctx, 'గ్రహస్థితి కుండలి', hubCenterX, hubCenterY - (isStory ? 30 : 20), hubW - 24);

  ctx.fillStyle = '#44403C';
  ctx.font = `bold ${isStory ? 22 : 17}px "Noto Serif Telugu", sans-serif`;
  drawCenteredText(
    ctx,
    `${snap.dayNumber} ${snap.monthYearTe}`,
    hubCenterX,
    hubCenterY + (isStory ? 12 : 10),
    hubW - 24
  );

  ctx.fillStyle = '#9A3412';
  ctx.font = `bold ${isStory ? 21 : 16}px "Noto Serif Telugu", sans-serif`;
  drawCenteredText(
    ctx,
    `లగ్నం: ${snap.lagnaRashiTe} · ${snap.liveTimeLabel}`,
    hubCenterX,
    hubCenterY + (isStory ? 46 : 36),
    hubW - 24
  );

  // =========================================================================
  // 4. BOTTOM SPLIT: SHUBHA SAMAYALU (LEFT) vs ASHUBHA SAMAYALU (RIGHT)
  // =========================================================================
  const splitY = topY + upperSectionH + (isStory ? 22 : 16);
  const splitH = isStory ? 474 : 332;
  const halfW = (W - padX * 2 - gap) / 2;

  // Left Box: Shubha Samayalu
  roundRectPath(ctx, padX, splitY, halfW, splitH, 20);
  ctx.fillStyle = '#EFF8F3';
  ctx.fill();
  ctx.strokeStyle = '#86C9A5';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#065F46';
  ctx.font = `bold ${isStory ? 27 : 21}px "Noto Serif Telugu", serif`;
  ctx.fillText('శుభ సమయాలు (Auspicious)', padX + 24, splitY + (isStory ? 44 : 34), halfW - 44);

  const shubhaRows = [
    { k: 'సూర్యోదయం', v: snap.sunriseTe },
    { k: 'సూర్యాస్తమయం', v: snap.sunsetTe },
    { k: 'అభిజిత్ ముహూర్తం', v: snap.abhijitTe },
    { k: 'అమృత కాలం', v: snap.amruthaTe },
    { k: 'బ్రహ్మ ముహూర్తం', v: snap.brahmaMuhurthamTe },
  ];

  const timingStartY = splitY + (isStory ? 84 : 64);
  const timingStep = isStory ? 76 : 52;

  shubhaRows.forEach((item, idx) => {
    const ty = timingStartY + idx * timingStep;
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(padX + 28, ty - 6, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#065F46';
    ctx.font = `bold ${isStory ? 21 : 15.5}px "Noto Serif Telugu", sans-serif`;
    ctx.fillText(item.k, padX + 42, ty, halfW - 60);

    ctx.fillStyle = '#111827';
    ctx.font = `bold ${isStory ? 24 : 18}px "Noto Serif Telugu", sans-serif`;
    ctx.fillText(item.v, padX + 42, ty + (isStory ? 31 : 22), halfW - 60);
  });

  // Right Box: Ashubha Samayalu
  const rightBoxX = padX + halfW + gap;
  roundRectPath(ctx, rightBoxX, splitY, halfW, splitH, 20);
  ctx.fillStyle = '#FDF2F2';
  ctx.fill();
  ctx.strokeStyle = '#E8A5A5';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#991B1B';
  ctx.font = `bold ${isStory ? 27 : 21}px "Noto Serif Telugu", serif`;
  ctx.fillText('అశుభ సమయాలు (Caution)', rightBoxX + 24, splitY + (isStory ? 44 : 34), halfW - 44);

  const ashubhaRows = [
    { k: 'రాహుకాలం', v: snap.rahukalamTe },
    { k: 'యమగండం', v: snap.yamagandamTe },
    { k: 'గుళిక కాలం', v: snap.gulikaTe },
    { k: 'దుర్ముహూర్తం', v: snap.durmuhurthamTe },
    { k: 'వర్జ్యం', v: snap.varjyamTe },
  ];

  ashubhaRows.forEach((item, idx) => {
    const ty = timingStartY + idx * timingStep;
    ctx.fillStyle = '#B91C1C';
    ctx.beginPath();
    ctx.arc(rightBoxX + 28, ty - 6, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#991B1B';
    ctx.font = `bold ${isStory ? 21 : 15.5}px "Noto Serif Telugu", sans-serif`;
    ctx.fillText(item.k, rightBoxX + 42, ty, halfW - 60);

    ctx.fillStyle = '#111827';
    ctx.font = `bold ${isStory ? 24 : 18}px "Noto Serif Telugu", sans-serif`;
    ctx.fillText(item.v, rightBoxX + 42, ty + (isStory ? 31 : 22), halfW - 60);
  });

  // =========================================================================
  // 5. DEVOTIONAL STRIP & ROYAL FOOTER
  // =========================================================================
  const stripY = splitY + splitH + (isStory ? 20 : 14);
  const stripH = isStory ? 66 : 48;
  roundRectPath(ctx, padX, stripY, W - padX * 2, stripH, 14);
  ctx.fillStyle = '#EFE6D5';
  ctx.fill();
  ctx.strokeStyle = '#D6B982';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#4A180B';
  ctx.font = `bold ${isStory ? 23 : 18}px "Noto Serif Telugu", serif`;
  drawCenteredText(
    ctx,
    snap.deityFooterTe,
    W / 2,
    stripY + (isStory ? 42 : 31),
    W - padX * 2 - 36
  );

  // Bottom Temple Footer
  const footerY = stripY + stripH + (isStory ? 18 : 12);
  const footerH = H - footerY;
  const footGrad = ctx.createLinearGradient(0, footerY, W, H);
  footGrad.addColorStop(0, '#3E0B05');
  footGrad.addColorStop(1, '#230502');
  ctx.fillStyle = footGrad;
  ctx.fillRect(0, footerY, W, footerH);

  ctx.fillStyle = '#D9A441';
  ctx.fillRect(0, footerY, W, 3);

  ctx.fillStyle = '#FFF9EC';
  ctx.font = `bold ${isStory ? 28 : 22}px "Noto Serif Telugu", sans-serif`;
  drawCenteredText(
    ctx,
    'www.telugujyothisham.com  ·  WhatsApp: +91 89779 86166',
    W / 2,
    footerY + (isStory ? 48 : 30),
    W - 60
  );

  if (isStory) {
    ctx.fillStyle = '#F3CC73';
    ctx.font = `600 20px "Noto Serif Telugu", sans-serif`;
    drawCenteredText(
      ctx,
      'ఉచిత 100 పేజీల జాతకం PDF & దృక్సిద్ధాంత పంచాంగం · సర్వే జనాః సుఖినో భవంతు',
      W / 2,
      footerY + 86,
      W - 60
    );
  }
}
