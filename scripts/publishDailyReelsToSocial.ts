/**
 * Standalone CLI runner to auto-publish today's 1080p HD Reels
 * to YouTube Shorts, Facebook Page, Instagram Reels, LinkedIn & Webhook.
 *
 * Usage: npx tsx scripts/publishDailyReelsToSocial.ts
 */
import { executeDailySocialPosting } from './socialPublisher';

async function run() {
  console.log('🚀 Starting Multi-Platform Social & YouTube Shorts Auto-Publisher...');
  const result = await executeDailySocialPosting();
  console.log(`\n📊 ${result.summary}`);
  for (const item of result.results) {
    const icon = item.success ? '✅' : '⚠️';
    console.log(`${icon} [${item.channel}] ${item.message}`);
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Social auto-publish failed:', err);
    process.exit(1);
  });
