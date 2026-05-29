const assert = require('assert');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('assets/js/app.js', 'utf8');

assert.ok(html.includes('id="result-sub"'), 'result subtitle should be addressable');
assert.ok(app.includes('function getTemplateName(template)'), 'template names should be centralized');
assert.ok(app.includes("compact: 'Compact'"), 'compact template should have a display name');
assert.ok(app.includes('function updateResultTemplateLabel()'), 'result template label should be updateable');
assert.ok(app.includes('updateResultTemplateLabel();\n      if (resumeData)'), 'template switching should update generated result state');
assert.ok(app.includes('PDF template set to'), 'template switching should show user feedback');

console.log('template switching tests passed');
