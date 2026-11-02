import fs from 'fs';
import path from 'path';
import {
  buildCleanJsonLdSchema,
  generatePageMetadata,
  generateStaticDateParams,
  renderServerHtmlBodyForRoute,
} from '../src/seo/panchangamSsrEngine';
import {
  getCoreSitemapRoutes,
  generateRobotsTxt,
  generateSitemapXML,
} from './generate-sitemap';

function escapeAttr(val: string): string {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildRouteHtmlFromTemplate(templateHtml: string, routePath: string): string {
  const meta = generatePageMetadata(routePath);
  const jsonLd = JSON.stringify(buildCleanJsonLdSchema(meta), null, 2);
  const bodyHtml = renderServerHtmlBodyForRoute(routePath);

  let html = templateHtml;

  // Remove any legacy meta keywords or geo/ICBM tags
  html = html.replace(/<meta\s+name="(?:keywords|geo\.[^"]+|ICBM)"[^>]*>\s*/gi, '');

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(meta.title)}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" id="meta-description" content="${escapeAttr(meta.description)}" />`
  );

  // Replace meta robots
  html = html.replace(
    /<meta\s+name="robots"[^>]*>/i,
    `<meta name="robots" content="${escapeAttr(meta.robots)}" />`
  );

  // Replace canonical URL & hreflang URLs
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" id="canonical-url" href="${escapeAttr(meta.canonical)}" />`
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="te"[^>]*>/i,
    `<link rel="alternate" hreflang="te" href="${escapeAttr(meta.canonical)}" />`
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="en"[^>]*>/i,
    `<link rel="alternate" hreflang="en" href="${escapeAttr(meta.canonical)}" />`
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"[^>]*>/i,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttr(meta.canonical)}" />`
  );

  // Replace OpenGraph & Twitter tags
  html = html.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" id="og-url" content="${escapeAttr(meta.ogUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" id="og-title" content="${escapeAttr(meta.ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" id="og-description" content="${escapeAttr(meta.ogDescription)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:url"[^>]*>/i,
    `<meta name="twitter:url" id="twitter-url" content="${escapeAttr(meta.ogUrl)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" id="twitter-title" content="${escapeAttr(meta.ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" id="twitter-description" content="${escapeAttr(meta.ogDescription)}" />`
  );

  // Replace JSON-LD schema
  html = html.replace(
    /<script type="application\/ld\+json" id="core-site-schema">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="core-site-schema">\n${jsonLd}\n    </script>`
  );

  // Replace <div id="root">...</div> with server-rendered raw HTML for this route
  html = html.replace(
    /<div id="root">[\s\S]*?<\/main>\s*<\/div>/i,
    `<div id="root">${bodyHtml}\n    </div>`
  );

  return html;
}

export function getAllDatesBetween(startIso: string, endIso: string): string[] {
  const dates: string[] = [];
  const [sy, sm, sd] = startIso.split('-').map(Number);
  const [ey, em, ed] = endIso.split('-').map(Number);
  const cur = new Date(Date.UTC(sy, sm - 1, sd));
  const end = new Date(Date.UTC(ey, em - 1, ed));

  while (cur <= end) {
    const y = cur.getUTCFullYear();
    const m = String(cur.getUTCMonth() + 1).padStart(2, '0');
    const d = String(cur.getUTCDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

export function runPrerenderSsg() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('⚠️ dist/index.html not found; skipping SSG pre-render.');
    return;
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  const allRoutes = new Set<string>();

  for (const r of getCoreSitemapRoutes()) {
    allRoutes.add(r.path);
  }
  // Pre-build 60 days from current IST clock
  for (const { date } of generateStaticDateParams(60, 7)) {
    allRoutes.add(`/panchangam/${date}`);
  }
  // Also pre-build all dates from 2026-04-01 through 2027-01-31 so regardless of whether
  // the build clock is April 2026 (Vercel) or November 2026, all 2026-2027 daily pages exist statically
  for (const date of getAllDatesBetween('2026-04-01', '2027-01-31')) {
    allRoutes.add(`/panchangam/${date}`);
  }

  let count = 0;
  for (const routePath of allRoutes) {
    const renderedHtml = buildRouteHtmlFromTemplate(templateHtml, routePath);
    if (routePath === '/') {
      fs.writeFileSync(indexHtmlPath, renderedHtml, 'utf-8');
    } else {
      const cleanRel = routePath.replace(/^\/+/, '');
      const routeDir = path.join(distDir, cleanRel);
      fs.mkdirSync(routeDir, { recursive: true });
      // Write <route>/index.html for directory servers
      fs.writeFileSync(path.join(routeDir, 'index.html'), renderedHtml, 'utf-8');
      // Also write <route>.html for Vercel cleanUrls: true + trailingSlash: false
      const flatHtmlPath = path.join(distDir, `${cleanRel}.html`);
      fs.mkdirSync(path.dirname(flatHtmlPath), { recursive: true });
      fs.writeFileSync(flatHtmlPath, renderedHtml, 'utf-8');
    }
    count++;
  }

  // Generate sitemap.xml and robots.txt in both public/ and dist/
  const sitemapXml = generateSitemapXML();
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');

  console.log(`✅ [SSG Pre-Render] Pre-rendered ${count} static HTML pages (.html + /index.html) with raw Panchangam data in dist/`);
}

if (process.argv[1]?.includes('prerender-ssg')) {
  runPrerenderSsg();
}
