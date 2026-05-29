const { improveResumeText } = require('../lib/providers');
const { checkRateLimit } = require('../lib/rate-limit');
const { readJsonBody, sendError, sendJson } = require('../lib/responses');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'method_not_allowed', 'Use POST for resume improvement.');
  }

  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return sendError(res, 429, 'rate_limited', 'Too many AI requests. Please try again in a few minutes.');
  }

  try {
    const { text } = await readJsonBody(req);
    if (!text || typeof text !== 'string' || !text.trim()) {
      return sendError(res, 400, 'missing_input', 'Add a resume sentence to improve.');
    }

    const result = await improveResumeText(text.trim().slice(0, 1200));
    return sendJson(res, 200, result);
  } catch (error) {
    if (error.code === 'server_misconfigured') {
      return sendError(res, 500, 'server_misconfigured', error.message);
    }
    return sendError(res, 502, 'ai_failed', error.message || 'AI resume improvement failed.');
  }
};
