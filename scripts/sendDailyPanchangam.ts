import { WEEK_DATA } from '../src/data/panchangamData';
import { getTodayAndTomorrowIds, generateWhatsAppShareText } from '../src/utils/panchangaLogic';
import {
  loadSavedChatIds,
  saveChatId,
  sendFullDailyBundleToChat,
} from './telegramBot';

async function run() {
  const { todayDay } = getTodayAndTomorrowIds(WEEK_DATA, new Date());
  const message = generateWhatsAppShareText(todayDay, 'https://www.telugujyothisham.com');

  console.log('=== TODAY PANCHANGAM & RASHI PHALALU ===\n');
  console.log(message);
  console.log('\n========================================');

  // 1. Automatic Telegram Bot Daily Broadcast (Panchangam HD Image + 12 Rashi Predictions)
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN || '9209965871:AAEa0mqf-gCfYFmKnGop1g4Ns6X5EosGdXY';

  if (botToken) {
    try {
      // Discover any new chats/channels from getUpdates first
      const updRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
      const updJson = (await updRes.json()) as {
        ok: boolean;
        result?: Array<{
          message?: { chat: { id: number } };
          channel_post?: { chat: { id: number } };
        }>;
      };
      if (updJson.ok && Array.isArray(updJson.result)) {
        for (const u of updJson.result) {
          if (u.message?.chat?.id) saveChatId(u.message.chat.id);
          if (u.channel_post?.chat?.id) saveChatId(u.channel_post.chat.id);
        }
      }

      const chatIds = loadSavedChatIds();
      if (chatIds.length > 0) {
        for (const chatId of chatIds) {
          await sendFullDailyBundleToChat(chatId);
          console.log(`✅ Sent Daily Panchangam Image + 12 Rashi Predictions to Telegram Chat: ${chatId}`);
        }
      } else {
        console.log(
          'ℹ️ Telegram Bot is ready (@telugujyothisham_bot). Send /start to @telugujyothisham_bot on Telegram or set TELEGRAM_CHAT_ID.'
        );
      }
    } catch (err) {
      console.error('Telegram broadcast error:', err);
    }
  }

  const phone = process.env.WHATSAPP_PHONE || '918977986166';
  const callMeBotKey = process.env.CALLMEBOT_API_KEY;
  const metaToken = process.env.META_WA_TOKEN;
  const metaPhoneId = process.env.META_PHONE_ID;

  // 2. Meta WhatsApp Cloud API (Official)
  if (metaToken && metaPhoneId) {
    const res = await fetch(`https://graph.facebook.com/v20.0/${metaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${metaToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { preview_url: true, body: message },
      }),
    });
    const data = await res.json();
    console.log('Meta WhatsApp Cloud API response:', data);
    return;
  }

  // 3. CallMeBot Free Personal WhatsApp Webhook
  if (callMeBotKey) {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      phone
    )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(callMeBotKey)}`;
    const res = await fetch(url);
    const body = await res.text();
    console.log('CallMeBot WhatsApp API response:', body);
    return;
  }

  // 4. Automated LinkedIn & Instagram Posting
  try {
    const { executeDailySocialPosting } = await import('./socialPublisher');
    const socialResult = await executeDailySocialPosting();
    console.log('Social Media Auto-Publishing:', socialResult.summary);
  } catch (socialErr) {
    console.error('Social Media Auto-Publishing error:', socialErr);
  }
}

run().catch((err) => {
  console.error('Error sending daily Panchangam:', err);
  process.exit(1);
});
