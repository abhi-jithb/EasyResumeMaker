const assert = require('assert');
const { detectSource } = require('../assets/js/source-detector');

assert.deepEqual(detectSource('github.com/octocat'), { type: 'github', label: 'GitHub profile or repository' });
assert.deepEqual(detectSource('dev.to/username'), { type: 'devto', label: 'Dev.to profile or article' });
assert.deepEqual(detectSource('myblog.hashnode.dev'), { type: 'hashnode', label: 'Hashnode profile or blog' });
assert.deepEqual(detectSource('hashnode.dev/@you'), { type: 'hashnode', label: 'Hashnode profile or blog' });
assert.deepEqual(detectSource('example.dev'), { type: 'website', label: 'Portfolio, public blog, or personal website' });
assert.deepEqual(detectSource('not a url'), { type: 'unknown', label: 'Unknown source' });

console.log('source detector tests passed');
