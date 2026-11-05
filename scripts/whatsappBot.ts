import { getTodayISTData } from './telegramBot';
import { generateWhatsAppShareText } from '../src/utils/panchangaLogic';

export interface WhatsAppConfig {
  metaToken?: string;
  metaPhoneId?: string;
  defaultRecipient?: string;
  callMeBotApiKey?: string;
  verifyToken?: string;
}

export function getWhatsAppConfig(): WhatsAppConfig {
  return {
    metaToken: process.env.META_WA_TOKEN,
    metaPhoneId: process.env.META_PHONE_ID,
    defaultRecipient: process.env.WHATSAPP_PHONE || '918977986166',
    callMeBotApiKey: process.env.CALLMEBOT_API_KEY,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'telugujyothisham_wa_verify_2026',
  };
}

/**
 * Sends a WhatsApp text message via Meta Official Cloud API or CallMeBot fallback
 */
export async function sendWhatsAppTextMessage(
  toPhone: string,
  messageText: string
): Promise<{ success: boolean; provider: string; data?: any; error?: string }> {
  const config = getWhatsAppConfig();
  const cleanPhone = toPhone.replace(/[^0-9]/g, '');

  // 1. Meta WhatsApp Cloud API (Official Business API)
  if (config.metaToken && config.metaPhoneId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${config.metaPhoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.metaToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: true,
            body: messageText,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('[WhatsApp Cloud API Error]:', data);
        return { success: false, provider: 'meta', error: JSON.stringify(data) };
      }
      return { success: true, provider: 'meta', data };
    } catch (err: any) {
      console.error('[WhatsApp Cloud API Exception]:', err);
      return { success: false, provider: 'meta', error: err?.message || String(err) };
    }
  }

  // 2. CallMeBot Personal WhatsApp API (Free instant personal alerts)
  if (config.callMeBotApiKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        cleanPhone
      )}&text=${encodeURIComponent(messageText)}&apikey=${encodeURIComponent(config.callMeBotApiKey)}`;
      const res = await fetch(url);
      const text = await res.text();
      return { success: res.ok, provider: 'callmebot', data: text };
    } catch (err: any) {
      console.error('[CallMeBot Exception]:', err);
      return { success: false, provider: 'callmebot', error: err?.message || String(err) };
    }
  }

  return {
    success: false,
    provider: 'none',
    error:
      'No WhatsApp credentials found. Configure META_WA_TOKEN + META_PHONE_ID or CALLMEBOT_API_KEY in environment variables.',
  };
}

/**
 * Sends an interactive WhatsApp button menu (Meta Cloud API only)
 */
export async function sendWhatsAppInteractiveMenu(
  toPhone: string,
  bodyText: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const config = getWhatsAppConfig();
  const cleanPhone = toPhone.replace(/[^0-9]/g, '');

  if (!config.metaToken || !config.metaPhoneId) {
    // Fall back to plain text menu
    const fallbackText = `${bodyText}\n\n1️⃣ పంచాంగం చూడండి (Type 1)\n2️⃣ ఉచిత జాతకం PDF (Type 2)\n3️⃣ శుభ ముహూర్తం (Type 3)\n4️⃣ పూజా సేవలు & సంప్రదింపు (Type 4)\n\n🌐 వెబ్‌సైట్: https://www.telugujyothisham.com`;
    return sendWhatsAppTextMessage(cleanPhone, fallbackText);
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${config.metaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.metaToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: bodyText,
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'btn_panchangam',
                  title: '📅 నేటి పంచాంగం',
                },
              },
              {
                type: 'reply',
                reply: {
                  id: 'btn_jathakam',
                  title: '📜 ఉచిత జాతకం PDF',
                },
              },
              {
                type: 'reply',
                reply: {
                  id: 'btn_muhurtham',
                  title: '✨ శుభ ముహూర్తం',
                },
              },
            ],
          },
        },
      }),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Handles incoming WhatsApp messages and returns appropriate automated responses
 */
export async function handleIncomingWhatsAppMessage(
  fromPhone: string,
  rawText: string
): Promise<void> {
  const text = (rawText || '').trim().toLowerCase();
  const { day } = getTodayISTData();

  // 1. Panchangam Request
  if (
    text.includes('panchangam') ||
    text.includes('పంచాంగం') ||
    text === '1' ||
    text === 'btn_panchangam'
  ) {
    const panchangamText = generateWhatsAppShareText(day, 'https://www.telugujyothisham.com/panchangam');
    await sendWhatsAppTextMessage(fromPhone, panchangamText);
    return;
  }

  // 2. Jathakam / Kundali Request
  if (
    text.includes('jathakam') ||
    text.includes('kundali') ||
    text.includes('జాతకం') ||
    text.includes('కుండలి') ||
    text === '2' ||
    text === 'btn_jathakam'
  ) {
    const jathakamMsg = [
      '📜 *ఉచిత 30-పేజీల తెలుగు జన్మ కుండలి & జాతక మహాగ్రంథం PDF*',
      'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం (telugujyothisham.com)',
      '',
      'మీ పుట్టిన తేదీ, సమయం మరియు పుట్టిన ఊరు నమోదు చేసి సంపూర్ణ జాతకాన్ని ఉచితంగా పొందండి:',
      '👉 https://www.telugujyothisham.com/janma-kundali',
      '',
      '✨ *విశేషాలు:*',
      '• 30-పేజీల ఏకైక పేజీ లేఅవుట్ (Single-Column Elegant PDF)',
      '• లగ్న, రాశి, నవాంశ చక్రాలు & తార పంచకములు',
      '• వింశోత్తరీ మహర్దశ – అంతర్దశ కాలావధులు',
      '• నాడీ గోచార సంచార రహస్య సూత్రాలు',
      '• ఆయురారోగ్య, వివాహ, ధన ప్రాప్తి శాస్త్రీయ పరిహారాలు',
      '',
      '🙏 శ్రీ గురుభ్యో నమః',
    ].join('\n');
    await sendWhatsAppTextMessage(fromPhone, jathakamMsg);
    return;
  }

  // 3. Muhurtham Request
  if (
    text.includes('muhurtham') ||
    text.includes('ముహూర్తం') ||
    text === '3' ||
    text === 'btn_muhurtham'
  ) {
    const muhurthamMsg = [
      '✨ *వేద మహర్షుల శాస్త్ర ప్రమాణ శుభ ముహూర్త నిర్ణయం*',
      '',
      'వివాహం, గృహ ప్రవేశం, నూతన వ్యాపారం, వాహనం, బంగారం కొనుగోలు మరియు 50+ శుభకార్యాల ముహూర్త నిర్ణయం కోసం క్రింది లింక్ చూడండి:',
      '👉 https://www.telugujyothisham.com/muhurtham',
      '',
      '🌟 *ప్రత్యేకతలు:*',
      '• వివాహ ఏకవింశతి (21) మహా దోషాలు & పరిహారాలు',
      '• శివ ముహూర్త చక్రం (సత్వ, రజో, తమో గుణ కాలాలు)',
      '• పంచభూత తత్త్వ సూక్ష్మ ముహూర్త గణితం',
      '• అభిజిత్ ముహూర్తం & ఉషఃకాల బ్రహ్మ ముహూర్తం',
      '',
      '📞 వ్యక్తిగత ముహూర్త నిర్ణయం కొరకు: +91 8977986166',
    ].join('\n');
    await sendWhatsAppTextMessage(fromPhone, muhurthamMsg);
    return;
  }

  // 4. Pooja / Contact Request
  if (
    text.includes('pooja') ||
    text.includes('పూజ') ||
    text.includes('consult') ||
    text.includes('booking') ||
    text === '4'
  ) {
    const poojaMsg = [
      '🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • పూజా & సంప్రదింపు సేవలు*',
      'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
      '',
      '• ప్రత్యక్ష & ఆన్‌లైన్ (Zoom/Google Meet) హోమాలు & పూజలు',
      '• వివాహ పొంతన & జాతక పరిశీలన',
      '• వాస్తు పరిశీలన & దోష నివారణ పూజలు',
      '',
      '📞 *నేరుగా మాట్లాడండి:* +91 8977986166',
      '🌐 *ఆన్‌లైన్ బుకింగ్:* https://www.telugujyothisham.com/services',
    ].join('\n');
    await sendWhatsAppTextMessage(fromPhone, poojaMsg);
    return;
  }

  // 5. Kartika Masam Ekavara Rudrabhishekam
  if (
    text.includes('kartika') ||
    text.includes('rudra') ||
    text.includes('కార్తీక') ||
    text.includes('రుద్ర') ||
    text.includes('అభిషేకం') ||
    text === '5' ||
    text === 'btn_kartika'
  ) {
    const kartikaMsg = [
      '🔱 *కార్తీక మాస పవిత్ర ఏకవార రుద్రాభిషేకం & పవిత్ర ప్రసాదం*',
      'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం • బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
      '',
      'నెల రోజుల పాటు భక్తుల గోత్రనామాలతో శ్రీ పరమేశ్వరునికి నిత్య ఏకవార రుద్రాభిషేకం నిర్వహింపబడును.',
      '',
      '🎁 *పవిత్ర ప్రసాదం (స్పీడ్ పోస్ట్ ద్వారా ఇంటికి ఉచితం):*',
      '• స్వామివారి దివ్య విభూతి',
      '• పరమ పవిత్ర చందనం/గంధం',
      '• కాశీ విశ్వనాథుని సన్నిధి నుండి తెచ్చిన కాలభైరవ రక్షా సూత్రం',
      '',
      '💰 *దక్షిణ:* ₹2,500/- (నెల రోజులకు కలిపి)',
      '🏦 *అధికారిక UPI ID:* 7013079166@kotakbank (Kotak Mahindra Bank)',
      '',
      '👉 *ఆన్‌లైన్ గోత్రనామాల నమోదు:* https://www.telugujyothisham.com/kartika-abhishekam',
      '📞 *సంప్రదించండి:* +91 8977986166',
    ].join('\n');
    await sendWhatsAppTextMessage(fromPhone, kartikaMsg);
    return;
  }

  // Default / Welcome Greeting Menu
  const welcomeText = [
    '🙏 *నమస్కారం! శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం వాట్సాప్ సేవలకు స్వాగతం!*',
    'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి అధికారిక వేదిక.',
    '',
    'మీకు ఏ సమాచారం కావాలో క్రింది సంఖ్యను టైప్ చేసి పంపండి లేదా బటన్ క్లిక్ చేయండి:',
    '',
    '1️⃣ *నేటి పంచాంగం* (Today Panchangam)',
    '2️⃣ *ఉచిత 30-పేజీల జాతకం PDF* (Free Kundali PDF)',
    '3️⃣ *శుభ ముహూర్తం* (Auspicious Muhurtham)',
    '4️⃣ *పూజా సేవలు & సంప్రదింపు* (Pooja & Consultation)',
    '5️⃣ *కార్తీక మాస రుద్రాభిషేకం* (Kartika Rudrabhishekam)',
    '',
    '🌐 వెబ్‌సైట్: https://www.telugujyothisham.com',
  ].join('\n');

  await sendWhatsAppInteractiveMenu(fromPhone, welcomeText);
}
