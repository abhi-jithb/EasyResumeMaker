const assert = require('assert');
const { buildResumeFilename } = require('../assets/js/pdf-utils');

assert.equal(buildResumeFilename('Asha Rao', 'minimal'), 'asha-rao-minimal-resume.pdf');
assert.equal(buildResumeFilename('Ana María Núñez', 'modern'), 'ana-maria-nunez-modern-resume.pdf');
assert.equal(buildResumeFilename('Dev / Designer @ 2026!', 'classic'), 'dev-designer-2026-classic-resume.pdf');
assert.equal(buildResumeFilename('', ''), 'resume-template-resume.pdf');
assert.equal(buildResumeFilename('A'.repeat(100), 'minimal'), `${'a'.repeat(60)}-minimal-resume.pdf`);

console.log('pdf utils tests passed');
