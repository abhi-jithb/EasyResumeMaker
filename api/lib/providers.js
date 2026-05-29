const { buildImprovePrompt, buildResumePrompt } = require('./prompts');

function stripJsonFences(text) {
  return String(text || '').replace(/```json|```/g, '').trim();
}

function extractOpenAIText(data) {
  if (data.output_text) return data.output_text;

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.text) parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}

async function callOpenAI({ system, user, maxOutputTokens = 2500 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error('OpenAI API key is not configured.');
    error.code = 'server_misconfigured';
    throw error;
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_output_tokens: maxOutputTokens
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error?.message || `OpenAI API error ${res.status}`);
    error.code = 'ai_failed';
    throw error;
  }

  return extractOpenAIText(data);
}

async function callGroq({ system, user, json = false, maxOutputTokens = 2500 }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error('Groq API key is not configured.');
    error.code = 'server_misconfigured';
    throw error;
  }

  const body = {
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.25,
    max_tokens: maxOutputTokens
  };

  if (json) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error?.message || `Groq API error ${res.status}`);
    error.code = 'ai_failed';
    throw error;
  }

  return data.choices?.[0]?.message?.content || '';
}

async function callProvider(prompt, options = {}) {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  if (provider === 'groq') return callGroq({ ...prompt, ...options });
  return callOpenAI({ ...prompt, ...options });
}

async function generateResume(rawText) {
  const prompt = buildResumePrompt(rawText);
  const text = await callProvider(prompt, { json: true, maxOutputTokens: 2500 });

  try {
    return JSON.parse(stripJsonFences(text));
  } catch (error) {
    error.code = 'invalid_ai_json';
    error.message = 'AI returned invalid resume JSON.';
    throw error;
  }
}

async function improveResumeText(text) {
  const prompt = buildImprovePrompt(text);
  const improvedText = (await callProvider(prompt, { maxOutputTokens: 220 })).trim();
  return {
    improvedText: improvedText.replace(/^[-*]\s*/, '').replace(/^"|"$/g, '')
  };
}

module.exports = {
  generateResume,
  improveResumeText
};
