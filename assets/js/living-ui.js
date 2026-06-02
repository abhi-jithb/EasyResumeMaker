(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeLivingUI = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  function prefersReducedMotion() {
    return Boolean(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function supportsFinePointer() {
    return Boolean(root.matchMedia && root.matchMedia('(pointer: fine)').matches);
  }

  function initLivingUI(doc = root.document) {
    if (!doc || prefersReducedMotion()) return { enabled: false };

    const bgItems = Array.from(doc.querySelectorAll('[data-depth]'));
    const tiltItems = Array.from(doc.querySelectorAll('[data-tilt]'));
    if (!bgItems.length && !tiltItems.length) return { enabled: false };

    let frame = null;
    let pointer = { x: 0, y: 0 };

    function applyParallax() {
      frame = null;
      bgItems.forEach(item => {
        const depth = Number(item.dataset.depth || 0);
        const x = pointer.x * depth;
        const y = pointer.y * depth;
        item.style.setProperty('--living-x', `${x.toFixed(2)}px`);
        item.style.setProperty('--living-y', `${y.toFixed(2)}px`);
      });
    }

    function onPointerMove(event) {
      const width = root.innerWidth || 1;
      const height = root.innerHeight || 1;
      pointer = {
        x: (event.clientX / width) - 0.5,
        y: (event.clientY / height) - 0.5
      };
      if (!frame && root.requestAnimationFrame) {
        frame = root.requestAnimationFrame(applyParallax);
      }
    }

    function bindTilt(item) {
      item.addEventListener('pointermove', event => {
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) - 0.5;
        const y = ((event.clientY - rect.top) / rect.height) - 0.5;
        item.style.setProperty('--tilt-x', `${(-y * 3).toFixed(2)}deg`);
        item.style.setProperty('--tilt-y', `${(x * 4).toFixed(2)}deg`);
      });
      item.addEventListener('pointerleave', () => {
        item.style.setProperty('--tilt-x', '0deg');
        item.style.setProperty('--tilt-y', '0deg');
      });
    }

    if (supportsFinePointer()) {
      doc.addEventListener('pointermove', onPointerMove, { passive: true });
      tiltItems.forEach(bindTilt);
    }

    return {
      enabled: true,
      bgItems,
      tiltItems
    };
  }

  return {
    initLivingUI,
    prefersReducedMotion,
    supportsFinePointer
  };
});
