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
    rate_limited: 'Tiny traffic jam at resume HQ 🚦. Give it a few minutes, then we can try again.',
    server_misconfigured: 'The resume engine is missing its backstage pass. Add the provider API key in the deployment environment.',
    missing_input: 'I need a little more to work with 👀. Try a fuller portfolio, GitHub profile, Dev.to profile, Hashnode blog, or public personal website.',
    invalid_ai_json: 'The resume draft came back speaking in riddles. Let’s ask for a cleaner version.',
    method_not_allowed: 'That button tried to use the wrong door. Refresh the page and try again.',
    ai_failed: 'Looks like our resume robot dropped its coffee ☕. Let’s try that again.'
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
    return `Your internet, that page, or our reader took a small nap 😴. Make sure the URL is public, readable without login, and has visible resume content.${detail}`;
  }

  function lowContentMessage(characterCount) {
    return [
      'This page is playing a little too hard to get.',
      `We found only ${characterCount} characters, which is not enough to build a resume we would trust.`,
      '',
      'Try a source with more visible text, such as:',
      '  - github.com/your-username',
      '  - dev.to/your-username',
      '  - hashnode.dev/@your-username',
      '  - a public portfolio, blog, or personal website with visible project and experience text'
    ].join('\n');
  }

  function aiGenerationErrorMessage(error) {
    return `The AI got a little tangled in the resume yarn 🧶. ${apiErrorMessage(error)}`;
  }

  function pdfErrorMessage(error) {
    const detail = error?.message ? ` (${error.message})` : '';
    return `The PDF press jammed for a second 📄. Your preview is safe, so please try downloading again.${detail}`;
  }

  return {
    aiGenerationErrorMessage,
    apiErrorMessage,
    fetchErrorMessage,
    lowContentMessage,
    pdfErrorMessage
  };
});
