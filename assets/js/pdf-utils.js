(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumePdf = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function buildResumeFilename(name, template) {
    const safeName = String(name || 'resume')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'resume';

    const safeTemplate = String(template || 'template')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'template';

    return `${safeName}-${safeTemplate}-resume.pdf`;
  }

  return {
    buildResumeFilename
  };
});
