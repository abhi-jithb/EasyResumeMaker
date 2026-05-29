const assert = require('assert');
const { buildImprovePrompt } = require('../api/lib/prompts');

const prompt = buildImprovePrompt('Built a Flutter app for attendance.');
const combined = `${prompt.system}\n${prompt.user}`;

assert.ok(prompt.user.includes('Built a Flutter app for attendance.'));
assert.ok(combined.includes('ATS-friendly'));
assert.ok(combined.includes('strong action verb'));
assert.ok(combined.includes('Never invent metrics'));
assert.ok(combined.includes('Do not add tools'));
assert.ok(combined.includes('one concise'));
assert.ok(combined.includes('recruiter-readable'));
assert.ok(combined.includes('no bullets'));

const sparsePrompt = buildImprovePrompt('Helped club.');
assert.ok(sparsePrompt.system.includes('truthful'));
assert.ok(sparsePrompt.system.includes('source text'));

console.log('improver prompt tests passed');
