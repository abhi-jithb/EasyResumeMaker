(function () {
  async function postJson(path, payload) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      data = null;
    }

    if (!res.ok) {
      const apiError = new Error(data?.error?.message || 'AI request failed.');
      apiError.code = data?.error?.code || 'ai_failed';
      apiError.status = res.status;
      throw apiError;
    }

    return data;
  }

  window.EasyResumeAI = {
    async generateResume(rawText) {
      return postJson('/api/ai/resume-generate', { rawText });
    },

    async improveText(text) {
      return postJson('/api/ai/resume-improve', { text });
    }
  };
})();
