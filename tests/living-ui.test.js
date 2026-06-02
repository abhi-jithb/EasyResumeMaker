const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('assets/css/living-ui.css', 'utf8');
const app = fs.readFileSync('assets/js/app.js', 'utf8');

assert.ok(html.includes('assets/css/living-ui.css'), 'index should load living UI styles');
assert.ok(html.includes('assets/js/living-ui.js'), 'index should load living UI script');
assert.ok(html.includes('class="living-bg"'), 'index should include the living background layer');
assert.ok(html.includes('aria-hidden="true"'), 'living background should be hidden from assistive tech');
assert.ok(html.includes('living-bg__page'), 'living background should include resume pages');
assert.ok(html.includes('living-bg__card'), 'living background should include portfolio cards');
assert.ok(html.includes('living-bg__star'), 'living background should include stars');
assert.ok(html.includes('living-bg__dot'), 'living background should include contribution dots');
assert.ok(html.includes('id="resume-empty-state"'), 'index should include animated empty state');
assert.ok(html.includes('Your future resume is waiting here'), 'empty state should use friendly waiting copy');

assert.ok(css.includes('pointer-events: none'), 'living background should not block interactions');
assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'living UI should respect reduced motion');
assert.ok(css.includes('will-change: transform'), 'animated elements should be GPU-friendly');
assert.ok(css.includes('[data-tilt]'), 'living UI should include tilt styles');
assert.ok(css.includes('living-rise'), 'living UI should include card rise animation');
assert.ok(css.includes('living-success-sweep'), 'living UI should include success state animation');
assert.ok(css.includes('.btn-dl:hover'), 'living UI should include button hover microinteractions');
assert.ok(css.includes('.stage.done::after'), 'living UI should animate completed stages');
assert.ok(css.includes('.resume-empty-state__spark'), 'living UI should include empty state illustration animation');
assert.ok(html.includes('data-flow="fetching"'), 'fetching stage should have living flow identity');
assert.ok(html.includes('data-flow="extracting"'), 'extracting stage should have living flow identity');
assert.ok(html.includes('data-flow="writing"'), 'writing stage should have living flow identity');
assert.ok(html.includes('data-flow="exporting"'), 'exporting stage should have living flow identity');
assert.ok(css.includes('living-flow-scan'), 'living UI should animate active generation flow');
assert.ok(css.includes('living-flow-ping'), 'living UI should animate active stage icon');
assert.ok(app.includes('initLivingUI'), 'app should initialize living UI behavior');
assert.ok(app.includes('function setEmptyStateVisible'), 'app should control empty state visibility');
assert.ok(app.includes('setEmptyStateVisible(false)'), 'app should hide empty state during generation');
assert.ok(app.includes('setEmptyStateVisible(true)'), 'app should restore empty state on start-over');

console.log('living UI tests passed');
