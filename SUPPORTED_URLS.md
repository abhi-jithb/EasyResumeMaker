# Supported URL Types and Extraction Results

This file is a community-maintained reference for the URL types that are commonly tested with EasyResume Maker. It documents which URL formats tend to produce good extraction results, and which ones are limited or blocked.

## What “Works” Means

A URL is considered **Working** when the extraction flow successfully captures the core resume fields:

- ✅ Name
- ✅ Experience
- ✅ Skills

If only part of that information is extracted, the result should be marked as **⚠️ Partial** and explained in the Notes column.

## Results Summary

| URL Type | Example | Works? | Quality | Notes |
|---|---|---:|---|---|
| GitHub Profile | https://github.com/torvalds | ✅ Yes | High | Usually extracts name, bio, repos, and skills well. Good baseline for technical profiles. |
| Dev.to | https://dev.to/ben | ⚠️ Partial | Medium | Often returns author bio and recent posts, but some pages may be incomplete or fail to load cleanly. |
| Hashnode | https://hashnode.com/@swyx | ✅ Yes | High | Strong profile and article content for developer-focused writers and bloggers. |
| Read.cv | https://read.cv/abhi | ✅ Yes | High | Structured profile pages usually provide useful name, experience, and skills data. |
| Notion Page | https://www.notion.so/your-name/Resume-Template-123abc | ⚠️ Partial | Medium | Results depend heavily on public visibility, page formatting, and whether the page is blocked by Notion access rules. |
| Behance | https://www.behance.net/gallery/12345678 | ✅ Yes | Medium | Project descriptions and creative work are often extractable, though full resume metadata may be sparse. |
| Medium | https://medium.com/@username | ⚠️ Partial | Medium | Author pages may provide limited text, and some pages return low-content output or incomplete summaries. |
| Personal Portfolio Website | https://alexsmith.dev | ✅ Yes | Medium | Best when the site is static and well-structured; JS-heavy portfolios can vary a lot. |
| LinkedIn Profile | https://www.linkedin.com/in/jane-doe | ❌ No | Low | Frequently blocked by authentication or anti-scraping restrictions, so extraction is usually unreliable. |
| Linktree | https://linktr.ee/username | ⚠️ Partial | Low | Usually provides limited structured data, mostly links and short bios rather than full resume content. |

## 🤝 Community Contributions

This document is meant to grow with community testing.

Please follow these guidelines when adding results:

- Test URLs using a valid Groq API key whenever possible.
- Record results honestly and without guessing.
- Document failures as carefully as successes; they are valuable for improving the project.
- Include the date tested if possible (for example: 2026-06-04).
- Note partial extraction clearly in the Quality or Notes column.

## Contribution Notes

If you test a new URL type or find a better example for an existing one, please update this file with:

1. The URL type and example URL.
2. Whether it worked.
3. The quality level (High, Medium, Low).
4. A short note on what was extracted, what failed, or what formatting/authentication issue appeared.
