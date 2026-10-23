import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { getEnv, clientIp, json } from '@/lib/env';
import { rateLimit, sha256 } from '@/lib/ratelimit';
import { moderatePrompt, normalizeForCache } from '@/lib/moderation';
import { OUTLINE_SYSTEM } from '@/lib/outline-prompt';
import { supabaseAdmin } from '@/lib/supabase';

export const prerender = false;

const RATE_PER_HOUR = 8;
const CACHE_TTL = 60 * 60 * 24 * 14;

/**
 * POST { prompt } -> streams a Hebrew outline as text/plain (chunked).
 * Headers: x-session-id (agent_sessions row id, when Supabase is configured), x-cache: HIT|MISS.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv();
  const ip = clientIp(request);
  const rl = await rateLimit(env.AGENT_KV, `outline:${ip}`, RATE_PER_HOUR, 3600);
  if (!rl.ok) return json({ error: 'הגעתם למכסת הניסיונות לשעה הקרובה. אפשר לכתוב לנו בוואטסאפ ונבנה את זה יחד.' }, 429);

  let body: any = {};
  try { body = await request.json(); } catch {}
  const mod = moderatePrompt(body?.prompt);
  if (!mod.ok) return json({ error: mod.reason }, 400);
  const prompt = mod.prompt;
  const page = typeof body?.page === 'string' ? body.page.slice(0, 200) : null;

  const supabase = supabaseAdmin();
  const cacheKey = `outline:${await sha256(normalizeForCache(prompt))}`;
  const cached = env.AGENT_KV ? await env.AGENT_KV.get(cacheKey) : null;

  const sessionId = crypto.randomUUID();
  const log = async (outline: string, cacheHit: boolean) => {
    if (!supabase) return;
    try {
      await supabase.from('agent_sessions').insert({ id: sessionId, prompt, outline, page, cache_hit: cacheHit, ip_hash: (await sha256(ip)).slice(0, 16) });
    } catch (e) { console.error('agent_sessions insert failed', e); }
  };

  const headers = { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-session-id': sessionId, 'x-accel-buffering': 'no' };

  if (cached) {
    locals.cfContext?.waitUntil?.(log(cached, true));
    return new Response(cached, { headers: { ...headers, 'x-cache': 'HIT' } });
  }

  if (!env.ANTHROPIC_API_KEY) return json({ error: 'הסוכן עדיין לא מחובר. כתבו לנו בוואטסאפ ונבנה את המתווה יחד.' }, 503);

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 25_000 });
  const model = env.OUTLINE_MODEL || 'claude-opus-5-5';
  const encoder = new TextEncoder();
  let full = '';

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const s = client.messages.stream({
          model,
          max_tokens: 1200,
          system: [{ type: 'text', text: OUTLINE_SYSTEM, cache_control: { type: 'ephemeral' } }],
          output_config: { effort: 'low' },
          messages: [{ role: 'user', content: `מה הארגון שלנו רוצה לעשות עם AI: ${prompt}` }],
        });
        for await (const event of s) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await s.finalMessage();
        if (final.stop_reason === 'refusal' || !full.trim()) {
          const fallback = 'לא הצלחנו לבנות מתווה לקלט הזה. כתבו לנו בוואטסאפ ונבנה אותו יחד.';
          controller.enqueue(encoder.encode(fallback));
          full = full || fallback;
        } else if (env.AGENT_KV) {
          await env.AGENT_KV.put(cacheKey, full, { expirationTtl: CACHE_TTL });
        }
      } catch (e) {
        console.error('outline stream failed', e);
        controller.enqueue(encoder.encode('\n\nמשהו השתבש בדרך. נסו שוב בעוד רגע, או כתבו לנו בוואטסאפ.'));
      } finally {
        controller.close();
        await log(full, false);
      }
    },
  });

  return new Response(stream, { headers: { ...headers, 'x-cache': 'MISS' } });
};
