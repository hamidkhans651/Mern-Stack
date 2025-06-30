'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', padding: 36, width: '100%', maxWidth: 400 }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Create your account</h2>
        <p className="mb-4 text-center" style={{ color: '#555' }}>
          Or{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: 500 }}>
            sign in to your account
          </Link>
        </p>
        <form className="mb-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded p-4 mb-4" style={{ background: '#fee2e2', color: '#b91c1c', textAlign: 'center' }}>{error}</div>
          )}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15 }}
              placeholder="Full name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15 }}
              placeholder="Email address"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15 }}
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px 0', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', opacity: isLoading ? 0.7 : 1, marginTop: 8 }}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
} 