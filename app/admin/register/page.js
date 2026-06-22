'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';

export default function AdminRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'volunteer' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || 'Registration failed.');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {success ? (
          /* ── Success State ── */
          <section className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
              🎉
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-slate-950">
              {form.role === 'admin' ? 'Admin account created!' : 'Registration submitted!'}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {form.role === 'admin'
                ? 'Your admin account is active. You can sign in now.'
                : 'Your volunteer account is pending approval by the admin team. You will be notified once approved.'}
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#f7a81b] py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Go to Login →
            </Link>
          </section>
        ) : (
          /* ── Registration Form ── */
          <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
            {/* Header */}
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">
              Admin Panel
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Create an account
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Register as an Admin or a Volunteer to access the Rotary Club Visnagar management system.
            </p>

            {/* Role Picker */}
            <div className="mt-6 flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
              {[
                { value: 'volunteer', label: '🤝 Volunteer', desc: 'Needs approval' },
                { value: 'admin', label: '🔐 Admin', desc: 'Full access' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                  className={`flex flex-1 flex-col items-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                    form.role === r.value
                      ? 'bg-[#f7a81b] text-white shadow'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {r.label}
                  <span className={`text-[10px] font-normal ${form.role === r.value ? 'text-white/80' : 'text-slate-400'}`}>
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>

            {form.role === 'volunteer' && (
              <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                ⏳ Volunteer accounts require approval from an existing admin before you can log in.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harsh Desai"
                  value={form.name}
                  onChange={update('name')}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Phone Number</span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={update('phone')}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Password <span className="text-red-500">*</span></span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={update('password')}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Confirm <span className="text-red-500">*</span></span>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={update('confirm')}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                  />
                </label>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#f7a81b] py-3 text-sm font-semibold text-white shadow-md shadow-[#f7a81b]/25 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Creating account…' : `Register as ${form.role === 'admin' ? 'Admin' : 'Volunteer'}`}
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/admin/login" className="font-semibold text-[#f7a81b] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
