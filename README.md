# EasyResume Maker

> Paste your portfolio link. Get a professional PDF resume. Instantly.

EasyResume Maker is a low-friction, AI-powered resume generator. Paste any public URL, choose a template, generate a clean resume preview, and download a PDF.

V2 keeps the app static and lightweight while moving AI credentials behind a small server-side API layer. Users no longer need to bring their own API key.

## Features

- One URL to resume generation
- No user API key required
- Malformed and private URLs are rejected before scraping
- Source detection for GitHub, LinkedIn, Portfolio, Dev.to, Hashnode, and Read.cv links
- Empty-state guidance for sparse generated resumes
- Resume preview sections for projects and leadership/community work
- Safer PDF filenames for generated resumes
- Clear template switching feedback after resume generation
- Privacy-safe analytics events for generation, improvement, templates, and PDF downloads
- ATS-friendly prompt rules for summaries, projects, bullets, and section ordering
- Server-side AI calls using environment variables
- OpenAI as the default AI provider
- Groq-compatible provider abstraction for future use
- AI Resume Improver for polishing rough resume sentences
- 3 PDF templates: Minimal, Modern, Classic
- Compact PDF template for dense one-page resumes
- Client-side PDF generation with jsPDF
- Feedback modal via Formspree
- Vercel Insights support

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | Plain HTML, CSS, JavaScript |
| Static entry | `index.html` |
| AI API | Vercel serverless functions |
| Default AI provider | OpenAI Responses API |
| Future provider | Groq |
| Web scraping | Jina Reader API |
| PDF | jsPDF |
| Hosting | Vercel recommended |

## Project Structure

```text
EasyResumeMaker/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── ai-client.js
│       ├── resume-renderer.js
│       ├── pdf-generator.js
│       └── ui.js
├── api/
│   ├── ai/
│   │   ├── resume-generate.js
│   │   └── resume-improve.js
│   ├── lib/
│   │   ├── providers.js
│   │   ├── prompts.js
│   │   ├── rate-limit.js
│   │   └── responses.js
│   └── health.js
├── docs/
│   └── github-issues-v2-phase-1.md
├── vercel.json
└── netlify.toml
```

## Environment Variables

Set these in Vercel:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5.4-mini
```

Optional future Groq support:

```bash
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
```

## Local Development

The static UI can still be opened directly:

```bash
open index.html
```

AI features require serverless API routes, so use Vercel locally for the full flow:

```bash
npm install -g vercel
vercel dev
```

Then open the local URL printed by Vercel.

## Tests

Run focused utility tests with Node:

```bash
node tests/url-utils.test.js
node tests/prompt-rules.test.js
node tests/error-messages.test.js
node tests/loading-state.test.js
node tests/improver-prompt.test.js
node tests/source-detector.test.js
node tests/resume-state.test.js
node tests/api-validation.test.js
node tests/mobile-css.test.js
node tests/preview-sections.test.js
node tests/pdf-utils.test.js
node tests/compact-template.test.js
node tests/template-switching.test.js
node tests/analytics.test.js
```

Resume generation quality rules are documented in `docs/ats-optimization-rules.md`.

## API Endpoints

### `POST /api/ai/resume-generate`

Input:

```json
{ "rawText": "..." }
```

Output: the existing resume JSON schema consumed by the preview and PDF generator.

### `POST /api/ai/resume-improve`

Input:

```json
{ "text": "Built a Flutter app for attendance." }
```

Output:

```json
{
  "improvedText": "Developed a Flutter-based attendance management application that streamlined attendance tracking and reporting."
}
```

## Privacy

- Users do not provide API keys.
- AI provider credentials live only in deployment environment variables.
- Public URL content is fetched through Jina Reader and sent to the configured AI provider for resume generation.
- Resume Improver text is sent to the configured AI provider for rewriting.
- Do not log raw resume content, URLs, names, emails, or generated AI responses.
- Vercel Insights may collect privacy-preserving usage metrics.

## Roadmap

- Durable rate limiting with Upstash or Vercel KV
- Full extraction of preview and PDF logic from `app.js`
- ATS checker
- Job description matcher
- Multi-URL resume builder
- Optional Groq provider exposure

## Contributing

PRs are welcome. Keep the app static, avoid framework migrations, and preserve the existing URL-to-PDF flow unless an issue explicitly asks for a flow change.

See `Contributing.md` and `docs/github-issues-v2-phase-1.md` for task-ready contribution ideas.

## License

MIT
