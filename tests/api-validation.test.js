const assert = require('assert');
const generateHandler = require('../api/ai/resume-generate');
const improveHandler = require('../api/ai/resume-improve');

function call(handler, body) {
  return new Promise(resolve => {
    const req = {
      method: 'POST',
      headers: {
        'x-forwarded-for': `127.0.0.${Math.floor(Math.random() * 200) + 1}`,
        'user-agent': 'api-validation-test'
      },
      body
    };
    const res = {
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      end(payload) {
        resolve({
          statusCode: this.statusCode,
          payload: JSON.parse(payload)
        });
      }
    };

    handler(req, res);
  });
}

(async () => {
  const generateResult = await call(generateHandler, '{not json');
  assert.equal(generateResult.statusCode, 400);
  assert.equal(generateResult.payload.error.code, 'invalid_json');

  const improveResult = await call(improveHandler, '{not json');
  assert.equal(improveResult.statusCode, 400);
  assert.equal(improveResult.payload.error.code, 'invalid_json');

  console.log('api validation tests passed');
})();
