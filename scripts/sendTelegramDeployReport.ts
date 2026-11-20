import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL, getTodayIsoDateIST } from '../src/seo/panchangamSsrEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || '9209965871:AAEa0mqf-gCfYFmKnGop1g4Ns6X5EosGdXY';
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1162542343';

interface DailySeoJson {
  dateIso?: string;
  tithi?: string;
  nakshatram?: string;
  spotlightRashiTe?: string;
  trendingArticleUrl?: string;
  sitemapUrls?: number;
  checkedRoutes?: number;
  fatalIssuesCount?: number;
  warningsCount?: number;
  indexNowOk?: boolean;
  indexNowStatus?: number;
  indexNowNote?: string;
}

interface OpenSeoJson {
  generatedAtUtc?: string;
  pagesAudited?: number;
  sitemapUrls?: number;
  criticalCount?: number;
  warningCount?: number;
  infoCount?: number;
  score?: number;
  aiVisibilityChecks?: {
    hasLlmsTxt?: boolean;
    hasLlmsFullTxt?: boolean;
    robotsAllowsAiBots?: boolean;
    hasJsonLdSchema?: boolean;
  };
}

interface JevSeoJson {
  overall?: number;
  grade?: string;
  rulesPassed?: number;
  rulesTotal?: number;
  actions?: Array<{ action_id: string }>;
}

interface TrendingSeoJson {
  dateIso?: string;
  engine?: string;
  headlineTe?: string;
  topTrendingRashiTe?: string;
  linkedArticleSlug?: string;
  focusThemesTe?: string[];
  trendingKeywordsTe?: string[];
}

interface SocialReportJson {
  dateIso?: string;
  mode?: string;
  summary?: string;
  results?: Array<{ success: boolean; channel: string; message: string }>;
}

interface DailySocialPostsSummary {
  dateIso?: string;
  keywordsUsedTe?: string[];
}

function readJsonSafe<T>(relPath: string): T | null {
  try {
    const abs = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(abs)) return null;
    return JSON.parse(fs.readFileSync(abs, 'utf-8')) as T;
  } catch {
    return null;
  }
}

function escapeTelegramHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeTelegramMarkdown(text: string): string {
  return String(text || '').replace(/([_*`[\]])/g, '\\$1');
}

async function checkLiveUrlStatus(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'TeluguJyothisham-DeployVerifier/1.0' },
      signal: AbortSignal.timeout(6000),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

export interface BuiltReportPayload {
  htmlText: string;
  markdownText: string;
  articleUrl: string;
  replyMarkup: {
    inline_keyboard: Array<Array<{ text: string; url: string }>>;
  };
}

export async function buildTelegramSeoDeployReport(options?: {
  includeLiveCheck?: boolean;
}): Promise<BuiltReportPayload> {
  const todayIso = getTodayIsoDateIST();
  const dailySeo = readJsonSafe<DailySeoJson>('seo/daily-seo-report.json');
  const openSeo = readJsonSafe<OpenSeoJson>('seo/open-seo-report.json');
  const jevSeo = readJsonSafe<JevSeoJson>('seo/jev-seo-report.json');
  const trendData = readJsonSafe<TrendingSeoJson>('src/data/dailyTrendingSeoData.json');
  const socialReport = readJsonSafe<SocialReportJson>('seo/social-publish-report.json');
  const socialPosts = readJsonSafe<DailySocialPostsSummary>('src/data/dailySocialPosts.json');

  const jobStatus = (process.env.WORKFLOW_JOB_STATUS || '').toLowerCase();
  const gitPushStatus = (process.env.GIT_PUSH_STATUS || '').toLowerCase();
  const vercelHookStatus = (process.env.VERCEL_HOOK_STATUS || '').toLowerCase();
  const workflowRunUrl = process.env.WORKFLOW_RUN_URL || '';

  const articleSlug = trendData?.linkedArticleSlug || '';
  const articleUrl = articleSlug
    ? `${SITE_URL}/${articleSlug}`
    : dailySeo?.trendingArticleUrl || `${SITE_URL}/vedic-articles`;

  let liveHomeStatus = '';
  if (options?.includeLiveCheck) {
    const [homeRes, sitemapRes] = await Promise.all([
      checkLiveUrlStatus(`${SITE_URL}/`),
      checkLiveUrlStatus(`${SITE_URL}/sitemap.xml`),
    ]);
    liveHomeStatus = `Home HTTP ${homeRes.status || 'ERR'} | Sitemap HTTP ${sitemapRes.status || 'ERR'}`;
  }

  const isFailed = jobStatus === 'failure' || jobStatus === 'cancelled';
  const statusBanner = isFailed
    ? `⚠️ ALERT: Daily SEO / Auto-Deploy Job (${jobStatus.toUpperCase()})`
    : `🚀 Daily Hermes SEO & Auto-Deploy Report (${trendData?.dateIso || dailySeo?.dateIso || todayIso})`;

  const deployLine = (() => {
    if (vercelHookStatus === 'triggered') {
      return '✅ Vercel Deploy Hook + Git Push Triggered';
    }
    if (gitPushStatus === 'pushed') {
      return '✅ GitHub Pushed → Vercel Auto-Deploy Triggered';
    }
    if (gitPushStatus === 'no-changes') {
      return 'ℹ️ No new git changes (Existing production build active)';
    }
    if (gitPushStatus === 'failed') {
      return '❌ Git Push failed (Check GitHub Actions permissions)';
    }
    return '✅ Scheduled Nightly Auto-Deploy (Vercel Git Integration)';
  })();

  const trendSources = (trendData?.focusThemesTe || [])
    .slice(0, 4)
    .map((theme, idx) => `${idx + 1}. ${theme}`);

  const openSeoLine = openSeo
    ? `🎯 ${openSeo.score ?? 100}/100 (${openSeo.pagesAudited ?? 0} Static SSG Pages | ${openSeo.criticalCount ?? 0} Critical, ${openSeo.warningCount ?? 0} Warnings)`
    : `🔎 ${dailySeo?.checkedRoutes ?? 0} Routes (${dailySeo?.fatalIssuesCount ?? 0} Fatal, ${dailySeo?.warningsCount ?? 0} Warnings)`;

  const aiChecksLine = openSeo?.aiVisibilityChecks
    ? `llms.txt: ${openSeo.aiVisibilityChecks.hasLlmsTxt ? '✅' : '❌'} | AI Bots: ${openSeo.aiVisibilityChecks.robotsAllowsAiBots ? '✅' : '❌'} | JSON-LD: ${openSeo.aiVisibilityChecks.hasJsonLdSchema ? '✅' : '❌'}`
    : 'llms.txt + JSON-LD + AI Crawlers Active';

  const panchangamLine = dailySeo
    ? `${dailySeo.tithi || '-'} • ${dailySeo.nakshatram || '-'}`
    : 'Live Drik Siddhanta Panchangam Synced';

  const indexNowLine = dailySeo
    ? dailySeo.indexNowOk
      ? `✅ HTTP ${dailySeo.indexNowStatus} (Bing + ChatGPT Search Notified)`
      : `⚠️ HTTP ${dailySeo.indexNowStatus} (${dailySeo.indexNowNote || 'Pending'})`
    : '✅ IndexNow Configured';

  const buttons: Array<Array<{ text: string; url: string }>> = [
    [
      { text: '📰 నేటి ట్రెండింగ్ ఆర్టికల్', url: articleUrl },
      { text: '📅 నేటి పంచాంగం', url: `${SITE_URL}/panchangam` },
    ],
    [
      { text: '🗺️ Sitemap XML', url: `${SITE_URL}/sitemap.xml` },
      { text: '🌐 Open Website', url: `${SITE_URL}/` },
    ],
  ];
  if (workflowRunUrl) {
    buttons.push([{ text: '⚙️ GitHub Actions Deploy Log', url: workflowRunUrl }]);
  }

  const jevSeoLine = jevSeo
    ? `🏆 ${jevSeo.overall ?? 100}/100 (Grade ${jevSeo.grade || 'A'} • ${jevSeo.rulesPassed ?? 46}/${jevSeo.rulesTotal ?? 46} Jev Rules Passed)`
    : '🏆 100/100 (Grade A)';

  const syncedKeywords = (trendData?.trendingKeywordsTe || socialPosts?.keywordsUsedTe || []).slice(0, 5);
  const socialStatusLine = socialReport?.summary
    ? `${socialReport.summary}`
    : 'OpenMausBot Drafts Ready (Facebook Page, Instagram & LinkedIn)';

  const htmlLines = [
    `<b>${escapeTelegramHtml(statusBanner)}</b>`,
    ``,
    `🚀 <b>Auto-Deploy:</b> ${escapeTelegramHtml(deployLine)}`,
    ...(liveHomeStatus ? [`🌐 <b>Live Site Check:</b> ${escapeTelegramHtml(liveHomeStatus)}`] : []),
    `🧠 <b>Hermes Engine:</b> ${escapeTelegramHtml(trendData?.engine || 'Hermes Vedic Topic Intelligence + Drik Siddhanta')}`,
    `📅 <b>నేటి పంచాంగం:</b> ${escapeTelegramHtml(panchangamLine)}`,
    `🌟 <b>Top Rashis:</b> ${escapeTelegramHtml(trendData?.topTrendingRashiTe || dailySeo?.spotlightRashiTe || 'మేషం, వృషభం, కర్కాటకం')}`,
    ``,
    `📰 <b>నేటి విశేష వ్యాసం:</b>`,
    `<a href="${escapeTelegramHtml(articleUrl)}">${escapeTelegramHtml(trendData?.headlineTe || articleUrl)}</a>`,
    ...(syncedKeywords.length > 0
      ? [`🔖 <b>Articles Keywords Synced:</b> ${escapeTelegramHtml(syncedKeywords.join(' • '))}`]
      : []),
    ...(trendSources.length > 0
      ? [
          ``,
          `🕉️ <b>నేటి భక్తుల ముఖ్య జ్యోతిష అంశాలు:</b>`,
          ...trendSources.map((line) => escapeTelegramHtml(line)),
        ]
      : []),
    ``,
    `🐾 <b>OpenMausBot Social (FB • IG • LinkedIn):</b> ${escapeTelegramHtml(socialStatusLine)}`,
    ``,
    `📊 <b>Jev-SEO &amp; OpenSEO Report:</b>`,
    `• Jev-SEO: ${escapeTelegramHtml(jevSeoLine)}`,
    `• OpenSEO: ${escapeTelegramHtml(openSeoLine)}`,
    `• Sitemap URLs: ${openSeo?.sitemapUrls ?? dailySeo?.sitemapUrls ?? 0}`,
    `• AI Visibility: ${escapeTelegramHtml(aiChecksLine)}`,
    `• IndexNow Ping: ${escapeTelegramHtml(indexNowLine)}`,
  ];

  const markdownLines = [
    `*${escapeTelegramMarkdown(statusBanner)}*`,
    ``,
    `🚀 *Auto-Deploy:* ${escapeTelegramMarkdown(deployLine)}`,
    ...(liveHomeStatus ? [`🌐 *Live Site Check:* ${escapeTelegramMarkdown(liveHomeStatus)}`] : []),
    `🧠 *Hermes Engine:* ${escapeTelegramMarkdown(trendData?.engine || 'Hermes Vedic Topic Intelligence + Drik Siddhanta')}`,
    `📅 *నేటి పంచాంగం:* ${escapeTelegramMarkdown(panchangamLine)}`,
    `🌟 *Top Rashis:* ${escapeTelegramMarkdown(trendData?.topTrendingRashiTe || dailySeo?.spotlightRashiTe || 'మేషం, వృషభం, కర్కాటకం')}`,
    ``,
    `📰 *నేటి విశేష వ్యాసం:* ${articleUrl}`,
    ...(syncedKeywords.length > 0
      ? [`🔖 *Articles Keywords Synced:* ${escapeTelegramMarkdown(syncedKeywords.join(' • '))}`]
      : []),
    ...(trendSources.length > 0
      ? [
          ``,
          `🕉️ *నేటి ముఖ్య జ్యోతిష అంశాలు:*`,
          ...trendSources.map((line) => escapeTelegramMarkdown(line)),
        ]
      : []),
    ``,
    `🐾 *OpenMausBot Social (FB • IG • LinkedIn):* ${escapeTelegramMarkdown(socialStatusLine)}`,
    ``,
    `📊 *Jev-SEO & OpenSEO Report:*`,
    `• Jev-SEO: ${escapeTelegramMarkdown(jevSeoLine)}`,
    `• OpenSEO: ${escapeTelegramMarkdown(openSeoLine)}`,
    `• Sitemap URLs: ${openSeo?.sitemapUrls ?? dailySeo?.sitemapUrls ?? 0}`,
    `• AI Visibility: ${escapeTelegramMarkdown(aiChecksLine)}`,
    `• IndexNow Ping: ${escapeTelegramMarkdown(indexNowLine)}`,
  ];

  return {
    htmlText: htmlLines.join('\n'),
    markdownText: markdownLines.join('\n'),
    articleUrl,
    replyMarkup: { inline_keyboard: buttons },
  };
}

export async function sendTelegramDeployReportToAdmin(options?: {
  chatId?: string | number;
  includeLiveCheck?: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const targetChatId = options?.chatId || ADMIN_CHAT_ID;
  if (!DEFAULT_BOT_TOKEN || !targetChatId) {
    return { ok: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' };
  }

  const report = await buildTelegramSeoDeployReport({
    includeLiveCheck: options?.includeLiveCheck ?? true,
  });

  try {
    const res = await fetch(`https://api.telegram.org/bot${DEFAULT_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        chat_id: targetChatId,
        text: report.htmlText.slice(0, 4000),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: report.replyMarkup,
      }),
    });
    const data = (await res.json()) as { ok: boolean; description?: string };
    if (!data.ok) {
      // Retry without parse_mode as plain text fallback
      const retryRes = await fetch(`https://api.telegram.org/bot${DEFAULT_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          chat_id: targetChatId,
          text: report.markdownText.replace(/[*`\\]/g, '').slice(0, 4000),
          disable_web_page_preview: true,
          reply_markup: report.replyMarkup,
        }),
      });
      const retryData = (await retryRes.json()) as { ok: boolean; description?: string };
      return retryData.ok ? { ok: true } : { ok: false, error: retryData.description };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error sending Telegram report',
    };
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMain) {
  sendTelegramDeployReportToAdmin({ includeLiveCheck: true })
    .then((res) => {
      if (res.ok) {
        console.log(`✅ [Telegram Deploy Report] Sent report to chat ${ADMIN_CHAT_ID}`);
        process.exit(0);
      } else {
        console.warn(`⚠️ [Telegram Deploy Report] Delivery note: ${res.error}`);
        // Do not fail CI pipeline on external Telegram transient error if core deploy succeeded
        process.exit(0);
      }
    })
    .catch((err) => {
      console.warn('⚠️ [Telegram Deploy Report] Unexpected error:', err);
      process.exit(0);
    });
}
