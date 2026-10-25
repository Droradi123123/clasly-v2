# RealAI: realai.co.il (Hebrew, RTL)

Marketing and lead-generation site for a company that delivers applied AI education to organizations in Israel:
lectures, hands-on workshops, courses and executive one-on-ones. Built with Astro, Tailwind, MDX and Cloudflare Workers with D1.

Brand: **RealAI**, domain **realai.co.il**. The WhatsApp number and contact email are still placeholders. All four live in **one file**: `src/config/site.ts`.

## Stack
- **Astro 7** (static output, Cloudflare adapter for the three API routes) + **Tailwind 4** + **MDX**
- **Cloudflare Workers** with static assets (hosting), KV (rate limiting), Web Analytics, Turnstile
- **Cloudflare D1** (leads, agent sessions, events), reachable only through the Worker binding `DB`
- **Claude API** (`@anthropic-ai/sdk`, dev only) for the optional AI draft mode of `scripts/new-article.mjs`
- **Resend** (or any HTTP email API) for lead notifications

## Local development
```bash
npm install                 # Node 24.18.0 (see .node-version)
cp .dev.vars.example .dev.vars   # fill secrets for local API routes (optional)
npx wrangler d1 migrations apply realai-leads --local   # local copy of the lead database
npm run dev                 # http://localhost:4321 (API routes run in workerd via the Cloudflare Vite plugin)
npm run build               # astro build + OG image generation into dist/client/og
npm run preview             # wrangler dev on the production build
npm run check               # astro check (types)
npm run content:check       # article quality checklist
npm run new-article -- "ביטוי מפתח" --slug my-slug --hub n8n --offer /workshops [--ai]
```

## Project map
```
src/config/site.ts        placeholders, entity facts, nav, logos, offers, topics, program names
src/data/offers.ts        offer page content (answer-first hero, outcomes, logistics, FAQ)
src/data/programs.ts      named programs + sample syllabi (rendered on offer pages)
src/content/blog/*.mdx    articles (schema in src/content.config.ts)
src/content/hubs/*.mdx    topic hub pillar content
src/pages/api/lead.ts     lead form endpoint (Turnstile, D1, email)
src/pages/api/event.ts    privacy-friendly event tracking
src/pages/admin/leads.astro  internal leads list (Basic auth, noindex)
src/lib/seo.ts            JSON-LD builders, canonical/OG helpers
src/lib/llms.ts           llms.txt / llms-full.txt generators
src/lib/sitemap.ts        split sitemaps with lastmod (pages, topics, blog)
src/data/glossary.ts      36 definitions for /glossary (DefinedTermSet schema)
scripts/og.mjs            OG image generation (runs after build)
scripts/new-article.mjs   article draft generator
scripts/content-check.mjs article quality checklist
migrations/               D1 schema (wrangler d1 migrations)
src/lib/db.ts             D1 data layer
content/backlog.md        50 key phrases to write next
content/STYLE.md          writing rules (GEO structure, voice)
```

## Deployment (Cloudflare Workers)
1. Create the Worker from this repo in the Cloudflare dashboard (Workers & Pages → Create → connect GitHub), build command `npm run build`, deploy command `npx wrangler deploy`. Preview deployments run for every pull request.
2. Set secrets: `wrangler secret put ADMIN_PASSWORD` (later `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`).
3. Set public build vars (Cloudflare build settings or `.env`): `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`.
4. The `AGENT_KV` namespace (and the adapter's `SESSION` KV + `IMAGES` binding) are auto-provisioned on first deploy.
5. D1: the `realai-leads` database exists and the schema is applied. For a new database: `npx wrangler d1 create realai-leads`, put its id in `wrangler.jsonc`, then `npx wrangler d1 migrations apply realai-leads --remote`.
6. Attach `realai.co.il` to the `realai` Worker as a custom domain and redirect `www` to the apex.

See `DECISIONS.md` for choices made where the brief left room, and `TODO.md` for what needs a human.
