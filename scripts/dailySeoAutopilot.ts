import fs from 'fs';
import path from 'path';
import { WEEK_DATA } from '../src/data/panchangamData';
import { getOrGenerateDayData } from '../src/utils/astronomyPanchangam';
import { getDailyRashiFortunes } from '../src/utils/panchangaLogic';
import {
  SITE_URL,
  generatePageMetadata,
  getTodayIsoDateIST,
} from '../src/seo/panchangamSsrEngine';
import {
  generateRobotsTxt,
  generateSitemapXML,
  getCoreSitemapRoutes,
} from './generate-sitemap';

const INDEXNOW_KEY = '9f4e7c2b1a8d4f3e8c6b2d1a0e9f8c7b';
const DEFAULT_TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || '9209965871:AAEa0mqf-gCfYFmKnGop1g4Ns6X5EosGdXY';
const DEFAULT_TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1162542343';

function escapeHtml(val: string): string {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(val: string): string {
  return escapeHtml(val).replace(/"/g, '&quot;');
}

function clampDesc(val: string, maxLen = 156): string {
  const clean = val.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trimEnd() + '…';
}

/**
 * Refreshes root index.html static fallback Panchangam & meta description
 * with today's live Drik Siddhanta Panchangam so crawlers (Googlebot, GPTBot, PerplexityBot)
 * see fresh daily Panchangam right at https://www.telugujyothisham.com/.
 */
function syncIndexHtmlWithTodayPanchangam(todayIso: string): {
  tithi: string;
  nakshatram: string;
  spotlightRashiSlug: string;
  spotlightRashiTe: string;
} {
  const day = getOrGenerateDayData(todayIso, WEEK_DATA);
  const fortunes = getDailyRashiFortunes(day);
  const seed = todayIso.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const spot = fortunes[seed % fortunes.length] || fortunes[0];

  const cleanTithi = day.panchanga.tithi.split('(')[0].split('-')[0].trim();
  const cleanNak = day.panchanga.nakshatram.split('(')[0].split('-')[0].trim();

  const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf-8');

    const freshDesc = clampDesc(
      `నేటి తెలుగు పంచాంగం (${day.teediVaram}): తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, ${spot.teluguName} రాశి ఫలాలు & ఉచిత జాతకం PDF (Hyderabad Astrologer).`
    );

    html = html.replace(
      /<meta\s+name="description"\s+id="meta-description"\s+content="[^"]*"\s*\/>/i,
      `<meta\n      name="description"\n      id="meta-description"\n      content="${escapeAttr(freshDesc)}"\n    />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+id="og-description"\s+content="[^"]*"\s*\/>/i,
      `<meta\n      property="og:description"\n      id="og-description"\n      content="${escapeAttr(freshDesc)}"\n    />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+id="twitter-description"\s+content="[^"]*"\s*\/>/i,
      `<meta\n      name="twitter:description"\n      id="twitter-description"\n      content="${escapeAttr(freshDesc)}"\n    />`
    );

    // Refresh static table rows inside index.html fallback with today's live calculations
    const freshTableBody = `<tbody>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border: 1px solid #fde68a; background: #fffbeb; width: 36%;">సంవత్సరం &amp; మాసం</th>
                <td style="padding: 10px 12px; border: 1px solid #fde68a; font-weight: 600;">${escapeHtml(day.panchanga.samvatsaram)} • ${escapeHtml(day.panchanga.masam)} (${escapeHtml(day.teediVaram)})</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border: 1px solid #fde68a; background: #fffbeb;">తిథి (Tithi)</th>
                <td style="padding: 10px 12px; border: 1px solid #fde68a; font-weight: 700; color: #9a3412;">${escapeHtml(day.panchanga.tithi)}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border: 1px solid #fde68a; background: #fffbeb;">నక్షత్రం (Nakshatram)</th>
                <td style="padding: 10px 12px; border: 1px solid #fde68a; font-weight: 700; color: #9a3412;">${escapeHtml(day.panchanga.nakshatram)}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border: 1px solid #fde68a; background: #fef2f2; color: #991b1b;">రాహుకాలం (Rahukalam)</th>
                <td style="padding: 10px 12px; border: 1px solid #fde68a; font-weight: 700; color: #991b1b;">${escapeHtml(day.ashubha.rahukalam)}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border: 1px solid #fde68a; background: #fef2f2; color: #991b1b;">వర్జ్యం (Varjyam)</th>
                <td style="padding: 10px 12px; border: 1px solid #fde68a; font-weight: 700; color: #991b1b;">${escapeHtml(day.ashubha.varjyam)}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border: 1px solid #fde68a; background: #ecfdf5; color: #065f46;">అభిజిత్ ముహూర్తం (Abhijit Muhurtham)</th>
                <td style="padding: 10px 12px; border: 1px solid #fde68a; font-weight: 700; color: #065f46;">${escapeHtml(day.shubha.abhijit)}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border: 1px solid #fde68a; background: #ecfdf5; color: #065f46;">అమృత ఘడియలు (Amrutha Gadiyalu)</th>
                <td style="padding: 10px 12px; border: 1px solid #fde68a; font-weight: 700; color: #065f46;">${escapeHtml(day.shubha.amrutha)}</td>
              </tr>
            </tbody>`;

    html = html.replace(
      /<section aria-label="Today Telugu Panchangam Details"[\s\S]*?<tbody>[\s\S]*?<\/tbody>/i,
      (match) => match.replace(/<tbody>[\s\S]*?<\/tbody>/i, freshTableBody)
    );

    fs.writeFileSync(indexHtmlPath, html, 'utf-8');
  }

  return {
    tithi: cleanTithi,
    nakshatram: cleanNak,
    spotlightRashiSlug: spot.id,
    spotlightRashiTe: spot.teluguName,
  };
}

interface SeoAuditIssue {
  route: string;
  tier: 'FATAL' | 'WARN';
  message: string;
}

/**
 * Runs an automated Illyism/seo-skills audit over every core indexable route.
 */
function runIllyismSeoAudit(todayIso: string): {
  checkedRoutes: number;
  fatalIssues: SeoAuditIssue[];
  warnings: SeoAuditIssue[];
} {
  const routes = [
    ...getCoreSitemapRoutes().map((r) => r.path),
    `/panchangam/${todayIso}`,
  ];
  const uniqueRoutes = Array.from(new Set(routes));
  const fatalIssues: SeoAuditIssue[] = [];
  const warnings: SeoAuditIssue[] = [];
  const seenTitles = new Map<string, string>();

  for (const route of uniqueRoutes) {
    const meta = generatePageMetadata(route);

    if (!meta.title || meta.title.length < 15) {
      fatalIssues.push({ route, tier: 'FATAL', message: 'Missing or too short <title>' });
    } else if (meta.title.length > 68) {
      warnings.push({
        route,
        tier: 'WARN',
        message: `Title length (${meta.title.length} chars) may truncate on SERPs`,
      });
    }

    if (seenTitles.has(meta.title)) {
      warnings.push({
        route,
        tier: 'WARN',
        message: `Duplicate title shared with ${seenTitles.get(meta.title)}`,
      });
    } else {
      seenTitles.set(meta.title, route);
    }

    if (!meta.description || meta.description.length < 60) {
      fatalIssues.push({ route, tier: 'FATAL', message: 'Missing or too short meta description' });
    } else if (meta.description.length > 165) {
      warnings.push({
        route,
        tier: 'WARN',
        message: `Meta description (${meta.description.length} chars) exceeds 160 chars`,
      });
    }

    if (!meta.canonical || !meta.canonical.startsWith(SITE_URL)) {
      fatalIssues.push({ route, tier: 'FATAL', message: 'Invalid or missing canonical URL' });
    }
    if (!meta.h1 || meta.h1.length < 10) {
      fatalIssues.push({ route, tier: 'FATAL', message: 'Missing or weak H1 heading' });
    }
  }

  return {
    checkedRoutes: uniqueRoutes.length,
    fatalIssues,
    warnings,
  };
}

async function submitUrlsToIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status: number;
  note: string;
}> {
  try {
    const host = new URL(SITE_URL).host;
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    return {
      ok: res.ok || res.status === 200 || res.status === 202,
      status: res.status,
      note: res.statusText || 'Submitted',
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      note: err instanceof Error ? err.message : 'Network error',
    };
  }
}

async function notifyTelegramSeoStatus(summaryText: string): Promise<void> {
  if (!DEFAULT_TELEGRAM_BOT_TOKEN || !DEFAULT_TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${DEFAULT_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        chat_id: DEFAULT_TELEGRAM_CHAT_ID,
        text: summaryText,
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // Ignore network failures in restricted environments
  }
}

async function main() {
  const todayIso = getTodayIsoDateIST();
  console.log(`🚀 [Daily SEO Autopilot] Starting automated SEO run for ${todayIso} (IST)...`);

  // 1. Regenerate public/sitemap.xml & AI-friendly public/robots.txt + IndexNow key file
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const sitemapXml = generateSitemapXML();
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(publicDir, `${INDEXNOW_KEY}.txt`), `${INDEXNOW_KEY}\n`, 'utf-8');

  const totalSitemapUrls = (sitemapXml.match(/<url>/g) || []).length;

  // 2. Refresh index.html with today's live Panchangam & meta description
  const todayInfo = syncIndexHtmlWithTodayPanchangam(todayIso);

  // 3. Run Illyism/seo-skills route & metadata audit
  const audit = runIllyismSeoAudit(todayIso);

  // 4. Push today's updated & money URLs via IndexNow (Bing, ChatGPT Search, DuckDuckGo, Yandex)
  const dailyPushUrls = [
    `${SITE_URL}/`,
    `${SITE_URL}/panchangam`,
    `${SITE_URL}/panchangam/${todayIso}`,
    `${SITE_URL}/panchangam/hyderabad`,
    `${SITE_URL}/rashi-phalalu`,
    `${SITE_URL}/rashi-phalalu/${todayInfo.spotlightRashiSlug}`,
    `${SITE_URL}/janma-kundali`,
    `${SITE_URL}/vivaha-pontana`,
    `${SITE_URL}/muhurtham`,
    `${SITE_URL}/services`,
    `${SITE_URL}/llms.txt`,
  ];

  const indexNowRes = await submitUrlsToIndexNow(dailyPushUrls);

  // 5. Write seo/daily-seo-report.md
  const seoDir = path.resolve(process.cwd(), 'seo');
  if (!fs.existsSync(seoDir)) fs.mkdirSync(seoDir, { recursive: true });

  const reportLines = [
    `# Daily Automated SEO Report — ${todayIso} (IST)`,
    ``,
    `- **Site:** ${SITE_URL}`,
    `- **Today's Panchangam Sync:** Tithi: ${todayInfo.tithi} | Nakshatram: ${todayInfo.nakshatram}`,
    `- **Today's Spotlight Rashi:** ${todayInfo.spotlightRashiTe} (\`/rashi-phalalu/${todayInfo.spotlightRashiSlug}\`)`,
    `- **Sitemap Indexable URLs:** ${totalSitemapUrls}`,
    `- **Routes Audited (\`Illyism/seo-skills\` gates):** ${audit.checkedRoutes}`,
    `- **FATAL Issues:** ${audit.fatalIssues.length}`,
    `- **Warnings:** ${audit.warnings.length}`,
    `- **IndexNow Instant Ping (Bing / ChatGPT Search / Yandex):** ${
      indexNowRes.ok ? `✅ HTTP ${indexNowRes.status}` : `⚠️ HTTP ${indexNowRes.status} (${indexNowRes.note})`
    }`,
    `- **Submitted Daily Priority URLs (${dailyPushUrls.length}):**`,
    ...dailyPushUrls.map((u) => `  - ${u}`),
    ``,
    `## Audited Issues Summary`,
    ...(audit.fatalIssues.length === 0 && audit.warnings.length === 0
      ? [`✅ Zero FATAL errors and zero metadata truncation warnings across all ${audit.checkedRoutes} routes.`]
      : [
          ...audit.fatalIssues.map((i) => `- ❌ **[${i.tier}]** \`${i.route}\`: ${i.message}`),
          ...audit.warnings.slice(0, 20).map((w) => `- ⚠️ **[${w.tier}]** \`${w.route}\`: ${w.message}`),
        ]),
    ``,
  ];

  fs.writeFileSync(path.join(seoDir, 'daily-seo-report.md'), reportLines.join('\n'), 'utf-8');

  console.log(`✅ [Daily SEO Autopilot] Audited ${audit.checkedRoutes} routes | Sitemap URLs: ${totalSitemapUrls} | Fatal: ${audit.fatalIssues.length} | Warnings: ${audit.warnings.length}`);
  console.log(`📡 [IndexNow] Status: ${indexNowRes.status} (${indexNowRes.note})`);

  if (process.env.NOTIFY_TELEGRAM_SEO === '1') {
    await notifyTelegramSeoStatus(
      [
        `🚀 Daily Automatic SEO Report (${todayIso})`,
        `✅ Sitemap & Robots.txt updated (${totalSitemapUrls} URLs)`,
        `📅 Homepage Sync: ${todayInfo.tithi}, ${todayInfo.nakshatram}`,
        `🌟 Spotlight Rashi: ${todayInfo.spotlightRashiTe}`,
        `🔎 SEO Audit (${audit.checkedRoutes} pages): ${audit.fatalIssues.length} Fatal, ${audit.warnings.length} Warnings`,
        `📡 IndexNow (Bing + ChatGPT Search): ${indexNowRes.ok ? 'Success' : indexNowRes.note}`,
      ].join('\n')
    );
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ [Daily SEO Autopilot] Failed:', err);
  process.exit(1);
});
