# EasyResumeMaker Architecture

EasyResumeMaker V2 keeps the application static while moving AI credentials into server-side functions.

## Frontend

- `index.html` is the static entry point.
- `assets/css/styles.css` contains the app styling.
- `assets/js/app.js` owns the main browser workflow: URL fetch, stages, preview, copy, PDF export, and Resume Improver UI.
- Small utilities live in separate browser-compatible files under `assets/js/`.
- Utility files use a tiny UMD-style wrapper so they work in the browser and in Node tests.

## AI API Layer

- Vercel serverless functions live under `api/`.
- `api/ai/resume-generate.js` receives extracted page text and returns resume JSON.
- `api/ai/resume-improve.js` receives rough resume text and returns one improved sentence.
- API routes never require users to provide provider keys.
- Credentials are read from environment variables.

## Provider Abstraction

- `api/lib/providers.js` exposes `generateResume(rawText)` and `improveResumeText(text)`.
- OpenAI is the default provider.
- Groq can be enabled with `AI_PROVIDER=groq`.
- Provider-specific details should stay inside `providers.js`.

## Privacy Rules

- Do not log raw URLs, scraped page text, names, emails, or generated resume content.
- Analytics events must use the whitelist in `assets/js/analytics.js`.
- AI prompts must never ask the model to invent metrics or unsupported claims.

## Testing

- Tests are plain Node scripts in `tests/`.
- Prefer deterministic tests for utilities, prompt contracts, and static wiring.
- Avoid tests that call live AI providers.
- Keep every improvement small enough to review as one PR.
