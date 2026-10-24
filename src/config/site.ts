/**
 * Single source of truth for brand placeholders and entity facts.
 * Change the brand name, domain, WhatsApp number and contact email HERE ONLY.
 * Every page, schema block, llms.txt and OG image reads from this file.
 */
export const BRAND_NAME = 'RealAI';
export const DOMAIN = 'realai.co.il';
export const WHATSAPP_NUMBER = '{{WHATSAPP_NUMBER}}'; // international format, digits only, e.g. 9725XXXXXXXX
export const CONTACT_EMAIL = '{{CONTACT_EMAIL}}';

/** Until DOMAIN is set, the Cloudflare preview URL is used for canonical links. */
const PREVIEW_URL = 'https://realai.workers.dev';
export const SITE_URL = DOMAIN.startsWith('{{') ? PREVIEW_URL : `https://${DOMAIN}`;

export const SITE = {
  name: BRAND_NAME,
  url: SITE_URL,
  locale: 'he_IL',
  lang: 'he',
  // Entity facts: keep identical everywhere (site, LinkedIn, directories) so AI engines form one stable entity.
  tagline: 'להטמיע AI בארגון זה קשה. אנחנו עשינו את זה, ועכשיו מלמדים את זה',
  description:
    'הרצאות, סדנאות, קורסים וליווי אישי למנהלים בהטמעת AI בארגונים בישראל. מועבר בעברית על ידי צוות שהטמיע AI בעצמו בחברות טכנולוגיה מובילות עם אלפי עובדים: Claude Code, n8n, סוכני AI ומדידת ROI.',
  whatsappNumber: WHATSAPP_NUMBER,
  contactEmail: CONTACT_EMAIL,
  defaultOgImage: '/og/default.png',
  // Public analytics token for Cloudflare Web Analytics (set in Cloudflare dashboard, then paste here or via PUBLIC_CF_ANALYTICS_TOKEN).
  cfAnalyticsToken: import.meta.env?.PUBLIC_CF_ANALYTICS_TOKEN ?? '',
  turnstileSiteKey: import.meta.env?.PUBLIC_TURNSTILE_SITE_KEY ?? '',
} as const;

/** Named programs (placeholders until approved). Names sell better and become searchable brand terms. */
export const PROGRAM_NAMES = {
  claudeCodeDay: 'יום Claude Code',
  agentsBootcamp: 'בוטקמפ סוכני AI',
  n8nWorkshop: 'סדנת n8n: מאפס לאוטומציה',
  executiveSprint: 'ספרינט AI למנהלים',
  aiAtWorkLecture: 'AI בעבודה: מה באמת עובד',
  productBuildersCourse: 'קורס בניית מוצרים עם AI',
} as const;

export const NAV = [
  { href: '/lectures', label: 'הרצאות' },
  { href: '/workshops', label: 'סדנאות' },
  { href: '/courses', label: 'קורסים' },
  { href: '/executive', label: 'ליווי למנהלים' },
  { href: '/blog', label: 'בלוג' },
  { href: '/about', label: 'אודות' },
] as const;

export const FOOTER_LINKS = {
  offers: [
    { href: '/lectures', label: 'הרצאות AI לארגונים' },
    { href: '/workshops', label: 'סדנאות AI' },
    { href: '/courses', label: 'קורסים והכשרות' },
    { href: '/executive', label: 'ליווי אישי למנהלים' },
  ],
  audiences: [
    { href: '/academia', label: 'לאוניברסיטאות ומכללות' },
    { href: '/companies', label: 'לחברות וצוותים' },
    { href: '/team', label: 'הצוות' },
    { href: '/about', label: 'אודות' },
  ],
  resources: [
    { href: '/blog', label: 'בלוג' },
    { href: '/topics', label: 'נושאים' },
    { href: '/glossary', label: 'מילון מונחים' },
    { href: '/how-this-site-was-built', label: 'איך נבנה האתר' },
    { href: '/contact', label: 'צור קשר' },
  ],
  legal: [
    { href: '/accessibility', label: 'הצהרת נגישות' },
    { href: '/privacy', label: 'מדיניות פרטיות' },
  ],
} as const;

/** Client logos. SVG files live in /public/logos. Add a line here to add a logo. */
export type Audience = 'academia' | 'company';
export const LOGOS: { id: string; name: string; file: string; audience: Audience; placeholder: boolean }[] = [
  { id: 'technion', name: 'הטכניון', file: '/logos/technion.svg', audience: 'academia', placeholder: true },
  { id: 'tau', name: 'אוניברסיטת תל אביב', file: '/logos/tau.svg', audience: 'academia', placeholder: true },
  { id: 'haifa', name: 'אוניברסיטת חיפה', file: '/logos/haifa.svg', audience: 'academia', placeholder: true },
  { id: 'bgu', name: 'אוניברסיטת בן-גוריון', file: '/logos/bgu.svg', audience: 'academia', placeholder: true },
  { id: 'colman', name: 'המכללה למינהל', file: '/logos/colman.svg', audience: 'academia', placeholder: true },
];

/** Proof points. Never name an employer. */
export const PROOF_POINTS = [
  {
    stat: 'אלפי עובדים',
    title: 'הטמענו AI בארגונים של אלפי עובדים',
    text: 'בנינו והובלנו את אסטרטגיית ה-AI בחברות טכנולוגיה מובילות, עד לרגע שבו אלפי אנשים משתמשים בזה כל יום. לא בפיילוט. בעבודה עצמה.',
  },
  {
    stat: 'פרודקשן',
    title: 'סוכנים ואוטומציות שרצים באמת',
    text: 'סוכני AI ותהליכים אוטומטיים שבנינו רצים היום בפרודקשן, עם ניטור, עם אמון של המשתמשים, ועם ROI שהנהלה בדקה ואישרה.',
  },
  {
    stat: 'בידיים',
    title: 'כל מה שאנחנו מלמדים, עשינו בעצמנו',
    text: 'את הטעויות, את המשא ומתן עם אבטחת מידע, ואת השבוע שבו הכול נשבר. זה הידע שאין ביוטיוב, וזה מה שאנחנו מביאים לכיתה.',
  },
] as const;

/** The four offers, presented as equal options. */
export const OFFERS = [
  {
    slug: 'lectures',
    href: '/lectures',
    name: 'הרצאות',
    value: 'הרצאה אחת שמשנה איך הצוות חושב על AI, עם דוגמאות חיות מפרודקשן.',
    audience: 'כנסים, ימי עיון, הנהלות וצוותים',
    audienceType: 'company',
  },
  {
    slug: 'workshops',
    href: '/workshops',
    name: 'סדנאות',
    value: 'יום בנייה מעשי: יוצאים עם אוטומציה או סוכן שעובד, לא עם מצגת.',
    audience: 'צוותי פיתוח, מוצר, תפעול ומחלקות שלמות',
    audienceType: 'company',
  },
  {
    slug: 'courses',
    href: '/courses',
    name: 'קורסים והכשרות',
    value: 'מסלול של כמה מפגשים שבונה יכולת AI אמיתית בארגון או בתוכנית אקדמית.',
    audience: 'אוניברסיטאות, מכללות וחברות שמכשירות קבוצות',
    audienceType: 'academia',
  },
  {
    slug: 'executive',
    href: '/executive',
    name: 'ליווי אישי למנהלים',
    value: 'אסטרטגיית AI יישומית למנהל או למנהלת: מה לעשות ברבעון הקרוב, ואיך.',
    audience: 'מנכ"לים, סמנכ"לים, ראשי מחלקות',
    audienceType: 'executive',
  },
] as const;

/** Topic hubs. Slugs are short English for clean URLs. */
export const TOPICS = [
  { slug: 'claude-code', name: 'Claude Code', keyPhrase: 'Claude Code', full: true },
  { slug: 'n8n', name: 'n8n ואוטומציה', keyPhrase: 'n8n', full: true },
  { slug: 'ai-agents', name: 'סוכני AI', keyPhrase: 'סוכני AI', full: true },
  { slug: 'ai-adoption', name: 'הטמעת AI בארגון', keyPhrase: 'הטמעת AI בארגון', full: false },
  { slug: 'building-with-ai', name: 'בניית מוצרים עם AI', keyPhrase: 'בניית מוצרים עם AI', full: false },
  { slug: 'ai-roi', name: 'ROI של AI', keyPhrase: 'ROI של AI', full: false },
  { slug: 'ai-for-managers', name: 'AI למנהלים', keyPhrase: 'AI למנהלים', full: false },
] as const;
export type TopicSlug = (typeof TOPICS)[number]['slug'];

/** Build a WhatsApp click-to-chat URL with a pre-filled Hebrew message. */
export function whatsappUrl(message: string): string {
  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${number || '0'}?text=${encodeURIComponent(message)}`;
}
