const assert = require('assert');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('assets/js/app.js', 'utf8');

assert.ok(html.includes('data-tpl="compact"'), 'template picker should include compact template');
assert.ok(html.includes('Compact'), 'compact template should have a visible name');
assert.ok(app.includes("tpl === 'minimal' || tpl === 'compact'"), 'compact template should use the minimal PDF path');
assert.ok(app.includes("const isCompact = tpl === 'compact'"), 'PDF export should detect compact template');
assert.ok(app.includes('isCompact ? 14 : 20'), 'compact template should use tighter margins');
assert.ok(app.includes('isCompact ? 20 : 24'), 'compact template should use smaller name type');

console.log('compact template tests passed');
