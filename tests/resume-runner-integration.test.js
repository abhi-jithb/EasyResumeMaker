const assert = require('assert');
const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('assets/js/app.js', 'utf8');
const offline = fs.readFileSync('offline.html', 'utf8');
const notFound = fs.readFileSync('404.html', 'utf8');

assert.ok(index.includes('assets/css/resume-runner.css'), 'main page should load runner styles');
assert.ok(index.includes('assets/js/resume-runner.js'), 'main page should load runner script');
assert.ok(index.includes('id="resume-runner-host"'), 'main page should include a runner host');

assert.ok(app.includes('function showResumeRunner'), 'app should expose a runner trigger');
assert.ok(app.includes('fetch_failed'), 'runner should be tied to network fetch failures');
assert.ok(app.includes('hideResumeRunner();'), 'runner should hide on retry/start-over');

assert.ok(offline.includes('Resume Runner'), 'offline page should include Resume Runner');
assert.ok(offline.includes('window.location.reload()'), 'offline page should include retry action');
assert.ok(offline.includes('assets/js/resume-runner.js'), 'offline page should reuse runner module');

assert.ok(notFound.includes('Lost Resume Mode'), '404 page should use playful not-found messaging');
assert.ok(notFound.includes('Generate Resume'), '404 page should link to resume generation');
assert.ok(notFound.includes('assets/js/resume-runner.js'), '404 page should reuse runner module');

console.log('resume runner integration tests passed');
