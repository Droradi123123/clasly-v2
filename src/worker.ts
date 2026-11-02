/**
 * Worker entry: Astro handles every request; the daily cron (wrangler.jsonc > triggers) pulls
 * Google Analytics and Search Console into D1. See src/lib/analytics.ts.
 */
import astro from '@astrojs/cloudflare/entrypoints/server';
import { syncAnalytics, type AnalyticsEnv } from './lib/analytics';

export default {
  fetch: astro.fetch,
  async scheduled(_controller: ScheduledController, env: AnalyticsEnv, ctx: ExecutionContext) {
    ctx.waitUntil(syncAnalytics(env).then((r) => console.log('analytics sync', JSON.stringify(r))));
  },
};
