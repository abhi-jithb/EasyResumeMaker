# EasyResume Maker 🚀

> **Paste your portfolio link. Get a professional PDF resume. Instantly.**

EasyResume Maker is a zero-friction, AI-powered resume generator. 
Paste any public URL — portfolio site, GitHub profile, LinkedIn, Dev.to, 
or personal blog — and get a clean, downloadable PDF resume in seconds.

3 templates · Groq & Gemini support · 100% client-side · No data collected

---

## ✨ Features

- **One URL → One Resume** — paste any public link and go
- **3 beautiful templates** — Minimal, Modern (two-column), Classic (warm serif)
- **AI-powered extraction** — uses Groq (llama-3.3-70b) or Gemini 1.5 Flash
- **Client-side PDF** — generated entirely in your browser via jsPDF
- **Zero data collection** — your API key and data never touch our servers
- **SEO optimised** — schema.org structured data, Open Graph, meta tags
- **Fully responsive** — works on mobile, tablet, desktop
- **Accessible** — ARIA labels, keyboard navigation, live regions
- **4-stage loading UI** — each stage visually aligned to what's actually happening
- **FAQ section** — SEO-rich content that answers real user questions

---

## 🛠 Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | Plain HTML/CSS/JS | Zero build step, instant deploy anywhere |
| Web Scraping | [Jina Reader API](https://jina.ai/reader/) | Free, handles JS-heavy sites, no auth needed |
| AI (fast) | [Groq](https://groq.com) — llama-3.3-70b | Fastest inference, free tier, JSON mode |
| AI (alt) | [Gemini 1.5 Flash](https://ai.google.dev) | Google's free tier alternative |
| PDF | [jsPDF](https://github.com/parallax/jsPDF) | Client-side, no server, excellent quality |
| Fonts | DM Serif Display + Syne + DM Mono | Distinctive editorial aesthetic |
| Hosting | Any static host | Vercel, Netlify, GitHub Pages — all work |

---

## 🚀 Getting Started

### Option 1 — Open directly
Just open `index.html` in your browser. Done. No install, no build.

```bash
git clone https://github.com/abhi-jithb/EasyResumeMaker.git
cd easyresume-maker
open index.html   # macOS
# or
xdg-open index.html   # Linux
```

### Option 2 — Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

### Option 3 — Deploy to Netlify
Drag and drop the `index.html` file at [netlify.com/drop](https://netlify.com/drop).

### Option 4 — GitHub Pages
Push to a repo, enable GitHub Pages from Settings → Pages → main branch.

---

## 🔑 Getting API Keys

### Groq (Recommended — Fastest)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free (takes 30 seconds)
3. Click **API Keys** → **Create API Key**
4. Copy and paste into EasyResume Maker

Groq's free tier allows hundreds of resume generations per day.

### Gemini (Alternative)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key**
3. Copy and paste into EasyResume Maker

---

## 📂 Project Structure

```
easyresume-maker/
├── index.html          # The entire app — one file
├── README.md           # This file
├── LICENSE             # MIT License
└── og-image.png        # (optional) Open Graph image for social sharing
```

---

## 🎨 Templates

| Template | Style | Best For |
|---|---|---|
| **Minimal** | Clean white, serif headings, elegant spacing | Designers, writers, general use |
| **Modern** | Dark sidebar, two-column, yellow accent | Developers, tech roles |
| **Classic** | Warm tones, terracotta accent, traditional | Business, academia, senior roles |

---

## 🌐 Supported URLs

| Source | Works? | Notes |
|---|---|---|
| Personal portfolio sites | ✅ Best | Most info, cleanest extraction |
| GitHub profiles | ✅ Great | Pulls bio, repos, skills |
| Dev.to profiles | ✅ Great | Articles parsed as experience |
| Hashnode blogs | ✅ Great | — |
| Read.cv | ✅ Great | Purpose-built for this use case |
| LinkedIn | ⚠️ Partial | Public profiles only, limited content |
| Behance | ✅ Good | Project descriptions extracted |
| Medium | ✅ Good | Bio + article topics |

---

## 🔒 Privacy

- **Your API key** is used only in your browser session. It is sent directly from your browser to Groq/Google's servers. We never see it.
- **Your URL content** is fetched via Jina Reader API and sent to the AI for parsing. It is not stored anywhere.
- **No cookies**, no analytics, no tracking.
- **No account** required.

---

## 🛣 Roadmap

- [ ] 2 more templates (Compact, Creative)
- [ ] Multi-URL support (merge GitHub + LinkedIn + portfolio)
- [ ] "Edit before download" — in-browser resume editing
- [ ] ATS score checker
- [ ] Dark/light mode toggle
- [ ] Share resume link (optional)
- [ ] Custom colour picker per template

---

## 🤝 Contributing

PRs welcome! This is a single-file project by design — all contributions should stay within `index.html` unless there's a strong reason not to.

1. Fork the repo
2. Make your changes in `index.html`
3. Test by opening in a browser with a real API key
4. Submit a PR with a clear description

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 💬 The Story

Built to solve a real problem: resumes are annoying to update. If you already have a portfolio, a GitHub, or a LinkedIn — your story is already written. EasyResume Maker just formats it.

Inspired by the simplicity of README generators: paste your details, get the output, done.

---

*Built with ♥ by [Abhijith](https://www.linkedin.com/in/abhi-jithb) for developers, designers, and everyone who's stared at a blank resume template at midnight.*