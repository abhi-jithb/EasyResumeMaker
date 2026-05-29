const assert = require('assert');
const fs = require('fs');

const architecture = fs.readFileSync('docs/architecture.md', 'utf8');
const examples = fs.readFileSync('docs/example-urls.md', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');

assert.ok(architecture.includes('static entry point'), 'architecture doc should explain the static frontend');
assert.ok(architecture.includes('AI API Layer'), 'architecture doc should explain API routes');
assert.ok(architecture.includes('Provider Abstraction'), 'architecture doc should explain providers');
assert.ok(architecture.includes('Privacy Rules'), 'architecture doc should explain privacy boundaries');
assert.ok(examples.includes('github.com/your-username'), 'examples doc should include GitHub pattern');
assert.ok(examples.includes('read.cv/your-username'), 'examples doc should include Read.cv pattern');
assert.ok(examples.includes('yourblog.hashnode.dev'), 'examples doc should include Hashnode pattern');
assert.ok(examples.toLowerCase().includes('localhost urls'), 'examples doc should warn against local URLs');
assert.ok(readme.includes('docs/architecture.md'), 'README should link the architecture doc');
assert.ok(readme.includes('docs/example-urls.md'), 'README should link the example URL doc');

console.log('docs tests passed');
