import { useEffect, useState } from 'react';

export default function JournalPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  async function load() {
    const res = await fetch('/features/ai/github-app/api/journal');
    const data = await res.json();
    setJournals(data.journals || []);
  }

  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    const res = await fetch('/features/ai/github-app/api/journal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle(''); setContent(''); load();
    } else {
      const err = await res.json(); alert(err?.error || 'Failed');
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Journal</h1>
      <form onSubmit={create} style={{ marginBottom: 24 }}>
        <input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8 }} />
        <textarea placeholder="Write your entry..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} style={{ width: '100%' }} />
        <button type="submit" style={{ marginTop: 8 }}>Save</button>
      </form>

      <section>
        <h2>Recent entries</h2>
        {journals.length === 0 && <p>No entries yet.</p>}
        <ul>
          {journals.map((j) => (
            <li key={j.id} style={{ marginBottom: 12 }}>
              <strong>{j.title || 'Untitled'}</strong>
              <div style={{ whiteSpace: 'pre-wrap' }}>{j.content}</div>
              <small>{new Date(j.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
