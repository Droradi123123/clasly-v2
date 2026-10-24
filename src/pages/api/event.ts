import type { APIRoute } from 'astro';
import { json, getEnv, clientIp } from '@/lib/env';
import { rateLimit } from '@/lib/ratelimit';
import { supabaseAdmin } from '@/lib/supabase';

export const prerender = false;

const ALLOWED = new Set(['whatsapp_click', 'lead_form_submit', 'outline_generated', 'outline_whatsapp', 'outline_copy']);

/** Lightweight, privacy-friendly events: no cookies, no user ids. */
export const POST: APIRoute = async ({ request }) => {
  const env = getEnv();
  const rl = await rateLimit(env.AGENT_KV, `event:${clientIp(request)}`, 120, 3600);
  if (!rl.ok) return json({ ok: false }, 429);
  let body: any = {};
  try { body = await request.json(); } catch { return json({ ok: false }, 400); }
  const event = String(body?.event ?? '');
  if (!ALLOWED.has(event)) return json({ ok: false }, 400);
  const supabase = supabaseAdmin();
  if (supabase) {
    const row = {
      event,
      page: typeof body.page === 'string' ? body.page.slice(0, 200) : null,
      label: typeof body.label === 'string' ? body.label.slice(0, 100) : null,
      referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null,
      session_id: typeof body.session_id === 'string' && /^[0-9a-f-]{36}$/.test(body.session_id) ? body.session_id : null,
    };
    const { error } = await supabase.from('site_events').insert(row);
    if (error) console.error('event insert failed', error);
    if (row.session_id && (event === 'outline_whatsapp' || event === 'outline_copy')) {
      await supabase.from('site_agent_sessions').update({ converted: true }).eq('id', row.session_id);
    }
  }
  return json({ ok: true });
};
