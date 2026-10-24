# TODO (needs a human or external access)

## Launch blockers
- [x] **Brand and domain**: RealAI, realai.co.il (set in `src/config/site.ts`, `wrangler.jsonc`).
- [ ] **Contact details**: `WHATSAPP_NUMBER` and `CONTACT_EMAIL` in `src/config/site.ts` are still placeholders and are visible on the site (footer, contact, accessibility, privacy).
- [ ] **Domain on Cloudflare**: add realai.co.il to Cloudflare, attach it to the `clasly-v2` Worker as a custom domain, and redirect `www.realai.co.il` to the apex (canonical URLs use `https://realai.co.il`).
- [ ] **Register realai.ai or other variants** if you want to protect the name.
- [ ] **Replace placeholder logos (blocking: the homepage marquee shows them)** in `public/logos/` with official SVGs (same file names): technion.svg, tau.svg, haifa.svg, bgu.svg, colman.svg. Set `placeholder: false` in `LOGOS` (`src/config/site.ts`). Confirm permission to display each logo.
- [ ] **Approve program names** in `PROGRAM_NAMES` (`src/config/site.ts`).
- [ ] **Cloudflare**: either connect the repo in the dashboard (Workers Builds) or use `.github/workflows/deploy.yml`: add repository secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` and set the repository variable `CLOUDFLARE_DEPLOY_ENABLED=true`. Then create the Worker from GitHub (build `npm run build`, deploy `npx wrangler deploy`), set secrets (`ADMIN_PASSWORD`, later `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`), create a Turnstile widget and set `PUBLIC_TURNSTILE_SITE_KEY`, enable Web Analytics and set `PUBLIC_CF_ANALYTICS_TOKEN`. The Cloudflare MCP connector available in the build session was the deprecated bindings server with no Workers deploy capability, so deployment was not run.
- [x] **Lead database**: Cloudflare D1 `realai-leads` created, schema applied, bound as `DB`. Nothing to configure.
- [ ] **Optional cleanup**: the earlier `site_*` tables in the Supabase project "Lecture" are no longer used and can be dropped.
- [ ] **Unrelated Supabase finding** (project "NY happy"): table `public.site_audit` has RLS disabled and is readable with the anon key. Remediation if intended: `ALTER TABLE "public"."site_audit" ENABLE ROW LEVEL SECURITY;` plus policies. Not changed by this build.
- [ ] **Email**: verify a sending domain in Resend (or swap provider in `src/lib/notify.ts`).
- [ ] **Search Console + Bing Webmaster Tools**: verify the domain (DNS record), submit `/sitemap-index.xml`.
- [ ] **Run Lighthouse on the deployed URL** (mobile) and fix anything under 95.

## Content
- [x] Launch content: 7 topic hubs written in full, 44 articles (all pass `npm run content:check`), 36-term glossary.
- [ ] Publish 2 to 3 articles per week from `content/backlog.md` (phrases already written are marked there), prioritized by `agent_sessions` prompts and Search Console.
- [ ] Editorial pass by a human on the 44 articles: the anonymized numbers are plausible composites written by the content agents, so replace any figure you cannot stand behind with a real one before launch.
- [ ] **Request testimonials** from program managers or coordinators at current client institutions (role + institution, with permission). Then un-comment the testimonials sections and add Review schema only for genuine reviews.
- [ ] Add anonymized case studies per client (challenge, program, outcomes in numbers).

## Hardening
- [ ] Content-Security-Policy header (needs nonces for the inline theme script, Turnstile and Cloudflare Insights).
- [ ] Replace Basic auth on `/admin/leads` with Cloudflare Access when more than one person needs it.

## Phase 2 / 3
- [ ] **WhatsApp Business API agent**: instant greeting, qualification (organization type, format, group size, date, topic), human handoff with a summary stored in `leads.summary`. The baseline click-to-chat links already pre-fill context; `leads.source = 'whatsapp'` and `summary` are ready for it.
- [ ] Automated Hebrew acknowledgement (WhatsApp or email) promising a reply within one business day (needs the API above or Resend).
- [ ] AI-written lead summary on insert (`leads.summary` in D1), so the first human reply is specific.
- [ ] Automatic proposal draft from qualified leads.
- [ ] English version with `hreflang` (the layout already emits `hreflang` for `he` and `x-default`).
- [ ] Google Business Profile once the name is set; LinkedIn page with identical brand facts; monthly backlink/mention tracking.
- [ ] Ask client institutions to link to the site from their program pages.
