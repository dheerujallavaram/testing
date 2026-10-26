import fs from 'fs';
import path from 'path';
import { ALL_CITIES, CitySEOData } from '../src/data/citiesData';

const BASE_URL = 'https://telugujyothisham.com';

interface StaticRoute {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/panchangam', priority: 0.98, changefreq: 'daily' },
  { path: '/neti-panchangam', priority: 0.98, changefreq: 'daily' },
  { path: '/today-panchangam-in-telugu', priority: 0.98, changefreq: 'daily' },
  { path: '/ee-roju-panchangam', priority: 0.98, changefreq: 'daily' },
  { path: '/vivaha-pontana', priority: 0.90, changefreq: 'weekly' },
  { path: '/naama-nakshatra', priority: 0.90, changefreq: 'monthly' },
  { path: '/ugadi-rashi-phalalu', priority: 0.90, changefreq: 'weekly' },
  { path: '/shubha-muhurthalu', priority: 0.90, changefreq: 'weekly' },
  { path: '/festivals', priority: 0.90, changefreq: 'weekly' },
  { path: '/dosha-pariharalu', priority: 0.85, changefreq: 'monthly' },
  { path: '/services', priority: 0.85, changefreq: 'weekly' },
  { path: '/about', priority: 0.75, changefreq: 'monthly' },
  { path: '/awards', priority: 0.75, changefreq: 'monthly' },
  { path: '/contact', priority: 0.75, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.60, changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: 0.60, changefreq: 'yearly' },
  { path: '/disclaimer', priority: 0.60, changefreq: 'yearly' },
];

export function generateSitemapXML(cities: CitySEOData[] = ALL_CITIES): string {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // 1. Core Primary Routes
  for (const route of STATIC_ROUTES) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority.toFixed(2)}</priority>\n`;
    xml += `  </url>\n`;
  }

  // 2. Programmatic City Pages: /telugu-astrologer-in-[city-slug]
  for (const city of cities) {
    const isMajorHub = ['hyderabad', 'visakhapatnam', 'vijayawada', 'tirupati', 'guntur', 'warangal', 'dallas-tx', 'san-jose-ca', 'irving-tx', 'frisco-tx', 'edison-nj', 'atlanta-ga'].includes(city.slug);
    const priority = isMajorHub ? 0.85 : 0.80;
    const loc = `${BASE_URL}/telugu-astrologer-in-${city.slug}`;

    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority.toFixed(2)}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

export function runGenerator() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapXml = generateSitemapXML(ALL_CITIES);
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');

  console.log(`✅ [Sitemap Generator] Successfully generated sitemap.xml at ${sitemapPath}`);
  console.log(`   Total URLs: ${STATIC_ROUTES.length + ALL_CITIES.length} (Static: ${STATIC_ROUTES.length}, Cities: ${ALL_CITIES.length})`);
}

// If invoked directly from terminal / node
if (process.argv[1]?.includes('generate-sitemap')) {
  runGenerator();
}
