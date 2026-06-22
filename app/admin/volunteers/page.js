'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { generateVolunteerCertificate } from '../../../lib/certificate';

export default function VolunteerDetailsPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/volunteers');
        const result = await res.json();
        if (!res.ok) throw new Error(result?.message || 'Failed to load');
        if (isMounted) setVolunteers(Array.isArray(result?.data) ? result.data : []);
      } catch (e) {
        if (isMounted) setError(e instanceof Error ? e.message : 'Failed to load volunteers');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  function getEventName(eventField) {
    if (!eventField) return 'Community Service Drive';
    if (typeof eventField === 'string') return 'Community Service Drive';
    return eventField.title || 'Community Service Drive';
  }

  const filtered = volunteers.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase()) ||
    getEventName(v.eventId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Volunteer Registrations
            </h1>
          </div>
          <a
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email or event…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:ring-2 focus:ring-[#f7a81b]/20 sm:max-w-sm"
          />
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Loading volunteers…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No volunteers found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <article
                key={v._id}
                onClick={() => setSelected(v)}
                className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#f7a81b]/30 hover:shadow-lg"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7a81b]/15 text-lg font-bold text-[#f7a81b]">
                    {v.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{v.name}</p>
                    <p className="truncate text-xs text-slate-500">{v.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</span>
                    <span>{v.phone}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Age</span>
                    <span>{v.age}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Blood</span>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">{v.bloodType}</span>
                  </div>
                  <div className="rounded-xl bg-amber-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Event</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-800">{getEventName(v.eventId)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void generateVolunteerCertificate(v.name, getEventName(v.eventId));
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f7a81b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  🎓 Download Certificate
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f7a81b]/15 text-3xl font-bold text-[#f7a81b]">
                  {selected.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#f7a81b]">Volunteer</p>
                  <h2 className="text-xl font-bold text-slate-950">{selected.name}</h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { label: 'Email', value: selected.email },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Age Group', value: selected.age },
                  { label: 'Blood Type', value: selected.bloodType },
                  { label: 'Event', value: getEventName(selected.eventId) },
                  { label: 'Status', value: selected.status || 'Registered' },
                  { label: 'Registered On', value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="text-sm font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => void generateVolunteerCertificate(selected.name, getEventName(selected.eventId))}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f7a81b] py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                🎓 Download Certificate PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
