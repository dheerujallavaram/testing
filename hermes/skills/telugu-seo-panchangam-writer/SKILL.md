---
name: telugu-seo-panchangam-writer
description: Autonomous daily trend-research and Telugu/English SEO Panchangam & Vedic article writer for telugujyothisham.com using Nous Research Hermes Agent + OpenSEO + Drik Siddhanta astronomy.
version: 1.0.0
metadata:
  hermes:
    tags: [seo, panchangam, telugu, astrology, content-writer, open-seo]
    requires_tools: [terminal, web_search]
---

# Telugu SEO Panchangam & Article Writer (Hermes Agent Skill)

## Goal
Research live daily search trends in India, Andhra Pradesh, Telangana, and among USA Telugu NRIs, cross-reference today's Drik Siddhanta astronomical Panchangam and upcoming Vratas/Festivals, and automatically publish rank-ready Telugu + English Panchangam SEO content and deep articles to `telugujyothisham.com`.

## Daily Autonomous Workflow (9:30 PM IST)
1. **Live Trend Discovery**
   - Query current search trends in `IN` (`trends.google.com/trending/rss?geo=IN` + Telugu news/astrology queries for `Panchangam`, `Rashi Phalalu`, `Ekadashi`, `Karthika Masam`, `Vivaha Muhurtham`, `Janma Kundali`).
   - Inspect today's real astronomical Tithi, Nakshatram, Yogam, Karanam, Rahukalam, Varjyam, Abhijit Muhurtham, and top 3 Rashi fortunes using the project's Drik Siddhanta engine (`src/utils/astronomyPanchangam.ts`).
2. **Generate Daily Trending Panchangam + Full-Ranking Article**
   - Execute inside the repository root:
     ```bash
     npm run seo:trend-writer
     ```
   - Verify generated metadata complies with OpenSEO strict limits:
     - `seoTitle` <= 60 characters
     - `metaDescription` 120–156 characters
     - Strictly 1 `<h1>` per route, zero orphan pages, bilingual Telugu + English depth with Sanskrit Grantha shlokas and FAQPage Q&As.
3. **Sync Sitemap, Rebuild Static SSG Pages & Verify OpenSEO 100/100 Score**
   - Execute:
     ```bash
     npm run seo:daily && npm run build && npm run seo:audit
     ```
   - Confirm output reports `Score: 100/100`, `Critical: 0`, `Warnings: 0`.
4. **Publish & Report**
   - Commit updated `src/data/dailyTrendingSeoData.json`, `src/data/dailyTrendingArticles.json`, `index.html`, `public/sitemap.xml`, and `seo/daily-seo-report.md`, push to GitHub (auto-deploys to Vercel), and send summary to Telegram (`+91 89779 86166` desk).
