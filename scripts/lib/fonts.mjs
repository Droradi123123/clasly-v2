/**
 * Site fonts for server-side SVG rendering (librsvg via sharp). librsvg needs TTF, so the bundled WOFF files
 * (zlib tables) are converted once into node_modules/.cache/og-fonts and exposed through FONTCONFIG_FILE.
 * Call prepareFonts() before importing sharp. Families: "Secular One" (headings), "Assistant" (400, 700).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CACHE = join(root, 'node_modules', '.cache', 'og-fonts');

export function woffToTtf(src, dst) {
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

export function prepareFonts() {
  mkdirSync(CACHE, { recursive: true });
  const files = [
    ...['secular-one-hebrew-400-normal', 'secular-one-latin-400-normal'].map((f) => join(root, 'node_modules/@fontsource/secular-one/files', f)),
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
