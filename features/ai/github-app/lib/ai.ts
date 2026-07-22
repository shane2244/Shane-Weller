import fetch from 'node-fetch';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export async function callOpenAI(messages: ChatMessage[]) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    // include body for easier debugging
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const data = JSON.parse(text);
  const reply = data.choices?.[0]?.message?.content || '';
  const usage = data.usage || null;
  return { reply, usage, raw: data };
}
