import type { APIRoute } from 'astro';
import { urlset, xml, pagesUrls } from '@/lib/sitemap';
export const GET: APIRoute = async () => xml(urlset(await pagesUrls()));
