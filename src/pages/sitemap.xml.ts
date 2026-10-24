import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';
/** Convenience alias: many tools request /sitemap.xml. */
export const GET: APIRoute = () => Response.redirect(`${SITE.url}/sitemap-index.xml`, 301);
