const assert = require('assert');
const { normalizePublicUrl } = require('../assets/js/url-utils');

const validCases = [
  ['github.com/octocat', 'https://github.com/octocat'],
  ['https://example.com/portfolio#intro', 'https://example.com/portfolio'],
  ['http://example.com', 'http://example.com/']
];

for (const [input, expected] of validCases) {
  const result = normalizePublicUrl(input);
  assert.equal(result.ok, true, `${input} should be valid`);
  assert.equal(result.url, expected);
}

const invalidCases = [
  '',
  'github com/octocat',
  'ftp://example.com/resume',
  'https://user:pass@example.com',
  'localhost:3000',
  '127.0.0.1:8080',
  '192.168.1.10/profile',
  'portfolio'
];

for (const input of invalidCases) {
  const result = normalizePublicUrl(input);
  assert.equal(result.ok, false, `${input} should be invalid`);
  assert.equal(typeof result.message, 'string');
  assert.ok(result.message.length > 0);
}

console.log('url-utils tests passed');
