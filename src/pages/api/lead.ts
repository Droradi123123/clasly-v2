import type { APIRoute } from 'astro';
import { getEnv, clientIp, json } from '@/lib/env';
import { rateLimit } from '@/lib/ratelimit';
import { supabaseAdmin, utmFromUrl, audienceFromPage, type LeadInsert } from '@/lib/supabase';
import { notifyNewLead } from '@/lib/notify';

export const prerender = false;

async function verifyTurnstile(secret: string | undefined, token: string | null, ip: string): Promise<boolean> {
  if (!secret) return true; // Turnstile not configured yet (see TODO.md)
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data: any = await res.json().catch(() => ({}));
  return Boolean(data?.success);
}

const str = (v: FormDataEntryValue | null, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) || null : null);

export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv();
  const ip = clientIp(request);
  const rl = await rateLimit(env.AGENT_KV, `lead:${ip}`, 5, 3600);
  if (!rl.ok) return json({ error: 'יותר מדי פניות בזמן קצר. אפשר לכתוב לנו בוואטסאפ.' }, 429);

  let form: FormData;
  try { form = await request.formData(); } catch { return json({ error: 'טופס לא תקין.' }, 400); }
  if (str(form.get('website'))) return json({ ok: true }); // honeypot: pretend success

  const name = str(form.get('name'), 120);
  const organization = str(form.get('organization'), 160);
  const contact = str(form.get('contact'), 160);
  const message = str(form.get('message'), 2000);
  if (!name || name.length < 2) return json({ error: 'נא להזין שם.' }, 400);
  if (!organization) return json({ error: 'נא להזין את שם הארגון.' }, 400);
  if (!contact || !/(@|\d{7,})/.test(contact)) return json({ error: 'נא להזין טלפון או אימייל תקינים.' }, 400);
  if (!message || message.length < 10) return json({ error: 'ספרו לנו בכמה מילים מה אתם צריכים.' }, 400);

  if (!(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, str(form.get('cf-turnstile-response'), 4000), ip))) {
    return json({ error: 'אימות האנטי-ספאם נכשל. רעננו את הדף ונסו שוב.' }, 400);
  }

  const page = str(form.get('page'), 200);
  const referer = request.headers.get('referer');
  const lead: LeadInsert = {
    source: 'form',
    page,
    audience_type: (str(form.get('audience_type'), 20) as any) || audienceFromPage(page),
    format: str(form.get('format'), 60),
    group_size: str(form.get('group_size'), 60),
    timeframe: str(form.get('timeframe'), 60),
    topic: str(form.get('topic'), 120),
    message,
    name,
    organization,
    contact,
    summary: null,
    ...utmFromUrl(referer),
    referrer: str(form.get('referrer'), 500) ?? referer,
  };

  const supabase = supabaseAdmin();
  let id: string | null = null;
  if (supabase) {
    const { data, error } = await supabase.from('site_leads').insert(lead).select('id').single();
    if (error) { console.error('lead insert failed', error); return json({ error: 'לא הצלחנו לשמור את הפנייה. כתבו לנו בוואטסאפ.' }, 500); }
    id = data.id;
  } else {
    console.warn('Supabase not configured; lead not stored', lead);
  }

  locals.cfContext?.waitUntil?.(notifyNewLead({ ...lead, id }));
  return json({ ok: true, id });
};
