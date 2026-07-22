import { useEffect, useState } from 'react';
import Nav from '../../../components/Nav';

type ConvSummary = { id: string; title: string | null; updatedAt: string; lastMessage?: { role: string; content: string; createdAt: string } };

type Message = { id: string; role: string; content: string; createdAt: string };

export default function CompanionPage() {
  const [convos, setConvos] = useState<ConvSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function loadConvos() {
    const res = await fetch('/features/ai/github-app/api/ai/conversations');
    if (res.ok) {
      const data = await res.json();
      setConvos(data.conversations || []);
    }
  }

  async function loadMessages(convoId: string) {
    const res = await fetch(`/features/ai/github-app/api/ai/conversations/${convoId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
  }

  useEffect(() => { loadConvos(); }, []);

  useEffect(() => {
    if (selected) loadMessages(selected);
    else setMessages([]);
  }, [selected]);

  async function send(e?: any) {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/features/ai/github-app/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selected, userMessage: text }),
      });
      const data = await res.json();
      // refresh conversation list and messages
      await loadConvos();
      if (data.conversationId) {
        setSelected(data.conversationId);
        await loadMessages(data.conversationId);
      }
      setText('');
    } catch (err) {
      console.error(err);
      alert('Send failed');
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{ padding: 24, display: 'flex', gap: 24 }}>
      <Nav />
      <aside style={{ width: 260 }}>
        <h2>Conversations</h2>
        <button onClick={() => setSelected(null)} style={{ display: 'block', marginBottom: 8 }}>New Conversation</button>
        <ul>
          {convos.map((c) => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              <button onClick={() => setSelected(c.id)} style={{ textAlign: 'left', width: '100%' }}>
                <div><strong>{c.title || 'Conversation'}</strong></div>
                <div style={{ fontSize: 12, color: '#888' }}>{c.lastMessage?.content?.slice(0, 80) || ''}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section style={{ flex: 1 }}>
        <h1>AI Companion</h1>
        <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: 12, height: '60vh', overflow: 'auto', background: 'rgba(0,0,0,0.4)' }}>
          {messages.length === 0 && <p style={{ color: '#aaa' }}>No messages yet. Start the conversation below.</p>}
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999' }}>{m.role}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              <small style={{ color: '#777' }}>{new Date(m.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>

        <form onSubmit={send} style={{ marginTop: 12 }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} style={{ width: '100%' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
            <button type="button" onClick={() => { setText(''); }}>Clear</button>
          </div>
        </form>
      </section>
    </main>
  );
}
