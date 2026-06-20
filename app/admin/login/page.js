'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [redirectPath, setRedirectPath] = useState('/admin/dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectPath(params.get('next') || '/admin/dashboard');
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Invalid admin credentials.');
      }

      setError('');
      router.push(redirectPath);
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid admin credentials.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Admin Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Sign in to the dashboard
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Use this screen to access volunteer records, certificates, and event operations.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                autoComplete="username"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="••••••••"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Continue to Dashboard
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
