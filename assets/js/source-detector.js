(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeSource = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function parseHostname(value) {
    const input = String(value || '').trim();
    if (!input) return '';
    const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`;
    try {
      return new URL(withProtocol).hostname.toLowerCase().replace(/^www\./, '');
    } catch (error) {
      return '';
    }
  }

  function detectSource(value) {
    const hostname = parseHostname(value);
    if (!hostname) return { type: 'unknown', label: 'Unknown source' };

    if (hostname === 'github.com') return { type: 'github', label: 'GitHub profile or repository' };
    if (hostname === 'linkedin.com') return { type: 'linkedin', label: 'LinkedIn public profile' };
    if (hostname === 'dev.to') return { type: 'devto', label: 'Dev.to profile or article' };
    if (hostname === 'hashnode.dev' || hostname.endsWith('.hashnode.dev')) return { type: 'hashnode', label: 'Hashnode profile or blog' };
    if (hostname === 'read.cv') return { type: 'readcv', label: 'Read.cv profile' };

    return { type: 'portfolio', label: 'Portfolio or public website' };
  }

  return {
    detectSource
  };
});
