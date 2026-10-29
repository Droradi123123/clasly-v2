import type { APIRoute } from 'astro';
import { json, getEnv, clientIp } from '@/lib/env';
import { rateLimit } from '@/lib/ratelimit';
import { db, insertEvent } from '@/lib/db';

export const prerender = false;

const ALLOWED = new Set(['whatsapp_click', 'lead_form_submit', 'cta_click', 'prompt_copy', 'roi_calculate']);

/** Lightweight, privacy-friendly events: no cookies, no user ids. */
export const POST: APIRoute = async ({ request }) => {
  const env = getEnv();
  const rl = await rateLimit(env.AGENT_KV, `event:${clientIp(request)}`, 120, 3600);
  if (!rl.ok) return json({ ok: false }, 429);
  let body: any = {};
  try { body = await request.json(); } catch { return json({ ok: false }, 400); }
  const event = String(body?.event ?? '');
  if (!ALLOWED.has(event)) return json({ ok: false }, 400);
  const database = db();
  if (database) {
    const row = {
      event,
      page: typeof body.page === 'string' ? body.page.slice(0, 200) : null,
      label: typeof body.label === 'string' ? body.label.slice(0, 100) : null,
      referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null,
      session_id: null,
    };
    try {
      await insertEvent(database, row);
    } catch (e) { console.error('event insert failed', e); }
  }
  return json({ ok: true });
};
