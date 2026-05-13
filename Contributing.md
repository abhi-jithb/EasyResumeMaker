# Contributing to EasyResume Maker 🚀

First off — thank you for taking the time to contribute! EasyResume Maker is built by people who believe resumes shouldn't be hard, and every contribution, big or small, makes that vision more real.

This document covers everything you need to know to go from zero to your first merged pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What We're Building](#what-were-building)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Picking an Issue](#picking-an-issue)
- [Making Your Changes](#making-your-changes)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Format](#commit-message-format)
- [Style Guide](#style-guide)
- [GSSoC Contributors](#gssoc-contributors)
- [Need Help?](#need-help)

---

## Code of Conduct

This project follows a simple rule: **be kind**. We welcome contributors of all experience levels, backgrounds, and skill sets. Harassment, gatekeeping, or dismissiveness of any kind will not be tolerated.

By contributing, you agree to keep this a welcoming space for everyone.

---

## What We're Building

EasyResume Maker turns any public URL — a portfolio, GitHub profile, LinkedIn page, or personal blog — into a professional PDF resume in seconds. No forms, no accounts, no friction.

**Tech stack (it's simple on purpose):**

- Pure HTML / CSS / JavaScript — no framework, no build step
- [Jina Reader API](https://jina.ai/reader/) — scrapes any public URL
- [Groq API](https://console.groq.com) / [Gemini API](https://aistudio.google.com) — AI-powered data extraction
- [jsPDF](https://github.com/parallax/jsPDF) — client-side PDF generation
- Google Fonts — DM Serif Display, Syne, DM Mono

The entire app lives in one file: `index.html`. This is intentional — it keeps things accessible to beginners and easy to deploy anywhere.

---

## Ways to Contribute

You don't have to write code to contribute. Here's everything that helps:

| Type | Examples |
|---|---|
| 🐛 Bug fixes | Broken layout on mobile, PDF export errors, scraping failures |
| ✨ New features | Additional templates, edit-before-download, dark mode |
| 🎨 UI/UX improvements | Better loading states, accessibility fixes, responsive tweaks |
| 📝 Documentation | Improve README, add code comments, write guides |
| 🌐 Translations | UI text in other languages |
| 🧪 Testing | Test on different devices, browsers, URLs and report issues |
| 💡 Ideas | Open a discussion or issue with a well-thought-out suggestion |

---

## Getting Started

### 1. Fork the repository

Click the **Fork** button on the top right of the GitHub repo page. This creates your own copy.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/EasyResumeMaker.git
cd EasyResumeMaker
```

### 3. Open the project

No installation required. Just open `index.html` in your browser:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### 4. Get an API key for testing

To test the full flow, you'll need a free [Groq API key](https://console.groq.com) (takes 30 seconds). Paste it into the app when prompted. Your key is never stored or sent anywhere except directly to Groq.

### 5. Create a branch for your work

```bash
git checkout -b your-branch-name
```

Use a descriptive branch name:
- `feat/add-dark-mode`
- `fix/mobile-url-input`
- `docs/improve-readme`
- `style/template-picker-hover`

---

## Project Structure

```
EasyResumeMaker/
├── index.html          ← The entire app lives here
├── README.md           ← Project overview and setup guide
├── CONTRIBUTING.md     ← This file
├── LICENSE             ← MIT License
├── vercel.json         ← Vercel deployment config
└── netlify.toml        ← Netlify deployment config
```

Inside `index.html`, the code is organised into clear sections marked with comments:

```
<!-- RESET & ROOT VARIABLES -->
<!-- NAV -->
<!-- HERO -->
<!-- STEPS / HOW IT WORKS -->
<!-- API CONFIG SECTION -->
<!-- TEMPLATE PICKER -->
<!-- URL INPUT -->
<!-- LOADING STAGES -->
<!-- RESULT SECTION -->
<!-- FAQ SECTION -->
<!-- FOOTER -->
<style> ... </style>   ← All CSS
<script> ... </script> ← All JavaScript
```

**Key JavaScript functions:**

| Function | What it does |
|---|---|
| `generateResume()` | Main pipeline — fetch → AI parse → build → PDF |
| `selectTemplate(el)` | Handles template selection UI |
| `setStage(id, state, text)` | Updates loading stage indicators |
| `renderPreview(d)` | Renders the formatted resume preview |
| `downloadPDF()` | Generates and downloads the PDF using jsPDF |
| `startOver()` | Resets the UI to initial state |

---

## Picking an Issue

1. Browse the [Issues tab](https://github.com/abhi-jithb/EasyResumeMaker/issues)
2. Find one labeled `good first issue` (if you're new) or `enhancement` / `bug`
3. **Comment on the issue** saying you'd like to work on it — wait to be assigned before starting
4. Once assigned, start working

> Do not open a pull request for an issue that hasn't been assigned to you. It may be closed without review.

If you have a new idea that isn't in the issues list, **open an issue first** and describe what you want to build. Wait for feedback before building.

---

## Making Your Changes

### Keep it focused

Each PR should do **one thing**. Don't bundle a bug fix with a new feature and a style change in the same PR. Reviewers will ask you to split it.

### Test your changes

Before submitting, check:

- [ ] The app still loads and works end-to-end (paste a URL, generate, download)
- [ ] Your change works on **mobile** (Chrome DevTools → responsive mode)
- [ ] Your change works in **Chrome, Firefox, and Safari** (if relevant)
- [ ] No new console errors or warnings
- [ ] If you changed PDF output, the generated PDF looks correct
- [ ] If you changed the UI, it still matches the overall dark aesthetic

### Keep the single-file structure

Unless you have a very strong reason (and have discussed it in an issue first), all changes should stay within `index.html`. Do not introduce a build system, npm dependencies, or external script files without prior discussion.

---

## Pull Request Guidelines

### Before submitting

- [ ] Branch is up to date with `main`
- [ ] Code is tested locally
- [ ] No commented-out debug code left in
- [ ] CSS variables are used for colours (no hardcoded hex values that break theming)

### PR title format

```
type: short description of what changed
```

Examples:
```
feat: add dark mode toggle
fix: mobile layout broken on URL input
docs: add setup instructions to README
style: improve template picker hover state
refactor: extract PDF generation into separate function
```

### PR description must include

**What changed** — a clear summary of what you did and why.

**How to test it** — steps to reproduce and verify your change.

**Screenshots** — required for any UI changes. Before and after is ideal.

**Known trade-offs** — mention anything you knowingly left out or simplified.

Example PR description:

```markdown
## What changed
Added a dark/light mode toggle in the nav bar. Uses a CSS class on `<body>` 
and localStorage to persist the user's preference.

## How to test
1. Open the app
2. Click the sun/moon icon in the top right
3. Verify the theme switches and persists on reload

## Screenshots
[before screenshot]
[after screenshot]

## Trade-offs
- Light mode palette is minimal — further refinement welcome in a follow-up PR
```

---

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) style:

```
type(scope): short description

Optional longer description if needed.
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | CSS / visual changes, no logic change |
| `refactor` | Code restructure, no behaviour change |
| `perf` | Performance improvement |
| `chore` | Tooling, config, dependency updates |
| `test` | Adding or updating tests |

**Good examples:**
```
feat: add fourth resume template (compact)
fix: pdf download fails when name contains special characters
docs: add FAQ section to README
style: increase contrast on stage loading bar
```

**Bad examples:**
```
update stuff
fixed it
changes
WIP
```

---

## Style Guide

### CSS

- Use CSS variables defined in `:root` for all colours — never hardcode hex values
- Follow the existing naming pattern: `--bg`, `--txt`, `--accent`, `--border`, etc.
- Mobile-first: write base styles for mobile, use `@media(min-width)` for desktop overrides
- Keep transitions short: `0.15s` to `0.3s` — the app should feel snappy, not slow

### JavaScript

- Use `const` by default, `let` when reassignment is needed, never `var`
- Keep functions small and single-purpose
- Add a comment above any function that isn't immediately obvious
- Handle errors with try/catch around all API calls — never let the app silently fail
- Use `async/await` over `.then()` chains

### HTML

- Every interactive element needs an `aria-label` or visible label
- Use semantic elements: `<section>`, `<nav>`, `<footer>`, `<button>`, `<main>`
- Add `role` attributes where ARIA roles improve screen reader experience

---

## GSSoC Contributors

If you are contributing as part of **GirlScript Summer of Code (GSSoC)**:

- Only work on issues **assigned to you** — unassigned PRs will not be counted
- Label your PR with `gssoc26` in the description
- Quality over quantity — one well-crafted PR beats five superficial ones
- Respond to review comments within **48 hours** or the PR may be closed
- All communication (comments, PR descriptions, issue responses) must be your own — do not use AI to write your messages to maintainers
- If AI tools helped you write code, mention it in the PR description and make sure you fully understand every line you submit

Points are awarded for merged PRs, not submitted ones. Focus on getting your work across the finish line.

---

## Need Help?

- **Something's unclear in the codebase?** — Open a [Discussion](https://github.com/abhi-jithb/EasyResumeMaker/discussions) or comment on the relevant issue
- **Found a bug?** — [Open an issue](https://github.com/abhi-jithb/EasyResumeMaker/issues/new) with steps to reproduce
- **Have a feature idea?** — Open an issue with the `enhancement` label and describe it clearly
- **Not sure where to start?** — Look for issues tagged `good first issue`

---

## Thank You

Every person who opens an issue, submits a PR, improves the docs, or tests the app on a new device makes EasyResume Maker better for everyone who needs a resume and doesn't know where to start.

You're part of that. Thank you. 🙌

---

*EasyResume Maker · MIT License · [easyresumemaker.tech](https://easyresumemaker.tech) · [github.com/abhi-jithb/EasyResumeMaker](https://github.com/abhi-jithb/EasyResumeMaker)*
