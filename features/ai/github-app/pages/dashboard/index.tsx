import Nav from '../../components/Nav';
import '../../styles/globals.css';

export default function DashboardPage() {
  return (
    <main className="container">
      <div className="spiral" aria-hidden="true"></div>
      <Nav />

      <section style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div>
          <div className="glass-panel">
            <h2 className="header-title">Good morning, Shane.</h2>
            <p className="header-sub">Today: small reflection & a micro-action to try.</p>
            <p style={{ color: 'var(--muted)' }}>This is your Daily Dashboard — mood, journal prompts, and companion highlights will appear here.</p>
          </div>

          <div style={{ marginTop: 16 }} className="glass-panel">
            <h3 className="header-title">Journal preview</h3>
            <p className="header-sub">Recent entries & quick compose</p>
            <div className="card-list">
              <div className="card-item">No entries yet. Try writing for two minutes.</div>
            </div>
          </div>
        </div>

        <aside>
          <div className="glass-panel">
            <h3 className="header-title">Mood</h3>
            <p className="header-sub">Energy & recent trend</p>
            <div className="card-item">—</div>
          </div>

          <div style={{ marginTop: 12 }} className="glass-panel">
            <h3 className="header-title">Quote of the day</h3>
            <p className="header-sub">A gentle prompt to reflect</p>
            <div style={{ fontStyle: 'italic' }} className="small muted">“Small consistent actions compound into meaningful change.”</div>
          </div>
        </aside>
      </section>
    </main>
  );
}
