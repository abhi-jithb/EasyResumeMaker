const { buildImprovePrompt, buildResumePrompt } = require('./prompts');

const DEFAULT_PROVIDER = 'groq';
const DEFAULT_OPENAI_MODEL = 'gpt-5-mini';
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const SUPPORTED_OPENAI_MODELS = new Set([
  'gpt-5-mini',
  'gpt-5',
  'gpt-5-nano',
  'gpt-5.1',
  'gpt-5.2',
  'gpt-4.1-mini',
  'gpt-4.1'
]);

function configError(message) {
  const error = new Error(message);
  error.code = 'server_misconfigured';
  return error;
}

function isSupportedOpenAIModel(model) {
  if (SUPPORTED_OPENAI_MODELS.has(model)) return true;

  const snapshotMatch = model.match(/^(.+)-\d{4}-\d{2}-\d{2}$/);
  return Boolean(snapshotMatch && SUPPORTED_OPENAI_MODELS.has(snapshotMatch[1]));
}

function validateProviderConfig(env = process.env) {
  const provider = (env.AI_PROVIDER || DEFAULT_PROVIDER).toLowerCase();

  if (provider === 'openai') {
    const model = env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    if (!env.OPENAI_API_KEY) {
      throw configError('OpenAI API key is not configured.');
    }
    if (!isSupportedOpenAIModel(model)) {
      throw configError(`Unsupported OpenAI model "${model}". Use ${DEFAULT_OPENAI_MODEL} or another documented GPT model supported by the Responses API.`);
    }
    return { provider, model };
  }

  if (provider === 'groq') {
    if (!env.GROQ_API_KEY) {
      throw configError('Groq API key is not configured.');
    }
    return { provider, model: env.GROQ_MODEL || DEFAULT_GROQ_MODEL };
  }

  throw configError(`Unsupported AI_PROVIDER "${provider}". Use "openai" or "groq".`);
}

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
  const { model } = validateProviderConfig(process.env);

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
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
  const { model } = validateProviderConfig(process.env);

  const body = {
    model,
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
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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
  const { provider } = validateProviderConfig(process.env);
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
  DEFAULT_PROVIDER,
  DEFAULT_OPENAI_MODEL,
  DEFAULT_GROQ_MODEL,
  generateResume,
  improveResumeText,
  isSupportedOpenAIModel,
  validateProviderConfig
};
