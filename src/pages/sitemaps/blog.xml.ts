import type { APIRoute } from 'astro';
import { urlset, xml, blogUrls } from '@/lib/sitemap';
export const GET: APIRoute = async () => xml(urlset(await blogUrls()));
