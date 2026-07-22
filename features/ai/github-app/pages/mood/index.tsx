import { useEffect, useState } from 'react';

export default function MoodPage() {
  const [moods, setMoods] = useState<any[]>([]);
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState('');

  async function load() {
    const res = await fetch('/features/ai/github-app/api/mood');
    const data = await res.json();
    setMoods(data.moods || []);
  }

  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    const res = await fetch('/features/ai/github-app/api/mood', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, energy, note }),
    });
    if (res.ok) {
      setMood(''); setEnergy(5); setNote(''); load();
    } else {
      const err = await res.json(); alert(err?.error || 'Failed');
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Mood Tracker</h1>
      <form onSubmit={create} style={{ marginBottom: 24 }}>
        <input placeholder="Mood (e.g. happy, sad)" value={mood} onChange={(e) => setMood(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8 }} />
        <label>
          Energy: <input type="range" min={0} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} /> {energy}
        </label>
        <textarea placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} rows={3} style={{ width: '100%', marginTop: 8 }} />
        <button type="submit" style={{ marginTop: 8 }}>Record Mood</button>
      </form>

      <section>
        <h2>Recent moods</h2>
        {moods.length === 0 && <p>No mood entries yet.</p>}
        <ul>
          {moods.map((m) => (
            <li key={m.id} style={{ marginBottom: 12 }}>
              <strong>{m.mood}</strong> — energy {m.energy ?? '—'}
              <div>{m.note}</div>
              <small>{new Date(m.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
