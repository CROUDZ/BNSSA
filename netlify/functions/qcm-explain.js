'use strict';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_MODEL = 'gemini-1.5-flash';

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const formatAnswers = (answers) =>
  Object.entries(answers || {})
    .filter(([, text]) => typeof text === 'string' && text.trim().length > 0)
    .map(([key, text]) => `${key}: ${text}`)
    .join('\n');

const buildPrompt = (payload) => {
  const quiz = payload.quizTitle ? `QCM: ${payload.quizTitle}\n` : '';
  const answers = formatAnswers(payload.answers);
  const correct = payload.correctAnswers.join(', ');
  const selected = payload.selectedAnswers?.length
    ? payload.selectedAnswers.join(', ')
    : 'Aucune';

  return (
    `${quiz}` +
    `Question: ${payload.question}\n` +
    `Propositions:\n${answers}\n\n` +
    `Reponses correctes: ${correct}\n` +
    `Reponses de l'utilisateur: ${selected}\n\n` +
    'Explique pourquoi les bonnes reponses sont correctes et, si besoin, pourquoi les mauvaises le sont moins. ' +
    'Reponse en francais, ton pedagogique, 4 a 6 phrases courtes maximum. ' +
    'Ne mentionne pas que tu es une IA.'
  );
};

const callGroq = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing GROQ_API_KEY');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 320,
      messages: [
        {
          role: 'system',
          content:
            'Tu es un formateur BNSSA. Tu expliques clairement et sans digression.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq error: ${text}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Groq empty response');
  return content;
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 320,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini error: ${text}`);
  }

  const data = await response.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!content) throw new Error('Gemini empty response');
  return content;
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON payload' });
  }

  if (
    !payload?.question ||
    !payload?.answers ||
    !Array.isArray(payload?.correctAnswers) ||
    payload.correctAnswers.length === 0
  ) {
    return jsonResponse(400, { error: 'Invalid request body' });
  }

  const prompt = buildPrompt(payload);

  try {
    const explanation = await callGroq(prompt);
    return jsonResponse(200, { explanation, provider: 'groq' });
  } catch {
    try {
      const explanation = await callGemini(prompt);
      return jsonResponse(200, { explanation, provider: 'gemini' });
    } catch {
      return jsonResponse(502, { error: 'AI providers unavailable' });
    }
  }
};
