import fs from 'fs';
import path from 'path';
import Navbar from '../../components/Navbar';

export default function PastEventsPage() {
  const dataPath = path.join(process.cwd(), 'data', 'past-events.json');
  let events = [];
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    events = JSON.parse(raw);
  } catch (err) {
    events = [];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">Our Impact</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Past Events & Initiatives
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Explore the community activities, health drives, and welfare initiatives organized by Rotary Club of Visnagar. Each event represents our commitment to serving and supporting those in need.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            <p className="text-lg">No past events found.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 w-fit border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-[#f7a81b]" />
              <p className="text-sm font-medium text-emerald-800">{events.length} events showcased</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((ev, idx) => (
                <article
                  key={idx}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={ev.imageUrl || '/rotary-front.jpeg'}
                      alt={ev.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 p-5 sm:p-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">{ev.title}</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        {ev.date || 'Date not specified'} {ev.location ? `• ${ev.location}` : ''}
                      </p>
                    </div>
                    <p className="text-sm leading-7 text-slate-600 line-clamp-4">{ev.description}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-emerald-700">Community Impact</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
