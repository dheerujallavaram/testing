/**
 * Vercel / Cloud Run Serverless Function for 24/7 WhatsApp Cloud API Webhook
 * Endpoint: https://www.telugujyothisham.com/api/whatsapp-webhook
 */
import {
  getWhatsAppConfig,
  handleIncomingWhatsAppMessage,
} from '../scripts/whatsappBot';

export default async function handler(req: any, res: any) {
  const config = getWhatsAppConfig();

  // 1. Meta Webhook Verification (GET request during Webhook Setup)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.verifyToken) {
      console.log('✅ [WhatsApp Webhook Verified Successfully]');
      return res.status(200).send(challenge);
    } else {
      console.warn('❌ [WhatsApp Webhook Verification Failed: Token Mismatch]');
      return res.status(403).json({ error: 'Verification token mismatch' });
    }
  }

  // 2. Incoming WhatsApp Message or Button Click (POST request from Meta)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (body?.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
          const from = message.from; // User's WhatsApp phone number
          let incomingText = '';

          if (message.type === 'text') {
            incomingText = message.text?.body || '';
          } else if (message.type === 'interactive') {
            incomingText =
              message.interactive?.button_reply?.id ||
              message.interactive?.button_reply?.title ||
              '';
          }

          console.log(`📩 [WhatsApp Incoming] From: ${from}, Content: "${incomingText}"`);
          await handleIncomingWhatsAppMessage(from, incomingText);
        }

        return res.status(200).json({ status: 'EVENT_RECEIVED' });
      }

      return res.status(200).json({ status: 'IGNORED_NOT_WHATSAPP' });
    } catch (err: any) {
      console.error('[WhatsApp Webhook Handler Error]:', err);
      return res.status(200).json({ status: 'ERROR_LOGGED', error: err?.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
