const assert = require('assert');
const { buildResumePrompt } = require('../api/lib/prompts');

const cases = [
  {
    name: 'GitHub profile content',
    content: [
      'GitHub profile: Asha Rao',
      'Bio: Flutter developer and open-source contributor.',
      'Pinned repositories: attendly - Flutter attendance app using Firebase auth and Firestore.',
      'Repo description: timetable-cli - Node.js command line timetable generator.'
    ].join('\n'),
    expectedTerms: ['GitHub', 'repositories', 'open-source', 'projects']
  },
  {
    name: 'Portfolio content',
    content: [
      'Portfolio for Marcus Chen, frontend engineer.',
      'Projects include ecommerce dashboard built with React and analytics charts.',
      'Experience: intern at BrightApps, maintained UI components and fixed accessibility issues.'
    ].join('\n'),
    expectedTerms: ['portfolio', 'React', 'accessibility', 'experience']
  },
  {
    name: 'Minimal student profile',
    content: [
      'Nila P. Computer science student.',
      'Skills: Java, HTML, CSS.',
      'Project: library management system for coursework.'
    ].join('\n'),
    expectedTerms: ['minimal student profiles', 'humble', 'specific']
  },
  {
    name: 'Community-focused profile',
    content: [
      'Samir Khan organizes campus coding meetups.',
      'Mentored beginners in Python and contributed documentation to local open-source group.',
      'Speaker at student developer club events.'
    ].join('\n'),
    expectedTerms: ['leadership_community', 'mentoring', 'speaking', 'organizing']
  }
];

for (const fixture of cases) {
  const prompt = buildResumePrompt(fixture.content);
  const combined = `${prompt.system}\n${prompt.user}`;

  assert.ok(prompt.user.includes(fixture.content), `${fixture.name} should include source content`);
  assert.ok(combined.includes('Never invent metrics'), `${fixture.name} should prohibit invented metrics`);
  assert.ok(combined.includes('ATS-friendly'), `${fixture.name} should include ATS language`);
  assert.ok(combined.includes('Avoid repetitive opening verbs'), `${fixture.name} should prevent repetitive bullets`);
  assert.ok(combined.includes('Summary, Experience, Projects, Skills, Education, Leadership / Community'), `${fixture.name} should define section ordering`);

  for (const term of fixture.expectedTerms) {
    assert.ok(combined.toLowerCase().includes(term.toLowerCase()), `${fixture.name} should include "${term}" guidance`);
  }
}

const prompt = buildResumePrompt('Built a Flutter app for attendance.');
assert.ok(prompt.user.includes('"projects"'), 'schema should include projects');
assert.ok(prompt.user.includes('"leadership_community"'), 'schema should include leadership/community');
assert.ok(prompt.user.indexOf('"about"') < prompt.user.indexOf('"experience"'), 'summary should appear before experience');
assert.ok(prompt.user.indexOf('"experience"') < prompt.user.indexOf('"projects"'), 'experience should appear before projects');
assert.ok(prompt.user.indexOf('"projects"') < prompt.user.indexOf('"skills"'), 'projects should appear before skills');
assert.ok(prompt.user.indexOf('"skills"') < prompt.user.indexOf('"education"'), 'skills should appear before education');
assert.ok(prompt.user.indexOf('"education"') < prompt.user.indexOf('"leadership_community"'), 'education should appear before leadership/community');

console.log('prompt rules tests passed');
