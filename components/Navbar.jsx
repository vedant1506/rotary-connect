'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Our Services', href: '/services' },
  { label: 'Past Events', href: '/past-events' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* Detect scroll to intensify the glass blur on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-3 z-50
          mx-auto w-[96%]
          rounded-full
          transition-all duration-500 ease-in-out
          ${scrolled
            ? 'shadow-2xl shadow-slate-900/15'
            : 'shadow-lg shadow-slate-900/8'}
        `}
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(241,245,249,0.95) 50%, rgba(226,232,240,0.93) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.90) 50%, rgba(241,245,249,0.88) 100%)',
          border: scrolled
            ? '1.5px solid rgba(203,213,225,0.80)'
            : '1.5px solid rgba(226,232,240,0.70)',
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
      >

        <div className="flex w-full items-center justify-between px-6 py-3 sm:px-8">
          {/* ── Logo ── */}
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-[#f7a81b]/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              <Image
                src="/logo.jpeg"
                alt="Rotary Connect Logo"
                width={42}
                height={42}
                className="relative h-10 w-10 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-[0.16em] text-[#f7a81b] uppercase drop-shadow-sm">
                Rotary Club Visnagar
              </p>
              <p className="text-[11px] font-medium text-slate-500">Community health network</p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200
                    ${isActive
                      ? 'bg-[#f7a81b] text-white shadow-md shadow-[#f7a81b]/30'
                      : 'text-slate-600 hover:bg-[#f7a81b]/10 hover:text-[#f7a81b]'}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Admin CTA */}
            <Link
              href="/admin/login"
              className={`
                ml-2 rounded-full px-5 py-2 text-sm font-semibold
                border transition-all duration-200
                ${pathname === '/admin/login'
                  ? 'border-[#f7a81b] bg-[#f7a81b] text-white shadow-md shadow-[#f7a81b]/30'
                  : 'border-slate-300 bg-white/70 text-slate-700 hover:border-[#f7a81b] hover:bg-[#f7a81b] hover:text-white hover:shadow-md hover:shadow-[#f7a81b]/25'}
              `}
            >
              Admin Login
            </Link>
          </nav>

          {/* ── Mobile Hamburger ── */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="
              md:hidden
              inline-flex h-10 w-10 items-center justify-center
              rounded-full border border-white/40 bg-white/30
              text-slate-700 backdrop-blur-sm
              shadow-sm transition-all duration-200
              hover:bg-white/60 hover:text-slate-950
            "
          >
            <span className="flex flex-col items-center gap-[5px]" aria-hidden="true">
              <span
                className={`h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? 'scale-x-0 opacity-0' : ''
                }`}
              />
              <span
                className={`h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {/* ── Mobile Menu Dropdown (Frosted pill — appears below) ── */}
        {menuOpen && (
          <div
            className="absolute inset-x-0 top-[calc(100%+8px)] mx-2 overflow-hidden rounded-3xl md:hidden"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(24px) saturate(200%)',
              border: '1.5px solid rgba(226,232,240,0.90)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            }}
          >
            <nav className="flex flex-col gap-1 px-3 py-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200
                      ${isActive
                        ? 'bg-[#f7a81b] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-[#f7a81b]/10 hover:text-[#f7a81b]'}
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className={`
                  mt-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200
                  ${pathname === '/admin/login'
                    ? 'border-[#f7a81b] bg-[#f7a81b] text-white'
                    : 'border-[#f7a81b]/40 bg-[#f7a81b]/8 text-[#f7a81b] hover:bg-[#f7a81b] hover:text-white'}
                `}
              >
                Admin Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer so page content starts below the floating pill */}
      <div className="h-[72px]" />
    </>
  );
}
