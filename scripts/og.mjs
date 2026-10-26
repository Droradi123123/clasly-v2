#!/usr/bin/env node
/**
 * Auto-generates one Open Graph image (1200x630 PNG) per built page.
 * Runs after `astro build`: scans dist/client/**\/*.html for <title>, description and og:image,
 * renders an SVG with the self-hosted Frank Ruhl Libre and Assistant fonts and converts it with sharp.
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
  const files = [
    ...['frank-ruhl-libre-hebrew-700-normal', 'frank-ruhl-libre-hebrew-900-normal', 'frank-ruhl-libre-latin-700-normal', 'frank-ruhl-libre-latin-900-normal'].map((f) => join(root, 'node_modules/@fontsource/frank-ruhl-libre/files', f)),
    ...['assistant-hebrew-400-normal', 'assistant-hebrew-700-normal', 'assistant-latin-400-normal', 'assistant-latin-700-normal'].map((f) => join(root, 'node_modules/@fontsource/assistant/files', f)),
  ];
  for (const f of files) {
    const dst = join(CACHE, `${f.split('/').pop()}.ttf`);
    if (!existsSync(dst)) woffToTtf(`${f}.woff`, dst);
  }
  const conf = join(CACHE, 'fonts.conf');
  writeFileSync(conf, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${CACHE}</dir><cachedir>${join(CACHE, 'fc')}</cachedir></fontconfig>`);
  process.env.FONTCONFIG_FILE = conf;
}
prepareFonts();
const sharp = (await import('sharp')).default;

const PAPER = '#f5f0e8', INK = '#1b1813', INK2 = '#625b50', RULE = '#d5ccbd', ACCENT = '#c23b22';
// The full stop is a separate shape: a tspan inside an RTL-shaped line ends up on the wrong side.
const brandMarkup = () => esc(BRAND);
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
  const titleText = tl.map((l) => `<text x="1110" y="${(y += size * 1.15)}" direction="rtl" text-anchor="start" font-family="Frank Ruhl Libre" font-weight="700" font-size="${size}" fill="${INK}">${esc(l)}</text>`).join('');
  y += 30;
  const descText = dl.map((l) => `<text x="1110" y="${(y += 38)}" direction="rtl" text-anchor="start" font-family="Assistant" font-weight="400" font-size="28" fill="${INK2}">${esc(l)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="90" y="90" width="1020" height="2" fill="${INK}"/>
  <text x="1098" y="150" direction="ltr" text-anchor="end" font-family="Frank Ruhl Libre" font-weight="700" font-size="40" fill="${INK}">${brandMarkup()}</text>
  <rect x="1102" y="142" width="8" height="8" fill="${ACCENT}"/>
  <rect x="1086" y="206" width="24" height="2" fill="${ACCENT}"/>
  <text x="1076" y="214" direction="rtl" text-anchor="start" font-family="Assistant" font-weight="700" font-size="22" fill="${ACCENT}">${esc(kicker)}</text>
  ${titleText}${descText}
  <rect x="90" y="560" width="1020" height="1" fill="${RULE}"/>
  <text x="1110" y="600" direction="rtl" text-anchor="start" font-family="Assistant" font-weight="400" font-size="22" fill="${INK2}">להטמיע AI זה קשה. אנחנו עושים את זה.</text>
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
jobs.push(sharp(Buffer.from(svg({ title: 'להטמיע AI בארגון זה קשה. אנחנו עושים את זה.', description: 'הרצאות, סדנאות, קורסים וליווי למנהלים, מצוות שהטמיע AI בארגונים של אלפי עובדים.', kicker: 'AI יישומי לארגונים' }))).png().toFile(join(OUT, 'default.png')).then(() => count++));
await Promise.all(jobs);
console.log(`[og] generated ${count} images in ${OUT}`);
