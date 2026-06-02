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
    removeEventListener() {},
    getContext(type) {
      assert.equal(type, '2d');
      return {
        clearRect() {},
        fillRect() {},
        strokeRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        arc() {},
        stroke() {},
        fillText() {}
      };
    }
  };
}

const documentStub = {
  listeners: {},
  createElement(tagName) {
    const el = makeElement(tagName);
    created.push(el);
    return el;
  },
  addEventListener(event, handler) {
    this.listeners[event] = handler;
  },
  removeEventListener(event) {
    delete this.listeners[event];
  }
};

global.requestAnimationFrame = () => 1;
global.cancelAnimationFrame = () => {};
global.document = documentStub;
global.localStorage = {
  values: {},
  getItem(key) {
    return this.values[key] || null;
  },
  setItem(key, value) {
    this.values[key] = value;
  }
};

const { createResumeRunner } = require('../assets/js/resume-runner');

const mount = makeElement('div');
const runner = createResumeRunner(mount, { width: 640, height: 220 });

assert.equal(mount.children.length, 1);
assert.equal(runner.canvas.width, 640);
assert.equal(runner.canvas.height, 220);
assert.equal(runner.status.textContent, 'Ready · Score 0 · Best 0');
assert.equal(runner.player.width, 34);
assert.equal(runner.player.height, 46);
assert.equal(runner.player.y, runner.groundY - runner.player.height);
assert.equal(runner.obstacleTypes.length, 4);
assert.deepEqual(runner.obstacleTypes.map(item => item.type), ['ats', 'link', 'deadline', 'error']);
assert.equal(runner.jumpButton.textContent, 'Jump');
assert.equal(runner.jumpButton.attributes['aria-label'], 'Jump over the next obstacle');
assert.equal(typeof runner.canvas.onpointerdown, 'function');
assert.equal(typeof runner.canvas.ontouchstart, 'function');
assert.equal(typeof documentStub.listeners.keydown, 'function');

assert.equal(runner.jump(), true);
assert.equal(runner.player.isJumping, true);
assert.equal(runner.jump(), false);
runner.updatePlayer();
assert.ok(runner.player.y < runner.groundY - runner.player.height);

for (let i = 0; i < 60; i += 1) runner.updatePlayer();
assert.equal(runner.player.isJumping, false);
assert.equal(runner.player.y, runner.groundY - runner.player.height);
runner.restart(false);

const obstacle = runner.spawnObstacle();
assert.equal(obstacle.type, 'ats');
const firstX = obstacle.x;
runner.updateObstacles();
assert.ok(obstacle.x < firstX);

runner.spawnTimer = 79;
runner.updateObstacles();
assert.ok(runner.obstacles.length >= 2);

runner.start();
assert.equal(runner.isRunning, true);
assert.equal(runner.score, 1);
assert.equal(runner.highScore, 1);
assert.equal(runner.status.textContent, 'Running · Score 1 · Best 1');
assert.equal(global.localStorage.values['easyresume.resumeRunner.highScore'], '1');

runner.pause();
assert.equal(runner.isRunning, false);
assert.equal(runner.status.textContent, 'Paused · Score 1 · Best 1');

assert.equal(runner.intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }), true);
assert.equal(runner.intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 20, width: 10, height: 10 }), false);

runner.obstacles = [{
  type: 'ats',
  x: runner.player.x,
  y: runner.player.y,
  width: runner.player.width,
  height: runner.player.height
}];
assert.equal(runner.checkCollisions(), true);
runner.gameOver();
assert.equal(runner.isGameOver, true);
assert.equal(runner.status.textContent, 'Needs retry · Score 1 · Best 1');

runner.restart(false);
assert.equal(runner.isGameOver, false);
assert.equal(runner.obstacles.length, 0);
assert.equal(runner.score, 0);
assert.equal(runner.status.textContent, 'Ready · Score 0 · Best 1');

runner.destroy();
assert.equal(runner.el.removed, true);

console.log('resume runner tests passed');
