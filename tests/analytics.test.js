const assert = require('assert');
const { cleanProps } = require('../assets/js/analytics');

assert.deepEqual(
  cleanProps({
    template: 'modern',
    source_type: 'github',
    url: 'https://github.com/private',
    email: 'person@example.com',
    resume_text: 'secret'
  }),
  {
    template: 'modern',
    source_type: 'github'
  }
);

assert.deepEqual(cleanProps({ error_code: 'rate_limited', stage: 'parse' }), {
  error_code: 'rate_limited',
  stage: 'parse'
});

assert.equal(cleanProps({ template: 'x'.repeat(100) }).template.length, 80);

console.log('analytics tests passed');
