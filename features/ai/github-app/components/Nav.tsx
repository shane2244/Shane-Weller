import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Nav() {
  const { data: session } = useSession();
  return (
    <header className="glass-panel nav" aria-label="Main navigation">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/features/ai/github-app/dashboard"><strong style={{ color: 'var(--maize)' }}>ShaneAI</strong></Link>
        <Link href="/features/ai/github-app/dashboard">Dashboard</Link>
        <Link href="/features/ai/github-app/ai/companion">AI Companion</Link>
        <Link href="/features/ai/github-app/journal">Journal</Link>
        <Link href="/features/ai/github-app/mood">Mood</Link>
      </div>

      <div style={{ marginLeft: 'auto' }}>
        {session?.user ? (
          <>
            <span style={{ marginRight: 12 }} className="small muted">Signed in as {session.user?.name || session.user?.email}</span>
            <button className="button secondary" onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <button className="button" onClick={() => signIn()}>Sign in</button>
        )}
      </div>
    </header>
  );
}
