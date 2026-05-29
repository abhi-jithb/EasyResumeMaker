const assert = require('assert');
const { getGenerateButtonLabel } = require('../assets/js/loading-state');

assert.equal(getGenerateButtonLabel('idle'), 'Generate ->');
assert.equal(getGenerateButtonLabel('fetch'), 'Reading URL...');
assert.equal(getGenerateButtonLabel('parse'), 'Extracting...');
assert.equal(getGenerateButtonLabel('build'), 'Writing...');
assert.equal(getGenerateButtonLabel('pdf'), 'Preparing preview...');
assert.equal(getGenerateButtonLabel('unknown'), 'Generate ->');

console.log('loading state tests passed');
