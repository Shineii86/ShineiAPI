'use client';

import Link from 'next/link';
import { IconHeart } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-primary text-white" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-containerWidth mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent text-primary flex items-center justify-center font-bold text-sm" style={{ borderRadius: 8, fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", "SimSun", serif' }}>
              水
            </div>
            <span className="font-bold font-display uppercase tracking-tight text-accent">ShineiAPI</span>
            <span className="text-[10px] text-white/40 font-mono px-2 py-0.5" style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>v2.0.3</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">GitHub</a>
            <a href="https://github.com/Shineii86/ShineiAPI/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">License</a>
            <Link href="/terms" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">Terms</Link>
            <Link href="/privacy" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">Privacy</Link>
            <Link href="/support" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">Support</Link>
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
  );
}
