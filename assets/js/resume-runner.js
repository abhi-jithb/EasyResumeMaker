(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeRunner = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  const DEFAULTS = {
    width: 720,
    height: 240,
    title: 'Resume Runner',
    message: 'Your internet is taking a break. Help your resume reach the interview.'
  };

  class ResumeRunner {
    constructor(target, options = {}) {
      if (!target) throw new Error('Resume Runner needs a mount element.');
      this.target = target;
      this.options = { ...DEFAULTS, ...options };
      this.isRunning = false;
      this.frameId = null;
      this.groundY = this.options.height - 44;
      this.player = {
        x: 64,
        y: this.groundY - 46,
        width: 34,
        height: 46,
        vy: 0,
        isJumping: false
      };
      this.physics = {
        gravity: 0.72,
        jumpVelocity: -12.5
      };
      this.speed = 5;
      this.spawnTimer = 0;
      this.obstacles = [];
      this.obstacleTypes = [
        { type: 'ats', label: 'ATS robot', width: 34, height: 38 },
        { type: 'link', label: 'Broken link', width: 32, height: 28 },
        { type: 'deadline', label: 'Deadline', width: 28, height: 42 },
        { type: 'error', label: 'Error icon', width: 30, height: 30 }
      ];
      this.mount();
      this.drawIdle();
      this.bindControls();
    }

    mount() {
      const doc = this.target.ownerDocument || root.document;
      this.el = doc.createElement('section');
      this.el.className = 'resume-runner';
      this.el.setAttribute('aria-label', 'Resume Runner offline game');

      const header = doc.createElement('div');
      header.className = 'resume-runner__header';

      const intro = doc.createElement('div');
      const title = doc.createElement('div');
      title.className = 'resume-runner__title';
      title.textContent = this.options.title;
      const message = doc.createElement('div');
      message.className = 'resume-runner__message';
      message.textContent = this.options.message;
      intro.append(title, message);

      this.status = doc.createElement('div');
      this.status.className = 'resume-runner__status';
      this.status.textContent = 'Ready';

      header.append(intro, this.status);

      this.canvas = doc.createElement('canvas');
      this.canvas.className = 'resume-runner__canvas';
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
      this.canvas.setAttribute('role', 'img');
      this.canvas.setAttribute('aria-label', 'Resume Runner game field');
      this.ctx = this.canvas.getContext('2d');

      this.actions = doc.createElement('div');
      this.actions.className = 'resume-runner__actions';

      this.startButton = doc.createElement('button');
      this.startButton.type = 'button';
      this.startButton.className = 'resume-runner__button';
      this.startButton.textContent = 'Start run';
      this.startButton.addEventListener('click', () => this.start());

      this.pauseButton = doc.createElement('button');
      this.pauseButton.type = 'button';
      this.pauseButton.className = 'resume-runner__button secondary';
      this.pauseButton.textContent = 'Pause';
      this.pauseButton.addEventListener('click', () => this.pause());

      this.actions.append(this.startButton, this.pauseButton);
      this.el.append(header, this.canvas, this.actions);
      this.target.append(this.el);
    }

    bindControls() {
      this.onKeyDown = (event) => {
        if (event.code !== 'Space' && event.key !== ' ') return;
        event.preventDefault();
        this.jump();
      };
      this.onPointerDown = () => this.jump();

      const doc = this.target.ownerDocument || root.document;
      if (doc && doc.addEventListener) doc.addEventListener('keydown', this.onKeyDown);
      this.canvas.addEventListener('pointerdown', this.onPointerDown);
      this.canvas.addEventListener('touchstart', this.onPointerDown);
    }

    drawIdle() {
      if (!this.ctx) return;
      const { width, height } = this.canvas;
      this.ctx.clearRect(0, 0, width, height);
      this.ctx.fillStyle = '#171720';
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.strokeStyle = '#2a2a35';
      this.ctx.beginPath();
      this.ctx.moveTo(24, height - 44);
      this.ctx.lineTo(width - 24, height - 44);
      this.ctx.stroke();
      this.drawPlayer();
      this.ctx.fillStyle = '#e8ff47';
      this.ctx.font = '20px sans-serif';
      this.ctx.fillText('Resume Runner', 28, 48);
      this.ctx.fillStyle = '#f0ede8';
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText('Press start, then help your resume reach the interview.', 28, 76);
      this.obstacles.forEach(obstacle => this.drawObstacle(obstacle));
    }

    drawPlayer() {
      if (!this.ctx) return;
      const p = this.player;
      this.ctx.fillStyle = '#f0ede8';
      this.ctx.fillRect(p.x, p.y, p.width, p.height);
      this.ctx.strokeStyle = '#111116';
      this.ctx.strokeRect(p.x, p.y, p.width, p.height);

      this.ctx.fillStyle = '#e8ff47';
      this.ctx.fillRect(p.x + p.width - 10, p.y, 10, 10);

      this.ctx.strokeStyle = '#2a2a35';
      for (let i = 0; i < 4; i += 1) {
        const lineY = p.y + 16 + (i * 7);
        this.ctx.beginPath();
        this.ctx.moveTo(p.x + 7, lineY);
        this.ctx.lineTo(p.x + p.width - 7, lineY);
        this.ctx.stroke();
      }

      this.ctx.fillStyle = '#47ffb2';
      this.ctx.fillRect(p.x + 6, p.y + p.height - 3, 9, 3);
      this.ctx.fillRect(p.x + 21, p.y + p.height - 3, 9, 3);
    }

    jump() {
      if (this.player.isJumping) return false;
      this.player.vy = this.physics.jumpVelocity;
      this.player.isJumping = true;
      if (!this.isRunning) this.start();
      return true;
    }

    updatePlayer() {
      const p = this.player;
      p.y += p.vy;
      p.vy += this.physics.gravity;

      const floor = this.groundY - p.height;
      if (p.y >= floor) {
        p.y = floor;
        p.vy = 0;
        p.isJumping = false;
      }
    }

    createObstacle(typeConfig = this.obstacleTypes[0]) {
      return {
        ...typeConfig,
        x: this.options.width + 20,
        y: this.groundY - typeConfig.height
      };
    }

    spawnObstacle() {
      const index = this.obstacles.length % this.obstacleTypes.length;
      const obstacle = this.createObstacle(this.obstacleTypes[index]);
      this.obstacles.push(obstacle);
      return obstacle;
    }

    updateObstacles() {
      this.spawnTimer += 1;
      if (this.spawnTimer >= 80) {
        this.spawnObstacle();
        this.spawnTimer = 0;
      }

      this.obstacles.forEach(obstacle => {
        obstacle.x -= this.speed;
      });
      this.obstacles = this.obstacles.filter(obstacle => obstacle.x + obstacle.width > -20);
    }

    drawObstacle(obstacle) {
      if (!this.ctx) return;
      this.ctx.fillStyle = '#ff6b47';
      this.ctx.strokeStyle = '#111116';

      if (obstacle.type === 'ats') {
        this.ctx.fillRect(obstacle.x, obstacle.y + 8, obstacle.width, obstacle.height - 8);
        this.ctx.strokeRect(obstacle.x, obstacle.y + 8, obstacle.width, obstacle.height - 8);
        this.ctx.fillStyle = '#e8ff47';
        this.ctx.fillRect(obstacle.x + 8, obstacle.y + 17, 5, 5);
        this.ctx.fillRect(obstacle.x + 21, obstacle.y + 17, 5, 5);
      } else if (obstacle.type === 'link') {
        this.ctx.strokeRect(obstacle.x, obstacle.y + 8, obstacle.width, 12);
        this.ctx.beginPath();
        this.ctx.moveTo(obstacle.x + 8, obstacle.y);
        this.ctx.lineTo(obstacle.x + obstacle.width - 8, obstacle.y + obstacle.height);
        this.ctx.stroke();
      } else if (obstacle.type === 'deadline') {
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        this.ctx.fillStyle = '#111116';
        this.ctx.fillText('!', obstacle.x + 10, obstacle.y + 26);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(obstacle.x + 15, obstacle.y + 15, 14, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#111116';
        this.ctx.fillText('x', obstacle.x + 11, obstacle.y + 20);
      }
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.status.textContent = 'Running';
      this.loop();
    }

    pause() {
      this.isRunning = false;
      this.status.textContent = 'Paused';
      if (this.frameId && root.cancelAnimationFrame) {
        root.cancelAnimationFrame(this.frameId);
      }
      this.frameId = null;
    }

    loop() {
      if (!this.isRunning) return;
      this.updatePlayer();
      this.updateObstacles();
      this.drawIdle();
      if (root.requestAnimationFrame) {
        this.frameId = root.requestAnimationFrame(() => this.loop());
      }
    }

    destroy() {
      this.pause();
      const doc = this.target.ownerDocument || root.document;
      if (doc && doc.removeEventListener && this.onKeyDown) {
        doc.removeEventListener('keydown', this.onKeyDown);
      }
      if (this.el) this.el.remove();
    }
  }

  function createResumeRunner(target, options) {
    return new ResumeRunner(target, options);
  }

  return {
    ResumeRunner,
    createResumeRunner
  };
});
