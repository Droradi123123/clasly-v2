/**
 * Pulls Google Analytics 4 and Search Console reports with a read-only Google service account and stores
 * them in D1 (table analytics_snapshots). Runs from the daily cron (src/worker.ts) and from /admin/analytics.
 *
 * Secrets (Cloudflare dashboard > Workers > clasly-v2 > Settings > Variables and Secrets):
 *   GOOGLE_SA_KEY    the service account's JSON key, pasted as is
 *   GA4_PROPERTY_ID  the numeric GA4 property id
 *   GSC_SITE         optional, defaults to the domain property sc-domain:realai.co.il
 * The service account needs Viewer on the GA4 property and Restricted access in Search Console.
 */

export interface AnalyticsEnv {
  GOOGLE_SA_KEY?: string;
  GA4_PROPERTY_ID?: string;
  GSC_SITE?: string;
  DB?: D1Database;
}

const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly';
const DAYS = 28;

const b64url = (data: ArrayBuffer | string) => {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/** OAuth access token for a service account (JWT bearer grant, signed with WebCrypto). */
async function accessToken(rawKey: string): Promise<string> {
  const key = JSON.parse(rawKey) as { client_email: string; private_key: string; token_uri?: string };
  const pem = key.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const signingKey = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = key.token_uri ?? 'https://oauth2.googleapis.com/token';
  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: key.client_email, scope: SCOPES, aud: tokenUri, iat: now, exp: now + 3600 }))}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', signingKey, new TextEncoder().encode(unsigned));
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${b64url(signature)}` }),
  });
  const body: any = await res.json();
  if (!res.ok || !body.access_token) throw new Error(`token: ${res.status} ${body.error_description ?? body.error ?? ''}`);
  return body.access_token;
}

async function post(url: string, token: string, payload: unknown): Promise<any> {
  const res = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const body: any = await res.json();
  if (!res.ok) throw new Error(`${new URL(url).hostname}: ${res.status} ${body.error?.message ?? ''}`);
  return body;
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Flattens a GA4 runReport response into rows of { dimension: value, metric: number }. */
function gaRows(report: any): Record<string, string | number>[] {
  const dims = (report.dimensionHeaders ?? []).map((h: any) => h.name);
  const mets = (report.metricHeaders ?? []).map((h: any) => h.name);
  return (report.rows ?? []).map((r: any) => {
    const row: Record<string, string | number> = {};
    dims.forEach((d: string, i: number) => (row[d] = r.dimensionValues[i].value));
    mets.forEach((m: string, i: number) => (row[m] = Number(r.metricValues[i].value)));
    return row;
  });
}

async function pullGa4(token: string, propertyId: string, startDate: string, endDate: string) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const dateRanges = [{ startDate, endDate }];
  const run = (dimensions: string[], metrics: string[], limit = 50, orderBy?: string) =>
    post(url, token, {
      dateRanges,
      dimensions: dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      limit,
      ...(orderBy ? { orderBys: [{ desc: orderBy !== 'date', ...(orderBy === 'date' ? { dimension: { dimensionName: 'date' } } : { metric: { metricName: orderBy } }) }] } : {}),
    }).then(gaRows);
  const [totals, daily, channels, sources, landingPages, pages, events, devices, countries] = await Promise.all([
    run([], ['sessions', 'totalUsers', 'newUsers', 'screenPageViews', 'engagedSessions', 'engagementRate', 'averageSessionDuration', 'keyEvents'], 1),
    run(['date'], ['sessions', 'totalUsers', 'screenPageViews'], 100, 'date'),
    run(['sessionDefaultChannelGroup'], ['sessions', 'engagedSessions', 'keyEvents'], 20, 'sessions'),
    run(['sessionSource', 'sessionMedium'], ['sessions', 'engagedSessions'], 30, 'sessions'),
    run(['landingPage'], ['sessions', 'engagementRate', 'averageSessionDuration', 'keyEvents'], 50, 'sessions'),
    run(['pagePath'], ['screenPageViews', 'userEngagementDuration'], 50, 'screenPageViews'),
    run(['eventName'], ['eventCount'], 30, 'eventCount'),
    run(['deviceCategory'], ['sessions'], 5, 'sessions'),
    run(['country'], ['sessions'], 10, 'sessions'),
  ]);
  return { totals: totals[0] ?? {}, daily, channels, sources, landingPages, pages, events, devices, countries };
}

async function pullGsc(token: string, site: string, startDate: string, endDate: string) {
  const base = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}`;
  const query = (dimensions: string[], rowLimit = 250) =>
    post(`${base}/searchAnalytics/query`, token, { startDate, endDate, dimensions, rowLimit, dataState: 'all' }).then((r) =>
      (r.rows ?? []).map((row: any) => ({ keys: row.keys ?? [], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position })),
    );
  const [totals, daily, queries, pages, queryPages, devices, countries, sitemaps] = await Promise.all([
    query([], 1),
    query(['date'], 100),
    query(['query'], 250),
    query(['page'], 250),
    query(['query', 'page'], 500),
    query(['device'], 5),
    query(['country'], 10),
    fetch(`${base}/sitemaps`, { headers: { authorization: `Bearer ${token}` } }).then((r) => r.json()).then((b: any) => b.sitemap ?? []),
  ]);
  return { totals: totals[0] ?? {}, daily, queries, pages, queryPages, devices, countries, sitemaps };
}

export function analyticsConfigured(env: AnalyticsEnv) {
  return { ga4: Boolean(env.GOOGLE_SA_KEY && env.GA4_PROPERTY_ID), gsc: Boolean(env.GOOGLE_SA_KEY) };
}

/** Pulls the last 28 days from GA4 and Search Console and stores one snapshot row per source. */
export async function syncAnalytics(env: AnalyticsEnv): Promise<{ ga4: string; gsc: string }> {
  const result = { ga4: 'skipped', gsc: 'skipped' };
  if (!env.DB || !env.GOOGLE_SA_KEY) return result;
  const end = new Date();
  const start = new Date(end.getTime() - DAYS * 86400000);
  const startDate = isoDay(start);
  const endDate = isoDay(end);
  let token: string;
  try {
    token = await accessToken(env.GOOGLE_SA_KEY);
  } catch (e) {
    const error = String((e as Error).message ?? e).slice(0, 500);
    for (const source of ['ga4', 'gsc']) await env.DB.prepare('INSERT INTO analytics_snapshots (source, start_date, end_date, error) VALUES (?, ?, ?, ?)').bind(source, startDate, endDate, error).run();
    return { ga4: error, gsc: error };
  }
  const jobs: [keyof typeof result, () => Promise<unknown>][] = [['gsc', () => pullGsc(token, env.GSC_SITE || 'sc-domain:realai.co.il', startDate, endDate)]];
  if (env.GA4_PROPERTY_ID) jobs.push(['ga4', () => pullGa4(token, env.GA4_PROPERTY_ID!.replace(/\D/g, ''), startDate, endDate)]);
  for (const [source, job] of jobs) {
    try {
      const payload = await job();
      await env.DB.prepare('INSERT INTO analytics_snapshots (source, start_date, end_date, payload) VALUES (?, ?, ?, ?)').bind(source, startDate, endDate, JSON.stringify(payload)).run();
      result[source] = 'ok';
    } catch (e) {
      const error = String((e as Error).message ?? e).slice(0, 500);
      await env.DB.prepare('INSERT INTO analytics_snapshots (source, start_date, end_date, error) VALUES (?, ?, ?, ?)').bind(source, startDate, endDate, error).run();
      result[source] = error;
    }
  }
  return result;
}

/** Latest successful snapshot per source, plus the latest error if it is newer. */
export async function latestSnapshots(db: D1Database) {
  const out: Record<'ga4' | 'gsc', { created_at: string; start_date: string; end_date: string; data: any } | null> & { errors: { source: string; created_at: string; error: string }[] } = { ga4: null, gsc: null, errors: [] };
  for (const source of ['ga4', 'gsc'] as const) {
    const ok: any = await db.prepare('SELECT created_at, start_date, end_date, payload FROM analytics_snapshots WHERE source = ? AND payload IS NOT NULL ORDER BY id DESC LIMIT 1').bind(source).first();
    if (ok) out[source] = { created_at: ok.created_at, start_date: ok.start_date, end_date: ok.end_date, data: JSON.parse(ok.payload) };
    const err: any = await db.prepare('SELECT created_at, error FROM analytics_snapshots WHERE source = ? ORDER BY id DESC LIMIT 1').bind(source).first();
    if (err?.error) out.errors.push({ source, created_at: err.created_at, error: err.error });
  }
  return out;
}
