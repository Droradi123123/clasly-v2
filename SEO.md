# SEO and GEO playbook for realai.co.il

How the site is built to rank in Google and to be cited by AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews), and what to do after launch.

## 1. Who searches, and for what

| Searcher | Intent | Typical queries (Hebrew) | Lands on |
|---|---|---|---|
| HR / L&D manager | Buy a lecture or workshop | הרצאה על בינה מלאכותית, הרצאת AI לחברות, סדנת AI לעובדים, סדנת בינה מלאכותית | /lectures, /workshops, /companies |
| Program manager at a university or college | Buy a course or guest lecture | קורס בינה מלאכותית לאקדמיה, קורס AI לסטודנטים, הרצאת אורח AI | /academia, /courses |
| CEO, VP, head of department | Personal guidance, strategy | ליווי AI למנהלים, אסטרטגיית AI לארגון, ייעוץ AI למנהלים | /executive |
| Manager researching the topic | Learn, then buy | איך להטמיע AI בארגון, למה עובדים לא משתמשים ב-AI, ROI של AI | hubs and articles, then the related offer |
| Practitioner | How-to | סוכן AI עם n8n, Claude Code למי שלא מתכנת, n8n לעומת Make | articles, then /workshops |

Israelis search both "AI" and "בינה מלאכותית". Money pages carry both forms in the title, description or H1.

## 2. Keyword map (one owner per phrase)

| Phrase | Owner page |
|---|---|
| הרצאה על בינה מלאכותית, הרצאת AI לחברות, מרצה בינה מלאכותית | /lectures |
| סדנת AI לארגונים, סדנת בינה מלאכותית | /workshops |
| קורס AI לעובדים, קורס בינה מלאכותית | /courses |
| ליווי AI למנהלים, אסטרטגיית AI לארגון | /executive |
| הכשרת AI לארגונים, הדרכת בינה מלאכותית לעובדים | /companies |
| קורס בינה מלאכותית לאקדמיה | /academia |
| הטמעת AI בארגון, איך להטמיע AI בארגון | /topics/ai-adoption (pillar) |
| Claude Code, n8n, סוכני AI, ROI של AI, AI למנהלים, בניית מוצרים עם AI | their topic hubs |

Each article owns one long-tail phrase. `npm run content:check` fails when an article targets a phrase listed in `RESERVED` (the money-page phrases above), or duplicates another page's focus phrase, title or description. When a new article touches a money phrase, it links to the owner page with that phrase as anchor text instead of targeting it.

## 3. What every page has

- **Title and description:** a unique title of up to 60 characters, with " | RealAI" added only when it fits, and a unique description of up to 155 characters with the focus phrase and a reason to click.
- **Head tags:** canonical URL, `hreflang` set to he-IL and x-default, Open Graph and Twitter tags, and an OG image generated per page.
- **Robots meta:** `max-image-preview:large` and `max-snippet:-1`, which allow large previews in Google, Discover and AI Overviews.
- **JSON-LD graph:**
  - On every page: Organization (with logo, slogan, contact point and an offer catalog of the four services), WebSite, WebPage with `dateModified`, and BreadcrumbList.
  - On offer pages: Service, plus Course on /courses.
  - Wherever there is a FAQ: FAQPage.
  - On articles: BlogPosting, with section, word count, reading time and `speakable`.
  - On hubs: CollectionPage, plus HowTo on the adoption pillar.
  - On the glossary: DefinedTermSet.
- **Articles:**
  - answer-first opening
  - H2s phrased as questions
  - table of contents when there are 3 or more H2s
  - reading time
  - byline linking to /team
  - visible "last updated" date
  - definition box, table and numbered steps
  - FAQ
  - contextual CTA
- **Internal links:**
  - Articles link to their hub and their offer page.
  - Offer and audience pages list their supporting articles.
  - Hubs list all their articles.
  - The footer links to the six cornerstone guides.

## 4. GEO (AI answer engines)

- `/llms.txt` and `/llms-full.txt` describe the entity, the offers, the topics and every article.
- robots.txt explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Bingbot, Applebot and others.
- Entity facts are identical everywhere: what RealAI does, for whom, the formats, contact details and the positioning: everything the team teaches, it did first (hundreds of agents, AI adoption in organizations of thousands of employees).
- IndexNow pings Bing on every push to main (`.github/workflows/indexnow.yml`). Bing's index feeds ChatGPT search and Copilot.
- First-hand methodology (`content/source/ai-adoption-playbook.md`) is the source for the adoption pillar. Original, experience-based content is what answer engines cite.

## 5. Launch checklist

1. Domain active on Cloudflare, with https://realai.co.il serving the site and www redirecting to the root domain.
2. **Google Search Console:**
   - Add a Domain property and verify it with the DNS TXT record (Cloudflare can add it in one click).
   - Submit `https://realai.co.il/sitemap-index.xml`.
   - Request indexing for the homepage, the 4 offer pages and the adoption pillar.
3. **Bing Webmaster Tools:** import the site from Search Console and submit the same sitemap. Bing is the source for ChatGPT search and Copilot.
4. Run the "IndexNow ping" workflow once from the Actions tab.
5. Check rich results with Google's Rich Results Test on one article, one offer page and the adoption pillar.
6. Create a Google Business Profile and a LinkedIn company page with identical brand facts, then add their URLs to `SOCIAL_PROFILES` in `src/config/site.ts`.

## 6. After launch (first 90 days)

- **Publishing:** publish 2 to 3 articles a week from `content/backlog.md`, prioritized by Search Console queries that already show impressions.
- **Monthly review:**
  - In Search Console, find pages with impressions but a click-through rate under 2% and rewrite their title and description.
  - Find queries ranking 8 to 20 and expand the matching article with a section that answers them.
- **Refreshes:** refresh cornerstone articles every quarter and update `updatedAt`. The visible date, the schema and the sitemap all follow it.
- **Backlinks:**
  - Ask client institutions to link to the site from their program pages.
  - Share every article on LinkedIn with a link back.
  - Pitch the adoption pillar and "how this site was built" to Israeli tech and HR publications.
- **Reviews:** collect real testimonials and case studies. Add Review schema only for genuine, verifiable reviews.

## 7. Audit of 2026-11-10 (three weeks after launch)

**What was checked:** all 134 built pages (titles, canonicals, headings, structured data, internal links), the live site as crawlers see it (the "SEO live check" workflow), Search Console and Analytics data in D1, and Lighthouse on mobile.

**What is healthy:**
- Indexing: about 104 of 133 URLs already get impressions on Google, and Bing lists about 87 pages.
- Crawlers: Googlebot, Bingbot and the AI answer-engine crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and others) all get 200 responses. `robots.txt` is served as written.
- Redirects: http and www redirect to https://realai.co.il with a 301.
- Speed: brotli, a TTFB under 0.1s, and Lighthouse SEO 100 with performance 85 to 98 on mobile.
- No duplicate titles or descriptions, one H1 per page, valid JSON-LD on every page.

**What was holding rankings back, and what changed:**
1. **Generic anchor text to money pages.** About 250 internal links said "על סדנאות" or "לסדנאות שלנו". They now use search phrases, varied by page (`offerAnchor` in `src/config/site.ts`, and the rule in `content/STYLE.md`).
2. **Related articles pointed at the same four posts per hub.** Some articles had 2 internal links. `src/lib/related.ts` now picks by relevance and spreads links: every article has at least 7, the median is 11.
3. **`/companies` had 3 internal links and `/academia` had 14 with the text "עמוד האקדמיה".** Every article now links to one of them with a search phrase, and course pages and the ROI calculator get a link from their hubs.
4. **Money pages did not name the audiences people search for.** `/lectures`, `/workshops`, `/courses`, `/executive` and `/companies` have a guides section whose headings are the queries (for example "הרצאת בינה מלאכותית לעובדים"), each linking to its article (`guides` in `src/data/offers.ts`, `GuideLinks.astro`).
5. **Queries say "בינה מלאכותית", titles said "AI".** Two lecture articles were retargeted to the exact queries. New articles and anchors alternate between the two forms.
6. **Articles outrank money pages at this domain age.** For the same kind of query, articles sit at positions 13 to 30 and money pages at 50 to 85. Queries that sat on a money page far down the results now get a guide article that links to the money page: workshops for organizations, and courses for universities and colleges.
7. **Small fixes:** the homepage H1 words ran together ("AIממובילי"), hashed assets had no long cache, article figures are now listed in the BlogPosting schema, and the WebSite schema names the brand variants.

**What on-site work cannot fix:** head commercial queries ("סדנת AI לארגונים", "הרצאת AI לארגונים") sit at positions 67 to 80 with an exact-match page behind them. That gap is authority: links from other sites, a Google Business Profile, and brand searches. The owner tasks are in `content/education-plan.md` section 6.

**Known and left as is:** trailing-slash and `.html` URLs redirect with a 307 (Cloudflare static assets default). The canonical tag covers it.

