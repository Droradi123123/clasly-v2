/**
 * Single source of truth for brand placeholders and entity facts.
 * Change the brand name, domain, WhatsApp number and contact email HERE ONLY.
 * Every page, schema block, llms.txt and OG image reads from this file.
 */
export const BRAND_NAME = 'RealAI';
export const DOMAIN = 'realai.co.il';
/** The only place the WhatsApp/phone number is set: international format, digits only, no "+". */
export const WHATSAPP_NUMBER = '972548023445';
export const CONTACT_EMAIL = 'happytelaviv@gmail.com';
/** Display (054-802-3445) and E.164 (+972548023445) forms, derived from WHATSAPP_NUMBER. */
const localNumber = `0${WHATSAPP_NUMBER.replace(/^972/, '')}`;
export const PHONE_DISPLAY = `${localNumber.slice(0, 3)}-${localNumber.slice(3, 6)}-${localNumber.slice(6)}`;
export const PHONE_E164 = `+${WHATSAPP_NUMBER}`;
if (!/^9725\d{8}$/.test(WHATSAPP_NUMBER)) {
  console.warn(`[site config] WHATSAPP_NUMBER "${WHATSAPP_NUMBER}" is not an Israeli mobile number (9725XXXXXXXX). WhatsApp links will not open the right chat.`);
}

/** Until DOMAIN is set, the Cloudflare preview URL is used for canonical links. */
const PREVIEW_URL = 'https://realai.workers.dev';
export const SITE_URL = DOMAIN.startsWith('{{') ? PREVIEW_URL : `https://${DOMAIN}`;

export const SITE = {
  name: BRAND_NAME,
  url: SITE_URL,
  locale: 'he_IL',
  lang: 'he',
  // Entity facts: keep identical everywhere (site, LinkedIn, directories) so AI engines form one stable entity.
  tagline: 'לומדים AI ממי שעושים את זה',
  description:
    'הרצאות, סדנאות, קורסים וליווי אישי למנהלים בהטמעת AI בארגונים בישראל. מועבר בעברית על ידי צוות שהטמיע AI בעצמו בחברות טכנולוגיה מובילות עם אלפי עובדים: Claude Code, n8n, סוכני AI ומדידת ROI.',
  whatsappNumber: WHATSAPP_NUMBER,
  contactEmail: CONTACT_EMAIL,
  defaultOgImage: '/og/default.png',
  // Public analytics token for Cloudflare Web Analytics (set in Cloudflare dashboard, then paste here or via PUBLIC_CF_ANALYTICS_TOKEN).
  cfAnalyticsToken: import.meta.env?.PUBLIC_CF_ANALYTICS_TOKEN ?? '',
  // Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Empty = no Google Analytics on the site.
  gaMeasurementId: import.meta.env?.PUBLIC_GA_ID || 'G-P337N4P5SD',
  turnstileSiteKey: import.meta.env?.PUBLIC_TURNSTILE_SITE_KEY ?? '',
} as const;

/** Public profiles of the brand (LinkedIn, YouTube...). Added to Organization.sameAs so engines link the entity. */
export const SOCIAL_PROFILES: string[] = [];

/** Search engine verification codes (meta tags). Prefer DNS verification in Cloudflare; these are a fallback. */
export const SITE_VERIFICATION = {
  google: import.meta.env?.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  bing: import.meta.env?.PUBLIC_BING_SITE_VERIFICATION ?? '',
};

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
  guides: [
    { href: '/topics/ai-adoption', label: 'איך להטמיע AI בארגון' },
    { href: '/blog/hours-saved-is-not-an-ai-strategy', label: 'חיסכון בשעות הוא לא אסטרטגיה' },
    { href: '/blog/how-to-measure-ai-roi', label: 'מדידת ROI של AI' },
    { href: '/blog/chatbot-vs-automation-vs-agent', label: 'צ׳אטבוט, אוטומציה או סוכן?' },
    { href: '/blog/claude-code-for-non-developers', label: 'Claude Code למי שלא מתכנת' },
    { href: '/blog/n8n-ai-agent', label: 'סוכן AI עם n8n' },
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

/**
 * Client logos, shown in the marquee in this order: universities and colleges first. Files live in /public/logos; width/height are the file's pixel size.
 * Real logos are white on transparency (the strip inverts them in light mode).
 */
export type Audience = 'academia' | 'company';
export const LOGOS: { id: string; name: string; file: string; width: number; height: number; audience: Audience; placeholder: boolean }[] = [
  { id: 'technion-thub', name: 'הטכניון, t:hub', file: '/logos/technion-thub.png', width: 482, height: 96, audience: 'academia', placeholder: false },
  { id: 'tau', name: 'אוניברסיטת תל אביב', file: '/logos/tau.png', width: 293, height: 160, audience: 'academia', placeholder: false },
  { id: 'haifa', name: 'אוניברסיטת חיפה', file: '/logos/haifa.png', width: 265, height: 160, audience: 'academia', placeholder: false },
  { id: 'bgu', name: 'אוניברסיטת בן-גוריון בנגב', file: '/logos/bgu.svg', width: 600, height: 148, audience: 'academia', placeholder: false },
  { id: 'reichman', name: 'אוניברסיטת רייכמן', file: '/logos/reichman.svg', width: 163, height: 99, audience: 'academia', placeholder: false },
  { id: 'colman', name: 'המכללה למינהל', file: '/logos/colman.png', width: 169, height: 160, audience: 'academia', placeholder: false },
  { id: '8200', name: 'יחידה 8200', file: '/logos/8200.png', width: 160, height: 160, audience: 'company', placeholder: false },
  { id: 'navy', name: 'חיל הים', file: '/logos/navy.png', width: 294, height: 110, audience: 'company', placeholder: false },
];

/** Proof points. Never name an employer. */
export const PROOF_POINTS = [
  {
    stat: 'אלפי עובדים',
    title: 'הטמענו AI בארגונים של אלפי עובדים',
    text: 'בנינו והובלנו את אסטרטגיית ה-AI בחברות טכנולוגיה מובילות, עד לרגע שבו אלפי אנשים משתמשים בזה כל יום. לא בפיילוט. בעבודה עצמה.',
  },
  {
    stat: 'מאות אייג׳נטים',
    title: 'בנינו מאות סוכני AI ואוטומציות',
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
