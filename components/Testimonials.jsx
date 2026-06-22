'use client';

import { useEffect, useState } from 'react';

// Static seed stories shown always (fallback / alongside DB stories)
const STATIC_STORIES = [
  {
    _id: 's1',
    quote:
      'I got a free blood test at the Rotary health drive that detected my high sugar levels early. Because of that, I started treatment on time. I am truly grateful to Rotary Club Visnagar.',
    name: 'Ramilaben Patel',
    role: 'Patient',
    village: 'Visnagar',
  },
  {
    _id: 's2',
    quote:
      'Volunteering at the Blood Donation Camp was one of the most fulfilling experiences of my life. The team was well-organised and the impact was immediate. Proud to be part of this mission.',
    name: 'Harsh Desai',
    role: 'Volunteer',
    village: 'Kheralu',
  },
  {
    _id: 's3',
    quote:
      'My mother received a free eye checkup and was referred to a specialist for cataract surgery. Without Rotary, we could not have afforded it. They genuinely care about the community.',
    name: 'Suresh Thakor',
    role: 'Patient Family',
    village: 'Unjha',
  },
  {
    _id: 's4',
    quote:
      "I have been volunteering for two years now. Each camp teaches me something new and I love seeing smiles on patients' faces. Rotary Club Visnagar is truly doing God's work.",
    name: 'Priya Shah',
    role: 'Senior Volunteer',
    village: 'Visnagar',
  },
];

const AVATAR_COLORS = [
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
];

const ROLES = ['Volunteer', 'Patient', 'Patient Family', 'Community Member'];

const EMPTY_FORM = { name: '', role: '', village: '', quote: '' };

export default function Testimonials() {
  const [liveStories, setLiveStories] = useState([]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch live approved stories from DB
  useEffect(() => {
    fetch('/api/stories')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setLiveStories(res.data);
      })
      .catch(() => { });
  }, []);

  // Merge: live DB stories first, then static ones
  const allStories = [...liveStories, ...STATIC_STORIES];

  function colorFor(index) {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.role || !form.village || !form.quote) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (form.quote.length > 500) {
      setFormError('Your story must be under 500 characters.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || 'Failed to submit');
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">Stories</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Real voices. Real impact.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
          Hear from the patients, families, and volunteers whose lives have been touched by Rotary Club Visnagar.
        </p>
      </div>

      {/* Desktop: 2-col grid */}
      <div className="hidden gap-5 md:grid md:grid-cols-2">
        {allStories.map((t, i) => (
          <article
            key={t._id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
          >
            <div>
              <span className="text-5xl font-serif leading-none text-[#f7a81b]/30 select-none">"</span>
              <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">{t.quote}</p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colorFor(i)}`}>
                {t.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role} · {t.village}</p>
              </div>
              {/* Badge for live stories */}
              {t._id && !t._id.startsWith('s') && (
                <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                  ✦ Live
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Mobile: carousel */}
      <div className="md:hidden">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-5xl font-serif leading-none text-[#f7a81b]/30 select-none">"</span>
          <p className="mt-2 text-sm leading-7 text-slate-700">{allStories[mobileIndex]?.quote}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colorFor(mobileIndex)}`}>
              {allStories[mobileIndex]?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{allStories[mobileIndex]?.name}</p>
              <p className="text-xs text-slate-500">{allStories[mobileIndex]?.role} · {allStories[mobileIndex]?.village}</p>
            </div>
          </div>
        </article>
        <div className="mt-5 flex justify-center gap-2">
          {allStories.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to story ${i + 1}`}
              onClick={() => setMobileIndex(i)}
              className={`h-2 rounded-full transition-all duration-200 ${mobileIndex === i ? 'w-6 bg-[#f7a81b]' : 'w-2 bg-slate-300'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Share Your Story CTA ── */}
      <div className="mt-12">
        {!showForm ? (
          <div className="rounded-3xl border border-[#f7a81b]/25 bg-gradient-to-br from-[#f7a81b]/8 via-amber-50/60 to-white p-6 text-center sm:p-8">
            <p className="text-lg font-semibold text-slate-950">Have a story to share? ✨</p>
            <p className="mt-2 text-sm text-slate-500">
              Did Rotary Club Visnagar make a difference in your life? Share it — your words inspire others.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f7a81b] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#f7a81b]/25 transition hover:bg-amber-600"
            >
              📝 Share Your Story
            </button>
          </div>
        ) : submitted ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
            <p className="text-3xl">🎉</p>
            <p className="mt-3 text-lg font-semibold text-emerald-800">Thank you for sharing!</p>
            <p className="mt-2 text-sm text-emerald-700">
              Your story has been submitted and will appear here once reviewed by our team. It usually takes 1–2 days.
            </p>
            <button
              type="button"
              onClick={() => { setSubmitted(false); setShowForm(false); }}
              className="mt-5 inline-flex items-center rounded-full border border-emerald-300 bg-white px-5 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Submission Form ── */
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Share Your Story</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your story will be reviewed before it goes live on the website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(''); setForm(EMPTY_FORM); }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Your Name <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramilaben Patel"
                    value={form.name}
                    maxLength={60}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Your Village / City <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Visnagar, Kheralu…"
                    value={form.village}
                    maxLength={50}
                    onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Your Role <span className="text-red-500">*</span></span>
                <select
                  required
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                >
                  <option value="">Select your role…</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Your Story <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-slate-400">({form.quote.length}/500)</span>
                </span>
                <textarea
                  required
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us how Rotary Club Visnagar made a difference in your life…"
                  value={form.quote}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                />
              </label>

              {formError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f7a81b] py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : '✉️ Submit My Story'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
