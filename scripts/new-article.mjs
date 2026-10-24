#!/usr/bin/env node
/**
 * Creates a draft MDX article following the GEO structure from a focus key phrase.
 * Usage: npm run new-article -- "ביטוי מפתח" --slug my-slug --hub n8n --offer /workshops [--ai]
 * Without --ai it writes a structured skeleton with TODO markers. With --ai and ANTHROPIC_API_KEY set,
 * it asks Claude to write the full draft per content/STYLE.md, then runs the quality checklist.
 */
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const phrase = args.find((a) => !a.startsWith('--'));
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const HUBS = ['claude-code', 'n8n', 'ai-agents', 'ai-adoption', 'building-with-ai', 'ai-roi', 'ai-for-managers'];
const OFFERS = ['/lectures', '/workshops', '/courses', '/executive'];
if (!phrase) { console.error('Usage: npm run new-article -- "ביטוי מפתח" --slug slug --hub n8n --offer /workshops [--ai]'); process.exit(1); }
const slug = opt('slug', phrase.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `article-${Date.now()}`);
const hub = opt('hub', 'ai-adoption');
const offer = opt('offer', '/workshops');
if (!HUBS.includes(hub)) { console.error(`--hub must be one of ${HUBS.join(', ')}`); process.exit(1); }
if (!OFFERS.includes(offer)) { console.error(`--offer must be one of ${OFFERS.join(', ')}`); process.exit(1); }
const file = `src/content/blog/${slug}.mdx`;
if (existsSync(file)) { console.error(`${file} already exists`); process.exit(1); }
const today = new Date().toISOString().slice(0, 10);
const ctaByOffer = { '/lectures': 'רוצים הרצאה על זה לארגון שלכם? [להרצאות](/lectures)', '/workshops': 'רוצים סדנה על זה לצוות שלכם? [לסדנאות](/workshops)', '/courses': 'רוצים קורס על זה לארגון או לתוכנית שלכם? [לקורסים](/courses)', '/executive': 'רוצים ליווי אישי ליישום? [לליווי למנהלים](/executive)' };

const skeleton = `---
title: "${phrase}: TODO כותרת עד 60 תווים"
slug: "${slug}"
description: "TODO תיאור עם ${phrase}, עד 155 תווים."
focusKeyPhrase: "${phrase}"
topicHub: "${hub}"
relatedOffer: "${offer}"
keywords: []
publishedAt: ${today}
updatedAt: ${today}
draft: true
faq:
  - q: "TODO שאלה 1?"
    a: "TODO תשובה ישירה."
  - q: "TODO שאלה 2?"
    a: "TODO תשובה ישירה."
  - q: "TODO שאלה 3?"
    a: "TODO תשובה ישירה."
---

TODO פסקת פתיחה: תשובה ישירה לשאלה "${phrase}" ב-2 עד 3 משפטים, שאפשר לצטט לבד.

## מה זה ${phrase}?

<div class="definition">**${phrase}:** TODO הגדרה במשפט אחד.</div>

TODO הקשר קצר. קישור למרכז הנושא: [${hub}](/topics/${hub}).

## למה זה חשוב לארגון?

TODO.

## איך עושים את זה צעד אחרי צעד?

1. TODO
2. TODO
3. TODO

## דוגמה מיישום אמיתי

TODO דוגמה אנונימית עם מספרים (שעות, שבועות, אחוזים).

## מה הטעויות הנפוצות?

- TODO
- TODO

## השוואה

| אפשרות | מתי מתאים | חיסרון |
| --- | --- | --- |
| TODO | TODO | TODO |

עוד על זה: [מאמר קשור](/blog/n8n-ai-agent).

${ctaByOffer[offer]}
`;

async function withAi() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { console.error('ANTHROPIC_API_KEY not set; writing skeleton instead.'); return skeleton; }
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: key });
  const style = readFileSync('content/STYLE.md', 'utf8');
  const example = readFileSync('src/content/blog/n8n-ai-agent.mdx', 'utf8');
  const stream = client.messages.stream({
    model: process.env.OUTLINE_MODEL || 'claude-opus-5-5',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: `אתה כותב תוכן SEO/GEO בעברית לחברה שמעבירה הרצאות, סדנאות וקורסי AI לארגונים בישראל. עקוב בדיוק אחרי מדריך הסגנון. אל תזכיר שמות אנשים או מעסיקים. בלי קווים מפרידים ארוכים. החזר רק את קובץ ה-MDX המלא, כולל frontmatter, בלי הסברים.\n\nמדריך סגנון:\n${style}\n\nדוגמה לקובץ תקין:\n${example}`,
    messages: [{ role: 'user', content: `כתוב מאמר חדש. focusKeyPhrase: "${phrase}". slug: "${slug}". topicHub: "${hub}". relatedOffer: "${offer}". publishedAt ו-updatedAt: ${today}. אורך 1000 עד 1500 מילים. כלול קישור ל-/topics/${hub}, ל-${offer} ולמאמר קשור אחד לפחות.` }],
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === 'refusal') throw new Error('Model refused the request');
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return text.replace(/^```mdx?\n/, '').replace(/\n```\s*$/, '');
}

const content = args.includes('--ai') ? await withAi() : skeleton;
writeFileSync(file, content);
console.log(`Draft written: ${file}`);
try { execSync(`node scripts/content-check.mjs ${file}`, { stdio: 'inherit' }); } catch { console.log('Fix the checklist items above before removing draft: true.'); }
