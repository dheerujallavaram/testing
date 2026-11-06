import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { buildRouteHtmlFromTemplate } from './scripts/prerender-ssg';
import { generateRobotsTxt, generateSitemapXML } from './scripts/generate-sitemap';

const PERMANENT_REDIRECTS: Record<string, string> = {
  '/neti-panchangam': '/panchangam',
  '/today-panchangam-in-telugu': '/panchangam',
  '/ee-roju-panchangam': '/panchangam',
  '/privacy': '/privacy-policy',
  '/awards': '/about',
};

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'telugu-jyothisham-ssr-seo-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const rawUrl = req.url || '/';
            const pathname = rawUrl.split('?')[0].replace(/\/+$/, '') || '/';
            const hostHeader = (req.headers.host || '').toLowerCase();

            // Non-www -> www 308 Permanent Redirect
            if (hostHeader === 'telugujyothisham.com') {
              res.statusCode = 308;
              res.setHeader('Location', `https://www.telugujyothisham.com${rawUrl}`);
              res.end();
              return;
            }

            // Duplicate intent & retired routes 301 Permanent Redirects
            const redirectTarget = PERMANENT_REDIRECTS[pathname];
            if (redirectTarget) {
              res.statusCode = 301;
              res.setHeader('Location', redirectTarget);
              res.end();
              return;
            }

            // Direct PDF Static Serving
            if (pathname.endsWith('.pdf')) {
              const filePath = path.join(process.cwd(), 'public', pathname.replace(/^\//, ''));
              if (fs.existsSync(filePath)) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
                res.end(fs.readFileSync(filePath));
                return;
              }
            }

            // Dynamic Sitemap XML
            if (pathname === '/sitemap.xml') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/xml; charset=utf-8');
              res.end(generateSitemapXML());
              return;
            }

            // Dynamic Robots TXT
            if (pathname === '/robots.txt') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.end(generateRobotsTxt());
              return;
            }

            next();
          });
        },
        transformIndexHtml: {
          order: 'pre',
          handler(html, ctx) {
            const rawPath = (ctx.originalUrl || ctx.path || '/').split('?')[0];
            const routePath =
              rawPath === '/index.html' || rawPath === ''
                ? '/'
                : rawPath.replace(/\/+$/, '') || '/';
            return buildRouteHtmlFromTemplate(html, routePath);
          },
        },
      },
      {
        name: 'telegram-bot-auto-daemon',
        configureServer() {
          if (process.env.ENABLE_TELEGRAM_POLLING === 'true') {
            import('./scripts/telegramBot')
              .then((m) => {
                if (typeof m.startTelegramBotDaemon === 'function') {
                  m.startTelegramBotDaemon().catch((err: unknown) =>
                    console.error('[Telegram Bot Daemon Error]:', err)
                  );
                }
              })
              .catch((err) => console.error('[Failed to load Telegram Bot Daemon]:', err));
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('/src/data/nakshatraPhalaData') || id.includes('/src/data/vedicHubData')) {
              return 'data-treatise';
            }
          },
        },
      },
    },
  };
});
