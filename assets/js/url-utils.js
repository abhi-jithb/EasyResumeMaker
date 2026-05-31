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
  const UNSUPPORTED_HOSTS = new Set(['linkedin.com', 'www.linkedin.com']);

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
      return { ok: false, message: 'Your resume needs a place to start 👀. Paste a public portfolio, GitHub profile, Dev.to, Hashnode, blog, or personal website URL.' };
    }

    if (/\s/.test(input)) {
      return { ok: false, message: 'That link brought a few extra passengers. Paste one clean public URL without spaces.' };
    }

    const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`;

    let parsed;
    try {
      parsed = new URL(withProtocol);
    } catch (error) {
      return { ok: false, message: 'That link looks a little scrambled. Try something like github.com/your-username.' };
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { ok: false, message: 'I can only read regular public web links: http or https.' };
    }

    if (parsed.username || parsed.password) {
      return { ok: false, message: 'For your safety, remove usernames, passwords, or tokens from the URL before generating a resume.' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (UNSUPPORTED_HOSTS.has(hostname)) {
      return { ok: false, message: 'That source is camera-shy and not supported. Use a GitHub profile, public portfolio, Dev.to, Hashnode, public blog, or personal website instead.' };
    }

    if (PRIVATE_HOSTS.has(hostname) || isPrivateIPv4(hostname)) {
      return { ok: false, message: 'That URL lives on a private island. Use a public link we can actually read.' };
    }

    if (!hostname.includes('.') && !hostname.startsWith('[')) {
      return { ok: false, message: 'That URL needs a real public domain, like github.com/your-username.' };
    }

    parsed.hash = '';
    return { ok: true, url: parsed.toString() };
  }

  return {
    normalizePublicUrl
  };
});
