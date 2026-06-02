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

assert.ok(notFound.includes('404 - Your Resume Took a Wrong Turn'), '404 page should use the custom wrong-turn title');
assert.ok(notFound.includes('We searched GitHub, portfolios, blogs, and recruiter inboxes.'), '404 page should include required description');
assert.ok(notFound.includes('Generate Resume'), '404 page should link to resume generation');
assert.ok(notFound.includes('<svg'), '404 page should include an SVG illustration');
assert.ok(notFound.includes('resume-run'), '404 page should include animated resume character');
assert.ok(notFound.includes('ats-bot'), '404 page should include ATS robot');
assert.ok(notFound.includes('404 link'), '404 page should include broken link sign');
assert.ok(notFound.includes('Interview'), '404 page should include interview room door');
assert.ok(notFound.includes('steam'), '404 page should include coffee steam');
assert.ok(notFound.includes('prefers-reduced-motion'), '404 page should respect reduced motion');
assert.ok(notFound.includes('@media (max-width: 820px)'), '404 page should adapt for tablets');
assert.ok(notFound.includes('@media (max-width: 520px)'), '404 page should adapt for mobile');
assert.ok(notFound.includes('@media (max-width: 360px)'), '404 page should adapt for narrow phones');
assert.ok(notFound.includes('@media (min-width: 1280px)'), '404 page should adapt for large screens');
assert.ok(notFound.includes('max-height: min(62vh, 560px)'), '404 illustration should be viewport constrained');
assert.ok(notFound.includes('prefers-color-scheme: light'), '404 page should follow system light mode');
assert.ok(notFound.includes('body.light-mode'), '404 page should support manual light mode');
assert.ok(notFound.includes('id="themeToggle404"'), '404 page should include a theme toggle');
assert.ok(notFound.includes("localStorage.getItem('theme')"), '404 page should reuse saved theme preference');
assert.ok(notFound.includes('Switch to dark theme'), '404 theme toggle should expose state to assistive tech');
assert.ok(notFound.includes('pointermove'), '404 page should include cursor parallax');
assert.ok(notFound.includes('progress-route'), '404 page should animate the route toward the interview');
assert.ok(notFound.includes('@keyframes route-flow'), '404 route animation should be CSS-only');
assert.ok(notFound.includes('interview-door'), '404 page should animate the interview door');
assert.ok(notFound.includes('broken-sign'), '404 page should animate the broken link sign');
assert.ok(notFound.includes('messages = ['), '404 page should rotate status messages');
assert.ok(notFound.includes('ATS bot says'), '404 page should include ATS bot easter egg');

console.log('resume runner integration tests passed');
