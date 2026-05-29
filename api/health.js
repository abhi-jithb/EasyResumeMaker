const { sendJson } = require('./lib/responses');

module.exports = function handler(req, res) {
  sendJson(res, 200, {
    ok: true,
    provider: process.env.AI_PROVIDER || 'openai'
  });
};
