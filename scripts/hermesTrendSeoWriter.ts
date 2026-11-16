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
  liveTrendSources: { title: string; source: string; link: string }[];
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
  const prompt = `You are Hermes Agent acting as an authoritative Vedic Jyotisha Scholar (Brahmasri Jallavaram Sai Dheeraj Sharma, Sri Lakshmi Ganapathi Jyothishalayam, Hyderabad - www.telugujyothisham.com, WhatsApp +91 89779 86166).
Write high-ranking, culturally authentic Telugu & English SEO content aligned with TODAY's real Drik Siddhanta Panchangam and live search trends.

CRITICAL RULES:
1. NEVER invent or alter Tithi, Nakshatram, Yogam, Karanam, Rahukalam, or Muhurtham timings — strictly use ONLY the astronomical facts provided below.
2. "seoTitle" MUST be 42 to 57 characters max (never exceed 58 chars!).
3. "metaDescription" MUST be 110 to 150 characters max.
4. Keep both Telugu (rich traditional Telugu script) and English completely coherent, informative, zero clickbait, and aligned with Classical Parashara / Surya Siddhanta / Muhurtha Chintamani principles.
5. Output STRICTLY valid JSON matching this schema (no markdown fences):
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

LIVE SEARCH TRENDS & HEADLINES:
${params.rssHeadlines.join('\n')}
${params.geminiGroundedBrief ? `\nSEARCH GROUNDED BRIEF:\n${params.geminiGroundedBrief}` : ''}`;

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
  rssHeadlines: string[];
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
    rssHeadlines,
  } = params;

  const cleanTithi = day.panchanga.tithi.split('(')[0].split('-')[0].trim();
  const cleanNak = day.panchanga.nakshatram.split('(')[0].split('-')[0].trim();
  const top3Te = topFortunes.slice(0, 3).map((r) => r.teluguName).join(', ');
  const top3En = topFortunes.slice(0, 3).map((r) => r.englishName).join(', ');
  const deityTe = day.deity || 'శ్రీ మహాగణపతి & ఇష్టదైవం';

  const headlineTe = `${day.teediVaram} (${cleanTithi} • ${cleanNak}) – నేటి ట్రెండింగ్ పంచాంగం & రాశి ఫలాలు`;
  const headlineEn = `${todayIso} Telugu Panchangam (${cleanTithi}, ${cleanNak}) – Trending Vrata & Rashi Guide`;

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

  const trendHighlightsText =
    rssHeadlines.length > 0
      ? `నేటి భారతదేశ/తెలుగు సెర్చ్ ట్రెండ్స్ (${rssHeadlines.slice(0, 3).join(' | ')}) మరియు దృక్సిద్ధాంత గ్రహ స్థితి ఆధారంగా భక్తులు ప్రధానంగా తిథి-నక్షత్ర బలం, వివాహ/గృహ ముహూర్తాలు మరియు దోష పరిహారాల కోసం అన్వేషిస్తున్నారు.`
      : `నేడు ${day.panchanga.masam}లో ${cleanTithi} తిథి, ${cleanNak} నక్షత్రం కలయిక వల్ల పూజా సంకల్పాలు, నవగ్రహ శాంతి మరియు శుభకార్య ముహూర్తాలపై భక్తులలో అధిక ఆసక్తి నెలకొంది.`;

  const article: VedicClassicalArticle = {
    slug,
    category: 'Daily Trend Panchangam',
    categoryTe: 'నేటి ట్రెండింగ్ పంచాంగం',
    categoryEn: 'Daily Trend Panchangam SEO',
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
      summary: `${day.teediVaram} నాడు ${day.panchanga.samvatsaram} · ${day.panchanga.masam} · ${cleanTithi} తిథి మరియు ${cleanNak} నక్షత్ర ప్రాధాన్యతతో పాటు రాహుకాలం (${day.ashubha.rahukalam}), వర్జ్యం (${day.ashubha.varjyam}), అభిజిత్ శుభ ముహూర్తం (${day.shubha.abhijit}) మరియు రాబోయే వ్రత/ముహూర్త విశేషాల సంపూర్ణ SEO విశ్లేషణ.`,
      sections: [
        {
          heading: `1. ${day.teediVaram} — నేటి ట్రెండింగ్ పంచాంగం & ముఖ్య సమయాలు`,
          subheading: `${cleanTithi} తిథి • ${cleanNak} నక్షత్రం • ${day.panchanga.yogam} యోగం`,
          content: `${trendHighlightsText}\n\nదృక్సిద్ధాంత గణిత ప్రమాణం ప్రకారం నేడు సూర్యోదయం ${sunrise}, సూర్యాస్తమయం ${sunset}గా ఉంది. చంద్ర సంచారం ${day.chandra.sancharam}లో ఉండగా ${day.chandra.chandrashtamam} రాశి వారికి తారాబలం చూసి నూతన ప్రయాణాలు చేపట్టడం ఉత్తమం. శుభకార్యాల కోసం పగలు అభిజిత్ ముహూర్తం (${day.shubha.abhijit}) మరియు అమృత ఘడియలు (${day.shubha.amrutha}) అత్యంత ప్రశస్తమైనవి.`,
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
          content: `Today's solar and lunar calculations show Sunrise at ${sunrise} and Sunset at ${sunset} (IST). Abhijit Muhurtham spans ${day.shubha.abhijit}, while Rahukalam falls at ${day.ashubha.rahukalam}. Devotees looking up ${nextVrataLabelEn} can combine daily Tarabalam with their natal Rashi for auspicious action.`,
        },
        {
          heading: `2. Top Trending Rashi Phalalu & Lucky Windows`,
          subheading: `Strongest Moon & Transit Support: ${top3En}`,
          content: `Based on today's Chandra Sancharam and Drik Bhava calculations, ${top3En} receive elevated positive scores. Check your personalized Free 37-Chapter Janma Kundali PDF or consult Brahmasri Jallavaram Sai Dheeraj Sharma via WhatsApp (+91 89779 86166) for personal Muhurtham or Vivaha Kundali matching.`,
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
    seoSummaryTe: `${trendHighlightsText} నేటి శుభ సమయం: ${day.shubha.abhijit} | రాహుకాలం: ${day.ashubha.rahukalam} | విశేష రాశులు: ${top3Te}.`,
    seoSummaryEn: `Daily Telugu Panchangam trend guide for ${todayIso}: ${cleanTithi} Tithi, ${cleanNak} Nakshatra, Abhijit Muhurtham ${day.shubha.abhijit}, and spotlight on ${top3En}.`,
    trendingKeywordsTe: [
      'నేటి తెలుగు పంచాంగం',
      `${cleanTithi} తిథి & ${cleanNak}`,
      `${nextVrataLabelTe}`,
      'నేటి రాశి ఫలాలు',
    ],
    trendingKeywordsEn: [
      `Telugu Panchangam ${todayIso}`,
      `${cleanTithi} Tithi Today`,
      nextVrataLabelEn,
      'Daily Rashi Phalalu Telugu',
    ],
    article,
    engineLabel: 'Hermes Trend RSS + Drik Siddhanta Astronomy',
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

  const slug = `daily-panchangam-trend-${todayIso}`;
  const dateSeed = todayIso.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const heroImage = VERIFIED_ARTICLE_IMAGES[dateSeed % VERIFIED_ARTICLE_IMAGES.length];

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
    rssHeadlines: rssItems.map((i) => i.title),
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
    rssHeadlines: rssItems.map((i) => `${i.source}: ${i.title}`),
    geminiGroundedBrief,
  });

  const finalArticle: VedicClassicalArticle = {
    ...baseBundle.article,
    ...(llmOutput?.telugu
      ? {
          telugu: {
            ...baseBundle.article.telugu,
            ...llmOutput.telugu,
            seoTitle: clampLen(llmOutput.telugu.seoTitle || baseBundle.article.telugu.seoTitle, 58),
            metaDescription: clampLen(
              llmOutput.telugu.metaDescription || baseBundle.article.telugu.metaDescription,
              154
            ),
            sections:
              Array.isArray(llmOutput.telugu.sections) && llmOutput.telugu.sections.length > 0
                ? llmOutput.telugu.sections
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
            seoTitle: clampLen(llmOutput.english.seoTitle || baseBundle.article.english.seoTitle, 58),
            metaDescription: clampLen(
              llmOutput.english.metaDescription || baseBundle.article.english.metaDescription,
              154
            ),
            sections:
              Array.isArray(llmOutput.english.sections) && llmOutput.english.sections.length > 0
                ? llmOutput.english.sections
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

  // Update src/data/dailyTrendingArticles.json (dedup by slug/date, keep latest 14 days)
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
    const filtered = existingArticles.filter((a) => a.slug !== slug);
    const updatedArticles = [finalArticle, ...filtered].slice(0, 14);
    fs.writeFileSync(articlesPath, JSON.stringify(updatedArticles, null, 2) + '\n', 'utf-8');
    console.log(`✍️ [Hermes Trend SEO Writer] Published trending SEO article -> /${slug} (${updatedArticles.length} trending articles stored)`);
  } else {
    console.log(`ℹ️ [Hermes Trend SEO Writer] Trending article for ${todayIso} already exists (/${slug}). Use --force to regenerate.`);
  }

  // Update src/data/dailyTrendingSeoData.json
  const seoDataPath = path.resolve(process.cwd(), 'src/data/dailyTrendingSeoData.json');
  const trendingData: DailyTrendingSeoData = {
    dateIso: todayIso,
    generatedAtUtc: new Date().toISOString(),
    engine: llmOutput?.engineLabel || baseBundle.engineLabel,
    trendingKeywordsTe:
      Array.isArray(llmOutput?.trendingKeywordsTe) && llmOutput.trendingKeywordsTe.length > 0
        ? llmOutput.trendingKeywordsTe.slice(0, 6)
        : baseBundle.trendingKeywordsTe,
    trendingKeywordsEn:
      Array.isArray(llmOutput?.trendingKeywordsEn) && llmOutput.trendingKeywordsEn.length > 0
        ? llmOutput.trendingKeywordsEn.slice(0, 6)
        : baseBundle.trendingKeywordsEn,
    headlineTe: llmOutput?.headlineTe || baseBundle.headlineTe,
    headlineEn: llmOutput?.headlineEn || baseBundle.headlineEn,
    seoSummaryTe: llmOutput?.seoSummaryTe || baseBundle.seoSummaryTe,
    seoSummaryEn: llmOutput?.seoSummaryEn || baseBundle.seoSummaryEn,
    topTrendingRashiTe: fortunes.slice(0, 3).map((r) => r.teluguName).join(', '),
    linkedArticleSlug: slug,
    liveTrendSources: rssItems.slice(0, 5),
  };

  fs.writeFileSync(seoDataPath, JSON.stringify(trendingData, null, 2) + '\n', 'utf-8');
  console.log(`✅ [Hermes Trend SEO Writer] Updated dailyTrendingSeoData.json via ${trendingData.engine}`);
}

main().catch((err) => {
  console.error('❌ [Hermes Trend SEO Writer] Failed:', err);
  process.exit(1);
});
