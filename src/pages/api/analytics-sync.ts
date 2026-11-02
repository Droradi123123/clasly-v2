import type { APIRoute } from 'astro';
import { json, getEnv, clientIp } from '@/lib/env';
import { rateLimit } from '@/lib/ratelimit';
import { db } from '@/lib/db';
import { maybeSyncAnalytics } from '@/lib/analytics';

export const prerender = false;

/**
 * Pulls Google Analytics and Search Console into D1 (backup for the Worker cron; called by
 * .github/workflows/analytics-sync.yml). Safe to leave open: maybeSyncAnalytics pulls at most once every
 * 6 hours whoever calls it, and the response carries only a status, never data or secrets.
 */
export const POST: APIRoute = async ({ request }) => {
  const env = getEnv();
  const rl = await rateLimit(env.AGENT_KV, `analytics-sync:${clientIp(request)}`, 10, 3600);
  if (!rl.ok) return json({ ok: false }, 429);
  const database = db();
  if (!database) return json({ ok: false, status: 'no database' }, 503);
  const status = await maybeSyncAnalytics({ ...env, DB: database });
  return json({ ok: true, status });
};
