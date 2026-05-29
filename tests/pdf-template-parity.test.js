const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const app = fs.readFileSync('assets/js/app.js', 'utf8');
const docs = [];

function makeElement() {
  return {
    value: '',
    textContent: '',
    innerHTML: '',
    disabled: false,
    dataset: {},
    style: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; }
    },
    addEventListener() {},
    setAttribute() {},
    querySelector() { return makeElement(); },
    scrollIntoView() {},
    focus() {}
  };
}

function JsPDF() {
  this.texts = [];
  this.saved = false;
  docs.push(this);
}

JsPDF.prototype = {
  setFont() {},
  setFontSize() {},
  setTextColor() {},
  setDrawColor() {},
  setFillColor() {},
  setLineWidth() {},
  line() {},
  rect() {},
  addPage() {},
  splitTextToSize(value) {
    return Array.isArray(value) ? value.map(String) : [String(value)];
  },
  text(value) {
    if (Array.isArray(value)) {
      value.forEach(item => this.texts.push(String(item)));
      return;
    }
    this.texts.push(String(value));
  },
  save() {
    this.saved = true;
  }
};

const context = {
  console,
  setTimeout() {},
  localStorage: {
    getItem() { return null; },
    setItem() {}
  },
  navigator: {},
  document: {
    body: makeElement(),
    createElement: makeElement,
    execCommand() { return true; },
    getElementById() { return makeElement(); },
    querySelector() { return makeElement(); },
    querySelectorAll() { return []; },
    addEventListener() {}
  },
  window: {
    jspdf: { jsPDF: JsPDF },
    EasyResumePdf: {
      buildResumeFilename() {
        return 'resume.pdf';
      }
    },
    EasyResumeAnalytics: {
      track() {}
    },
    EasyResumeLoading: {
      getGenerateButtonLabel() {
        return 'Generate';
      }
    },
    EasyResumeErrors: {
      apiErrorMessage(error) {
        return error.message;
      }
    },
    EasyResumeUrl: {},
    EasyResumeSource: {},
    EasyResumeState: {}
  }
};

context.globalThis = context;
vm.createContext(context);
vm.runInContext(app, context);

const sampleResume = {
  name: 'Arya Shah',
  contact: {
    phone: '+1 555 0100',
    email: 'arya@example.com',
    location: 'Remote',
    links: ['https://arya.dev']
  },
  about: 'Builds reliable web tools for hiring teams.',
  experience: [
    {
      role: 'Frontend Engineer',
      organization: 'Northstar Labs',
      location: 'Remote',
      duration: '2024 - Present',
      points: ['Built accessible dashboards.']
    }
  ],
  projects: [
    {
      name: 'ResumeForge',
      description: 'Created a resume generator.',
      tech: 'Vanilla JS, jsPDF',
      points: ['Implemented PDF export.']
    }
  ],
  achievements: ['Won hackathon.'],
  skills: {
    languages: ['JavaScript'],
    tools: ['jsPDF'],
    soft_skills: ['Mentoring']
  },
  languages_spoken: ['English'],
  education: [
    {
      degree: 'B.Tech Computer Science',
      institution: 'State University',
      duration: '2020 - 2024'
    }
  ],
  leadership_community: [
    {
      role: 'Organizer',
      organization: 'Dev Club',
      duration: '2023',
      points: ['Mentored student builders.']
    }
  ]
};

const expectedFragments = [
  'arya@example.com',
  'https://arya.dev',
  'Builds reliable web tools',
  'Frontend Engineer',
  'Northstar Labs',
  'Built accessible dashboards',
  'ResumeForge',
  'Vanilla JS',
  'Implemented PDF export',
  'Won hackathon',
  'JavaScript',
  'jsPDF',
  'Mentoring',
  'English',
  'B.Tech Computer Science',
  'State University',
  'Organizer',
  'Dev Club',
  'Mentored student builders'
];

['minimal', 'compact', 'modern', 'classic'].forEach(template => {
  docs.length = 0;
  vm.runInContext(
    `resumeData = ${JSON.stringify(sampleResume)}; selectedTemplate = '${template}'; downloadPDF();`,
    context
  );

  assert.equal(docs.length, 1, `${template} should create one PDF`);
  assert.equal(docs[0].saved, true, `${template} should save the PDF`);

  const text = docs[0].texts.join('\n');
  expectedFragments.forEach(fragment => {
    assert.ok(text.includes(fragment), `${template} PDF should include ${fragment}`);
  });
});

console.log('pdf template parity tests passed');
