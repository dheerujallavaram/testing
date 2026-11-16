import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { WEEK_DATA } from '../src/data/panchangamData';
import { getOrGenerateDayData } from '../src/utils/astronomyPanchangam';
import { getDailyRashiFortunes } from '../src/utils/panchangaLogic';
import {
  computeCityLocalPanchangam,
  getTodayIsoDateIST,
} from '../src/seo/panchangamSsrEngine';
import { generate12MonthVratasAndFestivals } from '../src/utils/vrataCalendarAndRatnaEngine';
import type { VedicClassicalArticle } from '../src/data/vedicArticlesData';

export interface DailyTrendingSeoData {
  dateIso: string;
  generatedAtUtc: string;
  engine: string;
  trendingKeywordsTe: string[];
  trendingKeywordsEn: string[];
  headlineTe: string;
  headlineEn: string;
  seoSummaryTe: string;
  seoSummaryEn: string;
  topTrendingRashiTe: string;
  linkedArticleSlug: string;
  focusThemesTe: string[];
  focusThemesEn: string[];
}

const VERIFIED_ARTICLE_IMAGES = [
  '/assets/articles/classical_jyotish_archive_1794331371569.jpg',
  '/assets/articles/surya_siddhanta_kala_1794331370298.jpg',
  '/assets/articles/graha_vakra_retrograde_1794331368106.jpg',
  '/assets/articles/jyotisha_paribhasha_secrets_1794331372567.jpg',
  '/assets/articles/prashna_nimitta_horary_1794331439068.jpg',
  '/assets/articles/swarodaya_breath_shastra_1794331361969.jpg',
];

function clampLen(text: string, maxLen: number): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trimEnd() + '…';
}

function decodeXmlEntities(str: string): string {
  return String(str || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

const MEDIA_OUTLET_PATTERNS = [
  /\b(TV9\s*Telugu|TV9|Samayam\s*Telugu|Samayam|Hindustan\s*Times\s*Telugu|Hindustan\s*Times|Asianet\s*News\s*Telugu|Asianet\s*News|Asianet|Eenadu|Sakshi|Andhra\s*Jyothy|ABN|NTV|Zee\s*Telugu|News18\s*Telugu|News18|ABP\s*Desam|ABP|Times\s*of\s*India|Indian\s*Express|NDTV|GreatAndhra|Tupaki|Oneindia\s*Telugu|Oneindia|Google\s*Trends|Google\s*News)\b/gi,
  /ట్రెండింగ్/g,
  /సెర్చ్\s*ట్రెండ్స్/g,
  /\b(Trending|Search\s*Trends)\b/gi,
];

function scrubMediaAndTrendLabels(text: string): string {
  let clean = String(text || '');
  for (const rx of MEDIA_OUTLET_PATTERNS) {
    clean = clean.replace(rx, '');
  }
  return clean
    .replace(/\s*[-–|:]\s*(?=$|[.,;)])/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function distillVedicThemesFromSignals(params: {
  rssHeadlines: string[];
  geminiGroundedBrief: string;
  masamTe: string;
  nextVrataLabelTe: string;
  nextVrataLabelEn: string;
}): {
  themesTe: string[];
  themesEn: string[];
  narrativeTe: string;
  narrativeEn: string;
} {
  const corpus = `${params.rssHeadlines.join(' ')} ${params.geminiGroundedBrief}`.toLowerCase();
  const themesTe: string[] = [];
  const themesEn: string[] = [];

  if (/కార్తీక|karthika|kartika/i.test(corpus)) {
    themesTe.push('కార్తీక మాస పుణ్య తిథులు, దీపారాధన & వ్రత నియమాలు');
    themesEn.push('Kartika Masam sacred rituals, Deeparadhana & auspicious dates');
  }
  if (/వివాహ|పెళ్లి|marriage|vivaha|muhurth|ముహూర్త/i.test(corpus)) {
    themesTe.push('వివాహ యోగం, గురు-శుక్ర బలం & శుభ ముహూర్త పరిశీలన');
    themesEn.push('Vivaha Yoga, marriage compatibility & Shubha Muhurtham windows');
  }
  if (/రాజయోగం|ధనలాభం|ప్రమోషన్|ఉద్యోగ|career|wealth|rajayoga|promotion|job/i.test(corpus)) {
    themesTe.push('గ్రహ గోచార రాజయోగం, ఉద్యోగ–వ్యాపార ప్రగతి & ఆర్థిక ఫలితాలు');
    themesEn.push('Planetary Rajayoga transits, career growth & financial prosperity');
  }
  if (/నాగుల|కాలసర్ప|దోష|nagula|kalasarpa|dosha|rahu|shani|శని/i.test(corpus)) {
    themesTe.push('నాగుల చవితి / సర్ప దోష నివారణ & కాలసర్ప శాంతి మంత్రాలు');
    themesEn.push('Nagula Chavithi worship, Kalasarpa & Shani Dosha Vedic remedies');
  }
  if (/ఏకాదశి|ekadashi|పౌర్ణమి|pournami|అమావాస్య|amavasya|ప్రదోషం|pradosham/i.test(corpus)) {
    themesTe.push(`${params.nextVrataLabelTe} ఉపవాస వ్రత విధానం & సంకల్పం`);
    themesEn.push(`${params.nextVrataLabelEn} fasting rules & Sankalpam`);
  }

  if (themesTe.length === 0) {
    themesTe.push(
      `${params.masamTe} శుభ తిథి–నక్షత్ర విశేషాలు & శుభ ముహూర్తాలు`,
      'ద్వాదశ రాశి గోచార బలం, దోష శాంతి & నిత్య పరిహారాలు',
      `${params.nextVrataLabelTe} వ్రత విశేషాలు`
    );
    themesEn.push(
      'Daily Tithi, Nakshatra strength & Abhijit Muhurtham',
      '12-Rashi planetary transit & Vedic remedies',
      params.nextVrataLabelEn
    );
  }

  const narrativeTe = `ప్రస్తుత ${params.masamTe} పుణ్యకాలంలో భక్తులు ప్రధానంగా ${themesTe.slice(0, 3).join(', ')} గురించి విశేషంగా ఆసక్తి చూపుతున్నారు. శాస్త్ర ప్రమాణాల ప్రకారం సరైన తిథి–నక్షత్ర బలంతో కార్యాలు ప్రారంభిస్తే సకల శుభాలు చేకూరుతాయి.`;
  const narrativeEn = `Devotees seeking authentic Vedic guidance today are focusing on ${themesEn.slice(0, 3).join(', ')}. Observing Drik Siddhanta timings and Natal Tarabalam helps align key decisions with auspicious planetary currents.`;

  return { themesTe, themesEn, narrativeTe, narrativeEn };
}

async function fetchRssItems(
  url: string,
  sourceLabel: string,
  limit = 6
): Promise<{ title: string; source: string; link: string }[]> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TeluguJyothisham-HermesSEO/1.0)',
      },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items: { title: string; source: string; link: string }[] = [];
    for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
      const block = match[1];
      const rawTitle = block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
      const rawLink = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '';
      const title = decodeXmlEntities(rawTitle);
      const link = decodeXmlEntities(rawLink);
      if (title) {
        items.push({ title, source: sourceLabel, link });
      }
      if (items.length >= limit) break;
    }
    return items;
  } catch {
    return [];
  }
}

async function gatherLiveSearchTrends(todayIso: string): Promise<{
  rssItems: { title: string; source: string; link: string }[];
  geminiGroundedBrief: string;
}> {
  const [indiaTrends, teAstroNews, enAstroNews] = await Promise.all([
    fetchRssItems('https://trends.google.com/trending/rss?geo=IN', 'Google Trends IN', 6),
    fetchRssItems(
      'https://news.google.com/rss/search?q=telugu+panchangam+OR+rashi+phalalu+OR+karthika+masam+OR+ekadashi+OR+muhurtham&hl=te&gl=IN&ceid=IN:te',
      'Google News Telugu Astrology',
      6
    ),
    fetchRssItems(
      'https://news.google.com/rss/search?q=today+panchangam+OR+ekadashi+OR+telugu+festival+OR+muhurtham+2026&hl=en-IN&gl=IN&ceid=IN:IN',
      'Google News India Panchangam',
      5
    ),
  ]);

  const rssItems = [...teAstroNews, ...enAstroNews, ...indiaTrends];
  let geminiGroundedBrief = '';

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && !geminiKey.includes('MY_GEMINI_API_KEY')) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const res = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Date: ${todayIso}. Search current trending Telugu astrology, Panchangam, Vrata/Ekadashi, Karthika Masam, Graha transit, or Muhurtham topics in Andhra Pradesh, Telangana & India today. Return a crisp bullet summary of the top 5 real-time search intents in Telugu and English.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      if (res.text) {
        geminiGroundedBrief = res.text.trim();
      }
    } catch (err) {
      console.warn('⚠️ [Hermes Trend SEO] Gemini search grounding skipped:', err instanceof Error ? err.message : err);
    }
  }

  return { rssItems, geminiGroundedBrief };
}

interface GeneratedTrendBundle {
  headlineTe: string;
  headlineEn: string;
  seoSummaryTe: string;
  seoSummaryEn: string;
  trendingKeywordsTe: string[];
  trendingKeywordsEn: string[];
  article: VedicClassicalArticle;
  engineLabel: string;
}

interface LlmGeneratedTrendPayload {
  headlineTe?: string;
  headlineEn?: string;
  seoSummaryTe?: string;
  seoSummaryEn?: string;
  trendingKeywordsTe?: string[];
  trendingKeywordsEn?: string[];
  telugu?: Partial<VedicClassicalArticle['telugu']>;
  english?: Partial<VedicClassicalArticle['english']>;
  engineLabel?: string;
}

async function generateWithLlmOrNull(params: {
  todayIso: string;
  slug: string;
  heroImage: string;
  panchangamContext: string;
  rssHeadlines: string[];
  geminiGroundedBrief: string;
}): Promise<LlmGeneratedTrendPayload | null> {
  const prompt = `You are acting as an authoritative Telugu Vedic Jyotisha Scholar (Brahmasri Jallavaram Sai Dheeraj Sharma, Sri Lakshmi Ganapathi Jyothishalayam, Hyderabad - www.telugujyothisham.com, WhatsApp +91 89779 86166).
Write high-ranking, culturally authentic Telugu & English Panchangam and Jyotisha guidance aligned with TODAY's real Drik Siddhanta Panchangam and the active devotee topics listed below.

CRITICAL RULES:
1. NEVER invent or alter Tithi, Nakshatram, Yogam, Karanam, Rahukalam, or Muhurtham timings — strictly use ONLY the astronomical facts provided below.
2. NEVER mention any newspaper, TV channel, or media outlet names (NEVER write TV9, Samayam, Hindustan Times, Eenadu, Sakshi, Asianet, Google Trends, etc.) anywhere.
3. NEVER write the words "ట్రెండింగ్", "సెర్చ్ ట్రెండ్స్", "Trending", "Search Trends", or "Viral" anywhere in public titles, headings, summaries, or body copy. Silently weave the hot topics naturally as authentic Sri Lakshmi Ganapathi Jyothishalayam Vedic guidance.
4. "seoTitle" MUST be 42 to 57 characters max (never exceed 58 chars!).
5. "metaDescription" MUST be 110 to 150 characters max.
6. Keep both Telugu (rich traditional grammatical Telugu) and English completely coherent, zero clickbait, and aligned with Classical Parashara / Surya Siddhanta / Muhurtha Chintamani principles.
7. Output STRICTLY valid JSON matching this schema (no markdown fences):
{
  "headlineTe": "string",
  "headlineEn": "string",
  "seoSummaryTe": "string (80-140 words)",
  "seoSummaryEn": "string (60-110 words)",
  "trendingKeywordsTe": ["string", "string", "string", "string"],
  "trendingKeywordsEn": ["string", "string", "string", "string"],
  "telugu": {
    "title": "string",
    "seoTitle": "string (<=57 chars)",
    "metaDescription": "string (115-150 chars)",
    "primaryKeyword": "string",
    "secondaryKeywords": ["string", "string", "string"],
    "summary": "string",
    "sections": [
      { "heading": "string", "subheading": "string", "content": "string", "keyPoints": ["string", "string"] },
      { "heading": "string", "subheading": "string", "content": "string" },
      { "heading": "string", "subheading": "string", "content": "string" }
    ],
    "remedies": [
      { "title": "string", "description": "string", "mantra": "string", "ritualSteps": ["string", "string"] }
    ],
    "faqs": [
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" }
    ]
  },
  "english": {
    "title": "string",
    "seoTitle": "string (<=57 chars)",
    "metaDescription": "string (115-150 chars)",
    "primaryKeyword": "string",
    "secondaryKeywords": ["string", "string", "string"],
    "summary": "string",
    "sections": [
      { "heading": "string", "subheading": "string", "content": "string" },
      { "heading": "string", "subheading": "string", "content": "string" }
    ],
    "remedies": [
      { "title": "string", "description": "string", "mantra": "string", "ritualSteps": ["string", "string"] }
    ],
    "faqs": [
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" }
    ]
  }
}

ASTRONOMICAL & PANCHANGAM DATA FOR ${params.todayIso}:
${params.panchangamContext}

ACTIVE DEVOTEE TOPICS TO WEAVE NATURALLY (DO NOT CITE NEWS SOURCES OR USE THE WORD TRENDING):
${params.rssHeadlines.map((h) => scrubMediaAndTrendLabels(h)).filter(Boolean).join('\n')}
${params.geminiGroundedBrief ? `\nTOPIC BRIEF:\n${scrubMediaAndTrendLabels(params.geminiGroundedBrief)}` : ''}`;

  // Priority 1: OpenRouter / NousResearch Hermes 3 (or custom HERMES_API_KEY)
  const hermesKey = process.env.HERMES_API_KEY || process.env.OPENROUTER_API_KEY;
  if (hermesKey) {
    try {
      const endpoint =
        process.env.HERMES_API_BASE || 'https://openrouter.ai/api/v1/chat/completions';
      const model =
        process.env.HERMES_MODEL || 'nousresearch/hermes-3-llama-3.1-405b';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hermesKey}`,
        },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.45,
          response_format: { type: 'json_object' },
        }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const raw = data.choices?.[0]?.message?.content || '';
        const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        if (cleaned) {
          return {
            ...JSON.parse(cleaned),
            engineLabel: `Nous Hermes Agent (${model})`,
          };
        }
      }
    } catch (err) {
      console.warn('⚠️ [Hermes Trend SEO] OpenRouter/Hermes call skipped:', err instanceof Error ? err.message : err);
    }
  }

  // Priority 2: Server-Side @google/genai (gemini-4-hydrogen)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && !geminiKey.includes('MY_GEMINI_API_KEY')) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const resp = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const raw = (resp.text || '').replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      if (raw) {
        return {
          ...JSON.parse(raw),
          engineLabel: 'Hermes Workflow + Gemini 4 Search Grounding',
        };
      }
    } catch (err) {
      console.warn('⚠️ [Hermes Trend SEO] Gemini structured generation fallback:', err instanceof Error ? err.message : err);
    }
  }

  return null;
}

function buildDeterministicTrendBundle(params: {
  todayIso: string;
  slug: string;
  heroImage: string;
  day: ReturnType<typeof getOrGenerateDayData>;
  sunrise: string;
  sunset: string;
  topFortunes: ReturnType<typeof getDailyRashiFortunes>;
  nextVrataLabelTe: string;
  nextVrataLabelEn: string;
  themesTe: string[];
  themesEn: string[];
  narrativeTe: string;
  narrativeEn: string;
}): GeneratedTrendBundle {
  const {
    todayIso,
    slug,
    heroImage,
    day,
    sunrise,
    sunset,
    topFortunes,
    nextVrataLabelTe,
    nextVrataLabelEn,
    themesTe,
    themesEn,
    narrativeTe,
    narrativeEn,
  } = params;

  const cleanTithi = day.panchanga.tithi.split('(')[0].split('-')[0].trim();
  const cleanNak = day.panchanga.nakshatram.split('(')[0].split('-')[0].trim();
  const top3Te = topFortunes.slice(0, 3).map((r) => r.teluguName).join(', ');
  const top3En = topFortunes.slice(0, 3).map((r) => r.englishName).join(', ');
  const deityTe = day.deity || 'శ్రీ మహాగణపతి & ఇష్టదైవం';

  const headlineTe = `${day.teediVaram} (${cleanTithi} • ${cleanNak}) – నేటి విశేష పంచాంగం, వ్రతాలు & రాశి ఫలాలు`;
  const headlineEn = `${todayIso} Telugu Panchangam (${cleanTithi}, ${cleanNak}) – Vrata, Muhurtham & Rashi Guide`;

  const seoTitleTe = clampLen(`${day.teediVaram} పంచాంగం – ${cleanTithi}, ${cleanNak}`, 58);
  const metaDescTe = clampLen(
    `${day.teediVaram} తెలుగు పంచాంగం: తిథి ${cleanTithi}, నక్షత్రం ${cleanNak}, అభిజిత్ ${day.shubha.abhijit}, రాహుకాలం ${day.ashubha.rahukalam}, ${top3Te} శుభ ఫలాలు.`,
    152
  );

  const seoTitleEn = clampLen(`Telugu Panchangam ${todayIso}: ${cleanTithi} & Muhurtham`, 58);
  const metaDescEn = clampLen(
    `Daily Telugu Panchangam for ${todayIso}: Tithi ${cleanTithi}, Nakshatra ${cleanNak}, Rahukalam ${day.ashubha.rahukalam}, Abhijit Muhurtham & Rashi Phalalu.`,
    152
  );

  const amruthaClauseTe = /లేవు/i.test(day.shubha.amrutha)
    ? `నేడు ప్రత్యేక అమృత ఘడియలు లేనప్పటికీ అభిజిత్ ముహూర్త బలం శుభకార్యాలకు అనుకూలంగా ఉంది.`
    : `అమృత ఘడియలు (${day.shubha.amrutha}) కూడా శుభారంభాలకు అత్యంత ప్రశస్తమైనవి.`;

  const article: VedicClassicalArticle = {
    slug,
    category: 'Daily Panchangam & Jyotisha',
    categoryTe: 'నేటి విశేష పంచాంగం',
    categoryEn: 'Daily Panchangam & Muhurtham',
    readTimeMinutes: 6,
    datePublished: todayIso,
    dateModified: todayIso,
    heroImage,
    imageAltTe: `${day.teediVaram} తెలుగు పంచాంగం – ${cleanTithi} తిథి, ${cleanNak} నక్షత్రం మరియు రాశి ఫల విశ్లేషణ`,
    imageAltEn: `Telugu Panchangam ${todayIso} showing ${cleanTithi} Tithi and ${cleanNak} Nakshatra highlights`,
    author: {
      nameTe: 'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ',
      nameEn: 'Brahmasri Jallavaram Sai Dheeraj Sharma',
      titleTe: 'శ్రీ లక్ష్మీ గణపతి జ్యోతిష్యాలయం, హైదరాబాద్',
      titleEn: 'Sri Lakshmi Ganapathi Jyothishalayam, Hyderabad',
    },
    telugu: {
      title: headlineTe,
      seoTitle: seoTitleTe,
      metaDescription: metaDescTe,
      primaryKeyword: `${day.teediVaram} పంచాంగం`,
      secondaryKeywords: [
        'నేటి తెలుగు పంచాంగం',
        `${cleanTithi} తిథి విశేషం`,
        `${cleanNak} నక్షత్ర ఫలితాలు`,
        'నేటి రాశి ఫలాలు తెలుగులో',
      ],
      summary: `${day.teediVaram} నాడు ${day.panchanga.samvatsaram} · ${day.panchanga.masam} · ${cleanTithi} తిథి మరియు ${cleanNak} నక్షత్ర ప్రాధాన్యతతో పాటు రాహుకాలం (${day.ashubha.rahukalam}), వర్జ్యం (${day.ashubha.varjyam}), అభిజిత్ శుభ ముహూర్తం (${day.shubha.abhijit}) మరియు రాబోయే వ్రత–ముహూర్త విశేషాల సంపూర్ణ విశ్లేషణ.`,
      sections: [
        {
          heading: `1. ${day.teediVaram} — నేటి పంచాంగ విశేషాలు, వ్రత నియమాలు & శుభ సమయాలు`,
          subheading: `${cleanTithi} తిథి • ${cleanNak} నక్షత్రం • ${day.panchanga.yogam.replace(/\s*యోగం$/i, '')} యోగం`,
          content: `${narrativeTe}\n\nదృక్సిద్ధాంత గణిత ప్రమాణం ప్రకారం నేడు సూర్యోదయం ${sunrise}, సూర్యాస్తమయం ${sunset}గా ఉంది. ${day.chandra.sancharam} ${day.chandra.chandrashtamam} మిగిలిన రాశుల వారు తమ జన్మ నక్షత్ర తారాబలాన్ని సరిచూసుకొని నూతన కార్యాలు, ప్రయాణాలు చేపట్టడం ఉత్తమం. శుభకార్యాల కోసం పగలు అభిజిత్ ముహూర్తం (${day.shubha.abhijit}) అత్యంత ప్రశస్తమైనది. ${amruthaClauseTe}`,
          shloka: {
            sanskrit: 'తిథిర్విష్ణుః తథా వారో నక్షత్రం శంకరః స్మృతః | యోగశ్చ ధనదో జ్ఞేయః కరణం సర్వసిద్ధిదమ్ ||',
            meaning: 'పంచాంగంలోని తిథి శ్రీమహావిష్ణు స్వరూపం, వారం-నక్షత్రం శివశక్తి స్వరూపాలు, యోగం ధనప్రదాయకం మరియు కరణం సకల కార్యసిద్ధిని ఇస్తుంది.',
          },
          table: {
            headers: ['పంచాంగ అంశం', 'నేటి ఖచ్చితమైన సమయం / వివరం (IST)'],
            rows: [
              ['తేదీ & వారం', day.teediVaram],
              ['సంవత్సరం & మాసం', `${day.panchanga.samvatsaram} • ${day.panchanga.masam}`],
              ['తిథి (Tithi)', day.panchanga.tithi],
              ['నక్షత్రం (Nakshatram)', day.panchanga.nakshatram],
              ['యోగం & కరణం', `${day.panchanga.yogam} / ${day.panchanga.karanam}`],
              ['అభిజిత్ శుభ ముహూర్తం', day.shubha.abhijit],
              ['అమృత ఘడియలు', day.shubha.amrutha],
              ['రాహుకాలం (వర్జించవలసినది)', day.ashubha.rahukalam],
              ['యమగండం & వర్జ్యం', `${day.ashubha.yamagandam} | ${day.ashubha.varjyam}`],
            ],
          },
        },
        {
          heading: '2. నేటి గ్రహ స్థితిలో అత్యధిక శుభ ఫలితాలు పొందే రాశులు',
          subheading: `విజయ యోగం ఉన్న రాశులు: ${top3Te}`,
          content: `నేటి చంద్ర స్థితి (${day.chandra.sancharam}) మరియు గోచార బలం ఆధారంగా ${top3Te} రాశుల వారికి ధనలాభం, ఉద్యోగ ప్రగతి మరియు కుటుంబ సంతోషం ప్రబలంగా కనిపిస్తున్నాయి. ${day.phalitham}\n\nపూర్తి 12 రాశుల ఫలితాలు తెలుసుకోవడానికి నేటి రాశి ఫలాలు విభాగాన్ని, అలాగే మీ జన్మ నక్షత్రం ప్రకారం వ్యక్తిగత బలం కోసం ఉచిత 37-అధ్యాయాల జన్మ కుండలి PDF సేవను ఉపయోగించుకోండి.`,
          keyPoints: topFortunes.slice(0, 4).map(
            (r) =>
              `${r.teluguName}: ${r.statusLabel} (${r.houseLabel}) — శుభ సమయం: ${
                r.grahaDrishtiTimeTe || day.shubha.abhijit
              }, పరిహారం: ${r.remedy}`
          ),
        },
        {
          heading: '3. రాబోయే ముఖ్య వ్రతాలు, ఏకాదశి & శుభ ముహూర్త అప్‌డేట్స్',
          subheading: `తదుపరి విశేష తిథి: ${nextVrataLabelTe}`,
          content: `రాబోయే రోజుల్లో ${nextVrataLabelTe} వంటి పుణ్య తిథులు రానున్నందున, గృహ ప్రవేశం, వివాహ నిశ్చితార్థం, నామకరణం లేదా నూతన వ్యాపార ప్రారంభం చేయదలచిన వారు వ్యక్తిగత తారాబలం–చంద్రబలం సరిచూసుకొని ముహూర్తం నిర్ణయించుకోవాలి.\n\nవ్యక్తిగత జాతక పరిశీలన లేదా ముహూర్త నిర్ణయం కోసం బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిని WhatsApp (+91 89779 86166) ద్వారా సంప్రదించవచ్చు.`,
        },
      ],
      remedies: [
        {
          title: `నేటి ప్రత్యేక దైవారాధన (${deityTe})`,
          description: `${cleanTithi} తిథి మరియు ${cleanNak} నక్షత్ర శుభ ప్రవాహాన్ని పొందేందుకు ప్రాతఃకాలంలో స్నానానంతరం దీపారాధన చేసి సంకల్పం చెప్పుకోవాలి.`,
          mantra: 'ఓం శ్రీ లక్ష్మీ గణపతయే నమః | ఓం నమో భగవతే వాసుదేవాయ ||',
          ritualSteps: [
            `రాహుకాలం (${day.ashubha.rahukalam}) మరియు వర్జ్యం (${day.ashubha.varjyam}) సమయాల్లో కొత్త ఒప్పందాలు లేదా ప్రయాణాలు ప్రారంభించకండి.`,
            `అభిజిత్ ముహూర్తం (${day.shubha.abhijit}) లో కీలక పనులు లేదా దైవ ప్రార్థన ప్రారంభించండి.`,
          ],
        },
      ],
      faqs: [
        {
          question: `${day.teediVaram} నాడు శుభకార్యాలకు అనుకూల సమయం ఏది?`,
          answer: `నేడు అభిజిత్ ముహూర్తం (${day.shubha.abhijit}) మరియు అమృత ఘడియలు (${day.shubha.amrutha}) శుభకార్యాలకు ప్రశస్తమైన సమయాలు.`,
        },
        {
          question: `నేటి రాహుకాలం & వర్జ్యం ఎప్పుడు ఉంటాయి?`,
          answer: `నేటి రాహుకాలం ${day.ashubha.rahukalam} మరియు వర్జ్యం ${day.ashubha.varjyam}. ఈ సమయాల్లో నూతన శుభ ఆరంభాలను వాయిదా వేయడం మంచిది.`,
        },
        {
          question: `నేటి రాశి ఫలాలలో ఏ రాశులకు అదృష్టం బాగుంది?`,
          answer: `నేటి గ్రహ సంచారం ప్రకారం ${top3Te} రాశుల వారికి విశేష యోగం మరియు ఆర్థిక-వృత్తిపరమైన అనుకూలతలు ఉన్నాయి.`,
        },
      ],
    },
    english: {
      title: headlineEn,
      seoTitle: seoTitleEn,
      metaDescription: metaDescEn,
      primaryKeyword: `Telugu Panchangam ${todayIso}`,
      secondaryKeywords: [
        'Today Telugu Panchangam',
        `${cleanTithi} Tithi Timings`,
        `${cleanNak} Nakshatra Today`,
        'Rashi Phalalu in Telugu',
      ],
      summary: `Verified Drik Siddhanta Telugu Panchangam guide for ${todayIso}: Tithi (${cleanTithi}), Nakshatra (${cleanNak}), Rahukalam (${day.ashubha.rahukalam}), Abhijit Muhurtham (${day.shubha.abhijit}), upcoming ${nextVrataLabelEn}, and top-performing Rashi Phalalu.`,
      sections: [
        {
          heading: `1. Today's Verified Drik Siddhanta Panchangam (${todayIso})`,
          subheading: `Tithi: ${cleanTithi} | Nakshatra: ${cleanNak}`,
          content: `${narrativeEn} Today's solar and lunar calculations show Sunrise at ${sunrise} and Sunset at ${sunset} (IST). Abhijit Muhurtham spans ${day.shubha.abhijit}, while Rahukalam falls at ${day.ashubha.rahukalam}. Devotees observing ${nextVrataLabelEn} can combine daily Tarabalam with their natal Rashi for auspicious action.`,
        },
        {
          heading: `2. Auspicious Rashi Phalalu, Rajayoga & Muhurtham Timings`,
          subheading: `Strongest Moon & Transit Support: ${top3En}`,
          content: `Based on today's Chandra Sancharam and Drik Bhava calculations, ${top3En} receive elevated positive transit support (${themesEn.slice(0, 2).join('; ')}). Check your personalized Free 37-Chapter Janma Kundali PDF or consult Brahmasri Jallavaram Sai Dheeraj Sharma via WhatsApp (+91 89779 86166) for personal Muhurtham or Vivaha Kundali matching.`,
        },
      ],
      remedies: [
        {
          title: 'Daily Sankalpam & Muhurtham Discipline',
          description: `Initiate high-priority tasks during Abhijit Muhurtham (${day.shubha.abhijit}) and avoid new starts during Rahukalam (${day.ashubha.rahukalam}).`,
          mantra: 'Om Sri Lakshmi Ganapataye Namah ||',
          ritualSteps: [
            'Offer morning lamp lighting facing East after bath.',
            'Recite Daily Nitya Sankalpam suited for India or USA EST/CST/PST.',
          ],
        },
      ],
      faqs: [
        {
          question: `What is today's Tithi and Nakshatra on ${todayIso}?`,
          answer: `Today's Tithi is ${day.panchanga.tithi} and Nakshatra is ${day.panchanga.nakshatram} per Drik Siddhanta.`,
        },
        {
          question: `What are Rahukalam and Abhijit Muhurtham on ${todayIso}?`,
          answer: `Rahukalam is ${day.ashubha.rahukalam} and Abhijit Muhurtham is ${day.shubha.abhijit}.`,
        },
      ],
    },
  };

  return {
    headlineTe,
    headlineEn,
    seoSummaryTe: `${narrativeTe} నేటి శుభ సమయం: ${day.shubha.abhijit} | రాహుకాలం: ${day.ashubha.rahukalam} | అనుకూల రాశులు: ${top3Te}.`,
    seoSummaryEn: `Daily Telugu Panchangam guidance for ${todayIso}: ${cleanTithi} Tithi, ${cleanNak} Nakshatra, Abhijit Muhurtham ${day.shubha.abhijit}, spotlight on ${top3En}. ${narrativeEn}`,
    trendingKeywordsTe: [
      'నేటి తెలుగు పంచాంగం',
      `${cleanTithi} తిథి & ${cleanNak}`,
      `${nextVrataLabelTe}`,
      'నేటి రాశి ఫలాలు & రాజయోగం',
    ],
    trendingKeywordsEn: [
      `Telugu Panchangam ${todayIso}`,
      `${cleanTithi} Tithi Today`,
      nextVrataLabelEn,
      'Daily Rashi Phalalu Telugu',
    ],
    article,
    engineLabel: 'Hermes Vedic Topic Intelligence + Drik Siddhanta Astronomy',
  };
}

async function main() {
  const todayIso = getTodayIsoDateIST();
  const forceRun = process.argv.includes('--force');
  console.log(`🤖 [Hermes Trend SEO Writer] Researching daily search trends for ${todayIso} (IST)...`);

  const day = getOrGenerateDayData(todayIso, WEEK_DATA);
  const cityLocal = computeCityLocalPanchangam(todayIso, 'hyderabad');
  const statusScore = (s: 'favorable' | 'mixed' | 'caution') =>
    s === 'favorable' ? 2 : s === 'mixed' ? 1 : 0;
  const fortunes = [...getDailyRashiFortunes(day)].sort(
    (a, b) => statusScore(b.status) - statusScore(a.status)
  );
  const [y, m] = todayIso.split('-').map(Number);
  const months = generate12MonthVratasAndFestivals(y || 2026, (m || 11) - 1, 2);
  const upcomingVrata = months
    .flatMap((g) => g.events)
    .find((ev) => ev.isoDate >= todayIso);

  const nextVrataLabelTe = upcomingVrata
    ? `${upcomingVrata.titleTe} (${upcomingVrata.isoDate})`
    : 'కార్తీక & మార్గశిర శుభ వ్రతాలు';
  const nextVrataLabelEn = upcomingVrata
    ? `${upcomingVrata.titleEn} (${upcomingVrata.isoDate})`
    : 'Upcoming Ekadashi & Vrata Dates';

  const { rssItems, geminiGroundedBrief } = await gatherLiveSearchTrends(todayIso);
  console.log(`📡 [Hermes Trend SEO Writer] Fetched ${rssItems.length} live India & Telugu trend headlines.`);

  const slug = `daily-panchangam-vishesham-${todayIso}`;
  const dateSeed = todayIso.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const heroImage = VERIFIED_ARTICLE_IMAGES[dateSeed % VERIFIED_ARTICLE_IMAGES.length];

  const distilled = distillVedicThemesFromSignals({
    rssHeadlines: rssItems.map((i) => i.title),
    geminiGroundedBrief,
    masamTe: day.panchanga.masam,
    nextVrataLabelTe,
    nextVrataLabelEn,
  });

  const baseBundle = buildDeterministicTrendBundle({
    todayIso,
    slug,
    heroImage,
    day,
    sunrise: cityLocal.sunrise,
    sunset: cityLocal.sunset,
    topFortunes: fortunes,
    nextVrataLabelTe,
    nextVrataLabelEn,
    themesTe: distilled.themesTe,
    themesEn: distilled.themesEn,
    narrativeTe: distilled.narrativeTe,
    narrativeEn: distilled.narrativeEn,
  });

  const panchangamContext = [
    `Date: ${todayIso} (${day.teediVaram})`,
    `Samvatsaram & Masam: ${day.panchanga.samvatsaram}, ${day.panchanga.masam}`,
    `Tithi: ${day.panchanga.tithi}`,
    `Nakshatram: ${day.panchanga.nakshatram}`,
    `Yogam / Karanam: ${day.panchanga.yogam} / ${day.panchanga.karanam}`,
    `Sunrise / Sunset: ${cityLocal.sunrise} / ${cityLocal.sunset}`,
    `Abhijit Muhurtham: ${day.shubha.abhijit} | Amrutha Gadiyalu: ${day.shubha.amrutha}`,
    `Rahukalam: ${day.ashubha.rahukalam} | Varjyam: ${day.ashubha.varjyam}`,
    `Top 3 Rashis Today: ${fortunes.slice(0, 3).map((r) => `${r.teluguName} (${r.englishName})`).join(', ')}`,
    `Next Upcoming Festival/Vrata: ${nextVrataLabelTe} / ${nextVrataLabelEn}`,
  ].join('\n');

  const llmOutput = await generateWithLlmOrNull({
    todayIso,
    slug,
    heroImage,
    panchangamContext,
    rssHeadlines: rssItems.map((i) => i.title),
    geminiGroundedBrief,
  });

  const finalArticle: VedicClassicalArticle = {
    ...baseBundle.article,
    ...(llmOutput?.telugu
      ? {
          telugu: {
            ...baseBundle.article.telugu,
            ...llmOutput.telugu,
            title: scrubMediaAndTrendLabels(llmOutput.telugu.title || baseBundle.article.telugu.title),
            summary: scrubMediaAndTrendLabels(llmOutput.telugu.summary || baseBundle.article.telugu.summary),
            seoTitle: clampLen(
              scrubMediaAndTrendLabels(llmOutput.telugu.seoTitle || baseBundle.article.telugu.seoTitle),
              58
            ),
            metaDescription: clampLen(
              scrubMediaAndTrendLabels(
                llmOutput.telugu.metaDescription || baseBundle.article.telugu.metaDescription
              ),
              154
            ),
            sections:
              Array.isArray(llmOutput.telugu.sections) && llmOutput.telugu.sections.length > 0
                ? llmOutput.telugu.sections.map((s) => ({
                    ...s,
                    heading: scrubMediaAndTrendLabels(s.heading),
                    subheading: s.subheading ? scrubMediaAndTrendLabels(s.subheading) : undefined,
                    content: scrubMediaAndTrendLabels(s.content),
                  }))
                : baseBundle.article.telugu.sections,
            remedies:
              Array.isArray(llmOutput.telugu.remedies) && llmOutput.telugu.remedies.length > 0
                ? llmOutput.telugu.remedies
                : baseBundle.article.telugu.remedies,
            faqs:
              Array.isArray(llmOutput.telugu.faqs) && llmOutput.telugu.faqs.length > 0
                ? llmOutput.telugu.faqs
                : baseBundle.article.telugu.faqs,
          },
        }
      : {}),
    ...(llmOutput?.english
      ? {
          english: {
            ...baseBundle.article.english,
            ...llmOutput.english,
            title: scrubMediaAndTrendLabels(llmOutput.english.title || baseBundle.article.english.title),
            summary: scrubMediaAndTrendLabels(llmOutput.english.summary || baseBundle.article.english.summary),
            seoTitle: clampLen(
              scrubMediaAndTrendLabels(llmOutput.english.seoTitle || baseBundle.article.english.seoTitle),
              58
            ),
            metaDescription: clampLen(
              scrubMediaAndTrendLabels(
                llmOutput.english.metaDescription || baseBundle.article.english.metaDescription
              ),
              154
            ),
            sections:
              Array.isArray(llmOutput.english.sections) && llmOutput.english.sections.length > 0
                ? llmOutput.english.sections.map((s) => ({
                    ...s,
                    heading: scrubMediaAndTrendLabels(s.heading),
                    subheading: s.subheading ? scrubMediaAndTrendLabels(s.subheading) : undefined,
                    content: scrubMediaAndTrendLabels(s.content),
                  }))
                : baseBundle.article.english.sections,
            remedies:
              Array.isArray(llmOutput.english.remedies) && llmOutput.english.remedies.length > 0
                ? llmOutput.english.remedies
                : baseBundle.article.english.remedies,
            faqs:
              Array.isArray(llmOutput.english.faqs) && llmOutput.english.faqs.length > 0
                ? llmOutput.english.faqs
                : baseBundle.article.english.faqs,
          },
        }
      : {}),
  };

  // Update src/data/dailyTrendingArticles.json (dedup by slug/datePublished, keep latest 14 days)
  const articlesPath = path.resolve(process.cwd(), 'src/data/dailyTrendingArticles.json');
  let existingArticles: VedicClassicalArticle[] = [];
  if (fs.existsSync(articlesPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
      if (Array.isArray(parsed)) existingArticles = parsed;
    } catch {
      existingArticles = [];
    }
  }

  const alreadyHasToday = existingArticles.some((a) => a.slug === slug);
  if (!alreadyHasToday || forceRun || existingArticles.length === 0) {
    const filtered = existingArticles.filter(
      (a) => a.slug !== slug && a.datePublished !== todayIso
    );
    const updatedArticles = [finalArticle, ...filtered].slice(0, 14);
    fs.writeFileSync(articlesPath, JSON.stringify(updatedArticles, null, 2) + '\n', 'utf-8');
    console.log(`✍️ [Hermes SEO Writer] Published daily Panchangam article -> /${slug} (${updatedArticles.length} daily articles stored)`);
  } else {
    console.log(`ℹ️ [Hermes SEO Writer] Article for ${todayIso} already exists (/${slug}). Use --force to regenerate.`);
  }

  // Update src/data/dailyTrendingSeoData.json (strictly scrubbed: zero newspaper names or 'Trending' labels)
  const seoDataPath = path.resolve(process.cwd(), 'src/data/dailyTrendingSeoData.json');
  const trendingData: DailyTrendingSeoData = {
    dateIso: todayIso,
    generatedAtUtc: new Date().toISOString(),
    engine: llmOutput?.engineLabel || baseBundle.engineLabel,
    trendingKeywordsTe:
      Array.isArray(llmOutput?.trendingKeywordsTe) && llmOutput.trendingKeywordsTe.length > 0
        ? llmOutput.trendingKeywordsTe.map(scrubMediaAndTrendLabels).filter(Boolean).slice(0, 6)
        : baseBundle.trendingKeywordsTe,
    trendingKeywordsEn:
      Array.isArray(llmOutput?.trendingKeywordsEn) && llmOutput.trendingKeywordsEn.length > 0
        ? llmOutput.trendingKeywordsEn.map(scrubMediaAndTrendLabels).filter(Boolean).slice(0, 6)
        : baseBundle.trendingKeywordsEn,
    headlineTe: scrubMediaAndTrendLabels(llmOutput?.headlineTe || baseBundle.headlineTe),
    headlineEn: scrubMediaAndTrendLabels(llmOutput?.headlineEn || baseBundle.headlineEn),
    seoSummaryTe: scrubMediaAndTrendLabels(llmOutput?.seoSummaryTe || baseBundle.seoSummaryTe),
    seoSummaryEn: scrubMediaAndTrendLabels(llmOutput?.seoSummaryEn || baseBundle.seoSummaryEn),
    topTrendingRashiTe: fortunes.slice(0, 3).map((r) => r.teluguName).join(', '),
    linkedArticleSlug: slug,
    focusThemesTe: distilled.themesTe,
    focusThemesEn: distilled.themesEn,
  };

  fs.writeFileSync(seoDataPath, JSON.stringify(trendingData, null, 2) + '\n', 'utf-8');
  console.log(`✅ [Hermes SEO Writer] Updated dailyTrendingSeoData.json via ${trendingData.engine}`);
}

main().catch((err) => {
  console.error('❌ [Hermes Trend SEO Writer] Failed:', err);
  process.exit(1);
});
