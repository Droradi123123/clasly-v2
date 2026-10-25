#!/usr/bin/env node
/**
 * Quality checklist for blog articles and hubs (run: npm run content:check [file...]).
 * Checks: focus phrase in title, first paragraph, one H2, slug/description; word count 900-1800;
 * >= 3 internal links; FAQ present; no em dashes; no person names (heuristic list).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const HUB_DIR = 'src/content/hubs';
// Commercial phrases owned by money pages. Articles must not use them as their focus phrase (keyword cannibalization).
const RESERVED = {
  'הרצאה על בינה מלאכותית': '/lectures', 'מרצה בינה מלאכותית': '/lectures', 'הרצאת AI לחברות': '/lectures',
  'סדנת AI לארגונים': '/workshops', 'סדנת בינה מלאכותית': '/workshops',
  'קורס AI לעובדים': '/courses', 'קורס בינה מלאכותית': '/courses',
  'ליווי AI למנהלים': '/executive', 'אסטרטגיית AI לארגון': '/executive',
  'הכשרת AI לארגונים': '/companies', 'קורס בינה מלאכותית לאקדמיה': '/academia',
};
const NAME_PATTERNS = [/\bמונדיי\b/, /monday\.com/i, /\bDror\b/i, /\bדרור\b/, /\bLinkedIn\.com\/in\//i];

function parse(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('missing frontmatter');
  const fm = {}; let current = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (kv) { current = kv[1]; fm[current] = kv[2].replace(/^"|"$/g, ''); if (kv[2] === '') fm[current] = []; }
    else if (current && /^\s+-\s*q:/.test(line)) { if (!Array.isArray(fm[current])) fm[current] = []; fm[current].push(line.replace(/^\s+-\s*q:\s*/, '').replace(/^"|"$/g, '')); }
  }
  return { fm, body: m[2] };
}

function check(file, kind) {
  const src = readFileSync(file, 'utf8');
  const { fm, body } = parse(src);
  const errs = [];
  const warn = [];
  const phrase = (fm.focusKeyPhrase || '').trim();
  const norm = (s) => s.toLowerCase().replace(/[\u0591-\u05C7]/g, '');
  if (!phrase) errs.push('focusKeyPhrase missing');
  const has = (s) => norm(s).includes(norm(phrase));
  if (!has(fm.title || '')) errs.push('focus phrase not in title');
  if (!has(fm.description || '')) errs.push('focus phrase not in description');
  if ((fm.title || '').length > 60) warn.push(`title length ${fm.title.length} > 60`);
  if ((fm.description || '').length > 155) warn.push(`description length ${fm.description.length} > 155`);
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith('import ') && !p.startsWith('#'));
  if (!paragraphs[0] || !has(paragraphs[0])) errs.push('focus phrase not in first paragraph');
  const h2s = [...body.matchAll(/^## (.+)$/gm)].map((x) => x[1]);
  if (h2s.length < (kind === 'hub' ? 4 : 4)) errs.push(`only ${h2s.length} H2 headings (need >= 4)`);
  if (!h2s.some(has)) errs.push('focus phrase not in any H2');
  const words = body.replace(/<[^>]+>/g, ' ').replace(/[#*_>|\-]/g, ' ').split(/\s+/).filter(Boolean).length;
  const [min, max] = kind === 'hub' ? [900, 2600] : [900, 1800];
  if (words < min || words > max) errs.push(`word count ${words} outside ${min}-${max}`);
  const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((x) => x[1]);
  if (links.length < 3) errs.push(`only ${links.length} internal links (need >= 3)`);
  if (kind === 'blog' && fm.topicHub && !links.some((l) => l.startsWith(`/topics/${fm.topicHub}`))) errs.push('missing link to topic hub');
  if (fm.relatedOffer && !links.some((l) => l === fm.relatedOffer || l.startsWith(fm.relatedOffer + '#'))) errs.push(`missing link to related offer ${fm.relatedOffer}`);
  if (!Array.isArray(fm.faq) || fm.faq.length < 3) errs.push('faq missing or < 3');
  if (kind === 'blog' && RESERVED[phrase]) errs.push(`focus phrase "${phrase}" is owned by ${RESERVED[phrase]}; pick a long-tail variant and link to that page`);
  if (/[—–]/.test(src)) errs.push('em/en dash found (use comma, colon or new sentence)');
  for (const re of NAME_PATTERNS) if (re.test(src)) errs.push(`forbidden name pattern: ${re}`);
  if (/\*\*[^*]+\*\*/.test(fm.title || '')) warn.push('markdown in title');
  return { file: basename(file), words, errs, warn };
}

const args = process.argv.slice(2);
const files = args.length ? args.map((f) => [f, f.includes('/hubs/') ? 'hub' : 'blog']) : [
  ...readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx')).map((f) => [join(BLOG_DIR, f), 'blog']),
  ...readdirSync(HUB_DIR).filter((f) => f.endsWith('.mdx')).map((f) => [join(HUB_DIR, f), 'hub']),
];
let failed = 0;
const seen = { focus: new Map(), title: new Map(), description: new Map() };
for (const [f, kind] of files) {
  try {
    const r = check(f, kind);
    const { fm } = parse(readFileSync(f, 'utf8'));
    for (const k of ['focusKeyPhrase', 'title', 'description']) {
      const key = k === 'focusKeyPhrase' ? 'focus' : k;
      const v = (fm[k] || '').trim();
      if (v && seen[key].has(v)) r.errs.push(`duplicate ${k} with ${seen[key].get(v)}`); else seen[key].set(v, r.file);
    }
    const ok = r.errs.length === 0;
    if (!ok) failed++;
    console.log(`${ok ? '✓' : '✗'} ${r.file} (${r.words} words)`);
    for (const e of r.errs) console.log(`   ERROR: ${e}`);
    for (const w of r.warn) console.log(`   warn: ${w}`);
  } catch (e) { failed++; console.log(`✗ ${f}: ${e.message}`); }
}
console.log(`\n${files.length - failed}/${files.length} passed`);
process.exit(failed ? 1 : 0);
