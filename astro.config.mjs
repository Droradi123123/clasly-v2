// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: cloudflare({ prerenderEnvironment: 'node' }),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      i18n: { defaultLocale: 'he', locales: { he: 'he-IL' } },
      serialize(item) {
        // @ts-ignore sitemap's changefreq enum type is stricter than the accepted string values
        item.changefreq = item.url.includes('/blog/') || item.url.includes('/topics/') ? 'weekly' : 'monthly';
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
