'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Docs Layout — Frosted Glass Sidebar                 ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconSearch, IconBook, IconList, IconShuffle, IconTrophy,
  IconCalendar, IconTag, IconClock, IconDatabase,
  IconAlertTriangle, IconHelpCircle, IconGlobe, IconFileText,
  IconArrowRight, IconGithub, IconStarFilled, IconMenu, IconX,
  IconCode,
} from '@/components/icons';
import DocsSearch from '@/components/DocsSearch';

const navSections = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction',    href: '/docs',                  icon: IconArrowRight },
      { label: 'API Playground',  href: '/docs#try-it',           icon: IconCode },
      { label: 'Base URL',        href: '/docs#base-url',         icon: IconGlobe },
      { label: 'Response Format', href: '/docs#response-format',  icon: IconFileText },
    ],
  },
  {
    title: 'Endpoints',
    items: [
      { label: 'Browse Series',   href: '/docs#browse',           icon: IconList },
      { label: 'Series Detail',   href: '/docs#series',           icon: IconBook },
      { label: 'Chapter List',    href: '/docs#chapters',         icon: IconList },
      { label: 'Search',          href: '/docs#search',           icon: IconSearch },
      { label: 'Popular and Trending', href: '/docs#popular',     icon: IconTrophy },
      { label: 'Random Series',   href: '/docs#random',           icon: IconShuffle },
      { label: 'Top Rated',       href: '/docs#top',              icon: IconTrophy },
      { label: 'Schedule',        href: '/docs#schedule',         icon: IconCalendar },
      { label: 'Genres',          href: '/docs#genres',           icon: IconTag },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'Rate Limiting',   href: '/docs#rate-limiting',    icon: IconClock },
      { label: 'Caching',         href: '/docs#caching',          icon: IconDatabase },
      { label: 'Error Codes',     href: '/docs#errors',           icon: IconAlertTriangle },
      { label: 'Health Check',    href: '/docs#health',           icon: IconHelpCircle },
      { label: 'API Stats',       href: '/docs#stats',            icon: IconDatabase },
      { label: 'FAQ',             href: '/docs#faq',              icon: IconHelpCircle },
    ],
  },
];

/* ─── Active Section Tracker ─── */

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const ids = navSections.flatMap(s => s.items.map(i => i.href.split('#')[1])).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function DocsLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* ═══ Top Nav — Frosted Glass ═══ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'nav-frosted-solid' : 'nav-frosted'}`}>
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-bold text-sm" style={{ borderRadius: 10, fontFamily: 'var(--font-jp), "Hiragino Sans", "Noto Sans CJK JP", sans-serif' }}>
              水
            </div>
            <span className="text-lg font-bold font-display uppercase tracking-tight">ShineiAPI</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <DocsSearch />
            <Link href="/docs" className="text-sm font-semibold text-primary bg-accent/80 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Documentation</Link>
            <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
              <IconGithub size={15} /> GitHub
            </a>
            <Link href="/" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>
              Home
            </Link>
          </div>
          <button
            className="sm:hidden p-2 text-primary hover:bg-black/5 transition-all duration-200"
            style={{ borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.1)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* ═══ Mobile Overlay ═══ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ═══ Mobile Sidebar ═══ */}
      <aside className={`fixed top-0 left-0 z-50 w-72 h-full bg-surface-bright p-6 pt-20 transition-transform duration-300 ease-out sm:hidden overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ borderRight: '1px solid rgba(0,0,0,0.06)', boxShadow: '4px 0 24px rgba(0,0,0,0.08)' }}>
        <nav className="space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3 px-3">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.href.split('#')[1];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`sidebar-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={16} className={isActive ? 'text-primary' : 'text-gray-400'} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ═══ Desktop Sidebar + Content + Footer ═══ */}
      <div className="pt-20 flex">
        {/* ═══ Desktop Sidebar ═══ */}
        <aside className="fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] overflow-y-auto p-5 hidden lg:block bg-surface-bright/50"
          style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}>
          <nav className="space-y-7">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3 px-3">{section.title}</p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.href.split('#')[1];
                    return (
                      <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                        <Icon size={15} className={isActive ? 'text-primary' : 'text-gray-400'} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-10 p-4 bg-accent/15" style={{ borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
            <p className="text-xs font-bold uppercase mb-1.5">Need Help?</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Open an issue on{' '}
              <a href="https://github.com/Shineii86/ShineiAPI/issues" target="_blank" rel="noopener noreferrer" className="text-tertiary font-semibold hover:underline">
                GitHub
              </a>{' '}
              or check the FAQ below.
            </p>
          </div>

          <div className="mt-4 px-3">
            <span className="text-[10px] text-gray-400 font-mono">v2.0.1</span>
          </div>
        </aside>

        {/* ═══ Shared container: Main Content + Footer ═══ */}
        <div className="flex-1 lg:ml-64 max-w-containerWidth mx-auto w-full">
          {/* ═══ Main Content ═══ */}
          <main className="p-4 sm:p-6 md:p-10">
            {children}
          </main>

          {/* ═══ Footer ═══ */}
          <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-primary text-white" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent text-primary flex items-center justify-center font-bold text-sm" style={{ borderRadius: 8, fontFamily: 'var(--font-jp), "Hiragino Sans", "Noto Sans CJK JP", sans-serif' }}>
                  水
                </div>
                <span className="font-bold font-display uppercase tracking-tight text-accent">ShineiAPI</span>
                <span className="text-[10px] text-white/40 font-mono px-2 py-0.5" style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>v2.0.1</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <Link href="/docs" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Documentation</Link>
                <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">GitHub</a>
                <Link href="/" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Home</Link>
              </div>
              <p className="text-sm text-white/40">
                Built by <a href="https://github.com/Shineii86" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">Shinei Nouzen</a>
              </p>
            </div>
            <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs text-white/30">Data provided by <a href="https://toraka.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors">Toraka</a>. ShineiAPI is not affiliated with or endorsed by Toraka.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
