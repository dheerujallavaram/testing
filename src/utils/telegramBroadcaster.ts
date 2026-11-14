import { DailyReelResult, DailyVideoSocialPack } from './dailyPanchangamVideoRecorder';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  autoSendDaily: boolean;
  scheduleTime: string; // Default '00:00' (Night 12:00 AM)
  lastSentDate: string;
}

export const DEFAULT_TELEGRAM_BOT_TOKEN = '9209965871:AAEa0mqf-gCfYFmKnGop1g4Ns6X5EosGdXY';
export const DEFAULT_TELEGRAM_CHAT_ID = '1162542343';

const STORAGE_KEYS = {
  BOT_TOKEN: 'slg_telegram_bot_token',
  CHAT_ID: 'slg_telegram_chat_id',
  AUTO_SEND: 'slg_telegram_auto_daily',
  SCHEDULE_TIME: 'slg_telegram_schedule_time',
  LAST_SENT: 'slg_telegram_last_sent_date',
};

export function loadTelegramConfig(): TelegramConfig {
  if (typeof window === 'undefined') {
    return {
      botToken: DEFAULT_TELEGRAM_BOT_TOKEN,
      chatId: DEFAULT_TELEGRAM_CHAT_ID,
      autoSendDaily: true,
      scheduleTime: '00:00',
      lastSentDate: '',
    };
  }
  const storedAuto = localStorage.getItem(STORAGE_KEYS.AUTO_SEND);
  return {
    botToken: localStorage.getItem(STORAGE_KEYS.BOT_TOKEN) || DEFAULT_TELEGRAM_BOT_TOKEN,
    chatId: localStorage.getItem(STORAGE_KEYS.CHAT_ID) || DEFAULT_TELEGRAM_CHAT_ID,
    // Enabled by default so Night 12:00 AM auto-broadcast works out of the box with the existing bot
    autoSendDaily: storedAuto === null ? true : storedAuto === 'true',
    scheduleTime: localStorage.getItem(STORAGE_KEYS.SCHEDULE_TIME) || '00:00',
    lastSentDate: localStorage.getItem(STORAGE_KEYS.LAST_SENT) || '',
  };
}

export function saveTelegramConfig(config: Partial<TelegramConfig>): TelegramConfig {
  const current = loadTelegramConfig();
  const next: TelegramConfig = {
    ...current,
    ...config,
    botToken: (config.botToken ?? current.botToken ?? DEFAULT_TELEGRAM_BOT_TOKEN).trim() || DEFAULT_TELEGRAM_BOT_TOKEN,
    chatId: (config.chatId ?? current.chatId ?? DEFAULT_TELEGRAM_CHAT_ID).trim() || DEFAULT_TELEGRAM_CHAT_ID,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BOT_TOKEN, next.botToken);
    localStorage.setItem(STORAGE_KEYS.CHAT_ID, next.chatId);
    localStorage.setItem(STORAGE_KEYS.AUTO_SEND, String(next.autoSendDaily));
    localStorage.setItem(STORAGE_KEYS.SCHEDULE_TIME, next.scheduleTime || '00:00');
    localStorage.setItem(STORAGE_KEYS.LAST_SENT, next.lastSentDate);
  }
  return next;
}

/**
 * Returns formatted countdown string to the next scheduled daily time (default 00:00 / Night 12:00 AM)
 * and whether the current time has reached or passed today's scheduled trigger time.
 */
export function getScheduleCountdownInfo(scheduleTime = '00:00'): {
  countdownLabel: string;
  hasReachedTodayTrigger: boolean;
  todayIsoLocal: string;
} {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayIsoLocal = `${yyyy}-${mm}-${dd}`;

  const [targetHStr, targetMStr] = (scheduleTime || '00:00').split(':');
  const targetH = Number(targetHStr) || 0;
  const targetM = Number(targetMStr) || 0;

  const todayTarget = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetH, targetM, 0, 0);
  const hasReachedTodayTrigger = now.getTime() >= todayTarget.getTime();

  let nextTrigger = todayTarget;
  if (now.getTime() >= todayTarget.getTime()) {
    nextTrigger = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, targetH, targetM, 0, 0);
  }

  const diffMs = Math.max(0, nextTrigger.getTime() - now.getTime());
  const totalSec = Math.floor(diffMs / 1000);
  const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSec % 60).padStart(2, '0');

  return {
    countdownLabel: `${hrs}గం : ${mins}ని : ${secs}సె`,
    hasReachedTodayTrigger,
    todayIsoLocal,
  };
}

export interface DetectedChatInfo {
  chatId: string;
  title: string;
  type: string;
}

/**
 * Queries Telegram Bot API getUpdates to automatically discover the user's personal Chat ID,
 * Group ID, or Channel ID where the bot recently received a message or post.
 */
export async function autoDetectTelegramChatId(botToken: string): Promise<{
  ok: boolean;
  chats: DetectedChatInfo[];
  error?: string;
}> {
  const cleanToken = botToken.trim();
  if (!cleanToken) {
    return { ok: false, chats: [], error: 'ముందుగా మీ Telegram Bot Token నమోదు చేయండి (Enter Bot Token first).' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getUpdates?limit=30`);
    const data = await res.json();
    if (!data.ok) {
      return {
        ok: false,
        chats: [],
        error: data.description || 'Invalid Bot Token or Telegram API error.',
      };
    }

    const chatMap = new Map<string, DetectedChatInfo>();
    const results: any[] = Array.isArray(data.result) ? data.result : [];

    for (let i = results.length - 1; i >= 0; i--) {
      const upd = results[i];
      const msg =
        upd.message ||
        upd.channel_post ||
        upd.edited_message ||
        upd.edited_channel_post ||
        upd.my_chat_member;
      const chat = msg?.chat;
      if (chat && chat.id !== undefined) {
        const idStr = String(chat.id);
        if (!chatMap.has(idStr)) {
          const nameParts = [chat.title, chat.first_name, chat.last_name, chat.username ? `@${chat.username}` : '']
            .filter(Boolean)
            .join(' ');
          chatMap.set(idStr, {
            chatId: idStr,
            title: nameParts || `Chat ${idStr}`,
            type: chat.type || 'private',
          });
        }
      }
    }

    const chats = Array.from(chatMap.values());
    if (chats.length === 0) {
      return {
        ok: false,
        chats: [],
        error:
          'చాట్ కనుగొనబడలేదు! ముందుగా మీ టెలిగ్రామ్ బాట్‌కి "/start" లేదా "Hi" అని మెసేజ్ పంపి, ఆపై మళ్ళీ ఈ బటన్ నొక్కండి.',
      };
    }

    return { ok: true, chats };
  } catch (err: any) {
    return {
      ok: false,
      chats: [],
      error: err?.message || 'Network error while connecting to Telegram Bot API.',
    };
  }
}

/**
 * Sends a text message (up to 4096 chars) to Telegram via Bot API.
 */
export async function sendTelegramTextMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const cleanToken = botToken.trim();
  const cleanChatId = chatId.trim();
  if (!cleanToken || !cleanChatId) {
    return {
      ok: false,
      error: 'Telegram Bot Token మరియు Chat ID తప్పనిసరిగా నమోదు చేయాలి.',
    };
  }

  try {
    const safeText = text.length > 4050 ? text.slice(0, 4050) + '...' : text;
    const res = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: safeText,
        disable_web_page_preview: false,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      return { ok: false, error: data.description || 'Failed to send Telegram message.' };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Network error sending Telegram message.' };
  }
}

/**
 * Uploads a Full HD (1080x1920) video file directly to Telegram via sendVideo,
 * followed immediately by the complete copy-ready Title + Detailed Caption + Hashtags message
 * so nothing is ever cut off by Telegram's 1024-char video caption limit.
 */
export async function sendVideoAndSocialPackToTelegram(
  botToken: string,
  chatId: string,
  videoResult: DailyReelResult,
  socialPack: DailyVideoSocialPack,
  label: string
): Promise<{ ok: boolean; error?: string }> {
  const cleanToken = botToken.trim();
  const cleanChatId = chatId.trim();
  if (!cleanToken || !cleanChatId) {
    return {
      ok: false,
      error: 'Telegram Bot Token మరియు Chat ID తప్పనిసరిగా నమోదు చేయాలి.',
    };
  }

  try {
    // Build a concise caption (<= 950 chars) attached directly to the video file
    const shortHeader = `🎬 ${label}\n📌 ${socialPack.youtubeTitle}\n\n🌐 www.telugujyothisham.com\n📞 WhatsApp: +91 89779 86166\n\n${socialPack.hashtags}`;
    const videoCaption =
      shortHeader.length > 980 ? shortHeader.slice(0, 975) + '...' : shortHeader;

    const formData = new FormData();
    formData.append('chat_id', cleanChatId);
    formData.append('video', videoResult.blob, videoResult.filename);
    formData.append('width', '1080');
    formData.append('height', '1920');
    formData.append('supports_streaming', 'true');
    formData.append('caption', videoCaption);

    const videoRes = await fetch(`https://api.telegram.org/bot${cleanToken}/sendVideo`, {
      method: 'POST',
      body: formData,
    });
    const videoData = await videoRes.json();

    if (!videoData.ok) {
      // Fallback to sendDocument if sendVideo fails on certain WebM containers
      const docForm = new FormData();
      docForm.append('chat_id', cleanChatId);
      docForm.append('document', videoResult.blob, videoResult.filename);
      docForm.append('caption', videoCaption);
      const docRes = await fetch(`https://api.telegram.org/bot${cleanToken}/sendDocument`, {
        method: 'POST',
        body: docForm,
      });
      const docData = await docRes.json();
      if (!docData.ok) {
        return {
          ok: false,
          error: docData.description || videoData.description || 'Failed to upload HD video to Telegram.',
        };
      }
    }

    // Now send the FULL Detailed Title + Caption + Trending Hashtags as a separate message
    // so Admin can 1-tap copy the entire caption without any 1024-char truncation
    const fullCaptionMsg =
      `📋 [${label} — FULL CAPTION & HASHTAGS]\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${socialPack.fullPostText}`;

    await sendTelegramTextMessage(cleanToken, cleanChatId, fullCaptionMsg);

    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Network error while uploading HD video to Telegram.',
    };
  }
}

/**
 * Shares the generated HD video file + caption directly to the native Telegram app / system share sheet
 * (works on Android, iOS, macOS, Windows without needing a Bot Token), or falls back to Telegram web share URL.
 */
export async function shareVideoToTelegramAppOrDevice(
  videoResult: DailyReelResult,
  socialPack: DailyVideoSocialPack
): Promise<{ sharedNatively: boolean }> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(socialPack.fullPostText).catch(() => {});
    }

    const file = new File([videoResult.blob], videoResult.filename, {
      type: videoResult.blob.type || 'video/mp4',
    });

    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: socialPack.youtubeTitle,
        text: socialPack.fullPostText,
        files: [file],
      });
      return { sharedNatively: true };
    }
  } catch {
    // User cancelled or native file share unsupported; fallback below
  }

  // Trigger download of the video file so Admin has it locally, and open Telegram Share URL with caption
  const url = URL.createObjectURL(videoResult.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = videoResult.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);

  return { sharedNatively: false };
}
