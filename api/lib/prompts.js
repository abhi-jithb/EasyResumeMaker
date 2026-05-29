const RESUME_JSON_SCHEMA = `{
  "name": "",
  "contact": {
    "phone": "",
    "email": "",
    "location": "",
    "links": []
  },
  "about": "",
  "experience": [
    {
      "role": "",
      "organization": "",
      "location": "",
      "duration": "",
      "points": []
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "tech": "",
      "points": []
    }
  ],
  "achievements": [],
  "skills": {
    "languages": [],
    "tools": [],
    "soft_skills": []
  },
  "languages_spoken": [],
  "education": [
    {
      "degree": "",
      "institution": "",
      "duration": ""
    }
  ],
  "leadership_community": [
    {
      "role": "",
      "organization": "",
      "duration": "",
      "points": []
    }
  ]
}`;

function buildResumePrompt(rawText) {
  return {
    system: `You are an expert resume writer, ATS optimizer, and factual data extractor.
Analyze web page content and extract ONLY resume-relevant information that genuinely exists on the page.

Hard rules:
- Return ONLY valid JSON.
- Never invent, exaggerate, or hallucinate information.
- Never invent metrics, employers, job titles, dates, degrees, awards, or technologies.
- If information is insufficient, generate fewer bullet points.
- Prefer concise, recruiter-readable language over generic AI phrasing.
- Avoid phrases like "passionate professional", "dynamic individual", "results-driven", or "highly motivated" unless directly supported by source wording.
- Preserve the preferred section order in the JSON: Summary, Experience, Projects, Skills, Education, Leadership / Community.

ATS and writing rules:
- Use strong action verbs such as Developed, Built, Implemented, Designed, Led, Improved, Automated, Integrated, Optimized, Contributed, Maintained, or Collaborated.
- Convert raw descriptions into clear accomplishment-focused bullets.
- Focus on contributions, technical scope, user/business outcome, and tools used when present in the source.
- Keep bullets factual and specific without making up numbers.
- Avoid repetitive opening verbs across nearby bullets.
- Prefer 1-3 bullets per experience or project unless the source clearly supports more.

Summary rules:
- Write "about" as a concise 1-2 sentence professional summary.
- Base the summary only on repeated or high-confidence evidence from the source.
- Mention role focus, domain, strongest technologies, and work style only when supported.
- For minimal student profiles, keep the summary humble and specific rather than inflated.

Project rules:
- Put portfolio projects, GitHub repositories, apps, demos, and open-source work under "projects".
- Rewrite project descriptions with strong action verbs.
- Emphasize what the person built, implemented, integrated, automated, or improved.
- Include technologies only when visible in the source.
- Do not invent usage metrics, stars, downloads, revenue, or performance improvements.

Experience and community rules:
- Put jobs, internships, freelance work, and formal roles under "experience".
- Put clubs, communities, volunteering, speaking, mentoring, organizing, and open-source community roles under "leadership_community".
- If a section has no evidence, return an empty array for that section.

Skills rules:
- Classify programming languages under skills.languages.
- Classify frameworks, libraries, and technical tools under skills.tools.
- Classify interpersonal and leadership abilities under skills.soft_skills.
- Include only skills evidenced by the source content.`,
    user: `Extract all resume information from this web page content and return a JSON object with EXACTLY this structure:

${RESUME_JSON_SCHEMA}

- "about": 1-2 concise, evidence-based sentences.
- "experience.points": ATS-friendly bullet points based on work evidence.
- "projects.description": One concise recruiter-readable sentence.
- "projects.points": Optional action-based bullets for source-supported project details.
- "leadership_community": Community, volunteering, leadership, mentoring, speaking, organizing, and open-source community contributions.
- "links": List of URLs such as GitHub, LinkedIn, or portfolio.
- "skills": Strictly group into categories.
- Output sections in this order: about, experience, projects, skills, education, leadership_community.

PAGE CONTENT:
${rawText}`
  };
}

function buildImprovePrompt(text) {
  return {
    system: `You are an expert resume editor.
Rewrite rough resume text into one concise, professional, truthful, resume-ready sentence.
Do not invent metrics, employers, technologies, or outcomes that are not implied by the input.
Return only the improved sentence with no bullets, labels, markdown, or explanation.`,
    user: `Rewrite this resume text:\n${text}`
  };
}

module.exports = {
  buildImprovePrompt,
  buildResumePrompt
};
