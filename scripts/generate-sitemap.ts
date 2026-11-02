import fs from 'fs';
import path from 'path';
import {
  ALL_CITIES,
  AP_CITIES,
  TELANGANA_CITIES,
  USA_TELUGU_CITIES,
  CitySEOData,
} from '../src/data/citiesData';

const BASE_URL = 'https://www.telugujyothisham.com';

interface StaticRoute {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/panchangam', priority: 0.98, changefreq: 'daily' },
  { path: '/mee-jatakam', priority: 0.98, changefreq: 'daily' },
  { path: '/neti-panchangam', priority: 0.98, changefreq: 'daily' },
  { path: '/today-panchangam-in-telugu', priority: 0.98, changefreq: 'daily' },
  { path: '/ee-roju-panchangam', priority: 0.98, changefreq: 'daily' },
  { path: '/janma-kundali', priority: 0.98, changefreq: 'weekly' },
  { path: '/gowri-panchangam', priority: 0.95, changefreq: 'daily' },
  { path: '/tarabalam-chandrabalam', priority: 0.95, changefreq: 'daily' },
  { path: '/nitya-sankalpam', priority: 0.95, changefreq: 'daily' },
  { path: '/vivaha-pontana', priority: 0.95, changefreq: 'weekly' },
  { path: '/ugadi-rashi-phalalu', priority: 0.95, changefreq: 'weekly' },
  { path: '/shubha-muhurthalu', priority: 0.95, changefreq: 'weekly' },
  { path: '/vastu-shastra-telugu', priority: 0.95, changefreq: 'monthly' },
  { path: '/services', priority: 0.95, changefreq: 'weekly' },
  { path: '/telugu-baby-names', priority: 0.92, changefreq: 'monthly' },
  { path: '/naama-nakshatra', priority: 0.90, changefreq: 'monthly' },
  { path: '/festivals', priority: 0.90, changefreq: 'weekly' },
  { path: '/dosha-pariharalu', priority: 0.90, changefreq: 'monthly' },
  { path: '/about', priority: 0.85, changefreq: 'monthly' },
  { path: '/awards', priority: 0.85, changefreq: 'monthly' },
  { path: '/contact', priority: 0.75, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.60, changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: 0.60, changefreq: 'yearly' },
  { path: '/disclaimer', priority: 0.60, changefreq: 'yearly' },
];

const MAJOR_HUB_SLUGS = new Set([
  'hyderabad',
  'secunderabad',
  'hayathnagar',
  'kukatpally',
  'dilsukhnagar',
  'lb-nagar',
  'madhapur',
  'gachibowli',
  'miyapur',
  'uppal',
  'warangal',
  'karimnagar',
  'nizamabad',
  'khammam',
  'nalgonda',
  'suryapet',
  'siddipet',
  'mahbubnagar',
  'visakhapatnam',
  'vijayawada',
  'tirupati',
  'guntur',
  'rajahmundry',
  'kakinada',
  'nellore',
  'kurnool',
  'dallas-tx',
  'san-jose-ca',
  'irving-tx',
  'frisco-tx',
  'edison-nj',
  'atlanta-ga',
]);

function buildUrlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: number
): string {
  return [
    `  <url>`,
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(2)}</priority>`,
    `  </url>`,
  ].join('\n');
}

export function generateSitemapXML(cities: CitySEOData[] = ALL_CITIES): string {
  const today = new Date().toISOString().split('T')[0];
  const entries: string[] = [];

  // 1. Core Static Routes (24 routes)
  for (const route of STATIC_ROUTES) {
    entries.push(buildUrlEntry(`${BASE_URL}${route.path}`, today, route.changefreq, route.priority));
  }

  // 2. Programmatic City Pages Set 1: /telugu-astrologer-in-[city-slug] (258+ routes)
  for (const city of cities) {
    const isMajorHub = MAJOR_HUB_SLUGS.has(city.slug) || city.regionType === 'Telangana';
    const priority = MAJOR_HUB_SLUGS.has(city.slug) ? 0.90 : isMajorHub ? 0.85 : 0.80;
    entries.push(
      buildUrlEntry(`${BASE_URL}/telugu-astrologer-in-${city.slug}`, today, 'weekly', priority)
    );
  }

  // 3. Programmatic City Pages Set 2: /neti-panchangam-in-[city-slug] (258+ routes)
  for (const city of cities) {
    const priority = MAJOR_HUB_SLUGS.has(city.slug) ? 0.88 : 0.82;
    entries.push(
      buildUrlEntry(`${BASE_URL}/neti-panchangam-in-${city.slug}`, today, 'daily', priority)
    );
  }

  // 4. Programmatic City Pages Set 3: /vivaha-pontana-jatakam-in-[city-slug] (Top 50+ cities)
  const topCitiesForJathakam = [
    ...TELANGANA_CITIES.slice(0, 20),
    ...AP_CITIES.slice(0, 20),
    ...USA_TELUGU_CITIES.slice(0, 15),
  ];
  const seenJathakamSlugs = new Set<string>();
  for (const city of topCitiesForJathakam) {
    if (seenJathakamSlugs.has(city.slug)) continue;
    seenJathakamSlugs.add(city.slug);
    const priority = MAJOR_HUB_SLUGS.has(city.slug) ? 0.85 : 0.80;
    entries.push(
      buildUrlEntry(`${BASE_URL}/vivaha-pontana-jatakam-in-${city.slug}`, today, 'weekly', priority)
    );
  }

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...entries,
    `</urlset>`,
    ``,
  ].join('\n');
}

export function runGenerator() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapXml = generateSitemapXML(ALL_CITIES);
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');

  const urlCount = (sitemapXml.match(/<url>/g) || []).length;
  console.log(`✅ [Sitemap Generator] Successfully generated sitemap.xml at ${sitemapPath}`);
  console.log(`   Total Indexed URLs: ${urlCount} (Static: ${STATIC_ROUTES.length}, City Pages: ${urlCount - STATIC_ROUTES.length})`);
}

// If invoked directly from terminal / node
if (process.argv[1]?.includes('generate-sitemap')) {
  runGenerator();
}

