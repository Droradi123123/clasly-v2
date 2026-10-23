# TODO (needs a human or external access)

## Launch blockers
- [ ] **Set the brand**: `BRAND_NAME`, `DOMAIN`, `WHATSAPP_NUMBER`, `CONTACT_EMAIL` in `src/config/site.ts`; `PUBLIC_SITE_URL` in `wrangler.jsonc`; `name` in `wrangler.jsonc`.
- [ ] **Replace placeholder logos** in `public/logos/` with official SVGs (same file names): technion.svg, tau.svg, haifa.svg, bgu.svg, colman.svg. Set `placeholder: false` in `LOGOS` (`src/config/site.ts`). Confirm permission to display each logo.
- [ ] **Approve program names** in `PROGRAM_NAMES` (`src/config/site.ts`).
- [ ] **Cloudflare**: create the Worker from GitHub (build `npm run build`, deploy `npx wrangler deploy`), set secrets (`ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `ADMIN_PASSWORD`), create a Turnstile widget and set `PUBLIC_TURNSTILE_SITE_KEY`, enable Web Analytics and set `PUBLIC_CF_ANALYTICS_TOKEN`. The Cloudflare MCP connector available in the build session was the deprecated bindings server with no Workers deploy capability, so deployment was not run.
- [ ] **Supabase**: the connector needed re-authorization during the build session, so the schema was not applied. Apply `supabase/migrations/20261023000000_init.sql`, then verify RLS with the Supabase security advisor.
- [ ] **Email**: verify a sending domain in Resend (or swap provider in `src/lib/notify.ts`).
- [ ] **Search Console + Bing Webmaster Tools**: verify the domain (DNS record), submit `/sitemap-index.xml`.
- [ ] **Run Lighthouse on the deployed URL** (mobile) and fix anything under 95.

## Content
- [ ] Write full pillar content for the 4 lighter hubs: `ai-adoption`, `building-with-ai`, `ai-roi`, `ai-for-managers` (`src/content/hubs/<slug>.mdx`).
- [ ] Publish 2 to 3 articles per week from `content/backlog.md`, prioritized by `agent_sessions` prompts and Search Console.
- [ ] **Request testimonials** from program managers or coordinators at current client institutions (role + institution, with permission). Then un-comment the testimonials sections and add Review schema only for genuine reviews.
- [ ] Add anonymized case studies per client (challenge, program, outcomes in numbers).

## Phase 2 / 3
- [ ] **WhatsApp Business API agent**: instant greeting, qualification (organization type, format, group size, date, topic), human handoff with a summary stored in `leads.summary`. The baseline click-to-chat links already pre-fill context; `leads.source = 'whatsapp'` and `summary` are ready for it.
- [ ] Automated Hebrew acknowledgement (WhatsApp or email) promising a reply within one business day (needs the API above or Resend).
- [ ] AI-written lead summary on insert (`leads.summary`), so the first human reply is specific.
- [ ] Automatic proposal draft from qualified leads.
- [ ] English version with `hreflang` (the layout already emits `hreflang` for `he` and `x-default`).
- [ ] Google Business Profile once the name is set; LinkedIn page with identical brand facts; monthly backlink/mention tracking.
- [ ] Ask client institutions to link to the site from their program pages.
