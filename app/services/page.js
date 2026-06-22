import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const services = [
  {
    title: 'Digital X-Ray Services',
    description: 'Subsidized quick and accurate bone/chest imaging.',
    image:
      '/xray.png',
  },
  {
    title: 'Erba EM 200',
    description:
      'Fully automated biochemistry analyzers for accurate blood reports.',
    image:
      '/machine 1.png',
  },
  {
    title: 'General OPD & Sonography',
    description: 'Streamlined registration for daily check-ups.',
    image:
      '/opd.png',
  },
  {
    title: 'Snibe MAGLUMI 600',
    description: 'A fully automated chemiluminescence immunoassay analyzer used to detect specialized biomarkers like hormones, thyroid levels, tumor markers, and infectious diseases.',
    image:
      '/machine 2.png',
  },
  {
    title: 'Erba H560',
    description: 'A fully automated, 5-part differential hematology analyzer used primarily to perform Complete Blood Count (CBC) tests by counting and identifying different types of blood cells.',
    image:
      '/machine 3.png',
  },
  {
    title: 'Medicines at Lowest Cost',
    description: 'Providing essential and discounted medicines to the community directly from our medical store.',
    image: '/medicines.jpeg',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7a81b]">
            Our Services
          </p>
          
          <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Rotary Connect supports accessible medical operations that reduce cost barriers and make reliable diagnostics available to more families.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[16/10] bg-slate-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">{service.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{service.description}</p>
                
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
