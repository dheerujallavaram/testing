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
import { generateServerDailyReelVideoBuffer } from './generateDailyPanchangamReel';

export interface SocialPublishResult {
  success: boolean;
  channel: 'linkedin' | 'instagram' | 'instagram_reel' | 'facebook' | 'youtube' | 'webhook';
  message: string;
  postId?: string;
  postUrl?: string;
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
 * Refreshes a Google OAuth2 access token using YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN.
 */
async function getYouTubeAccessToken(): Promise<{ accessToken?: string; error?: string }> {
  const clientId = process.env.YOUTUBE_CLIENT_ID?.trim();
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    return {
      error: 'YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, or YOUTUBE_REFRESH_TOKEN is not configured.',
    };
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });
    const data = (await res.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };
    if (!res.ok || !data.access_token) {
      return {
        error: `YouTube OAuth refresh failed: ${data.error_description || data.error || res.statusText}`,
      };
    }
    return { accessToken: data.access_token };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Uploads a 9:16 1080x1920 60s MP4 video directly to YouTube Shorts via YouTube Data API v3 Resumable Upload.
 */
export async function uploadVideoToYouTubeShorts(params: {
  mp4Buffer: Buffer;
  title: string;
  description: string;
  tags?: string[];
  defaultLanguage?: 'te' | 'en';
  accessToken?: string;
}): Promise<SocialPublishResult> {
  let token = params.accessToken;
  if (!token) {
    const auth = await getYouTubeAccessToken();
    if (!auth.accessToken) {
      return {
        success: false,
        channel: 'youtube',
        message: auth.error || 'Missing YouTube OAuth token.',
      };
    }
    token = auth.accessToken;
  }

  const safeTitle = (params.title.includes('#Shorts') ? params.title : `${params.title} #Shorts`).slice(0, 98);
  const safeDescription = (
    params.description.includes('#Shorts')
      ? params.description
      : `${params.description}\n\n#Shorts #TeluguPanchangam #TeluguJyothisham`
  ).slice(0, 4900);
  const privacyStatus =
    (process.env.YOUTUBE_PRIVACY_STATUS as 'public' | 'unlisted' | 'private') || 'public';

  try {
    // Step 1: Initiate Resumable Upload session
    const initRes = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Length': String(params.mp4Buffer.byteLength),
          'X-Upload-Content-Type': 'video/mp4',
        },
        body: JSON.stringify({
          snippet: {
            title: safeTitle,
            description: safeDescription,
            tags: (params.tags || [
              'Telugu Panchangam',
              'Rashi Phalalu',
              'Telugu Jyothisham',
              'Shorts',
              'Today Panchangam',
            ]).slice(0, 25),
            categoryId: '22', // People & Blogs
            defaultLanguage: params.defaultLanguage || 'te',
          },
          status: {
            privacyStatus,
            selfDeclaredMadeForKids: false,
          },
        }),
      }
    );

    if (!initRes.ok) {
      const errBody = await initRes.text();
      return {
        success: false,
        channel: 'youtube',
        message: `YouTube upload init failed (${initRes.status}): ${errBody.slice(0, 300)}`,
      };
    }

    const uploadUrl = initRes.headers.get('location');
    if (!uploadUrl) {
      return {
        success: false,
        channel: 'youtube',
        message: 'YouTube upload session did not return a resumable Location URL.',
      };
    }

    // Step 2: PUT the MP4 binary stream
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(params.mp4Buffer.byteLength),
      },
      body: new Uint8Array(params.mp4Buffer),
    });

    const putData = (await putRes.json()) as { id?: string; error?: { message: string } };
    if (putRes.ok && putData.id) {
      const shortsUrl = `https://youtube.com/shorts/${putData.id}`;
      return {
        success: true,
        channel: 'youtube',
        postId: putData.id,
        postUrl: shortsUrl,
        message: `YouTube Short published: ${shortsUrl}`,
      };
    }

    return {
      success: false,
      channel: 'youtube',
      message: `YouTube binary upload failed (${putRes.status}): ${putData.error?.message || 'Unknown error'}`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      channel: 'youtube',
      message: `YouTube upload exception: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Directly uploads an MP4 video to a Facebook Page via Meta Graph Video API (no external hosting needed).
 * Requires FACEBOOK_PAGE_ID and FACEBOOK_PAGE_TOKEN.
 */
export async function uploadVideoToFacebookPage(params: {
  mp4Buffer: Buffer;
  filename: string;
  title: string;
  description: string;
}): Promise<SocialPublishResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const pageToken = process.env.FACEBOOK_PAGE_TOKEN?.trim();

  if (!pageId || !pageToken) {
    return {
      success: false,
      channel: 'facebook',
      message: 'FACEBOOK_PAGE_ID or FACEBOOK_PAGE_TOKEN is not configured.',
    };
  }

  try {
    const form = new FormData();
    form.append('access_token', pageToken);
    form.append('title', params.title.slice(0, 250));
    form.append('description', params.description.slice(0, 5000));
    const blob = new Blob([new Uint8Array(params.mp4Buffer)], { type: 'video/mp4' });
    form.append('source', blob, params.filename);

    const res = await fetch(`https://graph-video.facebook.com/v21.0/${pageId}/videos`, {
      method: 'POST',
      body: form,
    });
    const data = (await res.json()) as { id?: string; error?: { message: string } };
    if (res.ok && data.id) {
      const fbUrl = `https://www.facebook.com/reel/${data.id}`;
      return {
        success: true,
        channel: 'facebook',
        postId: data.id,
        postUrl: fbUrl,
        message: `Facebook Page video published: ${fbUrl}`,
      };
    }

    return {
      success: false,
      channel: 'facebook',
      message: `Facebook video upload failed: ${data.error?.message || `HTTP ${res.status}`}`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      channel: 'facebook',
      message: `Facebook video exception: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Uploads an MP4 buffer to Cloudinary (unsigned upload preset) so Meta Instagram Reels API has a public HTTPS video_url.
 */
async function uploadVideoToCloudinary(
  mp4Buffer: Buffer,
  filename: string
): Promise<{ url?: string; error?: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!cloudName || !uploadPreset) {
    return { error: 'CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET is not configured.' };
  }

  try {
    const form = new FormData();
    form.append('upload_preset', uploadPreset);
    form.append('folder', 'telugujyothisham-reels');
    form.append('public_id', filename.replace(/\.mp4$/i, ''));
    const blob = new Blob([new Uint8Array(mp4Buffer)], { type: 'video/mp4' });
    form.append('file', blob, filename);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: 'POST',
      body: form,
    });
    const data = (await res.json()) as { secure_url?: string; error?: { message: string } };
    if (res.ok && data.secure_url) {
      return { url: data.secure_url };
    }
    return { error: data.error?.message || `Cloudinary HTTP ${res.status}` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Publishes an Instagram Reel via Meta Graph API (media_type=REELS) with automatic container status polling.
 * Uses provided videoUrl or automatically uploads mp4Buffer to Cloudinary if CLOUDINARY_* secrets are set.
 */
export async function publishReelToInstagram(params: {
  videoUrl?: string;
  mp4Buffer?: Buffer;
  filename?: string;
  caption: string;
}): Promise<SocialPublishResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID?.trim();

  if (!token || !accountId) {
    return {
      success: false,
      channel: 'instagram_reel',
      message: 'INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID is not configured.',
    };
  }

  let publicVideoUrl = params.videoUrl?.trim();
  if (!publicVideoUrl && params.mp4Buffer && params.filename) {
    const cloudUpload = await uploadVideoToCloudinary(params.mp4Buffer, params.filename);
    if (!cloudUpload.url) {
      return {
        success: false,
        channel: 'instagram_reel',
        message: `Instagram Reels skipped: no public video_url (${cloudUpload.error}).`,
      };
    }
    publicVideoUrl = cloudUpload.url;
  }

  if (!publicVideoUrl) {
    return {
      success: false,
      channel: 'instagram_reel',
      message: 'Instagram Reels skipped: public HTTPS videoUrl is required.',
    };
  }

  try {
    const createRes = await fetch(`https://graph.facebook.com/v21.0/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'REELS',
        video_url: publicVideoUrl,
        caption: params.caption.slice(0, 2200),
        share_to_feed: true,
        access_token: token,
      }),
    });

    const createData = (await createRes.json()) as { id?: string; error?: { message: string } };
    if (!createData.id) {
      return {
        success: false,
        channel: 'instagram_reel',
        message: `Instagram Reel container failed: ${createData.error?.message || 'Unknown error'}`,
      };
    }

    // Poll until Meta finishes processing the Reel MP4 (up to ~60s)
    for (let attempt = 0; attempt < 12; attempt++) {
      await new Promise((r) => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://graph.facebook.com/v21.0/${createData.id}?fields=status_code,status&access_token=${encodeURIComponent(token)}`
      );
      const statusData = (await statusRes.json()) as { status_code?: string; status?: string };
      if (statusData.status_code === 'FINISHED') {
        break;
      }
      if (statusData.status_code === 'ERROR') {
        return {
          success: false,
          channel: 'instagram_reel',
          message: `Instagram Reel processing error: ${statusData.status || 'ERROR'}`,
        };
      }
    }

    const publishRes = await fetch(`https://graph.facebook.com/v21.0/${accountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: createData.id,
        access_token: token,
      }),
    });

    const publishData = (await publishRes.json()) as { id?: string; error?: { message: string } };
    if (publishData.id) {
      return {
        success: true,
        channel: 'instagram_reel',
        postId: publishData.id,
        message: `Instagram Reel published successfully! (Media ID: ${publishData.id})`,
      };
    }

    return {
      success: false,
      channel: 'instagram_reel',
      message: `Instagram Reel publish failed: ${publishData.error?.message || 'Unknown error'}`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      channel: 'instagram_reel',
      message: `Instagram Reel exception: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Publishes Today's 1080x1920 60s Reels to YouTube Shorts, Facebook Page, Instagram Reels, and Webhook.
 * Reuses cached MP4 buffers from generateServerDailyReelVideoBuffer so zero extra render time is spent when run after Telegram!
 */
export async function publishDailyReelsToVideoPlatforms(): Promise<{
  results: SocialPublishResult[];
  summary: string;
}> {
  const { day } = getTodayISTData();
  const hasYouTube = Boolean(
    process.env.YOUTUBE_CLIENT_ID &&
      process.env.YOUTUBE_CLIENT_SECRET &&
      process.env.YOUTUBE_REFRESH_TOKEN
  );
  const hasFacebook = Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN);
  const hasInstagramReelHost = Boolean(
    process.env.INSTAGRAM_ACCESS_TOKEN &&
      process.env.INSTAGRAM_ACCOUNT_ID &&
      ((process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) ||
        process.env.INSTAGRAM_PUBLIC_REEL_BASE_URL)
  );
  const hasWebhook = Boolean(process.env.SOCIAL_WEBHOOK_URL);

  if (!hasYouTube && !hasFacebook && !hasInstagramReelHost) {
    return {
      results: [],
      summary:
        'Video auto-upload ready (set YOUTUBE_REFRESH_TOKEN, FACEBOOK_PAGE_TOKEN, or INSTAGRAM_ACCESS_TOKEN + CLOUDINARY_CLOUD_NAME secrets in GitHub).',
    };
  }

  const rawVariants = (
    process.env.REEL_PUBLISH_VARIANTS || 'panchangam_te,rashi_te,panchangam_en,rashi_en'
  )
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  const variants: Array<{ kind: 'panchangam' | 'rashi'; lang: 'te' | 'en' }> = rawVariants
    .map((v) => {
      const [k, l] = v.split('_');
      if ((k === 'panchangam' || k === 'rashi') && (l === 'te' || l === 'en')) {
        return { kind: k, lang: l };
      }
      return null;
    })
    .filter((v): v is { kind: 'panchangam' | 'rashi'; lang: 'te' | 'en' } => v !== null);

  let ytAccessToken: string | undefined;
  if (hasYouTube) {
    const auth = await getYouTubeAccessToken();
    if (auth.accessToken) {
      ytAccessToken = auth.accessToken;
    } else {
      console.warn('⚠️ YouTube OAuth error:', auth.error);
    }
  }

  const results: SocialPublishResult[] = [];
  const baseReelUrl = process.env.INSTAGRAM_PUBLIC_REEL_BASE_URL?.replace(/\/$/, '');

  for (const variant of variants) {
    const { mp4Buffer, filename, socialPack } = generateServerDailyReelVideoBuffer(
      day,
      variant.kind,
      variant.lang
    );

    const tags = socialPack.hashtags
      .split(/\s+/)
      .map((t) => t.replace(/^#/, '').trim())
      .filter((t) => t.length > 1 && t.length <= 30);

    // 1. YouTube Shorts
    if (ytAccessToken) {
      const ytRes = await uploadVideoToYouTubeShorts({
        mp4Buffer,
        title: socialPack.youtubeTitle,
        description: `${socialPack.caption}\n\n${socialPack.hashtags}`,
        tags,
        defaultLanguage: variant.lang,
        accessToken: ytAccessToken,
      });
      results.push(ytRes);
      console.log(ytRes.success ? `✅ ${ytRes.message}` : `⚠️ ${ytRes.message}`);
    }

    // 2. Facebook Page Reels / Video
    if (hasFacebook) {
      const fbRes = await uploadVideoToFacebookPage({
        mp4Buffer,
        filename,
        title: socialPack.youtubeTitle,
        description: socialPack.fullPostText,
      });
      results.push(fbRes);
      console.log(fbRes.success ? `✅ ${fbRes.message}` : `⚠️ ${fbRes.message}`);
    }

    // 3. Instagram Reels (Cloudinary unsigned upload or configured HTTPS URL)
    if (hasInstagramReelHost) {
      const publicUrl = baseReelUrl ? `${baseReelUrl}/${filename}` : undefined;
      const igReelRes = await publishReelToInstagram({
        videoUrl: publicUrl,
        mp4Buffer,
        filename,
        caption: `${socialPack.caption}\n\n${socialPack.hashtags}`,
      });
      results.push(igReelRes);
      console.log(igReelRes.success ? `✅ ${igReelRes.message}` : `⚠️ ${igReelRes.message}`);
    }

    // 4. Optional Webhook notification per video when configured alongside video platforms
    if (hasWebhook && process.env.SOCIAL_WEBHOOK_URL) {
      try {
        await fetch(process.env.SOCIAL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'daily_reel_published',
            date: day.isoDate,
            kind: variant.kind,
            lang: variant.lang,
            filename,
            youtubeTitle: socialPack.youtubeTitle,
            caption: socialPack.caption,
            hashtags: socialPack.hashtags,
            fullPostText: socialPack.fullPostText,
            publishedLinks: results
              .filter((r) => r.success && r.postUrl)
              .map((r) => ({ channel: r.channel, url: r.postUrl })),
          }),
        });
      } catch {}
    }
  }

  const okCount = results.filter((r) => r.success).length;
  return {
    results,
    summary: `Video Reels Run: ${okCount}/${results.length} succeeded.`,
  };
}

/**
 * Triggers the automated daily social post workflow (Images, LinkedIn, YouTube Shorts, FB Video, IG Reels, Webhook).
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

  // 3. Direct Instagram Photo Feed (fallback when Reels public video host is not set)
  const hasReelHosting = Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) ||
      process.env.INSTAGRAM_PUBLIC_REEL_BASE_URL
  );
  if (process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID && !hasReelHosting) {
    const igRes = await publishToInstagram({
      imageUrl: payload.imageUrlTe,
      caption: payload.fullSocialCaption,
    });
    results.push(igRes);
  }

  // 4. YouTube Shorts, Facebook Page Reels & Instagram Reels (Direct HD Video Uploads)
  const videoRun = await publishDailyReelsToVideoPlatforms();
  results.push(...videoRun.results);

  const successCount = results.filter((r) => r.success).length;
  const summary =
    results.length === 0
      ? 'No social integrations configured yet (YouTube Shorts, Facebook Page, Instagram, LinkedIn, or Webhook).'
      : `Social Posting Run: ${successCount}/${results.length} succeeded (${videoRun.summary}).`;

  return { results, summary };
}
