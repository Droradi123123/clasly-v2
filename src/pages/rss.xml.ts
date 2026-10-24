import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, BRAND_NAME } from '@/config/site';

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
  return rss({
    title: `${BRAND_NAME}: בלוג`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, link: `/blog/${p.data.slug}`, pubDate: p.data.publishedAt })),
    customData: '<language>he</language>',
  });
};
