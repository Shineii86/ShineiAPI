'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Landing Nav — Frosted Glass                         ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconGithub, IconMenu, IconX } from '@/components/icons';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'nav-frosted-solid' : 'nav-frosted'}`}>
      <div className="max-w-containerWidth mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-display font-bold text-sm" style={{ borderRadius: 10 }}>
            水
          </div>
          <span className="text-lg font-bold font-display uppercase tracking-tight">ShineiAPI</span>
        </Link>
        <div className="hidden sm:flex items-center gap-1">
          <Link href="/docs" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Docs</Link>
          <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
            <IconGithub size={15} /> GitHub
          </a>
          <Link href="/docs" className="btn-brutal !py-2 !px-5 !text-xs ml-2">Get Started</Link>
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-surface-bright" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-1">
            <Link href="/docs" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-primary hover:bg-black/5 px-3 py-3 transition-all duration-200 min-h-[44px] flex items-center" style={{ borderRadius: 10 }}>Docs</Link>
            <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="block text-sm font-semibold text-primary hover:bg-black/5 px-3 py-3 transition-all duration-200 min-h-[44px] flex items-center" style={{ borderRadius: 10 }}>
              <IconGithub size={15} className="mr-2" /> GitHub
            </a>
            <Link href="/docs" onClick={() => setMobileOpen(false)} className="block btn-brutal !py-2.5 !px-5 !text-xs text-center mt-2">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
