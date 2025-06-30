'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header style={{ background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px' }}>
        <Link href="/tasks" className="text-2xl font-bold" style={{ color: 'white', textDecoration: 'none', letterSpacing: '-1px' }}>
          ✓ Task Manager
        </Link>
        {session?.user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ color: '#dbeafe' }}>
              Welcome, <span style={{ fontWeight: 600 }}>{session.user.name}</span>
            </span>
            <button
              onClick={() => signOut()}
              style={{ padding: '8px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', color: 'white', border: 'none', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 