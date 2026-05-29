(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeState = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function hasValues(value) {
    if (!value) return false;
    if (Array.isArray(value)) return value.some(hasValues);
    if (typeof value === 'object') return Object.values(value).some(hasValues);
    return String(value).trim().length > 0;
  }

  function hasResumeContent(data) {
    if (!data || typeof data !== 'object') return false;
    return [
      data.about,
      data.summary,
      data.experience,
      data.projects,
      data.achievements,
      data.skills,
      data.education,
      data.leadership_community
    ].some(hasValues);
  }

  function getResumeEmptyMessage() {
    return 'We could not find enough resume-ready content in this source. Try a GitHub profile, Read.cv page, or portfolio with visible projects, skills, and experience.';
  }

  return {
    getResumeEmptyMessage,
    hasResumeContent
  };
});
