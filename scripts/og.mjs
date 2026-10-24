#!/usr/bin/env node
/**
 * Auto-generates one Open Graph image (1200x630 PNG) per built page.
 * Runs after `astro build`: scans dist/client/**\/*.html for <title>, description and og:image,
 * renders an SVG with the self-hosted Heebo font and converts it with sharp.
 * Hebrew RTL text is shaped by librsvg/pango, so no manual bidi handling is needed.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist', 'client');
const OUT = join(DIST, 'og');
const CACHE = join(root, 'node_modules', '.cache', 'og-fonts');
const BRAND = readFileSync(join(root, 'src/config/site.ts'), 'utf8').match(/BRAND_NAME = '([^']+)'/)[1];

// --- fonts: librsvg needs TTF; convert the bundled WOFF (zlib tables) once.
function woffToTtf(src, dst) {
  const buf = readFileSync(src);
  const n = buf.readUInt16BE(12);
  const entries = [];
  for (let i = 0; i < n; i++) { const o = 44 + i * 20; entries.push({ tag: buf.subarray(o, o + 4), offset: buf.readUInt32BE(o + 4), comp: buf.readUInt32BE(o + 8), orig: buf.readUInt32BE(o + 12), sum: buf.readUInt32BE(o + 16) }); }
  let off = 12 + 16 * n;
  const tables = entries.map((e) => { const raw = buf.subarray(e.offset, e.offset + e.comp); const data = e.comp === e.orig ? raw : inflateSync(raw); const t = { ...e, data, out: off }; off += (data.length + 3) & ~3; return t; });
  const out = Buffer.alloc(off);
  out.writeUInt32BE(buf.readUInt32BE(4), 0); out.writeUInt16BE(n, 4);
  let es = 0, sr = 1; while (sr * 2 <= n) { sr *= 2; es++; } sr *= 16;
  out.writeUInt16BE(sr, 6); out.writeUInt16BE(es, 8); out.writeUInt16BE(n * 16 - sr, 10);
  tables.forEach((t, i) => { const o = 12 + i * 16; t.tag.copy(out, o); out.writeUInt32BE(t.sum, o + 4); out.writeUInt32BE(t.out, o + 8); out.writeUInt32BE(t.orig, o + 12); t.data.copy(out, t.out); });
  writeFileSync(dst, out);
}
function prepareFonts() {
  mkdirSync(CACHE, { recursive: true });
  const src = join(root, 'node_modules/@fontsource/heebo/files');
  for (const f of ['heebo-hebrew-400-normal', 'heebo-hebrew-800-normal', 'heebo-latin-400-normal', 'heebo-latin-800-normal']) {
    const dst = join(CACHE, `${f}.ttf`);
    if (!existsSync(dst)) woffToTtf(join(src, `${f}.woff`), dst);
  }
  const conf = join(CACHE, 'fonts.conf');
  writeFileSync(conf, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${CACHE}</dir><cachedir>${join(CACHE, 'fc')}</cachedir></fontconfig>`);
  process.env.FONTCONFIG_FILE = conf;
}
prepareFonts();
const sharp = (await import('sharp')).default;

const brandMarkup = () => { const m = BRAND.match(/^(.*?)(AI)$/); return m ? `${esc(m[1])}<tspan fill="#5ee1c3">${m[2]}</tspan>` : esc(BRAND); };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function wrap(text, max) {
  const words = text.split(/\s+/); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur); return lines.slice(0, 3);
}
function svg({ title, description, kicker }) {
  const tl = wrap(title, 34); const size = tl.length > 2 ? 54 : 64;
  const dl = wrap(description, 60).slice(0, 2);
  let y = 250;
  const titleText = tl.map((l) => `<text x="1110" y="${(y += size * 1.15)}" direction="rtl" text-anchor="start" font-family="Heebo" font-weight="800" font-size="${size}" fill="#e8ecf3">${esc(l)}</text>`).join('');
  y += 30;
  const descText = dl.map((l) => `<text x="1110" y="${(y += 38)}" direction="rtl" text-anchor="start" font-family="Heebo" font-weight="400" font-size="28" fill="#9aa4b5">${esc(l)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="g" cx="80%" cy="10%" r="70%"><stop offset="0" stop-color="#5ee1c3" stop-opacity=".28"/><stop offset="1" stop-color="#0b0e14" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="#0b0e14"/><rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1096" cy="128" r="10" fill="#5ee1c3"/>
  <text x="1076" y="140" direction="ltr" text-anchor="end" font-family="Heebo" font-weight="800" font-size="34" fill="#e8ecf3">${brandMarkup()}</text>
  <text x="1110" y="210" direction="rtl" text-anchor="start" font-family="Heebo" font-weight="400" font-size="24" fill="#5ee1c3">${esc(kicker)}</text>
  ${titleText}${descText}
  <rect x="90" y="560" width="1020" height="2" fill="#242c3b"/>
  <text x="1110" y="600" direction="rtl" text-anchor="start" font-family="Heebo" font-weight="400" font-size="22" fill="#9aa4b5">בונים, לא מייעצים · הרצאות, סדנאות וקורסי AI לארגונים</text>
</svg>`;
}

function* htmlFiles(dir) { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) yield* htmlFiles(p); else if (f.endsWith('.html')) yield p; } }
const meta = (html, re) => (html.match(re)?.[1] ?? '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");

mkdirSync(OUT, { recursive: true });
let count = 0;
const jobs = [];
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const og = meta(html, /property="og:image" content="([^"]+)"/);
  if (!og || !og.includes('/og/')) continue;
  const name = og.slice(og.lastIndexOf('/og/') + 4);
  const title = meta(html, /property="og:title" content="([^"]+)"/) || meta(html, /<title>([^<]+)<\/title>/);
  const description = meta(html, /name="description" content="([^"]*)"/);
  const kicker = /\/blog\//.test(og) ? 'מהבלוג' : /\/topics\//.test(og) ? 'מרכז נושא' : 'AI יישומי לארגונים';
  jobs.push(sharp(Buffer.from(svg({ title, description, kicker }))).png({ compressionLevel: 9 }).toFile(join(OUT, name)).then(() => count++));
}
jobs.push(sharp(Buffer.from(svg({ title: 'הרצאות וסדנאות AI מאנשים שמטמיעים AI בתעשייה', description: 'Claude Code, n8n, סוכני AI והטמעת AI בארגון. בעברית, לארגונים בישראל.', kicker: 'AI יישומי לארגונים' }))).png().toFile(join(OUT, 'default.png')).then(() => count++));
await Promise.all(jobs);
console.log(`[og] generated ${count} images in ${OUT}`);
