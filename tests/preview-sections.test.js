const assert = require('assert');
const fs = require('fs');
const app = fs.readFileSync('assets/js/app.js', 'utf8');

assert.ok(app.includes('const projects ='), 'preview should build project markup');
assert.ok(app.includes('const leadership ='), 'preview should build leadership/community markup');
assert.ok(app.includes('<div class="rf-section">Projects</div>'), 'preview should render Projects section');
assert.ok(app.includes('<div class="rf-section">Leadership / Community</div>'), 'preview should render Leadership / Community section');

const about = '<div class="rf-section">About Me</div>';
const experience = '<div class="rf-section">Experience</div>';
const projects = '<div class="rf-section">Projects</div>';
const skills = '<div class="rf-section">Technical Skills</div>';
const education = '<div class="rf-section">Education</div>';
const leadership = '<div class="rf-section">Leadership / Community</div>';

assert.ok(
  app.indexOf(about) < app.indexOf(experience) &&
  app.indexOf(experience) < app.indexOf(projects) &&
  app.indexOf(projects) < app.indexOf(skills) &&
  app.indexOf(education) < app.indexOf(leadership),
  'preview sections should follow recruiter-friendly order'
);

console.log('preview section tests passed');
