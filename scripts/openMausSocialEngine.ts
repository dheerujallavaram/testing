/**
 * OpenMausBot-Powered Multi-Platform Social Engine
 * Target Channels: Facebook Page • Instagram • LinkedIn (Direct API + Postiz Bridge + Webhook)
 * Website: https://www.telugujyothisham.com
 *
 * Usage:
 *   npx tsx scripts/openMausSocialEngine.ts             # Generate daily card, platform captions & OpenMausBot HTML preview
 *   npx tsx scripts/openMausSocialEngine.ts --publish   # Also auto-publish to configured Facebook Page, Instagram, LinkedIn / Postiz
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTodayISTData } from './telegramBot';
import { renderMorningPanchangamCardBuffer } from './sendMorningGoodMorningCard';
import {
  publishToFacebookPage,
  publishToInstagram,
  publishToLinkedIn,
  publishViaPostiz,
  SocialPublishResult,
} from './socialPublisher';
import { translatePanchangamString } from '../src/context/LanguageContext';
import { SITE_URL } from '../src/seo/panchangamSsrEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DailyTrendingSeoPayload {
  dateIso?: string;
  headlineTe?: string;
  headlineEn?: string;
  trendingKeywordsTe?: string[];
  trendingKeywordsEn?: string[];
  socialHashtags?: string[];
  linkedArticleSlug?: string;
  topTrendingRashiTe?: string;
}

export interface DailySocialPostsData {
  dateIso: string;
  generatedAtUtc: string;
  engine: string;
  articleUrl: string;
  imageUrl: string;
  teediVaram: string;
  keywordsUsedTe: string[];
  keywordsUsedEn: string[];
  platforms: {
    facebook: {
      caption: string;
      characterCount: number;
      linkUrl: string;
    };
    instagram: {
      caption: string;
      characterCount: number;
      hashtagCount: number;
    };
    linkedin: {
      hookPreview150: string;
      caption: string;
      characterCount: number;
      title: string;
    };
  };
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

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cleanHashtags(tags: string[], maxCount = 15): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const clean = raw
      .trim()
      .replace(/\s+/g, '')
      .replace(/^#*/, '#');
    if (clean.length > 2 && !seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase());
      out.push(clean);
      if (out.length >= maxCount) break;
    }
  }
  return out;
}

export async function buildPlatformNativePosts(): Promise<{
  postsData: DailySocialPostsData;
  cardBuffer: Buffer;
  cardPublicRelPath: string;
}> {
  const { day, fortunes } = getTodayISTData();
  const trendData = readJsonSafe<DailyTrendingSeoPayload>('src/data/dailyTrendingSeoData.json');

  const cleanTithi = day.panchanga.tithi.split('(')[0].split('-')[0].trim();
  const cleanNak = day.panchanga.nakshatram.split('(')[0].split('-')[0].trim();

  const statusScore = (s: 'favorable' | 'mixed' | 'caution') =>
    s === 'favorable' ? 2 : s === 'mixed' ? 1 : 0;
  const topRashis = [...fortunes]
    .sort((a, b) => statusScore(b.status) - statusScore(a.status))
    .slice(0, 3);
  const topRashisTe = topRashis.map((r) => `${r.symbol} ${r.teluguName}`).join(' • ');
  const topRashisEn = topRashis.map((r) => r.englishName).join(', ');

  const articleSlug = trendData?.linkedArticleSlug || `daily-panchangam-vishesham-${day.isoDate}`;
  const articleUrl = `${SITE_URL}/${articleSlug}`;
  const cardPublicRelPath = 'public/social-cards/daily-panchangam-card.png';
  const publicImageUrl = `${SITE_URL}/social-cards/daily-panchangam-card.png`;

  const keywordsTe = (trendData?.trendingKeywordsTe || [
    'నేటి తెలుగు పంచాంగం',
    `${cleanTithi} తిథి & ${cleanNak} నక్షత్రం`,
    'నేటి రాశి ఫలాలు తెలుగులో',
    'అభిజిత్ ముహూర్తం & రాహుకాలం',
  ]).slice(0, 6);

  const cleanTithiEn = translatePanchangamString(cleanTithi, 'en').replace(/\s+/g, ' ').trim();
  const cleanNakEn = translatePanchangamString(cleanNak, 'en').replace(/\s+/g, ' ').trim();
  const teediVaramEn = translatePanchangamString(day.teediVaram, 'en').replace(/\s+/g, ' ').trim();
  const abhijitEn = translatePanchangamString(day.shubha.abhijit, 'en')
    .replace(/నుండి/g, 'to')
    .replace(/వరకు/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const rahukalamEn = translatePanchangamString(day.ashubha.rahukalam, 'en')
    .replace(/నుండి/g, 'to')
    .replace(/వరకు/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const keywordsEn = (trendData?.trendingKeywordsEn || [
    `Today Telugu Panchangam ${day.isoDate}`,
    `${cleanTithiEn} Tithi ${cleanNakEn} Nakshatra`,
    'Daily Rashi Phalalu Telugu',
    'Shubha Muhurtham Hyderabad',
  ])
    .map((kw) => translatePanchangamString(kw, 'en').replace(/\s+/g, ' ').trim())
    .slice(0, 6);

  const baseHashtags = cleanHashtags(
    [
      ...(trendData?.socialHashtags || []),
      '#TeluguPanchangam',
      '#TeluguJyothisham',
      '#RasiPhalalu',
      '#DailyPanchangam',
      '#VedicAstrology',
      '#ShubhaMuhurtham',
      '#Hyderabad',
      '#Telangana',
      '#AndhraPradesh',
      '#TeluguNRI',
    ],
    14
  );
  const hashtagLine = baseHashtags.join(' ');

  // 1. Facebook Page Caption (Story + Panchangam + Daily Keywords + Direct Article Link)
  const facebookCaption = [
    `🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః | శుభోదయం భక్తులారా!`,
    `📅 నేటి దృక్సిద్ధాంత పంచాంగం (${day.teediVaram})`,
    ``,
    `🌙 తిథి: ${cleanTithi} | ⭐ నక్షత్రం: ${cleanNak}`,
    `🌞 అభిజిత్ శుభ ముహూర్తం: ${day.shubha.abhijit}`,
    `✨ అమృత ఘడియలు: ${day.shubha.amrutha}`,
    `⚠️ రాహు కాలం: ${day.ashubha.rahukalam}`,
    ``,
    `🌟 నేటి శుభ యోగం ఉన్న రాశులు: ${topRashisTe}`,
    `🔖 నేటి ముఖ్య విశేషాలు: ${keywordsTe.slice(0, 4).join(' • ')}`,
    ``,
    `📖 నేటి సంపూర్ణ పంచాంగ విశ్లేషణ, వ్రత నియమాలు & 12 రాశుల ఫలితాలు చదవండి:`,
    `👉 ${articleUrl}`,
    ``,
    `📜 ఉచిత 100 పేజీల జన్మ కుండలి (Janma Kundali PDF): ${SITE_URL}/janma-kundali`,
    `🏛️ బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ — శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం`,
    `📞 వ్యక్తిగత జాతక & ముహూర్త సంప్రదింపు (WhatsApp): +91 89779 86166`,
    ``,
    hashtagLine,
  ].join('\n');

  // 2. Instagram Caption (OpenMausBot rule: <= 2,200 chars, <= 30 hashtags, 4:5 visual saveability)
  const igHashtags = cleanHashtags(
    [
      ...baseHashtags,
      '#TeluguDevotional',
      '#SanatanaDharma',
      '#PanchangamToday',
      '#VedicWisdom',
      '#TeluguCulture',
      '#Tirupati',
      '#Vijayawada',
    ],
    22
  ).join(' ');

  let instagramCaption = [
    `🕉️ శుభోదయం! ${day.teediVaram} — నేటి తెలుగు పంచాంగం 📌 (Save & Share)`,
    ``,
    `🌙 తిథి: ${cleanTithi}`,
    `⭐ నక్షత్రం: ${cleanNak}`,
    `🌞 అభిజిత్ ముహూర్తం: ${day.shubha.abhijit}`,
    `✨ అమృత ఘడియలు: ${day.shubha.amrutha}`,
    `⚠️ రాహుకాలం: ${day.ashubha.rahukalam}`,
    ``,
    `🌟 విశేష శుభ రాశులు: ${topRashisTe}`,
    `📌 ముఖ్య అంశాలు: ${keywordsTe.slice(0, 3).join(' | ')}`,
    ``,
    `📖 పూర్తి వ్యాసం & మీ ఉచిత 100-పేజీల జాతకం PDF కోసం బయో లింక్ లేదా telugujyothisham.com చూడండి:`,
    `🔗 ${articleUrl}`,
    `📞 WhatsApp సంప్రదింపు: +91 89779 86166`,
    ``,
    igHashtags,
  ].join('\n');
  if (instagramCaption.length > 2180) {
    instagramCaption = instagramCaption.slice(0, 2177) + '...';
  }

  // 3. LinkedIn Caption (OpenMausBot rule: crisp hook in first 150 chars, <= 3,000 chars)
  const linkedInHook = `Start ${day.isoDate} with clarity: Today's Drik Siddhanta Panchangam highlights ${cleanTithiEn} Tithi & ${cleanNakEn} Nakshatra for strategic decisions.`;
  const linkedInTags = cleanHashtags(
    [
      '#VedicAstrology',
      '#TeluguPanchangam',
      '#DrikSiddhanta',
      '#IndianHeritage',
      '#MindfulLeadership',
      '#TeluguJyothisham',
      '#Hyderabad',
      '#NRI',
    ],
    8
  ).join(' ');

  const linkedInCaption = [
    linkedInHook,
    ``,
    `🌞 Today's Key Astronomical & Muhurtham Timings (${teediVaramEn} IST):`,
    `• Tithi & Nakshatra: ${cleanTithiEn} | ${cleanNakEn}`,
    `• Abhijit Shubha Muhurtham (Peak Focus Window): ${abhijitEn}`,
    `• Rahukalam (Avoid New Commitments): ${rahukalamEn}`,
    `• Strongest Transit Support: ${topRashisEn}`,
    ``,
    `🔍 Key Vedic Topics in Today's Guide: ${keywordsEn.slice(0, 4).join(' • ')}`,
    ``,
    `📖 Read the full bilingual Telugu & English Drik Siddhanta guide:`,
    `${articleUrl}`,
    ``,
    `✍️ Curated by Brahmasri Jallavaram Sai Dheeraj Sharma | Sri Lakshmi Ganapathi Jyothishalayam (Hyderabad)`,
    `🌐 Free 100-Page Janma Kundali & Panchangam: ${SITE_URL}`,
    ``,
    linkedInTags,
  ]
    .join('\n')
    .slice(0, 2950);

  // Render crisp 1080x1350 HD 4:5 card suitable for Facebook, Instagram & LinkedIn
  const cardBuffer = await renderMorningPanchangamCardBuffer(day);
  const absCardPath = path.resolve(process.cwd(), cardPublicRelPath);
  fs.mkdirSync(path.dirname(absCardPath), { recursive: true });
  fs.writeFileSync(absCardPath, cardBuffer);

  const postsData: DailySocialPostsData = {
    dateIso: day.isoDate,
    generatedAtUtc: new Date().toISOString(),
    engine: 'OpenMausBot Multi-Platform Social Studio + Drik Siddhanta',
    articleUrl,
    imageUrl: publicImageUrl,
    teediVaram: day.teediVaram,
    keywordsUsedTe: keywordsTe,
    keywordsUsedEn: keywordsEn,
    platforms: {
      facebook: {
        caption: facebookCaption,
        characterCount: facebookCaption.length,
        linkUrl: articleUrl,
      },
      instagram: {
        caption: instagramCaption,
        characterCount: instagramCaption.length,
        hashtagCount: igHashtags.split(/\s+/).filter(Boolean).length,
      },
      linkedin: {
        hookPreview150: linkedInHook.slice(0, 150),
        caption: linkedInCaption,
        characterCount: linkedInCaption.length,
        title: `${teediVaramEn} Telugu Panchangam & Muhurtham Guide`,
      },
    },
  };

  return { postsData, cardBuffer, cardPublicRelPath };
}

function renderOpenMausSocialPreviewHtml(postsData: DailySocialPostsData): string {
  const cards = [
    {
      platform: 'Facebook Page',
      badgeColor: '#1877f2',
      limitNote: 'Photo + Caption + Article Link',
      body: postsData.platforms.facebook.caption,
      meta: `${postsData.platforms.facebook.characterCount} chars`,
    },
    {
      platform: 'Instagram (4:5 Portrait)',
      badgeColor: '#e1306c',
      limitNote: `<= 2,200 chars • ${postsData.platforms.instagram.hashtagCount}/30 hashtags`,
      body: postsData.platforms.instagram.caption,
      meta: `${postsData.platforms.instagram.characterCount}/2200 chars`,
    },
    {
      platform: 'LinkedIn',
      badgeColor: '#0a66c2',
      limitNote: 'Hook within first 150 chars • <= 3,000 chars',
      body: postsData.platforms.linkedin.caption,
      meta: `${postsData.platforms.linkedin.characterCount}/3000 chars`,
    },
  ];

  return `<!DOCTYPE html>
<html lang="te">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OpenMausBot Daily Social Previews — ${escapeHtml(postsData.dateIso)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #faf7f2; color: #1e293b; margin: 0; padding: 24px; }
    .wrap { max-width: 1200px; margin: 0 auto; }
    .head { background: #2d0c02; color: #fef3c7; padding: 20px 24px; border-radius: 16px; border: 2px solid #f59e0b; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); display: flex; flex-direction: column; }
    .card-top { padding: 14px 16px; color: #fff; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
    .card-meta { font-size: 12px; opacity: 0.92; font-weight: 500; }
    .card-img { width: 100%; max-height: 360px; object-fit: cover; border-bottom: 1px solid #f1f5f9; background: #260600; }
    .card-body { padding: 16px; white-space: pre-wrap; font-size: 13.5px; line-height: 1.6; color: #334155; flex: 1; }
    .card-foot { padding: 10px 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1 style="margin:0 0 6px;font-size:20px;">🐾 OpenMausBot Multi-Platform Social Studio — ${escapeHtml(postsData.dateIso)}</h1>
      <div style="font-size:13px;color:#fde68a;">Article: ${escapeHtml(postsData.articleUrl)} | Card: ${escapeHtml(postsData.imageUrl)}</div>
    </div>
    <div class="grid">
      ${cards
        .map(
          (c) => `<article class="card">
        <div class="card-top" style="background:${c.badgeColor};">
          <span>${escapeHtml(c.platform)}</span>
          <span class="card-meta">${escapeHtml(c.meta)}</span>
        </div>
        <img class="card-img" src="../public/social-cards/daily-panchangam-card.png" alt="Daily Telugu Panchangam Social Card" width="1080" height="1350" />
        <div class="card-body">${escapeHtml(c.body)}</div>
        <div class="card-foot">${escapeHtml(c.limitNote)}</div>
      </article>`
        )
        .join('\n')}
    </div>
  </div>
</body>
</html>\n`;
}

export async function runOpenMausSocialEngine(options?: {
  publish?: boolean;
}): Promise<{
  postsData: DailySocialPostsData;
  results: SocialPublishResult[];
  summary: string;
}> {
  const shouldPublish = Boolean(
    options?.publish || process.argv.includes('--publish') || process.env.OPENMAUS_PUBLISH === '1'
  );

  const { postsData, cardBuffer, cardPublicRelPath } = await buildPlatformNativePosts();

  const jsonPath = path.resolve(process.cwd(), 'src/data/dailySocialPosts.json');
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(postsData, null, 2) + '\n', 'utf-8');

  const previewHtmlPath = path.resolve(process.cwd(), 'seo/social-posts-preview.html');
  fs.mkdirSync(path.dirname(previewHtmlPath), { recursive: true });
  fs.writeFileSync(previewHtmlPath, renderOpenMausSocialPreviewHtml(postsData), 'utf-8');

  console.log(`🎨 [OpenMausBot Social] Rendered 1080x1350 card -> ${cardPublicRelPath}`);
  console.log(`📝 [OpenMausBot Social] Saved platform-native Facebook, Instagram & LinkedIn copy -> src/data/dailySocialPosts.json`);

  const results: SocialPublishResult[] = [];

  if (shouldPublish) {
    // Option A: OpenMausBot Postiz Bridge (single key handles FB + IG + LinkedIn)
    if (process.env.POSTIZ_API_KEY) {
      const postizResults = await publishViaPostiz({
        facebookText: postsData.platforms.facebook.caption,
        instagramText: postsData.platforms.instagram.caption,
        linkedinText: postsData.platforms.linkedin.caption,
        imageUrl: postsData.imageUrl,
      });
      results.push(...postizResults);
    }

    // Option B: Direct Official Meta Graph API — Facebook Page Photo + Caption + Link
    if (process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN) {
      const fbRes = await publishToFacebookPage({
        caption: postsData.platforms.facebook.caption,
        imageBuffer: cardBuffer,
        linkUrl: postsData.articleUrl,
      });
      results.push(fbRes);
    }

    // Option C: Direct Official Meta Graph API — Instagram Feed Photo Post
    if (process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID) {
      const igRes = await publishToInstagram({
        imageUrl: postsData.imageUrl,
        caption: postsData.platforms.instagram.caption,
      });
      results.push(igRes);
    }

    // Option D: Direct Official LinkedIn REST API
    if (process.env.LINKEDIN_ACCESS_TOKEN && (process.env.LINKEDIN_PERSON_URN || process.env.LINKEDIN_ORGANIZATION_URN)) {
      const liRes = await publishToLinkedIn({
        text: postsData.platforms.linkedin.caption,
        imageBuffer: cardBuffer,
        title: postsData.platforms.linkedin.title,
      });
      results.push(liRes);
    }

    // Option E: Optional Webhook (Make.com / Zapier / n8n / Buffer)
    if (process.env.SOCIAL_WEBHOOK_URL) {
      try {
        const whRes = await fetch(process.env.SOCIAL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            event: 'openmaus_daily_social_posts',
            ...postsData,
          }),
        });
        results.push({
          success: whRes.ok,
          channel: 'webhook',
          message: whRes.ok
            ? `Webhook dispatched (${whRes.status})`
            : `Webhook HTTP ${whRes.status}`,
        });
      } catch (err) {
        results.push({
          success: false,
          channel: 'webhook',
          message: `Webhook error: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }
  }

  const okCount = results.filter((r) => r.success).length;
  const summary = !shouldPublish
    ? 'Draft & Preview Generated (ready for Facebook Page, Instagram & LinkedIn).'
    : results.length === 0
      ? 'Social posts drafted & queued (connect FACEBOOK_PAGE_TOKEN, INSTAGRAM_ACCESS_TOKEN, LINKEDIN_ACCESS_TOKEN, or POSTIZ_API_KEY in GitHub Secrets for auto-posting).'
      : `Published ${okCount}/${results.length} social channel posts.`;

  const reportPath = path.resolve(process.cwd(), 'seo/social-publish-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        dateIso: postsData.dateIso,
        generatedAtUtc: new Date().toISOString(),
        mode: shouldPublish ? 'publish' : 'draft',
        summary,
        articleUrl: postsData.articleUrl,
        imageUrl: postsData.imageUrl,
        results,
      },
      null,
      2
    ) + '\n',
    'utf-8'
  );

  return { postsData, results, summary };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMain) {
  runOpenMausSocialEngine()
    .then(({ summary, results }) => {
      console.log(`📊 [OpenMausBot Social] ${summary}`);
      for (const r of results) {
        console.log(`${r.success ? '✅' : '⚠️'} [${r.channel}] ${r.message}`);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ [OpenMausBot Social] Failed:', err);
      process.exit(1);
    });
}
