import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEnv } from './env';

/** Service-role client, server only. RLS blocks all anon access; inserts happen only through these endpoints. */
export function supabaseAdmin(): SupabaseClient | null {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getEnv();
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type AudienceType = 'academia' | 'company' | 'executive' | null;

export interface LeadInsert {
  source: 'whatsapp' | 'form' | 'agent';
  page: string | null;
  audience_type: AudienceType;
  format: string | null;
  group_size: string | null;
  timeframe: string | null;
  topic: string | null;
  message: string | null;
  name: string | null;
  organization: string | null;
  contact: string | null;
  summary: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
}

export function utmFromUrl(url: string | null): Pick<LeadInsert, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'> {
  const out = { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null } as any;
  if (!url) return out;
  try {
    const p = new URL(url).searchParams;
    for (const k of Object.keys(out)) out[k] = p.get(k);
  } catch {}
  return out;
}

/** Infer audience from the page path when the form did not say. */
export function audienceFromPage(page: string | null): AudienceType {
  if (!page) return null;
  if (page.startsWith('/academia') || page.startsWith('/courses')) return 'academia';
  if (page.startsWith('/executive')) return 'executive';
  if (page.startsWith('/companies') || page.startsWith('/workshops') || page.startsWith('/lectures')) return 'company';
  return null;
}
