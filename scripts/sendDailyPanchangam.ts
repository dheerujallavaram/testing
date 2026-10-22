import { WEEK_DATA } from '../src/data/panchangamData';
import { getTodayAndTomorrowIds, generateWhatsAppShareText } from '../src/utils/panchangaLogic';

async function run() {
  const { todayDay } = getTodayAndTomorrowIds(WEEK_DATA, new Date());
  const message = generateWhatsAppShareText(todayDay, 'https://telugujyothisham.com');

  console.log('=== TODAY PANCHANGAM WHATSAPP MESSAGE ===\n');
  console.log(message);
  console.log('\n=========================================');

  const phone = process.env.WHATSAPP_PHONE || '918977986166';
  const callMeBotKey = process.env.CALLMEBOT_API_KEY;
  const metaToken = process.env.META_WA_TOKEN;
  const metaPhoneId = process.env.META_PHONE_ID;

  // Option 1: Meta WhatsApp Cloud API (Official)
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

  // Option 2: CallMeBot Free Personal WhatsApp Webhook
  if (callMeBotKey) {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      phone
    )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(callMeBotKey)}`;
    const res = await fetch(url);
    const body = await res.text();
    console.log('CallMeBot WhatsApp API response:', body);
    return;
  }

  console.log(
    'Tip: Set CALLMEBOT_API_KEY or META_WA_TOKEN in GitHub Repository Secrets to automatically deliver this message to WhatsApp every morning at 6:00 AM IST.'
  );
}

run().catch((err) => {
  console.error('Error sending daily Panchangam:', err);
  process.exit(1);
});
