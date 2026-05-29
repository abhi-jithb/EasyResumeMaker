const assert = require('assert');
const { getResumeEmptyMessage, hasResumeContent } = require('../assets/js/resume-state');

assert.equal(hasResumeContent(null), false);
assert.equal(hasResumeContent({ name: 'Asha Rao', contact: { links: ['https://example.com'] } }), false);
assert.equal(hasResumeContent({ about: 'Flutter developer.' }), true);
assert.equal(hasResumeContent({ experience: [{ role: 'Intern', points: ['Built UI components.'] }] }), true);
assert.equal(hasResumeContent({ projects: [{ name: 'Attendly' }] }), true);
assert.equal(hasResumeContent({ skills: { languages: ['Dart'] } }), true);
assert.equal(hasResumeContent({ leadership_community: [{ role: 'Organizer' }] }), true);
assert.ok(getResumeEmptyMessage().includes('resume-ready content'));

console.log('resume state tests passed');
