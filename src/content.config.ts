import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topicSlugs = ['claude-code', 'n8n', 'ai-agents', 'ai-adoption', 'building-with-ai', 'ai-roi', 'ai-for-managers'] as const;
const offers = ['/lectures', '/workshops', '/courses', '/executive'] as const;

/** Blog articles: one focus key phrase each, answer-first, FAQ, contextual CTA. */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().max(160),
    focusKeyPhrase: z.string(),
    topicHub: z.enum(topicSlugs),
    relatedOffer: z.enum(offers),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    keywords: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** Topic hubs: long-form pillar content, written in full for the launch hubs. */
const hubs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/hubs' }),
  schema: z.object({
    title: z.string().max(70),
    slug: z.enum(topicSlugs),
    description: z.string().max(160),
    focusKeyPhrase: z.string(),
    h1: z.string(),
    relatedOffer: z.enum(offers),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    updatedAt: z.coerce.date(),
    /** Optional step-by-step method, published as HowTo structured data. */
    howTo: z
      .object({
        name: z.string(),
        description: z.string(),
        steps: z.array(z.object({ name: z.string(), text: z.string() })).min(2),
      })
      .optional(),
  }),
});

/** Glossary term pages ("מה זה X?"): one per term that has search demand. The slug matches the entry in src/data/glossary.ts. */
const terms = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/glossary' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    term: z.string(),
    en: z.string().optional(),
    title: z.string().max(70),
    description: z.string().max(160),
    focusKeyPhrase: z.string(),
    topicHub: z.enum(topicSlugs),
    relatedOffer: z.enum(offers),
    related: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(2),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

/** "AI ל[מקצוע]" pages (/ai-for/<slug>): uses, prompts (pulled from src/data/prompts.ts by role) and rules for one profession. */
const professions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/professions' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    profession: z.string(),
    title: z.string().max(70),
    description: z.string().max(160),
    focusKeyPhrase: z.string(),
    topicHub: z.enum(topicSlugs),
    relatedOffer: z.enum(offers),
    promptRoles: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { blog, hubs, terms, professions };
