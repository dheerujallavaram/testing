import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

const A4_WIDTH_MM = 210;
const A4_WIDTH_PX = 794; // 210mm at 96 DPI
const MIN_PAGE_HEIGHT_MM = 140;
const MM_PER_PX = A4_WIDTH_MM / A4_WIDTH_PX;

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+Telugu:wght@400;600;700&display=swap';

let cachedFontEmbedCss: string | null = null;

/**
 * Fetches Google Fonts CSS and converts font URLs to base64 data URLs once,
 * bypassing document.styleSheets CORS errors while ensuring exact Telugu glyph rendering in SVG foreignObject.
 */
async function getSafeEmbeddedFontCss(): Promise<string> {
  if (cachedFontEmbedCss !== null) {
    return cachedFontEmbedCss;
  }
  try {
    const cssResp = await fetch(GOOGLE_FONTS_CSS_URL, { mode: 'cors' });
    if (!cssResp.ok) {
      cachedFontEmbedCss = '';
      return '';
    }
    let cssText = await cssResp.text();
    const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
    const matches = Array.from(cssText.matchAll(urlRegex));

    await Promise.all(
      matches.map(async (match) => {
        const rawUrl = match[1].replace(/['"]/g, '');
        try {
          const fontResp = await fetch(rawUrl, { mode: 'cors' });
          if (!fontResp.ok) return;
          const blob = await fontResp.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(String(reader.result || ''));
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          if (dataUrl) {
            cssText = cssText.split(match[0]).join(`url("${dataUrl}")`);
          }
        } catch {
          // Ignore individual font subset fetch error
        }
      })
    );

    cachedFontEmbedCss = cssText;
    return cssText;
  } catch {
    cachedFontEmbedCss = '';
    return '';
  }
}

interface LinkAnnotationRect {
  xMm: number;
  yMm: number;
  wMm: number;
  hMm: number;
  url: string;
}

/**
 * Extracts clickable hyperlink coordinates (in mm) relative to a page element.
 */
function collectLinkAnnotations(pageEl: HTMLElement): LinkAnnotationRect[] {
  const pageRect = pageEl.getBoundingClientRect();
  const anchors = Array.from(pageEl.querySelectorAll<HTMLAnchorElement>('a[href]'));
  const links: LinkAnnotationRect[] = [];

  for (const a of anchors) {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;

    const r = a.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;

    const xPx = Math.max(0, r.left - pageRect.left);
    const yPx = Math.max(0, r.top - pageRect.top);

    links.push({
      xMm: Number((xPx * MM_PER_PX).toFixed(2)),
      yMm: Number((yPx * MM_PER_PX).toFixed(2)),
      wMm: Number((r.width * MM_PER_PX).toFixed(2)),
      hMm: Number((r.height * MM_PER_PX).toFixed(2)),
      url: href,
    });
  }

  return links;
}

/**
 * Generates a Single-Side Royal PDF where every page has:
 * - Fixed width: 210mm (794px @ 96dpi)
 * - 1-inch (25.4mm / 96px) top and bottom royal margins
 * - Full-width Single-Column content layout with generous spacing after text
 * - Embedded Noto Serif Telugu font so Telugu conjuncts & line heights never overlap
 * - Preserved clickable links (www.telugujyothisham.com & WhatsApp +91 89779 86166)
 */
export async function exportVariableHeightJathakamPdf(
  reportContainerEl: HTMLElement,
  fileName: string,
  onProgress?: (currentPage: number, totalPages: number) => void
): Promise<void> {
  const prevScrollX = window.scrollX;
  const prevScrollY = window.scrollY;

  // Apply desktop 794px (210mm) single-side royal capture mode
  reportContainerEl.classList.add('pdf-dynamic-capture');

  try {
    const fontEmbedCSS = await getSafeEmbeddedFontCss();

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    // Wait a frame for layout reflow at 794px width
    await new Promise((r) => setTimeout(r, 180));

    const pageNodes = Array.from(
      reportContainerEl.querySelectorAll<HTMLElement>('.print-page-sheet, .page, .pdf-page')
    );

    if (pageNodes.length === 0) {
      throw new Error('No .print-page-sheet / .page elements found to export.');
    }

    let pdf: jsPDF | null = null;
    const totalPages = pageNodes.length;

    for (let i = 0; i < totalPages; i++) {
      const pageEl = pageNodes[i];
      onProgress?.(i + 1, totalPages);

      const measuredWidthPx = A4_WIDTH_PX;
      const measuredHeightPx = Math.ceil(pageEl.scrollHeight || pageEl.getBoundingClientRect().height);
      const rawHeightMm = Number((measuredHeightPx * MM_PER_PX).toFixed(2));
      const bgColor = '#fffdf7';

      const links = collectLinkAnnotations(pageEl);

      // Render this page node at 2x DPI (1588px wide) with embedded Telugu font metrics
      const dataUrl = await toJpeg(pageEl, {
        quality: 0.95,
        pixelRatio: 2,
        width: measuredWidthPx,
        height: measuredHeightPx,
        backgroundColor: bgColor,
        cacheBust: false,
        fontEmbedCSS,
        style: {
          margin: '0',
          width: `${measuredWidthPx}px`,
          maxWidth: `${measuredWidthPx}px`,
          height: `${measuredHeightPx}px`,
          boxSizing: 'border-box',
        },
      });

      const finalPageHeightMm = Math.max(MIN_PAGE_HEIGHT_MM, rawHeightMm);
      // CRITICAL jsPDF orientation rule:
      // jsPDF sorts format [w, h] so 'p' forces width <= height and 'l' forces width >= height.
      // Passing 'l' whenever finalPageHeightMm < 210 guarantees page width is ALWAYS 210mm!
      const orientation = finalPageHeightMm < A4_WIDTH_MM ? 'l' : 'p';

      if (!pdf) {
        pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format: [A4_WIDTH_MM, finalPageHeightMm],
          compress: true,
        });
      } else {
        pdf.addPage([A4_WIDTH_MM, finalPageHeightMm], orientation);
      }

      pdf.addImage(dataUrl, 'JPEG', 0, 0, A4_WIDTH_MM, rawHeightMm, undefined, 'FAST');

      // Attach clickable PDF hyperlinks
      for (const lnk of links) {
        if (lnk.yMm + lnk.hMm <= finalPageHeightMm + 2) {
          pdf.link(lnk.xMm, lnk.yMm, lnk.wMm, lnk.hMm, { url: lnk.url });
        }
      }
    }

    if (pdf) {
      const cleanName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      pdf.save(cleanName);
    }
  } finally {
    reportContainerEl.classList.remove('pdf-dynamic-capture');
    window.scrollTo(prevScrollX, prevScrollY);
  }
}
