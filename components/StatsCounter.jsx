'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500, suffix: '+', label: 'Patients Served', icon: '🏥' },
  { value: 32,  suffix: '+', label: 'Drives Completed', icon: '🗓️' },
  { value: 120, suffix: '+', label: 'Active Volunteers', icon: '🤝' },
  { value: 8,   suffix: '',  label: 'Villages Covered', icon: '🌿' },
];

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function StatCard({ value, suffix, label, icon, active }) {
  const count = useCountUp(value, 1800, active);
  return (
    <div className="group flex flex-col items-center gap-3 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f7a81b]/30 hover:shadow-lg sm:p-8">
      <span className="text-4xl">{icon}</span>
      <p className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
        {count}
        <span className="text-[#f7a81b]">{suffix}</span>
      </p>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">
          Our Impact
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Numbers that speak for themselves
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
          Every drive, every volunteer, every patient — together building a healthier Visnagar.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} active={active} />
        ))}
      </div>

      {/* Bottom accent bar */}
      <div className="mt-12 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="rounded-full bg-[#f7a81b]/10 px-4 py-1.5 text-xs font-semibold text-[#f7a81b]">
            Since 1948 · Rotary Club Visnagar · Serving North Gujarat for 76+ Years
          </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </section>
  );
}
