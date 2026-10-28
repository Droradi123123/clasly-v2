#!/usr/bin/env node
/**
 * Renders an article figure from SVG to PNG with the site fonts, so Hebrew text in diagrams looks like the site.
 * Usage: npm run figure -- <in.svg> <public/blog/<slug>/<name>.png> [width=1600]
 * In the SVG use font-family="Secular One" for headings and "Assistant" (font-weight 400 or 700) for text,
 * direction="rtl" on Hebrew <text>, and the site palette: ink #141414, blue #1f3fd1, soft blue #e9edfd,
 * light blue #9db0f5, rules #e2e2dd, white background. Keep a viewBox; the PNG is scaled to the given width.
 */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { prepareFonts } from './lib/fonts.mjs';

const [, , input, output, widthArg] = process.argv;
if (!input || !output) { console.error('Usage: npm run figure -- <in.svg> <out.png> [width]'); process.exit(1); }
prepareFonts();
const sharp = (await import('sharp')).default;
mkdirSync(dirname(output), { recursive: true });
const width = Number(widthArg) || 1600;
await sharp(input, { density: 300 }).resize({ width }).flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toFile(output);
const m = await sharp(output).metadata();
console.log(`[figure] ${output} ${m.width}x${m.height}`);
