# Education cluster plan: top 3 on Google for academia, universities and teachers

Owner request (2026-11-07): strengthen everything for academia, universities, colleges, schools and teachers until we reach the top three results on Google. Optimize for SEO and AEO (answer engines).

The daily article run and the weekly review both read this file. Content items to write are in section E of `content/keywords.md`.

## 1. Where we stand (Search Console, 28 days to 2026-11-07)

- The education cluster brings 1,226 of 1,713 impressions (72%) across 40 queries, but 0 clicks. Weighted average position: 33.4.
- **Close to the top:** "סדנאות לסגל אקדמי" (87 impressions, position 8) and "סדנת ai לסגל אקדמי" (39, 7.8) on `/blog/ai-workshop-for-faculty-and-teachers`.
- **Pages two and three:** most long-tail workshop queries sit at positions 14 to 37, all landing on one article.
- **Far down:** commercial queries on `/academia`, `/workshops` and `/courses` sit at positions 44 to 98. Examples: "סדנת ai לאוניברסיטאות" (53, 43.9), "קורס ai למכללות" (22, 71.4), "קורס בינה מלאכותית למוסדות אקדמיים" (21, 87.1).
- **Schools and teachers:** no Search Console demand yet, because we have almost no pages for them. Only `/ai-for/teachers` exists.

## 2. What it takes to reach the top three

1. **One page per intent, no cannibalization.** Each query has one target page (section 3), and every other page links to it with that anchor text.
2. **Topical authority.** A hub (`/topics/ai-in-education`) that links to every page in the cluster, and cluster pages that link to each other. Related articles are drawn by hub, so each new article strengthens the rest.
3. **Answer-first pages for AEO.** Every page opens with a direct answer and a definition box, uses question H2s, has FAQ schema and sources. Answer engines quote pages like this.
4. **Authority from outside the site.** Commercial queries ("סדנת ai לאוניברסיטאות", "קורס ai למכללות") will not reach the top three on content alone. They need links from academic and education sites (section 6). This is the largest lever and only the owner can pull it.
5. **CTR.** Once pages reach positions 4 to 10, titles and descriptions decide the clicks. The weekly review rewrites the title and description of any target page with high impressions and no clicks.

**Honest timing:**
- Long-tail article queries at positions 8 to 25: top three is realistic within 4 to 8 weeks of steady work.
- Commercial head queries at positions 44 to 98: top three needs backlinks and takes 2 to 4 months.

## 3. Target map: one page per query

| Query (impressions, position on 2026-11-07) | Target page | Goal |
|---|---|---|
| סדנאות לסגל אקדמי (87, 8); סדנת ai לסגל אקדמי (39, 7.8); סדנאות בינה מלאכותית לסגל אקדמי (64, 23); הדרכות בינה מלאכותית לסגל אקדמי (40, 14.4) | `/blog/ai-workshop-for-faculty-and-teachers` | top 3 |
| קורס בינה מלאכותית לסגל אקדמי (106, 17.5); קורס ai לסגל אקדמי (33, 10.8) | `/blog/ai-course-for-faculty` | top 3 |
| סדנת ai לחוקרים באוניברסיטה (61, 17.6); סדנת ai למחקר אקדמי (51, 14.3) | `/blog/ai-workshop-for-academic-research` | top 3 |
| סדנת ai לסגל הוראה (44, 16.4); סדנת ai בהוראה אקדמית (38, 36.9); סדנת ai למרצים (20, 28.8); סדנת בינה מלאכותית למרצים (18, 33.4) | `/blog/ai-workshop-for-lecturers` | top 3 |
| סדנת ai לעובדי אוניברסיטה (35, 25.6); סדנת ai לסגל מנהלי באוניברסיטה (26, 16); קורס ai לעובדי אוניברסיטה (26, 52.7) | `/blog/ai-workshop-for-university-staff` | top 3 |
| סדנת ai למוסדות אקדמיים (56, 19.2); סדנת ai לאוניברסיטאות (73, 31.3); סדנת בינה מלאכותית לאוניברסיטאות (53, 50.1); סדנת ai למכללות (35, 19.6) | `/blog/ai-workshop-for-academic-institutions` | top 3 |
| קורס ai לאוניברסיטאות (18, 50.7); קורס ai למכללות (22, 71.4); קורס בינה מלאכותית למוסדות אקדמיים (21, 87.1); קורס בינה מלאכותית לאקדמיה | `/academia` | top 5, then top 3 with backlinks |
| בינה מלאכותית בחינוך; AI בחינוך; בינה מלאכותית באקדמיה | `/topics/ai-in-education` | top 10 within 3 months |
| AI למורים; השתלמות AI למורים; סדנת AI למורים | `/ai-for/teachers` and section E articles | new pages, then top 10 |
| קורס chatgpt לסגל אקדמי (41, 24.1); סדנת chatgpt לסגל אקדמי (33, 58.2) | blocked, see section 8 | |

## 4. Phase 1: structure (done on 2026-11-07)

- New hub `/topics/ai-in-education` ("בינה מלאכותית בחינוך ובאקדמיה"), with an answer-first opening, a guide table per audience, sections on assessment and privacy, HowTo and FAQ schema, and 7 sources.
- 10 education pages moved into the hub: the 8 academia articles plus `/ai-for/teachers` and `/ai-for/students`. Their related-articles blocks now show each other.
- Education articles now declare `EducationalAudience` in their BlogPosting schema. The hub appears in the footer, the blog index, `/topics` and `llms.txt`.
- `/academia`:
  - title and description now target universities, colleges and staff workshops;
  - a new section links to the six staff tracks and to the hub;
  - two new FAQ entries (staff workshops, a program for the whole institution);
  - education-focused related guides.
- `/blog/ai-workshop-for-faculty-and-teachers` (quick win at positions 8 to 23):
  - description and keywords now include "סדנאות" and "הדרכות";
  - a new H2 "אילו סדנאות בינה מלאכותית לסגל אקדמי כדאי להכיר?" with a table of tracks;
  - a new FAQ entry;
  - an exact-anchor link to the course article, to fix the cannibalization on "קורס בינה מלאכותית לסגל אקדמי".

## 5. Phase 2: content (daily article run, one per day)

The queue is section E of `content/keywords.md`, ordered by expected value. After section D runs out, the daily run takes the first open item in E. Each article follows the same rules:
- links to the hub and to `/academia` or `/workshops`;
- links in from at least one cluster page;
- an answer-first opening;
- sources that were opened.

## 6. Phase 3: authority from outside the site (owner, most important for commercial queries)

1. **Links from institutions you taught at.** Ask each program manager to add a link to `/academia` (or to the matching article) on the course, program or event page. One link from a university domain is worth more than ten new articles for the commercial queries.
2. **Event pages.** For every lecture or workshop at an institution, ask for an event page that names RealAI and links to the site.
3. **Guest articles.** Write one article a month for an education or higher-education site, for example a teaching-center blog, a teachers' community or an education magazine. Link to the hub or to one guide.
4. **LinkedIn.** Post each new education article with a short insight, and tag the institution when appropriate. This drives early clicks, and click behavior helps rankings.
5. **Google Business Profile.** Create or verify it with the education and training category and a link to `/academia`.
6. **Real testimonials.** Collect two or three genuine quotes from academic clients, with permission. `/academia` already has a hidden slot for them. They help trust (E-E-A-T) and conversions.
7. **Technical owner items:**
   - turn on Cloudflare "Always Use HTTPS", since http duplicates still appear in Search Console;
   - request indexing in Search Console for `/topics/ai-in-education`, `/academia` and every new article.

## 7. Phase 4: CTR and AEO (weekly review)

- **Titles and descriptions.** Every Sunday, for each target page with 30+ impressions and position under 15, check its CTR. If clicks are 0, rewrite the title and description around the query, keeping the focus phrase. At most three pages a week, so changes can be measured.
- **FAQ.** When a query is a question, add it to the target page's FAQ with a direct answer.
- **Freshness.** Update `updatedAt` only with a real content change.
- **Answer engines.** Keep `llms.txt` current. The hub and articles open with a definition and a direct answer, which is the passage answer engines quote.

## 8. Blocked or waiting for the owner

- **ChatGPT queries** (74 impressions in total): the session network blocks OpenAI docs, and we never write unsourced claims. If the network allows openai.com later, write "קורס ChatGPT לסגל אקדמי".
- **Schools as customers:** `src/data/offers.ts` describes universities, colleges and companies, not schools. Teacher articles are informational and point to `/workshops`. If you want to sell to schools and school networks, say so, and we will add a schools offer page with real details.

## 9. How we measure

- **Weekly review (Sundays):** report the target table from section 3 with this week's position and clicks against last week. List the queries that entered the top 10 and the top 3.
- **Dashboard:** https://claude.ai/artifact/BHfkyukotyZp7FydsTJqka. The academia cluster appears in the cluster chart and the opportunities table.
- **Success:**
  - 4 weeks: the first five long-tail targets in the top 5, and the cluster's first clicks;
  - 8 weeks: at least five targets in the top 3;
  - 3 months: `/academia` in the top 10 for the commercial queries, with backlinks in place.
