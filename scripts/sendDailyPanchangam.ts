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

  // 2. WhatsApp Automation (Meta Official Cloud API / CallMeBot Free Webhook)
  try {
    const { sendWhatsAppTextMessage } = await import('./whatsappBot');
    const waPhone = process.env.WHATSAPP_PHONE || '918977986166';
    const waResult = await sendWhatsAppTextMessage(waPhone, message);
    if (waResult.success) {
      console.log(`✅ Sent Daily Panchangam to WhatsApp (${waPhone}) via ${waResult.provider}`);
    } else {
      console.log(`ℹ️ WhatsApp automation status: ${waResult.error || 'Ready for configuration'}`);
    }
  } catch (waErr) {
    console.error('WhatsApp send error:', waErr);
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
