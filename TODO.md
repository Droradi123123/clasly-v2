# TODO (needs a human or external access)

## Launch blockers
- [x] **Brand and domain**: RealAI, realai.co.il (set in `src/config/site.ts`, `wrangler.jsonc`).
- [x] **Contact details**: happytelaviv@gmail.com and WhatsApp 054-802-3445 set in `src/config/site.ts` (also in Organization schema).
- [ ] **Domain on Cloudflare**: add realai.co.il to Cloudflare, attach it to the `clasly-v2` Worker as a custom domain, and redirect `www.realai.co.il` to the apex (canonical URLs use `https://realai.co.il`).
- [ ] **Register realai.ai or other variants** if you want to protect the name.
- [ ] **Replace placeholder logos (blocking: the homepage marquee shows them)** in `public/logos/` with official SVGs (same file names): technion.svg, tau.svg, haifa.svg, bgu.svg, colman.svg. Set `placeholder: false` in `LOGOS` (`src/config/site.ts`). Confirm permission to display each logo.
- [ ] **Approve program names** in `PROGRAM_NAMES` (`src/config/site.ts`).
- [ ] **Cloudflare**: either connect the repo in the dashboard (Workers Builds) or use `.github/workflows/deploy.yml`: add repository secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` and set the repository variable `CLOUDFLARE_DEPLOY_ENABLED=true`. Then create the Worker from GitHub (build `npm run build`, deploy `npx wrangler deploy`), set secrets (`ADMIN_PASSWORD`, later `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`), create a Turnstile widget and set `PUBLIC_TURNSTILE_SITE_KEY`, enable Web Analytics and set `PUBLIC_CF_ANALYTICS_TOKEN`. The Cloudflare MCP connector available in the build session was the deprecated bindings server with no Workers deploy capability, so deployment was not run.
- [x] **Lead database**: Cloudflare D1 `realai-leads` created, schema applied, bound as `DB`. Nothing to configure.
- [ ] **Optional cleanup**: the earlier `site_*` tables in the Supabase project "Lecture" are no longer used and can be dropped.
- [ ] **Unrelated Supabase finding** (project "NY happy"): table `public.site_audit` has RLS disabled and is readable with the anon key. Remediation if intended: `ALTER TABLE "public"."site_audit" ENABLE ROW LEVEL SECURITY;` plus policies. Not changed by this build.
- [ ] **Email notifications**: create a Resend account, verify realai.co.il as a sending domain (notifications are sent from leads@realai.co.il to happytelaviv@gmail.com), and add the `RESEND_API_KEY` secret.
- [ ] **Search Console + Bing Webmaster Tools**: follow the launch checklist in SEO.md (DNS verification, submit `/sitemap-index.xml`, run the IndexNow workflow once).
- [ ] **Social profiles**: create a LinkedIn company page and Google Business Profile, then add the URLs to `SOCIAL_PROFILES` in `src/config/site.ts`.
- [ ] **Run Lighthouse on the deployed URL** (mobile) and fix anything under 95.

## Content
- [x] Launch content: 7 topic hubs written in full, 54 articles (all pass `npm run content:check`), 36-term glossary.
- [x] AI adoption pillar (`/topics/ai-adoption`) and 10 articles rewritten or written from the founder playbook (`content/source/ai-adoption-playbook.md`), with no invented figures.
- [ ] Publish 2 to 3 articles per week from `content/backlog.md` (phrases already written are marked there), prioritized by `agent_sessions` prompts and Search Console.
- [x] Invented figures removed from the older articles and hubs (2026-10-28, DECISIONS #74). When real, approved results exist, add them back with the client's permission.
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
