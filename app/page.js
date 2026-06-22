'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import RegistrationModal from '../components/RegistrationModal';

const stats = [
  '150+ Volunteers',
  '24 Drives',
  'Affordable Care',
];

function formatDriveDate(dateValue) {
  if (!dateValue) {
    return 'Date to be announced';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return 'Date to be announced';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const response = await fetch('/api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || 'Unable to load upcoming drives');
        }

        if (isMounted) {
          setEvents(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load upcoming drives');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
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
                <Link
                  href="/services"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#f7a81b] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 sm:w-auto"
                >
                  Explore Services
                </Link>
                <a
                  href="#upcoming-drives"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-100 sm:w-auto"
                >
                  See Upcoming Drives
                </a>
              </div>
            </div>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
                <p className="text-sm font-medium text-slate-500">Impact Snapshot</p>
                <div className="mt-4 space-y-4 text-2xl font-semibold text-slate-950">
                  {stats.map((stat) => (
                    <div key={stat} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-base">
                      <span>{stat}</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-[#f7a81b]" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-emerald-100 bg-[#f7a81b] p-6 text-black shadow-emerald-600/20">
                <p className="text-sm font-medium text-black">Volunteer-first model</p>
                <h2 className="mt-4 text-2xl font-semibold">Quick response. Transparent support. Real community impact.</h2>
                <p className="mt-3 text-sm leading-7 text-black">
                  Every drive is designed to make participation simple for residents and volunteers alike.
                </p>
              </div>
            </div>
          </div>
        </section>

 

        <section id="upcoming-drives" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">
                Upcoming Drives
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Join the next event near you
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-right">
              Join the next event near you.
            </p>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                Loading upcoming drives...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                No upcoming drives are available right now.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event,index) => (
                  <article
                    key={event._id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={['/hall.jpeg', '/rotary-front.jpeg'][index % 2]}
                        alt={event.title || 'Upcoming drive'}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-4 p-5 sm:p-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950 sm:text-xl">{event.title}</h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {formatDriveDate(event.date)} {event.location ? `• ${event.location}` : ''}
                        </p>
                      </div>
                      <p className="line-clamp-3 text-sm leading-7 text-slate-600">
                        {event.description || 'Community health support drive.'}
                      </p>
                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm font-medium text-black">Open for volunteers</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsRegistrationOpen(true);
                          }}
                          className="inline-flex w-full items-center justify-center rounded-full bg-[#f7a81b] px-4 py-2.5 text-sm font-semibold text-black transition-colors duration-200 hover:bg-emerald-700 sm:w-auto"
                        >
                          Volunteer Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <RegistrationModal
        open={isRegistrationOpen}
        event={selectedEvent}
        onClose={() => {
          setIsRegistrationOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
