const assert = require('assert');

const listeners = {};

function makeElement(dataset = {}) {
  return {
    dataset,
    style: {
      values: {},
      setProperty(key, value) {
        this.values[key] = value;
      }
    },
    listeners: {},
    addEventListener(event, handler) {
      this.listeners[event] = handler;
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 100, height: 100 };
    }
  };
}

const bg = makeElement({ depth: '20' });
const tilt = makeElement({});

global.innerWidth = 1000;
global.innerHeight = 500;
global.requestAnimationFrame = callback => {
  callback();
  return 1;
};
global.matchMedia = query => ({
  matches: query.includes('pointer: fine')
});
global.document = {
  querySelectorAll(selector) {
    if (selector === '[data-depth]') return [bg];
    if (selector === '[data-tilt]') return [tilt];
    return [];
  },
  addEventListener(event, handler) {
    listeners[event] = handler;
  }
};

const { initLivingUI } = require('../assets/js/living-ui');

const result = initLivingUI(global.document);
assert.equal(result.enabled, true);
assert.equal(result.bgItems.length, 1);
assert.equal(result.tiltItems.length, 1);
assert.equal(typeof listeners.pointermove, 'function');
assert.equal(typeof tilt.listeners.pointermove, 'function');

listeners.pointermove({ clientX: 750, clientY: 375 });
assert.equal(bg.style.values['--living-x'], '5.00px');
assert.equal(bg.style.values['--living-y'], '5.00px');

tilt.listeners.pointermove({ clientX: 100, clientY: 0 });
assert.equal(tilt.style.values['--tilt-x'], '1.50deg');
assert.equal(tilt.style.values['--tilt-y'], '2.00deg');

tilt.listeners.pointerleave();
assert.equal(tilt.style.values['--tilt-x'], '0deg');
assert.equal(tilt.style.values['--tilt-y'], '0deg');

console.log('living UI behavior tests passed');
