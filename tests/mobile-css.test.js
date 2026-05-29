const assert = require('assert');
const fs = require('fs');
const css = fs.readFileSync('assets/css/styles.css', 'utf8');

assert.ok(css.includes('@media(max-width:600px)'), 'mobile media query should exist');
assert.ok(css.includes('.wrap {\n        padding: 0 16px;'), 'mobile wrap padding should be tighter');
assert.ok(css.includes('width: calc(100% - 20px)'), 'mobile generate button should span input width');
assert.ok(css.includes('.improver-actions {\n        flex-direction: column;'), 'mobile improver actions should stack');
assert.ok(css.includes('.improver-copy {\n        width: 100%;'), 'mobile improver buttons should be full width');

console.log('mobile css tests passed');
