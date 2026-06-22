'use client';

import { useEffect, useMemo, useState } from 'react';

const AGE_OPTIONS = ['Under 18', '18-25', '25-35', '35-50', '50+'];
const BLOOD_TYPE_OPTIONS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  age: '',
  bloodType: '',
};

export default function RegistrationModal({ open, event, onClose }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setIsSubmitting(false);
      setFeedback({ type: '', message: '' });
    }
  }, [open]);

  const selectedEventTitle = useMemo(() => event?.title || 'this drive', [event]);

  if (!open) {
    return null;
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    if (!event?._id) {
      setFeedback({
        type: 'error',
        message: 'Please select a valid drive before registering.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventId: event._id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Unable to submit your registration');
      }

      setFeedback({
        type: 'success',
        message: 'Registration submitted successfully. Thank you for volunteering!',
      });
      setFormData(initialFormState);
    } catch (submitError) {
      setFeedback({
        type: 'error',
        message: submitError instanceof Error ? submitError.message : 'Unable to submit your registration',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center px-0 py-0 sm:items-center sm:px-4 sm:py-6">
      <button
        type="button"
        aria-label="Close registration modal"
        className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f7a81b]">
              Volunteer Registration
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950 sm:text-xl">Register for {selectedEventTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] space-y-5 overflow-y-auto px-4 py-4 sm:max-h-[85vh] sm:px-6 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Your full name"
              />
            </label>
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData((current) => ({ ...current, phone: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Mobile number"
              />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              placeholder="name@example.com"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Age Group</span>
              <select
                required
                value={formData.age}
                onChange={(e) => setFormData((current) => ({ ...current, age: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="">Select age group</option>
                {AGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Blood Type</span>
              <select
                required
                value={formData.bloodType}
                onChange={(e) => setFormData((current) => ({ ...current, bloodType: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="">Select blood type</option>
                {BLOOD_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {feedback.message ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                feedback.type === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#f7a81b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
