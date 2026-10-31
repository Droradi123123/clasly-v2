import type { APIRoute } from 'astro';
import { GET as sitemapIndex } from './sitemap-index.xml';
/**
 * Many tools (and people in Search Console) request /sitemap.xml. A static redirect here builds to an HTML
 * meta-refresh page, which Google rejects as "Sitemap is HTML", so serve the same XML index instead.
 */
export const GET: APIRoute = (ctx) => sitemapIndex(ctx);
