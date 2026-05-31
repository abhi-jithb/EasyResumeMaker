const assert = require('assert');
const {
  aiGenerationErrorMessage,
  apiErrorMessage,
  fetchErrorMessage,
  lowContentMessage,
  pdfErrorMessage
} = require('../assets/js/error-messages');

assert.equal(
  apiErrorMessage({ code: 'rate_limited' }),
  'Tiny traffic jam at resume HQ 🚦. Give it a few minutes, then we can try again.'
);

assert.ok(apiErrorMessage({ code: 'server_misconfigured' }).includes('provider API key'));
assert.ok(apiErrorMessage({ code: 'missing_input' }).includes('more to work with'));
assert.ok(apiErrorMessage({ status: 503 }).includes('resume robot'));
assert.equal(apiErrorMessage({ message: 'Custom provider message' }), 'Custom provider message');

assert.ok(fetchErrorMessage(new Error('HTTP 403')).includes('public'));
assert.ok(fetchErrorMessage(new Error('HTTP 403')).includes('HTTP 403'));
assert.ok(fetchErrorMessage(new Error('Network error')).includes('small nap'));

const lowContent = lowContentMessage(127);
assert.ok(lowContent.includes('127 characters'));
assert.ok(lowContent.includes('github.com/your-username'));
assert.ok(lowContent.includes('public portfolio, blog, or personal website'));
assert.equal(lowContent.includes('read.cv'), false);

assert.ok(aiGenerationErrorMessage({ code: 'ai_failed' }).includes('resume yarn'));
assert.ok(pdfErrorMessage(new Error('jsPDF missing')).includes('PDF press jammed'));
assert.ok(pdfErrorMessage(new Error('jsPDF missing')).includes('jsPDF missing'));

console.log('error message tests passed');
