/**
 * Lead storage on Cloudflare D1 (binding `DB`, schema in migrations/).
 * Reachable only from this Worker; there is no public database API.
 */
import { getEnv } from './env';

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

export const LEAD_STATUSES = ['new', 'contacted', 'proposal_sent', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function db(): D1Database | null {
  return getEnv().DB ?? null;
}

/** Inserts a lead and returns its id. */
export async function insertLead(d: D1Database, lead: LeadInsert): Promise<string> {
  const id = crypto.randomUUID();
  const cols = Object.keys(lead) as (keyof LeadInsert)[];
  await d
    .prepare(`INSERT INTO leads (id, ${cols.join(', ')}) VALUES (?, ${cols.map(() => '?').join(', ')})`)
    .bind(id, ...cols.map((c) => lead[c]))
    .run();
  return id;
}

export async function insertEvent(d: D1Database, e: { event: string; page: string | null; label: string | null; referrer: string | null; session_id: string | null }) {
  await d.prepare('INSERT INTO events (event, page, label, referrer, session_id) VALUES (?, ?, ?, ?, ?)').bind(e.event, e.page, e.label, e.referrer, e.session_id).run();
}

export function utmFromUrl(url: string | null): Pick<LeadInsert, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'> {
  const out = { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null } as Record<string, string | null>;
  if (url) {
    try {
      const p = new URL(url).searchParams;
      for (const k of Object.keys(out)) out[k] = p.get(k);
    } catch {}
  }
  return out as Pick<LeadInsert, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'>;
}

/** Infer audience from the page path when the form did not say. */
export function audienceFromPage(page: string | null): AudienceType {
  if (!page) return null;
  if (page.startsWith('/academia') || page.startsWith('/courses')) return 'academia';
  if (page.startsWith('/executive')) return 'executive';
  if (page.startsWith('/companies') || page.startsWith('/workshops') || page.startsWith('/lectures')) return 'company';
  return null;
}
