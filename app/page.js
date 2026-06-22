'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCounter from '../components/StatsCounter';
import Testimonials from '../components/Testimonials';

/* ── Constants ─────────────────────────────────────────────── */
const stats = ['150+ Volunteers', '24 Drives', 'Affordable Care'];
const AGE_OPTIONS = ['Under 18', '18–25', '25–35', '35–50', '50+'];
const BLOOD_OPTIONS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const SERVICE_OPTIONS = ['Blood Test', 'General Checkup', 'X-Ray', 'BP Check', 'Sugar Test', 'Eye Test'];

const STATIC_EVENTS = [
  {
    _id: 'static-01',
    title: 'Blood Donation Camp – Zone C',
    date: '2026-07-20T08:00:00.000Z',
    location: 'Rotary Bhavan, Visnagar',
    description:
      'Join us for a mass blood donation camp organised by Rotary Club Visnagar. Trained medical staff will be present. All donors receive refreshments and a donation certificate.',
    image: '/rotary-front.jpeg',
  },
];

function formatDriveDate(v) {
  if (!v) return 'Date to be announced';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return 'Date to be announced';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

/* ── Shared field styles ── */
const INP = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20';
const LBL = 'block space-y-1.5';
const LTXT = 'text-xs font-semibold text-slate-500';

/* ─────────────────────────────────────────────────────────────
   EventFlipCard
   ─────────────────────────────────────────────────────────────
   Animation strategy (two-phase rotateY):
     Phase 1 – 0° → 90°  (fold away, 200 ms)
     — switch rendered content (invisible while edge-on)
     Phase 2 – –90° → 0° (unfold from other side, 200 ms)
   Height is always natural → no clipping.
   Equal front-card heights → grid uses items-stretch; card is
   h-full flex-col; description is flex-1 line-clamp-3 so all
   front faces grow to the same row height.
───────────────────────────────────────────────────────────── */
function EventFlipCard({ event, image }) {
  const [face, setFace]         = useState('front'); // rendered content
  const [cardStyle, setCardStyle] = useState({});     // inline transform/transition
  const pendingFace = useRef(null);
  const halfDone    = useRef(false);                  // true = in second half

  // Volunteer
  const [vForm, setVForm] = useState({ name: '', phone: '', email: '', age: '', bloodType: '' });
  const [vBusy, setVBusy] = useState(false);
  const [vMsg,  setVMsg]  = useState({ type: '', text: '' });

  // Patient
  const [pForm, setPForm] = useState({ name: '', phone: '', email: '', age: '', bloodGroup: '', requiredService: '' });
  const [pBusy, setPBusy] = useState(false);
  const [pMsg,  setPMsg]  = useState({ type: '', text: '' });

  /* ── Trigger flip ── */
  function flipTo(newFace) {
    if (pendingFace.current || newFace === face) return;
    pendingFace.current = newFace;
    halfDone.current = false;
    // Phase 1: fold to 90°
    setCardStyle({
      transition: 'transform 0.22s ease-in',
      transform: 'perspective(900px) rotateY(90deg)',
    });
  }

  function reset() { flipTo('front'); }

  /* ── Handle each half of the animation ── */
  function onTransitionEnd(e) {
    // Ignore events that bubbled up from child elements (e.g. image scale, shadow)
    if (e.target !== e.currentTarget) return;
    // Ignore non-transform transitions
    if (e.propertyName !== 'transform') return;
    // Ignore if no flip is in progress
    if (!pendingFace.current && !halfDone.current) return;

    if (!halfDone.current) {
      // ── First half done: switch content, jump to -90° (no transition) ──
      halfDone.current = true;
      const next = pendingFace.current;
      pendingFace.current = null;
      setFace(next);
      // Disable transition, snap to -90°
      setCardStyle({ transition: 'none', transform: 'perspective(900px) rotateY(-90deg)' });
      // Two rAFs ensure the browser paints the -90° snap before re-enabling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCardStyle({
            transition: 'transform 0.22s ease-out',
            transform: 'perspective(900px) rotateY(0deg)',
          });
        });
      });
    } else {
      // ── Second half done: clean up ──
      halfDone.current = false;
      setCardStyle({});
    }
  }

  /* ── API submissions ── */
  async function submitVolunteer(e) {
    e.preventDefault();
    setVBusy(true); setVMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...vForm, eventId: event._id }),
      });
      const r = await res.json();
      if (!res.ok) throw new Error(r?.message || 'Failed');
      setVMsg({ type: 'ok', text: 'Registered as volunteer! Thank you.' });
      setVForm({ name: '', phone: '', email: '', age: '', bloodType: '' });
    } catch (err) { setVMsg({ type: 'err', text: err.message }); }
    finally { setVBusy(false); }
  }

  async function submitPatient(e) {
    e.preventDefault();
    setPBusy(true); setPMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/participants', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pForm, eventId: event._id }),
      });
      const r = await res.json();
      if (!res.ok) throw new Error(r?.message || 'Failed');
      setPMsg({ type: 'ok', text: 'Registered as patient! See you at the drive.' });
      setPForm({ name: '', phone: '', email: '', age: '', bloodGroup: '', requiredService: '' });
    } catch (err) { setPMsg({ type: 'err', text: err.message }); }
    finally { setPBusy(false); }
  }

  function Msg({ m }) {
    if (!m.text) return null;
    return (
      <div className={`rounded-xl px-3 py-2.5 text-sm ${m.type === 'ok' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-red-200 bg-red-50 text-red-700'}`}>
        {m.text}
      </div>
    );
  }

  /* ── Render ── */
  return (
    /* h-full so the card fills its grid cell (equal heights from items-stretch) */
    <div
      className="h-full rounded-3xl border border-slate-200 bg-white shadow-sm"
      style={{ ...cardStyle, willChange: 'transform' }}
      onTransitionEnd={onTransitionEnd}
    >

      {/* ─── FRONT ─────────────────────────────────────────── */}
      {face === 'front' && (
        <div className="group flex h-full flex-col overflow-hidden rounded-3xl">
          {/* image — fixed aspect, never clips */}
          <div className="aspect-[16/9] w-full shrink-0 overflow-hidden bg-slate-100">
            <img
              src={image} alt={event.title}
              className="h-full w-full object-cover transition-opacity duration-300"
            />
          </div>
          {/* content — flex-col; description is flex-1 so buttons always sit at bottom */}
          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-semibold leading-snug text-slate-950">{event.title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {formatDriveDate(event.date)}{event.location ? ` · ${event.location}` : ''}
            </p>
            {/* Info badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Free Entry', 'Certificate Provided', 'Refreshments', 'All Ages Welcome'].map(tag => (
                <span key={tag} className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                  {tag}
                </span>
              ))}
            </div>
            {/* flex-1: description grows to fill remaining space, no clamp */}
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {event.description || 'Community health support drive.'}
            </p>
            {/* buttons always at bottom */}
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => flipTo('volunteer')}
                className="flex-1 rounded-full bg-[#f7a81b] py-2.5 text-sm font-semibold text-black transition hover:bg-amber-600 hover:text-white">
                Volunteer Now
              </button>
              <button type="button" onClick={() => flipTo('patient')}
                className="flex-1 rounded-full border border-[#f7a81b] bg-white py-2.5 text-sm font-semibold text-[#f7a81b] transition hover:bg-[#f7a81b] hover:text-white">
                Register as Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── VOLUNTEER FORM ─────────────────────────────────── */}
      {face === 'volunteer' && (
        <div className="overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between gap-2 bg-[#f7a81b] px-5 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">Volunteer Registration</p>
              <p className="truncate text-sm font-semibold text-black">{event.title}</p>
            </div>
            <button type="button" onClick={reset} aria-label="Back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 text-xl text-black transition hover:bg-black/20">
              ×
            </button>
          </div>
          <form onSubmit={submitVolunteer} className="flex flex-col gap-3 p-5">
            <div className="grid grid-cols-2 gap-3">
              <label className={LBL}>
                <span className={LTXT}>Full Name</span>
                <input type="text" required placeholder="Your name" value={vForm.name}
                  onChange={e => setVForm(f => ({ ...f, name: e.target.value }))} className={INP} />
              </label>
              <label className={LBL}>
                <span className={LTXT}>Phone</span>
                <input type="tel" required placeholder="Mobile number" value={vForm.phone}
                  onChange={e => setVForm(f => ({ ...f, phone: e.target.value }))} className={INP} />
              </label>
            </div>
            <label className={LBL}>
              <span className={LTXT}>Email</span>
              <input type="email" required placeholder="name@example.com" value={vForm.email}
                onChange={e => setVForm(f => ({ ...f, email: e.target.value }))} className={INP} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={LBL}>
                <span className={LTXT}>Age Group</span>
                <select required value={vForm.age} onChange={e => setVForm(f => ({ ...f, age: e.target.value }))} className={INP}>
                  <option value="">Select</option>
                  {AGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className={LBL}>
                <span className={LTXT}>Blood Type</span>
                <select required value={vForm.bloodType} onChange={e => setVForm(f => ({ ...f, bloodType: e.target.value }))} className={INP}>
                  <option value="">Select</option>
                  {BLOOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            </div>
            <Msg m={vMsg} />
            <button type="submit" disabled={vBusy}
              className="mt-1 w-full rounded-full bg-[#f7a81b] py-2.5 text-sm font-semibold text-black transition hover:bg-amber-600 hover:text-white disabled:opacity-60">
              {vBusy ? 'Submitting…' : 'Submit Registration'}
            </button>
          </form>
        </div>
      )}

      {/* ─── PATIENT FORM ───────────────────────────────────── */}
      {face === 'patient' && (
        <div className="overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between gap-2 border-b border-amber-100 bg-amber-50 px-5 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#f7a81b]">Patient Registration</p>
              <p className="truncate text-sm font-semibold text-slate-900">{event.title}</p>
            </div>
            <button type="button" onClick={reset} aria-label="Back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl text-amber-700 transition hover:bg-amber-200">
              ×
            </button>
          </div>
          <form onSubmit={submitPatient} className="flex flex-col gap-3 p-5">
            <div className="grid grid-cols-2 gap-3">
              <label className={LBL}>
                <span className={LTXT}>Full Name</span>
                <input type="text" required placeholder="Your name" value={pForm.name}
                  onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} className={INP} />
              </label>
              <label className={LBL}>
                <span className={LTXT}>Phone</span>
                <input type="tel" required placeholder="Mobile number" value={pForm.phone}
                  onChange={e => setPForm(f => ({ ...f, phone: e.target.value }))} className={INP} />
              </label>
            </div>
            <label className={LBL}>
              <span className={LTXT}>Email</span>
              <input type="email" required placeholder="name@example.com" value={pForm.email}
                onChange={e => setPForm(f => ({ ...f, email: e.target.value }))} className={INP} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={LBL}>
                <span className={LTXT}>Age Group</span>
                <select required value={pForm.age} onChange={e => setPForm(f => ({ ...f, age: e.target.value }))} className={INP}>
                  <option value="">Select</option>
                  {AGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className={LBL}>
                <span className={LTXT}>Blood Group</span>
                <select required value={pForm.bloodGroup} onChange={e => setPForm(f => ({ ...f, bloodGroup: e.target.value }))} className={INP}>
                  <option value="">Select</option>
                  {BLOOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            </div>
            <label className={LBL}>
              <span className={LTXT}>Service Required</span>
              <select required value={pForm.requiredService} onChange={e => setPForm(f => ({ ...f, requiredService: e.target.value }))} className={INP}>
                <option value="">Select a service</option>
                {SERVICE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <Msg m={pMsg} />
            <button type="submit" disabled={pBusy}
              className="mt-1 w-full rounded-full border border-[#f7a81b] bg-white py-2.5 text-sm font-semibold text-[#f7a81b] transition hover:bg-[#f7a81b] hover:text-white disabled:opacity-60">
              {pBusy ? 'Submitting…' : 'Submit Registration'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch('/api/events', { headers: { 'Content-Type': 'application/json' } });
        let r;
        try { r = await res.json(); } catch { r = null; }
        if (!res.ok) throw new Error(r?.message || 'Unable to load upcoming drives');
        if (alive) setEvents(Array.isArray(r?.data) ? r.data : []);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Unable to load upcoming drives');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const IMGS = ['/hall.jpeg', '/rotary-front.jpeg'];
  const allEvents = [
    ...events.map((ev, i) => ({ ...ev, image: IMGS[i % IMGS.length] })),
    ...STATIC_EVENTS.filter(s => !events.find(e => e._id === s._id)),
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),radial-gradient(circle_at_right,_rgba(14,165,233,0.14),_transparent_5%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-[#f7a81b]">
                ROTARY CLUB VISNAGAR
              </span>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Make a Difference for families who need care the most.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Support affordable health drives, connect volunteers with live events, and help us deliver fast medical access to families in Visnagar and surrounding villages.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/services" className="inline-flex w-full items-center justify-center rounded-full bg-[#f7a81b] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 sm:w-auto">
                  Explore Services
                </Link>
                <a href="#upcoming-drives" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-100 sm:w-auto">
                  See Upcoming Drives
                </a>
              </div>
            </div>
            <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
                <p className="text-sm font-medium text-slate-500">Impact Snapshot</p>
                <div className="mt-4 space-y-3">
                  {stats.map(s => (
                    <div key={s} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-base font-semibold text-slate-950">
                      <span>{s}</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-[#f7a81b]" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-[#f7a81b] p-6 text-black">
                <p className="text-sm font-medium text-black/70">Volunteer-first model</p>
                <h2 className="mt-3 text-2xl font-semibold">Quick response. Transparent support. Real community impact.</h2>
                <p className="mt-3 text-sm leading-7 text-black/80">Every drive is designed to make participation simple for residents and volunteers alike.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Upcoming Drives ── */}
        <section id="upcoming-drives" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">Upcoming Drives</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Join the next event near you
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-600 sm:text-right">
              Volunteer to help — or register as a patient to receive free medical care at any drive.
            </p>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Loading upcoming drives...</div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
            ) : (
              /* items-stretch: all cards in a row get the same height */
              <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                {allEvents.map(ev => (
                  <EventFlipCard key={ev._id} event={ev} image={ev.image || '/hall.jpeg'} />
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="bg-slate-50"><StatsCounter /></div>
        <div className="bg-white"><Testimonials /></div>
        <Footer />
      </main>
    </div>
  );
}
