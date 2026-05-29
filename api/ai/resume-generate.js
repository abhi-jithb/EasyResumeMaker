const { generateResume } = require('../lib/providers');
const { checkRateLimit } = require('../lib/rate-limit');
const { readJsonBody, sendError, sendJson } = require('../lib/responses');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'method_not_allowed', 'Use POST for resume generation.');
  }

  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return sendError(res, 429, 'rate_limited', 'Too many AI requests. Please try again in a few minutes.');
  }

  try {
    const { rawText } = await readJsonBody(req);
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 300) {
      return sendError(res, 400, 'missing_input', 'Resume generation needs at least 300 characters of page content.');
    }

    const resume = await generateResume(rawText.slice(0, 30000));
    return sendJson(res, 200, resume);
  } catch (error) {
    if (error.code === 'server_misconfigured') {
      return sendError(res, 500, 'server_misconfigured', error.message);
    }
    if (error.code === 'invalid_ai_json') {
      return sendError(res, 502, 'invalid_ai_json', 'AI returned invalid resume JSON. Please try again.');
    }
    return sendError(res, 502, 'ai_failed', error.message || 'AI resume generation failed.');
  }
};
