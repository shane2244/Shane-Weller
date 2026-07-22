import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>ShaneAI — Dashboard (Scaffold)</h1>
      <p>Morning greeting, mood summary, journal preview will appear here.</p>
      <ul>
        <li><Link href="/ai/companion">AI Companion</Link></li>
        <li><Link href="/journal">Journal</Link></li>
        <li><Link href="/mood">Mood Tracker</Link></li>
      </ul>
    </main>
  );
}
