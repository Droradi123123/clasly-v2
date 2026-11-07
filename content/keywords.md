# Keyword map: what we want to rank for

The goal is traffic first and leads second. Every query here is something Israelis type into Google, and each one has a page that answers it better than what ranks today.

Search volumes are estimates, because Keyword Planner and Search Console data aren't available yet. Once Search Console has data, reorder this list by impressions.

How to use it:
- The daily article routine takes the first open item in section A, or every third day the first open item in section B.
- When a page goes live, strike the item and write its URL next to it (`✅ /blog/slug`).
- Before writing, check the RESERVED map in `scripts/content-check.mjs` and the existing focus phrases. No two pages may target the same query.

## A. Informational queries with high demand (traffic)
Each one gets an article or a glossary term page.

### Claude and Anthropic
1. ~~מה זה Claude ואיך משתמשים בו בעברית~~ ✅ `/blog/what-is-claude`
2. Claude לעומת ChatGPT: מה מתאים לעבודה
3. ~~Claude Projects: איך מארגנים ידע ושיחות לפי פרויקט~~ ✅ `/blog/claude-projects-guide`
4. ~~Claude Skills: מה זה ואיך בונים סקיל ראשון~~ ✅ `/blog/claude-skills-guide`
5. ~~Claude Cowork: מה זה ולמי זה מתאים~~ ✅ `/blog/what-is-claude-cowork`
6. ~~קובץ CLAUDE.md~~ ✅ `/blog/how-to-write-claude-md`
7. ~~איך מתקינים Claude Code: מדריך למתחילים~~ ✅ `/blog/how-to-install-claude-code`
8. ~~Claude Code פקודות שימושיות: מדריך מהיר~~ ✅ `/blog/claude-code-commands`

### Prompts and daily use at work
9. ~~איך כותבים פרומפט טוב: מבנה ודוגמאות בעברית~~ ✅ `/blog/how-to-write-a-good-prompt`
10. ~~פרומפטים לעבודה: תבניות להעתקה לפי תפקיד~~ ✅ `/tools/prompts` (ספריית פרומפטים)
11. ~~AI לסיכום מסמכים ופגישות: איך עושים את זה נכון~~ ✅ `/blog/ai-document-meeting-summary`
12. ~~AI לכתיבת מיילים בעברית: מה עובד ומה לא~~ ✅ `/blog/ai-for-writing-emails-hebrew`
13. ~~AI לאקסל ולניתוח נתונים: מדריך מעשי~~ ✅ `/blog/ai-for-excel`

### AI agents and automation
14. ~~איך בונים סוכן AI: מדריך למתחילים בלי קוד~~ ✅ `/blog/how-to-build-ai-agent-no-code`
15. מדריך n8n למתחילים בעברית
16. n8n התקנה: ענן או שרת משלכם, צעד אחרי צעד
17. n8n ו-WhatsApp: בוט AI לעסק
18. אוטומציות AI לעסק קטן: 10 רעיונות שאפשר לבנות השבוע
19. Vibe coding: מה זה, למי זה מתאים ואיפה זה נשבר

### AI by profession (long tail with clear intent)
20. ~~AI לעורכי דין: שימושים, סיכונים וכללים~~ ✅ `/ai-for/lawyers`
21. ~~AI לרואי חשבון ולכספים~~ ✅ `/ai-for/accountants`
22. ~~AI למורים: הכנת שיעורים, מטלות ובדיקה~~ ✅ `/ai-for/teachers`
23. ~~AI לסטודנטים: איך משתמשים בלי להיכשל במטלות~~ ✅ `/ai-for/students`
24. ~~AI למשאבי אנוש: גיוס, קליטה ושאלות עובדים~~ ✅ `/ai-for/hr`
25. ~~AI לשיווק: כלים ותהליכים לצוות קטן~~ ✅ `/ai-for/marketing`
26. ~~AI למנהלי מוצר~~ ✅ `/ai-for/product-managers`
27. ~~AI לאנשי מכירות~~ ✅ `/ai-for/sales`

### Careers and learning
28. איך ללמוד AI: מסלול לפי תפקיד ורמה
29. מקצועות AI: אילו תפקידים נפתחים ומה צריך לדעת
30. כישורי AI שמעסיקים מחפשים בראיון עבודה

### Regulation and safety
31. רגולציה של AI בישראל: מה ארגון צריך לדעת
32. ה-AI Act האירופי: מה זה אומר לחברה ישראלית
33. פרטיות ו-AI: מה מותר להעלות לצ׳אט

## B. Commercial queries close to a purchase (leads)
Each one gets an article that links to its money page, or a landing page. Don't repeat the RESERVED phrases.

34. ~~קורס n8n לצוותים~~ ✅ `/courses/n8n` (עמוד נחיתה)
35. ~~קורס Claude Code לארגונים~~ ✅ `/courses/claude-code` (עמוד נחיתה)
36. ~~קורס סוכני AI~~ ✅ `/courses/ai-agents` (עמוד נחיתה)
37. ~~יום עיון AI לעובדים~~ ✅ `/blog/ai-day-for-employees`
38. הרצאת AI לכנס מכירות או לאירוע חברה
39. ~~סדנת פרומפטים לארגון~~ ✅ `/blog/prompt-workshop-for-organizations`
40. הכשרת AI למנהלים
41. תוכנית AI לתלמידים ולסטודנטים במוסד אקדמי

## C. Glossary term pages ("מה זה X")
Live:
- rag, llm, token, context-window, prompt, system-prompt, mcp, ai-agent, human-in-the-loop, embedding, hallucination, zero-shot-few-shot, evals, fine-tuning.

Next:
- vibe-coding, api, webhook, geo, ai-literacy, tool-use, agent-memory, coding-agent, no-code, workflow, automation.

These need sources that the cloud session can currently reach. Most need network access to Wikipedia and the vendor docs.

## D. Opportunities from Search Console
Built from real search data (28 days to 2026-11-04). The daily article run takes the first open item that the data still supports, and the weekly review updates this list. Impressions and positions are for the query at the time the item was added; never quote them in an article.

The academia cluster brings most of the demand (991 of 1,587 impressions). Almost all of it lands on one article, `/blog/ai-workshop-for-faculty-and-teachers`, which can't answer every sub-intent. Each item below gets its own focused page, linked both ways with that article and with `/academia`.

1. ~~סדנת AI למחקר אקדמי ולחוקרים~~ ✅ `/blog/ai-workshop-for-academic-research` ("סדנת ai לחוקרים באוניברסיטה" 47 impressions, position 17; "סדנת ai למחקר אקדמי" 44, 14).
2. ~~קורס AI לסגל אקדמי~~ ✅ `/blog/ai-course-for-faculty` ("קורס בינה מלאכותית לסגל אקדמי" 94 impressions, position 16.9 on 2026-11-05).
3. ~~סדנת AI לסגל מנהלי ולעובדי אוניברסיטה~~ ✅ `/blog/ai-workshop-for-university-staff` ("סדנת ai לעובדי אוניברסיטה" 33 impressions, position 24.8; "סדנת ai לסגל מנהלי באוניברסיטה" 23, 15.8 on 2026-11-05).
4. ~~סדנת AI לסגל הוראה ולמרצים~~ ✅ `/blog/ai-workshop-for-lecturers` ("סדנת ai לסגל הוראה" 44 impressions, position 16.4; "סדנת ai בהוראה אקדמית" 37, 36.8; "סדנת בינה מלאכותית למרצים" 25+18 on 2026-11-06).
5. איך מודדים ROI של סוכן AI: "כיצד מודדים roi של פתרון agentic ai?" (8, 8.6), "כיצד מודדים roi והצלחה עסקית של פתרון ai או ai agent בארגון?" (7, 6.4). These now land on `/topics/ai-roi`. Not yet: on 2026-11-06 both queries were already at positions 6.4 and 8.6 on `/topics/ai-roi`; weekly review to decide.
6. n8n עם GPT ו-CRM: אוטומציה לניהול לידים מקצה לקצה: a group of long queries at positions 45 to 58, for example "איך לחבר n8n, gpt ו-crm..." (6, 45.7) and "איך לשלב gpt ו-n8n בזרימת עבודה אחת..." (10, 57.8). Blocked for now: n8n docs are not reachable from the session network.
7. ~~סדנת AI למוסדות אקדמיים ולאוניברסיטאות~~ ✅ `/blog/ai-workshop-for-academic-institutions` ("סדנת ai למוסדות אקדמיים" 56 impressions, position 19.2; "סדנת ai לאוניברסיטאות" 53+20, best position 31.3; "סדנת בינה מלאכותית לאוניברסיטאות" 53, 50.1; "סדנת ai למכללות" 25+10, best 19.6 on 2026-11-07). Institution-level intent: the buyer plans for the whole university or college.

## E. Education cluster queue (plan: `content/education-plan.md`)
The daily article run takes the first open item here once section D has nothing open that the data supports. Each article links to `/topics/ai-in-education`, to `/academia` or `/workshops`, and to at least two cluster articles. Add a link to it from at least one existing cluster page. Teacher and school articles are informational: `src/data/offers.ts` has no schools offer, so never claim school clients or a schools program.

1. השתלמות AI למורים: מה לומדים ואיך בונים השתלמות לצוות בית הספר. Focus "השתלמות AI למורים". Sources: claude.com/solutions/teachers, anthropic.com/news/anthropic-teach-for-all, the Iceland national pilot announcement. Link from `/ai-for/teachers`.
2. סדנת AI לראשי חוגים ודיקנים: החלטות, מדיניות ותקציב. Focus "סדנת AI לדיקנים". Data: "סדנת ai למנהלי חוגים" (20 impressions, position 92.3), "סדנת ai לדיקנים" (5, 89.2) on 2026-11-07. Sources: the Anthropic educators report, Claude for Education pages.
3. מה זה Claude for Education ומה מקבל מוסד אקדמי. Focus "Claude for Education". Sources: anthropic.com/news/introducing-claude-for-education, anthropic.com/news/advancing-claude-for-education, claude.com/solutions/education.
4. מצב למידה ב-Claude: איך סטודנטים לומדים עם AI בלי לקבל תשובות מוכנות. Focus "מצב למידה ב-Claude". Sources: the Claude for Education announcement, the student report, Claude help center pages on learning mode if reachable.
5. מערך שיעור עם AI: מדריך למורים צעד אחרי צעד. Focus "מערך שיעור עם AI". Sources: claude.com/solutions/teachers, prompting best practices docs.
6. מדיניות AI לאוניברסיטה ולמכללה: מה כותבים ואיך מיישמים. Focus "מדיניות AI למוסד אקדמי". Sources: Anthropic education reports, Claude for Education privacy statements. Link both ways with `/blog/ai-usage-policy-template`.
7. AI בבית הספר: מה מותר להעלות על תלמידים ואיך שומרים על פרטיות. Focus "פרטיות תלמידים ו-AI". Sources: claude.com/solutions/teachers, anthropic.com/legal/k12-terms if reachable.
