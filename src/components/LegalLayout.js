'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Legal Layout — Shared nav + footer for ToS/Privacy  ║
 * ╚══════════════════════════════════════════════════════╝
 */

import Link from 'next/link';
import { IconGithub, IconHeart } from '@/components/icons';

export default function LegalLayout({ children }) {
  return (
    <main className="min-h-screen bg-surface">
      {/* ═══ Header — Frosted Glass ═══ */}
      <nav className="fixed top-0 w-full z-50 nav-frosted-solid">
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-bold text-sm" style={{ borderRadius: 10, fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", "SimSun", serif' }}>
              水
            </div>
            <span className="text-lg font-bold font-display uppercase tracking-tight">ShineiAPI</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/docs" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>
              Docs
            </Link>
            <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
              <IconGithub size={15} /> GitHub
            </a>
            <Link href="/" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Content ═══ */}
      <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto">
          {children}
        </div>
      </div>

      {/* ═══ Footer ═══ */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-primary text-white" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent text-primary flex items-center justify-center font-bold text-sm" style={{ borderRadius: 8, fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", "SimSun", serif' }}>
                水
              </div>
              <span className="font-bold font-display uppercase tracking-tight text-accent">ShineiAPI</span>
              <span className="text-[10px] text-white/40 font-mono px-2 py-0.5" style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>v2.0.2</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">GitHub</a>
              <a href="https://github.com/Shineii86/ShineiAPI/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">License</a>
              <Link href="/terms" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Terms</Link>
              <Link href="/privacy" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Privacy</Link>
              <Link href="/support" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Support</Link>
            </div>
            <p className="text-sm text-white/40">
              Built with <IconHeart size={14} className="heartbeat" /> by <a href="https://github.com/Shineii86" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">Shinei Nouzen</a>
            </p>
          </div>
          <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/30">Data provided by <a href="https://toraka.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors">Toraka</a>. ShineiAPI is not affiliated with or endorsed by Toraka.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
