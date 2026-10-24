import type { APIRoute } from 'astro';
import { sitemapIndex, xml, blogUrls, topicsUrls, pagesUrls } from '@/lib/sitemap';
const latest = (u: { lastmod: string }[]) => u.map((x) => x.lastmod).sort().at(-1) ?? new Date().toISOString().slice(0, 10);
export const GET: APIRoute = async () => xml(sitemapIndex([
  { path: '/sitemaps/pages.xml', lastmod: latest(await pagesUrls()) },
  { path: '/sitemaps/topics.xml', lastmod: latest(await topicsUrls()) },
  { path: '/sitemaps/blog.xml', lastmod: latest(await blogUrls()) },
]));
