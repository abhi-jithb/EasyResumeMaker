const assert = require('assert');
const fs = require('fs');
const healthHandler = require('../api/health');
const { checkRateLimit } = require('../api/lib/rate-limit');

function callHealth(env) {
  const previous = { ...process.env };
  process.env.AI_PROVIDER = env.AI_PROVIDER;
  process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  process.env.OPENAI_MODEL = env.OPENAI_MODEL;
  process.env.GROQ_API_KEY = env.GROQ_API_KEY;
  process.env.GROQ_MODEL = env.GROQ_MODEL;

  return new Promise(resolve => {
    const res = {
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      end(payload) {
        process.env = previous;
        resolve({
          statusCode: this.statusCode,
          payload: JSON.parse(payload)
        });
      }
    };

    healthHandler({ method: 'GET', headers: {} }, res);
  });
}

(async () => {
  const aiClient = fs.readFileSync('assets/js/ai-client.js', 'utf8');
  const vercelConfig = fs.readFileSync('vercel.json', 'utf8');

  assert.ok(fs.existsSync('api/ai/resume-generate.js'), 'resume generation API route should exist');
  assert.ok(fs.existsSync('api/ai/resume-improve.js'), 'resume improvement API route should exist');
  assert.ok(aiClient.includes('/api/ai/resume-generate'), 'client should call the generation API route');
  assert.ok(aiClient.includes('/api/ai/resume-improve'), 'client should call the improvement API route');
  assert.ok(vercelConfig.includes('"source": "/api/(.*)"'), 'Vercel config should target API routes');
  assert.ok(vercelConfig.includes('"Cache-Control", "value": "no-store"'), 'API responses should not be cached');

  const healthy = await callHealth({
    AI_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-key',
    OPENAI_MODEL: 'gpt-5-mini'
  });
  assert.equal(healthy.statusCode, 200);
  assert.equal(healthy.payload.configured, true);
  assert.equal(healthy.payload.model, 'gpt-5-mini');

  const unhealthy = await callHealth({
    AI_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-key',
    OPENAI_MODEL: 'gpt-5.4-mini'
  });
  assert.equal(unhealthy.statusCode, 500);
  assert.equal(unhealthy.payload.configured, false);
  assert.equal(unhealthy.payload.error.code, 'server_misconfigured');

  const req = {
    headers: {
      'x-forwarded-for': '203.0.113.42',
      'user-agent': `deployment-readiness-${Date.now()}`
    },
    socket: {}
  };

  for (let i = 0; i < 10; i += 1) {
    assert.equal(checkRateLimit(req).allowed, true, `rate limit request ${i + 1} should be allowed`);
  }
  assert.equal(checkRateLimit(req).allowed, false, 'rate limit should block the eleventh request');

  console.log('deployment readiness tests passed');
})();
