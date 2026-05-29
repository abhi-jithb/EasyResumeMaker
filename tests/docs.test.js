const assert = require('assert');
const fs = require('fs');

const architecture = fs.readFileSync('docs/architecture.md', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');

assert.ok(architecture.includes('static entry point'), 'architecture doc should explain the static frontend');
assert.ok(architecture.includes('AI API Layer'), 'architecture doc should explain API routes');
assert.ok(architecture.includes('Provider Abstraction'), 'architecture doc should explain providers');
assert.ok(architecture.includes('Privacy Rules'), 'architecture doc should explain privacy boundaries');
assert.ok(readme.includes('docs/architecture.md'), 'README should link the architecture doc');

console.log('docs tests passed');
