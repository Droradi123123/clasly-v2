

/** Fixed-window counter in KV. Falls back to an in-memory map when KV is not bound (local dev). */
const memory = new Map<string, { n: number; exp: number }>();

export async function rateLimit(kv: KVNamespace | undefined, key: string, limit: number, windowSeconds: number): Promise<{ ok: boolean; remaining: number }> {
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const k = `rl:${key}:${bucket}`;
  if (!kv) {
    const now = Date.now();
    const cur = memory.get(k);
    const n = cur && cur.exp > now ? cur.n + 1 : 1;
    memory.set(k, { n, exp: now + windowSeconds * 1000 });
    return { ok: n <= limit, remaining: Math.max(0, limit - n) };
  }
  const cur = Number((await kv.get(k)) ?? '0') + 1;
  await kv.put(k, String(cur), { expirationTtl: windowSeconds + 5 });
  return { ok: cur <= limit, remaining: Math.max(0, limit - cur) };
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
