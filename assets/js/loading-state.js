(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeLoading = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const LABELS = {
    idle: 'Generate ->',
    fetch: 'Reading profile...',
    parse: 'Connecting dots...',
    build: 'Writing bullets...',
    pdf: 'Preparing preview...'
  };

  function getGenerateButtonLabel(state) {
    return LABELS[state] || LABELS.idle;
  }

  return {
    getGenerateButtonLabel
  };
});
