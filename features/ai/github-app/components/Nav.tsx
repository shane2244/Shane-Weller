import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Nav() {
  const { data: session } = useSession();
  return (
    <nav style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <Link href="/features/ai/github-app/dashboard">Dashboard</Link>
      <Link href="/features/ai/github-app/ai/companion">AI Companion</Link>
      <Link href="/features/ai/github-app/journal">Journal</Link>
      <Link href="/features/ai/github-app/mood">Mood</Link>
      <div style={{ marginLeft: 'auto' }}>
        {session?.user ? (
          <>
            <span style={{ marginRight: 8 }}>Signed in as {session.user?.name || session.user?.email}</span>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}
      </div>
    </nav>
  );
}
