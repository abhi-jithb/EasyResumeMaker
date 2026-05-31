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
      this.mount();
      this.drawIdle();
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
      this.ctx.fillStyle = '#e8ff47';
      this.ctx.font = '20px sans-serif';
      this.ctx.fillText('Resume Runner', 28, 48);
      this.ctx.fillStyle = '#f0ede8';
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText('Press start, then help your resume reach the interview.', 28, 76);
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
      this.drawIdle();
      if (root.requestAnimationFrame) {
        this.frameId = root.requestAnimationFrame(() => this.loop());
      }
    }

    destroy() {
      this.pause();
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
