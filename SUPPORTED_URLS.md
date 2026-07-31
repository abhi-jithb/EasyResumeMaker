# Supported URLs & Test Results 📋

> 🙋 **Community Contribution Welcome!**
> Have you tested a URL type not listed here, or found different results with the same URL? Please open a PR to add your findings to this table. Document what worked, what failed, and any workarounds you discovered.

## What "Works" Means ✅

When we evaluate if a URL "works", we test the end-to-end flow (URL → Jina Reader → Groq/Gemini AI → PDF). A successful extraction typically yields:
- **Name & Title** extracted accurately
- **Professional Experience / Projects** listed with dates and descriptions
- **Skills / Technologies** identified from context
- **Contact / Social Links** (GitHub, LinkedIn, Email) preserved
- **Clean Formatting** in the generated PDF (no massive blocks of raw HTML or gibberish)

If a site returns less than ~300 characters or blocks scraping, it will trigger the app's "Low Content" warning.

## Test Results Table 🧪
*Tested using Jina Reader API + Groq (llama-3.3-70b) / Gemini 1.5 Flash*

| URL Type | Example | Works? | Quality | Notes |
|---|---|---|---|---|
| GitHub Profile | `https://github.com/username` | ✅ Yes | ⭐⭐⭐⭐⭐ | Excellent. Pulls bio, pinned repos, contribution graph context, and tech stack. |
| Personal Portfolio (Static/SSG) | `https://username.dev` | ✅ Yes | ⭐⭐⭐⭐⭐ | Best results. Clean HTML structure allows precise extraction of name, projects, and contact info. |
| Read.cv | `https://read.cv/username` | ✅ Yes | ⭐⭐⭐⭐⭐ | Purpose-built for resumes. Extracts almost every field perfectly. |
| Hashnode Blog | `https://username.hashnode.dev` | ✅ Yes | ⭐⭐⭐⭐ | Great. Extracts author bio, recent posts, and tags. Good for dev portfolios. |
| Behance Portfolio | `https://www.behance.net/username` | ✅ Yes | ⭐⭐⭐ | Good. Extracts project titles and descriptions. Contact info sometimes missed. |
| Dev.to Profile | `https://dev.to/username` | ⚠️ Partial | ⭐⭐ | Inconsistent. Jina Reader sometimes returns HTTP 400 or sparse content. Works best with direct blog post links rather than profile pages. |
| LinkedIn Profile | `https://www.linkedin.com/in/username` | ❌ Limited | ⭐ | Actively blocks scrapers. Returns ~127 chars. Triggers low-content warning. |
| Medium Profile | `https://medium.com/@username` | ❌ Limited | ⭐ | Returns ~246 chars. Heavily JS-rendered. Triggers low-content warning. |
| Notion Page | `https://username.notion.site/page` | ⚠️ Partial | ⭐⭐ | Works if public. JS-heavy rendering often strips details. Static Notion pages work better. |
| Linktree | `https://linktr.ee/username` | ❌ No | ⭐ | Only contains links, no bio/experience context. AI cannot build a resume from it alone. |

## 💡 Tips for Better Extraction
- Prefer static sites (Astro, Hugo, Next.js static export) over client-side rendered apps (React, Vue, SvelteKit).
- If a profile page fails, try linking to a specific blog post or project page that contains rich HTML.
- Ensure the page is publicly accessible (no login walls).
- Include a clear "About" or "Experience" section on your site for the AI to parse.

---
*Last updated: 2024-05-20*
*This document is community-maintained. Add your tests via Pull Request!*
