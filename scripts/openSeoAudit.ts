import fs from 'fs';
import path from 'path';

/**
 * OpenSEO-aligned Technical SEO & AI-Visibility Audit Engine
 * Models the exact issue taxonomy from github.com/every-app/open-seo
 * (critical / warning / info checks across rendered HTML in dist/ and sitemap.xml).
 */
export type OpenSeoSeverity = 'critical' | 'warning' | 'info';

export interface OpenSeoFinding {
  issueType: string;
  severity: OpenSeoSeverity;
  route: string;
  detail: string;
}

export interface OpenSeoAuditSummary {
  pagesAudited: number;
  sitemapUrls: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  score: number;
  findings: OpenSeoFinding[];
  aiVisibilityChecks: {
    hasLlmsTxt: boolean;
    hasLlmsFullTxt: boolean;
    robotsAllowsAiBots: boolean;
    hasJsonLdSchema: boolean;
  };
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function walkRouteIndexFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkRouteIndexFiles(fullPath, out);
    } else if (entry.name === 'index.html') {
      out.push(fullPath);
    }
  }
  return out;
}

export function runOpenSeoAudit(rootDir = process.cwd()): OpenSeoAuditSummary {
  const distDir = path.join(rootDir, 'dist');
  const publicDir = path.join(rootDir, 'public');
  const findings: OpenSeoFinding[] = [];

  const htmlFiles = walkRouteIndexFiles(distDir);
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  const internalTargets = new Set<string>();

  for (const filePath of htmlFiles) {
    let route =
      '/' +
      path
        .relative(distDir, filePath)
        .replace(/\\/g, '/')
        .replace(/\/index\.html$/, '')
        .replace(/^index\.html$/, '');
    if (!route) route = '/';

    const html = fs.readFileSync(filePath, 'utf-8');

    // 1. Title checks
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1]).trim() : '';
    if (!title) {
      findings.push({
        issueType: 'missing-title',
        severity: 'critical',
        route,
        detail: 'Missing <title> tag',
      });
    } else {
      if (title.length < 10) {
        findings.push({
          issueType: 'title-too-short',
          severity: 'info',
          route,
          detail: `Title is only ${title.length} chars`,
        });
      } else if (title.length > 60) {
        findings.push({
          issueType: 'title-too-long',
          severity: 'info',
          route,
          detail: `Title is ${title.length} chars (>60): ${title}`,
        });
      }
      const list = titleMap.get(title) || [];
      list.push(route);
      titleMap.set(title, list);
    }

    // 2. Meta description checks
    const descMatch = html.match(/<meta\s+name="description"[^>]*content="([^"]*)"/i);
    const desc = descMatch ? decodeHtmlEntities(descMatch[1]).trim() : '';
    if (!desc) {
      findings.push({
        issueType: 'missing-meta-description',
        severity: 'warning',
        route,
        detail: 'Missing meta description',
      });
    } else {
      if (desc.length < 70) {
        findings.push({
          issueType: 'meta-description-too-short',
          severity: 'info',
          route,
          detail: `Meta description too short (${desc.length} chars)`,
        });
      } else if (desc.length > 165) {
        findings.push({
          issueType: 'meta-description-too-long',
          severity: 'info',
          route,
          detail: `Meta description too long (${desc.length} chars)`,
        });
      }
      const list = descMap.get(desc) || [];
      list.push(route);
      descMap.set(desc, list);
    }

    // 3. Heading hierarchy & H1 checks
    const h1Count = [...html.matchAll(/<h1[\s>]/gi)].length;
    if (h1Count === 0) {
      findings.push({
        issueType: 'missing-h1',
        severity: 'warning',
        route,
        detail: 'Missing H1 heading',
      });
    } else if (h1Count > 1) {
      findings.push({
        issueType: 'multiple-h1',
        severity: 'warning',
        route,
        detail: `Found ${h1Count} H1 headings (expected exactly 1)`,
      });
    }

    const headings = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) {
        findings.push({
          issueType: 'heading-order-skip',
          severity: 'info',
          route,
          detail: `Heading jumps from H${headings[i - 1]} to H${headings[i]}`,
        });
        break;
      }
    }

    // 4. Visible text / thin-content check
    const visibleText = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = visibleText ? visibleText.split(' ').length : 0;
    if (wordCount < 180) {
      findings.push({
        issueType: 'thin-content',
        severity: 'warning',
        route,
        detail: `Only ${wordCount} visible static words`,
      });
    }

    // 5. Internal links & broken link check
    const links = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
    if (links.length === 0) {
      findings.push({
        issueType: 'no-outgoing-links',
        severity: 'warning',
        route,
        detail: 'Page has zero outgoing links',
      });
    }
    for (const href of links) {
      if (href.startsWith('/')) {
        const clean = href.split('#')[0].split('?')[0];
        internalTargets.add(clean);
        const rel = clean.slice(1);
        const exists =
          clean === '/' ||
          fs.existsSync(path.join(distDir, rel)) ||
          fs.existsSync(path.join(distDir, `${rel}.html`)) ||
          fs.existsSync(path.join(distDir, rel, 'index.html'));
        if (!exists) {
          findings.push({
            issueType: 'broken-internal-link',
            severity: 'critical',
            route,
            detail: `Broken internal link -> ${clean}`,
          });
        }
      }
    }

    // 6. Image alt check
    for (const img of html.matchAll(/<img\s+([^>]*)>/gi)) {
      if (!/alt="/i.test(img[1])) {
        findings.push({
          issueType: 'images-missing-alt',
          severity: 'warning',
          route,
          detail: 'Image tag missing alt attribute',
        });
        break;
      }
    }

    // 7. Canonical check
    if (!/<link\s+rel="canonical"/i.test(html)) {
      findings.push({
        issueType: 'canonical-conflict',
        severity: 'warning',
        route,
        detail: 'Missing <link rel="canonical"> tag',
      });
    }
  }

  // 8. Duplicate titles & descriptions
  for (const [title, routes] of titleMap.entries()) {
    if (routes.length > 1) {
      findings.push({
        issueType: 'duplicate-title',
        severity: 'warning',
        route: routes[0],
        detail: `Title shared by ${routes.length} pages: "${title}"`,
      });
    }
  }
  for (const [desc, routes] of descMap.entries()) {
    if (routes.length > 1) {
      findings.push({
        issueType: 'duplicate-meta-description',
        severity: 'warning',
        route: routes[0],
        detail: `Description shared by ${routes.length} pages`,
      });
    }
  }

  // 9. Orphan pages check against sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  let sitemapUrls: string[] = [];
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf-8');
    sitemapUrls = [
      ...xml.matchAll(/<loc>https:\/\/www\.telugujyothisham\.com([^<]*)<\/loc>/g),
    ].map((m) => m[1] || '/');
    for (const sUrl of sitemapUrls) {
      if (sUrl !== '/' && !internalTargets.has(sUrl)) {
        findings.push({
          issueType: 'orphan-page',
          severity: 'warning',
          route: sUrl,
          detail: 'In sitemap.xml but not linked from any crawled internal page',
        });
      }
    }
  }

  // 10. AI Visibility & Crawler checks
  const hasLlmsTxt = fs.existsSync(path.join(publicDir, 'llms.txt'));
  const hasLlmsFullTxt = fs.existsSync(path.join(publicDir, 'llms-full.txt'));
  const robotsTxt = fs.existsSync(path.join(publicDir, 'robots.txt'))
    ? fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf-8')
    : '';
  const robotsAllowsAiBots =
    /GPTBot/i.test(robotsTxt) &&
    /PerplexityBot/i.test(robotsTxt) &&
    /ClaudeBot/i.test(robotsTxt);
  const rootHtml = fs.existsSync(path.join(distDir, 'index.html'))
    ? fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')
    : '';
  const hasJsonLdSchema = /<script type="application\/ld\+json"/i.test(rootHtml);

  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const warningCount = findings.filter((f) => f.severity === 'warning').length;
  const infoCount = findings.filter((f) => f.severity === 'info').length;

  const penalty = criticalCount * 10 + warningCount * 2 + Math.min(infoCount, 10) * 0.5;
  const score = Math.max(0, Math.round(100 - penalty));

  return {
    pagesAudited: htmlFiles.length,
    sitemapUrls: sitemapUrls.length,
    criticalCount,
    warningCount,
    infoCount,
    score,
    findings,
    aiVisibilityChecks: {
      hasLlmsTxt,
      hasLlmsFullTxt,
      robotsAllowsAiBots,
      hasJsonLdSchema,
    },
  };
}

if (process.argv[1]?.includes('openSeoAudit')) {
  const result = runOpenSeoAudit();
  const payload = {
    generatedAtUtc: new Date().toISOString(),
    ...result,
    findings: result.findings.slice(0, 30),
  };

  try {
    const seoDir = path.resolve(process.cwd(), 'seo');
    if (!fs.existsSync(seoDir)) fs.mkdirSync(seoDir, { recursive: true });
    fs.writeFileSync(
      path.join(seoDir, 'open-seo-report.json'),
      JSON.stringify(payload, null, 2),
      'utf-8'
    );
  } catch {
    // Non-fatal in read-only environments
  }

  console.log(JSON.stringify(payload, null, 2));
  if (result.criticalCount > 0) {
    process.exit(1);
  }
}
