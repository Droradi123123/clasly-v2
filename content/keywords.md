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
3. Claude Projects: איך מארגנים ידע ושיחות לפי פרויקט
4. ~~Claude Skills: מה זה ואיך בונים סקיל ראשון~~ ✅ `/blog/claude-skills-guide`
5. Claude Cowork: מה זה ולמי זה מתאים
6. ~~קובץ CLAUDE.md~~ ✅ `/blog/how-to-write-claude-md`
7. ~~איך מתקינים Claude Code: מדריך למתחילים~~ ✅ `/blog/how-to-install-claude-code`
8. Claude Code פקודות שימושיות: מדריך מהיר

### Prompts and daily use at work
9. ~~איך כותבים פרומפט טוב: מבנה ודוגמאות בעברית~~ ✅ `/blog/how-to-write-a-good-prompt`
10. ~~פרומפטים לעבודה: תבניות להעתקה לפי תפקיד~~ ✅ `/tools/prompts` (ספריית פרומפטים)
11. AI לסיכום מסמכים ופגישות: איך עושים את זה נכון
12. AI לכתיבת מיילים בעברית: מה עובד ומה לא
13. ~~AI לאקסל ולניתוח נתונים: מדריך מעשי~~ ✅ `/blog/ai-for-excel`

### AI agents and automation
14. איך בונים סוכן AI: מדריך למתחילים בלי קוד
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
39. סדנת פרומפטים לארגון
40. הכשרת AI למנהלים
41. תוכנית AI לתלמידים ולסטודנטים במוסד אקדמי

## C. Glossary term pages ("מה זה X")
Live:
- rag, llm, token, context-window, prompt, system-prompt, mcp, ai-agent, human-in-the-loop, embedding, hallucination, zero-shot-few-shot, evals, fine-tuning.

Next:
- vibe-coding, api, webhook, geo, ai-literacy, tool-use, agent-memory, coding-agent, no-code, workflow, automation.

These need sources that the cloud session can currently reach. Most need network access to Wikipedia and the vendor docs.
