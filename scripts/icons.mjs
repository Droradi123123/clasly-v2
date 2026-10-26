#!/usr/bin/env node
/**
 * Brand icons: "R" in Secular One with a blue dot, on white. The glyph is converted to a path
 * so favicon.svg needs no font, and the PNG sizes are rendered from the same SVG with sharp.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAPER = '#ffffff', INK = '#141414', ACCENT = '#1f3fd1';

// WOFF (zlib tables) -> TTF buffer, same approach as og.mjs.
function woffToTtf(buf) {
  const n = buf.readUInt16BE(12); const entries = [];
  for (let i = 0; i < n; i++) { const o = 44 + i * 20; entries.push({ tag: buf.subarray(o, o + 4), offset: buf.readUInt32BE(o + 4), comp: buf.readUInt32BE(o + 8), orig: buf.readUInt32BE(o + 12), sum: buf.readUInt32BE(o + 16) }); }
  let off = 12 + 16 * n;
  const tables = entries.map((e) => { const raw = buf.subarray(e.offset, e.offset + e.comp); const data = e.comp === e.orig ? raw : inflateSync(raw); const t = { ...e, data, out: off }; off += (data.length + 3) & ~3; return t; });
  const out = Buffer.alloc(off);
  out.writeUInt32BE(buf.readUInt32BE(4), 0); out.writeUInt16BE(n, 4);
  let es = 0, sr = 1; while (sr * 2 <= n) { sr *= 2; es++; } sr *= 16;
  out.writeUInt16BE(sr, 6); out.writeUInt16BE(es, 8); out.writeUInt16BE(n * 16 - sr, 10);
  tables.forEach((t, i) => { const o = 12 + i * 16; t.tag.copy(out, o); out.writeUInt32BE(t.sum, o + 4); out.writeUInt32BE(t.out, o + 8); out.writeUInt32BE(t.orig, o + 12); t.data.copy(out, t.out); });
  return out;
}
const ttf = woffToTtf(readFileSync(join(root, 'node_modules/@fontsource/secular-one/files/secular-one-latin-400-normal.woff')));
const font = opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));

// 64x64 canvas: the R fills most of it, the full stop sits at the baseline on the right.
const size = 46;
const r = font.getPath('R', 0, 0, size);
const b = r.getBoundingBox();
const w = b.x2 - b.x1, h = b.y2 - b.y1;
const dot = 7;
const x = (64 - (w + 4 + dot)) / 2 - b.x1, y = (64 - h) / 2 - b.y1;
const rPath = font.getPath('R', x, y, size).toPathData(2);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${PAPER}"/><path d="${rPath}" fill="${INK}"/><rect x="${(x + b.x2 + 4).toFixed(1)}" y="${(y + b.y2 - dot).toFixed(1)}" width="${dot}" height="${dot}" fill="${ACCENT}"/></svg>`;
writeFileSync(join(root, 'public/favicon.svg'), svg);
for (const [file, px] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512], ['logo.png', 512]]) {
  await sharp(Buffer.from(svg), { density: 72 * (px / 64) }).resize(px, px).png({ compressionLevel: 9 }).toFile(join(root, 'public', file));
}
console.log('[icons] favicon.svg + 5 PNGs written');
