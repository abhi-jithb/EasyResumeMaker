const assert = require('assert');
const {
  apiErrorMessage,
  fetchErrorMessage,
  lowContentMessage
} = require('../assets/js/error-messages');

assert.equal(
  apiErrorMessage({ code: 'rate_limited' }),
  'Too many AI requests. Please wait a few minutes, then try again.'
);

assert.ok(apiErrorMessage({ code: 'server_misconfigured' }).includes('provider API key'));
assert.ok(apiErrorMessage({ code: 'missing_input' }).includes('fuller portfolio'));
assert.ok(apiErrorMessage({ status: 503 }).includes('AI service'));
assert.equal(apiErrorMessage({ message: 'Custom provider message' }), 'Custom provider message');

assert.ok(fetchErrorMessage(new Error('HTTP 403')).includes('public'));
assert.ok(fetchErrorMessage(new Error('HTTP 403')).includes('HTTP 403'));

const lowContent = lowContentMessage(127);
assert.ok(lowContent.includes('127 characters'));
assert.ok(lowContent.includes('github.com/your-username'));
assert.ok(lowContent.includes('public portfolio, blog, or personal website'));
assert.equal(lowContent.includes('read.cv'), false);

console.log('error message tests passed');
