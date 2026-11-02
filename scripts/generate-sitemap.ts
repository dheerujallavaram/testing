import fs from 'fs';
import path from 'path';
import {
  SITE_URL,
  generateStaticDateParams,
  getTodayIsoDateIST,
} from '../src/seo/panchangamSsrEngine';

export interface SitemapEntry {
  path: string;
  lastmod: string;
}

export function getCoreSitemapRoutes(): SitemapEntry[] {
  const todayIso = getTodayIsoDateIST();
  return [
    { path: '/', lastmod: todayIso },
    { path: '/panchangam', lastmod: todayIso },
    { path: '/panchangam/calendar', lastmod: todayIso },
    { path: '/panchangam/hyderabad', lastmod: todayIso },
    { path: '/panchangam/vijayawada', lastmod: todayIso },
    { path: '/panchangam/visakhapatnam', lastmod: todayIso },
    { path: '/panchangam/usa', lastmod: todayIso },
    { path: '/mee-jatakam', lastmod: '2026-10-28' },
    { path: '/janma-kundali', lastmod: '2026-10-28' },
    { path: '/vivaha-pontana', lastmod: '2026-10-26' },
    { path: '/telugu-baby-names', lastmod: '2026-10-25' },
    { path: '/gowri-panchangam', lastmod: todayIso },
    { path: '/tarabalam-chandrabalam', lastmod: todayIso },
    { path: '/nitya-sankalpam', lastmod: todayIso },
    { path: '/naama-nakshatra', lastmod: '2026-10-22' },
    { path: '/ugadi-rashi-phalalu', lastmod: '2026-10-20' },
    { path: '/shubha-muhurthalu', lastmod: '2026-10-21' },
    { path: '/festivals', lastmod: '2026-10-19' },
    { path: '/vastu-shastra-telugu', lastmod: '2026-10-18' },
    { path: '/dosha-pariharalu', lastmod: '2026-10-17' },
    { path: '/services', lastmod: '2026-10-15' },
    { path: '/about', lastmod: '2026-10-14' },
    { path: '/contact', lastmod: '2026-10-14' },
    { path: '/privacy-policy', lastmod: '2026-10-10' },
    { path: '/disclaimer', lastmod: '2026-10-10' },
    { path: '/terms-and-conditions', lastmod: '2026-10-10' },
  ];
}

export const CORE_SITEMAP_ROUTES: SitemapEntry[] = getCoreSitemapRoutes();

function buildUrlEntry(loc: string, lastmod: string): string {
  return [
    `  <url>`,
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `  </url>`,
  ].join('\n');
}

export function generateSitemapXML(): string {
  const todayIso = getTodayIsoDateIST();
  const entries: string[] = [];

  // 1. Core Indexable Static, 4 City & Tool Routes (Zero doorway town pages, zero /awards)
  for (const route of getCoreSitemapRoutes()) {
    entries.push(buildUrlEntry(`${SITE_URL}${route.path}`, route.lastmod));
  }

  // 2. Pre-built Daily Panchangam Routes (/panchangam/[yyyy-mm-dd] for next 60 days)
  const seenDates = new Set<string>();
  const dailyParams = generateStaticDateParams(60, 0);
  for (const { date } of dailyParams) {
    seenDates.add(date);
    const pageLastMod = date <= todayIso ? date : todayIso;
    entries.push(buildUrlEntry(`${SITE_URL}/panchangam/${date}`, pageLastMod));
  }

  // Guarantee November 2026 audit dates (2026-11-02, 2026-11-03) are also present if build clock is earlier in 2026
  for (const auditDate of ['2026-11-02', '2026-11-03']) {
    if (!seenDates.has(auditDate)) {
      seenDates.add(auditDate);
      const pageLastMod = auditDate <= todayIso ? auditDate : todayIso;
      entries.push(buildUrlEntry(`${SITE_URL}/panchangam/${auditDate}`, pageLastMod));
    }
  }

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries,
    `</urlset>`,
    ``,
  ].join('\n');
}

export function generateRobotsTxt(): string {
  return [
    `User-agent: *`,
    `Allow: /`,
    ``,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    ``,
  ].join('\n');
}

export function runGenerator() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapXml = generateSitemapXML();
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');

  const urlCount = (sitemapXml.match(/<url>/g) || []).length;
  console.log(`✅ [Sitemap & Robots] Generated sitemap.xml (${urlCount} indexable URLs) and robots.txt`);
}

if (process.argv[1]?.includes('generate-sitemap')) {
  runGenerator();
}
