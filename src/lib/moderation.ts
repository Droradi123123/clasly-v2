/** Cheap, deterministic moderation before spending an LLM call. Returns a Hebrew reason or null. */
const MAX_LEN = 300;
const BLOCK = [/https?:\/\//i, /<script/i, /ignore (all|previous|the) instructions/i, /system prompt/i, /jailbreak/i, /התעלם מההוראות/];

export function moderatePrompt(raw: unknown): { ok: true; prompt: string } | { ok: false; reason: string } {
  if (typeof raw !== 'string') return { ok: false, reason: 'נא לכתוב משפט אחד על מה שהארגון רוצה לעשות עם AI.' };
  const prompt = raw.replace(/\s+/g, ' ').trim();
  if (prompt.length < 6) return { ok: false, reason: 'כתבו לפחות כמה מילים, למשל: "להכניס אוטומציות למחלקת השירות".' };
  if (prompt.length > MAX_LEN) return { ok: false, reason: `קצרו בבקשה ל-${MAX_LEN} תווים.` };
  if (BLOCK.some((re) => re.test(prompt))) return { ok: false, reason: 'הקלט הזה לא נתמך. תארו במילים פשוטות מה הארגון רוצה להשיג.' };
  const letters = (prompt.match(/[֐-׿a-zA-Z]/g) ?? []).length;
  if (letters / prompt.length < 0.4) return { ok: false, reason: 'נראה שחסר טקסט. ספרו לנו במשפט מה הארגון רוצה לעשות עם AI.' };
  return { ok: true, prompt };
}

/** Normalized cache key: lowercase, no punctuation, collapsed whitespace. */
export function normalizeForCache(prompt: string): string {
  return prompt.toLowerCase().replace(/[^֐-׿a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}
