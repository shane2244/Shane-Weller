import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import '../../styles/globals.css';

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
    <main className="container">
      <Nav />

      <section style={{ marginTop: 20 }}>
        <div className="glass-panel">
          <h1 className="header-title">Mood Tracker</h1>
          <p className="header-sub">Quick mood entry and recent timeline.</p>

          <form onSubmit={create} style={{ marginBottom: 24 }}>
            <input placeholder="Mood (e.g. happy, sad)" value={mood} onChange={(e) => setMood(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8 }} />
            <label style={{ display: 'block', marginBottom: 8 }}>
              Energy: <input type="range" min={0} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} /> {energy}
            </label>
            <textarea placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} rows={3} style={{ width: '100%', marginTop: 8 }} />
            <div style={{ marginTop: 8 }}>
              <button className="button" type="submit">Record Mood</button>
            </div>
          </form>

          <section>
            <h2 className="header-title">Recent moods</h2>
            {moods.length === 0 && <p>No mood entries yet.</p>}
            <ul>
              {moods.map((m) => (
                <li key={m.id} style={{ marginBottom: 12 }}>
                  <strong>{m.mood}</strong> — energy {m.energy ?? '—'}
                  <div>{m.note}</div>
                  <small className="muted">{new Date(m.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
