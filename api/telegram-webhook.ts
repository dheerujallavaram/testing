/**
 * Vercel Serverless Function for 24/7 Telegram Bot Webhook
 * Endpoint: https://www.telugujyothisham.com/api/telegram-webhook
 */
import {
  BOT_TOKEN,
  handleCommandOrCallback,
  saveChatId,
} from '../scripts/telegramBot';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const host = req.headers?.host || 'www.telugujyothisham.com';
    const webhookUrl = `https://${host}/api/telegram-webhook`;

    // Allow 1-click webhook registration via ?setup=1
    if (req.query?.setup === '1') {
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          drop_pending_updates: false,
        }),
      });
      const tgData = await tgRes.json();
      return res.status(200).json({
        status: 'Webhook Configured',
        webhookUrl,
        telegramResponse: tgData,
      });
    }

    return res.status(200).json({
      ok: true,
      service: 'Telugu Jyothisham 24/7 Telegram Bot Webhook',
      setupUrl: `https://${host}/api/telegram-webhook?setup=1`,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!update) {
      return res.status(200).json({ ok: true });
    }

    if (update.message?.chat?.id) {
      const chatId = update.message.chat.id;
      const text = update.message.text || '/start';
      await handleCommandOrCallback(chatId, text);
    } else if (update.channel_post?.chat?.id) {
      const chatId = update.channel_post.chat.id;
      saveChatId(chatId);
      if (update.channel_post.text && update.channel_post.text.startsWith('/')) {
        await handleCommandOrCallback(chatId, update.channel_post.text);
      }
    } else if (update.callback_query?.message?.chat?.id && update.callback_query.data) {
      const chatId = update.callback_query.message.chat.id;
      const cbData = update.callback_query.data;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: update.callback_query.id,
          text: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వివరాలు వస్తున్నాయి...',
        }),
      });
      await handleCommandOrCallback(chatId, cbData);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Telegram Webhook Error]:', err);
    return res.status(200).json({ ok: true });
  }
}
