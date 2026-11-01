/**
 * Social Media Automated Publisher (LinkedIn & Instagram)
 * for Telugu Jyothisham (www.telugujyothisham.com)
 *
 * Supports:
 * 1. LinkedIn REST API (Direct Profile / Company Page posting with HD image)
 * 2. Instagram Graph API (Direct Feed Post / Carousel / Story)
 * 3. Webhook Dispatcher (Make.com / Zapier / Pipedream / n8n for zero-code, instant autopilot)
 */

import { DayData } from '../src/types/panchangam';
import { RashiDailyFortune } from '../src/utils/panchangaLogic';
import { getTodayISTData, renderDailyPanchangamPngBuffer } from './telegramBot';

export interface SocialPublishResult {
  success: boolean;
  channel: 'linkedin' | 'instagram' | 'webhook';
  message: string;
  postId?: string;
}

/**
 * Publishes text + optional image to LinkedIn using LinkedIn REST / UGC API.
 * Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN (e.g., "urn:li:person:abcdef" or "urn:li:organization:123456").
 */
export async function publishToLinkedIn(params: {
  text: string;
  imageBuffer?: Buffer;
  title?: string;
}): Promise<SocialPublishResult> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_PERSON_URN || process.env.LINKEDIN_ORGANIZATION_URN;

  if (!token || !authorUrn) {
    return {
      success: false,
      channel: 'linkedin',
      message: 'LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN is not configured.',
    };
  }

  try {
    let imageUrn: string | null = null;

    // Step 1: Upload Image to LinkedIn if buffer provided
    if (params.imageBuffer) {
      const initUrl = 'https://api.linkedin.com/rest/images?action=initializeUpload';
      const initRes = await fetch(initUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'LinkedIn-Version': '202401',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          initializeUploadRequest: {
            owner: authorUrn,
          },
        }),
      });

      const initData = (await initRes.json()) as {
        value?: { uploadUrl: string; image: string };
      };

      if (initData.value?.uploadUrl && initData.value?.image) {
        // Step 2: Upload raw image binary
        const uploadRes = await fetch(initData.value.uploadUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'image/png',
          },
          body: new Uint8Array(params.imageBuffer),
        });

        if (uploadRes.ok) {
          imageUrn = initData.value.image;
        }
      }
    }

    // Step 3: Create the LinkedIn Post
    const postPayload: Record<string, unknown> = {
      author: authorUrn,
      commentary: params.text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    if (imageUrn) {
      postPayload.content = {
        media: {
          title: params.title || 'Daily Telugu Panchangam | Telugu Jyothisham',
          id: imageUrn,
        },
      };
    }

    const postRes = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postPayload),
    });

    if (postRes.ok || postRes.status === 201) {
      const postId = postRes.headers.get('x-restli-id') || 'published';
      return {
        success: true,
        channel: 'linkedin',
        message: 'LinkedIn post published successfully!',
        postId,
      };
    }

    const errText = await postRes.text();
    return {
      success: false,
      channel: 'linkedin',
      message: `LinkedIn API error (${postRes.status}): ${errText}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      channel: 'linkedin',
      message: `LinkedIn request exception: ${errorMsg}`,
    };
  }
}

/**
 * Publishes an image + caption to Instagram Business/Creator account via Meta Graph API.
 * Requires INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID.
 * Note: Instagram requires a publicly reachable image URL.
 */
export async function publishToInstagram(params: {
  imageUrl: string;
  caption: string;
}): Promise<SocialPublishResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!token || !accountId) {
    return {
      success: false,
      channel: 'instagram',
      message: 'INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID is not configured.',
    };
  }

  try {
    // Step 1: Create media container
    const containerUrl = `https://graph.facebook.com/v21.0/${accountId}/media`;
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: params.imageUrl,
        caption: params.caption.slice(0, 2200), // Instagram caption limit is 2200 characters
        access_token: token,
      }),
    });

    const containerData = (await containerRes.json()) as { id?: string; error?: { message: string } };
    if (!containerData.id) {
      return {
        success: false,
        channel: 'instagram',
        message: `Instagram container creation failed: ${containerData.error?.message || 'Unknown error'}`,
      };
    }

    // Step 2: Wait 3 seconds for Instagram to fetch and process the image
    await new Promise((r) => setTimeout(r, 3000));

    // Step 3: Publish container
    const publishUrl = `https://graph.facebook.com/v21.0/${accountId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: token,
      }),
    });

    const publishData = (await publishRes.json()) as { id?: string; error?: { message: string } };
    if (publishData.id) {
      return {
        success: true,
        channel: 'instagram',
        message: 'Instagram post published successfully!',
        postId: publishData.id,
      };
    }

    return {
      success: false,
      channel: 'instagram',
      message: `Instagram media_publish failed: ${publishData.error?.message || 'Unknown error'}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      channel: 'instagram',
      message: `Instagram request exception: ${errorMsg}`,
    };
  }
}

/**
 * Dispatches the daily post payload to a Webhook (Make.com / Zapier / Pipedream / n8n / Buffer).
 * This is the easiest, most reliable zero-code way to post to both Instagram & LinkedIn simultaneously
 * without requiring Meta App Review or complex OAuth renewal!
 */
export async function triggerSocialWebhook(payload: {
  date: string;
  teediVaram: string;
  samvatsaram: string;
  masam: string;
  tithi: string;
  nakshatram: string;
  amrutha: string;
  abhijit: string;
  rahukalam: string;
  topPredictions: string;
  fullSocialCaption: string;
  websiteUrl: string;
  author: string;
  imageUrlTe: string;
  imageUrlEn: string;
}): Promise<SocialPublishResult> {
  const webhookUrl = process.env.SOCIAL_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      success: false,
      channel: 'webhook',
      message: 'SOCIAL_WEBHOOK_URL is not configured.',
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return {
        success: true,
        channel: 'webhook',
        message: `Webhook sent successfully to ${new URL(webhookUrl).hostname}!`,
      };
    }

    return {
      success: false,
      channel: 'webhook',
      message: `Webhook returned HTTP ${res.status}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      channel: 'webhook',
      message: `Webhook dispatch failed: ${errorMsg}`,
    };
  }
}

/**
 * Builds the complete structured social media payload for Make.com / Zapier / Direct API
 */
export function buildSocialPayload(day: DayData, fortunes: RashiDailyFortune[]) {
  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNak = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;

  const topRashis = fortunes
    .slice(0, 4)
    .map(
      (f) =>
        `• ${f.symbol} ${f.teluguName} (${f.englishName}): ${f.statusLabel} • ${f.careerFinanceLine.replace(/^[0-9]+\.\s*[^:]+:\s*/, '')}`
    )
    .join('\n');

  const caption = [
    `🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః | నేటి తెలుగు పంచాంగం & రాశి ఫలాలు (${day.teediVaram})`,
    ``,
    `📅 తేదీ: ${day.teediVaram} (${day.panchanga.samvatsaram}, ${day.panchanga.masam})`,
    `🌙 తిథి: ${cleanTithi} | ⭐ నక్షత్రం: ${cleanNak}`,
    `✅ శుభ సమయం (అమృత ఘడియలు): ${day.shubha.amrutha} | అభిజిత్: ${day.shubha.abhijit}`,
    `⚠️ రాహు కాలం: ${day.ashubha.rahukalam}`,
    ``,
    `🪐 నేటి ముఖ్య రాశి ఫలితాలు:`,
    topRashis,
    ``,
    `📜 మీ పుట్టిన తేదీతో ఉచిత 100 పేజీల జన్మ కుండలి (Jatakam) PDF రిపోర్ట్ & సంపూర్ణ పంచాంగం కోసం క్లిక్ చేయండి:`,
    `👉 https://www.telugujyothisham.com`,
    ``,
    `✍️ బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు`,
    `🏛️ శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం | 📞 WhatsApp: +91 8977986166`,
    ``,
    `#TeluguPanchangam #TeluguJyothisham #RasiPhalalu #TodayPanchangam #TeluguAstrology #Jatakam #VedicAstrology #Hyderabad #Vijayawada #Vizag #Tirupati #TeluguNRI #USA`,
  ].join('\n');

  return {
    date: day.isoDate,
    teediVaram: day.teediVaram,
    samvatsaram: day.panchanga.samvatsaram,
    masam: day.panchanga.masam,
    tithi: cleanTithi,
    nakshatram: cleanNak,
    amrutha: day.shubha.amrutha,
    abhijit: day.shubha.abhijit,
    rahukalam: day.ashubha.rahukalam,
    topPredictions: topRashis,
    fullSocialCaption: caption,
    websiteUrl: 'https://www.telugujyothisham.com',
    author: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
    imageUrlTe: 'https://www.telugujyothisham.com/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg',
    imageUrlEn: 'https://www.telugujyothisham.com/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg',
  };
}

/**
 * Triggers the automated daily social post workflow.
 */
export async function executeDailySocialPosting(): Promise<{
  results: SocialPublishResult[];
  summary: string;
}> {
  const { day, fortunes } = getTodayISTData();
  const payload = buildSocialPayload(day, fortunes);
  const imageBuffer = renderDailyPanchangamPngBuffer(day, 'te');

  const results: SocialPublishResult[] = [];

  // 1. Webhook (Make.com / Zapier / Buffer)
  if (process.env.SOCIAL_WEBHOOK_URL) {
    const whRes = await triggerSocialWebhook(payload);
    results.push(whRes);
  }

  // 2. Direct LinkedIn
  if (process.env.LINKEDIN_ACCESS_TOKEN) {
    const liRes = await publishToLinkedIn({
      text: payload.fullSocialCaption,
      imageBuffer,
      title: `Telugu Panchangam - ${day.teediVaram}`,
    });
    results.push(liRes);
  }

  // 3. Direct Instagram
  if (process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID) {
    const igRes = await publishToInstagram({
      imageUrl: payload.imageUrlTe,
      caption: payload.fullSocialCaption,
    });
    results.push(igRes);
  }

  const successCount = results.filter((r) => r.success).length;
  const summary =
    results.length === 0
      ? 'No social integrations configured yet (SOCIAL_WEBHOOK_URL, LINKEDIN_ACCESS_TOKEN, or INSTAGRAM_ACCESS_TOKEN).'
      : `Social Posting Run: ${successCount}/${results.length} succeeded.`;

  return { results, summary };
}
