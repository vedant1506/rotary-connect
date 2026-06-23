'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { generateVolunteerCertificate } from '../../../lib/certificate';

export default function AdminDashboardPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [stories, setStories] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('volunteers');

  // Events management state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // event object being edited
  const [editForm, setEditForm] = useState({ title: '', date: '', location: '', description: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ type: '', message: '' });
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // shows inline confirm UI

  // Create event form state
  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '', description: '' });
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventFeedback, setEventFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [volRes, partRes] = await Promise.all([
          fetch('/api/volunteers', { headers: { 'Content-Type': 'application/json' } }),
          fetch('/api/participants', { headers: { 'Content-Type': 'application/json' } }),
        ]);
        const [volResult, partResult] = await Promise.all([volRes.json(), partRes.json()]);
        if (!volRes.ok) throw new Error(volResult?.message || 'Unable to load volunteers');
        if (!partRes.ok) throw new Error(partResult?.message || 'Unable to load participants');
        if (isMounted) {
          setVolunteers(Array.isArray(volResult?.data) ? volResult.data : []);
          setParticipants(Array.isArray(partResult?.data) ? partResult.data : []);
        }
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Unable to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  async function loadStories() {
    setStoriesLoading(true);
    try {
      // Fetch ALL stories (pending + approved) — for admin we'd ideally have a separate admin endpoint
      // For now we hit GET /api/stories and also load unapproved via a query flag
      const res = await fetch('/api/stories/all');
      if (!res.ok) throw new Error('Failed');
      const result = await res.json();
      setStories(Array.isArray(result?.data) ? result.data : []);
    } catch {
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'stories') loadStories();
    if (activeTab === 'team') loadAdminUsers();
    if (activeTab === 'manage-events') loadEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function loadEvents() {
    setEventsLoading(true);
    try {
      const res = await fetch('/api/events');
      const result = await res.json();
      setEvents(Array.isArray(result?.data) ? result.data : []);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  function openEditModal(event) {
    setEditingEvent(event);
    const dateStr = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
    setEditForm({
      title: event.title || '',
      date: dateStr,
      location: event.location || '',
      description: event.description || '',
    });
    setEditFeedback({ type: '', message: '' });
  }

  function closeEditModal() {
    setEditingEvent(null);
    setEditForm({ title: '', date: '', location: '', description: '' });
    setEditFeedback({ type: '', message: '' });
  }

  async function handleUpdateEvent(e) {
    e.preventDefault();
    if (!editingEvent) return;
    setEditSubmitting(true);
    setEditFeedback({ type: '', message: '' });
    try {
      const res = await fetch(`/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || 'Failed to update event');
      setEditFeedback({ type: 'success', message: '✅ Event updated successfully!' });
      loadEvents();
      setTimeout(() => closeEditModal(), 1200);
    } catch (err) {
      setEditFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update event' });
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDeleteEvent(id) {
    setDeletingEventId(String(id));
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      loadEvents();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setDeletingEventId(null);
    }
  }

  async function loadAdminUsers() {
    setAdminUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const result = await res.json();
      setAdminUsers(Array.isArray(result?.data) ? result.data : []);
    } catch { setAdminUsers([]); }
    finally { setAdminUsersLoading(false); }
  }

  async function approveAdminUser(id, approved) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved }),
    });
    loadAdminUsers();
  }

  async function deleteAdminUser(id) {
    if (!confirm('Remove this user permanently?')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    loadAdminUsers();
  }

  async function approveStory(id, approved) {
    await fetch(`/api/stories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved }),
    });
    loadStories();
  }

  async function deleteStory(id) {
    if (!confirm('Delete this story permanently?')) return;
    await fetch(`/api/stories/${id}`, { method: 'DELETE' });
    loadStories();
  }

  function getEventName(eventField) {
    if (!eventField) return 'Scheduled Community Service Drive';
    if (typeof eventField === 'string') return 'Scheduled Community Service Drive';
    return eventField.title || 'Scheduled Community Service Drive';
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    setEventSubmitting(true);
    setEventFeedback({ type: '', message: '' });
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || 'Failed to create event');
      setEventFeedback({ type: 'success', message: `✅ Event "${eventForm.title}" created successfully! Redirecting to event list…` });
      setEventForm({ title: '', date: '', location: '', description: '' });
      await loadEvents();
      setTimeout(() => setActiveTab('manage-events'), 1500);
    } catch (err) {
      setEventFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create event' });
    } finally {
      setEventSubmitting(false);
    }
  }

  const pendingCount = stories.filter((s) => !s.approved).length;
  const pendingUsersCount = adminUsers.filter((u) => !u.approved).length;

  const tabs = [
    { id: 'volunteers', label: 'Volunteers', count: volunteers.length },
    { id: 'participants', label: 'Patients', count: participants.length },
    { id: 'manage-events', label: 'Manage Events', count: events.length },
    { id: 'create-event', label: 'Create Event', count: null },
    { id: 'stories', label: 'Stories', count: pendingCount, countAlert: true },
    { id: 'team', label: 'Team Members', count: pendingUsersCount, countAlert: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Manage Registrations
            </h1>
          </div>
          <a
            href="/admin/volunteers"
            className="inline-flex items-center gap-2 rounded-full border border-[#f7a81b]/40 bg-[#f7a81b]/10 px-4 py-2 text-sm font-semibold text-[#f7a81b] transition hover:bg-[#f7a81b]/20"
          >
            👥 Volunteer Details & Certificates →
          </a>
        </div>

        {/* Tab Toggle */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 w-fit shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#f7a81b] text-white shadow'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : tab.countAlert && tab.count > 0
                    ? 'bg-red-100 text-red-600'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── MANAGE EVENTS TAB ── */}
        {activeTab === 'manage-events' && (
          <div>
            {/* Edit Modal Overlay */}
            {editingEvent && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
                onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}
              >
                <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-950">✏️ Edit Event</h2>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleUpdateEvent} className="space-y-4">
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-700">Event Title <span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        required
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-slate-700">Date <span className="text-red-500">*</span></span>
                        <input
                          type="date"
                          required
                          value={editForm.date}
                          onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-slate-700">Location <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          required
                          value={editForm.location}
                          onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                        />
                      </label>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-700">Description</span>
                      <textarea
                        rows={4}
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                      />
                    </label>

                    {editFeedback.message && (
                      <div className={`rounded-2xl px-4 py-3 text-sm ${
                        editFeedback.type === 'success'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border border-red-200 bg-red-50 text-red-700'
                      }`}>
                        {editFeedback.message}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editSubmitting}
                        className="flex-1 rounded-2xl bg-[#f7a81b] py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                      >
                        {editSubmitting ? 'Saving…' : '💾 Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Header row */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  All published events — upcoming and past. <strong className="text-slate-800">Edit</strong> or <strong className="text-slate-800">Delete</strong> any event.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('create-event')}
                className="inline-flex items-center gap-2 rounded-full bg-[#f7a81b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                + Create New Event
              </button>
            </div>

            {eventsLoading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                Loading events…
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-4xl mb-3">🗓️</p>
                <p className="font-semibold text-slate-700">No events found</p>
                <p className="text-sm text-slate-400 mt-1">Create your first event using the button above.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((ev) => {
                  const eventDate = ev.date ? new Date(ev.date) : null;
                  const isUpcoming = eventDate && eventDate >= new Date(new Date().setHours(0,0,0,0));
                  const eventId = String(ev._id);
                  const isDeleting = deletingEventId === eventId;
                  const isConfirming = confirmDeleteId === eventId;
                  return (
                    <article
                      key={ev._id}
                      className={`relative flex flex-col rounded-3xl border bg-white shadow-sm transition ${
                        isUpcoming ? 'border-emerald-200' : 'border-slate-200'
                      } ${isDeleting ? 'opacity-50' : ''}`}
                    >
                      {/* Status badge */}
                      <div className="flex items-center justify-between px-5 pt-5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isUpcoming
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isUpcoming ? '🟢 Upcoming' : '⏹ Past'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {eventDate
                            ? eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 px-5 py-4">
                        <h3 className="font-semibold text-slate-950 leading-snug">{ev.title}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <span>📍</span> {ev.location}
                        </p>
                        {ev.description && (
                          <p className="mt-3 line-clamp-3 text-sm text-slate-600 leading-relaxed">{ev.description}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 px-5 pb-5">
                        {isConfirming ? (
                          /* Inline confirm UI — no browser dialog needed */
                          <>
                            <div className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 text-center font-medium">
                              Delete this event?
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(ev._id)}
                              disabled={isDeleting}
                              className="rounded-2xl border border-red-400 bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                            >
                              {isDeleting ? '⏳' : 'Yes, Delete'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(ev)}
                              disabled={isDeleting}
                              className="flex-1 rounded-2xl border border-[#f7a81b]/40 bg-[#f7a81b]/10 py-2.5 text-xs font-semibold text-[#f7a81b] transition hover:bg-[#f7a81b]/20 disabled:opacity-50"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(eventId)}
                              disabled={isDeleting}
                              className="flex-1 rounded-2xl border border-red-100 bg-red-50 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              🗑 Delete
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CREATE EVENT TAB ── */}
        {activeTab === 'create-event' && (
          <div className="max-w-xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-slate-950">Create New Drive / Event</h2>
              <p className="mt-1 text-sm text-slate-500">Fill in the details below to publish a new upcoming event on the website.</p>

              <form onSubmit={handleCreateEvent} className="mt-6 space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Event Title <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Community Health Drive – Zone A"
                    value={eventForm.title}
                    onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Date <span className="text-red-500">*</span></span>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Location <span className="text-red-500">*</span></span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Community Center, Visnagar"
                      value={eventForm.location}
                      onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                    />
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    rows={4}
                    placeholder="Describe what this drive is about, what services will be offered, who should attend…"
                    value={eventForm.description}
                    onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20"
                  />
                </label>

                {eventFeedback.message && (
                  <div className={`rounded-2xl px-4 py-3 text-sm ${
                    eventFeedback.type === 'success'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border border-red-200 bg-red-50 text-red-700'
                  }`}>
                    {eventFeedback.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={eventSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f7a81b] py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {eventSubmitting ? 'Creating…' : '🗓️ Publish Event'}
                </button>
              </form>
            </div>
          </div>
        )}

        {loading && activeTab !== 'create-event' ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Loading data…
          </div>
        ) : error && activeTab !== 'create-event' ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        ) : activeTab === 'volunteers' ? (

          /* ── VOLUNTEERS TABLE ── */
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {['Name', 'Phone', 'Email', 'Age', 'Blood Type', 'Event Name', 'Action'].map((h) => (
                      <th key={h} className="px-6 py-4 text-sm font-semibold text-slate-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {volunteers.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">No volunteers registered yet.</td></tr>
                  ) : volunteers.map((v) => (
                    <tr key={v._id} className="align-top hover:bg-slate-50/70">
                      <td className="px-6 py-4 text-sm font-medium text-slate-950">{v.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{v.phone}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{v.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{v.age}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{v.bloodType}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{getEventName(v.eventId)}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => void generateVolunteerCertificate(v.name, getEventName(v.eventId))}
                          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Generate Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="divide-y divide-slate-200 md:hidden">
              {volunteers.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">No volunteers registered yet.</p>
              ) : volunteers.map((v) => (
                <article key={v._id} className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Volunteer</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-950">{v.name}</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{v.phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void generateVolunteerCertificate(v.name, getEventName(v.eventId))}
                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Generate Certificate
                  </button>
                </article>
              ))}
            </div>
          </div>

        ) : activeTab === 'participants' ? (

          /* ── PARTICIPANTS TABLE ── */
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {['Name', 'Phone', 'Email', 'Age', 'Blood Group', 'Required Service', 'Event'].map((h) => (
                      <th key={h} className="px-6 py-4 text-sm font-semibold text-slate-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {participants.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">No patients registered yet.</td></tr>
                  ) : participants.map((p) => (
                    <tr key={p._id} className="align-top hover:bg-slate-50/70">
                      <td className="px-6 py-4 text-sm font-medium text-slate-950">{p.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.phone}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.age}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">{p.bloodGroup}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{p.requiredService}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{getEventName(p.eventId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-200 md:hidden">
              {participants.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">No patients registered yet.</p>
              ) : participants.map((p) => (
                <article key={p._id} className="space-y-3 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Patient</p>
                  <h2 className="font-semibold text-slate-950">{p.name}</h2>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">{p.bloodGroup}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{p.requiredService}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

        ) : activeTab === 'stories' ? (

          /* ── STORIES TAB ── */
          <div>
            <p className="mb-5 text-sm text-slate-500">
              Submitted community stories. <strong className="text-slate-800">Approve</strong> to make them live on the homepage, or <strong className="text-slate-800">Delete</strong> to remove them.
            </p>
            {storiesLoading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">Loading stories…</div>
            ) : stories.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                No stories submitted yet. Once someone submits from the website, they appear here.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((s) => (
                  <article
                    key={s._id}
                    className={`rounded-3xl border bg-white p-5 shadow-sm ${s.approved ? 'border-emerald-200' : 'border-amber-200'}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {s.approved ? '✦ Live' : '⏳ Pending'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </div>
                    <p className="line-clamp-4 text-sm leading-7 text-slate-700">"{s.quote}"</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7a81b]/15 text-sm font-bold text-[#f7a81b]">
                        {s.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.role} · {s.village}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {s.approved ? (
                        <button type="button" onClick={() => approveStory(s._id, false)}
                          className="flex-1 rounded-2xl border border-amber-200 bg-amber-50 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100">
                          Unpublish
                        </button>
                      ) : (
                        <button type="button" onClick={() => approveStory(s._id, true)}
                          className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                          ✓ Approve &amp; Publish
                        </button>
                      )}
                      <button type="button" onClick={() => deleteStory(s._id)}
                        className="flex-1 rounded-2xl border border-red-100 bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                        🗑 Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

        ) : activeTab === 'team' ? (

          /* ── TEAM MEMBERS TAB ── */
          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                All registered admin &amp; volunteer accounts. <strong className="text-slate-800">Approve</strong> volunteers to grant them access.
              </p>
              <a
                href="/admin/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#f7a81b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                + Add New Member
              </a>
            </div>

            {adminUsersLoading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">Loading team members…</div>
            ) : adminUsers.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                No registered users yet.{' '}
                <a href="/admin/register" className="font-semibold text-[#f7a81b] hover:underline">Register the first member →</a>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {adminUsers.map((u) => (
                  <article
                    key={u._id}
                    className={`rounded-3xl border bg-white p-5 shadow-sm ${u.approved ? 'border-slate-200' : 'border-amber-200'}`}
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                        u.role === 'admin' ? 'bg-[#f7a81b]/15 text-[#f7a81b]' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-950">{u.name}</p>
                        <p className="truncate text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          u.role === 'admin' ? 'bg-[#f7a81b]/15 text-[#f7a81b]' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? '🔐 Admin' : '🤝 Volunteer'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          u.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {u.approved ? '✦ Active' : '⏳ Pending'}
                        </span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</span>
                          <span className="text-sm text-slate-700">{u.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Joined</span>
                        <span className="text-xs text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      {u.approved ? (
                        <button type="button" onClick={() => approveAdminUser(u._id, false)}
                          className="flex-1 rounded-2xl border border-amber-200 bg-amber-50 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100">
                          Revoke Access
                        </button>
                      ) : (
                        <button type="button" onClick={() => approveAdminUser(u._id, true)}
                          className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                          ✓ Approve
                        </button>
                      )}
                      <button type="button" onClick={() => deleteAdminUser(u._id)}
                        className="flex-1 rounded-2xl border border-red-100 bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                        🗑 Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

        ) : null}
      </main>
    </div>
  );
}
