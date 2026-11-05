import fs from 'fs';
import path from 'path';
import { buildRouteHtmlFromTemplate } from '../scripts/prerender-ssg';

interface VercelRequest {
  method?: string;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
}

const FALLBACK_HTML_SHELL = `<!doctype html>
<html lang="te">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>నేటి పంచాంగం – Today Telugu Panchangam | Telugu Jyothisham</title>
    <meta name="description" id="meta-description" content="నేటి పంచాంగం (Today Telugu Panchangam)" />
    <meta name="author" content="Jallavaram Sai Dheeraj Sharma (బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ)" />
    <meta name="robots" content="index, follow" />
    <meta name="msvalidate.01" content="FFE9FA91702C937109EE200641E2921E" />
    <meta name="theme-color" content="#451a03" />
    <meta name="google-adsense-account" content="ca-pub-8193475484408755" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8193475484408755" crossorigin="anonymous"></script>
    <link rel="canonical" id="canonical-url" href="https://www.telugujyothisham.com/" />
    <link rel="alternate" hreflang="te" href="https://www.telugujyothisham.com/" />
    <link rel="alternate" hreflang="en" href="https://www.telugujyothisham.com/" />
    <link rel="alternate" hreflang="x-default" href="https://www.telugujyothisham.com/" />
    <meta property="og:type" content="website" />
    <meta property="og:url" id="og-url" content="https://www.telugujyothisham.com/" />
    <meta property="og:site_name" content="Telugu Jyothisham (తెలుగు జ్యోతిషం) — శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం" />
    <meta property="og:title" id="og-title" content="నేటి పంచాంగం – Today Telugu Panchangam | Telugu Jyothisham" />
    <meta property="og:description" id="og-description" content="నేటి పంచాంగం (Today Telugu Panchangam)" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" id="twitter-url" content="https://www.telugujyothisham.com/" />
    <meta name="twitter:title" id="twitter-title" content="నేటి పంచాంగం – Today Telugu Panchangam | Telugu Jyothisham" />
    <meta name="twitter:description" id="twitter-description" content="నేటి పంచాంగం (Today Telugu Panchangam)" />
    <script type="application/ld+json" id="core-site-schema">{}</script>
  </head>
  <body class="bg-amber-50/40 text-slate-900 antialiased">
    <div id="root"><main></main></div>
  </body>
</html>`;

function loadTemplateHtml(): string {
  const candidates = [
    path.resolve(process.cwd(), 'dist/index.html'),
    path.resolve(process.cwd(), 'index.html'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return fs.readFileSync(candidate, 'utf-8');
      }
    } catch {}
  }
  return FALLBACK_HTML_SHELL;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const queryPath = req.query?.__pathname;
    const rawQueryPath = Array.isArray(queryPath) ? queryPath[0] : queryPath;
    const forwardedUri =
      (typeof req.headers?.['x-matched-path'] === 'string' && req.headers['x-matched-path']) ||
      (typeof req.headers?.['x-vercel-forwarded-for'] === 'string' && '') ||
      '';

    let routePath = rawQueryPath || forwardedUri || req.url || '/';
    routePath = routePath.split('?')[0].trim();
    if (!routePath.startsWith('/')) {
      routePath = '/' + routePath;
    }
    if (routePath === '/api/ssr' || routePath === '/index.html' || routePath === '') {
      routePath = '/';
    } else if (routePath.length > 1) {
      routePath = routePath.replace(/\/+$/, '');
    }

    const templateHtml = loadTemplateHtml();
    let renderedHtml = templateHtml;
    try {
      renderedHtml = buildRouteHtmlFromTemplate(templateHtml, routePath);
    } catch (renderErr) {
      console.warn('[SSR renderRoute warning]:', renderErr);
      renderedHtml = templateHtml || FALLBACK_HTML_SHELL;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).send(renderedHtml);
  } catch (err: any) {
    console.error('[SSR Handler Exception]:', err);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(FALLBACK_HTML_SHELL);
  }
}
