/**
 * Worker entry: Astro handles every request; the cron (wrangler.jsonc > triggers) pulls
 * Google Analytics and Search Console into D1. See src/lib/analytics.ts.
 */
import astro from '@astrojs/cloudflare/entrypoints/server';
import { maybeSyncAnalytics, safeError, type AnalyticsEnv } from './lib/analytics';

export default {
  fetch: astro.fetch,
  async scheduled(_controller: ScheduledController, env: AnalyticsEnv, ctx: ExecutionContext) {
    ctx.waitUntil(maybeSyncAnalytics(env).then((r) => console.log('analytics sync', JSON.stringify(r)), (e) => console.error('analytics sync failed', safeError(e))));
  },
};
