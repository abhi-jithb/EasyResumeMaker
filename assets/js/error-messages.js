(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.EasyResumeErrors = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const API_MESSAGES = {
    rate_limited: 'Too many AI requests. Please wait a few minutes, then try again.',
    server_misconfigured: 'The AI service is not configured yet. Add the provider API key in the deployment environment.',
    missing_input: 'There is not enough content for the AI to work with. Try a fuller portfolio, GitHub profile, or Read.cv page.',
    invalid_ai_json: 'The AI returned a response we could not read. Please try again.',
    method_not_allowed: 'That action is not available from this page.',
    ai_failed: 'The AI service could not complete the request. Please try again in a moment.'
  };

  function apiErrorMessage(error) {
    if (!error) return API_MESSAGES.ai_failed;
    if (error.code && API_MESSAGES[error.code]) return API_MESSAGES[error.code];
    if (error.status === 429) return API_MESSAGES.rate_limited;
    if (error.status >= 500) return API_MESSAGES.ai_failed;
    return error.message || API_MESSAGES.ai_failed;
  }

  function fetchErrorMessage(error) {
    const detail = error?.message ? ` (${error.message})` : '';
    return `Could not read that URL. Make sure it is public, not blocked by login, and has visible resume content.${detail}`;
  }

  function lowContentMessage(characterCount) {
    return [
      'This page may be JavaScript-rendered or too sparse to build a resume.',
      `Only ${characterCount} characters were extracted, which is not enough for reliable resume generation.`,
      '',
      'Try one of these instead:',
      '  - github.com/your-username',
      '  - read.cv/your-username',
      '  - dev.to/your-username',
      '  - hashnode.dev/@your-username',
      '  - a public portfolio page with visible project and experience text'
    ].join('\n');
  }

  return {
    apiErrorMessage,
    fetchErrorMessage,
    lowContentMessage
  };
});
