/**
 * Related articles by relevance, spread so every article receives links.
 * Score = same topic hub + shared words in the focus phrase, keywords and title + same offer.
 * Each time an article is picked its score for later pages drops a little, so links don't pile up on a few articles.
 */
import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;
const STOP = new Set(['ai', 'של', 'עם', 'על', 'מה', 'איך', 'זה', 'או', 'לא', 'גם', 'כל', 'את', 'אחרי', 'צעד', 'בינה', 'מלאכותית', 'מדריך', 'בארגון', 'לארגון', 'לארגונים', 'ארגון']);
const strip = (w: string) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').toLowerCase().replace(/^(ה|ל|ב|ו|מ|ש)(?=[֐-׿]{3,})/, '');
function tokens(p: Post): Map<string, number> {
  const d = p.data;
  const m = new Map<string, number>();
  const add = (text: string, weight: number) => { for (const raw of text.split(/[\s,:;?!()\-/]+/)) { const w = strip(raw); if (w.length > 1 && !STOP.has(w)) m.set(w, Math.max(m.get(w) ?? 0, weight)); } };
  add(d.title, 1); add(d.keywords.join(' '), 1.5); add(d.focusKeyPhrase, 3);
  return m;
}

export function relatedMap(posts: Post[], count = 6): Map<string, Post[]> {
  const sorted = [...posts].sort((a, b) => a.data.slug.localeCompare(b.data.slug));
  const tok = new Map(sorted.map((p) => [p.id, tokens(p)]));
  const picked = new Map<string, number>(sorted.map((p) => [p.id, 0]));
  const out = new Map<string, Post[]>();
  for (const entry of sorted) {
    const mine = tok.get(entry.id)!;
    const scored = sorted.filter((p) => p.id !== entry.id).map((p) => {
      let s = 0;
      for (const [w, weight] of tok.get(p.id)!) if (mine.has(w)) s += Math.min(weight, mine.get(w)!);
      if (p.data.topicHub === entry.data.topicHub) s += 3;
      if (p.data.relatedOffer === entry.data.relatedOffer) s += 0.5;
      return { p, s: s - 0.6 * picked.get(p.id)! };
    }).sort((a, b) => b.s - a.s || a.p.data.slug.localeCompare(b.p.data.slug));
    const chosen = scored.slice(0, count).map((x) => x.p);
    for (const c of chosen) picked.set(c.id, picked.get(c.id)! + 1);
    out.set(entry.id, chosen);
  }
  return out;
}
