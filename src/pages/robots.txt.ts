import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';

/** Explicitly welcomes AI answer-engine crawlers (GEO) and blocks only the internal admin area. */
export const GET: APIRoute = () => {
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Bingbot', 'Applebot', 'Applebot-Extended', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai', 'YouBot'];
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    '',
    ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', 'Disallow: /admin/', '']),
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    `# llms.txt: ${SITE.url}/llms.txt`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
