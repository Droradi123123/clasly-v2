# Copy audit: articles (blog + hubs)

Light-touch proofread of all 60 files in `src/content/blog/*.mdx` and `src/content/hubs/*.mdx`. Scope: spelling, grammar, punctuation, singular→plural address, and clearly translated-sounding sentences. No frontmatter title/description/focusKeyPhrase, slugs, links, dates, headings, facts or JSX were changed. `npm run content:check`: 60/60 passed.

**Totals:** 36 files touched, 43 fixes (31 substantive, 12 trivial). 24 files needed no changes.

## Changes per file

### hubs/ai-adoption.mdx
- לא בפתרון שבנית → לא בפתרון שבניתם (singular → plural)

### hubs/ai-roi.mdx
- איזה מדדים לבחור → אילו מדדים לבחור (grammar)

### hubs/claude-code.mdx
- ומאילו טעויות כדאי לדלג → ומאילו טעויות כדאי להימנע (awkward)

### hubs/n8n.mdx
- מה n8n לא: הוא לא מחליף → מה n8n לא עושה: הוא לא מחליף (translated phrasing)

### blog/ai-adoption-90-day-plan.mdx
- היא הדרך שבה הורדנו את השאלה ... למשהו שאפשר לנהל → היא הדרך שבה הפכנו את השאלה ... למשהו שאפשר לנהל (awkward verb)

### blog/ai-agent-monitoring-and-trust.mdx
- table header: מה אומר חריגה → מה אומרת חריגה (gender agreement)

### blog/ai-agents-bootcamp-who-is-it-for.mdx
- לא נתקבל עד שיש אחד → לא מתקבלים עד שיש אחד (grammar)

### blog/ai-agents-workshop-for-organizations.mdx
- TRIVIAL spelling: עקרון → עיקרון

### blog/ai-ambassadors-program.mdx
- עמית שיושב לידך ומראה לך → עמית שיושב לידכם ומראה לכם (singular → plural)

### blog/ai-course-for-employees-sample-syllabus.mdx
- TRIVIAL: למספר שהנהלה מקבלת → למספר שההנהלה מקבלת

### blog/ai-dashboard-for-management.mdx
- במאמר הזה מה יש בו היום → במאמר הזה נפרט מה יש בו היום (missing verb)
- 18 דולר בחודש קריאות למודל ואירוח → 18 דולר בחודש על קריאות למודל ואירוח (grammar)

### blog/ai-for-entrepreneurship-programs.mdx
- TRIVIAL x2: שבוע 1 עד 3 / שבוע 5 עד 10 → שבועות 1 עד 3 / שבועות 5 עד 10

### blog/ai-for-non-technical-managers.mdx
- במאמר הזה מה צריך להבין → במאמר הזה נסביר מה צריך להבין (missing verb)

### blog/ai-governance-ownership.mdx
- TRIVIAL spelling: יעוץ → ייעוץ

### blog/ai-kpis-that-matter.mdx
- במאמר הזה 12 המדדים שאנחנו מציבים → במאמר הזה נציג את 12 המדדים שאנחנו מציבים (missing verb)
- הם דוגמה למה נראה יעד שנגזר מקו בסיס → הם מדגימים איך נראה יעד שנגזר מקו בסיס (translated phrasing)

### blog/ai-lecture-for-employees-what-to-include.mdx
- זה גם למה אנחנו לא מעבירים → זו גם הסיבה שאנחנו לא מעבירים (anglicism "that's why")

### blog/ai-security-rules-for-organizations.mdx
- גישה למידע שלא התכוונתם → גישה למידע שלא התכוונתם לחשוף (incomplete phrase)

### blog/ai-strategy-one-page-template.mdx
- במאמר הזה תבנית אסטרטגיית AI המלאה → במאמר הזה תמצאו את תבנית אסטרטגיית AI המלאה (missing verb)

### blog/ai-training-for-customer-service-teams.mdx
- שזה המפגש הראשון שבו הוותיקים הגיעו למפגש השני בלי שביקשו → שזו ההכשרה הראשונה שבה הוותיקים הגיעו למפגש השני בלי שביקשו מהם (logic/grammar)

### blog/ai-trust-ladder-shadow-mode.mdx
- מה דחוף, מה לטפל ומה להשאיר → מה דחוף, במה לטפל ומה להשאיר (grammar)

### blog/ai-usage-policy-template.mdx
- אם היית מתבייש שיגלו, אל תעשה → אם הייתם מתביישים שיגלו, אל תעשו (singular → plural)
- מי שלא ברשימה, אסור → מה שלא ברשימה, אסור (refers to tools)
- כאן התבנית שהשתמשנו בה → הנה התבנית שהשתמשנו בה (missing verb)

### blog/ai-workshop-for-marketing-teams.mdx
- table "רקע נדרש": אף אחד, יכולת לתאר מה רוצים / אף אחד, הכרת תהליך → אין, רק יכולת לתאר מה רוצים / אין, רק הכרת תהליך (wrong word: "no one" vs "none")

### blog/automate-customer-service-with-n8n-and-ai.mdx
- TRIVIAL: החישוב שהנהלה רוצה → החישוב שההנהלה רוצה

### blog/build-internal-tool-with-claude-code.mdx
- שלושה דברים שעשינו: → ארבעה דברים שעשינו: (the list below has four bullets; count mismatch)

### blog/claude-code-vs-chatgpt-for-building.mdx
- TRIVIAL: איך עובד פונקציה → איך עובדת פונקציה (gender agreement)

### blog/claude-code-workshop-what-to-expect.mdx
- TRIVIAL spelling: עקרון העבודה → עיקרון העבודה
- הבוקר מוקדש ללמוד את הכלי → הבוקר מוקדש ללימוד הכלי (grammar)

### blog/cost-of-implementing-ai-in-a-mid-size-company.mdx
- במאמר הזה חמישה תרחישים → במאמר הזה נציג חמישה תרחישים (missing verb)

### blog/do-you-need-a-head-of-ai.mdx
- במאמר הזה השוואה של שלוש החלופות → במאמר הזה נציג השוואה של שלוש החלופות (missing verb)

### blog/first-ai-agent-in-your-organization.mdx
- TRIVIAL: מספר ROI שהנהלה מקבלת → מספר ROI שההנהלה מקבלת

### blog/how-to-choose-an-ai-speaker.mdx
- זה בדיוק למה זה משכנע → זו בדיוק הסיבה שזה משכנע (anglicism)

### blog/measuring-ai-adoption.mdx
- TRIVIAL: table header השאלה שהיא עונה → השאלה שהיא עונה עליה

### blog/measuring-ai-training-success.mdx
- במאמר הזה ארבע רמות המדידה, ... והמספרים → במאמר הזה נפרט את ארבע רמות המדידה, ... ואת המספרים (missing verb)

### blog/n8n-workshop-for-teams.mdx
- כדי שאף אחד לא נתקע → כדי שאף אחד לא ייתקע (tense)
- זו הדרך הבטוחה שהוא ייכבה → זו הדרך הבטוחה לכך שהוא ייכבה (grammar)

### blog/presenting-ai-plan-to-the-board.mdx
- במאמר הזה מבנה המצגת, השאלות... → במאמר הזה נפרט את מבנה המצגת, את השאלות... (missing verb)

### blog/reinventing-work-around-ai.mdx
- TRIVIAL: רוב ארגונים עוצרים → רוב הארגונים עוצרים

### blog/why-employees-dont-use-ai-tools.mdx
- TRIVIAL spelling: יחשב → ייחשב

## Trivial fixes count

12 trivial fixes (marked TRIVIAL above): 4 spelling (עיקרון x2, ייעוץ, ייחשב), 4 missing definite article (ההנהלה x3, הארגונים), 1 gender agreement (עובדת), 2 plural noun (שבועות), 1 missing preposition (עליה).

## Left as-is / flagged for a human decision

- **Singular address inside quoted questions** was kept on purpose, because these are questions the reader asks someone else, not address to the reader: interview questions in `ai-opportunity-map`, questions to a speaker in `how-to-choose-an-ai-speaker`, employee survey items in `why-employees-dont-use-ai-tools`, `ai-lecture-for-employees-what-to-include` and `ai-adoption-90-day-plan`, and prompts typed to Claude ("תבנה לי...") in several articles.
- **Headings with grammar issues, not changed (headings are out of scope except clear typos):**
  - `claude-code-vs-chatgpt-for-building`: "מה ההבדל הבסיסי בין Claude Code לעומת ChatGPT?" (בין...לעומת is ungrammatical; contains the focus phrase).
  - `n8n-vs-make-vs-zapier-for-ai`: "מה ההבדל הבסיסי בין n8n לעומת Make ו-Zapier?" (same pattern).
  - `executive-ai-coaching-what-happens`: "מה ליווי AI למנהלים לא?" (translated; e.g. "מה ליווי AI למנהלים איננו?").
  - `safe-environment-for-ai-experimentation`: "מה שתי השכבות של..." (missing הן).
  - `mvp-with-ai-first-week`: "איזה כלים מספיקים..." (formal: אילו כלים).
- `build-internal-tool-with-claude-code`: changed "שלושה דברים שעשינו" to "ארבעה" because the list below has four bullets. Technically a number change, so worth a glance.
- `ai-for-entrepreneurship-programs`, session 5 table cell "איך נותנים, איך מקשיבים": unclear what is being given (maybe "איך מגייסים"); left unchanged.
- Link anchor text "Claude Code למי שלא מפתח" (vs. article title "...שלא מתכנת") appears in a few articles; left as-is since link text was out of scope.
- Mixed spellings הכל/הכול and תכנית/תוכנית across the site were left alone (both acceptable; normalising would be a larger pass).
