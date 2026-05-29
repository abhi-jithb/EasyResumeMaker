(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeUrl = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const PRIVATE_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

  function isPrivateIPv4(hostname) {
    const parts = hostname.split('.').map(Number);
    if (parts.length !== 4 || parts.some(part => Number.isNaN(part) || part < 0 || part > 255)) {
      return false;
    }

    return parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168);
  }

  function normalizePublicUrl(value) {
    const input = String(value || '').trim();
    if (!input) {
      return { ok: false, message: 'Please enter a public URL — your portfolio, GitHub profile, or similar.' };
    }

    if (/\s/.test(input)) {
      return { ok: false, message: 'That URL has spaces in it. Paste a single public link and try again.' };
    }

    const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`;

    let parsed;
    try {
      parsed = new URL(withProtocol);
    } catch (error) {
      return { ok: false, message: 'That URL does not look valid. Try a link like github.com/your-username.' };
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { ok: false, message: 'Only public http and https links can be used.' };
    }

    if (parsed.username || parsed.password) {
      return { ok: false, message: 'Remove usernames, passwords, or tokens from the URL before generating a resume.' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (PRIVATE_HOSTS.has(hostname) || isPrivateIPv4(hostname)) {
      return { ok: false, message: 'Use a public URL, not a localhost or private network address.' };
    }

    if (!hostname.includes('.') && !hostname.startsWith('[')) {
      return { ok: false, message: 'That URL needs a public domain, like github.com/your-username.' };
    }

    parsed.hash = '';
    return { ok: true, url: parsed.toString() };
  }

  return {
    normalizePublicUrl
  };
});
