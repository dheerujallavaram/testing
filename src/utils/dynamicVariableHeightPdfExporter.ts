import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

const A4_WIDTH_MM = 210;
const A4_WIDTH_PX = 794; // 210mm at 96 DPI
const MIN_PAGE_HEIGHT_MM = 140;
const MM_PER_PX = A4_WIDTH_MM / A4_WIDTH_PX;
const MAX_CANVAS_PIXELS = 9_000_000; // Safe below iOS Safari 16.7M & Android GPU limits
const MAX_CANVAS_HEIGHT_PX = 9_500;
const TRANSPARENT_1X1_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+Telugu:wght@400;600;700&display=swap';

let cachedFontEmbedCss: string | null = null;

export interface ExportedPdfResult {
  blob: Blob;
  blobUrl: string;
  fileName: string;
  pageCount: number;
}

/**
 * Sanitizes a download filename to safe cross-browser ASCII characters
 * so mobile browsers, WebViews, and sandboxed iframes never reject the download.
 */
export function sanitizePdfFileName(rawName: string): string {
  const withoutExt = rawName.replace(/\.pdf$/i, '').trim();
  const asciiOnly = withoutExt
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const base =
    asciiOnly.length >= 3 && !/^Brihat_Jathakam_Report$/i.test(asciiOnly)
      ? asciiOnly
      : 'Telugu_Jathakam_Brihat_Report';
  return `${base}.pdf`;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { mode: 'cors', signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Keeps only Telugu & Latin @font-face subsets so SVG foreignObject rendering stays fast and lightweight.
 */
function filterEssentialFontFaceBlocks(cssText: string): string {
  const blockRegex = /(?:\/\*\s*([a-z0-9-]+)\s*\*\/\s*)?@font-face\s*\{[^}]+\}/gi;
  const kept: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(cssText)) !== null) {
    const subset = (match[1] || '').toLowerCase();
    if (!subset || subset === 'telugu' || subset === 'latin') {
      kept.push(match[0]);
    }
  }
  return kept.length > 0 ? kept.join('\n') : cssText;
}

/**
 * Fetches Google Fonts CSS and converts essential Telugu + Latin font URLs to base64 data URLs once,
 * bypassing document.styleSheets CORS errors while ensuring exact Telugu glyph rendering in SVG foreignObject.
 */
async function getSafeEmbeddedFontCss(): Promise<string> {
  if (cachedFontEmbedCss !== null) {
    return cachedFontEmbedCss;
  }
  try {
    const cssResp = await fetchWithTimeout(GOOGLE_FONTS_CSS_URL, 6000);
    if (!cssResp.ok) {
      return '';
    }
    const rawCss = await cssResp.text();
    let cssText = filterEssentialFontFaceBlocks(rawCss);
    const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
    const uniqueUrls = Array.from(
      new Set(Array.from(cssText.matchAll(urlRegex)).map((m) => m[1].replace(/['"]/g, '')))
    );

    await Promise.all(
      uniqueUrls.map(async (rawUrl) => {
        try {
          const fontResp = await fetchWithTimeout(rawUrl, 6000);
          if (!fontResp.ok) return;
          const blob = await fontResp.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(String(reader.result || ''));
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          if (dataUrl) {
            cssText = cssText.split(rawUrl).join(dataUrl);
          }
        } catch {
          // Ignore individual font subset fetch error
        }
      })
    );

    cachedFontEmbedCss = cssText;
    return cssText;
  } catch {
    return '';
  }
}

async function waitForContainerImages(container: HTMLElement): Promise<void> {
  const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
  if (imgs.length === 0) return;
  await Promise.race([
    Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        });
      })
    ),
    new Promise<void>((resolve) => setTimeout(resolve, 2500)),
  ]);
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function isValidJpegDataUrl(dataUrl: string | undefined): dataUrl is string {
  return Boolean(dataUrl && dataUrl.startsWith('data:image/jpeg') && dataUrl.length > 250);
}

async function capturePageJpegResilient(
  pageEl: HTMLElement,
  widthPx: number,
  heightPx: number,
  preferredPixelRatio: number,
  fontEmbedCSS: string
): Promise<string> {
  const filterNoPrint = (node: HTMLElement) => {
    if (node instanceof HTMLElement && node.classList?.contains('no-print')) {
      return false;
    }
    return true;
  };

  const baseStyle = {
    margin: '0',
    width: `${widthPx}px`,
    maxWidth: `${widthPx}px`,
    height: `${heightPx}px`,
    boxSizing: 'border-box',
  };

  const attempts: Array<{ ratio: number; css: string; quality: number }> = [
    { ratio: preferredPixelRatio, css: fontEmbedCSS, quality: 0.92 },
    { ratio: Math.min(1, preferredPixelRatio), css: fontEmbedCSS, quality: 0.88 },
    { ratio: 0.85, css: '', quality: 0.85 },
  ];

  let lastError: unknown = null;
  for (const attempt of attempts) {
    try {
      const dataUrl = await withTimeout(
        toJpeg(pageEl, {
          quality: attempt.quality,
          pixelRatio: attempt.ratio,
          width: widthPx,
          height: heightPx,
          backgroundColor: '#fffdf7',
          cacheBust: false,
          fontEmbedCSS: attempt.css,
          imagePlaceholder: TRANSPARENT_1X1_PNG,
          filter: filterNoPrint,
          style: baseStyle,
        }),
        18000,
        'toJpeg'
      );
      if (isValidJpegDataUrl(dataUrl)) {
        return dataUrl;
      }
      lastError = new Error('Generated empty JPEG data URL');
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to capture page as JPEG');
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
 * Triggers a DOM-attached anchor download cleanly so modern browsers & iframes handle it reliably.
 */
export function triggerPdfBlobDownload(blobUrl: string, fileName: string): void {
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) {
      a.parentNode.removeChild(a);
    }
  }, 500);
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
): Promise<ExportedPdfResult> {
  const prevScrollX = window.scrollX;
  const prevScrollY = window.scrollY;

  // Apply desktop 794px (210mm) single-side royal capture mode
  reportContainerEl.classList.add('pdf-dynamic-capture');

  try {
    const fontEmbedCSS = await getSafeEmbeddedFontCss();

    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => setTimeout(resolve, 2500)),
      ]);
    }
    await waitForContainerImages(reportContainerEl);

    // Wait a frame for layout reflow at 794px width
    await new Promise((r) => setTimeout(r, 150));

    const rawNodes = Array.from(
      reportContainerEl.querySelectorAll<HTMLElement>('.print-page-sheet, .page, .pdf-page')
    );
    const pageNodes = rawNodes.filter(
      (el) => !rawNodes.some((other) => other !== el && other.contains(el)) && el.offsetHeight > 0
    );

    if (pageNodes.length === 0) {
      throw new Error('No visible .print-page-sheet / .page elements found to export.');
    }

    let pdf: jsPDF | null = null;
    const totalPages = pageNodes.length;
    let addedPageCount = 0;

    for (let i = 0; i < totalPages; i++) {
      const pageEl = pageNodes[i];
      onProgress?.(i + 1, totalPages);

      const measuredWidthPx = A4_WIDTH_PX;
      const measuredHeightPx = Math.max(
        100,
        Math.ceil(pageEl.scrollHeight || pageEl.getBoundingClientRect().height)
      );
      const rawHeightMm = Number((measuredHeightPx * MM_PER_PX).toFixed(2));

      const areaLimitedRatio = Math.sqrt(
        MAX_CANVAS_PIXELS / Math.max(1, measuredWidthPx * measuredHeightPx)
      );
      const heightLimitedRatio = MAX_CANVAS_HEIGHT_PX / Math.max(1, measuredHeightPx);
      const safePixelRatio = Number(
        Math.max(0.75, Math.min(1.75, areaLimitedRatio, heightLimitedRatio)).toFixed(2)
      );

      const links = collectLinkAnnotations(pageEl);

      let dataUrl: string | null = null;
      try {
        dataUrl = await capturePageJpegResilient(
          pageEl,
          measuredWidthPx,
          measuredHeightPx,
          safePixelRatio,
          fontEmbedCSS
        );
      } catch (pageErr) {
        console.warn(`Skipping failed PDF page ${i + 1}/${totalPages}:`, pageErr);
      }

      if (dataUrl) {
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
        addedPageCount += 1;

        // Attach clickable PDF hyperlinks
        for (const lnk of links) {
          if (lnk.yMm + lnk.hMm <= finalPageHeightMm + 2) {
            pdf.link(lnk.xMm, lnk.yMm, lnk.wMm, lnk.hMm, { url: lnk.url });
          }
        }
      }

      // Yield to browser UI thread so progress updates smoothly & memory doesn't stall
      await new Promise((r) => setTimeout(r, 12));
    }

    if (!pdf || addedPageCount === 0) {
      throw new Error('Could not capture any Jathakam pages for PDF export.');
    }

    const cleanName = sanitizePdfFileName(fileName);
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    triggerPdfBlobDownload(blobUrl, cleanName);

    return {
      blob: pdfBlob,
      blobUrl,
      fileName: cleanName,
      pageCount: addedPageCount,
    };
  } finally {
    reportContainerEl.classList.remove('pdf-dynamic-capture');
    window.scrollTo(prevScrollX, prevScrollY);
  }
}
