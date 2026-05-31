const assert = require('assert');

const created = [];

function makeElement(tagName) {
  return {
    tagName,
    children: [],
    className: '',
    textContent: '',
    width: 0,
    height: 0,
    attributes: {},
    ownerDocument: documentStub,
    style: {},
    append(...items) {
      this.children.push(...items);
    },
    remove() {
      this.removed = true;
    },
    setAttribute(key, value) {
      this.attributes[key] = value;
    },
    addEventListener(event, handler) {
      this[`on${event}`] = handler;
    },
    getContext(type) {
      assert.equal(type, '2d');
      return {
        clearRect() {},
        fillRect() {},
        strokeRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
        fillText() {}
      };
    }
  };
}

const documentStub = {
  createElement(tagName) {
    const el = makeElement(tagName);
    created.push(el);
    return el;
  }
};

global.requestAnimationFrame = () => 1;
global.cancelAnimationFrame = () => {};
global.document = documentStub;

const { createResumeRunner } = require('../assets/js/resume-runner');

const mount = makeElement('div');
const runner = createResumeRunner(mount, { width: 640, height: 220 });

assert.equal(mount.children.length, 1);
assert.equal(runner.canvas.width, 640);
assert.equal(runner.canvas.height, 220);
assert.equal(runner.status.textContent, 'Ready');
assert.equal(runner.player.width, 34);
assert.equal(runner.player.height, 46);
assert.equal(runner.player.y, runner.groundY - runner.player.height);

runner.start();
assert.equal(runner.isRunning, true);
assert.equal(runner.status.textContent, 'Running');

runner.pause();
assert.equal(runner.isRunning, false);
assert.equal(runner.status.textContent, 'Paused');

runner.destroy();
assert.equal(runner.el.removed, true);

console.log('resume runner tests passed');
