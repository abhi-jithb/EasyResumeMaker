function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function sendError(res, statusCode, code, message) {
  sendJson(res, statusCode, {
    error: {
      code,
      message
    }
  });
}

async function readJsonBody(req) {
  try {
    if (req.body && typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    error.code = 'invalid_json';
    error.message = 'Request body must be valid JSON.';
    throw error;
  }
}

module.exports = {
  readJsonBody,
  sendError,
  sendJson
};
