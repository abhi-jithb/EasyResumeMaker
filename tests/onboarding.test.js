const assert = require('assert');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pickIndex = html.indexOf('<div class="step-label">Pick a template</div>');
const pasteIndex = html.indexOf('<div class="step-label">Paste your URL</div>');
const cardTemplateIndex = html.indexOf('Step 1 — Choose a template');
const cardUrlIndex = html.indexOf('Step 2 — Your public URL');

assert.ok(pickIndex > -1, 'steps should mention picking a template');
assert.ok(pasteIndex > -1, 'steps should mention pasting a URL');
assert.ok(pickIndex < pasteIndex, 'onboarding steps should match the V2 UI order');
assert.ok(cardTemplateIndex < cardUrlIndex, 'template card should appear before URL card');

console.log('onboarding tests passed');
