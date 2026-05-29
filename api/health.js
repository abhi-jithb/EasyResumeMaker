const { sendJson } = require('./lib/responses');
const { validateProviderConfig } = require('./lib/providers');

module.exports = function handler(req, res) {
  try {
    const config = validateProviderConfig(process.env);
    return sendJson(res, 200, {
      ok: true,
      provider: config.provider,
      model: config.model,
      configured: true
    });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      provider: process.env.AI_PROVIDER || 'openai',
      configured: false,
      error: {
        code: error.code || 'server_misconfigured',
        message: error.message
      }
    });
  }
};
