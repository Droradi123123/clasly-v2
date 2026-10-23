import type { APIRoute } from 'astro';
import { urlset, xml, topicsUrls } from '@/lib/sitemap';
export const GET: APIRoute = async () => xml(urlset(await topicsUrls()));
