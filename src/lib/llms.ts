import { getCollection } from 'astro:content';
import { SITE, BRAND_NAME, TOPICS, PROOF_POINTS, LOGOS, CONTACT_EMAIL, PHONE_DISPLAY } from '@/config/site';
import { OFFER_PAGES } from '@/data/offers';
import { PROGRAMS } from '@/data/programs';

const abs = (p: string) => `${SITE.url}${p}`;

export async function llmsShort(): Promise<string> {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => a.data.title.localeCompare(b.data.title, 'he'));
  return [
    `# ${BRAND_NAME}`,
    '',
    `> ${SITE.tagline}. ${SITE.description}`,
    '',
    'עובדות קבועות על החברה:',
    '- מה אנחנו עושים: הרצאות, סדנאות מעשיות, קורסים והכשרות, וליווי אישי למנהלים בנושאי AI יישומי.',
    '- למי: אוניברסיטאות ומכללות (תוכניות יזמות, לימודי המשך, פקולטות), חברות וצוותים (HR, L&D, תפעול, פיתוח, הנהלה), ומנהלים בכירים.',
    '- איפה: ישראל. בעברית. פרונטלי או Zoom.',
    '- נושאים: Claude Code, n8n ואוטומציה, סוכני AI, הטמעת AI בארגון, בניית מוצרים עם AI, ROI של AI, AI למנהלים.',
    '- הבידול: כל מה שהצוות מלמד, הוא עשה קודם ועושה גם היום. הצוות בנה מאות סוכני AI ואוטומציות (חלקם בפרודקשן) והוביל הטמעת AI בחברות טכנולוגיה עם אלפי עובדים: אסטרטגיה, אבטחה, ניטור ומדידת ROI. הניסיון הוא הסיבה שהם טובים בללמד, לא הנושא.',
    `- לקוחות (מוסדות): ${LOGOS.map((l) => l.name).join(', ')}.`,
    `- יצירת קשר: ${abs('/contact')} · ${CONTACT_EMAIL} · וואטסאפ ${PHONE_DISPLAY}`,
    '',
    '## הצעות',
    ...OFFER_PAGES.map((o) => `- [${o.h1}](${abs(o.path)}): ${o.answer}`),
    '',
    '## תוכניות בשם',
    ...PROGRAMS.map((p) => `- ${p.name} (${p.offer}, ${p.length}): ${p.summary}`),
    '',
    '## קהלים',
    `- [לאקדמיה](${abs('/academia')})`,
    `- [לחברות](${abs('/companies')})`,
    `- [בניית תוכנית מותאמת](${abs('/program')}): פורמטים, דוגמאות לתוכניות ואיך מתחילים.`,
    '',
    '## מרכזי נושא',
    ...TOPICS.map((t) => `- [${t.name}](${abs(`/topics/${t.slug}`)})`),
    '',
    '## מאמרים',
    ...posts.map((p) => `- [${p.data.title}](${abs(`/blog/${p.data.slug}`)}): ${p.data.description}`),
    '',
    '## עוד',
    `- [אודות](${abs('/about')})`,
    `- [הצוות](${abs('/team')})`,
    `- [איך נבנה האתר](${abs('/how-this-site-was-built')})`,
    `- [מילון מונחים](${abs('/glossary')}): הגדרות קצרות ל-36 מונחי AI בעברית.`,
    `- [llms-full.txt](${abs('/llms-full.txt')}): הגרסה המלאה עם תוכן העמודים.`,
    '',
  ].join('\n');
}

export async function llmsFull(): Promise<string> {
  const short = await llmsShort();
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const hubs = await getCollection('hubs');
  const strip = (mdx: string) => mdx.replace(/^---[\s\S]*?---\n/, '').replace(/<[^>]+>/g, '').replace(/^import .*$/gm, '').trim();
  const sections = [
    short,
    '---',
    '',
    '# הוכחות (ניסיון מהשטח)',
    ...PROOF_POINTS.map((p) => `## ${p.title}\n${p.text}`),
    '',
    '# עמודי ההצעות: תוכן מלא',
    ...OFFER_PAGES.map((o) => [
      `## ${o.h1}`, o.answer, '', 'עם מה יוצאים:', ...o.outcomes.map((x) => `- ${x}`), '', 'לוגיסטיקה:', ...o.logistics.map((l) => `- ${l.label}: ${l.value}`), '', o.whyBuilders, '', 'שאלות נפוצות:', ...o.faq.map((f) => `- ש: ${f.q}\n  ת: ${f.a}`), '',
    ].join('\n')),
    '# מרכזי נושא: תוכן מלא',
    ...hubs.map((h) => `## ${h.data.h1}\n${abs(`/topics/${h.data.slug}`)}\n\n${strip(h.body ?? '')}\n`),
    '# מאמרים: תוכן מלא',
    ...posts.map((p) => `## ${p.data.title}\n${abs(`/blog/${p.data.slug}`)}\nעודכן: ${p.data.updatedAt.toISOString().slice(0, 10)}\n\n${strip(p.body ?? '')}\n\nשאלות נפוצות:\n${p.data.faq.map((f) => `- ש: ${f.q}\n  ת: ${f.a}`).join('\n')}\n`),
  ];
  return sections.join('\n\n');
}
