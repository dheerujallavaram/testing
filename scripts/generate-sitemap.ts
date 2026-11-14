import fs from 'fs';
import path from 'path';
import {
  SITE_URL,
  SUPPORTED_CITY_SLUGS,
  generateStaticDateParams,
  getTodayIsoDateIST,
} from '../src/seo/panchangamSsrEngine';
import { RASHI_LIST } from '../src/utils/gocharaEngine';
import { VEDIC_CLASSICAL_ARTICLES } from '../src/data/vedicArticlesData';
import { NAKSHATRA_SEO_PROFILES } from '../src/data/nakshatraSeoProfiles';

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
  const rashiPhalaluEntries: SitemapEntry[] = RASHI_LIST.map((r) => ({
    path: `/rashi-phalalu/${r.slug}`,
    lastmod: todayIso,
  }));
  const cityPanchangamEntries: SitemapEntry[] = SUPPORTED_CITY_SLUGS.map((slug) => ({
    path: `/panchangam/${slug}`,
    lastmod: todayIso,
  }));
  const nakshatraEntries: SitemapEntry[] = NAKSHATRA_SEO_PROFILES.map((n) => ({
    path: `/nakshatra/${n.slug}`,
    lastmod: todayIso,
  }));
  const articleEntries: SitemapEntry[] = VEDIC_CLASSICAL_ARTICLES.map((art) => ({
    path: `/${art.slug}`,
    lastmod: art.dateModified || todayIso,
  }));

  return [
    { path: '/', lastmod: todayIso },
    { path: '/panchangam', lastmod: todayIso },
    { path: '/rashi-phalalu', lastmod: todayIso },
    ...rashiPhalaluEntries,
    { path: '/festivals-calendar', lastmod: todayIso },
    { path: '/prashna-kundali', lastmod: todayIso },
    { path: '/ratna-rudraksha', lastmod: todayIso },
    { path: '/panchangam/calendar', lastmod: todayIso },
    ...cityPanchangamEntries,
    ...nakshatraEntries,
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
    { path: '/vivaha-muhurtham', lastmod: todayIso },
    { path: '/gruha-pravesha-muhurtham', lastmod: todayIso },
    { path: '/muhurtham/november-2026', lastmod: todayIso },
    { path: '/muhurtham/december-2026', lastmod: todayIso },
    { path: '/muhurtham/january-2027', lastmod: todayIso },
    { path: '/kartika-abhishekam', lastmod: todayIso },
    { path: '/sample-jathakam', lastmod: '2026-10-28' },
    { path: '/ugadi-rashi-phalalu', lastmod: '2026-10-20' },
    { path: '/vastu-shastra-telugu', lastmod: '2026-10-18' },
    { path: '/dosha-pariharalu', lastmod: '2026-10-17' },
    { path: '/kuja-dosha', lastmod: todayIso },
    { path: '/kaal-sarp-dosha', lastmod: todayIso },
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
    ...articleEntries,
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

  for (const route of getCoreSitemapRoutes()) {
    entries.push(buildUrlEntry(`${SITE_URL}${route.path}`, route.lastmod));
  }

  const seenDates = new Set<string>();
  const dailyParams = generateStaticDateParams(60, 7);
  for (const { date } of dailyParams) {
    seenDates.add(date);
    const pageLastMod = date <= todayIso ? date : todayIso;
    entries.push(buildUrlEntry(`${SITE_URL}/panchangam/${date}`, pageLastMod));
  }

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
    `Disallow: /api/`,
    ``,
    `User-agent: Googlebot`,
    `Allow: /`,
    ``,
    `User-agent: Bingbot`,
    `Allow: /`,
    ``,
    `User-agent: GPTBot`,
    `Allow: /`,
    ``,
    `User-agent: OAI-SearchBot`,
    `Allow: /`,
    ``,
    `User-agent: ChatGPT-User`,
    `Allow: /`,
    ``,
    `User-agent: PerplexityBot`,
    `Allow: /`,
    ``,
    `User-agent: ClaudeBot`,
    `Allow: /`,
    ``,
    `User-agent: Anthropic-AI`,
    `Allow: /`,
    ``,
    `User-agent: Google-Extended`,
    `Allow: /`,
    ``,
    `User-agent: Applebot`,
    `Allow: /`,
    ``,
    `User-agent: Mediapartners-Google`,
    `Allow: /`,
    ``,
    `User-agent: Google-AdSense`,
    `Allow: /`,
    ``,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `# LLMs & AI Search Index: ${SITE_URL}/llms.txt`,
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
