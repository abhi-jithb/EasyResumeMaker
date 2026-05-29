const assert = require('assert');
const {
  DEFAULT_OPENAI_MODEL,
  isSupportedOpenAIModel,
  validateProviderConfig
} = require('../api/lib/providers');

assert.equal(DEFAULT_OPENAI_MODEL, 'gpt-5-mini');
assert.equal(isSupportedOpenAIModel('gpt-5-mini'), true);
assert.equal(isSupportedOpenAIModel('gpt-5-mini-2025-08-07'), true);
assert.equal(isSupportedOpenAIModel('gpt-5.4-mini'), false);

assert.deepEqual(
  validateProviderConfig({
    AI_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-key'
  }),
  {
    provider: 'openai',
    model: 'gpt-5-mini'
  }
);

assert.throws(
  () => validateProviderConfig({
    AI_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-key',
    OPENAI_MODEL: 'gpt-5.4-mini'
  }),
  /Unsupported OpenAI model/
);

assert.throws(
  () => validateProviderConfig({
    AI_PROVIDER: 'anthropic',
    OPENAI_API_KEY: 'test-key'
  }),
  /Unsupported AI_PROVIDER/
);

assert.deepEqual(
  validateProviderConfig({
    AI_PROVIDER: 'groq',
    GROQ_API_KEY: 'test-key'
  }),
  {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile'
  }
);

console.log('provider config tests passed');
