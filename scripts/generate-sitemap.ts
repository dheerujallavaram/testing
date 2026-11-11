import fs from 'fs';
import path from 'path';
import {
  SITE_URL,
  generateStaticDateParams,
  getTodayIsoDateIST,
} from '../src/seo/panchangamSsrEngine';
import { RASHI_LIST } from '../src/utils/gocharaEngine';

export interface SitemapEntry {
  path: string;
  lastmod: string;
}

export function getCoreSitemapRoutes(): SitemapEntry[] {
  const todayIso = getTodayIsoDateIST();
  const rashiGocharaEntries: SitemapEntry[] = RASHI_LIST.map((r) => ({
    path: `/gochara-phalalu/${r.slug}`,
    lastmod: '2026-10-30',
  }));

  return [
    { path: '/', lastmod: todayIso },
    { path: '/panchangam', lastmod: todayIso },
    { path: '/rashi-phalalu', lastmod: todayIso },
    { path: '/panchangam/calendar', lastmod: todayIso },
    { path: '/panchangam/hyderabad', lastmod: todayIso },
    { path: '/panchangam/vijayawada', lastmod: todayIso },
    { path: '/panchangam/visakhapatnam', lastmod: todayIso },
    { path: '/panchangam/usa', lastmod: todayIso },
    { path: '/janma-kundali', lastmod: '2026-10-28' },
    { path: '/mee-jatakam', lastmod: '2026-10-28' },
    { path: '/vivaha-pontana', lastmod: '2026-10-26' },
    { path: '/telugu-baby-names', lastmod: '2026-10-25' },
    { path: '/gowri-panchangam', lastmod: todayIso },
    { path: '/tarabalam-chandrabalam', lastmod: todayIso },
    { path: '/naama-nakshatra', lastmod: '2026-10-22' },
    { path: '/nitya-sankalpam', lastmod: todayIso },
    { path: '/shubha-muhurthalu', lastmod: '2026-10-21' },
    { path: '/muhurtham', lastmod: todayIso },
    { path: '/kartika-abhishekam', lastmod: todayIso },
    { path: '/sample-jathakam', lastmod: '2026-10-28' },
    { path: '/ugadi-rashi-phalalu', lastmod: '2026-10-20' },
    { path: '/vastu-shastra-telugu', lastmod: '2026-10-18' },
    { path: '/dosha-pariharalu', lastmod: '2026-10-17' },
    { path: '/gochara-phalalu', lastmod: todayIso },
    { path: '/gochara-phalalu/shani', lastmod: '2026-10-30' },
    { path: '/gochara-phalalu/guru', lastmod: '2026-10-30' },
    { path: '/gochara-phalalu/rahu-ketu', lastmod: '2026-10-30' },
    { path: '/yelinati-shani', lastmod: '2026-10-30' },
    ...rashiGocharaEntries,
    { path: '/festivals', lastmod: '2026-10-19' },
    { path: '/services', lastmod: '2026-10-15' },
    { path: '/about', lastmod: '2026-10-14' },
    { path: '/contact', lastmod: '2026-10-14' },
    { path: '/privacy-policy', lastmod: '2026-10-10' },
    { path: '/terms-and-conditions', lastmod: '2026-10-10' },
    { path: '/disclaimer', lastmod: '2026-10-10' },
    { path: '/vedic-articles', lastmod: todayIso },
    { path: '/dwadasa-rashi-rahasyalu', lastmod: todayIso },
    { path: '/swarodaya-shastra', lastmod: todayIso },
    { path: '/balarishta-dosha-shanti', lastmod: todayIso },
    { path: '/prashna-nimitta-shastra', lastmod: todayIso },
    { path: '/graha-vakra-gati', lastmod: todayIso },
    { path: '/surya-siddhanta-kala-ganana', lastmod: todayIso },
    { path: '/classical-astrology-faq', lastmod: todayIso },
    { path: '/jyotisha-paribhasha-rahasyalu', lastmod: todayIso },
    { path: '/hasta-samudrika-rekhala-vignanam', lastmod: todayIso },
    { path: '/why-are-geminis-so-powerful', lastmod: todayIso },
    { path: '/who-is-libras-true-love', lastmod: todayIso },
    { path: '/pawan-kalyan-raja-yoga-horoscope-analysis', lastmod: todayIso },
    { path: '/cricket-sports-astrology-ind-u19-vs-uae-u19-prashna-guide', lastmod: todayIso },
    { path: '/swapna-shastra-dream-meaning-medical-astrology-1944', lastmod: todayIso },
    { path: '/fmge-medical-astrology-doctor-yoga-exam-success-guide', lastmod: todayIso },
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

  // 1. Core Indexable Static, 4 City, Tool & Gochara Routes (Zero doorway town pages, zero /awards)
  for (const route of getCoreSitemapRoutes()) {
    entries.push(buildUrlEntry(`${SITE_URL}${route.path}`, route.lastmod));
  }

  // 2. Pre-built Daily Panchangam Routes (/panchangam/[yyyy-mm-dd] for next 60 days + past 7 days)
  const seenDates = new Set<string>();
  const dailyParams = generateStaticDateParams(60, 7);
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
