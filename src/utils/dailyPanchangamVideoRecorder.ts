import { DayData } from '../types/panchangam';
import { Language, translatePanchangamString } from '../context/LanguageContext';
import { getDailyRashiFortunes, RashiDailyFortune } from './panchangaLogic';

export interface DailyReelResult {
  blob: Blob;
  url: string;
  filename: string;
  mimeType: string;
  durationSec: number;
}

export interface SubhashithamVideoItem {
  id: number;
  category: string;
  themeTe: string;
  themeEn: string;
  slokamTe: string;
  slokamEn: string;
  meaningTe: string;
  meaningEn: string;
  loukikaQuoteTe: string;
  loukikaQuoteEn: string;
}

export interface DailyVideoSocialPack {
  youtubeTitle: string;
  caption: string;
  hashtags: string;
  fullPostText: string;
}

/**
 * Deterministically picks the Spotlight Rashi of the Day (0..11) rotating day-by-day
 * (Day 1 = Mesha, Day 2 = Vrushabha, ...), or uses the admin-selected spotlightRashiId override.
 */
export function getSpotlightRashiIndex(
  day: DayData,
  rashis: RashiDailyFortune[],
  spotlightRashiId?: string
): number {
  if (spotlightRashiId && spotlightRashiId !== 'auto') {
    const foundIdx = rashis.findIndex((r) => r.id === spotlightRashiId);
    if (foundIdx >= 0) return foundIdx;
  }
  if (day.isoDate) {
    const parts = day.isoDate.split('-').map(Number);
    if (parts.length === 3 && !Number.isNaN(parts[0])) {
      const utcDays = Math.floor(Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86_400_000);
      return ((utcDays % 12) + 12) % 12;
    }
  }
  const fallbackNum = Number((day.id || '').replace(/\D+/g, '')) || 1;
  return ((fallbackNum - 1) % 12 + 12) % 12;
}

/**
 * Generates Admin-only Daily YouTube Shorts / Instagram Reels / WhatsApp Status
 * Title, Description Caption (with site services) & Trending Hashtags.
 */
export function generateDailyVideoSocialPack(
  day: DayData,
  kind: 'panchangam' | 'rashi',
  lang: Language = 'te',
  spotlightRashiId?: string
): DailyVideoSocialPack {
  const tr = (val: string) => (lang === 'en' ? translatePanchangamString(val, 'en') : val);
  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;
  const cleanMasam = day.panchanga.masam.split('(')[0]?.trim() || day.panchanga.masam;

  const nakshatraTag = cleanNakshatra.replace(/\s+/g, '');
  const masamTag = cleanMasam.replace(/\s+/g, '');

  const hashtagsList = [
    '#TeluguPanchangam',
    '#NetiPanchangam',
    '#RashiPhalalu',
    '#TeluguJyothisham',
    '#DailyHoroscopeTelugu',
    '#DinaPhalalu',
    '#TodayPanchangam',
    '#TeluguAstrology',
    '#SriLakshmiGanapathiJyothishalayam',
    '#SaiDheerajSharma',
    '#Jathakam',
    '#JanmaKundali',
    '#VivahaPonthana',
    '#ShubhaMuhurtham',
    '#RahuKalam',
    '#AmruthaGadiyalu',
    '#MeshaRashi',
    '#VrushabhaRashi',
    '#MithunaRashi',
    '#KarkatakaRashi',
    '#SimhaRashi',
    '#KanyaRashi',
    '#TulaRashi',
    '#VruschikaRashi',
    '#DhanussuRashi',
    '#MakaraRashi',
    '#KumbhaRashi',
    '#MeenaRashi',
    '#TeluguShorts',
    '#TeluguReels',
    '#WhatsAppStatusTelugu',
    '#AstrologerHyderabad',
    '#BestAstrologerInHyderabad',
    '#HyderabadAstrologerTelugu',
    '#FamousAstrologerHyderabad',
    '#VedicAstrologerHyderabad',
    '#TeluguAstrologerHyderabad',
    '#HyderabadPanchangam',
    '#Bhakti',
    '#SanatanaDharma',
    nakshatraTag ? `#${nakshatraTag}` : '',
    masamTag ? `#${masamTag}` : '',
  ].filter(Boolean);

  const hashtags = hashtagsList.join(' ');

  if (kind === 'panchangam') {
    const youtubeTitle =
      lang === 'en'
        ? `Today Telugu Panchangam (${tr(day.teediVaram)}) | Tithi: ${tr(cleanTithi)} • Star: ${tr(cleanNakshatra)} | www.telugujyothisham.com #Shorts`
        : `నేటి తెలుగు పంచాంగం (${day.teediVaram}) | తిథి: ${cleanTithi} • నక్షత్రం: ${cleanNakshatra} | www.telugujyothisham.com #Shorts`;

    const caption =
      lang === 'en'
        ? [
            `🕉️ OM SRI LAKSHMI GANAPATAYE NAMAHA 🙏`,
            `📅 Today Drik Siddhanta Telugu Panchangam — ${tr(day.teediVaram)} (${tr(day.panchanga.samvatsaram)})`,
            ``,
            `🌙 Tithi: ${tr(day.panchanga.tithi)}`,
            `⭐ Nakshatram: ${tr(day.panchanga.nakshatram)}`,
            `✨ Yogam: ${tr(day.panchanga.yogam)} | Karanam: ${tr(day.panchanga.karanam)}`,
            `✅ Amrutha Gadiyalu: ${tr(day.shubha.amrutha)}`,
            `✅ Abhijit Muhurtham: ${tr(day.shubha.abhijit)}`,
            `⚠️ Rahu Kalam: ${tr(day.ashubha.rahukalam)} | Yamagandam: ${tr(day.ashubha.yamagandam)}`,
            `🎨 Lucky Color: ${tr(day.luckyColor)} | Deity: ${tr(day.deity)}`,
            ``,
            `🌟 OUR VEDIC ASTROLOGY SERVICES (www.telugujyothisham.com):`,
            `• 37-Chapter Complete Brihat Jataka Kundali (100+ Page PDF)`,
            `• Authentic Marriage Compatibility (36-Guna Ashtakoota & Nadi Milan)`,
            `• Auspicious Muhurtham Fixing (Marriage, Gruhapravesham, Business, Namakaranam)`,
            `• Graha Dosha Remedies, Vastu & Gemstone Guidance`,
            ``,
            `⏱️ KEY MOMENTS (Chapters):`,
            `00:00 Today Telugu Panchangam Intro`,
            `00:05 Today Tithi, Nakshatram, Yogam & Karanam`,
            `00:13 Abhijit Muhurtham, Amrutha Gadiyalu & Rahukalam`,
            `00:24 Free 37-Chapter Janma Kundali & Hyderabad Consultation`,
            ``,
            `🙏 Brahmasri Jallavaram Sai Dheeraj Sharma Garu (Hyderabad)`,
            `📞 WhatsApp Consultation: +91 89779 86166`,
            `🌐 Visit Website: https://www.telugujyothisham.com`,
          ].join('\n')
        : [
            `🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః 🙏`,
            `📅 నేటి దృక్సిద్ధాంత తెలుగు పంచాంగం — ${day.teediVaram} (${day.panchanga.samvatsaram})`,
            ``,
            `🌙 తిథి: ${day.panchanga.tithi}`,
            `⭐ నక్షత్రం: ${day.panchanga.nakshatram}`,
            `✨ యోగం: ${day.panchanga.yogam} | కరణం: ${day.panchanga.karanam}`,
            `✅ అమృత ఘడియలు: ${day.shubha.amrutha}`,
            `✅ అభిజిత్ ముహూర్తం: ${day.shubha.abhijit}`,
            `⚠️ రాహుకాలం: ${day.ashubha.rahukalam} | యమగండం: ${day.ashubha.yamagandam}`,
            `🎨 నేటి శుభ రంగు: ${day.luckyColor} | ఆరాధ్య దైవం: ${day.deity}`,
            ``,
            `🌟 శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — మా ప్రత్యేక సేవలు (www.telugujyothisham.com):`,
            `✅ 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF రిపోర్ట్)`,
            `✅ శాస్త్రోక్త వివాహ పొంతన (36 గుణముల అష్టకూట & నాడీ పరిశీలన)`,
            `✅ శుభ ముహూర్త నిర్ణయం (వివాహం, గృహప్రవేశం, వ్యాపారం, నామకరణం)`,
            `✅ గ్రహ దోష నివారణ పరిహారాలు, రత్న ధారణ & వాస్తు సలహాలు`,
            ``,
            `⏱️ వీడియో అధ్యాయాలు (Key Moments):`,
            `00:00 నేటి తెలుగు పంచాంగం పరిచయం`,
            `00:05 నేటి తిథి, నక్షత్రం, యోగం & కరణం వివరాలు`,
            `00:13 అభిజిత్ ముహూర్తం, అమృత ఘడియలు & రాహుకాలం`,
            `00:24 ఉచిత జాతక కుండలి PDF & హైదరాబాద్ జ్యోతిష సేవలు`,
            ``,
            `🙏 బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (హైదరాబాద్)`,
            `📞 వ్యక్తిగత సంప్రదింపులకు WhatsApp: +91 89779 86166`,
            `🌐 వెబ్‌సైట్: https://www.telugujyothisham.com`,
          ].join('\n');

    return {
      youtubeTitle,
      caption,
      hashtags,
      fullPostText: `${youtubeTitle}\n\n${caption}\n\n${hashtags}`,
    };
  }

  // 12-Rashi Predictions Social Pack with Daily Spotlight Rashi Full Prediction + Website Traffic Hook
  const rashis = getDailyRashiFortunes(day);
  const spotIdx = getSpotlightRashiIndex(day, rashis, spotlightRashiId);
  const spot = rashis[spotIdx] || rashis[0];

  const rashiBriefLines = rashis
    .map((r, idx) =>
      lang === 'en'
        ? `${r.symbol} ${r.englishName} (${r.teluguName}): ${r.statusLabelEn} • Lucky #${r.luckyNumber}${
            idx === spotIdx ? ' ⭐ (Full Prediction in Video!)' : ' (Full Details on Website)'
          }`
        : `${r.symbol} ${r.teluguName} రాశి: ${r.statusLabel} • శుభ సంఖ్య #${r.luckyNumber}${
            idx === spotIdx ? ' ⭐ (పూర్తి ఫలితం ఈ వీడియోలో!)' : ' (పూర్తి విశ్లేషణ మన వెబ్‌సైట్‌లో)'
          }`
    )
    .join('\n');

  const youtubeTitle =
    lang === 'en'
      ? `Today 12 Rashi Phalalu (${tr(day.teediVaram)}) | 🌟 ${spot.englishName} Full Prediction + All 12 Signs | www.telugujyothisham.com #Shorts`
      : `నేటి ద్వాదశ రాశి ఫలాలు (${day.teediVaram}) | 🌟 నేటి విశేష రాశి: ${spot.teluguName} రాశి పూర్తి ఫలితం + 12 రాశులు | www.telugujyothisham.com #Shorts`;

  const caption =
    lang === 'en'
      ? [
          `🕉️ OM SRI LAKSHMI GANAPATAYE NAMAHA 🙏`,
          `🌟 Today 12 Rashi Phalalu (Daily Horoscope) — ${tr(day.teediVaram)}`,
          `🌙 Star: ${tr(cleanNakshatra)} • Tithi: ${tr(cleanTithi)}`,
          ``,
          `🔥 TODAY'S SPOTLIGHT RASHI FULL PREDICTION: ${spot.symbol} ${spot.englishName} (${spot.teluguName})`,
          `• Status: ${spot.statusLabelEn} | Ruler: ${spot.lordEn}`,
          `• Summary: ${spot.englishFullSummary.replace(/\n+/g, ' ')}`,
          `• Lucky Color: ${spot.luckyColorEn} | Lucky Number: #${spot.luckyNumber}`,
          `• Vedic Remedy: ${spot.remedyEn}`,
          ``,
          `📋 ALL 12 RASHIS QUICK STATUS TODAY:`,
          rashiBriefLines,
          ``,
          `👉 Want the FULL Career, Wealth, Family & Remedy prediction for YOUR Rashi just like ${spot.englishName}?`,
          `🌐 Open our website right now: https://www.telugujyothisham.com`,
          ``,
          `🌟 OUR VEDIC ASTROLOGY SERVICES (www.telugujyothisham.com):`,
          `• 37-Chapter Complete Brihat Jataka Kundali (100+ Page PDF)`,
          `• Authentic Marriage Compatibility (36-Guna Ashtakoota & Nadi Milan)`,
          `• Auspicious Muhurtham Fixing (Marriage, Gruhapravesham, Business, Namakaranam)`,
          `• Graha Dosha Remedies, Vastu & Gemstone Guidance`,
          ``,
          `⏱️ KEY MOMENTS (Chapters):`,
          `00:00 Today 12 Rashi Phalalu Horoscope Intro`,
          `00:06 ${spot.englishName} (${spot.teluguName}) Complete Horoscope Prediction`,
          `00:24 Mesham to Kanya Daily Rashi Phalalu Summary`,
          `00:37 Tula to Meenam Daily Rashi Phalalu Summary`,
          `00:50 Full Website Rashi Phalalu & Free Jathakam PDF`,
          ``,
          `🙏 Brahmasri Jallavaram Sai Dheeraj Sharma Garu (Hyderabad)`,
          `📞 WhatsApp Consultation: +91 89779 86166`,
          `🌐 Visit Website: https://www.telugujyothisham.com`,
        ].join('\n')
      : [
          `🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః 🙏`,
          `🌟 నేటి ద్వాదశ రాశి ఫలాలు (12 రాశుల దిన ఫలం) — ${day.teediVaram}`,
          `🌙 నక్షత్రం: ${cleanNakshatra} • తిథి: ${cleanTithi}`,
          ``,
          `🔥 నేటి విశేష రాశి (సంపూర్ణ వెబ్‌సైట్ ఫలితం): ${spot.symbol} ${spot.teluguName} రాశి (${spot.englishName})`,
          `• ఫలిత స్థాయి: ${spot.statusLabel} | రాశ్యాధిపతి: ${spot.lord}`,
          `• 💼 వృత్తి & ఉద్యోగం: ${spot.careerFinanceLine}`,
          `• 💰 ఆర్థికం & వ్యాపారం: ${spot.wealthBusinessLine}`,
          `• 👨‍👩‍👧‍👦 కుటుంబం & ఆరోగ్యం: ${spot.familyHealthLine}`,
          `• 🔭 నేడు చేయవలసిన పని: ${spot.doTodayTe} (${spot.luckyTimeWindowTe})`,
          `• 🎨 శుభ రంగు: ${spot.luckyColor} | 🔢 అదృష్ట సంఖ్య: #${spot.luckyNumber}`,
          `• 🙏 నేటి పరిహారం: ${spot.remedy}`,
          ``,
          `📋 నేటి 12 రాశుల సంక్షిప్త ఫలితాలు:`,
          rashiBriefLines,
          ``,
          `🔥 ${spot.teluguName} రాశి లాగే మిగతా 11 రాశుల వారి పూర్తి కెరీర్, ధన యోగం, కుటుంబం & పరిహారాలు మన వెబ్‌సైట్ లో సిద్ధంగా ఉన్నాయి!`,
          `🌐 ఇప్పుడే మీ రాశి పూర్తి ఫలితం కోసం ఓపెన్ చేయండి: https://www.telugujyothisham.com`,
          ``,
          `🌟 శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — మా ప్రత్యేక సేవలు (www.telugujyothisham.com):`,
          `✅ 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF రిపోర్ట్)`,
          `✅ శాస్త్రోక్త వివాహ పొంతన (36 గుణముల అష్టకూట & నాడీ పరిశీలన)`,
          `✅ శుభ ముహూర్త నిర్ణయం (వివాహం, గృహప్రవేశం, వ్యాపారం, నామకరణం)`,
          `✅ గ్రహ దోష నివారణ పరిహారాలు, రత్న ధారణ & వాస్తు సలహాలు`,
          ``,
          `⏱️ వీడియో అధ్యాయాలు (Key Moments):`,
          `00:00 నేటి ద్వాదశ రాశి ఫలాలు పరిచయం`,
          `00:06 ${spot.teluguName} రాశి సంపూర్ణ ఫలితాలు & పరిహారం`,
          `00:24 మేషం నుండి కన్య రాశి వరకు సంక్షిప్త ఫలాలు`,
          `00:37 తుల నుండి మీన రాశి వరకు సంక్షిప్త ఫలాలు`,
          `00:50 పూర్తి 12 రాశుల ఫలితాలు & ఉచిత జాతక కుండలి PDF`,
          ``,
          `🙏 బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (హైదరాబాద్)`,
          `📞 వ్యక్తిగత సంప్రదింపులకు WhatsApp: +91 89779 86166`,
          `🌐 వెబ్‌సైట్: https://www.telugujyothisham.com`,
        ].join('\n');

  return {
    youtubeTitle,
    caption,
    hashtags,
    fullPostText: `${youtubeTitle}\n\n${caption}\n\n${hashtags}`,
  };
}

/**
 * Generates Admin-only Daily Subhashitham / Quote Video Social Pack (Title, Caption & Hashtags)
 */
export function generateSubhashithamSocialPack(
  item: SubhashithamVideoItem,
  langMode: 'te' | 'en' | 'both' = 'te'
): DailyVideoSocialPack {
  const youtubeTitle =
    langMode === 'en'
      ? `Daily Sanskrit Subhashitham & Life Quote (#${item.id}: ${item.themeEn}) | www.telugujyothisham.com #Shorts`
      : `నేటి సుభాషిత శ్లోకం & జీవన సూత్రం (#${item.id}: ${item.themeTe}) | www.telugujyothisham.com #Shorts`;

  const hashtags = [
    '#TeluguSubhashitham',
    '#NetiSubhashitham',
    '#TeluguQuotes',
    '#MotivationalQuotesTelugu',
    '#SanskritSloka',
    '#LifeQuotesTelugu',
    '#TeluguJyothisham',
    '#SriLakshmiGanapathiJyothishalayam',
    '#SaiDheerajSharma',
    '#SanatanaDharma',
    '#VedicWisdom',
    '#DailyMotivationTelugu',
    '#TeluguShorts',
    '#TeluguReels',
    '#WhatsAppStatusTelugu',
    '#SuccessMindset',
    '#Bhakti',
  ].join(' ');

  const caption =
    langMode === 'en'
      ? [
          `🕉️ OM SRI LAKSHMI GANAPATAYE NAMAHA 🙏`,
          `✨ Daily Vedic Wisdom & Practical Life Quote — ${item.themeEn}`,
          ``,
          `📜 Sanskrit Sloka:`,
          item.slokamEn,
          ``,
          `💡 Meaning: ${item.meaningEn}`,
          ``,
          `🌟 Practical Takeaway for Today:`,
          item.loukikaQuoteEn,
          ``,
          `🌟 OUR VEDIC ASTROLOGY SERVICES (www.telugujyothisham.com):`,
          `• 37-Chapter Complete Brihat Jataka Kundali (100+ Page PDF)`,
          `• Authentic Marriage Compatibility & Shubha Muhurtham`,
          `📞 WhatsApp Consultation: +91 89779 86166`,
          `🌐 Website: https://www.telugujyothisham.com`,
        ].join('\n')
      : [
          `🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః 🙏`,
          `✨ నేటి సుభాషిత శ్లోకం & లౌకిక జీవన సందేశం — ${item.themeTe}`,
          ``,
          `📜 మూల శ్లోకం:`,
          item.slokamTe,
          ``,
          `💡 సరళ భావం: ${item.meaningTe}`,
          ``,
          `🌟 నేటి తరానికి లౌకిక సందేశం:`,
          item.loukikaQuoteTe,
          ``,
          `🌟 శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — మా ప్రత్యేక సేవలు (www.telugujyothisham.com):`,
          `✅ 37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF)`,
          `✅ శాస్త్రోక్త వివాహ పొంతన & శుభ ముహూర్త నిర్ణయం`,
          `✅ గ్రహ దోష నివారణ పరిహారాలు, రత్న ధారణ & వాస్తు సలహాలు`,
          `🙏 బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు (హైదరాబాద్)`,
          `📞 WhatsApp: +91 89779 86166 | 🌐 https://www.telugujyothisham.com`,
        ].join('\n');

  return {
    youtubeTitle,
    caption,
    hashtags,
    fullPostText: `${youtubeTitle}\n\n${caption}\n\n${hashtags}`,
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Bulletproof single-line centered text that automatically shrinks font size
 * so it NEVER overflows or gets clipped on the right edge.
 */
function drawLeftCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  boxX: number,
  boxW: number,
  y: number,
  pad = 28
) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  const safeMaxW = Math.max(60, (boxW - pad * 2) * 0.94);

  // Parse current font size and auto-shrink if needed
  const currentFont = ctx.font;
  const sizeMatch = currentFont.match(/(\d+(?:\.\d+)?)px/);
  if (sizeMatch) {
    let px = parseFloat(sizeMatch[1]);
    while (px > 16 && ctx.measureText(text).width > safeMaxW) {
      px -= 1.5;
      ctx.font = currentFont.replace(/(\d+(?:\.\d+)?)px/, `${Math.round(px)}px`);
    }
  }

  const measured = ctx.measureText(text).width;
  const startX = boxX + Math.max(pad, (boxW - measured) / 2);
  ctx.fillText(text, startX, y);
  ctx.restore();
}

/**
 * Bulletproof left-aligned single-line text that automatically shrinks font size
 * so it NEVER touches or crosses the right border of a card.
 */
function drawAutoFitLeftText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  minPx = 18
) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  const safeW = Math.max(60, maxWidth * 0.94);
  const currentFont = ctx.font;
  const sizeMatch = currentFont.match(/(\d+(?:\.\d+)?)px/);
  if (sizeMatch) {
    let px = parseFloat(sizeMatch[1]);
    while (px > minPx && ctx.measureText(text).width > safeW) {
      px -= 1.5;
      ctx.font = currentFont.replace(/(\d+(?:\.\d+)?)px/, `${Math.round(px)}px`);
    }
  }
  ctx.fillText(text, x, y);
  ctx.restore();
}

/**
 * Splits text into wrapped lines for the current ctx.font within safeWidth.
 */
function computeWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  safeWidth: number
): string[] {
  const paragraphs = text.trim().split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > safeWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
}

/**
 * Bulletproof multi-line text renderer that automatically wraps AND shrinks font size
 * until 100% of the text fits inside maxHeight & maxWidth with ZERO cutoff and ZERO '...' truncation!
 */
function drawFullFitWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
  baseFontPx: number,
  fontWeight = 'bold',
  fontFamily = '"Noto Serif Telugu", serif',
  minFontPx = 19,
  centerAlign = false,
  centerX = 540
): number {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';

  // Use a 93% width safety factor so Telugu conjuncts & punctuation never touch the right border
  const safeW = Math.max(80, maxWidth * 0.93);
  let fontPx = baseFontPx;
  let lineHeight = Math.round(fontPx * 1.36);
  let lines: string[] = [];

  while (fontPx >= minFontPx) {
    ctx.font = `${fontWeight} ${fontPx}px ${fontFamily}`;
    lineHeight = Math.round(fontPx * 1.36);
    lines = computeWrappedLines(ctx, text, safeW);
    if (lines.length * lineHeight <= maxHeight) {
      break;
    }
    fontPx -= 1.5;
  }

  let curY = y;
  for (const ln of lines) {
    // Secondary check: if a single long token is wider than safeW, shrink just for that line
    ctx.font = `${fontWeight} ${Math.round(fontPx)}px ${fontFamily}`;
    let linePx = fontPx;
    while (linePx > 16 && ctx.measureText(ln).width > safeW) {
      linePx -= 1;
      ctx.font = `${fontWeight} ${Math.round(linePx)}px ${fontFamily}`;
    }

    if (centerAlign) {
      const w = ctx.measureText(ln).width;
      const startX = Math.max(x, Math.round(centerX - w / 2));
      ctx.fillText(ln, startX, curY);
    } else {
      ctx.fillText(ln, x, curY);
    }
    curY += lineHeight;
  }

  ctx.restore();
  return curY;
}

function easeOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
}

/**
 * SCENE 0 (Intro): Grand Animated Brand & Website Intro
 */
function renderAnimatedBrandIntro(
  ctx: CanvasRenderingContext2D,
  dayLabelTe: string,
  subHeaderTe: string,
  lang: Language,
  localProgress: number,
  kind: 'panchangam' | 'rashi' | 'quote'
) {
  const W = 1080;
  const scaleIn = easeOutCubic(Math.min(1, localProgress / 0.35));
  const textReveal = easeOutCubic(Math.max(0, Math.min(1, (localProgress - 0.12) / 0.4)));
  const urlReveal = easeOutCubic(Math.max(0, Math.min(1, (localProgress - 0.28) / 0.42)));
  const fadeOut = localProgress > 0.9 ? 1 - (localProgress - 0.9) / 0.1 : 1;

  ctx.save();
  ctx.globalAlpha = Math.max(0.1, fadeOut);

  // Glowing rotating golden chakra behind the Om emblem
  ctx.save();
  ctx.translate(W / 2, 520);
  ctx.rotate(localProgress * Math.PI * 0.9);
  const pulseRadius = 205 + Math.sin(localProgress * Math.PI * 4) * 14;
  const radialGlow = ctx.createRadialGradient(0, 0, 30, 0, 0, pulseRadius * 1.4);
  radialGlow.addColorStop(0, 'rgba(251, 191, 36, 0.42)');
  radialGlow.addColorStop(0.6, 'rgba(217, 119, 6, 0.14)');
  radialGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');
  ctx.fillStyle = radialGlow;
  ctx.beginPath();
  ctx.arc(0, 0, pulseRadius * 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
  ctx.lineWidth = 4;
  for (let r = 1; r <= 3; r++) {
    ctx.beginPath();
    ctx.arc(0, 0, r * 85 * scaleIn, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 85 * scaleIn, Math.sin(a) * 85 * scaleIn);
    ctx.lineTo(Math.cos(a) * 255 * scaleIn, Math.sin(a) * 255 * scaleIn);
    ctx.stroke();
  }
  ctx.restore();

  // Central Royal Om Medallion
  const omSize = 200 * scaleIn;
  drawRoundedRect(ctx, W / 2 - omSize / 2, 520 - omSize / 2, omSize, omSize, 46);
  const omGrad = ctx.createLinearGradient(W / 2 - 100, 420, W / 2 + 100, 620);
  omGrad.addColorStop(0, '#fef08a');
  omGrad.addColorStop(0.5, '#f59e0b');
  omGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = omGrad;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#2a0702';
  ctx.font = `bold ${Math.round(108 * scaleIn)}px serif`;
  drawLeftCenteredText(ctx, 'ॐ', W / 2 - omSize / 2, omSize, 520 + 36 * scaleIn, 10);

  // Temple Invocation & Peetham Title
  ctx.save();
  ctx.globalAlpha = textReveal * fadeOut;
  ctx.translate(0, (1 - textReveal) * 35);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 32px "Noto Serif Telugu", serif';
  drawLeftCenteredText(
    ctx,
    lang === 'en' ? '🕉️ OM SRI LAKSHMI GANAPATAYE NAMAHA 🕉️' : '🕉️ ఓం శ్రీలక్ష్మి గణపతయే నమః 🕉️',
    76,
    W - 152,
    740,
    24
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px "Noto Serif Telugu", serif';
  drawLeftCenteredText(
    ctx,
    lang === 'en' ? 'Sri Lakshmi Ganapathi Jyothishalayam' : 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    76,
    W - 152,
    825,
    24
  );

  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 32px "Noto Serif Telugu", sans-serif';
  drawLeftCenteredText(
    ctx,
    lang === 'en'
      ? 'Brahmasri Jallavaram Sai Dheeraj Sharma Garu'
      : 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
    76,
    W - 152,
    895,
    24
  );
  ctx.restore();

  // Animated Website Name Banner (Shimmering Gold Pill)
  ctx.save();
  ctx.globalAlpha = urlReveal * fadeOut;
  const pillW = (W - 152) * (0.78 + 0.22 * urlReveal);
  const pillX = (W - pillW) / 2;
  drawRoundedRect(ctx, pillX, 965, pillW, 130, 65);
  const urlGrad = ctx.createLinearGradient(pillX, 965, pillX + pillW, 1095);
  urlGrad.addColorStop(0, '#fde047');
  urlGrad.addColorStop(0.5, '#f59e0b');
  urlGrad.addColorStop(1, '#fde047');
  ctx.fillStyle = urlGrad;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 46px sans-serif';
  drawLeftCenteredText(ctx, '🌐 www.telugujyothisham.com', pillX, pillW, 1046, 28);

  // Today's Feature Card
  drawRoundedRect(ctx, 86, 1155, W - 172, 415, 36);
  ctx.fillStyle = 'rgba(255, 251, 235, 0.97)';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 31px "Noto Serif Telugu", sans-serif';
  drawLeftCenteredText(ctx, dayLabelTe, 106, W - 212, 1235, 24);

  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 44px "Noto Serif Telugu", serif';
  const mainHeading =
    kind === 'panchangam'
      ? lang === 'en'
        ? "TODAY'S TELUGU PANCHANGAM"
        : 'నేటి దృక్సిద్ధాంత తెలుగు పంచాంగం'
      : kind === 'rashi'
      ? lang === 'en'
        ? "TODAY'S 12 RASHI PHALALU"
        : 'నేటి ద్వాదశ రాశి ఫలాలు (12 రాశులు)'
      : lang === 'en'
      ? 'DAILY SUBHASHITHAM & LIFE QUOTE'
      : 'నేటి సుభాషిత శ్లోకం & జీవన సూత్రం';
  drawLeftCenteredText(ctx, mainHeading, 106, W - 212, 1325, 24);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 29px "Noto Serif Telugu", sans-serif';
  drawLeftCenteredText(ctx, subHeaderTe, 106, W - 212, 1410, 24);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 28px "Noto Serif Telugu", sans-serif';
  drawLeftCenteredText(
    ctx,
    '📞 సంప్రదింపులకు WhatsApp: +91 89779 86166',
    106,
    W - 212,
    1498,
    24
  );
  ctx.restore();
  ctx.restore();
}

/**
 * FINAL SCENE: Website Advertisement & Complete Services Showcase
 */
function renderAnimatedServicesOutro(
  ctx: CanvasRenderingContext2D,
  lang: Language,
  localProgress: number
) {
  const W = 1080;
  const fadeAlpha = localProgress < 0.08 ? easeOutCubic(localProgress / 0.08) : 1;

  ctx.save();
  ctx.globalAlpha = Math.max(0.15, fadeAlpha);

  drawRoundedRect(ctx, 76, 250, W - 152, 106, 28);
  const headGrad = ctx.createLinearGradient(76, 250, W - 76, 356);
  headGrad.addColorStop(0, '#fde047');
  headGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = headGrad;
  ctx.fill();

  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 36px "Noto Serif Telugu", serif';
  drawLeftCenteredText(
    ctx,
    lang === 'en'
      ? '🌟 OUR VEDIC ASTROLOGY SERVICES 🌟'
      : '🌟 మా జ్యోతిషాలయ ప్రత్యేక సేవలు 🌟',
    76,
    W - 152,
    316,
    24
  );

  const services =
    lang === 'en'
      ? [
          {
            icon: '📜',
            title: '37-Chapter Complete Janma Kundali (100+ Page PDF)',
            desc: 'Shodashavarga, Vimshottari Dasha, Yogas & Life Predictions',
          },
          {
            icon: '💑',
            title: 'Authentic Marriage Compatibility (Vivaha Milan)',
            desc: '36-Guna Ashtakoota, Kuja Dosha, Nadi & Rajju Verification',
          },
          {
            icon: '🏡',
            title: 'Auspicious Muhurtham Fixing',
            desc: 'Wedding, Gruhapravesham, New Business & Namakaranam',
          },
          {
            icon: '🔱',
            title: 'Graha Dosha Remedies & Shanti Poojas',
            desc: 'Rahu-Ketu, Kalasarpa, Shani & Kuja Dosha Vedic Pariharams',
          },
          {
            icon: '💎',
            title: 'Gemstone Recommendation & Vastu Guidance',
            desc: 'Lagna-Based Lucky Ratna Dharana & Home/Office Vastu',
          },
          {
            icon: '📅',
            title: 'Free Daily Telugu Panchangam & 12 Rashi Phalalu',
            desc: 'Live Tarabalam, Chandrabalam, Gowri & Hora Calculators',
          },
        ]
      : [
          {
            icon: '📜',
            title: '37-అధ్యాయాల సంపూర్ణ బృహత్ జాతక కుండలి (100+ పేజీల PDF)',
            desc: 'షోడశవర్గ చక్రాలు, వింశోత్తరి దశలు, రాజయోగాలు & జీవిత ఫలితాలు',
          },
          {
            icon: '💑',
            title: 'శాస్త్రోక్త వివాహ పొంతన (వధూవరుల గుణ మేళన)',
            desc: '36 గుణముల అష్టకూట, కుజ దోషం, నాడీ & రజ్జు పరిశీలన',
          },
          {
            icon: '🏡',
            title: 'శుభ ముహూర్త నిర్ణయం (బలమైన లగ్న ముహూర్తాలు)',
            desc: 'వివాహం, గృహప్రవేశం, నూతన వ్యాపారం, నామకరణం & అన్నప్రాశన',
          },
          {
            icon: '🔱',
            title: 'గ్రహ దోష నివారణ & శాస్త్రోక్త శాంతి పరిహారాలు',
            desc: 'కుజ, రాహు-కేతు, కాలసర్ప, ఏలినాటి శని దోష నివారణ మార్గాలు',
          },
          {
            icon: '💎',
            title: 'జాతక ఆధారిత రత్న ధారణ & వాస్తు సలహాలు',
            desc: 'మీ లగ్నానికి సరిపడే అదృష్ట రత్నం మరియు గృహ/వ్యాపార వాస్తు',
          },
          {
            icon: '📅',
            title: 'ప్రతిరోజూ ఉచిత దృక్సిద్ధాంత పంచాంగం & 12 రాశి ఫలాలు',
            desc: 'తారాబలం, చంద్రబలం, గౌరీ పంచాంగం & హోర కాలిక్యులేటర్లు',
          },
        ];

  let sy = 382;
  const cardW = W - 152;
  services.forEach((srv, idx) => {
    const itemProgress = easeOutCubic(
      Math.max(0, Math.min(1, (localProgress - idx * 0.05) / 0.25))
    );
    ctx.save();
    ctx.globalAlpha = fadeAlpha * itemProgress;
    ctx.translate((1 - itemProgress) * 28, 0);

    drawRoundedRect(ctx, 76, sy, cardW, 152, 24);
    ctx.fillStyle = '#fffbeb';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#9a3412';
    ctx.font = 'bold 29px "Noto Serif Telugu", serif';
    drawAutoFitLeftText(ctx, `${srv.icon}  ${srv.title}`, 106, sy + 56, cardW - 64, 20);

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
    drawAutoFitLeftText(ctx, srv.desc, 106, sy + 112, cardW - 64, 18);
    ctx.restore();

    sy += 168;
  });

  drawRoundedRect(ctx, 76, 1410, W - 152, 235, 34);
  const ctaGrad = ctx.createLinearGradient(76, 1410, W - 76, 1645);
  ctaGrad.addColorStop(0, '#fde047');
  ctaGrad.addColorStop(0.5, '#f59e0b');
  ctaGrad.addColorStop(1, '#fde047');
  ctx.fillStyle = ctaGrad;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#2a0702';
  ctx.font = 'bold 32px "Noto Serif Telugu", serif';
  drawLeftCenteredText(
    ctx,
    lang === 'en'
      ? 'Consult Brahmasri Jallavaram Sai Dheeraj Sharma Garu'
      : 'సంప్రదించండి: బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
    76,
    W - 152,
    1475,
    24
  );

  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 38px sans-serif';
  drawLeftCenteredText(ctx, '📞 WhatsApp / Call: +91 89779 86166', 76, W - 152, 1542, 24);

  ctx.fillStyle = '#1e0502';
  ctx.font = 'bold 42px sans-serif';
  drawLeftCenteredText(ctx, '🌐 www.telugujyothisham.com', 76, W - 152, 1612, 24);

  ctx.restore();
}

function drawCommonTopHeader(ctx: CanvasRenderingContext2D, lang: Language, subtitleTe: string, subtitleEn: string) {
  drawRoundedRect(ctx, 76, 80, 128, 128, 26);
  const omGrad = ctx.createLinearGradient(76, 80, 204, 208);
  omGrad.addColorStop(0, '#fde047');
  omGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = omGrad;
  ctx.fill();
  ctx.fillStyle = '#3b1103';
  ctx.font = 'bold 64px serif';
  drawLeftCenteredText(ctx, 'ॐ', 76, 128, 166, 10);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
  drawAutoFitLeftText(ctx, lang === 'en' ? subtitleEn : subtitleTe, 224, 114, 770, 18);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Noto Serif Telugu", serif';
  drawAutoFitLeftText(
    ctx,
    lang === 'en' ? 'Sri Lakshmi Ganapathi Jyothishalayam' : 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    224,
    166,
    770,
    24
  );

  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 23px "Noto Serif Telugu", sans-serif';
  drawAutoFitLeftText(
    ctx,
    lang === 'en'
      ? 'Brahmasri Jallavaram Sai Dheeraj Sharma'
      : 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు',
    224,
    204,
    770,
    18
  );
}

function renderReelFrame(
  ctx: CanvasRenderingContext2D,
  day: DayData,
  lang: Language,
  progress: number
) {
  const W = 1080;
  const H = 1920;
  const tr = (val: string) => (lang === 'en' ? translatePanchangamString(val, 'en') : val);

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2a0702');
  bg.addColorStop(0.22, '#5c1808');
  bg.addColorStop(0.55, '#3d1005');
  bg.addColorStop(1, '#1e0502');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(W / 2, 760);
  ctx.rotate(progress * Math.PI * 0.85);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
  ctx.lineWidth = 3;
  for (let ring = 1; ring <= 3; ring++) {
    ctx.beginPath();
    ctx.arc(0, 0, ring * 190, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 190, Math.sin(angle) * 190);
    ctx.lineTo(Math.cos(angle) * 570, Math.sin(angle) * 570);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 28, 28, W - 56, H - 56, 36);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.5)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 44, 44, W - 88, H - 88, 28);
  ctx.stroke();

  if (progress < 0.117) {
    renderAnimatedBrandIntro(
      ctx,
      `📅 ${tr(day.teediVaram)} • ${tr(day.panchanga.samvatsaram)}`,
      lang === 'en'
        ? 'Tithi • Nakshatram • Muhurtham • Rahukalam'
        : 'తిథి • నక్షత్రం • అమృత ఘడియలు • రాహుకాలం',
      lang,
      progress / 0.117,
      'panchangam'
    );
  } else {
    drawCommonTopHeader(
      ctx,
      lang,
      'ఓం శ్రీలక్ష్మి గణపతయే నమః • నిత్య పంచాంగం',
      'OM SRI LAKSHMI GANAPATAYE NAMAHA'
    );

    if (progress >= 0.833) {
      renderAnimatedServicesOutro(ctx, lang, (progress - 0.833) / 0.167);
    } else {
      drawRoundedRect(ctx, 76, 236, W - 152, 80, 40);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = '#2a0702';
      ctx.font = 'bold 32px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        `📅 ${tr(day.teediVaram)}  •  ${tr(day.panchanga.samvatsaram)}`,
        76,
        W - 152,
        288,
        28
      );

      const scene = progress < 0.367 ? 1 : progress < 0.617 ? 2 : 3;
      const sceneLocal =
        scene === 1
          ? (progress - 0.117) / 0.25
          : scene === 2
          ? (progress - 0.367) / 0.25
          : (progress - 0.617) / 0.216;
      const fadeAlpha =
        sceneLocal < 0.06
          ? easeOutCubic(sceneLocal / 0.06)
          : sceneLocal > 0.94
          ? 1 - (sceneLocal - 0.94) / 0.06
          : 1;

      ctx.save();
      ctx.globalAlpha = Math.max(0.15, Math.min(1, fadeAlpha));
      const slideY = (1 - easeOutCubic(Math.min(1, sceneLocal / 0.1))) * 22;
      ctx.translate(0, slideY);

      const cardW = W - 152; // 928px

      if (scene === 1) {
        // SCENE 1: CORE 6 PANCHANGAM LIMBS (Full-Fit Multi-Line — Zero Cutoff!)
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 42px "Noto Serif Telugu", serif';
        drawLeftCenteredText(
          ctx,
          lang === 'en' ? "TODAY'S TELUGU PANCHANGAM" : 'నేటి దృక్సిద్ధాంత పంచాంగం',
          76,
          cardW,
          388,
          24
        );

        const rows = [
          { icon: '🕉️', k: lang === 'en' ? 'Masam' : 'మాసం', v: tr(day.panchanga.masam) },
          { icon: '🌙', k: lang === 'en' ? 'Tithi' : 'తిథి', v: tr(day.panchanga.tithi) },
          { icon: '⭐', k: lang === 'en' ? 'Nakshatram' : 'నక్షత్రం', v: tr(day.panchanga.nakshatram) },
          { icon: '✨', k: lang === 'en' ? 'Yogam' : 'యోగం', v: tr(day.panchanga.yogam) },
          { icon: '⏳', k: lang === 'en' ? 'Karanam' : 'కరణం', v: tr(day.panchanga.karanam) },
          { icon: '🪔', k: lang === 'en' ? 'Presiding Deity' : 'ఆరాధ్య దైవం', v: tr(day.deity) },
        ];

        let ry = 425;
        for (const row of rows) {
          const rowH = 186;
          drawRoundedRect(ctx, 76, ry, cardW, rowH, 26);
          ctx.fillStyle = 'rgba(255, 251, 235, 0.97)';
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#9a3412';
          ctx.font = 'bold 26px "Noto Serif Telugu", sans-serif';
          drawAutoFitLeftText(ctx, `${row.icon}  ${row.k}`, 110, ry + 44, cardW - 68, 20);

          ctx.fillStyle = '#290f02';
          drawFullFitWrappedText(
            ctx,
            row.v,
            110,
            ry + 92,
            cardW - 68,
            rowH - 62,
            32,
            'bold',
            '"Noto Serif Telugu", serif',
            21
          );
          ry += 202;
        }
      } else if (scene === 2) {
        // SCENE 2: SHUBHA & ASHUBHA TIMINGS (Full-Fit Multi-Line — Zero Cutoff!)
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 42px "Noto Serif Telugu", serif';
        drawLeftCenteredText(
          ctx,
          lang === 'en' ? 'AUSPICIOUS & CAUTION TIMINGS' : 'నేటి శుభ & అశుభ సమయాలు',
          76,
          cardW,
          388,
          24
        );

        // Emerald Auspicious Card
        drawRoundedRect(ctx, 76, 425, cardW, 555, 30);
        ctx.fillStyle = '#ecfdf5';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 34px "Noto Serif Telugu", serif';
        drawAutoFitLeftText(
          ctx,
          lang === 'en' ? '✅ SHUBHA MUHURTHAM (BEST WINDOWS)' : '✅ శుభ సమయాలు (మంచి ఘడియలు)',
          110,
          485,
          cardW - 68,
          24
        );

        const goodItems = [
          { k: lang === 'en' ? 'Abhijit Muhurtham:' : 'అభిజిత్ ముహూర్తం:', v: tr(day.shubha.abhijit), boxH: 85 },
          { k: lang === 'en' ? 'Amrutha Gadiyalu:' : 'అమృత ఘడియలు:', v: tr(day.shubha.amrutha), boxH: 85 },
          { k: lang === 'en' ? 'Moon Transit (Chandra):' : 'నేటి చంద్ర సంచారం:', v: tr(day.chandra.sancharam), boxH: 135 },
        ];
        let gy = 540;
        for (const item of goodItems) {
          ctx.fillStyle = '#047857';
          ctx.font = 'bold 25px "Noto Serif Telugu", sans-serif';
          drawAutoFitLeftText(ctx, item.k, 110, gy, cardW - 68, 18);

          ctx.fillStyle = '#022c22';
          const nextY = drawFullFitWrappedText(
            ctx,
            item.v,
            110,
            gy + 40,
            cardW - 68,
            item.boxH,
            30,
            'bold',
            '"Noto Serif Telugu", serif',
            20
          );
          gy = Math.max(gy + 115, nextY + 26);
        }

        // Crimson Caution Card
        drawRoundedRect(ctx, 76, 1005, cardW, 635, 30);
        ctx.fillStyle = '#fff1f2';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.fillStyle = '#9f1239';
        ctx.font = 'bold 34px "Noto Serif Telugu", serif';
        drawAutoFitLeftText(
          ctx,
          lang === 'en' ? '⚠️ ASHUBHA TIMINGS (AVOID NEW STARTS)' : '⚠️ వర్జించవలసిన అశుభ సమయాలు',
          110,
          1065,
          cardW - 68,
          24
        );

        const badItems = [
          { k: lang === 'en' ? 'Rahu Kalam:' : 'రాహుకాలం:', v: tr(day.ashubha.rahukalam), boxH: 75 },
          { k: lang === 'en' ? 'Yamagandam:' : 'యమగండం:', v: tr(day.ashubha.yamagandam), boxH: 75 },
          { k: lang === 'en' ? 'Varjyam:' : 'వర్జ్యం:', v: tr(day.ashubha.varjyam), boxH: 85 },
          { k: lang === 'en' ? 'Durmuhurtham:' : 'దుర్ముహూర్తం:', v: tr(day.ashubha.durmuhurtham), boxH: 105 },
        ];
        let by = 1120;
        for (const item of badItems) {
          ctx.fillStyle = '#be123c';
          ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
          drawAutoFitLeftText(ctx, item.k, 110, by, cardW - 68, 18);

          ctx.fillStyle = '#4c0519';
          const nextY = drawFullFitWrappedText(
            ctx,
            item.v,
            110,
            by + 38,
            cardW - 68,
            item.boxH,
            29,
            'bold',
            '"Noto Serif Telugu", serif',
            20
          );
          by = Math.max(by + 114, nextY + 22);
        }
      } else {
        // SCENE 3: DAILY BLESSING, LUCKY COLOR & CTA
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 42px "Noto Serif Telugu", serif';
        drawLeftCenteredText(
          ctx,
          lang === 'en' ? 'DAILY SPIRITUAL GUIDANCE' : 'నేటి దిన విశేషం & శుభ సందేశం',
          76,
          cardW,
          388,
          24
        );

        drawRoundedRect(ctx, 76, 430, cardW, 560, 32);
        ctx.fillStyle = '#fffbeb';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#9a3412';
        ctx.font = 'bold 32px "Noto Serif Telugu", serif';
        drawAutoFitLeftText(ctx, `🌟 ${tr(day.specialEvent || day.deity)}`, 110, 495, cardW - 68, 22);

        ctx.fillStyle = '#290f02';
        drawFullFitWrappedText(
          ctx,
          tr(day.phalitham),
          110,
          565,
          cardW - 68,
          395,
          32,
          'bold',
          '"Noto Serif Telugu", serif',
          21
        );

        drawRoundedRect(ctx, 76, 1025, cardW, 360, 30);
        ctx.fillStyle = '#fef3c7';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 29px "Noto Serif Telugu", sans-serif';
        drawAutoFitLeftText(
          ctx,
          lang === 'en'
            ? `🎨 Lucky Color: ${tr(day.luckyColor)}`
            : `🎨 నేటి శుభ రంగు: ${tr(day.luckyColor)}`,
          110,
          1090,
          cardW - 68,
          20
        );

        ctx.fillStyle = '#9a3412';
        drawFullFitWrappedText(
          ctx,
          `${lang === 'en' ? '⚠️ Chandrashtamam: ' : '⚠️ చంద్రాష్టమం / జాగ్రత్త: '}${tr(day.chandra.chandrashtamam)}  •  🙏 ${tr(day.deity)}`,
          110,
          1155,
          cardW - 68,
          205,
          28,
          'bold',
          '"Noto Serif Telugu", serif',
          20
        );

        drawRoundedRect(ctx, 96, 1430, W - 192, 170, 34);
        const ctaGrad = ctx.createLinearGradient(96, 1430, W - 96, 1600);
        ctaGrad.addColorStop(0, '#fde047');
        ctaGrad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = ctaGrad;
        ctx.fill();

        ctx.fillStyle = '#2a0702';
        ctx.font = 'bold 34px "Noto Serif Telugu", serif';
        drawLeftCenteredText(
          ctx,
          lang === 'en'
            ? '12 Rashi Phalalu & Free Janma Kundali'
            : '12 రాశి ఫలాలు & ఉచిత 37-అధ్యాయాల జాతకం కోసం',
          96,
          W - 192,
          1500,
          24
        );
        ctx.font = 'bold 40px sans-serif';
        drawLeftCenteredText(ctx, '🌐 www.telugujyothisham.com', 96, W - 192, 1565, 24);
      }
      ctx.restore();
    }
  }

  const barW = W - 152;
  drawRoundedRect(ctx, 76, 1675, barW, 12, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fill();
  drawRoundedRect(ctx, 76, 1675, Math.max(24, barW * progress), 12, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 30px sans-serif';
  drawLeftCenteredText(ctx, 'www.telugujyothisham.com  •  📞 +91 89779 86166', 76, W - 152, 1760, 24);
  ctx.fillStyle = 'rgba(254, 243, 199, 0.78)';
  ctx.font = '24px "Noto Serif Telugu", sans-serif';
  drawLeftCenteredText(
    ctx,
    lang === 'en'
      ? 'Follow & Save for Daily Telugu Panchangam Updates'
      : 'ప్రతిరోజూ నిత్య పంచాంగం & రాశి ఫలాల కోసం Share / Save చేయండి',
    76,
    W - 152,
    1818,
    24
  );
}

function createRecorderWithTanpura(canvas: HTMLCanvasElement) {
  const canvasStream = canvas.captureStream(60);
  let audioCtx: AudioContext | null = null;
  const oscNodes: OscillatorNode[] = [];

  try {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextCtor) {
      audioCtx = new AudioContextCtor();
      const audioDest = audioCtx.createMediaStreamDestination();
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 1.2);
      masterGain.connect(audioDest);

      for (const freq of [138.59, 207.65, 277.18]) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(masterGain);
        osc.start();
        oscNodes.push(osc);
      }
      audioDest.stream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
    }
  } catch {
    // Silent fallback
  }

  const mimeCandidates = [
    'video/mp4;codecs=avc1.640028,mp4a.40.2',
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  const selectedMime = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
  const ext = (selectedMime || '').includes('mp4') ? 'mp4' : 'webm';
  const recorder = new MediaRecorder(canvasStream, {
    ...(selectedMime ? { mimeType: selectedMime } : {}),
    videoBitsPerSecond: 8_000_000,
  });

  const cleanupAudio = () => {
    oscNodes.forEach((o) => {
      try {
        o.stop();
      } catch {}
    });
    if (audioCtx) audioCtx.close().catch(() => {});
  };

  return { recorder, selectedMime, ext, cleanupAudio };
}

export async function generateDailyPanchangamReelVideo(
  day: DayData,
  lang: Language = 'te',
  onProgress?: (percent: number, sceneLabel: string) => void,
  autoDownload = true
): Promise<DailyReelResult> {
  if (typeof document === 'undefined' || typeof MediaRecorder === 'undefined') {
    throw new Error('Video recording is not supported in this browser.');
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  const { recorder, selectedMime, ext, cleanupAudio } = createRecorderWithTanpura(canvas);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const durationSec = 60;
  const durationMs = durationSec * 1000;
  const iso = day.isoDate || day.id || 'today';
  const filename = `panchangam-hd-60s-${iso}-${lang}.${ext}`;

  return new Promise<DailyReelResult>((resolve, reject) => {
    recorder.onerror = (err) => {
      cleanupAudio();
      reject(err);
    };

    recorder.onstop = () => {
      cleanupAudio();
      const mimeType = recorder.mimeType || selectedMime || `video/${ext}`;
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);

      if (autoDownload) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 1200);
      }

      onProgress?.(100, lang === 'en' ? '60s HD Reel Ready!' : '60 సెకన్ల HD వీడియో సిద్ధమైంది!');
      resolve({ blob, url, filename, mimeType, durationSec });
    };

    renderReelFrame(ctx, day, lang, 0);
    recorder.start(250);

    const startTime = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(1, elapsed / durationMs);
      renderReelFrame(ctx, day, lang, p);

      const pct = Math.min(99, Math.round(p * 100));
      const secDone = Math.min(durationSec, Math.floor(elapsed / 1000));
      const label =
        p < 0.117
          ? lang === 'en'
            ? `Intro: Website Animation (${secDone}s / ${durationSec}s)...`
            : `ఇంట్రో: వెబ్‌సైట్ యానిమేషన్ (${secDone}s / ${durationSec}s)...`
          : p < 0.367
          ? lang === 'en'
            ? `Scene 1: Panchangam Limbs (${secDone}s / ${durationSec}s)...`
            : `సీన్ 1: పంచాంగ వివరాలు (${secDone}s / ${durationSec}s)...`
          : p < 0.617
          ? lang === 'en'
            ? `Scene 2: Muhurtham & Rahukalam (${secDone}s / ${durationSec}s)...`
            : `సీన్ 2: ముహూర్తం & రాహుకాలం (${secDone}s / ${durationSec}s)...`
          : p < 0.833
          ? lang === 'en'
            ? `Scene 3: Daily Guidance (${secDone}s / ${durationSec}s)...`
            : `సీన్ 3: దిన విశేషం & శుభ సందేశం (${secDone}s / ${durationSec}s)...`
          : lang === 'en'
          ? `Ending: Website Services Ad (${secDone}s / ${durationSec}s)...`
          : `ఎండింగ్: మా జ్యోతిషాలయ సేవలు (${secDone}s / ${durationSec}s)...`;
      onProgress?.(pct, label);

      if (elapsed < durationMs) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }, 120);
      }
    };

    requestAnimationFrame(tick);
  });
}

function renderRashiReelFrame(
  ctx: CanvasRenderingContext2D,
  day: DayData,
  rashis: RashiDailyFortune[],
  spotIdx: number,
  lang: Language,
  progress: number
) {
  const W = 1080;
  const H = 1920;
  const tr = (val: string) => (lang === 'en' ? translatePanchangamString(val, 'en') : val);
  const spot = rashis[spotIdx] || rashis[0];

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2a0702');
  bg.addColorStop(0.25, '#5c1808');
  bg.addColorStop(0.6, '#3d1005');
  bg.addColorStop(1, '#1e0502');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(W / 2, 860);
  ctx.rotate(progress * Math.PI * 0.8);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.11)';
  ctx.lineWidth = 3;
  for (let ring = 1; ring <= 3; ring++) {
    ctx.beginPath();
    ctx.arc(0, 0, ring * 185, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 28, 28, W - 56, H - 56, 36);
  ctx.stroke();

  // SCENE 0 (0s - 6.5s): Animated Brand Intro with Spotlight Rashi Hook
  if (progress < 0.108) {
    renderAnimatedBrandIntro(
      ctx,
      `📅 ${tr(day.teediVaram)} • ${tr(day.panchanga.samvatsaram)}`,
      lang === 'en'
        ? `🌟 Today Spotlight: ${spot.englishName} Full Prediction + All 12 Rashis`
        : `🌟 నేటి విశేష రాశి: ${spot.teluguName} రాశి సంపూర్ణ ఫలితం + 12 రాశులు`,
      lang,
      progress / 0.108,
      'rashi'
    );
  } else {
    drawCommonTopHeader(
      ctx,
      lang,
      `నేటి విశేష రాశి (${spot.teluguName}) + ద్వాదశ రాశి ఫలాలు`,
      'TODAY SPOTLIGHT RASHI + 12 RASHI PHALALU'
    );

    if (progress >= 0.833) {
      renderAnimatedServicesOutro(ctx, lang, (progress - 0.833) / 0.167);
    } else if (progress < 0.400) {
      // =========================================================================
      // SCENE 1 (6.5s - 24.0s): SPOTLIGHT RASHI OF THE DAY — FULL WEBSITE PREDICTION
      // =========================================================================
      const sceneLocal = (progress - 0.108) / (0.400 - 0.108);
      const fadeAlpha =
        sceneLocal < 0.06
          ? easeOutCubic(sceneLocal / 0.06)
          : sceneLocal > 0.94
          ? 1 - (sceneLocal - 0.94) / 0.06
          : 1;

      const cardW = W - 152; // 928px

      // Top Spotlight Ribbon
      drawRoundedRect(ctx, 76, 230, cardW, 78, 39);
      const ribGrad = ctx.createLinearGradient(76, 230, W - 76, 308);
      ribGrad.addColorStop(0, '#fde047');
      ribGrad.addColorStop(0.5, '#f59e0b');
      ribGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = ribGrad;
      ctx.fill();
      ctx.fillStyle = '#2a0702';
      ctx.font = 'bold 30px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        lang === 'en'
          ? `🌟 RASHI OF THE DAY (FULL WEBSITE REPORT): ${spot.symbol} ${spot.englishName.toUpperCase()}`
          : `🌟 నేటి విశేష రాశి (సంపూర్ణ వెబ్‌సైట్ ఫలితం): ${spot.symbol} ${spot.teluguName} రాశి`,
        76,
        cardW,
        280,
        24
      );

      ctx.save();
      ctx.globalAlpha = Math.max(0.15, Math.min(1, fadeAlpha));

      // Main Spotlight Container Card
      const isFav = spot.status === 'favorable';
      const isCaution = spot.status === 'caution';
      drawRoundedRect(ctx, 76, 322, cardW, 1146, 32);
      ctx.fillStyle = '#fffbeb';
      ctx.fill();
      ctx.strokeStyle = isFav ? '#10b981' : isCaution ? '#f43f5e' : '#f59e0b';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Spotlight Card Header
      ctx.fillStyle = '#2a0702';
      ctx.font = 'bold 38px "Noto Serif Telugu", serif';
      const spotHeader =
        lang === 'en'
          ? `${spot.symbol} ${spot.englishName} (${spot.teluguName}) • Lord: ${spot.lordEn}`
          : `${spot.symbol} ${spot.teluguName} రాశి (${spot.englishName}) • అధిపతి: ${spot.lord}`;
      drawAutoFitLeftText(ctx, spotHeader, 108, 384, 575, 22);

      // Status Pill
      drawRoundedRect(ctx, W - 365, 344, 260, 54, 27);
      ctx.fillStyle = isFav ? '#047857' : isCaution ? '#be123c' : '#b45309';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 23px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        lang === 'en' ? spot.statusLabelEn : spot.statusLabel,
        W - 365,
        260,
        380,
        14
      );

      const enLines = spot.englishFullSummary.split('\n');
      const enCareerLine = (enLines[1] || enLines[0] || '').replace(/^\d+\.\s*[^:]+:\s*/, '');
      const enWealthLine = (spot.englishWealthBusiness || enLines[0] || '').replace(/^\d+\.\s*[^:]+:\s*/, '');
      const enFamilyLine = `${(enLines[2] || '').replace(/^\d+\.\s*[^:]+:\s*/, '')} ${(spot.englishHealthVitality || '').replace(/^\d+\.\s*[^:]+:\s*/, '')}`.trim();
      const enGuidanceLine = `${spot.doTodayEn || spot.englishDairyam} • Best Time: ${spot.luckyTimeWindowEn || 'Morning Auspicious Hora'}`;

      // 4 Website Domain Boxes + 1 Remedy/Lucky Box inside the Spotlight Card
      const domainBoxes =
        lang === 'en'
          ? [
              {
                icon: '💼',
                label: 'Career, Job & Authority:',
                text: enCareerLine,
                bg: '#f8fafc',
                border: '#cbd5e1',
                titleCol: '#0f172a',
              },
              {
                icon: '💰',
                label: 'Wealth, Finance & Business:',
                text: enWealthLine,
                bg: '#f0fdf4',
                border: '#86efac',
                titleCol: '#065f46',
              },
              {
                icon: '👨‍👩‍👧‍👦',
                label: 'Family Harmony & Health:',
                text: enFamilyLine,
                bg: '#fdf2f8',
                border: '#f9a8d4',
                titleCol: '#9d174d',
              },
              {
                icon: '🔭',
                label: 'Planetary Guidance & Best Time:',
                text: enGuidanceLine,
                bg: '#eff6ff',
                border: '#93c5fd',
                titleCol: '#1e40af',
              },
            ]
          : [
              {
                icon: '💼',
                label: 'వృత్తి, ఉద్యోగం & అధికారుల ఆదరణ:',
                text: spot.careerFinanceLine,
                bg: '#ffffff',
                border: '#fcd34d',
                titleCol: '#9a3412',
              },
              {
                icon: '💰',
                label: 'ఆర్థిక స్థితి, ధన యోగం & వ్యాపారం:',
                text: spot.wealthBusinessLine,
                bg: '#ecfdf5',
                border: '#6ee7b7',
                titleCol: '#065f46',
              },
              {
                icon: '👨‍👩‍👧‍👦',
                label: 'కుటుంబ సౌఖ్యం & ఆరోగ్య సూచన:',
                text: `${spot.familyHealthLine} ${spot.healthVitalityLine}`,
                bg: '#fff1f2',
                border: '#fda4af',
                titleCol: '#9f1239',
              },
              {
                icon: '🔭',
                label: 'గ్రహ దృష్టి, నేటి సూచన & శుభ సమయం:',
                text: `${spot.doTodayTe} • శుభ సమయం: ${spot.luckyTimeWindowTe}`,
                bg: '#eff6ff',
                border: '#93c5fd',
                titleCol: '#1e40af',
              },
            ];

      let boxY = 414;
      const innerW = cardW - 56; // 872px
      for (const b of domainBoxes) {
        const boxH = 198;
        drawRoundedRect(ctx, 104, boxY, innerW, boxH, 22);
        ctx.fillStyle = b.bg;
        ctx.fill();
        ctx.strokeStyle = b.border;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = b.titleCol;
        ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
        drawAutoFitLeftText(ctx, `${b.icon} ${b.label}`, 130, boxY + 38, innerW - 52, 18);

        ctx.fillStyle = '#1e293b';
        drawFullFitWrappedText(
          ctx,
          b.text,
          130,
          boxY + 78,
          innerW - 52,
          boxH - 88,
          25,
          'bold',
          '"Noto Serif Telugu", serif',
          18
        );

        boxY += 210;
      }

      // Box 5: Lucky Color, Lucky Number & Vedic Remedy
      drawRoundedRect(ctx, 104, boxY, innerW, 186, 22);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 24px "Noto Serif Telugu", sans-serif';
      const luckyStr =
        lang === 'en'
          ? `🎨 Lucky Color: ${spot.luckyColorEn}   •   🔢 Lucky Number: #${spot.luckyNumber}`
          : `🎨 శుభ రంగు: ${spot.luckyColor}   •   🔢 అదృష్ట సంఖ్య: #${spot.luckyNumber}`;
      drawAutoFitLeftText(ctx, luckyStr, 130, boxY + 42, innerW - 52, 18);

      ctx.fillStyle = '#9a3412';
      const remStr =
        lang === 'en'
          ? `🙏 Today's Vedic Remedy: ${spot.remedyEn}`
          : `🙏 నేటి విశేష పరిహారం: ${spot.remedy}`;
      drawFullFitWrappedText(
        ctx,
        remStr,
        130,
        boxY + 86,
        innerW - 52,
        92,
        24,
        'bold',
        '"Noto Serif Telugu", serif',
        18
      );

      // Bottom Website Hook Banner under Spotlight Rashi
      drawRoundedRect(ctx, 76, 1484, cardW, 168, 28);
      const hookGrad = ctx.createLinearGradient(76, 1484, W - 76, 1652);
      hookGrad.addColorStop(0, '#064e3b');
      hookGrad.addColorStop(0.5, '#047857');
      hookGrad.addColorStop(1, '#064e3b');
      ctx.fillStyle = hookGrad;
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        lang === 'en'
          ? `🔥 Full Prediction for Other 11 Rashis (Just like ${spot.englishName}):`
          : `🔥 ${spot.teluguName} రాశి లాగే మిగతా 11 రాశుల పూర్తి వెబ్‌సైట్ ఫలితం కోసం:`,
        96,
        cardW - 40,
        1538,
        20
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        lang === 'en'
          ? '🌐 Open Now: www.telugujyothisham.com'
          : '🌐 ఇప్పుడే ఓపెన్ చేయండి: www.telugujyothisham.com',
        96,
        cardW - 40,
        1610,
        22
      );

      ctx.restore();
    } else {
      // =========================================================================
      // SCENE 2 (24.0s - 37.0s): RASHIS 1 TO 6 NORMAL SUMMARY + WEBSITE HOOK
      // SCENE 3 (37.0s - 50.0s): RASHIS 7 TO 12 NORMAL SUMMARY + WEBSITE HOOK
      // =========================================================================
      const isFirstHalf = progress < 0.617;
      const sceneLocal = isFirstHalf
        ? (progress - 0.400) / (0.617 - 0.400)
        : (progress - 0.617) / (0.833 - 0.617);
      const fadeAlpha =
        sceneLocal < 0.06
          ? easeOutCubic(sceneLocal / 0.06)
          : sceneLocal > 0.94
          ? 1 - (sceneLocal - 0.94) / 0.06
          : 1;

      const cardW = W - 152; // 928px
      drawRoundedRect(ctx, 76, 230, cardW, 76, 38);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = '#2a0702';
      ctx.font = 'bold 30px "Noto Serif Telugu", sans-serif';
      const groupTitle = isFirstHalf
        ? lang === 'en'
          ? '📋 Rashis 1–6 Quick Summary (Full Report on Website)'
          : '📋 మేషం నుండి కన్య (1–6 రాశుల సంక్షిప్త ఫలం • పూర్తి ఫలితం వెబ్‌సైట్‌లో)'
        : lang === 'en'
        ? '📋 Rashis 7–12 Quick Summary (Full Report on Website)'
        : '📋 తుల నుండి మీనం (7–12 రాశుల సంక్షిప్త ఫలం • పూర్తి ఫలితం వెబ్‌సైట్‌లో)';
      drawLeftCenteredText(ctx, groupTitle, 76, cardW, 278, 22);

      ctx.save();
      ctx.globalAlpha = Math.max(0.15, Math.min(1, fadeAlpha));

      const slice = isFirstHalf ? rashis.slice(0, 6) : rashis.slice(6, 12);
      const colW = 450;
      const rowH = 342;
      const startXLeft = 76;
      const startXRight = 76 + colW + 28;
      const startY = 324;

      slice.forEach((r, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = col === 0 ? startXLeft : startXRight;
        const y = startY + row * (rowH + 18);

        const isFav = r.status === 'favorable';
        const isCaution = r.status === 'caution';
        const isSpot = r.id === spot.id;

        drawRoundedRect(ctx, x, y, colW, rowH, 26);
        ctx.fillStyle = isFav ? '#ecfdf5' : isCaution ? '#fff1f2' : '#fffbeb';
        ctx.fill();
        ctx.strokeStyle = isSpot
          ? '#fde047'
          : isFav
          ? '#10b981'
          : isCaution
          ? '#f43f5e'
          : '#f59e0b';
        ctx.lineWidth = isSpot ? 5 : 3.5;
        ctx.stroke();

        // Rashi Name
        ctx.fillStyle = '#290f02';
        ctx.font = 'bold 29px "Noto Serif Telugu", serif';
        const rTitle =
          lang === 'en'
            ? `${r.symbol} ${r.englishName}`
            : `${r.symbol} ${r.teluguName} రాశి`;
        drawAutoFitLeftText(ctx, rTitle, x + 22, y + 48, colW - 44, 20);

        // Status Pill + Lucky Number
        drawRoundedRect(ctx, x + 22, y + 64, colW - 44, 42, 21);
        ctx.fillStyle = isFav ? '#047857' : isCaution ? '#be123c' : '#b45309';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Noto Serif Telugu", sans-serif';
        const badgeTxt =
          lang === 'en'
            ? `${r.statusLabelEn} • Lucky #${r.luckyNumber}`
            : `${r.statusLabel} • సంఖ్య #${r.luckyNumber}`;
        drawLeftCenteredText(ctx, badgeTxt, x + 22, colW - 44, y + 92, 14);

        // Concise Summary Headline (Career/Day Essence)
        ctx.fillStyle = '#1e293b';
        const rEnLines = r.englishFullSummary.split('\n');
        const briefText =
          lang === 'en'
            ? (rEnLines[1] || rEnLines[0] || '').replace(/^\d+\.\s*[^:]+:\s*/, '')
            : r.careerFinanceLine;
        drawFullFitWrappedText(
          ctx,
          briefText,
          x + 22,
          y + 138,
          colW - 44,
          140,
          23,
          'bold',
          '"Noto Serif Telugu", serif',
          17
        );

        // Footer inside mini card pointing to Website for full details
        ctx.fillStyle = '#9a3412';
        ctx.font = 'bold 19px "Noto Serif Telugu", sans-serif';
        const cardFoot = isSpot
          ? lang === 'en'
            ? '⭐ Today Spotlight Rashi (Full Report Above)'
            : '⭐ నేటి విశేష రాశి (పూర్తి ఫలితం పైన చూడండి)'
          : lang === 'en'
          ? `🎨 ${r.luckyColorEn} • 🌐 Full Report on Site`
          : `🎨 ${r.luckyColor} • 🌐 పూర్తి ఫలితం వెబ్‌సైట్‌లో`;
        drawAutoFitLeftText(ctx, cardFoot, x + 22, y + 316, colW - 44, 15);
      });

      // Prominent Website Traffic Hook Banner at bottom of Scene 2 & Scene 3
      drawRoundedRect(ctx, 76, 1408, cardW, 244, 32);
      const ctaGrad = ctx.createLinearGradient(76, 1408, W - 76, 1652);
      ctaGrad.addColorStop(0, '#fde047');
      ctaGrad.addColorStop(0.5, '#f59e0b');
      ctaGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = ctaGrad;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#7c2d12';
      ctx.font = 'bold 27px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        lang === 'en'
          ? `🔥 Just like ${spot.englishName}, get YOUR Rashi's Full Career, Wealth & Remedy`
          : `🔥 ${spot.teluguName} రాశి లాగే మీ రాశి యొక్క పూర్తి కెరీర్, ధన యోగం, కుటుంబం & పరిహారం`,
        96,
        cardW - 40,
        1466,
        19
      );

      ctx.fillStyle = '#2a0702';
      ctx.font = 'bold 28px "Noto Serif Telugu", serif';
      drawLeftCenteredText(
        ctx,
        lang === 'en'
          ? 'Read Free on Our Official Website Right Now:'
          : 'మన వెబ్‌సైట్‌లో వివరంగా ఉంది! ఇప్పుడే ఓపెన్ చేయండి:',
        96,
        cardW - 40,
        1524,
        20
      );

      drawRoundedRect(ctx, 156, 1548, cardW - 160, 82, 41);
      ctx.fillStyle = '#2a0702';
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 38px sans-serif';
      drawLeftCenteredText(ctx, '🌐 www.telugujyothisham.com', 156, cardW - 160, 1602, 24);

      ctx.restore();
    }
  }

  const barW = W - 152;
  drawRoundedRect(ctx, 76, 1675, barW, 12, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fill();
  drawRoundedRect(ctx, 76, 1675, Math.max(24, barW * progress), 12, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 30px sans-serif';
  drawLeftCenteredText(ctx, 'www.telugujyothisham.com  •  📞 +91 89779 86166', 76, W - 152, 1755, 24);
  ctx.fillStyle = 'rgba(254, 243, 199, 0.8)';
  ctx.font = '24px "Noto Serif Telugu", sans-serif';
  drawLeftCenteredText(
    ctx,
    lang === 'en'
      ? 'Visit www.telugujyothisham.com for All 12 Rashis Full Daily Predictions!'
      : 'మిగతా 11 రాశుల పూర్తి ఫలితాల కోసం www.telugujyothisham.com ఓపెన్ చేయండి!',
    76,
    W - 152,
    1815,
    24
  );
}

export async function generateDailyRashiReelVideo(
  day: DayData,
  lang: Language = 'te',
  onProgress?: (percent: number, sceneLabel: string) => void,
  spotlightRashiId?: string,
  autoDownload = true
): Promise<DailyReelResult> {
  if (typeof document === 'undefined' || typeof MediaRecorder === 'undefined') {
    throw new Error('Video recording is not supported in this browser.');
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const rashis = getDailyRashiFortunes(day);
  const spotIdx = getSpotlightRashiIndex(day, rashis, spotlightRashiId);
  const spot = rashis[spotIdx] || rashis[0];

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  const { recorder, selectedMime, ext, cleanupAudio } = createRecorderWithTanpura(canvas);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const durationSec = 60;
  const durationMs = durationSec * 1000;
  const iso = day.isoDate || day.id || 'today';
  const filename = `rashi-phalalu-hd-60s-${iso}-${spot.id}-${lang}.${ext}`;

  return new Promise<DailyReelResult>((resolve, reject) => {
    recorder.onerror = (err) => {
      cleanupAudio();
      reject(err);
    };

    recorder.onstop = () => {
      cleanupAudio();
      const mimeType = recorder.mimeType || selectedMime || `video/${ext}`;
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);

      if (autoDownload) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 1200);
      }

      onProgress?.(
        100,
        lang === 'en'
          ? `60s HD Reel Ready (${spot.englishName} Spotlight + 12 Rashis)!`
          : `60 సెకన్ల HD వీడియో సిద్ధమైంది (${spot.teluguName} రాశి పూర్తి ఫలితం + 12 రాశులు)!`
      );
      resolve({ blob, url, filename, mimeType, durationSec });
    };

    renderRashiReelFrame(ctx, day, rashis, spotIdx, lang, 0);
    recorder.start(250);

    const startTime = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(1, elapsed / durationMs);
      renderRashiReelFrame(ctx, day, rashis, spotIdx, lang, p);

      const pct = Math.min(99, Math.round(p * 100));
      const secDone = Math.min(durationSec, Math.floor(elapsed / 1000));
      const label =
        p < 0.108
          ? lang === 'en'
            ? `Intro: Website Animation (${secDone}s / ${durationSec}s)...`
            : `ఇంట్రో: వెబ్‌సైట్ యానిమేషన్ (${secDone}s / ${durationSec}s)...`
          : p < 0.400
          ? lang === 'en'
            ? `Scene 1: ${spot.englishName} Full Prediction (${secDone}s / ${durationSec}s)...`
            : `సీన్ 1: నేటి విశేష రాశి (${spot.teluguName}) పూర్తి ఫలితం (${secDone}s / ${durationSec}s)...`
          : p < 0.617
          ? lang === 'en'
            ? `Scene 2: Rashis 1–6 Summary + Site Hook (${secDone}s / ${durationSec}s)...`
            : `సీన్ 2: మేషం – కన్య సంక్షిప్త ఫలం + వెబ్‌సైట్ లింక్ (${secDone}s / ${durationSec}s)...`
          : p < 0.833
          ? lang === 'en'
            ? `Scene 3: Rashis 7–12 Summary + Site Hook (${secDone}s / ${durationSec}s)...`
            : `సీన్ 3: తుల – మీనం సంక్షిప్త ఫలం + వెబ్‌సైట్ లింక్ (${secDone}s / ${durationSec}s)...`
          : lang === 'en'
          ? `Ending: Website Services Ad (${secDone}s / ${durationSec}s)...`
          : `ఎండింగ్: మా జ్యోతిషాలయ సేవలు (${secDone}s / ${durationSec}s)...`;
      onProgress?.(pct, label);

      if (elapsed < durationMs) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }, 120);
      }
    };

    requestAnimationFrame(tick);
  });
}

/**
 * 30-Second Daily Subhashitham / Quote Reel Video Renderer (Zero Text Cutoff!)
 * Scene 0 (0s - 4.5s): Animated Brand & Website Intro
 * Scene 1 (4.5s - 24s): Sanskrit Slokam + Sarala Bhavam + Modern Practical Quote
 * Scene 2 (24s - 30s): Website Advertisement & 6 Services Showcase
 */
function renderSubhashithamReelFrame(
  ctx: CanvasRenderingContext2D,
  item: SubhashithamVideoItem,
  langMode: 'te' | 'en' | 'both',
  progress: number
) {
  const W = 1080;
  const H = 1920;
  const lang: Language = langMode === 'en' ? 'en' : 'te';

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#260600');
  bg.addColorStop(0.3, '#4e1305');
  bg.addColorStop(0.65, '#330b02');
  bg.addColorStop(1, '#1a0300');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(W / 2, 820);
  ctx.rotate(progress * Math.PI * 0.7);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.11)';
  ctx.lineWidth = 3;
  for (let ring = 1; ring <= 3; ring++) {
    ctx.beginPath();
    ctx.arc(0, 0, ring * 190, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 28, 28, W - 56, H - 56, 36);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.5)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 44, 44, W - 88, H - 88, 28);
  ctx.stroke();

  if (progress < 0.15) {
    renderAnimatedBrandIntro(
      ctx,
      `✦ శ్లోకం #${item.id}: ${item.themeTe} ✦`,
      item.themeEn,
      lang,
      progress / 0.15,
      'quote'
    );
  } else {
    drawCommonTopHeader(
      ctx,
      lang,
      'నిత్య సుభాషిత శ్లోకం & నేటి తరానికి జీవన సూత్రం',
      'DAILY SANSKRIT SUBHASHITHAM & LIFE QUOTE'
    );

    if (progress >= 0.80) {
      renderAnimatedServicesOutro(ctx, lang, (progress - 0.80) / 0.20);
    } else {
      const sceneLocal = (progress - 0.15) / 0.65;
      const fadeAlpha =
        sceneLocal < 0.06
          ? easeOutCubic(sceneLocal / 0.06)
          : sceneLocal > 0.94
          ? 1 - (sceneLocal - 0.94) / 0.06
          : 1;

      ctx.save();
      ctx.globalAlpha = Math.max(0.15, Math.min(1, fadeAlpha));
      const cardW = W - 152; // 928px

      // Theme Pill
      drawRoundedRect(ctx, 76, 234, cardW, 78, 39);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = '#2a0702';
      ctx.font = 'bold 31px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        langMode === 'en'
          ? `✦ ${item.themeEn} (Quote #${item.id}) ✦`
          : `✦ ${item.themeTe} • ${item.themeEn} ✦`,
        76,
        cardW,
        284,
        28
      );

      // Card 1: Classical Sanskrit Slokam + Simple Meaning
      drawRoundedRect(ctx, 76, 336, cardW, 620, 32);
      ctx.fillStyle = 'rgba(43, 9, 2, 0.92)';
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 27px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        langMode === 'en' ? '📜 CLASSICAL SANSKRIT SLOKA' : '📜 మూల సంస్కృత సుభాషిత శ్లోకం',
        76,
        cardW,
        390,
        28
      );

      const slokaText =
        langMode === 'en'
          ? item.slokamEn
          : langMode === 'both'
          ? `${item.slokamTe}\n${item.slokamEn}`
          : item.slokamTe;

      ctx.fillStyle = '#ffffff';
      const afterSlokaY = drawFullFitWrappedText(
        ctx,
        slokaText,
        112,
        448,
        cardW - 72,
        220,
        langMode === 'both' ? 27 : 32,
        'bold',
        '"Noto Serif Telugu", serif',
        20,
        true,
        W / 2
      );

      // Divider inside Card 1
      const divY = Math.max(665, Math.min(690, afterSlokaY + 12));
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(130, divY);
      ctx.lineTo(W - 130, divY);
      ctx.stroke();

      // Meaning (Tatparyam)
      const meaningStr =
        langMode === 'en'
          ? `💡 Meaning: ${item.meaningEn}`
          : `💡 సరళ భావం: ${item.meaningTe}`;
      ctx.fillStyle = '#fed7aa';
      drawFullFitWrappedText(
        ctx,
        meaningStr,
        112,
        divY + 46,
        cardW - 72,
        930 - (divY + 30),
        28,
        'bold',
        '"Noto Serif Telugu", sans-serif',
        20,
        true,
        W / 2
      );

      // Card 2: Highlighted Modern Practical Life Quote Card (#fffbeb)
      drawRoundedRect(ctx, 76, 984, cardW, 650, 34);
      ctx.fillStyle = '#fffbeb';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = '#9a3412';
      ctx.font = 'bold 28px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        langMode === 'en'
          ? '🌟 PRACTICAL LIFE TAKEAWAY FOR TODAY 🌟'
          : '🌟 నేటి తరానికి లౌకిక జీవన సందేశం 🌟',
        76,
        cardW,
        1044,
        28
      );

      const quoteText =
        langMode === 'en'
          ? item.loukikaQuoteEn
          : langMode === 'both'
          ? `${item.loukikaQuoteTe}\n\n${item.loukikaQuoteEn}`
          : item.loukikaQuoteTe;

      ctx.fillStyle = '#1e293b';
      drawFullFitWrappedText(
        ctx,
        quoteText,
        114,
        1112,
        cardW - 76,
        430,
        langMode === 'both' ? 28 : 34,
        'bold',
        '"Noto Serif Telugu", serif',
        20,
        true,
        W / 2
      );

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 25px "Noto Serif Telugu", sans-serif';
      drawLeftCenteredText(
        ctx,
        '— బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు • www.telugujyothisham.com',
        76,
        cardW,
        1598,
        28
      );

      ctx.restore();
    }
  }

  const barW = W - 152;
  drawRoundedRect(ctx, 76, 1675, barW, 12, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fill();
  drawRoundedRect(ctx, 76, 1675, Math.max(24, barW * progress), 12, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 30px sans-serif';
  drawLeftCenteredText(ctx, 'www.telugujyothisham.com  •  📞 +91 89779 86166', 76, W - 152, 1755, 24);
  ctx.fillStyle = 'rgba(254, 243, 199, 0.8)';
  ctx.font = '24px "Noto Serif Telugu", sans-serif';
  drawLeftCenteredText(
    ctx,
    'ప్రతిరోజూ సుభాషిత శ్లోకాలు, పంచాంగం & రాశి ఫలాల కోసం Follow / Share చేయండి',
    76,
    W - 152,
    1815,
    24
  );
}

export async function generateDailySubhashithamReelVideo(
  item: SubhashithamVideoItem,
  langMode: 'te' | 'en' | 'both' = 'te',
  onProgress?: (percent: number, sceneLabel: string) => void,
  autoDownload = true
): Promise<DailyReelResult> {
  if (typeof document === 'undefined' || typeof MediaRecorder === 'undefined') {
    throw new Error('Video recording is not supported in this browser.');
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  const { recorder, selectedMime, ext, cleanupAudio } = createRecorderWithTanpura(canvas);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const durationSec = 30;
  const durationMs = durationSec * 1000;
  const filename = `daily-quote-subhashitham-hd-30s-${item.id}-${langMode}.${ext}`;

  return new Promise<DailyReelResult>((resolve, reject) => {
    recorder.onerror = (err) => {
      cleanupAudio();
      reject(err);
    };

    recorder.onstop = () => {
      cleanupAudio();
      const mimeType = recorder.mimeType || selectedMime || `video/${ext}`;
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);

      if (autoDownload) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 1200);
      }

      onProgress?.(100, '30 సెకన్ల HD సుభాషిత వీడియో సిద్ధమైంది!');
      resolve({ blob, url, filename, mimeType, durationSec });
    };

    renderSubhashithamReelFrame(ctx, item, langMode, 0);
    recorder.start(250);

    const startTime = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(1, elapsed / durationMs);
      renderSubhashithamReelFrame(ctx, item, langMode, p);

      const pct = Math.min(99, Math.round(p * 100));
      const secDone = Math.min(durationSec, Math.floor(elapsed / 1000));
      const label =
        p < 0.15
          ? `ఇంట్రో: వెబ్‌సైట్ యానిమేషన్ (${secDone}s / ${durationSec}s)...`
          : p < 0.80
          ? `సుభాషిత శ్లోకం & జీవన సందేశం (${secDone}s / ${durationSec}s)...`
          : `ఎండింగ్: మా జ్యోతిషాలయ సేవలు (${secDone}s / ${durationSec}s)...`;
      onProgress?.(pct, label);

      if (elapsed < durationMs) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }, 120);
      }
    };

    requestAnimationFrame(tick);
  });
}
