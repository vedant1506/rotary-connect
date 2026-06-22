import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us – Rotary Club Visnagar',
  description:
    'Get in touch with Rotary Club Visnagar. Find our address, email, phone, and social media links.',
};

const CONTACTS = [
  {
    label: 'Email',
    value: 'rotaryvisnagar@gmail.com',
    href: 'mailto:rotaryvisnagar@gmail.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Address',
    value: 'Rotary Bhavan, Station Road, Visnagar – 384315, Gujarat',
    href: 'https://maps.google.com/?q=Visnagar,Gujarat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const SOCIAL = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    color: 'hover:bg-blue-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    color: 'hover:bg-pink-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    color: 'hover:bg-red-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/919876543210',
    color: 'hover:bg-green-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* ── Hero banner ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f7a81b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f7a81b 0%, transparent 40%)' }} />
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-sm font-semibold text-[#f7a81b]">
              GET IN TOUCH
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-300 leading-7">
              Have a question, want to volunteer, or need medical assistance? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Left — Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Reach out directly</h2>

              {CONTACTS.map(c => (
                <a key={c.label} href={c.href}
                  target={c.label === 'Address' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#f7a81b]/40 hover:shadow-md">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#f7a81b]">
                    {c.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{c.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">{c.value}</p>
                  </div>
                </a>
              ))}

              {/* Social */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Follow Us</p>
                <div className="mt-3 flex gap-3">
                  {SOCIAL.map(s => (
                    <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:text-white ${s.color}`}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Office Hours</p>
                <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                  <div className="flex justify-between"><span>Monday – Friday</span><span className="font-medium">9:00 AM – 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-medium">9:00 AM – 1:00 PM</span></div>
                  <div className="flex justify-between text-slate-400"><span>Sunday</span><span>Closed</span></div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>
              <p className="mt-1 text-sm text-slate-500">We usually respond within 24 hours.</p>
              <form className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500">Full Name</span>
                    <input id="contact-name" type="text" required placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500">Phone</span>
                    <input id="contact-phone" type="tel" placeholder="Mobile number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20" />
                  </label>
                </div>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500">Email</span>
                  <input id="contact-email" type="email" required placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20" />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500">Subject</span>
                  <select id="contact-subject"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20">
                    <option value="">Select a topic</option>
                    <option>Volunteer Enquiry</option>
                    <option>Patient Services</option>
                    <option>Event Information</option>
                    <option>General Enquiry</option>
                    <option>Feedback / Suggestion</option>
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500">Message</span>
                  <textarea id="contact-message" required rows={5} placeholder="Write your message here…"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#f7a81b] focus:bg-white focus:ring-2 focus:ring-[#f7a81b]/20" />
                </label>
                <button type="submit" id="contact-submit"
                  className="w-full rounded-full bg-[#f7a81b] py-3 text-sm font-semibold text-black transition hover:bg-amber-600 hover:text-white">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <iframe
              title="Rotary Club Visnagar Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14665.4!2d72.5393!3d23.6980!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c4a8e!2sVisnagar%2C+Gujarat+384315!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="300"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
