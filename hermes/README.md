# Hermes Agent Integration (`NousResearch/hermes-agent`)

This repository integrates **Nous Research's Hermes Agent** workflow in two ways:

1. **Zero-Server Automatic GitHub Action (Already Active):**
   - `.github/workflows/daily-seo-autopilot.yml` runs every night at **9:45 PM IST**.
   - Executes `npm run seo:trend-writer` (`scripts/hermesTrendSeoWriter.ts`) to fetch live Google Trends India + Telugu Astrology News + Drik Siddhanta Panchangam, generate today's trending SEO Panchangam insight & full-ranking bilingual article (using `OPENROUTER_API_KEY` / Nous Hermes or `GEMINI_API_KEY` with Google Search grounding), rebuild 550+ static HTML pages, verify `OpenSEO Score 100/100`, push to GitHub/Vercel, and report on Telegram.

2. **Optional VPS / Local Hermes Agent CLI + Telegram Gateway:**
   ```bash
   # 1. Install Hermes Agent
   curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

   # 2. Install this repo's custom SEO Panchangam Writer skill
   mkdir -p ~/.hermes/skills/telugu-seo-panchangam-writer
   cp hermes/skills/telugu-seo-panchangam-writer/SKILL.md ~/.hermes/skills/telugu-seo-panchangam-writer/

   # 3. Schedule unattended daily run or chat via Telegram
   hermes gateway
   ```
