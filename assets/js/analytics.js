(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeAnalytics = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  const ALLOWED_PROPS = new Set(['template', 'source_type', 'error_code', 'stage']);

  function cleanProps(props) {
    const safe = {};
    for (const [key, value] of Object.entries(props || {})) {
      if (!ALLOWED_PROPS.has(key)) continue;
      if (value === undefined || value === null || value === '') continue;
      safe[key] = String(value).slice(0, 80);
    }
    return safe;
  }

  function track(eventName, props) {
    const name = String(eventName || '').trim();
    if (!name) return;
    const safeProps = cleanProps(props);

    if (typeof root?.va === 'function') {
      root.va('event', { name, data: safeProps });
    }
  }

  return {
    cleanProps,
    track
  };
});
