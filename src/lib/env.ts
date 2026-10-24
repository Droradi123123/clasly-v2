/** Server-side environment access (Cloudflare Workers bindings + secrets). Never import from client code. */
import { env as cfEnv } from 'cloudflare:workers';

export interface AppEnv {
  ANTHROPIC_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  ADMIN_PASSWORD?: string;
  OUTLINE_MODEL?: string;
  PUBLIC_SITE_URL?: string;
  AGENT_KV?: KVNamespace;
}

export function getEnv(): AppEnv {
  return cfEnv as unknown as AppEnv;
}

export function clientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}
