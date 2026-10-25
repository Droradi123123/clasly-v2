import { getCollection } from 'astro:content';
import { SITE, TOPICS } from '@/config/site';
import { OFFER_PAGES } from '@/data/offers';

export interface UrlEntry { loc: string; lastmod: string; changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }
const abs = (p: string) => `${SITE.url}${p}`;
const today = () => new Date().toISOString().slice(0, 10);
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Static pages with a hand-maintained lastmod (update when copy changes). */
const STATIC: { path: string; lastmod: string; priority: number }[] = [
  { path: '/', lastmod: '2026-10-23', priority: 1.0 },
  { path: '/academia', lastmod: '2026-10-23', priority: 0.9 },
  { path: '/companies', lastmod: '2026-10-23', priority: 0.9 },
  { path: '/program', lastmod: '2026-10-25', priority: 0.9 },
  { path: '/about', lastmod: '2026-10-23', priority: 0.6 },
  { path: '/team', lastmod: '2026-10-23', priority: 0.5 },
  { path: '/contact', lastmod: '2026-10-23', priority: 0.7 },
  { path: '/how-this-site-was-built', lastmod: '2026-10-23', priority: 0.7 },
  { path: '/glossary', lastmod: '2026-10-23', priority: 0.7 },
  { path: '/blog', lastmod: today(), priority: 0.8 },
  { path: '/topics', lastmod: today(), priority: 0.7 },
  { path: '/accessibility', lastmod: '2026-10-23', priority: 0.2 },
  { path: '/privacy', lastmod: '2026-10-23', priority: 0.2 },
];

export async function pagesUrls(): Promise<UrlEntry[]> {
  return [
    ...STATIC.map((s) => ({ loc: abs(s.path), lastmod: s.lastmod, changefreq: 'monthly' as const, priority: s.priority })),
    ...OFFER_PAGES.map((o) => ({ loc: abs(o.path), lastmod: o.updatedAt, changefreq: 'monthly' as const, priority: 0.95 })),
  ];
}

export async function blogUrls(): Promise<UrlEntry[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime()).map((p) => ({ loc: abs(`/blog/${p.data.slug}`), lastmod: iso(p.data.updatedAt), changefreq: 'weekly' as const, priority: 0.7 }));
}

export async function topicsUrls(): Promise<UrlEntry[]> {
  const hubs = await getCollection('hubs');
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return TOPICS.map((t) => {
    const hub = hubs.find((h) => h.data.slug === t.slug);
    const latest = posts.filter((p) => p.data.topicHub === t.slug).map((p) => p.data.updatedAt.getTime());
    const last = Math.max(hub?.data.updatedAt.getTime() ?? 0, ...latest, 0);
    return { loc: abs(`/topics/${t.slug}`), lastmod: last ? iso(new Date(last)) : today(), changefreq: 'weekly' as const, priority: 0.8 };
  });
}

export function urlset(entries: UrlEntry[]): string {
  const rows = entries.map((e) => `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority.toFixed(1)}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows}\n</urlset>\n`;
}

export function sitemapIndex(parts: { path: string; lastmod: string }[]): string {
  const rows = parts.map((p) => `  <sitemap><loc>${abs(p.path)}</loc><lastmod>${p.lastmod}</lastmod></sitemap>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</sitemapindex>\n`;
}

export const xml = (body: string) => new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
