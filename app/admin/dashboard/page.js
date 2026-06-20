'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { generateVolunteerCertificate } from '../../../lib/certificate';

export default function AdminDashboardPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadVolunteers() {
      try {
        const response = await fetch('/api/volunteers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || 'Unable to load volunteers');
        }

        if (isMounted) {
          setVolunteers(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load volunteers');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVolunteers();

    return () => {
      isMounted = false;
    };
  }, []);

  function getEventName(eventField) {
    if (!eventField) {
      return 'Scheduled Community Service Drive';
    }

    if (typeof eventField === 'string') {
      return 'Scheduled Community Service Drive';
    }

    return eventField.title || 'Scheduled Community Service Drive';
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Admin Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Registered Volunteers
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-right">
            Review volunteer registrations, verify the linked drive, and generate certificates instantly.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 sm:p-10">
            Loading volunteers...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700 sm:p-6">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Phone</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Age</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Blood Type</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Event Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer._id} className="align-top hover:bg-slate-50/70">
                      <td className="px-6 py-4 text-sm font-medium text-slate-950">{volunteer.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{volunteer.phone}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{volunteer.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{volunteer.age}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{volunteer.bloodType}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {getEventName(volunteer.eventId)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            void generateVolunteerCertificate(volunteer.name, getEventName(volunteer.eventId));
                          }}
                          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          Generate Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-200 md:hidden">
              {volunteers.map((volunteer) => (
                <article key={volunteer._id} className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Volunteer
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-950">{volunteer.name}</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {volunteer.phone}
                    </span>
                  </div>
                  <div className="grid gap-3 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email</p>
                      <p className="mt-1 font-medium text-slate-900">{volunteer.email}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Age</p>
                      <p className="mt-1 font-medium text-slate-900">{volunteer.age}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Blood Type</p>
                      <p className="mt-1 font-medium text-slate-900">{volunteer.bloodType}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Event</p>
                      <p className="mt-1 font-medium text-slate-900">{getEventName(volunteer.eventId)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      void generateVolunteerCertificate(volunteer.name, getEventName(volunteer.eventId));
                    }}
                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Generate Certificate
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
