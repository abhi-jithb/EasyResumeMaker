# GitHub Issues: V2 Phase 1

Use these as issue titles and implementation notes.

## 1. refactor: split inline CSS and JS into static assets

- Move CSS into `assets/css/styles.css`.
- Move browser JavaScript into files under `assets/js/`.
- Keep `index.html` as the static entry point.
- Do not add a framework or build step.

## 2. feat: add OpenAI-backed server-side AI provider

- Add `/api/ai/resume-generate`.
- Read `OPENAI_API_KEY` from environment variables.
- Use `OPENAI_MODEL`, defaulting to `gpt-5.4-mini`.
- Return the existing resume JSON schema.

## 3. feat: add provider abstraction for OpenAI and Groq

- Add `api/lib/providers.js`.
- Select provider with `AI_PROVIDER`.
- Default to OpenAI.
- Keep Groq support behind the same `generateResume` and `improveResumeText` functions.

## 4. feat: remove user API-key requirement

- Remove the API-key input and provider dropdown from the UI.
- Update validation so users only need a public URL.
- Update README, FAQ, and contribution docs.

## 5. feat: add rate limiting for AI endpoints

- Add shared rate-limit helper.
- Apply to generation and improver endpoints.
- Return HTTP `429` with the `rate_limited` error code.

## 6. feat: add AI Resume Improver

- Add textarea input and Improve button.
- Add `/api/ai/resume-improve`.
- Return `{ "improvedText": "..." }`.
- Include a copy button for improved text.

## 7. fix: add structured AI error handling

- Use consistent error codes:
  - `missing_input`
  - `rate_limited`
  - `server_misconfigured`
  - `invalid_ai_json`
  - `ai_failed`
- Map errors to user-friendly UI messages.

## 8. docs: update V2 deployment and contribution guide

- Document Vercel environment variables.
- Document local development with `vercel dev`.
- Document the new folder structure.
- Note that the app remains static and does not use Next.js.

## Contributor-Friendly Follow-Ups

- Improve Resume Improver mobile spacing.
- Add more example resume-improvement prompts.
- Extract theme logic from `app.js` into `assets/js/ui.js`.
- Extract PDF generation into `assets/js/pdf-generator.js`.
- Replace in-memory rate limiting with Upstash or Vercel KV.
