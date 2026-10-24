import { SITE, BRAND_NAME, CONTACT_EMAIL } from '@/config/site';

export interface SeoProps {
  title: string; // under 60 chars
  description: string; // under 155 chars
  path: string; // e.g. "/lectures"
  focusKeyPhrase?: string;
  ogImage?: string; // path under /og/
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

export const absolute = (path: string) => new URL(path, SITE.url).toString();

export function organizationSchema() {
  return {
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${SITE.url}/#organization`,
    name: BRAND_NAME,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: absolute('/og/default.png') },
    email: CONTACT_EMAIL,
    description: SITE.description,
    areaServed: { '@type': 'Country', name: 'Israel' },
    knowsAbout: ['Claude Code', 'n8n', 'AI agents', 'AI adoption', 'AI ROI', 'Building products with AI', 'AI for managers'],
    knowsLanguage: ['he'],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: BRAND_NAME,
    inLanguage: 'he',
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string; serviceType: string; audience: string }) {
  return {
    '@type': 'Service',
    '@id': `${absolute(opts.path)}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: absolute(opts.path),
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: { '@type': 'Country', name: 'Israel' },
    availableLanguage: 'he',
    audience: { '@type': 'Audience', audienceType: opts.audience },
  };
}

export function courseSchema(opts: { name: string; description: string; path: string }) {
  return {
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: absolute(opts.path),
    provider: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'he',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: ['onsite', 'online'],
      courseWorkload: 'PT4H',
      instructor: { '@id': `${SITE.url}/#organization` },
    },
    offers: { '@type': 'Offer', category: 'B2B', availability: 'https://schema.org/InStock', priceCurrency: 'ILS' },
  };
}

export function articleSchema(opts: { title: string; description: string; path: string; publishedAt: string; updatedAt: string; image: string; keywords?: string[] }) {
  return {
    '@type': 'BlogPosting',
    '@id': `${absolute(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    url: absolute(opts.path),
    mainEntityOfPage: absolute(opts.path),
    image: absolute(opts.image),
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt,
    inLanguage: 'he',
    keywords: opts.keywords,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.lead', '.prose > p:first-of-type'] },
    isPartOf: { '@id': `${SITE.url}/#website` },
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function webPageSchema(opts: { title: string; description: string; path: string; updatedAt?: string; publishedAt?: string; image: string }) {
  return {
    '@type': 'WebPage',
    '@id': `${absolute(opts.path)}#webpage`,
    url: absolute(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: 'he',
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': `${SITE.url}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: opts.image },
    ...(opts.publishedAt ? { datePublished: opts.publishedAt } : {}),
    ...(opts.updatedAt ? { dateModified: opts.updatedAt } : {}),
  };
}

export function collectionPageSchema(opts: { name: string; description: string; path: string; items: { name: string; path: string }[] }) {
  return {
    '@type': 'CollectionPage',
    '@id': `${absolute(opts.path)}#collection`,
    name: opts.name,
    description: opts.description,
    url: absolute(opts.path),
    inLanguage: 'he',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absolute(it.path) })),
    },
  };
}

export function howToSchema(opts: { name: string; description: string; path: string; steps: { name: string; text: string }[] }) {
  return {
    '@type': 'HowTo',
    '@id': `${absolute(opts.path)}#howto`,
    name: opts.name,
    description: opts.description,
    inLanguage: 'he',
    step: opts.steps.map((st, i) => ({ '@type': 'HowToStep', position: i + 1, name: st.name, text: st.text, url: `${absolute(opts.path)}#step-${i + 1}` })),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Deterministic OG image filename for a path. */
export function ogPathFor(path: string) {
  const key = path === '/' ? 'home' : path.replace(/^\//, '').replace(/[^a-zA-Z0-9-]+/g, '-');
  return `/og/${key}.png`;
}
