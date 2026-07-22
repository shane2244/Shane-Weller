import { useState } from 'react';

export default function CompanionPage() {
  const [text, setText] = useState('');
  const [reply, setReply] = useState<string | null>(null);

  async function send() {
    const res = await fetch('/features/ai/github-app/api/ai/companion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage: text }),
    });
    const data = await res.json();
    setReply(data.reply || 'No reply');
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>AI Companion (Scaffold)</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} style={{ width: '100%' }} />
      <button onClick={send} style={{ marginTop: 8 }}>Send</button>
      {reply && (
        <section style={{ marginTop: 16 }}>
          <h2>Reply</h2>
          <div style={{ whiteSpace: 'pre-wrap' }}>{reply}</div>
        </section>
      )}
    </main>
  );
}
