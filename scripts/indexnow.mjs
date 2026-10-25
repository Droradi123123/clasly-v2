#!/usr/bin/env node
/**
 * Pings IndexNow (Bing, Yandex, Seznam, Naver; Bing feeds ChatGPT search and Copilot) with every URL in the live sitemaps.
 * Usage: node scripts/indexnow.mjs [https://realai.co.il]
 * The key file is public/4ef9fbb594cfbcbfcdebc3a32bd23749.txt and is served at the site root.
 */
const KEY = '4ef9fbb594cfbcbfcdebc3a32bd23749';
const site = (process.argv[2] || 'https://realai.co.il').replace(/\/$/, '');
const host = new URL(site).host;
const parts = ['/sitemaps/pages.xml', '/sitemaps/topics.xml', '/sitemaps/blog.xml'];
const urls = [];
for (const p of parts) {
  const res = await fetch(site + p);
  if (!res.ok) { console.error('sitemap fetch failed', p, res.status); process.exit(0); }
  const xml = await res.text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1]);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs, status ${res.status}`);
